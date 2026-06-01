export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import { ChevronLeft, Share2, CheckCircle2 } from 'lucide-react'
import type { Metadata } from 'next'
import type { Product } from '@/types'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: brand } = await supabase.from('brands').select('name, tagline').eq('slug', slug).single()
  if (!brand) return {}
  return { title: brand.name, description: brand.tagline ?? undefined }
}

const TINTS = ['#FFE2CE', '#FFD7DE', '#CFF1E9', '#FFEFC2', '#D9ECFD', '#F4E6D2']

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: brand } = await supabase.from('brands').select('*').eq('slug', slug).eq('status', 'active').single()
  if (!brand) notFound()

  const { data: products } = await supabase
    .from('products').select('*, images:product_images(*)')
    .eq('brand_id', brand.id).eq('status', 'published').order('created_at', { ascending: false })

  return (
    <div style={{ background: 'var(--cream)' }}>
      {/* Cover */}
      <div className="relative h-44 md:h-56" style={{ background: 'linear-gradient(135deg,#CFF1E9,#15B7A6)' }}>
        <div className="absolute inset-0 pt-2">
          <div className="h-12 px-4 flex items-center justify-between" style={{ paddingTop: 8 }}>
            <Link href="/" className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.9)' }}>
              <ChevronLeft size={20} color="var(--ink)" />
            </Link>
            <button className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.9)' }}>
              <Share2 size={18} color="var(--ink)" />
            </button>
          </div>
        </div>
      </div>

      {/* Brand header */}
      <div className="px-4 -mt-11 relative">
        <div className="flex items-end gap-4 mb-3">
          <div className="w-20 h-20 rounded-2xl overflow-hidden relative flex-none shadow-lg" style={{ background: 'var(--paper)', padding: 4, boxShadow: 'var(--shadow)' }}>
            {brand.logo_url
              ? <Image src={brand.logo_url} alt={brand.name} fill className="object-cover rounded-xl" />
              : <div className="w-full h-full rounded-xl flex items-center justify-center text-2xl font-black" style={{ background: 'var(--yellow-t)', color: 'var(--ink)', fontFamily: 'Fredoka' }}>{brand.name[0]}</div>}
          </div>
          <Link href="/dashboard" className="ml-auto mb-2 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold"
            style={{ background: 'var(--ink)', color: '#fff', fontFamily: 'Fredoka', fontWeight: 600 }}>
            + Volgen
          </Link>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-2xl">{brand.name}</h1>
          <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'var(--teal)' }}>
            <CheckCircle2 size={13} color="#fff" strokeWidth={2.5} />
          </div>
        </div>

        {brand.tagline && <p className="text-sm font-bold mb-2" style={{ color: 'var(--ink2)' }}>{brand.tagline}</p>}
        {brand.story && <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--ink2)', fontWeight: 600 }}>{brand.story}</p>}

        {/* Stats */}
        <div className="grid grid-cols-4 rounded-2xl py-3.5 mb-6" style={{ background: 'var(--cream2)' }}>
          {[[String(products?.length ?? 0), 'Items'], ['4.9★', 'Rating'], ['—', 'Volgers'], ['—', 'Reactie']].map(([v, l], i) => (
            <div key={l} className="flex flex-col items-center gap-0.5" style={{ borderLeft: i ? '1px solid var(--line2)' : 'none' }}>
              <span style={{ fontFamily: 'Fredoka', fontWeight: 600, fontSize: 17 }}>{v}</span>
              <span className="text-xs font-black" style={{ color: 'var(--ink2)' }}>{l}</span>
            </div>
          ))}
        </div>

        {/* Producten */}
        <h2 className="text-lg mb-4">Alle items</h2>
        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 gap-3.5">
            {products.map((product: Product, i: number) => (
              <Link key={product.id} href={`/product/${product.id}`}
                className="block rounded-2xl overflow-hidden" style={{ background: 'var(--paper)', boxShadow: 'var(--shadow-sm)' }}>
                <div className="relative" style={{ height: 165, background: TINTS[i % TINTS.length] }}>
                  {product.images?.[0]?.url && (
                    <Image src={product.images[0].url} alt={product.title} fill className="object-cover" sizes="50vw" />
                  )}
                </div>
                <div className="p-3">
                  <p className="font-medium leading-snug line-clamp-2" style={{ fontFamily: 'Fredoka', fontSize: 14.5 }}>{product.title}</p>
                  <span className="font-bold mt-1.5 block" style={{ fontFamily: 'Fredoka', fontSize: 15.5, color: 'var(--ink)' }}>{formatPrice(product.base_price_cents)}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center py-12 text-sm font-bold" style={{ color: 'var(--ink2)' }}>Nog geen producten beschikbaar.</p>
        )}
      </div>
      <div className="h-8" />
    </div>
  )
}
