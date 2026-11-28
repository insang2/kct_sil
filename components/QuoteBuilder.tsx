'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/client'
import { getPrice, type PriceTier, type Product } from '@/lib/pricing'
import type { QuoteData, QuoteItem, TradeTerms } from '@/lib/quote-types'

const PDFDownloadButton = dynamic(
  () => import('@/components/PDFDownloadButton'),
  { ssr: false }
)

interface SelectedItem {
  product: Product
  quantity: number
}

interface QuoteBuilderProps {
  products: Product[]
  userTier: PriceTier
  userId: string | null
  lang: string
  dict: {
    quote: {
      customer_info: string
      product_select: string
      quantity: string
      unit_price: string
      amount: string
      product_name: string
      subtotal: string
      tax: string
      total: string
      notes: string
      notes_placeholder: string
      btn_generate: string
      btn_save: string
      btn_new: string
      quote_number: string
      quote_date: string
    }
    auth: { company_name: string; contact_person: string; email: string; phone: string }
  }
}

function generateQuoteNumber() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const rand = Math.floor(Math.random() * 900 + 100)
  return `KCT-${y}${m}${d}-${rand}`
}

const INCOTERMS = ['EXW', 'FOB', 'CFR', 'CIF', 'DAP', 'DDP']
const PAYMENT_TERMS = ['T/T in Advance', 'T/T 30 Days', 'T/T 60 Days', 'L/C at Sight', 'D/P', 'D/A']
const CURRENCIES = ['KRW', 'USD', 'JPY', 'TWD', 'EUR']
const LEAD_TIMES = ['1 Week', '2 Weeks', '3 Weeks', '4 Weeks', '6 Weeks', 'TBD']
const PORTS = ['Busan, Korea', 'Incheon, Korea']
const VALIDITIES = ['15 Days', '30 Days', '60 Days', '90 Days']
const DOCUMENTS = [
  'Commercial Invoice',
  'Packing List',
  'Bill of Lading (B/L)',
  'Certificate of Origin (C/O)',
  'COA (Certificate of Analysis)',
  'MSDS / SDS',
  'Insurance Certificate',
]

const DEFAULT_TRADE: TradeTerms = {
  incoterms: 'FOB',
  paymentTerms: 'T/T in Advance',
  currency: 'USD',
  portOfLoading: 'Busan, Korea',
  leadTime: '2 Weeks',
  validity: '30 Days',
  documents: ['Commercial Invoice', 'Packing List'],
}

function ChipGroup({
  options,
  value,
  onChange,
}: {
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="d-flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          aria-pressed={value === opt}
          className={`btn btn-sm rounded-pill px-3 ${value === opt ? 'btn-primary' : 'btn-outline-secondary'}`}
          style={{ fontSize: '0.82rem', minHeight: 38 }}
          onClick={() => onChange(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

export default function QuoteBuilder({ products, userTier, userId, lang, dict }: QuoteBuilderProps) {
  const t = dict.quote
  const ta = dict.auth

  const [selected, setSelected] = useState<Record<number, SelectedItem>>({})
  const [customerCompany, setCustomerCompany] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [tradeTerms, setTradeTerms] = useState<TradeTerms>(DEFAULT_TRADE)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [quoteNumber] = useState(generateQuoteNumber)
  const [quoteDate] = useState(() => new Date().toLocaleDateString('ko-KR'))
  const [pdfReady, setPdfReady] = useState(false)

  useEffect(() => { setPdfReady(true) }, [])

  function setTrade<K extends keyof TradeTerms>(key: K, value: TradeTerms[K]) {
    setTradeTerms(prev => ({ ...prev, [key]: value }))
  }

  function toggleDoc(doc: string) {
    setTradeTerms(prev => ({
      ...prev,
      documents: prev.documents.includes(doc)
        ? prev.documents.filter(d => d !== doc)
        : [...prev.documents, doc],
    }))
  }

  function toggleProduct(product: Product) {
    setSelected(prev => {
      if (prev[product.id]) {
        const next = { ...prev }
        delete next[product.id]
        return next
      }
      return { ...prev, [product.id]: { product, quantity: 1 } }
    })
  }

  function setQuantity(productId: number, qty: number) {
    if (qty < 1) return
    setSelected(prev => ({
      ...prev,
      [productId]: { ...prev[productId], quantity: qty },
    }))
  }

  const items: QuoteItem[] = Object.values(selected).map(({ product, quantity }) => {
    const unit_price = getPrice(product, userTier)
    return {
      id: product.id,
      name_ko: product.name_ko,
      name_en: product.name_en ?? null,
      sku: product.sku,
      unit: product.unit,
      quantity,
      unit_price,
      amount: unit_price * quantity,
    }
  })

  const subtotal = items.reduce((s, i) => s + i.amount, 0)
  const tax = Math.round(subtotal * 0.1)
  const total = subtotal + tax

  const quoteData: QuoteData = {
    quoteNumber,
    quoteDate,
    customerCompany,
    customerName,
    customerEmail,
    customerPhone,
    items,
    subtotal,
    tax,
    total,
    notes,
    tradeTerms,
  }

  async function handleSave() {
    if (!userId || items.length === 0) return
    setSaving(true)
    setSaveMsg('')
    const supabase = createClient()
    const { error } = await supabase.from('quotes').insert({
      user_id: userId,
      quote_number: quoteNumber,
      customer_company: customerCompany,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      items,
      subtotal,
      tax,
      total,
      notes,
      trade_terms: tradeTerms,
    })
    setSaving(false)
    setSaveMsg(error ? '저장 실패. 다시 시도해 주세요.' : '견적서가 저장되었습니다.')
  }

  const fieldStyle = {
    minHeight: 44,
    fontSize: 'max(1rem, 1em)',
    borderColor: 'rgba(22,24,28,.22)',
    backgroundColor: '#fff',
    color: '#16181C',
  } as const

  return (
    <div className="row g-4 g-lg-5 align-items-start">
      {/* Left: Product selection + Trade Terms */}
      <div className="col-lg-7">
        {/* 01 Product Selection */}
        <div className="mb-5">
          <div className="tx-no mb-1">01 · PRODUCTS</div>
          <h2 className="h4 fw-bold mb-3">{t.product_select}</h2>
          <div className="border rounded-4 overflow-hidden" style={{ background: '#fff' }}>
            {products.map((product, idx) => {
              const checked = !!selected[product.id]
              const price = getPrice(product, userTier)
              return (
                <div
                  key={product.id}
                  className="d-flex flex-wrap flex-sm-nowrap align-items-center gap-3 py-3 px-3 px-md-4"
                  style={{
                    borderTop: idx === 0 ? 'none' : '1px solid var(--tx-line)',
                    background: checked ? 'rgba(91, 73, 230, 0.055)' : '#fff',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <input
                    className="form-check-input flex-shrink-0 mt-0"
                    style={{ width: 20, height: 20, accentColor: '#5b49e6', cursor: 'pointer' }}
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleProduct(product)}
                    id={`product-${product.id}`}
                  />
                  <label className="flex-grow-1 mb-0" htmlFor={`product-${product.id}`} style={{ cursor: 'pointer', minWidth: 160 }}>
                    <div className="fw-semibold" style={{ fontSize: '0.96rem', color: 'var(--tx-fg)' }}>{product.name_ko}</div>
                    {product.sku && <div style={{ fontSize: '0.8rem', color: 'var(--tx-mute)' }}>SKU: {product.sku}</div>}
                  </label>
                  <div className="text-end flex-shrink-0 ms-auto">
                    <div className="fw-bold" style={{ fontSize: '0.94rem', color: checked ? 'var(--tx-accent)' : 'var(--tx-fg)', fontVariantNumeric: 'tabular-nums' }}>
                      {price.toLocaleString('ko-KR')}원/{product.unit}
                    </div>
                  </div>
                  {checked && (
                    <div className="d-flex align-items-center gap-1 flex-shrink-0">
                      <button
                        type="button"
                        aria-label={`${product.name_ko} -`}
                        className="btn btn-outline-secondary btn-sm"
                        style={{ minWidth: 36, minHeight: 36, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => setQuantity(product.id, (selected[product.id]?.quantity ?? 1) - 1)}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        aria-label={`${product.name_ko} ${t.quantity}`}
                        className="form-control form-control-sm text-center"
                        style={{ width: 60, minHeight: 36, fontSize: 'max(1rem, 0.92rem)', borderColor: 'rgba(22,24,28,.22)' }}
                        min={1}
                        value={selected[product.id]?.quantity ?? 1}
                        onChange={e => setQuantity(product.id, parseInt(e.target.value) || 1)}
                      />
                      <button
                        type="button"
                        aria-label={`${product.name_ko} +`}
                        className="btn btn-outline-secondary btn-sm"
                        style={{ minWidth: 36, minHeight: 36, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => setQuantity(product.id, (selected[product.id]?.quantity ?? 1) + 1)}
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* 02 Trade Terms */}
        <div className="border rounded-4 p-4 p-md-5" style={{ background: '#fff' }}>
          <div className="tx-no mb-1">02 · TRADE TERMS</div>
          <h2 className="h4 fw-bold mb-1">
            <i className="bi bi-globe2 me-2" aria-hidden="true" style={{ color: 'var(--tx-accent)' }}></i>
            Trade Terms
          </h2>
          <p className="mb-4" style={{ color: 'var(--tx-mute)', fontSize: '0.92rem' }}>
            수출 견적 시 적용할 무역 조건을 선택하세요.
          </p>

          <div className="mb-4 pb-4" style={{ borderBottom: '1px solid var(--tx-line)' }}>
            <div className="form-label fw-semibold small mb-2" style={{ color: 'var(--tx-fg)' }}>Incoterms 2020</div>
            <ChipGroup options={INCOTERMS} value={tradeTerms.incoterms} onChange={v => setTrade('incoterms', v)} />
            <div className="mt-2" style={{ fontSize: '0.8rem', color: 'var(--tx-mute)' }}>
              {{
                EXW: 'EXW — 공장인도 (매도인 최소 의무)',
                FOB: 'FOB — 본선인도 (선적항 위험 이전)',
                CFR: 'CFR — 운임포함 (목적항까지 운임 부담)',
                CIF: 'CIF — 운임·보험료포함 (운임+보험 부담)',
                DAP: 'DAP — 목적지인도 (목적지까지 위험 부담)',
                DDP: 'DDP — 관세지급인도 (매도인 최대 의무)',
              }[tradeTerms.incoterms]}
            </div>
          </div>

          <div className="mb-4 pb-4" style={{ borderBottom: '1px solid var(--tx-line)' }}>
            <div className="form-label fw-semibold small mb-2" style={{ color: 'var(--tx-fg)' }}>Payment Terms</div>
            <ChipGroup options={PAYMENT_TERMS} value={tradeTerms.paymentTerms} onChange={v => setTrade('paymentTerms', v)} />
          </div>

          <div className="mb-4 pb-4" style={{ borderBottom: '1px solid var(--tx-line)' }}>
            <div className="form-label fw-semibold small mb-2" style={{ color: 'var(--tx-fg)' }}>Currency</div>
            <ChipGroup options={CURRENCIES} value={tradeTerms.currency} onChange={v => setTrade('currency', v)} />
          </div>

          <div className="row g-3 mb-4 pb-4" style={{ borderBottom: '1px solid var(--tx-line)' }}>
            <div className="col-sm-6">
              <label className="form-label fw-semibold small" htmlFor="quote-1" style={{ color: 'var(--tx-fg)' }}>Port of Loading</label>
              <select
                id="quote-1"
                className="form-select"
                style={fieldStyle}
                value={tradeTerms.portOfLoading}
                onChange={e => setTrade('portOfLoading', e.target.value)}
              >
                {PORTS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="col-sm-6">
              <label className="form-label fw-semibold small" htmlFor="quote-2" style={{ color: 'var(--tx-fg)' }}>Lead Time</label>
              <select
                id="quote-2"
                className="form-select"
                style={fieldStyle}
                value={tradeTerms.leadTime}
                onChange={e => setTrade('leadTime', e.target.value)}
              >
                {LEAD_TIMES.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div className="mb-4 pb-4" style={{ borderBottom: '1px solid var(--tx-line)' }}>
            <div className="form-label fw-semibold small mb-2" style={{ color: 'var(--tx-fg)' }}>Quote Validity</div>
            <ChipGroup options={VALIDITIES} value={tradeTerms.validity} onChange={v => setTrade('validity', v)} />
          </div>

          <div>
            <div className="form-label fw-semibold small mb-2" style={{ color: 'var(--tx-fg)' }}>Documents Provided</div>
            <div className="row g-2">
              {DOCUMENTS.map(doc => (
                <div key={doc} className="col-sm-6">
                  <div className="form-check d-flex align-items-center gap-2">
                    <input
                      className="form-check-input mt-0"
                      style={{ width: 18, height: 18, accentColor: '#5b49e6', cursor: 'pointer' }}
                      type="checkbox"
                      id={`doc-${doc}`}
                      checked={tradeTerms.documents.includes(doc)}
                      onChange={() => toggleDoc(doc)}
                    />
                    <label className="form-check-label small" htmlFor={`doc-${doc}`} style={{ color: 'var(--tx-fg)', cursor: 'pointer' }}>
                      {doc}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right: Customer info + summary */}
      <div className="col-lg-5" style={{ position: 'sticky', top: 96 }}>
        {/* 03 Customer Info */}
        <div className="border rounded-4 p-4 mb-4" style={{ background: '#fff' }}>
          <div className="tx-no mb-1">03 · CUSTOMER</div>
          <h2 className="h5 fw-bold mb-4">{t.customer_info}</h2>
          <div className="mb-3">
            <label className="form-label fw-semibold small" htmlFor="quote-3" style={{ color: 'var(--tx-fg)' }}>{ta.company_name}</label>
            <input
              id="quote-3"
              type="text"
              autoComplete="organization"
              className="form-control"
              style={fieldStyle}
              value={customerCompany}
              onChange={e => setCustomerCompany(e.target.value)}
              placeholder="예: ABC Trading Co., Ltd."
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold small" htmlFor="quote-4" style={{ color: 'var(--tx-fg)' }}>{ta.contact_person}</label>
            <input
              id="quote-4"
              type="text"
              autoComplete="name"
              className="form-control"
              style={fieldStyle}
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              placeholder="예: John Smith"
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold small" htmlFor="quote-5" style={{ color: 'var(--tx-fg)' }}>{ta.email}</label>
            <input
              id="quote-5"
              type="email"
              autoComplete="email"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              className="form-control"
              style={fieldStyle}
              value={customerEmail}
              onChange={e => setCustomerEmail(e.target.value)}
              placeholder="name@company.com"
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold small" htmlFor="quote-6" style={{ color: 'var(--tx-fg)' }}>{ta.phone}</label>
            <input
              id="quote-6"
              type="tel"
              autoComplete="tel"
              className="form-control"
              style={fieldStyle}
              value={customerPhone}
              onChange={e => setCustomerPhone(e.target.value)}
              placeholder="+81-XX-XXXX-XXXX"
            />
          </div>
          <div className="mb-0">
            <label className="form-label fw-semibold small" htmlFor="quote-7" style={{ color: 'var(--tx-fg)' }}>{t.notes}</label>
            <textarea
              id="quote-7"
              className="form-control"
              style={{ ...fieldStyle, minHeight: 88 }}
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder={t.notes_placeholder}
            />
          </div>
        </div>

        {/* 04 Summary */}
        <div className="border rounded-4 p-4 mb-4" style={{ background: '#fff' }}>
          <div className="d-flex justify-content-between align-items-baseline mb-3">
            <div>
              <div className="tx-no mb-1">04 · SUMMARY</div>
              <h2 className="h5 fw-bold mb-0">Quote Summary</h2>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--tx-mute)', fontVariantNumeric: 'tabular-nums' }}>
              {quoteNumber}
            </span>
          </div>

          {items.length === 0 ? (
            <p className="small mb-3" style={{ color: 'var(--tx-mute)' }}>제품을 선택해 주세요.</p>
          ) : (
            <ul className="list-unstyled mb-3" style={{ fontSize: '0.88rem' }}>
              {items.map(item => (
                <li key={item.id} className="d-flex justify-content-between gap-2 py-1" style={{ borderBottom: '1px solid rgba(22,24,28,.06)' }}>
                  <span className="text-truncate" style={{ color: 'var(--tx-fg)' }}>{item.name_ko} ×{item.quantity}</span>
                  <span className="fw-semibold flex-shrink-0" style={{ fontVariantNumeric: 'tabular-nums' }}>{item.amount.toLocaleString('ko-KR')}원</span>
                </li>
              ))}
            </ul>
          )}

          <div className="pt-3" style={{ borderTop: '1px solid var(--tx-line)' }}>
            <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--tx-mute)' }}>{t.subtotal}</span>
              <span className="fw-semibold" style={{ fontVariantNumeric: 'tabular-nums' }}>{subtotal.toLocaleString('ko-KR')}원</span>
            </div>
            <div className="d-flex justify-content-between mb-2" style={{ fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--tx-mute)' }}>{t.tax}</span>
              <span className="fw-semibold" style={{ fontVariantNumeric: 'tabular-nums' }}>{tax.toLocaleString('ko-KR')}원</span>
            </div>
            <div className="d-flex justify-content-between align-items-baseline mb-0 pt-2" style={{ borderTop: '1px solid var(--tx-line)' }}>
              <span className="fw-bold" style={{ color: 'var(--tx-fg)' }}>{t.total}</span>
              <span className="fw-bold fs-4" style={{ color: 'var(--tx-accent)', fontVariantNumeric: 'tabular-nums' }}>
                {total.toLocaleString('ko-KR')}원
              </span>
            </div>
          </div>
        </div>

        {/* Trade Terms Summary */}
        <div className="border rounded-4 p-3 mb-4" style={{ background: '#fff' }}>
          <div className="row g-2" style={{ fontSize: '0.82rem' }}>
            {[
              ['Incoterms', tradeTerms.incoterms],
              ['Payment', tradeTerms.paymentTerms],
              ['Currency', tradeTerms.currency],
              ['Port', tradeTerms.portOfLoading],
              ['Lead Time', tradeTerms.leadTime],
              ['Validity', tradeTerms.validity],
            ].map(([label, value]) => (
              <div key={label} className="col-6 d-flex flex-column">
                <span style={{ color: 'var(--tx-mute)', fontSize: '0.75rem' }}>{label}</span>
                <span className="fw-semibold" style={{ color: 'var(--tx-fg)' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="d-grid gap-2">
          {pdfReady && items.length > 0 ? (
            <PDFDownloadButton
              data={quoteData}
              fileName={`${quoteNumber}.pdf`}
              label={t.btn_generate}
            />
          ) : (
            <button type="button" className="btn btn-primary btn-lg rounded-pill" style={{ minHeight: 50 }} disabled>
              <i className="bi bi-file-earmark-pdf me-2" aria-hidden="true"></i>{t.btn_generate}
            </button>
          )}

          {userId ? (
            <button
              type="button"
              className="btn btn-outline-primary rounded-pill"
              style={{ minHeight: 46 }}
              onClick={handleSave}
              disabled={saving || items.length === 0}
            >
              {saving ? (
                <><span className="spinner-border spinner-border-sm me-2" role="status" />저장 중...</>
              ) : (
                <><i className="bi bi-save me-2" aria-hidden="true"></i>{t.btn_save}</>
              )}
            </button>
          ) : (
            <p className="small text-center mb-0 mt-2" style={{ color: 'var(--tx-mute)' }}>
              <i className="bi bi-info-circle me-1" aria-hidden="true"></i>
              <a href={`/${lang}/auth/login`} className="fw-semibold" style={{ color: 'var(--tx-accent)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
                로그인
              </a>
              하면 견적 이력을 저장할 수 있습니다.
            </p>
          )}
          {saveMsg && (
            <div
              className={`alert ${saveMsg.includes('실패') ? 'alert-danger' : 'alert-success'} py-2 rounded-3 small mb-0`}
              role="alert"
              aria-live="polite"
            >
              {saveMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
