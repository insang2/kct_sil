import { getDictionary } from '@/lib/dictionaries'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AuthForm from '@/components/AuthForm'
import Tx from '@/components/tech/Tx'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

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
  const d = dict as any
  const isEn = lang === 'en'
  const isJa = lang === 'ja'

  const subtitle = isEn
    ? 'Sign in with your business account to access tier pricing, save quotations, and review history.'
    : isJa
    ? '法人会員アカウントでログインすると、会員単価での見積書作成・保存履歴の確認ができます。'
    : '사업자 회원 계정으로 로그인하면 등급별 단가 적용, 견적서 저장 및 이력 조회가 가능합니다.'

  return (
    <Tx>
      <section className="tx-hero">
        <div className="container">
          <nav aria-label="breadcrumb" className="mb-3">
            <Link href={`/${lang}`}>{d.navigation.home}</Link>
            <span> / </span>
            <span style={{ color: '#EDEDED' }}>{d.auth.login_title}</span>
          </nav>
          <span className="badge">B2B MEMBER</span>
          <h1 className="fw-bold mt-3">{d.auth.login_title}</h1>
          <p>{subtitle}</p>
        </div>
      </section>

      <section className="py-5">
        <div className="container pb-5">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-xl-5">
              <AuthForm mode="login" lang={lang} dict={d} />
            </div>
          </div>

          <div className="tx-notes">
            <div>
              <h3>{d.quote.title}</h3>
              <p>
                {isEn ? 'You can also preview and download a PDF quotation without signing in. ' : isJa ? 'ログインなしでもPDF見積書の作成・ダウンロードが可能です。' : '로그인 없이도 제품 선택 및 견적서 PDF 즉시 다운로드가 가능합니다. '}
                <Link href={`/${lang}/quote`}>{d.navigation.quote}</Link>
              </p>
            </div>
            <div>
              <h3>{d.navigation.export}</h3>
              <p>
                {isEn ? 'For overseas FOB/CIF orders and export documentation. ' : isJa ? 'FOB/CIF条件や輸出書類のご相談はこちら。' : '해외 수출 조건 및 선적 서류 문의는 수출문의 페이지를 이용해 주세요. '}
                <Link href={`/${lang}/export`}>{d.navigation.export}</Link>
              </p>
            </div>
            <div>
              <h3>{isEn ? 'Support' : isJa ? 'お問い合わせ' : '계정 · 거래 문의'}</h3>
              <p>
                <a href="mailto:sales@kconstrade.com">sales@kconstrade.com</a> ·{' '}
                <a href="tel:+821089390284">{isEn || isJa ? '+82 10-8939-0284' : '010-8939-0284'}</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </Tx>
  )
}
