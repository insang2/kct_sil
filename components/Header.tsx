import { getDictionary } from '@/lib/dictionaries';
import Link from 'next/link';
import NavbarClient from '@/components/NavbarClient';

export default async function Header({ lang = 'ko' }: { lang?: 'ko' | 'en' | 'ja' }) {
  const dict = await getDictionary(lang);
  const d = dict as any;

  return (
    <header>
      <nav aria-label={lang === "ko" ? "주 메뉴" : lang === "ja" ? "メインメニュー" : "Main"} className="navbar navbar-expand-lg fixed-top navbar-light bg-white border-bottom shadow-sm">
        <div className="container position-relative">
          <Link className="navbar-brand" href={`/${lang}`} aria-label={lang === "ko" ? "한국건설트레이딩 홈" : "Korea Construction Trading home"}>
            <img
              src="/assets/img/logo/kct_logo.jpeg"
              alt=""
              className="img-fluid"
              style={{ height: '45px', width: 'auto', mixBlendMode: 'multiply' }}
            />
          </Link>

          <NavbarClient
            lang={lang}
            navLabels={{
              home:     d.navigation.home,
              about:    d.navigation.about,
              products: d.navigation.products,
              technical: d.navigation.technical,
              b2b:      d.navigation.b2b,
              export:   d.navigation.export,
              quote:    d.navigation.quote,
              login:    d.navigation.login,
            }}
            userLabels={{ logout: d.auth.btn_logout, mypage: d.navigation.mypage, quote: d.navigation.quote }}
          />
        </div>
      </nav>
    </header>
  );
}
