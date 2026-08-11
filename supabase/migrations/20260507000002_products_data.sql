-- ── DOWSIL 790 ──────────────────────────────────────────────────────────────
UPDATE products SET
  name_en = 'DOWSIL™ 790 Silicone Building Sealant',
  category = '내후성',
  description_ko = '일액형 초저모듈러스 중성경화 실리콘 실란트로, 콘크리트·석재·조적 등에 프라이머 없이 우수한 접착력을 발휘합니다. +100%/-50%의 최대 이동량으로 DOWSIL 내후성 라인업 중 가장 높은 유연성을 제공하며, 넓은 확장·조절 조인트에 최적화되어 있습니다.',
  description_en = 'A one-part, ultra-low-modulus, neutral-cure silicone sealant offering outstanding unprimed adhesion to masonry, concrete, and stone. Provides the highest movement capability (+100%/-50%) in the DOWSIL weatherseal range, making it ideal for wide expansion and control joints.',
  features = '["초저모듈러스 (Shore A 15) · +100%/-50% 이동량 — DOWSIL 내후성 라인 최고 유연성", "중성경화 (아세트산 미발생) · 가소제 미함유 · 저오염성", "콘크리트·석재·화강암·대리석·벽돌·알루미늄·유리에 프라이머 없이 우수한 접착", "탁월한 UV·내후성 — 비·눈·오존·극한 온도에 강한 내성", "저VOC (23g/L) · 전천후 시공 가능 · 우수한 작업성"]'::jsonb,
  applications = '["프리캐스트 콘크리트 패널의 확장 및 조절 조인트", "EIFS (외단열시스템) 조인트 실링", "커튼월 및 멀리언 내후성 실링", "자연석 포장 및 건설 조인트 실링", "신축·보수 공사 내후성 처리"]'::jsonb,
  specifications = '{"제품 유형": "일액형 중성경화 실리콘", "이동량": "+100% / -50%", "경도 (Shore A)": "15", "색상": "블랙, 그레이, 화이트, 브론즈 외 15종", "도포 온도": "-20°C ~ +50°C", "사용 온도": "-40°C ~ +149°C", "택프리 시간": "60분 (25°C, 50%RH)", "인증": "ASTM C920 Type S, Grade NS, Class 100/50"}'::jsonb
WHERE slug = 'dowsil-790';

-- ── DOWSIL 791 ──────────────────────────────────────────────────────────────
UPDATE products SET
  name_en = 'DOWSIL™ 791 Silicone Weatherproofing Sealant',
  category = '내후성',
  description_ko = '일액형 중성경화 저~중모듈러스 건축용 실리콘 실란트로, 커튼월 및 건물 파사드의 글레이징과 내후성 실링에 최적화되어 있습니다. ±50% 이동량으로 지진 및 동적 파사드 조인트에도 적합하며, 유리·알루미늄·조적에 프라이머 없이 접착합니다.',
  description_en = 'A one-part, neutral-cure, low-to-medium-modulus silicone sealant designed for general glazing and weathersealing in curtainwall and building facades. Features ±50% movement capability and excellent unprimed adhesion to glass, aluminum, and masonry.',
  features = '["중성경화 (저취) · ±50% 이동량 — 지진·동적 파사드 조인트 적합", "유리·알루미늄·조적·아연도금강에 프라이머 없이 우수한 접착력", "탁월한 UV·오존·비·내후성", "전천후 압출 용이 · 수직면 비처짐 특성", "ISO 11600 / DIN 18540 / EN 15651 CE 인증 충족"]'::jsonb,
  applications = '["커튼월 및 건물 파사드 글레이징·내후성 실링", "확장·연결·외주 조인트", "프리캐스트 콘크리트 패널 조인트", "건축 글레이징 및 창호 주변 실링", "동적 파사드 및 내진 조인트"]'::jsonb,
  specifications = '{"제품 유형": "일액형 중성경화 실리콘", "이동량": "±50%", "경도 (Shore A)": "25~34", "색상": "블랙, 그레이, 화이트, 브론즈, 라임스톤 외 7종", "도포 온도": "+5°C ~ +40°C", "사용 온도": "-50°C ~ +150°C", "택프리 시간": "40~45분 (25°C, 50%RH)", "인증": "ISO 11600-F&G-25LM · DIN 18540 Class F · EN 15651 CE"}'::jsonb
WHERE slug = 'dowsil-791';

-- ── DOWSIL 795 ──────────────────────────────────────────────────────────────
UPDATE products SET
  name_en = 'DOWSIL™ 795 Silicone Building Sealant',
  category = '구조용',
  description_ko = '일액형 중성경화 중모듈러스 실리콘 실란트로, 구조용 및 내후성 용도 모두에 적합합니다. 다양한 기재에 프라이머 없이 우수한 접착력을 발휘하며, 패널 구조 고정과 내후성 처리를 단일 제품으로 해결할 수 있는 Dow의 가장 다목적인 건축용 실란트입니다.',
  description_en = 'A one-component, neutral-curing, medium-modulus silicone sealant formulated for both structural and weatherseal applications. Offers excellent unprimed adhesion to a wide range of substrates and is Dow''s most versatile architectural-grade sealant.',
  features = '["중모듈러스 · ±50% 이동량 — 구조용 및 내후성 겸용", "유리·알루미늄·강철·화강암·EIFS·벽돌·불소수지 도장 금속에 프라이머 없이 접착", "전온도 압출 가능 · 저취 경화", "-40°C ~ +149°C 광범위한 사용 온도", "패널 구조 고정 + 내후성 처리를 단일 제품으로 해결"]'::jsonb,
  applications = '["구조 글레이징 및 비구조 글레이징", "패널 시스템 구조 고정 및 패널 보강재 접합", "커튼월·스토어프런트·창호 외주 내후성 처리", "유리·알루미늄·EIFS·화강암·콘크리트·불소수지 코팅 금속 실링", "신축·보수 공사"]'::jsonb,
  specifications = '{"제품 유형": "일액형 중성경화 실리콘", "이동량": "±50%", "경도 (Shore A)": "35", "색상": "블랙, 화이트, 라임스톤, 브론즈, 그레이 외", "사용 온도": "-40°C ~ +149°C", "택프리 시간": "약 60분 · 완전경화 7~14일", "인증": "ASTM C920 Type S, Grade NS, Class 50 · ASTM C1184 구조용"}'::jsonb
WHERE slug = 'dowsil-795';

-- ── DOWSIL 995 ──────────────────────────────────────────────────────────────
UPDATE products SET
  name_en = 'DOWSIL™ 995 Silicone Structural Glazing Sealant',
  category = '구조용',
  description_ko = '일액형 중성경화 고성능 탄성 접착제로, 실리콘 구조 글레이징 전용 제품입니다. 자기 프라이밍 시스템으로 대부분의 기재에 별도 프라이머 없이 접착하며, 350psi 인장 강도와 525% 신율로 구조 접합에 최적화되어 있습니다. 20년 성능 보증 가능합니다.',
  description_en = 'A one-component, neutral-cure, high-performance elastomeric adhesive specifically engineered for silicone structural glazing. Delivers exceptional tensile strength (350 psi), 525% elongation, and a self-priming adhesion system with 20-year performance warranty.',
  features = '["일액형 자기 프라이밍 — 유리·양극산화 알루미늄·불소수지 코팅에 별도 프라이머 불필요", "높은 인장 강도 350psi · 신율 525% — 구조 접합에 최적", "±50% 이동량 · ASTM C1184 구조용 실리콘 규격 충족", "UV·열·습기·오존에 탁월한 내성", "20년 성능 보증 가능 · 방폭·보안 글레이징에도 적합"]'::jsonb,
  applications = '["실리콘 구조 글레이징 (SSG) — 유리 패널의 알루미늄 프레임 구조 접합", "학교 보안 및 방폭 보호 글레이징", "반사형·코팅·에나멜 유리 실링", "양극산화·불소수지 도장 알루미늄 프로파일 실링", "커튼월 시스템의 금속 패널 및 도장 기재"]'::jsonb,
  specifications = '{"제품 유형": "일액형 중성경화 구조용 실리콘", "이동량": "±50%", "경도 (Shore A)": "35~45", "인장 강도": "350 psi", "신율": "525%", "색상": "블랙, 그레이, 화이트", "사용 온도": "-40°C ~ +149°C", "택프리 시간": "약 65분 (50%RH) · 완전접착 14~21일", "인증": "ASTM C920 Type S, Grade NS, Class 50 · ASTM C1184 · VOC ≤34g/L"}'::jsonb
WHERE slug = 'dowsil-995';

-- ── DOWSIL 756 SMS ──────────────────────────────────────────────────────────
UPDATE products SET
  name_en = 'DOWSIL™ 756 SMS Silicone Building Sealant',
  category = '특수',
  description_ko = '일액형 중성경화 중모듈러스 실리콘 실란트로, 다공성 기재의 오염과 금속 패널의 흘러내림을 최소화하도록 설계되었습니다. 매트 마감으로 경화되어 민감한 클래딩 소재의 장기적인 미관을 향상시키며, -20°C ~ +50°C의 전천후 시공이 가능합니다.',
  description_en = 'A one-part, pre-pigmented, neutral-cure, medium-modulus silicone sealant engineered to minimize staining of porous substrates and reduce residue rundown on metal panels. Cures to a unique dry matte-finish surface for improved long-term aesthetics.',
  features = '["중모듈러스 · ±50% 이동량 — 내후성 처리", "중성경화 · 흘러내림을 줄이는 건식 매트 마감 표면으로 경화", "전천후 압출 가능 (-20°C ~ +50°C) — 전계절 시공", "유리·벽돌·화강암·알루미늄·불소수지 도장 기재에 프라이머 없이 접착", "다공성 자연석 및 반사형 금속 패널에 특화된 저오염 포뮬러"]'::jsonb,
  applications = '["자연석 클래딩 조인트 (화강암·대리석·석회석·슬레이트)", "금속 패널 조인트 및 커튼월 내후성 처리", "조적·벽돌 확장·조절 조인트", "창호 주변 외주 실링", "민감한 파사드의 신축·보수 공사"]'::jsonb,
  specifications = '{"제품 유형": "일액형 중성경화 실리콘 (프리피그먼트)", "이동량": "±50%", "색상": "화이트, 라임스톤, 블랙, 그레이, 브론즈 외 13종", "도포 온도": "-20°C ~ +50°C", "사용 온도": "-40°C ~ +149°C", "택프리 시간": "약 2시간 (50%RH) · 완전경화 7~14일", "인증": "ASTM C920 Type S, Grade NS, Class 50, Use NT, G, M, A, O"}'::jsonb
WHERE slug = 'dowsil-756-sms';

-- ── DOWSIL 786 ──────────────────────────────────────────────────────────────
UPDATE products SET
  name_en = 'DOWSIL™ 786 Silicone RTV Adhesive Sealant',
  category = '내부',
  description_ko = '일액형 아세톡시경화 내곰팡이성 실리콘 고무 실란트로, 고습도 환경의 비다공성 면 실링에 설계되었습니다. 내장 항균제로 경화 후 곰팡이 성장을 억제하며, 욕실·주방·위생 설비 주변에 최적화되어 있습니다.',
  description_en = 'A one-part, acetoxy-cure, mildew-resistant silicone rubber sealant designed for sealing non-porous surfaces in high-humidity environments. Contains an antimicrobial agent to inhibit mildew growth after curing.',
  features = '["경화 후 내곰팡이성 · 내장 항균제 함유", "영구 유연성 — 수축·균열·부스러짐 없음", "세라믹·유리·도자기·인조대리석·유약 면에 프라이머 없이 우수한 접착", "장기 오염·변색에 강한 내성", "일액형 편의성 · 비처짐 페이스트 · 상온 경화"]'::jsonb,
  applications = '["샤워·욕조 인클로저 및 욕실 주변 실링", "세면대·소변기·배관 기기 주변 실링", "테두리 없는 싱크 방수 및 세라믹 타일 그라우팅", "냉장·식품 가공 장비 실링", "내부 고습도 건설 실링"]'::jsonb,
  specifications = '{"제품 유형": "일액형 아세톡시경화 RTV 실리콘", "이동량": "±25%", "경도 (Shore A)": "25", "색상": "화이트, 반투명 화이트, 아몬드, 투명", "도포 온도": "+5°C ~ +40°C", "사용 온도": "-40°C ~ +150°C", "택프리 시간": "약 45분 (25°C, 50%RH)", "인증": "ASTM C920 Type S, Grade NS, Class 25"}'::jsonb
WHERE slug = 'dowsil-786';

-- ── DOWSIL 732 ──────────────────────────────────────────────────────────────
UPDATE products SET
  name_en = 'DOWSIL™ 732 Multi-Purpose Sealant',
  category = '다목적',
  description_ko = '일액형 범용 아세톡시경화 실리콘 접착 실란트입니다. 상온에서 경화되어 강인하고 유연한 고무가 되며, -60°C ~ +180°C의 광범위한 사용 온도와 금속·유리·세라믹·플라스틱에 대한 우수한 접착력을 갖추고 있습니다.',
  description_en = 'A one-part, general-purpose, acetoxy-cure silicone adhesive sealant for a wide range of industrial sealing and bonding applications. Cures at room temperature to a tough, flexible rubber with broad substrate compatibility across demanding thermal environments.',
  features = '["광범위한 내열성 — -60°C ~ +180°C 연속 사용 (피크 +205°C)", "아세톡시경화 · 상온 경화 · 수직면 비처짐 페이스트", "우수한 절연 특성 (550V/mil) — 전기·전자 실링에 적합", "금속·유리·세라믹·대부분의 플라스틱에 우수한 접착력", "MIL-A-46106A · FDA 21 CFR 177.2600 (식품 접촉) 준수"]'::jsonb,
  applications = '["금속·패브릭·플라스틱 부품의 산업용 실링 및 접합", "HVAC·냉난방·냉장 장비 가스켓 접합", "수분·날씨·잦은 세척에서 부품 보호", "전기 부품 및 배선의 수분 침투 방지 실링", "산업·자동차 분야의 범용 유지보수 및 보수"]'::jsonb,
  specifications = '{"제품 유형": "일액형 아세톡시경화 RTV 실리콘", "신율": "540%", "경도 (Shore A)": "25", "색상": "투명, 블랙, 화이트, 알루미늄", "도포 온도": "+5°C ~ +40°C", "사용 온도": "-60°C ~ +180°C (피크 +205°C)", "택프리 시간": "5~10분 표면경화 · 20분 택프리", "인증": "MIL-A-46106A · FDA 21 CFR 177.2600"}'::jsonb
WHERE slug = 'dowsil-732';

-- ── DOWSIL 977 ──────────────────────────────────────────────────────────────
UPDATE products SET
  name_en = 'DOWSIL™ 977 Masonry Sealant',
  category = '내후성',
  description_ko = '중모듈러스 중성경화 탄성 실란트로, 다공성 석재 및 코팅 금속 패널의 내후성 처리와 오염·흘러내림 위험을 동시에 최소화하도록 설계되었습니다. 심미적 외관이 중요한 고급 파사드 용도에 최적화되어 있습니다.',
  description_en = 'A medium-modulus, neutral-cure elastomeric sealant engineered to weatherproof sensitive porous stone and coated metal panel substrates while minimizing the risk of staining and surface streaking. Optimized for high-aesthetic facade applications.',
  features = '["저오염 포뮬러 — 다공성 기재 오염 및 금속·유리 흘러내림 방지", "중모듈러스 · ±50% 이동량 — 우수한 장기 내구성", "중성경화 시스템 — 민감한 기재에 안전", "자연석·유리·금속·세라믹·불소수지·양극산화 알루미늄에 프라이머 없이 접착", "ASTM C920 · KS F 4910 (F-25LM) 충족"]'::jsonb,
  applications = '["자연석 클래딩 조인트 (화강암·석회석·대리석·사암)", "건축 커튼월 금속 패널 파사드 조인트", "석재 클래딩 건물의 창호·스토어프런트 외주 실링", "고심미성 환경의 조적·벽돌 확장 조인트", "오염 방지가 필요한 프리미엄 파사드"]'::jsonb,
  specifications = '{"제품 유형": "일액형 중성경화 실리콘", "이동량": "±50%", "색상": "블랙, 그레이, 브론즈, 화이트, 라임스톤 외", "공급 형태": "300mL · 500mL 카트리지", "도포 온도": "+5°C ~ +40°C", "사용 온도": "-40°C ~ +150°C", "인증": "ASTM C920 Type S, Grade NS, Class 50 · KS F 4910 (F-25LM)"}'::jsonb
WHERE slug = 'dowsil-977';

-- ── DOWSIL 991 ──────────────────────────────────────────────────────────────
UPDATE products SET
  name_en = 'DOWSIL™ 991 Silicone High Performance Sealant',
  category = '구조용',
  description_ko = '일액형 중성경화 저모듈러스 탄성 실란트로, 다공성 기재(자연석)의 오염을 방지하고 유리·금속 패널의 흘러내림을 최소화하도록 설계되었습니다. 내후성과 장기적인 외관 유지가 모두 중요한 고급 건설 파사드에 최적화되어 있습니다.',
  description_en = 'A one-part, neutral-cure, low-modulus elastomeric sealant designed to prevent staining on porous substrates and minimize residue rundown on glass and metal panels. Optimized for premium construction facades where weatherproofing and long-term aesthetics are both critical.',
  features = '["저모듈러스 · ±50% 이동량 — 우수한 장기 접착 내구성", "자연석 비오염 · 금속 패널·유리 흘러내림·잔류물 감소", "자연석·유리·금속·세라믹·불소수지·양극산화 알루미늄에 프라이머 없이 접착", "중성경화 · 30분 택프리 — 민감한 기재에 안전", "탁월한 UV·내후성 — 서비스 중 성능 저하 없음"]'::jsonb,
  applications = '["자연석 클래딩 및 포장 조인트", "프리미엄 커튼월의 유리·금속 패널 내후성 처리", "석재·세라믹·복합 패널 파사드의 확장·이동 조인트", "다공성 소재의 비오염 성능이 필요한 외주 실링", "내후성과 미관 장수명이 모두 요구되는 파사드"]'::jsonb,
  specifications = '{"제품 유형": "일액형 중성경화 실리콘", "이동량": "±50%", "색상": "블랙, 그레이, 브론즈, 라임스톤, 화이트 외 9종", "공급 형태": "500mL · 600mL 호일 소시지", "도포 온도": "+5°C ~ +40°C", "사용 온도": "-40°C ~ +150°C", "택프리 시간": "30분 (25°C, 50%RH) · 완전경화 7~14일"}'::jsonb
WHERE slug = 'dowsil-991';
