import { NextResponse } from 'next/server'
import { suggestPrice } from '@/lib/ai'
import { verifySameOrigin } from '@/lib/cors'
import { checkRateLimit } from '@/lib/rate-limit'
import { sanitizeString } from '@/lib/sanitize'

export async function POST(request: Request) {
  // 1. Same-Origin Check
  if (!verifySameOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // 2. Rate Limiting Check
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || '127.0.0.1'
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 })
  }

  try {
    const body = await request.json()
    const rawServiceType = body.serviceType ?? body.title
    const rawCity = body.city ?? 'Fergana'

    // 3. Input Validation
    if (rawServiceType === undefined || rawServiceType === null) {
      return NextResponse.json(
        { error: 'Missing required field: serviceType' },
        { status: 400 },
      )
    }

    if (typeof rawServiceType !== 'string' || typeof rawCity !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input types: serviceType and city must be strings' },
        { status: 400 },
      )
    }

    const serviceType = sanitizeString(rawServiceType, 200)
    const city = sanitizeString(rawCity, 50)

    if (!serviceType.trim()) {
      return NextResponse.json(
        { error: 'Invalid serviceType: cannot be empty' },
        { status: 400 },
      )
    }

    const suggestion = await suggestPrice(serviceType, city)
    return NextResponse.json(suggestion)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
