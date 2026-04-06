export default function Header() {
  return (
    <header className="header-transparent sticky-fixed">
      <nav className="navbar navbar-expand-lg fixed-top navbar-light navbar-link-white">
        <div className="navbar-fixed-bg position-absolute"></div>
        <div className="container position-relative z-1">
          <a className="navbar-brand" href="/">
            <img src="/assets/img/logo/logo.svg" alt="logo" className="img-fluid navbar-brand-sticky" />
            <img src="/assets/img/logo/logo-white.svg" alt="logo-white" className="img-fluid navbar-brand-transparent" />
          </a>
          <button className="navbar-toggler order-last" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbarTheme">
            <span className="navbar-toggler-icon"><i></i></span>
          </button>
          <div className="collapse navbar-collapse" id="mainNavbarTheme">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link active" href="/">홈</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#!">상품 안내</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#!">B2B 견적</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#!">고객지원</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
