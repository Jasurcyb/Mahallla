import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { OrdersView } from '@/components/orders-view'

export default function OrdersPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-semibold text-foreground">
            Your orders
          </h1>
          <p className="mt-2 text-muted-foreground">
            Track everything you&apos;ve booked from neighbors across your
            mahalla.
          </p>
        </div>
        <OrdersView />
      </main>
      <SiteFooter />
    </div>
  )
}
