import { p, h, ul, note, sec, IMG } from '@/lib/tech-manual/types'
import type { Cell } from '@/lib/tech-manual/types'
import type { IPage } from '@/lib/industrial/pages'
import { PSA2_SPECS, PSA2_MATRIX } from './psa2-data'
import { PSA2_PDF } from './psa2'

// 전기·전자 테이프용 실리콘 PSA 허브 — 출처: Dow 한국어 웹페이지 2건(2026-11 확인) + Dow 2024 PSA 선택 가이드(Form No. 30-1315-01-0524 S2D)
export const DOW_TAPES_URL = 'https://www.dow.com/ko-kr/market/mkt-films-tapes-release-liners/sub-films-specialty-tapes-films/app-films-special-electrical-electronics-tapes.html'
export const DOW_SEARCH_URL = 'https://www.dow.com/ko-kr/search.html#tab=Products&cf-dow_market_hierarchy=%EC%A0%90%EC%B0%A9%EC%A0%9C%20%EB%B0%8F%20%EC%9D%B4%ED%98%95%EC%A0%9C,%EC%A0%90%EC%B0%A9%EC%A0%9C,%EC%A0%88%EC%97%B0%ED%85%8C%EC%9D%B4%ED%94%84%EC%9A%A9%20%EC%A0%90%EC%B0%A9%EC%A0%9C'
const PDP = 'https://www.dow.com/ko-kr/'
const bi = (en: string, ko: string): Cell => [en, ko]

const KCT_SUPPORT = {
  en: 'Korea Construction Trading (KCT) does its best to support customers technically: product selection, technical documents (TDS/SDS), process-condition review and troubleshooting for Dow silicone PSAs. Items that need confirmation are checked with Dow technical staff wherever possible. Contact sales@kconstrade.com or +82 10-8939-0284.',
  ko: '한국건설트레이딩(KCT)은 Dow 실리콘 PSA의 제품 선정, 기술 자료(TDS·SDS) 안내, 공정 조건 검토, 문제 해결 상담까지 고객의 기술 지원을 위해 최선을 다합니다. 확인이 필요한 사항은 가능한 범위에서 Dow 기술 담당자에게 확인해 안내해 드립니다. 문의: sales@kconstrade.com, 010-8939-0284.',
}
const supportFaq = {
  q: { en: 'Does KCT provide technical support for Dow silicone PSAs?', ko: '한국건설트레이딩에서 Dow 실리콘 PSA 기술 지원을 받을 수 있습니까?' },
  a: KCT_SUPPORT,
}

// Dow 한국 제품 검색 결과(점착제 및 이형제 > 점착제 > 절연테이프용 점착제, 20건)
const LIST: { n: string; href: string; en: string; ko: string }[] = [
  { n: 'DOWSIL™ 7651T Adhesive', href: 'pdp.dowsil-7651t-adhesive.847983z.html',
    en: 'A silicone pressure sensitive adhesive that, when used with SYL-OFF™ 7678 Crosslinker or SYL-OFF™ 7028 Crosslinker and SYL-OFF™ 4000 Catalyst, offers the ability to prepare pressure sensitive constructions at low curing temperature.',
    ko: 'SYL-OFF™ 7678 가교제 또는 SYL-OFF™ 7028 가교제, SYL-OFF™ 4000 촉매와 함께 사용하면 낮은 경화 온도에서 감압 구조를 만들 수 있는 실리콘 감압 점착제.' },
  { n: 'DOWSIL™ 2014 Adhesive', href: 'pdp.dowsil-2014-adhesive.507102z.html',
    en: 'A solventless silicone pressure sensitive adhesive that, when used with SYL-OFF™ 4000 Catalyst, offers the ability to prepare pressure sensitive constructions at low curing temperatures. It also yields a stable release system when applied and cured on release liners coated with SYL-OFF™ Q2-7785 Coating and SYL-OFF™ 7795 Coating. It can be blended with other DOWSIL™ solvent free platinum catalyzed PSAs like DOWSIL™ 7626 Adhesive, DOWSIL™ 7636 Adhesive, DOWSIL™ 7646 Adhesive and DOWSIL™ 7666 Adhes… (text truncated on the Dow page)',
    ko: 'SYL-OFF™ 4000 촉매와 함께 사용하면 낮은 경화 온도에서 감압 구조를 만들 수 있는 무용제 실리콘 감압 점착제. SYL-OFF™ Q2-7785 Coating, SYL-OFF™ 7795 Coating을 도포한 이형 라이너에 도포·경화하면 안정적인 이형 시스템도 얻습니다. DOWSIL™ 7626, 7636, 7646, 7666 Adhesive 등 다른 DOWSIL™ 무용제 백금 촉매 PSA와 블렌딩할 수 있습니다. … (Dow 페이지에서 문장이 잘려 있음)' },
  { n: 'DOWSIL™ SD 4518 Adhesive', href: 'pdp.dowsil-sd-4518-adhesive.498519z.html',
    en: 'Heptane-based Silicone pressure sensitive adhesive for high adhesion electronic grade tape applications.',
    ko: '고접착 전자 등급 테이프 용도를 위한 헵탄 기반 실리콘 감압 점착제.' },
  { n: 'DOWSIL™ Q2-7406 Adhesive', href: 'pdp.dowsil-q2-7406-adhesive.04015245z.html',
    en: 'A dispersion of polydimethylsiloxane gum and resin that combines excellent adhesion with high tack.',
    ko: '폴리디메틸실록산 고무 및 수지 디스퍼젼은 우수한 접착력과 합쳐져 고점착성을 보입니다.' },
  { n: 'DOWSIL™ SH 4280 Pressure Sensitive Adhesive', href: 'pdp.dowsil-sh-4280-pressure-sensitive-adhesive.01701452z.html',
    en: 'Peroxide cure silicone pressure sensitive adhesive. Flexible to control adhesion and tackiness by adjusting Peroxide content.',
    ko: '과산화물 경화 실리콘 감압 점착제. 과산화물 함량을 조절해 접착력과 점착성을 제어할 수 있습니다.' },
  { n: 'DOWSIL™ 7657 Adhesive', href: 'pdp.dowsil-7657-adhesive.02646731z.html',
    en: 'Solvent-based silicone pressure sensitive adhesive with excellent holding power and adhesion up to 240°C for masking and plating tapes.',
    ko: '매스킹 및 플레이팅 테이프에 대해 240°C까지 고정력 및 접착력이 우수한 용제 주재의 실리콘 감압성 점착제.' },
  { n: 'DOWSIL™ 7357 Adhesive', href: 'pdp.dowsil-7357-adhesive.489375z.html',
    en: 'Silicone pressure sensitive adhesive that maintains tape performance up to at least 260°C for applications including plater’s tapes, high temperature masking tapes, and splicing and release tapes.',
    ko: '도금(플레이터) 테이프, 고온 마스킹 테이프, 스플라이싱·이형 테이프 등 용도에서 최소 260°C까지 테이프 성능을 유지하는 실리콘 감압 점착제.' },
  { n: 'SYL-OFF™ 4500 Catalyst', href: 'pdp.syl-off-4500-catalyst.489668z.html',
    en: '4500 Pt Catalyst, could be used in solvent-base and solvent-less silicone products, to accelerate curing speed.',
    ko: '4500 Pt 촉매. 용제형·무용제형 실리콘 제품에 사용해 경화 속도를 높일 수 있습니다.' },
  { n: 'DOWSIL™ 7355 Adhesive', href: 'pdp.dowsil-7355-adhesive.03009556z.html',
    en: 'Solvent-based silicone pressure sensitive adhesive with excellent holding power and adhesion up to 240°C for masking and plating tapes.',
    ko: '매스킹 및 플레이팅 테이프에 대해 240°C까지 고정력 및 접착력이 우수한 용제 주재의 실리콘 감압성 점착제.' },
  { n: 'DOWSIL™ 7356 Adhesive', href: 'pdp.dowsil-7356-adhesive.03286592z.html',
    en: 'Solvent-based silicone pressure sensitive adhesive with excellent holding power and adhesion up to 240°C for masking and plating tapes.',
    ko: '매스킹 및 플레이팅 테이프에 대해 240°C까지 고정력 및 접착력이 우수한 용제 주재의 실리콘 감압성 점착제.' },
  { n: 'DOWSIL™ 7268 Adhesive', href: 'pdp.dowsil-7268-adhesive.04081831z.html',
    en: 'Solvent-based silicone pressure sensitive adhesive with excellent holding power and adhesion up to 240°C for masking and plating tapes.',
    ko: '매스킹 및 플레이팅 테이프에 대해 240°C까지 고정력 및 접착력이 우수한 용제 주재의 실리콘 감압성 점착제.' },
  { n: 'DOWSIL™ 7406-VLO Adhesive', href: 'pdp.dowsil-7406-vlo-adhesive.04063445z.html',
    en: 'Solvent-based silicone pressure sensitive adhesive with excellent holding power and adhesion up to 240°C for masking and plating tapes.',
    ko: '매스킹 및 플레이팅 테이프에 대해 240°C까지 고정력 및 접착력이 우수한 용제 주재의 실리콘 감압성 점착제.' },
  { n: 'DOWSIL™ 7278 Adhesive', href: 'pdp.dowsil-7278-adhesive.04110446z.html',
    en: 'Solvent-based silicone pressure sensitive adhesive with excellent holding power and adhesion up to 240°C for masking and plating tapes.',
    ko: '매스킹 및 플레이팅 테이프에 대해 240°C까지 고정력 및 접착력이 우수한 용제 주재의 실리콘 감압성 점착제.' },
  { n: 'DOWSIL™ 280A Adhesive', href: 'pdp.dowsil-280a-adhesive.01171101z.html',
    en: 'Solvent-based silicone pressure sensitive adhesive with excellent holding power and adhesion up to 240°C for masking and plating tapes.',
    ko: '매스킹 및 플레이팅 테이프에 대해 240°C까지 고정력 및 접착력이 우수한 용제 주재의 실리콘 감압성 점착제.' },
  { n: 'DOWSIL™ 7499 PSA Primer', href: 'pdp.dowsil-7499-psa-primer.04026470z.html',
    en: 'Primer for silicone pressure sensitive adhesive coating on diversified film substrates (such as PET, PI, Teflon…) to improve anchorage performance in demanding tape applications.',
    ko: '까다로운 테이프 용도에서 앵커리지 성능을 높이기 위해 다양한 필름 기재(PET, PI, 테플론 등)에 실리콘 감압 점착제를 코팅할 때 쓰는 프라이머.' },
  { n: 'DOWSIL™ 7429 PSA Additive', href: 'pdp.dowsil-7429-psa-additive.04074436z.html',
    en: 'PSA additive.',
    ko: 'PSA 첨가제' },
  { n: 'DOWSIL™ 7388 Adhesive', href: 'pdp.dowsil-7388-adhesive.04071731h.html',
    en: 'Solvent-based silicone pressure sensitive adhesive with excellent holding power and adhesion up to 240°C for masking and plating tapes.',
    ko: '매스킹 및 플레이팅 테이프에 대해 240°C까지 고정력 및 접착력이 우수한 용제 주재의 실리콘 감압성 점착제.' },
  { n: 'DOWSIL™ 7358 Adhesive', href: 'pdp.dowsil-7358-adhesive.03087344z.html',
    en: 'Solvent-based silicone pressure sensitive adhesive with excellent holding power and adhesion up to 240°C for masking and plating tapes.',
    ko: '매스킹 및 플레이팅 테이프에 대해 240°C까지 고정력 및 접착력이 우수한 용제 주재의 실리콘 감압성 점착제.' },
  { n: 'SYL-OFF™ EM 7958 Coating', href: 'pdp.syl-off-em-7958-coating.491433z.html',
    en: 'A silicone release coating in emulsion form pre-formulated with crosslinker. It provides excellent release performance and excellent bath life, and is suitable for off-line coating.',
    ko: '가교제와 사전 배합된 에멀젼 형태의 실리콘 이형 코팅제입니다. 우수한 이형 성능과 우수한 Bath Life를 제공합니다. 오프라인 코팅에 사용하기에 적합합니다.' },
  { n: 'DOWSIL™ 2015 Adhesive', href: 'pdp.dowsil-2015-adhesive.512448z.html',
    en: 'A solventless silicone pressure sensitive adhesive with high peel adhesion and tack that, when catalyzed with SYL-OFF™ 4000 Catalyst, offers the ability to prepare pressure sensitive constructions. It also yields a stable release system when applied and cured on release liners coated with SYL-OFF™ 7795 Coating.',
    ko: 'SYL-OFF™ 4000 촉매로 촉매화하면 감압 구조를 만들 수 있는, 높은 박리 접착력과 택을 가진 무용제 실리콘 감압 점착제. SYL-OFF™ 7795 Coating을 도포한 이형 라이너에 도포·경화하면 안정적인 이형 시스템도 얻습니다.' },
]

const specOf = (name: string) => PSA2_SPECS.find((s) => s.n === name)
const dash = (s?: string) => (!s ? '–' : s)

// Dow 목록 표 (2024 가이드 수치 병합)
const listRows: Cell[][] = LIST.map((x) => {
  const sp = specOf(x.n)
  return [x.n, bi(x.en, x.ko), sp ? sp.cure : '–', sp ? dash(sp.visc) : '–', sp ? dash(sp.adh) : '–', sp ? dash(sp.tack) : '–', sp ? dash(sp.hold) : '–']
})

// 용도별 권장 제품 (2024 가이드 표 1 + 표 2)
const USES: { col: number; en: string; ko: string }[] = [
  { col: 1, en: 'Electrical and electronics masking and carrier tapes for industrial processing', ko: '산업 공정용 전기·전자 마스킹·캐리어 테이프' },
  { col: 4, en: 'Electrical and electronics tapes for industrial bonding and bundling applications', ko: '산업용 접합·결속 전기·전자 테이프' },
  { col: 6, en: 'Electrical, electronic, heat-shielding and terminal cable insulation tapes', ko: '전기·전자·차열·단자 케이블 절연 테이프' },
  { col: 5, en: 'Heat-seal tapes for bonding heating surfaces', ko: '발열면 접합용 히트실 테이프' },
  { col: 7, en: 'Splicing tapes for continuous processing of low-surface-energy substrates', ko: '저표면에너지 기재 연속 공정용 스플라이싱 테이프' },
  { col: 3, en: 'Thermal-spray and powder-coating masking tapes', ko: '용사·분체도장 마스킹 테이프' },
  { col: 8, en: 'Binding material for mica tape applications', ko: '마이카 테이프용 바인더' },
]
const useRows = (col: number): Cell[][] =>
  PSA2_MATRIX.filter((r) => (r[col] as string) && specOf(r[0] as string)).map((r) => {
    const sp = specOf(r[0] as string)!
    return [r[0] as string, sp.cure, dash(sp.adh), dash(sp.tack), dash(sp.hold)]
  })

export const TAPES: IPage[] = [
  {
    slug: 'electrical-electronics-tape-psa', no: 1, pdfPages: '—', doc: 'dow.com/ko-kr',
    title: { en: 'Silicone PSAs for Electrical and Electronics Tape Applications (Dow Korea)', ko: '전기 및 전자 테이프 응용제품용 실리콘 PSA (Dow 한국 웹페이지)' },
    summary: { en: 'Full text of Dow Korea’s “Electrical and electronics tapes” page: PSAs for electrical insulation tapes and splicing tapes, with KCT’s support information.', ko: 'Dow 한국 웹페이지 「전기 및 전자 테이프」 전문: 전기 절연 테이프용·스플라이싱 테이프용 PSA, 한국건설트레이딩 기술 지원 안내 포함.' },
    answer: {
      en: 'Dow offers innovative pressure sensitive adhesives (PSAs) that balance strength, flexibility and high-temperature resistance for electrical and electronics tapes. For electrical insulation tapes (motor windings, transformers, capacitors, connectors) they offer excellent adhesion and strength, high heat resistance and compatibility with PTFE, polyimide and glass-fiber substrates; for splicing tapes they offer high adhesion to low-energy surfaces or quick stick/high holding for flying splices, compatible with PET backings.',
      ko: 'Dow는 전기·전자 테이프 응용제품에 강도, 유연성, 고온 저항성의 탁월한 균형을 제공하는 혁신적인 점착제(PSA)를 제공합니다. 모터 권선, 변압기, 커패시터, 커넥터 같은 전기 절연 테이프에는 우수한 밀착성과 강도, 높은 내열성, PTFE·폴리이미드·유리섬유 기재와의 호환성을, 스플라이싱 테이프에는 저에너지 표면에 대한 높은 접착력 또는 플라잉 스플라이스용 빠른 스틱·높은 고정성과 PET 백킹과의 호환성을 제공합니다.',
    },
    image: IMG('psa2-cover'),
    sections: [
      sec('overview', 'Silicone PSAs for electrical and electronics tape applications', '전기 및 전자 테이프 응용제품용 실리콘 PSA',
        p('Dow offers innovative pressure sensitive adhesives (PSAs) that provide an excellent balance of strength, flexibility and high-temperature resistance for electrical and electronics tape applications.',
          'Dow는 전기 및 전자 테이프 응용제품에 강도, 유연성 및 고온 저항성의 탁월한 균형을 제공하는 혁신적인 점착제(PSA)를 제공합니다.')),
      sec('insulation', 'PSAs for electrical insulation tapes', '전기 절연 테이프용 PSA',
        p('Dow’s PSA products serve electrical tape applications such as motor windings, transformers, capacitors and connectors, which require excellent insulating properties over a wide temperature range. They offer:',
          'Dow의 PSA 제품은 광범위한 온도에서 우수한 절연 특성을 요구하는 모터 권선, 변압기, 커패시터, 커넥터와 같은 전기 테이프 응용제품을 위해 다음을 제공합니다.'),
        ul(
          ['Excellent adhesion and strength', '우수한 밀착성과 강도'],
          ['High heat resistance', '높은 내열성'],
          ['Compatibility with PTFE, polyimide and glass-fiber substrates', 'PTFE, 폴리이미드, 유리섬유 기재와의 호환성'],
        )),
      sec('splicing', 'PSAs for splicing tapes', '스플라이싱 테이프용 PSA',
        p('Dow’s PSAs are also ideal for splicing tape applications that need high adhesion to low-energy surfaces, or quick stick/high holding for flying splices. Our silicone PSA solutions are compatible with PET backings and can be used in demanding applications or processes such as:',
          'Dow의 PSA는 저에너지 표면에 대한 높은 접착력 또는 플라잉 스플라이스에 대한 빠른 스틱·높은 고정성이 필요한 스플라이싱 테이프 응용제품에도 이상적입니다. 당사의 실리콘 PSA 솔루션은 PET 백킹과 호환되며 다음과 같은 까다로운 응용 분야 또는 공정에 사용할 수 있습니다.'),
        ul(
          ['Bonding and joining of low-surface-energy substrates at high temperature', '고온에서 표면 에너지가 낮은 기판의 접합 및 결합'],
          ['Chemical processing', '화학물질 처리'],
          ['Solvent etching processes', '용제 에칭 공정'],
          ['High-speed continuous processes', '고속 연속 공정'],
        )),
      sec('success', 'Silicone-based solutions for customer success', '고객 성공을 위한 실리콘 기반 솔루션',
        p('With more than 50 years of industry experience, we understand the unique challenges customers face in PSA applications. Whether you are looking to innovate, grow reliably or reduce costs, we have the solutions and expertise to help you succeed. Would you like to know which solution is right for you? Learn more with the silicone PSA guide.',
          '당사는 50년 이상의 업계 경험을 바탕으로 고객들이 PSA 응용 분야에서 직면하는 독특한 도전 과제를 이해하고 있습니다. 혁신, 신뢰성 있는 성장 또는 비용 절감을 모색하고 있다면, 당사는 고객의 성공을 도울 수 있는 솔루션과 전문 지식을 보유하고 있습니다. 어떤 솔루션이 귀하에게 적합한지 알고 싶으십니까? 실리콘 PSA 가이드를 통해 자세히 알아보십시오.'),
        p('Electrical and electronics tapes: explore our portfolio. Talk to an expert: we are committed to providing experts and resources to solve every challenge. (Dow page, in Dow’s words.)',
          '전기 및 전자 테이프: 당사의 전기 및 전자 테이프 포트폴리오를 살펴보십시오. 전문가와 상담: 당사는 모든 도전 과제를 해결할 수 있는 전문가 및 리소스를 제공하기 위해 최선을 다하고 있습니다. (Dow 페이지 문구)')),
      sec('kct', 'Technical support from Korea Construction Trading', '한국건설트레이딩의 기술 지원',
        p(KCT_SUPPORT.en, KCT_SUPPORT.ko),
        p('Related pages: the Dow silicone PSA selection guide (2024, 9 pages), the Dow product list for electrical-insulation-tape PSAs and the electrical-tape selection table on this hub.',
          '관련 페이지: Dow 실리콘 PSA 선택 가이드(2024, 9쪽), 절연테이프용 점착제 Dow 제품 목록, 이 허브의 전기 테이프 선정표.'),
        p('Source: Dow, “Electrical and electronics tapes” (Korean page) — ' + DOW_TAPES_URL, '출처: Dow 「전기 및 전자 테이프」 한국어 페이지 — ' + DOW_TAPES_URL)),
    ],
    faq: [
      { q: { en: 'What are Dow PSAs for electrical insulation tapes known for?', ko: '전기 절연 테이프용 Dow PSA의 특징은 무엇입니까?' }, a: { en: 'Excellent adhesion and strength, high heat resistance, and compatibility with PTFE, polyimide and glass-fiber substrates.', ko: '우수한 밀착성과 강도, 높은 내열성, PTFE·폴리이미드·유리섬유 기재와의 호환성입니다.' } },
      { q: { en: 'What are Dow PSAs for splicing tapes used for?', ko: '스플라이싱 테이프용 Dow PSA는 어떤 공정에 쓰입니까?' }, a: { en: 'High-temperature bonding of low-surface-energy substrates, chemical processing, solvent etching and high-speed continuous processes, with PET backings.', ko: '고온에서 저표면에너지 기판의 접합, 화학물질 처리, 용제 에칭, 고속 연속 공정이며 PET 백킹과 호환됩니다.' } },
      supportFaq,
    ],
  },

  {
    slug: 'dow-insulation-tape-psa-product-list', no: 2, pdfPages: '—', doc: 'dow.com/ko-kr + 2024 guide',
    title: { en: 'Dow PSA Products for Electrical Insulation Tapes (20 Products, Dow Korea Listing)', ko: '절연테이프용 점착제 Dow 제품 목록 (20종, Dow 한국 제품 검색)' },
    summary: { en: 'All 20 products listed by Dow Korea under Adhesives & Release Agents › PSA › PSAs for insulation tapes, with descriptions in Korean and English and typical properties from the 2024 guide.', ko: 'Dow 한국이 「점착제 및 이형제 › 점착제 › 절연테이프용 점착제」로 분류한 20종 전체: 한·영 설명과 2024 가이드의 대표 물성.' },
    answer: {
      en: 'Dow Korea’s product search lists 20 products under PSAs for insulation tapes: DOWSIL™ 280A, 7268, 7278, 7355, 7356, 7357, 7358, 7388, 7406-VLO, Q2-7406, 7657, SH 4280, SD 4518, 7651T, 2014, 2015, plus the DOWSIL™ 7499 PSA Primer, 7429 PSA Additive and SYL-OFF™ 4500 Catalyst and EM 7958 Coating. Typical values from the 2024 guide are joined where available.',
      ko: 'Dow 한국 제품 검색은 절연테이프용 점착제로 20종을 분류합니다: DOWSIL™ 280A, 7268, 7278, 7355, 7356, 7357, 7358, 7388, 7406-VLO, Q2-7406, 7657, SH 4280, SD 4518, 7651T, 2014, 2015, 그리고 DOWSIL™ 7499 PSA Primer, 7429 PSA Additive, SYL-OFF™ 4500 Catalyst, EM 7958 Coating. 가이드(2024)에 수치가 있는 제품은 대표 물성을 함께 실었습니다.',
    },
    image: IMG('psa2-cover'),
    sections: [
      sec('list', 'Product list with typical properties', '제품 목록과 대표 물성',
        p('Dow Korea’s filtered search (Adhesives & Release Agents › Adhesives › PSAs for insulation tapes) shows 20 results in two pages. Descriptions are those on the Dow page (some are in Korean and some in English there); the missing language has been translated by KCT. Typical properties come from Table 2 of the 2024 Dow guide; “–” means the guide has no value for that product. Several Dow descriptions repeat the same blurb (excellent holding power and adhesion up to 240°C for masking and plating tapes) — compare individual products with the properties columns.',
          'Dow 한국의 필터 검색(점착제 및 이형제 › 점착제 › 절연테이프용 점착제) 결과는 2쪽 20건입니다. 설명은 Dow 페이지의 문구이며(Dow 페이지에서 일부는 한국어, 일부는 영어) 없는 언어는 한국건설트레이딩이 번역했습니다. 대표 물성은 2024 Dow 가이드 표 2에서 가져왔고 「–」는 가이드에 해당 값이 없다는 뜻입니다. 여러 제품의 Dow 설명이 같은 문구(마스킹·플레이팅 테이프용 240°C까지 우수한 고정력·접착력)를 반복하므로 개별 제품은 물성 열로 비교하십시오.'),
        { k: 'tbl', big: true,
          head: [bi('Product', '제품'), bi('Dow description', 'Dow 설명'), bi('Cure system', '경화 방식'), bi('Viscosity, cps', '점도, cps'), bi('Adhesion, g/in', '접착력, g/in'), bi('Probe tack, g', '프로브 택, g'), bi('High-temp. hold, °C (°F)', '고온 유지력, °C (°F)')],
          rows: listRows,
          note: { en: 'Properties are typical values from the 2024 Dow guide, not specifications (±100 cps, ±10 g/in). Availability may differ by region.', ko: '물성은 2024 Dow 가이드의 대표값이며 시방값이 아닙니다(±100 cps, ±10 g/in). 지역에 따라 공급 가능 여부가 다를 수 있습니다.' } }),
      sec('links', 'Dow product pages (Korean)', 'Dow 제품 페이지 (한국어)',
        p('Each product page on dow.com has technical data sheets and safety data sheets. Dow search (filtered): ' + DOW_SEARCH_URL, '각 제품 페이지에서 기술 데이터시트(TDS)와 안전 보건 자료(SDS)를 확인할 수 있습니다. Dow 검색(필터 적용): ' + DOW_SEARCH_URL),
        ul(...LIST.map((x): [string, string] => [`${x.n} — ${PDP}${x.href}`, `${x.n} — ${PDP}${x.href}`]))),
      sec('kct', 'Technical support from Korea Construction Trading', '한국건설트레이딩의 기술 지원',
        p(KCT_SUPPORT.en, KCT_SUPPORT.ko)),
    ],
    faq: [
      { q: { en: 'How many PSA products does Dow Korea list for insulation tapes?', ko: 'Dow 한국은 절연테이프용 점착제로 몇 종을 분류합니까?' }, a: { en: '20 products (two result pages) including PSAs, a primer, an additive, a catalyst and a release coating.', ko: 'PSA, 프라이머, 첨가제, 촉매, 이형 코팅제를 포함해 20종(2쪽)입니다.' } },
      supportFaq,
    ],
  },

  {
    slug: 'electrical-tape-psa-selection-table', no: 3, pdfPages: '—', doc: '2024 guide · Tables 1–2',
    title: { en: 'Electrical and Specialty Tape PSA Selection Table (From the 2024 Dow Guide)', ko: '전기·특수 테이프 PSA 선정표 (2024 Dow 가이드 기반)' },
    summary: { en: 'Suggested DOWSIL™ PSAs per tape use — electrical masking, bonding/bundling, insulation, heat-seal, splicing, thermal-spray masking and mica binders — with cure system, adhesion, tack and high-temperature hold.', ko: '용도별 권장 DOWSIL™ PSA — 전기 마스킹, 접합·결속, 절연, 히트실, 스플라이싱, 용사 마스킹, 마이카 바인더 — 와 경화 방식·접착력·택·고온 유지력.' },
    answer: {
      en: 'Built from Tables 1 and 2 of the 2024 Dow guide: for electrical, electronic, heat-shielding and terminal cable insulation tapes the suggested DOWSIL™ PSAs are 7268, Q2-7406, 7388, 7406-VLO, 7355, 7356, 7357, 7358, Q2-7566 and SD 4600 FC (hold 240–300 °C). Choose peroxide cure for robust, contamination-tolerant processing and platinum cure for fast low-temperature cure; always confirm with the current data sheet.',
      ko: '2024 Dow 가이드 표 1·2로 정리했습니다. 전기·전자·차열·단자 케이블 절연 테이프에는 DOWSIL™ 7268, Q2-7406, 7388, 7406-VLO, 7355, 7356, 7357, 7358, Q2-7566, SD 4600 FC가 권장 대상입니다(유지력 240~300 °C). 오염에 강한 견고한 공정에는 과산화물 경화, 빠른 저온 경화에는 백금 경화를 선택하고 최신 데이터시트로 반드시 확인하십시오.',
    },
    image: IMG('psa2-cover'),
    sections: [
      ...USES.map((u) =>
        sec(`use-${u.col}`, u.en, u.ko,
          { k: 'tbl' as const, head: [bi('Suggested product', '권장 제품'), bi('Cure system', '경화 방식'), bi('Adhesion, g/in', '접착력, g/in'), bi('Probe tack, g', '프로브 택, g'), bi('High-temp. hold, °C (°F)', '고온 유지력, °C (°F)')], rows: useRows(u.col) })),
      sec('choose', 'Peroxide cure vs. platinum cure', '과산화물 경화 vs. 백금 경화',
        ul(
          ['Platinum cure: two-part (catalyst required), bath life of six hours (2024 guide), cures from 80 °C in a single-zone oven; fast, low-temperature cure; the catalyst can be contaminated by peroxides and other materials.', '백금 경화: 촉매가 필요한 2액형, 배스 수명 6시간(2024 가이드), 단일 구역 오븐에서 80 °C부터 경화, 빠른 저온 경화, 촉매가 과산화물 등에 오염될 수 있음.'],
          ['Peroxide cure: one-part with benzoyl peroxide (0.5–3.0% by weight), extended bath life, two-step graded cure (solvent removal at 65–93 °C, then heat cure); robust and resistant to catalyst poisoning; incomplete solvent removal can cause bubbling and low adhesion.', '과산화물 경화: 과산화벤조일(0.5~3.0 중량%)을 쓰는 1액형, 긴 배스 수명, 2단계 구배 경화(65~93 °C 용제 제거 후 열 경화), 견고하고 촉매 피독에 강함, 용제 제거가 불충분하면 기포·접착력 저하 가능.'],
        ),
        note('Selection requires your substrate, process equipment and performance targets. Ask Korea Construction Trading to review your conditions before ordering.', '선정에는 기재, 공정 설비, 성능 목표를 함께 고려해야 합니다. 주문 전에 한국건설트레이딩에 조건 검토를 요청하십시오.')),
    ],
    faq: [
      { q: { en: 'Which PSA for splicing tapes?', ko: '스플라이싱 테이프에는 어떤 PSA를 쓰나요?' }, a: { en: 'Table 1 marks DOWSIL™ 280A, 7366, Q2-7406, 7388, 7406-VLO and Q2-7735 (and 288 Mica Binder as printed) for splicing tapes for continuous processing of low-surface-energy substrates.', ko: '표 1은 저표면에너지 기재 연속 공정용 스플라이싱 테이프에 DOWSIL™ 280A, 7366, Q2-7406, 7388, 7406-VLO, Q2-7735(그리고 원문 표기대로 288 Mica Binder)를 표시합니다.' } },
      supportFaq,
    ],
  },

  {
    slug: 'kct-technical-support', no: 4, pdfPages: '—', doc: 'KCT',
    title: { en: 'Technical Support from Korea Construction Trading (KCT) for Dow Silicone PSAs', ko: '한국건설트레이딩(KCT)의 Dow 실리콘 PSA 기술 지원' },
    summary: { en: 'How KCT supports Dow silicone PSA users in Korea: selection, documents, process conditions, troubleshooting, and the checklist that makes an inquiry faster.', ko: '한국건설트레이딩이 국내 Dow 실리콘 PSA 사용자를 지원하는 방식: 제품 선정, 자료 안내, 공정 조건 검토, 문제 해결, 문의를 빠르게 하는 체크리스트.' },
    answer: {
      en: 'Korea Construction Trading (한국건설트레이딩) does its best to give technical support for Dow silicone PSAs: help choosing among peroxide- and platinum-cure grades, guiding TDS/SDS and guide documents, reviewing coating, solvent-removal and cure conditions, anchorage and primer choices, and troubleshooting issues such as bubbling, low adhesion and oven dusting. Send your tape type, backing film, service temperature and process conditions to sales@kconstrade.com or call 010-8939-0284.',
      ko: '한국건설트레이딩은 Dow 실리콘 PSA 기술 지원을 위해 최선을 다합니다. 과산화물·백금 경화 등급 선택, TDS·SDS·가이드 자료 안내, 도포·용제 제거·경화 조건 검토, 앵커리지·프라이머 선택, 기포·접착력 저하·오븐 분진 같은 문제 해결을 돕습니다. 테이프 종류, 백킹 필름, 사용 온도, 공정 조건을 sales@kconstrade.com 또는 010-8939-0284로 알려 주십시오.',
    },
    image: IMG('psa2-cover'),
    sections: [
      sec('commitment', 'Our commitment', '기술 지원에 대한 약속',
        p(KCT_SUPPORT.en, KCT_SUPPORT.ko),
        p('The technical content on this site is organized from Dow documents so that engineers can find it quickly in Korean and English. It does not replace Dow’s current data sheets, safety data sheets or your own testing.',
          '이 사이트의 기술 내용은 Dow 문서를 바탕으로 정리해 엔지니어가 한국어·영어로 빠르게 찾을 수 있도록 한 것입니다. Dow의 최신 데이터시트, 안전 보건 자료, 고객의 자체 시험을 대신하지 않습니다.')),
      sec('scope', 'What we can help with', '지원 범위',
        ul(
          ['Product selection: tape type (masking, plating, electrical insulation, splicing, heat-seal, protective film, double-sided), adhesion/tack target, service temperature and cure system.', '제품 선정: 테이프 종류(마스킹, 플레이팅, 전기 절연, 스플라이싱, 히트실, 보호 필름, 양면), 접착력·택 목표, 사용 온도, 경화 방식.'],
          ['Documents: Dow selection guides, technical data sheets (TDS) and safety data sheets (SDS).', '자료: Dow 선택 가이드, 기술 데이터시트(TDS), 안전 보건 자료(SDS) 안내.'],
          ['Process conditions: dilution solvent, coat weight, catalyst/peroxide level, solvent removal and heat-cure profile, oven design and dusting.', '공정 조건: 희석 용제, 코트 웨이트, 촉매·과산화물 농도, 용제 제거와 열 경화 프로파일, 오븐 구성과 분진.'],
          ['Anchorage and release: primers, anchorage additives, SYL-OFF™ release coatings and liner combinations.', '앵커리지와 이형: 프라이머, 앵커리지 첨가제, SYL-OFF™ 이형 코팅제와 라이너 조합.'],
          ['Troubleshooting: bubbling, low adhesion or cohesion, “snow” crystals, catalyst poisoning, adhesive transfer on unwind.', '문제 해결: 기포, 접착력·응집력 저하, 「눈(snow)」 결정, 촉매 피독, 풀림 시 접착제 전이.'],
          ['Quotation and supply in Korea.', '국내 견적과 공급.'],
        )),
      sec('checklist', 'Inquiry checklist', '문의 시 알려주실 내용',
        ul(
          ['Tape or film type and end use', '테이프·필름 종류와 최종 용도'],
          ['Backing/carrier film (PET, polyimide, PTFE, glass cloth, aluminum foil, …) and thickness', '백킹·캐리어 필름(PET, 폴리이미드, PTFE, 유리 직물, 알루미늄 포일 등)과 두께'],
          ['Mating surface (metal, silicone rubber, low-energy plastic, …)', '피착면(금속, 실리콘 고무, 저에너지 플라스틱 등)'],
          ['Required adhesion, tack and holding power; service and process temperatures', '요구 접착력·택·유지력, 사용 온도와 공정 온도'],
          ['Coating line: solvent handling, oven zones, dwell time, line speed', '코팅 라인: 용제 취급 여부, 오븐 구역, 체류 시간, 라인 속도'],
          ['Regulatory needs (for example food-contact) and expected volume', '규제 요건(예: 식품 접촉)과 예상 사용량'],
          ['Current product, problem observed and photos or data if available', '현재 사용 제품, 발생한 문제, 가능하면 사진·데이터'],
        )),
      sec('contact', 'Contact', '문의처',
        p('Korea Construction Trading — sales@kconstrade.com · 010-8939-0284 · Garden Five Tools 4-A19, 10 Chungmin-ro, Songpa-gu, Seoul.',
          '한국건설트레이딩 — sales@kconstrade.com · 010-8939-0284 · 서울특별시 송파구 충민로 10 가든파이브툴 4-A19.')),
    ],
    faq: [
      supportFaq,
      { q: { en: 'What should I send with a technical inquiry?', ko: '기술 문의 시 무엇을 보내야 합니까?' }, a: { en: 'Tape type, backing film, mating surface, target adhesion/tack, service and process temperatures, coating line conditions, regulatory needs and, if there is a problem, photos or data.', ko: '테이프 종류, 백킹 필름, 피착면, 목표 접착력·택, 사용·공정 온도, 코팅 라인 조건, 규제 요건, 문제가 있다면 사진·데이터를 보내 주십시오.' } },
    ],
  },
]

export const TAPES_SOURCE = `Dow, “Electrical and electronics tapes” and Dow Korea product search (Adhesives & Release Agents › PSAs › PSAs for insulation tapes), dow.com/ko-kr, checked 2026-11; Dow, “Silicone PSAs for High Performance Selection Guide”, Form No. 30-1315-01-0524 S2D (© 2024 The Dow Chemical Company). 한국어/영어 정리: 한국건설트레이딩(KCT)`
export const TAPES_PDF = PSA2_PDF
