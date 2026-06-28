'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Globe, Home, Plus } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/language-context'
import { LOCALE_LABELS, type Locale } from '@/lib/translations'

export function SiteHeader() {
  const pathname = usePathname()
  const { locale, setLocale, t } = useLanguage()

  const NAV = [
    { href: '/browse', label: t('nav.browse') },
    { href: '/orders', label: t('nav.myOrders') },
    { href: '/profile', label: t('nav.profile') },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Home width={18} height={18} aria-hidden="true" />
          </span>
          <span className="font-heading text-xl font-semibold text-foreground">
            Mahalla
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-secondary text-secondary-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          {/* Language switcher */}
          <Select value={locale} onValueChange={(v) => setLocale(v as Locale)}>
            <SelectTrigger className="h-9 w-auto gap-1.5 border-border bg-background px-2.5 text-sm" aria-label={t('lang.label')}>
              <Globe width={15} height={15} className="shrink-0 text-muted-foreground" aria-hidden="true" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(LOCALE_LABELS) as [Locale, string][]).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button size="sm" nativeButton={false} render={<Link href="/post" />}>
            <Plus width={16} height={16} aria-hidden="true" />
            <span className="hidden sm:inline">{t('nav.postService')}</span>
            <span className="sm:hidden">{t('nav.postShort')}</span>
          </Button>
          <Link href="/profile" aria-label={t('nav.profile')}>
            <Avatar className="size-9 border border-border">
              <AvatarImage src="/avatars/aziza.png" alt={t('nav.profile')} />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="flex items-center gap-1 overflow-x-auto border-t border-border px-4 py-2 md:hidden">
        {NAV.map((item) => {
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-secondary text-secondary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
