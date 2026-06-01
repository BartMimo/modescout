export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/shop/ProductCard'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: brand } = await supabase.from('brands').select('name, tagline').eq('slug', slug).single()
  if (!brand) return {}
  return { title: brand.name, description: brand.tagline ?? undefined }
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: brand } = await supabase
    .from('brands')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (!brand) notFound()

  const { data: products } = await supabase
    .from('products')
    .select('*, images:product_images(*)')
    .eq('brand_id', brand.id)
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  return (
    <div>
      {/* Brand hero */}
      <div className="bg-[#0D0D0D] text-[#F5F5EF] px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          {brand.logo_url && (
            <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-6 relative">
              <Image src={brand.logo_url} alt={brand.name} fill className="object-cover" />
            </div>
          )}
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{brand.name}</h1>
          {brand.tagline && <p className="text-[#CDFF00] text-lg mb-6">{brand.tagline}</p>}
          {brand.story && (
            <p className="text-[#999] leading-relaxed max-w-xl mx-auto">{brand.story}</p>
          )}
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8">Collectie</h2>
        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={{ ...product, brand }} />
            ))}
          </div>
        ) : (
          <p className="text-[#999] text-center py-16">Nog geen producten beschikbaar.</p>
        )}
      </div>
    </div>
  )
}
