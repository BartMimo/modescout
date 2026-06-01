'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/components/shop/CartProvider'
import { CheckCircle } from 'lucide-react'

export default function CheckoutSuccesPage() {
  const searchParams = useSearchParams()
  const { clearCart } = useCart()
  const [cleared, setCleared] = useState(false)

  const paymentIntent = searchParams.get('payment_intent')
  const status = searchParams.get('redirect_status')

  useEffect(() => {
    if (status === 'succeeded' && !cleared) {
      clearCart()
      setCleared(true)
    }
  }, [status, cleared, clearCart])

  if (status !== 'succeeded') {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Betaling niet geslaagd</h1>
        <p className="text-[#666] mb-8">Er is iets misgegaan. Probeer het opnieuw.</p>
        <Link href="/checkout" className="underline">Terug naar checkout</Link>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="w-16 h-16 bg-[#CDFF00] rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-8 h-8 text-[#0D0D0D]" />
      </div>
      <h1 className="text-3xl font-bold mb-4">Bestelling geplaatst!</h1>
      <p className="text-[#666] mb-2">
        Bedankt voor je aankoop. Je ontvangt een bevestiging per e-mail.
      </p>
      {paymentIntent && (
        <p className="text-xs text-[#999] mb-8">Referentie: {paymentIntent}</p>
      )}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/bestellingen"
          className="bg-[#0D0D0D] text-[#F5F5EF] font-semibold px-6 py-3 rounded-xl hover:bg-[#222] transition-colors text-sm"
        >
          Mijn bestellingen
        </Link>
        <Link
          href="/zoeken"
          className="border border-[#0D0D0D] font-semibold px-6 py-3 rounded-xl hover:bg-[#0D0D0D] hover:text-[#F5F5EF] transition-colors text-sm"
        >
          Verder winkelen
        </Link>
      </div>
    </div>
  )
}
