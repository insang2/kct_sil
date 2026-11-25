import type { IPage, } from '@/lib/industrial/pages'
import type { L } from '@/lib/tech-manual/types'
import { BASICS, BASICS_PDF } from './basics'
import { PSA, PSA_PDF, PSA_FORM } from './psa'

export interface Series {
  key: 'basics' | 'psa'
  pages: IPage[]
  pdf: string
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
  },
  psa: {
    key: 'psa',
    pages: PSA,
    pdf: PSA_PDF,
    source: `Dow Corning, “Product Selection and Application Guide — Dow Corning® brand High-Performance Silicone PSAs”, ${PSA_FORM}. 한국어 번역·정리: 한국건설트레이딩(KCT)`,
    short: { en: 'Silicone PSA Guide', ko: '실리콘 점착제(PSA) 선택 요령' },
    hubTitle: { en: 'High-Performance Silicone PSAs: Product Selection and Application Guide', ko: '고성능 실리콘 점착제(PSA) 선택 요령 – 제품 선정·가공 가이드' },
    hubDesc: {
      en: 'Dow Corning silicone pressure sensitive adhesive guide in 9 pages: selection flow chart, platinum vs. peroxide cure, 11-product table, tack/adhesion/high-temperature hold charts, coating, curing, oven dusting, anchorage and release (English original with Korean translation).',
      ko: 'Dow Corning 실리콘 감압 점착제(PSA) 가이드를 9개 페이지로 수록: 선정 플로 차트, 백금·과산화물 경화 비교, 11개 제품 표, 택·접착력·고온 유지력 그래프, 도포·경화·오븐 분진·앵커리지·이형 (영어 원문 + 한국어 번역).',
    },
    keyFacts: {
      en: 'Dow Corning silicone PSAs are polydimethylsiloxane gum/resin dispersions in xylene or xylene/toluene with platinum cure (2013, 7657, 7659 + Syl-Off 4000 Catalyst) or peroxide cure (280A, 282, 7355, 7356, 7358, Q2-7406, Q2-7566, Q2-7735). Service range is −73 to 260 °C (−100 to 500 °F); Q2-7406 and Q2-7566 hold to 288 °C (550 °F). Platinum cure runs from 80 °C with a 24-hour bath life; peroxide cure uses 0.5–3.0% benzoyl peroxide and a two-step graded cure.',
      ko: 'Dow Corning 실리콘 PSA는 자일렌 또는 자일렌/톨루엔에 분산된 폴리디메틸실록산 검·레진이며 백금 경화(2013·7657·7659 + Syl-Off 4000 Catalyst) 또는 과산화물 경화(280A·282·7355·7356·7358·Q2-7406·Q2-7566·Q2-7735) 방식입니다. 사용 온도는 −73~260 °C(−100~500 °F), Q2-7406·Q2-7566은 288 °C(550 °F)까지 유지됩니다. 백금 경화는 80 °C부터 가능하고 배스 수명 24시간, 과산화물 경화는 과산화벤조일 0.5~3.0%와 2단계 구배 경화를 씁니다.',
    },
    intro: {
      en: 'The complete Dow Corning guide (Form No. 30-083B-01) reproduced in English with a Korean translation. Product names are as printed in the original; Dow silicones are now marketed under the DOWSIL™ brand.',
      ko: 'Dow Corning 가이드(Form No. 30-083B-01) 전문을 영어 원문과 한국어 번역으로 수록했습니다. 제품명은 원문 표기 그대로이며 현재 Dow 실리콘은 DOWSIL™ 브랜드로 판매됩니다.',
    },
    cover: '/assets/tech/psa-cover-lab.jpg',
    badge: 'PSA SELECTION GUIDE',
    hubFaqCount: 1,
  },
}

export const SERIES_KEYS = Object.keys(SERIES)
