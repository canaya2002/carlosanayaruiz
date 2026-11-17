'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Rail } from '@/components/instrument/rail'
import { NAP } from '@/lib/constants'
import { isRevisionOpen } from '@/data/revision-ficha'
import type { StaticPathname } from '@/i18n/routing'

/**
 * 404 dentro de un segmento que sí casó (`notFound()` en un artículo o una
 * ficha). Es un componente de cliente a propósito: `getLocale()` del
 * servidor lee `headers()` cuando el layout no alcanzó a fijar el idioma, y
 * esa llamada vuelve dinámico todo el árbol de `[locale]`. `useLocale` lee
 * el provider del layout, que ya es estático.
 *
 * Las URLs que no casan con ninguna página no llegan aquí. Las responde
 * `app/[locale]/[...rest]/route.ts` con status 404 y HTML propio, para no
 * lanzar `notFound()` —en Next 16.4 eso sirve el shell vacío
 * `__next_error__`.
 */

const COPY = {
  es: {
    title: '404',
    heading: 'Esta página no existe',
    lead: 'El enlace está roto o la URL cambió de lugar. Si llegaste desde Google, avísame y la redirijo: una 404 indexada es un error mío, no tuyo.',
    review: 'Pide tu revisión gratis',
    home: 'Ir al inicio',
    signal: 'Sin señal',
    signalMark: 'sin señal',
    other: 'Otras páginas',
    report: 'reportar el enlace roto',
  },
  en: {
    title: '404',
    heading: "This page doesn't exist",
    lead: "The link is broken, or the URL moved. If you got here from Google, tell me and I'll redirect it: an indexed 404 is my bug, not yours.",
    review: 'Pide tu revisión gratis',
    home: 'Go to homepage',
    signal: 'No signal',
    signalMark: 'no signal',
    other: 'Other pages',
    report: 'report the broken link',
  },
} as const

type Exit = { href: StaticPathname; label: string }

export default function LocaleNotFound() {
  const locale = useLocale()
  const en = locale === 'en'
  const t = COPY[en ? 'en' : 'es']
  const tn = useTranslations('nav')

  const review = !en && isRevisionOpen()
  const primary: Exit = en
    ? { href: '/', label: t.home }
    : review
      ? { href: '/revision-ficha-google', label: t.review }
      : { href: '/', label: t.home }
  const secondary: Exit = en
    ? { href: '/contacto', label: tn('contact') }
    : review
      ? { href: '/', label: t.home }
      : { href: '/contacto', label: tn('contact') }

  const links: Exit[] = en
    ? [{ href: '/servicios', label: tn('services') }]
    : [
        { href: '/servicios', label: tn('services') },
        { href: '/blog', label: tn('blog') },
        ...(review
          ? [{ href: '/contacto' as const, label: tn('contact') }]
          : []),
      ]

  return (
    <div
      className="grid"
      style={{ gridTemplateColumns: 'var(--tape-w) minmax(0,1fr)' }}
    >
      <Rail />
      <div className="min-w-0">
        <section className="hero-in flex flex-col px-5 pt-12 pb-16 sm:px-10 sm:pt-16 lg:min-h-[calc(100svh-4.5rem)] lg:justify-center lg:py-16">
          <p className="stamp">{t.title}</p>
          <h1 className="mt-6 max-w-[18ch] text-hero text-ink">{t.heading}</h1>
          <div
            className="mt-8 flex max-w-[54rem] items-center gap-4 sm:mt-12"
            role="img"
            aria-label={t.signal}
          >
            <span className="stamp shrink-0">{t.signalMark}</span>
            <span className="h-px flex-1 bg-hairline-strong" aria-hidden="true" />
          </div>
          <p className="mt-8 max-w-[52ch] font-human text-lead text-ink-muted sm:mt-10">
            {t.lead}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center">
            <Link className="btn-primary" href={primary.href}>
              {primary.label}
              <span className="btn-arrow" aria-hidden="true">
                →
              </span>
            </Link>
            <Link className="btn-secondary" href={secondary.href}>
              {secondary.label}
            </Link>
          </div>
          <nav
            aria-label={t.other}
            className="mt-6 flex flex-wrap gap-x-8"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                className="link-stylus inline-flex min-h-11 items-center"
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
            <a
              className="link-stylus inline-flex min-h-11 items-center"
              href={`mailto:${NAP.email}`}
            >
              {t.report}
            </a>
          </nav>
        </section>
      </div>
    </div>
  )
}
