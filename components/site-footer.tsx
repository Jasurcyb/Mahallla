'use client'

import Link from 'next/link'
import { Home } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'

export function SiteFooter() {
  const { t } = useLanguage()

  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Home width={16} height={16} aria-hidden="true" />
          </span>
          <div>
            <p className="font-heading text-lg font-semibold text-foreground">
              Mahalla
            </p>
            <p className="text-sm text-muted-foreground">
              {t('footer.tagline')}
            </p>
          </div>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <Link href="/browse" className="hover:text-foreground">
            {t('nav.browse')}
          </Link>
          <Link href="/post" className="hover:text-foreground">
            {t('nav.postService')}
          </Link>
          <Link href="/orders" className="hover:text-foreground">
            {t('nav.myOrders')}
          </Link>
          <Link href="/profile" className="hover:text-foreground">
            {t('nav.profile')}
          </Link>
        </nav>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        {t('footer.copyright')} © {new Date().getFullYear()} Mahalla.
      </div>
    </footer>
  )
}
