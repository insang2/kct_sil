import { createClient } from '@/lib/supabase/server'
import type { Product } from '@/lib/pricing'
import ProductsManager from '@/components/admin/ProductsManager'

export default async function AdminProductsPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('products').select('*').order('sort_order')

  return <ProductsManager initialProducts={(data || []) as Product[]} />
}
