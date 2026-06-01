import type { Metadata } from 'next'
import './globals.css'
import PageViewTracker from '@/components/shop/PageViewTracker'
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  title: {
    default: 'ModeScout — Ontdek onafhankelijke Nederlandse mode',
    template: '%s | ModeScout',
  },
  description: 'Ontdek en koop kleding van onafhankelijke Nederlandse modemerken. Één mandje, meerdere merken, veilig betalen met iDEAL.',
  openGraph: {
    siteName: 'ModeScout',
    locale: 'nl_NL',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <PageViewTracker />
        <Analytics />
      </body>
    </html>
  )
}
