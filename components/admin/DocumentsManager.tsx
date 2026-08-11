'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/client'
import type {
  AdminDocument, DocType, DocStatus, DocContent,
  QuotationContent, PurchaseOrderContent, ReceiptContent,
  InvoiceContent, InvoicePackingListContent, SalesContractContent,
  DocLineItem, ReceiptItem, InvoiceLineItem, PackingLineItem, ContractLineItem,
  ProductOption, CustomerOption,
} from '@/lib/admin-document-types'
import {
  DOC_TYPE_LABELS, DOC_TYPE_ICONS, DOC_TYPE_COLORS,
  DOC_STATUS_LABELS, defaultContent,
} from '@/lib/admin-document-types'

const DocumentPDFButton = dynamic(() => import('@/components/admin/DocumentPDFButton'), { ssr: false })

type View = 'list' | 'editor'
type TabFilter = 'all' | DocType

interface DealOption {
  id: string
  title: string
  stage: string
}

const PAGE_SIZE = 25

// ─── 선택 항목 옵션 상수 ───────────────────────────────────────────────────────
const PAYMENT_TERMS_KR = [
  '세금계산서 발행 후 30일 이내',
  '세금계산서 발행 후 60일 이내',
  '납품 후 30일 이내',
  '납품 후 60일 이내',
  '선불 (납품 전 전액 결제)',
  '인수 확인 후 즉시',
]
const DELIVERY_TERMS_KR = [
  '계약 후 협의',
  '계약 후 1주일 이내',
  '계약 후 2주 이내',
  '계약 후 4주 이내',
  '발주 후 즉시',
  'FOB 인천',
  'DDP 현장 납품',
]
const ACCEPTANCE_CONDITIONS_OPTS = [
  '수량 및 외관 이상 없음을 확인함',
  '수량 이상 없음 / 외관 일부 손상 있으나 기능 이상 없음',
  '수량 부족 확인됨',
  '외관 손상 확인됨',
]
const CURRENCIES = ['USD', 'EUR', 'KRW', 'JPY', 'CNY', 'SGD', 'AUD', 'GBP']
const INCOTERMS_OPTS = ['FOB', 'CIF', 'CFR', 'EXW', 'FCA', 'DAP', 'DDP', 'CIP', 'CPT', 'FAS']
const PAYMENT_TERMS_EN = [
  'T/T 100% IN ADVANCE',
  'T/T 30% ADVANCE, 70% BEFORE SHIPMENT',
  'T/T 50% ADVANCE, 50% BEFORE SHIPMENT',
  'T/T WITHIN 30 DAYS AFTER B/L DATE',
  'L/C AT SIGHT',
  'L/C 30 DAYS',
]
const PORTS_LOADING = ['ICN (Incheon, Korea)', 'PUS (Busan, Korea)', 'SEL (Seoul, Korea)', 'GMP (Gimpo, Korea)']
const PRICE_TERMS = ['FOB Busan', 'FOB Incheon', 'CIF', 'CFR', 'EXW Korea', 'DDP Destination']
const PARTIAL_SHIPMENT_OPTS = ['Not allowed', 'Allowed']
const TRANSSHIPMENT_OPTS = ['Allowed', 'Not allowed']
const DELIVERY_LOCATIONS = [
  '현장 납품',
  '창고 입고',
  '공장 납품',
  '지정 장소 납품',
  '직접 수령 (방문)',
  '택배 발송',
  '화물 발송',
]

const TABS: { key: TabFilter; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'quotation', label: '견적서' },
  { key: 'purchase_order', label: '발주서' },
  { key: 'receipt', label: '인수증' },
  { key: 'invoice', label: '인보이스' },
  { key: 'invoice_packing_list', label: '인보이스+패킹' },
  { key: 'sales_contract', label: '공급계약서' },
]

// ─── 제품 검색 모달 ────────────────────────────────────────────────────────────
function ProductPicker({ products, onSelect, onClose }: {
  products: ProductOption[]
  onSelect: (p: ProductOption) => void
  onClose: () => void
}) {
  const [q, setQ] = useState('')
  const filtered = products.filter(p =>
    p.name_ko.toLowerCase().includes(q.toLowerCase()) ||
    (p.sku ?? '').toLowerCase().includes(q.toLowerCase()) ||
    p.brand.toLowerCase().includes(q.toLowerCase())
  )
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 16, width: 580, maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom">
          <span className="fw-bold">제품 검색</span>
          <button className="btn btn-sm btn-outline-secondary rounded-pill px-3" onClick={onClose}>닫기</button>
        </div>
        <div className="px-4 py-2 border-bottom">
          <input
            className="form-control"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="제품명, SKU, 브랜드 검색..."
            autoFocus
          />
        </div>
        <div style={{ overflowY: 'auto' }}>
          {filtered.length === 0 && <p className="text-center text-body-secondary py-5">검색 결과 없음</p>}
          {filtered.map(p => (
            <button
              key={p.id}
              className="btn btn-light w-100 text-start d-flex align-items-center gap-3 px-4 py-3 border-0 rounded-0"
              style={{ borderBottom: '1px solid #f0f0f0' }}
              onClick={() => { onSelect(p); onClose() }}
            >
              <div style={{ flex: 1 }}>
                <div className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>{p.name_ko}</div>
                <div className="text-body-secondary" style={{ fontSize: '0.78rem' }}>
                  {p.brand} {p.sku ? `· ${p.sku}` : ''} · {p.unit} · 정가 {p.list_price.toLocaleString('ko-KR')}원
                </div>
              </div>
              <i className="bi bi-plus-circle text-primary" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── 고객 검색 모달 ────────────────────────────────────────────────────────────
function CustomerPicker({ customers, onSelect, onClose, title = '고객 불러오기' }: {
  customers: CustomerOption[]
  onSelect: (c: CustomerOption) => void
  onClose: () => void
  title?: string
}) {
  const [q, setQ] = useState('')
  const TIER_LABELS: Record<string, string> = { standard: '일반', silver: '실버', gold: '골드', platinum: '플래티넘' }
  const TIER_COLORS: Record<string, string> = { standard: 'bg-secondary', silver: 'bg-info text-dark', gold: 'bg-warning text-dark', platinum: 'bg-primary' }
  const filtered = customers.filter(c =>
    (c.company_name ?? '').toLowerCase().includes(q.toLowerCase()) ||
    (c.contact_person ?? '').toLowerCase().includes(q.toLowerCase())
  )
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 16, width: 520, maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom">
          <span className="fw-bold">{title}</span>
          <button className="btn btn-sm btn-outline-secondary rounded-pill px-3" onClick={onClose}>닫기</button>
        </div>
        <div className="px-4 py-2 border-bottom">
          <input
            className="form-control"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="회사명, 담당자 검색..."
            autoFocus
          />
        </div>
        <div style={{ overflowY: 'auto' }}>
          {filtered.length === 0 && <p className="text-center text-body-secondary py-5">검색 결과 없음</p>}
          {filtered.map(c => (
            <button
              key={c.id}
              className="btn btn-light w-100 text-start d-flex align-items-center gap-3 px-4 py-3 border-0 rounded-0"
              style={{ borderBottom: '1px solid #f0f0f0' }}
              onClick={() => { onSelect(c); onClose() }}
            >
              <div style={{ flex: 1 }}>
                <div className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>{c.company_name || '(회사명 없음)'}</div>
                <div className="text-body-secondary" style={{ fontSize: '0.78rem' }}>{c.contact_person || '-'} · {c.phone || '-'}</div>
              </div>
              <span className={`badge rounded-pill ${TIER_COLORS[c.tier] ?? 'bg-secondary'}`} style={{ fontSize: '0.65rem' }}>
                {TIER_LABELS[c.tier] ?? c.tier}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── 배지 컴포넌트 ─────────────────────────────────────────────────────────────
function DocBadge({ type }: { type: DocType }) {
  const color = DOC_TYPE_COLORS[type]
  return (
    <span className="badge rounded-pill" style={{ backgroundColor: color + '20', color, fontSize: '0.7rem', fontWeight: 600 }}>
      <i className={`bi ${DOC_TYPE_ICONS[type]} me-1`} />
      {DOC_TYPE_LABELS[type]}
    </span>
  )
}

function StatusBadge({ status }: { status: DocStatus }) {
  return (
    <span className={`badge rounded-pill ${status === 'final' ? 'bg-success' : 'bg-secondary'}`} style={{ fontSize: '0.7rem' }}>
      {DOC_STATUS_LABELS[status]}
    </span>
  )
}

function fi(label: string, value: string, onChange: (v: string) => void, type = 'text', placeholder = '') {
  return (
    <div className="mb-3">
      <label className="form-label small fw-bold text-dark mb-1">{label}</label>
      <input type={type} className="form-control form-control-sm" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  )
}

function SelectOrInput({ label, value, onChange, options, placeholder = '' }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; placeholder?: string
}) {
  const [custom, setCustom] = useState(() => value !== '' && !options.includes(value))
  return (
    <div className="mb-3">
      <label className="form-label small fw-bold text-dark mb-1">{label}</label>
      {!custom ? (
        <select
          className="form-select form-select-sm"
          value={value}
          onChange={e => {
            if (e.target.value === '__custom__') { setCustom(true); onChange('') }
            else onChange(e.target.value)
          }}
        >
          <option value="">— 선택하세요 —</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
          <option value="__custom__">✏️ 직접 입력...</option>
        </select>
      ) : (
        <div className="input-group input-group-sm">
          <input
            className="form-control"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            autoFocus
          />
          <button className="btn btn-outline-secondary" type="button" onClick={() => setCustom(false)} title="목록에서 선택">
            <i className="bi bi-list-ul" />
          </button>
        </div>
      )}
    </div>
  )
}

// ─── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
export default function DocumentsManager({
  initialDocs, products, customers, deals,
}: {
  initialDocs: AdminDocument[]
  products: ProductOption[]
  customers: CustomerOption[]
  deals: DealOption[]
}) {
  const supabase = createClient()
  const [view, setView] = useState<View>('list')
  const [tab, setTab] = useState<TabFilter>('all')
  const [docs, setDocs] = useState<AdminDocument[]>(initialDocs)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editType, setEditType] = useState<DocType>('quotation')
  const [content, setContent] = useState<DocContent | null>(null)
  const [docTitle, setDocTitle] = useState('')
  const [docStatus, setDocStatus] = useState<DocStatus>('draft')
  const [docLang, setDocLang] = useState<'ko' | 'en'>('ko')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null)
  const [showCreateMenu, setShowCreateMenu] = useState(false)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | DocStatus>('all')
  const [contactId, setContactId] = useState<string | null>(null)
  const [dealId, setDealId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [draftBanner, setDraftBanner] = useState<{ key: string; savedAt: string } | null>(null)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const activeDraftKey = useRef<string | null>(null)
  const searchParams = useSearchParams()

  const filteredDocs = docs.filter(d => {
    const matchTab = tab === 'all' || d.doc_type === tab
    const matchStatus = filterStatus === 'all' || d.status === filterStatus
    const q = search.toLowerCase()
    const matchSearch = !search ||
      d.doc_number.toLowerCase().includes(q) ||
      (d.title ?? '').toLowerCase().includes(q)
    return matchTab && matchStatus && matchSearch
  })

  // URL 파라미터로 자동 열기 (?create=type&deal=id)
  useEffect(() => {
    const createType = searchParams.get('create') as DocType | null
    const dealParam = searchParams.get('deal')
    if (createType) {
      if (dealParam) setDealId(dealParam)
      openCreate(createType)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // 자동저장 effect (2초 디바운스)
  useEffect(() => {
    if (view !== 'editor' || !content) return
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      const key = activeDraftKey.current
      if (!key) return
      try {
        localStorage.setItem(key, JSON.stringify({ content, docTitle, contactId, dealId, docLang, savedAt: new Date().toISOString() }))
      } catch {}
    }, 2000)
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current) }
  }, [content, docTitle, contactId, dealId, docLang, view])

  function openCreate(type: DocType) {
    const key = `kct-draft:${type}:new`
    activeDraftKey.current = key
    setContactId(null); setDealId(null); setDraftBanner(null); setDocLang('ko')
    try {
      const raw = localStorage.getItem(key)
      if (raw) {
        const saved = JSON.parse(raw)
        const mins = Math.round((Date.now() - new Date(saved.savedAt).getTime()) / 60000)
        setDraftBanner({ key, savedAt: mins < 60 ? `${mins}분 전` : `${Math.round(mins / 60)}시간 전` })
        setContent(saved.content); setDocTitle(saved.docTitle ?? ''); setContactId(saved.contactId ?? null); setDealId(saved.dealId ?? null)
        if (saved.docLang) setDocLang(saved.docLang)
      } else {
        setContent(defaultContent(type)); setDocTitle('')
      }
    } catch { setContent(defaultContent(type)); setDocTitle('') }
    setEditType(type); setEditingId(null); setDocStatus('draft'); setMsg(null); setView('editor')
  }

  function openEdit(doc: AdminDocument) {
    const key = `kct-draft:${doc.doc_type}:${doc.id}`
    activeDraftKey.current = key
    setContactId((doc as any).contact_id ?? null)
    setDealId((doc as any).deal_id ?? null)
    setDraftBanner(null)
    setDocLang(doc.lang ?? 'ko')
    try {
      const raw = localStorage.getItem(key)
      if (raw) {
        const saved = JSON.parse(raw)
        const mins = Math.round((Date.now() - new Date(saved.savedAt).getTime()) / 60000)
        setDraftBanner({ key, savedAt: mins < 60 ? `${mins}분 전` : `${Math.round(mins / 60)}시간 전` })
        setContent(saved.content); setDocTitle(saved.docTitle ?? doc.title); if (saved.dealId) setDealId(saved.dealId)
        if (saved.docLang) setDocLang(saved.docLang)
      } else {
        setContent(doc.content); setDocTitle(doc.title)
      }
    } catch { setContent(doc.content); setDocTitle(doc.title) }
    setEditType(doc.doc_type); setEditingId(doc.id); setDocStatus(doc.status); setMsg(null); setView('editor')
  }

  function dismissDraft(restore: boolean) {
    if (!draftBanner) return
    if (!restore) {
      try { localStorage.removeItem(draftBanner.key) } catch {}
      const key = draftBanner.key
      // restore original content
      const docId = editingId
      if (docId) {
        const orig = docs.find(d => d.id === docId)
        if (orig) { setContent(orig.content); setDocTitle(orig.title) }
      } else {
        setContent(defaultContent(editType)); setDocTitle('')
      }
    }
    setDraftBanner(null)
  }

  function backToList() {
    activeDraftKey.current = null
    setView('list'); setContent(null); setEditingId(null); setMsg(null); setDraftBanner(null)
  }

  async function handleSave(status: DocStatus) {
    if (!content) return
    setSaving(true); setMsg(null)
    const c = content as any
    const docNumber = c.docNumber || c.contractNo || ''
    const payload = {
      doc_type: editType, doc_number: docNumber, title: docTitle || docNumber,
      content, status, lang: docLang, contact_id: contactId, deal_id: dealId, updated_at: new Date().toISOString(),
    }
    try {
      if (editingId) {
        const { error } = await supabase.from('admin_documents').update(payload).eq('id', editingId)
        if (error) throw error
        setDocs(prev => prev.map(d => d.id === editingId ? { ...d, ...payload, id: editingId } as AdminDocument : d))
      } else {
        const { data, error } = await supabase.from('admin_documents').insert({ ...payload, created_at: new Date().toISOString() }).select().single()
        if (error) throw error
        setDocs(prev => [data as AdminDocument, ...prev])
        setEditingId(data.id)
        activeDraftKey.current = `kct-draft:${editType}:${data.id}`
      }
      // 저장 성공 시 로컬 초안 삭제
      try { if (activeDraftKey.current) localStorage.removeItem(activeDraftKey.current) } catch {}
      setDraftBanner(null)
      setDocStatus(status)
      setMsg({ text: status === 'final' ? '확정 저장 완료' : '임시저장 완료', ok: true })
    } catch (e: any) {
      setMsg({ text: '저장 실패: ' + e.message, ok: false })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('삭제하시겠습니까?')) return
    const { error } = await supabase.from('admin_documents').delete().eq('id', id)
    if (!error) setDocs(prev => prev.filter(d => d.id !== id))
  }

  async function handleDuplicate(doc: AdminDocument) {
    const { genDocNumber } = await import('@/lib/admin-document-types')
    const newDocNumber = genDocNumber(doc.doc_type)
    const newContent = { ...(doc.content as any), docNumber: newDocNumber, contractNo: newDocNumber }
    const payload = {
      doc_type: doc.doc_type, doc_number: newDocNumber,
      title: `${doc.title} (복사본)`, content: newContent, status: 'draft' as DocStatus,
      contact_id: (doc as any).contact_id ?? null,
      deal_id: (doc as any).deal_id ?? null,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    }
    const { data, error } = await supabase.from('admin_documents').insert(payload).select().single()
    if (!error && data) {
      setDocs(prev => [data as AdminDocument, ...prev])
      openEdit(data as AdminDocument)
    }
  }

  const updateContent = useCallback((updater: (prev: any) => any) => {
    setContent(prev => prev ? updater(prev) : prev)
  }, [])

  const pagedDocs = filteredDocs.slice(0, page * PAGE_SIZE)
  const hasMore = filteredDocs.length > pagedDocs.length

  if (view === 'editor' && content) {
    return (
      <EditorView
        type={editType} content={content} title={docTitle} status={docStatus}
        lang={docLang} onLangChange={setDocLang}
        saving={saving} msg={msg} editingId={editingId}
        onBack={backToList} onTitleChange={setDocTitle}
        onContentChange={updateContent} onSave={handleSave}
        onContactPick={setContactId}
        dealId={dealId} onDealPick={setDealId} deals={deals}
        docs={docs} products={products} customers={customers}
        draftBanner={draftBanner} onDismissDraft={dismissDraft}
      />
    )
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">문서 생성</h1>
          <p className="text-body-secondary mb-0">무역 문서 작성 및 관리</p>
        </div>
        <div style={{ position: 'relative' }}>
          <button className="btn btn-primary rounded-pill px-4" onClick={() => setShowCreateMenu(v => !v)}>
            <i className="bi bi-plus-lg me-2" />새 문서 만들기
            <i className={`bi bi-chevron-${showCreateMenu ? 'up' : 'down'} ms-2`} style={{ fontSize: '0.75rem' }} />
          </button>
          {showCreateMenu && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 999 }} onClick={() => setShowCreateMenu(false)} />
              <div className="card border-0 shadow" style={{ position: 'absolute', right: 0, top: '110%', zIndex: 1000, minWidth: 200, borderRadius: 12, overflow: 'hidden' }}>
                {(['quotation', 'purchase_order', 'receipt', 'invoice', 'invoice_packing_list', 'sales_contract'] as DocType[]).map(type => (
                  <button key={type} className="btn btn-light text-start d-flex align-items-center gap-2 px-4 py-3 border-0 rounded-0" style={{ fontSize: '0.9rem' }}
                    onClick={() => { openCreate(type); setShowCreateMenu(false) }}>
                    <i className={`bi ${DOC_TYPE_ICONS[type]}`} style={{ color: DOC_TYPE_COLORS[type], fontSize: '1.1rem' }} />
                    <span><strong>{DOC_TYPE_LABELS[type]}</strong> 만들기</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="d-flex gap-2 mb-3 flex-wrap">
        {TABS.map(t => (
          <button key={t.key} className={`btn btn-sm rounded-pill px-3 ${tab === t.key ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => setTab(t.key)}>
            {t.label}
            <span className={`ms-2 badge rounded-pill ${tab === t.key ? 'bg-white text-dark' : 'bg-secondary text-white'}`} style={{ fontSize: '0.65rem' }}>
              {t.key === 'all' ? docs.length : docs.filter(d => d.doc_type === t.key).length}
            </span>
          </button>
        ))}
      </div>

      <div className="d-flex gap-2 mb-4 align-items-center">
        <input
          className="form-control form-control-sm rounded-pill"
          style={{ width: 260 }}
          placeholder="문서번호 / 제목 검색..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="btn-group rounded-pill overflow-hidden border ms-1">
          {(['all', 'draft', 'final'] as const).map(v => (
            <button
              key={v}
              className={`btn btn-sm ${filterStatus === v ? 'btn-dark' : 'btn-light'}`}
              style={{ borderRadius: 0, border: 'none', fontSize: '0.8rem', paddingInline: 12 }}
              onClick={() => setFilterStatus(v)}
            >
              {v === 'all' ? '전체' : v === 'draft' ? '임시저장' : '확정'}
            </button>
          ))}
        </div>
        <span className="text-body-secondary small ms-auto">
          {filteredDocs.length}건
        </span>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <table className="table table-hover mb-0" style={{ fontSize: '0.85rem' }}>
          <thead className="table-light">
            <tr>
              <th className="px-4 py-3">유형</th>
              <th className="py-3">문서번호</th>
              <th className="py-3">제목</th>
              <th className="py-3">상태</th>
              <th className="py-3">작성일</th>
              <th className="py-3 text-center pe-4">액션</th>
            </tr>
          </thead>
          <tbody>
            {pagedDocs.map(doc => (
              <tr key={doc.id}>
                <td className="px-4 py-3">
                  <div className="d-flex align-items-center gap-2">
                    <DocBadge type={doc.doc_type} />
                    {doc.lang === 'en' && (
                      <span className="badge rounded-pill" style={{ background: '#1a2f50', color: '#fff', fontSize: '0.62rem', fontFamily: 'monospace' }}>EN</span>
                    )}
                  </div>
                </td>
                <td className="py-3 fw-bold text-primary" style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{doc.doc_number}</td>
                <td className="py-3">{doc.title || '-'}</td>
                <td className="py-3"><StatusBadge status={doc.status} /></td>
                <td className="py-3 text-body-secondary">{new Date(doc.created_at).toLocaleDateString('ko-KR')}</td>
                <td className="py-3 text-center pe-4">
                  <div className="d-flex gap-1 justify-content-center">
                    <button className="btn btn-outline-primary btn-sm rounded-pill px-2" onClick={() => openEdit(doc)} title="수정"><i className="bi bi-pencil" /></button>
                    <button className="btn btn-outline-secondary btn-sm rounded-pill px-2" onClick={() => handleDuplicate(doc)} title="복제"><i className="bi bi-copy" /></button>
                    <DocumentPDFButton doc={doc} />
                    <button className="btn btn-outline-danger btn-sm rounded-pill px-2" onClick={() => handleDelete(doc.id)} title="삭제"><i className="bi bi-trash" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredDocs.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-5 text-center text-body-secondary">
                <i className="bi bi-inbox fs-3 d-block mb-2 opacity-50" />
                문서가 없습니다. 위 버튼을 눌러 새 문서를 만드세요.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div className="text-center mt-3">
          <button className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setPage(p => p + 1)}>
            <i className="bi bi-chevron-down me-1" />더 보기 ({filteredDocs.length - pagedDocs.length}건 더)
          </button>
        </div>
      )}
    </div>
  )
}

// ─── 편집기 뷰 ─────────────────────────────────────────────────────────────────
const STAGE_LABELS: Record<string, string> = {
  lead: '리드', quotation: '견적', purchase_order: '발주',
  invoice: '인보이스', contract: '계약', completed: '완료', cancelled: '취소',
}

function EditorView({
  type, content, title, status, lang, onLangChange, saving, msg, editingId,
  onBack, onTitleChange, onContentChange, onSave, onContactPick,
  dealId, onDealPick, deals,
  docs, products, customers, draftBanner, onDismissDraft,
}: {
  type: DocType; content: DocContent; title: string; status: DocStatus
  lang: 'ko' | 'en'; onLangChange: (l: 'ko' | 'en') => void
  saving: boolean; msg: { text: string; ok: boolean } | null; editingId: string | null
  onBack: () => void; onTitleChange: (v: string) => void
  onContentChange: (updater: (prev: any) => any) => void
  onSave: (status: DocStatus) => void
  onContactPick: (id: string) => void
  dealId: string | null; onDealPick: (id: string | null) => void; deals: DealOption[]
  docs: AdminDocument[]; products: ProductOption[]; customers: CustomerOption[]
  draftBanner: { key: string; savedAt: string } | null
  onDismissDraft: (restore: boolean) => void
}) {
  const color = DOC_TYPE_COLORS[type]
  const label = DOC_TYPE_LABELS[type]
  const docNo = (content as any).docNumber ?? (content as any).contractNo ?? ''
  const isKOonly = type === 'invoice' || type === 'invoice_packing_list' || type === 'sales_contract'
  const previewDoc: AdminDocument = {
    id: editingId ?? 'preview', doc_type: type,
    doc_number: docNo,
    title: title || docNo,
    content, status, lang,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  return (
    <div>
      {draftBanner && (
        <div className="alert alert-warning d-flex align-items-center justify-content-between rounded-3 py-2 px-3 mb-3" style={{ fontSize: '0.875rem' }}>
          <span><i className="bi bi-clock-history me-2" /><strong>{draftBanner.savedAt}</strong>에 자동저장된 임시 초안이 있습니다.</span>
          <div className="d-flex gap-2">
            <button className="btn btn-sm btn-warning rounded-pill px-3" onClick={() => onDismissDraft(true)}>복구 유지</button>
            <button className="btn btn-sm btn-outline-secondary rounded-pill px-3" onClick={() => onDismissDraft(false)}>무시</button>
          </div>
        </div>
      )}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-outline-secondary btn-sm rounded-pill px-3" onClick={onBack}>
            <i className="bi bi-arrow-left me-1" />목록
          </button>
          <div>
            <h1 className="h4 fw-bold text-dark mb-0"><span style={{ color }}>{label}</span>{editingId ? ' 수정' : ' 작성'}</h1>
            <p className="text-body-secondary small mb-0">{(content as any).docNumber ?? (content as any).contractNo}</p>
          </div>
        </div>
        <div className="d-flex gap-2 align-items-center">
          {msg && (
            <span className={`small ${msg.ok ? 'text-success' : 'text-danger'}`}>
              <i className={`bi ${msg.ok ? 'bi-check-circle' : 'bi-exclamation-circle'} me-1`} />{msg.text}
            </span>
          )}
          {!isKOonly && (
            <div className="btn-group rounded-pill overflow-hidden border" style={{ fontSize: '0.78rem' }}>
              <button
                className={`btn btn-sm px-3 ${lang === 'ko' ? 'btn-dark' : 'btn-light'}`}
                style={{ borderRadius: 0, border: 'none' }}
                onClick={() => onLangChange('ko')}
              >
                한국어
              </button>
              <button
                className={`btn btn-sm px-3 ${lang === 'en' ? 'btn-dark' : 'btn-light'}`}
                style={{ borderRadius: 0, border: 'none', fontFamily: 'monospace' }}
                onClick={() => onLangChange('en')}
              >
                English
              </button>
            </div>
          )}
          <DocumentPDFButton doc={previewDoc} />
          <button className="btn btn-outline-secondary rounded-pill px-3" onClick={() => onSave('draft')} disabled={saving}>
            {saving ? <span className="spinner-border spinner-border-sm me-1" /> : <i className="bi bi-cloud me-1" />}임시저장
          </button>
          <button className="btn btn-primary rounded-pill px-4" onClick={() => onSave('final')} disabled={saving}>
            {saving ? <span className="spinner-border spinner-border-sm me-1" /> : <i className="bi bi-check-lg me-1" />}확정
          </button>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 mb-3 p-4">
        <div className="row g-3 align-items-end">
          <div className="col-md-4">{fi('제목 (내부용)', title, onTitleChange, 'text', '예: A사 실링재 견적서')}</div>
          <div className="col-md-3">{fi('문서 번호', (content as any).docNumber ?? (content as any).contractNo ?? '', v => onContentChange(p => type === 'sales_contract' ? { ...p, contractNo: v } : { ...p, docNumber: v }))}</div>
          <div className="col-md-5 mb-3">
            <label className="form-label small fw-bold text-dark mb-1">거래 연결</label>
            <select
              className="form-select form-select-sm rounded-3"
              value={dealId ?? ''}
              onChange={e => onDealPick(e.target.value || null)}
            >
              <option value="">— 거래 없음 —</option>
              {deals.map(d => (
                <option key={d.id} value={d.id}>
                  {d.title} ({STAGE_LABELS[d.stage] ?? d.stage})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {type === 'quotation' && <QuotationEditor content={content as QuotationContent} onChange={onContentChange} products={products} customers={customers} onContactPick={onContactPick} />}
      {type === 'purchase_order' && <PurchaseOrderEditor content={content as PurchaseOrderContent} onChange={onContentChange} products={products} customers={customers} onContactPick={onContactPick} />}
      {type === 'receipt' && <ReceiptEditor content={content as ReceiptContent} onChange={onContentChange} products={products} />}
      {type === 'invoice' && <InvoiceEditor content={content as InvoiceContent} onChange={onContentChange} customers={customers} onContactPick={onContactPick} />}
      {type === 'invoice_packing_list' && <InvoicePackingListEditor content={content as InvoicePackingListContent} onChange={onContentChange} customers={customers} onContactPick={onContactPick} />}
      {type === 'sales_contract' && <SalesContractEditor content={content as SalesContractContent} onChange={onContentChange} customers={customers} onContactPick={onContactPick} />}

      <div className="card border-0 shadow-sm rounded-4 mt-3 p-4">
        <div className="d-flex justify-content-between align-items-center">
          <button className="btn btn-outline-secondary rounded-pill px-3" onClick={onBack}><i className="bi bi-arrow-left me-1" />목록으로</button>
          <div className="d-flex gap-2">
            <DocumentPDFButton doc={previewDoc} size="md" />
            <button className="btn btn-outline-secondary rounded-pill px-3" onClick={() => onSave('draft')} disabled={saving}>
              <i className="bi bi-cloud me-1" />임시저장
            </button>
            <button className="btn btn-primary rounded-pill px-4" onClick={() => onSave('final')} disabled={saving}>
              <i className="bi bi-check-lg me-1" />확정 저장
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── 견적서 편집기 ─────────────────────────────────────────────────────────────
function QuotationEditor({ content: c, onChange, products, customers, onContactPick }: {
  content: QuotationContent; onChange: (u: (p: any) => any) => void
  products: ProductOption[]; customers: CustomerOption[]; onContactPick: (id: string) => void
}) {
  const [showCustomerPicker, setShowCustomerPicker] = useState(false)

  function setBuyer(field: string, v: string) {
    onChange(p => ({ ...p, buyer: { ...p.buyer, [field]: v } }))
  }

  function applyCustomer(c: CustomerOption) {
    onContactPick(c.id)
    onChange(p => ({
      ...p,
      buyer: {
        ...p.buyer,
        company: c.company_name ?? '',
        contactPerson: c.contact_person ?? '',
        phone: c.phone ?? '',
      },
    }))
  }

  return (
    <>
      {showCustomerPicker && (
        <CustomerPicker customers={customers} onSelect={applyCustomer} onClose={() => setShowCustomerPicker(false)} />
      )}

      <div className="card border-0 shadow-sm rounded-4 mb-3 p-4">
        <h6 className="fw-bold text-dark mb-3" style={{ borderLeft: '3px solid #1558D6', paddingLeft: 10 }}>기본 정보</h6>
        <div className="row g-3">
          <div className="col-md-3">{fi('견적일자', c.docDate, v => onChange(p => ({ ...p, docDate: v })), 'date')}</div>
          <div className="col-md-3">{fi('유효기간', c.validUntil, v => onChange(p => ({ ...p, validUntil: v })), 'date')}</div>
          <div className="col-md-3">
            <SelectOrInput label="결제조건" value={c.paymentTerms} onChange={v => onChange(p => ({ ...p, paymentTerms: v }))} options={PAYMENT_TERMS_KR} placeholder="예: 세금계산서 발행 후 30일 이내" />
          </div>
          <div className="col-md-3">
            <SelectOrInput label="납품조건" value={c.deliveryTerms} onChange={v => onChange(p => ({ ...p, deliveryTerms: v }))} options={DELIVERY_TERMS_KR} placeholder="예: 계약 후 2주 이내" />
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 mb-3 p-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h6 className="fw-bold text-dark mb-0" style={{ borderLeft: '3px solid #1558D6', paddingLeft: 10 }}>수요자 정보</h6>
          <button className="btn btn-sm btn-outline-primary rounded-pill px-3" onClick={() => setShowCustomerPicker(true)}>
            <i className="bi bi-person-lines-fill me-1" />고객 불러오기
          </button>
        </div>
        <div className="row g-3">
          <div className="col-md-4">{fi('회사명', c.buyer.company, v => setBuyer('company', v), 'text', '회사명')}</div>
          <div className="col-md-4">{fi('담당자', c.buyer.contactPerson, v => setBuyer('contactPerson', v))}</div>
          <div className="col-md-4">{fi('연락처', c.buyer.phone, v => setBuyer('phone', v))}</div>
          <div className="col-md-4">{fi('이메일', c.buyer.email, v => setBuyer('email', v), 'email')}</div>
          <div className="col-md-8">{fi('주소', c.buyer.address, v => setBuyer('address', v))}</div>
        </div>
      </div>

      <LineItemsTable items={c.items} onChange={onChange} accentColor="#1558D6" showPrice products={products} />
      <TotalsDisplay subtotal={c.subtotal} tax={c.tax} total={c.total} />
      <NotesField value={c.notes} onChange={v => onChange(p => ({ ...p, notes: v }))} />
    </>
  )
}

// ─── 발주서 편집기 ─────────────────────────────────────────────────────────────
function PurchaseOrderEditor({ content: c, onChange, products, customers, onContactPick }: {
  content: PurchaseOrderContent; onChange: (u: (p: any) => any) => void
  products: ProductOption[]; customers: CustomerOption[]; onContactPick: (id: string) => void
}) {
  const [showCustomerPicker, setShowCustomerPicker] = useState(false)

  function setSupplier(field: string, v: string) {
    onChange(p => ({ ...p, supplier: { ...p.supplier, [field]: v } }))
  }

  function applyCustomer(c: CustomerOption) {
    onContactPick(c.id)
    onChange(p => ({
      ...p,
      supplier: {
        ...p.supplier,
        company: c.company_name ?? '',
        contactPerson: c.contact_person ?? '',
        phone: c.phone ?? '',
      },
    }))
  }

  return (
    <>
      {showCustomerPicker && (
        <CustomerPicker customers={customers} onSelect={applyCustomer} onClose={() => setShowCustomerPicker(false)} title="공급사 불러오기" />
      )}

      <div className="card border-0 shadow-sm rounded-4 mb-3 p-4">
        <h6 className="fw-bold text-dark mb-3" style={{ borderLeft: '3px solid #059669', paddingLeft: 10 }}>기본 정보</h6>
        <div className="row g-3">
          <div className="col-md-3">{fi('발주일자', c.docDate, v => onChange(p => ({ ...p, docDate: v })), 'date')}</div>
          <div className="col-md-3">{fi('납기일자', c.deliveryDate, v => onChange(p => ({ ...p, deliveryDate: v })), 'date')}</div>
          <div className="col-md-6">
            <SelectOrInput label="결제조건" value={c.paymentTerms} onChange={v => onChange(p => ({ ...p, paymentTerms: v }))} options={PAYMENT_TERMS_KR} placeholder="예: 납품 후 30일 이내" />
          </div>

          {/* 납품 장소 구분 + 배송지 주소 */}
          <div className="col-md-4">
            <SelectOrInput
              label="납품 장소 구분"
              value={c.deliveryLocation}
              onChange={v => onChange(p => ({ ...p, deliveryLocation: v }))}
              options={DELIVERY_LOCATIONS}
              placeholder="예: 현장 납품, 창고 입고..."
            />
          </div>
          <div className="col-md-8">
            <label className="form-label fw-medium text-dark small mb-1">배송지 주소</label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={c.deliveryAddress ?? ''}
              onChange={e => onChange(p => ({ ...p, deliveryAddress: e.target.value }))}
              placeholder="예: 서울시 송파구 충민로 10, 가든파이브 툴스 4-A19 (우: 05837)"
            />
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 mb-3 p-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h6 className="fw-bold text-dark mb-0" style={{ borderLeft: '3px solid #059669', paddingLeft: 10 }}>공급사 정보</h6>
          <button className="btn btn-sm btn-outline-success rounded-pill px-3" onClick={() => setShowCustomerPicker(true)}>
            <i className="bi bi-person-lines-fill me-1" />공급사 불러오기
          </button>
        </div>
        <div className="row g-3">
          <div className="col-md-4">{fi('회사명', c.supplier.company, v => setSupplier('company', v), 'text', '공급사명')}</div>
          <div className="col-md-4">{fi('담당자', c.supplier.contactPerson, v => setSupplier('contactPerson', v))}</div>
          <div className="col-md-4">{fi('연락처', c.supplier.phone, v => setSupplier('phone', v))}</div>
          <div className="col-md-4">{fi('이메일', c.supplier.email, v => setSupplier('email', v), 'email')}</div>
          <div className="col-md-8">{fi('주소', c.supplier.address, v => setSupplier('address', v))}</div>
        </div>
      </div>

      <LineItemsTable items={c.items} onChange={onChange} accentColor="#059669" showPrice products={products} />
      <TotalsDisplay subtotal={c.subtotal} tax={c.tax} total={c.total} accentColor="#059669" />
      <NotesField value={c.notes} onChange={v => onChange(p => ({ ...p, notes: v }))} />
    </>
  )
}

// ─── 인수증 편집기 ─────────────────────────────────────────────────────────────
function ReceiptEditor({ content: c, onChange, products }: {
  content: ReceiptContent; onChange: (u: (p: any) => any) => void; products: ProductOption[]
}) {
  const [pickerRow, setPickerRow] = useState<number | null>(null)

  function setReceiver(field: string, v: string) { onChange(p => ({ ...p, receiver: { ...p.receiver, [field]: v } })) }
  function setDeliverer(field: string, v: string) { onChange(p => ({ ...p, deliverer: { ...p.deliverer, [field]: v } })) }

  function updateItem(index: number, field: string, value: string | number) {
    onChange(p => ({ ...p, items: p.items.map((it: ReceiptItem, i: number) => i === index ? { ...it, [field]: value } : it) }))
  }

  function applyProduct(index: number, prod: ProductOption) {
    onChange(p => ({
      ...p,
      items: p.items.map((it: ReceiptItem, i: number) =>
        i === index ? { ...it, name: prod.name_ko, spec: prod.sku ?? '', unit: prod.unit } : it
      ),
    }))
  }

  function addItem() {
    onChange(p => ({ ...p, items: [...p.items, { id: Date.now(), name: '', spec: '', unit: '개', qty: 1, condition: '양호', notes: '' }] }))
  }

  function removeItem(index: number) {
    onChange(p => ({ ...p, items: p.items.filter((_: ReceiptItem, i: number) => i !== index) }))
  }

  const totalQty = c.items.reduce((s, it) => s + it.qty, 0)

  return (
    <>
      {pickerRow !== null && (
        <ProductPicker
          products={products}
          onSelect={prod => { applyProduct(pickerRow, prod); setPickerRow(null) }}
          onClose={() => setPickerRow(null)}
        />
      )}

      <div className="card border-0 shadow-sm rounded-4 mb-3 p-4">
        <h6 className="fw-bold text-dark mb-3" style={{ borderLeft: '3px solid #D97706', paddingLeft: 10 }}>기본 정보</h6>
        <div className="row g-3">
          <div className="col-md-4">{fi('인수일자', c.docDate, v => onChange(p => ({ ...p, docDate: v })), 'date')}</div>
          <div className="col-md-4">{fi('납품일자', c.deliveryDate, v => onChange(p => ({ ...p, deliveryDate: v })), 'date')}</div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 mb-3 p-4">
        <h6 className="fw-bold text-dark mb-3" style={{ borderLeft: '3px solid #D97706', paddingLeft: 10 }}>당사자 정보</h6>
        <div className="row g-4">
          <div className="col-md-6">
            <p className="small fw-bold text-body-secondary mb-2">인수자 (Receiver)</p>
            {fi('회사명', c.receiver.company, v => setReceiver('company', v))}
            {fi('담당자', c.receiver.contactPerson, v => setReceiver('contactPerson', v))}
            {fi('연락처', c.receiver.phone, v => setReceiver('phone', v))}
          </div>
          <div className="col-md-6">
            <p className="small fw-bold text-body-secondary mb-2">인도자 (Deliverer)</p>
            {fi('회사명', c.deliverer.company, v => setDeliverer('company', v), 'text', '납품 회사명')}
            {fi('담당자', c.deliverer.contactPerson, v => setDeliverer('contactPerson', v))}
            {fi('연락처', c.deliverer.phone, v => setDeliverer('phone', v))}
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 mb-3">
        <div className="card-header bg-white border-0 pt-4 px-4 pb-2 d-flex justify-content-between align-items-center">
          <h6 className="fw-bold text-dark mb-0" style={{ borderLeft: '3px solid #D97706', paddingLeft: 10 }}>품목 목록</h6>
          <button className="btn btn-sm btn-outline-secondary rounded-pill px-3" onClick={addItem}><i className="bi bi-plus me-1" />행 추가</button>
        </div>
        <div className="table-responsive">
          <table className="table table-sm mb-0" style={{ fontSize: '0.83rem' }}>
            <thead className="table-light">
              <tr>
                <th className="px-3 py-2" style={{ width: 36 }}>No</th>
                <th style={{ width: 32 }}></th>
                <th>품목명</th>
                <th style={{ width: 110 }}>규격</th>
                <th style={{ width: 70 }}>단위</th>
                <th style={{ width: 80 }}>수량</th>
                <th style={{ width: 100 }}>상태</th>
                <th>비고</th>
                <th style={{ width: 44 }}></th>
              </tr>
            </thead>
            <tbody>
              {c.items.map((item, i) => (
                <tr key={item.id}>
                  <td className="px-3 py-2 text-center text-body-secondary">{i + 1}</td>
                  <td className="py-1">
                    <button className="btn btn-sm p-0 text-primary" title="제품 검색" onClick={() => setPickerRow(i)}>
                      <i className="bi bi-search" style={{ fontSize: '0.8rem' }} />
                    </button>
                  </td>
                  <td><input className="form-control form-control-sm border-0 bg-transparent" value={item.name} onChange={e => updateItem(i, 'name', e.target.value)} placeholder="품목명" /></td>
                  <td><input className="form-control form-control-sm border-0 bg-transparent" value={item.spec} onChange={e => updateItem(i, 'spec', e.target.value)} placeholder="규격" /></td>
                  <td><input className="form-control form-control-sm border-0 bg-transparent" value={item.unit} onChange={e => updateItem(i, 'unit', e.target.value)} /></td>
                  <td><input type="number" className="form-control form-control-sm border-0 bg-transparent text-end" value={item.qty} min={0} onChange={e => updateItem(i, 'qty', Number(e.target.value))} /></td>
                  <td>
                    <select className="form-select form-select-sm border-0 bg-transparent" value={item.condition} onChange={e => updateItem(i, 'condition', e.target.value)}>
                      <option>양호</option><option>불량</option><option>기타</option>
                    </select>
                  </td>
                  <td><input className="form-control form-control-sm border-0 bg-transparent" value={item.notes} onChange={e => updateItem(i, 'notes', e.target.value)} /></td>
                  <td className="text-center">
                    {c.items.length > 1 && (
                      <button className="btn btn-sm text-danger p-0" onClick={() => removeItem(i)} style={{ lineHeight: 1 }}>
                        <i className="bi bi-x-lg" style={{ fontSize: '0.75rem' }} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="table-light">
              <tr>
                <td colSpan={5} className="px-3 py-2 text-end fw-bold small">총 수량</td>
                <td className="py-2 fw-bold text-end" style={{ color: '#D97706' }}>{totalQty.toLocaleString('ko-KR')}</td>
                <td colSpan={3}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 mb-3 p-4">
        <h6 className="fw-bold text-dark mb-3" style={{ borderLeft: '3px solid #D97706', paddingLeft: 10 }}>인수 확인 상태</h6>
        <div className="d-flex flex-wrap gap-2 mb-3">
          {ACCEPTANCE_CONDITIONS_OPTS.map(cond => (
            <button
              key={cond}
              type="button"
              className={`btn btn-sm rounded-pill px-3 ${c.acceptanceCondition === cond ? 'btn-warning' : 'btn-outline-secondary'}`}
              style={{ fontSize: '0.8rem' }}
              onClick={() => onChange(p => ({ ...p, acceptanceCondition: cond }))}
            >
              {c.acceptanceCondition === cond && <i className="bi bi-check2 me-1" />}
              {cond}
            </button>
          ))}
        </div>
        <label className="form-label small text-body-secondary mb-1">또는 직접 입력</label>
        <textarea className="form-control" rows={2} value={c.acceptanceCondition} onChange={e => onChange(p => ({ ...p, acceptanceCondition: e.target.value }))} placeholder="인수 확인 내용을 직접 입력..." />
      </div>

      <NotesField value={c.notes} onChange={v => onChange(p => ({ ...p, notes: v }))} />
    </>
  )
}

// ─── 공통 품목 테이블 (견적서/발주서) ──────────────────────────────────────────
function LineItemsTable({ items, onChange, accentColor, showPrice, products }: {
  items: DocLineItem[]; onChange: (u: (p: any) => any) => void
  accentColor?: string; showPrice?: boolean; products: ProductOption[]
}) {
  const color = accentColor || '#1558D6'
  const [pickerRow, setPickerRow] = useState<number | null>(null)

  function applyProduct(index: number, prod: ProductOption) {
    onChange(p => {
      const newItems = p.items.map((it: DocLineItem, i: number) => {
        if (i !== index) return it
        const unitPrice = prod.list_price
        return { ...it, name: prod.name_ko, spec: prod.sku ?? '', unit: prod.unit, unitPrice, amount: it.qty * unitPrice }
      })
      const subtotal = newItems.reduce((s: number, it: DocLineItem) => s + it.amount, 0)
      const tax = Math.round(subtotal * 0.1)
      return { ...p, items: newItems, subtotal, tax, total: subtotal + tax }
    })
  }

  function updateItem(index: number, field: string, value: string | number) {
    onChange(p => {
      const newItems = p.items.map((it: DocLineItem, i: number) => {
        if (i !== index) return it
        const updated = { ...it, [field]: value }
        if (field === 'qty' || field === 'unitPrice') updated.amount = updated.qty * updated.unitPrice
        return updated
      })
      const subtotal = newItems.reduce((s: number, it: DocLineItem) => s + it.amount, 0)
      const tax = Math.round(subtotal * 0.1)
      return { ...p, items: newItems, subtotal, tax, total: subtotal + tax }
    })
  }

  function addItem() {
    onChange(p => ({ ...p, items: [...p.items, { id: Date.now(), name: '', spec: '', unit: '개', qty: 1, unitPrice: 0, amount: 0, notes: '' }] }))
  }

  function removeItem(index: number) {
    onChange(p => {
      const newItems = p.items.filter((_: DocLineItem, i: number) => i !== index)
      const subtotal = newItems.reduce((s: number, it: DocLineItem) => s + it.amount, 0)
      const tax = Math.round(subtotal * 0.1)
      return { ...p, items: newItems, subtotal, tax, total: subtotal + tax }
    })
  }

  return (
    <>
      {pickerRow !== null && (
        <ProductPicker
          products={products}
          onSelect={prod => { applyProduct(pickerRow, prod); setPickerRow(null) }}
          onClose={() => setPickerRow(null)}
        />
      )}
      <div className="card border-0 shadow-sm rounded-4 mb-3">
        <div className="card-header bg-white border-0 pt-4 px-4 pb-2 d-flex justify-content-between align-items-center">
          <h6 className="fw-bold text-dark mb-0" style={{ borderLeft: `3px solid ${color}`, paddingLeft: 10 }}>품목 목록</h6>
          <button className="btn btn-sm btn-outline-secondary rounded-pill px-3" onClick={addItem}><i className="bi bi-plus me-1" />행 추가</button>
        </div>
        <div className="table-responsive">
          <table className="table table-sm mb-0" style={{ fontSize: '0.83rem' }}>
            <thead className="table-light">
              <tr>
                <th className="px-3 py-2" style={{ width: 36 }}>No</th>
                <th style={{ width: 32 }}></th>
                <th>품목명</th>
                <th style={{ width: 110 }}>규격</th>
                <th style={{ width: 70 }}>단위</th>
                <th style={{ width: 80 }}>수량</th>
                {showPrice && <><th style={{ width: 120 }}>단가 (원)</th><th style={{ width: 130 }}>금액 (원)</th></>}
                <th>비고</th>
                <th style={{ width: 44 }}></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={item.id}>
                  <td className="px-3 py-2 text-center text-body-secondary">{i + 1}</td>
                  <td className="py-1">
                    <button className="btn btn-sm p-0 text-primary" title="제품 검색" onClick={() => setPickerRow(i)}>
                      <i className="bi bi-search" style={{ fontSize: '0.8rem' }} />
                    </button>
                  </td>
                  <td><input className="form-control form-control-sm border-0 bg-transparent" value={item.name} onChange={e => updateItem(i, 'name', e.target.value)} placeholder="품목명" /></td>
                  <td><input className="form-control form-control-sm border-0 bg-transparent" value={item.spec} onChange={e => updateItem(i, 'spec', e.target.value)} placeholder="규격/SKU" /></td>
                  <td><input className="form-control form-control-sm border-0 bg-transparent" value={item.unit} onChange={e => updateItem(i, 'unit', e.target.value)} /></td>
                  <td><input type="number" className="form-control form-control-sm border-0 bg-transparent text-end" value={item.qty} min={0} onChange={e => updateItem(i, 'qty', Number(e.target.value))} /></td>
                  {showPrice && (
                    <>
                      <td><input type="number" className="form-control form-control-sm border-0 bg-transparent text-end" value={item.unitPrice} min={0} onChange={e => updateItem(i, 'unitPrice', Number(e.target.value))} /></td>
                      <td className="text-end pe-2 fw-bold" style={{ color }}>{item.amount.toLocaleString('ko-KR')}</td>
                    </>
                  )}
                  <td><input className="form-control form-control-sm border-0 bg-transparent" value={item.notes} onChange={e => updateItem(i, 'notes', e.target.value)} /></td>
                  <td className="text-center">
                    {items.length > 1 && (
                      <button className="btn btn-sm text-danger p-0" onClick={() => removeItem(i)} style={{ lineHeight: 1 }}>
                        <i className="bi bi-x-lg" style={{ fontSize: '0.75rem' }} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

// ─── 합계 표시 ────────────────────────────────────────────────────────────────
function TotalsDisplay({ subtotal, tax, total, accentColor = '#1558D6' }: { subtotal: number; tax: number; total: number; accentColor?: string }) {
  const fmt = (n: number) => n.toLocaleString('ko-KR') + '원'
  return (
    <div className="card border-0 shadow-sm rounded-4 mb-3 p-4">
      <div className="d-flex justify-content-end">
        <div style={{ minWidth: 260 }}>
          <div className="d-flex justify-content-between mb-2"><span className="text-body-secondary">공급가액</span><span className="fw-bold">{fmt(subtotal)}</span></div>
          <div className="d-flex justify-content-between mb-2"><span className="text-body-secondary">부가세 (10%)</span><span className="fw-bold">{fmt(tax)}</span></div>
          <div className="d-flex justify-content-between pt-2" style={{ borderTop: `2px solid ${accentColor}` }}>
            <span className="fw-bold" style={{ color: accentColor }}>합계</span>
            <span className="fw-bold fs-5" style={{ color: accentColor }}>{fmt(total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── 특기사항 ─────────────────────────────────────────────────────────────────
function NotesField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="card border-0 shadow-sm rounded-4 mb-3 p-4">
      <h6 className="fw-bold text-dark mb-3">특기사항</h6>
      <textarea className="form-control" rows={3} value={value} onChange={e => onChange(e.target.value)} placeholder="특기사항을 입력하세요 (선택)" />
    </div>
  )
}

// ─── 공급계약서용 품목 테이블 (ContractLineItem) ───────────────────────────────
function InvoiceItemsTable({ items, onChange, accentColor, title = 'Commodity' }: {
  items: ContractLineItem[]
  onChange: (u: (p: any) => any) => void
  accentColor: string
  title?: string
}) {
  const color = accentColor

  function updateItem(index: number, field: string, value: string | number) {
    onChange(p => {
      const newItems = p.items.map((it: ContractLineItem, i: number) => {
        if (i !== index) return it
        const updated = { ...it, [field]: value }
        if (field === 'qty' || field === 'unitPrice') updated.amount = updated.qty * updated.unitPrice
        return updated
      })
      const total = newItems.reduce((s: number, it: ContractLineItem) => s + it.amount, 0)
      return { ...p, items: newItems, total }
    })
  }

  function addItem() {
    onChange(p => ({ ...p, items: [...p.items, { id: Date.now(), description: '', unit: 'EA', qty: 0, unitPrice: 0, amount: 0 }] }))
  }

  function removeItem(index: number) {
    onChange(p => {
      const newItems = p.items.filter((_: ContractLineItem, i: number) => i !== index)
      const total = newItems.reduce((s: number, it: ContractLineItem) => s + it.amount, 0)
      return { ...p, items: newItems, total }
    })
  }

  const total = items.reduce((s, it) => s + it.amount, 0)
  const fmt2 = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2 })

  return (
    <div className="card border-0 shadow-sm rounded-4 mb-3">
      <div className="card-header bg-white border-0 pt-4 px-4 pb-2 d-flex justify-content-between align-items-center">
        <h6 className="fw-bold text-dark mb-0" style={{ borderLeft: `3px solid ${color}`, paddingLeft: 10 }}>{title}</h6>
        <button className="btn btn-sm btn-outline-secondary rounded-pill px-3" onClick={addItem}><i className="bi bi-plus me-1" />행 추가</button>
      </div>
      <div className="table-responsive">
        <table className="table table-sm mb-0" style={{ fontSize: '0.83rem' }}>
          <thead className="table-light">
            <tr>
              <th className="px-3 py-2" style={{ width: 36 }}>No</th>
              <th>Description</th>
              <th style={{ width: 70 }}>Unit</th>
              <th style={{ width: 80 }}>Qty</th>
              <th style={{ width: 120 }}>Unit Price</th>
              <th style={{ width: 130 }}>Amount</th>
              <th style={{ width: 44 }}></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={item.id}>
                <td className="px-3 py-2 text-center text-body-secondary">{i + 1}</td>
                <td><input className="form-control form-control-sm border-0 bg-transparent" value={item.description} onChange={e => updateItem(i, 'description', e.target.value)} placeholder="Product description" /></td>
                <td><input className="form-control form-control-sm border-0 bg-transparent" value={item.unit} onChange={e => updateItem(i, 'unit', e.target.value)} /></td>
                <td><input type="number" className="form-control form-control-sm border-0 bg-transparent text-end" value={item.qty} min={0} onChange={e => updateItem(i, 'qty', Number(e.target.value))} /></td>
                <td><input type="number" className="form-control form-control-sm border-0 bg-transparent text-end" value={item.unitPrice} min={0} step={0.01} onChange={e => updateItem(i, 'unitPrice', Number(e.target.value))} /></td>
                <td className="text-end pe-2 fw-bold" style={{ color }}>{fmt2(item.amount)}</td>
                <td className="text-center">
                  {items.length > 1 && (
                    <button className="btn btn-sm text-danger p-0" onClick={() => removeItem(i)} style={{ lineHeight: 1 }}>
                      <i className="bi bi-x-lg" style={{ fontSize: '0.75rem' }} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="table-light">
            <tr>
              <td colSpan={5} className="px-3 py-2 text-end fw-bold small" style={{ color }}>TOTAL</td>
              <td className="py-2 fw-bold text-end pe-2" style={{ color }}>{fmt2(total)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

// ─── 인보이스 편집기 ───────────────────────────────────────────────────────────
function InvoiceEditor({ content: c, onChange, customers, onContactPick }: {
  content: InvoiceContent; onChange: (u: (p: any) => any) => void; customers: CustomerOption[]; onContactPick: (id: string) => void
}) {
  const color = '#7C3AED'
  const [showConsigneePicker, setShowConsigneePicker] = useState(false)
  const fmt2 = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2 })

  function setConsignee(field: string, v: string) {
    onChange(p => ({ ...p, consignee: { ...p.consignee, [field]: v } }))
  }
  function setBuyer2(field: string, v: string) {
    onChange(p => ({ ...p, buyer2: { ...p.buyer2, [field]: v } }))
  }

  function applyCustomer(cust: CustomerOption) {
    onContactPick(cust.id)
    onChange(p => ({
      ...p,
      consignee: { ...p.consignee, company: cust.company_name ?? '', tel: cust.phone ?? '', ref: cust.contact_person ?? '' },
    }))
  }

  function updateItem(index: number, field: string, value: string | number) {
    onChange(p => {
      const newItems = p.items.map((it: InvoiceLineItem, i: number) => {
        if (i !== index) return it
        const updated = { ...it, [field]: value }
        if (field === 'qty' || field === 'unitPrice') updated.amount = +(updated.qty * updated.unitPrice).toFixed(2)
        return updated
      })
      const total = +newItems.reduce((s: number, it: InvoiceLineItem) => s + it.amount, 0).toFixed(2)
      return { ...p, items: newItems, total }
    })
  }

  function addItem() {
    onChange(p => ({ ...p, items: [...p.items, { id: Date.now(), shippingMark: '', packages: '', hsCode: '', description: '', unit: 'EA', qty: 0, unitPrice: 0, amount: 0 }] }))
  }

  function removeItem(index: number) {
    onChange(p => {
      const newItems = p.items.filter((_: InvoiceLineItem, i: number) => i !== index)
      const total = +newItems.reduce((s: number, it: InvoiceLineItem) => s + it.amount, 0).toFixed(2)
      return { ...p, items: newItems, total }
    })
  }

  return (
    <>
      {showConsigneePicker && (
        <CustomerPicker customers={customers} onSelect={applyCustomer} onClose={() => setShowConsigneePicker(false)} title="Consignee 불러오기" />
      )}

      <div className="card border-0 shadow-sm rounded-4 mb-3 p-4">
        <h6 className="fw-bold text-dark mb-3" style={{ borderLeft: `3px solid ${color}`, paddingLeft: 10 }}>⑧ Invoice Header</h6>
        <div className="row g-3">
          <div className="col-md-2">{fi('Invoice Date', c.docDate, v => onChange(p => ({ ...p, docDate: v })), 'date')}</div>
          <div className="col-md-2">{fi('⑨ L/C No.', c.lcNo, v => onChange(p => ({ ...p, lcNo: v })), 'text', 'NIL (T/T 생략)')}</div>
          <div className="col-md-2">{fi('L/C Date', c.lcDate ?? '', v => onChange(p => ({ ...p, lcDate: v })), 'date')}</div>
          <div className="col-md-6">{fi('⑩ L/C Issuing Bank', c.lcIssuingBank ?? '', v => onChange(p => ({ ...p, lcIssuingBank: v })), 'text', 'T/T 거래 시 생략')}</div>
        </div>
        <div className="row g-3 mt-0">
          <div className="col-md-2">
            <SelectOrInput label="Currency" value={c.currency} onChange={v => onChange(p => ({ ...p, currency: v }))} options={CURRENCIES} placeholder="USD" />
          </div>
          <div className="col-md-2">
            <SelectOrInput label="Incoterms" value={c.incoterms} onChange={v => onChange(p => ({ ...p, incoterms: v }))} options={INCOTERMS_OPTS} placeholder="FOB" />
          </div>
          <div className="col-md-4">
            <SelectOrInput label="⑦ Terms of Delivery & Payment" value={c.paymentTerms} onChange={v => onChange(p => ({ ...p, paymentTerms: v }))} options={PAYMENT_TERMS_EN} placeholder="T/T 100% IN ADVANCE" />
          </div>
          <div className="col-md-4">{fi('Customer Order No.', c.customerOrderNo, v => onChange(p => ({ ...p, customerOrderNo: v })))}</div>
        </div>
        <div className="row g-3 mt-0">
          <div className="col-md-3">
            <SelectOrInput label="④ Port of Loading" value={c.portOfLoading} onChange={v => onChange(p => ({ ...p, portOfLoading: v }))} options={PORTS_LOADING} placeholder="ICN" />
          </div>
          <div className="col-md-3">{fi('⑤ Final Destination', c.portOfDestination, v => onChange(p => ({ ...p, portOfDestination: v })))}</div>
          <div className="col-md-3">{fi('⑥ Carrier (Vessel / Voy)', c.vessel, v => onChange(p => ({ ...p, vessel: v })))}</div>
          <div className="col-md-2">{fi('⑦ Departure Date', c.departureDate, v => onChange(p => ({ ...p, departureDate: v })), 'date')}</div>
          <div className="col-md-2">{fi('Arrival Date', c.arrivalDate, v => onChange(p => ({ ...p, arrivalDate: v })), 'date')}</div>
        </div>
        <div className="row g-3 mt-0">
          <div className="col-md-4">{fi('Country of Origin', c.countryOfOrigin, v => onChange(p => ({ ...p, countryOfOrigin: v })))}</div>
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="fw-bold text-dark mb-0" style={{ borderLeft: `3px solid ${color}`, paddingLeft: 10 }}>③ Notify Party / Consignee</h6>
              <button className="btn btn-sm rounded-pill px-3" style={{ border: `1px solid ${color}`, color }} onClick={() => setShowConsigneePicker(true)}>
                <i className="bi bi-person-lines-fill me-1" />불러오기
              </button>
            </div>
            {fi('Company', c.consignee.company, v => setConsignee('company', v))}
            {fi('Address', c.consignee.address, v => setConsignee('address', v))}
            {fi('Tel', c.consignee.tel, v => setConsignee('tel', v))}
            {fi('Ref / Contact Person', c.consignee.ref, v => setConsignee('ref', v))}
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <h6 className="fw-bold text-dark mb-3" style={{ borderLeft: `3px solid ${color}`, paddingLeft: 10 }}>② Buyer / Applicant (if other than Consignee)</h6>
            {fi('Company', c.buyer2.company, v => setBuyer2('company', v))}
            {fi('Address', c.buyer2.address, v => setBuyer2('address', v))}
            {fi('Tel', c.buyer2.tel, v => setBuyer2('tel', v))}
          </div>
        </div>
      </div>

      {/* Invoice Items Table */}
      <div className="card border-0 shadow-sm rounded-4 mb-3">
        <div className="card-header bg-white border-0 pt-4 px-4 pb-2 d-flex justify-content-between align-items-center">
          <h6 className="fw-bold text-dark mb-0" style={{ borderLeft: `3px solid ${color}`, paddingLeft: 10 }}>Goods</h6>
          <button className="btn btn-sm btn-outline-secondary rounded-pill px-3" onClick={addItem}><i className="bi bi-plus me-1" />행 추가</button>
        </div>
        <div className="table-responsive">
          <table className="table table-sm mb-0" style={{ fontSize: '0.8rem' }}>
            <thead className="table-light">
              <tr>
                <th className="px-3 py-2" style={{ width: 28 }}>No</th>
                <th style={{ width: 90 }}>Shipping Marks</th>
                <th style={{ width: 120 }}>No.& kind of pkgs</th>
                <th style={{ width: 80 }}>HS Code</th>
                <th>Goods Description</th>
                <th style={{ width: 50 }}>Unit</th>
                <th style={{ width: 65 }}>Qty</th>
                <th style={{ width: 90 }}>Unit Price</th>
                <th style={{ width: 100 }}>Amount</th>
                <th style={{ width: 36 }}></th>
              </tr>
            </thead>
            <tbody>
              {c.items.map((item, i) => (
                <tr key={item.id}>
                  <td className="px-3 py-2 text-center text-body-secondary">{i + 1}</td>
                  <td><input className="form-control form-control-sm border-0 bg-transparent" value={item.shippingMark} onChange={e => updateItem(i, 'shippingMark', e.target.value)} placeholder="e.g. Dowsil 795" /></td>
                  <td><input className="form-control form-control-sm border-0 bg-transparent" value={item.packages} onChange={e => updateItem(i, 'packages', e.target.value)} placeholder="e.g. 120 C/BOX" /></td>
                  <td><input className="form-control form-control-sm border-0 bg-transparent" value={item.hsCode} onChange={e => updateItem(i, 'hsCode', e.target.value)} placeholder="3214.10" /></td>
                  <td><input className="form-control form-control-sm border-0 bg-transparent" value={item.description} onChange={e => updateItem(i, 'description', e.target.value)} placeholder="Goods description" /></td>
                  <td><input className="form-control form-control-sm border-0 bg-transparent" value={item.unit} onChange={e => updateItem(i, 'unit', e.target.value)} /></td>
                  <td><input type="number" className="form-control form-control-sm border-0 bg-transparent text-end" value={item.qty} min={0} onChange={e => updateItem(i, 'qty', Number(e.target.value))} /></td>
                  <td><input type="number" className="form-control form-control-sm border-0 bg-transparent text-end" value={item.unitPrice} min={0} step={0.01} onChange={e => updateItem(i, 'unitPrice', Number(e.target.value))} /></td>
                  <td className="text-end pe-2 fw-bold" style={{ color }}>{fmt2(item.amount)}</td>
                  <td className="text-center">
                    {c.items.length > 1 && (
                      <button className="btn btn-sm text-danger p-0" onClick={() => removeItem(i)} style={{ lineHeight: 1 }}>
                        <i className="bi bi-x-lg" style={{ fontSize: '0.75rem' }} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="table-light">
              <tr>
                <td colSpan={8} className="px-3 py-2 text-end fw-bold small" style={{ color }}>TOTAL AMOUNT (FOB)</td>
                <td className="py-2 fw-bold text-end pe-2 fs-6" style={{ color }}>{fmt2(c.total)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 mb-3 p-4">
        <div className="row g-3">
          <div className="col-md-7">
            <label className="form-label small fw-bold text-dark mb-1">SAY (Total in Words)</label>
            <input className="form-control form-control-sm" value={c.totalInWords} onChange={e => onChange(p => ({ ...p, totalInWords: e.target.value }))} placeholder="e.g. US DOLLARS SIX THOUSAND SIX HUNDRED TWENTY SIX AND CENTS FORTY ONLY" />
          </div>
        </div>
      </div>

      <NotesField value={c.notes} onChange={v => onChange(p => ({ ...p, notes: v }))} />
    </>
  )
}

// ─── 인보이스+패킹리스트 편집기 ───────────────────────────────────────────────
function InvoicePackingListEditor({ content: c, onChange, customers, onContactPick }: {
  content: InvoicePackingListContent; onChange: (u: (p: any) => any) => void; customers: CustomerOption[]; onContactPick: (id: string) => void
}) {
  const color = '#0891B2'
  const [showConsigneePicker, setShowConsigneePicker] = useState(false)
  const fmt2 = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2 })
  const fmt3 = (n: number) => +n.toFixed(3)

  function setConsignee(field: string, v: string) {
    onChange(p => ({ ...p, consignee: { ...p.consignee, [field]: v } }))
  }
  function setBuyer2(field: string, v: string) {
    onChange(p => ({ ...p, buyer2: { ...p.buyer2, [field]: v } }))
  }

  function applyCustomer(cust: CustomerOption) {
    onContactPick(cust.id)
    onChange(p => ({
      ...p,
      consignee: { ...p.consignee, company: cust.company_name ?? '', tel: cust.phone ?? '' },
    }))
  }

  function updateItem(index: number, field: string, value: string | number) {
    onChange(p => {
      const newItems = p.items.map((it: PackingLineItem, i: number) => {
        if (i !== index) return it
        const updated = { ...it, [field]: value }
        if (field === 'qty' || field === 'unitPrice') updated.amount = +(updated.qty * updated.unitPrice).toFixed(2)
        return updated
      })
      const total = +newItems.reduce((s: number, it: PackingLineItem) => s + it.amount, 0).toFixed(2)
      const totalNetWeight = +newItems.reduce((s: number, it: PackingLineItem) => s + it.netWeight, 0).toFixed(3)
      const totalGrossWeight = +newItems.reduce((s: number, it: PackingLineItem) => s + it.grossWeight, 0).toFixed(3)
      const totalCBM = +newItems.reduce((s: number, it: PackingLineItem) => s + it.cbm, 0).toFixed(3)
      return { ...p, items: newItems, total, totalNetWeight, totalGrossWeight, totalCBM }
    })
  }

  function addItem() {
    onChange(p => ({
      ...p,
      items: [...p.items, { id: Date.now(), shippingMark: '', packages: '', hsCode: '', description: '', unit: 'EA', qty: 0, unitPrice: 0, amount: 0, netWeight: 0, grossWeight: 0, cbm: 0 }],
    }))
  }

  function removeItem(index: number) {
    onChange(p => {
      const newItems = p.items.filter((_: PackingLineItem, i: number) => i !== index)
      const total = +newItems.reduce((s: number, it: PackingLineItem) => s + it.amount, 0).toFixed(2)
      const totalNetWeight = +newItems.reduce((s: number, it: PackingLineItem) => s + it.netWeight, 0).toFixed(3)
      const totalGrossWeight = +newItems.reduce((s: number, it: PackingLineItem) => s + it.grossWeight, 0).toFixed(3)
      const totalCBM = +newItems.reduce((s: number, it: PackingLineItem) => s + it.cbm, 0).toFixed(3)
      return { ...p, items: newItems, total, totalNetWeight, totalGrossWeight, totalCBM }
    })
  }

  return (
    <>
      {showConsigneePicker && (
        <CustomerPicker customers={customers} onSelect={applyCustomer} onClose={() => setShowConsigneePicker(false)} title="Consignee 불러오기" />
      )}

      <div className="card border-0 shadow-sm rounded-4 mb-3 p-4">
        <h6 className="fw-bold text-dark mb-3" style={{ borderLeft: `3px solid ${color}`, paddingLeft: 10 }}>⑧ Document Header</h6>
        <div className="row g-3">
          <div className="col-md-2">{fi('Date', c.docDate, v => onChange(p => ({ ...p, docDate: v })), 'date')}</div>
          <div className="col-md-2">{fi('⑨ L/C No.', c.lcNo, v => onChange(p => ({ ...p, lcNo: v })), 'text', 'NIL (T/T 생략)')}</div>
          <div className="col-md-2">{fi('L/C Date', c.lcDate ?? '', v => onChange(p => ({ ...p, lcDate: v })), 'date')}</div>
          <div className="col-md-6">{fi('⑩ L/C Issuing Bank', c.lcIssuingBank ?? '', v => onChange(p => ({ ...p, lcIssuingBank: v })), 'text', 'T/T 거래 시 생략')}</div>
        </div>
        <div className="row g-3 mt-0">
          <div className="col-md-2">
            <SelectOrInput label="Currency" value={c.currency} onChange={v => onChange(p => ({ ...p, currency: v }))} options={CURRENCIES} placeholder="USD" />
          </div>
          <div className="col-md-2">
            <SelectOrInput label="Incoterms" value={c.incoterms} onChange={v => onChange(p => ({ ...p, incoterms: v }))} options={INCOTERMS_OPTS} placeholder="FOB" />
          </div>
          <div className="col-md-4">
            <SelectOrInput label="⑦ Terms of Delivery & Payment" value={c.paymentTerms} onChange={v => onChange(p => ({ ...p, paymentTerms: v }))} options={PAYMENT_TERMS_EN} placeholder="T/T 100% IN ADVANCE" />
          </div>
          <div className="col-md-4">{fi('Customer Order No.', c.customerOrderNo, v => onChange(p => ({ ...p, customerOrderNo: v })))}</div>
        </div>
        <div className="row g-3 mt-0">
          <div className="col-md-3">
            <SelectOrInput label="④ Port of Loading" value={c.portOfLoading} onChange={v => onChange(p => ({ ...p, portOfLoading: v }))} options={PORTS_LOADING} placeholder="ICN" />
          </div>
          <div className="col-md-3">{fi('⑤ Final Destination', c.portOfDestination, v => onChange(p => ({ ...p, portOfDestination: v })))}</div>
          <div className="col-md-3">{fi('⑥ Carrier (Vessel / Voy)', c.vessel, v => onChange(p => ({ ...p, vessel: v })))}</div>
          <div className="col-md-2">{fi('⑦ Departure Date', c.departureDate, v => onChange(p => ({ ...p, departureDate: v })), 'date')}</div>
          <div className="col-md-2">{fi('Arrival Date', c.arrivalDate, v => onChange(p => ({ ...p, arrivalDate: v })), 'date')}</div>
        </div>
        <div className="row g-3 mt-0">
          <div className="col-md-4">{fi('Country of Origin', c.countryOfOrigin, v => onChange(p => ({ ...p, countryOfOrigin: v })))}</div>
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="fw-bold text-dark mb-0" style={{ borderLeft: `3px solid ${color}`, paddingLeft: 10 }}>③ Notify Party / Consignee</h6>
              <button className="btn btn-sm rounded-pill px-3" style={{ border: `1px solid ${color}`, color }} onClick={() => setShowConsigneePicker(true)}>
                <i className="bi bi-person-lines-fill me-1" />불러오기
              </button>
            </div>
            {fi('Company', c.consignee.company, v => setConsignee('company', v))}
            {fi('Address', c.consignee.address, v => setConsignee('address', v))}
            {fi('Tel', c.consignee.tel, v => setConsignee('tel', v))}
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <h6 className="fw-bold text-dark mb-3" style={{ borderLeft: `3px solid ${color}`, paddingLeft: 10 }}>② Buyer / Applicant (if other than Consignee)</h6>
            {fi('Company', c.buyer2.company, v => setBuyer2('company', v))}
            {fi('Address', c.buyer2.address, v => setBuyer2('address', v))}
            {fi('Tel', c.buyer2.tel, v => setBuyer2('tel', v))}
          </div>
        </div>
      </div>

      {/* Combined Invoice + Packing Table */}
      <div className="card border-0 shadow-sm rounded-4 mb-3">
        <div className="card-header bg-white border-0 pt-4 px-4 pb-2 d-flex justify-content-between align-items-center">
          <h6 className="fw-bold text-dark mb-0" style={{ borderLeft: `3px solid ${color}`, paddingLeft: 10 }}>Goods + Packing</h6>
          <button className="btn btn-sm btn-outline-secondary rounded-pill px-3" onClick={addItem}><i className="bi bi-plus me-1" />행 추가</button>
        </div>
        <div className="table-responsive">
          <table className="table table-sm mb-0" style={{ fontSize: '0.76rem' }}>
            <thead className="table-light">
              <tr>
                <th className="px-3 py-2" style={{ width: 24 }}>No</th>
                <th style={{ width: 80 }}>Shipping Mark</th>
                <th style={{ width: 100 }}>No.& kind pkgs</th>
                <th style={{ width: 70 }}>HS Code</th>
                <th>Goods Description</th>
                <th style={{ width: 44 }}>Unit</th>
                <th style={{ width: 55 }}>Qty</th>
                <th style={{ width: 80 }}>Unit Price</th>
                <th style={{ width: 90 }}>Amount</th>
                <th style={{ width: 80 }}>NW (kg)</th>
                <th style={{ width: 80 }}>GW (kg)</th>
                <th style={{ width: 70 }}>CBM</th>
                <th style={{ width: 32 }}></th>
              </tr>
            </thead>
            <tbody>
              {c.items.map((item, i) => (
                <tr key={item.id}>
                  <td className="px-3 py-2 text-center text-body-secondary">{i + 1}</td>
                  <td><input className="form-control form-control-sm border-0 bg-transparent" value={item.shippingMark} onChange={e => updateItem(i, 'shippingMark', e.target.value)} /></td>
                  <td><input className="form-control form-control-sm border-0 bg-transparent" value={item.packages} onChange={e => updateItem(i, 'packages', e.target.value)} /></td>
                  <td><input className="form-control form-control-sm border-0 bg-transparent" value={item.hsCode} onChange={e => updateItem(i, 'hsCode', e.target.value)} placeholder="3214.10" /></td>
                  <td><input className="form-control form-control-sm border-0 bg-transparent" value={item.description} onChange={e => updateItem(i, 'description', e.target.value)} /></td>
                  <td><input className="form-control form-control-sm border-0 bg-transparent" value={item.unit} onChange={e => updateItem(i, 'unit', e.target.value)} /></td>
                  <td><input type="number" className="form-control form-control-sm border-0 bg-transparent text-end" value={item.qty} min={0} onChange={e => updateItem(i, 'qty', Number(e.target.value))} /></td>
                  <td><input type="number" className="form-control form-control-sm border-0 bg-transparent text-end" value={item.unitPrice} min={0} step={0.01} onChange={e => updateItem(i, 'unitPrice', Number(e.target.value))} /></td>
                  <td className="text-end pe-1 fw-bold" style={{ color }}>{fmt2(item.amount)}</td>
                  <td><input type="number" className="form-control form-control-sm border-0 bg-transparent text-end" value={item.netWeight} min={0} step={0.001} onChange={e => updateItem(i, 'netWeight', Number(e.target.value))} /></td>
                  <td><input type="number" className="form-control form-control-sm border-0 bg-transparent text-end" value={item.grossWeight} min={0} step={0.001} onChange={e => updateItem(i, 'grossWeight', Number(e.target.value))} /></td>
                  <td><input type="number" className="form-control form-control-sm border-0 bg-transparent text-end" value={item.cbm} min={0} step={0.001} onChange={e => updateItem(i, 'cbm', Number(e.target.value))} /></td>
                  <td className="text-center">
                    {c.items.length > 1 && (
                      <button className="btn btn-sm text-danger p-0" onClick={() => removeItem(i)} style={{ lineHeight: 1 }}>
                        <i className="bi bi-x-lg" style={{ fontSize: '0.75rem' }} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="table-light">
              <tr>
                <td colSpan={8} className="px-3 py-2 text-end fw-bold small" style={{ color }}>TOTAL</td>
                <td className="py-2 fw-bold text-end pe-1" style={{ color }}>{fmt2(c.total)}</td>
                <td className="py-2 fw-bold text-end text-body-secondary">{fmt3(c.totalNetWeight)}</td>
                <td className="py-2 fw-bold text-end text-body-secondary">{fmt3(c.totalGrossWeight)}</td>
                <td className="py-2 fw-bold text-end text-body-secondary">{fmt3(c.totalCBM)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 mb-3 p-4">
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label small fw-bold text-dark mb-1">Total Packages (e.g. 1080C/T, 15PLT)</label>
            <input className="form-control form-control-sm" value={c.totalPackages} onChange={e => onChange(p => ({ ...p, totalPackages: e.target.value }))} placeholder="e.g. 1080C/T, 15PLT" />
          </div>
          <div className="col-md-5">
            <label className="form-label small fw-bold text-dark mb-1">SAY (Total in Words)</label>
            <input className="form-control form-control-sm" value={c.totalInWords} onChange={e => onChange(p => ({ ...p, totalInWords: e.target.value }))} placeholder="e.g. US DOLLARS SIX THOUSAND ONLY" />
          </div>
        </div>
      </div>

      <NotesField value={c.notes} onChange={v => onChange(p => ({ ...p, notes: v }))} />
    </>
  )
}

// ─── 공급계약서 편집기 ─────────────────────────────────────────────────────────
function SalesContractEditor({ content: c, onChange, customers, onContactPick }: {
  content: SalesContractContent; onChange: (u: (p: any) => any) => void; customers: CustomerOption[]; onContactPick: (id: string) => void
}) {
  const color = '#DC2626'
  const [showCustomerPicker, setShowCustomerPicker] = useState(false)

  function setPartyA(field: string, v: string) {
    onChange(p => ({ ...p, partyA: { ...p.partyA, [field]: v } }))
  }
  function setPartyB(field: string, v: string) {
    onChange(p => ({ ...p, partyB: { ...p.partyB, [field]: v } }))
  }

  function applyCustomer(c: CustomerOption) {
    onContactPick(c.id)
    onChange(p => ({
      ...p,
      partyA: { ...p.partyA, company: c.company_name ?? '', tel: c.phone ?? '' },
    }))
  }

  function addDoc() {
    onChange(p => ({ ...p, documents: [...p.documents, ''] }))
  }
  function updateDoc(i: number, v: string) {
    onChange(p => ({ ...p, documents: p.documents.map((d: string, idx: number) => idx === i ? v : d) }))
  }
  function removeDoc(i: number) {
    onChange(p => ({ ...p, documents: p.documents.filter((_: string, idx: number) => idx !== i) }))
  }

  return (
    <>
      {showCustomerPicker && (
        <CustomerPicker customers={customers} onSelect={applyCustomer} onClose={() => setShowCustomerPicker(false)} title="Party A (Buyer) 불러오기" />
      )}

      <div className="card border-0 shadow-sm rounded-4 mb-3 p-4">
        <div className="row g-3">
          <div className="col-md-3">{fi('Contract Date', c.contractDate, v => onChange(p => ({ ...p, contractDate: v })), 'date')}</div>
          <div className="col-md-3">
            <SelectOrInput label="Currency" value={c.currency} onChange={v => onChange(p => ({ ...p, currency: v }))} options={CURRENCIES} />
          </div>
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="fw-bold text-dark mb-0" style={{ borderLeft: `3px solid ${color}`, paddingLeft: 10 }}>Party A (Buyer)</h6>
              <button className="btn btn-sm rounded-pill px-3" style={{ border: `1px solid ${color}`, color }} onClick={() => setShowCustomerPicker(true)}>
                <i className="bi bi-person-lines-fill me-1" />불러오기
              </button>
            </div>
            {fi('Company', c.partyA.company, v => setPartyA('company', v))}
            {fi('Address', c.partyA.address, v => setPartyA('address', v))}
            {fi('Tel', c.partyA.tel, v => setPartyA('tel', v))}
            {fi('Bank Name', c.partyA.bankName, v => setPartyA('bankName', v))}
            {fi('Account No.', c.partyA.account, v => setPartyA('account', v))}
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <h6 className="fw-bold text-dark mb-3" style={{ borderLeft: `3px solid ${color}`, paddingLeft: 10 }}>Party B (Seller / KCT)</h6>
            {fi('Company', c.partyB.company, v => setPartyB('company', v))}
            {fi('Address', c.partyB.address, v => setPartyB('address', v))}
            {fi('Tel', c.partyB.tel, v => setPartyB('tel', v))}
            {fi('Fax', c.partyB.fax, v => setPartyB('fax', v))}
            {fi('Bank Name', c.partyB.bankName, v => setPartyB('bankName', v))}
            {fi('Bank Address', c.partyB.bankAddress, v => setPartyB('bankAddress', v))}
            {fi('Account No.', c.partyB.account, v => setPartyB('account', v))}
            {fi('SWIFT Code', c.partyB.swiftCode, v => setPartyB('swiftCode', v))}
          </div>
        </div>
      </div>

      <InvoiceItemsTable items={c.items} onChange={onChange} accentColor={color} title="Article 1 — Commodity" />

      <div className="card border-0 shadow-sm rounded-4 mb-3 p-4">
        <label className="form-label small fw-bold text-dark mb-1">Total in Words</label>
        <input className="form-control form-control-sm" value={c.totalInWords} onChange={e => onChange(p => ({ ...p, totalInWords: e.target.value }))} placeholder="e.g. US DOLLARS THREE THOUSAND FIVE HUNDRED ONLY" />
      </div>

      <div className="card border-0 shadow-sm rounded-4 mb-3 p-4">
        <h6 className="fw-bold text-dark mb-3" style={{ borderLeft: `3px solid ${color}`, paddingLeft: 10 }}>Article 2 — Quality &amp; Packing</h6>
        <textarea className="form-control" rows={3} value={c.qualityAndPacking ?? ''} onChange={e => onChange(p => ({ ...p, qualityAndPacking: e.target.value }))} placeholder="Quality and packing specifications..." />
      </div>

      <div className="card border-0 shadow-sm rounded-4 mb-3 p-4">
        <h6 className="fw-bold text-dark mb-3" style={{ borderLeft: `3px solid ${color}`, paddingLeft: 10 }}>Article 3 — Shipping Terms</h6>
        <div className="row g-3">
          <div className="col-md-4">
            <SelectOrInput label="Port of Loading" value={c.portOfLoading} onChange={v => onChange(p => ({ ...p, portOfLoading: v }))} options={PORTS_LOADING} />
          </div>
          <div className="col-md-4">{fi('Port of Destination', c.portOfDestination, v => onChange(p => ({ ...p, portOfDestination: v })))}</div>
          <div className="col-md-4">
            <SelectOrInput label="Price Term" value={c.priceTerm} onChange={v => onChange(p => ({ ...p, priceTerm: v }))} options={PRICE_TERMS} />
          </div>
          <div className="col-md-4">
            <SelectOrInput label="Partial Shipment" value={c.partialShipment} onChange={v => onChange(p => ({ ...p, partialShipment: v }))} options={PARTIAL_SHIPMENT_OPTS} />
          </div>
          <div className="col-md-4">
            <SelectOrInput label="Transshipment" value={c.transshipment} onChange={v => onChange(p => ({ ...p, transshipment: v }))} options={TRANSSHIPMENT_OPTS} />
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 mb-3 p-4">
        <h6 className="fw-bold text-dark mb-3" style={{ borderLeft: `3px solid ${color}`, paddingLeft: 10 }}>Article 4 — Payment Terms</h6>
        <SelectOrInput label="Payment Terms" value={c.paymentTerms} onChange={v => onChange(p => ({ ...p, paymentTerms: v }))} options={PAYMENT_TERMS_EN} />
      </div>

      <div className="card border-0 shadow-sm rounded-4 mb-3 p-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h6 className="fw-bold text-dark mb-0" style={{ borderLeft: `3px solid ${color}`, paddingLeft: 10 }}>Article 5 — Documents</h6>
          <button className="btn btn-sm btn-outline-secondary rounded-pill px-3" onClick={addDoc}><i className="bi bi-plus me-1" />추가</button>
        </div>
        {c.documents.map((doc, i) => (
          <div key={i} className="d-flex gap-2 mb-2">
            <input className="form-control form-control-sm" value={doc} onChange={e => updateDoc(i, e.target.value)} placeholder={`Document ${i + 1}`} />
            {c.documents.length > 1 && (
              <button className="btn btn-sm text-danger" onClick={() => removeDoc(i)} style={{ padding: '0 6px' }}>
                <i className="bi bi-x-lg" style={{ fontSize: '0.75rem' }} />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="card border-0 shadow-sm rounded-4 mb-3 p-4">
        <h6 className="fw-bold text-dark mb-3" style={{ borderLeft: `3px solid ${color}`, paddingLeft: 10 }}>Article 6 — Insurance</h6>
        <textarea className="form-control" rows={2} value={c.insurance ?? ''} onChange={e => onChange(p => ({ ...p, insurance: e.target.value }))} placeholder="Insurance terms (leave blank to omit from document)" />
      </div>

      <div className="card border-0 shadow-sm rounded-4 mb-3 p-4">
        <h6 className="fw-bold text-dark mb-3" style={{ borderLeft: `3px solid ${color}`, paddingLeft: 10 }}>Article 7 — Inspection</h6>
        <textarea className="form-control" rows={3} value={c.inspectionClause ?? ''} onChange={e => onChange(p => ({ ...p, inspectionClause: e.target.value }))} placeholder="Inspection clause..." />
      </div>

      <div className="card border-0 shadow-sm rounded-4 mb-3 p-4">
        <h6 className="fw-bold text-dark mb-3" style={{ borderLeft: `3px solid ${color}`, paddingLeft: 10 }}>Article 8 — Force Majeure</h6>
        <textarea className="form-control" rows={3} value={c.forceMajeure ?? ''} onChange={e => onChange(p => ({ ...p, forceMajeure: e.target.value }))} placeholder="Force majeure clause..." />
      </div>

      <div className="card border-0 shadow-sm rounded-4 mb-3 p-4">
        <h6 className="fw-bold text-dark mb-3" style={{ borderLeft: `3px solid ${color}`, paddingLeft: 10 }}>Article 9 — Arbitration</h6>
        <textarea className="form-control" rows={3} value={c.arbitration} onChange={e => onChange(p => ({ ...p, arbitration: e.target.value }))} />
      </div>

      <div className="card border-0 shadow-sm rounded-4 mb-3 p-4">
        <h6 className="fw-bold text-dark mb-3" style={{ borderLeft: `3px solid ${color}`, paddingLeft: 10 }}>Article 10 — General Conditions</h6>
        <textarea className="form-control" rows={2} value={c.generalConditions} onChange={e => onChange(p => ({ ...p, generalConditions: e.target.value }))} />
      </div>
    </>
  )
}
