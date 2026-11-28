'use client'

import { useState, useEffect, useRef, useId, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import type { TdsRequest, TdsRequestStatus } from '@/lib/tds-admin'
import { bySlug } from '@/lib/products-catalog'
import {
  fetchTdsRequestsAction,
  approveTdsRequestAction,
  rejectTdsRequestAction,
} from '@/app/admin/(protected)/tds-requests/actions'

const STATUS_TABS: { key: TdsRequestStatus; label: string }[] = [
  { key: 'pending',  label: '대기' },
  { key: 'sent',     label: '발송완료' },
  { key: 'rejected', label: '반려' },
]

const STATUS_META: Record<TdsRequestStatus, { label: string; bg: string; text: string; border: string; icon: string }> = {
  pending:  { label: '대기',     bg: '#FEF3C7', text: '#92400E', border: '#FCD34D', icon: 'bi-hourglass-split' },
  sent:     { label: '발송완료', bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7', icon: 'bi-send-check-fill' },
  rejected: { label: '반려',     bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5', icon: 'bi-x-circle-fill' },
}

function formatDateTime(iso: string | null | undefined) {
  if (!iso) return '-'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '-'
  return d.toLocaleString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

function isExpired(iso: string | null | undefined): boolean {
  if (!iso) return false
  const t = new Date(iso).getTime()
  return !Number.isNaN(t) && t < Date.now()
}

interface ActionDialogState {
  mode: 'approve' | 'reject'
  request: TdsRequest
  isReissue: boolean
}

interface IssuedLinkNotice {
  requestId: string
  productName: string
  requesterName: string
  requesterEmail: string
  emailed: boolean
  link?: string
}

export default function TdsRequestsManager({
  initialRequests,
  initialTab = 'pending',
  initialError = null,
}: {
  initialRequests: TdsRequest[]
  initialTab?: TdsRequestStatus
  initialError?: string | null
}) {
  const router = useRouter()
  const captionId = useId()
  const searchInputId = useId()
  const modalTitleId = useId()
  const modalNoteId = useId()
  const linkInputId = useId()

  const [requests, setRequests] = useState<TdsRequest[]>(initialRequests)
  const [activeTab, setActiveTab] = useState<TdsRequestStatus>(initialTab)
  const [search, setSearch] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(initialError)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  // Result notice after approve (especially when emailed=false)
  const [issuedNotice, setIssuedNotice] = useState<IssuedLinkNotice | null>(null)
  const [copied, setCopied] = useState(false)

  // Modal state
  const [dialogState, setDialogState] = useState<ActionDialogState | null>(null)
  const [adminNote, setAdminNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const modalRef = useRef<HTMLDialogElement | null>(null)
  const linkInputRef = useRef<HTMLInputElement | null>(null)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  // Sync <dialog> open/close with React state
  useEffect(() => {
    const el = modalRef.current
    if (!el) return
    if (dialogState) {
      if (!el.open) el.showModal()
    } else if (el.open) {
      el.close()
    }
  }, [dialogState])

  async function refreshRequests() {
    setRefreshing(true)
    setErrorMsg(null)
    try {
      const res = await fetchTdsRequestsAction()
      if (res.ok) {
        setRequests(res.requests)
      } else {
        setErrorMsg(res.error)
      }
    } catch {
      setErrorMsg('TDS 요청 목록을 새로고침하지 못했습니다.')
    } finally {
      setRefreshing(false)
    }
  }

  function openActionDialog(request: TdsRequest, mode: 'approve' | 'reject') {
    setAdminNote(request.admin_note ?? '')
    setDialogState({
      mode,
      request,
      isReissue: mode === 'approve' && request.status !== 'pending',
    })
  }

  async function handleSubmitAction(e: React.FormEvent) {
    e.preventDefault()
    if (!dialogState) return
    setSubmitting(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    const { mode, request, isReissue } = dialogState
    const prodName = bySlug(request.product_slug)?.name ?? request.product_slug

    try {
      if (mode === 'approve') {
        const res = await approveTdsRequestAction(request.id, adminNote)
        if (res.ok) {
          setRequests(prev =>
            prev.map(r =>
              r.id === request.id
                ? {
                    ...r,
                    status: 'sent',
                    admin_note: adminNote.trim() || null,
                    processed_at: new Date().toISOString(),
                  }
                : r,
            ),
          )
          setDialogState(null)
          setCopied(false)

          if (!res.emailed) {
            setIssuedNotice({
              requestId: request.id,
              productName: prodName,
              requesterName: request.name,
              requesterEmail: request.email,
              emailed: false,
              link: res.link,
            })
          } else {
            setIssuedNotice(
              res.link
                ? {
                    requestId: request.id,
                    productName: prodName,
                    requesterName: request.name,
                    requesterEmail: request.email,
                    emailed: true,
                    link: res.link,
                  }
                : null,
            )
            setSuccessMsg(
              isReissue
                ? `'${prodName}' 새 1회성 다운로드 링크를 발급하여 요청자 메일로 발송했습니다.`
                : `'${prodName}' 요청을 승인하고 요청자 메일로 다운로드 링크를 발송했습니다.`,
            )
          }

          router.refresh()
          void refreshRequests()
        } else {
          setErrorMsg(res.error ?? 'TDS 요청 승인 처리에 실패했습니다.')
          setDialogState(null)
        }
      } else {
        const res = await rejectTdsRequestAction(request.id, adminNote)
        if (res.ok) {
          setRequests(prev =>
            prev.map(r =>
              r.id === request.id
                ? {
                    ...r,
                    status: 'rejected',
                    admin_note: adminNote.trim() || null,
                    processed_at: new Date().toISOString(),
                  }
                : r,
            ),
          )
          setDialogState(null)
          setSuccessMsg(`'${prodName}' 요청을 반려 처리했습니다.`)
          router.refresh()
          void refreshRequests()
        } else {
          setErrorMsg(res.error ?? 'TDS 요청 반려 처리에 실패했습니다.')
          setDialogState(null)
        }
      }
    } catch {
      setErrorMsg('요청 처리 중 예기치 않은 오류가 발생했습니다.')
      setDialogState(null)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleCopyLink(link: string) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(link)
      } else if (linkInputRef.current) {
        linkInputRef.current.select()
        document.execCommand('copy')
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      if (linkInputRef.current) {
        linkInputRef.current.focus()
        linkInputRef.current.select()
      }
    }
  }

  const counts = useMemo(() => {
    const map: Record<TdsRequestStatus, number> = { pending: 0, sent: 0, rejected: 0 }
    for (const r of requests) {
      if (r.status in map) map[r.status] += 1
    }
    return map
  }, [requests])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return requests
      .filter(r => {
        if (r.status !== activeTab) return false
        if (!q) return true
        const prodName = bySlug(r.product_slug)?.name ?? ''
        return (
          r.product_slug.toLowerCase().includes(q) ||
          prodName.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q) ||
          (r.company ?? '').toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          (r.phone ?? '').toLowerCase().includes(q) ||
          (r.message ?? '').toLowerCase().includes(q)
        )
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }, [requests, activeTab, search])

  function handleTabKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, idx: number) {
    let next = idx
    if (e.key === 'ArrowRight') next = (idx + 1) % STATUS_TABS.length
    else if (e.key === 'ArrowLeft') next = (idx - 1 + STATUS_TABS.length) % STATUS_TABS.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = STATUS_TABS.length - 1
    else return

    e.preventDefault()
    const tab = STATUS_TABS[next]
    setActiveTab(tab.key)
    const btn = tabRefs.current[next]
    btn?.focus()
    btn?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }

  return (
    <div>
      <style>{`
        .kct-tablist {
          display: flex;
          flex-wrap: nowrap;
          overflow-x: auto;
          gap: 0.25rem;
          border-bottom: 1px solid #dee2e6;
          scrollbar-width: none;
        }
        .kct-tablist::-webkit-scrollbar { display: none; }
        .kct-tab {
          position: relative;
          flex: none;
          background: transparent;
          border: 0;
          padding: 0.65rem 1rem;
          font-size: 0.88rem;
          color: #495057;
          white-space: nowrap;
          cursor: pointer;
        }
        .kct-tab:hover { color: #1558D6; }
        .kct-tab[aria-selected="true"] {
          color: #1558D6;
          font-weight: 600;
        }
        .kct-tab[aria-selected="true"]::after {
          content: "";
          position: absolute;
          inset: auto 0 0;
          border-block-end: 3px solid #1558D6;
        }
        .kct-tds-table-wrap {
          overflow-x: auto;
          max-inline-size: 100%;
          container-type: inline-size;
        }
        .kct-tds-table {
          border-collapse: separate;
          border-spacing: 0;
          width: 100%;
        }
        @container (width < 820px) {
          .kct-tds-table,
          .kct-tds-table tbody,
          .kct-tds-table tr,
          .kct-tds-table th,
          .kct-tds-table td {
            display: block;
            width: 100%;
          }
          .kct-tds-table thead {
            display: none;
          }
          .kct-tds-table tbody tr {
            border-bottom: 1px solid #dee2e6;
            padding: 0.75rem 1rem;
          }
          .kct-tds-table tbody th,
          .kct-tds-table tbody td {
            border: 0 !important;
            padding: 0.25rem 0 !important;
            text-align: left !important;
          }
          .kct-tds-table tbody td[data-label]::before {
            content: attr(data-label) ": ";
            font-weight: 600;
            color: #6c757d;
            margin-inline-end: 0.35rem;
          }
        }
        dialog.kct-tds-modal {
          border: 0;
          border-radius: 1rem;
          padding: 0;
          margin: auto;
          width: min(520px, calc(100vw - 2rem));
          max-width: calc(100vw - 2rem);
          background: #fff;
          box-shadow: 0 20px 50px rgba(15, 23, 42, 0.22);
        }
        dialog.kct-tds-modal[open] {
          display: block;
        }
        dialog.kct-tds-modal:modal {
          overscroll-behavior: contain;
        }
        dialog.kct-tds-modal::backdrop {
          overflow: hidden;
          overscroll-behavior: contain;
          background: rgba(15, 23, 42, 0.45);
        }
      `}</style>

      {/* 헤더 */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">TDS 요청 관리</h1>
          <p className="text-body-secondary mb-0 small">
            비회원·미승인 사용자의 TDS 다운로드 요청을 검토하고 기한부 1회성 다운로드 링크를 발급합니다 (총 {requests.length}건)
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary rounded-pill px-3"
            onClick={refreshRequests}
            disabled={refreshing}
          >
            <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
            {refreshing ? '불러오는 중...' : '새로고침'}
          </button>
        </div>
      </div>

      {/* 메일 미설정 경고 + 수동 복사 링크 배너 (emailed === false 일 때 강조 표시) */}
      {issuedNotice && !issuedNotice.emailed && (
        <div
          className="alert alert-warning border border-warning rounded-4 p-4 mb-4 shadow-sm"
          role="alert"
        >
          <div className="d-flex align-items-start justify-content-between gap-3 mb-2">
            <div className="d-flex align-items-center gap-2 fw-bold text-dark">
              <i className="bi bi-envelope-exclamation-fill text-warning fs-5" aria-hidden="true" />
              <span>메일 발송 미설정 — 1회성 다운로드 링크를 직접 전달해 주세요</span>
            </div>
            <button
              type="button"
              className="btn-close"
              aria-label="링크 안내 배너 닫기"
              onClick={() => setIssuedNotice(null)}
            />
          </div>
          <p className="small text-dark mb-3">
            요청은 승인되었으나 메일 발송 환경변수(<code>RESEND_API_KEY</code>)가 설정되지 않았거나 발송을 건너뛰어 자동 메일이 전송되지 않았습니다.
            아래 링크를 복사해 <strong>{issuedNotice.requesterName}</strong> ({issuedNotice.requesterEmail})님께 전달해 주세요.
          </p>

          {issuedNotice.link ? (
            <div className="d-flex flex-column gap-2">
              <label htmlFor={linkInputId} className="form-label small fw-semibold mb-0 text-dark">
                발급된 1회성 다운로드 링크 ({issuedNotice.productName})
              </label>
              <div className="input-group input-group-sm">
                <input
                  id={linkInputId}
                  ref={linkInputRef}
                  type="text"
                  readOnly
                  className="form-control bg-white font-monospace"
                  value={issuedNotice.link}
                  onFocus={e => e.currentTarget.select()}
                />
                <button
                  type="button"
                  className={`btn ${copied ? 'btn-success' : 'btn-dark'} px-3`}
                  onClick={() => handleCopyLink(issuedNotice.link!)}
                >
                  <i className={`bi ${copied ? 'bi-check-lg' : 'bi-clipboard'} me-1`} aria-hidden="true" />
                  {copied ? '복사됨' : '링크 복사'}
                </button>
              </div>
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-1">
                <span className="small text-body-secondary">
                  보안상 링크 원문은 다시 조회할 수 없습니다. 배너를 닫기 전에 복사해 두세요.
                </span>
                <a
                  href={`mailto:${encodeURIComponent(issuedNotice.requesterEmail)}?subject=${encodeURIComponent(`[한국건설트레이딩] ${issuedNotice.productName} TDS 다운로드 링크 안내`)}&body=${encodeURIComponent(`안녕하세요, ${issuedNotice.requesterName}님.\n\n요청하신 ${issuedNotice.productName} 기술자료(TDS) 다운로드 링크를 안내드립니다.\n\n다운로드 링크: ${issuedNotice.link}\n\n※ 본 링크는 기한 및 다운로드 횟수가 제한되어 있습니다.\n\n감사합니다.\n한국건설트레이딩 드림`)}`}
                  className="btn btn-sm btn-outline-dark rounded-pill px-3"
                >
                  <i className="bi bi-envelope me-1" aria-hidden="true" />
                  메일 앱으로 보내기
                </a>
              </div>
            </div>
          ) : (
            <div className="small text-danger fw-semibold">
              다운로드 링크가 반환되지 않았습니다. 다시 승인하여 링크를 재발급해 주세요.
            </div>
          )}
        </div>
      )}

      {/* 정상 발송 성공 + 링크 확인 배너 */}
      {successMsg && (
        <div className="alert alert-success rounded-4 d-flex flex-column gap-2 mb-4" role="status" aria-live="polite">
          <div className="d-flex align-items-center justify-content-between gap-2">
            <div className="d-flex align-items-center gap-2 small">
              <i className="bi bi-check-circle-fill" aria-hidden="true" />
              <span>{successMsg}</span>
            </div>
            <button
              type="button"
              className="btn-close"
              aria-label="성공 알림 닫기"
              onClick={() => {
                setSuccessMsg(null)
                if (issuedNotice?.emailed) setIssuedNotice(null)
              }}
            />
          </div>
          {issuedNotice?.emailed && issuedNotice.link && (
            <div className="d-flex align-items-center gap-2 flex-wrap pt-1">
              <span className="small text-body-secondary">발송된 링크:</span>
              <code className="small text-break bg-white px-2 py-1 rounded border">{issuedNotice.link}</code>
              <button
                type="button"
                className="btn btn-sm btn-outline-success rounded-pill px-2 py-0"
                onClick={() => handleCopyLink(issuedNotice.link!)}
              >
                {copied ? '복사됨' : '복사'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 오류 알림 */}
      {errorMsg && (
        <div className="alert alert-danger rounded-4 d-flex align-items-start justify-content-between gap-3 mb-4" role="alert">
          <div className="d-flex align-items-start gap-2">
            <i className="bi bi-exclamation-triangle-fill mt-1 flex-shrink-0" aria-hidden="true" />
            <div>
              <div className="fw-semibold small">오류가 발생했습니다</div>
              <div className="small">{errorMsg}</div>
            </div>
          </div>
          <div className="d-flex gap-2 flex-shrink-0">
            <button type="button" className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={refreshRequests} disabled={refreshing}>
              다시 시도
            </button>
            <button type="button" className="btn-close" aria-label="오류 알림 닫기" onClick={() => setErrorMsg(null)} />
          </div>
        </div>
      )}

      {/* 상태 탭 + 검색 + 테이블 */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="bg-white px-3 px-md-4 pt-3 pb-0">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 pb-3">
            {/* 상태 탭 */}
            <div role="tablist" aria-label="TDS 요청 상태 필터" className="kct-tablist">
              {STATUS_TABS.map((t, idx) => {
                const selected = activeTab === t.key
                const cnt = counts[t.key]
                return (
                  <button
                    key={t.key}
                    ref={el => { tabRefs.current[idx] = el }}
                    type="button"
                    role="tab"
                    id={`tds-tab-${t.key}`}
                    aria-selected={selected}
                    tabIndex={selected ? 0 : -1}
                    className="kct-tab d-inline-flex align-items-center gap-1"
                    onClick={() => setActiveTab(t.key)}
                    onKeyDown={e => handleTabKeyDown(e, idx)}
                  >
                    <span>{t.label}</span>
                    <span
                      className={`badge rounded-pill ${
                        t.key === 'pending' && cnt > 0
                          ? 'bg-danger'
                          : selected
                            ? 'bg-primary'
                            : 'bg-light text-secondary border'
                      }`}
                      style={{ fontSize: '0.68rem' }}
                    >
                      {cnt}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* 검색 */}
            <div style={{ minWidth: 260, maxWidth: 380 }} className="w-100 w-md-auto">
              <label htmlFor={searchInputId} className="visually-hidden">
                제품, 요청자, 회사, 이메일, 메시지 검색
              </label>
              <div className="input-group input-group-sm rounded-pill overflow-hidden border bg-white">
                <span className="input-group-text bg-white border-0 ps-3">
                  <i className="bi bi-search text-body-secondary" aria-hidden="true" />
                </span>
                <input
                  id={searchInputId}
                  type="search"
                  className="form-control border-0 shadow-none"
                  placeholder="제품·요청자·회사·이메일 검색..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    type="button"
                    className="btn btn-light border-0 px-2"
                    aria-label="검색어 지우기"
                    onClick={() => setSearch('')}
                  >
                    <i className="bi bi-x" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {activeTab === 'sent' && (
            <div className="alert alert-light border rounded-3 py-2 px-3 mb-3 small text-body-secondary d-flex align-items-center gap-2">
              <i className="bi bi-info-circle text-primary flex-shrink-0" aria-hidden="true" />
              <span>
                이미 발송된 건의 링크가 만료되었거나 재전송이 필요한 경우, 해당 행의 <strong className="text-dark">새 링크 재발급</strong>으로 다시 승인하면 새로운 1회성 다운로드 링크가 생성됩니다.
              </span>
            </div>
          )}

          {activeTab === 'rejected' && (
            <div className="alert alert-light border rounded-3 py-2 px-3 mb-3 small text-body-secondary d-flex align-items-center gap-2">
              <i className="bi bi-info-circle text-secondary flex-shrink-0" aria-hidden="true" />
              <span>
                반려 처리된 요청은 재발송할 수 없습니다. 다시 제공이 필요한 경우 요청자가 새 TDS 요청을 제출하도록 안내해 주세요.
              </span>
            </div>
          )}
        </div>

        {/* 테이블 */}
        <div role="tabpanel" aria-labelledby={`tds-tab-${activeTab}`}>
          <div
            tabIndex={0}
            role="region"
            aria-labelledby={captionId}
            className="kct-tds-table-wrap"
          >
            <table className="table table-hover align-middle mb-0 kct-tds-table" style={{ fontSize: '0.85rem' }}>
              <caption id={captionId} className="visually-hidden">
                TDS 요청 목록 ({STATUS_TABS.find(t => t.key === activeTab)?.label}, {filtered.length}건)
              </caption>
              <thead className="table-light">
                <tr>
                  <th scope="col" className="px-4 py-3 border-0">요청일</th>
                  <th scope="col" className="py-3 border-0">제품</th>
                  <th scope="col" className="py-3 border-0">요청자 · 회사 · 연락처</th>
                  <th scope="col" className="py-3 border-0">메시지 / 관리자 메모</th>
                  <th scope="col" className="py-3 border-0 text-center">상태</th>
                  <th scope="col" className="py-3 pe-4 border-0 text-end">처리</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => {
                  const st = STATUS_META[r.status] ?? STATUS_META.pending
                  const prod = bySlug(r.product_slug)
                  const expired = r.status === 'sent' && isExpired(r.link_expires_at)

                  return (
                    <tr
                      key={r.id}
                      style={{
                        background: r.status === 'pending' ? '#FFFBEB' : undefined,
                      }}
                    >
                      <td data-label="요청일" className="px-4 py-3 text-nowrap">
                        <div className="fw-medium text-dark">{formatDateTime(r.created_at)}</div>
                        {r.processed_at && (
                          <div className="text-body-secondary" style={{ fontSize: '0.72rem' }}>
                            처리: {formatDateTime(r.processed_at)}
                            {r.processed_by ? ` (${r.processed_by})` : ''}
                          </div>
                        )}
                      </td>

                      <th scope="row" className="py-3 fw-semibold text-dark">
                        <div>{prod?.name ?? r.product_slug}</div>
                        <div className="text-body-secondary fw-normal" style={{ fontSize: '0.72rem', fontFamily: 'monospace' }}>
                          {r.product_slug}
                        </div>
                      </th>

                      <td data-label="요청자·회사·연락처" className="py-3">
                        <div className="d-flex align-items-center gap-1 flex-wrap">
                          <span className="fw-semibold text-dark">{r.name}</span>
                          {r.company && <span className="text-body-secondary">· {r.company}</span>}
                          {r.user_id && (
                            <span className="badge rounded-pill bg-light text-primary border" style={{ fontSize: '0.62rem' }}>
                              가입회원
                            </span>
                          )}
                        </div>
                        <div className="text-body-secondary text-break" style={{ fontSize: '0.78rem' }}>
                          {r.email}
                          {r.phone ? ` · ${r.phone}` : ''}
                        </div>
                      </td>

                      <td data-label="메시지" className="py-3" style={{ maxWidth: 280 }}>
                        {r.message ? (
                          <div
                            className="text-dark"
                            style={{
                              fontSize: '0.82rem',
                              whiteSpace: 'pre-wrap',
                              wordBreak: 'break-word',
                              maxHeight: 72,
                              overflowY: 'auto',
                            }}
                          >
                            {r.message}
                          </div>
                        ) : (
                          <span className="text-body-secondary small">(메시지 없음)</span>
                        )}
                        {r.admin_note && (
                          <div className="mt-1 px-2 py-1 rounded-2 bg-light border text-body-secondary" style={{ fontSize: '0.74rem' }}>
                            <strong className="text-dark">메모:</strong> {r.admin_note}
                          </div>
                        )}
                      </td>

                      <td data-label="상태" className="py-3 text-center">
                        <span
                          className="badge rounded-pill px-2 py-1 d-inline-flex align-items-center gap-1"
                          style={{
                            background: st.bg,
                            color: st.text,
                            border: `1px solid ${st.border}`,
                            fontSize: '0.72rem',
                          }}
                        >
                          <i className={`bi ${st.icon}`} aria-hidden="true" />
                          {st.label}
                        </span>
                        {r.status === 'sent' && (
                          <div className="mt-1" style={{ fontSize: '0.7rem' }}>
                            <div className="text-body-secondary">다운로드 {r.download_count ?? 0}회</div>
                            {r.link_expires_at && (
                              <div className={expired ? 'text-danger fw-semibold' : 'text-body-secondary'}>
                                {expired ? '만료됨' : `만료 ${formatDateTime(r.link_expires_at)}`}
                              </div>
                            )}
                          </div>
                        )}
                      </td>

                      <td data-label="처리" className="py-3 pe-4 text-end text-nowrap">
                        {r.status === 'pending' ? (
                          <div className="d-inline-flex gap-1">
                            <button
                              type="button"
                              className="btn btn-sm btn-primary rounded-pill px-3"
                              style={{ fontSize: '0.76rem' }}
                              onClick={() => openActionDialog(r, 'approve')}
                            >
                              <i className="bi bi-send me-1" aria-hidden="true" />
                              승인·링크 발송
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger rounded-pill px-3"
                              style={{ fontSize: '0.76rem' }}
                              onClick={() => openActionDialog(r, 'reject')}
                            >
                              반려
                            </button>
                          </div>
                        ) : r.status === 'sent' ? (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary rounded-pill px-3"
                            style={{ fontSize: '0.76rem' }}
                            onClick={() => openActionDialog(r, 'approve')}
                          >
                            <i className="bi bi-arrow-repeat me-1" aria-hidden="true" />
                            새 링크 재발급
                          </button>
                        ) : (
                          <span className="text-body-secondary small">반려 완료</span>
                        )}
                      </td>
                    </tr>
                  )
                })}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-5 text-center text-body-secondary">
                      <i className="bi bi-file-earmark-pdf fs-2 d-block mb-2 opacity-25" aria-hidden="true" />
                      {search
                        ? '검색 결과가 없습니다.'
                        : `${STATUS_TABS.find(t => t.key === activeTab)?.label ?? ''} 상태의 TDS 요청이 없습니다.`}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 하단 요약 */}
      <div className="d-flex justify-content-between align-items-center mt-3 px-1 small text-body-secondary">
        <span>표시 {filtered.length}건 / 전체 {requests.length}건</span>
        <span>대기 {counts.pending}건 · 발송완료 {counts.sent}건 · 반려 {counts.rejected}건</span>
      </div>

      {/* 승인·반려 확인 모달 (<dialog>) */}
      <dialog
        ref={modalRef}
        className="kct-tds-modal"
        aria-labelledby={modalTitleId}
        onClose={e => {
          e.currentTarget.returnValue = ''
          setDialogState(null)
        }}
      >
        {dialogState && (() => {
          const { mode, request, isReissue } = dialogState
          const prodName = bySlug(request.product_slug)?.name ?? request.product_slug
          const isReject = mode === 'reject'

          return (
            <form onSubmit={handleSubmitAction}>
              <div className="px-4 pt-4 pb-3 border-bottom d-flex align-items-center justify-content-between">
                <h1 id={modalTitleId} className="h5 fw-bold text-dark mb-0">
                  {isReject
                    ? 'TDS 요청 반려'
                    : isReissue
                      ? '새 1회성 다운로드 링크 재발급'
                      : 'TDS 요청 승인 · 링크 발송'}
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="대화상자 닫기"
                  onClick={() => modalRef.current?.close()}
                />
              </div>

              <div className="p-4">
                <div className="rounded-3 bg-light border p-3 mb-3 small">
                  <div className="fw-bold text-primary mb-1">
                    {prodName} <span className="text-body-secondary fw-normal">({request.product_slug})</span>
                  </div>
                  <div className="text-dark">
                    <strong>{request.name}</strong>
                    {request.company ? ` · ${request.company}` : ''}
                  </div>
                  <div className="text-body-secondary text-break">
                    {request.email}
                    {request.phone ? ` · ${request.phone}` : ''}
                  </div>
                  {request.message && (
                    <div className="mt-2 pt-2 border-top text-dark" style={{ whiteSpace: 'pre-wrap' }}>
                      {request.message}
                    </div>
                  )}
                  <div className="mt-2 text-body-secondary" style={{ fontSize: '0.72rem' }}>
                    개인정보 수집·이용 동의: {formatDateTime(request.consent_at)}
                  </div>
                </div>

                {isReject ? (
                  <p className="small text-body-secondary mb-3">
                    이 요청을 반려 상태로 변경합니다. 다운로드 링크는 발급되지 않습니다.
                  </p>
                ) : isReissue ? (
                  <div className="alert alert-info rounded-3 py-2 px-3 small mb-3">
                    기존 처리된 요청에 대해 <strong>새로운 1회성 다운로드 링크</strong>를 발급하고, 메일 발송이 설정된 경우 요청자 이메일로 전송합니다. (기존 토큰은 새 토큰으로 교체됩니다.)
                  </div>
                ) : (
                  <p className="small text-body-secondary mb-3">
                    승인 시 기한부 1회성 다운로드 링크가 생성되며, 메일 설정이 되어 있으면 요청자 이메일로 자동 발송됩니다. 메일이 미설정된 경우 복사 가능한 링크가 화면에 표시됩니다.
                  </p>
                )}

                <div className="mb-1">
                  <label htmlFor={modalNoteId} className="form-label small fw-semibold text-dark">
                    관리자 메모 <span className="text-body-secondary fw-normal">(선택, 최대 500자)</span>
                  </label>
                  <textarea
                    id={modalNoteId}
                    className="form-control form-control-sm"
                    rows={3}
                    maxLength={500}
                    value={adminNote}
                    onChange={e => setAdminNote(e.target.value)}
                    placeholder={isReject ? '반려 사유를 입력하세요...' : '내부 확인 메모를 입력하세요...'}
                    autoFocus={!isReject}
                  />
                  <div className="text-end text-body-secondary mt-1" style={{ fontSize: '0.72rem' }}>
                    {adminNote.length} / 500
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 border-top bg-light d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                  autoFocus={isReject}
                  onClick={() => modalRef.current?.close()}
                  disabled={submitting}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className={`btn btn-sm rounded-pill px-4 ${isReject ? 'btn-danger' : 'btn-primary'}`}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1" aria-hidden="true" />
                      처리 중...
                    </>
                  ) : isReject ? (
                    '반려 처리'
                  ) : isReissue ? (
                    '새 링크 발급·발송'
                  ) : (
                    '승인·링크 발송'
                  )}
                </button>
              </div>
            </form>
          )
        })()}
      </dialog>
    </div>
  )
}
