export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProductForm from '../ProductForm'

export default async function NieuwProductPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/inloggen')

  const { data: brand } = await supabase.from('brands').select('id').eq('owner_id', user.id).single()
  if (!brand) redirect('/dashboard')

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Nieuw product</h1>
      <ProductForm brandId={brand.id} />
    </div>
  )
}
