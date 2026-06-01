'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { slugify } from '@/lib/utils'
import type { Brand } from '@/types'

export default function BrandProfileForm({ brand, userId }: { brand: Brand | null; userId: string }) {
  const router = useRouter()
  const supabase = createClient()
  const isEdit = !!brand

  const [form, setForm] = useState({
    name: brand?.name ?? '',
    tagline: brand?.tagline ?? '',
    story: brand?.story ?? '',
    logo_url: brand?.logo_url ?? '',
    legal_name: brand?.legal_name ?? '',
    address: brand?.address ?? '',
    kvk_number: brand?.kvk_number ?? '',
    vat_number: brand?.vat_number ?? '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const slug = isEdit ? brand!.slug : slugify(form.name)

    if (isEdit) {
      const { error } = await supabase.from('brands').update({
        name: form.name,
        tagline: form.tagline || null,
        story: form.story || null,
        logo_url: form.logo_url || null,
        legal_name: form.legal_name || null,
        address: form.address || null,
        kvk_number: form.kvk_number || null,
        vat_number: form.vat_number || null,
      }).eq('id', brand!.id)
      if (error) { setError(error.message); setLoading(false); return }
    } else {
      const { error } = await supabase.from('brands').insert({
        owner_id: userId,
        name: form.name,
        slug,
        tagline: form.tagline || null,
        story: form.story || null,
        logo_url: form.logo_url || null,
        legal_name: form.legal_name || null,
        address: form.address || null,
        kvk_number: form.kvk_number || null,
        vat_number: form.vat_number || null,
        status: 'pending',
      })
      if (error) { setError(error.message); setLoading(false); return }
      // Update role to brand
      await supabase.from('profiles').update({ role: 'brand' }).eq('id', userId)
    }

    setSuccess(true)
    setLoading(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <section>
        <h2 className="font-semibold text-sm uppercase tracking-wide text-[#666] mb-4">Merkidentiteit</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Merknaam *</label>
            <input required value={form.name} onChange={e => set('name', e.target.value)}
              className="w-full border border-[#ddd] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0D0D0D]" />
            {!isEdit && form.name && (
              <p className="text-xs text-[#999] mt-1">URL: /merk/{slugify(form.name)}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tagline</label>
            <input value={form.tagline} onChange={e => set('tagline', e.target.value)} maxLength={100}
              placeholder="Minimalistische mode vanuit Amsterdam"
              className="w-full border border-[#ddd] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0D0D0D]" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Merkverhaal</label>
            <textarea value={form.story} onChange={e => set('story', e.target.value)} rows={5}
              placeholder="Vertel je verhaal — wie ben je, wat drijft je, hoe werkt je merk?"
              className="w-full border border-[#ddd] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0D0D0D] resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Logo-URL</label>
            <input type="url" value={form.logo_url} onChange={e => set('logo_url', e.target.value)}
              placeholder="https://..."
              className="w-full border border-[#ddd] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0D0D0D]" />
            {form.logo_url && (
              <img src={form.logo_url} alt="Logo preview" className="mt-2 w-16 h-16 rounded-full object-cover border" />
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-[#E0E0DA] pt-6">
        <h2 className="font-semibold text-sm uppercase tracking-wide text-[#666] mb-4">Juridische gegevens (DAC7)</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Juridische naam</label>
              <input value={form.legal_name} onChange={e => set('legal_name', e.target.value)}
                className="w-full border border-[#ddd] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0D0D0D]" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">KvK-nummer</label>
              <input value={form.kvk_number} onChange={e => set('kvk_number', e.target.value)}
                className="w-full border border-[#ddd] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0D0D0D]" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">BTW-nummer</label>
              <input value={form.vat_number} onChange={e => set('vat_number', e.target.value)}
                className="w-full border border-[#ddd] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0D0D0D]" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Adres</label>
            <input value={form.address} onChange={e => set('address', e.target.value)}
              placeholder="Straat 1, 1234 AB Amsterdam"
              className="w-full border border-[#ddd] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0D0D0D]" />
          </div>
        </div>
      </section>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && (
        <div className="bg-[#CDFF00] text-[#0D0D0D] rounded-xl px-4 py-3 text-sm font-medium">
          {isEdit ? 'Merkprofiel opgeslagen!' : 'Merk aangemeld! Je kunt nu producten toevoegen. De admin keurt je merk goed.'}
        </div>
      )}

      <Button type="submit" loading={loading}>{isEdit ? 'Opslaan' : 'Merk aanmelden'}</Button>
    </form>
  )
}
