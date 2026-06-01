export const dynamic = 'force-dynamic'
import { createServiceClient } from '@/lib/supabase/server'

export default async function AdminAnalyticsPage() {
  const supabase = await createServiceClient()

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const last7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const last30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const [
    { count: totalViews },
    { count: todayViews },
    { count: weekViews },
    { data: rawViews },
    { data: recentViews },
  ] = await Promise.all([
    supabase.from('page_views').select('id', { count: 'exact', head: true }),
    supabase.from('page_views').select('id', { count: 'exact', head: true }).gte('created_at', today),
    supabase.from('page_views').select('id', { count: 'exact', head: true }).gte('created_at', last7),
    supabase.from('page_views').select('path, country, city').gte('created_at', last30),
    supabase.from('page_views').select('path, country, city, created_at').order('created_at', { ascending: false }).limit(20),
  ])

  const pageCounts: Record<string, number> = {}
  const countryCounts: Record<string, number> = {}
  const cityCounts: Record<string, number> = {}

  for (const v of rawViews ?? []) {
    pageCounts[v.path] = (pageCounts[v.path] ?? 0) + 1
    if (v.country) countryCounts[v.country] = (countryCounts[v.country] ?? 0) + 1
    if (v.city) cityCounts[v.city] = (cityCounts[v.city] ?? 0) + 1
  }

  const sortedPages = Object.entries(pageCounts).sort((a, b) => b[1] - a[1]).slice(0, 10)
  const sortedCountries = Object.entries(countryCounts).sort((a, b) => b[1] - a[1]).slice(0, 8)
  const sortedCities = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]).slice(0, 8)
  const maxPageViews = sortedPages[0]?.[1] ?? 1

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-1">Analytics</h1>
        <p className="text-sm text-[#666]">Paginabezoeken — eigen tracker + Vercel Analytics</p>
      </div>

      <div className="grid grid-cols-3 gap-3 md:gap-4">
        <div className="bg-white border border-[#E0E0DA] rounded-2xl p-4">
          <p className="text-xs text-[#666] mb-1">Totaal views</p>
          <p className="text-3xl font-bold">{(totalViews ?? 0).toLocaleString('nl-NL')}</p>
        </div>
        <div className="bg-white border border-[#E0E0DA] rounded-2xl p-4">
          <p className="text-xs text-[#666] mb-1">Vandaag</p>
          <p className="text-3xl font-bold">{(todayViews ?? 0).toLocaleString('nl-NL')}</p>
        </div>
        <div className="bg-white border border-[#E0E0DA] rounded-2xl p-4">
          <p className="text-xs text-[#666] mb-1">Afgelopen 7 dagen</p>
          <p className="text-3xl font-bold">{(weekViews ?? 0).toLocaleString('nl-NL')}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-[#E0E0DA] rounded-2xl p-5">
          <h2 className="font-semibold mb-4">Meest bezochte pagina's (30d)</h2>
          {sortedPages.length === 0 ? (
            <p className="text-sm text-[#999]">Nog geen data. Voer migrations/002_analytics.sql uit in Supabase.</p>
          ) : (
            <div className="space-y-3">
              {sortedPages.map(([path, count]) => (
                <div key={path}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#555] font-mono text-xs truncate max-w-[200px]">{path}</span>
                    <span className="font-semibold shrink-0 ml-2">{count}</span>
                  </div>
                  <div className="h-1.5 bg-[#F0F0EA] rounded-full overflow-hidden">
                    <div className="h-full bg-[#CDFF00] rounded-full" style={{ width: `${Math.round((count / maxPageViews) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-[#E0E0DA] rounded-2xl p-5">
            <h2 className="font-semibold mb-3">Landen (30d)</h2>
            {sortedCountries.length === 0 ? (
              <p className="text-sm text-[#999]">Geen locatiedata. Op Vercel worden landen automatisch herkend.</p>
            ) : (
              <div className="space-y-2">
                {sortedCountries.map(([country, count]) => (
                  <div key={country} className="flex justify-between text-sm">
                    <span className="text-[#555]">{COUNTRY_NAMES[country] ?? country}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {sortedCities.length > 0 && (
            <div className="bg-white border border-[#E0E0DA] rounded-2xl p-5">
              <h2 className="font-semibold mb-3">Steden (30d)</h2>
              <div className="space-y-2">
                {sortedCities.map(([city, count]) => (
                  <div key={city} className="flex justify-between text-sm">
                    <span className="text-[#555]">{city}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-[#E0E0DA] rounded-2xl p-5">
        <h2 className="font-semibold mb-4">Recente bezoeken</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-[#999] border-b border-[#F0F0EA]">
                <th className="pb-2 font-medium">Pagina</th>
                <th className="pb-2 font-medium">Land</th>
                <th className="pb-2 font-medium">Stad</th>
                <th className="pb-2 font-medium">Tijdstip</th>
              </tr>
            </thead>
            <tbody>
              {(recentViews ?? []).map((v, i) => (
                <tr key={i} className="border-b border-[#F8F8F4] last:border-0">
                  <td className="py-2 font-mono text-xs text-[#555]">{v.path}</td>
                  <td className="py-2 text-[#666]">{v.country ? (COUNTRY_NAMES[v.country] ?? v.country) : '—'}</td>
                  <td className="py-2 text-[#666]">{v.city ?? '—'}</td>
                  <td className="py-2 text-[#999] text-xs whitespace-nowrap">
                    {new Date(v.created_at).toLocaleString('nl-NL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
              {!(recentViews ?? []).length && (
                <tr><td colSpan={4} className="py-8 text-center text-[#999] text-sm">Nog geen bezoekdata</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const COUNTRY_NAMES: Record<string, string> = {
  NL: 'Nederland', BE: 'België', DE: 'Duitsland', GB: 'Verenigd Koninkrijk',
  FR: 'Frankrijk', US: 'Verenigde Staten', ES: 'Spanje', IT: 'Italië',
}
