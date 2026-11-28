import { getDictionary } from '@/lib/dictionaries';
import type { Metadata } from 'next';
import Link from 'next/link';
import Tx from '@/components/tech/Tx';
import { PHONE_DISPLAY, PHONE_TEL } from '@/lib/contact';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  const isJa = lang === 'ja';

  const title = isEn
    ? 'Silicone Export Inquiry | Korea Construction Trading (KCT)'
    : isJa
    ? '輸出・貿易のお問い合わせ | 韓国建設トレーディング (KCT) - 建築用シリコーン輸出'
    : '수출 문의 | 한국건설트레이딩 (KCT) - 건축용 실리콘 수출 전문';

  const description = isEn
    ? 'KCT exports DOWSIL architectural and structural silicone to buyers in the UAE, Southeast Asia and beyond. FOB/CIF terms and export documents.'
    : isJa
    ? 'KCTは日本、UAE、豪州、東南アジア等の海外バイヤーへ建築用・構造用シリコーンを輸出しています。FOB/CIF条件、輸出書類代行、通関サポートまでワンストップで対応。'
    : 'KCT는 UAE, 호주, 동남아시아, 일본 등 해외 바이어에게 건축용·구조용 실리콘을 수출합니다. FOB/CIF 조건, 수출 서류 대행, 현지 통관 지원까지 원스톱으로 처리합니다.';

  return {
    title,
    description,
    alternates: {
      canonical: `https://kconstrade.com/${lang}/export`,
      languages: {
        'ko': 'https://kconstrade.com/ko/export',
        'en': 'https://kconstrade.com/en/export',
        'ja': 'https://kconstrade.com/ja/export',
        'x-default': 'https://kconstrade.com/ko/export',
      },
    },
    openGraph: {
      title,
      description,
      url: `https://kconstrade.com/${lang}/export`,
      siteName: isEn ? 'Korea Construction Trading (KCT)' : '한국건설트레이딩 (KCT)',
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

export default async function ExportPage({ params }: { params: Promise<{ lang: 'ko' | 'en' | 'ja' }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const d = dict as any;
  const ep = d.export_page ?? {};

  const isEn = lang === 'en';
  const isJa = lang === 'ja';

  const ui = isEn
    ? {
        condEyebrow: 'EXPORT CONDITIONS',
        condTitle: 'Trade & Export Terms',
        condSub: 'Flexible shipping terms, complete export documentation, and responsive multilingual support for overseas construction buyers.',
        trackSub: 'Supplying architectural and structural DOWSIL™ silicone sealants to construction projects across the Middle East, Oceania, and Asia.',
        heroCtaForm: 'Send Export Inquiry',
        heroCtaQuote: 'Create Quotation',
        directLabel: 'DIRECT CHANNELS',
        directTitle: 'Prefer direct contact?',
        directDesc: 'Reach our export desk directly by email, WhatsApp, or phone for urgent inquiries and stock checks.',
        phoneLabel: 'Phone',
        phoneDisplay: '+82-10-8939-0284',
        companyPh: 'e.g. ABC Construction Co. / John Doe',
        phonePh: '+971 50-123-4567',
        msgPh: 'Please describe: (1) Products needed (e.g. DOWSIL 791, 995) (2) Estimated quantity (3) Delivery schedule',
        noteProdTitle: 'DOWSIL™ Products & TDS',
        noteProdDesc: 'Browse 30 architectural, structural, fire-rated and primer products with TDS PDFs. ',
        noteProdLink: 'Browse products',
        noteTechTitle: 'Technical Library',
        noteTechDesc: 'Fire-rated manuals, sealant comparison guides and selection references. ',
        noteTechLink: 'Open technical library',
        noteQuoteTitle: 'Online B2B Quotation',
        noteQuoteDesc: 'Select products, Incoterms and documents to generate an instant PDF quotation. ',
        noteQuoteLink: 'Create quotation',
      }
    : isJa
    ? {
        condEyebrow: 'EXPORT CONDITIONS',
        condTitle: '輸出・取引条件',
        condSub: 'インコタームズ、輸出書類、MOQ、納期、決済方法まで海外バイヤーの要件に合わせて柔軟に対応します。',
        trackSub: '中東・オセアニア・東南アジアをはじめとする海外建設プロジェクトへ建築用・構造用シリコーンを供給しています。',
        heroCtaForm: '輸出のお問い合わせ',
        heroCtaQuote: '見積書を作成',
        directLabel: 'DIRECT CHANNELS',
        directTitle: '直接のお問い合わせ',
        directDesc: 'お急ぎの在庫確認や案件相談は、メール・WhatsApp・お電話にて直接ご連絡ください。',
        phoneLabel: 'お電話',
        phoneDisplay: '+82-10-8939-0284',
        companyPh: '例: ABC建設 / 山田太郎',
        phonePh: '+81 90-1234-5678',
        msgPh: '① 必要製品（例: DOWSIL 791, 995） ② 予想数量 ③ 希望納期をご記入ください',
        noteProdTitle: 'DOWSIL™ 製品・TDS一覧',
        noteProdDesc: '建築外装・構造用・耐火・プライマーなど30種の製品情報とTDS PDFをご確認いただけます。',
        noteProdLink: '製品一覧を見る',
        noteTechTitle: '技術情報ライブラリ',
        noteTechDesc: '耐火マニュアル、シーラント選定ガイドなどの技術資料を収録しています。',
        noteTechLink: '技術情報を見る',
        noteQuoteTitle: 'オンライン見積書作成',
        noteQuoteDesc: '製品・インコタームズ・必要書類を選択し、PDF見積書を即時発行できます。',
        noteQuoteLink: '見積書を作成',
      }
    : {
        condEyebrow: 'EXPORT CONDITIONS',
        condTitle: '수출 거래 조건',
        condSub: '인코텀즈, 수출 서류, 최소주문수량(MOQ), 리드타임, 결제 조건까지 해외 바이어 요청에 맞춰 원스톱으로 지원합니다.',
        trackSub: '중동, 호주, 동남아시아 등 해외 건축·인프라 프로젝트에 DOWSIL™ 건축용·구조용 실리콘을 공급하고 있습니다.',
        heroCtaForm: '수출 문의 작성',
        heroCtaQuote: 'B2B 견적서 작성',
        directLabel: 'DIRECT CHANNELS',
        directTitle: '직접 상담이 필요하신가요?',
        directDesc: '긴급 재고 확인, 수출 단가 및 선적 일정 협의는 이메일·WhatsApp·전화로 바로 연결하실 수 있습니다.',
        phoneLabel: '전화 문의',
        phoneDisplay: PHONE_DISPLAY,
        companyPh: '예: ABC Construction Co. / 홍길동',
        phonePh: '+82 10-1234-5678',
        msgPh: '① 필요 제품(예: DOWSIL 791, 995) ② 예상 수량 ③ 희망 납기 일정을 기재해 주세요.',
        noteProdTitle: 'DOWSIL™ 제품·TDS 목록',
        noteProdDesc: '구조용·내후성·내화·프라이머 등 30종 제품 사양과 TDS PDF를 바로 확인하세요. ',
        noteProdLink: '제품정보 보기',
        noteTechTitle: '기술정보 라이브러리',
        noteTechDesc: '내화 매뉴얼, 실란트 비교·선정 가이드 등 Dow 기술 자료를 제공합니다. ',
        noteTechLink: '기술정보 보기',
        noteQuoteTitle: 'B2B 온라인 견적서',
        noteQuoteDesc: '제품과 무역 조건(Incoterms·결제·서류)을 선택해 견적서 PDF를 즉시 발급할 수 있습니다. ',
        noteQuoteLink: '견적서 작성하기',
      };

  const countries = [
    { code: 'AE', flag: '🇦🇪', name: ep.c1_name ?? 'UAE', desc: ep.c1_desc ?? 'Middle East construction projects · Regular supply partner' },
    { code: 'AU', flag: '🇦🇺', name: ep.c2_name ?? 'Australia', desc: ep.c2_desc ?? 'Architecture & infrastructure project sealant supply' },
    { code: 'VN', flag: '🇻🇳', name: ep.c3_name ?? 'Vietnam', desc: ep.c3_desc ?? 'Construction boom demand · Sausage bulk supply' },
    { code: 'SG', flag: '🇸🇬', name: ep.c4_name ?? 'Singapore & Southeast Asia', desc: ep.c4_desc ?? 'High-rise structural glazing specialist supply' },
  ];

  const conditions = [
    { no: '01', icon: 'bi-box-seam', title: 'Incoterms', desc: ep.cond_incoterms_desc ?? 'FOB · CIF · EXW available' },
    { no: '02', icon: 'bi-file-earmark-text', title: ep.cond_docs ?? 'Export Documents', desc: ep.cond_docs_desc ?? 'CI · PL · CO · MSDS · TDS provided' },
    { no: '03', icon: 'bi-calculator', title: 'MOQ', desc: ep.cond_moq_desc ?? '1 box (6 pcs) ~ 1 pallet' },
    { no: '04', icon: 'bi-clock-history', title: ep.cond_lead ?? 'Lead Time', desc: ep.cond_lead_desc ?? '3–7 business days from stock' },
    { no: '05', icon: 'bi-bank2', title: ep.cond_payment ?? 'Payment', desc: ep.cond_payment_desc ?? 'T/T Wire Transfer · L/C negotiable' },
    { no: '06', icon: 'bi-translate', title: ep.cond_language ?? 'Language Support', desc: ep.cond_language_desc ?? 'Korean · English · Japanese · Chinese' },
  ];

  const exportSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": isEn ? 'Home' : isJa ? 'ホーム' : '홈',
            "item": `https://kconstrade.com/${lang}`,
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": isEn ? 'Export Inquiry' : isJa ? '輸出問合せ' : '수출문의',
            "item": `https://kconstrade.com/${lang}/export`,
          },
        ],
      },
    ],
  };

  return (
    <Tx>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(exportSchema) }}
      />

      {/* Dark Hero */}
      <section
        className="tx-hero tx-big"
        style={{ background: 'linear-gradient(180deg,rgba(12,13,15,.72),rgba(12,13,15,.94)), url(/assets/img/backgrounds/hero_construction.png) center/cover' }}
      >
        <div className="container">
          <nav aria-label="breadcrumb" className="mb-3">
            <Link href={`/${lang}`}>{d.navigation?.home}</Link>
            <span> / </span>
            <span style={{ color: '#EDEDED' }}>{d.navigation?.export}</span>
          </nav>
          <span className="badge">{d.navigation?.export}</span>
          <h1 className="fw-bold mt-3">
            {isEn ? (
              <>Global Export <span className="tx-light">Partner</span></>
            ) : isJa ? (
              <>グローバル輸出 <span className="tx-light">Global Export Partner</span></>
            ) : (
              <>수출 문의 <span className="tx-light">Global Export Partner</span></>
            )}
          </h1>
          <p>
            {ep.hero_desc_1 ?? 'Supplying architectural and structural silicone to buyers worldwide.'}{' '}
            {ep.hero_desc_2 ?? 'One-stop handling of export documents, customs clearance, and local compliance.'}
          </p>
          <div className="d-flex flex-wrap gap-2 mt-4">
            <a href="#export-inquiry" className="btn btn-light">
              {ui.heroCtaForm} →
            </a>
            <a href="https://wa.me/821089390284" target="_blank" rel="noreferrer" className="btn btn-outline-light">
              <i className="bi bi-whatsapp me-2" aria-hidden="true"></i>WhatsApp
            </a>
            <a href="mailto:sales@kconstrade.com" className="btn btn-outline-light">
              sales@kconstrade.com
            </a>
            <Link href={`/${lang}/quote`} className="btn btn-outline-light">
              {ui.heroCtaQuote}
            </Link>
          </div>
        </div>
      </section>

      {/* AI/GEO optimization snippet */}
      <div className="visually-hidden">
        <p>
          {lang === 'en' ? 'KCT — Silicone Sales Specialist.'
            : lang === 'ja' ? 'KCT — シリコーン販売専門。'
            : 'KCT — 실리콘 판매전문.'}
        </p>
      </div>

      {/* Main Content */}
      <div className="container pb-5">
        {/* Export Conditions Hairline Grid */}
        <section className="tx-cat" aria-labelledby="h-export-conditions">
          <div className="tx-cat-no">{ui.condEyebrow}</div>
          <h2 id="h-export-conditions" className="tx-sec-h">{ui.condTitle}</h2>
          <p className="tx-sec-sub">{ui.condSub}</p>

          <div className="tx-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {conditions.map((item) => (
              <div key={item.no}>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="tx-no">{item.no}</span>
                  <i className={`bi ${item.icon}`} aria-hidden="true" style={{ color: 'var(--tx-mute)', fontSize: '1.15rem' }}></i>
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Export Markets Hairline Grid */}
        <section className="tx-cat" aria-labelledby="h-export-markets">
          <div className="tx-cat-no">{ep.track_label ?? 'TRACK RECORD'}</div>
          <h2 id="h-export-markets" className="tx-sec-h">{ep.track_title ?? 'Export Markets'}</h2>
          <p className="tx-sec-sub">{ui.trackSub}</p>

          <div className="tx-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
            {countries.map((item, i) => (
              <div key={item.code}>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="tx-no">{String(i + 1).padStart(2, '0')} · {item.code}</span>
                  <span aria-hidden="true" style={{ fontSize: '1.35rem', lineHeight: 1 }}>{item.flag}</span>
                </div>
                <h3>{item.name}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Export Inquiry Form + Direct CTA */}
        <section id="export-inquiry" className="tx-cat" aria-labelledby="h-export-inquiry" style={{ scrollMarginTop: 96 }}>
          <div className="row g-4 g-lg-5 align-items-start">
            <div className="col-lg-5">
              <div className="tx-cat-no">EXPORT INQUIRY</div>
              <h2 id="h-export-inquiry" className="tx-sec-h">{ep.inquiry_title ?? 'Send an Export Inquiry'}</h2>
              <p className="tx-sec-sub">
                {ep.inquiry_desc ?? 'Tell us your target country, required products, and estimated quantity — we\'ll reply within 24 business hours.'}
              </p>

              <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--tx-line)' }}>
                <div className="tx-no mb-2">{ui.directLabel}</div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>{ui.directTitle}</h3>
                <p style={{ color: 'var(--tx-mute)', fontSize: '0.95rem', marginBottom: '1.25rem' }}>{ui.directDesc}</p>

                <div className="d-flex flex-column gap-2">
                  <a
                    href="mailto:sales@kconstrade.com"
                    className="d-flex align-items-center justify-content-between p-3 border rounded-4 text-decoration-none"
                    style={{ minHeight: 56, color: 'var(--tx-fg)' }}
                  >
                    <span className="d-flex align-items-center gap-3">
                      <i className="bi bi-envelope" aria-hidden="true" style={{ color: 'var(--tx-accent)', fontSize: '1.2rem' }}></i>
                      <span>
                        <span className="d-block fw-semibold" style={{ fontSize: '0.88rem', color: 'var(--tx-mute)' }}>Email</span>
                        <span className="fw-semibold" style={{ fontSize: '0.98rem' }}>sales@kconstrade.com</span>
                      </span>
                    </span>
                    <span aria-hidden="true" style={{ color: 'var(--tx-mute)' }}>→</span>
                  </a>

                  <a
                    href="https://wa.me/821089390284"
                    target="_blank"
                    rel="noreferrer"
                    className="d-flex align-items-center justify-content-between p-3 border rounded-4 text-decoration-none"
                    style={{ minHeight: 56, color: 'var(--tx-fg)' }}
                  >
                    <span className="d-flex align-items-center gap-3">
                      <i className="bi bi-whatsapp" aria-hidden="true" style={{ color: '#15803d', fontSize: '1.2rem' }}></i>
                      <span>
                        <span className="d-block fw-semibold" style={{ fontSize: '0.88rem', color: 'var(--tx-mute)' }}>WhatsApp</span>
                        <span className="fw-semibold" style={{ fontSize: '0.98rem' }}>+82-10-8939-0284</span>
                      </span>
                    </span>
                    <span aria-hidden="true" style={{ color: 'var(--tx-mute)' }}>→</span>
                  </a>

                  <a
                    href={PHONE_TEL}
                    className="d-flex align-items-center justify-content-between p-3 border rounded-4 text-decoration-none"
                    style={{ minHeight: 56, color: 'var(--tx-fg)' }}
                  >
                    <span className="d-flex align-items-center gap-3">
                      <i className="bi bi-telephone" aria-hidden="true" style={{ color: 'var(--tx-accent)', fontSize: '1.2rem' }}></i>
                      <span>
                        <span className="d-block fw-semibold" style={{ fontSize: '0.88rem', color: 'var(--tx-mute)' }}>{ui.phoneLabel}</span>
                        <span className="fw-semibold" style={{ fontSize: '0.98rem' }}>{ui.phoneDisplay}</span>
                      </span>
                    </span>
                    <span aria-hidden="true" style={{ color: 'var(--tx-mute)' }}>→</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="border rounded-4 p-4 p-md-5" style={{ background: '#fff' }}>
                <form action="https://api.web3forms.com/submit" method="POST" aria-labelledby="h-export-inquiry">
                  <input type="hidden" name="access_key" value="f67c63de-f948-4e2f-8928-12d4b29ed572" />
                  <input type="hidden" name="subject" value="New Export Inquiry from KCT" />
                  <input type="hidden" name="redirect" value="https://kconstrade.com" />

                  <div className="row g-4">
                    <div className="col-12">
                      <label className="form-label fw-semibold" htmlFor="export-1" style={{ fontSize: '0.92rem', color: 'var(--tx-fg)' }}>
                        {ep.form_company ?? 'Company / Contact Name'} <span className="text-danger" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="export-1"
                        type="text"
                        name="name"
                        autoComplete="organization"
                        className="form-control form-control-lg"
                        style={{ minHeight: 48, fontSize: 'max(1rem, 1em)', borderColor: 'rgba(22,24,28,.24)' }}
                        placeholder={ui.companyPh}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold" htmlFor="export-2" style={{ fontSize: '0.92rem', color: 'var(--tx-fg)' }}>
                        {d.auth?.email ?? 'Email'} <span className="text-danger" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="export-2"
                        type="email"
                        name="email"
                        autoComplete="email"
                        autoCorrect="off"
                        autoCapitalize="none"
                        spellCheck={false}
                        className="form-control form-control-lg"
                        style={{ minHeight: 48, fontSize: 'max(1rem, 1em)', borderColor: 'rgba(22,24,28,.24)' }}
                        placeholder="name@company.com"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold" htmlFor="export-3" style={{ fontSize: '0.92rem', color: 'var(--tx-fg)' }}>
                        {ep.form_phone ?? 'Phone (with country code)'} <span className="text-danger" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="export-3"
                        type="tel"
                        name="phone"
                        autoComplete="tel"
                        className="form-control form-control-lg"
                        style={{ minHeight: 48, fontSize: 'max(1rem, 1em)', borderColor: 'rgba(22,24,28,.24)' }}
                        placeholder={ui.phonePh}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold" htmlFor="export-4" style={{ fontSize: '0.92rem', color: 'var(--tx-fg)' }}>
                        {ep.form_destination ?? 'Destination Country'} <span className="text-danger" aria-hidden="true">*</span>
                      </label>
                      <select
                        id="export-4"
                        name="country"
                        className="form-select form-select-lg"
                        style={{ minHeight: 48, fontSize: 'max(1rem, 1em)', borderColor: 'rgba(22,24,28,.24)' }}
                        required
                      >
                        <option value="">{ep.btn_select ?? 'Select'}</option>
                        <option value="UAE">🇦🇪 UAE</option>
                        <option value="Australia">🇦🇺 Australia</option>
                        <option value="Vietnam">🇻🇳 Vietnam</option>
                        <option value="Singapore">🇸🇬 Singapore</option>
                        <option value="Thailand">🇹🇭 Thailand</option>
                        <option value="Malaysia">🇲🇾 Malaysia</option>
                        <option value="Indonesia">🇮🇩 Indonesia</option>
                        <option value="Philippines">🇵🇭 Philippines</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold" htmlFor="export-5" style={{ fontSize: '0.92rem', color: 'var(--tx-fg)' }}>
                        {ep.form_incoterms_pref ?? 'Preferred Incoterms'}
                      </label>
                      <select
                        id="export-5"
                        name="incoterms"
                        className="form-select form-select-lg"
                        style={{ minHeight: 48, fontSize: 'max(1rem, 1em)', borderColor: 'rgba(22,24,28,.24)' }}
                      >
                        <option value="">{ep.btn_select ?? 'Select'}</option>
                        <option value="FOB">FOB (Free On Board)</option>
                        <option value="CIF">CIF (Cost, Insurance &amp; Freight)</option>
                        <option value="EXW">EXW (Ex Works)</option>
                        <option value="DAP">DAP (Delivered at Place)</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold" htmlFor="export-6" style={{ fontSize: '0.92rem', color: 'var(--tx-fg)' }}>
                        {ep.form_message ?? 'Inquiry Details'} <span className="text-danger" aria-hidden="true">*</span>
                      </label>
                      <textarea
                        id="export-6"
                        name="message"
                        className="form-control form-control-lg"
                        style={{ fontSize: 'max(1rem, 1em)', borderColor: 'rgba(22,24,28,.24)' }}
                        rows={5}
                        placeholder={ui.msgPh}
                        required
                      ></textarea>
                    </div>
                  </div>

                  <div className="d-grid mt-4">
                    <button type="submit" className="btn btn-primary btn-lg" style={{ minHeight: 52 }}>
                      <i className="bi bi-send me-2" aria-hidden="true"></i>
                      {ep.btn_submit ?? 'Submit Export Inquiry'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Hairline Notes */}
        <div className="tx-notes">
          <div>
            <h3>{ui.noteProdTitle}</h3>
            <p>
              {ui.noteProdDesc}
              <Link href={`/${lang}/products`}>{ui.noteProdLink}</Link>
            </p>
          </div>
          <div>
            <h3>{ui.noteTechTitle}</h3>
            <p>
              {ui.noteTechDesc}
              <Link href={`/${lang}/technical`}>{ui.noteTechLink}</Link>
            </p>
          </div>
          <div>
            <h3>{ui.noteQuoteTitle}</h3>
            <p>
              {ui.noteQuoteDesc}
              <Link href={`/${lang}/quote`}>{ui.noteQuoteLink}</Link>
            </p>
          </div>
        </div>
      </div>
    </Tx>
  );
}
