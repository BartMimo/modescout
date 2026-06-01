export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import AnimatedProductCard from '@/components/shop/AnimatedProductCard'
import AnimatedBrandCard from '@/components/shop/AnimatedBrandCard'
import Link from 'next/link'
import { Search } from 'lucide-react'
import type { Brand, Product } from '@/types'

export default async function ZoekenPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>
}) {
  const { q, type } = await searchParams
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
    let query = supabase.from('products').select('*, brand:brands(*), images:product_images(*)')
      .eq('status', 'published').order('created_at', { ascending: false })
    if (q) query = query.ilike('title', `%${q}%`)
    const { data } = await query
    products = (data ?? []) as Product[]
  }

  const total = showBrands ? brands.length : products.length

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">

      {/* Zoekbalk */}
      <form className="mb-6" action="/zoeken" method="get">
        {type && <input type="hidden" name="type" value={type} />}
        <div className="relative max-w-xl">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]" />
          <input
            name="q"
            defaultValue={q}
            placeholder={showBrands ? 'Zoek een merk...' : 'Zoek op productnaam...'}
            className="w-full h-12 pl-11 pr-4 border border-[#E0E0E0] rounded-2xl bg-white focus:outline-none focus:border-[#0D0D0D] transition-colors"
            autoComplete="off"
          />
        </div>
      </form>

      {/* Toggle + resultaat teller */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex gap-2">
          <Link href={q ? `/zoeken?q=${q}` : '/zoeken'}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${!showBrands ? 'bg-[#0D0D0D] text-white' : 'border border-[#E0E0E0] hover:border-[#0D0D0D]'}`}>
            Producten
          </Link>
          <Link href={q ? `/zoeken?type=merken&q=${q}` : '/zoeken?type=merken'}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${showBrands ? 'bg-[#0D0D0D] text-white' : 'border border-[#E0E0E0] hover:border-[#0D0D0D]'}`}>
            Merken
          </Link>
        </div>
        <span className="text-sm text-[#999] shrink-0">{total} resultaten</span>
      </div>

      {/* Categorie pills — alleen bij producten */}
      {!showBrands && (
        <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-hide">
          {['truien', 'broeken', 'jassen', 'hoodies', 'jurken', 'tops'].map(cat => (
            <Link key={cat} href={`/categorie/${cat}`}
              className="flex-shrink-0 px-3.5 py-1.5 rounded-full border border-[#E0E0E0] text-sm hover:bg-[#0D0D0D] hover:text-white hover:border-[#0D0D0D] transition-colors capitalize">
              {cat}
            </Link>
          ))}
        </div>
      )}

      {/* Resultaten */}
      {showBrands ? (
        brands.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {brands.map((b, i) => <AnimatedBrandCard key={b.id} brand={b} index={i} />)}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-[#999]">Geen merken gevonden{q ? ` voor "${q}"` : ''}.</p>
          </div>
        )
      ) : (
        products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((p, i) => <AnimatedProductCard key={p.id} product={p} index={i} />)}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-[#999]">Geen producten gevonden{q ? ` voor "${q}"` : ''}.</p>
          </div>
        )
      )}
    </div>
  )
}
