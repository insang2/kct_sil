'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { ADMIN_COOKIE } from '@/lib/admin-auth'
import {
  listTdsRequests,
  approveTdsRequest,
  rejectTdsRequest,
  type TdsRequest,
  type TdsRequestStatus,
} from '@/lib/tds-admin'

const VALID_STATUSES = new Set<TdsRequestStatus>(['pending', 'sent', 'rejected'])

async function requireAdminToken(): Promise<string> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE)?.value
  if (!token) redirect('/admin/login')
  return token
}

function toFriendlyError(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message.includes('not implemented')) {
    return 'TDS 요청 관리 백엔드 API가 아직 준비되지 않았습니다. 마이그레이션 및 백엔드 배포 후 다시 시도해 주세요.'
  }
  return fallback
}

export async function fetchTdsRequestsAction(
  status?: TdsRequestStatus,
): Promise<{ ok: true; requests: TdsRequest[] } | { ok: false; error: string }> {
  const token = await requireAdminToken()
  const cleanFilter: { status?: TdsRequestStatus } = {}
  if (status && VALID_STATUSES.has(status)) {
    cleanFilter.status = status
  }

  try {
    const requests = await listTdsRequests(token, cleanFilter)
    return { ok: true, requests }
  } catch (err) {
    return { ok: false, error: toFriendlyError(err, 'TDS 요청 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.') }
  }
}

export async function approveTdsRequestAction(
  id: string,
  note?: string,
): Promise<{ ok: boolean; emailed: boolean; link?: string; error?: string }> {
  const token = await requireAdminToken()

  const cleanId = typeof id === 'string' ? id.trim() : ''
  if (!cleanId || cleanId.length > 64) {
    return { ok: false, emailed: false, error: '유효하지 않은 요청 식별자입니다.' }
  }
  const cleanNote = typeof note === 'string' ? note.trim().slice(0, 500) : undefined

  try {
    const result = await approveTdsRequest(token, cleanId, cleanNote)
    if (result.ok) {
      revalidatePath('/admin/tds-requests')
      revalidatePath('/admin')
      revalidatePath('/admin', 'layout')
    }
    return result
  } catch (err) {
    return {
      ok: false,
      emailed: false,
      error: toFriendlyError(err, 'TDS 요청 승인 처리 중 오류가 발생했습니다.'),
    }
  }
}

export async function rejectTdsRequestAction(
  id: string,
  note?: string,
): Promise<{ ok: boolean; error?: string }> {
  const token = await requireAdminToken()

  const cleanId = typeof id === 'string' ? id.trim() : ''
  if (!cleanId || cleanId.length > 64) {
    return { ok: false, error: '유효하지 않은 요청 식별자입니다.' }
  }
  const cleanNote = typeof note === 'string' ? note.trim().slice(0, 500) : undefined

  try {
    const ok = await rejectTdsRequest(token, cleanId, cleanNote)
    if (!ok) {
      return { ok: false, error: 'TDS 요청을 반려할 수 없습니다. 관리자 세션 또는 대상 요청을 확인해 주세요.' }
    }
    revalidatePath('/admin/tds-requests')
    revalidatePath('/admin')
    revalidatePath('/admin', 'layout')
    return { ok: true }
  } catch (err) {
    return { ok: false, error: toFriendlyError(err, 'TDS 요청 반려 처리 중 오류가 발생했습니다.') }
  }
}
