// Resend 메일 발송(fetch). RESEND_API_KEY / MAIL_FROM 이 없으면 발송을 건너뛴다. 로그에 수신자·본문을 남기지 않는다.
export async function sendMail(m: { to: string; subject: string; html: string; text: string }): Promise<{ sent: boolean; reason?: string }> {
  const key = process.env.RESEND_API_KEY
  const from = process.env.MAIL_FROM
  if (!key || !from) return { sent: false, reason: 'not_configured' }
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [m.to], subject: m.subject, html: m.html, text: m.text }),
    })
    return r.ok ? { sent: true } : { sent: false, reason: `http_${r.status}` }
  } catch {
    return { sent: false, reason: 'network' }
  }
}
