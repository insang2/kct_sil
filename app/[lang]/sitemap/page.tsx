import type { Metadata } from 'next'
import Link from 'next/link'
import Tx from '@/components/tech/Tx'
import { CATALOG, CATEGORIES } from '@/lib/products-catalog'
import { localizeCatalog, CATEGORY_EN } from '@/lib/products-catalog-en'

const PUBLIC_LEED_SLUGS = new Set(['dowsil-1200-os'])
import { PAGES as FIRE_PAGES } from '@/lib/tech-manual'
import { IPAGES } from '@/lib/industrial/pages'
import { SERIES } from '@/lib/series/config'
import { HUBS } from '@/lib/series/hubs'

const BASE = 'https://kconstrade.com'
const SITE_NAME = '한국건설트레이딩 (KCT)'
const norm = (lang: string): 'ko' | 'en' => (lang === 'ko' ? 'ko' : 'en')

// 사전 렌더(SSG)
export function generateStaticParams() {
  return ['ko', 'en', 'ja'].map((lang) => ({ lang }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const ko = norm(lang) === 'ko'

  const title = ko
    ? '전체 페이지 사이트맵 · 제품·기술정보 | KCT'
    : 'HTML Sitemap – Products & Technical Library | KCT'

  const description = ko
    ? '한국건설트레이딩(KCT) 웹사이트 전체 HTML 사이트맵입니다. DOWSIL 제품 30종, TDS 다운로드 센터, 6개 기술정보 허브와 모든 문서를 한눈에 탐색하세요.'
    : 'Complete HTML sitemap for Korea Construction Trading (KCT): browse all 30 DOWSIL™ products, the TDS download center, 6 technical hubs and key pages.'

  const canonicalLang = lang === 'ja' ? 'en' : lang

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${canonicalLang}/sitemap`,
      languages: {
        ko: `${BASE}/ko/sitemap`,
        en: `${BASE}/en/sitemap`,
        'x-default': `${BASE}/ko/sitemap`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE}/${lang}/sitemap`,
      siteName: SITE_NAME,
      images: [
        {
          url: `${BASE}/assets/img/og-image.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${BASE}/assets/img/og-image.png`],
    },
  }
}

export default async function HtmlSitemapPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const l = norm(lang)
  const ko = l === 'ko'
  const pageUrl = `${BASE}/${lang}/sitemap`

  const mainPages = [
    { href: `/${lang}`, title: ko ? '홈' : 'Home', desc: ko ? '한국건설트레이딩(KCT) 메인 및 B2B 문의' : 'Korea Construction Trading (KCT) home & B2B inquiry' },
    { href: `/${lang}/about`, title: ko ? '회사소개' : 'About KCT', desc: ko ? '회사 개요, 사업자 정보 및 연락처' : 'Company profile, location and contacts' },
    { href: `/${lang}/products`, title: ko ? `제품정보 (DOWSIL™ ${CATALOG.length}종)` : `Products (${CATALOG.length} DOWSIL™ items)`, desc: ko ? '6개 제품군별 실란트·코팅·프라이머 카탈로그' : 'Full catalog across 6 product lines' },
    { href: `/${lang}/tds`, title: ko ? 'TDS 자료실' : 'TDS Center', desc: ko ? '전 제품 30종 핵심 물성 3항목 요약 및 TDS 다운로드(승인 회원)·전송 요청' : '3 key properties and TDS access (member download / request) for all 30 products' },
    { href: `/${lang}/technical`, title: ko ? '기술정보 허브' : 'Technical Library', desc: ko ? 'Dow 매뉴얼·선정 가이드·교육 자료 6개 허브' : '6 hubs of Dow technical manuals and selection guides' },
    { href: `/${lang}/export`, title: ko ? '수출 문의' : 'Export Inquiry', desc: ko ? '해외 바이어용 FOB·CIF 조건 및 수출 서류 안내' : 'FOB/CIF export terms and international buyer inquiries' },
    { href: `/${lang}/quote`, title: ko ? '견적 요청' : 'Request a Quote', desc: ko ? '국내 B2B·현장 납품 맞춤 견적 신청' : 'B2B pricing and project supply quotations' },
    { href: `/${lang}/sitemap`, title: ko ? 'HTML 사이트맵' : 'HTML Sitemap', desc: ko ? '사이트 전체 페이지 목차 (현재 페이지)' : 'Complete page directory (this page)' },
  ]

  const cats = CATEGORIES.map((c) => (ko ? c : { ...c, ...CATEGORY_EN[c.key] }))

  const techHubs: {
    key: string
    hubHref: string
    title: string
    desc: string
    pages: { href: string; no: number; title: string }[]
  }[] = [
    {
      key: 'fire',
      hubHref: `/${lang}/technical`,
      title: HUBS.find((h) => h.key === 'fire')?.title[l] ?? (ko ? '내화 실란트 기술 매뉴얼' : 'Fire-rated Sealant Technical Manual'),
      desc: HUBS.find((h) => h.key === 'fire')?.desc[l] ?? '',
      pages: FIRE_PAGES.map((p) => ({ href: `/${lang}/technical/${p.slug}`, no: p.no, title: p.title[l] })),
    },
    {
      key: 'industrial',
      hubHref: `/${lang}/technical/industrial`,
      title: HUBS.find((h) => h.key === 'industrial')?.title[l] ?? (ko ? '산업·가전·유지보수용 선정 가이드' : 'Industrial, Appliance & Maintenance Guide'),
      desc: HUBS.find((h) => h.key === 'industrial')?.desc[l] ?? '',
      pages: IPAGES.map((p) => ({ href: `/${lang}/technical/industrial/${p.slug}`, no: p.no, title: p.title[l] })),
    },
    ...(['basics', 'psa', 'selection', 'tapes'] as const).map((k) => {
      const hub = HUBS.find((h) => h.key === k)
      const sr = SERIES[k]
      return {
        key: k,
        hubHref: `/${lang}/technical/${k}`,
        title: hub?.title[l] ?? sr.short[l],
        desc: hub?.desc[l] ?? sr.hubDesc[l],
        pages: sr.pages.map((p) => ({ href: `/${lang}/technical/${k}/${p.slug}`, no: p.no, title: p.title[l] })),
      }
    }),
  ]

  const totalTechPages = techHubs.reduce((sum, h) => sum + h.pages.length, 0)

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: ko ? '홈' : 'Home', item: `${BASE}/${lang}` },
          { '@type': 'ListItem', position: 2, name: ko ? '사이트맵' : 'Sitemap', item: pageUrl },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': pageUrl,
        name: ko ? '한국건설트레이딩(KCT) HTML 사이트맵' : 'Korea Construction Trading (KCT) HTML Sitemap',
        description: ko
          ? `주요 페이지, DOWSIL 제품 ${CATALOG.length}종, 기술정보 ${techHubs.length}개 허브(${totalTechPages}쪽) 전체 링크 목록.`
          : `Complete directory of main pages, ${CATALOG.length} DOWSIL™ products and ${techHubs.length} technical hubs (${totalTechPages} pages).`,
        inLanguage: l,
        url: pageUrl,
        publisher: { '@id': `${BASE}/#organization` },
      },
    ],
  }

  return (
    <Tx>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Hero */}
      <section className="tx-hero tx-photo">
        <div className="container">
          <nav aria-label={ko ? '현재 위치' : 'Breadcrumb'} className="mb-3">
            <Link href={`/${lang}`}>{ko ? '홈' : 'Home'}</Link>
            <span> / </span>
            <span style={{ color: '#EDEDED' }}>{ko ? '사이트맵' : 'Sitemap'}</span>
          </nav>
          <span className="badge">HTML SITEMAP</span>
          <h1 className="fw-bold mt-3">
            {ko ? (
              <>전체 페이지 <span className="tx-light">사이트맵</span></>
            ) : (
              <>HTML <span className="tx-light">Sitemap</span></>
            )}
          </h1>
          <p>
            {ko
              ? `한국건설트레이딩(KCT)의 주요 페이지 ${mainPages.length}개, DOWSIL™ 제품 ${CATALOG.length}종, 기술정보 ${techHubs.length}개 허브(${totalTechPages}페이지)를 한눈에 탐색할 수 있습니다.`
              : `Browse ${mainPages.length} main pages, all ${CATALOG.length} DOWSIL™ products and ${techHubs.length} technical library hubs (${totalTechPages} pages) across Korea Construction Trading (KCT).`}
          </p>
        </div>
      </section>

      {/* Section Jump Bar */}
      <nav className="tx-index" aria-label={ko ? '사이트맵 목차' : 'Sitemap sections'}>
        <div className="container">
          <a href="#sm-main"><span>01</span>{ko ? '주요 페이지' : 'Main Pages'}<span>{mainPages.length}</span></a>
          <a href="#sm-products"><span>02</span>{ko ? 'DOWSIL™ 제품' : 'DOWSIL™ Products'}<span>{CATALOG.length}</span></a>
          <a href="#sm-technical"><span>03</span>{ko ? '기술정보 허브' : 'Technical Hubs'}<span>{totalTechPages}</span></a>
        </div>
      </nav>

      <div className="container py-5">
        {/* 1. Main Pages */}
        <section id="sm-main" className="tx-cat" aria-labelledby="h-sm-main">
          <div className="tx-cat-no">01 · {ko ? '주요 페이지' : 'MAIN PAGES'}</div>
          <h2 id="h-sm-main" className="h3 fw-bold mb-4">{ko ? '주요 안내 페이지' : 'Main Pages'}</h2>
          <div className="row g-3">
            {mainPages.map((m) => (
              <div key={m.href} className="col-sm-6 col-lg-3">
                <Link href={m.href} className="d-block p-3 border rounded-4 text-decoration-none h-100 bg-white">
                  <span className="fw-bold d-block mb-1" style={{ color: '#16142F', fontSize: '0.96rem' }}>{m.title}</span>
                  <span className="small text-body-secondary" style={{ lineHeight: 1.5 }}>{m.desc}</span>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Products (30) */}
        <section id="sm-products" className="tx-cat" aria-labelledby="h-sm-products">
          <div className="d-flex flex-wrap justify-content-between align-items-baseline gap-2 mb-4">
            <div>
              <div className="tx-cat-no">02 · {CATALOG.length}{ko ? '종' : ' PRODUCTS'}</div>
              <h2 id="h-sm-products" className="h3 fw-bold mb-0">{ko ? `DOWSIL™ 전 제품 (${CATALOG.length}종)` : `All DOWSIL™ Products (${CATALOG.length})`}</h2>
            </div>
            <Link href={`/${lang}/tds`} className="small fw-semibold text-decoration-none" style={{ color: '#1558D6' }}>
              {ko ? 'TDS 자료실 열기 →' : 'Open TDS Center →'}
            </Link>
          </div>
          <div className="row g-4">
            {cats.map((cat) => {
              const items = CATALOG.filter((p) => p.category === cat.key)
              return (
                <div key={cat.key} className="col-md-6 col-lg-4">
                  <div className="p-4 bg-white border rounded-4 h-100">
                    <div className="d-flex justify-content-between align-items-baseline mb-2 pb-2 border-bottom">
                      <h3 className="h6 fw-bold mb-0">
                        <Link href={`/${lang}/products#cat-${cat.key}`} className="text-decoration-none text-dark">
                          {cat.label}
                        </Link>
                      </h3>
                      <span className="small text-body-secondary">{items.length}{ko ? '종' : ''}</span>
                    </div>
                    <ul className="list-unstyled mb-0" style={{ fontSize: '0.9rem', lineHeight: 1.8 }}>
                      {items.map((p) => {
                        const loc = localizeCatalog(p, l)
                        return (
                          <li key={p.slug} className="d-flex justify-content-between align-items-baseline gap-2 py-1 border-bottom border-light">
                            <Link href={`/${lang}/products/${p.slug}`} className="text-decoration-none fw-medium" style={{ color: '#16142F' }} title={loc.summary}>
                              {p.name}
                            </Link>
                            {PUBLIC_LEED_SLUGS.has(p.slug) ? (
                              <a
                                href={`/tds/${p.slug}.pdf`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="small text-decoration-none text-nowrap"
                                style={{ color: '#1558D6', fontSize: '0.78rem' }}
                              >
                                {ko ? (p.docLabel ?? 'LEED 확인서') : 'LEED'}
                              </a>
                            ) : (
                              <Link
                                href={`/${lang}/tds?product=${p.slug}`}
                                className="small text-decoration-none text-nowrap"
                                style={{ color: '#1558D6', fontSize: '0.78rem' }}
                              >
                                TDS
                              </Link>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* 3. Technical Hubs (6) & Pages */}
        <section id="sm-technical" className="tx-cat" aria-labelledby="h-sm-technical">
          <div className="tx-cat-no">03 · {techHubs.length} {ko ? `개 허브 · ${totalTechPages}페이지` : `HUBS · ${totalTechPages} PAGES`}</div>
          <h2 id="h-sm-technical" className="h3 fw-bold mb-4">{ko ? '기술정보 허브 및 전체 문서' : 'Technical Library Hubs & Articles'}</h2>
          <div className="row g-4">
            {techHubs.map((hub) => (
              <div key={hub.key} className="col-lg-6">
                <div className="p-4 bg-white border rounded-4 h-100">
                  <div className="d-flex justify-content-between align-items-baseline gap-2 mb-1">
                    <h3 className="h5 fw-bold mb-0">
                      <Link href={hub.hubHref} className="text-decoration-none text-dark">
                        {hub.title}
                      </Link>
                    </h3>
                    <span className="small fw-semibold text-nowrap" style={{ color: '#5b49e6' }}>
                      {hub.pages.length}{ko ? '쪽' : ' pp.'}
                    </span>
                  </div>
                  {hub.desc && (
                    <p className="small text-body-secondary mb-3" style={{ lineHeight: 1.55 }}>{hub.desc}</p>
                  )}
                  <ol className="list-unstyled mb-0" style={{ fontSize: '0.88rem', lineHeight: 1.75 }}>
                    {hub.pages.map((p) => (
                      <li key={p.href} className="py-1 border-top border-light">
                        <Link href={p.href} className="text-decoration-none" style={{ color: '#16142F' }}>
                          <span className="me-2 fw-semibold" style={{ color: '#1558D6', fontSize: '0.8rem' }}>
                            {String(p.no).padStart(2, '0')}
                          </span>
                          {p.title}
                        </Link>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Note */}
        <div className="tx-notes">
          <div>
            <h3>{ko ? 'XML 사이트맵 · RSS' : 'XML Sitemap & RSS'}</h3>
            <p>
              <a href="/sitemap.xml">sitemap.xml</a> · <a href="/rss.xml">rss.xml</a>
            </p>
          </div>
          <div>
            <h3>{ko ? '한국건설트레이딩(KCT) 기술 지원' : 'KCT Technical Support'}</h3>
            <p>
              {ko
                ? '제품 선정, TDS·SDS 확인 및 B2B 공급·수출 견적을 지원합니다. '
                : 'Product selection, TDS/SDS confirmation and B2B/export quotations. '}
              <a href="mailto:sales@kconstrade.com">sales@kconstrade.com</a> ·{' '}
              <a href="tel:+821089390284">{ko ? '010-8939-0284' : '+82 10-8939-0284'}</a>
            </p>
          </div>
        </div>
      </div>
    </Tx>
  )
}
