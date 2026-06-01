'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ShoppingBag, Menu, X, Search, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useCart } from './CartProvider'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface NavUser { email: string; role?: string }

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [navUser, setNavUser] = useState<NavUser | null>(null)
  const { itemCount } = useCart()
  const supabase = createClient()

  async function loadUser(u: SupabaseUser) {
    const { data } = await supabase.from('profiles').select('role').eq('id', u.id).single()
    setNavUser({ email: u.email ?? '', role: data?.role ?? undefined })
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) loadUser(data.user)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) loadUser(session.user)
      else setNavUser(null)
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#F2F2F2]">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="font-black text-xl tracking-tight shrink-0">
          Mode<span className="bg-[#CDFF00] px-1 rounded">Scout</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          {[
            { href: '/zoeken', label: 'Ontdekken' },
            { href: '/categorie/truien', label: 'Truien' },
            { href: '/categorie/broeken', label: 'Broeken' },
            { href: '/categorie/jassen', label: 'Jassen' },
            { href: '/categorie/hoodies', label: 'Hoodies' },
          ].map(item => (
            <Link key={item.href} href={item.href}
              className="px-3 py-2 rounded-full hover:bg-[#F2F2F2] transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Link href="/zoeken" className="p-2 rounded-full hover:bg-[#F2F2F2] transition-colors" aria-label="Zoeken">
            <Search size={20} />
          </Link>

          {navUser ? (
            <div className="relative group">
              <button className="p-2 rounded-full hover:bg-[#F2F2F2] transition-colors" aria-label="Account">
                <User size={20} />
              </button>
              <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-[#F2F2F2] rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all text-sm overflow-hidden">
                <div className="px-4 py-3 text-[#999] text-xs border-b border-[#F2F2F2] truncate bg-[#FAFAF7]">{navUser.email}</div>
                <div className="p-1.5 space-y-0.5">
                  <Link href="/bestellingen" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#F2F2F2] transition-colors">Mijn bestellingen</Link>
                  {(navUser.role === 'brand' || navUser.role === 'admin') && (
                    <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#F2F2F2] transition-colors">Dashboard</Link>
                  )}
                  {navUser.role === 'admin' && (
                    <Link href="/admin" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#F2F2F2] transition-colors">Admin</Link>
                  )}
                  <button
                    onClick={() => supabase.auth.signOut()}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors mt-1 border-t border-[#F2F2F2] pt-2"
                  >
                    Uitloggen
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link href="/inloggen" className="p-2 rounded-full hover:bg-[#F2F2F2] transition-colors" aria-label="Inloggen">
              <User size={20} />
            </Link>
          )}

          <Link href="/mandje" className="relative p-2 rounded-full hover:bg-[#F2F2F2] transition-colors" aria-label="Mandje">
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#CDFF00] text-[#0D0D0D] text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>

          <button className="md:hidden p-2 rounded-full hover:bg-[#F2F2F2] transition-colors" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-[#F2F2F2] px-4 py-4 space-y-1">
          {[
            { href: '/zoeken', label: '🔍 Ontdekken' },
            { href: '/categorie/truien', label: '🧶 Truien' },
            { href: '/categorie/broeken', label: '👖 Broeken' },
            { href: '/categorie/jassen', label: '🧥 Jassen' },
            { href: '/categorie/hoodies', label: '👕 Hoodies' },
          ].map(item => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-[#F2F2F2] font-medium text-sm transition-colors">
              {item.label}
            </Link>
          ))}
          <div className="border-t border-[#F2F2F2] pt-2 mt-2">
            {!navUser && <Link href="/inloggen" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-[#F2F2F2] font-medium text-sm">Inloggen / Registreren</Link>}
            {navUser && <Link href="/bestellingen" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-[#F2F2F2] font-medium text-sm">Mijn bestellingen</Link>}
            {(navUser?.role === 'brand' || navUser?.role === 'admin') && (
              <Link href="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-[#F2F2F2] font-medium text-sm">Dashboard</Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
