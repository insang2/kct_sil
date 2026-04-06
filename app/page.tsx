export default function Home() {
  return (
    <>
      {/* Hero Slider Area */}
      <section className="position-relative overflow-hidden bg-dark" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        {/* We can use the simple hero version until we implement the full MasterSlider */}
        <div className="container position-relative z-1 pt-9 pb-9">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center text-white">
              <h1 className="display-4 mb-4 fw-bold">건설 자재 유통의 새로운 기준</h1>
              <p className="lead mb-5 opacity-75">
                현장 소장님을 위한 B2B 특별 단가 및 간편 발주 시스템.<br />
                일반 소비자를 위한 빠르고 안전한 배송.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <a href="#!" className="btn btn-primary btn-lg">제품 둘러보기</a>
                <a href="#!" className="btn btn-outline-white btn-lg">B2B 무료 견적</a>
              </div>
            </div>
          </div>
        </div>
        {/* Background Image Placeholder */}
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-cover bg-center opacity-50" style={{ backgroundImage: "url('/assets/img/backgrounds/hero_construction.png')" }}></div>
      </section>

      {/* Features section */}
      <section className="position-relative border-bottom py-9 py-lg-11">
        <div className="container">
          <div className="row justify-content-center mb-9 text-center">
            <div className="col-lg-8">
              <span className="h6 text-body-secondary">KCT 장점</span>
              <h2 className="display-5 mb-0">왜 한국건설트레이딩인가요?</h2>
            </div>
          </div>
          <div className="row justify-content-around">
            <div className="col-12 col-lg-4 mb-7 mb-lg-0 text-center">
              <div className="mb-4 position-relative display-5 fw-normal text-primary">
                <i className="icon-Repeat-2 position-relative"></i>
              </div>
              <h5 className="mb-3">간편한 재주문 및 발주</h5>
              <p className="mb-3 px-lg-3 text-muted">
                이전 현장에서 구매했던 자재 리스트를 원클릭으로 다시 주문할 수 있습니다.
              </p>
            </div>
            <div className="col-12 col-lg-4 mb-7 mb-lg-0 text-center">
              <div className="mb-4 position-relative display-5 fw-normal text-primary">
                <i className="icon-Truck position-relative"></i>
              </div>
              <h5 className="mb-3">다중 현장 분할 배송</h5>
              <p className="mb-3 px-lg-3 text-muted">
                한 번의 결제로 여러 건설 현장에 배송지를 다르게 지정해 받아보실 수 있습니다.
              </p>
            </div>
            <div className="col-12 col-lg-4 text-center">
              <div className="mb-4 position-relative display-5 fw-normal text-primary">
                <i className="icon-File-Edit position-relative"></i>
              </div>
              <h5 className="mb-3">견적서/세금계산서 자동화</h5>
              <p className="mb-3 px-lg-3 text-muted">
                기업 로그인 시 복잡한 세금 증빙 절차를 웹에서 쉽게 다운로드 및 신청 가능합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Display Section */}
      <section className="py-9 py-lg-11 bg-light">
        <div className="container">
          <div className="row justify-content-center mb-9 text-center">
            <div className="col-lg-8">
              <span className="h6 text-primary">상품 안내</span>
              <h2 className="display-5 mb-0">주요 취급 브랜드 및 제품</h2>
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
                  <h5 className="card-title text-dark fw-bold mb-3">다우실리콘 (DOWSIL)</h5>
                  <p className="card-text text-muted mb-4">
                    건축용 접착제 및 실란트.<br />우수한 내후성과 접착력을 자랑하는 프리미엄 제품군입니다.
                  </p>
                  <ul className="list-unstyled text-start text-muted mb-4 mx-auto" style={{maxWidth: '280px', fontSize: '0.9rem'}}>
                    <li className="mb-2"><i className="bi bi-check-circle-fill text-primary me-2"></i>DOWSIL™ 789 전천후 실리콘 실란트</li>
                    <li className="mb-2"><i className="bi bi-check-circle-fill text-primary me-2"></i>DOWSIL™ 991 고성능 실리콘 실란트</li>
                    <li className="mb-2"><i className="bi bi-check-circle-fill text-primary me-2"></i>DOWSIL™ 791 건축용 웨더실</li>
                    <li className="mb-2"><i className="bi bi-check-circle-fill text-primary me-2"></i>DOWSIL™ 895 구조용 실리콘 실란트</li>
                  </ul>
                  <a href="https://www.dow.com/ko-kr/search.html#first=10&t=Products&sort=relevancy&f:@dow_producttechnology_hierarchy=[%EC%A0%91%EC%B0%A9%EC%A0%9C%20%EB%B0%8F%20%EC%8B%A4%EB%9E%80%ED%8A%B8,%EA%B1%B4%EC%B6%95%EC%9A%A9%20%EC%A0%91%EC%B0%A9%EC%A0%9C%20%EB%B0%8F%20%EC%8B%A4%EB%9E%80%ED%8A%B8]" target="_blank" rel="noreferrer" className="btn btn-primary rounded-pill px-4">다우실리콘 자재 보기</a>
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
                  <h5 className="card-title text-dark fw-bold mb-3">탑실 (Topseal)</h5>
                  <p className="card-text text-muted mb-4">
                    실란트, 카트리지, 우레탄 폼 등.<br />건설 현장에 최적화된 탑프라의 고품질 건축 자재입니다.
                  </p>
                  <a href="https://topseal.co.kr/product/all-product-page/" target="_blank" rel="noreferrer" className="btn btn-primary rounded-pill px-4">탑실 제품 전체보기</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
