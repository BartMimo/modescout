export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AddToCartButton from './AddToCartButton'
import { formatPrice } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('products').select('title, description').eq('id', id).single()
  if (!data) return {}
  return { title: data.title, description: data.description ?? undefined }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*, brand:brands(*), images:product_images(*), variants:product_variants(*)')
    .eq('id', id)
    .eq('status', 'published')
    .single()

  if (!product) notFound()

  const images = (product.images ?? []).sort((a: { position: number }, b: { position: number }) => a.position - b.position)
  const mainImage = images[0]?.url ?? null

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <div className="px-4 py-3 flex items-center gap-1.5 text-xs text-[#999]">
        <Link href="/" className="hover:text-[#0D0D0D] transition-colors">Home</Link>
        <ChevronRight size={12} />
        {product.category && (
          <>
            <Link href={`/categorie/${product.category}`} className="hover:text-[#0D0D0D] transition-colors capitalize">{product.category}</Link>
            <ChevronRight size={12} />
          </>
        )}
        <span className="text-[#0D0D0D] font-medium truncate max-w-[200px]">{product.title}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-0 md:gap-10 lg:gap-16 px-0 md:px-4 pb-4 md:pb-16">
        {/* Foto's */}
        <div>
          <div className="aspect-[4/5] bg-[#F2F2F2] overflow-hidden relative md:rounded-2xl">
            {mainImage ? (
              <Image src={mainImage} alt={product.title} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 50vw" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#999] text-sm">Geen foto</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-2 px-4 md:px-0">
              {images.slice(1, 5).map((img: { id: string; url: string }) => (
                <div key={img.id} className="aspect-square bg-[#F2F2F2] rounded-xl overflow-hidden relative">
                  <Image src={img.url} alt={product.title} fill className="object-cover" sizes="100px" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="px-4 md:px-0 pt-5 md:pt-4">
          {product.brand && (
            <Link href={`/merk/${product.brand.slug}`}
              className="text-xs font-bold uppercase tracking-widest text-[#999] hover:text-[#0D0D0D] transition-colors">
              {product.brand.name}
            </Link>
          )}
          <h1 className="text-2xl md:text-3xl font-black mt-2 mb-3 leading-tight">{product.title}</h1>

          {!product.variants?.length && (
            <p className="text-2xl font-bold mb-4">{formatPrice(product.base_price_cents)}</p>
          )}

          {product.description && (
            <p className="text-[#555] leading-relaxed mb-6 text-sm md:text-base">{product.description}</p>
          )}

          <AddToCartButton
            productId={product.id}
            productTitle={product.title}
            brand={product.brand}
            variants={product.variants ?? []}
            imageUrl={mainImage}
            basePrice={product.base_price_cents}
          />

          {product.category && (
            <p className="mt-5 text-xs text-[#999]">
              Categorie: <Link href={`/categorie/${product.category}`} className="hover:underline capitalize text-[#666]">{product.category}</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
