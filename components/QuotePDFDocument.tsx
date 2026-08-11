'use client'

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from '@react-pdf/renderer'
import type { QuoteItem, QuoteData } from '@/lib/quote-types'

Font.register({
  family: 'NotoKR',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/notosanskr/v36/PbykFmXiEBPT4ITbgNA5Cgm20xz64px_1hVWr0wuPNGmlQNMEfD4.0.woff2', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/notosanskr/v36/PbykFmXiEBPT4ITbgNA5Cgm20xz64px_1hVWr0wuPNGmlQNMEfD4.0.woff2', fontWeight: 700 },
  ],
})

// ── 높이 상수 (pt 단위) ─────────────────────────────────────────────
// 이 값들로 스페이서 높이를 계산하여 하단 블록을 페이지 하단에 정렬한다
const PAGE_H       = 841.89
const PAD_V        = 36       // paddingTop + paddingBottom 각각
const FOOTER_H     = 26       // footer 영역
const TITLE_H      = 58       // 제목 행
const PARTIES_H    = 92       // 수요자/공급자 박스
const TERMS_H      = 32       // 결제·납품 조건 행 (있을 때)
const T_HEADER_H   = 24       // 테이블 헤더
const ROW_H        = 22       // 품목 행 1개
const NOTES_H      = 44       // 특기사항 박스 (있을 때)
const GAP_TOTAL    = 20       // 섹션 간 여백 합산
const TOTALS_H     = 58       // 합계 3행
const SIG_H        = 152      // 직인 박스
const BOTTOM_H     = TOTALS_H + SIG_H + 14  // 하단 블록 전체 높이

const USABLE = PAGE_H - PAD_V * 2 - FOOTER_H  // ≈ 744

const NK = 'NotoKR'
const NAVY = '#1558D6'
const BLK  = '#111111'
const GRY  = '#F5F6F8'
const BD   = '#AAAAAA'
const BD2  = '#CCCCCC'

const S = StyleSheet.create({
  page: {
    fontFamily: NK,
    fontSize: 8.5,
    paddingTop: PAD_V,
    paddingBottom: PAD_V,
    paddingHorizontal: 36,
    color: BLK,
  },

  // ── 제목 영역 ──────────────────────────────────────────────
  titleWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 14,
    borderBottomWidth: 2,
    borderBottomColor: NAVY,
    paddingBottom: 10,
  },
  docTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: NAVY,
    letterSpacing: 8,
    textAlign: 'center',
    flex: 1,
  },
  metaBlock: { alignItems: 'flex-end' },
  metaLine: { fontSize: 7.5, color: '#444', marginBottom: 2 },
  companyLabel: { fontSize: 9, color: '#333', fontWeight: 700 },

  // ── 당사자 테이블 ───────────────────────────────────────────
  partyTable: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: BD,
    marginBottom: 8,
  },
  partyCol: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  partyColLeft: {
    borderRightWidth: 1,
    borderRightColor: BD,
  },
  partyHead: {
    fontSize: 7.5,
    fontWeight: 700,
    color: NAVY,
    letterSpacing: 0.5,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  partyRow: {
    flexDirection: 'row',
    marginBottom: 3.5,
  },
  partyLabel: {
    width: 46,
    color: '#666',
    fontSize: 8,
  },
  partyValue: {
    flex: 1,
    fontWeight: 700,
    fontSize: 8,
  },

  // ── 결제/납품 조건 행 ───────────────────────────────────────
  termsRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: BD,
    marginBottom: 8,
  },
  termCell: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  termCellLeft: {
    borderRightWidth: 1,
    borderRightColor: BD2,
  },
  termLabelText: {
    color: '#555',
    width: 50,
    fontSize: 8,
  },
  termValueText: {
    fontWeight: 700,
    flex: 1,
    fontSize: 8,
  },

  // ── 품목 테이블 ─────────────────────────────────────────────
  tHead: {
    flexDirection: 'row',
    backgroundColor: NAVY,
    paddingVertical: 7,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: NAVY,
  },
  tRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: BD2,
    borderLeftWidth: 1,
    borderLeftColor: BD,
    borderRightWidth: 1,
    borderRightColor: BD,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  tRowAlt: { backgroundColor: GRY },
  tRowLast: {
    borderBottomWidth: 1,
    borderBottomColor: BD,
  },
  cNo:     { width: 26, textAlign: 'center' },
  cName:   { flex: 1 },
  cSpec:   { width: 52, textAlign: 'center' },
  cUnit:   { width: 34, textAlign: 'center' },
  cQty:    { width: 42, textAlign: 'right' },
  cPrice:  { width: 70, textAlign: 'right' },
  cAmt:    { width: 82, textAlign: 'right' },
  hCell:   { color: '#fff', fontWeight: 700, fontSize: 8 },

  // ── 하단 합계 + 직인 ────────────────────────────────────────
  bottomRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: BD,
    marginTop: 0,
  },
  notesCell: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderRightColor: BD,
  },
  notesCellTitle: {
    fontSize: 7.5,
    color: '#777',
    fontWeight: 700,
    marginBottom: 5,
    letterSpacing: 0.5,
  },
  totalsCell: {
    width: 230,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  totalLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  totalLineLabel: {
    color: '#555',
    fontSize: 8.5,
  },
  totalLineValue: {
    fontWeight: 700,
    fontSize: 8.5,
    textAlign: 'right',
  },
  grandLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 2,
    borderTopColor: NAVY,
    paddingTop: 5,
    marginTop: 3,
  },
  grandLabel: {
    color: NAVY,
    fontWeight: 700,
    fontSize: 11,
  },
  grandValue: {
    color: NAVY,
    fontWeight: 700,
    fontSize: 11,
    textAlign: 'right',
  },

  sigRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: BD,
  },
  sigLeft: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: BD,
    minHeight: 80,
  },
  sigBox: {
    width: 230,
    alignItems: 'center',
    paddingVertical: 12,
  },
  sigCompany: {
    fontWeight: 700,
    fontSize: 10,
    marginBottom: 2,
  },
  sigSubtitle: {
    fontSize: 7.5,
    color: '#666',
    marginBottom: 6,
  },
  sigStampImg: {
    width: 68,
    height: 68,
    marginVertical: 4,
  },
  sigName: {
    fontSize: 7.5,
    color: '#666',
    marginTop: 4,
  },

  // ── 푸터 ────────────────────────────────────────────────────
  footer: {
    position: 'absolute',
    bottom: 14,
    left: 36,
    right: 36,
    textAlign: 'center',
    color: '#bbb',
    fontSize: 7,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 5,
  },
})

export type { QuoteItem, QuoteData } from '@/lib/quote-types'

function krw(n: number) {
  return n.toLocaleString('ko-KR') + '원'
}

export default function QuotePDFDocument({ data }: { data: QuoteData }) {
  const hasTerms   = !!(data.tradeTerms?.paymentTerms)
  const hasNotes   = !!data.notes

  // 스페이서 높이 계산: 상단 콘텐츠 + 하단 블록이 정확히 USABLE를 채우도록
  const topH =
    TITLE_H +
    PARTIES_H +
    (hasTerms ? TERMS_H : 0) +
    T_HEADER_H +
    data.items.length * ROW_H +
    GAP_TOTAL
  const spacerH = Math.max(0, USABLE - topH - BOTTOM_H - (hasNotes ? NOTES_H : 0))

  return (
    <Document>
      <Page size="A4" style={S.page}>

        {/* ── 제목 ── */}
        <View style={S.titleWrap}>
          <Text style={S.companyLabel}>한국건설트레이딩 (KCT)</Text>
          <Text style={S.docTitle}>견  적  서</Text>
          <View style={S.metaBlock}>
            <Text style={S.metaLine}>견적번호: {data.quoteNumber}</Text>
            <Text style={S.metaLine}>견적일자: {data.quoteDate}</Text>
            <Text style={S.metaLine}>유효기간: 30일</Text>
          </View>
        </View>

        {/* ── 수요자 / 공급자 ── */}
        <View style={S.partyTable}>
          <View style={[S.partyCol, S.partyColLeft]}>
            <Text style={S.partyHead}>수요자 (Buyer)</Text>
            <View style={S.partyRow}><Text style={S.partyLabel}>회사명</Text><Text style={S.partyValue}>{data.customerCompany || '-'}</Text></View>
            <View style={S.partyRow}><Text style={S.partyLabel}>담당자</Text><Text style={S.partyValue}>{data.customerName    || '-'}</Text></View>
            <View style={S.partyRow}><Text style={S.partyLabel}>연락처</Text><Text style={S.partyValue}>{data.customerPhone  || '-'}</Text></View>
            <View style={S.partyRow}><Text style={S.partyLabel}>이메일</Text><Text style={S.partyValue}>{data.customerEmail  || '-'}</Text></View>
          </View>
          <View style={S.partyCol}>
            <Text style={S.partyHead}>공급자 (Supplier)</Text>
            <View style={S.partyRow}><Text style={S.partyLabel}>회사명</Text><Text style={S.partyValue}>한국건설트레이딩 (KCT)</Text></View>
            <View style={S.partyRow}><Text style={S.partyLabel}>담당자</Text><Text style={S.partyValue}>이준환 (Lee Joon-hwan)</Text></View>
            <View style={S.partyRow}><Text style={S.partyLabel}>연락처</Text><Text style={S.partyValue}>+82-10-8939-0284</Text></View>
            <View style={S.partyRow}><Text style={S.partyLabel}>이메일</Text><Text style={S.partyValue}>sales@kconstrade.com</Text></View>
          </View>
        </View>

        {/* ── 결제·납품 조건 ── */}
        {hasTerms && (
          <View style={S.termsRow}>
            <View style={[S.termCell, S.termCellLeft]}>
              <Text style={S.termLabelText}>결제조건</Text>
              <Text style={S.termValueText}>{data.tradeTerms.paymentTerms}</Text>
            </View>
            <View style={S.termCell}>
              <Text style={S.termLabelText}>납품조건</Text>
              <Text style={S.termValueText}>{data.tradeTerms.leadTime || '협의'}</Text>
            </View>
          </View>
        )}

        {/* ── 품목 테이블 ── */}
        <View style={S.tHead}>
          <Text style={[S.cNo,    S.hCell]}>No</Text>
          <Text style={[S.cName,  S.hCell]}>품목명</Text>
          <Text style={[S.cSpec,  S.hCell]}>규격</Text>
          <Text style={[S.cUnit,  S.hCell]}>단위</Text>
          <Text style={[S.cQty,   S.hCell]}>수량</Text>
          <Text style={[S.cPrice, S.hCell]}>단가</Text>
          <Text style={[S.cAmt,   S.hCell]}>금액</Text>
        </View>
        {data.items.map((item: QuoteItem, i: number) => (
          <View
            key={item.id}
            style={[
              S.tRow,
              i % 2 === 1 ? S.tRowAlt : {},
              i === data.items.length - 1 ? S.tRowLast : {},
            ]}
          >
            <Text style={S.cNo}>{i + 1}</Text>
            <Text style={S.cName}>{item.name_ko}</Text>
            <Text style={S.cSpec}>{item.sku || '-'}</Text>
            <Text style={S.cUnit}>{item.unit}</Text>
            <Text style={S.cQty}>{item.quantity.toLocaleString('ko-KR')}</Text>
            <Text style={S.cPrice}>{item.unit_price.toLocaleString('ko-KR')}</Text>
            <Text style={S.cAmt}>{item.amount.toLocaleString('ko-KR')}</Text>
          </View>
        ))}

        {/* ── 계산된 스페이서 ─────────────────────────────────────────
            상단 콘텐츠 높이를 계산해 남은 공간을 채워 하단 블록을 페이지 끝으로 밀어냄
        ──────────────────────────────────────────────────────────── */}
        <View style={{ height: spacerH }} />

        {/* ── 합계 + 특기사항 행 ── */}
        <View style={S.bottomRow}>
          <View style={S.notesCell}>
            <Text style={S.notesCellTitle}>특기사항 (REMARKS)</Text>
            {hasNotes
              ? <Text style={{ fontSize: 8, lineHeight: 1.5 }}>{data.notes}</Text>
              : <Text style={{ fontSize: 8, color: '#bbb' }}>-</Text>
            }
          </View>
          <View style={S.totalsCell}>
            <View style={S.totalLine}>
              <Text style={S.totalLineLabel}>공 급 가 액</Text>
              <Text style={S.totalLineValue}>{krw(data.subtotal)}</Text>
            </View>
            <View style={S.totalLine}>
              <Text style={S.totalLineLabel}>부 가 세 (10%)</Text>
              <Text style={S.totalLineValue}>{krw(data.tax)}</Text>
            </View>
            <View style={S.grandLine}>
              <Text style={S.grandLabel}>합    계</Text>
              <Text style={S.grandValue}>{krw(data.total)}</Text>
            </View>
          </View>
        </View>

        {/* ── 직인 행 ── */}
        <View style={[S.sigRow, { borderWidth: 1, borderTopWidth: 0, borderColor: BD }]}>
          <View style={S.sigLeft} />
          <View style={S.sigBox}>
            <Text style={S.sigCompany}>한국건설트레이딩</Text>
            <Text style={S.sigSubtitle}>Korea Construction Trading</Text>
            <Image src="/assets/img/logo/stamp.png" style={S.sigStampImg} />
            <Text style={S.sigName}>이준환 (대표)</Text>
          </View>
        </View>

        {/* ── 푸터 ── */}
        <Text style={S.footer}>
          한국건설트레이딩 (KCT) | sales@kconstrade.com | +82-10-8939-0284 | kconstrade.com
        </Text>
      </Page>
    </Document>
  )
}
