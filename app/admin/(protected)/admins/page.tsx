import { cookies } from 'next/headers'
import { verifySession, listAdminUsers, ADMIN_COOKIE } from '@/lib/admin-auth'
import { redirect } from 'next/navigation'
import AdminUsersManager from '@/components/admin/AdminUsersManager'

export default async function AdminUsersPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE)?.value ?? ''
  const currentUsername = await verifySession(token)
  if (!currentUsername) redirect('/admin/login')

  const users = await listAdminUsers(token)

  return (
    <div>
      <div className="mb-5">
        <h1 className="h3 fw-bold text-dark mb-1">관리자 계정 관리</h1>
        <p className="text-body-secondary mb-0">관리자 아이디 추가 · 비밀번호 변경 · 삭제</p>
      </div>

      <AdminUsersManager
        users={users}
        currentUsername={currentUsername}
        token={token}
      />
    </div>
  )
}
