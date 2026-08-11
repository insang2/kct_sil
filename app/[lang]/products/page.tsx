import { getDictionary } from '@/lib/dictionaries';
import { createClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '제품정보 | 한국건설트레이딩 (KCT) - 건축용 실리콘 전문',
  description: 'Dow 건축용·구조용 실리콘 전 라인업. 커튼월, 파사드 등 용도별 최적 실란트를 확인하세요.',
};

interface ProductRow {
  id: number;
  brand: string;
  sku: string | null;
  name_ko: string;
  name_en: string | null;
  category: string | null;
  slug: string | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
}

const FALLBACK_PRODUCTS: ProductRow[] = [
  { id: 1,  brand: 'DOWSIL', sku: '790',     name_ko: 'DOWSIL™ 790',     name_en: 'DOWSIL™ 790 Low-Modulus Sealant',       category: '내후성',  slug: 'dowsil-790',     image_url: '/assets/img/dow/789-cartridge-sausage-800.jpg', is_active: true, sort_order: 1 },
  { id: 2,  brand: 'DOWSIL', sku: '791',     name_ko: 'DOWSIL™ 791',     name_en: 'DOWSIL™ 791 Weatherproofing Sealant',   category: '내후성',  slug: 'dowsil-791',     image_url: '/assets/img/dow/791-cartridge-sausage-800.jpg', is_active: true, sort_order: 2 },
  { id: 3,  brand: 'DOWSIL', sku: '795',     name_ko: 'DOWSIL™ 795',     name_en: 'DOWSIL™ 795 Structural Glazing Sealant', category: '구조용',  slug: 'dowsil-795',     image_url: '/assets/img/dow/795-cartridge-sausage-800.jpg', is_active: true, sort_order: 3 },
  { id: 4,  brand: 'DOWSIL', sku: '995',     name_ko: 'DOWSIL™ 995',     name_en: 'DOWSIL™ 995 Structural Sealant',        category: '구조용',  slug: 'dowsil-995',     image_url: '/assets/img/dow/995-cartridge-800.jpg',         is_active: true, sort_order: 4 },
  { id: 5,  brand: 'DOWSIL', sku: '756 SMS', name_ko: 'DOWSIL™ 756 SMS', name_en: 'DOWSIL™ 756 SMS Stone & Facade Sealant', category: '특수',    slug: 'dowsil-756-sms', image_url: '/assets/img/dow/group-800.jpg',                  is_active: true, sort_order: 5 },
  { id: 7,  brand: 'DOWSIL', sku: '732',     name_ko: 'DOWSIL™ 732',     name_en: 'DOWSIL™ 732 Multi-Purpose Sealant',     category: '다목적',  slug: 'dowsil-732',     image_url: '/assets/img/dow/group-800.jpg',                  is_active: true, sort_order: 7 },
  { id: 8,  brand: 'DOWSIL', sku: '977',     name_ko: 'DOWSIL™ 977',     name_en: 'DOWSIL™ 977 Sausage Sealant',           category: '내후성',  slug: 'dowsil-977',     image_url: '/assets/img/dow/977-cartridge-sausage-800.jpg', is_active: true, sort_order: 8 },
  { id: 9,  brand: 'DOWSIL', sku: '991',     name_ko: 'DOWSIL™ 991',     name_en: 'DOWSIL™ 991 Sausage Sealant',           category: '구조용',  slug: 'dowsil-991',     image_url: '/assets/img/dow/991-sausage-800.jpg',           is_active: true, sort_order: 9 },
  { id: 10, brand: 'DOWSIL', sku: '983',     name_ko: 'DOWSIL™ 983',     name_en: 'DOWSIL™ 983 Two-Part Structural Sealant', category: '구조용', slug: 'dowsil-983',     image_url: '/assets/img/dow/group-800.jpg',                  is_active: true, sort_order: 10 },
];

const CATEGORY_BADGE: Record<string, string> = {
  '내후성': 'bg-primary',
  '구조용': 'bg-success',
  '특수':   'bg-warning text-dark',
  '내부':   'bg-info text-dark',
  '다목적': 'bg-info text-dark',
};

const USE_TEXT: Record<string, string> = {
  'dowsil-790':     '저모듈러스 · 확장 조인트용',
  'dowsil-791':     '커튼월 · 파사드 내후성 실링',
  'dowsil-795':     '다목적 구조용 · 내후성',
  'dowsil-995':     '고장력 · 내풍압 고성능',
  'dowsil-756-sms': '오염방지형 · 석재 · 패널용',
  'dowsil-732':     '일반 접착 · 코팅 다목적',
  'dowsil-977':     '소시지형 · 내후성용',
  'dowsil-991':     '소시지형 · 구조용',
  'dowsil-983':     '공장용 2액형 빠른 경화형',
};

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ lang: 'ko' | 'en' | 'ja' }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const d = dict as any;

  let products: ProductRow[] = FALLBACK_PRODUCTS;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('products')
      .select('id, brand, sku, name_ko, name_en, category, slug, image_url, is_active, sort_order')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    if (data && data.length > 0) products = data;
  } catch {
    // use fallback
  }

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": products.map((product, index) => {
      const slug = product.slug ?? `${product.brand.toLowerCase()}-${(product.sku ?? '').toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      return {
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": product.name_ko,
          "url": `https://kconstrade.com/${lang}/products/${slug}`,
          "image": product.image_url ? `https://kconstrade.com${product.image_url}` : `https://kconstrade.com/assets/img/dow/단체컷_sqr_800.jpg`,
          "brand": {
            "@type": "Brand",
            "name": product.brand
          }
        }
      };
    })
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
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
                Dow Chemical 취급 · 건축·구조용 실리콘 전 라인업
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

      {/* Product Grid */}
      <section className="py-9 py-lg-11 bg-white">
        <div className="container">
          <div className="row g-4">
            {products.map((product) => {
              const slug = product.slug ?? `${product.brand.toLowerCase()}-${(product.sku ?? '').toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
              const useText = USE_TEXT[slug] ?? '';
              const imgSrc = product.image_url ?? '/assets/img/dow/단체컷_sqr_800.jpg';
              const category = product.category ?? '';

              return (
                <div key={product.id} className="col-sm-6 col-lg-4 col-xl-3">
                  <div className="card border-0 rounded-4 h-100 shadow-sm overflow-hidden product-card-hover">
                    {/* Product Image */}
                    <Link href={`/${lang}/products/${slug}`} className="d-block overflow-hidden" style={{ height: '200px', background: '#f8f9fa' }}>
                      <img
                        src={imgSrc}
                        alt={product.name_ko}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '12px' }}
                        loading="lazy"
                      />
                    </Link>

                    {/* Card Body */}
                    <div className="card-body p-4">
                      {category && (
                        <span className={`badge rounded-pill px-3 py-1 small mb-2 d-inline-block ${CATEGORY_BADGE[category] ?? 'bg-secondary'}`}>
                          {category}
                        </span>
                      )}
                      <h5 className="fw-bold text-dark mb-1" style={{ fontSize: '1rem' }}>
                        <Link href={`/${lang}/products/${slug}`} className="text-decoration-none text-dark">
                          {product.name_ko}
                        </Link>
                      </h5>
                      {useText && (
                        <p className="text-body-secondary small mb-0" style={{ lineHeight: 1.5 }}>{useText}</p>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div className="card-footer border-0 bg-transparent px-4 pb-4 pt-0 d-flex gap-2">
                      <Link
                        href={`/${lang}/products/${slug}`}
                        className="btn btn-primary btn-sm rounded-pill flex-grow-1"
                      >
                        <i className="bi bi-info-circle me-1"></i>{d.products?.btn_detail ?? 'Details'}
                      </Link>
                      <a
                        href={`https://wa.me/821089390284?text=${encodeURIComponent(`안녕하세요! ${product.name_ko} 제품 견적 문의드립니다.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-success btn-sm rounded-pill flex-grow-1"
                      >
                        <i className="bi bi-whatsapp me-1"></i>WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
