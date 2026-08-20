import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ArrowRight, ArrowUpRight, Check, X } from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Disclosure } from '@/components/ui/disclosure'
import { getServiceById, getServices, servicePath } from '@/data/services'
import { NAP } from '@/lib/constants'
import { generatePageMetadata } from '@/lib/seo'
import { generateServicePageGraph } from '@/lib/schema'
import { Locale } from '@/data/types'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const en = locale === 'en'

  return generatePageMetadata({
    locale: locale as Locale,
    route: 'desarrolloWeb',
    // Se lee como resultado de búsqueda, no como eslogan: qué es, con qué,
    // dónde. Distinto de las páginas de SEO, automatización y dashboards.
    title: en
      ? 'Next.js & Firebase Web Development'
      : 'Desarrollo web con Next.js y Firebase',
    description: en
      ? 'Web apps built with Next.js and Firebase: SSR/ISR, strict TypeScript, Firestore, Auth and Vercel deploys. Technical SEO from the first commit.'
      : 'Aplicaciones web con Next.js y Firebase: SSR/ISR, TypeScript estricto, Firestore, Auth y deploy en Vercel. SEO técnico desde el primer commit.',
  })
}

export default async function DesarrolloWebPage({ params }: Props) {
  const { locale: rawLocale } = await params
  setRequestLocale(rawLocale)

  const locale = rawLocale as Locale
  const en = locale === 'en'

  const t = await getTranslations('servicePages.desarrolloWeb')
  const tn = await getTranslations('nav')
  const ts = await getTranslations('services')

  // Un solo registro alimenta el copy, el schema y los enlaces internos, así
  // que la página y sus datos estructurados no pueden desincronizarse.
  const service = getServiceById(locale, 'nextjs-firebase')
  if (!service) notFound()

  const Icon = service.icon

  // Dos hermanos, en orden de catálogo. Nunca este mismo servicio.
  const related = getServices(locale)
    .filter((item) => item.id !== service.id)
    .slice(0, 2)

  // La etiqueta de la miga es corta a propósito, y es la MISMA cadena en la
  // ruta visible y en el markup de BreadcrumbList de abajo.
  const crumbLabel = en ? 'Web Development' : 'Desarrollo Web'

  // El gradiente cae sólo sobre la parte tecnológica del título; recortar el
  // h1 completo le cuesta legibilidad. El corte se calcula sobre la misma
  // clave del catálogo, así que el texto visible nunca se desincroniza de
  // messages/*.json: si la clave dejara de mencionar Next.js, el título
  // entero se renderiza plano en lugar de perder una palabra.
  const rawTitle = t('title')
  const accentAt = rawTitle.indexOf('Next.js')
  const titleLead = accentAt > 0 ? rawTitle.slice(0, accentAt) : rawTitle
  const titleAccent = accentAt > 0 ? rawTitle.slice(accentAt) : ''

  const stackGroups = en
    ? [
        {
          label: 'Frontend',
          items: ['Next.js 16 (App Router)', 'React 19', 'TypeScript', 'Tailwind CSS'],
        },
        {
          label: 'Data & backend',
          items: ['Firebase', 'Firestore', 'Firebase Auth', 'Cloud Functions', 'Node.js', 'PostgreSQL'],
        },
        {
          label: 'Infrastructure & quality',
          items: ['Vercel', 'CI/CD', 'Git', 'Lighthouse', 'Schema.org / JSON-LD'],
        },
      ]
    : [
        {
          label: 'Frontend',
          items: ['Next.js 16 (App Router)', 'React 19', 'TypeScript', 'Tailwind CSS'],
        },
        {
          label: 'Datos y backend',
          items: ['Firebase', 'Firestore', 'Firebase Auth', 'Cloud Functions', 'Node.js', 'PostgreSQL'],
        },
        {
          label: 'Infraestructura y calidad',
          items: ['Vercel', 'CI/CD', 'Git', 'Lighthouse', 'Schema.org / JSON-LD'],
        },
      ]

  return (
    <>
      {/* ItemPage + Service + BreadcrumbList + FAQPage. El FAQ es el de este
          servicio — el FAQ del sitio pertenece a la home, y dos URLs no deben
          responder la misma consulta. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateServicePageGraph(
              locale,
              service,
              [
                { name: en ? 'Home' : 'Inicio', route: 'home' },
                { name: tn('services'), route: 'services' },
                { name: crumbLabel, route: 'desarrolloWeb' },
              ],
              service.faq
            )
          ),
        }}
      />

      {/* ══ CABECERA ══════════════════════════════════════════════
          Dos capas decorativas, ambas en -z-10 y ninguna captura eventos: la
          malla de blobs animada y la cuadrícula que se desvanece. Las dos
          exigen que el contenedor sea `relative isolate overflow-hidden`. */}
      <section className="relative isolate overflow-hidden border-b border-hairline">
        <div className="mesh" aria-hidden="true" />
        <div className="grid-fade" aria-hidden="true" />

        <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
          <Breadcrumbs
            className="enter"
            items={[
              { label: tn('services'), href: '/servicios' },
              { label: crumbLabel },
            ]}
          />

          <div className="mt-10 max-w-3xl">
            {/* El badge de ícono ancla la página al mismo lenguaje que la
                tarjeta de este servicio en la home. */}
            <div className="enter-scale flex items-center gap-4">
              <span
                className="grad-fill inline-flex size-14 shrink-0 items-center justify-center rounded-2xl shadow-glow-brand"
                aria-hidden="true"
              >
                <Icon className="size-7" />
              </span>
              <p className="eyebrow">
                {en ? 'Service · Web development' : 'Servicio · Desarrollo web'}
              </p>
            </div>

            <h1 className="enter-blur step-1 mt-7 text-d1 text-ink">
              {titleLead}
              {titleAccent && <span className="grad-text">{titleAccent}</span>}
            </h1>

            <p className="enter step-2 mt-6 text-lead text-ink-muted">
              {t('subtitle')}
            </p>

            <div className="enter step-3 mt-9 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="sheen shadow-glow-brand">
                <Link href="/contacto">
                  {t('ctaMain')}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/servicios">{ts('allServices')}</Link>
              </Button>
            </div>

            <p className="enter step-4 mt-6 flex items-center gap-2.5 text-sm text-ink-subtle">
              <span className="ping" aria-hidden="true" />
              {en
                ? `From ${NAP.localityEn}, for teams in any time zone. Spanish or English.`
                : `Desde ${NAP.locality}, para equipos en cualquier zona horaria. En español o inglés.`}
            </p>
          </div>
        </div>
      </section>

      {/* ══ POR QUÉ IMPORTA ═══════════════════════════════════════ */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="reveal">
          <p className="eyebrow">{en ? 'Context' : 'Contexto'}</p>
          <h2 className="mt-5 text-d1 text-ink">{t('whyTitle')}</h2>
        </div>

        <div className="prose-rich reveal mt-8">
          <p>
            {en
              ? 'Every web project I build starts with the same question: what does Google need to see, and what does the user need to do? The answer shapes everything — rendering strategy, data fetching, URL structure, component architecture.'
              : 'Cada proyecto web que construyo empieza con la misma pregunta: ¿qué necesita ver Google, y qué necesita hacer el usuario? La respuesta define todo — estrategia de renderizado, data fetching, estructura de URLs, arquitectura de componentes.'}
          </p>
          <p>
            {en
              ? 'I use Next.js because it is the only framework that lets me choose SSR, SSG or ISR per page — the right rendering strategy for each kind of content. Combined with Firebase for the database, authentication and serverless functions, it is the stack that gives the most value per engineering hour instead of the most lines of code.'
              : 'Uso Next.js porque es el único framework que me permite elegir SSR, SSG o ISR por página — la estrategia de renderizado correcta para cada tipo de contenido. Combinado con Firebase para base de datos, autenticación y funciones serverless, es el stack que da más valor por hora de ingeniería, no más líneas de código.'}
          </p>
          <p>
            {en
              ? 'The part almost nobody quotes for is the migration: mapping the old URLs, deciding what earns a 301 and what is allowed to die, and revalidating structured data once the new site is live. If your site already has traffic, that work is the difference between a launch and a drop in positions that takes months to recover.'
              : 'La parte que casi nadie cotiza es la migración: mapear las URLs viejas, decidir qué se redirige con 301 y qué se deja morir, y revalidar los datos estructurados una vez que el sitio nuevo está en producción. Si tu sitio ya tiene tráfico, ese trabajo es la diferencia entre un lanzamiento y una caída de posiciones que tarda meses en recuperarse.'}
          </p>
        </div>
      </section>

      {/* ══ QUÉ CONSTRUYO ═════════════════════════════════════════ */}
      <section className="border-y border-hairline bg-ground-tint">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">{ts('benefits')}</p>
            <h2 className="mt-5 text-d1 text-ink">{t('whatTitle')}</h2>
            <p className="mt-4 text-lead text-ink-muted">{service.headline}</p>
          </div>

          {/* Los beneficios no son secuenciales, así que llevan la barra de
              gradiente y no un número: los números quedan reservados para el
              proceso, que sí tiene orden. */}
          <ul className="reveal-stagger mt-14 grid gap-6 md:grid-cols-3">
            {service.benefits.map((benefit) => (
              <li key={benefit} className="card card-hover p-6">
                <span
                  className="grad-fill block h-1 w-12 rounded-full"
                  aria-hidden="true"
                />
                <p className="mt-5 text-ink">{benefit}</p>
              </li>
            ))}
          </ul>

          {/* Resultados, no características: qué es medible diferente después. */}
          <div className="reveal card mt-12 p-6 sm:p-8">
            <h3 className="text-d3 text-ink">
              {en ? 'What is different afterwards' : 'Qué cambia después'}
            </h3>
            <ul className="mt-6 grid gap-x-10 gap-y-4 sm:grid-cols-2">
              {service.outcomes.map((outcome) => (
                <li key={outcome} className="flex gap-3 text-ink-muted">
                  <Check
                    className="mt-1 size-4 shrink-0 text-violet"
                    aria-hidden="true"
                  />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ══ CÓMO CORRE EL PROYECTO ════════════════════════════════ */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="reveal max-w-2xl">
          <p className="eyebrow">{ts('process')}</p>
          <h2 className="mt-5 text-d1 text-ink">
            {en
              ? 'How a build runs, phase by phase'
              : 'Cómo corre el proyecto, fase por fase'}
          </h2>
        </div>

        {/* Es secuencial, así que una lista ordenada le gana a una rejilla de
            tarjetas: el número manda y se lee de arriba abajo. */}
        <ol className="reveal-stagger mt-14 border-t border-hairline">
          {service.process.map((step, index) => (
            <li
              key={step.title}
              className="grid gap-3 border-b border-hairline py-8 sm:grid-cols-[5rem_minmax(0,1fr)] sm:gap-8"
            >
              <span
                className="grad-text font-display text-4xl font-bold leading-none sm:text-5xl"
                data-numeric=""
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="text-d3 text-ink">{step.title}</h3>
                <p className="mt-3 max-w-[68ch] leading-relaxed text-ink-muted">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ══ ENCAJE / NO ENCAJE ════════════════════════════════════
          La segunda columna es el punto de esta sección. Lleva la misma
          tarjeta, el mismo ancho, el mismo tamaño de tipo y el mismo ritmo que
          la primera — una limitación degradada visualmente deja de ser una
          limitación. */}
      <section className="border-y border-hairline bg-ground-tint">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">{en ? 'Fit' : 'Encaje'}</p>
            <h2 className="mt-5 text-d1 text-ink">
              {en
                ? 'Who this is for, and who it is not'
                : 'Para quién es esto, y para quién no'}
            </h2>
            <p className="mt-4 text-lead text-ink-muted">
              {en
                ? 'The second list is the useful one. If you recognise yourself there, I will say so on the first call instead of writing you a proposal.'
                : 'La segunda lista es la útil. Si te reconoces ahí, te lo digo en la primera llamada en lugar de mandarte una propuesta.'}
            </p>
          </div>

          <div className="reveal-stagger mt-14 grid gap-6 lg:grid-cols-2">
            <div className="card p-6 sm:p-8">
              <h3 className="text-d3 text-ink">
                {en ? 'Who this is for' : 'Para quién es'}
              </h3>
              <ul className="mt-6">
                {service.forWhom.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 border-t border-hairline py-4 text-ink-muted first:border-t-0 first:pt-0"
                  >
                    <Check
                      className="mt-1 size-4 shrink-0 text-violet"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-6 sm:p-8">
              <h3 className="text-d3 text-ink">
                {en ? 'Who this is not for' : 'Para quién no es'}
              </h3>
              <ul className="mt-6">
                {service.notFor.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 border-t border-hairline py-4 text-ink-muted first:border-t-0 first:pt-0"
                  >
                    {/* El encabezado y la X dicen lo mismo que el color, así
                        que nada se comunica sólo con color. */}
                    <X
                      className="mt-1 size-4 shrink-0 text-ink-subtle"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ══ ENTREGABLES COMPLETOS ═════════════════════════════════ */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="reveal max-w-2xl">
          <p className="eyebrow">{ts('includes')}</p>
          <h2 className="mt-5 text-d1 text-ink">{t('deliverablesTitle')}</h2>
          <p className="mt-4 text-lead text-ink-muted">
            {en
              ? 'Every engagement ships all of it. Anything outside the list is quoted before it gets built.'
              : 'Todo proyecto entrega esto completo. Lo que quede fuera de la lista se cotiza antes de construirlo.'}
          </p>
        </div>

        {/* Un panel con dos columnas de filas. El divisor se apaga en la primera
            fila de cada columna, así que ninguna línea queda colgando del borde
            superior del panel. */}
        <ul className="reveal card mt-12 grid gap-x-10 px-6 py-2 sm:grid-cols-2 sm:px-8">
          {service.includes.map((item) => (
            <li
              key={item}
              className="flex gap-3 border-t border-hairline py-4 text-ink-muted first:border-t-0 sm:[&:nth-child(2)]:border-t-0"
            >
              <Check
                className="mt-1 size-4 shrink-0 text-violet"
                aria-hidden="true"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ══ STACK ═════════════════════════════════════════════════ */}
      <section className="border-y border-hairline bg-ground-tint">
        <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">{t('toolsTitle')}</p>
            <h2 className="mt-5 text-d1 text-ink">
              {en ? 'The stack this runs on' : 'El stack con el que corre'}
            </h2>
          </div>

          <dl className="reveal-stagger mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stackGroups.map((group) => (
              <div key={group.label} className="card p-5">
                <dt className="text-sm font-bold tracking-wide text-ink">
                  {group.label}
                </dt>
                <dd className="mt-3 flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <Badge key={item} variant="neutral">
                      {item}
                    </Badge>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ══ FAQ ═══════════════════════════════════════════════════ */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-20">
          <div className="reveal">
            <p className="eyebrow">FAQ</p>
            <h2 className="mt-5 text-d1 text-ink">{t('faqTitle')}</h2>
            <p className="mt-4 text-ink-muted">
              {en
                ? 'What people ask before starting a build.'
                : 'Lo que me preguntan antes de arrancar un desarrollo.'}
            </p>
          </div>

          {/* <details> nativo: las respuestas están en el HTML del servidor,
              que es exactamente lo que declara el markup FAQPage de arriba. */}
          <div className="reveal rounded-2xl border border-hairline bg-surface px-5 shadow-lift-1 sm:px-7">
            {service.faq.map((faq) => (
              <Disclosure
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══ SERVICIOS RELACIONADOS ════════════════════════════════ */}
      <section className="border-t border-hairline bg-ground-tint">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">{ts('eyebrow')}</p>
            <h2 className="mt-5 text-d1 text-ink">{t('relatedTitle')}</h2>
            <p className="mt-4 text-lead text-ink-muted">
              {en
                ? 'A build almost always travels with one of these two.'
                : 'Un desarrollo casi siempre viaja con uno de estos dos.'}
            </p>
          </div>

          <ul className="reveal-stagger mt-12 grid gap-6 md:grid-cols-2">
            {related.map((item) => {
              const RelatedIcon = item.icon
              return (
                <li key={item.id}>
                  <Link
                    href={servicePath(item, locale) as '/seo-tecnico'}
                    className="card card-hover group flex h-full flex-col p-6 sm:p-7"
                  >
                    <span
                      className="grad-fill inline-flex size-12 items-center justify-center rounded-xl shadow-glow-brand"
                      aria-hidden="true"
                    >
                      <RelatedIcon className="size-6" />
                    </span>

                    <h3 className="mt-5 text-d3 text-ink transition-colors group-hover:text-brand-strong">
                      {item.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm text-ink-muted">
                      {item.headline}
                    </p>

                    <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-strong">
                      {ts('viewService')}
                      <ArrowUpRight
                        className="size-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>

          <p className="reveal mt-8 text-ink-muted">
            {en ? 'Or review ' : 'O revisa '}
            <Link
              href="/servicios"
              className="font-semibold text-brand-strong underline underline-offset-4"
            >
              {en
                ? 'all four services and how they combine'
                : 'los cuatro servicios y cómo se combinan'}
            </Link>
            {en ? ' before deciding.' : ' antes de decidir.'}
          </p>
        </div>
      </section>

      {/* ══ CTA FINAL ═════════════════════════════════════════════ */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="grad-animate reveal-scale relative overflow-hidden rounded-3xl px-6 py-14 shadow-lift-3 sm:px-12 sm:py-20">
          <div className="relative max-w-2xl">
            <h2 className="text-d1 text-white">
              {en
                ? 'Tell me what you need to build.'
                : 'Cuéntame qué necesitas construir.'}
            </h2>
            <p className="mt-5 text-lead text-white/85">
              {en
                ? 'Send the URL, the stack you are on today, and what has to be live by when. I reply within 24 to 48 business hours.'
                : 'Mándame la URL, el stack en el que estás hoy y qué tiene que estar en producción y para cuándo. Respondo en 24 a 48 horas hábiles.'}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              {/* Sobre el gradiente el botón se invierte: `bg-none` apaga la
                  imagen del variant y deja superficie blanca con texto de
                  marca. Un relleno de marca aquí desaparecería. */}
              <Button
                asChild
                size="lg"
                className="sheen bg-none bg-surface text-brand-strong"
              >
                <Link href="/contacto">
                  {t('ctaMain')}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Link
                href="/servicios"
                className="text-sm font-semibold text-white underline decoration-white/50 underline-offset-4 transition-colors hover:decoration-white"
              >
                {t('ctaSecondary')}
              </Link>
            </div>

            <p className="mt-7 text-sm text-white/80">
              {t('ctaNote')}{' '}
              <a
                href={`mailto:${NAP.email}`}
                className="font-semibold text-white underline underline-offset-4"
              >
                {NAP.email}
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
