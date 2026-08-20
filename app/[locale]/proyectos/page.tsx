import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  FolderKanban,
  Handshake,
  Info,
  Rocket,
  type LucideIcon,
} from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PointerGlow } from '@/components/motion/pointer-glow'
import { PresenceMap } from '@/components/map/presence-map'
import { ProjectCover } from '@/components/map/project-cover'
import { getCompanies, type CompanyKind, type CountryCode } from '@/data/companies'
import { NAP, routeUrl } from '@/lib/constants'
import { formatShortDate } from '@/lib/utils'
import { generatePageMetadata } from '@/lib/seo'
import {
  generateBreadcrumbSchema,
  generateWebPageSchema,
  type JsonLdNode,
  type SchemaGraph,
} from '@/lib/schema'
import { Locale } from '@/data/types'

interface Props {
  params: Promise<{ locale: string }>
}

/**
 * Orden de los países en la rejilla. México primero: es donde vive la práctica
 * y donde está la mayoría de los registros. No es alfabético a propósito.
 */
const COUNTRY_ORDER: readonly CountryCode[] = ['MEX', 'USA']

/**
 * Nombre visible de cada país.
 *
 * `COUNTRY_PATHS` de data/world-map.generated.ts trae los nombres solo en
 * inglés ('Mexico', 'United States of America') porque salen de Natural Earth,
 * así que el nombre que se lee en pantalla se resuelve aquí. México sale del
 * NAP para que no pueda divergir del resto del sitio.
 */
const COUNTRY_NAME: Record<CountryCode, Record<Locale, string>> = {
  MEX: { es: NAP.countryName, en: NAP.countryNameEn },
  USA: { es: 'Estados Unidos', en: 'United States' },
}

/**
 * El badge de `kind`. Ninguno usa el gradiente decorativo: un badge es texto y
 * sobre los stops --sky / --cyan el blanco mide 2.77:1 y 1.68:1. El variant
 * `gradient` del componente usa `.grad-fill`, cuyos stops pasan 5.3:1.
 */
const KIND_BADGE: Record<
  CompanyKind,
  { variant: 'default' | 'sky' | 'gradient'; icon: LucideIcon; key: string }
> = {
  empleo: { variant: 'default', icon: Building2, key: 'kindEmpleo' },
  cliente: { variant: 'sky', icon: Handshake, key: 'kindCliente' },
  propio: { variant: 'gradient', icon: Rocket, key: 'kindPropio' },
}

/**
 * Iniciales para la portada generada por código.
 *
 * Deterministas y sin tabla escrita a mano, porque data/companies.ts está hecho
 * para que se le agreguen clientes sin tocar esta página:
 *   · dos o más palabras → la inicial de las dos primeras
 *     (Master Loyalty Group → ML, Wan Hai Lines → WH, LogiRoute AI → LA)
 *   · una palabra con mayúscula interna → esas dos mayúsculas
 *     (AuraScope → AS)
 *   · una palabra a secas → sus dos primeras letras
 *     (Amazon → AM)
 */
function initials(name: string): string {
  const words = name.split(/[\s\-–—_]+/).filter(Boolean)

  if (words.length > 1) {
    return words
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
  }

  const caps = name.match(/[A-ZÁÉÍÓÚÑ]/g)
  if (caps && caps.length >= 2) return caps.slice(0, 2).join('')

  return name.slice(0, 2).toUpperCase()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const en = locale === 'en'

  return generatePageMetadata({
    locale: locale as Locale,
    route: 'proyectos',
    title: en
      ? 'Projects and companies I have worked at'
      : 'Proyectos y empresas donde he trabajado',
    // Los cinco nombres son los que de verdad están en data/companies.ts. Si se
    // agrega un cliente, esta línea se queda corta, pero nunca se vuelve falsa.
    description: en
      ? 'A map and a card per project: Amazon, Master Loyalty Group, Wan Hai Lines, AuraScope and LogiRoute AI, each with role, dates and stack.'
      : 'Mapa y ficha de cada proyecto: Amazon, Master Loyalty Group, Wan Hai Lines, AuraScope y LogiRoute AI, con rol, periodo y stack de cada uno.',
  })
}

export default async function ProyectosPage({ params }: Props) {
  const { locale: rawLocale } = await params
  setRequestLocale(rawLocale)

  const locale = rawLocale as Locale
  const en = locale === 'en'

  const t = await getTranslations('proyectos')
  const ttr = await getTranslations('trayectoria')
  const tc = await getTranslations('common')

  const companies = getCompanies(locale)

  /**
   * Agrupado por país, porque el mapa enlaza a `#pais-MEX` y `#pais-USA`: cada
   * encabezado de país es el destino de uno de esos enlaces. Un país sin
   * registros no dibuja un encabezado vacío.
   */
  const groups = COUNTRY_ORDER.map((iso) => ({
    iso,
    items: companies.filter((company) => company.country === iso),
  })).filter((group) => group.items.length > 0)

  /** El mismo orden que se ve en pantalla, para que el ItemList no lo contradiga. */
  const ordered = groups.flatMap((group) => group.items)

  /**
   * La portada de la primera tarjeta es la candidata a LCP de la rejilla, así
   * que es la única con `priority`. Solo importa cuando exista una captura
   * real: sin ella la portada es SVG en línea y no hay imagen que precargar.
   */
  const firstSlug = ordered[0]?.slug

  const pageUrl = routeUrl('proyectos', locale)
  const listId = `${pageUrl}#lista`

  /**
   * ItemList con los proyectos reales y su URL real. Sin `aggregateRating`,
   * sin `review` y sin un nodo `Organization` por empresa: aquí lo único que se
   * puede afirmar es que estas entradas existen y dónde vive cada una.
   *
   * No declara `itemListOrder` porque el orden es por país, no un ranking.
   */
  const itemList: JsonLdNode = {
    '@type': 'ItemList',
    '@id': listId,
    name: t('title'),
    numberOfItems: ordered.length,
    itemListElement: ordered.map((company, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: company.name,
      url: `${pageUrl}/${company.slug}`,
    })),
  }

  const schema: SchemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      generateWebPageSchema({
        locale,
        route: 'proyectos',
        name: t('title'),
        description: t('subtitle'),
        // CollectionPage y no WebPage: la página es la lista, no un texto.
        type: 'CollectionPage',
        hasBreadcrumb: true,
        mainEntityId: listId,
      }),
      itemList,
      generateBreadcrumbSchema(
        [
          { name: en ? 'Home' : 'Inicio', route: 'home' },
          { name: t('title'), route: 'proyectos' },
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

      {/* ══ CABECERA + MAPA ════════════════════════════════════════
          Tres capas decorativas, todas en -z-10 y ninguna captura eventos: la
          malla, el resplandor que sigue al puntero y la cuadrícula que se
          desvanece. La malla no es solo adorno aquí: es lo que el panel de
          cristal del mapa desenfoca, y sin nada detrás el cristal se lee como
          plástico translúcido.                                          */}
      <section className="relative isolate overflow-hidden border-b border-hairline">
        <div className="mesh" aria-hidden="true" />
        <PointerGlow />
        <div className="grid-fade" aria-hidden="true" />

        <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
          <Breadcrumbs items={[{ label: t('title') }]} />

          <div className="mt-10 max-w-3xl">
            <p className="eyebrow enter-scale">
              <FolderKanban className="size-3.5" aria-hidden="true" />
              {ttr('eyebrow')}
            </p>

            {/* El h1 se compone en línea para que el gradiente caiga solo sobre
                las dos últimas palabras: un titular completo recortado pierde
                legibilidad. El texto que resulta es idéntico a
                `proyectos.title`. */}
            <h1 className="enter-blur step-1 mt-6 text-d1 text-ink">
              {en ? 'Projects ' : 'Proyectos '}
              <span className="grad-text">
                {en ? 'and companies' : 'y empresas'}
              </span>
            </h1>

            <span
              className="grad-deco enter step-1 mt-7 block h-1 w-12 rounded-full"
              aria-hidden="true"
            />

            <p className="enter step-2 mt-7 text-lead text-ink-muted">
              {t('subtitle')}
            </p>

            <p className="enter step-3 mt-5 max-w-[68ch] text-ink-muted">
              {t('lead')}
            </p>
          </div>

          {/* El mapa, a todo el ancho del contenedor. Ya es un panel de cristal
              por dentro, así que NO va envuelto en otro: cristal sobre cristal
              desenfoca dos veces y es el efecto más caro del sistema. */}
          <div className="enter step-4 mt-12 sm:mt-14">
            <PresenceMap locale={locale} />
          </div>

          {/* Nota de transparencia sobre los dos tipos de marcador. Caja opaca y
              liviana a propósito: el protagonista de esta sección es el cristal
              del mapa, y una segunda superficie translúcida pegada debajo le
              quitaría jerarquía además de costar otro repintado. */}
          <div className="enter step-5 mt-5 flex max-w-[80ch] gap-3 rounded-xl border border-hairline bg-surface-alt p-4 sm:p-5">
            <Info
              className="mt-0.5 size-4 shrink-0 text-sky-ink"
              aria-hidden="true"
            />
            <p className="text-sm leading-relaxed text-ink-muted">
              {t('mapNote')}
            </p>
          </div>
        </div>
      </section>

      {/* ══ REJILLA POR PAÍS ═══════════════════════════════════════
          Esta sección NO lleva `.defer-paint`, y es deliberado: aquí viven los
          anclas #pais-MEX y #pais-USA a los que enlaza el mapa, y saltar a un
          destino dentro de un contenedor con `content-visibility: auto` depende
          de una altura estimada. Un salto que cae dos pantallas abajo es peor
          que pintar esta sección de más.

          Tampoco lleva cristal: es una rejilla densa y `backdrop-filter` se
          paga por tarjeta. `.card` es opaca y no cuesta nada.            */}
      <section className="border-b border-hairline bg-ground-tint">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          {/* La etiqueta de la sección es un párrafo, no un encabezado: los
              encabezados de este bloque son los de país, y meter un h2 arriba
              los empujaría a h3 sin que la jerarquía real cambiara. */}
          <p className="eyebrow reveal">{t('byCountry')}</p>

          {groups.map((group, groupIndex) => (
            <div
              key={group.iso}
              className={groupIndex === 0 ? 'mt-10' : 'mt-16 sm:mt-20'}
            >
              {/* El id es el destino del enlace del mapa. El desplazamiento lo
                  resuelve `:target { scroll-margin-top }` de globals.css. */}
              <h2
                id={`pais-${group.iso}`}
                className="reveal flex flex-wrap items-baseline gap-x-4 gap-y-2 text-d2 text-ink"
              >
                {COUNTRY_NAME[group.iso][locale]}
                <span
                  data-numeric=""
                  className="text-sm font-semibold text-ink-subtle"
                >
                  {group.items.length}{' '}
                  {group.items.length === 1
                    ? en
                      ? 'entry'
                      : 'registro'
                    : en
                      ? 'entries'
                      : 'registros'}
                </span>
              </h2>

              <ul className="reveal-stagger mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((company) => {
                  const kind = KIND_BADGE[company.kind]
                  const KindIcon = kind.icon

                  return (
                    <li key={company.slug}>
                      {/* La tarjeta entera es el enlace: un objetivo de clic
                          grande y un solo destino, en vez de un enlace-título
                          de 200 px al que hay que apuntar. */}
                      <Link
                        href={{
                          pathname: '/proyectos/[slug]',
                          params: { slug: company.slug },
                        }}
                        className="card card-hover group flex h-full flex-col overflow-hidden"
                      >
                        {/* Portada determinista por slug. Si algún día hay una
                            captura en `shots`, el componente muestra la foto y
                            el patrón desaparece: no hay que cambiar nada aquí. */}
                        <ProjectCover
                          seed={company.slug}
                          label={initials(company.name)}
                          shot={company.shots[0]}
                          shotAlt={
                            en
                              ? `Screenshot of the ${company.name} project`
                              : `Captura del proyecto ${company.name}`
                          }
                          priority={company.slug === firstSlug}
                          className="aspect-[16/10] w-full overflow-hidden border-b border-hairline"
                        />

                        <div className="flex flex-1 flex-col p-6">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant={kind.variant}>
                              <KindIcon className="size-3" aria-hidden="true" />
                              {t(kind.key)}
                            </Badge>
                          </div>

                          <h3 className="mt-4 text-d3 text-ink transition-colors group-hover:text-brand-strong">
                            {company.name}
                          </h3>

                          <p className="mt-1.5 text-sm font-semibold text-ink-muted">
                            {company.role}
                          </p>

                          {/* Fechas legibles por máquina: dos <time> reales.
                              `endDate: null` significa en curso, y ahí no se
                              escribe una fecha inventada. */}
                          <p
                            data-numeric=""
                            className="mt-3 text-sm font-semibold text-brand-strong"
                          >
                            <span className="sr-only">
                              {t('periodLabel')}:{' '}
                            </span>
                            <time dateTime={company.startDate}>
                              {formatShortDate(company.startDate, locale)}
                            </time>
                            {' – '}
                            {company.endDate ? (
                              <time dateTime={company.endDate}>
                                {formatShortDate(company.endDate, locale)}
                              </time>
                            ) : (
                              <span>{tc('present')}</span>
                            )}
                          </p>

                          <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-muted">
                            {company.summary}
                          </p>

                          <div className="mt-5">
                            <p className="text-xs font-bold uppercase tracking-wide text-ink-subtle">
                              {t('stackLabel')}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {company.stack.map((tech) => (
                                <Badge key={tech} variant="neutral">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-strong">
                            {t('viewProject')}
                            <ArrowUpRight
                              className="size-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                              aria-hidden="true"
                            />
                          </span>
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
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
                  texto de marca. Un relleno de marca aquí desaparecería. */}
              <Button
                asChild
                size="lg"
                className="sheen bg-none bg-surface text-brand-strong hover:opacity-95"
              >
                <Link href="/contacto">
                  {en ? 'Start a project' : 'Empezar un proyecto'}
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
