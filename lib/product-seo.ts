import { bySlug } from '@/lib/products-catalog'
import { localizeCatalog } from '@/lib/products-catalog-en'

// 구 Dow Corning 명칭으로도 유통된 제품 (검색어 변형 대응용). 확실한 제품만 허용한다.
const LEGACY_DC = new Set([
  'dowsil-789', 'dowsil-791', 'dowsil-795', 'dowsil-995', 'dowsil-121', 'dowsil-977', 'dowsil-991', 'dowsil-993', 'dowsil-983', 'dowsil-982',
  'dowsil-939', 'dowsil-335', 'dowsil-888', 'dowsil-890-sl', 'dowsil-902-rcs', 'dowsil-123', 'dowsil-786-plus', 'dowsil-firestop-700',
  'dowsil-allguard', 'dowsil-primer-c', 'dowsil-allguard-primer', 'dowsil-1200-os',
])

// 제품 번호(예: 993, 890-SL, Primer-C) 추출
export const productCode = (slug: string): string => {
  const c = bySlug(slug)
  const n = (c?.name ?? slug).replace(/DOWSIL™?\s*/i, '').trim()
  return n || slug.replace(/^dowsil-/, '').toUpperCase()
}

// 한국어 시장에서 쓰이는 표기·영문 변형 (예: 다우실 993, Dow 993, Dow Corning 993)
export function aliasesOf(slug: string): string[] {
  const code = productCode(slug)
  const out = [`다우실 ${code}`, `Dow ${code}`, `DOWSIL ${code}`, `DOWSIL${code.replace(/\s+/g, '')}`]
  if (LEGACY_DC.has(slug)) out.push(`Dow Corning ${code}`, `DC ${code}`)
  return Array.from(new Set(out))
}

export interface Faq { q: string; a: string }

const STRUCTURAL = new Set(['dowsil-795', 'dowsil-995', 'dowsil-121', 'dowsil-983', 'dowsil-993', 'dowsil-982', 'dowsil-939'])
const SPEC_KEYS_KO = ['색상', '포장', '유효기간']
const SPEC_KEYS_EN = ['Colors', 'Packaging', 'Shelf life']

// 제품별 FAQ (카탈로그 데이터에서 생성) — 페이지 본문 + FAQPage 구조화 데이터에 함께 사용
export function productFaq(slug: string, lang: 'ko' | 'en'): Faq[] {
  const c = bySlug(slug)
  if (!c) return []
  const p = localizeCatalog(c, lang)
  const ko = lang === 'ko'
  const name = c.name
  const code = productCode(slug)
  const alias = aliasesOf(slug).slice(0, 4).join(' · ')
  const firstSentence = p.description.split(/(?<=[.。])\s/)[0]
  const faqs: Faq[] = []

  faqs.push({
    q: ko ? `${name}(다우실 ${code})은 어떤 제품인가요?` : `What is ${name} (${code})?`,
    a: ko ? `${p.summary}. ${firstSentence} 다른 이름·표기: ${alias}.` : `${p.summary}. ${firstSentence} Also searched as: ${alias}.`,
  })
  faqs.push({
    q: ko ? `${name} TDS(기술 데이터시트)는 어디서 받나요?` : `Where can I download the ${name} TDS (technical data sheet)?`,
    a: ko
      ? `이 페이지의 「${c.docLabel ?? 'TDS'} 다운로드」 버튼에서 PDF를 바로 받으실 수 있습니다. TDS의 수치는 대표 특성이며 시방서 작성용이 아닙니다. 최신 문서가 필요하면 한국건설트레이딩으로 문의해 주세요.`
      : `Use the “${c.docLabel ? 'Download' : 'TDS download'}” button on this page to get the PDF. Values in the TDS are typical properties, not specifications. Contact KCT if you need the latest document.`,
  })
  if (p.applications.length) {
    faqs.push({
      q: ko ? `${name}의 주요 용도는 무엇인가요?` : `What is ${name} used for?`,
      a: p.applications.join(ko ? ', ' : '; ') + '.',
    })
  }
  const keys = ko ? SPEC_KEYS_KO : SPEC_KEYS_EN
  const found = keys.filter((k) => p.specs[k]).map((k) => `${k}: ${p.specs[k]}`)
  if (found.length) {
    faqs.push({
      q: ko ? `${name}의 색상·포장·유효기간은 어떻게 되나요?` : `What are the colors, packaging and shelf life of ${name}?`,
      a: found.join(ko ? ' / ' : ' / ') + (ko ? ' (TDS 기준, 최신 사양은 문의)' : ' (per TDS; ask for the latest specification)'),
    })
  }
  faqs.push({
    q: ko ? `${name} 구매·견적은 어떻게 하나요?` : `How do I buy or request a quotation for ${name}?`,
    a: ko
      ? '한국건설트레이딩에 이메일(sales@kconstrade.com), 전화(010-8939-0284), WhatsApp으로 문의해 주세요. 국내 B2B 공급과 수출 모두 상담합니다. 소량 구매는 네이버 스마트스토어를 이용하실 수 있습니다.'
      : 'Contact Korea Construction Trading (KCT) by email (sales@kconstrade.com), phone (+82 10-8939-0284) or WhatsApp. We handle domestic B2B supply and export.',
  })
  faqs.push({
    q: ko ? `${name} 시공·기술 지원도 받을 수 있나요?` : `Can I get technical support for ${name}?`,
    a: ko
      ? `한국건설트레이딩은 제품 선정, 기술 자료 안내, 시공 조건 확인에 대한 기술 지원을 위해 최선을 다합니다.${STRUCTURAL.has(slug) ? ' 구조 글레이징 등 구조용 적용은 Dow 기술진의 검토가 필요합니다.' : ''}`
      : `KCT does its best to support product selection, technical documents and application conditions.${STRUCTURAL.has(slug) ? ' Structural glazing applications require review by Dow technical staff.' : ''}`,
  })
  return faqs
}
