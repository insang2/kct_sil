import { getDictionary } from '@/lib/dictionaries';
import Script from 'next/script';

export default async function Home({ params }: { params: Promise<{ lang: 'ko' | 'en' | 'ja' }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const isEn = lang === 'en';

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `https://kconstrade.com/${lang}/#website`,
        "url": `https://kconstrade.com/${lang}`,
        "name": dict.metadata?.title || "Korea Construction Trading (KCT)",
        "description": dict.metadata?.description || "Architectural and structural silicone wholesale and export.",
        "publisher": {
          "@id": "https://kconstrade.com/#organization"
        },
        "inLanguage": lang
      },
      {
        "@type": "LocalBusiness",
        "@id": `https://kconstrade.com/${lang}/#localbusiness`,
        "name": isEn ? "Korea Construction Trading (KCT)" : "한국건설트레이딩 (Korea Construction Trading)",
        "image": "https://kconstrade.com/assets/img/logo/kct_logo.jpeg",
        "url": "https://kconstrade.com",
        "telephone": "+82-10-8939-0284",
        "email": "sales@kconstrade.com",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "충민로 10 4-A19 가든파이브툴",
          "addressLocality": "송파구",
          "addressRegion": "서울특별시",
          "postalCode": "05840",
          "addressCountry": "KR"
        },
        "priceRange": "$$",
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "09:00",
          "closes": "18:00"
        }
      },
      {
        "@type": "FAQPage",
        "@id": `https://kconstrade.com/${lang}/#faq`,
        "mainEntity": isEn ? [
          {
            "@type": "Question",
            "name": "What products do you supply?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Korea Construction Trading (KCT) specializes exclusively in Dow Chemical architectural and structural silicone sealants — weathersealing, structural glazing, and specialty grades. We do not source other construction materials."
            }
          },
          {
            "@type": "Question",
            "name": "Do you export architectural silicone globally?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, we are a major exporter of architectural silicone sealants to international buyers in Japan, Taiwan, Southeast Asia, and worldwide."
            }
          },
          {
            "@type": "Question",
            "name": "How can I purchase your silicone products?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Contact us by phone, email, or WhatsApp with the product and quantity you need. Our team will confirm stock and pricing, and you can complete your purchase right after the consultation."
            }
          },
          {
            "@type": "Question",
            "name": "Are there benefits for B2B bulk purchases?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Absolutely. We offer special B2B wholesale pricing, split delivery services, and comprehensive export documentation for large construction projects and international buyers."
            }
          }
        ] : [
          {
            "@type": "Question",
            "name": "어떤 제품을 취급하나요?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "한국건설트레이딩(KCT)은 Dow Chemical의 건축용·구조용 실리콘 전문 판매 기업입니다. 내후성 실란트, 구조용 실란트, 특수 실란트 등 건축용 실리콘 전 라인업을 취급하며, 실리콘 외 다른 건설자재는 취급하지 않습니다."
            }
          },
          {
            "@type": "Question",
            "name": "제품 구매는 어떻게 하나요?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "전화, 이메일, 카카오톡, WhatsApp 중 편하신 방법으로 문의해 주시면 담당자가 재고와 단가를 안내해 드리며, 상담 후 바로 구매하실 수 있습니다."
            }
          },
          {
            "@type": "Question",
            "name": "B2B 대량 구매 시 혜택이 있나요?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "네, 현장 소장님 및 건설사를 위한 특별 B2B 단가를 제공하며, 다중 현장 분할 배송 및 세금계산서 발행, 맞춤 견적 서비스를 제공합니다."
            }
          },
          {
            "@type": "Question",
            "name": "배송 기간은 얼마나 걸리나요?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "수도권은 당일 또는 익일 배송이 가능하며, 전국 어디든 2~3일 이내에 신속하게 납품해 드립니다."
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <Script id="structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      {/* Hero Slider Area */}
      <section className="position-relative overflow-hidden bg-white" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <div className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundImage: "linear-gradient(rgba(0,0,0,0.70), rgba(0,0,0,0.50)), url('/assets/img/backgrounds/hero_construction.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}>
        </div>
        <div className="container position-relative z-1 py-9">
          <div className="row align-items-center">
            <div className="col-lg-10 col-xl-8 mx-auto text-center text-white">
              <span className="badge rounded-pill px-3 py-2 mb-4 d-inline-block" style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(4px)', fontSize: '0.8rem', letterSpacing: '0.06em', border: '1px solid rgba(255,255,255,0.3)' }}>
                건축용실리콘 취급업체 · Korea Construction Trading
              </span>
              <h1 className="display-2 mb-4 fw-bold text-white" style={{ lineHeight: 1.15, textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
                {dict.hero.title}
              </h1>
              <p className="lead mb-5 text-white fw-normal" style={{ fontSize: '1.15rem', opacity: 1, textShadow: '0 1px 6px rgba(0,0,0,0.35)' }}>
                {dict.hero.description_1}<br className="d-none d-sm-block" />
                {dict.hero.description_2}
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <a href="https://wa.me/821089390284" target="_blank" rel="noreferrer" className="btn btn-primary btn-lg px-4 px-md-5 rounded-pill fw-bold shadow-lg hover-lift">
                  <i className="bi bi-whatsapp me-2"></i>{dict.cta.btn_whatsapp}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="bg-white border-bottom py-3">
        <div className="container">
          <div className="row justify-content-center g-2 g-md-0">
            {[
              { icon: 'bi-building-check',   text: (dict as any).trust?.t2 ?? 'Business Reg. No. 371-07-03719' },
              { icon: 'bi-globe2',           text: (dict as any).trust?.t4 ?? 'Exporting to Japan · Taiwan · Southeast Asia' },
            ].map((item, i) => (
              <div key={i} className="col-6 col-md-4 d-flex align-items-center justify-content-center gap-2 px-2">
                <i className={`bi ${item.icon} text-primary flex-shrink-0`} style={{ fontSize: '0.9rem' }}></i>
                <span style={{ fontSize: '0.78rem', color: '#444261', lineHeight: 1.3, wordBreak: 'keep-all' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features section */}
      <section className="position-relative border-bottom py-9 py-lg-11 bg-white reveal-fade-in">
        <div className="container">
          <div className="row justify-content-center mb-9 text-center">
            <div className="col-lg-8">
              <span className="h6 text-primary fw-bold text-uppercase">{dict.features.label}</span>
              <h2 className="display-4 mb-0 fw-bold text-dark">{dict.features.title}</h2>
            </div>
          </div>
          <div className="row justify-content-around">
            <div className="col-12 col-lg-4 mb-7 mb-lg-0 text-center">
              <div className="mb-4 position-relative fw-normal text-primary" style={{ fontSize: '3.5rem' }}>
                <i className="icon-Repeat-2 position-relative"></i>
              </div>
              <h5 className="mb-3 text-dark">{dict.features.f1_title}</h5>
              <p className="mb-3 px-lg-3 text-body-secondary fw-normal">{dict.features.f1_desc}</p>
            </div>
            <div className="col-12 col-lg-4 mb-7 mb-lg-0 text-center">
              <div className="mb-4 position-relative fw-normal text-primary" style={{ fontSize: '3.5rem' }}>
                <i className="icon-Truck position-relative"></i>
              </div>
              <h5 className="mb-3 text-dark">{dict.features.f2_title}</h5>
              <p className="mb-3 px-lg-3 text-body-secondary fw-normal">{dict.features.f2_desc}</p>
            </div>
            <div className="col-12 col-lg-4 text-center">
              <div className="mb-4 position-relative fw-normal text-primary" style={{ fontSize: '3.5rem' }}>
                <i className="icon-File-Edit position-relative"></i>
              </div>
              <h5 className="mb-3 text-dark">{dict.features.f3_title}</h5>
              <p className="mb-3 px-lg-3 text-body-secondary fw-normal">{dict.features.f3_desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-9 py-lg-11 bg-white reveal-fade-in">
        <div className="container">
          <div className="row justify-content-center text-center mb-9">
            <div className="col-lg-7">
              <span className="h6 text-primary fw-bold text-uppercase">{(dict as any).process?.label ?? 'HOW IT WORKS'}</span>
              <h2 className="display-4 fw-bold text-dark">{(dict as any).process?.title ?? 'Simple 4-Step Process'}</h2>
            </div>
          </div>
          <div className="row g-4 align-items-start">
            {(((dict as any).process?.steps ?? [
              { title: 'Submit Inquiry',  desc: 'Contact us by phone, email, or WhatsApp with the materials and quantities you need.' },
              { title: 'Custom Quote',   desc: 'We send a detailed quotation with pricing and delivery schedule within 24 hours.' },
              { title: 'Confirm Order',  desc: 'Agree on payment terms and confirm your order. Tax invoice available.' },
              { title: 'Fast Delivery',  desc: 'Same/next-day in Seoul metro area; 2–3 days nationwide. Multi-site split delivery.' },
            ]) as Array<{title:string;desc:string}>).map((item, i) => (
              <div key={i} className="col-sm-6 col-lg-3 text-center">
                <div className="position-relative">
                  {i < 3 && (
                    <div className="d-none d-lg-block position-absolute top-50 start-100 translate-middle-y"
                      style={{ width: '100%', borderTop: '2px dashed #CBD5E1', zIndex: 0 }}></div>
                  )}
                  <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary text-white fw-bold mb-4 position-relative"
                    style={{ width: 64, height: 64, fontSize: '1.1rem', zIndex: 1 }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                </div>
                <h6 className="fw-bold text-dark mb-2">{item.title}</h6>
                <p className="text-body-secondary small mb-0" style={{ lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* B2B Quote Request Form Section */}
      <section id="b2b-form" className="py-9 py-lg-11 reveal-fade-in" data-form-section>
        <div className="container">
          <div className="row justify-content-center mb-7 text-center">
            <div className="col-lg-8">
              <span className="h6 text-primary fw-bold text-uppercase">{dict.hero.btn_b2b}</span>
              <h2 className="display-4 mb-3 fw-bold">{(dict as any).b2b_form?.title ?? 'Free B2B Quote Request'}</h2>
              <p className="lead">{(dict as any).b2b_form?.desc ?? 'Get rapid pricing for the bulk architectural silicone needed for your project.'}</p>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-8 col-xl-6">
              <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                <div className="card-body p-4 p-md-5">
                  <form action="https://api.web3forms.com/submit" method="POST">
                    <input type="hidden" name="access_key" value="f67c63de-f948-4e2f-8928-12d4b29ed572" />
                    <input type="hidden" name="subject" value="New B2B Quote Request from KCT" />
                    <input type="hidden" name="redirect" value="https://kconstrade.com" />

                    <div className="mb-4">
                      <label className="form-label">{(dict as any).b2b_form?.form_name ?? 'Company / Contact Name'}</label>
                      <input type="text" name="name" className="form-control form-control-lg" placeholder={(dict as any).b2b_form?.form_name_ph ?? 'e.g. ABC Construction / John Doe'} required />
                    </div>

                    <div className="mb-4">
                      <label className="form-label">{(dict as any).auth?.email ?? 'Email'}</label>
                      <input type="email" name="email" className="form-control form-control-lg" placeholder="name@company.com" required />
                    </div>

                    <div className="mb-4">
                      <label className="form-label">{(dict as any).auth?.phone ?? 'Phone'}</label>
                      <input type="tel" name="phone" className="form-control form-control-lg" placeholder="+82 10-1234-5678" required />
                    </div>

                    <div className="mb-4">
                      <label className="form-label">{(dict as any).b2b_form?.form_message ?? 'Inquiry Details'}</label>
                      <textarea name="message" className="form-control form-control-lg" rows={5} placeholder={(dict as any).b2b_form?.form_message_ph ?? 'Please include the materials, quantities, and site location.'} required></textarea>
                    </div>

                    <div className="d-grid mt-5">
                      <button type="submit" className="btn btn-primary btn-lg rounded-pill shadow-sm hover-lift">{(dict as any).b2b_form?.btn_submit ?? 'Submit Quote Request'}</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-9 py-lg-11 position-relative overflow-hidden bg-primary text-white">
        <div className="container position-relative z-1">
          <div className="row align-items-center justify-content-center text-center">
            <div className="col-xl-8 col-lg-9">
              <h2 className="display-4 fw-bold mb-4">{dict.cta.title}</h2>
              <p className="lead mb-5 text-white fw-medium" style={{ opacity: 0.9 }}>{dict.cta.description}</p>
              <div className="row g-3 justify-content-center">
                <div className="col-12 col-sm-6 col-md-auto">
                  <a href="https://wa.me/821089390284" target="_blank" rel="noreferrer" className="btn btn-outline-white btn-lg px-4 rounded-pill hover-lift d-flex align-items-center justify-content-center w-100">
                    <i className="bi bi-whatsapp me-2 fs-5"></i>
                    <span>{dict.cta.btn_whatsapp}</span>
                  </a>
                </div>
                <div className="col-12 col-sm-6 col-md-auto">
                  <a href="mailto:sales@kconstrade.com" className="btn btn-outline-white btn-lg px-4 rounded-pill hover-lift d-flex align-items-center justify-content-center w-100">
                    <i className="bi bi-envelope-fill me-2 fs-5"></i>
                    <span>{dict.cta.btn_email}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Background decorative elements */}
        <div className="position-absolute top-0 end-0 mt-n5 me-n5 opacity-25">
           <img src="/assets/img/vectors/pattern-dots.svg" alt="pattern" width="300" height="300" />
        </div>
      </section>
      {/* Location / Map Section */}
      <section className="py-9 py-lg-11 bg-light text-dark">
        <div className="container">
          <div className="row justify-content-center mb-7 text-center">
            <div className="col-lg-8">
              <span className="h6 text-primary fw-bold text-uppercase">Location</span>
              <h2 className="display-4 mb-3 fw-bold text-dark">오시는 길</h2>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-12">
              <div className="card border-0 shadow-lg overflow-hidden rounded-4">
                <iframe
                  src="https://maps.google.com/maps?q=37.478626,127.1192753&hl=ko&z=16&output=embed"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Map"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
