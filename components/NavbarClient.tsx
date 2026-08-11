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

export default function NavbarClient({ lang, navLabels, userSlot }: NavbarClientProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const pathname = usePathname();
  const langRef = useRef<HTMLLIElement>(null);

  // Close on navigation
  useEffect(() => {
    setMenuOpen(false);
    setLangOpen(false);
  }, [pathname]);

  // Close lang dropdown on outside click
  useEffect(() => {
    if (!langOpen) return;
    function handle(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [langOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    setLangOpen(false);
  };

  return (
    <>
      {/* ── Toggler ── */}
      <button
        type="button"
        aria-expanded={menuOpen}
        aria-label="메뉴 열기/닫기"
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
            { label: navLabels.b2b,      href: `/${lang}#b2b-form` },
            { label: navLabels.export,   href: `/${lang}/export` },
          ] as const).map(item => (
            <li key={item.href} className="nav-item" style={{ backgroundColor: '#ffffff', borderBottomColor: '#f1f5f9' }}>
              <Link
                className="nav-link"
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
                      href={`/${l.code}`}
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
