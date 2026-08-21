import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Rail } from '@/components/instrument/rail'
import { Ribbon } from '@/components/instrument/ribbon'
import { MediaSlot } from '@/components/instrument/media-slot'
import { PresenceMap } from '@/components/map/presence-map'
import {
  getCompanies,
  type CompanyKind,
  type CountryCode,
} from '@/data/companies'
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
 * Orden de los países en la lista. México primero: es donde vive la práctica
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
 * El tipo de entrada es una ETIQUETA MONO en la fila, no una cápsula de color.
 * Se resuelve por tabla y no con ternarios: si mañana entra un cuarto `kind`,
 * el compilador exige su clave en lugar de dejar la etiqueta en blanco.
 */
const KIND_KEY: Record<CompanyKind, string> = {
  empleo: 'kindEmpleo',
  cliente: 'kindCliente',
  propio: 'kindPropio',
}

/* ════════════════════════════════════════════════════════════════
   DURACIÓN REAL

   Cada fila lleva una barra con la longitud que le toca por sus fechas
   verdaderas, medida contra el trabajo más largo de la lista. No es
   decoración: es la única magnitud comparable que hay en estos datos, y en
   un instrumento las magnitudes se dibujan.
   ════════════════════════════════════════════════════════════════ */

/** `YearMonth` («2023-11») a meses absolutos, para poder restar. */
function toMonths(ym: string): number {
  const [y, m] = ym.split('-').map(Number)
  return y * 12 + (m - 1)
}

/** El mes en curso, para cerrar los periodos que siguen abiertos. */
function currentYearMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function monthsBetween(from: string, to: string | null): number {
  return Math.max(1, toMonths(to ?? currentYearMonth()) - toMonths(from))
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
   * La portada de la primera fila es la candidata a LCP de la lista, así que
   * es la única con `priority`. Solo importa cuando exista una captura real:
   * sin ella el hueco es SVG en línea y no hay imagen que precargar.
   */
  const firstSlug = ordered[0]?.slug

  /** El trabajo más largo fija la escala de las barras. */
  const longest = Math.max(
    ...companies.map((company) =>
      monthsBetween(company.startDate, company.endDate)
    )
  )

  /**
   * Los tres números de la cabecera. Se cuentan de los datos, no se escriben
   * a mano: si mañana entra un cliente a data/companies.ts los tres se mueven
   * solos y ninguno puede quedar desactualizado.
   */
  const stats: { value: number; label: string }[] = [
    { value: companies.length, label: t('statEntries') },
    { value: groups.length, label: t('statCountries') },
    {
      value: companies.filter((company) => company.kind === 'propio').length,
      label: t('statOwn'),
    },
  ]

  /**
   * Las dos cintas. Nombres en un carril y stack en el otro, corriendo en
   * direcciones opuestas: el cruce es lo que da profundidad, sin una sola
   * sombra y sin una sola caja. El stack va deduplicado —`Ribbon` usa el
   * texto como clave— y aplanado de las cinco entradas.
   */
  const names = ordered.map((company) => company.name)
  const stack = Array.from(
    new Set(companies.flatMap((company) => company.stack))
  )

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

      <div
        className="grid"
        style={{ gridTemplateColumns: 'var(--tape-w) minmax(0,1fr)' }}
      >
        <Rail />

        <div className="min-w-0">
          {/* ═══ CABECERA ════════════════════════════════════════
              Sin instrumento en vivo: el que mide la página abierta vive
              en la home y duplicarlo aquí lo volvería decoración. Lo que
              esta página mide son duraciones, y eso se ve más abajo. */}
          <section className="relative px-5 pt-16 sm:px-10">
            <p className="stamp">{ttr('eyebrow')}</p>

            <h1 className="mt-6 max-w-[14ch] text-hero text-ink">
              {t('title')}
            </h1>

            <p className="mt-10 max-w-[46ch] font-human text-lead text-ink-muted">
              {t('subtitle')}
            </p>

            <p className="mt-8 max-w-[62ch] text-ink-muted">{t('lead')}</p>

            {/* Los tres números, contados de los datos. Tres filas medidas,
                no tres tarjetas: la jerarquía la da la regla, no una caja. */}
            <dl className="reveal-stagger mt-14 max-w-md">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="band flex items-baseline justify-between gap-6"
                >
                  <dt className="stamp">{stat.label}</dt>
                  <dd className="font-mono text-d3 tabular-nums text-ink">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {/* ═══ EL MAPA ═════════════════════════════════════════
              Geografía real —contornos de Natural Earth—, no un SVG
              decorativo de un continente. Cada pin es un enlace de verdad
              a la ficha de esa empresa. */}
          <section
            className="border-t border-hairline px-5 py-20 sm:px-10"
            aria-labelledby="mapa-heading"
          >
            <h2 id="mapa-heading" className="sr-only">
              {en ? 'Presence map' : 'Mapa de presencia'}
            </h2>

            <p className="stamp">
              {en
                ? 'coordinates · natural earth'
                : 'coordenadas · natural earth'}
            </p>

            <div className="reveal mt-8">
              <PresenceMap locale={locale} />
            </div>

            {/* La nota de transparencia sobre los dos tipos de marcador. Es
                un hueco declarado del registro, así que se dibuja como
                hueco: regla punteada, sin caja. */}
            <p className="gap mt-8 max-w-[80ch] pt-4 text-sm">
              {t('mapNote')}
            </p>
          </section>

          {/* ═══ LAS CINTAS ══════════════════════════════════════
              Los nombres en un carril y el stack en el otro, en
              direcciones opuestas. Sin flechas y sin puntos: no hay nada
              que encuadrar, es texto impreso que corre. */}
          <section
            className="overflow-hidden border-t border-hairline py-10"
            aria-labelledby="cintas-heading"
          >
            <h2 id="cintas-heading" className="sr-only">
              {en ? 'Companies and stack' : 'Empresas y stack'}
            </h2>
            <Ribbon
              items={names}
              label={t('title')}
              duration="58s"
              large
            />
            <div className="mt-4">
              <Ribbon
                items={stack}
                label={t('stackLabel')}
                duration="76s"
                reverse
              />
            </div>
          </section>

          {/* ═══ EL REGISTRO POR PAÍS ════════════════════════════
              Una lista de filas medidas, no una rejilla de tarjetas. Los
              id de país son el destino de los enlaces del mapa. */}
          <section className="border-t border-hairline px-5 py-20 sm:px-10">
            <p className="stamp">{t('byCountry')}</p>

            {groups.map((group, groupIndex) => (
              <div
                key={group.iso}
                className={groupIndex === 0 ? 'mt-10' : 'mt-20'}
              >
                {/* El desplazamiento del salto lo resuelve
                    `:target { scroll-margin-top }` de globals.css. */}
                <h2
                  id={`pais-${group.iso}`}
                  className="flex flex-wrap items-baseline gap-x-5 gap-y-2 text-d1 text-ink"
                >
                  {COUNTRY_NAME[group.iso][locale]}
                  <span className="stamp tabular-nums">
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

                <ol className="reveal-stagger mt-8">
                  {group.items.map((company) => {
                    /**
                     * `portada.png` es la ruta acordada del hueco. Si algún
                     * día hay una captura real registrada en
                     * data/companies.ts, esa gana y el hueco desaparece sin
                     * tocar este archivo.
                     */
                    /* La portada la resuelve <MediaSlot> desde el registro de medios. */
                    const months = monthsBetween(
                      company.startDate,
                      company.endDate
                    )

                    return (
                      <li key={company.slug}>
                        {/* La fila entera es el enlace: un objetivo de clic
                            grande y un solo destino. Sin borde de cuatro
                            lados — la fila la define su regla superior. */}
                        <Link
                          href={{
                            pathname: '/proyectos/[slug]',
                            params: { slug: company.slug },
                          }}
                          className="band group grid gap-5 py-8 sm:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] sm:gap-8"
                        >
                          {/* El hueco marca dónde va la portada con su ruta
                              exacta. Lo resuelve el registro de medios, que
                              es el mismo dato que genera `docs/MEDIA.md`: si
                              el archivo existe en `public/`, entra; si no, se
                              dibuja el hueco. Un solo lugar decide.

                              A 176 px de ancho la etiqueta no cabía y se
                              recortaba 16–28 px —lo detectó `check:layout`—,
                              así que la columna subió a 20rem y el hueco va
                              en modo compacto. */}
                          <MediaSlot
                            id={`proyecto-${company.slug}-captura-1`}
                            compact
                            priority={company.slug === firstSlug}
                            sizes="(min-width: 640px) 320px, 100vw"
                            className="w-full"
                          />

                          <div className="min-w-0">
                            {/* Fechas legibles por máquina: dos <time>
                                reales. `endDate: null` significa en curso, y
                                ahí no se escribe una fecha inventada. */}
                            <p className="stamp tabular-nums">
                              {t(KIND_KEY[company.kind])}
                              {' · '}
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
                              {' · '}
                              {months} {en ? 'mo' : 'm'}
                            </p>

                            <h3 className="mt-3 text-d3 text-ink">
                              {company.name}
                            </h3>

                            <p className="mt-1 text-sm text-ink-muted">
                              {company.role}
                            </p>

                            <p className="mt-4 max-w-[62ch] text-ink-muted">
                              {company.summary}
                            </p>

                            <p className="stamp mt-4">
                              {t('stackLabel')}
                              {': '}
                              {company.stack.join(' · ')}
                            </p>

                            {/* La barra lleva la duración REAL, medida
                                contra el trabajo más largo de la lista. */}
                            <span
                              className="mt-5 block"
                              style={{ width: `${(months / longest) * 100}%` }}
                              aria-hidden="true"
                            >
                              <span className="band-fill" />
                            </span>

                            <span className="mt-5 flex items-center gap-2 text-ink">
                              {t('viewProject')}
                              <span
                                aria-hidden="true"
                                className="transition-transform duration-150 group-hover:translate-x-1"
                              >
                                →
                              </span>
                            </span>

                            {/* La pluma: al pasar el puntero, un trazo se
                                escribe de izquierda a derecha bajo la fila.
                                Solo `transform`, así que no repinta. */}
                            <span
                              aria-hidden="true"
                              className="mt-4 block h-px origin-left scale-x-0 bg-ink transition-transform duration-200 ease-stylus group-hover:scale-x-100"
                            />
                          </div>
                        </Link>
                      </li>
                    )
                  })}
                </ol>
              </div>
            ))}
          </section>

          {/* ═══ LA PLACA ════════════════════════════════════════
              La sección que la aguja limpió: el material se invierte
              entero. Una sola vez por página, y aquí le toca al cierre.
              Ojo: dentro de la placa NO va `.link-stylus` —su color es
              papel y sobre papel desaparece—; los enlaces heredan hollín
              y se subrayan con currentColor. */}
          <section className="plate px-5 py-20 sm:px-10">
            <p className="stamp">{en ? 'next entry' : 'siguiente registro'}</p>

            <h2 className="mt-5 max-w-[20ch] text-d1">{t('ctaTitle')}</h2>

            <p className="mt-6 max-w-[56ch] font-human text-lead">
              {t('ctaLead')}
            </p>

            <p className="mt-10 flex flex-wrap items-baseline gap-x-8 gap-y-3">
              <Link
                href="/contacto"
                className="text-d3 underline decoration-1 underline-offset-[0.3em] transition-opacity hover:opacity-80"
              >
                {en ? 'Start a project' : 'Empezar un proyecto'} →
              </Link>
              <a
                href={`mailto:${NAP.email}`}
                className="font-mono text-sm underline decoration-1 underline-offset-[0.3em] transition-opacity hover:opacity-80"
              >
                {NAP.email}
              </a>
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
