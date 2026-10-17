import type { Metadata } from "next";
import Script from "next/script";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getDictionary } from "@/lib/dictionaries";
import { locales } from "@/lib/i18n";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: string }> 
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  const m = dict.metadata;

  return {
    metadataBase: new URL('https://kconstrade.com'),
    title: m.title,
    description: m.description,
    keywords: m.keywords,
    alternates: {
      canonical: "https://kconstrade.com",
      languages: {
        'ko-KR': "https://kconstrade.com/ko",
        'en-US': "https://kconstrade.com/en",
        'ja-JP': "https://kconstrade.com/ja",
      },
    },
    openGraph: {
      title: m.title,
      description: m.description,
      url: "https://kconstrade.com",
      siteName: "한국건설트레이딩 (KCT)",
      images: [
        {
          url: "https://kconstrade.com/assets/img/og-image.png",
          width: 1200,
          height: 630,
          alt: m.title,
        },
      ],
      locale: lang === 'en' ? 'en_US' : lang === 'ja' ? 'ja_JP' : 'ko_KR',
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: m.title,
      description: m.description,
      images: ["https://kconstrade.com/assets/img/og-image.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  return (
    <html lang={lang} data-bs-theme="light">
      <head>
        <meta name="color-scheme" content="light only" />
        <meta name="supported-color-schemes" content="light" />
        <meta name="naver-site-verification" content="8cbbf2d9359c252fd97e2dc14cb0a35f29d98184" />
        <meta name="google-site-verification" content="MDkLA39MDvqE2qFlhXtDGZ7CStYVHZmiRxySzzxD97U" />
        <meta name="msvalidate.01" content="ED4DEB0C324AB26280EFC4E027A2C73F" />
        <link rel="icon" type="image/x-icon" href="/assets/img/favicon.ico" />
        <link rel="icon" type="image/png" sizes="64x64" href="/assets/img/favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/img/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/assets/img/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/assets/img/icon-512.png" />
        <link rel="stylesheet" href="/assets/fonts/bootstrap-icons/bootstrap-icons.min.css" />
        <link rel="stylesheet" href="/assets/fonts/iconsmind/iconsmind.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&family=Source+Serif+4:ital,wght@0,400;0,500;1,400;1,500&display=swap" rel="stylesheet" />
        <link href="/assets/css/theme.css" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "KOREA CONSTRUCTION TRADING (한국건설트레이딩)",
              "alternateName": ["KCT", "Korea Construction Trading", "한국건설트레이딩"],
              "description": "Architectural silicone wholesale supplier and global exporter.",
              "url": "https://kconstrade.com",
              "logo": "https://kconstrade.com/assets/img/logo/kct_logo.jpeg",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+82-10-8939-0284",
                "contactType": "sales",
                "email": "sales@kconstrade.com",
                "availableLanguage": ["Korean", "English", "Japanese", "Chinese"]
              },
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "서울특별시 송파구 충민로 10 4-A19 가든파이브툴",
                "addressLocality": "Seoul",
                "postalCode": "05840",
                "addressCountry": "KR"
              },
              "sameAs": [
                "https://www.linkedin.com/company/kct-korea-construction-trading"
              ]
            })
          }}
        />
      </head>
      <body className="d-flex flex-column min-vh-100">
        {/* Google Analytics */}
        <Script 
          src="https://www.googletagmanager.com/gtag/js?id=G-CXKPTQTM71" 
          strategy="afterInteractive" 
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          
            gtag('config', 'G-CXKPTQTM71');
          `}
        </Script>
        <Header lang={lang as 'ko' | 'en' | 'ja'} />
        
        <main className="flex-grow-1">
          {children}
        </main>

        <Footer lang={lang as 'ko' | 'en' | 'ja'} />

        <Script src="/assets/js/theme.bundle.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
