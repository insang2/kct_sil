import { MetadataRoute } from 'next';

const LANGS = ['ko', 'en', 'ja'] as const;

const PRODUCT_SLUGS = [
  'dowsil-790',
  'dowsil-791',
  'dowsil-795',
  'dowsil-995',
  'dowsil-977',
  'dowsil-991',
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://kconstrade.com';

  const homepages = LANGS.map((lang) => ({
    url: `${baseUrl}/${lang}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: lang === 'ko' || lang === 'en' ? 1.0 : 0.8,
  }));

  const aboutPages = LANGS.map((lang) => ({
    url: `${baseUrl}/${lang}/about`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: lang === 'ko' || lang === 'en' ? 0.9 : 0.8,
  }));

  const productListPages = LANGS.map((lang) => ({
    url: `${baseUrl}/${lang}/products`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: lang === 'ko' || lang === 'en' ? 0.9 : 0.8,
  }));

  const productDetailPages = LANGS.flatMap((lang) =>
    PRODUCT_SLUGS.map((slug) => ({
      url: `${baseUrl}/${lang}/products/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: lang === 'ko' || lang === 'en' ? 0.85 : 0.7,
    }))
  );

  const exportPages = LANGS.map((lang) => ({
    url: `${baseUrl}/${lang}/export`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: lang === 'en' ? 1.0 : (lang === 'ko' ? 0.8 : 0.75), // Make English Export page top priority
  }));

  return [
    ...homepages,
    ...aboutPages,
    ...productListPages,
    ...productDetailPages,
    ...exportPages,
  ];
}
