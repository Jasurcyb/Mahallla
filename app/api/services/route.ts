import { NextResponse } from 'next/server'
import { createService, listServices } from '@/lib/dynamodb'
import { verifySameOrigin } from '@/lib/cors'
import {
  sanitizeString,
  isValidCategory,
  isValidPriceUnit,
  isValidPositiveInteger,
  isValidId,
} from '@/lib/sanitize'
import type { Category, PriceUnit } from '@/types'

export async function GET(request: Request) {
  if (!verifySameOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const services = await listServices()
    return NextResponse.json({ services })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!verifySameOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()

    // 1. Required fields checks
    const required = ['title', 'category', 'description', 'price']
    for (const field of required) {
      if (body[field] === undefined || body[field] === null || body[field] === '') {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 },
        )
      }
    }

    // 2. Type & bounds validation
    if (
      typeof body.title !== 'string' ||
      typeof body.description !== 'string' ||
      typeof body.category !== 'string'
    ) {
      return NextResponse.json(
        { error: 'Invalid field types: title, description, and category must be strings' },
        { status: 400 },
      )
    }

    if (body.title.length < 3 || body.title.length > 100) {
      return NextResponse.json(
        { error: 'Invalid title length: must be between 3 and 100 characters' },
        { status: 400 },
      )
    }

    if (body.description.length > 1000) {
      return NextResponse.json(
        { error: 'Invalid description length: must be at most 1000 characters' },
        { status: 400 },
      )
    }

    if (!isValidCategory(body.category)) {
      return NextResponse.json(
        { error: 'Invalid category value' },
        { status: 400 },
      )
    }

    if (!isValidPositiveInteger(body.price, 100000000)) {
      return NextResponse.json(
        { error: 'Invalid price: must be a positive integer up to 100,000,000' },
        { status: 400 },
      )
    }

    if (body.priceUnit !== undefined && body.priceUnit !== null) {
      if (!isValidPriceUnit(body.priceUnit)) {
        return NextResponse.json(
          { error: 'Invalid priceUnit value' },
          { status: 400 },
        )
      }
    }

    // Optional field types
    if (body.providerId !== undefined && !isValidId(body.providerId)) {
      return NextResponse.json({ error: 'Invalid providerId format' }, { status: 400 })
    }
    if (body.providerName !== undefined && typeof body.providerName !== 'string') {
      return NextResponse.json({ error: 'providerName must be a string' }, { status: 400 })
    }
    if (body.providerAvatar !== undefined && typeof body.providerAvatar !== 'string') {
      return NextResponse.json({ error: 'providerAvatar must be a string' }, { status: 400 })
    }
    if (body.location !== undefined && typeof body.location !== 'string') {
      return NextResponse.json({ error: 'location must be a string' }, { status: 400 })
    }
    if (body.city !== undefined && typeof body.city !== 'string') {
      return NextResponse.json({ error: 'city must be a string' }, { status: 400 })
    }
    if (body.available !== undefined && typeof body.available !== 'boolean') {
      return NextResponse.json({ error: 'available must be a boolean' }, { status: 400 })
    }

    // 3. Sanitization
    const title = sanitizeString(body.title, 100)
    const description = sanitizeString(body.description, 1000)
    const providerId = body.providerId ? sanitizeString(body.providerId, 50) : 'provider-nilufar'
    const providerName = body.providerName ? sanitizeString(body.providerName, 100) : 'You'
    const providerAvatar = body.providerAvatar ? sanitizeString(body.providerAvatar, 200) : '/avatars/aziza.png'
    const priceUnit = body.priceUnit ? (body.priceUnit as PriceUnit) : 'fixed'
    const location = body.location ? sanitizeString(body.location, 100) : 'Markaz mahalla'
    const city = body.city ? sanitizeString(body.city, 100) : 'Fergana'
    const available = body.available ?? true

    const service = await createService({
      providerId,
      providerName,
      providerAvatar,
      title,
      description,
      category: body.category as Category,
      price: Number(body.price),
      priceUnit,
      location,
      city,
      available,
    })

    return NextResponse.json({ service }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
