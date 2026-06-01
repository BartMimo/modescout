import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#0D0D0D] text-[#F5F5EF] mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="text-xl font-bold mb-3">
              Mode<span className="text-[#CDFF00]">Scout</span>
            </div>
            <p className="text-sm text-[#999] leading-relaxed">
              Ontdek onafhankelijke Nederlandse modemerken op één plek.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide">Winkelen</h3>
            <ul className="space-y-2 text-sm text-[#999]">
              <li><Link href="/zoeken" className="hover:text-[#CDFF00] transition-colors">Alle producten</Link></li>
              <li><Link href="/categorie/truien" className="hover:text-[#CDFF00] transition-colors">Truien</Link></li>
              <li><Link href="/categorie/broeken" className="hover:text-[#CDFF00] transition-colors">Broeken</Link></li>
              <li><Link href="/categorie/jassen" className="hover:text-[#CDFF00] transition-colors">Jassen</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide">Merken</h3>
            <ul className="space-y-2 text-sm text-[#999]">
              <li><Link href="/zoeken?type=merken" className="hover:text-[#CDFF00] transition-colors">Alle merken</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#CDFF00] transition-colors">Verkopen op ModeScout</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide">Info</h3>
            <ul className="space-y-2 text-sm text-[#999]">
              <li><Link href="/inloggen" className="hover:text-[#CDFF00] transition-colors">Inloggen</Link></li>
              <li><Link href="/registreren" className="hover:text-[#CDFF00] transition-colors">Account aanmaken</Link></li>
              <li><Link href="/bestellingen" className="hover:text-[#CDFF00] transition-colors">Mijn bestellingen</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#222] mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-[#666]">
          <span>© {new Date().getFullYear()} ModeScout. Alle rechten voorbehouden.</span>
          <span>Betalen via iDEAL · Powered by Stripe</span>
        </div>
      </div>
    </footer>
  )
}
