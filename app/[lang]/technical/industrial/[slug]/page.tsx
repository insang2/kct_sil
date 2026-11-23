import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { IPAGES, getIPage, SOURCE, SOURCE_PDF } from '@/lib/industrial/pages'
import { productLd } from '@/lib/industrial/jsonld'
import TechBlocks, { techCss } from '@/components/tech/TechBlocks'

type P = { lang: string; slug: string }
const BASE = 'https://kconstrade.com'
const navTitle = (t: string) => t.replace(/^(표|Table) [IVX]+:\s*/, '').split(' – ')[0]
const norm = (lang: string): 'ko' | 'en' => (lang === 'ko' ? 'ko' : 'en')

export async function generateMetadata({ params }: { params: Promise<P> }): Promise<Metadata> {
  const { lang, slug } = await params
  const page = getIPage(slug)
  if (!page) return { title: 'Not found | KCT' }
  const l = norm(lang)
  const title = `${page.title[l]} | ${l === 'ko' ? '기술정보' : 'Technical'} | KCT`
  const description = page.answer[l].slice(0, 300)
  const path = `/technical/industrial/${slug}`
  return {
    title,
    description,
    alternates: { canonical: `${BASE}/${lang}${path}`, languages: { ko: `${BASE}/ko${path}`, en: `${BASE}/en${path}`, ja: `${BASE}/ja${path}`, 'x-default': `${BASE}/ko${path}` } },
    openGraph: { title, description, url: `${BASE}/${lang}${path}`, siteName: '한국건설트레이딩 (KCT)', images: [{ url: `${BASE}${page.image}` }], type: 'article' },
    twitter: { card: 'summary_large_image', title, description, images: [`${BASE}${page.image}`] },
  }
}

export default async function IndustrialPage({ params }: { params: Promise<P> }) {
  const { lang, slug } = await params
  const page = getIPage(slug)
  if (!page) notFound()
  const l = norm(lang)
  const ko = l === 'ko'
  const idx = IPAGES.findIndex((x) => x.slug === slug)
  const prev = IPAGES[idx - 1]
  const next = IPAGES[idx + 1]
  const url = `${BASE}/${lang}/technical/industrial/${slug}`

  const prodIds = Array.from(new Set(page.sections.flatMap((s) => s.blocks.flatMap((b) => (b.k === 'prods' ? b.ids : [])))))
  const graph: unknown[] = [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: ko ? '홈' : 'Home', item: `${BASE}/${lang}` },
        { '@type': 'ListItem', position: 2, name: ko ? '기술정보' : 'Technical Information', item: `${BASE}/${lang}/technical` },
        { '@type': 'ListItem', position: 3, name: ko ? '산업·가전·유지보수용 실리콘' : 'Industrial, Appliance & Maintenance Silicones', item: `${BASE}/${lang}/technical/industrial` },
        { '@type': 'ListItem', position: 4, name: page.title[l], item: url },
      ],
    },
    {
      '@type': 'TechArticle',
      '@id': url,
      headline: page.title[l],
      description: page.answer[l],
      abstract: page.summary[l],
      inLanguage: l,
      image: `${BASE}${page.image}`,
      url,
      isBasedOn: { '@type': 'CreativeWork', name: SOURCE, publisher: { '@type': 'Organization', name: 'The Dow Chemical Company' }, url: `${BASE}${SOURCE_PDF}` },
      citation: SOURCE,
      author: { '@type': 'Organization', name: '한국건설트레이딩 (KCT)', url: BASE },
      publisher: { '@type': 'Organization', name: '한국건설트레이딩 (KCT)', url: BASE },
      mainEntityOfPage: url,
    },
    {
      '@type': 'FAQPage',
      mainEntity: page.faq.map((f) => ({ '@type': 'Question', name: f.q[l], acceptedAnswer: { '@type': 'Answer', text: f.a[l] } })),
    },
    ...(prodIds.length ? [{ '@type': 'ItemList', name: page.title[l], numberOfItems: prodIds.length, itemListElement: prodIds.map((id, i) => ({ '@type': 'ListItem', position: i + 1, item: productLd(id, lang) })) }] : []),
  ]

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: techCss }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }) }} />

      <section style={{ background: 'linear-gradient(135deg,#7a2e00,#2b1200)', color: '#fff', paddingTop: 110, paddingBottom: 40 }}>
        <div className="container">
          <nav aria-label="breadcrumb" className="mb-3" style={{ fontSize: '.85rem' }}>
            <Link href={`/${lang}`} style={{ color: '#fed7aa' }}>{ko ? '홈' : 'Home'}</Link><span style={{ color: '#fdba74' }}> › </span>
            <Link href={`/${lang}/technical`} style={{ color: '#fed7aa' }}>{ko ? '기술정보' : 'Technical'}</Link><span style={{ color: '#fdba74' }}> › </span>
            <Link href={`/${lang}/technical/industrial`} style={{ color: '#fed7aa' }}>{ko ? '산업·가전·유지보수' : 'Industrial & Appliance'}</Link>
          </nav>
          <div style={{ color: '#fdba74', fontWeight: 600, fontSize: '.85rem', letterSpacing: '.05em' }}>
            {ko ? `선정 가이드 ${page.no} / ${IPAGES.length}` : `SELECTION GUIDE ${page.no} / ${IPAGES.length}`} · {ko ? `원문 ${page.pdfPages}쪽` : `Original pp. ${page.pdfPages}`}
          </div>
          <h1 className="fw-bold mt-1 mb-2" style={{ color: '#fff', fontSize: 'clamp(1.5rem,3.2vw,2.2rem)', lineHeight: 1.3 }}>{page.title[l]}</h1>
          <p className="mb-0" style={{ color: '#ffedd5', maxWidth: 780 }}>{page.summary[l]}</p>
        </div>
      </section>

      <div className="container py-5">
        <div className="row g-4">
          <aside className="col-lg-3">
            <div style={{ position: 'sticky', top: 90 }}>
              <div className="fw-bold mb-2" style={{ color: '#16142F', fontSize: '.85rem' }}>{ko ? '이 페이지의 내용' : 'On this page'}</div>
              <ul className="list-unstyled mb-3" style={{ fontSize: '.88rem' }}>
                <li className="mb-1"><a href="#key-facts" style={{ color: '#1558D6' }}>{ko ? '핵심 요약' : 'Key facts'}</a></li>
                {page.sections.map((s) => <li key={s.id} className="mb-1"><a href={`#${s.id}`} style={{ color: '#1558D6' }}>{s.h[l]}</a></li>)}
                <li className="mb-1"><a href="#faq" style={{ color: '#1558D6' }}>{ko ? '자주 묻는 질문' : 'FAQ'}</a></li>
                <li className="mb-1"><a href="#cite" style={{ color: '#1558D6' }}>{ko ? '출처·인용' : 'Source & citation'}</a></li>
              </ul>
              <div className="fw-bold mb-2" style={{ color: '#16142F', fontSize: '.85rem' }}>{ko ? '선정 가이드 목차' : 'All guide pages'}</div>
              <ol className="list-unstyled mb-3" style={{ fontSize: '.82rem' }}>
                {IPAGES.map((x) => (
                  <li key={x.slug} className="mb-1">
                    <Link href={`/${lang}/technical/industrial/${x.slug}`} style={{ color: x.slug === slug ? '#16142F' : '#555370', fontWeight: x.slug === slug ? 700 : 400 }}>{x.no}. {navTitle(x.title[l])}</Link>
                  </li>
                ))}
              </ol>
              <a href={SOURCE_PDF} download className="btn btn-danger btn-sm rounded-pill px-3"><i className="bi bi-file-earmark-pdf me-1" />{ko ? '원문 PDF' : 'Original PDF'}</a>
            </div>
          </aside>

          <main className="col-lg-9">
            <section id="key-facts" className="mb-4 p-4 rounded-4" style={{ background: '#fff7ed', border: '1px solid #fed7aa', scrollMarginTop: 90 }} aria-label={ko ? '핵심 요약' : 'Key facts'}>
              <div className="fw-bold mb-1" style={{ color: '#9a3412', fontSize: '.85rem', letterSpacing: '.04em' }}>{ko ? '핵심 요약' : 'KEY FACTS'}</div>
              <p className="mb-0" style={{ color: '#16142F', lineHeight: 1.8 }}>{page.answer[l]}</p>
            </section>

            {page.sections.map((s) => (
              <section key={s.id} id={s.id} className="mb-5" style={{ scrollMarginTop: 90 }}>
                <h2 className="fw-bold mb-3 pb-2" style={{ color: '#16142F', fontSize: '1.45rem', borderBottom: '2px solid #ea580c' }}>{s.h[l]}</h2>
                <TechBlocks blocks={s.blocks} lang={l} />
              </section>
            ))}

            <section id="faq" className="mb-5" style={{ scrollMarginTop: 90 }}>
              <h2 className="fw-bold mb-3 pb-2" style={{ color: '#16142F', fontSize: '1.45rem', borderBottom: '2px solid #ea580c' }}>{ko ? '자주 묻는 질문' : 'Frequently asked questions'}</h2>
              {page.faq.map((f, i) => (
                <details key={i} className="tech-faq" open={i === 0}>
                  <summary>{f.q[l]}</summary>
                  <p>{f.a[l]}</p>
                </details>
              ))}
            </section>

            <section id="cite" className="mb-4 p-4 rounded-4" style={{ background: '#f1f5fb', color: '#16142F', scrollMarginTop: 90 }}>
              <div className="fw-bold mb-2">{ko ? '출처 및 인용' : 'Source and citation'}</div>
              <p className="mb-2" style={{ fontSize: '.9rem', lineHeight: 1.7 }}>
                {ko ? '이 페이지의 제품 데이터와 설명은 다음 Dow 문서를 바탕으로 정리했으며, 수치는 대표 물성으로 시방 값이 아닙니다.' : 'Product data and descriptions on this page are reproduced from the following Dow document. Values are typical properties, not specifications.'}
              </p>
              <p className="mb-2" style={{ fontSize: '.88rem', color: '#555370' }}>{SOURCE}</p>
              <p className="mb-0" style={{ fontSize: '.85rem', color: '#555370' }}>
                {ko ? '인용 예시' : 'Suggested citation'}: “{page.title[l]}”, {ko ? '한국건설트레이딩(KCT) 기술정보' : 'Korea Construction Trading (KCT) Technical Information'}, {url}
              </p>
            </section>

            <div className="row g-3 mt-2">
              <div className="col-sm-6">{prev && (
                <Link href={`/${lang}/technical/industrial/${prev.slug}`} className="d-block p-3 border rounded-4 text-decoration-none h-100">
                  <div style={{ color: '#555370', fontSize: '.8rem' }}>← {ko ? '이전' : 'Previous'}</div><div className="fw-bold" style={{ color: '#16142F' }}>{prev.title[l]}</div>
                </Link>)}</div>
              <div className="col-sm-6">{next && (
                <Link href={`/${lang}/technical/industrial/${next.slug}`} className="d-block p-3 border rounded-4 text-decoration-none h-100 text-sm-end">
                  <div style={{ color: '#555370', fontSize: '.8rem' }}>{ko ? '다음' : 'Next'} →</div><div className="fw-bold" style={{ color: '#16142F' }}>{next.title[l]}</div>
                </Link>)}</div>
            </div>

            <div className="mt-4 p-4 rounded-4" style={{ background: '#f1f5fb', color: '#16142F' }}>
              <div className="fw-bold mb-1">{ko ? 'DOWSIL™ 실리콘 공급·견적 문의' : 'DOWSIL™ silicone supply and quotations'}</div>
              <a href="mailto:sales@kconstrade.com" className="btn btn-primary btn-sm rounded-pill px-3 me-2">sales@kconstrade.com</a>
              <a href="https://wa.me/821089390284" target="_blank" rel="noreferrer" className="btn btn-outline-success btn-sm rounded-pill px-3">WhatsApp</a>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
