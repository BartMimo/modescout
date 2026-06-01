'use client'

import { useState } from 'react'
import { useCart } from '@/components/shop/CartProvider'
import Button from '@/components/ui/Button'
import type { ProductVariant, Brand } from '@/types'
import { formatPrice } from '@/lib/utils'

interface Props {
  productId: string
  productTitle: string
  brand: Brand
  variants: ProductVariant[]
  imageUrl: string | null
  basePrice: number
}

export default function AddToCartButton({ productId, productTitle, brand, variants, imageUrl, basePrice }: Props) {
  const { addItem } = useCart()
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    variants.length === 1 ? variants[0].id : null
  )
  const [added, setAdded] = useState(false)

  const selectedVariant = variants.find(v => v.id === selectedVariantId)
  const price = selectedVariant?.price_cents ?? basePrice

  function handleAddToCart() {
    if (!selectedVariant) return
    addItem({
      variantId: selectedVariant.id,
      productId,
      brandId: brand.id,
      brandName: brand.name,
      title: productTitle,
      size: selectedVariant.size,
      color: selectedVariant.color,
      priceCents: price,
      quantity: 1,
      imageUrl,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (variants.length === 0) {
    return <p className="text-[#999] text-sm">Niet beschikbaar</p>
  }

  return (
    <div className="space-y-4">
      {/* Size/variant selector */}
      {variants.length > 1 && (
        <div>
          <p className="text-sm font-medium mb-2">Kies maat / variant</p>
          <div className="flex flex-wrap gap-2">
            {variants.map(v => {
              const label = [v.size, v.color].filter(Boolean).join(' · ')
              const outOfStock = v.stock_qty === 0
              return (
                <button
                  key={v.id}
                  onClick={() => !outOfStock && setSelectedVariantId(v.id)}
                  disabled={outOfStock}
                  className={[
                    'px-3 py-1.5 rounded-lg border text-sm transition-all',
                    outOfStock ? 'opacity-40 cursor-not-allowed line-through border-[#ddd]' : 'cursor-pointer',
                    selectedVariantId === v.id
                      ? 'bg-[#0D0D0D] text-[#F5F5EF] border-[#0D0D0D]'
                      : 'border-[#ccc] hover:border-[#0D0D0D]',
                  ].join(' ')}
                >
                  {label || v.sku || `Variant ${v.id.slice(-4)}`}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {selectedVariant && (
        <p className="text-2xl font-bold">{formatPrice(price)}</p>
      )}

      <Button
        size="lg"
        className="w-full"
        onClick={handleAddToCart}
        disabled={!selectedVariant || selectedVariant.stock_qty === 0}
      >
        {added ? '✓ Toegevoegd aan mandje' : 'In mandje'}
      </Button>

      {selectedVariant && selectedVariant.stock_qty <= 3 && selectedVariant.stock_qty > 0 && (
        <p className="text-amber-600 text-sm">Nog {selectedVariant.stock_qty} op voorraad</p>
      )}
    </div>
  )
}
