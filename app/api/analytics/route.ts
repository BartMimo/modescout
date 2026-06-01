import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { path } = await req.json()
    if (!path) return NextResponse.json({ ok: false })

    const supabase = await createServiceClient()

    // Get geo from Vercel headers (available on Vercel deployment)
    const country = req.headers.get('x-vercel-ip-country') ?? null
    const city = req.headers.get('x-vercel-ip-city') ?? null
    const referrer = req.headers.get('referer') ?? null
    const userAgent = req.headers.get('user-agent') ?? null

    await supabase.from('page_views').insert({ path, country, city, referrer, user_agent: userAgent })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false })
  }
}
