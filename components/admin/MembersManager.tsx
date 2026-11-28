'use client'

import { useState, useEffect, useRef, useId, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { Member, MemberStatus } from '@/lib/tds-admin'
import { bySlug } from '@/lib/products-catalog'
import {
  fetchMembersAction,
  updateMemberStatusAction,
  updateMemberTierAction,
  fetchMemberDownloadsAction,
} from '@/app/admin/(protected)/members/actions'

type StatusTab = MemberStatus | 'all'

const STATUS_TABS: { key: StatusTab; label: string }[] = [
  { key: 'pending',   label: '대기' },
  { key: 'approved',  label: '승인' },
  { key: 'suspended', label: '정지' },
  { key: 'rejected',  label: '반려' },
  { key: 'all',       label: '전체' },
]

const STATUS_META: Record<MemberStatus, { label: string; bg: string; text: string; border: string; icon: string }> = {
  pending:   { label: '대기', bg: '#FEF3C7', text: '#92400E', border: '#FCD34D', icon: 'bi-hourglass-split' },
  approved:  { label: '승인', bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7', icon: 'bi-check-circle-fill' },
  suspended: { label: '정지', bg: '#FFEDD5', text: '#9A3412', border: '#FDBA74', icon: 'bi-pause-circle-fill' },
  rejected:  { label: '반려', bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5', icon: 'bi-x-circle-fill' },
}

const TIER_OPTIONS: { value: string; label: string; badgeClass: string }[] = [
  { value: 'standard', label: '일반',    badgeClass: 'bg-secondary' },
  { value: 'silver',   label: '실버',    badgeClass: 'bg-info text-dark' },
  { value: 'gold',     label: '골드',    badgeClass: 'bg-warning text-dark' },
  { value: 'platinum', label: '플래티넘', badgeClass: 'bg-primary' },
]

function tierInfo(tier: string) {
  return TIER_OPTIONS.find(t => t.value === tier) ?? { value: tier, label: tier, badgeClass: 'bg-secondary' }
}

function formatDate(iso: string | null | undefined) {
  if (!iso) return '-'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '-'
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
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

interface ConfirmActionState {
  member: Member
  targetStatus: MemberStatus
  title: string
  description: string
  confirmLabel: string
  btnVariant: string
  destructive: boolean
}

function getStatusActions(member: Member): Omit<ConfirmActionState, 'member'>[] {
  switch (member.status) {
    case 'pending':
      return [
        {
          targetStatus: 'approved',
          title: '회원 승인 확인',
          description: '승인하면 이 회원은 로그인 후 모든 제품 TDS PDF를 즉시 다운로드할 수 있습니다.',
          confirmLabel: '승인하기',
          btnVariant: 'btn-success',
          destructive: false,
        },
        {
          targetStatus: 'rejected',
          title: '회원 반려 확인',
          description: '가입 신청을 반려합니다. 반려 사유를 메모로 남겨두면 추후 관리에 도움이 됩니다.',
          confirmLabel: '반려하기',
          btnVariant: 'btn-danger',
          destructive: true,
        },
      ]
    case 'approved':
      return [
        {
          targetStatus: 'suspended',
          title: '회원 정지 확인',
          description: '정지된 회원은 TDS 즉시 다운로드 권한이 차단됩니다. 언제든 다시 승인 복구할 수 있습니다.',
          confirmLabel: '정지하기',
          btnVariant: 'btn-warning text-dark',
          destructive: true,
        },
      ]
    case 'suspended':
      return [
        {
          targetStatus: 'approved',
          title: '회원 승인 복구 확인',
          description: '정지 상태를 해제하고 승인 상태로 복구합니다. 복구 즉시 TDS 다운로드가 허용됩니다.',
          confirmLabel: '승인 복구',
          btnVariant: 'btn-success',
          destructive: false,
        },
        {
          targetStatus: 'rejected',
          title: '회원 반려 전환 확인',
          description: '이 회원의 상태를 반려로 변경합니다.',
          confirmLabel: '반려로 변경',
          btnVariant: 'btn-outline-danger',
          destructive: true,
        },
      ]
    case 'rejected':
      return [
        {
          targetStatus: 'approved',
          title: '회원 승인 복구 확인',
          description: '반려된 회원을 승인 상태로 복구합니다. 복구 즉시 TDS 다운로드가 허용됩니다.',
          confirmLabel: '승인 복구',
          btnVariant: 'btn-success',
          destructive: false,
        },
      ]
  }
}

export default function MembersManager({
  initialMembers,
  initialTab = 'all',
  initialQuery = '',
  initialError = null,
}: {
  initialMembers: Member[]
  initialTab?: StatusTab
  initialQuery?: string
  initialError?: string | null
}) {
  const router = useRouter()
  const captionId = useId()
  const searchInputId = useId()
  const drawerTitleId = useId()
  const confirmTitleId = useId()
  const confirmNoteId = useId()
  const tierSelectId = useId()

  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [activeTab, setActiveTab] = useState<StatusTab>(initialTab)
  const [search, setSearch] = useState(initialQuery)
  const [errorMsg, setErrorMsg] = useState<string | null>(initialError)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  // Detail drawer state
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [tierDraft, setTierDraft] = useState<string>('standard')
  const [savingTier, setSavingTier] = useState(false)
  const [downloads, setDownloads] = useState<{ slug: string; at: string }[]>([])
  const [downloadsLoading, setDownloadsLoading] = useState(false)
  const [downloadsError, setDownloadsError] = useState<string | null>(null)

  // Confirm modal state
  const [confirmState, setConfirmState] = useState<ConfirmActionState | null>(null)
  const [actionNote, setActionNote] = useState('')
  const [submittingStatus, setSubmittingStatus] = useState(false)

  const drawerRef = useRef<HTMLDialogElement | null>(null)
  const confirmRef = useRef<HTMLDialogElement | null>(null)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  const selectedMember = useMemo(
    () => (selectedId ? members.find(m => m.id === selectedId) ?? null : null),
    [members, selectedId],
  )

  // Sync detail drawer <dialog> open/close with React state
  useEffect(() => {
    const el = drawerRef.current
    if (!el) return
    if (selectedMember) {
      if (!el.open) el.showModal()
    } else if (el.open) {
      el.close()
    }
  }, [selectedMember])

  // Light-dismiss fallback for browsers without native closedby="any" (e.g. Safari)
  useEffect(() => {
    const el = drawerRef.current
    if (!el || typeof window === 'undefined') return
    if ('closedBy' in HTMLDialogElement.prototype) return

    const outside = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom
    }
    let pressedOutside = false
    const onDown = (e: PointerEvent) => { pressedOutside = outside(e) }
    const onUp = (e: PointerEvent) => {
      if (pressedOutside && outside(e)) el.close()
      pressedOutside = false
    }
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointerup', onUp)
    return () => {
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointerup', onUp)
    }
  }, [])

  // Sync confirm modal <dialog> open/close with React state
  useEffect(() => {
    const el = confirmRef.current
    if (!el) return
    if (confirmState) {
      if (!el.open) el.showModal()
    } else if (el.open) {
      el.close()
    }
  }, [confirmState])

  // Load downloads when a member is selected
  const loadDownloads = useCallback(async (userId: string) => {
    setDownloadsLoading(true)
    setDownloadsError(null)
    try {
      const res = await fetchMemberDownloadsAction(userId)
      if (res.ok) {
        setDownloads(res.downloads)
      } else {
        setDownloads([])
        setDownloadsError(res.error)
      }
    } catch {
      setDownloads([])
      setDownloadsError('다운로드 이력을 불러오는 중 오류가 발생했습니다.')
    } finally {
      setDownloadsLoading(false)
    }
  }, [])

  function openMemberDetail(member: Member) {
    setSelectedId(member.id)
    setTierDraft(member.tier || 'standard')
    setDownloads([])
    setDownloadsError(null)
    void loadDownloads(member.id)
  }

  function closeMemberDetail() {
    setSelectedId(null)
  }

  async function refreshMembers() {
    setRefreshing(true)
    setErrorMsg(null)
    try {
      const res = await fetchMembersAction()
      if (res.ok) {
        setMembers(res.members)
      } else {
        setErrorMsg(res.error)
      }
    } catch {
      setErrorMsg('회원 목록을 새로고침하지 못했습니다.')
    } finally {
      setRefreshing(false)
    }
  }

  function openConfirmDialog(member: Member, spec: Omit<ConfirmActionState, 'member'>) {
    setActionNote(member.admin_note ?? '')
    setConfirmState({ member, ...spec })
  }

  async function handleConfirmStatusChange(e: React.FormEvent) {
    e.preventDefault()
    if (!confirmState) return
    setSubmittingStatus(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    try {
      const res = await updateMemberStatusAction(
        confirmState.member.id,
        confirmState.targetStatus,
        actionNote,
      )
      if (res.ok) {
        const label = STATUS_META[confirmState.targetStatus].label
        const targetName = confirmState.member.company_name || confirmState.member.contact_person || '회원'
        setMembers(prev =>
          prev.map(m =>
            m.id === confirmState.member.id
              ? {
                  ...m,
                  status: confirmState.targetStatus,
                  admin_note: actionNote.trim() || null,
                  approved_at: confirmState.targetStatus === 'approved' ? new Date().toISOString() : m.approved_at,
                }
              : m,
          ),
        )
        setConfirmState(null)
        setSuccessMsg(`'${targetName}' 상태를 '${label}'(으)로 변경했습니다.`)
        router.refresh()
        void refreshMembers()
      } else {
        setErrorMsg(res.error ?? '회원 상태 변경에 실패했습니다.')
        setConfirmState(null)
      }
    } catch {
      setErrorMsg('회원 상태 변경 요청 중 오류가 발생했습니다.')
      setConfirmState(null)
    } finally {
      setSubmittingStatus(false)
    }
  }

  async function handleSaveTier() {
    if (!selectedMember) return
    setSavingTier(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    try {
      const res = await updateMemberTierAction(selectedMember.id, tierDraft)
      if (res.ok) {
        setMembers(prev =>
          prev.map(m => (m.id === selectedMember.id ? { ...m, tier: tierDraft } : m)),
        )
        setSuccessMsg(`회원 등급을 '${tierInfo(tierDraft).label}'(으)로 변경했습니다.`)
        router.refresh()
      } else {
        setErrorMsg(res.error ?? '회원 등급 변경에 실패했습니다.')
      }
    } catch {
      setErrorMsg('회원 등급 변경 요청 중 오류가 발생했습니다.')
    } finally {
      setSavingTier(false)
    }
  }

  // Tab counts
  const counts = useMemo(() => {
    const map: Record<StatusTab, number> = {
      pending: 0,
      approved: 0,
      suspended: 0,
      rejected: 0,
      all: members.length,
    }
    for (const m of members) {
      if (m.status in map) map[m.status] += 1
    }
    return map
  }, [members])

  // Filtered and sorted list: pending members always prioritized at top
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return members
      .filter(m => {
        if (activeTab !== 'all' && m.status !== activeTab) return false
        if (!q) return true
        return (
          (m.company_name ?? '').toLowerCase().includes(q) ||
          (m.contact_person ?? '').toLowerCase().includes(q) ||
          (m.email ?? '').toLowerCase().includes(q) ||
          (m.business_reg_number ?? '').toLowerCase().includes(q) ||
          (m.phone ?? '').toLowerCase().includes(q)
        )
      })
      .sort((a, b) => {
        const aPending = a.status === 'pending' ? 0 : 1
        const bPending = b.status === 'pending' ? 0 : 1
        if (aPending !== bPending) return aPending - bPending
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })
  }, [members, activeTab, search])

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
        .kct-members-table-wrap {
          overflow-x: auto;
          max-inline-size: 100%;
          container-type: inline-size;
        }
        .kct-members-table {
          border-collapse: separate;
          border-spacing: 0;
          width: 100%;
        }
        @container (width < 820px) {
          .kct-members-table,
          .kct-members-table tbody,
          .kct-members-table tr,
          .kct-members-table th,
          .kct-members-table td {
            display: block;
            width: 100%;
          }
          .kct-members-table thead {
            display: none;
          }
          .kct-members-table tbody tr {
            border-bottom: 1px solid #dee2e6;
            padding: 0.75rem 1rem;
          }
          .kct-members-table tbody th,
          .kct-members-table tbody td {
            border: 0 !important;
            padding: 0.25rem 0 !important;
            text-align: left !important;
          }
          .kct-members-table tbody td[data-label]::before {
            content: attr(data-label) ": ";
            font-weight: 600;
            color: #6c757d;
            margin-inline-end: 0.35rem;
          }
        }
        dialog.kct-member-drawer {
          border: 0;
          padding: 0;
          margin: 0 0 0 auto;
          width: min(520px, 100vw);
          max-width: 100vw;
          height: 100dvh;
          max-height: 100dvh;
          background: #fff;
          box-shadow: -8px 0 32px rgba(15, 23, 42, 0.16);
        }
        dialog.kct-member-drawer[open] {
          display: flex;
          flex-direction: column;
        }
        dialog.kct-member-drawer:modal,
        dialog.kct-confirm-modal:modal {
          overscroll-behavior: contain;
        }
        dialog.kct-member-drawer::backdrop,
        dialog.kct-confirm-modal::backdrop {
          overflow: hidden;
          overscroll-behavior: contain;
          background: rgba(15, 23, 42, 0.45);
        }
        dialog.kct-confirm-modal {
          border: 0;
          border-radius: 1rem;
          padding: 0;
          margin: auto;
          width: min(460px, calc(100vw - 2rem));
          max-width: calc(100vw - 2rem);
          background: #fff;
          box-shadow: 0 20px 50px rgba(15, 23, 42, 0.22);
        }
        dialog.kct-confirm-modal[open] {
          display: block;
        }
      `}</style>

      {/* 헤더 */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">회원 관리</h1>
          <p className="text-body-secondary mb-0 small">
            웹사이트 가입 회원 승인·반려·정지, 등급 관리 및 TDS 다운로드 이력 조회 (총 {members.length}명)
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary rounded-pill px-3"
            onClick={refreshMembers}
            disabled={refreshing}
          >
            <i className={`bi bi-arrow-clockwise me-1 ${refreshing ? 'spin' : ''}`} aria-hidden="true" />
            {refreshing ? '불러오는 중...' : '새로고침'}
          </button>
        </div>
      </div>

      {/* 승인 대기 회원 상단 강조 배너 */}
      {counts.pending > 0 && (
        <div
          className="alert border-0 rounded-4 d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4 shadow-sm"
          style={{ background: '#FFFBEB', borderLeft: '4px solid #D97706' }}
          role="status"
        >
          <div className="d-flex align-items-center gap-2" style={{ color: '#92400E' }}>
            <i className="bi bi-exclamation-circle-fill fs-5" aria-hidden="true" />
            <span className="small fw-semibold">
              승인 대기 중인 회원이 <strong>{counts.pending}명</strong> 있습니다. 대기 회원은 목록 최상단에 우선 표시됩니다.
            </span>
          </div>
          {activeTab !== 'pending' && (
            <button
              type="button"
              className="btn btn-sm btn-warning text-dark rounded-pill px-3 fw-semibold"
              onClick={() => setActiveTab('pending')}
            >
              대기 회원만 보기
            </button>
          )}
        </div>
      )}

      {/* 오류 / 성공 알림 */}
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
            <button type="button" className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={refreshMembers} disabled={refreshing}>
              다시 시도
            </button>
            <button type="button" className="btn-close" aria-label="오류 알림 닫기" onClick={() => setErrorMsg(null)} />
          </div>
        </div>
      )}

      {successMsg && (
        <div className="alert alert-success rounded-4 d-flex align-items-center justify-content-between gap-2 mb-4" role="status" aria-live="polite">
          <div className="d-flex align-items-center gap-2 small">
            <i className="bi bi-check-circle-fill" aria-hidden="true" />
            <span>{successMsg}</span>
          </div>
          <button type="button" className="btn-close" aria-label="성공 알림 닫기" onClick={() => setSuccessMsg(null)} />
        </div>
      )}

      {/* 상태 탭 + 검색 */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="bg-white px-3 px-md-4 pt-3 pb-0">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 pb-3">
            {/* 상태 탭 */}
            <div role="tablist" aria-label="회원 상태 필터" className="kct-tablist">
              {STATUS_TABS.map((t, idx) => {
                const selected = activeTab === t.key
                const cnt = counts[t.key]
                return (
                  <button
                    key={t.key}
                    ref={el => { tabRefs.current[idx] = el }}
                    type="button"
                    role="tab"
                    id={`member-tab-${t.key}`}
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
                          ? 'bg-warning text-dark'
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
                회사명, 담당자, 이메일, 사업자번호 검색
              </label>
              <div className="input-group input-group-sm rounded-pill overflow-hidden border bg-white">
                <span className="input-group-text bg-white border-0 ps-3">
                  <i className="bi bi-search text-body-secondary" aria-hidden="true" />
                </span>
                <input
                  id={searchInputId}
                  type="search"
                  className="form-control border-0 shadow-none"
                  placeholder="회사·담당자·이메일·사업자번호 검색..."
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
        </div>

        {/* 테이블 */}
        <div
          role="tabpanel"
          aria-labelledby={`member-tab-${activeTab}`}
        >
          <div
            tabIndex={0}
            role="region"
            aria-labelledby={captionId}
            className="kct-members-table-wrap"
          >
            <table className="table table-hover align-middle mb-0 kct-members-table" style={{ fontSize: '0.85rem' }}>
              <caption id={captionId} className="visually-hidden">
                회원 목록 ({STATUS_TABS.find(t => t.key === activeTab)?.label ?? '전체'}, {filtered.length}명)
              </caption>
              <thead className="table-light">
                <tr>
                  <th scope="col" className="px-4 py-3 border-0">회사</th>
                  <th scope="col" className="py-3 border-0">담당자</th>
                  <th scope="col" className="py-3 border-0">이메일</th>
                  <th scope="col" className="py-3 border-0">연락처</th>
                  <th scope="col" className="py-3 border-0">사업자번호</th>
                  <th scope="col" className="py-3 border-0 text-center">등급</th>
                  <th scope="col" className="py-3 border-0 text-center">상태</th>
                  <th scope="col" className="py-3 border-0 text-center">가입일</th>
                  <th scope="col" className="py-3 border-0 text-center">다운로드</th>
                  <th scope="col" className="py-3 pe-4 border-0 text-end">관리</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(m => {
                  const st = STATUS_META[m.status] ?? STATUS_META.pending
                  const ti = tierInfo(m.tier)
                  const isPending = m.status === 'pending'
                  return (
                    <tr
                      key={m.id}
                      style={{
                        background: isPending ? '#FFFBEB' : selectedId === m.id ? '#EFF6FF' : undefined,
                        borderLeft: isPending ? '3px solid #D97706' : undefined,
                      }}
                    >
                      <th scope="row" className="px-4 py-3 fw-semibold text-dark">
                        <div className="d-flex align-items-center gap-2">
                          <span>{m.company_name || '(미입력)'}</span>
                          {isPending && (
                            <span className="badge rounded-pill bg-warning text-dark" style={{ fontSize: '0.62rem' }}>
                              신규 대기
                            </span>
                          )}
                        </div>
                      </th>
                      <td data-label="담당자" className="py-3">{m.contact_person || '-'}</td>
                      <td data-label="이메일" className="py-3 text-body-secondary">{m.email || '-'}</td>
                      <td data-label="연락처" className="py-3 text-body-secondary">{m.phone || '-'}</td>
                      <td data-label="사업자번호" className="py-3 text-body-secondary" style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                        {m.business_reg_number || '-'}
                      </td>
                      <td data-label="등급" className="py-3 text-center">
                        <span className={`badge rounded-pill ${ti.badgeClass}`} style={{ fontSize: '0.7rem' }}>
                          {ti.label}
                        </span>
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
                      </td>
                      <td data-label="가입일" className="py-3 text-center text-body-secondary">
                        {formatDate(m.created_at)}
                      </td>
                      <td data-label="다운로드" className="py-3 text-center">
                        <span className="fw-semibold text-dark">{m.download_count ?? 0}</span>
                        <span className="text-body-secondary ms-1" style={{ fontSize: '0.75rem' }}>회</span>
                      </td>
                      <td data-label="관리" className="py-3 pe-4 text-end">
                        <div className="d-inline-flex gap-1 align-items-center">
                          {isPending && (
                            <button
                              type="button"
                              className="btn btn-sm btn-success rounded-pill px-2 py-1"
                              style={{ fontSize: '0.75rem' }}
                              onClick={() => openConfirmDialog(m, getStatusActions(m)[0])}
                            >
                              승인
                            </button>
                          )}
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1"
                            style={{ fontSize: '0.75rem' }}
                            onClick={() => openMemberDetail(m)}
                            aria-label={`${m.company_name || m.contact_person || '회원'} 상세 보기`}
                          >
                            상세
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={10} className="px-4 py-5 text-center text-body-secondary">
                      <i className="bi bi-people fs-2 d-block mb-2 opacity-25" aria-hidden="true" />
                      {search || activeTab !== 'all'
                        ? '조건에 해당하는 회원이 없습니다.'
                        : '등록된 회원이 없습니다.'}
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
        <span>표시 {filtered.length}명 / 전체 {members.length}명</span>
        <span>승인 {counts.approved}명 · 대기 {counts.pending}명 · 정지 {counts.suspended}명 · 반려 {counts.rejected}명</span>
      </div>

      {/* 회원 상세 드로어 (<dialog>) */}
      <dialog
        ref={drawerRef}
        className="kct-member-drawer"
        aria-labelledby={drawerTitleId}
        {...({ closedby: 'any' } as Record<string, string>)}
        onClose={e => {
          e.currentTarget.returnValue = ''
          closeMemberDetail()
        }}
      >
        {selectedMember && (() => {
          const st = STATUS_META[selectedMember.status] ?? STATUS_META.pending
          const actions = getStatusActions(selectedMember)
          return (
            <>
              <div className="px-4 py-3 border-bottom d-flex align-items-center justify-content-between gap-2 bg-white flex-shrink-0">
                <div className="min-width-0">
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <h1 id={drawerTitleId} className="h5 fw-bold text-dark mb-0 text-truncate">
                      {selectedMember.company_name || '(회사명 미입력)'}
                    </h1>
                    <span
                      className="badge rounded-pill px-2 py-1"
                      style={{ background: st.bg, color: st.text, border: `1px solid ${st.border}`, fontSize: '0.72rem' }}
                    >
                      {st.label}
                    </span>
                  </div>
                  <div className="text-body-secondary small mt-1">
                    {selectedMember.contact_person || '-'} · {selectedMember.email || '-'}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary rounded-circle flex-shrink-0"
                  style={{ width: 34, height: 34, padding: 0 }}
                  aria-label="상세 패널 닫기"
                  onClick={() => drawerRef.current?.close()}
                >
                  <i className="bi bi-x-lg" aria-hidden="true" />
                </button>
              </div>

              <div className="p-4 flex-grow-1 overflow-auto d-flex flex-column gap-4">
                {/* 기본 정보 */}
                <section aria-label="회원 기본 정보">
                  <h2 className="h6 fw-bold text-dark mb-3">기본 정보</h2>
                  <dl className="row g-2 mb-0 small">
                    <dt className="col-4 text-body-secondary fw-normal">회사명</dt>
                    <dd className="col-8 mb-1 fw-semibold text-dark">{selectedMember.company_name || '-'}</dd>

                    <dt className="col-4 text-body-secondary fw-normal">담당자</dt>
                    <dd className="col-8 mb-1">{selectedMember.contact_person || '-'}</dd>

                    <dt className="col-4 text-body-secondary fw-normal">이메일</dt>
                    <dd className="col-8 mb-1 text-break">{selectedMember.email || '-'}</dd>

                    <dt className="col-4 text-body-secondary fw-normal">연락처</dt>
                    <dd className="col-8 mb-1">{selectedMember.phone || '-'}</dd>

                    <dt className="col-4 text-body-secondary fw-normal">사업자번호</dt>
                    <dd className="col-8 mb-1" style={{ fontFamily: 'monospace' }}>
                      {selectedMember.business_reg_number || '-'}
                    </dd>

                    <dt className="col-4 text-body-secondary fw-normal">가입일</dt>
                    <dd className="col-8 mb-1">{formatDateTime(selectedMember.created_at)}</dd>

                    <dt className="col-4 text-body-secondary fw-normal">승인 일시</dt>
                    <dd className="col-8 mb-1">
                      {selectedMember.approved_at ? formatDateTime(selectedMember.approved_at) : '-'}
                      {selectedMember.approved_by && (
                        <span className="text-body-secondary ms-1">({selectedMember.approved_by})</span>
                      )}
                    </dd>

                    <dt className="col-4 text-body-secondary fw-normal">관리자 메모</dt>
                    <dd className="col-8 mb-0">
                      {selectedMember.admin_note ? (
                        <div className="rounded-3 bg-light border p-2 text-dark" style={{ whiteSpace: 'pre-wrap' }}>
                          {selectedMember.admin_note}
                        </div>
                      ) : (
                        <span className="text-body-secondary">없음</span>
                      )}
                    </dd>
                  </dl>
                </section>

                {/* 등급 변경 */}
                <section aria-label="회원 등급 변경" className="rounded-4 border p-3 bg-light bg-opacity-50">
                  <label htmlFor={tierSelectId} className="form-label small fw-bold text-dark mb-2">
                    회원 등급
                  </label>
                  <div className="d-flex gap-2">
                    <select
                      id={tierSelectId}
                      className="form-select form-select-sm"
                      value={tierDraft}
                      onChange={e => setTierDraft(e.target.value)}
                      disabled={savingTier}
                    >
                      {TIER_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label} ({opt.value})
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="btn btn-sm btn-primary rounded-pill px-3 flex-shrink-0"
                      disabled={savingTier || tierDraft === selectedMember.tier}
                      onClick={handleSaveTier}
                    >
                      {savingTier ? (
                        <span className="spinner-border spinner-border-sm" aria-hidden="true" />
                      ) : (
                        '등급 저장'
                      )}
                    </button>
                  </div>
                </section>

                {/* 상태 변경 액션 */}
                <section aria-label="회원 상태 변경">
                  <h2 className="h6 fw-bold text-dark mb-2">상태 변경</h2>
                  <p className="text-body-secondary small mb-3">
                    버튼을 누르면 확인 대화상자에서 관리자 메모를 함께 기록할 수 있습니다.
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    {actions.map(act => (
                      <button
                        key={act.targetStatus}
                        type="button"
                        className={`btn btn-sm rounded-pill px-3 ${act.btnVariant}`}
                        onClick={() => openConfirmDialog(selectedMember, act)}
                      >
                        {act.confirmLabel}
                      </button>
                    ))}
                  </div>
                </section>

                {/* TDS 다운로드 이력 */}
                <section aria-label="TDS 다운로드 이력">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <h2 className="h6 fw-bold text-dark mb-0">
                      TDS 다운로드 이력
                      <span className="badge bg-light text-secondary border rounded-pill ms-2" style={{ fontSize: '0.7rem' }}>
                        총 {selectedMember.download_count ?? 0}회
                      </span>
                    </h2>
                    <button
                      type="button"
                      className="btn btn-sm btn-link text-decoration-none p-0 small"
                      onClick={() => loadDownloads(selectedMember.id)}
                      disabled={downloadsLoading}
                    >
                      새로고침
                    </button>
                  </div>

                  {selectedMember.last_download_at && (
                    <div className="text-body-secondary small mb-2">
                      최근 다운로드: {formatDateTime(selectedMember.last_download_at)}
                    </div>
                  )}

                  {downloadsLoading ? (
                    <div className="text-center py-4 text-body-secondary small">
                      <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                      다운로드 이력을 불러오는 중...
                    </div>
                  ) : downloadsError ? (
                    <div className="alert alert-warning rounded-3 small mb-0 d-flex align-items-center justify-content-between gap-2" role="alert">
                      <span>{downloadsError}</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-dark rounded-pill px-2 flex-shrink-0"
                        onClick={() => loadDownloads(selectedMember.id)}
                      >
                        재시도
                      </button>
                    </div>
                  ) : downloads.length === 0 ? (
                    <div className="rounded-3 border bg-light text-center py-4 text-body-secondary small">
                      다운로드 이력이 없습니다.
                    </div>
                  ) : (
                    <ul className="list-group list-group-flush border rounded-3 overflow-hidden">
                      {downloads.map((d, idx) => {
                        const prod = bySlug(d.slug)
                        return (
                          <li key={`${d.slug}-${d.at}-${idx}`} className="list-group-item d-flex justify-content-between align-items-center gap-2 py-2 px-3 small">
                            <div className="min-width-0">
                              <div className="fw-semibold text-dark text-truncate">
                                {prod?.name ?? d.slug}
                              </div>
                              <div className="text-body-secondary" style={{ fontSize: '0.72rem', fontFamily: 'monospace' }}>
                                {d.slug}
                              </div>
                            </div>
                            <span className="text-body-secondary flex-shrink-0" style={{ fontSize: '0.75rem' }}>
                              {formatDateTime(d.at)}
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </section>
              </div>
            </>
          )
        })()}
      </dialog>

      {/* 상태 변경 확인 대화상자 (<dialog>) */}
      <dialog
        ref={confirmRef}
        className="kct-confirm-modal"
        aria-labelledby={confirmTitleId}
        onClose={e => {
          e.currentTarget.returnValue = ''
          setConfirmState(null)
        }}
      >
        {confirmState && (
          <form onSubmit={handleConfirmStatusChange}>
            <div className="px-4 pt-4 pb-3 border-bottom d-flex align-items-center justify-content-between">
              <h1 id={confirmTitleId} className="h5 fw-bold text-dark mb-0">
                {confirmState.title}
              </h1>
              <button
                type="button"
                className="btn-close"
                aria-label="대화상자 닫기"
                onClick={() => confirmRef.current?.close()}
              />
            </div>

            <div className="p-4">
              <div className="rounded-3 bg-light border p-3 mb-3 small">
                <div className="fw-bold text-dark">
                  {confirmState.member.company_name || '(회사명 미입력)'}
                </div>
                <div className="text-body-secondary">
                  {confirmState.member.contact_person || '-'} · {confirmState.member.email || '-'}
                </div>
              </div>

              <p className="small text-body-secondary mb-3">{confirmState.description}</p>

              <div className="mb-1">
                <label htmlFor={confirmNoteId} className="form-label small fw-semibold text-dark">
                  관리자 메모 <span className="text-body-secondary fw-normal">(선택, 최대 500자)</span>
                </label>
                <textarea
                  id={confirmNoteId}
                  className="form-control form-control-sm"
                  rows={3}
                  maxLength={500}
                  value={actionNote}
                  onChange={e => setActionNote(e.target.value)}
                  placeholder="승인/반려/정지 사유 또는 내부 참고 메모를 입력하세요..."
                  autoFocus={!confirmState.destructive}
                />
                <div className="text-end text-body-secondary mt-1" style={{ fontSize: '0.72rem' }}>
                  {actionNote.length} / 500
                </div>
              </div>
            </div>

            <div className="px-4 py-3 border-top bg-light d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                autoFocus={confirmState.destructive}
                onClick={() => confirmRef.current?.close()}
                disabled={submittingStatus}
              >
                취소
              </button>
              <button
                type="submit"
                className={`btn btn-sm rounded-pill px-4 ${confirmState.btnVariant}`}
                disabled={submittingStatus}
              >
                {submittingStatus ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1" aria-hidden="true" />
                    처리 중...
                  </>
                ) : (
                  confirmState.confirmLabel
                )}
              </button>
            </div>
          </form>
        )}
      </dialog>
    </div>
  )
}
