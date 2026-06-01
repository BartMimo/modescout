import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/shop/Navbar'
import Footer from '@/components/shop/Footer'
import CartProvider from '@/components/shop/CartProvider'
import BottomNav from '@/components/shop/BottomNav'
import type { Brand, Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { ChevronRight, Sun } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'ModeScout — Ontdek onafhankelijke Nederlandse mode',
  description: 'Ontdek en koop kleding van onafhankelijke Nederlandse modemerken.',
}

async function getData() {
  const supabase = await createClient()
  const { data: featuredBrandItems } = await supabase.from('featured_items').select('ref_id').eq('type', 'brand').eq('active', true).order('position').limit(4)
  const brandIds = featuredBrandItems?.map(f => f.ref_id) ?? []
  const { data: brands } = brandIds.length ? await supabase.from('brands').select('*').in('id', brandIds).eq('status', 'active') : { data: [] }
  const { data: featuredProductItems } = await supabase.from('featured_items').select('ref_id').eq('type', 'product').eq('active', true).order('position').limit(8)
  const productIds = featuredProductItems?.map(f => f.ref_id) ?? []
  const { data: products } = productIds.length
    ? await supabase.from('products').select('*, brand:brands(*), images:product_images(*)').in('id', productIds).eq('status', 'published')
    : { data: [] }
  const { data: newProducts } = await supabase.from('products').select('*, brand:brands(*), images:product_images(*)').eq('status', 'published').order('created_at', { ascending: false }).limit(8)
  return { brands: (brands ?? []) as Brand[], products: ((products ?? []).length ? products : newProducts ?? []) as Product[] }
}

const TINTS = ['#FFE2CE', '#FFD7DE', '#CFF1E9', '#FFEFC2', '#D9ECFD', '#F4E6D2']
const CATEGORIES = [
  { label: 'T-shirts', href: '/categorie/tops', tint: '#FFE2CE' },
  { label: 'Jurken', href: '/categorie/jurken', tint: '#FFD7DE' },
  { label: 'Broeken', href: '/categorie/broeken', tint: '#CFF1E9' },
  { label: 'Truien', href: '/categorie/truien', tint: '#FFEFC2' },
  { label: 'Jassen', href: '/categorie/jassen', tint: '#D9ECFD' },
  { label: 'Accessoires', href: '/categorie/accessoires', tint: '#F4E6D2' },
]

export default async function HomePage() {
  const { brands, products } = await getData()

  return (
    <CartProvider>
      <Navbar />
      <main className="flex-1 pb-20 md:pb-0">

        {/* Search bar */}
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <Link href="/zoeken" className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold shadow-sm"
            style={{ background: 'var(--paper)', color: 'var(--ink2)', boxShadow: 'var(--shadow-sm)', fontFamily: 'Nunito' }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            Zoek merken & items…
          </Link>
        </div>

        {/* Hero banner */}
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className="relative rounded-3xl overflow-hidden p-6 text-white" style={{ background: 'linear-gradient(135deg,#FFB35C,#FB6A2E)', boxShadow: 'var(--shadow-warm)' }}>
            <div className="absolute right-[-30px] top-[-30px] w-36 h-36 rounded-full" style={{ background: 'rgba(255,255,255,0.16)' }} />
            <div className="absolute right-8 bottom-[-44px] w-24 h-24 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold mb-3" style={{ background: 'var(--yellow)', color: '#5a4200' }}>
              <Sun size={13} fill="currentColor" /> Zomer '26
            </span>
            <h1 className="text-3xl md:text-4xl text-white mb-2" style={{ lineHeight: 1.04 }}>Zon, stijl<br />& nieuwe drops</h1>
            <p className="text-sm mb-4 max-w-xs" style={{ fontWeight: 700, opacity: 0.95 }}>Ontdek 200+ merken die rechtstreeks aan jou verkopen.</p>
            <Link href="/zoeken" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold"
              style={{ background: 'var(--paper)', color: 'var(--orange-d)' }}>
              Shop de collectie <ChevronRight size={16} />
            </Link>
            <div className="absolute right-4 top-14 w-24 h-28 rounded-2xl overflow-hidden hidden sm:block" style={{ boxShadow: '0 8px 20px rgba(0,0,0,.18)' }}>
              <Image src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=200&q=80" alt="Mode" fill className="object-cover" />
            </div>
          </div>
        </div>

        {/* Categorieën */}
        <div className="mt-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between px-4 mb-3">
            <h2 className="text-xl">Categorieën</h2>
            <Link href="/zoeken" className="flex items-center gap-1 text-sm font-bold" style={{ color: 'var(--orange)' }}>
              Alles <ChevronRight size={15} color="var(--orange)" />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto px-4 pb-1" style={{ scrollbarWidth: 'none' }}>
            {CATEGORIES.map(cat => (
              <Link key={cat.href} href={cat.href}
                className="flex-shrink-0 flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm" style={{ background: 'var(--paper)' }}>
                  <div className="w-11 h-11 rounded-xl" style={{ background: cat.tint }} />
                </div>
                <span className="text-xs font-bold" style={{ color: 'var(--ink)' }}>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Uitgelichte merken */}
        {brands.length > 0 && (
          <div className="mt-6 max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl">Merken in de spotlight</h2>
              <Link href="/zoeken?type=merken" className="flex items-center gap-1 text-sm font-bold" style={{ color: 'var(--orange)' }}>
                Bekijk <ChevronRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {brands.map((brand, i) => (
                <Link key={brand.id} href={`/merk/${brand.slug}`}
                  className="rounded-2xl p-3 flex flex-col items-center gap-2 shadow-sm"
                  style={{ background: 'var(--paper)' }}>
                  <div className="w-12 h-12 rounded-full overflow-hidden relative" style={{ background: TINTS[i % TINTS.length] }}>
                    {brand.logo_url
                      ? <Image src={brand.logo_url} alt={brand.name} fill className="object-cover" />
                      : <div className="w-full h-full flex items-center justify-center font-black text-lg" style={{ color: 'var(--ink)', fontFamily: 'Fredoka' }}>{brand.name[0]}</div>}
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold line-clamp-1" style={{ fontFamily: 'Fredoka', fontSize: 12.5 }}>{brand.name}</p>
                    {brand.tagline && <p className="text-[10px] line-clamp-1 mt-0.5" style={{ color: 'var(--ink2)', fontWeight: 700 }}>{brand.tagline}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Producten */}
        <div className="mt-6 max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl">Net binnen</h2>
            <Link href="/zoeken" className="flex items-center gap-1 text-sm font-bold" style={{ color: 'var(--orange)' }}>
              Meer <ChevronRight size={15} />
            </Link>
          </div>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-2xl" style={{ background: 'var(--paper)' }}>
              <p className="text-sm" style={{ color: 'var(--ink2)', fontWeight: 700 }}>Binnenkort nieuwe collecties</p>
            </div>
          )}
        </div>

        {/* Verkoop banner */}
        <div className="mt-6 max-w-7xl mx-auto px-4 mb-6">
          <div className="flex items-center gap-4 rounded-2xl p-5" style={{ background: 'var(--ink)', color: '#fff' }}>
            <div className="flex-1">
              <h3 className="text-lg text-white">Verkoop jij ook?</h3>
              <p className="text-xs mt-1.5" style={{ fontWeight: 700, opacity: 0.8, fontFamily: 'Nunito' }}>Open gratis je merkprofiel en bereik duizenden shoppers.</p>
            </div>
            <Link href="/dashboard"
              className="flex-none px-4 py-2.5 rounded-full text-sm font-bold transition-opacity hover:opacity-90"
              style={{ background: 'var(--orange)', color: '#fff', fontFamily: 'Fredoka', boxShadow: 'var(--shadow-warm)' }}>
              Start
            </Link>
          </div>
        </div>

      </main>
      <Footer />
      <BottomNav />
    </CartProvider>
  )
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const image = product.images?.[0]?.url
  const tint = TINTS[index % TINTS.length]

  return (
    <Link href={`/product/${product.id}`} className="block" style={{ borderRadius: 22, overflow: 'hidden', background: 'var(--paper)', boxShadow: 'var(--shadow-sm)' }}>
      <div className="relative" style={{ height: 175, background: tint }}>
        {image
          ? <Image src={image} alt={product.title} fill className="object-cover" sizes="(max-width:640px) 50vw, 25vw" />
          : <div className="w-full h-full" style={{ background: tint, backgroundImage: 'repeating-linear-gradient(45deg,rgba(44,33,27,.05) 0 11px,rgba(44,33,27,0) 11px 22px)' }} />}
        {index === 0 && (
          <span className="absolute top-2.5 left-2.5 px-2 py-1 rounded-full text-xs font-bold"
            style={{ background: 'var(--teal)', color: '#fff', fontFamily: 'Fredoka' }}>Nieuw</span>
        )}
      </div>
      <div className="p-3">
        <div className="flex justify-between items-center mb-0.5">
          <span className="text-xs font-black" style={{ color: 'var(--ink2)', fontFamily: 'Nunito' }}>{product.brand?.name}</span>
        </div>
        <p className="font-medium line-clamp-2 leading-snug" style={{ fontFamily: 'Fredoka', fontSize: 15 }}>{product.title}</p>
        <span className="font-bold mt-2 block" style={{ fontFamily: 'Fredoka', fontSize: 16, color: 'var(--ink)' }}>{formatPrice(product.base_price_cents)}</span>
      </div>
    </Link>
  )
}
