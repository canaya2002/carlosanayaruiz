import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarCheck,
  ExternalLink,
  FileText,
  FolderOpen,
  Languages,
  ShieldCheck,
  Trophy,
  type LucideIcon,
} from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GlassPanel } from '@/components/ui/glass-panel'
import { Counter } from '@/components/motion/counter'
import { ProjectCover } from '@/components/map/project-cover'
import { getAwards } from '@/data/awards'
import { getEducation } from '@/data/education'
import { getPersonalInfo } from '@/data/personal'
import { cefrProficiency, type Locale } from '@/data/types'
import { NAP, SOCIAL_LINKS, routeUrl } from '@/lib/constants'
import { generatePageMetadata } from '@/lib/seo'
import {
  generateBreadcrumbSchema,
  generateWebPageSchema,
  type SchemaGraph,
} from '@/lib/schema'
import { formatShortDate } from '@/lib/utils'
import type { StaticPathname } from '@/i18n/routing'

interface Props {
  params: Promise<{ locale: string }>
}

/**
 * Qué es cada credencial. No es cosmético: un examen aprobado, una
 * certificación profesional, un título universitario y una especialización
 * cursada DENTRO de ese título son cuatro cosas distintas, y meterlas bajo la
 * misma etiqueta exagera tres de ellas. Cada tarjeta se rotula por su tipo.
 */
type CredentialKind = 'professional' | 'exam' | 'degree' | 'specialization'

interface Credential {
  /** Clave estable, independiente del idioma. */
  id: string
  name: string
  issuer: string
  kind: CredentialKind
  /**
   * `YYYY` o `YYYY-MM`. Es `null` cuando el registro NO trae fecha: el PMP no
   * la tiene en ningún archivo de datos, e inventarla sería peor que omitirla.
   */
  date: string | null
  /** Fin del periodo, solo cuando el registro es un rango (la formación). */
  dateEnd?: string
  /** Una línea de contexto que sale del propio registro, nunca de marketing. */
  detail?: string
}

/**
 * Certificados servidos desde este mismo sitio.
 *
 * `public/pdf/` existe y está VACÍA a propósito: hoy no hay ningún documento
 * subido. Mientras el arreglo esté vacío, la sección entera no se renderiza —
 * ni encabezado huérfano, ni enlace a un 404, ni un "próximamente". Para
 * publicar uno: copia el archivo a `public/pdf/` y agrega su entrada aquí.
 */
interface CertificatePdf {
  /** Ruta pública dentro de `/public`, p. ej. `/pdf/pmp.pdf`. */
  href: string
  label: string
  /** Peso legible, para que el enlace diga qué se va a abrir. */
  size?: string
}

const certificatePdfs: CertificatePdf[] = []

/**
 * Palabras que no aportan inicial. Sin esta lista, "Tecnológico de Monterrey"
 * daría "TDM", que no es la sigla de nada.
 */
const ISSUER_STOPWORDS = new Set([
  'de',
  'del',
  'la',
  'las',
  'el',
  'los',
  'y',
  'of',
  'the',
  'and',
  'for',
  'in',
])

/**
 * Iniciales del emisor para el sello de la tarjeta.
 *
 * Se DERIVAN del nombre que ya está en los datos, no se escriben a mano: así el
 * sello no puede acabar diciendo una sigla que no corresponde al emisor
 * impreso justo debajo. Lo que va entre paréntesis suele ser la sigla ya
 * escrita — "ETS (Educational Testing Service)" → "ETS" —, así que se recorta
 * antes de partir en palabras.
 */
function issuerInitials(issuer: string): string {
  const base = issuer.replace(/\([^)]*\)/g, ' ').trim()
  const words = base
    .split(/[\s·,.–-]+/)
    .filter(
      (word) => word.length > 0 && !ISSUER_STOPWORDS.has(word.toLowerCase())
    )

  if (words.length === 0) return issuer.slice(0, 3).toUpperCase()
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase()

  return words
    .map((word) => word[0])
    .join('')
    .slice(0, 3)
    .toUpperCase()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const en = locale === 'en'

  return generatePageMetadata({
    locale: locale as Locale,
    route: 'certificaciones',
    title: en
      ? 'Certifications — PMP, TOEFL iBT 92, Tec de Monterrey'
      : 'Certificaciones — PMP, TOEFL iBT 92, Tec de Monterrey',
    description: en
      ? 'Verifiable credentials: Project Management Professional (PMP), TOEFL iBT 92, and Computer Science engineering from Tecnológico de Monterrey. The certificate folder is open to read.'
      : 'Credenciales verificables: Project Management Professional (PMP), TOEFL iBT 92 e Ingeniería en Tecnologías Computacionales por el Tec de Monterrey. La carpeta de certificados está abierta.',
  })
}

export default async function CertificationsPage({ params }: Props) {
  const { locale: rawLocale } = await params
  setRequestLocale(rawLocale)

  const locale = rawLocale as Locale
  const en = locale === 'en'

  const t = await getTranslations('certificaciones')
  const tr = await getTranslations('trayectoria')

  const awards = getAwards(locale)
  const education = getEducation(locale)
  const personal = getPersonalInfo(locale)

  // `data/awards.ts` guarda tres cosas distintas en un archivo. Aquí solo
  // entran las de tipo 'certification': un reconocimiento no es una credencial.
  const examCertifications = awards.filter(
    (award) => award.kind === 'certification'
  )

  // El título va antes que la especialización que se cursó DENTRO de él, y el
  // orden se decide filtrando por tipo, no confiando en el orden del archivo.
  const degrees = education.filter((item) => item.kind === 'degree')
  const specializations = education.filter(
    (item) => item.kind === 'specialization'
  )

  const credentials: Credential[] = [
    // El PMP no vive en ningún `data/*.ts`: está en el `hasCredential` del
    // grafo de lib/schema.ts y en la página Sobre mí. Se escribe igual que
    // allá, sin fecha, porque ningún registro la tiene.
    {
      id: 'pmp',
      name: 'Project Management Professional (PMP)',
      issuer: 'Project Management Institute',
      kind: 'professional',
      date: null,
      detail: t('pmpDetail'),
    },
    ...examCertifications.map<Credential>((award) => ({
      id: award.id,
      name: award.title,
      issuer: award.organization,
      kind: 'exam',
      date: award.date,
      detail: award.description,
    })),
    ...[...degrees, ...specializations].map<Credential>((item) => ({
      id: item.id,
      name: `${item.degree} ${en ? 'in' : 'en'} ${item.field}`,
      issuer: item.institution,
      kind: item.kind === 'degree' ? 'degree' : 'specialization',
      date: item.startDate,
      dateEnd: item.endDate,
      detail: item.location,
    })),
  ]

  const kindLabel: Record<CredentialKind, string> = {
    professional: t('kindProfessional'),
    exam: t('kindExam'),
    degree: t('kindDegree'),
    specialization: t('kindSpecialization'),
  }

  /** Categoría de schema.org por tipo. Los mismos valores que usa lib/schema.ts. */
  const kindCategory: Record<CredentialKind, string> = {
    professional: 'Professional Certification',
    exam: 'Certification',
    degree: 'degree',
    specialization: 'Specialization',
  }

  // Tres cifras, las tres contadas de los datos de arriba. Ninguna escrita a
  // mano: si mañana entra una credencial más, el número sube solo.
  const issuers = new Set(credentials.map((credential) => credential.issuer))
  const stats = [
    { value: credentials.length, label: t('statCredentials') },
    { value: issuers.size, label: t('statIssuers') },
    { value: personal.languages.length, label: t('statLanguages') },
  ]

  // Las otras dos páginas de trayectoria. `StaticPathname` son las rutas SIN
  // parámetros, así que colar aquí una ruta dinámica falla en compilación y no
  // en render.
  const related: {
    href: StaticPathname
    icon: LucideIcon
    title: string
    desc: string
    cta: string
  }[] = [
    {
      href: '/premios',
      icon: Trophy,
      title: tr('awards.title'),
      desc: tr('awards.desc'),
      cta: tr('awards.cta'),
    },
    {
      href: '/cv',
      icon: FileText,
      title: tr('cv.title'),
      desc: tr('cv.desc'),
      cta: tr('cv.cta'),
    },
  ]

  const pageUrl = routeUrl('certificaciones', locale)
  const credentialListId = `${pageUrl}#credentials`

  /**
   * WebPage (CollectionPage) + ItemList de credenciales + BreadcrumbList.
   *
   * Cada `EducationalOccupationalCredential` sale de un registro real: nombre,
   * emisor y, cuando existe, la fecha. El PMP no lleva fecha porque no la hay
   * en ningún dato. La lista se referencia con `mainEntity` y su nodo vive en
   * ESTE mismo grafo — un `@id` solo se apunta donde el nodo existe.
   */
  const schema: SchemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      generateWebPageSchema({
        locale,
        route: 'certificaciones',
        name: en
          ? 'Certifications & Credentials — Carlos Anaya Ruiz'
          : 'Certificaciones y credenciales — Carlos Anaya Ruiz',
        description: t('lead'),
        type: 'CollectionPage',
        hasBreadcrumb: true,
        mainEntityId: credentialListId,
      }),
      {
        '@type': 'ItemList',
        '@id': credentialListId,
        name: t('gridTitle'),
        numberOfItems: credentials.length,
        itemListElement: credentials.map((credential, index) => {
          // La fecha del registro: el fin del periodo cuando es un rango.
          const awarded = credential.dateEnd ?? credential.date
          const academic =
            credential.kind === 'degree' ||
            credential.kind === 'specialization'

          return {
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'EducationalOccupationalCredential',
              name: credential.name,
              credentialCategory: kindCategory[credential.kind],
              recognizedBy: {
                '@type': academic ? 'CollegeOrUniversity' : 'Organization',
                name: credential.issuer,
              },
              ...(awarded ? { dateCreated: awarded } : {}),
            },
          }
        }),
      },
      generateBreadcrumbSchema(
        [
          { name: en ? 'Home' : 'Inicio', route: 'home' },
          { name: t('title'), route: 'certificaciones' },
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
          Malla animada y cuadrícula que se desvanece: las dos son
          decorativas, las dos viven en -z-10 dentro de un contenedor
          `relative isolate` y ninguna captura eventos.               */}
      <section className="relative isolate overflow-hidden border-b border-hairline">
        <div className="mesh" aria-hidden="true" />
        <div className="grid-fade" aria-hidden="true" />

        <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
          <Breadcrumbs items={[{ label: t('title') }]} />

          <div className="mt-10 max-w-3xl">
            <p className="eyebrow enter-scale">
              <BadgeCheck className="size-3.5" aria-hidden="true" />
              {t('eyebrow')}
            </p>

            {/* El gradiente cae solo sobre la segunda mitad del titular: un h1
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

            <p className="enter step-3 mt-5 flex max-w-[68ch] gap-3 text-ink-muted">
              <ShieldCheck
                className="mt-1 size-5 shrink-0 text-sky-ink"
                aria-hidden="true"
              />
              <span>{t('note')}</span>
            </p>

            {/* Dos columnas en móvil, tres desde `sm`. A tres columnas en una
                pantalla de 320 px cada tarjeta quedaría con 42 px de contenido y
                una palabra como "Credenciales" desbordaría la celda.
                Verifica con: npm run check:overflow */}
            <dl className="enter step-4 mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="card p-4 sm:p-5">
                  <dt className="text-sm font-semibold text-ink">
                    {stat.label}
                  </dt>
                  <dd className="grad-text mt-2 font-display text-3xl font-bold leading-none sm:text-4xl">
                    <Counter value={stat.value} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ══ REJILLA DE CREDENCIALES ════════════════════════════════
          Rejilla densa: `.card`, que es opaca y no cuesta nada. Aquí NO va
          cristal — `backdrop-filter` es el efecto más caro del sistema y
          multiplicarlo por tarjeta es exactamente la contradicción que este
          sitio cobra por arreglar.                                       */}
      <section className="border-b border-hairline bg-ground-tint">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">{t('gridEyebrow')}</p>
            <h2 className="mt-5 text-d1 text-ink">{t('gridTitle')}</h2>
            <p className="mt-4 text-lead text-ink-muted">{t('gridSubtitle')}</p>
          </div>

          <ul className="reveal-stagger mt-14 grid gap-6 md:grid-cols-2">
            {credentials.map((credential) => (
              <li key={credential.id}>
                <article className="card card-hover flex h-full flex-col p-6 sm:p-7">
                  <div className="flex items-start gap-4">
                    {/* El sello lleva `.grad-fill`, no `.grad-deco`: aquí hay
                        TEXTO encima, y los stops de `--grad` miden 2.70:1 y
                        1.76:1. Todos los de `--grad-fill` pasan 5.3:1 contra
                        blanco. Va `aria-hidden` porque las iniciales son un
                        adorno del emisor, que se lee completo al lado. */}
                    <span
                      className="grad-fill inline-flex size-14 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold tracking-wide shadow-glow-brand"
                      aria-hidden="true"
                    >
                      {issuerInitials(credential.issuer)}
                    </span>

                    <div className="min-w-0 flex-1">
                      <Badge variant="sky">{kindLabel[credential.kind]}</Badge>
                      <p className="mt-2 text-xs font-bold uppercase tracking-wide text-ink-subtle">
                        {t('issuedBy')}
                      </p>
                      <p className="text-sm font-semibold text-ink">
                        {credential.issuer}
                      </p>
                    </div>
                  </div>

                  <h3 className="mt-6 text-d3 text-ink">{credential.name}</h3>

                  {credential.detail ? (
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
                      {credential.detail}
                    </p>
                  ) : null}

                  <p className="mt-6 flex items-center gap-2 text-sm text-ink-subtle">
                    <CalendarCheck
                      className="size-4 shrink-0"
                      aria-hidden="true"
                    />
                    {credential.date ? (
                      <span data-numeric="">
                        <time dateTime={credential.date}>
                          {formatShortDate(credential.date, locale)}
                        </time>
                        {credential.dateEnd ? (
                          <>
                            {' – '}
                            <time dateTime={credential.dateEnd}>
                              {formatShortDate(credential.dateEnd, locale)}
                            </time>
                          </>
                        ) : null}
                      </span>
                    ) : (
                      /* Sin fecha en el registro: lo dice en lugar de
                         inventar una. */
                      <span>{t('noDate')}</span>
                    )}
                  </p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══ VERIFÍCALO TÚ MISMO ════════════════════════════════════
          El único panel de cristal de la página, y por eso funciona: la malla
          decorativa va detrás a propósito, porque sin nada que desenfocar el
          cristal no se lee como cristal.                                  */}
      <section className="defer-paint relative isolate overflow-hidden border-b border-hairline">
        <div className="mesh" aria-hidden="true" />

        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <GlassPanel className="reveal-scale grid sm:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
            {/* Texto sobre cristal SIEMPRE es tinta, nunca blanco: sobre un
                panel blanco al 62% el blanco mide 1.68:1 y `--ink` 9.6:1. */}
            <div className="flex flex-col p-7 sm:p-9">
              <span
                className="grad-deco inline-flex size-12 items-center justify-center rounded-xl text-white shadow-glow-brand"
                aria-hidden="true"
              >
                <FolderOpen className="size-6" />
              </span>

              {/* `self-start` no es decorativo: la píldora vive en un contenedor
                  `flex-col`, donde el `stretch` por defecto la estiraría a todo
                  el ancho de la columna. */}
              <p className="eyebrow mt-6 self-start">{t('verifyEyebrow')}</p>
              <h2 className="mt-5 text-d2 text-ink">{t('verifyTitle')}</h2>
              <p className="mt-4 max-w-[52ch] text-ink-muted">
                {t('verifyLead')}
              </p>

              <div className="mt-8">
                <Button asChild size="lg" className="sheen shadow-glow-brand">
                  <a
                    href={SOCIAL_LINKS.certsDrive}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('verifyCta')}
                    <ExternalLink className="size-4" aria-hidden="true" />
                  </a>
                </Button>
              </div>

              <p className="mt-4 text-sm text-ink-subtle">{t('verifyNote')}</p>
            </div>

            {/* Portada determinista por semilla: no hay una foto real de la
                carpeta, y una imagen de banco sería peor que un patrón. */}
            <ProjectCover
              seed="certificaciones"
              label={t('verifyCoverLabel')}
              className="min-h-52 sm:min-h-full"
            />
          </GlassPanel>
        </div>
      </section>

      {/* ══ CERTIFICADOS EN PDF ════════════════════════════════════
          Hoy `certificatePdfs` está vacío y la sección entera se omite. El
          código existe para el día que haya archivos en `public/pdf/`; fingir
          una descarga que no existe sería peor que no tener la sección.   */}
      {certificatePdfs.length > 0 ? (
        <section className="defer-paint border-b border-hairline">
          <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
            <div className="reveal max-w-2xl">
              <p className="eyebrow">{t('pdfEyebrow')}</p>
              <h2 className="mt-5 text-d1 text-ink">{t('pdfTitle')}</h2>
              <p className="mt-4 text-lead text-ink-muted">{t('pdfSubtitle')}</p>
            </div>

            <ul className="reveal-stagger mt-12 grid gap-4 sm:grid-cols-2">
              {certificatePdfs.map((pdf) => (
                <li key={pdf.href}>
                  <a
                    href={pdf.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card card-hover group flex items-center gap-4 p-5"
                  >
                    <span
                      className="grad-deco inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-white shadow-glow-brand"
                      aria-hidden="true"
                    >
                      <FileText className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-ink transition-colors group-hover:text-brand-strong">
                        {pdf.label}
                      </span>
                      <span className="mt-0.5 block text-sm text-ink-subtle">
                        {t('pdfOpen')}
                        {pdf.size ? ` · ${pdf.size}` : ''}
                      </span>
                    </span>
                    <ArrowUpRight
                      className="size-4 shrink-0 text-brand-strong transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* ══ IDIOMAS ════════════════════════════════════════════════ */}
      <section className="defer-paint border-b border-hairline bg-ground-tint">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">
              <Languages className="size-3.5" aria-hidden="true" />
              {t('languagesEyebrow')}
            </p>
            <h2 className="mt-5 text-d1 text-ink">{t('languagesTitle')}</h2>
            <p className="mt-4 text-lead text-ink-muted">
              {t('languagesSubtitle')}
            </p>
          </div>

          <dl className="reveal-stagger mt-12 grid gap-5 sm:grid-cols-3">
            {personal.languages.map((language) => {
              // La barra se calcula aquí, desde el mismo nivel MCER que se
              // imprime al lado. No hay un número suelto que pueda derivar de
              // la etiqueta.
              const proficiency = cefrProficiency(language.cefr)

              return (
                <div key={language.name} className="card p-6">
                  <dt className="flex items-center justify-between gap-3">
                    <span className="font-display text-lg font-semibold text-ink">
                      {language.name}
                    </span>
                    <span
                      data-numeric=""
                      className="grad-fill rounded-full px-2.5 py-0.5 text-xs font-bold"
                    >
                      {language.cefr}
                    </span>
                  </dt>
                  <dd>
                    <div
                      className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-hairline-strong"
                      aria-hidden="true"
                    >
                      <div
                        className="grad-deco h-full rounded-full"
                        style={{ width: `${proficiency}%` }}
                      />
                    </div>
                    <p className="mt-3 text-sm text-ink-muted">
                      {language.level}
                    </p>
                  </dd>
                </div>
              )
            })}
          </dl>
        </div>
      </section>

      {/* ══ LO DEMÁS QUE SE PUEDE REVISAR ══════════════════════════ */}
      <section className="defer-paint mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="reveal max-w-2xl">
          <p className="eyebrow">{t('moreEyebrow')}</p>
          <h2 className="mt-5 text-d1 text-ink">{t('moreTitle')}</h2>
        </div>

        <div className="reveal-stagger mt-14 grid gap-6 md:grid-cols-2">
          {related.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="card card-hover group flex flex-col p-6 sm:p-7"
              >
                <span
                  className="grad-deco inline-flex size-11 items-center justify-center rounded-xl text-white shadow-glow-brand"
                  aria-hidden="true"
                >
                  <Icon className="size-5" />
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
      </section>

      {/* ══ CTA FINAL ══════════════════════════════════════════════ */}
      <section className="defer-paint mx-auto w-full max-w-6xl px-5 pb-20 sm:px-8 sm:pb-24">
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
                  {t('ctaCta')}
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
