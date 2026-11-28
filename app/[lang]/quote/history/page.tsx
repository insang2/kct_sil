import { getDictionary } from '@/lib/dictionaries'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Tx from '@/components/tech/Tx'
import { techCss } from '@/components/tech/TechBlocks'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default async function QuoteHistoryPage({
  params,
}: {
  params: Promise<{ lang: 'ko' | 'en' | 'ja' }>
}) {
  const { lang } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${lang}/auth/login`)

  const dict = await getDictionary(lang)
  const d = dict as any
  const isEn = lang === 'en'
  const isJa = lang === 'ja'

  const { data: quotes } = await supabase
    .from('quotes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const statusCol = isEn ? 'Status' : isJa ? 'ステータス' : '상태'
  const savedLabel = isEn ? 'Saved' : isJa ? '保存済み' : '저장됨'
  const countLabel = isEn
    ? `${quotes?.length ?? 0} saved quotations`
    : isJa
    ? `保存済み ${quotes?.length ?? 0}件`
    : `총 ${quotes?.length ?? 0}건`
  const dateLocale = isEn ? 'en-US' : isJa ? 'ja-JP' : 'ko-KR'

  return (
    <Tx>
      <style dangerouslySetInnerHTML={{ __html: techCss }} />

      {/* Dark Hero */}
      <section
        className="tx-hero"
        style={{ background: 'linear-gradient(180deg,rgba(12,13,15,.74),rgba(12,13,15,.95)), url(/assets/img/backgrounds/hero_construction.png) center/cover' }}
      >
        <div className="container">
          <nav aria-label="breadcrumb" className="mb-3">
            <Link href={`/${lang}`}>{d.navigation.home}</Link>
            <span> / </span>
            <Link href={`/${lang}/quote`}>{d.navigation.quote}</Link>
            <span> / </span>
            <span style={{ color: '#EDEDED' }}>{d.quote.history_title}</span>
          </nav>
          <span className="badge">{d.quote.label}</span>
          <h1 className="fw-bold mt-3">{d.quote.history_title}</h1>
          <p>{d.quote.history_subtitle}</p>
          <div className="d-flex flex-wrap gap-2 mt-4">
            <Link href={`/${lang}/quote`} className="btn btn-light btn-sm">
              <i className="bi bi-plus-lg me-1" aria-hidden="true"></i>
              {d.quote.btn_new}
            </Link>
            <Link href={`/${lang}/profile`} className="btn btn-outline-light btn-sm">
              {d.navigation.mypage}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container pb-5">
          <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4 pb-3" style={{ borderBottom: '1px solid var(--tx-line)' }}>
            <div>
              <div className="tx-no mb-1">HISTORY</div>
              <h2 className="h4 fw-bold mb-0">{d.quote.history_title}</h2>
            </div>
            <div className="d-flex align-items-center gap-3">
              <span style={{ color: 'var(--tx-mute)', fontSize: '0.9rem' }}>{countLabel}</span>
              <Link href={`/${lang}/quote`} className="btn btn-primary btn-sm">
                <i className="bi bi-plus-lg me-1" aria-hidden="true"></i>
                {d.quote.btn_new}
              </Link>
            </div>
          </div>

          {!quotes || quotes.length === 0 ? (
            <div className="border rounded-4 p-5 text-center" style={{ background: '#fff' }}>
              <i className="bi bi-file-earmark-x fs-1 mb-3 d-block" aria-hidden="true" style={{ color: 'var(--tx-mute)' }}></i>
              <p className="mb-4" style={{ color: 'var(--tx-mute)' }}>{d.quote.empty_history}</p>
              <Link href={`/${lang}/quote`} className="btn btn-primary">
                <i className="bi bi-plus-lg me-2" aria-hidden="true"></i>
                {d.quote.btn_new}
              </Link>
            </div>
          ) : (
            <div
              className="tech-table-wrap"
              tabIndex={0}
              role="region"
              aria-label={isEn ? 'Saved quotations table (scrollable)' : isJa ? '保存済み見積書一覧（横スクロール可能）' : '저장된 견적서 목록 (가로 스크롤 가능)'}
            >
              <table className="table tech-table mb-0">
                <caption className="visually-hidden">{d.quote.history_title}</caption>
                <thead>
                  <tr>
                    <th scope="col">{d.quote.quote_number}</th>
                    <th scope="col">{d.quote.quote_date}</th>
                    <th scope="col">{d.auth.company_name}</th>
                    <th scope="col" className="text-end">{d.quote.total}</th>
                    <th scope="col" className="text-center">{statusCol}</th>
                  </tr>
                </thead>
                <tbody>
                  {quotes.map((q: any) => (
                    <tr key={q.id}>
                      <td className="fw-bold" style={{ color: 'var(--tx-accent)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                        {q.quote_number}
                      </td>
                      <td style={{ color: 'var(--tx-mute)', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                        {new Date(q.created_at).toLocaleDateString(dateLocale)}
                      </td>
                      <td>{q.customer_company || '-'}</td>
                      <td className="text-end fw-bold" style={{ fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                        {Number(q.total).toLocaleString('ko-KR')}원
                      </td>
                      <td className="text-center">
                        <span
                          className="d-inline-block rounded-pill px-3 py-1 fw-semibold"
                          style={{
                            fontSize: '0.78rem',
                            background: 'rgba(22, 24, 28, 0.08)',
                            color: 'var(--tx-fg)',
                            border: '1px solid var(--tx-line)',
                          }}
                        >
                          {savedLabel}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </Tx>
  )
}
