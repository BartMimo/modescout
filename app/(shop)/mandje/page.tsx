'use client'

import { useCart } from '@/components/shop/CartProvider'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Plus, Minus } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function MandjeePage() {
  const { items, totalCents, removeItem, updateQuantity } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Je mandje is leeg</h1>
        <p className="text-[#666] mb-8">Voeg producten toe om te beginnen met winkelen.</p>
        <Link href="/zoeken">
          <Button size="lg">Ontdek producten</Button>
        </Link>
      </div>
    )
  }

  // Group items by brand
  const byBrand = items.reduce<Record<string, typeof items>>((acc, item) => {
    if (!acc[item.brandId]) acc[item.brandId] = []
    acc[item.brandId].push(item)
    return acc
  }, {})

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-16">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Jouw mandje</h1>

      <div className="space-y-8 mb-8">
        {Object.entries(byBrand).map(([brandId, brandItems]) => (
          <div key={brandId}>
            <p className="text-xs uppercase tracking-widest text-[#666] mb-3 font-medium">
              {brandItems[0].brandName}
            </p>
            <div className="space-y-4">
              {brandItems.map(item => (
                <div key={item.variantId} className="flex gap-4 py-4 border-b border-[#E0E0DA]">
                  <div className="w-20 h-24 bg-[#E8E8E2] rounded-lg overflow-hidden shrink-0 relative">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#E8E8E2]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium leading-snug">{item.title}</h3>
                    {(item.size || item.color) && (
                      <p className="text-sm text-[#666] mt-0.5">
                        {[item.size, item.color].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    <p className="font-semibold mt-1">{formatPrice(item.priceCents)}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        className="w-7 h-7 rounded-full border border-[#ddd] flex items-center justify-center hover:border-[#0D0D0D] transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        className="w-7 h-7 rounded-full border border-[#ddd] flex items-center justify-center hover:border-[#0D0D0D] transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="ml-2 text-[#999] hover:text-red-500 transition-colors"
                        aria-label="Verwijder"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold">{formatPrice(item.priceCents * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#F0F0EA] rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[#666]">Subtotaal</span>
          <span className="font-semibold">{formatPrice(totalCents)}</span>
        </div>
        <div className="flex justify-between items-center mb-6">
          <span className="text-[#666]">Verzending</span>
          <span className="text-sm text-[#666]">Berekend bij checkout</span>
        </div>
        <Link href="/checkout">
          <Button size="lg" className="w-full">Afrekenen</Button>
        </Link>
        <p className="text-xs text-center text-[#999] mt-3">Betalen via iDEAL · Veilig via Stripe</p>
      </div>
    </div>
  )
}
