'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { genDocNumber } from '@/lib/admin-document-types'
import type { QuotationContent } from '@/lib/admin-document-types'

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function addDays(n: number) {
  const d = new Date(); d.setDate(d.getDate() + n)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function IssueQuotationButton({ quote }: { quote: any }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handle() {
    setLoading(true)
    try {
      const docNumber = genDocNumber('quotation')
      const content: QuotationContent = {
        docNumber,
        docDate: todayStr(),
        validUntil: addDays(30),
        buyer: {
          company: quote.customer_company ?? '',
          contactPerson: quote.customer_name ?? '',
          phone: quote.customer_phone ?? '',
          email: quote.customer_email ?? '',
          address: '',
        },
        items: (quote.items ?? []).map((it: any) => ({
          id: it.id,
          name: it.name_ko ?? it.name ?? '',
          spec: it.sku ?? '',
          unit: it.unit ?? '개',
          qty: it.quantity ?? it.qty ?? 1,
          unitPrice: it.unit_price ?? it.unitPrice ?? 0,
          amount: it.amount ?? 0,
          notes: '',
        })),
        subtotal: Number(quote.subtotal ?? 0),
        tax: Number(quote.tax ?? 0),
        total: Number(quote.total ?? 0),
        paymentTerms: '세금계산서 발행 후 30일 이내',
        deliveryTerms: '계약 후 협의',
        notes: quote.notes ?? '',
      }

      const { error } = await supabase.from('admin_documents').insert({
        doc_type: 'quotation',
        doc_number: docNumber,
        title: `${quote.customer_company ?? '고객'} 견적서`,
        content,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (error) throw error
      router.push('/admin/documents')
    } catch (e: any) {
      alert('견적서 발행 실패: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      className="btn btn-sm btn-outline-primary rounded-pill px-2"
      onClick={handle}
      disabled={loading}
      title="견적서 발행"
    >
      {loading
        ? <span className="spinner-border spinner-border-sm" style={{ width: 12, height: 12 }} />
        : <i className="bi bi-file-earmark-arrow-up" />
      }
    </button>
  )
}
