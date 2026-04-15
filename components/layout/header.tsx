'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { Menu, X, ChevronDown, Search, Globe, Bot, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/language-switcher'
import { SOCIAL_LINKS } from '@/lib/constants'

const NAV_ITEMS = [
  { href: '/' as const, key: 'home' },
  { href: '/sobre-mi' as const, key: 'about' },
  { href: '/libros' as const, key: 'books' },
  { href: '/contacto' as const, key: 'contact' },
] as const

const SERVICE_ITEMS = [
  { href: '/seo-tecnico' as const, key: 'seoTecnico', icon: Search },
  { href: '/desarrollo-web' as const, key: 'desarrolloWeb', icon: Globe },
  { href: '/automatizacion-ia' as const, key: 'automatizacionIA', icon: Bot },
  { href: '/dashboards' as const, key: 'dashboardsLabel', icon: BarChart3 },
] as const

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const servicesRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const t = useTranslations('nav')
  const tf = useTranslations('footer')

  const isServicePage = SERVICE_ITEMS.some((s) => pathname === s.href)

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setServicesOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4" aria-label="Main navigation">
        <Link href="/" className="text-lg font-bold tracking-tight transition-colors hover:text-primary">
          Carlos Anaya Ruiz
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {/* Home */}
          <Link
            href="/"
            className={cn(
              'px-3 py-2 text-sm font-medium transition-colors hover:text-primary rounded-md',
              pathname === '/' ? 'text-primary bg-accent' : 'text-muted-foreground'
            )}
          >
            {t('home')}
          </Link>

          {/* Services dropdown */}
          <div ref={servicesRef} className="relative">
            <button
              onClick={() => setServicesOpen(!servicesOpen)}
              className={cn(
                'flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors hover:text-primary rounded-md',
                isServicePage ? 'text-primary bg-accent' : 'text-muted-foreground'
              )}
              aria-expanded={servicesOpen}
              aria-haspopup="true"
            >
              {tf('services')}
              <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', servicesOpen && 'rotate-180')} />
            </button>
            {servicesOpen && (
              <div className="absolute left-0 top-full mt-1 w-56 rounded-lg border bg-background p-2 shadow-lg">
                {SERVICE_ITEMS.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      onClick={() => setServicesOpen(false)}
                      className={cn(
                        'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent',
                        pathname === item.href ? 'text-primary bg-accent/50' : 'text-muted-foreground'
                      )}
                    >
                      <Icon className="h-4 w-4 text-primary" />
                      {tf(item.key)}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* About, Resources, Contact */}
          {NAV_ITEMS.filter((item) => item.key !== 'home').map((item) => (
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
            <a href={SOCIAL_LINKS.fiverr} target="_blank" rel="nofollow noopener noreferrer">
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
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className={cn('rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent', pathname === '/' ? 'bg-accent text-primary' : 'text-muted-foreground')}>
                {t('home')}
              </Link>

              {/* Services section in mobile */}
              <p className="mt-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">{tf('services')}</p>
              {SERVICE_ITEMS.map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.key} href={item.href} onClick={() => setMobileMenuOpen(false)} className={cn('flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent', pathname === item.href ? 'bg-accent text-primary' : 'text-muted-foreground')}>
                    <Icon className="h-4 w-4 text-primary" />
                    {tf(item.key)}
                  </Link>
                )
              })}

              <div className="my-1 border-t" />

              {NAV_ITEMS.filter((item) => item.key !== 'home').map((item) => (
                <Link key={item.key} href={item.href} onClick={() => setMobileMenuOpen(false)} className={cn('rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent', pathname === item.href ? 'bg-accent text-primary' : 'text-muted-foreground')}>
                  {t(item.key)}
                </Link>
              ))}
              <Button asChild size="sm" className="mt-2">
                <a href={SOCIAL_LINKS.fiverr} target="_blank" rel="nofollow noopener noreferrer" onClick={() => setMobileMenuOpen(false)}>
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
