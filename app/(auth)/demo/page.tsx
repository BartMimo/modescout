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
    description: 'Beheer merken, bekijk alle orders en analytics',
    redirectTo: '/admin',
  },
  {
    type: 'Merk',
    email: 'merk@modescout.demo',
    password: 'modescout2024!',
    description: 'Beheer producten en bekijk verkopen',
    redirectTo: '/dashboard',
  },
  {
    type: 'Koper',
    email: 'koper@modescout.demo',
    password: 'modescout2024!',
    description: 'Blader door producten en bekijk bestellingen',
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
    const { error } = await supabase.auth.signInWithPassword({ email: account.email, password: account.password })
    if (error) {
      setError(`Demo-account "${account.type}" bestaat nog niet. Maak het aan via Supabase Auth.`)
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
        <p className="text-[#666] text-sm">Log in als een specifieke gebruikersrol</p>
      </div>

      <div className="space-y-3">
        {DEMO_ACCOUNTS.map(account => (
          <button key={account.type} onClick={() => loginAs(account)} disabled={loading !== null}
            className="w-full flex items-center gap-4 p-4 rounded-2xl border border-[#E0E0E0] hover:border-[#0D0D0D] transition-all text-left disabled:opacity-50 bg-white group">
            <div className="w-10 h-10 rounded-xl bg-[#F2F2F2] flex items-center justify-center shrink-0">
              <span className="font-black text-sm">{account.type[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{account.type}</p>
              <p className="text-xs text-[#666] line-clamp-1">{account.description}</p>
            </div>
            <span className="text-sm text-[#0D0D0D] shrink-0 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              {loading === account.type ? 'Laden...' : 'Inloggen'}
            </span>
          </button>
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-red-600 bg-red-50 rounded-xl p-3 border border-red-100">{error}</p>}

      <div className="mt-6 bg-[#FAFAF7] border border-[#F2F2F2] rounded-xl p-4 text-xs text-[#666] space-y-2">
        <p className="font-semibold text-[#0D0D0D]">Demo-accounts aanmaken in Supabase:</p>
        <p>Authentication &rarr; Users &rarr; Add user</p>
        <div className="space-y-1 font-mono text-[11px] bg-white rounded-lg p-3 border border-[#F2F2F2]">
          {DEMO_ACCOUNTS.map(a => <p key={a.email}>{a.email} / {a.password}</p>)}
        </div>
        <p className="text-[#999]">Daarna in de profiles tabel de role instellen.</p>
      </div>

      <p className="text-center text-sm text-[#666] mt-6">
        <Link href="/inloggen" className="hover:underline">Terug naar inloggen</Link>
      </p>
    </div>
  )
}
