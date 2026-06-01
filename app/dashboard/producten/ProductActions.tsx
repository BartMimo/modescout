'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function ProductActions({ productId }: { productId: string }) {
  const router = useRouter()
  const supabase = createClient()

  async function handleDelete() {
    if (!confirm('Weet je zeker dat je dit product wilt verwijderen?')) return
    await supabase.from('products').delete().eq('id', productId)
    router.refresh()
  }

  return (
    <div className="flex gap-2 shrink-0">
      <Link
        href={`/dashboard/producten/${productId}`}
        className="text-xs px-3 py-1.5 border border-[#ddd] rounded-lg hover:border-[#0D0D0D] transition-colors"
      >
        Bewerken
      </Link>
      <button
        onClick={handleDelete}
        className="text-xs px-3 py-1.5 border border-[#ddd] rounded-lg hover:border-red-500 hover:text-red-500 transition-colors"
      >
        Verwijderen
      </button>
    </div>
  )
}
