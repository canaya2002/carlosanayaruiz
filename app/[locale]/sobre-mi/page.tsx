import type { Metadata } from 'next'
import Image from 'next/image'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { MediaSlot } from '@/components/instrument/media-slot'
import { Rail } from '@/components/instrument/rail'
import { Span } from '@/components/instrument/span'
import { Ribbon } from '@/components/instrument/ribbon'
import { getPersonalInfo } from '@/data/personal'
import { getExperiences } from '@/data/experience'
import { getEducation } from '@/data/education'
import { getSkillCategories } from '@/data/skills'
import { getAwards } from '@/data/awards'
import { NAP, SEO_IMAGES, SOCIAL_LINKS } from '@/lib/constants'
import { generatePageMetadata } from '@/lib/seo'
import { generateProfilePageGraph } from '@/lib/schema'
import { formatShortDate } from '@/lib/utils'
import { Locale } from '@/data/types'

/**
 * ════════════════════════════════════════════════════════════════
 * SOBRE MÍ — el expediente
 *
 * Esta página es la ficha del operador, y una ficha es un registro: filas
 * medidas una debajo de otra, no una galería de tarjetas. Todo lo que aquí
 * era envoltorio —aurora, cristal, tarjetas inclinadas, carruseles con
 * flechas, huecos de imagen que apuntaban a archivos inexistentes— se retiró.
 * El contenido no: cada dato que estaba sigue estando, en una banda.
 *
 * Tres decisiones que conviene no deshacer:
 *
 * 1. UNA sola placa (`.plate`), y es el resumen profesional. Es la hoja
 *    impresa del expediente y por eso es la única superficie clara. Dentro de
 *    ella NO se puede usar `.link-stylus` —su color es `--paper`, invisible
 *    sobre papel— ni `text-ink-*`, que se pintarían con la tinta del hollín.
 *    Por eso la placa no contiene un solo enlace.
 *
 * 2. Las 57 herramientas del stack son DOS CINTAS en direcciones opuestas, no
 *    una rejilla de cápsulas. Los nombres corren; los siete grupos se miden
 *    aparte con `.band-fill`, cuyo largo es la cantidad real de herramientas
 *    de cada grupo dividida entre la del grupo más grande. La barra es un
 *    dato, nunca un adorno.
 *
 * 3. El instrumento en vivo (aguja, marcas, regla de presupuesto) NO se
 *    duplica aquí. Es exclusivo de la home: repetirlo en cada página lo
 *    convierte en decoración y deja de significar. Aquí solo va la cinta.
 *
 * El único retrato real del sitio es `SEO_IMAGES.avatar`; los demás huecos
 * apuntaban a `/sobre-mi/*.png`, `/certificaciones/*.png` y `/premios/*.png`,
 * directorios que no existen en `public/`. Un hueco vacío no es contenido.
 * ════════════════════════════════════════════════════════════════
 */

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const en = locale === 'en'

  return generatePageMetadata({
    locale: locale as Locale,
    route: 'sobreMi',
    // La plantilla "| Carlos Anaya Ruiz" ya carga el nombre, así que el título
    // en sí no lo repite.
    title: en
      ? 'About — Engineer, PMP, technical SEO'
      : 'Sobre mí — Ingeniero, PMP, SEO técnico',
    description: en
      ? 'Computer Science engineer from Tec de Monterrey, PMP certified, TOEFL iBT 92, four years across Amazon, Master Loyalty Group and Wan Hai Lines.'
      : 'Ingeniero en Tecnologías Computacionales por el Tec de Monterrey, certificado PMP y cuatro años en Amazon, Master Loyalty Group y Wan Hai Lines.',
  })
}

export default async function AboutPage({ params }: Props) {
  const { locale: rawLocale } = await params
  setRequestLocale(rawLocale)

  const locale = rawLocale as Locale
  const en = locale === 'en'

  const t = await getTranslations('about')
  const tc = await getTranslations('common')
  const tn = await getTranslations('nav')
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

  // `awards.ts` modela tres cosas distintas en un mismo archivo. Un examen
  // aprobado no es un premio, así que las certificaciones se listan bajo
  // Certificaciones y solo las distinciones reales quedan en Reconocimientos.
  const certifications = awards.filter(
    (award) => award.kind === 'certification'
  )
  const recognitions = awards.filter((award) => award.kind !== 'certification')

  // El título, distinto de la especialización cursada dentro de él.
  const degree = education.find((item) => item.kind === 'degree')
  const degreeLine = degree
    ? `${degree.degree} ${en ? 'in' : 'en'} ${degree.field}`
    : null

  // El PMP no trae fecha en ningún registro de aquí, e inventarla sería peor
  // que omitirla — así que `date` es nullable y la fila dice "vigente".
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

  // Hechos de perfil, no métricas de marketing: cada línea se puede verificar
  // contra la carpeta de credenciales que se enlaza más abajo en esta página.
  // Sin iconos: un icono dentro de un cuadro con fondo es justo el envoltorio
  // que esta migración retira, y el término ya dice de qué habla la fila.
  const facts = [
    { term: en ? 'Role' : 'Rol', detail: personal.title },
    { term: en ? 'Based in' : 'Base', detail: personal.location },
    ...(degree && degreeLine
      ? [
          {
            term: en ? 'Education' : 'Formación',
            detail: `${degreeLine} · ${degree.institution}`,
          },
        ]
      : []),
    {
      term: en ? 'Certification' : 'Certificación',
      detail: 'PMP · Project Management Institute',
    },
  ]

  // Tres cifras, las tres derivadas de datos verificables: los años que ya
  // declara el resumen, el puntaje real del TOEFL y la cantidad de puestos que
  // contiene este mismo archivo de datos. Nada inventado.
  //
  // Se imprimen, no se cuentan hacia arriba: un contador animado es JavaScript
  // de cliente para mostrar un número que el servidor ya sabe.
  const stats = [
    {
      value: '4+',
      label: en ? 'Years of experience' : 'Años de experiencia',
      hint: tt('engineerLabel'),
    },
    {
      value: '92',
      label: 'TOEFL iBT',
      hint: en ? 'English C1 · ETS' : 'Inglés C1 · ETS',
    },
    {
      value: String(experiences.length),
      label: en ? 'Roles in industry' : 'Roles en la industria',
      hint: tt('companies'),
    },
  ]

  const profiles = [
    {
      href: SOCIAL_LINKS.linkedin,
      label: 'LinkedIn',
      external: true,
    },
    // Las dos cuentas, etiquetadas por su handle: dos enlaces que dijeran
    // "GitHub" serían indistinguibles para quien lee y para un lector de
    // pantalla.
    ...personal.github.map((url) => ({
      href: url,
      label: url.replace(/^https:\/\/github\.com\//, 'GitHub / '),
      external: true,
    })),
    {
      href: `mailto:${NAP.email}`,
      label: NAP.email,
      external: false,
    },
  ]

  /**
   * El stack, aplanado a una sola tira para las cintas. El agrupamiento no se
   * pierde: vive abajo, medido, en las bandas por grupo.
   */
  const stack = skillCategories.flatMap((category) => category.skills)

  // El largo de cada barra es relativo al grupo más grande, así que la
  // comparación entre grupos es la que se lee. Nunca un porcentaje inventado.
  const maxGroup = Math.max(...skillCategories.map((c) => c.skills.length))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          // ProfilePage → mainEntity #person. Toda afirmación de ese grafo
          // — título, PMP, TOEFL, idiomas, empleadores — se renderiza abajo.
          __html: JSON.stringify(generateProfilePageGraph(locale)),
        }}
      />

      <div
        className="grid"
        style={{ gridTemplateColumns: 'var(--tape-w) minmax(0,1fr)' }}
      >
        <Rail />

        <div className="min-w-0">
          {/* ═══ CABECERA ════════════════════════════════════════
              La persona es la entidad de la que habla esta página, así que
              el nombre es el h1 y "Sobre mí" es la etiqueta de arriba. */}
          <section className="hero-in px-5 pt-16 sm:px-10">
            <p className="stamp">{t('title')}</p>

            <h1 className="mt-6 max-w-[11ch] text-hero text-ink">
              {personal.name}
            </h1>

            {/* El retrato va DESPUÉS del texto en el DOM: en móvil, una foto
                de este tamaño arriba se come la primera pantalla y deja el h1
                bajo el pliegue. En desktop el grid lo manda a su columna. */}
            <div className="mt-12 grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,17rem)] md:gap-14">
              <div>
                <p className="max-w-[40ch] text-lead text-ink">
                  {t('subtitle')}
                </p>

                {/* Primera persona: es el único lugar de la página donde la
                    serif tiene permiso. */}
                <p className="mt-8 max-w-[52ch] font-human text-lead text-ink-muted">
                  {t('lead')}
                </p>

                <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
                  {profiles.map((profile) => (
                    <li key={profile.href}>
                      <a
                        className="link-stylus"
                        href={profile.href}
                        {...(profile.external
                          ? {
                              target: '_blank',
                              // rel="me" más `sameAs` en el schema Person es
                              // lo que reconcilia estos perfiles en una sola
                              // entidad.
                              rel: 'me noopener noreferrer',
                            }
                          : {})}
                      >
                        {profile.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* `.figure-bw` y no `.portrait`: la plancha clara y la trama de
                  rayas de 3 px existían para salvar una foto de 800 px con
                  fondo de oficina. Llegó una de estudio en blanco y negro, así
                  que la muleta se fue y lo que queda es la regla del sistema —
                  la foto se disuelve en el material. */}
              <figure className="m-0">
                <span className="figure-bw">
                  <span className="portrait-shutter" aria-hidden="true" />
                  <Image
                    src={SEO_IMAGES.portraitBw}
                    alt={SEO_IMAGES.avatarAlt[locale]}
                    width={SEO_IMAGES.portraitBwSize}
                    height={SEO_IMAGES.portraitBwSize}
                    sizes="(min-width: 768px) 15rem, 60vw"
                  />
                </span>
                <figcaption className="stamp mt-4 tabular-nums">
                  {NAP.locality} · 19.4326 N / 99.1332 W
                </figcaption>
              </figure>

              {/* EL TRAMO, debajo del retrato. Esta cabecera ya repartía
                  texto y foto en dos columnas, así que aquí no hacía falta
                  otra rejilla: le faltaba el INSTRUMENTO. Un eje con los
                  empleos y los estudios juntos dice de un vistazo lo que
                  tres bandas de prosa dicen en tres pantallas. */}
              <div className="mt-10 border-t border-hairline pt-5">
                <Span
                  entries={spanEntries}
                  label={en ? 'the span' : 'el tramo'}
                  spanLabel={
                    en ? 'jobs and degrees, one axis' : 'empleos y estudios'
                  }
                />
              </div>
            </div>
          </section>

          {/* ═══ HECHOS DE PERFIL ════════════════════════════════
              Cuatro filas, no cuatro paneles. El término a la izquierda y el
              dato a la derecha: es una ficha, y una ficha se lee en columna. */}
          <section className="border-t border-hairline px-5 py-20 sm:px-10">
            <p className="stamp">
              {en ? 'identity · on record' : 'identidad · en registro'}
            </p>

            <dl className="mt-10">
              {facts.map((fact) => (
                <div
                  key={fact.term}
                  className="band grid gap-x-8 gap-y-1 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)] sm:items-baseline"
                >
                  <dt className="stamp">{fact.term}</dt>
                  <dd className="m-0 max-w-[52ch] text-ink">{fact.detail}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* ═══ RESUMEN — LA PLACA ══════════════════════════════
              La única superficie clara de la página: la hoja del expediente.
              Sin enlaces dentro, a propósito — `.link-stylus` es papel sobre
              hollín y aquí desaparecería. Las etiquetas usan `.stamp`, que
              dentro de `.plate` ya trae su propia tinta medida. */}
          <section id="resumen" className="plate px-5 py-20 sm:px-10">
            <p className="stamp">{en ? 'profile' : 'perfil'}</p>
            <h2 className="mt-5 max-w-[18ch] text-d1">{t('summary')}</h2>

            <div className="mt-10 max-w-[62ch] space-y-6">
              {personal.summary.split('\n\n').map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>

            <dl className="mt-14">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="band grid gap-x-8 gap-y-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline"
                >
                  <dt>
                    <span className="text-d3">{stat.label}</span>
                    <span className="stamp mt-2 block">{stat.hint}</span>
                  </dt>
                  <dd className="m-0 font-mono text-d2 tabular-nums">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {/* ═══ TRAYECTORIA ═════════════════════════════════════
              El eje con desplazamiento y longitud reales vive en la home.
              Aquí interesa el detalle de cada puesto, así que cada rol es una
              banda completa y no una lámina de carrusel: las tres están en el
              HTML del servidor y se leen enteras, sin arrastrar nada. */}
          <section
            id="experiencia"
            className="border-t border-hairline px-5 py-20 sm:px-10"
          >
            <p className="stamp">{en ? 'track record' : 'trayectoria'}</p>
            <h2 className="mt-5 max-w-[16ch] text-d1 text-ink">
              {t('experience')}
            </h2>

            {/* La foto de trabajo abre la trayectoria: una imagen antes de la
                lista de puestos, no una por puesto. */}
            <div className="mt-12 grid max-w-4xl gap-x-14 gap-y-4 lg:grid-cols-2">
              <MediaSlot
                id="sobre-mi-trabajo"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
              {/* El puesto de trabajo, sin él dentro. Es lo que dice «esto es
                  un oficio» sin tener que escribirlo. */}
              <MediaSlot
                id="sobre-mi-escritorio"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            </div>

            <ol className="reveal-stagger mt-12">
              {experiences.map((exp) => (
                <li key={exp.id} className="band">
                  <p className="stamp tabular-nums">
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
                    {' · '}
                    {exp.location}
                  </p>

                  <h3 className="mt-4 text-d3 text-ink">{exp.position}</h3>
                  <p className="mt-1 text-ink">{exp.company}</p>
                  <p className="mt-4 max-w-[62ch] text-ink-muted">
                    {exp.description}
                  </p>

                  {exp.highlights.length > 0 ? (
                    <ul className="mt-5 max-w-[68ch] space-y-2">
                      {exp.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="grid grid-cols-[1.25rem_minmax(0,1fr)] text-ink-muted"
                        >
                          <span aria-hidden="true" className="font-mono">
                            –
                          </span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {/* El stack del puesto es un renglón de índice impreso, no
                      una fila de cápsulas. */}
                  {exp.technologies && exp.technologies.length > 0 ? (
                    <p className="stamp mt-5 max-w-[68ch] leading-[2]">
                      {exp.technologies.join(' · ')}
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>

            <p className="mt-10">
              <Link className="link-stylus" href="/cv">
                {en ? 'See the full CV' : 'Ver el CV completo'} →
              </Link>
            </p>
          </section>

          {/* ═══ CREDENCIALES ════════════════════════════════════
              Formación y certificaciones comparten banda: es la misma
              pregunta, y un solo enlace de verificación cubre las dos. */}
          <section
            id="credenciales"
            className="border-t border-hairline px-5 py-20 sm:px-10"
          >
            <p className="stamp">
              {en ? 'credentials · verifiable' : 'credenciales · verificables'}
            </p>
            <h2 className="mt-5 max-w-[16ch] text-d1 text-ink">
              {t('education')}
            </h2>

            <ol className="mt-12">
              {education.map((item) => (
                <li
                  key={item.id}
                  className="band grid gap-x-8 gap-y-2 sm:grid-cols-[minmax(0,8rem)_minmax(0,1fr)] sm:items-baseline"
                >
                  <p className="stamp tabular-nums">
                    <time dateTime={item.startDate}>{item.startDate}</time>
                    {' – '}
                    <time dateTime={item.endDate}>{item.endDate}</time>
                  </p>
                  <div>
                    {/* `degree` es la etiqueta localizada de la credencial, así
                        la especialización nunca se lee como un segundo título. */}
                    <h3 className="text-d3 text-ink">
                      {item.degree} {en ? 'in' : 'en'} {item.field}
                    </h3>
                    <p className="mt-1 text-ink-muted">
                      {item.institution} · {item.location}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-16">
              <h2 className="max-w-[16ch] text-d1 text-ink">{t('certs')}</h2>
              <p className="mt-5 max-w-[56ch] text-lead text-ink-muted">
                {t('credentialsNote')}
              </p>

              <ol className="mt-10">
                {credentials.map((credential) => (
                  <li
                    key={credential.id}
                    className="band grid gap-x-8 gap-y-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline"
                  >
                    <div>
                      <h3 className="text-d3 text-ink">{credential.name}</h3>
                      <p className="mt-1 text-ink-muted">{credential.issuer}</p>
                    </div>
                    <p className="stamp tabular-nums">
                      {credential.date ? (
                        <time dateTime={credential.date}>
                          {formatShortDate(credential.date, locale)}
                        </time>
                      ) : (
                        /* La tercera de las tres: iba en el HUECO DE LA FECHA
                           diciendo «vigente», que es una afirmación de
                           vigencia sin fecha de emisión ni de renovación. El
                           PMP se renueva cada tres años con 60 PDU, así que de
                           «sin fecha» no se deduce «vigente». Las otras dos
                           salen de `certificaciones.noDate` y `cv.active`. */
                        <span>{en ? 'no date' : 'sin fecha'}</span>
                      )}
                    </p>
                  </li>
                ))}
              </ol>

              {/* Una carpeta que cualquiera puede abrir vale más que una
                  insignia dibujada: la afirmación queda verificable, que es
                  todo el punto de esta página. */}
              <p className="mt-10">
                <a
                  className="link-stylus"
                  href={SOCIAL_LINKS.certsDrive}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('viewCerts')} →
                </a>
              </p>
            </div>
          </section>

          {/* ═══ STACK ═══════════════════════════════════════════
              Los nombres corren en dos cintas cruzadas; los grupos se miden
              debajo. Dos lecturas del mismo dato sin repetir un solo nombre. */}
          <section
            id="stack"
            className="border-t border-hairline px-5 py-20 sm:px-10"
          >
            <p className="stamp tabular-nums">
              {en
                ? `stack · ${stack.length} tools · ${skillCategories.length} groups`
                : `stack · ${stack.length} herramientas · ${skillCategories.length} grupos`}
            </p>
            <h2 className="mt-5 max-w-[16ch] text-d1 text-ink">
              {t('skills')}
            </h2>

            {/* Los márgenes negativos sacan las cintas del padding de la
                sección para que corran de canto a canto. `overflow-hidden`
                es lo que impide que la pista de `width: max-content` empuje
                la página a lo ancho en 375 px. */}
            <div className="-mx-5 mt-12 overflow-hidden sm:-mx-10">
              <Ribbon
                items={stack}
                label={en ? 'Stack and tools' : 'Stack y herramientas'}
              />
              <div className="mt-3">
                <Ribbon
                  items={stack}
                  label={en ? 'Stack, second rail' : 'Stack, segundo carril'}
                  reverse
                />
              </div>
            </div>

            {/* El largo de la barra es la cantidad real de herramientas del
                grupo contra la del grupo más grande. Es una medición, así que
                la cifra va impresa al lado y la barra no puede mentir. */}
            <ol className="mt-14">
              {skillCategories.map((category) => (
                <li key={category.category} className="band">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <span className="text-d3 text-ink">{category.label}</span>
                    <span className="stamp tabular-nums">
                      {category.skills.length}
                    </span>
                  </div>
                  <span
                    className="mt-3 block"
                    style={{
                      width: `${(category.skills.length / maxGroup) * 100}%`,
                    }}
                  >
                    <span className="band-fill" />
                  </span>
                </li>
              ))}
            </ol>
          </section>

          {/* ═══ IDIOMAS ═════════════════════════════════════════
              El nivel MCER va impreso junto a la barra, no implícito en su
              largo: la barra se deriva del mismo valor, así que no puede
              contradecir la etiqueta. */}
          <section
            id="idiomas"
            className="border-t border-hairline px-5 py-20 sm:px-10"
          >
            <p className="stamp">
              {en ? 'languages · cefr' : 'idiomas · mcer'}
            </p>
            <h2 className="mt-5 max-w-[16ch] text-d1 text-ink">
              {t('languages')}
            </h2>

            <dl className="mt-12">
              {personal.languages.map((language) => (
                <div key={language.name} className="band">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <dt className="text-d3 text-ink">{language.name}</dt>
                    <dd className="stamp m-0 tabular-nums">{language.level}</dd>
                  </div>
                  <span
                    className="mt-3 block"
                    style={{ width: `${language.proficiency}%` }}
                    aria-hidden="true"
                  >
                    <span className="band-fill" />
                  </span>
                </div>
              ))}
            </dl>
          </section>

          {/* ═══ RECONOCIMIENTOS ═════════════════════════════════ */}
          <section
            id="reconocimientos"
            className="border-t border-hairline px-5 py-20 sm:px-10"
          >
            <p className="stamp">
              {en ? 'selected work' : 'trabajo destacado'}
            </p>
            <h2 className="mt-5 max-w-[16ch] text-d1 text-ink">
              {t('awards')}
            </h2>

            <ol className="reveal-stagger mt-12">
              {recognitions.map((award) => (
                <li key={award.id} className="band">
                  <p className="stamp tabular-nums">
                    <time dateTime={award.date}>
                      {formatShortDate(award.date, locale)}
                    </time>
                    {' · '}
                    {/* Etiquetado por lo que realmente es: un lugar en un
                        hackathon y una distinción con nombre son afirmaciones
                        distintas. */}
                    {award.kind === 'competition'
                      ? en
                        ? 'competition'
                        : 'competencia'
                      : en
                        ? 'recognition'
                        : 'reconocimiento'}
                  </p>

                  <h3 className="mt-4 max-w-[30ch] text-d3 text-ink">
                    {award.title}
                  </h3>
                  <p className="mt-1 text-ink">{award.organization}</p>
                  <p className="mt-4 max-w-[62ch] text-ink-muted">
                    {award.description}
                  </p>
                  {award.impact ? (
                    <p className="mt-3 max-w-[62ch] text-ink-muted">
                      {award.impact}
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>

            <p className="mt-10">
              <Link className="link-stylus" href="/premios">
                {en ? 'See every recognition' : 'Ver todos los premios'} →
              </Link>
            </p>
          </section>

          {/* ═══ CIERRE ══════════════════════════════════════════ */}
          <section className="border-t border-hairline px-5 py-24 sm:px-10">
            <h2 className="max-w-[18ch] text-d1 text-ink">{t('philosophy')}</h2>
            <p className="mt-6 max-w-[56ch] text-lead text-ink-muted">
              {t('philosophyDesc')}
            </p>

            <p className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
              <Link className="link-stylus text-d3" href="/servicios">
                {t('servicesLink')} →
              </Link>
              <Link className="link-stylus text-d3" href="/contacto">
                {tn('contact')} →
              </Link>
            </p>

            <p className="mt-8 text-ink-muted">
              {en ? 'Or write to ' : 'O escríbeme a '}
              <a className="link-stylus" href={`mailto:${NAP.email}`}>
                {NAP.email}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
