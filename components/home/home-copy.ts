import type { CategoryKey } from '@/lib/products-catalog';

export type Lang = 'ko' | 'en' | 'ja';

export const FEATURED_SLUGS = [
  'dowsil-993',
  'dowsil-995',
  'dowsil-795',
  'dowsil-789',
  'dowsil-791',
  'dowsil-983',
  'dowsil-650-plus',
  'dowsil-firestop-700',
] as const;

export const FEATURED_IMG_DIMS: Record<string, readonly [number, number]> = {
  '/assets/img/dow/995-cartridge-800.jpg': [800, 800],
  '/assets/img/dow/795-cartridge-sausage-800.jpg': [800, 800],
  '/assets/img/dow/789-cartridge-sausage-800.jpg': [800, 800],
  '/assets/img/dow/791-cartridge-sausage-800.jpg': [800, 800],
  '/assets/img/dow/983-curing-agent-600.jpg': [540, 540],
  '/assets/img/dow/650-plus-drum-600.jpg': [510, 510],
  '/assets/img/dow/firestop-700-cartridge-600.jpg': [600, 600],
  '/assets/img/logo/Dow_Chemical_Company_logo.svg': [598, 210],
};

export const HUB_ORDER = ['fire', 'selection', 'psa', 'basics', 'tapes', 'industrial'] as const;

export const CAT_JA: Record<CategoryKey, { label: string; eyebrow: string; lead: string; roles: string[] }> = {
  building: {
    label: '建築外装',
    eyebrow: 'カーテンウォール・窓枠・外壁',
    lead: '建物外皮のガラス・金属・石材ジョイントを接着し、雨風から守ります。',
    roles: ['構造グレージング', '耐候性シーリング', '石材・金属パネル', 'コンクリート・組積', '窓枠・内装'],
  },
  gmp: {
    label: 'GMP・衛生',
    eyebrow: 'クリーンルーム・食品・衛生',
    lead: '清浄度が求められる空間でカビ・細菌やパーティクル発生を抑えるシーラントです。',
    roles: ['衛生シーリング', 'クリーンルーム'],
  },
  civil: {
    label: '土木用',
    eyebrow: '道路・橋梁・舗装',
    lead: '道路や橋梁の伸縮目地、コンクリート舗装ジョイントをシーリングします。',
    roles: ['橋梁・高速道路目地', 'コンクリート舗装目地'],
  },
  igu: {
    label: '複層ガラス',
    eyebrow: '複層ガラス・構造接着',
    lead: '複層ガラススペーサー周辺の1次・2次シールおよびユニット構造接着に対応します。',
    roles: ['1次シール', '2次シール', '工場グレージング・規格対応'],
  },
  special: {
    label: '特殊用途',
    eyebrow: '耐火・耐熱・コーティング',
    lead: '耐火、高温、防水、補修・仮保護など一般シーラントで対応が難しい用途向けです。',
    roles: ['耐火', '耐熱', '防水コーティング', '補修・改修', '手すり・仮保護'],
  },
  primer: {
    label: 'プライマー',
    eyebrow: '接着促進',
    lead: '難接着基材に下塗りすることで、シーラントやコーティングの密着性を高めます。',
    roles: ['塗装基材向け', 'コーティング・汎用'],
  },
};

export const JA_SUMMARY: Record<string, string> = {
  'dowsil-993': '欧州(EOTA)・中国GB規格対応 2液型構造用シーラント',
  'dowsil-995': '高強度ストラクチュラル・グレージング用 1液型中性シーラント',
  'dowsil-795': '構造用・±50%耐候性兼用 1液型中性シーラント',
  'dowsil-789': 'プライマー不要で接着する1液型中性耐候性シーラント',
  'dowsil-791': 'カーテンウォール・外装ウェザーシーリング用1液型中性シーラント',
  'dowsil-983': '工場グレージング・カーテンウォール生産用 2液型構造用シーラント',
  'dowsil-650-plus': 'ファサードガラス・金属の一時保護用剥離コーティング',
  'dowsil-firestop-700': '屋内外のリニアジョイント・貫通部用 耐火シリコーン',
};

export const HUB_JA: Record<string, { title: string; desc: string }> = {
  fire: {
    title: '耐火シーラント技術マニュアル',
    desc: '火災反応性・耐火性能、リニアジョイント・貫通部試験、煙制御、施工指針',
  },
  selection: {
    title: 'DOWSIL™ シーラント比較・選定ガイド',
    desc: '構造用・耐候性・複層ガラス用シーラント13種をTDS基準で比較',
  },
  psa: {
    title: 'シリコーン粘着剤(PSA)選定ガイド',
    desc: '2024年最新版を含むPSA 41種の仕様・選定・塗工・硬化・剥離ガイド',
  },
  basics: {
    title: 'シリコーン基礎教育',
    desc: 'シリコーンの化学・製造・特性・応用および付録データ',
  },
  tapes: {
    title: '電気・電子テープ用シリコーンPSA',
    desc: '絶縁テープ用Dow粘着剤20種、選定表、KCT技術サポート案内',
  },
  industrial: {
    title: '産業・家電・メンテナンス用選定ガイド',
    desc: 'アセトキシ・アルコキシ・オキシム・ホットメルト・シリコーンフォーム38製品',
  },
};

export interface HomeFaqItem {
  q: string;
  a: string;
}

export function getHomeFaqs(lang: Lang, productCount: number): HomeFaqItem[] {
  if (lang === 'en') {
    return [
      {
        q: 'What DOWSIL™ products do you supply?',
        a: `Korea Construction Trading (KCT) supplies ${productCount} Dow DOWSIL™ silicone products — including structural glazing, weatherproofing, fire-rated, insulating glass, civil engineering, GMP/hygienic sealants, and primers — with TDS documentation available (instant download for approved members or email delivery on request).`,
      },
      {
        q: 'Do you export architectural silicone globally?',
        a: 'Yes. We export Dow DOWSIL™ architectural and structural silicone sealants to overseas buyers in Japan, Taiwan, Southeast Asia, and other regions with full export documentation.',
      },
      {
        q: 'How can I purchase or request a quotation?',
        a: 'Contact us by phone, email, WhatsApp, or our quotation page with the product model and quantity needed. Our team will confirm stock, lead time, and pricing within 24 hours.',
      },
      {
        q: 'Are there benefits for B2B bulk orders?',
        a: 'Yes. We offer B2B wholesale pricing, multi-site split delivery, tax invoices, and technical documentation (TDS/SDS) support for construction projects and international buyers.',
      },
    ];
  }
  if (lang === 'ja') {
    return [
      {
        q: 'どのようなDOWSIL™製品を取り扱っていますか？',
        a: `韓国建設トレーディング(KCT)は、構造用・耐候性・耐火・複層ガラス・土木・GMP衛生用シーラントおよびプライマーなどDow DOWSIL™製品${productCount}種を取り扱い、製品別TDS資料を提供しています。`,
      },
      {
        q: '海外への輸出に対応していますか？',
        a: 'はい。日本・台湾・東南アジアをはじめとする海外バイヤーへ建築用・構造用シリコーンシーラントを輸出しており、輸出書類の作成まで一括対応しています。',
      },
      {
        q: '購入や見積依頼はどのように行えますか？',
        a: 'お電話、メール、WhatsApp、または見積書ページよりご希望の製品名と数量をお知らせください。在庫・納期・単価を確認のうえ迅速にご案内します。',
      },
      {
        q: 'B2B大量購入のサポートはありますか？',
        a: 'はい。プロジェクト規模に応じたB2B特別単価、複数現場への分割配送、TDSなどの技術資料サポートをご提供しています。',
      },
    ];
  }
  return [
    {
      q: '어떤 DOWSIL(다우실) 제품을 취급하나요?',
      a: `한국건설트레이딩(KCT)은 Dow DOWSIL(다우실) 구조용·내후성·내화·복층유리·토목·GMP·특수 실란트와 프라이머 ${productCount}종을 전문 공급하며, 각 제품별 TDS(기술자료) PDF를 제공합니다.`,
    },
    {
      q: '제품 구매 및 견적 요청은 어떻게 하나요?',
      a: '전화, 이메일, 카카오톡, WhatsApp 또는 견적서 페이지를 통해 필요한 모델명과 수량을 알려주시면 재고·납기·단가를 확인해 안내해 드립니다.',
    },
    {
      q: 'B2B 대량 구매 시 혜택이 있나요?',
      a: '현장 및 건설사를 위한 B2B 특가 단가, 다중 현장 분할 배송, 세금계산서 발행, 프로젝트 맞춤 견적 및 기술자료 지원을 제공합니다.',
    },
    {
      q: '배송 기간은 얼마나 걸리나요?',
      a: '재고 보유 제품 기준으로 수도권은 당일 또는 익일 배송이 가능하며, 전국 2~3일 이내 신속하게 납품해 드립니다.',
    },
  ];
}

export function getHomeCopy(lang: Lang, productCount: number, categoryCount: number, hubCount: number, totalTechPages: number) {
  if (lang === 'en') {
    return {
      heroEyebrow: 'DOWSIL™ Silicone Supplier & Exporter',
      h1Main: 'DOWSIL™ Structural, Weatherproofing & Fire-Rated Silicones',
      h1Light: 'Korea Construction Trading (KCT)',
      heroDesc1: `Korea Construction Trading (KCT) supplies and exports ${productCount} Dow DOWSIL™ structural, weatherproofing, and fire-rated silicone sealants.`,
      heroDesc2: 'Product TDS documentation (member download & email request), B2B quotations within 24 hours, and technical support.',
      ctaQuote: 'Request B2B Quote',
      ctaProducts: `Browse ${productCount} Products`,
      metricsAria: 'Key supply metrics',
      metrics: [
        { num: String(productCount), unit: 'products', label: 'DOWSIL™ catalog with TDS documentation' },
        { num: String(categoryCount), unit: 'lines', label: 'Building, GMP, civil, IG, specialty & primers' },
        { num: String(totalTechPages), unit: 'pages', label: `${hubCount} technical manuals & selection guides` },
        { num: '24', unit: 'hrs', label: 'B2B domestic & global export quotation response' },
      ],
      trustTds: 'TDS documentation per product',
      solEyebrow: 'SOLUTIONS BY APPLICATION',
      solTitle: 'Six product lines organized by site role',
      solSub: `Different joints require different silicones. Explore our ${categoryCount} DOWSIL™ categories — from curtain wall glazing to firestop and primers.`,
      solAll: 'View full catalog',
      solUnit: 'items',
      prodEyebrow: 'DOWSIL™ PRODUCT LINEUP',
      prodTitle: 'Featured DOWSIL™ Sealants',
      prodSub: `Key structural glazing, weatherproofing, firestop, and specialty grades from our ${productCount}-product DOWSIL™ catalog with TDS access.`,
      prodDetails: 'Details',
      prodAll: `View all ${productCount} products & TDS`,
      prodTdsHub: 'TDS Library',
      btnQuote: 'Create Quotation',
      techEyebrow: 'TECHNICAL LIBRARY',
      techTitle: 'DOWSIL™ Technical Guides & Manuals',
      techSub: 'Direct access to fire-rated manuals, sealant comparison guides, silicone PSA guides, silicone basics, and industrial selection guides.',
      techAll: 'All technical resources',
      techPages: 'pp.',
      techOpen: 'Open guide',
      companyEyebrow: 'ABOUT KCT · DOW SILICONE SUPPLY',
      companyTitle: 'Reliable Dow architectural silicone supply, domestic and global',
      companyDesc: 'Based in Seoul, Korea Construction Trading (KCT) supplies Dow DOWSIL™ architectural and structural silicones to domestic sites and international buyers — combining B2B wholesale pricing, export documentation, and TDS-backed product guidance.',
      companyLinkAbout: 'Company overview',
      companyLinkExport: 'Export services',
      dowCaption: 'Dow architectural & structural silicone sales and export',
      esgEyebrow: 'SUSTAINABILITY',
      esgTitle: 'Durable building envelopes and transparent material documentation',
      esgItems: [
        { title: 'Long-life sealing', desc: 'Weatherproofing and structural silicones that extend façade durability' },
        { title: 'TDS / SDS support', desc: 'Technical data sheets (member download or request) and safe handling guidance' },
        { title: 'Responsible supply', desc: 'Compliant B2B domestic distribution and export documentation' },
      ],
      esgLink: 'Sustainability',
      exportCtaEyebrow: 'B2B SUPPLY & GLOBAL EXPORT',
      exportCtaTitle: 'Domestic B2B bulk orders and global export inquiries',
      exportCtaDesc: 'Supplying construction sites across Korea and exporting to Japan, Taiwan, Southeast Asia, UAE, and Australia with CI, PL, CO, MSDS, and TDS documentation.',
      exportCtaExport: 'Export guide & terms',
      exportCtaQuote: 'PDF Quotation tool',
      b2bEyebrow: 'FREE B2B QUOTE',
      b2bFormRequiredHint: 'Required fields are marked with *.',
      b2bSubmitNote: 'We confirm stock, lead time, and B2B pricing within 24 business hours.',
      faqEyebrow: 'FAQ',
      faqTitle: 'Frequently Asked Questions',
      faqSub: 'Key answers on DOWSIL™ supply, global export, B2B bulk orders, and quotation turnaround.',
      locationLabel: 'LOCATION & CONTACT',
      locationTitle: 'Seoul Office & Direct Channels',
      mapTitle: 'Korea Construction Trading (KCT) Location Map',
      businessHours: 'Mon–Fri 09:00–18:00 KST',
    };
  }
  if (lang === 'ja') {
    return {
      heroEyebrow: 'DOWSIL™ シリコーン専門供給・輸出',
      h1Main: 'DOWSIL™ 構造用・耐候性・耐火シリコーン',
      h1Light: '韓国建設トレーディング (KCT)',
      heroDesc1: `韓国建設トレーディング(KCT)はDow DOWSIL™の構造用・耐候性・耐火シリコーンシーラント${productCount}種を供給・輸出しています。`,
      heroDesc2: '製品別TDS資料のご提供（承認会員ダウンロード・メール送付リクエスト）、24時間以内のB2B見積、技術サポートに対応します。',
      ctaQuote: 'B2B見積依頼',
      ctaProducts: `製品一覧 (${productCount}種)`,
      metricsAria: '主要供給指標',
      metrics: [
        { num: String(productCount), unit: '種', label: 'DOWSIL™取扱製品・全品目TDS(PDF)提供' },
        { num: String(categoryCount), unit: '分野', label: '建築外装・GMP・土木・複層ガラス・特殊・プライマー' },
        { num: String(totalTechPages), unit: 'ページ', label: `技術資料ハブ${hubCount}種（マニュアル・選定ガイド）` },
        { num: '24', unit: '時間', label: '韓国内B2B・海外輸出カスタム見積のご案内' },
      ],
      trustTds: '製品別TDS資料のご提供',
      solEyebrow: 'SOLUTIONS BY APPLICATION',
      solTitle: '現場の用途で選ぶ6つの製品群',
      solSub: `構造グレージング、耐候性シーリング、耐火、複層ガラス、プライマーまで、${categoryCount}分野の用途別にDOWSIL™製品を整理しました。`,
      solAll: '全製品カタログを見る',
      solUnit: '種',
      prodEyebrow: 'DOWSIL™ PRODUCT LINEUP',
      prodTitle: '主要 DOWSIL™ シーラント 8種',
      prodSub: `全${productCount}種のラインナップから構造用・耐候性・耐火・特殊保護の代表的なDOWSIL™製品とTDSをご確認いただけます。`,
      prodDetails: '詳細',
      prodAll: `全${productCount}種の製品・TDSを見る`,
      prodTdsHub: 'TDS資料室',
      btnQuote: '見積書作成',
      techEyebrow: 'TECHNICAL LIBRARY',
      techTitle: 'DOWSIL™ 技術資料ハブ 6種',
      techSub: '耐火マニュアル、シーラント比較・選定、シリコーンPSA、基礎教育、電気テープ用PSA、産業用選定ガイドへ直接アクセスできます。',
      techAll: '技術情報一覧を見る',
      techPages: 'ページ',
      techOpen: 'ガイドを見る',
      companyEyebrow: 'ABOUT KCT · DOW SILICONE SUPPLY',
      companyTitle: 'Dow建築・構造用シリコーンの専門供給と輸出パートナー',
      companyDesc: 'ソウルに拠点を置く韓国建設トレーディング(KCT)は、Dow DOWSIL™の建築用・構造用シリコーンを韓国内現場および日本・台湾・東南アジアなど海外バイヤーへ供給しています。製品選定からTDS資料提供、輸出書類作成まで一貫対応します。',
      companyLinkAbout: '会社紹介',
      companyLinkExport: '輸出のご案内',
      dowCaption: 'Dow 建築・構造用シリコーン専門販売および輸出',
      esgEyebrow: 'SUSTAINABILITY',
      esgTitle: 'サステナビリティと透明な資材情報',
      esgItems: [
        { title: '長寿命ファサード', desc: '耐候性・構造用シリコーンで建築外皮の耐久性を向上' },
        { title: 'TDS・SDSの公開', desc: '製品ごとの技術データシートと安全取扱情報の案内' },
        { title: '透明なB2B供給', desc: '事業者登録・正式見積・輸出通関書類まで誠実に対応' },
      ],
      esgLink: 'サステナビリティを見る',
      exportCtaEyebrow: 'B2B SUPPLY & GLOBAL EXPORT',
      exportCtaTitle: '韓国内B2B大量発注・海外輸出のお問い合わせ',
      exportCtaDesc: '日本・台湾・東南アジア・UAE・オーストラリア等のバイヤー向けに、FOB/CIF条件およびCI・PL・CO・MSDS・TDS書類一式に対応します。',
      exportCtaExport: '輸出条件・実績を見る',
      exportCtaQuote: '見積書PDF作成',
      b2bEyebrow: 'FREE B2B QUOTE',
      b2bFormRequiredHint: '* は必須項目です。',
      b2bSubmitNote: '在庫・納期・B2B単価を確認のうえ24営業時間以内にご案内します。',
      faqEyebrow: 'FAQ',
      faqTitle: 'よくある質問',
      faqSub: 'DOWSIL™取扱製品、海外輸出、B2B見積・納品に関する主なご質問です。',
      locationLabel: 'LOCATION & CONTACT',
      locationTitle: 'アクセス・お問い合わせ窓口',
      mapTitle: '韓国建設トレーディング (KCT) 所在地マップ',
      businessHours: '平日 09:00–18:00 (KST)',
    };
  }
  return {
    heroEyebrow: 'DOWSIL(다우실) 실리콘 공급',
    h1Main: 'DOWSIL(다우실) 구조용·내후성·내화 실리콘 실란트',
    h1Light: '한국건설트레이딩 (KCT)',
    heroDesc1: `한국건설트레이딩(KCT)은 Dow DOWSIL(다우실) 구조용·내후성·내화 실란트 ${productCount}종을 국내 B2B 공급 및 해외 수출합니다.`,
    heroDesc2: '제품별 TDS(기술자료) 제공(승인 회원 다운로드·전송 요청) · 24시간 내 B2B 맞춤 견적 · 전국 신속 납품.',
    ctaQuote: 'B2B 견적 요청',
    ctaProducts: `DOWSIL ${productCount}종 제품 보기`,
    metricsAria: '주요 공급 지표',
    metrics: [
      { num: String(productCount), unit: '종', label: 'DOWSIL™ 취급 제품 · 전 품목 TDS(PDF) 제공' },
      { num: String(categoryCount), unit: '개 제품군', label: '건축 외장 · GMP · 토목 · 복층유리 · 특수 · 프라이머' },
      { num: String(totalTechPages), unit: '쪽', label: `기술자료 허브 ${hubCount}종 (한·영 매뉴얼·선정 가이드)` },
      { num: '24', unit: '시간', label: '국내 B2B · 해외 수출 맞춤 견적 회신' },
    ],
    trustTds: '제품별 TDS(기술자료) 제공',
    solEyebrow: 'SOLUTIONS BY APPLICATION',
    solTitle: '현장 용도별 DOWSIL™ 6개 제품군',
    solSub: `커튼월 구조 글레이징부터 웨더실링, 방화, 복층유리, 토목, 프라이머까지 ${categoryCount}개 제품군으로 필요한 실리콘을 빠르게 찾으세요.`,
    solAll: '전체 카탈로그 보기',
    solUnit: '종',
    prodEyebrow: 'DOWSIL™ PRODUCT LINEUP',
    prodTitle: '대표 DOWSIL(다우실) 실란트 8종',
    prodSub: `커튼월 구조용·외장 내후성·내화·파사드 보호 등 한국건설트레이딩이 공급하는 ${productCount}종 라인업의 핵심 제품과 TDS를 바로 확인하세요.`,
    prodDetails: '상세 정보',
    prodAll: `전체 ${productCount}종 제품·TDS 보기`,
    prodTdsHub: 'TDS 자료실',
    btnQuote: '견적서 작성',
    techEyebrow: 'TECHNICAL LIBRARY',
    techTitle: 'DOWSIL 기술자료 허브 6종',
    techSub: '내화 실란트 매뉴얼, 실란트 비교·선택, 실리콘 점착제(PSA), 실리콘 일반 교육, 전기·전자 테이프용 PSA, 산업·가전용 선정 가이드로 바로 이동하세요.',
    techAll: '기술정보 전체 보기',
    techPages: '쪽',
    techOpen: '자료 보기',
    companyEyebrow: 'ABOUT KCT · DOW SILICONE SUPPLY',
    companyTitle: 'Dow 건축·구조용 실리콘 전문 판매 및 수출 기업',
    companyDesc: '서울에 있는 한국건설트레이딩(KCT)은 Dow DOWSIL(다우실) 건축용·구조용 실리콘을 국내 건설 현장과 해외 바이어에게 공급합니다. 제품 선정 상담, TDS 기술자료 제공, B2B 대량 납품과 수출 서류 대응까지 함께합니다.',
    companyLinkAbout: '회사소개 보기',
    companyLinkExport: '수출 안내 보기',
    dowCaption: 'Dow 건축·구조용 실리콘 전문 판매 및 글로벌 수출',
    esgEyebrow: 'SUSTAINABILITY',
    esgTitle: '지속가능경영과 투명한 자재 정보',
    esgItems: [
      { title: '장수명 외장 실링', desc: '내후성·구조용 실리콘으로 건축물 외피의 내구 수명 확보' },
      { title: 'TDS·SDS 자료 공개', desc: '전 취급 품목의 기술 데이터시트와 안전 취급 기준 안내' },
      { title: '투명한 B2B 거래', desc: '정식 세금계산서 발행과 표준 수출 서류(CI·PL·CO) 지원' },
    ],
    esgLink: '지속가능경영 보기',
    exportCtaEyebrow: 'B2B SUPPLY & GLOBAL EXPORT',
    exportCtaTitle: '국내 B2B 대량 납품 · 해외 수출 문의',
    exportCtaDesc: '국내 수도권 당일~익일·전국 2~3일 납품 및 일본·대만·동남아·UAE·호주 해외 수출(FOB/CIF, CI·PL·CO·MSDS·TDS)을 지원합니다.',
    exportCtaExport: '수출 조건·실적 보기',
    exportCtaQuote: '견적서 PDF 작성',
    b2bEyebrow: 'FREE B2B QUOTE',
    b2bFormRequiredHint: '* 표시는 필수 입력 항목입니다.',
    b2bSubmitNote: '재고·납기·B2B 단가를 확인해 영업일 기준 24시간 내 회신드립니다.',
    faqEyebrow: 'FAQ',
    faqTitle: '자주 묻는 질문',
    faqSub: 'DOWSIL(다우실) 취급 제품, 견적 요청, B2B 대량 구매와 배송에 대해 자주 묻는 내용을 정리했습니다.',
    locationLabel: 'LOCATION & CONTACT',
    locationTitle: '오시는 길 · 바로 문의',
    mapTitle: '한국건설트레이딩 (KCT) 오시는 길 지도',
    businessHours: '평일 09:00–18:00 (KST)',
  };
}
