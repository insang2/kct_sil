import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendMail } from '@/lib/mail'
import { ADMIN_TDS_PATH, clientIp, escapeHtml, hashIp, looksHuman, productName, sameOrigin, siteUrl, validateRequestInput } from '@/lib/tds-server'

const fail = (status: number, code: string) => NextResponse.json({ ok: false, code }, { status })

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return fail(403, 'forbidden')
  let body: any
  try { body = await req.json() } catch { return fail(400, 'invalid') }
  const parsed = validateRequestInput(body)
  if (!parsed.ok) return fail(400, 'invalid')
  // 봇 의심(허니팟·너무 빠름)은 저장 없이 성공과 동일하게 응답
  if (!looksHuman(body.website, body.ts)) return NextResponse.json({ ok: true })

  const v = parsed.v
  try {
    const supabase = await createClient() // 로그인 상태면 RPC 안에서 auth.uid() 로 user_id 기록
    const { data, error } = await supabase.rpc('tds_request_create', {
      p_slug: v.slug, p_name: v.name, p_company: v.company, p_email: v.email, p_phone: v.phone,
      p_message: v.message, p_consent: true, p_ip_hash: await hashIp(clientIp(req)),
    })
    if (error) return fail(500, 'server')
    if (data === 'rate_limited') return fail(429, 'rate_limited')
    if (data !== 'ok') return fail(400, 'invalid')

    const row = (k: string, val: string) => `<tr><td style="padding:4px 12px 4px 0;color:#666">${k}</td><td>${escapeHtml(val || '-')}</td></tr>`
    await sendMail({
      to: process.env.ADMIN_NOTIFY_EMAIL || 'sales@kconstrade.com',
      subject: `[KCT] TDS 전송 요청 - ${productName(v.slug)}`,
      html: `<p>새 TDS 전송 요청이 접수되었습니다.</p><table>${row('제품', productName(v.slug))}${row('이름', v.name)}${row('회사', v.company)}${row('이메일', v.email)}${row('연락처', v.phone)}${row('메시지', v.message)}</table><p><a href="${siteUrl()}${ADMIN_TDS_PATH}">관리자 페이지에서 처리하기</a></p>`,
      text: `새 TDS 전송 요청\n제품: ${productName(v.slug)}\n이름: ${v.name}\n회사: ${v.company || '-'}\n이메일: ${v.email}\n연락처: ${v.phone || '-'}\n메시지: ${v.message || '-'}\n처리: ${siteUrl()}${ADMIN_TDS_PATH}`,
    })
    return NextResponse.json({ ok: true })
  } catch {
    return fail(500, 'server')
  }
}
