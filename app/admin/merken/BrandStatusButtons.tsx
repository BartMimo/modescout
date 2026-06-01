'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { BrandStatus } from '@/types'

export default function BrandStatusButtons({ brandId, currentStatus }: { brandId: string; currentStatus: BrandStatus }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function updateStatus(status: BrandStatus) {
    setLoading(true)
    await supabase.from('brands').update({ status }).eq('id', brandId)
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="flex gap-2">
      {currentStatus !== 'active' && (
        <button
          onClick={() => updateStatus('active')}
          disabled={loading}
          className="text-xs px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          Goedkeuren
        </button>
      )}
      {currentStatus !== 'paused' && (
        <button
          onClick={() => updateStatus('paused')}
          disabled={loading}
          className="text-xs px-3 py-1.5 border border-[#ddd] rounded-lg hover:border-red-500 hover:text-red-500 transition-colors disabled:opacity-50"
        >
          Pauzeren
        </button>
      )}
      {currentStatus !== 'pending' && (
        <button
          onClick={() => updateStatus('pending')}
          disabled={loading}
          className="text-xs px-3 py-1.5 border border-[#ddd] rounded-lg hover:border-amber-500 hover:text-amber-500 transition-colors disabled:opacity-50"
        >
          Terug naar pending
        </button>
      )}
    </div>
  )
}
