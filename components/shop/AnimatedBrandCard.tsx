'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Brand } from '@/types'

const COLORS = ['#CDFF00', '#FFE8F0', '#E8FFF0', '#FFF8E8', '#E8F0FF', '#F5E8FF']

export default function AnimatedBrandCard({ brand, index = 0 }: { brand: Brand; index?: number }) {
  const bg = COLORS[index % COLORS.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Link href={`/merk/${brand.slug}`} className="group block">
        <motion.div
          className="aspect-square rounded-2xl overflow-hidden relative mb-3"
          style={{ background: bg }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.2 }}
        >
          {brand.logo_url ? (
            <Image src={brand.logo_url} alt={brand.name} fill sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl md:text-5xl font-black text-[#0D0D0D]/20 group-hover:text-[#0D0D0D]/40 transition-colors">
                {brand.name[0]}
              </span>
            </div>
          )}
        </motion.div>
        <h3 className="font-bold group-hover:underline underline-offset-2">{brand.name}</h3>
        {brand.tagline && <p className="text-sm text-[#666] mt-0.5 line-clamp-1">{brand.tagline}</p>}
      </Link>
    </motion.div>
  )
}
