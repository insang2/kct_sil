import type { L } from '@/lib/tech-manual/types'
import raw from './products.json'
import { KO, koColor } from './ko'

export type Group = 'acetoxy' | 'hightemp' | 'alkoxy' | 'oxime' | 'twopart' | 'hotmelt' | 'foam' | 'primer' | 'cleaner'

export interface Variant { color: string; visc: string; snap: string; tack: string; density: string; flow: string; cell: string; hard: string }
export interface IProduct {
  id: string
  name: string // 예: DOWSIL™ 732 Multi-Purpose Sealant
  short: string // 예: DOWSIL™ 732
  brand: string
  group: Group
  chem: string
  features: L
  uses: L
  apps: L
  specs: Record<string, string>
  adhesion: Record<string, string>
  variants?: Variant[]
}

const shortName = (n: string) => {
  const m = n.match(/^(DOWSIL™|XIAMETER™|SILASTIC™)\s+(\S+(?:\s(?:FS|RF|OS|AP|HM-\d+|3in1))?)/)
  // 제품 번호 형태(숫자/알파벳 조합)까지만 짧은 이름으로 사용
  const parts = n.split(' ')
  const brand = parts[0]
  const tail: string[] = []
  for (const w of parts.slice(1)) {
    if (/^[A-Z0-9][A-Za-z0-9\-]*$/.test(w) && /[0-9]/.test(w)) tail.push(w)
    else if (tail.length && /^(FS|RF|OS)$/.test(w)) tail.push(w)
    else if (tail.length) break
    else if (/^(AS|AP|PR-\d+|DS-\d+|R41|EA-\d+|HM-\d+|CTG-\d+|SLT-\d+|Q3-\d+)$/.test(w)) tail.push(w)
    else break
  }
  return m ? `${brand} ${tail.join(' ') || m[2]}` : n
}

type Raw = { id: string; name: string; brand: string; group: string; chem: string; features: string; uses: string; apps: string; specs: Record<string, string>; adhesion: Record<string, string>; variants?: Variant[] }

export const PRODUCTS: IProduct[] = (raw as Raw[]).map((r) => {
  const k = KO[r.id] ?? {}
  return {
    id: r.id,
    name: r.name,
    short: shortName(r.name),
    brand: r.brand.replace('™', ''),
    group: r.group as Group,
    chem: r.chem,
    features: { en: r.features, ko: k.f ?? r.features },
    uses: { en: r.uses, ko: k.u ?? r.uses },
    apps: { en: r.apps, ko: k.a ?? r.apps },
    specs: r.specs,
    adhesion: r.adhesion,
    variants: r.variants,
  }
})

export const byId = (id: string) => PRODUCTS.find((p) => p.id === id)!
export const inGroup = (...g: Group[]) => PRODUCTS.filter((p) => g.includes(p.group)).map((p) => p.id)

export const GROUP_LABEL: Record<Group, L> = {
  acetoxy: { en: 'Acetoxy sealants (one-part)', ko: '아세톡시 실란트 (1액형)' },
  hightemp: { en: 'High-temperature acetoxy sealants', ko: '고온용 아세톡시 실란트' },
  alkoxy: { en: 'Alkoxy neutral-cure sealants (one-part)', ko: '알콕시 중성 경화 실란트 (1액형)' },
  oxime: { en: 'Oxime neutral-cure sealants (one-part)', ko: '옥심 중성 경화 실란트 (1액형)' },
  twopart: { en: 'Two-part alkoxy neutral-cure sealants', ko: '2액형 알콕시 중성 경화 실란트' },
  hotmelt: { en: 'Hot-melt neutral-cure sealants', ko: '핫멜트 중성 경화 실란트' },
  foam: { en: 'Silicone foams (two-part, addition cure)', ko: '실리콘 폼 (2액형, 부가 경화)' },
  primer: { en: 'Primers and adhesion promoters', ko: '프라이머 및 접착 증진제' },
  cleaner: { en: 'Cleaners', ko: '세정제' },
}

// 스펙 행 정의 (그룹별)
export const SEALANT_ROWS: [string, L][] = [
  ['temp', { en: 'Temperature range, °C, continuous (intermittent)', ko: '사용 온도 범위, °C, 연속 (단속)' }],
  ['skin', { en: 'Skin-over time, min', ko: '표면 피막(Skin-over) 시간, 분' }],
  ['tack', { en: 'Tack-free time, min', ko: '표면 건조(Tack-free) 시간, 분' }],
  ['ext', { en: 'Extrusion rate, g/min', ko: '압출 속도, g/min' }],
  ['flow', { en: 'Flow rate, mm', ko: '흐름성, mm' }],
  ['dur', { en: 'Durometer, Shore A', ko: '경도, Shore A' }],
  ['ten', { en: 'Tensile, MPa', ko: '인장 강도, MPa' }],
  ['elo', { en: 'Elongation, %', ko: '신율, %' }],
  ['sg', { en: 'Specific gravity', ko: '비중' }],
  ['listings', { en: 'Listings / specs', ko: '인증·규격' }],
  ['color', { en: 'Color', ko: '색상' }],
  ['fluid', { en: 'Sealant type for fluid resistance table', ko: '내유체성 표의 실란트 유형' }],
]
export const HOTMELT_ROWS: [string, L][] = [
  ['sg', { en: 'Specific gravity', ko: '비중' }],
  ['visc120', { en: 'Viscosity at 120°C, Pa·s', ko: '120°C 점도, Pa·s' }],
  ['green15', { en: '15-min green strength, MPa', ko: '15분 그린 스트렝스, MPa' }],
  ['dur', { en: 'Durometer, Shore A', ko: '경도, Shore A' }],
  ['ten', { en: 'Ultimate tensile strength, MPa', ko: '극한 인장 강도, MPa' }],
  ['elo', { en: 'Ultimate elongation, %', ko: '극한 신율, %' }],
  ['tear', { en: 'Tear strength – Type B, pli', ko: '인열 강도 – Type B, pli' }],
  ['peel', { en: 'Peel strength, pli (180° peel, ASTM C794; 21-day cure + 7-day water immersion)', ko: '박리 강도, pli (180° 박리, ASTM C794; 21일 경화 + 7일 수중 침지)' }],
  ['saft', { en: 'SAFT, °C (minimum; shear adhesion failure temperature, ASTM 4498)', ko: 'SAFT, °C (최소; 전단 접착 파괴 온도, ASTM 4498)' }],
  ['nsf', { en: 'NSF/ANSI Standard 51 and 61', ko: 'NSF/ANSI 표준 51 및 61' }],
  ['fda', { en: 'FDA 21 CFR 177.2600', ko: 'FDA 21 CFR 177.2600' }],
  ['ul94', { en: 'UL 94 (Relative Thermal Index)', ko: 'UL 94 (상대 열 지수)' }],
  ['color', { en: 'Color', ko: '색상' }],
]
export const FOAM_ROWS: [keyof Variant, L][] = [
  ['visc', { en: 'Viscosity, mPa·s', ko: '점도, mPa·s' }],
  ['snap', { en: 'Snap time, sec', ko: '스냅 타임, 초' }],
  ['tack', { en: 'Tack-free time, min', ko: '표면 건조 시간, 분' }],
  ['density', { en: 'Density, kg/m³', ko: '밀도, kg/m³' }],
  ['flow', { en: 'Flowability, cm', ko: '유동성, cm' }],
  ['cell', { en: 'Cell structure, cells/3 cm', ko: '기포 구조, 셀/3 cm' }],
  ['hard', { en: 'Hardness, Shore 00', ko: '경도, Shore 00' }],
]

export const SUBSTRATES = ['Acrylic', 'Acrylonitrile Butadiene Styrene (ABS)', 'Low Density Polyethylene (LDPE)', 'Nylon 6/6', 'Polycarbonate', 'Polypropylene (PP)', 'Glass', 'Aluminum, Mill Finish', 'Copper', 'Steel, Galvanized', 'Steel, Low Carbon', 'Steel, Stainless', 'Duranar, Black', 'Fluropon, White', 'Polyethylene Powder Coatings (PEPC), Black']

export const specRows = (g: Group) => (g === 'hotmelt' ? HOTMELT_ROWS : SEALANT_ROWS)
export { koColor }

// 제품 카드가 있는 페이지 (매트릭스에서 앵커 링크)
export const GROUP_PAGE: Record<Group, string> = {
  acetoxy: 'acetoxy-sealants',
  hightemp: 'high-temperature-sealants',
  alkoxy: 'alkoxy-neutral-cure-sealants',
  oxime: 'two-part-and-oxime-sealants',
  twopart: 'two-part-and-oxime-sealants',
  hotmelt: 'hot-melt-sealants',
  foam: 'silicone-foams',
  primer: 'primers-and-cleaners',
  cleaner: 'primers-and-cleaners',
}
