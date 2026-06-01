'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem { href: string; label: string }

export default function MobileAdminNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname()
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0D0D0D] border-t border-[#222] flex overflow-x-auto">
      {items.map(item => {
        const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
        return (
          <Link key={item.href} href={item.href}
            className={`flex-1 min-w-0 py-3 text-center text-xs font-medium whitespace-nowrap px-2 transition-colors ${
              active ? 'text-[#CDFF00] border-t-2 border-[#CDFF00] -mt-px' : 'text-[#666]'
            }`}>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
