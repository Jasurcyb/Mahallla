'use client'

import { useState, useEffect } from 'react'
import { Loader2, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ServiceCard } from '@/components/ServiceCard'
import { getCategory, getCategoryLabel } from '@/lib/categories'
import { useLanguage } from '@/lib/language-context'
import type { MatchResult } from '@/types'

export function AISearchBar() {
  const { locale, t } = useLanguage()
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<MatchResult | null>(null)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/ai/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })
      if (!res.ok) throw new Error('Match failed')
      const data: MatchResult = await res.json()
      setResult(data)
    } catch {
      setError(t('search.error'))
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="w-full">
      <form
        onSubmit={handleSearch}
        className="flex flex-col gap-2 rounded-xl border border-border bg-card p-2 shadow-sm sm:flex-row"
      >
        <div className="flex flex-1 items-center gap-2 px-2">
          <Sparkles
            width={18}
            height={18}
            className="shrink-0 text-accent"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search.placeholder')}
            aria-label={t('search.placeholder')}
            className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
          />
        </div>
        <Button type="submit" disabled={loading} className="sm:w-auto">
          {loading ? (
            <Loader2 width={16} height={16} className="animate-spin" aria-hidden="true" />
          ) : (
            <Sparkles width={16} height={16} aria-hidden="true" />
          )}
          {t('search.button')}
        </Button>
      </form>

      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

      {result && (
        <div className="mt-5">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground">{t('search.understood')}</span>
            <Badge variant="secondary">{getCategoryLabel(getCategory(result.category), locale)}</Badge>
            <Badge variant="outline">{t('search.urgency')}: {result.urgency}</Badge>
            {result.keywords.slice(0, 4).map((kw) => (
              <Badge key={kw} variant="outline">
                {kw}
              </Badge>
            ))}
          </div>

          {result.services.length > 0 ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {result.services.map((s) => (
                <ServiceCard key={s.serviceId} service={s} />
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              {t('search.noMatches')}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
