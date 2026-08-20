import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  CalendarRange,
  FileText,
  Globe,
  Images,
  Layers,
  MapPin,
  Rocket,
  UserRound,
  type LucideIcon,
} from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { ProjectCover } from '@/components/map/project-cover'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Carousel } from '@/components/ui/carousel'
import { GlassPanel } from '@/components/ui/glass-panel'
import { ImageSlot } from '@/components/ui/image-slot'
import { PointerGlow } from '@/components/motion/pointer-glow'
import { Tilt3D } from '@/components/motion/tilt-3d'
import {
  getCompanies,
  getCompanyBySlug,
  getCompanySlugs,
  type Company,
  type CompanyKind,
  type CountryCode,
} from '@/data/companies'
import { routing } from '@/i18n/routing'
import { NAP, ROUTES, SITE_CONFIG, getSiteConfig } from '@/lib/constants'
import { generateBreadcrumbSchema, type JsonLdNode } from '@/lib/schema'
import { generatePageMetadata } from '@/lib/seo'
import { formatShortDate } from '@/lib/utils'
import { Locale } from '@/data/types'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

/**
 * Las 10 páginas (5 empresas × 2 idiomas) se prerenderizan.
 *
 * Se devuelven las dos claves —`locale` y `slug`— en lugar de solo el slug:
 * el layout de arriba ya declara sus locales y cruzarlas aquí deja el
 * conjunto completo escrito en un solo lugar. Los slugs salen de
 * `getCompanySlugs()`, que es locale-independiente, así que agregar una
 * empresa a data/companies.ts crea sus dos páginas sin tocar este archivo.
 */
export function generateStaticParams() {
  const slugs = getCompanySlugs()
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  )
}

/* ══════════════════════════════════════════════════════════════════════
   URLS

   `lib/seo.ts` construye el canonical desde la tabla ROUTES, y ROUTES no
   tiene parámetros: la clave `proyectos` vale `/proyectos` | `/projects`,
   sin slug. Así que la ruta localizada de ESTA página se arma aquí, sobre
   la misma clave, y el resultado se le pasa por encima al metadata que
   devuelve `generatePageMetadata`.

   Ojo con no romper el patrón: canonical autorreferencial más tres
   alternates (es-MX, en-US y x-default apuntando al español, que es el
   mercado principal). Un hreflang que no se corresponda en las dos
   direcciones no se honra.
   ══════════════════════════════════════════════════════════════════════ */

/** `/proyectos/amazon` en español, `/projects/amazon` en inglés. */
function projectPath(locale: Locale, slug: string): string {
  return `${ROUTES.proyectos[locale]}/${slug}`
}

function projectUrl(locale: Locale, slug: string): string {
  return `${SITE_CONFIG.url}/${locale}${projectPath(locale, slug)}`
}

/* ══════════════════════════════════════════════════════════════════════
   ETIQUETAS DERIVADAS DE LOS DATOS

   Los dos campos cerrados de `Company` (kind y country) se traducen por
   tabla, no con ternarios sueltos: si mañana entra un cuarto `kind`, el
   compilador exige su clave en lugar de dejar la etiqueta en blanco.
   ══════════════════════════════════════════════════════════════════════ */

const KIND_KEY: Record<CompanyKind, string> = {
  empleo: 'kindEmpleo',
  cliente: 'kindCliente',
  propio: 'kindPropio',
}

const KIND_ICON: Record<CompanyKind, LucideIcon> = {
  empleo: Briefcase,
  cliente: UserRound,
  propio: Rocket,
}

const COUNTRY_KEY: Record<CountryCode, string> = {
  MEX: 'countryMEX',
  USA: 'countryUSA',
}

/**
 * ════════════════════════════════════════════════════════════════
 * LAS TRES POSICIONES DE LA GALERÍA
 *
 * Fijas y en este orden para las diez páginas: captura principal, detalle y
 * resultado. Es lo que hace que el hueco sirva de instrucción — el dueño pidió
 * "algo que las referencie para yo entender dónde van", y un hueco que siempre
 * está en la misma posición con la misma ruta se puede llenar sin preguntar.
 *
 * El `hint` va en español a secas, como en el resto de los huecos del sitio: es
 * una nota para quien pega el archivo, no texto de la página. Lo que sí se
 * traduce es el `alt` y el pie de foto, que salen de `proyecto.shotAlt`.
 *
 * La galería NO se omite cuando `shots` está vacío —que es el caso hoy en las
 * cinco entradas—: los tres huecos etiquetados SON el contenido mientras no
 * haya capturas.
 * ════════════════════════════════════════════════════════════════
 */
const GALLERY_SLOTS: readonly { file: string; hint: string }[] = [
  { file: 'captura-1.png', hint: 'Captura principal' },
  { file: 'captura-2.png', hint: 'Detalle' },
  { file: 'captura-3.png', hint: 'Resultado' },
]

/**
 * Iniciales para la portada generada. Se derivan del nombre, no se inventan:
 * dos o tres palabras dan sus iniciales, una sola palabra da sus dos primeras
 * letras.
 */
function initials(name: string): string {
  const words = name.split(/\s+/).filter(Boolean)
  if (words.length === 0) return '·'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return words
    .slice(0, 3)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

/**
 * ════════════════════════════════════════════════════════════════
 * CAPAS DE FONDO
 *
 * Aurora + grano + cuadrícula. Los cuatro <i> son obligatorios: cada uno es un
 * campo de color distinto, y son lo que hace VISIBLE el cristal. Sobre el fondo
 * casi blanco del sitio un panel translúcido se ve igual que un panel blanco.
 *
 * Dos secciones con aurora en esta página —la cabecera y la galería—, más la
 * del pie, que ya existe. El límite medido está en cinco: ahí el navegador
 * devuelve las animaciones al hilo principal y cada bucle empieza a costar un
 * recálculo de estilo por frame.
 * Verifica: node scripts/perf-probe.mjs http://localhost:3000/es/proyectos/amazon
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
  const { locale: rawLocale, slug } = await params
  const locale = rawLocale as Locale
  const company = getCompanyBySlug(locale, slug)

  // Un slug inexistente no debe heredar el metadata del listado: sin datos no
  // hay página, y el `notFound()` del componente responde 404.
  if (!company) return { title: '404', robots: { index: false, follow: false } }

  const canonical = projectUrl(locale, slug)
  const config = getSiteConfig(locale)
  const title = `${company.name} — ${company.role}`

  const base = generatePageMetadata({
    locale,
    route: 'proyectos',
    title,
    description: company.summary,
  })

  return {
    ...base,
    alternates: {
      canonical,
      languages: {
        'es-MX': projectUrl('es', slug),
        'en-US': projectUrl('en', slug),
        'x-default': projectUrl('es', slug),
      },
    },
    // El openGraph se rearma en lugar de mutarse: `base.openGraph` trae la URL
    // del listado, que es justo lo que no puede quedarse aquí.
    openGraph: {
      type: 'website',
      locale: config.ogLocale,
      alternateLocale: locale === 'es' ? 'en_US' : 'es_MX',
      url: canonical,
      title,
      description: company.summary,
      siteName: SITE_CONFIG.name,
    },
  }
}

/* ══════════════════════════════════════════════════════════════════════
   JSON-LD

   WebPage (subtipo ItemPage, que es exactamente "página dedicada a un solo
   elemento") más BreadcrumbList. Para los proyectos propios se agrega un
   CreativeWork y la página lo declara como `mainEntity`.

   Lo que NO se emite: un nodo Organization por los empleos. El sujeto de
   esta página es el trabajo de Carlos, no la empresa, y marcarla como si
   este fuera su sitio oficial sería declarar algo falso.

   Tampoco se emite `image`: hoy no hay ni una captura real en `shots`, y
   declarar una URL de imagen que devuelve 404 es peor que no declararla.

   ⚠ Los dos @id de abajo son ESPEJO de la tabla ID de lib/schema.ts, que no
   se exporta. Los nodos #person y #website los emite el layout en todas las
   URLs, así que estas referencias resuelven; si allá cambian las cadenas,
   hay que cambiarlas aquí también.
   ══════════════════════════════════════════════════════════════════════ */

const PERSON_ID = `${SITE_CONFIG.url}/#person`
const WEBSITE_ID = `${SITE_CONFIG.url}/#website`

function buildGraph(
  locale: Locale,
  company: Company,
  labels: { home: string; projects: string }
) {
  const pageUrl = projectUrl(locale, company.slug)
  const workId = `${pageUrl}#work`
  const isOwnWork = company.kind === 'propio'
  const lang = locale === 'en' ? 'en-US' : 'es-MX'

  const page: JsonLdNode = {
    '@type': 'ItemPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: `${company.name} — ${company.role}`,
    description: company.summary,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': PERSON_ID },
    ...(isOwnWork ? { mainEntity: { '@id': workId } } : {}),
    inLanguage: lang,
    breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
    // Fecha real de publicación del sitio. No se declara `dateModified`:
    // nadie sabe cuándo cambió este texto por última vez.
    datePublished: SITE_CONFIG.foundingDate,
  }

  const work: JsonLdNode[] = isOwnWork
    ? [
        {
          '@type': 'CreativeWork',
          '@id': workId,
          name: company.name,
          description: company.summary,
          // La fecha sale de los datos tal cual: `YYYY-MM` es una fecha ISO
          // válida y no finge precisión de día.
          dateCreated: company.startDate,
          inLanguage: lang,
          author: { '@id': PERSON_ID },
          creator: { '@id': PERSON_ID },
          keywords: company.stack.join(', '),
          ...(company.url ? { url: company.url } : {}),
        },
      ]
    : []

  return {
    '@context': 'https://schema.org' as const,
    '@graph': [
      page,
      ...work,
      generateBreadcrumbSchema(
        [
          { name: labels.home, route: 'home' },
          { name: labels.projects, route: 'proyectos' },
          { name: company.name, url: projectPath(locale, company.slug) },
        ],
        locale,
        pageUrl
      ),
    ],
  }
}

export default async function ProjectPage({ params }: Props) {
  const { locale: rawLocale, slug } = await params
  setRequestLocale(rawLocale)

  const locale = rawLocale as Locale
  const en = locale === 'en'

  const company = getCompanyBySlug(locale, slug)
  if (!company) notFound()

  const t = await getTranslations('proyecto')
  const tc = await getTranslations('common')
  const tn = await getTranslations('nav')
  const tb = await getTranslations('breadcrumbs')
  const tl = await getTranslations('a11y')

  /**
   * Vecinos en el orden del archivo de datos. Sin ciclo: el primero no tiene
   * anterior y el último no tiene siguiente, y en ese caso no se dibuja nada
   * en lugar de un enlace que da la vuelta sin avisar.
   */
  const companies = getCompanies(locale)
  const index = companies.findIndex((c) => c.slug === company.slug)
  const previous = index > 0 ? companies[index - 1] : undefined
  const next =
    index >= 0 && index < companies.length - 1
      ? companies[index + 1]
      : undefined

  const KindIcon = KIND_ICON[company.kind]

  const start = formatShortDate(company.startDate, locale)
  const end = company.endDate
    ? formatShortDate(company.endDate, locale)
    : tc('present')
  /** Un hackathon empieza y termina el mismo mes: ahí va una sola fecha. */
  const sameMonth = company.startDate === company.endDate

  /**
   * La portada del héroe usa la primera captura real si existe; si no, el
   * patrón determinista por slug de `ProjectCover`.
   *
   * La galería recorre las TRES posiciones desde el índice 0, así que cuando
   * `shots[0]` existe la captura principal se ve dos veces: enmarcada arriba
   * como portada y otra vez como primer elemento de la galería. Es deliberado —
   * la portada es la presentación y la galería es el inventario completo, y
   * saltarse la primera posición dejaría un hueco con la ruta equivocada.
   */
  const cover = company.shots[0]

  const gallery = GALLERY_SLOTS.map((slot, i) => {
    const shot = company.shots[i]
    return {
      key: slot.file,
      // La ruta real gana; si no hay, el hueco anuncia dónde va el archivo.
      path: shot ?? `/proyectos/${company.slug}/${slot.file}`,
      filled: Boolean(shot),
      hint: slot.hint,
      caption: t('shotAlt', { n: i + 1, name: company.name }),
    }
  })

  const facts: { label: string; value: string; icon: LucideIcon }[] = [
    { label: t('rolLabel'), value: company.role, icon: Briefcase },
    { label: t('kindLabel'), value: t(KIND_KEY[company.kind]), icon: Layers },
    {
      label: t('countryLabel'),
      value: t(COUNTRY_KEY[company.country]),
      icon: Globe,
    },
    // La ciudad solo aparece si está en los datos. Los tres empleos no la
    // tienen registrada y aquí no se rellena con una plausible.
    ...(company.city
      ? [{ label: t('cityLabel'), value: company.city, icon: MapPin }]
      : []),
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildGraph(locale, company, {
              home: tb('home'),
              projects: tn('projects'),
            })
          ),
        }}
      />

      {/* ══ CABECERA ═══════════════════════════════════════════════
          Aurora, grano, cuadrícula y el resplandor que sigue al puntero, todos
          en -z-10 dentro de un contenedor `relative isolate`. Ninguno captura
          eventos. La aurora es lo que difumina el panel de cristal de los datos
          duros: sin color detrás, ese panel se ve como un rectángulo blanco. */}
      <section className="relative isolate overflow-hidden border-b border-hairline">
        <Backdrop glow />

        <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
          {/* Tres niveles: Inicio (lo dibuja el componente) → Proyectos →
              nombre. El mismo orden que el BreadcrumbList de arriba. */}
          <Breadcrumbs
            items={[
              { label: tn('projects'), href: '/proyectos' },
              { label: company.name },
            ]}
          />

          <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14">
            <div>
              <p className="eyebrow enter-scale">
                <KindIcon className="size-3.5" aria-hidden="true" />
                {t(KIND_KEY[company.kind])}
              </p>

              {/* Único h1 de la página, y cae DIRECTO sobre la aurora: por eso
                  es `text-ink` (10.2:1) y no una variante apagada. */}
              <h1 className="enter-blur step-1 mt-6 text-d1 text-ink">
                {company.name}
              </h1>

              <span
                className="grad-deco enter step-1 mt-7 block h-1 w-12 rounded-full"
                aria-hidden="true"
              />

              {/* Rol, periodo y resumen van DENTRO de cristal. Medido:
                  `ink-muted` sobre el campo azul de la aurora cae a 3.83:1;
                  sobre `.glass-strong` mide 5.1:1. Y el texto sobre cristal es
                  SIEMPRE tinta, nunca blanco (1.96:1). */}
              <div className="glass glass-strong glass-spec enter step-2 mt-7 p-6 sm:p-7">
                <p className="text-lead font-semibold text-ink">
                  {company.role}
                </p>

                {/* Cada extremo del rango es su propio <time>: el elemento no
                    admite intervalos, así que dos fechas legibles por máquina
                    valen más que una cadena suelta. */}
                <p className="mt-3 flex flex-wrap items-center gap-2 text-sm font-semibold text-ink-muted">
                  <CalendarRange
                    className="size-4 text-sky-ink"
                    aria-hidden="true"
                  />
                  <time dateTime={company.startDate} data-numeric="">
                    {start}
                  </time>
                  {sameMonth ? null : (
                    <>
                      <span aria-hidden="true">–</span>
                      {company.endDate ? (
                        <time dateTime={company.endDate} data-numeric="">
                          {end}
                        </time>
                      ) : (
                        <span>{end}</span>
                      )}
                    </>
                  )}
                </p>

                <p className="mt-5 max-w-[60ch] text-ink-muted">
                  {company.summary}
                </p>
              </div>

              <div className="enter step-4 mt-9 flex flex-wrap items-center gap-4">
                {company.url ? (
                  <Button asChild className="sheen shadow-glow-brand">
                    <a
                      href={company.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('externalLink')}
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </a>
                  </Button>
                ) : null}
                <Button
                  asChild
                  className="press"
                  variant={company.url ? 'outline' : 'default'}
                >
                  <Link href="/proyectos">
                    <ArrowLeft className="size-4" aria-hidden="true" />
                    {t('backToAll')}
                  </Link>
                </Button>
              </div>
            </div>

            {/* ── COMPOSICIÓN EN PROFUNDIDAD ──
                `.scene` pone la perspectiva en el CONTENEDOR y `<Tilt3D>` la
                rotación en el hijo: separarlas es lo que hace que la portada y
                el logo compartan un punto de fuga en lugar de girar cada uno
                por su cuenta.

                `transform-style: preserve-3d` en el nodo interno es lo que
                permite que las clases `.depth-*` levanten de verdad: sin él el
                subárbol se aplana y el logo quedaría pegado a la portada. Por
                lo mismo NO hay `overflow-hidden` en ese nodo — recortar fuerza
                el aplanado; el recorte vive en la portada. */}
            <div className="enter-scale step-3">
              <div className="relative mx-auto mb-10 w-full max-w-[30rem]">
                {/* Halo que se desplaza, detrás de todo. `.grad-drift` fija
                    `position: relative` desde fuera de `@layer` y le ganaría a
                    la utilidad `absolute`, así que el posicionamiento vive en
                    el envoltorio y el gradiente en el hijo. */}
                <div className="absolute -inset-5 opacity-60" aria-hidden="true">
                  <div className="grad-drift float-slow size-full rounded-[3rem]" />
                </div>

                <div className="scene relative">
                  <Tilt3D>
                    <div className="relative [transform-style:preserve-3d]">
                      <ProjectCover
                        seed={company.slug}
                        label={initials(company.name)}
                        shot={cover}
                        shotAlt={
                          cover
                            ? t('shotAlt', { n: 1, name: company.name })
                            : undefined
                        }
                        priority
                        className="depth-1 aspect-[16/10] w-full overflow-hidden rounded-3xl shadow-lift-4"
                      />

                      {/* El logo, en el plano más adelantado y asomando por
                          debajo del borde de la portada. Va FUERA de la portada
                          —no dentro— porque su etiqueta de hueco es a su vez un
                          panel de cristal: un `backdrop-filter` dentro de otro
                          difumina dos veces. Aquí abajo solo tiene el patrón
                          del propio hueco detrás. */}
                      <div className="depth-3 absolute -bottom-8 left-5 w-28 sm:w-32">
                        <ImageSlot
                          path={`/logos/${company.slug}.png`}
                          alt={t('logoAlt', { name: company.name })}
                          hint="Logo"
                          width={400}
                          height={400}
                          sizes="128px"
                          className="lift aspect-square w-full overflow-hidden rounded-2xl border-2 border-surface shadow-lift-3"
                        />
                      </div>
                    </div>
                  </Tilt3D>
                </div>
              </div>
            </div>
          </div>

          {/* Panel protagonista: los datos duros de una sola mirada.
              `strong` es OBLIGATORIO porque los `dt` son `text-ink-subtle`, que
              sobre el cristal por defecto mide 4.30 y no pasa; sobre el fuerte,
              4.54. `rim` le pone el borde recorrido por el gradiente — el
              componente ya corrige por dentro que la imagen de `rim` no tape la
              opacidad de `strong`. */}
          <GlassPanel
            as="aside"
            strong
            rim
            className="enter step-5 mt-16 p-6 sm:p-8"
            aria-labelledby="datos-del-trabajo"
          >
            <h2
              id="datos-del-trabajo"
              className="font-display text-d3 text-ink"
            >
              {t('factsTitle')}
            </h2>

            <dl className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {facts.map((fact) => {
                const Icon = fact.icon
                return (
                  <div key={fact.label}>
                    <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-ink-subtle">
                      <Icon className="size-3.5" aria-hidden="true" />
                      {fact.label}
                    </dt>
                    <dd className="mt-2 font-semibold text-ink">
                      {fact.value}
                    </dd>
                  </div>
                )
              })}

              <div>
                <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-ink-subtle">
                  <CalendarRange className="size-3.5" aria-hidden="true" />
                  {t('periodLabel')}
                </dt>
                <dd data-numeric="" className="mt-2 font-semibold text-ink">
                  {sameMonth ? start : `${start} – ${end}`}
                </dd>
              </div>
            </dl>

            <h3 className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-ink-subtle">
              <Layers className="size-3.5" aria-hidden="true" />
              {t('stackTitle')}
            </h3>
            {/* Badges `sky` y no `glass`: un badge de cristal dentro de un
                panel de cristal es cristal sobre cristal. `--sky` a secas es
                decorativo (2.70:1); el texto va con `--sky-ink`, 5.8:1. */}
            <ul className="mt-3 flex flex-wrap gap-2">
              {company.stack.map((item) => (
                <li key={item}>
                  <Badge variant="sky">{item}</Badge>
                </li>
              ))}
            </ul>
          </GlassPanel>
        </div>
      </section>

      {/* ══ EL TRABAJO ═════════════════════════════════════════════ */}
      <section className="defer-paint border-b border-hairline bg-ground-tint">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          {/* El h2 va FUERA de `.prose-rich`: esa clase está escrita fuera de
              toda `@layer`, así que su regla `h2 { margin-top: 2.4em }` le gana
              a cualquier utilidad de Tailwind y le metería 2.4em de aire al
              primer encabezado del bloque. Dentro solo van los párrafos. */}
          <h2 className="reveal text-d1 text-ink">{t('bodyTitle')}</h2>

          {/* Entra girando desde atrás. Sobre superficie opaca el cuerpo puede
              ser `ink-muted` sin panel de cristal de por medio. */}
          <div className="reveal-3d prose-rich mt-8">
            {company.detail.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ══ GALERÍA ════════════════════════════════════════════════
          Las tres posiciones SIEMPRE se dibujan, con captura real o con el
          hueco etiquetado. Un hueco que dice la ruta exacta donde va el archivo
          es contenido útil; una sección que desaparece porque el array está
          vacío no le dice a nadie qué falta.

          Carrusel y no rejilla: el imán y el arrastre son nativos
          (`scroll-snap`), así que si el JS no corre el carril sigue funcionando
          y los tres elementos completos están en el HTML del servidor.      */}
      <section className="relative isolate overflow-hidden border-b border-hairline">
        <Backdrop />

        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          {/* La píldora lleva el nombre del proyecto y no el título de la
              sección: repetir "Capturas" dos veces seguidas no informa. */}
          <p className="eyebrow reveal">
            <Images className="size-3.5" aria-hidden="true" />
            {company.name}
          </p>

          <h2 className="reveal mt-6 text-d1 text-ink">{t('galleryTitle')}</h2>

          {/* La nota explicativa va en cristal: es `ink-muted` y cae sobre la
              aurora. Cuando no hay ni una captura se añade el aviso honesto de
              `noShots` en lugar de fingir una galería. */}
          <div className="glass glass-strong glass-spec reveal mt-6 max-w-[74ch] p-5 sm:p-6">
            <p className="text-ink-muted">{t('galleryLead')}</p>
            {company.shots.length === 0 ? (
              <p className="mt-4 text-sm text-ink-muted">{t('noShots')}</p>
            ) : null}
          </div>

          <Carousel
            label={`${tl('galleryRail')} — ${company.name}`}
            prevLabel={tl('prevSlide')}
            nextLabel={tl('nextSlide')}
            className="mt-10"
          >
            {gallery.map((item, i) => (
              /* `.scene` ya está en el riel del carrusel, así que las tres
                 láminas comparten punto de fuga. */
              <Tilt3D
                key={item.key}
                className="w-[19rem] sm:w-[26rem] lg:w-[30rem]"
              >
                {/* Superficie OPACA. La etiqueta del hueco es un panel de
                    cristal, y meterla dentro de otro difuminaría dos veces. */}
                <figure className="card lift flex h-full flex-col p-3 [transform-style:preserve-3d]">
                  <ImageSlot
                    path={item.path}
                    filled={item.filled}
                    alt={item.caption}
                    hint={item.hint}
                    width={1200}
                    height={750}
                    sizes="(min-width: 1024px) 448px, (min-width: 640px) 384px, 280px"
                    className="sheen depth-1 aspect-[16/10] w-full overflow-hidden rounded-xl shadow-lift-2"
                  />

                  <figcaption className="depth-2 mt-4 flex items-center gap-3 px-2 pb-1">
                    <Badge variant="neutral" data-numeric="">
                      {i + 1}
                    </Badge>
                    <span className="text-sm font-semibold text-ink">
                      {item.caption}
                    </span>
                  </figcaption>
                </figure>
              </Tilt3D>
            ))}
          </Carousel>

          {/* Cae directo sobre la aurora: `text-ink`, no `ink-subtle`. */}
          <p className="reveal mt-8 text-sm text-ink">{tc('dragHint')}</p>
        </div>
      </section>

      {/* ══ DOCUMENTOS ═════════════════════════════════════════════
          `docs` está vacío en las cinco entradas y public/pdf no tiene
          archivos, así que la sección entera se omite en lugar de listar
          enlaces a PDFs que no existen. Aquí sí se omite —y en la galería no—
          porque un enlace a un archivo inexistente es un 404, mientras que un
          hueco de imagen etiquetado es una instrucción.                     */}
      {company.docs.length > 0 ? (
        <section className="defer-paint border-b border-hairline">
          <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
            <h2 className="reveal text-d1 text-ink">{t('docsTitle')}</h2>

            <ul className="reveal-stagger scene mt-10 grid gap-4 sm:grid-cols-2">
              {company.docs.map((doc) => (
                <li key={doc.href}>
                  <a
                    href={doc.href}
                    className="card tilt-hover press group flex items-center gap-4 p-5"
                  >
                    <span
                      className="grad-deco inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-white shadow-glow-brand"
                      aria-hidden="true"
                    >
                      <FileText className="size-5" />
                    </span>
                    <span className="font-semibold text-ink transition-colors group-hover:text-brand-strong">
                      {doc.label}
                    </span>
                    <ArrowUpRight
                      className="ml-auto size-4 shrink-0 text-ink-subtle transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* ══ ANTERIOR / SIGUIENTE ═══════════════════════════════════
          `.tilt-hover` y no `.lift`: las dos escriben `transform` sobre el
          mismo nodo y `.lift` está después en globals.css, así que juntas la
          inclinación no se vería. `.press` sí convive — solo actúa en `:active`
          y es lo que da la sensación de clic. */}
      <section className="defer-paint mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <h2 className="reveal text-d3 text-ink">{t('navTitle')}</h2>

        <div className="reveal scene mt-8 grid gap-4 sm:grid-cols-2">
          {previous ? (
            <Link
              href={{
                pathname: '/proyectos/[slug]',
                params: { slug: previous.slug },
              }}
              className="card tilt-hover press group flex flex-col p-6"
            >
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-ink-subtle">
                <ArrowLeft
                  className="size-3.5 transition-transform duration-300 group-hover:-translate-x-1"
                  aria-hidden="true"
                />
                {t('prev')}
              </span>
              <span className="mt-3 font-display text-d3 text-ink transition-colors group-hover:text-brand-strong">
                {previous.name}
              </span>
              <span className="mt-1 text-sm text-ink-muted">
                {previous.role}
              </span>
            </Link>
          ) : (
            /* Hueco para que el "siguiente" conserve su columna cuando no
               hay anterior. Decorativo y vacío: no anuncia nada. */
            <span aria-hidden="true" className="hidden sm:block" />
          )}

          {next ? (
            <Link
              href={{
                pathname: '/proyectos/[slug]',
                params: { slug: next.slug },
              }}
              className="card tilt-hover press group flex flex-col p-6 sm:items-end sm:text-right"
            >
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-ink-subtle">
                {t('next')}
                <ArrowRight
                  className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
              <span className="mt-3 font-display text-d3 text-ink transition-colors group-hover:text-brand-strong">
                {next.name}
              </span>
              <span className="mt-1 text-sm text-ink-muted">{next.role}</span>
            </Link>
          ) : null}
        </div>

        <Link
          href="/proyectos"
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-strong hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {t('backToAll')}
        </Link>
      </section>

      {/* ══ CTA FINAL ══════════════════════════════════════════════ */}
      <section className="defer-paint mx-auto w-full max-w-6xl px-5 pb-20 sm:px-8 sm:pb-24">
        <div className="grad-drift reveal-scale rounded-3xl px-6 py-14 shadow-lift-3 sm:px-12 sm:py-20">
          <div className="relative max-w-2xl">
            <h2 className="text-d1 text-white">{t('ctaTitle')}</h2>
            <p className="mt-5 text-lead text-white/85">{t('ctaLead')}</p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              {/* Sobre el gradiente el botón se invierte: superficie blanca
                  con texto de marca. Un relleno de marca desaparecería. */}
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

            <p className="mt-6 text-sm text-white/80">
              {en
                ? 'This page is written from what the data file actually records: role, dates, country. Nothing here is a client I cannot name.'
                : 'Esta página está escrita con lo que consta en el archivo de datos: rol, fechas, país. Nada de aquí es un cliente que no pueda nombrar.'}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
