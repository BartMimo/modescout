export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { TrendingUp, Package, ShoppingBag, AlertCircle } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/inloggen')

  const { data: brand } = await supabase
    .from('brands')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  if (!brand) {
    return (
      <div className="max-w-lg">
        <h1 className="text-2xl font-bold mb-4">Welkom bij ModeScout</h1>
        <p className="text-[#666] mb-8">Je hebt nog geen merkprofiel. Maak er een aan om te beginnen met verkopen.</p>
        <Link href="/dashboard/merk/nieuw" className="bg-[#CDFF00] text-[#0D0D0D] font-semibold px-6 py-3 rounded-xl inline-block hover:bg-[#b8e600] transition-colors">
          Merk aanmaken
        </Link>
      </div>
    )
  }

  // Parallel data fetching
  const [
    { count: productCount },
    { count: publishedCount },
    { data: orderItems },
    { data: recentOrders },
    { data: productStats },
  ] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }).eq('brand_id', brand.id),
    supabase.from('products').select('id', { count: 'exact', head: true }).eq('brand_id', brand.id).eq('status', 'published'),
    supabase.from('order_items')
      .select('unit_price_cents, quantity, commission_cents, order:orders(status)')
      .eq('brand_id', brand.id),
    supabase.from('order_items')
      .select('*, order:orders(id, created_at, status, email)')
      .eq('brand_id', brand.id)
      .order('id', { ascending: false })
      .limit(8),
    // Per-product sales stats
    supabase.from('order_items')
      .select('title_snapshot, unit_price_cents, quantity, commission_cents, order:orders(status)')
      .eq('brand_id', brand.id),
  ])

  const paidItems = (orderItems ?? []).filter((i: any) => i.order?.status === 'paid')
  const totalRevenue = paidItems.reduce((s: number, i: any) => s + i.unit_price_cents * i.quantity - (i.commission_cents ?? 0), 0)
  const totalOrders = paidItems.length
  const totalUnits = paidItems.reduce((s: number, i: any) => s + i.quantity, 0)

  // Aggregate per product
  const productMap: Record<string, { title: string; units: number; revenue: number }> = {}
  for (const item of (productStats ?? []).filter((i: any) => i.order?.status === 'paid') as any[]) {
    const key = item.title_snapshot
    if (!productMap[key]) productMap[key] = { title: key, units: 0, revenue: 0 }
    productMap[key].units += item.quantity
    productMap[key].revenue += item.unit_price_cents * item.quantity - (item.commission_cents ?? 0)
  }
  const topProducts = Object.values(productMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5)

  // Low stock warning
  const { data: lowStock } = await supabase
    .from('product_variants')
    .select('id, size, color, stock_qty, product:products(title, brand_id)')
    .lte('stock_qty', 2)
    .gt('stock_qty', 0)

  const myLowStock = (lowStock ?? []).filter((v: any) => v.product?.brand_id === brand.id)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{brand.name}</h1>
          <p className="text-sm text-[#666] mt-1">
            Status:{' '}
            <span className={`font-medium ${brand.status === 'active' ? 'text-green-600' : brand.status === 'pending' ? 'text-amber-600' : 'text-red-600'}`}>
              {brand.status === 'active' ? 'Actief' : brand.status === 'pending' ? 'Wacht op goedkeuring' : 'Gepauzeerd'}
            </span>
          </p>
        </div>
        <Link href={`/merk/${brand.slug}`} className="text-sm underline text-[#666] hidden md:block">Bekijk pagina →</Link>
      </div>

      {/* Stripe warning */}
      {(!brand.charges_enabled || !brand.payouts_enabled) && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-amber-800 font-medium">Stripe-onboarding niet volledig</p>
            <p className="text-xs text-amber-700 mt-0.5">Voltooi de onboarding om betalingen te ontvangen.</p>
          </div>
          <Link href="/dashboard/stripe-onboarding" className="text-xs font-semibold underline text-amber-800 shrink-0">Start →</Link>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard icon={<TrendingUp size={18} />} label="Jouw omzet (85%)" value={formatPrice(totalRevenue)} sub="na commissie" />
        <StatCard icon={<ShoppingBag size={18} />} label="Betaalde orders" value={String(totalOrders)} />
        <StatCard icon={<Package size={18} />} label="Verkochte stuks" value={String(totalUnits)} />
        <StatCard icon={<Package size={18} />} label="Producten live" value={`${publishedCount ?? 0} / ${productCount ?? 0}`} sub="gepubliceerd" />
      </div>

      {/* Low stock alert */}
      {myLowStock.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <p className="font-semibold text-orange-900 text-sm mb-2">⚠ Bijna uitverkocht</p>
          <div className="space-y-1">
            {myLowStock.map((v: any) => (
              <p key={v.id} className="text-xs text-orange-800">
                {v.product?.title} — {[v.size, v.color].filter(Boolean).join(' / ')}: <strong>{v.stock_qty} stuks</strong>
              </p>
            ))}
          </div>
          <Link href="/dashboard/producten" className="text-xs underline text-orange-800 mt-2 inline-block">Voorraad bijwerken →</Link>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Top products */}
        {topProducts.length > 0 && (
          <div>
            <h2 className="font-semibold mb-4 flex items-center justify-between">
              Top producten
              <Link href="/dashboard/producten" className="text-xs text-[#666] underline font-normal">Alle producten</Link>
            </h2>
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p.title} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#E8E8E2] text-xs flex items-center justify-center font-bold shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.title}</p>
                    <p className="text-xs text-[#666]">{p.units} verkocht</p>
                  </div>
                  <p className="text-sm font-semibold shrink-0">{formatPrice(p.revenue)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent orders */}
        {(recentOrders ?? []).length > 0 && (
          <div>
            <h2 className="font-semibold mb-4 flex items-center justify-between">
              Recente orders
              <Link href="/dashboard/orders" className="text-xs text-[#666] underline font-normal">Alle orders</Link>
            </h2>
            <div className="space-y-3">
              {(recentOrders ?? []).slice(0, 5).map((item: any) => (
                <div key={item.id} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${item.fulfillment_status === 'shipped' ? 'bg-green-500' : 'bg-amber-400'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title_snapshot} ×{item.quantity}</p>
                    <p className="text-xs text-[#666]">{item.order?.email} · {item.order?.created_at && new Date(item.order.created_at).toLocaleDateString('nl-NL')}</p>
                  </div>
                  <p className="text-sm font-semibold shrink-0">{formatPrice(item.unit_price_cents * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#E0E0DA]">
        <Link href="/dashboard/producten" className="border border-[#E0E0DA] rounded-2xl p-4 hover:border-[#0D0D0D] transition-colors group">
          <Package size={20} className="mb-2 text-[#666]" />
          <h3 className="font-semibold text-sm group-hover:underline">Producten beheren</h3>
        </Link>
        <Link href="/dashboard/merk" className="border border-[#E0E0DA] rounded-2xl p-4 hover:border-[#0D0D0D] transition-colors group">
          <TrendingUp size={20} className="mb-2 text-[#666]" />
          <h3 className="font-semibold text-sm group-hover:underline">Merkprofiel bewerken</h3>
        </Link>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="bg-[#F0F0EA] rounded-2xl p-4 md:p-5">
      <div className="text-[#666] mb-2">{icon}</div>
      <p className="text-xs text-[#666] mb-1 leading-tight">{label}</p>
      <p className="text-2xl font-bold leading-none">{value}</p>
      {sub && <p className="text-xs text-[#999] mt-1">{sub}</p>}
    </div>
  )
}
