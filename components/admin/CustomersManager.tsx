'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { downloadCSV } from '@/lib/csv-export'

const TIER_LABELS: Record<string, string> = { standard: '일반', silver: '실버', gold: '골드', platinum: '플래티넘' }
const TIER_BADGE: Record<string, string> = {
  standard: 'bg-secondary',
  silver: 'bg-info text-dark',
  gold: 'bg-warning text-dark',
  platinum: 'bg-primary',
}

interface Contact {
  id: string
  company_name: string | null
  company_name_en: string | null
  business_reg_number: string | null
  customer_type: string | null
  country: string | null
  contact_person: string | null
  contact_title: string | null
  phone: string | null
  fax: string | null
  email: string | null
  address: string | null
  whatsapp: string | null
  wechat: string | null
  kakao_id: string | null
  line_id: string | null
  linkedin: string | null
  instagram: string | null
  facebook: string | null
  twitter: string | null
  youtube: string | null
  currency: string | null
  payment_terms: string | null
  credit_limit: number | null
  acquisition_source: string | null
  first_deal_date: string | null
  next_followup_at: string | null
  tier: string
  is_verified: boolean
  notes: string | null
  created_at: string
  updated_at: string
  doc_count?: number
}

const CUSTOMER_TYPE_LABELS: Record<string, string> = {
  contractor: '시공사', dealer: '대리점', distributor: '유통사',
  end_user: '최종사용자', trading: '트레이딩', manufacturer: '제조사', other: '기타',
}

export default function CustomersManager({ initialCustomers }: { initialCustomers: Contact[] }) {
  const [customers, setCustomers] = useState<Contact[]>(initialCustomers)
  const [search, setSearch] = useState('')
  const [filterTier, setFilterTier] = useState('all')
  const [deleting, setDeleting] = useState<string | null>(null)

  const supabase = createClient()

  async function handleDelete(id: string, name: string | null) {
    if (!confirm(`'${name || '고객'}'을(를) 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) return
    setDeleting(id)
    const { error } = await supabase.from('admin_contacts').delete().eq('id', id)
    if (!error) {
      setCustomers(prev => prev.filter(c => c.id !== id))
    } else {
      alert('삭제 실패: ' + error.message)
    }
    setDeleting(null)
  }

  const filtered = customers.filter(c => {
    const q = search.toLowerCase()
    const matchSearch = !search ||
      c.company_name?.toLowerCase().includes(q) ||
      c.company_name_en?.toLowerCase().includes(q) ||
      c.contact_person?.toLowerCase().includes(q) ||
      c.contact_title?.toLowerCase().includes(q) ||
      c.phone?.includes(search) ||
      c.email?.toLowerCase().includes(q) ||
      c.country?.toLowerCase().includes(q) ||
      c.whatsapp?.includes(search) ||
      (c.customer_type && (CUSTOMER_TYPE_LABELS[c.customer_type] ?? '').includes(search))
    const matchTier = filterTier === 'all' || filterTier === 'followup'
      ? (filterTier === 'followup'
          ? (c.next_followup_at != null && new Date(c.next_followup_at) < new Date())
          : true)
      : c.tier === filterTier
    return matchSearch && matchTier
  })

  const tierCounts = ['standard', 'silver', 'gold', 'platinum'].map(t => ({
    tier: t,
    count: customers.filter(c => c.tier === t).length,
  }))

  return (
    <div>
      {/* 헤더 */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">고객 관리</h1>
          <p className="text-body-secondary mb-0 small">총 {customers.length}명 · 표시 {filtered.length}명</p>
        </div>
        <div className="d-flex gap-2 align-items-center">
          <button
            className="btn btn-sm btn-outline-secondary rounded-pill px-3"
            onClick={() => downloadCSV(
              ['회사명(국문)', '회사명(영문)', '국가', '고객유형', '사업자번호', '담당자', '직책', '연락처', '팩스', '이메일', 'WhatsApp', 'WeChat', '주소', '통화', '결제조건', '신용한도', '등급', '인증', '유입경로', '최초거래일', '팔로우업', '메모', '등록일'],
              customers.map(c => [c.company_name, c.company_name_en, c.country, CUSTOMER_TYPE_LABELS[c.customer_type ?? ''] ?? c.customer_type, c.business_reg_number, c.contact_person, c.contact_title, c.phone, c.fax, c.email, c.whatsapp, c.wechat, c.address, c.currency, c.payment_terms, c.credit_limit, TIER_LABELS[c.tier] ?? c.tier, c.is_verified ? '인증' : '미인증', c.acquisition_source, c.first_deal_date, c.next_followup_at, c.notes, c.created_at?.slice(0, 10)])
              , `고객목록_${new Date().toISOString().slice(0, 10)}.csv`)}
          >
            <i className="bi bi-download me-1" />CSV
          </button>
          <a href="/admin/customers/new" className="btn btn-sm btn-primary rounded-pill px-3 px-md-4">
            <i className="bi bi-person-plus me-1 me-md-2" />신규 고객 등록
          </a>
        </div>
      </div>

      {/* 등급별 요약 */}
      <div className="row g-2 g-md-3 mb-4 row-cols-2 row-cols-sm-3 row-cols-xl-6">
        {[
          { label: '전체', value: customers.length, badge: 'bg-dark', key: 'all' },
          { label: '일반', value: tierCounts[0].count, badge: 'bg-secondary', key: 'standard' },
          { label: '실버', value: tierCounts[1].count, badge: 'bg-info text-dark', key: 'silver' },
          { label: '골드', value: tierCounts[2].count, badge: 'bg-warning text-dark', key: 'gold' },
          { label: '플래티넘', value: tierCounts[3].count, badge: 'bg-primary', key: 'platinum' },
          { label: '팔로우업 초과', value: customers.filter(c => c.next_followup_at && new Date(c.next_followup_at) < new Date()).length, badge: 'bg-danger', key: 'followup' },
        ].map(item => (
          <div key={item.key} className="col">
            <button
              className={`card border-0 w-100 text-start rounded-4 p-2 p-md-3 h-100 ${filterTier === item.key ? 'shadow' : 'shadow-sm'}`}
              style={{
                cursor: 'pointer',
                outline: filterTier === item.key ? '2px solid #1558D6' : 'none',
                background: '#fff',
                transition: 'all 0.2s',
              }}
              onClick={() => setFilterTier(item.key)}
            >
              <div className="d-flex align-items-center justify-content-between">
                <span className="text-body-secondary fw-medium" style={{ fontSize: '0.7rem' }}>{item.label}</span>
                <span className={`badge rounded-pill ${item.badge}`} style={{ fontSize: '0.6rem' }}>{item.value}</span>
              </div>
              <div className="fw-bold text-dark mt-1" style={{ fontSize: '1.1rem' }}>{item.value}<span className="text-body-secondary small fw-normal ms-1" style={{ fontSize: '0.75rem' }}>명</span></div>
            </button>
          </div>
        ))}
      </div>

      {/* 검색 */}
      <div className="mb-3">
        <div className="input-group rounded-pill overflow-hidden border" style={{ maxWidth: 400 }}>
          <span className="input-group-text bg-white border-0 ps-3">
            <i className="bi bi-search text-body-secondary" style={{ fontSize: '0.85rem' }} />
          </span>
          <input
            className="form-control border-0"
            placeholder="회사명, 담당자, 국가, 연락처, 이메일 검색..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ fontSize: '0.875rem' }}
          />
          {search && (
            <button className="btn btn-light border-0" onClick={() => setSearch('')}>
              <i className="bi bi-x" />
            </button>
          )}
        </div>
      </div>

      {/* 테이블 */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover mb-0" style={{ fontSize: '0.875rem', minWidth: 1000 }}>
          <thead className="table-light">
            <tr>
              <th className="px-4 py-3">회사명</th>
              <th className="py-3">담당자</th>
              <th className="py-3">연락처</th>
              <th className="py-3">이메일</th>
              <th className="py-3" style={{ maxWidth: 120 }}>결제/통화</th>
              <th className="py-3 text-center">등급</th>
              <th className="py-3 text-center">인증</th>
              <th className="py-3 text-center">문서</th>
              <th className="py-3 text-center pe-4">관리</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id}>
                <td className="px-4 py-3">
                  <a href={`/admin/customers/${c.id}`} className="fw-bold text-dark text-decoration-none">{c.company_name || '(미입력)'}</a>
                  {c.company_name_en && (
                    <div className="text-body-secondary" style={{ fontSize: '0.72rem' }}>{c.company_name_en}</div>
                  )}
                  <div className="d-flex align-items-center gap-1 mt-1 flex-wrap">
                    {c.country && c.country !== '대한민국' && (
                      <span className="badge bg-light text-secondary border rounded-pill" style={{ fontSize: '0.62rem' }}>{c.country}</span>
                    )}
                    {c.customer_type && (
                      <span className="badge bg-light text-secondary border rounded-pill" style={{ fontSize: '0.62rem' }}>
                        {CUSTOMER_TYPE_LABELS[c.customer_type] ?? c.customer_type}
                      </span>
                    )}
                    {c.next_followup_at && new Date(c.next_followup_at) < new Date() && (
                      <span className="badge bg-danger rounded-pill" style={{ fontSize: '0.62rem' }}>
                        <i className="bi bi-alarm me-1" />팔로우업 초과
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3">
                  <div>{c.contact_person || '-'}</div>
                  {c.contact_title && <div className="text-body-secondary" style={{ fontSize: '0.72rem' }}>{c.contact_title}</div>}
                </td>
                <td className="py-3">
                  <div style={{ fontSize: '0.85rem' }}>{c.phone || '-'}</div>
                  {c.whatsapp && <div className="text-success" style={{ fontSize: '0.72rem' }}><i className="bi bi-whatsapp me-1" />{c.whatsapp}</div>}
                  {!c.whatsapp && c.kakao_id && <div style={{ fontSize: '0.72rem', color: '#713f12' }}><i className="bi bi-chat-fill me-1" />{c.kakao_id}</div>}
                </td>
                <td className="py-3 text-body-secondary" style={{ fontSize: '0.8rem' }}>{c.email || '-'}</td>
                <td className="py-3 text-body-secondary" style={{ maxWidth: 120 }}>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                    {c.payment_terms || c.address || '-'}
                  </div>
                  {c.currency && c.currency !== 'KRW' && (
                    <span className="badge bg-light text-secondary border rounded-pill" style={{ fontSize: '0.62rem' }}>{c.currency}</span>
                  )}
                </td>
                <td className="py-3 text-center">
                  <span className={`badge rounded-pill px-2 ${TIER_BADGE[c.tier] ?? 'bg-secondary'}`} style={{ fontSize: '0.7rem' }}>
                    {TIER_LABELS[c.tier] ?? c.tier}
                  </span>
                </td>
                <td className="py-3 text-center">
                  <span
                    className={`badge rounded-pill px-2 ${c.is_verified ? 'bg-success' : 'bg-light text-secondary border'}`}
                    style={{ fontSize: '0.7rem' }}
                  >
                    {c.is_verified ? '인증' : '미인증'}
                  </span>
                </td>
                <td className="py-3 text-center">
                  {(c.doc_count ?? 0) > 0 ? (
                    <a href="/admin/documents" className="badge rounded-pill bg-primary text-decoration-none px-2" style={{ fontSize: '0.7rem' }}>
                      {c.doc_count}건
                    </a>
                  ) : (
                    <span className="text-body-secondary" style={{ fontSize: '0.75rem' }}>-</span>
                  )}
                </td>
                <td className="py-3 text-center pe-4">
                  <div className="d-flex gap-1 justify-content-center">
                    <a
                      href={`/admin/customers/${c.id}/edit`}
                      className="btn btn-sm btn-outline-primary rounded-pill px-2"
                      title="수정"
                    >
                      <i className="bi bi-pencil" />
                    </a>
                    <button
                      className="btn btn-sm btn-outline-danger rounded-pill px-2"
                      onClick={() => handleDelete(c.id, c.company_name)}
                      disabled={deleting === c.id}
                      title="삭제"
                    >
                      {deleting === c.id
                        ? <span className="spinner-border spinner-border-sm" style={{ width: 10, height: 10 }} />
                        : <i className="bi bi-trash" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-5 text-center text-body-secondary">
                  <i className="bi bi-people fs-2 d-block mb-2 opacity-25" />
                  {search || filterTier !== 'all' ? '검색 결과가 없습니다' : '등록된 고객이 없습니다'}
                  {!search && filterTier === 'all' && (
                    <div className="mt-3">
                      <a href="/admin/customers/new" className="btn btn-primary rounded-pill px-4">
                        <i className="bi bi-person-plus me-2" />첫 고객 등록하기
                      </a>
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )
}
