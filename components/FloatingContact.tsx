import { PHONE_TEL, KAKAO_URL, CONTACT_TEXT } from '@/lib/contact';

// 모든 페이지 우하단 고정 연락 버튼 (전화 / 카카오톡)
export default function FloatingContact({ lang = 'ko' }: { lang?: 'ko' | 'en' | 'ja' }) {
  const t = CONTACT_TEXT[lang];
  return (
    <div className="kct-float">
      {KAKAO_URL && (
        <a
          href={KAKAO_URL}
          target="_blank"
          rel="noreferrer"
          aria-label={t.kakao}
          title={t.kakao}
          className="kct-float-btn kct-float-kakao"
        >
          <i className="bi bi-chat-fill" aria-hidden="true" style={{ fontSize: '1.2rem' }} />
        </a>
      )}
      <a
        href={PHONE_TEL}
        aria-label={t.call}
        title={t.call}
        className="kct-float-btn kct-float-tel"
      >
        <i className="bi bi-telephone-fill" aria-hidden="true" style={{ fontSize: '1.15rem' }} />
      </a>
    </div>
  );
}
