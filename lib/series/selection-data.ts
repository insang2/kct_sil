import { p, ul, note, sec, IMG } from '@/lib/tech-manual/types'
import type { Cell, Block } from '@/lib/tech-manual/types'
import type { IPage } from '@/lib/industrial/pages'
import { CATALOG, CATEGORIES, type CatalogProduct } from '@/lib/products-catalog'
import { localizeCatalog, CATEGORY_EN } from '@/lib/products-catalog-en'

// WF 담당 파일: 새 페이지(IPage)와 메타(META: 키는 'selection/<slug>')를 여기서 export 한다. 번호(no)는 selection.ts 가 자동 부여.
// 카탈로그(lib/products-catalog.ts)에 실제로 기재된 색상·외관·포장·유효기간 필드만 표로 정리하며, 미기재 항목은 '문의'로 표기한다.
const bi = (en: string, ko: string): Cell => [en, ko]
const INQUIRE: Cell = ['Inquire', '문의']

const catLabel = (key: CatalogProduct['category']): Cell => {
  const ko = CATEGORIES.find((c) => c.key === key)?.label ?? key
  const en = CATEGORY_EN[key]?.label ?? key
  return [en, ko]
}

const colorCell = (c: CatalogProduct): Cell => {
  const enSpecs = localizeCatalog(c, 'en').specs
  if (c.specs['색상']) return [enSpecs['Colors'] ?? c.specs['색상'], c.specs['색상']]
  if (c.specs['외관']) return [enSpecs['Appearance'] ?? c.specs['외관'], c.specs['외관']]
  if (c.specs['혼합 후']) {
    const koMixed = c.specs['혼합 후']
    const enMixed = enSpecs['As mixed'] ?? koMixed
    return [`As mixed: ${enMixed}`, `혼합 후: ${koMixed}`]
  }
  return INQUIRE
}

const packagingCell = (c: CatalogProduct): Cell => {
  const enSpecs = localizeCatalog(c, 'en').specs
  if (c.specs['포장']) return [enSpecs['Packaging'] ?? c.specs['포장'], c.specs['포장']]
  return INQUIRE
}

const shelfLifeCell = (c: CatalogProduct): Cell => {
  const en = localizeCatalog(c, 'en')
  if (c.specs['유효기간']) return [en.specs['Shelf life'] ?? c.specs['유효기간'], c.specs['유효기간']]
  if (c.specs['유통 기간']) return [en.specs['Shelf life'] ?? c.specs['유통 기간'], c.specs['유통 기간']]
  const koFeat = c.features.find((f) => f.includes('유효기간'))
  if (koFeat) {
    const idx = c.features.indexOf(koFeat)
    const enFeat = en.features[idx] ?? koFeat
    return [enFeat, koFeat]
  }
  return INQUIRE
}

const ALL_ROWS: Cell[][] = CATALOG.map((c) => [
  c.name,
  catLabel(c.category),
  colorCell(c),
  packagingCell(c),
  shelfLifeCell(c),
])

const COLOR_TABLE: Block = {
  k: 'tbl',
  big: true,
  title: {
    en: 'DOWSIL™ 30 Products — Catalog-Verified Colors, Packaging and Shelf Life',
    ko: 'DOWSIL™ 전 제품 30종 색상·포장·유효기간 정리표 (카탈로그 기준)',
  },
  head: [
    bi('Product', '제품'),
    bi('Category', '구분'),
    bi('Colors / Appearance', '색상 · 외관'),
    bi('Packaging', '포장'),
    bi('Shelf life', '유효기간'),
  ],
  rows: ALL_ROWS,
  note: {
    en: 'Values reflect only the fields stated in the summarized KCT product catalog (from Dow TDS). "Inquire" means the field is not listed in the summarized catalog; confirm current colors, packaging units and lot shelf life with Dow TDS and Korea Construction Trading (KCT).',
    ko: '표의 내용은 KCT 제품 카탈로그(Dow TDS 요약)에 실제로 기재된 항목만 반영했습니다. 「문의」는 요약 카탈로그에 미기재된 항목이며, 실제 공급 색상·포장 단위·로트별 유효기간은 최신 Dow TDS와 한국건설트레이딩(KCT)을 통해 확인해 주십시오.',
  },
}

export const PAGES: IPage[] = [
  {
    slug: 'color-and-packaging-guide',
    no: 0,
    pdfPages: '—',
    doc: 'TDS 요약',
    title: {
      en: 'DOWSIL™ Colors, Packaging & Shelf Life Guide (All 30 Products)',
      ko: 'DOWSIL™ 색상·포장·유효기간 가이드 (전 제품 30종)',
    },
    summary: {
      en: 'Text-based summary of catalog-verified colors, appearances, packaging and shelf life across all 30 DOWSIL™ sealants, coatings and primers, with unlisted items marked as Inquire.',
      ko: 'DOWSIL™ 실란트·코팅·프라이머 30종의 카탈로그 확인 색상·외관·포장·유효기간을 텍스트 표로 정리하고 미기재 항목을 명확히 구분했습니다.',
    },
    answer: {
      en: 'This table compiles only the color/appearance, packaging and shelf-life fields explicitly listed in KCT’s Dow TDS product catalog across all 30 DOWSIL™ products. Multi-color options are listed for 789, 977, 991, Double-N and 123; packaging is stated for FIRESTOP 700 (310 ml cartridge, 12/box); shelf life is stated for 995 (18 months at ≤32°C), 121 (12 months) and 982 (12 months). All unlisted fields are marked "Inquire" — contact Korea Construction Trading (KCT) to confirm current color availability, pack formats and stock dates.',
      ko: '이 표는 KCT 제품 카탈로그(Dow TDS 요약)에 실제로 명시된 DOWSIL™ 30종의 색상·외관, 포장, 유효기간 항목만 모아 정리했습니다. 카탈로그 기준 다색 옵션은 789·977·991·Double-N·123에 기재되어 있으며, 포장은 FIRESTOP 700(310ml 카트리지, 12개/박스), 유효기간은 995(18개월, 32°C 이하 보관)·121(제조일로부터 12개월)·982(12개월)에 명시되어 있습니다. 표에 「문의」로 표기된 항목과 실제 재고 색상·포장 단위는 한국건설트레이딩(KCT)으로 확인해 주십시오.',
    },
    image: IMG('cover'),
    sections: [
      sec(
        'how-to-read',
        'How to read this table',
        '이 표를 보는 방법과 확인 원칙',
        p(
          'Color ranges, packaging formats (cartridge, sausage, pail, drum) and shelf life for DOWSIL™ products can vary by region, order volume and TDS revision. To avoid inaccurate assumptions, this guide lists only the values documented in the KCT catalog (summarized from Dow TDS) and marks every undocumented field as "Inquire".',
          'DOWSIL™ 제품의 공급 색상, 포장 단위(카트리지·소시지·페일·드럼), 유효기간은 유통 지역과 발주 물량, TDS 개정 버전에 따라 달라질 수 있습니다. 부정확한 추정을 피하기 위해 이 가이드는 KCT 카탈로그(Dow TDS 요약)에서 확인된 항목만 텍스트로 수록하고, 미기재 항목은 모두 「문의」로 표기했습니다.',
        ),
        note(
          'No digital color swatches are displayed on this page because monitor rendering differs from cured silicone elastomers. Always verify exact color matching and current pack availability with KCT before specifying or ordering.',
          '모니터 화면의 색상은 실제 경화된 실리콘 탄성체와 차이가 있으므로 디지털 컬러칩을 표시하지 않습니다. 설계 지정이나 발주 전에는 반드시 한국건설트레이딩(KCT)을 통해 실제 색상과 공급 가능 포장을 확인해 주십시오.',
        ),
      ),
      sec(
        'table',
        'All 30 products: colors, packaging and shelf life',
        '전 제품 30종 색상·포장·유효기간 표',
        COLOR_TABLE,
      ),
      sec(
        'highlights',
        'Catalog-verified highlights by group',
        '카탈로그에서 확인된 주요 항목 정리',
        ul(
          [
            'Multi-color architectural / stone sealants listed in catalog: DOWSIL™ 789 (Black, Gray, Bronze, Limestone, Precast White, White + special colors), DOWSIL™ 977 (Grey, Bronze, Black, Limestone, White, Charcoal + custom colors), DOWSIL™ 991 (9 colors: Black, Gray, Bronze, White, Limestone, Charcoal, Dark Gray, Sandstone, Pink), DOWSIL™ Double-N (14 colors), DOWSIL™ 123 (6 colors + custom).',
            '다색 옵션이 카탈로그에 명시된 건축·석재용 제품: DOWSIL™ 789(6색 및 특수 색상 가능), DOWSIL™ 977(6색 및 맞춤 색상), DOWSIL™ 991(9색), DOWSIL™ Double-N(14색), DOWSIL™ 123(6색 및 맞춤 가능).',
          ],
          [
            'Two-part products with contrasting base / catalyst colors listed in catalog: DOWSIL™ 121 (Base black/dark gray, Catalyst white), DOWSIL™ 902 RCS (Part A dark gray, Part B white), DOWSIL™ 939 (Base white, Curing agent black, Mixed black), DOWSIL™ 982 (Base white, Curing agent black), DOWSIL™ 983 (Base white, Catalyst black or gray), DOWSIL™ 375 (Part A Cream, Part B Brown), and DOWSIL™ 993 (mixed: black non-slump paste).',
            '주제·경화제 색상이 카탈로그에 명시된 2액형 제품: DOWSIL™ 121(Base 흑색/진회색, Catalyst 백색), 902 RCS(Part A 진회색, Part B 흰색), 939(주제 백색, 경화제 흑색, 혼합 흑색), 982(주제 백색, 경화제 흑색), 983(Base 백색, Catalyst 흑색 또는 회색), 375(Part A Cream, Part B Brown), 993(혼합 후 흑색 비흐름성 페이스트).',
          ],
          [
            'Packaging stated in catalog: DOWSIL™ FIRESTOP 700 (310 ml cartridge, 12 per box). All other 29 products are marked "Inquire" for packaging.',
            '포장 단위가 카탈로그에 명시된 제품: DOWSIL™ FIRESTOP 700(310ml 카트리지, 12개/박스). 나머지 29종은 포장 단위를 「문의」로 표기했습니다.',
          ],
          [
            'Shelf life stated in catalog: DOWSIL™ 995 (18 months stored at or below 32°C), DOWSIL™ 121 (12 months from date of manufacture), DOWSIL™ 982 (12 months). All other 27 products are marked "Inquire".',
            '유효기간이 카탈로그에 명시된 제품: DOWSIL™ 995(유효기간 18개월, 32°C 이하 보관), DOWSIL™ 121(제조일로부터 12개월), DOWSIL™ 982(유통 기간 12개월). 나머지 27종은 「문의」로 표기했습니다.',
          ],
          [
            'Coatings and primers with appearance notes in catalog: DOWSIL™ 650+ (translucent blue liquid), DOWSIL™ ALLGUARD Primer (milky white liquid, transparent when cured), DOWSIL™ Primer-C (Clear). DOWSIL™ ALLGUARD uses three tint bases pigmented at the distributor.',
            '외관·조색 정보가 기재된 코팅·프라이머: DOWSIL™ 650+(반투명 청색 액체), DOWSIL™ ALLGUARD Primer(유백색 액체, 경화 후 투명), DOWSIL™ Primer-C(Clear). DOWSIL™ ALLGUARD는 유통처 조색용 3종 틴트 베이스를 사용합니다.',
          ],
        ),
      ),
      sec(
        'sources',
        'Sources and KCT technical support',
        '출처 및 한국건설트레이딩(KCT) 기술 지원',
        p(
          'Source: Individual Dow Technical Data Sheets (TDS) summarized in the Korea Construction Trading (KCT) product catalog (30 products). Each product’s original PDF can be downloaded by approved members or requested via email from the KCT TDS Center (/en/tds) or the individual product pages (/en/products).',
          '출처: 한국건설트레이딩(KCT) 제품 카탈로그(30종)에 요약된 각 제품의 Dow 기술 데이터시트(TDS). 각 제품의 원문 PDF는 KCT TDS 자료실(/ko/tds)과 제품 상세 페이지(/ko/products)에서 승인 회원은 바로 다운로드하고 비회원은 이메일 전송을 요청할 수 있습니다.',
        ),
        p(
          'Korea Construction Trading (KCT) does its best to support product selection, latest TDS/SDS confirmation, color and packaging availability checks, and B2B supply quotations (sales@kconstrade.com, +82 10-8939-0284).',
          '한국건설트레이딩(KCT)은 제품 선정, 최신 TDS·SDS 확인, 색상·포장 단위 및 재고 유효기간 안내, B2B 공급 견적 등 기술 지원을 위해 최선을 다합니다(sales@kconstrade.com, 010-8939-0284).',
        ),
      ),
    ],
    faq: [
      {
        q: {
          en: 'Why are colors or packaging marked "Inquire" for products like DOWSIL™ 795 and 791?',
          ko: 'DOWSIL™ 795·791 등 일부 제품의 색상·포장이 「문의」로 표기된 이유는 무엇인가요?',
        },
        a: {
          en: 'This page records only fields explicitly stated in the summarized KCT product catalog and avoids guessing unlisted specifications. Check or request the product’s TDS PDF on the TDS center or contact KCT (sales@kconstrade.com, +82 10-8939-0284) to verify currently supplied colors, cartridge/sausage/pail/drum options and lead times.',
          ko: '이 페이지는 요약 카탈로그에 명시된 사실만 수록하며 미기재 사양을 추정하지 않습니다. TDS 자료실에서 각 제품의 TDS를 확인·요청하시거나 한국건설트레이딩(sales@kconstrade.com, 010-8939-0284)으로 문의하시면 현재 국내·수출 공급 가능한 색상과 포장 단위를 안내해 드립니다.',
        },
      },
      {
        q: {
          en: 'Why are there no visual color swatches on this page?',
          ko: '페이지에 컬러칩(색상 견본 이미지)을 표시하지 않는 이유는 무엇인가요?',
        },
        a: {
          en: 'Screen displays vary significantly and cannot reproduce the true shade or finish of cured silicone sealants. Confirm color selection with official reference materials and KCT before ordering.',
          ko: '모니터 환경에 따라 색상이 다르게 보이며 경화된 실리콘의 실제 질감·명도를 재현할 수 없기 때문입니다. 발주 전 한국건설트레이딩을 통해 실제 공급 색상을 확인해 주십시오.',
        },
      },
      {
        q: {
          en: 'Which DOWSIL™ exterior sealants list multiple standard colors in the catalog?',
          ko: '카탈로그에 다양한 색상이 명시된 외장·건축용 DOWSIL™ 실란트는 무엇인가요?',
        },
        a: {
          en: 'In the catalog, DOWSIL™ 789 lists 6 standard colors plus special colors, DOWSIL™ 977 lists 6 colors plus custom colors, DOWSIL™ 991 lists 9 colors, DOWSIL™ Double-N lists 14 colors and DOWSIL™ 123 lists 6 colors plus custom options.',
          ko: '카탈로그 기준으로 DOWSIL™ 789(6색 및 특수 색상 가능), DOWSIL™ 977(6색 및 맞춤 색상), DOWSIL™ 991(9색), DOWSIL™ Double-N(14색), DOWSIL™ 123(6색 및 맞춤 가능)에 다색 구성이 기재되어 있습니다.',
        },
      },
      {
        q: {
          en: 'Which products have shelf life stated in the catalog, and how do I check others?',
          ko: '유효기간이 카탈로그에 표기된 제품은 무엇이며, 다른 제품은 어떻게 확인하나요?',
        },
        a: {
          en: 'The catalog lists 18 months (at ≤32°C) for DOWSIL™ 995, 12 months from manufacture for DOWSIL™ 121 and 12 months for DOWSIL™ 982. For all other products, check the product TDS PDF and confirm manufacturing dates and storage conditions with KCT before delivery.',
          ko: '카탈로그에는 DOWSIL™ 995(18개월, 32°C 이하 보관), DOWSIL™ 121(제조일로부터 12개월), DOWSIL™ 982(12개월)의 유효기간이 기재되어 있습니다. 그 외 제품은 TDS 원문과 한국건설트레이딩을 통해 출고 로트의 유효기간과 보관 조건을 확인해 주십시오.',
        },
      },
      {
        q: {
          en: 'How can I confirm stock packaging and request a B2B quote from KCT?',
          ko: '포장 단위 재고 확인과 B2B 견적은 어떻게 요청하나요?',
        },
        a: {
          en: 'Send the product code, desired color, estimated quantity and project destination to Korea Construction Trading (sales@kconstrade.com, +82 10-8939-0284 or WhatsApp). We support both domestic B2B supply and global export.',
          ko: '필요하신 제품명, 희망 색상, 예상 수량, 납품 지역을 한국건설트레이딩(sales@kconstrade.com, 010-8939-0284, WhatsApp)으로 알려 주시면 국내 B2B 공급과 해외 수출 견적을 신속히 안내해 드립니다.',
        },
      },
    ],
  },
]

export const META: Record<string, { title: { ko: string; en: string }; description: { ko: string; en: string } }> = {
  'selection/color-and-packaging-guide': {
    title: {
      ko: 'DOWSIL 색상·포장·유효기간 30종 정리표 | KCT',
      en: 'DOWSIL™ Colors, Packaging & Shelf Life Guide | KCT',
    },
    description: {
      ko: 'DOWSIL(다우실) 건축·구조·토목·복층유리·특수·프라이머 30종의 카탈로그 기준 색상, 포장, 유효기간 정리표입니다. 미기재 항목과 재고는 KCT에 문의하세요.',
      en: 'Review catalog-verified colors, packaging and shelf life for all 30 DOWSIL™ sealants and primers in one table. Ask KCT for unlisted items and stock.',
    },
  },
}
