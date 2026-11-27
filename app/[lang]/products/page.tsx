import { getDictionary } from '@/lib/dictionaries';
import { CATALOG, CATEGORIES, tdsUrl } from '@/lib/products-catalog';
import { localizeCatalog, CATEGORY_EN } from '@/lib/products-catalog-en';
import type { Metadata } from 'next';
import Link from 'next/link';
import Tx from '@/components/tech/Tx';
import { CAT_INTRO } from '@/lib/products-roles';
import { techCss } from '@/components/tech/TechBlocks';
import { aliasesOf } from '@/lib/product-seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: 'ko' | 'en' | 'ja' }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  const isJa = lang === 'ja';

  const title = isEn
    ? 'DOWSIL™ Silicone Sealants – 30 Products & TDS | Korea Construction Trading (KCT)'
    : isJa
    ? '建築用シリコーン製品一覧 | 韓国建設トレーディング (KCT)'
    : 'DOWSIL(다우실) 실리콘 실란트 30종 · TDS·색상 | 한국건설트레이딩 (KCT)';

  const description = isEn
    ? 'DOWSIL™ sealants by category: building envelope, GMP, civil, insulating glass, specialty, primers. TDS download for all 30 products. B2B supply & export.'
    : isJa
    ? 'DOWSIL™ 建築用・構造用シリコーンシーラント全製品ラインナップ。B2B卸売・グローバル輸出対応。'
    : 'Dow DOWSIL(다우실) 구조용·내후성·내화·복층유리·GMP·토목·프라이머 실란트 30종. 제품별 TDS(기술자료) PDF 다운로드, 색상·포장·사양, 기술 지원과 B2B 견적.';

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

  const pick = <T extends { ko: string; en: string }>(x: T) => (isEn ? x.en : x.ko);
  const bySlugMap = Object.fromEntries(products.map((p) => [p.slug, p]));

  return (
    <Tx>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="tx-hero tx-big" style={{ background: 'linear-gradient(180deg,rgba(12,13,15,.72),rgba(12,13,15,.94)), url(/assets/img/backgrounds/hero_construction.png) center/cover' }}>
        <div className="container">
          <nav aria-label="breadcrumb" className="mb-3">
            <Link href={`/${lang}`}>{d.navigation.home}</Link><span> / </span><span style={{ color: '#EDEDED' }}>{d.navigation.products}</span>
          </nav>
          <span className="badge">Products</span>
          <h1 className="fw-bold mt-3">
            {isEn ? <>Products <span className="tx-light">DOWSIL™ {products.length}</span></> : <>제품정보 <span className="tx-light">DOWSIL™ {products.length}종</span></>}
          </h1>
          <p>{isEn ? 'Different jobs need different silicones. Find the product by what it does on site — structural glazing, weatherproofing, fire protection, primers — and download the TDS.' : '용도마다 맞는 실리콘이 다릅니다. 구조 글레이징, 웨더실링, 방화, 프라이머처럼 현장에서 하는 일로 제품을 찾고 TDS를 내려받으세요.'}</p>
          <div className="d-flex flex-wrap gap-2 mt-4">
            <a href="mailto:sales@kconstrade.com" className="btn btn-light">{isEn ? 'Request a quote' : '견적·자료 문의'} →</a>
            <Link href={`/${lang}/technical`} className="btn btn-outline-light">{isEn ? 'Technical information' : '기술정보 보기'}</Link>
          </div>
        </div>
      </section>

      <nav className="tx-index" aria-label={isEn ? 'Product categories' : '제품군 바로가기'}>
        <div className="container">
          {cats.map((c, i) => (
            <a key={c.key} href={`#cat-${c.key}`}><span>{String(i + 1).padStart(2, '0')}</span>{c.label}<span>{products.filter((p) => p.category === c.key).length}</span></a>
          ))}
          <a href="#tds-colors"><span>TDS</span>{isEn ? 'TDS · colors' : 'TDS · 색상'}</a>
        </div>
      </nav>

      <div className="container pb-5">
        {cats.map((cat, i) => {
          const intro = CAT_INTRO[cat.key];
          const list = products.filter((p) => p.category === cat.key);
          return (
            <section key={cat.key} id={`cat-${cat.key}`} className="tx-cat" aria-labelledby={`h-${cat.key}`}>
              <div className="row g-4 g-lg-5">
                <div className="col-lg-4">
                  <div className="tx-cat-no">{String(i + 1).padStart(2, '0')} · {pick(intro.eyebrow)}</div>
                  <h2 id={`h-${cat.key}`} className="tx-sec-h">{cat.label}</h2>
                  <p className="tx-sec-sub" style={{ marginBottom: '.5rem' }}>{pick(intro.lead)}</p>
                  <p style={{ color: '#5d646b', fontSize: '.92rem' }}>{cat.desc}</p>
                </div>
                <div className="col-lg-8">
                  <div className="tx-roles">
                    {intro.roles.map((r) => (
                      <div key={r.role.en}>
                        <div className="tx-role">{pick(r.role)}</div>
                        <div>
                          <h4>{pick(r.name)}</h4>
                          <p>{pick(r.desc)}</p>
                          {r.slugs.map((sl) => bySlugMap[sl] && (
                            <Link key={sl} href={`/${lang}/products/${sl}`} className="tx-chip">{bySlugMap[sl].name_ko}</Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="tx-pgrid">
                {list.map((product) => {
                  const href = `/${lang}/products/${product.slug}`;
                  return (
                    <article key={product.slug} className="tx-pcard">
                      <Link href={href} tabIndex={-1} aria-hidden="true" className="tx-pimg">
                        <img
                          src={product.image_url ?? '/assets/img/logo/Dow_Chemical_Company_logo.svg'}
                          alt=""
                          style={product.image_url ? undefined : { padding: 40, opacity: 0.35 }}
                          loading="lazy"
                        />
                      </Link>
                      <div className="tx-pbody">
                        <h3><Link href={href}>{productName(product)}</Link></h3>
                        <p>{product.summary}</p>
                      </div>
                      <div className="tx-pact">
                        <Link href={href}>{isEn ? 'Details' : '상세 정보'}</Link>
                        <a href={tdsUrl(product.slug)} download>{product.docLabel ?? 'TDS'}</a>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}

        <section id="tds-colors" className="tx-cat" aria-labelledby="h-tds">
          <div className="tx-cat-no">TDS · {isEn ? 'Colors · Packaging' : '색상 · 포장'}</div>
          <h2 id="h-tds" className="tx-sec-h">{isEn ? 'TDS, colors and packaging at a glance' : 'TDS · 색상 · 포장 한눈에 보기'}</h2>
          <p className="tx-sec-sub">{isEn ? 'Download the technical data sheet (TDS) of every product and check colors and packaging as stated in the TDS. Ask us for the latest color chart and availability.' : '모든 제품의 기술 데이터시트(TDS) PDF를 바로 받고, TDS에 표기된 색상과 포장을 확인하세요. 최신 색상표(color chart)와 재고는 문의해 주세요.'}</p>
          <style dangerouslySetInnerHTML={{ __html: techCss }} />
          <div className="tech-table-wrap" tabIndex={0} role="region" aria-label={isEn ? 'TDS, colors and packaging table (scrollable)' : 'TDS·색상·포장 표 (가로 스크롤 가능)'}>
            <table className="table table-sm tech-table mb-0">
              <thead><tr><th>{isEn ? 'Product' : '제품'}</th><th>{isEn ? 'Also known as' : '다른 이름·표기'}</th><th>{isEn ? 'Colors' : '색상'}</th><th>{isEn ? 'Packaging' : '포장'}</th><th>TDS</th></tr></thead>
              <tbody>
                {products.map((pr) => {
                  const sp = pr.specs as Record<string, string>;
                  return (
                    <tr key={pr.slug}>
                      <td><Link href={`/${lang}/products/${pr.slug}`}>{pr.name}</Link></td>
                      <td>{aliasesOf(pr.slug).slice(0, 3).join(' · ')}</td>
                      <td>{(isEn ? sp['Colors'] : sp['색상']) || '–'}</td>
                      <td>{(isEn ? sp['Packaging'] : sp['포장']) || '–'}</td>
                      <td><a href={tdsUrl(pr.slug)} download>{pr.docLabel ?? 'TDS'} (PDF)</a></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <div className="tx-notes">
          <div><h3>{isEn ? 'About the values' : '자료 수치 안내'}</h3><p>{isEn ? 'Product data is summarized from Dow TDS; values are typical properties, not specifications. The linked TDS PDFs are authoritative.' : '제품 정보는 Dow TDS를 요약한 것이며 수치는 대표 특성이지 규격값이 아닙니다. 기준은 링크된 TDS 원문입니다.'}</p></div>
          <div><h3>{isEn ? 'Technical resources' : '기술정보'}</h3><p>{isEn ? 'Fire-rated manual, selection guides and training material. ' : '내화 매뉴얼, 선정 가이드, 실리콘 교육 자료. '}<Link href={`/${lang}/technical`}>{isEn ? 'Open Technical Information' : '기술정보 보기'}</Link></p></div>
          <div><h3>{isEn ? 'Not sure which one?' : '어떤 제품이 맞을지 모르겠다면'}</h3><p>{isEn ? 'Tell us the substrate and conditions. ' : '시공 자재와 사용 환경을 알려 주세요. '}<a href="mailto:sales@kconstrade.com">sales@kconstrade.com</a> · <a href="tel:+821089390284">010-8939-0284</a></p></div>
        </div>
      </div>
    </Tx>
  );
}
