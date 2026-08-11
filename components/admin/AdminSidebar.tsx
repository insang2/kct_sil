'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/admin',           icon: 'bi-speedometer2',       label: '대시보드' },
  { href: '/admin/products',  icon: 'bi-box-seam',           label: '제품 관리' },
  { href: '/admin/customers', icon: 'bi-people',             label: '고객 관리' },
  { href: '/admin/quotes',    icon: 'bi-file-earmark-text',  label: '견적 현황' },
  { href: '/admin/deals',     icon: 'bi-diagram-3',          label: '거래 파이프라인' },
  { href: '/admin/inventory', icon: 'bi-box2-heart',         label: '자재 재고' },
  { href: '/admin/documents', icon: 'bi-file-earmark-plus',  label: '문서 생성' },
  { href: '/admin/admins',    icon: 'bi-shield-lock',        label: '관리자 계정' },
]

export default function AdminSidebar({ username }: { username: string }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <>
      <style>{`
        @media (min-width: 992px) {
          .kct-sidebar { transform: translateX(0) !important; }
          .kct-sidebar-backdrop { display: none !important; }
        }
      `}</style>

      {/* Mobile backdrop */}
      <div
        className="kct-sidebar-backdrop"
        style={{
          display: open ? 'block' : 'none',
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1040,
        }}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar */}
      <nav
        className="kct-sidebar d-flex flex-column"
        style={{
          width: 220, background: '#1e1e2e',
          position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 1045,
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.22s ease',
          overflowY: 'auto',
        }}
      >
        <div className="p-4 pb-3 flex-shrink-0">
          <div className="d-flex align-items-center gap-2 text-white">
            <img src="/assets/img/logo/kct_logo.jpeg" alt="KCT" style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover' }} />
            <div>
              <div className="fw-bold" style={{ fontSize: '0.85rem' }}>KCT Admin</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>{username}</div>
            </div>
          </div>
        </div>
        <hr style={{ borderColor: 'rgba(255,255,255,0.2)', margin: '0 16px' }} />

        <ul className="nav flex-column p-3 gap-1 mt-2 flex-grow-1">
          {navItems.map(item => (
            <li key={item.href} className="nav-item">
              <Link
                href={item.href}
                className="nav-link text-white d-flex align-items-center gap-2 rounded-3 px-3 py-2"
                style={{
                  fontSize: '0.88rem',
                  transition: 'background 0.15s',
                  background: isActive(item.href) ? 'rgba(255,255,255,0.18)' : undefined,
                  fontWeight: isActive(item.href) ? 600 : undefined,
                  borderLeft: isActive(item.href) ? '3px solid #4e8fff' : '3px solid transparent',
                }}
                onClick={() => setOpen(false)}
              >
                <i className={`bi ${item.icon}`} style={{ width: 18 }} />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="p-3 flex-shrink-0">
          <hr style={{ borderColor: 'rgba(255,255,255,0.2)', marginBottom: 8 }} />
          <a href="/ko" className="nav-link text-white d-flex align-items-center gap-2 px-3 py-2 rounded-3" style={{ fontSize: '0.8rem', opacity: 0.65 }}>
            <i className="bi bi-arrow-left-circle" style={{ width: 18 }} />사이트로 돌아가기
          </a>
          <a href="/admin/logout" className="nav-link text-white d-flex align-items-center gap-2 px-3 py-2 rounded-3" style={{ fontSize: '0.8rem', opacity: 0.65 }}>
            <i className="bi bi-box-arrow-right" style={{ width: 18 }} />로그아웃
          </a>
        </div>
      </nav>

      {/* Desktop spacer (pushes content right) */}
      <div className="d-none d-lg-block flex-shrink-0" style={{ width: 220 }} />

      {/* Mobile hamburger — rendered outside the sidebar so it's always visible */}
      <button
        className="d-lg-none btn d-flex align-items-center justify-content-center shadow-sm"
        style={{
          position: 'fixed', top: 8, left: 8, zIndex: 1050,
          width: 40, height: 40, padding: 0, borderRadius: '10px',
          background: open ? '#1e1e2e' : '#fff', 
          border: '1px solid rgba(0,0,0,0.08)',
          transition: 'all 0.2s',
        }}
        onClick={() => setOpen(v => !v)}
        aria-label="메뉴"
      >
        <i className={`bi ${open ? 'bi-x-lg text-white' : 'bi-list text-dark'}`} style={{ fontSize: '1.25rem' }} />
      </button>
    </>
  )
}
