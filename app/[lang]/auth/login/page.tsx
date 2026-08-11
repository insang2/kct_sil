import { getDictionary } from '@/lib/dictionaries'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AuthForm from '@/components/AuthForm'

export default async function LoginPage({
  params,
}: {
  params: Promise<{ lang: 'ko' | 'en' | 'ja' }>
}) {
  const { lang } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) redirect(`/${lang}/quote`)

  const dict = await getDictionary(lang)

  return (
    <section className="py-9 py-lg-11" data-form-section style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-xl-5">
            <AuthForm mode="login" lang={lang} dict={dict as any} />
          </div>
        </div>
      </div>
    </section>
  )
}
