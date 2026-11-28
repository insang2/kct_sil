// TDS 게이팅 서버 공용 로직. 순수 함수(토큰·해시·만료·slug·입력 검증)는 scripts/tds-selfcheck.ts 로 점검한다.
// 서버 전용: 클라이언트에서 import 금지.
import { createClient } from '@supabase/supabase-js'
import { CATALOG } from './products-catalog'

// workers-types 가 프로젝트에 없어 필요한 R2 표면만 최소 정의
interface TdsBucket {
  head(key: string): Promise<unknown | null>
  get(key: string): Promise<{ body: unknown; size: number } | null>
}

export const TDS_LINK_TTL_MS = 72 * 3600 * 1000
export const TDS_MAX_DOWNLOADS = 5
export const MIN_FILL_MS = 3000
// 관리자 알림 메일의 링크 대상. 관리자 UI 경로가 정해지면 여기만 고친다.
export const ADMIN_TDS_PATH = '/admin/tds-requests'

const SLUGS = new Set(CATALOG.map((p) => p.slug))
export const isValidSlug = (s: unknown): s is string => typeof s === 'string' && SLUGS.has(s)
export const productName = (slug: string) => CATALOG.find((p) => p.slug === slug)?.name ?? slug
export const siteUrl = () => (process.env.SITE_URL || 'https://kconstrade.com').replace(/\/+$/, '')
export const tdsKey = (slug: string) => `tds/${slug}.pdf` // slug 는 반드시 isValidSlug 통과 후에만 사용

// ───────── 토큰·해시·만료 ─────────
export function generateToken(): string {
  const b = crypto.getRandomValues(new Uint8Array(32))
  return btoa(String.fromCharCode(...b)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
export const isTokenFormat = (t: unknown): t is string => typeof t === 'string' && /^[A-Za-z0-9_-]{43}$/.test(t)
export async function sha256Hex(s: string): Promise<string> {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))
  return Array.from(new Uint8Array(d), (x) => x.toString(16).padStart(2, '0')).join('')
}
export const isExpired = (expiresAt: string | Date | null, now = Date.now()) =>
  !expiresAt || new Date(expiresAt).getTime() <= now
// shortcut: IP 솔트는 env 없으면 고정 문자열, 운영에서 TDS_IP_SALT 시크릿 설정 권장.
export const hashIp = (ip: string) => sha256Hex(`${process.env.TDS_IP_SALT || 'kct-tds-ip'}|${ip}`)
export function clientIp(req: Request): string {
  return req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
}

// ───────── 입력 검증 ─────────
export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))

/** 동일 출처 POST 만 허용(Origin 필수). */
export function sameOrigin(req: Request): boolean {
  const o = req.headers.get('origin')
  if (!o) return false
  try {
    const host = new URL(o).host
    return host === req.headers.get('host') || host === new URL(siteUrl()).host
  } catch { return false }
}

export interface TdsRequestInput { slug: string; name: string; company: string; email: string; phone: string; message: string }
const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.replace(/[\u0000-\u001f\u007f]/g, ' ').trim() : '').slice(0, max + 1)

export function validateRequestInput(b: any): { ok: true; v: TdsRequestInput } | { ok: false } {
  if (!b || typeof b !== 'object' || b.consent !== true) return { ok: false }
  const v = {
    slug: clean(b.slug, 80), name: clean(b.name, 60), company: clean(b.company, 100),
    email: clean(b.email, 254).toLowerCase(), phone: clean(b.phone, 30), message: typeof b.message === 'string' ? b.message.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').trim().slice(0, 1001) : '',
  }
  if (!isValidSlug(v.slug) || !v.name || v.name.length > 60 || v.company.length > 100 || v.phone.length > 30 || v.message.length > 1000) return { ok: false }
  if (v.email.length > 254 || !/^[^@\s<>]+@[^@\s<>]+\.[^@\s<>]+$/.test(v.email)) return { ok: false }
  if (v.phone && !/^[0-9+\-()\s.]{5,30}$/.test(v.phone)) return { ok: false }
  return { ok: true, v }
}

/** 허니팟이 비어 있고 폼 렌더 후 최소 3초 경과(최대 24시간)인지. false 면 봇으로 보고 조용히 무시한다. */
export function looksHuman(honeypot: unknown, ts: unknown, now = Date.now()): boolean {
  if (typeof honeypot === 'string' && honeypot !== '') return false
  const t = Number(ts)
  return Number.isFinite(t) && now - t >= MIN_FILL_MS && now - t <= 24 * 3600 * 1000
}

// ───────── 인프라 ─────────
export function anonDb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } })
}

export const FILE_HEADERS: Record<string, string> = {
  'Cache-Control': 'private, no-store',
  'X-Robots-Tag': 'noindex, nofollow',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer', // 링크 토큰이 Referer 로 새지 않게
}

export async function getBucket(): Promise<TdsBucket | null> {
  const { getCloudflareContext } = await import('@opennextjs/cloudflare')
  return ((getCloudflareContext().env as unknown as { TDS_BUCKET?: TdsBucket }).TDS_BUCKET) ?? null
}

export async function tdsExists(slug: string): Promise<boolean> {
  if (!isValidSlug(slug)) return false
  return !!(await (await getBucket())?.head(tdsKey(slug)))
}

export async function streamTds(slug: string): Promise<Response> {
  const obj = isValidSlug(slug) ? await (await getBucket())?.get(tdsKey(slug)) : null
  if (!obj) return Response.json({ error: 'not_found' }, { status: 404, headers: FILE_HEADERS })
  return new Response(obj.body as unknown as BodyInit, {
    headers: {
      ...FILE_HEADERS,
      'Content-Type': 'application/pdf',
      'Content-Length': String(obj.size),
      'Content-Disposition': `attachment; filename="${slug}-TDS.pdf"`,
    },
  })
}

export function noticeHtml(status: number, title: string, body: string): Response {
  const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${escapeHtml(title)}</title></head><body style="font-family:Pretendard,system-ui,sans-serif;max-width:480px;margin:15vh auto;padding:0 20px;line-height:1.6"><h1 style="font-size:20px">${escapeHtml(title)}</h1><p>${escapeHtml(body)}</p><p><a href="/ko/tds">TDS 센터로 이동</a></p></body></html>`
  return new Response(html, { status, headers: { ...FILE_HEADERS, 'Content-Type': 'text/html; charset=utf-8' } })
}
