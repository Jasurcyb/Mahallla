import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  createOrder,
  getService,
  listOrders,
  updateOrderStatus,
  getOrCreateUser,
} from '@/lib/dynamodb'
import { verifySameOrigin } from '@/lib/cors'
import { sanitizeString, isValidId, isValidOrderStatus, isValidPositiveInteger } from '@/lib/sanitize'
import type { OrderStatus } from '@/types'

export async function GET(request: Request) {
  if (!verifySameOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const cookieStore = await cookies()
    const customerId = cookieStore.get('mahalla_uid')?.value
    const customer = await getOrCreateUser(customerId)
    const orders = await listOrders(customer.userId)
    return NextResponse.json({ orders })
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

    if (!body.serviceId) {
      return NextResponse.json(
        { error: 'Missing required field: serviceId' },
        { status: 400 },
      )
    }

    if (!isValidId(body.serviceId)) {
      return NextResponse.json(
        { error: 'Invalid serviceId format' },
        { status: 400 },
      )
    }

    const serviceId = sanitizeString(body.serviceId, 50)
    const service = await getService(serviceId)
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    let quantity = 1
    if (body.quantity !== undefined && body.quantity !== null) {
      if (!isValidPositiveInteger(body.quantity, 100)) {
        return NextResponse.json(
          { error: 'Invalid quantity: must be an integer between 1 and 100' },
          { status: 400 },
        )
      }
      quantity = Number(body.quantity)
    }

    const scheduledDate = sanitizeString(body.scheduledDate ?? '', 20)
    const scheduledTime = sanitizeString(body.scheduledTime ?? '', 10)
    const notes = sanitizeString(body.notes ?? '', 500)

    const cookieStore = await cookies()
    const customerId = cookieStore.get('mahalla_uid')?.value
    const customer = await getOrCreateUser(customerId)

    const order = await createOrder({
      customerId: customer.userId,
      customerName: customer.name || 'New Neighbor',
      serviceId: service.serviceId,
      serviceTitle: service.title,
      providerId: service.providerId,
      providerName: service.providerName,
      category: service.category,
      scheduledDate,
      scheduledTime,
      quantity,
      totalPrice: service.price * quantity,
      notes,
    })

    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  if (!verifySameOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    if (!body.orderId || !body.status) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId, status' },
        { status: 400 },
      )
    }

    if (!isValidId(body.orderId)) {
      return NextResponse.json(
        { error: 'Invalid orderId format' },
        { status: 400 },
      )
    }

    if (!isValidOrderStatus(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 },
      )
    }

    const orderId = sanitizeString(body.orderId, 50)
    const status = sanitizeString(body.status, 20) as OrderStatus

    const order = await updateOrderStatus(orderId, status)
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    return NextResponse.json({ order })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
