import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Product } from '@/lib/pricing'

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
}

async function getProduct(slug: string, lang: string): Promise<(Product & {
  slug: string; category: string; description_ko: string;
  features: string[]; applications: string[]; specifications: Record<string, string>
}) | null> {
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { slug, lang } = await params
  const product = await getProduct(slug, lang)
  if (!product) return { title: '제품을 찾을 수 없습니다 | KCT' }

  const title = `${product.name_ko} | 한국건설트레이딩 KCT`
  const description = product.description_ko
    ? product.description_ko.slice(0, 160)
    : `${product.name_ko} - 한국건설트레이딩(KCT) 공급. B2B 특가 견적 및 빠른 납품.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://kconstrade.com/${lang}/products/${slug}`,
      siteName: '한국건설트레이딩 (KCT)',
      images: product.image_url ? [{ url: product.image_url }] : [],
    },
    alternates: {
      canonical: `https://kconstrade.com/ko/products/${slug}`,
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

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name_ko,
            description: product.description_ko,
            brand: { '@type': 'Brand', name: product.brand },
            sku: product.sku,
            image: product.image_url ? [`https://kconstrade.com${product.image_url}`] : [],
            offers: {
              '@type': 'Offer',
              seller: { '@type': 'Organization', name: '한국건설트레이딩 (KCT)' },
              availability: 'https://schema.org/InStock',
              priceCurrency: 'KRW',
              url: `https://kconstrade.com/${lang}/products/${slug}`,
            },
          }),
        }}
      />

      {/* Breadcrumb */}
      <nav className="bg-white border-bottom" style={{ marginTop: '72px' }}>
        <div className="container py-3">
          <ol className="breadcrumb mb-0" style={{ fontSize: '0.85rem' }}>
            <li className="breadcrumb-item"><Link href={`/${lang}`} className="text-decoration-none text-body-secondary">홈</Link></li>
            <li className="breadcrumb-item text-body-secondary">제품</li>
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
              <div className="rounded-4 overflow-hidden bg-light d-flex align-items-center justify-content-center" style={{ aspectRatio: '1/1' }}>
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name_ko} className="w-100 h-100 object-fit-cover" />
                ) : (
                  <div className="text-center p-5">
                    <img src="/assets/img/logo/Dow_Chemical_Company_logo.svg" alt="Dow Chemical" style={{ width: '60%', opacity: 0.4 }} />
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
                  <span className="text-body-secondary small">SKU: {product.sku}</span>
                )}
              </div>

              <h1 className="display-5 fw-bold text-dark mb-3">{product.name_ko}</h1>
              {product.name_en && (
                <p className="text-body-secondary mb-4" style={{ fontSize: '0.95rem' }}>{product.name_en}</p>
              )}

              {product.description_ko && (
                <p className="text-dark mb-5" style={{ lineHeight: 1.8, fontSize: '0.975rem' }}>
                  {product.description_ko}
                </p>
              )}

              {/* Key Features preview (first 3) */}
              {features.length > 0 && (
                <div className="mb-5">
                  <h6 className="fw-bold text-dark mb-3">주요 특성</h6>
                  <ul className="list-unstyled mb-0">
                    {features.slice(0, 3).map((f, i) => (
                      <li key={i} className="d-flex align-items-start gap-2 mb-2">
                        <i className="bi bi-check-circle-fill text-primary mt-1 flex-shrink-0" style={{ fontSize: '0.85rem' }}></i>
                        <span className="text-dark" style={{ fontSize: '0.9rem' }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="d-flex flex-wrap gap-3">
                {product.tds_url && (
                  <a href={product.tds_url} target="_blank" rel="noreferrer"
                    className="btn btn-outline-primary rounded-pill px-4 fw-medium">
                    <i className="bi bi-file-earmark-pdf me-2"></i>TDS 다운로드
                  </a>
                )}
                <a href={`/${lang}#b2b-form`}
                  className="btn btn-primary rounded-pill px-4 fw-bold">
                  <i className="bi bi-chat-dots me-2"></i>가격 문의하기
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
                <h2 className="h4 fw-bold text-dark mb-5">제품 특성 및 장점</h2>
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
                <h2 className="h4 fw-bold text-dark mb-5">주요 적용 분야</h2>
                <div className="row g-3">
                  {applications.map((a, i) => (
                    <div key={i} className="col-sm-6 col-lg-4">
                      <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3">
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

      {/* Technical Specifications */}
      {hasSpecs && (
        <section className="py-9 bg-light">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <h2 className="h4 fw-bold text-dark mb-5">기술 사양</h2>
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                  <table className="table table-hover mb-0">
                    <tbody>
                      {Object.entries(specs).map(([key, val], i) => (
                        <tr key={i}>
                          <td className="fw-bold text-dark py-3 px-4 bg-white" style={{ width: '35%', fontSize: '0.9rem' }}>{key}</td>
                          <td className="text-dark py-3 px-4" style={{ fontSize: '0.9rem' }}>{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
              <h2 className="h4 fw-bold text-dark mb-5">기술 자료 다운로드</h2>
              <div className="row g-3">
                {product.tds_url ? (
                  <div className="col-md-6">
                    <a href={product.tds_url} target="_blank" rel="noreferrer"
                      className="d-flex align-items-center gap-3 p-4 border rounded-4 text-decoration-none hover-shadow">
                      <div className="d-flex align-items-center justify-content-center rounded-3 bg-danger"
                        style={{ width: 48, height: 48, flexShrink: 0 }}>
                        <i className="bi bi-file-earmark-pdf-fill text-white fs-5"></i>
                      </div>
                      <div>
                        <div className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>Technical Data Sheet (TDS)</div>
                        <div className="text-body-secondary small">PDF 다운로드</div>
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
                          TDS(기술자료표) 및 SDS(안전자료표)가 필요하신 경우 아래로 문의해 주시면 즉시 제공해 드립니다.
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
                    className="d-flex align-items-center gap-3 p-4 border rounded-4 text-decoration-none hover-shadow">
                    <div className="d-flex align-items-center justify-content-center rounded-3 bg-primary"
                      style={{ width: 48, height: 48, flexShrink: 0 }}>
                      <i className="bi bi-globe text-white fs-5"></i>
                    </div>
                    <div>
                      <div className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>Dow 제품 페이지</div>
                      <div className="text-body-secondary small">dow.com에서 확인하기</div>
                    </div>
                    <i className="bi bi-box-arrow-up-right ms-auto text-body-secondary"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-9 bg-primary text-white">
        <div className="container">
          <div className="row align-items-center justify-content-between g-4">
            <div className="col-lg-7">
              <h2 className="h3 fw-bold mb-2">{product.name_ko} 구매 문의</h2>
              <p className="mb-0 text-white" style={{ opacity: 0.9 }}>
                B2B 특가 단가, 재고 확인, 납기 일정 등 모든 사항을 빠르게 안내해 드립니다.
              </p>
            </div>
            <div className="col-lg-auto">
              <div className="d-flex flex-wrap gap-3">
                <a href="mailto:sales@kconstrade.com"
                  className="btn btn-outline-white rounded-pill px-4">
                  <i className="bi bi-envelope me-2"></i>이메일 문의
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
