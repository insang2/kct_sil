import { createClient } from '@/lib/supabase/server'
import QuotesManager from '@/components/admin/QuotesManager'

export default async function AdminQuotesPage() {
  const supabase = await createClient()
  const [{ data: quotes }, { data: contacts }] = await Promise.all([
    supabase.from('quotes').select('*').order('created_at', { ascending: false }),
    supabase.from('admin_contacts').select('id,company_name,tier').order('company_name'),
  ])

  return <QuotesManager initialQuotes={quotes || []} contacts={contacts || []} />
}
