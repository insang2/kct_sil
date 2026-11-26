'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface NavbarClientProps {
  lang: string;
  navLabels: {
    home: string;
    about: string;
    products: string;
    technical: string;
    b2b: string;
    export: string;
    quote: string;
    login: string;
  };
  userSlot?: React.ReactNode;
}

const LANGS = [
  { code: 'ko',    label: '한국어 (KO)' },
  { code: 'en',    label: 'English (EN)' },
  { code: 'ja',    label: '日本語 (JA)' },
] as const;

/* ─── shared styles ─────────────────────────────────────── */
const LIGHT: React.CSSProperties = {
  backgroundColor: '#ffffff',
  color: '#16142F',
  colorScheme: 'light',
};

const LINK_STYLE: React.CSSProperties = {
  color: '#16142F',
  display: 'flex',
  alignItems: 'center',
};

const LINK_STYLE_PRIMARY: React.CSSProperties = {
  color: '#ffffff',
  backgroundColor: '#1558D6',
  borderRadius: '50rem',
  padding: '0.35rem 1rem',
  display: 'inline-flex',
  alignItems: 'center',
  fontWeight: 600,
  fontSize: '0.875rem',
};

const TECH_SUB: { path: string; ko: string; en: string; ja: string }[] = [
  { path: 'technical', ko: '내화 실란트 기술 매뉴얼', en: 'Fire-rated sealant manual', ja: '耐火シーラント技術マニュアル' },
  { path: 'technical/industrial', ko: '산업·가전·유지보수 선정 가이드', en: 'Industrial & appliance guide', ja: '産業・家電・メンテナンス用ガイド' },
  { path: 'technical/basics', ko: '실리콘 일반 교육', en: 'Silicone basics training', ja: 'シリコーン基礎教育' },
  { path: 'technical/psa', ko: '실리콘 점착제(PSA) 선택 요령', en: 'Silicone PSA selection guide', ja: 'シリコーンPSA選定ガイド' },
  { path: 'technical/tapes', ko: '전기·전자 테이프용 PSA', en: 'Electrical tape PSAs', ja: '電気・電子テープ用PSA' },
];

const MENU_LABEL: Record<string, { open: string; close: string; lang: string }> = {
  ko: { open: '메뉴 열기', close: '메뉴 닫기', lang: '언어 선택' },
  en: { open: 'Open menu', close: 'Close menu', lang: 'Select language' },
  ja: { open: 'メニューを開く', close: 'メニューを閉じる', lang: '言語を選択' },
};

export default function NavbarClient({ lang, navLabels, userSlot }: NavbarClientProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [techOpen, setTechOpen] = useState(false);
  const techRef = useRef<HTMLLIElement>(null);
  const pathname = usePathname();
  const langRef = useRef<HTMLLIElement>(null);

  // Close on navigation
  useEffect(() => {
    setMenuOpen(false);
    setLangOpen(false);
    setTechOpen(false);
  }, [pathname]);

  // Close lang dropdown on outside click
  useEffect(() => {
    if (!langOpen && !techOpen) return;
    function handle(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
      if (techRef.current && !techRef.current.contains(e.target as Node)) setTechOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [langOpen, techOpen]);

  // Escape 키로 메뉴·언어 목록 닫기
  useEffect(() => {
    if (!menuOpen && !langOpen && !techOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setMenuOpen(false); setLangOpen(false); setTechOpen(false); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen, langOpen, techOpen]);

  // 현재 페이지 경로를 유지한 채 언어만 전환 (/ko/products/x -> /en/products/x)
  const switchPath = (code: string) => {
    const rest = (pathname || `/${lang}`).replace(/^\/(ko|en|ja)(?=\/|$)/, '');
    return `/${code}${rest}`;
  };
  const isActive = (href: string) => {
    if (href.includes('#')) return false;
    return href === `/${lang}` ? pathname === href : pathname === href || !!pathname?.startsWith(href + '/');
  };
  const ml = MENU_LABEL[lang] ?? MENU_LABEL.en;

  const closeMenu = () => {
    setMenuOpen(false);
    setLangOpen(false);
  };

  return (
    <>
      {/* ── Toggler ── */}
      <button
        type="button"
        className="d-lg-none"
        aria-expanded={menuOpen}
        aria-controls="main-nav"
        aria-label={menuOpen ? ml.close : ml.open}
        onClick={() => setMenuOpen(p => !p)}
        style={{
          background: '#ffffff',
          border: '1.5px solid rgba(0,0,0,0.18)',
          borderRadius: '8px',
          padding: '6px 10px',
          cursor: 'pointer',
          color: '#16142F',
          marginLeft: 'auto',
          colorScheme: 'light',
        }}
      >
        {menuOpen
          ? <i className="bi bi-x-lg"  style={{ fontSize: '1.1rem', color: '#16142F', display: 'block' }}></i>
          : <i className="bi bi-list"  style={{ fontSize: '1.25rem', color: '#16142F', display: 'block' }}></i>
        }
      </button>

      {/* ── Collapse panel ── */}
      <div
        id="main-nav"
        className={`navbar-collapse${menuOpen ? ' show' : ' collapse'}`}
        style={menuOpen ? { display: 'block', ...LIGHT } : { colorScheme: 'light' }}
      >
        <ul
          className="navbar-nav ms-auto align-items-lg-center"
          style={LIGHT}
        >

          {/* Nav links */}
          {([
            { label: navLabels.home,     href: `/${lang}` },
            { label: navLabels.about,    href: `/${lang}/about` },
            { label: navLabels.products, href: `/${lang}/products` },
            { label: navLabels.technical, href: `/${lang}/technical` },
            { label: navLabels.b2b,      href: `/${lang}#b2b-form` },
            { label: navLabels.export,   href: `/${lang}/export` },
          ] as const).map(item => item.href === `/${lang}/technical` ? (
            <li key={item.href} className="nav-item d-lg-flex align-items-lg-center" ref={techRef} style={{ position: 'relative', backgroundColor: '#ffffff' }}>
              <Link
                className={`nav-link${isActive(item.href) || pathname?.startsWith(item.href) ? ' active fw-bold' : ''}`}
                aria-current={pathname === item.href ? 'page' : undefined}
                href={item.href}
                onClick={closeMenu}
                style={LINK_STYLE}
              >
                {item.label}
              </Link>
              <button
                type="button"
                aria-expanded={techOpen}
                aria-haspopup="true"
                aria-controls="tech-submenu"
                aria-label={`${item.label} ${lang === 'ko' ? '하위 메뉴' : lang === 'ja' ? 'サブメニュー' : 'submenu'}`}
                onClick={() => setTechOpen(p => !p)}
                style={{ background: '#fff', border: 0, padding: '0.25rem 0.5rem', color: '#16142F', cursor: 'pointer' }}
              >
                <i className={`bi bi-chevron-${techOpen ? 'up' : 'down'}`} style={{ fontSize: '0.7rem' }} aria-hidden="true"></i>
              </button>
              {techOpen && (
                <ul
                  id="tech-submenu"
                  className="tech-submenu"
                  style={{
                    position: 'absolute', left: 0, top: '100%', zIndex: 1050, minWidth: '270px', backgroundColor: '#fff',
                    border: '1px solid rgba(0,0,0,0.1)', borderRadius: '0.75rem', boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.12)',
                    padding: '0.5rem 0', listStyle: 'none', margin: 0, colorScheme: 'light',
                  }}
                >
                  {TECH_SUB.map(sub => {
                    const href = `/${lang}/${sub.path}`;
                    const cur = pathname === href || (sub.path !== 'technical' && !!pathname?.startsWith(href + '/'));
                    return (
                      <li key={sub.path}>
                        <Link
                          href={href}
                          onClick={closeMenu}
                          aria-current={cur ? 'page' : undefined}
                          style={{ display: 'block', padding: '0.55rem 1rem', color: cur ? '#1558D6' : '#16142F', fontWeight: cur ? 600 : 400, textDecoration: 'none', fontSize: '0.92rem' }}
                        >
                          {sub[(lang as 'ko' | 'en' | 'ja')] ?? sub.en}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          ) : (
            <li key={item.href} className="nav-item" style={{ backgroundColor: '#ffffff', borderBottomColor: '#f1f5f9' }}>
              <Link
                className={`nav-link${isActive(item.href) ? ' active fw-bold' : ''}`}
                aria-current={isActive(item.href) ? 'page' : undefined}
                href={item.href}
                onClick={closeMenu}
                style={LINK_STYLE}
              >
                {item.label}
              </Link>
            </li>
          ))}

          {/* ── Language switcher ── */}
          <li
            className="nav-item ms-lg-2"
            ref={langRef}
            style={{ position: 'relative', backgroundColor: '#ffffff' }}
          >
            <button
              onClick={() => setLangOpen(p => !p)}
              aria-expanded={langOpen}
              aria-haspopup="true"
              aria-label={`${ml.lang}: ${lang.toUpperCase()}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                background: '#ffffff',
                border: '1px solid #dee2e6',
                borderRadius: '50rem',
                padding: '0.25rem 0.75rem',
                cursor: 'pointer',
                color: '#16142F',
                fontSize: '0.875rem',
                fontWeight: 500,
                colorScheme: 'light',
              }}
            >
              <i className="bi bi-globe" style={{ color: '#16142F' }}></i>
              <span style={{ color: '#16142F' }}>{lang.toUpperCase()}</span>
              <i
                className={`bi bi-chevron-${langOpen ? 'up' : 'down'}`}
                style={{ fontSize: '0.65rem', color: '#16142F' }}
              ></i>
            </button>

            {langOpen && (
              <ul
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '110%',
                  zIndex: 1050,
                  minWidth: '180px',
                  backgroundColor: '#ffffff',
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: '0.75rem',
                  boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.12)',
                  padding: '0.5rem 0',
                  listStyle: 'none',
                  margin: 0,
                  colorScheme: 'light',
                }}
              >
                {LANGS.map(l => (
                  <li key={l.code}>
                    <a
                      href={switchPath(l.code)}
                      lang={l.code}
                      hrefLang={l.code}
                      aria-current={l.code === lang ? 'true' : undefined}
                      onClick={closeMenu}
                      style={{
                        display: 'block',
                        padding: '0.5rem 1rem',
                        color: l.code === lang ? '#1558D6' : '#16142F',
                        fontWeight: l.code === lang ? 600 : 400,
                        textDecoration: 'none',
                        backgroundColor: l.code === lang ? '#f0f4ff' : 'transparent',
                        fontSize: '0.9rem',
                      }}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* ── Auth area ── */}
          {userSlot ?? (
            <li className="nav-item ms-lg-2" style={{ backgroundColor: '#ffffff' }}>
              <Link
                href={`/${lang}/auth/login`}
                onClick={closeMenu}
                style={LINK_STYLE_PRIMARY}
              >
                <i className="bi bi-person me-1"></i>
                {navLabels.login}
              </Link>
            </li>
          )}

        </ul>
      </div>
    </>
  );
}
