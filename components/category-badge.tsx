'use client'

import { getCategory, getCategoryLabel } from '@/lib/categories'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/language-context'
import type { Category } from '@/types'

interface CategoryBadgeProps {
  category: Category
  className?: string
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const { locale } = useLanguage()
  const meta = getCategory(category)
  const Icon = meta.icon
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground',
        className,
      )}
    >
      <Icon width={14} height={14} aria-hidden="true" />
      {getCategoryLabel(meta, locale)}
    </span>
  )
}
