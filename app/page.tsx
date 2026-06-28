import { cookies } from 'next/headers'
import Link from 'next/link'
import { ClipboardList, HandHeart, Search } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { AISearchBar } from '@/components/AISearchBar'
import { ServiceCard } from '@/components/ServiceCard'
import { CATEGORIES, getCategoryLabel } from '@/lib/categories'
import { listServices } from '@/lib/dynamodb'
import { getTranslator, type Locale } from '@/lib/translations'

const VALID_LOCALES: Locale[] = ['en', 'ru', 'uz']

export default async function HomePage() {
  const cookieStore = await cookies()
  const raw = cookieStore.get('lang')?.value ?? 'ru'
  const locale: Locale = VALID_LOCALES.includes(raw as Locale)
    ? (raw as Locale)
    : 'ru'
  const t = getTranslator(locale)

  const services = await listServices()
  const featured = services.slice(0, 4)

  const STEPS = [
    {
      icon: Search,
      title: t('step.findNeighbor.title'),
      text: t('step.findNeighbor.text'),
    },
    {
      icon: ClipboardList,
      title: t('step.placeOrder.title'),
      text: t('step.placeOrder.text'),
    },
    {
      icon: HandHeart,
      title: t('step.enjoyRate.title'),
      text: t('step.enjoyRate.text'),
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: 'url(/uzbek-pattern.png)',
              backgroundSize: '320px',
            }}
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-sm font-medium text-foreground">
                {t('hero.badge')}
              </span>
              <h1 className="mt-5 text-balance font-heading text-4xl font-bold leading-tight text-foreground sm:text-6xl">
                {t('hero.title')}
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
                {t('hero.subtitle')}
              </p>
              <div className="mx-auto mt-8 max-w-2xl">
                <AISearchBar />
              </div>
            </div>

            {/* Categories */}
            <div className="mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-3 sm:grid-cols-6">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon
                return (
                  <Link
                    key={cat.id}
                    href={`/browse?category=${cat.id}`}
                    className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center transition-colors hover:border-primary/40 hover:bg-secondary/50"
                  >
                    <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon width={22} height={22} aria-hidden="true" />
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {getCategoryLabel(cat, locale)}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold text-foreground">
              {t('howItWorks.title')}
            </h2>
            <p className="mt-3 text-muted-foreground">
              {t('howItWorks.subtitle')}
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <div
                  key={step.title}
                  className="relative rounded-2xl border border-border bg-card p-6"
                >
                  <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Icon width={24} height={24} aria-hidden="true" />
                  </span>
                  <span className="absolute right-6 top-6 font-heading text-4xl font-bold text-secondary">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 font-heading text-xl font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.text}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Featured services */}
        <section className="border-y border-border bg-secondary/30">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="font-heading text-3xl font-bold text-foreground">
                  {t('featured.title')}
                </h2>
                <p className="mt-2 text-muted-foreground">
                  {t('featured.subtitle')}
                </p>
              </div>
              <Link
                href="/browse"
                className="shrink-0 text-sm font-medium text-primary hover:underline"
              >
                {t('featured.browseAll')}
              </Link>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((service) => (
                <ServiceCard key={service.serviceId} service={service} />
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid gap-6 rounded-2xl bg-primary p-8 text-center text-primary-foreground sm:grid-cols-3 sm:p-12">
            <div>
              <p className="font-heading text-4xl font-bold">1,240</p>
              <p className="mt-1 text-sm text-primary-foreground/80">{t('stats.neighbors')}</p>
            </div>
            <div>
              <p className="font-heading text-4xl font-bold">3</p>
              <p className="mt-1 text-sm text-primary-foreground/80">{t('stats.cities')}</p>
            </div>
            <div>
              <p className="font-heading text-4xl font-bold">8,420</p>
              <p className="mt-1 text-sm text-primary-foreground/80">
                {t('stats.tasksCompleted')}
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
