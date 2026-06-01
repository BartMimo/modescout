export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import type { Order } from '@/types'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
}

export default async function AdminOrdersPage() {
  const supabase = await createClient()

  const { data: orders } = await supabase
    .from('orders')
    .select('*, items:order_items(*, brand:brands(name))')
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Alle orders</h1>

      <div className="space-y-3">
        {orders?.map((order: Order) => (
          <div key={order.id} className="bg-white border border-[#E0E0DA] rounded-2xl p-5">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-mono text-sm font-medium">{order.id.slice(0, 8).toUpperCase()}</p>
                <p className="text-sm text-[#666]">{order.email}</p>
                <p className="text-xs text-[#999]">{new Date(order.created_at).toLocaleString('nl-NL')}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{formatPrice(order.total_cents)}</p>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[order.status]}`}>
                  {order.status}
                </span>
              </div>
            </div>
            {order.items && (
              <div className="space-y-1 border-t border-[#F0F0EA] pt-3">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm text-[#555]">
                    <span>{item.title_snapshot} ×{item.quantity} <span className="text-[#999]">({item.brand?.name})</span></span>
                    <span>{formatPrice(item.unit_price_cents * item.quantity)}</span>
                  </div>
                ))}
              </div>
            )}
            {order.items?.some((i: any) => i.transfer_failed) && (
              <p className="mt-2 text-xs text-red-600 font-medium">⚠ Transfer mislukt voor een of meer items</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
