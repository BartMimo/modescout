export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AddToCartButton from './AddToCartButton'
import { formatPrice } from '@/lib/utils'
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
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-16">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        {/* Images */}
        <div className="space-y-3">
          <div className="aspect-[3/4] bg-[#E8E8E2] rounded-2xl overflow-hidden relative">
            {mainImage ? (
              <Image src={mainImage} alt={product.title} fill className="object-cover" priority />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#999]">Geen foto</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.slice(1, 5).map((img: { id: string; url: string }) => (
                <div key={img.id} className="aspect-square bg-[#E8E8E2] rounded-lg overflow-hidden relative">
                  <Image src={img.url} alt={product.title} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="py-2">
          {product.brand && (
            <Link
              href={`/merk/${product.brand.slug}`}
              className="text-sm uppercase tracking-widest text-[#666] hover:text-[#0D0D0D] transition-colors"
            >
              {product.brand.name}
            </Link>
          )}
          <h1 className="text-2xl md:text-3xl font-bold mt-2 mb-4">{product.title}</h1>

          {!product.variants?.length && (
            <p className="text-2xl font-bold mb-6">{formatPrice(product.base_price_cents)}</p>
          )}

          {product.description && (
            <p className="text-[#555] leading-relaxed mb-8">{product.description}</p>
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
            <p className="mt-6 text-sm text-[#999]">
              Categorie:{' '}
              <Link href={`/categorie/${product.category}`} className="hover:underline capitalize">
                {product.category}
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
