import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'
import { randomUUID } from 'crypto'
import type { CartItem, ShippingAddress } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const { items, email, shippingAddress }: {
      items: CartItem[]
      email: string
      shippingAddress: ShippingAddress
    } = await req.json()

    if (!items?.length || !email || !shippingAddress) {
      return NextResponse.json({ error: 'Onvolledige gegevens' }, { status: 400 })
    }

    const supabase = await createServiceClient()

    // Validate each item: verify price and stock from DB
    const variantIds = items.map(i => i.variantId)
    const { data: variants, error: variantsError } = await supabase
      .from('product_variants')
      .select('id, price_cents, stock_qty, product:products(id, base_price_cents, status, brand:brands(id, status, charges_enabled, stripe_account_id))')
      .in('id', variantIds)

    if (variantsError || !variants) {
      return NextResponse.json({ error: 'Kon producten niet ophalen' }, { status: 500 })
    }

    // Check all variants exist, are in stock, and brands are active
    for (const item of items) {
      const v = variants.find(v => v.id === item.variantId)
      if (!v) return NextResponse.json({ error: `Product niet gevonden: ${item.title}` }, { status: 400 })

      const product = (v.product as unknown) as { status: string; base_price_cents: number; brand: { status: string; charges_enabled: boolean } } | null
      if (!product || product.status !== 'published') {
        return NextResponse.json({ error: `Product niet beschikbaar: ${item.title}` }, { status: 400 })
      }
      if (!product.brand || product.brand.status !== 'active' || !product.brand.charges_enabled) {
        return NextResponse.json({ error: `Merk momenteel niet beschikbaar` }, { status: 400 })
      }
      if (v.stock_qty < item.quantity) {
        return NextResponse.json({ error: `Onvoldoende voorraad: ${item.title}` }, { status: 400 })
      }
    }

    // Calculate validated total from DB prices
    let totalCents = 0
    for (const item of items) {
      const v = variants.find(v => v.id === item.variantId)!
      const product = (v.product as unknown) as { base_price_cents: number }
      const price = v.price_cents ?? product.base_price_cents
      totalCents += price * item.quantity
    }

    const idempotencyKey = randomUUID()

    // Create PaymentIntent on platform account
    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: totalCents,
        currency: 'eur',
        payment_method_types: ['ideal'],
        metadata: {
          idempotency_key: idempotencyKey,
          email,
        },
        receipt_email: email,
      },
      { idempotencyKey }
    )

    // Create pending order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        email,
        shipping_address: shippingAddress,
        total_cents: totalCents,
        status: 'pending',
        stripe_payment_intent_id: paymentIntent.id,
        idempotency_key: idempotencyKey,
      })
      .select()
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Kon bestelling niet aanmaken' }, { status: 500 })
    }

    // Create order items
    const orderItems = items.map(item => {
      const v = variants.find(v => v.id === item.variantId)!
      const product = (v.product as unknown) as { base_price_cents: number; brand: { id: string } }
      const price = v.price_cents ?? product.base_price_cents
      return {
        order_id: order.id,
        brand_id: item.brandId,
        product_variant_id: item.variantId,
        title_snapshot: item.title,
        quantity: item.quantity,
        unit_price_cents: price,
      }
    })

    await supabase.from('order_items').insert(orderItems)

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'Interne fout' }, { status: 500 })
  }
}
