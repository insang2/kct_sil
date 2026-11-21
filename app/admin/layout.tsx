import '@/app/globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'KCT 관리자',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="/assets/img/favicon.png" type="image/png" />
        <link rel="stylesheet" href="/assets/fonts/bootstrap-icons/bootstrap-icons.min.css" />
        <link href="/assets/css/theme.css" rel="stylesheet" />
      </head>
      <body style={{ background: '#f8f9fa' }}>
        {children}
      </body>
    </html>
  )
}
