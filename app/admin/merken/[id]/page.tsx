export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import AdminBrandEditForm from './AdminBrandEditForm'

export default async function AdminBrandEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: brand } = await supabase.from('brands').select('*').eq('id', id).single()
  if (!brand) notFound()

  const { data: products } = await supabase
    .from('products')
    .select('*, variants:product_variants(stock_qty)')
    .eq('brand_id', id)
    .order('created_at', { ascending: false })

  const { data: orderItems } = await supabase
    .from('order_items')
    .select('unit_price_cents, quantity, commission_cents, order:orders(status)')
    .eq('brand_id', id)

  const paidItems = (orderItems ?? []).filter((i: any) => i.order?.status === 'paid')
  const totalRevenue = paidItems.reduce((s: number, i: any) => s + i.unit_price_cents * i.quantity, 0)
  const totalCommission = paidItems.reduce((s: number, i: any) => s + (i.commission_cents ?? 0), 0)

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <a href="/admin/merken" className="text-sm text-[#666] hover:underline">← Alle merken</a>
        <span className="text-[#ccc]">/</span>
        <h1 className="text-xl font-bold">{brand.name}</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-white border border-[#E0E0DA] rounded-xl p-4">
          <p className="text-xs text-[#666]">GMV (bruto)</p>
          <p className="text-xl font-bold">{new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(totalRevenue / 100)}</p>
        </div>
        <div className="bg-white border border-[#E0E0DA] rounded-xl p-4">
          <p className="text-xs text-[#666]">Commissie platform</p>
          <p className="text-xl font-bold">{new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(totalCommission / 100)}</p>
        </div>
        <div className="bg-white border border-[#E0E0DA] rounded-xl p-4">
          <p className="text-xs text-[#666]">Producten</p>
          <p className="text-xl font-bold">{products?.length ?? 0}</p>
        </div>
      </div>

      {/* Products overview */}
      {products && products.length > 0 && (
        <div className="mb-8">
          <h2 className="font-semibold mb-3">Producten</h2>
          <div className="bg-white border border-[#E0E0DA] rounded-xl overflow-hidden">
            {products.map((p: any, i: number) => {
              const totalStock = (p.variants ?? []).reduce((s: number, v: any) => s + (v.stock_qty ?? 0), 0)
              return (
                <div key={p.id} className={`flex items-center justify-between px-4 py-3 ${i > 0 ? 'border-t border-[#F0F0EA]' : ''}`}>
                  <div>
                    <p className="text-sm font-medium">{p.title}</p>
                    <p className="text-xs text-[#999]">{p.category} · {p.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(p.base_price_cents / 100)}</p>
                    <p className={`text-xs ${totalStock === 0 ? 'text-red-500' : totalStock <= 3 ? 'text-amber-500' : 'text-[#999]'}`}>
                      {totalStock} op voorraad
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <AdminBrandEditForm brand={brand} />
    </div>
  )
}
