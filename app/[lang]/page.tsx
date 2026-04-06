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
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-cover bg-center opacity-50" style={{ backgroundImage: "url('/assets/img/backgrounds/hero_construction.png')" }}></div>
      </section>

      {/* Features section */}
      <section className="position-relative border-bottom py-9 py-lg-11">
        <div className="container">
          <div className="row justify-content-center mb-9 text-center">
            <div className="col-lg-8">
              <span className="h6 text-body-secondary">{dict.features.label}</span>
              <h2 className="display-5 mb-0">{dict.features.title}</h2>
            </div>
          </div>
          <div className="row justify-content-around">
            <div className="col-12 col-lg-4 mb-7 mb-lg-0 text-center">
              <div className="mb-4 position-relative display-5 fw-normal text-primary">
                <i className="icon-Repeat-2 position-relative"></i>
              </div>
              <h5 className="mb-3">{dict.features.f1_title}</h5>
              <p className="mb-3 px-lg-3 text-muted">{dict.features.f1_desc}</p>
            </div>
            <div className="col-12 col-lg-4 mb-7 mb-lg-0 text-center">
              <div className="mb-4 position-relative display-5 fw-normal text-primary">
                <i className="icon-Truck position-relative"></i>
              </div>
              <h5 className="mb-3">{dict.features.f2_title}</h5>
              <p className="mb-3 px-lg-3 text-muted">{dict.features.f2_desc}</p>
            </div>
            <div className="col-12 col-lg-4 text-center">
              <div className="mb-4 position-relative display-5 fw-normal text-primary">
                <i className="icon-File-Edit position-relative"></i>
              </div>
              <h5 className="mb-3">{dict.features.f3_title}</h5>
              <p className="mb-3 px-lg-3 text-muted">{dict.features.f3_desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Display Section */}
      <section className="py-9 py-lg-11 bg-light">
        <div className="container">
          <div className="row justify-content-center mb-9 text-center">
            <div className="col-lg-8">
              <span className="h6 text-primary">{dict.products.label}</span>
              <h2 className="display-5 mb-0">{dict.products.title}</h2>
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
                  <p className="card-text text-muted mb-4">
                    {dict.products.dow_desc_1}<br />{dict.products.dow_desc_2}
                  </p>
                  <ul className="list-unstyled text-start text-muted mb-4 mx-auto" style={{maxWidth: '280px', fontSize: '0.9rem'}}>
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
                  <p className="card-text text-muted mb-4">
                    {dict.products.topseal_desc_1}<br />{dict.products.topseal_desc_2}
                  </p>
                  <a href="https://topseal.co.kr/product/all-product-page/" target="_blank" rel="noreferrer" className="btn btn-primary rounded-pill px-4">{dict.products.topseal_btn}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
