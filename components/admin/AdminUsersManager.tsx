'use client'

import { useState } from 'react'

interface AdminUser {
  id: string
  username: string
  created_at: string
}

interface Props {
  users: AdminUser[]
  currentUsername: string
  token: string
}

export default function AdminUsersManager({ users: initialUsers, currentUsername, token }: Props) {
  const [users, setUsers] = useState(initialUsers)
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Add form
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showAdd, setShowAdd] = useState(false)

  // Change password form
  const [changingFor, setChangingFor] = useState<string | null>(null)
  const [newPw, setNewPw] = useState('')

  async function rpc(fn: string, args: Record<string, string>) {
    const res = await fetch('/api/admin-users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fn, token, ...args }),
    })
    return res.json()
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setLoading('add')
    setError('')
    setSuccess('')
    const data = await rpc('create', { username: newUsername, password: newPassword })
    if (data.ok) {
      setUsers(data.users)
      setNewUsername('')
      setNewPassword('')
      setShowAdd(false)
      setSuccess(`'${newUsername}' 계정이 추가됐습니다.`)
    } else {
      setError(data.error ?? '이미 존재하는 아이디입니다.')
    }
    setLoading(null)
  }

  async function handleDelete(username: string) {
    if (!confirm(`'${username}' 계정을 삭제하시겠습니까?`)) return
    setLoading(username)
    setError('')
    setSuccess('')
    const data = await rpc('delete', { targetUsername: username })
    if (data.ok) {
      setUsers(data.users)
      setSuccess(`'${username}' 계정이 삭제됐습니다.`)
    } else {
      setError(data.error ?? '삭제 실패')
    }
    setLoading(null)
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (!changingFor) return
    setLoading('pw_' + changingFor)
    setError('')
    setSuccess('')
    const data = await rpc('changePw', { targetUsername: changingFor, newPassword: newPw })
    if (data.ok) {
      setChangingFor(null)
      setNewPw('')
      setSuccess(`'${changingFor}' 비밀번호가 변경됐습니다.`)
    } else {
      setError(data.error ?? '변경 실패')
    }
    setLoading(null)
  }

  return (
    <div>
      {error && <div className="alert alert-danger rounded-3 mb-4">{error}</div>}
      {success && <div className="alert alert-success rounded-3 mb-4">{success}</div>}

      {/* User list */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-header bg-white border-0 pt-4 px-4 pb-0 d-flex justify-content-between align-items-center">
          <h6 className="fw-bold text-dark mb-0">관리자 계정 목록</h6>
          <button
            className="btn btn-primary btn-sm rounded-pill px-3"
            onClick={() => { setShowAdd(p => !p); setError(''); setSuccess('') }}
          >
            <i className="bi bi-plus-lg me-1"></i>계정 추가
          </button>
        </div>

        {showAdd && (
          <div className="px-4 pt-4">
            <form onSubmit={handleAdd} className="card bg-light border-0 rounded-3 p-4">
              <div className="row g-3 align-items-end">
                <div className="col-sm-4">
                  <label className="form-label small fw-bold">아이디</label>
                  <input
                    className="form-control"
                    value={newUsername}
                    onChange={e => setNewUsername(e.target.value)}
                    placeholder="영문·숫자"
                    required
                    pattern="[a-zA-Z0-9_]+"
                  />
                </div>
                <div className="col-sm-4">
                  <label className="form-label small fw-bold">비밀번호</label>
                  <input
                    type="password"
                    className="form-control"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="6자 이상"
                    required
                    minLength={6}
                  />
                </div>
                <div className="col-sm-4 d-flex gap-2">
                  <button type="submit" className="btn btn-primary rounded-pill px-3 flex-grow-1" disabled={loading === 'add'}>
                    {loading === 'add' ? <span className="spinner-border spinner-border-sm" /> : '추가'}
                  </button>
                  <button type="button" className="btn btn-outline-secondary rounded-pill px-3" onClick={() => setShowAdd(false)}>취소</button>
                </div>
              </div>
            </form>
          </div>
        )}

        <div className="card-body p-0 mt-3">
          <table className="table table-hover mb-0" style={{ fontSize: '0.875rem' }}>
            <thead>
              <tr className="table-light">
                <th className="px-4 py-3 border-0">아이디</th>
                <th className="py-3 border-0">생성일</th>
                <th className="py-3 border-0">비고</th>
                <th className="py-3 border-0 text-end pe-4">작업</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td className="px-4 py-3">
                    <div className="d-flex align-items-center gap-2">
                      <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold"
                        style={{ width: 32, height: 32, fontSize: '0.75rem', flexShrink: 0 }}>
                        {u.username[0].toUpperCase()}
                      </div>
                      <span className="fw-bold">{u.username}</span>
                    </div>
                  </td>
                  <td className="py-3 text-body-secondary">
                    {new Date(u.created_at).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="py-3">
                    {u.username === currentUsername && (
                      <span className="badge bg-success rounded-pill" style={{ fontSize: '0.7rem' }}>현재 로그인</span>
                    )}
                  </td>
                  <td className="py-3 text-end pe-4">
                    <div className="d-flex gap-2 justify-content-end">
                      <button
                        className="btn btn-sm btn-outline-primary rounded-pill px-3"
                        onClick={() => { setChangingFor(changingFor === u.username ? null : u.username); setNewPw(''); setError('') }}
                      >
                        <i className="bi bi-key me-1"></i>비번 변경
                      </button>
                      {u.username !== currentUsername && (
                        <button
                          className="btn btn-sm btn-outline-danger rounded-pill px-3"
                          onClick={() => handleDelete(u.username)}
                          disabled={loading === u.username}
                        >
                          {loading === u.username
                            ? <span className="spinner-border spinner-border-sm" />
                            : <><i className="bi bi-trash me-1"></i>삭제</>}
                        </button>
                      )}
                    </div>

                    {changingFor === u.username && (
                      <form onSubmit={handleChangePassword} className="mt-2 d-flex gap-2 justify-content-end">
                        <input
                          type="password"
                          className="form-control form-control-sm"
                          style={{ maxWidth: 180 }}
                          value={newPw}
                          onChange={e => setNewPw(e.target.value)}
                          placeholder="새 비밀번호 (6자 이상)"
                          required
                          minLength={6}
                        />
                        <button type="submit" className="btn btn-sm btn-primary rounded-pill px-3"
                          disabled={loading === 'pw_' + u.username}>
                          {loading === 'pw_' + u.username ? <span className="spinner-border spinner-border-sm" /> : '저장'}
                        </button>
                        <button type="button" className="btn btn-sm btn-outline-secondary rounded-pill"
                          onClick={() => setChangingFor(null)}>취소</button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-body-secondary small">
        <i className="bi bi-info-circle me-1"></i>
        현재 로그인된 본인 계정은 삭제할 수 없습니다.
      </p>
    </div>
  )
}
