import { getDictionary } from '@/lib/dictionaries'
import { createClient } from '@/lib/supabase/server'
import QuoteBuilder from '@/components/QuoteBuilder'
import Tx from '@/components/tech/Tx'
import type { PriceTier, Product } from '@/lib/pricing'
import type { Metadata } from 'next'
import Link from 'next/link'
import { PHONE_DISPLAY, PHONE_TEL } from '@/lib/contact'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: 'ko' | 'en' | 'ja' }>
}): Promise<Metadata> {
  const { lang } = await params
  const isEn = lang === 'en'
  const isJa = lang === 'ja'

  const title = isEn
    ? 'Request B2B Quote | Korea Construction Trading (KCT)'
    : isJa
    ? '見積もり依頼 (B2B) | 韓国建設トレーディング (KCT)'
    : 'B2B 온라인 견적서 발급 | 한국건설트레이딩 (KCT)'

  const description = isEn
    ? 'Instant online quotation for architectural and structural silicone sealants. Transparent B2B pricing, volume discounts, and custom PDF quote generation.'
    : isJa
    ? '建築用・構造用シリコーンシーラントのオンライン即時見積。事業者会員向けの特別単価、大量購入割引、PDF見積書の即時ダウンロードに対応しています。'
    : '건축용·구조용 실리콘 B2B 온라인 즉시 견적. 사업자 회원 등급별 맞춤 단가, 대량 구매 할인, PDF 견적서 즉시 다운로드.'

  return {
    title,
    description,
    alternates: {
      canonical: `https://kconstrade.com/${lang}/quote`,
      languages: {
        'ko': 'https://kconstrade.com/ko/quote',
        'en': 'https://kconstrade.com/en/quote',
        'ja': 'https://kconstrade.com/ja/quote',
        'x-default': 'https://kconstrade.com/ko/quote',
      },
    },
    openGraph: {
      title,
      description,
      url: `https://kconstrade.com/${lang}/quote`,
      siteName: '한국건설트레이딩 (KCT)',
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
  }
}

// Fallback products when Supabase isn't configured yet
const FALLBACK_PRODUCTS: Product[] = [
  { id: 1, brand: 'DOWSIL', sku: '790', name_ko: 'DOWSIL™ 790 저모듈러스 실란트', name_en: null, list_price: 18000, price_standard: 16200, price_silver: 17100, price_gold: 16200, price_platinum: 15300, unit: '개', is_active: true, sort_order: 1 },
  { id: 2, brand: 'DOWSIL', sku: '791', name_ko: 'DOWSIL™ 791 커튼월 내후성 실란트', name_en: null, list_price: 20000, price_standard: 18000, price_silver: 19000, price_gold: 18000, price_platinum: 17000, unit: '개', is_active: true, sort_order: 2 },
  { id: 3, brand: 'DOWSIL', sku: '795', name_ko: 'DOWSIL™ 795 다목적 구조용 실란트', name_en: null, list_price: 22000, price_standard: 19800, price_silver: 20900, price_gold: 19800, price_platinum: 18700, unit: '개', is_active: true, sort_order: 3 },
  { id: 4, brand: 'DOWSIL', sku: '995', name_ko: 'DOWSIL™ 995 고장력 구조용 실란트', name_en: null, list_price: 25000, price_standard: 22500, price_silver: 23750, price_gold: 22500, price_platinum: 21250, unit: '개', is_active: true, sort_order: 4 },
  { id: 5, brand: 'DOWSIL', sku: '756-SMS', name_ko: 'DOWSIL™ 756 SMS 오염방지형', name_en: null, list_price: 24000, price_standard: 21600, price_silver: 22800, price_gold: 21600, price_platinum: 20400, unit: '개', is_active: true, sort_order: 5 },
  { id: 7, brand: 'DOWSIL', sku: '732', name_ko: 'DOWSIL™ 732 다목적 접착 실란트', name_en: null, list_price: 14000, price_standard: 12600, price_silver: 13300, price_gold: 12600, price_platinum: 11900, unit: '개', is_active: true, sort_order: 7 },
  { id: 8, brand: 'DOWSIL', sku: '977', name_ko: 'DOWSIL™ 977 소시지형', name_en: null, list_price: 16000, price_standard: 14400, price_silver: 15200, price_gold: 14400, price_platinum: 13600, unit: '개', is_active: true, sort_order: 8 },
  { id: 9, brand: 'DOWSIL', sku: '991', name_ko: 'DOWSIL™ 991 소시지형', name_en: null, list_price: 18000, price_standard: 16200, price_silver: 17100, price_gold: 16200, price_platinum: 15300, unit: '개', is_active: true, sort_order: 9 },
]

export default async function QuotePage({
  params,
}: {
  params: Promise<{ lang: 'ko' | 'en' | 'ja' }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  const d = dict as any
  const isEn = lang === 'en'
  const isJa = lang === 'ja'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Load products from DB; fall back to static list if unavailable
  let products: Product[] = FALLBACK_PRODUCTS
  let userTier: PriceTier = 'standard'

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your_supabase')) {
    const { data: dbProducts } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')

    if (dbProducts && dbProducts.length > 0) products = dbProducts as Product[]

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('tier')
        .eq('id', user.id)
        .single()
      if (profile?.tier) userTier = profile.tier as PriceTier
    }
  }

  const notes = isEn
    ? {
        t1: 'Products & TDS',
        p1: 'Check full specifications and download TDS PDFs for all 30 DOWSIL™ products. ',
        l1: 'Browse products',
        t2: 'Export Inquiry',
        p2: 'Need FOB/CIF shipping, customs documents, or overseas bulk supply? ',
        l2: 'Go to export inquiry',
        t3: 'Direct Sales Support',
        p3: 'For custom project pricing or unlisted grades, contact our sales team: ',
        phone: '+82 10-8939-0284',
      }
    : isJa
    ? {
        t1: '製品情報・TDS',
        p1: 'DOWSIL™全30種の仕様とTDS資料をご確認いただけます。',
        l1: '製品一覧を見る',
        t2: '輸出のお問い合わせ',
        p2: 'FOB/CIF条件や輸出書類を含む海外出荷のご相談はこちら。',
        l2: '輸出問い合わせへ',
        t3: '営業担当へのお問い合わせ',
        p3: '大量案件や掲載外製品の単価確認は直接ご連絡ください。',
        phone: '+82 10-8939-0284',
      }
    : {
        t1: '제품 사양 · TDS',
        p1: 'DOWSIL™ 30종 전체 제품 사양과 TDS PDF를 먼저 확인하실 수 있습니다. ',
        l1: '제품정보 보기',
        t2: '해외 수출 문의',
        p2: 'FOB/CIF 조건, 수출 서류 및 해외 발주는 수출 문의 페이지를 이용해 주세요. ',
        l2: '수출문의 바로가기',
        t3: '직접 상담 · 특가 문의',
        p3: '대량 프로젝트 단가나 목록 외 제품 견적은 영업 담당자에게 문의해 주세요. ',
        phone: PHONE_DISPLAY,
      }

  return (
    <Tx>
      {/* Dark Hero */}
      <section
        className="tx-hero"
        style={{ background: 'linear-gradient(180deg,rgba(12,13,15,.74),rgba(12,13,15,.95)), url(/assets/img/backgrounds/hero_construction.png) center/cover' }}
      >
        <div className="container">
          <nav aria-label="breadcrumb" className="mb-3">
            <Link href={`/${lang}`}>{d.navigation.home}</Link>
            <span> / </span>
            <span style={{ color: '#EDEDED' }}>{d.navigation.quote}</span>
          </nav>
          <span className="badge">{d.quote.label}</span>
          <h1 className="fw-bold mt-3">{d.quote.title}</h1>
          <p>{d.quote.subtitle}</p>
          <div className="d-flex flex-wrap align-items-center gap-2 mt-4">
            {user ? (
              <>
                <span
                  className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill"
                  style={{ border: '1px solid rgba(237,237,237,.22)', background: 'rgba(255,255,255,.06)', color: '#EDEDED', fontSize: '0.88rem' }}
                >
                  <i className="bi bi-person-check" aria-hidden="true" style={{ color: '#8B7CFF' }}></i>
                  {user.email}
                </span>
                <Link href={`/${lang}/quote/history`} className="btn btn-light btn-sm">
                  <i className="bi bi-clock-history me-1" aria-hidden="true"></i>
                  {d.quote.history_title} →
                </Link>
                <Link href={`/${lang}/profile`} className="btn btn-outline-light btn-sm">
                  {d.navigation.mypage}
                </Link>
              </>
            ) : (
              <>
                <Link href={`/${lang}/auth/login`} className="btn btn-light btn-sm">
                  {d.navigation.login} →
                </Link>
                <Link href={`/${lang}/products`} className="btn btn-outline-light btn-sm">
                  {d.navigation.products}
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Builder */}
      <section className="py-5">
        <div className="container pb-5">
          <QuoteBuilder
            products={products}
            userTier={userTier}
            userId={user?.id ?? null}
            lang={lang}
            dict={d}
          />

          <div className="tx-notes">
            <div>
              <h3>{notes.t1}</h3>
              <p>
                {notes.p1}
                <Link href={`/${lang}/products`}>{notes.l1}</Link>
              </p>
            </div>
            <div>
              <h3>{notes.t2}</h3>
              <p>
                {notes.p2}
                <Link href={`/${lang}/export`}>{notes.l2}</Link>
              </p>
            </div>
            <div>
              <h3>{notes.t3}</h3>
              <p>
                {notes.p3}
                <a href="mailto:sales@kconstrade.com">sales@kconstrade.com</a> ·{' '}
                <a href={PHONE_TEL}>{notes.phone}</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </Tx>
  )
}
