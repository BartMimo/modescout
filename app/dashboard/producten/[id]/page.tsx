export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import ProductForm from '../ProductForm'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/inloggen')

  const { data: brand } = await supabase.from('brands').select('id').eq('owner_id', user.id).single()
  if (!brand) redirect('/dashboard')

  const { data: product } = await supabase
    .from('products')
    .select('*, images:product_images(*), variants:product_variants(*)')
    .eq('id', id)
    .eq('brand_id', brand.id)
    .single()

  if (!product) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Product bewerken</h1>
      <ProductForm brandId={brand.id} product={product} />
    </div>
  )
}
