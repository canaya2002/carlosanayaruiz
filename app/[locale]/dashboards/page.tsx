import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ArrowRight, ArrowUpRight, Check, LayoutGrid, X } from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Disclosure } from '@/components/ui/disclosure'
import { getServiceById } from '@/data/services'
import { NAP } from '@/lib/constants'
import { generatePageMetadata } from '@/lib/seo'
import { generateServicePageGraph, type BreadcrumbItem } from '@/lib/schema'
import { Locale } from '@/data/types'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const en = locale === 'en'

  return generatePageMetadata({
    locale: locale as Locale,
    route: 'dashboards',
    // Se lee como resultado de búsqueda, no como eslogan, y no comparte fraseo
    // con las otras tres páginas de servicio: así las cuatro nunca compiten
    // por la misma consulta.
    title: en
      ? 'Custom Dashboards and Analytics'
      : 'Dashboards a medida y analítica',
    description: en
      ? 'Dashboards wired to your real data sources: React and Next.js with Recharts and D3, plus Power BI and DAX. Defined metrics, readable on a phone.'
      : 'Dashboards conectados a tus fuentes de datos reales: React y Next.js con Recharts y D3, más Power BI y DAX. Métricas definidas y lectura en celular.',
  })
}

export default async function DashboardsPage({ params }: Props) {
  const { locale: rawLocale } = await params
  setRequestLocale(rawLocale)

  const locale = rawLocale as Locale
  const en = locale === 'en'

  // Un solo registro alimenta el copy, el schema y la URL. Si el id dejara de
  // resolver, la página devuelve 404 en lugar de renderizar un cascarón vacío.
  const service = getServiceById(locale, 'dashboards')
  if (!service) notFound()

  const t = await getTranslations('servicePages.dashboards')
  const tn = await getTranslations('nav')
  const ts = await getTranslations('services')

  const Icon = service.icon

  // El gradiente cae solo sobre el último tramo del título — el que nombra la
  // analítica — igual que en la home, que recorta media frase y no el h1
  // completo. El texto sale de una sola clave del catálogo y se parte por el
  // conector; si la clave cambiara y no lo tuviera, `titleHead` queda vacío y
  // el título se renderiza entero, nunca cortado a media palabra.
  const joiner = en ? ' and ' : ' y '
  const title = t('title')
  const splitAt = title.lastIndexOf(joiner)
  const titleHead = splitAt === -1 ? '' : title.slice(0, splitAt + joiner.length)
  const titleAccent =
    splitAt === -1 ? title : title.slice(splitAt + joiner.length)

  // La ruta visible y el markup de BreadcrumbList se construyen uno junto al
  // otro a propósito: tres niveles en ambos, en el mismo orden y con las
  // mismas etiquetas.
  const crumb = 'Dashboards'
  const schemaTrail: BreadcrumbItem[] = [
    { name: en ? 'Home' : 'Inicio', route: 'home' },
    { name: tn('services'), route: 'services' },
    { name: crumb, route: 'dashboards' },
  ]

  // Hermanos que vale la pena clicar desde aquí: la app donde suele vivir el
  // dashboard, y la automatización que mantiene sus datos llegando sin que
  // nadie los pegue a mano.
  const siblings = (
    [
      ['nextjs-firebase', '/desarrollo-web'],
      ['ai-automation', '/automatizacion-ia'],
    ] as const
  ).flatMap(([id, href]) => {
    const sibling = getServiceById(locale, id)
    return sibling ? [{ service: sibling, href }] : []
  })

  // Solo herramientas que aparecen en data/skills.ts o en el FAQ de este mismo
  // servicio — la lista de stack es una afirmación como cualquier otra.
  const toolGroups = [
    {
      label: en ? 'Visualization' : 'Visualización',
      tools: ['Recharts', 'D3.js', 'Chart.js', 'Plotly'],
    },
    {
      label: en ? 'Application' : 'Aplicación',
      tools: ['React', 'Next.js', 'TypeScript', 'Node.js'],
    },
    {
      label: en ? 'Data sources' : 'Fuentes de datos',
      tools: [
        'PostgreSQL',
        'MySQL',
        'MongoDB',
        'Firebase',
        'SQL Server',
        'GraphQL',
        en ? 'REST APIs' : 'APIs REST',
      ],
    },
    {
      label: en ? 'BI and modelling' : 'BI y modelado',
      tools: ['Power BI', 'DAX', 'SQL', 'Pandas', 'ETL'],
    },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            // Las preguntas PROPIAS del servicio. El FAQ del sitio pertenece a
            // la home; repetirlo aquí pondría dos URLs sobre una consulta.
            generateServicePageGraph(locale, service, schemaTrail, service.faq)
          ),
        }}
      />

      {/* ══ CABECERA ══════════════════════════════════════════════
          Dos capas decorativas en -z-10, ninguna captura eventos: la malla
          animada y la cuadrícula que se desvanece. El resplandor del puntero
          se queda solo en la home — aquí la primera banda es corta y no
          alcanzaría a leerse.                                            */}
      <section className="relative isolate overflow-hidden border-b border-hairline">
        <div className="mesh" aria-hidden="true" />
        <div className="grid-fade" aria-hidden="true" />

        <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
          <Breadcrumbs
            items={[
              { label: tn('services'), href: '/servicios' },
              { label: crumb },
            ]}
            className="mb-10 sm:mb-12"
          />

          <div className="max-w-3xl">
            {/* El ícono del registro del servicio, en grande: es la única
                imagen de la página y dice de qué se trata antes del título. */}
            <span
              className="grad-fill enter-scale inline-flex size-14 items-center justify-center rounded-2xl shadow-glow-brand"
              aria-hidden="true"
            >
              <Icon className="size-7" />
            </span>

            <p className="eyebrow enter-scale step-1 mt-7">
              {en ? 'Service · Mexico City' : 'Servicio · Ciudad de México'}
            </p>

            <h1 className="enter-blur step-2 mt-6 text-d1 text-ink">
              {titleHead}
              <span className="grad-text">{titleAccent}</span>
            </h1>

            <p className="enter step-3 mt-7 text-lead text-ink-muted">
              {t('subtitle')}
            </p>

            <div className="enter step-4 mt-9 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="sheen shadow-glow-brand">
                <Link href="/contacto">
                  {t('ctaMain')}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              {/* Anchor normal: un fragmento de la misma página no es un
                  pathname enrutado. */}
              <Button asChild size="lg" variant="outline">
                <a href="#entregables">
                  {en ? 'See what you get' : 'Ver qué recibes'}
                </a>
              </Button>
            </div>

            <p className="enter step-5 mt-6 flex items-center gap-2.5 text-sm text-ink-subtle">
              <span className="ping" aria-hidden="true" />
              {en
                ? 'Remote consulting from Mexico City.'
                : 'Consultoría remota desde Ciudad de México.'}
            </p>
          </div>
        </div>
      </section>

      {/* ══ POR QUÉ IMPORTA ═══════════════════════════════════════ */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-20">
          <div className="reveal">
            <p className="eyebrow">{en ? 'Context' : 'Contexto'}</p>
            <h2 className="mt-5 text-d1 text-ink">{t('whyTitle')}</h2>
          </div>

          <div className="reveal prose-rich">
            <p>
              {en
                ? 'Your business already generates data: sales, user behaviour, operations metrics, campaign performance. The problem is almost never a shortage of data — it is that nobody agrees on which number to look at. Four people open four reports and walk into the meeting with four figures for the same question.'
                : 'Tu negocio ya genera datos: ventas, comportamiento de usuarios, métricas de operación, rendimiento de campañas. El problema casi nunca es la falta de datos — es que nadie coincide en qué número mirar. Cuatro personas abren cuatro reportes distintos y llegan a la reunión con cuatro cifras para la misma pregunta.'}
            </p>
            <p>
              {en
                ? 'At Amazon I built a BI system in Power BI with a star schema and complex DAX queries, integrating sources through SQL and REST APIs. Before that, as a project manager at Master Loyalty Group, I stood up Power BI dashboards with DirectQuery to Azure DevOps and SQL Server. What both taught me is that the chart is not the hard part: the hard part is agreeing on the definition of each metric and wiring it to the right source so nobody has to refresh it by hand.'
                : 'En Amazon construí un sistema de BI en Power BI con esquema de estrella y consultas DAX complejas, integrando fuentes vía SQL y APIs REST. Antes de eso, como project manager en Master Loyalty Group, monté dashboards en Power BI con DirectQuery a Azure DevOps y SQL Server. Lo que aprendí en ambos casos es que la gráfica no es la parte difícil: la parte difícil es acordar la definición de cada métrica y conectarla a la fuente correcta para que nadie tenga que actualizarla a mano.'}
            </p>
            <p>
              {en
                ? 'So I start from the decisions, not from the visualizations. We name the metrics decisions actually get made on, write down their formula, check where the data comes from and how often it refreshes — and only then do I design the screen. An honest dashboard shows few things, shows them well, and reads on a phone at eight on a Monday morning.'
                : 'Por eso empiezo por las decisiones y no por las visualizaciones. Definimos las métricas que de verdad se usan para decidir, escribimos su fórmula, revisamos de dónde salen los datos y cada cuánto se actualizan — y sólo entonces diseño la pantalla. Un dashboard honesto muestra pocas cosas, las muestra bien y se lee en el teléfono un lunes a las ocho de la mañana.'}
            </p>
          </div>
        </div>
      </section>

      {/* ══ QUÉ CONSTRUYO ═════════════════════════════════════════ */}
      <section className="border-y border-hairline bg-ground-tint">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">{en ? 'Scope' : 'Alcance'}</p>
            <h2 className="mt-5 text-d1 text-ink">{t('whatTitle')}</h2>
            <p className="mt-4 text-lead text-ink-muted">{service.headline}</p>
          </div>

          {/* Sabor de característica: qué contiene el trabajo. */}
          <div className="reveal-stagger mt-14 grid gap-6 md:grid-cols-3">
            {service.benefits.map((benefit) => (
              <div key={benefit} className="card card-hover p-6 sm:p-7">
                <span
                  className="grad-fill block h-1 w-12 rounded-full"
                  aria-hidden="true"
                />
                <p className="mt-5 text-ink">{benefit}</p>
              </div>
            ))}
          </div>

          {/* Sabor de resultado: qué es distinto después. Mismo registro, otra
              pregunta — separados para que ninguno se lea como relleno. */}
          <div className="reveal mt-12 rounded-2xl border border-hairline bg-surface p-6 shadow-lift-1 sm:p-8">
            <h3 className="text-d3 text-ink">
              {en ? 'What changes for your team' : 'Qué cambia para tu equipo'}
            </h3>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-x-10">
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

      {/* ══ CÓMO TRABAJAMOS ═══════════════════════════════════════ */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="reveal max-w-2xl">
          <p className="eyebrow">{en ? 'Process' : 'Proceso'}</p>
          <h2 className="mt-5 text-d1 text-ink">
            {en ? 'How it works' : 'Cómo trabajamos'}
          </h2>
          <p className="mt-4 text-lead text-ink-muted">
            {en
              ? 'Four stages, in this order. The first two are where a data project is won or lost.'
              : 'Cuatro etapas, en este orden. Las dos primeras son donde se gana o se pierde un proyecto de datos.'}
          </p>
        </div>

        {/* Contenido secuencial: el número lleva el gradiente y hace de ancla
            visual, como en la home. Dos columnas y no cuatro porque aquí cada
            etapa trae una descripción completa. */}
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
              <p className="mt-3 max-w-[58ch] text-sm leading-relaxed text-ink-muted">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* ══ ENCAJE — Y EL OPUESTO HONESTO ═════════════════════════ */}
      <section className="border-y border-hairline bg-ground-tint">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">{en ? 'Fit' : 'Encaje'}</p>
            <h2 className="mt-5 text-d1 text-ink">
              {en
                ? 'Who this is for, and who it is not for'
                : 'Para quién es y para quién no'}
            </h2>
          </div>

          {/* Las dos columnas pesan igual: misma tarjeta, mismo tamaño de
              título, misma medida. La lista de "no encaja" es la razón por la
              que la otra es creíble, así que nunca va más chica, más gris ni
              más abajo que su contraparte. */}
          <div className="reveal-stagger mt-14 grid gap-6 md:grid-cols-2">
            <div className="card p-6 sm:p-8">
              <h3 className="text-d3 text-ink">
                {en ? 'A good fit' : 'Encaja bien'}
              </h3>
              <ul className="mt-6 space-y-4">
                {service.forWhom.map((item) => (
                  <li key={item} className="flex gap-3 text-ink-muted">
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
                {en ? 'Not a good fit' : 'No encaja'}
              </h3>
              <ul className="mt-6 space-y-4">
                {service.notFor.map((item) => (
                  <li key={item} className="flex gap-3 text-ink-muted">
                    {/* La forma distingue las dos listas, no solo el color. */}
                    <X
                      className="mt-1 size-4 shrink-0 text-ink-muted"
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

      {/* ══ ENTREGABLES + STACK ═══════════════════════════════════ */}
      <section id="entregables" className="scroll-mt-24">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">{en ? 'Deliverables' : 'Entregables'}</p>
            <h2 className="mt-5 text-d1 text-ink">{t('deliverablesTitle')}</h2>
          </div>

          <ul className="reveal-stagger mt-12 grid gap-4 sm:grid-cols-2">
            {service.includes.map((item) => (
              <li key={item} className="card card-hover flex gap-3.5 p-5">
                <Check
                  className="mt-0.5 size-5 shrink-0 text-violet"
                  aria-hidden="true"
                />
                <span className="text-ink">{item}</span>
              </li>
            ))}
          </ul>

          {/* Sección menor dentro de la misma banda: el stack es una nota al
              pie de los entregables, no algo que merezca su propio color. */}
          <div className="reveal mt-16 sm:mt-20">
            <h3 className="text-d3 text-ink">{t('toolsTitle')}</h3>
            <p className="mt-3 max-w-[68ch] text-ink-muted">
              {en
                ? 'Chosen per project, not by default. A single-source dashboard does not need a BI platform behind it.'
                : 'Se eligen por proyecto, no por costumbre. Un dashboard de una sola fuente no necesita una plataforma de BI detrás.'}
            </p>

            <dl className="reveal-stagger mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {toolGroups.map((group) => (
                <div key={group.label} className="card p-5">
                  <dt className="text-sm font-bold tracking-wide text-ink">
                    {group.label}
                  </dt>
                  <dd className="mt-3 flex flex-wrap gap-1.5">
                    {group.tools.map((tool) => (
                      <Badge key={tool} variant="neutral">
                        {tool}
                      </Badge>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ══ FAQ ═══════════════════════════════════════════════════ */}
      <section className="border-y border-hairline bg-ground-tint">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-20">
            <div className="reveal">
              <p className="eyebrow">{en ? 'Questions' : 'Preguntas'}</p>
              <h2 className="mt-5 text-d1 text-ink">{t('faqTitle')}</h2>
            </div>

            {/* Estas preguntas y respuestas son exactamente las que emite el
                nodo FAQPage de arriba — el markup nunca puede decir algo que
                la página no dice. */}
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
          <p className="eyebrow">{tn('services')}</p>
          <h2 className="mt-5 text-d1 text-ink">{t('relatedTitle')}</h2>
        </div>

        <div className="reveal-stagger mt-14 grid gap-6 md:grid-cols-3">
          {siblings.map(({ service: sibling, href }) => {
            const SiblingIcon = sibling.icon
            return (
              <Link
                key={sibling.id}
                href={href}
                className="card card-hover group flex flex-col p-6 sm:p-7"
              >
                <span
                  className="grad-fill inline-flex size-12 items-center justify-center rounded-xl shadow-glow-brand"
                  aria-hidden="true"
                >
                  <SiblingIcon className="size-6" />
                </span>

                <h3 className="mt-5 text-d3 text-ink transition-colors group-hover:text-brand-strong">
                  {sibling.title}
                </h3>
                <p className="mt-2 flex-1 text-sm text-ink-muted">
                  {sibling.headline}
                </p>

                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-strong">
                  {ts('viewService')}
                  <ArrowUpRight
                    className="size-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            )
          })}

          {/* El hub, con texto de enlace que dice qué hay del otro lado. */}
          <Link
            href="/servicios"
            className="card card-hover group flex flex-col p-6 sm:p-7"
          >
            <span
              className="grad-fill inline-flex size-12 items-center justify-center rounded-xl shadow-glow-brand"
              aria-hidden="true"
            >
              <LayoutGrid className="size-6" />
            </span>

            <h3 className="mt-5 text-d3 text-ink transition-colors group-hover:text-brand-strong">
              {en
                ? 'All four services, side by side'
                : 'Los cuatro servicios, uno al lado del otro'}
            </h3>
            <p className="mt-2 flex-1 text-sm text-ink-muted">
              {en
                ? 'Technical SEO, web development, AI automation and dashboards — with what each one is and is not for.'
                : 'SEO técnico, desarrollo web, automatización con IA y dashboards — con lo que cada uno sí y no resuelve.'}
            </p>

            <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-strong">
              {ts('allServices')}
              <ArrowUpRight
                className="size-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </span>
          </Link>
        </div>
      </section>

      {/* ══ CTA FINAL ═════════════════════════════════════════════ */}
      <section className="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-8 sm:pb-24">
        <div className="grad-animate reveal-scale relative overflow-hidden rounded-3xl px-6 py-14 shadow-lift-3 sm:px-12 sm:py-20">
          <div className="relative max-w-2xl">
            <h2 className="text-d1 text-white">
              {en
                ? 'Tell me which decisions you make every week.'
                : 'Cuéntame qué decisiones tomas cada semana.'}
            </h2>
            <p className="mt-5 text-lead text-white/85">{t('ctaNote')}</p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              {/* Sobre el gradiente el botón se invierte: superficie clara con
                  texto de marca. `bg-none` apaga la imagen del variant, que si
                  no seguiría pintando el mismo gradiente del bloque. */}
              <Button
                asChild
                size="lg"
                className="sheen bg-none bg-surface text-brand-strong hover:bg-ground-tint"
              >
                <Link href="/contacto">
                  {t('ctaMain')}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <a
                href={`mailto:${NAP.email}`}
                className="inline-flex min-h-[44px] items-center text-sm font-semibold text-white underline decoration-white/50 underline-offset-4 hover:decoration-white"
              >
                {t('ctaSecondary')}
              </a>
            </div>

            <p className="mt-7 text-sm text-white/75">
              {en
                ? 'I reply within 24 to 48 business hours, from Mexico City — or write straight to '
                : 'Respondo en 24 a 48 horas hábiles, desde Ciudad de México — o escríbeme directo a '}
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
