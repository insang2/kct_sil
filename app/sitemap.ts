import { MetadataRoute } from 'next';
import { CATALOG } from '@/lib/products-catalog';
import { PAGES as TECH_PAGES } from '@/lib/tech-manual';
import { IPAGES } from '@/lib/industrial/pages';
import { SERIES } from '@/lib/series/config';

const LANGS = ['ko', 'en', 'ja'] as const;
// 한국어/영문 본문만 있는 섹션(제품·기술정보)은 ja를 제외 — ja 페이지는 ko/en으로 canonical 통합
const KO_EN = ['ko', 'en'] as const;

const PRODUCT_SLUGS = CATALOG.map((p) => p.slug);

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://kconstrade.com';
  const lastModified = new Date();

  // Root redirect entry
  const rootEntry = {
    url: baseUrl,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 1.0,
    alternates: {
      languages: {
        ko: `${baseUrl}/ko`,
        en: `${baseUrl}/en`,
        ja: `${baseUrl}/ja`,
        'x-default': `${baseUrl}/ko`,
      },
    },
  };

  // Homepages
  const homepages = LANGS.map((lang) => ({
    url: `${baseUrl}/${lang}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: lang === 'ko' || lang === 'en' ? 1.0 : 0.85,
    alternates: {
      languages: {
        ko: `${baseUrl}/ko`,
        en: `${baseUrl}/en`,
        ja: `${baseUrl}/ja`,
        'x-default': `${baseUrl}/ko`,
      },
    },
  }));

  // About pages
  const aboutPages = LANGS.map((lang) => ({
    url: `${baseUrl}/${lang}/about`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: lang === 'ko' || lang === 'en' ? 0.9 : 0.8,
    alternates: {
      languages: {
        ko: `${baseUrl}/ko/about`,
        en: `${baseUrl}/en/about`,
        ja: `${baseUrl}/ja/about`,
        'x-default': `${baseUrl}/ko/about`,
      },
    },
  }));

  // Product list pages
  const productListPages = KO_EN.map((lang) => ({
    url: `${baseUrl}/${lang}/products`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: lang === 'ko' || lang === 'en' ? 0.95 : 0.85,
    alternates: {
      languages: {
        ko: `${baseUrl}/ko/products`,
        en: `${baseUrl}/en/products`,
        'x-default': `${baseUrl}/ko/products`,
      },
    },
  }));

  // Product detail pages
  const productDetailPages = KO_EN.flatMap((lang) =>
    PRODUCT_SLUGS.map((slug) => ({
      url: `${baseUrl}/${lang}/products/${slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: lang === 'ko' || lang === 'en' ? 0.85 : 0.75,
      alternates: {
        languages: {
          ko: `${baseUrl}/ko/products/${slug}`,
          en: `${baseUrl}/en/products/${slug}`,
          'x-default': `${baseUrl}/ko/products/${slug}`,
        },
      },
    }))
  );

  // Technical information (hub + pages)
  const techPaths = ['technical', ...TECH_PAGES.map((p) => `technical/${p.slug}`), 'technical/industrial', ...IPAGES.map((p) => `technical/industrial/${p.slug}`), ...Object.values(SERIES).flatMap((x) => [`technical/${x.key}`, ...x.pages.map((p) => `technical/${x.key}/${p.slug}`)])];
  const technicalPages = KO_EN.flatMap((lang) =>
    techPaths.map((path) => ({
      url: `${baseUrl}/${lang}/${path}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: path === 'technical' ? 0.9 : 0.8,
      alternates: {
        languages: {
          ko: `${baseUrl}/ko/${path}`,
          en: `${baseUrl}/en/${path}`,
          'x-default': `${baseUrl}/ko/${path}`,
        },
      },
    }))
  );

  // Export inquiry pages
  const exportPages = LANGS.map((lang) => ({
    url: `${baseUrl}/${lang}/export`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: lang === 'en' ? 1.0 : (lang === 'ko' ? 0.85 : 0.8),
    alternates: {
      languages: {
        ko: `${baseUrl}/ko/export`,
        en: `${baseUrl}/en/export`,
        ja: `${baseUrl}/ja/export`,
        'x-default': `${baseUrl}/ko/export`,
      },
    },
  }));

  // Quote request pages
  const quotePages = LANGS.map((lang) => ({
    url: `${baseUrl}/${lang}/quote`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
    alternates: {
      languages: {
        ko: `${baseUrl}/ko/quote`,
        en: `${baseUrl}/en/quote`,
        ja: `${baseUrl}/ja/quote`,
        'x-default': `${baseUrl}/ko/quote`,
      },
    },
  }));

  return [
    rootEntry,
    ...homepages,
    ...aboutPages,
    ...productListPages,
    ...productDetailPages,
    ...technicalPages,
    ...exportPages,
    ...quotePages,
  ];
}
