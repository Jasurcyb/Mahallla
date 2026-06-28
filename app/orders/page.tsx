import { cookies } from 'next/headers'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { OrdersView } from '@/components/orders-view'
import { getTranslator, type Locale } from '@/lib/translations'

const VALID_LOCALES: Locale[] = ['en', 'ru', 'uz']

export default async function OrdersPage() {
  const cookieStore = await cookies()
  const raw = cookieStore.get('lang')?.value ?? 'ru'
  const locale: Locale = VALID_LOCALES.includes(raw as Locale)
    ? (raw as Locale)
    : 'ru'
  const t = getTranslator(locale)

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-semibold text-foreground">
            {t('orders.title')}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {t('orders.subtitle')}
          </p>
        </div>
        <OrdersView />
      </main>
      <SiteFooter />
    </div>
  )
}
