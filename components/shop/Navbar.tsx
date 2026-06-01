'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ShoppingBag, Search, Bell, MapPin } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useCart } from './CartProvider'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface NavUser { email: string; role?: string }

export default function Navbar() {
  const [navUser, setNavUser] = useState<NavUser | null>(null)
  const { itemCount } = useCart()
  const supabase = createClient()

  async function loadUser(u: SupabaseUser) {
    const { data } = await supabase.from('profiles').select('role').eq('id', u.id).single()
    setNavUser({ email: u.email ?? '', role: data?.role ?? undefined })
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (data.user) loadUser(data.user) })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) loadUser(session.user)
      else setNavUser(null)
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <header className="sticky top-0 z-50" style={{ background: 'var(--cream)', borderBottom: '1px solid var(--line)' }}>
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        {/* Logo */}
        <Link href="/" className="shrink-0" style={{ fontFamily: 'Fredoka', fontWeight: 600, fontSize: 21, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
          Modescout<span style={{ color: 'var(--orange)' }}>.</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {[['/', 'Home'], ['/zoeken', 'Ontdek'], ['/categorie/truien', 'Truien'], ['/categorie/broeken', 'Broeken'], ['/categorie/jassen', 'Jassen']].map(([href, label]) => (
            <Link key={href} href={href}
              className="px-3 py-2 rounded-full text-sm transition-colors hover:bg-white"
              style={{ fontWeight: 700, color: 'var(--ink2)' }}>
              {label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link href="/zoeken" className="p-2 rounded-full transition-colors hover:bg-white" style={{ color: 'var(--ink2)' }} aria-label="Zoeken">
            <Search size={20} />
          </Link>

          <Link href="/mandje" className="relative p-2 rounded-full transition-colors hover:bg-white" style={{ color: 'var(--ink2)' }} aria-label="Mandje">
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-[var(--cream)]"
                style={{ background: 'var(--orange)', fontFamily: 'Nunito' }}>
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>

          {navUser ? (
            <div className="relative group">
              <button className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black transition-colors hover:bg-white"
                style={{ background: 'var(--orange-t)', color: 'var(--orange-d)', fontFamily: 'Fredoka' }}>
                {navUser.email[0].toUpperCase()}
              </button>
              <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl shadow-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all text-sm"
                style={{ background: 'var(--paper)', border: '1px solid var(--line)' }}>
                <div className="px-4 py-3 text-xs border-b truncate" style={{ color: 'var(--ink2)', borderColor: 'var(--line)', background: 'var(--cream)' }}>{navUser.email}</div>
                <div className="p-1.5 space-y-0.5">
                  <Link href="/bestellingen" className="block px-3 py-2 rounded-xl transition-colors hover:bg-[var(--cream)]" style={{ fontWeight: 700, color: 'var(--ink)' }}>Mijn bestellingen</Link>
                  {(navUser.role === 'brand' || navUser.role === 'admin') && (
                    <Link href="/dashboard" className="block px-3 py-2 rounded-xl transition-colors hover:bg-[var(--cream)]" style={{ fontWeight: 700, color: 'var(--ink)' }}>Dashboard</Link>
                  )}
                  {navUser.role === 'admin' && (
                    <Link href="/admin" className="block px-3 py-2 rounded-xl transition-colors hover:bg-[var(--cream)]" style={{ fontWeight: 700, color: 'var(--ink)' }}>Admin</Link>
                  )}
                  <button onClick={() => supabase.auth.signOut()}
                    className="w-full text-left block px-3 py-2 rounded-xl transition-colors hover:bg-red-50"
                    style={{ fontWeight: 700, color: 'var(--ink2)', borderTop: '1px solid var(--line)', marginTop: 4, paddingTop: 8 }}>
                    Uitloggen
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link href="/inloggen"
              className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all hover:opacity-90"
              style={{ background: 'var(--orange)', color: '#fff', fontFamily: 'Fredoka', fontWeight: 600 }}>
              Inloggen
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
