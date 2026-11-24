import { getDictionary } from '@/lib/dictionaries';
import { CATALOG, CATEGORIES, tdsUrl } from '@/lib/products-catalog';
import { localizeCatalog, CATEGORY_EN } from '@/lib/products-catalog-en';
import type { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: 'ko' | 'en' | 'ja' }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  const isJa = lang === 'ja';

  const title = isEn
    ? 'Architectural Silicone Sealants Products | Korea Construction Trading (KCT)'
    : isJa
    ? '建築用シリコーン製品一覧 | 韓国建設トレー딩 (KCT)'
    : '건축용 실리콘 제품정보 | 한국건설트레이딩 (KCT)';

  const description = isEn
    ? 'Explore full lineup of DOWSIL™ architectural and structural silicone sealants: 790, 791, 795, 995, 756 SMS, 977, 991, and more. Bulk B2B supply & global export.'
    : isJa
    ? 'DOWSIL™ 建築用・構造用シリコーンシーラント全製品ラインナップ。790, 791, 795, 995, 756 SMS, 977, 991など。B2B卸売・グローバル輸出対応。'
    : 'Dow(다우) 건축용·구조용 실리콘 전 라인업: DOWSIL 790, 791, 795, 995, 756 SMS, 977, 991 등. 커튼월, 파사드, 구조글레이징 전용 B2B 도매 및 수출 공급.';

  return {
    title,
    description,
    alternates: {
      canonical: `https://kconstrade.com/${lang === 'ja' ? 'ko' : lang}/products`, // ja는 한국어 본문이라 ko로 통합
      languages: {
        'ko': 'https://kconstrade.com/ko/products',
        'en': 'https://kconstrade.com/en/products',
        'x-default': 'https://kconstrade.com/ko/products',
      },
    },
    openGraph: {
      title,
      description,
      url: `https://kconstrade.com/${lang}/products`,
      siteName: '한국건설트레이딩 (KCT)',
      images: [
        {
          url: 'https://kconstrade.com/assets/img/og-image.png',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
    },
  };
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ lang: 'ko' | 'en' | 'ja' }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const d = dict as any;

  const isEn = lang === 'en';
  const cats = CATEGORIES.map((c) => (isEn ? { ...c, ...CATEGORY_EN[c.key] } : c));
  const products = CATALOG.map((p0) => localizeCatalog(p0, lang)).map((p) => ({ ...p, brand: 'DOWSIL', name_ko: p.name, name_en: p.title, image_url: p.image ?? null }));
  const productName = (p: (typeof products)[number]) => (lang === 'en' ? p.name_en : p.name_ko);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": lang === 'en' ? 'Home' : lang === 'ja' ? 'ホーム' : '홈',
            "item": `https://kconstrade.com/${lang}`
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": lang === 'en' ? 'Products' : lang === 'ja' ? '製品' : '제품정보',
            "item": `https://kconstrade.com/${lang}/products`
          }
        ]
      },
      {
        "@type": "ItemList",
        "name": lang === 'en' ? 'Architectural Silicone Products' : '건축용 실리콘 제품 목록',
        "itemListElement": products.map((product, index) => {
          const slug = product.slug;
          return {
            "@type": "ListItem",
            "position": index + 1,
            "item": {
              "@type": "Product",
              "name": productName(product),
              "url": `https://kconstrade.com/${lang}/products/${slug}`,
              "image": product.image_url ? `https://kconstrade.com${product.image_url}` : `https://kconstrade.com/assets/img/og-image.png`,
              "brand": {
                "@type": "Brand",
                "name": product.brand
              }
            }
          };
        })
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Hero */}
      <section
        className="position-relative overflow-hidden text-white"
        style={{ minHeight: '40vh', display: 'flex', alignItems: 'center' }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url('/assets/img/backgrounds/hero_construction.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="container position-relative z-1 py-9 mt-6">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center">
              <span
                className="badge rounded-pill px-3 py-2 mb-4 text-uppercase fw-bold"
                style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', letterSpacing: '0.08em' }}
              >
                Architectural Silicone
              </span>
              <h1 className="display-4 fw-bold text-white mb-3" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                {d.navigation.products}
              </h1>
              <p className="lead text-white mb-0" style={{ opacity: 0.9, textShadow: '0 1px 5px rgba(0,0,0,0.2)' }}>
                {isEn ? 'Dow Chemical silicone sealants — full architectural & structural lineup' : 'Dow Chemical 취급 · 건축·구조용 실리콘 전 라인업'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-light border-bottom py-2">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 small">
              <li className="breadcrumb-item"><Link href={`/${lang}`} className="text-decoration-none">{d.navigation.home}</Link></li>
              <li className="breadcrumb-item active">{d.navigation.products}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Category nav */}
      <div className="bg-white border-bottom sticky-top" style={{ top: 72, zIndex: 10 }}>
        <div className="container py-3 d-flex flex-wrap gap-2 justify-content-center">
          {cats.map((c) => (
            <a key={c.key} href={`#cat-${c.key}`} className="btn btn-outline-primary btn-sm rounded-pill px-3">
              {c.label} <span className="opacity-75">({products.filter((p) => p.category === c.key).length})</span>
            </a>
          ))}
        </div>
      </div>

      {/* Product Grid by category */}
      <section className="py-9 bg-white">
        <div className="container">
          {cats.map((cat) => (
            <div key={cat.key} id={`cat-${cat.key}`} className="mb-9" style={{ scrollMarginTop: 150 }}>
              <h2 className="h3 fw-bold mb-1">{cat.label}</h2>
              <p className="mb-4" style={{ color: '#555370' }}>{cat.desc}</p>
              <div className="row g-4">
                {products.filter((p) => p.category === cat.key).map((product) => {
                  const href = `/${lang}/products/${product.slug}`;
                  return (
                    <div key={product.slug} className="col-sm-6 col-lg-4 col-xl-3">
                      <div className="card border-0 rounded-4 h-100 shadow-sm overflow-hidden product-card-hover">
                        <Link href={href} className="d-block overflow-hidden" style={{ height: '180px', background: '#f8f9fa' }}>
                          <img
                            src={product.image_url ?? '/assets/img/logo/Dow_Chemical_Company_logo.svg'}
                            alt={product.name_ko}
                            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: product.image_url ? '12px' : '40px', opacity: product.image_url ? 1 : 0.35 }}
                            loading="lazy"
                          />
                        </Link>
                        <div className="card-body p-4">
                          <h5 className="fw-bold mb-2" style={{ fontSize: '1rem' }}>
                            <Link href={href} className="text-decoration-none text-dark">{product.name_ko}</Link>
                          </h5>
                          <p className="small mb-0" style={{ lineHeight: 1.5, color: '#555370' }}>{product.summary}</p>
                        </div>
                        <div className="card-footer border-0 bg-transparent px-4 pb-4 pt-0 d-flex gap-2">
                          <Link href={href} className="btn btn-primary btn-sm rounded-pill flex-grow-1">
                            <i className="bi bi-info-circle me-1"></i>{isEn ? 'Details' : '상세 정보'}
                          </Link>
                          <a href={tdsUrl(product.slug)} download className="btn btn-outline-danger btn-sm rounded-pill flex-grow-1">
                            <i className="bi bi-file-earmark-pdf me-1"></i>{product.docLabel ?? 'TDS'}
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
