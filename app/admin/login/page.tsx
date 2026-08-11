import AdminLoginForm from '@/components/admin/AdminLoginForm'

export default function AdminLoginPage() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ background: '#f8f9fa' }}>
      <div style={{ width: '100%', maxWidth: 400 }} className="px-4">
        <div className="text-center mb-4">
          <img src="/assets/img/logo/kct_logo.jpeg" alt="KCT"
            style={{ width: 56, height: 56, borderRadius: 12, objectFit: 'cover', marginBottom: 12 }} />
          <h1 className="h4 fw-bold text-dark mb-1">KCT 관리자</h1>
          <p className="text-body-secondary mb-0" style={{ fontSize: '0.875rem' }}>
            한국건설트레이딩 Admin
          </p>
        </div>

        <div className="card border-0 shadow-lg rounded-4">
          <div className="card-body p-4 p-md-5">
            <AdminLoginForm />
          </div>
        </div>

        <p className="text-center mt-4 text-body-secondary" style={{ fontSize: '0.8rem' }}>
          © 2026 KCT 한국건설트레이딩
        </p>
      </div>
    </div>
  )
}
