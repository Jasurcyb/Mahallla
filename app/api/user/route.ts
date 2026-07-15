import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getOrCreateUser, updateUser } from '@/lib/dynamodb'
import { verifySameOrigin } from '@/lib/cors'
import { sanitizeString } from '@/lib/sanitize'
import type { Category } from '@/types'

const VALID_CATEGORIES: Category[] = ['food', 'laundry', 'delivery', 'moving', 'cleaning', 'other']

export async function GET(request: Request) {
  if (!verifySameOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const cookieStore = await cookies()
    const customerId = cookieStore.get('mahalla_uid')?.value
    const user = await getOrCreateUser(customerId)
    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  if (!verifySameOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const cookieStore = await cookies()
    const customerId = cookieStore.get('mahalla_uid')?.value
    if (!customerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // 1. Validation
    if (body.name !== undefined && typeof body.name !== 'string') {
      return NextResponse.json({ error: 'name must be a string' }, { status: 400 })
    }
    if (body.phone !== undefined && typeof body.phone !== 'string') {
      return NextResponse.json({ error: 'phone must be a string' }, { status: 400 })
    }
    if (body.city !== undefined && typeof body.city !== 'string') {
      return NextResponse.json({ error: 'city must be a string' }, { status: 400 })
    }
    if (body.isProvider !== undefined && typeof body.isProvider !== 'boolean') {
      return NextResponse.json({ error: 'isProvider must be a boolean' }, { status: 400 })
    }
    if (body.categories !== undefined && !Array.isArray(body.categories)) {
      return NextResponse.json({ error: 'categories must be an array' }, { status: 400 })
    }

    // 2. Sanitization
    const patch: Record<string, any> = {}
    if (body.name !== undefined) patch.name = sanitizeString(body.name, 100)
    if (body.phone !== undefined) patch.phone = sanitizeString(body.phone, 30)
    if (body.city !== undefined) patch.city = sanitizeString(body.city, 100)
    if (body.isProvider !== undefined) patch.isProvider = body.isProvider
    if (body.categories !== undefined) {
      patch.categories = body.categories
        .filter((c: any) => typeof c === 'string' && VALID_CATEGORIES.includes(c as Category))
        .map((c: string) => sanitizeString(c, 50))
    }

    const updatedUser = await updateUser(customerId, patch)
    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
