import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  FileText,
  Sparkles,
  Trophy,
  type LucideIcon,
} from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Button } from '@/components/ui/button'
import { Badge, type BadgeProps } from '@/components/ui/badge'
import { Carousel } from '@/components/ui/carousel'
import { GlassPanel } from '@/components/ui/glass-panel'
import { ImageSlot } from '@/components/ui/image-slot'
import { Metric } from '@/components/ui/metric'
import { Counter } from '@/components/motion/counter'
import { PointerGlow } from '@/components/motion/pointer-glow'
import { Tilt3D } from '@/components/motion/tilt-3d'
import { getAwards, type AwardId, type AwardKind } from '@/data/awards'
import { getCompanyBySlug } from '@/data/companies'
import { NAP, routeUrl } from '@/lib/constants'
import { formatShortDate } from '@/lib/utils'
import { generatePageMetadata } from '@/lib/seo'
import {
  generateWebPageSchema,
  generateBreadcrumbSchema,
  type SchemaGraph,
} from '@/lib/schema'
import type { StaticPathname } from '@/i18n/routing'
import { Locale } from '@/data/types'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const en = locale === 'en'

  return generatePageMetadata({
    locale: locale as Locale,
    route: 'premios',
    title: en ? 'Awards and recognitions' : 'Premios y reconocimientos',
    // La descripción nombra al emisor de cada cosa, porque eso es lo
    // verificable. No dice "premiado" a secas: dos de las tres entradas no son
    // un primer lugar y la tercera no es un premio, es un examen aprobado.
    description: en
      ? 'NASA Space Apps "Galactic Problem Solver" recognition, first place at a 2022 hackathon, and TOEFL iBT 92. Each one with the organisation that granted it and the date.'
      : 'Reconocimiento "Galactic Problem Solver" de NASA Space Apps, primer lugar en hackathon 2022 y TOEFL iBT 92. Cada uno con la organización que lo otorgó y la fecha.',
  })
}

/**
 * ════════════════════════════════════════════════════════════════
 * CAPAS DE FONDO — el conjunto que hace visible el cristal
 *
 * Aurora + grano + cuadrícula, y opcionalmente el resplandor del puntero. Van
 * juntas porque son inseparables: el cristal solo existe si hay algo saturado
 * detrás que difuminar, y sobre un fondo casi blanco un panel translúcido se ve
 * exactamente igual que un panel blanco. Los cuatro <i> son obligatorios —
 * cada uno es un campo de color distinto.
 *
 * ── CUÁNTAS CABEN, MEDIDO ──
 * Tres secciones con aurora por página y ni una más. Con cinco se agota el
 * presupuesto de capas compuestas, el navegador devuelve las animaciones al
 * hilo principal y TODA animación en bucle empieza a costar un recálculo de
 * estilo por frame: 180 en 3 s en reposo contra un presupuesto de 20.
 * Aquí las tres son las que llevan cristal encima: la cabecera, el carrusel y
 * el listado. Las demás secciones ponen su color con un gradiente fijo
 * (`.grad-soft`), que no se anima y no cuesta capa.
 * Verifica: node scripts/perf-probe.mjs http://localhost:3000/es/premios
 * ════════════════════════════════════════════════════════════════
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

/**
 * Qué tipo de cosa es cada entrada, en icono y en etiqueta.
 *
 * El campo `kind` de data/awards.ts existe justamente para esto: un
 * reconocimiento, un primer lugar y un examen aprobado no son lo mismo, y
 * ponerles a los tres la palabra "premio" exageraría dos de ellos. El badge es
 * lo que evita esa exageración, así que no es decoración.
 *
 * El variant `gradient` (relleno `.grad-fill`, texto blanco a 5.3:1) se reserva
 * para la competencia, que es la única entrada que sí fue un primer lugar.
 * Ninguno es el variant `glass`: estos badges viven DENTRO de paneles de
 * cristal, y cristal sobre cristal difumina dos veces.
 */
const KIND_META: Record<
  AwardKind,
  { icon: LucideIcon; variant: BadgeProps['variant'] }
> = {
  recognition: { icon: Sparkles, variant: 'sky' },
  competition: { icon: Trophy, variant: 'gradient' },
  certification: { icon: BadgeCheck, variant: 'neutral' },
}

/**
 * Premio → slug del proyecto en data/companies.ts.
 *
 * Solo dos de las tres entradas corresponden a un proyecto con página propia; la
 * certificación TOEFL no es un proyecto y por eso no aparece aquí. El enlace se
 * dibuja únicamente si `getCompanyBySlug` encuentra la empresa, así que borrar
 * una entrada de companies.ts no deja un enlace roto detrás.
 */
const PROJECT_SLUG_BY_AWARD: Partial<Record<AwardId, string>> = {
  'nasa-spaceapps': 'aurascope',
  'logiroute-ai': 'logiroute-ai',
}

/**
 * Ruta del archivo de imagen de cada premio, derivada del id.
 *
 * Hoy ninguna existe, y eso es exactamente lo que el hueco anuncia en pantalla:
 * `<ImageSlot>` dibuja un patrón y escribe encima la ruta que le falta. El día
 * que el archivo se copie a public/premios/, se le pasa `filled` y el hueco pasa
 * a ser la foto sin tocar nada más.
 */
function awardImagePath(id: AwardId): string {
  return `/premios/${id}.png`
}

export default async function AwardsPage({ params }: Props) {
  const { locale: rawLocale } = await params
  setRequestLocale(rawLocale)

  const locale = rawLocale as Locale
  const en = locale === 'en'

  const t = await getTranslations('premios')
  const tl = await getTranslations('a11y')
  const tu = await getTranslations('common')

  const awards = getAwards(locale)

  // Todas las cifras de la fila de métricas se calculan aquí, sobre el arreglo
  // real. Ninguna está escrita a mano: si mañana entra una cuarta entrada, los
  // tres números cambian solos.
  const sorted = [...awards].sort((a, b) => b.date.localeCompare(a.date))
  const latest = sorted[0]
  const latestYear = latest?.date.slice(0, 4) ?? ''
  const organizations = new Set(awards.map((award) => award.organization)).size

  const kindLabel: Record<AwardKind, string> = {
    recognition: t('kindRecognition'),
    competition: t('kindCompetition'),
    certification: t('kindCertification'),
  }

  /**
   * Las tres cifras de la cabecera, las tres derivadas del arreglo. El año del
   * más reciente no cuenta desde cero: un contador subiendo hasta 2024 se lee
   * como una cifra, no como una fecha.
   *
   * `float` alterna entre las dos duraciones que existen (6 s y 9 s) para que
   * las tarjetas nunca respiren en fase: una fila flotando en sincronía es
   * justo lo que delata el truco.
   */
  const headerMetrics: {
    value: ReactNode
    label: string
    hint?: string
    float: string
  }[] = [
    {
      value: <Counter value={awards.length} />,
      label: t('metricsTotalLabel'),
      hint: t('metricsTotalHint'),
      float: 'float',
    },
    {
      value: latestYear,
      label: t('metricsLatestLabel'),
      hint: latest?.organization,
      float: 'float-slow',
    },
    {
      value: <Counter value={organizations} />,
      label: t('metricsOrgsLabel'),
      hint: t('metricsOrgsHint'),
      float: 'float',
    },
  ]

  /** Las dos páginas donde se sigue verificando lo mismo por otra vía. */
  const moreLinks: {
    href: StaticPathname
    icon: LucideIcon
    title: string
    desc: string
    cta: string
  }[] = [
    {
      href: '/certificaciones',
      icon: BadgeCheck,
      title: t('certsTitle'),
      desc: t('certsDesc'),
      cta: t('certsCta'),
    },
    {
      href: '/cv',
      icon: FileText,
      title: t('cvTitle'),
      desc: t('cvDesc'),
      cta: t('cvCta'),
    },
  ]

  /**
   * WebPage + BreadcrumbList, nada más.
   *
   * NO hay nodo `Award`: schema.org lo modela como una propiedad de texto de
   * Person, y no existe en el archivo de datos ni el emisor como entidad ni una
   * URL de verificación que respalde un nodo propio. El texto visible ya dice
   * quién otorgó qué y cuándo; inventar un grafo alrededor no agrega ningún
   * hecho, solo superficie para equivocarse.
   *
   * Es `CollectionPage` porque la página es exactamente eso: la lista de las
   * entradas de data/awards.ts.
   */
  const pageUrl = routeUrl('premios', locale)
  const schema: SchemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      generateWebPageSchema({
        locale,
        route: 'premios',
        name: t('title'),
        description: t('lead'),
        type: 'CollectionPage',
        hasBreadcrumb: true,
      }),
      generateBreadcrumbSchema(
        [
          { name: en ? 'Home' : 'Inicio', route: 'home' },
          { name: t('crumb'), route: 'premios' },
        ],
        locale,
        pageUrl
      ),
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* ══ CABECERA ═══════════════════════════════════════════════
          Aurora, grano, cuadrícula y el resplandor del puntero: cuatro capas
          decorativas, todas en -z-10 dentro de un contenedor `relative isolate
          overflow-hidden` y ninguna capturando eventos.                  */}
      <section className="relative isolate overflow-hidden border-b border-hairline">
        <Backdrop glow />

        <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
          <Breadcrumbs items={[{ label: t('crumb') }]} />

          <div className="mt-10 max-w-3xl">
            <p className="eyebrow enter-scale">
              <Trophy className="size-3.5" aria-hidden="true" />
              {t('eyebrow')}
            </p>

            {/* El gradiente cae solo sobre la segunda mitad del h1: un título
                completo recortado pierde legibilidad. `text-ink` tampoco es
                decorativo aquí — es el único color de texto que aguanta ir
                DIRECTO sobre la aurora (10.2:1). */}
            <h1 className="enter-blur step-1 mt-6 text-d1 text-ink">
              {t('h1Lead')}
              <span className="grad-text">{t('h1Accent')}</span>
            </h1>

            <span
              className="grad-deco enter step-1 mt-7 block h-1 w-12 rounded-full"
              aria-hidden="true"
            />

            {/* ── POR QUÉ EL LEAD VA DENTRO DE CRISTAL ──
                Medido: sobre la aurora `text-ink-muted` cae a 3.83:1 y
                `text-ink-subtle` a 3.23:1, y ninguno pasa. Dentro de
                `.glass-strong` suben a 5.1 y 4.54. De ahí que el panel sea
                `strong` y no el cristal por defecto, donde el subtle se queda en
                4.30 — y aquí dentro hay un `ink-subtle`. */}
            <GlassPanel strong className="enter step-2 mt-7 p-6 sm:p-7">
              <p className="text-lead text-ink-muted">{t('lead')}</p>

              {/* La nota que evita el inflado: la página dice en voz alta que
                  las tres entradas son cosas distintas antes de listarlas. */}
              <p className="mt-5 max-w-[68ch] text-sm text-ink-subtle">
                {t('honesty')}
              </p>
            </GlassPanel>
          </div>

          {/* ── LAS TRES CIFRAS, FLOTANDO EN CRISTAL ──
              El `.float` va en el CONTENIDO, no en el panel de cristal. Mover un
              elemento con `backdrop-filter` obliga a rerasterizar el desenfoque
              en cada frame: es la misma trampa que `filter: blur()` sobre algo
              que se mueve. El panel se queda quieto; respira lo de dentro. */}
          <dl
            aria-label={t('metricsTotalLabel')}
            className="enter step-4 mt-12 grid gap-4 sm:grid-cols-3"
          >
            {headerMetrics.map((metric) => (
              <GlassPanel key={metric.label} strong className="p-5">
                <dt className="sr-only">{metric.label}</dt>
                <dd className={metric.float}>
                  <Metric
                    value={metric.value}
                    label={metric.label}
                    hint={metric.hint}
                  />
                </dd>
              </GlassPanel>
            ))}
          </dl>
        </div>
      </section>

      {/* ══ CARRUSEL ═══════════════════════════════════════════════
          Los mismos tres registros en tarjetas, para verlos de un tirón antes
          de leerlos. El desplazamiento y el imán son nativos (`scroll-snap`):
          si el JS del componente no corre el carrusel sigue funcionando, y las
          tres tarjetas completas están en el HTML del servidor, así que un
          crawler las lee todas.                                          */}
      <section className="relative isolate overflow-hidden border-b border-hairline bg-ground-tint">
        <Backdrop />

        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">{t('railEyebrow')}</p>
            <h2 className="mt-5 text-d1 text-ink">{t('railTitle')}</h2>
          </div>

          <Carousel
            label={tl('awardsRail')}
            prevLabel={tl('prevSlide')}
            nextLabel={tl('nextSlide')}
            className="mt-10"
          >
            {sorted.map((award) => {
              const meta = KIND_META[award.kind]
              const KindIcon = meta.icon

              return (
                /* La inclinación sigue al puntero. `.scene` ya está en el riel
                   del carrusel, así que las tres tarjetas comparten un mismo
                   punto de fuga — que es lo que separa un 3D creíble de tres
                   tarjetas girando cada una por su cuenta.

                   El hueco de imagen va COMO HERMANO del panel de cristal y no
                   dentro: la etiqueta del hueco es a su vez un panel de cristal,
                   y anidar `backdrop-filter` difumina dos veces, cuesta el doble
                   y se ve peor. Los dos planos llevan `.depth-*` distintos, así
                   que dentro de la tarjeta inclinada la imagen flota por delante
                   del texto. Las clases van en los hijos DIRECTOS de `.tilt`:
                   `.glass` lleva `contain: paint`, que aplana el 3D de lo que
                   tenga dentro. */
                <Tilt3D key={award.id} className="w-[19rem] sm:w-[23rem]">
                  <article className="flex h-full flex-col gap-3">
                    <ImageSlot
                      path={awardImagePath(award.id)}
                      alt={t('photoAlt', { title: award.title })}
                      hint="Foto del reconocimiento"
                      width={1200}
                      height={750}
                      sizes="(min-width: 640px) 23rem, 19rem"
                      className="depth-2 aspect-[16/10] rounded-2xl shadow-lift-3"
                    />

                    <GlassPanel
                      strong
                      className="depth-1 flex flex-1 flex-col p-5"
                    >
                      <Badge variant={meta.variant} className="self-start">
                        <KindIcon className="size-3" aria-hidden="true" />
                        {kindLabel[award.kind]}
                      </Badge>

                      <h3 className="mt-4 text-d3 text-ink">{award.title}</h3>

                      <p className="mt-2 flex-1 text-sm text-ink-muted">
                        {award.organization}
                      </p>

                      <p className="mt-4 text-xs text-ink-subtle">
                        <time dateTime={award.date} data-numeric="">
                          {formatShortDate(award.date, locale)}
                        </time>
                      </p>
                    </GlassPanel>
                  </article>
                </Tilt3D>
              )
            })}
          </Carousel>

          {/* `text-ink` y no `ink-subtle`: esta línea va directa sobre la
              aurora, sin cristal de por medio. */}
          <p className="mt-2 text-sm text-ink">{tu('dragHint')}</p>
        </div>
      </section>

      {/* ══ LOS RECONOCIMIENTOS, UNO POR UNO ═══════════════════════
          La aurora vuelve aquí a propósito: es lo que los paneles de cristal
          desenfocan, y sin nada saturado detrás el cristal no se lee como
          cristal. Esta sección NO lleva `.defer-paint`: es el contenido
          principal de la página.                                         */}
      <section className="relative isolate overflow-hidden border-b border-hairline">
        <Backdrop glow />

        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">{t('listEyebrow')}</p>
            <h2 className="mt-5 text-d1 text-ink">{t('listTitle')}</h2>
          </div>

          {/* `.scene` (la perspectiva) va en la lista y la rotación en cada
              tarjeta, para que las tres compartan punto de fuga.

              El `[transform-style:preserve-3d]` del <li> no es adorno: la
              perspectiva de `.scene` solo alcanza a los hijos DIRECTOS, así que
              sin él el <li> aplanaría el 3D de la tarjeta que lleva dentro.

              El `.reveal` va en el <li> y NO en el mismo nodo que `.tilt`: una
              animación con `fill: both` se queda dueña del `transform` de su
              elemento para siempre, así que ahí mataría la inclinación. */}
          <ol className="scene mt-14 grid gap-12">
            {sorted.map((award, index) => {
              const meta = KIND_META[award.kind]
              const KindIcon = meta.icon

              // El más reciente es el único con borde de gradiente y con
              // `priority` en su imagen: es el candidato a LCP de la sección.
              const featured = index === 0

              // El proyecto correspondiente, si existe. La certificación no
              // tiene proyecto y aquí devuelve undefined.
              const projectSlug = PROJECT_SLUG_BY_AWARD[award.id]
              const project = projectSlug
                ? getCompanyBySlug(locale, projectSlug)
                : undefined

              // La imagen alterna de lado para que tres piezas grandes no se
              // lean como una lista. En el DOM el texto va siempre primero: la
              // alternancia es puro `order`, así que no cambia el orden de
              // lectura ni el del teclado. La columna del texto se queda con la
              // fracción ancha en los dos casos.
              const flipped = index % 2 === 1
              const columns = flipped
                ? 'sm:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]'
                : 'sm:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]'

              return (
                <li
                  key={award.id}
                  className="reveal [transform-style:preserve-3d]"
                >
                  <Tilt3D max={5} className={`grid gap-4 ${columns}`}>
                    <GlassPanel
                      as="article"
                      strong
                      rim={featured}
                      className={`depth-1 flex flex-col p-6 sm:p-8 ${
                        flipped ? 'sm:order-last' : ''
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={meta.variant}>
                          <KindIcon className="size-3" aria-hidden="true" />
                          {kindLabel[award.kind]}
                        </Badge>
                        {featured ? (
                          <Badge variant="outline">{t('featured')}</Badge>
                        ) : null}
                      </div>

                      <h3 className="mt-5 text-d2 text-ink">{award.title}</h3>

                      <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <dt className="sr-only">{t('awardedBy')}</dt>
                          <Building2
                            className="size-4 shrink-0 text-sky-ink"
                            aria-hidden="true"
                          />
                          <dd className="font-semibold text-ink">
                            {award.organization}
                          </dd>
                        </div>
                        <div className="flex items-center gap-2">
                          <dt className="sr-only">{t('dateLabel')}</dt>
                          <CalendarDays
                            className="size-4 shrink-0 text-sky-ink"
                            aria-hidden="true"
                          />
                          <dd className="text-ink-muted">
                            <time dateTime={award.date} data-numeric="">
                              {formatShortDate(award.date, locale)}
                            </time>
                          </dd>
                        </div>
                      </dl>

                      <p className="mt-5 max-w-[62ch] text-ink-muted">
                        {award.description}
                      </p>

                      {/* `impact` se imprime TAL CUAL viene del archivo de
                          datos. El de LogiRoute dice "Reducción proyectada del
                          15%": la palabra "proyectada" es lo que hace honesta la
                          frase, porque fue una estimación del modelo y no una
                          medición en operación. Nada aquí la reescribe ni la
                          recorta.
                          Panel opaco (`bg-surface-alt`), no un segundo cristal:
                          cristal sobre cristal se desenfoca dos veces. */}
                      {award.impact ? (
                        <div className="mt-6 rounded-xl border border-hairline bg-surface-alt p-5">
                          <p className="text-xs font-bold uppercase tracking-wide text-ink-subtle">
                            {t('resultLabel')}
                          </p>
                          <p className="mt-2 max-w-[62ch] text-ink-muted">
                            {award.impact}
                          </p>
                        </div>
                      ) : null}

                      {/* Enlazado interno real: la página del proyecto que ganó
                          esto. Ruta dinámica, así que va como objeto con
                          `params` — un string suelto no compila. */}
                      {project ? (
                        <div className="mt-7">
                          <Link
                            href={{
                              pathname: '/proyectos/[slug]',
                              params: { slug: project.slug },
                            }}
                            className="press group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-strong"
                          >
                            {t('viewProject')}: {project.name}
                            <ArrowUpRight
                              className="size-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                              aria-hidden="true"
                            />
                          </Link>
                        </div>
                      ) : null}
                    </GlassPanel>

                    {/* El hueco de imagen: el patrón determinista más la RUTA
                        EXACTA del archivo que le toca, escrita en pantalla. Va
                        fuera del panel de cristal porque su etiqueta es a su vez
                        un panel de cristal. */}
                    <ImageSlot
                      path={awardImagePath(award.id)}
                      alt={t('photoAlt', { title: award.title })}
                      hint="Foto del reconocimiento"
                      width={1200}
                      height={750}
                      priority={featured}
                      sizes="(min-width: 640px) 45vw, 100vw"
                      className="depth-2 min-h-64 rounded-2xl shadow-lift-3 sm:min-h-full"
                    />
                  </Tilt3D>
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      {/* ══ DÓNDE SEGUIR VERIFICANDO ═══════════════════════════════
          Cristal sobre `.grad-soft` y no sobre aurora, y esto está MEDIDO: el
          presupuesto de capas compuestas de una página es finito, y pasando de
          tres auroras el navegador devuelve las animaciones al hilo principal.
          Aquí el color detrás del cristal lo pone un `background-image` fijo,
          que no cuesta ningún frame porque no se anima.                   */}
      <section className="defer-paint grad-soft border-b border-hairline">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">{t('moreEyebrow')}</p>
            <h2 className="mt-5 text-d1 text-ink">{t('moreTitle')}</h2>
            <p className="mt-4 text-lead text-ink-muted">{t('moreLead')}</p>
          </div>

          <div className="scene mt-14 grid gap-6 md:grid-cols-2">
            {moreLinks.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="glass glass-spec lift press sheen group flex flex-col p-6 sm:p-7"
                >
                  <span
                    className="grad-deco inline-flex size-12 items-center justify-center rounded-xl text-white shadow-glow-brand"
                    aria-hidden="true"
                  >
                    <Icon className="size-6" />
                  </span>

                  <h3 className="mt-5 text-d3 text-ink transition-colors duration-300 group-hover:text-brand-strong">
                    {item.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
                    {item.desc}
                  </p>

                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-strong">
                    {item.cta}
                    <ArrowUpRight
                      className="size-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══ CTA FINAL ══════════════════════════════════════════════
          `.grad-drift` desplaza una capa al 200% con `transform` en vez de
          animar `background-position`, que repintaría el bloque completo en
          cada frame. Mismo efecto, costo cero.                           */}
      <section className="defer-paint mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="grad-drift reveal-scale rounded-3xl px-6 py-14 shadow-lift-3 sm:px-12 sm:py-20">
          <div className="relative max-w-2xl">
            <h2 className="text-d1 text-white">{t('ctaTitle')}</h2>
            <p className="mt-5 text-lead text-white/85">{t('ctaLead')}</p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              {/* Sobre el gradiente el botón se invierte: superficie blanca con
                  texto de marca. `bg-none` es lo que apaga el gradiente del
                  variant; sin eso el botón se pierde dentro de su propia banda. */}
              <Button
                asChild
                size="lg"
                className="sheen bg-none bg-surface text-brand-strong hover:opacity-95"
              >
                <Link href="/contacto">
                  {t('ctaButton')}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <a
                href={`mailto:${NAP.email}`}
                className="text-sm font-semibold text-white underline decoration-white/50 underline-offset-4 hover:decoration-white"
              >
                {NAP.email}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
