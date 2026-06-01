'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function FeaturedToggle({ brandId, featured }: { brandId: string; featured: boolean }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function toggle() {
    setLoading(true)
    await supabase.from('brands').update({ featured: !featured }).eq('id', brandId)
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`text-xs px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 ${
        featured
          ? 'bg-[#CDFF00] text-[#0D0D0D] hover:bg-[#b8e600]'
          : 'border border-[#ddd] hover:border-[#0D0D0D]'
      }`}
    >
      {featured ? '★ Uitgelicht' : '☆ Uitlichten'}
    </button>
  )
}
