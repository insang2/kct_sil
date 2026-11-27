import { CATALOG } from '@/lib/products-catalog'
import { localizeCatalog } from '@/lib/products-catalog-en'
import { PAGES as TECH_PAGES } from '@/lib/tech-manual'
import { IPAGES } from '@/lib/industrial/pages'
import { SERIES } from '@/lib/series/config'
import { HUBS, TECH_UPDATED } from '@/lib/series/hubs'
import { SERIES_DATES, SITE_DATES, seriesPageDate } from '@/lib/series/dates'

export const PRODUCTS_UPDATED = '2026-11-28'
export const BASE = 'https://kconstrade.com'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

type Item = { title: string; link: string; desc: string; date: string; cat: string }

// 기술정보·제품 페이지 RSS 2.0 (ko / en). 네이버 서치어드바이저 RSS 제출용.
export function buildRss(lang: 'ko' | 'en'): string {
  const ko = lang === 'ko'
  const items: Item[] = []
  const add = (path: string, title: string, desc: string, date: string, cat: string) =>
    items.push({ title, link: `${BASE}/${lang}/${path}`, desc, date, cat })

  for (const h of HUBS) add(h.path, h.title[lang], h.desc[lang], h.path === 'technical' ? SITE_DATES.technicalHub : seriesPageDate(h.key), ko ? '기술정보' : 'Technical')
  for (const p of TECH_PAGES) add(`technical/${p.slug}`, p.title[lang], p.summary[lang], SERIES_DATES.fire, ko ? '기술정보 · 내화 실란트' : 'Technical · Fire-rated')
  for (const p of IPAGES) add(`technical/industrial/${p.slug}`, p.title[lang], p.summary[lang], SERIES_DATES.industrial, ko ? '기술정보 · 산업·가전·유지보수' : 'Technical · Industrial')
  for (const s of Object.values(SERIES)) for (const p of s.pages) add(`technical/${s.key}/${p.slug}`, p.title[lang], p.summary[lang], seriesPageDate(s.key, p.doc), `${ko ? '기술정보' : 'Technical'} · ${s.short[lang]}`)
  for (const c of CATALOG) {
    const p = localizeCatalog(c, lang)
    add(`products/${c.slug}`, `${c.name} – ${p.summary}`, p.description.slice(0, 280), PRODUCTS_UPDATED, ko ? '제품정보' : 'Products')
  }

  items.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
  const title = ko ? '한국건설트레이딩 (KCT) – 기술정보·제품정보' : 'Korea Construction Trading (KCT) – Technical Information & Products'
  const desc = ko ? 'DOWSIL™ 실리콘 제품 정보와 Dow 기술 자료(내화, 산업용, 실리콘 교육, PSA, 전기·전자 테이프) 한영 수록' : 'DOWSIL™ silicone product information and Dow technical resources (fire-rated, industrial, silicone basics, PSA, electrical tapes) in Korean and English'
  const last = new Date(items[0]?.date ?? TECH_UPDATED).toUTCString()
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${esc(title)}</title>
<link>${BASE}/${lang}</link>
<description>${esc(desc)}</description>
<language>${lang}</language>
<lastBuildDate>${last}</lastBuildDate>
<atom:link href="${BASE}/${lang === 'ko' ? '' : 'en/'}rss.xml" rel="self" type="application/rss+xml" />
${items.map((i) => `<item>
<title>${esc(i.title)}</title>
<link>${i.link}</link>
<guid isPermaLink="true">${i.link}</guid>
<pubDate>${new Date(i.date).toUTCString()}</pubDate>
<category>${esc(i.cat)}</category>
<description>${esc(i.desc)}</description>
</item>`).join('\n')}
</channel>
</rss>
`
}

export const rssResponse = (lang: 'ko' | 'en') =>
  new Response(buildRss(lang), { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } })
