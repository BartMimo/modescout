'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useCart } from '@/components/shop/CartProvider'
import { ChevronRight } from 'lucide-react'
import type { ShippingAddress } from '@/types'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function PaymentStep({ clientSecret }: { clientSecret: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)
    setError(null)

    const { error: submitError } = await elements.submit()
    if (submitError) { setError(submitError.message ?? 'Er ging iets mis.'); setLoading(false); return }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/checkout/succes` },
    })
    if (confirmError) { setError(confirmError.message ?? 'Betaling mislukt.'); setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PaymentElement />
      {error && <p className="text-red-600 text-sm bg-red-50 rounded-xl px-3 py-2">{error}</p>}
      <button type="submit" disabled={loading}
        className="w-full h-14 bg-[#0D0D0D] text-white rounded-2xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98] transition-transform">
        {loading ? (
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : null}
        Betaal via iDEAL
      </button>
    </form>
  )
}

const INPUT = "w-full border border-[#E0E0E0] rounded-xl px-4 h-12 focus:outline-none focus:border-[#0D0D0D] bg-white transition-colors"
const LABEL = "block text-sm font-medium mb-1.5 text-[#0D0D0D]"

export default function CheckoutForm() {
  const { items } = useCart()
  const [step, setStep] = useState<'address' | 'payment'>('address')
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', email: '', line1: '', line2: '', city: '', postal_code: '' })

  function set(field: string, value: string) { setForm(f => ({ ...f, [field]: value })) }

  async function handleAddressSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const shippingAddress: ShippingAddress = {
      name: form.name, line1: form.line1, line2: form.line2 || undefined,
      city: form.city, postal_code: form.postal_code, country: 'NL',
    }

    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, email: form.email, shippingAddress }),
    })

    const data = await res.json()
    if (!res.ok) { setError(data.error ?? 'Er ging iets mis.'); setLoading(false); return }
    setClientSecret(data.clientSecret)
    setStep('payment')
    setLoading(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (step === 'payment' && clientSecret) {
    return (
      <Elements stripe={stripePromise} options={{
        clientSecret,
        appearance: { theme: 'flat', variables: { colorPrimary: '#0D0D0D', fontFamily: 'system-ui, sans-serif', borderRadius: '12px' } },
      }}>
        <div>
          <h2 className="font-bold text-lg mb-5">Betaling</h2>
          <PaymentStep clientSecret={clientSecret} />
        </div>
      </Elements>
    )
  }

  return (
    <form onSubmit={handleAddressSubmit} className="space-y-4">
      <h2 className="font-bold text-lg">Bezorggegevens</h2>

      <div>
        <label className={LABEL} htmlFor="name">Volledige naam</label>
        <input id="name" name="name" required value={form.name} onChange={e => set('name', e.target.value)} className={INPUT} autoComplete="name" />
      </div>

      <div>
        <label className={LABEL} htmlFor="email">E-mailadres</label>
        <input id="email" name="email" type="email" required value={form.email} onChange={e => set('email', e.target.value)} className={INPUT} autoComplete="email" inputMode="email" />
      </div>

      <div>
        <label className={LABEL} htmlFor="line1">Straat + huisnummer</label>
        <input id="line1" name="line1" required value={form.line1} onChange={e => set('line1', e.target.value)} className={INPUT} autoComplete="address-line1" />
      </div>

      <div>
        <label className={LABEL} htmlFor="line2">Toevoeging <span className="text-[#999] font-normal">(optioneel)</span></label>
        <input id="line2" name="line2" value={form.line2} onChange={e => set('line2', e.target.value)} className={INPUT} autoComplete="address-line2" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={LABEL} htmlFor="postal_code">Postcode</label>
          <input id="postal_code" name="postal_code" required value={form.postal_code} onChange={e => set('postal_code', e.target.value)} className={INPUT} autoComplete="postal-code" inputMode="numeric" />
        </div>
        <div>
          <label className={LABEL} htmlFor="city">Stad</label>
          <input id="city" name="city" required value={form.city} onChange={e => set('city', e.target.value)} className={INPUT} autoComplete="address-level2" />
        </div>
      </div>

      {error && <p className="text-red-600 text-sm bg-red-50 rounded-xl px-3 py-2">{error}</p>}

      <button type="submit" disabled={loading}
        className="w-full h-14 bg-[#0D0D0D] text-white rounded-2xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98] transition-transform mt-2">
        {loading ? (
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : <ChevronRight size={18} />}
        Doorgaan naar betaling
      </button>
    </form>
  )
}
