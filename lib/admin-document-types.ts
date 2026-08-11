export interface ProductOption {
  id: number
  brand: string
  sku: string | null
  name_ko: string
  name_en: string | null
  unit: string
  list_price: number
  price_standard: number | null
  price_silver: number | null
  price_gold: number | null
  price_platinum: number | null
}

export interface CustomerOption {
  id: string
  company_name: string | null
  contact_person: string | null
  phone: string | null
  tier: string
}

export type DocType =
  | 'quotation'
  | 'purchase_order'
  | 'receipt'
  | 'invoice'
  | 'invoice_packing_list'
  | 'sales_contract'

export type DocStatus = 'draft' | 'final'

// ─── 공통 라인 아이템 ──────────────────────────────────────────────────────────
export interface DocLineItem {
  id: number
  name: string
  spec: string
  unit: string
  qty: number
  unitPrice: number
  amount: number
  notes: string
}

export interface ReceiptItem {
  id: number
  name: string
  spec: string
  unit: string
  qty: number
  condition: string
  notes: string
}

// 인보이스 라인 아이템 (영문)
export interface InvoiceLineItem {
  id: number
  shippingMark: string
  packages: string
  hsCode: string
  description: string
  unit: string
  qty: number
  unitPrice: number
  amount: number
}

// 패킹리스트 라인 아이템 (인보이스 price + 패킹 weight 통합)
export interface PackingLineItem {
  id: number
  shippingMark: string
  packages: string
  hsCode: string
  description: string
  unit: string
  qty: number
  unitPrice: number
  amount: number
  netWeight: number
  grossWeight: number
  cbm: number
}

// 공급계약서 라인 아이템
export interface ContractLineItem {
  id: number
  description: string
  unit: string
  qty: number
  unitPrice: number
  amount: number
}

// ─── 문서 컨텐츠 타입 ──────────────────────────────────────────────────────────
export interface QuotationContent {
  docNumber: string
  docDate: string
  validUntil: string
  buyer: { company: string; contactPerson: string; phone: string; email: string; address: string }
  items: DocLineItem[]
  subtotal: number; tax: number; total: number
  paymentTerms: string; deliveryTerms: string; notes: string
}

export interface PurchaseOrderContent {
  docNumber: string; docDate: string; deliveryDate: string
  deliveryLocation: string; deliveryAddress: string
  supplier: { company: string; contactPerson: string; phone: string; email: string; address: string }
  items: DocLineItem[]
  subtotal: number; tax: number; total: number
  paymentTerms: string; notes: string
}

export interface ReceiptContent {
  docNumber: string; docDate: string; deliveryDate: string
  receiver: { company: string; contactPerson: string; phone: string }
  deliverer: { company: string; contactPerson: string; phone: string }
  items: ReceiptItem[]
  acceptanceCondition: string; notes: string
}

export interface InvoiceContent {
  docNumber: string
  docDate: string
  lcNo: string
  lcDate?: string
  lcIssuingBank?: string
  currency: string
  incoterms: string
  portOfLoading: string
  portOfDestination: string
  departureDate: string
  arrivalDate: string
  vessel: string
  consignee: { company: string; address: string; tel: string; ref: string }
  buyer2: { company: string; address: string; tel: string }
  customerOrderNo: string
  countryOfOrigin: string
  items: InvoiceLineItem[]
  total: number
  totalInWords: string
  paymentTerms: string
  notes: string
}

export interface InvoicePackingListContent {
  docNumber: string
  docDate: string
  lcNo: string
  lcDate?: string
  lcIssuingBank?: string
  currency: string
  incoterms: string
  portOfLoading: string
  portOfDestination: string
  departureDate: string
  arrivalDate: string
  vessel: string
  consignee: { company: string; address: string; tel: string }
  buyer2: { company: string; address: string; tel: string }
  customerOrderNo: string
  countryOfOrigin: string
  items: PackingLineItem[]
  total: number
  totalInWords: string
  totalPackages: string
  totalNetWeight: number
  totalGrossWeight: number
  totalCBM: number
  paymentTerms: string
  notes: string
}

export interface SalesContractContent {
  contractNo: string
  contractDate: string
  currency: string
  partyA: { company: string; address: string; tel: string; bankName: string; account: string }
  partyB: {
    company: string; address: string; tel: string; fax: string
    bankName: string; bankAddress: string; account: string; swiftCode: string
  }
  items: ContractLineItem[]
  total: number
  totalInWords: string
  portOfDestination: string
  portOfLoading: string
  priceTerm: string
  partialShipment: string
  transshipment: string
  paymentTerms: string
  documents: string[]
  qualityAndPacking?: string
  insurance?: string
  inspectionClause?: string
  forceMajeure?: string
  arbitration: string
  generalConditions: string
}

export type DocContent =
  | QuotationContent
  | PurchaseOrderContent
  | ReceiptContent
  | InvoiceContent
  | InvoicePackingListContent
  | SalesContractContent

export interface AdminDocument {
  id: string
  doc_type: DocType
  doc_number: string
  title: string
  content: DocContent
  status: DocStatus
  lang: 'ko' | 'en'
  created_at: string
  updated_at: string
}

// ─── 메타데이터 ────────────────────────────────────────────────────────────────
export const DOC_TYPE_LABELS: Record<DocType, string> = {
  quotation: '견적서',
  purchase_order: '발주서',
  receipt: '인수증',
  invoice: '인보이스',
  invoice_packing_list: '인보이스+패킹리스트',
  sales_contract: '공급계약서',
}

export const DOC_TYPE_ICONS: Record<DocType, string> = {
  quotation: 'bi-file-earmark-text',
  purchase_order: 'bi-cart-check',
  receipt: 'bi-clipboard-check',
  invoice: 'bi-receipt',
  invoice_packing_list: 'bi-box-seam',
  sales_contract: 'bi-file-earmark-ruled',
}

export const DOC_TYPE_COLORS: Record<DocType, string> = {
  quotation: '#1558D6',
  purchase_order: '#059669',
  receipt: '#D97706',
  invoice: '#7C3AED',
  invoice_packing_list: '#0891B2',
  sales_contract: '#DC2626',
}

export const DOC_STATUS_LABELS: Record<DocStatus, string> = {
  draft: '임시저장',
  final: '확정',
}

// ─── 유틸리티 ──────────────────────────────────────────────────────────────────
export function genDocNumber(type: DocType): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const rand = Math.floor(Math.random() * 900) + 100
  const prefixes: Record<DocType, string> = {
    quotation: 'Q', purchase_order: 'PO', receipt: 'R',
    invoice: 'INV', invoice_packing_list: 'IPL', sales_contract: 'SC',
  }
  return `KCT-${prefixes[type]}-${y}${m}${d}-${rand}`
}

function todayStr(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

function addDays(days: number): string {
  const d = new Date(); d.setDate(d.getDate() + days)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const KCT_PARTY_B = {
  company: 'Korea Construction Trading Co., Ltd. (한국건설트레이딩)',
  address: 'Seoul, Republic of Korea',
  tel: '+82-10-8939-0284',
  fax: '',
  bankName: '',
  bankAddress: '',
  account: '',
  swiftCode: '',
}

export function defaultContent(type: DocType): DocContent {
  const today = todayStr()

  if (type === 'quotation') return {
    docNumber: genDocNumber(type), docDate: today, validUntil: addDays(30),
    buyer: { company: '', contactPerson: '', phone: '', email: '', address: '' },
    items: [{ id: 1, name: '', spec: '', unit: '개', qty: 1, unitPrice: 0, amount: 0, notes: '' }],
    subtotal: 0, tax: 0, total: 0,
    paymentTerms: '세금계산서 발행 후 30일 이내', deliveryTerms: '계약 후 협의', notes: '',
  } as QuotationContent

  if (type === 'purchase_order') return {
    docNumber: genDocNumber(type), docDate: today, deliveryDate: addDays(14),
    deliveryLocation: '', deliveryAddress: '',
    supplier: { company: '', contactPerson: '', phone: '', email: '', address: '' },
    items: [{ id: 1, name: '', spec: '', unit: '개', qty: 1, unitPrice: 0, amount: 0, notes: '' }],
    subtotal: 0, tax: 0, total: 0, paymentTerms: '납품 후 30일 이내', notes: '',
  } as PurchaseOrderContent

  if (type === 'receipt') return {
    docNumber: genDocNumber(type), docDate: today, deliveryDate: today,
    receiver: { company: '한국건설트레이딩 (KCT)', contactPerson: '이준환', phone: '+82-10-8939-0284' },
    deliverer: { company: '', contactPerson: '', phone: '' },
    items: [{ id: 1, name: '', spec: '', unit: '개', qty: 1, condition: '양호', notes: '' }],
    acceptanceCondition: '수량 및 외관 이상 없음을 확인함', notes: '',
  } as ReceiptContent

  const blankInvItem = { id: 1, shippingMark: '', packages: '', hsCode: '', description: '', unit: 'EA', qty: 0, unitPrice: 0, amount: 0 }

  if (type === 'invoice') return {
    docNumber: genDocNumber(type), docDate: today,
    lcNo: 'NIL', lcDate: '', lcIssuingBank: '',
    currency: 'USD', incoterms: 'FOB',
    portOfLoading: 'ICN', portOfDestination: '',
    departureDate: '', arrivalDate: '',
    vessel: '',
    consignee: { company: '', address: '', tel: '', ref: '' },
    buyer2: { company: '', address: '', tel: '' },
    customerOrderNo: '',
    countryOfOrigin: 'REPUBLIC OF KOREA',
    items: [{ ...blankInvItem }],
    total: 0, totalInWords: '',
    paymentTerms: 'T/T 100% IN ADVANCE',
    notes: '',
  } as InvoiceContent

  if (type === 'invoice_packing_list') return {
    docNumber: genDocNumber(type), docDate: today,
    lcNo: 'NIL', lcDate: '', lcIssuingBank: '',
    currency: 'USD', incoterms: 'FOB',
    portOfLoading: 'ICN', portOfDestination: '',
    departureDate: '', arrivalDate: '',
    vessel: '',
    consignee: { company: '', address: '', tel: '' },
    buyer2: { company: '', address: '', tel: '' },
    customerOrderNo: '',
    countryOfOrigin: 'REPUBLIC OF KOREA',
    items: [{ ...blankInvItem, netWeight: 0, grossWeight: 0, cbm: 0 }],
    total: 0, totalInWords: '',
    totalPackages: '',
    totalNetWeight: 0, totalGrossWeight: 0, totalCBM: 0,
    paymentTerms: 'T/T 100% IN ADVANCE', notes: '',
  } as InvoicePackingListContent

  // sales_contract
  return {
    contractNo: genDocNumber(type), contractDate: today,
    currency: 'USD',
    partyA: { company: '', address: '', tel: '', bankName: '', account: '' },
    partyB: { ...KCT_PARTY_B },
    items: [{ id: 1, description: '', unit: 'EA', qty: 0, unitPrice: 0, amount: 0 }],
    total: 0, totalInWords: '',
    portOfDestination: '', portOfLoading: 'Busan Port, Busan, Korea',
    priceTerm: 'FOB Busan', partialShipment: 'Not allowed', transshipment: 'Allowed',
    paymentTerms: 'T/T 100% in advance',
    documents: [
      'Signed commercial invoice in 3 originals and 3 copies',
      'Full set of clean on board ocean bills of lading made out to order, blank endorsed, marked freight prepaid/collect',
      'Detailed packing list in 3 originals and 3 copies',
      'Certificate of origin issued by the Chamber of Commerce and Industry of Korea',
    ],
    qualityAndPacking: 'The quality of the commodity shall conform to the specifications mutually agreed upon. The commodity shall be packed in standard export packing suitable for long-distance ocean transport, unless otherwise specified.',
    insurance: '',
    inspectionClause: 'Inspection of quality and quantity shall be performed by the Seller prior to shipment. The inspection certificate issued by the Seller shall be accepted as final.',
    forceMajeure: 'Neither party shall be liable for any failure or delay in performance arising from causes beyond its reasonable control, including but not limited to acts of God, war, civil unrest, strikes, fire, floods, epidemics, or government actions. The affected party shall notify the other party promptly.',
    arbitration: 'Any discrepancy and dispute arising in our commerce with this contract, if not being settled amicably, shall be referred to the Korea International Arbitration Centre located next to the Chamber of Commerce and Industry of Korea.',
    generalConditions: 'Any amendment of this contract must be made out in writing or fax confirmed by both parties into effect.',
  } as SalesContractContent
}
