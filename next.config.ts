import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
