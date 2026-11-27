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
    ? 'DOWSIL™ Silicone Sealants – 30 Products & TDS | KCT'
    : isJa
    ? 'DOWSIL™ 建築用シリコーン製品30種・TDS一覧 | KCT'
    : 'DOWSIL(다우실) 실리콘 실란트 30종 목록·TDS | KCT';

  const description = isEn
    ? 'Browse 30 DOWSIL™ sealants and primers across building envelope, GMP, civil, insulating glass and specialty lines with TDS PDFs and B2B supply.'
    : isJa
    ? 'Dow DOWSIL™の建築外装・GMP・土木・複層ガラス・特殊用途・プライマー全30種を掲載。製品別TDSダウンロード、仕様確認、B2B卸売・輸出見積に対応。'
    : 'Dow DOWSIL(다우실) 건축 외장·GMP·토목·복층유리·특수용·프라이머 30종 제품 목록. 제품별 TDS 다운로드, 주요 사양, 기술 지원 및 B2B 견적 안내.';

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
        // 목록 페이지에는 Product 형식을 중첩하지 않는다 (가격·리뷰가 없으면 제품 스니펫 오류) — 이름·URL만 제공
        "itemListElement": products.map((product, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": productName(product),
          "url": `https://kconstrade.com/${lang}/products/${product.slug}`,
        }))
      }
    ]
  };

  const pick = <T extends { ko: string; en: string }>(x: T) => (isEn ? x.en : x.ko);
  const bySlugMap = Object.fromEntries(products.map((p) => [p.slug, p]));
  const IMG_DIMS: Record<string, readonly [number, number]> = {
    '/assets/img/dow/1001-sausage-600.jpg': [600, 400],
    '/assets/img/dow/1200-os-can-400.png': [400, 400],
    '/assets/img/dow/121-kit-500.png': [500, 500],
    '/assets/img/dow/123-strips-600.jpg': [600, 600],
    '/assets/img/dow/335-butyl-600.jpg': [550, 550],
    '/assets/img/dow/375-pails-600.jpg': [540, 540],
    '/assets/img/dow/650-plus-drum-600.jpg': [510, 510],
    '/assets/img/dow/786-cartridge-431.jpg': [431, 431],
    '/assets/img/dow/789-cartridge-sausage-800.jpg': [800, 800],
    '/assets/img/dow/791-cartridge-sausage-800.jpg': [800, 800],
    '/assets/img/dow/795-cartridge-sausage-800.jpg': [800, 800],
    '/assets/img/dow/813c-sausage-600.jpg': [600, 600],
    '/assets/img/dow/888-sausage-600.jpg': [480, 480],
    '/assets/img/dow/890-sl-800.jpg': [800, 800],
    '/assets/img/dow/902-rcs-pail-600.jpg': [600, 600],
    '/assets/img/dow/939-drums-600.jpg': [550, 380],
    '/assets/img/dow/977-cartridge-sausage-800.jpg': [800, 800],
    '/assets/img/dow/982-drum-600.jpg': [411, 600],
    '/assets/img/dow/983-curing-agent-600.jpg': [540, 540],
    '/assets/img/dow/991-sausage-800.jpg': [800, 800],
    '/assets/img/dow/995-cartridge-800.jpg': [800, 800],
    '/assets/img/dow/allguard-pail-600.jpg': [600, 600],
    '/assets/img/dow/double-n-800.jpg': [800, 800],
    '/assets/img/dow/double-n-bath-800.jpg': [800, 800],
    '/assets/img/dow/firestop-700-cartridge-600.jpg': [600, 600],
    '/assets/img/dow/primer-c-can-600.jpg': [600, 600],
    '/assets/img/dow/rtv-hi-temp-736-600.jpg': [431, 431],
    '/assets/img/logo/Dow_Chemical_Company_logo.svg': [598, 210],
  };

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
                          <h3>{pick(r.name)}</h3>
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
                  const imgSrc = product.image_url ?? '/assets/img/logo/Dow_Chemical_Company_logo.svg';
                  const [imgW, imgH] = IMG_DIMS[imgSrc] ?? [600, 600];
                  return (
                    <article key={product.slug} className="tx-pcard">
                      <Link href={href} tabIndex={-1} className="tx-pimg">
                        <img
                          src={imgSrc}
                          alt={product.image_url ? productName(product) : `${productName(product)} — Dow`}
                          width={imgW}
                          height={imgH}
                          style={product.image_url ? undefined : { padding: 40, opacity: 0.35 }}
                          loading="lazy"
                          decoding="async"
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
              <caption className="visually-hidden">{isEn ? 'DOWSIL product TDS, colors and packaging' : 'DOWSIL 제품별 TDS·색상·포장'}</caption>
              <thead><tr><th scope="col">{isEn ? 'Product' : '제품'}</th><th scope="col">{isEn ? 'Also known as' : '다른 이름·표기'}</th><th scope="col">{isEn ? 'Colors' : '색상'}</th><th scope="col">{isEn ? 'Packaging' : '포장'}</th><th scope="col">TDS</th></tr></thead>
              <tbody>
                {products.map((pr) => {
                  const sp = pr.specs as Record<string, string>;
                  return (
                    <tr key={pr.slug}>
                      <td><Link href={`/${lang}/products/${pr.slug}`}>{pr.name}</Link></td>
                      <td>{(isEn ? aliasesOf(pr.slug).filter((a) => !/[가-힣]/.test(a)) : aliasesOf(pr.slug)).slice(0, 3).join(' · ')}</td>
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
          <div><h3>{isEn ? 'Not sure which one?' : '어떤 제품이 맞을지 모르겠다면'}</h3><p>{isEn ? 'Tell us the substrate and conditions. ' : '시공 자재와 사용 환경을 알려 주세요. '}<a href="mailto:sales@kconstrade.com">sales@kconstrade.com</a> · <a href="tel:+821089390284">{isEn ? '+82 10-8939-0284' : '010-8939-0284'}</a></p></div>
        </div>
      </div>
    </Tx>
  );
}
