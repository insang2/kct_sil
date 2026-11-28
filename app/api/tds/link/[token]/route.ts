import { NextRequest } from 'next/server'
import { clientIp, anonDb, hashIp, isTokenFormat, noticeHtml, sha256Hex, streamTds } from '@/lib/tds-server'

const GONE = () => noticeHtml(410, '링크를 사용할 수 없습니다', '링크가 만료되었거나 다운로드 횟수를 모두 사용했거나 올바르지 않습니다. 필요하시면 TDS 전송을 다시 요청해 주세요.')

export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!isTokenFormat(token)) return GONE()
  const { data: slug, error } = await anonDb().rpc('tds_token_consume', {
    p_token_hash: await sha256Hex(token), p_ip_hash: await hashIp(clientIp(req)),
  })
  if (error) return noticeHtml(500, '일시적인 오류', '잠시 후 다시 시도해 주세요.')
  if (!slug) return GONE()
  const res = await streamTds(slug as string)
  return res.ok ? res : noticeHtml(404, '파일을 찾을 수 없습니다', '문의해 주시면 직접 전달해 드리겠습니다.')
}

// 메일 보안 스캐너/미리보기의 HEAD 요청이 횟수를 소모하지 않도록 차단
export function HEAD() { return new Response(null, { status: 405, headers: { Allow: 'GET' } }) }
