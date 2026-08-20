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
import { Carousel } from '@/components/ui/carousel'
import { ImageSlot } from '@/components/ui/image-slot'
import { PointerGlow } from '@/components/motion/pointer-glow'
import { Tilt3D } from '@/components/motion/tilt-3d'
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
 * ════════════════════════════════════════════════════════════════
 * CAPAS DE FONDO
 *
 * Aurora + grano + cuadrícula. Van juntas y los cuatro <i> son obligatorios:
 * cada uno es un campo de color distinto (azul de marca, cian, cielo y un
 * brillo blanco para que la mezcla no se vea plana). Todo se mueve con
 * `transform`, así que mientras el navegador las pueda componer cuestan cero
 * recálculos de estilo.
 *
 * Y no son adorno: el cristal solo existe si hay algo saturado detrás que
 * difuminar. Sobre el fondo casi blanco del sitio un panel translúcido se ve
 * exactamente igual que un panel blanco — que es justo lo que pasaba antes.
 *
 * ── CUÁNTAS CABEN, MEDIDO ──
 * Esta página monta DOS, más la del pie, que ya existe. El límite medido está
 * en cinco: ahí se agota el presupuesto de capas compuestas, el navegador
 * devuelve las animaciones al hilo principal y toda animación en bucle empieza
 * a costar un recálculo de estilo por frame.
 * Verifica: node scripts/perf-probe.mjs http://localhost:3000/es/proyectos
 *
 * `glow` monta el resplandor que sigue al puntero. Solo en la cabecera: cada
 * instancia añade un listener de `pointermove` y una lectura de geometría por
 * frame, así que repetirlo en todas las secciones no es gratis.
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
  const tl = await getTranslations('a11y')

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
   * La portada de la primera tarjeta es la candidata a LCP del carril, así que
   * es la única con `priority`. Solo importa cuando exista una captura real:
   * sin ella el hueco es SVG en línea y no hay imagen que precargar.
   */
  const firstSlug = ordered[0]?.slug

  /**
   * Los tres números del panel de la cabecera. Se cuentan de los datos, no se
   * escriben a mano: si mañana entra un cliente a data/companies.ts los tres se
   * mueven solos y ninguno puede quedar desactualizado.
   */
  const stats: { value: number; label: string }[] = [
    { value: companies.length, label: t('statEntries') },
    { value: groups.length, label: t('statCountries') },
    {
      value: companies.filter((company) => company.kind === 'propio').length,
      label: t('statOwn'),
    },
  ]

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
          La aurora no es decoración aquí: es lo que el panel de cristal del
          mapa difumina, y sin nada de color detrás el cristal se lee como
          plástico translúcido.                                          */}
      <section className="relative isolate overflow-hidden border-b border-hairline">
        <Backdrop glow />

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

            {/* Los dos párrafos van DENTRO de cristal, no directos sobre la
                aurora. Medido: `ink-muted` sobre el campo azul de la aurora cae
                a 3.83:1 y no pasa; sobre `.glass-strong` mide 5.1:1. Y el texto
                sobre cristal es SIEMPRE tinta, nunca blanco (1.96:1). */}
            <div className="glass glass-strong glass-spec enter step-2 mt-7 p-6 sm:p-7">
              <p className="text-lead text-ink-muted">{t('subtitle')}</p>
              <p className="mt-4 max-w-[68ch] text-ink-muted">{t('lead')}</p>

              {/* Los tres números, contados de los datos. Un borde los separa
                  en lugar de otra superficie: un segundo panel aquí dentro
                  sería cristal sobre cristal. */}
              <dl className="mt-7 grid grid-cols-3 gap-4 border-t border-hairline pt-6">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="text-xs font-bold uppercase tracking-wide text-ink-muted">
                      {stat.label}
                    </dt>
                    <dd
                      data-numeric=""
                      className="mt-1 font-display text-d2 text-brand-strong"
                    >
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* El mapa, a todo el ancho del contenedor. Ya es un panel de cristal
              por dentro, así que NO va envuelto en otro: cristal sobre cristal
              desenfoca dos veces y es el efecto más caro del sistema. */}
          <div className="enter step-4 mt-12 sm:mt-14">
            <PresenceMap locale={locale} />
          </div>

          {/* Nota de transparencia sobre los dos tipos de marcador. Caja OPACA a
              propósito: el protagonista de esta sección es el cristal del mapa,
              y una segunda superficie translúcida pegada debajo le quitaría
              jerarquía además de costar otro difuminado. Al ser opaca, su
              `ink-muted` no compite contra la aurora. */}
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

      {/* ══ CARRILES POR PAÍS ══════════════════════════════════════
          Carrusel, no rejilla. El desplazamiento y el imán son nativos
          (`scroll-snap`): si el JS del componente no corre el carril sigue
          arrastrándose, y las tarjetas completas están en el HTML del servidor,
          así que un crawler las lee todas — un carrusel con estado en JS solo
          expone la primera lámina.

          Esta sección NO lleva `.defer-paint`: aquí viven los anclas #pais-MEX
          y #pais-USA a los que enlaza el mapa, y aislar el layout de un destino
          de salto es pedirle al navegador que aterrice en el lugar equivocado.
      */}
      <section className="relative isolate overflow-hidden border-b border-hairline">
        <Backdrop />

        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          {/* La etiqueta de la sección es un párrafo, no un encabezado: los
              encabezados de este bloque son los de país, y meter un h2 arriba
              los empujaría a h3 sin que la jerarquía real cambiara. */}
          <p className="eyebrow reveal">{t('byCountry')}</p>

          {/* `.eyebrow` ya es una superficie de cristal, así que la nota va en
              su propio panel y no envolviendo a la píldora. */}
          <div className="glass glass-strong glass-spec reveal mt-6 max-w-[70ch] px-5 py-4">
            <p className="text-ink-muted">{t('railNote')}</p>
          </div>

          {groups.map((group, groupIndex) => (
            <div
              key={group.iso}
              className={groupIndex === 0 ? 'mt-12' : 'mt-16 sm:mt-20'}
            >
              {/* El id es el destino del enlace del mapa. El desplazamiento lo
                  resuelve `:target { scroll-margin-top }` de globals.css.

                  El h2 cae DIRECTO sobre la aurora, así que es `text-ink`
                  (10.2:1) y el contador va en un badge de cristal: como
                  `text-ink-subtle` suelto medía 3.23:1 y no pasaba. */}
              <h2
                id={`pais-${group.iso}`}
                className="reveal flex flex-wrap items-center gap-x-4 gap-y-2 text-d2 text-ink"
              >
                {COUNTRY_NAME[group.iso][locale]}
                <Badge variant="glass" data-numeric="">
                  {group.items.length}{' '}
                  {group.items.length === 1
                    ? en
                      ? 'entry'
                      : 'registro'
                    : en
                      ? 'entries'
                      : 'registros'}
                </Badge>
              </h2>

              <Carousel
                label={`${tl('projectsRail')} — ${COUNTRY_NAME[group.iso][locale]}`}
                prevLabel={tl('prevSlide')}
                nextLabel={tl('nextSlide')}
                className="mt-6"
              >
                {group.items.map((company) => {
                  const kind = KIND_BADGE[company.kind]
                  const KindIcon = kind.icon

                  /**
                   * `portada.png` es la ruta acordada del hueco. Si algún día
                   * hay una captura real registrada en data/companies.ts, esa
                   * gana y el hueco desaparece sin tocar este archivo.
                   */
                  const shot = company.shots[0]

                  return (
                    /* La inclinación sigue al puntero. `.scene` —la
                       perspectiva— ya está en el riel del carrusel, así que
                       todas las tarjetas comparten un mismo punto de fuga, que
                       es lo que separa un 3D creíble de varias tarjetas girando
                       cada una por su cuenta. */
                    <Tilt3D
                      key={company.slug}
                      className="w-[19rem] sm:w-[23rem]"
                    >
                      {/* La tarjeta entera es el enlace: un objetivo de clic
                          grande y un solo destino, en vez de un enlace-título
                          de 200 px al que hay que apuntar.

                          Superficie OPACA (`.card`) y no cristal, por dos
                          razones: la etiqueta del hueco de imagen ya es un
                          panel de cristal, y un `backdrop-filter` dentro de otro
                          difumina dos veces y se paga doble. Además, sobre la
                          aurora una superficie opaca es lo que deja leer el
                          `ink-muted` del cuerpo.

                          Nada de `overflow-hidden` ni `.sheen` en este nodo:
                          las dos cosas fuerzan el aplanado del 3D y las clases
                          `.depth-*` de dentro dejarían de levantar. El recorte
                          y el barrido especular viven en la portada. */}
                      <Link
                        href={{
                          pathname: '/proyectos/[slug]',
                          params: { slug: company.slug },
                        }}
                        className="card lift group flex h-full flex-col p-3 [transform-style:preserve-3d]"
                      >
                        <ImageSlot
                          path={
                            shot ?? `/proyectos/${company.slug}/portada.png`
                          }
                          filled={Boolean(shot)}
                          alt={t('coverAlt', { name: company.name })}
                          hint="Portada del proyecto"
                          width={1200}
                          height={750}
                          priority={company.slug === firstSlug}
                          sizes="(min-width: 640px) 344px, 280px"
                          className="sheen depth-1 aspect-[16/10] w-full overflow-hidden rounded-xl shadow-lift-2"
                        />

                        <div className="flex flex-1 flex-col p-3 pt-5 [transform-style:preserve-3d]">
                          <div className="depth-2 flex flex-wrap items-center gap-2">
                            <Badge variant={kind.variant}>
                              <KindIcon className="size-3" aria-hidden="true" />
                              {t(kind.key)}
                            </Badge>
                          </div>

                          <h3 className="depth-2 mt-4 text-d3 text-ink transition-colors duration-300 group-hover:text-brand-strong">
                            {company.name}
                          </h3>

                          <p className="depth-1 mt-1.5 text-sm font-semibold text-ink-muted">
                            {company.role}
                          </p>

                          {/* Fechas legibles por máquina: dos <time> reales.
                              `endDate: null` significa en curso, y ahí no se
                              escribe una fecha inventada. */}
                          <p
                            data-numeric=""
                            className="depth-1 mt-3 text-sm font-semibold text-brand-strong"
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

                          <span className="depth-2 mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-strong">
                            {t('viewProject')}
                            <ArrowUpRight
                              className="size-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                              aria-hidden="true"
                            />
                          </span>
                        </div>
                      </Link>
                    </Tilt3D>
                  )
                })}
              </Carousel>
            </div>
          ))}

          {/* Cae directo sobre la aurora: `text-ink`, no `ink-subtle`. */}
          <p className="reveal mt-10 text-sm text-ink">{tc('dragHint')}</p>
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
