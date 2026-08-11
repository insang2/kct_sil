'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginForm() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/admin/login/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (data.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        setError('아이디 또는 비밀번호가 올바르지 않습니다.')
      }
    } catch {
      setError('오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-danger rounded-3 py-2 px-3" style={{ fontSize: '0.875rem' }}>
          {error}
        </div>
      )}
      <div className="mb-3">
        <label className="form-label fw-semibold text-dark small">아이디</label>
        <input
          type="text"
          className="form-control rounded-3"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="아이디 입력"
          required
          autoFocus
        />
      </div>
      <div className="mb-4">
        <label className="form-label fw-semibold text-dark small">비밀번호</label>
        <input
          type="password"
          className="form-control rounded-3"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="비밀번호 입력"
          required
        />
      </div>
      <button
        type="submit"
        className="btn w-100 rounded-3 fw-bold py-2"
        style={{ background: '#1e1e2e', color: '#fff' }}
        disabled={loading}
      >
        {loading ? (
          <span className="spinner-border spinner-border-sm me-2" role="status" />
        ) : (
          <i className="bi bi-shield-lock me-2"></i>
        )}
        관리자 로그인
      </button>
    </form>
  )
}
