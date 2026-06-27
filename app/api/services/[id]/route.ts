import { NextResponse } from 'next/server'
import {
  deleteService,
  getService,
  listReviews,
  updateService,
} from '@/lib/dynamodb'
import { verifySameOrigin } from '@/lib/cors'
import {
  sanitizeString,
  isValidId,
  isValidCategory,
  isValidPriceUnit,
  isValidPositiveInteger,
} from '@/lib/sanitize'
import type { Category, PriceUnit } from '@/types'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!verifySameOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { id } = await params
    if (!isValidId(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 })
    }

    const service = await getService(id)
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }
    const reviews = await listReviews(id)
    return NextResponse.json({ service, reviews })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!verifySameOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { id } = await params
    if (!isValidId(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 })
    }

    const patch = await request.json()

    // Validate patch fields
    if (patch.title !== undefined) {
      if (typeof patch.title !== 'string' || patch.title.length < 3 || patch.title.length > 100) {
        return NextResponse.json({ error: 'Invalid title length' }, { status: 400 })
      }
      patch.title = sanitizeString(patch.title, 100)
    }

    if (patch.description !== undefined) {
      if (typeof patch.description !== 'string' || patch.description.length > 1000) {
        return NextResponse.json({ error: 'Invalid description length' }, { status: 400 })
      }
      patch.description = sanitizeString(patch.description, 1000)
    }

    if (patch.category !== undefined) {
      if (!isValidCategory(patch.category)) {
        return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
      }
    }

    if (patch.price !== undefined) {
      if (!isValidPositiveInteger(patch.price, 100000000)) {
        return NextResponse.json({ error: 'Invalid price' }, { status: 400 })
      }
      patch.price = Number(patch.price)
    }

    if (patch.priceUnit !== undefined) {
      if (!isValidPriceUnit(patch.priceUnit)) {
        return NextResponse.json({ error: 'Invalid priceUnit' }, { status: 400 })
      }
    }

    if (patch.providerName !== undefined) {
      if (typeof patch.providerName !== 'string') {
        return NextResponse.json({ error: 'providerName must be a string' }, { status: 400 })
      }
      patch.providerName = sanitizeString(patch.providerName, 100)
    }

    if (patch.providerAvatar !== undefined) {
      if (typeof patch.providerAvatar !== 'string') {
        return NextResponse.json({ error: 'providerAvatar must be a string' }, { status: 400 })
      }
      patch.providerAvatar = sanitizeString(patch.providerAvatar, 200)
    }

    if (patch.location !== undefined) {
      if (typeof patch.location !== 'string') {
        return NextResponse.json({ error: 'location must be a string' }, { status: 400 })
      }
      patch.location = sanitizeString(patch.location, 100)
    }

    if (patch.city !== undefined) {
      if (typeof patch.city !== 'string') {
        return NextResponse.json({ error: 'city must be a string' }, { status: 400 })
      }
      patch.city = sanitizeString(patch.city, 100)
    }

    if (patch.available !== undefined) {
      if (typeof patch.available !== 'boolean') {
        return NextResponse.json({ error: 'available must be a boolean' }, { status: 400 })
      }
    }

    const service = await updateService(id, patch)
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }
    return NextResponse.json({ service })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!verifySameOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { id } = await params
    if (!isValidId(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 })
    }

    const ok = await deleteService(id)
    if (!ok) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
