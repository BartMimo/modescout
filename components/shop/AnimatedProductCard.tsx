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
          className="aspect-[3/4] bg-[#F2F2F2] rounded-2xl overflow-hidden relative mb-3"
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.15 }}
        >
          {image ? (
            <Image src={image} alt={product.title} fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#F8F8F6]">
              <span className="text-[#D0D0D0] text-xs uppercase tracking-widest font-medium">Geen foto</span>
            </div>
          )}
          <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0">
            <div className="bg-white text-[#0D0D0D] text-xs font-semibold text-center py-2.5 rounded-xl shadow-sm">
              Bekijk product
            </div>
          </div>
        </motion.div>
        <div>
          {product.brand && (
            <p className="text-xs text-[#999] uppercase tracking-widest mb-0.5 font-medium">{product.brand.name}</p>
          )}
          <h3 className="text-sm font-semibold leading-snug">{product.title}</h3>
          <p className="text-sm font-bold mt-1">{formatPrice(product.base_price_cents)}</p>
        </div>
      </Link>
    </motion.div>
  )
}
