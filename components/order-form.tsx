'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { formatUZS } from '@/lib/categories'
import { useLanguage } from '@/lib/language-context'
import type { Service } from '@/types'

export function OrderForm({ service }: { service: Service }) {
  const router = useRouter()
  const { t } = useLanguage()
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const total = service.price * quantity

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!date || !time) {
      toast.error(t('order.pickDateTime'))
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: service.serviceId,
          scheduledDate: date,
          scheduledTime: time,
          quantity,
          notes,
        }),
      })
      if (!res.ok) throw new Error('Order failed')
      toast.success(t('order.success'))
      router.push('/orders')
    } catch {
      toast.error(t('order.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="date" className="mb-2 block">
            {t('order.date')}
          </Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="time" className="mb-2 block">
            {t('order.time')}
          </Label>
          <Input
            id="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="quantity" className="mb-2 block">
          {t('order.quantity')}
        </Label>
        <Input
          id="quantity"
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
        />
      </div>

      <div>
        <Label htmlFor="notes" className="mb-2 block">
          {t('order.notes')}
        </Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t('order.notesPlaceholder')}
          rows={3}
        />
      </div>

      <div className="flex items-center justify-between border-t border-border pt-4">
        <span className="text-sm text-muted-foreground">{t('order.total')}</span>
        <span className="font-heading text-xl font-bold text-foreground">
          {formatUZS(total)}
        </span>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading && (
          <Loader2 width={16} height={16} className="animate-spin" aria-hidden="true" />
        )}
        {t('order.orderNow')}
      </Button>
    </form>
  )
}
