'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function MarkShippedButton({ itemId }: { itemId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleMark() {
    setLoading(true)
    await supabase.from('order_items').update({ fulfillment_status: 'shipped' }).eq('id', itemId)
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={handleMark}
      disabled={loading}
      className="text-sm px-3 py-1.5 bg-[#0D0D0D] text-[#F5F5EF] rounded-lg hover:bg-[#222] transition-colors disabled:opacity-50"
    >
      {loading ? '...' : 'Markeer als verzonden'}
    </button>
  )
}
