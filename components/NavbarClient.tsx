'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import UserMenu from '@/components/UserMenu';

interface NavbarClientProps {
  lang: string;
  navLabels: {
    home: string;
    about: string;
    sustainability: string;
    products: string;
    technical: string;
    b2b: string;
    export: string;
    quote: string;
    inquiry: string;
    login: string;
  };
  userLabels: { logout: string; mypage: string; quote: string };
}

type LangKey = 'ko' | 'en' | 'ja';
type DropdownKey = 'about' | 'technical';

const LANGS = [
  { code: 'ko', label: '한국어 (KO)' },
  { code: 'en', label: 'English (EN)' },
  { code: 'ja', label: '日本語 (JA)' },
] as const;

const ABOUT_SUB: { hash: string; ko: string; en: string; ja: string }[] = [
  { hash: 'greeting', ko: '인사말', en: 'Greeting', ja: 'ご挨拶' },
  { hash: 'history', ko: '연혁', en: 'History', ja: '沿革' },
  { hash: 'quality', ko: '품질·환경·안전', en: 'Quality · EHS', ja: '品質・環境・安全' },
  { hash: 'locations', ko: '사업장', en: 'Locations', ja: '事業所' },
];

const TECH_SUB: { path: string; ko: string; en: string; ja: string }[] = [
  { path: 'technical', ko: '내화 실란트 기술 매뉴얼', en: 'Fire-rated sealant manual', ja: '耐火シーラント技術マニュアル' },
  { path: 'technical/industrial', ko: '산업·가전·유지보수 선정 가이드', en: 'Industrial & appliance guide', ja: '産業・家電・メンテナンス用ガイド' },
  { path: 'technical/basics', ko: '실리콘 일반 교육', en: 'Silicone basics training', ja: 'シリコーン基礎教育' },
  { path: 'technical/psa', ko: '실리콘 점착제(PSA) 선택 요령', en: 'Silicone PSA selection guide', ja: 'シリコーンPSA選定ガイド' },
  { path: 'technical/selection', ko: 'DOWSIL 실란트 비교·선택', en: 'Sealant comparison guide', ja: 'シーラント比較・選定' },
  { path: 'technical/tapes', ko: '전기·전자 테이프용 PSA', en: 'Electrical tape PSAs', ja: '電気・電子テープ用PSA' },
];

const A11Y_LABEL: Record<
  LangKey,
  { nav: string; homeAria: string; open: string; close: string; lang: string; sub: string }
> = {
  ko: {
    nav: '주 메뉴',
    homeAria: '한국건설트레이딩 홈',
    open: '메뉴 열기',
    close: '메뉴 닫기',
    lang: '언어 선택',
    sub: '하위 메뉴',
  },
  en: {
    nav: 'Primary',
    homeAria: 'Korea Construction Trading home',
    open: 'Open menu',
    close: 'Close menu',
    lang: 'Select language',
    sub: 'submenu',
  },
  ja: {
    nav: 'メイン',
    homeAria: '韓国建設トレーディング ホーム',
    open: 'メニューを開く',
    close: 'メニューを閉じる',
    lang: '言語を選択',
    sub: 'サブメニュー',
  },
};

export default function NavbarClient({ lang, navLabels, userLabels }: NavbarClientProps) {
  const langKey: LangKey = lang === 'en' || lang === 'ja' ? lang : 'ko';
  const a11y = A11Y_LABEL[langKey];

  // 세션은 브라우저에서 조회 → 공개 페이지를 정적(캐시 가능)으로 유지
  const [userEmail, setUserEmail] = useState<string | null>(null);
  useEffect(() => {
    const sb = createClient();
    sb.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? null));
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) =>
      setUserEmail(session?.user?.email ?? null),
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [openSub, setOpenSub] = useState<DropdownKey | null>(null);
  const [hoverPreview, setHoverPreview] = useState<DropdownKey | null>(null);

  const pathname = usePathname();
  const aboutRef = useRef<HTMLLIElement>(null);
  const aboutBtnRef = useRef<HTMLButtonElement>(null);
  const techRef = useRef<HTMLLIElement>(null);
  const techBtnRef = useRef<HTMLButtonElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const langBtnRef = useRef<HTMLButtonElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  // Subtle scrolled hairline state
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setLangOpen(false);
    setOpenSub(null);
    setHoverPreview(null);
  }, [pathname]);

  // Close dropdowns on outside click
  useEffect(() => {
    if (!langOpen && !openSub) return;
    function handleOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (langRef.current && !langRef.current.contains(target)) setLangOpen(false);
      if (
        openSub === 'about' &&
        aboutRef.current &&
        !aboutRef.current.contains(target)
      ) {
        setOpenSub(null);
        setHoverPreview(null);
      }
      if (
        openSub === 'technical' &&
        techRef.current &&
        !techRef.current.contains(target)
      ) {
        setOpenSub(null);
        setHoverPreview(null);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [langOpen, openSub]);

  // Escape key closes open dropdowns / mobile menu and restores trigger focus
  useEffect(() => {
    if (!menuOpen && !langOpen && !openSub) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      const active = document.activeElement;
      if (langOpen) {
        setLangOpen(false);
        if (langRef.current?.contains(active)) langBtnRef.current?.focus();
        return;
      }
      if (openSub) {
        const prev = openSub;
        setOpenSub(null);
        setHoverPreview(null);
        if (prev === 'about' && aboutRef.current?.contains(active)) {
          aboutBtnRef.current?.focus();
        } else if (prev === 'technical' && techRef.current?.contains(active)) {
          techBtnRef.current?.focus();
        }
        return;
      }
      if (menuOpen) {
        setMenuOpen(false);
        menuBtnRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen, langOpen, openSub]);

  // 현재 페이지 경로를 유지한 채 언어만 전환 (/ko/products/x -> /en/products/x)
  const switchPath = (code: string) => {
    const rest = (pathname || `/${lang}`).replace(/^\/(ko|en|ja)(?=\/|$)/, '');
    return `/${code}${rest}`;
  };

  const isActive = (href: string) => {
    if (href.includes('#')) return false;
    return href === `/${lang}`
      ? pathname === href
      : pathname === href || !!pathname?.startsWith(href + '/');
  };

  const closeAll = () => {
    setMenuOpen(false);
    setLangOpen(false);
    setOpenSub(null);
    setHoverPreview(null);
  };

  const isDesktopHover = (e: React.PointerEvent) =>
    e.pointerType !== 'touch' &&
    typeof window !== 'undefined' &&
    window.innerWidth >= 1024 &&
    window.matchMedia('(hover: hover)').matches;

  const handleSubEnter = (key: DropdownKey) => (e: React.PointerEvent) => {
    if (!isDesktopHover(e)) return;
    setOpenSub(key);
    setHoverPreview(key);
  };

  const handleSubLeave = (key: DropdownKey) => (e: React.PointerEvent) => {
    if (!isDesktopHover(e)) return;
    if (hoverPreview === key) {
      setOpenSub((cur) => (cur === key ? null : cur));
      setHoverPreview(null);
    }
  };

  const handleSubToggle = (key: DropdownKey) => () => {
    // If currently only hover-previewed, pin it open instead of closing immediately
    if (openSub === key && hoverPreview === key) {
      setHoverPreview(null);
      return;
    }
    setHoverPreview(null);
    setOpenSub((cur) => (cur === key ? null : key));
  };

  const handleSubBlur = (
    key: DropdownKey,
    ref: React.RefObject<HTMLLIElement | null>,
  ) => (e: React.FocusEvent<HTMLLIElement>) => {
    if (e.relatedTarget && !ref.current?.contains(e.relatedTarget as Node)) {
      setOpenSub((cur) => (cur === key ? null : cur));
      setHoverPreview((cur) => (cur === key ? null : cur));
    }
  };

  const aboutOpen = openSub === 'about';
  const techOpen = openSub === 'technical';

  const userSlot = userEmail ? (
    <UserMenu
      lang={lang}
      userEmail={userEmail}
      logoutLabel={userLabels.logout}
      mypageLabel={userLabels.mypage}
      quoteLabel={userLabels.quote}
      onNavigate={closeAll}
    />
  ) : null;

  return (
    <header
      className={`kct-hdr${scrolled ? ' is-scrolled' : ''}${menuOpen ? ' is-open' : ''}`}
    >
      <div className="kct-hdr-in">
        {/* Brand */}
        <Link
          className="kct-brand"
          href={`/${lang}`}
          aria-label={a11y.homeAria}
          onClick={closeAll}
        >
          <img
            src="/assets/img/logo/kct_logo.jpeg"
            alt=""
            width={1380}
            height={752}
            className="kct-brand-img"
          />
        </Link>

        {/* Single semantic navigation landmark */}
        <nav className="kct-nav" aria-label={a11y.nav}>
          {/* Mobile quick actions (< 1024px) */}
          <div className="kct-mobile-actions">
            <Link
              href={`/${lang}/quote`}
              className="kct-cta-pill kct-mobile-cta"
              onClick={closeAll}
            >
              {navLabels.inquiry}
            </Link>
            <button
              ref={menuBtnRef}
              type="button"
              className="kct-menu-btn"
              aria-expanded={menuOpen}
              aria-controls="kct-nav-panel"
              aria-label={menuOpen ? a11y.close : a11y.open}
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </button>
          </div>

          {/* Mobile backdrop */}
          {menuOpen && (
            <div
              className="kct-mobile-backdrop"
              aria-hidden="true"
              onClick={closeAll}
            />
          )}

          {/* Navigation panel (inline on desktop, drawer on mobile) */}
          <div
            id="kct-nav-panel"
            className={`kct-nav-panel${menuOpen ? ' is-open' : ''}`}
          >
            <ul className="kct-nav-list">
              {/* 1. 회사소개 (About + anchors dropdown) */}
              <li
                className="kct-nav-item"
                ref={aboutRef}
                onPointerEnter={handleSubEnter('about')}
                onPointerLeave={handleSubLeave('about')}
                onBlur={handleSubBlur('about', aboutRef)}
              >
                <div className="kct-nav-row">
                  <Link
                    href={`/${lang}/about`}
                    className={`kct-nav-link${isActive(`/${lang}/about`) ? ' is-active' : ''}`}
                    aria-current={pathname === `/${lang}/about` ? 'page' : undefined}
                    onClick={closeAll}
                  >
                    {navLabels.about}
                  </Link>
                  <button
                    ref={aboutBtnRef}
                    type="button"
                    className="kct-sub-toggle"
                    aria-expanded={aboutOpen}
                    aria-controls="kct-sub-about"
                    aria-label={`${navLabels.about} ${a11y.sub}`}
                    onClick={handleSubToggle('about')}
                  >
                    <i className="bi bi-chevron-down" aria-hidden="true" />
                  </button>
                </div>
                <ul
                  id="kct-sub-about"
                  className="kct-sub"
                  hidden={!aboutOpen}
                >
                  {ABOUT_SUB.map((sub) => (
                    <li key={sub.hash}>
                      <Link
                        href={`/${lang}/about#${sub.hash}`}
                        className="kct-sub-link"
                        onClick={closeAll}
                      >
                        {sub[langKey]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              {/* 2. 지속가능경영 (Sustainability) */}
              <li className="kct-nav-item">
                <Link
                  href={`/${lang}/sustainability`}
                  className={`kct-nav-link${isActive(`/${lang}/sustainability`) ? ' is-active' : ''}`}
                  aria-current={isActive(`/${lang}/sustainability`) ? 'page' : undefined}
                  onClick={closeAll}
                >
                  {navLabels.sustainability}
                </Link>
              </li>

              {/* 3. 제품 (Products) */}
              <li className="kct-nav-item">
                <Link
                  href={`/${lang}/products`}
                  className={`kct-nav-link${isActive(`/${lang}/products`) ? ' is-active' : ''}`}
                  aria-current={isActive(`/${lang}/products`) ? 'page' : undefined}
                  onClick={closeAll}
                >
                  {navLabels.products}
                </Link>
              </li>

              {/* 4. 기술정보 (Technical + existing TECH_SUB dropdown) */}
              <li
                className="kct-nav-item"
                ref={techRef}
                onPointerEnter={handleSubEnter('technical')}
                onPointerLeave={handleSubLeave('technical')}
                onBlur={handleSubBlur('technical', techRef)}
              >
                <div className="kct-nav-row">
                  <Link
                    href={`/${lang}/technical`}
                    className={`kct-nav-link${isActive(`/${lang}/technical`) ? ' is-active' : ''}`}
                    aria-current={pathname === `/${lang}/technical` ? 'page' : undefined}
                    onClick={closeAll}
                  >
                    {navLabels.technical}
                  </Link>
                  <button
                    ref={techBtnRef}
                    type="button"
                    className="kct-sub-toggle"
                    aria-expanded={techOpen}
                    aria-controls="kct-sub-tech"
                    aria-label={`${navLabels.technical} ${a11y.sub}`}
                    onClick={handleSubToggle('technical')}
                  >
                    <i className="bi bi-chevron-down" aria-hidden="true" />
                  </button>
                </div>
                <ul
                  id="kct-sub-tech"
                  className="kct-sub"
                  hidden={!techOpen}
                >
                  {TECH_SUB.map((sub) => {
                    const href = `/${lang}/${sub.path}`;
                    const cur =
                      pathname === href ||
                      (sub.path !== 'technical' && !!pathname?.startsWith(href + '/'));
                    return (
                      <li key={sub.path}>
                        <Link
                          href={href}
                          className="kct-sub-link"
                          aria-current={cur ? 'page' : undefined}
                          onClick={closeAll}
                        >
                          {sub[langKey]}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>

              {/* 5. 수출 (Export) */}
              <li className="kct-nav-item">
                <Link
                  href={`/${lang}/export`}
                  className={`kct-nav-link${isActive(`/${lang}/export`) ? ' is-active' : ''}`}
                  aria-current={isActive(`/${lang}/export`) ? 'page' : undefined}
                  onClick={closeAll}
                >
                  {navLabels.export}
                </Link>
              </li>

              {/* 6. 견적 (Quote) */}
              <li className="kct-nav-item">
                <Link
                  href={`/${lang}/quote`}
                  className={`kct-nav-link${isActive(`/${lang}/quote`) ? ' is-active' : ''}`}
                  aria-current={isActive(`/${lang}/quote`) ? 'page' : undefined}
                  onClick={closeAll}
                >
                  {navLabels.quote}
                </Link>
              </li>
            </ul>

            {/* Right Utility Cluster: Language · Auth · Pill CTA */}
            <div className="kct-hdr-side">
              {/* Language switcher */}
              <div
                className="kct-lang"
                ref={langRef}
                onBlur={(e) => {
                  if (e.relatedTarget && !langRef.current?.contains(e.relatedTarget as Node)) {
                    setLangOpen(false);
                  }
                }}
              >
                <button
                  ref={langBtnRef}
                  type="button"
                  className="kct-lang-btn"
                  aria-expanded={langOpen}
                  aria-controls="kct-lang-list"
                  aria-label={`${a11y.lang}: ${lang.toUpperCase()}`}
                  onClick={() => setLangOpen((prev) => !prev)}
                >
                  <i className="bi bi-globe" aria-hidden="true" />
                  <span>{lang.toUpperCase()}</span>
                  <i
                    className={`bi bi-chevron-${langOpen ? 'up' : 'down'}`}
                    aria-hidden="true"
                    style={{ fontSize: '0.65rem' }}
                  />
                </button>
                {langOpen && (
                  <ul id="kct-lang-list" className="kct-lang-list">
                    {LANGS.map((l) => (
                      <li key={l.code}>
                        <a
                          href={switchPath(l.code)}
                          lang={l.code}
                          hrefLang={l.code}
                          aria-current={l.code === lang ? 'true' : undefined}
                          className="kct-lang-link"
                          onClick={closeAll}
                        >
                          <span>{l.label}</span>
                          {l.code === lang && (
                            <i className="bi bi-check2" aria-hidden="true" />
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Auth area (client getUser) */}
              {userSlot ?? (
                <Link
                  href={`/${lang}/auth/login`}
                  className="kct-login-link"
                  onClick={closeAll}
                >
                  <i className="bi bi-person" aria-hidden="true" />
                  <span>{navLabels.login}</span>
                </Link>
              )}

              {/* Pill CTA "문의하기" (Quote) */}
              <Link
                href={`/${lang}/quote`}
                className="kct-cta-pill"
                onClick={closeAll}
              >
                <span>{navLabels.inquiry}</span>
                <span className="kct-cta-arw" aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
