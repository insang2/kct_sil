import { MetadataRoute } from 'next';
import { CATALOG } from '@/lib/products-catalog';
import { PAGES as TECH_PAGES } from '@/lib/tech-manual';
import { IPAGES } from '@/lib/industrial/pages';
import { SERIES } from '@/lib/series/config';
import { SERIES_DATES, SITE_DATES, seriesPageDate } from '@/lib/series/dates';
import { PRODUCTS_UPDATED } from '@/lib/rss';

const LANGS = ['ko', 'en', 'ja'] as const;
// 한국어/영문 본문만 있는 섹션(제품·기술정보)은 ja를 제외 — ja 페이지는 ko/en으로 canonical 통합
const KO_EN = ['ko', 'en'] as const;

const PRODUCT_SLUGS = CATALOG.map((p) => p.slug);

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://kconstrade.com';
  // 섹션·시리즈별 실제 콘텐츠 수정일로 분산 고정 (루트 307/308 리다이렉트 URL 제외)
  const homeModified = new Date(SITE_DATES.home);
  const aboutModified = new Date(SITE_DATES.about);
  const exportModified = new Date(SITE_DATES.export);
  const quoteModified = new Date(SITE_DATES.quote);
  const productsModified = new Date(PRODUCTS_UPDATED);

  // Homepages
  const homepages = LANGS.map((lang) => ({
    url: `${baseUrl}/${lang}`,
    lastModified: homeModified,
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
    lastModified: aboutModified,
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
    lastModified: productsModified,
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
      lastModified: productsModified,
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

  // Technical information (hub + pages, 시리즈·판본별 실제 갱신일 사용)
  const techEntries: { path: string; date: string }[] = [
    { path: 'technical', date: SITE_DATES.technicalHub },
    ...TECH_PAGES.map((p) => ({ path: `technical/${p.slug}`, date: SERIES_DATES.fire })),
    { path: 'technical/industrial', date: SERIES_DATES.industrial },
    ...IPAGES.map((p) => ({ path: `technical/industrial/${p.slug}`, date: SERIES_DATES.industrial })),
    ...Object.values(SERIES).flatMap((x) => [
      { path: `technical/${x.key}`, date: seriesPageDate(x.key) },
      ...x.pages.map((p) => ({ path: `technical/${x.key}/${p.slug}`, date: seriesPageDate(x.key, p.doc) })),
    ]),
  ];
  const technicalPages = KO_EN.flatMap((lang) =>
    techEntries.map(({ path, date }) => ({
      url: `${baseUrl}/${lang}/${path}`,
      lastModified: new Date(date),
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
    lastModified: exportModified,
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
    lastModified: quoteModified,
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

  // TDS 센터 · HTML 사이트맵 (ko/en)
  const utilityPages = KO_EN.flatMap((lang) =>
    ['tds', 'sitemap'].map((path) => ({
      url: `${baseUrl}/${lang}/${path}`,
      lastModified: new Date(SITE_DATES.technicalHub),
      changeFrequency: 'monthly' as const,
      priority: path === 'tds' ? 0.8 : 0.5,
      alternates: {
        languages: { ko: `${baseUrl}/ko/${path}`, en: `${baseUrl}/en/${path}`, 'x-default': `${baseUrl}/ko/${path}` },
      },
    }))
  );

  return [
    ...homepages,
    ...aboutPages,
    ...productListPages,
    ...productDetailPages,
    ...technicalPages,
    ...exportPages,
    ...quotePages,
    ...utilityPages,
  ];
}
