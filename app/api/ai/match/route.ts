import { NextResponse } from 'next/server'
import { analyzeRequest } from '@/lib/ai'
import { listServices } from '@/lib/dynamodb'
import { verifySameOrigin } from '@/lib/cors'
import { checkRateLimit } from '@/lib/rate-limit'
import { sanitizeString } from '@/lib/sanitize'
import type { MatchResult } from '@/types'

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
    const rawQuery = body.query ?? body.text

    // 3. Input Validation
    if (rawQuery === undefined || rawQuery === null) {
      return NextResponse.json(
        { error: 'Missing required field: query' },
        { status: 400 },
      )
    }

    if (typeof rawQuery !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input type: query must be a string' },
        { status: 400 },
      )
    }

    const query = sanitizeString(rawQuery, 500)
    if (!query.trim()) {
      return NextResponse.json(
        { error: 'Invalid query: query cannot be empty' },
        { status: 400 },
      )
    }

    const [analysis, services] = await Promise.all([
      analyzeRequest(query),
      listServices(),
    ])
    const lower = query.toLowerCase()

    const ranked = services
      .map((s) => {
        let score = 0
        if (s.category === analysis.category) score += 5
        for (const kw of analysis.keywords) {
          if (
            s.title.toLowerCase().includes(kw) ||
            s.description.toLowerCase().includes(kw)
          ) {
            score += 2
          }
        }
        if (lower.includes(s.title.toLowerCase())) score += 3
        score += s.rating / 2
        score -= s.distanceKm / 10
        return { service: s, score }
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((r) => r.service)

    const result: MatchResult = {
      category: analysis.category,
      keywords: analysis.keywords,
      priceRange: analysis.priceRange,
      urgency: analysis.urgency,
      services: ranked,
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
