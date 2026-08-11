import { createClient } from '@/lib/supabase/server'
import DealsManager from '@/components/admin/DealsManager'

export default async function DealsPage() {
  const supabase = await createClient()

  const [{ data: deals }, { data: contacts }] = await Promise.all([
    supabase
      .from('admin_deals')
      .select('*, admin_contacts(id,company_name,contact_person), admin_documents(id,doc_type,doc_number,title,status)')
      .order('created_at', { ascending: false }),
    supabase
      .from('admin_contacts')
      .select('id,company_name,contact_person')
      .order('company_name'),
  ])

  return (
    <DealsManager
      initialDeals={deals ?? []}
      contacts={contacts ?? []}
    />
  )
}
