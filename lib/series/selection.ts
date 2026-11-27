import { p, h, ul, note, sec, IMG } from '@/lib/tech-manual/types'
import type { Cell, Block } from '@/lib/tech-manual/types'
import type { IPage } from '@/lib/industrial/pages'
import { bySlug } from '@/lib/products-catalog'
import { localizeCatalog } from '@/lib/products-catalog-en'

// DOWSIL 건축용 실란트 비교·선택 가이드 — 제품 TDS 요약(카탈로그)을 같은 기준으로 나란히 비교한 데이터 기반 페이지
// 수치는 Dow TDS의 대표 특성이며 시방용이 아닙니다.
const bi = (en: string, ko: string): Cell => [en, ko]

const val = (slug: string, keys: string[]): Cell => {
  const c = bySlug(slug)
  if (!c) return '–'
  const en = localizeCatalog(c, 'en').specs
  const k = keys.find((x) => c.specs[x])
  if (!k) return '–'
  // 영문 키 매핑은 enSpecs 변환 결과 순서가 같으므로 값 위치로 찾는다
  const idx = Object.keys(c.specs).indexOf(k)
  const enVal = Object.values(en)[idx] ?? c.specs[k]
  return [enVal, c.specs[k]]
}

const nameCell = (slug: string): Cell => bySlug(slug)?.name ?? slug

const COLS: { head: Cell; keys: string[] }[] = [
  { head: bi('Type', '제품 유형'), keys: ['제품 유형'] },
  { head: bi('Movement capability', '움직임 허용치'), keys: ['움직임 허용치'] },
  { head: bi('Hardness (Shore A)', '경도 (Shore A)'), keys: ['경도 (Shore A)', '경도'] },
  { head: bi('Ultimate tensile strength', '최대 인장강도'), keys: ['최대 인장강도'] },
  { head: bi('Ultimate elongation', '최대 신율'), keys: ['최대 신율'] },
  { head: bi('Skin-over / tack-free', '표면경화·택프리'), keys: ['표면경화시간', 'Skin-over / Tack-free', 'Tack-free time'] },
  { head: bi('Full cure / handling', '완전경화·취급 가능'), keys: ['완전경화시간', 'Unit handling time', '완전 접착시간'] },
  { head: bi('Working time', '가사시간'), keys: ['가사시간'] },
]

const compareTable = (slugs: string[], title: { en: string; ko: string }, noteTxt: { en: string; ko: string }): Block => ({
  k: 'tbl', big: true, title,
  head: [bi('Product', '제품'), ...COLS.map((c) => c.head)],
  rows: slugs.map((s) => [nameCell(s), ...COLS.map((c) => val(s, c.keys))]),
  note: noteTxt,
})

const NOTE = {
  en: 'Typical values summarized from each product’s Dow TDS (different test conditions per product). “–” = not stated in the summarized TDS. Not for specifications; see each TDS and ask KCT for confirmation.',
  ko: '각 제품 Dow TDS의 대표 특성을 요약한 값으로 제품마다 시험 조건이 다를 수 있습니다. 「–」는 요약한 TDS에 표기가 없다는 뜻입니다. 시방용이 아니며 각 TDS를 확인하고 한국건설트레이딩에 확인하십시오.',
}

const SUP = {
  q: { en: 'Which DOWSIL sealant should I choose?', ko: '어떤 DOWSIL 실란트를 선택해야 합니까?' },
  a: {
    en: 'Tell Korea Construction Trading (KCT) the substrates, joint movement, structural or weatherproofing duty and environment — sales@kconstrade.com, +82 10-8939-0284. We do our best to support product selection.',
    ko: '기재, 조인트 움직임, 구조용/웨더실링 용도와 환경을 한국건설트레이딩에 알려 주십시오(sales@kconstrade.com, 010-8939-0284). 제품 선정을 최선을 다해 지원합니다.',
  },
}

export const SELECTION: IPage[] = [
  {
    slug: 'structural-vs-weatherproofing-sealants', no: 1, pdfPages: '—', doc: 'TDS 요약',
    title: { en: 'DOWSIL Structural Glazing vs. Weatherproofing Sealants: 789, 791, 795, 995, 121, 977, 991, 813C Compared', ko: 'DOWSIL 구조용·내후성 실란트 비교: 789·791·795·995·121·977·991·813C' },
    summary: { en: 'Side-by-side comparison of DOWSIL 789, 791, 795, 995, 121, 977, 991 and 813C from their TDS: structural vs. weatherproofing duty, movement capability, hardness, strength and cure.', ko: 'DOWSIL 789·791·795·995·121·977·991·813C를 TDS 기준으로 나란히 비교: 구조용 vs 내후성 용도, 움직임 허용치, 경도, 강도, 경화.' },
    answer: {
      en: 'DOWSIL™ 995 is the high-strength one-part neutral structural glazing sealant; DOWSIL™ 795 combines ASTM C1184 structural capability with ±50% weatherseal movement; DOWSIL™ 121 is a fast two-part structural/weatherseal sealant for repair and reglazing; DOWSIL™ 789 and 791 are one-part neutral weatherproofing sealants (±50%); DOWSIL™ 977 and 991 are medium-modulus sealants for porous stone and metal panels with low staining; DOWSIL™ 813C is a low-modulus sealant for concrete and masonry.',
      ko: 'DOWSIL™ 995는 고강도 1액형 중성 구조 글레이징 실란트, DOWSIL™ 795는 ASTM C1184 구조 성능과 ±50% 웨더실링 움직임을 겸하는 제품, DOWSIL™ 121은 보수·재글레이징용 빠른 2액형 구조/웨더실 실란트, DOWSIL™ 789·791은 1액형 중성 내후성 실란트(±50%), DOWSIL™ 977·991은 다공성 석재·금속 패널용 오염 저감 중모듈러스 실란트, DOWSIL™ 813C는 콘크리트·조적용 저모듈러스 실란트입니다.',
    },
    image: IMG('cover'),
    sections: [
      sec('which', 'Structural glazing vs. weatherproofing', '구조 글레이징 vs 웨더실링',
        p('Structural glazing sealants bond glass or panels to the frame so that the sealant carries the load; weatherproofing sealants keep rain and air out of movement joints. Several DOWSIL products serve both duties. Structural glazing applications require review by Dow technical staff.',
          '구조 글레이징 실란트는 유리나 패널을 프레임에 접착해 실란트가 하중을 부담하게 하고, 웨더실링 실란트는 움직임이 있는 조인트에서 비와 공기를 막습니다. 일부 DOWSIL 제품은 두 용도를 겸합니다. 구조 글레이징 적용은 Dow 기술진의 검토가 필요합니다.'),
        ul(
          ['Structural: DOWSIL™ 995, 795 (ASTM C1184), 121 (two-part, fast)', '구조용: DOWSIL™ 995, 795(ASTM C1184), 121(2액형, 속경화)'],
          ['Weatherproofing: DOWSIL™ 789, 791, 795 (±50% movement)', '웨더실링: DOWSIL™ 789, 791, 795(±50% 움직임)'],
          ['Stone and metal panels (low staining): DOWSIL™ 977, 991', '석재·금속 패널(오염 저감): DOWSIL™ 977, 991'],
          ['Concrete and masonry: DOWSIL™ 813C', '콘크리트·조적: DOWSIL™ 813C'],
        )),
      sec('table', 'Comparison table', '비교표',
        compareTable(['dowsil-789', 'dowsil-791', 'dowsil-795', 'dowsil-995', 'dowsil-121', 'dowsil-977', 'dowsil-991', 'dowsil-813c'],
          { en: 'DOWSIL 789 / 791 / 795 / 995 / 121 / 977 / 991 / 813C', ko: 'DOWSIL 789 / 791 / 795 / 995 / 121 / 977 / 991 / 813C' }, NOTE)),
      sec('links', 'Product pages', '제품 페이지',
        ul(...['dowsil-789', 'dowsil-791', 'dowsil-795', 'dowsil-995', 'dowsil-121', 'dowsil-977', 'dowsil-991', 'dowsil-813c'].map((s): [string, string] => {
          const c = bySlug(s)!
          const e = localizeCatalog(c, 'en')
          return [`${c.name} — ${e.summary}: https://kconstrade.com/en/products/${s}`, `${c.name} — ${c.summary}: https://kconstrade.com/ko/products/${s}`]
        }))),
    ],
    faq: [
      { q: { en: 'What is the difference between DOWSIL 795 and 995?', ko: 'DOWSIL 795와 995의 차이는 무엇입니까?' }, a: { en: 'DOWSIL™ 995 is a high-strength one-part structural glazing sealant; DOWSIL™ 795 meets ASTM C1184 for structural glazing and, with ±50% movement (ASTM C719 Class 50), can also be used as a weatherseal.', ko: 'DOWSIL™ 995는 고강도 1액형 구조 글레이징 실란트이고, DOWSIL™ 795는 ASTM C1184 구조 글레이징 규격을 만족하면서 ±50% 움직임(ASTM C719 Class 50)으로 웨더실링에도 쓸 수 있습니다.' } },
      { q: { en: 'Which DOWSIL sealant suits porous stone without staining?', ko: '다공성 석재에 오염 없이 쓰려면 어떤 제품입니까?' }, a: { en: 'DOWSIL™ 977 and 991 are medium-modulus sealants for stone, glass and metal panels with reduced staining.', ko: '석재·유리·금속 패널용으로 오염을 줄인 중모듈러스 실란트인 DOWSIL™ 977과 991입니다.' } },
      SUP,
    ],
  },

  {
    slug: 'insulating-glass-and-two-part-structural-sealants', no: 2, pdfPages: '—', doc: 'TDS 요약',
    title: { en: 'DOWSIL Insulating Glass and Two-Part Structural Sealants: 335, 939, 982, 983, 993, 121 Compared', ko: 'DOWSIL 복층유리·2액형 구조 실란트 비교: 335·939·982·983·993·121' },
    summary: { en: 'Comparison of the primary butyl seal DOWSIL 335 and the two-part secondary / structural sealants 939, 982, 983, 993 and 121 from their TDS.', ko: '1차 씰 부틸 DOWSIL 335와 2액형 2차·구조 실란트 939·982·983·993·121을 TDS 기준으로 비교.' },
    answer: {
      en: 'DOWSIL™ 335 is the polyisobutylene primary seal of an insulating glass unit; DOWSIL™ 939 is a two-part secondary sealant for residential IG; DOWSIL™ 982 is a two-part secondary seal that can provide structural support; DOWSIL™ 983 is a two-part structural sealant for factory glazing and curtain-wall production; DOWSIL™ 993 meets European (EOTA) and Chinese GB requirements; DOWSIL™ 121 is a fast two-part structural/weatherseal sealant for repair and reglazing.',
      ko: 'DOWSIL™ 335는 복층유리의 폴리이소부틸렌 1차 씰, DOWSIL™ 939는 주거용 복층유리 2차 씰링 2액형, DOWSIL™ 982는 구조 지지가 가능한 2차 씰링 2액형, DOWSIL™ 983은 공장 글레이징·커튼월 생산용 2액형 구조 실란트, DOWSIL™ 993은 유럽(EOTA)·중국 GB 규격을 만족하는 2액형 구조 실란트, DOWSIL™ 121은 보수·재글레이징용 속경화 2액형 구조/웨더실 실란트입니다.',
    },
    image: IMG('cover'),
    sections: [
      sec('roles', 'Primary seal, secondary seal and structural bonding', '1차 씰 · 2차 씰 · 구조 접착',
        ul(
          ['Primary seal (gas and moisture barrier): DOWSIL™ 335', '1차 씰(기체·수분 차단): DOWSIL™ 335'],
          ['Secondary seal: DOWSIL™ 939 (residential), 982 (structural support possible)', '2차 씰: DOWSIL™ 939(주거용), 982(구조 지지 가능)'],
          ['Factory glazing / curtain-wall structural bonding: DOWSIL™ 983, 993', '공장 글레이징·커튼월 구조 접착: DOWSIL™ 983, 993'],
          ['On-site repair and reglazing: DOWSIL™ 121 (24–48 h handling)', '현장 보수·재글레이징: DOWSIL™ 121(24~48시간 내 취급)'],
        ),
        note('Structural glazing applications require review by Dow technical staff. Two-part products need metered, air-free mixing equipment.', '구조 글레이징 적용은 Dow 기술진의 검토가 필요합니다. 2액형 제품은 정량·무기포 혼합 설비가 필요합니다.')),
      sec('table', 'Comparison table', '비교표',
        compareTable(['dowsil-335', 'dowsil-939', 'dowsil-982', 'dowsil-983', 'dowsil-993', 'dowsil-121'],
          { en: 'DOWSIL 335 / 939 / 982 / 983 / 993 / 121', ko: 'DOWSIL 335 / 939 / 982 / 983 / 993 / 121' }, NOTE)),
    ],
    faq: [
      { q: { en: 'Which DOWSIL sealant is the primary seal of an insulating glass unit?', ko: '복층유리 1차 씰에는 어떤 제품을 씁니까?' }, a: { en: 'DOWSIL™ 335, a polyisobutylene (butyl) sealant.', ko: '폴리이소부틸렌(부틸) 계열인 DOWSIL™ 335입니다.' } },
      { q: { en: 'What is the difference between DOWSIL 983 and 993?', ko: 'DOWSIL 983과 993의 차이는 무엇입니까?' }, a: { en: 'Both are two-part neutral-cure structural sealants; DOWSIL™ 983 targets factory glazing and curtain-wall production, while DOWSIL™ 993 additionally meets European (EOTA) and Chinese GB 16776 requirements.', ko: '둘 다 2액형 중성 경화 구조 실란트입니다. DOWSIL™ 983은 공장 글레이징·커튼월 생산용이고, DOWSIL™ 993은 유럽(EOTA)과 중국 GB 16776 규격도 만족합니다.' } },
      SUP,
    ],
  },
]
void h
