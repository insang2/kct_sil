'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { genDocNumber } from '@/lib/admin-document-types'
import type { QuotationContent } from '@/lib/admin-document-types'
import { downloadCSV } from '@/lib/csv-export'

/* ── 상수 ── */
const ADMIN_STATUSES = ['pending', 'reviewing', 'approved', 'rejected'] as const
type AdminStatus = typeof ADMIN_STATUSES[number]

const STATUS_LABEL: Record<AdminStatus, string> = {
  pending: '대기', reviewing: '검토중', approved: '승인', rejected: '반려',
}
const STATUS_COLOR: Record<AdminStatus, { bg: string; text: string; border: string }> = {
  pending:   { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
  reviewing: { bg: '#E0F2FE', text: '#0C4A6E', border: '#7DD3FC' },
  approved:  { bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7' },
  rejected:  { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' },
}

const INCOTERMS = ['EXW','FCA','CPT','CIP','DAP','DPU','DDP','FAS','FOB','CFR','CIF']

/* ── 타입 ── */
interface Quote {
  id: string
  quote_number: string | null
  customer_company: string | null
  customer_name: string | null
  customer_email: string | null
  customer_phone: string | null
  items: any[]
  subtotal: number
  tax: number
  total: number
  notes: string | null
  admin_notes: string | null
  admin_status: string
  status: string
  is_urgent: boolean
  trade_terms: any
  created_at: string
}

interface ContactOption { id: string; company_name: string | null; tier: string }

interface TradeTerms {
  incoterms: string
  originPort: string
  destPort: string
  deliveryDays: string
  specialTerms: string
}

/* ── 유틸 ── */
function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}
function addDays(n: number) {
  const d = new Date(); d.setDate(d.getDate()+n)
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}
function elapsedLabel(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
  if (diff === 0) return '오늘'
  if (diff < 7) return `${diff}일 전`
  if (diff < 30) return `${Math.floor(diff/7)}주 전`
  return `${Math.floor(diff/30)}개월 전`
}
function matchContact(company: string | null, contacts: ContactOption[]) {
  if (!company) return null
  const q = company.trim().toLowerCase()
  return contacts.find(c => (c.company_name ?? '').trim().toLowerCase() === q) ?? null
}
function emailApprovalTemplate(quote: Quote) {
  return `안녕하세요, ${quote.customer_company ?? '고객사'} ${quote.customer_name ?? '담당자'}님.\n\n${quote.quote_number} 견적 요청을 검토하였으며, 아래와 같이 견적서를 발행해 드립니다.\n\n▶ 견적번호: ${quote.quote_number}\n▶ 견적 금액: ${Number(quote.total).toLocaleString('ko-KR')}원\n\n견적서는 별첨 PDF를 확인해 주시기 바랍니다.\n문의사항이 있으시면 언제든지 연락 주시기 바랍니다.\n\n감사합니다.\n한국건설트레이딩 드림`
}
function emailRejectionTemplate(quote: Quote) {
  return `안녕하세요, ${quote.customer_company ?? '고객사'} ${quote.customer_name ?? '담당자'}님.\n\n${quote.quote_number} 견적 요청을 검토하였으나, 현재 재고 및 공급 일정 사정으로 인해 요청하신 조건으로 견적을 제공하기 어려운 상황입니다.\n\n추후 다시 상담 주시거나, 다른 제품에 대한 문의사항이 있으시면 언제든지 연락 주시기 바랍니다.\n\n불편을 드려 죄송합니다.\n\n감사합니다.\n한국건설트레이딩 드림`
}

/* ── 컴포넌트 ── */
export default function QuotesManager({
  initialQuotes, contacts,
}: {
  initialQuotes: Quote[]
  contacts: ContactOption[]
}) {
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes)
  const [panelId, setPanelId] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<'all' | AdminStatus>('all')
  const [filterPeriod, setFilterPeriod] = useState<'all'|'today'|'week'|'month'>('all')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'date'|'amount'>('date')
  const [sortDir, setSortDir] = useState<'desc'|'asc'>('desc')
  const [savingId, setSavingId] = useState<string|null>(null)
  const [issuingId, setIssuingId] = useState<string|null>(null)
  const [deletingId, setDeletingId] = useState<string|null>(null)
  const [adminNotes, setAdminNotes] = useState<Record<string,string>>({})
  const [tradeTermsEdit, setTradeTermsEdit] = useState<Record<string,TradeTerms>>({})
  const [emailTab, setEmailTab] = useState<'approval'|'rejection'>('approval')
  const [copyDone, setCopyDone] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  /* ── 필터링 & 정렬 ── */
  function periodStart(p: typeof filterPeriod) {
    const now = new Date()
    if (p === 'today') { const d = new Date(now); d.setHours(0,0,0,0); return d }
    if (p === 'week')  { const d = new Date(now); d.setDate(d.getDate()-7); return d }
    if (p === 'month') { const d = new Date(now); d.setMonth(d.getMonth()-1); return d }
    return null
  }

  const filtered = quotes
    .filter(q => {
      const s = search.toLowerCase()
      const matchSearch = !search ||
        (q.quote_number ?? '').toLowerCase().includes(s) ||
        (q.customer_company ?? '').toLowerCase().includes(s) ||
        (q.customer_name ?? '').toLowerCase().includes(s)
      const matchStatus = filterStatus === 'all' || q.admin_status === filterStatus
      const start = periodStart(filterPeriod)
      const matchPeriod = !start || new Date(q.created_at) >= start
      return matchSearch && matchStatus && matchPeriod
    })
    .sort((a, b) => {
      const mul = sortDir === 'desc' ? -1 : 1
      if (sortBy === 'amount') return mul * (Number(a.total) - Number(b.total))
      return mul * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    })

  /* ── 요약 통계 ── */
  const stats = ADMIN_STATUSES.map(s => ({
    status: s,
    count: quotes.filter(q => q.admin_status === s).length,
    total: quotes.filter(q => q.admin_status === s).reduce((sum, q) => sum + Number(q.total||0), 0),
  }))
  const thisMonth = new Date(); thisMonth.setDate(1); thisMonth.setHours(0,0,0,0)
  const monthTotal = quotes.filter(q => new Date(q.created_at) >= thisMonth).reduce((s,q) => s+Number(q.total||0), 0)
  const urgentCount = quotes.filter(q => q.is_urgent && q.admin_status === 'pending').length

  /* ── DB 액션 ── */
  async function changeStatus(id: string, admin_status: AdminStatus) {
    setSavingId(id)
    const { error } = await supabase.from('quotes').update({ admin_status }).eq('id', id)
    if (!error) setQuotes(prev => prev.map(q => q.id === id ? { ...q, admin_status } : q))
    setSavingId(null)
  }

  async function toggleUrgent(id: string, current: boolean) {
    const is_urgent = !current
    const { error } = await supabase.from('quotes').update({ is_urgent }).eq('id', id)
    if (!error) setQuotes(prev => prev.map(q => q.id === id ? { ...q, is_urgent } : q))
  }

  async function saveNotes(id: string) {
    setSavingId(id)
    const admin_notes = adminNotes[id] ?? ''
    const { error } = await supabase.from('quotes').update({ admin_notes }).eq('id', id)
    if (!error) {
      setQuotes(prev => prev.map(q => q.id === id ? { ...q, admin_notes } : q))
      setAdminNotes(prev => { const n = {...prev}; delete n[id]; return n })
    }
    setSavingId(null)
  }

  async function saveTradeTerms(id: string) {
    setSavingId(id)
    const trade_terms = tradeTermsEdit[id]
    const { error } = await supabase.from('quotes').update({ trade_terms }).eq('id', id)
    if (!error) {
      setQuotes(prev => prev.map(q => q.id === id ? { ...q, trade_terms } : q))
      setTradeTermsEdit(prev => { const n = {...prev}; delete n[id]; return n })
    }
    setSavingId(null)
  }

  async function handleDelete(id: string) {
    if (!confirm('이 견적을 삭제하시겠습니까?')) return
    setDeletingId(id)
    const { error } = await supabase.from('quotes').delete().eq('id', id)
    if (!error) { setQuotes(prev => prev.filter(q => q.id !== id)); if (panelId === id) setPanelId(null) }
    setDeletingId(null)
  }

  async function issueQuotation(q: Quote) {
    setIssuingId(q.id)
    try {
      const docNumber = genDocNumber('quotation')
      const content: QuotationContent = {
        docNumber, docDate: todayStr(), validUntil: addDays(30),
        buyer: { company: q.customer_company ?? '', contactPerson: q.customer_name ?? '', phone: q.customer_phone ?? '', email: q.customer_email ?? '', address: '' },
        items: (q.items ?? []).map((it: any, idx: number) => ({
          id: idx+1, name: it.name_ko ?? it.name ?? '', spec: it.sku ?? '',
          unit: it.unit ?? '개', qty: it.quantity ?? it.qty ?? 1,
          unitPrice: it.unit_price ?? it.unitPrice ?? 0, amount: it.amount ?? 0, notes: '',
        })),
        subtotal: Number(q.subtotal??0), tax: Number(q.tax??0), total: Number(q.total??0),
        paymentTerms: '세금계산서 발행 후 30일 이내', deliveryTerms: '계약 후 협의', notes: q.notes ?? '',
      }
      const contact = matchContact(q.customer_company, contacts)
      const { error } = await supabase.from('admin_documents').insert({
        doc_type: 'quotation', doc_number: docNumber,
        title: `${q.customer_company ?? '고객'} 견적서`,
        content, status: 'draft',
        contact_id: contact?.id ?? null,
        created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      })
      if (error) throw error
      const dealRes = await supabase.from('admin_deals').insert({
        title: `${q.customer_company ?? '고객'} - ${q.quote_number ?? '견적'}`,
        stage: 'quotation', currency: 'KRW', total_amount: q.total,
        contact_id: contact?.id ?? null,
        notes: `견적 자동 연결 (${q.quote_number})`,
      }).select('id').single()
      if (!dealRes.error && dealRes.data) {
        await supabase.from('admin_documents').update({ deal_id: dealRes.data.id }).eq('doc_number', docNumber)
      }
      await supabase.from('quotes').update({ admin_status: 'approved' }).eq('id', q.id)
      setQuotes(prev => prev.map(x => x.id === q.id ? { ...x, admin_status: 'approved' } : x))
      router.push('/admin/documents')
    } catch (e: any) {
      alert('견적서 발행 실패: ' + e.message)
    } finally { setIssuingId(null) }
  }

  function toggleSort(by: 'date'|'amount') {
    if (sortBy === by) setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    else { setSortBy(by); setSortDir('desc') }
  }

  function copyEmail(text: string) {
    navigator.clipboard.writeText(text).then(() => { setCopyDone(true); setTimeout(() => setCopyDone(false), 2000) })
  }

  /* ── 사이드 패널용 ── */
  const panel = panelId ? quotes.find(q => q.id === panelId) ?? null : null
  const panelContact = panel ? matchContact(panel.customer_company, contacts) : null
  const panelTT: TradeTerms = panel
    ? (tradeTermsEdit[panel.id] ?? {
        incoterms: panel.trade_terms?.incoterms ?? '',
        originPort: panel.trade_terms?.originPort ?? '',
        destPort: panel.trade_terms?.destPort ?? '',
        deliveryDays: panel.trade_terms?.deliveryDays ?? '',
        specialTerms: panel.trade_terms?.specialTerms ?? '',
      })
    : { incoterms: '', originPort: '', destPort: '', deliveryDays: '', specialTerms: '' }

  function setTT(key: keyof TradeTerms, val: string) {
    if (!panel) return
    setTradeTermsEdit(prev => ({ ...prev, [panel.id]: { ...panelTT, [key]: val } }))
  }

  const isTTDirty = panel && tradeTermsEdit[panel.id] !== undefined
  const isNotesDirty = panel && adminNotes[panel.id] !== undefined

  return (
    <>
      <style>{`
        .quote-panel { width: 520px; }
        @media (max-width: 767px) { .quote-panel { width: 100% !important; } }
        .sort-btn { background: none; border: none; padding: 0; cursor: pointer; color: #6c757d; font-size: 0.75rem; }
        .sort-btn:hover { color: #1558D6; }
      `}</style>

      {/* 패널 오버레이 */}
      {panelId && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 1040 }}
          onClick={() => setPanelId(null)}
        />
      )}

      {/* 사이드 패널 ⑦ */}
      <div
        className="quote-panel"
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 1045,
          background: '#fff', boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
          overflowY: 'auto', display: 'flex', flexDirection: 'column',
          transform: panelId ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {panel && (
          <>
            {/* 패널 헤더 */}
            <div className="d-flex align-items-start justify-content-between p-4 border-bottom"
              style={{ background: panel.is_urgent ? '#FFF7ED' : '#f8f9fa' }}>
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  {panel.is_urgent && <span className="badge bg-danger rounded-pill" style={{ fontSize: '0.7rem' }}>🔴 긴급</span>}
                  <span className="fw-bold text-primary" style={{ fontFamily: 'monospace' }}>{panel.quote_number}</span>
                </div>
                <div className="fw-bold text-dark fs-6">{panel.customer_company || '(회사명 없음)'}</div>
                <div className="text-body-secondary small">{elapsedLabel(panel.created_at)} · {new Date(panel.created_at).toLocaleDateString('ko-KR')}</div>
              </div>
              <button className="btn btn-sm btn-light rounded-circle" style={{ width: 32, height: 32, padding: 0 }}
                onClick={() => setPanelId(null)}>
                <i className="bi bi-x" />
              </button>
            </div>

            <div className="p-4 d-flex flex-column gap-4" style={{ flex: 1 }}>

              {/* 고객 정보 ④ */}
              <div>
                <div className="fw-bold text-dark mb-2" style={{ fontSize: '0.85rem' }}>고객 정보</div>
                <div className="rounded-3 border p-3" style={{ fontSize: '0.85rem', background: '#f8f9fa' }}>
                  {panelContact ? (
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <div className="fw-bold text-dark">{panel.customer_company}</div>
                        <div className="text-body-secondary">{panel.customer_name} · {panel.customer_phone || panel.customer_email || '-'}</div>
                      </div>
                      <a href={`/admin/customers/${panelContact.id}`}
                        className="badge bg-primary text-decoration-none rounded-pill px-3 py-2"
                        style={{ fontSize: '0.72rem' }}>
                        <i className="bi bi-person-fill me-1" />고객 상세
                      </a>
                    </div>
                  ) : (
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <div className="fw-bold text-dark">{panel.customer_company || '-'}</div>
                        <div className="text-body-secondary">{panel.customer_name} · {panel.customer_phone || panel.customer_email || '-'}</div>
                      </div>
                      {panel.customer_company && (
                        <a href={`/admin/customers/new?company=${encodeURIComponent(panel.customer_company)}`}
                          className="badge bg-warning text-dark text-decoration-none rounded-pill px-3 py-2"
                          style={{ fontSize: '0.72rem' }}>
                          <i className="bi bi-person-plus me-1" />고객 등록
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* 견적 품목 */}
              <div>
                <div className="fw-bold text-dark mb-2" style={{ fontSize: '0.85rem' }}>
                  견적 품목 <span className="badge bg-light text-secondary border rounded-pill ms-1" style={{ fontSize: '0.7rem' }}>{(panel.items ?? []).length}개</span>
                </div>
                <table className="table table-sm table-bordered mb-0 rounded-3 overflow-hidden" style={{ fontSize: '0.8rem' }}>
                  <thead className="table-light">
                    <tr><th className="px-2 py-1">제품</th><th className="px-2 py-1 text-center">수량</th><th className="px-2 py-1 text-end">금액</th></tr>
                  </thead>
                  <tbody>
                    {(panel.items ?? []).map((it: any, i: number) => (
                      <tr key={i}>
                        <td className="px-2 py-1">{it.name_ko ?? it.name ?? '-'}<div className="text-body-secondary" style={{ fontSize: '0.72rem' }}>{it.sku ?? ''}</div></td>
                        <td className="px-2 py-1 text-center">{it.quantity ?? it.qty ?? 0} {it.unit}</td>
                        <td className="px-2 py-1 text-end fw-bold">{Number(it.amount ?? 0).toLocaleString('ko-KR')}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="table-light">
                    <tr>
                      <td colSpan={2} className="px-2 py-1 text-end" style={{ fontSize: '0.78rem' }}>공급가 / 부가세</td>
                      <td className="px-2 py-1 text-end" style={{ fontSize: '0.78rem' }}>
                        {Number(panel.subtotal).toLocaleString('ko-KR')} / {Number(panel.tax).toLocaleString('ko-KR')}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="px-2 py-1 text-end fw-bold">합계</td>
                      <td className="px-2 py-1 text-end fw-bold text-primary">{Number(panel.total).toLocaleString('ko-KR')}원</td>
                    </tr>
                  </tfoot>
                </table>
                {panel.notes && (
                  <div className="mt-2 p-2 rounded-2" style={{ background: '#FEF3C7', fontSize: '0.8rem' }}>
                    <i className="bi bi-chat-left-text me-1 text-warning" />{panel.notes}
                  </div>
                )}
              </div>

              {/* 무역 조건 ⑤ */}
              <div>
                <div className="fw-bold text-dark mb-2" style={{ fontSize: '0.85rem' }}>
                  <i className="bi bi-ship me-1 text-primary" />무역 조건
                </div>
                <div className="rounded-3 border p-3 d-flex flex-column gap-2">
                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label mb-1" style={{ fontSize: '0.75rem', fontWeight: 600 }}>인코텀즈</label>
                      <select className="form-select form-select-sm" value={panelTT.incoterms}
                        onChange={e => setTT('incoterms', e.target.value)}>
                        <option value="">선택...</option>
                        {INCOTERMS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label mb-1" style={{ fontSize: '0.75rem', fontWeight: 600 }}>납기 (일)</label>
                      <input className="form-control form-control-sm" placeholder="예: 30" value={panelTT.deliveryDays}
                        onChange={e => setTT('deliveryDays', e.target.value)} />
                    </div>
                    <div className="col-6">
                      <label className="form-label mb-1" style={{ fontSize: '0.75rem', fontWeight: 600 }}>출발 항구</label>
                      <input className="form-control form-control-sm" placeholder="Busan, KR" value={panelTT.originPort}
                        onChange={e => setTT('originPort', e.target.value)} />
                    </div>
                    <div className="col-6">
                      <label className="form-label mb-1" style={{ fontSize: '0.75rem', fontWeight: 600 }}>도착 항구</label>
                      <input className="form-control form-control-sm" placeholder="Singapore, SG" value={panelTT.destPort}
                        onChange={e => setTT('destPort', e.target.value)} />
                    </div>
                    <div className="col-12">
                      <label className="form-label mb-1" style={{ fontSize: '0.75rem', fontWeight: 600 }}>특기사항</label>
                      <input className="form-control form-control-sm" placeholder="기타 조건" value={panelTT.specialTerms}
                        onChange={e => setTT('specialTerms', e.target.value)} />
                    </div>
                  </div>
                  {isTTDirty && (
                    <button className="btn btn-sm btn-primary rounded-pill px-3 align-self-end"
                      onClick={() => saveTradeTerms(panel.id)} disabled={savingId === panel.id}>
                      {savingId === panel.id ? <span className="spinner-border spinner-border-sm me-1" style={{ width: 10, height: 10 }} /> : null}
                      무역조건 저장
                    </button>
                  )}
                </div>
              </div>

              {/* 관리자 메모 */}
              <div>
                <div className="fw-bold text-dark mb-2" style={{ fontSize: '0.85rem' }}>관리자 메모</div>
                <textarea className="form-control form-control-sm rounded-3" rows={3}
                  value={isNotesDirty ? adminNotes[panel.id] : (panel.admin_notes ?? '')}
                  placeholder="내부 검토 메모..."
                  onChange={e => setAdminNotes(prev => ({ ...prev, [panel.id]: e.target.value }))} />
                {isNotesDirty && (
                  <div className="d-flex gap-2 mt-2">
                    <button className="btn btn-sm btn-primary rounded-pill px-3"
                      onClick={() => saveNotes(panel.id)} disabled={savingId === panel.id}>저장</button>
                    <button className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                      onClick={() => setAdminNotes(prev => { const n={...prev}; delete n[panel.id]; return n })}>취소</button>
                  </div>
                )}
              </div>

              {/* 이메일 답변 템플릿 ⑧ */}
              <div>
                <div className="fw-bold text-dark mb-2" style={{ fontSize: '0.85rem' }}>
                  <i className="bi bi-envelope me-1 text-primary" />이메일 답변 템플릿
                </div>
                <div className="d-flex gap-1 mb-2">
                  {(['approval','rejection'] as const).map(t => (
                    <button key={t} className={`btn btn-sm rounded-pill px-3 ${emailTab === t ? (t === 'approval' ? 'btn-success' : 'btn-danger') : 'btn-outline-secondary'}`}
                      onClick={() => setEmailTab(t)}>
                      {t === 'approval' ? '승인 안내' : '반려 안내'}
                    </button>
                  ))}
                </div>
                <div className="position-relative">
                  <pre className="rounded-3 p-3 mb-2" style={{ fontSize: '0.75rem', background: '#f8f9fa', border: '1px solid #e9ecef', whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: 200, overflowY: 'auto' }}>
                    {emailTab === 'approval' ? emailApprovalTemplate(panel) : emailRejectionTemplate(panel)}
                  </pre>
                </div>
                <div className="d-flex gap-2">
                  <button className={`btn btn-sm rounded-pill px-3 ${copyDone ? 'btn-success' : 'btn-outline-secondary'}`}
                    onClick={() => copyEmail(emailTab === 'approval' ? emailApprovalTemplate(panel) : emailRejectionTemplate(panel))}>
                    <i className={`bi ${copyDone ? 'bi-check' : 'bi-clipboard'} me-1`} />
                    {copyDone ? '복사됨' : '복사'}
                  </button>
                  {panel.customer_email && (
                    <a className="btn btn-sm btn-outline-primary rounded-pill px-3"
                      href={`mailto:${panel.customer_email}?subject=${encodeURIComponent(`[한국건설트레이딩] ${panel.quote_number} 견적 ${emailTab === 'approval' ? '승인' : '반려'} 안내`)}&body=${encodeURIComponent(emailTab === 'approval' ? emailApprovalTemplate(panel) : emailRejectionTemplate(panel))}`}>
                      <i className="bi bi-envelope me-1" />이메일 열기
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* 패널 하단 액션 */}
            <div className="p-4 border-top d-flex flex-column gap-2" style={{ background: '#f8f9fa' }}>
              <div className="d-flex gap-2">
                <button className="btn btn-success flex-fill rounded-pill"
                  onClick={() => changeStatus(panel.id, 'approved')} disabled={savingId === panel.id || panel.admin_status === 'approved'}>
                  <i className="bi bi-check-circle me-1" />승인
                </button>
                <button className="btn btn-danger flex-fill rounded-pill"
                  onClick={() => changeStatus(panel.id, 'rejected')} disabled={savingId === panel.id || panel.admin_status === 'rejected'}>
                  <i className="bi bi-x-circle me-1" />반려
                </button>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-primary flex-fill rounded-pill"
                  onClick={() => issueQuotation(panel)} disabled={issuingId === panel.id}>
                  {issuingId === panel.id
                    ? <><span className="spinner-border spinner-border-sm me-1" style={{ width: 14, height: 14 }} />발행 중...</>
                    : <><i className="bi bi-file-earmark-arrow-up me-1" />견적서 발행</>}
                </button>
                <button className="btn btn-outline-danger rounded-pill px-3"
                  onClick={() => handleDelete(panel.id)} disabled={deletingId === panel.id}>
                  <i className="bi bi-trash" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── 메인 영역 ── */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">견적 현황</h1>
          <p className="text-body-secondary mb-0">
            총 {quotes.length}건
            {urgentCount > 0 && <span className="badge bg-danger ms-2 rounded-pill" style={{ fontSize: '0.7rem' }}>🔴 긴급 {urgentCount}건</span>}
          </p>
        </div>
        <div className="d-flex gap-2 align-items-center">
          <div className="input-group rounded-pill overflow-hidden border" style={{ width: 240 }}>
            <span className="input-group-text bg-white border-0 ps-3">
              <i className="bi bi-search text-body-secondary" style={{ fontSize: '0.85rem' }} />
            </span>
            <input className="form-control border-0 py-2" style={{ fontSize: '0.875rem' }}
              placeholder="견적번호 / 고객사 검색..." value={search} onChange={e => setSearch(e.target.value)} />
            {search && <button className="btn btn-light border-0 px-2" onClick={() => setSearch('')}><i className="bi bi-x" /></button>}
          </div>
          <button className="btn btn-outline-secondary rounded-pill px-3"
            onClick={() => downloadCSV(
              ['견적번호','고객사','담당자','연락처','이메일','공급가','부가세','합계','상태','긴급','일자'],
              filtered.map(q => [q.quote_number, q.customer_company, q.customer_name, q.customer_phone, q.customer_email, q.subtotal, q.tax, q.total, STATUS_LABEL[q.admin_status as AdminStatus] ?? q.admin_status, q.is_urgent ? '긴급' : '', q.created_at?.slice(0,10)])
              , `견적목록_${new Date().toISOString().slice(0,10)}.csv`)}>
            <i className="bi bi-download me-1" />CSV
          </button>
        </div>
      </div>

      {/* ① 요약 카드 */}
      <div className="row g-3 mb-4">
        {stats.map(s => {
          const c = STATUS_COLOR[s.status]
          return (
            <div key={s.status} className="col-6 col-xl-3">
              <button className="card border-0 shadow-sm rounded-4 w-100 text-start p-3"
                style={{
                  cursor: 'pointer', background: filterStatus === s.status ? c.bg : '#fff',
                  outline: filterStatus === s.status ? `2px solid ${c.border}` : 'none',
                  transition: 'all 0.15s',
                }}
                onClick={() => setFilterStatus(filterStatus === s.status ? 'all' : s.status)}>
                <div className="d-flex justify-content-between align-items-start mb-1">
                  <span className="fw-bold" style={{ fontSize: '0.8rem', color: c.text }}>{STATUS_LABEL[s.status]}</span>
                  <span className="badge rounded-pill" style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}`, fontSize: '0.65rem' }}>
                    {s.count}건
                  </span>
                </div>
                <div className="fw-bold" style={{ fontSize: '1.1rem', color: c.text }}>
                  {s.total >= 1000000 ? (s.total/1000000).toFixed(1)+'M' : s.total.toLocaleString('ko-KR')}
                  <span style={{ fontSize: '0.72rem', fontWeight: 400 }}>원</span>
                </div>
              </button>
            </div>
          )
        })}
      </div>

      {/* 이번 달 + 필터 바 */}
      <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
        <div className="d-flex gap-2 flex-wrap">
          {([{key:'all',label:'전체 기간'},{key:'today',label:'오늘'},{key:'week',label:'7일'},{key:'month',label:'30일'}] as const).map(p => (
            <button key={p.key}
              className={`btn btn-sm rounded-pill px-3 ${filterPeriod === p.key ? 'btn-dark' : 'btn-outline-secondary'}`}
              onClick={() => setFilterPeriod(p.key)}>{p.label}</button>
          ))}
        </div>
        <div className="text-body-secondary small">
          이번 달 <strong className="text-dark">{monthTotal.toLocaleString('ko-KR')}원</strong>
        </div>
      </div>

      {/* 테이블 */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <table className="table table-hover mb-0" style={{ fontSize: '0.85rem' }}>
          <thead className="table-light">
            <tr>
              <th className="px-3 py-3" style={{ width: 36 }}></th>
              <th className="px-2 py-3">견적번호</th>
              <th className="py-3">고객사</th>
              <th className="py-3">품목</th>
              <th className="py-3 text-end pe-2" style={{ cursor: 'pointer' }} onClick={() => toggleSort('amount')}>
                합계 <button className="sort-btn ms-1">{sortBy==='amount' ? (sortDir==='desc'?'↓':'↑') : '↕'}</button>
              </th>
              <th className="py-3 text-center" style={{ cursor: 'pointer' }} onClick={() => toggleSort('date')}>
                경과 <button className="sort-btn ms-1">{sortBy==='date' ? (sortDir==='desc'?'↓':'↑') : '↕'}</button>
              </th>
              <th className="py-3 text-center">상태</th>
              <th className="py-3 text-center pe-3">처리</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(q => {
              const status = (q.admin_status ?? 'pending') as AdminStatus
              const sc = STATUS_COLOR[status]
              const linked = matchContact(q.customer_company, contacts)
              const elapsed = Math.floor((Date.now() - new Date(q.created_at).getTime()) / 86400000)
              const isOld = status === 'pending' && elapsed >= 3

              return (
                <tr key={q.id}
                  style={{ cursor: 'pointer', background: q.is_urgent ? '#FFF7ED' : panelId === q.id ? '#EFF6FF' : undefined }}
                  onClick={() => setPanelId(panelId === q.id ? null : q.id)}>

                  {/* ⑥ 긴급 플래그 */}
                  <td className="px-3 py-3 text-center" onClick={e => { e.stopPropagation(); toggleUrgent(q.id, q.is_urgent) }}>
                    <i className={`bi ${q.is_urgent ? 'bi-fire text-danger' : 'bi-fire text-body-secondary opacity-25'}`}
                      style={{ fontSize: '1rem' }} title={q.is_urgent ? '긴급 해제' : '긴급 설정'} />
                  </td>

                  {/* 견적번호 */}
                  <td className="px-2 py-3">
                    <div className="fw-bold text-primary" style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{q.quote_number}</div>
                    {q.trade_terms?.incoterms && (
                      <span className="badge bg-light text-secondary border rounded-pill" style={{ fontSize: '0.62rem' }}>
                        {q.trade_terms.incoterms}
                      </span>
                    )}
                  </td>

                  {/* 고객사 ④ */}
                  <td className="py-3">
                    <div className="fw-bold text-dark">{q.customer_company || '-'}</div>
                    <div className="d-flex align-items-center gap-1 mt-1">
                      <span className="text-body-secondary" style={{ fontSize: '0.75rem' }}>{q.customer_name || ''}</span>
                      {linked
                        ? <span className="badge rounded-pill px-2" style={{ background: '#EFF6FF', color: '#1558D6', border: '1px solid #BFDBFE', fontSize: '0.62rem' }}>
                            <i className="bi bi-person-check me-1" />등록
                          </span>
                        : q.customer_company && (
                          <span className="badge rounded-pill px-2" style={{ background: '#FEF3C7', color: '#92400E', border: '1px solid #FCD34D', fontSize: '0.62rem' }}>
                            미등록
                          </span>
                        )}
                    </div>
                  </td>

                  {/* ③ 품목 수 */}
                  <td className="py-3">
                    <span className="badge bg-light text-secondary border rounded-pill px-2" style={{ fontSize: '0.75rem' }}>
                      {(q.items ?? []).length}개 품목
                    </span>
                    <div className="text-body-secondary mt-1" style={{ fontSize: '0.72rem', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {(q.items ?? []).slice(0,2).map((it: any) => it.name_ko ?? it.name ?? '').join(', ')}
                    </div>
                  </td>

                  {/* 합계 */}
                  <td className="py-3 text-end pe-2 fw-bold text-primary">
                    {Number(q.total).toLocaleString('ko-KR')}원
                  </td>

                  {/* ③ 경과일 */}
                  <td className="py-3 text-center">
                    <span style={{ fontSize: '0.78rem', color: isOld ? '#dc3545' : '#6c757d', fontWeight: isOld ? 600 : 400 }}>
                      {elapsedLabel(q.created_at)}
                    </span>
                  </td>

                  {/* 상태 배지 */}
                  <td className="py-3 text-center">
                    <span className="badge rounded-pill px-2"
                      style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`, fontSize: '0.72rem' }}>
                      {STATUS_LABEL[status]}
                    </span>
                  </td>

                  {/* ② 빠른 처리 버튼 */}
                  <td className="py-3 text-center pe-3" onClick={e => e.stopPropagation()}>
                    <div className="d-flex gap-1 justify-content-center">
                      {status !== 'approved' && (
                        <button className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: 28, height: 28, padding: 0, background: '#D1FAE5', border: '1px solid #6EE7B7', color: '#065F46' }}
                          onClick={() => changeStatus(q.id, 'approved')} disabled={savingId === q.id} title="승인">
                          <i className="bi bi-check-lg" style={{ fontSize: '0.8rem' }} />
                        </button>
                      )}
                      {status !== 'rejected' && (
                        <button className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: 28, height: 28, padding: 0, background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B' }}
                          onClick={() => changeStatus(q.id, 'rejected')} disabled={savingId === q.id} title="반려">
                          <i className="bi bi-x-lg" style={{ fontSize: '0.8rem' }} />
                        </button>
                      )}
                      <button className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: 28, height: 28, padding: 0, background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1558D6' }}
                        onClick={() => setPanelId(panelId === q.id ? null : q.id)} title="상세">
                        <i className="bi bi-arrows-expand" style={{ fontSize: '0.75rem' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-5 text-center text-body-secondary">
                  <i className="bi bi-inbox fs-2 d-block mb-2 opacity-25" />
                  {search || filterStatus !== 'all' ? '검색 결과 없음' : '접수된 견적이 없습니다'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 하단 요약 */}
      {filtered.length > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-3 px-1" style={{ fontSize: '0.8rem', color: '#6c757d' }}>
          <span>{filtered.length}건 표시 중 (전체 {quotes.length}건)</span>
          <span>조회 합계 <strong className="text-dark">{filtered.reduce((s,q) => s+Number(q.total||0),0).toLocaleString('ko-KR')}원</strong></span>
        </div>
      )}
    </>
  )
}
