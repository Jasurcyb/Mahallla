import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingStarsProps {
  rating: number
  size?: number
  showvalue?: boolean
  reviewCount?: number
  className?: string
}

export function RatingStars({
  rating,
  size = 16,
  showvalue = true,
  reviewCount,
  className,
}: RatingStarsProps) {
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            width={size}
            height={size}
            className={cn(
              i <= Math.round(rating)
                ? 'fill-accent text-accent'
                : 'fill-muted text-muted',
            )}
          />
        ))}
      </div>
      {showvalue && (
        <span className="text-sm font-medium text-foreground">
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className="text-sm text-muted-foreground">({reviewCount})</span>
      )}
      <span className="sr-only">{rating.toFixed(1)} out of 5 stars</span>
    </div>
  )
}
