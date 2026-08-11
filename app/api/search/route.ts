import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? ''
  if (!q.trim() || q.length < 2) return NextResponse.json({ products: [], contacts: [], docs: [], deals: [] })

  const supabase = await createClient()
  const like = `%${q}%`

  const [products, contacts, docs, deals] = await Promise.all([
    supabase.from('products').select('id,brand,sku,name_ko').or(`name_ko.ilike.${like},sku.ilike.${like},brand.ilike.${like}`).limit(5),
    supabase.from('admin_contacts').select('id,company_name,contact_person').or(`company_name.ilike.${like},contact_person.ilike.${like}`).limit(5),
    supabase.from('admin_documents').select('id,doc_type,doc_number,title').or(`title.ilike.${like},doc_number.ilike.${like}`).limit(5),
    supabase.from('admin_deals').select('id,title,stage').ilike('title', like).limit(5),
  ])

  return NextResponse.json({
    products: products.data ?? [],
    contacts: contacts.data ?? [],
    docs: docs.data ?? [],
    deals: deals.data ?? [],
  })
}
