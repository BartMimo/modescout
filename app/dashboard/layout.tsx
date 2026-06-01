import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import MobileDashboardNav from './MobileDashboardNav'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/inloggen')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'brand' && profile?.role !== 'admin') redirect('/')

  const navItems = [
    { href: '/dashboard', label: 'Overzicht' },
    { href: '/dashboard/producten', label: 'Producten' },
    { href: '/dashboard/orders', label: 'Bestellingen' },
    { href: '/dashboard/merk', label: 'Merkprofiel' },
    { href: '/dashboard/stripe-onboarding', label: 'Uitbetalingen' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5EF]">
      <header className="bg-[#0D0D0D] text-[#F5F5EF] px-4 h-14 flex items-center justify-between sticky top-0 z-40">
        <Link href="/" className="text-lg font-bold">
          Mode<span className="text-[#CDFF00]">Scout</span>
        </Link>
        <span className="text-xs text-[#999]">Merk-dashboard</span>
      </header>

      {/* Mobile tab bar */}
      <MobileDashboardNav items={navItems} />

      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <nav className="hidden md:flex flex-col w-56 bg-[#F0F0EA] border-r border-[#E0E0DA] p-4 gap-1 text-sm shrink-0">
          {navItems.map(item => (
            <Link key={item.href} href={item.href}
              className="px-3 py-2 rounded-lg hover:bg-[#E0E0DA] transition-colors">
              {item.label}
            </Link>
          ))}
          <div className="mt-auto pt-4 border-t border-[#E0E0DA]">
            <Link href="/" className="px-3 py-2 rounded-lg hover:bg-[#E0E0DA] transition-colors text-[#666] block">← Terug naar winkel</Link>
          </div>
        </nav>
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">{children}</main>
      </div>
    </div>
  )
}
