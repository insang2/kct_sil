import { getDictionary } from '@/lib/dictionaries';
import Link from 'next/link';

export default async function Header({ lang = 'ko' }: { lang?: 'ko' | 'en' | 'ja' | 'zh-TW' }) {
  const dict = await getDictionary(lang);

  return (
    <header className="header-transparent sticky-fixed">
      <nav className="navbar navbar-expand-lg fixed-top navbar-light navbar-link-white">
        <div className="navbar-fixed-bg position-absolute"></div>
        <div className="container position-relative z-1">
          <Link className="navbar-brand" href={`/${lang}`}>
            <img src="/assets/img/logo/logo.svg" alt="logo" className="img-fluid navbar-brand-sticky" />
            <img src="/assets/img/logo/logo-white.svg" alt="logo-white" className="img-fluid navbar-brand-transparent" />
          </Link>
          <button className="navbar-toggler order-last" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbarTheme">
            <span className="navbar-toggler-icon"><i></i></span>
          </button>
          <div className="collapse navbar-collapse" id="mainNavbarTheme">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item">
                <Link className="nav-link" href={`/${lang}`}>{dict.navigation.home}</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href={`/${lang}#`}>{dict.navigation.about}</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href={`/${lang}#`}>{dict.navigation.b2b}</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href={`/${lang}#`}>{dict.navigation.export}</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href={`/${lang}#`}>{dict.navigation.resources}</Link>
              </li>
              {/* Language Switcher Dropdown */}
              <li className="nav-item dropdown ms-lg-3">
                <a className="nav-link dropdown-toggle btn btn-sm btn-outline-white rounded-pill px-3 py-1" href="#" id="navbarLang" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="bi bi-globe me-1"></i> {lang.toUpperCase()}
                </a>
                <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0" aria-labelledby="navbarLang">
                  <li><a className="dropdown-item" href="/ko">한국어 (KO)</a></li>
                  <li><a className="dropdown-item" href="/en">English (EN)</a></li>
                  <li><a className="dropdown-item" href="/ja">日本語 (JA)</a></li>
                  <li><a className="dropdown-item" href="/zh-TW">繁體中文 (TW)</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
