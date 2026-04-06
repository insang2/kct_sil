import { getDictionary } from '@/lib/dictionaries';

export default async function Home({ params }: { params: Promise<{ lang: 'ko' | 'en' | 'ja' | 'zh-TW' }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <>
      {/* Hero Slider Area */}
      <section className="position-relative overflow-hidden bg-dark" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <div className="container position-relative z-1 pt-9 pb-9">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center text-white">
              <h1 className="display-4 mb-4 fw-bold">{dict.hero.title}</h1>
              <p className="lead mb-5 opacity-75">
                {dict.hero.description_1}<br />
                {dict.hero.description_2}
              </p>
              <div className="d-flex justify-content-center gap-3">
                <a href="#!" className="btn btn-primary btn-lg">{dict.hero.btn_products}</a>
                <a href="#!" className="btn btn-outline-white btn-lg">{dict.hero.btn_b2b}</a>
              </div>
            </div>
          </div>
        </div>
        {/* Background Image with darker overlay for readability */}
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-cover bg-center" 
             style={{ 
               backgroundImage: "url('/assets/img/backgrounds/hero_construction.png')",
               backgroundBlendMode: 'overlay',
               backgroundColor: 'rgba(0,0,0,0.6)' 
             }}>
        </div>
      </section>

      {/* Features section */}
      <section className="position-relative border-bottom py-9 py-lg-11">
        <div className="container">
          <div className="row justify-content-center mb-9 text-center">
            <div className="col-lg-8">
              <span className="h6 text-primary fw-bold text-uppercase">{dict.features.label}</span>
              <h2 className="display-4 mb-0 fw-bold">{dict.features.title}</h2>
            </div>
          </div>
          <div className="row justify-content-around">
            <div className="col-12 col-lg-4 mb-7 mb-lg-0 text-center">
              <div className="mb-4 position-relative display-5 fw-normal text-primary">
                <i className="icon-Repeat-2 position-relative"></i>
              </div>
              <h5 className="mb-3">{dict.features.f1_title}</h5>
              <p className="mb-3 px-lg-3 text-dark opacity-75 fw-normal">{dict.features.f1_desc}</p>
            </div>
            <div className="col-12 col-lg-4 mb-7 mb-lg-0 text-center">
              <div className="mb-4 position-relative display-5 fw-normal text-primary">
                <i className="icon-Truck position-relative"></i>
              </div>
              <h5 className="mb-3">{dict.features.f2_title}</h5>
              <p className="mb-3 px-lg-3 text-dark opacity-75 fw-normal">{dict.features.f2_desc}</p>
            </div>
            <div className="col-12 col-lg-4 text-center">
              <div className="mb-4 position-relative display-5 fw-normal text-primary">
                <i className="icon-File-Edit position-relative"></i>
              </div>
              <h5 className="mb-3">{dict.features.f3_title}</h5>
              <p className="mb-3 px-lg-3 text-dark opacity-75 fw-normal">{dict.features.f3_desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Display Section */}
      <section className="py-9 py-lg-11 bg-light">
        <div className="container">
          <div className="row justify-content-center mb-9 text-center">
            <div className="col-lg-8">
              <span className="h6 text-primary fw-bold text-uppercase">{dict.products.label}</span>
              <h2 className="display-4 mb-0 fw-bold">{dict.products.title}</h2>
            </div>
          </div>
          
          <div className="row g-4 justify-content-center">
            {/* Dow Silicones */}
            <div className="col-md-6 col-lg-5">
              <div className="card h-100 border-0 shadow-sm rounded-4 hover-lift">
                <div className="card-body p-5 text-center">
                  <div className="mb-4 text-primary">
                    <i className="icon-Building display-4"></i>
                  </div>
                  <h5 className="card-title text-dark fw-bold mb-3">{dict.products.dow_title}</h5>
                  <p className="card-text text-dark opacity-75 fw-normal mb-4">
                    {dict.products.dow_desc_1}<br />{dict.products.dow_desc_2}
                  </p>
                  <ul className="list-unstyled text-start text-dark opacity-75 fw-normal mb-4 mx-auto" style={{maxWidth: '280px', fontSize: '0.9rem'}}>
                    {dict.products.dow_items.map((item: string, idx: number) => (
                      <li key={idx} className="mb-2"><i className="bi bi-check-circle-fill text-primary me-2"></i>{item}</li>
                    ))}
                  </ul>
                  <a href="https://www.dow.com/ko-kr/search.html#first=10&t=Products&sort=relevancy" target="_blank" rel="noreferrer" className="btn btn-primary rounded-pill px-4">{dict.products.dow_btn}</a>
                </div>
              </div>
            </div>

            {/* Topseal Products */}
            <div className="col-md-6 col-lg-5">
              <div className="card h-100 border-0 shadow-sm rounded-4 hover-lift">
                <div className="card-body p-5 text-center">
                  <div className="mb-4 text-primary">
                    <i className="icon-Paint-Brush display-4"></i>
                  </div>
                  <h5 className="card-title text-dark fw-bold mb-3">{dict.products.topseal_title}</h5>
                  <p className="card-text text-secondary mb-4">
                    {dict.products.topseal_desc_1}<br />{dict.products.topseal_desc_2}
                  </p>
                  <a href="https://topseal.co.kr/product/all-product-page/" target="_blank" rel="noreferrer" className="btn btn-primary rounded-pill px-4">{dict.products.topseal_btn}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Small Orders (Retail) Section */}
      <section className="py-9 py-lg-11 border-top bg-white">
        <div className="container">
          <div className="row justify-content-center mb-8 text-center">
            <div className="col-lg-8">
              <span className="h6 text-primary fw-bold text-uppercase">{dict.retail.label}</span>
              <h2 className="display-4 mb-3 fw-bold">{dict.retail.title}</h2>
              <p className="lead text-dark font-weight-medium">{dict.retail.description}</p>
            </div>
          </div>
          <div className="row g-3 justify-content-center">
            {[
              { id: 'naver', icon: 'bi-shop', color: 'text-success' },
              { id: '11st', icon: 'bi-handbag', color: 'text-danger' },
              { id: 'gmarket', icon: 'bi-cart-check', color: 'text-primary' },
              { id: 'coupang', icon: 'bi-lightning-fill', color: 'text-warning' },
              { id: 'pps', icon: 'bi-building', color: 'text-dark' }
            ].map((shop) => (
              <div key={shop.id} className="col-6 col-sm-4 col-md-3 col-lg-2">
                <a href="#!" className="card h-100 border-0 bg-dark shadow-sm rounded-4 text-decoration-none hover-lift text-center py-4 px-2">
                  <div className={`mb-2 fs-3 ${shop.color}`}>
                    <i className={`bi ${shop.icon}`}></i>
                  </div>
                  <h6 className="mb-0 text-white small fw-bold">{(dict.retail.shops as any)[shop.id]}</h6>
                </a>
              </div>
            ))}
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
              <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                <a href="tel:+821012345678" className="btn btn-dark btn-lg px-4 rounded-pill shadow-sm hover-lift">
                  <i className="bi bi-telephone-fill me-2"></i>{dict.cta.btn_phone}
                </a>
                <a href="https://wa.me/821012345678" target="_blank" rel="noreferrer" className="btn btn-outline-white btn-lg px-4 rounded-pill hover-lift">
                  <i className="bi bi-whatsapp me-2"></i>{dict.cta.btn_whatsapp}
                </a>
                <a href="mailto:sales@korcta.com" className="btn btn-outline-white btn-lg px-4 rounded-pill hover-lift">
                  <i className="bi bi-envelope-fill me-2"></i>{dict.cta.btn_email}
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* Background decorative elements */}
        <div className="position-absolute top-0 end-0 mt-n5 me-n5 opacity-25">
           <img src="/assets/img/vectors/pattern-dots.svg" alt="pattern" width="300" height="300" />
        </div>
      </section>
    </>
  );
}
