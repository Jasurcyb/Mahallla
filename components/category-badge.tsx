import { getCategory } from '@/lib/categories'
import { cn } from '@/lib/utils'
import type { Category } from '@/types'

interface CategoryBadgeProps {
  category: Category
  className?: string
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
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
      {meta.label}
    </span>
  )
}
