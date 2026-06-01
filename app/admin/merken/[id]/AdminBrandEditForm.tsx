'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import type { Brand } from '@/types'

export default function AdminBrandEditForm({ brand }: { brand: Brand }) {
  const router = useRouter()
  const supabase = createClient()

  const [form, setForm] = useState({
    name: brand.name,
    tagline: brand.tagline ?? '',
    story: brand.story ?? '',
    logo_url: brand.logo_url ?? '',
    legal_name: brand.legal_name ?? '',
    address: brand.address ?? '',
    kvk_number: brand.kvk_number ?? '',
    vat_number: brand.vat_number ?? '',
    commission_rate: String(Math.round((brand.commission_rate ?? 0.15) * 100)),
    status: brand.status,
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await supabase.from('brands').update({
      name: form.name,
      tagline: form.tagline || null,
      story: form.story || null,
      logo_url: form.logo_url || null,
      legal_name: form.legal_name || null,
      address: form.address || null,
      kvk_number: form.kvk_number || null,
      vat_number: form.vat_number || null,
      commission_rate: parseFloat(form.commission_rate) / 100,
      status: form.status,
    }).eq('id', brand.id)
    setSuccess(true)
    setLoading(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white border border-[#E0E0DA] rounded-2xl p-6">
      <h2 className="font-semibold">Merk bewerken</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium mb-1 text-[#666]">Merknaam</label>
          <input value={form.name} onChange={e => set('name', e.target.value)} required
            className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0D0D0D]" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1 text-[#666]">Status</label>
          <select value={form.status} onChange={e => set('status', e.target.value)}
            className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0D0D0D] bg-white">
            <option value="pending">Aangemeld (pending)</option>
            <option value="active">Actief</option>
            <option value="paused">Gepauzeerd</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1 text-[#666]">Tagline</label>
        <input value={form.tagline} onChange={e => set('tagline', e.target.value)}
          className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0D0D0D]" />
      </div>

      <div>
        <label className="block text-xs font-medium mb-1 text-[#666]">Merkverhaal</label>
        <textarea value={form.story} onChange={e => set('story', e.target.value)} rows={4}
          className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0D0D0D] resize-y" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium mb-1 text-[#666]">Logo-URL</label>
          <input value={form.logo_url} onChange={e => set('logo_url', e.target.value)}
            className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0D0D0D]" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1 text-[#666]">Commissie (%)</label>
          <input type="number" min="0" max="50" value={form.commission_rate} onChange={e => set('commission_rate', e.target.value)}
            className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0D0D0D]" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium mb-1 text-[#666]">KvK-nummer</label>
          <input value={form.kvk_number} onChange={e => set('kvk_number', e.target.value)}
            className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0D0D0D]" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1 text-[#666]">BTW-nummer</label>
          <input value={form.vat_number} onChange={e => set('vat_number', e.target.value)}
            className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0D0D0D]" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium mb-1 text-[#666]">Juridische naam</label>
          <input value={form.legal_name} onChange={e => set('legal_name', e.target.value)}
            className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0D0D0D]" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1 text-[#666]">Adres</label>
          <input value={form.address} onChange={e => set('address', e.target.value)}
            className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0D0D0D]" />
        </div>
      </div>

      {success && <p className="text-green-700 text-sm bg-green-50 rounded-lg px-3 py-2">Opgeslagen!</p>}

      <Button type="submit" loading={loading}>Opslaan</Button>
    </form>
  )
}
