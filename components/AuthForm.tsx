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
    <div className="card border-0 shadow-lg rounded-4 overflow-hidden" data-form-section>
      <div className="card-body p-4 p-md-5">
        <h2 className="fw-bold mb-4">{mode === 'login' ? t.login_title : t.signup_title}</h2>

        {error && (
          <div className="alert alert-danger rounded-3 mb-4" role="alert">{error}</div>
        )}
        {success && (
          <div className="alert alert-success rounded-3 mb-4" role="alert">{success}</div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <>
              <div className="mb-3">
                <label className="form-label">{t.company_name}</label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="예: 한국건설(주)"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">{t.business_reg}</label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  value={businessReg}
                  onChange={e => setBusinessReg(e.target.value)}
                  placeholder="예: 000-00-00000"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">{t.contact_person}</label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  value={contactPerson}
                  onChange={e => setContactPerson(e.target.value)}
                  placeholder="예: 홍길동"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">{t.phone}</label>
                <input
                  type="tel"
                  className="form-control form-control-lg"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="예: 010-1234-5678"
                />
              </div>
            </>
          )}

          <div className="mb-3">
            <label className="form-label fw-bold text-dark">{t.email}</label>
            <input
              type="email"
              className="form-control form-control-lg"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label fw-bold text-dark">{t.password}</label>
            <input
              type="password"
              className="form-control form-control-lg"
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
              className="btn btn-primary btn-lg rounded-pill shadow-sm"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2" role="status" />
              ) : null}
              {mode === 'login' ? t.btn_login : t.btn_signup}
            </button>
          </div>
        </form>

        <p className="text-center text-body-secondary mb-0">
          {mode === 'login' ? t.no_account : t.have_account}{' '}
          <a
            href={mode === 'login' ? `/${lang}/auth/signup` : `/${lang}/auth/login`}
            className="text-primary fw-bold"
          >
            {mode === 'login' ? t.signup_link : t.login_link}
          </a>
        </p>
      </div>
    </div>
  )
}
