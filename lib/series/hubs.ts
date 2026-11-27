import type { Metadata } from 'next'
import { PAGES, getPage } from '@/lib/tech-manual'
import { IPAGES, getIPage } from '@/lib/industrial/pages'
import { SERIES, type Series } from './config'

export const TECH_UPDATED = '2026-11-27'

export interface Hub { key: string; path: string; title: { ko: string; en: string }; desc: { ko: string; en: string }; count: number; icon: string }

// 기술정보 4개 자료 허브 (메뉴·관련 자료·검색에서 공통 사용)
export const HUBS: Hub[] = [
  { key: 'fire', path: 'technical', icon: 'bi-fire', count: PAGES.length,
    title: { ko: '내화 실란트 기술 매뉴얼', en: 'Fire-rated Sealant Technical Manual' },
    desc: { ko: '화재 반응성·내화 성능, 선형 줄눈·관통부 시험, 연기 차단, 시공 지침', en: 'Reaction to fire, fire resistance, linear joints, penetrations, smoke control, installation' } },
  { key: 'industrial', path: 'technical/industrial', icon: 'bi-gear-wide-connected', count: IPAGES.length,
    title: { ko: '산업·가전·유지보수용 선정 가이드', en: 'Industrial, Appliance & Maintenance Guide' },
    desc: { ko: '아세톡시·알콕시·옥심·핫멜트 실란트와 실리콘 폼 38개 제품', en: '38 acetoxy, alkoxy, oxime, hot-melt sealants and silicone foams' } },
  { key: 'basics', path: 'technical/basics', icon: 'bi-mortarboard', count: SERIES.basics.pages.length,
    title: { ko: '실리콘 일반 교육', en: 'Silicone Basics Training' },
    desc: { ko: '실리콘의 화학·제조·특성·응용과 부록 데이터', en: 'Silicone chemistry, manufacturing, properties, applications and data' } },
  { key: 'psa', path: 'technical/psa', icon: 'bi-tape', count: SERIES.psa.pages.length,
    title: { ko: '실리콘 점착제(PSA) 선택 요령', en: 'Silicone PSA Selection Guide' },
    desc: { ko: '2024 최신판 포함, PSA 41종의 사양·선정·도포·경화·이형', en: '2024 edition included: 41 PSAs — specifications, selection, coating, cure, release' } },
  { key: 'selection', path: 'technical/selection', icon: 'bi-columns-gap', count: SERIES.selection.pages.length,
    title: { ko: 'DOWSIL 실란트 비교·선택', en: 'Sealant Comparison Guide' },
    desc: { ko: '구조용·내후성·복층유리 실란트 13종을 TDS 기준으로 비교', en: '13 structural, weatherproofing and insulating-glass sealants compared from TDS' } },
  { key: 'tapes', path: 'technical/tapes', icon: 'bi-lightning-charge', count: SERIES.tapes.pages.length,
    title: { ko: '전기·전자 테이프용 PSA', en: 'Electrical Tape PSAs' },
    desc: { ko: '절연테이프용 Dow 점착제 20종, 선정표, 한국건설트레이딩 기술 지원', en: '20 Dow insulation-tape PSAs, selection table, KCT technical support' } },
]

export interface SearchItem { t: string; s: string; href: string; hub: string }

export function searchIndex(lang: string, l: 'ko' | 'en'): SearchItem[] {
  const hubName = (k: string) => HUBS.find((h) => h.key === k)!.title[l]
  return [
    ...PAGES.map((p) => ({ t: p.title[l], s: p.summary[l], href: `/${lang}/technical/${p.slug}`, hub: hubName('fire') })),
    ...IPAGES.map((p) => ({ t: p.title[l], s: p.summary[l], href: `/${lang}/technical/industrial/${p.slug}`, hub: hubName('industrial') })),
    ...Object.values(SERIES).flatMap((x) => x.pages.map((p) => ({ t: p.title[l], s: p.summary[l], href: `/${lang}/technical/${x.key}/${p.slug}`, hub: hubName(x.key) }))),
  ]
}

// ───────── 기술정보 SEO 메타 (ko 제목 ≤40자·설명 80~110자 / en 제목 ≤60자·설명 120~155자) ─────────
const BASE = 'https://kconstrade.com'
const SITE_NAME = '한국건설트레이딩 (KCT)'
const normTechLang = (lang: string): 'ko' | 'en' => (lang === 'ko' ? 'ko' : 'en')

type MetaPair = { title: { ko: string; en: string }; description: { ko: string; en: string } }

const FIRE_META: Record<string, MetaPair> = {
  'introduction': {
    title: { ko: '내화 실란트 매뉴얼 적용 범위·개요 | KCT', en: 'Fire-Rated Sealant Manual: Scope & Intro | KCT' },
    description: {
      ko: 'Dow 내화 실란트 기술 매뉴얼의 적용 범위와 고층 건축물·외벽 화재 방호에서 내화 실리콘 실란트가 맡는 핵심 역할을 한국어·영문으로 안내합니다.',
      en: 'Learn what the Dow fire-rated sealant technical manual covers and why silicone sealants matter for fire protection in high-rise buildings and façades.',
    },
  },
  'fire-safety-products': {
    title: { ko: 'DOWSIL 내화 실란트 제품군·주요 물성 | KCT', en: 'DOWSIL™ Fire Safety Sealant Product Range | KCT' },
    description: {
      ko: '건 타입·자기수평형·실리콘 RTV 폼 등 DOWSIL™ 내화 실란트 제품군 구성과 경화 방식, 주요 대표 물성 특징을 한눈에 비교해 정리했습니다.',
      en: 'Compare gun-grade, self-leveling and RTV foam products in the DOWSIL™ fire-rated sealant range, including typical properties and building fire uses.',
    },
  },
  'silicone-chemistry': {
    title: { ko: '내화 실리콘 화학·실리카 차르 형성 | KCT', en: 'Silicone Chemistry & Silica Char in Fire | KCT' },
    description: {
      ko: '모래(SiO₂)에서 실리콘 고무가 만들어지는 화학 구조와, 경화된 실리콘 실란트가 화재 고열에 노출될 때 실리카 차르를 형성하는 원리를 설명합니다.',
      en: 'Understand how silicone rubber is derived from sand and how cured silicone sealants form a protective silica char layer when exposed to fire.',
    },
  },
  'reaction-to-fire': {
    title: { ko: '화재 반응성(Reaction to Fire) 유로클래스 | KCT', en: 'Reaction to Fire: Euroclasses & EN Tests | KCT' },
    description: {
      ko: '재료가 화재 발달에 미치는 영향을 평가하는 유로클래스(A1~F)와 EN ISO 1716·13823·11925 시험 방법 및 대체 규격을 정리했습니다.',
      en: 'How building materials contribute to fire growth: Euroclass ratings, EN ISO 1716, EN 13823 and EN ISO 11925 test methods, and alternative standards.',
    },
  },
  'classification': {
    title: { ko: 'DOWSIL 내화 실란트 EN 13501-1 등급 분류 | KCT', en: 'EN 13501-1 Classification of DOWSIL™ Sealants | KCT' },
    description: {
      ko: 'DOWSIL™ 내화 실란트 제품별 화재 반응성 시험 결과와 EN 13501-1 등급(B,s2,d0 및 E 등급) 분류 기준을 도표와 함께 안내합니다.',
      en: 'Review reaction-to-fire test results and EN 13501-1 classifications (B,s2,d0 and E) for each DOWSIL™ fire-rated silicone sealant in the Dow manual.',
    },
  },
  'fire-resistance': {
    title: { ko: '내화 성능(Fire Resistance)·차염·차열 기준 | KCT', en: 'Fire Resistance: Integrity (E) & Insulation (I) | KCT' },
    description: {
      ko: '방화구획의 선형 줄눈·관통부 내화 성능, 차염성(E)·차열성(I) 판정 기준, EN·BS·UL·ASTM 국제 내화 시험 규격을 체계적으로 정리했습니다.',
      en: 'Compartmentation, linear joints and penetration seals explained: integrity (E) and insulation (I) criteria with EN, BS, UL and ASTM fire test standards.',
    },
  },
  'detailing': {
    title: { ko: '내화 상세 설계·EN 15882 적용 범위 확장 | KCT', en: 'Fire Detailing & EN 15882 Extended Scope | KCT' },
    description: {
      ko: '내화 성능을 좌우하는 줄눈·구조체·관통부 설계 변수와 EN 15882 적용 범위 확장 규칙 및 실제 분류 사례를 Dow 매뉴얼 기준으로 안내합니다.',
      en: 'Joint, construction and penetration parameters that govern fire resistance, plus EN 15882 extended application rules and worked classification examples.',
    },
  },
  'linear-joint-types': {
    title: { ko: '선형 줄눈 내화 시험 – 실링 유형 L1~L4 | KCT', en: 'Linear Joint Fire Tests: Seal Types L1–L4 | KCT' },
    description: {
      ko: '벽체와 바닥의 선형 줄눈 내화 시험에 적용된 네 가지 대표 실링 설계(L1~L4) 단면 구성과 내화 시험 결과표 해석을 위한 범례를 제공합니다.',
      en: 'Guide to the four tested linear joint seal designs (L1 to L4) used across wall and floor fire tests, with clear diagrams and table legend definitions.',
    },
  },
  'linear-joints-walls': {
    title: { ko: '벽체 선형 줄눈 내화 시험 결과 (E/I) | KCT', en: 'Linear Joints in Walls: Fire Test Results | KCT' },
    description: {
      ko: '벽체 조건에서 시험된 DOWSIL™ Firestop 700, 813FR, 790의 선형 줄눈 단면 설계와 차염성(E)·차열성(I) 시험 결과 전체를 수록했습니다.',
      en: 'Complete wall linear joint designs and fire resistance test results (E and I ratings) for DOWSIL™ Firestop 700, 813FR and 790 from the Dow manual.',
    },
  },
  'linear-joints-floors': {
    title: { ko: '바닥 선형 줄눈 내화 시험 결과 (E/I) | KCT', en: 'Linear Joints in Floors: Fire Test Results | KCT' },
    description: {
      ko: '바닥 조건에서 시험된 DOWSIL™ Smoke Seal 800SL, 790, 3-6548 폼의 선형 줄눈 설계, 전단 이동 조건 및 내화 시험 결과를 수록했습니다.',
      en: 'Tested floor linear joint designs, shear movement conditions and fire test results for DOWSIL™ Smoke Seal 800SL, 790 and 3-6548 silicone RTV foam.',
    },
  },
  'penetration-seals': {
    title: { ko: '배관·케이블 관통부 실링 내화 시험 결과 | KCT', en: 'Penetration Seals: Pipe & Cable Test Results | KCT' },
    description: {
      ko: '벽체와 바닥에서 시험된 배관·케이블 관통부 실링(EN 1366-3, BS 476-22, GB 23864) 시험 결과와 대표 도면 P1~P3를 상세히 정리했습니다.',
      en: 'Tested pipe and cable penetration seals in walls and floors under EN 1366-3, BS 476-22 and GB 23864, complete with drawings P1 to P3 and test ratings.',
    },
  },
  'smoke-barriers': {
    title: { ko: '연기 차단(Smoke Barrier)·EN 12101-1 | KCT', en: 'Smoke Barriers & EN 12101-1 Test Results | KCT' },
    description: {
      ko: '화재 시 연기 확산 방지의 중요성과 바닥-벽 접합부 미네랄울·자기수평형 실리콘 시공 구성, EN 12101-1 연기 차단 시험 결과를 안내합니다.',
      en: 'Why controlling smoke spread matters in fire design, mineral wool with self-leveling silicone at floor-to-wall junctions, and EN 12101-1 test results.',
    },
  },
  'curtain-wall': {
    title: { ko: '커튼월 내화 성능·둘레 방화 차단 시험 | KCT', en: 'Curtain Wall Fire Resistance & E2307 Tests | KCT' },
    description: {
      ko: '커튼월과 바닥 슬래브 사이의 둘레 방화 차단(perimeter fire barrier) 설계와 EN 1364-4·ASTM E2307 시험 구성 및 결과를 정리했습니다.',
      en: 'Perimeter fire barrier detailing between curtain walls and floor slabs, covering EN 1364-4 and ASTM E2307 fire test configurations and test results.',
    },
  },
  'application-guidelines': {
    title: { ko: 'DOWSIL 내화 실란트 시공 지침·보수 방법 | KCT', en: 'Fire-Rated Sealant Application Guidelines | KCT' },
    description: {
      ko: 'DOWSIL™ 내화 실란트 시공 전 재료 확인·표면 준비·보수 일반 사항과 건 타입 및 자기수평형 실란트별 현장 시공 지침을 단계별로 안내합니다.',
      en: 'General site guidance on materials, surface preparation and repairs, plus step-by-step installation instructions for gun-grade and self-leveling sealants.',
    },
  },
  'foam': {
    title: { ko: 'DOWSIL 3-6548 실리콘 RTV 폼 시공 가이드 | KCT', en: 'DOWSIL™ 3-6548 Silicone RTV Foam Application | KCT' },
    description: {
      ko: 'DOWSIL™ 3-6548 내화 실리콘 RTV 폼의 혼합·토출, 스냅 타임, 4단계 품질 관리, 색상·기포 구조 비교, 시공·보수 및 세척 방법을 정리했습니다.',
      en: 'Application guide for DOWSIL™ 3-6548 silicone RTV foam: mixing, dispensing, snap time, four-step quality control, cell charts, retrofit and clean-up.',
    },
  },
  'literature': {
    title: { ko: '내화 실란트 참고 문헌·인용 규격·PDF | KCT', en: 'Fire Manual Standards, References & PDF | KCT' },
    description: {
      ko: 'Dow 내화 실란트 기술 매뉴얼의 인용 국제 규격(EN, BS, UL, ASTM), 고지사항, 문의처 및 영문 원문 PDF 다운로드 안내를 제공합니다.',
      en: 'Referenced international fire standards (EN, BS, UL, ASTM), Dow legal notices, KCT contact details and original PDF download for the fire-rated manual.',
    },
  },
}

const INDUSTRIAL_META: Record<string, MetaPair> = {
  'overview': {
    title: { ko: '산업용 DOWSIL 실리콘 실란트 장점·특성 | KCT', en: 'Benefits of DOWSIL™ Industrial Silicones | KCT' },
    description: {
      ko: '산업·가전용 DOWSIL™ 실리콘 실란트의 온도 안정성, 내후성, 화학적 안정성, 접착 강도, 전기적 특성과 유기계 재료 대비 장점을 정리했습니다.',
      en: 'Discover why DOWSIL™ silicone sealants outperform organics in temperature stability, weatherability, chemical resistance, bond strength and electrical use.',
    },
  },
  'which-silicone': {
    title: { ko: '산업용 실리콘 선택법: RTV·핫멜트·폼 | KCT', en: 'Which Silicone? RTV, Hot-Melt, 2-Part & Foam | KCT' },
    description: {
      ko: '산업·가전·유지보수용 실리콘의 여섯 가지 배합 옵션(RTV, 가열 경화, 핫멜트, 1액형, 2액형, 실리콘 폼)과 기본 경화 화학을 비교합니다.',
      en: 'Compare six industrial silicone options — RTV, heat-cure, hot-melt, one-part, two-part and silicone foams — along with core silicone cure chemistry.',
    },
  },
  'sealant-chemistries': {
    title: { ko: '실란트 화학 비교: 아세톡시·알콕시·옥심 | KCT', en: 'Sealant Chemistries: Acetoxy, Alkoxy & More | KCT' },
    description: {
      ko: '산 경화 아세톡시와 중성 경화 알콕시·옥심·2액형·핫멜트·백금 폼 실리콘 화학을 경화 방식, 그린 스트렝스, 접착, 유효기간, 투명도로 비교합니다.',
      en: 'Compare acetoxy, neutral alkoxy, oxime, two-part, hot-melt and platinum silicone foam chemistries by cure, green strength, adhesion and shelf life.',
    },
  },
  'acetoxy-sealants': {
    title: { ko: '아세톡시 실란트 8종 비교: 730·732·734 | KCT', en: 'Acetoxy Sealants: DOWSIL™ 730, 732, 734, 786 | KCT' },
    description: {
      ko: 'DOWSIL™ 730 FS·732·734·786 등 1액형 아세톡시 실리콘 실란트·코팅 8종의 대표 물성, 적용 용도, 프라이머 없는 접착 등급을 정리했습니다.',
      en: 'Compare typical properties, applications and unprimed adhesion ratings of eight one-part acetoxy silicones including DOWSIL™ 730 FS, 732, 734 and 786.',
    },
  },
  'high-temperature-sealants': {
    title: { ko: '고온 내열 실란트: 736(315°C)·Q3-1566 | KCT', en: 'High-Temp Silicones: 736 (315°C) & Q3-1566 | KCT' },
    description: {
      ko: '오븐, 보일러, 연도, 가열 장비용 고온 아세톡시 실란트 DOWSIL™ 736(단속 315°C)과 Q3-1566(단속 350°C)의 물성과 용도를 비교했습니다.',
      en: 'Compare high-temperature silicone sealants DOWSIL™ 736 (up to 315°C) and Q3-1566 (up to 350°C intermittent) for ovens, boilers, flues and heaters.',
    },
  },
  'alkoxy-neutral-cure-sealants': {
    title: { ko: '알콕시 중성 실란트 9종: 739·748·7091 | KCT', en: 'Alkoxy Neutral Sealants: 739, 748, 7091–7094 | KCT' },
    description: {
      ko: 'DOWSIL™ 739·748·3145·7091~7094·AS 7096N·3559 등 9종 1액형 알콕시 중성 경화 실란트의 전기용·플라스틱 접착·유동성 물성을 비교합니다.',
      en: 'Compare nine one-part alkoxy neutral-cure silicones (739, 748, 3145, 7091–7094, AS 7096N, 3559) across electrical, plastic bonding and flowable grades.',
    },
  },
  'two-part-and-oxime-sealants': {
    title: { ko: '2액형 알콕시·옥심 실란트: EA-2626·1080 | KCT', en: 'Two-Part Alkoxy & Oxime Silicones: EA-2626 | KCT' },
    description: {
      ko: '오븐·호브·헤드램프 조립용 속경화 2액형 중성 접착제(EA-2626·Q3-3526·Q3-3636)와 1액형 옥심 실란트 DOWSIL™ 1080 물성을 정리했습니다.',
      en: 'Fast-curing two-part alkoxy adhesives (EA-2626, Q3-3526, SILASTIC™ Q3-3636) for ovens and headlamps plus DOWSIL™ 1080 one-part oxime sealant specs.',
    },
  },
  'hot-melt-sealants': {
    title: { ko: '핫멜트 실리콘 실란트: HM-2500~HM-2600 | KCT', en: 'Hot-Melt Silicones: DOWSIL™ HM-2500 to 2600 | KCT' },
    description: {
      ko: 'OEM 조립·접착·가스켓용 즉시 접착 100% 실리콘 핫멜트(HM-2500·2510·2515·2600)의 그린 스트렝스, SAFT, 무프라이머 접착 데이터를 수록했습니다.',
      en: 'Instant-adhesion 100% silicone hot-melt sealants (HM-2500, HM-2510, HM-2515, HM-2600) for OEM assembly with green strength, SAFT and adhesion data.',
    },
  },
  'silicone-foams': {
    title: { ko: '2액형 부가경화 실리콘 폼 4종 사양 비교 | KCT', en: 'Two-Part Silicone Foams: 8257 & 3-8209–8259 | KCT' },
    description: {
      ko: '현장 성형 압축 가스켓용 2액형 부가 경화 실리콘 폼 4종(SILASTIC™ 8257, DOWSIL™ 3-8209·3-8219 RF·3-8259 RF)의 점도·밀도·경도를 비교합니다.',
      en: 'Compare four two-part platinum-cure silicone foams for formed-in-place gaskets (8257, 3-8209, 3-8219 RF, 3-8259 RF) by viscosity, density and hardness.',
    },
  },
  'surface-preparation': {
    title: { ko: '실리콘 실란트 접착을 위한 표면 준비 | KCT', en: 'Surface Preparation for Silicone Sealants | KCT' },
    description: {
      ko: '실리콘 실란트 접착력을 높이기 위한 표면 세정·탈지·연마 절차, 권장 용제 선택 기준, 플라즈마·코로나·UV·화염 전처리 적용 조건을 안내합니다.',
      en: 'How to clean, degrease and abrade substrates for silicone sealants, which solvents to choose, and when plasma, corona, UV or flame treatment is needed.',
    },
  },
  'primers-and-cleaners': {
    title: { ko: '실리콘 프라이머·세정제 7종 선정 표 | KCT', en: 'DOWSIL™ Primers, Adhesion Promoters & Cleaners | KCT' },
    description: {
      ko: 'DOWSIL™ PR-1200·1200 OS·1203·PR-2260 프라이머와 DS-1000·DS-2025·R41 세정제의 도포 시기, 건조 시간(5~30분) 및 적용 기재를 정리했습니다.',
      en: 'When and how to prime with DOWSIL™ PR-1200, 1200 OS, 1203 and PR-2260 (5–30 min cure), plus DS-1000, DS-2025 and R41 silicone cleaners and removers.',
    },
  },
  'application-and-cure': {
    title: { ko: '산업용 실란트 시공·경화·상용성·제거 | KCT', en: 'Silicone Application, Cure & Compatibility | KCT' },
    description: {
      ko: '5~10분 피막 형성, 24시간 약 1/8인치 경화, 툴링, 아세트산 부식, 백금 촉매 저해 물질, 경화 실란트 제거와 안전 수칙을 안내합니다.',
      en: 'Practical guidance on 5–10 min skin-over, 24 h cure depth, tooling, acetic-acid corrosion, platinum cure inhibition, sealant cleanup and safe handling.',
    },
  },
  'product-selector': {
    title: { ko: '산업용 DOWSIL 실란트 38종 전체 비교표 | KCT', en: 'Industrial Selector: Compare All 38 Products | KCT' },
    description: {
      ko: '산업·가전·유지보수용 DOWSIL™ 38개 제품을 화학 조성, 사용 온도, 경화 방식, 경도, 인장·신율과 요구 조건별 안내로 한눈에 비교합니다.',
      en: 'Compare all 38 DOWSIL™ industrial, appliance and maintenance sealants by chemistry, temperature range, cure, hardness, tensile and elongation.',
    },
  },
  'notice-and-contact': {
    title: { ko: '산업용 실리콘 취급 주의사항·보증·문의 | KCT', en: 'Industrial Guide: Handling, Warranty & Contact | KCT' },
    description: {
      ko: '산업·가전용 실리콘 실란트 사용 전 안전보건자료(SDS) 확인 의무, Dow 제한 보증 안내 및 Dow·한국건설트레이딩(KCT) 문의처를 정리했습니다.',
      en: 'Safety data sheet (SDS) requirements, Dow limited warranty terms and contact information for Dow and Korea Construction Trading (KCT) inquiries.',
    },
  },
}

const SERIES_HUB_META: Record<string, MetaPair> = {
  'basics': {
    title: { ko: '실리콘 일반 교육 – 화학·제조·특성·응용 | KCT', en: 'Silicone Basics: Chemistry, Manufacturing & Uses | KCT' },
    description: {
      ko: '실리콘의 역사·명명, Direct Process 제조, 실란·레진·폴리머·에멀젼·고무, 분자 특성, 물성, 응용 분야와 부록 데이터를 11페이지로 수록했습니다.',
      en: 'Silicone fundamentals in 11 pages covering history, Direct Process, silanes, resins, polymers, rubbers, molecular properties, applications and data.',
    },
  },
  'psa': {
    title: { ko: '실리콘 점착제(PSA) 선택 요령 (2024판) | KCT', en: 'Silicone PSA Selection & Application Guide (2024) | KCT' },
    description: {
      ko: '2024 최신판(PSA 41종 사양, 용도별 선정, 프라이머·이형 코팅제, 경화)과 2006 Dow Corning 가이드를 18페이지 한·영으로 수록했습니다.',
      en: 'Dow silicone PSA guide in 18 pages: 2024 edition covering 41 PSAs, selection tables, crosslinkers, release coatings and curing, plus 2006 comparison.',
    },
  },
  'selection': {
    title: { ko: 'DOWSIL 실란트 비교·선택 – 구조·내후·복층 | KCT', en: 'DOWSIL™ Sealant Comparison & Selection Guide | KCT' },
    description: {
      ko: 'DOWSIL 구조용·내후성·석재·콘크리트·복층유리 실란트 13종(789·795·995·993·983 등)을 Dow TDS 대표 특성 기준으로 비교한 가이드입니다.',
      en: 'Compare 13 DOWSIL™ structural, weatherproofing, stone, concrete and insulating-glass sealants side by side using typical properties from Dow TDS.',
    },
  },
  'tapes': {
    title: { ko: '전기·전자 테이프용 실리콘 PSA 선정 가이드 | KCT', en: 'Silicone PSAs for Electrical & Electronic Tapes | KCT' },
    description: {
      ko: '전기 절연·스플라이싱 테이프용 Dow 실리콘 점착제 20종 목록, 대표 물성, 테이프 용도별 선정표와 한국건설트레이딩 기술 지원 안내 4페이지입니다.',
      en: 'Four-page hub for electrical insulation and splicing tapes: 20 Dow PSA products, typical properties, tape selection table and KCT technical support.',
    },
  },
}

const SERIES_PAGE_META: Record<string, MetaPair> = {
  // basics (11)
  'basics/overview-history': {
    title: { ko: '실리콘이란? 개요·역사·용어 명명 | KCT', en: 'What Is Silicone? Overview, History & Terms | KCT' },
    description: {
      ko: 'SiO₂(모래)에서 얻는 실리콘 고분자의 개요, 1824년부터 최초의 DC-4 그리스까지의 역사, 실리카·실란·실록산 등 핵심 용어 차이를 정리했습니다.',
      en: 'Explore silicone made from SiO₂ sand: history from 1824 to DC-4 grease and clear definitions of silica, silicon, silane, silicate and siloxane.',
    },
  },
  'basics/manufacturing-process': {
    title: { ko: '실리콘 수지 제조: Direct Process·합성 | KCT', en: 'How Silicone Is Made: Direct Process & Synthesis | KCT' },
    description: {
      ko: '모래(SiO₂)에서 금속 규소, 클로로실란, 가수분해, 축합 중합과 말단 봉쇄에 이르는 실리콘 전체 제조 공정도와 기본 합성 메커니즘을 설명합니다.',
      en: 'Follow silicone manufacturing from sand to silicon metal, chlorosilane via the Direct Process, hydrolysis, condensation and end-blocking steps.',
    },
  },
  'basics/silane-and-resin': {
    title: { ko: '실란(Silane)과 실리콘 레진(Resin) 제조 | KCT', en: 'Silane & Silicone Resin Production Process | KCT' },
    description: {
      ko: '실란 관능기별 분류, 2600°C 규소 제련, Direct Process 두 반응 경로, 메틸클로로실란 생성물 조성표 및 실리콘 레진(실세스퀴옥산)을 다룹니다.',
      en: 'Functional-group classes, 2600°C silicon smelting, Direct Process routes, methylchlorosilane distribution data and silicone resin (silsesquioxane).',
    },
  },
  'basics/polymer-and-emulsion': {
    title: { ko: '실리콘 폴리머(Polymer)·에멀젼 제조 | KCT', en: 'Silicone Polymer & Emulsion Manufacturing | KCT' },
    description: {
      ko: '실리콘 폴리머 제조 7단계, 촉매 선택, 축합·평형 반응, 디클로로실란 가수분해, 기계적 유화 및 유화 중합 실리콘 에멀젼 공정을 정리했습니다.',
      en: 'Learn the seven silicone polymer steps, catalyst selection, condensation and equilibration, dichlorosilane hydrolysis and emulsion production methods.',
    },
  },
  'basics/silicone-rubber': {
    title: { ko: '실리콘 고무: LSR·RTV·HCR·실리카 충전제 | KCT', en: 'Silicone Rubber: LSR, RTV, HCR & Silica Fillers | KCT' },
    description: {
      ko: '액상 실리콘 고무(LSR), 상온경화(RTV), 수성 엘라스토머(SWBE), 용제형 Dispersion, HCR의 원료 구성과 보강용 실리카 충전제를 설명합니다.',
      en: 'Compare raw materials and curing chemistry of LSR, RTV, water-based elastomer (SWBE), solvent dispersion, HCR silicone rubbers and silica fillers.',
    },
  },
  'basics/molecular-characteristics': {
    title: { ko: '실리콘 분자 특성: Si-O 주쇄와 CH₃ 측쇄 | KCT', en: 'Silicone Molecule: Si–O Backbone & CH₃ Groups | KCT' },
    description: {
      ko: 'Si-O 결합의 회전·결합 에너지·결합각·결합 길이를 C-C·C-O와 비교하고, 무기 주쇄와 CH₃ 유기 측쇄가 만드는 고유 특성을 설명합니다.',
      en: 'Compare Si–O bond energy, rotation, angle and length against C–C and C–O to see how the inorganic backbone and CH₃ groups create silicone properties.',
    },
  },
  'basics/properties-and-functional-groups': {
    title: { ko: '실리콘 화학·물리적 특성과 관능기별 효과 | KCT', en: 'Silicone Properties & Functional Group Effects | KCT' },
    description: {
      ko: '실리콘의 핵심 장점과 한계, Phenyl·Fluoro·Amino·Vinyl 등 관능기 치환에 따른 물성 변화, 분자 특성-효과-응용 분야 연계표를 정리했습니다.',
      en: 'Review strengths and limits of silicone, functional-group effects (phenyl, fluoro, amino, vinyl) and how molecular structure drives real applications.',
    },
  },
  'basics/applications-and-forms': {
    title: { ko: '실리콘 응용 분야와 제품 형태(Fluid·Rubber) | KCT', en: 'Silicone Applications & Product Forms Guide | KCT' },
    description: {
      ko: '항공우주·건축·전자·섬유 등 산업별 실리콘 응용 분야와 Fluid·Gum·Resin·Compound·Silane·Emulsion·Rubber(LSR·RTV) 제품 형태를 안내합니다.',
      en: 'Explore silicone uses from aerospace to textiles alongside major product forms: fluid, gum, resin, compound, silane, emulsion and RTV/LSR/HCR rubber.',
    },
  },
  'basics/usage-methods': {
    title: { ko: '실리콘 제품별 사용법: Silane·LSR·RTV | KCT', en: 'How Silicone Products Are Used: Silane to RTV | KCT' },
    description: {
      ko: '실란 커플링제·프라이머, 레진 페인트 첨가제, 섬유용 유화 오일, LSR 원단 코팅, 카트리지형 RTV 실리콘의 대표적인 현장 사용법을 소개합니다.',
      en: 'Typical industrial uses of silane coupling agents and primers, resin paint additives, textile emulsions, LSR fabric coatings and RTV cartridges.',
    },
  },
  'basics/appendix-data': {
    title: { ko: '실리콘 부록 데이터: 결합에너지·내열·투과도 | KCT', en: 'Silicone Appendix Data: Bond Energy & Thermal | KCT' },
    description: {
      ko: '부록 1~9 데이터 수록: Si-X/C-X 결합 해리 에너지, M·D·T·Q 명명, 표면 에너지, PDMS 점도-분자량, 온도 안정성, 내열성과 기체 투과도.',
      en: 'Nine silicone reference tables: Si–X vs C–X bond energies, M/D/T/Q nomenclature, surface energy, PDMS viscosity-Mw, thermal stability and permeability.',
    },
  },
  'basics/supplement-references': {
    title: { ko: '실리콘 일반 교육 보충 자료 및 참고 문헌 | KCT', en: 'Silicone Basics: Supplementary Notes & Sources | KCT' },
    description: {
      ko: '한국건설트레이딩이 공개 문헌으로 보강한 뮬러-로초 직접법, Si-O 결합 특성, PDMS 유리전이온도(Tg) 편차와 DOWSIL 제품 선정 안내입니다.',
      en: 'KCT supplementary notes from public references on the Müller–Rochow process, Si–O bonding, PDMS Tg data ranges and DOWSIL™ product selection.',
    },
  },

  // psa (18)
  'psa/high-performance-psa-overview': {
    title: { ko: '2024 Dow 고성능 실리콘 PSA 종합 개요 | KCT', en: '2024 Dow High-Performance Silicone PSA Overview | KCT' },
    description: {
      ko: '2024년판 Dow 실리콘 PSA 선택 가이드 개요: 유기 점착제 대비 장점, 성능 특성, 적용 기재, 선정 기준, 블렌딩 그래프와 보호 필름 구조를 다룹니다.',
      en: 'Overview of the 2024 Dow silicone PSA guide: benefits over organic adhesives, service limits, compatible substrates, blending and protective film layers.',
    },
  },
  'psa/application-overview-table': {
    title: { ko: '표 1: 필름·특수 테이프용 실리콘 PSA 선정표 | KCT', en: 'Table 1: Silicone PSA Application Overview | KCT' },
    description: {
      ko: '마스킹·전기·스플라이싱·보호 필름·양면 테이프·라벨·라이너 용도별로 권장되는 DOWSIL™ PSA, 마이카 바인더, 무용제 PSA와 이형 코팅제를 정리했습니다.',
      en: 'Recommended DOWSIL™ PSAs, mica binders, solventless grades and SYL-OFF™ release coatings for masking, electrical, splicing, film and label uses.',
    },
  },
  'psa/product-specifications-table': {
    title: { ko: '표 2: DOWSIL 실리콘 PSA 41종 사양·물성표 | KCT', en: 'Table 2: Specs of 41 DOWSIL™ Silicone PSAs | KCT' },
    description: {
      ko: 'DOWSIL™ 실리콘 PSA·마이카 바인더·무용제 점착제 41종의 경화 방식, 점도, 불휘발분, 접착력, 프로브 택, 고온 유지력·전단 사양을 비교합니다.',
      en: 'Compare cure system, viscosity, solids, adhesion, probe tack and high-temperature hold/shear across 41 DOWSIL™ PSAs, mica binders and solventless grades.',
    },
  },
  'psa/features-and-applications': {
    title: { ko: 'DOWSIL 실리콘 PSA 제품별 특징·대표 용도 | KCT', en: 'Features & Applications of DOWSIL™ Silicone PSAs | KCT' },
    description: {
      ko: '마스킹, 플레이팅, 스플라이싱, 전기 테이프, 보호 필름, 저 Si 이행, 마이카 바인더 등 DOWSIL™ PSA 제품별 핵심 장점과 적용 분야를 정리했습니다.',
      en: 'Review features, benefits and typical applications of DOWSIL™ PSAs and mica binders for masking, plating, splicing, electrical and protective films.',
    },
  },
  'psa/primers-crosslinkers-release-coatings': {
    title: { ko: 'PSA 프라이머·가교제·불소실리콘 이형 코팅제 | KCT', en: 'PSA Primers, Crosslinkers & Release Coatings | KCT' },
    description: {
      ko: 'DOWSIL™ 7499 PSA 프라이머, SYL-OFF™ 가교제(SL 7028·7678 등), 앵커리지 첨가제, 불소실리콘 이형 코팅제 6종 사양과 역할을 정리했습니다.',
      en: 'Specifications for DOWSIL™ 7499 PSA Primer, SYL-OFF™ crosslinkers, anchorage additives and six fluorosilicone release coatings for silicone PSAs.',
    },
  },
  'psa/release-coating-and-transfer-coating': {
    title: { ko: '실리콘 PSA 이형 코팅·표 3 조합 권장표 | KCT', en: 'Silicone PSA Release & Transfer Coating Table 3 | KCT' },
    description: {
      ko: 'SYL-OFF™ 불소실리콘 이형 코팅제의 안정적 이형 원리, 차등 이형(1.2~2.5 비) 구현 방법, 전사 코팅·직접 캐스팅용 PSA 조합표(표 3)를 제공합니다.',
      en: 'How SYL-OFF™ fluorosilicone coatings ensure consistent silicone PSA release, differential release (1.2–2.5 ratio) and Table 3 transfer-coating pairings.',
    },
  },
  'psa/processing-and-curing-2024': {
    title: { ko: '실리콘 PSA 가공·경화 가이드 (2024 최신판) | KCT', en: 'Silicone PSA Processing & Curing Guide (2024) | KCT' },
    description: {
      ko: '2024 최신판 PSA 가공 지침: 백금 경화(6시간 배스 수명, 80°C), 과산화물 경화(0.5~3.0% BPO, 65~93°C 건조), 오븐 분진과 앵커리지 관리를 다룹니다.',
      en: '2024 PSA curing guide: platinum cure (6 h bath life, 80°C), peroxide cure (0.5–3.0% BPO, 65–93°C flash-off), oven dusting and anchorage control.',
    },
  },
  'psa/guide-2006-vs-2024-changes': {
    title: { ko: '2006 vs 2024 Dow 실리콘 PSA 가이드 비교 | KCT', en: '2006 vs. 2024 Dow Silicone PSA Guide Changes | KCT' },
    description: {
      ko: '2006 Dow Corning판과 2024 Dow 실리콘 PSA 가이드를 제품 범위, 브랜드 명칭, 백금 배스 수명, 고온 유지력 수치, 신규 보조 소재로 비교했습니다.',
      en: 'Compare the 2006 Dow Corning and 2024 Dow silicone PSA guides by product lineup, naming, platinum bath life, high-temperature hold and new auxiliaries.',
    },
  },
  'psa/more-options-and-dow-support': {
    title: { ko: '실리콘 PSA 보조 소재·맞춤 배합·안전 안내 | KCT', en: 'Silicone PSA Auxiliary Options & Safety Notice | KCT' },
    description: {
      ko: '실리콘 PSA 보조 소재 선택지, Dow 맞춤 배합·응용 기술 지원, 글로벌 공급 네트워크, 제품 안전 정보와 대표 수치 적용 고지사항을 안내합니다.',
      en: 'Explore auxiliary PSA materials, Dow custom formulation and application support, global network, product safety guidance and typical-values notice.',
    },
  },
  'psa/overview-how-to-select': {
    title: { ko: '고성능 실리콘 PSA 제품군과 선정 순서 (2006) | KCT', en: 'Silicone PSA Lineup & How to Select (2006) | KCT' },
    description: {
      ko: '자일렌·톨루엔 분산 PDMS 검·레진 실리콘 점착제의 구성, 백금·과산화물 경화 방식, 프라이머, Syl-Off Q2-7785 이형 코팅제와 선정 순서를 정리했습니다.',
      en: 'Dow Corning silicone PSAs in xylene/toluene: gum-and-resin structure, platinum vs. peroxide cure, primers, Syl-Off Q2-7785 release and selection steps.',
    },
  },
  'psa/selection-flow-chart': {
    title: { ko: '실리콘 PSA 선정 플로 차트 (용제·경화·온도) | KCT', en: 'Silicone PSA Selection Flow Chart (2006) | KCT' },
    description: {
      ko: '용제 취급 여부, 식품 접촉, 테이프·라미네이팅 구조, 경화 온도, 사용 온도 범위에 따라 적합한 실리콘 PSA를 찾는 선정 플로 차트를 제공합니다.',
      en: 'Step-by-step PSA selection flow chart based on solvent handling, food contact, tape or laminating construction, cure temperature and service range.',
    },
  },
  'psa/platinum-vs-peroxide': {
    title: { ko: '과산화물 경화 vs 백금 경화 실리콘 PSA 비교 | KCT', en: 'Peroxide-Cure vs. Platinum-Cure Silicone PSAs | KCT' },
    description: {
      ko: '백금 경화와 과산화물 경화 실리콘 PSA의 촉매 구성, 배스 수명, 경화 온도·오븐 요건 및 공정별 장단점을 표 1 기준으로 상세히 비교했습니다.',
      en: 'Compare platinum-cure and peroxide-cure silicone PSAs in Table 1: catalyst composition, bath life, cure temperatures, oven needs and trade-offs.',
    },
  },
  'psa/product-descriptions': {
    title: { ko: '2006 실리콘 PSA 11종 특징·고온 유지력 표 | KCT', en: 'Silicone PSA Product Descriptions Table 2 (2006) | KCT' },
    description: {
      ko: '2013, 7657, 7659, 280A, 282, 7355, 7356, 7358, Q2-7406, Q2-7566, Q2-7735 실리콘 PSA의 특징, 대표 용도와 고온 유지력을 정리했습니다.',
      en: 'Typical applications, features and high-temperature hold of 2013, 7657, 7659, 280A, 282, 7355, 7356, 7358, Q2-7406, Q2-7566 and Q2-7735 PSAs.',
    },
  },
  'psa/tack-adhesion-hold-charts': {
    title: { ko: '실리콘 PSA 택·접착력·고온 유지력 비교 그래프 | KCT', en: 'Silicone PSA Tack, Adhesion & Hold Charts | KCT' },
    description: {
      ko: 'Dow Corning 실리콘 PSA 제품군의 Polyken 프로브 택, 상대 접착력, 비교 고온 유지력(응집 강도) 그래프(그림 1~3)와 예상 물성 범위를 제공합니다.',
      en: 'Compare Polyken probe tack, relative adhesion and high-temperature hold (cohesive strength) across silicone PSAs with Figures 1–3 and value ranges.',
    },
  },
  'psa/processing-thickness-effects': {
    title: { ko: '실리콘 PSA 가공: 기재·도포 두께 영향 | KCT', en: 'PSA Processing: Substrate & Thickness Effects | KCT' },
    description: {
      ko: '톨루엔·자일렌 희석 도포, 코트 웨이트 관리, 과산화물 경화 PSA 블렌딩과 기재·접착제 두께가 택과 접착력에 미치는 영향을 그림 4·5로 정리했습니다.',
      en: 'Toluene/xylene dilution, coat-weight control, blending peroxide-cure silicone PSAs and how backing and adhesive thickness affect tack and adhesion.',
    },
  },
  'psa/platinum-cure-process': {
    title: { ko: '실리콘 PSA 백금 경화 공정: 촉매·경화 속도 | KCT', en: 'PSA Platinum-Cure Process: Catalyst & Speed | KCT' },
    description: {
      ko: 'Syl-Off 4000 촉매 첨가, 24시간 배스 수명(2006판 기준), 80°C 이상 연속 오븐 경화 속도 및 백금 촉매 오염 방지 주의사항을 안내합니다.',
      en: 'Platinum-cure PSA process guide covering Syl-Off 4000 catalyst dosing, 24 h bath life (2006 guide), 80°C+ oven cure speed and poisoning prevention.',
    },
  },
  'psa/peroxide-cure-process': {
    title: { ko: '실리콘 PSA 과산화물 경화: BPO·2단계 열경화 | KCT', en: 'PSA Peroxide-Cure Process: BPO & Heat Cure | KCT' },
    description: {
      ko: '고형분 기준 과산화벤조일 0.5~3.0% 배합, 2단계 구배 경화(65~93°C 용제 제거 후 177~204°C 열경화)와 주석 촉매·실란 대체 경화를 설명합니다.',
      en: 'Peroxide-cure PSA guide: 0.5–3.0% benzoyl peroxide, two-step graded cure (65–93°C solvent removal then 177–204°C) and tin or silane cure alternatives.',
    },
  },
  'psa/oven-dusting-anchorage-release': {
    title: { ko: 'PSA 오븐 분진·앵커리지 프라이머·이형 관리 | KCT', en: 'PSA Oven Dusting, Anchorage Primers & Release | KCT' },
    description: {
      ko: '휘발성 실리콘의 오븐 분진 저감 대책, 프라이머·Z-6020 실란 0.25~0.5% 첨가 앵커리지 개선, Syl-Off Q2-7785 불소실리콘 이형 코팅제를 안내합니다.',
      en: 'Reduce oven dusting from volatile silicones, boost anchorage with primers or 0.25–0.5% Z-6020 silane, and apply Syl-Off Q2-7785 release coatings.',
    },
  },

  // selection (2)
  'selection/structural-vs-weatherproofing-sealants': {
    title: { ko: 'DOWSIL 구조용 vs 내후성 실란트 8종 비교 | KCT', en: 'DOWSIL™ Structural vs. Weatherproofing Sealants | KCT' },
    description: {
      ko: 'DOWSIL 789·791·795·995·121·977·991·813C 8종을 TDS 기준으로 비교합니다. 구조용·내후성 용도, 움직임 허용치, 경도, 강도와 경화 특성을 확인하세요.',
      en: 'Compare DOWSIL™ 789, 791, 795, 995, 121, 977, 991 and 813C from Dow TDS: structural vs. weatherproofing duty, movement, hardness, strength and cure.',
    },
  },
  'selection/insulating-glass-and-two-part-structural-sealants': {
    title: { ko: 'DOWSIL 복층유리·2액형 구조 실란트 6종 비교 | KCT', en: 'DOWSIL™ IG & Two-Part Structural Sealants | KCT' },
    description: {
      ko: '복층유리 1차 부틸 DOWSIL 335와 2액형 2차·구조 실란트 939·982·983·993·121의 혼합비, 경도, 강도와 적용 기준을 Dow TDS 기준으로 비교했습니다.',
      en: 'Compare primary butyl DOWSIL™ 335 with two-part IG and structural sealants 939, 982, 983, 993 and 121 using mix ratio, strength and Dow TDS specs.',
    },
  },

  // tapes (4)
  'tapes/electrical-electronics-tape-psa': {
    title: { ko: '전기·전자 테이프용 실리콘 PSA 개요 (Dow) | KCT', en: 'Electrical & Electronics Tape Silicone PSAs | KCT' },
    description: {
      ko: 'Dow 한국 「전기 및 전자 테이프」 자료 전문을 수록했습니다. 전기 절연·스플라이싱 테이프용 실리콘 PSA 특성과 KCT 기술 지원을 확인하세요.',
      en: 'Full text of Dow Korea’s electrical and electronics tapes overview covering electrical insulation and splicing tape silicone PSAs plus KCT support.',
    },
  },
  'tapes/dow-insulation-tape-psa-product-list': {
    title: { ko: '전기 절연테이프용 Dow PSA 20종 목록·물성 | KCT', en: '20 Dow Silicone PSAs for Insulation Tapes | KCT' },
    description: {
      ko: 'Dow 한국이 전기 절연테이프용 점착제로 분류한 20종 제품 전체의 한·영 설명과 2024 가이드 기준 대표 물성(접착력·택·고온 유지력)을 정리했습니다.',
      en: 'All 20 Dow Korea electrical insulation-tape silicone PSAs with bilingual descriptions and typical adhesion, tack and temperature-hold data from 2024.',
    },
  },
  'tapes/electrical-tape-psa-selection-table': {
    title: { ko: '전기·특수 테이프용 DOWSIL PSA 선정표 | KCT', en: 'Electrical & Specialty Tape PSA Selection Table | KCT' },
    description: {
      ko: '전기 마스킹, 결속, 절연, 히트실, 스플라이싱, 용사 마스킹, 마이카 바인더 용도별 권장 DOWSIL™ PSA와 경화 방식·고온 유지력을 정리했습니다.',
      en: 'Select DOWSIL™ PSAs for electrical masking, bundling, insulation, heat-seal, splicing, thermal-spray masking and mica binders by cure and hold temp.',
    },
  },
  'tapes/kct-technical-support': {
    title: { ko: 'Dow 실리콘 PSA 기술 지원·문의 체크리스트 | KCT', en: 'KCT Technical Support for Dow Silicone PSAs | KCT' },
    description: {
      ko: '한국건설트레이딩의 Dow 실리콘 PSA 기술 지원 안내: 제품 선정, 기술 자료 확인, 공정 조건 검토, 문제 해결과 빠른 문의를 위한 체크리스트입니다.',
      en: 'How KCT supports Dow silicone PSA customers in Korea: product selection, TDS/SDS documents, process condition review, troubleshooting and checklist.',
    },
  },
}

function buildTechMeta(path: string, lang: string, title: string, description: string, image: string, type: 'article' | 'website'): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${lang === 'ja' ? 'en' : lang}${path}`,
      languages: { ko: `${BASE}/ko${path}`, en: `${BASE}/en${path}`, 'x-default': `${BASE}/ko${path}` },
    },
    openGraph: { title, description, url: `${BASE}/${lang}${path}`, siteName: SITE_NAME, images: [{ url: image }], type },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  }
}

export function techMainHubMeta(lang: string): Metadata {
  const ko = normTechLang(lang) === 'ko'
  const total = searchIndex(lang, normTechLang(lang)).length
  const title = ko ? 'DOWSIL 실리콘 기술정보·매뉴얼 허브 | KCT' : 'DOWSIL™ Technical Library & Selection Guides | KCT'
  const description = ko
    ? `Dow DOWSIL 내화 매뉴얼, 산업용 선정 가이드, 실리콘 일반 교육, PSA 선택 요령, 실란트 비교 등 ${HUBS.length}개 분야 ${total}쪽 기술 자료를 한·영으로 제공합니다.`
    : `Explore ${HUBS.length} Dow DOWSIL™ technical resources (${total} pages) in English and Korean: fire-rated, industrial, PSA, sealant comparison and silicone basics.`
  return buildTechMeta('/technical', lang, title, description, `${BASE}/assets/tech/cover.jpg`, 'website')
}

export function industrialHubMeta(lang: string): Metadata {
  const ko = normTechLang(lang) === 'ko'
  const title = ko ? '산업·가전용 DOWSIL 실리콘 선정 가이드 | KCT' : 'DOWSIL™ Industrial & Appliance Silicone Guide | KCT'
  const description = ko
    ? '아세톡시·알콕시·옥심·2액형·핫멜트 실란트, 실리콘 폼, 프라이머·세정제 38종의 물성, 접착 등급, 표면 준비와 시공 방법을 14페이지로 정리했습니다.'
    : 'Complete Dow selection guide covering 38 industrial silicone sealants, foams, primers and cleaners with specs, adhesion ratings and cure guidance.'
  return buildTechMeta('/technical/industrial', lang, title, description, `${BASE}/assets/tech/ind-cover.jpg`, 'website')
}

export function firePageMeta(slug: string, lang: string): Metadata {
  const page = getPage(slug)
  if (!page) return { title: 'Not found | KCT' }
  const l = normTechLang(lang)
  const m = FIRE_META[slug]
  const title = m ? m.title[l] : `${page.title[l]} | KCT`
  const description = m ? m.description[l] : page.summary[l]
  return buildTechMeta(`/technical/${slug}`, lang, title, description, `${BASE}${page.image}`, 'article')
}

export function industrialPageMeta(slug: string, lang: string): Metadata {
  const page = getIPage(slug)
  if (!page) return { title: 'Not found | KCT' }
  const l = normTechLang(lang)
  const m = INDUSTRIAL_META[slug]
  const title = m ? m.title[l] : `${page.title[l]} | KCT`
  const description = m ? m.description[l] : page.summary[l]
  return buildTechMeta(`/technical/industrial/${slug}`, lang, title, description, `${BASE}${page.image}`, 'article')
}

export function seriesPageMeta(s: Series, lang: string, slug?: string): Metadata {
  const l = normTechLang(lang)
  const page = slug ? s.pages.find((x) => x.slug === slug) : undefined
  if (slug && !page) return { title: 'Not found | KCT' }
  const path = `/technical/${s.key}${slug ? `/${slug}` : ''}`
  const m = slug ? SERIES_PAGE_META[`${s.key}/${slug}`] : SERIES_HUB_META[s.key]
  const title = m ? m.title[l] : `${page ? page.title[l] : s.hubTitle[l]} | KCT`
  const description = m ? m.description[l] : (page ? page.summary[l] : s.hubDesc[l])
  const image = `${BASE}${page ? page.image : s.cover}`
  return buildTechMeta(path, lang, title, description, image, page ? 'article' : 'website')
}
