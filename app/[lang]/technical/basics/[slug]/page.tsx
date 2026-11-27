import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SERIES } from '@/lib/series/config'
import { SeriesArticle } from '@/components/tech/SeriesPage'
import { seriesPageMeta } from '@/lib/series/hubs'

type P = { lang: string; slug: string }
const s = SERIES.basics

// 사전 렌더(SSG): 크롤러 요청마다 Worker가 SSR 하지 않도록
export function generateStaticParams() {
  return ['ko','en','ja'].flatMap((lang) => s.pages.map((p) => p.slug).map((slug) => ({ lang, slug })))
}

export async function generateMetadata({ params }: { params: Promise<P> }): Promise<Metadata> {
  const { lang, slug } = await params
  return seriesPageMeta(s, lang, slug)
}

export default async function Page({ params }: { params: Promise<P> }) {
  const { lang, slug } = await params
  if (!s.pages.some((x) => x.slug === slug)) notFound()
  return <SeriesArticle s={s} lang={lang} slug={slug} />
}
