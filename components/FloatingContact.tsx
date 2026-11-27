import { PHONE_TEL, KAKAO_URL, CONTACT_TEXT } from '@/lib/contact'

// 모든 페이지 우하단 고정 연락 버튼 (전화 / 카카오톡)
export default function FloatingContact({ lang = 'ko' }: { lang?: 'ko' | 'en' | 'ja' }) {
  const t = CONTACT_TEXT[lang]
  const btn = { width: 52, height: 52, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(0,0,0,.25)', textDecoration: 'none' } as const
  return (
    <div style={{ position: 'fixed', right: 16, bottom: 16, zIndex: 1040, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {KAKAO_URL && (
        <a href={KAKAO_URL} target="_blank" rel="noreferrer" aria-label={t.kakao} title={t.kakao} style={{ ...btn, background: '#FEE500', color: '#191919' }}>
          <i className="bi bi-chat-fill" aria-hidden="true" style={{ fontSize: '1.3rem' }} />
        </a>
      )}
      <a href={PHONE_TEL} aria-label={t.call} title={t.call} style={{ ...btn, background: '#1558D6', color: '#fff' }}>
        <i className="bi bi-telephone-fill" aria-hidden="true" style={{ fontSize: '1.25rem' }} />
      </a>
    </div>
  )
}
