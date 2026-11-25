'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { SearchItem } from '@/lib/series/hubs'

// 기술정보 전체(약 50페이지) 제목·요약 검색
export default function TechSearch({ items, ko }: { items: SearchItem[]; ko: boolean }) {
  const [q, setQ] = useState('')
  const res = useMemo(() => {
    const k = q.trim().toLowerCase()
    if (k.length < 2) return []
    const w = k.split(/\s+/)
    return items.filter((i) => w.every((x) => (i.t + ' ' + i.s).toLowerCase().includes(x))).slice(0, 12)
  }, [q, items])
  return (
    <div role="search" className="mb-5 tx-search">
      <label htmlFor="tech-q" className="fw-bold mb-2 d-block" style={{ color: '#16142F' }}>
        <i className="bi bi-search me-2" />{ko ? `기술정보 ${items.length}개 페이지 검색` : `Search ${items.length} technical pages`}
      </label>
      <input id="tech-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" className="form-control form-control-lg" style={{ maxWidth: 560 }}
        placeholder={ko ? '예: 내화, 아세톡시, 백금 경화, 점도, 프라이머' : 'e.g. fire rating, acetoxy, platinum cure, primer'} />
      <div aria-live="polite" className="mt-2" style={{ fontSize: '.9rem', color: '#555370' }}>
        {q.trim().length >= 2 && (res.length ? (ko ? `${res.length}건` : `${res.length} result(s)`) : ko ? '검색 결과가 없습니다.' : 'No results.')}
      </div>
      {res.length > 0 && (
        <ul className="list-unstyled mt-2 mb-0">
          {res.map((r) => (
            <li key={r.href} className="mb-2">
              <Link href={r.href} className="tx-res">
                <span style={{ color: '#1558D6', fontSize: '.8rem', fontWeight: 700 }}>{r.hub}</span>
                <span className="d-block fw-bold" style={{ color: '#16142F' }}>{r.t}</span>
                <span className="d-block" style={{ color: '#555370', fontSize: '.88rem', lineHeight: 1.6 }}>{r.s}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
