import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#0D0D0D] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="font-black text-xl mb-3">
              Mode<span className="bg-[#CDFF00] text-[#0D0D0D] px-1 rounded">Scout</span>
            </div>
            <p className="text-sm text-[#999] leading-relaxed max-w-xs">
              Onafhankelijke Nederlandse modemerken op één plek. Gecureerd, eerlijk, lokaal.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-sm">Winkelen</h3>
            <ul className="space-y-2.5 text-sm text-[#999]">
              <li><Link href="/zoeken" className="hover:text-[#CDFF00] transition-colors">Alle producten</Link></li>
              <li><Link href="/categorie/truien" className="hover:text-[#CDFF00] transition-colors">Truien</Link></li>
              <li><Link href="/categorie/broeken" className="hover:text-[#CDFF00] transition-colors">Broeken</Link></li>
              <li><Link href="/categorie/jassen" className="hover:text-[#CDFF00] transition-colors">Jassen</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-sm">Merken</h3>
            <ul className="space-y-2.5 text-sm text-[#999]">
              <li><Link href="/zoeken?type=merken" className="hover:text-[#CDFF00] transition-colors">Alle merken</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#CDFF00] transition-colors">Verkopen op ModeScout</Link></li>
              <li><Link href="/registreren" className="hover:text-[#CDFF00] transition-colors">Account aanmaken</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-sm">Account</h3>
            <ul className="space-y-2.5 text-sm text-[#999]">
              <li><Link href="/inloggen" className="hover:text-[#CDFF00] transition-colors">Inloggen</Link></li>
              <li><Link href="/bestellingen" className="hover:text-[#CDFF00] transition-colors">Mijn bestellingen</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#222] pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-[#555]">
          <span>© {new Date().getFullYear()} ModeScout. Alle rechten voorbehouden.</span>
          <div className="flex items-center gap-3">
            <span className="bg-[#CDFF00] text-[#0D0D0D] font-bold px-2 py-0.5 rounded text-[10px]">iDEAL</span>
            <span>Powered by Stripe</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
