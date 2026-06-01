import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'

// POST: create or retrieve Stripe Connect account link for onboarding
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
    }

    const serviceSupabase = await createServiceClient()

    // Get brand for this user
    const { data: brand } = await serviceSupabase
      .from('brands')
      .select('id, stripe_account_id, charges_enabled, payouts_enabled')
      .eq('owner_id', user.id)
      .single()

    if (!brand) {
      return NextResponse.json({ error: 'Geen merk gevonden' }, { status: 404 })
    }

    let accountId = brand.stripe_account_id

    // Create account if not yet created
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'NL',
        email: user.email,
        capabilities: {
          transfers: { requested: true },
          ideal_payments: { requested: true },
        },
        metadata: { brand_id: brand.id },
      })
      accountId = account.id

      await serviceSupabase
        .from('brands')
        .update({ stripe_account_id: accountId })
        .eq('id', brand.id)
    }

    // Check current onboarding status
    const account = await stripe.accounts.retrieve(accountId)

    if (account.charges_enabled && account.payouts_enabled) {
      // Update DB if status changed
      if (!brand.charges_enabled || !brand.payouts_enabled) {
        await serviceSupabase
          .from('brands')
          .update({ charges_enabled: true, payouts_enabled: true })
          .eq('id', brand.id)
      }
      return NextResponse.json({ status: 'complete' })
    }

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/stripe-onboarding?refresh=true`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/stripe-onboarding?success=true`,
      type: 'account_onboarding',
    })

    return NextResponse.json({ url: accountLink.url })
  } catch (err) {
    console.error('Stripe Connect error:', err)
    return NextResponse.json({ error: 'Interne fout' }, { status: 500 })
  }
}

// GET: sync account status from Stripe
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })

    const serviceSupabase = await createServiceClient()
    const { data: brand } = await serviceSupabase
      .from('brands')
      .select('stripe_account_id, charges_enabled, payouts_enabled')
      .eq('owner_id', user.id)
      .single()

    if (!brand?.stripe_account_id) {
      return NextResponse.json({ charges_enabled: false, payouts_enabled: false })
    }

    const account = await stripe.accounts.retrieve(brand.stripe_account_id)

    if (account.charges_enabled !== brand.charges_enabled || account.payouts_enabled !== brand.payouts_enabled) {
      await serviceSupabase
        .from('brands')
        .update({
          charges_enabled: account.charges_enabled,
          payouts_enabled: account.payouts_enabled,
        })
        .eq('owner_id', user.id)
    }

    return NextResponse.json({
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled,
    })
  } catch (err) {
    console.error('Stripe status check error:', err)
    return NextResponse.json({ error: 'Interne fout' }, { status: 500 })
  }
}
