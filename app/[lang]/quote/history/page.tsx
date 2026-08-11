import { getDictionary } from '@/lib/dictionaries'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

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

  const { data: quotes } = await supabase
    .from('quotes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <>
      <section className="position-relative overflow-hidden pt-11 pb-7 bg-white" style={{ minHeight: '25vh', display: 'flex', alignItems: 'center' }}>
        <div className="container position-relative z-1 mt-5">
          <div className="col-lg-8 mx-auto text-center">
            <span className="h6 fw-bold text-uppercase text-primary">{d.quote.label}</span>
            <h1 className="display-4 mb-3 fw-bold text-dark">{d.quote.history_title}</h1>
            <p className="lead text-body-secondary">{d.quote.history_subtitle}</p>
          </div>
        </div>
      </section>

      <section className="py-9" data-form-section>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-5">
            <h5 className="fw-bold mb-0">{d.quote.history_title}</h5>
            <Link href={`/${lang}/quote`} className="btn btn-primary rounded-pill px-4">
              <i className="bi bi-plus-lg me-2"></i>{d.quote.btn_new}
            </Link>
          </div>

          {!quotes || quotes.length === 0 ? (
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-5 text-center text-body-secondary">
                <i className="bi bi-file-earmark-x fs-1 mb-3 d-block"></i>
                {d.quote.empty_history}
              </div>
            </div>
          ) : (
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <table className="table table-hover mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>{d.quote.quote_number}</th>
                    <th>{d.quote.quote_date}</th>
                    <th>{d.auth.company_name}</th>
                    <th className="text-end">{d.quote.total}</th>
                    <th className="text-center">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {quotes.map((q: any) => (
                    <tr key={q.id}>
                      <td className="fw-bold text-primary">{q.quote_number}</td>
                      <td className="text-body-secondary">
                        {new Date(q.created_at).toLocaleDateString('ko-KR')}
                      </td>
                      <td>{q.customer_company || '-'}</td>
                      <td className="text-end fw-bold">
                        {Number(q.total).toLocaleString('ko-KR')}원
                      </td>
                      <td className="text-center">
                        <span className="badge bg-success rounded-pill">저장됨</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
