export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import MarkShippedButton from './MarkShippedButton'

export default async function DashboardOrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/inloggen')

  const { data: brand } = await supabase.from('brands').select('id').eq('owner_id', user.id).single()
  if (!brand) redirect('/dashboard')

  const { data: items } = await supabase
    .from('order_items')
    .select('*, order:orders(id, created_at, status, email, shipping_address)')
    .eq('brand_id', brand.id)
    .order('id', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Bestellingen</h1>

      {!items?.length ? (
        <p className="text-[#666] text-center py-16">Nog geen bestellingen.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item: any) => (
            <div key={item.id} className="border border-[#E0E0DA] rounded-2xl p-5">
              <div className="flex justify-between items-start mb-3 gap-4">
                <div>
                  <p className="font-medium">{item.title_snapshot} ×{item.quantity}</p>
                  <p className="text-sm text-[#666]">{item.order?.email}</p>
                  {item.order?.shipping_address && (
                    <p className="text-xs text-[#999] mt-1">
                      {item.order.shipping_address.line1}, {item.order.shipping_address.postal_code} {item.order.shipping_address.city}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold">{formatPrice(item.unit_price_cents * item.quantity)}</p>
                  <p className="text-xs text-[#999]">
                    {item.commission_cents ? `- ${formatPrice(item.commission_cents)} commissie` : ''}
                  </p>
                  <p className="text-xs text-[#666] mt-1">
                    {item.order?.created_at && new Date(item.order.created_at).toLocaleDateString('nl-NL')}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  item.fulfillment_status === 'shipped'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {item.fulfillment_status === 'shipped' ? 'Verzonden' : 'Nieuw — verzenden'}
                </span>
                {item.fulfillment_status !== 'shipped' && item.order?.status === 'paid' && (
                  <MarkShippedButton itemId={item.id} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
