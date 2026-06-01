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
    <header className="sticky top-0 z-50 bg-[#0D0D0D] text-[#F5F5EF]">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="text-lg font-bold tracking-tight shrink-0">
          Mode<span className="text-[#CDFF00]">Scout</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/zoeken" className="hover:text-[#CDFF00] transition-colors">Ontdekken</Link>
          <Link href="/categorie/truien" className="hover:text-[#CDFF00] transition-colors">Truien</Link>
          <Link href="/categorie/broeken" className="hover:text-[#CDFF00] transition-colors">Broeken</Link>
          <Link href="/categorie/jassen" className="hover:text-[#CDFF00] transition-colors">Jassen</Link>
          <Link href="/categorie/hoodies" className="hover:text-[#CDFF00] transition-colors">Hoodies</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/zoeken" className="p-2 hover:text-[#CDFF00] transition-colors" aria-label="Zoeken">
            <Search size={20} />
          </Link>

          {navUser ? (
            <div className="relative group">
              <button className="p-2 hover:text-[#CDFF00] transition-colors" aria-label="Account">
                <User size={20} />
              </button>
              <div className="absolute right-0 top-full mt-1 w-48 bg-[#0D0D0D] border border-[#333] rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all text-sm">
                <div className="px-4 py-2 text-[#999] text-xs border-b border-[#333] truncate">{navUser.email}</div>
                <Link href="/bestellingen" className="block px-4 py-2 hover:text-[#CDFF00] transition-colors">Mijn bestellingen</Link>
                {(navUser.role === 'brand' || navUser.role === 'admin') && (
                  <Link href="/dashboard" className="block px-4 py-2 hover:text-[#CDFF00] transition-colors">Dashboard</Link>
                )}
                {navUser.role === 'admin' && (
                  <Link href="/admin" className="block px-4 py-2 hover:text-[#CDFF00] transition-colors">Admin</Link>
                )}
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="w-full text-left px-4 py-2 hover:text-[#CDFF00] transition-colors border-t border-[#333]"
                >
                  Uitloggen
                </button>
              </div>
            </div>
          ) : (
            <Link href="/inloggen" className="p-2 hover:text-[#CDFF00] transition-colors" aria-label="Inloggen">
              <User size={20} />
            </Link>
          )}

          <Link href="/mandje" className="relative p-2 hover:text-[#CDFF00] transition-colors" aria-label="Mandje">
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#CDFF00] text-[#0D0D0D] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>

          <button className="md:hidden p-2 hover:text-[#CDFF00] transition-colors" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-[#222] px-4 py-4 flex flex-col gap-4 text-sm">
          <Link href="/zoeken" onClick={() => setOpen(false)} className="hover:text-[#CDFF00]">Ontdekken</Link>
          <Link href="/categorie/truien" onClick={() => setOpen(false)} className="hover:text-[#CDFF00]">Truien</Link>
          <Link href="/categorie/broeken" onClick={() => setOpen(false)} className="hover:text-[#CDFF00]">Broeken</Link>
          <Link href="/categorie/jassen" onClick={() => setOpen(false)} className="hover:text-[#CDFF00]">Jassen</Link>
          <Link href="/categorie/hoodies" onClick={() => setOpen(false)} className="hover:text-[#CDFF00]">Hoodies</Link>
          {!navUser && <Link href="/inloggen" onClick={() => setOpen(false)} className="hover:text-[#CDFF00]">Inloggen / Registreren</Link>}
          {navUser && <Link href="/bestellingen" onClick={() => setOpen(false)} className="hover:text-[#CDFF00]">Mijn bestellingen</Link>}
          {(navUser?.role === 'brand' || navUser?.role === 'admin') && (
            <Link href="/dashboard" onClick={() => setOpen(false)} className="hover:text-[#CDFF00]">Dashboard</Link>
          )}
        </nav>
      )}
    </header>
  )
}
