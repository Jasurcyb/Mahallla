'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Plus } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/browse', label: 'Browse' },
  { href: '/orders', label: 'My Orders' },
  { href: '/profile', label: 'Profile' },
]

export function SiteHeader() {
  const pathname = usePathname()
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
          <Button size="sm" nativeButton={false} render={<Link href="/post" />}>
            <Plus width={16} height={16} aria-hidden="true" />
            <span className="hidden sm:inline">Post a service</span>
            <span className="sm:hidden">Post</span>
          </Button>
          <Link href="/profile" aria-label="Your profile">
            <Avatar className="size-9 border border-border">
              <AvatarImage src="/avatars/aziza.png" alt="Your profile" />
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
