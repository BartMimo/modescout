'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Brand } from '@/types'

export default function AnimatedBrandCard({ brand, index = 0 }: { brand: Brand; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Link href={`/merk/${brand.slug}`} className="group block">
        <motion.div
          className="aspect-square bg-[#E8E8E2] rounded-xl overflow-hidden relative mb-3"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.2 }}
        >
          {brand.logo_url ? (
            <Image src={brand.logo_url} alt={brand.name} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#0D0D0D] text-[#CDFF00] text-2xl font-bold">
              {brand.name[0]}
            </div>
          )}
        </motion.div>
        <h3 className="font-semibold">{brand.name}</h3>
        {brand.tagline && <p className="text-sm text-[#666] mt-0.5 line-clamp-1">{brand.tagline}</p>}
      </Link>
    </motion.div>
  )
}
