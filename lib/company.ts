// 회사소개·지속가능경영 콘텐츠. 사실 출처: dictionaries(trust·process·export_page), lib/contact.ts, lib/products-catalog.ts, public/tds.
// 연혁·고객사·인증·실적 수치는 저장소에서 확인되지 않아 의도적으로 넣지 않았다.
export type Lang = 'ko' | 'en' | 'ja'
export type L3 = Record<Lang, string>
const l = (ko: string, en: string, ja: string): L3 => ({ ko, en, ja })

export const COMPANY = {
  nameKo: '한국건설트레이딩',
  nameEn: 'KOREA CONSTRUCTION TRADING',
  bizNo: '371-07-03719',
  email: 'sales@kconstrade.com',
}

// Dow 공개 목표 — 1차 자료: Dow 공식 지속가능성 페이지(2026-11-28 확인)
export const DOW_SRC = 'https://corporate.dow.com/en-us/purpose-in-action/sustainability-focus-areas.html'
export const DOW_TARGETS: { year: L3; title: L3; desc: L3 }[] = [
  {
    year: l('2030', '2030', '2030'),
    title: l('순 탄소 배출 500만 톤 감축', 'Cut net carbon emissions by 5 Mt', '正味炭素排出量を500万トン削減'),
    desc: l(
      'Dow는 2020년 기준 대비 연간 순 탄소 배출량을 500만 미터톤(약 15%) 줄이겠다고 밝혔습니다. 범위 1·2 배출 기준이며 2020년 기준선은 약 3,500만 미터톤 CO₂입니다.',
      'Dow states it will reduce net annual carbon emissions by 5 million metric tons (~15%) versus a 2020 baseline. Scope 1 and 2; the baseline is about 35 million metric tons of CO₂.',
      'Dowは2020年比で年間の正味炭素排出量を500万メートルトン(約15%)削減するとしています。スコープ1・2が対象で、基準は約3,500万メートルトンCO₂です。',
    ),
  },
  {
    year: l('2050', '2050', '2050'),
    title: l('탄소중립 지향', 'Carbon neutrality ambition', 'カーボンニュートラルを目指す'),
    desc: l(
      'Dow는 2050년까지 탄소중립(범위 1+2+3 및 제품 기여분 포함)을 달성할 계획이라고 공표했습니다.',
      'Dow states it intends to be carbon neutral by 2050 (Scopes 1+2+3 plus product benefits).',
      'Dowは2050年までにカーボンニュートラル(スコープ1+2+3および製品貢献分を含む)を目指すと公表しています。',
    ),
  },
  {
    year: l('상시', 'Ongoing', '継続'),
    title: l('안전한 운영', 'Safe and reliable operations', '安全で信頼できる操業'),
    desc: l(
      'Dow는 업계 상위 25% 수준의 안전 성과를 유지하겠다고 밝혔습니다.',
      'Dow states it is committed to maintaining top-quartile safety performance in its industry.',
      'Dowは業界で上位25%水準の安全実績を維持するとしています。',
    ),
  },
]

export const PRACTICES: { title: L3; desc: L3 }[] = [
  {
    title: l('정품 유통', 'Genuine Dow supply', '正規品の流通'),
    desc: l('Dow가 제조한 제품만 취급합니다. 제품마다 제조사 TDS를 함께 제공합니다.', 'We handle Dow-manufactured products only, each with the manufacturer’s TDS.', 'Dow製造品のみを取り扱い、製品ごとにメーカーTDSを提供します。'),
  },
  {
    title: l('유효기간·보관 관리', 'Shelf-life and storage care', '有効期限・保管の管理'),
    desc: l('발주 전 제품별 유효기간과 보관 조건(TDS 기준)을 안내하고, 필요한 수량 위주로 제안해 사용하지 못하고 버리는 물량을 줄입니다.', 'Before ordering we share each product’s shelf life and storage conditions (per TDS) and propose the quantity actually needed, to reduce unused material.', '発注前に製品ごとの有効期限と保管条件(TDS基準)を案内し、必要数量を中心にご提案して廃棄を減らします。'),
  },
  {
    title: l('기술 지원으로 재시공 감소', 'Technical support to avoid rework', '技術サポートで手直しを減らす'),
    desc: l('접착성·적합성·시공 조건을 시공 전에 확인하도록 돕습니다. 구조 글레이징 등 확인이 필요한 용도는 Dow 기술 검토를 안내하고, 시편·샘플 제작과 테스트도 지원합니다.', 'We help confirm adhesion, compatibility and application conditions before work starts, and point structural-glazing type uses to Dow technical review. Test specimens, samples and test support are available.', '施工前に接着性・適合性・施工条件の確認を支援し、構造グレイジング等はDowの技術確認をご案内します。試験片・サンプルの製作とテスト支援にも対応します。'),
  },
  {
    title: l('전자 문서화', 'Paperless documents', '書類の電子化'),
    desc: l('TDS는 전자 PDF로 제공하고, 견적서도 PDF로 발행해 종이 사용을 줄입니다.', 'TDS are provided as electronic PDFs and quotations are issued as PDFs to cut paper use.', 'TDSは電子PDFで提供し、見積書もPDFで発行して紙の使用を減らします。'),
  },
  {
    title: l('안전보건 정보 제공', 'Safety data provided', '安全衛生情報の提供'),
    desc: l('취급·보관에 필요한 SDS(MSDS)를 요청 시 제공하며, 수출 시에도 서류에 포함합니다.', 'SDS (MSDS) for handling and storage is provided on request and included in export documents.', '取扱・保管に必要なSDS(MSDS)を要請に応じて提供し、輸出書類にも含めます。'),
  },
]

export const SUS_FAQ: { q: L3; a: L3 }[] = [
  {
    q: l('KCT는 ISO 14001 등 환경 인증을 보유하고 있나요?', 'Does KCT hold ISO 14001 or similar certifications?', 'KCTはISO 14001などの認証を取得していますか?'),
    a: l('현재 이 페이지에 게시할 인증 사항은 없습니다. 인증 보유 여부가 필요하시면 문의해 주세요. 아래 실천 원칙은 인증이 아니라 KCT가 지키는 운영 약속입니다.', 'There are no certifications published on this page. Please contact us if you need to confirm certification status. The principles above are operating commitments, not certifications.', '現時点で本ページに掲載する認証はありません。確認が必要な場合はお問い合わせください。上記は認証ではなく運営上の約束です。'),
  },
  {
    q: l('Dow의 탄소중립 목표는 KCT의 목표인가요?', 'Are Dow’s carbon goals KCT’s goals?', 'Dowの炭素目標はKCTの目標ですか?'),
    a: l('아닙니다. 위 목표는 제조사 Dow가 공개한 것이며 KCT는 이를 출처와 함께 소개할 뿐입니다. KCT의 약속은 “KCT의 실천 원칙”에 따로 적었습니다.', 'No. Those goals are published by manufacturer Dow; KCT only cites them with sources. KCT’s own commitments are listed separately under “KCT practices”.', 'いいえ。これらはメーカーDowが公表した目標で、KCTは出典付きで紹介しているだけです。KCT自身の約束は「KCTの実践原則」に分けて記載しています。'),
  },
  {
    q: l('제품의 환경 정보(LEED·VOC)는 어디서 확인하나요?', 'Where can I find product environmental data (LEED, VOC)?', '製品の環境情報(LEED・VOC)はどこで確認できますか?'),
    a: l('DOWSIL™ 1200 OS Primer는 LEED 확인서(PDF)를 제공합니다. 다른 제품은 각 TDS에서 확인하시고, 필요한 자료는 문의해 주세요.', 'A LEED letter (PDF) is available for DOWSIL™ 1200 OS Primer. For other products check each TDS, or contact us for the documents you need.', 'DOWSIL™ 1200 OS PrimerにはLEED確認書(PDF)があります。他の製品は各TDSをご確認いただくか、必要な資料をお問い合わせください。'),
  },
  {
    q: l('SDS(MSDS)는 어떻게 받나요?', 'How do I get an SDS (MSDS)?', 'SDS(MSDS)はどう入手できますか?'),
    a: l('견적·구매 문의 시 제품명을 알려 주시면 SDS를 안내해 드립니다. 수출 건은 서류에 포함됩니다.', 'Tell us the product name when you inquire and we will provide the SDS. For exports it is included in the document set.', 'お問い合わせ時に製品名をお知らせいただければSDSをご案内します。輸出の場合は書類に含まれます。'),
  },
]
