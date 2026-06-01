'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Compass, ShoppingBag, Heart, User } from 'lucide-react'
import { useCart } from './CartProvider'

const TABS = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/zoeken', icon: Compass, label: 'Ontdek' },
  { href: '/mandje', icon: ShoppingBag, label: 'Mandje', isCart: true },
  { href: '/bestellingen', icon: Heart, label: 'Orders' },
  { href: '/inloggen', icon: User, label: 'Account' },
]

export default function BottomNav() {
  const pathname = usePathname()
  const { itemCount } = useCart()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 safe-bottom"
      style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', borderTop: '1px solid var(--line)' }}>
      <div className="flex justify-around items-center px-2 pt-2.5 pb-1">
        {TABS.map(({ href, icon: Icon, label, isCart }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link key={href} href={href}
              className="flex flex-col items-center gap-1 flex-1 min-w-0 py-0.5 relative"
              style={{ color: active ? 'var(--orange)' : 'var(--ink3)' }}>
              <div className="relative">
                <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
                {isCart && itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--orange)', fontFamily: 'Nunito' }}>
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold truncate w-full text-center" style={{ fontFamily: 'Nunito' }}>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
