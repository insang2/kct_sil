import { NextRequest, NextResponse } from 'next/server'
import { verifyCredentials, ADMIN_COOKIE } from '@/lib/admin-auth'

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()
  const token = await verifyCredentials(username, password)

  if (!token) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  return res
}
