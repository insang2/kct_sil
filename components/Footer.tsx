import { getDictionary } from "@/lib/dictionaries";
import Link from "next/link";
import FloatingContact from "@/components/FloatingContact";
import { PHONE_DISPLAY, PHONE_TEL, KAKAO_URL, SMARTSTORE_URL, ADDRESS, CONTACT_TEXT } from "@/lib/contact";

const RETAIL_SHOPS = [
  { key: 'naver', icon: 'bi-shop', href: SMARTSTORE_URL },
] as const;

export default async function Footer({ lang = 'ko' }: { lang?: 'ko' | 'en' | 'ja' }) {
  const dict = await getDictionary(lang) as any;
  const d = dict;
  const ct = CONTACT_TEXT[lang];

  return (
    <>
    <footer className="footer mt-auto bg-dark text-white pt-9 pb-5">
      <div className="container">

        {/* Top row: Brand + Nav columns */}
        <div className="row g-5 mb-7">

          {/* Brand column */}
          <div className="col-lg-4">
            <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
              <Link
                href={`/${lang}`}
                className="d-inline-flex align-items-center bg-white rounded-3 px-3 py-2"
                aria-label={
                  lang === 'ko'
                    ? '한국건설트레이딩 (KCT) 홈'
                    : lang === 'ja'
                    ? '韓国建設トレーディング (KCT) ホーム'
                    : 'Korea Construction Trading (KCT) home'
                }
              >
                <img
                  src="/assets/img/logo/kct_logo.jpeg"
                  alt={
                    lang === 'ko'
                      ? '한국건설트레이딩 (KCT) 로고'
                      : lang === 'ja'
                      ? '韓国建設トレーディング (KCT) ロゴ'
                      : 'Korea Construction Trading (KCT) Logo'
                  }
                  width={1380}
                  height={752}
                  loading="lazy"
                  decoding="async"
                  style={{ height: '40px', width: 'auto' }}
                />
              </Link>
              <div className="d-inline-flex align-items-center gap-2 bg-white rounded-3 px-3 py-2">
                <img
                  src="/assets/img/logo/Dow_Chemical_Company_logo.svg"
                  alt="Dow"
                  width={598}
                  height={210}
                  loading="lazy"
                  decoding="async"
                  style={{ height: '26px', width: 'auto' }}
                />
                <span style={{ color: '#16142F', fontSize: '.78rem', fontWeight: 600, lineHeight: 1.25, borderLeft: '1px solid #d5d8de', paddingLeft: 10 }}>
                  {lang === 'ko' ? <>Dow<br />인증 판매점</> : lang === 'ja' ? <>Dow<br />認定販売店</> : <>Dow<br />Authorized Distributor</>}
                </span>
              </div>
            </div>
            <p className="text-white mb-4 small" style={{ opacity: 0.75, lineHeight: 1.8 }}>
              {d.footer?.tagline_2 ?? 'Architectural Silicone Wholesale & Export'}<br />
              {d.footer?.tagline_3 ?? 'B2B Pricing · Quote within 24hrs'}
            </p>
            {/* Social links */}
            <div className="d-flex gap-3">
              <a
                href="https://www.instagram.com/kct.rading"
                target="_blank"
                rel="noreferrer"
                className="d-flex align-items-center justify-content-center rounded-circle text-white"
                style={{ width: 38, height: 38, background: 'rgba(255,255,255,0.12)', transition: 'background 0.2s' }}
                aria-label="Instagram"
              >
                <i className="bi bi-instagram" style={{ fontSize: '1rem' }}></i>
              </a>
              <a
                href="https://wa.me/821089390284"
                target="_blank"
                rel="noreferrer"
                className="d-flex align-items-center justify-content-center rounded-circle text-white"
                style={{ width: 38, height: 38, background: 'rgba(255,255,255,0.12)' }}
                aria-label="WhatsApp"
              >
                <i className="bi bi-whatsapp" style={{ fontSize: '1rem' }}></i>
              </a>
              <a
                href="mailto:sales@kconstrade.com"
                className="d-flex align-items-center justify-content-center rounded-circle text-white"
                style={{ width: 38, height: 38, background: 'rgba(255,255,255,0.12)' }}
                aria-label="Email"
              >
                <i className="bi bi-envelope-fill" style={{ fontSize: '1rem' }}></i>
              </a>
            </div>
            {/* Language links (static SSR links for ko/en/ja discovery) */}
            <nav
              aria-label={lang === 'ko' ? '언어 선택' : lang === 'ja' ? '言語選択' : 'Language'}
              className="d-flex flex-wrap align-items-center gap-2 mt-4"
            >
              {[
                { code: 'ko', label: '한국어', href: '/ko' },
                { code: 'en', label: 'English', href: '/en' },
                { code: 'ja', label: '日本語', href: '/ja' },
              ].map((item) => (
                <Link
                  key={item.code}
                  href={item.href}
                  hrefLang={item.code}
                  lang={item.code}
                  aria-current={lang === item.code ? 'true' : undefined}
                  className="text-decoration-none px-2 py-1 rounded-pill"
                  style={{
                    color: lang === item.code ? '#ffffff' : 'rgba(255,255,255,0.78)',
                    background: lang === item.code ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
                    fontWeight: lang === item.code ? 600 : 400,
                    fontSize: '0.78rem',
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Navigation column */}
          <div className="col-6 col-lg-2">
            <h2 className="h6 fw-bold text-white mb-4 text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.1em', opacity: 0.6 }}>
              Menu
            </h2>
            <ul className="list-unstyled mb-0">
              {[
                { label: d.navigation.home,      href: `/${lang}` },
                { label: d.navigation.about,     href: `/${lang}/about` },
                { label: d.navigation.products,  href: `/${lang}/products` },
                { label: d.navigation.technical, href: `/${lang}/technical` },
                { label: lang === 'en' ? 'TDS Download' : lang === 'ja' ? 'TDSダウンロード' : 'TDS 자료실', href: `/${lang === 'ja' ? 'en' : lang}/tds` },
                { label: d.navigation.quote ?? (lang === 'en' ? 'Quotation' : lang === 'ja' ? '見積書' : '견적서'), href: `/${lang}/quote` },
                { label: d.navigation.b2b,       href: `/${lang}#b2b-form` },
                { label: d.navigation.export,    href: `/${lang}/export` },
                { label: lang === 'en' ? 'Sitemap' : lang === 'ja' ? 'サイトマップ' : '사이트맵', href: `/${lang === 'ja' ? 'en' : lang}/sitemap` },
              ].map((item) => (
                <li key={item.href} className="mb-2">
                  <Link
                    href={item.href}
                    className="text-decoration-none small"
                    style={{ color: 'rgba(255,255,255,0.82)' }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div className="col-6 col-lg-3">
            <h2 className="h6 fw-bold text-white mb-4 text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.1em', opacity: 0.6 }}>
              Contact
            </h2>
            <address className="mb-0" style={{ fontStyle: 'normal' }}>
            <ul className="list-unstyled mb-0 small" style={{ color: 'rgba(255,255,255,0.82)', lineHeight: 1.9 }}>
              <li>
                <i className="bi bi-telephone me-2 text-primary"></i>
                <a href={PHONE_TEL} className="text-decoration-none fw-bold" style={{ color: 'inherit' }}>{PHONE_DISPLAY}</a>
              </li>
              {KAKAO_URL && (
                <li>
                  <i className="bi bi-chat-fill me-2" style={{ color: '#FEE500' }}></i>
                  <a href={KAKAO_URL} target="_blank" rel="noreferrer" className="text-decoration-none" style={{ color: 'inherit' }}>{ct.kakao}</a>
                </li>
              )}
              <li>
                <i className="bi bi-envelope me-2 text-primary"></i>
                <a href="mailto:sales@kconstrade.com" className="text-decoration-none" style={{ color: 'inherit' }}>
                  sales@kconstrade.com
                </a>
              </li>
              <li>
                <i className="bi bi-geo-alt me-2 text-primary"></i>
                {lang === 'ko' ? (
                  <>
                    {ADDRESS.ko}<br />
                    <span style={{ paddingLeft: '1.25rem', opacity: 0.7 }}>{ADDRESS.en}</span>
                  </>
                ) : (
                  <>
                    10 Chungmin-ro, Songpa-gu<br />
                    <span style={{ paddingLeft: '1.25rem' }}>Seoul, Korea (Garden Five Tools 4-A19)</span>
                  </>
                )}
              </li>
              <li className="mt-2">
                <i className="bi bi-person me-2 text-primary"></i>
                {d.footer?.sales_manager ?? 'Sales Manager: Lee Joon-hwan'}
              </li>
            </ul>
            </address>
          </div>

          {/* Retail shops column */}
          <div className="col-lg-3">
            <h2 className="h6 fw-bold text-white mb-4 text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.1em', opacity: 0.6 }}>
              {d.retail?.label ?? (lang === 'en' ? 'Small Orders' : lang === 'ja' ? '小口注文' : '소량 주문')}
            </h2>
            <p className="small mb-3" style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
                {d.footer?.small_orders_hint ?? 'Small orders available on open markets.'}
            </p>
            <div className="d-flex flex-wrap gap-2">
              {RETAIL_SHOPS.map((shop) => (
                <a
                  key={shop.key}
                  href={shop.href}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-success btn-sm rounded-pill px-3 fw-bold"
                >
                  <i className="bi bi-shop me-1"></i>{lang === 'ko' ? (d.retail?.shops?.[shop.key] ?? shop.key) : ct.store}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '0 0 1.5rem' }} />

        {/* Bottom row */}
        <div className="row align-items-center">
          <div className="col-md-8">
            {lang === 'ko' && (
              <p className="mb-1 small" style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.8 }}>
                업체명 : 한국건설트레이딩 &nbsp;|&nbsp; 대표자명 : 이준환 &nbsp;|&nbsp; 사업자번호 : 371-07-03719 &nbsp;|&nbsp; 사업장 주소 : 서울특별시 송파구 충민로 10 4-A19 가든파이브툴
              </p>
            )}
            <p className="mb-0 small" style={{ color: 'rgba(255,255,255,0.62)', lineHeight: 1.8 }}>
              © 2026 Korea Construction Trading (KCT). {d.footer?.rights ?? 'All rights reserved.'}&nbsp;&nbsp;|&nbsp;&nbsp;
              Biz Reg: 371-07-03719
            </p>
          </div>
          <div className="col-md-4 text-md-end mt-2 mt-md-0 d-flex align-items-center justify-content-md-end gap-4">
            <Link
              href="/admin"
              className="text-decoration-none"
              style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.7rem' }}
            >
              {d.footer?.admin_link ?? 'Admin'}
            </Link>
            <img
              src="/assets/img/logo/Dow_Chemical_Company_logo.svg"
              alt="Dow Chemical"
              width={598}
              height={210}
              loading="lazy"
              decoding="async"
              style={{ height: '22px', width: 'auto', opacity: 0.35, filter: 'brightness(0) invert(1)' }}
            />
          </div>
        </div>

        {/* Maker credit */}
        <div className="text-center mt-4">
          <a
            href="https://davhave.com"
            target="_blank"
            rel="noreferrer"
            className="text-decoration-none"
            style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.7rem' }}
          >
            Powered by davhave.com
          </a>
        </div>

      </div>
    </footer>
    <FloatingContact lang={lang} />
    </>
  );
}