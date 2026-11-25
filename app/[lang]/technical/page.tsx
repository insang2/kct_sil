import type { Metadata } from 'next'
import Link from 'next/link'
import { PAGES, MANUAL_PDF, MANUAL_TITLE } from '@/lib/tech-manual'
import { techCss } from '@/components/tech/TechBlocks'
import { IPAGES } from '@/lib/industrial/pages'
import { SERIES } from '@/lib/series/config'

type P = { lang: string }
const BASE = 'https://kconstrade.com'
const norm = (lang: string): 'ko' | 'en' => (lang === 'ko' ? 'ko' : 'en')

export async function generateMetadata({ params }: { params: Promise<P> }): Promise<Metadata> {
  const { lang } = await params
  const ko = norm(lang) === 'ko'
  const title = ko ? '기술정보 | DOWSIL™ 내화 실란트 기술 매뉴얼 | 한국건설트레이딩 (KCT)' : 'Technical Information | DOWSIL™ Fire-rated Sealant Technical Manual | KCT'
  const description = ko
    ? 'Dow 내화(Fire-rated) 기술 매뉴얼을 한국어·영문으로 정리: 화재 반응성, 내화 성능, 선형 줄눈·관통부 시험 결과, 연기 차단, 커튼월, 시공 지침, 폼 시공.'
    : 'Dow fire-rated technical manual in English and Korean: reaction to fire, fire resistance, linear joint and penetration seal test results, smoke barriers, curtain walls, application guidelines and foam installation.'
  return {
    title,
    description,
    alternates: { canonical: `${BASE}/${lang === 'ja' ? 'en' : lang}/technical`, languages: { ko: `${BASE}/ko/technical`, en: `${BASE}/en/technical`, 'x-default': `${BASE}/ko/technical` } },
    openGraph: { title, description, url: `${BASE}/${lang}/technical`, siteName: '한국건설트레이딩 (KCT)', images: [{ url: `${BASE}/assets/tech/cover.jpg` }], type: 'website' },
  }
}

export default async function TechHub({ params }: { params: Promise<P> }) {
  const { lang } = await params
  const l = norm(lang)
  const ko = l === 'ko'

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: ko ? '기술정보' : 'Technical Information',
    inLanguage: l,
    hasPart: PAGES.map((p) => ({ '@type': 'TechArticle', headline: p.title[l], url: `${BASE}/${lang}/technical/${p.slug}` })),
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: techCss }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="position-relative overflow-hidden" style={{ background: '#0f2038', color: '#fff', paddingTop: 120, paddingBottom: 56 }}>
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <span className="badge rounded-pill px-3 py-2 mb-3" style={{ background: 'rgba(255,255,255,.15)', letterSpacing: '.08em' }}>TECHNICAL INFORMATION</span>
              <h1 className="fw-bold mb-3" style={{ color: '#fff', fontSize: 'clamp(1.9rem,4vw,3rem)' }}>
                {ko ? 'DOWSIL™ 내화 실란트 기술정보' : 'DOWSIL™ Fire-rated Sealant Technical Information'}
              </h1>
              <p style={{ color: '#e2e8f0', lineHeight: 1.8, maxWidth: 620 }}>
                {ko
                  ? 'Dow 「Fire-rated Dow Technologies Technical Manual」 전체를 영문 원문과 한국어 번역으로 수록했습니다. 화재 반응성·내화 성능의 개념부터 벽·바닥 선형 줄눈과 관통부 시험 결과, 연기 차단, 커튼월, 시공 지침까지 16개 페이지로 나누어 살펴볼 수 있습니다.'
                  : 'The complete Dow “Fire-rated Dow Technologies Technical Manual”, reproduced in English with a Korean translation. Sixteen pages cover reaction to fire and fire resistance concepts, linear joint and penetration seal test results in walls and floors, smoke barriers, curtain walls and application guidelines.'}
              </p>
              <div className="d-flex flex-wrap gap-2">
                <Link href={`/${lang}/technical/${PAGES[0].slug}`} className="btn btn-light rounded-pill px-4 fw-bold">{ko ? '처음부터 보기' : 'Start reading'}</Link>
                <a href={MANUAL_PDF} download className="btn btn-outline-light rounded-pill px-4"><i className="bi bi-file-earmark-pdf me-2" />{ko ? '원문 PDF 다운로드 (영문, 2MB)' : 'Download original PDF (2 MB)'}</a>
              </div>
            </div>
            <div className="col-lg-5">
              <img src="/assets/tech/cover.jpg" alt={MANUAL_TITLE.en} className="w-100 rounded-4 shadow" style={{ maxHeight: 320, objectFit: 'cover', objectPosition: 'center 35%' }} />
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-white">
        <div className="container">
          <div className="row g-3 mb-5 text-center">
            {[
              [ko ? '16개' : '16', ko ? '기술 페이지' : 'Technical pages'],
              [ko ? '6종' : '6', ko ? 'DOWSIL™ 내화 제품' : 'DOWSIL™ fire products'],
              ['B,s2,d0', ko ? '최고 화재 반응성 등급 (EN 13501-1)' : 'Best reaction-to-fire class (EN 13501-1)'],
              [ko ? '최대 240분' : 'Up to 240 min', ko ? '시험된 차염성(E)·차열성(I)' : 'Tested integrity (E) / insulation (I)'],
            ].map(([n, label]) => (
              <div key={label} className="col-6 col-lg-3">
                <div className="p-3 rounded-4 h-100" style={{ background: '#f1f5fb' }}>
                  <div className="fw-bold" style={{ color: '#1558D6', fontSize: '1.5rem' }}>{n}</div>
                  <div style={{ color: '#555370', fontSize: '.85rem' }}>{label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-4 mb-5" style={{ background: '#fff7ed', border: '1px solid #fed7aa' }}>
            <div style={{ color: '#9a3412', fontSize: '.8rem', fontWeight: 700, letterSpacing: '.05em' }}>NEW · SELECTION GUIDE</div>
            <h2 className="fw-bold my-1" style={{ color: '#16142F', fontSize: '1.3rem' }}>
              {ko ? '산업·가전·유지보수용 DOWSIL™ 실리콘 실란트·폼 선정 가이드 (38개 제품, 14페이지)' : 'DOWSIL™ Silicone Sealants and Foams for Industrial, Appliance and Maintenance (38 products, 14 pages)'}
            </h2>
            <p style={{ color: '#555370', fontSize: '.92rem' }}>{ko ? '아세톡시·알콕시·옥심·2액형·핫멜트 실란트, 실리콘 폼, 프라이머·세정제의 사양과 접착 등급, 표면 준비·시공 방법.' : 'Acetoxy, alkoxy, oxime, two-part and hot-melt sealants, silicone foams, primers and cleaners: specifications, adhesion ratings, preparation and application.'}</p>
            <div className="d-flex flex-wrap gap-2 mb-3">
              <Link href={`/${lang}/technical/industrial`} className="btn btn-sm btn-warning rounded-pill px-3 fw-bold">{ko ? '선정 가이드 허브' : 'Guide hub'}</Link>
              <Link href={`/${lang}/technical/industrial/product-selector`} className="btn btn-sm btn-outline-dark rounded-pill px-3">{ko ? '제품 전체 비교' : 'Compare all products'}</Link>
              <Link href={`/${lang === 'ko' ? 'en' : 'ko'}/technical/industrial`} className="btn btn-sm btn-outline-secondary rounded-pill px-3">{ko ? 'English' : '한국어'}</Link>
            </div>
            <ul className="row g-2 list-unstyled mb-0">
              {IPAGES.map((p) => (
                <li key={p.slug} className="col-md-6 col-lg-4">
                  <Link href={`/${lang}/technical/industrial/${p.slug}`} className="d-block p-3 rounded-3 text-decoration-none h-100" style={{ background: '#fff', border: '1px solid #fde4c8' }}>
                    <span style={{ color: '#ea580c', fontSize: '.75rem', fontWeight: 700 }}>{String(p.no).padStart(2, '0')}</span>
                    <span className="d-block fw-bold" style={{ color: '#16142F', fontSize: '.9rem', lineHeight: 1.45 }}>{p.title[l]}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {Object.values(SERIES).map((sr) => (
            <div key={sr.key} className="p-4 rounded-4 mb-5" style={{ background: '#eef4ff', border: '1px solid #c7dafc' }}>
              <div style={{ color: '#0b2a55', fontSize: '.8rem', fontWeight: 700, letterSpacing: '.05em' }}>NEW · {sr.badge}</div>
              <h2 className="fw-bold my-1" style={{ color: '#16142F', fontSize: '1.3rem' }}>{sr.hubTitle[l]} ({sr.pages.length}{ko ? '페이지' : ' pages'})</h2>
              <p style={{ color: '#555370', fontSize: '.92rem' }}>{sr.hubDesc[l]}</p>
              <div className="d-flex flex-wrap gap-2 mb-3">
                <Link href={`/${lang}/technical/${sr.key}`} className="btn btn-sm btn-primary rounded-pill px-3 fw-bold">{ko ? '허브 보기' : 'Open hub'}</Link>
                <Link href={`/${lang === 'ko' ? 'en' : 'ko'}/technical/${sr.key}`} className="btn btn-sm btn-outline-secondary rounded-pill px-3">{ko ? 'English' : '한국어'}</Link>
              </div>
              <ul className="row g-2 list-unstyled mb-0">
                {sr.pages.map((p) => (
                  <li key={p.slug} className="col-md-6 col-lg-4">
                    <Link href={`/${lang}/technical/${sr.key}/${p.slug}`} className="d-block p-3 rounded-3 text-decoration-none h-100" style={{ background: '#fff', border: '1px solid #dbe6fb' }}>
                      <span style={{ color: '#1558D6', fontSize: '.75rem', fontWeight: 700 }}>{String(p.no).padStart(2, '0')}</span>
                      <span className="d-block fw-bold" style={{ color: '#16142F', fontSize: '.9rem', lineHeight: 1.45 }}>{p.title[l]}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <h2 className="fw-bold mb-4" style={{ color: '#16142F' }}>{ko ? '내화 기술정보 목차 (Fire-rated)' : 'Fire-rated technical manual'}</h2>
          <div className="row g-4">
            {PAGES.map((p) => (
              <div key={p.slug} className="col-md-6 col-lg-4">
                <Link href={`/${lang}/technical/${p.slug}`} className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden text-decoration-none product-card-hover">
                  <div style={{ height: 170, background: '#eef1f7' }}>
                    <img src={p.image} alt={p.title[l]} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }} />
                  </div>
                  <div className="card-body p-4">
                    <div style={{ color: '#1558D6', fontSize: '.78rem', fontWeight: 700 }}>
                      {String(p.no).padStart(2, '0')} · {ko ? `원문 ${p.pdfPages}쪽` : `pp. ${p.pdfPages}`}
                    </div>
                    <h3 className="h6 fw-bold my-2" style={{ color: '#16142F' }}>{p.title[l]}</h3>
                    <p className="mb-0" style={{ color: '#555370', fontSize: '.86rem', lineHeight: 1.6 }}>{p.summary[l]}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-5 p-4 rounded-4" style={{ background: '#f1f5fb', color: '#16142F', fontSize: '.9rem', lineHeight: 1.7 }}>
            <strong>{ko ? '안내' : 'Notice'}</strong>
            <p className="mb-0 mt-1" style={{ color: '#555370' }}>
              {ko
                ? '이 콘텐츠는 Dow 기술 매뉴얼(Form No. 62-2233-01-0325 S2D, © 2025 The Dow Chemical Company)을 바탕으로 한 번역·정리본이며, 시험 결과 표의 값은 대표 물성으로 시방 값이 아닙니다. 설계·시공에는 반드시 영문 원본 PDF와 현지 Dow 기술 전문가의 확인을 거치시기 바랍니다.'
                : 'Content is based on the Dow technical manual (Form No. 62-2233-01-0325 S2D, © 2025 The Dow Chemical Company) with a Korean translation. Test result values are typical properties, not specifications. Always verify against the original PDF and your local Dow Technical Specialist before design or installation.'}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
