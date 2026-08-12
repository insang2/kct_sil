'use client'

import { useState } from 'react'
import { pdf, Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer'
import type {
  AdminDocument,
  QuotationContent,
  PurchaseOrderContent,
  ReceiptContent,
  InvoiceContent,
  InvoicePackingListContent,
  SalesContractContent,
  DocLineItem,
  ReceiptItem,
  InvoiceLineItem,
  PackingLineItem,
  ContractLineItem,
} from '@/lib/admin-document-types'

Font.register({
  family: 'NotoKR',
  fonts: [
    { src: '/assets/fonts/noto-sans-kr-400.woff', fontWeight: 400 },
    { src: '/assets/fonts/noto-sans-kr-700.woff', fontWeight: 700 },
  ],
})

Font.register({
  family: 'CutiveMono',
  src: '/assets/fonts/cutive-mono-400.ttf',
})

const S = StyleSheet.create({
  page: { fontFamily: 'NotoKR', fontSize: 9, paddingTop: 40, paddingBottom: 50, paddingHorizontal: 40, color: '#111' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20, borderBottomWidth: 2, borderBottomColor: '#1558D6', paddingBottom: 10 },
  docTitle: { fontSize: 20, fontWeight: 700, color: '#1558D6', letterSpacing: 4 },
  metaText: { fontSize: 8, color: '#555', textAlign: 'right', marginBottom: 2 },
  sectionTitle: { fontSize: 8, fontWeight: 700, color: '#1558D6', marginBottom: 6 },
  partyRow: { flexDirection: 'row', marginBottom: 14, gap: 10 },
  partyBox: { flex: 1, borderWidth: 1, borderColor: '#dee2e6', borderRadius: 4, padding: 10 },
  partyLine: { flexDirection: 'row', marginBottom: 3 },
  partyLabel: { width: 52, color: '#666' },
  partyValue: { flex: 1, fontWeight: 700 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#1558D6', paddingVertical: 6, paddingHorizontal: 4 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee', paddingVertical: 5, paddingHorizontal: 4 },
  tableRowAlt: { backgroundColor: '#f8f9fa' },
  headerCell: { color: '#fff', fontWeight: 700, fontSize: 8 },
  colNo: { width: 22, textAlign: 'center' },
  colName: { flex: 1 },
  colSpec: { width: 70 },
  colUnit: { width: 34, textAlign: 'center' },
  colQty: { width: 36, textAlign: 'right' },
  colPrice: { width: 68, textAlign: 'right' },
  colAmount: { width: 76, textAlign: 'right' },
  colCond: { width: 50, textAlign: 'center' },
  totalBox: { marginTop: 8, alignItems: 'flex-end' },
  totalRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 3, minWidth: 200 },
  totalLabel: { width: 90, textAlign: 'right', color: '#555', paddingRight: 8 },
  totalValue: { width: 110, textAlign: 'right', fontWeight: 700 },
  totalFinalRow: { flexDirection: 'row', justifyContent: 'flex-end', borderTopWidth: 2, borderTopColor: '#1558D6', paddingTop: 4, minWidth: 200 },
  totalFinalLabel: { width: 90, textAlign: 'right', color: '#1558D6', fontWeight: 700, fontSize: 10, paddingRight: 8 },
  totalFinalValue: { width: 110, textAlign: 'right', fontWeight: 700, color: '#1558D6', fontSize: 10 },
  notesBox: { marginTop: 14, borderWidth: 1, borderColor: '#dee2e6', borderRadius: 4, padding: 10 },
  notesTitle: { fontSize: 8, fontWeight: 700, color: '#555', marginBottom: 4 },
  signRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 28 },
  signBox: { borderWidth: 1, borderColor: '#dee2e6', borderRadius: 4, padding: 14, width: 150, alignItems: 'center' },
  signStamp: { width: 64, height: 64, marginVertical: 8 },
  footer: { position: 'absolute', bottom: 20, left: 40, right: 40, textAlign: 'center', color: '#aaa', fontSize: 7, borderTopWidth: 1, borderTopColor: '#dee2e6', paddingTop: 6 },
  infoRow: { flexDirection: 'row', marginBottom: 2 },
  infoLabel: { width: 70, color: '#666' },
  infoValue: { flex: 1, fontWeight: 700 },
})

function fmt(n: number) { return n.toLocaleString('ko-KR') + '원' }

const KCT = {
  name: '한국건설트레이딩 (KCT)',
  rep: '이준환',
  phone: '+82-10-8939-0284',
  email: 'sales@kconstrade.com',
}

function PageFooter() {
  return (
    <Text style={S.footer}>
      한국건설트레이딩 (KCT) | sales@kconstrade.com | +82-10-8939-0284 | kconstrade.com
    </Text>
  )
}

function Signature({ label }: { label: string }) {
  return (
    <View style={S.signRow}>
      <View style={S.signBox}>
        <Text style={{ fontWeight: 700, marginBottom: 2, textAlign: 'center', fontSize: 9 }}>한국건설트레이딩</Text>
        <Text style={{ fontSize: 7, color: '#555', marginBottom: 4 }}>Korea Construction Trading</Text>
        <Image src="/assets/img/logo/stamp.png" style={S.signStamp} />
        <Text style={{ fontSize: 7, color: '#888' }}>이준환 (대표)</Text>
      </View>
    </View>
  )
}

function ItemsTable({ items }: { items: DocLineItem[] }) {
  return (
    <>
      <View style={S.tableHeader}>
        <Text style={[S.colNo, S.headerCell]}>No</Text>
        <Text style={[S.colName, S.headerCell]}>품목명</Text>
        <Text style={[S.colSpec, S.headerCell]}>규격</Text>
        <Text style={[S.colUnit, S.headerCell]}>단위</Text>
        <Text style={[S.colQty, S.headerCell]}>수량</Text>
        <Text style={[S.colPrice, S.headerCell]}>단가</Text>
        <Text style={[S.colAmount, S.headerCell]}>금액</Text>
      </View>
      {items.map((item, i) => (
        <View key={item.id} style={[S.tableRow, i % 2 === 1 ? S.tableRowAlt : {}]}>
          <Text style={S.colNo}>{i + 1}</Text>
          <Text style={S.colName}>{item.name}</Text>
          <Text style={S.colSpec}>{item.spec}</Text>
          <Text style={S.colUnit}>{item.unit}</Text>
          <Text style={S.colQty}>{item.qty}</Text>
          <Text style={S.colPrice}>{item.unitPrice.toLocaleString('ko-KR')}</Text>
          <Text style={S.colAmount}>{item.amount.toLocaleString('ko-KR')}</Text>
        </View>
      ))}
    </>
  )
}

function Totals({ subtotal, tax, total }: { subtotal: number; tax: number; total: number }) {
  return (
    <View style={S.totalBox}>
      <View style={S.totalRow}>
        <Text style={S.totalLabel}>공급가액</Text>
        <Text style={S.totalValue}>{fmt(subtotal)}</Text>
      </View>
      <View style={S.totalRow}>
        <Text style={S.totalLabel}>부가세 (10%)</Text>
        <Text style={S.totalValue}>{fmt(tax)}</Text>
      </View>
      <View style={S.totalFinalRow}>
        <Text style={S.totalFinalLabel}>합 계</Text>
        <Text style={S.totalFinalValue}>{fmt(total)}</Text>
      </View>
    </View>
  )
}

function QuotationDoc({ c }: { c: QuotationContent }) {
  return (
    <Document>
      <Page size="A4" style={S.page}>
        <View style={S.titleRow}>
          <Text style={{ fontSize: 10, color: '#555' }}>한국건설트레이딩 (KCT)</Text>
          <Text style={S.docTitle}>견  적  서</Text>
          <View>
            <Text style={S.metaText}>견적번호: {c.docNumber}</Text>
            <Text style={S.metaText}>견적일자: {c.docDate}</Text>
            <Text style={S.metaText}>유효기간: {c.validUntil}</Text>
          </View>
        </View>

        <View style={S.partyRow}>
          <View style={S.partyBox}>
            <Text style={S.sectionTitle}>수요자 (Buyer)</Text>
            <View style={S.partyLine}><Text style={S.partyLabel}>회사명</Text><Text style={S.partyValue}>{c.buyer.company || '-'}</Text></View>
            <View style={S.partyLine}><Text style={S.partyLabel}>담당자</Text><Text style={S.partyValue}>{c.buyer.contactPerson || '-'}</Text></View>
            <View style={S.partyLine}><Text style={S.partyLabel}>연락처</Text><Text style={S.partyValue}>{c.buyer.phone || '-'}</Text></View>
            <View style={S.partyLine}><Text style={S.partyLabel}>이메일</Text><Text style={S.partyValue}>{c.buyer.email || '-'}</Text></View>
            {c.buyer.address ? <View style={S.partyLine}><Text style={S.partyLabel}>주소</Text><Text style={S.partyValue}>{c.buyer.address}</Text></View> : null}
          </View>
          <View style={S.partyBox}>
            <Text style={S.sectionTitle}>공급자 (Supplier)</Text>
            <View style={S.partyLine}><Text style={S.partyLabel}>회사명</Text><Text style={S.partyValue}>{KCT.name}</Text></View>
            <View style={S.partyLine}><Text style={S.partyLabel}>담당자</Text><Text style={S.partyValue}>{KCT.rep}</Text></View>
            <View style={S.partyLine}><Text style={S.partyLabel}>연락처</Text><Text style={S.partyValue}>{KCT.phone}</Text></View>
            <View style={S.partyLine}><Text style={S.partyLabel}>이메일</Text><Text style={S.partyValue}>{KCT.email}</Text></View>
          </View>
        </View>

        <View style={{ marginBottom: 12, borderWidth: 1, borderColor: '#dee2e6', borderRadius: 4, padding: 8 }}>
          <View style={S.infoRow}><Text style={S.infoLabel}>결제조건</Text><Text style={S.infoValue}>{c.paymentTerms}</Text></View>
          <View style={S.infoRow}><Text style={S.infoLabel}>납품조건</Text><Text style={S.infoValue}>{c.deliveryTerms}</Text></View>
        </View>

        <ItemsTable items={c.items} />
        <Totals subtotal={c.subtotal} tax={c.tax} total={c.total} />

        {c.notes ? (
          <View style={S.notesBox}>
            <Text style={S.notesTitle}>특기사항</Text>
            <Text>{c.notes}</Text>
          </View>
        ) : null}

        <Signature label="공급자" />
        <PageFooter />
      </Page>
    </Document>
  )
}

function PurchaseOrderDoc({ c }: { c: PurchaseOrderContent }) {
  return (
    <Document>
      <Page size="A4" style={S.page}>
        <View style={S.titleRow}>
          <Text style={{ fontSize: 10, color: '#555' }}>한국건설트레이딩 (KCT)</Text>
          <Text style={[S.docTitle, { color: '#059669' }]}>발  주  서</Text>
          <View>
            <Text style={S.metaText}>발주번호: {c.docNumber}</Text>
            <Text style={S.metaText}>발주일자: {c.docDate}</Text>
            <Text style={S.metaText}>납기일자: {c.deliveryDate}</Text>
          </View>
        </View>

        <View style={S.partyRow}>
          <View style={S.partyBox}>
            <Text style={[S.sectionTitle, { color: '#059669' }]}>발주자 (Orderer)</Text>
            <View style={S.partyLine}><Text style={S.partyLabel}>회사명</Text><Text style={S.partyValue}>{KCT.name}</Text></View>
            <View style={S.partyLine}><Text style={S.partyLabel}>담당자</Text><Text style={S.partyValue}>{KCT.rep}</Text></View>
            <View style={S.partyLine}><Text style={S.partyLabel}>연락처</Text><Text style={S.partyValue}>{KCT.phone}</Text></View>
            <View style={S.partyLine}><Text style={S.partyLabel}>이메일</Text><Text style={S.partyValue}>{KCT.email}</Text></View>
          </View>
          <View style={S.partyBox}>
            <Text style={[S.sectionTitle, { color: '#059669' }]}>공급사 (Supplier)</Text>
            <View style={S.partyLine}><Text style={S.partyLabel}>회사명</Text><Text style={S.partyValue}>{c.supplier.company || '-'}</Text></View>
            <View style={S.partyLine}><Text style={S.partyLabel}>담당자</Text><Text style={S.partyValue}>{c.supplier.contactPerson || '-'}</Text></View>
            <View style={S.partyLine}><Text style={S.partyLabel}>연락처</Text><Text style={S.partyValue}>{c.supplier.phone || '-'}</Text></View>
            <View style={S.partyLine}><Text style={S.partyLabel}>이메일</Text><Text style={S.partyValue}>{c.supplier.email || '-'}</Text></View>
            {c.supplier.address ? <View style={S.partyLine}><Text style={S.partyLabel}>주소</Text><Text style={S.partyValue}>{c.supplier.address}</Text></View> : null}
          </View>
        </View>

        <View style={{ marginBottom: 12, borderWidth: 1, borderColor: '#dee2e6', borderRadius: 4, padding: 8 }}>
          <View style={S.infoRow}><Text style={S.infoLabel}>납품장소</Text><Text style={S.infoValue}>{c.deliveryLocation || '-'}</Text></View>
          {c.deliveryAddress ? <View style={S.infoRow}><Text style={S.infoLabel}>배송지 주소</Text><Text style={S.infoValue}>{c.deliveryAddress}</Text></View> : null}
          <View style={S.infoRow}><Text style={S.infoLabel}>결제조건</Text><Text style={S.infoValue}>{c.paymentTerms}</Text></View>
        </View>

        <View style={[S.tableHeader, { backgroundColor: '#059669' }]}>
          <Text style={[S.colNo, S.headerCell]}>No</Text>
          <Text style={[S.colName, S.headerCell]}>품목명</Text>
          <Text style={[S.colSpec, S.headerCell]}>규격</Text>
          <Text style={[S.colUnit, S.headerCell]}>단위</Text>
          <Text style={[S.colQty, S.headerCell]}>수량</Text>
          <Text style={[S.colPrice, S.headerCell]}>단가</Text>
          <Text style={[S.colAmount, S.headerCell]}>금액</Text>
        </View>
        {c.items.map((item, i) => (
          <View key={item.id} style={[S.tableRow, i % 2 === 1 ? S.tableRowAlt : {}]}>
            <Text style={S.colNo}>{i + 1}</Text>
            <Text style={S.colName}>{item.name}</Text>
            <Text style={S.colSpec}>{item.spec}</Text>
            <Text style={S.colUnit}>{item.unit}</Text>
            <Text style={S.colQty}>{item.qty}</Text>
            <Text style={S.colPrice}>{item.unitPrice.toLocaleString('ko-KR')}</Text>
            <Text style={S.colAmount}>{item.amount.toLocaleString('ko-KR')}</Text>
          </View>
        ))}

        <View style={S.totalBox}>
          <View style={S.totalRow}>
            <Text style={S.totalLabel}>공급가액</Text>
            <Text style={S.totalValue}>{fmt(c.subtotal)}</Text>
          </View>
          <View style={S.totalRow}>
            <Text style={S.totalLabel}>부가세 (10%)</Text>
            <Text style={S.totalValue}>{fmt(c.tax)}</Text>
          </View>
          <View style={[S.totalFinalRow, { borderTopColor: '#059669' }]}>
            <Text style={[S.totalFinalLabel, { color: '#059669' }]}>합 계</Text>
            <Text style={[S.totalFinalValue, { color: '#059669' }]}>{fmt(c.total)}</Text>
          </View>
        </View>

        {c.notes ? (
          <View style={S.notesBox}>
            <Text style={S.notesTitle}>특기사항</Text>
            <Text>{c.notes}</Text>
          </View>
        ) : null}

        <Signature label="발주자" />
        <PageFooter />
      </Page>
    </Document>
  )
}

function ReceiptDoc({ c }: { c: ReceiptContent }) {
  const totalQty = c.items.reduce((s, it) => s + it.qty, 0)
  return (
    <Document>
      <Page size="A4" style={S.page}>
        <View style={S.titleRow}>
          <Text style={{ fontSize: 10, color: '#555' }}>한국건설트레이딩 (KCT)</Text>
          <Text style={[S.docTitle, { color: '#D97706' }]}>인  수  증</Text>
          <View>
            <Text style={S.metaText}>인수증번호: {c.docNumber}</Text>
            <Text style={S.metaText}>인수일자: {c.docDate}</Text>
            <Text style={S.metaText}>납품일자: {c.deliveryDate}</Text>
          </View>
        </View>

        <View style={S.partyRow}>
          <View style={S.partyBox}>
            <Text style={[S.sectionTitle, { color: '#D97706' }]}>인수자 (Receiver)</Text>
            <View style={S.partyLine}><Text style={S.partyLabel}>회사명</Text><Text style={S.partyValue}>{c.receiver.company || '-'}</Text></View>
            <View style={S.partyLine}><Text style={S.partyLabel}>담당자</Text><Text style={S.partyValue}>{c.receiver.contactPerson || '-'}</Text></View>
            <View style={S.partyLine}><Text style={S.partyLabel}>연락처</Text><Text style={S.partyValue}>{c.receiver.phone || '-'}</Text></View>
          </View>
          <View style={S.partyBox}>
            <Text style={[S.sectionTitle, { color: '#D97706' }]}>인도자 (Deliverer)</Text>
            <View style={S.partyLine}><Text style={S.partyLabel}>회사명</Text><Text style={S.partyValue}>{c.deliverer.company || '-'}</Text></View>
            <View style={S.partyLine}><Text style={S.partyLabel}>담당자</Text><Text style={S.partyValue}>{c.deliverer.contactPerson || '-'}</Text></View>
            <View style={S.partyLine}><Text style={S.partyLabel}>연락처</Text><Text style={S.partyValue}>{c.deliverer.phone || '-'}</Text></View>
          </View>
        </View>

        <View style={[S.tableHeader, { backgroundColor: '#D97706' }]}>
          <Text style={[S.colNo, S.headerCell]}>No</Text>
          <Text style={[S.colName, S.headerCell]}>품목명</Text>
          <Text style={[S.colSpec, S.headerCell]}>규격</Text>
          <Text style={[S.colUnit, S.headerCell]}>단위</Text>
          <Text style={[S.colQty, S.headerCell]}>수량</Text>
          <Text style={[S.colCond, S.headerCell]}>상태</Text>
          <Text style={[{ flex: 1 }, S.headerCell]}>비고</Text>
        </View>
        {c.items.map((item, i) => (
          <View key={item.id} style={[S.tableRow, i % 2 === 1 ? S.tableRowAlt : {}]}>
            <Text style={S.colNo}>{i + 1}</Text>
            <Text style={S.colName}>{item.name}</Text>
            <Text style={S.colSpec}>{item.spec}</Text>
            <Text style={S.colUnit}>{item.unit}</Text>
            <Text style={S.colQty}>{item.qty}</Text>
            <Text style={S.colCond}>{item.condition}</Text>
            <Text style={{ flex: 1 }}>{item.notes}</Text>
          </View>
        ))}

        <View style={{ marginTop: 8, alignItems: 'flex-end' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', minWidth: 200 }}>
            <Text style={{ width: 90, textAlign: 'right', color: '#D97706', fontWeight: 700, fontSize: 10, paddingRight: 8 }}>총 수량</Text>
            <Text style={{ width: 110, textAlign: 'right', fontWeight: 700, color: '#D97706', fontSize: 10 }}>{totalQty.toLocaleString('ko-KR')}개</Text>
          </View>
        </View>

        <View style={{ marginTop: 12, borderWidth: 1, borderColor: '#dee2e6', borderRadius: 4, padding: 10 }}>
          <Text style={{ fontSize: 8, fontWeight: 700, color: '#555', marginBottom: 4 }}>인수 확인</Text>
          <Text>{c.acceptanceCondition}</Text>
        </View>

        {c.notes ? (
          <View style={S.notesBox}>
            <Text style={S.notesTitle}>특기사항</Text>
            <Text>{c.notes}</Text>
          </View>
        ) : null}

        <View style={[S.signRow, { gap: 20 }]}>
          <View style={S.signBox}>
            <Text style={{ fontWeight: 700, marginBottom: 6, textAlign: 'center', fontSize: 9 }}>인도자</Text>
            <Text style={{ fontSize: 8, color: '#555', marginBottom: 2 }}>{c.deliverer.company || '___________'}</Text>
            <Text style={{ fontSize: 8, color: '#888', marginTop: 16 }}>(서명)</Text>
          </View>
          <View style={S.signBox}>
            <Text style={{ fontWeight: 700, marginBottom: 4, textAlign: 'center', fontSize: 9 }}>인수자</Text>
            <Text style={{ fontSize: 7, color: '#555', marginBottom: 4 }}>한국건설트레이딩</Text>
            <Image src="/assets/img/logo/stamp.png" style={S.signStamp} />
            <Text style={{ fontSize: 7, color: '#888' }}>이준환 (대표)</Text>
          </View>
        </View>

        <PageFooter />
      </Page>
    </Document>
  )
}

function InvoiceHeaderEN({ c }: { c: InvoiceContent | InvoicePackingListContent }) {
  const consigneeRef = ((c as InvoiceContent).consignee as any)?.ref
  const consignee = (c as InvoiceContent).consignee ?? (c as InvoicePackingListContent).consignee
  return (
    <>
      <View style={ES.refGrid}>
        <View style={ES.refCell}>
          <Text style={ES.refLabel}>INVOICE NO.</Text>
          <Text style={ES.refValue}>{c.docNumber}</Text>
        </View>
        <View style={ES.refCell}>
          <Text style={ES.refLabel}>DATE</Text>
          <Text style={ES.refValue}>{c.docDate}</Text>
        </View>
        <View style={ES.refCell}>
          <Text style={ES.refLabel}>L/C NO.</Text>
          <Text style={ES.refValue}>{c.lcNo || 'NIL'}</Text>
        </View>
        <View style={ES.refCell}>
          <Text style={ES.refLabel}>INCOTERMS</Text>
          <Text style={ES.refValue}>{c.incoterms}</Text>
        </View>
        <View style={ES.refCellLast}>
          <Text style={ES.refLabel}>CURRENCY</Text>
          <Text style={ES.refValue}>{c.currency}</Text>
        </View>
      </View>

      <View style={ES.addrGrid}>
        <View style={ES.addrBox}>
          <Text style={ES.addrTitle}>CONSIGNEE</Text>
          <View style={ES.addrLine}><Text style={ES.addrKey}>COMPANY:</Text><Text style={ES.addrVal}>{consignee?.company || '—'}</Text></View>
          {consignee?.address ? <View style={ES.addrLine}><Text style={ES.addrKey}>ADDRESS:</Text><Text style={ES.addrVal}>{consignee.address}</Text></View> : null}
          {consignee?.tel ? <View style={ES.addrLine}><Text style={ES.addrKey}>TEL:</Text><Text style={ES.addrVal}>{consignee.tel}</Text></View> : null}
          {consigneeRef ? <View style={ES.addrLine}><Text style={ES.addrKey}>REF:</Text><Text style={ES.addrVal}>{consigneeRef}</Text></View> : null}
        </View>
        <View style={ES.addrBox}>
          <Text style={ES.addrTitle}>SHIPPER / SELLER</Text>
          <View style={ES.addrLine}><Text style={ES.addrKey}>COMPANY:</Text><Text style={ES.addrVal}>KOREA CONSTRUCTION TRADING CO., LTD.</Text></View>
          <View style={ES.addrLine}><Text style={ES.addrKey}>ADDRESS:</Text><Text style={ES.addrVal}>10 CHUNGMIN-RO, SONGPA-GU, SEOUL, KOREA</Text></View>
          <View style={ES.addrLine}><Text style={ES.addrKey}>TEL:</Text><Text style={ES.addrVal}>+82-10-8939-0284</Text></View>
          <View style={ES.addrLine}><Text style={ES.addrKey}>EMAIL:</Text><Text style={ES.addrVal}>SALES@KCONSTRADE.COM</Text></View>
        </View>
      </View>

      <View style={ES.termsBar}>
        {c.buyer2?.company ? <View style={ES.termItem}><Text style={ES.termLabel}>NOTIFY PARTY:</Text><Text style={ES.termValue}>{c.buyer2.company}</Text></View> : null}
        {c.customerOrderNo ? <View style={ES.termItem}><Text style={ES.termLabel}>CUSTOMER ORDER NO.:</Text><Text style={ES.termValue}>{c.customerOrderNo}</Text></View> : null}
        {c.lcDate ? <View style={ES.termItem}><Text style={ES.termLabel}>L/C DATE:</Text><Text style={ES.termValue}>{c.lcDate}</Text></View> : null}
        {c.lcIssuingBank ? <View style={ES.termItem}><Text style={ES.termLabel}>L/C ISSUING BANK:</Text><Text style={ES.termValue}>{c.lcIssuingBank}</Text></View> : null}
        <View style={ES.termItem}><Text style={ES.termLabel}>PORT OF LOADING:</Text><Text style={ES.termValue}>{c.portOfLoading}</Text></View>
        <View style={ES.termItem}><Text style={ES.termLabel}>PORT OF DESTINATION:</Text><Text style={ES.termValue}>{c.portOfDestination}</Text></View>
        {c.vessel ? <View style={ES.termItem}><Text style={ES.termLabel}>VESSEL / VOY:</Text><Text style={ES.termValue}>{c.vessel}</Text></View> : null}
        {c.departureDate ? <View style={ES.termItem}><Text style={ES.termLabel}>DEPARTURE DATE:</Text><Text style={ES.termValue}>{c.departureDate}</Text></View> : null}
        <View style={ES.termItem}><Text style={ES.termLabel}>COUNTRY OF ORIGIN:</Text><Text style={ES.termValue}>{c.countryOfOrigin || 'REPUBLIC OF KOREA'}</Text></View>
        <View style={ES.termItem}><Text style={ES.termLabel}>PAYMENT TERMS:</Text><Text style={ES.termValue}>{c.paymentTerms}</Text></View>
      </View>
    </>
  )
}

function InvoiceDoc({ c }: { c: InvoiceContent }) {
  const fmt2 = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2 })
  return (
    <Document>
      <Page size="A4" style={ES.page}>
        <ENLetterhead docType="COMMERCIAL INVOICE" />
        <InvoiceHeaderEN c={c} />

        <View style={ES.tableHeader}>
          <Text style={[{ width: 22, textAlign: 'center' }, ES.headerCell]}>NO.</Text>
          <Text style={[{ width: 60 }, ES.headerCell]}>MARKS</Text>
          <Text style={[{ width: 75 }, ES.headerCell]}>PACKAGES</Text>
          <Text style={[{ flex: 1 }, ES.headerCell]}>GOODS DESCRIPTION</Text>
          <Text style={[{ width: 30, textAlign: 'center' }, ES.headerCell]}>UNIT</Text>
          <Text style={[{ width: 36, textAlign: 'right' }, ES.headerCell]}>QTY</Text>
          <Text style={[{ width: 55, textAlign: 'right' }, ES.headerCell]}>UNIT PRICE</Text>
          <Text style={[{ width: 65, textAlign: 'right' }, ES.headerCell]}>AMOUNT</Text>
        </View>
        {c.items.map((item, i) => (
          <View key={item.id}>
            {item.hsCode ? (
              <View style={[ES.tableRow, { paddingVertical: 2 }]}>
                <Text style={{ width: 22 }} /><Text style={{ width: 60 }} /><Text style={{ width: 75 }} />
                <Text style={{ flex: 1, fontFamily: CM, fontSize: 7, color: '#555', letterSpacing: 0.4 }}>HS: {item.hsCode}</Text>
                <Text style={{ width: 30 }} /><Text style={{ width: 36 }} /><Text style={{ width: 55 }} /><Text style={{ width: 65 }} />
              </View>
            ) : null}
            <View style={[ES.tableRow, i % 2 === 0 ? {} : ES.tableRowAlt]}>
              <Text style={{ width: 22, textAlign: 'center', fontSize: 8 }}>{i + 1}</Text>
              <Text style={{ width: 60, fontSize: 8 }}>{item.shippingMark}</Text>
              <Text style={{ width: 75, fontSize: 8 }}>{item.packages}</Text>
              <Text style={{ flex: 1, fontSize: 8 }}>{item.description}</Text>
              <Text style={{ width: 30, textAlign: 'center', fontSize: 8 }}>{item.unit}</Text>
              <Text style={{ width: 36, textAlign: 'right', fontSize: 8 }}>{item.qty.toLocaleString()}</Text>
              <Text style={{ width: 55, textAlign: 'right', fontSize: 8 }}>{fmt2(item.unitPrice)}</Text>
              <Text style={{ width: 65, textAlign: 'right', fontSize: 8, fontFamily: NK, fontWeight: 700 }}>{fmt2(item.amount)}</Text>
            </View>
          </View>
        ))}

        <View style={ES.totalArea}>
          <View style={ES.totalFinalRow}>
            <Text style={ES.totalFinalLabel}>TOTAL ({c.incoterms}) {c.currency}</Text>
            <Text style={ES.totalFinalValue}>{fmt2(c.total)}</Text>
          </View>
        </View>
        {c.totalInWords ? <Text style={{ fontFamily: CM, fontSize: 7.5, color: '#333', marginTop: 5, letterSpacing: 0.3 }}>SAY: {c.totalInWords}</Text> : null}

        {c.notes ? (
          <View style={ES.notesBox}>
            <Text style={ES.notesTitle}>REMARKS</Text>
            <Text style={{ fontSize: 8 }}>{c.notes}</Text>
          </View>
        ) : null}

        <ENSignature by="LEE JOON HWAN" title="PRESIDENT" />
        <ENFooter docNumber={c.docNumber} />
      </Page>
    </Document>
  )
}

function InvoicePackingListDoc({ c }: { c: InvoicePackingListContent }) {
  const fmt2 = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2 })
  const fmt3 = (n: number) => n.toFixed(3)

  return (
    <Document>
      {/* Page 1: Commercial Invoice */}
      <Page size="A4" style={ES.page}>
        <ENLetterhead docType="COMMERCIAL INVOICE" />
        <InvoiceHeaderEN c={c} />

        <View style={ES.tableHeader}>
          <Text style={[{ width: 22, textAlign: 'center' }, ES.headerCell]}>NO.</Text>
          <Text style={[{ width: 56 }, ES.headerCell]}>MARKS</Text>
          <Text style={[{ width: 72 }, ES.headerCell]}>PACKAGES</Text>
          <Text style={[{ flex: 1 }, ES.headerCell]}>GOODS DESCRIPTION</Text>
          <Text style={[{ width: 28, textAlign: 'center' }, ES.headerCell]}>UNIT</Text>
          <Text style={[{ width: 36, textAlign: 'right' }, ES.headerCell]}>QTY</Text>
          <Text style={[{ width: 52, textAlign: 'right' }, ES.headerCell]}>UNIT PRICE</Text>
          <Text style={[{ width: 62, textAlign: 'right' }, ES.headerCell]}>AMOUNT</Text>
        </View>
        {c.items.map((item, i) => (
          <View key={item.id}>
            {item.hsCode ? (
              <View style={[ES.tableRow, { paddingVertical: 2 }]}>
                <Text style={{ width: 22 }} /><Text style={{ width: 56 }} /><Text style={{ width: 72 }} />
                <Text style={{ flex: 1, fontFamily: CM, fontSize: 7, color: '#555', letterSpacing: 0.4 }}>HS: {item.hsCode}</Text>
                <Text style={{ width: 28 }} /><Text style={{ width: 36 }} /><Text style={{ width: 52 }} /><Text style={{ width: 62 }} />
              </View>
            ) : null}
            <View style={[ES.tableRow, i % 2 === 0 ? {} : ES.tableRowAlt]}>
              <Text style={{ width: 22, textAlign: 'center', fontSize: 8 }}>{i + 1}</Text>
              <Text style={{ width: 56, fontSize: 8 }}>{item.shippingMark}</Text>
              <Text style={{ width: 72, fontSize: 8 }}>{item.packages}</Text>
              <Text style={{ flex: 1, fontSize: 8 }}>{item.description}</Text>
              <Text style={{ width: 28, textAlign: 'center', fontSize: 8 }}>{item.unit}</Text>
              <Text style={{ width: 36, textAlign: 'right', fontSize: 8 }}>{item.qty.toLocaleString()}</Text>
              <Text style={{ width: 52, textAlign: 'right', fontSize: 8 }}>{fmt2(item.unitPrice)}</Text>
              <Text style={{ width: 62, textAlign: 'right', fontSize: 8, fontFamily: NK, fontWeight: 700 }}>{fmt2(item.amount)}</Text>
            </View>
          </View>
        ))}

        <View style={ES.totalArea}>
          <View style={ES.totalFinalRow}>
            <Text style={ES.totalFinalLabel}>TOTAL ({c.incoterms}) {c.currency}</Text>
            <Text style={ES.totalFinalValue}>{fmt2(c.total)}</Text>
          </View>
        </View>
        {c.totalInWords ? <Text style={{ fontFamily: CM, fontSize: 7.5, color: '#333', marginTop: 5, letterSpacing: 0.3 }}>SAY: {c.totalInWords}</Text> : null}

        {c.notes ? (
          <View style={ES.notesBox}>
            <Text style={ES.notesTitle}>REMARKS</Text>
            <Text style={{ fontSize: 8 }}>{c.notes}</Text>
          </View>
        ) : null}

        <ENSignature by="LEE JOON HWAN" title="PRESIDENT" />
        <ENFooter docNumber={c.docNumber} />
      </Page>

      {/* Page 2: Packing List */}
      <Page size="A4" style={ES.page}>
        <ENLetterhead docType="PACKING LIST" />

        <View style={ES.refGrid}>
          <View style={ES.refCell}>
            <Text style={ES.refLabel}>REF. INVOICE NO.</Text>
            <Text style={ES.refValue}>{c.docNumber}</Text>
          </View>
          <View style={ES.refCell}>
            <Text style={ES.refLabel}>DATE</Text>
            <Text style={ES.refValue}>{c.docDate}</Text>
          </View>
          <View style={ES.refCell}>
            <Text style={ES.refLabel}>VESSEL / VOY</Text>
            <Text style={ES.refValue}>{c.vessel || '—'}</Text>
          </View>
          <View style={ES.refCellLast}>
            <Text style={ES.refLabel}>PORT OF DESTINATION</Text>
            <Text style={ES.refValue}>{c.portOfDestination}</Text>
          </View>
        </View>

        <View style={[ES.termsBar, { flexDirection: 'row', gap: 0 }]}>
          <View style={{ flex: 1, alignItems: 'center', borderRightWidth: 1, borderRightColor: '#aaa', paddingRight: 6 }}>
            <Text style={[ES.termLabel, { textAlign: 'center' }]}>TOTAL PACKAGES</Text>
            <Text style={[ES.termValue, { textAlign: 'center' }]}>{c.totalPackages || '—'}</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center', borderRightWidth: 1, borderRightColor: '#aaa', paddingHorizontal: 6 }}>
            <Text style={[ES.termLabel, { textAlign: 'center' }]}>NET WEIGHT (KGS)</Text>
            <Text style={[ES.termValue, { textAlign: 'center' }]}>{c.totalNetWeight.toLocaleString()}</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center', borderRightWidth: 1, borderRightColor: '#aaa', paddingHorizontal: 6 }}>
            <Text style={[ES.termLabel, { textAlign: 'center' }]}>GROSS WEIGHT (KGS)</Text>
            <Text style={[ES.termValue, { textAlign: 'center' }]}>{c.totalGrossWeight.toLocaleString()}</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center', paddingLeft: 6 }}>
            <Text style={[ES.termLabel, { textAlign: 'center' }]}>TOTAL CBM</Text>
            <Text style={[ES.termValue, { textAlign: 'center' }]}>{fmt3(c.totalCBM)}</Text>
          </View>
        </View>

        <View style={ES.tableHeader}>
          <Text style={[{ width: 22, textAlign: 'center' }, ES.headerCell]}>NO.</Text>
          <Text style={[{ width: 60 }, ES.headerCell]}>MARKS</Text>
          <Text style={[{ width: 80 }, ES.headerCell]}>PACKAGES</Text>
          <Text style={[{ flex: 1 }, ES.headerCell]}>GOODS DESCRIPTION</Text>
          <Text style={[{ width: 34, textAlign: 'center' }, ES.headerCell]}>UNIT</Text>
          <Text style={[{ width: 38, textAlign: 'right' }, ES.headerCell]}>QTY</Text>
          <Text style={[{ width: 52, textAlign: 'right' }, ES.headerCell]}>NET WT</Text>
          <Text style={[{ width: 56, textAlign: 'right' }, ES.headerCell]}>GROSS WT</Text>
          <Text style={[{ width: 44, textAlign: 'right' }, ES.headerCell]}>CBM</Text>
        </View>
        {c.items.map((item, i) => (
          <View key={item.id}>
            {item.hsCode ? (
              <View style={[ES.tableRow, { paddingVertical: 2 }]}>
                <Text style={{ width: 22 }} /><Text style={{ width: 60 }} /><Text style={{ width: 80 }} />
                <Text style={{ flex: 1, fontFamily: CM, fontSize: 7, color: '#555', letterSpacing: 0.4 }}>HS: {item.hsCode}</Text>
                <Text style={{ width: 34 }} /><Text style={{ width: 38 }} /><Text style={{ width: 52 }} /><Text style={{ width: 56 }} /><Text style={{ width: 44 }} />
              </View>
            ) : null}
            <View style={[ES.tableRow, i % 2 === 0 ? {} : ES.tableRowAlt]}>
              <Text style={{ width: 22, textAlign: 'center', fontSize: 8 }}>{i + 1}</Text>
              <Text style={{ width: 60, fontSize: 8 }}>{item.shippingMark}</Text>
              <Text style={{ width: 80, fontSize: 8 }}>{item.packages}</Text>
              <Text style={{ flex: 1, fontSize: 8 }}>{item.description}</Text>
              <Text style={{ width: 34, textAlign: 'center', fontSize: 8 }}>{item.unit}</Text>
              <Text style={{ width: 38, textAlign: 'right', fontSize: 8 }}>{item.qty.toLocaleString()}</Text>
              <Text style={{ width: 52, textAlign: 'right', fontSize: 8 }}>{item.netWeight.toLocaleString()}</Text>
              <Text style={{ width: 56, textAlign: 'right', fontSize: 8 }}>{item.grossWeight.toLocaleString()}</Text>
              <Text style={{ width: 44, textAlign: 'right', fontSize: 8 }}>{fmt3(item.cbm)}</Text>
            </View>
          </View>
        ))}

        <View style={{ flexDirection: 'row', borderTopWidth: 1.5, borderTopColor: '#111', paddingTop: 4, marginTop: 2, backgroundColor: '#f5f5f0', paddingHorizontal: 3 }}>
          <Text style={{ width: 22 + 60 + 80, textAlign: 'right', fontFamily: CM, fontSize: 8, paddingRight: 6, letterSpacing: 0.5 }}>TOTAL</Text>
          <Text style={{ flex: 1 }} />
          <Text style={{ width: 34 }} />
          <Text style={{ width: 38, textAlign: 'right', fontFamily: NK, fontWeight: 700, fontSize: 8 }}>{c.items.reduce((s, it) => s + it.qty, 0).toLocaleString()}</Text>
          <Text style={{ width: 52, textAlign: 'right', fontFamily: NK, fontWeight: 700, fontSize: 8 }}>{c.totalNetWeight.toLocaleString()}</Text>
          <Text style={{ width: 56, textAlign: 'right', fontFamily: NK, fontWeight: 700, fontSize: 8 }}>{c.totalGrossWeight.toLocaleString()}</Text>
          <Text style={{ width: 44, textAlign: 'right', fontFamily: NK, fontWeight: 700, fontSize: 8 }}>{fmt3(c.totalCBM)}</Text>
        </View>

        <ENSignature by="LEE JOON HWAN" title="PRESIDENT" />
        <ENFooter docNumber={c.docNumber} />
      </Page>
    </Document>
  )
}

function SalesContractDoc({ c }: { c: SalesContractContent }) {
  const fmt2 = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2 })
  return (
    <Document>
      <Page size="A4" style={ES.page}>
        <ENLetterhead docType="SALES CONTRACT" />

        <View style={ES.refGrid}>
          <View style={ES.refCell}>
            <Text style={ES.refLabel}>CONTRACT NO.</Text>
            <Text style={ES.refValue}>{c.contractNo}</Text>
          </View>
          <View style={ES.refCell}>
            <Text style={ES.refLabel}>DATE</Text>
            <Text style={ES.refValue}>{c.contractDate}</Text>
          </View>
          <View style={ES.refCellLast}>
            <Text style={ES.refLabel}>CURRENCY</Text>
            <Text style={ES.refValue}>{c.currency}</Text>
          </View>
        </View>

        <Text style={{ fontFamily: CM, fontSize: 7.5, color: '#555', marginBottom: 8, letterSpacing: 0.3 }}>
          THIS CONTRACT is entered into between the following parties:
        </Text>

        <View style={ES.addrGrid}>
          <View style={ES.addrBox}>
            <Text style={ES.addrTitle}>PARTY A — BUYER</Text>
            <View style={ES.addrLine}><Text style={ES.addrKey}>COMPANY:</Text><Text style={ES.addrVal}>{c.partyA.company || '—'}</Text></View>
            <View style={ES.addrLine}><Text style={ES.addrKey}>ADDRESS:</Text><Text style={ES.addrVal}>{c.partyA.address || '—'}</Text></View>
            <View style={ES.addrLine}><Text style={ES.addrKey}>TEL:</Text><Text style={ES.addrVal}>{c.partyA.tel || '—'}</Text></View>
            {c.partyA.bankName ? <View style={ES.addrLine}><Text style={ES.addrKey}>BANK:</Text><Text style={ES.addrVal}>{c.partyA.bankName}</Text></View> : null}
            {c.partyA.account ? <View style={ES.addrLine}><Text style={ES.addrKey}>ACCOUNT:</Text><Text style={ES.addrVal}>{c.partyA.account}</Text></View> : null}
          </View>
          <View style={ES.addrBox}>
            <Text style={ES.addrTitle}>PARTY B — SELLER</Text>
            <View style={ES.addrLine}><Text style={ES.addrKey}>COMPANY:</Text><Text style={ES.addrVal}>{c.partyB.company}</Text></View>
            <View style={ES.addrLine}><Text style={ES.addrKey}>ADDRESS:</Text><Text style={ES.addrVal}>{c.partyB.address}</Text></View>
            <View style={ES.addrLine}><Text style={ES.addrKey}>TEL:</Text><Text style={ES.addrVal}>{c.partyB.tel}</Text></View>
            {c.partyB.fax ? <View style={ES.addrLine}><Text style={ES.addrKey}>FAX:</Text><Text style={ES.addrVal}>{c.partyB.fax}</Text></View> : null}
            {c.partyB.bankName ? <View style={ES.addrLine}><Text style={ES.addrKey}>BANK:</Text><Text style={ES.addrVal}>{c.partyB.bankName}</Text></View> : null}
            {c.partyB.account ? <View style={ES.addrLine}><Text style={ES.addrKey}>ACCOUNT:</Text><Text style={ES.addrVal}>{c.partyB.account}</Text></View> : null}
            {c.partyB.swiftCode ? <View style={ES.addrLine}><Text style={ES.addrKey}>SWIFT:</Text><Text style={ES.addrVal}>{c.partyB.swiftCode}</Text></View> : null}
          </View>
        </View>

        <Text style={{ fontFamily: CM, fontSize: 8, color: EN_COLOR, marginBottom: 4, letterSpacing: 1 }}>ARTICLE 1 — COMMODITY ({c.currency})</Text>
        <View style={ES.tableHeader}>
          <Text style={[ES.colNo, ES.headerCell]}>NO.</Text>
          <Text style={[ES.colDesc, ES.headerCell]}>DESCRIPTION</Text>
          <Text style={[ES.colUnit, ES.headerCell]}>UNIT</Text>
          <Text style={[ES.colQty, ES.headerCell]}>QTY</Text>
          <Text style={[ES.colPrice, ES.headerCell]}>UNIT PRICE</Text>
          <Text style={[ES.colAmt, ES.headerCell]}>AMOUNT</Text>
        </View>
        {(c.items as ContractLineItem[]).map((item, i) => (
          <View key={item.id} style={[ES.tableRow, i % 2 === 1 ? ES.tableRowAlt : {}]}>
            <Text style={ES.colNo}>{i + 1}</Text>
            <Text style={ES.colDesc}>{item.description}</Text>
            <Text style={ES.colUnit}>{item.unit}</Text>
            <Text style={ES.colQty}>{item.qty}</Text>
            <Text style={ES.colPrice}>{fmt2(item.unitPrice)}</Text>
            <Text style={ES.colAmt}>{fmt2(item.amount)}</Text>
          </View>
        ))}
        <View style={ES.totalArea}>
          <View style={ES.totalFinalRow}>
            <Text style={ES.totalFinalLabel}>TOTAL ({c.currency})</Text>
            <Text style={ES.totalFinalValue}>{fmt2(c.total)}</Text>
          </View>
        </View>
        {c.totalInWords ? <Text style={{ fontFamily: CM, fontSize: 7.5, color: '#333', marginTop: 3, marginBottom: 8, letterSpacing: 0.3 }}>SAY: {c.totalInWords}</Text> : null}

        {c.qualityAndPacking ? (
          <View style={[ES.termsBar, { marginTop: 6 }]}>
            <Text style={{ fontFamily: CM, fontSize: 7.5, color: EN_COLOR, marginBottom: 5, letterSpacing: 1 }}>ARTICLE 2 — QUALITY &amp; PACKING</Text>
            <Text style={{ fontFamily: NK, fontSize: 7.5, lineHeight: 1.5 }}>{c.qualityAndPacking}</Text>
          </View>
        ) : null}

        <View style={[ES.termsBar, !c.qualityAndPacking ? { marginTop: 6 } : {}]}>
          <Text style={{ fontFamily: CM, fontSize: 7.5, color: EN_COLOR, marginBottom: 5, letterSpacing: 1 }}>ARTICLE 3 — SHIPPING TERMS</Text>
          <View style={ES.termItem}><Text style={ES.termLabel}>PORT OF LOADING:</Text><Text style={ES.termValue}>{c.portOfLoading}</Text></View>
          <View style={ES.termItem}><Text style={ES.termLabel}>PORT OF DESTINATION:</Text><Text style={ES.termValue}>{c.portOfDestination}</Text></View>
          <View style={ES.termItem}><Text style={ES.termLabel}>PRICE TERM:</Text><Text style={ES.termValue}>{c.priceTerm}</Text></View>
          <View style={ES.termItem}><Text style={ES.termLabel}>PARTIAL SHIPMENT:</Text><Text style={ES.termValue}>{c.partialShipment}</Text></View>
          <View style={ES.termItem}><Text style={ES.termLabel}>TRANSSHIPMENT:</Text><Text style={ES.termValue}>{c.transshipment}</Text></View>
        </View>

        <View style={ES.termsBar}>
          <Text style={{ fontFamily: CM, fontSize: 7.5, color: EN_COLOR, marginBottom: 5, letterSpacing: 1 }}>ARTICLE 4 — PAYMENT TERMS</Text>
          <Text style={{ fontFamily: NK, fontSize: 8.5 }}>{c.paymentTerms}</Text>
        </View>

        <View style={ES.termsBar}>
          <Text style={{ fontFamily: CM, fontSize: 7.5, color: EN_COLOR, marginBottom: 5, letterSpacing: 1 }}>ARTICLE 5 — DOCUMENTS</Text>
          {c.documents.map((doc, i) => (
            <Text key={i} style={{ fontFamily: NK, fontSize: 8, marginBottom: 2 }}>• {doc}</Text>
          ))}
        </View>

        {c.insurance ? (
          <View style={ES.termsBar}>
            <Text style={{ fontFamily: CM, fontSize: 7.5, color: EN_COLOR, marginBottom: 5, letterSpacing: 1 }}>ARTICLE 6 — INSURANCE</Text>
            <Text style={{ fontFamily: NK, fontSize: 7.5, lineHeight: 1.5 }}>{c.insurance}</Text>
          </View>
        ) : null}

        {c.inspectionClause ? (
          <View style={ES.termsBar}>
            <Text style={{ fontFamily: CM, fontSize: 7.5, color: EN_COLOR, marginBottom: 5, letterSpacing: 1 }}>ARTICLE 7 — INSPECTION</Text>
            <Text style={{ fontFamily: NK, fontSize: 7.5, lineHeight: 1.5 }}>{c.inspectionClause}</Text>
          </View>
        ) : null}

        {c.forceMajeure ? (
          <View style={ES.termsBar}>
            <Text style={{ fontFamily: CM, fontSize: 7.5, color: EN_COLOR, marginBottom: 5, letterSpacing: 1 }}>ARTICLE 8 — FORCE MAJEURE</Text>
            <Text style={{ fontFamily: NK, fontSize: 7.5, lineHeight: 1.5 }}>{c.forceMajeure}</Text>
          </View>
        ) : null}

        <View style={ES.termsBar}>
          <Text style={{ fontFamily: CM, fontSize: 7.5, color: EN_COLOR, marginBottom: 5, letterSpacing: 1 }}>ARTICLE 9 — ARBITRATION</Text>
          <Text style={{ fontFamily: NK, fontSize: 7.5, lineHeight: 1.5 }}>{c.arbitration}</Text>
        </View>

        <View style={ES.termsBar}>
          <Text style={{ fontFamily: CM, fontSize: 7.5, color: EN_COLOR, marginBottom: 5, letterSpacing: 1 }}>ARTICLE 10 — GENERAL CONDITIONS</Text>
          <Text style={{ fontFamily: NK, fontSize: 7.5, lineHeight: 1.5 }}>{c.generalConditions}</Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginHorizontal: 10 }}>
          <View style={ES.sigBlock}>
            <Text style={ES.sigLabel}>PARTY A — BUYER</Text>
            <View style={ES.sigLine} />
            <Text style={ES.sigName}>{c.partyA.company || '___________________'}</Text>
            <Text style={ES.sigTitle}>(AUTHORIZED SIGNATURE)</Text>
          </View>
          <View style={ES.sigBlock}>
            <Text style={ES.sigLabel}>PARTY B — SELLER</Text>
            <View style={ES.sigLine} />
            <Text style={ES.sigName}>LEE JOON HWAN</Text>
            <Text style={ES.sigTitle}>PRESIDENT / KOREA CONSTRUCTION TRADING</Text>
          </View>
        </View>

        <ENFooter docNumber={c.contractNo} />
      </Page>
    </Document>
  )
}

// ─── 영문 US 행정문서 스타일 ──────────────────────────────────────────────────

const EN_COLOR = '#1a2f50'

// CutiveMono는 Regular(400) 단일 weight만 지원 → fontWeight: 700 사용 금지
const CM = 'CutiveMono'
const NK = 'NotoKR'

const ES = StyleSheet.create({
  // 오프화이트 크림색 배경 — 타자기 용지 느낌
  page: { fontFamily: NK, fontSize: 9, paddingTop: 38, paddingBottom: 58, paddingHorizontal: 46, color: '#111', backgroundColor: '#fafaf7' },

  // 레터헤드: 이중 구분선으로 타자기 공문서 느낌
  lhRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', borderBottomWidth: 1, borderBottomColor: '#111', paddingBottom: 6, marginBottom: 3 },
  lhUnderline: { borderBottomWidth: 3, borderBottomColor: EN_COLOR, marginBottom: 10 },
  lhCompany: { fontFamily: CM, fontSize: 12, color: EN_COLOR, letterSpacing: 1.5 },
  lhDetail: { fontFamily: CM, fontSize: 7.5, color: '#333', marginTop: 2, letterSpacing: 0.4 },
  lhDocType: { fontFamily: CM, fontSize: 19, color: EN_COLOR, letterSpacing: 5 },

  // 참조 그리드
  refGrid: { flexDirection: 'row', borderWidth: 1, borderColor: '#333', marginBottom: 9 },
  refCell: { flex: 1, padding: 6, borderRightWidth: 1, borderRightColor: '#333' },
  refCellLast: { flex: 1, padding: 6 },
  refLabel: { fontFamily: CM, fontSize: 7, color: '#555', marginBottom: 3, letterSpacing: 0.8 },
  refValue: { fontFamily: NK, fontSize: 9, fontWeight: 700 },

  // 주소 박스
  addrGrid: { flexDirection: 'row', marginBottom: 9, gap: 8 },
  addrBox: { flex: 1, borderWidth: 1, borderColor: '#333', padding: 9, backgroundColor: '#fafaf7' },
  addrTitle: { fontFamily: CM, fontSize: 8, color: EN_COLOR, letterSpacing: 2, marginBottom: 6, borderBottomWidth: 1, borderBottomColor: '#999', paddingBottom: 4 },
  addrLine: { flexDirection: 'row', marginBottom: 3 },
  addrKey: { fontFamily: CM, width: 58, fontSize: 7.5, color: '#555', letterSpacing: 0.5 },
  addrVal: { fontFamily: NK, flex: 1, fontSize: 8.5, fontWeight: 700 },

  // 조건 바
  termsBar: { backgroundColor: '#f0f0ec', borderWidth: 1, borderColor: '#999', padding: 8, marginBottom: 10 },
  termItem: { flexDirection: 'row', marginBottom: 4 },
  termLabel: { fontFamily: CM, fontSize: 7.5, color: '#444', width: 120, letterSpacing: 0.7 },
  termValue: { fontFamily: NK, fontSize: 8.5, fontWeight: 700, flex: 1, color: '#111' },

  // 테이블 — 타자기 룰드 스타일 (솔리드 컬러 대신 상하 실선)
  tableHeader: { flexDirection: 'row', borderTopWidth: 1.5, borderTopColor: '#111', borderBottomWidth: 1.5, borderBottomColor: '#111', backgroundColor: '#eeeee9', paddingVertical: 6, paddingHorizontal: 3 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ccc', paddingVertical: 5, paddingHorizontal: 3 },
  tableRowAlt: { backgroundColor: '#f5f5f0' },
  headerCell: { fontFamily: CM, color: '#111', fontSize: 8, letterSpacing: 0.8 },
  colNo: { width: 22, textAlign: 'center' },
  colDesc: { fontFamily: NK, flex: 1 },
  colSpec: { fontFamily: NK, width: 68 },
  colUnit: { width: 36, textAlign: 'center' },
  colQty: { width: 38, textAlign: 'right' },
  colPrice: { width: 74, textAlign: 'right' },
  colAmt: { width: 82, textAlign: 'right' },
  colCond: { fontFamily: NK, width: 52, textAlign: 'center' },
  colNote: { fontFamily: NK, flex: 1 },

  // 합계
  totalArea: { marginTop: 10, alignItems: 'flex-end' },
  totalRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 3, minWidth: 230 },
  totalLabel: { fontFamily: CM, width: 110, textAlign: 'right', color: '#444', fontSize: 8, paddingRight: 8, letterSpacing: 0.5 },
  totalValue: { fontFamily: NK, width: 120, textAlign: 'right', fontSize: 9, fontWeight: 700, color: '#111' },
  totalFinalRow: { flexDirection: 'row', justifyContent: 'flex-end', borderTopWidth: 1, borderTopColor: '#111', paddingTop: 5, marginTop: 2, minWidth: 230 },
  totalFinalLabel: { fontFamily: CM, width: 110, textAlign: 'right', color: '#111', fontSize: 10, paddingRight: 8, letterSpacing: 1 },
  totalFinalValue: { fontFamily: NK, width: 120, textAlign: 'right', color: '#111', fontSize: 11, fontWeight: 700 },

  // 비고
  notesBox: { marginTop: 10, borderWidth: 1, borderColor: '#999', padding: 9, backgroundColor: '#fafaf7' },
  notesTitle: { fontFamily: CM, fontSize: 7.5, color: '#333', marginBottom: 4, letterSpacing: 1 },

  // 서명
  sigRow: { marginTop: 30, flexDirection: 'row', justifyContent: 'flex-end' },
  sigBlock: { width: 210 },
  sigLine: { borderTopWidth: 1, borderTopColor: '#333', marginTop: 4, marginBottom: 4 },
  sigLabel: { fontFamily: CM, fontSize: 7, color: '#666', marginBottom: 2, letterSpacing: 0.8 },
  sigName: { fontFamily: CM, fontSize: 10, color: '#111', letterSpacing: 1 },
  sigTitle: { fontFamily: CM, fontSize: 7.5, color: '#555', letterSpacing: 0.5 },

  // 푸터
  footer: { position: 'absolute', bottom: 18, left: 46, right: 46, borderTopWidth: 1, borderTopColor: '#777', paddingTop: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerText: { fontFamily: CM, fontSize: 7.5, color: '#222', letterSpacing: 0.4 },

  // 인수증 조건
  condBox: { marginTop: 10, padding: 9, borderWidth: 1, borderColor: '#999', backgroundColor: '#fafaf7' },
  condTitle: { fontFamily: CM, fontSize: 7.5, color: '#333', marginBottom: 4, letterSpacing: 1 },
})

function ENLetterhead({ docType }: { docType: string }) {
  return (
    <View style={ES.lhRow}>
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={ES.lhCompany}>KOREA CONSTRUCTION TRADING CO., LTD.</Text>
        <Text style={ES.lhDetail}>10 CHUNGMIN-RO, SONGPA-GU, SEOUL, REPUBLIC OF KOREA</Text>
        <Text style={ES.lhDetail}>TEL: +82-10-8939-0284  |  EMAIL: SALES@KCONSTRADE.COM  |  KCONSTRADE.COM</Text>
      </View>
      <Text style={[ES.lhDocType, { flexShrink: 0 }]}>{docType}</Text>
    </View>
  )
}

function ENFooter({ docNumber }: { docNumber: string }) {
  return (
    <View style={ES.footer} fixed>
      <Text style={ES.footerText}>KOREA CONSTRUCTION TRADING CO., LTD.</Text>
      <Text style={ES.footerText}>DOC NO: {docNumber}</Text>
      <Text style={ES.footerText}>
        SALES@KCONSTRADE.COM{'  '}
        <Text render={({ pageNumber, totalPages }) => `| PAGE ${pageNumber} / ${totalPages}`} />
      </Text>
    </View>
  )
}

function ENSignature({ by = 'LEE JOON HWAN', title = 'PRESIDENT' }: { by?: string; title?: string }) {
  return (
    <View style={ES.sigRow}>
      <View style={ES.sigBlock}>
        <Text style={ES.sigLabel}>AUTHORIZED SIGNATURE</Text>
        <View style={ES.sigLine} />
        <Text style={ES.sigName}>{by}</Text>
        <Text style={ES.sigTitle}>{title} / KOREA CONSTRUCTION TRADING</Text>
      </View>
    </View>
  )
}

function QuotationDocEN({ c }: { c: QuotationContent }) {
  return (
    <Document>
      <Page size="A4" style={ES.page}>
        <ENLetterhead docType="PRICE QUOTATION" />

        <View style={ES.refGrid}>
          <View style={ES.refCell}>
            <Text style={ES.refLabel}>QUOTATION NO.</Text>
            <Text style={ES.refValue}>{c.docNumber}</Text>
          </View>
          <View style={ES.refCell}>
            <Text style={ES.refLabel}>DATE</Text>
            <Text style={ES.refValue}>{c.docDate}</Text>
          </View>
          <View style={ES.refCell}>
            <Text style={ES.refLabel}>VALID UNTIL</Text>
            <Text style={ES.refValue}>{c.validUntil}</Text>
          </View>
          <View style={ES.refCellLast}>
            <Text style={ES.refLabel}>CURRENCY</Text>
            <Text style={ES.refValue}>KRW (KOREAN WON)</Text>
          </View>
        </View>

        <View style={ES.addrGrid}>
          <View style={ES.addrBox}>
            <Text style={ES.addrTitle}>BILL TO / SHIP TO</Text>
            <View style={ES.addrLine}><Text style={ES.addrKey}>COMPANY:</Text><Text style={ES.addrVal}>{c.buyer.company || '—'}</Text></View>
            <View style={ES.addrLine}><Text style={ES.addrKey}>ATTN:</Text><Text style={ES.addrVal}>{c.buyer.contactPerson || '—'}</Text></View>
            <View style={ES.addrLine}><Text style={ES.addrKey}>TEL:</Text><Text style={ES.addrVal}>{c.buyer.phone || '—'}</Text></View>
            <View style={ES.addrLine}><Text style={ES.addrKey}>EMAIL:</Text><Text style={ES.addrVal}>{c.buyer.email || '—'}</Text></View>
            {c.buyer.address ? <View style={ES.addrLine}><Text style={ES.addrKey}>ADDRESS:</Text><Text style={ES.addrVal}>{c.buyer.address}</Text></View> : null}
          </View>
          <View style={ES.addrBox}>
            <Text style={ES.addrTitle}>SUBMITTED BY</Text>
            <View style={ES.addrLine}><Text style={ES.addrKey}>COMPANY:</Text><Text style={ES.addrVal}>KOREA CONSTRUCTION TRADING</Text></View>
            <View style={ES.addrLine}><Text style={ES.addrKey}>REP.:</Text><Text style={ES.addrVal}>LEE JOON HWAN</Text></View>
            <View style={ES.addrLine}><Text style={ES.addrKey}>TEL:</Text><Text style={ES.addrVal}>+82-10-8939-0284</Text></View>
            <View style={ES.addrLine}><Text style={ES.addrKey}>EMAIL:</Text><Text style={ES.addrVal}>SALES@KCONSTRADE.COM</Text></View>
          </View>
        </View>

        <View style={ES.termsBar}>
          <View style={ES.termItem}><Text style={ES.termLabel}>PAYMENT TERMS:</Text><Text style={ES.termValue}>{c.paymentTerms}</Text></View>
          <View style={ES.termItem}><Text style={ES.termLabel}>DELIVERY TERMS:</Text><Text style={ES.termValue}>{c.deliveryTerms}</Text></View>
        </View>

        <View style={ES.tableHeader}>
          <Text style={[ES.colNo, ES.headerCell]}>NO.</Text>
          <Text style={[ES.colDesc, ES.headerCell]}>DESCRIPTION</Text>
          <Text style={[ES.colSpec, ES.headerCell]}>SPEC / MODEL</Text>
          <Text style={[ES.colUnit, ES.headerCell]}>UNIT</Text>
          <Text style={[ES.colQty, ES.headerCell]}>QTY</Text>
          <Text style={[ES.colPrice, ES.headerCell]}>UNIT PRICE</Text>
          <Text style={[ES.colAmt, ES.headerCell]}>AMOUNT</Text>
        </View>
        {c.items.map((item, i) => (
          <View key={item.id} style={[ES.tableRow, i % 2 === 1 ? ES.tableRowAlt : {}]}>
            <Text style={ES.colNo}>{i + 1}</Text>
            <Text style={ES.colDesc}>{item.name}</Text>
            <Text style={ES.colSpec}>{item.spec}</Text>
            <Text style={ES.colUnit}>{item.unit}</Text>
            <Text style={ES.colQty}>{item.qty}</Text>
            <Text style={ES.colPrice}>{item.unitPrice.toLocaleString('en-US')}</Text>
            <Text style={ES.colAmt}>{item.amount.toLocaleString('en-US')}</Text>
          </View>
        ))}

        <View style={ES.totalArea}>
          <View style={ES.totalRow}>
            <Text style={ES.totalLabel}>SUBTOTAL</Text>
            <Text style={ES.totalValue}>{c.subtotal.toLocaleString('en-US')}</Text>
          </View>
          <View style={ES.totalRow}>
            <Text style={ES.totalLabel}>VAT (10%)</Text>
            <Text style={ES.totalValue}>{c.tax.toLocaleString('en-US')}</Text>
          </View>
          <View style={ES.totalFinalRow}>
            <Text style={ES.totalFinalLabel}>TOTAL (KRW)</Text>
            <Text style={ES.totalFinalValue}>{c.total.toLocaleString('en-US')}</Text>
          </View>
        </View>

        {c.notes ? (
          <View style={ES.notesBox}>
            <Text style={ES.notesTitle}>REMARKS</Text>
            <Text style={{ fontSize: 8 }}>{c.notes}</Text>
          </View>
        ) : null}

        <ENSignature />
        <ENFooter docNumber={c.docNumber} />
      </Page>
    </Document>
  )
}

function PurchaseOrderDocEN({ c }: { c: PurchaseOrderContent }) {
  return (
    <Document>
      <Page size="A4" style={ES.page}>
        <ENLetterhead docType="PURCHASE ORDER" />

        <View style={ES.refGrid}>
          <View style={ES.refCell}>
            <Text style={ES.refLabel}>P.O. NUMBER</Text>
            <Text style={ES.refValue}>{c.docNumber}</Text>
          </View>
          <View style={ES.refCell}>
            <Text style={ES.refLabel}>ORDER DATE</Text>
            <Text style={ES.refValue}>{c.docDate}</Text>
          </View>
          <View style={ES.refCell}>
            <Text style={ES.refLabel}>DELIVERY DATE</Text>
            <Text style={ES.refValue}>{c.deliveryDate}</Text>
          </View>
          <View style={ES.refCellLast}>
            <Text style={ES.refLabel}>CURRENCY</Text>
            <Text style={ES.refValue}>KRW (KOREAN WON)</Text>
          </View>
        </View>

        <View style={ES.addrGrid}>
          <View style={ES.addrBox}>
            <Text style={ES.addrTitle}>ORDERER (BUYER)</Text>
            <View style={ES.addrLine}><Text style={ES.addrKey}>COMPANY:</Text><Text style={ES.addrVal}>KOREA CONSTRUCTION TRADING</Text></View>
            <View style={ES.addrLine}><Text style={ES.addrKey}>REP.:</Text><Text style={ES.addrVal}>LEE JOON HWAN</Text></View>
            <View style={ES.addrLine}><Text style={ES.addrKey}>TEL:</Text><Text style={ES.addrVal}>+82-10-8939-0284</Text></View>
            <View style={ES.addrLine}><Text style={ES.addrKey}>EMAIL:</Text><Text style={ES.addrVal}>SALES@KCONSTRADE.COM</Text></View>
          </View>
          <View style={ES.addrBox}>
            <Text style={ES.addrTitle}>VENDOR / SUPPLIER</Text>
            <View style={ES.addrLine}><Text style={ES.addrKey}>COMPANY:</Text><Text style={ES.addrVal}>{c.supplier.company || '—'}</Text></View>
            <View style={ES.addrLine}><Text style={ES.addrKey}>ATTN:</Text><Text style={ES.addrVal}>{c.supplier.contactPerson || '—'}</Text></View>
            <View style={ES.addrLine}><Text style={ES.addrKey}>TEL:</Text><Text style={ES.addrVal}>{c.supplier.phone || '—'}</Text></View>
            <View style={ES.addrLine}><Text style={ES.addrKey}>EMAIL:</Text><Text style={ES.addrVal}>{c.supplier.email || '—'}</Text></View>
            {c.supplier.address ? <View style={ES.addrLine}><Text style={ES.addrKey}>ADDRESS:</Text><Text style={ES.addrVal}>{c.supplier.address}</Text></View> : null}
          </View>
        </View>

        <View style={ES.termsBar}>
          <View style={ES.termItem}><Text style={ES.termLabel}>DELIVERY LOCATION:</Text><Text style={ES.termValue}>{c.deliveryLocation || '—'}</Text></View>
          {c.deliveryAddress ? <View style={ES.termItem}><Text style={ES.termLabel}>DELIVERY ADDRESS:</Text><Text style={ES.termValue}>{c.deliveryAddress}</Text></View> : null}
          <View style={ES.termItem}><Text style={ES.termLabel}>PAYMENT TERMS:</Text><Text style={ES.termValue}>{c.paymentTerms}</Text></View>
        </View>

        <View style={ES.tableHeader}>
          <Text style={[ES.colNo, ES.headerCell]}>NO.</Text>
          <Text style={[ES.colDesc, ES.headerCell]}>DESCRIPTION</Text>
          <Text style={[ES.colSpec, ES.headerCell]}>SPEC / MODEL</Text>
          <Text style={[ES.colUnit, ES.headerCell]}>UNIT</Text>
          <Text style={[ES.colQty, ES.headerCell]}>QTY</Text>
          <Text style={[ES.colPrice, ES.headerCell]}>UNIT PRICE</Text>
          <Text style={[ES.colAmt, ES.headerCell]}>AMOUNT</Text>
        </View>
        {c.items.map((item, i) => (
          <View key={item.id} style={[ES.tableRow, i % 2 === 1 ? ES.tableRowAlt : {}]}>
            <Text style={ES.colNo}>{i + 1}</Text>
            <Text style={ES.colDesc}>{item.name}</Text>
            <Text style={ES.colSpec}>{item.spec}</Text>
            <Text style={ES.colUnit}>{item.unit}</Text>
            <Text style={ES.colQty}>{item.qty}</Text>
            <Text style={ES.colPrice}>{item.unitPrice.toLocaleString('en-US')}</Text>
            <Text style={ES.colAmt}>{item.amount.toLocaleString('en-US')}</Text>
          </View>
        ))}

        <View style={ES.totalArea}>
          <View style={ES.totalRow}>
            <Text style={ES.totalLabel}>SUBTOTAL</Text>
            <Text style={ES.totalValue}>{c.subtotal.toLocaleString('en-US')}</Text>
          </View>
          <View style={ES.totalRow}>
            <Text style={ES.totalLabel}>VAT (10%)</Text>
            <Text style={ES.totalValue}>{c.tax.toLocaleString('en-US')}</Text>
          </View>
          <View style={ES.totalFinalRow}>
            <Text style={ES.totalFinalLabel}>TOTAL (KRW)</Text>
            <Text style={ES.totalFinalValue}>{c.total.toLocaleString('en-US')}</Text>
          </View>
        </View>

        {c.notes ? (
          <View style={ES.notesBox}>
            <Text style={ES.notesTitle}>REMARKS</Text>
            <Text style={{ fontSize: 8 }}>{c.notes}</Text>
          </View>
        ) : null}

        <ENSignature />
        <ENFooter docNumber={c.docNumber} />
      </Page>
    </Document>
  )
}

function ReceiptDocEN({ c }: { c: ReceiptContent }) {
  const totalQty = c.items.reduce((s, it) => s + it.qty, 0)
  return (
    <Document>
      <Page size="A4" style={ES.page}>
        <ENLetterhead docType="RECEIPT OF GOODS" />

        <View style={ES.refGrid}>
          <View style={ES.refCell}>
            <Text style={ES.refLabel}>RECEIPT NO.</Text>
            <Text style={ES.refValue}>{c.docNumber}</Text>
          </View>
          <View style={ES.refCell}>
            <Text style={ES.refLabel}>RECEIPT DATE</Text>
            <Text style={ES.refValue}>{c.docDate}</Text>
          </View>
          <View style={ES.refCellLast}>
            <Text style={ES.refLabel}>DELIVERY DATE</Text>
            <Text style={ES.refValue}>{c.deliveryDate}</Text>
          </View>
        </View>

        <View style={ES.addrGrid}>
          <View style={ES.addrBox}>
            <Text style={ES.addrTitle}>DELIVERED BY</Text>
            <View style={ES.addrLine}><Text style={ES.addrKey}>COMPANY:</Text><Text style={ES.addrVal}>{c.deliverer.company || '—'}</Text></View>
            <View style={ES.addrLine}><Text style={ES.addrKey}>ATTN:</Text><Text style={ES.addrVal}>{c.deliverer.contactPerson || '—'}</Text></View>
            <View style={ES.addrLine}><Text style={ES.addrKey}>TEL:</Text><Text style={ES.addrVal}>{c.deliverer.phone || '—'}</Text></View>
          </View>
          <View style={ES.addrBox}>
            <Text style={ES.addrTitle}>RECEIVED BY</Text>
            <View style={ES.addrLine}><Text style={ES.addrKey}>COMPANY:</Text><Text style={ES.addrVal}>{c.receiver.company || 'KOREA CONSTRUCTION TRADING'}</Text></View>
            <View style={ES.addrLine}><Text style={ES.addrKey}>ATTN:</Text><Text style={ES.addrVal}>{c.receiver.contactPerson || 'LEE JOON HWAN'}</Text></View>
            <View style={ES.addrLine}><Text style={ES.addrKey}>TEL:</Text><Text style={ES.addrVal}>{c.receiver.phone || '+82-10-8939-0284'}</Text></View>
          </View>
        </View>

        <View style={ES.tableHeader}>
          <Text style={[ES.colNo, ES.headerCell]}>NO.</Text>
          <Text style={[ES.colDesc, ES.headerCell]}>DESCRIPTION</Text>
          <Text style={[ES.colSpec, ES.headerCell]}>SPEC / MODEL</Text>
          <Text style={[ES.colUnit, ES.headerCell]}>UNIT</Text>
          <Text style={[ES.colQty, ES.headerCell]}>QTY</Text>
          <Text style={[ES.colCond, ES.headerCell]}>CONDITION</Text>
          <Text style={[ES.colNote, ES.headerCell]}>NOTES</Text>
        </View>
        {c.items.map((item, i) => (
          <View key={item.id} style={[ES.tableRow, i % 2 === 1 ? ES.tableRowAlt : {}]}>
            <Text style={ES.colNo}>{i + 1}</Text>
            <Text style={ES.colDesc}>{item.name}</Text>
            <Text style={ES.colSpec}>{item.spec}</Text>
            <Text style={ES.colUnit}>{item.unit}</Text>
            <Text style={ES.colQty}>{item.qty}</Text>
            <Text style={ES.colCond}>{item.condition}</Text>
            <Text style={ES.colNote}>{item.notes}</Text>
          </View>
        ))}

        <View style={{ marginTop: 8, alignItems: 'flex-end' }}>
          <View style={[ES.totalFinalRow]}>
            <Text style={ES.totalFinalLabel}>TOTAL QTY</Text>
            <Text style={ES.totalFinalValue}>{totalQty.toLocaleString('en-US')} EA</Text>
          </View>
        </View>

        <View style={ES.condBox}>
          <Text style={ES.condTitle}>ACCEPTANCE CONDITION</Text>
          <Text style={{ fontSize: 8 }}>{c.acceptanceCondition}</Text>
        </View>

        {c.notes ? (
          <View style={ES.notesBox}>
            <Text style={ES.notesTitle}>REMARKS</Text>
            <Text style={{ fontSize: 8 }}>{c.notes}</Text>
          </View>
        ) : null}

        <View style={[ES.sigRow, { gap: 20, justifyContent: 'space-between', marginHorizontal: 20 }]}>
          <View style={[ES.sigBlock]}>
            <Text style={ES.sigLabel}>DELIVERED BY</Text>
            <View style={ES.sigLine} />
            <Text style={ES.sigName}>{c.deliverer.company || '___________________'}</Text>
            <Text style={ES.sigTitle}>(AUTHORIZED SIGNATURE)</Text>
          </View>
          <View style={ES.sigBlock}>
            <Text style={ES.sigLabel}>RECEIVED BY</Text>
            <View style={ES.sigLine} />
            <Text style={ES.sigName}>LEE JOON HWAN</Text>
            <Text style={ES.sigTitle}>PRESIDENT / KOREA CONSTRUCTION TRADING</Text>
          </View>
        </View>

        <ENFooter docNumber={c.docNumber} />
      </Page>
    </Document>
  )
}

const STEPS = ['문서 구성 중...', '레이아웃 렌더링...', 'PDF 변환 중...']

export default function DocumentPDFButton({ doc, size = 'sm' }: { doc: AdminDocument; size?: 'sm' | 'md' }) {
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(0)

  async function handleDownload() {
    if (loading) return
    setLoading(true)
    setStep(0)

    try {
      // PDF 다운로드 기능 비활성화 (버튼 애니메이션만 동작)
      setTimeout(() => setStep(1), 400)
      setTimeout(() => setStep(2), 900)
      await new Promise((resolve) => setTimeout(resolve, 1400))

      // const isEN = doc.lang === 'en'
      // let element: React.ReactElement
      // if (doc.doc_type === 'quotation') {
      //   element = isEN
      //     ? <QuotationDocEN c={doc.content as QuotationContent} />
      //     : <QuotationDoc c={doc.content as QuotationContent} />
      // } else if (doc.doc_type === 'purchase_order') {
      //   element = isEN
      //     ? <PurchaseOrderDocEN c={doc.content as PurchaseOrderContent} />
      //     : <PurchaseOrderDoc c={doc.content as PurchaseOrderContent} />
      // } else if (doc.doc_type === 'receipt') {
      //   element = isEN
      //     ? <ReceiptDocEN c={doc.content as ReceiptContent} />
      //     : <ReceiptDoc c={doc.content as ReceiptContent} />
      // } else if (doc.doc_type === 'invoice') {
      //   element = <InvoiceDoc c={doc.content as InvoiceContent} />
      // } else if (doc.doc_type === 'invoice_packing_list') {
      //   element = <InvoicePackingListDoc c={doc.content as InvoicePackingListContent} />
      // } else if (doc.doc_type === 'sales_contract') {
      //   element = <SalesContractDoc c={doc.content as SalesContractContent} />
      // } else {
      //   element = <ReceiptDoc c={doc.content as ReceiptContent} />
      // }

      // const blob = await pdf(element as any).toBlob()
      // clearTimeout(t1)
      // clearTimeout(t2)

      // const url = URL.createObjectURL(blob)
      // const a = document.createElement('a')
      // a.href = url
      // a.download = `${doc.doc_number}.pdf`
      // document.body.appendChild(a)
      // a.click()
      // document.body.removeChild(a)
      // URL.revokeObjectURL(url)
    } finally {
      setLoading(false)
      setStep(0)
    }
  }

  if (size === 'md') {
    return (
      <div>
        <button
          className="btn btn-danger rounded-pill px-4"
          onClick={handleDownload}
          disabled={loading}
        >
          {loading ? (
            <span className="d-flex align-items-center gap-2">
              <span className="spinner-border spinner-border-sm" />
              {STEPS[step]}
            </span>
          ) : (
            <><i className="bi bi-file-earmark-pdf me-2" />PDF 다운로드</>
          )}
        </button>
        {loading && (
          <div className="mt-2">
            <div className="progress rounded-pill" style={{ height: 4 }}>
              <div
                className="progress-bar progress-bar-animated bg-danger"
                style={{ width: step === 0 ? '30%' : step === 1 ? '65%' : '90%', transition: 'width 0.4s ease' }}
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <button
      className="btn btn-outline-danger btn-sm rounded-pill px-2"
      onClick={handleDownload}
      disabled={loading}
      title="PDF 다운로드"
    >
      {loading
        ? <span className="spinner-border spinner-border-sm" style={{ width: 12, height: 12 }} />
        : <i className="bi bi-file-earmark-pdf" />
      }
    </button>
  )
}
