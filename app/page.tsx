import Link from 'next/link'
import Image from 'next/image'
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
  const { data: featuredBrandItems } = await supabase.from('featured_items').select('ref_id').eq('type', 'brand').eq('active', true).order('position').limit(4)
  const brandIds = featuredBrandItems?.map(f => f.ref_id) ?? []
  const { data: brands } = brandIds.length ? await supabase.from('brands').select('*').in('id', brandIds).eq('status', 'active') : { data: [] }
  const { data: featuredProductItems } = await supabase.from('featured_items').select('ref_id').eq('type', 'product').eq('active', true).order('position').limit(8)
  const productIds = featuredProductItems?.map(f => f.ref_id) ?? []
  const { data: products } = productIds.length ? await supabase.from('products').select('*, brand:brands(*), images:product_images(*)').in('id', productIds).eq('status', 'published') : { data: [] }
  const { data: newProducts } = await supabase.from('products').select('*, brand:brands(*), images:product_images(*)').eq('status', 'published').order('created_at', { ascending: false }).limit(8)
  return { brands: (brands ?? []) as Brand[], featuredProducts: (products ?? []) as Product[], newProducts: (newProducts ?? []) as Product[] }
}

export default async function HomePage() {
  const { brands, featuredProducts, newProducts } = await getFeaturedData()
  const displayProducts = featuredProducts.length ? featuredProducts : newProducts

  return (
    <CartProvider>
      <Navbar />
      <main className="flex-1">

        {/* Hero */}
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-[#CDFF00] text-[#0D0D0D] text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
                  <span className="w-1.5 h-1.5 bg-[#0D0D0D] rounded-full" />
                  Onafhankelijke Nederlandse mode
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-none tracking-tight mb-6">
                  Ontdek merken<br />
                  die je nog<br />
                  <span className="bg-[#CDFF00] px-2 -mx-1">niet kent</span>
                </h1>
                <p className="text-[#666] text-lg mb-8 max-w-sm leading-relaxed">
                  Één plek voor de beste onafhankelijke NL-merken. Betaal met iDEAL, alles in één mandje.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/zoeken" className="bg-[#0D0D0D] text-white font-semibold px-7 py-3.5 rounded-full hover:bg-[#333] transition-colors">
                    Ontdek collecties
                  </Link>
                  <Link href="/zoeken?type=merken" className="border-2 border-[#0D0D0D] font-semibold px-7 py-3.5 rounded-full hover:bg-[#0D0D0D] hover:text-white transition-colors">
                    Alle merken
                  </Link>
                </div>
              </div>

              {/* Foto collage */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-3">
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden relative bg-[#F2F2F2]">
                    <Image src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80" alt="Mode" fill className="object-cover" />
                  </div>
                  <div className="aspect-square rounded-2xl overflow-hidden relative bg-[#F2F2F2]">
                    <Image src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80" alt="Mode" fill className="object-cover" />
                  </div>
                </div>
                <div className="space-y-3 pt-8">
                  <div className="aspect-square rounded-2xl overflow-hidden relative bg-[#F2F2F2]">
                    <Image src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80" alt="Mode" fill className="object-cover" />
                  </div>
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden relative bg-[#F2F2F2]">
                    <Image src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80" alt="Mode" fill className="object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categorieën */}
        <section className="border-y border-[#F2F2F2] bg-[#FAFAF7] py-5">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {[
                { label: 'Truien', href: '/categorie/truien' },
                { label: 'Broeken', href: '/categorie/broeken' },
                { label: 'Jassen', href: '/categorie/jassen' },
                { label: 'Hoodies', href: '/categorie/hoodies' },
                { label: 'Jurken', href: '/categorie/jurken' },
                { label: 'Tops', href: '/categorie/tops' },
                { label: 'Accessoires', href: '/categorie/accessoires' },
              ].map(cat => (
                <Link key={cat.href} href={cat.href}
                  className="flex-shrink-0 px-4 py-2 rounded-full border border-[#E0E0E0] bg-white text-sm font-medium hover:bg-[#0D0D0D] hover:text-white hover:border-[#0D0D0D] transition-colors">
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Uitgelichte merken */}
        {brands.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 py-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#999] mb-1">Uitgelicht</p>
                <h2 className="text-3xl font-black">Merken om te ontdekken</h2>
              </div>
              <Link href="/zoeken?type=merken" className="text-sm font-semibold underline underline-offset-4 hidden md:block">Alle merken</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {brands.map((brand, i) => <AnimatedBrandCard key={brand.id} brand={brand} index={i} />)}
            </div>
          </section>
        )}

        {/* Producten */}
        <section className="py-16 bg-[#FAFAF7]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#999] mb-1">Nieuw binnen</p>
                <h2 className="text-3xl font-black">Nu te ontdekken</h2>
              </div>
              <Link href="/zoeken" className="text-sm font-semibold underline underline-offset-4 hidden md:block">Alles zien</Link>
            </div>
            {displayProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {displayProducts.map((product, i) => <AnimatedProductCard key={product.id} product={product} index={i} />)}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-[#F2F2F2]">
                <p className="text-[#999] text-sm">Binnenkort nieuwe collecties.</p>
              </div>
            )}
          </div>
        </section>

        {/* USP strip */}
        <section className="bg-[#0D0D0D] text-white py-5">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              {[
                'Alleen onafhankelijke Nederlandse merken',
                'Betalen via iDEAL',
                'Meerdere merken, één mandje',
                'Gecureerde selectie',
              ].map(text => (
                <div key={text} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#CDFF00] rounded-full" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA merken */}
        <section className="max-w-7xl mx-auto px-4 py-20">
          <div className="bg-[#CDFF00] rounded-3xl p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-[#0D0D0D] mb-3">Jouw merk op ModeScout?</h2>
              <p className="text-[#0D0D0D]/70 max-w-md">
                Geen vaste kosten. Alleen 15% commissie bij een verkoop. Jij verzendt, wij regelen de betaling automatisch.
              </p>
            </div>
            <Link href="/dashboard" className="shrink-0 bg-[#0D0D0D] text-white font-bold px-8 py-4 rounded-full hover:bg-[#333] transition-colors whitespace-nowrap">
              Gratis aanmelden
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </CartProvider>
  )
}
