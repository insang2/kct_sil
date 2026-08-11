import { createClient } from '@/lib/supabase/server'
import CustomersManager from '@/components/admin/CustomersManager'

export default async function AdminCustomersPage() {
  const supabase = await createClient()
  const [{ data: contacts }, { data: docCounts }] = await Promise.all([
    supabase.from('admin_contacts').select('*').order('created_at', { ascending: false }),
    supabase.from('admin_documents').select('contact_id').not('contact_id', 'is', null),
  ])

  // contact_id별 문서 수 집계
  const countMap: Record<string, number> = {}
  for (const d of docCounts ?? []) {
    if (d.contact_id) countMap[d.contact_id] = (countMap[d.contact_id] ?? 0) + 1
  }

  const customers = (contacts ?? []).map(c => ({ ...c, doc_count: countMap[c.id] ?? 0 }))

  return <CustomersManager initialCustomers={customers} />
}
