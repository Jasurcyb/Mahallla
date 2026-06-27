import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { CategoryBadge } from '@/components/category-badge'
import { RatingStars } from '@/components/rating-stars'
import { formatPrice } from '@/lib/categories'
import type { Service } from '@/types'

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <CategoryBadge category={service.category} />
          {service.available ? (
            <span className="text-xs font-medium text-primary">Available</span>
          ) : (
            <span className="text-xs font-medium text-muted-foreground">
              Busy
            </span>
          )}
        </div>

        <div className="flex items-start gap-3">
          <Avatar className="size-11 border border-border">
            <AvatarImage src={service.providerAvatar} alt={service.providerName} />
            <AvatarFallback>{service.providerName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-heading text-lg font-semibold leading-tight text-foreground">
              {service.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              by {service.providerName}
            </p>
          </div>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {service.description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <RatingStars
            rating={service.rating}
            reviewCount={service.reviewCount}
            size={14}
          />
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin width={13} height={13} aria-hidden="true" />
            {service.distanceKm} km
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-3 border-t border-border bg-secondary/40 px-5 py-3">
        <span className="font-heading text-base font-semibold text-foreground">
          {formatPrice(service.price, service.priceUnit)}
        </span>
        <Button
          size="sm"
          nativeButton={false}
          render={<Link href={`/service/${service.serviceId}`} />}
        >
          Order Now
        </Button>
      </CardFooter>
    </Card>
  )
}
