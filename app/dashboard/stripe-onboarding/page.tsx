'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Button from '@/components/ui/Button'
import { CheckCircle, AlertCircle } from 'lucide-react'

export default function StripeOnboardingPage() {
  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const refresh = searchParams.get('refresh')

  const [status, setStatus] = useState<{ charges_enabled: boolean; payouts_enabled: boolean } | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/stripe-connect').then(r => r.json()).then(setStatus)
  }, [])

  async function startOnboarding() {
    setLoading(true)
    const res = await fetch('/api/stripe-connect', { method: 'POST' })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    else if (data.status === 'complete') {
      setStatus({ charges_enabled: true, payouts_enabled: true })
    }
    setLoading(false)
  }

  const isComplete = status?.charges_enabled && status?.payouts_enabled

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-2">Uitbetalingen instellen</h1>
      <p className="text-[#666] text-sm mb-8">
        Via Stripe Connect ontvang je automatisch jouw deel (85%) bij elke verkoop.
      </p>

      {isComplete ? (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 flex items-start gap-3">
          <CheckCircle className="text-green-600 shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-semibold text-green-800">Stripe-account actief</p>
            <p className="text-sm text-green-700 mt-1">
              Je kunt betalingen ontvangen. Bekijk je uitbetalingen via het Stripe Express-dashboard.
            </p>
            <button
              onClick={async () => {
                setLoading(true)
                const res = await fetch('/api/stripe-connect', { method: 'POST' })
                const data = await res.json()
                if (data.url) window.location.href = data.url
                setLoading(false)
              }}
              disabled={loading}
              className="mt-3 text-sm underline text-green-800"
            >
              Stripe Express-dashboard openen
            </button>
          </div>
        </div>
      ) : (
        <div>
          {(refresh || success) && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-2">
              <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={16} />
              <p className="text-sm text-amber-800">
                {refresh ? 'Je onboarding is nog niet volledig. Klik hieronder om verder te gaan.' : 'Teruggeleid van Stripe. Controleer hieronder de status.'}
              </p>
            </div>
          )}

          <div className="bg-[#F0F0EA] rounded-2xl p-6 mb-6">
            <h2 className="font-semibold mb-3">Hoe het werkt</h2>
            <ul className="space-y-2 text-sm text-[#555]">
              <li className="flex gap-2"><span className="text-[#CDFF00] bg-[#0D0D0D] rounded-full w-5 h-5 flex items-center justify-center shrink-0 text-xs font-bold">1</span> Klik op de knop hieronder</li>
              <li className="flex gap-2"><span className="text-[#CDFF00] bg-[#0D0D0D] rounded-full w-5 h-5 flex items-center justify-center shrink-0 text-xs font-bold">2</span> Doorloop de Stripe-onboarding (KYC, bankrekening)</li>
              <li className="flex gap-2"><span className="text-[#CDFF00] bg-[#0D0D0D] rounded-full w-5 h-5 flex items-center justify-center shrink-0 text-xs font-bold">3</span> Je ontvangt automatisch 85% van elke verkoop</li>
            </ul>
          </div>

          <Button size="lg" onClick={startOnboarding} loading={loading}>
            Stripe-onboarding starten
          </Button>
          <p className="text-xs text-[#999] mt-3">Je wordt doorgestuurd naar Stripe. Jouw gegevens zijn veilig bij Stripe.</p>
        </div>
      )}
    </div>
  )
}
