'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const TIERS = ['standard', 'silver', 'gold', 'platinum'] as const
const TIER_LABELS: Record<string, string> = { standard: '일반', silver: '실버', gold: '골드', platinum: '플래티넘' }
const TIER_DESC: Record<string, string> = {
  standard: '기본 거래 고객',
  silver: '우수 거래 고객 (소량 할인)',
  gold: '핵심 거래 고객 (중량 할인)',
  platinum: 'VIP 고객 (최대 할인)',
}
const TIER_COLOR: Record<string, string> = {
  standard: '#6c757d', silver: '#0dcaf0', gold: '#ffc107', platinum: '#0d6efd',
}

const CUSTOMER_TYPES = [
  { value: 'contractor', label: '시공사' },
  { value: 'dealer', label: '대리점' },
  { value: 'distributor', label: '유통사' },
  { value: 'end_user', label: '최종사용자' },
  { value: 'trading', label: '트레이딩' },
  { value: 'manufacturer', label: '제조사' },
  { value: 'other', label: '기타' },
]

const CURRENCIES = ['KRW', 'USD', 'JPY', 'CNY', 'EUR', 'SGD', 'AUD']

const PAYMENT_TERMS_OPTIONS = [
  'T/T 선불 (Advance)',
  'T/T 30일',
  'T/T 60일',
  'T/T 90일',
  'L/C at Sight',
  'L/C 30일',
  'L/C 60일',
  'D/A 30일',
  'D/P',
  '현금',
]

const ACQUISITION_SOURCES = [
  '전시회 / 박람회',
  '소개 (기존 고객)',
  '소개 (내부 직원)',
  '웹사이트 문의',
  '콜드콜',
  '해외 에이전트',
  '링크드인',
  '기타',
]

const COUNTRIES = [
  '대한민국', '미국', '일본', '중국', '대만', '싱가포르', '호주', '인도',
  '베트남', '태국', '말레이시아', '인도네시아', '필리핀', '홍콩', '아랍에미리트',
  '사우디아라비아', '독일', '영국', '프랑스', '캐나다', '기타',
]

interface CustomerFormData {
  // 회사
  company_name: string
  company_name_en: string
  business_reg_number: string
  customer_type: string
  country: string
  address: string
  website: string
  // 담당자 1
  contact_person: string
  contact_title: string
  phone: string
  fax: string
  email: string
  // 담당자 2
  contact2_name: string
  contact2_title: string
  contact2_phone: string
  contact2_email: string
  // 메신저
  whatsapp: string
  wechat: string
  kakao_id: string
  line_id: string
  // 소셜
  linkedin: string
  instagram: string
  facebook: string
  twitter: string
  youtube: string
  // 거래 조건
  currency: string
  payment_terms: string
  credit_limit: string
  // CRM
  acquisition_source: string
  first_deal_date: string
  next_followup_at: string
  // 내부
  tier: string
  is_verified: boolean
  notes: string
}

const EMPTY: CustomerFormData = {
  company_name: '', company_name_en: '', business_reg_number: '',
  customer_type: 'other', country: '대한민국', address: '', website: '',
  contact_person: '', contact_title: '', phone: '', fax: '', email: '',
  contact2_name: '', contact2_title: '', contact2_phone: '', contact2_email: '',
  whatsapp: '', wechat: '', kakao_id: '', line_id: '',
  linkedin: '', instagram: '', facebook: '', twitter: '', youtube: '',
  currency: 'KRW', payment_terms: '', credit_limit: '',
  acquisition_source: '', first_deal_date: '', next_followup_at: '',
  tier: 'standard', is_verified: false, notes: '',
}

function SectionHeader({ icon, label, color, bg }: { icon: string; label: string; color: string; bg: string }) {
  return (
    <h6 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
      <span className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
        style={{ width: 28, height: 28, background: bg }}>
        <i className={`bi ${icon}`} style={{ color, fontSize: '0.85rem' }} />
      </span>
      {label}
    </h6>
  )
}

export default function CustomerFormPage({
  mode, customerId, initial,
}: {
  mode: 'new' | 'edit'
  customerId?: string
  initial?: Partial<CustomerFormData>
}) {
  const [form, setForm] = useState<CustomerFormData>({ ...EMPTY, ...initial })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showContact2, setShowContact2] = useState(
    !!(initial?.contact2_name || initial?.contact2_email || initial?.contact2_phone)
  )
  const router = useRouter()
  const supabase = createClient()

  function set<K extends keyof CustomerFormData>(key: K, value: CustomerFormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
    setError(null)
  }

  function formatBizNum(v: string) {
    const d = v.replace(/\D/g, '').slice(0, 10)
    if (d.length <= 3) return d
    if (d.length <= 5) return `${d.slice(0, 3)}-${d.slice(3)}`
    return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`
  }

  function formatPhone(v: string) {
    const d = v.replace(/\D/g, '').slice(0, 11)
    if (d.length <= 3) return d
    if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`
    return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.company_name.trim()) { setError('회사명은 필수 항목입니다.'); return }

    setSaving(true)
    setError(null)

    const payload = {
      company_name: form.company_name.trim() || null,
      company_name_en: form.company_name_en.trim() || null,
      business_reg_number: form.business_reg_number.trim() || null,
      customer_type: form.customer_type || null,
      country: form.country.trim() || null,
      address: form.address.trim() || null,
      website: form.website.trim() || null,
      contact_person: form.contact_person.trim() || null,
      contact_title: form.contact_title.trim() || null,
      phone: form.phone.trim() || null,
      fax: form.fax.trim() || null,
      email: form.email.trim() || null,
      contact2_name: form.contact2_name.trim() || null,
      contact2_title: form.contact2_title.trim() || null,
      contact2_phone: form.contact2_phone.trim() || null,
      contact2_email: form.contact2_email.trim() || null,
      whatsapp: form.whatsapp.trim() || null,
      wechat: form.wechat.trim() || null,
      kakao_id: form.kakao_id.trim() || null,
      line_id: form.line_id.trim() || null,
      linkedin: form.linkedin.trim() || null,
      instagram: form.instagram.trim() || null,
      facebook: form.facebook.trim() || null,
      twitter: form.twitter.trim() || null,
      youtube: form.youtube.trim() || null,
      currency: form.currency || 'KRW',
      payment_terms: form.payment_terms.trim() || null,
      credit_limit: form.credit_limit ? Number(form.credit_limit) : null,
      acquisition_source: form.acquisition_source.trim() || null,
      first_deal_date: form.first_deal_date || null,
      next_followup_at: form.next_followup_at || null,
      tier: form.tier,
      is_verified: form.is_verified,
      notes: form.notes.trim() || null,
      updated_at: new Date().toISOString(),
    }

    try {
      if (mode === 'edit' && customerId) {
        const { error } = await supabase.from('admin_contacts').update(payload).eq('id', customerId)
        if (error) throw error
      } else {
        const { error } = await supabase.from('admin_contacts').insert(payload)
        if (error) throw error
      }
      router.push('/admin/customers')
      router.refresh()
    } catch (e: any) {
      setError(e.message)
      setSaving(false)
    }
  }

  const isKorean = form.country === '대한민국'

  return (
    <div>
      {/* 헤더 */}
      <div className="d-flex align-items-center gap-3 mb-5">
        <a href="/admin/customers" className="btn btn-outline-secondary btn-sm rounded-pill px-3">
          <i className="bi bi-arrow-left me-1" />목록
        </a>
        <div>
          <h1 className="h3 fw-bold text-dark mb-0">
            {mode === 'new' ? '신규 고객 등록' : '고객 정보 수정'}
          </h1>
          <p className="text-body-secondary small mb-0">
            {mode === 'new' ? '새 고객사의 정보를 입력하세요' : `${form.company_name || '고객'} 정보를 수정합니다`}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">

          {/* ── 좌측 컬럼 ── */}
          <div className="col-lg-8">

            {/* 회사 정보 */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <SectionHeader icon="bi-building" label="회사 정보" color="#1558D6" bg="#EFF6FF" />
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold" style={{ fontSize: '0.875rem' }}>
                      회사명 (국문) <span className="text-danger">*</span>
                    </label>
                    <input className="form-control" value={form.company_name}
                      onChange={e => set('company_name', e.target.value)}
                      placeholder="(주)한국건설트레이딩" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold" style={{ fontSize: '0.875rem' }}>
                      회사명 (영문) <span className="text-body-secondary fw-normal" style={{ fontSize: '0.75rem' }}>문서 출력용</span>
                    </label>
                    <input className="form-control" value={form.company_name_en}
                      onChange={e => set('company_name_en', e.target.value)}
                      placeholder="Korea Construction Trading Co., Ltd." />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold" style={{ fontSize: '0.875rem' }}>국가</label>
                    <select className="form-select" value={form.country}
                      onChange={e => set('country', e.target.value)}>
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold" style={{ fontSize: '0.875rem' }}>고객 유형</label>
                    <select className="form-select" value={form.customer_type}
                      onChange={e => set('customer_type', e.target.value)}>
                      {CUSTOMER_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold" style={{ fontSize: '0.875rem' }}>
                      {isKorean ? '사업자등록번호' : '세금번호 / Tax ID'}
                    </label>
                    <input className="form-control" value={form.business_reg_number}
                      onChange={e => set('business_reg_number', isKorean ? formatBizNum(e.target.value) : e.target.value)}
                      placeholder={isKorean ? '000-00-00000' : 'Tax ID / VAT No.'} maxLength={isKorean ? 12 : 40} />
                  </div>
                  <div className="col-md-8">
                    <label className="form-label fw-bold" style={{ fontSize: '0.875rem' }}>주소</label>
                    <input className="form-control" value={form.address}
                      onChange={e => set('address', e.target.value)}
                      placeholder="서울특별시 강남구 / 123 Business Rd, Singapore" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold" style={{ fontSize: '0.875rem' }}>웹사이트</label>
                    <input className="form-control" value={form.website}
                      onChange={e => set('website', e.target.value)}
                      placeholder="https://example.com" type="url" />
                  </div>
                </div>
              </div>
            </div>

            {/* 담당자 1 */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <SectionHeader icon="bi-person-badge" label="주 담당자" color="#059669" bg="#D1FAE5" />
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label fw-bold" style={{ fontSize: '0.875rem' }}>담당자명</label>
                    <input className="form-control" value={form.contact_person}
                      onChange={e => set('contact_person', e.target.value)} placeholder="홍길동 / John Kim" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold" style={{ fontSize: '0.875rem' }}>직책 / Position</label>
                    <input className="form-control" value={form.contact_title}
                      onChange={e => set('contact_title', e.target.value)}
                      placeholder="구매팀장 / Purchasing Manager" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold" style={{ fontSize: '0.875rem' }}>연락처</label>
                    <input className="form-control" value={form.phone}
                      onChange={e => set('phone', isKorean ? formatPhone(e.target.value) : e.target.value)}
                      placeholder={isKorean ? '010-0000-0000' : '+1-555-0000'} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold" style={{ fontSize: '0.875rem' }}>팩스</label>
                    <input className="form-control" value={form.fax}
                      onChange={e => set('fax', e.target.value)} placeholder="02-0000-0000" />
                  </div>
                  <div className="col-md-8">
                    <label className="form-label fw-bold" style={{ fontSize: '0.875rem' }}>이메일</label>
                    <input className="form-control" type="email" value={form.email}
                      onChange={e => set('email', e.target.value)} placeholder="example@company.com" />
                  </div>
                </div>

                {/* 담당자 2 토글 */}
                <div className="mt-3 pt-3 border-top">
                  {!showContact2 ? (
                    <button type="button" className="btn btn-sm btn-outline-secondary rounded-pill"
                      onClick={() => setShowContact2(true)}>
                      <i className="bi bi-plus me-1" />담당자 추가
                    </button>
                  ) : (
                    <>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <span className="fw-bold text-body-secondary" style={{ fontSize: '0.85rem' }}>
                          <i className="bi bi-person me-1" />담당자 2
                        </span>
                        <button type="button" className="btn btn-sm btn-link text-danger p-0"
                          onClick={() => { setShowContact2(false); set('contact2_name', ''); set('contact2_title', ''); set('contact2_phone', ''); set('contact2_email', '') }}>
                          <i className="bi bi-x-circle me-1" />제거
                        </button>
                      </div>
                      <div className="row g-3">
                        <div className="col-md-3">
                          <label className="form-label" style={{ fontSize: '0.8rem' }}>담당자명</label>
                          <input className="form-control form-control-sm" value={form.contact2_name}
                            onChange={e => set('contact2_name', e.target.value)} placeholder="이름" />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label" style={{ fontSize: '0.8rem' }}>직책</label>
                          <input className="form-control form-control-sm" value={form.contact2_title}
                            onChange={e => set('contact2_title', e.target.value)} placeholder="직책" />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label" style={{ fontSize: '0.8rem' }}>연락처</label>
                          <input className="form-control form-control-sm" value={form.contact2_phone}
                            onChange={e => set('contact2_phone', e.target.value)} placeholder="연락처" />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label" style={{ fontSize: '0.8rem' }}>이메일</label>
                          <input className="form-control form-control-sm" type="email" value={form.contact2_email}
                            onChange={e => set('contact2_email', e.target.value)} placeholder="이메일" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* 메신저 & 소셜 계정 */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <SectionHeader icon="bi-chat-dots-fill" label="메신저 & 소셜 계정" color="#0dcaf0" bg="#e0f7fa" />

                {/* 메신저 */}
                <p className="text-body-secondary mb-2" style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>메신저</p>
                <div className="row g-3 mb-4">
                  <div className="col-md-3">
                    <label className="form-label fw-bold d-flex align-items-center gap-1" style={{ fontSize: '0.875rem' }}>
                      <span style={{ color: '#25D366', fontSize: '1rem' }}>●</span> WhatsApp
                    </label>
                    <div className="input-group">
                      <span className="input-group-text px-2" style={{ background: '#dcfce7', border: '1px solid #bbf7d0' }}>
                        <i className="bi bi-whatsapp" style={{ color: '#25D366' }} />
                      </span>
                      <input className="form-control" value={form.whatsapp}
                        onChange={e => set('whatsapp', e.target.value)} placeholder="+82-10-0000-0000" />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-bold d-flex align-items-center gap-1" style={{ fontSize: '0.875rem' }}>
                      <span style={{ color: '#07C160', fontSize: '1rem' }}>●</span> WeChat
                    </label>
                    <div className="input-group">
                      <span className="input-group-text px-2" style={{ background: '#dcfce7', border: '1px solid #bbf7d0' }}>
                        <i className="bi bi-wechat" style={{ color: '#07C160' }} />
                      </span>
                      <input className="form-control" value={form.wechat}
                        onChange={e => set('wechat', e.target.value)} placeholder="WeChat ID" />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-bold d-flex align-items-center gap-1" style={{ fontSize: '0.875rem' }}>
                      <span style={{ color: '#FFCD00', fontSize: '1rem' }}>●</span> KakaoTalk
                    </label>
                    <div className="input-group">
                      <span className="input-group-text px-2" style={{ background: '#fefce8', border: '1px solid #fef08a' }}>
                        <i className="bi bi-chat-fill" style={{ color: '#3A1D1D' }} />
                      </span>
                      <input className="form-control" value={form.kakao_id}
                        onChange={e => set('kakao_id', e.target.value)} placeholder="카카오 ID" />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-bold d-flex align-items-center gap-1" style={{ fontSize: '0.875rem' }}>
                      <span style={{ color: '#00B900', fontSize: '1rem' }}>●</span> LINE
                    </label>
                    <div className="input-group">
                      <span className="input-group-text px-2" style={{ background: '#dcfce7', border: '1px solid #bbf7d0' }}>
                        <i className="bi bi-chat-square-fill" style={{ color: '#00B900' }} />
                      </span>
                      <input className="form-control" value={form.line_id}
                        onChange={e => set('line_id', e.target.value)} placeholder="LINE ID" />
                    </div>
                  </div>
                </div>

                {/* 소셜 미디어 */}
                <p className="text-body-secondary mb-2" style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>소셜 미디어</p>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label fw-bold" style={{ fontSize: '0.875rem' }}>LinkedIn</label>
                    <div className="input-group">
                      <span className="input-group-text px-2" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
                        <i className="bi bi-linkedin" style={{ color: '#0A66C2' }} />
                      </span>
                      <input className="form-control" value={form.linkedin}
                        onChange={e => set('linkedin', e.target.value)} placeholder="linkedin.com/in/..." />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold" style={{ fontSize: '0.875rem' }}>Instagram</label>
                    <div className="input-group">
                      <span className="input-group-text px-2" style={{ background: '#fdf2f8', border: '1px solid #f9a8d4' }}>
                        <i className="bi bi-instagram" style={{ color: '#E1306C' }} />
                      </span>
                      <input className="form-control" value={form.instagram}
                        onChange={e => set('instagram', e.target.value)} placeholder="@username" />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold" style={{ fontSize: '0.875rem' }}>Facebook</label>
                    <div className="input-group">
                      <span className="input-group-text px-2" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
                        <i className="bi bi-facebook" style={{ color: '#1877F2' }} />
                      </span>
                      <input className="form-control" value={form.facebook}
                        onChange={e => set('facebook', e.target.value)} placeholder="facebook.com/..." />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold" style={{ fontSize: '0.875rem' }}>X (Twitter)</label>
                    <div className="input-group">
                      <span className="input-group-text px-2" style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
                        <i className="bi bi-twitter-x" style={{ color: '#000' }} />
                      </span>
                      <input className="form-control" value={form.twitter}
                        onChange={e => set('twitter', e.target.value)} placeholder="@handle" />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold" style={{ fontSize: '0.875rem' }}>YouTube</label>
                    <div className="input-group">
                      <span className="input-group-text px-2" style={{ background: '#fff1f2', border: '1px solid #fecdd3' }}>
                        <i className="bi bi-youtube" style={{ color: '#FF0000' }} />
                      </span>
                      <input className="form-control" value={form.youtube}
                        onChange={e => set('youtube', e.target.value)} placeholder="youtube.com/@..." />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 거래 조건 */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <SectionHeader icon="bi-currency-exchange" label="거래 조건" color="#7C3AED" bg="#F5F3FF" />
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label fw-bold" style={{ fontSize: '0.875rem' }}>선호 통화</label>
                    <select className="form-select" value={form.currency}
                      onChange={e => set('currency', e.target.value)}>
                      {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="col-md-8">
                    <label className="form-label fw-bold" style={{ fontSize: '0.875rem' }}>결제 조건</label>
                    <select className="form-select" value={form.payment_terms}
                      onChange={e => set('payment_terms', e.target.value)}>
                      <option value="">선택...</option>
                      {PAYMENT_TERMS_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold" style={{ fontSize: '0.875rem' }}>
                      신용 한도 <span className="text-body-secondary fw-normal" style={{ fontSize: '0.75rem' }}>({form.currency})</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">{form.currency}</span>
                      <input className="form-control" type="number" min="0" value={form.credit_limit}
                        onChange={e => set('credit_limit', e.target.value)}
                        placeholder="0" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CRM 정보 */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <SectionHeader icon="bi-graph-up-arrow" label="CRM 정보" color="#D97706" bg="#FEF3C7" />
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label fw-bold" style={{ fontSize: '0.875rem' }}>유입 경로</label>
                    <select className="form-select" value={form.acquisition_source}
                      onChange={e => set('acquisition_source', e.target.value)}>
                      <option value="">선택...</option>
                      {ACQUISITION_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold" style={{ fontSize: '0.875rem' }}>최초 거래일</label>
                    <input className="form-control" type="date" value={form.first_deal_date}
                      onChange={e => set('first_deal_date', e.target.value)} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold" style={{ fontSize: '0.875rem' }}>
                      다음 팔로우업 <span className="text-body-secondary fw-normal" style={{ fontSize: '0.75rem' }}>예정일</span>
                    </label>
                    <input className="form-control" type="date" value={form.next_followup_at}
                      onChange={e => set('next_followup_at', e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            {/* 내부 메모 */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <SectionHeader icon="bi-sticky" label="내부 메모" color="#6c757d" bg="#f8f9fa" />
                <textarea className="form-control" rows={4} value={form.notes}
                  onChange={e => set('notes', e.target.value)}
                  placeholder="거래 이력, 특이사항, 내부 참고 사항 등 (고객에게 노출되지 않음)" />
              </div>
            </div>
          </div>

          {/* ── 우측 컬럼 ── */}
          <div className="col-lg-4">

            {/* 거래 등급 */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <h6 className="fw-bold text-dark mb-3">거래 등급</h6>
                <div className="d-flex flex-column gap-2">
                  {TIERS.map(t => (
                    <label key={t} className="d-flex align-items-center gap-3 rounded-3 p-3 border"
                      style={{
                        cursor: 'pointer',
                        background: form.tier === t ? TIER_COLOR[t] + '12' : '#fff',
                        borderColor: form.tier === t ? TIER_COLOR[t] + '80' : '#dee2e6',
                        transition: 'all 0.15s',
                      }}>
                      <input type="radio" name="tier" value={t} checked={form.tier === t}
                        onChange={() => set('tier', t)}
                        className="form-check-input mt-0 flex-shrink-0"
                        style={{ accentColor: TIER_COLOR[t] }} />
                      <div>
                        <div className="fw-bold" style={{ fontSize: '0.875rem', color: TIER_COLOR[t] }}>
                          {TIER_LABELS[t]}
                        </div>
                        <div className="text-body-secondary" style={{ fontSize: '0.75rem' }}>{TIER_DESC[t]}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* 인증 상태 */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <h6 className="fw-bold text-dark mb-3">인증 상태</h6>
                <label className="d-flex align-items-center justify-content-between rounded-3 p-3 border"
                  style={{
                    cursor: 'pointer',
                    background: form.is_verified ? '#D1FAE5' : '#f8f9fa',
                    borderColor: form.is_verified ? '#059669' : '#dee2e6',
                    transition: 'all 0.15s',
                  }}>
                  <div>
                    <div className="fw-bold" style={{ fontSize: '0.875rem', color: form.is_verified ? '#059669' : '#6c757d' }}>
                      {form.is_verified ? '인증 고객' : '미인증'}
                    </div>
                    <div className="text-body-secondary" style={{ fontSize: '0.75rem' }}>
                      {form.is_verified ? '계약서 · 사업자등록증 확인 완료' : '서류 미확인 상태'}
                    </div>
                  </div>
                  <div className="form-check form-switch mb-0">
                    <input className="form-check-input" type="checkbox" role="switch"
                      checked={form.is_verified} onChange={e => set('is_verified', e.target.checked)}
                      style={{ width: 40, height: 22, cursor: 'pointer' }} />
                  </div>
                </label>
              </div>
            </div>

            {/* 저장 */}
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                {error && (
                  <div className="alert alert-danger rounded-3 py-2 px-3 mb-3" style={{ fontSize: '0.875rem' }}>
                    <i className="bi bi-exclamation-circle me-1" />{error}
                  </div>
                )}
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary rounded-pill py-2" disabled={saving}>
                    {saving
                      ? <><span className="spinner-border spinner-border-sm me-2" />저장 중...</>
                      : <><i className={`bi ${mode === 'new' ? 'bi-person-plus' : 'bi-check-lg'} me-2`} />
                        {mode === 'new' ? '고객 등록' : '변경 저장'}</>}
                  </button>
                  <a href="/admin/customers" className="btn btn-outline-secondary rounded-pill py-2">취소</a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </form>
    </div>
  )
}
