import { TechPage, p, h, ul, fig, figs, note, sec, IMG } from './types'

const DISCLAIMER_EN = 'These are typical properties, not to be construed as specifications.'
const DISCLAIMER_KO = '표에 기재된 값은 대표 물성이며 규격(시방) 값으로 해석해서는 안 됩니다.'

export const PAGES_B: TechPage[] = [
  // ─────────────────────────── 6. Fire resistance
  {
    slug: 'fire-resistance', no: 6, pdfPages: '9–11',
    title: { en: 'Fire Resistance', ko: '내화 성능 (Fire Resistance)' },
    summary: {
      en: 'Compartmentation, linear joints and penetrations, the integrity (E) and insulation (I) criteria, and the EN / BS / UL / ASTM test standards.',
      ko: '방화구획, 선형 줄눈과 관통부, 차염성(E)·차열성(I) 기준, EN·BS·UL·ASTM 시험 규격.',
    },
    image: IMG('fig11-compartmentation'),
    sections: [
      sec('overview', 'Overview', '개요',
        p('Fire resistance is intended to control the spread of fire once it has developed. Appropriate levels of fire resistance can increase the time needed for the fire to spread to higher floors and adjacent buildings. This can limit building and material loss from the fire, aid fire fighters in the evacuation of occupants and assist in the efficiency of fighting the fire.',
          '내화 성능은 화재가 발달한 이후 그 확산을 제어하기 위한 것입니다. 적절한 수준의 내화 성능은 화재가 상층부와 인접 건물로 번지는 데 필요한 시간을 늘려 줍니다. 이는 화재로 인한 건물과 재산의 손실을 제한하고, 소방관의 거주자 대피를 돕고, 화재 진압의 효율을 높이는 데 도움이 됩니다.'),
        p('Buildings are typically sub-divided into discrete compartments specifically intended to limit the passage of flames, smoke or heat and prevent the spread of fire to adjacent rooms. These compartments are designed to give occupants enough time to safely evacuate and increase safety margins for fire fighters. A fire compartment consists of fire-resistant walls, floors and doors. Compartment walls and floors form a complete barrier between each unit and are required to provide a minimum degree of fire resistance.',
          '건물은 일반적으로 화염, 연기, 열의 통과를 제한하고 인접한 실로의 화재 확산을 막기 위한 별개의 구획(compartment)으로 나뉩니다. 이 구획은 거주자가 안전하게 대피할 충분한 시간을 주고 소방관의 안전 여유를 높이도록 설계됩니다. 방화구획은 내화 벽, 바닥, 문으로 구성됩니다. 구획 벽과 바닥은 각 단위 사이에 완전한 차단벽을 형성하며 최소한의 내화 성능을 제공해야 합니다.'),
        fig(IMG('fig11-compartmentation'), 'Figure 11: Compartmentation in buildings: fire rated walls and floors prevent the spread of fire (flames, hot gases and smoke) to adjacent rooms',
          '그림 11: 건물의 방화구획: 내화 벽과 바닥이 화재(화염, 뜨거운 가스, 연기)가 인접한 실로 확산되는 것을 막습니다.'),
        p('Linear joints and openings in and between fire-separating elements should be sealed with fire retardant materials to maintain the continuity of fire resistance of construction components (wall, floor, door, windows) and be able to achieve the same fire rating as adjacent building elements. The linear joints are prone to thermal movement (shrinking or expanding) during the fire and should stay fully functional. These linear joints can appear either as horizontal or vertical joints in a wall, between walls, between floors or at the connection wall to ceiling/floor.',
          '방화 구획 부재 내부 및 부재 사이의 선형 줄눈과 개구부는 건축 구성 요소(벽, 바닥, 문, 창)의 내화 성능이 연속되도록, 그리고 인접한 건축 요소와 동일한 내화 등급을 달성할 수 있도록 내화(방염) 재료로 실링해야 합니다. 선형 줄눈은 화재 중 열에 의한 움직임(수축 또는 팽창)을 겪기 쉬우므로 완전한 기능을 유지해야 합니다. 이러한 선형 줄눈은 벽의 수평 또는 수직 줄눈, 벽과 벽 사이, 바닥과 바닥 사이, 또는 벽과 천장/바닥의 접합부에 나타날 수 있습니다.'),
        fig(IMG('fig12-linear-joint-types'), 'Figure 12: Possible linear joint applications between walls (A), in walls (B, C), between a wall abutting a ceiling (D) and a floor abutting a wall (E)',
          '그림 12: 선형 줄눈이 적용될 수 있는 위치: 벽과 벽 사이(A), 벽 내부(B, C), 천장에 접한 벽(D), 벽에 접한 바닥(E)'),
        p('The walls and floors of a fire compartment can also have openings through which pipes and cables are fed. A fire compartment is not complete until all these openings have been sealed safely using the correct materials.',
          '방화구획의 벽과 바닥에는 배관과 케이블이 통과하는 개구부도 있을 수 있습니다. 이러한 모든 개구부가 올바른 재료로 안전하게 밀봉되기 전에는 방화구획이 완성된 것이 아닙니다.'),
        fig(IMG('fig13-penetrants'), 'Figure 13: Illustration of different possible penetrant types (eg A1, A2, A3, B, C1, C2) and configurations. The opening’s dimensions (w,h), the distance from the penetrant to the edge of the opening (a1), the distance between different penetrants (a2) all influence the fire performance.',
          '그림 13: 관통체(penetrant)의 다양한 유형(예: A1, A2, A3, B, C1, C2)과 배치 예시. 개구부의 치수(w, h), 관통체에서 개구부 가장자리까지의 거리(a1), 관통체 사이의 거리(a2)가 모두 내화 성능에 영향을 줍니다.')),
      sec('criteria', 'Integrity (E) and insulation (I)', '차염성(E)과 차열성(I)',
        figs(
          { src: IMG('fig14a-integrity'), en: 'Figure 14: E – Integrity. Separation function: prevent the passage of flames and hot gases to the unexposed side', ko: '그림 14: E – 차염성(Integrity). 분리 기능: 화염과 뜨거운 가스가 비가열면으로 통과하는 것을 방지' },
          { src: IMG('fig14b-insulation'), en: 'Figure 14: I – Insulation. Insulating function: prevent the increase of temperature on the non-exposed side', ko: '그림 14: I – 차열성(Insulation). 단열 기능: 비가열면의 온도 상승을 방지' },
        ),
        p('In Europe, the relevant standard for testing and classifying the fire resistance of linear joints and penetration seals are respectively the EN1366 testing standard (part 3 and part 4) and the EN13501-2 classification standard. The construction elements are tested within a gas fired furnace which simulates a fire within an enclosed room. The evaluated elements can be mounted on a wall or a floor and the temperature within the furnace rises sharply then gradually starts to level out. Thermocouples (temperature sensors) within the furnace monitor the temperature during the test to ensure the average temperature follows the correct curve. Thermocouples on the tested material follow its temperature increase. The test will assess the integrity (E) and insulation (I) capacity of the seals.',
          '유럽에서 선형 줄눈과 관통부 실링의 내화 성능을 시험하고 분류하는 데 관련된 규격은 각각 EN1366 시험 규격(제3부, 제4부)과 EN13501-2 분류 규격입니다. 건축 부재는 밀폐된 실내의 화재를 모사하는 가스 가열로 안에서 시험됩니다. 평가 대상 부재는 벽 또는 바닥에 장착할 수 있으며, 가열로 내부 온도는 급격히 상승한 뒤 점차 완만해집니다. 가열로 내부의 열전대(온도 센서)는 시험 중 평균 온도가 올바른 곡선을 따르는지 감시하며, 시험 재료에 설치된 열전대는 그 온도 상승을 추적합니다. 이 시험은 실링의 차염성(E)과 차열성(I)을 평가합니다.'),
        p('The integrity (E) defines the separation function and hence the capability of a building element, when exposed to fire on one side, to prevent the passage of flames, smoke and hot gases to the unexposed side. The integrity (E) failure is deemed to occur:',
          '차염성(E)은 분리 기능, 즉 건축 부재의 한쪽 면이 화재에 노출되었을 때 화염, 연기, 뜨거운 가스가 비가열면으로 통과하는 것을 막는 능력을 정의합니다. 차염성(E) 상실은 다음의 경우에 발생한 것으로 봅니다.'),
        ul(
          ['when collapse or sustained flaming (more than 10s) on the unexposed face of the element occurs', '부재가 붕괴하거나 비가열면에서 지속적인 화염(10초 초과)이 발생하는 경우'],
          ['when openings form and allow flames or hot gases to cause flaming or glowing of a cotton fibre pad, when applied for a maximum of 30s', '개구부가 생겨 화염이나 뜨거운 가스가 최대 30초간 적용한 면 패드(cotton fibre pad)를 발화 또는 작열시키는 경우'],
          ['when a 6mm diameter gap gauge can penetrate through a gap into the furnace and be moved in the gap for a distance of at least 150mm', '직경 6mm 틈새 게이지가 틈을 통해 가열로 안으로 관통하여 틈 안에서 150mm 이상 이동할 수 있는 경우'],
          ['when a 25mm diameter gap gauge can penetrate through a gap into the furnace', '직경 25mm 틈새 게이지가 틈을 통해 가열로 안으로 관통할 수 있는 경우'],
        ),
        p('The thermal insulating separation function (I) describes the capability of a building element to maintain its required thermal insulation separating function in case of fire. Failure is deemed to occur:',
          '열 차단 분리 기능(I)은 화재 시 건축 부재가 요구되는 단열 분리 기능을 유지하는 능력을 의미합니다. 차열성 상실은 다음의 경우에 발생한 것으로 봅니다.'),
        ul(
          ['when the mean unexposed face temperature increases by more than 140°C above its initial value', '비가열면의 평균 온도가 초기값보다 140°C 넘게 상승하는 경우'],
          ['when the temperature recorded at any position (including the roving thermocouple) on the unexposed face is in excess of 180°C above the initial mean unexposed face temperature', '비가열면의 어느 위치(이동식 열전대 포함)에서든 기록된 온도가 초기 평균 비가열면 온도보다 180°C를 초과하는 경우'],
          ['when integrity failure occurs', '차염성이 상실되는 경우'],
        ),
        p('The 180°C temperature is the limit which will lead to spontaneous ignition of materials on the fire averted side and propagate fire. The period given for the insulation failure cannot exceed that for integrity failure. If no integrity or insulation failure occurs, then the result is the time up until the agreed end of the heating period. Based on the time expressed in minutes (15, 20, 30, etc.) during which the joints manage to resist the fire and maintain integrity (E) and/or thermal insulation (I) a classification is obtained. The required classification in E and I depend on the function and location of the building element. Requirements can be less severe for instance in case of an elevator cage (which will not be used in the event of a fire) and more severe on an escape route or stairs. Requirements may differ not only based on the location of the seal in the building, but also the location of the building may impose national requirements. It is recommended that the required performance in fire resistance be verified for each project.',
          '180°C는 화염 반대편(비가열측)의 재료가 자연 발화하여 화재를 전파시키게 되는 한계 온도입니다. 차열성 상실 시간은 차염성 상실 시간을 초과할 수 없습니다. 차염성이나 차열성 상실이 발생하지 않으면, 합의된 가열 종료 시점까지의 시간이 결과가 됩니다. 줄눈이 화재를 견디며 차염성(E) 및/또는 차열성(I)을 유지한 시간(분 단위: 15, 20, 30 등)을 기준으로 등급이 부여됩니다. E와 I에 요구되는 등급은 건축 부재의 기능과 위치에 따라 달라집니다. 예를 들어 승강기 샤프트(화재 시 사용하지 않음)에서는 요건이 덜 엄격하고, 피난 경로나 계단에서는 더 엄격할 수 있습니다. 요건은 건물 내 실링의 위치뿐 아니라 건물이 위치한 국가의 요구사항에 따라서도 다를 수 있습니다. 프로젝트마다 요구되는 내화 성능을 확인할 것을 권장합니다.')),
      sec('standards', 'Test standards', '시험 규격',
        p('Which testing is needed specifically, depends on the product’s area of application. Test standard EN1366-4 is relevant for linear joint applications. For penetration seals, the standard EN1366-3 is applicable. The BS476-20 preceded the EN1366 series and sets out the general principles for assessing the fire resistance of construction elements with part 22 addressing the testing specificities for non-load bearing construction elements. These standards provide clear criteria by which an element’s loadbearing capacity, fire containment (integrity) and the thermal transmittance (insulation) can be assessed. At the time of writing this manual, the test results obtained according to this BS476 standard series are still valid and accepted in various countries, both in and outside of Europe. It is generally accepted that materials, which have been evaluated in the past according to the BS476-20, will continue to be evaluated according to the BS476 series of standards (for instance in different configurations). Newly developed materials will typically be tested according to the EN1366 standard series. The UL equivalent for linear joints is UL2079, whilst the valid reference for penetration seals is described by UL1479. Besides UL, ASTM also provides ASTM E814 (Standard Test Method for Fire Tests of Penetration Firestop Systems) as testing standard for penetration seals which includes a high pressure hose stream test, and ASTM E1966 for linear joints.',
          '어떤 시험이 필요한지는 제품의 적용 분야에 따라 다릅니다. 시험 규격 EN1366-4는 선형 줄눈 용도에, EN1366-3은 관통부 실링에 적용됩니다. BS476-20은 EN1366 시리즈보다 앞서 제정되어 건축 부재의 내화 성능 평가에 대한 일반 원칙을 규정하며, 제22부는 비내력(non-load bearing) 건축 부재의 시험 세부사항을 다룹니다. 이 규격들은 부재의 내력, 화염 차단(차염성), 열 전달(차열성)을 평가할 수 있는 명확한 기준을 제공합니다. 이 매뉴얼 작성 시점에, BS476 시리즈에 따라 얻은 시험 결과는 유럽 안팎의 여러 나라에서 여전히 유효하며 인정되고 있습니다. 과거 BS476-20에 따라 평가된 재료는 (예를 들어 다른 구성으로) 계속해서 BS476 시리즈에 따라 평가될 것으로 일반적으로 받아들여집니다. 새로 개발된 재료는 일반적으로 EN1366 시리즈에 따라 시험됩니다. 선형 줄눈에 대한 UL 규격은 UL2079이며, 관통부 실링의 유효한 기준은 UL1479에 규정되어 있습니다. UL 외에도 ASTM은 고압 호스 스트림(hose stream) 시험을 포함하는 관통부 실링 시험 규격인 ASTM E814(관통 파이어스톱 시스템 화재 시험 표준 방법)와, 선형 줄눈용 ASTM E1966을 제공합니다.'),
        {
          k: 'tbl',
          head: [['Product group', '제품군'], ['Description', '구분'], ['EU standard', 'EU 규격'], ['British standard', '영국 규격'], ['North America requirement', '북미 요건']],
          rows: [
            [['Firestopping', '파이어스톱'], ['Penetration seals', '관통부 실링'], 'EN 1366-3', 'BS476-20/22', 'UL 1479, ASTM E814'],
            ['', ['Linear joints and gap seals', '선형 줄눈 및 틈새 실링'], 'EN 1366-4', 'BS476-20/22', 'UL 2079, ASTM E1966'],
          ],
        },
        p('Additional specific (local/national) test results are available. Please contact your local Dow Technical Specialist for more information related to these reports.',
          '추가적인 지역/국가별 시험 결과도 있습니다. 이 시험 성적서에 관한 자세한 내용은 현지 Dow 기술 전문가에게 문의하십시오.')),
    ],
  },

  // ─────────────────────────── 7. Detailing
  {
    slug: 'detailing', no: 7, pdfPages: '11–13',
    title: { en: 'Detailing & Extended Application', ko: '상세 설계와 적용 범위 확장' },
    summary: {
      en: 'Joint, construction and penetration parameters that govern fire resistance, EN 15882 extension rules and worked classification examples.',
      ko: '내화 성능을 좌우하는 줄눈·구조체·관통부 변수, EN 15882 확장 규칙과 분류 사례.',
    },
    image: IMG('seal-L1'),
    sections: [
      sec('detailing', 'Detailing', '상세 설계',
        p('Drawings in this guide are typical details of specific seals that have been tested. Seals that differ from these designs may have to be independently tested or assessed to ensure that specific fire ratings are achievable. Indeed, many parameters influence the fire resistance of a sealant both for linear joints and penetration seals.',
          '이 가이드의 도면은 시험된 특정 실링의 전형적인 상세입니다. 이 설계와 다른 실링은 특정 내화 등급을 달성할 수 있는지 확인하기 위해 별도의 시험 또는 평가가 필요할 수 있습니다. 실제로 선형 줄눈과 관통부 실링 모두에서 실란트의 내화 성능에 영향을 주는 변수는 많습니다.'),
        p('The joint dimensions, both bite/width and thickness, influence the seal’s fire resistance performance. The smaller the joint width, the longer the fire resistance (integrity and insulation) could potentially be. A larger joint thickness will also increase the fire resistance. Fire rated seals can be applied on one side (single joint) of the supporting construction or on both sides (double joint). Double joints typically provide a better fire resistance. For single joints, a different behavior exists between those applied on the exposed (fire side FS) or non-exposed (non-fire side NFS) side of the wall. The joint orientation on a wall can be vertical or horizontal. Vertical joints can reach lower performance than equivalent designs in horizontal orientation due to the gravity which can accelerate any potential failure. Linear joints in a wall, in a floor or between adjacent walls or floors do not have to resist shear movement. However, when a joint is sealing a floor abutting a wall or a ceiling abutting a wall, it is necessary to test the joint under shear movement. In European testing, the shear movement is typically a static shear deformation applied on the cured joint during the fire test. This shear movement adds more severity to the testing condition.',
          '줄눈 치수, 즉 접착 폭(bite/width)과 두께는 실링의 내화 성능에 영향을 줍니다. 줄눈 폭이 작을수록 내화 성능(차염성과 차열성)이 더 길어질 수 있습니다. 줄눈 두께가 클수록 내화 성능도 높아집니다. 내화 실링은 지지 구조체의 한쪽 면(단일 줄눈, single joint) 또는 양면(이중 줄눈, double joint)에 시공할 수 있으며, 이중 줄눈이 일반적으로 더 나은 내화 성능을 제공합니다. 단일 줄눈의 경우 벽의 가열면(화염측, FS)에 시공했는지 비가열면(비화염측, NFS)에 시공했는지에 따라 거동이 다릅니다. 벽에서 줄눈의 방향은 수직 또는 수평일 수 있습니다. 수직 줄눈은 중력이 잠재적인 파손을 가속할 수 있어 동일한 수평 설계보다 낮은 성능에 그칠 수 있습니다. 벽 또는 바닥 내부, 또는 인접한 벽이나 바닥 사이의 선형 줄눈은 전단 이동(shear movement)에 저항할 필요가 없습니다. 그러나 벽에 접한 바닥이나 벽에 접한 천장을 실링하는 줄눈은 전단 이동 조건에서 시험해야 합니다. 유럽 시험에서 전단 이동은 일반적으로 화재 시험 중 경화된 줄눈에 가하는 정적 전단 변형입니다. 이 전단 이동은 시험 조건의 가혹도를 높입니다.'),
        h('Parameters that influence fire resistance', '내화 성능에 영향을 주는 변수'),
        {
          k: 'tbl',
          head: [['Joint parameters', '줄눈 변수'], ['Construction parameters', '구조체 변수'], ['Penetration parameters', '관통부 변수']],
          rows: [
            [['Bite and thickness', '접착 폭과 두께'], ['Wall material and thickness', '벽 재료와 두께'], ['Diameter', '직경']],
            [['Orientation (vertical / horizontal)', '방향(수직/수평)'], ['Backing material (MW/backer rod)', '백업재(미네랄울/백커로드)'], ['Separation (grouped/shattered)', '배치(밀집/분산)']],
            [['Single or double joints', '단일 또는 이중 줄눈'], ['Support elements for backing', '백업재 지지 요소'], ['Sheathing material', '피복 재료']],
            [['Movement or static', '움직임 또는 정적'], ['Compression and thickness of MW', '미네랄울의 압축률과 두께'], ['Position (corner/middle)', '위치(모서리/중앙)']],
          ],
        },
        p('All parameters of the tested system can further influence its performance. Testing in floors is much more onerous than in walls and performance reached by certain joint configurations in walls cannot be extrapolated to a floor set up. The build-up of the supporting (wall or floor) construction, including the material and its thickness, influences the overall performance of the tested system. This effect is more pronounced for the floor test. A thicker construction can limit the heat increase around the linear joints and improve fire resistance in E and I. Forming materials, such as mineral wool or backer rods, allow the liquid applied sealant to form until cure occurs. Mineral wool has inherently excellent non-combustible behavior under fire and contributes to the overall performance of the system by limiting the temperature increase of the seal. The mineral wool specifications (density, thickness, compression, potential use of metal supports) influence the result and therefore are fully part of the tested system. Backer rods made of PU and PE are alternative means to support the sealant during its cure, which will not contribute to the fire resistance of the build-up as they tend to quickly burn away, leaving the sealant exposed to the fire. Both PU and PE have a similar fire resistance, hence testing with one or the other is deemed to be equivalent and test results obtained for one option are generally accepted to cover the other material. Finally, for penetration seals specifically, the cable parameters (sheathing material, diameter, etc), the diameter of the opening (larger being more severe) as well as the position of the cables inside the opening (clustered or spread, centered or edge of the opening) can all influence the fire resistance.',
          '시험된 시스템의 모든 변수는 성능에 추가로 영향을 줄 수 있습니다. 바닥 시험은 벽 시험보다 훨씬 가혹하며, 벽에서 특정 줄눈 구성이 달성한 성능을 바닥 구성에 외삽(extrapolate)할 수 없습니다. 재료와 두께를 포함한 지지 구조체(벽 또는 바닥)의 구성은 시험된 시스템 전체의 성능에 영향을 주며, 이 영향은 바닥 시험에서 더 두드러집니다. 두꺼운 구조체는 선형 줄눈 주변의 열 상승을 제한하여 E와 I의 내화 성능을 향상시킬 수 있습니다. 미네랄울이나 백커로드와 같은 성형 재료는 액상으로 시공된 실란트가 경화될 때까지 형태를 유지하게 해 줍니다. 미네랄울은 본래 화재 시 우수한 불연 거동을 보이며 실링의 온도 상승을 제한하여 시스템의 전체 성능에 기여합니다. 미네랄울의 사양(밀도, 두께, 압축률, 금속 지지재 사용 여부)은 결과에 영향을 주므로 시험된 시스템의 일부로 완전히 포함됩니다. PU 및 PE 백커로드는 경화 중 실란트를 지지하는 대안이지만, 빠르게 타 없어져 실란트가 화염에 노출되므로 구성체의 내화 성능에는 기여하지 않습니다. PU와 PE는 내화 성능이 비슷하므로 어느 한쪽으로 시험한 결과는 다른 재료도 포괄하는 것으로 일반적으로 인정됩니다. 마지막으로 관통부 실링에서는 케이블 변수(피복 재료, 직경 등), 개구부의 직경(클수록 가혹), 개구부 내 케이블의 위치(밀집 또는 분산, 중앙 또는 가장자리)가 모두 내화 성능에 영향을 줄 수 있습니다.')),
      sec('extension', 'Extended application rules (EN 15882)', '적용 범위 확장 규칙 (EN 15882)',
        p('In Europe, rules exist to extrapolate test results for different bite parameters. For linear joints and penetration seals, the European Standard EN15882 respectively part 4 and part 3 describe the principles which apply for the extension of the field of application of a specific test result.',
          '유럽에는 서로 다른 접착 폭 변수에 대해 시험 결과를 외삽하는 규칙이 있습니다. 선형 줄눈과 관통부 실링에 대해서는 유럽 규격 EN15882의 각각 제4부와 제3부가 특정 시험 결과의 적용 범위를 확장하는 데 적용되는 원칙을 규정합니다.'),
        p('The extended application principles common to all generic joint seal types are as follows:',
          '모든 일반 줄눈 실링 유형에 공통되는 적용 범위 확장 원칙은 다음과 같습니다.'),
        {
          k: 'tbl',
          head: [['Component', '구성 요소'], ['Variation', '변경 사항'], ['Rules', '규칙']],
          rows: [
            [['Separating elements – concrete or masonry', '분리 부재 – 콘크리트 또는 조적'], ['Decrease in thickness and/or density', '두께 및/또는 밀도 감소'], ['Not permitted', '허용되지 않음']],
            ['', ['Increase in thickness and/or density', '두께 및/또는 밀도 증가'], ['Permitted', '허용']],
            [['Seal depth', '실링 깊이'], ['Decrease in seal depth', '실링 깊이 감소'], ['Not permitted', '허용되지 않음']],
            ['', ['Increase in seal depth', '실링 깊이 증가'], ['Permitted', '허용']],
            [['Joint width (W)', '줄눈 폭(W)'], ['Increase in joint width', '줄눈 폭 증가'], ['Interpolation within the tested range between the maximum and minimum nominal joint width is permitted provided the overall seal depth including the backing material is equal or higher', '백업재를 포함한 전체 실링 깊이가 같거나 더 큰 경우에 한해, 시험된 최대·최소 공칭 줄눈 폭 범위 내에서의 내삽(interpolation)이 허용됨']],
            ['', ['Decrease in joint width', '줄눈 폭 감소'], ['Permitted', '허용']],
            [['Material density', '재료 밀도'], ['Increase in material density', '재료 밀도 증가'], ['Not permitted', '허용되지 않음']],
            ['', ['Decrease in material density', '재료 밀도 감소'], ['Not permitted', '허용되지 않음']],
            [['Configuration', '구성'], ['Cross section shape of the joint', '줄눈 단면 형상'], ['Permitted only if the area of adhesion remains the same or is increased', '접착 면적이 같거나 증가하는 경우에만 허용']],
            ['', ['Position of seal within the joint', '줄눈 내 실링의 위치'], ['Distance of the seal from the exposed face in the wall/floor may not be reduced from that tested but may be increased for masonry/concrete walls/floors', '벽/바닥의 가열면으로부터 실링까지의 거리는 시험된 값보다 줄일 수 없으나, 조적/콘크리트 벽/바닥에서는 늘릴 수 있음']],
            ['', ['Orientation (H, V)', '방향(H, V)'], ['The classification for vertical linear joints or horizontal linear joints in a vertical test construction (wall) tested without shear movement doesn’t cover other orientations', '전단 이동 없이 시험한 수직 구조체(벽)의 수직 선형 줄눈 또는 수평 선형 줄눈에 대한 등급은 다른 방향을 포괄하지 않음']],
            ['', ['Shear movement', '전단 이동'], ['The classifications for linear joints in a horizontal test construction (floor) are also valid for a horizontal wall joint abutting a floor, ceiling or roof where shear movement is tested', '수평 시험 구조체(바닥)의 선형 줄눈에 대한 등급은 전단 이동을 시험한 경우, 바닥·천장·지붕에 접한 수평 벽 줄눈에도 유효함']],
            [['Backing material for sealant seals', '실란트 실링용 백업재'], ['Polyurethane/polyethylene', '폴리우레탄/폴리에틸렌'], ['May be interchanged and may be replaced by glass wool, slag wool, stone wool or ceramic wool (the above rules relate to materials of the same or greater depth)', '서로 교체할 수 있으며 유리솜, 슬래그울, 암면(stone wool) 또는 세라믹울로 대체할 수 있음 (위 규칙은 동일하거나 더 큰 깊이의 재료에 관한 것임)']],
            ['', ['Stone wool', '암면(스톤울)'], ['No change permitted', '변경 불가']],
            ['', ['Decrease in backing material depth', '백업재 깊이 감소'], ['Not permitted', '허용되지 않음']],
            ['', ['Increase in backing material depth', '백업재 깊이 증가'], ['Permitted for Class A1 and A2 materials', 'A1 및 A2 등급 재료에 한해 허용']],
          ],
        }),
      sec('examples', 'Worked examples of classification', '등급 표기 사례',
        p('As illustration of the previous concept, the results obtained on a series of linear joints in floors and in walls are provided below.',
          '앞의 개념을 설명하기 위해, 바닥과 벽의 일련의 선형 줄눈에서 얻은 결과를 아래에 제시합니다.'),
        {
          k: 'tbl',
          head: ['Case', [ 'Width (mm)', '폭 (mm)'], ['Sealant depth (mm)', '실란트 깊이 (mm)'], ['Backfilling type', '충전재 종류'], ['Backfilling depth (mm)', '충전 깊이 (mm)'], 'EI', 'E'],
          rows: [
            ['1', '50', '≥10', 'MW', '≥100', 'EI 120-H-X-F-W 50 to W 50', 'E 240-H-X-F-W 50 to W 50'],
            ['2', '150', '≥10', 'MW', '≥100', 'EI 120-H-X-F-W 150 to W 150', 'E 240-H-X-F-W 150 to W 150'],
            ['3', '50 to 150', '≥10', 'MW', '≥100', 'EI 120-H-X-F-W 50 to W 150', 'E 240-H-X-F-W 50 to W 150'],
          ],
        },
        {
          k: 'tbl',
          head: [['Shear', '전단'], ['Sealant width (mm)', '실란트 폭 (mm)'], ['Sealant depth (mm)', '실란트 깊이 (mm)'], ['Backfilling type', '충전재 종류'], ['Backfilling depth (mm)', '충전 깊이 (mm)'], 'EI', 'E'],
          rows: [
            ['10%', '6', '≥2', 'MW', '≥100', 'EI 240-H-M 10-F-W 6 to W 6', 'E 240-H-M 10-F-W 6 to W 6'],
            ['10%', '50', '≥2', 'MW', '≥100', 'EI 180-H-M 10-F-W 50 to W 50', 'E 240-H-M 10-F-W 50 to W 50'],
            ['10%', '6 to 50', '≥2', 'MW', '≥100', 'EI 180-H-M 10-F-W 6 to W 50', 'E 240-H-M 10-F-W 6 to W 50'],
          ],
        },
        p('Case 1 describes a linear joint of 50mm bite and 10mm depth, which was tested with 100mm mineral wool (MW) backfilling without shear movement in a floor. The linear joint resisted 120min in insulation and 240min in integrity E. The classification describes the testing parameters: horizontal floor application (H), no movement tested (X) for bites (W) of 50mm, on field application (F). Therefore, the joint has the classification EI 120-H-X-F-W 50 to W 50 and E 240-H-X-F-W 50 to W 50. The rules allow increasing the depth of 10mm sealant and increasing the backfilling (mineral wool) depth or its density and compression. The same classification can be obtained for Case 2 which has different bite dimensions and as a range of bite dimensions are tested, with a minimum and maximum value, all intermediate values are extrapolated and have the same classification (case 3). As the joint with 150mm also reached 120 minutes in EI and 240minutes in E, a classification for all bites between 50 and 150mm is obtained: EI 120-H-X-F-W 50 to W 150 and E 240-H-X-F-W 50 to W 150.',
          '사례 1은 바닥에서 전단 이동 없이 100mm 미네랄울(MW) 충전재로 시험한, 접착 폭 50mm·깊이 10mm의 선형 줄눈입니다. 이 선형 줄눈은 차열성 120분, 차염성(E) 240분을 견뎠습니다. 등급 표기는 시험 변수를 나타냅니다. 즉 수평 바닥 적용(H), 이동 없음(X), 접착 폭(W) 50mm, 현장 시공(F)입니다. 따라서 이 줄눈의 등급은 EI 120-H-X-F-W 50 to W 50, E 240-H-X-F-W 50 to W 50입니다. 규칙상 10mm 실란트 깊이를 늘리고 충전재(미네랄울) 깊이나 밀도·압축률을 높이는 것이 허용됩니다. 접착 폭이 다른 사례 2에서도 같은 등급을 얻을 수 있으며, 최소·최대값의 접착 폭 범위를 시험했을 때 그 사이의 모든 값은 외삽되어 같은 등급을 갖습니다(사례 3). 150mm 줄눈도 EI 120분, E 240분에 도달했으므로 50~150mm 사이의 모든 접착 폭에 대한 등급 EI 120-H-X-F-W 50 to W 150, E 240-H-X-F-W 50 to W 150을 얻습니다.'),
        p('When joints are tested with shear movement, for example 10%, an additional code M appears in the classification. As can be seen from above table extract, the 6mm wide joint passes 240min insulation whilst the 50mm wide joint only reaches 180min insulation. Therefore, the classification for the range of sealant widths between 6 and 50mm is 180min, the highest commonly reached value.',
          '줄눈을 전단 이동(예: 10%) 조건에서 시험하면 등급 표기에 추가 코드 M이 나타납니다. 위 표에서 볼 수 있듯이 폭 6mm 줄눈은 차열성 240분을 통과하지만 폭 50mm 줄눈은 차열성 180분에 그칩니다. 따라서 실란트 폭 6~50mm 범위의 등급은 공통으로 도달한 최고값인 180분입니다.'),
        p('Similar rules can be applied for the penetration seals and are described in EN15882-3. As a rule of thumb, changes to the build-up which are helping the joint to reach or maintain a certain fire resistance will be allowed. For instance, the sealant and backing depth can be increased or the penetration size decreased. Extrapolation rules related to cables type and positioning are more complex and require careful review.',
          '관통부 실링에도 유사한 규칙이 적용될 수 있으며 EN15882-3에 기술되어 있습니다. 경험칙으로, 줄눈이 특정 내화 성능에 도달하거나 이를 유지하는 데 도움이 되는 구성 변경은 허용됩니다. 예를 들어 실란트와 백업재의 깊이를 늘리거나 관통부 크기를 줄이는 것입니다. 케이블 종류와 배치에 관한 외삽 규칙은 더 복잡하여 신중한 검토가 필요합니다.'),
        note('In the current document, only the individual joint test results are provided and do not include the above classifications as these extrapolation rules are for information only. Consultation with an independent third party is strongly advised to determine the possibility of using the test results for the considered project build up in case of deviation from the tested build up.',
          '이 문서에서는 개별 줄눈 시험 결과만 제공하며, 위의 외삽 규칙은 참고용이므로 위와 같은 등급은 포함하지 않습니다. 시험된 구성과 달라지는 경우, 검토 중인 프로젝트 구성에 시험 결과를 사용할 수 있는지 판단하기 위해 독립적인 제3자와의 협의를 강력히 권장합니다.')),
    ],
  },

  // ─────────────────────────── 8. Linear joint seal types
  {
    slug: 'linear-joint-types', no: 8, pdfPages: '14',
    title: { en: 'Linear Joints – Seal Types L1–L4', ko: '선형 줄눈 시험 – 실링 유형 L1~L4' },
    summary: {
      en: 'The four tested designs (L1–L4) used for all linear joints in walls and floors, with legend.',
      ko: '벽과 바닥의 모든 선형 줄눈에 사용된 네 가지 시험 설계(L1~L4)와 범례.',
    },
    image: IMG('seal-L2'),
    sections: [
      sec('types', 'Linear joints test results', '선형 줄눈 시험 결과',
        p('The following pages depict the linear joint designs that have been tested to:', '이어지는 페이지는 다음 규격으로 시험된 선형 줄눈 설계를 보여 줍니다.'),
        ul(['European standard EN1366-4', '유럽 규격 EN1366-4'], ['British Standard BS476-20', '영국 규격 BS476-20'], ['UL 2079', 'UL 2079']),
        p('All linear joints follow one of the four designs below for wall and floors. In walls, the joints can be both horizontal or vertical.',
          '모든 선형 줄눈은 벽과 바닥에 대해 아래 네 가지 설계 중 하나를 따릅니다. 벽에서는 줄눈이 수평 또는 수직일 수 있습니다.'),
        figs(
          { src: IMG('seal-L1'), en: 'Seal type L1 is a symmetric seal joint supported on both sides of the construction by a backer rod and finished flush with the surface of the supporting construction, wall or floor', ko: '실링 유형 L1: 구조체 양면에서 백커로드로 지지되고 지지 구조체(벽 또는 바닥)의 표면과 면을 맞춰 마감한 대칭 실링 줄눈' },
          { src: IMG('seal-L2'), en: 'Seal type L2 is a symmetric seal joint supported on both sides of the construction by stonewool and finished flush with the surface of the supporting construction, wall or floor', ko: '실링 유형 L2: 구조체 양면에서 암면(stonewool)으로 지지되고 지지 구조체(벽 또는 바닥)의 표면과 면을 맞춰 마감한 대칭 실링 줄눈' },
          { src: IMG('seal-L3'), en: 'Seal type L3: single seal joint on a backer rod, finished flush with the surface of the supporting construction, wall or floor. The joint can be on the non-exposed side (non fire side NFS) as illustrated, or on the exposed fire side (FS).', ko: '실링 유형 L3: 백커로드 위의 단일 실링 줄눈으로, 지지 구조체(벽 또는 바닥) 표면과 면을 맞춰 마감. 줄눈은 그림과 같이 비가열면(비화염측 NFS) 또는 가열면(화염측 FS)에 위치할 수 있음' },
          { src: IMG('seal-L4'), en: 'Seal type L4: single seal joint on a stonewool backing, finished flush with the surface of the supporting construction, wall or floor. The joint can be on the non-exposed side (non fire side NFS) as illustrated, or on the exposed fire side (FS).', ko: '실링 유형 L4: 암면 백업재 위의 단일 실링 줄눈으로, 지지 구조체(벽 또는 바닥) 표면과 면을 맞춰 마감. 줄눈은 그림과 같이 비가열면(NFS) 또는 가열면(FS)에 위치할 수 있음' },
        ),
        note('Legend: 1: sealant depth, 2: sealant width, 3: backfilling depth/diameter, 4: supporting construction depth, 5: fire side',
          '범례: 1: 실란트 깊이, 2: 실란트 폭, 3: 충전재 깊이/직경, 4: 지지 구조체 두께, 5: 가열면(fire side)')),
    ],
  },

  // ─────────────────────────── 9. Linear joints in walls
  {
    slug: 'linear-joints-walls', no: 9, pdfPages: '16–19',
    title: { en: 'Linear Joints in Walls – Test Results', ko: '벽체 선형 줄눈 시험 결과' },
    summary: {
      en: 'Complete tested joint designs and results (E / I) for DOWSIL™ Firestop 700, 813FR and 790 in walls.',
      ko: '벽체에서 시험된 DOWSIL™ Firestop 700, 813FR, 790의 줄눈 설계와 시험 결과(E / I) 전체.',
    },
    image: IMG('seal-L4'),
    sections: [
      sec('walls', 'Linear joints in walls', '벽체 선형 줄눈',
        note('NFS= single joint on non fire side, FS= single joint on fire side, FS+NFS= double symmetric joint on fire side and non fire side, CF= ceramic fibre backing, MW= mineral wool backing, PE= polyethylene backer rod, PU= Polyurethane backer rod, CC= Concrete',
          'NFS = 비화염측 단일 줄눈, FS = 화염측 단일 줄눈, FS+NFS = 화염측과 비화염측의 이중 대칭 줄눈, CF = 세라믹 섬유 백업재, MW = 미네랄울 백업재, PE = 폴리에틸렌 백커로드, PU = 폴리우레탄 백커로드, CC = 콘크리트'),
        p('The table below combines the joint design (original manual pages 16 and 18) with the corresponding test result (pages 17 and 19), row by row. Dimensions are in mm unless stated. Integrity (E) and insulation (I) are in minutes.',
          '아래 표는 줄눈 설계(원문 16, 18쪽)와 이에 대응하는 시험 결과(17, 19쪽)를 행별로 결합한 것입니다. 치수 단위는 별도 표기가 없으면 mm이며, 차염성(E)과 차열성(I)은 분 단위입니다.'),
        { k: 'data', id: 'walls' },
        note(DISCLAIMER_EN, DISCLAIMER_KO)),
    ],
  },

  // ─────────────────────────── 10. Linear joints in floors
  {
    slug: 'linear-joints-floors', no: 10, pdfPages: '20–21',
    title: { en: 'Linear Joints in Floors – Test Results', ko: '바닥 선형 줄눈 시험 결과' },
    summary: {
      en: 'Tested floor joint designs, shear movement and results for DOWSIL™ Smoke Seal 800SL, 790 and 3-6548 Foam.',
      ko: '바닥에서 시험된 DOWSIL™ Smoke Seal 800SL, 790, 3-6548 폼의 줄눈 설계, 전단 이동, 시험 결과.',
    },
    image: IMG('prod-800sl'),
    sections: [
      sec('floors', 'Linear joints in floors', '바닥 선형 줄눈',
        p('The table below combines the joint design (original manual page 20) with the corresponding test result (page 21), row by row. Shear movement is given as a percentage of the joint width. Integrity (E) and insulation (I) are in minutes.',
          '아래 표는 줄눈 설계(원문 20쪽)와 이에 대응하는 시험 결과(21쪽)를 행별로 결합한 것입니다. 전단 이동은 줄눈 폭에 대한 백분율로 표시합니다. 차염성(E)과 차열성(I)은 분 단위입니다.'),
        { k: 'data', id: 'floors' },
        note(DISCLAIMER_EN, DISCLAIMER_KO)),
    ],
  },

  // ─────────────────────────── 11. Penetration seals
  {
    slug: 'penetration-seals', no: 11, pdfPages: '22–24',
    title: { en: 'Penetration Seals – Test Results', ko: '관통부 실링 시험 결과' },
    summary: {
      en: 'Tested pipe and cable penetration seals in walls and floors (EN 1366-3, BS 476-22, GB 23864) with drawings P1–P3.',
      ko: '벽과 바닥에서 시험된 배관·케이블 관통부 실링(EN 1366-3, BS 476-22, GB 23864)과 도면 P1~P3.',
    },
    image: IMG('pen-P3-a'),
    sections: [
      sec('intro', 'Penetration seals test results', '관통부 실링 시험 결과',
        p('The following pages depict the linear joint designs that have been tested to:', '이어지는 페이지는 다음 규격으로 시험된 설계를 보여 줍니다. (원문 표기 그대로)'),
        ul(['European standard EN1366-3', '유럽 규격 EN1366-3'], ['British Standard BS476-22', '영국 규격 BS476-22']),
        p('Both penetration seals in floors and walls are described. The illustrated drawings are typical details of specific seals that have been tested. Seals that differ from these designs may have to be independently tested or assessed to ensure that specific fire ratings are achieved. A series of penetration seals have the same build up, yet different dimensions. For these seals, reference is made to one of the generic drawings below.',
          '바닥과 벽의 관통부 실링을 모두 설명합니다. 도시된 도면은 시험된 특정 실링의 전형적인 상세입니다. 이 설계와 다른 실링은 특정 내화 등급을 달성할 수 있는지 확인하기 위해 별도의 시험 또는 평가가 필요할 수 있습니다. 일부 관통부 실링은 구성은 같고 치수만 다릅니다. 이러한 실링은 아래 일반 도면 중 하나를 참조합니다.'),
        p('DOWSIL™ Sealants have been assessed according to additional standards such as UL1479. More details are available on the UL database. Please contact your local Dow Technical Specialist for more information.',
          'DOWSIL™ 실란트는 UL1479 등 추가 규격에 따라서도 평가되었습니다. 자세한 내용은 UL 데이터베이스에서 확인할 수 있으며, 현지 Dow 기술 전문가에게 문의하십시오.'),
        h('P1: penetration (square or round) without penetrants (blank seal), wall or floor', 'P1: 관통체가 없는(빈 실링, blank seal) 관통부(사각 또는 원형), 벽 또는 바닥'),
        figs(
          { src: IMG('pen-P1-wall'), en: 'P1 – wall', ko: 'P1 – 벽' },
          { src: IMG('pen-P1-floor'), en: 'P1 – floor', ko: 'P1 – 바닥' },
        ),
        h('P2: penetration with several dispersed penetrants, wall or floor', 'P2: 여러 개의 관통체가 분산된 관통부, 벽 또는 바닥'),
        figs(
          { src: IMG('pen-P2-wall'), en: 'P2 – wall', ko: 'P2 – 벽' },
          { src: IMG('pen-P2-floor'), en: 'P2 – floor', ko: 'P2 – 바닥' },
        ),
        h('P3: penetration (square or round) with single penetrant, wall or floor centered or not', 'P3: 단일 관통체가 있는 관통부(사각 또는 원형), 벽 또는 바닥, 중앙 또는 편심'),
        figs(
          { src: IMG('pen-P3-a'), en: 'P3 – wall (centered)', ko: 'P3 – 벽(중앙)' },
          { src: IMG('pen-P3-b'), en: 'P3 – floor (centered)', ko: 'P3 – 바닥(중앙)' },
          { src: IMG('pen-P3-c'), en: 'P3 – wall (off-center)', ko: 'P3 – 벽(편심)' },
          { src: IMG('pen-P3-d'), en: 'P3 – floor (off-center)', ko: 'P3 – 바닥(편심)' },
        ),
        note('Legend: 1: backfilling depth; 2: penetration size; 3: sealant depth; 4: supporting construction depth; 5: non fire side. Contact your local Dow Technical Specialist for specific information related to positioning of penetrants.',
          '범례: 1: 충전재 깊이, 2: 관통부 크기, 3: 실란트 깊이, 4: 지지 구조체 두께, 5: 비화염측. 관통체의 배치에 관한 구체적인 정보는 현지 Dow 기술 전문가에게 문의하십시오.')),
      sec('walls', 'Penetration seals in walls', '벽체 관통부 실링',
        { k: 'data', id: 'pen_walls' },
        note(DISCLAIMER_EN, DISCLAIMER_KO)),
      sec('floors', 'Penetration seals in floors', '바닥 관통부 실링',
        p('DOWSIL™ 3-6548 Silicone Foam:', 'DOWSIL™ 3-6548 실리콘 폼:'),
        { k: 'data', id: 'pen_floors' },
        note(DISCLAIMER_EN, DISCLAIMER_KO)),
    ],
  },

  // ─────────────────────────── 12. Smoke barriers
  {
    slug: 'smoke-barriers', no: 12, pdfPages: '25',
    title: { en: 'Smoke Barriers', ko: '연기 차단 (Smoke Barriers)' },
    summary: {
      en: 'Why preventing smoke spread matters, mineral wool and self-leveling silicone at the floor-to-wall junction, EN 12101-1 results.',
      ko: '연기 확산 방지가 중요한 이유, 바닥-벽 접합부의 미네랄울과 자기수평형 실리콘, EN 12101-1 시험 결과.',
    },
    image: IMG('fig15-window-perimeter'),
    sections: [
      sec('smoke', 'Smoke barriers', '연기 차단',
        p('Smoke is a gas phase effluent consisting of solid particles, liquid droplets, gases and vapors. It is the factor which kills most in fire events, with 75% of all fire deaths caused by smoke inhalation. Furthermore, smoke reduces visibility, making it difficult to see the exit which can increase the time required to escape. Therefore, the amount of time for people to escape safely can be increased by preventing spread of smoke.',
          '연기는 고체 입자, 액체 방울, 기체, 증기로 이루어진 기상 유출물입니다. 화재 사고에서 가장 많은 사망자를 내는 요인으로, 전체 화재 사망자의 75%가 연기 흡입으로 발생합니다. 또한 연기는 시야를 가려 출구를 찾기 어렵게 하므로 탈출에 필요한 시간을 늘립니다. 따라서 연기의 확산을 막으면 사람들이 안전하게 탈출할 수 있는 시간을 늘릴 수 있습니다.'),
        p('A crucial construction element is the connection between the floor and wall which is typically packed with mineral wool, to help ensure adequate blocking of heat and flames. By using a highly compressed material it is possible to limit the passage of smoke and hot gases through the mineral wool. Once in position, mineral wool should be fixed to avoid falling down due to building movements during service life or in the event of a fire. Due to its limited movement accommodation capacity using only mineral wool could lead to smoke leakage. To ensure full tightness, further safety measures might be required. Metal strips such as galvanized sheets which can be bent on site and fixed to the top surface of the floor slab are commonly used to fix fire stops and fire stop suppliers give guidance on frequency of fixings. If a metal sheet is used as smoke stop, an appropriate DOWSIL™ Fire Rated Sealant can be used at the interfaces with the back of the wall or floor to ensure smoke tightness. Self leveling silicone seals can be used as an alternative to metal sheeting to cover the mineral wool and increase protection against smoke leakage. The sealing ensures that the gas is contained even in case of movement of the mineral wool.',
          '핵심적인 건축 요소는 바닥과 벽의 접합부로, 열과 화염을 충분히 차단하기 위해 일반적으로 미네랄울을 채워 넣습니다. 고압축 재료를 사용하면 미네랄울을 통한 연기와 뜨거운 가스의 통과를 제한할 수 있습니다. 미네랄울은 일단 설치한 뒤에는 사용 기간 중 또는 화재 시 건물의 움직임으로 떨어지지 않도록 고정해야 합니다. 움직임 수용 능력이 제한적이므로 미네랄울만 사용하면 연기가 샐 수 있습니다. 완전한 기밀을 확보하려면 추가적인 안전 조치가 필요할 수 있습니다. 현장에서 구부려 바닥 슬래브 상부 표면에 고정할 수 있는 아연도금 강판 같은 금속 스트립이 파이어스톱을 고정하는 데 흔히 사용되며, 파이어스톱 공급업체가 고정 간격에 관한 지침을 제공합니다. 금속판을 연기 차단재로 사용하는 경우, 벽 또는 바닥 뒷면과의 접합부에 적절한 DOWSIL™ 내화 실란트를 사용해 연기 기밀성을 확보할 수 있습니다. 자기수평형 실리콘 실링은 금속판의 대안으로 미네랄울을 덮어 연기 누출 방지 성능을 높이는 데 사용할 수 있습니다. 이 실링은 미네랄울이 움직이더라도 가스가 차단되도록 보장합니다.'),
        p('Finally, silicone can be used to seal the perimeter of windows and doors for smoke seal application.',
          '마지막으로, 연기 차단 용도로 창과 문의 둘레를 실링하는 데에도 실리콘을 사용할 수 있습니다.'),
        fig(IMG('fig15-window-perimeter'), 'Figure 15: Windows and doors perimeter smoke sealing using fire rated silicone.', '그림 15: 내화 실리콘을 이용한 창과 문 둘레의 연기 차단 실링'),
        p('Specific DOWSIL™ Fire Rated Silicone sealants have been successfully evaluated according to EN 12101:1 for smoke leakage prevention at room temperature and at elevated temperature (200°C), “Smoke and heat control systems - Part 1: Specification for smoke barriers”. Please contact your local Dow Technical Specialist to learn more about the use of DOWSIL™ Silicones in smoke barriers.',
          '특정 DOWSIL™ 내화 실리콘 실란트는 상온과 고온(200°C)에서의 연기 누출 방지에 대해 EN 12101:1 「연기 및 열 제어 시스템 — 제1부: 연기 차단벽 사양」에 따라 성공적으로 평가되었습니다. 연기 차단벽에서의 DOWSIL™ 실리콘 사용에 대해 자세히 알고 싶으시면 현지 Dow 기술 전문가에게 문의하십시오.'),
        {
          k: 'tbl',
          head: [['Product', '제품'], ['Premier Gap Width', '(원문 표기) 틈새 폭'], ['Joint dimension WxH', '줄눈 치수 W×H'], ['Standard', '규격'], ['Drawing', '도면'], ['Report', '성적서']],
          rows: [['700', '50', '50 x 10 mm', 'EN 12101', '15', 'R20H09-1B']],
        }),
    ],
  },

  // ─────────────────────────── 13. Curtain wall
  {
    slug: 'curtain-wall', no: 13, pdfPages: '26',
    title: { en: 'Curtain Wall Fire Resistance', ko: '커튼월 내화 성능' },
    summary: {
      en: 'Perimeter fire barrier between curtain wall and floor slab, EN 1364-4 / ASTM E2307 testing and results.',
      ko: '커튼월과 바닥 슬래브 사이의 둘레 방화 차단(perimeter fire barrier), EN 1364-4 / ASTM E2307 시험과 결과.',
    },
    image: IMG('fig16-curtain-wall'),
    sections: [
      sec('curtain', 'Curtain wall fire resistance', '커튼월 내화 성능',
        p('Aluminium curtain walls are normally used for areas of the building envelope that are not required to be fire resisting. However they still require appropriate detailing to limit the spread of fire and smoke. Where an external wall, such as a curtain wall, abuts a fire-resistant compartment floor, it is necessary to provide fire stopping between the external wall and the compartment floor to restrict fire and smoke spread through the junction.',
          '알루미늄 커튼월은 일반적으로 내화 성능이 요구되지 않는 건물 외피 영역에 사용됩니다. 그러나 화염과 연기의 확산을 제한하기 위한 적절한 상세 설계는 여전히 필요합니다. 커튼월과 같은 외벽이 내화 구획 바닥과 만나는 곳에서는, 접합부를 통한 화염과 연기의 확산을 막기 위해 외벽과 구획 바닥 사이에 파이어스톱을 설치해야 합니다.'),
        p('The fire rating of the floor should be extended through the perimeter seal to the curtain wall. The perimeter fire barrier system provides structural protection. This can help to keep the wall and window system intact for a longer period of time. The fire resistance performance of the perimeter fire barrier and its ability to maintain a seal to prevent fire from spreading among an exterior wall assembly and floor assembly can be evaluated according to ASTM E2307 or EN1364-4. Through this test, both the performance (deflection and fire resistance) of the spandrel area in the curtain wall can be seen, as well as the performance of the perimeter barrier seal system (passage of smoke/hot gases/flames, temperature rise). This fire test simulates an indoor fire located near the curtain wall spandrel area, below the perimeter barrier seal. DOWSIL™ Sealants can be implemented in these types of perimeter barrier systems as a smoke seal. Please contact your local Dow Technical Specialist to learn more about the use of DOWSIL™ Silicones in perimeter barrier systems. DOWSIL™ Firestop 700 Sealant and DOWSIL™ Smoke Seal 800SL have been tested successfully in perimeter barrier systems. The achieved performance is valid for the used façade system. More details on the perimeter barrier seal parameters can be provided on request. Please consult with your local Technical Specialist.',
          '바닥의 내화 등급은 둘레 실링(perimeter seal)을 거쳐 커튼월까지 연장되어야 합니다. 둘레 방화 차단 시스템(perimeter fire barrier system)은 구조적 보호를 제공하며, 벽과 창 시스템이 더 오랫동안 온전하게 유지되도록 도울 수 있습니다. 둘레 방화 차단재의 내화 성능과, 외벽 조립체와 바닥 조립체 사이로 화재가 번지지 않도록 밀봉을 유지하는 능력은 ASTM E2307 또는 EN1364-4에 따라 평가할 수 있습니다. 이 시험을 통해 커튼월 스팬드럴 영역의 성능(처짐과 내화 성능)과 둘레 차단 실링 시스템의 성능(연기·뜨거운 가스·화염의 통과, 온도 상승)을 모두 확인할 수 있습니다. 이 화재 시험은 둘레 차단 실링 아래, 커튼월 스팬드럴 영역 근처에서 발생한 실내 화재를 모사합니다. DOWSIL™ 실란트는 이러한 둘레 차단 시스템에서 연기 차단재(smoke seal)로 적용할 수 있습니다. 둘레 차단 시스템에서의 DOWSIL™ 실리콘 사용에 관해 자세히 알고 싶으시면 현지 Dow 기술 전문가에게 문의하십시오. DOWSIL™ Firestop 700 Sealant와 DOWSIL™ Smoke Seal 800SL은 둘레 차단 시스템에서 성공적으로 시험되었습니다. 달성된 성능은 시험에 사용된 외벽 시스템에 대해서만 유효합니다. 둘레 차단 실링 변수에 대한 자세한 내용은 요청 시 제공할 수 있으며, 현지 기술 전문가와 상담하십시오.'),
        fig(IMG('fig16-curtain-wall'), 'Figure 16.1 and 16.2: Curtain wall and fire-resistant floor and walls with indication of the use of fire resistant silicone for linear joints in compartments and on top of the mineral wool in the perimeter barrier system between floor and curtain wall. 1) Curtain wall, 2) Fire rated silicone, 3) Mineral wool, 4) Concrete floor slab, 5) Steel sheet',
          '그림 16.1, 16.2: 커튼월과 내화 바닥·벽. 구획 내 선형 줄눈과, 바닥과 커튼월 사이 둘레 차단 시스템의 미네랄울 상부에 내화 실리콘을 사용하는 위치를 표시. 1) 커튼월, 2) 내화 실리콘, 3) 미네랄울, 4) 콘크리트 바닥 슬래브, 5) 강판'),
        {
          k: 'tbl',
          title: { en: 'Figure 16.1', ko: '도면 16.1' },
          head: [['Product', '제품'], ['Gap Width Floor to Curtain Wall', '바닥–커튼월 틈새 폭'], ['Steel sheet thickness', '강판 두께'], ['Standard', '규격'], ['Integrity', '차염성'], ['Insulation', '차열성'], ['Drawing', '도면'], ['Report', '성적서']],
          rows: [['700', '125 mm', '2 mm', 'EN1364-4', '120', '120', '16.1', 'XK041-2B']],
        },
        {
          k: 'tbl',
          title: { en: 'Figure 16.2', ko: '도면 16.2' },
          head: [['Product', '제품'], ['Premier Gap Width', '(원문 표기) 틈새 폭'], ['Standard', '규격'], ['Integrity', '차염성'], ['Insulation', '차열성'], ['Drawing', '도면'], ['Report', '성적서']],
          rows: [['800', '125 mm', 'EN1364-4', '120', '120', '16.2', 'XK041-2B']],
        }),
    ],
  },
]
