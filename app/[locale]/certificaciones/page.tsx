import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Rail } from '@/components/instrument/rail'
import { Span } from '@/components/instrument/span'
import { Ribbon } from '@/components/instrument/ribbon'
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
 * misma etiqueta exagera tres de ellas. Cada fila se rotula por su tipo.
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const en = locale === 'en'

  return generatePageMetadata({
    locale: locale as Locale,
    route: 'certificaciones',
    /* La plantilla añade « | Carlos Anaya Ruiz» (20 caracteres), así que el
       título de la página tiene que caber en ~40 para no pasar de 60 y que
       Google no lo recorte. El anterior daba 73. */
    title: en
      ? 'Certifications — PMP and TOEFL iBT 92'
      : 'Certificaciones — PMP y TOEFL iBT 92',
    description: en
      ? 'Verifiable credentials: PMP, TOEFL iBT 92 and Computer Science engineering from Tecnológico de Monterrey. The certificate folder is open to read.'
      : 'Credenciales verificables: PMP, TOEFL iBT 92 e Ingeniería en Tecnologías Computacionales por el Tec de Monterrey. La carpeta está abierta.',
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

  /**
   * ── LOS DOS CARRILES ──
   * Arriba corren los NOMBRES de las credenciales; abajo, en dirección
   * contraria, el tipo y quién la emitió. Los dos salen del mismo arreglo que
   * la lista de abajo, así que una cinta no puede decir algo que la lista
   * desmienta. Dos direcciones opuestas dan la profundidad que en otro sitio
   * daría una sombra.
   */
  const ribbonNames = credentials.map((credential) => credential.name)
  const ribbonIssuers = credentials.map((credential) => {
    // El año de cierre del registro, y solo si el registro lo trae: el PMP no
    // lo tiene y la cinta se queda sin él en lugar de inventarlo.
    const year = (credential.dateEnd ?? credential.date)?.slice(0, 4)
    const parts = [kindLabel[credential.kind], credential.issuer, year]
    return parts.filter(Boolean).join(' · ')
  })

  // Tres cifras, las tres contadas de los datos de arriba. Ninguna escrita a
  // mano: si mañana entra una credencial más, el número sube solo.
  const issuers = new Set(credentials.map((credential) => credential.issuer))

  /* Las credenciales CON fecha, para el tramo del margen. La primera de
     la lista no la tiene —es un grado en curso— y aquí se cae sola en vez
     de imprimirse como un año inventado. Lo que se lee es el emisor,
     porque el margen mide 18rem y el nombre completo de una
     especialización no cabe en una línea. */
  const spanEntries = credentials
    .filter((credential) => credential.dateEnd ?? credential.date)
    .map((credential) => ({
      date: (credential.dateEnd ?? credential.date) as string,
      what: credential.issuer,
    }))
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
    title: string
    desc: string
    cta: string
  }[] = [
    {
      href: '/premios',
      title: tr('awards.title'),
      desc: tr('awards.desc'),
      cta: tr('awards.cta'),
    },
    {
      href: '/cv',
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
            credential.kind === 'degree' || credential.kind === 'specialization'

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

      <div
        className="grid"
        style={{ gridTemplateColumns: 'var(--tape-w) minmax(0,1fr)' }}
      >
        <Rail />

        <div className="min-w-0">
          {/* ═══ ENCABEZADO ══════════════════════════════════════
              Tres cifras, y las tres se cuentan del mismo arreglo que se
              imprime más abajo. No hay un número escrito a mano en esta
              página. */}
          <section className="hero-in relative px-5 pt-16 sm:px-10">
            {/* ── LA HOJA TIENE DOS MÁRGENES ──
                Las tres cifras iban en `sm:grid-cols-3` a todo el ancho: a
                1440 eran tres islas con trescientos píxeles de nada entre
                cada una. Aquí son una placa grabada, que es lo que son. */}
            <div className="ledger">
              <div className="min-w-0">
                <p className="stamp">{t('eyebrow')}</p>

                <h1 className="mt-6 max-w-[16ch] text-hero text-ink">
                  {t('h1Lead')}
                  <span className="block">{t('h1Accent')}</span>
                </h1>

                <p className="mt-10 max-w-[52ch] font-human text-lead text-ink-muted">
                  {t('lead')}
                </p>

                <p className="mt-6 max-w-[62ch] text-ink-muted">{t('note')}</p>
              </div>

              {/* ── EL MARGEN DE ANOTACIÓN ── */}
              <aside className="margin margin-sticky">
                <Span
                  entries={spanEntries}
                  label={en ? 'the span' : 'el tramo'}
                  spanLabel={en ? 'by issue date' : 'por fecha de expedición'}
                />

                <dl>
                  {stats.map((stat) => (
                    <div key={stat.label} className="margin-row">
                      <dt className="margin-key">{stat.label}</dt>
                      <dd className="margin-read">{stat.value}</dd>
                    </div>
                  ))}
                </dl>
              </aside>
            </div>
          </section>

          {/* ═══ LAS CREDENCIALES ════════════════════════════════
              Primero corren, después se leen. Las cintas dan el movimiento
              que el brief pidió; la lista de abajo es donde alguien se
              detiene a comprobar el emisor y la fecha. */}
          <section className="mt-20 border-t border-hairline px-5 py-20 sm:px-10">
            <p className="stamp">{t('gridEyebrow')}</p>
            <h2 className="mt-5 max-w-[18ch] text-d1 text-ink">
              {t('gridTitle')}
            </h2>
            <p className="mt-5 max-w-[58ch] text-ink-muted">
              {t('gridSubtitle')}
            </p>

            {/* Las cintas rompen el margen de la sección: una cinta que se
                corta contra un borde deja de leerse como cinta. La máscara
                de `.ribbon` las desvanece en los cantos. */}
            <div className="-mx-5 mt-14 overflow-hidden sm:-mx-10">
              <Ribbon items={ribbonNames} label={tl('certsRail')} large />
              <div className="mt-4">
                <Ribbon items={ribbonIssuers} label={t('issuedBy')} reverse />
              </div>
            </div>

            <ul className="reveal-stagger mt-16">
              {credentials.map((credential) => (
                <li key={credential.id} className="band py-6">
                  <p className="stamp flex flex-wrap items-baseline gap-x-5 gap-y-2 tabular-nums">
                    <span>{kindLabel[credential.kind]}</span>
                    {credential.date ? (
                      <span>
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

                  <h3 className="mt-3 max-w-[44ch] text-d3 text-ink">
                    {credential.name}
                  </h3>

                  <p className="mt-2 text-ink-muted">
                    <span className="sr-only">{t('issuedBy')}: </span>
                    {credential.issuer}
                  </p>

                  {credential.detail ? (
                    <p className="mt-4 max-w-[62ch] text-sm text-ink-muted">
                      {credential.detail}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>

          {/* ═══ VERIFÍCALO TÚ MISMO ═════════════════════════════
              La única placa de la página, y le toca a esta sección porque es
              el argumento entero: una insignia dibujada no comprueba nada, el
              documento sí. Dentro de la placa no va `.link-stylus` —su color
              es papel y sobre papel desaparecería—, así que el enlace se
              escribe con la tinta heredada. */}
          <section className="plate relative px-5 py-20 sm:px-10">
            <p className="stamp">{t('verifyEyebrow')}</p>
            <h2 className="mt-5 max-w-[18ch] text-d1">{t('verifyTitle')}</h2>
            <p className="mt-8 max-w-[56ch] text-lead">{t('verifyLead')}</p>

            <p className="mt-10">
              <a
                className="text-d3 underline decoration-1 underline-offset-[0.25em]"
                href={SOCIAL_LINKS.certsDrive}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('verifyCta')} →
              </a>
            </p>

            <p className="stamp mt-6">{t('verifyNote')}</p>
          </section>

          {/* ═══ CERTIFICADOS EN PDF ═════════════════════════════
              Hoy `certificatePdfs` está vacío y la sección entera se omite. El
              código existe para el día que haya archivos en `public/pdf/`;
              fingir una descarga que no existe sería peor que no tenerla. */}
          {certificatePdfs.length > 0 ? (
            <section className="border-t border-hairline px-5 py-20 sm:px-10">
              <p className="stamp">{t('pdfEyebrow')}</p>
              <h2 className="mt-5 max-w-[18ch] text-d1 text-ink">
                {t('pdfTitle')}
              </h2>
              <p className="mt-5 max-w-[58ch] text-ink-muted">
                {t('pdfSubtitle')}
              </p>

              <ul className="reveal-stagger mt-12">
                {certificatePdfs.map((pdf) => (
                  <li key={pdf.href} className="band py-5">
                    <a
                      className="link-stylus text-d3"
                      href={pdf.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {pdf.label} →
                    </a>
                    <p className="stamp mt-3">
                      {t('pdfOpen')}
                      {pdf.size ? ` · ${pdf.size}` : ''}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* ═══ IDIOMAS ═════════════════════════════════════════
              La barra no es adorno: su largo se calcula desde el mismo nivel
              MCER que está impreso al lado, así que no puede contradecirlo. */}
          <section className="border-t border-hairline px-5 py-20 sm:px-10">
            <p className="stamp">{t('languagesEyebrow')}</p>
            <h2 className="mt-5 max-w-[18ch] text-d1 text-ink">
              {t('languagesTitle')}
            </h2>
            <p className="mt-5 max-w-[58ch] text-ink-muted">
              {t('languagesSubtitle')}
            </p>

            <dl className="reveal-stagger mt-12">
              {personal.languages.map((language) => {
                const proficiency = cefrProficiency(language.cefr)

                return (
                  <div key={language.name} className="band py-6">
                    <dt className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <span className="text-d3 text-ink">{language.name}</span>
                      <span className="stamp tabular-nums">
                        <span className="sr-only">{t('cefrLabel')}: </span>
                        {language.cefr}
                      </span>
                    </dt>
                    <dd>
                      {/* El carril tiene un ancho máximo común a los tres
                          idiomas: la comparación entre barras se conserva
                          intacta y ninguna cruza la página entera. */}
                      <span className="mt-4 block max-w-[38rem]">
                        <span
                          className="block"
                          style={{ width: `${proficiency}%` }}
                        >
                          <span className="band-fill" />
                        </span>
                      </span>
                      <p className="mt-3 text-sm text-ink-muted">
                        {language.level}
                      </p>
                    </dd>
                  </div>
                )
              })}
            </dl>
          </section>

          {/* ═══ LO DEMÁS QUE SE PUEDE REVISAR ═══════════════════ */}
          <section className="border-t border-hairline px-5 py-20 sm:px-10">
            <p className="stamp">{t('moreEyebrow')}</p>
            <h2 className="mt-5 max-w-[18ch] text-d1 text-ink">
              {t('moreTitle')}
            </h2>

            <ul className="reveal-stagger mt-12">
              {related.map((item) => (
                <li key={item.href} className="band py-6">
                  <h3 className="text-d3 text-ink">{item.title}</h3>
                  <p className="mt-2 max-w-[62ch] text-ink-muted">
                    {item.desc}
                  </p>
                  <p className="mt-4">
                    <Link className="link-stylus" href={item.href}>
                      {item.cta} →
                    </Link>
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* ═══ CIERRE ══════════════════════════════════════════ */}
          <section className="border-t border-hairline px-5 py-24 sm:px-10">
            <h2 className="max-w-[18ch] text-d1 text-ink">{t('ctaTitle')}</h2>
            <p className="mt-6 max-w-[52ch] font-human text-lead text-ink-muted">
              {t('ctaLead')}
            </p>
            <p className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
              <Link className="link-stylus text-d3" href="/contacto">
                {t('ctaCta')} →
              </Link>
              <a className="link-stylus" href={`mailto:${NAP.email}`}>
                {NAP.email}
              </a>
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
