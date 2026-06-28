import { cookies } from 'next/headers'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle2, MapPin, Phone, Star } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ServiceCard } from '@/components/ServiceCard'
import { getUser, listOrders, listServices } from '@/lib/dynamodb'
import { formatUZS } from '@/lib/categories'
import { getTranslator, type Locale } from '@/lib/translations'

const VALID_LOCALES: Locale[] = ['en', 'ru', 'uz']

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const raw = cookieStore.get('lang')?.value ?? 'ru'
  const locale: Locale = VALID_LOCALES.includes(raw as Locale)
    ? (raw as Locale)
    : 'ru'
  const t = getTranslator(locale)

  const [user, orders, services] = await Promise.all([
    getUser(),
    listOrders(),
    listServices(),
  ])

  if (!user) return null

  const completed = orders.filter((o) => o.status === 'completed')
  const active = orders.filter(
    (o) => o.status !== 'completed' && o.status !== 'cancelled',
  )
  const totalSpent = completed.reduce((sum, o) => sum + o.totalPrice, 0)
  const recommended = services.slice(0, 3)

  const dateLocale = locale === 'ru' ? 'ru-RU' : locale === 'uz' ? 'uz-UZ' : 'en-US'

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10">
        <section className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center">
          <Image
            src={user.avatar || '/placeholder.svg'}
            alt={user.name}
            width={96}
            height={96}
            className="size-24 rounded-full object-cover"
          />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col items-center gap-2 sm:flex-row">
              <h1 className="font-heading text-2xl font-semibold text-foreground">
                {user.name}
              </h1>
              <Badge className="gap-1 bg-primary/10 text-primary">
                <CheckCircle2 width={13} height={13} aria-hidden="true" />
                {t('profile.verifiedNeighbor')}
              </Badge>
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground sm:justify-start">
              <span className="flex items-center gap-1">
                <MapPin width={14} height={14} aria-hidden="true" />
                {user.city}
              </span>
              <span className="flex items-center gap-1">
                <Phone width={14} height={14} aria-hidden="true" />
                {user.phone}
              </span>
              <span className="flex items-center gap-1">
                <Star
                  width={14}
                  height={14}
                  className="fill-accent text-accent"
                  aria-hidden="true"
                />
                {user.rating.toFixed(1)}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {t('profile.memberSince')}{' '}
              {new Date(user.joinedAt).toLocaleDateString(dateLocale, {
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/post" />}
          >
            {t('profile.becomeProvider')}
          </Button>
        </section>

        <section className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: t('profile.completedOrders'), value: completed.length },
            { label: t('profile.activeOrders'), value: active.length },
            { label: t('profile.totalSpent'), value: formatUZS(totalSpent) },
            { label: t('profile.neighborRating'), value: user.rating.toFixed(1) },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-4 text-center"
            >
              <p className="font-heading text-2xl font-semibold text-foreground">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </section>

        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              {t('profile.recommended')}
            </h2>
            <Link
              href="/browse"
              className="text-sm font-medium text-primary hover:underline"
            >
              {t('profile.seeAll')}
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recommended.map((service) => (
              <ServiceCard key={service.serviceId} service={service} />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
