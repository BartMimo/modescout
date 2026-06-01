'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const DEMO_ACCOUNTS = [
  {
    type: 'Admin',
    email: 'admin@modescout.demo',
    password: 'modescout2024!',
    description: 'Zie alle orders, beheer merken, bekijk analytics',
    emoji: '⚡',
    color: '#CDFF00',
    redirectTo: '/admin',
  },
  {
    type: 'Merk',
    email: 'merk@modescout.demo',
    password: 'modescout2024!',
    description: 'Beheer producten, bekijk verkopen en orders',
    emoji: '🏪',
    color: '#E8FFF0',
    redirectTo: '/dashboard',
  },
  {
    type: 'Koper',
    email: 'koper@modescout.demo',
    password: 'modescout2024!',
    description: 'Blader door producten, bekijk bestellingen',
    emoji: '🛍️',
    color: '#FFF8E8',
    redirectTo: '/',
  },
]

export default function DemoPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  async function loginAs(account: typeof DEMO_ACCOUNTS[0]) {
    setLoading(account.type)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email: account.email,
      password: account.password,
    })

    if (error) {
      setError(`Demo-account "${account.type}" bestaat nog niet. Vraag de beheerder om de demo-accounts aan te maken.`)
      setLoading(null)
      return
    }

    router.push(account.redirectTo)
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <Link href="/" className="font-black text-2xl">
          Mode<span className="bg-[#CDFF00] px-1 rounded">Scout</span>
        </Link>
        <h1 className="text-2xl font-bold mt-4 mb-2">Demo-toegang</h1>
        <p className="text-[#666] text-sm">Bekijk de site vanuit elk perspectief</p>
      </div>

      <div className="space-y-3">
        {DEMO_ACCOUNTS.map(account => (
          <button
            key={account.type}
            onClick={() => loginAs(account)}
            disabled={loading !== null}
            className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-[#F2F2F2] hover:border-[#0D0D0D] transition-all text-left disabled:opacity-50 group"
            style={{ background: loading === account.type ? account.color : 'white' }}
          >
            <div className="text-3xl">{account.emoji}</div>
            <div className="flex-1 min-w-0">
              <p className="font-bold">{account.type}</p>
              <p className="text-sm text-[#666] line-clamp-1">{account.description}</p>
            </div>
            <div className="text-sm font-semibold text-[#0D0D0D] opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              {loading === account.type ? '⏳' : 'Inloggen →'}
            </div>
          </button>
        ))}
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 bg-[#FAFAF7] rounded-xl p-4 text-xs text-[#666] space-y-1">
        <p className="font-semibold text-[#0D0D0D] mb-2">Demo-accounts aanmaken:</p>
        <p>Ga naar Supabase → Authentication → Users → Add user en maak aan:</p>
        <ul className="space-y-1 mt-2 font-mono">
          {DEMO_ACCOUNTS.map(a => (
            <li key={a.email} className="flex gap-2">
              <span className="shrink-0">{a.emoji}</span>
              <span>{a.email} / {a.password}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[#999]">Na aanmaken: update de role in de profiles tabel.</p>
      </div>

      <p className="text-center text-sm text-[#666] mt-6">
        <Link href="/inloggen" className="hover:underline">← Normaal inloggen</Link>
      </p>
    </div>
  )
}
