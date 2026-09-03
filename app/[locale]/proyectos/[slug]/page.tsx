import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Rail } from '@/components/instrument/rail'
import { MediaSlot } from '@/components/instrument/media-slot'
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

   Sin iconos: en este sistema una etiqueta es texto mono sobre una regla,
   no un símbolo dentro de una cápsula.
   ══════════════════════════════════════════════════════════════════════ */

const KIND_KEY: Record<CompanyKind, string> = {
  empleo: 'kindEmpleo',
  cliente: 'kindCliente',
  propio: 'kindPropio',
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
 * "algo que las referencee para yo entender dónde van", y un hueco que siempre
 * está en la misma posición con la misma ruta se puede llenar sin preguntar.
 *
 * Son una secuencia REAL —1, 2, 3 significan algo—, así que aquí la
 * numeración sí se escribe.
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
          /* `keywords` solo si hay stack: con `stack: []` se emitía
             `"keywords": ""` en el JSON-LD, una propiedad vacía declarada.
             Marcar lo que no es cierto es peor que no marcar — la regla ya
             está escrita en `lib/schema.ts` para SearchAction y
             contactOption. */
          ...(company.stack.length > 0
            ? { keywords: company.stack.join(', ') }
            : {}),
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

  const start = formatShortDate(company.startDate, locale)
  const end = company.endDate
    ? formatShortDate(company.endDate, locale)
    : tc('present')
  /** Un hackathon empieza y termina el mismo mes: ahí va una sola fecha. */
  const sameMonth = company.startDate === company.endDate

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

  /**
   * Los datos duros, en filas. Un diagnóstico es una tabla: etiqueta mono a
   * la izquierda, valor a la derecha, una regla entre cada par. Ninguna
   * tarjeta, ningún icono dentro de un círculo.
   */
  const facts: { label: string; value: string; mono?: boolean }[] = [
    { label: t('rolLabel'), value: company.role },
    { label: t('kindLabel'), value: t(KIND_KEY[company.kind]) },
    { label: t('countryLabel'), value: t(COUNTRY_KEY[company.country]) },
    // La ciudad solo aparece si está en los datos. Los tres empleos no la
    // tienen registrada y aquí no se rellena con una plausible.
    ...(company.city ? [{ label: t('cityLabel'), value: company.city }] : []),
    {
      label: t('periodLabel'),
      value: sameMonth ? start : `${start} – ${end}`,
      mono: true,
    },
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

      <div
        className="grid"
        style={{ gridTemplateColumns: 'var(--tape-w) minmax(0,1fr)' }}
      >
        <Rail />

        <div className="min-w-0">
          {/* ═══ CABECERA ════════════════════════════════════════
              El titular es el LCP y se pinta desde el servidor: no hay
              portada generada delante de él ni una composición que espere
              a nada. El hueco del logo se conserva —marca dónde va el
              archivo, con su ruta exacta— pero sin marco y sin sombra. */}
          <section className="hero-in relative px-5 pt-16 sm:px-10">
            {/* ── LA HOJA TIENE DOS MÁRGENES ── */}
            <div className="ledger">
              <div className="min-w-0">
                <MediaSlot
                  id={`proyecto-${company.slug}-logo`}
                  compact
                  sizes="176px"
                  className="w-36 sm:w-44"
                />

                <p className="stamp mt-8">
                  {t(KIND_KEY[company.kind])}
                  {' · '}
                  {t(COUNTRY_KEY[company.country])}
                </p>

                {/* Único h1 de la página. */}
                <h1 className="mt-6 max-w-[16ch] text-hero text-ink">
                  {company.name}
                </h1>

                <p className="mt-10 max-w-[46ch] font-human text-lead text-ink-muted">
                  {company.summary}
                </p>

                {/* Cada extremo del rango es su propio <time>: el elemento no
                admite intervalos, así que dos fechas legibles por máquina
                valen más que una cadena suelta. */}
                <p className="stamp mt-8 tabular-nums">
                  <span className="sr-only">{t('periodLabel')}: </span>
                  <time dateTime={company.startDate}>{start}</time>
                  {sameMonth ? null : (
                    <>
                      {' – '}
                      {company.endDate ? (
                        <time dateTime={company.endDate}>{end}</time>
                      ) : (
                        <span>{end}</span>
                      )}
                    </>
                  )}
                </p>

                <p className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
                  {company.url ? (
                    <a
                      className="link-stylus"
                      href={company.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('externalLink')} ↗
                    </a>
                  ) : null}
                  <Link className="link-stylus" href="/proyectos">
                    ← {t('backToAll')}
                  </Link>
                </p>
              </div>

              {/* ── EL MARGEN DE ANOTACIÓN ──
                  La ficha técnica de la pieza. El stack vivía en una lista
                  larga más abajo; aquí arriba es lo primero que un técnico
                  quiere saber, y son datos, así que van en la cara de
                  máquina. */}
              <aside className="margin margin-sticky">
                {/* Los dos renglones del stack, solo si hay stack. Con
                    `stack: []` el primero leía «stack · 0 · tecnologías en el
                    registro» —una cifra de cero presentada como lectura de
                    instrumento— y el segundo, «construido con» sobre una lista
                    vacía. El margen de una gráfica lleva la LECTURA; un cero
                    ahí no es una lectura, es un hueco con rótulo. */}
                {company.stack.length > 0 ? (
                  <>
                    <div className="margin-row">
                      <span className="margin-key">stack</span>
                      <span className="margin-read">{company.stack.length}</span>
                      <span className="margin-val">
                        {en
                          ? 'technologies on the record.'
                          : 'tecnologías en el registro.'}
                      </span>
                    </div>

                    <div className="margin-row">
                      <span className="margin-key">
                        {en ? 'built with' : 'construido con'}
                      </span>
                      <ul className="mt-2 grid gap-1">
                        {company.stack.map((tech) => (
                          <li
                            key={tech}
                            className="font-mono text-[0.6875rem] leading-[1.4] tracking-[0.04em] text-ink"
                          >
                            {tech}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : null}

                {company.docs.length > 0 ? (
                  <div className="margin-row">
                    <span className="margin-key">
                      {en ? 'documents' : 'documentos'}
                    </span>
                    <ul className="mt-2 grid gap-1.5">
                      {company.docs.map((doc) => (
                        <li key={doc.href}>
                          <a
                            className="link-stylus font-mono text-[0.6875rem] tracking-[0.04em]"
                            href={doc.href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {doc.label} ↗
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </aside>
            </div>
          </section>

          {/* ═══ DATOS DEL TRABAJO ═══════════════════════════════
              Una tabla de registro. Rol, tipo, país, ciudad y periodo, cada
              uno en su fila con su regla. */}
          <section className="border-t border-hairline px-5 pb-24 pt-14 sm:px-10">
            <p className="stamp">{en ? 'record' : 'registro'}</p>

            <h2 className="mt-5 text-d1 text-ink">{t('factsTitle')}</h2>

            <dl className="reveal-stagger mt-10 max-w-3xl">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="band grid gap-1 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] sm:gap-8"
                >
                  <dt className="stamp">{fact.label}</dt>
                  <dd
                    className={
                      fact.mono ? 'font-mono tabular-nums text-ink' : 'text-ink'
                    }
                  >
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* El rótulo SOLO si hay stack. Con `stack: []` —el caso del
                despacho— esto imprimía «Stack» y debajo una `<ul>` vacía:
                un rótulo sin valor y 112 px de aire hasta el borde de la
                sección. `check:layout` lo reportaba como SECCIÓN MUDA y
                tenía razón. Es la misma regla que ya aplican `docs` y la
                galería treinta líneas más abajo, y la que este proyecto
                escribió para `.plaque`: si un dato no está en el repo, no
                aparece — ni su etiqueta. */}
            {company.stack.length > 0 ? (
              <>
                <h3 className="stamp mt-12 block">{t('stackTitle')}</h3>
                <ul className="mt-4 flex flex-wrap gap-x-7 gap-y-2">
                  {company.stack.map((item) => (
                    <li key={item} className="font-mono text-sm text-ink">
                      {item}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </section>

          {/* ═══ LA PLACA: QUÉ HICE ══════════════════════════════
              El material se invierte entero para el único bloque que se lee
              de corrido. Una sola placa por página, y en una ficha le toca
              al relato. Dentro no va `.link-stylus`: su color es papel y
              sobre papel desaparecería. */}
          <section className="plate relative px-5 py-20 sm:px-10">
            <p className="stamp">{en ? 'the work' : 'el trabajo'}</p>

            <h2 className="mt-5 max-w-[18ch] text-d1">{t('bodyTitle')}</h2>

            <div className="mt-10 max-w-[68ch]">
              {company.detail.map((paragraph, i) => (
                <p key={paragraph.slice(0, 48)} className={i > 0 ? 'mt-6' : ''}>
                  {paragraph}
                </p>
              ))}
            </div>
          </section>

          {/* ═══ CAPTURAS ════════════════════════════════════════
              La rejilla se dibuja SOLO si hay capturas de verdad.

              ⚠ Antes las tres posiciones se dibujaban siempre, y el comentario
              que había aquí lo defendía: «un hueco que dice la ruta exacta donde
              va el archivo es contenido útil». En la práctica no era eso. Los
              cinco `shots` están vacíos, así que en /proyectos/amazon —y en las
              otras cuatro— se leía el aviso honesto de que no hay capturas y
              justo debajo tres renglones numerados: «Captura 1 de Amazon»,
              «Captura 2 de Amazon», «Captura 3 de Amazon», sin imagen. Verificado
              en producción. Eso no se lee como una instrucción: se lee como una
              galería rota, en la página de la empresa más reconocible del
              currículum.

              Y este mismo archivo ya usaba la regla contraria treinta líneas más
              abajo, para `docs`: «la sección entera se omite en lugar de listar
              enlaces a PDFs que no existen». Ahora las dos secciones se
              comportan igual.

              Qué falta y dónde va sigue estando en `docs/MEDIA.md`, que se
              genera del MISMO dato — que es donde esa instrucción sirve, porque
              es el documento que lee el dueño y no el prospecto. */}
          <section className="border-t border-hairline px-5 pb-24 pt-14 sm:px-10">
            <p className="stamp">{company.name}</p>

            <h2 className="mt-5 text-d1 text-ink">{t('galleryTitle')}</h2>

            <p className="mt-6 max-w-[74ch] text-ink-muted">
              {t('galleryLead')}
            </p>

            {company.shots.length === 0 ? (
              <p className="gap mt-6 max-w-[74ch] pt-4 text-sm">
                {t('noShots')}
              </p>
            ) : (
              <ol className="reveal-stagger mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {gallery.map((item, i) => (
                  <li key={item.key}>
                    <figure className="m-0">
                      <MediaSlot
                        id={`proyecto-${company.slug}-captura-${i + 1}`}
                        compact
                        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                        className="w-full"
                      />
                      <figcaption className="mt-4 flex items-baseline gap-3">
                        <span className="stamp tabular-nums">{i + 1}</span>
                        <span className="text-sm text-ink">{item.caption}</span>
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </ol>
            )}
          </section>

          {/* ═══ DOCUMENTOS ══════════════════════════════════════
              `docs` está vacío en las cinco entradas y public/pdf no tiene
              archivos, así que la sección entera se omite en lugar de
              listar enlaces a PDFs que no existen. Aquí sí se omite —y en
              la galería no— porque un enlace a un archivo inexistente es un
              404, mientras que un hueco de imagen etiquetado es una
              instrucción. */}
          {company.docs.length > 0 ? (
            <section className="border-t border-hairline px-5 pb-24 pt-14 sm:px-10">
              <p className="stamp">{en ? 'attached' : 'anexos'}</p>

              <h2 className="mt-5 text-d1 text-ink">{t('docsTitle')}</h2>

              <ul className="reveal-stagger mt-10 max-w-3xl">
                {company.docs.map((doc) => (
                  <li key={doc.href} className="band">
                    <a
                      href={doc.href}
                      className="group flex items-baseline justify-between gap-6"
                    >
                      <span className="link-stylus">{doc.label}</span>
                      <span
                        aria-hidden="true"
                        className="stamp shrink-0 transition-transform duration-150 group-hover:translate-x-1"
                      >
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* ═══ SEGUIR VIENDO ═══════════════════════════════════
              Dos filas del mismo registro, no dos tarjetas enfrentadas. */}
          <section className="border-t border-hairline px-5 pb-24 pt-14 sm:px-10">
            <h2 className="text-d1 text-ink">{t('navTitle')}</h2>

            <ul className="reveal-stagger mt-8 max-w-3xl">
              {previous ? (
                <li>
                  <Link
                    href={{
                      pathname: '/proyectos/[slug]',
                      params: { slug: previous.slug },
                    }}
                    className="band group block"
                  >
                    <span className="stamp flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="inline-block transition-transform duration-150 group-hover:-translate-x-1"
                      >
                        ←
                      </span>
                      {t('prev')}
                    </span>
                    <span className="mt-2 block text-d3 text-ink">
                      {previous.name}
                    </span>
                    <span className="mt-1 block text-sm text-ink-muted">
                      {previous.role}
                    </span>
                  </Link>
                </li>
              ) : null}

              {next ? (
                <li>
                  <Link
                    href={{
                      pathname: '/proyectos/[slug]',
                      params: { slug: next.slug },
                    }}
                    className="band group block"
                  >
                    <span className="stamp flex items-center gap-2">
                      {t('next')}
                      <span
                        aria-hidden="true"
                        className="inline-block transition-transform duration-150 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </span>
                    <span className="mt-2 block text-d3 text-ink">
                      {next.name}
                    </span>
                    <span className="mt-1 block text-sm text-ink-muted">
                      {next.role}
                    </span>
                  </Link>
                </li>
              ) : null}
            </ul>

            <p className="mt-10">
              <Link className="link-stylus" href="/proyectos">
                ← {t('backToAll')}
              </Link>
            </p>
          </section>

          {/* ═══ CIERRE ══════════════════════════════════════════ */}
          <section className="border-t border-hairline px-5 pb-28 pt-16 sm:px-10">
            <h2 className="max-w-[18ch] text-d1 text-ink">{t('ctaTitle')}</h2>

            <p className="mt-6 max-w-[52ch] font-human text-lead text-ink-muted">
              {t('ctaLead')}
            </p>

            <p className="mt-10 flex flex-wrap items-baseline gap-x-8 gap-y-3">
              <Link className="link-stylus text-d3" href="/contacto">
                {t('ctaButton')} →
              </Link>
              <a
                className="link-stylus font-mono text-sm"
                href={`mailto:${NAP.email}`}
              >
                {NAP.email}
              </a>
            </p>

            <p className="gap mt-12 max-w-[74ch] pt-4 text-sm">
              {en
                ? 'This page is written from what the data file actually records: role, dates, country. Nothing here is a client I cannot name.'
                : 'Esta página está escrita con lo que consta en el archivo de datos: rol, fechas, país. Nada de aquí es un cliente que no pueda nombrar.'}
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
