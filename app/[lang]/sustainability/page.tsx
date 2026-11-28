import type { Metadata } from 'next'
import Link from 'next/link'
import Tx from '@/components/tech/Tx'
import { getDictionary } from '@/lib/dictionaries'
import { COMPANY, DOW_SRC, DOW_TARGETS, PRACTICES, SUS_FAQ, type Lang } from '@/lib/company'
import { PHONE_DISPLAY, PHONE_TEL } from '@/lib/contact'

const BASE = 'https://kconstrade.com'
const L: Lang[] = ['ko', 'en', 'ja']

export function generateStaticParams() {
  return L.map((lang) => ({ lang }))
}

const TITLE = {
  ko: '지속가능경영 | 한국건설트레이딩 (KCT)',
  en: 'Sustainability | Korea Construction Trading (KCT)',
  ja: 'サステナビリティ | 韓国建設トレーディング (KCT)',
}
const DESC = {
  ko: 'Dow가 공개한 탄소 감축 목표를 출처와 함께 소개하고, KCT의 정품 유통·유효기간 관리·기술 지원·전자 문서화 실천 원칙과 LEED 자료를 안내합니다.',
  en: 'Dow’s published carbon targets with sources, KCT’s practices — genuine supply, shelf-life care, technical support, paperless documents — and LEED documents.',
  ja: 'Dowが公表する炭素削減目標を出典付きで紹介し、KCTの正規品流通・有効期限管理・技術サポート・書類電子化の実践原則とLEED資料をご案内します。',
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
  const { lang } = await params
  const title = TITLE[lang], description = DESC[lang]
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${lang}/sustainability`,
      languages: { ko: `${BASE}/ko/sustainability`, en: `${BASE}/en/sustainability`, ja: `${BASE}/ja/sustainability`, 'x-default': `${BASE}/ko/sustainability` },
    },
    openGraph: {
      title, description, url: `${BASE}/${lang}/sustainability`, siteName: '한국건설트레이딩 (KCT)', type: 'website',
      images: [{ url: `${BASE}/assets/img/og-image.png`, width: 1200, height: 630, alt: title }],
    },
  }
}

export default async function SustainabilityPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params
  const d = (await getDictionary(lang)) as any
  const T = (ko: string, en: string, ja: string) => (lang === 'en' ? en : lang === 'ja' ? ja : ko)
  const url = `${BASE}/${lang}/sustainability`

  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', '@id': url, url, name: TITLE[lang], description: DESC[lang], inLanguage: lang, isPartOf: { '@id': `${BASE}/#organization` } },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: T('홈', 'Home', 'ホーム'), item: `${BASE}/${lang}` },
          { '@type': 'ListItem', position: 2, name: T('회사소개', 'About Us', '会社紹介'), item: `${BASE}/${lang}/about` },
          { '@type': 'ListItem', position: 3, name: T('지속가능경영', 'Sustainability', 'サステナビリティ'), item: url },
        ],
      },
      { '@type': 'FAQPage', mainEntity: SUS_FAQ.map((f) => ({ '@type': 'Question', name: f.q[lang], acceptedAnswer: { '@type': 'Answer', text: f.a[lang] } })) },
    ],
  }

  const css = `
.su-sec{padding:4.5rem 0 1rem;border-top:1px solid var(--tx-line);scroll-margin-top:130px}
.su-yr{font-size:clamp(2.2rem,4vw,3.4rem);letter-spacing:-.04em;line-height:1.1;font-weight:650;color:var(--tx-accent)}
.su-src{font-size:.9rem;color:var(--tx-mute)}
.su-src a{color:var(--tx-fg);text-decoration:underline;text-underline-offset:3px}
.su-doc{display:flex;flex-wrap:wrap;gap:1rem 2rem;justify-content:space-between;align-items:center;border:1px solid var(--tx-line);border-radius:14px;background:#fff;padding:1.4rem 1.6rem}
.su-doc a.btn{min-height:44px;display:inline-flex;align-items:center}
@media (max-width:767px){.su-sec{padding-top:3rem}}
`
  return (
    <Tx>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      <section className="tx-hero tx-big" style={{ background: 'linear-gradient(180deg,rgba(12,13,15,.72),rgba(12,13,15,.94)), url(/assets/img/backgrounds/hero_construction.png) center/cover' }}>
        <div className="container">
          <nav aria-label="breadcrumb" className="mb-3">
            <Link href={`/${lang}`}>{d.navigation.home}</Link><span> / </span>
            <Link href={`/${lang}/about`}>{T('회사소개', 'About', '会社紹介')}</Link><span> / </span>
            <span style={{ color: '#EDEDED' }}>{T('지속가능경영', 'Sustainability', 'サステナビリティ')}</span>
          </nav>
          <span className="badge">Sustainability</span>
          <h1 className="mt-3">{T('지속가능경영', 'Sustainability', 'サステナビリティ')} <span className="tx-light">{T('실천 원칙', 'in practice', '実践原則')}</span></h1>
          <p>{T('제조사 Dow의 공개 목표와, 유통사로서 KCT가 지키는 약속을 구분해 적었습니다. 확인되지 않은 인증이나 수치는 싣지 않습니다.', 'We separate manufacturer Dow’s published targets from the commitments KCT keeps as a distributor. No unverified certifications or figures are claimed.', 'メーカーDowの公表目標と、流通会社としてKCTが守る約束を分けて記載しています。確認できない認証や数値は掲載しません。')}</p>
          <div className="d-flex flex-wrap gap-2 mt-4">
            <a href={`mailto:${COMPANY.email}`} className="btn btn-light">{T('자료·문의', 'Contact us', 'お問い合わせ')} →</a>
            <a href="#practices" className="btn btn-outline-light">{T('KCT의 실천 원칙', 'KCT practices', 'KCTの実践原則')}</a>
          </div>
        </div>
      </section>

      <nav className="tx-index" aria-label={T('지속가능경영 바로가기', 'Sections', 'メニュー')}>
        <div className="container">
          {[['dow', T('Dow의 목표', 'Dow targets', 'Dowの目標')], ['practices', T('KCT 실천 원칙', 'KCT practices', 'KCTの実践原則')], ['product', T('제품 환경 정보', 'Product data', '製品の環境情報')], ['faq', 'FAQ']].map(([id, label], i) => (
            <a key={id} href={`#${id}`}><span>{String(i + 1).padStart(2, '0')}</span>{label}</a>
          ))}
        </div>
      </nav>

      <div className="container">
        <section id="dow" className="su-sec">
          <span className="tx-eyebrow">Manufacturer</span>
          <h2 className="tx-sec-h">{T('제조사 Dow의 공개 목표', 'Manufacturer Dow’s published targets', 'メーカーDowの公表目標')}</h2>
          <p className="tx-sec-sub">{T('아래는 Dow가 공개한 내용이며 KCT의 목표가 아닙니다.', 'These are Dow’s published statements, not KCT’s own targets.', '以下はDowが公表した内容であり、KCT自身の目標ではありません。')}</p>
          <div className="tx-grid">
            {DOW_TARGETS.map((x, i) => (
              <div key={i}><div className="su-yr">{x.year[lang]}</div><h3>{x.title[lang]}</h3><p>{x.desc[lang]}</p></div>
            ))}
          </div>
          <p className="su-src">
            {T('출처', 'Source', '出典')}: <a href={DOW_SRC} target="_blank" rel="noopener noreferrer">Dow — Sustainability Focus Areas ↗</a> · {T('2026-11-28 확인. 최신 내용은 원문을 확인해 주세요.', 'Checked 2026-11-28. See the original for the latest.', '2026-11-28確認。最新情報は原文をご確認ください。')}
          </p>
        </section>

        <section id="practices" className="su-sec">
          <span className="tx-eyebrow">KCT</span>
          <h2 className="tx-sec-h">{T('KCT의 실천 원칙', 'KCT practices', 'KCTの実践原則')}</h2>
          <p className="tx-sec-sub">{T('인증이나 수치 실적이 아니라, 지금 업무에서 지키는 약속입니다.', 'These are working commitments, not certifications or performance figures.', '認証や数値実績ではなく、日々の業務で守る約束です。')}</p>
          <div className="tx-grid">
            {PRACTICES.map((p, i) => (
              <div key={i}><span className="tx-no">{String(i + 1).padStart(2, '0')}</span><h3>{p.title[lang]}</h3><p>{p.desc[lang]}</p></div>
            ))}
          </div>
        </section>

        <section id="product" className="su-sec">
          <span className="tx-eyebrow">Product</span>
          <h2 className="tx-sec-h">{T('제품 환경 정보', 'Product environmental data', '製品の環境情報')}</h2>
          <div className="su-doc">
            <div>
              <h3 style={{ fontSize: '1.15rem', margin: 0 }}>DOWSIL™ 1200 OS Primer — {T('LEED 확인서', 'LEED letter', 'LEED確認書')}</h3>
              <p className="tx-foot mb-0">{T('VOC 112 g/L, LEED VOC 한도(비다공 250 / 다공 750 g/L) 이내 — Dow 발급 문서 기준', 'VOC 112 g/L, within LEED VOC limits (250 non-porous / 750 porous g/L) — per Dow-issued document', 'VOC 112 g/L、LEED VOC基準(非多孔250/多孔750 g/L)以内 — Dow発行書類に基づく')}</p>
            </div>
            <a className="btn btn-outline-dark" href="/tds/dowsil-1200-os.pdf" target="_blank" rel="noopener noreferrer">PDF ↗</a>
          </div>
          <p className="tx-foot mt-3">{T('그 외 제품의 환경·규격 정보는 각 TDS에 있습니다.', 'Environmental and standards data for other products is in each TDS.', '他製品の環境・規格情報は各TDSに記載されています。')} <Link href={`/${lang}/tds`}>{T('TDS 자료실', 'TDS center', 'TDSセンター')} →</Link></p>
        </section>

        <section id="faq" className="su-sec">
          <span className="tx-eyebrow">FAQ</span>
          <h2 className="tx-sec-h">{T('자주 묻는 질문', 'FAQ', 'よくある質問')}</h2>
          <div className="mb-5">
            {SUS_FAQ.map((f, i) => (
              <details key={i} className="tx-faq"><summary>{f.q[lang]}</summary><p>{f.a[lang]}</p></details>
            ))}
          </div>
        </section>
      </div>

      <section className="bg-primary text-white" style={{ padding: '5rem 0' }}>
        <div className="container">
          <h2 style={{ fontSize: 'clamp(1.8rem,3.4vw,2.8rem)' }}>{T('환경·안전 자료가 필요하신가요?', 'Need environmental or safety documents?', '環境・安全資料が必要ですか?')}</h2>
          <p style={{ color: '#c4c8cc', maxWidth: '40rem' }}>{T('제품명을 알려 주시면 TDS·SDS·LEED 자료 제공 여부를 확인해 드립니다.', 'Tell us the product and we will confirm which TDS, SDS and LEED documents are available.', '製品名をお知らせいただければ、TDS・SDS・LEED資料の提供可否を確認します。')}</p>
          <div className="d-flex flex-wrap gap-2 mt-4">
            <a href={`mailto:${COMPANY.email}`} className="btn btn-light">{COMPANY.email} →</a>
            <a href={PHONE_TEL} className="btn btn-outline-light">{PHONE_DISPLAY}</a>
          </div>
        </div>
      </section>
    </Tx>
  )
}
