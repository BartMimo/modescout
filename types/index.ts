export type UserRole = 'buyer' | 'brand' | 'admin'
export type BrandStatus = 'pending' | 'active' | 'paused'
export type ProductStatus = 'draft' | 'published'
export type OrderStatus = 'pending' | 'paid' | 'failed'
export type FulfillmentStatus = 'new' | 'shipped'

export interface Profile {
  id: string
  role: UserRole
  full_name: string | null
  email: string
  created_at: string
  updated_at: string
}

export interface Brand {
  id: string
  owner_id: string
  name: string
  slug: string
  tagline: string | null
  story: string | null
  logo_url: string | null
  status: BrandStatus
  stripe_account_id: string | null
  charges_enabled: boolean
  payouts_enabled: boolean
  commission_rate: number
  featured: boolean
  legal_name: string | null
  address: string | null
  kvk_number: string | null
  vat_number: string | null
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  brand_id: string
  title: string
  description: string | null
  category: string | null
  base_price_cents: number
  currency: string
  status: ProductStatus
  created_at: string
  updated_at: string
  brand?: Brand
  images?: ProductImage[]
  variants?: ProductVariant[]
}

export interface ProductImage {
  id: string
  product_id: string
  url: string
  storage_path: string | null
  position: number
}

export interface ProductVariant {
  id: string
  product_id: string
  size: string | null
  color: string | null
  sku: string | null
  stock_qty: number
  price_cents: number | null
}

export interface Order {
  id: string
  buyer_id: string | null
  email: string
  shipping_address: ShippingAddress
  total_cents: number
  status: OrderStatus
  stripe_payment_intent_id: string | null
  idempotency_key: string
  created_at: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  brand_id: string
  product_variant_id: string
  title_snapshot: string
  quantity: number
  unit_price_cents: number
  commission_cents: number | null
  transfer_id: string | null
  transfer_failed: boolean
  fulfillment_status: FulfillmentStatus
  brand?: Brand
}

export interface ShippingAddress {
  name: string
  line1: string
  line2?: string
  city: string
  postal_code: string
  country: string
}

export interface FeaturedItem {
  id: string
  type: 'brand' | 'product'
  ref_id: string
  position: number
  active: boolean
}

export interface CartItem {
  variantId: string
  productId: string
  brandId: string
  brandName: string
  title: string
  size: string | null
  color: string | null
  priceCents: number
  quantity: number
  imageUrl: string | null
}
