import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Rail } from '@/components/instrument/rail'
import { NAP } from '@/lib/constants'
import type { StaticPathname } from '@/i18n/routing'

/**
 * ════════════════════════════════════════════════════════════════
 * 404 LOCALIZADA — «sin señal»
 *
 * La alcanza cualquier URL que sí resolvió un segmento de idioma válido pero
 * ninguna página: /es/servicios-antiguos, /en/blog, un enlace profundo viejo,
 * un slug renombrado. Las rutas que no resuelven idioma caen en
 * app/not-found.tsx, que al no tener contexto de i18n es bilingüe por
 * necesidad — esta no lo es, y no debe serlo: una página que dice
 * "Page not found / Página no encontrada" se ve rota en los dos idiomas.
 *
 * ── LA IDEA ──
 * En «Papel Ahumado» todo se lee por lo que la aguja escribió. Aquí la aguja
 * no encontró nada, así que el trazo se APLANA: una línea recta, sin ruido,
 * con la etiqueta «sin señal». Es la única página del sitio donde la línea de
 * base no se mueve, y por eso significa algo.
 *
 * El layout (`app/[locale]/layout.tsx`) sigue siendo dueño del header, el
 * footer y el idioma; aquí no se rehace nada de eso.
 * ════════════════════════════════════════════════════════════════
 */

export const metadata: Metadata = {
  title: '404',
  robots: { index: false, follow: false },
  alternates: {},
}

export default async function LocaleNotFound() {
  const en = (await getLocale()) === 'en'

  const t = await getTranslations('notFound')
  const tn = await getTranslations('nav')

  /**
   * Las salidas, en el orden en que es más probable que sean lo que el
   * visitante buscaba. Las pistas van en línea y no como claves nuevas: una
   * 404 no vale un conflicto de merge en el catálogo de copy.
   */
  const exits: {
    href: StaticPathname
    label: string
    hint: string
  }[] = [
    {
      href: '/servicios',
      label: tn('services'),
      hint: en
        ? 'Technical SEO, web development, AI automation and dashboards.'
        : 'SEO técnico, desarrollo web, automatización con IA y dashboards.',
    },
    {
      href: '/sobre-mi',
      label: tn('about'),
      hint: en
        ? 'Who I am and the stack I actually work in.'
        : 'Quién soy y con qué stack trabajo de verdad.',
    },
    {
      href: '/contacto',
      label: tn('contact'),
      hint: en
        ? 'Tell me which link sent you here and I will point you to the right page.'
        : 'Dime qué enlace te trajo aquí y te apunto a la página correcta.',
    },
  ]

  const channelId = (i: number) => String.fromCharCode(97 + i)

  return (
    <div
      className="grid"
      style={{ gridTemplateColumns: 'var(--tape-w) minmax(0,1fr)' }}
    >
      <Rail />

      <div className="min-w-0">
        <section className="px-5 pt-16 pb-20 sm:px-10">
          <p className="stamp">{t('title')}</p>

          <h1 className="mt-6 max-w-[18ch] text-hero text-ink">
            {t('heading')}
          </h1>

          {/* El trazo plano. Es lo contrario de `.trace`, que en el resto del
              sitio nunca para: aquí no hay nada que medir, así que la línea
              es recta y quieta. No lleva animación a propósito. */}
          <div
            className="mt-12 flex items-center gap-4"
            role="img"
            aria-label={en ? 'No signal' : 'Sin señal'}
          >
            <span className="stamp shrink-0">
              {en ? 'no signal' : 'sin señal'}
            </span>
            <span className="h-px flex-1 bg-hairline-strong" aria-hidden="true" />
          </div>

          <p className="mt-10 max-w-[52ch] font-human text-lead text-ink-muted">
            {t('lead')}
          </p>

          <p className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            <Link className="link-stylus" href="/">
              {t('goHome')} →
            </Link>
            <a className="link-stylus" href={`mailto:${NAP.email}`}>
              {en ? 'report the broken link' : 'reportar el enlace roto'} →
            </a>
          </p>
        </section>

        <section className="border-t border-hairline px-5 pb-24 pt-14 sm:px-10">
          <p className="stamp">{t('orTry')}</p>

          <ul className="reveal-stagger mt-10">
            {exits.map((exit, i) => (
              <li key={exit.href}>
                <Link href={exit.href} className="channel">
                  <span className="channel-id">ch {channelId(i)}</span>
                  <span>
                    <span className="text-d3 text-ink">{exit.label}</span>
                    <span className="mt-1 block max-w-[52ch] text-sm text-ink-muted">
                      {exit.hint}
                    </span>
                    <span className="channel-pen mt-3" aria-hidden="true" />
                  </span>
                  <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
