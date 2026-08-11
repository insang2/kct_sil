import { NextResponse } from 'next/server'

// Proxy for exchange rate data — avoids browser-side CORS/network restrictions
export async function GET() {
  try {
    const res = await fetch(
      'https://api.frankfurter.app/latest?from=USD&to=KRW,EUR,JPY,CNY,SGD,AUD',
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) throw new Error(`upstream ${res.status}`)
    const data = await res.json()
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600' },
    })
  } catch (e) {
    return NextResponse.json({ error: 'fetch_failed' }, { status: 502 })
  }
}
