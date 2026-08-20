import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ArrowRight, ArrowUpRight, Check, LayoutGrid, X } from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Carousel } from '@/components/ui/carousel'
import { Disclosure } from '@/components/ui/disclosure'
import { ImageSlot } from '@/components/ui/image-slot'
import { PointerGlow } from '@/components/motion/pointer-glow'
import { Tilt3D } from '@/components/motion/tilt-3d'
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

/**
 * ════════════════════════════════════════════════════════════════
 * CAPAS DE FONDO — el conjunto que hace visible el cristal
 *
 * Aurora + grano + cuadrícula, siempre juntas. El cristal solo existe si hay
 * algo saturado detrás que difuminar: sobre un fondo casi blanco un panel
 * translúcido se ve exactamente igual que un panel blanco, y ese fue el motivo
 * real por el que el efecto parecía no estar puesto.
 *
 * Los cuatro <i> son obligatorios — cada uno es un campo de color distinto
 * (azul de marca, cian, cielo y un brillo blanco para que la mezcla no se vea
 * plana). Todos se mueven con `transform`, así que cuestan cero recálculos de
 * estilo mientras el navegador los pueda componer.
 *
 * ── CUÁNTAS CABEN, MEDIDO ──
 * Tres secciones con aurora por página, y ni una más. Con cinco se agota el
 * presupuesto de capas compuestas de la página, el navegador devuelve las
 * animaciones al hilo principal y TODA animación en bucle empieza a costar un
 * recálculo de estilo por frame: 180 en 3 s en reposo contra un presupuesto de
 * 20. Aquí las tres son las que llevan cristal encima: la cabecera, el alcance
 * y el FAQ. Las demás bandas ponen su color con `.grad-soft` o `bg-ground-tint`,
 * que no se animan y no cuestan capa.
 * Verifica: node scripts/perf-probe.mjs http://localhost:3000/es/dashboards
 *
 * `glow` monta el resplandor que sigue al puntero, solo en la cabecera: cada
 * instancia añade un listener de `pointermove` y una lectura de geometría por
 * frame.
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
  const tl = await getTranslations('a11y')
  const tu = await getTranslations('common')

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
    { name: tb('home'), route: 'home' },
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
          Aurora, grano, cuadrícula y resplandor de puntero, las cuatro en
          -z-10 dentro de un contenedor `relative isolate overflow-hidden` y
          ninguna capturando eventos.                                     */}
      <section className="relative isolate overflow-hidden border-b border-hairline">
        <Backdrop glow />

        <div className="mx-auto w-full max-w-6xl px-5 pb-20 pt-12 sm:px-8 sm:pb-24 sm:pt-16">
          <Breadcrumbs
            className="enter"
            items={[
              { label: tn('services'), href: '/servicios' },
              { label: crumb },
            ]}
          />

          <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-center lg:gap-16">
            <div className="max-w-2xl">
              {/* El ícono del registro del servicio, en grande: dice de qué se
                  trata antes del título.

                  El `.float` va sobre un elemento con `background-image`, NUNCA
                  sobre un panel de cristal: mover algo con `backdrop-filter`
                  obliga a rerasterizar el desenfoque en cada frame. */}
              <div className="flex flex-wrap items-center gap-4">
                <span
                  className="grad-deco float enter-scale inline-flex size-16 shrink-0 items-center justify-center rounded-3xl text-white shadow-glow-brand sm:size-20"
                  aria-hidden="true"
                >
                  <Icon className="size-8 sm:size-10" />
                </span>
                <p className="eyebrow enter-scale step-1">
                  {en ? 'Service · Mexico City' : 'Servicio · Ciudad de México'}
                </p>
              </div>

              <h1 className="enter-blur step-2 mt-7 text-d1 text-ink">
                {titleHead}
                <span className="grad-text">{titleAccent}</span>
              </h1>

              {/* ── POR QUÉ EL LEAD VA DENTRO DE CRISTAL ──
                  Medido: sobre la aurora `text-ink-muted` cae a 3.83:1 y
                  `text-ink-subtle` a 3.23:1, y ninguno pasa. Dentro de
                  `.glass-strong` el muted mide 5.1 y el subtle 4.54, y los dos
                  sí. De ahí que el panel sea `strong` y no el de 62%, donde el
                  subtle se queda en 4.30. */}
              <div className="glass glass-strong glass-spec enter step-3 mt-8 p-6 sm:p-7">
                <p className="text-lead text-ink-muted">{t('subtitle')}</p>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Button asChild size="lg" className="sheen shadow-glow-brand">
                    <Link href="/contacto">
                      {t('ctaMain')}
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </Button>
                  {/* Anchor normal y no `Link`: un fragmento de la misma página
                      no es un pathname enrutado. `outline` y no `glass` porque
                      este botón vive DENTRO de un panel de cristal. */}
                  <Button asChild size="lg" variant="outline">
                    <a href="#entregables">
                      {en ? 'See what you get' : 'Ver qué recibes'}
                    </a>
                  </Button>
                </div>

                <p className="mt-6 flex items-center gap-2.5 text-sm text-ink-subtle">
                  <span className="ping" aria-hidden="true" />
                  {en
                    ? `Remote consulting from ${NAP.localityEn}.`
                    : `Consultoría remota desde ${NAP.locality}.`}
                </p>
              </div>
            </div>

            {/* ── COMPOSICIÓN EN TRES PLANOS ──
                `.scene` (la perspectiva) y `.stack-3d` (el reparto en
                profundidad al pasar el mouse) van en el MISMO elemento: la
                perspectiva solo alcanza a los hijos DIRECTOS, así que con el
                stack en un div interno las tres capas se aplanarían.

                `preserve-3d` es lo que hace que el navegador ordene por z real
                y no por orden en el DOM, y las clases `.depth-*` dan la
                separación en reposo.

                El hueco de imagen es HERMANO de los paneles de cristal, nunca
                hijo: su etiqueta es a su vez un panel de cristal y anidar
                `backdrop-filter` está prohibido. */}
            <div className="enter-scale step-4">
              <div className="relative mx-auto w-full max-w-[24rem]">
                <div
                  className="absolute -inset-5 opacity-60"
                  aria-hidden="true"
                >
                  <div className="grad-drift float-slow size-full rounded-[3rem]" />
                </div>

                <div className="scene stack-3d relative aspect-[5/6] [transform-style:preserve-3d]">
                  {/* Plano 1 — el resumen de resultados, en cristal. Dos de los
                      cuatro: el listado completo vive en la sección de alcance. */}
                  <div className="depth-3 absolute bottom-0 left-0 z-30 w-[86%]">
                    <div className="glass glass-strong glass-spec p-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-brand-strong">
                        {en ? 'What changes' : 'Qué cambia'}
                      </p>
                      <ul className="mt-3 space-y-2.5">
                        {service.outcomes.slice(0, 2).map((outcome) => (
                          <li
                            key={outcome}
                            className="flex gap-2.5 text-sm text-ink"
                          >
                            <Check
                              className="mt-0.5 size-4 shrink-0 text-sky-ink"
                              aria-hidden="true"
                            />
                            <span>{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Plano 2 — la baldosa de gradiente. Blanco sobre
                      `--grad-fill` es el único uso legal de blanco del sistema:
                      todos sus stops pasan 5.3:1. Los hijos van `relative`
                      porque `.grad-drift` mueve un ::before en -z-10. */}
                  <div className="depth-2 absolute right-[4%] top-[34%] z-20 w-[40%]">
                    <div className="grad-drift rounded-2xl p-5 shadow-lift-3">
                      <p
                        className="relative font-display text-4xl font-bold leading-none text-white"
                        data-numeric=""
                      >
                        {String(service.process.length).padStart(2, '0')}
                      </p>
                      <p className="relative mt-2 text-xs font-semibold uppercase tracking-wider text-white/85">
                        {en ? 'stages' : 'etapas'}
                      </p>
                    </div>
                  </div>

                  {/* Plano 3 — el hueco del ejemplo. Es el MISMO archivo que
                      referencia la fila de este servicio en /servicios: un
                      asset, dos usos. */}
                  <div className="depth-1 absolute right-0 top-0 z-10 w-[88%]">
                    <ImageSlot
                      path={`/servicios/${service.id}.png`}
                      alt={
                        en
                          ? `Example of the ${service.title} service`
                          : `Ejemplo del servicio ${service.title}`
                      }
                      hint={en ? 'Service example' : 'Ejemplo del servicio'}
                      width={1200}
                      height={750}
                      sizes="(min-width: 1024px) 340px, 80vw"
                      className="aspect-[16/10] rounded-2xl shadow-lift-3"
                    />
                  </div>
                </div>
              </div>
            </div>
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

      {/* ══ QUÉ CONSTRUYO ═════════════════════════════════════════
          Las tarjetas de alcance van en CARRUSEL y con inclinación que sigue
          al puntero. El desplazamiento y el imán son nativos (`scroll-snap`):
          si el JS del componente no corre el riel sigue funcionando, y las
          tarjetas completas están en el HTML del servidor.                */}
      <section className="relative isolate overflow-hidden border-y border-hairline">
        <Backdrop />

        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">{en ? 'Scope' : 'Alcance'}</p>
            <h2 className="mt-5 text-d1 text-ink">{t('whatTitle')}</h2>
            <div className="glass glass-strong glass-spec mt-6 px-5 py-4">
              <p className="text-lead text-ink-muted">{service.headline}</p>
            </div>
          </div>

          <Carousel
            label={tl('scopeRail')}
            prevLabel={tl('prevSlide')}
            nextLabel={tl('nextSlide')}
            className="mt-12"
          >
            {service.benefits.map((benefit, index) => (
              /* `.scene` ya vive en el riel del carrusel, así que todas las
                 tarjetas comparten un mismo punto de fuga — que es lo que
                 separa un 3D creíble de varias tarjetas girando cada una por su
                 cuenta. */
              <Tilt3D key={benefit} className="w-[19rem] sm:w-[23rem]">
                <div className="relative flex h-full flex-col p-6 sm:p-7 [transform-style:preserve-3d]">
                  {/* La placa de cristal es el PLANO DE FONDO, no el
                      contenedor: `.glass` lleva `contain: paint`, que aplana el
                      3D, así que con el contenido dentro las clases `.depth-*`
                      no levantarían nada. */}
                  <span className="absolute inset-0" aria-hidden="true">
                    <span className="glass glass-spec block size-full" />
                  </span>

                  {/* Número en `.grad-fill` y no en `.grad-deco`: aquí hay texto
                      encima, y el gradiente decorativo pasa por `--sky` y
                      `--cyan`, donde el blanco mide 2.77:1 y 1.68:1. Todos los
                      stops de `--grad-fill` pasan 5.3:1. */}
                  <span
                    className="grad-fill depth-2 inline-flex size-12 items-center justify-center rounded-xl font-display text-lg font-bold shadow-glow-brand"
                    data-numeric=""
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <p className="depth-1 mt-5 flex-1 text-ink">{benefit}</p>
                </div>
              </Tilt3D>
            ))}
          </Carousel>

          {/* `text-ink` y no `text-ink-subtle`: va directo sobre la aurora, y
              ahí solo la tinta plena (10.2:1) pasa contraste. */}
          <p className="reveal mt-6 text-sm text-ink">{tu('dragHint')}</p>

          {/* Sabor de resultado: qué es distinto después. Mismo registro, otra
              pregunta — separados para que ninguno se lea como relleno. */}
          <div className="glass glass-spec reveal mt-12 p-6 sm:p-8">
            <h3 className="text-d3 text-ink">
              {en ? 'What changes for your team' : 'Qué cambia para tu equipo'}
            </h3>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-x-10">
              {service.outcomes.map((outcome) => (
                <li key={outcome} className="flex gap-3 text-ink-muted">
                  <Check
                    className="mt-1 size-4 shrink-0 text-sky-ink"
                    aria-hidden="true"
                  />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ══ CÓMO TRABAJAMOS ═══════════════════════════════════════
          Secuencial, así que el número manda. `.scene` en la lista y
          `.tilt-hover` en cada elemento: la perspectiva alcanza solo a los
          hijos directos, y compartirla es lo que da un punto de fuga común.

          El `.reveal-3d` va en la tarjeta INTERIOR, no en el <li>: una
          animación con `fill: both` se queda dueña del `transform` de su
          elemento para siempre, así que en el mismo nodo que `.tilt-hover`
          mataría la inclinación al pasar el mouse.                        */}
      <section className="defer-paint mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="reveal max-w-2xl">
          <p className="eyebrow">{ts('process')}</p>
          <h2 className="mt-5 text-d1 text-ink">
            {en ? 'How it works' : 'Cómo trabajamos'}
          </h2>
          <p className="mt-4 text-lead text-ink-muted">
            {en
              ? 'Four stages, in this order. The first two are where a data project is won or lost.'
              : 'Cuatro etapas, en este orden. Las dos primeras son donde se gana o se pierde un proyecto de datos.'}
          </p>
        </div>

        <div className="relative mt-14">
          {/* Hilo de conexión con el gradiente de marca. Va detrás de las
              tarjetas —que son opacas—, así que solo se ve en los huecos entre
              una y otra: las etapas quedan encadenadas sin dibujar flechas. */}
          <span
            className="grad-deco absolute left-[11%] right-[11%] top-12 hidden h-0.5 rounded-full opacity-70 lg:block"
            aria-hidden="true"
          />

          <ol className="scene grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {service.process.map((step, index) => (
              <li key={step.title} className="tilt-hover rounded-xl">
                <div className="card reveal-3d flex h-full flex-col p-6">
                  <span
                    className="grad-text font-display text-5xl font-bold leading-none"
                    data-numeric=""
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-4 text-d3 text-ink">{step.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
                    {step.description}
                  </p>

                  {/* Un hueco de imagen POR FASE: esta página tenía uno solo en
                      toda su extensión y era la que menos imágenes mostraba de
                      todo el sitio.

                      Va DENTRO de la tarjeta `.card`, que es opaca, así que la
                      etiqueta del hueco —que es `.glass-strong`— no queda
                      cristal sobre cristal.

                      `.depth-1` la manda al plano de atrás de la tarjeta
                      inclinada, para que la captura se lea como algo que está
                      debajo del texto y no pegado encima. El `flex-1` que
                      acaba de ganar el párrafo es lo que deja las cuatro
                      capturas alineadas al pie aunque las descripciones midan
                      distinto. */}
                  <ImageSlot
                    path={`/servicios/${service.id}/fase-${index + 1}.png`}
                    alt={
                      en
                        ? `Screenshot of the phase: ${step.title}`
                        : `Captura de la fase: ${step.title}`
                    }
                    hint={en ? `Phase ${index + 1}` : `Fase ${index + 1}`}
                    width={1200}
                    height={750}
                    sizes="(min-width: 1024px) 260px, (min-width: 640px) 44vw, 88vw"
                    className="depth-1 mt-6 aspect-[16/10] w-full rounded-xl shadow-lift-2"
                  />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ══ ENCAJE — Y EL OPUESTO HONESTO ═════════════════════════
          Las dos columnas pesan igual: misma tarjeta, mismo tamaño de título,
          misma medida, mismo movimiento. La lista de "no encaja" es la razón
          por la que la otra es creíble, así que nunca va más chica, más gris,
          más abajo ni escondida tras un clic. Lo que las distingue es la FORMA
          del ícono, no el color: el estado nunca se comunica solo con color. */}
      <section className="defer-paint border-y border-hairline bg-ground-tint">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">{en ? 'Fit' : 'Encaje'}</p>
            <h2 className="mt-5 text-d1 text-ink">
              {en
                ? 'Who this is for, and who it is not for'
                : 'Para quién es y para quién no'}
            </h2>
          </div>

          <div className="scene mt-14 grid gap-6 md:grid-cols-2">
            <div className="lift rounded-xl">
              <div className="card reveal-3d h-full p-6 sm:p-8">
                <span
                  className="grad-deco block h-1 w-12 rounded-full"
                  aria-hidden="true"
                />
                <h3 className="mt-5 text-d3 text-ink">
                  {en ? 'A good fit' : 'Encaja bien'}
                </h3>
                <ul className="mt-6 space-y-4">
                  {service.forWhom.map((item) => (
                    <li key={item} className="flex gap-3 text-ink-muted">
                      <Check
                        className="mt-1 size-4 shrink-0 text-sky-ink"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lift rounded-xl">
              <div className="card reveal-3d h-full p-6 sm:p-8">
                <span
                  className="block h-1 w-12 rounded-full bg-ink-subtle"
                  aria-hidden="true"
                />
                <h3 className="mt-5 text-d3 text-ink">
                  {en ? 'Not a good fit' : 'No encaja'}
                </h3>
                <ul className="mt-6 space-y-4">
                  {service.notFor.map((item) => (
                    <li key={item} className="flex gap-3 text-ink-muted">
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
        </div>
      </section>

      {/* ══ ENTREGABLES + STACK ═══════════════════════════════════
          El color de la banda lo pone `.grad-soft`, un `background-image` fijo,
          y no una aurora: el presupuesto de capas compuestas de la página ya
          está gastado en tres secciones. Sobre ese gradiente el cristal SÍ se
          lee —hay color detrás que difuminar— y no cuesta ningún frame porque
          no se anima.                                                     */}
      <section
        id="entregables"
        className="defer-paint grad-soft scroll-mt-24 border-b border-hairline"
      >
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">{ts('includes')}</p>
            <h2 className="mt-5 text-d1 text-ink">{t('deliverablesTitle')}</h2>
          </div>

          {/* Un solo panel de cristal con filas divididas, y no una tarjeta por
              entregable: `backdrop-filter` es lo más caro del sistema y las
              filas ya se separan con su propia línea. El divisor se apaga en la
              primera fila de cada columna para que ninguna línea quede colgando
              del borde superior del panel. */}
          <ul className="glass glass-spec reveal mt-12 grid gap-x-10 px-6 py-2 sm:grid-cols-2 sm:px-8">
            {service.includes.map((item) => (
              <li
                key={item}
                className="flex gap-3.5 border-t border-hairline py-4 first:border-t-0 sm:[&:nth-child(2)]:border-t-0"
              >
                <Check
                  className="mt-1 size-4 shrink-0 text-sky-ink"
                  aria-hidden="true"
                />
                <span className="text-ink-muted">{item}</span>
              </li>
            ))}
          </ul>

          {/* Sección menor dentro de la misma banda: el stack es una nota al
              pie de los entregables, no algo que merezca su propio color. */}
          <div className="reveal mt-16 border-t border-hairline pt-12 sm:mt-20">
            <p className="eyebrow">Stack</p>
            <h2 className="mt-5 text-d3 text-ink">{t('toolsTitle')}</h2>
            <p className="mt-3 max-w-[68ch] text-ink-muted">
              {en
                ? 'Chosen per project, not by default. A single-source dashboard does not need a BI platform behind it.'
                : 'Se eligen por proyecto, no por costumbre. Un dashboard de una sola fuente no necesita una plataforma de BI detrás.'}
            </p>

            {/* Tarjetas OPACAS y no de cristal, aunque haya color detrás: son
                las únicas de esta banda que se inclinan en 3D, y girar un
                elemento con `backdrop-filter` obliga a rerasterizar el
                desenfoque en cada frame de la transición. El cristal de la
                banda ya lo pone el panel de entregables, que se queda quieto. */}
            <dl className="scene mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {toolGroups.map((group) => (
                <div key={group.label} className="tilt-hover rounded-xl">
                  <div className="card h-full p-5">
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
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ══ FAQ ═══════════════════════════════════════════════════
          Tercera y última sección con aurora de la página: es la que sostiene
          el panel de cristal más grande, y sin algo saturado detrás ese panel
          se vería como un rectángulo blanco.                              */}
      <section className="defer-paint relative isolate overflow-hidden border-b border-hairline">
        <Backdrop />

        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-20">
            <div className="reveal">
              <p className="eyebrow">{en ? 'Questions' : 'Preguntas'}</p>
              <h2 className="mt-5 text-d1 text-ink">{t('faqTitle')}</h2>
            </div>

            {/* Estas preguntas y respuestas son exactamente las que emite el
                nodo FAQPage de arriba — el markup nunca puede decir algo que la
                página no dice. El `name` compartido da el acordeón exclusivo
                —abrir una cierra la anterior— de forma nativa, sin JS. */}
            <div className="glass glass-spec reveal px-5 sm:px-7">
              {service.faq.map((faq) => (
                <Disclosure
                  key={faq.question}
                  name="faq-dashboards"
                  question={faq.question}
                  answer={faq.answer}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ SERVICIOS RELACIONADOS ════════════════════════════════ */}
      <section className="defer-paint mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="reveal max-w-2xl">
          <p className="eyebrow">{tn('services')}</p>
          <h2 className="mt-5 text-d1 text-ink">{t('relatedTitle')}</h2>
        </div>

        <ul className="scene mt-14 grid gap-6 md:grid-cols-3">
          {siblings.map(({ service: sibling, href }) => {
            const SiblingIcon = sibling.icon
            return (
              <li key={sibling.id} className="tilt-hover rounded-xl">
                <Link
                  href={href}
                  className="card reveal-3d group flex h-full flex-col p-6 sm:p-7"
                >
                  <span
                    className="grad-deco inline-flex size-12 items-center justify-center rounded-xl text-white shadow-glow-brand"
                    aria-hidden="true"
                  >
                    <SiblingIcon className="size-6" />
                  </span>

                  <h3 className="mt-5 text-d3 text-ink transition-colors duration-300 group-hover:text-brand-strong">
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
              </li>
            )
          })}

          {/* El hub, con texto de enlace que dice qué hay del otro lado. */}
          <li className="tilt-hover rounded-xl">
            <Link
              href="/servicios"
              className="card reveal-3d group flex h-full flex-col p-6 sm:p-7"
            >
              <span
                className="grad-deco inline-flex size-12 items-center justify-center rounded-xl text-white shadow-glow-brand"
                aria-hidden="true"
              >
                <LayoutGrid className="size-6" />
              </span>

              <h3 className="mt-5 text-d3 text-ink transition-colors duration-300 group-hover:text-brand-strong">
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
          </li>
        </ul>
      </section>

      {/* ══ CTA FINAL ═════════════════════════════════════════════
          `.grad-drift` desplaza una capa al 200% con `transform` en vez de
          animar `background-position`, que repintaría el bloque completo en
          cada frame. Mismo efecto, costo cero.                          */}
      <section className="defer-paint mx-auto w-full max-w-6xl px-5 pb-20 sm:px-8 sm:pb-24">
        <div className="grad-drift reveal-scale rounded-3xl px-6 py-14 shadow-lift-3 sm:px-12 sm:py-20">
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
