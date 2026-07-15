'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLanguage } from '@/lib/language-context'
import { CATEGORIES, getCategoryLabel } from '@/lib/categories'
import type { Category, User } from '@/types'

const CITIES = ['Toshkent', 'Samarqand', 'Buxoro', 'Andijon', 'Fargʻona', 'Namangan', 'Qarshi', 'Nukus']

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function EditProfilePage() {
  const router = useRouter()
  const { t, locale } = useLanguage()
  const { data, isLoading } = useSWR<{ user: User }>('/api/user', fetcher)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('Toshkent')
  const [isProvider, setIsProvider] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (data?.user) {
      setName(data.user.name || '')
      setPhone(data.user.phone || '')
      setCity(data.user.city || 'Toshkent')
      setIsProvider(data.user.isProvider || false)
      setSelectedCategories(data.user.categories || [])
    }
  }, [data])

  const toggleCategory = (cat: Category) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          city,
          isProvider,
          categories: selectedCategories,
        }),
      })

      if (!res.ok) throw new Error('Failed to update')
      router.push('/profile')
      router.refresh()
    } catch (err) {
      console.error(err)
      setSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main className="flex flex-1 items-center justify-center bg-background">
          <Loader2 className="animate-spin text-muted-foreground" aria-hidden="true" />
        </main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 bg-background">
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/profile')}
            aria-label={t('profile.back')}
          >
            <ArrowLeft width={18} height={18} aria-hidden="true" />
          </Button>
          <div>
            <h1 className="font-heading text-3xl font-semibold text-foreground">
              {t('profile.editTitle')}
            </h1>
            <p className="text-muted-foreground text-sm">
              {t('profile.editSubtitle')}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="space-y-2">
            <Label htmlFor="name">{t('profile.name')}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sobirjon"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">{t('profile.phone')}</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">{t('profile.city')}</Label>
              <select
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isProvider"
                checked={isProvider}
                onChange={(e) => setIsProvider(e.target.checked)}
                className="size-4 rounded border-border bg-background text-primary focus:ring-ring"
              />
              <Label htmlFor="isProvider" className="cursor-pointer select-none">
                {t('profile.isProvider')}
              </Label>
            </div>

            {isProvider && (
              <div className="space-y-3 rounded-lg bg-muted p-4">
                <Label className="text-sm font-semibold">{t('profile.categories')}</Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {CATEGORIES.map((cat) => {
                    const checked = selectedCategories.includes(cat.id)
                    return (
                      <div key={cat.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`cat-${cat.id}`}
                          checked={checked}
                          onChange={() => toggleCategory(cat.id)}
                          className="size-4 rounded border-border bg-background text-primary focus:ring-ring"
                        />
                        <label
                          htmlFor={`cat-${cat.id}`}
                          className="text-sm font-medium leading-none cursor-pointer select-none"
                        >
                          {getCategoryLabel(cat, locale)}
                        </label>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <Button type="submit" disabled={submitting} className="w-full gap-2">
            {submitting ? (
              <>
                <Loader2 className="animate-spin" width={16} height={16} aria-hidden="true" />
                {t('profile.saving')}
              </>
            ) : (
              <>
                <Save width={16} height={16} aria-hidden="true" />
                {t('profile.save')}
              </>
            )}
          </Button>
        </form>
      </main>
      <SiteFooter />
    </div>
  )
}
