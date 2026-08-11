import { createClient } from '@/lib/supabase/server'
import { DOC_TYPE_LABELS, DOC_TYPE_COLORS, DOC_TYPE_ICONS } from '@/lib/admin-document-types'
import type { DocType } from '@/lib/admin-document-types'
import { WorldClockWidget, ExchangeRateWidget, FxCalculatorWidget } from '@/components/admin/DashboardWidgets'

const DOC_TYPES: DocType[] = ['quotation', 'purchase_order', 'receipt', 'invoice', 'invoice_packing_list', 'sales_contract']

export default async function AdminDashboard() {
  const supabase = await createClient()

  const sixMonthsAgo = new Date(); sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  const threeDaysAgo = new Date(); threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
  const nowIso = new Date().toISOString()

  const [
    { count: productCount },
    { count: customerCount },
    { count: quoteCount },
    { count: docCount },
    { data: recentQuotes },
    { data: recentCustomers },
    { data: recentDocs },
    { data: allDocs },
    { count: pendingCount },
    { data: chartQuotes },
    { data: recentDeals },
    { data: finalDocs },
    { data: activeDeals },
    { data: overdueFollowups },
    { data: oldPendingQuotes },
    { data: contactCountries },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('admin_contacts').select('*', { count: 'exact', head: true }),
    supabase.from('quotes').select('*', { count: 'exact', head: true }),
    supabase.from('admin_documents').select('*', { count: 'exact', head: true }),
    supabase.from('quotes').select('quote_number,customer_company,customer_name,total,created_at,admin_status').order('created_at', { ascending: false }).limit(5),
    supabase.from('admin_contacts').select('company_name,contact_person,tier,created_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('admin_documents').select('id,doc_type,doc_number,title,status,created_at').order('created_at', { ascending: false }).limit(6),
    supabase.from('admin_documents').select('doc_type,status'),
    supabase.from('quotes').select('*', { count: 'exact', head: true }).eq('admin_status', 'pending'),
    supabase.from('quotes').select('created_at,total').gte('created_at', sixMonthsAgo.toISOString()).order('created_at'),
    supabase.from('admin_deals').select('id,title,stage,updated_at').order('updated_at', { ascending: false }).limit(5),
    supabase.from('admin_documents').select('id,doc_type,doc_number,title,updated_at').eq('status', 'final').order('updated_at', { ascending: false }).limit(5),
    supabase.from('admin_deals').select('stage,currency,total_amount').not('stage', 'in', '("completed","cancelled")'),
    supabase.from('admin_contacts').select('id,company_name,next_followup_at,country').lt('next_followup_at', nowIso).not('next_followup_at', 'is', null).order('next_followup_at').limit(5),
    supabase.from('quotes').select('quote_number,customer_company,total,created_at').eq('admin_status', 'pending').lt('created_at', threeDaysAgo.toISOString()).order('created_at').limit(5),
    supabase.from('admin_contacts').select('country').not('country', 'is', null),
  ])

  const totalRevenue = (recentQuotes || []).reduce((s: number, q: any) => s + Number(q.total || 0), 0)
  const finalDocCount = (allDocs || []).filter((d: any) => d.status === 'final').length
  const draftDocCount = (allDocs || []).filter((d: any) => d.status === 'draft').length

  // Monthly chart data: last 6 months
  const monthlyData: { label: string; total: number; count: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(); d.setMonth(d.getMonth() - i)
    const label = `${d.getMonth() + 1}월`
    const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const items = (chartQuotes || []).filter((q: any) => q.created_at?.startsWith(ym))
    monthlyData.push({ label, total: items.reduce((s: number, q: any) => s + Number(q.total || 0), 0), count: items.length })
  }
  const maxTotal = Math.max(...monthlyData.map(m => m.total), 1)

  // Activity feed: merge recent events by date
  const activityItems: { icon: string; color: string; text: string; sub: string; date: string }[] = [
    ...(recentQuotes || []).slice(0, 3).map((q: any) => ({
      icon: 'bi-file-earmark-text-fill', color: '#D97706',
      text: `견적 접수: ${q.customer_company || q.customer_name || '고객'} — ${Number(q.total).toLocaleString('ko-KR')}원`,
      sub: q.quote_number ?? '',
      date: q.created_at,
    })),
    ...(recentCustomers || []).slice(0, 2).map((c: any) => ({
      icon: 'bi-person-plus-fill', color: '#059669',
      text: `고객 등록: ${c.company_name || '(미입력)'}`,
      sub: c.contact_person ?? '',
      date: c.created_at,
    })),
    ...(recentDeals || []).slice(0, 3).map((dl: any) => ({
      icon: 'bi-kanban-fill', color: '#7C3AED',
      text: `딜 업데이트: ${dl.title}`,
      sub: dl.stage,
      date: dl.updated_at,
    })),
    ...(finalDocs || []).slice(0, 3).map((fd: any) => ({
      icon: 'bi-patch-check-fill', color: '#1558D6',
      text: `문서 확정: ${fd.title || fd.doc_number}`,
      sub: DOC_TYPE_LABELS[fd.doc_type as DocType] ?? fd.doc_type,
      date: fd.updated_at,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10)

  // 파이프라인 단계별 집계
  const PIPELINE_STAGES = [
    { key: 'lead',           label: '리드',     color: '#6c757d' },
    { key: 'quotation',      label: '견적',     color: '#D97706' },
    { key: 'purchase_order', label: '발주',     color: '#1558D6' },
    { key: 'invoice',        label: '인보이스', color: '#7C3AED' },
    { key: 'contract',       label: '계약',     color: '#0369a1' },
  ]
  const pipelineByStage = PIPELINE_STAGES.map(s => ({
    ...s,
    count: (activeDeals || []).filter((d: any) => d.stage === s.key).length,
    totalKrw: (activeDeals || []).filter((d: any) => d.stage === s.key)
      .reduce((sum: number, d: any) => sum + Number(d.total_amount || 0), 0),
  }))
  const pipelineTotal = (activeDeals || []).reduce((s: number, d: any) => s + Number(d.total_amount || 0), 0)
  const pipelineCount = (activeDeals || []).length

  // 국가별 거래선 분포
  const countryMap: Record<string, number> = {}
  for (const c of (contactCountries || [])) {
    const country = (c as any).country || '미설정'
    countryMap[country] = (countryMap[country] || 0) + 1
  }
  const countryDist = Object.entries(countryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
  const maxCountryCount = Math.max(...countryDist.map(([, n]) => n), 1)

  const docTypeCounts = DOC_TYPES.map(type => ({
    type,
    count: (allDocs || []).filter((d: any) => d.doc_type === type).length,
  }))

  const TIER_BADGE: Record<string, string> = {
    platinum: 'bg-primary', gold: 'bg-warning text-dark',
    silver: 'bg-info text-dark', standard: 'bg-secondary',
  }
  const TIER_LABEL: Record<string, string> = {
    platinum: '플래티넘', gold: '골드', silver: '실버', standard: '일반',
  }
  const QUOTE_STATUS_BADGE: Record<string, string> = {
    pending: 'bg-warning text-dark', reviewing: 'bg-info text-dark',
    approved: 'bg-success', rejected: 'bg-danger',
  }
  const QUOTE_STATUS_LABEL: Record<string, string> = {
    pending: '대기', reviewing: '검토중', approved: '승인', rejected: '반려',
  }

  const topStats = [
    { icon: 'bi-box-seam', label: '활성 제품', value: productCount ?? 0, color: '#1558D6', bg: '#EFF6FF', href: '/admin/products' },
    { icon: 'bi-people-fill', label: '등록 고객', value: customerCount ?? 0, color: '#059669', bg: '#D1FAE5', href: '/admin/customers' },
    { icon: 'bi-file-earmark-text-fill', label: '견적 건수', value: quoteCount ?? 0, color: '#D97706', bg: '#FEF3C7', href: '/admin/quotes' },
    { icon: 'bi-folder2-open', label: '문서', value: docCount ?? 0, color: '#7C3AED', bg: '#F5F3FF', href: '/admin/documents' },
  ]

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">대시보드</h1>
          <p className="text-body-secondary mb-0">한국건설트레이딩 관리 현황</p>
        </div>
        {(pendingCount ?? 0) > 0 && (
          <a href="/admin/quotes" className="btn btn-warning rounded-pill px-4 d-flex align-items-center gap-2">
            <i className="bi bi-bell-fill" />
            <span>처리 대기 견적 <strong>{pendingCount}건</strong></span>
          </a>
        )}
      </div>

      {/* 세계 시각 + 환율 + 계산기 */}
      <WorldClockWidget />
      <ExchangeRateWidget />
      <FxCalculatorWidget />

      {/* 상단 통계 카드 */}
      <div className="row g-4 mb-4">
        {topStats.map((s, i) => (
          <div key={i} className="col-sm-6 col-xl-3">
            <a href={s.href} className="card border-0 shadow-sm rounded-4 h-100 text-decoration-none">
              <div className="card-body p-4 d-flex align-items-center gap-3">
                <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: 52, height: 52, background: s.bg }}>
                  <i className={`bi ${s.icon} fs-4`} style={{ color: s.color }} />
                </div>
                <div>
                  <div className="text-body-secondary small">{s.label}</div>
                  <div className="fw-bold fs-5 text-dark">{s.value.toLocaleString()}</div>
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>

      {/* 파이프라인 현황 */}
      <div className="card border-0 shadow-sm rounded-4 mb-4 p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <i className="bi bi-diagram-3 text-primary" />
            영업 파이프라인
            <span className="badge bg-light text-secondary border rounded-pill ms-1" style={{ fontSize: '0.65rem' }}>{pipelineCount}건 활성</span>
          </h6>
          <div className="text-body-secondary small">
            총 파이프라인 <strong className="text-dark">{pipelineTotal.toLocaleString('ko-KR')}원</strong>
          </div>
        </div>
        {/* 퍼널 진행 바 */}
        <div className="d-flex gap-1 mb-3" style={{ height: 6 }}>
          {pipelineByStage.map(s => (
            <div key={s.key} style={{
              flex: Math.max(s.count, 0.3), background: s.count > 0 ? s.color : '#e9ecef',
              borderRadius: 4, opacity: s.count > 0 ? 1 : 0.3,
              transition: 'flex 0.3s',
            }} title={`${s.label}: ${s.count}건`} />
          ))}
        </div>
        <div className="row g-3">
          {pipelineByStage.map(s => (
            <div key={s.key} className="col-6 col-md-4 col-xl-2-4">
              <a href="/admin/deals" className="text-decoration-none">
                <div className="rounded-3 border p-3" style={{
                  borderLeft: `3px solid ${s.color}`,
                  background: s.count > 0 ? s.color + '08' : '#f8f9fa',
                  minWidth: 0,
                }}>
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span className="fw-bold" style={{ fontSize: '0.78rem', color: s.color }}>{s.label}</span>
                    <span className="badge rounded-pill" style={{ background: s.color + '20', color: s.color, fontSize: '0.62rem' }}>{s.count}건</span>
                  </div>
                  <div className="fw-bold text-dark" style={{ fontSize: '1rem' }}>
                    {s.totalKrw >= 1000000
                      ? (s.totalKrw / 1000000).toFixed(1) + 'M'
                      : s.totalKrw > 0 ? (s.totalKrw / 1000).toFixed(0) + 'K' : '-'}
                    {s.totalKrw > 0 && <span className="text-body-secondary fw-normal ms-1" style={{ fontSize: '0.7rem' }}>원</span>}
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* 문서 현황 */}
      <div className="card border-0 shadow-sm rounded-4 mb-4 p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-bold text-dark mb-0">문서 현황</h6>
          <div className="d-flex gap-3 text-body-secondary small">
            <span><span className="badge bg-success rounded-pill me-1">{finalDocCount}</span>확정</span>
            <span><span className="badge bg-secondary rounded-pill me-1">{draftDocCount}</span>임시저장</span>
          </div>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          {docTypeCounts.map(({ type, count }) => (
            <a key={type} href="/admin/documents"
              className="text-decoration-none d-flex align-items-center gap-2 rounded-3 px-3 py-2 border"
              style={{ background: count > 0 ? DOC_TYPE_COLORS[type] + '0d' : '#f8f9fa', minWidth: 120 }}>
              <i className={`bi ${DOC_TYPE_ICONS[type]}`} style={{ color: DOC_TYPE_COLORS[type], fontSize: '1rem' }} />
              <div>
                <div className="fw-bold text-dark" style={{ fontSize: '1.1rem', lineHeight: 1 }}>{count}</div>
                <div style={{ fontSize: '0.72rem', color: DOC_TYPE_COLORS[type] }}>{DOC_TYPE_LABELS[type]}</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="row g-4">
        {/* 최근 견적 */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-header bg-white border-0 pt-4 px-4 pb-0 d-flex justify-content-between align-items-center">
              <h6 className="fw-bold text-dark mb-0">최근 견적</h6>
              <a href="/admin/quotes" className="btn btn-sm btn-outline-primary rounded-pill px-3">전체 보기</a>
            </div>
            <div className="card-body p-0">
              <table className="table table-hover mb-0" style={{ fontSize: '0.85rem' }}>
                <tbody>
                  {(recentQuotes || []).map((q: any, i: number) => (
                    <tr key={i}>
                      <td className="px-4 py-3">
                        <div className="fw-bold text-primary">{q.quote_number}</div>
                        <div className="text-body-secondary" style={{ fontSize: '0.75rem' }}>
                          {new Date(q.created_at).toLocaleDateString('ko-KR')}
                        </div>
                      </td>
                      <td className="py-3">{q.customer_company || q.customer_name || '-'}</td>
                      <td className="py-3 text-end fw-bold">{Number(q.total).toLocaleString('ko-KR')}원</td>
                      <td className="py-3 text-end pe-4">
                        <span className={`badge rounded-pill ${QUOTE_STATUS_BADGE[q.admin_status] ?? 'bg-secondary'}`} style={{ fontSize: '0.7rem' }}>
                          {QUOTE_STATUS_LABEL[q.admin_status] ?? q.admin_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {(!recentQuotes || recentQuotes.length === 0) && (
                    <tr><td colSpan={4} className="px-4 py-4 text-center text-body-secondary">견적 없음</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 최근 문서 */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-header bg-white border-0 pt-4 px-4 pb-0 d-flex justify-content-between align-items-center">
              <h6 className="fw-bold text-dark mb-0">최근 문서</h6>
              <a href="/admin/documents" className="btn btn-sm btn-outline-primary rounded-pill px-3">전체 보기</a>
            </div>
            <div className="card-body p-0">
              <ul className="list-group list-group-flush">
                {(recentDocs || []).map((d: any) => (
                  <li key={d.id} className="list-group-item px-4 py-3 d-flex align-items-center justify-content-between gap-2">
                    <div className="d-flex align-items-center gap-2">
                      <i className={`bi ${DOC_TYPE_ICONS[d.doc_type as DocType]}`}
                        style={{ color: DOC_TYPE_COLORS[d.doc_type as DocType], fontSize: '1rem', width: 20 }} />
                      <div>
                        <div className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>{d.title || d.doc_number}</div>
                        <div className="text-body-secondary" style={{ fontSize: '0.72rem' }}>
                          {new Date(d.created_at).toLocaleDateString('ko-KR')} · {DOC_TYPE_LABELS[d.doc_type as DocType]}
                        </div>
                      </div>
                    </div>
                    <span className={`badge rounded-pill flex-shrink-0 ${d.status === 'final' ? 'bg-success' : 'bg-secondary'}`} style={{ fontSize: '0.65rem' }}>
                      {d.status === 'final' ? '확정' : '임시'}
                    </span>
                  </li>
                ))}
                {(!recentDocs || recentDocs.length === 0) && (
                  <li className="list-group-item px-4 py-4 text-center text-body-secondary">문서 없음</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* 최근 등록 고객 */}
        <div className="col-12">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-header bg-white border-0 pt-4 px-4 pb-0 d-flex justify-content-between align-items-center">
              <h6 className="fw-bold text-dark mb-0">최근 등록 고객</h6>
              <a href="/admin/customers" className="btn btn-sm btn-outline-primary rounded-pill px-3">전체 보기</a>
            </div>
            <div className="card-body p-0">
              <div className="d-flex flex-wrap gap-3 px-4 py-3">
                {(recentCustomers || []).map((c: any, i: number) => (
                  <div key={i} className="d-flex align-items-center gap-2 rounded-3 border px-3 py-2" style={{ minWidth: 180 }}>
                    <div className="rounded-circle d-flex align-items-center justify-content-center bg-light flex-shrink-0"
                      style={{ width: 36, height: 36 }}>
                      <i className="bi bi-building text-body-secondary" />
                    </div>
                    <div>
                      <div className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>{c.company_name || '(미입력)'}</div>
                      <div className="d-flex align-items-center gap-1">
                        <span className="text-body-secondary" style={{ fontSize: '0.72rem' }}>{c.contact_person || '-'}</span>
                        <span className={`badge rounded-pill ${TIER_BADGE[c.tier] ?? 'bg-secondary'}`} style={{ fontSize: '0.62rem' }}>
                          {TIER_LABEL[c.tier] ?? c.tier}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {(!recentCustomers || recentCustomers.length === 0) && (
                  <p className="text-body-secondary py-2 mb-0">고객 없음</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 월별 견적 차트 */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
              <h6 className="fw-bold text-dark mb-0">월별 견적 현황 (최근 6개월)</h6>
            </div>
            <div className="card-body px-4 pb-4 pt-3">
              <svg width="100%" height="160" viewBox={`0 0 ${monthlyData.length * 80} 160`} preserveAspectRatio="xMidYMid meet">
                {monthlyData.map((m, i) => {
                  const barH = maxTotal > 0 ? Math.max(4, Math.round((m.total / maxTotal) * 110)) : 4
                  const x = i * 80 + 10
                  const y = 120 - barH
                  return (
                    <g key={i}>
                      <rect x={x} y={y} width={52} height={barH}
                        rx={6} fill={i === monthlyData.length - 1 ? '#1558D6' : '#BFDBFE'} />
                      <text x={x + 26} y={y - 6} textAnchor="middle" fontSize="10" fill="#374151" fontWeight="600">
                        {m.count > 0 ? m.count + '건' : ''}
                      </text>
                      <text x={x + 26} y="138" textAnchor="middle" fontSize="11" fill="#6B7280">{m.label}</text>
                      {m.total > 0 && (
                        <text x={x + 26} y="152" textAnchor="middle" fontSize="9" fill="#9CA3AF">
                          {m.total >= 1000000 ? (m.total / 1000000).toFixed(0) + 'M' : (m.total / 1000).toFixed(0) + 'K'}
                        </text>
                      )}
                    </g>
                  )
                })}
              </svg>
              <div className="d-flex align-items-center gap-3 mt-2" style={{ fontSize: '0.78rem', color: '#6B7280' }}>
                <span className="d-flex align-items-center gap-1">
                  <span style={{ width: 12, height: 12, background: '#1558D6', borderRadius: 3, display: 'inline-block' }} />
                  이번 달
                </span>
                <span className="d-flex align-items-center gap-1">
                  <span style={{ width: 12, height: 12, background: '#BFDBFE', borderRadius: 3, display: 'inline-block' }} />
                  이전 달
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 활동 피드 */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
              <h6 className="fw-bold text-dark mb-0">최근 활동</h6>
            </div>
            <div className="card-body px-4 pb-4 pt-3">
              {activityItems.length === 0 ? (
                <p className="text-body-secondary text-center py-3 mb-0" style={{ fontSize: '0.85rem' }}>활동 없음</p>
              ) : (
                <div style={{ position: 'relative' }}>
                  {activityItems.map((item, i) => (
                    <div key={i} className="d-flex gap-3" style={{ marginBottom: i < activityItems.length - 1 ? 16 : 0 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                        <div className="rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: 28, height: 28, background: item.color + '1a', flexShrink: 0 }}>
                          <i className={`bi ${item.icon}`} style={{ color: item.color, fontSize: '0.7rem' }} />
                        </div>
                        {i < activityItems.length - 1 && (
                          <div style={{ width: 1, flex: 1, minHeight: 12, background: '#E5E7EB', marginTop: 3 }} />
                        )}
                      </div>
                      <div style={{ paddingTop: 3, minWidth: 0 }}>
                        <div className="text-dark" style={{ fontSize: '0.8rem', lineHeight: 1.4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.text}</div>
                        <div className="d-flex gap-2 align-items-center mt-1">
                          {item.sub && <span className="text-body-secondary" style={{ fontSize: '0.7rem' }}>{item.sub}</span>}
                          <span className="text-body-secondary" style={{ fontSize: '0.68rem' }}>
                            {new Date(item.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* 무역 알림 */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-header bg-white border-0 pt-4 px-4 pb-0 d-flex justify-content-between align-items-center">
              <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                <i className="bi bi-bell-fill text-warning" />무역 알림
              </h6>
              {((overdueFollowups || []).length + (oldPendingQuotes || []).length) > 0 && (
                <span className="badge bg-danger rounded-pill" style={{ fontSize: '0.7rem' }}>
                  {(overdueFollowups || []).length + (oldPendingQuotes || []).length}건
                </span>
              )}
            </div>
            <div className="card-body px-4 pb-4 pt-3">
              {(overdueFollowups || []).length === 0 && (oldPendingQuotes || []).length === 0 ? (
                <div className="text-center py-4 text-body-secondary" style={{ fontSize: '0.875rem' }}>
                  <i className="bi bi-check-circle-fill text-success d-block mb-2 fs-4" />
                  처리 대기 항목 없음
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {(overdueFollowups || []).map((c: any) => {
                    const days = Math.floor((Date.now() - new Date(c.next_followup_at).getTime()) / 86400000)
                    return (
                      <a key={c.id} href={`/admin/customers/${c.id}`}
                        className="d-flex align-items-center gap-3 rounded-3 border px-3 py-2 text-decoration-none"
                        style={{ borderLeft: '3px solid #F59E0B', background: '#FFF7ED' }}>
                        <i className="bi bi-person-exclamation text-warning flex-shrink-0" />
                        <div className="flex-grow-1 min-width-0">
                          <div className="fw-bold text-dark" style={{ fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {c.company_name || '(미입력)'}
                          </div>
                          <div className="text-warning" style={{ fontSize: '0.72rem' }}>팔로우업 {days}일 초과</div>
                        </div>
                        <i className="bi bi-chevron-right text-body-secondary flex-shrink-0" style={{ fontSize: '0.75rem' }} />
                      </a>
                    )
                  })}
                  {(oldPendingQuotes || []).map((q: any) => {
                    const days = Math.floor((Date.now() - new Date(q.created_at).getTime()) / 86400000)
                    return (
                      <a key={q.quote_number} href="/admin/quotes"
                        className="d-flex align-items-center gap-3 rounded-3 border px-3 py-2 text-decoration-none"
                        style={{ borderLeft: '3px solid #EF4444', background: '#FFF1F2' }}>
                        <i className="bi bi-file-earmark-text-fill text-danger flex-shrink-0" />
                        <div className="flex-grow-1 min-width-0">
                          <div className="fw-bold text-dark" style={{ fontSize: '0.82rem' }}>
                            {q.customer_company || '고객'} — {Number(q.total).toLocaleString('ko-KR')}원
                          </div>
                          <div className="text-danger" style={{ fontSize: '0.72rem' }}>견적 대기 {days}일 ({q.quote_number})</div>
                        </div>
                        <i className="bi bi-chevron-right text-body-secondary flex-shrink-0" style={{ fontSize: '0.75rem' }} />
                      </a>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 국가별 거래선 분포 */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-header bg-white border-0 pt-4 px-4 pb-0 d-flex justify-content-between align-items-center">
              <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                <i className="bi bi-globe-asia-australia text-primary" />국가별 거래선 분포
              </h6>
              <span className="text-body-secondary small">총 {(contactCountries || []).length}개사</span>
            </div>
            <div className="card-body px-4 pb-4 pt-3">
              {countryDist.length === 0 ? (
                <p className="text-body-secondary text-center py-3 mb-0" style={{ fontSize: '0.875rem' }}>데이터 없음</p>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {countryDist.map(([country, count]) => {
                    const pct = Math.round((count / maxCountryCount) * 100)
                    const isKorea = country === '대한민국'
                    return (
                      <div key={country} className="d-flex align-items-center gap-3">
                        <div className="text-dark fw-bold flex-shrink-0" style={{ width: 90, fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {country}
                        </div>
                        <div className="flex-grow-1 rounded-pill overflow-hidden" style={{ height: 10, background: '#f3f4f6' }}>
                          <div style={{
                            width: `${pct}%`, height: '100%',
                            background: isKorea ? '#1558D6' : '#60A5FA',
                            borderRadius: 99, transition: 'width 0.5s',
                          }} />
                        </div>
                        <div className="text-body-secondary flex-shrink-0" style={{ width: 36, fontSize: '0.78rem', textAlign: 'right' }}>
                          {count}개
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
