'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Sun } from 'lucide-react'

export default function InloggenPage() {
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else router.push('/')
    setLoading(false)
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(null)
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })
    if (error) setError(error.message)
    else setMessage('Account aangemaakt! Controleer je e-mail.')
    setLoading(false)
  }

  const INPUT = "flex items-center gap-3 rounded-2xl px-4 py-3.5 w-full border text-sm"

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header met gradient */}
      <div className="relative overflow-hidden py-12 px-6" style={{ background: 'linear-gradient(135deg,#FFD06B,#FB6A2E)', minHeight: 200 }}>
        <div className="absolute right-[-26px] top-[-30px] w-32 h-32 rounded-full" style={{ background: 'rgba(255,255,255,0.18)' }} />
        <div className="absolute left-[-20px] bottom-[-34px] w-24 h-24 rounded-full" style={{ background: 'rgba(255,255,255,0.14)' }} />
        <div className="absolute top-4 right-5"><Sun size={30} color="#fff" fill="#fff" /></div>
        <div className="relative">
          <div style={{ fontFamily: 'Fredoka', fontWeight: 600, fontSize: 24, color: '#fff' }}>Modescout.</div>
          <p className="mt-2 text-base font-semibold" style={{ color: 'rgba(255,255,255,0.96)', fontFamily: 'Fredoka' }}>Jouw zomergarderobe begint hier</p>
        </div>
      </div>

      <div className="flex-1 px-5 pt-6 pb-10 max-w-sm w-full mx-auto">
        {message ? (
          <div className="rounded-2xl p-4 text-sm font-bold text-center" style={{ background: 'var(--teal-t)', color: '#0c7a6e' }}>{message}</div>
        ) : (
          <>
            {/* Segmented control */}
            <div className="flex rounded-2xl p-1 mb-6" style={{ background: 'var(--cream2)' }}>
              {(['login', 'register'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className="flex-1 py-2.5 rounded-xl text-sm transition-all"
                  style={{
                    fontFamily: 'Fredoka', fontWeight: 600, fontSize: 15,
                    background: tab === t ? 'var(--paper)' : 'transparent',
                    color: tab === t ? 'var(--ink)' : 'var(--ink2)',
                    boxShadow: tab === t ? 'var(--shadow-sm)' : 'none',
                  }}>
                  {t === 'login' ? 'Inloggen' : 'Registreren'}
                </button>
              ))}
            </div>

            <form onSubmit={tab === 'login' ? handleLogin : handleRegister} className="space-y-4">
              {tab === 'register' && (
                <div>
                  <label className="block text-xs font-black mb-1.5 uppercase tracking-wide" style={{ color: 'var(--ink2)' }}>Naam</label>
                  <input value={name} onChange={e => setName(e.target.value)} required placeholder="Jouw naam"
                    className={INPUT} style={{ background: 'var(--paper)', borderColor: 'var(--line2)', color: 'var(--ink)', fontFamily: 'Nunito', fontWeight: 600 }} />
                </div>
              )}
              <div>
                <label className="block text-xs font-black mb-1.5 uppercase tracking-wide" style={{ color: 'var(--ink2)' }}>E-mailadres</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="jij@email.nl"
                  className={INPUT} style={{ background: 'var(--paper)', borderColor: 'var(--line2)', color: 'var(--ink)', fontFamily: 'Nunito', fontWeight: 600 }} />
              </div>
              <div>
                <label className="block text-xs font-black mb-1.5 uppercase tracking-wide" style={{ color: 'var(--ink2)' }}>Wachtwoord</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8}
                  className={INPUT} style={{ background: 'var(--paper)', borderColor: 'var(--line2)', color: 'var(--ink)', fontFamily: 'Nunito', fontWeight: 600 }} />
              </div>

              {error && <p className="text-sm font-bold rounded-xl px-3 py-2" style={{ color: '#c0392b', background: '#fdecea' }}>{error}</p>}

              <button type="submit" disabled={loading}
                className="w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 transition-opacity disabled:opacity-60"
                style={{ background: 'var(--orange)', fontFamily: 'Fredoka', fontWeight: 600, boxShadow: 'var(--shadow-warm)' }}>
                {loading ? 'Even wachten…' : tab === 'login' ? 'Inloggen' : 'Account aanmaken'}
              </button>
            </form>

            <p className="text-xs text-center mt-6 font-bold" style={{ color: 'var(--ink2)' }}>
              <Link href="/demo" className="hover:underline" style={{ color: 'var(--orange)' }}>Demo-toegang</Link>
              {' · '}
              <Link href="/" className="hover:underline">Terug naar home</Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
