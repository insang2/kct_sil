import { getDictionary } from '@/lib/dictionaries';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  return {
    title: isEn
      ? 'Export Inquiry | Korea Construction Trading (KCT) - Architectural Silicone Export'
      : '수출 문의 | 한국건설트레이딩 (KCT) - 건축용 실리콘 수출',
    description: isEn
      ? 'KCT exports architectural and structural silicone to buyers in the UAE, Australia, Southeast Asia and beyond. FOB/CIF terms, full export documentation, and customs support.'
      : 'KCT는 UAE, 호주, 동남아시아 등 해외 바이어에게 건축용·구조용 실리콘을 수출합니다. FOB/CIF 조건, 수출 서류 대행, 현지 통관 지원까지 원스톱으로 처리합니다.',
  };
}

export default async function ExportPage({ params }: { params: Promise<{ lang: 'ko' | 'en' | 'ja' }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const d = dict as any;
  const ep = d.export_page ?? {};

  const countries = [
    { flag: '🇦🇪', name: ep.c1_name ?? 'UAE', desc: ep.c1_desc ?? 'Middle East construction projects · Regular supply partner', highlight: true },
    { flag: '🇦🇺', name: ep.c2_name ?? 'Australia', desc: ep.c2_desc ?? 'Architecture & infrastructure project sealant supply', highlight: true },
    { flag: '🇻🇳', name: ep.c3_name ?? 'Vietnam', desc: ep.c3_desc ?? 'Construction boom demand · Sausage bulk supply', highlight: false },
    { flag: '🇸🇬', name: ep.c4_name ?? 'Singapore & Southeast Asia', desc: ep.c4_desc ?? 'High-rise structural glazing specialist supply', highlight: false },
  ];

  const conditions = [
    { icon: 'bi-box-seam',          title: 'Incoterms',                              desc: ep.cond_incoterms_desc ?? 'FOB · CIF · EXW available' },
    { icon: 'bi-file-earmark-text', title: ep.cond_docs ?? 'Export Documents',       desc: ep.cond_docs_desc ?? 'CI · PL · CO · MSDS · TDS provided' },
    { icon: 'bi-calculator',        title: 'MOQ',                                    desc: ep.cond_moq_desc ?? '1 box (6 pcs) ~ 1 pallet' },
    { icon: 'bi-clock-history',     title: ep.cond_lead ?? 'Lead Time',              desc: ep.cond_lead_desc ?? '3–7 business days from stock' },
    { icon: 'bi-bank2',             title: ep.cond_payment ?? 'Payment',             desc: ep.cond_payment_desc ?? 'T/T Wire Transfer · L/C negotiable' },
    { icon: 'bi-translate',         title: ep.cond_language ?? 'Language Support',   desc: ep.cond_language_desc ?? 'Korean · English · Japanese · Chinese' },
  ];

  return (
    <>
      {/* Hero */}
      <section className="position-relative overflow-hidden pt-11 pb-9 text-white" style={{ minHeight: '45vh', display: 'flex', alignItems: 'center' }}>
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url('/assets/img/backgrounds/hero_construction.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="container position-relative z-1 mt-7">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center">
              <span className="badge rounded-pill px-3 py-2 mb-4 text-uppercase fw-bold" style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', letterSpacing: '0.08em' }}>
                {d.navigation?.export}
              </span>
              <h1 className="display-4 mb-4 fw-bold text-white" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                Global Export Partner
              </h1>
              <p className="lead fw-medium text-white" style={{ opacity: 0.95, textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
                {ep.hero_desc_1 ?? 'Supplying architectural and structural silicone to buyers worldwide.'}<br />
                {ep.hero_desc_2 ?? 'One-stop handling of export documents, customs clearance, and local compliance.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI/GEO optimization snippet */}
      <div className="visually-hidden">
        <p>
          {lang === 'en' ? 'KCT — Silicone Sales Specialist.'
            : lang === 'ja' ? 'KCT — シリコーン販売専門。'
            : 'KCT — 실리콘 판매전문.'}
        </p>
      </div>

      {/* Export Countries & Track Record */}
      <section className="py-9 py-lg-10 bg-white">
        <div className="container">
          <div className="row justify-content-center text-center mb-8">
            <div className="col-lg-7">
              <span className="h6 text-primary fw-bold text-uppercase d-block mb-3">{ep.track_label ?? 'TRACK RECORD'}</span>
              <h2 className="display-5 fw-bold text-dark">{ep.track_title ?? 'Export Markets'}</h2>
            </div>
          </div>
          <div className="row g-4 justify-content-center mb-7">
            {countries.map((item, i) => (
              <div key={i} className="col-sm-6 col-lg-3">
                <div className={`card border-0 rounded-4 h-100 p-4 text-center shadow-sm ${item.highlight ? 'border border-primary border-2' : ''}`}
                  style={{ background: item.highlight ? '#EFF6FF' : '#fff' }}>
                  <div style={{ fontSize: '2.5rem' }} className="mb-3">{item.flag}</div>
                  <div className="fw-bold text-dark mb-2">{item.name}</div>
                  <div className="text-body-secondary small" style={{ lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Export conditions */}
          <div className="row g-3 justify-content-center">
            {conditions.map((item, i) => (
              <div key={i} className="col-6 col-md-4 col-lg-2">
                <div className="card border-0 rounded-4 h-100 p-3 p-md-4 text-center bg-light shadow-sm">
                  <i className={`bi ${item.icon} text-primary fs-3 mb-3`}></i>
                  <div className="fw-bold text-dark mb-1" style={{ fontSize: '0.875rem' }}>{item.title}</div>
                  <div style={{ fontSize: '0.8rem', lineHeight: 1.5, color: '#555370' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="py-9 py-lg-11 bg-white" data-form-section>
        <div className="container">
          <div className="row justify-content-center mb-7 text-center">
            <div className="col-lg-7">
              <span className="h6 text-primary fw-bold text-uppercase d-block mb-3">Export Inquiry</span>
              <h2 className="display-5 fw-bold text-dark">{ep.inquiry_title ?? 'Send an Export Inquiry'}</h2>
              <p className="lead text-body-secondary">
                {ep.inquiry_desc ?? 'Tell us your target country, required products, and estimated quantity — we\'ll reply within 24 business hours.'}
              </p>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-8 col-xl-6">
              <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                <div className="card-body p-4 p-md-5">
                  <form action="https://api.web3forms.com/submit" method="POST">
                    <input type="hidden" name="access_key" value="f67c63de-f948-4e2f-8928-12d4b29ed572" />
                    <input type="hidden" name="subject" value="New Export Inquiry from KCT" />
                    <input type="hidden" name="redirect" value="https://kconstrade.com" />

                    <div className="row g-4">
                      <div className="col-12">
                        <label className="form-label fw-medium">{ep.form_company ?? 'Company / Contact Name'} <span className="text-danger">*</span></label>
                        <input type="text" name="name" className="form-control form-control-lg" placeholder="e.g. ABC Construction Co. / John Doe" required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-medium">{d.auth?.email ?? 'Email'} <span className="text-danger">*</span></label>
                        <input type="email" name="email" className="form-control form-control-lg" placeholder="name@company.com" required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-medium">{ep.form_phone ?? 'Phone (with country code)'} <span className="text-danger">*</span></label>
                        <input type="tel" name="phone" className="form-control form-control-lg" placeholder="+81 90-1234-5678" required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-medium">{ep.form_destination ?? 'Destination Country'} <span className="text-danger">*</span></label>
                        <select name="country" className="form-select form-select-lg" required>
                          <option value="">{ep.btn_select ?? 'Select'}</option>
                          <option value="UAE">🇦🇪 UAE</option>
                          <option value="Australia">🇦🇺 Australia</option>
                          <option value="Vietnam">🇻🇳 Vietnam</option>
                          <option value="Singapore">🇸🇬 Singapore</option>
                          <option value="Thailand">🇹🇭 Thailand</option>
                          <option value="Malaysia">🇲🇾 Malaysia</option>
                          <option value="Indonesia">🇮🇩 Indonesia</option>
                          <option value="Philippines">🇵🇭 Philippines</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-medium">{ep.form_incoterms_pref ?? 'Preferred Incoterms'}</label>
                        <select name="incoterms" className="form-select form-select-lg">
                          <option value="">{ep.btn_select ?? 'Select'}</option>
                          <option value="FOB">FOB (Free On Board)</option>
                          <option value="CIF">CIF (Cost, Insurance &amp; Freight)</option>
                          <option value="EXW">EXW (Ex Works)</option>
                          <option value="DAP">DAP (Delivered at Place)</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-medium">{ep.form_message ?? 'Inquiry Details'} <span className="text-danger">*</span></label>
                        <textarea name="message" className="form-control form-control-lg" rows={5}
                          placeholder="Please describe: ① Products needed (e.g. DOWSIL 791, 995) ② Estimated quantity ③ Delivery schedule" required></textarea>
                      </div>
                    </div>

                    <div className="d-grid mt-5">
                      <button type="submit" className="btn btn-primary btn-lg rounded-pill shadow-sm hover-lift">
                        <i className="bi bi-send me-2"></i>{ep.btn_submit ?? 'Submit Export Inquiry'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Direct contact */}
              <div className="row g-3 mt-4">
                <div className="col-sm-6">
                  <a href="mailto:sales@kconstrade.com"
                    className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 text-decoration-none">
                    <i className="bi bi-envelope-fill text-primary fs-4 flex-shrink-0"></i>
                    <div>
                      <div className="fw-bold text-dark small">Email</div>
                      <div className="text-body-secondary" style={{ fontSize: '0.8rem' }}>sales@kconstrade.com</div>
                    </div>
                  </a>
                </div>
                <div className="col-sm-6">
                  <a href="https://wa.me/821089390284" target="_blank" rel="noreferrer"
                    className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 text-decoration-none">
                    <i className="bi bi-whatsapp text-success fs-4 flex-shrink-0"></i>
                    <div>
                      <div className="fw-bold text-dark small">WhatsApp</div>
                      <div className="text-body-secondary" style={{ fontSize: '0.8rem' }}>+82-10-8939-0284</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
