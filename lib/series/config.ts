import type { IPage, } from '@/lib/industrial/pages'
import type { L } from '@/lib/tech-manual/types'
import { BASICS, BASICS_PDF } from './basics'
import { PSA as PSA_OLD, PSA_PDF, PSA_FORM } from './psa'
import { PSA2, PSA2_PDF, PSA2_FORM } from './psa2'
import { TAPES, TAPES_SOURCE } from './tapes'
import { SELECTION } from './selection'

// 2006년판 페이지는 2024 최신판 뒤에 이어 붙인다 (URL은 그대로 유지)
const PSA: IPage[] = [
  ...PSA2,
  ...PSA_OLD.map((x) => ({ ...x, no: x.no + PSA2.length, doc: '2006 · Form 30-083B-01' })),
]

export interface Series {
  key: 'basics' | 'psa' | 'tapes' | 'selection'
  pdfs?: { href: string; label: L }[] // 내려받을 수 있는 원문 PDF 전체 (없으면 pdf 하나)
  srcLang?: 'ko' | 'en' // 원문 언어 (기본 en)
  pages: IPage[]
  pdf?: string
  source: string
  short: L // 브레드크럼/사이드바용 짧은 이름
  hubTitle: L
  hubDesc: L
  keyFacts: L
  intro: L
  cover: string
  badge: string
  hubFaqCount: number
}

export const SERIES: Record<string, Series> = {
  basics: {
    key: 'basics',
    pages: BASICS,
    pdf: BASICS_PDF,
    source: '다우코닝 실리콘 교육자료 「제 2 장 실리콘 일반」(한국어, 23쪽) — Dow Corning Korea / 한국어 원문 수록 및 영어 번역: 한국건설트레이딩(KCT) / 보충: 공개 문헌 (아래 참고 자료 페이지)',
    short: { en: 'Silicone Basics', ko: '실리콘 일반 교육' },
    hubTitle: { en: 'Silicone Basics Training: Chemistry, Manufacturing, Properties and Applications', ko: '실리콘 일반 교육 – 화학·제조·특성·응용 (다우코닝 교육자료)' },
    hubDesc: {
      en: 'Complete silicone fundamentals in 11 pages: history and nomenclature, direct process, silane, resin, polymer, emulsion, LSR/RTV/HCR rubber, molecular characteristics, properties, applications, usage methods and data appendices (Korean original with English translation).',
      ko: '실리콘의 역사·명명, Direct Process 제조, 실란·레진·폴리머·에멀젼·고무(LSR·RTV·HCR), 분자 특성, 물성, 응용 분야, 사용 방법, 부록 데이터까지 11개 페이지로 수록 (한국어 원문 + 영어 번역).',
    },
    keyFacts: {
      en: 'Silicone is a polymer with an inorganic Si–O backbone and organic CH₃ side groups, made from SiO₂ (sand). The Si–O bond (117 kcal/mol, 130° angle, 0.163 nm, rotation 0.2 kcal/mol) makes it heat-stable and flexible; CH₃ groups give low surface energy (PDMS 20–22 mN/m) and hydrophobicity. It is produced mainly by the Direct Process (Si + CH₃Cl → Me₂SiCl₂ 70–90%) and used as fluid, gum, resin, compound, silane, emulsion and rubber (RTV, LSR, HCR).',
      ko: '실리콘은 모래(SiO₂)에서 얻은 Si-O 무기 주쇄와 CH₃ 유기 측쇄로 이루어진 고분자입니다. Si-O 결합(117 kcal/mol, 결합각 130°, 길이 0.163 nm, 회전 에너지 0.2 kcal/mol)이 내열성과 유연성을, CH₃기가 낮은 표면 에너지(PDMS 20~22 mN/m)와 소수성을 줍니다. 주로 Direct Process(Si + CH₃Cl → Me₂SiCl₂ 70~90%)로 제조하며 Fluid·Gum·Resin·Compound·Silane·Emulsion·Rubber(RTV·LSR·HCR) 형태로 사용합니다.',
    },
    intro: {
      en: 'Chapter 2 “Silicone General” of the Dow Corning training material, reproduced in Korean with an English translation and supplemented with public references.',
      ko: '다우코닝 교육자료 「제 2 장 실리콘 일반」 전문을 한국어 원문 그대로 수록하고 영어 번역과 공개 참고 자료 보충을 더했습니다.',
    },
    cover: '/assets/tech/sb-molecule-3d.jpg',
    badge: 'SILICONE BASICS',
    hubFaqCount: 1,
    srcLang: 'ko',
  },
  psa: {
    key: 'psa',
    pages: PSA,
    pdf: PSA2_PDF,
    pdfs: [
      { href: PSA2_PDF, label: { en: 'Dow Silicone PSAs for High Performance Selection Guide (2024, 12 pp.)', ko: 'Dow 실리콘 PSA 고성능 선택 가이드 (2024, 12쪽)' } },
      { href: PSA_PDF, label: { en: 'Dow Corning High-Performance Silicone PSAs Selection Guide (2006, 9 pp.)', ko: 'Dow Corning 고성능 실리콘 PSA 선택 요령 (2006, 9쪽)' } },
    ],
    source: `Dow, “Silicone PSAs for High Performance Selection Guide”, ${PSA2_FORM} (2024 최신판); Dow Corning, “Product Selection and Application Guide — Dow Corning® brand High-Performance Silicone PSAs”, ${PSA_FORM} (2006 구판). 한국어 번역·정리: 한국건설트레이딩(KCT)`,
    short: { en: 'Silicone PSA Guide', ko: '실리콘 점착제(PSA) 선택 요령' },
    hubTitle: { en: 'High-Performance Silicone PSAs: Product Selection and Application Guide (2024 Update)', ko: '고성능 실리콘 점착제(PSA) 선택 요령 – 제품 선정·가공 가이드 (2024 최신판 반영)' },
    hubDesc: {
      en: 'Dow silicone PSA selection guide in 18 pages: the 2024 edition (application overview table, specifications of 41 PSAs, features, primers, crosslinkers, release coatings, processing and curing) plus the 2006 Dow Corning guide, with a comparison of the two editions (English originals with Korean translation).',
      ko: 'Dow 실리콘 PSA 선택 가이드를 18개 페이지로 수록: 2024 최신판(용도 개요표, PSA 41종 사양, 특징, 프라이머·가교제·이형 코팅제, 가공·경화)과 2006 Dow Corning 가이드, 두 판본의 비교까지 (영어 원문 + 한국어 번역).',
    },
    keyFacts: {
      en: 'The 2024 Dow guide covers 41 DOWSIL™ silicone PSAs, mica binders and solventless adhesives (peroxide or platinum cure) with viscosity, adhesion, probe tack and high-temperature hold: 260 °C for most peroxide grades, 288 °C for Q2-7566 and 300 °C for platinum SD 4600 FC. Platinum-cure bath life is six hours (24 hours in the 2006 guide); peroxide cure uses 0.5–3.0% benzoyl peroxide with solvent removal at 65–93 °C then heat cure. Primer 7499, SYL-OFF™ crosslinkers, anchorage additives and fluorosilicone release coatings complete the system.',
      ko: '2024 Dow 가이드는 과산화물 또는 백금 경화 DOWSIL™ 실리콘 PSA·마이카 바인더·무용제 점착제 41종의 점도, 접착력, 프로브 택, 고온 유지력을 수록합니다. 고온 유지력은 대부분의 과산화물 등급 260 °C, Q2-7566 288 °C, 백금 SD 4600 FC 300 °C입니다. 백금 경화 배스 수명은 6시간(2006년판은 24시간), 과산화물 경화는 과산화벤조일 0.5~3.0%를 쓰며 65~93 °C 용제 제거 후 열 경화합니다. 프라이머 7499, SYL-OFF™ 가교제·앵커리지 첨가제·불소실리콘 이형 코팅제가 시스템을 완성합니다.',
    },
    intro: {
      en: 'Both Dow guides are reproduced in English with a Korean translation: the 2024 edition (Form No. 30-1315-01-0524) first, then the 2006 Dow Corning edition (Form No. 30-083B-01). Dow Corning products are now marketed under the DOWSIL™ brand.',
      ko: 'Dow 가이드 두 종을 영어 원문과 한국어 번역으로 수록했습니다. 2024 최신판(Form No. 30-1315-01-0524)을 먼저, 이어서 2006 Dow Corning판(Form No. 30-083B-01)입니다. Dow Corning 제품은 현재 DOWSIL™ 브랜드로 판매됩니다.',
    },
    cover: '/assets/tech/psa2-cover.jpg',
    badge: 'PSA SELECTION GUIDE',
    hubFaqCount: 1,
  },
  selection: {
    key: 'selection',
    pages: SELECTION,
    source: 'Dow 제품 기술 데이터시트(TDS)의 대표 특성을 한국건설트레이딩(KCT)이 같은 기준으로 요약·비교 (각 제품 페이지의 TDS PDF 참조). 수치는 시방용이 아님',
    short: { en: 'Sealant Comparison', ko: '실란트 비교·선택' },
    hubTitle: { en: 'DOWSIL Sealant Comparison and Selection Guide: Structural, Weatherproofing, Insulating Glass', ko: 'DOWSIL 실란트 비교·선택 가이드 – 구조용·내후성·복층유리' },
    hubDesc: {
      en: 'Data-driven comparison of DOWSIL structural glazing, weatherproofing, stone/concrete and insulating-glass sealants (789, 791, 795, 995, 121, 977, 991, 813C, 335, 939, 982, 983, 993) from their TDS.',
      ko: 'DOWSIL 구조용·내후성·석재·콘크리트·복층유리 실란트(789·791·795·995·121·977·991·813C·335·939·982·983·993)를 TDS 기준으로 비교한 선택 가이드.',
    },
    keyFacts: {
      en: 'DOWSIL™ 995 is the high-strength one-part structural glazing sealant, 795 combines ASTM C1184 structural capability with ±50% movement, 789/791 are weatherproofing sealants, 977/991 reduce staining on stone, 813C suits concrete; for insulating glass, 335 is the butyl primary seal and 939/982/983/993 are two-part secondary or structural sealants. Structural applications require review by Dow technical staff.',
      ko: 'DOWSIL™ 995는 고강도 1액형 구조 글레이징 실란트, 795는 ASTM C1184 구조 성능과 ±50% 움직임을 겸하고, 789·791은 웨더실링, 977·991은 석재 오염 저감, 813C는 콘크리트용입니다. 복층유리는 335가 부틸 1차 씰, 939·982·983·993이 2액형 2차·구조 실란트입니다. 구조용 적용은 Dow 기술진의 검토가 필요합니다.',
    },
    intro: {
      en: 'Compare the DOWSIL sealants side by side with the same criteria from each Dow TDS, then ask Korea Construction Trading to confirm the choice for your project.',
      ko: '각 Dow TDS의 같은 기준으로 DOWSIL 실란트를 나란히 비교하고, 프로젝트에 맞는지 한국건설트레이딩에 확인하십시오.',
    },
    cover: '/assets/tech/cover.jpg',
    badge: 'SEALANT SELECTION',
    hubFaqCount: 1,
  },
  tapes: {
    key: 'tapes',
    pages: TAPES,
    pdf: PSA2_PDF,
    pdfs: [
      { href: PSA2_PDF, label: { en: 'Dow Silicone PSAs for High Performance Selection Guide (2024, 12 pp.)', ko: 'Dow 실리콘 PSA 고성능 선택 가이드 (2024, 12쪽)' } },
      { href: PSA_PDF, label: { en: 'Dow Corning High-Performance Silicone PSAs Selection Guide (2006, 9 pp.)', ko: 'Dow Corning 고성능 실리콘 PSA 선택 요령 (2006, 9쪽)' } },
    ],
    source: TAPES_SOURCE,
    short: { en: 'Electrical Tape PSAs', ko: '전기·전자 테이프용 PSA' },
    hubTitle: { en: 'Silicone PSAs for Electrical and Electronics Tapes: Products, Selection and KCT Support', ko: '전기·전자 테이프용 실리콘 PSA – 제품·선정·한국건설트레이딩 기술 지원' },
    hubDesc: {
      en: 'Electrical and electronics tape hub in 4 pages: Dow’s Korean page in full, the 20 Dow insulation-tape PSA products with typical properties, a selection table by tape use and KCT’s technical support information.',
      ko: '전기·전자 테이프 허브 4페이지: Dow 한국어 페이지 전문, 절연테이프용 Dow 점착제 20종과 대표 물성, 테이프 용도별 선정표, 한국건설트레이딩 기술 지원 안내.',
    },
    keyFacts: {
      en: 'Dow silicone PSAs for electrical insulation tapes (motor windings, transformers, capacitors, connectors) combine excellent adhesion and strength, high heat resistance and compatibility with PTFE, polyimide and glass-fiber substrates; for splicing tapes they offer high adhesion to low-energy surfaces or quick stick/high holding for flying splices. Dow Korea lists 20 insulation-tape PSA products; the 2024 guide marks DOWSIL™ 7268, Q2-7406, 7388, 7406-VLO, 7355, 7356, 7357, 7358, Q2-7566 and SD 4600 FC for insulation tapes (hold up to 240–300 °C).',
      ko: '전기 절연 테이프(모터 권선, 변압기, 커패시터, 커넥터)용 Dow 실리콘 PSA는 우수한 밀착성과 강도, 높은 내열성, PTFE·폴리이미드·유리섬유 기재와의 호환성을 갖추고, 스플라이싱 테이프용으로는 저에너지 표면에 대한 높은 접착력 또는 플라잉 스플라이스용 빠른 스틱·높은 고정성을 제공합니다. Dow 한국은 절연테이프용 점착제 20종을 분류하며, 2024 가이드는 절연 테이프용으로 DOWSIL™ 7268, Q2-7406, 7388, 7406-VLO, 7355, 7356, 7357, 7358, Q2-7566, SD 4600 FC를 표시합니다(유지력 240~300 °C).',
    },
    intro: {
      en: 'A related hub to the silicone PSA selection guide, focused on electrical and electronics tapes, with Korea Construction Trading’s technical support information.',
      ko: '실리콘 PSA 선택 가이드와 연결되는 관련 허브로, 전기·전자 테이프에 초점을 맞추고 한국건설트레이딩의 기술 지원 안내를 담았습니다.',
    },
    cover: '/assets/tech/psa2-cover.jpg',
    badge: 'ELECTRICAL TAPE PSA',
    hubFaqCount: 1,
    srcLang: 'ko',
  },
}

export const SERIES_KEYS = Object.keys(SERIES)
