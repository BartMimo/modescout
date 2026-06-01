export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'

export default async function AdminPage() {
  const supabase = await createClient()

  const [{ count: brandCount }, { count: productCount }, { count: orderCount }, { data: revenue }] = await Promise.all([
    supabase.from('brands').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('products').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'paid'),
    supabase.from('orders').select('total_cents').eq('status', 'paid'),
  ])

  const totalRevenue = revenue?.reduce((s: number, o: { total_cents: number }) => s + o.total_cents, 0) ?? 0
  const totalCommission = Math.round(totalRevenue * 0.15)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Admin-overzicht</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#E0E0DA]">
          <p className="text-sm text-[#666] mb-1">Actieve merken</p>
          <p className="text-3xl font-bold">{brandCount ?? 0}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#E0E0DA]">
          <p className="text-sm text-[#666] mb-1">Gepubliceerde producten</p>
          <p className="text-3xl font-bold">{productCount ?? 0}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#E0E0DA]">
          <p className="text-sm text-[#666] mb-1">Betaalde orders</p>
          <p className="text-3xl font-bold">{orderCount ?? 0}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#E0E0DA]">
          <p className="text-sm text-[#666] mb-1">Platform commissie</p>
          <p className="text-3xl font-bold">{formatPrice(totalCommission)}</p>
        </div>
      </div>
    </div>
  )
}
