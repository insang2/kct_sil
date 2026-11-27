import type { Metadata } from 'next'
import { SERIES } from '@/lib/series/config'
import { SeriesHub } from '@/components/tech/SeriesPage'
import { seriesPageMeta } from '@/lib/series/hubs'

type P = { lang: string }
const s = SERIES.tapes

export async function generateMetadata({ params }: { params: Promise<P> }): Promise<Metadata> {
  const { lang } = await params
  return seriesPageMeta(s, lang)
}

export default async function Hub({ params }: { params: Promise<P> }) {
  const { lang } = await params
  return <SeriesHub s={s} lang={lang} />
}
