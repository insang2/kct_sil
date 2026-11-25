import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PAGES, getPage, MANUAL_PDF } from '@/lib/tech-manual'
import TechBlocks, { techCss } from '@/components/tech/TechBlocks'
import Tx from '@/components/tech/Tx'
import TechEnhance from '@/components/tech/TechEnhance'
import RelatedHubs from '@/components/tech/RelatedHubs'
import { TECH_UPDATED } from '@/lib/series/hubs'

type P = { lang: string; slug: string }
const BASE = 'https://kconstrade.com'
const brand = (l: 'ko' | 'en') => (l === 'ko' ? '한국건설트레이딩 (KCT)' : 'Korea Construction Trading (KCT)')
const norm = (lang: string): 'ko' | 'en' => (lang === 'ko' ? 'ko' : 'en') // ja는 영문 원문으로 표시

export async function generateMetadata({ params }: { params: Promise<P> }): Promise<Metadata> {
  const { lang, slug } = await params
  const page = getPage(slug)
  if (!page) return { title: 'Not found | KCT' }
  const l = norm(lang)
  const title = `${page.title[l]} | ${l === 'ko' ? '기술정보' : 'Technical'} | ${brand(l)}`
  const description = page.summary[l]
  const path = `/technical/${slug}`
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${lang === 'ja' ? 'en' : lang}${path}`,
      languages: { ko: `${BASE}/ko${path}`, en: `${BASE}/en${path}`, 'x-default': `${BASE}/ko${path}` },
    },
    openGraph: { title, description, url: `${BASE}/${lang}${path}`, siteName: '한국건설트레이딩 (KCT)', images: [{ url: `${BASE}${page.image}` }], type: 'article' },
  }
}

export default async function TechPageView({ params }: { params: Promise<P> }) {
  const { lang, slug } = await params
  const page = getPage(slug)
  if (!page) notFound()
  const l = norm(lang)
  const idx = PAGES.findIndex((p) => p.slug === slug)
  const prev = PAGES[idx - 1]
  const next = PAGES[idx + 1]
  const ko = l === 'ko'

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: ko ? '홈' : 'Home', item: `${BASE}/${lang}` },
          { '@type': 'ListItem', position: 2, name: ko ? '기술정보' : 'Technical Information', item: `${BASE}/${lang}/technical` },
          { '@type': 'ListItem', position: 3, name: page.title[l], item: `${BASE}/${lang}/technical/${slug}` },
        ],
      },
      {
        '@type': 'TechArticle',
        headline: page.title[l],
        description: page.summary[l],
        inLanguage: l,
        datePublished: TECH_UPDATED,
        dateModified: TECH_UPDATED,
        image: `${BASE}${page.image}`,
        isBasedOn: 'Fire-rated Dow Technologies Technical Manual, Form No. 62-2233-01-0325',
        publisher: { '@type': 'Organization', name: '한국건설트레이딩 (KCT)' },
      },
    ],
  }

  return (
    <Tx>
      <style dangerouslySetInnerHTML={{ __html: techCss }} />
      <TechEnhance lang={l} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="tx-hero" style={{ background: 'linear-gradient(135deg,#1f3a5f,#0f2038)', color: '#fff', paddingTop: 110, paddingBottom: 40 }}>
        <div className="container">
          <nav aria-label="breadcrumb" className="mb-3" style={{ fontSize: '.85rem' }}>
            <Link href={`/${lang}`} style={{ color: '#cbd5e1' }}>{ko ? '홈' : 'Home'}</Link>
            <span style={{ color: '#94a3b8' }}> › </span>
            <Link href={`/${lang}/technical`} style={{ color: '#cbd5e1' }}>{ko ? '기술정보' : 'Technical'}</Link>
            <span style={{ color: '#94a3b8' }}> › </span>
            <span style={{ color: '#fff' }}>{page.title[l]}</span>
          </nav>
          <div style={{ color: '#7dd3fc', fontWeight: 600, fontSize: '.85rem', letterSpacing: '.05em' }}>
            {ko ? `기술 매뉴얼 ${page.no} / ${PAGES.length}` : `TECHNICAL MANUAL ${page.no} / ${PAGES.length}`} · {ko ? `원문 ${page.pdfPages}쪽` : `Original pp. ${page.pdfPages}`}
          </div>
          <h1 className="fw-bold mt-1 mb-2" style={{ color: '#fff', fontSize: 'clamp(1.6rem,3.5vw,2.4rem)' }}>{page.title[l]}</h1>
          <p className="mb-0" style={{ color: '#e2e8f0', maxWidth: 760 }}>{page.summary[l]}</p>
        </div>
      </section>

      <div className="container py-5">
        <div className="row g-4">
          <aside className="col-lg-3">
            <div style={{ position: 'sticky', top: 90 }}>
              <div className="fw-bold mb-2" style={{ color: '#16142F', fontSize: '.85rem' }}>{ko ? '이 페이지의 내용' : 'On this page'}</div>
              <ul className="list-unstyled mb-4" style={{ fontSize: '.88rem' }}>
                {page.sections.map((s) => (
                  <li key={s.id} className="mb-1"><a href={`#${s.id}`} style={{ color: '#1558D6' }}>{s.h[l]}</a></li>
                ))}
              </ul>
              <div className="fw-bold mb-2" style={{ color: '#16142F', fontSize: '.85rem' }}>{ko ? '기술정보 전체 목차' : 'All topics'}</div>
              <ol className="list-unstyled mb-4" style={{ fontSize: '.84rem' }}>
                {PAGES.map((p) => (
                  <li key={p.slug} className="mb-1">
                    <Link href={`/${lang}/technical/${p.slug}`} style={{ color: p.slug === slug ? '#16142F' : '#555370', fontWeight: p.slug === slug ? 700 : 400 }}>
                      {p.no}. {p.title[l]}
                    </Link>
                  </li>
                ))}
              </ol>
              <a href={MANUAL_PDF} download className="btn btn-danger btn-sm rounded-pill px-3">
                <i className="bi bi-file-earmark-pdf me-1" />{ko ? '원문 PDF 다운로드' : 'Download original PDF'}
              </a>
            </div>
          </aside>

          <article className="col-lg-9">
            {page.sections.map((s) => (
              <section key={s.id} id={s.id} className="mb-5" style={{ scrollMarginTop: 90 }}>
                <h2 className="fw-bold mb-3 pb-2" style={{ color: '#16142F', fontSize: '1.5rem', borderBottom: '2px solid #1558D6' }}>{s.h[l]}</h2>
                <TechBlocks blocks={s.blocks} lang={l} />
              </section>
            ))}

            <div className="row g-3 mt-4">
              <div className="col-sm-6">
                {prev && (
                  <Link href={`/${lang}/technical/${prev.slug}`} className="d-block p-3 border rounded-4 text-decoration-none h-100">
                    <div style={{ color: '#555370', fontSize: '.8rem' }}>← {ko ? '이전' : 'Previous'}</div>
                    <div className="fw-bold" style={{ color: '#16142F' }}>{prev.title[l]}</div>
                  </Link>
                )}
              </div>
              <div className="col-sm-6">
                {next && (
                  <Link href={`/${lang}/technical/${next.slug}`} className="d-block p-3 border rounded-4 text-decoration-none h-100 text-sm-end">
                    <div style={{ color: '#555370', fontSize: '.8rem' }}>{ko ? '다음' : 'Next'} →</div>
                    <div className="fw-bold" style={{ color: '#16142F' }}>{next.title[l]}</div>
                  </Link>
                )}
              </div>
            </div>

            <RelatedHubs lang={lang} l={l} current="fire" />

            <div className="mt-5 p-4 rounded-4" style={{ background: '#f1f5fb', color: '#16142F' }}>
              <div className="fw-bold mb-1">{ko ? '내화 실란트 제품 문의' : 'Fire-rated sealant inquiries'}</div>
              <p className="mb-2" style={{ fontSize: '.92rem', color: '#555370' }}>
                {ko ? 'DOWSIL™ 내화 실란트 공급·견적·기술 문의는 아래로 연락해 주세요. 출처: Dow 기술 매뉴얼 (Form No. 62-2233-01-0325 S2D, © 2025 The Dow Chemical Company).' : 'For supply, quotations and technical questions on DOWSIL™ fire rated sealants, contact us. Source: Dow technical manual (Form No. 62-2233-01-0325 S2D, © 2025 The Dow Chemical Company).'}
              </p>
              <a href="mailto:sales@kconstrade.com" className="btn btn-primary btn-sm rounded-pill px-3 me-2">sales@kconstrade.com</a>
              <a href="https://wa.me/821089390284" target="_blank" rel="noreferrer" className="btn btn-outline-success btn-sm rounded-pill px-3">WhatsApp</a>
            </div>
          </article>
        </div>
      </div>
    </Tx>
  )
}
