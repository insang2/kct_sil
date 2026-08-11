import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifySession, ADMIN_COOKIE } from '@/lib/admin-auth'
import AdminSidebar from '@/components/admin/AdminSidebar'
import GlobalSearch from '@/components/admin/GlobalSearch'

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE)?.value

  const username = token ? await verifySession(token) : null
  if (!username) redirect('/admin/login')

  return (
    <div className="d-flex flex-column flex-lg-row" style={{ minHeight: '100vh' }}>
      <AdminSidebar username={username} />

      <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
        {/* Top bar */}
        <header className="bg-white border-bottom px-3 px-md-4 py-2 d-flex align-items-center gap-2 gap-md-3 flex-shrink-0 sticky-top" style={{ minHeight: 56, zIndex: 1020 }}>
          {/* Mobile hamburger button area spacer */}
          <div className="d-lg-none flex-shrink-0" style={{ width: 44 }} />

          <div className="d-flex align-items-center gap-2 flex-shrink-0">
            <i className="bi bi-shield-check text-primary d-none d-sm-inline" style={{ fontSize: '0.9rem' }} />
            <span className="fw-bold text-dark" style={{ fontSize: '0.88rem' }}>KCT Admin</span>
          </div>

          <GlobalSearch />

          <div className="d-flex align-items-center gap-2 flex-shrink-0 ms-auto">
            <span className="text-body-secondary d-none d-md-inline" style={{ fontSize: '0.82rem' }}>{username}</span>
            <a href="/admin/logout" className="btn btn-sm btn-outline-secondary rounded-pill px-2 px-sm-3" style={{ fontSize: '0.75rem' }}>
              <i className="bi bi-box-arrow-right d-none d-sm-inline me-1" />로그아웃
            </a>
          </div>
        </header>

        <main className="p-3 p-md-4 p-lg-5 flex-grow-1 bg-light bg-opacity-50">
          {children}
        </main>
      </div>
    </div>
  )
}
