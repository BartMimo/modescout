export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BrandProfileForm from './BrandProfileForm'

export default async function DashboardMerkPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/inloggen')

  const { data: brand } = await supabase.from('brands').select('*').eq('owner_id', user.id).single()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">{brand ? 'Merkprofiel bewerken' : 'Merk aanmaken'}</h1>
      <BrandProfileForm brand={brand} userId={user.id} />
    </div>
  )
}
