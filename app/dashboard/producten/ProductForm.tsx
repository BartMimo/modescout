'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { Plus, Trash2 } from 'lucide-react'
import type { Product, ProductVariant } from '@/types'

const CATEGORIES = ['truien', 'broeken', 'jassen', 'hoodies', 'jurken', 'rokken', 'tops', 'accessoires']

interface VariantForm {
  id?: string
  size: string
  color: string
  sku: string
  stock_qty: number
  price_cents: string
}

interface Props {
  brandId: string
  product?: Product & { variants?: ProductVariant[] }
}

export default function ProductForm({ brandId, product }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const isEdit = !!product

  const [form, setForm] = useState({
    title: product?.title ?? '',
    description: product?.description ?? '',
    category: product?.category ?? '',
    base_price_cents: product ? String(product.base_price_cents / 100) : '',
    status: product?.status ?? 'draft' as 'draft' | 'published',
  })

  const [variants, setVariants] = useState<VariantForm[]>(
    product?.variants?.map(v => ({
      id: v.id,
      size: v.size ?? '',
      color: v.color ?? '',
      sku: v.sku ?? '',
      stock_qty: v.stock_qty,
      price_cents: v.price_cents ? String(v.price_cents / 100) : '',
    })) ?? [{ size: '', color: '', sku: '', stock_qty: 0, price_cents: '' }]
  )

  const [imageUrl, setImageUrl] = useState(product?.images?.[0]?.url ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function addVariant() {
    setVariants(v => [...v, { size: '', color: '', sku: '', stock_qty: 0, price_cents: '' }])
  }

  function removeVariant(index: number) {
    setVariants(v => v.filter((_, i) => i !== index))
  }

  function updateVariant(index: number, field: keyof VariantForm, value: string | number) {
    setVariants(v => v.map((item, i) => i === index ? { ...item, [field]: value } : item))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const priceCents = Math.round(parseFloat(form.base_price_cents) * 100)
    if (isNaN(priceCents) || priceCents <= 0) {
      setError('Voer een geldige prijs in')
      setLoading(false)
      return
    }

    let productId = product?.id

    if (isEdit && productId) {
      const { error: updateError } = await supabase.from('products').update({
        title: form.title,
        description: form.description || null,
        category: form.category || null,
        base_price_cents: priceCents,
        status: form.status,
      }).eq('id', productId)
      if (updateError) { setError(updateError.message); setLoading(false); return }
    } else {
      const { data, error: insertError } = await supabase.from('products').insert({
        brand_id: brandId,
        title: form.title,
        description: form.description || null,
        category: form.category || null,
        base_price_cents: priceCents,
        status: form.status,
      }).select().single()
      if (insertError) { setError(insertError.message); setLoading(false); return }
      productId = data.id
    }

    // Handle image
    if (imageUrl && productId) {
      if (isEdit) {
        await supabase.from('product_images').delete().eq('product_id', productId)
      }
      await supabase.from('product_images').insert({ product_id: productId, url: imageUrl, position: 0 })
    }

    // Handle variants
    if (productId) {
      if (isEdit) {
        await supabase.from('product_variants').delete().eq('product_id', productId)
      }
      const variantsToInsert = variants
        .filter(v => v.size || v.color || v.stock_qty > 0)
        .map(v => ({
          product_id: productId!,
          size: v.size || null,
          color: v.color || null,
          sku: v.sku || null,
          stock_qty: Number(v.stock_qty),
          price_cents: v.price_cents ? Math.round(parseFloat(v.price_cents) * 100) : null,
        }))
      if (variantsToInsert.length) {
        await supabase.from('product_variants').insert(variantsToInsert)
      }
    }

    router.push('/dashboard/producten')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="title">Productnaam *</label>
        <input
          id="title" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          className="w-full border border-[#ddd] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0D0D0D]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="description">Omschrijving</label>
        <textarea
          id="description" rows={4} value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          className="w-full border border-[#ddd] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0D0D0D] resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="price">Basisprijs (€) *</label>
          <input
            id="price" required type="number" min="0.01" step="0.01" value={form.base_price_cents}
            onChange={e => setForm(f => ({ ...f, base_price_cents: e.target.value }))}
            className="w-full border border-[#ddd] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0D0D0D]"
            placeholder="29.99"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="category">Categorie</label>
          <select
            id="category" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            className="w-full border border-[#ddd] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0D0D0D] bg-white"
          >
            <option value="">Kies een categorie</option>
            {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="imageUrl">Foto-URL</label>
        <input
          id="imageUrl" type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)}
          className="w-full border border-[#ddd] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0D0D0D]"
          placeholder="https://..."
        />
        {imageUrl && (
          <img src={imageUrl} alt="Preview" className="mt-2 w-24 h-32 object-cover rounded-lg" />
        )}
      </div>

      {/* Variants */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Varianten (maten/kleuren)</h2>
          <button type="button" onClick={addVariant} className="text-sm flex items-center gap-1 text-[#666] hover:text-[#0D0D0D]">
            <Plus size={14} /> Variant toevoegen
          </button>
        </div>
        <div className="space-y-3">
          {variants.map((v, i) => (
            <div key={i} className="bg-[#F0F0EA] rounded-xl p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
              <input
                placeholder="Maat (bijv. S, M, L, XL)"
                value={v.size} onChange={e => updateVariant(i, 'size', e.target.value)}
                className="border border-[#ddd] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0D0D0D]"
              />
              <input
                placeholder="Kleur"
                value={v.color} onChange={e => updateVariant(i, 'color', e.target.value)}
                className="border border-[#ddd] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0D0D0D]"
              />
              <input
                placeholder="SKU"
                value={v.sku} onChange={e => updateVariant(i, 'sku', e.target.value)}
                className="border border-[#ddd] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0D0D0D]"
              />
              <input
                type="number" min="0" placeholder="Voorraad"
                value={v.stock_qty} onChange={e => updateVariant(i, 'stock_qty', parseInt(e.target.value) || 0)}
                className="border border-[#ddd] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0D0D0D]"
              />
              <input
                type="number" min="0" step="0.01" placeholder="Afwijkende prijs (€)"
                value={v.price_cents} onChange={e => updateVariant(i, 'price_cents', e.target.value)}
                className="border border-[#ddd] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0D0D0D]"
              />
              {variants.length > 1 && (
                <button type="button" onClick={() => removeVariant(i)} className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm">
                  <Trash2 size={14} /> Verwijder
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Status</label>
        <div className="flex gap-3">
          {(['draft', 'published'] as const).map(s => (
            <button
              key={s} type="button" onClick={() => setForm(f => ({ ...f, status: s }))}
              className={`px-4 py-2 rounded-lg border text-sm transition-colors ${form.status === s ? 'bg-[#0D0D0D] text-[#F5F5EF] border-[#0D0D0D]' : 'border-[#ddd]'}`}
            >
              {s === 'draft' ? 'Concept' : 'Gepubliceerd'}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" loading={loading}>{isEdit ? 'Opslaan' : 'Product aanmaken'}</Button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 border border-[#ddd] rounded-lg text-sm hover:border-[#0D0D0D] transition-colors"
        >
          Annuleren
        </button>
      </div>
    </form>
  )
}
