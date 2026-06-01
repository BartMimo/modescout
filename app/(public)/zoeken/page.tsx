export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import type { Brand, Product } from '@/types'

const TINTS = ['#FFE2CE', '#FFD7DE', '#CFF1E9', '#FFEFC2', '#D9ECFD', '#F4E6D2']

export default async function ZoekenPage({ searchParams }: { searchParams: Promise<{ q?: string; type?: string }> }) {
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
    <div className="max-w-7xl mx-auto px-4 py-5">
      <h1 className="text-2xl mb-4">Ontdekken</h1>

      <form action="/zoeken" method="get" className="mb-5">
        {type && <input type="hidden" name="type" value={type} />}
        <div className="flex items-center gap-3 rounded-2xl px-4 py-3.5" style={{ background: 'var(--paper)', boxShadow: 'var(--shadow-sm)' }}>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--ink2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input name="q" defaultValue={q} placeholder={showBrands ? 'Zoek een merk...' : 'Waar ben je naar op zoek?'}
            className="flex-1 bg-transparent outline-none text-sm font-semibold" style={{ color: 'var(--ink)', fontFamily: 'Nunito' }} />
        </div>
      </form>

      <div className="flex items-center justify-between mb-5 gap-3">
        <div className="flex gap-2">
          {([['Producten', undefined], ['Merken', 'merken']] as [string, string | undefined][]).map(([label, val]) => (
            <Link key={label} href={val ? `/zoeken?type=${val}${q ? `&q=${q}` : ''}` : `/zoeken${q ? `?q=${q}` : ''}`}
              className="px-4 py-2 rounded-full text-sm font-bold transition-all"
              style={{
                background: (!val && !showBrands) || (val === 'merken' && showBrands) ? 'var(--ink)' : 'var(--paper)',
                color: (!val && !showBrands) || (val === 'merken' && showBrands) ? '#fff' : 'var(--ink2)',
                boxShadow: 'var(--shadow-sm)', fontFamily: 'Nunito',
              }}>
              {label}
            </Link>
          ))}
        </div>
        <span className="text-xs font-bold" style={{ color: 'var(--ink3)' }}>{total} resultaten</span>
      </div>

      {!q && !showBrands && (
        <div className="mb-5">
          <p className="text-xs font-black uppercase tracking-widest mb-2.5" style={{ color: 'var(--orange)' }}>Categorieën</p>
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {['Truien', 'Jurken', 'Hoodies', 'Broeken', 'Jassen'].map((cat, i) => (
              <Link key={cat} href={`/categorie/${cat.toLowerCase()}`}
                className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold shadow-sm"
                style={{ background: i === 0 ? 'var(--ink)' : 'var(--paper)', color: i === 0 ? '#fff' : 'var(--ink2)', fontFamily: 'Nunito' }}>
                {cat}
              </Link>
            ))}
          </div>
        </div>
      )}

      {showBrands ? (
        brands.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {brands.map((b, i) => (
              <Link key={b.id} href={`/merk/${b.slug}`} className="rounded-2xl p-4 flex flex-col items-center gap-2.5 shadow-sm" style={{ background: 'var(--paper)' }}>
                <div className="w-14 h-14 rounded-full overflow-hidden relative" style={{ background: TINTS[i % TINTS.length] }}>
                  {b.logo_url ? <Image src={b.logo_url} alt={b.name} fill className="object-cover" /> : (
                    <div className="w-full h-full flex items-center justify-center font-black text-xl" style={{ color: 'var(--ink)', fontFamily: 'Fredoka' }}>{b.name[0]}</div>
                  )}
                </div>
                <div className="text-center">
                  <p className="font-semibold line-clamp-1" style={{ fontFamily: 'Fredoka', fontSize: 14 }}>{b.name}</p>
                  {b.tagline && <p className="text-xs font-bold mt-0.5 line-clamp-1" style={{ color: 'var(--ink2)' }}>{b.tagline}</p>}
                </div>
              </Link>
            ))}
          </div>
        ) : <p className="text-center py-12 text-sm font-bold" style={{ color: 'var(--ink2)' }}>Geen merken gevonden.</p>
      ) : (
        products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {products.map((p, i) => {
              const brand = p.brand as any
              return (
                <Link key={p.id} href={`/product/${p.id}`} className="block rounded-2xl overflow-hidden shadow-sm" style={{ background: 'var(--paper)' }}>
                  <div className="relative" style={{ height: 175, background: TINTS[i % TINTS.length] }}>
                    {p.images?.[0]?.url && <Image src={p.images[0].url} alt={p.title} fill className="object-cover" sizes="(max-width:640px) 50vw, 25vw" />}
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-black" style={{ color: 'var(--ink2)' }}>{brand?.name}</p>
                    <p className="font-medium leading-snug line-clamp-2 mt-0.5" style={{ fontFamily: 'Fredoka', fontSize: 14.5 }}>{p.title}</p>
                    <span className="font-bold mt-1.5 block" style={{ fontFamily: 'Fredoka', fontSize: 15.5 }}>{formatPrice(p.base_price_cents)}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : <p className="text-center py-12 text-sm font-bold" style={{ color: 'var(--ink2)' }}>Geen producten gevonden.</p>
      )}
    </div>
  )
}
