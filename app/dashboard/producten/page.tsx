export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import ProductActions from './ProductActions'
import type { Product } from '@/types'

export default async function DashboardProductenPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/inloggen')

  const { data: brand } = await supabase.from('brands').select('id').eq('owner_id', user.id).single()
  if (!brand) redirect('/dashboard')

  const { data: products } = await supabase
    .from('products')
    .select('*, images:product_images(*), variants:product_variants(*)')
    .eq('brand_id', brand.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Producten</h1>
        <Link
          href="/dashboard/producten/nieuw"
          className="bg-[#CDFF00] text-[#0D0D0D] font-semibold px-4 py-2 rounded-xl text-sm hover:bg-[#b8e600] transition-colors"
        >
          + Nieuw product
        </Link>
      </div>

      {!products?.length ? (
        <div className="text-center py-16 text-[#666]">
          <p className="mb-4">Je hebt nog geen producten.</p>
          <Link href="/dashboard/producten/nieuw" className="underline">Voeg je eerste product toe</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product: Product) => (
            <div key={product.id} className="border border-[#E0E0DA] rounded-2xl p-4 flex items-center gap-4">
              <div className="w-14 h-14 bg-[#E8E8E2] rounded-lg overflow-hidden shrink-0">
                {product.images?.[0]?.url && (
                  <img src={product.images[0].url} alt={product.title} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium leading-snug truncate">{product.title}</h3>
                <p className="text-sm text-[#666]">{formatPrice(product.base_price_cents)}</p>
                <div className="flex gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${product.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-[#E8E8E2] text-[#666]'}`}>
                    {product.status === 'published' ? 'Gepubliceerd' : 'Concept'}
                  </span>
                  <span className="text-xs text-[#999]">{product.variants?.length ?? 0} varianten</span>
                </div>
              </div>
              <ProductActions productId={product.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
