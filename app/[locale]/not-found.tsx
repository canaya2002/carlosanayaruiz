import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Rail } from '@/components/instrument/rail'
import { NAP } from '@/lib/constants'
import { isRevisionOpen } from '@/data/revision-ficha'
import type { StaticPathname } from '@/i18n/routing'

/**
 * ════════════════════════════════════════════════════════════════
 * 404 LOCALIZADA — «sin señal»
 *
 * La alcanza cualquier URL bajo /es o /en que no resolvió ninguna página: el
 * catch-all `app/[locale]/[...rest]/page.tsx` lanza `notFound()` dentro del
 * segmento, así que esta frontera se pinta DENTRO del layout, con header,
 * pie e idioma. Las rutas que no resuelven idioma caen en app/not-found.tsx.
 *
 * Un solo idioma por vista: una página que dice "Page not found / Página no
 * encontrada" se ve rota en los dos.
 *
 * ── LA IDEA ──
 * En «Papel Ahumado» todo se lee por lo que la aguja escribió. Aquí la aguja
 * no encontró nada, así que el trazo se APLANA: una línea recta, sin ruido,
 * con la etiqueta «sin señal». Es la única página del sitio donde la línea de
 * base no se mueve, y por eso significa algo.
 *
 * ── LAS SALIDAS ──
 * Quien cae en un enlace roto se iba porque todas las salidas eran trazo de
 * 14 px. Ahora hay dos botones de latón —los mismos `.btn-primary` y
 * `.btn-secondary` del resto del sitio— y debajo los enlaces de texto con
 * 44 px de alto. En español el primario es la revisión gratis mientras la
 * oferta esté abierta; /en no tiene revisión, así que no se enlaza.
 * ════════════════════════════════════════════════════════════════
 */

export const metadata: Metadata = {
  title: '404',
  robots: { index: false, follow: false },
  alternates: {},
}

type Exit = { href: StaticPathname; label: string }

export default async function LocaleNotFound() {
  const en = (await getLocale()) === 'en'

  const t = await getTranslations('notFound')
  const tn = await getTranslations('nav')

  /**
   * Los dos botones. Con la revisión cerrada, el inicio sube a primario y el
   * contacto ocupa el secundario: nunca un botón hacia una oferta vencida.
   */
  const review = !en && isRevisionOpen()
  const primary: Exit = en
    ? { href: '/', label: 'Go to homepage' }
    : review
      ? { href: '/revision-ficha-google', label: 'Pide tu revisión gratis' }
      : { href: '/', label: 'Ir al inicio' }
  const secondary: Exit = en
    ? { href: '/contacto', label: tn('contact') }
    : review
      ? { href: '/', label: 'Ir al inicio' }
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
        {/* Centrado entre el header y el pliegue a partir de 64rem: la
            sección ocupa la pantalla menos el nav (4.5rem) y el bloque cae
            a la mitad, sin el vacío de abajo. En móvil va arriba, para que
            el botón quede antes del pliegue. */}
        <section className="hero-in flex flex-col px-5 pt-12 pb-16 sm:px-10 sm:pt-16 lg:min-h-[calc(100svh-4.5rem)] lg:justify-center lg:py-16">
          <p className="stamp">{t('title')}</p>

          <h1 className="mt-6 max-w-[18ch] text-hero text-ink">
            {t('heading')}
          </h1>

          {/* El trazo plano. Es lo contrario de `.drum-trace`, que en el
              resto del sitio nunca para: aquí no hay nada que medir, así que
              la línea es recta y quieta. No lleva animación a propósito. */}
          <div
            className="mt-8 flex max-w-[54rem] items-center gap-4 sm:mt-12"
            role="img"
            aria-label={en ? 'No signal' : 'Sin señal'}
          >
            <span className="stamp shrink-0">
              {en ? 'no signal' : 'sin señal'}
            </span>
            <span
              className="h-px flex-1 bg-hairline-strong"
              aria-hidden="true"
            />
          </div>

          <p className="mt-8 max-w-[52ch] font-human text-lead text-ink-muted sm:mt-10">
            {t('lead')}
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
            aria-label={en ? 'Other pages' : 'Otras páginas'}
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
              {en ? 'report the broken link' : 'reportar el enlace roto'}
            </a>
          </nav>
        </section>
      </div>
    </div>
  )
}
