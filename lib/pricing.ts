export type PriceTier = 'standard' | 'silver' | 'gold' | 'platinum'

export interface Product {
  id: number
  brand: string
  sku: string | null
  name_ko: string
  name_en: string | null
  list_price: number
  price_standard: number | null
  price_silver: number | null
  price_gold: number | null
  price_platinum: number | null
  unit: string
  is_active: boolean
  sort_order: number
  // Detail page fields
  slug?: string | null
  category?: string | null
  description_ko?: string | null
  description_en?: string | null
  features?: string[] | null
  applications?: string[] | null
  specifications?: Record<string, string> | null
  tds_url?: string | null
  image_url?: string | null
}

export function getPrice(product: Product, tier: PriceTier): number {
  const prices: Record<PriceTier, number | null> = {
    platinum: product.price_platinum,
    gold: product.price_gold,
    silver: product.price_silver,
    standard: product.price_standard,
  }
  return prices[tier] ?? product.list_price
}

export const TIER_LABELS: Record<PriceTier, string> = {
  standard: '일반',
  silver: '실버',
  gold: '골드',
  platinum: '플래티넘',
}

export const TIER_DISCOUNTS: Record<PriceTier, string> = {
  standard: '정가 기준',
  silver: '5% 할인',
  gold: '10% 할인',
  platinum: '15% 할인',
}
