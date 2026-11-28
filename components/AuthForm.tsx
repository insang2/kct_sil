'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface AuthFormProps {
  mode: 'login' | 'signup'
  lang: string
  dict: {
    auth: {
      login_title: string
      signup_title: string
      email: string
      password: string
      company_name: string
      business_reg: string
      contact_person: string
      phone: string
      btn_login: string
      btn_signup: string
      no_account: string
      have_account: string
      signup_link: string
      login_link: string
      signup_confirm: string
      error_invalid: string
      error_generic: string
    }
  }
}

export default function AuthForm({ mode, lang, dict }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [businessReg, setBusinessReg] = useState('')
  const [contactPerson, setContactPerson] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const router = useRouter()
  const supabase = createClient()
  const t = dict.auth
  const isEn = lang === 'en'
  const isJa = lang === 'ja'

  const ph = isEn
    ? { company: 'e.g. ABC Construction Co.', reg: 'e.g. 000-00-00000', contact: 'e.g. John Doe', phone: 'e.g. +82 10-1234-5678' }
    : isJa
    ? { company: '例: ABC建設株式会社', reg: '例: 000-00-00000', contact: '例: 山田太郎', phone: '例: +81 90-1234-5678' }
    : { company: '예: 한국건설(주)', reg: '예: 000-00-00000', contact: '예: 홍길동', phone: '예: 010-1234-5678' }

  const inputStyle = {
    minHeight: 48,
    fontSize: 'max(1rem, 1em)',
    borderColor: 'rgba(22,24,28,.24)',
    backgroundColor: '#fff',
    color: '#16181C',
  } as const

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(t.error_invalid)
      } else {
        router.push(`/${lang}/quote`)
        router.refresh()
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/${lang}/quote`,
          data: {
            company_name: companyName,
            business_reg_number: businessReg,
            contact_person: contactPerson,
            phone,
          },
        },
      })
      if (error) {
        setError(t.error_generic)
      } else if (data.user) {
        // Insert profile row
        await supabase.from('profiles').upsert({
          id: data.user.id,
          company_name: companyName,
          business_reg_number: businessReg,
          contact_person: contactPerson,
          phone,
        })
        setSuccess(t.signup_confirm)
      }
    }
    setLoading(false)
  }

  return (
    <div className="border rounded-4 p-4 p-md-5" style={{ background: '#fff' }}>
      <div className="tx-no mb-1">{mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}</div>
      <h2 id="auth-form-heading" className="fw-bold mb-4 h4">
        {mode === 'login' ? t.login_title : t.signup_title}
      </h2>

      {error && (
        <div className="alert alert-danger rounded-3 mb-4" role="alert" aria-live="assertive">{error}</div>
      )}
      {success && (
        <div className="alert alert-success rounded-3 mb-4" role="alert" aria-live="polite">{success}</div>
      )}

      <form onSubmit={handleSubmit} aria-labelledby="auth-form-heading">
        {mode === 'signup' && (
          <>
            <div className="mb-3">
              <label className="form-label fw-semibold small" htmlFor="auth-company_name" style={{ color: 'var(--tx-fg)' }}>
                {t.company_name} <span className="text-danger" aria-hidden="true">*</span>
              </label>
              <input
                id="auth-company_name"
                autoComplete="organization"
                type="text"
                className="form-control form-control-lg"
                style={inputStyle}
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                placeholder={ph.company}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold small" htmlFor="auth-business_reg" style={{ color: 'var(--tx-fg)' }}>
                {t.business_reg}
              </label>
              <input
                id="auth-business_reg"
                autoComplete="off"
                type="text"
                className="form-control form-control-lg"
                style={inputStyle}
                value={businessReg}
                onChange={e => setBusinessReg(e.target.value)}
                placeholder={ph.reg}
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold small" htmlFor="auth-contact_person" style={{ color: 'var(--tx-fg)' }}>
                {t.contact_person}
              </label>
              <input
                id="auth-contact_person"
                autoComplete="name"
                type="text"
                className="form-control form-control-lg"
                style={inputStyle}
                value={contactPerson}
                onChange={e => setContactPerson(e.target.value)}
                placeholder={ph.contact}
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold small" htmlFor="auth-phone" style={{ color: 'var(--tx-fg)' }}>
                {t.phone}
              </label>
              <input
                id="auth-phone"
                autoComplete="tel"
                type="tel"
                className="form-control form-control-lg"
                style={inputStyle}
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder={ph.phone}
              />
            </div>
          </>
        )}

        <div className="mb-3">
          <label className="form-label fw-semibold small" htmlFor="auth-email" style={{ color: 'var(--tx-fg)' }}>
            {t.email} <span className="text-danger" aria-hidden="true">*</span>
          </label>
          <input
            id="auth-email"
            autoComplete="email"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            type="email"
            className="form-control form-control-lg"
            style={inputStyle}
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="name@company.com"
            required
          />
        </div>
        <div className="mb-4">
          <label className="form-label fw-semibold small" htmlFor="auth-password" style={{ color: 'var(--tx-fg)' }}>
            {t.password} <span className="text-danger" aria-hidden="true">*</span>
          </label>
          <input
            id="auth-password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            type="password"
            className="form-control form-control-lg"
            style={inputStyle}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
          />
        </div>

        <div className="d-grid mb-4">
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ minHeight: 50 }}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" />
            ) : null}
            {mode === 'login' ? t.btn_login : t.btn_signup}
          </button>
        </div>
      </form>

      <div className="pt-3 text-center" style={{ borderTop: '1px solid var(--tx-line)' }}>
        <p className="mb-0" style={{ color: 'var(--tx-mute)', fontSize: '0.94rem' }}>
          {mode === 'login' ? t.no_account : t.have_account}{' '}
          <a
            href={mode === 'login' ? `/${lang}/auth/signup` : `/${lang}/auth/login`}
            className="fw-semibold"
            style={{ color: 'var(--tx-accent)', textDecoration: 'underline', textUnderlineOffset: 3 }}
          >
            {mode === 'login' ? t.signup_link : t.login_link}
          </a>
        </p>
      </div>
    </div>
  )
}
