import { anonDb, TDS_LINK_TTL_MS, TDS_MAX_DOWNLOADS, escapeHtml, generateToken, productName, sha256Hex, siteUrl } from './tds-server'
import { sendMail } from './mail'
// TDS 요청·회원 승인 관리자 API 계약. 구현은 WK1(백엔드)이 이 파일 본문을 채우고, 관리자 UI(WK2)는 이 시그니처만 사용한다.
// 모든 함수는 관리자 세션 토큰(ADMIN_COOKIE 값)을 받아 서버에서 검증한다. 서버 전용(클라이언트 import 금지).
export type MemberStatus = 'pending' | 'approved' | 'suspended' | 'rejected'
export type TdsRequestStatus = 'pending' | 'sent' | 'rejected'

export interface Member {
  id: string; email: string | null; company_name: string | null; business_reg_number: string | null
  contact_person: string | null; phone: string | null; tier: string; status: MemberStatus
  created_at: string; approved_at: string | null; approved_by: string | null; admin_note: string | null
  download_count: number; last_download_at: string | null
}
export interface TdsRequest {
  id: string; product_slug: string; name: string; company: string | null; email: string; phone: string | null
  message: string | null; user_id: string | null; status: TdsRequestStatus; created_at: string
  processed_by: string | null; processed_at: string | null; admin_note: string | null
  link_expires_at: string | null; download_count: number; consent_at: string
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const STATUSES = ['pending', 'approved', 'suspended', 'rejected']

// 모든 RPC 는 p_token 으로 DB 에서 관리자 세션을 검증한다(실패 시 'unauthorized' 예외).
async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  const { data, error } = await anonDb().rpc(fn, args)
  if (error) throw new Error(`tds-admin: ${fn} failed`)
  return data as T
}
const safe = async (f: () => Promise<boolean>) => { try { return await f() } catch { return false } }

export async function listMembers(token: string, f: { status?: MemberStatus; q?: string } = {}): Promise<Member[]> {
  return rpc<Member[]>('admin_list_members', {
    p_token: token, p_status: f.status && STATUSES.includes(f.status) ? f.status : null, p_q: f.q?.slice(0, 100) || null,
  })
}
export const setMemberStatus = (token: string, userId: string, status: MemberStatus, note?: string) =>
  safe(async () => UUID.test(userId) && STATUSES.includes(status) &&
    (await rpc<boolean>('admin_set_member_status', { p_token: token, p_user_id: userId, p_status: status, p_note: note ?? null })) === true)
export const setMemberTier = (token: string, userId: string, tier: string) =>
  safe(async () => UUID.test(userId) && (await rpc<boolean>('admin_set_member_tier', { p_token: token, p_user_id: userId, p_tier: tier })) === true)
export async function getMemberDownloads(token: string, userId: string): Promise<{ slug: string; at: string }[]> {
  if (!UUID.test(userId)) return []
  return rpc('admin_member_downloads', { p_token: token, p_user_id: userId })
}
export async function listTdsRequests(token: string, f: { status?: TdsRequestStatus } = {}): Promise<TdsRequest[]> {
  return rpc<TdsRequest[]>('admin_list_tds_requests', { p_token: token, p_status: f.status ?? null })
}

/** 승인: 1회성 다운로드 링크 생성 후 요청자에게 메일 발송. 메일 미설정이면 emailed=false 와 link 를 돌려줘 관리자가 직접 전달 */
export async function approveTdsRequest(token: string, id: string, note?: string): Promise<{ ok: boolean; emailed: boolean; link?: string; error?: string }> {
  if (!UUID.test(id)) return { ok: false, emailed: false, error: '잘못된 요청입니다.' }
  const t = generateToken()
  const expires = new Date(Date.now() + TDS_LINK_TTL_MS)
  let r: { email: string; name: string; product_slug: string } | null
  try {
    r = await rpc('admin_process_tds_request', {
      p_token: token, p_id: id, p_action: 'approve', p_note: note ?? null,
      p_token_hash: await sha256Hex(t), p_expires: expires.toISOString(), p_max: TDS_MAX_DOWNLOADS,
    })
  } catch { return { ok: false, emailed: false, error: '처리하지 못했습니다. 관리자 세션을 확인해 주세요.' } }
  if (!r) return { ok: false, emailed: false, error: '이미 처리되었거나 존재하지 않는 요청입니다.' }

  const link = `${siteUrl()}/api/tds/link/${t}`
  const product = productName(r.product_slug)
  const until = expires.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', hour12: false })
  const m = await sendMail({
    to: r.email,
    subject: `[KCT] ${product} TDS 다운로드 링크`,
    html: `<p>${escapeHtml(r.name)}님, 안녕하세요. KCT입니다.</p><p>요청하신 <b>${escapeHtml(product)}</b> TDS 다운로드 링크를 보내드립니다.</p><p><a href="${link}">TDS 다운로드</a></p><p style="color:#666;font-size:13px">링크는 ${escapeHtml(until)}(KST)까지 유효하며 최대 ${TDS_MAX_DOWNLOADS}회 사용할 수 있습니다. 링크를 타인에게 공유하지 마세요.</p>`,
    text: `${r.name}님, 안녕하세요. KCT입니다.\n요청하신 ${product} TDS 다운로드 링크입니다.\n${link}\n링크는 ${until}(KST)까지 유효하며 최대 ${TDS_MAX_DOWNLOADS}회 사용할 수 있습니다. 타인에게 공유하지 마세요.`,
  })
  return m.sent ? { ok: true, emailed: true } : { ok: true, emailed: false, link }
}

export const rejectTdsRequest = (token: string, id: string, note?: string) =>
  safe(async () => UUID.test(id) && (await rpc('admin_process_tds_request', { p_token: token, p_id: id, p_action: 'reject', p_note: note ?? null })) != null)

export async function pendingCounts(token: string): Promise<{ members: number; tdsRequests: number }> {
  try {
    const r = await rpc<{ members: number; tds_requests: number }>('admin_pending_counts', { p_token: token })
    return { members: Number(r.members) || 0, tdsRequests: Number(r.tds_requests) || 0 }
  } catch { return { members: 0, tdsRequests: 0 } } // 사이드바 배지가 관리자 화면을 깨뜨리지 않도록
}
