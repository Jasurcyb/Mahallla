import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, BadgeCheck, MapPin, Sparkles } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { CategoryBadge } from '@/components/category-badge'
import { RatingStars } from '@/components/rating-stars'
import { OrderForm } from '@/components/order-form'
import { formatPrice, formatUZS } from '@/lib/categories'
import { getService, getUser, listReviews } from '@/lib/dynamodb'
import { suggestPrice } from '@/lib/ai'

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const service = await getService(id)
  if (!service) notFound()

  const [reviews, provider, priceInsight] = await Promise.all([
    listReviews(id),
    getUser(service.providerId),
    suggestPrice(service.title, service.city),
  ])
  const isFair =
    service.price >= priceInsight.minPrice &&
    service.price <= priceInsight.maxPrice

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <Link
            href="/browse"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft width={16} height={16} aria-hidden="true" />
            Back to browse
          </Link>

          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* Left column */}
            <div className="space-y-6">
              <div>
                <CategoryBadge category={service.category} />
                <h1 className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-4xl">
                  {service.title}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <RatingStars
                    rating={service.rating}
                    reviewCount={service.reviewCount}
                  />
                  <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin width={15} height={15} aria-hidden="true" />
                    {service.location}, {service.city} · {service.distanceKm} km
                  </span>
                </div>
              </div>

              {/* Provider card */}
              <Card>
                <CardContent className="flex items-center gap-4 p-5">
                  <Avatar className="size-16 border border-border">
                    <AvatarImage
                      src={service.providerAvatar}
                      alt={service.providerName}
                    />
                    <AvatarFallback>
                      {service.providerName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="font-heading text-lg font-semibold text-foreground">
                        {service.providerName}
                      </p>
                      <BadgeCheck
                        width={18}
                        height={18}
                        className="text-primary"
                        aria-label="Verified neighbor"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {provider?.completedOrders ?? 0} orders completed ·{' '}
                      {(provider?.rating ?? service.rating).toFixed(1)} rating
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-xl">
                    About this service
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                </CardContent>
              </Card>

              {/* AI price insight */}
              <div className="rounded-xl border border-accent/40 bg-accent/10 p-5">
                <div className="flex items-center gap-2">
                  <Sparkles
                    width={18}
                    height={18}
                    className="text-accent"
                    aria-hidden="true"
                  />
                  <p className="font-semibold text-foreground">
                    AI Price Insight
                  </p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {isFair
                    ? `This price is fair for your area. Similar services in ${service.city} range ${formatUZS(priceInsight.minPrice)} – ${formatUZS(priceInsight.maxPrice)}.`
                    : `Heads up: similar services in ${service.city} typically range ${formatUZS(priceInsight.minPrice)} – ${formatUZS(priceInsight.maxPrice)}.`}
                </p>
              </div>

              {/* Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-xl">
                    Reviews ({reviews.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  {reviews.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No reviews yet. Be the first to order!
                    </p>
                  )}
                  {reviews.map((review, i) => (
                    <div key={review.reviewId}>
                      {i > 0 && <Separator className="mb-5" />}
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-foreground">
                          {review.authorName}
                        </p>
                        <RatingStars
                          rating={review.rating}
                          showvalue={false}
                          size={14}
                        />
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Right column: order */}
            <div>
              <Card className="lg:sticky lg:top-24">
                <CardHeader>
                  <div className="flex items-baseline justify-between gap-2">
                    <CardTitle className="font-heading text-2xl">
                      {formatPrice(service.price, service.priceUnit)}
                    </CardTitle>
                    {service.available ? (
                      <span className="text-sm font-medium text-primary">
                        Available
                      </span>
                    ) : (
                      <span className="text-sm font-medium text-muted-foreground">
                        Currently busy
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <OrderForm service={service} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
