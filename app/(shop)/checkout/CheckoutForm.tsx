'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useCart } from '@/components/shop/CartProvider'
import Button from '@/components/ui/Button'
import type { ShippingAddress } from '@/types'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function PaymentStep({
  clientSecret,
  onSuccess,
}: {
  clientSecret: string
  onSuccess: (orderId: string) => void
}) {
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
    if (submitError) {
      setError(submitError.message ?? 'Er ging iets mis.')
      setLoading(false)
      return
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/succes`,
      },
    })

    if (confirmError) {
      setError(confirmError.message ?? 'Betaling mislukt.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <Button type="submit" size="lg" className="w-full" loading={loading}>
        Betaal via iDEAL
      </Button>
    </form>
  )
}

interface AddressForm {
  name: string
  email: string
  line1: string
  line2: string
  city: string
  postal_code: string
}

export default function CheckoutForm() {
  const { items, totalCents } = useCart()
  const [step, setStep] = useState<'address' | 'payment'>('address')
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<AddressForm>({
    name: '', email: '', line1: '', line2: '', city: '', postal_code: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleAddressSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const shippingAddress: ShippingAddress = {
      name: form.name,
      line1: form.line1,
      line2: form.line2 || undefined,
      city: form.city,
      postal_code: form.postal_code,
      country: 'NL',
    }

    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, email: form.email, shippingAddress }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? 'Er ging iets mis.')
      setLoading(false)
      return
    }

    setClientSecret(data.clientSecret)
    setStep('payment')
    setLoading(false)
  }

  if (step === 'payment' && clientSecret) {
    return (
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: 'flat',
            variables: {
              colorPrimary: '#0D0D0D',
              colorBackground: '#ffffff',
              fontFamily: 'system-ui, sans-serif',
            },
          },
        }}
      >
        <div>
          <h2 className="font-semibold text-lg mb-6">Betaling</h2>
          <PaymentStep
            clientSecret={clientSecret}
            onSuccess={() => {}}
          />
        </div>
      </Elements>
    )
  }

  return (
    <form onSubmit={handleAddressSubmit} className="space-y-4">
      <h2 className="font-semibold text-lg">Bezorggegevens</h2>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="name">Naam</label>
        <input
          id="name" name="name" required value={form.name} onChange={handleChange}
          className="w-full border border-[#ddd] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0D0D0D]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="email">E-mailadres</label>
        <input
          id="email" name="email" type="email" required value={form.email} onChange={handleChange}
          className="w-full border border-[#ddd] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0D0D0D]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="line1">Straat + huisnummer</label>
        <input
          id="line1" name="line1" required value={form.line1} onChange={handleChange}
          className="w-full border border-[#ddd] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0D0D0D]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="line2">Toevoeging (optioneel)</label>
        <input
          id="line2" name="line2" value={form.line2} onChange={handleChange}
          className="w-full border border-[#ddd] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0D0D0D]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="postal_code">Postcode</label>
          <input
            id="postal_code" name="postal_code" required value={form.postal_code} onChange={handleChange}
            className="w-full border border-[#ddd] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0D0D0D]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="city">Stad</label>
          <input
            id="city" name="city" required value={form.city} onChange={handleChange}
            className="w-full border border-[#ddd] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0D0D0D]"
          />
        </div>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <Button type="submit" size="lg" className="w-full" loading={loading}>
        Doorgaan naar betaling
      </Button>
    </form>
  )
}
