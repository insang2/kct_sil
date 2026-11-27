import { getDictionary } from '@/lib/dictionaries';
import Link from 'next/link';
import { PHONE_DISPLAY, PHONE_TEL, KAKAO_URL, SMARTSTORE_URL, ADDRESS, CONTACT_TEXT, MAP_URL } from '@/lib/contact';
import { CATALOG, CATEGORIES, bySlug, tdsUrl, type CategoryKey } from '@/lib/products-catalog';
import { localizeCatalog, CATEGORY_EN } from '@/lib/products-catalog-en';
import { HUBS } from '@/lib/series/hubs';

const FEATURED_SLUGS = [
  'dowsil-993',
  'dowsil-995',
  'dowsil-795',
  'dowsil-789',
  'dowsil-791',
  'dowsil-983',
  'dowsil-650-plus',
  'dowsil-firestop-700',
] as const;

const FEATURED_IMG_DIMS: Record<string, readonly [number, number]> = {
  '/assets/img/dow/995-cartridge-800.jpg': [800, 800],
  '/assets/img/dow/795-cartridge-sausage-800.jpg': [800, 800],
  '/assets/img/dow/789-cartridge-sausage-800.jpg': [800, 800],
  '/assets/img/dow/791-cartridge-sausage-800.jpg': [800, 800],
  '/assets/img/dow/983-curing-agent-600.jpg': [540, 540],
  '/assets/img/dow/650-plus-drum-600.jpg': [510, 510],
  '/assets/img/dow/firestop-700-cartridge-600.jpg': [600, 600],
  '/assets/img/logo/Dow_Chemical_Company_logo.svg': [598, 210],
};

const CAT_JA: Record<CategoryKey, string> = {
  building: '建築外装',
  gmp: 'GMP・衛生',
  civil: '土木用',
  igu: '複層ガラス',
  special: '特殊用途',
  primer: 'プライマー',
};

const JA_SUMMARY: Record<string, string> = {
  'dowsil-993': '欧州(EOTA)・中国GB規格対応 2液型構造用シーラント',
  'dowsil-995': '高強度ストラクチュラル・グレージング用 1液型中性シーラント',
  'dowsil-795': '構造用・±50%耐候性兼用 1液型中性シーラント',
  'dowsil-789': 'プライマー不要で接着する1液型中性耐候性シーラント',
  'dowsil-791': 'カーテンウォール・外装ウェザーシーリング用1液型中性シーラント',
  'dowsil-983': '工場グレージング・カーテンウォール生産用 2液型構造用シーラント',
  'dowsil-650-plus': 'ファサードガラス・金属の一時保護用剥離コーティング',
  'dowsil-firestop-700': '屋内外のリニアジョイント・貫通部用 耐火シリコーン',
};

const HUB_JA: Record<string, { title: string; desc: string }> = {
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

const HUB_ORDER = ['fire', 'selection', 'psa', 'basics', 'tapes', 'industrial'] as const;

export default async function Home({ params }: { params: Promise<{ lang: 'ko' | 'en' | 'ja' }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const isEn = lang === 'en';
  const isJa = lang === 'ja';
  const ct = CONTACT_TEXT[lang];
  const productCount = CATALOG.length;

  const featuredProducts = FEATURED_SLUGS.map((slug) => bySlug(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((p0) => {
      const p = localizeCatalog(p0, lang);
      const catLabel = isEn
        ? CATEGORY_EN[p.category].label
        : isJa
        ? CAT_JA[p.category]
        : (CATEGORIES.find((c) => c.key === p.category)?.label ?? p.category);
      return {
        slug: p.slug,
        name: p.name,
        title: p.title,
        summary: isJa ? (JA_SUMMARY[p.slug] ?? p.summary) : p.summary,
        catLabel,
        image: p.image ?? null,
        docLabel: p.docLabel ?? 'TDS',
      };
    });

  const orderedHubs = HUB_ORDER.map((key) => HUBS.find((h) => h.key === key)).filter(
    (h): h is (typeof HUBS)[number] => Boolean(h),
  );

  const faqs = isEn
    ? [
        {
          q: 'What DOWSIL™ products do you supply?',
          a: `Korea Construction Trading (KCT) supplies ${productCount} Dow DOWSIL™ silicone products — including structural glazing, weatherproofing, fire-rated, insulating glass, civil engineering, GMP/hygienic sealants, and primers — with downloadable TDS PDFs.`,
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
      ]
    : isJa
    ? [
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
      ]
    : [
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

  const copy = isEn
    ? {
        badge: 'DOWSIL™ Silicone Supplier & Exporter · Korea Construction Trading (KCT)',
        h1: 'DOWSIL™ Structural, Weatherproofing & Fire-Rated Silicone Sealants',
        desc1: `Korea Construction Trading (KCT) supplies and exports ${productCount} Dow DOWSIL™ structural, weatherproofing, and fire-rated silicone sealants.`,
        desc2: 'Product TDS downloads, B2B quotations within 24 hours, and technical support.',
        btnProducts: `Browse ${productCount} Products & TDS`,
        btnTechnical: 'Technical Library',
        btnQuote: 'Create Quotation',
        prodEyebrow: 'DOWSIL™ PRODUCT LINEUP',
        prodTitle: 'Featured DOWSIL™ Sealants',
        prodSub: `Key structural glazing, weatherproofing, firestop, and specialty grades from our ${productCount}-product DOWSIL™ catalog with downloadable TDS.`,
        prodDetails: 'Details',
        prodAll: `View all ${productCount} products & TDS`,
        techEyebrow: 'TECHNICAL LIBRARY',
        techTitle: 'DOWSIL™ Technical Guides & Manuals',
        techSub: 'Direct access to fire-rated manuals, sealant comparison guides, silicone PSA guides, silicone basics, and industrial selection guides.',
        techPages: 'pages',
        techOpen: 'Open guide',
        faqEyebrow: 'FAQ',
        faqTitle: 'Frequently Asked Questions',
        locationLabel: 'Location',
        locationTitle: 'Location & Directions',
        mapTitle: 'Korea Construction Trading (KCT) Location Map',
      }
    : isJa
    ? {
        badge: 'DOWSIL™ シリコーン専門供給・輸出 · 韓国建設トレーディング (KCT)',
        h1: 'DOWSIL™ 構造用・耐候性・耐火シリコーンシーラント専門供給',
        desc1: `韓国建設トレーディング(KCT)はDow DOWSIL™の構造用・耐候性・耐火シリコーンシーラント${productCount}種を供給・輸出しています。`,
        desc2: '製品別TDS資料のダウンロード、24時間以内のB2B見積、技術サポートに対応します。',
        btnProducts: `製品一覧・TDS (${productCount}種)`,
        btnTechnical: '技術情報ライブラリ',
        btnQuote: '見積書作成',
        prodEyebrow: 'DOWSIL™ PRODUCT LINEUP',
        prodTitle: '主要 DOWSIL™ シーラント 8種',
        prodSub: `全${productCount}種のラインナップから構造用・耐候性・耐火・特殊保護の代表的なDOWSIL™製品とTDSをご確認いただけます。`,
        prodDetails: '詳細',
        prodAll: `全${productCount}種の製品・TDSを見る`,
        techEyebrow: 'TECHNICAL LIBRARY',
        techTitle: 'DOWSIL™ 技術資料ハブ',
        techSub: '耐火マニュアル、シーラント比較・選定、シリコーンPSA、基礎教育、電気テープ用PSA、産業用選定ガイドへ直接アクセスできます。',
        techPages: 'ページ',
        techOpen: 'ガイドを見る',
        faqEyebrow: 'FAQ',
        faqTitle: 'よくある質問',
        locationLabel: 'Location',
        locationTitle: 'アクセス',
        mapTitle: '韓国建設トレーディング (KCT) 所在地マップ',
      }
    : {
        badge: 'DOWSIL(다우실) 실리콘 공급 · 한국건설트레이딩 (KCT)',
        h1: 'DOWSIL(다우실) 구조용·내후성·내화 실리콘 실란트 전문 공급',
        desc1: `한국건설트레이딩(KCT)은 Dow DOWSIL(다우실) 구조용·내후성·내화 실란트 ${productCount}종을 국내 B2B 공급 및 해외 수출합니다.`,
        desc2: '제품별 TDS(기술자료) 다운로드 · 24시간 내 B2B 맞춤 견적 · 전국 신속 납품.',
        btnProducts: `DOWSIL ${productCount}종 제품·TDS 보기`,
        btnTechnical: '기술자료 허브',
        btnQuote: '견적서 작성',
        prodEyebrow: 'DOWSIL™ PRODUCT LINEUP',
        prodTitle: '대표 DOWSIL(다우실) 실란트 8종',
        prodSub: `커튼월 구조용·외장 내후성·내화·파사드 보호 등 한국건설트레이딩이 공급하는 ${productCount}종 라인업의 핵심 제품과 TDS를 바로 확인하세요.`,
        prodDetails: '상세 정보',
        prodAll: `전체 ${productCount}종 제품·TDS 보기`,
        techEyebrow: 'TECHNICAL LIBRARY',
        techTitle: 'DOWSIL 기술자료 허브 6종',
        techSub: '내화 실란트 매뉴얼, 실란트 비교·선택, 실리콘 점착제(PSA), 실리콘 일반 교육, 전기·전자 테이프용 PSA, 산업·가전용 선정 가이드로 바로 이동하세요.',
        techPages: '개 페이지',
        techOpen: '자료 보기',
        faqEyebrow: 'FAQ',
        faqTitle: '자주 묻는 질문',
        locationLabel: 'Location',
        locationTitle: '오시는 길',
        mapTitle: '한국건설트레이딩 (KCT) 오시는 길 지도',
      };

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `https://kconstrade.com/${lang}/#website`,
        "url": `https://kconstrade.com/${lang}`,
        "name": dict.metadata?.title || "Korea Construction Trading (KCT)",
        "description": dict.metadata?.description || "Architectural and structural silicone wholesale and export.",
        "publisher": {
          "@id": "https://kconstrade.com/#organization"
        },
        "inLanguage": lang
      },
      {
        "@type": "LocalBusiness",
        "@id": `https://kconstrade.com/${lang}/#localbusiness`,
        "name": isEn ? "Korea Construction Trading (KCT)" : isJa ? "韓国建設トレーディング (KCT)" : "한국건설트레이딩 (Korea Construction Trading)",
        "image": "https://kconstrade.com/assets/img/logo/kct_logo.jpeg",
        "url": "https://kconstrade.com",
        "telephone": "+82-10-8939-0284",
        "email": "sales@kconstrade.com",
        "address": isEn
          ? {
              "@type": "PostalAddress",
              "streetAddress": "10 Chungmin-ro, 4-A19 Garden Five Tools",
              "addressLocality": "Songpa-gu",
              "addressRegion": "Seoul",
              "postalCode": "05840",
              "addressCountry": "KR"
            }
          : {
              "@type": "PostalAddress",
              "streetAddress": "충민로 10 4-A19 가든파이브툴",
              "addressLocality": "송파구",
              "addressRegion": "서울특별시",
              "postalCode": "05840",
              "addressCountry": "KR"
            },
        "priceRange": "$$",
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "09:00",
          "closes": "18:00"
        }
      },
      {
        "@type": "FAQPage",
        "@id": `https://kconstrade.com/${lang}/#faq`,
        "mainEntity": faqs.map((item) => ({
          "@type": "Question",
          "name": item.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.a,
          },
        })),
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      {/* Hero Slider Area */}
      <section className="position-relative overflow-hidden bg-white" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <div className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundImage: "linear-gradient(rgba(0,0,0,0.70), rgba(0,0,0,0.50)), url('/assets/img/backgrounds/hero_construction.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}>
        </div>
        <div className="container position-relative z-1 py-9">
          <div className="row align-items-center">
            <div className="col-lg-10 col-xl-8 mx-auto text-center text-white">
              <span className="badge rounded-pill px-3 py-2 mb-4 d-inline-block" style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(4px)', fontSize: '0.8rem', letterSpacing: '0.06em', border: '1px solid rgba(255,255,255,0.3)' }}>
                {copy.badge}
              </span>
              <h1 className="display-2 mb-4 fw-bold text-white" style={{ lineHeight: 1.15, textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
                {copy.h1}
              </h1>
              <p className="lead mb-5 text-white fw-normal" style={{ fontSize: '1.15rem', opacity: 1, textShadow: '0 1px 6px rgba(0,0,0,0.35)' }}>
                {copy.desc1}<br className="d-none d-sm-block" />
                {copy.desc2}
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Link href={`/${lang}/products`} className="btn btn-primary btn-lg px-4 px-md-5 rounded-pill fw-bold shadow-lg hover-lift">
                  <i className="bi bi-grid me-2" aria-hidden="true"></i>{copy.btnProducts}
                </Link>
                <Link href={`/${lang}/technical`} className="btn btn-outline-white btn-lg px-4 rounded-pill fw-bold hover-lift">
                  <i className="bi bi-journal-text me-2" aria-hidden="true"></i>{copy.btnTechnical}
                </Link>
                <a href="https://wa.me/821089390284" target="_blank" rel="noreferrer" className="btn btn-outline-white btn-lg px-4 rounded-pill fw-bold hover-lift">
                  <i className="bi bi-whatsapp me-2" aria-hidden="true"></i>{dict.cta.btn_whatsapp}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="bg-white border-bottom py-3">
        <div className="container">
          <div className="row justify-content-center g-2 g-md-0">
            {[
              { icon: 'bi-building-check',   text: (dict as any).trust?.t2 ?? 'Business Reg. No. 371-07-03719' },
              { icon: 'bi-globe2',           text: (dict as any).trust?.t4 ?? 'Exporting to Japan · Taiwan · Southeast Asia' },
            ].map((item, i) => (
              <div key={i} className="col-6 col-md-4 d-flex align-items-center justify-content-center gap-2 px-2">
                <i className={`bi ${item.icon} text-primary flex-shrink-0`} style={{ fontSize: '0.9rem' }}></i>
                <span style={{ fontSize: '0.78rem', color: '#444261', lineHeight: 1.3, wordBreak: 'keep-all' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured DOWSIL Products Section */}
      <section className="py-9 py-lg-11 bg-light border-bottom reveal-fade-in" aria-labelledby="home-featured-products">
        <div className="container">
          <div className="row justify-content-center mb-7 text-center">
            <div className="col-lg-8">
              <span className="h6 text-primary fw-bold text-uppercase d-block mb-2">{copy.prodEyebrow}</span>
              <h2 id="home-featured-products" className="display-4 mb-3 fw-bold text-dark">{copy.prodTitle}</h2>
              <p className="lead text-body-secondary mb-0">{copy.prodSub}</p>
            </div>
          </div>
          <div className="row g-4">
            {featuredProducts.map((product) => {
              const href = `/${lang}/products/${product.slug}`;
              const imgSrc = product.image ?? '/assets/img/logo/Dow_Chemical_Company_logo.svg';
              const [imgW, imgH] = FEATURED_IMG_DIMS[imgSrc] ?? [600, 600];
              const displayLabel = isEn ? product.title : product.name;
              return (
                <div key={product.slug} className="col-sm-6 col-lg-3">
                  <article className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden bg-white">
                    <Link
                      href={href}
                      tabIndex={-1}
                      className="d-flex align-items-center justify-content-center bg-white border-bottom p-3"
                      style={{ height: 170 }}
                    >
                      <img
                        src={imgSrc}
                        alt={product.image ? displayLabel : `${displayLabel} — Dow`}
                        width={imgW}
                        height={imgH}
                        loading="lazy"
                        decoding="async"
                        style={
                          product.image
                            ? { maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto', objectFit: 'contain' }
                            : { width: '55%', height: 'auto', opacity: 0.35 }
                        }
                      />
                    </Link>
                    <div className="card-body d-flex flex-column p-4">
                      <span className="badge bg-light text-primary border align-self-start mb-2 fw-semibold" style={{ fontSize: '0.72rem' }}>
                        {product.catLabel}
                      </span>
                      <h3 className="h6 fw-bold text-dark mb-2">
                        <Link href={href} className="text-dark text-decoration-none">
                          {product.name}
                        </Link>
                      </h3>
                      <p className="small text-body-secondary mb-4 flex-grow-1" style={{ lineHeight: 1.6 }}>
                        {product.summary}
                      </p>
                      <div className="d-flex gap-2">
                        <Link href={href} className="btn btn-primary btn-sm rounded-pill flex-fill fw-semibold">
                          {copy.prodDetails}
                        </Link>
                        <a href={tdsUrl(product.slug)} download className="btn btn-outline-secondary btn-sm rounded-pill px-3 fw-semibold">
                          {product.docLabel}
                        </a>
                      </div>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
          <div className="d-flex justify-content-center gap-3 flex-wrap mt-7">
            <Link href={`/${lang}/products`} className="btn btn-primary btn-lg rounded-pill px-5 fw-bold shadow-sm hover-lift">
              {copy.prodAll}
            </Link>
            <Link href={`/${lang}/quote`} className="btn btn-outline-primary btn-lg rounded-pill px-4 fw-bold hover-lift">
              <i className="bi bi-file-earmark-text me-2" aria-hidden="true"></i>{copy.btnQuote}
            </Link>
          </div>
        </div>
      </section>

      {/* Technical Resources Hub Section */}
      <section className="py-9 py-lg-11 bg-white border-bottom reveal-fade-in" aria-labelledby="home-technical-hubs">
        <div className="container">
          <div className="row justify-content-center mb-7 text-center">
            <div className="col-lg-8">
              <span className="h6 text-primary fw-bold text-uppercase d-block mb-2">{copy.techEyebrow}</span>
              <h2 id="home-technical-hubs" className="display-4 mb-3 fw-bold text-dark">{copy.techTitle}</h2>
              <p className="lead text-body-secondary mb-0">{copy.techSub}</p>
            </div>
          </div>
          <div className="row g-4">
            {orderedHubs.map((hub) => {
              const title = isEn ? hub.title.en : isJa ? (HUB_JA[hub.key]?.title ?? hub.title.en) : hub.title.ko;
              const desc = isEn ? hub.desc.en : isJa ? (HUB_JA[hub.key]?.desc ?? hub.desc.en) : hub.desc.ko;
              return (
                <div key={hub.key} className="col-md-6 col-lg-4">
                  <Link
                    href={`/${lang}/${hub.path}`}
                    className="card border-0 shadow-sm rounded-4 h-100 p-4 text-decoration-none bg-light d-flex flex-column"
                  >
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <span
                        className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary text-white"
                        style={{ width: 44, height: 44 }}
                      >
                        <i className={`bi ${hub.icon} fs-5`} aria-hidden="true"></i>
                      </span>
                      <span className="badge bg-white text-primary border rounded-pill fw-semibold" style={{ fontSize: '0.75rem' }}>
                        {hub.count} {copy.techPages}
                      </span>
                    </div>
                    <h3 className="h6 fw-bold text-dark mb-2" style={{ lineHeight: 1.45 }}>
                      {title}
                    </h3>
                    <p className="small text-body-secondary mb-3 flex-grow-1" style={{ lineHeight: 1.65 }}>
                      {desc}
                    </p>
                    <span className="small fw-bold text-primary">
                      {copy.techOpen} →
                    </span>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="position-relative border-bottom py-9 py-lg-11 bg-white reveal-fade-in">
        <div className="container">
          <div className="row justify-content-center mb-9 text-center">
            <div className="col-lg-8">
              <span className="h6 text-primary fw-bold text-uppercase">{dict.features.label}</span>
              <h2 className="display-4 mb-0 fw-bold text-dark">{dict.features.title}</h2>
            </div>
          </div>
          <div className="row justify-content-around">
            <div className="col-12 col-lg-4 mb-7 mb-lg-0 text-center">
              <div className="mb-4 position-relative fw-normal text-primary" style={{ fontSize: '3.5rem' }}>
                <i className="icon-Repeat-2 position-relative"></i>
              </div>
              <h3 className="h5 mb-3 text-dark">{dict.features.f1_title}</h3>
              <p className="mb-3 px-lg-3 text-body-secondary fw-normal">{dict.features.f1_desc}</p>
            </div>
            <div className="col-12 col-lg-4 mb-7 mb-lg-0 text-center">
              <div className="mb-4 position-relative fw-normal text-primary" style={{ fontSize: '3.5rem' }}>
                <i className="icon-Truck position-relative"></i>
              </div>
              <h3 className="h5 mb-3 text-dark">{dict.features.f2_title}</h3>
              <p className="mb-3 px-lg-3 text-body-secondary fw-normal">{dict.features.f2_desc}</p>
            </div>
            <div className="col-12 col-lg-4 text-center">
              <div className="mb-4 position-relative fw-normal text-primary" style={{ fontSize: '3.5rem' }}>
                <i className="icon-File-Edit position-relative"></i>
              </div>
              <h3 className="h5 mb-3 text-dark">{dict.features.f3_title}</h3>
              <p className="mb-3 px-lg-3 text-body-secondary fw-normal">{dict.features.f3_desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-9 py-lg-11 bg-white reveal-fade-in">
        <div className="container">
          <div className="row justify-content-center text-center mb-9">
            <div className="col-lg-7">
              <span className="h6 text-primary fw-bold text-uppercase">{(dict as any).process?.label ?? 'HOW IT WORKS'}</span>
              <h2 className="display-4 fw-bold text-dark">{(dict as any).process?.title ?? 'Simple 4-Step Process'}</h2>
            </div>
          </div>
          <div className="row g-4 align-items-start">
            {(((dict as any).process?.steps ?? [
              { title: 'Submit Inquiry',  desc: 'Contact us by phone, email, or WhatsApp with the materials and quantities you need.' },
              { title: 'Custom Quote',   desc: 'We send a detailed quotation with pricing and delivery schedule within 24 hours.' },
              { title: 'Confirm Order',  desc: 'Agree on payment terms and confirm your order. Tax invoice available.' },
              { title: 'Fast Delivery',  desc: 'Same/next-day in Seoul metro area; 2–3 days nationwide. Multi-site split delivery.' },
            ]) as Array<{title:string;desc:string}>).map((item, i) => (
              <div key={i} className="col-sm-6 col-lg-3 text-center">
                <div className="position-relative">
                  {i < 3 && (
                    <div className="d-none d-lg-block position-absolute top-50 start-100 translate-middle-y"
                      style={{ width: '100%', borderTop: '2px dashed #CBD5E1', zIndex: 0 }}></div>
                  )}
                  <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary text-white fw-bold mb-4 position-relative"
                    style={{ width: 64, height: 64, fontSize: '1.1rem', zIndex: 1 }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                </div>
                <h3 className="h6 fw-bold text-dark mb-2">{item.title}</h3>
                <p className="text-body-secondary small mb-0" style={{ lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* B2B Quote Request Form Section */}
      <section id="b2b-form" className="py-9 py-lg-11 reveal-fade-in" data-form-section>
        <div className="container">
          <div className="row justify-content-center mb-7 text-center">
            <div className="col-lg-8">
              <span className="h6 text-primary fw-bold text-uppercase">{dict.hero.btn_b2b}</span>
              <h2 className="display-4 mb-3 fw-bold">{(dict as any).b2b_form?.title ?? 'Free B2B Quote Request'}</h2>
              <p className="lead">{(dict as any).b2b_form?.desc ?? 'Get rapid pricing for the bulk architectural silicone needed for your project.'}</p>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-8 col-xl-6">
              <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                <div className="card-body p-4 p-md-5">
                  <form action="https://api.web3forms.com/submit" method="POST">
                    <input type="hidden" name="access_key" value="f67c63de-f948-4e2f-8928-12d4b29ed572" />
                    <input type="hidden" name="subject" value="New B2B Quote Request from KCT" />
                    <input type="hidden" name="redirect" value="https://kconstrade.com" />

                    <div className="mb-4">
                      <label className="form-label" htmlFor="home-1">{(dict as any).b2b_form?.form_name ?? 'Company / Contact Name'}</label>
                      <input id="home-1" type="text" name="name" className="form-control form-control-lg" placeholder={(dict as any).b2b_form?.form_name_ph ?? 'e.g. ABC Construction / John Doe'} required />
                    </div>

                    <div className="mb-4">
                      <label className="form-label" htmlFor="home-2">{(dict as any).auth?.email ?? 'Email'}</label>
                      <input id="home-2" type="email" name="email" className="form-control form-control-lg" placeholder="name@company.com" required />
                    </div>

                    <div className="mb-4">
                      <label className="form-label" htmlFor="home-3">{(dict as any).auth?.phone ?? 'Phone'}</label>
                      <input id="home-3" type="tel" name="phone" className="form-control form-control-lg" placeholder="+82 10-1234-5678" required />
                    </div>

                    <div className="mb-4">
                      <label className="form-label" htmlFor="home-4">{(dict as any).b2b_form?.form_message ?? 'Inquiry Details'}</label>
                      <textarea id="home-4" name="message" className="form-control form-control-lg" rows={5} placeholder={(dict as any).b2b_form?.form_message_ph ?? 'Please include the materials, quantities, and site location.'} required></textarea>
                    </div>

                    <div className="d-grid mt-5">
                      <button type="submit" className="btn btn-primary btn-lg rounded-pill shadow-sm hover-lift">{(dict as any).b2b_form?.btn_submit ?? 'Submit Quote Request'}</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section (matches FAQPage JSON-LD) */}
      <section className="py-9 py-lg-11 bg-white border-top reveal-fade-in" aria-labelledby="home-faq-title">
        <div className="container">
          <div className="row justify-content-center mb-7 text-center">
            <div className="col-lg-8">
              <span className="h6 text-primary fw-bold text-uppercase d-block mb-2">{copy.faqEyebrow}</span>
              <h2 id="home-faq-title" className="display-4 mb-0 fw-bold text-dark">{copy.faqTitle}</h2>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="d-flex flex-column gap-3">
                {faqs.map((item, idx) => (
                  <details key={idx} className="card border rounded-4 p-4 bg-light" open={idx === 0}>
                    <summary className="fw-bold text-dark" style={{ cursor: 'pointer', lineHeight: 1.5 }}>
                      {item.q}
                    </summary>
                    <p className="text-body-secondary mb-0 mt-3" style={{ lineHeight: 1.75 }}>
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-9 py-lg-11 position-relative overflow-hidden bg-primary text-white">
        <div className="container position-relative z-1">
          <div className="row align-items-center justify-content-center text-center">
            <div className="col-xl-8 col-lg-9">
              <h2 className="display-4 fw-bold mb-4">{dict.cta.title}</h2>
              <p className="lead mb-5 text-white fw-medium" style={{ opacity: 0.9 }}>{dict.cta.description}</p>
              <div className="row g-3 justify-content-center">
                <div className="col-12 col-sm-6 col-md-auto">
                  <a href="https://wa.me/821089390284" target="_blank" rel="noreferrer" className="btn btn-outline-white btn-lg px-4 rounded-pill hover-lift d-flex align-items-center justify-content-center w-100">
                    <i className="bi bi-whatsapp me-2 fs-5"></i>
                    <span>{dict.cta.btn_whatsapp}</span>
                  </a>
                </div>
                <div className="col-12 col-sm-6 col-md-auto">
                  <a href={PHONE_TEL} className="btn btn-white btn-lg px-4 rounded-pill hover-lift d-flex align-items-center justify-content-center w-100 fw-bold">
                    <i className="bi bi-telephone-fill me-2 fs-5"></i>
                    <span>{PHONE_DISPLAY}</span>
                  </a>
                </div>
                {KAKAO_URL && (
                  <div className="col-12 col-sm-6 col-md-auto">
                    <a href={KAKAO_URL} target="_blank" rel="noreferrer" className="btn btn-lg px-4 rounded-pill hover-lift d-flex align-items-center justify-content-center w-100 fw-bold" style={{ background: '#FEE500', color: '#191919' }}>
                      <i className="bi bi-chat-fill me-2 fs-5"></i>
                      <span>{ct.kakao}</span>
                    </a>
                  </div>
                )}
                <div className="col-12 col-sm-6 col-md-auto">
                  <a href={SMARTSTORE_URL} target="_blank" rel="noreferrer" className="btn btn-outline-white btn-lg px-4 rounded-pill hover-lift d-flex align-items-center justify-content-center w-100">
                    <i className="bi bi-shop me-2 fs-5"></i>
                    <span>{ct.store}</span>
                  </a>
                </div>
                <div className="col-12 col-sm-6 col-md-auto">
                  <a href="mailto:sales@kconstrade.com" className="btn btn-outline-white btn-lg px-4 rounded-pill hover-lift d-flex align-items-center justify-content-center w-100">
                    <i className="bi bi-envelope-fill me-2 fs-5"></i>
                    <span>{dict.cta.btn_email}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Background decorative elements */}
        <div className="position-absolute top-0 end-0 mt-n5 me-n5 opacity-25">
           <img src="/assets/img/vectors/pattern-dots.svg" alt="" aria-hidden="true" width={78} height={172} loading="lazy" decoding="async" style={{ width: '160px', height: 'auto' }} />
        </div>
      </section>
      {/* Location / Map Section */}
      <section className="py-9 py-lg-11 bg-light text-dark">
        <div className="container">
          <div className="row justify-content-center mb-7 text-center">
            <div className="col-lg-8">
              <span className="h6 text-primary fw-bold text-uppercase">{copy.locationLabel}</span>
              <h2 className="display-4 mb-3 fw-bold text-dark">{copy.locationTitle}</h2>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-12">
              <div className="card border-0 shadow-lg overflow-hidden rounded-4">
                <iframe
                  src={`https://maps.google.com/maps?q=37.478626,127.1192753&hl=${lang}&z=16&output=embed`}
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={copy.mapTitle}
                ></iframe>
              </div>
              <div className="card border-0 shadow-sm rounded-4 mt-4 p-4 text-dark">
                <div className="row g-4 align-items-center">
                  <div className="col-lg-7">
                    <div className="fw-bold mb-1"><i className="bi bi-geo-alt-fill text-primary me-2"></i>{ct.addr}</div>
                    {lang === 'ko' && <div className="fs-5 fw-bold text-dark">{ADDRESS.ko}</div>}
                    <div className={lang === 'ko' ? 'text-dark small' : 'fs-6 fw-bold text-dark'} style={lang === 'ko' ? { opacity: 0.7 } : undefined}>{ADDRESS.en}</div>
                    <div className="mt-3">
                      <i className="bi bi-telephone-fill text-primary me-2"></i>{ct.tel}: <a href={PHONE_TEL} className="fw-bold text-decoration-none" style={{ color: '#1558D6' }}>{PHONE_DISPLAY}</a>
                    </div>
                  </div>
                  <div className="col-lg-5 d-flex flex-wrap gap-2 justify-content-lg-end">
                    <a href={PHONE_TEL} className="btn btn-primary rounded-pill px-4"><i className="bi bi-telephone-fill me-2"></i>{ct.call}</a>
                    {KAKAO_URL && <a href={KAKAO_URL} target="_blank" rel="noreferrer" className="btn rounded-pill px-4 fw-bold" style={{ background: '#FEE500', color: '#191919' }}><i className="bi bi-chat-fill me-2"></i>{ct.kakao}</a>}
                    <a href={SMARTSTORE_URL} target="_blank" rel="noreferrer" className="btn btn-success rounded-pill px-4"><i className="bi bi-shop me-2"></i>{ct.store}</a>
                    <a href={MAP_URL} target="_blank" rel="noreferrer" className="btn btn-outline-secondary rounded-pill px-4"><i className="bi bi-map me-2"></i>{ct.directions}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
