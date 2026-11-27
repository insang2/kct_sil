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
      ? '한국건설트레이딩에 이메일(sales@kconstrade.com), 전화(010-8939-0284), 카카오톡 채널, WhatsApp으로 문의해 주세요. 국내 B2B 공급과 수출 모두 상담합니다. 소량 구매는 네이버 스마트스토어를 이용하실 수 있습니다.'
      : 'Contact Korea Construction Trading (KCT) by email (sales@kconstrade.com), phone (+82 10-8939-0284), KakaoTalk channel or WhatsApp. We handle domestic B2B supply and export.',
  })
  faqs.push({
    q: ko ? `${name} 시공·기술 지원도 받을 수 있나요?` : `Can I get technical support for ${name}?`,
    a: ko
      ? `한국건설트레이딩은 제품 선정, 기술 자료 안내, 시공 조건 확인에 대한 기술 지원을 위해 최선을 다합니다.${STRUCTURAL.has(slug) ? ' 구조 글레이징 등 구조용 적용은 Dow 기술진의 검토가 필요합니다.' : ''}`
      : `KCT does its best to support product selection, technical documents and application conditions.${STRUCTURAL.has(slug) ? ' Structural glazing applications require review by Dow technical staff.' : ''}`,
  })
  return faqs
}

// ───────── 제품 → 관련 기술자료 내부 링크 ─────────
import { PAGES as TECH_PAGES } from '@/lib/tech-manual'
import { IPAGES } from '@/lib/industrial/pages'
import { SERIES } from '@/lib/series/config'

const RELATED: Record<string, string[]> = {
  'dowsil-firestop-700': ['technical/fire-safety-products', 'technical/linear-joints-walls', 'technical/penetration-seals', 'technical/curtain-wall'],
  'dowsil-primer-c': ['technical/industrial/primers-and-cleaners', 'technical/industrial/surface-preparation', 'technical/curtain-wall'],
  'dowsil-allguard-primer': ['technical/industrial/primers-and-cleaners', 'technical/industrial/surface-preparation'],
  'dowsil-1200-os': ['technical/industrial/primers-and-cleaners', 'technical/industrial/surface-preparation', 'technical/industrial/application-and-cure'],
  'dowsil-rtv-hi-temp': ['technical/industrial/high-temperature-sealants', 'technical/industrial/acetoxy-sealants', 'technical/industrial/which-silicone'],
  'dowsil-786-plus': ['technical/industrial/acetoxy-sealants', 'technical/industrial/which-silicone', 'technical/industrial/application-and-cure'],
  'dowsil-sanitary': ['technical/industrial/acetoxy-sealants', 'technical/industrial/which-silicone'],
}
const STRUCT = ['technical/curtain-wall', 'technical/industrial/surface-preparation', 'technical/basics/properties-and-functional-groups']
const DEFAULT = ['technical/industrial/which-silicone', 'technical/industrial/surface-preparation', 'technical/basics/properties-and-functional-groups']

function titleOf(path: string, lang: 'ko' | 'en'): string | null {
  const parts = path.split('/')
  if (parts[1] === 'industrial') return IPAGES.find((p) => p.slug === parts[2])?.title[lang] ?? null
  if (parts[1] in SERIES) return SERIES[parts[1]].pages.find((p) => p.slug === parts[2])?.title[lang] ?? null
  return TECH_PAGES.find((p) => p.slug === parts[1])?.title[lang] ?? null
}

export function relatedTech(slug: string, lang: 'ko' | 'en'): { path: string; title: string }[] {
  const c = bySlug(slug)
  const paths = RELATED[slug] ?? (STRUCTURAL_OR_IGU.has(c?.category ?? '') ? STRUCT : DEFAULT)
  return paths
    .map((path) => ({ path, title: titleOf(path, lang) }))
    .filter((x): x is { path: string; title: string } => !!x.title)
}
const STRUCTURAL_OR_IGU = new Set(['building', 'igu'])

// ───────── 제품 상세 SEO 메타 (카탈로그 확인 사실만 사용, ko ≤40자/80~110자, en ≤60자/120~155자) ─────────
export interface ProductSeoEntry {
  title: { ko: string; en: string }
  description: { ko: string; en: string }
}

export const PRODUCT_SEO_META: Record<string, ProductSeoEntry> = {
  'dowsil-789': {
    title: {
      ko: '다우실 789(DOWSIL 789) 중성 내후성 실란트 | KCT',
      en: 'DOWSIL™ 789 Neutral Weatherproofing Sealant & TDS | KCT',
    },
    description: {
      ko: '다우실 789(DOWSIL™ 789)는 프라이머 없이 접착되는 1액형 중성 내후성 실란트(±50%)입니다. TDS 다운로드, 물성 사양 및 KCT B2B 견적을 확인하세요.',
      en: 'DOWSIL™ 789 is a one-part neutral weatherproofing sealant with ±50% movement and primerless adhesion. Download TDS and request B2B quotes from KCT.',
    },
  },
  'dowsil-791': {
    title: {
      ko: '다우실 791(DOWSIL 791) 커튼월 외장 실란트 | KCT',
      en: 'DOWSIL™ 791 Curtain Wall Weatherproofing Sealant | KCT',
    },
    description: {
      ko: '다우실 791(DOWSIL™ 791)은 커튼월·외장 웨더실링용 1액형 중성 실란트(±50%)입니다. 제품 TDS PDF 다운로드, 물성 사양 및 KCT B2B 견적 안내.',
      en: 'DOWSIL™ 791 is a one-part neutral silicone sealant (±50% movement) for curtain wall and façade weather sealing. Download TDS and get B2B quotes.',
    },
  },
  'dowsil-795': {
    title: {
      ko: '다우실 795(DOWSIL 795) 구조·내후성 실란트 | KCT',
      en: 'DOWSIL™ 795 Structural & Weatherproofing Sealant | KCT',
    },
    description: {
      ko: '다우실 795(DOWSIL™ 795)는 ASTM C1184 구조용과 ±50% 내후성 실링을 겸하는 1액형 중성 실란트입니다. TDS 다운로드와 KCT B2B 견적을 제공합니다.',
      en: 'DOWSIL™ 795 is a one-part neutral sealant meeting ASTM C1184 for structural glazing and ±50% weatherproofing. Download TDS and request B2B pricing.',
    },
  },
  'dowsil-995': {
    title: {
      ko: '다우실 995(DOWSIL 995) 1액형 구조 실란트 | KCT',
      en: 'DOWSIL™ 995 One-Part Structural Glazing Sealant | KCT',
    },
    description: {
      ko: '다우실 995(DOWSIL™ 995)는 공장·현장 유리·금속 구조 글레이징용 고강도 1액형 중성 실란트입니다. TDS 다운로드, 물성 사양 및 KCT B2B 공급 안내.',
      en: 'DOWSIL™ 995 is a high-strength one-part neutral structural glazing sealant for glass and metal bonding. Download the TDS PDF and request KCT quotes.',
    },
  },
  'dowsil-121': {
    title: {
      ko: '다우실 121(DOWSIL 121) 속경화 2액형 실란트 | KCT',
      en: 'DOWSIL™ 121 Fast-Cure 2-Part Structural Sealant | KCT',
    },
    description: {
      ko: '다우실 121(DOWSIL™ 121)은 24~48시간 내 구조 강도가 발현되는 속경화 2액형 중성 구조·웨더실 실란트입니다. TDS 다운로드와 KCT B2B 견적 안내.',
      en: 'DOWSIL™ 121 is a fast-curing two-part neutral RTV silicone for structural glazing, repair and reglazing. Download the TDS and request B2B supply.',
    },
  },
  'dowsil-977': {
    title: {
      ko: '다우실 977(DOWSIL 977) 석재 비오염 실란트 | KCT',
      en: 'DOWSIL™ 977 Low-Stain Stone & Metal Sealant | KCT',
    },
    description: {
      ko: '다우실 977(DOWSIL™ 977)은 화강석 등 다공성 석재 오염과 금속 패널 흘러내림을 줄이는 1액형 실란트(±50%)입니다. TDS 다운로드 및 KCT B2B 공급.',
      en: 'DOWSIL™ 977 is a one-part medium-modulus silicone (±50%) that reduces porous stone staining and metal rundown. Download the TDS and request quotes.',
    },
  },
  'dowsil-991': {
    title: {
      ko: '다우실 991(DOWSIL 991) 천연석 비오염 실란트 | KCT',
      en: 'DOWSIL™ 991 Non-Staining Stone & Façade Sealant | KCT',
    },
    description: {
      ko: '다우실 991(DOWSIL™ 991)은 천연석·유리·금속 패널 웨더프루핑용 비오염 중모듈러스 1액형 실란트(±50%)입니다. TDS 다운로드 및 KCT B2B 견적 안내.',
      en: 'DOWSIL™ 991 is a non-staining one-part medium-modulus sealant (±50%) for natural stone, glass and metal panels. Download TDS and request B2B quotes.',
    },
  },
  'dowsil-813c': {
    title: {
      ko: '다우실 813C(DOWSIL 813C) 콘크리트 실란트 | KCT',
      en: 'DOWSIL™ 813C Concrete & Masonry Silicone Sealant | KCT',
    },
    description: {
      ko: '다우실 813C(DOWSIL™ 813C)는 콘크리트·조적·익스팬션 조인트용 1액형 저모듈러스 중성 실란트(±50%)입니다. TDS 다운로드 및 KCT B2B 견적 안내.',
      en: 'DOWSIL™ 813C is a one-part neutral low-modulus silicone (±50% movement) for concrete, masonry and expansion joints. Download TDS and request quotes.',
    },
  },
  'dowsil-1001': {
    title: {
      ko: '다우실 1001(DOWSIL 1001) 창호 페리미터 실란트 | KCT',
      en: 'DOWSIL™ 1001 Window Perimeter Silicone Sealant | KCT',
    },
    description: {
      ko: '다우실 1001(DOWSIL™ 1001)은 주거용 창호 페리미터·발코니 익스팬션 조인트용 1액형 중성 저모듈러스 실란트입니다. TDS 다운로드 및 KCT B2B 공급.',
      en: 'DOWSIL™ 1001 is a one-part neutral low-modulus silicone (±50%) for residential window perimeter and expansion joints. Download TDS and get quotes.',
    },
  },
  'dowsil-double-n': {
    title: {
      ko: '다우실 Double-N(DOWSIL) 범용 중성 실리콘 | KCT',
      en: 'DOWSIL™ Double-N General-Purpose Neutral Sealant | KCT',
    },
    description: {
      ko: '다우실 Double-N(DOWSIL™ Double-N)은 일반 글레이징·웨더실링·전문 시공용 범용 1액형 중성 실리콘 실란트입니다. TDS 다운로드 및 KCT B2B 공급.',
      en: 'DOWSIL™ Double-N is a one-part neutral-cure silicone for general glazing, weather sealing and professional trade use. Download TDS and request KCT quotes.',
    },
  },
  'dowsil-sanitary': {
    title: {
      ko: '다우실 Sanitary(DOWSIL) 욕실 곰팡이방지 실리콘 | KCT',
      en: 'DOWSIL™ Sanitary Mould-Resistant Neutral Sealant | KCT',
    },
    description: {
      ko: '다우실 Sanitary(DOWSIL™ Sanitary)는 욕실·세탁 싱크·타일 주변의 곰팡이 번식을 억제하는 1액형 중성 실리콘입니다. TDS 다운로드 및 KCT B2B 공급.',
      en: 'DOWSIL™ Sanitary is a one-part neutral-cure silicone resisting mould in high-humidity bathrooms, sinks and ceramic tile areas. Download TDS from KCT.',
    },
  },
  'dowsil-786-plus': {
    title: {
      ko: '다우실 786+(DOWSIL 786+) 항균 위생 실란트 | KCT',
      en: 'DOWSIL™ 786+ FDA Hygienic Silicone Sealant | KCT',
    },
    description: {
      ko: '다우실 786+(DOWSIL™ 786+)는 FDA 21 CFR 177.2600 적합 곰팡이·세균 저항 아세톡시 위생 실란트입니다. TDS 다운로드 및 KCT B2B 견적 안내.',
      en: 'DOWSIL™ 786+ is a mould- and bacteria-resistant acetoxy hygienic sealant complying with FDA 21 CFR 177.2600. Download the TDS PDF and request quotes.',
    },
  },
  'dowsil-se-5088': {
    title: {
      ko: '다우실 SE 5088(DOWSIL) 클린룸 저휘발 실리콘 | KCT',
      en: 'DOWSIL™ SE 5088 Low-Volatile Cleanroom Silicone | KCT',
    },
    description: {
      ko: '다우실 SE 5088(DOWSIL™ SE 5088)은 저분자 실록산 휘발분을 낮춘 클린룸 조인트·패널용 1액형 중성 실리콘입니다. TDS 다운로드 및 KCT B2B 공급.',
      en: 'DOWSIL™ SE 5088 is a low-volatile one-part neutral silicone with reduced D4–D10 siloxanes for cleanroom joints and panels. Download TDS from KCT.',
    },
  },
  'dowsil-902-rcs': {
    title: {
      ko: '다우실 902 RCS(DOWSIL) 교량 신축이음 실란트 | KCT',
      en: 'DOWSIL™ 902 RCS Bridge & Highway Joint Sealant | KCT',
    },
    description: {
      ko: '다우실 902 RCS(DOWSIL™ 902 RCS)는 교량·고속도로 신축이음용 속경화 자기수평 2액형 실리콘(+100/-50%)입니다. TDS 다운로드 및 KCT B2B 공급.',
      en: 'DOWSIL™ 902 RCS is a rapid-cure, self-leveling two-part silicone (+100/-50% movement) for bridge and highway expansion joints. Download TDS from KCT.',
    },
  },
  'dowsil-888': {
    title: {
      ko: '다우실 888(DOWSIL 888) 콘크리트 도로 실란트 | KCT',
      en: 'DOWSIL™ 888 Non-Sag Concrete Pavement Sealant | KCT',
    },
    description: {
      ko: '다우실 888(DOWSIL™ 888)은 콘크리트 포장 조인트용 1액형 냉간 시공 비흐름성 실리콘 실란트(+100/-50%)입니다. TDS 다운로드 및 KCT B2B 공급.',
      en: 'DOWSIL™ 888 is a one-part cold-applied non-sag silicone (+100/-50% movement) for Portland cement concrete pavement joints. Download TDS from KCT.',
    },
  },
  'dowsil-890-sl': {
    title: {
      ko: '다우실 890-SL(DOWSIL) 자기수평 도로 실란트 | KCT',
      en: 'DOWSIL™ 890-SL Self-Leveling Road Joint Sealant | KCT',
    },
    description: {
      ko: '다우실 890-SL(DOWSIL™ 890-SL)은 툴링 없이 시공하는 콘크리트·아스팔트 포장용 자기수평 1액형 실리콘입니다. TDS 다운로드 및 KCT B2B 견적 안내.',
      en: 'DOWSIL™ 890-SL is a one-part self-leveling silicone (+100/-50% movement) for concrete and asphalt pavement joints with no tooling. Download the TDS.',
    },
  },
  'dowsil-335': {
    title: {
      ko: '다우실 335(DOWSIL 335) 복층유리 1차 부틸 | KCT',
      en: 'DOWSIL™ 335 Butyl Primary IG Sealant & TDS | KCT',
    },
    description: {
      ko: '다우실 335(DOWSIL™ 335 Butyl)은 EN 1279 기준 가스 충진 복층유리 1차 씰링용 무용제 폴리이소부틸렌 부틸입니다. TDS 다운로드 및 KCT B2B 공급.',
      en: 'DOWSIL™ 335 Butyl is a solvent-free, heat-applied polyisobutylene primary sealant for EN 1279 insulating glass units. Download the TDS and get quotes.',
    },
  },
  'dowsil-939': {
    title: {
      ko: '다우실 939(DOWSIL 939) 복층유리 2차 실란트 | KCT',
      en: 'DOWSIL™ 939 Two-Part IG Secondary Sealant | KCT',
    },
    description: {
      ko: '다우실 939(DOWSIL™ 939)는 주거용 이중 씰 복층유리 2차 씰링용 2액형 중성 실리콘 실란트(혼합비 13:1)입니다. TDS 다운로드 및 KCT B2B 공급.',
      en: 'DOWSIL™ 939 is a two-part neutral silicone secondary sealant (13:1 by weight) for dual-sealed residential insulating glass. Download TDS from KCT.',
    },
  },
  'dowsil-982': {
    title: {
      ko: '다우실 982(DOWSIL 982) 구조 복층유리 실란트 | KCT',
      en: 'DOWSIL™ 982 Structural IG Secondary Sealant | KCT',
    },
    description: {
      ko: '다우실 982(DOWSIL™ 982)는 구조 지지 가능한 복층유리 2차 씰링용 2액형 고모듈러스 실리콘 실란트(12:1)입니다. TDS 다운로드 및 KCT B2B 견적 안내.',
      en: 'DOWSIL™ 982 is a two-part high-modulus silicone secondary sealant (12:1 by weight) with structural capability for insulating glass. Download the TDS.',
    },
  },
  'dowsil-983': {
    title: {
      ko: '다우실 983(DOWSIL 983) 2액형 구조 실란트 | KCT',
      en: 'DOWSIL™ 983 Two-Part Structural Glazing Sealant | KCT',
    },
    description: {
      ko: '다우실 983(DOWSIL™ 983)은 공장 글레이징·커튼월 생산용 2액형 중성 구조·웨더실 실란트(ASTM C1184)입니다. TDS 다운로드 및 KCT B2B 공급.',
      en: 'DOWSIL™ 983 is a two-part neutral RTV silicone (ASTM C1184, ±25%) for factory structural glazing and curtain wall units. Download TDS and get quotes.',
    },
  },
  'dowsil-993': {
    title: {
      ko: '다우실 993(DOWSIL 993) 2액형 구조 실란트 | KCT',
      en: 'DOWSIL™ 993 2-Part Structural Glazing Sealant | KCT',
    },
    description: {
      ko: '다우실 993(DOWSIL™ 993)은 EOTA·중국 GB 16776 규격을 만족하는 커튼월 구조 글레이징용 2액형 실란트입니다. TDS 다운로드 및 KCT B2B 견적 안내.',
      en: 'DOWSIL™ 993 is a two-part structural glazing silicone meeting European EOTA and GB 16776 standards for curtain wall units. Download TDS from KCT.',
    },
  },
  'dowsil-firestop-700': {
    title: {
      ko: '다우실 FIRESTOP 700 내화 실리콘 실란트 | KCT',
      en: 'DOWSIL™ FIRESTOP 700 Fire-Rated Silicone Sealant | KCT',
    },
    description: {
      ko: 'DOWSIL™ FIRESTOP 700(다우실 파이어스톱 700)은 선형 조인트·관통부용 1액형 내화 실리콘(최대 240분)입니다. TDS 다운로드 및 KCT B2B 공급.',
      en: 'DOWSIL™ FIRESTOP 700 is a halogen-free neutral fire-rated silicone (up to 240 min E/EI, ±50%) for linear joints and penetrations. Download the TDS.',
    },
  },
  'dowsil-rtv-hi-temp': {
    title: {
      ko: '다우실 Hi-Temp(DOWSIL) 260°C 내열 실리콘 | KCT',
      en: 'DOWSIL™ Hi-Temp 260°C High-Temperature Silicone | KCT',
    },
    description: {
      ko: 'DOWSIL™ Hi-Temp(다우실 하이템프)은 연속 260°C·단속 288°C 고온에 견디는 1액형 아세톡시 RTV 내열 실리콘입니다. TDS 다운로드 및 KCT B2B 공급.',
      en: 'DOWSIL™ Hi-Temp is a one-part acetoxy RTV silicone withstanding 260°C continuous (288°C intermittent) for ovens, flues and heaters. Download the TDS.',
    },
  },
  'dowsil-allguard': {
    title: {
      ko: '다우실 ALLGUARD(DOWSIL) 외벽 실리콘 방수 코팅 | KCT',
      en: 'DOWSIL™ ALLGUARD Silicone Waterproof Coating | KCT',
    },
    description: {
      ko: 'DOWSIL™ ALLGUARD(다우실 올가드)는 콘크리트·벽돌·스터코·EIFS 외벽 방수용 1액형 수성 실리콘 엘라스토머 코팅입니다. TDS 다운로드 및 KCT 공급.',
      en: 'DOWSIL™ ALLGUARD is a one-part water-based elastomeric silicone coating waterproofing exterior masonry, concrete and EIFS walls. Download the TDS.',
    },
  },
  'dowsil-123': {
    title: {
      ko: '다우실 123(DOWSIL 123) 프리폼 실리콘 실 | KCT',
      en: 'DOWSIL™ 123 Preformed Silicone Seal & TDS | KCT',
    },
    description: {
      ko: '다우실 123(DOWSIL™ 123)은 파손된 외장 조인트 보수용 +200/-75% 고이동 프리폼(압출 성형) 실리콘 실입니다. TDS 다운로드 및 KCT B2B 견적 안내.',
      en: 'DOWSIL™ 123 is an extruded preformed silicone seal (+200/-75% movement) for repairing failed building and glazing weatherseal joints. Download TDS.',
    },
  },
  'dowsil-375': {
    title: {
      ko: '다우실 375(DOWSIL 375) 유리 난간 임베딩 | KCT',
      en: 'DOWSIL™ 375 Glass Balustrade Embedding Compound | KCT',
    },
    description: {
      ko: '다우실 375(DOWSIL™ 375)는 실내외 글라스 난간 U-프로파일 유리 고정용 자기수평 2액형 폴리우레탄 임베딩재입니다. TDS 다운로드 및 KCT B2B 공급.',
      en: 'DOWSIL™ 375 is a solvent-free, self-leveling two-part polyurethane for embedding glass balustrade panels in U-profiles. Download TDS and get quotes.',
    },
  },
  'dowsil-650-plus': {
    title: {
      ko: '다우실 650+(DOWSIL 650+) 파사드 보호 코팅 | KCT',
      en: 'DOWSIL™ 650+ Peelable Façade Protection Coating | KCT',
    },
    description: {
      ko: '다우실 650+(DOWSIL™ 650+)는 파사드 유리·금속을 오염·용접 슬래그로부터 임시 보호하는 수성 박리형 코팅입니다. TDS 다운로드 및 KCT B2B 공급.',
      en: 'DOWSIL™ 650+ is a waterborne acrylic peelable coating for temporary protection of façade glass and metal against dust and weld slag. Download TDS.',
    },
  },
  'dowsil-primer-c': {
    title: {
      ko: '다우실 Primer-C(DOWSIL) Kynar 실란 프라이머 | KCT',
      en: 'DOWSIL™ Primer-C Silane Primer for Kynar | KCT',
    },
    description: {
      ko: 'DOWSIL™ Primer-C(다우실 프라이머-C)는 983·993 구조 실란트의 PVF2(Kynar) 도장면 접착을 높이는 실란 프라이머입니다. TDS 다운로드 및 KCT 공급.',
      en: 'DOWSIL™ Primer-C is a solvent-based silane primer promoting adhesion of DOWSIL™ 983, 993 and 993N sealants to PVF2 / Kynar paints. Download the TDS.',
    },
  },
  'dowsil-allguard-primer': {
    title: {
      ko: '다우실 ALLGUARD Primer 수성 실리콘 프라이머 | KCT',
      en: 'DOWSIL™ ALLGUARD Primer Water-Based Adhesion | KCT',
    },
    description: {
      ko: 'DOWSIL™ ALLGUARD Primer는 콘크리트·벽돌·EIFS 외벽에 ALLGUARD 방수 코팅 접착력을 높이는 수성 실리콘 프라이머입니다. TDS 다운로드 및 KCT 공급.',
      en: 'DOWSIL™ ALLGUARD Primer is a water-based silicone emulsion primer that improves DOWSIL™ ALLGUARD coating adhesion on exterior masonry. Download TDS.',
    },
  },
  'dowsil-1200-os': {
    title: {
      ko: '다우실 1200 OS(DOWSIL) 범용 실리콘 프라이머 | KCT',
      en: 'DOWSIL™ 1200 OS General-Purpose Silicone Primer | KCT',
    },
    description: {
      ko: '다우실 1200 OS(DOWSIL™ 1200 OS)는 금속·유리·석재 등에 실리콘 실란트 접착을 높이는 수분 경화 범용 프라이머입니다. LEED 확인서 및 KCT B2B 안내.',
      en: 'DOWSIL™ 1200 OS Primer is a moisture-curing primer improving silicone sealant adhesion on metal, glass and masonry. Download the LEED letter from KCT.',
    },
  },
}

export function productSeoMeta(slug: string, lang: string): { title: string; description: string } | null {
  const entry = PRODUCT_SEO_META[slug]
  if (!entry) return null
  const l: 'ko' | 'en' = lang === 'en' ? 'en' : 'ko'
  return { title: entry.title[l], description: entry.description[l] }
}
