import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { BrowseView } from '@/components/browse-view'
import { CATEGORIES } from '@/lib/categories'
import type { Category } from '@/types'

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const valid = CATEGORIES.some((c) => c.id === category)
  const initial = (valid ? (category as Category) : 'all') as Category | 'all'

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <BrowseView initialCategory={initial} />
      </main>
      <SiteFooter />
    </div>
  )
}
