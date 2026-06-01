'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem { href: string; label: string }

export default function MobileDashboardNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F0F0EA] border-t border-[#E0E0DA] flex overflow-x-auto">
      {items.map(item => {
        const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 min-w-0 py-3 text-center text-xs font-medium whitespace-nowrap px-2 transition-colors ${
              active ? 'text-[#0D0D0D] border-t-2 border-[#0D0D0D] -mt-px' : 'text-[#666]'
            }`}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
