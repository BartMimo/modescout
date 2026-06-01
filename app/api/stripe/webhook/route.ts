import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'
import type Stripe from 'stripe'

// Disable body parsing — Stripe needs raw body for signature verification
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'payment_intent.succeeded') {
    await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent)
  }

  if (event.type === 'payment_intent.payment_failed') {
    await handlePaymentFailed(event.data.object as Stripe.PaymentIntent)
  }

  return NextResponse.json({ received: true })
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const supabase = await createServiceClient()

  // Idempotency: check if already processed
  const { data: order } = await supabase
    .from('orders')
    .select('id, status')
    .eq('stripe_payment_intent_id', paymentIntent.id)
    .single()

  if (!order) {
    console.error('Order not found for payment_intent:', paymentIntent.id)
    return
  }

  if (order.status === 'paid') {
    // Already processed — idempotent
    return
  }

  // Mark order as paid
  await supabase
    .from('orders')
    .update({ status: 'paid' })
    .eq('id', order.id)

  // Get order items with brand stripe accounts
  const { data: items } = await supabase
    .from('order_items')
    .select('*, brand:brands(id, stripe_account_id, commission_rate)')
    .eq('order_id', order.id)

  if (!items?.length) return

  // Group by brand and create transfers
  const brandTotals: Record<string, {
    stripeAccountId: string
    commissionRate: number
    totalCents: number
    itemIds: string[]
    commissionCents: number
  }> = {}

  for (const item of items) {
    const brand = (item.brand as unknown) as { id: string; stripe_account_id: string; commission_rate: number }
    if (!brand?.stripe_account_id) continue

    const itemTotal = item.unit_price_cents * item.quantity
    const commissionRate = brand.commission_rate ?? 0.15
    const commissionCents = Math.round(itemTotal * commissionRate)
    const transferAmount = itemTotal - commissionCents

    if (!brandTotals[brand.id]) {
      brandTotals[brand.id] = {
        stripeAccountId: brand.stripe_account_id,
        commissionRate,
        totalCents: 0,
        itemIds: [],
        commissionCents: 0,
      }
    }
    brandTotals[brand.id].totalCents += transferAmount
    brandTotals[brand.id].commissionCents += commissionCents
    brandTotals[brand.id].itemIds.push(item.id)
  }

  // Create transfers per brand
  for (const [brandId, data] of Object.entries(brandTotals)) {
    if (data.totalCents <= 0) continue

    try {
      const transfer = await stripe.transfers.create({
        amount: data.totalCents,
        currency: 'eur',
        destination: data.stripeAccountId,
        source_transaction: paymentIntent.latest_charge as string,
        metadata: { order_id: order.id, brand_id: brandId },
      })

      // Update order items with transfer info
      await supabase
        .from('order_items')
        .update({
          transfer_id: transfer.id,
          commission_cents: data.commissionCents,
        })
        .in('id', data.itemIds)
    } catch (err) {
      console.error(`Transfer failed for brand ${brandId}:`, err)
      // Mark as failed — do not throw, process other brands
      await supabase
        .from('order_items')
        .update({ transfer_failed: true })
        .in('id', data.itemIds)
    }
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  const supabase = await createServiceClient()
  await supabase
    .from('orders')
    .update({ status: 'failed' })
    .eq('stripe_payment_intent_id', paymentIntent.id)
}
