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
          className={`btn btn-sm rounded-pill px-3 ${value === opt ? 'btn-primary' : 'btn-outline-secondary'}`}
          style={{ fontSize: '0.78rem' }}
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

  return (
    <div className="row g-5" data-form-section>
      {/* Left: Product selection + Trade Terms */}
      <div className="col-lg-7">
        <h5 className="fw-bold mb-4 text-dark">{t.product_select}</h5>
        <div className="list-group shadow-sm rounded-4 overflow-hidden mb-5">
          {products.map(product => {
            const checked = !!selected[product.id]
            const price = getPrice(product, userTier)
            return (
              <div
                key={product.id}
                className={`list-group-item list-group-item-action d-flex align-items-center gap-3 py-3 px-4 ${checked ? 'border-primary bg-primary bg-opacity-10' : ''}`}
              >
                <input
                  className="form-check-input flex-shrink-0 mt-0"
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleProduct(product)}
                  id={`product-${product.id}`}
                />
                <label className="flex-grow-1 mb-0" htmlFor={`product-${product.id}`} style={{ cursor: 'pointer' }}>
                  <div className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>{product.name_ko}</div>
                  {product.sku && <div className="text-body-secondary" style={{ fontSize: '0.78rem' }}>SKU: {product.sku}</div>}
                </label>
                <div className="text-end flex-shrink-0">
                  <div className="fw-bold text-primary" style={{ fontSize: '0.9rem' }}>
                    {price.toLocaleString('ko-KR')}원/{product.unit}
                  </div>
                </div>
                {checked && (
                  <div className="d-flex align-items-center gap-1 flex-shrink-0">
                    <button className="btn btn-outline-secondary btn-sm" style={{ width: 28, height: 28, padding: 0 }}
                      onClick={() => setQuantity(product.id, (selected[product.id]?.quantity ?? 1) - 1)}>-</button>
                    <input
                      type="number"
                      className="form-control form-control-sm text-center"
                      style={{ width: 56 }}
                      min={1}
                      value={selected[product.id]?.quantity ?? 1}
                      onChange={e => setQuantity(product.id, parseInt(e.target.value) || 1)}
                    />
                    <button className="btn btn-outline-secondary btn-sm" style={{ width: 28, height: 28, padding: 0 }}
                      onClick={() => setQuantity(product.id, (selected[product.id]?.quantity ?? 1) + 1)}>+</button>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Trade Terms */}
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-1 text-dark">
              <i className="bi bi-globe2 me-2 text-primary"></i>Trade Terms
            </h5>
            <p className="text-body-secondary small mb-4">수출 견적 시 적용할 무역 조건을 선택하세요.</p>

            <div className="mb-4">
              <label className="form-label fw-bold text-dark small mb-2">Incoterms 2020</label>
              <ChipGroup options={INCOTERMS} value={tradeTerms.incoterms} onChange={v => setTrade('incoterms', v)} />
              <div className="text-body-secondary mt-1" style={{ fontSize: '0.72rem' }}>
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

            <div className="mb-4">
              <label className="form-label fw-bold text-dark small mb-2">Payment Terms</label>
              <ChipGroup options={PAYMENT_TERMS} value={tradeTerms.paymentTerms} onChange={v => setTrade('paymentTerms', v)} />
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold text-dark small mb-2">Currency</label>
              <ChipGroup options={CURRENCIES} value={tradeTerms.currency} onChange={v => setTrade('currency', v)} />
            </div>

            <div className="row g-3 mb-4">
              <div className="col-6">
                <label className="form-label fw-bold text-dark small">Port of Loading</label>
                <select className="form-select form-select-sm text-dark"
                  value={tradeTerms.portOfLoading} onChange={e => setTrade('portOfLoading', e.target.value)}>
                  {PORTS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="col-6">
                <label className="form-label fw-bold text-dark small">Lead Time</label>
                <select className="form-select form-select-sm text-dark"
                  value={tradeTerms.leadTime} onChange={e => setTrade('leadTime', e.target.value)}>
                  {LEAD_TIMES.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold text-dark small mb-2">Quote Validity</label>
              <ChipGroup options={VALIDITIES} value={tradeTerms.validity} onChange={v => setTrade('validity', v)} />
            </div>

            <div>
              <label className="form-label fw-bold text-dark small mb-2">Documents Provided</label>
              <div className="row g-2">
                {DOCUMENTS.map(doc => (
                  <div key={doc} className="col-12">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`doc-${doc}`}
                        checked={tradeTerms.documents.includes(doc)}
                        onChange={() => toggleDoc(doc)}
                      />
                      <label className="form-check-label text-dark small" htmlFor={`doc-${doc}`}>{doc}</label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Customer info + summary */}
      <div className="col-lg-5">
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-4 text-dark">{t.customer_info}</h5>
            <div className="mb-3">
              <label className="form-label fw-bold text-dark small">{ta.company_name}</label>
              <input type="text" className="form-control text-dark" value={customerCompany} onChange={e => setCustomerCompany(e.target.value)} placeholder="예: ABC Trading Co., Ltd." />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold text-dark small">{ta.contact_person}</label>
              <input type="text" className="form-control text-dark" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="예: John Smith" />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold text-dark small">{ta.email}</label>
              <input type="email" className="form-control text-dark" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} placeholder="name@company.com" />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold text-dark small">{ta.phone}</label>
              <input type="tel" className="form-control text-dark" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="+81-XX-XXXX-XXXX" />
            </div>
            <div className="mb-0">
              <label className="form-label fw-bold text-dark small">{t.notes}</label>
              <textarea className="form-control text-dark" rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder={t.notes_placeholder} />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-4">
            <h6 className="fw-bold mb-3 text-dark">Quote Summary</h6>
            {items.length === 0 ? (
              <p className="text-body-secondary small mb-3">제품을 선택해 주세요.</p>
            ) : (
              <ul className="list-unstyled mb-3" style={{ fontSize: '0.85rem' }}>
                {items.map(item => (
                  <li key={item.id} className="d-flex justify-content-between mb-1">
                    <span className="text-truncate me-2 text-dark">{item.name_ko} ×{item.quantity}</span>
                    <span className="fw-bold flex-shrink-0">{item.amount.toLocaleString('ko-KR')}원</span>
                  </li>
                ))}
              </ul>
            )}
            <hr />
            <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.9rem' }}>
              <span className="text-body-secondary">{t.subtotal}</span>
              <span className="fw-bold">{subtotal.toLocaleString('ko-KR')}원</span>
            </div>
            <div className="d-flex justify-content-between mb-2" style={{ fontSize: '0.9rem' }}>
              <span className="text-body-secondary">{t.tax}</span>
              <span className="fw-bold">{tax.toLocaleString('ko-KR')}원</span>
            </div>
            <div className="d-flex justify-content-between mb-0 border-top pt-2">
              <span className="fw-bold text-primary">{t.total}</span>
              <span className="fw-bold text-primary fs-5">{total.toLocaleString('ko-KR')}원</span>
            </div>
          </div>
        </div>

        {/* Trade Terms Summary */}
        <div className="card border-0 rounded-4 mb-4" style={{ background: '#f0f4ff' }}>
          <div className="card-body p-3">
            <div className="row g-1" style={{ fontSize: '0.78rem' }}>
              {[
                ['Incoterms', tradeTerms.incoterms],
                ['Payment', tradeTerms.paymentTerms],
                ['Currency', tradeTerms.currency],
                ['Port', tradeTerms.portOfLoading],
                ['Lead Time', tradeTerms.leadTime],
                ['Validity', tradeTerms.validity],
              ].map(([label, value]) => (
                <div key={label} className="col-6 d-flex gap-1">
                  <span className="text-body-secondary">{label}:</span>
                  <span className="fw-bold text-dark">{value}</span>
                </div>
              ))}
            </div>
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
            <button className="btn btn-primary btn-lg rounded-pill" disabled>
              <i className="bi bi-file-earmark-pdf me-2"></i>{t.btn_generate}
            </button>
          )}

          {userId ? (
            <button
              className="btn btn-outline-primary rounded-pill"
              onClick={handleSave}
              disabled={saving || items.length === 0}
            >
              {saving ? <><span className="spinner-border spinner-border-sm me-2" />저장 중...</> : <><i className="bi bi-save me-2"></i>{t.btn_save}</>}
            </button>
          ) : (
            <p className="text-body-secondary small text-center mb-0">
              <i className="bi bi-info-circle me-1"></i>
              <a href={`/${lang}/auth/login`} className="text-primary fw-bold">로그인</a>하면 견적 이력을 저장할 수 있습니다.
            </p>
          )}
          {saveMsg && (
            <div className={`alert ${saveMsg.includes('실패') ? 'alert-danger' : 'alert-success'} py-2 rounded-3 small`} role="alert">
              {saveMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
