import Link from 'next/link';
import {
  ADDRESS,
  CONTACT_TEXT,
  KAKAO_URL,
  MAP_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
  SMARTSTORE_URL,
} from '@/lib/contact';
import type { Lang } from './home-copy';

interface ProcessStep {
  title: string;
  desc: string;
}

interface HomeFormSectionProps {
  lang: Lang;
  copy: {
    exportCtaEyebrow: string;
    exportCtaTitle: string;
    exportCtaDesc: string;
    exportCtaExport: string;
    exportCtaQuote: string;
    b2bEyebrow: string;
    b2bFormRequiredHint: string;
    b2bSubmitNote: string;
    locationLabel: string;
    locationTitle: string;
    mapTitle: string;
    businessHours: string;
  };
  b2bTitle: string;
  b2bDesc: string;
  formLabels: {
    name: string;
    namePh: string;
    email: string;
    phone: string;
    message: string;
    messagePh: string;
    submit: string;
  };
  ctaLabels: {
    whatsapp: string;
    email: string;
  };
  processSteps: ProcessStep[];
}

const ArrowIcon = () => (
  <svg className="th-arw" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function HomeFormSection({
  lang,
  copy,
  b2bTitle,
  b2bDesc,
  formLabels,
  ctaLabels,
  processSteps,
}: HomeFormSectionProps) {
  const ct = CONTACT_TEXT[lang];

  return (
    <>
      {/* ⑦-A 수출·B2B 문의 다크 CTA 띠 */}
      <section className="th-dark-cta" aria-labelledby="home-export-cta">
        <div className="container">
          <div className="th-dark-cta-in">
            <div>
              <p className="th-hero-eyebrow" style={{ marginBottom: '0.6rem' }}>
                {copy.exportCtaEyebrow}
              </p>
              <h2 id="home-export-cta">{copy.exportCtaTitle}</h2>
              <p>{copy.exportCtaDesc}</p>
            </div>
            <div className="th-dark-cta-actions">
              <a href="#b2b-form" className="th-btn-light">
                <span>{formLabels.submit}</span>
                <ArrowIcon />
              </a>
              <Link href={`/${lang}/export`} className="th-btn-ghost">
                {copy.exportCtaExport}
              </Link>
              <Link href={`/${lang}/quote`} className="th-btn-ghost">
                {copy.exportCtaQuote}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ⑦-B B2B 견적 요청 폼 (#b2b-form 앵커 유지) + 오시는 길 */}
      <section id="b2b-form" className="th-sec th-sec-tint" aria-labelledby="home-b2b-heading">
        <div className="container">
          <div className="th-b2b-grid">
            <div>
              <div className="th-sec-head" style={{ marginBottom: '1.5rem' }}>
                <div className="th-sec-head-text">
                  <div className="tx-eyebrow">{copy.b2bEyebrow}</div>
                  <h2 id="home-b2b-heading">{b2bTitle}</h2>
                  <p>{b2bDesc}</p>
                </div>
              </div>

              <div className="th-steps">
                {processSteps.map((step, i) => (
                  <div key={i} className="th-step">
                    <span className="th-step-no">{String(i + 1).padStart(2, '0')}</span>
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                  </div>
                ))}
              </div>

              <div className="th-channels" aria-label={copy.locationTitle}>
                <a href={PHONE_TEL} className="th-ch-btn">
                  <i className="bi bi-telephone-fill" aria-hidden="true" />
                  <span>{PHONE_DISPLAY}</span>
                </a>
                <a href="mailto:sales@kconstrade.com" className="th-ch-btn">
                  <i className="bi bi-envelope-fill" aria-hidden="true" />
                  <span>{ctaLabels.email}</span>
                </a>
                <a href="https://wa.me/821089390284" target="_blank" rel="noreferrer" className="th-ch-btn">
                  <i className="bi bi-whatsapp" aria-hidden="true" />
                  <span>{ctaLabels.whatsapp}</span>
                </a>
                {KAKAO_URL && (
                  <a href={KAKAO_URL} target="_blank" rel="noreferrer" className="th-ch-btn th-ch-kakao">
                    <i className="bi bi-chat-fill" aria-hidden="true" />
                    <span>{ct.kakao}</span>
                  </a>
                )}
                <a href={SMARTSTORE_URL} target="_blank" rel="noreferrer" className="th-ch-btn">
                  <i className="bi bi-shop" aria-hidden="true" />
                  <span>{ct.store}</span>
                </a>
              </div>
            </div>

            <div className="th-form-box">
              <p className="th-form-hint">{copy.b2bFormRequiredHint}</p>
              <form
                action="https://api.web3forms.com/submit"
                method="POST"
                aria-labelledby="home-b2b-heading"
              >
                <input type="hidden" name="access_key" value="f67c63de-f948-4e2f-8928-12d4b29ed572" />
                <input type="hidden" name="subject" value="New B2B Quote Request from KCT" />
                <input type="hidden" name="redirect" value="https://kconstrade.com" />

                <div className="th-field">
                  <label htmlFor="home-1">
                    {formLabels.name}
                    <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="home-1"
                    type="text"
                    name="name"
                    className="th-input"
                    placeholder={formLabels.namePh}
                    autoComplete="name"
                    enterKeyHint="next"
                    required
                  />
                </div>

                <div className="th-field">
                  <label htmlFor="home-2">
                    {formLabels.email}
                    <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="home-2"
                    type="email"
                    name="email"
                    className="th-input"
                    placeholder="name@company.com"
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    enterKeyHint="next"
                    required
                  />
                </div>

                <div className="th-field">
                  <label htmlFor="home-3">
                    {formLabels.phone}
                    <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="home-3"
                    type="tel"
                    name="phone"
                    className="th-input"
                    placeholder="+82 10-1234-5678"
                    autoComplete="tel"
                    inputMode="tel"
                    enterKeyHint="next"
                    required
                  />
                </div>

                <div className="th-field">
                  <label htmlFor="home-4">
                    {formLabels.message}
                    <span aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="home-4"
                    name="message"
                    className="th-textarea"
                    rows={5}
                    placeholder={formLabels.messagePh}
                    required
                  />
                </div>

                <button type="submit" className="th-form-submit">
                  <span>{formLabels.submit}</span>
                  <ArrowIcon />
                </button>
                <p className="th-form-note">{copy.b2bSubmitNote}</p>
              </form>
            </div>
          </div>

          {/* 오시는 길 (지도 + 주소·연락처) */}
          <div className="th-loc-grid">
            <div className="th-map-frame">
              <iframe
                src={`https://maps.google.com/maps?q=37.478626,127.1192753&hl=${lang}&z=16&output=embed`}
                width="100%"
                height="300"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={copy.mapTitle}
              />
            </div>

            <div className="th-loc-info">
              <div>
                <div className="tx-eyebrow" style={{ color: 'var(--tx-mute)', marginBottom: '0.6rem' }}>
                  {copy.locationLabel}
                </div>
                <h3 style={{ fontSize: '1.35rem', margin: '0 0 1.25rem', letterSpacing: '-0.025em' }}>
                  {copy.locationTitle}
                </h3>
                <dl className="th-loc-dl">
                  <div>
                    <dt>{ct.addr}</dt>
                    <dd>
                      {lang === 'ko' && <strong style={{ display: 'block', fontWeight: 650 }}>{ADDRESS.ko}</strong>}
                      <span style={{ color: lang === 'ko' ? 'var(--tx-mute)' : 'var(--tx-fg)', fontSize: lang === 'ko' ? '.88rem' : '1rem' }}>
                        {ADDRESS.en}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt>{ct.tel}</dt>
                    <dd>
                      <a href={PHONE_TEL}>{PHONE_DISPLAY}</a>
                      <span style={{ marginLeft: '0.75rem', color: 'var(--tx-mute)', fontSize: '.86rem' }}>
                        {copy.businessHours}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="d-flex flex-wrap gap-2">
                <a href={MAP_URL} target="_blank" rel="noreferrer" className="th-btn-outline" style={{ minHeight: 44, padding: '.5rem 1.2rem', fontSize: '.9rem' }}>
                  <i className="bi bi-map" aria-hidden="true" />
                  <span>{ct.directions}</span>
                </a>
                <a href={PHONE_TEL} className="th-btn-dark" style={{ minHeight: 44, padding: '.5rem 1.2rem', fontSize: '.9rem' }}>
                  <i className="bi bi-telephone-fill" aria-hidden="true" />
                  <span>{ct.call}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
