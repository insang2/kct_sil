import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/*/auth/',
          '/*/profile',
          '/*/quote/history',
        ],
      },
    ],
    sitemap: 'https://kconstrade.com/sitemap.xml',
    host: 'https://kconstrade.com',
  };
}
