'use client'

import useSWR from 'swr'
import Link from 'next/link'
import { CalendarClock, Package, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CategoryBadge } from '@/components/category-badge'
import { formatUZS } from '@/lib/categories'
import type { Order, OrderStatus } from '@/types'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: 'bg-accent/20 text-accent-foreground',
  confirmed: 'bg-primary/10 text-primary',
  in_progress: 'bg-primary/10 text-primary',
  completed: 'bg-secondary text-secondary-foreground',
  cancelled: 'bg-destructive/10 text-destructive',
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  in_progress: 'In progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: 'confirmed',
  confirmed: 'in_progress',
  in_progress: 'completed',
}

export function OrdersView() {
  const { data, isLoading, mutate } = useSWR<{ orders: Order[] }>(
    '/api/orders',
    fetcher,
  )

  async function advance(order: Order) {
    const next = NEXT_STATUS[order.status]
    if (!next) return
    await fetch('/api/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: order.orderId, status: next }),
    })
    mutate()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="animate-spin" aria-hidden="true" />
      </div>
    )
  }

  const orders = data?.orders ?? []

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border py-16 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Package aria-hidden="true" />
        </span>
        <div>
          <p className="font-medium text-foreground">No orders yet</p>
          <p className="text-sm text-muted-foreground">
            Browse your mahalla and place your first order.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/browse" />}>
          Browse services
        </Button>
      </div>
    )
  }

  return (
    <ul className="space-y-4">
      {orders.map((order) => (
        <li
          key={order.orderId}
          className="rounded-2xl border border-border bg-card p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CategoryBadge category={order.category} />
                <Badge className={STATUS_STYLES[order.status]}>
                  {STATUS_LABELS[order.status]}
                </Badge>
              </div>
              <Link
                href={`/service/${order.serviceId}`}
                className="font-heading text-lg font-semibold text-foreground hover:underline"
              >
                {order.serviceTitle}
              </Link>
              <p className="text-sm text-muted-foreground">
                Provider: {order.providerName} · Qty {order.quantity}
              </p>
              {(order.scheduledDate || order.scheduledTime) && (
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CalendarClock width={14} height={14} aria-hidden="true" />
                  {order.scheduledDate} {order.scheduledTime}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="font-heading text-lg font-semibold text-foreground">
                {formatUZS(order.totalPrice)}
              </p>
              {NEXT_STATUS[order.status] && (
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  onClick={() => advance(order)}
                >
                  Mark {STATUS_LABELS[NEXT_STATUS[order.status]!].toLowerCase()}
                </Button>
              )}
            </div>
          </div>
          {order.notes && (
            <p className="mt-3 rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
              {order.notes}
            </p>
          )}
        </li>
      ))}
    </ul>
  )
}
