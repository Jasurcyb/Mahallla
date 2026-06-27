'use client'

import { useMemo, useState } from 'react'
import useSWR from 'swr'
import { Loader2, Search, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ServiceCard } from '@/components/ServiceCard'
import { CATEGORIES } from '@/lib/categories'
import type { Category, Service } from '@/types'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const MAX_PRICE = 100000

interface BrowseViewProps {
  initialCategory?: Category | 'all'
}

export function BrowseView({ initialCategory = 'all' }: BrowseViewProps) {
  const { data, isLoading } = useSWR<{ services: Service[] }>(
    '/api/services',
    fetcher,
  )
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category | 'all'>(initialCategory)
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE)
  const [minRating, setMinRating] = useState('0')
  const [maxDistance, setMaxDistance] = useState('100')
  const [sort, setSort] = useState('rating')

  const services = data?.services ?? []

  const filtered = useMemo(() => {
    const result = services.filter((s) => {
      if (category !== 'all' && s.category !== category) return false
      if (s.price > maxPrice) return false
      if (s.rating < Number(minRating)) return false
      if (s.distanceKm > Number(maxDistance)) return false
      if (query.trim()) {
        const q = query.toLowerCase()
        if (
          !s.title.toLowerCase().includes(q) &&
          !s.description.toLowerCase().includes(q) &&
          !s.providerName.toLowerCase().includes(q)
        ) {
          return false
        }
      }
      return true
    })
    result.sort((a, b) => {
      if (sort === 'price_low') return a.price - b.price
      if (sort === 'price_high') return b.price - a.price
      if (sort === 'distance') return a.distanceKm - b.distanceKm
      return b.rating - a.rating
    })
    return result
  }, [services, category, maxPrice, minRating, maxDistance, query, sort])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold text-foreground">
          Browse services
        </h1>
        <p className="mt-2 text-muted-foreground">
          Find trusted neighbors offering what you need.
        </p>
      </div>

      <div className="relative mb-6">
        <Search
          width={18}
          height={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search services or providers..."
          aria-label="Search services"
          className="pl-10"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Filters */}
        <aside className="h-fit rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center gap-2 text-foreground">
            <SlidersHorizontal width={16} height={16} aria-hidden="true" />
            <h2 className="font-medium">Filters</h2>
          </div>

          <div className="space-y-5">
            <div>
              <Label className="mb-2 block">Category</Label>
              <Select
                value={category}
                onValueChange={(v) => setCategory(v as Category | 'all')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block">
                Max price: {new Intl.NumberFormat('en-US').format(maxPrice)} UZS
              </Label>
              <Slider
                value={[maxPrice]}
                min={5000}
                max={MAX_PRICE}
                step={5000}
                onValueChange={(v) =>
                  setMaxPrice(Array.isArray(v) ? v[0] : v)
                }
              />
            </div>

            <div>
              <Label className="mb-2 block">Minimum rating</Label>
              <Select
                value={minRating}
                onValueChange={(v) => setMinRating(v ?? '0')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any rating</SelectItem>
                  <SelectItem value="4">4.0+</SelectItem>
                  <SelectItem value="4.5">4.5+</SelectItem>
                  <SelectItem value="4.8">4.8+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block">Distance</Label>
              <Select
                value={maxDistance}
                onValueChange={(v) => setMaxDistance(v ?? '100')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100">Any distance</SelectItem>
                  <SelectItem value="1">Within 1 km</SelectItem>
                  <SelectItem value="2">Within 2 km</SelectItem>
                  <SelectItem value="5">Within 5 km</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setCategory('all')
                setMaxPrice(MAX_PRICE)
                setMinRating('0')
                setMaxDistance('100')
                setQuery('')
              }}
            >
              Reset filters
            </Button>
          </div>
        </aside>

        {/* Results */}
        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? 'service' : 'services'}
            </p>
            <Select value={sort} onValueChange={(v) => setSort(v ?? 'rating')}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Top rated</SelectItem>
                <SelectItem value="price_low">Price: low to high</SelectItem>
                <SelectItem value="price_high">Price: high to low</SelectItem>
                <SelectItem value="distance">Nearest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="animate-spin" aria-hidden="true" />
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((s) => (
                <ServiceCard key={s.serviceId} service={s} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border py-20 text-center text-muted-foreground">
              No services match your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
