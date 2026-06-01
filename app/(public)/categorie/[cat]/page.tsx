export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/shop/ProductCard'
import type { Product } from '@/types'
import type { Metadata } from 'next'

const CATEGORIES: Record<string, string> = {
  truien: 'Truien & sweaters',
  broeken: 'Broeken',
  jassen: 'Jassen & blazers',
  hoodies: 'Hoodies',
  jurken: 'Jurken',
  rokken: 'Rokken',
  tops: 'Tops & blouses',
  accessoires: 'Accessoires',
}

export async function generateMetadata({ params }: { params: Promise<{ cat: string }> }): Promise<Metadata> {
  const { cat } = await params
  const label = CATEGORIES[cat] ?? cat
  return { title: label }
}

export default async function CategoriePage({ params }: { params: Promise<{ cat: string }> }) {
  const { cat } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('products')
    .select('*, brand:brands(*), images:product_images(*)')
    .eq('status', 'published')
    .eq('category', cat)
    .order('created_at', { ascending: false })

  const products = (data ?? []) as Product[]
  const label = CATEGORIES[cat] ?? cat

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 capitalize">{label}</h1>
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <p className="text-center text-[#999] py-16">Nog geen producten in deze categorie.</p>
      )}
    </div>
  )
}
