import Link from 'next/link'
import Image from 'next/image'
import type { Brand } from '@/types'

export default function BrandCard({ brand }: { brand: Brand }) {
  return (
    <Link href={`/merk/${brand.slug}`} className="group block">
      <div className="aspect-square bg-[#E8E8E2] rounded-xl overflow-hidden relative mb-3">
        {brand.logo_url ? (
          <Image
            src={brand.logo_url}
            alt={brand.name}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#0D0D0D] text-[#CDFF00] text-2xl font-bold">
            {brand.name[0]}
          </div>
        )}
      </div>
      <h3 className="font-semibold group-hover:underline">{brand.name}</h3>
      {brand.tagline && <p className="text-sm text-[#666] mt-0.5 line-clamp-1">{brand.tagline}</p>}
    </Link>
  )
}
