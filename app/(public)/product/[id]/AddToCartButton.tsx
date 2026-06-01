'use client'

import { useState } from 'react'
import { useCart } from '@/components/shop/CartProvider'
import type { ProductVariant, Brand } from '@/types'
import { formatPrice } from '@/lib/utils'
import { ShoppingBag, Check } from 'lucide-react'

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
    setTimeout(() => setAdded(false), 2500)
  }

  if (variants.length === 0) {
    return <p className="text-[#999] text-sm">Niet beschikbaar</p>
  }

  return (
    <>
      {/* Desktop versie — normaal in de pagina */}
      <div className="hidden md:block space-y-4">
        <VariantSelector variants={variants} selected={selectedVariantId} onSelect={setSelectedVariantId} />
        {selectedVariant && <p className="text-2xl font-bold">{formatPrice(price)}</p>}
        <AddButton added={added} disabled={!selectedVariant || selectedVariant.stock_qty === 0} onClick={handleAddToCart} />
        {selectedVariant && selectedVariant.stock_qty <= 3 && selectedVariant.stock_qty > 0 && (
          <p className="text-amber-600 text-sm font-medium">Nog {selectedVariant.stock_qty} op voorraad</p>
        )}
      </div>

      {/* Mobiel — variant selector in pagina, sticky knop onderaan */}
      <div className="md:hidden space-y-4">
        <VariantSelector variants={variants} selected={selectedVariantId} onSelect={setSelectedVariantId} />
        {selectedVariant && selectedVariant.stock_qty <= 3 && selectedVariant.stock_qty > 0 && (
          <p className="text-amber-600 text-sm font-medium">Nog {selectedVariant.stock_qty} op voorraad</p>
        )}
      </div>

      {/* Sticky mobile CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#F2F2F2] px-4 py-3 safe-bottom">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm truncate">{productTitle}</p>
            <p className="text-sm text-[#666]">{formatPrice(price)}</p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!selectedVariant || selectedVariant.stock_qty === 0 || added}
            className={`flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-sm transition-all shrink-0 ${
              added
                ? 'bg-green-500 text-white'
                : !selectedVariant || selectedVariant.stock_qty === 0
                  ? 'bg-[#F2F2F2] text-[#999] cursor-not-allowed'
                  : 'bg-[#0D0D0D] text-white active:scale-95'
            }`}
          >
            {added ? <Check size={16} /> : <ShoppingBag size={16} />}
            {added ? 'Toegevoegd' : !selectedVariant ? 'Kies maat' : 'In mandje'}
          </button>
        </div>
      </div>
      {/* Spacer zodat content niet achter sticky bar verdwijnt */}
      <div className="md:hidden h-20" />
    </>
  )
}

function VariantSelector({ variants, selected, onSelect }: {
  variants: ProductVariant[]
  selected: string | null
  onSelect: (id: string) => void
}) {
  if (variants.length <= 1) return null
  return (
    <div>
      <p className="text-sm font-semibold mb-3">Selecteer maat</p>
      <div className="flex flex-wrap gap-2">
        {variants.map(v => {
          const label = [v.size, v.color].filter(Boolean).join(' · ')
          const outOfStock = v.stock_qty === 0
          return (
            <button
              key={v.id}
              onClick={() => !outOfStock && onSelect(v.id)}
              disabled={outOfStock}
              className={[
                'min-w-[52px] h-11 px-4 rounded-xl border-2 text-sm font-medium transition-all',
                outOfStock ? 'opacity-40 cursor-not-allowed line-through border-[#E0E0E0] text-[#999]' : 'cursor-pointer',
                selected === v.id
                  ? 'bg-[#0D0D0D] text-white border-[#0D0D0D]'
                  : 'border-[#E0E0E0] hover:border-[#0D0D0D]',
              ].join(' ')}
            >
              {label || v.sku || v.id.slice(-4)}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function AddButton({ added, disabled, onClick }: { added: boolean; disabled: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full h-14 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 transition-all ${
        added
          ? 'bg-green-500 text-white'
          : disabled
            ? 'bg-[#F2F2F2] text-[#999] cursor-not-allowed'
            : 'bg-[#0D0D0D] text-white hover:bg-[#333] active:scale-[0.98]'
      }`}
    >
      {added ? <Check size={18} /> : <ShoppingBag size={18} />}
      {added ? 'Toegevoegd aan mandje' : 'In mandje'}
    </button>
  )
}
