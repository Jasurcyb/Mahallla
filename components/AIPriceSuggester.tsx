'use client'

import { useState } from 'react'
import { Loader2, Sparkles, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatUZS } from '@/lib/categories'
import { useLanguage } from '@/lib/language-context'
import type { PriceSuggestion } from '@/types'

interface AIPriceSuggesterProps {
  serviceType: string
  city: string
  onApply?: (price: number) => void
}

export function AIPriceSuggester({
  serviceType,
  city,
  onApply,
}: AIPriceSuggesterProps) {
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PriceSuggestion | null>(null)
  const [error, setError] = useState('')

  async function handleSuggest() {
    if (!serviceType.trim()) {
      setError(t('aiPrice.enterFirst'))
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/ai/price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceType, city }),
      })
      if (!res.ok) throw new Error('Price failed')
      const data: PriceSuggestion = await res.json()
      setResult(data)
    } catch {
      setError(t('aiPrice.unavailable'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-accent/40 bg-accent/10 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-accent/20 text-accent-foreground">
            <Sparkles width={16} height={16} aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {t('aiPrice.title')}
            </p>
            <p className="text-xs text-muted-foreground">
              {t('aiPrice.subtitle')}
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSuggest}
          disabled={loading}
        >
          {loading ? (
            <Loader2 width={15} height={15} className="animate-spin" aria-hidden="true" />
          ) : (
            <TrendingUp width={15} height={15} aria-hidden="true" />
          )}
          {t('aiPrice.suggest')}
        </Button>
      </div>

      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

      {result && (
        <div className="mt-4 space-y-2">
          <p className="font-heading text-lg font-semibold text-foreground">
            {formatUZS(result.minPrice)} – {formatUZS(result.maxPrice)}
          </p>
          <p className="text-sm text-muted-foreground">{result.reasoning}</p>
          {onApply && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => onApply(result.suggested)}
            >
              {t('aiPrice.useSuggested')} {formatUZS(result.suggested)}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
