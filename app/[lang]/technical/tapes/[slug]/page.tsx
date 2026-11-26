import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SERIES } from '@/lib/series/config'
import { SeriesArticle, seriesPageMeta } from '@/components/tech/SeriesPage'

type P = { lang: string; slug: string }
const s = SERIES.tapes

export async function generateMetadata({ params }: { params: Promise<P> }): Promise<Metadata> {
  const { lang, slug } = await params
  return seriesPageMeta(s, lang, slug)
}

export default async function Page({ params }: { params: Promise<P> }) {
  const { lang, slug } = await params
  if (!s.pages.some((x) => x.slug === slug)) notFound()
  return <SeriesArticle s={s} lang={lang} slug={slug} />
}
