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
import { Carousel } from '@/components/ui/carousel'
import { GlassPanel } from '@/components/ui/glass-panel'
import { ImageSlot } from '@/components/ui/image-slot'
import { Counter } from '@/components/motion/counter'
import { PointerGlow } from '@/components/motion/pointer-glow'
import { Tilt3D } from '@/components/motion/tilt-3d'
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
  /** Clave estable, independiente del idioma. Es también el nombre del archivo
   *  de imagen: public/certificaciones/<id>.png */
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

/**
 * ════════════════════════════════════════════════════════════════
 * CAPAS DE FONDO — el conjunto que hace visible el cristal
 *
 * Aurora + grano + cuadrícula, y opcionalmente el resplandor del puntero. El
 * cristal solo existe si hay algo saturado detrás que difuminar: sobre un fondo
 * casi blanco un panel translúcido se ve exactamente igual que un panel blanco.
 * Los cuatro <i> son obligatorios — cada uno es un campo de color distinto.
 *
 * ── CUÁNTAS CABEN, MEDIDO ──
 * Tres secciones con aurora por página y ni una más. Pasando de ahí se agota el
 * presupuesto de capas compuestas, el navegador devuelve las animaciones al
 * hilo principal y TODA animación en bucle cuesta un recálculo de estilo por
 * frame: 180 en 3 s en reposo contra un presupuesto de 20.
 * Aquí las tres son las que llevan cristal encima: la cabecera, el carrusel de
 * diplomas y el panel de "verifícalo tú mismo". Las demás secciones ponen su
 * color con un gradiente fijo (`.grad-soft`) o con `bg-ground-tint`, que no se
 * animan y no cuestan capa.
 * Verifica: node scripts/perf-probe.mjs http://localhost:3000/es/certificaciones
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
    route: 'certificaciones',
    title: en
      ? 'Certifications — PMP, TOEFL iBT 92, Tec de Monterrey'
      : 'Certificaciones — PMP, TOEFL iBT 92, Tec de Monterrey',
    description: en
      ? 'Verifiable credentials: Project Management Professional (PMP), TOEFL iBT 92, and Computer Science engineering from Tecnológico de Monterrey. The certificate folder is open to read.'
      : 'Credenciales verificables: Project Management Professional (PMP), TOEFL iBT 92 e Ingeniería en Tecnologías Computacionales por el Tecnológico de Monterrey. La carpeta de certificados está abierta.',
  })
}

export default async function CertificationsPage({ params }: Props) {
  const { locale: rawLocale } = await params
  setRequestLocale(rawLocale)

  const locale = rawLocale as Locale
  const en = locale === 'en'

  const t = await getTranslations('certificaciones')
  const tr = await getTranslations('trayectoria')
  const tl = await getTranslations('a11y')
  const tu = await getTranslations('common')

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
    { value: credentials.length, label: t('statCredentials'), float: 'float' },
    { value: issuers.size, label: t('statIssuers'), float: 'float-slow' },
    {
      value: personal.languages.length,
      label: t('statLanguages'),
      float: 'float',
    },
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
          Aurora, grano, cuadrícula y el resplandor del puntero: cuatro capas
          decorativas, todas en -z-10 dentro de un contenedor `relative isolate
          overflow-hidden` y ninguna capturando eventos.                  */}
      <section className="relative isolate overflow-hidden border-b border-hairline">
        <Backdrop glow />

        <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
          <Breadcrumbs items={[{ label: t('title') }]} />

          <div className="mt-10 max-w-3xl">
            <p className="eyebrow enter-scale">
              <BadgeCheck className="size-3.5" aria-hidden="true" />
              {t('eyebrow')}
            </p>

            {/* El gradiente cae solo sobre la segunda mitad del titular: un h1
                completo recortado pierde legibilidad. Y `text-ink` es el único
                color de texto que aguanta ir DIRECTO sobre la aurora (10.2:1). */}
            <h1 className="enter-blur step-1 mt-6 text-d1 text-ink">
              {t('h1Lead')}
              <span className="grad-text">{t('h1Accent')}</span>
            </h1>

            <span
              className="grad-deco enter step-1 mt-7 block h-1 w-12 rounded-full"
              aria-hidden="true"
            />

            {/* ── POR QUÉ EL LEAD VA DENTRO DE CRISTAL ──
                Medido: sobre la aurora `text-ink-muted` cae a 3.83:1 y
                `text-ink-subtle` a 3.23:1, y ninguno pasa. Dentro de
                `.glass-strong` suben a 5.1 y 4.54. De ahí que el panel sea
                `strong` y no el cristal por defecto, donde el subtle se queda en
                4.30 — y aquí dentro hay un `ink-subtle`. */}
            <GlassPanel strong className="enter step-2 mt-7 p-6 sm:p-7">
              <p className="text-lead text-ink-muted">{t('lead')}</p>

              <p className="mt-5 flex max-w-[68ch] gap-3 text-sm text-ink-subtle">
                <ShieldCheck
                  className="mt-0.5 size-5 shrink-0 text-sky-ink"
                  aria-hidden="true"
                />
                <span>{t('note')}</span>
              </p>
            </GlassPanel>

            {/* ── LAS TRES CIFRAS, FLOTANDO EN CRISTAL ──
                El `.float` va en el CONTENIDO —el rótulo y la cifra—, nunca en
                el panel: mover un elemento con `backdrop-filter` obliga a
                rerasterizar el desenfoque en cada frame, la misma trampa que
                `filter: blur()` sobre algo que se mueve. El panel se queda
                quieto; respira lo de dentro.

                Las dos partes llevan LA MISMA clase a propósito: comparten
                keyframes y arrancan en el mismo instante, así que suben y bajan
                juntas y el rótulo no se despega de su número. Lo que alterna
                entre tarjetas son las dos duraciones que existen (6 s y 9 s),
                para que las tres no respiren en fase — que es lo que delata el
                truco.

                Y no hay un <div> intermedio para colgar la clase: el modelo de
                contenido de <dl> solo admite dt/dd (o un <div> con dt/dd
                dentro), así que envolver el par en otro div sería HTML inválido.

                Dos columnas en móvil, tres desde `sm`: a tres columnas en una
                pantalla de 320 px cada tarjeta quedaría con 42 px de contenido y
                una palabra como "Credenciales" desbordaría la celda.
                Verifica con: npm run check:overflow */}
            <dl className="enter step-4 mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <GlassPanel key={stat.label} strong className="p-4 sm:p-5">
                  <dt
                    className={`text-sm font-semibold text-ink ${stat.float}`}
                  >
                    {stat.label}
                  </dt>
                  <dd
                    className={`grad-text mt-2 font-display text-3xl font-bold leading-none sm:text-4xl ${stat.float}`}
                  >
                    <Counter value={stat.value} />
                  </dd>
                </GlassPanel>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ══ CARRUSEL DE DIPLOMAS ═══════════════════════════════════
          El listado de credenciales ES este carrusel: el desplazamiento y el
          imán son nativos (`scroll-snap`), así que si el JS del componente no
          corre sigue funcionando, y las tarjetas completas están en el HTML del
          servidor — un crawler las lee todas. No hay una segunda rejilla con lo
          mismo: la misma credencial contada dos veces en la misma URL no agrega
          una prueba, agrega ruido.                                       */}
      <section className="relative isolate overflow-hidden border-b border-hairline bg-ground-tint">
        <Backdrop />

        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">{t('gridEyebrow')}</p>
            <h2 className="mt-5 text-d1 text-ink">{t('gridTitle')}</h2>
            <GlassPanel strong className="mt-6 px-5 py-4">
              <p className="text-lead text-ink-muted">{t('gridSubtitle')}</p>
            </GlassPanel>
          </div>

          <Carousel
            label={tl('certsRail')}
            prevLabel={tl('prevSlide')}
            nextLabel={tl('nextSlide')}
            className="mt-10"
          >
            {credentials.map((credential) => (
              /* La inclinación sigue al puntero. `.scene` ya está en el riel del
                 carrusel, así que todas las tarjetas comparten un mismo punto de
                 fuga — que es lo que separa un 3D creíble de cuatro tarjetas
                 girando cada una por su cuenta.

                 El hueco del diploma va COMO HERMANO del panel de cristal y no
                 dentro: la etiqueta del hueco es a su vez un panel de cristal, y
                 anidar `backdrop-filter` difumina dos veces, cuesta el doble y
                 se ve peor. Los `.depth-*` van en los hijos DIRECTOS de `.tilt`:
                 `.glass` lleva `contain: paint`, que aplana el 3D de lo que
                 tenga dentro. */
              <Tilt3D key={credential.id} className="w-[19rem] sm:w-[23rem]">
                <article className="flex h-full flex-col gap-3">
                  <ImageSlot
                    path={`/certificaciones/${credential.id}.png`}
                    alt={t('diplomaAlt', { name: credential.name })}
                    hint="Diploma"
                    width={1000}
                    height={750}
                    sizes="(min-width: 640px) 23rem, 19rem"
                    className="depth-2 aspect-[4/3] rounded-2xl shadow-lift-3"
                  />

                  <GlassPanel
                    strong
                    className="depth-1 flex flex-1 flex-col p-5"
                  >
                    <div className="flex items-start gap-3">
                      {/* El sello lleva `.grad-fill`, no `.grad-deco`: aquí hay
                          TEXTO encima, y los stops de `--grad` miden 2.70:1 y
                          1.76:1. Todos los de `--grad-fill` pasan 5.3:1 contra
                          blanco. Va `aria-hidden` porque las iniciales son un
                          adorno del emisor, que se lee completo al lado. */}
                      <span
                        className="grad-fill inline-flex size-12 shrink-0 items-center justify-center rounded-full font-display text-xs font-bold tracking-wide shadow-glow-brand"
                        aria-hidden="true"
                      >
                        {issuerInitials(credential.issuer)}
                      </span>

                      <div className="min-w-0 flex-1">
                        <Badge variant="sky">
                          {kindLabel[credential.kind]}
                        </Badge>
                        <p className="mt-2 text-xs font-bold uppercase tracking-wide text-ink-subtle">
                          {t('issuedBy')}
                        </p>
                        <p className="text-sm font-semibold text-ink">
                          {credential.issuer}
                        </p>
                      </div>
                    </div>

                    <h3 className="mt-5 flex-1 text-d3 text-ink">
                      {credential.name}
                    </h3>

                    <p className="mt-5 flex items-center gap-2 text-sm text-ink-subtle">
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
                  </GlassPanel>
                </article>
              </Tilt3D>
            ))}
          </Carousel>

          {/* `text-ink` y no `ink-subtle`: esta línea va directa sobre la
              aurora, sin cristal de por medio. */}
          <p className="mt-2 text-sm text-ink">{tu('dragHint')}</p>
        </div>
      </section>

      {/* ══ VERIFÍCALO TÚ MISMO ════════════════════════════════════
          El panel protagonista de la página, y el diferenciador real: una
          insignia dibujada no comprueba nada, el documento sí. Lleva `rim` —el
          borde recorrido por el gradiente— porque es el único panel de la página
          que pide ese peso, y la aurora va detrás a propósito: sin nada
          saturado que desenfocar el cristal no se lee como cristal.       */}
      <section className="relative isolate overflow-hidden border-b border-hairline">
        <Backdrop glow />

        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          {/* `.scene` en el envoltorio y la rotación en `.tilt`: la perspectiva
              vive en el contenedor y el giro en el hijo. */}
          <div className="scene">
            <Tilt3D
              max={4}
              className="grid gap-4 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]"
            >
              {/* Texto sobre cristal SIEMPRE es tinta, nunca blanco: sobre un
                  panel de cristal el blanco mide 1.96:1. Y `strong` porque
                  abajo hay un `ink-subtle`. */}
              <GlassPanel
                as="section"
                strong
                rim
                className="depth-1 flex flex-col p-7 sm:p-9"
              >
                <span
                  className="grad-deco float-slow inline-flex size-12 items-center justify-center rounded-xl text-white shadow-glow-brand"
                  aria-hidden="true"
                >
                  <FolderOpen className="size-6" />
                </span>

                {/* Rótulo plano y NO la clase `.eyebrow`, que trae su propio
                    `backdrop-filter`: dentro de un panel de cristal sería
                    desenfoque sobre desenfoque — difumina dos veces, cuesta el
                    doble y se ve peor. Se conserva la tipografía del token
                    `text-eyebrow` y el punto de gradiente, que es decorativo y
                    va `aria-hidden`. `text-brand-strong` mide 5.66:1 sobre
                    cristal. */}
                <p className="mt-6 flex items-center gap-2 text-eyebrow uppercase text-brand-strong">
                  <span
                    className="grad-deco size-1.5 shrink-0 rounded-full"
                    aria-hidden="true"
                  />
                  {t('verifyEyebrow')}
                </p>
                <h2 className="mt-5 text-d2 text-ink">{t('verifyTitle')}</h2>
                <p className="mt-4 max-w-[52ch] text-ink-muted">
                  {t('verifyLead')}
                </p>

                <div className="mt-8">
                  {/* Botón de gradiente y no `glass`: este panel YA es cristal,
                      y un botón de cristal dentro sería cristal sobre cristal. */}
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

                <p className="mt-4 text-sm text-ink-subtle">
                  {t('verifyNote')}
                </p>
              </GlassPanel>

              {/* El hueco de la captura de la carpeta. Va fuera del panel
                  porque su etiqueta es a su vez un panel de cristal. */}
              <ImageSlot
                path="/certificaciones/carpeta-de-certificados.png"
                alt={t('folderShotAlt')}
                hint="Captura de la carpeta"
                width={1200}
                height={750}
                sizes="(min-width: 640px) 45vw, 100vw"
                className="depth-2 min-h-56 rounded-2xl shadow-lift-3 sm:min-h-full"
              />
            </Tilt3D>
          </div>
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
              <p className="mt-4 text-lead text-ink-muted">
                {t('pdfSubtitle')}
              </p>
            </div>

            <ul className="reveal-stagger mt-12 grid gap-4 sm:grid-cols-2">
              {certificatePdfs.map((pdf) => (
                <li key={pdf.href}>
                  <a
                    href={pdf.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card lift press group flex items-center gap-4 p-5"
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

      {/* ══ IDIOMAS ════════════════════════════════════════════════
          Cristal sobre `.grad-soft` y no sobre aurora: el presupuesto de tres
          auroras por página ya está gastado, y aquí el color detrás del cristal
          lo pone un `background-image` fijo que no cuesta ningún frame.   */}
      <section className="defer-paint grad-soft border-b border-hairline">
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

          {/* `.reveal-stagger` y no `.tilt-hover`: la inclinación en hover trae
              `box-shadow: var(--lift-4)`, que SUSTITUYE la pila de sombras de
              `.glass` —los dos `inset` que dibujan el borde luminoso y el
              reflejo interior— y el panel deja de leerse como vidrio justo
              cuando el mouse está encima. En una tarjeta clicable ese cambio es
              la señal de que se puede pulsar y se paga con gusto; en un panel
              que no lleva a ningún lado, no. Aquí el movimiento entra al
              aparecer, que es donde no pelea con el material. */}
          <dl className="reveal-stagger mt-12 grid gap-5 sm:grid-cols-3">
            {personal.languages.map((language) => {
              // La barra se calcula aquí, desde el mismo nivel MCER que se
              // imprime al lado. No hay un número suelto que pueda derivar de
              // la etiqueta: la barra no puede contradecir al rótulo porque
              // salen del mismo dato.
              const proficiency = cefrProficiency(language.cefr)

              return (
                <GlassPanel key={language.name} strong className="p-6">
                  <dt className="flex items-center justify-between gap-3">
                    <span className="font-display text-lg font-semibold text-ink">
                      {language.name}
                    </span>
                    {/* El nivel MCER va SIEMPRE impreso, no solo dibujado. */}
                    <span
                      data-numeric=""
                      className="grad-fill rounded-full px-2.5 py-0.5 text-xs font-bold"
                    >
                      <span className="sr-only">{t('cefrLabel')}: </span>
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
                </GlassPanel>
              )
            })}
          </dl>
        </div>
      </section>

      {/* ══ LO DEMÁS QUE SE PUEDE REVISAR ══════════════════════════
          Tarjetas opacas (`.card`): esta sección no lleva aurora, y sin nada
          saturado detrás un panel translúcido se ve idéntico a uno blanco —
          pagando el `backdrop-filter` a cambio de nada.                   */}
      <section className="defer-paint bg-ground-tint">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">{t('moreEyebrow')}</p>
            <h2 className="mt-5 text-d1 text-ink">{t('moreTitle')}</h2>
          </div>

          <div className="scene mt-14 grid gap-6 md:grid-cols-2">
            {related.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="card lift press sheen group flex flex-col p-6 sm:p-7"
                >
                  <span
                    className="grad-deco inline-flex size-11 items-center justify-center rounded-xl text-white shadow-glow-brand"
                    aria-hidden="true"
                  >
                    <Icon className="size-5" />
                  </span>

                  <h3 className="mt-5 text-d3 text-ink transition-colors duration-300 group-hover:text-brand-strong">
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

      {/* ══ CTA FINAL ══════════════════════════════════════════════
          `.grad-drift` desplaza una capa al 200% con `transform` en vez de
          animar `background-position`, que repintaría el bloque completo en
          cada frame. Mismo efecto, costo cero.                           */}
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
