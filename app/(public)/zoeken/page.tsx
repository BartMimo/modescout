export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/shop/ProductCard'
import BrandCard from '@/components/shop/BrandCard'
import Link from 'next/link'
import type { Brand, Product } from '@/types'

export default async function ZoekenPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; categorie?: string }>
}) {
  const { q, type, categorie } = await searchParams
  const supabase = await createClient()
  const showBrands = type === 'merken'

  let brands: Brand[] = []
  let products: Product[] = []

  if (showBrands) {
    let query = supabase.from('brands').select('*').eq('status', 'active').order('name')
    if (q) query = query.ilike('name', `%${q}%`)
    const { data } = await query
    brands = (data ?? []) as Brand[]
  } else {
    let query = supabase
      .from('products')
      .select('*, brand:brands(*), images:product_images(*)')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
    if (q) query = query.ilike('title', `%${q}%`)
    if (categorie) query = query.eq('category', categorie)
    const { data } = await query
    products = (data ?? []) as Product[]
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search bar */}
      <form className="mb-8">
        <div className="flex gap-3 max-w-xl">
          <input
            name="q"
            defaultValue={q}
            placeholder={showBrands ? 'Zoek een merk...' : 'Zoek een product...'}
            className="flex-1 border border-[#ddd] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#0D0D0D]"
          />
          <button
            type="submit"
            className="bg-[#0D0D0D] text-[#F5F5EF] px-5 py-3 rounded-xl text-sm font-semibold hover:bg-[#222] transition-colors"
          >
            Zoek
          </button>
        </div>
      </form>

      {/* Toggle products / brands */}
      <div className="flex gap-2 mb-8">
        <Link
          href="/zoeken"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!showBrands ? 'bg-[#0D0D0D] text-[#F5F5EF]' : 'border border-[#ddd] hover:border-[#0D0D0D]'}`}
        >
          Producten
        </Link>
        <Link
          href="/zoeken?type=merken"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${showBrands ? 'bg-[#0D0D0D] text-[#F5F5EF]' : 'border border-[#ddd] hover:border-[#0D0D0D]'}`}
        >
          Merken
        </Link>
      </div>

      {showBrands ? (
        brands.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {brands.map(b => <BrandCard key={b.id} brand={b} />)}
          </div>
        ) : (
          <p className="text-center text-[#999] py-16">Geen merken gevonden.</p>
        )
      ) : (
        products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <p className="text-center text-[#999] py-16">Geen producten gevonden.</p>
        )
      )}
    </div>
  )
}
