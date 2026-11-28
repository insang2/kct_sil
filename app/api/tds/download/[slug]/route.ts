import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { FILE_HEADERS, clientIp, hashIp, isValidSlug, streamTds, tdsExists } from '@/lib/tds-server'

const j = (status: number, error: string, code?: string) => Response.json({ error, code }, { status, headers: FILE_HEADERS })

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!isValidSlug(slug)) return j(404, 'not_found')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return j(401, '로그인이 필요합니다.', 'unauthenticated')
  if (!(await tdsExists(slug))) return j(404, 'not_found')
  // 승인 회원 확인 + 로그 기록을 한 RPC 에서 처리(미승인이면 false)
  const { data: ok } = await supabase.rpc('tds_log_download', { p_slug: slug, p_ip_hash: await hashIp(clientIp(req)) })
  if (ok !== true) return j(403, '승인된 회원만 다운로드할 수 있습니다.', 'not_approved')
  return streamTds(slug)
}
