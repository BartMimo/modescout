import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AnimatedProductCard from '@/components/shop/AnimatedProductCard'
import AnimatedBrandCard from '@/components/shop/AnimatedBrandCard'
import Navbar from '@/components/shop/Navbar'
import Footer from '@/components/shop/Footer'
import CartProvider from '@/components/shop/CartProvider'
import type { Brand, Product } from '@/types'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'ModeScout — Ontdek onafhankelijke Nederlandse mode',
  description: 'Ontdek en koop kleding van onafhankelijke Nederlandse modemerken. Één mandje, meerdere merken, veilig betalen met iDEAL.',
}

async function getFeaturedData() {
  const supabase = await createClient()

  const { data: featuredBrandItems } = await supabase
    .from('featured_items')
    .select('ref_id')
    .eq('type', 'brand')
    .eq('active', true)
    .order('position')
    .limit(4)

  const brandIds = featuredBrandItems?.map(f => f.ref_id) ?? []
  const { data: brands } = brandIds.length
    ? await supabase.from('brands').select('*').in('id', brandIds).eq('status', 'active')
    : { data: [] }

  const { data: featuredProductItems } = await supabase
    .from('featured_items')
    .select('ref_id')
    .eq('type', 'product')
    .eq('active', true)
    .order('position')
    .limit(8)

  const productIds = featuredProductItems?.map(f => f.ref_id) ?? []
  const { data: products } = productIds.length
    ? await supabase
        .from('products')
        .select('*, brand:brands(*), images:product_images(*)')
        .in('id', productIds)
        .eq('status', 'published')
    : { data: [] }

  const { data: newProducts } = await supabase
    .from('products')
    .select('*, brand:brands(*), images:product_images(*)')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(8)

  return {
    brands: (brands ?? []) as Brand[],
    featuredProducts: (products ?? []) as Product[],
    newProducts: (newProducts ?? []) as Product[],
  }
}

export default async function HomePage() {
  const { brands, featuredProducts, newProducts } = await getFeaturedData()
  const displayProducts = featuredProducts.length ? featuredProducts : newProducts

  return (
    <CartProvider>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-[#0D0D0D] text-[#F5F5EF] px-4 py-20 md:py-32 text-center">
          <p className="text-[#CDFF00] text-sm uppercase tracking-widest mb-4 font-medium">Onafhankelijke Nederlandse mode</p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Ontdek merken<br />die je nog niet kent
          </h1>
          <p className="text-[#999] text-lg md:text-xl max-w-lg mx-auto mb-10">
            Één mandje, meerdere merken. Veilig betalen met iDEAL.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/zoeken" className="bg-[#CDFF00] text-[#0D0D0D] font-semibold px-8 py-3.5 rounded-xl hover:bg-[#b8e600] transition-colors">
              Ontdek alle merken
            </Link>
            <Link href="/dashboard" className="border border-[#444] text-[#F5F5EF] font-semibold px-8 py-3.5 rounded-xl hover:border-[#CDFF00] hover:text-[#CDFF00] transition-colors">
              Verkopen op ModeScout
            </Link>
          </div>
        </section>

        {/* Featured brands */}
        {brands.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 py-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Uitgelichte merken</h2>
              <Link href="/zoeken?type=merken" className="text-sm font-medium underline underline-offset-4">Alle merken</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {brands.map((brand, i) => <AnimatedBrandCard key={brand.id} brand={brand} index={i} />)}
            </div>
          </section>
        )}

        {/* Products */}
        <section className="max-w-7xl mx-auto px-4 py-16 border-t border-[#E0E0DA]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Nieuw & uitgelicht</h2>
            <Link href="/zoeken" className="text-sm font-medium underline underline-offset-4">Alle producten</Link>
          </div>
          {displayProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {displayProducts.map((product, i) => <AnimatedProductCard key={product.id} product={product} index={i} />)}
            </div>
          ) : (
            <p className="text-[#999] text-center py-12">Binnenkort nieuwe collecties. Kom snel terug!</p>
          )}
        </section>

        {/* CTA */}
        <section className="bg-[#0D0D0D] text-[#F5F5EF] px-4 py-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Ben jij een modeontwerper?</h2>
          <p className="text-[#999] max-w-md mx-auto mb-8">
            Zet je merk op ModeScout. Geen vaste kosten — je betaalt alleen een commissie van 15% bij elke verkoop.
          </p>
          <Link href="/dashboard" className="inline-block bg-[#CDFF00] text-[#0D0D0D] font-semibold px-8 py-3.5 rounded-xl hover:bg-[#b8e600] transition-colors">
            Meld je merk aan
          </Link>
        </section>
      </main>
      <Footer />
    </CartProvider>
  )
}
