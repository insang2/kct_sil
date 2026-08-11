import { createClient } from '@/lib/supabase/server'
import InventoryManager from '@/components/admin/InventoryManager'

export default async function AdminInventoryPage() {
  const supabase = await createClient()

  const [{ data: items }, { data: products }] = await Promise.all([
    supabase
      .from('admin_inventory')
      .select('*')
      .order('created_at', { ascending: false }),
    supabase
      .from('products')
      .select('id, brand, sku, name_ko')
      .eq('is_active', true)
      .order('sort_order'),
  ])

  return (
    <InventoryManager
      initialItems={(items ?? []) as any[]}
      products={products ?? []}
    />
  )
}
