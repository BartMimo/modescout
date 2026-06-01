'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function RegistrerenPage() {
  const [form, setForm] = useState({ email: '', password: '', name: '', role: 'buyer' as 'buyer' | 'brand' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.name },
        emailRedirectTo: `${window.location.origin}/`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Update role if brand
    if (data.user && form.role === 'brand') {
      await supabase.from('profiles').update({ role: 'brand', full_name: form.name }).eq('id', data.user.id)
    } else if (data.user) {
      await supabase.from('profiles').update({ full_name: form.name }).eq('id', data.user.id)
    }

    setMessage('Account aangemaakt! Controleer je e-mail om je account te bevestigen.')
    setLoading(false)
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-bold mb-2">Account aanmaken</h1>
      <p className="text-[#666] text-sm mb-8">
        Al een account?{' '}
        <Link href="/inloggen" className="underline">Inloggen</Link>
      </p>

      {message ? (
        <div className="bg-[#CDFF00] text-[#0D0D0D] rounded-xl px-4 py-3 text-sm font-medium">{message}</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Ik wil</label>
            <div className="flex gap-2">
              {(['buyer', 'brand'] as const).map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, role: r }))}
                  className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${form.role === r ? 'bg-[#0D0D0D] text-[#F5F5EF] border-[#0D0D0D]' : 'border-[#ddd]'}`}
                >
                  {r === 'buyer' ? 'Winkelen' : 'Verkopen als merk'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              {form.role === 'brand' ? 'Merknaam' : 'Naam'}
            </label>
            <input
              id="name" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full border border-[#ddd] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0D0D0D]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">E-mailadres</label>
            <input
              id="email" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full border border-[#ddd] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0D0D0D]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">Wachtwoord</label>
            <input
              id="password" type="password" required minLength={8} value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="w-full border border-[#ddd] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0D0D0D]"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <Button type="submit" size="lg" className="w-full" loading={loading}>
            Account aanmaken
          </Button>
        </form>
      )}
    </div>
  )
}
