// DOWSIL 제품 카탈로그 — 각 제품의 TDS(PDF)는 /public/tds/{slug}.pdf
// 내용은 Dow TDS 원문에서 요약한 것이며 시방 작성용이 아닙니다 (TDS 원문 참조).

export type CategoryKey = 'building' | 'gmp' | 'civil' | 'igu' | 'special' | 'primer'

export const CATEGORIES: { key: CategoryKey; label: string; desc: string }[] = [
  { key: 'building', label: '건축 외장', desc: '커튼월·구조 글레이징·내후성·창호 주변 실링' },
  { key: 'gmp', label: 'GMP·위생', desc: '클린룸·항균/방곰팡이 위생 실란트' },
  { key: 'civil', label: '토목용', desc: '도로·교량·콘크리트 포장 신축이음' },
  { key: 'igu', label: '복층유리', desc: '복층유리 1차·2차 실링, 구조용 접착' },
  { key: 'special', label: '특수용', desc: '내열·방화·코팅·프리폼·글라스 임베딩' },
  { key: 'primer', label: '프라이머', desc: '접착 증진용 프라이머' },
]

export interface CatalogProduct {
  slug: string
  name: string // 예: "DOWSIL™ 791"
  category: CategoryKey
  title: string // 제품 정식명
  summary: string // 한 줄 용도
  description: string
  features: string[]
  applications: string[]
  specs: Record<string, string>
  image?: string
  docLabel?: string // TDS 대신 다른 문서일 때
}

const img = (f: string) => `/assets/img/dow/${f}`

export const CATALOG: CatalogProduct[] = [
  // ───────── 1. 건축 외장 ─────────
  {
    slug: 'dowsil-789', name: 'DOWSIL™ 789', category: 'building',
    title: 'DOWSIL™ 789 Silicone Weatherproofing Sealant',
    summary: '프라이머 없이 접착되는 1액형 중성 내후성 실란트',
    description: 'DOWSIL™ 789는 1액형 중성 경화형 건축용 내후성 실란트입니다. 작업성이 좋고 공기 중 수분과 반응해 내구성 있는 실리콘 고무로 경화되며, 코팅 알루미늄을 포함한 대부분의 건축 자재에 프라이머 없이 접착되도록 설계되었습니다. 일반 글레이징 및 비구조용 글레이징 내후 실링에 공장·현장 모두 적용할 수 있습니다.',
    features: ['중성 경화 — 아노다이징·코팅 알루미늄을 부식시키지 않음', '대부분의 자재에 프라이머 없이 우수한 접착', '햇빛·비·눈·오존·극한 온도에 강한 내후성', '움직임 허용치 ±50%', '-50°C ~ +150°C 범위에서 탄성 유지'],
    applications: ['일반 글레이징 / 비구조용 글레이징 내후 실링', '유리·반사유리·세라믹·알루미늄·철판 접합부 실링', '공장 및 현장 시공'],
    specs: { '제품 유형': '1액형 중성 경화 실리콘', '색상': 'Black, Gray, Bronze, Limestone, Precast White, White (특수 색상 가능)', '표면경화시간': '80분 미만 (25°C, 50% RH)', '완전경화시간': '7–14일', '가사시간': '15–30분', '경도 (Shore A)': '28', '최대 인장강도': '16 kg/cm²', '최대 신율': '700%', '움직임 허용치': '±50%', '적용 규격': 'KS F 4910-2000 F25LM' },
    image: img('789-cartridge-sausage-800.jpg'),
  },
  {
    slug: 'dowsil-791', name: 'DOWSIL™ 791', category: 'building',
    title: 'DOWSIL™ 791 Silicone Weatherproofing Sealant',
    summary: '커튼월·건물 외장 웨더실링용 1액형 중성 실란트',
    description: 'DOWSIL™ 791은 일반 글레이징, 커튼월 외장, 건물 외장 웨더실링용으로 설계된 고성능 1액형 중성 경화 실리콘 실란트입니다. 비흐름성으로 압출성이 우수하며, 코팅 유리·갈바나이즈 스틸·석재 등 다공성/비다공성 자재에 두루 적합합니다.',
    features: ['익스팬션·연결·페리미터 등 움직임 조인트에 적합', '중성 경화 — 코팅 유리, 갈바나이즈 스틸, 석재류에 적합', '움직임 허용치 ±50%', '햇빛·비·눈·오존에 영향을 받지 않는 내후성', '다양한 건축 자재에 우수한 접착, 사용 간편'],
    applications: ['커튼월 외장 웨더실링', '일반 글레이징', '건물 외장 조인트 실링'],
    specs: { '제품 유형': '1액형 중성 경화 실리콘', '표면경화시간': '45분 (25°C, 50% RH)', '완전경화시간': '7–14일', '가사시간': '20분', '비중': '1.51', 'VOC 함량': '45 g/L', '적용 온도': '4–40°C', '경도 (Shore A)': '25–30', '최대 인장강도': '0.83 MPa', '최대 신율': '430%', '움직임 허용치': '±50%', '적용 규격': 'ASTM C920 Type S Grade NS Class 50 · ISO 11600 F&G-25LM · KS F4910 F-25LM · EN 15651-1/2' },
    image: img('791-cartridge-sausage-800.jpg'),
  },
  {
    slug: 'dowsil-795', name: 'DOWSIL™ 795', category: 'building',
    title: 'DOWSIL™ 795 Structural Glazing Sealant',
    summary: '구조용 + ±50% 내후성 겸용 1액형 중성 실란트',
    description: 'DOWSIL™ 795는 공장 및 현장 커튼월 글레이징에 적합한 1액형 중성 경화 실란트입니다. ASTM C1184 구조용 글레이징 실란트 규격을 만족하며, ±50% 움직임 허용치로 내후성 실란트로도 사용할 수 있습니다.',
    features: ['ASTM C1184 구조용 글레이징 실란트 규격 만족', 'ASTM C719 Class 50 (±50%) — 내후성 실란트로도 사용', '유리·아노다이즈 알루미늄·코팅 알루미늄에 우수한 접착', '중성 경화 — 자재 부식 없음', '내열·내습·내자외선 등 우수한 내후성'],
    applications: ['공장/현장 커튼월 구조 글레이징', '내후성 웨더실링', '유리·알루미늄 접합'],
    specs: { '제품 유형': '1액형 중성 경화 실리콘', '표면경화시간': '1.5시간 이내 (25°C, 50% RH)', '완전경화시간': '7–14일', '비중': '1.44', 'VOC': '32 g/L', '경도 (Shore A)': '35', '최대 인장강도': '2.3 MPa (7일)', '최대 신율': '670% (7일)', '접착 강도': '8.5 kg/cm', '움직임 허용치': '±50%' },
    image: img('795-cartridge-sausage-800.jpg'),
  },
  {
    slug: 'dowsil-995', name: 'DOWSIL™ 995', category: 'building',
    title: 'DOWSIL™ 995 Silicone Structural Sealant',
    summary: '고강도 스트럭추럴 글레이징용 1액형 중성 실란트',
    description: 'DOWSIL™ 995는 저장 안정성이 좋은 1액형 중성 경화 스트럭추럴 글레이징 실란트로, 유리·금속 등의 공장 또는 현장 구조 글레이징에 사용됩니다. 유리·반사유리·아노다이징 알루미늄·화강석·불소수지 도장 자재 등에 프라이머 없이 우수한 접착을 보이며 경화 후 고모듈러스 탄성체를 형성합니다. 구조용 사용 전 Dow의 사전 시험과 도면 검토가 필요합니다.',
    features: ['대부분의 건축 자재에 프라이머 없이 우수한 접착', '유효기간 18개월 (32°C 이하 보관)', '경화 후 고모듈러스 탄성체', '장기 UV 촉진 내후성 시험(QUV 4,500시간) 후에도 물성 유지'],
    applications: ['공장/현장 스트럭추럴 글레이징', '유리·금속 구조 접합'],
    specs: { '제품 유형': '1액형 중성 구조용 실리콘', '색상': 'Black', '표면경화시간': '1.5시간 (25°C, 50% RH)', '완전경화시간': '7–14일', '완전 접착시간': '14–21일', '가사시간': '10–20분', '경도 (Shore A)': '40', '최대 인장강도': '23 kg/cm²', '최대 신율': '525%', '인열강도 (Die B)': '8.8 kg/cm', '박리 강도': '7.2 kg/cm', '규격': 'KS F 4910' },
    image: img('995-cartridge-800.jpg'),
  },
  {
    slug: 'dowsil-121', name: 'DOWSIL™ 121', category: 'building',
    title: 'DOWSIL™ 121 Structural Glazing Sealant',
    summary: '빠른 경화의 2액형 중성 구조/웨더실 실란트',
    description: 'DOWSIL™ 121은 구조 및 웨더실 용도로 사용하는 속경화 2액형 중성 RTV 실리콘 실란트입니다. 24–48시간 내 접착 및 구조 강도가 발현되어 보수·재글레이징 등 빠른 경화가 필요한 현장에 적합합니다. 모든 구조 글레이징 적용은 Dow 기술진의 검토가 필요합니다.',
    features: ['구조 및 웨더실 용도 승인', '무취·비부식성 경화', '-50°C ~ 150°C의 넓은 온도 범위 안정성', '알로다인/아노다이징 알루미늄에 프라이머 없이 접착', '기존 DOWSIL 구조용 실란트에 접착 — 재글레이징 가능', 'ASTM C719 Class 25 / ASTM C1184 만족'],
    applications: ['구조 글레이징 유리 및 기타 기재의 보수·교체', '스토어프론트 등 현장 구조 글레이징', '패널 보강재(스티프너) 부착', '2액 펌프 사용이 어려운 공장 내 구조 글레이징'],
    specs: { '제품 유형': '2액형 중성 RTV 실리콘', '혼합 비율': '1:1 (부피)', '색상': 'Base 흑색/진회색, Catalyst 백색', '가사시간': '15–45분', 'Unit handling time': '최소 24시간', 'VOC (혼합)': '25 g/L 미만', '경도 (Shore A)': '30 (1일) / 30–40 (7일)', '유효기간': '제조일로부터 12개월' },
  },
  {
    slug: 'dowsil-977', name: 'DOWSIL™ 977', category: 'building',
    title: 'DOWSIL™ 977 Silicone High Performance Sealant',
    summary: '다공성 석재·금속 패널용 오염 저감 중모듈러스 실란트',
    description: 'DOWSIL™ 977은 화강석 등 다공성 석재의 오염(유체 이행)과 금속 패널의 흘러내림을 줄이도록 설계된 중모듈러스 1액형 실리콘 실란트입니다. 신축 및 보수 공사 모두에 사용할 수 있으며, -25~50°C 전 온도 시공이 가능합니다.',
    features: ['다공성 기재로의 유체 이행 및 금속 패널 흘러내림 감소', '-25~50°C 전 온도 시공 (건조·무서리 표면)', '중모듈러스 · 움직임 허용치 ±50%', '10년 Weatherseal 및 Non-Staining 보증 가능', '1액형, 사용 간편'],
    applications: ['화강석 등 다공성 석재 패널 조인트', '금속 패널·유리 조인트 웨더실링', '신축 및 보수 공사'],
    specs: { '제품 유형': '1액형 중성 실리콘', '색상': 'Grey, Bronze, Black, Limestone, White, Charcoal 및 맞춤 색상', '표면경화시간': '20분', '완전경화시간': '7–14일 (25°C, 50% RH)', '경도': '19', '최대 인장강도': '1.3 MPa (7일)', '최대 신율': '800% (7일)', '움직임 허용치': '±50%', 'VOC': '85 g/L 미만', '적용 규격': 'ASTM C920 Type S Grade NS Class 50 · KS F 4910 25LM', '석재 오염': 'None (ASTM C1248)' },
    image: img('977-cartridge-sausage-800.jpg'),
  },
  {
    slug: 'dowsil-991', name: 'DOWSIL™ 991', category: 'building',
    title: 'DOWSIL™ 991 Silicone High Performance Sealant',
    summary: '천연석·유리·금속 패널용 비오염 중모듈러스 실란트',
    description: 'DOWSIL™ 991은 미관이 중요한 천연석·유리·금속 패널의 웨더프루핑을 위해 설계된 1액형 중모듈러스 탄성 실란트입니다. 다공성 기재의 오염을 방지하고 유리·금속 패널의 줄무늬 흘러내림을 줄여 건물 외관 성능을 높입니다.',
    features: ['천연석 비오염, 금속·유리 패널 흘러내림 저감', '중모듈러스·고움직임 — ±50% 허용', '천연석·유리·금속·세라믹 타일·불소수지 도장·아노다이징 알루미늄에 프라이머 없이 접착', '우수한 UV·내후성, 양호한 작업시간', '10년 Weatherseal/Non-Staining 보증 가능'],
    applications: ['천연석 파사드 조인트', '유리·금속 패널 웨더실링', '신축 및 보수 공사'],
    specs: { '제품 유형': '1액형 중성 실리콘', '색상': 'Black, Gray, Bronze, White, Limestone, Charcoal, Dark Gray, Sandstone, Pink (9색)', '표면경화시간': '30분', '완전경화시간': '7–14일', '경도 (Shore A)': '24', '최대 인장강도': '0.7 MPa (21일)', '최대 신율': '400% (21일)', '움직임 허용치': '±50%', 'VOC': '85 g/L 미만', '석재 오염': 'None (ASTM C1248)', '권장 조인트 깊이': '6–12mm (폭:깊이 ≈ 2:1)' },
    image: img('991-sausage-800.jpg'),
  },
  {
    slug: 'dowsil-813c', name: 'DOWSIL™ 813C', category: 'building',
    title: 'DOWSIL™ 813C Construction and Concrete Silicone Sealant',
    summary: '콘크리트·조적 실링용 저모듈러스 중성 실란트',
    description: 'DOWSIL™ 813C는 실내외 건축 조인트(외부 웨더실, 익스팬션 조인트, 페리미터 조인트) 및 보행로·도로 등 연료 침지가 없는 곳에 적합한 1액형 중성 저모듈러스 실란트입니다. 콘크리트·조적·벽돌·PVC-U·목재 및 일부 금속에 부식 우려 없이 접착합니다.',
    features: ['다양한 기재에 프라이머 없이 접착, 저취', 'ISO 11600-F-25LM, EN 15651-4, EN 14188-2 Class A 만족', '움직임 허용치 ±50%', '오존·UV·극한 온도(-40°C)에 강한 내후성'],
    applications: ['외부 웨더실, 익스팬션/페리미터 조인트', '콘크리트·조적·벽돌·PVC-U·목재 접합부', '보행로 및 도로 조인트(연료 침지 제외)'],
    specs: { '제품 유형': '1액형 중성(알콕시) 실리콘', '사용 온도': '-40 ~ +150°C', '시공 온도': '+5 ~ 50°C', '비중': '1.51', 'Skin-over / Tack-free': '20분 / 30분', '경도 (Shore A)': '29', '최대 인장강도': '1.9 MPa (S2 시편)', '최대 신율': '700% (S2 시편)', '탄성 회복': '90% 초과', '움직임 허용치': '±50%' },
  },
  {
    slug: 'dowsil-1001', name: 'DOWSIL™ 1001', category: 'building',
    title: 'DOWSIL™ 1001 Perimeter Silicone Sealant',
    summary: '주거용 창호 페리미터·익스팬션 조인트용 실란트',
    description: 'DOWSIL™ 1001은 1액형 중성 경화형 저모듈러스 실란트로, 주거용 창호 페리미터 실링 및 익스팬션 조인트 실링에 적합합니다. 계절에 관계없이 압출성이 좋고 상온에서 빠르게 경화됩니다.',
    features: ['발코니·페리미터 등 움직임 조인트에 적합', '움직임 허용치 ±50%', '건 사용 시 꼬리 끌림 현상 없음', '모든 Dow 실란트와 상응성 우수', '폴리카보네이트와 상응성이 좋아 크랙·접착불량 없음'],
    applications: ['주거용 창호 페리미터 실링', '익스팬션 조인트 실링', '발코니 조인트'],
    specs: { '제품 유형': '1액형 중성 저모듈러스 실리콘', '색상': '백색', '표면경화시간': '35분', '완전경화시간': '7–14일', '비중': '1.52', '경도 (Shore A)': '31', '최대 인장강도': '17 kg/cm²', '최대 신율': '620%', '사용 온도': '-50 ~ 150°C', '규격': 'KS F 4910 25LM' },
  },
  {
    slug: 'dowsil-double-n', name: 'DOWSIL™ Double-N', category: 'building',
    title: 'DOWSIL™ Double-N Sealant',
    summary: '전문 시공용 범용 1액형 중성 실리콘',
    description: 'DOWSIL™ Double-N은 일반 글레이징·웨더실링·전문 시공(Professional Trade) 용도의 고성능 1액형 중성 경화 실리콘 실란트입니다. 유리·알루미늄·벽돌·콘크리트·강재·세라믹·일부 플라스틱 등 대부분의 건축 자재에 강한 방수 밀봉을 형성합니다.',
    features: ['1액형, 상온 습기 경화', '대부분의 건축 기재에 프라이머 없이 우수한 접착', '오존·UV·습기·극한 온도에 강함', '-40°C ~ +150°C 안정·유연', '다양한 색상 (투명, 회색, 블랙, 레드, 화이트, 그린 등)'],
    applications: ['일반 글레이징', '웨더실링', '전문 시공(Professional Trade) 용도'],
    specs: { '제품 유형': '1액형 중성 경화 실리콘', '색상': 'Clear, Gray, Black, Red, White, Green, Dark Bronze, Sky blue, Ivory, Bright Gray, Wood, Cherry, Dark blue, Precast white', '경도 (Shore A)': '21 ~ 38 (타입별)', '최대 인장강도': '1.2 ~ 1.5 MPa', '최대 신율': '400 ~ 450%', '사용 온도': '-40 ~ +150°C' },
    image: img('double-n-800.jpg'),
  },
  {
    slug: 'dowsil-sanitary', name: 'DOWSIL™ Sanitary', category: 'building',
    title: 'DOWSIL™ Sanitary Sealant',
    summary: '욕실·주방용 곰팡이 저항 중성 실리콘',
    description: 'DOWSIL™ Sanitary Sealant는 고온다습한 환경에서 곰팡이 번식을 억제하도록 설계된 고성능 중성 경화 실리콘 실란트입니다. 욕실, 세탁 싱크, 세라믹 타일, 법랑 도장면 주변에 적합합니다.',
    features: ['곰팡이/백태 저항', '1액형 — 공기 중 수분으로 상온 경화', '대부분의 일반 기재에 프라이머 없이 우수한 접착', '-40°C ~ +150°C 안정·유연'],
    applications: ['욕실·세탁 싱크 주변 실링', '세라믹 타일·법랑 도장면 실링'],
    specs: { '제품 유형': '1액형 중성 경화 실리콘', '색상': 'Translucent, White, Ivory', 'Tack-free time': '17분', '비중': '1.02', '경도 (Shore A)': '24', '최대 인장강도': '1.4 MPa', '최대 신율': '400%', '비권장': '구조 글레이징, 연속 침수, 대리석 등 고다공성 석재, 고이동 익스팬션 조인트' },
    image: img('double-n-bath-800.jpg'),
  },

  // ───────── 2. GMP ─────────
  {
    slug: 'dowsil-786-plus', name: 'DOWSIL™ 786+', category: 'gmp',
    title: 'DOWSIL™ 786+ Silicone Sealant',
    summary: '곰팡이·세균 저항 위생 실란트 (식품 접촉 가능 FDA 적합)',
    description: 'DOWSIL™ 786+는 샤워·욕조·싱크 등 고온다습한 비다공성 표면 실링용 중/고모듈러스 아세톡시 실리콘 실란트입니다. 경화 후 곰팡이·세균에 민감하지 않고 FDA 21 CFR 177.2600에 적합하여 식품 접촉 가능성이 있는 곳에도 사용할 수 있습니다.',
    features: ['곰팡이·세균 저항, 정균성', '수축·균열·건조 없이 영구 유연', 'FDA 21 CFR 177.2600 적합', 'ISO 22196 (MRSA·대장균·살모넬라), ISO 846 시험 — 균에 민감하지 않음'],
    applications: ['샤워·욕조·싱크·소변기·월풀 주변 실링', '욕실 설비 주변', '냉동·냉장 설비, 냉장실 실링', '타일 줄눈'],
    specs: { '제품 유형': '아세톡시 경화 실리콘', '시공 온도': '+5 ~ +40°C', '비중': '1.01', 'Skin-over time': '15분', '경도 (Shore A)': '19', '최대 인장강도': '1.7 MPa', '최대 신율': '600%', '움직임 허용치': '±20%', '규격': 'ISO 11600-F-20LM' },
  },
  {
    slug: 'dowsil-se-5088', name: 'DOWSIL™ SE 5088', category: 'gmp',
    title: 'DOWSIL™ SE 5088 Sealant',
    summary: '클린룸용 저휘발 1액형 중성 실리콘',
    description: 'DOWSIL™ SE 5088은 반도체·정밀 광학·전자 기기를 다루는 클린룸에서 입자 오염의 원인이 될 수 있는 저분자 실록산 함량을 낮춘 1액형 중성 경화 실란트입니다. 클린룸의 특정 조인트 실링, 패널 접착 등에 사용됩니다.',
    features: ['상온 경화 RTV, 혼합 불필요', '실리콘 휘발분 최소화', '우수한 내후성 · 무프라이머 접착', '비흐름성 (Non flow)'],
    applications: ['클린룸 조인트 실링', '클린룸 패널 접착'],
    specs: { '제품 유형': '1액형 중성 경화 실리콘', '색상': 'White, Ivory, Light Gray', 'Tack free time': '22분 (JIS A 1439)', '비중': '1.41', '경도 (JIS A)': '19', '최대 인장강도': '1.74 MPa', '최대 신율': '534%', '저분자 실록산 (D4–D10)': '24 ppm', '권장 프라이머': 'DOWSIL™ Primer-D3(RF) (유리·금속·도장 금속)' },
  },

  // ───────── 3. 토목용 ─────────
  {
    slug: 'dowsil-902-rcs', name: 'DOWSIL™ 902 RCS', category: 'civil',
    title: 'DOWSIL™ 902 RCS Joint Sealant',
    summary: '교량·고속도로 신축이음용 속경화 자기수평 2액형',
    description: 'DOWSIL™ 902 RCS는 교량·고속도로의 신축이음(시공 시 폭 25–76mm)을 실링하기 위한 속경화 자기수평 2액형 실리콘 고무 실란트입니다. 콘크리트/콘크리트, 콘크리트/강재, 강재/강재 기재에 쓰이며 신설·보수 공사 모두 적용됩니다.',
    features: ['속경화, 사용 간편, 편리한 폐기 팩', '초저모듈러스 · 완전 탄성', '높은 움직임 허용 (+100/-50%)', '불규칙한 표면 실링, 자기 접착', '전 온도 시공 가능 (all-temperature gunnability)'],
    applications: ['교량·고속도로 신축이음 (콘크리트/강재)', '신설 및 보수 공사', '불규칙·경미한 박락 조인트'],
    specs: { '제품 유형': '2액형 실리콘 고무 (자기수평)', '혼합 비율': '1:1 (부피)', '색상': 'Part A 진회색 / Part B 흰색', 'Skin-over time': '12분 (25°C)', 'Tack-free time': '50분', '조인트 신율': '1200% 초과', '움직임 허용치': '+100/-50%', '규격': 'ASTM C920 Type M Grade P Class 100/50 Use T2, NT, M' },
  },
  {
    slug: 'dowsil-888', name: 'DOWSIL™ 888', category: 'civil',
    title: 'DOWSIL™ 888 Silicone Joint Sealant',
    summary: '콘크리트 포장 조인트용 비흐름성 1액형',
    description: 'DOWSIL™ 888은 포틀랜드 시멘트 콘크리트 포장 조인트용 1액형 냉간 시공 비흐름성 실리콘 실란트입니다. 폭이 일정하지 않은 조인트에도 사용 가능하며 신설·보수 공사에 적용합니다.',
    features: ['-20~120°F(약 -29~49°C)에서 압출 가능', '움직임 허용치 100% 신장 / 50% 압축', '저모듈러스 · 내후/내UV', '단기 연료 노출 저항', '콘크리트에 프라이머 불필요 (표면은 청결·건조·무서리)', '표면경화 1시간 이내'],
    applications: ['콘크리트-콘크리트 포장 조인트', '신설/보수 공사', '경미한 박락 조인트'],
    specs: { '제품 유형': '1액형 비흐름성 실리콘', '색상': 'Gray', '비중': '1.48', '최대 신율': '1000% 이상 (Die C)', 'Shore A 경도': '15', '반발 탄성': '77%', '움직임 허용치': '+100/-50% (10 cycles)', '가속 내후성': '5,000시간 통과' },
  },
  {
    slug: 'dowsil-890-sl', name: 'DOWSIL™ 890-SL', category: 'civil',
    title: 'DOWSIL™ 890-SL Silicone Joint Sealant',
    summary: '툴링이 필요 없는 자기수평 도로 조인트 실란트',
    description: 'DOWSIL™ 890-SL은 콘크리트 및 콘크리트-아스팔트 포장 조인트용 1액형 자기수평 실리콘입니다. 불규칙한 조인트 폭에도 스스로 흘러 들어가며 툴링이 필요 없고, 콘크리트·아스팔트에 프라이머가 필요 없습니다.',
    features: ['자기수평, 툴링 불필요', '-20~120°F에서 압출 가능', '움직임 허용치 100% 신장 / 50% 압축', '초저모듈러스, 내후/내UV', '단기 연료 저항', '표면경화 1시간 이내 — 신속한 도로 개통'],
    applications: ['콘크리트-콘크리트 / 콘크리트-아스팔트 포장 조인트', '신설·보수 공사', '불규칙·박락 조인트'],
    specs: { '제품 유형': '1액형 자기수평 실리콘', '색상': 'Dark gray / Light gray', '비중': '1.26–1.34', 'Shore A 경도': '3–5', '최대 신율': '1400%', '반발 탄성': '77%', '움직임 허용치': '+100/-50% (10 cycles)', '가속 내후성': '5,000시간 통과' },
    image: img('890-sl-800.jpg'),
  },

  // ───────── 4. 복층유리 ─────────
  {
    slug: 'dowsil-335', name: 'DOWSIL™ 335 Butyl', category: 'igu',
    title: 'DOWSIL™ 335 Butyl Sealant Black',
    summary: '복층유리 1차 씰링용 폴리이소부틸렌 부틸',
    description: 'DOWSIL™ 335 Butyl Sealant Black은 상업·주거용 복층유리의 1차 씰링재로 사용되는 열 적용식 1액형 폴리이소부틸렌입니다. EN 1279 요구사항을 만족하며 가스 충진 이중·삼중 복층유리에 적합합니다.',
    features: ['85°C까지 내열 — 복층유리 내부 흐름/유출 없음', '무용제 1액형 1차 씰재', '유리 및 다양한 웜엣지/일반 스페이서에 우수한 접착', '모든 Dow 파사드 실리콘과 상응성', 'EN 1279 기준 가스 충진 복층유리 적합'],
    applications: ['복층유리 1차 씰링 (이중/삼중, 플라스틱·금속 스페이서)', '주거용 창호 및 상업용 파사드 복층유리'],
    specs: { '제품 유형': '폴리이소부틸렌, 비반응성·무용제', '색상': 'Black', '비중': '1.24', '적용 온도': '125–145°C (가열식 부틸 도포기)', '수증기 투과': '0.05 g/m²/24h (2.0mm 필름)', '휘발분': '0.001% 이하', '용융률 (MVR)': '8–10.5 cm³/10min' },
  },
  {
    slug: 'dowsil-939', name: 'DOWSIL™ 939', category: 'igu',
    title: 'DOWSIL™ 939 Silicone Insulating Glass Sealant',
    summary: '주거용 복층유리 2차 씰링 2액형 실란트',
    description: 'DOWSIL™ 939는 이중 씰 복층유리의 2차 씰링재로 사용하는 2액형 실리콘 실란트입니다. 주제(백색 페이스트)와 경화제(흑색 페이스트)를 혼합하면 내구성·고모듈러스의 유연한 실리콘 씰로 경화됩니다.',
    features: ['유리에 프라이머 없이 우수한 접착', '비흐름성 — 자동화 글레이징 가능', '우수한 사용 수명 안정성', '경화 속도 조절 (스냅타임 30–50분)', '비부식성 부산물'],
    applications: ['주거용 복층유리 2차 씰링'],
    specs: { '제품 유형': '2액형 실리콘 (중성 경화)', '혼합 비율': '13:1 (주제:경화제, 중량비)', '색상': '주제 백색 / 경화제 흑색 / 혼합 흑색', '가사시간': '40분', '경도 (Shore A)': '52', '최대 인장강도': '2.7 N/mm²', '최대 신율': '250%', '접착 시험 (유리/알루미늄)': '응집파괴 100%' },
  },
  {
    slug: 'dowsil-982', name: 'DOWSIL™ 982', category: 'igu',
    title: 'DOWSIL™ 982 Silicone Insulating Glass Sealant',
    summary: '구조 지지 가능 복층유리 2차 씰링 2액형',
    description: 'DOWSIL™ 982는 복층유리 2차 씰링용 2액형 실란트로, 혼합 후 화학적으로 안정하고 유연하며 내구성이 우수한 고모듈러스 탄성체를 형성합니다. 내후성이 우수해 장기 외부 노출 후에도 초기 물성을 유지하며 최소 10년간 수밀·기밀이 유지됩니다.',
    features: ['구조적 지지력 (구조 글레이징용 복층유리 사용 시 적용 형태는 복층유리 제조자가 결정)', '유리·알루미늄·갈바나이징 철판에 프라이머 없이 접착', '비흐름성 — 자동화 글레이징 가능', '경화 시간 조절 가능 (30–70분)', '비부식성 경화 부산물'],
    applications: ['복층유리 2차 씰링', '구조 글레이징용 복층유리 2차 씰링'],
    specs: { '제품 유형': '2액형 실리콘', '혼합 비율': '12:1 (중량비)', '색상': '주제 백색(비중 1.37) / 경화제 흑색(비중 1.02)', '가사시간': '35분', '경도 (Shore A)': '42', '최대 인장강도': '16.5 kg/cm²', '최대 신율': '240%', '유통 기간': '12개월', '박리 접착성': '유리·알루미늄 응집파괴 100%' },
  },
  {
    slug: 'dowsil-983', name: 'DOWSIL™ 983', category: 'igu',
    title: 'DOWSIL™ 983 Structural Glazing Sealant',
    summary: '공장 글레이징·커튼월 생산용 2액형 구조 실란트',
    description: 'DOWSIL™ 983은 공장 글레이징 및 커튼월 생산에서 구조와 웨더실을 겸하는 2액형 중성 RTV 실리콘 실란트입니다. 경화 후 내구성·유연성·수밀성을 가지며 20년 보증이 가능하고 ±25% 움직임 웨더실에도 사용됩니다. 구조 적용은 반드시 기술진의 검토가 필요합니다.',
    features: ['구조 및 웨더실 용도 승인', 'ASTM C719 Class 25 (G, A, O) · ASTM C1184 만족', '저VOC (혼합 시 18 g/L 미만)', '유리·알로다인·아노다이징 알루미늄에 우수한 접착 (Kynar 등은 Primer-C OS 권장)'],
    applications: ['공장 글레이징', '커튼월 유닛 생산'],
    specs: { '제품 유형': '2액형 중성 RTV 실리콘', '혼합 비율': '9:1 (부피)', '색상': 'Base 백색 / Catalyst 흑색 또는 회색', '가사시간': '10–25분', 'Unit handling time': '4–24시간 (24°C)', '경도 (Shore A)': '30–40 (1일) / 35–45 (7일)', '최대 인장강도': '2.0 MPa (7일)', '움직임 허용치': '±25%' },
  },
  {
    slug: 'dowsil-993', name: 'DOWSIL™ 993', category: 'igu',
    title: 'DOWSIL™ 993 Structural Glazing Sealant',
    summary: '유럽(EOTA)·중국 GB 규격 만족 2액형 구조 실란트',
    description: 'DOWSIL™ 993은 구조 글레이징용 2액형 실리콘 실란트로, EOTA 유럽 구조 글레이징 규격과 중국 GB 16776을 만족합니다. 코팅·에나멜·반사유리, 아노다이징·폴리에스터 도장 알루미늄, 스테인리스 등 폭넓은 기재에 우수한 접착을 보입니다.',
    features: ['EOTA 유럽 구조 글레이징 규격 / 중국 GB 16776 만족', '다양한 기재에 우수한 접착', '높은 기계적 물성, 무취·비부식성 경화', '-50°C ~ 150°C 안정, 우수한 UV·열·습기 저항', '주제와 경화제의 Lot 매칭 불필요'],
    applications: ['구조 글레이징 (커튼월 유닛 생산)'],
    specs: { '제품 유형': '2액형 실리콘 고무', '혼합 비율': '9:1 ~ 12:1 (주제:경화제)', '혼합 후': '흑색 비흐름성 페이스트, 비중 1.33', '가사시간': '10–30분', 'Tack-free time': '80–100분', '경도 (Shore A)': '40', '사용 온도': '-50 ~ 150°C' },
  },

  // ───────── 5. 특수용 ─────────
  {
    slug: 'dowsil-firestop-700', name: 'DOWSIL™ FIRESTOP 700', category: 'special',
    title: 'DOWSIL™ FIRESTOP 700 Sealant',
    summary: '내외부 선형 조인트·관통부용 내화 실리콘',
    description: 'DOWSIL™ FIRESTOP 700은 내화 구조 벽체의 수직·수평 선형 익스팬션 조인트와 배관·케이블 관통부 실링용 1액형 내화 실리콘입니다. 조인트 구성에 따라 최대 240분(4시간)의 내화 성능(E, EI)을 얻을 수 있습니다.',
    features: ['저모듈러스, 비흐름성, 중성·무할로겐 경화', '무프라이머로 다공성/비다공성 기재에 우수한 접착', 'ISO 11600-F&G-25LM, 움직임 ±50%', 'EN 13501-1 B,s2,d0 방화 반응 등급', 'EN 1366-4 / BS 476-22 선형 조인트 내화 시험, 관통부 BS 476-22', 'CE 마킹 (EAD 350141-00-1106), UAE Civil Defense 승인, 철도 EN 45545-2 승인'],
    applications: ['내화 벽체의 수직/수평 선형 익스팬션 조인트', '배관·케이블 관통부 실링'],
    specs: { '제품 유형': '1액형 내화 중성 실리콘', '비중': '1.48', '가사시간': '15분', 'Tack-free time': '1.5시간', '경도 (Shore A)': '26', '최대 인장강도': '0.57 MPa', '최대 신율': '345%', '움직임 허용치': '±50%', '내화 성능': '최대 240분 (조인트 구성에 따름)', '포장': '310ml 카트리지, 12개/박스' },
  },
  {
    slug: 'dowsil-rtv-hi-temp', name: 'DOWSIL™ Hi-Temp', category: 'special',
    title: 'DOWSIL™ Hi-Temp Sealant (RTV)',
    summary: '연속 260°C까지 견디는 내열 아세톡시 실리콘',
    description: 'DOWSIL™ Hi-Temp Sealant는 1액형 아세톡시 경화 실리콘 실란트로, 상온에서 수분과 반응해 질긴 고무로 경화됩니다. 연속 500°F(260°C), 단속 550°F(288°C)의 고온에서도 유연성을 유지하며 균열·수축·분화가 없습니다.',
    features: ['연속 260°C / 단속 288°C 고온 사용', '유연성 유지 — 취화·균열·수축 없음', '빠른 경화, 높은 강도', '재사용 가능한 노즐 포장'],
    applications: ['연돌 백필터', '가열로·점검구·플랜지 배관 이음', '가스 기기 연도, 오븐 도어, 오븐 창', '고온 실링·접착이 필요한 부위'],
    specs: { '제품 유형': '1액형 아세톡시 RTV 실리콘', 'Tooling time': '5–10분', 'Tack-free time': '15–20분', '시공 온도': '-29 ~ 50°C', '경도 (Shore A)': '30', '최대 인장강도': '325 psi', '최대 신율': '500%', '사용 온도': '-40 ~ 260°C (연속)', '움직임 허용치': '±25%', 'VOC': '33/34 g/L' },
  },
  {
    slug: 'dowsil-allguard', name: 'DOWSIL™ ALLGUARD', category: 'special',
    title: 'DOWSIL™ ALLGUARD Silicone Elastomeric Coating',
    summary: '외벽 조적·콘크리트용 수성 실리콘 방수 코팅',
    description: 'DOWSIL™ ALLGUARD는 지상부 외부 조적 기재(콘크리트 블록, 벽돌, 스터코, EIFS, 현장타설/프리캐스트 콘크리트, 기존 도장면 등)를 방수하는 1액형 안료 함유 수성 실리콘 엘라스토머 코팅입니다. 보통 2회 도포하며 롤러·브러시·스프레이로 시공하고, 경화 후 물은 막고 수증기는 통과시키는 유연한 막을 형성합니다.',
    features: ['장기 방수 보호', '햇빛·비·눈·극한 온도에서도 방수 성능 유지', '100% 수성, 3종 틴트 베이스(유통처 조색)', '곰팡이 저항 (No growth), 동결/해동 저항, 풍우(Wind driven rain) 통과', '기재에 따라 DOWSIL™ ALLGUARD Primer 필요'],
    applications: ['콘크리트 블록·벽돌·스터코 외벽 방수', '현장타설/프리캐스트 콘크리트', 'EIFS 및 기존 도장 조적 기재'],
    specs: { '제품 유형': '1액형 수성 실리콘 엘라스토머 코팅', '고형분': '58.6 wt% / 50.1 vol%', '비중': '1.155 kg/L', 'VOC': '50 g/L 미만', '경도 (Shore A)': '38', '인장강도': '1.00 MPa 이상', '신율': '600%', '투습도': '43.2 perms' },
  },
  {
    slug: 'dowsil-123', name: 'DOWSIL™ 123', category: 'special',
    title: 'DOWSIL™ 123 Silicone Seal',
    summary: '고이동 프리폼 실리콘 실 (보수·리모델링용)',
    description: 'DOWSIL™ 123은 설계 오류·시공 불량·실란트/가스켓 수명 만료로 파손된 건축 조인트와 글레이징 디테일 보수에 쓰는 프리폼(압출 성형) 실리콘 실입니다. 기존 실란트를 잘라내고 재시공하는 것보다 경제적인 고성능 대안입니다.',
    features: ['+200/-75% 고이동 / 고전단 움직임 대응', '극저모듈러스 — 습식 실란트의 대안', 'SWRI 검증 성능', 'DOWSIL™ ALLGUARD 코팅과 함께 완전한 웨더실 시스템 구성', '맞춤 디자인 및 무광(EIFS 유사) 마감 가능'],
    applications: ['파손된 웨더프루핑 조인트 보수', 'EIFS 조인트 및 창 주변 복구 조인트', '고성능 창·커튼월 알루미늄 스플라이스', '파라펫·코핑 조인트, 누수 트랜지션, 스카이라이트 누수'],
    specs: { '제품 유형': '프리폼 실리콘 엘라스토머 압출품', '색상': 'Black, White, Grey, Bronze, Limestone, Sandstone (맞춤 가능)', '경도 (Shore A)': '25', '인장강도': '2.07 MPa', '신율': '500%', '인열강도 (Die B)': '17.5 kN/m', '움직임 허용치': '+200/-75%', '접착 실란트': 'DOWSIL™ 791 / 795 (동일 색상)' },
  },
  {
    slug: 'dowsil-375', name: 'DOWSIL™ 375', category: 'special',
    title: 'DOWSIL™ 375 Construction & Glass Embedding',
    summary: '글라스 난간 U-프로파일용 2액형 폴리우레탄 임베딩',
    description: 'DOWSIL™ 375는 U자형 프로파일에 평판/곡면 단판 또는 접합 유리 패널을 견고하게 고정·지지하기 위해 개발된 자기수평 2액형 폴리우레탄입니다. 실내외 글라스 발러스트레이드(난간)에 사용됩니다.',
    features: ['보이지 않는 고정으로 전면 유리의 미관 확보', '우수한 유동성, 효율적·신속한 시공', '매우 단단한 고무로 경화 — 하중 시 패널 처짐 최소화', '긴 가사시간, 상온 초고속 경화', '무용제, 경량 용기'],
    applications: ['U-프로파일 글라스 난간 유리 임베딩', '실내외 적용'],
    specs: { '제품 유형': '2액형 폴리우레탄 (충전 폴리올 + 폴리머릭 이소시아네이트)', '혼합 비율': '100:19 (중량) / 100:25 (부피)', '색상': 'Part A Cream / Part B Brown', '혼합 점도': '5,000 mPa·s (23°C)', '가사시간': '60분', '경화시간': '7시간 (20°C)', '경도 (Shore D)': '70', '인장강도': '17 MPa', '신율': '11%' },
  },
  {
    slug: 'dowsil-650-plus', name: 'DOWSIL™ 650+', category: 'special',
    title: 'DOWSIL™ 650+ Protective Peelable Coating',
    summary: '파사드 유리·금속 임시 보호용 박리형 코팅',
    description: 'DOWSIL™ 650+는 파사드 글레이징 시스템·패널(유리, 금속)을 먼지·오염·그리스·용접 슬래그로부터 임시 보호하는 수성 아크릴 박리형 코팅입니다. 보호가 필요 없어지면 기재 손상이나 잔여물 없이 떼어낼 수 있습니다.',
    features: ['잔여물 없이 쉽게 박리 (7일 경화 후)', '기재 손상·침투 없음', '일반 DOWSIL 글레이징 실란트와 상응성', '저VOC, APEO 프리', '장기 UV·풍화 노출 후에도 우수한 박리성', '최대 18개월 보호 (조건에 따름)'],
    applications: ['커튼월·파사드 유리/금속 임시 보호', '플라스틱 등 다양한 기재 임시 보호'],
    specs: { '제품 유형': '수성 아크릴 박리형 코팅', '외관': '반투명 청색 액체', '비중 (습윤)': '1.05 g/ml', 'MFFT': '8.5°C (±2)', '점도': '6,000 cps 미만', 'VOC': '6 g/L (SCAQMD)', '도포 두께 (건조 막)': '100 µm (붓/롤러/스프레이)' },
  },

  // ───────── 6. 프라이머 ─────────
  {
    slug: 'dowsil-primer-c', name: 'DOWSIL™ Primer-C', category: 'primer',
    title: 'DOWSIL™ Primer-C',
    summary: 'PVF2(Kynar)·폴리에스터 분체도장용 실란 프라이머',
    description: 'DOWSIL™ Primer-C는 커튼월 적용에서 도장면에 대한 실란트 접착을 높이는 용제형 실란 프라이머입니다. 저온·저습 조건에서도 접착 발현이 빠릅니다. DOWSIL™ 983, 993, 993N 구조 글레이징 실란트의 PVF2/Kynar계 도장면 접착 촉진 용도 전용입니다.',
    features: ['비오염성 실란 프라이머', '수분 경화', 'PVF2(Kynar)계 도료 및 폴리에스터 분체도장에 접착 촉진'],
    applications: ['DOWSIL™ 983 / 993 / 993N 구조 글레이징 실란트의 PVF2·Kynar계 도장 접착 촉진 (커튼월 전용)'],
    specs: { '제품 유형': '용제형 실란 프라이머', '색상': 'Clear', '비중': '0.90', '인화점': '-4°C (25°F) — 매우 인화성', 'VOC': '855 g/L', '도포량': '비다공성 기재 약 800 ft²/gal', '건조 시간': '상온 20분 / 5°C 1시간' },
  },
  {
    slug: 'dowsil-allguard-primer', name: 'DOWSIL™ ALLGUARD Primer', category: 'primer',
    title: 'DOWSIL™ ALLGUARD Primer',
    summary: 'ALLGUARD 코팅용 수성 실리콘 접착 증진제',
    description: 'DOWSIL™ ALLGUARD Primer는 DOWSIL™ ALLGUARD Silicone Elastomeric Coating의 접착을 높이기 위한 수성 실리콘 에멀젼 프라이머입니다. 적절히 준비된 기재에 강한 접착을 발현합니다.',
    features: ['수성', '적절히 준비된 기재에 대한 ALLGUARD 코팅 접착 향상'],
    applications: ['콘크리트 블록·벽돌·스터코·EIFS 등 외벽 조적 기재에 ALLGUARD 코팅 시공 전 프라이머'],
    specs: { '제품 유형': '수성 실리콘 에멀젼', '외관': '유백색 액체 / 경화 후 투명(기재 색이 짙어질 수 있음)', '고형분': '20 wt%', '비중': '1.0', 'VOC': '30 g/L', '주의': 'ALLGUARD 코팅을 올리지 않으면 황변·헤이즈가 생길 수 있음' },
  },
  {
    slug: 'dowsil-1200-os', name: 'DOWSIL™ 1200 OS', category: 'primer',
    title: 'DOWSIL™ 1200 OS Primer',
    summary: 'DOWSIL™ 1200 OS 프라이머 (LEED 확인서)',
    description: 'DOWSIL™ 1200 OS Primer에 대한 Dow의 LEED 정보 회신 문서입니다. 제공된 문서는 기술자료(TDS)가 아닌 LEED/VOC 확인서이며, 상세 사용법·기술자료는 문의 주시면 안내해 드립니다.',
    features: ['VOC 112 g/L (SCAQMD Rule 1168 기준)', 'CalGreen 2022 접착제·실란트·코크 VOC 요건 적합', 'Urea Formaldehyde 미함유', '미국 미시간주 Auburn 공장 생산'],
    applications: ['실란트 접착 증진용 프라이머 — 상세 용도는 문의'],
    specs: { 'VOC': '112 g/L (LEED VOC 한도 비다공 250 / 다공 750 g/L 이내)', '재활용 원료 함량': '0%', '제공 문서': 'LEED 확인서 (2025-01-01)' },
    docLabel: 'LEED 확인서',
  },
]

export const bySlug = (slug: string) => CATALOG.find((p) => p.slug === slug)
export const tdsUrl = (slug: string) => `/tds/${slug}.pdf`
