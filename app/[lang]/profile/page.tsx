import { getDictionary } from '@/lib/dictionaries'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TIER_LABELS, TIER_DISCOUNTS } from '@/lib/pricing'
import type { Metadata } from 'next'
import Link from 'next/link'
import Tx from '@/components/tech/Tx'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default async function ProfilePage({
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

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const tier = (profile?.tier ?? 'standard') as keyof typeof TIER_LABELS

  const infoRows = [
    { label: d.auth.company_name, value: profile?.company_name || '-' },
    { label: d.auth.business_reg, value: profile?.business_reg_number || '-' },
    { label: d.auth.contact_person, value: profile?.contact_person || '-' },
    { label: d.auth.phone, value: profile?.phone || '-' },
    { label: d.auth.email, value: user.email || '-' },
  ]

  return (
    <Tx>
      {/* Dark Hero */}
      <section className="tx-hero">
        <div className="container">
          <nav aria-label="breadcrumb" className="mb-3">
            <Link href={`/${lang}`}>{d.navigation.home}</Link>
            <span> / </span>
            <span style={{ color: '#EDEDED' }}>{d.navigation.mypage}</span>
          </nav>
          <span className="badge">B2B PROFILE</span>
          <h1 className="fw-bold mt-3">{d.navigation.mypage}</h1>
          <p>{user.email}</p>
          <div className="d-flex flex-wrap gap-2 mt-4">
            <Link href={`/${lang}/quote`} className="btn btn-light btn-sm">
              <i className="bi bi-file-earmark-plus me-1" aria-hidden="true"></i>
              {d.profile?.btn_new_quote ?? 'New Quotation'}
            </Link>
            <Link href={`/${lang}/quote/history`} className="btn btn-outline-light btn-sm">
              <i className="bi bi-clock-history me-1" aria-hidden="true"></i>
              {d.quote.history_title}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container pb-5">
          <div className="row g-4 g-lg-5 align-items-start">
            {/* Profile info */}
            <div className="col-lg-7">
              <div className="border rounded-4 p-4 p-md-5" style={{ background: '#fff' }}>
                <div className="tx-no mb-1">01 · ACCOUNT</div>
                <h2 className="h4 fw-bold mb-4">{d.profile?.company_info ?? 'Company Info'}</h2>
                <dl className="mb-0">
                  {infoRows.map((row) => (
                    <div
                      key={row.label}
                      className="row py-3 align-items-baseline"
                      style={{ borderTop: '1px solid var(--tx-line)' }}
                    >
                      <dt className="col-sm-4 fw-semibold" style={{ color: 'var(--tx-mute)', fontSize: '0.9rem' }}>
                        {row.label}
                      </dt>
                      <dd className="col-sm-8 mb-0 fw-semibold" style={{ color: 'var(--tx-fg)', fontSize: '1rem' }}>
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Tier + quick links */}
            <div className="col-lg-5">
              <div className="border rounded-4 p-4 p-md-5 mb-4" style={{ background: '#fff' }}>
                <div className="tx-no mb-1">02 · TIER</div>
                <h2 className="h5 fw-bold mb-3">{d.profile?.membership_tier ?? 'Membership Tier'}</h2>
                <div className="pt-3 d-flex align-items-center justify-content-between gap-3" style={{ borderTop: '1px solid var(--tx-line)' }}>
                  <span
                    className="d-inline-flex align-items-center rounded-pill px-4 py-2 fw-bold"
                    style={{
                      background: tier === 'platinum' || tier === 'gold' ? 'var(--tx-accent)' : 'var(--tx-ink)',
                      color: '#fff',
                      fontSize: '0.95rem',
                    }}
                  >
                    {TIER_LABELS[tier]}
                  </span>
                  <span style={{ color: 'var(--tx-mute)', fontSize: '0.95rem', fontWeight: 500 }}>
                    {TIER_DISCOUNTS[tier]}
                  </span>
                </div>
              </div>

              <div className="border rounded-4 p-4 p-md-5" style={{ background: '#fff' }}>
                <div className="tx-no mb-1">03 · QUICK LINKS</div>
                <h2 className="h5 fw-bold mb-3">{d.profile?.quick_links ?? 'Quick Links'}</h2>
                <div className="d-grid gap-2 pt-3" style={{ borderTop: '1px solid var(--tx-line)' }}>
                  <Link href={`/${lang}/quote`} className="btn btn-primary" style={{ minHeight: 46 }}>
                    <i className="bi bi-file-earmark-plus me-2" aria-hidden="true"></i>
                    {d.profile?.btn_new_quote ?? 'New Quotation'}
                  </Link>
                  <Link href={`/${lang}/quote/history`} className="btn btn-outline-primary" style={{ minHeight: 46 }}>
                    <i className="bi bi-clock-history me-2" aria-hidden="true"></i>
                    {d.quote.history_title}
                  </Link>
                  <Link href={`/${lang}/products`} className="btn btn-outline-secondary" style={{ minHeight: 46 }}>
                    <i className="bi bi-grid me-2" aria-hidden="true"></i>
                    {d.navigation.products}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Tx>
  )
}
