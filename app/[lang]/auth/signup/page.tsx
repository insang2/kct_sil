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

export default async function SignupPage({
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
    ? 'Register a B2B business account to save quotations, track quote history, and receive member pricing.'
    : isJa
    ? 'B2B法人アカウントをご登録いただくと、見積書の保存・履歴管理および会員単価をご利用いただけます。'
    : 'B2B 사업자 회원으로 가입하시면 견적서 저장, 이력 관리 및 회원 등급별 단가 혜택을 이용하실 수 있습니다.'

  return (
    <Tx>
      <section className="tx-hero">
        <div className="container">
          <nav aria-label="breadcrumb" className="mb-3">
            <Link href={`/${lang}`}>{d.navigation.home}</Link>
            <span> / </span>
            <span style={{ color: '#EDEDED' }}>{d.auth.signup_title}</span>
          </nav>
          <span className="badge">B2B MEMBER</span>
          <h1 className="fw-bold mt-3">{d.auth.signup_title}</h1>
          <p>{subtitle}</p>
        </div>
      </section>

      <section className="py-5">
        <div className="container pb-5">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-xl-5">
              <AuthForm mode="signup" lang={lang} dict={d} />
            </div>
          </div>

          <div className="tx-notes">
            <div>
              <h3>{d.quote.title}</h3>
              <p>
                {isEn ? 'Create and download a PDF quotation immediately. ' : isJa ? '見積書PDFの即時作成・ダウンロードが可能です。' : '원하는 제품과 수량을 선택해 견적서 PDF를 바로 발급해 보세요. '}
                <Link href={`/${lang}/quote`}>{d.navigation.quote}</Link>
              </p>
            </div>
            <div>
              <h3>{d.navigation.products}</h3>
              <p>
                {isEn ? 'Browse all 30 DOWSIL™ sealants and TDS documents. ' : isJa ? 'DOWSIL™全30種の製品情報とTDSをご確認いただけます。' : 'DOWSIL™ 30종 제품 목록과 TDS 기술자료를 확인하세요. '}
                <Link href={`/${lang}/products`}>{d.navigation.products}</Link>
              </p>
            </div>
            <div>
              <h3>{isEn ? 'Support' : isJa ? 'お問い合わせ' : '가입 · 거래 문의'}</h3>
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
