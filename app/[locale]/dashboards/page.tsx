import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Rail } from '@/components/instrument/rail'
import { Ribbon } from '@/components/instrument/ribbon'
import { MediaSlot } from '@/components/instrument/media-slot'
import { getServiceById, getServices, type ServiceId } from '@/data/services'
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
  const tb = await getTranslations('breadcrumbs')
  const ts = await getTranslations('services')

  // La ruta visible y el markup de BreadcrumbList se construyen uno junto al
  // otro a propósito: tres niveles en ambos, en el mismo orden y con las
  // mismas etiquetas.
  const crumb = 'Dashboards'
  const schemaTrail: BreadcrumbItem[] = [
    { name: tb('home'), route: 'home' },
    { name: tn('services'), route: 'services' },
    { name: crumb, route: 'dashboards' },
  ]

  /* ── EL MAPA DE CANALES ──────────────────────────────────────────
     Los servicios son los canales paralelos del registrador, y su letra
     sale del ORDEN REAL del catálogo — la misma que imprime la home. Si
     mañana entra un servicio nuevo, las letras se recorren solas en las
     dos páginas a la vez. Nunca es una numeración 01/02/03 inventada. */
  const catalogue = getServices(locale)
  const channelId = (id: ServiceId) => {
    const i = catalogue.findIndex((s) => s.id === id)
    return i === -1 ? '·' : String.fromCharCode(97 + i)
  }
  /** El tramo completo del catálogo: «a–d» con cuatro servicios. */
  const channelSpan = `a–${String.fromCharCode(96 + catalogue.length)}`

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

  /* ── LAS DOS CINTAS DE HERRAMIENTAS ──────────────────────────────
     Solo herramientas que aparecen en data/skills.ts o en el FAQ de este
     mismo servicio — la lista de stack es una afirmación como cualquier
     otra.

     Van en dos carriles que corren en direcciones opuestas: es una lista
     larga de nombres cortos, que es exactamente para lo que sirve la
     cinta, y el cruce de los dos planos es lo que da profundidad sin una
     sola sombra. Cada carril lleva impresas las dos familias que carga,
     así que ningún nombre pierde su grupo. */
  const rails = [
    {
      label: en ? 'Visualization · Application' : 'Visualización · Aplicación',
      tools: [
        'Recharts',
        'D3.js',
        'Chart.js',
        'Plotly',
        'React',
        'Next.js',
        'TypeScript',
        'Node.js',
      ],
      duration: '58s',
    },
    {
      label: en
        ? 'Data sources · BI and modelling'
        : 'Fuentes de datos · BI y modelado',
      tools: [
        'PostgreSQL',
        'MySQL',
        'MongoDB',
        'Firebase',
        'SQL Server',
        'GraphQL',
        en ? 'REST APIs' : 'APIs REST',
        'Power BI',
        'DAX',
        'SQL',
        'Pandas',
        'ETL',
      ],
      duration: '74s',
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

      {/* La cinta corre por el margen de toda la página, igual que en la home.
          Lo que NO se repite aquí es el instrumento en vivo —aguja, marcas y
          regla de presupuesto—: medir la carga en cada página lo convertiría
          en decoración y dejaría de significar. */}
      <div
        className="grid"
        style={{ gridTemplateColumns: 'var(--tape-w) minmax(0,1fr)' }}
      >
        <Rail />

        <div className="min-w-0">
          {/* ═══ CABECERA ════════════════════════════════════════ */}
          <section className="relative px-5 pt-16 sm:px-10">
            <p className="stamp">
              {en ? 'Service · Mexico City' : 'Servicio · Ciudad de México'}
            </p>

            <h1 className="mt-6 max-w-[14ch] text-hero text-ink">
              {t('title')}
            </h1>

            <p className="mt-10 max-w-[46ch] text-lead text-ink-muted">
              {t('subtitle')}
            </p>

            <p className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
              <Link className="link-stylus" href="/contacto">
                {t('ctaMain')} →
              </Link>
              {/* Anchor normal y no `Link`: un fragmento de la misma página no
                  es un pathname enrutado. */}
              <a className="link-stylus" href="#entregables">
                {en ? 'See what you get' : 'Ver qué recibes'} →
              </a>
            </p>

            <p className="stamp mt-8">
              {en
                ? `Remote consulting from ${NAP.localityEn}.`
                : `Consultoría remota desde ${NAP.locality}.`}
            </p>
          </section>

          {/* ═══ CONTEXTO ════════════════════════════════════════ */}
          <section className="border-t border-hairline px-5 py-20 sm:px-10">
            <p className="stamp">{en ? 'Context' : 'Contexto'}</p>
            <h2 className="mt-5 max-w-[16ch] text-d1 text-ink">
              {t('whyTitle')}
            </h2>

            <div className="mt-10 max-w-[62ch] space-y-6">
              <p className="text-ink-muted">
                {en
                  ? 'Your business already generates data: sales, user behaviour, operations metrics, campaign performance. The problem is almost never a shortage of data — it is that nobody agrees on which number to look at. Four people open four reports and walk into the meeting with four figures for the same question.'
                  : 'Tu negocio ya genera datos: ventas, comportamiento de usuarios, métricas de operación, rendimiento de campañas. El problema casi nunca es la falta de datos — es que nadie coincide en qué número mirar. Cuatro personas abren cuatro reportes distintos y llegan a la reunión con cuatro cifras para la misma pregunta.'}
              </p>
              <p className="text-ink-muted">
                {en
                  ? 'At Amazon I built a BI system in Power BI with a star schema and complex DAX queries, integrating sources through SQL and REST APIs. Before that, as a project manager at Master Loyalty Group, I stood up Power BI dashboards with DirectQuery to Azure DevOps and SQL Server. What both taught me is that the chart is not the hard part: the hard part is agreeing on the definition of each metric and wiring it to the right source so nobody has to refresh it by hand.'
                  : 'En Amazon construí un sistema de BI en Power BI con esquema de estrella y consultas DAX complejas, integrando fuentes vía SQL y APIs REST. Antes de eso, como project manager en Master Loyalty Group, monté dashboards en Power BI con DirectQuery a Azure DevOps y SQL Server. Lo que aprendí en ambos casos es que la gráfica no es la parte difícil: la parte difícil es acordar la definición de cada métrica y conectarla a la fuente correcta para que nadie tenga que actualizarla a mano.'}
              </p>
              {/* La única frase en serif de la sección: es la tesis, y está en
                  primera persona. El resto del cuerpo va en la de palo. */}
              <p className="font-human text-lead text-ink">
                {en
                  ? 'So I start from the decisions, not from the visualizations. We name the metrics decisions actually get made on, write down their formula, check where the data comes from and how often it refreshes — and only then do I design the screen. An honest dashboard shows few things, shows them well, and reads on a phone at eight on a Monday morning.'
                  : 'Por eso empiezo por las decisiones y no por las visualizaciones. Definimos las métricas que de verdad se usan para decidir, escribimos su fórmula, revisamos de dónde salen los datos y cada cuánto se actualizan — y sólo entonces diseño la pantalla. Un dashboard honesto muestra pocas cosas, las muestra bien y se lee en el teléfono un lunes a las ocho de la mañana.'}
              </p>
            </div>
          </section>

          {/* ═══ ALCANCE ═════════════════════════════════════════
              Lo que se construye, y qué es distinto después. Son filas de un
              registro, no tarjetas: el alcance no es una secuencia, así que
              tampoco lleva números. */}
          <section className="border-t border-hairline px-5 py-20 sm:px-10">
            <p className="stamp">{en ? 'Scope' : 'Alcance'}</p>
            <h2 className="mt-5 max-w-[16ch] text-d1 text-ink">
              {t('whatTitle')}
            </h2>
            <p className="mt-6 max-w-[52ch] text-lead text-ink-muted">
              {service.headline}
            </p>

            <MediaSlot
              id="dashboards-evidencia"
              className="mt-12 w-full max-w-3xl"
              sizes="(min-width: 1024px) 48rem, 100vw"
            />

            <ul className="reveal-stagger mt-12">
              {service.benefits.map((benefit) => (
                <li key={benefit} className="band text-d3 text-ink">
                  {benefit}
                </li>
              ))}
            </ul>

            <div className="mt-16">
              <h3 className="text-d3 text-ink">
                {en ? 'What changes for your team' : 'Qué cambia para tu equipo'}
              </h3>
              <ul className="reveal-stagger mt-6">
                {service.outcomes.map((outcome) => (
                  <li
                    key={outcome}
                    className="band max-w-[68ch] text-ink-muted"
                  >
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ═══ PROCESO ═════════════════════════════════════════
              Aquí el número SÍ manda: cuatro etapas que ocurren en este orden
              y no en otro. Es la única numeración de la página. */}
          <section className="border-t border-hairline px-5 py-20 sm:px-10">
            <p className="stamp">{ts('process')}</p>
            <h2 className="mt-5 max-w-[16ch] text-d1 text-ink">
              {en ? 'How it works' : 'Cómo trabajamos'}
            </h2>
            <p className="mt-6 max-w-[52ch] text-lead text-ink-muted">
              {en
                ? 'Four stages, in this order. The first two are where a data project is won or lost.'
                : 'Cuatro etapas, en este orden. Las dos primeras son donde se gana o se pierde un proyecto de datos.'}
            </p>

            <ol className="reveal-stagger mt-12">
              {service.process.map((step, index) => (
                <li
                  key={step.title}
                  className="band grid gap-x-5 gap-y-2 sm:grid-cols-[4rem_minmax(0,1fr)]"
                >
                  <span className="stamp tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-d3 text-ink">{step.title}</h3>
                    <p className="mt-2 max-w-[62ch] text-ink-muted">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* ═══ ENCAJE ══════════════════════════════════════════
              Las dos columnas pesan igual: mismo tamaño de título, misma
              medida, misma tinta. La lista de «no encaja» es la razón por la
              que la otra es creíble, así que nunca va más chica ni más gris. */}
          <section className="border-t border-hairline px-5 py-20 sm:px-10">
            <p className="stamp">{en ? 'Fit' : 'Encaje'}</p>
            <h2 className="mt-5 max-w-[18ch] text-d1 text-ink">
              {en
                ? 'Who this is for, and who it is not for'
                : 'Para quién es y para quién no'}
            </h2>

            <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-x-14">
              <div>
                <h3 className="text-d3 text-ink">
                  {en ? 'A good fit' : 'Encaja bien'}
                </h3>
                <ul className="reveal-stagger mt-5">
                  {service.forWhom.map((item) => (
                    <li key={item} className="band text-ink-muted">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-d3 text-ink">
                  {en ? 'Not a good fit' : 'No encaja'}
                </h3>
                <ul className="reveal-stagger mt-5">
                  {service.notFor.map((item) => (
                    <li key={item} className="band text-ink-muted">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ═══ ENTREGABLES ═════════════════════════════════════
              La placa despejada, una sola vez en la página: el material se
              invierte y lo que recibes queda impreso en papel. Es la sección a
              la que apunta el enlace de la cabecera.

              Las reglas de las filas van en `border-current/25` y no en
              `border-hairline`: sobre papel el hairline es casi negro y cada
              fila quedaría subrayada con un trazo más pesado que el texto.
              Es la misma tinta rebajada que ya usa `.plate .channel`. */}
          <section
            id="entregables"
            className="plate relative scroll-mt-24 px-5 py-20 sm:px-10"
          >
            <p className="stamp">{ts('includes')}</p>
            <h2 className="mt-5 max-w-[16ch] text-d1">
              {t('deliverablesTitle')}
            </h2>

            <ul className="reveal-stagger mt-12 max-w-[68ch]">
              {service.includes.map((item) => (
                <li key={item} className="band border-current/25">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* ═══ FUENTES Y LIBRERÍAS ═════════════════════════════
              Dos cintas impresas corriendo en direcciones opuestas. Sin
              flechas, sin puntos de paginación, sin tarjetas — es la lista
              larga de nombres cortos para la que existe la cinta. */}
          <section
            className="overflow-hidden border-t border-hairline py-16"
            aria-labelledby="stack-heading"
          >
            <div className="px-5 sm:px-10">
              <p className="stamp">Stack</p>
              <h2 id="stack-heading" className="mt-5 text-d1 text-ink">
                {t('toolsTitle')}
              </h2>
              <p className="mt-6 max-w-[62ch] text-ink-muted">
                {en
                  ? 'Chosen per project, not by default. A single-source dashboard does not need a BI platform behind it.'
                  : 'Se eligen por proyecto, no por costumbre. Un dashboard de una sola fuente no necesita una plataforma de BI detrás.'}
              </p>
            </div>

            <div className="mt-12 space-y-8">
              {rails.map((rail, i) => (
                <div key={rail.label}>
                  <p className="stamp px-5 sm:px-10">{rail.label}</p>
                  <div className="mt-3">
                    <Ribbon
                      items={rail.tools}
                      label={rail.label}
                      duration={rail.duration}
                      reverse={i % 2 === 1}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ═══ PREGUNTAS ═══════════════════════════════════════
              <details> nativo: sin JS, y el contenido está en el HTML del
              servidor, así que un crawler lo lee completo. Estas preguntas y
              respuestas son exactamente las que emite el nodo FAQPage de
              arriba — el markup nunca puede decir algo que la página no dice. */}
          <section className="border-t border-hairline px-5 py-20 sm:px-10">
            <p className="stamp">{en ? 'Questions' : 'Preguntas'}</p>
            <h2 className="mt-5 max-w-[16ch] text-d1 text-ink">
              {t('faqTitle')}
            </h2>

            <div className="mt-10 max-w-[72ch]">
              {service.faq.map((item) => (
                <details key={item.question} className="band group">
                  <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 text-ink marker:hidden">
                    <span>{item.question}</span>
                    <span
                      aria-hidden="true"
                      className="stamp shrink-0 transition-transform duration-150 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 max-w-[62ch] text-ink-muted">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>

          {/* ═══ CANALES VECINOS ═════════════════════════════════
              La letra de cada canal sale del orden real del catálogo, la misma
              que imprime la home. Al pasar el puntero avanza el trazo de la
              pluma bajo la fila: no se enciende una caja ni se eleva nada. */}
          <section className="border-t border-hairline px-5 py-20 sm:px-10">
            <p className="stamp">{tn('services')}</p>
            <h2 className="mt-5 max-w-[16ch] text-d1 text-ink">
              {t('relatedTitle')}
            </h2>

            <ul className="mt-12">
              {siblings.map(({ service: sibling, href }) => (
                <li key={sibling.id}>
                  <Link href={href} className="channel group border-hairline">
                    <span className="channel-id">
                      ch {channelId(sibling.id)}
                    </span>
                    <span>
                      <span className="text-d3 text-ink">{sibling.title}</span>
                      <span className="mt-1 block max-w-[52ch] text-sm text-ink-muted">
                        {sibling.headline}
                      </span>
                      <span className="channel-pen mt-3" aria-hidden="true" />
                    </span>
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-150 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}

              {/* El hub, con texto de enlace que dice qué hay del otro lado. */}
              <li>
                <Link
                  href="/servicios"
                  className="channel group border-hairline"
                >
                  <span className="channel-id">{channelSpan}</span>
                  <span>
                    <span className="text-d3 text-ink">
                      {en
                        ? 'All four services, side by side'
                        : 'Los cuatro servicios, uno al lado del otro'}
                    </span>
                    <span className="mt-1 block max-w-[52ch] text-sm text-ink-muted">
                      {en
                        ? 'Technical SEO, web development, AI automation and dashboards — with what each one is and is not for.'
                        : 'SEO técnico, desarrollo web, automatización con IA y dashboards — con lo que cada uno sí y no resuelve.'}
                    </span>
                    <span className="channel-pen mt-3" aria-hidden="true" />
                  </span>
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-150 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </li>
            </ul>

            <p className="mt-10">
              <Link className="link-stylus" href="/servicios">
                {ts('allServices')} →
              </Link>
            </p>
          </section>

          {/* ═══ CIERRE ══════════════════════════════════════════ */}
          <section className="border-t border-hairline px-5 py-24 sm:px-10">
            <h2 className="max-w-[18ch] text-d1 text-ink">
              {en
                ? 'Tell me which decisions you make every week.'
                : 'Cuéntame qué decisiones tomas cada semana.'}
            </h2>
            <p className="mt-6 max-w-[52ch] font-human text-lead text-ink-muted">
              {t('ctaNote')}
            </p>

            <p className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
              <Link className="link-stylus text-d3" href="/contacto">
                {t('ctaMain')} →
              </Link>
              <a className="link-stylus" href={`mailto:${NAP.email}`}>
                {t('ctaSecondary')} →
              </a>
            </p>

            <p className="mt-8 max-w-[56ch] text-sm text-ink-subtle">
              {en
                ? 'I reply within 24 to 48 business hours, from Mexico City — or write straight to '
                : 'Respondo en 24 a 48 horas hábiles, desde Ciudad de México — o escríbeme directo a '}
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
