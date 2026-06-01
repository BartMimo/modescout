import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-auto" style={{ background: 'var(--ink)', color: '#fff' }}>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-3" style={{ fontFamily: 'Fredoka', fontWeight: 600, fontSize: 20 }}>
              Modescout<span style={{ color: 'var(--orange)' }}>.</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>
              Onafhankelijke Nederlandse mode op één plek.
            </p>
          </div>
          {[
            { title: 'Winkelen', links: [['Alle producten', '/zoeken'], ['Truien', '/categorie/truien'], ['Broeken', '/categorie/broeken'], ['Jassen', '/categorie/jassen']] },
            { title: 'Merken', links: [['Alle merken', '/zoeken?type=merken'], ['Verkopen', '/dashboard'], ['Account', '/registreren']] },
            { title: 'Account', links: [['Inloggen', '/inloggen'], ['Bestellingen', '/bestellingen']] },
          ].map(section => (
            <div key={section.title}>
              <h3 className="mb-3 text-sm" style={{ color: '#fff', fontFamily: 'Nunito', fontWeight: 800 }}>{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="text-sm transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 700 }}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-2 pt-6 text-xs" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>
          <span>© {new Date().getFullYear()} ModeScout</span>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded text-[10px] font-black" style={{ background: 'var(--orange)', color: '#fff' }}>iDEAL</span>
            <span>Veilig betalen via Stripe</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
