import { getDictionary } from '@/lib/dictionaries';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '회사소개 | 한국건설트레이딩 (KCT) - Dow 실리콘 전문',
  description: '한국건설트레이딩은 Dow(다우) 건축용·구조용 실리콘의 전문 판매 및 수출 기업입니다. 국내 도매 및 해외 수출을 전문으로 합니다.',
};

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: 'ko' | 'en' | 'ja' }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const d = dict as any;
  const t = d.about;

  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": t.hero_title,
    "description": t.hero_subtitle,
    "publisher": {
      "@type": "Organization",
      "name": "한국건설트레이딩 (Korea Construction Trading)",
      "alternateName": "KCT",
      "url": "https://kconstrade.com"
    },
    "mainEntity": {
      "@type": "Organization",
      "name": "한국건설트레이딩 (Korea Construction Trading)",
      "foundingDate": "2018",
      "description": t.mission_desc
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      {/* ── Hero ── */}
      <section
        className="position-relative overflow-hidden text-white"
        style={{ minHeight: '55vh', display: 'flex', alignItems: 'center' }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url('/assets/img/backgrounds/hero_construction.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="container position-relative z-1 py-11 mt-6">
          <div className="row align-items-center">
            <div className="col-lg-10 mx-auto text-center">
              <span className="badge rounded-pill px-3 py-2 mb-4 text-uppercase fw-bold" style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', letterSpacing: '0.08em' }}>
                {t.hero_label}
              </span>
              <h1 className="display-3 fw-bold text-white mb-3" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>{t.hero_title}</h1>
              <p className="lead text-white mb-0" style={{ fontSize: '1.25rem', opacity: 0.95, textShadow: '0 1px 5px rgba(0,0,0,0.2)' }}>
                {t.hero_subtitle}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="py-9 py-lg-11 bg-white reveal-fade-in">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-5">
              <span className="h6 text-primary fw-bold text-uppercase d-block mb-3">{t.mission_label}</span>
              <h2 className="display-5 fw-bold text-dark mb-4">{t.mission_title}</h2>
              <p className="lead text-dark mb-5" style={{ lineHeight: 1.8 }}>{t.mission_desc}</p>
              <div className="d-flex flex-wrap gap-4">
                <div className="text-center" style={{ minWidth: '70px' }}>
                  <div className="fw-bold text-primary" style={{ fontSize: '2rem' }}>11+</div>
                  <div className="text-dark small fw-bold">{t.stat_products}</div>
                </div>
                <div className="text-center" style={{ minWidth: '70px' }}>
                  <div className="fw-bold text-primary" style={{ fontSize: '2rem' }}>5+</div>
                  <div className="text-dark small fw-bold">{t.stat_export_countries}</div>
                </div>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="row g-4">
                {/* Certifications / badges */}
                <div className="col-6">
                  <div className="card border-0 rounded-4 h-100 p-4 text-center shadow-sm">
                    <i className="bi bi-shield-check text-primary mb-3" style={{ fontSize: '2rem' }}></i>
                    <div className="fw-bold text-dark mb-1">{t.quality_cert}</div>
                    <div className="small" style={{ color: '#555370' }}>{t.quality_cert_desc}</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card border-0 rounded-4 h-100 p-4 text-center shadow-sm">
                    <i className="bi bi-globe text-primary mb-3" style={{ fontSize: '2rem' }}></i>
                    <div className="fw-bold text-dark mb-1">{t.global_export_badge}</div>
                    <div className="small" style={{ color: '#555370' }}>{t.global_export_badge_desc}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Business Areas ── */}
      <section className="py-9 py-lg-11 bg-light reveal-fade-in">
        <div className="container">
          <div className="row justify-content-center text-center mb-9">
            <div className="col-lg-7">
              <span className="h6 text-primary fw-bold text-uppercase d-block mb-3">{t.business_label}</span>
              <h2 className="display-5 fw-bold text-dark">{t.business_title}</h2>
            </div>
          </div>
          <div className="row g-4">
            {[
              { icon: 'bi-box-seam', title: t.b1_title, desc: t.b1_desc },
              { icon: 'bi-building', title: t.b2_title, desc: t.b2_desc },
              { icon: 'bi-airplane', title: t.b3_title, desc: t.b3_desc },
              { icon: 'bi-lightbulb', title: t.b4_title, desc: t.b4_desc },
            ].map((item, i) => (
              <div key={i} className="col-md-6">
                <div
                  className="card border-0 rounded-4 h-100 p-5 bg-white shadow-sm"
                >
                  <div className="mb-4">
                    <span
                      className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary"
                      style={{ width: 56, height: 56 }}
                    >
                      <i className={`${item.icon} text-white fs-4`}></i>
                    </span>
                  </div>
                  <h5 className="fw-bold text-dark mb-3">{item.title}</h5>
                  <p className="mb-0 text-body-secondary" style={{ lineHeight: 1.75 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why KCT ── */}
      <section className="py-9 py-lg-11 bg-white reveal-fade-in">
        <div className="container">
          <div className="row justify-content-center text-center mb-9">
            <div className="col-lg-7">
              <span className="h6 text-primary fw-bold text-uppercase d-block mb-3">{t.why_label}</span>
              <h2 className="display-5 fw-bold text-dark">{t.why_title}</h2>
            </div>
          </div>
          <div className="row g-4 justify-content-center">
            {[
              { icon: 'bi-patch-check-fill', color: '#1558D6', title: t.w1_title, desc: t.w1_desc },
              { icon: 'bi-bar-chart-fill',   color: '#059669', title: t.w2_title, desc: t.w2_desc },
              { icon: 'bi-truck',             color: '#D97706', title: t.w3_title, desc: t.w3_desc },
              { icon: 'bi-person-check-fill', color: '#0284C7', title: t.w4_title, desc: t.w4_desc },
            ].map((item, i) => (
              <div key={i} className="col-md-6 col-lg-3">
                <div className="card border-0 shadow-sm rounded-4 h-100 p-4 text-center">
                  <div className="mb-4">
                    <span
                      className="d-inline-flex align-items-center justify-content-center rounded-circle"
                      style={{ width: 64, height: 64, backgroundColor: item.color + '18' }}
                    >
                      <i className={`${item.icon} fs-3`} style={{ color: item.color }}></i>
                    </span>
                  </div>
                  <h6 className="fw-bold text-dark mb-3">{item.title}</h6>
                  <p className="mb-0 small" style={{ color: '#555370', lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-9 py-lg-11 bg-primary text-white">
        <div className="container">
          <div className="row align-items-center justify-content-center text-center">
            <div className="col-lg-8">
              <h2 className="display-5 fw-bold text-white mb-4">{t.cta_title}</h2>
              <p className="lead text-white mb-6" style={{ opacity: 0.9 }}>{t.cta_desc}</p>
              <div className="d-flex flex-column flex-md-row justify-content-center gap-3 align-items-stretch align-items-md-center">
                <a
                  href="mailto:sales@kconstrade.com"
                  className="btn btn-outline-white btn-lg px-4 rounded-pill hover-lift d-flex align-items-center justify-content-center"
                >
                  <i className="bi bi-envelope-fill me-2 fs-5"></i>
                  <span>sales@kconstrade.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
