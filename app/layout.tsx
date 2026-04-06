import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "한국건설트레이딩 (KCT) B2B/B2C Platform",
  description: "건설 자재 유통 및 판매 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" data-bs-theme="light">
      <head>
        <link rel="icon" href="/assets/img/favicon.ico" type="image/ico" />
        <link rel="stylesheet" href="/assets/fonts/bootstrap-icons/bootstrap-icons.min.css" />
        <link rel="stylesheet" href="/assets/fonts/iconsmind/iconsmind.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&family=Source+Serif+4:ital,wght@0,400;0,500;1,400;1,500&display=swap" rel="stylesheet" />
        <link href="/assets/css/theme.min.css" rel="stylesheet" />
      </head>
      <body className="d-flex flex-column min-vh-100">
        <Header />
        
        <main className="flex-grow-1">
          {children}
        </main>

        <Footer />

        <Script src="/assets/js/theme.bundle.min.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
