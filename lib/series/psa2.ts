import { p, h, ul, fig, figs, note, sec, IMG } from '@/lib/tech-manual/types'
import type { Block, Cell } from '@/lib/tech-manual/types'
import type { IPage } from '@/lib/industrial/pages'
import { PSA2_SPECS, PSA2_SPECS_PA, PSA2_MATRIX, PSA2_AUX, PSA2_RELEASE } from './psa2-data'

// Dow "Silicone PSAs for High Performance Selection Guide" (Form No. 30-1315-01-0524 S2D, © 2024 The Dow Chemical Company)
export const PSA2_PDF = '/docs/dow-silicone-psas-high-performance-selection-guide-2024.pdf'
export const PSA2_FORM = 'Form No. 30-1315-01-0524 S2D, © 2024 The Dow Chemical Company'
const DOC = '2024 · Form 30-1315-01'

const same = (s: string): Cell => s
const bi = (en: string, ko: string): Cell => [en, ko]
const dash = (s: string) => (s === '' ? '–' : s)

// 표 1 열 머리말 (13개 용도 열)
const T1_COLS: Cell[] = [
  bi('Electrical and electronics masking and carrier tapes for industrial processing', '산업 공정용 전기·전자 마스킹·캐리어 테이프'),
  bi('General-purpose masking tapes for low-surface-energy applications', '저표면에너지 용도 범용 마스킹 테이프'),
  bi('Thermal-spray and powder-coating masking tapes', '용사·분체도장 마스킹 테이프'),
  bi('Electrical and electronics tapes for industrial bonding and bundling applications', '산업용 접합·결속 전기·전자 테이프'),
  bi('Heat-seal tapes for bonding heating surfaces', '발열면 접합용 히트실 테이프'),
  bi('Electrical, electronic, heat-shielding and terminal cable insulation tapes for electronics, aerospace, aircraft and automotive', '전자·항공우주·항공기·자동차용 전기·전자·차열·단자 케이블 절연 테이프'),
  bi('Splicing tapes for continuous processing of low-surface-energy substrates', '저표면에너지 기재 연속 공정용 스플라이싱 테이프'),
  bi('Binding material for mica tape applications', '마이카 테이프용 바인더'),
  bi('Electronics and industrial component surface-protection films, mainly for shipment', '전자·산업 부품 표면 보호 필름(주로 운송용)'),
  bi('Window glass films in aftermarket electronics, auto, buildings, etc.', '애프터마켓 전자·자동차·건물 등의 창유리 필름'),
  bi('Spot protection films in processing of die-cutting/carrier/supporting components, including glass, SUS, foams, PET, PI, Al foil, etc.', '유리·SUS·폼·PET·PI·알루미늄 포일 등 다이컷·캐리어·지지 부품 가공 시 부분 보호 필름'),
  bi('Double-sided tapes, unsupported transfer tapes for lamination and mounting in electronics and automotive applications', '전자·자동차 합지·마운팅용 양면·무기재 전사 테이프'),
  bi('Marking labels in automotive, aerospace and other outdoor graphics', '자동차·항공우주 등 옥외 그래픽 마킹 라벨'),
  bi('Release liners for silicone PSA tapes, spot protection films in die-cut processing of single- or double-sided silicone rubber', '실리콘 PSA 테이프용 이형 라이너, 단·양면 실리콘 고무 다이컷 가공용 부분 보호 필름'),
]

const GROUP_KO: Record<string, string> = {
  'Pressure sensitive adhesives': '감압 점착제 (PSA)',
  'Solventless pressure sensitive adhesives': '무용제 감압 점착제',
  'Fluorosilicone release coatings': '불소실리콘 이형 코팅제',
}

const CURE_KO: Record<string, string> = { Peroxide: '과산화물', Platinum: '백금', 'Peroxide, silane': '과산화물, 실란' }
const cure = (c: string): Cell => (CURE_KO[c] ? bi(c, CURE_KO[c]) : c)

const matrixRows: Cell[][] = PSA2_MATRIX.map((r) => {
  const name = r[0] as string
  const flags = r.slice(1) as readonly string[]
  if (GROUP_KO[name]) return [bi('■ ' + name, '■ ' + GROUP_KO[name]), ...flags.map(() => '')]
  return [name, ...flags.map((c) => (c ? '•' : ''))]
})

const specRows = (from: number, to: number): Cell[][] =>
  PSA2_SPECS.slice(from, to).map((s) => [s.n, cure(s.cure), s.visc, s.nv, dash(s.adh), dash(s.tack), dash(s.hold)])

const SPEC_HEAD: Cell[] = [
  bi('Product', '제품'), bi('Cure system', '경화 방식'), bi('Viscosity, cps', '점도, cps'), bi('Non-volatile content, %', '불휘발분, %'),
  bi('Adhesion, g/in', '접착력, g/in'), bi('Probe tack, g', '프로브 택, g'), bi('High-temperature hold/shear, °C (°F)', '고온 유지력/전단, °C (°F)'),
]

const FNOTE = {
  en: 'Footnotes: (1) Specification writers: these values are not intended for use in preparing specifications; contact your local Dow sales office or your Global Dow Connection before writing specifications. (2) Average quality data for comparison purposes only. (3) Measurements are within ±100 cps. (4) Measurements are within ±10 g/in. (5) Adhesion and tack are dependent on substrate backing, film thickness, formulation, etc.; these values represent only one test condition under Dow-established quality assurance procedures at the time of initial manufacture and are intended for comparison purposes only. Contact Dow for specification limits.',
  ko: '각주: (1) 시방 작성자 유의: 이 값은 시방서 작성용이 아닙니다. 시방을 작성하기 전에 가까운 Dow 영업소 또는 Global Dow Connection에 문의하십시오. (2) 비교 목적의 평균 품질 데이터입니다. (3) 측정 오차 ±100 cps. (4) 측정 오차 ±10 g/in. (5) 접착력과 택은 기재(백킹), 필름 두께, 배합 등에 따라 달라지며, 이 값은 최초 제조 시점에 Dow가 정한 품질 보증 절차의 단일 시험 조건에서 얻은 값으로 비교용입니다. 시방 한도는 Dow에 문의하십시오.',
}

const featRows = (from: number, to: number): Cell[][] =>
  PSA2_SPECS.slice(from, to).map((s) => [s.n, bi(s.f[0], s.f[1]), bi(s.a[0], s.a[1])])

const AUX_SEC_KO: Record<string, string> = {
  Primer: '프라이머', Crosslinkers: '가교제', 'Anchorage addition': '앵커리지 첨가제', 'Fluorosilicone release coatings and crosslinkers': '불소실리콘 이형 코팅제 및 가교제',
}
const AUX_F: Record<string, string> = {
  'Suitable for various substrates and PSAs with good anchorage': '다양한 기재와 PSA에 적합, 우수한 앵커리지',
  'Good anchorage': '우수한 앵커리지',
  'Fast cure': '빠른 경화',
  'Good anchorage; minimal impact on cure performance and adhesion': '우수한 앵커리지, 경화 성능과 접착력에 미치는 영향 최소',
  'Very good performance to improve adherence of PSA to substrates': 'PSA의 기재 밀착을 높이는 매우 우수한 성능',
  'Good anchorage; minimal impact on optical, cure and adhesion stability of PSA': '우수한 앵커리지, PSA의 광학·경화·접착 안정성에 미치는 영향 최소',
  'Solventless; allows for thicker coat weights': '무용제, 두꺼운 코트 웨이트 가능',
  'Higher fluorosilicone content for differential release values': '불소실리콘 함량이 높아 차등 이형값 구현에 유리',
  'Low and stable release force; Suitable for laminate various silicone pressure sensitive adhesive films on the release liner': '낮고 안정적인 이형력, 이형 라이너 위에 다양한 실리콘 PSA 필름을 라미네이트하기에 적합',
  'Low and stable release force; suitable for laminate various silicone pressure sensitive adhesive film on the release liner; suitable for more silicone PSA wet coating on the release liner': '낮고 안정적인 이형력, 다양한 실리콘 PSA 필름 라미네이트에 적합, 이형 라이너 위 실리콘 PSA 습식 코팅에도 적합',
  'Low and stable release force. High SAS. Suitable for dry laminate and wet casting using a wide range of silicone PSAs': '낮고 안정적인 이형력, 높은 SAS(잔류 접착률), 다양한 실리콘 PSA의 건식 라미네이트·습식 캐스팅에 적합',
  'Solventless; stable release': '무용제, 안정적인 이형',
  'Crosslinker for SYL-OFF™ Q2-7785 Release Coating, SYL-OFF™ 7786 Coating, SYL-OFF™ 7792 Coating and SYL-OFF™ 7795 Coating and SYL-OFF™ 7798 Fluorosilicone Release Coating': 'SYL-OFF™ Q2-7785, 7786, 7792, 7795, 7798 불소실리콘 이형 코팅제용 가교제',
  'Crosslinker for SYL-OFF™ 7555 Coating': 'SYL-OFF™ 7555 코팅용 가교제',
}
const AUX_A: Record<string, string> = {
  'Primer for silicone PSA': '실리콘 PSA용 프라이머',
  'Crosslinker for low-adhesion protective films or carrier tapes': '저접착 보호 필름·캐리어 테이프용 가교제',
  'To improve the anchorage of low-adhesion PSA on substrates': '저접착 PSA의 기재 앵커리지 향상',
  'To improve the anchorage of low-adhesion PSA on filmic substrates': '필름 기재에서 저접착 PSA의 앵커리지 향상',
  'Adhesive tapes, labels and transfer films; bonding low-energy substrates; high- and low-temperature labeling applications': '접착 테이프·라벨·전사 필름, 저에너지 기재 접합, 고온·저온 라벨링 용도',
  'Release of industrial-grade silicone pressure sensitive adhesives': '산업용 실리콘 PSA의 이형',
  'Production of release substrates coated from solvent. Release of industrial grade silicone pressure sensitive adhesives; major uses with silicone PSA tape forms include: adhesive transfer tapes; industrial single coated or double coated tapes; labels; Silicone foam or rubber tapes; in process liner for converting':
    '용제 코팅 방식의 이형 기재 생산. 산업용 실리콘 PSA의 이형. 실리콘 PSA 테이프 형태의 주요 용도: 접착 전사 테이프, 산업용 단면·양면 테이프, 라벨, 실리콘 폼·고무 테이프, 컨버팅 공정용 라이너',
  'Production of release substrates coated from solvent. Release of industrial grade silicone pressure sensitive adhesives; major uses with silicone PSA tape forms include: adhesive transfer tapes; industrial single coated or double coated tapes; labels; silicone foam or rubber tapes; in process liner for converting':
    '용제 코팅 방식의 이형 기재 생산. 산업용 실리콘 PSA의 이형. 실리콘 PSA 테이프 형태의 주요 용도: 접착 전사 테이프, 산업용 단면·양면 테이프, 라벨, 실리콘 폼·고무 테이프, 컨버팅 공정용 라이너',
  'Release of industrial grade silicone pressure sensitive adhesives. Main uses with silicone PSA tape forms include adhesive transfer tapes, industrial single coated or double coated tapes, labels, silicone foams or rubber tapes, in process liner for converting, and silicone PSA assembly tapes':
    '산업용 실리콘 PSA의 이형. 실리콘 PSA 테이프 형태의 주요 용도: 접착 전사 테이프, 산업용 단면·양면 테이프, 라벨, 실리콘 폼·고무 테이프, 컨버팅 공정용 라이너, 실리콘 PSA 조립 테이프',
  'Release coating for pressure sensitive laminate/labelstock': '감압 라미네이트·라벨 원단용 이형 코팅',
}
const auxTr = (m: Record<string, string>, s: string): Cell => (s ? bi(s, m[s] ?? s) : '')

type Aux = { sec: string; n: string; cure: string; visc: string; nv: string; f: string; a: string }
const auxRows: Cell[][] = (PSA2_AUX as readonly Aux[]).map((x) => [
  bi(x.sec, AUX_SEC_KO[x.sec] ?? x.sec),
  x.n,
  x.cure ? bi(x.cure, x.cure === 'Platinum' ? '백금' : x.cure === 'Platinum and Tin' ? '백금·주석' : x.cure) : '–',
  x.visc || '–',
  x.nv || '–',
  auxTr(AUX_F, x.f),
  auxTr(AUX_A, x.a),
])

// 표 3 (원문 머리말 그대로)
const REL_HEAD: Cell[] = [
  bi('Pressure sensitive adhesives', '감압 점착제'),
  ...(PSA2_RELEASE[1].slice(1) as readonly string[]),
].map((c, i) => (i === 0 ? c : (c as string)))
const relHeadFull: Cell[] = [
  REL_HEAD[0],
  'Transfer coated: SYL-OFF™ 7555 Coating', 'Transfer coated: SYL-OFF™ Q2-7785 Release Coating', 'Transfer coated: SYL-OFF™ Q2-7786 Coating',
  'Transfer coated: SYL-OFF™ 7792 Fluorosilicone Release Coating', 'Transfer coated: SYL-OFF™ 7795 Fluorosilicone Release Coating',
  'Dry lamination: SYL-OFF™ 7555 Coating', 'Dry lamination: Typical applications', 'Dry lamination: Typical applications', 'Dry lamination: Features/benefits', 'Dry lamination: Typical applications',
]
const relRows: Cell[][] = PSA2_RELEASE.slice(2).map((r) => [r[0], ...(r.slice(1) as readonly string[])])

const baseFaq = {
  q: { en: 'Where can I get technical support for Dow silicone PSAs in Korea?', ko: '국내에서 Dow 실리콘 PSA 기술 지원은 어디에서 받을 수 있습니까?' },
  a: {
    en: 'Korea Construction Trading (KCT) supports product selection, technical documents, process conditions and troubleshooting to the best of its ability: sales@kconstrade.com, +82 10-8939-0284.',
    ko: '한국건설트레이딩(KCT)이 제품 선정, 기술 자료, 공정 조건 검토, 문제 해결 상담을 최선을 다해 지원합니다: sales@kconstrade.com, 010-8939-0284.',
  },
}

export const PSA2: IPage[] = [
  {
    slug: 'high-performance-psa-overview', no: 1, pdfPages: '1–3', doc: DOC,
    title: { en: 'Choose Dow Silicone PSAs for High Performance: Comprehensive Offerings (2024 Guide)', ko: '고성능을 위한 Dow 실리콘 PSA 선택 – 종합 제품군 (2024 최신 가이드)' },
    summary: { en: 'Overview of the 2024 Dow silicone PSA selection guide: advantages over organic adhesives, service capabilities, compatible substrates, how to select, blending graph and the structure of a protective film.', ko: '2024년판 Dow 실리콘 PSA 선택 가이드 개요: 유기 점착제 대비 장점, 성능 특성, 적용 가능 기재, 선정 방법, 블렌딩 그래프, 보호 필름 구조.' },
    answer: {
      en: 'Dow silicone pressure sensitive adhesives (PSAs) offer a wide service-temperature range, adhesion to low-energy surfaces, conformability, clean removability, moisture/UV resistance, sound and shock dampening and electrical insulation properties that acrylic and natural-rubber adhesives cannot match. Different platinum-cure PSAs can be blended to reach a range of adhesion levels (about 5 to 50 g/in for 10/90 to 80/20 high/low-adhesion blend ratios in Dow laboratory conditions).',
      ko: 'Dow 실리콘 감압 점착제(PSA)는 아크릴·천연고무 등 유기 점착제가 따라올 수 없는 넓은 사용 온도 범위, 저에너지 표면 접착, 추종성, 깨끗한 제거성, 내습·내UV성, 방음·완충, 전기 절연 특성을 제공합니다. 서로 다른 백금 경화 PSA를 블렌딩하면 다양한 접착력 수준을 얻을 수 있습니다(Dow 실험실 조건에서 고/저접착 PSA 블렌드 비율 10/90~80/20일 때 약 5~50 g/in).',
    },
    image: IMG('psa2-cover'),
    sections: [
      sec('cover', 'Choose Dow silicone PSAs for high performance', '고성능을 위한 Dow 실리콘 PSA 선택',
        fig(IMG('psa2-cover'), 'Cover of “Choose Dow silicone PSAs for high performance” — Films, Tapes and Release Liners', '「Choose Dow silicone PSAs for high performance」 표지 — 필름·테이프·이형 라이너'),
        p('Dow is a leader in silicone-based solutions for the fast-growing PSA industry. You work to balance demands for tack, adhesive/cohesive strength and electrical properties while also facing various substrate and processing parameters. And through it all, you look for the right balance of cost and performance to be competitive. We work to design products that help you meet these needs and find that balance.',
          'Dow는 빠르게 성장하는 PSA 산업을 위한 실리콘 기반 솔루션의 선두 기업입니다. 여러분은 택, 접착력·응집력, 전기적 특성의 요구를 균형 있게 맞추면서 다양한 기재와 공정 조건도 감당해야 하고, 경쟁력을 위해 비용과 성능의 적정 균형도 찾아야 합니다. Dow는 이런 요구를 충족하고 균형을 찾도록 돕는 제품을 설계합니다.')),
      sec('advantages', 'Advantages and capabilities', '장점과 성능 특성',
        p('Dow silicone pressure sensitive adhesives (PSAs) offer critical advantages that cannot be matched by organic adhesives such as acrylic, natural rubber and other competing materials. The pressure sensitive adhesives in this guide offer the following high-performance silicone capabilities:',
          'Dow 실리콘 감압 점착제(PSA)는 아크릴, 천연고무 등 유기 점착제와 경쟁 소재가 따라올 수 없는 핵심 장점을 제공합니다. 이 가이드의 점착제는 다음의 고성능 실리콘 특성을 제공합니다.'),
        ul(
          ['A wide service-temperature range', '넓은 사용 온도 범위'],
          ['Adhesion to low-energy surfaces', '저에너지 표면에 대한 접착'],
          ['Conformability', '추종성(conformability)'],
          ['Clean removability', '깨끗한 제거성'],
          ['Moisture/UV resistance', '내습·내UV성'],
          ['Sound dampening / shock dampening', '방음·충격 완충'],
          ['Electrical insulation properties', '전기 절연 특성'],
          ['Much more', '그 밖의 다양한 특성'],
        ),
        p('You will find that our high-performance line of silicone PSAs can help you make specialty tapes, labels and films better and improve your overall system success. You also can use them as independent adhesives for a variety of bonding, fastening and holding applications.',
          'Dow의 고성능 실리콘 PSA 제품군은 특수 테이프, 라벨, 필름을 더 좋게 만들고 시스템 전체의 성공률을 높이는 데 도움이 됩니다. 또한 다양한 접합·체결·고정 용도의 독립 접착제로도 사용할 수 있습니다.'),
        h('Compatible substrates', '접착 가능한 기재'),
        p('They adhere to a wide range of substrates, including:', '다음을 비롯한 다양한 기재에 접착됩니다.'),
        ul(
          ['Glass', '유리'], ['Silicone rubber', '실리콘 고무'], ['Teflon film', '테플론 필름'], ['PTFE (polytetrafluoroethylene)', 'PTFE(폴리테트라플루오로에틸렌)'],
          ['Paper', '종이'], ['Silicone-varnished cloth', '실리콘 바니시 처리 직물'], ['Mylar PET film', 'Mylar PET 필름'], ['FEP (fluorinated ethylene propylene)', 'FEP(불소화 에틸렌 프로필렌)'],
          ['Fabric', '직물'], ['Silicone/glass laminates', '실리콘/유리 라미네이트'], ['Kapton polyimide film', 'Kapton 폴리이미드 필름'], ['Aluminum foil', '알루미늄 포일'],
          ['Plastics', '플라스틱'], ['Polyester', '폴리에스터'], ['Glass cloth', '유리 섬유 직물'], ['Stainless steel', '스테인리스강'],
        )),
      sec('success', 'Silicone-based solutions for customer success', '고객의 성공을 위한 실리콘 기반 솔루션',
        p('Dow silicone-based solutions for pressure sensitive adhesives provide exceptional adhesive performance for specialty tapes, high-performance films and labels that cannot be matched by organic adhesives such as acrylic, natural rubber and other competitive materials. No matter what your goals are – to innovate, grow reliably or drive costs down – we have the solutions you need. Our more than 60 years of industry experience give us a unique understanding of the challenges you face, as well as the expertise to provide you with a total systems solution tailored to meet your needs. Choose from our wide range of pressure sensitive adhesives to find the exact solution you need to grow your business.',
          'Dow의 실리콘 기반 감압 점착제 솔루션은 특수 테이프, 고성능 필름, 라벨에서 아크릴·천연고무 등 유기 점착제와 경쟁 소재가 따라올 수 없는 뛰어난 접착 성능을 제공합니다. 혁신, 안정적인 성장, 비용 절감 등 목표가 무엇이든 필요한 솔루션이 있습니다. 60년 넘는 업계 경험으로 고객이 마주한 과제를 깊이 이해하고 있으며, 요구에 맞춘 토털 시스템 솔루션을 제공할 전문성을 갖추고 있습니다. 폭넓은 PSA 제품군에서 사업 성장에 필요한 정확한 솔루션을 선택하십시오.')),
      sec('selecting', 'Selecting the best silicone PSA for your application', '용도에 맞는 최적의 실리콘 PSA 선정',
        p('Selecting the best silicone PSA for your application can be a complex undertaking. Substrate requirements; equipment limitations; performance demands for tack, adhesion and cohesive strength and the need for release all enter into the picture. This guide will help you simplify the selection process.',
          '용도에 가장 적합한 실리콘 PSA를 고르는 일은 복잡할 수 있습니다. 기재 요건, 설비 제약, 택·접착력·응집력에 대한 성능 요구, 이형 필요성이 모두 관련됩니다. 이 가이드는 선정 과정을 단순하게 만들어 줍니다.'),
        ul(
          ['Begin with Table 1, “Application overview.” It tells you which adhesives in the global silicone PSA line meet your basic application needs for specialty tapes, high-performance films and labels.', '먼저 표 1 「Application overview(용도 개요)」로 특수 테이프, 고성능 필름, 라벨의 기본 용도에 맞는 PSA를 확인합니다.'],
          ['Then consult Table 2, “Product specifications and typical performance properties,” for more in-depth information: whether a peroxide- or platinum-cure silicone PSA is better for your needs and which product best meets your requirements for tack, adhesion and high-temperature hold and other needs.', '이어서 표 2 「제품 사양 및 대표 성능」으로 더 자세한 정보를 확인합니다. 과산화물 경화와 백금 경화 중 어느 쪽이 적합한지, 택·접착력·고온 유지력 등에 가장 맞는 제품이 무엇인지 판단할 수 있습니다.'],
        ),
        p('To meet customers’ diverse application needs, different platinum-cure PSAs can be blended to achieve a variety of adhesion levels. The graph below shows examples of blending ratios to achieve varying adhesion levels. With Dow brand silicone PSAs, there are many ways to achieve the exact balance of performance properties your application requires. If none of the materials in this guide appear to meet your needs, contact your Dow technical representative for additional suggestions.',
          '고객의 다양한 용도 요구를 충족하기 위해 서로 다른 백금 경화 PSA를 블렌딩해 여러 접착력 수준을 얻을 수 있습니다. 아래 그래프는 접착력 수준별 블렌딩 비율의 예입니다. Dow 실리콘 PSA로는 용도가 요구하는 성능 균형을 정확히 맞추는 다양한 방법이 있습니다. 이 가이드의 소재가 요구에 맞지 않으면 Dow 기술 담당자에게 문의해 추가 제안을 받으십시오.'),
        fig(IMG('psa2-blend-graph'), 'High / low adhesion PSA blends ratio vs. adhesion (10/90: about 4–5 g/in, 33/67: about 5, 50/50: about 7, 60/40: about 12, 70/30: about 22, 80/20: about 50 g/in). Graph shows typical blending characteristics under Dow laboratory conditions and is intended for reference purposes only.', '고/저접착 PSA 블렌드 비율 대 접착력(10/90 약 4~5 g/in, 33/67 약 5, 50/50 약 7, 60/40 약 12, 70/30 약 22, 80/20 약 50 g/in). 그래프는 Dow 실험실 조건의 대표적인 블렌딩 특성이며 참고용입니다.'),
        h('Typical structure of protective film', '보호 필름의 일반적인 구조'),
        fig(IMG('psa2-protective-film-structure'), 'Typical structure of protective film: 1 PET base/carrier film; 2 DOWSIL™ low-adhesion, low-migration silicone PSA; 3 hard coating; 4 PET base/carrier film; 5 DOWSIL™ low-adhesion, low-migration silicone PSA; 6 disposable release liner', '보호 필름의 일반적 구조: ① PET 베이스/캐리어 필름 ② DOWSIL™ 저접착·저이행 실리콘 PSA ③ 하드 코팅 ④ PET 베이스/캐리어 필름 ⑤ DOWSIL™ 저접착·저이행 실리콘 PSA ⑥ 일회용 이형 라이너')),
    ],
    faq: [
      { q: { en: 'What substrates do Dow silicone PSAs adhere to?', ko: 'Dow 실리콘 PSA는 어떤 기재에 접착됩니까?' }, a: { en: 'Glass, silicone rubber, Teflon film, PTFE, paper, silicone-varnished cloth, Mylar PET, FEP, fabric, silicone/glass laminates, Kapton polyimide, aluminum foil, plastics, polyester, glass cloth and stainless steel, among others.', ko: '유리, 실리콘 고무, 테플론 필름, PTFE, 종이, 실리콘 바니시 직물, Mylar PET, FEP, 직물, 실리콘/유리 라미네이트, Kapton 폴리이미드, 알루미늄 포일, 플라스틱, 폴리에스터, 유리 섬유 직물, 스테인리스강 등입니다.' } },
      { q: { en: 'How can adhesion be adjusted?', ko: '접착력은 어떻게 조절합니까?' }, a: { en: 'Different platinum-cure PSAs can be blended; in Dow’s laboratory example a high/low-adhesion blend moves from about 4–5 g/in at 10/90 to about 50 g/in at 80/20.', ko: '서로 다른 백금 경화 PSA를 블렌딩합니다. Dow 실험실 예에서 고/저접착 PSA 블렌드는 10/90에서 약 4~5 g/in, 80/20에서 약 50 g/in입니다.' } },
      baseFaq,
    ],
  },

  {
    slug: 'application-overview-table', no: 2, pdfPages: '4–5', doc: DOC,
    title: { en: 'Table 1: Application Overview – Solutions for Films and Specialty Tapes', ko: '표 1: 용도 개요 – 필름·특수 테이프용 PSA 선정표' },
    summary: { en: 'Which DOWSIL™ PSA, mica binder, solventless PSA and SYL-OFF™ release coating is suggested for masking, electrical, splicing, protective-film, double-sided tape, label and liner applications.', ko: '마스킹·전기·스플라이싱·보호 필름·양면 테이프·라벨·라이너 용도별로 권장되는 DOWSIL™ PSA, 마이카 바인더, 무용제 PSA, SYL-OFF™ 이형 코팅제.' },
    answer: {
      en: 'Table 1 maps 50 products to 14 end uses in four groups: masking and specialty tape solutions (high adhesion), protective film and tape solutions (low adhesion), assembly tape and label solutions, and specialty liners. For electrical and electronics tapes, the guide marks DOWSIL™ 7268, Q2-7406, 7388, 7406-VLO, 7355, 7356, 7357, 7358, Q2-7566 and SD 4600 FC for electrical, electronic, heat-shielding and terminal cable insulation tapes, and DOWSIL™ 7268, 7278, 7280, Q2-7406, 7355, 7356, 7357, 7358, 7657, 7687 and 7687N for industrial bonding and bundling tapes.',
      ko: '표 1은 50개 제품을 4개 그룹의 14개 용도(마스킹·특수 테이프(고접착), 보호 필름·테이프(저접착), 조립 테이프·라벨, 특수 라이너)에 연결합니다. 전기·전자·차열·단자 케이블 절연 테이프에는 DOWSIL™ 7268, Q2-7406, 7388, 7406-VLO, 7355, 7356, 7357, 7358, Q2-7566, SD 4600 FC가, 산업용 접합·결속 전기·전자 테이프에는 DOWSIL™ 7268, 7278, 7280, Q2-7406, 7355, 7356, 7357, 7358, 7657, 7687, 7687N이 표시되어 있습니다.',
    },
    image: IMG('psa2-cover'),
    sections: [
      sec('table1', 'Table 1: Application overview – solutions for films and specialty tapes', '표 1: 용도 개요 – 필름·특수 테이프 솔루션',
        p('The table below reproduces Table 1 of the guide. A bullet (•) means “suggested.” Column groups: masking and specialty tape solutions (high adhesion) — columns 1–7 (masking tapes 1–3, specialty tapes 4–7) and mica-tape binders (8); protective film and tape solutions (low adhesion) — columns 9–11; assembly tape and label solutions — columns 12–14 (double-sided tapes, specialty labels, specialty liners). Scroll horizontally on small screens.',
          '아래 표는 가이드의 표 1을 그대로 옮긴 것입니다. 점(•)은 「권장(Suggested)」을 뜻합니다. 열 그룹: 마스킹·특수 테이프(고접착) — 1~7열(마스킹 테이프 1~3, 특수 테이프 4~7)과 마이카 테이프 바인더(8열), 보호 필름·테이프(저접착) — 9~11열, 조립 테이프·라벨 — 12~14열(양면 테이프, 특수 라벨, 특수 라이너). 작은 화면에서는 가로로 스크롤하세요.'),
        {
          k: 'tbl', big: true,
          head: [bi('Product', '제품'), ...T1_COLS.map((c, i) => bi(`${i + 1}. ${(c as [string, string])[0]}`, `${i + 1}. ${(c as [string, string])[1]}`))],
          rows: matrixRows,
          note: { en: 'Please note: suggestions in the table are typical applications, subject to customer process conditions. Use of products is not necessarily limited to these applications. Emerging applications could be added after consulting with Dow. • = suggested.', ko: '참고: 표의 제안은 대표적인 용도이며 고객의 공정 조건에 따라 달라질 수 있습니다. 제품 사용이 이 용도로 반드시 한정되는 것은 아닙니다. 새로운 용도는 Dow와 협의 후 추가될 수 있습니다. • = 권장.' },
        }),
    ],
    faq: [
      { q: { en: 'Which DOWSIL PSAs are suggested for electrical insulation tapes?', ko: '전기 절연 테이프에는 어떤 DOWSIL PSA가 권장됩니까?' }, a: { en: 'In Table 1 the column “Electrical, electronic, heat-shielding and terminal cable insulation tapes” marks DOWSIL™ 7268, Q2-7406, 7388, 7406-VLO, 7355, 7356, 7357, 7358, Q2-7566 and SD 4600 FC.', ko: '표 1의 「전기·전자·차열·단자 케이블 절연 테이프」 열에 DOWSIL™ 7268, Q2-7406, 7388, 7406-VLO, 7355, 7356, 7357, 7358, Q2-7566, SD 4600 FC가 표시되어 있습니다.' } },
      baseFaq,
    ],
  },

  {
    slug: 'product-specifications-table', no: 3, pdfPages: '6', doc: DOC,
    title: { en: 'Table 2: Product Specifications and Typical Performance Properties (Viscosity, Adhesion, Tack, High-Temperature Hold)', ko: '표 2: 제품 사양 및 대표 성능 (점도·접착력·택·고온 유지력)' },
    summary: { en: 'Cure system, viscosity, non-volatile content, adhesion, probe tack and high-temperature hold/shear for 41 DOWSIL™ PSAs, mica binders and solventless adhesives.', ko: 'DOWSIL™ PSA·마이카 바인더·무용제 점착제 41종의 경화 방식, 점도, 불휘발분, 접착력, 프로브 택, 고온 유지력/전단.' },
    answer: {
      en: 'Peroxide-cure DOWSIL™ PSAs such as 280A, 7355, 7356, 7358 and Q2-7406 hold to 260 °C (500 °F); Q2-7566 holds to 288 °C (550 °F) and platinum-cure DOWSIL™ SD 4600 FC to 300 °C (572 °F). DOWSIL™ 7657 (platinum) has the highest probe tack in the table at 1,160 g with 1,280 g/in adhesion; DOWSIL™ 7695 reaches 1,400–1,800 g/in and DOWSIL™ 7687/7687N 1,800 g/in. Values are typical and not for specifications.',
      ko: '과산화물 경화 DOWSIL™ 280A, 7355, 7356, 7358, Q2-7406은 260 °C(500 °F)까지, Q2-7566은 288 °C(550 °F)까지, 백금 경화 DOWSIL™ SD 4600 FC는 300 °C(572 °F)까지 유지됩니다. 백금 경화 DOWSIL™ 7657은 프로브 택 1,160 g, 접착력 1,280 g/in로 표에서 택이 가장 높고, DOWSIL™ 7695는 1,400~1,800 g/in, 7687/7687N은 1,800 g/in입니다. 수치는 대표값이며 시방용이 아닙니다.',
    },
    image: IMG('psa2-cover'),
    sections: [
      sec('pa', 'Pressure sensitive adhesives and mica binders', '감압 점착제 및 마이카 바인더',
        { k: 'tbl', big: true, head: SPEC_HEAD, rows: specRows(0, PSA2_SPECS_PA), note: FNOTE }),
      sec('sl', 'Solventless pressure sensitive adhesives', '무용제 감압 점착제',
        { k: 'tbl', big: true, head: SPEC_HEAD, rows: specRows(PSA2_SPECS_PA, PSA2_SPECS.length), note: FNOTE },
        note('N/A = not available / not applicable. Peroxide-cure PSAs are one-part systems cured with benzoyl peroxide; platinum-cure PSAs need a platinum catalyst (SYL-OFF™ 4000 Catalyst). See the processing and curing page.', 'N/A = 해당 없음/자료 없음. 과산화물 경화 PSA는 과산화벤조일로 경화하는 1액형이고, 백금 경화 PSA는 백금 촉매(SYL-OFF™ 4000 Catalyst)가 필요합니다. 「가공 및 경화」 페이지를 참조하세요.')),
    ],
    faq: [
      { q: { en: 'Which DOWSIL PSA has the highest high-temperature hold?', ko: '고온 유지력이 가장 높은 DOWSIL PSA는?' }, a: { en: 'DOWSIL™ SD 4600 FC (platinum cure) is listed at 300 °C (572 °F); DOWSIL™ Q2-7566 is listed at 288 °C (550 °F).', ko: '백금 경화 DOWSIL™ SD 4600 FC가 300 °C(572 °F), DOWSIL™ Q2-7566이 288 °C(550 °F)로 표기되어 있습니다.' } },
      { q: { en: 'Can these values be used for specifications?', ko: '이 수치를 시방서에 사용할 수 있습니까?' }, a: { en: 'No. Dow states the values are average quality data for comparison only and not intended for specifications; contact Dow for specification limits.', ko: '아니요. Dow는 이 값이 비교용 평균 품질 데이터이며 시방 작성용이 아니라고 명시합니다. 시방 한도는 Dow에 문의해야 합니다.' } },
      baseFaq,
    ],
  },

  {
    slug: 'features-and-applications', no: 4, pdfPages: '7', doc: DOC,
    title: { en: 'Features/Benefits and Typical Applications of Each DOWSIL™ PSA', ko: '제품별 특징·장점과 대표 용도 (DOWSIL™ PSA)' },
    summary: { en: 'Features, benefits and typical applications for each DOWSIL™ PSA, mica binder and solventless adhesive: masking, plating, splicing, electrical tapes, protective films, low Si-migration and mica tape binders.', ko: 'DOWSIL™ PSA·마이카 바인더·무용제 점착제별 특징·장점과 대표 용도: 마스킹, 플레이팅, 스플라이싱, 전기 테이프, 보호 필름, 저 Si 이행, 마이카 테이프 바인더.' },
    answer: {
      en: 'Peroxide-cure DOWSIL™ 7355, 7356 and 7358 combine high-temperature performance with low silicone volatiles for masking, thermal-spray masking and electrical-insulation wraps; DOWSIL™ 7406-VLO is the low-volatile version of Q2-7406; DOWSIL™ 7657 cures as low as 80 °C; low-adhesion platinum PSAs such as 7685 and 7645–7660 target protective films; 288, 290 and 298 are binders for flame-retardant mica tapes.',
      ko: '과산화물 경화 DOWSIL™ 7355·7356·7358은 고온 성능과 낮은 실리콘 휘발분을 겸해 마스킹, 용사 마스킹, 전기 절연 랩에 쓰이고, DOWSIL™ 7406-VLO는 Q2-7406의 저휘발 버전, DOWSIL™ 7657은 80 °C부터 경화됩니다. 7685, 7645~7660 등 저접착 백금 PSA는 보호 필름용, 288·290·298은 난연 마이카 테이프 바인더입니다.',
    },
    image: IMG('psa2-cover'),
    sections: [
      sec('features', 'Features/benefits and typical applications', '특징·장점 및 대표 용도',
        { k: 'tbl', big: true, head: [bi('Product', '제품'), bi('Features/benefits', '특징·장점'), bi('Typical applications', '대표 용도')], rows: featRows(0, PSA2_SPECS.length),
          note: { en: 'Original table as printed on page 7 of the guide; some rows end with a semicolon as in the original.', ko: '가이드 7쪽의 표를 그대로 옮긴 것이며, 일부 행이 세미콜론으로 끝나는 것도 원문 표기입니다.' } }),
    ],
    faq: [
      { q: { en: 'Which PSA has low silicone volatiles to reduce oven dusting?', ko: '오븐 분진을 줄이려면 어떤 PSA를 쓰나요?' }, a: { en: 'DOWSIL™ 7406-VLO, 7355 and 7358 (the guide names these three) and others marked “low silicone volatiles”.', ko: 'DOWSIL™ 7406-VLO, 7355, 7358(가이드에 명시된 3종)과 표에서 「낮은 실리콘 휘발분」으로 표기된 제품입니다.' } },
      { q: { en: 'Which DOWSIL products are binders for mica tape?', ko: '마이카 테이프 바인더는 어떤 제품입니까?' }, a: { en: 'DOWSIL™ 288, 290 and 298 Mica Binders (peroxide cure; 290 and 298 also silane).', ko: 'DOWSIL™ 288, 290, 298 Mica Binder입니다(과산화물 경화, 290·298은 실란 병용).' } },
      baseFaq,
    ],
  },

  {
    slug: 'primers-crosslinkers-release-coatings', no: 5, pdfPages: '8', doc: DOC,
    title: { en: 'Primer, Crosslinkers, Anchorage Additives and Fluorosilicone Release Coatings', ko: '프라이머·가교제·앵커리지 첨가제·불소실리콘 이형 코팅제' },
    summary: { en: 'DOWSIL™ 7499 PSA Primer, SYL-OFF™ crosslinkers (SL 7028, 7678, Q2-7560, SL 7561), anchorage additives (SL 9250, 297, 397) and fluorosilicone release coatings (Q2-7785, 7786, 7792, 7795, 7798, 7555).', ko: 'DOWSIL™ 7499 PSA 프라이머, SYL-OFF™ 가교제(SL 7028, 7678, Q2-7560, SL 7561), 앵커리지 첨가제(SL 9250, 297, 397), 불소실리콘 이형 코팅제(Q2-7785, 7786, 7792, 7795, 7798, 7555).' },
    answer: {
      en: 'Auxiliary materials improve cure and anchorage: DOWSIL™ 7499 PSA Primer (platinum and tin cure, 23% non-volatile) is a primer for silicone PSA on diversified films; SYL-OFF™ SL 7028 and 7678 are crosslinkers for low-adhesion protective films or carrier tapes; SYL-OFF™ SL 9250, 297 and 397 improve anchorage; and the SYL-OFF™ Q2-7785, 7786, 7792, 7795, 7798 and 7555 coatings release industrial-grade silicone PSAs.',
      ko: '보조 소재가 경화와 앵커리지를 높입니다. DOWSIL™ 7499 PSA Primer(백금·주석 경화, 불휘발분 23%)는 다양한 필름에서 실리콘 PSA용 프라이머이고, SYL-OFF™ SL 7028·7678은 저접착 보호 필름·캐리어 테이프용 가교제, SL 9250·297·397은 앵커리지 첨가제, SYL-OFF™ Q2-7785·7786·7792·7795·7798·7555는 산업용 실리콘 PSA 이형 코팅제입니다.',
    },
    image: IMG('psa2-cover'),
    sections: [
      sec('aux', 'More options: primer, crosslinkers, anchorage additives, release coatings', '추가 선택지: 프라이머·가교제·앵커리지 첨가제·이형 코팅제',
        p('The guide’s product line also includes auxiliary materials like crosslinkers, anchorage additives and compatible silicone primers that help increase adhesives’ curing and offer good anchorage to difficult substrates. Table 2 (continued) lists them with the fluorosilicone release coatings used with the PSAs.',
          '이 제품군에는 가교제, 앵커리지 첨가제, 호환 실리콘 프라이머 같은 보조 소재도 있어 점착제의 경화를 높이고 접착이 어려운 기재에서 우수한 앵커리지를 제공합니다. 표 2(계속)는 이들과 PSA에 함께 쓰는 불소실리콘 이형 코팅제를 정리한 것입니다.'),
        { k: 'tbl', big: true, head: [bi('Type', '구분'), bi('Product', '제품'), bi('Cure system', '경화 방식'), bi('Viscosity, cps', '점도, cps'), bi('Non-volatile content, %', '불휘발분, %'), bi('Features/benefits', '특징·장점'), bi('Typical applications', '대표 용도')], rows: auxRows, note: FNOTE }),
    ],
    faq: [
      { q: { en: 'How do I improve anchorage of low-adhesion PSA on film?', ko: '필름에서 저접착 PSA의 앵커리지를 높이려면?' }, a: { en: 'Use DOWSIL™ 7499 PSA Primer, or anchorage additives SYL-OFF™ SL 9250, 297 or 397 (397 is for filmic substrates).', ko: 'DOWSIL™ 7499 PSA Primer를 쓰거나 앵커리지 첨가제 SYL-OFF™ SL 9250, 297, 397(397은 필름 기재용)을 사용합니다.' } },
      baseFaq,
    ],
  },

  {
    slug: 'release-coating-and-transfer-coating', no: 6, pdfPages: '9', doc: DOC,
    title: { en: 'Release of Silicone PSAs: Fluorosilicone Release Coatings and Table 3 (Transfer Coating / Direct Cast)', ko: '실리콘 PSA의 이형 – 불소실리콘 이형 코팅제와 표 3 (전사 코팅·직접 캐스팅)' },
    summary: { en: 'How SYL-OFF™ fluorosilicone release coatings give consistent release from silicone PSAs, how to create differential release (1.2–2.5 ratio), and Table 3 of recommended PSA / release-coating combinations.', ko: 'SYL-OFF™ 불소실리콘 이형 코팅제가 실리콘 PSA에서 일관된 이형을 제공하는 방식, 차등 이형(1.2~2.5 비) 구현 방법, PSA·이형 코팅제 조합 권장표(표 3).' },
    answer: {
      en: 'SYL-OFF™ fluorosilicone release coatings are designed to provide consistent, stable release from Dow silicone PSAs for transfer films, labels and two-sided tapes. A differential release force can be created from the difference between direct-cast and nipped liner, giving a differential of 1.2–2.5 ratio depending on the application. Table 3 marks combinations as recommended (◊) or recommended under specific conditions (•).',
      ko: 'SYL-OFF™ 불소실리콘 이형 코팅제는 Dow 실리콘 PSA에서 전사 필름, 라벨, 양면 테이프를 위한 일관되고 안정적인 이형을 제공하도록 설계되었습니다. 직접 캐스팅 라이너와 닙(nipped) 라이너의 차이로 용도에 따라 1.2~2.5 비율의 차등 이형력을 만들 수 있습니다. 표 3은 조합을 권장(◊) 또는 특정 조건에서 권장(•)으로 표시합니다.',
    },
    image: IMG('psa2-tape-construction'),
    sections: [
      sec('release', 'Release of silicone pressure sensitive adhesives', '실리콘 감압 점착제의 이형',
        p('SYL-OFF™ fluorosilicone release coatings are designed to provide consistent, stable release from Dow silicone pressure sensitive adhesives, which allows you to develop and produce transfer films, labels, two-sided tapes and other release-liner constructions. Dow offers a range of fluorosilicone release coatings and complementary silicone PSAs. This provides an array of choices that can help with extending the adhesive performance of silicone PSAs to new applications, developing more innovative products, meeting changing customer needs, entering new markets, and achieving the best balance of economy and performance. Use Table 3 to explore combinations of Dow silicone PSAs and SYL-OFF™ fluorosilicone release coatings for specific release-liner coating applications.',
          'SYL-OFF™ 불소실리콘 이형 코팅제는 Dow 실리콘 감압 점착제에서 일관되고 안정적인 이형을 제공하도록 설계되어, 전사 필름, 라벨, 양면 테이프 및 기타 이형 라이너 구조를 개발·생산할 수 있게 합니다. Dow는 다양한 불소실리콘 이형 코팅제와 보완적인 실리콘 PSA를 제공합니다. 이를 통해 실리콘 PSA의 접착 성능을 새로운 용도로 확장하고, 더 혁신적인 제품을 개발하고, 변화하는 고객 요구에 대응하고, 새 시장에 진입하고, 경제성과 성능의 최적 균형을 달성할 수 있습니다. 표 3으로 특정 이형 라이너 코팅 용도에 맞는 Dow 실리콘 PSA와 SYL-OFF™ 불소실리콘 이형 코팅제의 조합을 살펴보십시오.'),
        fig(IMG('psa2-tape-construction'), 'Tape constructions: single-sided (liner / adhesive / carrier) and double-sided (liner / adhesive / carrier / adhesive)', '테이프 구조: 단면(라이너 / 점착제 / 캐리어)과 양면(라이너 / 점착제 / 캐리어 / 점착제)'),
        h('Explore the potential', '가능성 탐색'),
        p('Double-sided tapes, unsupported or transfer tapes often may require a differential in release to avoid confusion during application. One option to create a differential release force is to utilize the difference between direct-cast and nipped liner to achieve a differential of 1.2-2.5 ratio, depending on the application’s needs. SYL-OFF™ Release Coatings offer alternative options to process transfer-coated PSA and still obtain a differential release force.',
          '양면 테이프, 무기재(unsupported) 또는 전사 테이프는 시공 중 혼동을 피하기 위해 이형력에 차이(differential)가 필요한 경우가 많습니다. 차등 이형력을 만드는 한 가지 방법은 직접 캐스팅(direct-cast) 라이너와 닙(nipped) 라이너의 차이를 이용해 용도에 따라 1.2~2.5 비율의 차등을 얻는 것입니다. SYL-OFF™ 이형 코팅제는 전사 코팅 PSA를 가공하면서도 차등 이형력을 얻을 수 있는 대안을 제공합니다.')),
      sec('table3', 'Table 3. DOWSIL™ silicone PSAs for transfer coating / direct cast applications', '표 3. 전사 코팅·직접 캐스팅용 DOWSIL™ 실리콘 PSA',
        { k: 'tbl', big: true, head: relHeadFull, rows: relRows,
          note: { en: '◊ Recommended; • Recommended under specific conditions. The header labels of the last four columns repeat “Typical applications / Features/benefits” exactly as printed in the original table; the original prints ◊ in these columns.', ko: '◊ 권장, • 특정 조건에서 권장. 마지막 4개 열의 머리말(「Typical applications / Features/benefits」 반복)과 이 열의 ◊ 표기는 원문 표 그대로입니다.' } }),
    ],
    faq: [
      { q: { en: 'What is a differential release and how is it made?', ko: '차등 이형(differential release)이란 무엇이고 어떻게 만듭니까?' }, a: { en: 'Double-sided and transfer tapes often need different release forces on each liner. One option is using the difference between direct-cast and nipped liner for a 1.2–2.5 ratio; SYL-OFF™ coatings offer alternatives for transfer-coated PSA.', ko: '양면·전사 테이프는 라이너마다 이형력이 달라야 하는 경우가 많습니다. 직접 캐스팅 라이너와 닙 라이너의 차이로 1.2~2.5 비를 얻을 수 있고, SYL-OFF™ 코팅제는 전사 코팅 PSA에 대한 대안을 제공합니다.' } },
      baseFaq,
    ],
  },

  {
    slug: 'processing-and-curing-2024', no: 7, pdfPages: '10–11', doc: DOC,
    title: { en: 'Processing and Curing Considerations (2024): Platinum and Peroxide Cure, Oven Dusting, Anchorage', ko: '가공 및 경화 시 고려사항 (2024): 백금·과산화물 경화, 오븐 분진, 앵커리지' },
    summary: { en: 'Updated processing guidance: platinum cure (catalyst, six-hour bath life, 80 °C cure), peroxide cure (0.5–3.0% benzoyl peroxide, solvent removal 65–93 °C, heat cure), oven dusting, anchorage and the adhesion-vs-tack graph.', ko: '갱신된 가공 지침: 백금 경화(촉매, 6시간 배스 수명, 80 °C 경화), 과산화물 경화(과산화벤조일 0.5~3.0%, 65~93 °C 용제 제거, 열 경화), 오븐 분진, 앵커리지, 접착력-택 그래프.' },
    answer: {
      en: 'Platinum-cure DOWSIL™ PSAs need SYL-OFF™ 4000 Catalyst and the coating bath should be used within six hours (the 2006 guide said 24 hours); they cure from 80 °C (typical dwell: 2 min at 100 °C to 1 min at 125 °C). Peroxide-cure PSAs use 0.5–3.0% benzoyl peroxide by weight; remove solvent at 65–93 °C first, then typically 1 min at 66 °C followed by 2 min at 177–204 °C.',
      ko: '백금 경화 DOWSIL™ PSA는 SYL-OFF™ 4000 Catalyst가 필요하며 코팅 배스는 6시간 이내에 사용해야 합니다(2006년판은 24시간). 80 °C부터 경화되며 일반 체류 시간은 100 °C 2분~125 °C 1분입니다. 과산화물 경화 PSA는 과산화벤조일 0.5~3.0%(중량)를 쓰고, 먼저 65~93 °C에서 용제를 제거한 뒤 보통 66 °C 1분 후 177~204 °C 2분 경화합니다.',
    },
    image: IMG('psa2-adhesion-vs-tack'),
    sections: [
      sec('processing', 'Processing and curing considerations', '가공 및 경화 시 고려사항',
        p('Dow silicone PSAs can be applied to backing materials as supplied, using conventional tape-coating equipment. However, they are most often diluted with toluene, xylene or other nonpolar solvents to achieve a coatable viscosity*. Coat-weight control is critical for consistent performance. In addition, Dow silicone PSAs may be blended to modify the performance of the cured coating. Contact your Dow representative for information on blending PSAs.',
          'Dow 실리콘 PSA는 일반 테이프 코팅 설비로 공급 상태 그대로 기재에 도포할 수 있습니다. 다만 코팅 가능한 점도*를 얻기 위해 톨루엔, 자일렌 또는 기타 비극성 용제로 희석하는 경우가 대부분입니다. 일관된 성능을 위해 코트 웨이트 관리가 중요합니다. 또한 Dow 실리콘 PSA는 경화 도막의 성능을 조절하기 위해 블렌딩할 수 있습니다. 블렌딩 정보는 Dow 담당자에게 문의하십시오.'),
        note('* When diluting with any solvent, refer to the solvent vendor’s safety data sheet for information on physical and health hazards associated with the solvent and use of ventilation, PPE, bonding and grounding or other measures that can minimize or eliminate these hazards.', '* 용제로 희석할 때는 용제 공급사의 안전 보건 자료(SDS)에서 용제의 물리적·건강 유해성 정보와 환기, 보호구, 본딩·접지 등 위험을 줄이거나 없애는 조치를 확인하십시오.'),
        h('Effects of substrate variation and adhesive thickness', '기재 변화와 접착제 두께의 영향'),
        p('The backing material to which a silicone PSA is applied affects its tack and adhesion values. Adhesive thickness also affects adhesive performance: The thicker the cured adhesive coating, the higher the adhesion and tack.',
          'PSA를 도포하는 기재(backing)는 택과 접착력에 영향을 줍니다. 접착제 두께도 성능에 영향을 주어, 경화 도막이 두꺼울수록 접착력과 택이 높아집니다.')),
      sec('platinum', 'Platinum cure', '백금 경화',
        p('Platinum-cure adhesives from Dow require the addition of a platinum catalyst (SYL-OFF™ 4000 Catalyst) to develop PSA properties. The coating bath should be used within six hours of catalyst addition. These adhesives can be cured in vented, continuous coating ovens at temperatures as low as 80°C (176°F). When coated onto flexible substrates such as polyester or polyolefin films, typical oven dwell times range from 2 minutes at 100°C (212°F) to 1 minute at 125°C (257°F). If the cure rate needs to be increased to accommodate a shorter oven dwell time (to increase line speed, for example) or the process oven temperatures lowered, the catalyst level can be increased. Changing the catalyst level has little impact on the tack, adhesion or cohesive strength of the cured adhesive. Note: Because the catalyst is subject to contamination by peroxide and other materials, mixing and coating equipment must be thoroughly cleaned, and dedicated new containers should be used for mixing.',
          'Dow 백금 경화 접착제는 PSA 특성을 발현하기 위해 백금 촉매(SYL-OFF™ 4000 Catalyst)를 첨가해야 합니다. 코팅 배스는 촉매 첨가 후 6시간 이내에 사용해야 합니다. 이 접착제는 배기형 연속 코팅 오븐에서 80°C(176°F)까지 낮은 온도로 경화할 수 있습니다. 폴리에스터나 폴리올레핀 필름 같은 연성 기재에 도포하면 일반적인 오븐 체류 시간은 100°C(212°F) 2분에서 125°C(257°F) 1분 범위입니다. 라인 속도를 높이기 위해 체류 시간을 줄이거나 오븐 온도를 낮춰야 해서 경화 속도를 높여야 하면 촉매량을 늘릴 수 있습니다. 촉매량 변경은 경화 접착제의 택·접착력·응집력에 거의 영향을 주지 않습니다. 참고: 촉매는 과산화물 등에 오염될 수 있으므로 혼합·코팅 장비를 철저히 세척하고 혼합에는 전용 신규 용기를 사용해야 합니다.')),
      sec('peroxide', 'Peroxide cure', '과산화물 경화',
        p('To achieve a good balance of tack, adhesive strength and cohesive strength over a wide range of operating temperatures, proper cure is essential. The catalyst typically used with silicone PSAs is benzoyl peroxide. Peroxide concentration can be varied from 0.5 to 3.0 percent by weight (based on adhesive solids). Increasing peroxide concentration will decrease the tack and adhesive strength of the cured coating but increase its cohesive strength. The most consistent results are achieved by using powdered 98 percent benzoyl peroxide. Complete blending of peroxide and adhesive is best obtained by making a 10 percent w/v solution of the peroxide in toluene. If a catalyst is added, the coating bath should be used within a day after mixing, as the peroxide loses its activity quite rapidly in solvent. Thorough dispersion of the adhesive and peroxide during mixing is necessary to achieve uniform results in the finished product. Curing the adhesive is a two-step process that requires the use of graded temperatures.',
          '넓은 사용 온도 범위에서 택·접착 강도·응집력의 균형을 얻으려면 올바른 경화가 필수입니다. 실리콘 PSA에 일반적으로 쓰이는 촉매는 과산화벤조일입니다. 과산화물 농도는 접착제 고형분 기준 0.5~3.0 중량%로 조절할 수 있으며, 농도를 높이면 경화 도막의 택과 접착 강도는 낮아지고 응집력은 높아집니다. 가장 일관된 결과는 분말 98% 과산화벤조일로 얻어지며, 과산화물과 접착제의 완전한 혼합은 톨루엔에 과산화물 10% w/v 용액을 만들어 사용하는 것이 가장 좋습니다. 촉매를 첨가한 경우 과산화물은 용제 속에서 활성이 빠르게 감소하므로 혼합 후 하루 이내에 코팅 배스를 사용해야 합니다. 최종 제품의 균일성을 위해 혼합 시 접착제와 과산화물을 충분히 분산시켜야 합니다. 접착제 경화는 구배 온도를 사용하는 2단계 공정입니다.'),
        h('Solvent removal', '용제 제거'),
        p('The first step in curing the adhesive, following its application to the backing material, is solvent removal. Recommended temperatures for solvent removal range from 65°C to 93°C (150 to 200°F). Higher removal temperatures can cause the peroxide to decompose prematurely and crosslink the solvent into the adhesive, potentially reducing the properties of the finished tape. The length of time for solvent removal should be sufficient to ensure that no solvent is present in the adhesive when it enters the curing zone.',
          '기재에 도포한 뒤 첫 단계는 용제 제거입니다. 권장 용제 제거 온도는 65~93°C(150~200°F)입니다. 더 높은 온도에서는 과산화물이 조기 분해되어 용제가 접착제에 가교될 수 있고, 완제품 테이프의 물성이 저하될 수 있습니다. 용제 제거 시간은 경화 구역에 들어갈 때 접착제 내에 용제가 남지 않도록 충분해야 합니다.'),
        h('Heat cure', '열 경화'),
        p('After the solvent is removed, a tacky, uniform film of adhesive is left on the backing. This film’s adhesive and cohesive strengths, as well as the tack, can be further developed by a heat cure. The amount of cure depends on a number of factors, including the type of catalyst or equipment and backing material. A cure of 1 minute at 66°C (150°F) for solvent removal, followed by 2 minutes at 177 to 204°C (350 to 400°F) is typically used for adhesives that contain benzoyl peroxide. If equipment and type of backing material permit the use of higher curing temperatures, the cure time may be shortened. Higher cure temperatures develop the cohesive strength of the adhesive in less time than at lower temperatures. The ultimate adhesive strength of the fully cured material is essentially the same whether cured at higher or lower temperatures; the only difference is the time required to reach complete cure.',
          '용제가 제거되면 기재 위에 끈적하고 균일한 접착 필름이 남습니다. 이 필름의 접착 강도, 응집력, 택은 열 경화로 더 발현시킬 수 있습니다. 경화 정도는 촉매·설비·기재 종류 등 여러 요인에 따라 달라집니다. 과산화벤조일을 함유한 접착제에는 보통 66°C(150°F) 1분(용제 제거) 후 177~204°C(350~400°F) 2분 경화를 사용합니다. 설비와 기재가 더 높은 경화 온도를 허용하면 경화 시간을 단축할 수 있습니다. 높은 온도는 낮은 온도보다 짧은 시간에 응집력을 발현시키며, 완전 경화된 재료의 최종 접착 강도는 경화 온도에 관계없이 본질적으로 같고 완전 경화에 필요한 시간만 다릅니다.')),
      sec('dusting', 'Oven dusting and anchorage', '오븐 분진과 앵커리지',
        p('Oven dusting: the evaporation of volatile silicone in the curing oven can cause the formation of oven dust. The problem is typical in solvent incineration or air-recirculating direct-fired ovens and is especially prevalent in ovens that deliver too much heat too early in the cure process. Two ways to reduce the problem are to: (1) select silicone PSAs with lower volatile silicone content, such as DOWSIL™ 7406-VLO Adhesive, DOWSIL™ 7355 Adhesive or DOWSIL™ 7358 Adhesive; (2) use ramped oven zones (oven zones with temperatures that get progressively hotter).',
          '오븐 분진: 경화 오븐에서 휘발성 실리콘이 증발하면 오븐 분진이 생길 수 있습니다. 이 문제는 용제 소각식 또는 공기 순환 직화식 오븐에서 흔하며, 경화 초기에 열을 너무 빨리 많이 가하는 오븐에서 특히 심합니다. 줄이는 방법은 두 가지입니다. (1) 휘발성 실리콘 함량이 낮은 실리콘 PSA(예: DOWSIL™ 7406-VLO, 7355, 7358 Adhesive)를 선택, (2) 온도가 점진적으로 높아지는 오븐 구역(ramped zones)을 사용.'),
        p('Anchorage: when silicone PSAs are used in the manufacture of self-wound tapes or laminate constructions with backings such as polyester, Kapton, Teflon and other plastic films, the use of a primer may be required to improve anchorage of the cured adhesive to the backing. Good anchorage reduces the possibility of adhesive transfer during unwind and ensures clean slitting operations and clean removability following masking. For suggested primers and sample formulations, contact your Dow representative.',
          '앵커리지: 실리콘 PSA를 폴리에스터, Kapton, Teflon 등 플라스틱 필름 기재의 자기 권취 테이프나 라미네이트 구조에 사용할 때는 경화 접착제의 기재 밀착을 높이기 위해 프라이머가 필요할 수 있습니다. 좋은 앵커리지는 풀림(unwind) 시 접착제 전이 가능성을 줄이고 깨끗한 슬리팅과 마스킹 후 깨끗한 제거를 보장합니다. 권장 프라이머와 배합 예는 Dow 담당자에게 문의하십시오.'),
        h('Adhesion vs. tack as a function of peroxide level, cure time and cure temperature', '과산화물 농도·경화 시간·경화 온도에 따른 접착력-택'),
        ul(
          ['Cure parameter range: 1.5–3.0% benzoyl peroxide', '경화 조건 범위: 과산화벤조일 1.5~3.0%'],
          ['184–204°C cure temperature (70°C/2 min standard devolatilization temperature)', '경화 온도 184~204°C (표준 탈휘발 온도 70°C/2분)'],
          ['1.5–3 min cure time', '경화 시간 1.5~3분'],
        ),
        fig(IMG('psa2-adhesion-vs-tack'), 'Adhesion (oz/inch) vs. tack (g) for DOWSIL™ Q2-7406, 7358, 280A, Q2-7566, Q2-7735 and 7355 Adhesives over the cure parameter range above', '위 경화 조건 범위에서 DOWSIL™ Q2-7406, 7358, 280A, Q2-7566, Q2-7735, 7355 Adhesive의 접착력(oz/inch) 대 택(g)')),
    ],
    faq: [
      { q: { en: 'What is the bath life of platinum-cure silicone PSA after adding catalyst?', ko: '백금 경화 실리콘 PSA는 촉매 첨가 후 배스 수명이 얼마입니까?' }, a: { en: 'The 2024 Dow guide says to use the coating bath within six hours of catalyst addition (the 2006 guide stated 24 hours — always follow the current guide).', ko: '2024년판 Dow 가이드는 촉매 첨가 후 6시간 이내 사용을 안내합니다(2006년판은 24시간이었으므로 항상 최신 가이드를 따르십시오).' } },
      { q: { en: 'What peroxide level is used?', ko: '과산화물 농도는 얼마입니까?' }, a: { en: '0.5 to 3.0 percent by weight of adhesive solids (benzoyl peroxide); higher levels lower tack and adhesive strength and raise cohesive strength.', ko: '접착제 고형분 기준 0.5~3.0 중량%(과산화벤조일)이며 높을수록 택·접착 강도는 낮아지고 응집력은 높아집니다.' } },
      baseFaq,
    ],
  },

  {
    slug: 'guide-2006-vs-2024-changes', no: 8, pdfPages: '—', doc: '2006 ↔ 2024',
    title: { en: 'What Changed: 2006 Dow Corning PSA Guide vs. 2024 Dow Silicone PSA Guide', ko: '무엇이 바뀌었나: 2006 Dow Corning PSA 가이드 vs 2024 Dow 실리콘 PSA 가이드' },
    summary: { en: 'Side-by-side comparison of the two Dow guides hosted here: product range, naming, platinum bath life, high-temperature hold values and new auxiliary materials.', ko: '이 사이트에 수록된 Dow 가이드 두 종을 비교: 제품 범위, 명칭, 백금 배스 수명, 고온 유지력 수치, 신규 보조 소재.' },
    answer: {
      en: 'The 2024 guide (Form No. 30-1315-01-0524) lists 41 PSAs, mica binders and solventless adhesives plus primer, crosslinkers, anchorage additives and six fluorosilicone release coatings, under the DOWSIL™ / SYL-OFF™ names. Key differences from the 2006 Dow Corning guide (Form No. 30-083B-01): platinum bath life six hours instead of 24, DOWSIL™ 7657 hold 260 °C instead of 204 °C and Q2-7406 260 °C instead of 288 °C, and a new blending graph.',
      ko: '2024년판 가이드(Form No. 30-1315-01-0524)는 DOWSIL™·SYL-OFF™ 명칭으로 PSA·마이카 바인더·무용제 점착제 41종과 프라이머, 가교제, 앵커리지 첨가제, 불소실리콘 이형 코팅제 6종을 수록합니다. 2006년판 Dow Corning 가이드(Form No. 30-083B-01)와의 주요 차이: 백금 배스 수명 24시간 → 6시간, DOWSIL™ 7657 유지력 204 °C → 260 °C, Q2-7406 288 °C → 260 °C, 블렌딩 그래프 신규 수록.',
    },
    image: IMG('psa2-cover'),
    sections: [
      sec('compare', 'Comparison', '비교표',
        { k: 'tbl', head: [bi('Item', '항목'), bi('2006 Dow Corning guide (30-083B-01)', '2006년판 Dow Corning (30-083B-01)'), bi('2024 Dow guide (30-1315-01-0524)', '2024년판 Dow (30-1315-01-0524)')], rows: [
          [bi('Brand name', '브랜드명'), 'Dow Corning® 2013, 7657, 280A …', 'DOWSIL™ 2013, 7657, 280A …; SYL-OFF™'],
          [bi('Products covered', '수록 제품'), bi('11 PSAs (3 platinum, 8 peroxide) + Syl-Off Q2-7785', 'PSA 11종(백금 3, 과산화물 8) + Syl-Off Q2-7785'), bi('41 PSAs, mica binders and solventless adhesives + primer, crosslinkers, anchorage additives, six fluorosilicone release coatings', 'PSA·마이카 바인더·무용제 점착제 41종 + 프라이머·가교제·앵커리지 첨가제·불소실리콘 이형 코팅제 6종')],
          [bi('Platinum-cure bath life', '백금 경화 배스 수명'), bi('Within 24 hours of catalyst addition (Table 1: generally 24 hours or less at 21°C)', '촉매 첨가 후 24시간 이내(표 1: 21°C에서 일반적으로 24시간 이하)'), bi('Within six hours of catalyst addition', '촉매 첨가 후 6시간 이내')],
          [bi('DOWSIL™ 7657 high-temperature hold', 'DOWSIL™ 7657 고온 유지력'), '204 °C (400 °F)', '260 °C (500 °F)'],
          [bi('DOWSIL™ Q2-7406 high-temperature hold', 'DOWSIL™ Q2-7406 고온 유지력'), '288 °C (550 °F)', '260 °C (500 °F)'],
          [bi('Peroxide concentration wording', '과산화물 농도 표기'), bi('0.5–3.0 percent (based on adhesive solids)', '0.5~3.0%(접착제 고형분 기준)'), bi('0.5–3.0 percent by weight (based on adhesive solids); 10 percent w/v solution in toluene', '0.5~3.0 중량%(접착제 고형분 기준), 톨루엔 10% w/v 용액')],
          [bi('Blending', '블렌딩'), bi('Peroxide-cure PSAs may be blended with other dimethyl-type PSAs', '과산화물 경화 PSA를 다른 디메틸형 PSA와 블렌딩 가능'), bi('Dow silicone PSAs may be blended; platinum-cure PSAs blended for adhesion levels (graph)', 'Dow 실리콘 PSA 블렌딩 가능, 백금 경화 PSA 블렌딩으로 접착력 수준 조절(그래프)')],
          [bi('Oven-dusting examples', '오븐 분진 저감 예시'), 'DOWSIL 7355 / 7358', 'DOWSIL™ 7406-VLO / 7355 / 7358'],
          [bi('Silane coupling agent (Z-6020) for anchorage', '앵커리지용 실란 커플링제(Z-6020)'), bi('Described: 0.25–0.5% if a primer cannot be applied', '기재: 프라이머를 쓸 수 없을 때 0.25~0.5% 첨가'), bi('Not described; primer DOWSIL™ 7499 and anchorage additives listed instead', '언급 없음, 대신 DOWSIL™ 7499 프라이머와 앵커리지 첨가제 수록')],
        ],
          note: { en: 'Differences are taken only from the two documents. Test conditions may differ between editions; always check the current Dow data sheet. Dow Corning products are now marketed under the DOWSIL™ brand.', ko: '차이는 두 문서의 기재 내용만 근거로 정리했으며, 판본에 따라 시험 조건이 다를 수 있으므로 항상 최신 Dow 데이터시트를 확인하십시오. Dow Corning 제품은 현재 DOWSIL™ 브랜드로 판매됩니다.' } }),
    ],
    faq: [
      { q: { en: 'Which guide should I follow?', ko: '어느 가이드를 따라야 합니까?' }, a: { en: 'Use the 2024 guide as the primary reference and confirm any value with the current Dow technical data sheet or with KCT. The 2006 guide is kept for reference.', ko: '2024년판을 기본 참고 자료로 삼고, 수치는 최신 Dow 기술 데이터시트나 한국건설트레이딩에 확인하십시오. 2006년판은 참고용으로 보존합니다.' } },
      baseFaq,
    ],
  },

  {
    slug: 'more-options-and-dow-support', no: 9, pdfPages: '12', doc: DOC,
    title: { en: 'More Options for Your Business, Global Support and Safety Notice', ko: '비즈니스를 위한 추가 선택지, 글로벌 지원, 안전 안내' },
    summary: { en: 'Auxiliary materials, custom formulation and application support from Dow, global presence, product safety information and the notice that applies to all values in the guide.', ko: '보조 소재, Dow의 맞춤 배합·응용 지원, 글로벌 네트워크, 제품 안전 정보, 가이드의 모든 수치에 적용되는 고지 사항.' },
    answer: {
      en: 'Dow formulates adhesives to customers’ specific needs; its application experts help with recommendations and problem resolution, and its engineering experts can provide specific quality testing and data. Product safety information is not included in the guide: read the product and safety data sheets and container labels before handling. Korea Construction Trading relays these resources and supports customers in Korea.',
      ko: 'Dow의 개발팀은 고객의 구체적 요구에 맞춰 점착제를 배합하고, 응용 전문가가 추천과 문제 해결을 돕고, 엔지니어링 전문가가 특정 품질 시험과 데이터를 제공할 수 있습니다. 안전 정보는 이 가이드에 포함되어 있지 않으므로 취급 전에 제품 및 안전 보건 자료(SDS), 용기 라벨을 읽어야 합니다. 한국건설트레이딩은 국내 고객을 위해 이 자원을 연결하고 지원합니다.',
    },
    image: IMG('psa2-cover'),
    sections: [
      sec('more', 'More options for your business', '비즈니스를 위한 추가 선택지',
        p('Our product line also includes auxiliary materials like crosslinkers, anchorage additives and compatible silicone primers that help increase adhesives’ curing and offer good anchorage to difficult substrates. To help you make better products—and get them to market faster—our development team formulates adhesives according to your specific needs, and our application experts help with recommendations and problem resolution. And in sensitive applications, our engineering experts are able to provide specific quality testing and data as well as test development and alignment to ensure success. Give us your challenge, and we’ll find a solution!',
          'Dow의 제품군에는 가교제, 앵커리지 첨가제, 호환 실리콘 프라이머 같은 보조 소재도 있어 점착제의 경화를 높이고 접착이 어려운 기재에서 우수한 앵커리지를 제공합니다. 더 좋은 제품을 더 빨리 시장에 내놓을 수 있도록, 개발팀이 고객의 구체적 요구에 맞춰 점착제를 배합하고 응용 전문가가 추천과 문제 해결을 돕습니다. 민감한 용도에서는 엔지니어링 전문가가 특정 품질 시험과 데이터, 시험 개발과 정합을 제공해 성공을 뒷받침할 수 있습니다. 과제를 알려 주시면 해법을 찾겠습니다.')),
      sec('global', 'Global. Local. Ready to help.', '글로벌. 로컬. 지원 준비 완료.',
        p('Dow has sales offices, manufacturing sites and science and technology laboratories around the globe. For product data sheets, selection guides and an overview of Dow’s comprehensive line of products and services for the pressure sensitive industry, visit www.dow.com.',
          'Dow는 전 세계에 영업소, 생산 거점, 과학·기술 연구소를 두고 있습니다. 제품 데이터시트, 선택 가이드, 감압 점착제 산업을 위한 Dow의 종합 제품·서비스 개요는 www.dow.com에서 확인하십시오.'),
        note('PRODUCT SAFETY INFORMATION REQUIRED FOR SAFE USE IS NOT INCLUDED IN THIS DOCUMENT. BEFORE HANDLING, READ PRODUCT AND SAFETY DATA SHEETS AND CONTAINER LABELS FOR SAFE USE, PHYSICAL AND HEALTH HAZARD INFORMATION. THE SAFETY DATA SHEET IS AVAILABLE ON THE DOW WEBSITE AT WWW.DOW.COM, OR FROM YOUR DOW SALES APPLICATION ENGINEER, OR DISTRIBUTOR, OR BY CALLING DOW CUSTOMER SERVICE.',
          '안전한 사용에 필요한 제품 안전 정보는 이 문서에 포함되어 있지 않습니다. 취급 전에 제품 및 안전 보건 자료(SDS)와 용기 라벨에서 안전 사용, 물리적·건강 유해성 정보를 읽으십시오. SDS는 Dow 웹사이트(www.dow.com), Dow 영업·응용 엔지니어, 유통사 또는 Dow 고객 서비스에서 구할 수 있습니다.')),
      sec('notice', 'Notice', '고지 사항',
        p('NOTICE: No freedom from infringement of any patent owned by Dow or others is to be inferred. Because use conditions and applicable laws may differ from one location to another and may change with time, Customer is responsible for determining whether products and the information in this document are appropriate for Customer’s use and for ensuring that Customer’s workplace and disposal practices are in compliance with applicable laws and other government enactments. The product shown in this literature may not be available for sale and/or available in all geographies where Dow is represented. The claims made may not have been approved for use in all countries. Dow assumes no obligation or liability for the information in this document. References to “Dow” or the “Company” mean the Dow legal entity selling the products to Customer unless otherwise expressly noted. NO WARRANTIES ARE GIVEN; ALL IMPLIED WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE ARE EXPRESSLY EXCLUDED.',
          '고지: Dow 또는 타사가 소유한 특허의 침해로부터의 자유를 의미하는 것으로 해석해서는 안 됩니다. 사용 조건과 관련 법규는 지역에 따라 다르고 시간이 지나며 바뀔 수 있으므로, 제품과 이 문서의 정보가 고객의 사용에 적합한지 판단하고 작업장·폐기 방식이 관련 법규를 준수하는지 확인할 책임은 고객에게 있습니다. 이 자료에 나온 제품은 Dow가 진출한 모든 지역에서 판매·공급되지 않을 수 있으며, 표시된 주장이 모든 국가에서 사용 승인을 받은 것은 아닐 수 있습니다. Dow는 이 문서의 정보에 대해 어떠한 의무나 책임도 지지 않습니다. 「Dow」 또는 「회사」는 달리 명시하지 않는 한 고객에게 제품을 판매하는 Dow 법인을 뜻합니다. 어떠한 보증도 제공되지 않으며 상품성 또는 특정 목적 적합성에 대한 모든 묵시적 보증은 명시적으로 배제됩니다.'),
        note('®™ Trademark of The Dow Chemical Company (“Dow”) or an affiliated company of Dow. © 2024 The Dow Chemical Company. All rights reserved. Form No. 30-1315-01-0524 S2D.', '®™ The Dow Chemical Company(「Dow」) 또는 Dow 계열사의 상표. © 2024 The Dow Chemical Company. All rights reserved. Form No. 30-1315-01-0524 S2D.')),
    ],
    faq: [
      { q: { en: 'Where do I find safety information for these products?', ko: '이 제품들의 안전 정보는 어디에서 확인합니까?' }, a: { en: 'In the product Safety Data Sheet (SDS) and container label; the guide itself does not include safety information.', ko: '제품 안전 보건 자료(SDS)와 용기 라벨에서 확인합니다. 이 가이드 자체에는 안전 정보가 없습니다.' } },
      baseFaq,
    ],
  },
]
