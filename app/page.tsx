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

  const { data: featuredBrandItems } = await supabase
    .from('featured_items').select('ref_id').eq('type', 'brand').eq('active', true).order('position').limit(4)

  const brandIds = featuredBrandItems?.map(f => f.ref_id) ?? []
  const { data: brands } = brandIds.length
    ? await supabase.from('brands').select('*').in('id', brandIds).eq('status', 'active')
    : { data: [] }

  const { data: featuredProductItems } = await supabase
    .from('featured_items').select('ref_id').eq('type', 'product').eq('active', true).order('position').limit(8)

  const productIds = featuredProductItems?.map(f => f.ref_id) ?? []
  const { data: products } = productIds.length
    ? await supabase.from('products').select('*, brand:brands(*), images:product_images(*)').in('id', productIds).eq('status', 'published')
    : { data: [] }

  const { data: newProducts } = await supabase
    .from('products').select('*, brand:brands(*), images:product_images(*)')
    .eq('status', 'published').order('created_at', { ascending: false }).limit(8)

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

        {/* Hero — split editorial */}
        <section className="bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Text */}
              <div className="order-2 md:order-1">
                <div className="inline-flex items-center gap-2 bg-[#CDFF00] text-[#0D0D0D] text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
                  <span className="w-1.5 h-1.5 bg-[#0D0D0D] rounded-full animate-pulse" />
                  Nieuw op ModeScout
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-none tracking-tight mb-6">
                  Nederlandse<br />
                  <span className="text-[#CDFF00] [-webkit-text-stroke:2px_#0D0D0D]">mode</span><br />
                  ontdekken
                </h1>
                <p className="text-[#666] text-lg mb-8 max-w-sm leading-relaxed">
                  Één plek voor de mooiste onafhankelijke NL-merken. Betaal met iDEAL, alles in één mandje.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/zoeken"
                    className="bg-[#0D0D0D] text-white font-semibold px-7 py-3.5 rounded-full hover:bg-[#333] transition-all hover:scale-105 active:scale-95">
                    Ontdek collecties
                  </Link>
                  <Link href="/zoeken?type=merken"
                    className="border-2 border-[#0D0D0D] font-semibold px-7 py-3.5 rounded-full hover:bg-[#0D0D0D] hover:text-white transition-all hover:scale-105 active:scale-95">
                    Alle merken
                  </Link>
                </div>
                {/* Social proof */}
                <div className="flex items-center gap-4 mt-8 pt-8 border-t border-[#F2F2F2]">
                  <div className="flex -space-x-2">
                    {['#CDFF00','#FF6B4A','#0D0D0D','#E8FFF0'].map((c,i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white" style={{background: c}} />
                    ))}
                  </div>
                  <p className="text-sm text-[#666]"><strong className="text-[#0D0D0D]">20+ merken</strong> — nieuw erbij elke week</p>
                </div>
              </div>
              {/* Images collage */}
              <div className="order-1 md:order-2 relative">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-3">
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden relative bg-[#F2F2F2]">
                      <Image src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80" alt="Mode" fill className="object-cover" />
                    </div>
                    <div className="aspect-square rounded-2xl overflow-hidden relative bg-[#F2F2F2]">
                      <Image src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80" alt="Mode" fill className="object-cover" />
                    </div>
                  </div>
                  <div className="space-y-3 pt-6">
                    <div className="aspect-square rounded-2xl overflow-hidden relative bg-[#CDFF00]">
                      <Image src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80" alt="Mode" fill className="object-cover" />
                    </div>
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden relative bg-[#F2F2F2]">
                      <Image src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80" alt="Mode" fill className="object-cover" />
                    </div>
                  </div>
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-3 -left-3 bg-[#CDFF00] rounded-2xl px-4 py-3 shadow-lg border-2 border-white">
                  <p className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wide">iDEAL betalen</p>
                  <p className="text-xs text-[#0D0D0D]/70">Veilig & direct</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categorieën — horizontale scroll op mobile */}
        <section className="bg-[#FAFAF7] py-8 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {[
                { label: 'Truien', href: '/categorie/truien', emoji: '🧶', bg: '#E8FFF0' },
                { label: 'Broeken', href: '/categorie/broeken', emoji: '👖', bg: '#FFF8E8' },
                { label: 'Jassen', href: '/categorie/jassen', emoji: '🧥', bg: '#F5E8FF' },
                { label: 'Hoodies', href: '/categorie/hoodies', emoji: '👕', bg: '#E8F0FF' },
                { label: 'Jurken', href: '/categorie/jurken', emoji: '👗', bg: '#FFE8F0' },
                { label: 'Tops', href: '/categorie/tops', emoji: '✨', bg: '#CDFF00' },
              ].map(cat => (
                <Link key={cat.href} href={cat.href}
                  className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm hover:scale-105 transition-transform"
                  style={{ background: cat.bg }}>
                  <span>{cat.emoji}</span>
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured brands */}
        {brands.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 py-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#CDFF00] bg-[#0D0D0D] inline-block px-2 py-0.5 rounded mb-2">Uitgelicht</p>
                <h2 className="text-3xl font-black">Merken om te ontdekken</h2>
              </div>
              <Link href="/zoeken?type=merken" className="text-sm font-semibold underline underline-offset-4 hidden md:block">
                Alle merken →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {brands.map((brand, i) => <AnimatedBrandCard key={brand.id} brand={brand} index={i} />)}
            </div>
          </section>
        )}

        {/* Products — met accent sectie */}
        <section className="py-16 bg-[#FAFAF7]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#666] mb-2">Nieuw binnen</p>
                <h2 className="text-3xl font-black">Nu te ontdekken</h2>
              </div>
              <Link href="/zoeken" className="text-sm font-semibold underline underline-offset-4 hidden md:block">
                Alles zien →
              </Link>
            </div>
            {displayProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {displayProducts.map((product, i) => (
                  <AnimatedProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl">
                <p className="text-4xl mb-4">🌿</p>
                <p className="text-[#666]">Binnenkort nieuwe collecties. Kom snel terug!</p>
              </div>
            )}
          </div>
        </section>

        {/* USP strip */}
        <section className="bg-[#CDFF00] py-6">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-8 text-[#0D0D0D]">
              {[
                { icon: '🇳🇱', text: '100% Nederlandse merken' },
                { icon: '💳', text: 'Betalen via iDEAL' },
                { icon: '🛍️', text: 'Meerdere merken, één mandje' },
                { icon: '✨', text: 'Gecureerde selectie' },
              ].map(u => (
                <div key={u.text} className="flex items-center gap-2 font-semibold text-sm">
                  <span>{u.icon}</span>
                  {u.text}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA voor merken */}
        <section className="max-w-7xl mx-auto px-4 py-20">
          <div className="bg-[#0D0D0D] text-white rounded-3xl p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-black mb-3">Jouw merk op ModeScout?</h2>
              <p className="text-[#999] max-w-md">
                Geen vaste kosten. Alleen 15% commissie bij een verkoop. Jij verzendt, wij regelen de betaling automatisch.
              </p>
            </div>
            <Link href="/dashboard"
              className="shrink-0 bg-[#CDFF00] text-[#0D0D0D] font-bold px-8 py-4 rounded-full hover:bg-white transition-all hover:scale-105 whitespace-nowrap">
              Gratis aanmelden →
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </CartProvider>
  )
}
