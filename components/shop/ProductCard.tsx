import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const image = product.images?.[0]?.url
  const price = product.base_price_cents

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="aspect-[3/4] bg-[#E8E8E2] rounded-xl overflow-hidden relative mb-3">
        {image ? (
          <Image
            src={image}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#999] text-sm">
            Geen foto
          </div>
        )}
      </div>
      <div>
        {product.brand && (
          <p className="text-xs text-[#666] uppercase tracking-wide mb-0.5">{product.brand.name}</p>
        )}
        <h3 className="text-sm font-medium leading-snug group-hover:underline">{product.title}</h3>
        <p className="text-sm font-semibold mt-1">{formatPrice(price)}</p>
      </div>
    </Link>
  )
}
