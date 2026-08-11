'use client'

import { useState } from 'react'
import { pdf, Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'
import type { QuoteData, QuoteItem } from '@/lib/quote-types'

Font.register({
  family: 'NotoKR',
  fonts: [
    { src: '/assets/fonts/noto-sans-latin-400.woff', fontWeight: 400 },
    { src: '/assets/fonts/noto-sans-kr-400.woff',    fontWeight: 400 },
    { src: '/assets/fonts/noto-sans-kr-700.woff',    fontWeight: 700 },
  ],
})

const S = StyleSheet.create({
  page: { fontFamily: 'NotoKR', fontSize: 9, paddingTop: 40, paddingBottom: 40, paddingHorizontal: 40, color: '#111' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20, borderBottomWidth: 2, borderBottomColor: '#1558D6', paddingBottom: 10 },
  docTitle: { fontSize: 22, fontWeight: 700, color: '#1558D6', letterSpacing: 6 },
  metaText: { fontSize: 8, color: '#555', textAlign: 'right' },
  partyRow: { flexDirection: 'row', marginBottom: 16, gap: 12 },
  partyBox: { flex: 1, borderWidth: 1, borderColor: '#dee2e6', borderRadius: 4, padding: 10 },
  partyTitle: { fontSize: 8, fontWeight: 700, color: '#1558D6', marginBottom: 6 },
  partyLine: { flexDirection: 'row', marginBottom: 3 },
  partyLabel: { width: 50, color: '#666' },
  partyValue: { flex: 1, fontWeight: 700 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#1558D6', paddingVertical: 6, paddingHorizontal: 4 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#dee2e6', paddingVertical: 5, paddingHorizontal: 4 },
  tableRowAlt: { backgroundColor: '#f8f9fa' },
  colNo: { width: 24, textAlign: 'center' },
  colName: { flex: 1 },
  colUnit: { width: 36, textAlign: 'center' },
  colQty: { width: 40, textAlign: 'right' },
  colPrice: { width: 70, textAlign: 'right' },
  colAmount: { width: 80, textAlign: 'right' },
  headerCell: { color: '#fff', fontWeight: 700, fontSize: 8 },
  totalBox: { marginTop: 8, alignItems: 'flex-end' },
  totalRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 3, minWidth: 220 },
  totalLabel: { width: 100, textAlign: 'right', color: '#555', paddingRight: 8 },
  totalValue: { width: 120, textAlign: 'right', fontWeight: 700 },
  totalFinalRow: { flexDirection: 'row', justifyContent: 'flex-end', borderTopWidth: 2, borderTopColor: '#1558D6', paddingTop: 4, minWidth: 220 },
  totalFinalLabel: { width: 100, textAlign: 'right', color: '#1558D6', fontWeight: 700, fontSize: 11, paddingRight: 8 },
  totalFinalValue: { width: 120, textAlign: 'right', fontWeight: 700, color: '#1558D6', fontSize: 11 },
  notesBox: { marginTop: 16, borderWidth: 1, borderColor: '#dee2e6', borderRadius: 4, padding: 10 },
  notesTitle: { fontSize: 8, fontWeight: 700, color: '#555', marginBottom: 4 },
  signatureRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 30 },
  signatureBox: { borderWidth: 1, borderColor: '#dee2e6', borderRadius: 4, padding: 16, width: 160, alignItems: 'center' },
  signatureStamp: { width: 60, height: 60, borderWidth: 2, borderColor: '#cc0000', borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginVertical: 8 },
  stampText: { color: '#cc0000', fontWeight: 700, fontSize: 10, textAlign: 'center' },
  footer: { position: 'absolute', bottom: 20, left: 40, right: 40, textAlign: 'center', color: '#aaa', fontSize: 7, borderTopWidth: 1, borderTopColor: '#dee2e6', paddingTop: 6 },
})

function fmt(n: number) { return n.toLocaleString('ko-KR') + '원' }

function QuoteDocument({ data }: { data: QuoteData }) {
  return (
    <Document>
      <Page size="A4" style={S.page}>
        <View style={S.titleRow}>
          <Text style={{ fontSize: 10, color: '#555' }}>Korea Construction Trading (KCT)</Text>
          <Text style={S.docTitle}>QUOTATION</Text>
          <View>
            <Text style={S.metaText}>Quote No.: {data.quoteNumber}</Text>
            <Text style={S.metaText}>Date: {data.quoteDate}</Text>
            <Text style={S.metaText}>Valid for 30 days</Text>
          </View>
        </View>

        <View style={S.partyRow}>
          <View style={S.partyBox}>
            <Text style={S.partyTitle}>Buyer</Text>
            <View style={S.partyLine}><Text style={S.partyLabel}>Company</Text><Text style={S.partyValue}>{data.customerCompany || '-'}</Text></View>
            <View style={S.partyLine}><Text style={S.partyLabel}>Contact</Text><Text style={S.partyValue}>{data.customerName || '-'}</Text></View>
            <View style={S.partyLine}><Text style={S.partyLabel}>Email</Text><Text style={S.partyValue}>{data.customerEmail || '-'}</Text></View>
            <View style={S.partyLine}><Text style={S.partyLabel}>Phone</Text><Text style={S.partyValue}>{data.customerPhone || '-'}</Text></View>
          </View>
          <View style={S.partyBox}>
            <Text style={S.partyTitle}>Supplier</Text>
            <View style={S.partyLine}><Text style={S.partyLabel}>Company</Text><Text style={S.partyValue}>Korea Construction Trading (KCT)</Text></View>
            <View style={S.partyLine}><Text style={S.partyLabel}>Contact</Text><Text style={S.partyValue}>Lee Joon-hwan</Text></View>
            <View style={S.partyLine}><Text style={S.partyLabel}>Email</Text><Text style={S.partyValue}>sales@kconstrade.com</Text></View>
            <View style={S.partyLine}><Text style={S.partyLabel}>Phone</Text><Text style={S.partyValue}>+82-10-8939-0284</Text></View>
          </View>
        </View>

        {/* Trade Terms */}
        <View style={{ marginBottom: 12, borderWidth: 1, borderColor: '#dee2e6', borderRadius: 4 }}>
          <View style={{ backgroundColor: '#1558D6', paddingVertical: 5, paddingHorizontal: 8 }}>
            <Text style={{ color: '#fff', fontWeight: 700, fontSize: 8 }}>Trade Terms</Text>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 8, gap: 4 }}>
            {[
              ['Incoterms', data.tradeTerms?.incoterms],
              ['Payment', data.tradeTerms?.paymentTerms],
              ['Currency', data.tradeTerms?.currency],
              ['Port of Loading', data.tradeTerms?.portOfLoading],
              ['Lead Time', data.tradeTerms?.leadTime],
              ['Validity', data.tradeTerms?.validity],
            ].map(([label, value]) => (
              <View key={label} style={{ flexDirection: 'row', width: '48%', marginBottom: 2 }}>
                <Text style={{ width: 72, color: '#666' }}>{label}</Text>
                <Text style={{ fontWeight: 700 }}>{value ?? '-'}</Text>
              </View>
            ))}
            {data.tradeTerms?.documents?.length > 0 && (
              <View style={{ flexDirection: 'row', width: '100%', marginTop: 2 }}>
                <Text style={{ width: 72, color: '#666' }}>Documents</Text>
                <Text style={{ flex: 1, fontWeight: 700 }}>{data.tradeTerms.documents.join(', ')}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={S.tableHeader}>
          <Text style={[S.colNo, S.headerCell]}>No</Text>
          <Text style={[S.colName, S.headerCell]}>Description</Text>
          <Text style={[S.colUnit, S.headerCell]}>Unit</Text>
          <Text style={[S.colQty, S.headerCell]}>Qty</Text>
          <Text style={[S.colPrice, S.headerCell]}>Unit Price</Text>
          <Text style={[S.colAmount, S.headerCell]}>Amount</Text>
        </View>

        {data.items.map((item: QuoteItem, i: number) => (
          <View key={item.id} style={[S.tableRow, i % 2 === 1 ? S.tableRowAlt : {}]}>
            <Text style={S.colNo}>{i + 1}</Text>
            <Text style={S.colName}>{item.name_en ?? item.name_ko}{item.sku ? ` (${item.sku})` : ''}</Text>
            <Text style={S.colUnit}>{item.unit}</Text>
            <Text style={S.colQty}>{item.quantity}</Text>
            <Text style={S.colPrice}>{item.unit_price.toLocaleString('en-US')}</Text>
            <Text style={S.colAmount}>{item.amount.toLocaleString('en-US')}</Text>
          </View>
        ))}

        <View style={S.totalBox}>
          <View style={S.totalRow}>
            <Text style={S.totalLabel}>Subtotal</Text>
            <Text style={S.totalValue}>KRW {data.subtotal.toLocaleString('en-US')}</Text>
          </View>
          <View style={S.totalRow}>
            <Text style={S.totalLabel}>VAT (10%)</Text>
            <Text style={S.totalValue}>KRW {data.tax.toLocaleString('en-US')}</Text>
          </View>
          <View style={S.totalFinalRow}>
            <Text style={S.totalFinalLabel}>Total</Text>
            <Text style={S.totalFinalValue}>KRW {data.total.toLocaleString('en-US')}</Text>
          </View>
        </View>

        {data.notes ? (
          <View style={S.notesBox}>
            <Text style={S.notesTitle}>Notes</Text>
            <Text>{data.notes}</Text>
          </View>
        ) : null}

        <View style={S.signatureRow}>
          <View style={S.signatureBox}>
            <Text style={{ fontWeight: 700, marginBottom: 4, textAlign: 'center' }}>Korea Construction Trading</Text>
            <Text style={{ fontSize: 8, color: '#555', marginBottom: 4 }}>KCT Co., Ltd.</Text>
            <View style={S.signatureStamp}>
              <Text style={S.stampText}>KCT</Text>
              <Text style={[S.stampText, { fontSize: 7 }]}>SEAL</Text>
            </View>
            <Text style={{ fontSize: 7, color: '#888' }}>Lee Joon-hwan (CEO)</Text>
          </View>
        </View>

        <Text style={S.footer}>
          Korea Construction Trading (KCT) | sales@kconstrade.com | +82-10-8939-0284 | kconstrade.com
        </Text>
      </Page>
    </Document>
  )
}

const STEPS = ['문서 구성 중...', '레이아웃 렌더링...', 'PDF 변환 중...']

export default function PDFDownloadButton({
  data,
  fileName,
  label,
}: {
  data: QuoteData
  fileName: string
  label: string
}) {
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(0)

  async function handleDownload() {
    if (loading) return
    setLoading(true)
    setStep(0)

    try {
      const t1 = setTimeout(() => setStep(1), 400)
      const t2 = setTimeout(() => setStep(2), 900)

      const blob = await pdf(<QuoteDocument data={data} />).toBlob()

      clearTimeout(t1)
      clearTimeout(t2)

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } finally {
      setLoading(false)
      setStep(0)
    }
  }

  return (
    <div>
      <button
        className="btn btn-primary btn-lg rounded-pill w-100"
        onClick={handleDownload}
        disabled={loading}
      >
        {loading ? (
          <span className="d-flex align-items-center justify-content-center gap-2">
            <span className="spinner-border spinner-border-sm" style={{ flexShrink: 0 }} />
            {STEPS[step]}
          </span>
        ) : (
          <><i className="bi bi-file-earmark-pdf me-2"></i>{label}</>
        )}
      </button>

      {loading && (
        <div className="mt-2">
          <div className="progress rounded-pill" style={{ height: 5 }}>
            <div
              className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
              style={{
                width: step === 0 ? '30%' : step === 1 ? '65%' : '90%',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
          <p className="text-body-secondary text-center mt-1 mb-0" style={{ fontSize: '0.75rem' }}>
            {STEPS[step]}
          </p>
        </div>
      )}
    </div>
  )
}
