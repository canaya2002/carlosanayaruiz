import type { Metadata } from 'next'
import Image from 'next/image'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Check,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Trophy,
  type LucideIcon,
} from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PointerGlow } from '@/components/motion/pointer-glow'
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
 * El botón de descarga llama a `window.print()`. Sin estas reglas lo que
 * saldría del diálogo es la PÁGINA WEB con los colores apagados: la barra de
 * cristal pegada arriba, el pie con sus cuatro columnas de enlaces, tres capas
 * de gradiente que el papel no puede reproducir y el nombre del CV
 * literalmente en blanco (`.grad-text` deja el texto transparente y se apoya
 * en un fondo que no se imprime).
 *
 * Lo que sale con estas reglas es un CV: tinta sobre papel, sin cromo, sin
 * sombras, con las URLs de los enlaces escritas y sin ningún puesto partido a
 * la mitad entre dos hojas.
 *
 * Va en un <style> de esta página y no en globals.css a propósito: son reglas
 * de UN documento. En la hoja global vivirían en todas las rutas, donde no
 * aplican.
 *
 * Sobre los colores: no hay ni un literal. --surface es el papel y --ink la
 * tinta (medida 15.7:1), los dos leídos de globals.css como cualquier otro
 * consumidor del sistema.
 * ════════════════════════════════════════════════════════════════
 */
const PRINT_STYLES = `
@page {
  margin: 14mm 15mm 16mm;
}

@media print {
  /* ── 1. Fuera el cromo del sitio y toda capa decorativa ──────────
     Nada de esto es el CV: el header es una barra de cristal pegada, el pie
     son cuatro columnas de navegación y .mesh / .grid-fade / .pointer-glow son
     gradientes de fondo. [data-print-hide] marca lo que solo tiene sentido en
     pantalla: migas, botones y la banda de cierre. */
  header,
  footer,
  .mesh,
  .grid-fade,
  .pointer-glow,
  [data-print-hide] {
    display: none !important;
  }

  html,
  body,
  .cv-doc {
    background: var(--surface) !important;
    color: var(--ink) !important;
  }

  /* ── 2. Red de seguridad para .defer-paint ───────────────────────
     .defer-paint ya NO usa content-visibility: costaba un recálculo de estilo
     por frame para siempre (ver la nota en globals.css), así que hoy solo hace
     "contain: layout" y no deja nada sin pintar. Esta regla se queda como
     salvaguarda: si alguien vuelve a poner content-visibility, al imprimir
     saldrían secciones enteras en blanco, porque para el navegador nunca
     entraron al viewport. */
  .cv-doc .defer-paint {
    contain: none !important;
    content-visibility: visible !important;
    contain-intrinsic-size: auto !important;
  }

  /* ── 3. Ni sombras, ni cristal, ni desenfoque, ni animación ──────
     "backdrop-filter" no tiene nada detrás que desenfocar en una hoja y las
     sombras teñidas de azul se imprimen como manchas grises.

     "animation: none" no es cosmético: las secciones usan .reveal, que anima
     desde "opacity: 0" con "animation-timeline: view()" y "both". Fuera de su
     rango la entrada se queda en el fotograma inicial — o sea invisible. Al
     imprimir no hay scroll que recorra ningún rango, así que sin esta línea
     media página sale vacía. */
  .cv-doc,
  .cv-doc *,
  .cv-doc *::before,
  .cv-doc *::after {
    animation: none !important;
    transition: none !important;
    transform: none !important;
    opacity: 1 !important;
    filter: none !important;
    box-shadow: none !important;
    text-shadow: none !important;
    -webkit-backdrop-filter: none !important;
    backdrop-filter: none !important;
  }

  /* ── 4. Superficies sólidas: sin tarjetas, sin cristal ───────────
     En pantalla las tarjetas agrupan. En papel, veinte cajas con borde son
     ruido: el contenido fluye y la jerarquía la marcan los encabezados. */
  .cv-doc section,
  .cv-doc .card,
  .cv-doc .glass {
    background-color: transparent !important;
    background-image: none !important;
    border: 0 !important;
    border-radius: 0 !important;
  }
  .cv-doc .card,
  .cv-doc .glass {
    padding: 0 0 2mm !important;
  }

  /* ── 5. El texto con gradiente recortado se imprime INVISIBLE ────
     .grad-text deja "-webkit-text-fill-color: transparent" y se apoya en un
     background-image que el papel no reproduce. Sin esta regla el cargo del
     encabezado del CV sale en blanco sobre blanco. */
  .cv-doc .grad-text {
    background-image: none !important;
    color: var(--ink) !important;
    -webkit-text-fill-color: var(--ink) !important;
  }

  /* ── 6. Y los rellenos de gradiente llevan texto blanco ──────────
     Mismo problema al revés: sin su fondo, blanco sobre blanco. */
  .cv-doc .grad-fill,
  .cv-doc .grad-deco,
  .cv-doc .grad-drift {
    background-image: none !important;
    background-color: transparent !important;
    color: var(--ink) !important;
  }
  .cv-doc .grad-drift::before {
    display: none !important;
  }

  /* Las píldoras pierden su fondo, así que su texto de marca pasa a tinta y
     la etiqueta se dibuja con un borde, que sí se imprime. */
  .cv-doc .eyebrow {
    background: transparent !important;
    color: var(--ink-subtle) !important;
    padding-left: 0 !important;
  }
  .cv-doc .eyebrow::before {
    display: none !important;
  }
  .cv-doc [data-slot="badge"] {
    background: transparent !important;
    color: var(--ink) !important;
    border: 1px solid var(--control) !important;
  }

  /* ── 7. Tipografía en puntos ─────────────────────────────────────
     Las escalas de pantalla son clamp() con vw, y al imprimir "vw" es el
     ancho de la hoja: los títulos salían del tamaño equivocado. */
  .cv-doc {
    font-size: 10pt !important;
    line-height: 1.45 !important;
  }
  .cv-doc h1 {
    font-size: 21pt !important;
    line-height: 1.12 !important;
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

  /* ── 8. Compactar ────────────────────────────────────────────────
     En pantalla hay 5 rem de aire arriba y abajo de cada sección. En una hoja
     eso es media página vacía por sección. */
  .cv-doc section {
    padding: 0 !important;
    margin: 0 !important;
  }
  .cv-doc [data-print-tight] {
    max-width: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  .cv-doc section + section {
    margin-top: 6mm !important;
    padding-top: 4mm !important;
    border-top: 1px solid var(--ink-subtle) !important;
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

  /* ── 10. La línea de tiempo se aplana ────────────────────────────
     Su riel y su punto son gradiente decorativo: sin fondo no existen, así que
     la rejilla de dos columnas se vuelve una sola. */
  .cv-doc [data-print-flat] {
    display: block !important;
  }

  /* ── 11. En papel no se puede hacer clic ─────────────────────────
     Un enlace impreso sin su destino es una referencia perdida. Solo los
     absolutos: los internos ya se leen por su texto y su URL sería ruido. */
  .cv-doc a {
    color: var(--ink) !important;
    text-decoration: underline;
    text-underline-offset: 0.15em;
  }
  .cv-doc a[href^="http"]::after {
    content: " (" attr(href) ")";
    font-size: 0.82em;
    font-weight: 400;
    color: var(--ink-subtle);
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
    description: en
      ? 'Full CV of Carlos Anaya Ruiz: Tec de Monterrey engineer, PMP certified, TOEFL iBT 92, and four years across Amazon, Master Loyalty Group and Wan Hai Lines. Printable to PDF from the page itself.'
      : 'CV completo de Carlos Anaya Ruiz: ingeniero por el Tec de Monterrey, certificado PMP, TOEFL iBT 92 y cuatro años en Amazon, Master Loyalty Group y Wan Hai Lines. Imprimible a PDF desde la propia página.',
  })
}

export default async function CvPage({ params }: Props) {
  const { locale: rawLocale } = await params
  setRequestLocale(rawLocale)

  const locale = rawLocale as Locale
  const en = locale === 'en'

  const t = await getTranslations('cv')
  const tc = await getTranslations('common')

  const personal = getPersonalInfo(locale)
  const experiences = getExperiences(locale)
  const education = getEducation(locale)
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
  const certifications = awards.filter((award) => award.kind === 'certification')
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

  /** Contacto. Todo sale de NAP y SOCIAL_LINKS, nunca de un literal. */
  const contactRows: {
    id: string
    label: string
    icon: LucideIcon
    node: React.ReactNode
  }[] = [
    {
      id: 'email',
      label: t('contact.email'),
      icon: Mail,
      node: (
        <a href={`mailto:${NAP.email}`} className="hover:text-brand-strong">
          {NAP.email}
        </a>
      ),
    },
    {
      id: 'phone',
      label: t('contact.phone'),
      icon: Phone,
      node: (
        <a href={`tel:${NAP.phone}`} className="hover:text-brand-strong">
          {NAP.phoneDisplay}
        </a>
      ),
    },
    {
      id: 'location',
      label: t('contact.location'),
      icon: MapPin,
      node: personal.location,
    },
    {
      id: 'linkedin',
      label: t('contact.linkedin'),
      icon: Linkedin,
      node: (
        <a
          href={SOCIAL_LINKS.linkedin}
          target="_blank"
          rel="me noopener noreferrer"
          className="hover:text-brand-strong"
        >
          LinkedIn
        </a>
      ),
    },
    {
      id: 'github',
      label: t('contact.github'),
      icon: Github,
      node: (
        <a
          href={SOCIAL_LINKS.github}
          target="_blank"
          rel="me noopener noreferrer"
          className="hover:text-brand-strong"
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
        {/* ══ CABECERA ══════════════════════════════════════════════
            Tres capas de fondo, todas decorativas, todas en -z-10 y ninguna
            captura eventos: la malla animada, el resplandor que sigue al
            puntero y la cuadrícula que se desvanece. Las tres desaparecen al
            imprimir.                                                     */}
        <section className="relative isolate overflow-hidden">
          <div className="mesh" aria-hidden="true" />
          <PointerGlow />
          <div className="grid-fade" aria-hidden="true" />

          <div
            data-print-tight=""
            className="mx-auto w-full max-w-6xl px-5 pb-16 pt-10 sm:px-8 sm:pb-20 sm:pt-14"
          >
            <div data-print-hide="">
              <Breadcrumbs items={[{ label: t('title') }]} />
            </div>

            <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-16">
              <div className="max-w-2xl">
                <p className="eyebrow enter-scale">{t('eyebrow')}</p>

                {/* El nombre y el cargo son un solo encabezado: es el título
                    del documento, igual que en un CV en papel. El gradiente
                    cae sobre el cargo y no sobre el nombre completo — un h1
                    entero recortado pierde legibilidad. */}
                <h1 className="enter-blur step-1 mt-6 text-d1 text-ink">
                  {personal.name}
                  <span className="grad-text mt-3 block text-d3 font-semibold">
                    {personal.title}
                  </span>
                </h1>

                <p className="enter step-2 mt-6 max-w-[68ch] text-ink-muted">
                  {t('lead')}
                </p>

                {/* El correo abre el cliente de correo y el teléfono marca; en
                    papel los dos quedan como texto legible, que es para lo que
                    sirven ahí. */}
                <dl
                  data-print-keep=""
                  className="enter step-3 mt-9 grid gap-x-8 gap-y-3 sm:grid-cols-2"
                >
                  {contactRows.map((row) => {
                    const Icon = row.icon
                    return (
                      <div
                        key={row.id}
                        className="flex items-center gap-2.5 text-sm"
                      >
                        <Icon
                          className="size-4 shrink-0 text-sky-ink"
                          aria-hidden="true"
                        />
                        {/* La etiqueta es para lectores de pantalla: un correo
                            y un teléfono se explican solos a la vista, pero en
                            una lista leída en voz alta no. */}
                        <dt className="sr-only">{row.label}</dt>
                        <dd className="text-ink-muted">{row.node}</dd>
                      </div>
                    )
                  })}
                </dl>

                <div
                  data-print-hide=""
                  className="enter step-4 mt-9 flex flex-wrap items-center gap-4"
                >
                  <PrintButton label={t('download')} />
                  <Button asChild variant="outline" size="lg">
                    <Link href="/contacto">{t('ctaLink')}</Link>
                  </Button>
                </div>

                <p
                  data-print-hide=""
                  className="enter step-5 mt-4 max-w-[52ch] text-sm text-ink-subtle"
                >
                  {t('downloadHint')}
                </p>

                {/* Solo en papel: una hoja impresa se separa de su origen en
                    cuanto se reenvía, así que lleva escrito de dónde salió. */}
                <p className="hidden text-sm text-ink-muted print:block">
                  {t('printedFrom')} {cvUrl}
                </p>
              </div>

              {/* Retrato con anillo de gradiente. El anillo va detrás como capa
                  absoluta, así que al animarse no desplaza nada (cero CLS).
                  Está sobre el pliegue en todos los breakpoints, así que nunca
                  se carga en diferido. */}
              <div className="enter-scale step-2 order-first lg:order-none">
                <div className="relative mx-auto w-fit">
                  {/* Dos capas a propósito: `.grad-drift` fija
                      `position: relative` y ganaría a la utilidad `absolute`
                      (está fuera de @layer), así que el posicionamiento vive
                      en el envoltorio y el gradiente que se desplaza vive
                      dentro. */}
                  <div
                    className="absolute -inset-2 opacity-90"
                    aria-hidden="true"
                  >
                    <div className="grad-drift size-full rounded-[2rem]" />
                  </div>
                  <div className="relative size-32 overflow-hidden rounded-3xl border-2 border-surface bg-ground-tint shadow-lift-3 sm:size-40 lg:size-48">
                    <Image
                      src={SEO_IMAGES.avatar}
                      alt={SEO_IMAGES.avatarAlt[locale]}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 192px, (min-width: 640px) 160px, 128px"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ RESUMEN PROFESIONAL ═══════════════════════════════════ */}
        <section
          id="resumen"
          className="border-y border-hairline bg-ground-tint"
        >
          <div
            data-print-tight=""
            className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20"
          >
            <h2 className="reveal text-d2 text-ink">{t('summary')}</h2>

            {/* Es el contenido protagonista de la página, así que es el único
                panel de cristal que lleva: `backdrop-filter` es el efecto más
                caro del sistema y todo lo de abajo va en `.card`, que es
                opaca. El texto largo toma su medida y su ritmo de
                `.prose-rich`, no de utilidades párrafo por párrafo. */}
            <div
              data-print-keep=""
              className="glass glass-spec reveal mt-7 p-6 sm:p-8"
            >
              <div className="prose-rich">
                {personal.summary.split('\n\n').map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ EXPERIENCIA ═══════════════════════════════════════════ */}
        <section
          id="experiencia"
          className="defer-paint mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20"
        >
          <div data-print-tight="">
            <div className="reveal max-w-2xl">
              <h2 className="text-d2 text-ink">{t('experience')}</h2>
              <p className="mt-3 text-ink-muted">{t('experienceNote')}</p>
            </div>

            {/* Línea de tiempo: una tarjeta por puesto y un riel de gradiente a
                la izquierda. El punto y el conector son decorativos y viven en
                capa absoluta, así que no empujan la tarjeta ni un píxel. Cada
                fecha es un <time> real, o sea legible por máquina. */}
            <ol className="reveal-stagger mt-10 space-y-6">
              {experiences.map((exp, index) => {
                const slug = companySlugByName.get(exp.company)

                return (
                  <li
                    key={exp.id}
                    data-print-flat=""
                    className="relative grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-4 sm:grid-cols-[2rem_minmax(0,1fr)] sm:gap-x-6"
                  >
                    <div
                      className="relative"
                      aria-hidden="true"
                      data-print-hide=""
                    >
                      <span className="grad-deco absolute left-1/2 top-7 size-3.5 -translate-x-1/2 rounded-full shadow-glow-brand" />
                      {/* El conector solo baja si hay una entrada siguiente. */}
                      {index < experiences.length - 1 ? (
                        <span className="grad-deco absolute -bottom-[3.25rem] left-1/2 top-12 w-0.5 -translate-x-1/2 rounded-full opacity-40" />
                      ) : null}
                    </div>

                    <article
                      data-print-keep=""
                      className="card card-hover p-6 sm:p-7"
                    >
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <p
                          data-numeric=""
                          className="text-sm font-semibold text-brand-strong"
                        >
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
                        </p>
                        <span className="text-sm text-ink-subtle">
                          {exp.location}
                        </span>
                        {exp.current ? (
                          <Badge variant="gradient">{t('currentRole')}</Badge>
                        ) : null}
                      </div>

                      <h3 className="mt-3 text-d3 text-ink">{exp.position}</h3>
                      <p className="mt-1.5 font-semibold text-ink-muted">
                        {exp.company}
                      </p>
                      <p className="mt-4 text-ink-muted">{exp.description}</p>

                      {exp.highlights.length > 0 ? (
                        <ul className="mt-5 space-y-2.5">
                          {exp.highlights.map((highlight) => (
                            <li
                              key={highlight}
                              className="flex gap-2.5 text-sm leading-relaxed text-ink-muted"
                            >
                              <Check
                                className="mt-0.5 size-4 shrink-0 text-sky-ink"
                                aria-hidden="true"
                              />
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}

                      {exp.technologies && exp.technologies.length > 0 ? (
                        <ul className="mt-6 flex flex-wrap gap-1.5">
                          {exp.technologies.map((tech) => (
                            <li key={tech}>
                              <Badge variant="neutral">{tech}</Badge>
                            </li>
                          ))}
                        </ul>
                      ) : null}

                      {/* La ruta es dinámica, así que el href va como objeto
                          con `params`: pasarla como string no compila, que es
                          exactamente lo que se quiere. */}
                      {slug ? (
                        <Link
                          href={{
                            pathname: '/proyectos/[slug]',
                            params: { slug },
                          }}
                          className="group mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-strong"
                        >
                          {t('projectLink')}
                          <ArrowUpRight
                            className="size-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                            aria-hidden="true"
                          />
                        </Link>
                      ) : null}
                    </article>
                  </li>
                )
              })}
            </ol>
          </div>
        </section>

        {/* ══ FORMACIÓN ═════════════════════════════════════════════ */}
        <section
          id="formacion"
          className="defer-paint border-y border-hairline bg-ground-tint"
        >
          <div
            data-print-tight=""
            className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20"
          >
            <h2 className="reveal text-d2 text-ink">{t('education')}</h2>

            <ul className="reveal-stagger mt-10 grid gap-6 md:grid-cols-2">
              {education.map((item) => (
                <li
                  key={item.id}
                  data-print-keep=""
                  className="card card-hover p-6"
                >
                  <p
                    data-numeric=""
                    className="text-sm font-semibold text-brand-strong"
                  >
                    <time dateTime={item.startDate}>{item.startDate}</time>
                    {' – '}
                    <time dateTime={item.endDate}>{item.endDate}</time>
                  </p>
                  {/* `degree` es la etiqueta localizada de la credencial, así
                      la especialización nunca se lee como un segundo título. */}
                  <h3 className="mt-3 text-d3 text-ink">
                    {item.degree} {en ? 'in' : 'en'} {item.field}
                  </h3>
                  <p className="mt-2 text-sm text-ink-muted">
                    {item.institution} · {item.location}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ══ CERTIFICACIONES ═══════════════════════════════════════ */}
        <section
          id="certificaciones"
          className="defer-paint mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20"
        >
          <div data-print-tight="">
            <div className="reveal max-w-2xl">
              <h2 className="text-d2 text-ink">{t('certifications')}</h2>
              <p className="mt-3 text-ink-muted">{t('certificationsNote')}</p>
            </div>

            <ul className="reveal-stagger mt-10 grid gap-5 md:grid-cols-2">
              {credentials.map((credential) => (
                <li
                  key={credential.id}
                  data-print-keep=""
                  className="card card-hover p-6"
                >
                  <span
                    data-print-hide=""
                    className="grad-deco inline-flex size-10 items-center justify-center rounded-xl text-white shadow-glow-brand"
                    aria-hidden="true"
                  >
                    <BadgeCheck className="size-5" />
                  </span>
                  <h3 className="mt-4 text-d3 text-ink">{credential.name}</h3>
                  <p className="mt-2 text-sm text-ink-muted">
                    {credential.issuer}
                  </p>
                  <p
                    data-numeric=""
                    className="mt-3 text-sm font-semibold text-brand-strong"
                  >
                    {credential.date ? (
                      <time dateTime={credential.date}>
                        {formatShortDate(credential.date, locale)}
                      </time>
                    ) : (
                      <span>{t('active')}</span>
                    )}
                  </p>
                </li>
              ))}
            </ul>

            <div
              data-print-hide=""
              className="reveal mt-9 flex flex-wrap items-center gap-4"
            >
              <Button asChild variant="outline">
                <Link href="/certificaciones">
                  {t('viewCertifications')}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              {/* Una carpeta que cualquiera puede abrir vale más que una
                  insignia dibujada: la afirmación queda verificable. */}
              <Button asChild variant="ghost">
                <a
                  href={SOCIAL_LINKS.certsDrive}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('viewFolder')}
                  <ExternalLink className="size-4" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* ══ PREMIOS ═══════════════════════════════════════════════ */}
        <section
          id="premios"
          className="defer-paint border-y border-hairline bg-ground-tint"
        >
          <div
            data-print-tight=""
            className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20"
          >
            <div className="reveal max-w-2xl">
              <h2 className="text-d2 text-ink">{t('awards')}</h2>
              <p className="mt-3 text-ink-muted">{t('awardsNote')}</p>
            </div>

            <ul className="reveal-stagger mt-10 grid gap-5 md:grid-cols-2">
              {recognitions.map((award) => (
                <li
                  key={award.id}
                  data-print-keep=""
                  className="card card-hover flex flex-col p-6"
                >
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <p
                      data-numeric=""
                      className="text-sm font-semibold text-brand-strong"
                    >
                      <time dateTime={award.date}>
                        {formatShortDate(award.date, locale)}
                      </time>
                    </p>
                    {/* Etiquetado por lo que realmente es: un lugar en un
                        hackathon y una distinción con nombre son afirmaciones
                        distintas. */}
                    <Badge variant="outline">
                      {award.kind === 'competition'
                        ? t('kindCompetition')
                        : t('kindRecognition')}
                    </Badge>
                  </div>

                  <h3 className="mt-4 text-d3 text-ink">{award.title}</h3>
                  <p className="mt-1.5 font-semibold text-ink-muted">
                    {award.organization}
                  </p>
                  <p className="mt-4 text-sm text-ink-muted">
                    {award.description}
                  </p>
                  {award.impact ? (
                    <p className="mt-4 flex gap-2.5 text-sm text-ink-muted">
                      <Trophy
                        className="mt-0.5 size-4 shrink-0 text-sky-ink"
                        aria-hidden="true"
                      />
                      <span>{award.impact}</span>
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>

            <div className="reveal mt-9" data-print-hide="">
              <Button asChild variant="outline">
                <Link href="/premios">
                  {t('viewAwards')}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ══ STACK ═════════════════════════════════════════════════ */}
        <section
          id="stack"
          className="defer-paint mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20"
        >
          <div data-print-tight="">
            <div className="reveal max-w-2xl">
              <h2 className="text-d2 text-ink">{t('stack')}</h2>
              <p className="mt-3 text-ink-muted">{t('stackNote')}</p>
            </div>

            {/* Rejilla densa: siete grupos, así que van en `.card` opaca y no
                en cristal. Siete `backdrop-filter` cuestan de verdad. */}
            <dl className="reveal-stagger mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {skillCategories.map((category) => (
                <div
                  key={category.category}
                  data-print-keep=""
                  className="card p-5"
                >
                  <dt className="text-sm font-bold tracking-wide text-ink">
                    {category.label}
                  </dt>
                  <dd className="mt-3 flex flex-wrap gap-1.5">
                    {category.skills.map((skill) => (
                      <Badge key={skill} variant="neutral">
                        {skill}
                      </Badge>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ══ IDIOMAS ═══════════════════════════════════════════════ */}
        <section
          id="idiomas"
          className="defer-paint border-y border-hairline bg-ground-tint"
        >
          <div
            data-print-tight=""
            className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20"
          >
            <h2 className="reveal text-d2 text-ink">{t('languages')}</h2>

            <dl className="reveal-stagger mt-10 grid gap-5 sm:grid-cols-3">
              {personal.languages.map((language) => (
                <div key={language.name} data-print-keep="" className="card p-6">
                  <dt className="flex items-center justify-between gap-3">
                    <span className="font-display text-lg font-semibold text-ink">
                      {language.name}
                    </span>
                    {/* El nivel CEFR va impreso junto a la barra, no implícito
                        en su largo: la barra se deriva de este mismo valor, así
                        que no puede contradecir la etiqueta — y en papel, donde
                        la barra no se imprime, la etiqueta sigue diciéndolo. */}
                    <span
                      data-numeric=""
                      className="grad-fill rounded-full px-2.5 py-0.5 text-xs font-bold"
                    >
                      {language.cefr}
                    </span>
                  </dt>
                  <dd>
                    <div
                      data-print-hide=""
                      className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-hairline-strong"
                      aria-hidden="true"
                    >
                      <div
                        className="grad-deco h-full rounded-full"
                        style={{ width: `${language.proficiency}%` }}
                      />
                    </div>
                    <p className="mt-3 text-sm text-ink-muted">
                      {language.level}
                    </p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ══ CIERRE ════════════════════════════════════════════════
            Solo en pantalla: una llamada a la acción no pertenece a un CV
            impreso.                                                     */}
        <section
          data-print-hide=""
          className="defer-paint mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20"
        >
          <div className="grad-drift reveal-scale rounded-3xl px-6 py-12 shadow-lift-3 sm:px-12 sm:py-16">
            <div className="relative max-w-2xl">
              <h2 className="text-d2 text-white">{t('ctaTitle')}</h2>
              <p className="mt-4 text-lead text-white/85">{t('ctaDesc')}</p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                {/* Sobre el gradiente el botón se invierte: `bg-none` apaga la
                    imagen del variant por defecto y deja superficie blanca con
                    texto de marca. Un relleno de marca aquí desaparecería. */}
                <Button
                  asChild
                  size="lg"
                  className="sheen bg-none bg-surface text-brand-strong hover:opacity-95"
                >
                  <Link href="/contacto">
                    {t('ctaLink')}
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
      </div>
    </>
  )
}
