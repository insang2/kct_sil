import Tx from '@/components/tech/Tx';
import { techCss } from '@/components/tech/TechBlocks';
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Product } from '@/lib/pricing'
import { bySlug, tdsUrl, CATEGORIES, CATALOG } from '@/lib/products-catalog'
import { localizeCatalog, CATEGORY_EN } from '@/lib/products-catalog-en'
import {
  aliasesOf,
  keySpecCard,
  productComparison,
  productDeepGuide,
  productFaq,
  productSeoMeta,
  relatedTech,
  siblingProducts,
} from '@/lib/product-seo'

// ── Fallback product data (used when Supabase unavailable or fields not yet filled) ──
const FALLBACKS: Record<string, Partial<Product> & {
  slug: string; category: string; description_ko: string;
  features: string[]; applications: string[]; specifications: Record<string, string>
}> = {
  'dowsil-790': {
    slug: 'dowsil-790', brand: 'DOWSIL', sku: '790',
    name_ko: 'DOWSIL™ 790 저모듈러스 실란트',
    name_en: 'DOWSIL™ 790 Silicone Weatherproofing Sealant',
    category: '내후성',
    description_ko: 'DOWSIL™ 790은 저모듈러스 특성으로 뛰어난 신장성과 복원력을 제공하는 일액형 실리콘 실란트입니다. 건물 외벽 확장 조인트, 커튼월 연결부, 콘크리트 패널 이음부 등 움직임이 큰 부위에 최적화되어 있으며, UV 및 오존 노출 환경에서도 장기간 성능을 유지합니다.',
    features: ['저모듈러스 · 높은 신장성 (±50% 이상 접합부 이동 대응)', '탁월한 내후성 및 장기 방수 성능', 'UV · 오존 · 극한 온도에 강한 내구성', '유리·알루미늄·콘크리트 등 다양한 소재에 우수한 접착력', '경화 후 무독성, 친환경 소재', '카트리지 및 소시지 형태로 공급'],
    applications: ['건물 외벽 확장 조인트 실링', '커튼월·파사드 연결부 방수 처리', '콘크리트 패널 간 이음 처리', '창호 주변 외부 방수 실링', '외단열 시스템(EIFS) 조인트 처리'],
    specifications: { '제품 유형': '일액형 실리콘 (습기 경화)', '표준 색상': '화이트, 그레이, 블랙, 브론즈', '도포 온도': '5°C ~ 40°C', '사용 온도': '-54°C ~ 180°C', '조인트 폭': '12mm ~ 25mm', '유효기간': '제조일로부터 12개월' },
    image_url: null,
  },
  'dowsil-791': {
    slug: 'dowsil-791', brand: 'DOWSIL', sku: '791',
    name_ko: 'DOWSIL™ 791 커튼월 내후성 실란트',
    name_en: 'DOWSIL™ 791 Silicone Weatherproofing Sealant',
    category: '내후성',
    description_ko: 'DOWSIL™ 791은 커튼월, 파사드 등 고층 건물 외장 시스템에 특화된 프리미엄 내후성 실리콘 실란트입니다. 높은 신장성과 탁월한 UV 저항성을 갖추고 있으며, 유리·알루미늄·콘크리트 등 다양한 건축 소재에 강력한 접착력을 발휘합니다. 카트리지와 소시지(소세지) 형태로 공급되어 대형 현장 시공 효율을 극대화합니다.',
    features: ['커튼월·파사드 시스템 전용 고성능 실란트', '높은 신장성과 압축 복원력 (±25% 이상)', '탁월한 UV 저항성 및 장기 내후성', '유리·알루미늄·콘크리트에 우수한 접착력', '카트리지(300mL) 및 소시지(600mL) 형태 공급', 'Dow 글로벌 품질 기준 충족'],
    applications: ['커튼월·유리 파사드 내후성 실링', '알루미늄 창호 프레임 실링', '고층 건물 외장 패널 조인트', '유리-금속 접합부 방수', '외벽 석재·패널 연결 부위'],
    specifications: { '제품 유형': '일액형 실리콘 (습기 경화)', '표준 색상': '화이트, 그레이, 블랙, 브론즈', '도포 온도': '5°C ~ 40°C', '사용 온도': '-54°C ~ 180°C', '조인트 이동량': '±25%', '유효기간': '제조일로부터 12개월' },
    image_url: '/assets/img/dow/791-cartridge-sausage-800.jpg',
  },
  'dowsil-795': {
    slug: 'dowsil-795', brand: 'DOWSIL', sku: '795',
    name_ko: 'DOWSIL™ 795 다목적 구조용 실란트',
    name_en: 'DOWSIL™ 795 Silicone Building Sealant',
    category: '구조용',
    description_ko: 'DOWSIL™ 795는 구조용과 내후성 성능을 동시에 갖춘 다목적 실리콘 실란트입니다. 단일 제품으로 구조 접합과 내후 실링을 모두 처리할 수 있어 시공 효율이 높습니다. 내후성·내수성·내오존성이 우수하며, 다양한 건축 소재와의 접착성이 탁월합니다.',
    features: ['구조용 + 내후성 복합 성능 (일석이조)', '높은 접착 강도 및 장기 내구성', '내후성·내수성·내오존성 우수', '유리·금속·콘크리트·석재에 접착 가능', '카트리지 및 소시지 형태 공급', '단일 제품으로 공정 단순화'],
    applications: ['구조 글레이징 시스템 실링', '커튼월 구조 접합 보조 실링', '외벽 패널 접합부', '창호 주변 구조 실링', '다목적 외부 조인트 실링'],
    specifications: { '제품 유형': '일액형 실리콘 (습기 경화)', '표준 색상': '화이트, 그레이, 블랙, 브론즈', '도포 온도': '5°C ~ 40°C', '사용 온도': '-54°C ~ 180°C', '조인트 이동량': '±25%', '유효기간': '제조일로부터 12개월' },
    image_url: '/assets/img/dow/795-cartridge-sausage-800.jpg',
  },
  'dowsil-995': {
    slug: 'dowsil-995', brand: 'DOWSIL', sku: '995',
    name_ko: 'DOWSIL™ 995 고장력 구조용 실란트',
    name_en: 'DOWSIL™ 995 Silicone Structural Glazing Sealant',
    category: '구조용',
    description_ko: 'DOWSIL™ 995는 고층 건물 구조 글레이징(SSG) 시스템을 위한 고장력 단성분 실리콘 실란트입니다. 유리, 금속, 세라믹 등 광범위한 기재에 강력한 접착력을 발휘하며, 풍압·지진 하중에 견딜 수 있는 우수한 구조 성능을 갖추고 있습니다. Dow의 검증된 구조용 실란트 중 최고 성능 제품입니다.',
    features: ['구조 글레이징(SSG) 시스템 전용 고성능 실란트', '높은 인장 강도 및 모듈러스 (풍압·지진 하중 대응)', '유리·금속·세라믹 등 광범위한 기재에 탁월한 접착력', '장기 내구성 및 내후성', '단성분 습기 경화 (별도 혼합 불필요)', 'Dow 구조 글레이징 시스템 승인 제품'],
    applications: ['구조 실링 글레이징(SSG) 시스템', '고층 건물 유리 외장 구조 접합', '알루미늄 커튼월 구조 실링', '채광창·유리 지붕 구조 실링', '고강도 외장 조인트 접합'],
    specifications: { '제품 유형': '일액형 구조용 실리콘 (습기 경화)', '표준 색상': '블랙, 그레이', '도포 온도': '5°C ~ 40°C', '사용 온도': '-54°C ~ 180°C', '조인트 이동량': '±12.5%', '유효기간': '제조일로부터 12개월' },
    image_url: '/assets/img/dow/995-cartridge-800.jpg',
  },
  'dowsil-756-sms': {
    slug: 'dowsil-756-sms', brand: 'DOWSIL', sku: '756-SMS',
    name_ko: 'DOWSIL™ 756 SMS 오염방지형 실란트',
    name_en: 'DOWSIL™ 756 SMS Silicone Weatherproofing Sealant',
    category: '특수',
    description_ko: 'DOWSIL™ 756 SMS는 오염방지(Stain-free) 기능을 갖춘 특수 내후성 실리콘 실란트입니다. 석재, 화강암, 대리석 등 다공성 기재의 오염 문제를 해결하기 위해 개발되었으며, 비오염성(Non-staining) 공식으로 실란트 주변 기재의 변색·오염을 방지합니다.',
    features: ['비오염성(Non-staining) 공식 적용', '석재·화강암·대리석 등 다공성 기재에 최적화', '탁월한 내후성 및 UV 저항성', '오염 및 먼지 부착 억제 기능', '다양한 석재 색상에 매칭되는 색상 선택 가능', '장기 미관 유지 및 건물 외관 보호'],
    applications: ['화강암·대리석·석재 패널 조인트 실링', '다공성 기재 건물 외장 실링', '석재 커튼월 연결부 방수', '자연석 외장 건물 조인트 처리', '고급 건물 외장 오염방지 실링'],
    specifications: { '제품 유형': '일액형 비오염성 실리콘 (습기 경화)', '표준 색상': '다양한 석재 매칭 색상', '도포 온도': '5°C ~ 40°C', '사용 온도': '-54°C ~ 180°C', '유효기간': '제조일로부터 12개월' },
    image_url: null,
  },
  'dowsil-732': {
    slug: 'dowsil-732', brand: 'DOWSIL', sku: '732',
    name_ko: 'DOWSIL™ 732 다목적 접착 실란트',
    name_en: 'DOWSIL™ 732 Multi-Purpose Sealant',
    category: '다목적',
    description_ko: 'DOWSIL™ 732는 건설·산업 현장의 다양한 접착 및 실링 용도에 활용 가능한 범용 실리콘 실란트입니다. 우수한 접착력과 유연성을 갖추고 있으며, 간편한 시공성으로 소규모 보수 작업부터 대형 현장까지 폭넓게 적용됩니다.',
    features: ['건설·산업 현장 다목적 접착 및 실링', '다양한 기재(금속, 유리, 플라스틱, 콘크리트)에 접착 가능', '우수한 유연성 및 신장성', '간편한 시공성 및 빠른 표면 경화', '내수성·내후성 양호', '소규모 보수부터 대형 현장까지 적용 가능'],
    applications: ['일반 건설 현장 조인트 실링', '창호 주변 보수 실링', '금속·유리·플라스틱 접합', '전자·기계 장비 실링', '다목적 보수 및 접착 작업'],
    specifications: { '제품 유형': '일액형 실리콘 (습기 경화)', '표준 색상': '화이트, 투명, 블랙', '도포 온도': '5°C ~ 40°C', '사용 온도': '-65°C ~ 200°C', '유효기간': '제조일로부터 12개월' },
    image_url: null,
  },
  'dowsil-977': {
    slug: 'dowsil-977', brand: 'DOWSIL', sku: '977',
    name_ko: 'DOWSIL™ 977 소시지형 내후성 실란트',
    name_en: 'DOWSIL™ 977 Silicone Weatherproofing Sealant (Sausage)',
    category: '내후성',
    description_ko: 'DOWSIL™ 977은 대형 건설 현장의 생산성을 극대화하기 위해 소시지(소세지) 형태로 공급되는 내후성 실리콘 실란트입니다. 카트리지 대비 약 2배의 용량으로 재장전 횟수를 줄여 시공 효율을 높이며, 커튼월·파사드 등 대형 프로젝트에 특히 적합합니다.',
    features: ['소시지(600mL) 대용량 형태로 생산성 극대화', '카트리지 대비 약 2배 용량, 재장전 횟수 절감', '커튼월·파사드 대형 프로젝트에 최적화', '탁월한 내후성 및 UV 저항성', '다양한 건축 소재에 우수한 접착력', '대형 현장 시공 비용 절감 효과'],
    applications: ['대형 커튼월·파사드 내후성 실링', '고층 건물 외장 대량 시공', '알루미늄 창호 대규모 설치', '외벽 패널 조인트 대량 처리', '건설 현장 효율화가 필요한 대형 프로젝트'],
    specifications: { '공급 형태': '소시지(Sausage) 600mL', '표준 색상': '화이트, 그레이, 블랙, 브론즈', '도포 온도': '5°C ~ 40°C', '사용 온도': '-54°C ~ 180°C', '유효기간': '제조일로부터 12개월' },
    image_url: '/assets/img/dow/977-cartridge-sausage-800.jpg',
  },
  'dowsil-991': {
    slug: 'dowsil-991', brand: 'DOWSIL', sku: '991',
    name_ko: 'DOWSIL™ 991 소시지형 구조용 실란트',
    name_en: 'DOWSIL™ 991 Silicone Structural Glazing Sealant (Sausage)',
    category: '구조용',
    description_ko: 'DOWSIL™ 991은 구조 글레이징 시스템을 위한 소시지 형태의 고성능 실리콘 실란트입니다. 대형 건설 현장에서의 구조 접합 시공 효율을 극대화하며, DOWSIL™ 995와 동급의 구조 성능을 소시지 포맷으로 제공합니다.',
    features: ['소시지(600mL) 대용량 형태의 구조용 실란트', '구조 글레이징 시스템 승인 제품', '높은 인장 강도 및 구조 성능', '대형 현장 시공 효율 극대화', '장기 내구성 및 내후성', '재장전 횟수 절감으로 생산성 향상'],
    applications: ['대형 구조 글레이징(SSG) 시스템', '고층 건물 유리 외장 구조 접합 대량 시공', '알루미늄 커튼월 구조 실링 대형 프로젝트', '채광창·유리 지붕 구조 실링', '대규모 건설 현장 효율 시공'],
    specifications: { '공급 형태': '소시지(Sausage) 600mL', '표준 색상': '블랙, 그레이', '도포 온도': '5°C ~ 40°C', '사용 온도': '-54°C ~ 180°C', '유효기간': '제조일로부터 12개월' },
    image_url: '/assets/img/dow/991-sausage-800.jpg',
  },
  'dowsil-983': {
    slug: 'dowsil-983', brand: 'DOWSIL', sku: '983',
    name_ko: 'DOWSIL™ 983 2액형 구조용 실란트',
    name_en: 'DOWSIL™ 983 Two-Part Silicone Structural Glazing Sealant',
    category: '구조용',
    description_ko: 'DOWSIL™ 983은 A/B 2액형 실리콘 구조용 실란트로, 공장 글레이징 라인 등 빠른 경화가 필요한 환경에 최적화되어 있습니다. 1액형 대비 월등히 짧은 경화 시간으로 생산성을 극대화하며, 고강도 구조 접합 성능을 제공합니다. 자동화 도포 장비 및 대용량 사이딩 카트리지와 함께 사용됩니다.',
    features: ['A/B 2액형 시스템 (빠른 경화)', '1액형 대비 현저히 짧은 경화 시간', '공장 자동화 글레이징 라인에 최적화', '높은 인장 강도 및 접착 성능', '유리·알루미늄·금속 등 다양한 기재에 적용 가능', 'Dow 구조 글레이징 시스템 승인 제품'],
    applications: ['공장 자동화 구조 글레이징(SSG) 라인', '커튼월 유닛 공장 제작', '알루미늄 창호 공장 생산', '빠른 경화가 필요한 대형 프로젝트', '자동화 실링 장비 적용 현장'],
    specifications: { '제품 유형': '2액형 실리콘 (A/B 혼합 경화)', '표준 색상': '블랙, 그레이', '혼합 비율': '제조사 지정 비율', '도포 온도': '15°C ~ 35°C', '사용 온도': '-54°C ~ 180°C', '유효기간': '제조일로부터 12개월' },
    image_url: '/assets/img/dow/group-800.jpg',
  },
}

const CATEGORY_COLORS: Record<string, string> = {
  '내후성': 'bg-primary',
  '구조용': 'bg-success',
  '특수': 'bg-warning text-dark',
  '내부': 'bg-info text-dark',
  '다목적': 'bg-secondary',
  '건축 외장': 'bg-primary',
  'GMP·위생': 'bg-info text-dark',
  '토목용': 'bg-dark',
  '복층유리': 'bg-success',
  '특수용': 'bg-warning text-dark',
  '프라이머': 'bg-secondary',
  'Building Envelope': 'bg-primary',
  'GMP / Hygienic': 'bg-info text-dark',
  'Civil Engineering': 'bg-dark',
  'Insulating Glass': 'bg-success',
  'Specialty': 'bg-warning text-dark',
  'Primers': 'bg-secondary',
}

async function getProduct(slug: string, lang: string): Promise<(Product & {
  slug: string; category: string; description_ko: string;
  features: string[]; applications: string[]; specifications: Record<string, string>
}) | null> {
  const c0 = bySlug(slug)
  if (c0) {
    const c = localizeCatalog(c0, lang)
    const cat = CATEGORIES.find((x) => x.key === c.category)!
    return {
      slug: c.slug, brand: 'DOWSIL', sku: c.name.replace('DOWSIL™ ', ''),
      name_ko: c.name, name_en: c.title,
      category: lang === 'en' ? CATEGORY_EN[c.category].label : cat.label,
      description_ko: c.description, features: c.features, applications: c.applications,
      specifications: c.specs, image_url: c.image ?? null, tds_url: tdsUrl(c.slug),
    } as any
  }
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (data) return data as any
  } catch {
    // Supabase unavailable — use fallback
  }
  const fb = FALLBACKS[slug]
  return fb ? (fb as any) : null
}

// 사전 렌더(SSG): 크롤러 요청마다 Worker가 SSR 하지 않도록
export function generateStaticParams() {
  return ['ko','en','ja'].flatMap((lang) => CATALOG.map((p) => p.slug).map((slug) => ({ lang, slug })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { slug, lang } = await params
  const product = await getProduct(slug, lang)
  if (!product) return { title: '제품을 찾을 수 없습니다 | KCT', robots: { index: false, follow: false } }

  const isEn = lang === 'en'
  const isJa = lang === 'ja'

  const productName = (isEn && product.name_en) ? product.name_en : product.name_ko
  const seo = productSeoMeta(slug, lang)
  const title = seo
    ? seo.title
    : `${productName} | KCT`
  const description = seo
    ? seo.description
    : isEn
    ? `${productName} by Dow Chemical. Review typical properties, applications and technical support, and contact Korea Construction Trading (KCT) for B2B quotes.`
    : isJa
    ? `${product.name_ko}はDow(ダウ)建築・構造用シリコーンシーラントです。製品仕様のご確認、B2B卸売・グローバル輸出のお見積りは韓国建設トレーディング(KCT)へ。`
    : `${product.name_ko} 제품 사양과 적용 분야를 확인하세요. 한국건설트레이딩(KCT)에서 Dow 실리콘 실란트 B2B 공급·수출 견적과 기술 자료를 지원합니다.`

  const aliasList = aliasesOf(slug)
  const keywords = [product.name_ko, product.name_en, ...aliasList, 'TDS', 'DOWSIL', isEn ? 'silicone sealant Korea' : '실리콘 실란트', isEn ? 'Korea Construction Trading' : '한국건설트레이딩'].filter(Boolean) as string[]

  const ogImage = product.image_url
    ? `https://kconstrade.com${product.image_url}`
    : 'https://kconstrade.com/assets/img/og-image.png'

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `https://kconstrade.com/${lang === 'ja' ? 'ko' : lang}/products/${slug}`, // ja는 한국어 본문이라 ko로 통합
      languages: {
        'ko': `https://kconstrade.com/ko/products/${slug}`,
        'en': `https://kconstrade.com/en/products/${slug}`,
        'x-default': `https://kconstrade.com/ko/products/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `https://kconstrade.com/${lang}/products/${slug}`,
      siteName: '한국건설트레이딩 (KCT)',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: productName,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  const product = await getProduct(slug, lang)

  if (!product) notFound()

  const features: string[] = Array.isArray(product.features) ? product.features : []
  const applications: string[] = Array.isArray(product.applications) ? product.applications : []
  const specs: Record<string, string> = (product.specifications && typeof product.specifications === 'object' && !Array.isArray(product.specifications))
    ? product.specifications as Record<string, string>
    : {}
  const categoryColor = CATEGORY_COLORS[product.category] ?? 'bg-secondary'
  const hasSpecs = Object.keys(specs).length > 0

  const isEn = lang === 'en'
  const isJa = lang === 'ja'
  const contentLang: 'ko' | 'en' = isEn ? 'en' : 'ko'
  const catalogItem = bySlug(slug)
  const displayName = (isEn && product.name_en) ? product.name_en : product.name_ko
  const docLabel = catalogItem?.docLabel ? (isEn ? 'LEED letter' : catalogItem.docLabel) : 'TDS'

  const keySpecs = keySpecCard(slug, contentLang)
  const deepGuide = productDeepGuide(slug, contentLang)
  const comparison = productComparison(slug, contentLang)
  const siblings = siblingProducts(slug, contentLang)
  const techLinks = lang === 'ja' ? [] : relatedTech(slug, contentLang)
  const faqItems = lang === 'ja' ? [] : productFaq(slug, contentLang)
  const productSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': isEn ? 'Home' : isJa ? 'ホーム' : '홈',
            'item': `https://kconstrade.com/${lang}`,
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': isEn ? 'Products' : isJa ? '製品' : '제품정보',
            'item': `https://kconstrade.com/${lang}/products`,
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': displayName,
            'item': `https://kconstrade.com/${lang}/products/${slug}`,
          },
        ],
      },
      {
        '@type': 'Product',
        name: displayName,
        description: product.description_ko || `${displayName} - Dow architectural silicone sealant`,
        brand: { '@type': 'Brand', name: product.brand },
        sku: product.sku || slug,
        mpn: product.sku || slug,
        image: product.image_url ? [`https://kconstrade.com${product.image_url}`] : ['https://kconstrade.com/assets/img/og-image.png'],
        alternateName: aliasesOf(slug),
        // B2B 견적 제품이라 가격은 표기하지 않는다 (가격 0 표기는 실제 화면과 불일치)
        offers: {
          '@type': 'Offer',
          seller: { '@type': 'Organization', name: '한국건설트레이딩 (KCT)' },
          eligibleCustomerType: 'https://purl.org/goodrelations/v1#Business',
          url: `https://kconstrade.com/${lang}/products/${slug}`,
        },
      },
      ...(faqItems.length ? [{ '@type': 'FAQPage', mainEntity: faqItems.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }] : []),
    ],
  }

  return (
    <Tx>
      <style dangerouslySetInnerHTML={{ __html: techCss }} />
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />

      {/* Breadcrumb */}
      <nav aria-label={isEn ? 'Breadcrumb' : '현재 위치'} className="bg-white border-bottom" style={{ marginTop: '72px' }}>
        <div className="container py-3">
          <ol className="breadcrumb mb-0" style={{ fontSize: '0.85rem' }}>
            <li className="breadcrumb-item"><Link href={`/${lang}`} className="text-decoration-none text-body-secondary">{isEn ? 'Home' : '홈'}</Link></li>
            <li className="breadcrumb-item"><Link href={`/${lang}/products`} className="text-decoration-none text-body-secondary">{isEn ? 'Products' : '제품정보'}</Link></li>
            {catalogItem && (
              <li className="breadcrumb-item"><Link href={`/${lang}/products#cat-${catalogItem.category}`} className="text-decoration-none text-body-secondary">{product.category}</Link></li>
            )}
            <li className="breadcrumb-item active text-dark fw-medium">{product.name_ko}</li>
          </ol>
        </div>
      </nav>

      {/* Hero: Image + Basic Info */}
      <section className="bg-white py-9">
        <div className="container">
          <div className="row g-5 align-items-start">
            {/* Image */}
            <div className="col-lg-5">
              <div className="rounded-4 overflow-hidden d-flex align-items-center justify-content-center" style={{ aspectRatio: '1/1', background: '#fff', border: '1px solid rgba(22,24,28,.14)' }}>
                {product.image_url ? (() => {
                  const DIMS: Record<string, readonly [number, number]> = {
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
                  }
                  const [w, h] = DIMS[product.image_url] ?? [800, 800]
                  return (
                    <img
                      src={product.image_url}
                      alt={displayName}
                      width={w}
                      height={h}
                      decoding="async"
                      fetchPriority="high"
                      className="w-100 h-100"
                      style={{ objectFit: 'contain', padding: 16, mixBlendMode: 'multiply', borderRadius: 28 }}
                    />
                  )
                })() : (
                  <div className="text-center p-5">
                    <img
                      src="/assets/img/logo/Dow_Chemical_Company_logo.svg"
                      alt={`${displayName} — Dow Chemical`}
                      width={598}
                      height={210}
                      decoding="async"
                      style={{ width: '60%', height: 'auto', opacity: 0.4 }}
                    />
                    <p className="text-body-secondary small mt-3 mb-0">{product.brand} {product.sku}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="col-lg-7">
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="badge bg-light text-dark border fw-normal" style={{ fontSize: '0.8rem' }}>{product.brand}</span>
                {product.category && (
                  <span className={`badge rounded-pill ${categoryColor}`} style={{ fontSize: '0.8rem' }}>{product.category}</span>
                )}
                {product.sku && (
                  <span className="small" style={{ color: '#555370' }}>SKU: {product.sku}</span>
                )}
              </div>

              <h1 className="display-5 fw-bold text-dark mb-2">{product.name_ko}</h1>
              {product.name_en && (
                <p className="text-body-secondary mb-3" style={{ fontSize: '0.95rem' }}>{product.name_en}</p>
              )}

              {product.description_ko && (
                <p className="text-dark mb-4" style={{ lineHeight: 1.8, fontSize: '0.975rem' }}>
                  {product.description_ko}
                </p>
              )}

              {/* 상단 핵심 사양 요약 카드 (카탈로그 실측 필드만 표시, 미기재 시 '문의') */}
              {keySpecs.length > 0 && (
                <div className="mb-4 p-3 p-md-4 rounded-4" style={{ background: '#fff', border: '1px solid rgba(22,24,28,.14)' }}>
                  <div className="d-flex justify-content-between align-items-baseline mb-3">
                    <h2 className="h6 fw-bold text-dark mb-0">{isEn ? 'Key Specifications (TDS Summary)' : '핵심 사양 요약 (TDS 기준)'}</h2>
                    <span className="small text-body-secondary">{isEn ? 'Typical values' : '대표 특성 · 미기재 시 문의'}</span>
                  </div>
                  <dl className="row g-3 mb-0">
                    {keySpecs.map((item) => (
                      <div key={item.label} className="col-sm-6">
                        <dt className="small text-body-secondary fw-semibold mb-1">{item.label}</dt>
                        <dd
                          className="mb-0"
                          style={{
                            fontSize: '0.9rem',
                            lineHeight: 1.5,
                            color: item.missing ? '#5d646b' : '#16181C',
                            fontWeight: item.missing ? 400 : 600,
                          }}
                        >
                          {item.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* Action Buttons */}
              <div className="d-flex flex-wrap gap-3">
                {product.tds_url && (
                  <a href={product.tds_url} target="_blank" rel="noreferrer" download
                    className="btn btn-outline-primary rounded-pill px-4 fw-medium">
                    <i className="bi bi-file-earmark-pdf me-2"></i>{isEn ? `Download ${docLabel}` : `${docLabel} 다운로드`}
                  </a>
                )}
                <a href={`/${lang}#b2b-form`}
                  className="btn btn-primary rounded-pill px-4 fw-bold">
                  <i className="bi bi-chat-dots me-2"></i>{isEn ? 'Request a Quote' : '견적·기술 문의'}
                </a>
                <a href="https://wa.me/821089390284" target="_blank" rel="noreferrer"
                  className="btn btn-outline-success rounded-pill px-4">
                  <i className="bi bi-whatsapp me-2"></i>WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Features */}
      {features.length > 0 && (
        <section className="py-9 bg-light">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <h2 className="h4 fw-bold text-dark mb-5">{isEn ? 'Features & Benefits' : '제품 특성 및 장점'}</h2>
                <div className="row g-3">
                  {features.map((f, i) => (
                    <div key={i} className="col-md-6">
                      <div className="d-flex align-items-start gap-3 p-4 bg-white rounded-4 shadow-sm h-100">
                        <div className="d-flex align-items-center justify-content-center rounded-circle bg-primary flex-shrink-0"
                          style={{ width: 36, height: 36 }}>
                          <i className="bi bi-check-lg text-white" style={{ fontSize: '0.9rem' }}></i>
                        </div>
                        <p className="mb-0 text-dark" style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>{f}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Applications */}
      {applications.length > 0 && (
        <section className="py-9 bg-white">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <h2 className="h4 fw-bold text-dark mb-5">{isEn ? 'Applications' : '주요 적용 분야'}</h2>
                <div className="row g-3">
                  {applications.map((a, i) => (
                    <div key={i} className="col-sm-6 col-lg-4">
                      <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 h-100">
                        <i className="bi bi-building-check text-primary flex-shrink-0 fs-5"></i>
                        <span className="text-dark" style={{ fontSize: '0.9rem' }}>{a}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Product-specific Deep Selection & Handling Guide */}
      {deepGuide && (
        <section className="py-9 bg-light" aria-labelledby="product-guide">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <h2 id="product-guide" className="h4 fw-bold text-dark mb-2">{deepGuide.heading}</h2>
                <p className="text-body-secondary mb-4" style={{ fontSize: '0.95rem', lineHeight: 1.75 }}>{deepGuide.intro}</p>
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="p-4 bg-white rounded-4 border h-100">
                      <h3 className="h6 fw-bold text-dark mb-3">{deepGuide.selectionTitle}</h3>
                      <ul className="mb-0 ps-3" style={{ fontSize: '0.92rem', lineHeight: 1.75 }}>
                        {deepGuide.selectionPoints.map((pt, i) => (
                          <li key={i} className="mb-2 text-dark">{pt}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-4 bg-white rounded-4 border h-100">
                      <h3 className="h6 fw-bold text-dark mb-3">{deepGuide.handlingTitle}</h3>
                      <ul className="mb-0 ps-3" style={{ fontSize: '0.92rem', lineHeight: 1.75 }}>
                        {deepGuide.handlingPoints.map((pt, i) => (
                          <li key={i} className="mb-2 text-dark">{pt}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                {deepGuide.companionSlugs && deepGuide.companionSlugs.length > 0 && (
                  <div className="mt-4 p-4 bg-white rounded-4 border">
                    <div className="fw-bold text-dark mb-2" style={{ fontSize: '0.9rem' }}>
                      {isEn ? 'Related system products & alternatives' : '함께 검토하는 프라이머 · 대안 제품'}
                    </div>
                    <div className="row g-3">
                      {deepGuide.companionSlugs.map((cp) => {
                        const target = bySlug(cp.slug)
                        if (!target) return null
                        return (
                          <div key={cp.slug} className="col-md-6">
                            <Link href={`/${lang}/products/${cp.slug}`} className="d-block p-3 rounded-3 border text-decoration-none h-100">
                              <span className="fw-bold d-block" style={{ color: '#1558D6', fontSize: '0.92rem' }}>{target.name} →</span>
                              <span className="small text-body-secondary">{cp.note}</span>
                            </Link>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Similar Model Mini Comparison */}
      {comparison && comparison.rows.length > 0 && (
        <section className="py-9 bg-white" aria-labelledby="mini-comparison">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <h2 id="mini-comparison" className="h4 fw-bold text-dark mb-2">{comparison.title}</h2>
                <p className="text-body-secondary mb-4" style={{ fontSize: '0.93rem' }}>{comparison.subtitle}</p>
                <div className="tech-table-wrap" tabIndex={0} role="region" aria-label={isEn ? 'Model comparison table (scrollable)' : '유사 모델 비교표 (가로 스크롤 가능)'}>
                  <table className="table table-sm tech-table mb-0">
                    <caption className="visually-hidden">{comparison.title}</caption>
                    <thead>
                      <tr>
                        <th scope="col">{isEn ? 'Property (TDS)' : '항목 (TDS)'}</th>
                        {comparison.columns.map((col) => (
                          <th key={col.slug} scope="col">
                            {col.isCurrent ? (
                              <span>{col.name}</span>
                            ) : (
                              <Link href={`/${lang}/products/${col.slug}`} style={{ color: '#fff', textDecoration: 'underline' }}>
                                {col.name}
                              </Link>
                            )}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {comparison.rows.map((row) => (
                        <tr key={row.label}>
                          <td className="fw-semibold">{row.label}</td>
                          {row.values.map((v, idx) => (
                            <td key={idx}>{v}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="small text-body-secondary mt-2 mb-0">
                  {isEn
                    ? 'Source: KCT catalog summary of each product’s Dow TDS (test conditions may differ by product; values are typical, not specifications). "Inquire" = not stated in summarized catalog.'
                    : '출처: 각 제품 Dow TDS를 요약한 KCT 카탈로그 데이터(제품별 시험 조건이 다를 수 있으며 대표 특성이지 시방 값이 아님). 「문의」는 요약 카탈로그 미기재 항목입니다.'}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Technical Specifications */}
      {hasSpecs && (
        <section className="py-9 bg-light">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <h2 className="h4 fw-bold text-dark mb-5">{isEn ? 'Technical Specifications' : '기술 사양'}</h2>
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                  <table className="table mb-0" style={{ ["--bs-table-bg" as string]: "#fff", ["--bs-table-color" as string]: "#16142F" }}>
                    <tbody>
                      {Object.entries(specs).map(([key, val], i) => (
                        <tr key={i}>
                          <td className="fw-bold py-3 px-4" style={{ width: '35%', fontSize: '0.9rem', background: '#f8f9fa', color: '#16142F' }}>{key}</td>
                          <td className="py-3 px-4" style={{ fontSize: '0.9rem', background: '#fff', color: '#16142F' }}>{val}</td>
                        </tr>
                      ))}
                      <tr>
                        <td className="fw-bold py-3 px-4" style={{ width: '35%', fontSize: '0.9rem', background: '#f8f9fa', color: '#16142F' }}>
                          {isEn ? 'Also known as' : '다른 이름 · 검색 표기'}
                        </td>
                        <td className="py-3 px-4" style={{ fontSize: '0.9rem', background: '#fff', color: '#555370' }}>
                          {(isEn ? aliasesOf(slug).filter((a) => !/[가-힣]/.test(a)) : aliasesOf(slug)).join(' · ')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="small text-body-secondary mt-3 mb-0" style={{ lineHeight: 1.7 }}>
                  {isEn
                    ? 'Source: Dow Technical Data Sheet (TDS). All values are typical properties and not intended for preparing specifications. Korea Construction Trading (KCT) supports latest TDS/SDS confirmation and product selection.'
                    : '출처: Dow 기술 데이터시트(TDS) 요약. 표기된 수치는 대표 특성이며 시방서 작성용 규격값이 아닙니다. 한국건설트레이딩(KCT)이 최신 TDS·SDS 확인과 제품 선정 기술 지원을 도와드립니다.'}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Downloads */}
      <section className="py-9 bg-white">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h2 className="h4 fw-bold text-dark mb-5">{isEn ? 'Technical Documents' : '기술 자료 다운로드'}</h2>
              <div className="row g-3">
                {product.tds_url ? (
                  <div className="col-md-6">
                    <a href={product.tds_url} target="_blank" rel="noreferrer" download
                      className="d-flex align-items-center gap-3 p-4 border rounded-4 text-decoration-none hover-shadow h-100">
                      <div className="d-flex align-items-center justify-content-center rounded-3 bg-danger"
                        style={{ width: 48, height: 48, flexShrink: 0 }}>
                        <i className="bi bi-file-earmark-pdf-fill text-white fs-5"></i>
                      </div>
                      <div>
                        <div className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>
                          {catalogItem?.docLabel ? (isEn ? 'LEED / VOC Letter' : catalogItem.docLabel) : 'Technical Data Sheet (TDS)'}
                        </div>
                        <div className="small" style={{ color: '#555370' }}>{isEn ? 'PDF download' : 'PDF 다운로드'}</div>
                      </div>
                      <i className="bi bi-download ms-auto text-body-secondary"></i>
                    </a>
                  </div>
                ) : (
                  <div className="col-12">
                    <div className="d-flex align-items-center gap-3 p-4 bg-light rounded-4">
                      <i className="bi bi-info-circle text-primary fs-5 flex-shrink-0"></i>
                      <div>
                        <p className="mb-1 text-dark" style={{ fontSize: '0.9rem' }}>
                          {isEn ? 'Contact us for the TDS (technical data sheet) or SDS (safety data sheet) and we will send it right away.' : 'TDS(기술자료표) 및 SDS(안전자료표)가 필요하신 경우 아래로 문의해 주시면 즉시 제공해 드립니다.'}
                        </p>
                        <a href="mailto:sales@kconstrade.com" className="text-primary text-decoration-none small fw-medium">
                          sales@kconstrade.com
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Dow official page link */}
                <div className="col-md-6">
                  <a href={`https://www.dow.com/ko-kr/search.html#first=10&q=${encodeURIComponent((product.sku ?? ''))}&t=Products&sort=relevancy`}
                    target="_blank" rel="noreferrer"
                    className="d-flex align-items-center gap-3 p-4 border rounded-4 text-decoration-none hover-shadow h-100">
                    <div className="d-flex align-items-center justify-content-center rounded-3 bg-primary"
                      style={{ width: 48, height: 48, flexShrink: 0 }}>
                      <i className="bi bi-globe text-white fs-5"></i>
                    </div>
                    <div>
                      <div className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>{isEn ? 'Dow Product Page' : 'Dow 제품 페이지'}</div>
                      <div className="small" style={{ color: '#555370' }}>{isEn ? 'View on dow.com' : 'dow.com에서 확인하기'}</div>
                    </div>
                    <i className="bi bi-box-arrow-up-right ms-auto text-body-secondary"></i>
                  </a>
                </div>

                {/* All 30 TDS Download Center */}
                <div className="col-md-6">
                  <Link href={`/${lang}/tds`}
                    className="d-flex align-items-center gap-3 p-4 border rounded-4 text-decoration-none hover-shadow h-100">
                    <div className="d-flex align-items-center justify-content-center rounded-3 bg-dark"
                      style={{ width: 48, height: 48, flexShrink: 0 }}>
                      <i className="bi bi-collection text-white fs-5"></i>
                    </div>
                    <div>
                      <div className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>{isEn ? 'All 30 TDS Center' : '전 제품 30종 TDS 센터'}</div>
                      <div className="small" style={{ color: '#555370' }}>{isEn ? 'Browse all DOWSIL™ TDS PDFs' : '전 제품 TDS 한곳에서 받기'}</div>
                    </div>
                    <i className="bi bi-arrow-right ms-auto text-body-secondary"></i>
                  </Link>
                </div>

                {/* Colors & Packaging Guide */}
                <div className="col-md-6">
                  <Link href={`/${lang}/technical/selection/color-and-packaging-guide`}
                    className="d-flex align-items-center gap-3 p-4 border rounded-4 text-decoration-none hover-shadow h-100">
                    <div className="d-flex align-items-center justify-content-center rounded-3 bg-secondary"
                      style={{ width: 48, height: 48, flexShrink: 0 }}>
                      <i className="bi bi-table text-white fs-5"></i>
                    </div>
                    <div>
                      <div className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>{isEn ? 'Colors & Packaging Table' : '색상·포장·유효기간 표'}</div>
                      <div className="small" style={{ color: '#555370' }}>{isEn ? 'Compare all 30 products' : '30종 카탈로그 정리표 보기'}</div>
                    </div>
                    <i className="bi bi-arrow-right ms-auto text-body-secondary"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sibling / Alternative Products */}
      {siblings.length > 0 && (
        <section className="py-9 bg-light" aria-labelledby="sibling-products">
          <div className="container" style={{ maxWidth: 1080 }}>
            <div className="d-flex flex-wrap justify-content-between align-items-baseline gap-2 mb-4">
              <h2 id="sibling-products" className="h4 fw-bold mb-0">{isEn ? 'Similar & alternative DOWSIL™ products' : '형제 · 대체 제품 비교'}</h2>
              <Link href={`/${lang}/products`} className="small fw-semibold text-decoration-none" style={{ color: '#1558D6' }}>
                {isEn ? 'View all 30 products →' : '전 제품 30종 보기 →'}
              </Link>
            </div>
            <div className="row g-3">
              {siblings.map((s) => (
                <div key={s.slug} className="col-sm-6 col-lg-3">
                  <Link href={`/${lang}/products/${s.slug}`} className="d-flex flex-column p-3 p-md-4 border rounded-4 text-decoration-none h-100 bg-white">
                    <span className="small fw-semibold mb-1" style={{ color: '#5b49e6', fontSize: '0.78rem' }}>{s.categoryLabel}</span>
                    <span className="fw-bold text-dark mb-1" style={{ fontSize: '1rem' }}>{s.name}</span>
                    <span className="small text-body-secondary mb-2" style={{ lineHeight: 1.55 }}>{s.relation}</span>
                    <span className="mt-auto fw-semibold" style={{ color: '#1558D6', fontSize: '0.84rem' }}>{isEn ? 'View specs →' : '사양 보기 →'}</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Technical Information */}
      {techLinks.length > 0 && (
        <section className="py-9 bg-white" aria-labelledby="related-tech">
          <div className="container" style={{ maxWidth: 1080 }}>
            <h2 id="related-tech" className="h4 fw-bold mb-4">{isEn ? 'Related technical information' : '관련 기술자료'}</h2>
            <div className="row g-3">
              {techLinks.map((r) => (
                <div key={r.path} className="col-md-4">
                  <Link href={`/${lang}/${r.path}`} className="d-block p-3 border rounded-4 text-decoration-none h-100 bg-white">
                    <span className="d-block fw-bold" style={{ color: '#16142F', lineHeight: 1.45 }}>{r.title}</span>
                    <span style={{ color: '#1558D6', fontSize: '.85rem', fontWeight: 600 }}>{isEn ? 'Read →' : '자세히 보기 →'}</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {faqItems.length > 0 && (
        <section className="py-9 bg-light" aria-labelledby="product-faq">
          <div className="container" style={{ maxWidth: 860 }}>
            <h2 id="product-faq" className="h4 fw-bold mb-3">{isEn ? 'Frequently asked questions' : '자주 묻는 질문'}</h2>
            {faqItems.map((f, i) => (
              <details key={i} className="tx-faq" open={i === 0}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <section className="py-9 bg-primary text-white">
        <div className="container">
          <div className="row align-items-center justify-content-between g-4">
            <div className="col-lg-7">
              <h2 className="h3 fw-bold mb-2">{isEn ? `Inquire about ${product.name_ko}` : `${product.name_ko} 구매 · 기술 지원 문의`}</h2>
              <p className="mb-0 text-white" style={{ opacity: 0.9 }}>
                {isEn
                  ? 'Korea Construction Trading (KCT) supports B2B supply, export quotations, latest TDS/SDS documents and product selection.'
                  : '한국건설트레이딩(KCT)이 B2B 공급·수출 견적, 재고·포장 확인, 최신 TDS·SDS 제공 및 제품 선정 기술 지원을 빠르게 안내합니다.'}
              </p>
            </div>
            <div className="col-lg-auto">
              <div className="d-flex flex-wrap gap-3">
                <a href="mailto:sales@kconstrade.com"
                  className="btn btn-outline-white rounded-pill px-4">
                  <i className="bi bi-envelope me-2"></i>{isEn ? 'Email Us' : '이메일 문의'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Tx>
  )
}
