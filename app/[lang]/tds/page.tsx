import type { Metadata } from 'next'
import Link from 'next/link'
import Tx from '@/components/tech/Tx'
import { techCss } from '@/components/tech/TechBlocks'
import { CATALOG, CATEGORIES, tdsUrl, type CatalogProduct } from '@/lib/products-catalog'
import { localizeCatalog, CATEGORY_EN } from '@/lib/products-catalog-en'

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
    ? 'DOWSIL 전 제품 30종 TDS 다운로드 센터 | KCT'
    : 'DOWSIL™ TDS Download Center (30 Products) | KCT'

  const description = ko
    ? 'DOWSIL(다우실) 건축·구조·GMP·토목·복층유리·특수·프라이머 30종의 TDS PDF 다운로드, 제품 유형, 핵심 물성 3항목과 KCT 기술 지원 안내.'
    : 'Download Dow DOWSIL™ Technical Data Sheets (TDS) for all 30 sealants and primers, with product types, three key properties and KCT support.'

  const canonicalLang = lang === 'ja' ? 'en' : lang

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${canonicalLang}/tds`,
      languages: {
        ko: `${BASE}/ko/tds`,
        en: `${BASE}/en/tds`,
        'x-default': `${BASE}/ko/tds`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE}/${lang}/tds`,
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

// 제품 유형을 제외한 핵심 물성 3개를 카탈로그 specs 에서 우선순위대로 추출
const PRIORITY_KO = [
  '움직임 허용치',
  '내화 성능',
  '혼합 비율',
  '경도 (Shore A)',
  'Shore A 경도',
  '경도 (JIS A)',
  '경도 (Shore D)',
  '경도',
  '최대 인장강도',
  '인장강도',
  '최대 신율',
  '신율',
  '조인트 신율',
  '사용 온도',
  '적용 온도',
  '시공 온도',
  '표면경화시간',
  'Skin-over / Tack-free',
  'Skin-over time',
  'Tack-free time',
  'Tack free time',
  '가사시간',
  'Unit handling time',
  '경화시간',
  '건조 시간',
  '저분자 실록산 (D4–D10)',
  '수증기 투과',
  '고형분',
  '도포 두께 (건조 막)',
  'MFFT',
  'VOC',
  'VOC 함량',
  'VOC (혼합)',
  '적용 규격',
  '규격',
  '포장',
  '유효기간',
  '유통 기간',
  '도포량',
  '인화점',
  '도포 방법',
  '제공 문서',
]

const PRIORITY_EN = [
  'Movement capability',
  'Fire resistance',
  'Mix ratio',
  'Hardness (Shore A)',
  'Hardness (JIS A)',
  'Hardness (Shore D)',
  'Hardness',
  'Ultimate tensile strength',
  'Tensile strength',
  'Ultimate elongation',
  'Elongation',
  'Joint elongation',
  'Service temperature',
  'Application temperature',
  'Skin-over / tack-free time',
  'Skin-over / Tack-free',
  'Skin-over time',
  'Tack-free time',
  'Tack free time',
  'Working time',
  'Unit handling time',
  'Cure time',
  'Drying time',
  'Low-MW siloxane (D4–D10)',
  'Water vapor permeability',
  'Solids content',
  'Dry film thickness',
  'MFFT',
  'VOC',
  'VOC content',
  'VOC (mixed)',
  'Standards',
  'Packaging',
  'Shelf life',
  'Coverage',
  'Flash point',
  'Application method',
  'Document supplied',
]

function pickTop3Props(c: CatalogProduct, ko: boolean): { key: string; value: string }[] {
  const loc = localizeCatalog(c, ko ? 'ko' : 'en')
  const sp = loc.specs
  const skipKey = ko ? '제품 유형' : 'Product type'
  const order = ko ? PRIORITY_KO : PRIORITY_EN
  const out: { key: string; value: string }[] = []

  for (const k of order) {
    if (out.length >= 3) break
    if (k === skipKey) continue
    if (sp[k]) out.push({ key: k, value: sp[k] })
  }
  if (out.length < 3) {
    for (const [k, v] of Object.entries(sp)) {
      if (out.length >= 3) break
      if (k === skipKey || out.some((x) => x.key === k)) continue
      out.push({ key: k, value: v })
    }
  }
  return out
}

const FAQS = {
  ko: [
    {
      q: '이 페이지에서 제공하는 DOWSIL™ TDS PDF는 어떤 제품군을 포함하나요?',
      a: '한국건설트레이딩(KCT) 카탈로그에 수록된 건축 외장, GMP·위생, 토목용, 복층유리, 특수용, 프라이머 등 전 제품 30종의 문서를 한곳에서 내려받을 수 있습니다. DOWSIL™ 1200 OS는 Dow LEED/VOC 확인서(2025-01-01) PDF가 연결되어 있습니다.',
    },
    {
      q: '표에 나온 핵심 물성 수치를 시방서 작성에 그대로 사용해도 되나요?',
      a: '아니요. 표의 물성은 각 제품 Dow TDS에 수록된 대표 특성(Typical Properties)을 요약한 것으로 시방용 규격값이 아닙니다. 설계·시방서 작성 전에는 반드시 원문 TDS PDF를 확인하고 프로젝트 조건에 맞게 검토해야 합니다.',
    },
    {
      q: 'MSDS(SDS·물질안전보건자료)나 최신 개정 TDS·시험성적서도 받을 수 있나요?',
      a: '네. SDS(MSDS), 최신 영문·국문 TDS, 자재 승인용 참고 자료가 필요하시면 한국건설트레이딩(sales@kconstrade.com, 010-8939-0284)으로 제품명과 현장 용도를 알려 주시면 빠르게 안내해 드립니다.',
    },
    {
      q: '구 Dow Corning(다우코닝) 제품 번호로 적힌 시방서의 TDS는 어떻게 찾나요?',
      a: '기존 Dow Corning® 789·791·795·995·993·983·888·890-SL·ALLGUARD 등은 현재 DOWSIL™ 브랜드로 동일 번호 체계로 공급됩니다. 아래 표에서 동일 모델 번호의 제품명 또는 TDS 링크를 선택하시면 됩니다.',
    },
  ],
  en: [
    {
      q: 'Which DOWSIL™ product lines are covered in this TDS Download Center?',
      a: 'All 30 products in the Korea Construction Trading (KCT) catalog across Building Envelope, GMP/Hygienic, Civil Engineering, Insulating Glass, Specialty and Primers are listed with direct PDF downloads (DOWSIL™ 1200 OS links to Dow’s LEED/VOC letter dated 2025-01-01).',
    },
    {
      q: 'Can the three key properties in the table be used directly as project specifications?',
      a: 'No. Values summarized from Dow TDS documents are typical properties, not specifications. Always check the full PDF data sheet and verify suitability under your project conditions.',
    },
    {
      q: 'How can I request SDS (MSDS) or the latest revised technical documents?',
      a: 'Email sales@kconstrade.com or call +82 10-8939-0284 with the product code and application. Korea Construction Trading (KCT) supports latest TDS/SDS delivery and product selection.',
    },
    {
      q: 'How do I find a TDS listed under a legacy Dow Corning® product number?',
      a: 'Legacy Dow Corning® construction products such as 789, 791, 795, 995, 993, 983, 888, 890-SL and ALLGUARD are now marketed under the DOWSIL™ brand using the same product codes in the tables below.',
    },
  ],
}

export default async function TdsCenterPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const l = norm(lang)
  const ko = l === 'ko'
  const cats = CATEGORIES.map((c) => (ko ? c : { ...c, ...CATEGORY_EN[c.key] }))
  const faqs = FAQS[l]
  const pageUrl = `${BASE}/${lang}/tds`

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: ko ? '홈' : 'Home', item: `${BASE}/${lang}` },
          { '@type': 'ListItem', position: 2, name: ko ? 'TDS 다운로드 센터' : 'TDS Download Center', item: pageUrl },
        ],
      },
      {
        '@type': 'CollectionPage',
        '@id': pageUrl,
        name: ko ? 'DOWSIL™ 전 제품 30종 TDS 다운로드 센터' : 'DOWSIL™ TDS Download Center (30 Products)',
        description: ko
          ? 'Dow DOWSIL™ 30종 제품의 기술 데이터시트(TDS) PDF 다운로드, 제품 유형 및 핵심 물성 3항목 요약.'
          : 'Download Dow DOWSIL™ Technical Data Sheets (TDS) for all 30 catalog products with product types and three key properties.',
        inLanguage: l,
        url: pageUrl,
        publisher: { '@id': `${BASE}/#organization` },
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }

  return (
    <Tx>
      <style dangerouslySetInnerHTML={{ __html: techCss }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Hero */}
      <section className="tx-hero tx-photo tx-big">
        <div className="container">
          <nav aria-label={ko ? '현재 위치' : 'Breadcrumb'} className="mb-3">
            <Link href={`/${lang}`}>{ko ? '홈' : 'Home'}</Link>
            <span> / </span>
            <Link href={`/${lang}/products`}>{ko ? '제품정보' : 'Products'}</Link>
            <span> / </span>
            <span style={{ color: '#EDEDED' }}>{ko ? 'TDS 다운로드 센터' : 'TDS Center'}</span>
          </nav>
          <span className="badge">TDS DOWNLOAD CENTER</span>
          <h1 className="fw-bold mt-3">
            {ko ? (
              <>DOWSIL™ TDS <span className="tx-light">다운로드 센터</span></>
            ) : (
              <>DOWSIL™ TDS <span className="tx-light">Download Center</span></>
            )}
          </h1>
          <p>
            {ko
              ? `Dow DOWSIL™ 전 제품 ${CATALOG.length}종의 기술 데이터시트(TDS) PDF, 제품 유형, 핵심 물성 3항목을 카테고리별로 한눈에 확인하고 내려받으세요. 최신 SDS·기술 자료 문의는 한국건설트레이딩(KCT)이 지원합니다.`
              : `Download Dow Technical Data Sheets (TDS) for all ${CATALOG.length} DOWSIL™ catalog products, organized by category with product type and three key properties. Contact Korea Construction Trading (KCT) for SDS and technical support.`}
          </p>
          <div className="d-flex flex-wrap gap-2 mt-4">
            <a href="mailto:sales@kconstrade.com" className="btn btn-light">
              {ko ? 'SDS · 최신 자료 문의' : 'Request SDS / Latest Docs'} →
            </a>
            <Link href={`/${lang}/products`} className="btn btn-outline-light">
              {ko ? '제품 목록 보기' : 'Browse Products'}
            </Link>
            <Link href={`/${lang}/technical/selection/color-and-packaging-guide`} className="btn btn-outline-light">
              {ko ? '색상·포장 표' : 'Colors & Packaging'}
            </Link>
          </div>
        </div>
      </section>

      {/* Sticky Category Index */}
      <nav className="tx-index" aria-label={ko ? '카테고리 바로가기' : 'Jump to category'}>
        <div className="container">
          {cats.map((c, i) => (
            <a key={c.key} href={`#tds-${c.key}`}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              {c.label}
              <span>{CATALOG.filter((p) => p.category === c.key).length}</span>
            </a>
          ))}
          <a href="#tds-faq">
            <span>FAQ</span>
            {ko ? '자주 묻는 질문' : 'FAQ'}
          </a>
        </div>
      </nav>

      <div className="container py-5">
        {/* Direct Answer / Key Facts */}
        <section
          className="p-4 rounded-4 mb-5"
          style={{ background: '#eef4ff', border: '1px solid #c7dafc' }}
          aria-label={ko ? '핵심 안내' : 'Key facts'}
        >
          <div className="fw-bold mb-1" style={{ color: '#0b2a55', fontSize: '.85rem', letterSpacing: '.04em' }}>
            {ko ? '핵심 안내' : 'KEY FACTS'}
          </div>
          <p className="mb-0" style={{ color: '#16142F', lineHeight: 1.8 }}>
            {ko
              ? `이 페이지에서 건축 외장(11종)·GMP·위생(2종)·토목용(3종)·복층유리(5종)·특수용(6종)·프라이머(3종) 총 ${CATALOG.length}종의 Dow TDS PDF(1200 OS는 LEED 확인서)를 바로 내려받을 수 있습니다. 표의 물성은 각 TDS 요약 기준 대표 특성이며 시방용이 아니므로 설계·시공 전 원문 PDF와 한국건설트레이딩(KCT)의 확인을 권장합니다.`
              : `Direct PDF downloads are provided for all ${CATALOG.length} DOWSIL™ products across Building Envelope (11), GMP/Hygienic (2), Civil (3), Insulating Glass (5), Specialty (6) and Primers (3) (1200 OS provides Dow’s LEED confirmation letter). Values shown are typical properties summarized from Dow TDS, not specifications; verify against the original PDF and consult KCT.`}
          </p>
        </section>

        {/* Category Tables */}
        {cats.map((cat, idx) => {
          const items = CATALOG.filter((p) => p.category === cat.key)
          return (
            <section key={cat.key} id={`tds-${cat.key}`} className="tx-cat" aria-labelledby={`h-tds-${cat.key}`}>
              <div className="d-flex flex-wrap justify-content-between align-items-baseline gap-2 mb-3">
                <div>
                  <div className="tx-cat-no">
                    {String(idx + 1).padStart(2, '0')} · {items.length}
                    {ko ? '종' : ' products'}
                  </div>
                  <h2 id={`h-tds-${cat.key}`} className="h3 fw-bold mb-1">
                    {cat.label}
                  </h2>
                  <p className="text-body-secondary mb-0" style={{ fontSize: '0.94rem' }}>
                    {cat.desc}
                  </p>
                </div>
                <Link
                  href={`/${lang}/products#cat-${cat.key}`}
                  className="small fw-semibold text-decoration-none"
                  style={{ color: '#1558D6' }}
                >
                  {ko ? `${cat.label} 제품 카드 보기 →` : `View ${cat.label} cards →`}
                </Link>
              </div>

              <div
                className="tech-table-wrap"
                tabIndex={0}
                role="region"
                aria-label={ko ? `${cat.label} TDS 표 (가로 스크롤 가능)` : `${cat.label} TDS table (scrollable)`}
              >
                <table className="table table-sm tech-table mb-0">
                  <caption className="visually-hidden">
                    {ko ? `${cat.label} DOWSIL 제품 TDS 및 핵심 물성` : `${cat.label} DOWSIL products TDS and key properties`}
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col" style={{ minWidth: 180 }}>{ko ? '제품명' : 'Product'}</th>
                      <th scope="col" style={{ minWidth: 170 }}>{ko ? '유형' : 'Type'}</th>
                      <th scope="col" style={{ minWidth: 320 }}>{ko ? '핵심 물성 3항목 (TDS 요약)' : '3 Key Properties (TDS Summary)'}</th>
                      <th scope="col" style={{ minWidth: 130 }}>{ko ? '문서 다운로드' : 'Download'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((raw) => {
                      const loc = localizeCatalog(raw, l)
                      const typeVal = ko ? raw.specs['제품 유형'] : loc.specs['Product type']
                      const props3 = pickTop3Props(raw, ko)
                      const label = raw.docLabel ? (ko ? raw.docLabel : 'LEED letter') : 'TDS'
                      return (
                        <tr key={raw.slug}>
                          <td>
                            <Link href={`/${lang}/products/${raw.slug}`} className="fw-bold">
                              {raw.name}
                            </Link>
                            <div className="small text-body-secondary" style={{ lineHeight: 1.45 }}>
                              {loc.summary}
                            </div>
                          </td>
                          <td>{typeVal || (ko ? '문의' : 'Inquire')}</td>
                          <td>
                            <ul className="list-unstyled mb-0" style={{ fontSize: '0.84rem', lineHeight: 1.55 }}>
                              {props3.map((pr) => (
                                <li key={pr.key}>
                                  <strong className="text-dark">{pr.key}:</strong> {pr.value}
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td>
                            <a href={tdsUrl(raw.slug)} download className="fw-semibold text-nowrap">
                              <i className="bi bi-file-earmark-pdf me-1" />
                              {label} (PDF)
                            </a>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )
        })}

        {/* FAQ */}
        <section id="tds-faq" className="tx-cat" aria-labelledby="h-tds-faq">
          <h2 id="h-tds-faq" className="h4 fw-bold mb-3">
            {ko ? '자주 묻는 질문' : 'Frequently asked questions'}
          </h2>
          {faqs.map((f, i) => (
            <details key={i} className="tx-faq" open={i === 0}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </section>

        {/* Source & KCT Support */}
        <div className="tx-notes">
          <div>
            <h3>{ko ? '출처 및 수치 안내' : 'Sources & typical values'}</h3>
            <p>
              {ko
                ? '수록된 PDF와 요약 물성은 각 제품의 Dow 기술 데이터시트(TDS) 및 Dow 공식 확인서(1200 OS LEED 확인서)에 근거합니다. 수치는 대표 특성이며 시방용 규격값이 아닙니다.'
                : 'Linked PDFs and summarized values are based on each product’s Dow Technical Data Sheet (TDS) and Dow’s LEED confirmation letter (1200 OS). Typical properties are not for specifications.'}
            </p>
          </div>
          <div>
            <h3>{ko ? '관련 자료 바로가기' : 'Related resources'}</h3>
            <p>
              <Link href={`/${lang}/technical/selection/color-and-packaging-guide`}>
                {ko ? '색상·포장·유효기간 표' : 'Colors & packaging guide'}
              </Link>
              {' · '}
              <Link href={`/${lang}/technical`}>{ko ? '기술정보 라이브러리' : 'Technical library'}</Link>
              {' · '}
              <Link href={`/${lang}/sitemap`}>{ko ? '전체 사이트맵' : 'HTML sitemap'}</Link>
            </p>
          </div>
          <div>
            <h3>{ko ? '한국건설트레이딩(KCT) 기술 지원' : 'KCT technical support'}</h3>
            <p>
              {ko
                ? 'SDS(MSDS), 최신 TDS, 제품 선정 및 B2B 공급·수출 견적을 최선을 다해 지원합니다. '
                : 'We do our best to support SDS/MSDS, latest TDS, product selection and B2B/export quotations. '}
              <a href="mailto:sales@kconstrade.com">sales@kconstrade.com</a> ·{' '}
              <a href="tel:+821089390284">{ko ? '010-8939-0284' : '+82 10-8939-0284'}</a>
            </p>
          </div>
        </div>
      </div>
    </Tx>
  )
}
