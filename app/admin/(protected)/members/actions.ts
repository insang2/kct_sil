'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { ADMIN_COOKIE } from '@/lib/admin-auth'
import {
  listMembers,
  setMemberStatus,
  setMemberTier,
  getMemberDownloads,
  type Member,
  type MemberStatus,
} from '@/lib/tds-admin'

const VALID_STATUSES = new Set<MemberStatus>(['pending', 'approved', 'suspended', 'rejected'])
const VALID_TIERS = new Set(['standard', 'silver', 'gold', 'platinum'])

async function requireAdminToken(): Promise<string> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE)?.value
  if (!token) redirect('/admin/login')
  return token
}

function toFriendlyError(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message.includes('not implemented')) {
    return '회원 관리 백엔드 API가 아직 준비되지 않았습니다. 마이그레이션 및 백엔드 배포 후 다시 시도해 주세요.'
  }
  return fallback
}

export async function fetchMembersAction(filter?: {
  status?: MemberStatus
  q?: string
}): Promise<{ ok: true; members: Member[] } | { ok: false; error: string }> {
  const token = await requireAdminToken()
  const cleanFilter: { status?: MemberStatus; q?: string } = {}
  if (filter?.status && VALID_STATUSES.has(filter.status)) {
    cleanFilter.status = filter.status
  }
  if (typeof filter?.q === 'string' && filter.q.trim()) {
    cleanFilter.q = filter.q.trim().slice(0, 100)
  }

  try {
    const members = await listMembers(token, cleanFilter)
    return { ok: true, members }
  } catch (err) {
    return { ok: false, error: toFriendlyError(err, '회원 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.') }
  }
}

export async function updateMemberStatusAction(
  userId: string,
  status: MemberStatus,
  note?: string,
): Promise<{ ok: boolean; error?: string }> {
  const token = await requireAdminToken()

  const cleanId = typeof userId === 'string' ? userId.trim() : ''
  if (!cleanId || cleanId.length > 64) {
    return { ok: false, error: '유효하지 않은 회원 식별자입니다.' }
  }
  if (!VALID_STATUSES.has(status)) {
    return { ok: false, error: '허용되지 않은 회원 상태 값입니다.' }
  }
  const cleanNote = typeof note === 'string' ? note.trim().slice(0, 500) : undefined

  try {
    const ok = await setMemberStatus(token, cleanId, status, cleanNote)
    if (!ok) {
      return { ok: false, error: '회원 상태를 변경할 수 없습니다. 관리자 세션 또는 대상 회원을 확인해 주세요.' }
    }
    revalidatePath('/admin/members')
    revalidatePath('/admin')
    revalidatePath('/admin', 'layout')
    return { ok: true }
  } catch (err) {
    return { ok: false, error: toFriendlyError(err, '회원 상태 변경 중 오류가 발생했습니다.') }
  }
}

export async function updateMemberTierAction(
  userId: string,
  tier: string,
): Promise<{ ok: boolean; error?: string }> {
  const token = await requireAdminToken()

  const cleanId = typeof userId === 'string' ? userId.trim() : ''
  if (!cleanId || cleanId.length > 64) {
    return { ok: false, error: '유효하지 않은 회원 식별자입니다.' }
  }
  if (!VALID_TIERS.has(tier)) {
    return { ok: false, error: '허용되지 않은 등급입니다.' }
  }

  try {
    const ok = await setMemberTier(token, cleanId, tier)
    if (!ok) {
      return { ok: false, error: '회원 등급을 변경할 수 없습니다. 권한 또는 대상을 확인해 주세요.' }
    }
    revalidatePath('/admin/members')
    return { ok: true }
  } catch (err) {
    return { ok: false, error: toFriendlyError(err, '회원 등급 변경 중 오류가 발생했습니다.') }
  }
}

export async function fetchMemberDownloadsAction(
  userId: string,
): Promise<{ ok: true; downloads: { slug: string; at: string }[] } | { ok: false; error: string }> {
  const token = await requireAdminToken()

  const cleanId = typeof userId === 'string' ? userId.trim() : ''
  if (!cleanId || cleanId.length > 64) {
    return { ok: false, error: '유효하지 않은 회원 식별자입니다.' }
  }

  try {
    const downloads = await getMemberDownloads(token, cleanId)
    return { ok: true, downloads }
  } catch (err) {
    return { ok: false, error: toFriendlyError(err, '다운로드 이력을 불러오지 못했습니다.') }
  }
}
