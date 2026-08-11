import { getDictionary } from '@/lib/dictionaries'
import { createClient } from '@/lib/supabase/server'
import QuoteBuilder from '@/components/QuoteBuilder'
import type { PriceTier, Product } from '@/lib/pricing'
import Link from 'next/link'

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

  return (
    <>
      {/* Hero */}
      <section className="position-relative overflow-hidden pt-11 pb-7 bg-white" style={{ minHeight: '30vh', display: 'flex', alignItems: 'center' }}>
        <div className="container position-relative z-1 mt-5">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center">
              <span className="h6 fw-bold text-uppercase text-primary">{d.quote.label}</span>
              <h1 className="display-4 mb-3 fw-bold text-dark">{d.quote.title}</h1>
              <p className="lead fw-medium text-body-secondary">{d.quote.subtitle}</p>
              {user && (
                <div className="d-flex justify-content-center gap-2 mt-3">
                  <span className="badge bg-primary rounded-pill px-3 py-2">
                    <i className="bi bi-person-check me-1"></i>{user.email}
                  </span>
                  <a href={`/${lang}/quote/history`} className="btn btn-sm btn-outline-primary rounded-pill px-3">
                    <i className="bi bi-clock-history me-1"></i>{d.quote.history_title}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Builder */}
      <section className="py-9 py-lg-11" data-form-section>
        <div className="container">
          <QuoteBuilder
            products={products}
            userTier={userTier}
            userId={user?.id ?? null}
            lang={lang}
            dict={d}
          />
        </div>
      </section>
    </>
  )
}
