import type { Metadata } from 'next'
import Link from 'next/link'
import { IPAGES, SOURCE, SOURCE_PDF } from '@/lib/industrial/pages'
import { PRODUCTS, GROUP_LABEL, GROUP_PAGE, type Group } from '@/lib/industrial/data'
import { productLd } from '@/lib/industrial/jsonld'
import { techCss } from '@/components/tech/TechBlocks'
import Tx from '@/components/tech/Tx'
import { industrialHubMeta } from '@/lib/series/hubs'

type P = { lang: string }
const BASE = 'https://kconstrade.com'
const norm = (lang: string): 'ko' | 'en' => (lang === 'ko' ? 'ko' : 'en')
const ORDER: Group[] = ['acetoxy', 'hightemp', 'alkoxy', 'oxime', 'twopart', 'hotmelt', 'foam', 'primer', 'cleaner']

export async function generateMetadata({ params }: { params: Promise<P> }): Promise<Metadata> {
  const { lang } = await params
  return industrialHubMeta(lang)
}

export default async function IndustrialHub({ params }: { params: Promise<P> }) {
  const { lang } = await params
  const l = norm(lang)
  const ko = l === 'ko'
  const url = `${BASE}/${lang}/technical/industrial`
  const faqs = IPAGES.flatMap((p) => p.faq.slice(0, 1))

  const graph = [
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: ko ? '홈' : 'Home', item: `${BASE}/${lang}` },
      { '@type': 'ListItem', position: 2, name: ko ? '기술정보' : 'Technical Information', item: `${BASE}/${lang}/technical` },
      { '@type': 'ListItem', position: 3, name: ko ? '산업·가전·유지보수용 실리콘' : 'Industrial, Appliance & Maintenance Silicones', item: url },
    ] },
    { '@type': 'CollectionPage', '@id': url, name: ko ? 'DOWSIL™ 산업·가전·유지보수용 실리콘 실란트·폼 선정 가이드' : 'DOWSIL™ Silicone Sealants and Foams for Industrial, Appliance and Maintenance – Selection Guide', inLanguage: l, url,
      isBasedOn: { '@type': 'CreativeWork', name: SOURCE, url: `${BASE}${SOURCE_PDF}` }, citation: SOURCE,
      hasPart: IPAGES.map((p) => ({ '@type': 'TechArticle', headline: p.title[l], url: `${url}/${p.slug}` })) },
    { '@type': 'ItemList', name: ko ? 'DOWSIL™ 산업용 제품 38종' : 'DOWSIL™ industrial products (38)', numberOfItems: PRODUCTS.length, itemListElement: PRODUCTS.map((pr, i) => ({ '@type': 'ListItem', position: i + 1, item: productLd(pr.id, lang) })) },
    { '@type': 'FAQPage', mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q[l], acceptedAnswer: { '@type': 'Answer', text: f.a[l] } })) },
  ]

  return (
    <Tx>
      <style dangerouslySetInnerHTML={{ __html: techCss }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }) }} />

      <section className="tx-hero tx-big" style={{ background: 'linear-gradient(135deg,#7a2e00,#2b1200)', color: '#fff', paddingTop: 120, paddingBottom: 56 }}>
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <nav aria-label="breadcrumb" className="mb-3" style={{ fontSize: '.85rem' }}>
                <Link href={`/${lang}`} style={{ color: '#fed7aa' }}>{ko ? '홈' : 'Home'}</Link><span style={{ color: '#fdba74' }}> › </span>
                <Link href={`/${lang}/technical`} style={{ color: '#fed7aa' }}>{ko ? '기술정보' : 'Technical'}</Link>
              </nav>
              <span className="badge rounded-pill px-3 py-2 mb-3" style={{ background: 'rgba(255,255,255,.15)', letterSpacing: '.08em' }}>SELECTION GUIDE</span>
              <h1 className="fw-bold mb-3" style={{ color: '#fff', fontSize: 'clamp(1.7rem,3.6vw,2.7rem)', lineHeight: 1.25 }}>
                {ko ? '산업·가전·유지보수용 DOWSIL™ 실리콘 실란트·폼 선정 가이드' : 'DOWSIL™ Silicone Sealants and Foams for Industrial, Appliance and Maintenance'}
              </h1>
              <p style={{ color: '#ffedd5', lineHeight: 1.8, maxWidth: 640 }}>
                {ko
                  ? 'Dow 「Selection Guide」(Form No. 80-8283-01-0922 S2D) 전체를 영문 원문과 한국어 번역으로 수록했습니다. 38개 제품의 사양, 접착 등급, 표면 준비, 프라이머, 시공·경화 방법을 14개 페이지로 정리했습니다.'
                  : 'The complete Dow Selection Guide (Form No. 80-8283-01-0922 S2D) in English with a Korean translation. Specifications for 38 products, adhesion ratings, surface preparation, primers, application and cure, organized into 14 pages.'}
              </p>
              <div className="d-flex flex-wrap gap-2">
                <Link href={`/${lang}/technical/industrial/${IPAGES[0].slug}`} className="btn btn-light rounded-pill px-4 fw-bold">{ko ? '처음부터 보기' : 'Start reading'}</Link>
                <Link href={`/${lang}/technical/industrial/product-selector`} className="btn btn-outline-light rounded-pill px-4">{ko ? '제품 한눈에 비교' : 'Compare all products'}</Link>
                <a href={SOURCE_PDF} download className="btn btn-outline-light rounded-pill px-4"><i className="bi bi-file-earmark-pdf me-2" />{ko ? '원문 PDF' : 'Original PDF'}</a>
              </div>
            </div>
            <div className="col-lg-5">
              <img src="/assets/tech/ind-cover.jpg" alt={ko ? '산업·가전·유지보수용 DOWSIL™ 실리콘 적용 사례' : 'DOWSIL silicone applications: appliance, rail, industrial piping and engine rooms'} className="w-100 rounded-4 shadow" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-white">
        <div className="container">
          <div className="p-4 rounded-4 mb-5" style={{ background: '#fff7ed', border: '1px solid #fed7aa' }}>
            <div className="fw-bold mb-1" style={{ color: '#9a3412', fontSize: '.85rem', letterSpacing: '.04em' }}>{ko ? '핵심 요약' : 'KEY FACTS'}</div>
            <p className="mb-0" style={{ color: '#16142F', lineHeight: 1.85 }}>
              {ko
                ? 'DOWSIL™ 실리콘 실란트는 상온에서 질기고 고무 같은 고체로 경화되는 내구성 RTV 실란트이며, 올바르게 경화되면 대부분 -56~177°C(단속 204°C), 일부는 260°C 이상(단속 315°C)에서 사용할 수 있습니다. 이 가이드는 아세톡시, 알콕시, 옥심, 2액형, 핫멜트 실란트와 백금 경화 실리콘 폼, 프라이머, 세정제 등 총 38개 제품을 다룹니다. 최고 사용 온도는 DOWSIL™ Q3-1566(-50~275°C, 단속 350°C)이며, 핫멜트 HM 시리즈는 즉각적인 그린 스트렝스를 제공합니다.'
                : 'DOWSIL™ silicone sealants are durable RTV sealants that cure at room temperature to a tough, rubbery solid; when properly cured most can be used from -56 to 177°C (204°C intermittent) and some above 260°C (315°C intermittent). This guide covers 38 products: acetoxy, alkoxy, oxime, two-part and hot-melt sealants, platinum-cure silicone foams, primers and cleaners. The highest service temperature is DOWSIL™ Q3-1566 (-50 to 275°C, 350°C intermittent); the HM hot-melt series provides instant green strength.'}
            </p>
          </div>

          <h2 className="fw-bold mb-4" style={{ color: '#16142F' }}>{ko ? '선정 가이드 목차' : 'Contents'}</h2>
          <div className="row g-4 mb-5">
            {IPAGES.map((p) => (
              <div key={p.slug} className="col-md-6 col-lg-4">
                <Link href={`/${lang}/technical/industrial/${p.slug}`} className="card h-100 border-0 shadow-sm rounded-4 text-decoration-none product-card-hover">
                  <div className="card-body p-4">
                    <div style={{ color: '#ea580c', fontSize: '.78rem', fontWeight: 700 }}>{String(p.no).padStart(2, '0')} · {ko ? `원문 ${p.pdfPages}쪽` : `pp. ${p.pdfPages}`}</div>
                    <h3 className="h6 fw-bold my-2" style={{ color: '#16142F', lineHeight: 1.45 }}>{p.title[l]}</h3>
                    <p className="mb-0" style={{ color: '#555370', fontSize: '.86rem', lineHeight: 1.65 }}>{p.summary[l]}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <h2 className="fw-bold mb-3" style={{ color: '#16142F' }}>{ko ? '제품 색인 (38종)' : 'Product index (38)'}</h2>
          <p style={{ color: '#555370' }}>{ko ? '제품명을 누르면 해당 제품의 상세 사양으로 이동합니다.' : 'Select a product name to jump to its specifications.'}</p>
          <div className="row g-4 mb-5">
            {ORDER.map((g) => (
              <div key={g} className="col-md-6 col-lg-4">
                <div className="p-3 rounded-4 h-100" style={{ background: '#f6f7fb' }}>
                  <h3 className="h6 fw-bold mb-2" style={{ color: '#16142F' }}>{GROUP_LABEL[g][l]}</h3>
                  <ul className="list-unstyled mb-0" style={{ fontSize: '.88rem' }}>
                    {PRODUCTS.filter((pr) => pr.group === g).map((pr) => (
                      <li key={pr.id} className="mb-1"><Link href={`/${lang}/technical/industrial/${GROUP_PAGE[g]}#${pr.id}`} style={{ color: '#1558D6' }}>{pr.name}</Link></li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <h2 className="fw-bold mb-3" style={{ color: '#16142F' }}>{ko ? '자주 묻는 질문' : 'Frequently asked questions'}</h2>
          <div className="mb-5">
            {faqs.map((f, i) => (
              <details key={i} className="tech-faq" open={i === 0}>
                <summary>{f.q[l]}</summary>
                <p>{f.a[l]}</p>
              </details>
            ))}
          </div>

          <div className="p-4 rounded-4" style={{ background: '#f1f5fb', color: '#16142F' }}>
            <div className="fw-bold mb-2">{ko ? '출처 및 인용' : 'Source and citation'}</div>
            <p className="mb-2" style={{ fontSize: '.9rem', lineHeight: 1.7 }}>{ko ? '이 가이드의 제품 데이터와 설명은 다음 Dow 문서를 바탕으로 정리했으며, 수치는 대표 물성으로 시방 값이 아닙니다. 설계·구매 전에는 개별 제품 데이터 시트와 원문 PDF를 확인하십시오.' : 'Product data and descriptions in this guide are reproduced from the following Dow document. Values are typical properties, not specifications. Verify with the individual product data sheets and the original PDF before design or purchase.'}</p>
            <p className="mb-0" style={{ fontSize: '.88rem', color: '#555370' }}>{SOURCE}</p>
          </div>
        </div>
      </section>
    </Tx>
  )
}
