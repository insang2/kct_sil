-- Phase 4: B2B 회원 시스템 및 견적서 기능

-- 1. B2B 회사 프로필 (auth.users 확장)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  company_name text,
  business_reg_number text,
  contact_person text,
  phone text,
  tier text not null default 'standard',
  is_verified boolean not null default false,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- 2. 제품 목록
create table if not exists products (
  id serial primary key,
  brand text not null,
  sku text unique,
  name_ko text not null,
  name_en text,
  list_price numeric not null default 0,
  price_standard numeric,
  price_silver numeric,
  price_gold numeric,
  price_platinum numeric,
  unit text not null default '개',
  is_active boolean not null default true,
  sort_order int default 0
);

-- 제품은 모두 읽기 가능
alter table products enable row level security;

create policy "products are publicly readable"
  on products for select
  using (true);

-- 3. 견적서
create table if not exists quotes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  quote_number text unique,
  customer_company text,
  customer_name text,
  customer_email text,
  customer_phone text,
  items jsonb not null default '[]',
  subtotal numeric not null default 0,
  tax numeric not null default 0,
  total numeric not null default 0,
  notes text,
  status text not null default 'draft',
  created_at timestamptz not null default now()
);

alter table quotes enable row level security;

create policy "users can manage own quotes"
  on quotes for all
  using (auth.uid() = user_id);

-- 4. DOWSIL 초기 제품 데이터
insert into products (brand, sku, name_ko, name_en, list_price, price_standard, price_silver, price_gold, price_platinum, unit, sort_order) values
  ('DOWSIL', '790',     'DOWSIL™ 790 저모듈러스 실란트',        'DOWSIL™ 790 Low Modulus Sealant',          18000, 16200, 17100, 16200, 15300, '개', 1),
  ('DOWSIL', '791',     'DOWSIL™ 791 커튼월 내후성 실란트',      'DOWSIL™ 791 Weathersealing Sealant',       20000, 18000, 19000, 18000, 17000, '개', 2),
  ('DOWSIL', '795',     'DOWSIL™ 795 다목적 구조용 실란트',      'DOWSIL™ 795 Structural Sealant',           22000, 19800, 20900, 19800, 18700, '개', 3),
  ('DOWSIL', '995',     'DOWSIL™ 995 고장력 구조용 실란트',      'DOWSIL™ 995 High-strength Structural',     25000, 22500, 23750, 22500, 21250, '개', 4),
  ('DOWSIL', '756-SMS', 'DOWSIL™ 756 SMS 오염방지형',           'DOWSIL™ 756 SMS Non-staining',             24000, 21600, 22800, 21600, 20400, '개', 5),
  ('DOWSIL', '786',     'DOWSIL™ 786 욕실·주방용',              'DOWSIL™ 786 Sanitary Sealant',             12000, 10800, 11400, 10800, 10200, '개', 6),
  ('DOWSIL', '732',     'DOWSIL™ 732 다목적 접착 실란트',        'DOWSIL™ 732 Multi-purpose Sealant',        14000, 12600, 13300, 12600, 11900, '개', 7),
  ('DOWSIL', '977',     'DOWSIL™ 977 소시지형',                 'DOWSIL™ 977 Sausage Pack',                 16000, 14400, 15200, 14400, 13600, '소세지', 8),
  ('DOWSIL', '991',     'DOWSIL™ 991 소시지형',                 'DOWSIL™ 991 Sausage Pack',                 18000, 16200, 17100, 16200, 15300, '소세지', 9),
  ('DOWSIL', '983',     'DOWSIL™ 983 2액형 구조용 실란트',      'DOWSIL™ 983 Two-part Structural',          32000, 28800, 30400, 28800, 27200, 'set', 10),
  ('DOWSIL', '121',     'DOWSIL™ 121 현장 보수용',              'DOWSIL™ 121 Field Repair Sealant',         15000, 13500, 14250, 13500, 12750, '개', 11)
on conflict (sku) do nothing;
