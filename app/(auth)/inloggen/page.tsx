'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { useRouter } from 'next/navigation'

export default function InloggenPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'magic' | 'password'>('magic')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/` } })
    if (error) setError(error.message)
    else setMessage('Controleer je e-mail voor een inloglink.')
    setLoading(false)
  }

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else router.push('/')
    setLoading(false)
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-bold mb-2">Inloggen</h1>
      <p className="text-[#666] text-sm mb-8">
        Nieuw hier?{' '}
        <Link href="/registreren" className="underline">Maak een account aan</Link>
      </p>

      {message ? (
        <div className="bg-[#CDFF00] text-[#0D0D0D] rounded-xl px-4 py-3 text-sm font-medium">{message}</div>
      ) : (
        <>
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode('magic')}
              className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${mode === 'magic' ? 'bg-[#0D0D0D] text-[#F5F5EF] border-[#0D0D0D]' : 'border-[#ddd]'}`}
            >
              Magic link
            </button>
            <button
              onClick={() => setMode('password')}
              className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${mode === 'password' ? 'bg-[#0D0D0D] text-[#F5F5EF] border-[#0D0D0D]' : 'border-[#ddd]'}`}
            >
              Wachtwoord
            </button>
          </div>

          <form onSubmit={mode === 'magic' ? handleMagicLink : handlePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">E-mailadres</label>
              <input
                id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full border border-[#ddd] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0D0D0D]"
              />
            </div>
            {mode === 'password' && (
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="password">Wachtwoord</label>
                <input
                  id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full border border-[#ddd] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0D0D0D]"
                />
              </div>
            )}
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <Button type="submit" size="lg" className="w-full" loading={loading}>
              {mode === 'magic' ? 'Stuur magic link' : 'Inloggen'}
            </Button>
          </form>
        </>
      )}
      <div className="mt-6 text-center">
        <Link href="/demo" className="text-sm text-[#666] hover:underline">
          Demo-toegang
        </Link>
      </div>
    </div>
  )
}
