'use client'

import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export type TdsLang = 'ko' | 'en' | 'ja'
type MemberStatus = 'pending' | 'approved' | 'suspended' | 'rejected'

interface AuthSnapshot {
  loading: boolean
  authenticated: boolean
  status: MemberStatus | null
  email: string
  name: string
  company: string
  phone: string
}

const DEFAULT_SNAPSHOT: AuthSnapshot = {
  loading: true,
  authenticated: false,
  status: null,
  email: '',
  name: '',
  company: '',
  phone: '',
}

const VALID_STATUSES = new Set<MemberStatus>(['pending', 'approved', 'suspended', 'rejected'])

let authSnapshot: AuthSnapshot = DEFAULT_SNAPSHOT
let authInitStarted = false
const authListeners = new Set<() => void>()

function emitAuth(next: AuthSnapshot) {
  authSnapshot = next
  authListeners.forEach((fn) => fn())
}

async function fetchAuthProfile() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      emitAuth({ loading: false, authenticated: false, status: null, email: '', name: '', company: '', phone: '' })
      return
    }

    let status: MemberStatus = 'pending'
    let name = ''
    let company = ''
    let phone = ''

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('status, is_verified, contact_person, company_name, phone')
      .eq('id', user.id)
      .maybeSingle()

    if (!error && profile) {
      if (typeof profile.status === 'string' && VALID_STATUSES.has(profile.status as MemberStatus)) {
        status = profile.status as MemberStatus
      } else if (profile.is_verified === true) {
        status = 'approved'
      }
      name = typeof profile.contact_person === 'string' ? profile.contact_person : ''
      company = typeof profile.company_name === 'string' ? profile.company_name : ''
      phone = typeof profile.phone === 'string' ? profile.phone : ''
    } else if (error) {
      // 마이그레이션 전(status 컬럼 부재) 환경에서도 안전하게 폴백
      const { data: legacy } = await supabase
        .from('profiles')
        .select('is_verified, contact_person, company_name, phone')
        .eq('id', user.id)
        .maybeSingle()
      if (legacy) {
        status = legacy.is_verified === true ? 'approved' : 'pending'
        name = typeof legacy.contact_person === 'string' ? legacy.contact_person : ''
        company = typeof legacy.company_name === 'string' ? legacy.company_name : ''
        phone = typeof legacy.phone === 'string' ? legacy.phone : ''
      }
    }

    emitAuth({
      loading: false,
      authenticated: true,
      status,
      email: user.email ?? '',
      name,
      company,
      phone,
    })
  } catch {
    emitAuth({ loading: false, authenticated: false, status: null, email: '', name: '', company: '', phone: '' })
  }
}

function ensureAuthInit() {
  if (authInitStarted || typeof window === 'undefined') return
  authInitStarted = true
  void fetchAuthProfile()
  try {
    const supabase = createClient()
    supabase.auth.onAuthStateChange(() => {
      void fetchAuthProfile()
    })
  } catch {
    // ignore if browser client unavailable
  }
}

function subscribeAuth(cb: () => void) {
  authListeners.add(cb)
  ensureAuthInit()
  return () => {
    authListeners.delete(cb)
  }
}

function getAuthSnapshot() {
  return authSnapshot
}

function getServerAuthSnapshot() {
  return DEFAULT_SNAPSHOT
}

function useTdsAuth() {
  return useSyncExternalStore(subscribeAuth, getAuthSnapshot, getServerAuthSnapshot)
}

// /tds?product=<slug> 자동 열기용 slug → opener 등록 맵
const modalOpeners = new Map<string, Set<() => void>>()

function registerModalOpener(slug: string, opener: () => void) {
  let set = modalOpeners.get(slug)
  if (!set) {
    set = new Set()
    modalOpeners.set(slug, set)
  }
  set.add(opener)
  return () => {
    set?.delete(opener)
    if (set && set.size === 0) modalOpeners.delete(slug)
  }
}

function openModalBySlug(slug: string): boolean {
  const set = modalOpeners.get(slug)
  if (!set || set.size === 0) return false
  const first = set.values().next().value
  if (first) {
    first()
    return true
  }
  return false
}

// 공용 스타일은 클라이언트당 한 번만 <style> 주입
let styleInjected = false
const TDS_CSS = `
.kct-tds-wrap{display:inline-flex;flex-direction:column;align-items:flex-start;gap:.35rem}
.kct-tds-wrap.kct-tds-compact{display:inline-flex;flex-direction:row;align-items:center}
.kct-tds-btn{display:inline-flex;align-items:center;justify-content:center;gap:.45rem;min-height:44px;padding:.6rem 1.35rem;border-radius:999px;border:1px solid var(--tx-line,rgba(22,24,28,.18));background:#fff;color:var(--tx-fg,#16181c);font:inherit;font-size:.9rem;font-weight:600;text-decoration:none;cursor:pointer;line-height:1.2;transition:border-color .18s,background .18s,color .18s}
.kct-tds-btn:hover{border-color:var(--tx-fg,#16181c);background:rgba(22,24,28,.04);color:var(--tx-fg,#16181c)}
.kct-tds-btn:focus-visible{outline:2px solid var(--tx-accent,#5b49e6);outline-offset:2px}
.kct-tds-btn-dl{border-color:var(--tx-accent,#5b49e6);color:var(--tx-accent,#5b49e6);background:#fff}
.kct-tds-btn-dl:hover{background:var(--tx-accent,#5b49e6);border-color:var(--tx-accent,#5b49e6);color:#fff}
.kct-tds-link-wrap{display:inline-flex;flex-wrap:wrap;align-items:center;gap:.4rem}
.kct-tds-link{display:inline-flex;align-items:center;gap:.35rem;padding:.2rem 0;border:0;background:transparent;color:#1558d6;font:inherit;font-size:.9rem;font-weight:600;text-decoration:underline;text-underline-offset:2px;cursor:pointer;white-space:nowrap}
.kct-tds-link:hover{color:#0f3fa0}
.kct-tds-link:focus-visible{outline:2px solid var(--tx-accent,#5b49e6);outline-offset:2px;border-radius:4px}
.kct-tds-hint{font-size:.82rem;line-height:1.45;color:var(--tx-mute,#5d646b)}
.kct-tds-hint a{color:#1558d6;font-weight:600;text-decoration:underline;text-underline-offset:2px}
.kct-tds-badge{display:inline-block;padding:.1rem .48rem;border-radius:999px;font-size:.73rem;font-weight:600;background:#fff7ed;color:#9a3412;border:1px solid #fed7aa;white-space:nowrap}
.kct-tds-badge-warn{background:#fef2f2;color:#991b1b;border-color:#fecaca}
tr.kct-tds-row-highlight>td{background:#eef2ff !important;transition:background .3s ease}
tr.kct-tds-row-highlight>td:first-child{box-shadow:inset 3px 0 0 #5b49e6}

/* Native <dialog> modal */
dialog.kct-tds-dialog{padding:0;border:1px solid rgba(22,24,28,.16);border-radius:16px;background:#fff;color:#16181c;width:min(540px,calc(100vw - 24px));max-height:min(90dvh,780px);overflow-y:auto;box-shadow:0 24px 64px rgba(12,13,15,.26);margin:auto;font-family:var(--kct-sans,"Pretendard Variable",Pretendard,-apple-system,BlinkMacSystemFont,sans-serif);font-size:16px;line-height:1.6}
dialog.kct-tds-dialog:modal{overscroll-behavior:contain}
dialog.kct-tds-dialog::backdrop{background:rgba(12,13,15,.56);backdrop-filter:blur(2px);overflow:hidden;overscroll-behavior:contain}
.kct-tds-dlg-head{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;padding:1.35rem 1.5rem 1rem;border-bottom:1px solid rgba(22,24,28,.12)}
.kct-tds-dlg-eyebrow{font-size:.76rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#5b49e6;margin-bottom:.25rem}
.kct-tds-dlg-title{font-size:1.22rem;font-weight:700;letter-spacing:-.025em;color:#16181c;margin:0;line-height:1.35}
.kct-tds-dlg-close{flex:none;width:40px;height:40px;border-radius:999px;border:1px solid rgba(22,24,28,.16);background:#fff;color:#16181c;font-size:1.25rem;line-height:1;display:inline-flex;align-items:center;justify-content:center;cursor:pointer}
.kct-tds-dlg-close:hover{background:#f5f6f8;border-color:#16181c}
.kct-tds-dlg-close:focus-visible{outline:2px solid #5b49e6;outline-offset:2px}
.kct-tds-dlg-body{padding:1.2rem 1.5rem 1.5rem}
.kct-tds-notice{padding:.85rem 1rem;border-radius:10px;background:#f5f6ff;border:1px solid #d9d6fe;color:#1e1b4b;font-size:.875rem;line-height:1.55;margin-bottom:1.15rem}
.kct-tds-notice-warn{background:#fff7ed;border-color:#fed7aa;color:#7c2d12}
.kct-tds-notice-links{display:flex;flex-wrap:wrap;gap:.6rem;margin-top:.55rem}
.kct-tds-notice-links a{display:inline-flex;align-items:center;padding:.3rem .8rem;border-radius:999px;font-size:.82rem;font-weight:600;text-decoration:none;border:1px solid #5b49e6;color:#5b49e6;background:#fff}
.kct-tds-notice-links a:first-child{background:#5b49e6;color:#fff}
.kct-tds-field{display:flex;flex-direction:column;gap:.3rem;margin-bottom:.95rem}
.kct-tds-field label{font-size:.88rem;font-weight:650;color:#16181c}
.kct-tds-req{color:#b91c1c;margin-left:.18rem}
.kct-tds-input,.kct-tds-textarea{width:100%;font:inherit;font-size:max(1rem,1em);color:#16181c;background:#fff;border:1px solid rgba(22,24,28,.28);border-radius:10px;padding:.65rem .85rem;min-height:48px;box-sizing:border-box;transition:border-color .18s,box-shadow .18s}
.kct-tds-textarea{min-height:92px;resize:vertical;line-height:1.55}
.kct-tds-input:focus-visible,.kct-tds-textarea:focus-visible{outline:2px solid #5b49e6;outline-offset:2px;border-color:#5b49e6}
.kct-tds-input:user-invalid,.kct-tds-textarea:user-invalid,.kct-tds-input[aria-invalid="true"],.kct-tds-textarea[aria-invalid="true"]{border-color:#b91c1c}
.kct-tds-ferr{font-size:.82rem;color:#b91c1c;margin-top:.15rem}
.kct-tds-consent{padding:.85rem .95rem;border-radius:10px;background:#f8f9fa;border:1px solid rgba(22,24,28,.14);margin:1rem 0 1.1rem}
.kct-tds-consent-row{display:flex;align-items:flex-start;gap:.6rem}
.kct-tds-consent-row input[type="checkbox"]{flex:none;width:20px;height:20px;margin-top:.15rem;accent-color:#5b49e6;cursor:pointer}
.kct-tds-consent-row label{font-size:.88rem;font-weight:650;color:#16181c;cursor:pointer;line-height:1.45}
.kct-tds-consent-meta{font-size:.78rem;color:#5d646b;margin:.45rem 0 0;line-height:1.5}
.kct-tds-alert{padding:.8rem .95rem;border-radius:10px;font-size:.88rem;line-height:1.5;margin-bottom:1rem}
.kct-tds-alert-err{background:#fef2f2;border:1px solid #fecaca;color:#991b1b}
.kct-tds-alert-ok{background:#ecfdf5;border:1px solid #a7f3d0;color:#065f46}
.kct-tds-actions{display:flex;flex-wrap:wrap;gap:.6rem;justify-content:flex-end;margin-top:1.1rem}
.kct-tds-submit{min-height:48px;padding:.65rem 1.5rem;border-radius:999px;border:1px solid #16181c;background:#16181c;color:#fff;font:inherit;font-size:.95rem;font-weight:650;cursor:pointer;transition:background .18s,border-color .18s}
.kct-tds-submit:hover:not(:disabled){background:#5b49e6;border-color:#5b49e6}
.kct-tds-submit:disabled{opacity:.65;cursor:not-allowed}
.kct-tds-cancel{min-height:48px;padding:.65rem 1.25rem;border-radius:999px;border:1px solid rgba(22,24,28,.2);background:#fff;color:#16181c;font:inherit;font-size:.92rem;font-weight:600;cursor:pointer}
.kct-tds-cancel:hover{border-color:#16181c}
.kct-tds-hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none}
@media (pointer:coarse){
  .kct-tds-input,.kct-tds-textarea{min-height:52px}
}
`

function ensureStyles() {
  if (styleInjected || typeof document === 'undefined') return
  if (document.getElementById('kct-tds-access-styles')) {
    styleInjected = true
    return
  }
  const style = document.createElement('style')
  style.id = 'kct-tds-access-styles'
  style.textContent = TDS_CSS
  document.head.appendChild(style)
  styleInjected = true
}

function normLang(lang: string): TdsLang {
  if (lang === 'en') return 'en'
  if (lang === 'ja') return 'ja'
  return 'ko'
}

const COPY = {
  ko: {
    downloadLabel: 'TDS 다운로드',
    requestLabel: 'TDS 요청',
    modalEyebrow: 'TDS 전송 요청',
    modalTitle: (name: string) => `${name} TDS 요청`,
    close: '닫기',
    cancel: '취소',
    submit: '전송 요청하기',
    submitting: '전송 중...',
    login: '로그인',
    signup: '회원가입',
    inlineGuestPre: '승인 회원은 바로 다운로드할 수 있습니다.',
    inlinePending: '회원 승인 대기 중입니다. 승인 전에도 이메일 전송을 요청할 수 있습니다.',
    inlineSuspended: '계정 이용이 제한된 상태입니다. 이메일 전송을 요청하거나 담당자에게 문의해 주세요.',
    inlineRejected: '회원 승인이 반려된 상태입니다. 이메일 전송을 요청하거나 담당자에게 문의해 주세요.',
    badgePending: '승인 대기 중',
    badgeRestricted: '승인 확인 필요',
    noticeGuest: '회원가입·로그인 후 관리자 승인을 받으시면 전 제품 TDS를 바로 다운로드하실 수 있습니다. 비회원도 아래 폼으로 이메일 전송을 요청하실 수 있습니다.',
    noticePending: '현재 회원 승인 대기 중입니다. 승인 완료 후 모든 TDS를 바로 다운로드하실 수 있으며, 급하신 경우 아래에서 이메일 전송을 요청해 주세요.',
    noticeSuspended: '현재 계정의 바로 다운로드가 일시 정지된 상태입니다. 아래에서 전송을 요청하시거나 담당자(sales@kconstrade.com)에게 문의해 주세요.',
    noticeRejected: '현재 계정은 회원 승인이 반려된 상태입니다. 아래에서 개별 전송을 요청하시거나 담당자(sales@kconstrade.com)에게 문의해 주세요.',
    nameLabel: '이름',
    namePh: '홍길동',
    companyLabel: '회사명',
    companyPh: '(주)한국건설',
    emailLabel: '이메일',
    emailPh: 'name@company.com',
    phoneLabel: '연락처',
    phonePh: '010-1234-5678',
    messageLabel: '요청 메시지',
    messagePh: '적용 부위나 추가 문의 사항이 있으면 적어 주세요 (선택)',
    consentLabel: '개인정보 수집·이용에 동의합니다 (필수)',
    consentMeta: '수집 항목: 이름, 회사명, 이메일, 연락처, 요청 메시지 · 목적: TDS 자료 이메일 발송 및 문의 응대 · 보유기간: 요청 처리 후 1년',
    success: '접수되었습니다. 담당자가 확인 후 이메일로 보내드립니다.',
    errName: '이름을 입력해 주세요 (최대 60자).',
    errEmail: '올바른 이메일 주소를 입력해 주세요.',
    errPhone: '연락처는 숫자, 하이픈(-), +, 괄호 등으로 5~30자로 입력해 주세요.',
    errConsent: '개인정보 수집·이용에 동의해 주세요.',
    errInvalid: '입력값을 다시 확인해 주세요. 필수 항목과 이메일·연락처 형식을 확인해 주세요.',
    errForbidden: '요청을 확인할 수 없습니다. 페이지를 새로고침한 뒤 다시 시도해 주세요.',
    errRateLimited: '단시간 내 요청 횟수 제한을 초과했습니다. 잠시 후 다시 시도하시거나 sales@kconstrade.com으로 문의해 주세요.',
    errServer: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도하시거나 sales@kconstrade.com으로 문의해 주세요.',
  },
  en: {
    downloadLabel: 'Download TDS',
    requestLabel: 'Request TDS',
    modalEyebrow: 'TDS DELIVERY REQUEST',
    modalTitle: (name: string) => `Request ${name} TDS`,
    close: 'Close',
    cancel: 'Cancel',
    submit: 'Submit Request',
    submitting: 'Submitting...',
    login: 'Sign in',
    signup: 'Sign up',
    inlineGuestPre: 'Approved members can download immediately.',
    inlinePending: 'Account approval pending. You can still request email delivery below.',
    inlineSuspended: 'Direct download is restricted for this account. Request email delivery or contact us.',
    inlineRejected: 'Account approval was declined. Request email delivery or contact us.',
    badgePending: 'Approval pending',
    badgeRestricted: 'Check account',
    noticeGuest: 'Sign up or sign in to download all TDS PDFs immediately once your account is approved. Guests can also request email delivery below.',
    noticePending: 'Your membership is currently pending approval. Once approved you can download all TDS PDFs directly, or request email delivery below in the meantime.',
    noticeSuspended: 'Direct downloads are currently suspended for your account. You may still request email delivery below or contact sales@kconstrade.com.',
    noticeRejected: 'Your membership request was declined. You may request individual TDS delivery below or contact sales@kconstrade.com.',
    nameLabel: 'Name',
    namePh: 'Full name',
    companyLabel: 'Company',
    companyPh: 'Company name (optional)',
    emailLabel: 'Email',
    emailPh: 'name@company.com',
    phoneLabel: 'Phone',
    phonePh: '+82 10-1234-5678',
    messageLabel: 'Message',
    messagePh: 'Application or additional notes (optional)',
    consentLabel: 'I agree to the collection and use of personal information (required)',
    consentMeta: 'Items: name, company, email, phone, message · Purpose: TDS email delivery & inquiry response · Retention: 1 year after processing',
    success: 'Your request has been received. Our team will review it and email the TDS to you.',
    errName: 'Please enter your name (up to 60 characters).',
    errEmail: 'Please enter a valid email address.',
    errPhone: 'Phone must be 5–30 characters using digits, +, -, (), spaces, or dots.',
    errConsent: 'Please agree to the collection and use of personal information.',
    errInvalid: 'Please check your input (name, email, phone format, and required consent).',
    errForbidden: 'Request could not be verified. Please refresh the page and try again.',
    errRateLimited: 'Too many requests in a short period. Please try again later or email sales@kconstrade.com.',
    errServer: 'A temporary error occurred. Please try again later or email sales@kconstrade.com.',
  },
  ja: {
    downloadLabel: 'TDSダウンロード',
    requestLabel: 'TDSリクエスト',
    modalEyebrow: 'TDS資料送付リクエスト',
    modalTitle: (name: string) => `${name} TDSリクエスト`,
    close: '閉じる',
    cancel: 'キャンセル',
    submit: '送信リクエスト',
    submitting: '送信中...',
    login: 'ログイン',
    signup: '会員登録',
    inlineGuestPre: '承認済み会員はすぐにダウンロードできます。',
    inlinePending: '会員承認待ちです。承認前でもメール送付をリクエストできます。',
    inlineSuspended: '現在アカウントの利用が制限されています。メール送付リクエストまたはお問い合わせをご利用ください。',
    inlineRejected: '会員承認が見送りとなりました。メール送付リクエストまたはお問い合わせをご利用ください。',
    badgePending: '承認待ち',
    badgeRestricted: '要確認',
    noticeGuest: '会員登録・ログイン後に承認されると、全製品のTDSをすぐダウンロードできます。非会員の方も下記フォームからメール送付をご依頼いただけます。',
    noticePending: '現在、会員承認の確認中です。承認完了後はすべてのTDSをすぐダウンロードできます。お急ぎの場合は下記からメール送付をご依頼ください。',
    noticeSuspended: '現在アカウントの直接ダウンロードが停止されています。下記から個別送付をご依頼いただくか、sales@kconstrade.com までご連絡ください。',
    noticeRejected: '現在アカウントは承認見送り状態です。下記から個別送付をご依頼いただくか、sales@kconstrade.com までご連絡ください。',
    nameLabel: 'お名前',
    namePh: '山田 太郎',
    companyLabel: '会社名',
    companyPh: '株式会社〇〇（任意）',
    emailLabel: 'メールアドレス',
    emailPh: 'name@company.com',
    phoneLabel: '電話番号',
    phonePh: '+82 10-1234-5678',
    messageLabel: 'メッセージ',
    messagePh: '用途やご質問があればご記入ください（任意）',
    consentLabel: '個人情報の収集・利用に同意します（必須）',
    consentMeta: '収集項目：お名前・会社名・メール・電話番号・メッセージ ／ 目的：TDS資料のメール送付・お問い合わせ対応 ／ 保有期間：処理完了後1年間',
    success: 'リクエストを受け付けました。担当者が確認のうえメールでお送りします。',
    errName: 'お名前をご入力ください（60文字以内）。',
    errEmail: '有効なメールアドレスをご入力ください。',
    errPhone: '電話番号は数字・記号（+-().スペース）5〜30文字でご入力ください。',
    errConsent: '個人情報の収集・利用に同意してください。',
    errInvalid: '入力内容をご確認ください。必須項目やメールアドレス・電話番号の形式をお確かめください。',
    errForbidden: 'リクエストを確認できませんでした。ページを再読み込みして再度お試しください。',
    errRateLimited: '短時間のリクエスト上限に達しました。しばらくしてから再度お試しいただくか、sales@kconstrade.com までご連絡ください。',
    errServer: '一時的なエラーが発生しました。しばらくしてから再度お試しいただくか、sales@kconstrade.com までご連絡ください。',
  },
} as const

const EMAIL_RE = /^[^@\s<>]+@[^@\s<>]+\.[^@\s<>]+$/
const PHONE_RE = /^[0-9+\-()\s.]{5,30}$/

interface FieldErrors {
  name?: string
  email?: string
  phone?: string
  consent?: string
}

interface TdsModalProps {
  slug: string
  productName: string
  lang: TdsLang
  auth: AuthSnapshot
  onClose: () => void
}

function TdsRequestModal({ slug, productName, lang, auth, onClose }: TdsModalProps) {
  const t = COPY[lang]
  const uid = useId()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const consentRef = useRef<HTMLInputElement>(null)
  const openedAtRef = useRef<number>(Date.now())

  const [name, setName] = useState(() => auth.name)
  const [company, setCompany] = useState(() => auth.company)
  const [email, setEmail] = useState(() => auth.email)
  const [phone, setPhone] = useState(() => auth.phone)
  const [message, setMessage] = useState('')
  const [consent, setConsent] = useState(false)
  const [website, setWebsite] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    openedAtRef.current = Date.now()
    if (!dialog.open) {
      dialog.showModal()
    }

    // closedby="any" 미지원 브라우저(Safari 등)용 라이트 디스미스 폴백
    const needsFallback = typeof HTMLDialogElement !== 'undefined' && !('closedBy' in HTMLDialogElement.prototype)
    if (!needsFallback) return

    const isOutside = (e: PointerEvent) => {
      const r = dialog.getBoundingClientRect()
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom
    }
    let pressedOutside = false
    const onPointerDown = (e: PointerEvent) => {
      pressedOutside = isOutside(e)
    }
    const onPointerUp = (e: PointerEvent) => {
      if (pressedOutside && isOutside(e)) {
        dialog.close()
      }
      pressedOutside = false
    }
    dialog.addEventListener('pointerdown', onPointerDown)
    dialog.addEventListener('pointerup', onPointerUp)
    return () => {
      dialog.removeEventListener('pointerdown', onPointerDown)
      dialog.removeEventListener('pointerup', onPointerUp)
    }
  }, [])

  const closeDialog = () => {
    const dialog = dialogRef.current
    if (dialog && dialog.open) {
      dialog.close()
    } else {
      onClose()
    }
  }

  const validateField = (field: keyof FieldErrors, val?: string | boolean): string | undefined => {
    if (field === 'name') {
      const v = (typeof val === 'string' ? val : name).trim()
      if (!v || v.length > 60) return t.errName
      return undefined
    }
    if (field === 'email') {
      const v = (typeof val === 'string' ? val : email).trim()
      if (!v || v.length > 254 || !EMAIL_RE.test(v)) return t.errEmail
      return undefined
    }
    if (field === 'phone') {
      const v = (typeof val === 'string' ? val : phone).trim()
      if (v && !PHONE_RE.test(v)) return t.errPhone
      return undefined
    }
    if (field === 'consent') {
      const v = typeof val === 'boolean' ? val : consent
      if (!v) return t.errConsent
      return undefined
    }
    return undefined
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (submitting) return
    setServerError(null)

    const nextErrors: FieldErrors = {
      name: validateField('name'),
      email: validateField('email'),
      phone: validateField('phone'),
      consent: validateField('consent'),
    }
    setFieldErrors(nextErrors)

    if (nextErrors.name) {
      nameRef.current?.focus()
      return
    }
    if (nextErrors.email) {
      emailRef.current?.focus()
      return
    }
    if (nextErrors.phone) {
      phoneRef.current?.focus()
      return
    }
    if (nextErrors.consent) {
      consentRef.current?.focus()
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/tds/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          name: name.trim(),
          company: company.trim(),
          email: email.trim(),
          phone: phone.trim(),
          message: message.trim(),
          consent: true,
          website,
          ts: openedAtRef.current,
        }),
      })
      const data = await res.json().catch(() => null)
      if (res.ok && data?.ok === true) {
        setSubmitted(true)
        return
      }
      const code = typeof data?.code === 'string' ? data.code : ''
      if (code === 'rate_limited' || res.status === 429) {
        setServerError(t.errRateLimited)
      } else if (code === 'invalid' || res.status === 400) {
        setServerError(t.errInvalid)
      } else if (code === 'forbidden' || res.status === 403) {
        setServerError(t.errForbidden)
      } else {
        setServerError(t.errServer)
      }
    } catch {
      setServerError(t.errServer)
    } finally {
      setSubmitting(false)
    }
  }

  const titleId = `${uid}-title`
  const isWarnNotice = auth.status === 'suspended' || auth.status === 'rejected'
  const noticeText =
    !auth.authenticated
      ? t.noticeGuest
      : auth.status === 'pending'
      ? t.noticePending
      : auth.status === 'suspended'
      ? t.noticeSuspended
      : t.noticeRejected

  return (
    <dialog
      ref={dialogRef}
      className="kct-tds-dialog"
      aria-labelledby={titleId}
      onClose={() => {
        if (dialogRef.current) dialogRef.current.returnValue = ''
        onClose()
      }}
      {...({ closedby: 'any' } as Record<string, string>)}
    >
      <div className="kct-tds-dlg-head">
        <div>
          <div className="kct-tds-dlg-eyebrow">{t.modalEyebrow}</div>
          <h1 id={titleId} className="kct-tds-dlg-title">
            {t.modalTitle(productName)}
          </h1>
        </div>
        <button
          type="button"
          className="kct-tds-dlg-close"
          aria-label={t.close}
          onClick={closeDialog}
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>

      <div className="kct-tds-dlg-body">
        {submitted ? (
          <div>
            <div className="kct-tds-alert kct-tds-alert-ok" role="status" aria-live="polite">
              {t.success}
            </div>
            <div className="kct-tds-actions">
              <button type="button" className="kct-tds-submit" onClick={closeDialog} autoFocus>
                {t.close}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className={`kct-tds-notice${isWarnNotice ? ' kct-tds-notice-warn' : ''}`}>
              <div>{noticeText}</div>
              {!auth.authenticated && (
                <div className="kct-tds-notice-links">
                  <Link href={`/${lang}/auth/login`} onClick={closeDialog}>
                    {t.login}
                  </Link>
                  <Link href={`/${lang}/auth/signup`} onClick={closeDialog}>
                    {t.signup}
                  </Link>
                </div>
              )}
            </div>

            {serverError && (
              <div className="kct-tds-alert kct-tds-alert-err" role="alert" aria-live="assertive">
                {serverError}
              </div>
            )}

            <form method="POST" action="/api/tds/request" noValidate onSubmit={handleSubmit}>
              {/* 허니팟: 사람과 보조기술에 숨김 */}
              <div className="kct-tds-hp" aria-hidden="true">
                <label htmlFor={`${uid}-website`}>Website</label>
                <input
                  id={`${uid}-website`}
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <div className="kct-tds-field">
                <label htmlFor={`${uid}-name`}>
                  {t.nameLabel}
                  <span className="kct-tds-req" aria-hidden="true">*</span>
                </label>
                <input
                  ref={nameRef}
                  id={`${uid}-name`}
                  name="name"
                  type="text"
                  className="kct-tds-input"
                  placeholder={t.namePh}
                  autoComplete="name"
                  enterKeyHint="next"
                  maxLength={60}
                  required
                  autoFocus
                  value={name}
                  aria-invalid={fieldErrors.name ? 'true' : undefined}
                  aria-describedby={fieldErrors.name ? `${uid}-name-err` : undefined}
                  onChange={(e) => {
                    const next = e.target.value
                    setName(next)
                    if (fieldErrors.name && !validateField('name', next)) {
                      setFieldErrors((prev) => ({ ...prev, name: undefined }))
                    }
                  }}
                  onBlur={() => {
                    if (name) {
                      setFieldErrors((prev) => ({ ...prev, name: validateField('name') }))
                    }
                  }}
                />
                {fieldErrors.name && (
                  <div id={`${uid}-name-err`} className="kct-tds-ferr" role="alert">
                    {fieldErrors.name}
                  </div>
                )}
              </div>

              <div className="kct-tds-field">
                <label htmlFor={`${uid}-company`}>{t.companyLabel}</label>
                <input
                  id={`${uid}-company`}
                  name="company"
                  type="text"
                  className="kct-tds-input"
                  placeholder={t.companyPh}
                  autoComplete="organization"
                  enterKeyHint="next"
                  maxLength={100}
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              <div className="kct-tds-field">
                <label htmlFor={`${uid}-email`}>
                  {t.emailLabel}
                  <span className="kct-tds-req" aria-hidden="true">*</span>
                </label>
                <input
                  ref={emailRef}
                  id={`${uid}-email`}
                  name="email"
                  type="email"
                  className="kct-tds-input"
                  placeholder={t.emailPh}
                  autoComplete="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="next"
                  maxLength={254}
                  required
                  value={email}
                  aria-invalid={fieldErrors.email ? 'true' : undefined}
                  aria-describedby={fieldErrors.email ? `${uid}-email-err` : undefined}
                  onChange={(e) => {
                    const next = e.target.value
                    setEmail(next)
                    if (fieldErrors.email && !validateField('email', next)) {
                      setFieldErrors((prev) => ({ ...prev, email: undefined }))
                    }
                  }}
                  onBlur={() => {
                    if (email) {
                      setFieldErrors((prev) => ({ ...prev, email: validateField('email') }))
                    }
                  }}
                />
                {fieldErrors.email && (
                  <div id={`${uid}-email-err`} className="kct-tds-ferr" role="alert">
                    {fieldErrors.email}
                  </div>
                )}
              </div>

              <div className="kct-tds-field">
                <label htmlFor={`${uid}-phone`}>{t.phoneLabel}</label>
                <input
                  ref={phoneRef}
                  id={`${uid}-phone`}
                  name="phone"
                  type="tel"
                  className="kct-tds-input"
                  placeholder={t.phonePh}
                  autoComplete="tel"
                  inputMode="tel"
                  enterKeyHint="next"
                  maxLength={30}
                  pattern="[0-9+\-()\s.]{5,30}"
                  value={phone}
                  aria-invalid={fieldErrors.phone ? 'true' : undefined}
                  aria-describedby={fieldErrors.phone ? `${uid}-phone-err` : undefined}
                  onChange={(e) => {
                    const next = e.target.value
                    setPhone(next)
                    if (fieldErrors.phone && !validateField('phone', next)) {
                      setFieldErrors((prev) => ({ ...prev, phone: undefined }))
                    }
                  }}
                  onBlur={() => {
                    if (phone.trim()) {
                      setFieldErrors((prev) => ({ ...prev, phone: validateField('phone') }))
                    }
                  }}
                />
                {fieldErrors.phone && (
                  <div id={`${uid}-phone-err`} className="kct-tds-ferr" role="alert">
                    {fieldErrors.phone}
                  </div>
                )}
              </div>

              <div className="kct-tds-field">
                <label htmlFor={`${uid}-message`}>{t.messageLabel}</label>
                <textarea
                  id={`${uid}-message`}
                  name="message"
                  className="kct-tds-textarea"
                  rows={3}
                  placeholder={t.messagePh}
                  maxLength={1000}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div className="kct-tds-consent">
                <div className="kct-tds-consent-row">
                  <input
                    ref={consentRef}
                    id={`${uid}-consent`}
                    name="consent"
                    type="checkbox"
                    required
                    checked={consent}
                    aria-invalid={fieldErrors.consent ? 'true' : undefined}
                    aria-describedby={`${uid}-consent-meta${fieldErrors.consent ? ` ${uid}-consent-err` : ''}`}
                    onChange={(e) => {
                      const next = e.target.checked
                      setConsent(next)
                      if (fieldErrors.consent && next) {
                        setFieldErrors((prev) => ({ ...prev, consent: undefined }))
                      }
                    }}
                  />
                  <label htmlFor={`${uid}-consent`}>
                    {t.consentLabel}
                    <span className="kct-tds-req" aria-hidden="true">*</span>
                  </label>
                </div>
                <p id={`${uid}-consent-meta`} className="kct-tds-consent-meta">
                  {t.consentMeta}
                </p>
                {fieldErrors.consent && (
                  <div id={`${uid}-consent-err`} className="kct-tds-ferr" role="alert">
                    {fieldErrors.consent}
                  </div>
                )}
              </div>

              <div className="kct-tds-actions">
                <button type="button" className="kct-tds-cancel" onClick={closeDialog}>
                  {t.cancel}
                </button>
                <button type="submit" className="kct-tds-submit" disabled={submitting}>
                  {submitting ? t.submitting : t.submit}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </dialog>
  )
}

export interface TdsAccessProps {
  slug: string
  productName: string
  lang: string
  variant?: 'button' | 'link'
  /** 카드 버튼 슬롯처럼 좁은 영역에서는 인라인 안내를 생략하고 모달 안에서 표시 */
  compact?: boolean
  className?: string
}

export default function TdsAccess({
  slug,
  productName,
  lang,
  variant = 'button',
  compact = false,
  className,
}: TdsAccessProps) {
  const l = normLang(lang)
  const t = COPY[l]
  const auth = useTdsAuth()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    ensureStyles()
  }, [])

  useEffect(() => {
    return registerModalOpener(slug, () => setOpen(true))
  }, [slug])

  const isApproved = !auth.loading && auth.authenticated && auth.status === 'approved'
  const isPending = !auth.loading && auth.authenticated && auth.status === 'pending'
  const isSuspended = !auth.loading && auth.authenticated && auth.status === 'suspended'
  const isRejected = !auth.loading && auth.authenticated && auth.status === 'rejected'
  const downloadHref = `/api/tds/download/${encodeURIComponent(slug)}`

  if (variant === 'link') {
    return (
      <>
        <span className={`kct-tds-link-wrap${className ? ` ${className}` : ''}`}>
          {isApproved ? (
            <a href={downloadHref} className="kct-tds-link" data-tds-download={slug}>
              <i className="bi bi-file-earmark-pdf" aria-hidden="true" />
              <span>{t.downloadLabel}</span>
            </a>
          ) : (
            <>
              <button
                type="button"
                className="kct-tds-link"
                onClick={() => setOpen(true)}
                aria-haspopup="dialog"
              >
                <i className="bi bi-file-earmark-pdf" aria-hidden="true" />
                <span>{t.requestLabel}</span>
              </button>
              {isPending && <span className="kct-tds-badge">{t.badgePending}</span>}
              {(isSuspended || isRejected) && (
                <span className="kct-tds-badge kct-tds-badge-warn">{t.badgeRestricted}</span>
              )}
            </>
          )}
        </span>
        {open && (
          <TdsRequestModal
            slug={slug}
            productName={productName}
            lang={l}
            auth={auth}
            onClose={() => setOpen(false)}
          />
        )}
      </>
    )
  }

  // variant === 'button'
  if (compact) {
    return (
      <>
        {isApproved ? (
          <a
            href={downloadHref}
            className={className ? `kct-tds-btn kct-tds-btn-dl ${className}` : 'kct-tds-btn kct-tds-btn-dl'}
            data-tds-download={slug}
          >
            <i className="bi bi-file-earmark-pdf" aria-hidden="true" />
            <span>{t.downloadLabel}</span>
          </a>
        ) : (
          <button
            type="button"
            className={className ? `kct-tds-btn ${className}` : 'kct-tds-btn'}
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
          >
            <i className="bi bi-file-earmark-pdf" aria-hidden="true" />
            <span>{t.requestLabel}</span>
          </button>
        )}
        {open && (
          <TdsRequestModal
            slug={slug}
            productName={productName}
            lang={l}
            auth={auth}
            onClose={() => setOpen(false)}
          />
        )}
      </>
    )
  }

  return (
    <div className={`kct-tds-wrap${className ? ` ${className}` : ''}`}>
      {isApproved ? (
        <a href={downloadHref} className="kct-tds-btn kct-tds-btn-dl" data-tds-download={slug}>
          <i className="bi bi-file-earmark-pdf" aria-hidden="true" />
          <span>{t.downloadLabel}</span>
        </a>
      ) : (
        <>
          <button
            type="button"
            className="kct-tds-btn"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
          >
            <i className="bi bi-file-earmark-pdf" aria-hidden="true" />
            <span>{t.requestLabel}</span>
          </button>
          {!auth.loading && !auth.authenticated && (
            <span className="kct-tds-hint">
              <Link href={`/${l}/auth/signup`}>{t.signup}</Link>
              {' · '}
              <Link href={`/${l}/auth/login`}>{t.login}</Link>
              {' — '}
              {t.inlineGuestPre}
            </span>
          )}
          {isPending && <span className="kct-tds-hint">{t.inlinePending}</span>}
          {isSuspended && <span className="kct-tds-hint">{t.inlineSuspended}</span>}
          {isRejected && <span className="kct-tds-hint">{t.inlineRejected}</span>}
        </>
      )}
      {open && (
        <TdsRequestModal
          slug={slug}
          productName={productName}
          lang={l}
          auth={auth}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  )
}

/**
 * /tds?product=<slug> 진입 시 해당 행을 강조·스크롤하고(승인 회원이 아니면) 요청 폼 모달을 자동으로 연다.
 * Next.js 16 SSG 유지를 위해 호출부에서 <Suspense fallback={null}>로 감싸야 한다.
 */
export function TdsCenterAutoOpen() {
  const searchParams = useSearchParams()
  const auth = useTdsAuth()
  const handledRef = useRef<string | null>(null)
  const productSlug = searchParams.get('product')?.trim() || ''

  useEffect(() => {
    ensureStyles()
  }, [])

  useEffect(() => {
    if (!productSlug) return
    const row = document.getElementById(`tds-row-${productSlug}`)
    if (!row) return

    row.classList.add('kct-tds-row-highlight')
    row.scrollIntoView({ behavior: 'smooth', block: 'center' })

    return () => {
      row.classList.remove('kct-tds-row-highlight')
    }
  }, [productSlug])

  useEffect(() => {
    if (!productSlug || auth.loading) return
    if (handledRef.current === productSlug) return
    handledRef.current = productSlug

    const isApproved = auth.authenticated && auth.status === 'approved'
    if (isApproved) {
      const dl = document.querySelector<HTMLAnchorElement>(`[data-tds-download="${CSS.escape(productSlug)}"]`)
      dl?.focus({ preventScroll: true })
      return
    }
    // 공개 LEED 확인서(dowsil-1200-os)는 모달이 없으므로 등록된 TDS 행에 대해서만 자동 오픈
    openModalBySlug(productSlug)
  }, [productSlug, auth.loading, auth.authenticated, auth.status])

  return null
}
