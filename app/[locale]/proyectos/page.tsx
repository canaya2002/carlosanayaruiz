import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { StaticPathname } from '@/i18n/routing'
import { Rail } from '@/components/instrument/rail'
import { Ribbon } from '@/components/instrument/ribbon'
import { MediaSlot } from '@/components/instrument/media-slot'
import { PresenceMap } from '@/components/map/presence-map'
import {
  ENGAGEMENTS,
  ENGAGEMENT_COUNT,
  ENGAGEMENT_WEEKS,
  ENGAGEMENT_COUNTRIES,
  ENGAGEMENT_YEARS,
  ENGAGEMENTS_MEASURED,
  engagementsByKind,
  type EngagementKind,
  type EngagementService,
} from '@/data/engagements'
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

/**
 * Los seis tipos de encargo, en las dos lenguas.
 *
 * Van aquí y no en `messages/*.json` porque son la enumeración cerrada de un
 * tipo de TypeScript: si se añade un `EngagementKind`, este objeto deja de
 * compilar hasta que se traduzca. Un archivo de mensajes no da esa garantía.
 */
/**
 * De qué servicio es cada encargo, a su ruta.
 *
 * Son DIECIOCHO enlaces internos contextuales hacia las cuatro páginas que
 * facturan, y hasta ahora el campo `service` de `data/engagements.ts` no se
 * usaba para nada. El enlazado interno del repo ya documenta que esas cuatro
 * páginas casi no recibían enlaces desde ningún sitio: esto lo corrige con dato
 * que ya existía.
 *
 * La clave es la ruta en español porque así está declarado `pathnames` en
 * `i18n/routing.ts`; `<Link>` la traduce al locale servido.
 */
const SERVICE_HREF: Record<EngagementService, StaticPathname> = {
  'seo-tecnico': '/seo-tecnico',
  'desarrollo-web': '/desarrollo-web',
  'automatizacion-ia': '/automatizacion-ia',
  dashboards: '/dashboards',
}

const KIND_LABEL: Record<'es' | 'en', Record<EngagementKind, string>> = {
  es: {
    'sitio-web': 'sitio web',
    'software-interno': 'software interno',
    automatizacion: 'automatización',
    dashboard: 'dashboard',
    seo: 'SEO técnico',
    integracion: 'integración',
  },
  en: {
    'sitio-web': 'website',
    'software-interno': 'internal software',
    automatizacion: 'automation',
    dashboard: 'dashboard',
    seo: 'technical SEO',
    integracion: 'integration',
  },
}

/** La semana más larga del registro: el 100% de la barra de duración. */
const MAX_WEEKS = Math.max(...ENGAGEMENTS.map((e) => e.weeks))

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
          <section className="hero-in relative px-5 pt-16 sm:px-10">
            {/* ── LA HOJA TIENE DOS MÁRGENES ── */}
            <div className="ledger">
              <div className="min-w-0">
                <p className="stamp">{ttr('eyebrow')}</p>

                <h1 className="mt-6 max-w-[14ch] text-hero text-ink">
                  {t('title')}
                </h1>

                <p className="mt-10 max-w-[46ch] font-human text-lead text-ink-muted">
                  {t('subtitle')}
                </p>

                <p className="mt-8 max-w-[62ch] text-ink-muted">{t('lead')}</p>
              </div>

              {/* ── EL MARGEN DE ANOTACIÓN ──
                  Los tres números iban en `max-w-md` con
                  `justify-between`: la cifra acababa a 350 px de su propia
                  etiqueta y el resto de la hoja en negro. */}
              <aside className="margin margin-sticky">
                <dl>
                  {stats.map((stat) => (
                    <div key={stat.label} className="margin-row">
                      <dt className="margin-key">{stat.label}</dt>
                      <dd className="margin-read">{stat.value}</dd>
                    </div>
                  ))}
                </dl>

                {/* El hueco declarado del registro. Un proyecto con NDA es
                    un dato del registro, no un vacío que se disimula. */}
                <div className="margin-row">
                  <span className="margin-key">
                    {en ? 'on the record' : 'sobre el registro'}
                  </span>
                  <span className="margin-prose">{t('mapNote')}</span>
                </div>
              </aside>
            </div>
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
            <p className="gap mt-8 max-w-[80ch] pt-4 text-sm">{t('mapNote')}</p>
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
            <Ribbon items={names} label={t('title')} large />
            <div className="mt-4">
              <Ribbon items={stack} label={t('stackLabel')} reverse />
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


          {/* ═══ EL REGISTRO DE ENCARGOS ═════════════════════════
              Dieciocho trabajos freelance, en filas y con su eje.

              NO llevan página propia a propósito: son encargos de dos a nueve
              semanas, y darle una URL a cada uno crearía dieciocho páginas de
              contenido pobre compitiendo con las cinco que sí tienen cuerpo.
              Aquí son lo que son — un registro.

              LA MARCA ES EL DATO: el largo de cada barra es `weeks` sobre la
              semana más larga del registro, y su fila la ordena el año. El
              dibujo no puede desmentir la tabla porque sale de ella.

              EL RESULTADO MEDIDO se imprime tal cual, bajo su rótulo mono —
              el mismo tratamiento que `impact` en /premios. Nueve de los
              dieciocho lo traen; los otros nueve no se midieron y ahí la fila no
              afirma nada. Esa asimetría es lo que hace creíbles a los nueve que
              sí: si todos tuvieran cifra, ninguna valdría. */}
          <section
            id="encargos"
            className="border-t border-hairline px-5 py-20 sm:px-10"
          >
            <div className="ledger">
              <div className="min-w-0">
                <p className="stamp">
                  {en ? 'the log · freelance' : 'el registro · freelance'}
                </p>

                <h2 className="mt-5 max-w-[20ch] text-d1 text-ink">
                  {en ? 'Client work' : 'Trabajo de cliente'}
                </h2>

                <p className="mt-8 max-w-[62ch] text-lead text-ink-muted">
                  {en
                    ? `${ENGAGEMENT_COUNT} engagements between ${ENGAGEMENT_YEARS.from} and ${ENGAGEMENT_YEARS.to}, in ${ENGAGEMENT_COUNTRIES} countries. Each row carries what was delivered, how long it took and the stack. The bar is the duration — it is the data, not decoration.`
                    : `${ENGAGEMENT_COUNT} encargos entre ${ENGAGEMENT_YEARS.from} y ${ENGAGEMENT_YEARS.to}, en ${ENGAGEMENT_COUNTRIES} países. Cada fila trae qué se entregó, cuánto duró y con qué. La barra es la duración: es el dato, no un adorno.`}
                </p>

                {/* Cada encargo es una fila del registro. El orden es
                    descendente por año y, dentro del año, por duración: un
                    registrador escribe hacia abajo y lo más nuevo sale
                    primero. */}
                <ol className="reveal-stagger mt-14">
                  {[...ENGAGEMENTS]
                    .sort((a, b) => b.year - a.year || b.weeks - a.weeks)
                    .map((e) => (
                      <li key={e.id} className="band">
                        <p className="stamp tabular-nums">
                          {e.year}
                          {' · '}
                          {e.weeks}
                          {en ? ' weeks · ' : ' semanas · '}
                          {KIND_LABEL[en ? 'en' : 'es'][e.kind]}
                        </p>

                        <h3 className="mt-2 max-w-[44ch] text-d3 text-ink">
                          {e.client}
                          {e.anonymous ? (
                            <span className="stamp ml-3 align-middle">
                              {en ? 'name under NDA' : 'nombre bajo acuerdo'}
                            </span>
                          ) : null}
                        </h3>

                        <p className="mt-2 max-w-[62ch] text-ink-muted">
                          {e.delivered}
                        </p>

                        {/* El resultado, cuando se midió. Va con su rótulo
                            porque una cifra sin etiqueta es un número suelto, y
                            en tinta plena porque es el dato que el visitante
                            vino a buscar. */}
                        {e.outcome ? (
                          <p className="mt-4">
                            <span className="stamp">
                              {en ? 'measured result' : 'resultado medido'}
                            </span>
                            <span className="mt-1.5 block max-w-[62ch] text-ink">
                              {e.outcome}
                            </span>
                          </p>
                        ) : null}

                        {/* LA BARRA. Su largo es `weeks` sobre la semana más
                            larga del registro, así que las dieciocho se leen
                            entre sí por comparación directa. Es el mismo
                            recurso que `.band-fill` usa para los idiomas. */}
                        <span
                          className="mt-4 block"
                          style={{ width: `${(e.weeks / MAX_WEEKS) * 100}%` }}
                          aria-hidden="true"
                        >
                          <span className="band-fill" />
                        </span>

                        <p className="stamp mt-4">
                          {e.sector}
                          {' · '}
                          {e.city}
                          {', '}
                          {e.country}
                          {e.stack.length > 0 ? ` · ${e.stack.join(', ')}` : ''}
                        </p>

                        {/* El enlace al servicio del que fue este encargo.
                            Rotulado como SERVICIO y no como lectura, para que
                            se lea como «esto es lo que hago» y no como otra
                            fila del registro. Son dieciocho enlaces
                            contextuales hacia las cuatro páginas que facturan,
                            sacados de un campo que ya estaba en el dato. */}
                        {e.service ? (
                          <p className="mt-3">
                            <Link
                              className="link-stylus text-sm"
                              href={SERVICE_HREF[e.service]}
                            >
                              {en ? 'service: ' : 'servicio: '}
                              {KIND_LABEL[en ? 'en' : 'es'][e.kind]} →
                            </Link>
                          </p>
                        ) : null}
                      </li>
                    ))}
                </ol>
              </div>

              {/* ── EL MARGEN: la leyenda del registro ── */}
              <aside className="margin margin-sticky">
                <div className="margin-row">
                  <span className="margin-key">
                    {en ? 'engagements' : 'encargos'}
                  </span>
                  <span className="margin-read tabular-nums">
                    {ENGAGEMENT_COUNT}
                  </span>
                  <span className="margin-val">
                    {en
                      ? `${ENGAGEMENT_YEARS.from}–${ENGAGEMENT_YEARS.to}`
                      : `${ENGAGEMENT_YEARS.from}–${ENGAGEMENT_YEARS.to}`}
                  </span>
                </div>

                <div className="margin-row">
                  <span className="margin-key">
                    {en ? 'weeks delivered' : 'semanas entregadas'}
                  </span>
                  <span className="margin-read tabular-nums">
                    {ENGAGEMENT_WEEKS}
                  </span>
                </div>

                <div className="margin-row">
                  <span className="margin-key">
                    {en ? 'countries' : 'países'}
                  </span>
                  <span className="margin-read tabular-nums">
                    {ENGAGEMENT_COUNTRIES}
                  </span>
                </div>

                {/* La cifra honesta: nueve de dieciocho. Decirlo así vale más
                    que decir «resultados medidos» sin cuenta — y es lo que
                    distingue este registro de una lista de logros. */}
                <div className="margin-row">
                  <span className="margin-key">
                    {en ? 'with measured result' : 'con resultado medido'}
                  </span>
                  <span className="margin-read tabular-nums">
                    {ENGAGEMENTS_MEASURED}
                    <span className="text-ink-subtle">
                      {' / '}
                      {ENGAGEMENT_COUNT}
                    </span>
                  </span>
                </div>

                {engagementsByKind().map(({ kind, count }) => (
                  <div key={kind} className="margin-row">
                    <span className="margin-key">
                      {KIND_LABEL[en ? 'en' : 'es'][kind]}
                    </span>
                    <span className="margin-val !text-ink tabular-nums">
                      {count}
                    </span>
                  </div>
                ))}
              </aside>
            </div>
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
