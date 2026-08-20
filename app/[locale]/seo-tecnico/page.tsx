import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ArrowRight, ArrowUpRight, Check, X } from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Disclosure } from '@/components/ui/disclosure'
import { getServiceById } from '@/data/services'
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
    route: 'seoTecnico',
    // Se lee como resultado de búsqueda, no como eslogan, y no comparte
    // fraseo con el título de la home (que abre con la marca personal en
    // lugar del servicio).
    title: en
      ? 'Technical SEO Audits & Consulting'
      : 'Auditoría de SEO técnico en México',
    description: en
      ? 'Technical SEO audits from Mexico City: indexation, Schema.org JSON-LD, Core Web Vitals, hreflang and Next.js migrations. Findings ranked by impact.'
      : 'Auditoría de SEO técnico desde Ciudad de México: indexación, Schema.org JSON-LD, Core Web Vitals, hreflang y migraciones a Next.js sin perder tráfico.',
  })
}

export default async function SeoTecnicoPage({ params }: Props) {
  const { locale: rawLocale } = await params
  setRequestLocale(rawLocale)

  const locale = rawLocale as Locale
  const en = locale === 'en'

  // La página y su JSON-LD leen de UN solo registro, así que el texto
  // renderizado y los datos estructurados no pueden separarse.
  const service = getServiceById(locale, 'seo-tecnico')
  if (!service) notFound()

  const t = await getTranslations('servicePages.seoTecnico')
  const tn = await getTranslations('nav')
  // La misma clave del catálogo que usa el componente Breadcrumbs para su
  // propia miga de Inicio, así el markup no puede separarse de la etiqueta
  // visible.
  const tb = await getTranslations('breadcrumbs')

  /** El ícono del servicio, el mismo que lo identifica en la home. */
  const Icon = service.icon

  /**
   * Etiqueta corta de la ruta, compartida por la miga visible y por el nodo
   * BreadcrumbList de abajo. Una constante, así las dos nunca discrepan.
   */
  const crumbLabel = en ? 'Technical SEO' : 'SEO Técnico'

  /**
   * El gradiente cae solo sobre las dos últimas palabras del título —
   * las que ubican el servicio— y el resto conserva el contraste de --ink.
   * El corte se deriva del catálogo en lugar de reescribir el título aquí,
   * así que traducirlo no rompe nada y no hay copia que se desincronice.
   */
  const titleWords = t('title').split(' ')
  const accentFrom = Math.max(1, titleWords.length - 2)
  const titleLead = titleWords.slice(0, accentFrom).join(' ')
  const titleAccent = titleWords.slice(accentFrom).join(' ')

  /**
   * Las herramientas que de verdad se usan en un proyecto. Se nombran porque
   * "metodología propia" no es un entregable: el cliente tiene que poder
   * reproducir cada hallazgo con las mismas herramientas.
   */
  const tools = [
    'Google Search Console',
    'Rich Results Test',
    'Schema Markup Validator',
    'Lighthouse',
    'PageSpeed Insights',
    'Chrome UX Report',
    'Screaming Frog',
    'Chrome DevTools',
    'Next.js',
    'Vercel Analytics',
  ]

  /**
   * Páginas hermanas de servicio. Los títulos salen de los registros en lugar
   * de reescribirse aquí, así el texto del enlace se mantiene descriptivo y
   * sincronizado.
   */
  const related = (
    [
      ['/desarrollo-web', getServiceById(locale, 'nextjs-firebase')],
      ['/dashboards', getServiceById(locale, 'dashboards')],
    ] as const
  ).flatMap(([href, sibling]) =>
    sibling ? [{ href, title: sibling.title, headline: sibling.headline }] : []
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateServicePageGraph(
              locale,
              service,
              // Refleja exactamente la ruta visible, Inicio incluido: el
              // componente renderiza esa miga por su cuenta, el markup tiene
              // que declararla.
              [
                { name: tb('home'), route: 'home' },
                { name: tn('services'), route: 'services' },
                { name: crumbLabel, route: 'seoTecnico' },
              ],
              // Las preguntas de este servicio, no el FAQ del sitio: dos URLs
              // respondiendo la misma consulta compiten entre sí.
              service.faq
            )
          ),
        }}
      />

      {/* ══ CABECERA ══════════════════════════════════════════════
          Dos capas decorativas, ambas en -z-10 dentro de un contenedor
          `relative isolate`: la malla animada y la cuadrícula que se
          desvanece. Ninguna captura eventos.                          */}
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
            {/* El ícono del servicio a tamaño grande, con el gradiente firma:
                es la primera señal de en qué página está el lector. */}
            <div className="flex flex-wrap items-center gap-4">
              <span
                className="grad-fill enter-scale inline-flex size-14 items-center justify-center rounded-2xl shadow-glow-brand sm:size-16"
                aria-hidden="true"
              >
                <Icon className="size-7 sm:size-8" />
              </span>
              <p className="eyebrow enter-scale step-1">
                {en
                  ? 'Technical SEO · Mexico City'
                  : 'SEO Técnico · Ciudad de México'}
              </p>
            </div>

            <h1 className="enter-blur step-2 mt-7 text-d1 text-ink">
              {titleLead} <span className="grad-text">{titleAccent}</span>
            </h1>

            <p className="enter step-3 mt-6 text-lead text-ink-muted">
              {t('subtitle')}
            </p>

            <div className="enter step-4 mt-9 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="sheen shadow-glow-brand">
                <Link href="/contacto">
                  {t('ctaMain')}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/servicios">
                  {en ? 'See all four services' : 'Ver los cuatro servicios'}
                </Link>
              </Button>
            </div>

            <p className="enter step-5 mt-6 flex items-center gap-2.5 text-sm text-ink-subtle">
              <span className="ping" aria-hidden="true" />
              {en
                ? `Based in ${NAP.localityEn}. Remote work with teams in any time zone.`
                : `Con base en ${NAP.locality}. Trabajo remoto con equipos en cualquier zona horaria.`}
            </p>
          </div>
        </div>
      </section>

      {/* ══ POR QUÉ IMPORTA ═══════════════════════════════════════ */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="reveal max-w-2xl">
          <p className="eyebrow">{en ? 'The problem' : 'El problema'}</p>
          <h2 className="mt-5 text-d1 text-ink">{t('whyTitle')}</h2>
        </div>

        <div className="prose-rich reveal mt-8">
          <p>
            {en
              ? 'A beautiful site that Google cannot crawl, understand, or index is invisible. Technical SEO is the engineering layer that makes a search engine — and now a language model — see your content the way a person does: fast, structured, and unambiguous.'
              : 'Un sitio bonito que Google no puede rastrear, entender ni indexar es invisible. El SEO técnico es la capa de ingeniería que hace que un buscador —y hoy también un modelo de lenguaje— vea tu contenido como lo ve una persona: rápido, estructurado y sin ambigüedad.'}
          </p>
          <p>
            {en
              ? 'I have seen migrations drop a site’s organic traffic because nobody mapped the old URLs before shipping. I have audited platforms where half a template was blocked in robots.txt for months and nobody noticed, because the site looked perfect in a browser. These are engineering defects, so I look for them the way an engineer would: in the repository, in the response headers, and in the HTML that is actually served — not against a generic checklist.'
              : 'He visto migraciones tirar el tráfico orgánico de un sitio porque nadie mapeó las URLs viejas antes de desplegar. He auditado plataformas donde media plantilla llevaba meses bloqueada en robots.txt y nadie lo había notado, porque el sitio se veía perfecto desde el navegador. Son defectos de ingeniería, así que los busco como ingeniero: en el repositorio, en los encabezados de respuesta y en el HTML que de verdad se sirve — no contra un checklist genérico.'}
          </p>
          <p>
            {en
              ? 'It is also why this work does not always end in an audit. If the diagnosis points at content or at authority rather than at the stack, I say so on the first call. That is cheaper for both of us than a deliverable that was never going to move anything.'
              : 'También es la razón por la que este trabajo no siempre termina en una auditoría. Si el diagnóstico apunta a contenido o a autoridad y no al stack, lo digo en la primera llamada. Sale más barato para los dos que un entregable que nunca iba a mover nada.'}
          </p>
        </div>
      </section>

      {/* ══ QUÉ ENTREGO ═══════════════════════════════════════════ */}
      <section className="border-y border-hairline bg-ground-tint">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">{en ? 'Scope' : 'Alcance'}</p>
            <h2 className="mt-5 text-d1 text-ink">{t('whatTitle')}</h2>
            <p className="mt-4 text-lead text-ink-muted">{service.headline}</p>
          </div>

          <ul className="reveal-stagger mt-14 grid gap-6 md:grid-cols-3">
            {service.benefits.map((benefit) => (
              <li key={benefit} className="card card-hover p-6">
                <span
                  className="grad-fill block h-1 w-12 rounded-full"
                  aria-hidden="true"
                />
                <p className="mt-5 text-ink-muted">{benefit}</p>
              </li>
            ))}
          </ul>

          {/* Los resultados van en un panel aparte: son la consecuencia del
              alcance de arriba, no otro punto de la misma lista. */}
          <div className="reveal card mt-12 p-6 sm:p-8">
            <h3 className="text-d3 text-ink">
              {en ? 'What changes afterwards' : 'Qué cambia después'}
            </h3>
            <ul className="mt-6 grid gap-x-10 gap-y-4 lg:grid-cols-2">
              {service.outcomes.map((outcome) => (
                <li key={outcome} className="flex gap-3.5">
                  <Check
                    className="mt-1 size-4 shrink-0 text-violet"
                    aria-hidden="true"
                  />
                  <span className="text-ink-muted">{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ══ PROCESO ═══════════════════════════════════════════════ */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="reveal max-w-2xl">
          <p className="eyebrow">{en ? 'Process' : 'Proceso'}</p>
          <h2 className="mt-5 text-d1 text-ink">
            {en ? 'How the work runs' : 'Cómo se ejecuta el trabajo'}
          </h2>
        </div>

        {/* Ordenado y numerado: la secuencia es el punto. Los números llevan el
            gradiente y cargan la jerarquía, así que no hacen falta tarjetas. */}
        <ol className="reveal-stagger mt-14 grid gap-x-12 gap-y-12 sm:grid-cols-2">
          {service.process.map((step, index) => (
            <li key={step.title}>
              <span
                className="grad-text font-display text-5xl font-bold leading-none"
                data-numeric=""
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-4 text-d3 text-ink">{step.title}</h3>
              <p className="mt-3 max-w-[62ch] leading-relaxed text-ink-muted">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* ══ SÍ ENCAJA / NO ENCAJA ═════════════════════════════════
          Mismo ancho y mismo peso tipográfico a propósito. Las limitaciones
          son el diferenciador, así que reciben el mismo espacio que el
          argumento de venta y no se suavizan. */}
      <section className="border-y border-hairline bg-ground-tint">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="reveal-stagger grid gap-6 lg:grid-cols-2">
            <div className="card p-6 sm:p-8">
              <p className="eyebrow">{en ? 'Good fit' : 'Sí encaja'}</p>
              <h2 className="mt-5 text-d3 text-ink">
                {en ? 'Who this is for' : 'Para quién es'}
              </h2>
              <ul className="mt-6">
                {service.forWhom.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3.5 border-b border-hairline py-4 last:border-0 last:pb-0"
                  >
                    <Check
                      className="mt-1 size-4 shrink-0 text-violet"
                      aria-hidden="true"
                    />
                    <span className="text-ink-muted">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-6 sm:p-8">
              <p className="eyebrow">{en ? 'Not a fit' : 'No encaja'}</p>
              <h2 className="mt-5 text-d3 text-ink">
                {en ? 'Who this is not for' : 'Para quién no es'}
              </h2>
              <ul className="mt-6">
                {service.notFor.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3.5 border-b border-hairline py-4 last:border-0 last:pb-0"
                  >
                    {/* La forma del ícono, no su color, es lo que distingue
                        esta lista de la anterior: el estado nunca se comunica
                        solo con color. */}
                    <X
                      className="mt-1 size-4 shrink-0 text-ink-subtle"
                      aria-hidden="true"
                    />
                    <span className="text-ink-muted">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-ink-subtle">
                {en
                  ? 'If one of those describes your situation, say so in the first message and we save each other a proposal.'
                  : 'Si algo de eso describe tu situación, dímelo en el primer mensaje y nos ahorramos una propuesta.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ ENTREGABLES + HERRAMIENTAS ════════════════════════════ */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-20">
          <div className="reveal">
            <p className="eyebrow">{en ? 'Deliverables' : 'Entregables'}</p>
            <h2 className="mt-5 text-d1 text-ink">{t('deliverablesTitle')}</h2>
            <p className="mt-4 text-ink-muted">
              {en
                ? 'Written, versioned, and yours to keep — including the reasoning behind each recommendation.'
                : 'Por escrito, versionado y tuyo — incluido el razonamiento detrás de cada recomendación.'}
            </p>
          </div>

          <ul className="reveal card px-6 py-2 sm:px-8">
            {service.includes.map((item) => (
              <li
                key={item}
                className="flex gap-4 border-b border-hairline py-5 last:border-0"
              >
                <Check
                  className="mt-1 size-4 shrink-0 text-violet"
                  aria-hidden="true"
                />
                <span className="text-ink-muted">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="reveal mt-16 border-t border-hairline pt-12">
          <h2 className="text-d3 text-ink">{t('toolsTitle')}</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {tools.map((tool) => (
              <Badge key={tool} variant="neutral">
                {tool}
              </Badge>
            ))}
          </div>
          <p className="mt-6 max-w-[68ch] text-sm text-ink-subtle">
            {en
              ? 'Standard tooling, named on purpose: every finding in the report can be reproduced by your team with the same tools, without taking my word for it.'
              : 'Herramientas estándar, y las nombro a propósito: cualquier hallazgo del reporte lo puede reproducir tu equipo con las mismas herramientas, sin tener que creerme.'}
          </p>
        </div>
      </section>

      {/* ══ FAQ ═══════════════════════════════════════════════════ */}
      <section className="border-y border-hairline bg-ground-tint">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-20">
            <div className="reveal">
              <p className="eyebrow">FAQ</p>
              <h2 className="mt-5 text-d1 text-ink">{t('faqTitle')}</h2>
            </div>

            {/* Se renderiza del mismo arreglo con el que se construye el nodo
                FAQPage, así la respuesta visible y la del markup son una. */}
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
        </div>
      </section>

      {/* ══ SERVICIOS RELACIONADOS ════════════════════════════════ */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="reveal max-w-2xl">
          <p className="eyebrow">{en ? 'Services' : 'Servicios'}</p>
          <h2 className="mt-5 text-d1 text-ink">{t('relatedTitle')}</h2>
          <p className="mt-4 text-lead text-ink-muted">
            {en
              ? 'Technical SEO usually arrives with a build or a measurement problem attached. These two are where that work continues.'
              : 'El SEO técnico casi nunca llega solo: suele venir con un desarrollo o una medición pendiente. Estos dos servicios son donde continúa ese trabajo.'}
          </p>
        </div>

        <ul className="reveal-stagger mt-12 grid gap-6 md:grid-cols-2">
          {related.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="card card-hover group flex h-full flex-col p-6 sm:p-7"
              >
                <h3 className="text-d3 text-ink transition-colors group-hover:text-brand-strong">
                  {item.title}
                </h3>
                <p className="mt-2 flex-1 text-sm text-ink-muted">
                  {item.headline}
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-strong">
                  {en ? 'Read the service' : 'Ver el servicio'}
                  <ArrowUpRight
                    className="size-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="reveal mt-8 text-ink-muted">
          {en ? 'Or compare ' : 'O compara '}
          <Link
            href="/servicios"
            className="font-semibold text-brand-strong underline underline-offset-4 transition-colors hover:text-violet-strong"
          >
            {en
              ? 'the four services side by side'
              : 'los cuatro servicios uno al lado del otro'}
          </Link>
          {en
            ? ' before deciding where to start.'
            : ' antes de decidir por dónde empezar.'}
        </p>
      </section>

      {/* ══ CTA FINAL ═════════════════════════════════════════════ */}
      <section className="mx-auto w-full max-w-6xl px-5 pb-20 pt-4 sm:px-8 sm:pb-24 sm:pt-6">
        <div className="grad-animate reveal-scale relative overflow-hidden rounded-3xl px-6 py-14 shadow-lift-3 sm:px-12 sm:py-20">
          <div className="relative max-w-2xl">
            <h2 className="text-d1 text-white">
              {en
                ? 'Send me the URL and what changed.'
                : 'Mándame la URL y qué cambió.'}
            </h2>
            <p className="mt-5 text-lead text-white/85">
              {en
                ? 'Search Console access helps, but it is not required to start. I reply with a first read on what is likely going on and whether an audit is even the right next step.'
                : 'Ayuda tener acceso a Search Console, pero no es requisito para empezar. Te respondo con una primera lectura de lo que probablemente está pasando y si una auditoría es siquiera el siguiente paso correcto.'}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              {/* Sobre el gradiente el botón se invierte: superficie blanca con
                  texto de marca. `bg-none` apaga el relleno con gradiente del
                  variant, que aquí desaparecería contra el fondo. */}
              <Button
                asChild
                size="lg"
                className="sheen bg-none bg-surface text-brand-strong hover:bg-white"
              >
                <Link href="/contacto">
                  {t('ctaSecondary')}
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

            <p className="mt-7 text-sm text-white/75">{t('ctaNote')}</p>
          </div>
        </div>
      </section>
    </>
  )
}
