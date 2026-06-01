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
        <div className="w-16 h-16 bg-[#F2F2F2] rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={24} className="text-[#999]" />
        </div>
        <h1 className="text-2xl font-bold mb-3">Je mandje is leeg</h1>
        <p className="text-[#666] mb-8 text-sm">Voeg producten toe om te beginnen met winkelen.</p>
        <Link href="/zoeken" className="inline-block bg-[#0D0D0D] text-white font-semibold px-7 py-3.5 rounded-full hover:bg-[#333] transition-colors">
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

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 md:py-12 pb-32 md:pb-12">
      <h1 className="text-2xl font-bold mb-6">Jouw mandje</h1>

      <div className="space-y-6 mb-6">
        {Object.entries(byBrand).map(([brandId, brandItems]) => (
          <div key={brandId}>
            <p className="text-xs font-bold uppercase tracking-widest text-[#999] mb-3">{brandItems[0].brandName}</p>
            <div className="space-y-3">
              {brandItems.map(item => (
                <div key={item.variantId} className="flex gap-3 p-3 bg-[#FAFAF7] rounded-2xl">
                  <div className="w-16 h-20 bg-[#F2F2F2] rounded-xl overflow-hidden shrink-0 relative">
                    {item.imageUrl
                      ? <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                      : <div className="w-full h-full bg-[#F2F2F2]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm leading-snug line-clamp-2">{item.title}</h3>
                    {(item.size || item.color) && (
                      <p className="text-xs text-[#666] mt-0.5">{[item.size, item.color].filter(Boolean).join(' · ')}</p>
                    )}
                    <p className="font-bold text-sm mt-1">{formatPrice(item.priceCents)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-[#E0E0E0] flex items-center justify-center hover:border-[#0D0D0D] transition-colors active:scale-95">
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-[#E0E0E0] flex items-center justify-center hover:border-[#0D0D0D] transition-colors active:scale-95">
                        <Plus size={12} />
                      </button>
                      <button onClick={() => removeItem(item.variantId)}
                        className="ml-1 w-8 h-8 rounded-full flex items-center justify-center text-[#ccc] hover:text-red-500 hover:bg-red-50 transition-colors"
                        aria-label="Verwijder">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-sm">{formatPrice(item.priceCents * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Totaal — desktop inline, mobiel sticky */}
      <div className="hidden md:block bg-[#FAFAF7] rounded-2xl p-5">
        <div className="flex justify-between mb-3 text-sm">
          <span className="text-[#666]">Subtotaal</span>
          <span className="font-semibold">{formatPrice(totalCents)}</span>
        </div>
        <div className="flex justify-between mb-5 text-sm">
          <span className="text-[#666]">Verzending</span>
          <span className="text-[#999]">Berekend bij checkout</span>
        </div>
        <Link href="/checkout" className="block w-full bg-[#0D0D0D] text-white text-center font-semibold py-4 rounded-2xl hover:bg-[#333] transition-colors">
          Afrekenen
        </Link>
        <p className="text-xs text-center text-[#999] mt-3">Veilig betalen via iDEAL · Stripe</p>
      </div>

      {/* Mobiel sticky checkout bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#F2F2F2] px-4 py-3 safe-bottom">
        <Link href="/checkout"
          className="flex items-center justify-between w-full bg-[#0D0D0D] text-white px-5 py-4 rounded-2xl active:scale-[0.98] transition-transform">
          <span className="font-semibold">Afrekenen</span>
          <span className="font-bold">{formatPrice(totalCents)}</span>
        </Link>
      </div>
    </div>
  )
}
