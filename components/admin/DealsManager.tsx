'use client'

import { useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'

const STAGES = [
  { key: 'lead',           label: '리드',     icon: 'bi-lightbulb',          color: '#6c757d', bg: '#f3f4f6' },
  { key: 'quotation',      label: '견적',     icon: 'bi-file-earmark-text',  color: '#D97706', bg: '#fffbeb' },
  { key: 'purchase_order', label: '발주',     icon: 'bi-cart-check',         color: '#1558D6', bg: '#eff6ff' },
  { key: 'invoice',        label: '인보이스', icon: 'bi-receipt',            color: '#7C3AED', bg: '#f5f3ff' },
  { key: 'contract',       label: '계약',     icon: 'bi-pen',                color: '#0369a1', bg: '#e0f2fe' },
  { key: 'completed',      label: '완료',     icon: 'bi-check-circle-fill',  color: '#059669', bg: '#ecfdf5' },
  { key: 'cancelled',      label: '취소',     icon: 'bi-x-circle',           color: '#dc3545', bg: '#fff1f2' },
]
const STAGE_KEYS = STAGES.map(s => s.key)
const ACTIVE_STAGES = STAGE_KEYS.filter(k => k !== 'completed' && k !== 'cancelled')

// doc_type → 문서 생성 링크 파라미터
const DOC_CREATE_LINKS: { label: string; type: string; icon: string }[] = [
  { label: '견적서',      type: 'quotation',           icon: 'bi-file-earmark-text' },
  { label: '발주서',      type: 'purchase_order',      icon: 'bi-cart-check' },
  { label: '인보이스',    type: 'invoice',             icon: 'bi-receipt' },
  { label: '계약서',      type: 'sales_contract',      icon: 'bi-pen' },
]

const DOC_TYPE_LABELS: Record<string, string> = {
  quotation: '견적서', purchase_order: '발주서', receipt: '영수증',
  invoice: '인보이스', invoice_packing_list: '인보이스/패킹', sales_contract: '계약서',
}

const CURRENCY_OPTIONS = ['USD', 'KRW', 'EUR', 'JPY', 'CNY']
const CURRENCY_SYMBOLS: Record<string, string> = { USD: '$', KRW: '₩', EUR: '€', JPY: '¥', CNY: '¥' }

const EMPTY_FORM = {
  title: '', stage: 'quotation', currency: 'USD',
  total_amount: '', contact_id: '', notes: '',
}

interface Contact {
  id: string
  company_name: string | null
  contact_person: string | null
}

interface Document {
  id: string
  doc_type: string
  doc_number: string | null
  title: string | null
  status: string
}

interface Deal {
  id: string
  title: string
  stage: string
  currency: string
  total_amount: number | null
  notes: string | null
  created_at: string
  updated_at: string
  contact_id: string | null
  admin_contacts?: Contact | null
  admin_documents?: Document[]
}

type SortKey = 'newest' | 'oldest' | 'amount_desc' | 'amount_asc'

export default function DealsManager({
  initialDeals,
  contacts,
}: {
  initialDeals: Deal[]
  contacts: Contact[]
}) {
  const [deals, setDeals] = useState<Deal[]>(initialDeals)
  const [modal, setModal] = useState<'create' | 'edit' | null>(null)
  const [editing, setEditing] = useState<Deal | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [filterStage, setFilterStage] = useState('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortKey>('newest')
  const [changingStage, setChangingStage] = useState<string | null>(null)

  const supabase = createClient()

  // ── 통계 ──────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const active = deals.filter(d => ACTIVE_STAGES.includes(d.stage))
    const pipeline = active.reduce((s, d) => s + (d.total_amount ?? 0), 0)
    const completed = deals.filter(d => d.stage === 'completed')
    const closedRevenue = completed.reduce((s, d) => s + (d.total_amount ?? 0), 0)
    const convRate = deals.length > 0
      ? Math.round((completed.length / deals.length) * 100)
      : 0
    return { activeCount: active.length, pipeline, closedRevenue, convRate, completedCount: completed.length }
  }, [deals])

  // ── 필터 + 정렬 ───────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = deals
    if (filterStage !== 'all') list = list.filter(d => d.stage === filterStage)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(d =>
        d.title.toLowerCase().includes(q) ||
        d.admin_contacts?.company_name?.toLowerCase().includes(q) ||
        d.admin_contacts?.contact_person?.toLowerCase().includes(q)
      )
    }
    return [...list].sort((a, b) => {
      if (sort === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      if (sort === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      if (sort === 'amount_desc') return (b.total_amount ?? 0) - (a.total_amount ?? 0)
      return (a.total_amount ?? 0) - (b.total_amount ?? 0)
    })
  }, [deals, filterStage, search, sort])

  const stageCounts = useMemo(() =>
    STAGES.reduce((acc, s) => { acc[s.key] = deals.filter(d => d.stage === s.key).length; return acc }, {} as Record<string, number>)
  , [deals])

  // ── 액션 ──────────────────────────────────────────────────────────────────
  function openCreate() {
    setForm(EMPTY_FORM)
    setEditing(null)
    setModal('create')
  }

  function openEdit(deal: Deal) {
    setForm({
      title: deal.title,
      stage: deal.stage,
      currency: deal.currency,
      total_amount: deal.total_amount?.toString() ?? '',
      contact_id: deal.contact_id ?? '',
      notes: deal.notes ?? '',
    })
    setEditing(deal)
    setModal('edit')
  }

  async function handleSave() {
    if (!form.title.trim()) return
    setSaving(true)
    try {
      const payload = {
        title: form.title.trim(),
        stage: form.stage,
        currency: form.currency,
        total_amount: form.total_amount ? parseFloat(form.total_amount) : null,
        contact_id: form.contact_id || null,
        notes: form.notes || null,
      }
      if (modal === 'create') {
        const { data, error } = await supabase
          .from('admin_deals')
          .insert(payload)
          .select('*, admin_contacts(id,company_name,contact_person), admin_documents(id,doc_type,doc_number,title,status)')
          .single()
        if (!error && data) setDeals(prev => [data, ...prev])
      } else if (editing) {
        const { data, error } = await supabase
          .from('admin_deals')
          .update(payload)
          .eq('id', editing.id)
          .select('*, admin_contacts(id,company_name,contact_person), admin_documents(id,doc_type,doc_number,title,status)')
          .single()
        if (!error && data) setDeals(prev => prev.map(d => d.id === editing.id ? data : d))
      }
      setModal(null)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`'${title}' 거래를 삭제하시겠습니까?`)) return
    const { error } = await supabase.from('admin_deals').delete().eq('id', id)
    if (!error) setDeals(prev => prev.filter(d => d.id !== id))
  }

  async function changeStage(deal: Deal, newStage: string) {
    if (newStage === deal.stage) return
    setChangingStage(deal.id)
    const { error } = await supabase.from('admin_deals').update({ stage: newStage }).eq('id', deal.id)
    if (!error) setDeals(prev => prev.map(d => d.id === deal.id ? { ...d, stage: newStage } : d))
    setChangingStage(null)
  }

  // ── 렌더 ──────────────────────────────────────────────────────────────────
  const stageMap = Object.fromEntries(STAGES.map(s => [s.key, s]))

  return (
    <div>
      {/* 헤더 */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-start gap-3 mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">거래 파이프라인</h1>
          <p className="text-body-secondary mb-0 small">총 {deals.length}건 · 활성 {stats.activeCount}건</p>
        </div>
        <button className="btn btn-sm btn-primary rounded-pill px-4" onClick={openCreate}>
          <i className="bi bi-plus-lg me-1 me-md-2" />신규 거래
        </button>
      </div>

      {/* 파이프라인 요약 통계 */}
      <div className="row g-2 g-md-3 mb-4">
        {[
          { label: '활성 파이프라인', value: `$${stats.pipeline.toLocaleString()}`, sub: `${stats.activeCount}건`, icon: 'bi-graph-up-arrow', color: '#1558D6', bg: '#EFF6FF' },
          { label: '완료 매출', value: `$${stats.closedRevenue.toLocaleString()}`, sub: `${stats.completedCount}건`, icon: 'bi-check-circle-fill', color: '#059669', bg: '#ecfdf5' },
          { label: '전환율', value: `${stats.convRate}%`, sub: '완료율', icon: 'bi-percent', color: '#7C3AED', bg: '#f5f3ff' },
          { label: '전체 거래', value: `${deals.length}건`, sub: `취소 ${deals.filter(d => d.stage === 'cancelled').length}건`, icon: 'bi-diagram-3', color: '#D97706', bg: '#FEF3C7' },
        ].map((s, i) => (
          <div key={i} className="col-6 col-xl-3">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-2 p-md-3 d-flex align-items-center gap-2 gap-md-3">
                <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: 36, height: 36, background: s.bg }}>
                  <i className={`bi ${s.icon}`} style={{ color: s.color, fontSize: '0.9rem' }} />
                </div>
                <div className="min-w-0">
                  <div className="text-body-secondary text-truncate" style={{ fontSize: '0.65rem' }}>{s.label}</div>
                  <div className="fw-bold text-dark text-truncate" style={{ fontSize: '0.95rem', lineHeight: 1.2 }}>{s.value}</div>
                  <div className="text-body-secondary text-truncate" style={{ fontSize: '0.6rem' }}>{s.sub}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 단계 진행 바 */}
      <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
        <div className="table-responsive">
          <div className="d-flex gap-0 align-items-stretch" style={{ height: 42, minWidth: 600 }}>
            {STAGES.filter(s => s.key !== 'cancelled').map((s, i, arr) => {
              const count = stageCounts[s.key] ?? 0
              const isActive = filterStage === s.key
              return (
                <button
                  key={s.key}
                  onClick={() => setFilterStage(p => p === s.key ? 'all' : s.key)}
                  className="d-flex align-items-center justify-content-center gap-1 border-0 flex-grow-1 px-2"
                  style={{
                    background: isActive ? s.color : s.bg,
                    color: isActive ? '#fff' : s.color,
                    borderRadius: 0,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    whiteSpace: 'nowrap',
                  }}
                  title={s.label}
                >
                  <i className={`bi ${s.icon}`} style={{ fontSize: '0.8rem' }} />
                  <span>{s.label}</span>
                  {count > 0 && (
                    <span className="badge rounded-pill"
                      style={{ background: isActive ? 'rgba(255,255,255,0.3)' : s.color + '20', color: isActive ? '#fff' : s.color, fontSize: '0.6rem' }}>
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 검색 + 필터 + 정렬 */}
      <div className="d-flex gap-2 align-items-center mb-3 flex-wrap">
        <div className="input-group rounded-pill overflow-hidden border flex-grow-1" style={{ maxWidth: 320, minWidth: 180 }}>
          <span className="input-group-text bg-white border-0 ps-3">
            <i className="bi bi-search text-body-secondary" style={{ fontSize: '0.85rem' }} />
          </span>
          <input
            className="form-control border-0"
            placeholder="거래명, 고객명 검색..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ fontSize: '0.875rem' }}
          />
          {search && (
            <button className="btn btn-light border-0 px-2" onClick={() => setSearch('')}>
              <i className="bi bi-x" />
            </button>
          )}
        </div>

        <div className="d-flex gap-2 align-items-center ms-auto">
          {filterStage !== 'all' && (
            <button
              className="btn btn-xs rounded-pill px-2 py-1"
              style={{ background: stageMap[filterStage]?.color, color: '#fff', border: 'none', fontSize: '0.7rem' }}
              onClick={() => setFilterStage('all')}
            >
              {stageMap[filterStage]?.label} <i className="bi bi-x ms-1" />
            </button>
          )}

          <select
            className="form-select form-select-sm rounded-pill border"
            style={{ width: 'auto', fontSize: '0.75rem' }}
            value={sort}
            onChange={e => setSort(e.target.value as SortKey)}
          >
            <option value="newest">최신순</option>
            <option value="oldest">오래된순</option>
            <option value="amount_desc">금액 높은순</option>
            <option value="amount_asc">금액 낮은순</option>
          </select>
          <span className="text-body-secondary" style={{ fontSize: '0.75rem' }}>{filtered.length}건</span>
        </div>
      </div>

      {/* 딜 카드 목록 */}
      {filtered.length === 0 ? (
        <div className="text-center py-5 text-body-secondary">
          <i className="bi bi-inbox fs-2 d-block mb-2 opacity-25" />
          {search ? '검색 결과가 없습니다' : '등록된 거래가 없습니다'}
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {/* 단계별로 그룹핑해서 보여줌 (all 뷰) 또는 flat list (필터 뷰) */}
          {filterStage === 'all' ? (
            STAGES.map(stage => {
              const stageDeals = filtered.filter(d => d.stage === stage.key)
              if (stageDeals.length === 0) return null
              return (
                <div key={stage.key}>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <i className={`bi ${stage.icon}`} style={{ color: stage.color }} />
                    <span className="fw-bold small" style={{ color: stage.color }}>{stage.label}</span>
                    <span className="badge rounded-pill text-white" style={{ background: stage.color, fontSize: '0.65rem' }}>{stageDeals.length}</span>
                    {stageDeals.some(d => d.total_amount) && (
                      <span className="text-body-secondary small ms-auto">
                        합계 {stageDeals.reduce((s, d) => s + (d.total_amount ?? 0), 0).toLocaleString()} {stageDeals[0]?.currency}
                      </span>
                    )}
                  </div>
                  <div className="row g-2 mb-2">
                    {stageDeals.map(deal => (
                      <div key={deal.id} className="col-md-6 col-xl-4">
                        <DealCard
                          deal={deal}
                          stage={stage}
                          contacts={contacts}
                          isChanging={changingStage === deal.id}
                          onEdit={() => openEdit(deal)}
                          onDelete={() => handleDelete(deal.id, deal.title)}
                          onStageChange={newStage => changeStage(deal, newStage)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )
            })
          ) : (
            <div className="row g-2">
              {filtered.map(deal => (
                <div key={deal.id} className="col-md-6 col-xl-4">
                  <DealCard
                    deal={deal}
                    stage={stageMap[deal.stage] ?? STAGES[0]}
                    contacts={contacts}
                    isChanging={changingStage === deal.id}
                    onEdit={() => openEdit(deal)}
                    onDelete={() => handleDelete(deal.id, deal.title)}
                    onStageChange={newStage => changeStage(deal, newStage)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 생성/수정 모달 */}
      {modal && (
        <div
          className="modal d-block"
          style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
          onClick={e => { if (e.target === e.currentTarget) setModal(null) }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-header border-0 pb-0 px-4 pt-4">
                <h5 className="modal-title fw-bold">
                  {modal === 'create' ? '신규 거래 등록' : '거래 수정'}
                </h5>
                <button className="btn-close" onClick={() => setModal(null)} />
              </div>

              <div className="modal-body px-4 py-3">
                {/* 거래명 */}
                <div className="mb-3">
                  <label className="form-label fw-bold small">거래명 <span className="text-danger">*</span></label>
                  <input
                    className="form-control rounded-3"
                    placeholder="예: ABC건설 방수재 공급"
                    value={form.title}
                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                    autoFocus
                  />
                </div>

                <div className="row g-3 mb-3">
                  {/* 고객 */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold small">고객</label>
                    <select
                      className="form-select rounded-3"
                      value={form.contact_id}
                      onChange={e => setForm(p => ({ ...p, contact_id: e.target.value }))}
                    >
                      <option value="">— 고객 선택 —</option>
                      {contacts.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.company_name || '(미입력)'}{c.contact_person ? ` · ${c.contact_person}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* 단계 */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold small">단계</label>
                    <select
                      className="form-select rounded-3"
                      value={form.stage}
                      onChange={e => setForm(p => ({ ...p, stage: e.target.value }))}
                    >
                      {STAGES.map(s => (
                        <option key={s.key} value={s.key}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  {/* 통화 */}
                  <div className="col-4 col-md-3">
                    <label className="form-label fw-bold small">통화</label>
                    <select
                      className="form-select rounded-3"
                      value={form.currency}
                      onChange={e => setForm(p => ({ ...p, currency: e.target.value }))}
                    >
                      {CURRENCY_OPTIONS.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  {/* 금액 */}
                  <div className="col-8 col-md-9">
                    <label className="form-label fw-bold small">금액</label>
                    <div className="input-group">
                      <span className="input-group-text">{CURRENCY_SYMBOLS[form.currency] ?? form.currency}</span>
                      <input
                        className="form-control rounded-end-3"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0"
                        value={form.total_amount}
                        onChange={e => setForm(p => ({ ...p, total_amount: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                {/* 메모 */}
                <div className="mb-3">
                  <label className="form-label fw-bold small">메모</label>
                  <textarea
                    className="form-control rounded-3"
                    rows={3}
                    placeholder="거래 내용, 특이사항..."
                    value={form.notes}
                    onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  />
                </div>

                {/* 연결된 문서 (수정 모드) */}
                {modal === 'edit' && editing && (
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span className="fw-bold small">연결된 문서</span>
                      <span className="text-body-secondary" style={{ fontSize: '0.72rem' }}>
                        {editing.admin_documents?.length ?? 0}건
                      </span>
                    </div>
                    {(editing.admin_documents?.length ?? 0) > 0 ? (
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        {editing.admin_documents!.map(doc => (
                          <a
                            key={doc.id}
                            href="/admin/documents"
                            className="text-decoration-none d-inline-flex align-items-center gap-1 rounded-pill px-3 py-1"
                            style={{ background: '#f0f4ff', color: '#1558D6', fontSize: '0.75rem', border: '1px solid #c7d8ff' }}
                          >
                            <i className="bi bi-file-earmark" />
                            {doc.title || doc.doc_number || DOC_TYPE_LABELS[doc.doc_type]}
                            {doc.status === 'final' && (
                              <span className="badge bg-success ms-1" style={{ fontSize: '0.6rem' }}>확정</span>
                            )}
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-body-secondary small mb-3">연결된 문서 없음</p>
                    )}

                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <span className="text-body-secondary small">문서 생성:</span>
                      {DOC_CREATE_LINKS.map(link => (
                        <a
                          key={link.type}
                          href={`/admin/documents?create=${link.type}&deal=${editing.id}`}
                          className="btn btn-sm btn-outline-primary rounded-pill px-3"
                          style={{ fontSize: '0.78rem' }}
                        >
                          <i className={`bi ${link.icon} me-1`} />{link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer border-0 px-4 pb-4 pt-0 d-flex justify-content-between">
                {modal === 'edit' && editing ? (
                  <button
                    className="btn btn-outline-danger rounded-pill px-3"
                    onClick={() => { setModal(null); handleDelete(editing.id, editing.title) }}
                  >
                    <i className="bi bi-trash me-1" />삭제
                  </button>
                ) : <div />}
                <div className="d-flex gap-2">
                  <button className="btn btn-light rounded-pill px-4" onClick={() => setModal(null)}>취소</button>
                  <button
                    className="btn btn-primary rounded-pill px-4"
                    onClick={handleSave}
                    disabled={saving || !form.title.trim()}
                  >
                    {saving && <span className="spinner-border spinner-border-sm me-1" style={{ width: 14, height: 14 }} />}
                    {modal === 'create' ? '등록' : '저장'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function DealCard({
  deal, stage, contacts, isChanging, onEdit, onDelete, onStageChange,
}: {
  deal: Deal
  stage: typeof STAGES[number]
  contacts: Contact[]
  isChanging: boolean
  onEdit: () => void
  onDelete: () => void
  onStageChange: (stage: string) => void
}) {
  const sym = CURRENCY_SYMBOLS[deal.currency] ?? deal.currency

  return (
    <div
      className="card border-0 shadow-sm rounded-3 h-100"
      style={{
        opacity: isChanging ? 0.55 : 1,
        transition: 'opacity 0.2s',
        borderLeft: `3px solid ${stage.color}`,
      }}
    >
      <div className="card-body p-3 d-flex flex-column gap-1">
        {/* 제목 + 편집/삭제 */}
        <div className="d-flex align-items-start justify-content-between gap-2">
          <div className="fw-bold text-dark" style={{ fontSize: '0.9rem', lineHeight: 1.35 }}>{deal.title}</div>
          <div className="d-flex gap-1 flex-shrink-0">
            <button
              className="btn btn-sm btn-light rounded-2 px-1 py-0"
              style={{ fontSize: '0.72rem' }}
              onClick={onEdit}
              title="수정"
            >
              <i className="bi bi-pencil" />
            </button>
            <button
              className="btn btn-sm btn-light rounded-2 px-1 py-0"
              style={{ fontSize: '0.72rem' }}
              onClick={onDelete}
              title="삭제"
            >
              <i className="bi bi-trash text-danger" />
            </button>
          </div>
        </div>

        {/* 고객 */}
        {deal.admin_contacts && (
          <div className="d-flex align-items-center gap-1 text-body-secondary" style={{ fontSize: '0.78rem' }}>
            <i className="bi bi-building" style={{ width: 14, flexShrink: 0 }} />
            <span className="text-truncate">
              {deal.admin_contacts.company_name || '(미입력)'}
              {deal.admin_contacts.contact_person && ` · ${deal.admin_contacts.contact_person}`}
            </span>
          </div>
        )}

        {/* 금액 */}
        {deal.total_amount != null && (
          <div className="fw-bold" style={{ color: stage.color, fontSize: '0.92rem' }}>
            {sym}{deal.total_amount.toLocaleString()} {deal.currency}
          </div>
        )}

        {/* 연결 문서 */}
        {(deal.admin_documents?.length ?? 0) > 0 && (
          <div className="d-flex flex-wrap gap-1">
            {deal.admin_documents!.map(doc => (
              <span
                key={doc.id}
                className="badge rounded-pill px-2"
                style={{ background: '#f0f4ff', color: '#1558D6', fontSize: '0.65rem', border: '1px solid #d0e2ff' }}
              >
                {DOC_TYPE_LABELS[doc.doc_type] ?? doc.doc_type}
                {doc.status === 'final' && ' ✓'}
              </span>
            ))}
          </div>
        )}

        {/* 메모 */}
        {deal.notes && (
          <div className="text-body-secondary" style={{ fontSize: '0.72rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            <i className="bi bi-sticky me-1" />{deal.notes}
          </div>
        )}

        {/* 하단: 날짜 + 단계 변경 */}
        <div className="d-flex align-items-center justify-content-between mt-auto pt-2 border-top" style={{ borderColor: '#f0f0f0' }}>
          <span className="text-body-secondary" style={{ fontSize: '0.68rem' }}>
            {new Date(deal.created_at).toLocaleDateString('ko-KR')}
          </span>
          <select
            className="form-select form-select-sm border-0 rounded-pill text-end py-0 px-2"
            style={{
              fontSize: '0.72rem',
              width: 'auto',
              background: stage.bg,
              color: stage.color,
              fontWeight: 600,
              cursor: 'pointer',
            }}
            value={deal.stage}
            onChange={e => onStageChange(e.target.value)}
            disabled={isChanging}
          >
            {STAGES.map(s => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
