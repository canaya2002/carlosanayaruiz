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
import { PointerGlow } from '@/components/motion/pointer-glow'
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

/**
 * CAPAS DE FONDO. Los cuatro <i> son obligatorios: cada uno es un campo de
 * color distinto, y sin ellos el cristal de esta página se vería como un
 * rectángulo blanco sobre un fondo casi blanco.
 *
 * Dos secciones con aurora y no tres: esta página entra casi entera en la
 * primera pantalla, así que no hay una tercera banda que la necesite. El
 * presupuesto medido es de tres por página, el pie aparte.
 */
function Backdrop({ glow = false }: { glow?: boolean }) {
  return (
    <>
      <div className="aurora" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="grain" aria-hidden="true" />
      <div className="grid-fade" aria-hidden="true" />
      {glow ? <PointerGlow /> : null}
    </>
  )
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
          Aurora a plena intensidad, grano, cuadrícula y el resplandor del
          puntero, todas decorativas, todas en -z-10 y ninguna capturando
          eventos. Nada de `.reveal` en esta página: una 404 cabe casi entera en
          la primera pantalla, así que las salidas también entran al cargar y no
          esperan un scroll que quizá nunca ocurra. */}
      <section className="relative isolate overflow-hidden">
        <Backdrop glow />

        <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-16 sm:px-8 sm:pb-20 sm:pt-24">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:items-center">
            <div className="max-w-2xl">
              <p className="eyebrow enter-scale">
                <Compass className="size-3.5" aria-hidden="true" />
                {t('title')}
              </p>

              {/* `text-ink` en la primera mitad: es el único color de texto que
                  aguanta ir DIRECTO sobre la aurora (10.2:1). El recorte con
                  gradiente usa `--grad-ink`, cuyos stops se detienen en cielo
                  oscuro (≥5.7:1) precisamente para poder llevar texto. */}
              <h1 className="enter-blur step-1 mt-6 text-hero text-ink">
                {headingPlain ? `${headingPlain} ` : null}
                <span className="grad-text">{headingAccent}</span>
              </h1>

              {/* El lead va dentro de cristal por contraste, no por adorno:
                  sobre la aurora `ink-muted` cae a 3.83:1. Dentro de
                  `.glass-strong` mide 5.1. */}
              <div className="glass glass-strong glass-spec enter step-2 mt-8 p-6 sm:p-7">
                <p className="text-lead text-ink-muted">{t('lead')}</p>

                <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-3">
                  <Button asChild size="lg" className="sheen shadow-glow-brand">
                    <Link href="/">
                      {t('goHome')}
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </Button>

                  {/* El lead pide que el visitante avise del enlace roto; sin
                      este mailto la invitación no tendría dónde ocurrir. El
                      correo sale de NAP, nunca escrito a mano. */}
                  <a
                    href={`mailto:${NAP.email}`}
                    className="press inline-flex min-h-11 items-center rounded-lg px-2 text-sm font-semibold text-brand-strong underline underline-offset-4 hover:bg-surface hover:shadow-lift-1"
                  >
                    {NAP.email}
                  </a>
                </div>
              </div>
            </div>

            {/* ── EL 404, EN GRANDE Y EN 3D ──
                Es decorativo y por eso `aria-hidden`: el código de estado real
                lo da el servidor y el número visible ya está en la píldora de
                arriba (`notFound.title`). Flota con `.float`, que solo anima
                `transform`, y el halo se desplaza con `.grad-drift`, que mueve
                una capa recortada en vez de animar un `background-position`.

                El `.float` va en el NÚMERO y no en un panel de cristal: mover
                una superficie con `backdrop-filter` obliga a rerasterizar el
                desenfoque en cada frame. */}
            <div
              aria-hidden="true"
              className="enter-scale step-3 relative mx-auto hidden w-full max-w-[18rem] lg:block"
            >
              <div className="absolute -inset-6 opacity-90">
                <div className="grad-drift float-slow size-full rounded-[3rem]" />
              </div>
              {/* ⚠ BLANCO, Y AQUÍ SÍ ES LEGAL. La regla del sistema es que el
                  texto sobre CRISTAL es siempre tinta (el blanco sobre un panel
                  de cristal mide 1.96:1). Esto no es cristal: es `.grad-drift`,
                  que pinta `--grad-fill`, el gradiente de RELLENO CON TEXTO
                  BLANCO, cuyos stops pasan 5.3:1 contra blanco. La primera
                  versión usaba `.grad-text` encima de la placa y quedaba azul
                  oscuro sobre azul medio: se vio en captura a 1440px. */}
              <p
                data-numeric=""
                className="float relative select-none text-center font-display text-[9rem] font-bold leading-none tracking-tighter text-white"
              >
                404
              </p>
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
      <section className="relative isolate overflow-hidden border-t border-hairline bg-ground-tint">
        <Backdrop />

        <nav
          aria-labelledby="not-found-exits"
          className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20"
        >
          <h2 id="not-found-exits" className="eyebrow enter step-3">
            {t('orTry')}
          </h2>

          {/* TRES NODOS, TRES TRANSFORMES, Y NO ES REDUNDANCIA:
              · el <li> lleva la entrada (`.enter`), y una animación con
                `fill: both` se queda dueña del `transform` de su elemento para
                siempre;
              · el <div> lleva la inclinación en hover (`.tilt-hover`), con la
                perspectiva compartida en el <ul> (`.scene`) para que las tres
                tarjetas tengan el mismo punto de fuga;
              · el <a> lleva el tacto (`.press`), que baja la escala al hacer
                clic con `--ease-press`.
              Si dos de los tres compartieran nodo, el último en el CSS ganaría
              y uno de los tres efectos no se vería. */}
          <ul className="scene mt-8 grid gap-6 md:grid-cols-3">
            {exits.map((exit) => {
              const Icon = exit.icon
              return (
                <li key={exit.href} className={`enter ${exit.step}`}>
                  <div className="tilt-hover h-full rounded-2xl">
                    <Link
                      href={exit.href}
                      className="glass glass-spec press sheen group flex h-full flex-col p-6"
                    >
                      <span
                        className="grad-deco inline-flex size-12 items-center justify-center rounded-xl text-white shadow-glow-brand"
                        aria-hidden="true"
                      >
                        <Icon className="size-6" />
                      </span>

                      <h3 className="mt-5 text-d3 text-ink transition-colors duration-300 group-hover:text-brand-strong">
                        {exit.label}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
                        {exit.hint}
                      </p>

                      {/* Etiqueta genérica y no `exit.label` otra vez: repetir
                          el destino dejaría al enlace con un nombre accesible
                          que dice dos veces lo mismo. */}
                      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-strong">
                        {en ? 'Open page' : 'Abrir página'}
                        <ArrowUpRight
                          className="size-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </span>
                    </Link>
                  </div>
                </li>
              )
            })}
          </ul>
        </nav>
      </section>
    </>
  )
}
