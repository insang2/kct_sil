import { p, h, ul, fig, figs, sec, IMG } from '@/lib/tech-manual/types'
import type { IPage } from '@/lib/industrial/pages'

// Dow Corning® High-Performance Silicone PSAs — Product Selection and Application Guide (Form No. 30-083B-01)
export const PSA_PDF = '/docs/dow-corning-silicone-psa-selection-guide.pdf'
export const PSA_FORM = 'Form No. 30-083B-01 (AGP7825), ©2001, 2006 Dow Corning Corporation'


export const PSA: IPage[] = [
  {
    slug: 'overview-how-to-select', no: 1, pdfPages: '1',
    title: { en: 'High-Performance Silicone PSAs: Product Line and How to Select', ko: '고성능 실리콘 점착제(PSA) 제품군과 선정 방법' },
    summary: { en: 'Dow Corning silicone pressure sensitive adhesives: gums and resins in xylene/toluene, platinum and peroxide cure, primers, Syl-Off Q2-7785 release coating, and the selection steps.', ko: '자일렌/톨루엔 분산 PDMS 검·레진 실리콘 점착제, 백금·과산화물 경화, 프라이머, Syl-Off Q2-7785 이형 코팅제와 선정 순서.' },
    answer: {
      en: 'Dow Corning’s silicone PSA line consists of silicone PSAs (polydimethylsiloxane gums and resins dispersed in xylene or a xylene/toluene blend, platinum-cure or peroxide-cure), compatible primers for difficult substrates, and Syl-Off Q2-7785 fluorosilicone release coating. Select by following the flow chart, then Table 1 (cure system) and Table 2 (tack, adhesion, high-temperature hold).',
      ko: '다우코닝 실리콘 PSA 제품군은 자일렌 또는 자일렌/톨루엔에 분산된 폴리디메틸실록산 검·레진 PSA(백금 경화·과산화물 경화), 어려운 기재용 프라이머, 불소실리콘 이형 코팅제 Syl-Off Q2-7785로 구성됩니다. 플로 차트 → 표 1(경화 방식) → 표 2(택·접착력·고온 유지력) 순으로 선정합니다.',
    },
    image: IMG('psa-cover-lab'),
    sections: [
      sec('line', 'Pressure Sensitive Adhesives from Dow Corning', '다우코닝 감압 점착제 제품군',
        figs(
          { src: IMG('psa-cover-lab'), en: 'Cover photography — laboratory', ko: '표지 사진 — 연구소' },
          { src: IMG('psa-cover-race'), en: 'Cover photography — high-temperature / automotive use', ko: '표지 사진 — 고온·자동차 용도' },
          { src: IMG('psa-cover-jet'), en: 'Cover photography — aerospace use', ko: '표지 사진 — 항공우주 용도' },
        ),
        p('Dow Corning offers you a fully integrated, fully supported product line for use in the manufacture of high-performance adhesive tapes and components. The silicone pressure sensitive adhesives (PSAs) and related materials described in this guide are available globally and are appropriate for use worldwide.',
          '다우코닝은 고성능 접착 테이프와 부품 제조에 사용할 수 있는, 완전히 통합되고 전폭적으로 지원되는 제품군을 제공합니다. 본 가이드에 기술된 실리콘 감압 점착제(PSA)와 관련 소재는 전 세계에서 공급되며 전 세계에서 사용하기에 적합합니다.'),
        ul(
          ['Dow Corning® brand silicone PSAs – polydimethylsiloxane gums and resins dispersed in xylene or a blend of xylene and toluene. Two cure systems are available – platinum and peroxide.', 'Dow Corning® 실리콘 PSA – 자일렌 또는 자일렌/톨루엔 혼합 용제에 분산된 폴리디메틸실록산 검과 레진. 백금 경화와 과산화물 경화의 두 가지 경화 방식이 있습니다.'],
          ['Dow Corning® brand silicone primers – compatible primers used to increase anchorage to difficult substrates.', 'Dow Corning® 실리콘 프라이머 – 접착이 어려운 기재에 대한 앵커리지를 높이는 호환 프라이머.'],
          ['Syl-Off® Q2-7785 Release Coating – a solvent-based fluorosilicone release coating used in the production of liners, tapes and films for the release of industrial-grade silicone PSAs. Dow Corning silicone PSAs may be either wet cast or dry laminated to the coated liner.', 'Syl-Off® Q2-7785 이형 코팅제 – 산업용 실리콘 PSA의 이형을 위한 라이너·테이프·필름 제조에 사용하는 용제형 불소실리콘 이형 코팅제. 다우코닝 실리콘 PSA는 코팅된 라이너에 습식 캐스팅(wet cast) 또는 건식 라미네이션(dry laminate)할 수 있습니다.'],
        ),
        p('Dow Corning can also provide you with other high-performance materials used in the manufacture of pressure sensitive adhesive tapes and components, such as liquid silicone rubbers and adhesion promoters.',
          '다우코닝은 액상 실리콘 고무와 접착 증진제 등 감압 접착 테이프·부품 제조에 사용되는 다른 고성능 소재도 제공합니다.')),
      sec('select', 'How to Select the Best Silicone PSA for Your Application', '용도에 맞는 최적의 실리콘 PSA 선정 방법',
        p('Selecting the best silicone PSA for your application can be a complex undertaking. Substrate requirements, equipment limitations, performance demands for tack, adhesion and cohesive strength, and the need for release all enter into the picture. Begin with the PSA Selection Flow Chart, which tells you which adhesives meet your basic application and processing requirements. Then consult Tables 1 and 2: Table 1 helps you decide whether a peroxide- or platinum-cure silicone PSA is better for your needs; Table 2, supported by Figures 1–3, helps you determine which product best meets your requirements for tack, adhesion and high-temperature hold.',
          '용도에 가장 적합한 실리콘 PSA를 선정하는 일은 복잡할 수 있습니다. 기재 요건, 설비 제약, 택·접착력·응집력에 대한 성능 요구, 이형 필요성이 모두 관련됩니다. 먼저 PSA 선정 플로 차트로 기본 용도·공정 요건에 맞는 접착제를 확인한 뒤, 표 1(과산화물 경화 대 백금 경화 선택)과 그림 1~3에 근거한 표 2(택·접착력·고온 유지력에 가장 맞는 제품)를 참조합니다.'),
        h('Silicone PSA performance capabilities', '실리콘 PSA의 고성능 특성'),
        ul(
          ['Ability to withstand exposure to extreme temperatures', '극한 온도에 대한 노출을 견디는 능력'],
          ['Adhesion to low-energy surfaces such as silicone or Teflon®', '실리콘·테플론® 같은 저에너지 표면에 대한 접착'],
          ['Conformability', '추종성(conformability)'],
          ['Chemical, UV and weather resistance', '내화학성, 내UV성, 내후성'],
        ),
        p('With silicone PSAs from Dow Corning there are many ways to achieve the exact balance of performance properties your application requires. If none of the materials in this guide appear to meet your needs, contact your Dow Corning technical representative for additional suggestions.',
          '다우코닝 실리콘 PSA로는 용도가 요구하는 성능의 균형을 맞추는 다양한 방법이 있습니다. 본 가이드의 소재가 요구에 맞지 않으면 기술 담당자에게 문의하십시오.')),
    ],
    faq: [
      { q: { en: 'What cure systems are available for Dow Corning silicone PSAs?', ko: '다우코닝 실리콘 PSA의 경화 방식에는 무엇이 있습니까?' }, a: { en: 'Two: platinum cure and peroxide cure.', ko: '백금 경화와 과산화물 경화 두 가지입니다.' } },
      { q: { en: 'What solvents are the PSAs dispersed in?', ko: 'PSA는 어떤 용제에 분산되어 있습니까?' }, a: { en: 'Xylene or a blend of xylene and toluene (2013 Adhesive is solvent-free).', ko: '자일렌 또는 자일렌/톨루엔 혼합 용제이며, 2013 Adhesive는 무용제입니다.' } },
      { q: { en: 'Where can I enquire in Korea?', ko: '국내 문의처는 어디입니까?' }, a: { en: 'Korea Construction Trading (KCT): sales@kconstrade.com, 010-8939-0284.', ko: '한국건설트레이딩(KCT): sales@kconstrade.com, 010-8939-0284.' } },
    ],
  },

  {
    slug: 'selection-flow-chart', no: 2, pdfPages: '2',
    title: { en: 'Silicone PSA Selection Flow Chart', ko: '실리콘 PSA 선정 플로 차트' },
    summary: { en: 'Decision flow: solvent handling, food contact, tape or laminating construction, cure temperature and service-temperature range, with the recommended Dow Corning PSA for each branch.', ko: '용제 취급 여부, 식품 접촉, 구조(테이프/라미네이팅), 경화 온도, 사용 온도 범위에 따라 권장 PSA를 안내하는 선정 플로 차트.' },
    answer: {
      en: 'No solvent handling → 2013 Adhesive/Syl-Off 4000 Catalyst. Food contact required → Q2-7406 Adhesive (benzoyl peroxide cure) or 7657 Adhesive/Syl-Off 4000. Tape wet cast: Q2-7735 (peroxide) or 7657, 2013, 7659 (platinum). Service range −73 to 260 °C (−100 to 500 °F); extended 288 °C (550 °F) or intermittent above: 7659, 7355, 7358, Q2-7406, Q2-7566.',
      ko: '용제를 취급하지 않으면 2013 Adhesive/Syl-Off 4000 Catalyst. 식품 접촉이 필요하면 Q2-7406(과산화벤조일 경화) 또는 7657/Syl-Off 4000. 테이프 습식 캐스팅은 Q2-7735(과산화물) 또는 7657·2013·7659(백금). 사용 온도 −73~260 °C(−100~500 °F), 연속 288 °C(550 °F) 이상 또는 단속 288 °C 초과는 7659, 7355, 7358, Q2-7406, Q2-7566.',
    },
    image: IMG('psa-flowchart'),
    sections: [
      sec('chart', 'Flow chart (original)', '플로 차트 (원문 그림)',
        fig(IMG('psa-flowchart'), 'Silicone PSA Selection Flow Chart — platinum-cure material indicated in teal; peroxide-cure materials in black.', '실리콘 PSA 선정 플로 차트 — 백금 경화 소재는 청록색, 과산화물 경화 소재는 검정색으로 표시.')),
      sec('steps', 'Flow chart in text form', '플로 차트 텍스트 정리',
        ul(
          ['Does your facility handle solvents? NO → Dow Corning® 2013 Adhesive / Syl-Off® 4000 Catalyst.', '설비에서 용제를 취급합니까? 아니오 → Dow Corning® 2013 Adhesive / Syl-Off® 4000 Catalyst.'],
          ['Is food-contact capability required? YES → Dow Corning® Q2-7406 Adhesive (can be cured with benzoyl peroxide) or Dow Corning® 7657 Adhesive / Syl-Off® 4000 Catalyst.', '식품 접촉 적합성이 필요합니까? 예 → Dow Corning® Q2-7406 Adhesive(과산화벤조일로 경화 가능) 또는 Dow Corning® 7657 Adhesive / Syl-Off® 4000 Catalyst.'],
          ['In what type of construction will the adhesive be used? Tape — wet cast: cured with benzoyl peroxide → Q2-7735 Adhesive; cured with Syl-Off 4000 Catalyst → 7657, 2013, 7659 Adhesive. Dry laminated: same PSAs as for wet cast; other PSAs may also be appropriate for some dry laminated applications — contact Dow Corning. Release from fluorosilicone liner made with Syl-Off® Q2-7785 Release Coating.', '접착제를 어떤 구조에 사용합니까? 테이프 — 습식 캐스팅: 과산화벤조일 경화 → Q2-7735 Adhesive; Syl-Off 4000 Catalyst 경화 → 7657, 2013, 7659 Adhesive. 건식 라미네이션: 습식 캐스팅과 동일한 PSA, 일부 건식 라미네이션 용도에는 다른 PSA도 적합할 수 있으므로 문의. Syl-Off® Q2-7785 이형 코팅제로 만든 불소실리콘 라이너에서 이형. Laminating/Bonding: 본 가이드의 모든 소재를 라미네이팅·본딩에 사용할 수 있으며 세부 사항은 문의.'],
          ['Cure temperature <80 °C (<176 °F): Q2-7406 Adhesive air dried without catalyst (not for high-temperature applications).', '경화 온도 80 °C 미만(176 °F 미만): 촉매 없이 공기 건조한 Q2-7406 Adhesive (고온 용도 부적합).'],
          ['Cure temperature 80–150 °C (176–302 °F): 7657 Adhesive / Syl-Off 4000 Catalyst; 7659 Adhesive / Syl-Off 4000 Catalyst.', '경화 온도 80~150 °C(176~302 °F): 7657 Adhesive / Syl-Off 4000 Catalyst; 7659 Adhesive / Syl-Off 4000 Catalyst.'],
          ['Cure temperature >150 °C (>302 °F): all PSAs in this guide.', '경화 온도 150 °C 초과(302 °F 초과): 본 가이드의 모든 PSA.'],
          ['Application or service-temperature range −73 to 260 °C (−100 to 500 °F): 7657 Adhesive / Syl-Off 4000 [up to 204 °C (400 °F)]; 280A; 282; 7355; 7356; 7358; Q2-7406; Q2-7566; Q2-7735 [up to 232 °C (450 °F)].', '사용 온도 범위 −73~260 °C(−100~500 °F): 7657 Adhesive / Syl-Off 4000 [204 °C(400 °F)까지]; 280A; 282; 7355; 7356; 7358; Q2-7406; Q2-7566; Q2-7735 [232 °C(450 °F)까지].'],
          ['Extended 288 °C (550 °F) or intermittent >288 °C (550 °F): 7659 Adhesive / Syl-Off 4000 Catalyst; 7355; 7358; Q2-7406; Q2-7566.', '연속 288 °C(550 °F) 또는 단속 288 °C 초과: 7659 Adhesive / Syl-Off 4000 Catalyst; 7355; 7358; Q2-7406; Q2-7566.'],
        )),
    ],
    faq: [
      { q: { en: 'Which silicone PSA is solvent-free?', ko: '무용제 실리콘 PSA는 무엇입니까?' }, a: { en: 'Dow Corning 2013 Adhesive, used with Syl-Off 4000 Catalyst.', ko: 'Dow Corning 2013 Adhesive이며 Syl-Off 4000 Catalyst와 함께 사용합니다.' } },
      { q: { en: 'Which PSAs suit food-contact applications?', ko: '식품 접촉 용도에는 어떤 PSA가 적합합니까?' }, a: { en: 'Q2-7406 Adhesive and 7657 Adhesive/Syl-Off 4000 Catalyst; both meet FDA requirements for certain food-contact applications — contact your representative for food-contact information.', ko: 'Q2-7406 Adhesive와 7657 Adhesive/Syl-Off 4000 Catalyst이며 일부 식품 접촉 용도에 대한 FDA 요건을 충족합니다. 식품 접촉 정보는 담당자에게 문의하십시오.' } },
    ],
  },

  {
    slug: 'platinum-vs-peroxide', no: 3, pdfPages: '3',
    title: { en: 'Peroxide-Cure vs. Platinum-Cure Silicone PSAs (Table 1)', ko: '과산화물 경화 대 백금 경화 실리콘 PSA 비교 (표 1)' },
    summary: { en: 'Components, bath life, cure temperature and oven requirements, benefits and drawbacks of platinum-cure and peroxide-cure silicone PSAs.', ko: '백금 경화와 과산화물 경화 PSA의 구성, 배스 수명, 경화 온도·오븐 요건, 장점과 단점 비교.' },
    answer: {
      en: 'Platinum-cure PSAs (2013, 7657, 7659 with Syl-Off 4000 Catalyst) are two-part systems with a bath life of 24 hours or less at 21 °C, cure at as low as 80 °C in a single-zone oven, and suit temperature-sensitive substrates, but the catalyst can be contaminated by peroxides and other materials. Peroxide-cure PSAs are one-part, have extended bath life, generally need >150 °C and a multi-zone oven for tapes, and are a robust cure system resistant to catalyst poisoning.',
      ko: '백금 경화 PSA(2013·7657·7659 + Syl-Off 4000 Catalyst)는 2액형으로 21 °C에서 배스 수명이 24시간 이하이며 단일 구역 오븐에서 80 °C까지 낮은 온도에서 경화되어 온도에 민감한 기재에 적합하나, 촉매가 과산화물 등에 오염될 수 있습니다. 과산화물 경화 PSA는 1액형으로 배스 수명이 길고 테이프는 일반적으로 150 °C 초과와 다구역 오븐이 필요하며, 촉매 피독에 강한 견고한 경화 방식입니다.',
    },
    image: IMG('psa-flowchart'),
    sections: [
      sec('table1', 'Table 1. Peroxide- vs. Platinum-Cure PSAs', '표 1. 과산화물 경화 대 백금 경화 PSA',
        {
          k: 'tbl',
          head: [['', ''], ['Platinum-Cure', '백금 경화'], ['Peroxide-Cure', '과산화물 경화']],
          rows: [
            [['Dow Corning® brand silicone PSAs', 'Dow Corning® 실리콘 PSA'], '2013 Adhesive, 7657 Adhesive, 7659 Adhesive (with Syl-Off® 4000 Catalyst)', '280A, 282, 7355, 7356, 7358, Q2-7406, Q2-7566, Q2-7735 Adhesive'],
            [['Components', '구성'], ['Two-part system: silicone resin, crosslinker and polymer dispersed in solvent + platinum catalyst; catalyst required; 2013 Adhesive does not contain solvent.', '2액형: 용제에 분산된 실리콘 레진·가교제·폴리머 + 백금 촉매; 촉매 필수; 2013 Adhesive는 용제를 함유하지 않음.'], ['One-part system: silicone resin and polymer dispersed in solvent; used with a peroxide curing agent.', '1액형: 용제에 분산된 실리콘 레진과 폴리머; 과산화물 경화제와 함께 사용.']],
            [['Bath life', '배스 수명'], ['Generally 24 hours or less at 21 °C (70 °F)', '일반적으로 21 °C(70 °F)에서 24시간 이하'], ['Extended bath life', '배스 수명이 긺']],
            [['Cure temperature and oven requirements', '경화 온도 및 오븐 요건'], ['Can be cured at temperatures as low as 80 °C (176 °F) in a single-zone oven.', '단일 구역 오븐에서 80 °C(176 °F)까지 낮은 온도로 경화 가능.'], ['For tape constructions, cure temperatures >150 °C (302 °F) are generally required; cure is a two-step process that requires a multi-zone oven.', '테이프 구조는 일반적으로 150 °C(302 °F) 초과의 경화 온도가 필요하며, 2단계 공정으로 다구역 오븐이 필요.']],
            [['Benefits', '장점'], ['Fast, low-temperature cure; may be used on temperature-sensitive substrates.', '빠른 저온 경화; 온도에 민감한 기재에 사용 가능.'], ['Robust cure system; catalyst resistant to poisoning. Adhesive properties may be modified by manipulating peroxide levels and oven conditions.', '견고한 경화 방식; 촉매가 피독에 강함. 과산화물 농도와 오븐 조건으로 접착 특성 조절 가능.']],
            [['Drawbacks', '단점'], ['Platinum catalyst is subject to contamination by peroxides and other materials.', '백금 촉매가 과산화물 등에 오염될 수 있음.'], ['Failure to remove solvent can result in bubbling, low adhesion, low cohesive strength. Failure to adequately degrade the peroxide can result in “snow” crystals, instability in high-temperature applications.', '용제를 제거하지 못하면 기포, 낮은 접착력, 낮은 응집력이 생길 수 있음. 과산화물을 충분히 분해하지 못하면 “눈(snow)” 결정이 생기고 고온 용도에서 불안정.']],
          ],
        }),
    ],
    faq: [
      { q: { en: 'What is the bath life of platinum-cure silicone PSAs?', ko: '백금 경화 실리콘 PSA의 배스 수명은?' }, a: { en: 'Generally 24 hours or less at 21 °C (70 °F), so the coating bath should be used within 24 hours of catalyst addition.', ko: '21 °C(70 °F)에서 일반적으로 24시간 이하이므로 촉매 첨가 후 24시간 이내에 코팅 배스를 사용해야 합니다.' } },
      { q: { en: 'What is the main drawback of peroxide cure?', ko: '과산화물 경화의 주된 단점은?' }, a: { en: 'Residual solvent causes bubbling and low adhesion/cohesion; incomplete peroxide breakdown leaves “snow” crystals and instability at high temperature.', ko: '용제가 남으면 기포와 낮은 접착·응집력이 생기고, 과산화물 분해가 불충분하면 “snow” 결정과 고온 불안정이 생깁니다.' } },
    ],
  },

  {
    slug: 'product-descriptions', no: 4, pdfPages: '4',
    title: { en: 'Silicone PSA Product Descriptions and Typical Performance (Table 2)', ko: '실리콘 PSA 제품별 특징·용도·고온 유지력 (표 2)' },
    summary: { en: 'Features, typical applications and high-temperature hold/shear of 2013, 7657, 7659, 280A, 282, 7355, 7356, 7358, Q2-7406, Q2-7566 and Q2-7735 adhesives.', ko: '2013, 7657, 7659, 280A, 282, 7355, 7356, 7358, Q2-7406, Q2-7566, Q2-7735의 특징, 대표 용도, 고온 유지력.' },
    answer: {
      en: 'Highest hold: Q2-7406 and Q2-7566 at 288 °C (550 °F). Solvent-free: 2013 (260 °C). Low-temperature cure from 80 °C with FDA food-contact capability: 7657 (204 °C). Lead-free solder masking and PTFE/polyimide: 7659 (204 °C). Q2-7735 combines high tack and good adhesion (232 °C) and is recommended with Syl-Off Q2-7785 liners.',
      ko: '최고 유지 온도: Q2-7406·Q2-7566 288 °C(550 °F). 무용제: 2013(260 °C). 80 °C 저온 경화와 식품 접촉(FDA): 7657(204 °C). 무연 솔더 마스킹·PTFE/폴리이미드: 7659(204 °C). Q2-7735는 높은 택과 우수한 접착(232 °C)을 겸하며 Syl-Off Q2-7785 라이너와 함께 권장됩니다.',
    },
    image: IMG('psa-flowchart'),
    sections: [
      sec('table2', 'Table 2. Product descriptions, typical performance properties', '표 2. 제품 설명 및 대표 성능',
        {
          k: 'tbl',
          head: [['Product', '제품'], ['Cure system', '경화 방식'], ['Features / benefits', '특징·장점'], ['Typical applications', '대표 용도'], ['High-temp hold/shear¹, °C (°F)', '고온 유지력/전단¹, °C (°F)']],
          rows: [
            ['2013 Adhesive / Syl-Off® 4000 Catalyst', ['Platinum', '백금'], ['Solvent-free', '무용제'], ['Adhesive tapes, labels and transfer films; bonding low-energy substrates; high- and low-temperature labeling applications', '접착 테이프, 라벨, 전사 필름; 저에너지 기재 접착; 고온·저온 라벨링'], '260 (500)'],
            ['7657 Adhesive / Syl-Off® 4000 Catalyst', ['Platinum', '백금'], ['Low-temperature cure, as low as 80 °C (176 °F); high tack and adhesion; meets FDA requirements for certain food-contact applications²', '80 °C(176 °F)까지 저온 경화; 높은 택과 접착력; 일부 식품 접촉 용도 FDA 요건 충족²'], ['Temperature-sensitive substrates; transfer tapes and labels; recommended for use with release liner coated with Syl-Off® Q2-7785 Release Coating', '온도 민감 기재; 전사 테이프·라벨; Syl-Off® Q2-7785 코팅 라이너와 사용 권장'], '204 (400)'],
            ['7659 Adhesive / Syl-Off® 4000 Catalyst', ['Platinum', '백금'], ['Retains adhesion at high temperatures with minimum silicone left on the surface after tape removal; low cure temperatures', '고온에서 접착력 유지, 테이프 제거 후 표면 잔류 실리콘 최소; 낮은 경화 온도'], ['Lead-free solder masking and flexible substrates such as PTFE or polyimide; recommended for use with release liner coated with Syl-Off® Q2-7785', '무연 솔더 마스킹, PTFE·폴리이미드 등 연성 기재; Syl-Off® Q2-7785 코팅 라이너와 사용 권장'], '204 (400)'],
            ['280A Adhesive', ['Peroxide', '과산화물'], ['Good tack', '우수한 택'], ['Masking and plating tapes', '마스킹·도금 테이프'], '260 (500)'],
            ['282 Adhesive', ['Peroxide', '과산화물'], ['Good adhesion', '우수한 접착력'], ['Masking and plating tapes', '마스킹·도금 테이프'], '260 (500)'],
            ['7355 Adhesive', ['Peroxide', '과산화물'], ['High adhesion; good high-temperature performance; low silicone volatiles', '높은 접착력; 우수한 고온 성능; 낮은 실리콘 휘발분'], ['Masking, plating and splicing tapes', '마스킹·도금·스플라이싱 테이프'], '260 (500)'],
            ['7356 Adhesive', ['Peroxide', '과산화물'], ['Balanced tack and adhesion; good high-temperature performance; low silicone volatiles', '균형 잡힌 택과 접착력; 우수한 고온 성능; 낮은 실리콘 휘발분'], ['High-temperature masking, plating, electrical, plasma flame spray', '고온 마스킹, 도금, 전기, 플라즈마 용사'], '260 (500)'],
            ['7358 Adhesive', ['Peroxide', '과산화물'], ['High tack; good high-temperature performance; low silicone volatiles', '높은 택; 우수한 고온 성능; 낮은 실리콘 휘발분'], ['Electrical, plasma/flame-spray and high-temperature masking tapes', '전기, 플라즈마/화염 용사, 고온 마스킹 테이프'], '260 (500)'],
            ['Q2-7406 Adhesive', ['Peroxide', '과산화물'], ['General purpose adhesive with excellent high-temperature properties; meets FDA requirements for certain food-contact applications² and low silicone volatiles', '우수한 고온 특성의 범용 접착제; 일부 식품 접촉 용도 FDA 요건 충족²; 낮은 실리콘 휘발분'], ['Splicing and plating tapes', '스플라이싱·도금 테이프'], '288 (550)'],
            ['Q2-7566 Adhesive', ['Peroxide', '과산화물'], ['General purpose adhesive with excellent high-temperature properties', '우수한 고온 특성의 범용 접착제'], ['Electrical tapes and other very high-temperature tapes', '전기 테이프 및 기타 초고온 테이프'], '288 (550)'],
            ['Q2-7735 Adhesive', ['Peroxide', '과산화물'], ['Combines high tack and good adhesion', '높은 택과 우수한 접착력의 결합'], ['Recommended for use with release liner coated with Syl-Off® Q2-7785; transfer films and labels; masking, plating, splicing and electrical tapes', 'Syl-Off® Q2-7785 코팅 라이너와 사용 권장; 전사 필름·라벨; 마스킹·도금·스플라이싱·전기 테이프'], '232 (450)'],
          ],
          note: { en: '¹ 15 days, 1000 grams. ² Contact your Dow Corning representative for food contact information.', ko: '¹ 15일, 1000 g. ² 식품 접촉 정보는 다우코닝 담당자에게 문의.' },
        }),
    ],
    faq: [
      { q: { en: 'Which silicone PSA has the highest high-temperature hold?', ko: '고온 유지력이 가장 높은 실리콘 PSA는?' }, a: { en: 'Q2-7406 and Q2-7566 Adhesives, 288 °C (550 °F).', ko: 'Q2-7406과 Q2-7566 Adhesive로 288 °C(550 °F)입니다.' } },
      { q: { en: 'Which PSA suits lead-free solder masking?', ko: '무연 솔더 마스킹에는 어떤 PSA가 적합합니까?' }, a: { en: '7659 Adhesive with Syl-Off 4000 Catalyst, which retains adhesion at high temperature with minimum silicone residue.', ko: 'Syl-Off 4000 Catalyst를 사용하는 7659 Adhesive이며 고온에서 접착을 유지하고 잔류 실리콘이 최소입니다.' } },
    ],
  },

  {
    slug: 'tack-adhesion-hold-charts', no: 5, pdfPages: '5',
    title: { en: 'Relative Tack, Adhesion and High-Temperature Hold (Figures 1–3)', ko: '상대 택·접착력·고온 유지력 비교 (그림 1~3)' },
    summary: { en: 'Polyken probe tack, relative adhesion and comparative high-temperature hold (cohesive strength) of the Dow Corning silicone PSAs, with the expected value ranges.', ko: 'Polyken 프로브 택, 상대 접착력, 비교 고온 유지력(응집 강도) 그래프와 예상 값 범위.' },
    answer: {
      en: 'Expected Polyken probe tack is 600–1300 g (1-mil substrate) or 800–1500 g (2-mil). Expected adhesion is 30–45 oz/in (850–1290 g/in) on 1 mil and 45–65 oz/in (1290–1850 g/in) on 2 mil. Tack order in Figure 1 runs from 2013 (lowest) to 7657 (highest).',
      ko: '예상 Polyken 프로브 택은 1 mil 기재 600~1300 g, 2 mil 기재 800~1500 g입니다. 예상 접착력은 1 mil 30~45 oz/in(850~1290 g/in), 2 mil 45~65 oz/in(1290~1850 g/in)입니다. 그림 1의 택은 2013이 가장 낮고 7657이 가장 높습니다.',
    },
    image: IMG('psa-figures-1-3'),
    sections: [
      sec('figs', 'Figures 1–3', '그림 1~3',
        fig(IMG('psa-figures-1-3'), 'Figure 1. Polyken® Probe Tack; Figure 2. Adhesion; Figure 3. Comparative High-Temperature Hold (Cohesive Strength)', '그림 1. Polyken® 프로브 택; 그림 2. 접착력; 그림 3. 비교 고온 유지력(응집 강도)'),
        h('Figure 1 — relative tack (low → high)', '그림 1 — 상대 택 (낮음 → 높음)'),
        p('2013, Q2-7566, 7659, Q2-7406, 282, Q2-7735, 7355, 280A, 7358, 7356, 7657. Polyken Probe Tack values are expected to be in the range of 600–1300 g for a 1-mil substrate and 800–1500 g for a 2-mil substrate.',
          '2013, Q2-7566, 7659, Q2-7406, 282, Q2-7735, 7355, 280A, 7358, 7356, 7657 순(낮음 → 높음). Polyken 프로브 택은 1 mil 기재 600~1300 g, 2 mil 기재 800~1500 g 범위로 예상됩니다.'),
        h('Figure 2 — relative adhesion (low → high)', '그림 2 — 상대 접착력 (낮음 → 높음)'),
        p('7659, Q2-7566, 2013, Q2-7406, 282, Q2-7735, 7355, 280A, 7358, 7657, 7356. Adhesion values are expected to be in the range of 30–45 oz/in (850–1290 g/in) for a 1-mil substrate and 45–65 oz/in (1290–1850 g/in) for a 2-mil substrate.',
          '7659, Q2-7566, 2013, Q2-7406, 282, Q2-7735, 7355, 280A, 7358, 7657, 7356 순(낮음 → 높음). 접착력은 1 mil 기재 30~45 oz/in(850~1290 g/in), 2 mil 기재 45~65 oz/in(1290~1850 g/in) 범위로 예상됩니다.'),
        h('Figure 3 — comparative high-temperature hold', '그림 3 — 비교 고온 유지력'),
        p('Order shown on the chart: 7657, 7659, Q2-7735, 280A, 282, 7355, 7358, 7356, 2013, Q2-7566, Q2-7406 (temperature axis from −17.7 °C (0 °F) to 315 °C (600 °F)); see Table 2 for the numerical hold values.',
          '그래프 표시 순서: 7657, 7659, Q2-7735, 280A, 282, 7355, 7358, 7356, 2013, Q2-7566, Q2-7406 (온도 축 −17.7 °C(0 °F)~315 °C(600 °F)); 수치는 표 2 참조.')),
    ],
    faq: [
      { q: { en: 'Which PSA has the highest tack?', ko: '택이 가장 높은 PSA는?' }, a: { en: 'In Figure 1, 7657 Adhesive shows the highest relative probe tack.', ko: '그림 1에서 7657 Adhesive의 상대 프로브 택이 가장 높습니다.' } },
      { q: { en: 'What adhesion values should be expected?', ko: '예상되는 접착력 값은?' }, a: { en: '30–45 oz/in on 1-mil and 45–65 oz/in on 2-mil substrates.', ko: '1 mil 기재 30~45 oz/in, 2 mil 기재 45~65 oz/in입니다.' } },
    ],
  },

  {
    slug: 'processing-thickness-effects', no: 6, pdfPages: '6–7',
    title: { en: 'Processing Considerations: Substrate and Adhesive Thickness Effects (Figures 4–5)', ko: '가공 시 고려사항 – 기재 및 접착제 두께의 영향 (그림 4·5)' },
    summary: { en: 'Coating with toluene/xylene dilution, coat-weight control, blending peroxide-cure PSAs, and how backing and adhesive thickness change tack and adhesion.', ko: '톨루엔/자일렌 희석 도포, 코트 웨이트 관리, 과산화물 경화 PSA 블렌딩, 기재와 접착제 두께가 택·접착력에 미치는 영향.' },
    answer: {
      en: 'Silicone PSAs can be applied as supplied on conventional tape-coating equipment but are usually diluted with toluene, xylene or other nonpolar solvents; coat-weight control is critical. The thicker the cured adhesive coating, the higher the adhesion and tack, and the backing material also affects both.',
      ko: '실리콘 PSA는 일반 테이프 코팅 설비에 공급 상태로 도포할 수 있으나 대개 톨루엔·자일렌 등 비극성 용제로 희석합니다. 코트 웨이트 관리가 중요하며, 경화 접착층이 두꺼울수록 접착력과 택이 높아지고 기재 종류도 영향을 줍니다.',
    },
    image: IMG('psa-fig4-thickness'),
    sections: [
      sec('processing', 'Processing and Curing Considerations', '가공 및 경화 시 고려사항',
        p('Silicone PSAs from Dow Corning can be applied to backing materials as supplied using conventional tape coating equipment. However, they are most often diluted with toluene, xylene or other nonpolar solvents to achieve a coatable viscosity. Coat weight control is critical for consistent performance. In addition, peroxide-cure silicone PSAs from Dow Corning may be blended with other dimethyl-type silicone PSAs to modify the performance of the cured coating.',
          '다우코닝 실리콘 PSA는 일반 테이프 코팅 설비를 사용해 공급 상태 그대로 기재에 도포할 수 있습니다. 그러나 코팅 가능한 점도를 얻기 위해 톨루엔, 자일렌 등 비극성 용제로 희석하는 경우가 대부분입니다. 일관된 성능을 위해 코트 웨이트 관리가 중요합니다. 또한 과산화물 경화 실리콘 PSA는 다른 디메틸형 실리콘 PSA와 블렌딩해 경화 도막의 성능을 조절할 수 있습니다.'),
        h('Effects of substrate variation and adhesive thickness', '기재 변화와 접착제 두께의 영향'),
        p('The backing material to which a silicone PSA is applied affects its tack and adhesion values. Adhesive thickness also affects adhesive performance: the thicker the cured adhesive coating, the higher the adhesion and tack. See Figures 1, 2, 4 and 5.',
          'PSA를 도포하는 기재(backing)는 택과 접착력에 영향을 줍니다. 접착제 두께도 성능에 영향을 주어, 경화된 접착 도막이 두꺼울수록 접착력과 택이 높아집니다. 그림 1, 2, 4, 5 참조.'),
        fig(IMG('psa-fig4-thickness'), 'Figure 4. Effect of substrate and adhesive thickness on initial adhesive strength. Tapes made with Dow Corning 280A Adhesive and different backing materials; adhesive cure: 5 minutes at 150 °C (300 °F); catalyst: 1.0% powdered benzoyl peroxide based on weight of adhesive solids; adhesive strength per ASTM D 1000.', '그림 4. 기재 및 접착제 두께가 초기 접착 강도에 미치는 영향. 280A Adhesive와 다양한 기재로 제작한 테이프; 경화: 150 °C(300 °F) 5분; 촉매: 접착제 고형분 기준 분말 과산화벤조일 1.0%; 접착 강도는 ASTM D 1000 기준.'),
        fig(IMG('psa-fig5-thickness-adhesion'), 'Figure 5. Effect of adhesive thickness on adhesion and tack. Tapes made from 280A Adhesive; cure: 1 minute at 65 °C (150 °F) followed by 2 minutes at 177 °C (350 °F) for Mylar®, 2 minutes at 204 °C (400 °F) for Teflon®; adhesion per PSTC-1; Polyken® tack: 0.5 s dwell, 0.5 cm/s draw speed.', '그림 5. 접착제 두께가 접착력·택에 미치는 영향. 280A Adhesive 테이프; 경화: 65 °C(150 °F) 1분 후 Mylar®는 177 °C(350 °F) 2분, Teflon®는 204 °C(400 °F) 2분; 접착력 PSTC-1; Polyken® 택: 접촉 0.5초, 인장 속도 0.5 cm/s.')),
    ],
    faq: [
      { q: { en: 'How are silicone PSAs usually coated?', ko: '실리콘 PSA는 보통 어떻게 도포합니까?' }, a: { en: 'On conventional tape coating equipment, typically diluted with toluene, xylene or another nonpolar solvent to reach a coatable viscosity.', ko: '일반 테이프 코팅 설비로, 보통 톨루엔·자일렌 등 비극성 용제로 희석해 코팅 가능한 점도로 만들어 도포합니다.' } },
      { q: { en: 'Does a thicker PSA layer raise adhesion?', ko: '접착층이 두꺼우면 접착력이 높아집니까?' }, a: { en: 'Yes — the thicker the cured coating, the higher the adhesion and tack.', ko: '예. 경화 도막이 두꺼울수록 접착력과 택이 높아집니다.' } },
    ],
  },

  {
    slug: 'platinum-cure-process', no: 7, pdfPages: '6',
    title: { en: 'Platinum-Cure Process: Catalyst, Bath Life and Cure Speed', ko: '백금 경화 공정 – 촉매, 배스 수명, 경화 속도' },
    summary: { en: 'Syl-Off 4000 Catalyst addition, 24-hour bath life, vented continuous ovens from 80 °C, typical cure speeds and contamination precautions.', ko: 'Syl-Off 4000 Catalyst 첨가, 24시간 배스 수명, 80 °C 이상 연속 오븐, 일반 경화 속도와 오염 방지 주의사항.' },
    answer: {
      en: 'Platinum-cure adhesives need Syl-Off 4000 Catalyst to develop PSA properties; use the bath within 24 hours. Cure in vented continuous coating ovens from 80 °C (176 °F); on polyester or polyolefin films typical cure is 2 minutes at 100 °C (212 °F) to 1 minute at 125 °C (257 °F). Changing the catalyst level has little impact on tack, adhesion or cohesive strength. Clean equipment thoroughly and use dedicated new containers.',
      ko: '백금 경화 접착제는 PSA 특성을 내려면 Syl-Off 4000 Catalyst가 필요하며 24시간 이내에 사용해야 합니다. 배기형 연속 코팅 오븐에서 80 °C(176 °F)부터 경화되고, 폴리에스터·폴리올레핀 필름에서는 100 °C 2분~125 °C 1분이 일반적입니다. 촉매량 변경은 택·접착력·응집력에 거의 영향이 없습니다. 장비를 철저히 세척하고 전용 신규 용기를 사용해야 합니다.',
    },
    image: IMG('psa-flowchart'),
    sections: [
      sec('pt', 'Platinum Cure', '백금 경화',
        p('Dow Corning® platinum-cure adhesives require the addition of a platinum catalyst (Syl-Off® 4000 Catalyst) to develop PSA properties. The coating bath should be used within 24 hours of catalyst addition. These adhesives can be cured in vented, continuous coating ovens at temperatures as low as 80 °C (176 °F). When coated onto flexible substrates such as polyester or polyolefin films, typical cure speeds range from 2 minutes at 100 °C (212 °F) to 1 minute at 125 °C (257 °F). If cure speed needs to be increased or process oven temperatures lowered, the catalyst level can be increased. Changing the catalyst level has little impact on the tack, adhesion or cohesive strength of the cured adhesive.',
          'Dow Corning® 백금 경화 접착제는 PSA 특성을 발현하기 위해 백금 촉매(Syl-Off® 4000 Catalyst)를 첨가해야 합니다. 코팅 배스는 촉매 첨가 후 24시간 이내에 사용해야 합니다. 이 접착제는 배기형 연속 코팅 오븐에서 80 °C(176 °F)까지 낮은 온도로 경화할 수 있습니다. 폴리에스터나 폴리올레핀 필름 같은 연성 기재에 도포하면 일반적인 경화 속도는 100 °C(212 °F) 2분에서 125 °C(257 °F) 1분 범위입니다. 경화 속도를 높이거나 오븐 온도를 낮춰야 하면 촉매량을 늘릴 수 있으며, 촉매량 변경은 경화 접착제의 택·접착력·응집력에 거의 영향을 주지 않습니다.'),
        p('Note: Because the catalyst is subject to contamination by peroxide and other materials, mixing and coating equipment must be thoroughly cleaned, and dedicated new containers should be used for mixing.',
          '참고: 촉매는 과산화물 및 기타 물질에 의해 오염될 수 있으므로 혼합·코팅 장비를 철저히 세척해야 하며, 혼합에는 전용 신규 용기를 사용해야 합니다.')),
    ],
    faq: [
      { q: { en: 'What catalyst do platinum-cure Dow Corning PSAs use?', ko: '백금 경화 PSA에는 어떤 촉매를 씁니까?' }, a: { en: 'Syl-Off 4000 Catalyst; use the bath within 24 hours of addition.', ko: 'Syl-Off 4000 Catalyst이며 첨가 후 24시간 이내에 배스를 사용해야 합니다.' } },
      { q: { en: 'How can cure speed be raised?', ko: '경화 속도를 높이려면?' }, a: { en: 'Increase the catalyst level; this has little effect on tack, adhesion or cohesive strength.', ko: '촉매량을 늘리면 되며 택·접착력·응집력에는 거의 영향이 없습니다.' } },
    ],
  },

  {
    slug: 'peroxide-cure-process', no: 8, pdfPages: '6–8',
    title: { en: 'Peroxide-Cure Process: Benzoyl Peroxide Level, Solvent Removal and Heat Cure (Figure 6)', ko: '과산화물 경화 공정 – 과산화벤조일 농도, 용제 제거, 열 경화 (그림 6)' },
    summary: { en: 'Benzoyl peroxide at 0.5–3.0% of solids, 10% toluene solution, two-step graded cure (65–93 °C solvent removal, then 177–204 °C), and alternative tin or silane cure options.', ko: '고형분 기준 과산화벤조일 0.5~3.0%, 10% 톨루엔 용액, 2단계 구배 경화(65~93 °C 용제 제거 후 177~204 °C), 주석 촉매·실란 대체 경화.' },
    answer: {
      en: 'Peroxide concentration (benzoyl peroxide) can be varied from 0.5 to 3.0% of adhesive solids; more peroxide lowers tack and adhesion and raises cohesive strength. Use powdered 98% benzoyl peroxide as a 10% toluene solution and use the bath within a day. Cure in two steps: solvent removal at 65–93 °C (150–200 °F), then typically 1 minute at 66 °C followed by 2 minutes at 177–204 °C (350–400 °F).',
      ko: '과산화벤조일 농도는 접착제 고형분 기준 0.5~3.0%로 조절할 수 있으며, 농도가 높을수록 택과 접착 강도는 낮아지고 응집력은 높아집니다. 분말 98% 과산화벤조일을 톨루엔 10% 용액으로 만들어 사용하고 배스는 하루 이내에 사용합니다. 경화는 65~93 °C(150~200 °F) 용제 제거 후 보통 66 °C 1분 → 177~204 °C(350~400 °F) 2분의 2단계로 진행합니다.',
    },
    image: IMG('psa-fig6-peroxide'),
    sections: [
      sec('px', 'Peroxide Cure', '과산화물 경화',
        p('To achieve a good balance of tack, adhesive strength and cohesive strength over a wide range of operating temperatures, proper cure is essential. The catalyst most typically used with silicone PSAs is benzoyl peroxide. Peroxide concentration can be varied from 0.5 to 3.0 percent (based on adhesive solids). Increasing peroxide concentration will decrease the tack and adhesive strength of the cured coating, but will increase its cohesive strength (see Figure 6). The most consistent results are achieved by using the powdered, 98 percent benzoyl peroxide. Complete blending of peroxide and adhesive is best obtained by making a 10 percent solution of the peroxide in toluene. If a catalyst is added, the coating bath should be used within a day after mixing, as the peroxide loses its activity quite rapidly in solvent. Thorough dispersion of the adhesive and peroxide during mixing is necessary to achieve uniform results in the finished product.',
          '넓은 사용 온도 범위에서 택·접착 강도·응집력의 균형을 얻으려면 올바른 경화가 필수입니다. 실리콘 PSA에 가장 일반적으로 쓰이는 촉매는 과산화벤조일입니다. 과산화물 농도는 접착제 고형분 기준 0.5~3.0%로 조절할 수 있으며, 농도를 높이면 경화 도막의 택과 접착 강도는 낮아지고 응집력은 높아집니다(그림 6). 가장 일관된 결과는 분말 98% 과산화벤조일로 얻어지며, 과산화물과 접착제의 완전한 혼합은 톨루엔에 과산화물 10% 용액을 만들어 사용하는 것이 가장 좋습니다. 촉매를 첨가한 경우 과산화물은 용제 속에서 활성이 빠르게 감소하므로 혼합 후 하루 이내에 코팅 배스를 사용해야 합니다. 최종 제품의 균일성을 위해 혼합 시 접착제와 과산화물을 충분히 분산시켜야 합니다.'),
        fig(IMG('psa-fig6-peroxide'), 'Figure 6. Effect of peroxide level on adhesion and tack. Tapes made from 280A Adhesive; adhesive thickness 1.5 mil; cure: 1 minute at 65 °C (150 °F) followed by 2 minutes at 177 °C (350 °F) for Mylar®, 2 minutes at 204 °C (400 °F) for Teflon®; adhesion per PSTC-1; Polyken® tack: 0.5 s dwell, 0.5 cm/s draw speed.', '그림 6. 과산화물 농도가 접착력과 택에 미치는 영향. 280A Adhesive 테이프; 접착층 두께 1.5 mil; 경화: 65 °C(150 °F) 1분 후 Mylar®는 177 °C(350 °F) 2분, Teflon®는 204 °C(400 °F) 2분; 접착력 PSTC-1; Polyken® 택: 접촉 0.5초, 인장 속도 0.5 cm/s.')),
      sec('two-step', 'Two-step cure: solvent removal and heat cure', '2단계 경화 — 용제 제거와 열 경화',
        p('Curing the adhesive is a two-step process that requires the use of graded temperatures.',
          '접착제 경화는 구배 온도를 사용하는 2단계 공정입니다.'),
        h('Solvent removal', '용제 제거'),
        p('The first step in curing the adhesive, following its application to the backing material, is solvent removal. Recommended temperatures for solvent removal range from 65 to 93 °C (150 to 200 °F). Higher removal temperatures can cause the peroxide to decompose prematurely and crosslink the solvent into the adhesive. This can reduce the properties of the finished tape. The length of time for solvent removal should be sufficient to ensure that no solvent is present in the adhesive when it enters the curing zone.',
          '기재에 도포한 뒤 첫 단계는 용제 제거입니다. 권장 용제 제거 온도는 65~93 °C(150~200 °F)입니다. 더 높은 온도에서는 과산화물이 조기 분해되어 용제가 접착제에 가교될 수 있고, 이는 완제품 테이프의 물성을 저하시킵니다. 용제 제거 시간은 경화 구역에 들어갈 때 접착제 내에 용제가 남지 않도록 충분해야 합니다.'),
        h('Heat cure', '열 경화'),
        p('After the solvent is removed, a tacky, uniform film of adhesive is left on the backing. This film’s adhesive and cohesive strengths, as well as the tack, can be further developed by a heat cure. The amount of cure depends on a number of factors, including the type of catalyst or equipment and backing material. A cure of 1 minute at 66 °C (150 °F) for solvent removal, followed by 2 minutes at 177 to 204 °C (350 to 400 °F) is typically used for adhesives that contain benzoyl peroxide. If equipment and type of backing material permit the use of higher curing temperatures, the cure time may be shortened. Higher cure temperatures develop cohesive strength of the adhesive in less time than at lower temperatures. The ultimate adhesive strength of the fully cured material is essentially the same whether cured at higher or lower temperatures. The only difference is the time required to reach complete cure.',
          '용제가 제거되면 기재 위에 끈적하고 균일한 접착 필름이 남습니다. 이 필름의 접착 강도, 응집력, 택은 열 경화로 더 발현시킬 수 있습니다. 경화 정도는 촉매·설비·기재 종류 등 여러 요인에 따라 달라집니다. 과산화벤조일을 함유한 접착제에는 보통 66 °C(150 °F) 1분(용제 제거) 후 177~204 °C(350~400 °F) 2분 경화를 사용합니다. 설비와 기재가 더 높은 경화 온도를 허용하면 경화 시간을 단축할 수 있습니다. 높은 온도는 낮은 온도보다 짧은 시간에 응집력을 발현시키며, 완전 경화된 재료의 최종 접착 강도는 경화 온도에 관계없이 본질적으로 같고 완전 경화에 필요한 시간만 다릅니다.')),
      sec('alt', 'Alternative cure options', '대체 경화 방법',
        p('Peroxide-cure silicone PSAs will develop basic PSA properties without the addition of a catalyst. Simple solvent removal followed by heat cure may be desirable for some low-temperature bonding applications. However, this procedure is not commonly used in the production of pressure sensitive adhesive tapes. Alternatively, a tin catalyst or a silane coupling agent, such as Dow Corning® Z-6020 Silane, may also be used. These options will produce a PSA that bonds well and offers good adhesive strength in low-temperature applications. However, the high-temperature performance of these materials will be inferior to those cured with peroxide and will continue to cure until dry.',
          '과산화물 경화 실리콘 PSA는 촉매를 첨가하지 않아도 기본적인 PSA 특성을 발현합니다. 일부 저온 접착 용도에서는 용제 제거 후 열 경화만 하는 방법이 바람직할 수 있으나, 감압 접착 테이프 생산에는 일반적으로 사용되지 않습니다. 대안으로 주석 촉매나 Dow Corning® Z-6020 실란 같은 실란 커플링제를 사용할 수 있으며, 이 경우 저온 용도에서 접착이 좋고 접착 강도가 우수한 PSA가 되지만 고온 성능은 과산화물 경화품보다 떨어지고 건조될 때까지 계속 경화됩니다.')),
    ],
    faq: [
      { q: { en: 'What peroxide level is used for silicone PSAs?', ko: '실리콘 PSA에 쓰는 과산화물 농도는?' }, a: { en: 'Benzoyl peroxide, 0.5–3.0% based on adhesive solids; higher levels lower tack and adhesive strength but raise cohesive strength.', ko: '접착제 고형분 기준 과산화벤조일 0.5~3.0%이며, 높을수록 택·접착 강도는 낮아지고 응집력은 높아집니다.' } },
      { q: { en: 'What temperature should solvent be removed at?', ko: '용제 제거 온도는?' }, a: { en: '65–93 °C (150–200 °F); higher temperatures can decompose the peroxide prematurely.', ko: '65~93 °C(150~200 °F)이며 더 높으면 과산화물이 조기 분해될 수 있습니다.' } },
    ],
  },

  {
    slug: 'oven-dusting-anchorage-release', no: 9, pdfPages: '8–9',
    title: { en: 'Oven Dusting, Anchorage Primers and Release (Syl-Off Q2-7785)', ko: '오븐 분진, 앵커리지(프라이머), 이형 (Syl-Off Q2-7785)' },
    summary: { en: 'How to reduce oven dusting from volatile silicone, improve anchorage to PET/Kapton/Teflon with primers or 0.25–0.5% Z-6020 silane, and the Syl-Off Q2-7785 fluorosilicone release coating and its applications.', ko: '휘발성 실리콘에 의한 오븐 분진 저감, 프라이머 또는 Z-6020 실란 0.25~0.5% 첨가로 앵커리지 개선, Syl-Off Q2-7785 불소실리콘 이형 코팅제와 용도.' },
    answer: {
      en: 'Reduce oven dusting by choosing PSAs with lower volatile silicone (7355, 7358) and using ramped oven zones. Improve anchorage with a primer, or add 0.25–0.5% Z-6020 silane (based on active adhesive weight), which reduces tack and may shorten shelf life or high-temperature properties. For release use Syl-Off Q2-7785 fluorosilicone coating; Q2-7735 and platinum-cure adhesives give consistent, stable release when wet-cast on it.',
      ko: '오븐 분진은 휘발성 실리콘이 적은 PSA(7355, 7358)를 선택하고 점진적으로 온도가 오르는 오븐 구역(ramped zones)을 사용해 줄입니다. 앵커리지는 프라이머 또는 활성 접착제 중량 기준 Z-6020 실란 0.25~0.5% 첨가로 개선하며, 택이 낮아지고 보관 수명·고온 특성이 짧아질 수 있습니다. 이형은 Syl-Off Q2-7785 불소실리콘 코팅제를 사용하며 Q2-7735와 백금 경화 접착제를 습식 캐스팅하면 일관되고 안정적인 이형을 얻습니다.',
    },
    image: IMG('psa-cover-race'),
    sections: [
      sec('dust', 'Oven dusting', '오븐 분진 (Oven Dusting)',
        p('The evaporation of volatile silicone in the curing oven can cause the formation of oven dust. The problem is typical in solvent incineration or air-recirculating direct-fired ovens and is especially prevalent in ovens that deliver too much heat too soon in the cure process. Two ways to reduce the problem are to: 1. Select silicone PSAs with lower volatile silicone content; Dow Corning 7355 Adhesive or Dow Corning 7358 Adhesive are two examples. 2. Use ramped oven zones – oven zones with temperatures that get progressively hotter.',
          '경화 오븐에서 휘발성 실리콘이 증발하면 오븐 분진이 생길 수 있습니다. 이 문제는 용제 소각식 또는 공기 순환 직화식 오븐에서 흔하며, 경화 초기에 열을 너무 빨리 많이 가하는 오븐에서 특히 심합니다. 줄이는 방법은 두 가지입니다. 1. 휘발성 실리콘 함량이 낮은 실리콘 PSA(예: 7355, 7358 Adhesive)를 선택. 2. 온도가 점진적으로 높아지는 오븐 구역(ramped zones)을 사용.')),
      sec('anchor', 'Anchorage', '앵커리지 (기재 밀착)',
        p('When silicone PSAs are used in the manufacture of self-wound tapes or laminate constructions with backings such as polyester, Kapton®, Teflon® and other plastic films, the use of a primer may be required to improve anchorage of the cured adhesive to the backing. Good anchorage reduces the possibility of adhesive transfer during unwind, and ensures clean slitting operations and clean removability following masking. For suggested primers and sample formulations contact your Dow Corning representative. If the application of a primer coat is not possible, anchorage to backing can be improved by adding 0.25 to 0.5 percent of a silane coupling agent, such as Dow Corning Z-6020 Silane, based on active adhesive weight. However, silane addition will reduce the tack of the cured adhesive and may shorten the shelf life or high-temperature properties of the tape.',
          '실리콘 PSA를 폴리에스터, Kapton®, Teflon® 등 플라스틱 필름 기재의 자기 권취 테이프나 라미네이트 구조에 사용할 때는 경화 접착제의 기재 밀착을 높이기 위해 프라이머가 필요할 수 있습니다. 좋은 앵커리지는 풀림(unwind) 시 접착제 전이 가능성을 줄이고, 깨끗한 슬리팅과 마스킹 후 깨끗한 제거를 보장합니다. 권장 프라이머와 배합 예는 담당자에게 문의하십시오. 프라이머 도포가 불가능하면 활성 접착제 중량 기준 Z-6020 실란 같은 실란 커플링제를 0.25~0.5% 첨가해 앵커리지를 개선할 수 있으나, 경화 접착제의 택이 낮아지고 테이프의 보관 수명이나 고온 특성이 짧아질 수 있습니다.')),
      sec('release', 'Release of silicone PSAs', '실리콘 PSA의 이형',
        p('Dow Corning offers a fluorosilicone silicone release coating (Syl-Off® Q2-7785 Coating) suitable for manufacturing release liners for industrial-grade silicone PSAs. The release characteristics of liner made with Syl-Off Q2-7785 Coating depend on the specific silicone PSA used and how it is cured. Dow Corning Q2-7735 Adhesive and Dow Corning platinum-cure adhesives provide consistent, stable release when wet-cast on this liner. Refer to the Syl-Off Q2-7785 Coating data sheet for processing and performance details. Other silicone PSAs from Dow Corning have also been successfully dry laminated (transfer coated) to this release system.',
          '다우코닝은 산업용 실리콘 PSA용 이형 라이너 제조에 적합한 불소실리콘 이형 코팅제(Syl-Off® Q2-7785 Coating)를 제공합니다. Syl-Off Q2-7785로 만든 라이너의 이형 특성은 사용하는 실리콘 PSA와 경화 방법에 따라 달라집니다. Q2-7735 Adhesive와 백금 경화 접착제는 이 라이너에 습식 캐스팅할 때 일관되고 안정적인 이형을 제공합니다. 가공·성능 세부 사항은 Syl-Off Q2-7785 데이터시트를 참조하십시오. 다른 다우코닝 실리콘 PSA도 이 이형 시스템에 건식 라미네이션(전사 코팅)에 성공적으로 사용되었습니다.'),
        h('Applications for Syl-Off Q2-7785 Coating', 'Syl-Off Q2-7785 Coating 용도'),
        ul(
          ['Silicone PSA labels for automotive and aerospace applications, equipment labels and other die-cut applications', '자동차·항공우주용 실리콘 PSA 라벨, 장비 라벨 및 기타 다이컷 용도'],
          ['Silicone PSA transfer tapes', '실리콘 PSA 전사 테이프'],
          ['Wider silicone tapes using release liner or backsize', '이형 라이너 또는 백사이즈를 사용하는 광폭 실리콘 테이프'],
          ['Double-sided tapes', '양면 테이프'],
          ['Single or double-sided silicone rubber, foam or sponge insulation', '단면·양면 실리콘 고무, 폼, 스펀지 단열재'],
          ['Die-cut shapes for spot protection', '부분 보호용 다이컷 형상'],
        )),
      sec('contact', 'Technical assistance and KCT inquiries', '기술 지원 및 문의',
        p('Technical assistance is available from your Dow Corning technical or sales representative. Note: Dow Corning silicone products are now marketed under the DOWSIL™ brand; the guide’s product names are given here as in the original (Form No. 30-083B-01) and availability or naming may differ today. The information in the original guide is offered in good faith but should not substitute for the customer’s own tests.',
          '다우코닝 기술·영업 담당자를 통해 기술 지원을 받을 수 있습니다. 참고: 다우코닝 실리콘 제품은 현재 DOWSIL™ 브랜드로 판매되며, 이 페이지의 제품명은 원문(Form No. 30-083B-01)을 그대로 따르므로 현재의 제품명·공급 여부는 다를 수 있습니다. 원문 정보는 선의로 제공된 것이며 고객 자체 시험을 대체할 수 없습니다.'),
        p('국내 문의: 한국건설트레이딩 — sales@kconstrade.com, 010-8939-0284 (서울 송파구 충민로 10 가든파이브툴 4-A19).',
          'Korea inquiries: Korea Construction Trading (KCT) — sales@kconstrade.com, +82 10-8939-0284 (Garden Five Tools 4-A19, 10 Chungmin-ro, Songpa-gu, Seoul).')),
    ],
    faq: [
      { q: { en: 'How can anchorage of silicone PSA to PET or polyimide film be improved?', ko: '실리콘 PSA의 PET·폴리이미드 필름 앵커리지를 높이려면?' }, a: { en: 'Use a primer, or add 0.25–0.5% silane coupling agent such as Z-6020 (based on active adhesive weight), accepting lower tack.', ko: '프라이머를 쓰거나 활성 접착제 중량 기준 Z-6020 같은 실란 커플링제를 0.25~0.5% 첨가합니다. 단, 택이 낮아집니다.' } },
      { q: { en: 'What liner release coating is recommended?', ko: '권장 이형 코팅제는?' }, a: { en: 'Syl-Off Q2-7785 fluorosilicone release coating; Q2-7735 and platinum-cure PSAs give stable release when wet cast.', ko: 'Syl-Off Q2-7785 불소실리콘 이형 코팅제이며 Q2-7735와 백금 경화 PSA를 습식 캐스팅하면 안정적으로 이형됩니다.' } },
    ],
  },
]
