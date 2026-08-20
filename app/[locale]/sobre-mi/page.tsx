import type { Metadata } from 'next'
import Image from 'next/image'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Check,
  ExternalLink,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Sparkles,
} from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Metric } from '@/components/ui/metric'
import { Counter } from '@/components/motion/counter'
import { PointerGlow } from '@/components/motion/pointer-glow'
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
  const skillCategories = getSkillCategories(locale)
  const awards = getAwards(locale)

  // `awards.ts` modela tres cosas distintas en un mismo archivo. Un examen
  // aprobado no es un premio, así que las certificaciones se listan bajo
  // Certificaciones y solo las distinciones reales quedan en Reconocimientos.
  const certifications = awards.filter((award) => award.kind === 'certification')
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
  const facts = [
    { term: en ? 'Role' : 'Rol', detail: personal.title, icon: Briefcase },
    { term: en ? 'Based in' : 'Base', detail: personal.location, icon: MapPin },
    ...(degree && degreeLine
      ? [
          {
            term: en ? 'Education' : 'Formación',
            detail: `${degreeLine} · ${degree.institution}`,
            icon: GraduationCap,
          },
        ]
      : []),
    {
      term: en ? 'Certification' : 'Certificación',
      detail: 'PMP · Project Management Institute',
      icon: BadgeCheck,
    },
  ]

  // Tres cifras, las tres derivadas de datos verificables: los años que ya
  // declara el resumen, el puntaje real del TOEFL y la cantidad de puestos que
  // contiene este mismo archivo de datos. Nada inventado.
  const stats = [
    {
      value: <Counter value={4} suffix="+" />,
      label: en ? 'Years of experience' : 'Años de experiencia',
      hint: tt('engineerLabel'),
    },
    {
      value: <Counter value={92} />,
      label: 'TOEFL iBT',
      hint: en ? 'English C1 · ETS' : 'Inglés C1 · ETS',
    },
    {
      value: <Counter value={experiences.length} />,
      label: en ? 'Roles in industry' : 'Roles en la industria',
      hint: tt('companies'),
    },
  ]

  const profiles = [
    {
      href: SOCIAL_LINKS.linkedin,
      label: 'LinkedIn',
      icon: Linkedin,
      external: true,
    },
    // Las dos cuentas, etiquetadas por su handle: dos enlaces que dijeran
    // "GitHub" serían indistinguibles para quien lee y para un lector de
    // pantalla.
    ...personal.github.map((url) => ({
      href: url,
      label: url.replace(/^https:\/\/github\.com\//, 'GitHub / '),
      icon: Github,
      external: true,
    })),
    {
      href: `mailto:${NAP.email}`,
      label: NAP.email,
      icon: Mail,
      external: false,
    },
  ]

  // El gradiente cae sobre los apellidos, no sobre el nombre completo: un h1
  // entero recortado pierde legibilidad, y así resalta la parte que esta
  // página posiciona como entidad. El texto renderizado es idéntico al dato.
  const [firstName, ...surnames] = personal.name.split(' ')
  const surname = surnames.join(' ')

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

      {/* ══ CABECERA ══════════════════════════════════════════════
          Tres capas de fondo, todas decorativas, todas en -z-10 y
          ninguna captura eventos: la malla animada, el resplandor que
          sigue al puntero y la cuadrícula que se desvanece.          */}
      <section className="relative isolate overflow-hidden">
        <div className="mesh" aria-hidden="true" />
        <PointerGlow />
        <div className="grid-fade" aria-hidden="true" />

        <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-10 sm:px-8 sm:pb-20 sm:pt-14">
          <Breadcrumbs items={[{ label: t('title') }]} />

          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-16">
            <div className="max-w-2xl">
              <p className="eyebrow enter-scale">
                <Sparkles className="size-3.5" aria-hidden="true" />
                {t('title')}
              </p>

              {/* La persona es la entidad de la que habla esta página, así que
                  el nombre es el h1 y "Sobre mí" es la píldora de arriba. */}
              <h1 className="enter-blur step-1 mt-6 text-d1 text-ink">
                {surname ? (
                  <>
                    {firstName} <span className="grad-text">{surname}</span>
                  </>
                ) : (
                  personal.name
                )}
              </h1>

              <p className="enter step-2 mt-5 text-lead text-ink-muted">
                {t('subtitle')}
              </p>

              <p className="enter step-3 mt-6 max-w-[68ch] text-ink-muted">
                {t('lead')}
              </p>

              {/* Píldoras de identidad. Reusan el variant `subtle` del Button
                  para heredar el objetivo táctil de 44 px y el hover del
                  sistema, en lugar de inventar un borde propio. */}
              <ul className="enter step-4 mt-9 flex flex-wrap gap-2.5">
                {profiles.map((profile) => {
                  const Icon = profile.icon
                  return (
                    <li key={profile.href}>
                      <Button
                        asChild
                        variant="subtle"
                        className="rounded-full text-sm"
                      >
                        <a
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
                          <Icon className="size-4" aria-hidden="true" />
                          {profile.label}
                        </a>
                      </Button>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Retrato con anillo de gradiente. El anillo va detrás como capa
                absoluta, así que al animarse no desplaza nada (cero CLS). Está
                sobre el pliegue en todos los breakpoints, así que nunca se
                carga en diferido. */}
            <div className="enter-scale step-2 order-first lg:order-none">
              <div className="relative mx-auto w-fit">
                <div
                  className="grad-animate absolute -inset-2 rounded-[2rem] opacity-90"
                  aria-hidden="true"
                />
                <div className="relative size-32 overflow-hidden rounded-3xl border-2 border-surface bg-ground-tint shadow-lift-3 sm:size-40 lg:size-56">
                  <Image
                    src={SEO_IMAGES.avatar}
                    alt={SEO_IMAGES.avatarAlt[locale]}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 224px, (min-width: 640px) 160px, 128px"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

          <dl className="enter step-5 mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map((fact) => {
              const Icon = fact.icon
              return (
                <div key={fact.term} className="card card-hover p-5">
                  <span
                    className="grad-fill inline-flex size-10 items-center justify-center rounded-xl shadow-glow-brand"
                    aria-hidden="true"
                  >
                    <Icon className="size-5" />
                  </span>
                  <dt className="mt-4 text-xs font-bold uppercase tracking-wider text-ink-subtle">
                    {fact.term}
                  </dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-ink">
                    {fact.detail}
                  </dd>
                </div>
              )
            })}
          </dl>
        </div>
      </section>

      {/* ══ RESUMEN PROFESIONAL ═══════════════════════════════════ */}
      <section id="resumen" className="border-y border-hairline bg-ground-tint">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">{en ? 'Profile' : 'Perfil'}</p>
            <h2 className="mt-5 text-d1 text-ink">{t('summary')}</h2>
          </div>

          {/* El texto largo toma su medida y su ritmo de la clase, no de
              utilidades párrafo por párrafo. */}
          <div className="reveal prose-rich mt-8">
            {personal.summary.split('\n\n').map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>

          {/* Las cifras cuentan al entrar en pantalla, pero el valor final ya
              viene en el HTML del servidor: ningún crawler ve un cero. */}
          <div className="reveal-stagger mt-14 grid gap-8 sm:grid-cols-3">
            {stats.map((stat) => (
              <Metric
                key={stat.label}
                value={stat.value}
                label={stat.label}
                hint={stat.hint}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══ EXPERIENCIA ═══════════════════════════════════════════ */}
      <section
        id="experiencia"
        className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24"
      >
        <div className="reveal max-w-2xl">
          <p className="eyebrow">{en ? 'Track record' : 'Trayectoria'}</p>
          <h2 className="mt-5 text-d1 text-ink">{t('experience')}</h2>
          <p className="mt-4 text-lead text-ink-muted">
            {en
              ? 'Three roles, with the dates, the place and the stack each one actually used.'
              : 'Tres roles, con las fechas, el lugar y el stack que cada uno usó de verdad.'}
          </p>
        </div>

        {/* Línea de tiempo: una tarjeta por puesto y un riel de gradiente a la
            izquierda. El punto y el conector son decorativos y viven en capa
            absoluta, así que no empujan la tarjeta ni un píxel. Cada fecha es
            un <time> real, o sea legible por máquina. */}
        <ol className="reveal-stagger mt-14 space-y-6">
          {experiences.map((exp, index) => (
            <li
              key={exp.id}
              className="relative grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-4 sm:grid-cols-[2rem_minmax(0,1fr)] sm:gap-x-6"
            >
              <div className="relative" aria-hidden="true">
                <span className="grad-fill absolute left-1/2 top-7 size-3.5 -translate-x-1/2 rounded-full shadow-glow-brand" />
                {/* El conector solo baja si hay una entrada siguiente. */}
                {index < experiences.length - 1 ? (
                  <span className="grad-fill absolute -bottom-[3.25rem] left-1/2 top-12 w-0.5 -translate-x-1/2 rounded-full opacity-40" />
                ) : null}
              </div>

              <article className="card card-hover p-6 sm:p-7">
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
                    <Badge variant="gradient">
                      {en ? 'Current role' : 'Rol actual'}
                    </Badge>
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
                          className="mt-0.5 size-4 shrink-0 text-violet"
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
              </article>
            </li>
          ))}
        </ol>
      </section>

      {/* ══ FORMACIÓN + CERTIFICACIONES ═══════════════════════════ */}
      <section
        id="credenciales"
        className="border-y border-hairline bg-ground-tint"
      >
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">{en ? 'Credentials' : 'Credenciales'}</p>
            <h2 className="mt-5 text-d1 text-ink">{t('education')}</h2>
          </div>

          <ul className="reveal-stagger mt-12 grid gap-6 md:grid-cols-2">
            {education.map((item) => (
              <li key={item.id} className="card card-hover p-6">
                <p
                  data-numeric=""
                  className="text-sm font-semibold text-brand-strong"
                >
                  <time dateTime={item.startDate}>{item.startDate}</time>
                  {' – '}
                  <time dateTime={item.endDate}>{item.endDate}</time>
                </p>
                {/* `degree` es la etiqueta localizada de la credencial, así la
                    especialización nunca se lee como un segundo título. */}
                <h3 className="mt-3 text-d3 text-ink">
                  {item.degree} {en ? 'in' : 'en'} {item.field}
                </h3>
                <p className="mt-2 text-sm text-ink-muted">
                  {item.institution} · {item.location}
                </p>
              </li>
            ))}
          </ul>

          {/* Las certificaciones comparten banda con la formación: es la misma
              pregunta, y un solo enlace de verificación cubre las dos. */}
          <div className="mt-16 border-t border-hairline pt-14">
            <div className="reveal max-w-2xl">
              <h2 className="text-d1 text-ink">{t('certs')}</h2>
              <p className="mt-4 text-lead text-ink-muted">
                {t('credentialsNote')}
              </p>
            </div>

            <ul className="reveal-stagger mt-10 grid gap-5 md:grid-cols-2">
              {credentials.map((credential) => (
                <li key={credential.id} className="card card-hover p-6">
                  <span
                    className="grad-fill inline-flex size-10 items-center justify-center rounded-xl shadow-glow-brand"
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
                      <span>{en ? 'Active' : 'Vigente'}</span>
                    )}
                  </p>
                </li>
              ))}
            </ul>

            <div className="reveal mt-10">
              {/* Una carpeta que cualquiera puede abrir vale más que una
                  insignia dibujada: la afirmación queda verificable, que es
                  todo el punto de esta página. */}
              <Button asChild variant="outline" size="lg">
                <a
                  href={SOCIAL_LINKS.certsDrive}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('viewCerts')}
                  <ExternalLink className="size-4" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ══ STACK + IDIOMAS ═══════════════════════════════════════ */}
      <section
        id="stack"
        className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24"
      >
        <div className="reveal max-w-2xl">
          <p className="eyebrow">Stack</p>
          <h2 className="mt-5 text-d1 text-ink">{t('skills')}</h2>
        </div>

        <dl className="reveal-stagger mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category) => (
            <div key={category.category} className="card p-5">
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

        <div className="mt-16 border-t border-hairline pt-14">
          <h2 className="reveal text-d1 text-ink">{t('languages')}</h2>

          <dl className="reveal-stagger mt-10 grid gap-5 sm:grid-cols-3">
            {personal.languages.map((language) => (
              <div key={language.name} className="card p-6">
                <dt className="flex items-center justify-between gap-3">
                  <span className="font-display text-lg font-semibold text-ink">
                    {language.name}
                  </span>
                  {/* El nivel CEFR va impreso junto a la barra, no implícito en
                      su largo: la barra se deriva de este mismo valor, así que
                      no puede contradecir la etiqueta. */}
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
                      className="grad-fill h-full rounded-full"
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

      {/* ══ RECONOCIMIENTOS ═══════════════════════════════════════ */}
      <section
        id="reconocimientos"
        className="border-y border-hairline bg-ground-tint"
      >
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">
              {en ? 'Selected work' : 'Trabajo destacado'}
            </p>
            <h2 className="mt-5 text-d1 text-ink">{t('awards')}</h2>
          </div>

          <ul className="reveal-stagger mt-14 grid gap-6 md:grid-cols-2">
            {recognitions.map((award) => (
              <li
                key={award.id}
                className="card card-hover flex flex-col p-6 sm:p-7"
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
                      ? en
                        ? 'Competition'
                        : 'Competencia'
                      : en
                        ? 'Recognition'
                        : 'Reconocimiento'}
                  </Badge>
                </div>

                <h3 className="mt-4 text-d3 text-ink">{award.title}</h3>
                <p className="mt-1.5 font-semibold text-ink-muted">
                  {award.organization}
                </p>
                <p className="mt-4 text-ink-muted">{award.description}</p>
                {award.impact ? (
                  <p className="mt-4 flex gap-2.5 text-sm text-ink-muted">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-violet"
                      aria-hidden="true"
                    />
                    <span>{award.impact}</span>
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══ CIERRE ════════════════════════════════════════════════ */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="grad-animate reveal-scale relative overflow-hidden rounded-3xl px-6 py-14 shadow-lift-3 sm:px-12 sm:py-20">
          <div className="relative max-w-2xl">
            <h2 className="text-d1 text-white">{t('philosophy')}</h2>
            <p className="mt-5 text-lead text-white/85">
              {t('philosophyDesc')}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              {/* Sobre el gradiente el botón se invierte: `bg-none` apaga la
                  imagen del variant por defecto y deja superficie blanca con
                  texto de marca. Un relleno de marca aquí desaparecería. */}
              <Button
                asChild
                size="lg"
                className="sheen bg-none bg-surface text-brand-strong hover:opacity-95"
              >
                <Link href="/servicios">
                  {t('servicesLink')}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Link
                href="/contacto"
                className="inline-flex min-h-11 items-center text-sm font-semibold text-white underline decoration-white/50 underline-offset-4 hover:decoration-white"
              >
                {tn('contact')}
              </Link>
            </div>

            <p className="mt-7 text-sm text-white/75">
              {en ? 'Or write to ' : 'O escríbeme a '}
              <a
                href={`mailto:${NAP.email}`}
                className="font-semibold text-white underline underline-offset-4"
              >
                {NAP.email}
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
