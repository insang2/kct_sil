'use client'

import { useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'

// ─── Types ──────────────────────────────────────────────────────────────────

interface InventoryItem {
  id: string
  product_id: number | null
  product_name: string
  variant: string | null
  brand: string | null
  sku: string | null
  warehouse: string
  location_detail: string | null
  quantity: number
  unit: string
  min_quantity: number
  received_at: string | null
  expiry_date: string | null
  lot_number: string | null
  cost_price: number | null
  status: 'in_stock' | 'low_stock' | 'reserved' | 'out_of_stock'
  notes: string | null
  created_at: string
  updated_at: string
}

interface ProductOption {
  id: number
  brand: string
  sku: string | null
  name_ko: string
}

// ─── Constants ───────────────────────────────────────────────────────────────

const WAREHOUSES   = ['본사창고', '부산창고', '인천창고', '현장', '위탁창고', '기타']
const UNITS        = ['박스', '파렛트', 'EA', '개', '롤', 'kg', 'L', '세트', '묶음', '통']
const BRANDS       = ['DOWSIL', 'Sika', 'Bostik', 'BASF', '3M', 'Momentive', 'Henkel', '기타']
const VARIANTS     = ['흑색', '백색', '회색', '투명', '황갈색', '알루미늄', '브라운', '청색', '베이지', '기타']

const STATUS_META: Record<string, { label: string; badge: string; color: string }> = {
  in_stock:     { label: '재고 있음', badge: 'bg-success',         color: '#198754' },
  low_stock:    { label: '재고 부족', badge: 'bg-warning text-dark', color: '#ffc107' },
  reserved:     { label: '예약됨',   badge: 'bg-info text-dark',   color: '#0dcaf0' },
  out_of_stock: { label: '소진',     badge: 'bg-danger',            color: '#dc3545' },
}

const BLANK: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'> = {
  product_id: null, product_name: '', variant: '', brand: '',
  sku: '', warehouse: '본사창고', location_detail: '',
  quantity: 0, unit: '박스', min_quantity: 0,
  received_at: new Date().toISOString().slice(0, 10),
  expiry_date: null, lot_number: '', cost_price: null,
  status: 'in_stock', notes: '',
}

// ─── SelectOrInput ────────────────────────────────────────────────────────────

function SelectOrInput({ label, value, onChange, options, placeholder = '', required = false }: {
  label: string; value: string; onChange: (v: string) => void
  options: string[]; placeholder?: string; required?: boolean
}) {
  const [custom, setCustom] = useState(() => value !== '' && !options.includes(value))
  return (
    <div className="mb-2">
      <label className="form-label small fw-semibold mb-1">{label}{required && <span className="text-danger ms-1">*</span>}</label>
      {custom ? (
        <div className="input-group input-group-sm">
          <input className="form-control" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
          <button className="btn btn-outline-secondary" type="button" title="목록에서 선택" onClick={() => { onChange(''); setCustom(false) }}>
            <i className="bi bi-list-ul" />
          </button>
        </div>
      ) : (
        <select className="form-select form-select-sm" value={value} onChange={e => { if (e.target.value === '__custom__') { setCustom(true); onChange('') } else onChange(e.target.value) }}>
          <option value="">선택...</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
          <option value="__custom__">✏️ 직접 입력...</option>
        </select>
      )}
    </div>
  )
}

// ─── Mini bar chart ───────────────────────────────────────────────────────────

function MiniBar({ label, value, max, color, unit }: { label: string; value: number; max: number; color: string; unit?: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="mb-2">
      <div className="d-flex justify-content-between align-items-center mb-1" style={{ fontSize: '0.78rem' }}>
        <span className="text-truncate me-2" style={{ maxWidth: 160 }}>{label}</span>
        <span className="fw-semibold text-nowrap">{value.toLocaleString()}{unit ? ` ${unit}` : ''}</span>
      </div>
      <div style={{ height: 8, background: '#e9ecef', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 0.4s ease' }} />
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function InventoryManager({ initialItems, products }: { initialItems: InventoryItem[]; products: ProductOption[] }) {
  const supabase = createClient()

  const [items, setItems] = useState<InventoryItem[]>(initialItems)
  const [search, setSearch] = useState('')
  const [filterWarehouse, setFilterWarehouse] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterBrand, setFilterBrand] = useState('all')

  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<InventoryItem | null>(null)
  const [form, setForm] = useState<Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'>>(BLANK)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const f = (field: string, v: any) => setForm(p => ({ ...p, [field]: v }))

  // ── Derived / filtered list ──────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = items
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(x =>
        x.product_name.toLowerCase().includes(q) ||
        (x.brand ?? '').toLowerCase().includes(q) ||
        (x.variant ?? '').toLowerCase().includes(q) ||
        (x.sku ?? '').toLowerCase().includes(q) ||
        x.warehouse.toLowerCase().includes(q)
      )
    }
    if (filterWarehouse !== 'all') list = list.filter(x => x.warehouse === filterWarehouse)
    if (filterStatus   !== 'all') list = list.filter(x => x.status === filterStatus)
    if (filterBrand    !== 'all') list = list.filter(x => x.brand === filterBrand)
    return list
  }, [items, search, filterWarehouse, filterStatus, filterBrand])

  // ── Stats for visualization ───────────────────────────────────────────────
  const stats = useMemo(() => {
    const totalSKUs = items.length
    const lowStockCount = items.filter(x => x.status === 'low_stock').length
    const outOfStockCount = items.filter(x => x.status === 'out_of_stock').length
    const statusCount = Object.fromEntries(Object.keys(STATUS_META).map(s => [s, items.filter(x => x.status === s).length]))

    const warehouseGroups: Record<string, number> = {}
    items.forEach(x => { warehouseGroups[x.warehouse] = (warehouseGroups[x.warehouse] || 0) + 1 })

    const productQty: Record<string, number> = {}
    items.forEach(x => {
      const key = x.brand ? `${x.brand} ${x.product_name}` : x.product_name
      productQty[key] = (productQty[key] || 0) + x.quantity
    })
    const topProducts = Object.entries(productQty).sort((a, b) => b[1] - a[1]).slice(0, 8)

    const brands = Array.from(new Set(items.map(x => x.brand).filter(Boolean) as string[]))
    const warehouses = Array.from(new Set(items.map(x => x.warehouse)))

    return { totalSKUs, lowStockCount, outOfStockCount, statusCount, warehouseGroups, topProducts, brands, warehouses }
  }, [items])

  // ── Auto-status based on quantity ────────────────────────────────────────
  function autoStatus(qty: number, min: number): InventoryItem['status'] {
    if (qty <= 0) return 'out_of_stock'
    if (min > 0 && qty <= min) return 'low_stock'
    return 'in_stock'
  }

  // ── Modal open ────────────────────────────────────────────────────────────
  function openAdd() {
    setEditing(null)
    setForm({ ...BLANK, received_at: new Date().toISOString().slice(0, 10) })
    setShowModal(true)
  }
  function openEdit(item: InventoryItem) {
    setEditing(item)
    const { id, created_at, updated_at, ...rest } = item
    setForm(rest)
    setShowModal(true)
  }

  // ── Product autofill ──────────────────────────────────────────────────────
  function pickProduct(id: string) {
    const pid = parseInt(id)
    const p = products.find(x => x.id === pid)
    if (!p) return
    setForm(prev => ({
      ...prev,
      product_id: pid,
      product_name: p.name_ko,
      brand: p.brand,
      sku: p.sku ?? prev.sku ?? '',
    }))
  }

  // ── Save ──────────────────────────────────────────────────────────────────
  async function handleSave() {
    if (!form.product_name.trim()) return
    setSaving(true)

    const payload = {
      ...form,
      variant:        form.variant || null,
      brand:          form.brand || null,
      sku:            form.sku || null,
      location_detail: form.location_detail || null,
      lot_number:     form.lot_number || null,
      expiry_date:    form.expiry_date || null,
      cost_price:     form.cost_price ?? null,
      notes:          form.notes || null,
      quantity:       Number(form.quantity),
      min_quantity:   Number(form.min_quantity),
      status:         form.status === 'in_stock' || form.status === 'low_stock'
                        ? autoStatus(Number(form.quantity), Number(form.min_quantity))
                        : form.status,
    }

    if (editing) {
      const { data, error } = await supabase.from('admin_inventory').update(payload).eq('id', editing.id).select().single()
      if (!error && data) setItems(prev => prev.map(x => x.id === editing.id ? data as InventoryItem : x))
    } else {
      const { data, error } = await supabase.from('admin_inventory').insert(payload).select().single()
      if (!error && data) setItems(prev => [data as InventoryItem, ...prev])
    }

    setSaving(false)
    setShowModal(false)
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  async function handleDelete(id: string) {
    if (!confirm('이 항목을 삭제하시겠습니까?')) return
    setDeleting(id)
    await supabase.from('admin_inventory').delete().eq('id', id)
    setItems(prev => prev.filter(x => x.id !== id))
    setDeleting(null)
  }

  // ── Quick quantity adjust ─────────────────────────────────────────────────
  async function adjustQty(item: InventoryItem, delta: number) {
    const newQty = Math.max(0, item.quantity + delta)
    const newStatus = item.status === 'reserved' ? 'reserved' : autoStatus(newQty, item.min_quantity)
    const { data } = await supabase
      .from('admin_inventory')
      .update({ quantity: newQty, status: newStatus })
      .eq('id', item.id).select().single()
    if (data) setItems(prev => prev.map(x => x.id === item.id ? data as InventoryItem : x))
  }

  const maxTopQty = stats.topProducts[0]?.[1] ?? 1
  const totalStatus = Object.values(stats.statusCount).reduce((a, b) => a + b, 0) || 1

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h4 className="fw-bold mb-1">자재 재고 관리</h4>
          <p className="text-body-secondary small mb-0">입출고 추적 · 창고별 현황 · 재고 수준 시각화</p>
        </div>
        <button className="btn btn-primary rounded-pill px-4" onClick={openAdd}>
          <i className="bi bi-plus-lg me-2" />입고 등록
        </button>
      </div>

      {/* ── Summary Cards ──────────────────────────────────────────────── */}
      <div className="row g-3 mb-4">
        {[
          { icon: 'bi-layers', label: '총 품목 수', value: stats.totalSKUs, color: '#1558D6', bg: '#eff4ff' },
          { icon: 'bi-check-circle', label: '재고 있음', value: stats.statusCount.in_stock ?? 0, color: '#198754', bg: '#f0fdf4' },
          { icon: 'bi-exclamation-triangle', label: '재고 부족', value: stats.lowStockCount, color: '#dc6c08', bg: '#fff8f0' },
          { icon: 'bi-x-circle', label: '소진',      value: stats.outOfStockCount, color: '#dc3545', bg: '#fff5f5' },
        ].map(c => (
          <div key={c.label} className="col-6 col-md-3">
            <div className="rounded-4 p-3 h-100" style={{ background: c.bg, border: `1px solid ${c.color}22` }}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36, background: `${c.color}18` }}>
                  <i className={`bi ${c.icon}`} style={{ color: c.color, fontSize: '1rem' }} />
                </div>
                <span className="small text-body-secondary">{c.label}</span>
              </div>
              <div className="fw-bold" style={{ fontSize: '1.6rem', color: c.color, lineHeight: 1 }}>{c.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Visualizations ─────────────────────────────────────────────── */}
      <div className="row g-3 mb-4">

        {/* Status distribution stacked bar */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <h6 className="fw-bold mb-3" style={{ fontSize: '0.85rem' }}>재고 상태 분포</h6>
            <div className="d-flex rounded-3 overflow-hidden mb-3" style={{ height: 20 }}>
              {Object.entries(STATUS_META).map(([key, meta]) => {
                const cnt = stats.statusCount[key] ?? 0
                const pct = (cnt / totalStatus) * 100
                return pct > 0 ? (
                  <div key={key} style={{ width: `${pct}%`, background: meta.color }} title={`${meta.label}: ${cnt}개`} />
                ) : null
              })}
            </div>
            <div className="d-flex flex-column gap-1">
              {Object.entries(STATUS_META).map(([key, meta]) => {
                const cnt = stats.statusCount[key] ?? 0
                return (
                  <div key={key} className="d-flex align-items-center gap-2" style={{ fontSize: '0.8rem' }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: meta.color, flexShrink: 0 }} />
                    <span className="text-body-secondary flex-grow-1">{meta.label}</span>
                    <span className="fw-semibold">{cnt}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Warehouse breakdown */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <h6 className="fw-bold mb-3" style={{ fontSize: '0.85rem' }}>창고별 품목 수</h6>
            {Object.keys(stats.warehouseGroups).length === 0 ? (
              <p className="text-body-secondary small">등록된 항목 없음</p>
            ) : (
              Object.entries(stats.warehouseGroups)
                .sort((a, b) => b[1] - a[1])
                .map(([wh, cnt]) => (
                  <MiniBar key={wh} label={wh} value={cnt} max={items.length} color="#1558D6" unit="품목" />
                ))
            )}
          </div>
        </div>

        {/* Top products by quantity */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <h6 className="fw-bold mb-3" style={{ fontSize: '0.85rem' }}>상위 품목 (수량 기준)</h6>
            {stats.topProducts.length === 0 ? (
              <p className="text-body-secondary small">등록된 항목 없음</p>
            ) : (
              stats.topProducts.map(([name, qty]) => (
                <MiniBar key={name} label={name} value={qty} max={maxTopQty} color="#059669" />
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Low Stock Alerts ───────────────────────────────────────────── */}
      {(stats.lowStockCount > 0 || stats.outOfStockCount > 0) && (
        <div className="alert border-0 rounded-4 mb-4 p-3" style={{ background: '#fff8f0', borderLeft: '4px solid #dc6c08 !important' }}>
          <div className="d-flex align-items-center gap-2 mb-2">
            <i className="bi bi-exclamation-triangle-fill text-warning" />
            <strong style={{ fontSize: '0.88rem' }}>재고 주의 항목</strong>
          </div>
          <div className="d-flex flex-wrap gap-2">
            {items.filter(x => x.status === 'out_of_stock' || x.status === 'low_stock').map(x => (
              <span key={x.id} className={`badge ${STATUS_META[x.status].badge} rounded-pill`} style={{ fontSize: '0.78rem', cursor: 'pointer' }} onClick={() => openEdit(x)}>
                {x.brand ? `${x.brand} ` : ''}{x.product_name}{x.variant ? ` (${x.variant})` : ''} — {x.quantity}{x.unit}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Filter bar ────────────────────────────────────────────────── */}
      <div className="card border-0 shadow-sm rounded-4 mb-3 p-3">
        <div className="row g-2 align-items-center">
          <div className="col">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-white border-end-0"><i className="bi bi-search text-body-secondary" /></span>
              <input className="form-control border-start-0 ps-0" placeholder="제품명, 브랜드, SKU, 창고 검색..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="col-auto">
            <select className="form-select form-select-sm" value={filterWarehouse} onChange={e => setFilterWarehouse(e.target.value)} style={{ minWidth: 110 }}>
              <option value="all">전체 창고</option>
              {stats.warehouses.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
          <div className="col-auto">
            <select className="form-select form-select-sm" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ minWidth: 110 }}>
              <option value="all">전체 상태</option>
              {Object.entries(STATUS_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          <div className="col-auto">
            <select className="form-select form-select-sm" value={filterBrand} onChange={e => setFilterBrand(e.target.value)} style={{ minWidth: 100 }}>
              <option value="all">전체 브랜드</option>
              {stats.brands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="col-auto">
            <span className="text-body-secondary small">{filtered.length}개</span>
          </div>
        </div>
      </div>

      {/* ── Inventory Table ───────────────────────────────────────────── */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.84rem' }}>
            <thead style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
              <tr>
                <th className="px-4 py-3 fw-semibold">제품</th>
                <th className="py-3 fw-semibold">색상/규격</th>
                <th className="py-3 fw-semibold">창고</th>
                <th className="py-3 fw-semibold text-end" style={{ minWidth: 140 }}>수량</th>
                <th className="py-3 fw-semibold">상태</th>
                <th className="py-3 fw-semibold">입고일</th>
                <th className="py-3 fw-semibold text-end pe-4">관리</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-body-secondary py-5">
                    <i className="bi bi-inbox d-block mb-2" style={{ fontSize: '2rem' }} />
                    {items.length === 0 ? '등록된 재고가 없습니다' : '검색 결과 없음'}
                  </td>
                </tr>
              ) : filtered.map(item => (
                <tr key={item.id}>
                  <td className="px-4 py-3">
                    <div className="fw-semibold">{item.product_name}</div>
                    {item.brand && <div className="text-body-secondary" style={{ fontSize: '0.76rem' }}>{item.brand}{item.sku ? ` · ${item.sku}` : ''}</div>}
                  </td>
                  <td className="py-3">
                    {item.variant ? (
                      <span className="badge bg-light text-dark border rounded-pill" style={{ fontSize: '0.78rem' }}>{item.variant}</span>
                    ) : <span className="text-body-secondary">—</span>}
                  </td>
                  <td className="py-3">
                    <div>{item.warehouse}</div>
                    {item.location_detail && <div className="text-body-secondary" style={{ fontSize: '0.75rem' }}>{item.location_detail}</div>}
                  </td>
                  <td className="py-3 text-end">
                    <div className="d-flex align-items-center justify-content-end gap-1">
                      <button className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center" style={{ width: 24, height: 24, padding: 0, fontSize: '0.75rem' }} onClick={() => adjustQty(item, -1)}>
                        <i className="bi bi-dash" />
                      </button>
                      <span className="fw-bold px-1" style={{ minWidth: 50, textAlign: 'center', color: item.quantity === 0 ? '#dc3545' : item.min_quantity > 0 && item.quantity <= item.min_quantity ? '#dc6c08' : 'inherit' }}>
                        {item.quantity.toLocaleString()} {item.unit}
                      </span>
                      <button className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center" style={{ width: 24, height: 24, padding: 0, fontSize: '0.75rem' }} onClick={() => adjustQty(item, 1)}>
                        <i className="bi bi-plus" />
                      </button>
                    </div>
                    {item.min_quantity > 0 && (
                      <div className="text-body-secondary mt-1" style={{ fontSize: '0.72rem' }}>최소: {item.min_quantity} {item.unit}</div>
                    )}
                  </td>
                  <td className="py-3">
                    <span className={`badge ${STATUS_META[item.status].badge} rounded-pill`} style={{ fontSize: '0.75rem' }}>
                      {STATUS_META[item.status].label}
                    </span>
                  </td>
                  <td className="py-3 text-body-secondary" style={{ fontSize: '0.8rem' }}>
                    {item.received_at ?? '—'}
                  </td>
                  <td className="py-3 text-end pe-4">
                    <button className="btn btn-sm btn-outline-secondary rounded-3 me-1 px-2" onClick={() => openEdit(item)}>
                      <i className="bi bi-pencil" />
                    </button>
                    <button className="btn btn-sm btn-outline-danger rounded-3 px-2" onClick={() => handleDelete(item.id)} disabled={deleting === item.id}>
                      {deleting === item.id ? <span className="spinner-border spinner-border-sm" /> : <i className="bi bi-trash3" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add/Edit Modal ────────────────────────────────────────────── */}
      {showModal && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1050 }} onClick={() => setShowModal(false)} />
          <div className="modal fade show d-block" style={{ zIndex: 1055 }} tabIndex={-1}>
            <div className="modal-dialog modal-lg modal-dialog-scrollable">
              <div className="modal-content rounded-4 border-0 shadow-lg">
                <div className="modal-header border-0 pb-0 px-4 pt-4">
                  <h5 className="modal-title fw-bold">{editing ? '재고 수정' : '입고 등록'}</h5>
                  <button className="btn-close" onClick={() => setShowModal(false)} />
                </div>
                <div className="modal-body px-4 py-3">

                  {/* Product autofill */}
                  {products.length > 0 && (
                    <div className="mb-3 p-3 rounded-3" style={{ background: '#f0f4ff' }}>
                      <label className="form-label small fw-semibold mb-1">제품 DB에서 불러오기</label>
                      <select className="form-select form-select-sm" value={form.product_id ?? ''} onChange={e => pickProduct(e.target.value)}>
                        <option value="">— 직접 입력 또는 선택 —</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>[{p.brand}] {p.name_ko}{p.sku ? ` (${p.sku})` : ''}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold mb-1">제품명 <span className="text-danger">*</span></label>
                      <input className="form-control form-control-sm" value={form.product_name} onChange={e => f('product_name', e.target.value)} placeholder="e.g. Dowsil 795 실리콘" />
                    </div>
                    <div className="col-md-6">
                      <SelectOrInput label="브랜드" value={form.brand ?? ''} onChange={v => f('brand', v)} options={BRANDS} />
                    </div>
                    <div className="col-md-6">
                      <SelectOrInput label="색상 / 규격" value={form.variant ?? ''} onChange={v => f('variant', v)} options={VARIANTS} placeholder="흑색, 회색, 투명..." />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold mb-1">SKU</label>
                      <input className="form-control form-control-sm" value={form.sku ?? ''} onChange={e => f('sku', e.target.value)} placeholder="제품 코드" />
                    </div>
                  </div>

                  <hr className="my-3" />

                  <div className="row g-3">
                    <div className="col-md-4">
                      <SelectOrInput label="창고" value={form.warehouse} onChange={v => f('warehouse', v)} options={WAREHOUSES} required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold mb-1">창고 내 위치</label>
                      <input className="form-control form-control-sm" value={form.location_detail ?? ''} onChange={e => f('location_detail', e.target.value)} placeholder="선반 A-3, 구역 2..." />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold mb-1">로트번호</label>
                      <input className="form-control form-control-sm" value={form.lot_number ?? ''} onChange={e => f('lot_number', e.target.value)} placeholder="LOT-20260512" />
                    </div>
                  </div>

                  <div className="row g-3 mt-1">
                    <div className="col-md-3">
                      <label className="form-label small fw-semibold mb-1">수량 <span className="text-danger">*</span></label>
                      <input className="form-control form-control-sm" type="number" min={0} value={form.quantity} onChange={e => f('quantity', parseFloat(e.target.value) || 0)} />
                    </div>
                    <div className="col-md-3">
                      <SelectOrInput label="단위" value={form.unit} onChange={v => f('unit', v)} options={UNITS} required />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small fw-semibold mb-1">최소 재고 수량</label>
                      <input className="form-control form-control-sm" type="number" min={0} value={form.min_quantity} onChange={e => f('min_quantity', parseFloat(e.target.value) || 0)} />
                      <div className="form-text" style={{ fontSize: '0.72rem' }}>이하 시 '부족' 경고</div>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small fw-semibold mb-1">상태</label>
                      <select className="form-select form-select-sm" value={form.status} onChange={e => f('status', e.target.value)}>
                        {Object.entries(STATUS_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="row g-3 mt-1">
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold mb-1">입고일</label>
                      <input className="form-control form-control-sm" type="date" value={form.received_at ?? ''} onChange={e => f('received_at', e.target.value || null)} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold mb-1">유통기한 / 만료일</label>
                      <input className="form-control form-control-sm" type="date" value={form.expiry_date ?? ''} onChange={e => f('expiry_date', e.target.value || null)} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold mb-1">입고 단가</label>
                      <div className="input-group input-group-sm">
                        <span className="input-group-text">₩</span>
                        <input className="form-control" type="number" min={0} value={form.cost_price ?? ''} onChange={e => f('cost_price', e.target.value ? parseFloat(e.target.value) : null)} placeholder="0" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="form-label small fw-semibold mb-1">메모</label>
                    <textarea className="form-control form-control-sm" rows={2} value={form.notes ?? ''} onChange={e => f('notes', e.target.value)} placeholder="비고 사항..." />
                  </div>
                </div>
                <div className="modal-footer border-0 px-4 pb-4 pt-2">
                  <button className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setShowModal(false)}>취소</button>
                  <button className="btn btn-primary rounded-pill px-4" onClick={handleSave} disabled={saving || !form.product_name.trim()}>
                    {saving ? <><span className="spinner-border spinner-border-sm me-2" />저장 중...</> : (editing ? '수정 저장' : '입고 등록')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
