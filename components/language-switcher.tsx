'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Locale } from '@/data/types'

/**
 * Locale switch for the header.
 *
 * Rendered as a real <a href> (via `Link` + `locale`), not a button calling
 * router.replace. Three reasons that matters on a site whose subject is
 * technical SEO:
 *
 *  1. The alternate-locale URL becomes crawlable in-page, reinforcing the
 *     reciprocal hreflang pair rather than relying on the <head> alone.
 *  2. Middle-click, ⌘-click and "open in new tab" work, which they cannot on
 *     a button.
 *  3. It still navigates without a full reload, because `Link` is the
 *     locale-aware wrapper around next/link.
 *
 * `usePathname` returns the INTERNAL (Spanish) pathname, so handing it back to
 * `Link` with the opposite locale resolves to that locale's localised segment:
 * /es/servicios ⇄ /en/services.
 */
export function LanguageSwitcher() {
  const locale = useLocale() as Locale
  const t = useTranslations('language')
  const pathname = usePathname()

  const targetLocale = locale === 'es' ? 'en' : 'es'

  return (
    <Button asChild variant="ghost" size="sm" className="gap-2 text-sm font-medium">
      <Link
        href={pathname}
        locale={targetLocale}
        // The visible label is a language name, which carries no context on its
        // own; the accessible name states the action.
        aria-label={`${t('label')}: ${t('switchTo')}`}
        // Tell crawlers what is on the other end of this link.
        hrefLang={targetLocale}
      >
        <Globe className="size-4" aria-hidden="true" />
        <span className="hidden sm:inline">{t('switchTo')}</span>
        <span className="sm:hidden">{targetLocale.toUpperCase()}</span>
      </Link>
    </Button>
  )
}
