import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import {
  ArrowRight,
  ArrowUpRight,
  Compass,
  Mail,
  UserRound,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NAP } from '@/lib/constants'
import type { StaticPathname } from '@/i18n/routing'

/**
 * ════════════════════════════════════════════════════════════════
 * 404 LOCALIZADA
 *
 * La alcanza cualquier URL que sí resolvió un segmento de idioma válido pero
 * ninguna página: /es/servicios-antiguos, /en/blog, un enlace profundo viejo,
 * un slug renombrado. Las rutas que no resuelven idioma caen en
 * app/not-found.tsx, que al no tener contexto de i18n es bilingüe por
 * necesidad — esta no lo es, y no debe serlo: una página que dice
 * "Page not found / Página no encontrada" se ve rota en los dos idiomas.
 *
 * Tres cosas ya son ciertas porque esta frontera renderiza dentro de
 * app/[locale]/layout.tsx, y ninguna se rehace aquí: el layout es dueño de
 * <html> y <body>, el header y el footer ya enmarcan el contenido, y
 * `setRequestLocale` ya corrió — así que `getTranslations` y `getLocale`
 * resuelven contra el idioma del visitante sin tocar headers(), que es lo que
 * mantiene esta ruta renderizable de forma estática.
 *
 * Una 404 es una bifurcación, no un muro. El visitante quería algo y la URL le
 * falló, así que además del enlace al inicio se ofrecen las tres salidas que
 * cubren casi cualquier intención que llegue a este sitio.
 * ════════════════════════════════════════════════════════════════
 */

/**
 * La metadata de la convención `not-found` se recolecta al final del árbol de
 * segmentos, así que este objeto REEMPLAZA —no fusiona— lo que declaró
 * app/[locale]/layout.tsx. Los dos reemplazos son deliberados:
 *
 *  - `robots`, porque el layout dice index/follow y una 404 indexable compite
 *    en la SERP con las páginas reales a las que está supliendo. El código de
 *    estado 404 es la señal principal; esto es el cinturón de sus tirantes.
 *  - `alternates`, porque heredar el canonical del layout declararía que el
 *    canonical de esta URL es la home del idioma. Eso es señal de soft-404 y
 *    contradice el noindex que tiene al lado. Vaciarlo tira el self-canonical
 *    y con él el par de hreflang — correcto, porque una 404 no tiene
 *    contraparte traducida a la que apuntar.
 *
 * Estática y no generada: una frontera de error no recibe `params`, así que
 * aquí no hay idioma sobre el que ramificar. No cuesta nada — "404" se lee
 * igual en los dos idiomas y la plantilla de título del layout sigue
 * agregando la marca. `notFound.title` lleva la misma cadena para la píldora
 * visible.
 */
export const metadata: Metadata = {
  title: '404',
  robots: { index: false, follow: false },
  alternates: {},
}

export default async function NotFound() {
  const en = (await getLocale()) === 'en'

  const t = await getTranslations('notFound')
  const tn = await getTranslations('nav')

  /**
   * Las salidas, en el orden en que es más probable que sean lo que el
   * visitante buscaba. Las pistas son condicionales en línea y no claves
   * nuevas: messages/*.json lo edita otro agente y una 404 no vale un
   * conflicto de merge en el catálogo de copy.
   */
  const exits: {
    href: StaticPathname
    label: string
    hint: string
    icon: LucideIcon
    step: string
  }[] = [
    {
      href: '/servicios',
      label: tn('services'),
      hint: en
        ? 'Technical SEO, web development, AI automation and dashboards.'
        : 'SEO técnico, desarrollo web, automatización con IA y dashboards.',
      icon: Wrench,
      step: 'step-4',
    },
    {
      href: '/sobre-mi',
      label: tn('about'),
      hint: en
        ? 'Who I am and the stack I actually work in.'
        : 'Quién soy y con qué stack trabajo de verdad.',
      icon: UserRound,
      step: 'step-5',
    },
    {
      href: '/contacto',
      label: tn('contact'),
      hint: en
        ? 'Tell me which link sent you here and I will point you to the right page.'
        : 'Dime qué enlace te trajo aquí y te apunto a la página correcta.',
      icon: Mail,
      step: 'step-6',
    },
  ]

  /**
   * El catálogo trae el encabezado como una frase completa ("Esta página no
   * existe") y el gradiente debe caer solo sobre el cierre: un h1 entero
   * recortado pierde legibilidad. Se parte por las dos últimas palabras en
   * lugar de agregar una clave nueva, y el corte cae donde debe en los dos
   * idiomas ("no existe" / "doesn’t exist"). Si el copy cambiara, lo peor que
   * pasa es que el gradiente empiece en otra palabra — el encabezado completo
   * se renderiza siempre.
   */
  const words = t('heading').split(' ')
  const splitAt = words.length > 2 ? words.length - 2 : 0
  const headingPlain = words.slice(0, splitAt).join(' ')
  const headingAccent = words.slice(splitAt).join(' ')

  return (
    <>
      {/* ══ CABECERA ══════════════════════════════════════════════
          Misma coreografía de entrada que el hero de la home: malla animada y
          cuadrícula que se desvanece, las dos decorativas, las dos en -z-10 y
          ninguna captura eventos. Nada de `reveal` en esta página: una 404
          cabe casi entera en la primera pantalla, así que las salidas también
          entran al cargar y no esperan un scroll que quizá nunca ocurra. */}
      <section className="relative isolate overflow-hidden">
        <div className="mesh" aria-hidden="true" />
        <div className="grid-fade" aria-hidden="true" />

        <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-16 sm:px-8 sm:pb-20 sm:pt-24">
          <div className="max-w-2xl">
            <p className="eyebrow enter-scale">
              <Compass className="size-3.5" aria-hidden="true" />
              {t('title')}
            </p>

            <h1 className="enter-blur step-1 mt-6 text-d1 text-ink">
              {headingPlain ? `${headingPlain} ` : null}
              <span className="grad-text">{headingAccent}</span>
            </h1>

            <p className="enter step-2 mt-7 text-lead text-ink-muted">
              {t('lead')}
            </p>

            <div className="enter step-3 mt-9 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Button asChild size="lg" className="sheen shadow-glow-brand">
                <Link href="/">
                  {t('goHome')}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>

              {/* El lead pide que el visitante avise del enlace roto; sin este
                  mailto la invitación no tendría dónde ocurrir. El correo sale
                  de NAP, nunca escrito a mano. */}
              <a
                href={`mailto:${NAP.email}`}
                className="inline-flex min-h-[44px] items-center text-sm font-semibold text-brand-strong underline underline-offset-4 transition-colors hover:text-brand"
              >
                {NAP.email}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SALIDAS ═══════════════════════════════════════════════
          Mismo vocabulario que la lista de servicios de la home: azulejo con
          gradiente, destino y la razón para hacer clic. Es un landmark de
          navegación nombrado por su propio encabezado visible, así el bloque
          de recuperación se alcanza de una vez en lugar de rastrearse a mano
          en el cuerpo de la página. */}
      <section className="border-t border-hairline bg-ground-tint">
        <nav
          aria-labelledby="not-found-exits"
          className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20"
        >
          <h2 id="not-found-exits" className="eyebrow enter step-3">
            {t('orTry')}
          </h2>

          <ul className="mt-8 grid gap-6 md:grid-cols-3">
            {exits.map((exit) => {
              const Icon = exit.icon
              return (
                <li key={exit.href} className={`enter ${exit.step}`}>
                  <Link
                    href={exit.href}
                    className="card card-hover group flex h-full flex-col p-6"
                  >
                    <span
                      className="grad-deco inline-flex size-12 items-center justify-center rounded-xl text-white shadow-glow-brand"
                      aria-hidden="true"
                    >
                      <Icon className="size-6" />
                    </span>

                    <h3 className="mt-5 text-d3 text-ink transition-colors group-hover:text-brand-strong">
                      {exit.label}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
                      {exit.hint}
                    </p>

                    {/* Etiqueta genérica y no `exit.label` otra vez: repetir el
                        destino dejaría al enlace con un nombre accesible que
                        dice dos veces lo mismo. */}
                    <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-strong">
                      {en ? 'Open page' : 'Abrir página'}
                      <ArrowUpRight
                        className="size-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </section>
    </>
  )
}
