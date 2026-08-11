import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  verifySession, listAdminUsers,
  createAdminUser, deleteAdminUser, changeAdminPassword,
  ADMIN_COOKIE,
} from '@/lib/admin-auth'

export async function POST(req: NextRequest) {
  // Verify request comes from a valid admin session (cookie must match posted token)
  const cookieStore = await cookies()
  const cookieToken = cookieStore.get(ADMIN_COOKIE)?.value

  const body = await req.json()
  const { fn, token, ...args } = body

  if (!cookieToken || cookieToken !== token) {
    return NextResponse.json({ ok: false, error: '인증 오류' }, { status: 401 })
  }

  const currentUsername = await verifySession(token)
  if (!currentUsername) {
    return NextResponse.json({ ok: false, error: '세션 만료' }, { status: 401 })
  }

  try {
    if (fn === 'create') {
      const ok = await createAdminUser(token, args.username, args.password)
      if (!ok) return NextResponse.json({ ok: false, error: '이미 존재하는 아이디입니다.' })
      const users = await listAdminUsers(token)
      return NextResponse.json({ ok: true, users })
    }

    if (fn === 'delete') {
      if (args.targetUsername === currentUsername) {
        return NextResponse.json({ ok: false, error: '본인 계정은 삭제할 수 없습니다.' })
      }
      const ok = await deleteAdminUser(token, args.targetUsername)
      if (!ok) return NextResponse.json({ ok: false, error: '삭제 실패' })
      const users = await listAdminUsers(token)
      return NextResponse.json({ ok: true, users })
    }

    if (fn === 'changePw') {
      const ok = await changeAdminPassword(token, args.targetUsername, args.newPassword)
      if (!ok) return NextResponse.json({ ok: false, error: '비밀번호 변경 실패' })
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ ok: false, error: '잘못된 요청' }, { status: 400 })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message ?? '서버 오류' }, { status: 500 })
  }
}
