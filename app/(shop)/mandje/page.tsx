'use client'

import { useCart } from '@/components/shop/CartProvider'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'

export default function MandjeePage() {
  const { items, totalCents, removeItem, updateQuantity } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: 'var(--orange-t)' }}>
          <ShoppingBag size={26} color="var(--orange)" />
        </div>
        <h1 className="text-2xl mb-3">Je mandje is leeg</h1>
        <p className="text-sm mb-8 font-bold" style={{ color: 'var(--ink2)' }}>Voeg producten toe om te beginnen met winkelen.</p>
        <Link href="/zoeken" className="inline-block px-7 py-3.5 rounded-full text-white font-bold"
          style={{ background: 'var(--orange)', fontFamily: 'Fredoka', fontWeight: 600, boxShadow: 'var(--shadow-warm)' }}>
          Ontdek producten
        </Link>
      </div>
    )
  }

  const byBrand = items.reduce<Record<string, typeof items>>((acc, item) => {
    if (!acc[item.brandId]) acc[item.brandId] = []
    acc[item.brandId].push(item)
    return acc
  }, {})

  // Gratis verzending drempel
  const freeShippingThreshold = 5000
  const remaining = Math.max(0, freeShippingThreshold - totalCents)
  const progress = Math.min(100, (totalCents / freeShippingThreshold) * 100)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-36 md:pb-12">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl">Winkelmand <span style={{ color: 'var(--ink2)', fontWeight: 500 }}>· {items.reduce((s, i) => s + i.quantity, 0)}</span></h1>
        <button onClick={() => items.forEach(i => removeItem(i.variantId))}
          className="text-sm font-bold" style={{ color: 'var(--orange)' }}>
          Wis alles
        </button>
      </div>

      {/* Gratis verzending */}
      <div className="rounded-2xl p-3.5 mb-5" style={{ background: 'var(--paper)', boxShadow: 'var(--shadow-sm)' }}>
        <div className="flex items-center gap-2 mb-2.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7h11v9H3z"/><path d="M14 10h4l3 3v3h-7"/><circle cx="6.5" cy="19" r="1.5"/><circle cx="17.5" cy="19" r="1.5"/></svg>
          <span className="text-sm font-black" style={{ color: 'var(--ink)' }}>
            {remaining > 0 ? <>Nog <span style={{ color: 'var(--teal)' }}>{formatPrice(remaining)}</span> tot gratis verzending</> : 'Gratis verzending!'}
          </span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--cream2)' }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, var(--yellow), var(--teal))' }} />
        </div>
      </div>

      {/* Items */}
      <div className="space-y-4 mb-5">
        {Object.entries(byBrand).map(([brandId, brandItems]) => (
          <div key={brandId}>
            <p className="text-xs font-black uppercase tracking-widest mb-2.5" style={{ color: 'var(--ink2)' }}>{brandItems[0].brandName}</p>
            <div className="space-y-3">
              {brandItems.map(item => (
                <div key={item.variantId} className="flex gap-3 p-3 rounded-2xl" style={{ background: 'var(--paper)', boxShadow: 'var(--shadow-sm)' }}>
                  <div className="w-16 h-20 rounded-2xl overflow-hidden shrink-0 relative" style={{ background: 'var(--cream2)' }}>
                    {item.imageUrl && <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-black" style={{ color: 'var(--ink2)' }}>{item.brandName}</p>
                        <p className="font-medium leading-snug line-clamp-2 mt-0.5" style={{ fontFamily: 'Fredoka', fontSize: 14.5 }}>{item.title}</p>
                        {(item.size || item.color) && <p className="text-xs font-bold mt-0.5" style={{ color: 'var(--ink2)' }}>{[item.size, item.color].filter(Boolean).join(' · ')}</p>}
                      </div>
                      <button onClick={() => removeItem(item.variantId)} className="ml-2 p-1 shrink-0" style={{ color: 'var(--ink3)' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center rounded-full overflow-hidden border" style={{ borderColor: 'var(--line2)' }}>
                        <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className="w-8 h-7 flex items-center justify-center" style={{ color: 'var(--ink)' }}>
                          <Minus size={13} />
                        </button>
                        <span className="w-6 text-center text-xs font-black" style={{ fontFamily: 'Nunito' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} className="w-8 h-7 flex items-center justify-center" style={{ color: 'var(--ink)' }}>
                          <Plus size={13} />
                        </button>
                      </div>
                      <span className="font-bold" style={{ fontFamily: 'Fredoka', fontSize: 16 }}>{formatPrice(item.priceCents * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Totaal — desktop */}
      <div className="hidden md:block rounded-2xl p-5" style={{ background: 'var(--paper)', boxShadow: 'var(--shadow-sm)' }}>
        {[['Subtotaal', formatPrice(totalCents)], ['Verzending', totalCents >= freeShippingThreshold ? 'Gratis' : '€3,95']].map(([l, v]) => (
          <div key={l} className="flex justify-between mb-3 text-sm font-bold" style={{ color: 'var(--ink2)' }}>
            <span>{l}</span><span style={{ color: 'var(--ink)' }}>{v}</span>
          </div>
        ))}
        <div className="flex justify-between items-center pt-3 mb-5" style={{ borderTop: '1px solid var(--line)' }}>
          <span style={{ fontFamily: 'Fredoka', fontWeight: 600, fontSize: 18 }}>Totaal</span>
          <span style={{ fontFamily: 'Fredoka', fontWeight: 600, fontSize: 22, color: 'var(--orange)' }}>{formatPrice(totalCents)}</span>
        </div>
        <Link href="/checkout" className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-white font-bold"
          style={{ background: 'var(--orange)', fontFamily: 'Fredoka', fontWeight: 600, boxShadow: 'var(--shadow-warm)', fontSize: 16 }}>
          Veilig afrekenen · {formatPrice(totalCents)}
        </Link>
      </div>

      {/* Mobiel sticky */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 z-40 px-4 pb-3 safe-bottom" style={{ background: 'rgba(255,247,238,0.96)', backdropFilter: 'blur(8px)', borderTop: '1px solid var(--line)' }}>
        <Link href="/checkout" className="flex items-center justify-between w-full py-4 px-5 rounded-2xl text-white font-bold mt-3"
          style={{ background: 'var(--orange)', fontFamily: 'Fredoka', fontWeight: 600, boxShadow: 'var(--shadow-warm)', fontSize: 15 }}>
          <span>Veilig afrekenen</span>
          <span>{formatPrice(totalCents)}</span>
        </Link>
      </div>
    </div>
  )
}
