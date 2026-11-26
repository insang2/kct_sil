import type { Metadata } from 'next'
import Link from 'next/link'
import TechBlocks, { techCss } from '@/components/tech/TechBlocks'
import Tx from '@/components/tech/Tx'
import type { Series } from '@/lib/series/config'
import TechEnhance from '@/components/tech/TechEnhance'
import RelatedHubs from '@/components/tech/RelatedHubs'
import { TECH_UPDATED } from '@/lib/series/hubs'

const BASE = 'https://kconstrade.com'
const brand = (l: 'ko' | 'en') => (l === 'ko' ? '한국건설트레이딩 (KCT)' : 'Korea Construction Trading (KCT)')
export const norm = (lang: string): 'ko' | 'en' => (lang === 'ko' ? 'ko' : 'en')
const navTitle = (t: string) => t.split(' – ')[0]
const C = { dark: 'linear-gradient(135deg,#0b3b6e,#0a1f3d)', accent: '#1558D6', soft: '#eef4ff', line: '#c7dafc', txt: '#0b2a55' }

export function seriesPageMeta(s: Series, lang: string, slug?: string): Metadata {
  const l = norm(lang)
  const page = slug ? s.pages.find((x) => x.slug === slug) : undefined
  if (slug && !page) return { title: 'Not found | KCT' }
  const path = `/technical/${s.key}${slug ? `/${slug}` : ''}`
  const title = page ? `${navTitle(page.title[l])} | ${s.short[l]} | ${brand(l)}` : `${s.hubTitle[l]} | ${brand(l)}`
  const description = page ? page.summary[l] : s.hubDesc[l]
  const image = `${BASE}${page ? page.image : s.cover}`
  return {
    title, description,
    alternates: { canonical: `${BASE}/${lang === 'ja' ? 'en' : lang}${path}`, languages: { ko: `${BASE}/ko${path}`, en: `${BASE}/en${path}`, 'x-default': `${BASE}/ko${path}` } },
    openGraph: { title, description, url: `${BASE}/${lang}${path}`, siteName: '한국건설트레이딩 (KCT)', images: [{ url: image }], type: page ? 'article' : 'website' },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  }
}

const crumbs = (s: Series, lang: string, ko: boolean, l: 'ko' | 'en') => [
  { '@type': 'ListItem', position: 1, name: ko ? '홈' : 'Home', item: `${BASE}/${lang}` },
  { '@type': 'ListItem', position: 2, name: ko ? '기술정보' : 'Technical Information', item: `${BASE}/${lang}/technical` },
  { '@type': 'ListItem', position: 3, name: s.short[l], item: `${BASE}/${lang}/technical/${s.key}` },
]

const Ld = ({ graph }: { graph: unknown[] }) => (
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }) }} />
)

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="fw-bold mb-3 pb-2" style={{ color: '#16142F', fontSize: '1.45rem', borderBottom: `2px solid ${C.accent}` }}>{children}</h2>
)

export function SeriesHub({ s, lang }: { s: Series; lang: string }) {
  const l = norm(lang)
  const ko = l === 'ko'
  const url = `${BASE}/${lang}/technical/${s.key}`
  const faqs = s.pages.flatMap((p) => p.faq.slice(0, s.hubFaqCount))
  const graph = [
    { '@type': 'BreadcrumbList', itemListElement: crumbs(s, lang, ko, l) },
    { '@type': 'CollectionPage', '@id': url, name: s.hubTitle[l], description: s.hubDesc[l], inLanguage: l, url, citation: s.source,
      isBasedOn: (s.pdfs ?? [{ href: s.pdf }]).map((d) => ({ '@type': 'CreativeWork', name: s.source, url: `${BASE}${d.href}` })),
      publisher: { '@type': 'Organization', name: '한국건설트레이딩 (KCT)', url: BASE },
      hasPart: s.pages.map((p) => ({ '@type': 'TechArticle', headline: p.title[l], url: `${url}/${p.slug}` })) },
    { '@type': 'FAQPage', mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q[l], acceptedAnswer: { '@type': 'Answer', text: f.a[l] } })) },
  ]
  return (
    <Tx>
      <style dangerouslySetInnerHTML={{ __html: techCss }} />
      <Ld graph={graph} />
      <section className="tx-hero tx-big" style={{ background: C.dark, color: '#fff', paddingTop: 120, paddingBottom: 56 }}>
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <nav aria-label="breadcrumb" className="mb-3" style={{ fontSize: '.85rem' }}>
                <Link href={`/${lang}`} style={{ color: '#bfdbfe' }}>{ko ? '홈' : 'Home'}</Link><span style={{ color: '#93c5fd' }}> › </span>
                <Link href={`/${lang}/technical`} style={{ color: '#bfdbfe' }}>{ko ? '기술정보' : 'Technical'}</Link>
              </nav>
              <span className="badge rounded-pill px-3 py-2 mb-3" style={{ background: 'rgba(255,255,255,.15)', letterSpacing: '.08em' }}>{s.badge}</span>
              <h1 className="fw-bold mb-3" style={{ color: '#fff', fontSize: 'clamp(1.7rem,3.6vw,2.6rem)', lineHeight: 1.25 }}>{s.hubTitle[l]}</h1>
              <p style={{ color: '#dbeafe', lineHeight: 1.8, maxWidth: 640 }}>{s.intro[l]}</p>
              <div className="d-flex flex-wrap gap-2">
                <Link href={`/${lang}/technical/${s.key}/${s.pages[0].slug}`} className="btn btn-light rounded-pill px-4 fw-bold">{ko ? '처음부터 보기' : 'Start reading'}</Link>
                {(s.pdfs ?? [{ href: s.pdf, label: { en: 'Original PDF', ko: '원문 PDF' } }]).map((d) => (
                  <a key={d.href} href={d.href} download className="btn btn-outline-light rounded-pill px-4"><i className="bi bi-file-earmark-pdf me-2" />{s.pdfs ? d.label[l] : ko ? '원문 PDF' : 'Original PDF'}</a>
                ))}
              </div>
            </div>
            <div className="col-lg-5"><img src={s.cover} alt={s.hubTitle[l]} className="w-100 rounded-4 shadow bg-white" /></div>
          </div>
        </div>
      </section>
      <section className="py-5 bg-white">
        <div className="container">
          <div className="p-4 rounded-4 mb-5" style={{ background: C.soft, border: `1px solid ${C.line}` }}>
            <div className="fw-bold mb-1" style={{ color: C.txt, fontSize: '.85rem', letterSpacing: '.04em' }}>{ko ? '핵심 요약' : 'KEY FACTS'}</div>
            <p className="mb-0" style={{ color: '#16142F', lineHeight: 1.85 }}>{s.keyFacts[l]}</p>
          </div>
          <h2 className="fw-bold mb-4" style={{ color: '#16142F' }}>{ko ? '목차' : 'Contents'}</h2>
          <div className="row g-4 mb-5">
            {s.pages.map((p) => (
              <div key={p.slug} className="col-md-6 col-lg-4">
                <Link href={`/${lang}/technical/${s.key}/${p.slug}`} className="card h-100 border-0 shadow-sm rounded-4 text-decoration-none product-card-hover">
                  <div className="card-body p-4">
                    <div style={{ color: C.accent, fontSize: '.78rem', fontWeight: 700 }}>{String(p.no).padStart(2, '0')}{p.doc && ` · ${p.doc}`}{p.pdfPages !== '—' && ` · ${ko ? `원문 ${p.pdfPages}쪽` : `pp. ${p.pdfPages}`}`}</div>
                    <h3 className="h6 fw-bold my-2" style={{ color: '#16142F', lineHeight: 1.45 }}>{p.title[l]}</h3>
                    <p className="mb-0" style={{ color: '#555370', fontSize: '.86rem', lineHeight: 1.65 }}>{p.summary[l]}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <h2 className="fw-bold mb-3" style={{ color: '#16142F' }}>{ko ? '자주 묻는 질문' : 'Frequently asked questions'}</h2>
          <div className="mb-5">
            {faqs.map((f, i) => (
              <details key={i} className="tech-faq" open={i === 0}><summary>{f.q[l]}</summary><p>{f.a[l]}</p></details>
            ))}
          </div>
          <Cite s={s} l={l} ko={ko} url={url} title={s.hubTitle[l]} />
          <RelatedHubs lang={lang} l={l} current={s.key} />
          <Contact ko={ko} lang={lang} />
        </div>
      </section>
    </Tx>
  )
}

function Cite({ s, l, ko, url, title }: { s: Series; l: 'ko' | 'en'; ko: boolean; url: string; title: string }) {
  return (
    <section id="cite" className="mb-4 p-4 rounded-4" style={{ background: '#f1f5fb', color: '#16142F', scrollMarginTop: 90 }}>
      <div className="fw-bold mb-2">{ko ? '출처 및 인용' : 'Source and citation'}</div>
      <p className="mb-2" style={{ fontSize: '.9rem', lineHeight: 1.7 }}>
        {ko ? '이 페이지는 다음 문서를 바탕으로 정리했습니다. 수치는 대표 값이며 시방 값이 아니므로 설계·구매 전에 원문과 제품 데이터 시트를 확인하십시오.' : 'This page is based on the following document. Values are typical, not specifications; verify with the original and product data sheets before design or purchase.'}
      </p>
      <p className="mb-2" style={{ fontSize: '.88rem', color: '#555370' }}>{s.source}</p>
      <p className="mb-0" style={{ fontSize: '.85rem', color: '#555370' }}>
        {ko ? '인용 예시' : 'Suggested citation'}: “{title}”, {ko ? '한국건설트레이딩(KCT) 기술정보' : 'Korea Construction Trading (KCT) Technical Information'}, {url}
      </p>
    </section>
  )
}

function Contact({ ko, lang }: { ko: boolean; lang: string }) {
  return (
    <div className="mt-4 p-4 rounded-4" style={{ background: '#f1f5fb', color: '#16142F' }}>
      <div className="fw-bold mb-1">{ko ? '문의 · 한국건설트레이딩 (KCT)' : 'Inquiries · Korea Construction Trading (KCT)'}</div>
      <p className="mb-2" style={{ fontSize: '.9rem' }}>{ko ? 'DOWSIL™ 실리콘 제품 선정, 견적, 기술 상담은 한국건설트레이딩으로 문의해 주십시오. 한국건설트레이딩은 제품 선정부터 공정 조건 검토와 문제 해결까지 기술 지원을 위해 최선을 다하겠습니다.' : 'For DOWSIL™ silicone selection, quotations and technical advice, please contact Korea Construction Trading. We do our best to support you technically, from product selection to process-condition review and troubleshooting.'}{' '}<Link href={`/${lang}/technical/tapes/kct-technical-support`}>{ko ? '기술 지원 안내 →' : 'Technical support details →'}</Link></p>
      <a href="mailto:sales@kconstrade.com" className="btn btn-primary btn-sm rounded-pill px-3 me-2">sales@kconstrade.com</a>
      <a href="tel:+821089390284" className="btn btn-outline-primary btn-sm rounded-pill px-3 me-2">010-8939-0284</a>
      <a href="https://wa.me/821089390284" target="_blank" rel="noreferrer" className="btn btn-outline-success btn-sm rounded-pill px-3">WhatsApp</a>
    </div>
  )
}

export function SeriesArticle({ s, lang, slug }: { s: Series; lang: string; slug: string }) {
  const l = norm(lang)
  const ko = l === 'ko'
  const idx = s.pages.findIndex((x) => x.slug === slug)
  const page = s.pages[idx]
  const prev = s.pages[idx - 1]
  const next = s.pages[idx + 1]
  const url = `${BASE}/${lang}/technical/${s.key}/${slug}`
  const graph = [
    { '@type': 'BreadcrumbList', itemListElement: [...crumbs(s, lang, ko, l), { '@type': 'ListItem', position: 4, name: page.title[l], item: url }] },
    { '@type': 'TechArticle', '@id': url, headline: page.title[l], description: page.answer[l], abstract: page.summary[l], inLanguage: l, datePublished: TECH_UPDATED, dateModified: TECH_UPDATED, image: `${BASE}${page.image}`, url,
      isBasedOn: (s.pdfs ?? [{ href: s.pdf }]).map((d) => ({ '@type': 'CreativeWork', name: s.source, url: `${BASE}${d.href}` })), citation: s.source,
      author: { '@type': 'Organization', name: '한국건설트레이딩 (KCT)', url: BASE },
      publisher: { '@type': 'Organization', name: '한국건설트레이딩 (KCT)', url: BASE }, mainEntityOfPage: url },
    { '@type': 'FAQPage', mainEntity: page.faq.map((f) => ({ '@type': 'Question', name: f.q[l], acceptedAnswer: { '@type': 'Answer', text: f.a[l] } })) },
  ]
  const A = ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href} style={{ color: C.accent }}>{children}</a>
  return (
    <Tx>
      <style dangerouslySetInnerHTML={{ __html: techCss }} />
      <TechEnhance lang={l} />
      <Ld graph={graph} />
      <section className="tx-hero" style={{ background: C.dark, color: '#fff', paddingTop: 110, paddingBottom: 40 }}>
        <div className="container">
          <nav aria-label="breadcrumb" className="mb-3" style={{ fontSize: '.85rem' }}>
            <Link href={`/${lang}`} style={{ color: '#bfdbfe' }}>{ko ? '홈' : 'Home'}</Link><span style={{ color: '#93c5fd' }}> › </span>
            <Link href={`/${lang}/technical`} style={{ color: '#bfdbfe' }}>{ko ? '기술정보' : 'Technical'}</Link><span style={{ color: '#93c5fd' }}> › </span>
            <Link href={`/${lang}/technical/${s.key}`} style={{ color: '#bfdbfe' }}>{s.short[l]}</Link>
          </nav>
          <div style={{ color: '#93c5fd', fontWeight: 600, fontSize: '.85rem', letterSpacing: '.05em' }}>
            {s.badge} {page.no} / {s.pages.length}{page.doc && ` · ${page.doc}`}{page.pdfPages !== '—' && ` · ${ko ? `원문 ${page.pdfPages}쪽` : `Original pp. ${page.pdfPages}`}`}
          </div>
          <h1 className="fw-bold mt-1 mb-2" style={{ color: '#fff', fontSize: 'clamp(1.5rem,3.2vw,2.2rem)', lineHeight: 1.3 }}>{page.title[l]}</h1>
          <p className="mb-0" style={{ color: '#dbeafe', maxWidth: 780 }}>{page.summary[l]}</p>
        </div>
      </section>
      <div className="container py-5">
        <div className="row g-4">
          <aside className="col-lg-3">
            <div style={{ position: 'sticky', top: 90 }}>
              <div className="fw-bold mb-2" style={{ color: '#16142F', fontSize: '.85rem' }}>{ko ? '이 페이지의 내용' : 'On this page'}</div>
              <ul className="list-unstyled mb-3" style={{ fontSize: '.88rem' }}>
                <li className="mb-1"><A href="#key-facts">{ko ? '핵심 요약' : 'Key facts'}</A></li>
                {page.sections.map((x) => <li key={x.id} className="mb-1"><A href={`#${x.id}`}>{x.h[l]}</A></li>)}
                <li className="mb-1"><A href="#faq">{ko ? '자주 묻는 질문' : 'FAQ'}</A></li>
                <li className="mb-1"><A href="#cite">{ko ? '출처·인용' : 'Source & citation'}</A></li>
              </ul>
              <div className="fw-bold mb-2" style={{ color: '#16142F', fontSize: '.85rem' }}>{ko ? '전체 목차' : 'All pages'}</div>
              <ol className="list-unstyled mb-3" style={{ fontSize: '.82rem' }}>
                {s.pages.map((x) => (
                  <li key={x.slug} className="mb-1">
                    <Link href={`/${lang}/technical/${s.key}/${x.slug}`} style={{ color: x.slug === slug ? '#16142F' : '#555370', fontWeight: x.slug === slug ? 700 : 400 }}>{x.no}. {navTitle(x.title[l])}</Link>
                  </li>
                ))}
              </ol>
              <div className="d-flex flex-column gap-2 align-items-start">
                {(s.pdfs ?? [{ href: s.pdf, label: { en: 'Original PDF', ko: '원문 PDF' } }]).map((d) => (
                  <a key={d.href} href={d.href} download className="btn btn-danger btn-sm rounded-pill px-3 text-start"><i className="bi bi-file-earmark-pdf me-1" />{s.pdfs ? d.label[l] : ko ? '원문 PDF' : 'Original PDF'}</a>
                ))}
              </div>
            </div>
          </aside>
          <article className="col-lg-9">
            <section id="key-facts" className="mb-4 p-4 rounded-4" style={{ background: C.soft, border: `1px solid ${C.line}`, scrollMarginTop: 90 }} aria-label={ko ? '핵심 요약' : 'Key facts'}>
              <div className="fw-bold mb-1" style={{ color: C.txt, fontSize: '.85rem', letterSpacing: '.04em' }}>{ko ? '핵심 요약' : 'KEY FACTS'}</div>
              <p className="mb-0" style={{ color: '#16142F', lineHeight: 1.8 }}>{page.answer[l]}</p>
            </section>
            {page.sections.map((x) => (
              <section key={x.id} id={x.id} className="mb-5" style={{ scrollMarginTop: 90 }}>
                <H2>{x.h[l]}</H2>
                <TechBlocks blocks={x.blocks} lang={l} enLabel={s.srcLang === 'ko' ? 'English translation' : 'English original'} />
              </section>
            ))}
            <section id="faq" className="mb-5" style={{ scrollMarginTop: 90 }}>
              <H2>{ko ? '자주 묻는 질문' : 'Frequently asked questions'}</H2>
              {page.faq.map((f, i) => (
                <details key={i} className="tech-faq" open={i === 0}><summary>{f.q[l]}</summary><p>{f.a[l]}</p></details>
              ))}
            </section>
            <Cite s={s} l={l} ko={ko} url={url} title={page.title[l]} />
            <div className="row g-3 mt-2">
              <div className="col-sm-6">{prev && (
                <Link href={`/${lang}/technical/${s.key}/${prev.slug}`} className="d-block p-3 border rounded-4 text-decoration-none h-100">
                  <div style={{ color: '#555370', fontSize: '.8rem' }}>← {ko ? '이전' : 'Previous'}</div><div className="fw-bold" style={{ color: '#16142F' }}>{prev.title[l]}</div>
                </Link>)}</div>
              <div className="col-sm-6">{next && (
                <Link href={`/${lang}/technical/${s.key}/${next.slug}`} className="d-block p-3 border rounded-4 text-decoration-none h-100 text-sm-end">
                  <div style={{ color: '#555370', fontSize: '.8rem' }}>{ko ? '다음' : 'Next'} →</div><div className="fw-bold" style={{ color: '#16142F' }}>{next.title[l]}</div>
                </Link>)}</div>
            </div>
            <RelatedHubs lang={lang} l={l} current={s.key} />
            <Contact ko={ko} lang={lang} />
          </article>
        </div>
      </div>
    </Tx>
  )
}
