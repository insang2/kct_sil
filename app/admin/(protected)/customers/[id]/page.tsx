import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const TIER_BADGE: Record<string, string> = {
  platinum: 'bg-primary', gold: 'bg-warning text-dark',
  silver: 'bg-info text-dark', standard: 'bg-secondary',
}
const TIER_LABEL: Record<string, string> = {
  platinum: '플래티넘', gold: '골드', silver: '실버', standard: '일반',
}
const STAGE_LABELS: Record<string, string> = {
  lead: '리드', quotation: '견적', purchase_order: '발주',
  invoice: '인보이스', contract: '계약', completed: '완료', cancelled: '취소',
}
const STAGE_COLORS: Record<string, string> = {
  lead: '#6c757d', quotation: '#D97706', purchase_order: '#1558D6',
  invoice: '#7C3AED', contract: '#0369a1', completed: '#059669', cancelled: '#dc3545',
}
const DOC_TYPE_LABELS: Record<string, string> = {
  quotation: '견적서', purchase_order: '발주서', receipt: '인수증',
  invoice: '인보이스', invoice_packing_list: '인보이스+패킹', sales_contract: '계약서',
}
const CUSTOMER_TYPE_LABELS: Record<string, string> = {
  contractor: '시공사', dealer: '대리점', distributor: '유통사',
  end_user: '최종사용자', trading: '트레이딩', manufacturer: '제조사', other: '기타',
}

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: customer }, { data: deals }, { data: docs }] = await Promise.all([
    supabase.from('admin_contacts').select('*').eq('id', id).single(),
    supabase.from('admin_deals').select('id,title,stage,currency,total_amount,created_at,updated_at').eq('contact_id', id).order('updated_at', { ascending: false }),
    supabase.from('admin_documents').select('id,doc_type,doc_number,title,status,created_at').eq('contact_id', id).order('created_at', { ascending: false }),
  ])

  if (!customer) notFound()

  const activeDealTotal = (deals ?? [])
    .filter(d => !['completed', 'cancelled'].includes(d.stage))
    .reduce((s, d) => s + (d.total_amount ?? 0), 0)

  const isOverdue = customer.next_followup_at && new Date(customer.next_followup_at) < new Date()

  return (
    <div>
      {/* 헤더 */}
      <div className="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-3">
        <div className="d-flex align-items-center gap-3">
          <div className="rounded-circle d-flex align-items-center justify-content-center bg-light flex-shrink-0"
            style={{ width: 56, height: 56 }}>
            <i className="bi bi-building text-body-secondary fs-4" />
          </div>
          <div>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <h1 className="h3 fw-bold text-dark mb-0">{customer.company_name || '(회사명 없음)'}</h1>
              {customer.company_name_en && (
                <span className="text-body-secondary fw-normal" style={{ fontSize: '0.9rem' }}>{customer.company_name_en}</span>
              )}
              <span className={`badge rounded-pill ${TIER_BADGE[customer.tier] ?? 'bg-secondary'}`}>
                {TIER_LABEL[customer.tier] ?? customer.tier}
              </span>
              {customer.is_verified && (
                <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle">
                  <i className="bi bi-check-circle me-1" />인증
                </span>
              )}
            </div>
            <div className="d-flex align-items-center gap-2 mt-1 flex-wrap">
              {customer.country && (
                <span className="text-body-secondary small"><i className="bi bi-geo me-1" />{customer.country}</span>
              )}
              {customer.customer_type && (
                <span className="badge bg-light text-secondary border" style={{ fontSize: '0.72rem' }}>
                  {CUSTOMER_TYPE_LABELS[customer.customer_type] ?? customer.customer_type}
                </span>
              )}
              {customer.business_reg_number && (
                <span className="text-body-secondary small">사업자 {customer.business_reg_number}</span>
              )}
            </div>
          </div>
        </div>
        <div className="d-flex gap-2">
          <Link href={`/admin/customers/${id}/edit`} className="btn btn-outline-primary rounded-pill px-4">
            <i className="bi bi-pencil me-2" />정보 수정
          </Link>
          <Link href="/admin/customers" className="btn btn-light rounded-pill px-3">
            <i className="bi bi-arrow-left me-1" />목록
          </Link>
        </div>
      </div>

      {/* 팔로우업 알림 */}
      {customer.next_followup_at && (
        <div className={`alert ${isOverdue ? 'alert-danger' : 'alert-warning'} rounded-4 d-flex align-items-center gap-2 mb-4`}>
          <i className={`bi ${isOverdue ? 'bi-exclamation-triangle-fill' : 'bi-calendar-check'}`} />
          <span>
            {isOverdue ? '팔로우업 기한 초과: ' : '팔로우업 예정: '}
            <strong>{new Date(customer.next_followup_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
          </span>
        </div>
      )}

      <div className="row g-4">
        {/* 좌측 */}
        <div className="col-lg-4">

          {/* 연락처 정보 */}
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4">
              <h6 className="fw-bold text-dark mb-3">연락처 정보</h6>
              <div className="d-flex flex-column gap-2" style={{ fontSize: '0.875rem' }}>
                {[
                  { icon: 'bi-person', label: '담당자', value: customer.contact_person, sub: customer.contact_title },
                  { icon: 'bi-telephone', label: '연락처', value: customer.phone },
                  { icon: 'bi-printer', label: '팩스', value: customer.fax },
                  { icon: 'bi-envelope', label: '이메일', value: customer.email },
                  { icon: 'bi-globe', label: '웹사이트', value: customer.website },
                  { icon: 'bi-geo-alt', label: '주소', value: customer.address },
                ].map(item => item.value ? (
                  <div key={item.label} className="d-flex align-items-start gap-2">
                    <i className={`bi ${item.icon} text-body-secondary flex-shrink-0 mt-1`} style={{ width: 16 }} />
                    <div>
                      <div className="text-body-secondary" style={{ fontSize: '0.72rem' }}>{item.label}</div>
                      {item.label === '웹사이트' ? (
                        <a href={item.value} target="_blank" rel="noreferrer" className="text-primary">{item.value}</a>
                      ) : (
                        <div className="text-dark">{item.value}{item.sub && <span className="text-body-secondary ms-1 small">({item.sub})</span>}</div>
                      )}
                    </div>
                  </div>
                ) : null)}

                {/* 메신저 & 소셜 */}
                {(customer.whatsapp || customer.wechat || customer.kakao_id || customer.line_id ||
                  customer.linkedin || customer.instagram || customer.facebook || customer.twitter || customer.youtube) && (
                  <div className="mt-2 pt-2 border-top">
                    <div className="text-body-secondary mb-2" style={{ fontSize: '0.72rem', fontWeight: 600 }}>메신저 & 소셜</div>
                    <div className="d-flex flex-wrap gap-2">
                      {customer.whatsapp && (
                        <a href={`https://wa.me/${customer.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
                          className="badge rounded-pill text-decoration-none d-flex align-items-center gap-1 px-2 py-1"
                          style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', fontSize: '0.75rem' }}>
                          <i className="bi bi-whatsapp" />{customer.whatsapp}
                        </a>
                      )}
                      {customer.wechat && (
                        <span className="badge rounded-pill d-flex align-items-center gap-1 px-2 py-1"
                          style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', fontSize: '0.75rem' }}>
                          <i className="bi bi-wechat" />{customer.wechat}
                        </span>
                      )}
                      {customer.kakao_id && (
                        <span className="badge rounded-pill d-flex align-items-center gap-1 px-2 py-1"
                          style={{ background: '#fefce8', color: '#713f12', border: '1px solid #fef08a', fontSize: '0.75rem' }}>
                          <i className="bi bi-chat-fill" />{customer.kakao_id}
                        </span>
                      )}
                      {customer.line_id && (
                        <span className="badge rounded-pill d-flex align-items-center gap-1 px-2 py-1"
                          style={{ background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', fontSize: '0.75rem' }}>
                          <i className="bi bi-chat-square-fill" />{customer.line_id}
                        </span>
                      )}
                      {customer.linkedin && (
                        <a href={customer.linkedin.startsWith('http') ? customer.linkedin : `https://${customer.linkedin}`}
                          target="_blank" rel="noreferrer"
                          className="badge rounded-pill text-decoration-none d-flex align-items-center gap-1 px-2 py-1"
                          style={{ background: '#eff6ff', color: '#0A66C2', border: '1px solid #bfdbfe', fontSize: '0.75rem' }}>
                          <i className="bi bi-linkedin" />LinkedIn
                        </a>
                      )}
                      {customer.instagram && (
                        <a href={`https://instagram.com/${customer.instagram.replace('@', '')}`}
                          target="_blank" rel="noreferrer"
                          className="badge rounded-pill text-decoration-none d-flex align-items-center gap-1 px-2 py-1"
                          style={{ background: '#fdf2f8', color: '#E1306C', border: '1px solid #f9a8d4', fontSize: '0.75rem' }}>
                          <i className="bi bi-instagram" />{customer.instagram}
                        </a>
                      )}
                      {customer.facebook && (
                        <a href={customer.facebook.startsWith('http') ? customer.facebook : `https://${customer.facebook}`}
                          target="_blank" rel="noreferrer"
                          className="badge rounded-pill text-decoration-none d-flex align-items-center gap-1 px-2 py-1"
                          style={{ background: '#eff6ff', color: '#1877F2', border: '1px solid #bfdbfe', fontSize: '0.75rem' }}>
                          <i className="bi bi-facebook" />Facebook
                        </a>
                      )}
                      {customer.twitter && (
                        <a href={`https://x.com/${customer.twitter.replace('@', '')}`}
                          target="_blank" rel="noreferrer"
                          className="badge rounded-pill text-decoration-none d-flex align-items-center gap-1 px-2 py-1"
                          style={{ background: '#f9fafb', color: '#000', border: '1px solid #e5e7eb', fontSize: '0.75rem' }}>
                          <i className="bi bi-twitter-x" />{customer.twitter}
                        </a>
                      )}
                      {customer.youtube && (
                        <a href={customer.youtube.startsWith('http') ? customer.youtube : `https://${customer.youtube}`}
                          target="_blank" rel="noreferrer"
                          className="badge rounded-pill text-decoration-none d-flex align-items-center gap-1 px-2 py-1"
                          style={{ background: '#fff1f2', color: '#FF0000', border: '1px solid #fecdd3', fontSize: '0.75rem' }}>
                          <i className="bi bi-youtube" />YouTube
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 담당자 2 */}
              {customer.contact2_name && (
                <div className="mt-3 pt-3 border-top">
                  <div className="text-body-secondary mb-2" style={{ fontSize: '0.75rem', fontWeight: 600 }}>담당자 2</div>
                  <div className="d-flex flex-column gap-1" style={{ fontSize: '0.85rem' }}>
                    <div className="fw-bold text-dark">
                      {customer.contact2_name}
                      {customer.contact2_title && <span className="text-body-secondary fw-normal ms-1">({customer.contact2_title})</span>}
                    </div>
                    {customer.contact2_phone && <div className="text-body-secondary">{customer.contact2_phone}</div>}
                    {customer.contact2_email && <div className="text-body-secondary">{customer.contact2_email}</div>}
                  </div>
                </div>
              )}

              <div className="text-body-secondary mt-3 pt-3 border-top" style={{ fontSize: '0.72rem' }}>
                등록일 {new Date(customer.created_at).toLocaleDateString('ko-KR')}
                {customer.first_deal_date && (
                  <span className="ms-2">· 최초거래 {new Date(customer.first_deal_date).toLocaleDateString('ko-KR')}</span>
                )}
              </div>
            </div>
          </div>

          {/* 거래 조건 */}
          {(customer.currency || customer.payment_terms || customer.credit_limit != null) && (
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <h6 className="fw-bold text-dark mb-3"><i className="bi bi-currency-exchange me-2 text-purple" style={{ color: '#7C3AED' }} />거래 조건</h6>
                <div className="d-flex flex-column gap-2" style={{ fontSize: '0.875rem' }}>
                  {customer.currency && (
                    <div className="d-flex justify-content-between">
                      <span className="text-body-secondary">선호 통화</span>
                      <span className="fw-bold">{customer.currency}</span>
                    </div>
                  )}
                  {customer.payment_terms && (
                    <div className="d-flex justify-content-between">
                      <span className="text-body-secondary">결제 조건</span>
                      <span className="fw-bold text-end" style={{ maxWidth: 160 }}>{customer.payment_terms}</span>
                    </div>
                  )}
                  {customer.credit_limit != null && (
                    <div className="d-flex justify-content-between">
                      <span className="text-body-secondary">신용 한도</span>
                      <span className="fw-bold">{customer.currency} {Number(customer.credit_limit).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* CRM 메타 */}
          {(customer.acquisition_source || customer.next_followup_at) && (
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <h6 className="fw-bold text-dark mb-3"><i className="bi bi-graph-up-arrow me-2 text-warning" />CRM</h6>
                <div className="d-flex flex-column gap-2" style={{ fontSize: '0.875rem' }}>
                  {customer.acquisition_source && (
                    <div className="d-flex justify-content-between">
                      <span className="text-body-secondary">유입 경로</span>
                      <span className="fw-bold">{customer.acquisition_source}</span>
                    </div>
                  )}
                  {customer.next_followup_at && (
                    <div className="d-flex justify-content-between">
                      <span className="text-body-secondary">팔로우업</span>
                      <span className={`fw-bold ${isOverdue ? 'text-danger' : ''}`}>
                        {new Date(customer.next_followup_at).toLocaleDateString('ko-KR')}
                        {isOverdue && <i className="bi bi-exclamation-circle ms-1" />}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 요약 통계 */}
          <div className="row g-3">
            {[
              { label: '활성 거래', value: (deals ?? []).filter(d => !['completed', 'cancelled'].includes(d.stage)).length + '건', icon: 'bi-diagram-3', color: '#1558D6' },
              { label: '파이프라인', value: `${customer.currency ?? 'KRW'} ${activeDealTotal.toLocaleString()}`, icon: 'bi-graph-up-arrow', color: '#059669' },
              { label: '연결 문서', value: (docs ?? []).length + '건', icon: 'bi-file-earmark-text', color: '#7C3AED' },
              { label: '완료 거래', value: (deals ?? []).filter(d => d.stage === 'completed').length + '건', icon: 'bi-check-circle', color: '#D97706' },
            ].map((s, i) => (
              <div key={i} className="col-6">
                <div className="card border-0 shadow-sm rounded-4">
                  <div className="card-body p-3 text-center">
                    <i className={`bi ${s.icon} mb-1`} style={{ color: s.color, fontSize: '1.2rem' }} />
                    <div className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>{s.value}</div>
                    <div className="text-body-secondary" style={{ fontSize: '0.7rem' }}>{s.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 우측 */}
        <div className="col-lg-8">
          {/* 메모 */}
          {customer.notes && (
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <h6 className="fw-bold text-dark mb-2"><i className="bi bi-sticky me-2" />내부 메모</h6>
                <p className="mb-0 text-body-secondary" style={{ fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>{customer.notes}</p>
              </div>
            </div>
          )}

          {/* 거래 파이프라인 */}
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-header bg-white border-0 pt-4 px-4 pb-2 d-flex justify-content-between align-items-center">
              <h6 className="fw-bold text-dark mb-0">
                <i className="bi bi-diagram-3 text-primary me-2" />거래 파이프라인
                <span className="badge bg-light text-secondary rounded-pill ms-2" style={{ fontSize: '0.65rem' }}>{(deals ?? []).length}건</span>
              </h6>
              <Link href="/admin/deals" className="btn btn-sm btn-outline-primary rounded-pill px-3" style={{ fontSize: '0.78rem' }}>
                전체 보기
              </Link>
            </div>
            <div className="card-body px-4 pb-4 pt-2">
              {(deals ?? []).length === 0 ? (
                <p className="text-body-secondary small text-center py-3 mb-0">연결된 거래 없음</p>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {(deals ?? []).map(deal => (
                    <div key={deal.id} className="d-flex align-items-center gap-3 rounded-3 border p-3"
                      style={{ borderLeft: `3px solid ${STAGE_COLORS[deal.stage] ?? '#6c757d'}` }}>
                      <div className="flex-grow-1 min-width-0">
                        <div className="fw-bold text-dark" style={{ fontSize: '0.875rem' }}>{deal.title}</div>
                        <div className="text-body-secondary" style={{ fontSize: '0.75rem' }}>
                          {new Date(deal.updated_at).toLocaleDateString('ko-KR')} 업데이트
                        </div>
                      </div>
                      {deal.total_amount != null && (
                        <div className="fw-bold" style={{ color: STAGE_COLORS[deal.stage], fontSize: '0.875rem', flexShrink: 0 }}>
                          {deal.currency} {deal.total_amount.toLocaleString()}
                        </div>
                      )}
                      <span className="badge rounded-pill flex-shrink-0"
                        style={{ background: (STAGE_COLORS[deal.stage] ?? '#6c757d') + '20', color: STAGE_COLORS[deal.stage] ?? '#6c757d', fontSize: '0.7rem' }}>
                        {STAGE_LABELS[deal.stage] ?? deal.stage}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 연결 문서 */}
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-header bg-white border-0 pt-4 px-4 pb-2 d-flex justify-content-between align-items-center">
              <h6 className="fw-bold text-dark mb-0">
                <i className="bi bi-file-earmark-text me-2" style={{ color: '#7C3AED' }} />연결된 문서
                <span className="badge bg-light text-secondary rounded-pill ms-2" style={{ fontSize: '0.65rem' }}>{(docs ?? []).length}건</span>
              </h6>
              <Link href="/admin/documents" className="btn btn-sm btn-outline-primary rounded-pill px-3" style={{ fontSize: '0.78rem' }}>
                문서 관리
              </Link>
            </div>
            <div className="card-body p-0">
              {(docs ?? []).length === 0 ? (
                <p className="text-body-secondary small text-center py-4 mb-0">연결된 문서 없음</p>
              ) : (
                <table className="table table-hover mb-0" style={{ fontSize: '0.85rem' }}>
                  <tbody>
                    {(docs ?? []).map(doc => (
                      <tr key={doc.id}>
                        <td className="px-4 py-3">
                          <div className="fw-bold text-primary" style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{doc.doc_number}</div>
                          <div style={{ fontSize: '0.78rem' }}>{doc.title || DOC_TYPE_LABELS[doc.doc_type]}</div>
                        </td>
                        <td className="py-3 text-body-secondary" style={{ fontSize: '0.8rem' }}>
                          {DOC_TYPE_LABELS[doc.doc_type] ?? doc.doc_type}
                        </td>
                        <td className="py-3">
                          <span className={`badge rounded-pill ${doc.status === 'final' ? 'bg-success' : 'bg-secondary'}`} style={{ fontSize: '0.7rem' }}>
                            {doc.status === 'final' ? '확정' : '임시'}
                          </span>
                        </td>
                        <td className="py-3 pe-4 text-body-secondary text-end" style={{ fontSize: '0.78rem' }}>
                          {new Date(doc.created_at).toLocaleDateString('ko-KR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
