import { CATALOG, CATEGORIES, bySlug, type CatalogProduct } from '@/lib/products-catalog'
import { localizeCatalog, CATEGORY_EN } from '@/lib/products-catalog-en'
import { PAGES as TECH_PAGES } from '@/lib/tech-manual'
import { IPAGES } from '@/lib/industrial/pages'
import { SERIES } from '@/lib/series/config'

// 구 Dow Corning 명칭으로도 유통된 제품 (검색어 변형 대응용). 확실한 제품만 허용한다.
const LEGACY_DC = new Set([
  'dowsil-789', 'dowsil-791', 'dowsil-795', 'dowsil-995', 'dowsil-121', 'dowsil-977', 'dowsil-991', 'dowsil-993', 'dowsil-983', 'dowsil-982',
  'dowsil-939', 'dowsil-335', 'dowsil-888', 'dowsil-890-sl', 'dowsil-902-rcs', 'dowsil-123', 'dowsil-786-plus', 'dowsil-firestop-700',
  'dowsil-allguard', 'dowsil-primer-c', 'dowsil-allguard-primer', 'dowsil-1200-os',
])

// 제품 번호(예: 993, 890-SL, Primer-C) 추출 — 함수 선언으로 호이스팅하여 순환 참조 시 TDZ를 방지한다.
export function productCode(slug: string): string {
  const c = bySlug(slug)
  const n = (c?.name ?? slug).replace(/DOWSIL™?\s*/i, '').trim()
  return n || slug.replace(/^dowsil-/, '').toUpperCase()
}

// 한국어 받침 판별 (숫자·영문 모델명·기호 '+' 대응)
export function hasBatchim(text: string): boolean {
  const s = text.replace(/[™®)\s]+$/g, '').trim()
  if (!s) return false
  const last = s[s.length - 1]
  const code = last.charCodeAt(0)
  // 한글 완성형
  if (code >= 0xac00 && code <= 0xd7a3) return (code - 0xac00) % 28 !== 0
  // 숫자: 0(영/공/백), 1(일), 3(삼), 6(육), 7(칠), 8(팔) -> 받침 있음 / 2(이), 4(사), 5(오), 9(구) -> 없음
  if (last >= '0' && last <= '9') return '013678'.includes(last)
  // '+' -> 플러스 (받침 없음)
  if (last === '+') return false
  // 영문 끝 글자 발음 규칙 (L/M/N: 엘·엠·엔·틸 등 받침 있음; Primer->머, Temp->프, ALLGUARD->드, C->씨, S->에스, y->리 등 없음)
  const lower = last.toLowerCase()
  return lower === 'l' || lower === 'm' || lower === 'n'
}

export const eunNeun = (text: string): '은' | '는' => (hasBatchim(text) ? '은' : '는')
export const iGa = (text: string): '이' | '가' => (hasBatchim(text) ? '이' : '가')
export const eulReul = (text: string): '을' | '를' => (hasBatchim(text) ? '을' : '를')

// 한국어 시장에서 쓰이는 표기·영문 변형 (예: 다우실 993, Dow 993, Dow Corning 993)
export function aliasesOf(slug: string): string[] {
  const code = productCode(slug)
  const out = [`다우실 ${code}`, `Dow ${code}`, `DOWSIL ${code}`, `DOWSIL${code.replace(/\s+/g, '')}`]
  if (LEGACY_DC.has(slug)) out.push(`Dow Corning ${code}`, `DC ${code}`)
  return Array.from(new Set(out))
}

export interface Faq { q: string; a: string }

const STRUCTURAL = new Set(['dowsil-795', 'dowsil-995', 'dowsil-121', 'dowsil-983', 'dowsil-993', 'dowsil-982', 'dowsil-939'])

// ───────── 상단 핵심 사양 요약 카드 (카탈로그 실측 필드만 사용, 미기재 시 '문의') ─────────
export interface KeySpecItem {
  label: string
  value: string
  missing: boolean
}

function pickHardness(c: CatalogProduct, isEn: boolean): string | null {
  const sp = localizeCatalog(c, isEn ? 'en' : 'ko').specs
  if (isEn) {
    if (sp['Hardness (Shore A)']) return `Shore A ${sp['Hardness (Shore A)']}`
    if (sp['Hardness (JIS A)']) return `JIS A ${sp['Hardness (JIS A)']}`
    if (sp['Hardness (Shore D)']) return `Shore D ${sp['Hardness (Shore D)']}`
    if (sp['Hardness']) return sp['Hardness']
    return null
  }
  if (sp['경도 (Shore A)']) return `Shore A ${sp['경도 (Shore A)']}`
  if (sp['Shore A 경도']) return `Shore A ${sp['Shore A 경도']}`
  if (sp['경도 (JIS A)']) return `JIS A ${sp['경도 (JIS A)']}`
  if (sp['경도 (Shore D)']) return `Shore D ${sp['경도 (Shore D)']}`
  if (sp['경도']) return sp['경도']
  return null
}

function pickColor(c: CatalogProduct, isEn: boolean): string | null {
  const sp = localizeCatalog(c, isEn ? 'en' : 'ko').specs
  if (isEn) {
    if (sp['Colors']) return sp['Colors']
    if (sp['Appearance']) return sp['Appearance']
    if (sp['As mixed']) return sp['As mixed']
    return null
  }
  if (sp['색상']) return sp['색상']
  if (sp['외관']) return sp['외관']
  if (sp['혼합 후']) return sp['혼합 후']
  return null
}

function pickShelfLife(c: CatalogProduct, isEn: boolean): string | null {
  const loc = localizeCatalog(c, isEn ? 'en' : 'ko')
  if (isEn) {
    if (loc.specs['Shelf life']) return loc.specs['Shelf life']
    const feat = loc.features.find((f) => /shelf life/i.test(f))
    if (feat) return feat.replace(/^Shelf life of\s*/i, '')
    return null
  }
  if (loc.specs['유효기간']) return loc.specs['유효기간']
  if (loc.specs['유통 기간']) return loc.specs['유통 기간']
  const feat = loc.features.find((f) => f.includes('유효기간'))
  if (feat) return feat.replace(/^유효기간\s*/, '')
  return null
}

export function keySpecCard(slug: string, lang: 'ko' | 'en'): KeySpecItem[] {
  const c = bySlug(slug)
  if (!c) return []
  const isEn = lang === 'en'
  const loc = localizeCatalog(c, lang)
  const sp = loc.specs
  const inquire = isEn ? 'Inquire' : '문의'

  const cure = isEn ? sp['Product type'] : sp['제품 유형']
  const movement = isEn ? sp['Movement capability'] : sp['움직임 허용치']
  const hardness = pickHardness(c, isEn)
  const color = pickColor(c, isEn)
  const packaging = isEn ? sp['Packaging'] : sp['포장']
  const shelfLife = pickShelfLife(c, isEn)

  const item = (label: string, val: string | null | undefined): KeySpecItem => ({
    label,
    value: val && val.trim() ? val : inquire,
    missing: !(val && val.trim()),
  })

  return [
    item(isEn ? 'Cure / Type' : '경화방식 · 유형', cure),
    item(isEn ? 'Movement' : '움직임 허용치', movement),
    item(isEn ? 'Hardness' : '경도', hardness),
    item(isEn ? 'Colors' : '색상', color),
    item(isEn ? 'Packaging' : '포장', packaging),
    item(isEn ? 'Shelf life' : '유효기간', shelfLife),
  ]
}

// ───────── 형제·대체 제품 3~4종 링크 (같은 카테고리·용도, 실제 CATALOG 슬러그만 사용) ─────────
export interface SiblingProduct {
  slug: string
  name: string
  categoryLabel: string
  summary: string
  relation: string
}

const SIBLING_MAP: Record<string, { slug: string; ko: string; en: string }[]> = {
  'dowsil-993': [
    { slug: 'dowsil-983', ko: '공장 글레이징 2액형 구조 실란트 (ASTM C1184)', en: 'Two-part factory structural sealant (ASTM C1184)' },
    { slug: 'dowsil-995', ko: '현장·공장 겸용 고강도 1액형 구조 실란트', en: 'High-strength one-part structural glazing sealant' },
    { slug: 'dowsil-982', ko: '구조 지지 가능 복층유리 2차 씰링 2액형', en: 'Two-part IG secondary sealant with structural capability' },
    { slug: 'dowsil-primer-c', ko: '993·983용 PVF2(Kynar) 도장면 전용 실란 프라이머', en: 'Dedicated silane primer for 993/983 on PVF2 (Kynar)' },
  ],
  'dowsil-995': [
    { slug: 'dowsil-795', ko: 'ASTM C1184 구조 + ±50% 내후성 겸용 1액형', en: 'One-part ASTM C1184 structural & ±50% weatherseal' },
    { slug: 'dowsil-993', ko: 'EOTA·GB 16776 규격 대응 공장용 2액형 구조 실란트', en: 'Two-part structural glazing (EOTA & GB 16776)' },
    { slug: 'dowsil-983', ko: '빠른 유닛 취급이 필요한 공장용 2액형 구조 실란트', en: 'Two-part factory glazing sealant (4–24 h handling)' },
    { slug: 'dowsil-121', ko: '보수·재글레이징용 속경화 2액형 구조 실란트', en: 'Fast-cure two-part sealant for repair & reglazing' },
  ],
  'dowsil-795': [
    { slug: 'dowsil-995', ko: '고강도 1액형 스트럭추럴 글레이징 전용 모델', en: 'Higher-modulus one-part structural glazing sealant' },
    { slug: 'dowsil-791', ko: '커튼월·외장 웨더실링 전용 1액형 중성 (±50%)', en: 'Dedicated curtain wall weatherproofing sealant (±50%)' },
    { slug: 'dowsil-789', ko: '일반·비구조 글레이징 무프라이머 내후성 (±50%)', en: 'General glazing primerless weatherseal (±50%)' },
    { slug: 'dowsil-121', ko: '현장 보수·재글레이징용 속경화 2액형', en: 'Fast two-part structural/weatherseal for repair' },
  ],
  'dowsil-789': [
    { slug: 'dowsil-791', ko: 'ASTM C920·ISO 11600·EN 15651 대응 커튼월 웨더실', en: 'Curtain wall weatherseal (ASTM C920, ISO 11600)' },
    { slug: 'dowsil-795', ko: '구조 글레이징(ASTM C1184)과 내후성 겸용 1액형', en: 'Dual-duty structural glazing and weatherseal' },
    { slug: 'dowsil-991', ko: '천연석·금속 패널 비오염 중모듈러스 실란트', en: 'Non-staining sealant for stone and metal panels' },
    { slug: 'dowsil-double-n', ko: '다색(14색) 범용 전문 시공 1액형 중성 실리콘', en: 'General-purpose neutral silicone in 14 colors' },
  ],
  'dowsil-791': [
    { slug: 'dowsil-789', ko: '유리·코팅 알루미늄 무프라이머 일반 내후성 실란트', en: 'Primerless neutral weatherseal for coated aluminum' },
    { slug: 'dowsil-795', ko: '구조 접합과 ±50% 웨더실링을 겸하는 1액형', en: 'One-part structural + ±50% weatherproofing sealant' },
    { slug: 'dowsil-977', ko: '화강석 등 다공성 석재·금속 패널 오염 저감형', en: 'Low-staining sealant for porous stone & metal panels' },
    { slug: 'dowsil-991', ko: '천연석 파사드·유리·금속 패널 비오염형 (9색)', en: 'Non-staining façade sealant for natural stone (9 colors)' },
  ],
  'dowsil-983': [
    { slug: 'dowsil-993', ko: '유럽 EOTA·중국 GB 16776 규격 대응 2액형 구조용', en: 'Two-part structural sealant for EOTA & GB 16776' },
    { slug: 'dowsil-982', ko: '복층유리 2차 씰링용 2액형 (구조 지지 가능)', en: 'Two-part IG secondary sealant with structural support' },
    { slug: 'dowsil-995', ko: '혼합 설비 없이 시공하는 1액형 고강도 구조 실란트', en: 'One-part high-strength structural glazing sealant' },
    { slug: 'dowsil-primer-c', ko: 'Kynar/PVF2 도장면 접착 촉진용 전용 프라이머', en: 'Dedicated silane primer for Kynar / PVF2 coatings' },
  ],
  'dowsil-888': [
    { slug: 'dowsil-890-sl', ko: '툴링 불필요 자기수평 콘크리트·아스팔트 도로용', en: 'Self-leveling no-tooling concrete/asphalt joint sealant' },
    { slug: 'dowsil-902-rcs', ko: '교량·고속도로 신축이음용 속경화 2액형 자기수평', en: 'Rapid-cure two-part self-leveling bridge joint sealant' },
    { slug: 'dowsil-813c', ko: '건축 외벽·콘크리트·보행로 저모듈러스 실란트', en: 'Low-modulus concrete, masonry & walkway sealant' },
  ],
  'dowsil-890-sl': [
    { slug: 'dowsil-888', ko: '경사·불균일 폭 콘크리트 포장용 비흐름성 1액형', en: 'Non-sag one-part sealant for concrete pavement joints' },
    { slug: 'dowsil-902-rcs', ko: '교량·고속도로 25~76mm 신축이음용 속경화 2액형', en: 'Rapid-cure two-part bridge/highway expansion sealant' },
    { slug: 'dowsil-813c', ko: '건축 콘크리트·조적·보행로 조인트용 중성 실란트', en: 'Neutral low-modulus sealant for concrete & walkways' },
  ],
  'dowsil-650-plus': [
    { slug: 'dowsil-allguard', ko: '외벽 조적·콘크리트용 영구 수성 실리콘 방수 코팅', en: 'Permanent water-based silicone waterproof wall coating' },
    { slug: 'dowsil-791', ko: '파사드·커튼월 외장 웨더실링 실란트 (호환 검토)', en: 'Curtain wall & façade weatherproofing sealant' },
    { slug: 'dowsil-795', ko: '커튼월 구조 글레이징·내후성 겸용 실란트', en: 'Curtain wall structural & weatherseal silicone' },
    { slug: 'dowsil-123', ko: '파손 조인트 보수용 +200/-75% 프리폼 실리콘 실', en: 'Preformed silicone seal (+200/-75%) for joint repair' },
  ],
  'dowsil-firestop-700': [
    { slug: 'dowsil-791', ko: '비내화 커튼월·외장 일반 웨더실링 (±50%)', en: 'Non-fire-rated curtain wall weatherproofing (±50%)' },
    { slug: 'dowsil-813c', ko: '콘크리트·조적 일반 익스팬션 조인트용 (±50%)', en: 'General concrete & masonry expansion joint sealant' },
    { slug: 'dowsil-rtv-hi-temp', ko: '연속 260°C·단속 288°C 고온 설비용 내열 실리콘', en: 'High-temperature acetoxy silicone (260°C continuous)' },
    { slug: 'dowsil-123', ko: '고이동(+200/-75%) 보수용 프리폼 실리콘 실', en: 'High-movement preformed silicone seal for remediation' },
  ],
}

export function siblingProducts(slug: string, lang: 'ko' | 'en'): SiblingProduct[] {
  const current = bySlug(slug)
  if (!current) return []
  const isEn = lang === 'en'
  const catName = (key: CatalogProduct['category']) =>
    isEn ? CATEGORY_EN[key].label : (CATEGORIES.find((x) => x.key === key)?.label ?? key)

  const curated = SIBLING_MAP[slug]
  if (curated) {
    return curated
      .map((item) => {
        const p = bySlug(item.slug)
        if (!p) return null
        const loc = localizeCatalog(p, lang)
        return {
          slug: p.slug,
          name: p.name,
          categoryLabel: catName(p.category),
          summary: loc.summary,
          relation: isEn ? item.en : item.ko,
        }
      })
      .filter((x): x is SiblingProduct => !!x)
  }

  // 나머지 20종: 동일 카테고리 우선 + 부족 시 연관 용도 보완 (3~4종)
  const sameCat = CATALOG.filter((p) => p.category === current.category && p.slug !== slug)
  const extras: CatalogProduct[] = []
  if (sameCat.length < 3) {
    const fallbackSlugs =
      current.category === 'gmp'
        ? ['dowsil-sanitary', 'dowsil-double-n']
        : current.category === 'civil'
        ? ['dowsil-813c', 'dowsil-123']
        : current.category === 'primer'
        ? ['dowsil-983', 'dowsil-993', 'dowsil-allguard']
        : ['dowsil-791', 'dowsil-795', 'dowsil-995']
    for (const s of fallbackSlugs) {
      const found = bySlug(s)
      if (found && found.slug !== slug && !sameCat.some((x) => x.slug === s)) extras.push(found)
    }
  }
  return [...sameCat, ...extras].slice(0, 4).map((p) => {
    const loc = localizeCatalog(p, lang)
    const same = p.category === current.category
    return {
      slug: p.slug,
      name: p.name,
      categoryLabel: catName(p.category),
      summary: loc.summary,
      relation: same
        ? (isEn ? `Same category (${catName(p.category)})` : `동일 제품군 (${catName(p.category)})`)
        : (isEn ? `Related line (${catName(p.category)})` : `연관 제품군 (${catName(p.category)})`),
    }
  })
}

// ───────── 유사 모델 미니 비교표 (모든 수치는 lib/products-catalog.ts specs 에서 실시간 추출) ─────────
export interface MiniComparison {
  title: string
  subtitle: string
  columns: { slug: string; name: string; isCurrent: boolean }[]
  rows: { label: string; values: string[] }[]
}

const COMPARE_GROUPS: Record<string, { slugs: string[]; koTitle: string; enTitle: string; koSub: string; enSub: string }> = {
  'dowsil-993': {
    slugs: ['dowsil-993', 'dowsil-983', 'dowsil-995'],
    koTitle: '유사 구조용 모델 비교: 993 ↔ 983 · 995',
    enTitle: 'Similar Structural Models Compared: 993 vs. 983 & 995',
    koSub: '공장 커튼월 2액형 구조 실란트(993·983)와 1액형 구조 실란트(995)의 카탈로그 대표 특성을 비교합니다.',
    enSub: 'Compare typical catalog values for two-part factory structural sealants (993, 983) and one-part 995.',
  },
  'dowsil-983': {
    slugs: ['dowsil-983', 'dowsil-993', 'dowsil-982'],
    koTitle: '유사 2액형 모델 비교: 983 ↔ 993 · 982',
    enTitle: 'Similar Two-Part Models Compared: 983 vs. 993 & 982',
    koSub: '커튼월 구조 글레이징 2액형(983·993)과 복층유리 2차 씰링 2액형(982)의 카탈로그 수치를 비교합니다.',
    enSub: 'Compare two-part structural glazing sealants (983, 993) with two-part IG secondary sealant (982).',
  },
  'dowsil-995': {
    slugs: ['dowsil-995', 'dowsil-795', 'dowsil-993'],
    koTitle: '유사 구조용 모델 비교: 995 ↔ 795 · 993',
    enTitle: 'Similar Structural Models Compared: 995 vs. 795 & 993',
    koSub: '1액형 고강도 구조용(995), 구조·내후성 겸용(795), 공장용 2액형(993)의 대표 특성을 비교합니다.',
    enSub: 'Compare one-part high-strength structural (995), dual-purpose (795) and two-part factory (993).',
  },
  'dowsil-795': {
    slugs: ['dowsil-795', 'dowsil-995', 'dowsil-791'],
    koTitle: '유사 모델 비교: 795 ↔ 995 · 791',
    enTitle: 'Similar Models Compared: 795 vs. 995 & 791',
    koSub: '구조·내후성 겸용(795), 고강도 구조 전용(995), 커튼월 내후성 전용(791)의 대표 사양을 비교합니다.',
    enSub: 'Compare dual-purpose 795 against structural-focused 995 and weatherseal-focused 791.',
  },
  'dowsil-789': {
    slugs: ['dowsil-789', 'dowsil-791', 'dowsil-795'],
    koTitle: '유사 내후성 모델 비교: 789 ↔ 791 · 795',
    enTitle: 'Similar Weatherseal Models Compared: 789 vs. 791 & 795',
    koSub: '1액형 중성 내후성 실란트 789·791과 구조 겸용 795의 경화시간·물성·규격을 비교합니다.',
    enSub: 'Compare one-part neutral weatherproofing sealants 789 and 791 alongside dual-duty 795.',
  },
  'dowsil-791': {
    slugs: ['dowsil-791', 'dowsil-789', 'dowsil-795'],
    koTitle: '유사 내후성 모델 비교: 791 ↔ 789 · 795',
    enTitle: 'Similar Weatherseal Models Compared: 791 vs. 789 & 795',
    koSub: '커튼월 웨더실링용 791, 일반 내후성 789, 구조·내후 겸용 795의 카탈로그 대표 사양 비교입니다.',
    enSub: 'Compare curtain wall weatherseal 791 with general weatherseal 789 and dual-duty 795.',
  },
  'dowsil-888': {
    slugs: ['dowsil-888', 'dowsil-890-sl', 'dowsil-902-rcs'],
    koTitle: '토목 도로 조인트 비교: 888 ↔ 890-SL · 902 RCS',
    enTitle: 'Pavement & Bridge Joint Sealants: 888 vs. 890-SL & 902 RCS',
    koSub: '비흐름성 1액형(888), 자기수평 1액형(890-SL), 교량용 속경화 2액형(902 RCS)의 카탈로그 사양 비교입니다.',
    enSub: 'Compare non-sag one-part 888, self-leveling one-part 890-SL and rapid-cure two-part 902 RCS.',
  },
  'dowsil-890-sl': {
    slugs: ['dowsil-890-sl', 'dowsil-888', 'dowsil-902-rcs'],
    koTitle: '토목 도로 조인트 비교: 890-SL ↔ 888 · 902 RCS',
    enTitle: 'Pavement & Bridge Joint Sealants: 890-SL vs. 888 & 902 RCS',
    koSub: '자기수평 890-SL과 비흐름성 888, 교량 신축이음용 902 RCS의 경도·신율·움직임 허용치를 비교합니다.',
    enSub: 'Compare self-leveling 890-SL against non-sag 888 and bridge expansion sealant 902 RCS.',
  },
  'dowsil-650-plus': {
    slugs: ['dowsil-650-plus', 'dowsil-allguard'],
    koTitle: '외장 코팅 비교: 650+ (임시 박리형) ↔ ALLGUARD (방수 코팅)',
    enTitle: 'Façade Coatings Compared: 650+ (Peelable) vs. ALLGUARD (Waterproof)',
    koSub: '시공 중 임시 보호 후 박리하는 650+와 외벽 영구 방수용 ALLGUARD 코팅의 사양 차이를 비교합니다.',
    enSub: 'Compare temporary peelable protection coating 650+ with permanent elastomeric wall coating ALLGUARD.',
  },
  'dowsil-firestop-700': {
    slugs: ['dowsil-firestop-700', 'dowsil-791', 'dowsil-813c'],
    koTitle: '내화 vs 일반 건축 조인트 비교: FIRESTOP 700 ↔ 791 · 813C',
    enTitle: 'Fire-Rated vs. Standard Joint Sealants: FIRESTOP 700 vs. 791 & 813C',
    koSub: '내화 구획용 FIRESTOP 700과 일반 외장/콘크리트 내후성 실란트(791·813C)의 대표 특성을 비교합니다.',
    enSub: 'Compare fire-rated FIRESTOP 700 with standard weatherseal 791 and concrete sealant 813C.',
  },
  'dowsil-977': {
    slugs: ['dowsil-977', 'dowsil-991', 'dowsil-791'],
    koTitle: '석재·외장 실란트 비교: 977 ↔ 991 · 791',
    enTitle: 'Stone & Façade Sealants Compared: 977 vs. 991 & 791',
    koSub: '다공성 석재 오염 저감 실란트(977·991)와 일반 커튼월 웨더실(791)의 대표 사양을 비교합니다.',
    enSub: 'Compare low-staining stone sealants (977, 991) with general curtain wall sealant 791.',
  },
  'dowsil-991': {
    slugs: ['dowsil-991', 'dowsil-977', 'dowsil-791'],
    koTitle: '석재·외장 실란트 비교: 991 ↔ 977 · 791',
    enTitle: 'Stone & Façade Sealants Compared: 991 vs. 977 & 791',
    koSub: '천연석 비오염 중모듈러스 실란트 991·977과 커튼월 웨더실 791의 카탈로그 수치를 비교합니다.',
    enSub: 'Compare non-staining stone sealants 991 and 977 alongside curtain wall sealant 791.',
  },
  'dowsil-121': {
    slugs: ['dowsil-121', 'dowsil-983', 'dowsil-995'],
    koTitle: '구조용 보수·공장·현장 비교: 121 ↔ 983 · 995',
    enTitle: 'Structural Repair vs. Factory & 1-Part: 121 vs. 983 & 995',
    koSub: '보수용 속경화 2액형(121), 공장용 2액형(983), 1액형 구조용(995)의 경화·혼합 사양을 비교합니다.',
    enSub: 'Compare fast two-part repair sealant 121 with factory two-part 983 and one-part 995.',
  },
  'dowsil-813c': {
    slugs: ['dowsil-813c', 'dowsil-791', 'dowsil-1001'],
    koTitle: '건축 조인트 실란트 비교: 813C ↔ 791 · 1001',
    enTitle: 'Building Joint Sealants Compared: 813C vs. 791 & 1001',
    koSub: '콘크리트·조적용 813C, 커튼월용 791, 주거 창호 페리미터용 1001의 대표 특성을 비교합니다.',
    enSub: 'Compare concrete/masonry 813C, curtain wall 791 and residential perimeter 1001.',
  },
  'dowsil-1001': {
    slugs: ['dowsil-1001', 'dowsil-789', 'dowsil-813c'],
    koTitle: '창호·외장 실란트 비교: 1001 ↔ 789 · 813C',
    enTitle: 'Perimeter & Façade Sealants Compared: 1001 vs. 789 & 813C',
    koSub: '창호 페리미터용 1001, 일반 글레이징 789, 콘크리트·조적용 813C의 사양을 비교합니다.',
    enSub: 'Compare window perimeter 1001 with general glazing 789 and concrete/masonry 813C.',
  },
  'dowsil-double-n': {
    slugs: ['dowsil-double-n', 'dowsil-789', 'dowsil-sanitary'],
    koTitle: '범용·실내외 실란트 비교: Double-N ↔ 789 · Sanitary',
    enTitle: 'General & Sanitary Sealants Compared: Double-N vs. 789 & Sanitary',
    koSub: '범용 중성 Double-N, 외장 내후성 789, 욕실·주방용 Sanitary의 카탈로그 특성을 비교합니다.',
    enSub: 'Compare general-purpose Double-N with weatherseal 789 and mould-resistant Sanitary.',
  },
  'dowsil-sanitary': {
    slugs: ['dowsil-sanitary', 'dowsil-786-plus', 'dowsil-double-n'],
    koTitle: '위생·욕실 실란트 비교: Sanitary ↔ 786+ · Double-N',
    enTitle: 'Sanitary & Hygienic Sealants: Sanitary vs. 786+ & Double-N',
    koSub: '중성 욕실용 Sanitary, 아세톡시 FDA 적합 786+, 범용 중성 Double-N의 경화방식과 물성을 비교합니다.',
    enSub: 'Compare neutral Sanitary, acetoxy FDA-compliant 786+ and general-purpose Double-N.',
  },
  'dowsil-786-plus': {
    slugs: ['dowsil-786-plus', 'dowsil-sanitary', 'dowsil-se-5088'],
    koTitle: 'GMP·위생 실란트 비교: 786+ ↔ Sanitary · SE 5088',
    enTitle: 'Hygienic & Cleanroom Sealants: 786+ vs. Sanitary & SE 5088',
    koSub: 'FDA 위생용 아세톡시(786+), 욕실 중성(Sanitary), 클린룸 저휘발(SE 5088)의 사양을 비교합니다.',
    enSub: 'Compare FDA hygienic acetoxy 786+, neutral Sanitary and low-volatile cleanroom SE 5088.',
  },
  'dowsil-se-5088': {
    slugs: ['dowsil-se-5088', 'dowsil-786-plus'],
    koTitle: 'GMP·클린룸 실란트 비교: SE 5088 ↔ 786+',
    enTitle: 'Cleanroom vs. Hygienic Sealants: SE 5088 vs. 786+',
    koSub: '클린룸 저휘발 중성 SE 5088과 식품·위생 아세톡시 786+의 카탈로그 물성을 비교합니다.',
    enSub: 'Compare low-volatile cleanroom SE 5088 with FDA hygienic acetoxy 786+.',
  },
  'dowsil-902-rcs': {
    slugs: ['dowsil-902-rcs', 'dowsil-890-sl', 'dowsil-888'],
    koTitle: '토목 신축이음 비교: 902 RCS ↔ 890-SL · 888',
    enTitle: 'Civil Joint Sealants Compared: 902 RCS vs. 890-SL & 888',
    koSub: '교량용 속경화 2액형 902 RCS와 도로 포장용 1액형(890-SL·888)의 카탈로그 특성을 비교합니다.',
    enSub: 'Compare rapid-cure two-part 902 RCS with one-part pavement sealants 890-SL and 888.',
  },
  'dowsil-335': {
    slugs: ['dowsil-335', 'dowsil-939', 'dowsil-982'],
    koTitle: '복층유리 1차·2차 씰 비교: 335 ↔ 939 · 982',
    enTitle: 'IG Primary & Secondary Seals: 335 vs. 939 & 982',
    koSub: '복층유리 1차 부틸(335)과 2차 실리콘 2액형(939·982)의 역할과 카탈로그 사양을 비교합니다.',
    enSub: 'Compare primary butyl seal 335 with two-part silicone secondary sealants 939 and 982.',
  },
  'dowsil-939': {
    slugs: ['dowsil-939', 'dowsil-982', 'dowsil-983'],
    koTitle: '복층유리 2액형 비교: 939 ↔ 982 · 983',
    enTitle: 'Two-Part IG & Glazing Sealants: 939 vs. 982 & 983',
    koSub: '주거용 복층유리 2차 씰(939), 구조 지지 가능 2차 씰(982), 공장 구조용(983)의 사양을 비교합니다.',
    enSub: 'Compare residential IG secondary 939, structural-capable 982 and factory structural 983.',
  },
  'dowsil-982': {
    slugs: ['dowsil-982', 'dowsil-939', 'dowsil-983'],
    koTitle: '복층유리·구조 2액형 비교: 982 ↔ 939 · 983',
    enTitle: 'Two-Part IG & Glazing Sealants: 982 vs. 939 & 983',
    koSub: '구조 지지 가능 2차 씰(982), 주거용 2차 씰(939), 공장 구조 글레이징(983)의 사양을 비교합니다.',
    enSub: 'Compare structural-capable IG secondary 982 with residential 939 and structural 983.',
  },
  'dowsil-rtv-hi-temp': {
    slugs: ['dowsil-rtv-hi-temp', 'dowsil-firestop-700'],
    koTitle: '특수 고온·내화 실리콘 비교: Hi-Temp ↔ FIRESTOP 700',
    enTitle: 'High-Temperature vs. Fire-Rated Silicones: Hi-Temp vs. FIRESTOP 700',
    koSub: '연속 260°C 내열 아세톡시(Hi-Temp)와 건축 방화구획 내화 중성(FIRESTOP 700)의 차이를 비교합니다.',
    enSub: 'Compare 260°C heat-resistant acetoxy Hi-Temp with neutral fire-rated FIRESTOP 700.',
  },
  'dowsil-allguard': {
    slugs: ['dowsil-allguard', 'dowsil-allguard-primer', 'dowsil-650-plus'],
    koTitle: '코팅·프라이머 비교: ALLGUARD ↔ ALLGUARD Primer · 650+',
    enTitle: 'Coatings & Primer Compared: ALLGUARD vs. ALLGUARD Primer & 650+',
    koSub: '외벽 방수 코팅(ALLGUARD), 전용 수성 프라이머(ALLGUARD Primer), 임시 보호 코팅(650+)을 비교합니다.',
    enSub: 'Compare waterproof coating ALLGUARD, its water-based primer and temporary peelable 650+.',
  },
  'dowsil-123': {
    slugs: ['dowsil-123', 'dowsil-791', 'dowsil-795'],
    koTitle: '프리폼 보수 실 vs 습식 실란트: 123 ↔ 791 · 795',
    enTitle: 'Preformed Repair Seal vs. Wet Sealants: 123 vs. 791 & 795',
    koSub: '압출 프리폼 실(123)과 접착용으로 함께 쓰는 습식 실란트(791·795)의 사양을 비교합니다.',
    enSub: 'Compare preformed silicone seal 123 with bonding wet sealants 791 and 795.',
  },
  'dowsil-375': {
    slugs: ['dowsil-375', 'dowsil-995'],
    koTitle: '글라스 임베딩 vs 구조 실란트: 375 ↔ 995',
    enTitle: 'Glass Embedding vs. Structural Glazing: 375 vs. 995',
    koSub: '글라스 난간 U-프로파일용 2액형 폴리우레탄(375)과 유리 구조 실리콘(995)의 물성 차이를 비교합니다.',
    enSub: 'Compare two-part polyurethane glass embedding 375 with silicone structural sealant 995.',
  },
  'dowsil-primer-c': {
    slugs: ['dowsil-primer-c', 'dowsil-1200-os', 'dowsil-allguard-primer'],
    koTitle: '프라이머 3종 비교: Primer-C ↔ 1200 OS · ALLGUARD Primer',
    enTitle: 'Primers Compared: Primer-C vs. 1200 OS & ALLGUARD Primer',
    koSub: 'Kynar/PVF2 전용 실란 프라이머(Primer-C), 범용(1200 OS), 코팅 전용 수성(ALLGUARD Primer) 비교입니다.',
    enSub: 'Compare PVF2/Kynar silane Primer-C, general-purpose 1200 OS and water-based ALLGUARD Primer.',
  },
  'dowsil-allguard-primer': {
    slugs: ['dowsil-allguard-primer', 'dowsil-primer-c', 'dowsil-1200-os'],
    koTitle: '프라이머 3종 비교: ALLGUARD Primer ↔ Primer-C · 1200 OS',
    enTitle: 'Primers Compared: ALLGUARD Primer vs. Primer-C & 1200 OS',
    koSub: 'ALLGUARD 전용 수성 프라이머와 실란트용 프라이머(Primer-C·1200 OS)의 용도·VOC를 비교합니다.',
    enSub: 'Compare water-based ALLGUARD Primer with sealant primers Primer-C and 1200 OS.',
  },
  'dowsil-1200-os': {
    slugs: ['dowsil-1200-os', 'dowsil-primer-c', 'dowsil-allguard-primer'],
    koTitle: '프라이머 3종 비교: 1200 OS ↔ Primer-C · ALLGUARD Primer',
    enTitle: 'Primers Compared: 1200 OS vs. Primer-C & ALLGUARD Primer',
    koSub: '범용 실리콘 프라이머(1200 OS)와 커튼월 도장면 전용(Primer-C), 코팅용 수성(ALLGUARD Primer) 비교입니다.',
    enSub: 'Compare general-purpose 1200 OS with curtain wall Primer-C and water-based ALLGUARD Primer.',
  },
}

const COMPARE_SPEC_ROWS: { ko: string; en: string; get: (c: CatalogProduct, isEn: boolean) => string | null }[] = [
  { ko: '제품 유형', en: 'Product type', get: (c, isEn) => localizeCatalog(c, isEn ? 'en' : 'ko').specs[isEn ? 'Product type' : '제품 유형'] ?? null },
  { ko: '혼합 비율', en: 'Mix ratio', get: (c, isEn) => localizeCatalog(c, isEn ? 'en' : 'ko').specs[isEn ? 'Mix ratio' : '혼합 비율'] ?? null },
  { ko: '움직임 허용치', en: 'Movement capability', get: (c, isEn) => localizeCatalog(c, isEn ? 'en' : 'ko').specs[isEn ? 'Movement capability' : '움직임 허용치'] ?? null },
  { ko: '경도', en: 'Hardness', get: pickHardness },
  {
    ko: '인장강도',
    en: 'Tensile strength',
    get: (c, isEn) => {
      const sp = localizeCatalog(c, isEn ? 'en' : 'ko').specs
      return isEn ? (sp['Ultimate tensile strength'] ?? sp['Tensile strength'] ?? null) : (sp['최대 인장강도'] ?? sp['인장강도'] ?? null)
    },
  },
  {
    ko: '신율',
    en: 'Elongation',
    get: (c, isEn) => {
      const sp = localizeCatalog(c, isEn ? 'en' : 'ko').specs
      return isEn ? (sp['Ultimate elongation'] ?? sp['Elongation'] ?? sp['Joint elongation'] ?? null) : (sp['최대 신율'] ?? sp['신율'] ?? sp['조인트 신율'] ?? null)
    },
  },
  {
    ko: '표면경화 · 택프리',
    en: 'Skin-over / tack-free',
    get: (c, isEn) => {
      const sp = localizeCatalog(c, isEn ? 'en' : 'ko').specs
      return isEn
        ? (sp['Skin-over / tack-free time'] ?? sp['Skin-over / Tack-free'] ?? sp['Skin-over time'] ?? sp['Tack-free time'] ?? sp['Tack free time'] ?? null)
        : (sp['표면경화시간'] ?? sp['Skin-over / Tack-free'] ?? sp['Skin-over time'] ?? sp['Tack-free time'] ?? sp['Tack free time'] ?? null)
    },
  },
  { ko: '가사시간', en: 'Working time', get: (c, isEn) => localizeCatalog(c, isEn ? 'en' : 'ko').specs[isEn ? 'Working time' : '가사시간'] ?? null },
  {
    ko: '완전경화 · 취급시간',
    en: 'Full cure / handling',
    get: (c, isEn) => {
      const sp = localizeCatalog(c, isEn ? 'en' : 'ko').specs
      return isEn
        ? (sp['Full cure time'] ?? sp['Unit handling time'] ?? sp['Cure time'] ?? sp['Drying time'] ?? null)
        : (sp['완전경화시간'] ?? sp['Unit handling time'] ?? sp['경화시간'] ?? sp['건조 시간'] ?? null)
    },
  },
  {
    ko: 'VOC',
    en: 'VOC',
    get: (c, isEn) => {
      const sp = localizeCatalog(c, isEn ? 'en' : 'ko').specs
      return isEn ? (sp['VOC'] ?? sp['VOC content'] ?? sp['VOC (mixed)'] ?? null) : (sp['VOC'] ?? sp['VOC 함량'] ?? sp['VOC (혼합)'] ?? null)
    },
  },
  {
    ko: '내화 · 사용 온도',
    en: 'Fire / service temp.',
    get: (c, isEn) => {
      const sp = localizeCatalog(c, isEn ? 'en' : 'ko').specs
      return isEn ? (sp['Fire resistance'] ?? sp['Service temperature'] ?? null) : (sp['내화 성능'] ?? sp['사용 온도'] ?? null)
    },
  },
  {
    ko: '적용 규격',
    en: 'Standards',
    get: (c, isEn) => {
      const sp = localizeCatalog(c, isEn ? 'en' : 'ko').specs
      return isEn ? (sp['Standards'] ?? null) : (sp['적용 규격'] ?? sp['규격'] ?? null)
    },
  },
  { ko: '색상 · 외관', en: 'Colors / appearance', get: pickColor },
  { ko: '포장', en: 'Packaging', get: (c, isEn) => localizeCatalog(c, isEn ? 'en' : 'ko').specs[isEn ? 'Packaging' : '포장'] ?? null },
  { ko: '유효기간', en: 'Shelf life', get: pickShelfLife },
]

export function productComparison(slug: string, lang: 'ko' | 'en'): MiniComparison | null {
  const cfg = COMPARE_GROUPS[slug]
  if (!cfg) return null
  const isEn = lang === 'en'
  const items = cfg.slugs.map((s) => bySlug(s)).filter((x): x is CatalogProduct => !!x)
  if (items.length < 2) return null

  const inquire = isEn ? 'Inquire' : '문의'
  const rows = COMPARE_SPEC_ROWS
    .map((r) => {
      const raw = items.map((c) => r.get(c, isEn))
      if (!raw.some((v) => v !== null)) return null
      return {
        label: isEn ? r.en : r.ko,
        values: raw.map((v) => v ?? inquire),
      }
    })
    .filter((x): x is { label: string; values: string[] } => !!x)

  return {
    title: isEn ? cfg.enTitle : cfg.koTitle,
    subtitle: isEn ? cfg.enSub : cfg.koSub,
    columns: items.map((c) => ({ slug: c.slug, name: c.name, isCurrent: c.slug === slug })),
    rows,
  }
}

// ───────── 제품별 심화 실무 가이드 (핵심 10종 개별 심화 + 나머지 20종 카탈로그 기반 자동 생성) ─────────
export interface ProductDeepGuide {
  heading: string
  intro: string
  selectionTitle: string
  selectionPoints: string[]
  handlingTitle: string
  handlingPoints: string[]
  companionSlugs?: { slug: string; note: string }[]
}

const CORE10_GUIDE: Record<string, { ko: ProductDeepGuide; en: ProductDeepGuide }> = {
  'dowsil-993': {
    ko: {
      heading: 'DOWSIL™ 993 현장 선정·공장 적용 가이드',
      intro: '유럽(EOTA) 및 중국 GB 16776 구조 글레이징 규격을 충족해야 하는 커튼월 유닛 공장 생산에 맞춘 2액형 중성 구조 실란트입니다.',
      selectionTitle: '선정 포인트 및 적용 기재',
      selectionPoints: [
        '유럽 EOTA 구조 글레이징 기준과 중국 GB 16776 규격을 만족하여 해외 프로젝트·수출용 커튼월 유닛 시방에 폭넓게 검토됩니다.',
        '코팅 유리·에나멜 유리·반사유리, 아노다이징 및 폴리에스터 도장 알루미늄, 스테인리스 스틸 등 다양한 파사드 기재에 우수한 접착을 보입니다.',
        'PVF2(Kynar)계 도장면이나 폴리에스터 분체도장 알루미늄의 접착 촉진이 필요할 때는 전용 실란 프라이머인 DOWSIL™ Primer-C 적용을 검토합니다.',
        '카탈로그 기준 포장 단위와 유효기간·움직임 허용치는 미기재(문의)이므로 프로젝트 발주 전 최신 TDS와 KCT 확인이 필요합니다.',
      ],
      handlingTitle: '2액형 혼합·경화 및 검토 주의사항',
      handlingPoints: [
        '주제:경화제 혼합 비율은 9:1~12:1이며, 주제와 경화제의 Lot 매칭이 불필요해 대량 생산 라인 운영에 유리합니다.',
        '혼합 후 비중 1.33의 흑색 비흐름성 페이스트를 형성하며, 가사시간 10~30분·Tack-free 80~100분·경도 Shore A 40·사용 온도 -50~150°C입니다.',
        '2액형 구조 실란트는 정량·무기포 혼합 토출 설비가 필요하며, 모든 구조 글레이징 적용은 Dow 기술진의 도면·기재 사전 검토를 거쳐야 합니다.',
      ],
      companionSlugs: [
        { slug: 'dowsil-primer-c', note: 'PVF2(Kynar)·폴리에스터 분체도장 접착 촉진용 전용 프라이머' },
        { slug: 'dowsil-983', note: 'ASTM C1184 기준 공장 구조 글레이징 대안 비교' },
      ],
    },
    en: {
      heading: 'DOWSIL™ 993 Selection & Factory Application Guide',
      intro: 'A two-part neutral structural glazing silicone engineered for factory curtain-wall unit production requiring European EOTA and Chinese GB 16776 compliance.',
      selectionTitle: 'Selection points & substrates',
      selectionPoints: [
        'Meets European (EOTA) structural glazing guidelines and Chinese GB 16776, making it a primary candidate for international curtain wall specifications.',
        'Adheres well to coated, enamelled and reflective glass, anodized and polyester-coated aluminum, and stainless steel.',
        'For PVF2 (Kynar) paints or polyester powder-coated aluminum, DOWSIL™ Primer-C is Dow’s dedicated silane primer for 983/993/993N structural glazing.',
        'Packaging format, shelf life and movement capability are not listed in the summarized catalog (Inquire) — confirm via the latest TDS and KCT before ordering.',
      ],
      handlingTitle: 'Two-part mixing, cure & review notes',
      handlingPoints: [
        'Mix ratio is 9:1 to 12:1 (base to curing agent) and lot matching between base and curing agent is not necessary.',
        'Cures to a black non-slump elastomer (mixed SG 1.33, Shore A 40, service temp. -50 to 150°C) with 10–30 min working time and 80–100 min tack-free time.',
        'Requires metered, air-free two-part dispensing equipment; all structural glazing uses require pre-testing and design review by Dow technical staff.',
      ],
      companionSlugs: [
        { slug: 'dowsil-primer-c', note: 'Dedicated silane primer for PVF2 (Kynar) and powder-coated frames' },
        { slug: 'dowsil-983', note: 'Compare with ASTM C1184 two-part factory structural sealant' },
      ],
    },
  },
  'dowsil-995': {
    ko: {
      heading: 'DOWSIL™ 995 현장·공장 구조 글레이징 가이드',
      intro: '별도의 2액 혼합 설비 없이 공장 또는 현장에서 유리·금속을 고강도로 구조 접합할 때 선택하는 1액형 중성 스트럭추럴 글레이징 실란트입니다.',
      selectionTitle: '선정 포인트 및 적용 기재',
      selectionPoints: [
        '경도 Shore A 40, 최대 인장강도 23 kg/cm², 인열강도(Die B) 8.8 kg/cm, 박리 강도 7.2 kg/cm의 고모듈러스 탄성체를 형성하며 KS F 4910 규격에 대응합니다.',
        '유리·반사유리·아노다이징 알루미늄·화강석·불소수지 도장 자재 등 대부분의 건축 자재에 프라이머 없이 우수한 접착을 보입니다.',
        '장기 UV 촉진 내후성 시험(QUV 4,500시간) 후에도 물성을 유지하며, 카탈로그 기준 색상은 Black, 유효기간은 18개월(32°C 이하 보관)입니다.',
        '구조 성능과 ±50% 웨더실링 움직임을 동시에 요구한다면 1액형 겸용 모델인 DOWSIL™ 795와 비교해 선정합니다.',
      ],
      handlingTitle: '양생 일정 및 구조 검토 사항',
      handlingPoints: [
        '가사시간 10~20분, 표면경화 1.5시간(25°C, 50% RH), 완전경화 7~14일, 완전 접착시간 14~21일이 소요되므로 이동·하중 인가 일정을 여유 있게 계획해야 합니다.',
        '1액형 습기 경화 제품이므로 32°C 이하에 보관하고 유효기간(18개월)을 확인한 뒤 시공합니다.',
        '구조 글레이징 적용 전에는 반드시 Dow의 기재별 접착 사전 시험과 조인트 도면 검토가 필요합니다.',
      ],
      companionSlugs: [
        { slug: 'dowsil-795', note: '구조용(ASTM C1184) + ±50% 내후성 겸용 1액형 대안' },
        { slug: 'dowsil-1200-os', note: '접착 시험에서 프라이머가 필요한 기재용 범용 프라이머' },
      ],
    },
    en: {
      heading: 'DOWSIL™ 995 Factory & Field Structural Glazing Guide',
      intro: 'A high-strength, one-part neutral structural glazing silicone selected when factory or on-site structural bonding of glass and metal is required without two-part metering equipment.',
      selectionTitle: 'Selection points & substrates',
      selectionPoints: [
        'Cures to a high-modulus elastomer (Shore A 40, ultimate tensile 23 kg/cm², Die B tear 8.8 kg/cm, peel 7.2 kg/cm) conforming to KS F 4910.',
        'Provides primerless adhesion to glass, reflective glass, anodized aluminum, granite and fluoropolymer-coated materials.',
        'Retains properties after 4,500 hours of QUV accelerated weathering; catalog lists Black color and 18-month shelf life (at ≤32°C).',
        'Where ±50% weatherseal movement is also required from a single one-part product, compare with DOWSIL™ 795.',
      ],
      handlingTitle: 'Curing schedule & Dow review requirements',
      handlingPoints: [
        'Working time is 10–20 min, skin-over 1.5 h (25°C, 50% RH), full cure 7–14 days and full adhesion 14–21 days — allow full adhesion build-up before loading.',
        'Store at or below 32°C and verify the 18-month shelf life before installation.',
        'Pre-testing on project substrates and drawing review by Dow are required prior to structural glazing use.',
      ],
      companionSlugs: [
        { slug: 'dowsil-795', note: 'One-part ASTM C1184 structural + ±50% weatherseal alternative' },
        { slug: 'dowsil-1200-os', note: 'General-purpose primer if adhesion testing indicates priming' },
      ],
    },
  },
  'dowsil-795': {
    ko: {
      heading: 'DOWSIL™ 795 구조·내후성 겸용 선정 가이드',
      intro: '단일 1액형 중성 실란트로 커튼월 구조 글레이징(ASTM C1184)과 ±50% 외장 웨더실링(ASTM C719 Class 50)을 모두 대응할 수 있는 대표 건축용 제품입니다.',
      selectionTitle: '선정 포인트 및 적용 기재',
      selectionPoints: [
        'ASTM C1184 구조용 글레이징 규격과 ASTM C719 Class 50(±50% 움직임)을 함께 만족해 구조 접합과 내후 실링 공정을 단일 자재로 통합할 수 있습니다.',
        '유리·아노다이징 알루미늄·코팅 알루미늄에 중성 경화로 부식 없이 접착하며, VOC 32 g/L·경도 Shore A 35·최대 인장강도 2.3 MPa(7일)·최대 신율 670%(7일)입니다.',
        '카탈로그 요약본에는 색상·포장·유효기간이 미기재(문의) 상태이므로, 현장 발주 전 최신 TDS와 KCT를 통해 공급 가능 색상과 포장을 확인해 주십시오.',
      ],
      handlingTitle: '경화 특성 및 시공 확인사항',
      handlingPoints: [
        '표면경화시간은 1.5시간 이내(25°C, 50% RH), 완전경화시간은 7~14일입니다.',
        '구조 글레이징 용도로 사용할 경우에는 Dow 기술진의 사전 도면 검토와 기재 접착 시험을 거쳐야 합니다.',
        '순수 고강도 구조 접합 위주라면 DOWSIL™ 995, 비구조 외장 웨더실링 전용이라면 DOWSIL™ 791·789와 비교해 최적 모델을 고릅니다.',
      ],
      companionSlugs: [
        { slug: 'dowsil-995', note: '고모듈러스(Shore A 40) 1액형 구조 글레이징 전용' },
        { slug: 'dowsil-791', note: '커튼월 외장 웨더실링 전용 1액형 (±50%)' },
      ],
    },
    en: {
      heading: 'DOWSIL™ 795 Dual-Duty Structural & Weatherseal Guide',
      intro: 'A versatile one-part neutral silicone combining ASTM C1184 structural glazing capability with ±50% ASTM C719 Class 50 weatherproofing movement.',
      selectionTitle: 'Selection points & substrates',
      selectionPoints: [
        'Simplifies factory and field curtain wall jobs by covering both ASTM C1184 structural glazing and ±50% movement weatherproofing in one product.',
        'Non-corrosive neutral cure with excellent adhesion to glass, anodized aluminum and coated aluminum; Shore A 35, 2.3 MPa tensile (7 d), 670% elongation (7 d) and 32 g/L VOC.',
        'Colors, packaging and shelf life are not listed in the summarized catalog (Inquire) — confirm available colors and pack sizes with KCT and the TDS PDF.',
      ],
      handlingTitle: 'Cure profile & application checks',
      handlingPoints: [
        'Skin-over occurs within 1.5 h (25°C, 50% RH) and full cure takes 7–14 days.',
        'Any structural glazing application requires Dow technical staff review and substrate adhesion testing.',
        'Compare with DOWSIL™ 995 for higher-modulus structural duty or DOWSIL™ 791/789 for non-structural weatherproofing.',
      ],
      companionSlugs: [
        { slug: 'dowsil-995', note: 'Higher-modulus (Shore A 40) dedicated structural sealant' },
        { slug: 'dowsil-791', note: 'Dedicated curtain wall weatherseal (±50%)' },
      ],
    },
  },
  'dowsil-789': {
    ko: {
      heading: 'DOWSIL™ 789 일반·비구조 내후성 시공 가이드',
      intro: '코팅 알루미늄을 포함한 다양한 건축 외장 자재에 프라이머 없이 접착되도록 설계된 1액형 중성 내후성 실란트입니다.',
      selectionTitle: '선정 포인트 및 적용 기재',
      selectionPoints: [
        '일반 글레이징 및 비구조용 글레이징 내후 실링에 적합하며 유리·반사유리·세라믹·아노다이징/코팅 알루미늄·철판 접합부에 중성 경화로 부식 없이 적용합니다.',
        '움직임 허용치 ±50%, 경도 Shore A 28, 최대 신율 700%, 탄성 유지 온도 -50°C~+150°C이며 KS F 4910-2000 F25LM 규격을 만족합니다.',
        '카탈로그 기준 Black, Gray, Bronze, Limestone, Precast White, White 6색과 특수 색상 대응이 기재되어 있습니다(포장·유효기간은 문의).',
      ],
      handlingTitle: '작업성·경화 및 비교 선정',
      handlingPoints: [
        '가사시간 15~30분, 표면경화시간 80분 미만(25°C, 50% RH), 완전경화시간 7~14일로 공장·현장 모두 안정적인 툴링 여유를 제공합니다.',
        '비구조용 내후성 제품이므로 하중을 지지하는 구조 글레이징에는 DOWSIL™ 795 또는 995를 검토해야 합니다.',
        '다공성 석재·갈바나이즈 스틸 포함 국제 규격(ASTM C920·ISO 11600·EN 15651)이 요구되는 커튼월 외장에는 DOWSIL™ 791과 비교해 선택합니다.',
      ],
      companionSlugs: [
        { slug: 'dowsil-791', note: 'ASTM C920·ISO 11600·EN 15651 대응 커튼월 웨더실' },
        { slug: 'dowsil-991', note: '천연석 비오염이 중요한 파사드용 중모듈러스' },
      ],
    },
    en: {
      heading: 'DOWSIL™ 789 Weatherproofing Application Guide',
      intro: 'A one-part neutral-cure weatherproofing silicone formulated for primerless adhesion to coated aluminum and common glazing substrates in factory or field applications.',
      selectionTitle: 'Selection points & substrates',
      selectionPoints: [
        'Designed for general and non-structural glazing weather seals on glass, reflective glass, ceramic, anodized/coated aluminum and steel without metal corrosion.',
        'Delivers ±50% movement capability, Shore A 28 hardness, 700% ultimate elongation and -50°C to +150°C elasticity; conforms to KS F 4910-2000 F25LM.',
        'Catalog lists 6 standard colors (Black, Gray, Bronze, Limestone, Precast White, White) plus special colors; confirm packaging and shelf life with KCT.',
      ],
      handlingTitle: 'Workability, cure & alternatives',
      handlingPoints: [
        'Working time is 15–30 min, skin-over under 80 min (25°C, 50% RH) and full cure 7–14 days.',
        'Intended for non-structural weather sealing — choose DOWSIL™ 795 or 995 where structural glazing performance is specified.',
        'Compare with DOWSIL™ 791 when ASTM C920, ISO 11600 or EN 15651-1/2 specifications and porous stone compatibility are required.',
      ],
      companionSlugs: [
        { slug: 'dowsil-791', note: 'Curtain wall weatherseal meeting ASTM C920 & ISO 11600' },
        { slug: 'dowsil-991', note: 'Non-staining option for sensitive natural stone façades' },
      ],
    },
  },
  'dowsil-791': {
    ko: {
      heading: 'DOWSIL™ 791 커튼월·외장 웨더실링 가이드',
      intro: '커튼월 외장, 익스팬션·연결·페리미터 조인트의 비구조 웨더실링을 위해 국제·국내 주요 내후성 규격을 폭넓게 충족하는 1액형 중성 실란트입니다.',
      selectionTitle: '선정 포인트 및 적용 기재',
      selectionPoints: [
        'ASTM C920 Type S Grade NS Class 50, ISO 11600 F&G-25LM, KS F4910 F-25LM, EN 15651-1/2 규격을 충족해 국내외 시방 대응력이 높습니다.',
        '비흐름성으로 압출성이 우수하며 코팅 유리·갈바나이즈 스틸·석재 등 다공성 및 비다공성 건축 자재에 폭넓게 적용합니다.',
        '움직임 허용치 ±50%, 경도 Shore A 25~30, VOC 함량 45 g/L이며, 색상·포장·유효기간은 카탈로그 미기재(문의)이므로 KCT와 최신 TDS로 확인합니다.',
      ],
      handlingTitle: '시공 온도·경화 및 대안 검토',
      handlingPoints: [
        '적용 온도 4~40°C, 가사시간 20분, 표면경화시간 45분(25°C, 50% RH), 완전경화시간 7~14일입니다.',
        '화강석·천연석의 유체 이행 오염 저감(ASTM C1248 None)이 최우선이라면 DOWSIL™ 977 또는 991을 검토합니다.',
        '프리폼 실리콘 실(DOWSIL™ 123) 보수 시공 시 동일 색상 접착 실란트로도 활용됩니다.',
      ],
      companionSlugs: [
        { slug: 'dowsil-789', note: '일반 글레이징·코팅 알루미늄용 무프라이머 내후성' },
        { slug: 'dowsil-991', note: '천연석 비오염(ASTM C1248 None) 중모듈러스 실란트' },
      ],
    },
    en: {
      heading: 'DOWSIL™ 791 Curtain Wall Weatherproofing Guide',
      intro: 'A non-sag one-part neutral silicone built for curtain wall exteriors and moving façade joints with broad ASTM, ISO, KS and EN compliance.',
      selectionTitle: 'Selection points & substrates',
      selectionPoints: [
        'Meets ASTM C920 Type S Grade NS Class 50, ISO 11600 F&G-25LM, KS F4910 F-25LM and EN 15651-1/2.',
        'Non-sagging with strong extrudability across both porous and non-porous substrates, including coated glass, galvanized steel and stone.',
        '±50% movement capability, Shore A 25–30 hardness and 45 g/L VOC; confirm colors, packaging and shelf life with KCT and the TDS PDF.',
      ],
      handlingTitle: 'Application window, cure & alternatives',
      handlingPoints: [
        'Application temperature 4–40°C, working time 20 min, skin-over 45 min (25°C, 50% RH) and full cure 7–14 days.',
        'For sensitive natural stone requiring ASTM C1248 non-staining performance, compare with DOWSIL™ 977 or 991.',
        'Also used as a bonding sealant alongside DOWSIL™ 123 preformed silicone seals for joint remediation.',
      ],
      companionSlugs: [
        { slug: 'dowsil-789', note: 'General glazing weatherseal with 6 catalog colors' },
        { slug: 'dowsil-991', note: 'Non-staining (ASTM C1248 None) façade sealant for stone' },
      ],
    },
  },
  'dowsil-983': {
    ko: {
      heading: 'DOWSIL™ 983 공장 글레이징·커튼월 생산 가이드',
      intro: '커튼월 유닛 공장 생산에서 빠른 유닛 취급과 구조·웨더실 겸용 성능(ASTM C1184, ±25%)이 필요한 라인에 적용하는 2액형 중성 RTV 실리콘입니다.',
      selectionTitle: '선정 포인트 및 적용 기재',
      selectionPoints: [
        'ASTM C1184 구조 글레이징과 ASTM C719 Class 25(±25% 움직임) 웨더실 용도로 승인되었으며, 혼합 시 VOC 18 g/L 미만으로 저VOC 특성을 갖습니다.',
        '유리·알로다인·아노다이징 알루미늄에 우수한 접착을 보이며, Kynar 등 PVF2 도장면에는 Primer-C 계열 프라이머 사용이 권장됩니다.',
        '카탈로그 기준 20년 보증이 가능한 제품군으로 안내되나, 모든 구조 적용 및 보증은 Dow 기술진의 프로젝트별 검토를 전제로 합니다.',
      ],
      handlingTitle: '혼합비·유닛 취급시간 및 비교',
      handlingPoints: [
        '혼합 비율은 부피 기준 9:1이며 Base 백색 / Catalyst 흑색 또는 회색 구성으로 혼합 균일도를 육안으로 확인하기 쉽습니다.',
        '가사시간 10~25분, 24°C 기준 Unit handling time 4~24시간, 경도 Shore A 30~40(1일) / 35~45(7일), 최대 인장강도 2.0 MPa(7일)입니다.',
        '유럽 EOTA 또는 중국 GB 16776 규격 대응이 필요한 프로젝트라면 DOWSIL™ 993과 비교해 선정합니다.',
      ],
      companionSlugs: [
        { slug: 'dowsil-993', note: 'EOTA·GB 16776 규격 대응 2액형 구조 실란트' },
        { slug: 'dowsil-primer-c', note: 'PVF2(Kynar) 도장면 접착 촉진용 전용 실란 프라이머' },
      ],
    },
    en: {
      heading: 'DOWSIL™ 983 Factory Glazing & Curtain Wall Guide',
      intro: 'A two-part neutral RTV silicone for factory glazing and unitized curtain wall production requiring fast unit handling and ASTM C1184 / ±25% dual approval.',
      selectionTitle: 'Selection points & substrates',
      selectionPoints: [
        'Approved for structural glazing (ASTM C1184) and ±25% weatherseals (ASTM C719 Class 25 G, A, O), with low mixed VOC (<18 g/L).',
        'Bonds well to glass, alodine and anodized aluminum; Primer-C series is recommended on Kynar / PVF2-painted surfaces.',
        'Catalog notes a 20-year warranty is available subject to mandatory Dow technical staff review and project testing.',
      ],
      handlingTitle: 'Mix ratio, unit handling & alternatives',
      handlingPoints: [
        '9:1 mix ratio by volume (white Base / black or gray Catalyst) aids visual confirmation of thorough mixing.',
        'Working time 10–25 min, unit handling time 4–24 h at 24°C, hardness Shore A 30–40 (1 d) / 35–45 (7 d), tensile strength 2.0 MPa (7 d).',
        'For European EOTA or Chinese GB 16776 specifications, compare with DOWSIL™ 993.',
      ],
      companionSlugs: [
        { slug: 'dowsil-993', note: 'Two-part structural glazing meeting EOTA & GB 16776' },
        { slug: 'dowsil-primer-c', note: 'Dedicated silane primer for Kynar / PVF2 coatings' },
      ],
    },
  },
  'dowsil-888': {
    ko: {
      heading: 'DOWSIL™ 888 콘크리트 포장 조인트 시공 가이드',
      intro: '포틀랜드 시멘트 콘크리트 포장 도로의 신설·보수 조인트에 사용하는 1액형 냉간 시공 비흐름성 실리콘 실란트입니다.',
      selectionTitle: '선정 포인트 및 적용 부위',
      selectionPoints: [
        '비흐름성(Non-sag) 배합이어서 경사가 있거나 폭이 일정하지 않은 콘크리트-콘크리트 포장 조인트 및 경미한 박락 조인트에도 흘러내리지 않고 시공됩니다.',
        '움직임 허용치 +100/-50%(10 cycles), Shore A 경도 15, 최대 신율 1,000% 이상(Die C), 반발 탄성 77%, 가속 내후성 5,000시간 통과 사양을 갖습니다.',
        '단기 연료 노출 저항성이 있으며, 표면이 청결·건조·무서리 상태라면 콘크리트에 별도 프라이머 없이 접착합니다(색상: Gray, 포장·유효기간: 문의).',
      ],
      handlingTitle: '시공 온도·경화 및 890-SL 비교',
      handlingPoints: [
        '-20~120°F(약 -29~49°C)의 넓은 온도 범위에서 냉간 압출 시공이 가능하며, 표면경화 1시간 이내입니다.',
        '비흐름성 특성상 시공 후 적절한 툴링(표면 다듬기)으로 조인트 벽면 밀착을 확보해야 합니다.',
        '툴링 없이 스스로 수평을 맞추고 아스팔트 접합부까지 대응해야 하는 평탄 도로라면 자기수평형 DOWSIL™ 890-SL과 비교해 선택합니다.',
      ],
      companionSlugs: [
        { slug: 'dowsil-890-sl', note: '툴링 불필요 자기수평 콘크리트·아스팔트 조인트용' },
        { slug: 'dowsil-902-rcs', note: '교량·고속도로 25~76mm 신축이음용 속경화 2액형' },
      ],
    },
    en: {
      heading: 'DOWSIL™ 888 Concrete Pavement Joint Guide',
      intro: 'A one-part, cold-applied, non-sag silicone sealant for new and remedial Portland cement concrete pavement joints.',
      selectionTitle: 'Selection points & applications',
      selectionPoints: [
        'Non-sag rheology holds shape in sloped, non-uniform width or minor-spalled concrete-to-concrete pavement joints.',
        'Offers +100/-50% movement (10 cycles), Shore A 15 hardness, ≥1,000% elongation (Die C), 77% resilience and 5,000-hour accelerated weathering pass.',
        'Short-term fuel resistance; primerless on clean, dry, frost-free concrete (Color: Gray; Packaging & Shelf life: Inquire).',
      ],
      handlingTitle: 'Application window & comparison with 890-SL',
      handlingPoints: [
        'Extrudable from -20 to 120°F (approx. -29 to 49°C) with skin-over within 1 hour.',
        'As a non-sag sealant, proper tooling is needed to ensure wetting against the concrete joint walls.',
        'Where no-tooling self-leveling flow or concrete-to-asphalt joints are needed, compare with DOWSIL™ 890-SL.',
      ],
      companionSlugs: [
        { slug: 'dowsil-890-sl', note: 'Self-leveling no-tooling option for concrete & asphalt' },
        { slug: 'dowsil-902-rcs', note: 'Rapid-cure two-part sealant for 25–76 mm bridge joints' },
      ],
    },
  },
  'dowsil-890-sl': {
    ko: {
      heading: 'DOWSIL™ 890-SL 자기수평 도로 조인트 가이드',
      intro: '별도 툴링 없이 조인트 내부로 스스로 흘러 평탄면을 형성하고 콘크리트·아스팔트 포장 조인트를 빠르게 실링하는 1액형 초저모듈러스 실리콘입니다.',
      selectionTitle: '선정 포인트 및 적용 부위',
      selectionPoints: [
        '자기수평(Self-leveling) 유동 특성으로 툴링 공정이 불필요해 불규칙하거나 박락된 포장 조인트에서 시공 속도를 높일 수 있습니다.',
        '콘크리트-콘크리트뿐 아니라 콘크리트-아스팔트 포장 조인트에도 프라이머 없이 적용할 수 있습니다.',
        'Shore A 경도 3~5의 초저모듈러스, 최대 신율 1,400%, 움직임 허용치 +100/-50%(10 cycles), 반발 탄성 77%, 가속 내후성 5,000시간 통과 및 단기 연료 저항을 갖습니다.',
      ],
      handlingTitle: '시공 조건·개통 시간 및 비교',
      handlingPoints: [
        '-20~120°F에서 압출 가능하고 표면경화 1시간 이내로 신속한 도로 개통이 필요한 보수 현장에 유리합니다.',
        '카탈로그 기준 색상은 Dark gray / Light gray이며 포장 단위와 유효기간은 미기재(문의)이므로 발주 전 KCT에 확인해 주십시오.',
        '경사가 커서 자기수평재가 흘러내릴 우려가 있는 구간에는 비흐름성 DOWSIL™ 888, 폭 25~76mm 교량 신축이음에는 속경화 2액형 DOWSIL™ 902 RCS를 비교 검토합니다.',
      ],
      companionSlugs: [
        { slug: 'dowsil-888', note: '경사·비흐름 시공이 필요한 콘크리트 포장용 1액형' },
        { slug: 'dowsil-902-rcs', note: '교량·고속도로 대형 신축이음(25~76mm) 속경화 2액형' },
      ],
    },
    en: {
      heading: 'DOWSIL™ 890-SL Self-Leveling Road Joint Guide',
      intro: 'A one-part, ultra-low-modulus self-leveling silicone that seals concrete and concrete-to-asphalt pavement joints without tooling.',
      selectionTitle: 'Selection points & applications',
      selectionPoints: [
        'Flows naturally into irregular and spalled pavement joints with no tooling step required.',
        'Primerless adhesion to both concrete-to-concrete and concrete-to-asphalt joints.',
        'Ultra-low modulus (Shore A 3–5), 1,400% elongation, +100/-50% movement (10 cycles), 77% resilience, 5,000-hour weathering pass and short-term fuel resistance.',
      ],
      handlingTitle: 'Application, reopening & alternatives',
      handlingPoints: [
        'Extrudable from -20 to 120°F with skin-over within 1 hour for rapid road reopening.',
        'Catalog lists Dark gray / Light gray; confirm packaging and shelf life with KCT.',
        'For sloped joints requiring non-sag behavior, choose DOWSIL™ 888; for 25–76 mm bridge expansion joints, compare with DOWSIL™ 902 RCS.',
      ],
      companionSlugs: [
        { slug: 'dowsil-888', note: 'Non-sag one-part sealant for sloped concrete joints' },
        { slug: 'dowsil-902-rcs', note: 'Rapid-cure two-part bridge/highway expansion sealant' },
      ],
    },
  },
  'dowsil-650-plus': {
    ko: {
      heading: 'DOWSIL™ 650+ 파사드 임시 보호 코팅 적용 가이드',
      intro: '공사 기간 중 커튼월·파사드의 유리·금속·플라스틱 표면을 먼지·오염·그리스·용접 슬래그로부터 보호하고 완료 후 잔여물 없이 벗겨내는 수성 아크릴 박리형 코팅입니다.',
      selectionTitle: '선정 포인트 및 기재 호환성',
      selectionPoints: [
        '반투명 청색 수성 아크릴 액체로 VOC 6 g/L(SCAQMD)·APEO 프리 배합이며, 기재에 침투하거나 손상을 주지 않습니다.',
        '일반적인 DOWSIL 글레이징 실란트와의 상용성(호환성)을 고려해 설계되어 파사드 유리·금속 보호 공정에 연계하기 좋습니다.',
        '장기 UV·풍화 노출 후에도 박리성을 유지하며, 현장 조건에 따라 최대 18개월까지 임시 보호가 가능합니다.',
      ],
      handlingTitle: '도포 두께·온도·박리 시점 확인',
      handlingPoints: [
        '붓·롤러·스프레이로 건조 도막 두께 100 µm 기준 도포하며, 점도 6,000 cps 미만·습윤 비중 1.05 g/ml입니다.',
        '최소 성막 온도(MFFT)가 8.5°C(±2)이므로 동절기 저온 시공 시 기재·외기 온도가 성막 기준을 충족하는지 반드시 확인해야 합니다.',
        '7일 경화 이후 잔여물 없이 손쉽게 박리할 수 있으며, 포장 단위와 유효기간은 카탈로그 미기재(문의)이므로 KCT로 문의해 주십시오.',
      ],
      companionSlugs: [
        { slug: 'dowsil-allguard', note: '임시 보호가 아닌 영구 외벽 방수 코팅 비교' },
        { slug: 'dowsil-791', note: '파사드·커튼월 외장 웨더실링 실란트' },
      ],
    },
    en: {
      heading: 'DOWSIL™ 650+ Peelable Façade Protection Guide',
      intro: 'A waterborne acrylic peelable coating for temporary protection of curtain wall glass, metal and plastic panels against construction dust, stain, grease and weld slag.',
      selectionTitle: 'Selection points & compatibility',
      selectionPoints: [
        'Translucent blue waterborne acrylic liquid with 6 g/L VOC (SCAQMD) and APEO-free formulation that neither penetrates nor damages substrates.',
        'Compatible with common DOWSIL glazing sealants for smooth integration into façade installation workflows.',
        'Maintains clean peelability after extended UV and weather exposure, providing up to 18 months protection depending on conditions.',
      ],
      handlingTitle: 'Application film thickness, MFFT & peeling',
      handlingPoints: [
        'Applied by brush, roller or spray to a 100 µm dry film thickness (viscosity <6,000 cps, wet density 1.05 g/ml).',
        'Minimum film-forming temperature (MFFT) is 8.5°C (±2) — verify ambient and substrate temperatures in cool weather.',
        'Peels cleanly without residue after 7 days cure; confirm packaging and shelf life with KCT.',
      ],
      companionSlugs: [
        { slug: 'dowsil-allguard', note: 'Compare with permanent masonry waterproofing coating' },
        { slug: 'dowsil-791', note: 'Curtain wall exterior weatherproofing sealant' },
      ],
    },
  },
  'dowsil-firestop-700': {
    ko: {
      heading: 'DOWSIL™ FIRESTOP 700 내화 조인트·관통부 적용 가이드',
      intro: '내화 구획 벽체의 수직·수평 선형 익스팬션 조인트와 배관·케이블 관통부에서 화재 확산과 연기를 차단하는 1액형 중성 무할로겐 내화 실리콘입니다.',
      selectionTitle: '인증 규격 및 내화 성능 요약',
      selectionPoints: [
        '조인트 단면 구성(백업재 종류·두께·실란트 깊이 등)에 따라 최대 240분(4시간)의 차염성(E)·차열성(I) 내화 성능을 얻을 수 있습니다.',
        'EN 13501-1 B,s2,d0 화재 반응성 등급, EN 1366-4 / BS 476-22(선형 조인트) 및 BS 476-22(관통부) 시험, CE 마킹(EAD 350141-00-1106), UAE Civil Defense, 철도 EN 45545-2 승인을 보유합니다.',
        '저모듈러스 비흐름성 중성·무할로겐 경화 제품으로 ISO 11600-F&G-25LM(움직임 ±50%)을 만족하며 다공성·비다공성 기재에 무프라이머 접착합니다.',
      ],
      handlingTitle: '포장·물성 및 내화 매뉴얼 연계 확인',
      handlingPoints: [
        '카탈로그 기준 포장 단위는 310ml 카트리지(12개/박스)이며, 가사시간 15분·Tack-free 1.5시간·경도 Shore A 26·최대 인장강도 0.57 MPa·최대 신율 345%입니다(색상·유효기간은 문의).',
        '실제 내화 등급은 벽체 재료·두께·백업재(미네랄울 밀도 등)·실란트 깊이에 따라 달라지므로 아래 관련 기술자료의 벽체 선형 줄눈·관통부 시험 결과표와 원문 TDS를 반드시 확인해야 합니다.',
      ],
      companionSlugs: [
        { slug: 'dowsil-791', note: '일반 비내화 커튼월·외장 웨더실링 (±50%)' },
        { slug: 'dowsil-rtv-hi-temp', note: '방화구획이 아닌 설비 연속 260°C 내열 실링용' },
      ],
    },
    en: {
      heading: 'DOWSIL™ FIRESTOP 700 Linear Joint & Penetration Guide',
      intro: 'A halogen-free, neutral-cure, one-part fire-rated silicone for vertical/horizontal linear expansion joints and pipe/cable penetrations in fire-rated compartments.',
      selectionTitle: 'Standards, approvals & fire ratings',
      selectionPoints: [
        'Achieves up to 240 minutes (4 hours) fire resistance (E, EI) depending on the tested joint configuration and backing material.',
        'Holds EN 13501-1 Class B,s2,d0 reaction to fire, EN 1366-4 / BS 476-22 (linear joints), BS 476-22 (penetrations), CE marking (EAD 350141-00-1106), UAE Civil Defense and EN 45545-2 railway approval.',
        'Low-modulus, non-slump, halogen-free neutral silicone meeting ISO 11600-F&G-25LM (±50% movement) with unprimed adhesion to porous and non-porous substrates.',
      ],
      handlingTitle: 'Packaging, cure & fire-manual verification',
      handlingPoints: [
        'Catalog lists 310 ml cartridge, 12 per box; working time 15 min, tack-free 1.5 h, Shore A 26, tensile 0.57 MPa and 345% elongation (Colors & Shelf life: Inquire).',
        'Actual fire resistance ratings depend on wall construction, backing type/density and sealant depth — review the wall linear joint and penetration test tables in our Fire-Rated Technical Manual below.',
      ],
      companionSlugs: [
        { slug: 'dowsil-791', note: 'Non-fire-rated curtain wall weatherseal (±50%)' },
        { slug: 'dowsil-rtv-hi-temp', note: 'Continuous 260°C equipment heat-resistant silicone' },
      ],
    },
  },
}

export function productDeepGuide(slug: string, lang: 'ko' | 'en'): ProductDeepGuide | null {
  const core = CORE10_GUIDE[slug]
  if (core) return core[lang]

  const c = bySlug(slug)
  if (!c) return null
  const isEn = lang === 'en'
  const loc = localizeCatalog(c, lang)
  const sp = loc.specs
  const catLabel = isEn ? CATEGORY_EN[c.category].label : (CATEGORIES.find((x) => x.key === c.category)?.label ?? c.category)

  const selectionPoints: string[] = []
  const handlingPoints: string[] = []

  const typeVal = isEn ? sp['Product type'] : sp['제품 유형']
  if (typeVal) {
    selectionPoints.push(
      isEn
        ? `Classified under ${catLabel} as a ${typeVal} designed for ${loc.summary.toLowerCase()}.`
        : `${catLabel} 제품군의 ${typeVal} 배합으로, ${loc.summary} 용도에 맞춰 설계되었습니다.`,
    )
  }
  const stdVal = isEn ? sp['Standards'] : (sp['적용 규격'] ?? sp['규격'])
  if (stdVal) {
    selectionPoints.push(
      isEn ? `Listed standards / compliance in catalog: ${stdVal}.` : `카탈로그에 기재된 적용 규격: ${stdVal}.`,
    )
  }
  const movVal = isEn ? sp['Movement capability'] : sp['움직임 허용치']
  const hardVal = pickHardness(c, isEn)
  if (movVal || hardVal) {
    selectionPoints.push(
      isEn
        ? `Key mechanical snapshot from TDS summary: ${[movVal && `movement ${movVal}`, hardVal && `hardness ${hardVal}`].filter(Boolean).join(', ')}.`
        : `카탈로그 요약 주요 물성: ${[movVal && `움직임 허용치 ${movVal}`, hardVal && `경도 ${hardVal}`].filter(Boolean).join(', ')}.`,
    )
  }
  const stainVal = isEn ? sp['Stone staining'] : sp['석재 오염']
  if (stainVal) {
    selectionPoints.push(
      isEn ? `Porous stone staining test result: ${stainVal}.` : `다공성 석재 오염 시험 결과: ${stainVal}.`,
    )
  }
  const primerRec = isEn ? sp['Recommended primer'] : sp['권장 프라이머']
  if (primerRec) {
    selectionPoints.push(
      isEn ? `Recommended primer listed in catalog: ${primerRec}.` : `카탈로그 권장 프라이머: ${primerRec}.`,
    )
  }
  const notRec = isEn ? sp['Not recommended for'] : sp['비권장']
  if (notRec) {
    selectionPoints.push(
      isEn ? `Not recommended for: ${notRec}.` : `비권장 용도: ${notRec}.`,
    )
  }

  const mixVal = isEn ? sp['Mix ratio'] : sp['혼합 비율']
  if (mixVal) {
    handlingPoints.push(
      isEn
        ? `Two-part mix ratio: ${mixVal}. Use accurate metering and uniform mixing per the TDS.`
        : `2액형 혼합 비율은 ${mixVal}입니다. 원문 TDS 기준에 따라 정량 계량 및 균일 혼합이 필요합니다.`,
    )
  }
  const workVal = isEn ? sp['Working time'] : sp['가사시간']
  const skinVal = isEn
    ? (sp['Skin-over / tack-free time'] ?? sp['Skin-over / Tack-free'] ?? sp['Skin-over time'] ?? sp['Tack-free time'] ?? sp['Tack free time'] ?? sp['Tooling time'])
    : (sp['표면경화시간'] ?? sp['Skin-over / Tack-free'] ?? sp['Skin-over time'] ?? sp['Tack-free time'] ?? sp['Tack free time'] ?? sp['Tooling time'])
  const fullVal = isEn
    ? (sp['Full cure time'] ?? sp['Unit handling time'] ?? sp['Cure time'] ?? sp['Drying time'])
    : (sp['완전경화시간'] ?? sp['Unit handling time'] ?? sp['경화시간'] ?? sp['건조 시간'])
  if (workVal || skinVal || fullVal) {
    const parts = [
      workVal && (isEn ? `working time ${workVal}` : `가사시간 ${workVal}`),
      skinVal && (isEn ? `skin-over/tack-free ${skinVal}` : `표면경화/택프리 ${skinVal}`),
      fullVal && (isEn ? `full cure/drying ${fullVal}` : `완전경화/건조 ${fullVal}`),
    ].filter(Boolean)
    handlingPoints.push(
      isEn ? `Cure and handling window: ${parts.join(' · ')}.` : `작업·경화 기준(TDS 요약): ${parts.join(' · ')}.`,
    )
  }
  const tempVal = isEn
    ? (sp['Application temperature'] ?? sp['Service temperature'])
    : (sp['적용 온도'] ?? sp['시공 온도'] ?? sp['사용 온도'])
  if (tempVal) {
    handlingPoints.push(
      isEn ? `Temperature range listed in catalog: ${tempVal}.` : `카탈로그 기재 온도 조건: ${tempVal}.`,
    )
  }
  const caution = isEn ? (sp['Hazards (SDS)'] ?? sp['Note'] ?? sp['Flash point']) : (sp['위험성 (SDS)'] ?? sp['주의'] ?? sp['인화점'])
  if (caution) {
    handlingPoints.push(
      isEn ? `Safety / handling note: ${caution}.` : `취급·안전 확인사항: ${caution}.`,
    )
  }
  if (STRUCTURAL.has(slug)) {
    handlingPoints.push(
      isEn
        ? 'Structural glazing or load-bearing applications require pre-testing and design review by Dow technical staff.'
        : '구조 글레이징 등 구조용 적용 전에는 Dow 기술진의 도면 검토와 기재 접착 사전 시험이 필요합니다.',
    )
  }
  if (handlingPoints.length === 0) {
    handlingPoints.push(
      isEn
        ? 'Confirm exact cure schedule, substrate preparation and packaging with the linked Dow TDS PDF and Korea Construction Trading (KCT).'
        : '정확한 경화 조건, 표면 전처리, 포장 단위는 상단 TDS PDF 원문과 한국건설트레이딩(KCT)을 통해 확인해 주십시오.',
    )
  }

  return {
    heading: isEn ? `${c.name} Selection & Handling Summary` : `${c.name} 선정·시공 핵심 요약`,
    intro: isEn
      ? `Key catalog specifications and site handling points summarized from the Dow TDS for ${c.name}.`
      : `Dow TDS 카탈로그 데이터를 바탕으로 정리한 ${c.name}의 주요 선정 포인트와 시공 확인사항입니다.`,
    selectionTitle: isEn ? 'Selection & specification points' : '선정·규격 포인트',
    selectionPoints,
    handlingTitle: isEn ? 'Cure, temperature & handling checks' : '작업·경화·취급 확인사항',
    handlingPoints,
  }
}

// ───────── 제품별 고유 FAQ (핵심 10종 개별 작성 + 나머지 20종 조사 정확도 보정 자동 생성) ─────────
const CORE10_FAQ: Record<string, { ko: Faq[]; en: Faq[] }> = {
  'dowsil-993': {
    ko: [
      {
        q: 'DOWSIL™ 993과 DOWSIL™ 983의 차이는 무엇인가요?',
        a: '둘 다 커튼월 공장 글레이징용 2액형 중성 구조 실란트입니다. DOWSIL™ 983은 ASTM C1184·ASTM C719 Class 25(±25%) 중심의 9:1(부피비) 제품이며, DOWSIL™ 993은 유럽(EOTA) 구조 글레이징 기준과 중국 GB 16776 규격을 만족하는 9:1~12:1 혼합비 제품입니다.',
      },
      {
        q: 'DOWSIL™ 993 혼합 시 주제와 경화제 Lot를 맞춰야 하나요?',
        a: '카탈로그(Dow TDS 요약)에 따르면 DOWSIL™ 993은 주제와 경화제의 Lot 매칭이 불필요합니다. 다만 2액형 정량·무기포 혼합 설비로 9:1~12:1 비율을 유지해 토출해야 합니다.',
      },
      {
        q: '도장 알루미늄(Kynar/PVF2)에 DOWSIL™ 993을 적용할 때 프라이머가 필요한가요?',
        a: '코팅·반사유리, 아노다이징·폴리에스터 도장 알루미늄, 스테인리스 등 폭넓은 기재에 우수하게 접착하지만, PVF2(Kynar)계 도장면과 폴리에스터 분체도장 접착 촉진에는 전용 실란 프라이머인 DOWSIL™ Primer-C 적용을 검토합니다. 최종 여부는 기재 접착 시험과 Dow 기술 검토로 확정합니다.',
      },
      {
        q: 'DOWSIL™ 993의 포장 단위·유효기간·기술 검토는 어디에 문의하나요?',
        a: '요약 카탈로그에 미기재된 포장 단위(드럼·페일 등)와 유효기간, 그리고 구조 글레이징 사전 검토 절차는 한국건설트레이딩(sales@kconstrade.com, 010-8939-0284)으로 문의하시면 최신 TDS와 함께 기술 지원을 안내해 드립니다.',
      },
    ],
    en: [
      {
        q: 'What is the difference between DOWSIL™ 993 and DOWSIL™ 983?',
        a: 'Both are two-part neutral structural glazing sealants for factory curtain-wall production. DOWSIL™ 983 is a 9:1 (by volume) sealant meeting ASTM C1184 and ASTM C719 Class 25 (±25%), while DOWSIL™ 993 mixes at 9:1–12:1 and meets European (EOTA) structural glazing standards and Chinese GB 16776.',
      },
      {
        q: 'Does DOWSIL™ 993 require base and curing agent lot matching?',
        a: 'Per the catalog TDS summary, lot matching between base and curing agent is not necessary for DOWSIL™ 993, though metered, air-free two-part dispensing equipment is required.',
      },
      {
        q: 'Which primer is used with DOWSIL™ 993 on PVF2 (Kynar) coated aluminum?',
        a: 'DOWSIL™ Primer-C is Dow’s solvent-based silane primer intended specifically to promote adhesion of DOWSIL™ 983, 993 and 993N structural glazing sealants to PVF2 (Kynar) paints and polyester powder coatings. Always confirm via project adhesion testing.',
      },
      {
        q: 'How can I confirm packaging, shelf life and Dow structural review for DOWSIL™ 993?',
        a: 'Packaging and shelf life are not listed in the summarized catalog. Contact Korea Construction Trading (sales@kconstrade.com, +82 10-8939-0284) for current TDS documents, supply formats and coordination of Dow technical support.',
      },
    ],
  },
  'dowsil-995': {
    ko: [
      {
        q: 'DOWSIL™ 995와 DOWSIL™ 795 중 어떤 제품을 선택해야 하나요?',
        a: 'DOWSIL™ 995는 경도 Shore A 40·최대 인장강도 23 kg/cm²의 고강도 1액형 스트럭추럴 글레이징 전용 실란트입니다. 반면 DOWSIL™ 795는 ASTM C1184 구조 성능과 ±50% 움직임 허용치(ASTM C719 Class 50)를 겸해 구조 접합과 외장 웨더실링을 한 제품으로 처리할 때 적합합니다.',
      },
      {
        q: 'DOWSIL™ 995는 완전 접착까지 며칠이 걸리나요?',
        a: '카탈로그(TDS 요약) 기준 표면경화는 1.5시간(25°C, 50% RH), 완전경화는 7~14일, 완전 접착시간은 14~21일입니다. 구조 하중이 가해지는 시점은 경화·접착 일정을 고려해 계획해야 합니다.',
      },
      {
        q: 'DOWSIL™ 995의 색상과 유효기간은 어떻게 되나요?',
        a: '카탈로그 기준 색상은 Black, 유효기간은 32°C 이하 보관 시 18개월입니다. 포장 단위(카트리지/소시지 등)와 최신 로트 재고는 한국건설트레이딩으로 문의해 주십시오.',
      },
      {
        q: 'DOWSIL™ 995를 구조용으로 쓸 때 Dow 사전 검토가 꼭 필요한가요?',
        a: '네. DOWSIL™ 995를 구조 글레이징에 적용하기 전에는 Dow의 기재 접착 사전 시험과 도면 검토가 필요합니다. 한국건설트레이딩(sales@kconstrade.com, 010-8939-0284)이 관련 자료 안내와 기술 지원을 최선을 다해 돕습니다.',
      },
    ],
    en: [
      {
        q: 'How do I choose between DOWSIL™ 995 and DOWSIL™ 795?',
        a: 'DOWSIL™ 995 is a high-modulus (Shore A 40, 23 kg/cm² tensile) dedicated one-part structural glazing sealant. DOWSIL™ 795 combines ASTM C1184 structural glazing performance with ±50% movement (ASTM C719 Class 50) for jobs needing both structural and weatherseal duties.',
      },
      {
        q: 'How long does DOWSIL™ 995 take to reach full cure and full adhesion?',
        a: 'Per the catalog TDS summary, skin-over is 1.5 hours (25°C, 50% RH), full cure takes 7–14 days, and full adhesion develops in 14–21 days.',
      },
      {
        q: 'What are the catalog color and shelf life of DOWSIL™ 995?',
        a: 'The catalog lists Black color and a shelf life of 18 months when stored at or below 32°C. Contact KCT to confirm available packaging formats and current stock.',
      },
      {
        q: 'Is Dow pre-testing required before using DOWSIL™ 995 structurally?',
        a: 'Yes. Pre-testing on project substrates and drawing review by Dow are required prior to structural glazing use. Korea Construction Trading (KCT) supports document requests and technical coordination.',
      },
    ],
  },
  'dowsil-795': {
    ko: [
      {
        q: 'DOWSIL™ 795는 구조용과 외장 웨더실링에 모두 쓸 수 있나요?',
        a: '네. DOWSIL™ 795는 ASTM C1184 구조용 글레이징 규격을 만족하면서 ASTM C719 Class 50(±50%) 움직임 허용치를 갖춰 구조 글레이징과 내후성 웨더실링 모두에 적용할 수 있는 1액형 중성 실란트입니다. 다만 구조용 적용은 Dow 기술진의 검토가 필요합니다.',
      },
      {
        q: 'DOWSIL™ 795의 주요 물성(경도·인장강도·VOC)은 어느 정도인가요?',
        a: '카탈로그 기준 경도 Shore A 35, 최대 인장강도 2.3 MPa(7일), 최대 신율 670%(7일), 접착 강도 8.5 kg/cm, VOC 32 g/L, 움직임 허용치 ±50%입니다. 모든 수치는 대표 특성이며 시방 작성 시 TDS 원문을 확인해야 합니다.',
      },
      {
        q: 'DOWSIL™ 795의 색상·포장·유효기간은 어떻게 확인하나요?',
        a: '요약 카탈로그에 색상·포장·유효기간이 표기되어 있지 않아 「문의」로 안내하고 있습니다. 상단 TDS 다운로드 PDF를 확인하시거나 한국건설트레이딩(sales@kconstrade.com, 010-8939-0284)으로 문의하시면 공급 가능 색상과 포장 단위를 안내해 드립니다.',
      },
      {
        q: 'DOWSIL™ 795와 DOWSIL™ 791의 차이는 무엇인가요?',
        a: 'DOWSIL™ 791은 커튼월·외장 비구조 웨더실링(±50%, Shore A 25~30) 전용이며, DOWSIL™ 795는 더 높은 경도·강도(Shore A 35, 2.3 MPa)로 ASTM C1184 구조 글레이징까지 겸용할 수 있습니다.',
      },
    ],
    en: [
      {
        q: 'Can DOWSIL™ 795 be used for both structural glazing and weatherproofing?',
        a: 'Yes. DOWSIL™ 795 meets ASTM C1184 for structural glazing and ASTM C719 Class 50 (±50%) for weatherproofing. Structural glazing applications still require review by Dow technical staff.',
      },
      {
        q: 'What are the typical mechanical properties and VOC of DOWSIL™ 795?',
        a: 'Catalog typical values are Shore A 35 hardness, 2.3 MPa tensile strength (7 days), 670% elongation (7 days), 8.5 kg/cm adhesion strength, ±50% movement and 32 g/L VOC.',
      },
      {
        q: 'How can I check available colors, packaging and shelf life for DOWSIL™ 795?',
        a: 'Those fields are not listed in the summarized catalog. Download the TDS PDF above or contact KCT (sales@kconstrade.com, +82 10-8939-0284) for current colors, pack sizes and lead times.',
      },
      {
        q: 'How does DOWSIL™ 795 compare with DOWSIL™ 791?',
        a: 'DOWSIL™ 791 is a non-structural curtain wall weatherproofing sealant (Shore A 25–30, ±50%), whereas DOWSIL™ 795 offers higher hardness and strength (Shore A 35, 2.3 MPa) to cover ASTM C1184 structural glazing as well as ±50% weatherseals.',
      },
    ],
  },
  'dowsil-789': {
    ko: [
      {
        q: 'DOWSIL™ 789와 DOWSIL™ 791은 어떤 차이가 있나요?',
        a: '둘 다 ±50% 움직임의 1액형 중성 내후성 실란트입니다. DOWSIL™ 789는 코팅 알루미늄·유리·세라믹·철판의 일반/비구조 글레이징(KS F 4910-2000 F25LM, 신율 700%, 6색+특수색)에 강점이 있으며, DOWSIL™ 791은 커튼월 외장 및 석재·갈바나이즈 스틸 등 폭넓은 기재와 ASTM C920·ISO 11600·EN 15651 규격 대응에 특화되어 있습니다.',
      },
      {
        q: 'DOWSIL™ 789는 코팅 알루미늄에 프라이머 없이 접착되나요?',
        a: '네. 중성 경화 배합으로 아노다이징·코팅 알루미늄을 부식시키지 않으며 대부분의 건축 자재에 프라이머 없이 접착되도록 설계되었습니다. 다만 현장 기재 상태에 따라 사전 접착 확인이 권장됩니다.',
      },
      {
        q: 'DOWSIL™ 789의 카탈로그 기재 색상과 경화 시간은 어떻게 되나요?',
        a: '색상은 Black, Gray, Bronze, Limestone, Precast White, White(특수 색상 가능)이며, 가사시간 15~30분·표면경화 80분 미만(25°C, 50% RH)·완전경화 7~14일입니다. 포장 단위와 유효기간은 한국건설트레이딩에 문의해 주십시오.',
      },
      {
        q: 'DOWSIL™ 789를 구조 글레이징(유리 구조 접착)에 사용해도 되나요?',
        a: '아니요. DOWSIL™ 789는 일반 및 비구조용 글레이징 내후 실링 제품입니다. 구조 글레이징에는 ASTM C1184 대응 1액형(795·995) 또는 2액형(983·993)을 검토하고 Dow 기술 검토를 받아야 합니다.',
      },
    ],
    en: [
      {
        q: 'What is the difference between DOWSIL™ 789 and DOWSIL™ 791?',
        a: 'Both are ±50% one-part neutral weatherproofing sealants. DOWSIL™ 789 targets general/non-structural glazing with primerless adhesion on coated aluminum (KS F 4910-2000 F25LM, 700% elongation, 6 catalog colors + special colors), while DOWSIL™ 791 adds ASTM C920, ISO 11600 and EN 15651-1/2 compliance for curtain walls and porous stone.',
      },
      {
        q: 'Does DOWSIL™ 789 bond to coated aluminum without a primer?',
        a: 'Yes, it is a non-corrosive neutral-cure silicone designed for primerless adhesion to most building materials including anodized and coated aluminum. Always verify on actual project substrates.',
      },
      {
        q: 'What colors and cure times are listed for DOWSIL™ 789?',
        a: 'Catalog colors are Black, Gray, Bronze, Limestone, Precast White and White (special colors available); working time is 15–30 min, skin-over under 80 min (25°C, 50% RH) and full cure 7–14 days. Packaging and shelf life: inquire with KCT.',
      },
      {
        q: 'Can DOWSIL™ 789 be used for structural glazing?',
        a: 'No. DOWSIL™ 789 is for general and non-structural glazing weather seals. For structural glazing, consider DOWSIL™ 795, 995, 983 or 993 with Dow technical review.',
      },
    ],
  },
  'dowsil-791': {
    ko: [
      {
        q: 'DOWSIL™ 791은 어떤 국제·국내 규격을 만족하나요?',
        a: '카탈로그 기준 ASTM C920 Type S Grade NS Class 50, ISO 11600 F&G-25LM, KS F4910 F-25LM, EN 15651-1/2 규격을 만족하는 커튼월·외장 웨더실링 실란트입니다.',
      },
      {
        q: 'DOWSIL™ 791의 시공 온도 범위와 경화 속도는 어떻게 되나요?',
        a: '적용 온도는 4~40°C이며, 25°C·50% RH 기준 가사시간 20분, 표면경화시간 45분, 완전경화시간 7~14일입니다.',
      },
      {
        q: '다공성 천연석 외장에 DOWSIL™ 791 대신 977·991을 검토하는 이유는 무엇인가요?',
        a: 'DOWSIL™ 791도 석재 등 다공성 기재에 적용 가능하지만, 화강석·천연석의 유체 이행 오염 저감(ASTM C1248 None)과 비오염 보증 검토가 중요한 외장에는 전용 비오염 중모듈러스 실란트인 DOWSIL™ 977 또는 991이 더 적합합니다.',
      },
      {
        q: 'DOWSIL™ 791의 색상·포장·견적은 어떻게 확인하나요?',
        a: '요약 카탈로그에 색상·포장·유효기간이 미기재되어 있으므로 상단 TDS PDF 확인 또는 한국건설트레이딩(sales@kconstrade.com, 010-8939-0284) 문의를 통해 현재 재고 색상·포장과 B2B 견적을 안내받으실 수 있습니다.',
      },
    ],
    en: [
      {
        q: 'Which standards does DOWSIL™ 791 meet?',
        a: 'Per the catalog, DOWSIL™ 791 conforms to ASTM C920 Type S Grade NS Class 50, ISO 11600 F&G-25LM, KS F4910 F-25LM and EN 15651-1/2.',
      },
      {
        q: 'What are the application temperature and cure times of DOWSIL™ 791?',
        a: 'Application temperature is 4–40°C; working time is 20 min, skin-over 45 min (25°C, 50% RH) and full cure 7–14 days.',
      },
      {
        q: 'When should I consider DOWSIL™ 977 or 991 instead of 791 on natural stone?',
        a: 'While DOWSIL™ 791 works on porous substrates, DOWSIL™ 977 and 991 are specifically formulated for non-staining performance (ASTM C1248 None) and reduced rundown on porous natural stone and metal panels.',
      },
      {
        q: 'How do I confirm available colors, packaging and pricing for DOWSIL™ 791?',
        a: 'Check the linked TDS PDF and contact Korea Construction Trading (sales@kconstrade.com, +82 10-8939-0284) for stock colors, pack sizes and B2B quotes.',
      },
    ],
  },
  'dowsil-983': {
    ko: [
      {
        q: 'DOWSIL™ 983의 혼합 비율과 유닛 취급 가능 시간은 어떻게 되나요?',
        a: '부피 기준 9:1(Base 백색 : Catalyst 흑색 또는 회색)로 혼합하며, 가사시간 10~25분, 24°C 기준 Unit handling time 4~24시간입니다. 경도는 1일 Shore A 30~40, 7일 Shore A 35~45입니다.',
      },
      {
        q: 'DOWSIL™ 983은 구조 글레이징 외에 웨더실 용도로도 승인되어 있나요?',
        a: '네. ASTM C1184 구조 글레이징과 ASTM C719 Class 25(G, A, O, ±25% 움직임) 웨더실 용도로 승인되어 있으며 혼합 시 VOC가 18 g/L 미만입니다. 모든 구조 적용은 Dow 기술진의 검토가 필요합니다.',
      },
      {
        q: 'DOWSIL™ 983과 DOWSIL™ 993 중 무엇을 골라야 하나요?',
        a: '북미·국내 ASTM C1184 기준 공장 커튼월 생산에는 DOWSIL™ 983이 널리 쓰이며, 유럽(EOTA) 구조 글레이징 규격이나 중국 GB 16776 대응이 명시된 프로젝트에는 DOWSIL™ 993을 선정합니다.',
      },
      {
        q: 'Kynar 도장 알루미늄에 DOWSIL™ 983을 시공할 때 프라이머가 필요한가요?',
        a: '유리·알로다인·아노다이징 알루미늄에는 우수한 접착을 보이나, Kynar 등 PVF2 도장면에는 Primer-C 계열 프라이머 사용이 권장됩니다. 정확한 프라이머 선정과 포장·재고 문의는 한국건설트레이딩(sales@kconstrade.com, 010-8939-0284)으로 연락해 주십시오.',
      },
    ],
    en: [
      {
        q: 'What are the mix ratio and unit handling time of DOWSIL™ 983?',
        a: 'DOWSIL™ 983 mixes at 9:1 by volume (white Base / black or gray Catalyst), with 10–25 min working time and 4–24 hours unit handling time at 24°C. Hardness reaches Shore A 30–40 (1 day) and 35–45 (7 days).',
      },
      {
        q: 'Is DOWSIL™ 983 approved for weatherseals as well as structural glazing?',
        a: 'Yes. It meets ASTM C1184 for structural glazing and ASTM C719 Class 25 (±25%) for weatherseals with mixed VOC below 18 g/L. Structural applications require Dow technical review.',
      },
      {
        q: 'How do I decide between DOWSIL™ 983 and DOWSIL™ 993?',
        a: 'Choose DOWSIL™ 983 for ASTM C1184 factory glazing specifications, or DOWSIL™ 993 when European (EOTA) or Chinese GB 16776 compliance is specified.',
      },
      {
        q: 'Is a primer needed with DOWSIL™ 983 on Kynar-coated aluminum?',
        a: 'Yes, the catalog recommends Primer-C series on Kynar/PVF2-painted frames, while glass, alodine and anodized aluminum show excellent adhesion. Contact KCT for primer confirmation, packaging and technical support.',
      },
    ],
  },
  'dowsil-888': {
    ko: [
      {
        q: 'DOWSIL™ 888과 DOWSIL™ 890-SL의 가장 큰 차이는 무엇인가요?',
        a: 'DOWSIL™ 888은 비흐름성(Non-sag, Shore A 15) 1액형으로 콘크리트-콘크리트 포장 조인트나 경사진 구간에서 툴링 시공에 적합합니다. DOWSIL™ 890-SL은 자기수평(Shore A 3~5) 초저모듈러스 1액형으로 툴링이 불필요하며 콘크리트-아스팔트 조인트에도 적용할 수 있습니다.',
      },
      {
        q: 'DOWSIL™ 888은 콘크리트 포장 조인트에 프라이머가 필요한가요?',
        a: '표면이 청결하고 건조하며 서리가 없는 포틀랜드 시멘트 콘크리트라면 프라이머가 불필요합니다. 단, 시공 전 이물질과 레이턴스를 철저히 제거해야 합니다.',
      },
      {
        q: 'DOWSIL™ 888은 겨울철 저온에서도 시공할 수 있나요?',
        a: '카탈로그 기준 -20~120°F(약 -29~49°C) 범위에서 냉간 압출 시공이 가능하며 표면경화 1시간 이내, 움직임 허용치 +100/-50%(10 cycles)를 갖습니다. 표면 결로·서리가 없는 조건에서 시공해야 합니다.',
      },
      {
        q: 'DOWSIL™ 888의 색상·포장 단위·견적은 어떻게 확인하나요?',
        a: '카탈로그 기재 색상은 Gray이며, 포장 단위와 유효기간은 미기재(문의)입니다. 도로·공항·포장 현장 납품 견적과 포장 재고는 한국건설트레이딩(sales@kconstrade.com, 010-8939-0284)으로 문의해 주십시오.',
      },
    ],
    en: [
      {
        q: 'What is the main difference between DOWSIL™ 888 and DOWSIL™ 890-SL?',
        a: 'DOWSIL™ 888 is a non-sag (Shore A 15) one-part sealant suited to sloped or irregular concrete-to-concrete joints with tooling. DOWSIL™ 890-SL is a self-leveling (Shore A 3–5) one-part sealant requiring no tooling and also usable on concrete-to-asphalt joints.',
      },
      {
        q: 'Does DOWSIL™ 888 require a primer on concrete pavement joints?',
        a: 'No primer is required on Portland cement concrete provided the joint faces are clean, dry and frost-free.',
      },
      {
        q: 'Can DOWSIL™ 888 be applied in cold weather?',
        a: 'Yes, it is extrudable from -20 to 120°F (approx. -29 to 49°C) with skin-over within 1 hour and +100/-50% movement capability, provided the concrete surface is dry and frost-free.',
      },
      {
        q: 'What color and packaging options are available for DOWSIL™ 888?',
        a: 'The catalog lists Gray; packaging formats and shelf life are confirmed on request. Contact KCT (sales@kconstrade.com, +82 10-8939-0284) for B2B supply and packaging details.',
      },
    ],
  },
  'dowsil-890-sl': {
    ko: [
      {
        q: 'DOWSIL™ 890-SL은 정말 별도 툴링 없이 시공할 수 있나요?',
        a: '네. 자기수평(Self-leveling) 1액형 실리콘으로 불규칙하거나 박락된 조인트에도 스스로 흘러 평탄하게 메워지므로 별도 툴링 공정이 필요 없습니다.',
      },
      {
        q: 'DOWSIL™ 890-SL은 아스팔트와 콘크리트 접합부에도 쓸 수 있나요?',
        a: '네. 콘크리트-콘크리트뿐 아니라 콘크리트-아스팔트 포장 조인트에도 프라이머 없이 적용할 수 있습니다.',
      },
      {
        q: 'DOWSIL™ 890-SL과 888·902 RCS는 어떻게 구분해 선택하나요?',
        a: '평탄한 도로 포장(콘크리트·아스팔트)의 무툴링 시공은 890-SL(Shore A 3~5, 신율 1,400%), 경사가 있어 흘러내림 방지가 필요한 콘크리트 포장은 비흐름성 888(Shore A 15), 폭 25~76mm 교량·고속도로 신축이음은 속경화 2액형 902 RCS를 선택합니다.',
      },
      {
        q: 'DOWSIL™ 890-SL 시공 후 도로 개통과 색상·포장 확인은 어떻게 하나요?',
        a: '표면경화 1시간 이내로 신속한 개통에 유리하며, 카탈로그 기준 색상은 Dark gray / Light gray입니다. 포장 단위와 유효기간·납기 문의는 한국건설트레이딩(sales@kconstrade.com, 010-8939-0284)으로 연락해 주십시오.',
      },
    ],
    en: [
      {
        q: 'Does DOWSIL™ 890-SL really require no tooling?',
        a: 'Yes. Because it is self-leveling, it flows into irregular and spalled pavement joints on its own without tooling.',
      },
      {
        q: 'Can DOWSIL™ 890-SL be used on concrete-to-asphalt joints?',
        a: 'Yes, it bonds to both concrete-to-concrete and concrete-to-asphalt pavement joints without a primer.',
      },
      {
        q: 'How should I choose among DOWSIL™ 890-SL, 888 and 902 RCS?',
        a: 'Use 890-SL (Shore A 3–5, 1,400% elongation) for flat concrete or asphalt joints without tooling; use non-sag 888 (Shore A 15) where slope requires non-flow performance; use rapid-cure two-part 902 RCS for 25–76 mm bridge and highway expansion joints.',
      },
      {
        q: 'What colors and reopening time apply to DOWSIL™ 890-SL?',
        a: 'It skins over within 1 hour for rapid road reopening and is listed in Dark gray / Light gray in the catalog. Confirm packaging and shelf life with KCT.',
      },
    ],
  },
  'dowsil-650-plus': {
    ko: [
      {
        q: 'DOWSIL™ 650+는 시공 후 언제부터 벗겨낼(박리할) 수 있고 최대 보호 기간은 얼마인가요?',
        a: '카탈로그 기준 7일 경화 후 기재 손상이나 잔여물 없이 쉽게 박리할 수 있으며, 현장 노출 조건에 따라 최대 18개월까지 임시 보호가 가능합니다.',
      },
      {
        q: 'DOWSIL™ 650+는 어떤 도포 방법과 두께로 시공하나요?',
        a: '붓·롤러·스프레이로 건조 도막 두께 100 µm 기준 도포합니다. 반투명 청색 수성 아크릴 액체이며 VOC 6 g/L(SCAQMD)·APEO 프리 배합입니다.',
      },
      {
        q: '겨울철이나 저온 현장에서 DOWSIL™ 650+를 바를 때 주의할 점은 무엇인가요?',
        a: '최소 성막 온도(MFFT)가 8.5°C(±2)이므로 도포 및 건조 환경 온도가 MFFT 기준 아래로 떨어지지 않도록 관리해야 균일한 보호 피막이 형성됩니다.',
      },
      {
        q: 'DOWSIL™ 650+가 글레이징 실란트에 영향을 주나요? 포장·견적은 어디서 확인하나요?',
        a: '일반적인 DOWSIL 글레이징 실란트와의 상용성을 고려해 설계되었습니다. 포장 단위와 유효기간은 카탈로그 미기재(문의)이므로 한국건설트레이딩(sales@kconstrade.com, 010-8939-0284)으로 문의해 주십시오.',
      },
    ],
    en: [
      {
        q: 'When can DOWSIL™ 650+ be peeled off and how long does it protect?',
        a: 'Per the catalog, it peels cleanly without residue after 7 days cure and provides temporary protection for up to 18 months depending on exposure conditions.',
      },
      {
        q: 'How is DOWSIL™ 650+ applied and at what thickness?',
        a: 'Apply by brush, roller or spray to a 100 µm dry film thickness. It is a translucent blue waterborne acrylic coating with 6 g/L VOC (SCAQMD) and no APEO.',
      },
      {
        q: 'What temperature constraint should be checked when applying DOWSIL™ 650+?',
        a: 'Its minimum film-forming temperature (MFFT) is 8.5°C (±2), so ensure ambient and substrate temperatures stay above MFFT for proper film formation.',
      },
      {
        q: 'Is DOWSIL™ 650+ compatible with DOWSIL glazing sealants?',
        a: 'Yes, the catalog notes compatibility with common DOWSIL glazing sealants. Contact KCT (sales@kconstrade.com, +82 10-8939-0284) for packaging, shelf life and B2B quotes.',
      },
    ],
  },
  'dowsil-firestop-700': {
    ko: [
      {
        q: 'DOWSIL™ FIRESTOP 700의 내화 성능과 화재 반응성 등급은 어떻게 되나요?',
        a: '조인트 단면 구성에 따라 최대 240분(4시간)의 차염성(E)·차열성(I) 내화 성능을 얻을 수 있으며, EN 13501-1 화재 반응성 등급 B,s2,d0와 선형 조인트 EN 1366-4/BS 476-22, 관통부 BS 476-22 시험 및 CE 마킹(EAD 350141-00-1106)을 보유합니다.',
      },
      {
        q: 'DOWSIL™ FIRESTOP 700의 움직임 허용치와 경화 방식은 무엇인가요?',
        a: '1액형 저모듈러스 비흐름성 중성·무할로겐 경화 실리콘이며, ISO 11600-F&G-25LM 규격과 ±50% 움직임 허용치를 만족해 익스팬션 조인트와 배관·케이블 관통부 모두에 적용할 수 있습니다.',
      },
      {
        q: 'DOWSIL™ FIRESTOP 700의 포장 단위는 어떻게 되나요?',
        a: '카탈로그 기준 310ml 카트리지, 12개/박스 포장으로 기재되어 있습니다. 색상 옵션과 유효기간, 대량 재고는 한국건설트레이딩으로 문의해 주십시오.',
      },
      {
        q: '벽체·관통부 내화 시험 결과표와 국내 적용 상담은 어디서 확인하나요?',
        a: '이 페이지 하단의 관련 기술자료(내화 제품군·벽체 선형 줄눈·관통부 실링)에서 Dow 내화 기술 매뉴얼의 시험 결과표를 확인할 수 있으며, 프로젝트별 자료 및 기술 지원은 한국건설트레이딩(sales@kconstrade.com, 010-8939-0284)으로 문의해 주십시오.',
      },
    ],
    en: [
      {
        q: 'What fire resistance and reaction-to-fire ratings does DOWSIL™ FIRESTOP 700 hold?',
        a: 'Depending on joint design, it achieves up to 240 minutes (E, EI) fire resistance. It holds EN 13501-1 Class B,s2,d0, EN 1366-4 / BS 476-22 linear joint tests, BS 476-22 penetration tests, CE marking (EAD 350141-00-1106), UAE Civil Defense and EN 45545-2 railway approval.',
      },
      {
        q: 'What are the cure chemistry and movement capability of DOWSIL™ FIRESTOP 700?',
        a: 'It is a one-part, low-modulus, non-slump, halogen-free neutral-cure silicone meeting ISO 11600-F&G-25LM with ±50% movement capability.',
      },
      {
        q: 'What packaging unit is listed for DOWSIL™ FIRESTOP 700?',
        a: 'The catalog lists 310 ml cartridges, 12 per box. Contact KCT to confirm available colors, shelf life and stock lead times.',
      },
      {
        q: 'Where can I check linear joint and penetration fire test tables?',
        a: 'See the Related Technical Information links below for the Dow Fire-Rated Technical Manual wall linear joint and penetration test tables, or contact KCT (sales@kconstrade.com, +82 10-8939-0284) for technical support.',
      },
    ],
  },
}

// 제품별 FAQ — 핵심 10종은 고유 실무 Q&A, 나머지 20종은 조사 오류 없이 카탈로그 데이터 기반 자동 생성
export function productFaq(slug: string, lang: 'ko' | 'en'): Faq[] {
  const core = CORE10_FAQ[slug]
  if (core) return core[lang]

  const c = bySlug(slug)
  if (!c) return []
  const p = localizeCatalog(c, lang)
  const ko = lang === 'ko'
  const name = c.name
  const code = productCode(slug)
  const eun = eunNeun(code)
  const alias = aliasesOf(slug).slice(0, 4).join(' · ')
  const firstSentence = p.description.split(/(?<=[.。])\s/)[0]
  const faqs: Faq[] = []

  faqs.push({
    q: ko ? `${name}(다우실 ${code})${eun} 어떤 용도의 제품인가요?` : `What is ${name} (${code}) used for?`,
    a: ko
      ? `${p.summary}. ${firstSentence} 주요 적용 분야는 ${p.applications.join(', ')}이며, 검색 시 ${alias} 등으로도 표기됩니다.`
      : `${p.summary}. ${firstSentence} Typical applications include ${p.applications.join('; ')}. Also searched as: ${alias}.`,
  })

  // 제품별 핵심 물성 Q&A (카탈로그에 실제 있는 수치만 조합)
  const highlightPairs: string[] = []
  const sp = p.specs
  const mix = ko ? sp['혼합 비율'] : sp['Mix ratio']
  const mov = ko ? sp['움직임 허용치'] : sp['Movement capability']
  const hard = pickHardness(c, !ko)
  const temp = ko ? (sp['사용 온도'] ?? sp['적용 온도'] ?? sp['시공 온도']) : (sp['Service temperature'] ?? sp['Application temperature'])
  const std = ko ? (sp['적용 규격'] ?? sp['규격']) : sp['Standards']
  const voc = ko ? (sp['VOC'] ?? sp['VOC 함량'] ?? sp['VOC (혼합)']) : (sp['VOC'] ?? sp['VOC content'] ?? sp['VOC (mixed)'])
  if (mix) highlightPairs.push(ko ? `혼합 비율 ${mix}` : `mix ratio ${mix}`)
  if (mov) highlightPairs.push(ko ? `움직임 허용치 ${mov}` : `movement capability ${mov}`)
  if (hard) highlightPairs.push(ko ? `경도 ${hard}` : `hardness ${hard}`)
  if (temp) highlightPairs.push(ko ? `온도 범위 ${temp}` : `temperature ${temp}`)
  if (std) highlightPairs.push(ko ? `규격 ${std}` : `standards ${std}`)
  if (voc) highlightPairs.push(`VOC ${voc}`)

  if (highlightPairs.length) {
    faqs.push({
      q: ko ? `${name}의 핵심 사양과 물성은 무엇인가요?` : `What are the key specifications of ${name}?`,
      a: ko
        ? `카탈로그(Dow TDS 요약) 기준 ${name}${eun} ${highlightPairs.join(', ')} 특성을 갖습니다. 모든 수치는 대표 특성이며 시방 작성 전 상단 ${c.docLabel ?? 'TDS'} PDF 원문을 확인해 주십시오.`
        : `Per the catalog Dow TDS summary, ${name} features ${highlightPairs.join(', ')}. Values are typical properties; verify against the linked ${p.docLabel ?? 'TDS'} PDF before specifying.`,
    })
  }

  // 색상·포장·유효기간 Q&A — 실제 기재된 항목과 '문의' 항목을 정확히 구분
  const colorVal = pickColor(c, !ko)
  const packVal = ko ? sp['포장'] : sp['Packaging']
  const shelfVal = pickShelfLife(c, !ko)
  const known: string[] = []
  const missing: string[] = []
  if (colorVal) known.push(ko ? `색상·외관: ${colorVal}` : `Colors/appearance: ${colorVal}`)
  else missing.push(ko ? '색상' : 'colors')
  if (packVal) known.push(ko ? `포장: ${packVal}` : `Packaging: ${packVal}`)
  else missing.push(ko ? '포장 단위' : 'packaging')
  if (shelfVal) known.push(ko ? `유효기간: ${shelfVal}` : `Shelf life: ${shelfVal}`)
  else missing.push(ko ? '유효기간' : 'shelf life')

  faqs.push({
    q: ko ? `${name}의 색상·포장·유효기간은 어떻게 확인하나요?` : `How can I check colors, packaging and shelf life of ${name}?`,
    a: ko
      ? `${known.length ? `카탈로그 확인 항목 — ${known.join(' / ')}. ` : ''}${missing.length ? `미기재 항목(${missing.join('·')})은 「문의」 대상이므로 최신 TDS와 한국건설트레이딩을 통해 확인해 주십시오.` : '최신 사양과 재고는 한국건설트레이딩에 확인해 주십시오.'}`
      : `${known.length ? `Listed in catalog — ${known.join(' / ')}. ` : ''}${missing.length ? `Unlisted items (${missing.join(', ')}) are confirmed on request via the latest TDS and KCT.` : 'Confirm latest availability with KCT.'}`,
  })

  faqs.push({
    q: ko ? `${name} 구매 견적과 기술 지원은 어떻게 받나요?` : `How do I request a quote or technical support for ${name}?`,
    a: ko
      ? `한국건설트레이딩(sales@kconstrade.com, 010-8939-0284, WhatsApp)으로 모델명·수량·적용 기재를 알려 주시면 국내 B2B 공급·수출 견적과 제품 선정·TDS/SDS 자료 등 기술 지원을 최선을 다해 안내합니다.${STRUCTURAL.has(slug) ? ' 구조 글레이징 등 구조용 적용은 Dow 기술진의 사전 검토가 필요합니다.' : ''}`
      : `Contact Korea Construction Trading (sales@kconstrade.com, +82 10-8939-0284, WhatsApp) with product code, quantity and substrates for B2B domestic/export quotes and technical support.${STRUCTURAL.has(slug) ? ' Structural glazing applications require review by Dow technical staff.' : ''}`,
  })

  return faqs
}

// ───────── 제품 → 관련 기술자료 내부 링크 (실제 존재하는 경로만 사용) ─────────
const RELATED: Record<string, string[]> = {
  'dowsil-firestop-700': ['technical/fire-safety-products', 'technical/linear-joints-walls', 'technical/penetration-seals', 'technical/curtain-wall'],
  'dowsil-993': ['technical/selection/insulating-glass-and-two-part-structural-sealants', 'technical/selection/color-and-packaging-guide', 'technical/curtain-wall', 'technical/industrial/surface-preparation'],
  'dowsil-983': ['technical/selection/insulating-glass-and-two-part-structural-sealants', 'technical/selection/color-and-packaging-guide', 'technical/curtain-wall', 'technical/industrial/surface-preparation'],
  'dowsil-982': ['technical/selection/insulating-glass-and-two-part-structural-sealants', 'technical/selection/color-and-packaging-guide', 'technical/curtain-wall'],
  'dowsil-939': ['technical/selection/insulating-glass-and-two-part-structural-sealants', 'technical/selection/color-and-packaging-guide', 'technical/industrial/surface-preparation'],
  'dowsil-335': ['technical/selection/insulating-glass-and-two-part-structural-sealants', 'technical/selection/color-and-packaging-guide', 'technical/basics/properties-and-functional-groups'],
  'dowsil-995': ['technical/selection/structural-vs-weatherproofing-sealants', 'technical/selection/color-and-packaging-guide', 'technical/curtain-wall', 'technical/industrial/surface-preparation'],
  'dowsil-795': ['technical/selection/structural-vs-weatherproofing-sealants', 'technical/selection/color-and-packaging-guide', 'technical/curtain-wall', 'technical/industrial/surface-preparation'],
  'dowsil-789': ['technical/selection/structural-vs-weatherproofing-sealants', 'technical/selection/color-and-packaging-guide', 'technical/industrial/surface-preparation'],
  'dowsil-791': ['technical/selection/structural-vs-weatherproofing-sealants', 'technical/selection/color-and-packaging-guide', 'technical/curtain-wall', 'technical/industrial/surface-preparation'],
  'dowsil-121': ['technical/selection/structural-vs-weatherproofing-sealants', 'technical/selection/insulating-glass-and-two-part-structural-sealants', 'technical/selection/color-and-packaging-guide'],
  'dowsil-977': ['technical/selection/structural-vs-weatherproofing-sealants', 'technical/selection/color-and-packaging-guide', 'technical/industrial/surface-preparation'],
  'dowsil-991': ['technical/selection/structural-vs-weatherproofing-sealants', 'technical/selection/color-and-packaging-guide', 'technical/industrial/surface-preparation'],
  'dowsil-813c': ['technical/selection/structural-vs-weatherproofing-sealants', 'technical/selection/color-and-packaging-guide', 'technical/industrial/surface-preparation'],
  'dowsil-888': ['technical/selection/color-and-packaging-guide', 'technical/industrial/surface-preparation', 'technical/industrial/application-and-cure'],
  'dowsil-890-sl': ['technical/selection/color-and-packaging-guide', 'technical/industrial/surface-preparation', 'technical/industrial/application-and-cure'],
  'dowsil-902-rcs': ['technical/selection/color-and-packaging-guide', 'technical/industrial/surface-preparation', 'technical/industrial/application-and-cure'],
  'dowsil-650-plus': ['technical/selection/color-and-packaging-guide', 'technical/curtain-wall', 'technical/industrial/surface-preparation'],
  'dowsil-primer-c': ['technical/industrial/primers-and-cleaners', 'technical/industrial/surface-preparation', 'technical/selection/insulating-glass-and-two-part-structural-sealants'],
  'dowsil-allguard-primer': ['technical/industrial/primers-and-cleaners', 'technical/industrial/surface-preparation', 'technical/selection/color-and-packaging-guide'],
  'dowsil-1200-os': ['technical/industrial/primers-and-cleaners', 'technical/industrial/surface-preparation', 'technical/industrial/application-and-cure'],
  'dowsil-rtv-hi-temp': ['technical/industrial/high-temperature-sealants', 'technical/industrial/acetoxy-sealants', 'technical/industrial/which-silicone'],
  'dowsil-786-plus': ['technical/industrial/acetoxy-sealants', 'technical/industrial/which-silicone', 'technical/industrial/application-and-cure'],
  'dowsil-sanitary': ['technical/industrial/acetoxy-sealants', 'technical/industrial/which-silicone', 'technical/selection/color-and-packaging-guide'],
}
const STRUCT = ['technical/selection/structural-vs-weatherproofing-sealants', 'technical/selection/color-and-packaging-guide', 'technical/curtain-wall']
const DEFAULT = ['technical/selection/color-and-packaging-guide', 'technical/industrial/which-silicone', 'technical/industrial/surface-preparation']
const STRUCTURAL_OR_IGU = new Set(['building', 'igu'])

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
