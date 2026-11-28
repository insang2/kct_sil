import { p, h, ul, note, sec, IMG } from '@/lib/tech-manual/types'
import type { Cell, Block } from '@/lib/tech-manual/types'
import type { IPage } from '@/lib/industrial/pages'
import { bySlug } from '@/lib/products-catalog'
import { localizeCatalog } from '@/lib/products-catalog-en'
import { PHONE_DISPLAY, SMARTSTORE_URL, KAKAO_URL, MAP_URL, ADDRESS } from '@/lib/contact'

// WE 담당 파일: 새 페이지(IPage)와 메타(META: 키는 'selection/<slug>')를 여기서 export 한다. 번호(no)는 selection.ts 가 자동 부여.
const bi = (en: string, ko: string): Cell => [en, ko]

const tbl = (
  head: Cell[],
  rows: Cell[][],
  opts?: { title?: { en: string; ko: string }; note?: { en: string; ko: string }; big?: boolean },
): Block => ({
  k: 'tbl',
  head,
  rows,
  ...(opts?.title ? { title: opts.title } : {}),
  ...(opts?.note ? { note: opts.note } : {}),
  ...(opts?.big ? { big: true } : {}),
})

const prodLink = (slug: string): [string, string] => {
  const c = bySlug(slug)
  if (!c) return [slug, slug]
  const e = localizeCatalog(c, 'en')
  return [
    `${c.name} — ${e.summary}: https://kconstrade.com/en/products/${slug}`,
    `${c.name} — ${c.summary}: https://kconstrade.com/ko/products/${slug}`,
  ]
}

const KCT_SUPPORT_P = p(
  `Korea Construction Trading (KCT) supports product selection, TDS/MSDS provision, and domestic or export quotations. Contact sales@kconstrade.com or +82 10-8939-0284 (${PHONE_DISPLAY}) with your substrates, joint movement, and project requirements.`,
  `한국건설트레이딩(KCT)은 기재·조인트 움직임·현장 조건에 맞는 DOWSIL™ 제품 선정, TDS·MSDS 자료 제공, 국내 B2B 및 해외 수출 견적을 지원합니다. 문의: sales@kconstrade.com · ${PHONE_DISPLAY}`,
)

export const PAGES: IPage[] = [
  // ───────────────────────────────────────────────────────────────────────────
  // 1. 국내·해외 구매 채널 및 견적·수출 안내
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'buy-dowsil-in-korea',
    no: 1,
    pdfPages: '—',
    doc: '구매·수출 안내',
    title: {
      en: 'How to Buy DOWSIL™ Silicone Sealants in Korea: Retail, Domestic B2B & Export Guide',
      ko: '한국 DOWSIL(다우실) 실리콘 실란트 구매·견적·수출 안내',
    },
    summary: {
      en: 'Ordering channels for DOWSIL™ silicone sealants through Korea Construction Trading (KCT): small-quantity Naver Smart Store orders, domestic B2B quotations and tax invoices, and overseas export terms (Incoterms, MOQ, lead time, payment and documents).',
      ko: '한국건설트레이딩(KCT)을 통한 DOWSIL™ 실리콘 실란트 구매 채널(소량 네이버 스마트스토어, 국내 B2B 견적·세금계산서, 해외 수출 FOB·CIF·EXW 조건)과 견적 요청 시 필요한 정보 4가지를 정리했습니다.',
    },
    answer: {
      en: 'In Korea, DOWSIL™ silicone sealants can be ordered through Korea Construction Trading (KCT) via three channels: Naver Smart Store for small or individual orders, direct B2B inquiry or online quotation (with tax invoice and split-delivery consultation) for domestic sites, and FOB/CIF/EXW export orders (MOQ from 1 box of 6 pcs to 1 pallet depending on product) for overseas buyers. Pricing, stock availability, and lead times vary by model and quantity and are confirmed upon quotation.',
      ko: '한국에서 DOWSIL™(다우실) 실리콘 실란트는 한국건설트레이딩(KCT)을 통해 세 가지 경로로 구매할 수 있습니다. 소량·개인 주문은 네이버 스마트스토어, 국내 건설 현장·B2B 대량 구매는 유선·이메일·카카오톡 문의 또는 온라인 견적서 페이지(세금계산서 발행·분할 배송 협의), 해외 바이어는 수출 문의 페이지(FOB·CIF·EXW, 제품별 MOQ 1박스(6개)~1팔레트)로 진행합니다. 단가·재고·납기는 모델과 수량에 따라 달라지므로 견적 문의 시 확인해 드립니다.',
    },
    image: IMG('cover'),
    sections: [
      sec(
        'channels',
        'Domestic & Overseas Buying Channels',
        '국내·해외 구매 채널 비교',
        p(
          'Choose the purchasing route that fits your order size and delivery destination. Korea Construction Trading (KCT, Business Reg. No. 371-07-03719) handles domestic wholesale, small-quantity retail, and international export of architectural and structural silicone sealants.',
          '주문 수량과 납품 지역에 따라 적합한 구매 채널을 선택할 수 있습니다. 한국건설트레이딩(KCT, 사업자등록번호 371-07-03719)은 건축용·구조용 실리콘 실란트의 국내 소량·B2B 도매 공급과 해외 수출을 모두 지원합니다.',
        ),
        tbl(
          [
            bi('Channel', '구매 구분'),
            bi('Best for', '적합한 고객'),
            bi('How to order', '주문·문의 경로'),
            bi('Documents & features', '지원 사항 (사이트 안내 기준)'),
          ],
          [
            [
              bi('Small / retail orders', '소량·개인 구매'),
              bi('Small repair jobs or individual buyers', '소량 보수·개인·테스트 구매'),
              bi(`Naver Smart Store (${SMARTSTORE_URL}) and open-market channels`, `네이버 스마트스토어(${SMARTSTORE_URL}) 및 입점 오픈마켓`),
              bi('Direct online checkout for listed items', '입점 품목 바로 주문 가능'),
            ],
            [
              bi('Domestic B2B / site supply', '국내 B2B·현장 납품'),
              bi('Contractors, curtain-wall fabricators, site managers', '건설사·창호/커튼월 시공사·현장 소장·유통사'),
              bi('Phone, email, KakaoTalk, or B2B online quotation page (/en/quote)', '전화·이메일·카카오톡 문의 또는 B2B 온라인 견적서 페이지(/ko/quote)'),
              bi('Quotation within 24 hours, tax invoice, multi-site split delivery & on-site direct delivery available upon consultation', '문의 후 24시간 내 견적 회신, 세금계산서 발행, 다중 현장 분할 배송·현장 직납 협의'),
            ],
            [
              bi('Overseas export', '해외 바이어 수출'),
              bi('International contractors and distributors', '해외 건설사·바이어·무역 파트너'),
              bi('Export inquiry page (/en/export), email, or WhatsApp (+82-10-8939-0284)', '수출 문의 페이지(/ko/export), 이메일, WhatsApp(+82-10-8939-0284)'),
              bi('FOB/CIF/EXW terms, CI·PL·CO·MSDS·TDS documents, T/T & L/C negotiable', 'FOB·CIF·EXW 협의, CI·PL·CO·MSDS·TDS 서류 제공, T/T·L/C 결제 협의'),
            ],
          ],
          {
            title: { en: 'KCT Purchasing Channels at a Glance', ko: '한국건설트레이딩(KCT) 구매 채널 한눈에 보기' },
            note: {
              en: 'Exact unit pricing, current stock status, shelf life, and delivery dates are confirmed per inquiry and quotation.',
              ko: '정확한 단가, 시점별 재고 여부, 제조일·유효기간 및 출고 일정은 품목·수량에 따라 변동되므로 견적 문의 시 확인해 드립니다.',
            },
          },
        ),
        p(
          'For domestic B2B members, the online quotation builder allows logged-in users to select products and quantities, generate a PDF quotation (valid for 30 days, showing subtotal and 10% VAT), and review saved quotation history.',
          '국내 B2B 회원은 온라인 견적서 페이지에서 로그인 후 품목과 수량을 선택해 PDF 견적서(공급가액·부가세 10% 표기, 견적 유효기간 30일)를 발급·저장하고 견적 이력을 조회할 수 있습니다. 미등록 품목이나 프로젝트별 조건은 담당자에게 직접 문의해 주세요.',
        ),
      ),
      sec(
        'quote-info',
        'Four Details Needed for a Fast Quotation',
        '견적 요청 시 필요한 정보 4가지와 진행 절차',
        p(
          'Preparing four core items when submitting an inquiry helps KCT return an accurate quotation within 24 business hours without back-and-forth delays.',
          '견적 문의 시 아래 4가지 정보를 함께 전달해 주시면 영업일 기준 24시간 내에 보다 정확한 단가와 납기 조건을 안내받으실 수 있습니다.',
        ),
        ul(
          [
            '1. Product model (or application): State the DOWSIL™ model number (e.g., 789, 791, 795, 995, 991, 983, 993, FIRESTOP 700). If undecided, share your substrates, joint movement, and whether structural or weatherproofing duty is needed.',
            '1. 제품명(모델명) 또는 적용 용도: 필요한 DOWSIL™ 모델명(예: 789, 791, 795, 995, 991, 983, 993, FIRESTOP 700 등)을 알려주세요. 모델이 미정이라면 기재, 조인트 움직임, 구조용/내후성 여부를 알려주시면 선정을 지원합니다.',
          ],
          [
            '2. Color and packaging preference: Specify the required color (e.g., Black, Gray, White, Limestone) and preferred container type (cartridge, foil sausage, pail, or drum), subject to each product’s available formats.',
            '2. 희망 색상 및 포장 형태: 필요한 색상(예: Black, Gray, White 등)과 카트리지·소시지·페일·드럼 등 희망 포장 형태를 기재해 주세요. 공급 가능한 색상·포장은 제품별로 다르므로 견적 시 확인합니다.',
          ],
          [
            '3. Estimated quantity: Provide box/piece count or, if still estimating, joint width, depth, and total linear meters so consumption can be checked together.',
            '3. 예상 수량: 박스 또는 개수를 알려주세요. 물량 산출 전이라면 조인트 폭·깊이·총 길이를 알려주시면 소요량 검토를 함께 지원합니다.',
          ],
          [
            '4. Delivery destination and schedule: For domestic sites, share the site region, desired delivery window, and whether split delivery is needed. For export, include destination country and preferred Incoterms (FOB, CIF, EXW, or DAP).',
            '4. 납품지 및 희망 일정: 국내 현장은 지역, 희망 납기, 분할 배송 여부를, 해외 수출은 도착 국가와 선호 인코텀즈(FOB·CIF·EXW·DAP)를 함께 기재해 주세요.',
          ],
        ),
        h('Four-Step B2B Order Process', '국내 B2B 거래 4단계 절차'),
        ul(
          [
            'Step 1 — Submit inquiry: Send product, quantity, and site details via phone, email, KakaoTalk, or the website form.',
            '1단계 — 문의 접수: 전화·이메일·카카오톡 또는 웹사이트 문의 양식으로 필요 자재와 수량을 전달합니다.',
          ],
          [
            'Step 2 — Custom quotation: KCT reviews availability and sends a quotation with pricing and delivery schedule within 24 hours.',
            '2단계 — 맞춤 견적: 품목별 조건을 확인해 24시간 내 단가와 납기 일정을 포함한 견적서를 발송합니다.',
          ],
          [
            'Step 3 — Order confirmation: Confirm payment terms and issue the purchase order. Tax invoices are issued for domestic B2B transactions.',
            '3단계 — 발주 확정: 결제 조건 협의 후 발주를 확정하며, 국내 사업자 거래 시 세금계산서를 발행합니다.',
          ],
          [
            'Step 4 — Dispatch & delivery: Domestic delivery schedules (including multi-site split delivery) and export shipments are executed per the confirmed order.',
            '4단계 — 출고 및 납품: 확정된 일정에 따라 국내 납품(다중 현장 분할 배송 협의 가능) 또는 해외 선적을 진행합니다.',
          ],
        ),
      ),
      sec(
        'export-terms',
        'Overseas Export Conditions',
        '해외 바이어 수출 조건 안내',
        p(
          'KCT supplies architectural and structural silicone sealants to overseas buyers across markets including the UAE, Australia, Vietnam, Singapore and Southeast Asia, Japan, and Taiwan. Export terms published on the KCT export page are summarized below.',
          '한국건설트레이딩(KCT)은 UAE, 호주, 베트남, 싱가포르 외 동남아시아, 일본, 대만 등 해외 바이어에게 건축용·구조용 실리콘을 수출하고 있습니다. KCT 수출 안내 페이지에 명시된 기본 거래 조건은 다음과 같습니다.',
        ),
        tbl(
          [bi('Item', '항목'), bi('Published KCT Export Condition', 'KCT 수출 안내 조건')],
          [
            [bi('Incoterms', '인코텀즈 (Incoterms)'), bi('FOB · CIF · EXW negotiable (DAP also selectable on inquiry form)', 'FOB · CIF · EXW 조건 협의 가능 (문의 양식에서 DAP 선택 가능)')],
            [bi('MOQ', '최소주문수량 (MOQ)'), bi('1 box (6 pcs) to 1 pallet depending on the product', '제품에 따라 1박스(6개) ~ 1팔레트')],
            [bi('Lead time', '납기 (리드타임)'), bi('3–7 business days from stock after order confirmation', '재고 기준 발주 후 3~7 영업일')],
            [bi('Payment terms', '결제 조건'), bi('T/T Wire Transfer · L/C negotiable', 'T/T 송금 · L/C 협의 가능')],
            [bi('Export documents', '제공 수출 서류'), bi('CI (Commercial Invoice) · PL (Packing List) · CO (Certificate of Origin) · MSDS · TDS', 'CI(상업송장) · PL(포장명세서) · CO(원산지증명서) · MSDS · TDS 제공')],
            [bi('Language support', '지원 언어'), bi('Korean · English · Japanese · Chinese', '한국어 · 영어 · 일본어 · 중국어')],
            [bi('Inquiry response', '문의 회신'), bi('Within 24 business hours', '영업일 기준 24시간 내 회신')],
          ],
          {
            title: { en: 'Export Terms Summary', ko: '수출 거래 조건 요약' },
            note: {
              en: 'Non-stock items, custom colors, dangerous-goods packing (e.g., flammable primers), and destination customs requirements are confirmed individually before order placement.',
              ko: '비재고 품목, 특수 색상, 인화성 프라이머 등 위험물 선적 여부 및 도착국 통관 요건은 발주 전 개별 협의로 확정합니다.',
            },
          },
        ),
      ),
      sec(
        'support-links',
        'KCT Contact, Technical Support & Useful Links',
        '한국건설트레이딩(KCT) 연락처·기술 지원 및 바로가기',
        KCT_SUPPORT_P,
        ul(
          [
            `Phone / WhatsApp: +82 10-8939-0284 (${PHONE_DISPLAY}) · WhatsApp: https://wa.me/821089390284`,
            `전화 / WhatsApp: ${PHONE_DISPLAY} (+82 10-8939-0284) · WhatsApp: https://wa.me/821089390284`,
          ],
          [
            `Email & KakaoTalk: sales@kconstrade.com · KakaoTalk channel: ${KAKAO_URL}`,
            `이메일 및 카카오톡: sales@kconstrade.com · 카카오톡 채널: ${KAKAO_URL}`,
          ],
          [
            `Office address: ${ADDRESS.en} · Map: ${MAP_URL}`,
            `주소: ${ADDRESS.ko} · 지도: ${MAP_URL}`,
          ],
          [
            `Small orders (Naver Smart Store): ${SMARTSTORE_URL}`,
            `소량 구매(네이버 스마트스토어): ${SMARTSTORE_URL}`,
          ],
          [
            'DOWSIL™ 30-product catalog & TDS downloads: https://kconstrade.com/en/products',
            'DOWSIL™ 30종 제품 카탈로그 및 TDS 다운로드: https://kconstrade.com/ko/products',
          ],
          [
            'B2B online quotation page: https://kconstrade.com/en/quote',
            'B2B 온라인 견적서 페이지: https://kconstrade.com/ko/quote',
          ],
          [
            'Export inquiry page: https://kconstrade.com/en/export',
            '해외 수출 문의 페이지: https://kconstrade.com/ko/export',
          ],
          [
            'About Korea Construction Trading (KCT): https://kconstrade.com/en/about',
            '한국건설트레이딩(KCT) 회사소개: https://kconstrade.com/ko/about',
          ],
          prodLink('dowsil-789'),
          prodLink('dowsil-791'),
          prodLink('dowsil-795'),
          prodLink('dowsil-995'),
          prodLink('dowsil-991'),
          prodLink('dowsil-993'),
        ),
      ),
      sec(
        'references',
        'References',
        '참고 출처',
        ul(
          [
            'Korea Construction Trading (KCT) Contact & Channel Information (lib/contact.ts): phone, address, Naver Smart Store, KakaoTalk channel, map.',
            '한국건설트레이딩(KCT) 연락처 및 채널 안내(lib/contact.ts): 전화, 주소, 네이버 스마트스토어, 카카오톡 채널, 지도.',
          ],
          [
            'KCT Export Inquiry Page (/en/export) & Bilingual Site Dictionaries: Incoterms (FOB/CIF/EXW), MOQ, stock lead time, payment (T/T, L/C), export documents (CI, PL, CO, MSDS, TDS), and supported languages.',
            'KCT 수출 문의 페이지(/ko/export) 및 사이트 안내 자료: Incoterms(FOB·CIF·EXW), MOQ, 재고 기준 리드타임, 결제(T/T·L/C), 수출 서류(CI·PL·CO·MSDS·TDS), 지원 언어.',
          ],
          [
            'KCT B2B Online Quotation Page (/en/quote): B2B login quotation builder, PDF download, 30-day quote validity, and VAT display.',
            'KCT B2B 온라인 견적서 페이지(/ko/quote): B2B 로그인 견적서 작성, PDF 다운로드, 유효기간 30일 및 부가세(10%) 표기 안내.',
          ],
        ),
      ),
    ],
    faq: [
      {
        q: { en: 'Can I buy a small quantity of DOWSIL™ silicone in Korea?', ko: '한국에서 DOWSIL™ 실리콘을 소량(1개~수 개)만 구매할 수도 있나요?' },
        a: {
          en: `Yes. Small and individual orders for listed products can be placed directly on KCT’s Naver Smart Store (${SMARTSTORE_URL}). For bulk site orders, non-listed models, or formal tax-invoice quotes, contact KCT directly.`,
          ko: `네. 소량·개인 구매는 한국건설트레이딩 네이버 스마트스토어(${SMARTSTORE_URL})에서 입점 품목을 바로 주문하실 수 있습니다. 대량 현장 발주, 미입점 모델, 세금계산서·견적서 발급은 KCT로 직접 문의해 주세요.`,
        },
      },
      {
        q: { en: 'What information should I send when requesting a B2B quote?', ko: 'B2B 견적을 요청할 때 어떤 정보를 함께 보내야 하나요?' },
        a: {
          en: 'Share four details: (1) DOWSIL™ model name or intended application, (2) color and packaging preference, (3) estimated quantity (or joint dimensions and length), and (4) delivery site or destination country and target schedule.',
          ko: '① DOWSIL™ 모델명(또는 적용 용도·기재), ② 희망 색상·포장 형태, ③ 예상 수량(또는 조인트 규격·총 길이), ④ 납품 지역(수출 시 도착 국가·선호 Incoterms)과 희망 일정의 4가지를 보내주시면 24시간 내 회신해 드립니다.',
        },
      },
      {
        q: { en: 'What are the MOQ, Incoterms, and payment options for overseas export?', ko: '해외 수출 시 최소주문수량(MOQ), 인코텀즈, 결제 조건은 어떻게 되나요?' },
        a: {
          en: 'Per KCT’s export terms, MOQ ranges from 1 box (6 pcs) to 1 pallet depending on the product, Incoterms include FOB, CIF, and EXW (negotiable), lead time is 3–7 business days from stock, and payment is available via T/T wire transfer or negotiable L/C. CI, PL, CO, MSDS, and TDS are provided.',
          ko: 'KCT 수출 안내 기준으로 MOQ는 제품에 따라 1박스(6개)~1팔레트, 인코텀즈는 FOB·CIF·EXW 협의, 리드타임은 재고 기준 발주 후 3~7 영업일, 결제는 T/T 송금 또는 L/C 협의입니다. CI·PL·CO·MSDS·TDS 수출 서류를 함께 제공합니다.',
        },
      },
      {
        q: { en: 'Where can I check current unit price, stock, shelf life, or test reports?', ko: '최신 단가, 재고 여부, 유효기간, 시험성적서나 보증 서류는 어떻게 확인하나요?' },
        a: {
          en: 'Unit prices, real-time stock, manufacture/use-by dates, and project documentation (such as TDS, MSDS, or Dow technical review requirements for structural glazing) vary by model and timing. Contact sales@kconstrade.com or +82 10-8939-0284 to confirm before ordering.',
          ko: '단가, 시점별 재고, 제조일·유효기간 및 제출 서류(TDS·MSDS·구조 글레이징 사전 검토 등)는 품목과 시점에 따라 달라집니다. 발주 전 sales@kconstrade.com 또는 010-8939-0284로 문의하시면 최신 조건을 확인해 드립니다.',
        },
      },
      {
        q: { en: 'Can KCT help if I am not sure which DOWSIL™ sealant to specify?', ko: '어떤 DOWSIL™ 제품을 선택해야 할지 잘 모를 때도 상담받을 수 있나요?' },
        a: {
          en: 'Yes. Share your substrates, joint movement, structural or weatherproofing duty, and environment with KCT (sales@kconstrade.com, +82 10-8939-0284). We support product selection and TDS review.',
          ko: '네. 기재, 조인트 움직임, 구조용·내후성 구분 및 사용 환경을 한국건설트레이딩(sales@kconstrade.com, 010-8939-0284)에 알려주시면 제품 선정과 TDS 확인을 지원해 드립니다.',
        },
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 2. 건축용 실리콘 한·영 용어집 30선 & 중성 vs 초산 비교
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'silicone-sealant-glossary-neutral-vs-acetoxy',
    no: 2,
    pdfPages: '—',
    doc: '용어·비교 가이드',
    title: {
      en: 'Architectural Silicone Sealant Glossary (30 EN–KR Terms) & Neutral vs. Acetoxy Guide',
      ko: '건축용 실리콘 한·영 용어 30선 & 중성(알콕시·옥심) vs 초산 비교',
    },
    summary: {
      en: '30 essential English–Korean architectural silicone terms (builders silicone, neutral cure, acetoxy, backer rod, bond breaker, movement capability), neutral (alkoxy/oxime) vs. acetoxy comparison aligned with Dow guides, and DOWSIL™ product matching.',
      ko: '건축용 실리콘 실무 한·영 용어 30개 대조표, Dow 기술 가이드 기준 중성(알콕시·옥심) vs 초산형(아세톡시) 비교, 그리고 시공 부위별 DOWSIL™ 추천 제품 매칭을 정리했습니다.',
    },
    answer: {
      en: 'In Korean construction sites, “builders silicone” is called 건축용 실리콘 (or 코킹) and “neutral cure sealant” is called 중성 실리콘 or 비초산 실리콘. Acetoxy (초산형) silicones cure fast with a strong vinegar-like acetic acid odor and may corrode metals, whereas neutral-cure alkoxy (알콕시) silicones offer low VOC and non-corrosive adhesion for aluminum curtain walls, facades, and concrete. For porous natural stone, select a neutral sealant verified for low staining (ASTM C1248), such as DOWSIL™ 977 or 991.',
      ko: '한국 건축 현장에서 “Builders silicone”은 건축용 실리콘(코킹), “Neutral cure sealant”는 중성 실리콘 또는 비초산 실리콘으로 부릅니다. 초산형(아세톡시)은 경화가 빠르지만 아세트산 냄새가 강하고 금속을 부식시킬 수 있는 반면, 중성 알콕시(Alkoxy)는 비부식·저VOC 특성으로 커튼월·알루미늄 창호·콘크리트 등 건축 전반에 쓰입니다. 다만 다공성 천연석에는 일반 중성 제품 대신 ASTM C1248 비오염 시험을 거친 중성 제품(DOWSIL™ 977·991)을 선택해야 합니다.',
    },
    image: IMG('ind-benefits'),
    sections: [
      sec(
        'glossary',
        '30 Essential Architectural Silicone Terms (English–Korean)',
        '건축용 실리콘 필수 한·영 용어 30개 대조표',
        p(
          'This bilingual glossary maps 30 core terms used on Korean construction sites, in Dow Technical Data Sheets (TDS), and in international facade specifications.',
          '국내 건축 현장, 해외 시방서, Dow 제품 기술자료(TDS)에서 자주 쓰이는 핵심 건축용 실리콘 용어 30개를 한·영으로 대조 정리했습니다.',
        ),
        tbl(
          [
            bi('No.', '번호'),
            bi('English term', '영문 용어'),
            bi('Korean term (site / spec)', '한국어 용어 (현장·시방)'),
            bi('Definition & practical note', '핵심 의미 및 실무 참고'),
          ],
          [
            ['01', 'Builders silicone', '건축용 실리콘 (코킹)', bi('Silicone sealant for building joints such as windows, facades, and interiors', '창호·외장·실내 등 건축 줄눈 밀봉용 실리콘 실란트')],
            ['02', 'Silicone sealant', '실리콘 실란트', bi('Elastomeric joint sealant with an inorganic Si–O siloxane backbone for weatherability', '무기 Si–O 실록산 주쇄를 기반으로 내후성·유연성이 우수한 줄눈 밀봉재')],
            ['03', 'Neutral cure (Non-acid)', '중성 경화 / 비초산 실리콘', bi('Cure chemistry releasing non-acidic by-products (alkoxy or oxime); called 비초산 on Korean sites', '경화 시 아세트산을 방출하지 않는 방식(알콕시·옥심); 한국 현장에서 비초산이라 흔히 부름')],
            ['04', 'Acetoxy (Acid cure)', '초산형 / 아세톡시 경화', bi('Acid-cure silicone releasing acetic acid (vinegar odor); fast cure but potentially corrosive to metals', '경화 중 소량의 아세트산(식초 냄새)을 방출하는 산 경화 방식; 빠르나 금속 부식 우려')],
            ['05', 'Alkoxy cure', '알콕시 경화 (중성)', bi('Neutral cure releasing alcohol by-products; low VOC, low odor, widely used in construction', '알코올계 부산물을 방출하는 중성 경화; 저취·저VOC로 건축 외장·금속에 널리 사용')],
            ['06', 'Oxime cure', '옥심 경화 (중성)', bi('Neutral cure with faster cure and clear options, but stronger odor and typically higher VOC', '경화가 빠르고 투명 제품이 가능한 중성 경화; 알콕시 대비 냄새와 VOC가 높은 편')],
            ['07', 'RTV (Room-Temperature Vulcanizing)', '상온 경화 (RTV)', bi('Silicone that cures to a rubbery solid at ambient temperature via moisture or catalyst', '가열 없이 상온에서 대기 중 수분 또는 촉매 반응으로 고무 탄성체가 되는 실리콘')],
            ['08', 'One-part (1-component)', '1액형', bi('Ready-to-use cartridge/sausage sealant cured by atmospheric moisture', '별도 혼합 없이 카트리지·소시지에서 바로 토출해 공기 중 수분으로 경화하는 타입')],
            ['09', 'Two-part (2-component)', '2액형', bi('Base and curing agent metered and mixed for fast through-cure in factories or rapid repair', '주제와 경화제를 정량 혼합해 내부까지 빠르게 경화; 공장 커튼월·복층유리·보수용')],
            ['10', 'Structural glazing (SSG)', '구조 글레이징 / 구조용 실링', bi('Bonding glass or panels to framing so the sealant carries wind and design loads; requires Dow review', '유리·패널을 프레임에 구조 접착해 풍하중 등을 부담하는 공법(Dow 기술 검토 필수)')],
            ['11', 'Weatherproofing / Weathersealing', '내후성 실링 / 웨더실링', bi('Non-structural exterior joint sealing to block rain, air, and UV exposure', '건물 외장·커튼월 조인트에서 빗물·공기·자외선 침투를 막는 비구조용 실링')],
            ['12', 'Perimeter joint', '페리미터 조인트 (창호 주위 줄눈)', bi('Joint around the perimeter between a window/curtain-wall frame and the wall structure', '창호나 커튼월 프레임 외주부와 벽체·구체 사이의 경계 줄눈')],
            ['13', 'Expansion joint', '신축이음 / 익스팬션 조인트', bi('Movement joint designed to absorb thermal expansion and structural displacement', '온도 변화와 구조 변위에 따른 부재의 팽창·수축을 흡수하는 줄눈')],
            ['14', 'Movement capability', '움직임 허용치', bi('Maximum joint extension/compression a cured sealant accommodates without failure (e.g., ±50%)', '경화 실란트가 파손 없이 수용하는 조인트 폭 변화 비율(예: ±50%, +100/-50%)')],
            ['15', 'Modulus (Low / Medium / High)', '모듈러스 (저·중·고탄성률)', bi('Stress generated when stretched; low/medium modulus suits moving joints, high modulus suits structural loads', '신장 시 발생하는 응력 수준; 고이동 조인트는 저·중모듈러스, 구조 접합은 고모듈러스')],
            ['16', 'Hardness (Shore A)', '경도 (쇼어 A)', bi('Indentation hardness of cured silicone rubber; higher numbers indicate firmer elastomer', '경화 실리콘 고무의 단단함 지표; 수치가 높을수록 단단한 탄성체')],
            ['17', 'Backer rod', '백업재 / 백커로드', bi('Foam rod (e.g., closed-cell PE) inserted to control joint depth, give back pressure, and stop 3-sided adhesion', '조인트 깊이를 조절하고 배압을 주며 3면 접착을 막는 발포 PE·PU 등 충전재')],
            ['18', 'Bond breaker', '본드 브레이커 (절연 테이프)', bi('Low-tack polyethylene tape used in shallow joints so sealant does not adhere to the joint bottom', '조인트가 얕아 백업재 시공이 어려울 때 바닥면 접착을 차단하는 PE 테이프')],
            ['19', 'Three-sided adhesion', '3면 접착', bi('Undesirable bonding to joint bottom as well as both sidewalls, restricting movement and causing tears', '양 측면 외에 바닥면까지 실란트가 붙어 움직임 수용력이 떨어지고 찢어지는 불량 상태')],
            ['20', 'Primer', '프라이머 / 접착 증진제', bi('Thin pretreatment applied after cleaning to improve adhesion and speed adhesion buildup on difficult substrates', '표면 세정 후 얇게 도포해 접착력과 접착 발현을 높이는 전처리제(세정 대체 불가)')],
            ['21', 'Surface preparation', '표면 준비 / 전처리', bi('Cleaning dust, oil, grease, moisture, or old sealant with solvent and drying before priming/sealing', '먼지·기름·수분·기존 실란트를 용제 등으로 제거하고 건조하는 접착 핵심 공정')],
            ['22', 'Tooling', '툴링 / 헤라 마감', bi('Pressing and smoothing fresh sealant before skin-over to wet substrates and remove air voids', '피막 형성 전에 주걱 등으로 눌러 기재 밀착을 높이고 기포를 제거하는 마감 작업')],
            ['23', 'Skin-over / Tack-free time', '표면 경화 / 지촉 건조(택프리) 시간', bi('Time until a surface skin forms or surface is no longer tacky; tooling must finish before skin-over', '도포 후 표면에 피막이 생기거나 손에 묻지 않게 되는 시간(피막 전 툴링 완료 필수)')],
            ['24', 'Working time (Open time)', '가사시간 / 작업 가능 시간', bi('Time window after dispensing or mixing during which tooling or assembly can be performed', '토출 또는 혼합 후 툴링이나 부재 조립을 수행할 수 있는 시간')],
            ['25', 'Full cure time', '완전 경화 시간', bi('Duration for moisture cure to progress through the full joint depth (commonly 7–14 days for 1-part building sealants)', '내부까지 경화가 완료되어 설계 물성에 도달하는 기간(1액형 건축용 통상 7~14일)')],
            ['26', 'Cohesive / Adhesive failure', '응집 파괴 / 계면(접착) 파괴', bi('Cohesive failure tears inside the sealant (desired in adhesion tests); adhesive failure peels off the substrate', '실란트 내부가 찢어지면 응집 파괴(양호), 기재 경계가 떨어지면 계면 파괴(접착 불량)')],
            ['27', 'Compatibility', '상용성 / 호환성', bi('Ability of sealant to contact gaskets, spacers, setting blocks, or existing sealants without discoloration or loss of adhesion', '가스켓·세팅블록·스페이서·기존 실란트 등과 접촉 시 변색·접착 저하 없이 공존하는 성질')],
            ['28', 'Non-staining (Fluid migration)', '비오염성 / 유체 이행 방지', bi('Formulation resisting fluid migration that darkens porous stone such as granite or marble (e.g., ASTM C1248)', '화강석·대리석 등 다공성 석재 주변이 오일 이행으로 오염되는 현상을 줄인 특성')],
            ['29', 'Insulating glass unit (IGU)', '복층유리 (단열유리)', bi('Multi-pane glass assembly sealed with a primary butyl seal and secondary silicone seal around a spacer', '스페이서 주위를 1차 부틸 씰과 2차 실리콘 씰로 이중 밀봉한 단열 유리 유닛')],
            ['30', 'Firestop / Fire-rated sealant', '내화 실란트 / 방화 실리콘', bi('Fire-tested silicone sealant for linear joints and service penetrations in fire-rated walls or floors', '방화구획 선형 조인트와 배관·케이블 관통부에서 화염·연기 확산을 지연시키는 내화 제품')],
          ],
          {
            title: { en: '30 Architectural Silicone Terms (EN–KR)', ko: '건축용 실리콘 한·영 용어 30선' },
            big: true,
          },
        ),
      ),
      sec(
        'neutral-vs-acetoxy',
        'Neutral Cure (Alkoxy & Oxime) vs. Acetoxy Silicone',
        '중성(알콕시·옥심) vs 초산형(아세톡시) 실리콘 비교',
        p(
          'Curing chemistry determines odor, metal corrosion risk, cure speed, VOC level, and substrate suitability. The comparison below aligns with Dow’s Sealant Chemistries guide (Table I) and architectural product TDS summaries.',
          '실리콘의 경화 화학에 따라 냄새, 금속 부식 위험, 경화 속도, VOC, 적용 가능한 기재가 크게 달라집니다. 아래 비교표는 Dow 산업용 선정 가이드 표 I(실란트 화학) 및 건축용 제품 TDS 내용과 일치하도록 정리했습니다.',
        ),
        tbl(
          [
            bi('Criterion', '비교 항목'),
            bi('Neutral — Alkoxy (1-part)', '중성 — 알콕시 (1액형)'),
            bi('Neutral — Oxime (1-part)', '중성 — 옥심 (1액형)'),
            bi('Acid — Acetoxy (1-part)', '초산형 — 아세톡시 (1액형)'),
            bi('Neutral — Alkoxy (2-part)', '중성 — 알콕시 (2액형)'),
          ],
          [
            [
              bi('Cure by-product & odor', '경화 부산물·냄새'),
              bi('Neutral (alcohol-type); low odor', '중성(알코올계); 저취'),
              bi('Neutral (oxime-type); strong odor', '중성(옥심계); 강한 냄새'),
              bi('Acetic acid; strong vinegar-like odor', '소량의 아세트산 방출; 강한 식초 냄새'),
              bi('Neutral; low/no odor, low mixed VOC', '중성; 무취·저취, 혼합 시 저VOC'),
            ],
            [
              bi('Metal corrosion risk', '금속 부식성'),
              bi('Non-corrosive to anodized/coated aluminum & architectural metals', '비부식성 — 아노다이징·코팅 알루미늄 등 건축 금속에 적합'),
              bi('Avoids acid cure (verify sensitive metals per TDS)', '산 경화 회피 (민감 금속은 개별 TDS·상용성 확인)'),
              bi('Acidic; potentially corrosive to metals, especially in direct contact or enclosed spaces', '산성 — 특히 직접 접촉 또는 밀폐 공간에서 일부 금속 부식 가능'),
              bi('Non-corrosive by-product', '비부식성 경화 부산물'),
            ],
            [
              bi('Porous stone / staining', '석재·다공성 기재 오염'),
              bi('Neutral cure suits masonry, but porous stone requires ASTM C1248 low-staining grades (e.g., 977, 991)', '콘크리트·조적 적용 가능하나 화강석 등 다공성 석재에는 비오염 시험(ASTM C1248) 제품(977·991) 선정'),
              bi('Check individual TDS for porous stone suitability', '다공성 석재 적용 여부는 개별 TDS 확인 필요'),
              bi('Not suited for alkaline masonry or porous natural stone; for non-porous surfaces', '알칼리성 콘크리트·다공성 석재 비권장; 유리·세라믹 등 비다공성 표면 중심'),
              bi('Designed for factory glazing/IGU; verify stone compatibility per TDS', '공장 글레이징·복층유리 중심; 석재 접촉 시 개별 상용성 확인'),
            ],
            [
              bi('Surface cure speed (Dow Table I)', '표면 경화 속도 (Dow 표 I)'),
              bi('Slower (•)', '상대적으로 느림 (•)'),
              bi('Fast (••)', '빠름 (••)'),
              bi('Fastest (•••)', '가장 빠름 (•••)'),
              bi('Fast green strength (•••); through-cure independent of humidity', '빠른 그린 스트렝스 (•••); 내부까지 신속 경화'),
            ],
            [
              bi('VOC & clarity notes (Dow Table I)', 'VOC·투명도·보관 참고'),
              bi('Low VOC; clear/translucent options limited (LA); robust adhesion', '낮은 VOC; 투명도 확보 제한적(LA); 견고한 접착'),
              bi('Typically high VOC; clear/translucent available (••); 40°C storage can cause discoloration', '일반적으로 높은 VOC; 투명/반투명 가능(••); 고온(40°C) 보관 시 변색 주의'),
              bi('Clear available (••); good shelf life (•••); competitively priced vs. organics', '투명 가능(••); 우수한 유효기간(•••); 유기계 대비 경제적'),
              bi('Clear NA; requires metered mixing equipment; flammable catalyst in some grades', '투명 불가(NA); 정량·무기포 혼합 설비 필요'),
            ],
            [
              bi('Typical applications', '주요 적용 부위'),
              bi('Curtain wall, facade weathersealing, structural glazing (1-part), concrete & window perimeters', '커튼월·외장 웨더실링, 1액형 구조 글레이징, 콘크리트·창호 페리미터'),
              bi('Fast-cure or clear neutral sealing and formed-in-place gaskets', '빠른 경화나 투명도가 필요한 중성 실링·가스켓'),
              bi('Non-porous sanitary/wet areas (786+), high-temp flues/ovens (Hi-Temp), general glass/ceramic', '비다공성 욕실·위생(786+), 고온 오븐·연도(Hi-Temp), 일반 유리·세라믹'),
              bi('Factory curtain-wall unit glazing (983, 993), IGU secondary seal (939, 982), rapid repair (121)', '공장 커튼월 구조 접착(983·993), 복층유리 2차 씰(939·982), 현장 보수(121)'),
            ],
          ],
          {
            title: { en: 'Neutral (Alkoxy / Oxime / 2-Part) vs. Acetoxy Comparison', ko: '중성(알콕시·옥심·2액형) vs 초산형(아세톡시) 비교표' },
            big: true,
            note: {
              en: 'Dot ratings (• / •• / •••) and chemistry notes follow Dow Form No. 80-8283-01-0922 Table I. Always verify each product’s TDS for exact cure type and substrate limitations.',
              ko: '점 등급(• / •• / •••) 및 화학 특성은 Dow 선정 가이드(Form No. 80-8283-01-0922 표 I)를 따릅니다. 개별 건축 제품의 정확한 경화 방식과 제한 사항은 각 TDS를 확인하세요.',
            },
          },
        ),
      ),
      sec(
        'product-matching',
        'Quick DOWSIL™ Product Matching by Application',
        '시공 부위별 DOWSIL™ 추천 제품 빠른 매칭',
        p(
          'Every product below is listed in the KCT DOWSIL™ catalog with downloadable Dow TDS files. Structural glazing projects require design review and adhesion/compatibility testing by Dow technical staff.',
          '아래 제품은 모두 한국건설트레이딩(KCT) 카탈로그에 수록되어 TDS를 내려받을 수 있는 모델입니다. 구조 글레이징 적용은 반드시 Dow 기술진의 사전 검토가 필요합니다.',
        ),
        tbl(
          [
            bi('Application / Substrate', '시공 부위·기재'),
            bi('Cure / Type', '경화·유형'),
            bi('DOWSIL™ Models (Catalog)', '추천 DOWSIL™ 모델'),
            bi('Key TDS Highlight', '주요 TDS 특징'),
          ],
          [
            [
              bi('Curtain wall & facade weatherproofing', '커튼월·건물 외장 웨더실링'),
              bi('1-part neutral', '1액형 중성'),
              'DOWSIL™ 789, DOWSIL™ 791',
              bi('±50% movement; primerless adhesion on many substrates', '±50% 움직임 허용; 코팅 알루미늄·유리 등 광범위 접착'),
            ],
            [
              bi('1-part structural glazing / dual duty', '1액형 구조 글레이징 / 구조·내후성 겸용'),
              bi('1-part neutral', '1액형 중성'),
              'DOWSIL™ 995, DOWSIL™ 795',
              bi('995: high-strength structural; 795: ASTM C1184 structural + ±50% weatherseal', '995: 고강도 구조용; 795: ASTM C1184 구조 + ±50% 내후성 겸용'),
            ],
            [
              bi('Factory structural glazing / rapid repair', '공장 커튼월 구조용 / 현장 보수·재글레이징'),
              bi('2-part neutral', '2액형 중성'),
              'DOWSIL™ 983, DOWSIL™ 993, DOWSIL™ 121',
              bi('983/993: factory production (993 meets EOTA & GB 16776); 121: 24–48 h repair handling', '983·993: 공장 커튼월(993은 EOTA·GB 16776); 121: 24~48시간 보수 취급'),
            ],
            [
              bi('Natural stone, granite & metal panels', '천연석·화강석·금속 패널 외장'),
              bi('1-part neutral (low staining)', '1액형 중성 (비오염)'),
              'DOWSIL™ 977, DOWSIL™ 991',
              bi('Medium modulus, ±50% movement, ASTM C1248 staining: None', '중모듈러스, ±50% 움직임, ASTM C1248 석재 오염 None'),
            ],
            [
              bi('Concrete, masonry & residential windows', '콘크리트·조적·주거용 창호 페리미터'),
              bi('1-part neutral (low modulus)', '1액형 중성 (저모듈러스)'),
              'DOWSIL™ 813C, DOWSIL™ 1001',
              bi('±50% movement; 813C alkoxy low odor; 1001 KS F 4910 25LM', '±50% 움직임; 813C 알콕시 저취; 1001 창호 페리미터·KS F 4910 25LM'),
            ],
            [
              bi('General trade glazing & sealing', '일반 글레이징·전문 시공 범용'),
              bi('1-part neutral', '1액형 중성'),
              'DOWSIL™ Double-N',
              bi('General trade weathersealing & glazing in wide color range', '다양한 색상의 전문 시공용 범용 중성 실리콘'),
            ],
            [
              bi('Bathrooms, kitchens & sanitary wet areas', '욕실·주방·위생 설비 (곰팡이 저항)'),
              bi('Neutral (Sanitary) / Acetoxy (786+)', '중성(Sanitary) / 초산형(786+)'),
              'DOWSIL™ Sanitary, DOWSIL™ 786+',
              bi('Sanitary: neutral mildew-resistant; 786+: acetoxy for non-porous wet areas, FDA 21 CFR 177.2600', 'Sanitary: 중성 방곰팡이; 786+: 비다공성 위생용 초산형·FDA 21 CFR 177.2600'),
            ],
            [
              bi('Cleanrooms (low outgassing)', '클린룸·반도체/전자 (저휘발)'),
              bi('1-part neutral', '1액형 중성'),
              'DOWSIL™ SE 5088',
              bi('Low-molecular siloxane (D4–D10) 24 ppm; non-flow', '저분자 실록산(D4–D10) 24 ppm, 비흐름성'),
            ],
            [
              bi('Roads, bridges & concrete pavements', '도로·교량·콘크리트 포장 신축이음'),
              bi('1-part / 2-part civil silicone', '토목용 1액형·2액형'),
              'DOWSIL™ 888, DOWSIL™ 890-SL, DOWSIL™ 902 RCS',
              bi('+100/-50% movement; 888 non-sag, 890-SL & 902 RCS self-leveling', '+100/-50% 움직임; 888 비흐름성, 890-SL·902 RCS 자기수평'),
            ],
            [
              bi('Fire-rated joints / High-temp ovens & flues', '내화 조인트·관통부 / 고온 오븐·연도'),
              bi('Neutral (Firestop) / Acetoxy (Hi-Temp)', '중성 내화 / 초산 내열'),
              'DOWSIL™ FIRESTOP 700, DOWSIL™ Hi-Temp',
              bi('FIRESTOP 700: up to 240 min (joint dependent); Hi-Temp: 260°C continuous (288°C intermittent)', 'FIRESTOP 700: 최대 240분 내화(구성별); Hi-Temp: 연속 260°C(단속 288°C)'),
            ],
            [
              bi('Insulating glass units (IGU)', '복층유리 1차·2차 씰링'),
              bi('Butyl 1st / 2-part neutral 2nd', '부틸 1차 / 2액형 중성 2차'),
              'DOWSIL™ 335 Butyl, DOWSIL™ 939, DOWSIL™ 982',
              bi('335 primary PIB barrier; 939 residential 2nd; 982 structural-capable 2nd', '335 1차 부틸 씰; 939 주거용 2차; 982 구조 지지 가능 2차'),
            ],
            [
              bi('Adhesion primers', '접착 증진 프라이머'),
              bi('Moisture-cure silane / siloxane', '수분 경화 프라이머'),
              'DOWSIL™ 1200 OS, DOWSIL™ Primer-C',
              bi('1200 OS: multi-substrate; Primer-C: PVF2/Kynar coatings with 983/993/993N', '1200 OS: 금속·유리·석재 범용; Primer-C: 983·993 도장면 전용'),
            ],
          ],
          {
            title: { en: 'DOWSIL™ Architectural Product Matching Table', ko: '부위별 DOWSIL™ 제품 매칭표' },
            big: true,
          },
        ),
        h('Related Technical Guides & Product Pages', '관련 기술 가이드 및 제품 상세 페이지'),
        ul(
          [
            'Sealant chemistries comparison (Dow Table I): https://kconstrade.com/en/technical/industrial/sealant-chemistries',
            '실란트 화학 비교 (Dow 표 I): https://kconstrade.com/ko/technical/industrial/sealant-chemistries',
          ],
          [
            'Alkoxy neutral-cure sealants (industrial guide): https://kconstrade.com/en/technical/industrial/alkoxy-neutral-cure-sealants',
            '알콕시 중성 경화 실란트 (산업용 가이드): https://kconstrade.com/ko/technical/industrial/alkoxy-neutral-cure-sealants',
          ],
          [
            'Acetoxy sealants (industrial guide): https://kconstrade.com/en/technical/industrial/acetoxy-sealants',
            '아세톡시(초산형) 실란트 (산업용 가이드): https://kconstrade.com/ko/technical/industrial/acetoxy-sealants',
          ],
          [
            'Two-part alkoxy and one-part oxime sealants: https://kconstrade.com/en/technical/industrial/two-part-and-oxime-sealants',
            '2액형 알콕시·1액형 옥심 실란트: https://kconstrade.com/ko/technical/industrial/two-part-and-oxime-sealants',
          ],
          [
            'Sealant application, cure time & compatibility: https://kconstrade.com/en/technical/industrial/application-and-cure',
            '실란트 시공, 경화 시간 및 상용성: https://kconstrade.com/ko/technical/industrial/application-and-cure',
          ],
          [
            'DOWSIL™ structural vs. weatherproofing comparison: https://kconstrade.com/en/technical/selection/structural-vs-weatherproofing-sealants',
            'DOWSIL™ 구조용·내후성 실란트 8종 비교: https://kconstrade.com/ko/technical/selection/structural-vs-weatherproofing-sealants',
          ],
          prodLink('dowsil-789'),
          prodLink('dowsil-791'),
          prodLink('dowsil-795'),
          prodLink('dowsil-995'),
          prodLink('dowsil-977'),
          prodLink('dowsil-991'),
          prodLink('dowsil-813c'),
          prodLink('dowsil-sanitary'),
          prodLink('dowsil-786-plus'),
          prodLink('dowsil-1200-os'),
        ),
        KCT_SUPPORT_P,
      ),
      sec(
        'references',
        'References',
        '참고 출처',
        ul(
          [
            'Dow, “DOWSIL™ Silicone Sealants and Foams for Industrial, Appliance and Maintenance – Selection Guide”, Form No. 80-8283-01-0922 S2D (Table I Sealant Chemistries, Application and Cure).',
            'Dow, 「DOWSIL™ 산업·가전·유지보수용 실리콘 실란트 및 폼 – 선정 가이드」, Form No. 80-8283-01-0922 S2D (표 I 실란트 화학, 시공과 경화).',
          ],
          [
            'KCT DOWSIL™ Product Catalog & Dow Product Technical Data Sheets (lib/products-catalog.ts & /tds/*.pdf): DOWSIL™ 789, 791, 795, 995, 121, 977, 991, 813C, 1001, Double-N, Sanitary, 786+, SE 5088, 888, 890-SL, 902 RCS, 335, 939, 982, 983, 993, FIRESTOP 700, Hi-Temp, Primer-C, 1200 OS.',
            '한국건설트레이딩(KCT) DOWSIL™ 제품 카탈로그 및 각 제품 Dow TDS(lib/products-catalog.ts, /tds/*.pdf): DOWSIL™ 789·791·795·995·121·977·991·813C·1001·Double-N·Sanitary·786+·SE 5088·888·890-SL·902 RCS·335·939·982·983·993·FIRESTOP 700·Hi-Temp·Primer-C·1200 OS.',
          ],
        ),
      ),
    ],
    faq: [
      {
        q: { en: 'What are “builders silicone” and “neutral cure sealant” called in Korea?', ko: '한국 철물점이나 현장에서 “Builders silicone”과 “Neutral cure sealant”는 뭐라고 부르나요?' },
        a: {
          en: 'On Korean sites and hardware stores, “builders silicone” is typically called 건축용 실리콘 (or 코킹 / 실란트), and “neutral cure sealant” is called 중성 실리콘 or 비초산 실리콘 (meaning non-acetoxy).',
          ko: '한국 현장과 철물점에서는 Builders silicone을 보통 “건축용 실리콘”(또는 코킹·실란트)으로, Neutral cure sealant를 “중성 실리콘” 또는 “비초산 실리콘”으로 부릅니다.',
        },
      },
      {
        q: { en: 'Do “비초산 (non-acetoxy)” and “중성 (neutral cure)” mean the same thing?', ko: '‘비초산 실리콘’과 ‘중성 실리콘’은 같은 말인가요?' },
        a: {
          en: 'In everyday Korean construction terminology, yes — 비초산 (non-acetoxy) refers to neutral-cure silicones that do not release acetic acid. Technically, neutral cure includes sub-chemistries such as alkoxy (low odor, low VOC) and oxime (faster cure, stronger odor), so check the TDS for exact chemistry.',
          ko: '국내 실무에서는 사실상 같은 의미로 쓰이며, 아세트산을 방출하지 않는 중성 경화 실리콘을 뜻합니다. 다만 화학적으로는 저취·저VOC인 알콕시(Alkoxy)와 경화가 빠르고 냄새가 강한 옥심(Oxime)으로 나뉘므로 제품 TDS를 확인하는 것이 정확합니다.',
        },
      },
      {
        q: { en: 'Why should acetoxy silicone be avoided on aluminum windows or curtain walls?', ko: '알루미늄 창호나 커튼월에 초산형(아세톡시) 실리콘을 피해야 하는 이유는 무엇인가요?' },
        a: {
          en: 'Acetoxy silicone releases acetic acid during cure, which is acidic and potentially corrosive to metals—especially in direct contact or enclosed joints. Neutral-cure architectural silicones such as DOWSIL™ 789, 791, or 795 are designed for anodized and coated aluminum without corrosion.',
          ko: '초산형 실리콘은 경화 중 아세트산을 방출해 산성을 띠므로, 금속과 직접 닿거나 밀폐된 부위에서 부식을 유발할 수 있습니다. 아노다이징·코팅 알루미늄 창호와 커튼월에는 DOWSIL™ 789·791·795 같은 비부식성 중성 경화 제품을 사용합니다.',
        },
      },
      {
        q: { en: 'Can any neutral-cure silicone be used on natural stone such as granite or marble?', ko: '중성 실리콘이라면 화강석·대리석 같은 천연석에도 모두 사용할 수 있나요?' },
        a: {
          en: 'No. Even neutral-cure silicones can cause fluid migration staining on porous stone if not formulated for stone. Use low-staining neutral sealants tested to ASTM C1248 (None), such as DOWSIL™ 977 or DOWSIL™ 991, and confirm with a substrate test.',
          ko: '아닙니다. 중성 경화 제품이라도 다공성 석재에 오일 성분이 배어드는 유체 이행 오염이 생길 수 있습니다. 화강석·천연석 파사드에는 ASTM C1248 석재 오염 시험(None)을 통과한 DOWSIL™ 977이나 DOWSIL™ 991을 선택하고 사전 시험을 권장합니다.',
        },
      },
      {
        q: { en: 'What is the main difference between alkoxy and oxime neutral-cure silicones?', ko: '알콕시(Alkoxy)와 옥심(Oxime) 중성 실리콘의 주요 차이는 무엇인가요?' },
        a: {
          en: 'Per Dow’s Sealant Chemistries table, one-part alkoxy offers low VOC, low odor, and robust adhesion but cures more slowly with limited clear options; one-part oxime cures faster and offers clear/translucent versions, but has a stronger odor, typically higher VOC, and may discolor if stored at 40°C.',
          ko: 'Dow 실란트 화학 비교표 기준으로 1액형 알콕시는 저취·저VOC·견고한 접착이 장점이나 경화가 상대적으로 느리고 투명 제품이 제한적입니다. 반면 1액형 옥심은 경화가 빠르고 투명/반투명 구현이 유리하지만 냄새가 강하고 VOC가 높으며 고온(40°C) 보관 시 변색 우려가 있습니다.',
        },
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 3. 실리콘 실란트 소요량 계산 & 조인트 설계 가이드
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'sealant-consumption-guide',
    no: 3,
    pdfPages: '—',
    doc: '소요량 가이드',
    title: {
      en: 'Silicone Sealant Consumption Calculation & 2:1 Joint Design Guide',
      ko: '실리콘 실란트 소요량 계산법 & 조인트 폭:깊이 2:1 설계 가이드',
    },
    summary: {
      en: 'Step-by-step volume formula (width × depth × length), TDS-verified cartridge and sausage volumes, Dow 2:1 joint design rules, backer rod / bond breaker principles, and two double-checked worked examples with explicit loss-rate assumptions.',
      ko: '조인트 폭×깊이×길이 기반 실리콘 실란트 소요량 계산 공식, Dow TDS 확인 포장 용량, 2:1 조인트 설계 원칙, 로스율 가정을 명시한 검산 완료 계산 예시 2건을 정리했습니다.',
    },
    answer: {
      en: 'For a rectangular sealant joint, theoretical sealant volume in milliliters equals Joint Width (mm) × Joint Depth (mm) × Total Length (m), because 1 mm × 1 mm × 1 m = 1,000 mm³ = 1 mL. Divide total volume by the container’s net volume V_unit (mL) verified from the product TDS (or entered as a variable if unlisted), then add an assumed site loss allowance and round up. Per Dow weatherproofing TDS documents, ideal movement-joint width-to-depth ratio is about 2:1 with 6–12 mm sealant depth and minimum 6 mm width.',
      ko: '직사각형 단면 조인트에서 실리콘 실란트 이론 소요 부피(mL)는 조인트 폭(mm) × 깊이(mm) × 총 길이(m)와 같습니다(1 mm × 1 mm × 1 m = 1,000 mm³ = 1 mL). 총 부피를 제품 TDS에서 확인한 용기 용량 V_unit(mL)으로 나누고 현장 로스율 가정을 더해 올림하면 발주 추정 수량이 나옵니다. Dow 내후성 제품 TDS 기준 권장 조인트 비율은 폭:깊이 약 2:1, 실란트 깊이 6~12 mm, 최소 폭 6 mm입니다.',
    },
    image: IMG('ind-application'),
    sections: [
      sec(
        'formula',
        'Volume & Quantity Calculation Formula',
        '소요량 계산 공식 (폭 × 깊이 × 길이 → 부피)',
        p(
          'Because 1 mm × 1 mm × 1,000 mm (1 m) equals 1,000 mm³ = 1 cm³ = 1 mL, the theoretical sealant volume for a rectangular joint is computed directly without complex unit conversions.',
          '단위 환산상 1 mm × 1 mm × 1 m(1,000 mm) = 1,000 mm³ = 1 cm³ = 1 mL이므로, 직사각형 단면 조인트의 이론 필요 부피는 아래 공식으로 바로 계산할 수 있습니다.',
        ),
        ul(
          [
            'Volume per meter (mL/m) = Width W (mm) × Depth D (mm)',
            '1 m당 이론 부피 (mL/m) = 조인트 폭 W (mm) × 조인트 깊이 D (mm)',
          ],
          [
            'Total theoretical volume V_total (mL) = W (mm) × D (mm) × Total length L (m)',
            '총 이론 필요 부피 V_total (mL) = W (mm) × D (mm) × 총 조인트 길이 L (m)',
          ],
          [
            'Theoretical linear coverage per container (m/unit) = Container volume V_unit (mL) ÷ (W × D)',
            '용기 1개당 이론 시공 길이 (m/개) = 용기 용량 V_unit (mL) ÷ (W × D)',
          ],
          [
            'Estimated order quantity with assumed loss rate r = ceil( [V_total × (1 + r)] ÷ V_unit )',
            '로스율 가정(r)을 반영한 발주 추정 수량 (개) = 올림( [V_total × (1 + r)] ÷ V_unit )',
          ],
        ),
        note(
          'Loss-rate assumption notice: Dow TDS consumption tables (such as DOWSIL™ 789 Table 1 and FIRESTOP 700 Table 4) report theoretical geometric yield and state that actual usage varies with joint profile, backer rod placement, tooling, and site waste. Any loss rate (e.g., 10% or 15%) in calculations is an illustrative site assumption—not a fixed Dow specification.',
          '로스율 가정 주의: Dow TDS 소요량 표(DOWSIL™ 789 표 1, FIRESTOP 700 표 4 등)는 이론 기하학 기준이며, “조인트의 모습, 백업재의 배치, 툴링 및 현장에서의 소모량에 따라 실제 사용량은 달라질 수 있다”고 명시합니다. 계산 시 반영하는 10%·15% 등의 로스율은 현장 여건을 고려한 ‘예시 가정’이며 Dow의 고정 기준이 아닙니다.',
        ),
      ),
      sec(
        'packaging',
        'Container Volumes Confirmed in Catalog / Dow TDS (and Input Variable Rule)',
        '카탈로그·Dow TDS 확인 포장 용량 (미표기 시 입력 변수 안내)',
        p(
          'Container net volume (V_unit) differs by product and regional packaging—common cartridges are 300 mL or 310 mL, and foil sausages are 500 mL or 600 mL. Use only the volume verified in each product’s TDS; for models without a listed volume in the catalog summary, treat V_unit as a user-input variable and confirm the exact pack size with KCT before ordering.',
          '카트리지와 소시지 용량(V_unit)은 제품과 공급 지역에 따라 300 mL·310 mL 카트리지 또는 500 mL·600 mL 소시지 등으로 다릅니다. 아래 표는 KCT 카탈로그 및 수록된 Dow TDS PDF에서 직접 확인된 포장 정보만 정리한 것이며, 표에 없는 모델이나 지역별 포장 사양은 사용자 입력 변수(V_unit)로 두고 발주 전 KCT에 확인해 주세요.',
        ),
        tbl(
          [
            bi('Product', '제품'),
            bi('Packaging confirmed in catalog / Dow TDS', '카탈로그·Dow TDS 확인 포장'),
            bi('Source (Form No.)', '확인 출처 (Form No.)'),
          ],
          [
            ['DOWSIL™ 789', bi('300 mL cartridge · 500 mL foil sausage', '300 mL 카트리지 · 500 mL 호일 소시지'), 'Dow TDS (63-1244-43-0725 S2D)'],
            ['DOWSIL™ 791', bi('300 mL cartridge · 500 mL foil sausage', '300 mL 카트리지 · 500 mL 포일 소시지'), 'Dow TDS (63-6149-43-0325 S2D)'],
            ['DOWSIL™ 795', bi('300 mL cartridge · 600 mL foil sausage', '300 mL 카트리지 · 600 mL 호일 소시지'), 'Dow TDS (63-1217-43-0124 S2D)'],
            ['DOWSIL™ 995', bi('300 mL cartridge', '300 mL 카트리지'), 'Dow TDS (63-6337-43 A)'],
            ['DOWSIL™ 977', bi('300 mL cartridge · 500 mL sausage', '300 mL 카트리지 · 500 mL 소시지'), 'Dow TDS (62-2002-01 B)'],
            ['DOWSIL™ 991', bi('500/600 mL Turbo foil sausages', '500/600 mL 터보 포일 소시지'), 'Dow TDS (63-1072-01-0226 S2D)'],
            ['DOWSIL™ 813C', bi('310 mL cartridge (12/box) · 600 mL sausage (20/box)', '310 mL 카트리지(12개/박스) · 600 mL 소시지(20개/박스)'), 'Dow TDS (62-1451-01-1124 S2D)'],
            ['DOWSIL™ 1001', bi('300 mL cartridge · 500 mL foil', '300 mL 카트리지 · 500 mL 포일'), 'Dow TDS (/tds/dowsil-1001.pdf)'],
            ['DOWSIL™ FIRESTOP 700', bi('310 mL cartridge (12/box) · 20 L pail', '310 mL 카트리지(12개/박스) · 20 L 페일'), 'Catalog & Dow TDS (62-0905-01-1020 S2D)'],
            ['DOWSIL™ 786+', bi('310 mL cartridge (12/box)', '310 mL 카트리지(12개/박스)'), 'Dow TDS (62-2298-01-0425 S2D)'],
            [
              bi('Other models / custom supply', '기타 모델·드럼·특수 포장'),
              bi('Enter actual net volume V_unit as a variable — confirm with KCT', '실제 용기 정미 용량(V_unit)을 입력 변수로 계산 — KCT 문의 확인'),
              bi('KCT quotation', 'KCT 견적 확인'),
            ],
          ],
          {
            title: { en: 'TDS-Verified Packaging Sizes for Key Architectural Sealants', ko: '주요 건축용 실란트 TDS 확인 포장 단위' },
            note: {
              en: 'Box quantities and pack availability in Korea may vary by supply lot; confirm exact packaging when requesting a quote.',
              ko: '박스당 수량과 국내 공급 포장 형태는 시점·로트에 따라 달라질 수 있으므로 발주 전 KCT에 확인해 주세요.',
            },
          },
        ),
        tbl(
          [
            bi('Joint W × D (mm)', '조인트 폭 × 깊이 (mm)'),
            bi('Theoretical vol. (mL/m)', '1 m당 이론 부피 (mL/m)'),
            bi('Per 300 mL (m)', '300 mL당 (m)'),
            bi('Per 310 mL (m)', '310 mL당 (m)'),
            bi('Per 500 mL (m)', '500 mL당 (m)'),
            bi('Per 600 mL (m)', '600 mL당 (m)'),
          ],
          [
            ['6 × 6', '36', '8.33', '8.61', '13.89', '16.67'],
            ['10 × 6', '60', '5.00', '5.17', '8.33', '10.00'],
            ['12 × 6', '72', '4.17', '4.31', '6.94', '8.33'],
            ['15 × 8', '120', '2.50', '2.58', '4.17', '5.00'],
            ['16 × 8', '128', '2.34', '2.42', '3.91', '4.69'],
            ['20 × 10', '200', '1.50', '1.55', '2.50', '3.00'],
            ['25 × 12', '300', '1.00', '1.03', '1.67', '2.00'],
          ],
          {
            title: { en: 'Quick Reference: Theoretical Linear Meters per Container (Before Site Loss)', ko: '빠른 참조표: 조인트 규격별 용기 1개당 이론 시공 길이 (로스 미포함)' },
            note: {
              en: 'Pure theoretical geometric yield = V_unit ÷ (W × D), rounded to 2 decimal places. Does not include site waste, concave tooling profile, or irregular joint cavities.',
              ko: '순수 이론 기하학 값 = V_unit ÷ (W × D) (소수 둘째 자리 반올림). 현장 로스, 오목 툴링 형상, 불규칙한 조인트 단면은 포함되지 않았습니다.',
            },
          },
        ),
      ),
      sec(
        'joint-design',
        'Joint Width-to-Depth Design Principles (Dow TDS Summary)',
        '조인트 폭:깊이 설계 원칙 및 3면 접착 방지 (Dow TDS 기준)',
        p(
          'A thinner sealant bead accommodates more joint movement than an overly thick bead. The guidelines below summarize dimensions explicitly stated in Dow’s architectural TDS documents.',
          '실란트는 지나치게 두껍게 시공할 때보다 적절한 얇은 두께로 시공할 때 조인트 움직임을 더 잘 수용합니다. 아래 기준은 Dow 건축용 실란트 TDS에서 확인된 범위만 정리한 것입니다.',
        ),
        ul(
          [
            'Weatherproofing 2:1 ratio & depth range (DOWSIL™ 789, 977, 991 TDS): Ideal width-to-depth ratio is about 2:1. Sealant depth over the backer rod should be 6–12 mm, with a minimum joint width of 6 mm (for joints wider than 25 mm in DOWSIL™ 977 TDS, hold sealant depth at 12 mm for optimum movement capability).',
            '내후성 조인트 폭:깊이 2:1 및 깊이 범위(DOWSIL™ 789·977·991 TDS): 이상적인 폭:깊이 비율은 약 2:1이며, 백업재 위 실란트 깊이는 6~12 mm, 최소 조인트 폭은 6 mm입니다(DOWSIL™ 977 TDS 기준 폭 25 mm 초과 시 최적 움직임 수용을 위해 깊이 12 mm 유지).',
          ],
          [
            'Narrow & fillet joint rule (DOWSIL™ 813C, 786+ TDS): Minimum width 6 mm; for 6–12 mm wide joints, maintain 6 mm depth; above 12 mm width, use a 2:1 width-to-depth ratio. For fillet joints, provide at least 6 mm sealant bite to each substrate. For 813C joints wider than 25 mm or deeper than 15 mm, consult technical service.',
            '협소·필렛 조인트 기준(DOWSIL™ 813C·786+ TDS): 최소 폭 6 mm, 폭 6~12 mm 구간은 깊이 6 mm를 유지하고 폭 12 mm 초과 시 폭:깊이 2:1을 적용합니다. 필렛 조인트는 양 기재에 최소 6 mm 이상 접착 폭을 확보하며, 813C에서 폭 25 mm 초과 또는 깊이 15 mm 초과는 기술 지원 문의가 필요합니다.',
          ],
          [
            'Prevent three-sided adhesion (backer rod & bond breaker): Install closed-cell polyethylene backer rod (or approved backing) to control joint depth, provide tooling back pressure, and allow free extension/compression. Where a joint is too shallow for a backer rod, apply low-tack polyethylene bond-breaker tape at the joint bottom.',
            '3면 접착 방지(백업재·본드 브레이커): 비통기성 폴리에틸렌 백업로드(closed-cell PE backer rod) 등으로 깊이를 제어하고 툴링 배압을 확보해 실란트가 바닥면에 붙지 않고 자유롭게 신축하게 합니다. 조인트가 얕아 백업재를 넣기 어려우면 바닥면에 저점착 폴리에틸렌 본드 브레이커 테이프를 붙입니다.',
          ],
          [
            'Structural glazing joints (DOWSIL™ 795, 995 TDS): Structural bite and depth must be calculated specifically for design wind/seismic loads (minimum 6 mm width and depth in DOWSIL™ 795 TDS; max 12 mm depth for one-side air-exposed field cure, or up to 24 mm only with air-permeable backing where approved). All structural glazing joint designs require review by Dow technical staff.',
            '구조 글레이징 조인트 별도 기준(DOWSIL™ 795·995 TDS): 구조용 접착 폭과 깊이는 설계 풍하중·지진 변위에 따라 별도 산정해야 합니다(DOWSIL™ 795 TDS 기준 폭·깊이 최소 6 mm, 현장 1면 공기 노출 시 최대 깊이 12 mm, 공기투과성 백업재 적용 시 조건부 최대 24 mm). 모든 구조용 설계는 Dow 기술진 검토가 필수입니다.',
          ],
          [
            'Primer coverage note: If adhesion testing shows a primer is required, estimate primer separately. For example, DOWSIL™ Primer-C TDS lists non-porous coverage of approximately 800 ft²/gal (or 10,000 ft/gal linear for a 1/2" wide joint using a lint-free cloth; brush application reduces coverage). For other primers such as DOWSIL™ 1200 OS, confirm consumption by substrate porosity and trial wipe.',
            '프라이머 도포량 참고: 접착 시험 결과 프라이머가 필요한 경우 별도 산출합니다. 확인된 예로 DOWSIL™ Primer-C TDS는 비다공성 기재 약 800 ft²/gal(1/2인치 폭 선형 기준 10,000 ft/gal, 보풀 없는 천 도포 기준; 브러시 사용 시 도포량 감소)을 제시합니다. DOWSIL™ 1200 OS 등 기타 프라이머 소요량은 기재 다공성과 시험 도포로 확인합니다.',
          ],
        ),
      ),
      sec(
        'examples',
        'Two Worked Consumption Examples (Double-Checked)',
        '소요량 계산 예시 2건 (수식·검산 완료)',
        h('Example 1: Curtain-Wall Weatherproofing Joint (600 mL Foil Sausage)', '예시 1: 커튼월 외장 내후성 조인트 (600 mL 소시지 기준)'),
        p(
          'Scenario: Joint width W = 16 mm, depth D = 8 mm (2:1 ratio, within 6–12 mm), total length L = 250 m, using DOWSIL™ 795 600 mL foil sausages (V_unit = 600 mL, confirmed in TDS), with an illustrative site loss-rate assumption of 10% (r = 0.10).',
          '조건: 조인트 폭 W = 16 mm, 깊이 D = 8 mm (폭:깊이 2:1, 깊이 6~12 mm 범위), 총 길이 L = 250 m, 제품 포장 DOWSIL™ 795 600 mL 호일 소시지(V_unit = 600 mL, TDS 확인), 현장 로스율 가정 10% (r = 0.10, 예시 가정).',
        ),
        ul(
          [
            '1) Volume per meter: 16 mm × 8 mm = 128 mL/m',
            '1) 1 m당 이론 부피: 16 mm × 8 mm = 128 mL/m',
          ],
          [
            '2) Total theoretical volume: 128 mL/m × 250 m = 32,000 mL (= 32.0 L)',
            '2) 총 이론 부피: 128 mL/m × 250 m = 32,000 mL (= 32.0 L)',
          ],
          [
            '3) Theoretical length per 600 mL sausage: 600 ÷ 128 = 4.6875 m (approx. 4.69 m)',
            '3) 600 mL 소시지 1개당 이론 시공 길이: 600 ÷ 128 = 4.6875 m (약 4.69 m)',
          ],
          [
            '4) Theoretical sausage count: 32,000 ÷ 600 = 53.33 pcs (rounded up: 54 pcs)',
            '4) 이론 필요 수량: 32,000 ÷ 600 = 53.33개 (올림 54개)',
          ],
          [
            '5) With 10% assumed loss: 32,000 × 1.10 = 35,200 mL → 35,200 ÷ 600 = 58.67 pcs → Order estimate: 59 sausages (600 mL)',
            '5) 로스율 10% 가정 반영: 32,000 × 1.10 = 35,200 mL → 35,200 ÷ 600 = 58.67개 → 발주 추정 수량: 59개 (600 mL 소시지)',
          ],
        ),
        h('Example 2: Linear Fire-Rated Joint (310 mL Cartridge, 12 pcs/box)', '예시 2: 선형 내화 조인트 (310 mL 카트리지, 12개/박스 기준)'),
        p(
          'Scenario: Joint width W = 10 mm, depth D = 10 mm (a joint size listed in DOWSIL™ FIRESTOP 700 TDS Table 4; actual firestop depth must follow the tested fire-rating assembly), total length L = 120 m, using 310 mL cartridges packed 12 per box (confirmed in catalog & TDS), with an illustrative site loss-rate assumption of 15% (r = 0.15).',
          '조건: 조인트 폭 W = 10 mm, 깊이 D = 10 mm (DOWSIL™ FIRESTOP 700 TDS 표 4 수록 규격 중 하나; 실제 내화 깊이는 목표 내화 등급 시험 구성에 따름), 총 길이 L = 120 m, 310 mL 카트리지 12개/박스(카탈로그·TDS 확인), 현장 로스율 가정 15% (r = 0.15, 예시 가정).',
        ),
        ul(
          [
            '1) Volume per meter: 10 mm × 10 mm = 100 mL/m',
            '1) 1 m당 이론 부피: 10 mm × 10 mm = 100 mL/m',
          ],
          [
            '2) Total theoretical volume: 100 mL/m × 120 m = 12,000 mL (= 12.0 L)',
            '2) 총 이론 부피: 100 mL/m × 120 m = 12,000 mL (= 12.0 L)',
          ],
          [
            '3) Theoretical length per 310 mL cartridge: 310 ÷ 100 = 3.10 m (matches 3.1 m in FIRESTOP 700 TDS Table 4)',
            '3) 310 mL 카트리지 1개당 이론 시공 길이: 310 ÷ 100 = 3.10 m (FIRESTOP 700 TDS 표 4 기재값 3.1 m와 일치)',
          ],
          [
            '4) Theoretical cartridge count: 12,000 ÷ 310 = 38.71 pcs (rounded up: 39 pcs)',
            '4) 이론 필요 수량: 12,000 ÷ 310 = 38.71개 (올림 39개)',
          ],
          [
            '5) With 15% assumed loss: 12,000 × 1.15 = 13,800 mL → 13,800 ÷ 310 = 44.52 pcs → Order estimate: 45 cartridges (4 boxes = 48 pcs at 12/box)',
            '5) 로스율 15% 가정 반영: 12,000 × 1.15 = 13,800 mL → 13,800 ÷ 310 = 44.52개 → 발주 추정 수량: 45개 (12개/박스 기준 4박스 = 48개 검토)',
          ],
        ),
      ),
      sec(
        'cta',
        'Request a Project Quantity Check & Quotation',
        '산출 물량으로 KCT B2B 견적 요청하기',
        p(
          'Once you have your joint dimensions and total length, send your estimated quantity—or raw joint measurements—to Korea Construction Trading (KCT) to confirm current packaging, box counts, and delivery schedule.',
          '조인트 규격과 총 길이로 산출한 예상 수량(또는 도면상 조인트 치수·연장)을 한국건설트레이딩(KCT)에 보내주시면 제품별 실제 포장 단위, 박스 수량, 납기 조건을 반영한 견적을 안내해 드립니다.',
        ),
        KCT_SUPPORT_P,
        ul(
          [
            'B2B online quotation page: https://kconstrade.com/en/quote',
            'B2B 온라인 견적서 페이지: https://kconstrade.com/ko/quote',
          ],
          [
            'Export inquiry page (overseas projects): https://kconstrade.com/en/export',
            '해외 프로젝트 수출 문의: https://kconstrade.com/ko/export',
          ],
          [
            'How to buy DOWSIL™ in Korea: https://kconstrade.com/en/technical/selection/buy-dowsil-in-korea',
            '한국 DOWSIL™ 구매·견적·수출 안내: https://kconstrade.com/ko/technical/selection/buy-dowsil-in-korea',
          ],
          [
            'Surface preparation guide: https://kconstrade.com/en/technical/industrial/surface-preparation',
            '실리콘 접착을 위한 표면 준비 가이드: https://kconstrade.com/ko/technical/industrial/surface-preparation',
          ],
          [
            'Primers and cleaners guide: https://kconstrade.com/en/technical/industrial/primers-and-cleaners',
            '프라이머 및 세정제 가이드: https://kconstrade.com/ko/technical/industrial/primers-and-cleaners',
          ],
          prodLink('dowsil-789'),
          prodLink('dowsil-791'),
          prodLink('dowsil-795'),
          prodLink('dowsil-995'),
          prodLink('dowsil-991'),
          prodLink('dowsil-813c'),
          prodLink('dowsil-firestop-700'),
          prodLink('dowsil-primer-c'),
          prodLink('dowsil-1200-os'),
        ),
      ),
      sec(
        'references',
        'References',
        '참고 출처',
        ul(
          [
            'Dow Technical Data Sheets (/tds/*.pdf): DOWSIL™ 789 (Form No. 63-1244-43-0725 S2D, Table 1 & joint design), DOWSIL™ 791 (63-6149-43-0325 S2D), DOWSIL™ 795 (63-1217-43-0124 S2D), DOWSIL™ 977 (62-2002-01 B), DOWSIL™ 991 (63-1072-01-0226 S2D), DOWSIL™ 995 (63-6337-43 A), DOWSIL™ 813C (62-1451-01-1124 S2D), DOWSIL™ FIRESTOP 700 (62-0905-01-1020 S2D, Table 4), DOWSIL™ 786+ (62-2298-01-0425 S2D), DOWSIL™ Primer-C (63-1079-01-0623A S2D).',
            'Dow 제품 기술 데이터시트(/tds/*.pdf): DOWSIL™ 789(Form No. 63-1244-43-0725 S2D, 표 1 및 조인트 설계), 791(63-6149-43-0325 S2D), 795(63-1217-43-0124 S2D), 977(62-2002-01 B), 991(63-1072-01-0226 S2D), 995(63-6337-43 A), 813C(62-1451-01-1124 S2D), FIRESTOP 700(62-0905-01-1020 S2D, 표 4), 786+(62-2298-01-0425 S2D), Primer-C(63-1079-01-0623A S2D).',
          ],
          [
            'KCT DOWSIL™ Product Catalog (lib/products-catalog.ts) & Dow Industrial Selection Guide (Form No. 80-8283-01-0922 S2D, Surface Preparation & Primers).',
            '한국건설트레이딩(KCT) DOWSIL™ 제품 카탈로그(lib/products-catalog.ts) 및 Dow 산업용 선정 가이드(Form No. 80-8283-01-0922 S2D, 표면 준비·프라이머).',
          ],
        ),
      ),
    ],
    faq: [
      {
        q: { en: 'Why does Width (mm) × Depth (mm) × Length (m) directly give milliliters (mL)?', ko: '조인트 폭(mm) × 깊이(mm) × 길이(m)가 왜 바로 mL가 되나요?' },
        a: {
          en: 'Because 1 m equals 1,000 mm, so 1 mm × 1 mm × 1 m = 1,000 mm³ = 1 cm³ = 1 mL. Multiplying W (mm) × D (mm) × L (m) gives the exact theoretical volume in mL for a rectangular joint.',
          ko: '1 m는 1,000 mm이므로 1 mm × 1 mm × 1 m = 1,000 mm³ = 1 cm³ = 1 mL가 됩니다. 따라서 직사각형 단면 조인트는 폭(mm) × 깊이(mm) × 길이(m)로 이론 부피(mL)를 바로 구할 수 있습니다.',
        },
      },
      {
        q: { en: 'How many linear meters does one 600 mL sausage cover?', ko: '600 mL 소시지 1개로 보통 몇 미터(m)를 시공할 수 있나요?' },
        a: {
          en: 'It depends on joint cross-section. Theoretically (before site loss), 600 mL covers 10.00 m at 10×6 mm, 4.69 m at 16×8 mm, and 3.00 m at 20×10 mm. Always confirm whether your chosen DOWSIL™ model is supplied in 500 mL or 600 mL sausages and allow for site loss.',
          ko: '조인트 단면에 따라 달라집니다. 이론값(로스 미포함)으로 600 mL 1개는 10×6 mm 기준 10.00 m, 16×8 mm 기준 4.69 m, 20×10 mm 기준 3.00 m입니다. 제품에 따라 500 mL 또는 600 mL 소시지로 공급되므로 TDS와 현장 로스를 함께 반영하세요.',
        },
      },
      {
        q: { en: 'Why is a 2:1 width-to-depth ratio recommended for weatherproofing joints?', ko: '내후성 조인트에서 폭:깊이 2:1 비율을 권장하는 이유는 무엇인가요?' },
        a: {
          en: 'Dow TDS guidelines note that a thinner sealant bead accommodates more joint movement than a thick bead. Keeping depth between 6 and 12 mm at roughly a 2:1 width-to-depth ratio (with a backer rod to prevent three-sided adhesion) reduces peel stress during expansion and contraction.',
          ko: 'Dow TDS에 따르면 실란트는 두꺼울 때보다 적절한 얇은 두께일 때 조인트 움직임을 더 잘 수용합니다. 백업재로 3면 접착을 막고 폭:깊이 약 2:1(깊이 6~12 mm)을 유지하면 신축 시 접착면 응력을 줄일 수 있습니다.',
        },
      },
      {
        q: { en: 'What loss rate should I assume when ordering silicone sealant?', ko: '발주 시 로스율은 몇 %로 잡아야 하나요?' },
        a: {
          en: 'Dow TDS documents do not set a single fixed loss percentage because actual consumption depends on joint irregularity, backer rod depth, tooling, and nozzle/gun residue. Common estimating practice adds an assumed allowance (for example, 10–15% as an assumption), adjusted for site conditions.',
          ko: 'Dow TDS에는 고정된 로스율이 정해져 있지 않으며, 조인트 불균일·백업재 깊이·툴링·노즐 잔량에 따라 달라집니다. 실무에서는 현장 여건에 맞춰 10~15% 등의 여유율을 ‘가정’해 반영하며, 불규칙한 보수 현장은 더 넉넉히 검토합니다.',
        },
      },
      {
        q: { en: 'Can I use the same 2:1 rule for structural glazing or fire-rated joints?', ko: '구조 글레이징이나 내화 조인트에도 2:1 비율을 그대로 적용하면 되나요?' },
        a: {
          en: 'No. Structural glazing joint bite and depth must be engineered for wind and design loads and reviewed by Dow technical staff. Fire-rated joints (such as DOWSIL™ FIRESTOP 700) must follow the exact tested depth and backing configuration for the required fire rating.',
          ko: '아니요. 구조 글레이징은 풍하중·설계 하중에 따른 별도 계산과 Dow 기술진 검토가 필수입니다. 내화 조인트(DOWSIL™ FIRESTOP 700 등) 역시 목표 내화 등급(E·EI)을 취득한 시험 구성의 실란트 깊이와 백업재 규격을 그대로 따라야 합니다.',
        },
      },
    ],
  },
]

export const META: Record<string, { title: { ko: string; en: string }; description: { ko: string; en: string } }> = {
  'selection/buy-dowsil-in-korea': {
    title: {
      ko: 'DOWSIL 다우실 국내 구매·견적·수출 안내 | KCT',
      en: 'How to Buy DOWSIL™ in Korea: B2B & Export | KCT',
    },
    description: {
      ko: '한국에서 DOWSIL(다우실) 실리콘 실란트를 구매하는 방법을 안내합니다. 소량 스마트스토어, 국내 B2B 견적 요청 정보 4가지, 해외 수출(FOB·CIF·EXW) 조건을 정리했습니다.',
      en: 'How to buy DOWSIL™ silicone sealants in Korea via Korea Construction Trading (KCT): small orders, domestic B2B quotes and export terms (FOB/CIF/EXW).',
    },
  },
  'selection/silicone-sealant-glossary-neutral-vs-acetoxy': {
    title: {
      ko: '건축용 실리콘 한·영 용어 30선 & 중성 vs 초산 | KCT',
      en: 'Silicone Glossary (30 Terms): Neutral vs. Acetoxy | KCT',
    },
    description: {
      ko: '건축용 실리콘 한·영 핵심 용어 30개 대조표와 중성(알콕시·옥심) vs 초산형(아세톡시) 실리콘 비교, 부위별 DOWSIL 추천 제품을 정리했습니다.',
      en: 'Korean-English architectural silicone glossary (30 terms), neutral-cure (alkoxy/oxime) vs. acetoxy comparison, and DOWSIL™ product matching by use.',
    },
  },
  'selection/sealant-consumption-guide': {
    title: {
      ko: '실리콘 실란트 소요량 계산법 · 조인트 폭·깊이 기준 | KCT',
      en: 'Silicone Sealant Consumption & 2:1 Joint Guide | KCT',
    },
    description: {
      ko: '조인트 폭·깊이·길이 기반 실리콘 실란트 소요량 계산 공식, Dow TDS 폭:깊이 2:1 설계 기준, 포장 용량별 참고표와 검산된 계산 예시 2건을 정리했습니다.',
      en: 'Calculate silicone sealant volume from joint width, depth and length with Dow TDS 2:1 joint design rules, container sizes and two worked examples.',
    },
  },
}
