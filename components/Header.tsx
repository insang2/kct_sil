import { getDictionary } from '@/lib/dictionaries';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import UserMenu from '@/components/UserMenu';
import NavbarClient from '@/components/NavbarClient';

export default async function Header({ lang = 'ko' }: { lang?: 'ko' | 'en' | 'ja' }) {
  const dict = await getDictionary(lang);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const d = dict as any;

  const userSlot = user ? (
    <UserMenu
      lang={lang}
      userEmail={user.email ?? null}
      logoutLabel={d.auth.btn_logout}
      mypageLabel={d.navigation.mypage}
      quoteLabel={d.navigation.quote}
    />
  ) : undefined;

  return (
    <header>
      <nav className="navbar navbar-expand-lg fixed-top navbar-light bg-white border-bottom shadow-sm">
        <div className="container position-relative">
          <Link className="navbar-brand" href={`/${lang}`}>
            <img
              src="/assets/img/logo/kct_logo.jpeg"
              alt="KCT Logo"
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
              b2b:      d.navigation.b2b,
              export:   d.navigation.export,
              quote:    d.navigation.quote,
              login:    d.navigation.login,
            }}
            userSlot={userSlot}
          />
        </div>
      </nav>
    </header>
  );
}
