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
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-cover bg-center opacity-50" style={{ backgroundImage: "url('/assets/img/backgrounds/bg3.jpg')" }}></div>
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
    </>
  );
}
