import type { Metadata } from 'next'
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
import { GlassPanel } from '@/components/ui/glass-panel'
import { Metric } from '@/components/ui/metric'
import { Counter } from '@/components/motion/counter'
import { ProjectCover } from '@/components/map/project-cover'
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
 * Qué tipo de cosa es cada entrada, en icono y en etiqueta.
 *
 * El campo `kind` de data/awards.ts existe justamente para esto: un
 * reconocimiento, un primer lugar y un examen aprobado no son lo mismo, y
 * ponerles a los tres la palabra "premio" exageraría dos de ellos. El badge es
 * lo que evita esa exageración, así que no es decoración.
 *
 * El variant `gradient` (relleno `.grad-fill`, texto blanco a 5.3:1) se reserva
 * para la competencia, que es la única entrada que sí fue un primer lugar.
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
 * Etiqueta corta para la portada generada: la parte del título antes del guion.
 * Sale del propio dato ("AuraScope – Monitoreo…" → "AuraScope"), así que no hay
 * una segunda lista de nombres que pueda quedar desincronizada.
 */
function coverLabel(title: string): string {
  return title.split(/\s[–-]\s/)[0]!.trim()
}

export default async function AwardsPage({ params }: Props) {
  const { locale: rawLocale } = await params
  setRequestLocale(rawLocale)

  const locale = rawLocale as Locale
  const en = locale === 'en'

  const t = await getTranslations('premios')

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
          Malla animada y cuadrícula que se desvanece: decorativas las dos,
          en -z-10 dentro de un contenedor `relative isolate` y sin
          capturar eventos. La malla anima solo `transform`.            */}
      <section className="relative isolate overflow-hidden border-b border-hairline">
        <div className="mesh" aria-hidden="true" />
        <div className="grid-fade" aria-hidden="true" />

        <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
          <Breadcrumbs items={[{ label: t('crumb') }]} />

          <div className="mt-10 max-w-3xl">
            <p className="eyebrow enter-scale">
              <Trophy className="size-3.5" aria-hidden="true" />
              {t('eyebrow')}
            </p>

            {/* El gradiente cae solo sobre la segunda mitad del h1: un título
                completo recortado pierde legibilidad. */}
            <h1 className="enter-blur step-1 mt-6 text-d1 text-ink">
              {t('h1Lead')}
              <span className="grad-text">{t('h1Accent')}</span>
            </h1>

            <span
              className="grad-deco enter step-1 mt-7 block h-1 w-12 rounded-full"
              aria-hidden="true"
            />

            <p className="enter step-2 mt-7 text-lead text-ink-muted">
              {t('lead')}
            </p>

            {/* La nota que evita el inflado: la página dice en voz alta que las
                tres entradas son cosas distintas antes de listarlas. */}
            <p className="enter step-3 mt-5 max-w-[68ch] text-ink-muted">
              {t('honesty')}
            </p>
          </div>

          {/* Tres cifras, las tres derivadas del arreglo. El año del más
              reciente no cuenta desde cero: un contador subiendo hasta 2024 se
              lee como una cifra, no como una fecha. */}
          <div className="enter step-4 mt-12 grid gap-4 sm:grid-cols-3">
            <div className="card p-5">
              <Metric
                value={<Counter value={awards.length} />}
                label={t('metricsTotalLabel')}
                hint={t('metricsTotalHint')}
              />
            </div>
            <div className="card p-5">
              <Metric
                value={latestYear}
                label={t('metricsLatestLabel')}
                hint={latest?.organization}
              />
            </div>
            <div className="card p-5">
              <Metric
                value={<Counter value={organizations} />}
                label={t('metricsOrgsLabel')}
                hint={t('metricsOrgsHint')}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══ LOS RECONOCIMIENTOS, UNO POR UNO ═══════════════════════
          La malla vuelve aquí a propósito: es lo que el panel de cristal
          desenfoca, y sin nada detrás el cristal no se lee como cristal.
          Esta sección NO lleva `.defer-paint`: es el contenido principal y
          arranca dentro de la primera pantalla.                        */}
      <section className="relative isolate overflow-hidden bg-ground-tint">
        <div className="mesh" aria-hidden="true" />

        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">{t('listEyebrow')}</p>
            <h2 className="mt-5 text-d1 text-ink">{t('listTitle')}</h2>
          </div>

          <ol className="mt-14 grid gap-8">
            {sorted.map((award, index) => {
              const meta = KIND_META[award.kind]
              const KindIcon = meta.icon

              // Solo el más reciente lleva cristal. `backdrop-filter` es el
              // efecto más caro del sistema: tres paneles de vidrio en columna
              // costarían tres rasterizaciones del fondo. Los otros dos van en
              // `.card`, que es opaca y no cuesta nada.
              const featured = index === 0

              // El proyecto correspondiente, si existe. La certificación no
              // tiene proyecto y aquí devuelve undefined.
              const projectSlug = PROJECT_SLUG_BY_AWARD[award.id]
              const project = projectSlug
                ? getCompanyBySlug(locale, projectSlug)
                : undefined

              // La portada alterna de lado para que tres tarjetas grandes no se
              // lean como una lista. En el DOM el texto va siempre primero: la
              // alternancia es puro `order` y no cambia el orden de lectura.
              const coverOrder = index % 2 === 1 ? 'sm:order-first' : ''

              const body = (
                <div className="flex flex-col p-6 sm:p-8">
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

                  {/* `impact` se imprime TAL CUAL viene del archivo de datos.
                      El de LogiRoute dice "Reducción proyectada del 15%": la
                      palabra "proyectada" es lo que hace honesta la frase,
                      porque fue una estimación del modelo y no una medición en
                      operación. Nada aquí la reescribe ni la recorta.
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
                      esto. Ruta dinámica, así que va como objeto con `params`
                      — un string suelto no compila. */}
                  {project ? (
                    <div className="mt-7">
                      <Link
                        href={{
                          pathname: '/proyectos/[slug]',
                          params: { slug: project.slug },
                        }}
                        className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-strong"
                      >
                        {t('viewProject')}: {project.name}
                        <ArrowUpRight
                          className="size-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </Link>
                    </div>
                  ) : null}
                </div>
              )

              /* Portada generada por código, determinista por el id del premio.
                 No hay fotos reales de ninguno de los tres, y una imagen de
                 banco de un trofeo genérico sería peor que un patrón: fingiría
                 documentar algo. Si algún día se agrega `image` al dato, se
                 muestra el archivo y el patrón desaparece. */
              const cover = (
                <ProjectCover
                  seed={award.id}
                  label={coverLabel(award.title)}
                  shot={award.image}
                  shotAlt={award.image ? award.title : undefined}
                  priority={featured}
                  className={`min-h-56 sm:min-h-full ${coverOrder}`}
                />
              )

              return (
                <li key={award.id}>
                  {featured ? (
                    <GlassPanel
                      as="article"
                      className="reveal-scale grid sm:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]"
                    >
                      {body}
                      {cover}
                    </GlassPanel>
                  ) : (
                    <article className="card reveal grid overflow-hidden sm:grid-cols-2">
                      {body}
                      {cover}
                    </article>
                  )}
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      {/* ══ DÓNDE SEGUIR VERIFICANDO ═══════════════════════════════ */}
      <section className="defer-paint border-y border-hairline">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">{t('moreEyebrow')}</p>
            <h2 className="mt-5 text-d1 text-ink">{t('moreTitle')}</h2>
            <p className="mt-4 text-lead text-ink-muted">{t('moreLead')}</p>
          </div>

          <div className="reveal-stagger mt-14 grid gap-6 md:grid-cols-2">
            {moreLinks.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="card card-hover group flex flex-col p-6 sm:p-7"
                >
                  <span
                    className="grad-deco inline-flex size-12 items-center justify-center rounded-xl text-white shadow-glow-brand"
                    aria-hidden="true"
                  >
                    <Icon className="size-6" />
                  </span>

                  <h3 className="mt-5 text-d3 text-ink transition-colors group-hover:text-brand-strong">
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

      {/* ══ CTA FINAL ══════════════════════════════════════════════ */}
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
