import type { CategoryKey } from './products-catalog'

// 용도(역할)별 제품 안내 — 제품 카탈로그의 요약·사양에 근거해 정리 (시방 작성용 아님)
type L = { ko: string; en: string }
export interface Role { role: L; name: L; desc: L; slugs: string[] }
export interface CatIntro { eyebrow: L; lead: L; roles: Role[] }

const r = (role: [string, string], name: [string, string], desc: [string, string], slugs: string[]): Role => ({
  role: { ko: role[0], en: role[1] }, name: { ko: name[0], en: name[1] }, desc: { ko: desc[0], en: desc[1] }, slugs,
})

export const CAT_INTRO: Record<CategoryKey, CatIntro> = {
  building: {
    eyebrow: { ko: '커튼월 · 창호 · 외벽', en: 'Curtain wall · windows · façades' },
    lead: { ko: '건물 외피의 유리·금속·석재 접합부를 접착하고 비와 바람을 막습니다.', en: 'Bonds and weather-seals the glass, metal and stone joints of the building envelope.' },
    roles: [
      r(['구조 글레이징', 'Structural glazing'], ['구조용 실란트', 'Structural sealants'], ['유리를 프레임에 구조적으로 접착합니다. 구조 글레이징 적용은 Dow 기술진의 검토가 필요합니다.', 'Bonds glass to the frame structurally. Structural glazing applications require review by Dow technical staff.'], ['dowsil-795', 'dowsil-995', 'dowsil-121']),
      r(['웨더실링', 'Weatherproofing'], ['내후성 실란트', 'Weatherproofing sealants'], ['커튼월과 외장 조인트에서 비·햇빛·오존을 견디는 1액형 중성 경화 실란트입니다.', 'One-part neutral-cure sealants that withstand rain, sunlight and ozone at curtain wall and façade joints.'], ['dowsil-789', 'dowsil-791', 'dowsil-795']),
      r(['석재 · 금속 패널', 'Stone & metal panels'], ['비오염 중모듈러스', 'Non-staining medium modulus'], ['다공성 석재와 금속 패널 주변의 오염 자국을 줄입니다.', 'Reduces staining around porous stone and metal panels.'], ['dowsil-977', 'dowsil-991']),
      r(['콘크리트 · 조적', 'Concrete & masonry'], ['저모듈러스 실란트', 'Low modulus sealant'], ['움직임이 큰 콘크리트·조적 줄눈을 실링합니다.', 'Seals concrete and masonry joints with larger movement.'], ['dowsil-813c']),
      r(['창호 · 실내', 'Windows & interiors'], ['범용 · 주거용', 'General purpose'], ['창호 페리미터와 익스팬션 조인트, 욕실·주방의 곰팡이 저항 실링에 쓰입니다.', 'For window perimeter and expansion joints and mould-resistant bathroom and kitchen sealing.'], ['dowsil-1001', 'dowsil-double-n', 'dowsil-sanitary']),
    ],
  },
  gmp: {
    eyebrow: { ko: '클린룸 · 식품 · 위생', en: 'Clean rooms · food · hygiene' },
    lead: { ko: '청결이 요구되는 공간에서 곰팡이·세균과 입자 발생을 줄이는 실란트입니다.', en: 'Sealants that limit mould, bacteria and particle generation where cleanliness matters.' },
    roles: [
      r(['위생 실링', 'Hygienic sealing'], ['곰팡이 · 세균 저항', 'Mould & bacteria resistant'], ['식품 접촉이 가능한 FDA 적합 위생 실란트입니다.', 'FDA-compliant hygienic sealant suitable for food-contact areas.'], ['dowsil-786-plus']),
      r(['클린룸', 'Clean rooms'], ['저휘발 실란트', 'Low-volatile sealant'], ['클린룸용 저휘발 1액형 중성 실리콘입니다.', 'Low-volatile one-part neutral-cure silicone for clean rooms.'], ['dowsil-se-5088']),
    ],
  },
  civil: {
    eyebrow: { ko: '도로 · 교량 · 포장', en: 'Roads · bridges · pavement' },
    lead: { ko: '도로와 교량의 신축이음, 콘크리트 포장 줄눈을 실링합니다.', en: 'Seals expansion joints on roads and bridges and concrete pavement joints.' },
    roles: [
      r(['교량 · 고속도로 신축이음', 'Bridge & highway joints'], ['자기수평 실란트', 'Self-leveling sealants'], ['툴링 없이 흘러 평평해지며, 속경화형은 빠른 개방이 필요한 현장에 적합합니다.', 'Self-levels without tooling; the fast-cure grade suits sites that must reopen quickly.'], ['dowsil-902-rcs', 'dowsil-890-sl']),
      r(['콘크리트 포장 조인트', 'Concrete pavement joints'], ['비흐름성 1액형', 'Non-sag one-part'], ['콘크리트 포장 줄눈에 쓰는 비흐름성 1액형입니다.', 'Non-sag one-part sealant for concrete pavement joints.'], ['dowsil-888']),
    ],
  },
  igu: {
    eyebrow: { ko: '복층유리 · 구조 접착', en: 'Insulating glass · structural bonding' },
    lead: { ko: '복층유리 스페이서 주변을 1차·2차로 밀봉하고 유닛을 접착합니다.', en: 'Primary and secondary sealing around the spacer of insulating glass units, and unit bonding.' },
    roles: [
      r(['1차 씰링', 'Primary seal'], ['폴리이소부틸렌 부틸', 'Polyisobutylene butyl'], ['복층유리의 기체·수분 투과를 막는 1차 씰입니다.', 'The primary seal that blocks gas and moisture transmission in IG units.'], ['dowsil-335']),
      r(['2차 씰링', 'Secondary seal'], ['2액형 실란트', 'Two-part sealants'], ['주거용 복층유리부터 구조 지지가 필요한 유닛까지 2차 씰링에 쓰입니다.', 'For secondary sealing from residential IG to units requiring structural support.'], ['dowsil-939', 'dowsil-982']),
      r(['공장 글레이징 · 규격 대응', 'Factory glazing & standards'], ['2액형 구조 실란트', 'Two-part structural sealants'], ['공장 글레이징·커튼월 생산용이며, 유럽(EOTA)·중국 GB 규격에 대응하는 제품도 있습니다.', 'For factory glazing and curtain wall production, including a grade meeting European (EOTA) and Chinese GB standards.'], ['dowsil-983', 'dowsil-993']),
    ],
  },
  special: {
    eyebrow: { ko: '방화 · 내열 · 코팅', en: 'Fire · heat · coatings' },
    lead: { ko: '일반 실란트로 어려운 방화, 고온, 방수, 보수 용도의 특수 제품입니다.', en: 'Specialty products for fire, high temperature, waterproofing and repair work that general sealants cannot handle.' },
    roles: [
      r(['방화', 'Fire protection'], ['내화 실리콘', 'Fire-rated silicone'], ['내외부 선형 조인트와 관통부에 쓰는 내화 실리콘입니다. 기술정보의 내화 매뉴얼도 함께 보세요.', 'Fire-rated silicone for interior and exterior linear joints and penetrations. See also the fire-rated manual in Technical Information.'], ['dowsil-firestop-700']),
      r(['내열', 'Heat resistance'], ['내열 아세톡시', 'High-temperature acetoxy'], ['연속 260°C까지 견디는 내열 실리콘입니다.', 'Heat-resistant silicone for continuous use up to 260°C.'], ['dowsil-rtv-hi-temp']),
      r(['방수 코팅', 'Waterproof coating'], ['수성 실리콘 코팅', 'Water-based silicone coating'], ['외벽 조적·콘크리트에 바르는 수성 실리콘 방수 코팅입니다.', 'Water-based silicone waterproofing coating for exterior masonry and concrete.'], ['dowsil-allguard']),
      r(['보수 · 리모델링', 'Repair & remodeling'], ['프리폼 실', 'Preformed seal'], ['고이동 프리폼 실리콘 실로, 보수와 리모델링에 쓰입니다.', 'High-movement preformed silicone seal for repair and remodeling.'], ['dowsil-123']),
      r(['난간 · 임시 보호', 'Railings & protection'], ['임베딩 · 박리형 코팅', 'Embedding & peelable coating'], ['글라스 난간 U-프로파일 임베딩과 파사드 유리·금속의 임시 보호에 쓰입니다.', 'For glass-railing U-profile embedding and temporary protection of façade glass and metal.'], ['dowsil-375', 'dowsil-650-plus']),
    ],
  },
  primer: {
    eyebrow: { ko: '접착 증진', en: 'Adhesion promotion' },
    lead: { ko: '접착이 어려운 표면에 프라이머를 먼저 바르면 실란트·코팅의 밀착이 좋아집니다.', en: 'Priming difficult surfaces first improves the adhesion of sealants and coatings.' },
    roles: [
      r(['도장 자재 밀착', 'Painted substrates'], ['실란 프라이머', 'Silane primer'], ['PVF2(Kynar)와 폴리에스터 분체도장 표면용 프라이머입니다.', 'Primer for PVF2 (Kynar) and polyester powder-coated surfaces.'], ['dowsil-primer-c']),
      r(['코팅 · 일반 프라이머', 'Coatings & general'], ['접착 증진제', 'Adhesion promoters'], ['ALLGUARD 코팅용 수성 접착 증진제와 1200 OS 프라이머입니다.', 'Water-based promoter for ALLGUARD coatings and the 1200 OS primer.'], ['dowsil-allguard-primer', 'dowsil-1200-os']),
    ],
  },
}
