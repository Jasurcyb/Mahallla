'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, PartyPopper } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AIPriceSuggester } from '@/components/AIPriceSuggester'
import { CATEGORIES, getCategoryLabel } from '@/lib/categories'
import { useLanguage } from '@/lib/language-context'
import type { Category, PriceUnit } from '@/types'

const CITIES = ['Toshkent', 'Samarqand', 'Buxoro', 'Andijon', 'Fargʻona']

export function PostServiceForm() {
  const router = useRouter()
  const { locale, t } = useLanguage()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<Category>('food')
  const [price, setPrice] = useState('')
  const [priceUnit, setPriceUnit] = useState<PriceUnit>('fixed')
  const [city, setCity] = useState('Toshkent')
  const [location, setLocation] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          price: Number(price) || 0,
          priceUnit,
          city,
          location,
        }),
      })
      if (!res.ok) throw new Error('failed')
      const service = await res.json()
      setDone(true)
      setTimeout(() => router.push(`/service/${service.service?.id ?? service.service?.serviceId}`), 1200)
    } catch {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-10 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <PartyPopper width={28} height={28} aria-hidden="true" />
        </span>
        <h2 className="font-heading text-2xl font-semibold text-foreground">
          {t('post.success.title')}
        </h2>
        <p className="text-muted-foreground">
          {t('post.success.subtitle')}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">{t('post.serviceTitle')}</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('post.serviceTitlePlaceholder')}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">{t('post.category')}</Label>
        <Select
          value={category}
          onValueChange={(v) => setCategory(v as Category)}
        >
          <SelectTrigger id="category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {getCategoryLabel(c, locale)} · {c.labelUz}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{t('post.description')}</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t('post.descriptionPlaceholder')}
          rows={4}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="city">{t('post.city')}</Label>
          <Select value={city} onValueChange={(v) => setCity(v ?? 'Toshkent')}>
            <SelectTrigger id="city">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CITIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">{t('post.neighborhood')}</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={t('post.neighborhoodPlaceholder')}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">{t('post.price')}</Label>
          <Input
            id="price"
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="45000"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="priceUnit">{t('post.priceUnit')}</Label>
          <Select
            value={priceUnit}
            onValueChange={(v) => setPriceUnit(v as PriceUnit)}
          >
            <SelectTrigger id="priceUnit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fixed">{t('post.fixedPrice')}</SelectItem>
              <SelectItem value="per_item">{t('post.perItem')}</SelectItem>
              <SelectItem value="per_hour">{t('post.perHour')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <AIPriceSuggester
        serviceType={title || category}
        city={city}
        onApply={(p) => setPrice(String(p))}
      />

      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting && (
          <Loader2 width={18} height={18} className="animate-spin" aria-hidden="true" />
        )}
        {t('post.publish')}
      </Button>
    </form>
  )
}
