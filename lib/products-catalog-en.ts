// English translations for lib/products-catalog.ts (keyed by slug).
import { CATALOG, type CatalogProduct, type CategoryKey } from './products-catalog'

export const CATEGORY_EN: Record<CategoryKey, { label: string; desc: string }> = {
  building: { label: 'Building Envelope', desc: 'Curtain wall, structural glazing, weatherproofing and window perimeter sealing' },
  gmp: { label: 'GMP / Hygienic', desc: 'Clean-room and anti-mould / antibacterial hygienic sealants' },
  civil: { label: 'Civil Engineering', desc: 'Expansion and pavement joints for roads, bridges and concrete' },
  igu: { label: 'Insulating Glass', desc: 'Primary / secondary IG sealing and structural bonding' },
  special: { label: 'Specialty', desc: 'High-temperature, fire-stop, coatings, preformed seals and glass embedding' },
  primer: { label: 'Primers', desc: 'Adhesion-promoting primers' },
}

type En = { summary: string; description: string; features: string[]; applications: string[] }

const EN: Record<string, En> = {
  'dowsil-789': {
    summary: 'One-part neutral-cure weatherproofing sealant with primerless adhesion',
    description: 'DOWSIL™ 789 is a one-part, neutral-cure architectural weatherproofing sealant. It is easy to work with, cures with atmospheric moisture to a durable silicone rubber, and is designed to adhere to most building materials, including coated aluminum, without primer. It is used for general glazing and non-structural glazing weather seals, in the factory or on site.',
    features: ['Neutral cure — does not corrode anodized or coated aluminum', 'Excellent primerless adhesion to most substrates', 'Resists sunlight, rain, snow, ozone and temperature extremes', 'Joint movement capability ±50%', 'Stays elastic from -50°C to +150°C'],
    applications: ['General glazing / non-structural glazing weather seals', 'Glass, reflective glass, ceramic, aluminum and steel joints', 'Factory and field application'],
  },
  'dowsil-791': {
    summary: 'One-part neutral-cure sealant for curtain wall and façade weather sealing',
    description: 'DOWSIL™ 791 is a high-performance one-part, neutral-cure silicone designed for general glazing, curtain wall exteriors and building façade weather sealing. It is non-sagging with excellent extrudability and suits coated glass, galvanized steel, stone and other porous and non-porous substrates.',
    features: ['Suited to moving joints: expansion, connection and perimeter', 'Neutral cure — suitable for coated glass, galvanized steel and stone', 'Movement capability ±50%', 'Unaffected by sunlight, rain, snow and ozone', 'Good adhesion to a wide range of building materials; easy to use'],
    applications: ['Curtain wall weather sealing', 'General glazing', 'Building façade joint sealing'],
  },
  'dowsil-795': {
    summary: 'One-part neutral sealant for structural glazing and ±50% weatherseal',
    description: 'DOWSIL™ 795 is a one-part neutral-cure sealant suited to factory and field curtain wall glazing. It meets the ASTM C1184 structural silicone sealant specification and, with ±50% movement capability, can also be used as a weatherproofing sealant.',
    features: ['Meets ASTM C1184 structural glazing sealant specification', 'ASTM C719 Class 50 (±50%) — also usable as a weatherseal', 'Excellent adhesion to glass, anodized and coated aluminum', 'Neutral cure — no substrate corrosion', 'Excellent heat, humidity and UV weatherability'],
    applications: ['Factory / field curtain wall structural glazing', 'Weatherproofing seals', 'Glass-to-aluminum bonding'],
  },
  'dowsil-995': {
    summary: 'High-strength one-part neutral sealant for structural glazing',
    description: 'DOWSIL™ 995 is a one-part, neutral-cure structural glazing sealant with good storage stability, used for factory or field structural glazing of glass, metal and similar materials. It bonds without primer to glass, reflective glass, anodized aluminum, granite and fluoropolymer-coated materials, and cures to a high-modulus elastomer. Pre-testing and drawing review by Dow are required before structural use.',
    features: ['Excellent primerless adhesion to most building materials', 'Shelf life of 18 months (stored at or below 32°C)', 'Cures to a high-modulus elastomer', 'Properties retained after 4,500 hours of QUV accelerated weathering'],
    applications: ['Factory / field structural glazing', 'Structural bonding of glass and metal'],
  },
  'dowsil-121': {
    summary: 'Fast-curing two-part neutral structural / weatherseal sealant',
    description: 'DOWSIL™ 121 is a fast-curing, two-part, neutral-cure RTV silicone approved for structural and weatherseal applications. Adhesion and structural strength develop in 24–48 hours, making it suitable for repair, reglazing and other jobs needing a fast cure. All structural glazing applications must be reviewed by Dow technical staff.',
    features: ['Approved for structural and weatherseal applications', 'Odorless, non-corrosive cure', 'Stable from -50°C to 150°C', 'Primerless adhesion to alodine and anodized aluminum', 'Adheres to DOWSIL structural sealants — suitable for reglazing', 'Meets ASTM C719 Class 25 and ASTM C1184'],
    applications: ['Repair / replacement of structurally glazed glass and other substrates', 'On-site structural glazing, including storefront systems', 'Attachment of panel stiffeners', 'In-shop structural glazing where a two-part pump is not viable'],
  },
  'dowsil-977': {
    summary: 'Medium-modulus sealant that reduces staining on porous stone and metal panels',
    description: 'DOWSIL™ 977 is a one-part, medium-modulus silicone sealant designed to reduce fluid migration into porous stone such as granite and residue rundown on metal panels. It is used in new and remedial construction and can be applied across a -25 to 50°C temperature range.',
    features: ['Reduces fluid migration into porous substrates and rundown on metal panels', 'All-temperature gunnability from -25 to 50°C (dry, frost-free surfaces)', 'Medium modulus — movement capability ±50%', '10-year Weatherseal and Non-Staining warranties available', 'One-part, easy to use'],
    applications: ['Porous stone (e.g. granite) panel joints', 'Metal panel and glass weather sealing', 'New and remedial construction'],
  },
  'dowsil-991': {
    summary: 'Non-staining medium-modulus sealant for natural stone, glass and metal panels',
    description: 'DOWSIL™ 991 is a one-part, medium-modulus elastomeric sealant designed for weatherproofing sensitive natural stone, glass and metal panels where aesthetics matter. It prevents staining of porous substrates and reduces streaking on glass and metal panels.',
    features: ['Non-staining on natural stone; reduces rundown on metal and glass panels', 'Medium modulus, high movement — ±50%', 'Primerless adhesion to natural stone, glass, metal, ceramic tile, fluorocarbon paint and anodized aluminum', 'Outstanding UV and weathering resistance, good working time', '10-year Weatherseal / Non-Staining warranties available'],
    applications: ['Natural stone façade joints', 'Glass and metal panel weather sealing', 'New and remedial construction'],
  },
  'dowsil-813c': {
    summary: 'Low-modulus neutral sealant for concrete and masonry joints',
    description: 'DOWSIL™ 813C is a one-part, neutral-cure, low-modulus sealant for interior and exterior building joints (external weather seals, expansion and perimeter joints) as well as pedestrian walkways and roads not exposed to fuel immersion. It bonds to concrete, masonry, brick, PVC-U, wood and some metals without risk of corrosion.',
    features: ['Primerless adhesion to a variety of substrates; low odor', 'Meets ISO 11600-F-25LM, EN 15651-4 and EN 14188-2 Class A', 'Movement capability ±50%', 'Resistant to ozone, UV and extremes down to -40°C'],
    applications: ['External weather seals, expansion and perimeter joints', 'Concrete, masonry, brick, PVC-U and wood joints', 'Pedestrian walkway and road joints (excluding fuel immersion)'],
  },
  'dowsil-1001': {
    summary: 'Sealant for residential window perimeter and expansion joints',
    description: 'DOWSIL™ 1001 is a one-part, neutral-cure, low-modulus sealant suited to residential window perimeter sealing and expansion joints. It extrudes well in any season and cures quickly at room temperature.',
    features: ['Suited to balcony and perimeter movement joints', 'Movement capability ±50%', 'No stringing when gunned', 'Excellent compatibility with all Dow sealants', 'Compatible with polycarbonate — no cracking or adhesion loss'],
    applications: ['Residential window perimeter sealing', 'Expansion joint sealing', 'Balcony joints'],
  },
  'dowsil-double-n': {
    summary: 'General-purpose one-part neutral silicone for professional trade use',
    description: 'DOWSIL™ Double-N is a high-performance, one-part, neutral-cure silicone sealant for general glazing, weather sealing and professional trade applications. It forms a strong weatherproof seal on most building materials, including glass, aluminum, brick, concrete, steel, ceramic and selected plastics.',
    features: ['One-part, cures with atmospheric moisture at room temperature', 'Good primerless adhesion to most construction substrates', 'Resists ozone, UV, moisture and temperature extremes', 'Stable and flexible from -40°C to +150°C', 'Many colors (clear, gray, black, red, white, green, etc.)'],
    applications: ['General glazing', 'Weatherproofing', 'Professional trade applications'],
  },
  'dowsil-sanitary': {
    summary: 'Mould-resistant neutral silicone for bathrooms and kitchens',
    description: 'DOWSIL™ Sanitary Sealant is a high-performance neutral-cure silicone designed to resist mould and mildew growth in conditions of high humidity and temperature. It suits bathrooms, laundry sinks, ceramic tiles and enamel-painted surfaces.',
    features: ['Mould / mildew resistance', 'One-component — cures at room temperature with air moisture', 'Good unprimed adhesion to most common substrates', 'Stable and flexible from -40°C to +150°C'],
    applications: ['Sealing around bathrooms and laundry sinks', 'Ceramic tile and enamel-painted surfaces'],
  },
  'dowsil-786-plus': {
    summary: 'Mould- and bacteria-resistant hygienic sealant (FDA-compliant for possible food contact)',
    description: 'DOWSIL™ 786+ is a medium/high-modulus acetoxy silicone sealant for non-porous surfaces around showers, tubs and sinks in high-humidity, high-temperature conditions. Cured, it is non-sensitive to mould and bacteria and complies with FDA 21 CFR 177.2600, so it can be used where food contact is likely.',
    features: ['Fungus and mildew resistant; bacteriostatic', 'Permanently flexible without shrinking, cracking or drying out', 'Complies with FDA 21 CFR 177.2600', 'Non-sensitive to bacteria / mould per ISO 22196 (MRSA, E. coli, Salmonella) and ISO 846'],
    applications: ['Around shower-tub enclosures, tubs, sinks, urinals and whirlpools', 'Bathroom fixtures', 'Refrigeration units and cold rooms', 'Ceramic tile grouting'],
  },
  'dowsil-se-5088': {
    summary: 'Low-volatile one-part neutral silicone for clean rooms',
    description: 'DOWSIL™ SE 5088 is a one-part, neutral-cure sealant with reduced low-molecular-weight siloxane content, which can cause particulate contamination in clean rooms handling semiconductors, precision optics and electronics. It is used for specific joint sealing and panel adhesion in clean rooms.',
    features: ['Room-temperature vulcanizing (RTV); no mixing required', 'Minimized silicone volatiles', 'Excellent weatherability and unprimed adhesion', 'Non-flow'],
    applications: ['Clean-room joint sealing', 'Clean-room panel adhesion'],
  },
  'dowsil-902-rcs': {
    summary: 'Rapid-cure, self-leveling two-part sealant for bridge and highway expansion joints',
    description: 'DOWSIL™ 902 RCS is a rapid-cure, self-leveling, two-part silicone rubber sealant for sealing expansion joints on bridges and highways (25–76 mm wide at time of sealing). Substrates may be concrete/concrete, concrete/steel or steel/steel, in both new construction and remedial repair.',
    features: ['Rapid cure, easy to use, convenient disposal pak', 'Ultra-low modulus, fully elastic', 'High movement capability (+100/-50%)', 'Seals irregular surfaces; bonds to itself', 'All-temperature gunnability'],
    applications: ['Bridge and highway expansion joints (concrete / steel)', 'New construction and remedial repair', 'Irregular or minor-spalled joints'],
  },
  'dowsil-888': {
    summary: 'One-part non-sag sealant for concrete pavement joints',
    description: 'DOWSIL™ 888 is a one-part, cold-applied, non-sag silicone sealant for Portland cement concrete pavement joints. It can seal joints that are not uniform in width and is used in new construction and repair.',
    features: ['Extrudable from -20 to 120°F (about -29 to 49°C)', 'Movement capability 100% extension / 50% compression', 'Low modulus; weather and UV resistant', 'Short-term fuel resistance', 'No primer needed on concrete (surface clean, dry, frost-free)', 'Skin-over within one hour'],
    applications: ['Concrete-to-concrete pavement joints', 'New construction / repair', 'Minor-spalled joints'],
  },
  'dowsil-890-sl': {
    summary: 'Self-leveling road joint sealant — no tooling required',
    description: 'DOWSIL™ 890-SL is a one-part, self-leveling silicone for concrete and concrete-to-asphalt pavement joints. It flows into irregular joint widths on its own, needs no tooling, and requires no primer on concrete or asphalt.',
    features: ['Self-leveling, no tooling required', 'Extrudable from -20 to 120°F', 'Movement capability 100% extension / 50% compression', 'Ultra-low modulus; weather and UV resistant', 'Short-term fuel resistance', 'Skin-over within one hour — roads reopen quickly'],
    applications: ['Concrete-to-concrete and concrete-to-asphalt pavement joints', 'New construction and repair', 'Irregular and spalled joints'],
  },
  'dowsil-335': {
    summary: 'Polyisobutylene butyl for primary sealing of insulating glass',
    description: 'DOWSIL™ 335 Butyl Sealant Black is a one-part, heat-applied polyisobutylene used as the primary seal of commercial and residential insulating glass. It meets EN 1279 and suits gas-filled double and triple glazed units.',
    features: ['Temperature resistance up to 85°C with no trickles or flows within the IG unit', 'Solvent-free, one-part primary sealant', 'Good adhesion to glass and warm-edge / standard spacers', 'Compatible with all Dow façade silicones', 'Suitable for gas-filled IG units per EN 1279'],
    applications: ['Primary sealing of IG units (double / triple, plastic and metal spacers)', 'Residential windows and commercial façade IG units'],
  },
  'dowsil-939': {
    summary: 'Two-part secondary sealant for residential insulating glass',
    description: 'DOWSIL™ 939 is a two-part silicone sealant used as the secondary seal of dual-sealed insulating glass units. Mixing the base (white paste) and curing agent (black paste) produces a durable, high-modulus, flexible silicone seal.',
    features: ['Excellent unprimed adhesion to glass', 'Non-slump — permits automated glazing', 'Excellent usable-life stability', 'Adjustable cure rate (snap time 30–50 minutes)', 'Non-corrosive by-products'],
    applications: ['Residential insulating glass secondary sealing'],
  },
  'dowsil-982': {
    summary: 'Two-part IG secondary sealant with structural capability',
    description: 'DOWSIL™ 982 is a two-part secondary sealant for insulating glass that cures to a chemically stable, flexible, durable high-modulus elastomer. Its weatherability keeps initial properties after long outdoor exposure, with weather- and air-tightness maintained for at least 10 years.',
    features: ['Structural capability (for structurally glazed IG, the IG manufacturer decides how it is applied)', 'Primerless adhesion to glass, aluminum and galvanized steel', 'Non-slump — permits automated glazing', 'Adjustable cure time (30–70 minutes)', 'Non-corrosive cure by-products'],
    applications: ['Insulating glass secondary sealing', 'Secondary sealing of structurally glazed IG units'],
  },
  'dowsil-983': {
    summary: 'Two-part structural sealant for factory glazing and curtain wall production',
    description: 'DOWSIL™ 983 is a two-part, neutral-cure RTV silicone for factory glazing and curtain wall production where both structural and weatherseal performance is needed. Cured, it forms a durable, flexible, watertight bond that can be warranted for 20 years and is usable in ±25% movement weatherseals. Structural applications must be reviewed by Dow technical staff.',
    features: ['Approved for structural and weatherseal applications', 'Meets ASTM C719 Class 25 (G, A, O) and ASTM C1184', 'Low VOC (less than 18 g/L when mixed)', 'Excellent adhesion to glass, alodine and anodized aluminum (Primer-C OS recommended for Kynar etc.)'],
    applications: ['Factory glazing', 'Curtain wall unit production'],
  },
  'dowsil-993': {
    summary: 'Two-part structural sealant meeting European (EOTA) and Chinese GB standards',
    description: 'DOWSIL™ 993 is a two-part silicone for structural glazing that meets the EOTA European structural glazing guideline and Chinese GB 16776. It adheres well to coated, enamelled and reflective glass, anodized and polyester-coated aluminum, and stainless steel.',
    features: ['Meets European (EOTA) structural glazing standard and Chinese GB 16776', 'Excellent adhesion to a wide range of substrates', 'High mechanical properties; odorless, non-corrosive cure', 'Stable from -50°C to 150°C; excellent UV, heat and humidity resistance', 'Lot matching of base and curing agent not necessary'],
    applications: ['Structural glazing (curtain wall unit production)'],
  },
  'dowsil-firestop-700': {
    summary: 'Fire-rated silicone for linear joints and penetration seals',
    description: 'DOWSIL™ FIRESTOP 700 is a fire-rated, one-part silicone sealant for vertical and horizontal linear expansion joints and pipe and cable penetrations in fire-rated walls. A fire resistance rating of up to 240 minutes (E, EI) can be achieved depending on joint configuration.',
    features: ['One-part, low-modulus, non-slump, neutral cure and halogen-free', 'Excellent unprimed adhesion to porous and non-porous substrates', 'ISO 11600-F&G-25LM, movement ±50%', 'Fire reaction class B,s2,d0 per EN 13501-1', 'Fire resistance tested to EN 1366-4 / BS 476-22 (linear joints) and BS 476-22 (penetration seals)', 'CE marked (EAD 350141-00-1106); UAE Civil Defense approval; railway EN 45545-2'],
    applications: ['Vertical / horizontal linear expansion joints in fire-rated walls', 'Pipe and cable penetration seals'],
  },
  'dowsil-rtv-hi-temp': {
    summary: 'High-temperature acetoxy silicone, continuous up to 260°C',
    description: 'DOWSIL™ Hi-Temp Sealant is a one-part, acetoxy-cure silicone that cures to a tough rubbery solid at room temperature on exposure to moisture. It stays flexible at 500°F (260°C) continuously and 550°F (288°C) intermittently, without becoming brittle, cracking, shrinking or chalking.',
    features: ['Continuous 260°C / intermittent 288°C service', 'Stays flexible — no embrittlement, cracking or shrinkage', 'Fast cure, high strength', 'Removable, reusable, resealable nozzle'],
    applications: ['Bag filters on smoke stacks', 'Fired heaters, access doors and flanged pipe joints', 'Gas appliance flues, oven doors and oven windows', 'Other critical high-temperature bonding and sealing'],
  },
  'dowsil-allguard': {
    summary: 'Water-based silicone waterproof coating for exterior masonry and concrete',
    description: 'DOWSIL™ ALLGUARD is a one-component, pigmented, water-based silicone elastomeric coating that waterproofs above-grade exterior masonry (concrete block, brick, stucco, EIFS, poured / precast concrete and previously coated surfaces). It is typically applied in two coats by roller, brush or spray and cures to a flexible membrane that blocks water but lets vapor pass.',
    features: ['Long-term waterproofing protection', 'Keeps water protection in sunlight, rain, snow and temperature extremes', '100% water-based; three tint bases (pigmented at distributor)', 'Fungus resistance (no growth), freeze/thaw resistance, passes wind-driven rain', 'DOWSIL™ ALLGUARD Primer may be needed depending on substrate'],
    applications: ['Waterproofing of concrete block, brick and stucco walls', 'Poured / precast concrete', 'EIFS and previously coated masonry'],
  },
  'dowsil-123': {
    summary: 'High-movement preformed silicone seal for repair and remediation',
    description: 'DOWSIL™ 123 is a preformed (extruded) silicone seal for repairing failed construction joints and glazing details caused by design error, field failure or end of sealant/gasket life. It is an economical, high-performance alternative to cutting out and recaulking.',
    features: ['+200/-75% movement; high-shear capability', 'Extremely low-modulus alternative to wet sealants', 'SWRI-validated performance', 'Complete weatherseal system with DOWSIL™ ALLGUARD coating', 'Custom designs and matte (EIFS-like) finish available'],
    applications: ['Repair of failed weatherproofing joints', 'EIFS joints and window perimeter restoration', 'Aluminum splice in window and curtain wall', 'Parapet / coping joints, leak-free transitions, leaking skylights'],
  },
  'dowsil-375': {
    summary: 'Two-part polyurethane embedding compound for glass balustrade U-profiles',
    description: 'DOWSIL™ 375 is a self-leveling, two-part polyurethane developed to securely mount and support flat or curved monolithic or laminated glass panels in U-shaped profiles. It is used in indoor and outdoor glass balustrades.',
    features: ['All-glass aesthetics with non-visible attachment', 'Excellent flowability; efficient, fast application', 'Cures to a very rigid rubber — minimal panel deflection under load', 'Long pot life with very fast room-temperature cure', 'Solvent-free; lightweight containers'],
    applications: ['Embedding glass panels in U-profiles for balustrades', 'Indoor and outdoor use'],
  },
  'dowsil-650-plus': {
    summary: 'Peelable protective coating for façade glass and metal',
    description: 'DOWSIL™ 650+ is a waterborne acrylic peelable coating for temporary protection of façade glazing systems and panels (glass, metal) against dust, stain, grease and weld slag. When protection is no longer needed it peels off without damage or residue.',
    features: ['Peels off cleanly with no residue (after 7 days cure)', 'No damage to or penetration of the substrate', 'Compatible with common DOWSIL glazing sealants', 'Low VOC, APEO free', 'Excellent peel-off even after long UV / weather exposure', 'Protection for up to 18 months (depending on conditions)'],
    applications: ['Temporary protection of curtain wall / façade glass and metal', 'Temporary protection of plastics and other substrates'],
  },
  'dowsil-primer-c': {
    summary: 'Silane primer for PVF2 (Kynar) and polyester powder-coated surfaces',
    description: 'DOWSIL™ Primer-C is a solvent-based silane adhesion promoter that improves sealant adhesion to painted surfaces in curtain wall applications, with faster adhesion in low-temperature, low-humidity conditions. It is intended exclusively for promoting adhesion of DOWSIL™ 983, 993 and 993N structural glazing sealants to PVF2 / Kynar-based paints.',
    features: ['Nonstaining silane primer', 'Moisture cure', 'Accelerated adhesion to PVF2 (Kynar) paints and polyester powder coatings'],
    applications: ['Adhesion of DOWSIL™ 983 / 993 / 993N to PVF2 / Kynar paint (curtain wall only)'],
  },
  'dowsil-allguard-primer': {
    summary: 'Water-based silicone adhesion promoter for ALLGUARD coating',
    description: 'DOWSIL™ ALLGUARD Primer is a water-based silicone emulsion primer that improves the adhesion of DOWSIL™ ALLGUARD Silicone Elastomeric Coating to properly prepared substrates.',
    features: ['Water-based', 'Improves ALLGUARD coating adhesion to properly prepared substrates'],
    applications: ['Primer under ALLGUARD coating on concrete block, brick, stucco, EIFS and other exterior masonry'],
  },
  'dowsil-1200-os': {
    summary: 'DOWSIL™ 1200 OS Primer (LEED letter)',
    description: 'This is Dow\'s LEED information letter for DOWSIL™ 1200 OS Primer. The supplied document is a LEED / VOC confirmation, not a Technical Data Sheet. Please contact us for detailed usage and technical information.',
    features: ['VOC 112 g/L (SCAQMD Rule 1168)', 'Conforms to CalGreen 2022 VOC requirements for adhesives, sealants and caulks', 'Contains no urea formaldehyde', 'Manufactured in Auburn, Michigan, USA'],
    applications: ['Adhesion-promoting primer for sealants — contact us for details'],
  },
}

const KEYS: Record<string, string> = {
  '제품 유형': 'Product type', '색상': 'Colors', '표면경화시간': 'Skin-over / tack-free time', '완전경화시간': 'Full cure time',
  '가사시간': 'Working time', '경도 (Shore A)': 'Hardness (Shore A)', '경도': 'Hardness', '경도 (JIS A)': 'Hardness (JIS A)', '경도 (Shore D)': 'Hardness (Shore D)',
  '최대 인장강도': 'Ultimate tensile strength', '최대 신율': 'Ultimate elongation', '움직임 허용치': 'Movement capability', '적용 규격': 'Standards', '규격': 'Standards',
  '비중': 'Specific gravity', 'VOC 함량': 'VOC content', 'VOC': 'VOC', '적용 온도': 'Application temperature', '시공 온도': 'Application temperature', '사용 온도': 'Service temperature',
  '접착 강도': 'Adhesion strength', '완전 접착시간': 'Full adhesion time', '인열강도 (Die B)': 'Tear strength (Die B)', '박리 강도': 'Peel strength',
  '혼합 비율': 'Mix ratio', 'Unit handling time': 'Unit handling time', 'VOC (혼합)': 'VOC (mixed)', '유효기간': 'Shelf life', '유통 기간': 'Shelf life',
  '석재 오염': 'Stone staining', '권장 조인트 깊이': 'Recommended joint depth', '탄성 회복': 'Elastic recovery', '비권장': 'Not recommended for',
  '권장 프라이머': 'Recommended primer', '저분자 실록산 (D4–D10)': 'Low-MW siloxane (D4–D10)', '조인트 신율': 'Joint elongation', '반발 탄성': 'Resilience',
  '가속 내후성': 'Accelerated weathering', '수증기 투과': 'Water vapor permeability', '휘발분': 'Volatile content', '용융률 (MVR)': 'Melt rate (MVR)',
  '접착 시험 (유리/알루미늄)': 'Adhesion test (glass/aluminum)', '박리 접착성': 'Peel adhesion', '혼합 후': 'As mixed', '내화 성능': 'Fire resistance', '포장': 'Packaging',
  '고형분': 'Solids content', '인장강도': 'Tensile strength', '신율': 'Elongation', '투습도': 'Permeance', '접착 실란트': 'Bonding sealant',
  '혼합 점도': 'Mixed viscosity', '경화시간': 'Cure time', '외관': 'Appearance', '비중 (습윤)': 'Density (wet)', '점도': 'Viscosity', '도포 두께 (건조 막)': 'Dry film thickness',
  '인화점': 'Flash point', '도포량': 'Coverage', '건조 시간': 'Drying time', '주의': 'Note', '재활용 원료 함량': 'Recycled content', '제공 문서': 'Document supplied',
  'Skin-over / Tack-free': 'Skin-over / Tack-free', 'Skin-over time': 'Skin-over time', 'Tack-free time': 'Tack-free time', 'Tooling time': 'Tooling time', 'Tack free time': 'Tack free time',
  '조인트 신율 ': 'Joint elongation', '인장강도 ': 'Tensile strength', '최대 인장 강도': 'Ultimate tensile strength',
  '접착 시험': 'Adhesion test', '비중 (혼합)': 'Specific gravity (mixed)', 'Shore A 경도': 'Hardness (Shore A)', '완전 경화': 'Full cure',
  'MFFT': 'MFFT', '용융률': 'Melt rate', '혼합 비율 ': 'Mix ratio', '주제': 'Base', '경화제': 'Curing agent',
  '최대 신율 ': 'Ultimate elongation', '사용 수명': 'Pot life', '도포 온도': 'Application temperature', '내화': 'Fire resistance',
}

// 값은 토큰 치환 후 남은 한글은 VALUE_OVERRIDE로 보정
const VALUE_TOKENS: [RegExp, string][] = [
  [/ 및 /g, ' and '], [/9색/g, '9 colors'], [/S2 시편/g, 'S2 specimen'], [/붓\/롤러\/스프레이/g, 'brush / roller / spray'],
  [/비흐름성 페이스트/g, 'non-slump paste'], [/흑색/g, 'black'], [/백색/g, 'white'], [/진회색/g, 'dark gray'], [/회색/g, 'gray'], [/유백색 액체/g, 'milky white liquid'], [/반투명 청색 액체/g, 'translucent blue liquid'],
  [/주제/g, 'Base'], [/경화제/g, 'curing agent'], [/또는/g, 'or'], [/맞춤 가능/g, 'custom available'], [/맞춤 색상/g, 'custom colors'], [/특수 색상 가능/g, 'special colors available'],
  [/개월/g, ' months'], [/시간/g, ' h'], [/분/g, ' min'], [/일/g, ' days'], [/이내/g, ' or less'], [/미만/g, ' max'], [/이상/g, ' or more'], [/초과/g, ' or more'],
  [/중량비/g, 'by weight'], [/중량/g, 'by weight'], [/부피/g, 'by volume'], [/상온/g, 'room temp.'], [/타입별/g, 'by type'], [/매우 인화성/g, 'highly flammable'],
  [/응집파괴/g, 'cohesive failure'], [/통과/g, 'pass'], [/약/g, 'approx.'], [/가열식 부틸 도포기/g, 'heated butyl extruder'], [/동일 색상/g, 'same color'],
  [/연속/g, 'continuous'], [/조인트 구성에 따름/g, 'depending on joint configuration'], [/조건에 따름/g, 'depending on conditions'], [/에 따름/g, ' dependent'],
  [/카트리지/g, 'cartridge'], [/개\/박스/g, ' per box'], [/제조일로부터/g, 'from date of manufacture:'], [/최대/g, 'up to'],
]
const VALUE_OVERRIDE: Record<string, string> = {
  '1액형 중성 경화 실리콘': 'One-part neutral-cure silicone', '1액형 중성 저모듈러스 실리콘': 'One-part neutral-cure low-modulus silicone',
  '1액형 중성 구조용 실리콘': 'One-part neutral-cure structural silicone', '1액형 중성 실리콘': 'One-part neutral-cure silicone', '1액형 중성(알콕시) 실리콘': 'One-part neutral-cure (alkoxy) silicone',
  '1액형 비흐름성 실리콘': 'One-part non-sag silicone', '1액형 자기수평 실리콘': 'One-part self-leveling silicone', '1액형 내화 중성 실리콘': 'One-part neutral-cure fire-rated silicone',
  '1액형 아세톡시 RTV 실리콘': 'One-part acetoxy RTV silicone', '아세톡시 경화 실리콘': 'Acetoxy-cure silicone', '2액형 중성 RTV 실리콘': 'Two-part neutral-cure RTV silicone',
  '2액형 실리콘 (중성 경화)': 'Two-part silicone (neutral cure)', '2액형 실리콘': 'Two-part silicone', '2액형 실리콘 고무': 'Two-part silicone rubber', '2액형 실리콘 고무 (자기수평)': 'Two-part silicone rubber (self-leveling)',
  '2액형 폴리우레탄 (충전 폴리올 + 폴리머릭 이소시아네이트)': 'Two-part polyurethane (filled polyol + polymeric isocyanate)', '폴리이소부틸렌, 비반응성·무용제': 'Polyisobutylene, non-reactive, solvent-free',
  '1액형 수성 실리콘 엘라스토머 코팅': 'One-part water-based silicone elastomeric coating', '프리폼 실리콘 엘라스토머 압출품': 'Preformed silicone elastomer extrusion',
  '수성 아크릴 박리형 코팅': 'Waterborne acrylic peelable coating', '용제형 실란 프라이머': 'Solvent-based silane primer', '수성 실리콘 에멀젼': 'Water-based silicone emulsion',
  '유리·알루미늄 응집파괴 100%': 'Glass / aluminum: 100% cohesive failure', '응집파괴 100%': '100% cohesive failure',
  'Base 흑색/진회색, Catalyst 백색': 'Base black / dark gray, Catalyst white', 'Base 백색 / Catalyst 흑색 또는 회색': 'Base white / Catalyst black or gray',
  'Part A 진회색 / Part B 흰색': 'Part A dark gray / Part B white', '주제 백색 / 경화제 흑색 / 혼합 흑색': 'Base white / curing agent black / mixed black', '주제 백색(비중 1.37) / 경화제 흑색(비중 1.02)': 'Base white (SG 1.37) / curing agent black (SG 1.02)',
  '흑색 비흐름성 페이스트, 비중 1.33': 'Black non-slump paste, specific gravity 1.33', '유리·알루미늄·갈바나이징 철판': 'Glass, aluminum, galvanized steel',
  '구조 글레이징, 연속 침수, 대리석 등 고다공성 석재, 고이동 익스팬션 조인트': 'Structural glazing, continuous water immersion, highly porous stone such as marble, high-movement expansion joints',
  '유리·금속·도장 금속': 'glass, metal, painted metal', 'DOWSIL™ Primer-D3(RF) (유리·금속·도장 금속)': 'DOWSIL™ Primer-D3(RF) (glass, metal, coated metal)',
  'ALLGUARD 코팅을 올리지 않으면 황변·헤이즈가 생길 수 있음': 'May yellow / haze if not topcoated with ALLGUARD coating',
  '유백색 액체 / 경화 후 투명(기재 색이 짙어질 수 있음)': 'Milky white liquid / transparent when cured (may darken substrate)',
  '1200% 초과': 'Over 1200%', '1000% 이상 (Die C)': '1000% or more (Die C)', '5,000시간 통과': 'Passed 5,000 hours', '5,000 h pass': 'Passed 5,000 hours',
  '85 g/L 미만': 'Less than 85 g/L', '25 g/L 미만': 'Less than 25 g/L', '50 g/L 미만': 'Less than 50 g/L', '1.00 MPa 이상': '1.00 MPa or more',
  '0.001% 이하': '0.001% or less', '90% 초과': 'More than 90%', '6,000 cps 미만': 'Under 6,000 cps', '1.5시간 이내 (25°C, 50% RH)': 'Within 1.5 h (25°C, 50% RH)',
  '비다공성 기재 약 800 ft²/gal': 'About 800 ft²/gal on non-porous substrates', '상온 20분 / 5°C 1시간': '20 min at room temp. / 1 h at 5°C',
  '백색': 'White', 'LEED 확인서 (2025-01-01)': 'LEED letter (2025-01-01)',
  'LEED VOC 한도 비다공 250 / 다공 750 g/L 이내': 'Within LEED VOC limit (250 g/L non-porous / 750 g/L porous)',
  '112 g/L (LEED VOC 한도 비다공 250 / 다공 750 g/L 이내)': '112 g/L (within LEED VOC limit: 250 g/L non-porous / 750 g/L porous)',
  '1000% 이상': '1000% or more', '1.5 h (25°C, 50% RH)': '1.5 h (25°C, 50% RH)', '유리 및 알루미늄': 'Glass and aluminum',
  '12:1 (중량비)': '12:1 (by weight)', '13:1 (주제:경화제, 중량비)': '13:1 (base : curing agent, by weight)', '9:1 ~ 12:1 (주제:경화제)': '9:1 to 12:1 (base : curing agent)',
  '9:1 (부피)': '9:1 (by volume)', '1:1 (부피)': '1:1 (by volume)', '100:19 (중량) / 100:25 (부피)': '100:19 (by weight) / 100:25 (by volume)',
  '125–145°C (가열식 부틸 도포기)': '125–145°C (heated butylizer)', 'DOWSIL™ 791 / 795 (동일 색상)': 'DOWSIL™ 791 / 795 (same color)',
  '312 mL': '312 mL', '310ml 카트리지, 12개/박스': '310 ml cartridge, 12 per box', '최대 240분 (조인트 구성에 따름)': 'Up to 240 minutes (depending on joint configuration)',
  '폭:깊이 ≈ 2:1': 'width : depth ≈ 2:1', '6–12mm (폭:깊이 ≈ 2:1)': '6–12 mm (width : depth ≈ 2:1)',
  '인화점': 'Flash point', '-4°C (25°F) — 매우 인화성': '-4°C (25°F) — highly flammable', '0%': '0%', '12개월': '12 months', '제조일로부터 12개월': '12 months from date of manufacture',
  '80분 미만 (25°C, 50% RH)': 'Under 80 min (25°C, 50% RH)', '45분 (25°C, 50% RH)': '45 min (25°C, 50% RH)', '1.5시간 (25°C, 50% RH)': '1.5 h (25°C, 50% RH)',
  '0.05 g/m²/24h (2.0mm 필름)': '0.05 g/m²/24h (2.0 mm film)', '35분': '35 min', '7시간 (20°C)': '7 h (20°C)', '20분 (25°C)': '20 min (25°C)',
  '1.5시간': '1.5 h', '12분 (25°C)': '12 min (25°C)', '50분': '50 min', '1:1': '1:1', '15–45분': '15–45 min', '최소 24시간': 'At least 24 h', '4–24시간 (24°C)': '4–24 h (24°C)',
  '20분/30분': '20 min / 30 min', '20분 / 30분': '20 min / 30 min',
  'ISO 11600-F-20LM': 'ISO 11600-F-20LM', '혼합 후': 'As mixed',
  '가열': 'heated', '건조·무서리': 'dry, frost-free',
  '경화 후 투명': 'Transparent when cured',
  '스냅타임': 'snap time',
  '파손': 'failed',
  '0.57 MPa': '0.57 MPa',
  '1200%': '1200%',
  '진회색 / 흰색': 'Dark gray / white',
  '-20~120°F': '-20 to 120°F', '5,000 h': '5,000 h',
  '12개월 ': '12 months', '2.07 MPa': '2.07 MPa',
  '내화': 'Fire resistance', '24 h': '24 h', '유리': 'Glass', '알루미늄': 'Aluminum',
}

const HANGUL = /[가-힣]/
const trKey = (k: string) => KEYS[k] ?? k
const trVal = (v: string) => {
  if (VALUE_OVERRIDE[v]) return VALUE_OVERRIDE[v]
  let o = v
  for (const [re, to] of VALUE_TOKENS) o = o.replace(re, to)
  return o.replace(/\b1 days/g, '1 day').replace(/\s{2,}/g, ' ').replace(/ ([)])/g, '$1').trim()
}

export function enSpecs(specs: Record<string, string>) {
  return Object.fromEntries(Object.entries(specs).map(([k, v]) => [trKey(k), trVal(v)]))
}

export function localizeCatalog(p: CatalogProduct, lang: string): CatalogProduct {
  if (lang !== 'en') return p
  const e = EN[p.slug]
  return e ? { ...p, ...e, specs: enSpecs(p.specs), docLabel: p.docLabel ? 'LEED letter' : undefined } : p
}

// 개발 중 자체 점검: 번역 누락(한글 잔존) 목록
export function untranslated() {
  const bad: string[] = []
  for (const p of CATALOG) {
    const e = EN[p.slug]
    if (!e) { bad.push(`${p.slug}: missing EN`); continue }
    const s = enSpecs(p.specs)
    for (const [k, v] of Object.entries(s)) if (HANGUL.test(k) || HANGUL.test(v)) bad.push(`${p.slug}: ${k} = ${v}`)
    for (const t of [e.summary, e.description, ...e.features, ...e.applications]) if (HANGUL.test(t)) bad.push(`${p.slug}: ${t}`)
  }
  return bad
}
