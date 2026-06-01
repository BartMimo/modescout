'use client'

import { useState } from 'react'
import { useCart } from '@/components/shop/CartProvider'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import CheckoutForm from './CheckoutForm'

export default function CheckoutPage() {
  const { items, totalCents } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Je mandje is leeg</h1>
        <Link href="/zoeken" className="underline">Terug naar winkelen</Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-16">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Afrekenen</h1>
      <div className="grid md:grid-cols-[1fr_380px] gap-8">
        <CheckoutForm />

        {/* Order summary */}
        <div className="order-first md:order-last">
          <div className="bg-[#F0F0EA] rounded-2xl p-6 sticky top-20">
            <h2 className="font-semibold mb-4">Overzicht</h2>
            <div className="space-y-3 mb-4">
              {items.map(item => (
                <div key={item.variantId} className="flex justify-between gap-2 text-sm">
                  <span className="text-[#555] leading-snug">
                    {item.title}
                    {item.size && <span className="text-[#999]"> ({item.size})</span>}
                    {' ×'}{item.quantity}
                  </span>
                  <span className="font-medium shrink-0">{formatPrice(item.priceCents * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-[#ddd] pt-4 flex justify-between font-bold">
              <span>Totaal</span>
              <span>{formatPrice(totalCents)}</span>
            </div>
            <p className="text-xs text-[#999] mt-3 text-center">Incl. BTW · Betalen via iDEAL</p>
          </div>
        </div>
      </div>
    </div>
  )
}
