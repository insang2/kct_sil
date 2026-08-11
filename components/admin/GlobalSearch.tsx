'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface SearchResult {
  products: { id: number; name_ko: string; brand: string; sku: string | null }[]
  contacts: { id: string; company_name: string | null; contact_person: string | null }[]
  docs: { id: string; doc_type: string; doc_number: string; title: string | null }[]
  deals: { id: string; title: string; stage: string }[]
}

const DOC_TYPE_LABELS: Record<string, string> = {
  quotation: '견적서', purchase_order: '발주서', receipt: '인수증',
  invoice: '인보이스', invoice_packing_list: '인보이스+패킹', sales_contract: '계약서',
}
const STAGE_LABELS: Record<string, string> = {
  lead: '리드', quotation: '견적', purchase_order: '발주',
  invoice: '인보이스', contract: '계약', completed: '완료', cancelled: '취소',
}

export default function GlobalSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (!query.trim()) { setResults(null); setOpen(false); return }
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`)
        const data = await res.json()
        setResults(data)
        setOpen(true)
      } catch {}
      setLoading(false)
    }, 300)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [query])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const hasResults = results && (
    (results.products?.length ?? 0) +
    (results.contacts?.length ?? 0) +
    (results.docs?.length ?? 0) +
    (results.deals?.length ?? 0)
  ) > 0

  function navigate(href: string) {
    setOpen(false)
    setQuery('')
    router.push(href)
  }

  return (
    <div ref={wrapRef} style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
      <div className="input-group rounded-pill overflow-hidden border bg-white" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <span className="input-group-text bg-white border-0 ps-3">
          {loading
            ? <span className="spinner-border spinner-border-sm text-secondary" style={{ width: 14, height: 14 }} />
            : <i className="bi bi-search text-body-secondary" style={{ fontSize: '0.85rem' }} />
          }
        </span>
        <input
          className="form-control border-0 bg-white"
          placeholder="제품, 고객, 문서, 거래 통합 검색..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => results && setOpen(true)}
          style={{ fontSize: '0.85rem' }}
        />
        {query && (
          <button className="btn btn-light border-0 px-2" onClick={() => { setQuery(''); setResults(null); setOpen(false) }}>
            <i className="bi bi-x" style={{ fontSize: '0.85rem' }} />
          </button>
        )}
      </div>

      {open && (
        <div
          className="card border-0 shadow-lg"
          style={{ position: 'absolute', top: '110%', left: 0, right: 0, zIndex: 2000, borderRadius: 12, overflow: 'hidden', maxHeight: 480, overflowY: 'auto' }}
        >
          {!hasResults ? (
            <div className="px-4 py-3 text-body-secondary small text-center">검색 결과 없음</div>
          ) : (
            <div>
              {(results!.products?.length ?? 0) > 0 && (
                <Section label="제품" icon="bi-box-seam">
                  {results!.products.map(p => (
                    <ResultItem key={p.id} onClick={() => navigate('/admin/products')}>
                      <div className="fw-bold text-dark" style={{ fontSize: '0.875rem' }}>{p.name_ko}</div>
                      <div className="text-body-secondary" style={{ fontSize: '0.75rem' }}>{p.brand}{p.sku ? ` · ${p.sku}` : ''}</div>
                    </ResultItem>
                  ))}
                </Section>
              )}
              {(results!.contacts?.length ?? 0) > 0 && (
                <Section label="고객" icon="bi-people">
                  {results!.contacts.map(c => (
                    <ResultItem key={c.id} onClick={() => navigate(`/admin/customers/${c.id}`)}>
                      <div className="fw-bold text-dark" style={{ fontSize: '0.875rem' }}>{c.company_name || '(미입력)'}</div>
                      {c.contact_person && <div className="text-body-secondary" style={{ fontSize: '0.75rem' }}>{c.contact_person}</div>}
                    </ResultItem>
                  ))}
                </Section>
              )}
              {(results!.docs?.length ?? 0) > 0 && (
                <Section label="문서" icon="bi-file-earmark-text">
                  {results!.docs.map(d => (
                    <ResultItem key={d.id} onClick={() => navigate('/admin/documents')}>
                      <div className="fw-bold text-dark" style={{ fontSize: '0.875rem' }}>{d.title || d.doc_number}</div>
                      <div className="text-body-secondary" style={{ fontSize: '0.75rem' }}>{DOC_TYPE_LABELS[d.doc_type] ?? d.doc_type} · {d.doc_number}</div>
                    </ResultItem>
                  ))}
                </Section>
              )}
              {(results!.deals?.length ?? 0) > 0 && (
                <Section label="거래" icon="bi-diagram-3">
                  {results!.deals.map(d => (
                    <ResultItem key={d.id} onClick={() => navigate('/admin/deals')}>
                      <div className="fw-bold text-dark" style={{ fontSize: '0.875rem' }}>{d.title}</div>
                      <div className="text-body-secondary" style={{ fontSize: '0.75rem' }}>{STAGE_LABELS[d.stage] ?? d.stage}</div>
                    </ResultItem>
                  ))}
                </Section>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Section({ label, icon, children }: { label: string; icon: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="px-4 py-2 d-flex align-items-center gap-2" style={{ background: '#f8f9fa', borderBottom: '1px solid #f0f0f0' }}>
        <i className={`bi ${icon} text-body-secondary`} style={{ fontSize: '0.78rem' }} />
        <span className="fw-bold text-body-secondary" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      </div>
      {children}
    </div>
  )
}

function ResultItem({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      className="btn btn-light w-100 text-start border-0 rounded-0 px-4 py-2"
      style={{ borderBottom: '1px solid #f8f9fa' }}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
