import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    // 웹 매니페스트는 검색 색인 대상이 아니다 (Search Console '크롤링됨 - 색인 미생성' 방지)
    return [{ source: '/manifest.webmanifest', headers: [{ key: 'X-Robots-Tag', value: 'noindex' }] }];
  },
  transpilePackages: [
    '@react-pdf/renderer',
    '@react-pdf/fns',
    '@react-pdf/font',
    '@react-pdf/image',
    '@react-pdf/layout',
    '@react-pdf/pdfkit',
    '@react-pdf/primitives',
    '@react-pdf/reconciler',
    '@react-pdf/render',
    '@react-pdf/stylesheet',
    '@react-pdf/svg',
    '@react-pdf/textkit',
    '@react-pdf/types',
  ],
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
