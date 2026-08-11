import { createClient } from '@/lib/supabase/server'
import DocumentsManager from '@/components/admin/DocumentsManager'
import type { AdminDocument, ProductOption, CustomerOption } from '@/lib/admin-document-types'

export default async function AdminDocumentsPage() {
  const supabase = await createClient()
  const [{ data: docs }, { data: products }, { data: contacts }, { data: deals }] = await Promise.all([
    supabase.from('admin_documents').select('*').order('created_at', { ascending: false }),
    supabase.from('products').select('id,brand,sku,name_ko,name_en,unit,list_price,price_standard,price_silver,price_gold,price_platinum').eq('is_active', true).order('sort_order'),
    supabase.from('admin_contacts').select('id,company_name,contact_person,phone,tier').order('company_name'),
    supabase.from('admin_deals').select('id,title,stage').not('stage', 'in', '("completed","cancelled")').order('updated_at', { ascending: false }),
  ])

  return (
    <DocumentsManager
      initialDocs={(docs ?? []) as AdminDocument[]}
      products={(products ?? []) as ProductOption[]}
      customers={(contacts ?? []) as CustomerOption[]}
      deals={deals ?? []}
    />
  )
}
