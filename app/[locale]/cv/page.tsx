import type { Metadata } from 'next'
import Image from 'next/image'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Rail } from '@/components/instrument/rail'
import { Span } from '@/components/instrument/span'
import { PrintButton } from './print-button'
import { getPersonalInfo } from '@/data/personal'
import { getExperiences } from '@/data/experience'
import { getEducation } from '@/data/education'
import { getSkillCategories } from '@/data/skills'
import { getAwards } from '@/data/awards'
import { getCompanies } from '@/data/companies'
import { NAP, SEO_IMAGES, SOCIAL_LINKS, routeUrl } from '@/lib/constants'
import { generatePageMetadata } from '@/lib/seo'
import {
  generateWebPageSchema,
  generateBreadcrumbSchema,
  type SchemaGraph,
} from '@/lib/schema'
import { formatShortDate } from '@/lib/utils'
import { Locale } from '@/data/types'

/**
 * ════════════════════════════════════════════════════════════════
 * HOJA DE IMPRESIÓN — esto es lo que hace que la descarga sirva
 *
 * El botón de descarga llama a `window.print()`. Sin estas reglas lo que sale
 * del diálogo es la PÁGINA: el hollín a sangre, la cinta del margen ocupando
 * su columna de la rejilla, la aguja fija encima del texto y —lo peor— cada
 * bloque con `.reveal` congelado en su primer fotograma, que es `opacity: 0`.
 * Al imprimir no hay scroll que recorra ningún rango, así que media hoja
 * saldría literalmente en blanco.
 *
 * Lo que sale CON estas reglas es el sistema al revés: papel con tinta de
 * hollín. No es una concesión al papel, es la misma placa (`.plate`) extendida
 * a la hoja entera — que es exactamente lo que un registrador entrega cuando
 * termina de raspar: papel limpio con el trazo escrito encima.
 *
 * Va en un <style> de esta página y no en globals.css a propósito: son reglas
 * de UN documento. En la hoja global vivirían en todas las rutas.
 *
 * Ni un literal de color: `--paper`, `--soot` y `--ink-plate` son los mismos
 * tres tokens con los que la placa se pinta en pantalla.
 * ════════════════════════════════════════════════════════════════
 */
const PRINT_STYLES = `
@page {
  margin: 14mm 15mm 16mm;
}

@media print {
  /* ── 1. Fuera el instrumento y el cromo del sitio ────────────────
     La cinta y la aguja son el eje de tiempo en pantalla; en una hoja no hay
     scroll que medir, así que no significan nada y solo roban ancho. El
     obturador del retrato se va porque su animación quedaría congelada en el
     fotograma inicial, o sea tapando la foto con un rectángulo de hollín. El
     punto vivo tampoco existe en papel: nada late en una hoja impresa.

     [data-print-hide] marca lo que solo tiene sentido en pantalla: el botón de
     impresión, su nota y la banda de cierre. */
  header,
  footer,
  .tape,
  .needle,
  .portrait-shutter,
  .live,
  .cv-doc button,
  [data-print-hide] {
    display: none !important;
  }

  /* ── 2. La hoja se invierte: papel con tinta de hollín ───────────
     En pantalla el fondo es hollín y la tinta es papel. Imprimir eso sería una
     página negra a sangre — que además la mayoría de los navegadores descarta,
     dejando texto color papel sobre papel: invisible.

     La inversión se declara una vez, arriba, y después se fuerza en todo
     descendiente: las utilidades de tinta ("text-ink-muted", "text-ink-subtle")
     están calculadas contra hollín y sobre papel caerían por debajo de 3:1. */
  html,
  body,
  .cv-doc {
    background: var(--paper) !important;
    color: var(--soot) !important;
  }

  .cv-doc {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .cv-doc *,
  .cv-doc *::before,
  .cv-doc *::after {
    color: var(--soot) !important;
    border-color: var(--ink-plate) !important;
    background-color: transparent !important;
  }

  /* La tinta secundaria de la placa es la única que sí está medida contra
     papel (--ink-plate). Las etiquetas mono y los huecos la heredan. */
  .cv-doc .stamp,
  .cv-doc .gap {
    color: var(--ink-plate) !important;
  }

  /* ── 3. La placa ya ES la hoja ───────────────────────────────────
     En pantalla ".plate" es la sección invertida y lleva el cilindro del
     tambor más dos cantos de papel de 2 px. Con la hoja entera invertida esos
     tres adornos no separan nada: solo ensucian. */
  .cv-doc .plate {
    background-image: none !important;
  }
  .cv-doc .plate::before,
  .cv-doc .plate::after {
    display: none !important;
  }

  /* ── 4. Ni animación, ni transformación, ni opacidad ─────────────
     Esta es la regla que decide si el CV sale completo o medio vacío.
     ".reveal", ".reveal-stagger" y ".band-fill" animan con
     "animation-timeline: view()" y "both": fuera de su rango se quedan en el
     fotograma inicial, que para las dos primeras es "opacity: 0" y para la
     tercera "scaleX(0)". En papel no hay rango que recorrer. */
  .cv-doc,
  .cv-doc *,
  .cv-doc *::before,
  .cv-doc *::after {
    animation: none !important;
    transition: none !important;
    transform: none !important;
    opacity: 1 !important;
  }

  /* ── 5. Sin cinta, la rejilla del riel sobra ─────────────────────
     La página es una rejilla de dos columnas: "var(--tape-w)" para la cinta y
     el resto para el documento. Ocultar la cinta no cierra su columna — la
     deja vacía. La rejilla se aplana a bloque y el documento recupera el ancho
     completo de la hoja. */
  .cv-doc [data-print-flat] {
    display: block !important;
  }

  /* El retrato vive en una columna de 15 rem que en una hoja de 180 mm útiles
     se convertiría en una foto de tamaño postal. */
  .cv-doc figure {
    max-width: 38mm !important;
  }

  /* El duotono necesita su papel debajo: la foto va en "multiply", y sin un
     fondo con el que multiplicar se imprime como un gris plano. Es la única
     excepción al "background-color: transparent" de arriba junto con la barra
     de nivel. */
  .cv-doc .portrait {
    background-color: var(--paper) !important;
  }

  /* ── 6. Las barras de nivel se imprimen en tinta de placa ────────
     La ceniza está medida contra hollín; sobre papel es casi invisible. El
     largo de la barra es un dato (el nivel MCER), así que tiene que verse. */
  .cv-doc .band-fill {
    background: var(--ink-plate) !important;
    border-left-color: var(--paper) !important;
  }

  /* ── 7. Tipografía en puntos ─────────────────────────────────────
     Toda la escala del sitio es "clamp()" con "vw", y al imprimir "vw" es el
     ancho de la hoja: los títulos salían del tamaño equivocado. */
  .cv-doc {
    font-size: 10pt !important;
    line-height: 1.45 !important;
  }
  .cv-doc h1 {
    font-size: 21pt !important;
    line-height: 1.1 !important;
  }
  .cv-doc h2 {
    font-size: 13pt !important;
    line-height: 1.2 !important;
  }
  .cv-doc h3 {
    font-size: 11pt !important;
    line-height: 1.25 !important;
  }
  .cv-doc .text-lead {
    font-size: 10.5pt !important;
    line-height: 1.45 !important;
  }
  .cv-doc .stamp {
    font-size: 7.5pt !important;
  }

  /* ── 8. Compactar ────────────────────────────────────────────────
     En pantalla cada sección respira 5 rem arriba y abajo. En una hoja eso es
     media página vacía por sección. El aire pasa a ser un milímetro de
     separación y una regla, que es como se separan los bloques de un CV. */
  .cv-doc section {
    padding: 0 !important;
    margin: 0 !important;
    border: 0 !important;
    overflow: visible !important;
  }
  .cv-doc section + section {
    margin-top: 6mm !important;
    padding-top: 4mm !important;
    border-top: 1px solid var(--ink-plate) !important;
  }

  /* ── 9. Cortes de página ─────────────────────────────────────────
     Un puesto partido entre dos hojas es la razón por la que los CV impresos
     se ven mal, y un encabezado solo al pie de página es la segunda. */
  .cv-doc h1,
  .cv-doc h2,
  .cv-doc h3 {
    break-after: avoid;
    page-break-after: avoid;
  }
  .cv-doc [data-print-keep] {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  /* ── 10. En papel no se puede hacer clic ─────────────────────────
     Un enlace impreso sin su destino es una referencia perdida. Solo los
     absolutos: los internos se leen por su texto y su URL sería ruido. */
  .cv-doc a {
    color: var(--soot) !important;
    text-decoration: underline;
    text-decoration-color: var(--ink-plate) !important;
    text-underline-offset: 0.15em;
  }
  .cv-doc a[href^="http"]::after {
    content: " (" attr(href) ")";
    font-size: 0.82em;
    color: var(--ink-plate) !important;
    word-break: break-all;
  }
}
`

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const en = locale === 'en'

  return generatePageMetadata({
    locale: locale as Locale,
    route: 'cv',
    title: en
      ? 'CV — Engineer, PMP, technical SEO'
      : 'CV — Ingeniero, PMP, SEO técnico',
    /* 202 caracteres antes: Google recorta en ~160. */
    description: en
      ? 'Full CV of Carlos Anaya Ruiz: Tec de Monterrey engineer, PMP, TOEFL iBT 92 and four years at Amazon, Master Loyalty Group and Wan Hai Lines.'
      : 'CV completo de Carlos Anaya Ruiz: ingeniero por el Tec de Monterrey, PMP, TOEFL iBT 92 y cuatro años en Amazon, Master Loyalty Group y Wan Hai Lines.',
  })
}

export default async function CvPage({ params }: Props) {
  const { locale: rawLocale } = await params
  setRequestLocale(rawLocale)

  const locale = rawLocale as Locale
  const en = locale === 'en'

  const t = await getTranslations('cv')
  const tc = await getTranslations('common')
  const tt = await getTranslations('trust')

  const personal = getPersonalInfo(locale)
  const experiences = getExperiences(locale)
  const education = getEducation(locale)

  /* EL TRAMO de la trayectoria: los empleos y los estudios en el MISMO
     eje, que es lo que hace legible una carrera — un grado y un puesto
     no son categorías distintas cuando lo que se mide es el tiempo.
     Ninguna fecha está escrita a mano: salen de los dos archivos de
     datos, así que una entrada nueva aparece sola. */
  const spanEntries = [
    ...experiences.map((experience) => ({
      date: experience.startDate,
      what: experience.company,
    })),
    ...education.map((item) => ({
      date: item.startDate,
      what: item.institution,
    })),
  ]
  const skillCategories = getSkillCategories(locale)
  const awards = getAwards(locale)
  const companies = getCompanies(locale)

  const cvUrl = routeUrl('cv', locale)

  /**
   * `awards.ts` guarda tres cosas distintas en un archivo, y su campo `kind`
   * existe justo para no imprimirlas como si fueran lo mismo: un examen
   * aprobado no es un premio. Las certificaciones van a su sección y solo las
   * distinciones reales quedan en Premios.
   */
  const certifications = awards.filter(
    (award) => award.kind === 'certification'
  )
  const recognitions = awards.filter((award) => award.kind !== 'certification')

  /**
   * El PMP no tiene fecha en ningún registro del repo. Inventarla en un CV
   * sería peor que omitirla — un dato falso que además cualquiera puede
   * verificar contra el registro del PMI —, así que `date` es nullable y la
   * fila dice "vigente" en lugar de un mes que nadie confirmó.
   */
  const credentials = [
    {
      id: 'pmp',
      name: 'Project Management Professional (PMP)',
      issuer: 'Project Management Institute',
      date: null as string | null,
    },
    ...certifications.map((award) => ({
      id: award.id,
      name: award.title,
      issuer: award.organization,
      date: award.date as string | null,
    })),
  ]

  /**
   * Un puesto se enlaza a su página de proyecto solo si esa empresa existe de
   * verdad en data/companies.ts. El cruce es por nombre porque es el único
   * campo que los dos archivos comparten: `experience.ts` usa ids propios
   * ('amazon-sde') y `companies.ts` slugs de URL ('amazon'). Si algún día un
   * nombre deja de coincidir, el puesto se queda sin enlace en lugar de
   * apuntar a un 404.
   */
  const companySlugByName = new Map(companies.map((c) => [c.name, c.slug]))

  /**
   * Los empleadores que además tienen ficha propia. Antes esto pintaba una
   * rejilla de huecos de logo con la ruta del archivo escrita encima; hoy es
   * una línea de nombres, que es el dato que había debajo del hueco.
   */
  const employers = experiences.flatMap((exp) => {
    const slug = companySlugByName.get(exp.company)
    return slug ? [{ name: exp.company, slug }] : []
  })

  /**
   * Las dos credenciales que acompañan al retrato. Salen de las mismas claves
   * de `trust` que usa la home, así que el emisor y el matiz no se reescriben
   * aquí — y las dos son verificables en la carpeta pública que enlaza la
   * sección de certificaciones. Ni una cifra que no se pueda enseñar.
   */
  const heroCredentials = [
    {
      label: tt('metrics.certifiedLabel'),
      value: 'PMP',
      issuer: tt('metrics.pmpIssuer'),
    },
    {
      label: tt('metrics.toeflLabel'),
      value: '92',
      issuer: tt('metrics.toeflHint'),
    },
  ]

  /** Contacto. Todo sale de NAP y SOCIAL_LINKS, nunca de un literal. */
  const contactRows: {
    id: string
    label: string
    node: React.ReactNode
  }[] = [
    {
      id: 'email',
      label: t('contact.email'),
      node: (
        <a href={`mailto:${NAP.email}`} className="link-stylus">
          {NAP.email}
        </a>
      ),
    },
    {
      id: 'phone',
      label: t('contact.phone'),
      node: (
        <a href={`tel:${NAP.phone}`} className="link-stylus">
          {NAP.phoneDisplay}
        </a>
      ),
    },
    {
      id: 'location',
      label: t('contact.location'),
      node: personal.location,
    },
    {
      id: 'linkedin',
      label: t('contact.linkedin'),
      node: (
        <a
          href={SOCIAL_LINKS.linkedin}
          target="_blank"
          rel="me noopener noreferrer"
          className="link-stylus"
        >
          LinkedIn
        </a>
      ),
    },
    {
      id: 'github',
      label: t('contact.github'),
      node: (
        <a
          href={SOCIAL_LINKS.github}
          target="_blank"
          rel="me noopener noreferrer"
          className="link-stylus"
        >
          {SOCIAL_LINKS.github.replace(/^https:\/\//, '')}
        </a>
      ),
    },
  ]

  /**
   * WebPage + BreadcrumbList, no un segundo ProfilePage.
   *
   * `generateProfilePageGraph` está atado a la ruta /sobre-mi, y esa página ya
   * es la ProfilePage canónica de la entidad. Declarar aquí una segunda con el
   * mismo `mainEntity` pondría dos URLs compitiendo por ser el perfil de la
   * misma persona. `buildPageNode` ya enlaza `about` → #person, y los hechos
   * de la entidad (título, PMP, TOEFL, empleadores) viven en el Person del
   * layout, que se emite en todas las rutas: aquí no se repiten.
   */
  const cvGraph: SchemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      generateWebPageSchema({
        locale,
        route: 'cv',
        name: 'CV — Carlos Anaya Ruiz',
        description: en
          ? 'Complete professional record of Carlos Anaya Ruiz: education, roles, certifications, recognitions, stack and languages, on a single printable page.'
          : 'Trayectoria profesional completa de Carlos Anaya Ruiz: formación, puestos, certificaciones, reconocimientos, stack e idiomas, en una sola página imprimible.',
        hasBreadcrumb: true,
        showsPrimaryImage: true,
      }),
      generateBreadcrumbSchema(
        [
          { name: en ? 'Home' : 'Inicio', route: 'home' },
          { name: t('title'), route: 'cv' },
        ],
        locale,
        cvUrl
      ),
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cvGraph) }}
      />
      {/* Mismo patrón que el JSON-LD de arriba: la cadena entra tal cual, sin
          que React la trate como hijo de texto.

          El <style> se queda aquí, en el cuerpo, y NO se sube al <head> con
          `precedence`. Es deliberado: el hoisting de React 19 mete una capa
          entre esta hoja y el documento, y si algo de esa capa falla lo que se
          pierde es justo la hoja de impresión — o sea, la única razón por la
          que el botón de descarga sirve. Un <style> en el cuerpo lo aplican
          todos los navegadores desde siempre. */}
      <style dangerouslySetInnerHTML={{ __html: PRINT_STYLES }} />

      <div className="cv-doc">
        <div
          data-print-flat=""
          className="grid"
          style={{ gridTemplateColumns: 'var(--tape-w) minmax(0,1fr)' }}
        >
          <Rail />

          <div className="min-w-0">
            {/* ═══ ENCABEZADO DEL DOCUMENTO ══════════════════════════
                Un CV empieza por quién lo firma. El nombre es el h1 —no el
                cargo, no una frase de venta— y todo lo demás son filas de
                registro colgando de él. */}
            <section className="hero-in relative px-5 pt-16 sm:px-10">
              <p className="stamp">{t('eyebrow')}</p>

              <h1 className="mt-6 max-w-[14ch] text-hero text-ink">
                {personal.name}
              </h1>

              <p className="mt-6 max-w-[34ch] text-d2 text-ink-muted">
                {personal.title}
              </p>

              <div className="mt-14 grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,15rem)] md:gap-14">
                <div className="min-w-0">
                  <p className="max-w-[54ch] font-human text-lead text-ink-muted">
                    {t('lead')}
                  </p>

                  <p className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                    <PrintButton label={t('download')} />
                    <Link className="link-stylus" href="/contacto">
                      {t('ctaLink')} →
                    </Link>
                  </p>

                  <p
                    data-print-hide=""
                    className="mt-5 max-w-[54ch] text-sm text-ink-subtle"
                  >
                    {t('downloadHint')}
                  </p>

                  {/* El contacto es una tabla de dos columnas, que es lo que
                      es: etiqueta y valor. Nada de iconos dentro de círculos.
                      En móvil las dos columnas se apilan; la etiqueta mono
                      sigue arriba de su dato. */}
                  <dl className="mt-12 border-b border-hairline">
                    {contactRows.map((row) => (
                      <div
                        key={row.id}
                        data-print-keep=""
                        className="band grid gap-x-6 gap-y-1 py-3 sm:grid-cols-[10rem_minmax(0,1fr)]"
                      >
                        <dt className="stamp">{row.label}</dt>
                        <dd className="min-w-0 break-words text-ink-muted">
                          {row.node}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="min-w-0">
                  {/* El retrato es la única foto del documento. El obturador
                      la «imprime» al entrar a pantalla y se va al imprimir en
                      papel, donde quedaría congelado tapándola. */}
                  <figure className="m-0">
                    <span className="figure-bw">
                      <span className="portrait-shutter" aria-hidden="true" />
                      <Image
                        src={SEO_IMAGES.portraitBw}
                        alt={SEO_IMAGES.avatarAlt[locale]}
                        width={SEO_IMAGES.portraitBwSize}
                        height={SEO_IMAGES.portraitBwSize}
                        sizes="(min-width: 768px) 15rem, 60vw"
                        priority
                      />
                    </span>
                    <figcaption className="stamp mt-4">
                      {personal.location}
                    </figcaption>
                  </figure>

                  {/* Dos hechos verificables junto al retrato, en mono porque
                      son datos. Se van al imprimir: la hoja ya los trae, con
                      su emisor y su fecha, en la sección de certificaciones. */}
                  <dl
                    data-print-hide=""
                    className="mt-10 border-b border-hairline"
                  >
                    {heroCredentials.map((credential) => (
                      <div key={credential.label} className="band py-3">
                        <dt className="stamp">{credential.label}</dt>
                        <dd className="mt-1 font-mono text-d3 tabular-nums text-ink">
                          {credential.value}
                        </dd>
                        <dd className="mt-1 text-sm text-ink-subtle">
                          {credential.issuer}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  {/* EL TRAMO. Se va al imprimir: la hoja de papel ya trae
                      la trayectoria entera con sus fechas más abajo, así que
                      en papel esto sería el mismo dato dos veces. */}
                  <div
                    data-print-hide=""
                    className="mt-10 border-t border-hairline pt-5"
                  >
                    <Span
                      entries={spanEntries}
                      label={en ? 'the span' : 'el tramo'}
                      spanLabel={
                        en ? 'jobs and degrees, one axis' : 'empleos y estudios'
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Solo en papel: una hoja impresa se separa de su origen en
                  cuanto se reenvía, así que lleva escrito de dónde salió. */}
              <p className="mt-10 hidden text-sm print:block">
                {t('printedFrom')} {cvUrl}
              </p>
            </section>

            {/* ═══ RESUMEN ═══════════════════════════════════════════
                La única placa de la página: la sección que la aguja limpió.
                Es el párrafo que decide si alguien sigue leyendo, así que es
                el único bloque que se invierte entero. */}
            <section
              id="resumen"
              className="plate relative mt-16 px-5 py-20 sm:px-10"
            >
              <p className="stamp">{tt('engineerLabel')}</p>
              <h2 className="mt-5 max-w-[18ch] text-d1">{t('summary')}</h2>

              <div className="mt-10 max-w-[60ch] space-y-5 text-lead">
                {personal.summary.split('\n\n').map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
              </div>
            </section>

            {/* ═══ EXPERIENCIA ═══════════════════════════════════════ */}
            <section
              id="experiencia"
              className="border-t border-hairline px-5 py-20 sm:px-10"
            >
              <p className="stamp">
                {tt('companiesLabel')} ·{' '}
                {employers.map((employer) => employer.name).join(' · ')}
              </p>
              <h2 className="mt-5 max-w-[16ch] text-d1 text-ink">
                {t('experience')}
              </h2>
              <p className="mt-5 max-w-[58ch] text-ink-muted">
                {t('experienceNote')}
              </p>

              <ol className="reveal-stagger mt-14">
                {experiences.map((exp) => {
                  const slug = companySlugByName.get(exp.company)

                  return (
                    <li key={exp.id} data-print-keep="" className="band py-8">
                      <p className="stamp flex flex-wrap items-baseline gap-x-5 gap-y-2 tabular-nums">
                        <span>
                          <time dateTime={exp.startDate}>
                            {formatShortDate(exp.startDate, locale)}
                          </time>
                          {' – '}
                          {exp.endDate ? (
                            <time dateTime={exp.endDate}>
                              {formatShortDate(exp.endDate, locale)}
                            </time>
                          ) : (
                            <span>{tc('present')}</span>
                          )}
                        </span>
                        <span>{exp.location}</span>
                        {exp.current ? (
                          <span className="inline-flex items-center gap-2.5">
                            <span className="live" aria-hidden="true" />
                            {t('currentRole')}
                          </span>
                        ) : null}
                      </p>

                      <h3 className="mt-4 text-d3 text-ink">{exp.position}</h3>
                      <p className="mt-1.5 text-ink-muted">{exp.company}</p>
                      <p className="mt-5 max-w-[62ch] text-ink-muted">
                        {exp.description}
                      </p>

                      {exp.highlights.length > 0 ? (
                        <ul className="mt-6 space-y-3">
                          {exp.highlights.map((highlight) => (
                            <li
                              key={highlight}
                              className="flex max-w-[62ch] gap-4 text-sm text-ink-muted"
                            >
                              {/* Una raya de un píxel en lugar de una palomita
                                  dentro de un círculo: el trazo de la aguja
                                  ya es la viñeta de este sistema. */}
                              <span
                                aria-hidden="true"
                                className="mt-2.5 h-px w-4 shrink-0 bg-hairline-strong"
                              />
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}

                      {exp.technologies && exp.technologies.length > 0 ? (
                        <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-xs text-ink-subtle">
                          {exp.technologies.map((tech) => (
                            <li key={tech}>{tech}</li>
                          ))}
                        </ul>
                      ) : null}

                      {/* La ruta es dinámica, así que el href va como objeto
                          con `params`: pasarla como string no compila, que es
                          exactamente lo que se quiere. */}
                      {slug ? (
                        <p className="mt-6">
                          <Link
                            className="link-stylus text-sm"
                            href={{
                              pathname: '/proyectos/[slug]',
                              params: { slug },
                            }}
                          >
                            {t('projectLink')} →
                          </Link>
                        </p>
                      ) : null}
                    </li>
                  )
                })}
              </ol>
            </section>

            {/* ═══ FORMACIÓN ═════════════════════════════════════════ */}
            <section
              id="formacion"
              className="border-t border-hairline px-5 py-20 sm:px-10"
            >
              <h2 className="max-w-[16ch] text-d1 text-ink">
                {t('education')}
              </h2>

              <ul className="reveal-stagger mt-12">
                {education.map((item) => (
                  <li key={item.id} data-print-keep="" className="band py-6">
                    <p className="stamp tabular-nums">
                      <time dateTime={item.startDate}>{item.startDate}</time>
                      {' – '}
                      <time dateTime={item.endDate}>{item.endDate}</time>
                    </p>
                    {/* `degree` es la etiqueta localizada de la credencial, así
                        la especialización nunca se lee como un segundo
                        título. */}
                    <h3 className="mt-3 max-w-[40ch] text-d3 text-ink">
                      {item.degree} {en ? 'in' : 'en'} {item.field}
                    </h3>
                    <p className="mt-1.5 text-ink-muted">
                      {item.institution} · {item.location}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            {/* ═══ CERTIFICACIONES ═══════════════════════════════════ */}
            <section
              id="certificaciones"
              className="border-t border-hairline px-5 py-20 sm:px-10"
            >
              <h2 className="max-w-[16ch] text-d1 text-ink">
                {t('certifications')}
              </h2>
              <p className="mt-5 max-w-[58ch] text-ink-muted">
                {t('certificationsNote')}
              </p>

              <ul className="reveal-stagger mt-12">
                {credentials.map((credential) => (
                  <li
                    key={credential.id}
                    data-print-keep=""
                    className="band py-6"
                  >
                    <p className="stamp tabular-nums">
                      {credential.date ? (
                        <time dateTime={credential.date}>
                          {formatShortDate(credential.date, locale)}
                        </time>
                      ) : (
                        <span>{t('active')}</span>
                      )}
                    </p>
                    <h3 className="mt-3 max-w-[44ch] text-d3 text-ink">
                      {credential.name}
                    </h3>
                    <p className="mt-1.5 text-ink-muted">{credential.issuer}</p>
                  </li>
                ))}
              </ul>

              <p
                data-print-hide=""
                className="mt-10 flex flex-wrap gap-x-8 gap-y-3"
              >
                <Link className="link-stylus" href="/certificaciones">
                  {t('viewCertifications')} →
                </Link>
                {/* Una carpeta que cualquiera puede abrir vale más que una
                    insignia dibujada: la afirmación queda verificable. */}
                <a
                  className="link-stylus"
                  href={SOCIAL_LINKS.certsDrive}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('viewFolder')} →
                </a>
              </p>
            </section>

            {/* ═══ PREMIOS ═══════════════════════════════════════════ */}
            <section
              id="premios"
              className="border-t border-hairline px-5 py-20 sm:px-10"
            >
              <h2 className="max-w-[16ch] text-d1 text-ink">{t('awards')}</h2>
              <p className="mt-5 max-w-[58ch] text-ink-muted">
                {t('awardsNote')}
              </p>

              <ul className="reveal-stagger mt-12">
                {recognitions.map((award) => (
                  <li key={award.id} data-print-keep="" className="band py-6">
                    <p className="stamp flex flex-wrap items-baseline gap-x-5 gap-y-2 tabular-nums">
                      <time dateTime={award.date}>
                        {formatShortDate(award.date, locale)}
                      </time>
                      {/* Etiquetado por lo que realmente es: un lugar en un
                          hackathon y una distinción con nombre son
                          afirmaciones distintas. */}
                      <span>
                        {award.kind === 'competition'
                          ? t('kindCompetition')
                          : t('kindRecognition')}
                      </span>
                    </p>

                    <h3 className="mt-3 max-w-[44ch] text-d3 text-ink">
                      {award.title}
                    </h3>
                    <p className="mt-1.5 text-ink-muted">
                      {award.organization}
                    </p>
                    <p className="mt-4 max-w-[62ch] text-sm text-ink-muted">
                      {award.description}
                    </p>
                    {award.impact ? (
                      <p className="mt-3 max-w-[62ch] text-sm text-ink-muted">
                        {award.impact}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>

              <p data-print-hide="" className="mt-10">
                <Link className="link-stylus" href="/premios">
                  {t('viewAwards')} →
                </Link>
              </p>
            </section>

            {/* ═══ STACK ═════════════════════════════════════════════
                Siete categorías, cada una una fila con sus herramientas en
                mono. El listado completo de badges vive en /sobre-mi; aquí es
                un documento y se lee como un documento. */}
            <section
              id="stack"
              className="border-t border-hairline px-5 py-20 sm:px-10"
            >
              <h2 className="max-w-[16ch] text-d1 text-ink">{t('stack')}</h2>
              <p className="mt-5 max-w-[58ch] text-ink-muted">
                {t('stackNote')}
              </p>

              <ul className="reveal-stagger mt-12">
                {skillCategories.map((category) => (
                  <li
                    key={category.category}
                    data-print-keep=""
                    className="band grid gap-x-8 gap-y-3 py-6 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]"
                  >
                    <h3 className="text-d3 text-ink">{category.label}</h3>
                    <ul className="flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-xs text-ink-subtle">
                      {category.skills.map((skill) => (
                        <li key={skill}>{skill}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </section>

            {/* ═══ IDIOMAS ═══════════════════════════════════════════
                La barra es el único adorno de la sección y no es adorno: su
                largo sale del mismo nivel MCER que está impreso al lado, así
                que no puede contradecirlo. */}
            <section
              id="idiomas"
              className="border-t border-hairline px-5 py-20 sm:px-10"
            >
              <h2 className="max-w-[16ch] text-d1 text-ink">
                {t('languages')}
              </h2>

              <dl className="reveal-stagger mt-12">
                {personal.languages.map((language) => (
                  <div
                    key={language.name}
                    data-print-keep=""
                    className="band py-6"
                  >
                    <dt className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <span className="text-d3 text-ink">{language.name}</span>
                      <span className="stamp tabular-nums">
                        {language.cefr}
                      </span>
                    </dt>
                    <dd>
                      {/* El carril tiene un ancho máximo común a los tres
                          idiomas: la comparación entre barras se conserva
                          intacta y ninguna cruza la hoja entera. */}
                      <span className="mt-4 block max-w-[38rem]">
                        <span
                          className="block"
                          style={{ width: `${language.proficiency}%` }}
                        >
                          <span className="band-fill" />
                        </span>
                      </span>
                      <p className="mt-3 text-sm text-ink-muted">
                        {language.level}
                      </p>
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* ═══ CIERRE ════════════════════════════════════════════
                Solo en pantalla: una llamada a la acción no pertenece a un CV
                impreso. */}
            <section
              data-print-hide=""
              className="border-t border-hairline px-5 py-24 sm:px-10"
            >
              <h2 className="max-w-[18ch] text-d1 text-ink">{t('ctaTitle')}</h2>
              <p className="mt-6 max-w-[52ch] font-human text-lead text-ink-muted">
                {t('ctaDesc')}
              </p>
              <p className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
                <Link className="link-stylus text-d3" href="/contacto">
                  {t('ctaLink')} →
                </Link>
                <a className="link-stylus" href={`mailto:${NAP.email}`}>
                  {NAP.email}
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
