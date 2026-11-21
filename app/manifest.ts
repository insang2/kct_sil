import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '한국건설트레이딩 (KCT) - 건축용 실리콘 전문',
    short_name: 'KCT 실리콘',
    description: 'Dow 건축용·구조용 실리콘 전문 판매 및 수출 기업',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1e3a8a',
    icons: [
      {
        src: '/assets/img/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/assets/img/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/assets/img/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
