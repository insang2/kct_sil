import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ADMIN_COOKIE } from '@/lib/admin-auth'
import { listMembers, type Member, type MemberStatus } from '@/lib/tds-admin'
import MembersManager from '@/components/admin/MembersManager'

const ALLOWED_TABS = new Set(['pending', 'approved', 'suspended', 'rejected', 'all'])

export default async function AdminMembersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE)?.value
  if (!token) redirect('/admin/login')

  const sp = await searchParams
  const rawStatus = typeof sp.status === 'string' ? sp.status : 'all'
  const initialTab: MemberStatus | 'all' = ALLOWED_TABS.has(rawStatus)
    ? (rawStatus as MemberStatus | 'all')
    : 'all'
  const initialQuery = typeof sp.q === 'string' ? sp.q.slice(0, 100) : ''

  let members: Member[] = []
  let initialError: string | null = null

  try {
    members = await listMembers(token, {})
  } catch (err) {
    initialError =
      err instanceof Error && err.message.includes('not implemented')
        ? '회원 관리 백엔드 API가 아직 준비되지 않았습니다. 마이그레이션 및 백엔드 배포 후 다시 시도해 주세요.'
        : '회원 목록을 불러오는 중 오류가 발생했습니다. 잠시 후 새로고침해 주세요.'
  }

  return (
    <MembersManager
      initialMembers={members}
      initialTab={initialTab}
      initialQuery={initialQuery}
      initialError={initialError}
    />
  )
}
