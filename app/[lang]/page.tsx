import Link from 'next/link';
import { getDictionary } from '@/lib/dictionaries';
import { CATALOG, CATEGORIES, bySlug } from '@/lib/products-catalog';
import { localizeCatalog, CATEGORY_EN } from '@/lib/products-catalog-en';
import { CAT_INTRO } from '@/lib/products-roles';
import { HUBS } from '@/lib/series/hubs';
import Tx from '@/components/tech/Tx';
import TdsAccess from '@/components/tds/TdsAccess';
import HomeFormSection from '@/components/home/HomeFormSection';
import { homeCss } from '@/components/home/home-styles';
import {
  CAT_JA,
  FEATURED_IMG_DIMS,
  FEATURED_SLUGS,
  HUB_JA,
  HUB_ORDER,
  JA_SUMMARY,
  getHomeCopy,
  getHomeFaqs,
  type Lang,
} from '@/components/home/home-copy';

const ArrowIcon = () => (
  <svg className="th-arw" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default async function Home({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const dict = (await getDictionary(lang)) as Record<string, any>;

  const isEn = lang === 'en';
  const isJa = lang === 'ja';
  const productCount = CATALOG.length;
  const categoryCount = CATEGORIES.length;

  const orderedHubs = HUB_ORDER.map((key) => HUBS.find((h) => h.key === key)).filter(
    (h): h is (typeof HUBS)[number] => Boolean(h),
  );
  const totalTechPages = orderedHubs.reduce((sum, hub) => sum + hub.count, 0);

  const copy = getHomeCopy(lang, productCount, categoryCount, orderedHubs.length, totalTechPages);
  const faqs = getHomeFaqs(lang, productCount);

  const featuredProducts = FEATURED_SLUGS.map((slug) => bySlug(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((p0) => {
      const p = localizeCatalog(p0, lang);
      const catLabel = isEn
        ? CATEGORY_EN[p.category].label
        : isJa
        ? CAT_JA[p.category].label
        : (CATEGORIES.find((c) => c.key === p.category)?.label ?? p.category);
      return {
        slug: p.slug,
        name: p.name,
        title: p.title,
        summary: isJa ? (JA_SUMMARY[p.slug] ?? p.summary) : p.summary,
        catLabel,
        image: p.image ?? null,
        docLabel: p.docLabel ?? 'TDS',
      };
    });

  const solutionCategories = CATEGORIES.map((cat) => {
    const intro = CAT_INTRO[cat.key];
    const count = CATALOG.filter((p) => p.category === cat.key).length;
    if (isJa) {
      const ja = CAT_JA[cat.key];
      return {
        key: cat.key,
        label: ja.label,
        eyebrow: ja.eyebrow,
        lead: ja.lead,
        roles: ja.roles,
        count,
      };
    }
    if (isEn) {
      return {
        key: cat.key,
        label: CATEGORY_EN[cat.key].label,
        eyebrow: intro.eyebrow.en,
        lead: intro.lead.en,
        roles: intro.roles.map((r) => r.role.en),
        count,
      };
    }
    return {
      key: cat.key,
      label: cat.label,
      eyebrow: intro.eyebrow.ko,
      lead: intro.lead.ko,
      roles: intro.roles.map((r) => r.role.ko),
      count,
    };
  });

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `https://kconstrade.com/${lang}/#website`,
        url: `https://kconstrade.com/${lang}`,
        name: dict.metadata?.title || 'Korea Construction Trading (KCT)',
        description: dict.metadata?.description || 'Architectural and structural silicone wholesale and export.',
        publisher: {
          '@id': 'https://kconstrade.com/#organization',
        },
        inLanguage: lang,
      },
      {
        '@type': 'LocalBusiness',
        '@id': `https://kconstrade.com/${lang}/#localbusiness`,
        name: isEn
          ? 'Korea Construction Trading (KCT)'
          : isJa
          ? '韓国建設トレーディング (KCT)'
          : '한국건설트레이딩 (Korea Construction Trading)',
        image: 'https://kconstrade.com/assets/img/logo/kct_logo.jpeg',
        url: 'https://kconstrade.com',
        telephone: '+82-10-8939-0284',
        email: 'sales@kconstrade.com',
        address: isEn
          ? {
              '@type': 'PostalAddress',
              streetAddress: '10 Chungmin-ro, 4-A19 Garden Five Tools',
              addressLocality: 'Songpa-gu',
              addressRegion: 'Seoul',
              postalCode: '05840',
              addressCountry: 'KR',
            }
          : {
              '@type': 'PostalAddress',
              streetAddress: '충민로 10 4-A19 가든파이브툴',
              addressLocality: '송파구',
              addressRegion: '서울특별시',
              postalCode: '05840',
              addressCountry: 'KR',
            },
        priceRange: '$$',
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '18:00',
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `https://kconstrade.com/${lang}/#faq`,
        mainEntity: faqs.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a,
          },
        })),
      },
    ],
  };

  const processSteps = (dict.process?.steps ?? [
    { title: 'Submit Inquiry', desc: 'Contact us by phone, email, or WhatsApp with the materials and quantities you need.' },
    { title: 'Custom Quote', desc: 'We send a detailed quotation with pricing and delivery schedule within 24 hours.' },
    { title: 'Confirm Order', desc: 'Agree on payment terms and confirm your order. Tax invoice available.' },
    { title: 'Fast Delivery', desc: 'Same/next-day in Seoul metro area; 2–3 days nationwide. Multi-site split delivery.' },
  ]) as Array<{ title: string; desc: string }>;

  const trustItems = [
    { icon: 'bi-building-check', text: dict.trust?.t2 ?? 'Business Reg. No. 371-07-03719' },
    { icon: 'bi-calendar2-check', text: dict.trust?.t3 ?? 'Est. 2018 · Architectural Silicone Specialist' },
    { icon: 'bi-globe2', text: dict.trust?.t4 ?? 'Exporting to Japan · Taiwan · Southeast Asia' },
    { icon: 'bi-file-earmark-pdf', text: copy.trustTds },
  ];

  const companyPillars = [
    { title: dict.features?.f1_title, desc: dict.features?.f1_desc },
    { title: dict.features?.f2_title, desc: dict.features?.f2_desc },
    { title: dict.features?.f3_title, desc: dict.features?.f3_desc },
  ].filter((p) => p.title && p.desc);

  return (
    <Tx>
      <style dangerouslySetInnerHTML={{ __html: homeCss }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      {/* ① 다크 풀블리드 히어로 */}
      <section className="th-hero" aria-labelledby="home-hero-heading">
        <div className="th-hero-media" aria-hidden="true">
          <img
            src="/assets/img/backgrounds/hero_construction.png"
            alt=""
            width={1024}
            height={1024}
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <div className="container th-hero-in">
          <p className="th-hero-eyebrow">{copy.heroEyebrow}</p>
          <h1 id="home-hero-heading">
            {copy.h1Main}
            <span className="tx-light">{copy.h1Light}</span>
          </h1>
          <div className="th-hero-row">
            <p className="th-hero-copy">
              {copy.heroDesc1}
              <span>{copy.heroDesc2}</span>
            </p>
            <div className="th-hero-cta">
              <a href="#b2b-form" className="th-btn-light">
                <span>{copy.ctaQuote}</span>
                <ArrowIcon />
              </a>
              <Link href={`/${lang}/products`} className="th-btn-ghost">
                <span>{copy.ctaProducts}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ② 핵심 수치 / 신뢰 띠 */}
      <section className="th-metrics-sec" aria-label={copy.metricsAria}>
        <div className="container">
          <div className="th-metrics">
            {copy.metrics.map((m) => (
              <div key={m.label} className="th-metric">
                <div className="th-metric-val">
                  <span>{m.num}</span>
                  <small>{m.unit}</small>
                </div>
                <p>{m.label}</p>
              </div>
            ))}
          </div>
          <div className="th-trust-strip">
            {trustItems.map((item) => (
              <span key={item.text} className="th-trust-item">
                <i className={`bi ${item.icon}`} aria-hidden="true" />
                <span>{item.text}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ③ 제품군별 솔루션 블록 */}
      <section className="th-sec th-sec-tint" aria-labelledby="home-solutions-heading">
        <div className="container">
          <div className="th-sec-head">
            <div className="th-sec-head-text">
              <div className="tx-eyebrow">{copy.solEyebrow}</div>
              <h2 id="home-solutions-heading">{copy.solTitle}</h2>
              <p>{copy.solSub}</p>
            </div>
            <Link href={`/${lang}/products`} className="th-tlink">
              <span>{copy.solAll}</span>
              <ArrowIcon />
            </Link>
          </div>

          <div className="th-slist">
            {solutionCategories.map((cat, idx) => (
              <Link key={cat.key} href={`/${lang}/products#cat-${cat.key}`} className="th-srow">
                <span className="th-srow-no">{String(idx + 1).padStart(2, '0')}</span>
                <div className="th-srow-head">
                  <div className="th-srow-title">
                    <span>{cat.label}</span>
                    <span className="th-srow-count">
                      {cat.count} {copy.solUnit}
                    </span>
                  </div>
                  <span className="th-srow-eyebrow">{cat.eyebrow}</span>
                </div>
                <div className="th-srow-right">
                  <p className="th-srow-desc">{cat.lead}</p>
                  <div className="th-srow-tags">
                    {cat.roles.map((role) => (
                      <span key={role} className="th-tag">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="th-srow-go" aria-hidden="true">
                  <ArrowIcon />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ④ 대표 제품 카드 8종 */}
      <section className="th-sec th-sec-white" aria-labelledby="home-featured-products">
        <div className="container">
          <div className="th-sec-head">
            <div className="th-sec-head-text">
              <div className="tx-eyebrow">{copy.prodEyebrow}</div>
              <h2 id="home-featured-products">{copy.prodTitle}</h2>
              <p>{copy.prodSub}</p>
            </div>
            <Link href={`/${lang}/products`} className="th-tlink">
              <span>{copy.prodAll}</span>
              <ArrowIcon />
            </Link>
          </div>

          <div className="th-pgrid">
            {featuredProducts.map((product) => {
              const href = `/${lang}/products/${product.slug}`;
              const imgSrc = product.image ?? '/assets/img/logo/Dow_Chemical_Company_logo.svg';
              const [imgW, imgH] = FEATURED_IMG_DIMS[imgSrc] ?? [600, 600];
              const displayLabel = isEn ? product.title : product.name;
              return (
                <article key={product.slug} className="th-pcard">
                  <Link href={href} tabIndex={-1} className="th-pcard-img">
                    <img
                      src={imgSrc}
                      alt={product.image ? displayLabel : `${displayLabel} — Dow`}
                      width={imgW}
                      height={imgH}
                      loading="lazy"
                      decoding="async"
                      style={product.image ? undefined : { width: '56%', opacity: 0.35 }}
                    />
                  </Link>
                  <div className="th-pcard-body">
                    <span className="th-pcard-cat">{product.catLabel}</span>
                    <h3>
                      <Link href={href}>{product.name}</Link>
                    </h3>
                    <p>{product.summary}</p>
                  </div>
                  <div className="th-pcard-act">
                    <Link href={href}>{copy.prodDetails}</Link>
                    <TdsAccess
                      slug={product.slug}
                      productName={product.name}
                      lang={lang}
                      variant="button"
                      compact
                    />
                  </div>
                </article>
              );
            })}
          </div>

          <div className="th-prod-foot">
            <Link href={`/${lang}/products`} className="th-btn-dark">
              <span>{copy.prodAll}</span>
              <ArrowIcon />
            </Link>
            <Link href={`/${lang === 'ja' ? 'en' : lang}/tds`} className="th-btn-outline">
              <span>{copy.prodTdsHub}</span>
            </Link>
            <Link href={`/${lang}/quote`} className="th-btn-outline">
              <span>{copy.btnQuote}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ⑤ 기술정보 허브 6곳 타일 */}
      <section className="th-sec th-sec-tint" aria-labelledby="home-technical-hubs">
        <div className="container">
          <div className="th-sec-head">
            <div className="th-sec-head-text">
              <div className="tx-eyebrow">{copy.techEyebrow}</div>
              <h2 id="home-technical-hubs">{copy.techTitle}</h2>
              <p>{copy.techSub}</p>
            </div>
            <Link href={`/${lang}/technical`} className="th-tlink">
              <span>{copy.techAll}</span>
              <ArrowIcon />
            </Link>
          </div>

          <div className="th-tech-grid">
            {orderedHubs.map((hub, idx) => {
              const title = isEn ? hub.title.en : isJa ? (HUB_JA[hub.key]?.title ?? hub.title.en) : hub.title.ko;
              const desc = isEn ? hub.desc.en : isJa ? (HUB_JA[hub.key]?.desc ?? hub.desc.en) : hub.desc.ko;
              return (
                <Link key={hub.key} href={`/${lang}/${hub.path}`} className="th-tech-card">
                  <div className="th-tech-top">
                    <span className="tx-no">{String(idx + 1).padStart(2, '0')}</span>
                    <span className="th-tech-count">
                      {hub.count} {copy.techPages}
                    </span>
                  </div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                  <span className="th-tech-open">
                    <span>{copy.techOpen}</span>
                    <ArrowIcon />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ⑥ 회사/Dow 실리콘 판매 소개 + 지속가능경영 링크 띠 (/sustainability) */}
      <section className="th-sec th-sec-white" aria-labelledby="home-company-heading">
        <div className="container">
          <div className="th-company-grid">
            <div>
              <div className="tx-eyebrow" style={{ color: 'var(--tx-mute)', marginBottom: '0.75rem' }}>
                {copy.companyEyebrow}
              </div>
              <h2 id="home-company-heading" className="tx-sec-h" style={{ marginTop: 0 }}>
                {copy.companyTitle}
              </h2>
              <div className="th-dow-lock">
                <img
                  src="/assets/img/logo/Dow_Chemical_Company_logo.svg"
                  alt="Dow"
                  width={598}
                  height={210}
                  loading="lazy"
                  decoding="async"
                />
                <span>{copy.dowCaption}</span>
              </div>
            </div>

            <div>
              <p style={{ margin: '0 0 1.5rem', color: 'var(--tx-fg)', fontSize: '1.04rem', lineHeight: 1.8 }}>
                {copy.companyDesc}
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link href={`/${lang}/about`} className="th-btn-dark">
                  <span>{copy.companyLinkAbout}</span>
                  <ArrowIcon />
                </Link>
                <Link href={`/${lang}/export`} className="th-btn-outline">
                  <span>{copy.companyLinkExport}</span>
                </Link>
              </div>
            </div>
          </div>

          {companyPillars.length > 0 && (
            <div className="th-pillars">
              {companyPillars.map((item, i) => (
                <div key={item.title} className="th-pillar">
                  <span className="tx-no" style={{ display: 'block', marginBottom: '0.45rem' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* 지속가능경영 링크 띠 */}
          <div className="th-esg-band" aria-labelledby="home-esg-heading">
            <div>
              <div className="tx-eyebrow" style={{ color: 'var(--tx-mute)', marginBottom: '0.45rem' }}>
                {copy.esgEyebrow}
              </div>
              <h3 id="home-esg-heading" style={{ fontSize: 'clamp(1.2rem,1.9vw,1.55rem)', margin: 0, letterSpacing: '-0.025em' }}>
                {copy.esgTitle}
              </h3>
              <div className="th-esg-items">
                {copy.esgItems.map((item) => (
                  <div key={item.title}>
                    <b>{item.title}</b>
                    <span>{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Link href={`/${lang}/sustainability`} className="th-tlink">
                <span>{copy.esgLink}</span>
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ⑦ 수출·B2B 문의 CTA + #b2b-form + 오시는 길 */}
      <HomeFormSection
        lang={lang}
        copy={{
          exportCtaEyebrow: copy.exportCtaEyebrow,
          exportCtaTitle: copy.exportCtaTitle,
          exportCtaDesc: copy.exportCtaDesc,
          exportCtaExport: copy.exportCtaExport,
          exportCtaQuote: copy.exportCtaQuote,
          b2bEyebrow: copy.b2bEyebrow,
          b2bFormRequiredHint: copy.b2bFormRequiredHint,
          b2bSubmitNote: copy.b2bSubmitNote,
          locationLabel: copy.locationLabel,
          locationTitle: copy.locationTitle,
          mapTitle: copy.mapTitle,
          businessHours: copy.businessHours,
        }}
        b2bTitle={dict.b2b_form?.title ?? 'Free B2B Quote Request'}
        b2bDesc={dict.b2b_form?.desc ?? 'Get rapid pricing for the bulk architectural silicone needed for your project.'}
        formLabels={{
          name: dict.b2b_form?.form_name ?? 'Company / Contact Name',
          namePh: dict.b2b_form?.form_name_ph ?? 'e.g. ABC Construction / John Doe',
          email: dict.auth?.email ?? 'Email',
          phone: dict.auth?.phone ?? 'Phone',
          message: dict.b2b_form?.form_message ?? 'Inquiry Details',
          messagePh: dict.b2b_form?.form_message_ph ?? 'Please include the materials, quantities, and site location.',
          submit: dict.b2b_form?.btn_submit ?? 'Submit Quote Request',
        }}
        ctaLabels={{
          whatsapp: dict.cta?.btn_whatsapp ?? 'WhatsApp',
          email: dict.cta?.btn_email ?? 'sales@kconstrade.com',
        }}
        processSteps={processSteps}
      />

      {/* ⑧ FAQ (가시, JSON-LD FAQPage와 완전 일치) */}
      <section className="th-sec th-sec-white" aria-labelledby="home-faq-title">
        <div className="container">
          <div className="th-faq-wrap">
            <div>
              <div className="tx-eyebrow" style={{ color: 'var(--tx-mute)', marginBottom: '0.75rem' }}>
                {copy.faqEyebrow}
              </div>
              <h2 id="home-faq-title" className="tx-sec-h" style={{ marginTop: 0 }}>
                {copy.faqTitle}
              </h2>
              <p style={{ margin: 0, color: 'var(--tx-mute)', lineHeight: 1.72 }}>{copy.faqSub}</p>
            </div>

            <div className="th-faq-list">
              {faqs.map((item, idx) => (
                <details key={idx} className="th-faq-item" open={idx === 0}>
                  <summary>{item.q}</summary>
                  <p className="th-faq-body">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Tx>
  );
}
