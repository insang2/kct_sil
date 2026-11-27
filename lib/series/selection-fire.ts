import { p, ul, note, sec, IMG } from '@/lib/tech-manual/types'
import type { Cell } from '@/lib/tech-manual/types'
import type { IPage } from '@/lib/industrial/pages'
import { bySlug } from '@/lib/products-catalog'
import { productCode } from '@/lib/product-seo'

// WD 담당: 보증·내화 규격·브랜드 전환 가이드. 번호(no)는 selection.ts 가 자동 부여.
const SUP = {
  q: { en: 'Who can support this at KCT?', ko: '한국건설트레이딩에서 지원받을 수 있습니까?' },
  a: {
    en: 'Korea Construction Trading (KCT) supports DOWSIL product selection and documentation requests: sales@kconstrade.com, +82 10-8939-0284. Final requirements are confirmed with Dow and the authority having jurisdiction.',
    ko: '한국건설트레이딩(KCT)이 DOWSIL 제품 선정과 자료 요청을 지원합니다(sales@kconstrade.com, 010-8939-0284). 최종 요건은 Dow 및 관할 기관과 확인해야 합니다.',
  },
}
const CONFIRM = { en: 'Confirm', ko: '문의 필요' }

// 구 Dow Corning 표기가 쓰였던 제품 (lib/product-seo.ts 의 LEGACY_DC 와 동일 목록)
const LEGACY = [
  'dowsil-789', 'dowsil-791', 'dowsil-795', 'dowsil-995', 'dowsil-121', 'dowsil-977', 'dowsil-991', 'dowsil-993', 'dowsil-983', 'dowsil-982',
  'dowsil-939', 'dowsil-335', 'dowsil-888', 'dowsil-890-sl', 'dowsil-902-rcs', 'dowsil-123', 'dowsil-786-plus', 'dowsil-firestop-700',
  'dowsil-allguard', 'dowsil-primer-c', 'dowsil-allguard-primer', 'dowsil-1200-os',
].filter((s) => bySlug(s))

const legacyRows: Cell[][] = LEGACY.map((s) => {
  const code = productCode(s)
  return [`Dow Corning ${code} / DC ${code}`, bySlug(s)!.name, `/products/${s}`]
})

export const PAGES: IPage[] = [
  {
    slug: 'dow-warranty-guide', no: 0, pdfPages: '—', doc: 'Dow 공식 자료',
    title: { en: 'Dow Sealant Warranty Guide: Structural Adhesion and Weatherseal Warranty Process', ko: 'Dow 실란트 보증 가이드: 구조 접착·웨더실 보증 절차' },
    summary: { en: 'What Dow states about DOWSIL structural glazing warranties, the project-specific testing and review that precede them, and what to prepare before you ask.', ko: 'Dow가 밝힌 DOWSIL 구조 글레이징 보증, 보증에 앞서는 프로젝트별 시험·검토, 신청 전 준비 사항.' },
    answer: {
      en: 'Dow publicly lists an “up to 20-year structural adhesion limited warranty” for DOWSIL structural glazing, and states that warranty options vary by region. Warranty is project-specific: it follows project testing and design review by Dow, not the purchase of the sealant alone. Exact terms, covered products and conditions are confirmed with Dow through KCT.',
      ko: 'Dow는 DOWSIL 구조 글레이징에 대해 “최대 20년 구조 접착 제한 보증(structural adhesion limited warranty)”을 공개하고 있으며, 보증 옵션은 지역마다 다르다고 밝히고 있습니다. 보증은 실란트 구매만으로 주어지지 않고 Dow의 프로젝트별 시험·설계 검토를 전제로 합니다. 정확한 조건·대상 제품·기간은 KCT를 통해 Dow에 확인합니다.',
    },
    image: IMG('cover'),
    sections: [
      sec('types', 'Warranty types Dow states', 'Dow가 밝힌 보증 유형',
        ul(
          ['Structural adhesion limited warranty: “up to 20-year”, for structural glazing systems (Dow structural glazing page).', '구조 접착 제한 보증: “최대 20년”, 구조 글레이징 시스템 대상(Dow 구조 글레이징 페이지).'],
          ['Dow states that warranty options vary by region and tells customers to contact Dow for specific warranty information.', 'Dow는 보증 옵션이 지역별로 다르며 구체적 내용은 Dow에 문의하도록 안내합니다.'],
          ['Weatherseal warranty term, covered products and exclusions: not confirmed in the sources we checked — ask.', '웨더실 보증의 기간·대상 제품·제외 사유: 확인한 자료에 명시되지 않아 문의 사항입니다.'],
        ),
        note('Do not assume a warranty period for a project until Dow confirms it in writing for that project and region.', '프로젝트·지역별로 Dow가 서면 확인하기 전에는 보증 기간을 가정하지 마십시오.')),
      sec('process', 'Typical process', '진행 절차(일반적 흐름)',
        p('Dow states that structural glazing risk is mitigated by “project-specific testing for both two- and four-sided structural glazing systems”, and offers technical manuals and a submittal tool for documents. In practice, the steps below are what to prepare; the exact sequence and sample requirements are given by Dow per project.',
          'Dow는 2변·4변 구조 글레이징 시스템 모두에 대해 “프로젝트별 시험”으로 위험을 낮춘다고 밝히며, 기술 매뉴얼과 제출 서류 도구를 제공합니다. 아래는 실무에서 준비할 항목이며, 정확한 순서와 시료 요건은 프로젝트별로 Dow가 안내합니다.'),
        ul(
          ['1. Share drawings: joint/glazing details, glass/metal/gasket/spacer materials, loads and wind data.', '1. 도면 제출: 조인트·글레이징 상세, 유리·금속·가스켓·스페이서 자재, 하중·풍압 자료.'],
          ['2. Design review by Dow technical staff (required for structural glazing).', '2. Dow 기술진의 설계 검토(구조 글레이징은 필수).'],
          ['3. Adhesion and compatibility testing with project substrates and components; sample quantities and time are specified by Dow.', '3. 프로젝트 기재·부자재로 접착·상용성 시험. 시료 수량과 소요 시간은 Dow가 안내.'],
          ['4. Dow issues test results and, if conditions are met, the warranty decision. Terms: confirm.', '4. Dow가 시험 결과와 보증 여부를 통보(조건 충족 시). 세부 조건은 문의.'],
          ['5. Apply per approved details with quality control records (see the structural sealant selection guide).', '5. 승인된 상세대로 시공하고 품질관리 기록을 남깁니다(구조 실란트 선택 가이드 참조).'],
        )),
      sec('docs', 'Documents to prepare', '준비 서류',
        ul(
          ['Project name, location, facade type and glazing drawings', '프로젝트명·위치·외장 유형·글레이징 도면'],
          ['Substrate list: glass, coatings, aluminum finish, gaskets, spacers, setting blocks', '기재 목록: 유리·코팅·알루미늄 마감·가스켓·스페이서·세팅블록'],
          ['Product and quantity plan (structural vs. weatherseal duty)', '사용 제품·수량 계획(구조용/웨더실 구분)'],
          ['Applicator and quality-control plan', '시공사·품질관리 계획'],
        ),
        note('Which items Dow requires for a given warranty is decided by Dow. Ask KCT for the current requirement list.', '보증별 필수 서류는 Dow가 정합니다. 최신 요건 목록은 KCT에 문의하십시오.')),
      sec('exclusions', 'Why a warranty may not be granted', '보증이 제한될 수 있는 경우',
        p('Limited warranties generally depend on conditions. Typical reasons a warranty request is not accepted include untested or incompatible substrates, unreviewed design details, products used outside their stated application, or application outside the approved conditions. Dow’s own exclusion list was not available in the sources we checked, so confirm it before bidding.',
          '제한 보증은 일반적으로 조건에 좌우됩니다. 미시험·비상용 기재, 검토받지 않은 설계 상세, 명시된 용도를 벗어난 사용, 승인 조건을 벗어난 시공이 대표적 제한 사유입니다. Dow의 제외 사유 원문은 확인한 자료에서 찾지 못했으므로 입찰 전에 확인하십시오.')),
      sec('refs', 'References', '참고',
        ul(
          ['Dow: DOWSIL structural glazing (warranty and project-specific testing statements) — dow.com/en-us/market/mkt-building-construction/sub-build-commercial-glazing/app-build-comglaz-structural-glazing.html', 'Dow: DOWSIL 구조 글레이징 페이지(보증·프로젝트별 시험 문구) — dow.com/en-us/market/mkt-building-construction/sub-build-commercial-glazing/app-build-comglaz-structural-glazing.html'],
          ['Standards named on that page: ETAG 002, GB 16776, ASTM C1184', '해당 페이지가 언급한 규격: ETAG 002, GB 16776, ASTM C1184'],
          ['Products: https://kconstrade.com/en/products/dowsil-995, dowsil-795, dowsil-983, dowsil-121', '제품: https://kconstrade.com/ko/products/dowsil-995, dowsil-795, dowsil-983, dowsil-121'],
        )),
    ],
    faq: [
      { q: { en: 'How long is the DOWSIL structural glazing warranty?', ko: 'DOWSIL 구조 글레이징 보증 기간은 얼마입니까?' }, a: { en: 'Dow publishes “up to 20-year structural adhesion limited warranty”, and says options vary by region. The period for your project is confirmed by Dow.', ko: 'Dow는 “최대 20년 구조 접착 제한 보증”을 공개하며 보증 옵션은 지역별로 다르다고 밝힙니다. 프로젝트별 기간은 Dow가 확인합니다.' } },
      { q: { en: 'Is the warranty included when I buy the sealant?', ko: '실란트를 사면 보증이 자동으로 따라옵니까?' }, a: { en: 'No. Dow ties structural glazing risk mitigation to project-specific testing and review, so request the warranty before construction.', ko: '아닙니다. Dow는 구조 글레이징 위험 관리를 프로젝트별 시험·검토와 연결하므로 시공 전에 보증을 요청해야 합니다.' } },
      { q: { en: 'What testing comes before a warranty?', ko: '보증 전에 어떤 시험을 합니까?' }, a: { en: 'Project-specific testing with your substrates, typically adhesion and compatibility. Sample quantities and duration are set by Dow.', ko: '실제 기재로 하는 프로젝트별 시험이며 일반적으로 접착·상용성 시험입니다. 시료 수량과 기간은 Dow가 정합니다.' } },
      { q: { en: 'Does a weatherseal also get a warranty?', ko: '웨더실링에도 보증이 가능합니까?' }, a: { en: 'We could not confirm the weatherseal warranty terms in public Dow sources; ask KCT to check with Dow for your project.', ko: '공개된 Dow 자료에서 웨더실 보증 조건을 확인하지 못했습니다. 프로젝트별로 KCT를 통해 Dow에 확인하십시오.' } },
      SUP,
    ],
  },

  {
    slug: 'astm-e119-vs-en-1366-firestop', no: 0, pdfPages: '—', doc: '규격 요약',
    title: { en: 'Firestop Standards Compared: ASTM E119, E814/UL 1479, E1966 vs. EN 1366-3/-4', ko: '내화충전 규격 비교: ASTM E119·E814·E1966 vs EN 1366' },
    summary: { en: 'How North American and European fire-resistance tests for penetration seals and linear joints relate, and what E, I, F and T ratings mean.', ko: '관통부·선형 줄눈 내화 시험의 북미·유럽 규격 대응과 E·I, F·T 등급 개념.' },
    answer: {
      en: 'EN 1366-3 (penetration seals) and EN 1366-4 (linear joint seals) are classified under EN 13501-2 as E (integrity) and I (insulation) in minutes. In North America, penetration seals are tested to ASTM E814 / UL 1479 (F and T ratings) and linear joints to ASTM E1966 / UL 2079. ASTM E119 is the general fire test for building construction. The ratings are not interchangeable; use the standard your project or authority requires.',
      ko: '관통부는 EN 1366-3, 선형 줄눈은 EN 1366-4로 시험하고 EN 13501-2에 따라 차염성 E·차열성 I를 분 단위로 분류합니다. 북미는 관통부 ASTM E814 / UL 1479(F·T 등급), 선형 줄눈 ASTM E1966 / UL 2079를 사용하며, ASTM E119는 건축 구조 일반 내화 시험입니다. 등급은 서로 호환되지 않으므로 프로젝트와 관할 기관이 요구하는 규격을 따라야 합니다.',
    },
    image: IMG('fig02-fire-resistance'),
    sections: [
      sec('table', 'Standards at a glance', '규격 한눈에 보기',
        {
          k: 'tbl', big: true,
          title: { en: 'Fire-resistance test standards (from the Dow fire-rated manual and general knowledge)', ko: '내화 시험 규격(Dow 내화 매뉴얼 및 일반 규격 정보)' },
          head: [['Application', '적용'], ['Europe', '유럽'], ['North America', '북미'], ['Rating', '등급']],
          rows: [
            [['Penetration seals', '관통부 실링'], 'EN 1366-3 / EN 13501-2', 'ASTM E814 · UL 1479', ['E, I (min) / F, T (hours)', 'E·I(분) / F·T(시간)']],
            [['Linear joints', '선형 줄눈'], 'EN 1366-4 / EN 13501-2', 'ASTM E1966 · UL 2079', ['E, I (min) / hours', 'E·I(분) / 시간']],
            [['Wall/floor elements in general', '벽·바닥 일반'], 'EN 1364 / EN 1365 / EN 13501-2', 'ASTM E119', ['Minutes / hours', '분 / 시간']],
            [['Curtain wall, perimeter joint', '커튼월 외주부'], 'EN 1364-4 (curtain walling)', 'ASTM E2307 (perimeter fire barrier)', CONFIRM_CELL()],
            [['Korea: fire-stop structure', '국내 내화충전구조'], CONFIRM_CELL(), CONFIRM_CELL(), CONFIRM_CELL()],
          ],
          note: { en: 'EN 1366-3/-4, EN 13501-2, UL 1479, ASTM E814, UL 2079 and ASTM E1966 are cited in the Dow fire-rated manual. EN 1364-4, ASTM E119 and ASTM E2307 are listed from general standard titles. Korean system details: confirm with the authority.', ko: 'EN 1366-3/-4, EN 13501-2, UL 1479, ASTM E814, UL 2079, ASTM E1966은 Dow 내화 매뉴얼에서 인용했습니다. EN 1364-4, ASTM E119, ASTM E2307은 규격 일반 명칭 기준입니다. 국내 체계의 세부는 관할 기관에 확인하십시오.' },
        }),
      sec('concepts', 'E, I and F, T ratings', 'E·I와 F·T 등급 개념',
        ul(
          ['E (integrity): prevents passage of flames and hot gases; failure includes sustained flaming over 10 s or gap gauge penetration (6 mm / 25 mm gauges).', 'E(차염성): 화염·고온 가스 차단. 10초 초과 지속 화염, 6mm·25mm 게이지 관통 등이 상실 기준.'],
          ['I (insulation): mean unexposed face temperature rise limited to 140 °C, any point 180 °C above initial.', 'I(차열성): 비가열면 평균 온도 상승 140℃, 임의 지점 초기 대비 180℃ 이내.'],
          ['F and T ratings (ASTM E814 / UL 1479): F relates to flame passage, T adds the temperature criterion on the unexposed side. Numeric criteria: confirm in the standard.', 'F·T 등급(ASTM E814 / UL 1479): F는 화염 통과, T는 비가열면 온도 기준을 더한 것입니다. 수치 기준은 규격 원문에서 확인하십시오.'],
        ),
        note('E and I criteria above are quoted from the Dow manual (see /technical/fire-resistance).', '위 E·I 기준은 Dow 매뉴얼(/technical/fire-resistance)에서 인용했습니다.')),
      sec('korea', 'Korean approval system', '국내 내화충전구조 인정',
        p('Korea has its own approval route for fire-stop structures. The applicable test standard, approval body, validity period and how foreign test reports are accepted were not verified here, so they are marked “confirm”. Ask KCT to check the current Dow reports and your project’s requirement.',
          '국내에는 별도의 내화충전구조 인정 체계가 있습니다. 적용 시험 규격, 인정 기관, 유효기간, 해외 시험성적서 인정 여부는 여기서 검증하지 못해 「확인 필요」로 표시했습니다. 최신 Dow 시험 성적서와 프로젝트 요건은 KCT에 문의하십시오.')),
      sec('refs', 'References', '참고',
        ul(
          ['Dow Fire-Rated Technologies Technical Manual (Form No. 62-2233-01-0325): /technical/fire-resistance, /technical/penetration-seals', 'Dow 내화 기술 매뉴얼(Form No. 62-2233-01-0325): /technical/fire-resistance, /technical/penetration-seals'],
          ['Product: https://kconstrade.com/en/products/dowsil-firestop-700', '제품: https://kconstrade.com/ko/products/dowsil-firestop-700'],
        )),
    ],
    faq: [
      { q: { en: 'Is ASTM E814 the same as EN 1366-3?', ko: 'ASTM E814와 EN 1366-3은 같은 시험입니까?' }, a: { en: 'Both test penetration seals, but test method, exposure and rating system differ (F/T vs. E/I), so results are not directly interchangeable.', ko: '둘 다 관통부 실링 시험이지만 시험 방법·가열 조건·등급 체계(F·T 대 E·I)가 달라 결과를 그대로 호환할 수 없습니다.' } },
      { q: { en: 'Which standard covers linear joints?', ko: '선형 줄눈은 어떤 규격입니까?' }, a: { en: 'EN 1366-4 in Europe; UL 2079 and ASTM E1966 in North America (per the Dow manual).', ko: '유럽은 EN 1366-4, 북미는 UL 2079와 ASTM E1966입니다(Dow 매뉴얼 기준).' } },
      { q: { en: 'What do E and I mean?', ko: 'E와 I는 무엇입니까?' }, a: { en: 'E = integrity (flames and hot gases blocked), I = insulation (unexposed side temperature limited); each expressed in minutes.', ko: 'E는 차염성(화염·고온 가스 차단), I는 차열성(비가열면 온도 제한)이며 각각 분 단위로 표시합니다.' } },
      { q: { en: 'Is EN 1366 accepted in Korea?', ko: 'EN 1366 성적서가 국내에서 인정됩니까?' }, a: { en: 'We could not verify this; acceptance depends on the Korean approval system and the authority. Ask KCT.', ko: '확인하지 못했습니다. 국내 인정 체계와 관할 기관에 따라 다르므로 KCT에 문의하십시오.' } },
      SUP,
    ],
  },

  {
    slug: 'dow-corning-to-dowsil', no: 0, pdfPages: '—', doc: 'Dow 공식 발표',
    title: { en: 'Dow Corning to DOWSIL: Old Product Name to Current Name Cross-Reference', ko: 'Dow Corning → DOWSIL 구 품명·현행 품명 대조표' },
    summary: { en: 'Cross-reference of legacy Dow Corning / DC product names to the current DOWSIL names, with product pages and the background of the brand change.', ko: '구 Dow Corning·DC 품명과 현행 DOWSIL 품명 대조표, 제품 링크, 브랜드 전환 배경.' },
    answer: {
      en: 'DOWSIL is the product brand Dow Performance Silicones introduced for heritage Dow Corning building silicones; Dow Corning-branded building products moved to the DOWSIL name in a phased roll-out. The product descriptors stay the same and Dow stated customers can rely on the same silicone chemistries, features and benefits. For example, Dow Corning 795 is now DOWSIL™ 795.',
      ko: 'DOWSIL은 Dow Performance Silicones가 기존 Dow Corning 건축용 실리콘 제품을 위해 도입한 제품 브랜드로, Dow Corning 브랜드의 건축 제품이 단계적으로 DOWSIL 명칭으로 전환되었습니다. Dow는 제품 설명명(descriptor)이 유지되고 동일한 실리콘 화학·특성·이점을 믿고 쓸 수 있다고 밝혔습니다. 예: Dow Corning 795는 현재 DOWSIL™ 795입니다.',
    },
    image: IMG('cover'),
    sections: [
      sec('background', 'Background of the change', '브랜드 전환 배경',
        p('According to the Dow announcement, Dow Performance Silicones (a global business unit of the DowDuPont Materials Science division) introduced DOWSIL as the name for heritage Dow Corning high-performance silicone building products. Dow Corning-branded building and construction silicones, including structural glazing and weatherproofing sealants, were to move to the DOWSIL name through a phased implementation over the following year, and products are sold by Dow.',
          'Dow 발표에 따르면 Dow Performance Silicones(DowDuPont Materials Science 부문의 글로벌 사업 단위)는 기존 Dow Corning 고성능 실리콘 건축 제품의 이름으로 DOWSIL을 도입했습니다. 구조 글레이징·웨더프루핑 실란트를 포함한 Dow Corning 브랜드 건축용 실리콘은 이후 1년에 걸쳐 단계적으로 DOWSIL 명칭으로 전환되었으며, 제품은 Dow가 판매합니다.'),
        note('Announcement date and exact per-product schedule were not stated on the page we read. Model numbers: Dow said product descriptors remain the same; verify the exact catalog number with the current TDS.', '읽은 페이지에는 발표 일자와 제품별 전환 일정이 없습니다. Dow는 제품 설명명이 유지된다고 했으며, 정확한 품번은 현행 TDS에서 확인하십시오.')),
      sec('table', 'Cross-reference table', '구 품명 ↔ 현행 품명 대조표',
        { k: 'tbl', big: true, title: { en: 'Legacy name to current DOWSIL name', ko: '구 품명 → 현행 DOWSIL 품명' }, head: [['Legacy name', '구 품명'], ['Current name', '현행 품명'], ['KCT page', 'KCT 제품 경로']], rows: legacyRows,
          note: { en: 'Legacy names reflect trade usage and search terms; a few may differ from the exact historical designation. Confirm with the TDS before specifying.', ko: '구 품명은 거래·검색 관행상의 표기이며 일부는 당시 정확한 명칭과 다를 수 있습니다. 시방 전 TDS로 확인하십시오.' } },),
      sec('refs', 'References', '참고',
        ul(
          ['Dow announcement: “DOWSIL™ Product Brand Name Announced for Heritage Dow Corning High-Performance Silicone Building Products” (reproduced at worldconstructionnetwork.com)', 'Dow 발표: “DOWSIL™ Product Brand Name Announced for Heritage Dow Corning High-Performance Silicone Building Products”(worldconstructionnetwork.com 전재)'],
        )),
    ],
    faq: [
      { q: { en: 'Is DOWSIL the same product as Dow Corning?', ko: 'DOWSIL은 Dow Corning 제품과 같은 제품입니까?' }, a: { en: 'Dow said customers can continue to rely on the same silicone chemistries, features and benefits under the new name. Check the current TDS for each product.', ko: 'Dow는 새 이름에서도 동일한 실리콘 화학·특성·이점을 기대할 수 있다고 밝혔습니다. 제품별 최신 TDS를 확인하십시오.' } },
      { q: { en: 'Did product numbers change?', ko: '제품 번호가 바뀌었습니까?' }, a: { en: 'Dow stated product descriptors remain the same; numbers were carried over in the products listed here (e.g. 795, 995). Verify any specific item.', ko: 'Dow는 제품 설명명이 유지된다고 밝혔고, 이 표의 제품(795·995 등)은 번호가 이어집니다. 개별 품목은 확인하십시오.' } },
      { q: { en: 'Can I use old specifications naming Dow Corning?', ko: 'Dow Corning으로 적힌 기존 시방서를 그대로 쓸 수 있습니까?' }, a: { en: 'Map the name using the table, then confirm with the current TDS and your engineer. KCT can help.', ko: '대조표로 현행 명칭을 매핑한 뒤 최신 TDS와 담당 엔지니어와 확인하십시오. KCT가 지원합니다.' } },
      { q: { en: 'Who sells DOWSIL now?', ko: '현재 DOWSIL은 누가 판매합니까?' }, a: { en: 'Dow stated products are sold by Dow. In Korea, contact KCT for supply and support.', ko: 'Dow는 제품을 Dow가 판매한다고 밝혔습니다. 국내 공급·지원은 KCT에 문의하십시오.' } },
      SUP,
    ],
  },
]

function CONFIRM_CELL(): Cell { return [CONFIRM.en, CONFIRM.ko] }

export const META: Record<string, { title: { ko: string; en: string }; description: { ko: string; en: string } }> = {
  'selection/dow-warranty-guide': {
    title: { ko: 'Dow 실란트 보증 가이드: 구조 접착 보증 절차 | KCT', en: 'Dow Sealant Warranty Guide: Structural Adhesion | KCT' },
    description: {
      ko: 'DOWSIL 구조 글레이징 최대 20년 구조 접착 제한 보증, 프로젝트별 시험·설계 검토 절차, 준비 서류와 제한 사유를 KCT가 정리했습니다.',
      en: 'DOWSIL structural glazing warranty (up to 20-year limited), project testing and design review steps, documents to prepare and limits. KCT support in Korea.',
    },
  },
  'selection/astm-e119-vs-en-1366-firestop': {
    title: { ko: '내화충전 규격: ASTM vs EN 1366 비교 | KCT', en: 'Firestop Standards: ASTM E814/E1966 vs EN 1366 | KCT' },
    description: {
      ko: '관통부·선형 줄눈 내화 시험의 ASTM E119·E814·E1966, UL 1479, EN 1366-3/-4 대응과 E·I, F·T 등급 개념을 한눈에 비교합니다.',
      en: 'Compare ASTM E119, E814/UL 1479, E1966 with EN 1366-3/-4 for penetration seals and linear joints, and learn E/I and F/T ratings. KCT, Dow distributor.',
    },
  },
  'selection/dow-corning-to-dowsil': {
    title: { ko: 'Dow Corning → DOWSIL 구 품명 대조표 | KCT', en: 'Dow Corning to DOWSIL Product Name Cross-Reference | KCT' },
    description: {
      ko: '구 Dow Corning·DC 품명을 현행 DOWSIL 품명과 대조한 표와 제품 링크, Dow가 밝힌 브랜드 전환 배경을 정리했습니다. KCT 기술 지원.',
      en: 'Cross-reference of legacy Dow Corning and DC product names to current DOWSIL names with product links and the Dow brand transition background. KCT support.',
    },
  },
}
