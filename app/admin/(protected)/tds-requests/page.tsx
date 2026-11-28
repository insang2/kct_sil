import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ADMIN_COOKIE } from '@/lib/admin-auth'
import { listTdsRequests, type TdsRequest, type TdsRequestStatus } from '@/lib/tds-admin'
import TdsRequestsManager from '@/components/admin/TdsRequestsManager'

const ALLOWED_TABS = new Set<TdsRequestStatus>(['pending', 'sent', 'rejected'])

export default async function AdminTdsRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE)?.value
  if (!token) redirect('/admin/login')

  const sp = await searchParams
  const rawStatus = typeof sp.status === 'string' ? sp.status : 'pending'
  const initialTab: TdsRequestStatus = ALLOWED_TABS.has(rawStatus as TdsRequestStatus)
    ? (rawStatus as TdsRequestStatus)
    : 'pending'

  let requests: TdsRequest[] = []
  let initialError: string | null = null

  try {
    requests = await listTdsRequests(token, {})
  } catch (err) {
    initialError =
      err instanceof Error && err.message.includes('not implemented')
        ? 'TDS 요청 관리 백엔드 API가 아직 준비되지 않았습니다. 마이그레이션 및 백엔드 배포 후 다시 시도해 주세요.'
        : 'TDS 요청 목록을 불러오는 중 오류가 발생했습니다. 잠시 후 새로고침해 주세요.'
  }

  return (
    <TdsRequestsManager
      initialRequests={requests}
      initialTab={initialTab}
      initialError={initialError}
    />
  )
}
