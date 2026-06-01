export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import Navbar from '@/components/shop/Navbar'
import Footer from '@/components/shop/Footer'
import CartProvider from '@/components/shop/CartProvider'
import type { Order } from '@/types'

const STATUS_LABELS: Record<string, string> = {
  pending: 'In behandeling',
  paid: 'Betaald',
  failed: 'Mislukt',
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
}

export default async function BestellingenPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/inloggen')

  const { data: orders } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('buyer_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <CartProvider>
      <Navbar />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 py-8 md:py-16">
          <h1 className="text-2xl font-bold mb-8">Mijn bestellingen</h1>

          {!orders?.length ? (
            <div className="text-center py-16">
              <p className="text-[#666] mb-6">Je hebt nog geen bestellingen geplaatst.</p>
              <Link href="/zoeken" className="underline">Begin met winkelen</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order: Order) => (
                <div key={order.id} className="border border-[#E0E0DA] rounded-2xl p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-sm text-[#666]">
                        {new Date(order.created_at).toLocaleDateString('nl-NL', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-[#999] mt-0.5 font-mono">{order.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status]}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                  </div>

                  <div className="space-y-1 mb-3">
                    {order.items?.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-[#555]">
                          {item.title_snapshot} ×{item.quantity}
                          {item.fulfillment_status === 'shipped' && (
                            <span className="ml-2 text-xs text-green-600">Verzonden</span>
                          )}
                        </span>
                        <span>{formatPrice(item.unit_price_cents * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[#E0E0DA] pt-3 flex justify-between font-semibold">
                    <span>Totaal</span>
                    <span>{formatPrice(order.total_cents)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </CartProvider>
  )
}
