import { p, h, ul, fig, note, sec, IMG } from '@/lib/tech-manual/types'
import type { L, Section } from '@/lib/tech-manual/types'
import { inGroup } from './data'

export interface IPage {
  slug: string
  no: number
  pdfPages: string
  title: L
  summary: L
  answer: L // 핵심 요약(검색·AI 인용용 첫 단락)
  image: string
  sections: Section[]
  faq: { q: L; a: L }[]
}

export const SOURCE = 'Dow, “DOWSIL™ Silicone Sealants and Foams for Industrial, Appliance and Maintenance – Selection Guide”, Form No. 80-8283-01-0922 S2D (© 2022 The Dow Chemical Company)'
export const SOURCE_PDF = '/docs/dow-silicone-sealants-foams-industrial-assembly.pdf'

const FN1 = note('1 Most paints will not adhere to sealant; not for underwater structural or adhesive applications; requires atmospheric moisture to cure. May stress-crack some plastics; test before use.',
  '1 대부분의 페인트는 실란트에 접착되지 않습니다. 수중 구조용 또는 접착 용도에는 적합하지 않으며 경화에 대기 중 수분이 필요합니다. 일부 플라스틱에 응력 균열을 일으킬 수 있으므로 사용 전에 시험하십시오.')
const FN2 = note('2 Estimated service temperatures based on product formulation and laboratory testing. Actual service temperature range is dependent on other factors, including the specific application environment.',
  '2 사용 온도는 제품 배합과 실험실 시험을 기준으로 한 추정치입니다. 실제 사용 온도 범위는 구체적인 적용 환경을 비롯한 다른 요인에 따라 달라집니다.')
const FN_ADH = note('* Consult your local Dow office/representative for further advice on adhesion properties.', '* 접착 특성에 관한 자세한 조언은 현지 Dow 사무소/담당자에게 문의하십시오.')

const ACET = inGroup('acetoxy')
const HT = inGroup('hightemp')
const ALK = inGroup('alkoxy')
const TWO = ['dowsil-1080', ...inGroup('twopart')]
const HM = inGroup('hotmelt')
const FOAM = inGroup('foam')
const PRIM = inGroup('primer', 'cleaner')
const ALL_SEALANTS = [...ACET, ...HT, ...ALK, ...TWO]

export const IPAGES: IPage[] = [
  // ─────────────── 1
  {
    slug: 'overview', no: 1, pdfPages: '1–3',
    title: { en: 'DOWSIL™ Silicone Sealants – Benefits and Why Silicones', ko: 'DOWSIL™ 실리콘 실란트의 장점과 실리콘을 선택하는 이유' },
    summary: { en: 'Temperature stability, weather and chemical resistance, bond strength, electrical properties, low flammability; why silicones outperform organics.', ko: '온도 안정성, 내후성, 화학적 안정성, 접착 강도, 전기적 특성, 낮은 가연성, 그리고 실리콘이 유기계 재료보다 우수한 이유.' },
    answer: {
      en: 'DOWSIL™ silicone sealants are durable RTV sealants that cure at room temperature to a tough, rubbery solid. When properly cured, most can be used from -56 to 177°C (204°C intermittent), and some above 260°C (315°C intermittent). Dow states that silicone protection typically lasts three times longer than organic materials in the same applications.',
      ko: 'DOWSIL™ 실리콘 실란트는 상온에서 질기고 고무 같은 고체로 경화되는 내구성 RTV 실란트입니다. 올바르게 경화되면 대부분 -56~177°C(단속 204°C)에서, 일부 제품은 260°C 이상(단속 315°C)에서도 사용할 수 있습니다. Dow는 동일한 용도에서 실리콘의 보호 성능이 유기계 재료보다 일반적으로 3배 오래 지속된다고 설명합니다.',
    },
    image: IMG('ind-cover'),
    sections: [
      sec('silicone-sealants', 'DOWSIL™ Silicone Sealants', 'DOWSIL™ 실리콘 실란트',
        fig(IMG('ind-cover'), 'DOWSIL™ Silicone Sealants and Foams for Industrial, Appliance and Maintenance – Selection Guide', 'DOWSIL™ 산업·가전·유지보수용 실리콘 실란트 및 폼 – 선정 가이드'),
        p('Silicon-based sealants from Dow last longer and are more versatile than most organic polymer sealants. They are durable RTV sealants; cure at room temperature to a tough, rubbery solid with exceptional performance characteristics; and meet a wide variety of your industrial bonding and sealing needs.',
          'Dow의 실리콘 기반 실란트는 대부분의 유기 고분자 실란트보다 수명이 길고 활용도가 높습니다. 내구성이 뛰어난 RTV 실란트이며, 상온에서 질기고 고무 같은 고체로 경화되어 탁월한 성능 특성을 발휘하고, 다양한 산업용 접착·실링 요구를 충족합니다.'),
        fig(IMG('ind-benefits'), 'Industrial, appliance and maintenance applications of DOWSIL™ silicone sealants', 'DOWSIL™ 실리콘 실란트의 산업·가전·유지보수 적용 사례'),
        h('Benefits of DOWSIL™ silicone sealants include:', 'DOWSIL™ 실리콘 실란트의 장점'),
        ul(
          ['Stability Over a Wide Temperature Range — When properly cured, most of our products can be used at temperatures ranging from -56 to 177°C (204°C intermittent), with still others capable of higher thermal stability up to and exceeding 260°C (315°C intermittent).',
           '넓은 온도 범위에서의 안정성 — 올바르게 경화되면 대부분의 제품을 -56~177°C(단속 204°C)의 온도에서 사용할 수 있으며, 일부 제품은 260°C(단속 315°C) 이상까지 더 높은 열 안정성을 갖습니다.'],
          ['Weather Resistance — High resistance to ultraviolet (UV) rays, radiation and weather prevents our products from hardening, cracking, crumbling, drying and becoming brittle.',
           '내후성 — 자외선(UV), 방사선, 기후에 대한 높은 저항성으로 제품이 굳거나, 갈라지거나, 부스러지거나, 마르거나, 취성이 생기는 것을 방지합니다.'],
          ['Chemical Stability — Our sealants do not readily degrade, even under long-term exposure to many chemicals and atmospheric pollutants.',
           '화학적 안정성 — 많은 화학물질과 대기 오염물질에 장기간 노출되어도 쉽게 열화되지 않습니다.'],
          ['Good Bond Strength — Our products provide good adhesion to a wide variety of industrial materials, including glass, ceramics and wood masonry; painted surfaces; and many metals and plastics.',
           '우수한 접착 강도 — 유리, 세라믹, 목재·조적, 도장면, 다수의 금속과 플라스틱 등 다양한 산업 재료에 대해 우수한 접착력을 제공합니다.'],
          ['Electrical Properties — Designed for a variety of applications, our products can be used in various electrical and electronic applications, including devices that are thermally cycled over a wide temperature range.',
           '전기적 특성 — 다양한 용도를 위해 설계되어, 넓은 온도 범위에서 열 사이클을 겪는 장치를 포함한 여러 전기·전자 용도에 사용할 수 있습니다.'],
          ['Low Flammability — In fire conditions, silicone adhesives/sealants are reluctant to burn. Many products comply with UL flammability standards.',
           '낮은 가연성 — 화재 상황에서 실리콘 접착제/실란트는 잘 연소하지 않습니다. 많은 제품이 UL 가연성 표준을 충족합니다.'],
        ),
        p('When you specify an assembly and maintenance product from Dow, you receive a solution backed by the world leader in silicone technology with more than 70 years of expertise and innovations.',
          'Dow의 조립·유지보수 제품을 지정하면, 70년 이상의 전문성과 혁신을 갖춘 세계 최고의 실리콘 기술 기업이 뒷받침하는 솔루션을 받게 됩니다.')),
      sec('why-silicones', 'Why Silicones?', '왜 실리콘인가?',
        fig(IMG('ind-why-silicones'), 'Automated dispensing of silicone sealant in industrial assembly', '산업 조립 라인에서의 실리콘 실란트 자동 토출'),
        p('For application versatility, durability, aesthetics and value, silicones outperform organics. Silicone sealants from Dow are unrivaled, delivering:',
          '용도의 다양성, 내구성, 미관, 가치 측면에서 실리콘은 유기계 재료보다 우수합니다. Dow의 실리콘 실란트는 다음을 제공하는 대체 불가능한 제품입니다.'),
        ul(
          ['Protection that typically lasts three times longer than organic materials in the same applications, thus avoiding premature and costly renovations', '동일한 용도에서 유기계 재료보다 일반적으로 3배 오래 지속되는 보호 성능으로, 조기에 발생하는 값비싼 보수 공사를 방지'],
          ['Proven performance with successful track records in a range of diverse applications', '다양한 용도에서의 성공적인 실적으로 입증된 성능'],
          ['Outstanding life-cycle value', '뛰어난 생애주기 가치'],
          ['All-weather application and performance, with resistance to UV exposure, ozone, rain, snow and extreme temperatures', 'UV, 오존, 비, 눈, 극한 온도에 대한 저항성을 갖춘 전천후 시공 및 성능'],
          ['More durability than organic-based materials', '유기계 재료보다 높은 내구성'],
          ['Continued flexibility and adhesion, even while being stretched or compressed', '늘어나거나 압축되는 동안에도 유지되는 유연성과 접착력'],
          ['Resistance to cracking, splits or tears without hardening or fading', '굳거나 변색되지 않으면서 균열, 갈라짐, 찢어짐에 대한 저항성'],
          ['Easy application over a wide temperature range', '넓은 온도 범위에서의 쉬운 시공'],
        ),
        p('Organics are prone to chemical reversion, a phenomenon in which organic polyurethane loses its cured properties and reverts to a substance with the softness of chewing gum. The differences between silicones and organics are the difference between long-term value and premature failure. Silicones prevail.',
          '유기계 재료는 화학적 환원(chemical reversion)이 일어나기 쉽습니다. 이는 유기 폴리우레탄이 경화 물성을 잃고 껌처럼 물렁한 물질로 되돌아가는 현상입니다. 실리콘과 유기계 재료의 차이는 장기적 가치와 조기 파손의 차이이며, 승자는 실리콘입니다.')),
    ],
    faq: [
      { q: { en: 'What temperature range can DOWSIL™ silicone sealants withstand?', ko: 'DOWSIL™ 실리콘 실란트는 어느 정도의 온도 범위를 견딥니까?' },
        a: { en: 'When properly cured, most DOWSIL™ products can be used at -56 to 177°C (204°C intermittent); some have higher thermal stability up to and exceeding 260°C (315°C intermittent).', ko: '올바르게 경화되면 대부분의 DOWSIL™ 제품은 -56~177°C(단속 204°C)에서 사용할 수 있으며, 일부 제품은 260°C(단속 315°C) 이상까지 더 높은 열 안정성을 가집니다.' } },
      { q: { en: 'Why choose silicone sealants over organic sealants?', ko: '유기계 실란트 대신 실리콘 실란트를 선택하는 이유는 무엇입니까?' },
        a: { en: 'According to Dow, silicone protection typically lasts three times longer than organic materials in the same applications, with UV, ozone, rain, snow and temperature-extreme resistance, and continued flexibility and adhesion while stretched or compressed.', ko: 'Dow에 따르면 실리콘의 보호 성능은 동일한 용도에서 유기계 재료보다 일반적으로 3배 오래 지속되며, UV·오존·비·눈·극한 온도에 강하고 늘어나거나 압축되는 동안에도 유연성과 접착력을 유지합니다.' } },
      { q: { en: 'What is chemical reversion?', ko: '화학적 환원(chemical reversion)이란 무엇입니까?' },
        a: { en: 'A phenomenon in which organic polyurethane loses its cured properties and reverts to a substance with the softness of chewing gum.', ko: '유기 폴리우레탄이 경화 물성을 잃고 껌처럼 물렁한 물질로 되돌아가는 현상입니다.' } },
      { q: { en: 'Are silicone sealants flammable?', ko: '실리콘 실란트는 불에 잘 탑니까?' },
        a: { en: 'In fire conditions, silicone adhesives/sealants are reluctant to burn, and many products comply with UL flammability standards.', ko: '화재 상황에서 실리콘 접착제/실란트는 잘 연소하지 않으며, 많은 제품이 UL 가연성 표준을 충족합니다.' } },
    ],
  },

  // ─────────────── 2
  {
    slug: 'which-silicone', no: 2, pdfPages: '4',
    title: { en: 'Which Silicone? RTV, Heat Cure, Hot Melt, One-Part, Two-Part and Foams', ko: '어떤 실리콘을 선택할까? RTV·가열 경화·핫멜트·1액형·2액형·폼' },
    summary: { en: 'The six formulation options (RTV, heat cure, hot-melt, one-part, two-part, silicone foams) and the basic chemistry of silicone sealants.', ko: '여섯 가지 배합 옵션(RTV, 가열 경화, 핫멜트, 1액형, 2액형, 실리콘 폼)과 실리콘 실란트의 기본 화학.' },
    answer: {
      en: 'Dow offers silicone sealants as RTV (room-temperature-vulcanizing), heat cure, hot-melt, one-part, two-part and foam formulations. Silicone sealants typically consist of an inorganic siloxane (Si-O-Si-O-Si) polymer plus filler, crosslinker, catalyst, adhesion promoter, pigment and plasticizer.',
      ko: 'Dow는 실리콘 실란트를 RTV(상온 가황), 가열 경화, 핫멜트, 1액형, 2액형, 폼 배합으로 제공합니다. 실리콘 실란트는 일반적으로 무기 실록산(Si-O-Si-O-Si) 고분자에 충전제, 가교제, 촉매, 접착 증진제, 안료, 가소제를 배합한 것입니다.',
    },
    image: IMG('ind-which-silicone'),
    sections: [
      sec('which', 'Which Silicone?', '어떤 실리콘인가?',
        fig(IMG('ind-which-silicone'), 'Silicone sealants for industrial, appliance and maintenance applications', '산업·가전·유지보수용 실리콘 실란트'),
        p('Silicone sealants from Dow are offered in a wide range of formulation options, including:', 'Dow의 실리콘 실란트는 다음을 포함한 다양한 배합 옵션으로 제공됩니다.'),
        ul(
          ['RTV (room-temperature-vulcanizing) sealants — These silicone polymers work with a condensation reaction in humidity at typical room conditions, but the cure can be accelerated by increasing temperature and humidity. RTV sealants are easy to install, and they offer relatively low cost and good adhesion.',
           'RTV(상온 가황) 실란트 — 이 실리콘 고분자는 일반적인 실내 조건의 습기 중에서 축합 반응으로 경화하지만, 온도와 습도를 높여 경화를 가속할 수 있습니다. RTV 실란트는 시공이 쉽고 비교적 저렴하며 접착력이 좋습니다.'],
          ['Heat cure sealants — Delivering much shorter cure times than RTV sealants, these materials can be automatically dispensed to meet industrial equipment assembly requirements.',
           '가열 경화 실란트 — RTV 실란트보다 경화 시간이 훨씬 짧으며, 산업 장비 조립 요건에 맞게 자동 토출할 수 있습니다.'],
          ['Hot-melt silicone sealants — Ideal for automated applications in the manufacturing of various components, these reactive hot-melt materials provide instant green strength, which can increase productivity, improve quality and reduce costs in industrial assembly applications.',
           '핫멜트 실리콘 실란트 — 다양한 부품 제조의 자동화 공정에 이상적이며, 이 반응형 핫멜트 재료는 즉각적인 그린 스트렝스를 제공하여 산업 조립 공정의 생산성을 높이고 품질을 개선하며 비용을 줄일 수 있습니다.'],
          ['One-part materials — Containing all the ingredients needed to produce a cured material, these sealants use external factors – such as moisture in the air, heat or the presence of UV light – to initiate, speed or complete the curing process. One-part sealant formulations are easy to use and typically have a low- or room-temperature cure, but moisture-curing materials may take 24 hours or more to fully cure.',
           '1액형 재료 — 경화된 재료를 만드는 데 필요한 모든 성분을 포함하며, 공기 중 습기, 열, UV 광선 같은 외부 요인으로 경화를 시작·가속·완료합니다. 1액형 배합은 사용이 쉽고 일반적으로 저온 또는 상온에서 경화하지만, 습기 경화 재료는 완전히 경화되는 데 24시간 이상 걸릴 수 있습니다.'],
          ['Two-part materials — With the reactive ingredients separated to prevent premature initiation of the cure process, these materials often use the addition of heat to facilitate or accelerate cure. Two-part formulations typically offer longer shelf life, high-speed cure, and the ability to carefully control working/open time and cure time by manipulating the formulation, but they require mixing and may involve more sophisticated processes and application expertise.',
           '2액형 재료 — 경화가 조기에 시작되지 않도록 반응성 성분이 분리되어 있으며, 경화를 돕거나 가속하기 위해 열을 가하는 경우가 많습니다. 2액형 배합은 일반적으로 유효기간이 길고 경화가 빠르며 배합 조정으로 작업 가능 시간/오픈 타임과 경화 시간을 세밀하게 제어할 수 있지만, 혼합이 필요하고 더 정교한 공정과 시공 전문성이 요구될 수 있습니다.'],
          ['Silicone foams — Ideal as compression gaskets or as “environmental seals” to protect against ambient air, splashed water, dust and moisture, these materials are a cost-effective sealing solution compared to preformed gaskets and foam tapes for use sealing high-tolerance gaps. Applied using automated robotic dispensing, these materials have a fast room-temperature or low-temperature cure.',
           '실리콘 폼 — 압축 가스켓이나 주변 공기, 물 튐, 먼지, 습기를 막는 “환경 실(environmental seal)”로 이상적이며, 공차가 큰 틈을 밀봉할 때 사전 성형 가스켓이나 폼 테이프에 비해 비용 효율적인 실링 솔루션입니다. 자동 로봇 토출로 시공하며 상온 또는 저온에서 빠르게 경화됩니다.'],
        )),
      sec('chemistry', 'Sealant Chemistry', '실란트 화학',
        p('Silicone sealants typically consist of an inorganic siloxane (Si-O-Si-O-Si) polymer and appropriate filler, crosslinker, catalyst, adhesion promoter, pigment and plasticizer.',
          '실리콘 실란트는 일반적으로 무기 실록산(Si-O-Si-O-Si) 고분자와 적절한 충전제, 가교제, 촉매, 접착 증진제, 안료, 가소제로 구성됩니다.'),
        p('To meet specific needs, silicone sealants are offered in a variety of chemistries and cure types, each with their own benefits. The following tables will assist you in selecting the right material to help meet your performance requirements.',
          '특정 요구를 충족하기 위해 실리콘 실란트는 각각 고유한 장점을 가진 다양한 화학 조성과 경화 유형으로 제공됩니다. 다음 표는 성능 요구 사항에 맞는 재료를 선택하는 데 도움이 됩니다.')),
    ],
    faq: [
      { q: { en: 'What is the difference between one-part and two-part silicone sealants?', ko: '1액형과 2액형 실리콘 실란트의 차이는 무엇입니까?' },
        a: { en: 'One-part sealants contain all ingredients and cure with external factors such as air moisture, heat or UV light (moisture cure may take 24 hours or more to fully cure). Two-part sealants keep reactive ingredients separate, typically offer longer shelf life, high-speed cure and controllable working time, but require mixing.', ko: '1액형은 모든 성분이 들어 있어 공기 중 습기, 열, UV 등 외부 요인으로 경화하며(습기 경화는 완전 경화에 24시간 이상 걸릴 수 있음), 2액형은 반응성 성분을 분리해 두어 일반적으로 유효기간이 길고 경화가 빠르며 작업 시간을 제어할 수 있지만 혼합이 필요합니다.' } },
      { q: { en: 'What are silicone foams used for?', ko: '실리콘 폼은 어디에 사용합니까?' },
        a: { en: 'As compression gaskets or “environmental seals” against ambient air, splashed water, dust and moisture; a cost-effective alternative to preformed gaskets and foam tapes for high-tolerance gaps, applied by automated robotic dispensing.', ko: '압축 가스켓 또는 주변 공기·물 튐·먼지·습기에 대한 “환경 실”로 사용하며, 공차가 큰 틈에서 사전 성형 가스켓이나 폼 테이프보다 비용 효율적이고 자동 로봇 토출로 시공합니다.' } },
      { q: { en: 'What is a hot-melt silicone sealant?', ko: '핫멜트 실리콘 실란트란 무엇입니까?' },
        a: { en: 'A reactive hot-melt material for automated manufacturing that provides instant green strength, which can increase productivity, improve quality and reduce costs in industrial assembly.', ko: '자동화 제조 공정용 반응형 핫멜트 재료로, 즉각적인 그린 스트렝스를 제공하여 산업 조립의 생산성 향상, 품질 개선, 비용 절감에 도움이 됩니다.' } },
    ],
  },

  // ─────────────── 3
  {
    slug: 'sealant-chemistries', no: 3, pdfPages: '5',
    title: { en: 'Table I: Sealant Chemistries – Acetoxy, Alkoxy, Oxime, Hot Melt, Platinum', ko: '표 I: 실란트 화학 비교 – 아세톡시·알콕시·옥심·핫멜트·백금 경화' },
    summary: { en: 'Compare acid-cure acetoxy and neutral-cure alkoxy, oxime, two-part alkoxy, hot-melt and platinum foam chemistries by cure, green strength, adhesion, shelf life and clarity.', ko: '산 경화 아세톡시와 중성 경화 알콕시·옥심·2액형 알콕시·핫멜트·백금 폼 화학을 경화, 그린 스트렝스, 접착, 유효기간, 투명도로 비교.' },
    answer: {
      en: 'Acetoxy sealants cure fast and are competitively priced but are acidic and may corrode metals; neutral-cure alkoxy and oxime sealants avoid acid cure; two-part alkoxy gives fast green strength (parts can be moved in under 4 hours); hot melt gives instant green strength; platinum-cure two-part foams suit compression gaskets.',
      ko: '아세톡시 실란트는 경화가 빠르고 가격 경쟁력이 있지만 산성이어서 금속을 부식시킬 수 있습니다. 중성 경화인 알콕시·옥심은 산 경화를 피하고, 2액형 알콕시는 빠른 그린 스트렝스(4시간 이내 부품 이동 가능)를, 핫멜트는 즉각적인 그린 스트렝스를, 백금 경화 2액형 폼은 압축 가스켓에 적합합니다.',
    },
    image: IMG('ind-benefits'),
    sections: [
      sec('table-1', 'Table I: Sealant Chemistries', '표 I: 실란트 화학',
        p('Ratings use a dot scale: – = Poor; • = Good; •• = Better; ••• = Best. NA = Not available; LA = Limited availability.',
          '등급은 점 표시로 나타냅니다: – = 불량, • = 양호, •• = 우수, ••• = 최우수. NA = 해당 없음(제공되지 않음), LA = 제한적 공급.'),
        {
          k: 'tbl',
          head: [['Chemistry', '화학 조성'], ['Surface cure', '표면 경화'], ['Green strength', '그린 스트렝스'], ['Primerless adhesion', '프라이머 없는 접착'], ['Shelf life', '유효기간'], ['Clear / translucent', '투명/반투명'], ['Features', '특징'], ['Limitations', '한계']],
          rows: [
            [['Acid cure – Acetoxy (one-part)', '산 경화 – 아세톡시 (1액형)'], '•••', '•', '•', '•••', '••',
              ['• Competitively priced versus organics • Fast cure • No-catalyst versions available • Good shelf life • Clear • Adhesion durability', '• 유기계 대비 가격 경쟁력 • 빠른 경화 • 무촉매 버전 제공 • 우수한 유효기간 • 투명 • 접착 내구성'],
              ['• Acidic; potentially corrosive to metals • Strong odor', '• 산성이며 금속을 부식시킬 수 있음 • 강한 냄새']],
            [['Neutral cure – Alkoxy (one-part)', '중성 경화 – 알콕시 (1액형)'], '•', '•', '••', '••', 'LA¹',
              ['• Neutral cure • Robust adhesion • Economical; chalk filled • Low VOC', '• 중성 경화 • 견고한 접착 • 경제적(탄산칼슘 충전) • 낮은 VOC'],
              ['• Stability of silica system not robust, so achieving clarity is difficult • Slower cure speed • 12-month shelf life', '• 실리카 시스템의 안정성이 높지 않아 투명도 확보가 어려움 • 느린 경화 속도 • 유효기간 12개월']],
            [['Neutral cure – Oxime (one-part)', '중성 경화 – 옥심 (1액형)'], '••', '••', '•', '•', '••',
              ['• Fast cure • Low-catalyst options possible • Good silica versions with clear/translucent offerings', '• 빠른 경화 • 저촉매 옵션 가능 • 투명/반투명 제품이 가능한 우수한 실리카 버전'],
              ['• High-temperature (40°C) storage causes discoloration • Strong odor • High VOC, typically due to large leaving group', '• 고온(40°C) 보관 시 변색 • 강한 냄새 • 큰 이탈기로 인해 일반적으로 높은 VOC']],
            [['Neutral cure – Alkoxy (two-part)', '중성 경화 – 알콕시 (2액형)'], '••', '•••', '•', '•', 'NA',
              ['• Fast cure/green strength; parts can be moved in under 4 hours • Total VOC low when mixed • Tunable cure profile based on mix ratio • Adhesion to many substrates', '• 빠른 경화/그린 스트렝스; 4시간 이내 부품 이동 가능 • 혼합 시 총 VOC 낮음 • 혼합비에 따라 경화 프로파일 조정 가능 • 다양한 기재에 접착'],
              ['• Dispensing equipment and maintenance • Settling of components can be an issue • Catalyst is flammable', '• 토출 장비와 유지보수 필요 • 성분 침강이 문제될 수 있음 • 촉매가 인화성']],
            [['Hot melt (one-part)', '핫멜트 (1액형)'], '••', '•••', '•••', '••', '•••',
              ['• Instant green strength for immediate hold • Instant assembly – no “hold time” requirement • Worker friendly – low odor, nonhazardous • Long pot life and long open time • Proven neutral-cure 100% silicone chemistry • Aggressive adhesion to a variety of substrates', '• 즉시 고정되는 즉각적인 그린 스트렝스 • 즉각 조립 – “고정 시간” 불필요 • 작업자 친화적 – 저취, 비위험 • 긴 포트 라이프와 긴 오픈 타임 • 검증된 중성 경화 100% 실리콘 화학 • 다양한 기재에 대한 강력한 접착'],
              ['• Not intended for use when in total confinement (atmospheric moisture required for cure) • Not intended for continuous water immersion • Not intended for use on surfaces that might bleed oils, plasticizers or solvents', '• 완전 밀폐 상태에서의 사용 불가(경화에 대기 중 수분 필요) • 연속 수중 침지 용도 불가 • 오일, 가소제, 용제가 배어 나올 수 있는 표면에 사용 불가']],
            [['Platinum (two-part) “Silicone foams”', '백금 경화 (2액형) “실리콘 폼”'], '•', '—', '—', '•', 'NA',
              ['• Fast-curing products available in heat cure and room temperature cure options • Ideal choice for compression gaskets • Provides environmental sealing versus elements • Low sealing force/modulus • Ideal for sealing enclosures requiring serviceability • Allows for flexibility in seal and bead design', '• 가열 경화와 상온 경화 옵션의 빠른 경화 제품 제공 • 압축 가스켓에 이상적 • 외부 환경 요소에 대한 환경 실링 제공 • 낮은 밀봉력/모듈러스 • 유지보수가 필요한 인클로저 밀봉에 이상적 • 실 및 비드 설계의 유연성'],
              ['• Not optimized for fluid sealing • Does not offer high adhesion without a primer or surface treatment • Cure inhibition (“poisoning” of platinum catalyst)', '• 유체 실링에 최적화되지 않음 • 프라이머나 표면 처리 없이는 높은 접착력을 제공하지 않음 • 경화 저해(백금 촉매의 “피독”)']],
          ],
          note: { en: '¹ DOWSIL™ 3145 RTV Mil-A-46146 Adhesive/Sealant is available in clear translucent.', ko: '¹ DOWSIL™ 3145 RTV Mil-A-46146 접착제/실란트는 투명 반투명으로 제공됩니다.' },
        }),
    ],
    faq: [
      { q: { en: 'Which silicone chemistry gives the fastest green strength?', ko: '그린 스트렝스가 가장 빠른 실리콘 화학은 무엇입니까?' },
        a: { en: 'Per Table I, hot-melt (one-part) and two-part alkoxy rate best (•••) for green strength; hot melt provides instant green strength, and two-part alkoxy parts can be moved in under 4 hours.', ko: '표 I에서 그린 스트렝스 최고 등급(•••)은 핫멜트(1액형)와 2액형 알콕시입니다. 핫멜트는 즉각적인 그린 스트렝스를, 2액형 알콕시는 4시간 이내 부품 이동을 제공합니다.' } },
      { q: { en: 'Why can acetoxy silicone corrode metals?', ko: '아세톡시 실리콘이 금속을 부식시킬 수 있는 이유는 무엇입니까?' },
        a: { en: 'Acetoxy is an acid-cure chemistry (it releases acetic acid during cure), so it is acidic and potentially corrosive to metals, and has a strong odor.', ko: '아세톡시는 산 경화 화학이어서(경화 중 아세트산을 방출) 산성이며 금속을 부식시킬 수 있고 냄새가 강합니다.' } },
      { q: { en: 'Which chemistry suits compression gaskets?', ko: '압축 가스켓에는 어떤 화학이 적합합니까?' },
        a: { en: 'Platinum-cure two-part silicone foams: ideal for compression gaskets and environmental sealing, with low sealing force/modulus; they are not optimized for fluid sealing and can be inhibited (“poisoned”) by contaminants.', ko: '백금 경화 2액형 실리콘 폼입니다. 압축 가스켓과 환경 실링에 이상적이고 밀봉력/모듈러스가 낮지만, 유체 실링에는 최적화되지 않았고 오염물에 의해 경화가 저해(피독)될 수 있습니다.' } },
    ],
  },

  // ─────────────── 4
  {
    slug: 'acetoxy-sealants', no: 4, pdfPages: '6–7',
    title: { en: 'Table II: Acetoxy Sealants – DOWSIL™ 730 FS, 732, 734, 786, XIAMETER™ and AP', ko: '표 II: 아세톡시 실란트 – DOWSIL™ 730 FS·732·734·786, XIAMETER™, AP' },
    summary: { en: 'Specifications, applications and primerless adhesion of eight one-part acetoxy silicone sealants and coatings.', ko: '8종 1액형 아세톡시 실리콘 실란트·코팅의 물성, 용도, 프라이머 없는 접착 등급.' },
    answer: {
      en: 'Eight acetoxy products are listed: DOWSIL™ 730 FS (solvent-resistant), 732 (multi-purpose; FDA; NSF), 734 (flowable, self-leveling), 786 (mildew-resistant), XIAMETER™ CTG-1890 (protective coating), XIAMETER™ SLT-5132, XIAMETER™ SLT-3445 and DOWSIL™ AP. Service temperature is -57 to 177°C (204°C intermittent) for the first five products.',
      ko: '8종의 아세톡시 제품이 수록되어 있습니다: DOWSIL™ 730 FS(내용제성), 732(다목적; FDA; NSF), 734(유동성·자기수평), 786(곰팡이 저항성), XIAMETER™ CTG-1890(보호 코팅), XIAMETER™ SLT-5132, XIAMETER™ SLT-3445, DOWSIL™ AP. 처음 다섯 제품의 사용 온도는 -57~177°C(단속 204°C)입니다.',
    },
    image: IMG('ind-benefits'),
    sections: [
      sec('compare', 'Comparison table', '비교표', { k: 'matrix', ids: ACET, kind: 'sealant' }),
      sec('products', 'Products', '제품별 상세', { k: 'prods', ids: ACET },
        FN1, FN2,
        note('Listings/specs: FDA 21 CFR 177.2600 (original note 3); FDA 21 CFR 177.2600 and FDA 21 CFR 175.105 (original note 4).', '인증·규격 표기: FDA 21 CFR 177.2600(원문 각주 3), FDA 21 CFR 177.2600 및 21 CFR 175.105(원문 각주 4).')),
      sec('adhesion', 'Primerless adhesion', '프라이머 없는 접착', { k: 'adh', ids: ACET }),
    ],
    faq: [
      { q: { en: 'Which DOWSIL™ acetoxy sealant is solvent resistant?', ko: '내용제성 DOWSIL™ 아세톡시 실란트는 무엇입니까?' },
        a: { en: 'DOWSIL™ 730 FS Solvent Resistant Sealant, used for bonding, sealing and caulking where resistance to fuels, oils and solvents is required (sealant type for fluid resistance table: FVMQ).', ko: 'DOWSIL™ 730 FS 내용제성 실란트이며, 연료·오일·용제에 대한 저항성이 필요한 접착·실링·코킹에 사용합니다(내유체성 표 실란트 유형: FVMQ).' } },
      { q: { en: 'Which acetoxy sealant is FDA and NSF listed for general-purpose use?', ko: '범용으로 FDA·NSF 인증을 받은 아세톡시 실란트는 무엇입니까?' },
        a: { en: 'DOWSIL™ 732 Multi-Purpose Sealant: FDA 21 CFR 177.2600, NSF 51, NSF 61, UL 94 HB and MIL spec; colors aluminum, black, clear translucent, white.', ko: 'DOWSIL™ 732 다목적 실란트입니다: FDA 21 CFR 177.2600, NSF 51, NSF 61, UL 94 HB, MIL 규격; 색상은 알루미늄, 검정, 투명 반투명, 흰색.' } },
      { q: { en: 'Which acetoxy sealant resists mildew?', ko: '곰팡이에 강한 아세톡시 실란트는 무엇입니까?' },
        a: { en: 'DOWSIL™ 786 Silicone Sealant, for interior sealing applications exposed to high moisture such as tubs, sinks, plumbing fixtures and interior walls.', ko: 'DOWSIL™ 786 실리콘 실란트이며, 욕조·싱크·배관 설비·실내 벽 등 습도가 높은 실내 실링에 사용합니다.' } },
    ],
  },

  // ─────────────── 5
  {
    slug: 'high-temperature-sealants', no: 5, pdfPages: '7',
    title: { en: 'High-Temperature Acetoxy Sealants – DOWSIL™ 736 (315°C) and Q3-1566 (350°C)', ko: '고온용 아세톡시 실란트 – DOWSIL™ 736(315°C), Q3-1566(350°C)' },
    summary: { en: 'Heat-resistant sealants for ovens, boilers, flues and heating equipment with service temperatures to 260–275°C (315–350°C intermittent).', ko: '오븐, 보일러, 연도, 가열 장비용 내열 실란트. 사용 온도 260~275°C(단속 315~350°C).' },
    answer: {
      en: 'DOWSIL™ 736 Heat Resistant Sealant is rated -65 to 260°C (315°C intermittent) and DOWSIL™ Q3-1566 Heat Resistant Adhesive/Sealant -50 to 275°C (350°C intermittent), for sealing and bonding applications exposed to temperatures as high as 315°C and 350°C respectively.',
      ko: 'DOWSIL™ 736 내열 실란트는 -65~260°C(단속 315°C), DOWSIL™ Q3-1566 내열 접착제/실란트는 -50~275°C(단속 350°C)이며, 각각 최대 315°C와 350°C에 노출되는 실링·접착 용도에 사용합니다.',
    },
    image: IMG('ind-why-silicones'),
    sections: [
      sec('compare', 'Comparison table', '비교표', { k: 'matrix', ids: HT, kind: 'sealant' }),
      sec('products', 'Products', '제품별 상세', { k: 'prods', ids: HT }, FN1, FN2),
      sec('adhesion', 'Primerless adhesion', '프라이머 없는 접착', { k: 'adh', ids: HT }),
    ],
    faq: [
      { q: { en: 'Which silicone sealant can be used in ovens and boilers?', ko: '오븐이나 보일러에 사용할 수 있는 실리콘 실란트는 무엇입니까?' },
        a: { en: 'DOWSIL™ 736 Heat Resistant Sealant (fired heaters, flanged pipe joints, access doors, moving oven belts, industrial ovens and boilers, plywood drying ovens, bag filters on smokestacks, flues on gas appliances) and DOWSIL™ Q3-1566 (ovens, cookers and other heating equipment; automotive oil and coolant sealing).', ko: 'DOWSIL™ 736 내열 실란트(가열로, 플랜지 배관 이음부, 점검구, 이동식 오븐 벨트, 산업용 오븐·보일러, 합판 건조 오븐, 굴뚝 백필터, 가스 기기 연도)와 DOWSIL™ Q3-1566(오븐, 조리기, 기타 가열 장비, 자동차 오일·냉각수 실링)입니다.' } },
      { q: { en: 'What is the maximum temperature of DOWSIL™ Q3-1566?', ko: 'DOWSIL™ Q3-1566의 최고 사용 온도는 얼마입니까?' },
        a: { en: '-50 to 275°C continuous (350°C intermittent); it is intended for applications exposed to temperatures as high as 350°C.', ko: '연속 -50~275°C(단속 350°C)이며 최대 350°C에 노출되는 용도를 대상으로 합니다.' } },
    ],
  },

  // ─────────────── 6
  {
    slug: 'alkoxy-neutral-cure-sealants', no: 6, pdfPages: '8–9',
    title: { en: 'Table III: Alkoxy Neutral-Cure Sealants – DOWSIL™ 739, 748, 3145, 7091–7094, AS 7096N, 3559', ko: '표 III: 알콕시 중성 경화 실란트 – DOWSIL™ 739·748·3145·7091~7094·AS 7096N·3559' },
    summary: { en: 'Nine one-part neutral-cure sealants and adhesives: plastic adhesive, electrical, Mil Spec, high green strength, flowable and low-modulus grades.', ko: '플라스틱 접착제, 전기용, Mil Spec, 높은 그린 스트렝스, 유동성, 저모듈러스 등 9종 1액형 중성 경화 실란트·접착제.' },
    answer: {
      en: 'Nine alkoxy neutral-cure products are listed. DOWSIL™ 748 is FDA- and NSF-approved for electrical, food-processing and transportation uses; DOWSIL™ 7092 offers instant green strength; DOWSIL™ 7094 is flowable and self-leveling; DOWSIL™ 3145 can be considered for Mil Spec requirements (MIL-A-46146).',
      ko: '9종의 알콕시 중성 경화 제품이 수록되어 있습니다. DOWSIL™ 748은 전기·식품 가공·운송 용도로 FDA·NSF 승인을 받았고, DOWSIL™ 7092는 즉각적인 그린 스트렝스를, DOWSIL™ 7094는 유동성·자기수평을 제공하며, DOWSIL™ 3145는 Mil Spec(MIL-A-46146) 요건에 검토할 수 있습니다.',
    },
    image: IMG('ind-benefits'),
    sections: [
      sec('compare', 'Comparison table', '비교표', { k: 'matrix', ids: ALK, kind: 'sealant' }),
      sec('products', 'Products', '제품별 상세', { k: 'prods', ids: ALK }, FN1, FN2,
        note('Listings/specs: FDA 21 CFR 177.2600 and FDA 21 CFR 175.105 (original note 3 on this table).', '인증·규격 표기: FDA 21 CFR 177.2600 및 21 CFR 175.105(이 표의 원문 각주 3).')),
      sec('adhesion', 'Primerless adhesion', '프라이머 없는 접착', { k: 'adh', ids: ALK }),
    ],
    faq: [
      { q: { en: 'Which neutral-cure sealant is approved for food-processing and electrical use?', ko: '식품 가공과 전기 용도로 승인된 중성 경화 실란트는 무엇입니까?' },
        a: { en: 'DOWSIL™ 748 Non-Corrosive Sealant: FDA- and NSF-approved (FDA 21 CFR 177.2600 / 175.105, NSF 51, NSF 61, UL 94 HB); for electrical sealing applications and food-processing and transportation applications.', ko: 'DOWSIL™ 748 비부식성 실란트입니다: FDA·NSF 승인(FDA 21 CFR 177.2600/175.105, NSF 51, NSF 61, UL 94 HB); 전기 실링, 식품 가공, 운송 용도.' } },
      { q: { en: 'Which sealant offers instant green strength for immediate handling?', ko: '즉시 취급이 가능한 즉각적인 그린 스트렝스를 가진 실란트는 무엇입니까?' },
        a: { en: 'DOWSIL™ 7092 High Green Strength Adhesive and Sealant, for applications that require immediate handling and processing of the units; no buffer for strength buildup is required.', ko: 'DOWSIL™ 7092 고그린스트렝스 접착제·실란트이며, 유닛을 즉시 취급·가공해야 하는 용도에 사용하고 강도 발현을 위한 완충 시간이 필요 없습니다.' } },
      { q: { en: 'Which DOWSIL™ sealant is a plastic adhesive?', ko: '플라스틱용 DOWSIL™ 접착제는 무엇입니까?' },
        a: { en: 'DOWSIL™ 739 Plastic Adhesive, for adhering, bonding and sealing plastic and metal and for making formed-in-place gaskets.', ko: 'DOWSIL™ 739 플라스틱 접착제이며, 플라스틱과 금속의 부착·접착·실링 및 현장 성형 가스켓 제작에 사용합니다.' } },
    ],
  },

  // ─────────────── 7
  {
    slug: 'two-part-and-oxime-sealants', no: 7, pdfPages: '9–10',
    title: { en: 'Table IV: Two-Part Alkoxy and One-Part Oxime Sealants – DOWSIL™ EA-2626, Q3-3526, SILASTIC™ Q3-3636, DOWSIL™ 1080', ko: '표 IV: 2액형 알콕시·1액형 옥심 실란트 – DOWSIL™ EA-2626·Q3-3526, SILASTIC™ Q3-3636, DOWSIL™ 1080' },
    summary: { en: 'Fast-curing two-component neutral-cure adhesives for ovens, hobs and headlamps, plus DOWSIL™ 1080 one-part oxime sealant.', ko: '오븐·호브·헤드램프용 빠른 경화 2액형 중성 경화 접착제와 1액형 옥심 실란트 DOWSIL™ 1080.' },
    answer: {
      en: 'DOWSIL™ EA-2626 is a two-component neutral alkoxy adhesive/sealant with weathering, UV and heat resistance to 190°C, suited to oven and ceramic hob assembly; DOWSIL™ Q3-3526 and SILASTIC™ Q3-3636 are fast-curing two-part adhesives for headlamps and appliances; DOWSIL™ 1080 is a one-part oxime sealant for formed-in-place gaskets.',
      ko: 'DOWSIL™ EA-2626은 190°C까지 내후성·내UV성·내열성을 가진 2액형 중성 알콕시 접착제/실란트로 오븐·세라믹 호브 조립에 적합하고, DOWSIL™ Q3-3526과 SILASTIC™ Q3-3636은 헤드램프·가전용 빠른 경화 2액형 접착제이며, DOWSIL™ 1080은 현장 성형 가스켓용 1액형 옥심 실란트입니다.',
    },
    image: IMG('ind-application'),
    sections: [
      sec('compare', 'Comparison table', '비교표', { k: 'matrix', ids: TWO, kind: 'sealant' }),
      sec('products', 'Products', '제품별 상세',
        note('DOWSIL™ 1080 Oxime Sealant is printed with Table III in the original guide; it is grouped here with the other oxime/two-part products as in the title of Table IV.', 'DOWSIL™ 1080 옥심 실란트는 원문 가이드에서 표 III에 함께 인쇄되어 있으나, 표 IV의 제목(옥심 실란트)에 맞춰 여기에 함께 분류했습니다.'),
        { k: 'prods', ids: TWO }, FN1, FN2),
      sec('adhesion', 'Primerless adhesion', '프라이머 없는 접착', { k: 'adh', ids: TWO }),
    ],
    faq: [
      { q: { en: 'Which DOWSIL™ adhesive is recommended for oven and ceramic hob assembly?', ko: '오븐과 세라믹 호브 조립에 적합한 DOWSIL™ 접착제는 무엇입니까?' },
        a: { en: 'DOWSIL™ EA-2626 Adhesive Sealant (two-component, fast room-temperature cure, neutral alkoxy, heat resistance to 190°C) and SILASTIC™ Q3-3636 Adhesive are cited for oven and ceramic hob assembly and bonding glass to metal, painted metal or plastic.', ko: 'DOWSIL™ EA-2626 접착 실란트(2액형, 상온 빠른 경화, 중성 알콕시, 190°C 내열)와 SILASTIC™ Q3-3636 접착제가 오븐·세라믹 호브 조립 및 유리-금속/도장 금속/플라스틱 접착 용도로 제시됩니다.' } },
      { q: { en: 'How do two-part alkoxy silicones cure compared with moisture-cure adhesives?', ko: '2액형 알콕시 실리콘은 습기 경화 접착제와 어떻게 다르게 경화됩니까?' },
        a: { en: 'They cure in depth (through cure) rather than from the outside inward like typical moisture-cure adhesives, and are not humidity-cure-sensitive (SILASTIC™ Q3-3636).', ko: '일반적인 습기 경화 접착제처럼 바깥에서 안쪽으로 경화되지 않고 내부까지 경화되며, 습도에 민감하지 않습니다(SILASTIC™ Q3-3636).' } },
    ],
  },

  // ─────────────── 8
  {
    slug: 'hot-melt-sealants', no: 8, pdfPages: '11',
    title: { en: 'Table V: Hot-Melt Neutral-Cure Silicone Assembly Sealants – DOWSIL™ HM-2500, HM-2510, HM-2515, HM-2600', ko: '표 V: 핫멜트 중성 경화 실리콘 조립 실란트 – DOWSIL™ HM-2500·HM-2510·HM-2515·HM-2600' },
    summary: { en: 'Instant-adhesion, 100% silicone hot-melt sealants for OEM assembly, bonding, sealing and gasketing, with green strength, SAFT and primerless adhesion data.', ko: 'OEM 조립·접착·실링·가스켓용 즉시 접착 100% 실리콘 핫멜트 실란트. 그린 스트렝스, SAFT, 프라이머 없는 접착 데이터 수록.' },
    answer: {
      en: 'DOWSIL™ HM-2500 offers the fastest green strength build, HM-2510 high robustness, HM-2515 the lowest viscosity (27 Pa·s at 120°C) and HM-2600 the highest mechanical adhesion; all are 100% silicone, clear, FDA 21 CFR 177.2600 and NSF/ANSI 51 and 61 compliant, UL 94 HB (105).',
      ko: 'DOWSIL™ HM-2500은 가장 빠른 그린 스트렝스 발현, HM-2510은 높은 견고성, HM-2515는 가장 낮은 점도(120°C에서 27 Pa·s), HM-2600은 가장 높은 기계적 접착력을 제공합니다. 모두 100% 실리콘, 투명이며 FDA 21 CFR 177.2600, NSF/ANSI 51·61, UL 94 HB(105)를 충족합니다.',
    },
    image: IMG('ind-why-silicones'),
    sections: [
      sec('intro', 'Hot-melt neutral-cure sealants', '핫멜트 중성 경화 실란트',
        p('Hot-melt, neutral-cure sealants are intended for assembly, bonding, sealing, gasketing and other OEM applications that require instant adhesion and high green strength.',
          '핫멜트 중성 경화 실란트는 즉각적인 접착과 높은 그린 스트렝스가 필요한 조립, 접착, 실링, 가스켓 및 기타 OEM 용도를 위한 제품입니다.'),
        h('These sealants feature:', '이 실란트의 특징'),
        ul(
          ['Excellent adhesion to most substrates without the need for a primer', '프라이머 없이도 대부분의 기재에 대한 우수한 접착'],
          ['Instant adhesion, enabling parts to be shipped out quickly', '즉각적인 접착으로 부품을 신속하게 출하할 수 있음'],
          ['Long open time', '긴 오픈 타임'], ['Long pot life', '긴 포트 라이프'], ['Low VOC', '낮은 VOC'],
          ['Safe handling with nonhazardous composition and by-products', '비위험 조성과 부산물로 안전한 취급'],
          ['Long life once cured', '경화 후 긴 수명'],
        )),
      sec('compare', 'Comparison table', '비교표', { k: 'matrix', ids: HM, kind: 'hotmelt' }),
      sec('products', 'Products', '제품별 상세', { k: 'prods', ids: HM },
        note('2 180° peel from various substrates based on ASTM C794: 21-day cure (24 ±2°C; 50 ±5% RH) + 7-day H2O immersion. 3 Shear adhesion failure temperature based on ASTM 4498. 4 Qualified only under electronics or lighting industry label. (Note 1: Most paints will not adhere to sealant; not for underwater structural or adhesive applications; requires atmospheric moisture to cure. May stress-crack some plastics; test before use.)',
          '2 다양한 기재에 대한 180° 박리 강도, ASTM C794 기준: 21일 경화(24 ±2°C; 50 ±5% RH) + 7일 수중 침지. 3 전단 접착 파괴 온도, ASTM 4498 기준. 4 전자 또는 조명 산업 라벨 하에서만 적격. (각주 1: 대부분의 페인트는 실란트에 접착되지 않습니다. 수중 구조용 또는 접착 용도에는 적합하지 않으며 경화에 대기 중 수분이 필요합니다. 일부 플라스틱에 응력 균열을 일으킬 수 있으므로 사용 전에 시험하십시오.)')),
      sec('adhesion', 'Primerless adhesion', '프라이머 없는 접착', { k: 'adh', ids: HM }),
    ],
    faq: [
      { q: { en: 'What are hot-melt silicone sealants used for?', ko: '핫멜트 실리콘 실란트는 어디에 사용합니까?' },
        a: { en: 'Assembly, bonding, sealing, gasketing and other OEM applications that require instant adhesion and high green strength.', ko: '즉각적인 접착과 높은 그린 스트렝스가 필요한 조립, 접착, 실링, 가스켓 및 기타 OEM 용도에 사용합니다.' } },
      { q: { en: 'What are the limitations of hot-melt silicone sealants?', ko: '핫멜트 실리콘 실란트의 한계는 무엇입니까?' },
        a: { en: 'Not for total confinement (atmospheric moisture is required for cure), not for continuous water immersion, and not for surfaces that might bleed oils, plasticizers or solvents.', ko: '완전 밀폐 상태(경화에 대기 중 수분 필요), 연속 수중 침지, 오일·가소제·용제가 배어 나올 수 있는 표면에는 사용할 수 없습니다.' } },
      { q: { en: 'Which hot-melt sealant has the lowest viscosity?', ko: '점도가 가장 낮은 핫멜트 실란트는 무엇입니까?' },
        a: { en: 'DOWSIL™ HM-2515 Assembly Sealant (27 Pa·s at 120°C), dispensable in fine beads, fibers or spiral patterns and usable in assembly and lamination.', ko: 'DOWSIL™ HM-2515 조립 실란트(120°C에서 27 Pa·s)이며, 가는 비드·섬유·나선 패턴으로 토출할 수 있고 조립과 라미네이션에 사용할 수 있습니다.' } },
    ],
  },

  // ─────────────── 9
  {
    slug: 'silicone-foams', no: 9, pdfPages: '12',
    title: { en: 'Table VI: Two-Part Addition-Cure Silicone Foams – SILASTIC™ 8257, DOWSIL™ 3-8209, 3-8219 RF, 3-8259 RF', ko: '표 VI: 2액형 부가 경화 실리콘 폼 – SILASTIC™ 8257, DOWSIL™ 3-8209·3-8219 RF·3-8259 RF' },
    summary: { en: 'Formed-in-place compression gaskets: viscosity, snap time, density, hardness and cell structure of four silicone foam families.', ko: '현장 성형 압축 가스켓용 실리콘 폼 4종: 점도, 스냅 타임, 밀도, 경도, 기포 구조.' },
    answer: {
      en: 'Two-part, addition-cure silicone foams are dispensed and cured directly on parts to form an integrated compression gasket (RTV cure, 1:1 mix ratio, CFC-free, low post-cure compression set). Densities range from 140 to 330 kg/m³ and hardness from Shore 00 25 to 50 across SILASTIC™ 8257, DOWSIL™ 3-8209, 3-8219 RF and 3-8259 RF.',
      ko: '2액형 부가 경화 실리콘 폼은 부품 위에서 직접 토출·경화되어 일체형 압축 가스켓을 형성합니다(상온 경화, 1:1 혼합비, CFC 미함유, 낮은 후경화 압축 영구 변형). SILASTIC™ 8257, DOWSIL™ 3-8209, 3-8219 RF, 3-8259 RF의 밀도는 140~330 kg/m³, 경도는 Shore 00 25~50입니다.',
    },
    image: IMG('ind-which-silicone'),
    sections: [
      sec('intro', 'Silicone foams', '실리콘 폼',
        p('Two-part, addition-cure silicone foams are designed to be dispensed and cured directly on parts to form an integrated compression gasket. They typically are used in automotive parts, including seals for vibration and noise damping, housings for electronic devices, exterior lighting, and domestic appliance components.',
          '2액형 부가 경화 실리콘 폼은 부품 위에서 직접 토출·경화되어 일체형 압축 가스켓을 형성하도록 설계되었습니다. 진동·소음 감쇠용 실, 전자 기기 하우징, 외부 조명, 가정용 기기 부품 등 자동차 부품에 일반적으로 사용됩니다.'),
        h('These foams feature:', '이 폼의 특징'),
        ul(['Room temperature cure (RTV)', '상온 경화(RTV)'], ['1:1 mix ratio', '1:1 혼합비'], ['CFC-free content', 'CFC 미함유'], ['Low post-cure compression set', '낮은 후경화 압축 영구 변형'], ['Stability and flexibility across a wide range of temperatures', '넓은 온도 범위에서의 안정성과 유연성'])),
      sec('compare', 'Comparison table', '비교표', { k: 'matrix', ids: FOAM, kind: 'foam' }),
      sec('products', 'Products', '제품별 상세', { k: 'prods', ids: FOAM },
        note('Platinum catalysts used in addition-cure silicone sealants – including silicone foams – are sensitive to contamination by certain compounds that have the power to stop or inhibit cure (see “Application and Cure”).', '실리콘 폼을 포함한 부가 경화 실리콘 실란트에 쓰이는 백금 촉매는 경화를 멈추거나 저해할 수 있는 특정 화합물의 오염에 민감합니다(「시공과 경화」 페이지 참조).')),
    ],
    faq: [
      { q: { en: 'What are the mix ratio and cure of DOWSIL™ silicone foams?', ko: 'DOWSIL™ 실리콘 폼의 혼합비와 경화 방식은 무엇입니까?' },
        a: { en: 'Two-part, addition-cure foams with a 1:1 mix ratio and room temperature (RTV) cure; CFC-free with low post-cure compression set.', ko: '혼합비 1:1, 상온(RTV) 경화의 2액형 부가 경화 폼이며 CFC를 함유하지 않고 후경화 압축 영구 변형이 낮습니다.' } },
      { q: { en: 'What is the density of SILASTIC™ 8257 and DOWSIL™ 3-8259 RF foam?', ko: 'SILASTIC™ 8257과 DOWSIL™ 3-8259 RF 폼의 밀도는 얼마입니까?' },
        a: { en: 'SILASTIC™ 8257: 140 kg/m³ (white) and 150 kg/m³ (black); DOWSIL™ 3-8259 RF: 330 kg/m³ (gray and dark gray).', ko: 'SILASTIC™ 8257은 140 kg/m³(흰색), 150 kg/m³(검정), DOWSIL™ 3-8259 RF는 330 kg/m³(회색·짙은 회색)입니다.' } },
      { q: { en: 'Which silicone foam is suited to vertical surfaces?', ko: '수직면에 적합한 실리콘 폼은 무엇입니까?' },
        a: { en: 'DOWSIL™ 3-8219 RF and 3-8259 RF have reduced flow, which aids application to vertical surfaces.', ko: 'DOWSIL™ 3-8219 RF와 3-8259 RF는 흐름이 줄어 수직면 시공에 유리합니다.' } },
    ],
  },

  // ─────────────── 10
  {
    slug: 'surface-preparation', no: 10, pdfPages: '12',
    title: { en: 'Surface Preparation for Silicone Sealants', ko: '실리콘 실란트 접착을 위한 표면 준비' },
    summary: { en: 'How to clean, degrease and abrade surfaces, which solvents to use, and when to use plasma, corona, UV or flame pretreatment.', ko: '표면 세정·탈지·연마 방법, 사용 용제, 플라즈마·코로나·UV·화염 전처리가 필요한 경우.' },
    answer: {
      en: 'Maximum adhesion is only attained on clean, dry surfaces; contaminants such as dirt, grease, water, tar or rust act as release agents. Wipe with a clean oil-free cloth, re-wipe with IPA, mineral spirits, naphtha or ketones (do not use detergent or soap), lightly abrade, and let solvents evaporate completely before priming. A primer does not negate the need for proper cleaning.',
      ko: '최대 접착력은 깨끗하고 건조한 표면에서만 얻을 수 있으며, 먼지, 그리스, 물, 타르, 녹 같은 오염물은 이형제 역할을 합니다. 깨끗한 무유 천으로 닦고 IPA, 미네랄 스피릿, 나프타, 케톤으로 다시 닦되(세제·비누 사용 금지), 가볍게 연마하고, 프라이머 도포 전에 용제를 완전히 증발시키십시오. 프라이머를 사용해도 적절한 표면 세정은 여전히 필요합니다.',
    },
    image: IMG('ind-application'),
    sections: [
      sec('surface', 'Surface Preparation', '표면 준비',
        p('Although DOWSIL™ silicone sealants possess excellent bond strength, maximum adhesion is only attained on surfaces that are clean and dry. Contaminants – such as dirt, grease, water, tar or rust – act as release agents and prevent the formation of durable bonds. Use of a primer does not negate the necessity for proper surface cleaning.',
          'DOWSIL™ 실리콘 실란트는 우수한 접착 강도를 지니고 있지만, 최대 접착력은 깨끗하고 건조한 표면에서만 얻을 수 있습니다. 먼지, 그리스, 물, 타르, 녹 같은 오염물은 이형제로 작용하여 내구성 있는 접착의 형성을 방해합니다. 프라이머를 사용해도 적절한 표면 세정의 필요성이 없어지지는 않습니다.'),
        p('Wet or dirty surfaces should be properly prepared before sealants are applied.', '젖었거나 더러운 표면은 실란트를 시공하기 전에 적절히 준비해야 합니다.'),
        ul(
          ['Wipe contaminated surface with a clean, oil-free cloth.', '오염된 표면을 깨끗하고 기름기 없는 천으로 닦습니다.'],
          ['Rewipe surface with a suitable cleaner or industrial solvent, such as isopropyl alcohol (IPA), mineral spirits, naphtha or ketones. Note: Do not clean surface with detergent or soap. (Soap residue may act as release agent.)', '적합한 세정제 또는 이소프로필 알코올(IPA), 미네랄 스피릿, 나프타, 케톤 같은 산업용 용제로 표면을 다시 닦습니다. 참고: 세제나 비누로 표면을 세정하지 마십시오. (비누 잔류물이 이형제로 작용할 수 있습니다.)'],
          ['Rough rubber surfaces with sandpaper. Make a spot-check to determine the adhesion of sealants for each application. Bond strength will increase as the sealant cures.', '고무 표면은 사포로 거칠게 만듭니다. 각 용도별로 실란트의 접착력을 확인하기 위해 부분 점검(spot-check)을 합니다. 접착 강도는 실란트가 경화됨에 따라 증가합니다.'],
        ),
        p('The active ingredients must thoroughly wet-out and coat the bonding surfaces. Mild abrasion, solvent cleaning, plasma, corona discharge and other pretreatments have been used to clean and enhance surface reactivity to bonding. In general, light surface abrasion is recommended whenever possible, because it promotes good cleaning and increases the surface area for bonding. Clean and/or degrease surfaces with DOWSIL™ OS Fluids, naphtha, mineral spirits, methyl ethyl ketone (MEK), or other suitable solvents that will remove oils and other contaminants that may be present. A final surface wipe with acetone or IPA also may be helpful.',
          '활성 성분이 접착 표면을 충분히 적시고 덮어야 합니다. 접착을 위한 표면 반응성을 세정하고 높이기 위해 가벼운 연마, 용제 세정, 플라즈마, 코로나 방전 및 기타 전처리가 사용되어 왔습니다. 일반적으로 가능한 한 가벼운 표면 연마를 권장하는데, 세정이 잘 되고 접착 표면적이 늘어나기 때문입니다. DOWSIL™ OS 플루이드, 나프타, 미네랄 스피릿, 메틸 에틸 케톤(MEK) 또는 존재할 수 있는 오일과 기타 오염물을 제거할 수 있는 적절한 용제로 표면을 세정 및/또는 탈지하십시오. 마지막에 아세톤이나 IPA로 표면을 닦는 것도 도움이 될 수 있습니다.'),
        p('Some cleaning techniques may give better results than others; determine the best technique for your application. For especially difficult-to-bond-to surfaces, it may be necessary to increase the surface reactivity by using chemical etchants or oxidizers or by exposing the surface to UV, corona, plasma or flame sources. Allow solvents to completely evaporate before applying the primer.',
          '일부 세정 기법은 다른 기법보다 더 나은 결과를 줄 수 있으므로 용도에 가장 적합한 기법을 정하십시오. 특히 접착이 어려운 표면에서는 화학 에칭제나 산화제를 사용하거나 표면을 UV, 코로나, 플라즈마 또는 화염에 노출시켜 표면 반응성을 높여야 할 수 있습니다. 프라이머를 도포하기 전에 용제가 완전히 증발하도록 하십시오.')),
    ],
    faq: [
      { q: { en: 'How should surfaces be cleaned before applying silicone sealant?', ko: '실리콘 실란트를 시공하기 전에 표면을 어떻게 세정해야 합니까?' },
        a: { en: 'Wipe with a clean, oil-free cloth, then re-wipe with a suitable cleaner or solvent such as IPA, mineral spirits, naphtha or ketones; do not use detergent or soap (residue may act as a release agent); light abrasion is generally recommended; allow solvents to evaporate completely.', ko: '깨끗한 무유 천으로 닦은 뒤 IPA, 미네랄 스피릿, 나프타, 케톤 등 적합한 세정제·용제로 다시 닦고, 세제나 비누는 사용하지 않으며(잔류물이 이형제로 작용), 가벼운 연마를 일반적으로 권장하고 용제를 완전히 증발시킵니다.' } },
      { q: { en: 'Can a primer replace surface cleaning?', ko: '프라이머가 표면 세정을 대신할 수 있습니까?' },
        a: { en: 'No. Use of a primer does not negate the necessity for proper surface cleaning.', ko: '아니요. 프라이머를 사용해도 적절한 표면 세정의 필요성은 없어지지 않습니다.' } },
      { q: { en: 'What can be done for surfaces that are difficult to bond to?', ko: '접착이 어려운 표면에는 어떻게 합니까?' },
        a: { en: 'Increase surface reactivity using chemical etchants or oxidizers, or UV, corona, plasma or flame exposure.', ko: '화학 에칭제나 산화제를 사용하거나 UV, 코로나, 플라즈마, 화염에 노출시켜 표면 반응성을 높입니다.' } },
    ],
  },

  // ─────────────── 11
  {
    slug: 'primers-and-cleaners', no: 11, pdfPages: '13',
    title: { en: 'Table VII: Primers, Adhesion Promoters and Cleaners – DOWSIL™ PR-1200, 1200 OS, 1203, PR-2260, DS-1000, DS-2025, R41', ko: '표 VII: 프라이머·접착 증진제·세정제 – DOWSIL™ PR-1200·1200 OS·1203·PR-2260·DS-1000·DS-2025·R41' },
    summary: { en: 'When and how to prime, primer cure times (5–30 minutes), and DOWSIL™ primers and cleaners for cured and uncured silicone.', ko: '프라이머 도포 시기와 방법, 프라이머 경화 시간(5~30분), 경화·미경화 실리콘용 DOWSIL™ 프라이머와 세정제.' },
    answer: {
      en: 'For maximum adhesion DOWSIL™ primer is recommended: after solvent-cleaning, apply a very light, even coat by wiping, dipping or spraying and wipe off excess. Air-dry 5 to 30 minutes at room temperature and 50% RH; temperatures above 60°C are not recommended. Apply the sealant only after the primer has fully cured.',
      ko: '최대 접착력을 위해 DOWSIL™ 프라이머를 권장합니다. 용제 세정 후 닦기, 침지 또는 스프레이로 아주 얇고 고르게 도포하고 과도한 양은 닦아냅니다. 상온·50% RH에서 5~30분 자연 건조하며 60°C 초과 가열은 권장하지 않습니다. 프라이머가 완전히 경화된 후에 실란트를 시공하십시오.',
    },
    image: IMG('ind-application'),
    sections: [
      sec('primers', 'Primers and Adhesion Promoters', '프라이머 및 접착 증진제',
        p('For maximum adhesion, DOWSIL™ primer is recommended. After solvent-cleaning, apply a thin coat of DOWSIL™ primer in a very light, even coat by wiping, dipping or spraying. Wipe off excess material to avoid overapplication, which generally appears as a white, chalky surface. When dip- or spray-coating, diluting by a factor of 2 to 4 with additional solvent may avoid excessive buildup.',
          '최대 접착력을 위해 DOWSIL™ 프라이머를 권장합니다. 용제 세정 후 닦기, 침지 또는 스프레이로 DOWSIL™ 프라이머를 아주 얇고 고르게 도포합니다. 과도하게 도포되면 일반적으로 표면이 하얗고 분필 같은 상태가 되므로 남는 재료는 닦아냅니다. 침지 또는 스프레이 도포 시에는 용제를 더해 2~4배로 희석하면 과도한 적층을 피할 수 있습니다.'),
        h('Primer Cure', '프라이머 경화'),
        p('At normal room temperatures and 50% relative humidity conditions, allow the primer to air-dry from five to 30 minutes. Low-humidity and/or low-temperature conditions require longer cure times. Mild heat acceleration of the cure rate may be possible, but temperatures above 60°C are not recommended. During application, the carrier solvent typically evaporates quickly, allowing the active ingredients to begin to react with atmospheric moisture and bonding surfaces. For optimal bonding, different cure times may be required for different temperature and humidity conditions; determine the best cure schedule and conditions for your application. Apply the desired silicone sealant after the primer, prime coat or adhesion promoter has fully cured.',
          '일반적인 실온과 상대습도 50% 조건에서 프라이머를 5~30분간 자연 건조시킵니다. 저습도 및/또는 저온 조건에서는 더 긴 경화 시간이 필요합니다. 가벼운 가열로 경화 속도를 높일 수도 있으나 60°C를 넘는 온도는 권장하지 않습니다. 도포하는 동안 캐리어 용제는 대개 빠르게 증발하고, 그 사이 활성 성분이 대기 중 수분 및 접착 표면과 반응하기 시작합니다. 최적의 접착을 위해서는 온도와 습도 조건에 따라 서로 다른 경화 시간이 필요할 수 있으므로 용도에 맞는 최적의 경화 일정과 조건을 정하십시오. 프라이머, 프라임 코트 또는 접착 증진제가 완전히 경화된 후에 원하는 실리콘 실란트를 시공하십시오.')),
      sec('table-7', 'Table VII. Cleaners and Primers', '표 VII. 세정제 및 프라이머', { k: 'prods', ids: PRIM }),
    ],
    faq: [
      { q: { en: 'How long should a DOWSIL™ primer dry before applying sealant?', ko: 'DOWSIL™ 프라이머는 실란트 시공 전에 얼마나 건조시켜야 합니까?' },
        a: { en: 'At normal room temperature and 50% relative humidity, five to 30 minutes of air drying; low humidity or low temperature requires longer. Apply the sealant after the primer has fully cured.', ko: '일반적인 실온과 상대습도 50%에서 5~30분 자연 건조하며, 저습·저온에서는 더 오래 걸립니다. 프라이머가 완전히 경화된 후 실란트를 시공합니다.' } },
      { q: { en: 'What happens if too much primer is applied?', ko: '프라이머를 너무 많이 바르면 어떻게 됩니까?' },
        a: { en: 'Overapplication generally appears as a white, chalky surface; wipe off excess material, and dilute 2 to 4 times with solvent when dip- or spray-coating.', ko: '과도한 도포는 일반적으로 하얗고 분필 같은 표면으로 나타납니다. 남는 재료는 닦아내고, 침지·스프레이 도포 시 용제로 2~4배 희석합니다.' } },
      { q: { en: 'Which DOWSIL™ cleaner removes cured silicone residue?', ko: '경화된 실리콘 잔류물을 제거하는 DOWSIL™ 세정제는 무엇입니까?' },
        a: { en: 'DOWSIL™ DS-2025 Silicone Cleaning Solvent (rapid digestion of cured silicone, leaves a silicone-free surface); DOWSIL™ DS-1000 Aqueous Silicone Cleaner is for uncured silicone.', ko: 'DOWSIL™ DS-2025 실리콘 세정 용제(경화 실리콘을 빠르게 분해하여 실리콘 없는 표면을 남김)입니다. DOWSIL™ DS-1000 수성 실리콘 세정제는 미경화 실리콘용입니다.' } },
    ],
  },

  // ─────────────── 12
  {
    slug: 'application-and-cure', no: 12, pdfPages: '14',
    title: { en: 'Sealant Application, Cure Time, Compatibility and Cleanup', ko: '실란트 시공, 경화 시간, 상용성 및 제거' },
    summary: { en: 'Skin-over in 5–10 minutes, cure depth of about 1/8" in 24 hours, tooling, acetic-acid corrosion, platinum inhibitors, sealant removal and safety information.', ko: '5~10분 피막 형성, 24시간에 약 1/8인치 경화, 툴링, 아세트산 부식, 백금 저해 물질, 실란트 제거, 안전 정보.' },
    answer: {
      en: 'Freshly applied DOWSIL™ sealant skins over in about 5 to 10 minutes at room temperature and 50% RH, and cures inward to a depth of about 1/8" in 24 hours. Tool before the skin forms. Acetoxy products release a small amount of acetic acid during cure that may corrode some metals; platinum-cure silicones (including foams) can be inhibited by certain compounds.',
      ko: '새로 시공한 DOWSIL™ 실란트는 상온·50% RH에서 약 5~10분 후 표면 피막이 형성되고 24시간 동안 약 1/8인치 깊이까지 안쪽으로 경화됩니다. 피막이 생기기 전에 툴링을 마쳐야 합니다. 아세톡시 제품은 경화 중 소량의 아세트산을 방출해 일부 금속을 부식시킬 수 있고, 백금 경화 실리콘(폼 포함)은 특정 화합물에 의해 경화가 저해될 수 있습니다.',
    },
    image: IMG('ind-application'),
    sections: [
      sec('application', 'Sealant Application', '실란트 시공',
        fig(IMG('ind-application'), 'Dispensing DOWSIL™ silicone sealant', 'DOWSIL™ 실리콘 실란트 토출'),
        p('Apply DOWSIL™ brand adhesives/sealants to one of the prepared surfaces, then quickly cover with the other substrate to be bonded. On exposure to moisture, the freshly applied material will “skin over” in about 5 to 10 minutes (depending on the product) at room temperature and 50% relative humidity.',
          'DOWSIL™ 브랜드 접착제/실란트를 준비된 표면 중 한쪽에 도포한 뒤, 접착할 다른 기재로 신속히 덮습니다. 습기에 노출되면 새로 시공된 재료는 상온·상대습도 50%에서 (제품에 따라) 약 5~10분 안에 “표면 피막(skin over)”이 형성됩니다.'),
        p('Tool the sealant to coat or wet the substrate surface for maximum bonding. This typically is done by properly filling the joint first and then dry-tooling the sealant by pressing and pulling a round-tipped spatula or similar tool across the sealant surface. This step forces sealant into joint surfaces and helps remove air pockets or voids at the bond line. Tooling should be completed before the skin forms.',
          '최대 접착을 위해 실란트를 툴링하여 기재 표면에 밀착·젖음이 되게 합니다. 일반적으로 줄눈을 먼저 충분히 채운 다음, 둥근 끝의 주걱이나 유사한 도구를 실란트 표면 위로 눌러 끌어 건식 툴링합니다. 이 과정은 실란트를 줄눈 표면으로 밀어 넣고 접착선의 기포나 공극을 제거하는 데 도움이 됩니다. 툴링은 피막이 형성되기 전에 마쳐야 합니다.'),
        p('Keeping the primed surface clean may allow application of the silicone elastomer to be delayed – but in some cases, if too much time elapses, lower adhesion can result. Users are encouraged to determine the optimal cure conditions for their specific applications and the effects of any hold times imposed between applications of the primer and sealant. In some cases, it may be recommended to reprime surfaces if 8 to 24 hours elapse before the silicone sealant can be applied.',
          '프라이머 처리된 표면을 깨끗하게 유지하면 실리콘 엘라스토머 시공을 늦출 수 있지만, 경우에 따라 시간이 너무 많이 지나면 접착력이 낮아질 수 있습니다. 사용자는 구체적인 용도에 맞는 최적의 경화 조건과, 프라이머와 실란트 시공 사이에 두는 대기 시간의 영향을 확인할 것을 권장합니다. 경우에 따라 실리콘 실란트를 시공하기까지 8~24시간이 지났다면 표면을 다시 프라이머 처리할 것이 권장될 수 있습니다.')),
      sec('cure', 'Cure Time', '경화 시간',
        p('After skin formation, cure continues inward from the surface. In 24 hours (at room temperature and 50% relative humidity), DOWSIL™ adhesive/sealant will cure to a depth of about 1/8". Very deep sections, especially when access to atmospheric moisture is restricted, will take longer to cure completely. Cure time is extended at lower humidity levels.',
          '피막이 형성된 후 경화는 표면에서 안쪽으로 계속 진행됩니다. 24시간(상온, 상대습도 50%) 동안 DOWSIL™ 접착제/실란트는 약 1/8인치(약 3 mm) 깊이까지 경화됩니다. 특히 대기 중 수분의 접근이 제한된 매우 깊은 부위는 완전히 경화되는 데 더 오래 걸립니다. 습도가 낮으면 경화 시간이 길어집니다.'),
        p('Because the sealants cure by reaction with moisture in the air, keep the container tightly sealed when not in use. A plug of used material may form in the tip of a tube or cartridge during storage. This is easily removed and does not affect the remaining contents.',
          '실란트는 공기 중 수분과 반응하여 경화되므로 사용하지 않을 때는 용기를 단단히 밀봉해 두십시오. 보관 중 튜브나 카트리지 끝에 사용된 재료의 마개(plug)가 생길 수 있습니다. 이는 쉽게 제거할 수 있으며 나머지 내용물에는 영향을 주지 않습니다.')),
      sec('compatibility', 'Compatibility', '상용성',
        p('Some DOWSIL™ adhesives/sealants release a small amount of acetic acid during cure. This may cause corrosion on some metallic parts or substrates, especially in direct contact or when the cure is carried out in a totally enclosed environment that does not allow cure by-products to escape.',
          '일부 DOWSIL™ 접착제/실란트는 경화 중 소량의 아세트산을 방출합니다. 이는 일부 금속 부품이나 기재, 특히 직접 접촉하거나 경화 부산물이 빠져나가지 못하는 완전 밀폐 환경에서 경화할 때 부식을 일으킬 수 있습니다.'),
        p('Platinum catalysts used in addition-cure silicone sealants – including silicone foams – are sensitive to contamination by certain compounds that have the power to stop or inhibit cure. For more information, refer to “Guarding against potential inhibitors/poisons of platinum-catalyzed addition-cure release coatings,” Form No. 30-1053-01, available in the Technical Library on consumer.dow.com or upon request from Dow customer service.',
          '실리콘 폼을 포함한 부가 경화 실리콘 실란트에 사용되는 백금 촉매는 경화를 멈추거나 저해할 수 있는 특정 화합물의 오염에 민감합니다. 자세한 내용은 consumer.dow.com의 기술 라이브러리 또는 Dow 고객 서비스 요청으로 제공되는 「Guarding against potential inhibitors/poisons of platinum-catalyzed addition-cure release coatings」(Form No. 30-1053-01)를 참조하십시오.')),
      sec('cleanup', 'Cleanup / Sealant Removal', '세척 및 실란트 제거',
        p('Cured silicone can be removed from a surface with a sharp blade if the cured silicone material is accessible. If it is difficult to cut through, solvents – such as IPA, toluene, xylene, naphtha or mineral spirits – may be used to soften the cured sealant. DOWSIL™ OS Fluids also can be used to help soften cured silicone and/or remove silicone residue after it has been removed mechanically from a surface. DOWSIL™ OS Fluids will generally be a lower-VOC alternative to standard solvents.',
          '경화된 실리콘은 접근이 가능하면 날카로운 칼날로 표면에서 제거할 수 있습니다. 자르기 어려운 경우 IPA, 톨루엔, 자일렌, 나프타, 미네랄 스피릿 같은 용제로 경화된 실란트를 연화시킬 수 있습니다. DOWSIL™ OS 플루이드도 경화 실리콘을 연화하거나, 기계적으로 제거한 뒤 남은 실리콘 잔류물을 제거하는 데 사용할 수 있으며, 일반적으로 표준 용제보다 VOC가 낮은 대안입니다.')),
      sec('limitations', 'Limitations, Health and Environmental Information', '제한 사항, 보건 및 환경 정보',
        p('Limitations: Refer to individual product data sheets for use limitations.', '제한 사항: 사용 제한 사항은 개별 제품의 데이터 시트를 참조하십시오.'),
        p('Health and Environmental Information: To support customers in their product safety needs, Dow has an extensive Product Stewardship organization and a team of Product Safety and Regulatory Compliance (PS&RC) specialists available in each area. For more information, please see our website, consumer.dow.com, or consult your local Dow representative.',
          '보건 및 환경 정보: 고객의 제품 안전 요구를 지원하기 위해 Dow는 광범위한 제품 관리(Product Stewardship) 조직과 각 지역별 제품 안전 및 규제 준수(PS&RC) 전문가 팀을 운영합니다. 자세한 내용은 웹사이트 consumer.dow.com을 참조하거나 현지 Dow 담당자에게 문의하십시오.')),
    ],
    faq: [
      { q: { en: 'How long does DOWSIL™ sealant take to skin over and cure?', ko: 'DOWSIL™ 실란트의 표면 피막 형성과 경화에는 얼마나 걸립니까?' },
        a: { en: 'It skins over in about 5 to 10 minutes (depending on the product) at room temperature and 50% RH, then cures inward to about 1/8" in 24 hours; deep sections or limited moisture access and low humidity take longer.', ko: '상온·50% RH에서 (제품에 따라) 약 5~10분 안에 표면 피막이 형성되고, 24시간 동안 약 1/8인치 깊이까지 안쪽으로 경화됩니다. 깊은 부위, 수분 접근 제한, 낮은 습도에서는 더 오래 걸립니다.' } },
      { q: { en: 'When should the sealant be tooled?', ko: '실란트는 언제 툴링해야 합니까?' },
        a: { en: 'Tooling (dry-tooling with a round-tipped spatula) should be completed before the skin forms, to force sealant into the joint surfaces and remove air pockets or voids.', ko: '표면 피막이 형성되기 전에 둥근 끝 주걱으로 건식 툴링을 마쳐서 실란트를 줄눈 표면에 밀어 넣고 기포·공극을 제거해야 합니다.' } },
      { q: { en: 'How do you remove cured silicone sealant?', ko: '경화된 실리콘 실란트는 어떻게 제거합니까?' },
        a: { en: 'Cut it with a sharp blade if accessible; otherwise soften with IPA, toluene, xylene, naphtha or mineral spirits. DOWSIL™ OS Fluids, generally a lower-VOC alternative, can help soften it and remove residue.', ko: '접근 가능하면 날카로운 칼날로 자르고, 어려우면 IPA, 톨루엔, 자일렌, 나프타, 미네랄 스피릿으로 연화합니다. 일반적으로 VOC가 더 낮은 DOWSIL™ OS 플루이드도 연화와 잔류물 제거에 도움이 됩니다.' } },
      { q: { en: 'What can inhibit the cure of silicone foams?', ko: '실리콘 폼의 경화를 저해하는 것은 무엇입니까?' },
        a: { en: 'Platinum catalysts in addition-cure silicones, including foams, are sensitive to contamination by certain compounds that can stop or inhibit cure (Dow Form No. 30-1053-01).', ko: '폼을 포함한 부가 경화 실리콘의 백금 촉매는 경화를 멈추거나 저해할 수 있는 특정 화합물의 오염에 민감합니다(Dow Form No. 30-1053-01).' } },
    ],
  },

  // ─────────────── 13
  {
    slug: 'product-selector', no: 13, pdfPages: '5–13',
    title: { en: 'Product Selector – Compare All DOWSIL™ Industrial, Appliance and Maintenance Sealants', ko: '제품 선정 가이드 – DOWSIL™ 산업·가전·유지보수용 실란트 전체 비교' },
    summary: { en: 'One-page comparison of all 38 products by chemistry, temperature range, cure, hardness, tensile and elongation, plus a requirement-to-product quick guide.', ko: '화학 조성, 사용 온도, 경화, 경도, 인장·신율 기준으로 38개 제품 전체를 한 페이지에서 비교하고, 요구 조건별 제품 빠른 안내 제공.' },
    answer: {
      en: 'Use this page to compare every sealant, adhesive, foam, primer and cleaner in Dow’s selection guide. Highest rated service temperature: DOWSIL™ Q3-1566 (-50 to 275°C, 350°C intermittent). Instant green strength: hot-melt HM series and DOWSIL™ 7092. Compression gaskets: platinum-cure silicone foams. Food and water contact listings: DOWSIL™ 732 and 748 (FDA, NSF).',
      ko: '이 페이지에서 Dow 선정 가이드의 모든 실란트, 접착제, 폼, 프라이머, 세정제를 비교할 수 있습니다. 사용 온도가 가장 높은 제품은 DOWSIL™ Q3-1566(-50~275°C, 단속 350°C), 즉각적인 그린 스트렝스는 핫멜트 HM 시리즈와 DOWSIL™ 7092, 압축 가스켓은 백금 경화 실리콘 폼, 식품·물 접촉 인증은 DOWSIL™ 732와 748(FDA, NSF)입니다.',
    },
    image: IMG('ind-cover'),
    sections: [
      sec('quick', 'Quick guide by requirement', '요구 조건별 빠른 안내',
        p('The following quick guide is compiled from the product tables of Dow’s selection guide (Tables I–VII). Always verify with the individual product data sheet.',
          '다음 빠른 안내는 Dow 선정 가이드의 제품 표(표 I~VII)를 바탕으로 정리한 것입니다. 반드시 개별 제품 데이터 시트로 확인하십시오.'),
        {
          k: 'tbl',
          head: [['Requirement', '요구 조건'], ['Candidate products (per Dow guide)', '후보 제품 (Dow 가이드 기준)']],
          rows: [
            [['Solvent, fuel and oil resistance', '용제·연료·오일 저항성'], 'DOWSIL™ 730 FS'],
            [['Highest temperature (to 350°C intermittent)', '최고 사용 온도(단속 350°C)'], 'DOWSIL™ Q3-1566; DOWSIL™ 736 (315°C intermittent)'],
            [['Instant green strength / immediate handling', '즉각적인 그린 스트렝스 / 즉시 취급'], ['DOWSIL™ HM-2500, HM-2510, HM-2515, HM-2600; DOWSIL™ 7092', 'DOWSIL™ HM-2500, HM-2510, HM-2515, HM-2600; DOWSIL™ 7092']],
            [['FDA / NSF listings', 'FDA·NSF 인증'], 'DOWSIL™ 732, 748; HM-2500/2510/2515/2600 (FDA 21 CFR 177.2600, NSF/ANSI 51 & 61)'],
            [['Mildew resistance (wet interiors)', '곰팡이 저항성(습한 실내)'], 'DOWSIL™ 786'],
            [['Plastic bonding', '플라스틱 접착'], 'DOWSIL™ 739'],
            [['Electrical and electronic sealing', '전기·전자 실링'], 'DOWSIL™ 748, 3145; DOWSIL™ 734 (potting electrical terminals); XIAMETER™ CTG-1890 (coating electrical equipment)'],
            [['Mil Spec (MIL-A-46146)', 'Mil Spec(MIL-A-46146)'], 'DOWSIL™ 3145'],
            [['Non-corrosive neutral cure (metals)', '금속에 부식 없는 중성 경화'], ['DOWSIL™ 748, 7093, 7094, AS 7096N, 3559, 1080', 'DOWSIL™ 748, 7093, 7094, AS 7096N, 3559, 1080']],
            [['Oven / ceramic hob assembly, glass-to-metal bonding', '오븐·세라믹 호브 조립, 유리-금속 접착'], 'DOWSIL™ EA-2626; SILASTIC™ Q3-3636'],
            [['Automotive headlamp assembly', '자동차 헤드램프 조립'], 'DOWSIL™ Q3-3526; SILASTIC™ Q3-3636'],
            [['Self-leveling / flowable', '자기수평 / 유동성'], 'DOWSIL™ 734, 7094'],
            [['Protective coating for motors and electrical equipment', '모터·전기 장비 보호 코팅'], 'XIAMETER™ CTG-1890'],
            [['Compression gaskets / environmental seals', '압축 가스켓 / 환경 실링'], 'SILASTIC™ 8257; DOWSIL™ 3-8209, 3-8219 RF, 3-8259 RF'],
            [['Improve adhesion (primer)', '접착력 향상(프라이머)'], 'DOWSIL™ PR-1200, 1200 OS, 1203, PR-2260'],
            [['Clean cured / uncured silicone', '경화/미경화 실리콘 세정'], 'DOWSIL™ DS-2025 (cured); DS-1000 (uncured); R41 (prepare substrates)'],
          ],
        }),
      sec('sealants', 'All one-part and two-part sealants', '1액형·2액형 실란트 전체 비교', { k: 'matrix', ids: ALL_SEALANTS, kind: 'sealant' }),
      sec('hotmelt', 'Hot-melt assembly sealants', '핫멜트 조립 실란트', { k: 'matrix', ids: HM, kind: 'hotmelt' }),
      sec('foams', 'Silicone foams', '실리콘 폼', { k: 'matrix', ids: FOAM, kind: 'foam' }),
      sec('adhesion', 'Primerless adhesion by substrate', '기재별 프라이머 없는 접착 등급', { k: 'adh', ids: [...ALL_SEALANTS, ...HM] }),
    ],
    faq: [
      { q: { en: 'Which DOWSIL™ sealant has the highest service temperature?', ko: '사용 온도가 가장 높은 DOWSIL™ 실란트는 무엇입니까?' },
        a: { en: 'DOWSIL™ Q3-1566 Heat Resistant Adhesive/Sealant: -50 to 275°C (350°C intermittent). DOWSIL™ 736 follows at -65 to 260°C (315°C intermittent).', ko: 'DOWSIL™ Q3-1566 내열 접착제/실란트(-50~275°C, 단속 350°C)입니다. 다음은 DOWSIL™ 736(-65~260°C, 단속 315°C)입니다.' } },
      { q: { en: 'Which products are listed for FDA and NSF?', ko: 'FDA와 NSF 인증을 받은 제품은 무엇입니까?' },
        a: { en: 'DOWSIL™ 732 (FDA 21 CFR 177.2600, NSF 51, NSF 61), DOWSIL™ 748 (FDA, NSF 51, NSF 61), DOWSIL™ 734 and 786 (FDA, NSF 51), and the HM-2500/2510/2515/2600 hot-melt sealants (FDA 21 CFR 177.2600; NSF/ANSI 51 and 61).', ko: 'DOWSIL™ 732(FDA 21 CFR 177.2600, NSF 51, NSF 61), DOWSIL™ 748(FDA, NSF 51, NSF 61), DOWSIL™ 734·786(FDA, NSF 51), 핫멜트 HM-2500/2510/2515/2600(FDA 21 CFR 177.2600; NSF/ANSI 51·61)입니다.' } },
    ],
  },

  // ─────────────── 14
  {
    slug: 'notice-and-contact', no: 14, pdfPages: '16',
    title: { en: 'Handling Precautions, Limited Warranty and Contact', ko: '취급 주의사항, 제한 보증 및 문의' },
    summary: { en: 'Safety data sheet requirement, Dow limited warranty information and how to reach Dow and KCT.', ko: '안전보건자료(SDS) 확인 의무, Dow 제한 보증 정보, Dow 및 KCT 연락처.' },
    answer: {
      en: 'Product safety information required for safe use is not included in the selection guide; read the product and safety data sheets and container labels before handling. Dow’s sole warranty is that products will meet the sales specifications in effect at the time of shipment.',
      ko: '안전한 사용에 필요한 제품 안전 정보는 이 선정 가이드에 포함되어 있지 않습니다. 취급 전에 제품 및 안전보건자료와 용기 라벨을 읽으십시오. Dow의 유일한 보증은 제품이 출하 시점에 유효한 판매 규격을 충족한다는 것입니다.',
    },
    image: IMG('ind-cover'),
    sections: [
      sec('handling', 'Handling Precautions', '취급 주의사항',
        p('PRODUCT SAFETY INFORMATION REQUIRED FOR SAFE USE IS NOT INCLUDED IN THIS DOCUMENT. BEFORE HANDLING, READ PRODUCT AND SAFETY DATA SHEETS AND CONTAINER LABELS FOR SAFE USE, PHYSICAL AND HEALTH HAZARD INFORMATION. THE SAFETY DATA SHEET IS AVAILABLE ON THE DOW WEBSITE AT WWW.CONSUMER.DOW.COM, OR FROM YOUR DOW SALES APPLICATION ENGINEER, OR DISTRIBUTOR, OR BY CALLING DOW CUSTOMER SERVICE.',
          '안전한 사용에 필요한 제품 안전 정보는 이 문서에 포함되어 있지 않습니다. 취급 전에 안전한 사용, 물리적·건강 유해 정보를 위해 제품 및 안전보건자료(SDS)와 용기 라벨을 읽으십시오. 안전보건자료는 Dow 웹사이트 WWW.CONSUMER.DOW.COM, Dow 영업 응용 엔지니어, 유통업체 또는 Dow 고객 서비스 전화로 받을 수 있습니다.')),
      sec('warranty', 'Limited Warranty Information', '제한 보증 정보',
        p('The information contained herein is offered in good faith and is believed to be accurate. However, because conditions and methods of use of our products are beyond our control, this information should not be used in substitution for customer’s tests to ensure that our products are safe, effective and fully satisfactory for the intended end use. Suggestions of use shall not be taken as inducements to infringe any patent. Dow’s sole warranty is that our products will meet the sales specifications in effect at the time of shipment. Your exclusive remedy for breach of such warranty is limited to refund of purchase price or replacement of any product shown to be other than as warranted.',
          '여기에 포함된 정보는 선의로 제공되며 정확하다고 믿어집니다. 그러나 당사 제품의 사용 조건과 방법은 당사의 통제 범위 밖에 있으므로, 이 정보를 고객의 시험을 대체하는 용도로 사용해서는 안 되며 당사 제품이 의도한 최종 용도에 안전하고 효과적이며 완전히 만족스러운지 고객이 직접 시험으로 확인해야 합니다. 사용에 대한 제안은 어떠한 특허 침해도 유도하는 것으로 해석되어서는 안 됩니다. Dow의 유일한 보증은 당사 제품이 출하 시점에 유효한 판매 규격을 충족한다는 것입니다. 이러한 보증 위반에 대한 고객의 독점적 구제 수단은 구매 금액의 환불 또는 보증된 바와 다른 것으로 확인된 제품의 교환으로 제한됩니다.'),
        p('TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, DOW SPECIFICALLY DISCLAIMS ANY OTHER EXPRESS OR IMPLIED WARRANTY OF FITNESS FOR A PARTICULAR PURPOSE OR MERCHANTABILITY. DOW DISCLAIMS LIABILITY FOR ANY INCIDENTAL OR CONSEQUENTIAL DAMAGES.',
          '관련 법률이 허용하는 최대 범위에서, Dow는 특정 목적에의 적합성 또는 상품성에 대한 기타 모든 명시적 또는 묵시적 보증을 명시적으로 부인합니다. Dow는 모든 부수적 또는 결과적 손해에 대한 책임을 부인합니다.'),
        p('® ™ Trademark of The Dow Chemical Company (“Dow”) or an affiliated company of Dow · © 2022 The Dow Chemical Company. All rights reserved. · Form No. 80-8283-01-0922 S2D',
          '® ™ The Dow Chemical Company(“Dow”) 또는 Dow 계열사의 상표 · © 2022 The Dow Chemical Company. All rights reserved. · Form No. 80-8283-01-0922 S2D')),
      sec('contact', 'Contact Us', '문의',
        p('For more than 60 years, OEM designers, maintenance and materials engineers around the world have trusted Dow for performance and expertise to solve or prevent sealant challenges. Dow has sales offices, manufacturing sites, and science and technology laboratories – and a network of more than 3,000 distributors – around the world. To learn more about our extensive product and service offerings, order samples, or find a local distributor, visit consumer.dow.com.',
          '60년 넘게 전 세계의 OEM 설계자, 유지보수 및 재료 엔지니어는 실란트 관련 문제를 해결하거나 예방하기 위해 Dow의 성능과 전문성을 신뢰해 왔습니다. Dow는 전 세계에 영업소, 생산 시설, 과학기술 연구소를 두고 있으며 3,000개 이상의 유통업체 네트워크를 보유하고 있습니다. 광범위한 제품·서비스, 샘플 주문, 현지 유통업체는 consumer.dow.com에서 확인하십시오.'),
        p('For KCT (Korea Construction Trading) product inquiries and quotations: sales@kconstrade.com · +82-10-8939-0284', '한국건설트레이딩(KCT) 제품 문의 및 견적: sales@kconstrade.com · +82-10-8939-0284')),
    ],
    faq: [
      { q: { en: 'Where can I get the safety data sheet (SDS) for DOWSIL™ products?', ko: 'DOWSIL™ 제품의 안전보건자료(SDS)는 어디서 구할 수 있습니까?' },
        a: { en: 'From the Dow website at consumer.dow.com, from your Dow sales application engineer or distributor, or by calling Dow customer service. KCT can also provide TDS and SDS on request (sales@kconstrade.com).', ko: 'Dow 웹사이트 consumer.dow.com, Dow 영업 응용 엔지니어 또는 유통업체, Dow 고객 서비스 전화로 받을 수 있습니다. KCT에 요청(sales@kconstrade.com)하셔도 TDS·SDS를 제공해 드립니다.' } },
    ],
  },
]

export const getIPage = (slug: string) => IPAGES.find((x) => x.slug === slug)
