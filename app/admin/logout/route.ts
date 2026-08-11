import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE, logoutSession } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE)?.value
  if (token) await logoutSession(token)

  const url = new URL('/admin/login', req.url)
  const res = NextResponse.redirect(url)
  res.cookies.set(ADMIN_COOKIE, '', { maxAge: 0, path: '/' })
  return res
}

export async function POST(req: NextRequest) {
  return GET(req)
}
