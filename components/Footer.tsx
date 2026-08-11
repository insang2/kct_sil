import { getDictionary } from "@/lib/dictionaries";
import Link from "next/link";

const RETAIL_SHOPS = [
  { key: 'naver', icon: 'bi-shop', href: 'https://smartstore.naver.com/kconstrade/' },
] as const;

export default async function Footer({ lang = 'ko' }: { lang?: 'ko' | 'en' | 'ja' }) {
  const dict = await getDictionary(lang) as any;
  const d = dict;

  return (
    <footer className="footer mt-auto bg-dark text-white pt-9 pb-5">
      <div className="container">

        {/* Top row: Brand + Nav columns */}
        <div className="row g-5 mb-7">

          {/* Brand column */}
          <div className="col-lg-4">
            <Link href={`/${lang}`} className="d-inline-block mb-4">
              <img
                src="/assets/img/logo/kct_logo.jpeg"
                alt="KCT Logo"
                style={{ height: '40px', width: 'auto', filter: 'brightness(0) invert(1)', opacity: 0.9 }}
              />
            </Link>
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
          </div>

          {/* Navigation column */}
          <div className="col-6 col-lg-2">
            <h6 className="fw-bold text-white mb-4 text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.1em', opacity: 0.6 }}>
              Menu
            </h6>
            <ul className="list-unstyled mb-0">
              {[
                { label: d.navigation.home,     href: `/${lang}` },
                { label: d.navigation.about,    href: `/${lang}/about` },
                { label: d.navigation.products, href: `/${lang}/products` },
                { label: d.navigation.b2b,      href: `/${lang}#b2b-form` },
                { label: d.navigation.export,   href: `/${lang}/export` },
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
            <h6 className="fw-bold text-white mb-4 text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.1em', opacity: 0.6 }}>
              Contact
            </h6>
            <ul className="list-unstyled mb-0 small" style={{ color: 'rgba(255,255,255,0.82)', lineHeight: 1.9 }}>
              <li>
                <i className="bi bi-envelope me-2 text-primary"></i>
                <a href="mailto:sales@kconstrade.com" className="text-decoration-none" style={{ color: 'inherit' }}>
                  sales@kconstrade.com
                </a>
              </li>
              <li>
                <i className="bi bi-geo-alt me-2 text-primary"></i>
                10 Chungmin-ro, Songpa-gu<br />
                <span style={{ paddingLeft: '1.25rem' }}>Seoul, Korea (Garden Five Tools 4-A19)</span>
              </li>
              <li className="mt-2">
                <i className="bi bi-person me-2 text-primary"></i>
                {d.footer?.sales_manager ?? 'Sales Manager: Lee Joon-hwan'}
              </li>
            </ul>
          </div>

          {/* Retail shops column */}
          <div className="col-lg-3">
            <h6 className="fw-bold text-white mb-4 text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.1em', opacity: 0.6 }}>
              {d.retail?.label ?? '소량 주문'}
            </h6>
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
                  className="badge rounded-pill px-3 py-2 text-decoration-none small"
                  style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.75)', fontSize: '0.75rem' }}
                >
                  {d.retail?.shops?.[shop.key] ?? shop.key}
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
              style={{ height: '22px', opacity: 0.35, filter: 'brightness(0) invert(1)' }}
            />
          </div>
        </div>

      </div>
    </footer>
  );
}
