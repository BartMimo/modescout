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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Link href={`/product/${product.id}`} className="group block">
        <motion.div
          className="aspect-[3/4] bg-[#F2F2F2] rounded-2xl overflow-hidden relative mb-3"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.2 }}
        >
          {image ? (
            <Image src={image} alt={product.title} fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl bg-[#FAFAF7]">👗</div>
          )}
          {/* Quick-add pill */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
            <div className="bg-white/90 backdrop-blur-sm text-[#0D0D0D] text-xs font-bold text-center py-2 rounded-full shadow-sm">
              Bekijk product →
            </div>
          </div>
        </motion.div>
        <div>
          {product.brand && (
            <p className="text-xs text-[#999] uppercase tracking-wider mb-0.5 font-medium">{product.brand.name}</p>
          )}
          <h3 className="text-sm font-semibold leading-snug group-hover:underline underline-offset-2">{product.title}</h3>
          <p className="text-sm font-bold mt-1 text-[#0D0D0D]">{formatPrice(product.base_price_cents)}</p>
        </div>
      </Link>
    </motion.div>
  )
}
