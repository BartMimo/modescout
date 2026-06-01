export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import BrandStatusButtons from './BrandStatusButtons'
import FeaturedToggle from './FeaturedToggle'
import DeleteBrandButton from './DeleteBrandButton'
import Link from 'next/link'
import type { Brand } from '@/types'

export default async function AdminMerkenPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>
}) {
  const { status, q } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('brands')
    .select('*, products:products(count)')
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)
  if (q) query = query.ilike('name', `%${q}%`)

  const { data: brands } = await query

  const counts = await Promise.all([
    supabase.from('brands').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('brands').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('brands').select('id', { count: 'exact', head: true }).eq('status', 'paused'),
  ])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Merken</h1>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { label: `Alle`, value: undefined },
          { label: `Aangemeld (${counts[0].count ?? 0})`, value: 'pending' },
          { label: `Actief (${counts[1].count ?? 0})`, value: 'active' },
          { label: `Gepauzeerd (${counts[2].count ?? 0})`, value: 'paused' },
        ].map(tab => (
          <Link
            key={tab.value ?? 'all'}
            href={tab.value ? `/admin/merken?status=${tab.value}` : '/admin/merken'}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
              status === tab.value || (!status && !tab.value)
                ? 'bg-[#0D0D0D] text-[#F5F5EF]'
                : 'border border-[#ddd] hover:border-[#0D0D0D]'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Search */}
      <form className="mb-6">
        <input
          name="q" defaultValue={q} placeholder="Zoek merk..."
          className="border border-[#ddd] rounded-xl px-4 py-2.5 text-sm w-full max-w-xs focus:outline-none focus:border-[#0D0D0D] bg-white"
        />
      </form>

      <div className="space-y-3">
        {!brands?.length && <p className="text-[#666] text-center py-12">Geen merken gevonden.</p>}
        {brands?.map((brand: Brand & { products?: { count: number }[] }) => (
          <div key={brand.id} className="bg-white border border-[#E0E0DA] rounded-2xl p-5">
            <div className="flex items-start gap-4">
              {/* Logo */}
              <div className="w-12 h-12 rounded-full bg-[#E8E8E2] overflow-hidden shrink-0 flex items-center justify-center text-lg font-bold text-[#666]">
                {brand.logo_url
                  ? <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-cover" />
                  : brand.name[0]}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <h2 className="font-semibold">{brand.name}</h2>
                    <p className="text-sm text-[#666] truncate max-w-xs">{brand.tagline}</p>
                  </div>
                  {/* Status badge */}
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${
                    brand.status === 'active' ? 'bg-green-100 text-green-700'
                    : brand.status === 'pending' ? 'bg-amber-100 text-amber-700'
                    : 'bg-red-100 text-red-700'
                  }`}>
                    {brand.status === 'active' ? 'Actief' : brand.status === 'pending' ? 'Aangemeld' : 'Gepauzeerd'}
                  </span>
                </div>

                {/* Meta info */}
                <div className="flex flex-wrap gap-3 mt-2 text-xs text-[#999]">
                  {brand.legal_name && <span>{brand.legal_name}</span>}
                  {brand.kvk_number && <span>KvK: {brand.kvk_number}</span>}
                  {brand.charges_enabled && <span className="text-green-600 font-medium">Stripe actief</span>}
                  {brand.featured && <span className="text-[#0D0D0D] font-semibold">Uitgelicht</span>}
                  <span>{new Date(brand.created_at).toLocaleDateString('nl-NL')}</span>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <Link
                    href={`/admin/merken/${brand.id}`}
                    className="text-xs px-3 py-1.5 border border-[#ddd] rounded-lg hover:border-[#0D0D0D] transition-colors"
                  >
                    Bewerken
                  </Link>
                  <FeaturedToggle brandId={brand.id} featured={brand.featured} />
                  <BrandStatusButtons brandId={brand.id} currentStatus={brand.status} />
                  <DeleteBrandButton brandId={brand.id} brandName={brand.name} />
                </div>
              </div>
            </div>

            {/* Brand story preview */}
            {brand.story && (
              <p className="text-xs text-[#999] mt-3 line-clamp-2 border-t border-[#F0F0EA] pt-3">
                {brand.story}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
