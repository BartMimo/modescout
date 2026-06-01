'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

export default function AnimatedProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const image = product.images?.[0]?.url

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Link href={`/product/${product.id}`} className="group block">
        <motion.div
          className="aspect-[3/4] bg-[#E8E8E2] rounded-xl overflow-hidden relative mb-3"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.2 }}
        >
          {image ? (
            <Image
              src={image}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#999] text-sm">Geen foto</div>
          )}
        </motion.div>
        <div>
          {product.brand && (
            <p className="text-xs text-[#666] uppercase tracking-wide mb-0.5">{product.brand.name}</p>
          )}
          <h3 className="text-sm font-medium leading-snug">{product.title}</h3>
          <p className="text-sm font-semibold mt-1">{formatPrice(product.base_price_cents)}</p>
        </div>
      </Link>
    </motion.div>
  )
}
