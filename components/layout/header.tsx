'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/language-switcher'
import { SOCIAL_LINKS } from '@/lib/constants'

const NAV_ITEMS = [
  { href: '/' as const, key: 'home' },
  { href: '/libros' as const, key: 'books' },
  { href: '/sobre-mi' as const, key: 'about' },
  { href: '/contacto' as const, key: 'contact' },
] as const

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const t = useTranslations('nav')

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4" aria-label="Main navigation">
        {/* NAP: Name always exactly "Carlos Anaya Ruíz" */}
        <Link href="/" className="text-lg font-bold tracking-tight transition-colors hover:text-primary">
          Carlos Anaya Ruíz
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                'px-3 py-2 text-sm font-medium transition-colors hover:text-primary rounded-md',
                pathname === item.href ? 'text-primary bg-accent' : 'text-muted-foreground'
              )}
            >
              {t(item.key)}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher />
          <Button asChild size="sm">
            <a href={SOCIAL_LINKS.fiverr} target="_blank" rel="noopener noreferrer">
              {t('hireMe')}
            </a>
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label={mobileMenuOpen ? t('closeMenu') : t('openMenu')} aria-expanded={mobileMenuOpen}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t bg-background md:hidden" role="dialog" aria-label="Mobile menu">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => (
                <Link key={item.key} href={item.href} onClick={() => setMobileMenuOpen(false)} className={cn('rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent', pathname === item.href ? 'bg-accent text-primary' : 'text-muted-foreground')}>
                  {t(item.key)}
                </Link>
              ))}
              <Button asChild size="sm" className="mt-2">
                <a href={SOCIAL_LINKS.fiverr} target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)}>
                  {t('hireMe')}
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
