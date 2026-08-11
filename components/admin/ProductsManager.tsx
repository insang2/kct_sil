'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { downloadCSV } from '@/lib/csv-export'
import type { Product } from '@/lib/pricing'

const SUPABASE_URL = 'https://bpqfudafnszicelycnbx.supabase.co'

const EMPTY: Partial<Product> = {
  brand: 'DOWSIL', sku: '', name_ko: '', name_en: '',
  list_price: 0, price_standard: null, price_silver: null,
  price_gold: null, price_platinum: null, unit: '개',
  is_active: true, sort_order: 0,
  slug: '', category: '', description_ko: '', description_en: '',
  features: [], applications: [], specifications: {}, tds_url: '', image_url: '',
}

function autoSlug(brand: string, sku: string): string {
  const b = (brand || '').toLowerCase()
  const s = (sku || '').toLowerCase().replace(/[^a-z0-9]/g, '-')
  return `${b}-${s}`.replace(/-+/g, '-').replace(/^-|-$/g, '')
}

const CATEGORIES = ['전체', '내후성', '구조용', '특수', '내부', '다목적']

export default function ProductsManager({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [editing, setEditing] = useState<Partial<Product> | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [showDetail, setShowDetail] = useState(false)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('전체')
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all')
  const [uploading, setUploading] = useState(false)
  const imgInputRef = useRef<HTMLInputElement>(null)

  async function handleImageUpload(file: File) {
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from('product-images').upload(path, file, { upsert: true })
    if (!error) {
      const url = `${SUPABASE_URL}/storage/v1/object/public/product-images/${path}`
      setEditing(prev => prev ? { ...prev, image_url: url } : prev)
    } else {
      alert('업로드 실패: ' + error.message)
    }
    setUploading(false)
  }

  // Text area states for array fields
  const [featuresText, setFeaturesText] = useState('')
  const [applicationsText, setApplicationsText] = useState('')

  const supabase = createClient()

  function openEdit(p?: Product) {
    const base = p ? { ...p } : { ...EMPTY }
    setEditing(base)
    setFeaturesText(Array.isArray(base.features) ? (base.features as string[]).join('\n') : '')
    setApplicationsText(Array.isArray(base.applications) ? (base.applications as string[]).join('\n') : '')
    setShowDetail(false)
    setMsg('')
  }

  function getPayload() {
    if (!editing) return null
    return {
      brand: editing.brand, sku: editing.sku, name_ko: editing.name_ko,
      name_en: editing.name_en, list_price: editing.list_price,
      price_standard: editing.price_standard, price_silver: editing.price_silver,
      price_gold: editing.price_gold, price_platinum: editing.price_platinum,
      unit: editing.unit, is_active: editing.is_active, sort_order: editing.sort_order,
      slug: editing.slug || autoSlug(editing.brand ?? '', editing.sku ?? ''),
      category: editing.category || '',
      description_ko: editing.description_ko || '',
      description_en: editing.description_en || '',
      features: featuresText.split('\n').map(s => s.trim()).filter(Boolean),
      applications: applicationsText.split('\n').map(s => s.trim()).filter(Boolean),
      tds_url: editing.tds_url || null,
      image_url: editing.image_url || null,
    }
  }

  async function handleSave() {
    if (!editing) return
    setSaving(true)
    setMsg('')
    const payload = getPayload()!

    if (editing.id) {
      const { error } = await supabase.from('products').update(payload).eq('id', editing.id)
      if (error) { setMsg('저장 실패: ' + error.message) }
      else {
        setProducts(prev => prev.map(p => p.id === editing.id ? { ...p, ...payload, id: editing.id! } as Product : p))
        setEditing(null)
        setMsg('저장 완료')
      }
    } else {
      const { data, error } = await supabase.from('products').insert(payload).select().single()
      if (error) { setMsg('추가 실패: ' + error.message) }
      else {
        setProducts(prev => [...prev, data as Product])
        setEditing(null)
        setMsg('추가 완료')
      }
    }
    setSaving(false)
  }

  async function handleToggle(p: Product) {
    const { error } = await supabase.from('products').update({ is_active: !p.is_active }).eq('id', p.id)
    if (!error) setProducts(prev => prev.map(x => x.id === p.id ? { ...x, is_active: !x.is_active } : x))
  }

  async function handleDelete(id: number) {
    if (!confirm('삭제하시겠습니까?')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (!error) setProducts(prev => prev.filter(p => p.id !== id))
  }

  const fi = (label: string, field: keyof Product, type = 'text', placeholder = '') => (
    <div className="mb-3">
      <label className="form-label small fw-bold text-dark">{label}</label>
      <input type={type} className="form-control" placeholder={placeholder}
        value={(editing?.[field] ?? '') as string | number}
        onChange={e => setEditing(prev => prev ? {
          ...prev,
          [field]: type === 'number' ? (e.target.value === '' ? null : Number(e.target.value)) : e.target.value
        } : prev)} />
    </div>
  )

  const filtered = products.filter(p => {
    const q = search.toLowerCase()
    const matchSearch = !search ||
      p.name_ko.toLowerCase().includes(q) ||
      (p.name_en ?? '').toLowerCase().includes(q) ||
      (p.sku ?? '').toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q)
    const matchCategory = filterCategory === '전체' || p.category === filterCategory
    const matchActive = filterActive === 'all' || (filterActive === 'active' ? p.is_active : !p.is_active)
    return matchSearch && matchCategory && matchActive
  })

  return (
    <div>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">제품 관리</h1>
          <p className="text-body-secondary mb-0 small">
            총 {products.length}개 · 표시 {filtered.length}개
          </p>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-outline-secondary rounded-pill px-3"
            onClick={() => downloadCSV(
              ['브랜드', 'SKU', '제품명(KO)', '제품명(EN)', '카테고리', '단위', '정가', '일반가', '실버가', '골드가', '플래티넘가', '활성'],
              filtered.map(p => [p.brand, p.sku, p.name_ko, p.name_en, p.category, p.unit, p.list_price, p.price_standard, p.price_silver, p.price_gold, p.price_platinum, p.is_active ? '활성' : '비활성'])
            , `제품목록_${new Date().toISOString().slice(0,10)}.csv`)}
          >
            <i className="bi bi-download me-1" />CSV
          </button>
          <button className="btn btn-sm btn-primary rounded-pill px-3 px-md-4" onClick={() => openEdit()}>
            <i className="bi bi-plus-lg me-1 me-md-2"></i>제품 추가
          </button>
        </div>
      </div>

      <div className="d-flex gap-2 mb-4 flex-wrap align-items-center">
        <div className="flex-grow-1" style={{ minWidth: 200, maxWidth: 320 }}>
          <input
            className="form-control rounded-pill"
            placeholder="제품명, SKU, 브랜드 검색..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="form-select rounded-pill w-auto"
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
        >
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <div className="btn-group rounded-pill overflow-hidden border">
          {(['all', 'active', 'inactive'] as const).map((v, i) => (
            <button
              key={v}
              className={`btn btn-sm ${filterActive === v ? 'btn-dark' : 'btn-light'}`}
              style={{ borderRadius: 0, border: 'none', fontSize: '0.82rem', paddingInline: 12 }}
              onClick={() => setFilterActive(v)}
            >
              {v === 'all' ? '전체' : v === 'active' ? '활성' : '비활성'}
            </button>
          ))}
        </div>
        {(search || filterCategory !== '전체' || filterActive !== 'all') && (
          <button
            className="btn btn-sm btn-outline-secondary rounded-pill px-3"
            onClick={() => { setSearch(''); setFilterCategory('전체'); setFilterActive('all') }}
          >
            <i className="bi bi-x me-1" />초기화
          </button>
        )}
      </div>

      {msg && <div className={`alert ${msg.includes('실패') ? 'alert-danger' : 'alert-success'} rounded-3 py-2 mb-4`}>{msg}</div>}

      {/* Form */}
      {editing && (
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-4">
            <h6 className="fw-bold text-dark mb-4">{editing.id ? '제품 수정' : '제품 추가'}</h6>

            {/* ── 기본 정보 ── */}
            <p className="fw-bold text-primary small text-uppercase mb-3">기본 정보</p>
            <div className="row g-3 mb-3">
              <div className="col-md-3">
                <label className="form-label small fw-bold text-dark">브랜드</label>
                <input type="text" className="form-control" value={editing.brand || ''}
                  onChange={e => {
                    const brand = e.target.value
                    setEditing(prev => prev ? { ...prev, brand, slug: autoSlug(brand, prev.sku ?? '') } : prev)
                  }} />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-bold text-dark">SKU</label>
                <input type="text" className="form-control" value={editing.sku || ''}
                  onChange={e => {
                    const sku = e.target.value
                    setEditing(prev => prev ? { ...prev, sku, slug: autoSlug(prev.brand ?? '', sku) } : prev)
                  }} />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-bold text-dark">카테고리</label>
                <select className="form-select" value={editing.category || ''}
                  onChange={e => setEditing(prev => prev ? { ...prev, category: e.target.value } : prev)}>
                  <option value="">선택</option>
                  {['내후성', '구조용', '특수', '내부', '다목적'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-bold text-dark">단위</label>
                <select className="form-select" value={editing.unit || '개'}
                  onChange={e => setEditing(prev => prev ? { ...prev, unit: e.target.value } : prev)}>
                  {['개', 'set', 'L', 'kg', 'box', 'pail'].map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold text-dark">제품명 (한국어)</label>
                <input type="text" className="form-control" value={editing.name_ko || ''}
                  onChange={e => setEditing(prev => prev ? { ...prev, name_ko: e.target.value } : prev)} />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold text-dark">제품명 (영어)</label>
                <input type="text" className="form-control" value={editing.name_en || ''}
                  onChange={e => setEditing(prev => prev ? { ...prev, name_en: e.target.value } : prev)} />
              </div>
              <div className="col-md-9">
                <label className="form-label small fw-bold text-dark">
                  URL Slug <span className="fw-normal text-body-secondary">(제품 상세 페이지 주소: /ko/products/<b>{editing.slug || autoSlug(editing.brand ?? '', editing.sku ?? '')}</b>)</span>
                </label>
                <input type="text" className="form-control" value={editing.slug || ''}
                  placeholder={autoSlug(editing.brand ?? '', editing.sku ?? '')}
                  onChange={e => setEditing(prev => prev ? { ...prev, slug: e.target.value } : prev)} />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-bold text-dark">정렬순서</label>
                <input type="number" className="form-control" value={editing.sort_order ?? 0}
                  onChange={e => setEditing(prev => prev ? { ...prev, sort_order: Number(e.target.value) } : prev)} />
              </div>
            </div>

            {/* ── 가격 ── */}
            <p className="fw-bold text-primary small text-uppercase mb-3 mt-4">가격 정보</p>
            <div className="row g-3 mb-3">
              {[['정가', 'list_price'], ['일반가', 'price_standard'], ['실버가', 'price_silver'], ['골드가', 'price_gold'], ['플래티넘가', 'price_platinum']].map(([label, field]) => (
                <div key={field} className="col-md-2" style={{ minWidth: 120 }}>
                  <label className="form-label small fw-bold text-dark">{label}</label>
                  <input type="number" className="form-control"
                    value={(editing[field as keyof Product] ?? '') as number}
                    onChange={e => setEditing(prev => prev ? { ...prev, [field]: e.target.value === '' ? null : Number(e.target.value) } : prev)} />
                </div>
              ))}
            </div>

            {/* ── 상세 정보 toggle ── */}
            <button type="button" className="btn btn-outline-secondary btn-sm rounded-pill mt-3 mb-3"
              onClick={() => setShowDetail(!showDetail)}>
              <i className={`bi bi-chevron-${showDetail ? 'up' : 'down'} me-2`}></i>
              제품 상세 정보 (설명, 특성, 적용 분야, TDS)
            </button>

            {showDetail && (
              <div className="border rounded-4 p-4 bg-light">
                <div className="mb-3">
                  <label className="form-label small fw-bold text-dark">제품 설명 (한국어)</label>
                  <textarea className="form-control" rows={4} value={editing.description_ko || ''}
                    onChange={e => setEditing(prev => prev ? { ...prev, description_ko: e.target.value } : prev)} />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-dark">
                    주요 특성 <span className="fw-normal text-body-secondary">(줄바꿈으로 구분)</span>
                  </label>
                  <textarea className="form-control" rows={5} value={featuresText}
                    onChange={e => setFeaturesText(e.target.value)}
                    placeholder={'내후성 우수\nUV 저항성\n...'} />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-dark">
                    적용 분야 <span className="fw-normal text-body-secondary">(줄바꿈으로 구분)</span>
                  </label>
                  <textarea className="form-control" rows={4} value={applicationsText}
                    onChange={e => setApplicationsText(e.target.value)}
                    placeholder={'커튼월 실링\n창호 주변 방수\n...'} />
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-dark">제품 이미지</label>
                    <div className="d-flex gap-2 align-items-start">
                      <div className="flex-grow-1">
                        <input type="text" className="form-control form-control-sm rounded-3" value={editing.image_url || ''}
                          placeholder="/assets/img/... 또는 업로드 후 자동 입력"
                          onChange={e => setEditing(prev => prev ? { ...prev, image_url: e.target.value } : prev)} />
                      </div>
                      <button type="button" className="btn btn-sm btn-outline-secondary rounded-3 text-nowrap"
                        onClick={() => imgInputRef.current?.click()} disabled={uploading}>
                        {uploading
                          ? <span className="spinner-border spinner-border-sm" style={{ width: 12, height: 12 }} />
                          : <><i className="bi bi-upload me-1" />업로드</>}
                      </button>
                      <input ref={imgInputRef} type="file" accept="image/*" className="d-none"
                        onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); e.target.value = '' }} />
                    </div>
                    {editing.image_url && (
                      <div className="mt-2">
                        <img src={editing.image_url} alt="preview"
                          style={{ height: 60, width: 60, objectFit: 'cover', borderRadius: 8, border: '1px solid #dee2e6' }} />
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-dark">TDS 파일 URL</label>
                    <input type="text" className="form-control" value={editing.tds_url || ''}
                      placeholder="https://... 또는 /assets/docs/tds-791.pdf"
                      onChange={e => setEditing(prev => prev ? { ...prev, tds_url: e.target.value } : prev)} />
                    <div className="form-text">PDF 파일 링크 (다운로드 버튼 표시)</div>
                  </div>
                </div>
              </div>
            )}

            <div className="d-flex align-items-center gap-3 mt-4">
              <button className="btn btn-primary rounded-pill px-4" onClick={handleSave} disabled={saving}>
                {saving && <span className="spinner-border spinner-border-sm me-2" />}
                저장
              </button>
              <button className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setEditing(null)}>취소</button>
              <div className="form-check ms-2">
                <input type="checkbox" className="form-check-input" id="is_active"
                  checked={editing.is_active ?? true}
                  onChange={e => setEditing(prev => prev ? { ...prev, is_active: e.target.checked } : prev)} />
                <label className="form-check-label fw-bold text-dark" htmlFor="is_active">활성화</label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover mb-0" style={{ fontSize: '0.85rem', minWidth: 800 }}>
          <thead className="table-light">
            <tr>
              <th className="px-4 py-3" style={{ width: 48 }}></th>
              <th className="py-3">제품명</th>
              <th className="py-3">Slug / URL</th>
              <th className="py-3 text-end">정가</th>
              <th className="py-3 text-end">일반가</th>
              <th className="py-3 text-center">상태</th>
              <th className="py-3 text-center pe-4">관리</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} style={{ opacity: p.is_active ? 1 : 0.45 }}>
                <td className="px-4 py-2 align-middle">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name_ko}
                      style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 6, border: '1px solid #dee2e6' }} />
                  ) : (
                    <div style={{ width: 36, height: 36, borderRadius: 6, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="bi bi-image text-body-secondary" style={{ fontSize: '0.85rem' }} />
                    </div>
                  )}
                </td>
                <td className="py-3">
                  <div className="fw-bold text-dark">{p.name_ko}</div>
                  <div className="text-body-secondary" style={{ fontSize: '0.75rem' }}>{p.brand} · {p.sku || '-'}</div>
                </td>
                <td className="py-3">
                  {p.slug ? (
                    <a href={`/ko/products/${p.slug}`} target="_blank" rel="noreferrer"
                      className="text-primary text-decoration-none small">
                      /ko/products/{p.slug} <i className="bi bi-box-arrow-up-right ms-1"></i>
                    </a>
                  ) : (
                    <span className="text-body-secondary small">미설정</span>
                  )}
                </td>
                <td className="py-3 text-end">{Number(p.list_price).toLocaleString('ko-KR')}</td>
                <td className="py-3 text-end">{p.price_standard ? Number(p.price_standard).toLocaleString('ko-KR') : '-'}</td>
                <td className="py-3 text-center">
                  <button className={`btn btn-sm rounded-pill px-3 ${p.is_active ? 'btn-success' : 'btn-outline-secondary'}`}
                    onClick={() => handleToggle(p)} style={{ fontSize: '0.75rem' }}>
                    {p.is_active ? '활성' : '비활성'}
                  </button>
                </td>
                <td className="py-3 text-center pe-4">
                  <div className="d-flex gap-1 justify-content-center">
                    <button className="btn btn-sm btn-outline-primary rounded-pill px-2" onClick={() => openEdit(p)}
                      title="수정"><i className="bi bi-pencil"></i></button>
                    <button className="btn btn-sm btn-outline-danger rounded-pill px-2" onClick={() => handleDelete(p.id)}
                      title="삭제"><i className="bi bi-trash"></i></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="text-center py-5 text-body-secondary">
                {search || filterCategory !== '전체' || filterActive !== 'all' ? '검색 결과 없음' : '제품이 없습니다'}
              </td></tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )
}
