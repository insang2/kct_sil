import { NextRequest, NextResponse } from 'next/server'
import { isValidSlug } from '@/lib/tds-server'

// 기존 공개 URL(/tds/<slug>.pdf)은 TDS 센터로 301 (파일은 이제 비공개 R2)
export async function GET(req: NextRequest, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params
  const m = /^([a-z0-9-]+)\.pdf$/.exec(file)
  if (!m || !isValidSlug(m[1])) return new NextResponse('Not Found', { status: 404 })
  return NextResponse.redirect(new URL(`/ko/tds?product=${m[1]}`, req.url), 301)
}
