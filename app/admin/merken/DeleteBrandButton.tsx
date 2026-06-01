'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function DeleteBrandButton({ brandId, brandName }: { brandId: string; brandName: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleDelete() {
    if (!confirm(`Merk "${brandName}" definitief verwijderen? Dit verwijdert ook alle producten en varianten.`)) return
    setLoading(true)
    await supabase.from('brands').delete().eq('id', brandId)
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-xs px-3 py-1.5 border border-[#ddd] rounded-lg hover:border-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
    >
      {loading ? '...' : 'Verwijderen'}
    </button>
  )
}
