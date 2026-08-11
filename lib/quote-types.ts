export interface QuoteItem {
  id: number
  name_ko: string
  name_en: string | null
  sku: string | null
  unit: string
  quantity: number
  unit_price: number
  amount: number
}

export interface TradeTerms {
  incoterms: string
  paymentTerms: string
  currency: string
  portOfLoading: string
  leadTime: string
  validity: string
  documents: string[]
}

export interface QuoteData {
  quoteNumber: string
  quoteDate: string
  customerCompany: string
  customerName: string
  customerEmail: string
  customerPhone: string
  items: QuoteItem[]
  subtotal: number
  tax: number
  total: number
  notes: string
  tradeTerms: TradeTerms
}
