import { getDictionary } from '@/lib/dictionaries';
import { CATALOG, CATEGORIES } from '@/lib/products-catalog';
import { CATEGORY_EN } from '@/lib/products-catalog-en';
import Link from 'next/link';
import { Fragment } from 'react';
import Tx from '@/components/tech/Tx';
import { COMPANY } from '@/lib/company';
import { ADDRESS, PHONE_DISPLAY, PHONE_TEL, MAP_URL, KAKAO_URL, SMARTSTORE_URL } from '@/lib/contact';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: 'ko' | 'en' | 'ja' }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  const isJa = lang === 'ja';

  const title = isEn
    ? 'About KCT | Korea Construction Trading - DOWSIL Supplier'
    : isJa
    ? '会社紹介 | 韓国建設トレーディング (KCT) - 建築用シリコーン専門'
    : '회사소개 | 한국건설트레이딩 (KCT) - Dow 건축용 실리콘 전문';

  const description = isEn
    ? 'Learn about Korea Construction Trading (KCT), a global supplier and exporter of Dow Chemical architectural and structural silicone sealants.'
    : isJa
    ? '韓国建設トレーディング (KCT) は、Dow(ダウ) 建築用・構造用シリコーンの卸売販売およびグローバル貿易輸出を専門とする企業です。全国への迅速な配送と現場直納、プロジェクト別の見積に対応します。'
    : '한국건설트레이딩(KCT)은 Dow Chemical의 건축용·구조용 실리콘 전문 판매 및 글로벌 수출 기업입니다. 전국 신속 배송 및 현장 직납, 프로젝트 맞춤 견적을 제공합니다.';

  return {
    title,
    description,
    alternates: {
      canonical: `https://kconstrade.com/${lang}/about`,
      languages: {
        'ko': 'https://kconstrade.com/ko/about',
        'en': 'https://kconstrade.com/en/about',
        'ja': 'https://kconstrade.com/ja/about',
        'x-default': 'https://kconstrade.com/ko/about',
      },
    },
    openGraph: {
      title,
      description,
      url: `https://kconstrade.com/${lang}/about`,
      siteName: isEn ? 'Korea Construction Trading (KCT)' : isJa ? '韓国建設トレーディング (KCT)' : '한국건설트레이딩 (KCT)',
      images: [
        {
          url: 'https://kconstrade.com/assets/img/og-image.png',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
    },
  };
}

const JA_CAT: Record<string, string> = { building: '建築外装', gmp: 'GMP・衛生', civil: '土木用', igu: '複層ガラス', special: '特殊用途', primer: 'プライマー' };

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: 'ko' | 'en' | 'ja' }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const d = dict as any;
  const t = d.about;
  const isEn = lang === 'en';
  const isJa = lang === 'ja';
  const T = (ko: string, en: string, ja: string) => (isEn ? en : isJa ? ja : ko);
  const n = CATALOG.length;
  const steps: { title: string; desc: string }[] = d.process.steps;
  const addr = isEn || isJa ? ADDRESS.en : ADDRESS.ko;
  const catLabel = (c: { key: string; label: string }) => (isEn ? CATEGORY_EN[c.key as keyof typeof CATEGORY_EN].label : isJa ? JA_CAT[c.key] : c.label);
  const orgName = T('한국건설트레이딩 (Korea Construction Trading)', 'Korea Construction Trading (KCT)', '韓国建設トレーディング (KCT)');

  const aboutSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": T('홈', 'Home', 'ホーム'), "item": `https://kconstrade.com/${lang}` },
          { "@type": "ListItem", "position": 2, "name": T('회사소개', 'About Us', '会社紹介'), "item": `https://kconstrade.com/${lang}/about` },
        ],
      },
      {
        "@type": "AboutPage",
        "name": t.hero_title,
        "description": t.hero_subtitle,
        "publisher": {
          "@type": "Organization",
          "name": orgName,
          "alternateName": "KCT",
          "url": "https://kconstrade.com",
          "logo": "https://kconstrade.com/assets/img/logo/kct_logo.jpeg"
        },
        "mainEntity": {
          "@type": "Organization",
          "name": orgName,
          "legalName": COMPANY.nameEn,
          "description": t.mission_desc,
          "email": COMPANY.email,
          "telephone": "+82-10-8939-0284",
          "address": { "@type": "PostalAddress", "streetAddress": "10 Chungmin-ro, Garden Five Tools 4-A19", "addressLocality": "Songpa-gu, Seoul", "addressCountry": "KR" }
        }
      }
    ]
  };

  const overview: [string, React.ReactNode][] = [
    [T('상호', 'Company', '商号'), <>{COMPANY.nameEn} / {COMPANY.nameKo}</>],
    [T('사업자등록번호', 'Business Reg. No.', '事業者登録番号'), COMPANY.bizNo],
    [T('주요 사업', 'Business', '主要事業'), T('Dow(DOWSIL™) 건축용 실리콘 도매·유통 및 수출', 'Wholesale and export of Dow DOWSIL™ architectural silicones', 'Dow(DOWSIL™)建築用シリコーンの卸売・輸出')],
    [T('취급 제품', 'Products', '取扱製品'), T(`DOWSIL™ ${n}종 (실란트·프라이머)`, `${n} DOWSIL™ sealants and primers`, `DOWSIL™ ${n}種(シーラント・プライマー)`)],
    [T('주소', 'Address', '住所'), addr],
    [T('전화', 'Phone', '電話'), <a href={PHONE_TEL}>{PHONE_DISPLAY}</a>],
    [T('이메일', 'Email', 'メール'), <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>],
  ];

  const lines = CATEGORIES.map((c) => ({ label: catLabel(c), count: CATALOG.filter((p) => p.category === c.key).length }));

  const exportRows: [string, string][] = [
    [T('거래 조건', 'Terms', '取引条件'), T('FOB · CIF · EXW 조건 협의 가능', 'FOB · CIF · EXW terms available', 'FOB・CIF・EXW条件を協議可能')],
    [T('수출 서류', 'Documents', '輸出書類'), T('CI · PL · CO · MSDS · TDS 제공', 'CI · PL · CO · MSDS · TDS provided', 'CI・PL・CO・MSDS・TDSを提供')],
    [T('납기', 'Lead time', '納期'), T('재고 기준 발주 후 3~7 영업일', '3–7 business days from stock', '在庫品は発注後3〜7営業日')],
    [T('결제', 'Payment', '決済'), T('T/T · LC 협의 가능', 'T/T wire transfer · LC negotiable', 'T/T・LC協議可能')],
  ];

  const cardsQuality = [
    { no: '01', title: T('Dow 제조 제품만 취급', 'Dow-manufactured products only', 'Dow製造品のみ取扱'), desc: T('제조사가 만든 제품을 그대로 공급하며, 제품마다 제조사 TDS를 제공합니다.', 'We supply manufacturer products as-is, each with the manufacturer’s TDS.', 'メーカー製品をそのまま供給し、製品ごとにTDSを提供します。') },
    { no: '02', title: T('TDS·SDS 제공', 'TDS and SDS provided', 'TDS・SDSの提供'), desc: T(`TDS ${n}종은 TDS 자료실에서 바로 내려받고, SDS(MSDS)는 요청 시 안내합니다.`, `TDS for all ${n} products are downloadable; SDS (MSDS) is provided on request.`, `TDS全${n}種はダウンロード可能、SDS(MSDS)は要請に応じて案内します。`) },
    { no: '03', title: T('보관·유효기간 안내', 'Storage and shelf life', '保管・有効期限の案内'), desc: T('제품별 유효기간과 보관 조건은 TDS와 제품 페이지에 표기된 기준으로 안내합니다.', 'Shelf life and storage conditions follow the TDS and are shown on each product page.', '有効期限と保管条件はTDSと製品ページの記載に基づきご案内します。') },
    { no: '04', title: T('환경 정보', 'Environmental information', '環境情報'), desc: T('LEED 확인서 등 환경 관련 자료는 지속가능경영 페이지에서 안내합니다.', 'LEED letters and other environmental documents are listed on our sustainability page.', 'LEED確認書などの環境資料はサステナビリティページでご案内します。') },
  ];

  const css = `
.ab-dl{display:grid;grid-template-columns:minmax(120px,.5fr) 2fr;margin:0}
.ab-dl dt,.ab-dl dd{border-top:1px solid var(--tx-line);padding:1rem 0;margin:0}
.ab-dl dt{font-weight:600;color:var(--tx-mute);font-size:.95rem}
.ab-two{display:grid;grid-template-columns:1fr 1.4fr;gap:clamp(1.5rem,4vw,4rem);align-items:start}
.ab-nums{display:flex;flex-wrap:wrap;gap:2rem 3rem;margin-top:1.5rem}
.ab-nums b{display:block;font-size:2.6rem;letter-spacing:-.04em;line-height:1.1;font-weight:650}
.ab-nums span{color:var(--tx-mute);font-size:.9rem}
.ab-steps{counter-reset:s;display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:0 2rem;list-style:none;padding:0;margin:0}
.ab-steps li{border-top:1px solid var(--tx-line);padding:1.2rem 0 1.6rem}
.ab-steps li::before{counter-increment:s;content:"0" counter(s);color:var(--tx-accent);font-weight:700;font-size:.85rem}
.ab-steps h3{font-size:1.1rem;margin:.3rem 0 .4rem}
.ab-steps p{margin:0;color:var(--tx-mute);font-size:.95rem}
.ab-sec{padding:4.5rem 0 1rem;border-top:1px solid var(--tx-line);scroll-margin-top:130px}
.ab-sec:first-of-type{border-top:0}
.ab-links a{min-height:44px;display:inline-flex;align-items:center}
@media (max-width:767px){.ab-two{grid-template-columns:1fr}.ab-dl{grid-template-columns:1fr}.ab-dl dt{border-top:1px solid var(--tx-line);padding-bottom:0}.ab-dl dd{border-top:0;padding-top:.2rem}.ab-sec{padding-top:3rem}}
`;

  return (
    <Tx>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }} />

      <section className="tx-hero tx-big" style={{ background: 'linear-gradient(180deg,rgba(12,13,15,.72),rgba(12,13,15,.94)), url(/assets/img/backgrounds/hero_construction.png) center/cover' }}>
        <div className="container">
          <nav aria-label="breadcrumb" className="mb-3">
            <Link href={`/${lang}`}>{d.navigation.home}</Link><span> / </span><span style={{ color: '#EDEDED' }}>{T('회사소개', 'About', '会社紹介')}</span>
          </nav>
          <span className="badge">{t.hero_label}</span>
          <h1 className="mt-3">{t.hero_title} <span className="tx-light">KCT</span></h1>
          <p>{t.hero_subtitle}. {T(`DOWSIL™ ${n}종을 국내 시공·건설 현장에 공급하고 해외로 수출합니다.`, `We supply ${n} DOWSIL™ products to sites in Korea and export them overseas.`, `DOWSIL™ ${n}種を国内の現場へ供給し、海外へ輸出します。`)}</p>
          <div className="d-flex flex-wrap gap-2 mt-4">
            <a href={`mailto:${COMPANY.email}`} className="btn btn-light">{T('견적·자료 문의', 'Request a quote', '見積・資料のお問い合わせ')} →</a>
            <a href="#locations" className="btn btn-outline-light">{T('오시는 길', 'Location', 'アクセス')}</a>
          </div>
        </div>
      </section>

      <nav className="tx-index" aria-label={T('회사소개 바로가기', 'About sections', '会社紹介メニュー')}>
        <div className="container">
          {[['greeting', T('인사말', 'Greeting', 'ご挨拶')], ['overview', T('회사 개요', 'Overview', '会社概要')], ['business', T('사업 분야', 'Business', '事業内容')], ['quality', T('품질·환경·안전', 'Quality · Environment · Safety', '品質・環境・安全')], ['locations', T('사업장', 'Location', '事業所')]].map(([id, label], i) => (
            <a key={id} href={`#${id}`}><span>{String(i + 1).padStart(2, '0')}</span>{label}</a>
          ))}
        </div>
      </nav>

      <div className="container">
        <section id="greeting" className="ab-sec">
          <span className="tx-eyebrow">Greeting</span>
          <h2 className="tx-sec-h">{T('현장에서 쓸 제품을, 근거 자료와 함께.', 'Products for the site, with the data behind them.', '現場で使う製品を、根拠資料とともに。')}</h2>
          <div className="ab-two">
            <p style={{ color: 'var(--tx-mute)' }}>{t.mission_title}</p>
            <div>
              <p>{T(
                '안녕하십니까. 한국건설트레이딩은 Dow의 건축용 실리콘을 국내 건설·시공 현장과 해외 바이어에게 공급합니다.',
                'Korea Construction Trading supplies Dow architectural silicones to construction sites in Korea and to buyers overseas.',
                '韓国建設トレーディングは、Dowの建築用シリコーンを国内の建設現場と海外のバイヤーへ供給しています。')}</p>
              <p>{T(
                '실란트는 어떤 자재에 무엇을 붙이는지에 따라 맞는 제품이 달라집니다. 저희는 제품을 파는 데서 그치지 않고, TDS 같은 제조사 자료를 근거로 제품 선택을 돕고 시공 전 확인할 사항을 안내하려고 합니다.',
                'The right sealant depends on what it must bond and where. Beyond selling, we help you choose using manufacturer data such as the TDS, and point out what to confirm before application.',
                'シーラントは、何をどこに接着するかで適した製品が変わります。販売にとどまらず、TDSなどメーカー資料を根拠に製品選定を支援し、施工前に確認すべき点をご案内します。')}</p>
              <p style={{ marginBottom: 0 }}>{T(
                '프로젝트 규모와 관계없이 필요한 자료와 견적을 빠르게 보내드리겠습니다. 한국건설트레이딩 임직원 일동.',
                'Whatever the project size, we will send the documents and quotation you need promptly. — The team at Korea Construction Trading',
                'プロジェクトの規模を問わず、必要な資料と見積を迅速にお送りします。韓国建設トレーディング 役職員一同')}</p>
            </div>
          </div>
        </section>

        <section id="overview" className="ab-sec">
          <span className="tx-eyebrow">Overview</span>
          <h2 className="tx-sec-h">{T('회사 개요', 'Company overview', '会社概要')}</h2>
          <dl className="ab-dl">
            {overview.map(([k, v]) => (<Fragment key={k}><dt>{k}</dt><dd>{v}</dd></Fragment>))}
          </dl>
          <div className="ab-nums">
            <div><b>{n}</b><span>{T('취급 제품(종)', 'Products', '取扱製品(種)')}</span></div>
            <div><b>{CATEGORIES.length}</b><span>{T('용도별 제품군', 'Product lines', '用途別ライン')}</span></div>
            <div><b>3</b><span>{T('제공 언어(한·영·일)', 'Site languages', '対応言語(韓・英・日)')}</span></div>
          </div>
        </section>

        <section id="business" className="ab-sec">
          <span className="tx-eyebrow">Business</span>
          <h2 className="tx-sec-h">{T('Dow 실리콘 판매 사업', 'Dow silicone sales business', 'Dowシリコーン販売事業')}</h2>
          <p className="tx-sec-sub">{T(`DOWSIL™ ${n}종을 용도별 ${CATEGORIES.length}개 제품군으로 공급합니다.`, `${n} DOWSIL™ products supplied across ${CATEGORIES.length} application lines.`, `DOWSIL™ ${n}種を用途別${CATEGORIES.length}ラインで供給します。`)}</p>
          <div className="tx-grid">
            {lines.map((c, i) => (
              <Link key={i} href={`/${lang}/products#cat-${CATEGORIES[i].key}`}>
                <span className="tx-no">{String(i + 1).padStart(2, '0')}</span>
                <h3>{c.label}<em>{c.count}{T('종', '', '種')}</em></h3>
                <p>{isEn ? CATEGORY_EN[CATEGORIES[i].key].desc : isJa ? '' : CATEGORIES[i].desc}</p>
              </Link>
            ))}
          </div>
          <div className="tx-notes">
            <div>
              <h3>{T('TDS·기술 지원', 'TDS and technical support', 'TDS・技術サポート')}</h3>
              <p>{T('제품별 TDS를 내려받고, 제품 선택과 시공 전 확인 사항은 기술정보 페이지와 상담으로 안내합니다.', 'Download TDS per product; product selection and pre-application checks are covered in our technical pages and consultation.', '製品別のTDSをダウンロードでき、製品選定や施工前の確認事項は技術情報ページと相談でご案内します。')}{' '}
                <Link href={`/${lang}/tds`}>TDS →</Link></p>
            </div>
            <div>
              <h3>{T('시편·샘플 제작, 테스트 지원', 'Test specimens, samples and test support', '試験片・サンプル製作、テスト支援')}</h3>
              <p>{T('접착성·적합성 확인을 위한 시편 제작, 샘플 제작, 테스트 지원이 가능합니다. 기재와 적용 조건을 알려 주시면 진행 방법을 안내합니다.', 'We can prepare test specimens and samples and support testing for adhesion and compatibility checks. Tell us the substrates and conditions and we will advise how to proceed.', '接着性・適合性確認のための試験片製作、サンプル製作、テスト支援に対応します。基材と適用条件をお知らせいただければ進め方をご案内します。')}</p>
            </div>
            <div>
              <h3>{T('국내 B2B 공급', 'Domestic B2B supply', '国内B2B供給')}</h3>
              <p>{T('프로젝트별 견적, 세금계산서 발행, 다중 현장 분할 납품이 가능합니다. 수도권 당일~익일, 전국 2~3일 이내 납품을 목표로 합니다.', 'Project quotations, tax invoices and multi-site split delivery. Same/next-day in the Seoul metro area and 2–3 days nationwide.', 'プロジェクト別見積、税金計算書の発行、複数現場への分割納品に対応。首都圏は当日〜翌日、全国は2〜3日以内が目安です。')}</p>
            </div>
            <div>
              <h3>{T('소량 구매', 'Small orders', '少量購入')}</h3>
              <p>{T('소량·개인 구매는 네이버 스마트스토어에서 주문하실 수 있습니다.', 'Small orders can be placed on our Naver Smart Store.', '少量のご注文はNaverスマートストアをご利用ください。')}{' '}
                <a href={SMARTSTORE_URL} target="_blank" rel="noopener noreferrer">{T('스마트스토어', 'Smart Store', 'スマートストア')} ↗</a></p>
            </div>
          </div>

          <h3 className="mt-5" style={{ fontSize: '1.4rem' }}>{T('수출', 'Export', '輸出')}</h3>
          <dl className="ab-dl mb-3">
            {exportRows.map(([k, v]) => (<Fragment key={k}><dt>{k}</dt><dd>{v}</dd></Fragment>))}
          </dl>
          <Link href={`/${lang}/export`} className="btn btn-outline-dark btn-sm mb-5">{T('수출 상세·문의', 'Export details and inquiry', '輸出の詳細・お問い合わせ')} →</Link>

          <h3 style={{ fontSize: '1.4rem' }}>{T('견적·문의 절차', 'How to order', 'お見積り・ご注文の流れ')}</h3>
          <ol className="ab-steps mt-3">
            {steps.map((s, i) => (<li key={i}><h3>{s.title}</h3><p>{s.desc}</p></li>))}
          </ol>
          
        </section>

        <section id="quality" className="ab-sec">
          <span className="tx-eyebrow">Quality · Environment · Safety</span>
          <h2 className="tx-sec-h">{T('품질·환경·안전', 'Quality, environment and safety', '品質・環境・安全')}</h2>
          <p className="tx-sec-sub">{T('인증을 내세우기보다, 지금 지키고 있는 운영 원칙을 적었습니다.', 'Rather than claiming certifications, we list the operating principles we actually follow.', '認証を掲げるのではなく、実際に守っている運営原則を記載しています。')}</p>
          <div className="tx-grid">
            {cardsQuality.map((c) => (
              <div key={c.no}><span className="tx-no">{c.no}</span><h3>{c.title}</h3><p>{c.desc}</p></div>
            ))}
          </div>
          <Link href={`/${lang}/sustainability`} className="btn btn-outline-dark btn-sm">{T('지속가능경영 보기', 'Sustainability', 'サステナビリティ')} →</Link>
        </section>

        <section id="locations" className="ab-sec">
          <span className="tx-eyebrow">Location</span>
          <h2 className="tx-sec-h">{T('사업장 · 오시는 길', 'Location and contact', '事業所・アクセス')}</h2>
          <dl className="ab-dl">
            <dt>{T('주소', 'Address', '住所')}</dt><dd>{addr}</dd>
            <dt>{T('전화', 'Phone', '電話')}</dt><dd><a href={PHONE_TEL}>{PHONE_DISPLAY}</a></dd>
            <dt>{T('이메일', 'Email', 'メール')}</dt><dd><a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></dd>
          </dl>
          <div className="ab-links d-flex flex-wrap gap-3 mt-3">
            <a href={MAP_URL} target="_blank" rel="noopener noreferrer">{T('지도 보기', 'View map', '地図を見る')} ↗</a>
            {KAKAO_URL && <a href={KAKAO_URL} target="_blank" rel="noopener noreferrer">{T('카카오톡 문의', 'KakaoTalk', 'KakaoTalk')} ↗</a>}
          </div>
        </section>
      </div>

      <section className="bg-primary text-white mt-5" style={{ padding: '5rem 0' }}>
        <div className="container">
          <h2 style={{ fontSize: 'clamp(1.8rem,3.4vw,2.8rem)' }}>{t.cta_title}</h2>
          <p style={{ color: '#c4c8cc', maxWidth: '40rem' }}>{t.cta_desc}</p>
          <div className="d-flex flex-wrap gap-2 mt-4">
            <a href={`mailto:${COMPANY.email}`} className="btn btn-light">{COMPANY.email} →</a>
            <Link href={`/${lang}/quote`} className="btn btn-outline-light">{t.btn_quote_req}</Link>
          </div>
        </div>
      </section>
    </Tx>
  );
}
