import { getDictionary } from '@/lib/dictionaries';
import Link from 'next/link';
import FloatingContact from '@/components/FloatingContact';
import {
  PHONE_DISPLAY,
  PHONE_TEL,
  KAKAO_URL,
  SMARTSTORE_URL,
  ADDRESS,
  CONTACT_TEXT,
} from '@/lib/contact';

const RETAIL_SHOPS = [{ key: 'naver', icon: 'bi-shop', href: SMARTSTORE_URL }] as const;

const FOOTER_TECH_LINKS: { path: string; ko: string; en: string; ja: string }[] = [
  { path: 'technical', ko: '내화 실란트 기술 매뉴얼', en: 'Fire-rated sealant manual', ja: '耐火シーラント技術マニュアル' },
  { path: 'technical/industrial', ko: '산업·가전·유지보수 선정 가이드', en: 'Industrial & appliance guide', ja: '産業・家電・メンテナンス用ガイド' },
  { path: 'technical/basics', ko: '실리콘 일반 교육', en: 'Silicone basics training', ja: 'シリコーン基礎教育' },
  { path: 'technical/psa', ko: '실리콘 점착제(PSA) 선택 요령', en: 'Silicone PSA selection guide', ja: 'シリコーンPSA選定ガイド' },
  { path: 'technical/selection', ko: 'DOWSIL 실란트 비교·선택', en: 'Sealant comparison guide', ja: 'シーラント比較・選定' },
  { path: 'technical/tapes', ko: '전기·전자 테이프용 PSA', en: 'Electrical tape PSAs', ja: '電気・電子テープ用PSA' },
];

export default async function Footer({ lang = 'ko' }: { lang?: 'ko' | 'en' | 'ja' }) {
  const dict = (await getDictionary(lang)) as any;
  const d = dict;
  const ct = CONTACT_TEXT[lang];

  const colHeadings = {
    business: lang === 'en' ? 'Business' : lang === 'ja' ? '事業メニュー' : '사업 메뉴',
    technical: lang === 'en' ? 'Technical' : lang === 'ja' ? '技術情報' : '기술정보',
    contact: lang === 'en' ? 'Contact' : lang === 'ja' ? 'お問い合わせ' : '문의 · 카카오톡',
  };

  const sustainabilityLabel =
    lang === 'en' ? 'Sustainability' : lang === 'ja' ? 'サステナビリティ' : '지속가능경영';

  return (
    <>
      <footer className="kct-footer mt-auto">
        <div className="kct-footer-wrap">
          {/* 4-Column Hairline Grid */}
          <div className="kct-footer-grid">
            {/* Col 1: 회사 정보 & <address> */}
            <div className="kct-footer-col">
              <div className="kct-footer-badges">
                <Link
                  href={`/${lang}`}
                  className="kct-footer-logo-badge"
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
                    style={{ height: '36px', width: 'auto' }}
                  />
                </Link>
                <div className="kct-footer-dow-badge">
                  <img
                    src="/assets/img/logo/Dow_Chemical_Company_logo.svg"
                    alt="Dow"
                    width={598}
                    height={210}
                    loading="lazy"
                    decoding="async"
                    style={{ height: '24px', width: 'auto' }}
                  />
                  <span className="kct-footer-dow-text">
                    {lang === 'ko' ? (
                      <>
                        Dow
                        <br />
                        인증 판매점
                      </>
                    ) : lang === 'ja' ? (
                      <>
                        Dow
                        <br />
                        認定販売店
                      </>
                    ) : (
                      <>
                        Dow
                        <br />
                        Authorized Distributor
                      </>
                    )}
                  </span>
                </div>
              </div>

              <p className="kct-footer-tagline">
                {d.footer?.tagline_2 ?? 'Architectural Silicone Wholesale & Export'}
                <br />
                {d.footer?.tagline_3 ?? 'B2B Pricing · Quote within 24hrs'}
              </p>

              <address className="kct-footer-address">
                <p>
                  {lang === 'ko' ? (
                    <>
                      {ADDRESS.ko}
                      <br />
                      <span>{ADDRESS.en}</span>
                    </>
                  ) : (
                    <>
                      10 Chungmin-ro, Songpa-gu
                      <br />
                      Seoul, Korea (Garden Five Tools 4-A19)
                    </>
                  )}
                </p>
                <p>{d.footer?.sales_manager ?? 'Sales Manager: Lee Joon-hwan'}</p>
              </address>

              {/* Static SSR language links for ko/en/ja discovery */}
              <nav
                aria-label={
                  lang === 'ko' ? '언어 선택' : lang === 'ja' ? '言語選択' : 'Language'
                }
                className="kct-footer-langs"
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
                    className="kct-footer-lang-pill"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Col 2: 사업 메뉴 */}
            <div className="kct-footer-col">
              <h2 className="kct-footer-heading">{colHeadings.business}</h2>
              <ul className="kct-footer-links">
                {[
                  { label: d.navigation.home, href: `/${lang}` },
                  { label: d.navigation.about, href: `/${lang}/about` },
                  { label: sustainabilityLabel, href: `/${lang}/sustainability` },
                  { label: d.navigation.products, href: `/${lang}/products` },
                  {
                    label:
                      d.navigation.quote ??
                      (lang === 'en' ? 'Quotation' : lang === 'ja' ? '見積書' : '견적서'),
                    href: `/${lang}/quote`,
                  },
                  { label: d.navigation.b2b, href: `/${lang}#b2b-form` },
                  { label: d.navigation.export, href: `/${lang}/export` },
                  {
                    label:
                      lang === 'en'
                        ? 'Sitemap'
                        : lang === 'ja'
                        ? 'サイトマップ'
                        : '사이트맵',
                    href: `/${lang === 'ja' ? 'en' : lang}/sitemap`,
                  },
                ].map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: 기술정보 링크 + TDS 자료실 */}
            <div className="kct-footer-col">
              <h2 className="kct-footer-heading">{colHeadings.technical}</h2>
              <ul className="kct-footer-links">
                {FOOTER_TECH_LINKS.map((item) => (
                  <li key={item.path}>
                    <Link href={`/${lang}/${item.path}`}>{item[lang]}</Link>
                  </li>
                ))}
                <li>
                  <Link href={`/${lang === 'ja' ? 'en' : lang}/tds`}>
                    {lang === 'en'
                      ? 'TDS Download'
                      : lang === 'ja'
                      ? 'TDSダウンロード'
                      : 'TDS 자료실'}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: 문의 · 카카오톡 · 소량 주문 */}
            <div className="kct-footer-col">
              <h2 className="kct-footer-heading">{colHeadings.contact}</h2>
              <ul className="kct-footer-contact-list">
                <li>
                  <a href={PHONE_TEL} style={{ fontWeight: 700 }}>
                    <i className="bi bi-telephone" aria-hidden="true" />
                    <span>{PHONE_DISPLAY}</span>
                  </a>
                </li>
                <li>
                  <a href="mailto:sales@kconstrade.com">
                    <i className="bi bi-envelope" aria-hidden="true" />
                    <span>sales@kconstrade.com</span>
                  </a>
                </li>
                {KAKAO_URL && (
                  <li style={{ marginTop: '0.2rem' }}>
                    <a
                      href={KAKAO_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="kct-footer-kakao-link"
                    >
                      <i className="bi bi-chat-fill" aria-hidden="true" />
                      <span>{ct.kakao}</span>
                    </a>
                  </li>
                )}
              </ul>

              <div className="kct-footer-socials">
                <a
                  href="https://www.instagram.com/kct.rading"
                  target="_blank"
                  rel="noreferrer"
                  className="kct-footer-social-btn"
                  aria-label="Instagram"
                >
                  <i className="bi bi-instagram" aria-hidden="true" />
                </a>
                <a
                  href="https://wa.me/821089390284"
                  target="_blank"
                  rel="noreferrer"
                  className="kct-footer-social-btn"
                  aria-label="WhatsApp"
                >
                  <i className="bi bi-whatsapp" aria-hidden="true" />
                </a>
                <a
                  href="mailto:sales@kconstrade.com"
                  className="kct-footer-social-btn"
                  aria-label="Email"
                >
                  <i className="bi bi-envelope-fill" aria-hidden="true" />
                </a>
              </div>

              <div className="kct-footer-retail">
                <p className="kct-footer-retail-hint">
                  {d.footer?.small_orders_hint ?? 'Small orders available on open markets.'}
                </p>
                {RETAIL_SHOPS.map((shop) => (
                  <a
                    key={shop.key}
                    href={shop.href}
                    target="_blank"
                    rel="noreferrer"
                    className="kct-footer-store-btn"
                  >
                    <i className="bi bi-shop" aria-hidden="true" />
                    <span>
                      {lang === 'ko' ? (d.retail?.shops?.[shop.key] ?? shop.key) : ct.store}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Legal Row */}
          <div className="kct-footer-bottom">
            <div className="kct-footer-legal">
              {lang === 'ko' && (
                <p>
                  업체명 : 한국건설트레이딩 &nbsp;|&nbsp; 대표자명 : 이준환 &nbsp;|&nbsp;
                  사업자번호 : 371-07-03719 &nbsp;|&nbsp; 사업장 주소 : 서울특별시 송파구
                  충민로 10 4-A19 가든파이브툴
                </p>
              )}
              <p>
                © 2026 Korea Construction Trading (KCT).{' '}
                {d.footer?.rights ?? 'All rights reserved.'} &nbsp;|&nbsp; Biz Reg:
                371-07-03719
              </p>
            </div>

            <div className="kct-footer-meta">
              <Link href="/admin">{d.footer?.admin_link ?? 'Admin'}</Link>
              <a href="https://davhave.com" target="_blank" rel="noreferrer">
                Powered by davhave.com
              </a>
              <img
                src="/assets/img/logo/Dow_Chemical_Company_logo.svg"
                alt="Dow Chemical"
                width={598}
                height={210}
                loading="lazy"
                decoding="async"
                style={{
                  height: '20px',
                  width: 'auto',
                  opacity: 0.45,
                  filter: 'brightness(0) invert(1)',
                }}
              />
            </div>
          </div>
        </div>
      </footer>
      <FloatingContact lang={lang} />
    </>
  );
}
