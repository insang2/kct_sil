-- TDS 게이팅: 회원 승인 상태 + TDS 전송 요청 + 다운로드 로그
-- 원칙: 신규 테이블은 RLS 로 직접 접근 전면 차단, 접근은 security definer RPC 로만.
-- 관리자 RPC 는 기존 admin_verify_session(p_token) 으로 세션 검증(반환: 관리자 username 또는 null).

-- ───────── 1. profiles 확장 ─────────
alter table profiles
  add column if not exists status text not null default 'pending'
    check (status in ('pending','approved','suspended','rejected')),
  add column if not exists approved_at timestamptz,
  add column if not exists approved_by text,
  add column if not exists admin_note text;

update profiles set status = 'approved', approved_at = coalesce(approved_at, now())
 where is_verified = true and status = 'pending';

-- 사용자가 자기 status/tier/is_verified 등을 바꾸지 못하게 방어.
-- 기존 정책('users can insert/update own profile')은 컬럼 제한이 없어 가입 시 status='approved' 삽입, tier 상향이 가능했음.
-- security definer RPC(소유자 롤)·기존 관리자(insang2@gmail.com 세션)·서비스 롤은 영향 없음.
create or replace function profiles_guard_protected_columns() returns trigger
language plpgsql as $$
begin
  if current_user in ('anon','authenticated')
     and coalesce(auth.jwt() ->> 'email','') <> 'insang2@gmail.com' then
    if tg_op = 'INSERT' then
      new.status := 'pending'; new.is_verified := false; new.tier := 'standard';
      new.approved_at := null; new.approved_by := null; new.admin_note := null;
    else
      new.status := old.status; new.is_verified := old.is_verified; new.tier := old.tier;
      new.approved_at := old.approved_at; new.approved_by := old.approved_by; new.admin_note := old.admin_note;
    end if;
  end if;
  return new;
end $$;

drop trigger if exists profiles_guard_protected_columns on profiles;
create trigger profiles_guard_protected_columns
  before insert or update on profiles
  for each row execute function profiles_guard_protected_columns();

-- ───────── 2. 신규 테이블 (직접 접근 차단) ─────────
create table if not exists tds_requests (
  id uuid primary key default gen_random_uuid(),
  product_slug text not null,
  name text not null,
  company text,
  email text not null,
  phone text,
  message text,
  user_id uuid references auth.users on delete set null,
  status text not null default 'pending' check (status in ('pending','sent','rejected')),
  created_at timestamptz not null default now(),
  processed_by text,
  processed_at timestamptz,
  admin_note text,
  token_hash text,
  link_expires_at timestamptz,
  download_count int not null default 0,
  max_downloads int not null default 5,
  consent_at timestamptz not null,
  ip_hash text
);
create unique index if not exists tds_requests_token_hash_key on tds_requests (token_hash) where token_hash is not null;
create index if not exists tds_requests_status_created on tds_requests (status, created_at desc);
create index if not exists tds_requests_email_created on tds_requests (lower(email), created_at desc);
create index if not exists tds_requests_ip_created on tds_requests (ip_hash, created_at desc);

create table if not exists tds_downloads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  request_id uuid references tds_requests on delete set null,
  product_slug text not null,
  at timestamptz not null default now(),
  ip_hash text
);
create index if not exists tds_downloads_user_at on tds_downloads (user_id, at desc);

alter table tds_requests enable row level security;
alter table tds_downloads enable row level security;
revoke all on tds_requests, tds_downloads from anon, authenticated;
-- 정책을 일부러 만들지 않는다(= 전면 거부). 접근은 아래 RPC 만.

-- ───────── 3. 공개 RPC ─────────
-- 반환값은 라우트 내부용: 'ok' | 'rate_limited' | 'invalid'. 중복/제한이어도 라우트는 항상 동일 응답을 낸다.
create or replace function tds_request_create(
  p_slug text, p_name text, p_company text, p_email text, p_phone text, p_message text,
  p_consent boolean, p_ip_hash text
) returns text
language plpgsql security definer set search_path = public as $$
declare v_email text := lower(btrim(coalesce(p_email,'')));
begin
  if p_consent is not true
     or p_slug !~ '^[a-z0-9][a-z0-9-]{0,79}$'
     or length(btrim(coalesce(p_name,''))) not between 1 and 60
     or length(coalesce(p_company,'')) > 100
     or length(coalesce(p_phone,'')) > 30
     or length(coalesce(p_message,'')) > 1000
     or length(v_email) > 254
     or v_email !~ '^[^@\s<>]+@[^@\s<>]+\.[^@\s<>]+$' then
    return 'invalid';
  end if;

  -- 속도 제한: 이메일 3건/24h, ip_hash 10건/1h, 전체 300건/1h
  if (select count(*) from tds_requests where lower(email) = v_email and created_at > now() - interval '24 hours') >= 3
     or (p_ip_hash is not null and (select count(*) from tds_requests where ip_hash = p_ip_hash and created_at > now() - interval '1 hour') >= 10)
     or (select count(*) from tds_requests where created_at > now() - interval '1 hour') >= 300 then
    return 'rate_limited';
  end if;

  -- 같은 이메일·제품의 대기 중 요청이 있으면 중복 생성하지 않음
  if exists (select 1 from tds_requests where lower(email) = v_email and product_slug = p_slug and status = 'pending') then
    return 'ok';
  end if;

  insert into tds_requests (product_slug, name, company, email, phone, message, user_id, consent_at, ip_hash)
  values (p_slug, btrim(p_name), nullif(btrim(coalesce(p_company,'')),''), v_email,
          nullif(btrim(coalesce(p_phone,'')),''), nullif(btrim(coalesce(p_message,'')),''),
          auth.uid(), now(), p_ip_hash);
  return 'ok';
end $$;

-- 토큰 소비: 유효하면 횟수 +1, 로그 기록 후 slug 반환. 무효/만료/소진이면 null.
create or replace function tds_token_consume(p_token_hash text, p_ip_hash text) returns text
language plpgsql security definer set search_path = public as $$
declare v_id uuid; v_slug text;
begin
  if p_token_hash is null or p_token_hash !~ '^[0-9a-f]{64}$' then return null; end if;
  update tds_requests
     set download_count = download_count + 1
   where token_hash = p_token_hash and status = 'sent'
     and link_expires_at > now() and download_count < max_downloads
  returning id, product_slug into v_id, v_slug;
  if v_id is null then return null; end if;
  insert into tds_downloads (request_id, product_slug, ip_hash) values (v_id, v_slug, p_ip_hash);
  return v_slug;
end $$;

-- 로그인 회원 다운로드: 승인 회원이면 로그 기록 후 true. (로그인 안 했거나 미승인이면 false)
create or replace function tds_log_download(p_slug text, p_ip_hash text) returns boolean
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null
     or not exists (select 1 from profiles where id = auth.uid() and status = 'approved') then
    return false;
  end if;
  insert into tds_downloads (user_id, product_slug, ip_hash) values (auth.uid(), p_slug, p_ip_hash);
  return true;
end $$;

-- ───────── 4. 관리자 RPC (모두 p_token 검증) ─────────
create or replace function admin_list_members(p_token text, p_status text default null, p_q text default null) returns jsonb
language plpgsql security definer set search_path = public as $$
begin
  if admin_verify_session(p_token) is null then raise exception 'unauthorized'; end if;
  return coalesce((select jsonb_agg(to_jsonb(m) order by m.created_at desc) from (
    select p.id, u.email, p.company_name, p.business_reg_number, p.contact_person, p.phone, p.tier, p.status,
           p.created_at, p.approved_at, p.approved_by, p.admin_note,
           (select count(*) from tds_downloads d where d.user_id = p.id)::int as download_count,
           (select max(d.at) from tds_downloads d where d.user_id = p.id) as last_download_at
      from profiles p left join auth.users u on u.id = p.id
     where (p_status is null or p.status = p_status)
       and (p_q is null or p_q = '' or strpos(lower(concat_ws(' ', u.email, p.company_name, p.contact_person, p.phone, p.business_reg_number)), lower(p_q)) > 0)
     order by p.created_at desc limit 500) m), '[]'::jsonb);
end $$;

create or replace function admin_set_member_status(p_token text, p_user_id uuid, p_status text, p_note text default null) returns boolean
language plpgsql security definer set search_path = public as $$
declare v_admin text := admin_verify_session(p_token);
begin
  if v_admin is null then raise exception 'unauthorized'; end if;
  if p_status not in ('pending','approved','suspended','rejected') then return false; end if;
  update profiles set
    status = p_status,
    is_verified = (p_status = 'approved'),
    approved_at = case when p_status = 'approved' then now() else approved_at end,
    approved_by = case when p_status = 'approved' then v_admin else approved_by end,
    admin_note = coalesce(left(p_note, 500), admin_note)
  where id = p_user_id;
  return found;
end $$;

create or replace function admin_set_member_tier(p_token text, p_user_id uuid, p_tier text) returns boolean
language plpgsql security definer set search_path = public as $$
begin
  if admin_verify_session(p_token) is null then raise exception 'unauthorized'; end if;
  if p_tier not in ('standard','silver','gold','platinum') then return false; end if;
  update profiles set tier = p_tier where id = p_user_id;
  return found;
end $$;

create or replace function admin_list_tds_requests(p_token text, p_status text default null) returns jsonb
language plpgsql security definer set search_path = public as $$
begin
  if admin_verify_session(p_token) is null then raise exception 'unauthorized'; end if;
  return coalesce((select jsonb_agg(to_jsonb(r) order by r.created_at desc) from (
    select id, product_slug, name, company, email, phone, message, user_id, status, created_at,
           processed_by, processed_at, admin_note, link_expires_at, download_count, consent_at
      from tds_requests
     where (p_status is null or status = p_status)
     order by created_at desc limit 500) r), '[]'::jsonb);
end $$;

-- 승인: 새 토큰 해시/만료 저장(pending·sent 재발급 가능). 반려: pending 만. 반환: 요청자 정보(메일 발송용) 또는 null.
create or replace function admin_process_tds_request(
  p_token text, p_id uuid, p_action text, p_note text default null,
  p_token_hash text default null, p_expires timestamptz default null, p_max int default 5
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_admin text := admin_verify_session(p_token); v_row tds_requests;
begin
  if v_admin is null then raise exception 'unauthorized'; end if;
  if p_action = 'approve' then
    if p_token_hash is null or p_token_hash !~ '^[0-9a-f]{64}$' or p_expires is null or p_expires <= now()
       or p_max not between 1 and 20 then return null; end if;
    update tds_requests set status = 'sent', token_hash = p_token_hash, link_expires_at = p_expires,
           max_downloads = p_max, download_count = 0, processed_by = v_admin, processed_at = now(),
           admin_note = coalesce(left(p_note, 500), admin_note)
     where id = p_id and status in ('pending','sent') returning * into v_row;
  elsif p_action = 'reject' then
    update tds_requests set status = 'rejected', token_hash = null, processed_by = v_admin, processed_at = now(),
           admin_note = coalesce(left(p_note, 500), admin_note)
     where id = p_id and status = 'pending' returning * into v_row;
  else
    return null;
  end if;
  if v_row.id is null then return null; end if;
  return jsonb_build_object('email', v_row.email, 'name', v_row.name, 'product_slug', v_row.product_slug);
end $$;

create or replace function admin_pending_counts(p_token text) returns jsonb
language plpgsql security definer set search_path = public as $$
begin
  if admin_verify_session(p_token) is null then raise exception 'unauthorized'; end if;
  return jsonb_build_object(
    'members', (select count(*) from profiles where status = 'pending'),
    'tds_requests', (select count(*) from tds_requests where status = 'pending'));
end $$;

create or replace function admin_member_downloads(p_token text, p_user_id uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
begin
  if admin_verify_session(p_token) is null then raise exception 'unauthorized'; end if;
  return coalesce((select jsonb_agg(jsonb_build_object('slug', x.product_slug, 'at', x.at) order by x.at desc) from (
    select product_slug, at from tds_downloads where user_id = p_user_id order by at desc limit 200) x), '[]'::jsonb);
end $$;

-- ───────── 5. 실행 권한 ─────────
revoke execute on function
  tds_request_create(text,text,text,text,text,text,boolean,text), tds_token_consume(text,text), tds_log_download(text,text),
  admin_list_members(text,text,text), admin_set_member_status(text,uuid,text,text), admin_set_member_tier(text,uuid,text),
  admin_list_tds_requests(text,text), admin_process_tds_request(text,uuid,text,text,text,timestamptz,int),
  admin_pending_counts(text), admin_member_downloads(text,uuid)
  from public;
grant execute on function
  tds_request_create(text,text,text,text,text,text,boolean,text), tds_token_consume(text,text),
  admin_list_members(text,text,text), admin_set_member_status(text,uuid,text,text), admin_set_member_tier(text,uuid,text),
  admin_list_tds_requests(text,text), admin_process_tds_request(text,uuid,text,text,text,timestamptz,int),
  admin_pending_counts(text), admin_member_downloads(text,uuid)
  to anon, authenticated;
grant execute on function tds_log_download(text,text) to authenticated;
