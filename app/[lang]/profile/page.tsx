import { getDictionary } from '@/lib/dictionaries'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TIER_LABELS, TIER_DISCOUNTS } from '@/lib/pricing'
import Link from 'next/link'

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

  return (
    <>
      <section className="position-relative overflow-hidden pt-11 pb-7 bg-light" style={{ minHeight: '25vh', display: 'flex', alignItems: 'center'}}>
        <div className="container position-relative z-1 mt-5">
          <div className="col-lg-8 mx-auto text-center">
            <h1 className="display-4 mb-2 fw-bold text-dark">{d.navigation.mypage}</h1>
            <p className="lead text-body-secondary">{user.email}</p>
          </div>
        </div>
      </section>

      <section className="py-9 bg-white" data-form-section>
        <div className="container">
          <div className="row justify-content-center g-4">
            {/* Profile info */}
            <div className="col-lg-7">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4 p-md-5">
                  <h5 className="fw-bold mb-4 text-dark">{d.profile?.company_info ?? 'Company Info'}</h5>
                  <div className="row g-3">
                    <div className="col-sm-6">
                      <label className="form-label fw-bold text-dark small">{d.auth.company_name}</label>
                      <p className="form-control bg-light mb-0">{profile?.company_name || '-'}</p>
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label fw-bold text-dark small">{d.auth.business_reg}</label>
                      <p className="form-control bg-light mb-0">{profile?.business_reg_number || '-'}</p>
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label fw-bold text-dark small">{d.auth.contact_person}</label>
                      <p className="form-control bg-light mb-0">{profile?.contact_person || '-'}</p>
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label fw-bold text-dark small">{d.auth.phone}</label>
                      <p className="form-control bg-light mb-0">{profile?.phone || '-'}</p>
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-bold text-dark small">{d.auth.email}</label>
                      <p className="form-control bg-light mb-0">{user.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tier + quick links */}
            <div className="col-lg-5">
              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body p-4 text-center">
                  <h6 className="fw-bold text-dark mb-3">{d.profile?.membership_tier ?? 'Membership Tier'}</h6>
                  <span className={`badge rounded-pill px-4 py-2 fs-6 mb-2 ${
                    tier === 'platinum' ? 'bg-primary' :
                    tier === 'gold' ? 'bg-warning text-dark' :
                    tier === 'silver' ? 'bg-info text-dark' :
                    'bg-primary'
                  }`}>
                    {TIER_LABELS[tier]}
                  </span>
                  <p className="text-body-secondary small mt-2 mb-0">{TIER_DISCOUNTS[tier]}</p>
                </div>
              </div>

              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  <h6 className="fw-bold text-dark mb-3">{d.profile?.quick_links ?? 'Quick Links'}</h6>
                  <div className="d-grid gap-2">
                    <Link href={`/${lang}/quote`} className="btn btn-primary rounded-pill">
                      <i className="bi bi-file-earmark-plus me-2"></i>{d.profile?.btn_new_quote ?? 'New Quotation'}
                    </Link>
                    <Link href={`/${lang}/quote/history`} className="btn btn-outline-primary rounded-pill">
                      <i className="bi bi-clock-history me-2"></i>{d.quote.history_title}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
