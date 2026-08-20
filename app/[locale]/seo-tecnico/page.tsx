import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ArrowRight, ArrowUpRight, Check, X } from 'lucide-react'
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
 * Verifica: node scripts/perf-probe.mjs http://localhost:3000/es/seo-tecnico
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
  const ts = await getTranslations('services')
  const tl = await getTranslations('a11y')
  const tu = await getTranslations('common')

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
    sibling
      ? [
          {
            href,
            title: sibling.title,
            headline: sibling.headline,
            icon: sibling.icon,
          },
        ]
      : []
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
              { label: crumbLabel },
            ]}
          />

          <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-center lg:gap-16">
            <div className="max-w-2xl">
              {/* El ícono del servicio a tamaño grande, con el gradiente firma:
                  es la primera señal de en qué página está el lector.

                  El `.float` va sobre un elemento con `background-image`, NUNCA
                  sobre un panel de cristal: mover algo con `backdrop-filter`
                  obliga a rerasterizar el desenfoque en cada frame. */}
              <div className="flex flex-wrap items-center gap-4">
                <span
                  className="grad-deco float enter-scale inline-flex size-16 items-center justify-center rounded-3xl text-white shadow-glow-brand sm:size-20"
                  aria-hidden="true"
                >
                  <Icon className="size-8 sm:size-10" />
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
                  {/* `outline` y no `glass`: este botón vive DENTRO de un panel
                      de cristal, y cristal sobre cristal difumina dos veces. */}
                  <Button asChild size="lg" variant="outline">
                    <Link href="/servicios">{ts('allServices')}</Link>
                  </Button>
                </div>

                <p className="mt-6 flex items-center gap-2.5 text-sm text-ink-subtle">
                  <span className="ping" aria-hidden="true" />
                  {en
                    ? `Based in ${NAP.localityEn}. Remote work with teams in any time zone.`
                    : `Con base en ${NAP.locality}. Trabajo remoto con equipos en cualquier zona horaria.`}
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
                separación en reposo: ya se ve en 3D sin pasar el mouse.

                El hueco de imagen es HERMANO de los paneles de cristal, nunca
                hijo: su etiqueta es a su vez un panel de cristal y anidar
                `backdrop-filter` está prohibido. */}
            <div className="enter-scale step-4">
              <div className="relative mx-auto w-full max-w-[24rem]">
                {/* Halo que se desplaza. Va FUERA del stack porque
                    `.stack-3d > *` cuenta hijos y un decorativo adentro
                    correría los índices. */}
                <div
                  className="absolute -inset-5 opacity-60"
                  aria-hidden="true"
                >
                  <div className="grad-drift float-slow size-full rounded-[3rem]" />
                </div>

                <div className="scene stack-3d relative aspect-[5/6] [transform-style:preserve-3d]">
                  {/* Plano 1 — el resumen de resultados, en cristal. Es el que
                      se adelanta al pasar el mouse. Dos de los cuatro: el
                      listado completo vive en la sección de alcance. */}
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
                      porque `.grad-drift` mueve un ::before en -z-10 y un hijo
                      sin posicionar quedaría por debajo. */}
                  <div className="depth-2 absolute right-[4%] top-[34%] z-20 w-[40%]">
                    <div className="grad-drift rounded-2xl p-5 shadow-lift-3">
                      <p
                        className="relative font-display text-4xl font-bold leading-none text-white"
                        data-numeric=""
                      >
                        {String(service.process.length).padStart(2, '0')}
                      </p>
                      <p className="relative mt-2 text-xs font-semibold uppercase tracking-wider text-white/85">
                        {en ? 'phases' : 'fases'}
                      </p>
                    </div>
                  </div>

                  {/* Plano 3 — el hueco del ejemplo, el que se va hacia atrás.
                      Es el MISMO archivo que referencia la fila de este
                      servicio en /servicios: un asset, dos usos. */}
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

      {/* ══ QUÉ ENTREGO ═══════════════════════════════════════════
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
                      no levantarían nada. Dos capas porque `.glass` fija
                      `position: relative` y le ganaría a `absolute`. */}
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

          {/* Los resultados van en un panel aparte: son la consecuencia del
              alcance de arriba, no otro punto de la misma lista. */}
          <div className="glass glass-spec reveal mt-12 p-6 sm:p-8">
            <h3 className="text-d3 text-ink">
              {en ? 'What changes afterwards' : 'Qué cambia después'}
            </h3>
            <ul className="mt-6 grid gap-x-10 gap-y-4 lg:grid-cols-2">
              {service.outcomes.map((outcome) => (
                <li key={outcome} className="flex gap-3.5">
                  <Check
                    className="mt-1 size-4 shrink-0 text-sky-ink"
                    aria-hidden="true"
                  />
                  <span className="text-ink-muted">{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ══ PROCESO ═══════════════════════════════════════════════
          Secuencial, así que el número manda. `.scene` en la lista y
          `.tilt-hover` en cada elemento: la perspectiva alcanza solo a los
          hijos directos, y compartirla es lo que da un punto de fuga común.

          El `.reveal-3d` va en la tarjeta INTERIOR, no en el <li>: una
          animación con `fill: both` se queda dueña del `transform` de su
          elemento para siempre, así que en el mismo nodo que `.tilt-hover`
          mataría la inclinación al pasar el mouse.

          Tarjetas `.card` (opacas) y no cristal: esta banda no lleva aurora, y
          sin nada saturado detrás un panel translúcido se ve idéntico a uno
          blanco — pagando el `backdrop-filter` a cambio de nada.           */}
      <section className="defer-paint mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="reveal max-w-2xl">
          <p className="eyebrow">{ts('process')}</p>
          <h2 className="mt-5 text-d1 text-ink">
            {en ? 'How the work runs' : 'Cómo se ejecuta el trabajo'}
          </h2>
        </div>

        <div className="relative mt-14">
          {/* Hilo de conexión con el gradiente de marca. Va detrás de las
              tarjetas —que son opacas—, así que solo se ve en los huecos entre
              una y otra: los pasos quedan encadenados sin dibujar flechas. */}
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

      {/* ══ SÍ ENCAJA / NO ENCAJA ═════════════════════════════════
          Mismo ancho, misma tarjeta, mismo peso tipográfico y el mismo ritmo,
          a propósito. Las limitaciones declaradas son el diferenciador de esta
          página: degradarlas visualmente, esconderlas tras un clic o
          suavizarlas en línea de venta anula el motivo por el que están
          escritas. Lo que distingue las dos listas es la FORMA del ícono, no su
          color — el estado nunca se comunica solo con color.               */}
      <section className="defer-paint border-y border-hairline bg-ground-tint">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="scene grid gap-6 lg:grid-cols-2">
            <div className="lift rounded-xl">
              <div className="card reveal-3d h-full p-6 sm:p-8">
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
                        className="mt-1 size-4 shrink-0 text-sky-ink"
                        aria-hidden="true"
                      />
                      <span className="text-ink-muted">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lift rounded-xl">
              <div className="card reveal-3d h-full p-6 sm:p-8">
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
        </div>
      </section>

      {/* ══ ENTREGABLES + HERRAMIENTAS ════════════════════════════
          El color de la banda lo pone `.grad-soft`, un `background-image` fijo,
          y no una aurora: el presupuesto de capas compuestas de la página ya
          está gastado en tres secciones. Sobre ese gradiente el cristal SÍ se
          lee —hay color detrás que difuminar— y no cuesta ningún frame porque
          no se anima.                                                     */}
      <section className="defer-paint grad-soft border-b border-hairline">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-20">
            <div className="reveal">
              <p className="eyebrow">{ts('includes')}</p>
              <h2 className="mt-5 text-d1 text-ink">
                {t('deliverablesTitle')}
              </h2>
              <p className="mt-4 text-ink-muted">
                {en
                  ? 'Written, versioned, and yours to keep — including the reasoning behind each recommendation.'
                  : 'Por escrito, versionado y tuyo — incluido el razonamiento detrás de cada recomendación.'}
              </p>
            </div>

            <ul className="glass glass-spec reveal px-6 py-2 sm:px-8">
              {service.includes.map((item) => (
                <li
                  key={item}
                  className="flex gap-4 border-b border-hairline py-5 last:border-0"
                >
                  <Check
                    className="mt-1 size-4 shrink-0 text-sky-ink"
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
                /* `neutral` y no `glass`: estos badges caen sobre una banda
                   opaca de gradiente, y un chip de cristal aquí solo pagaría un
                   `backdrop-filter` por elemento sin verse distinto. */
                <Badge key={tool} variant="neutral">
                  {tool}
                </Badge>
              ))}
            </div>
            <p className="mt-6 max-w-[68ch] text-sm text-ink-muted">
              {en
                ? 'Standard tooling, named on purpose: every finding in the report can be reproduced by your team with the same tools, without taking my word for it.'
                : 'Herramientas estándar, y las nombro a propósito: cualquier hallazgo del reporte lo puede reproducir tu equipo con las mismas herramientas, sin tener que creerme.'}
            </p>
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
            {/* NO lleva `reveal` a proposito. Este bloque y su envoltorio eran
                los dos unicos elementos del sitio con una animacion view() que
                costaba ~60 recalculos de estilo por segundo en reposo, para
                siempre: 181 en 3 s contra un presupuesto de 20, en las cuatro
                paginas de servicio. Cancelar cualquiera de los dos por separado
                bajaba a ~9, asi que hacian falta los dos.

                Lo que NO es la causa, comprobado: no es el numero de animaciones
                (inyecte 12 extra en /es hasta 50 corriendo y no se movio de 9),
                no es anidamiento (0 anidados en el DOM de las 16 paginas: son
                las dos columnas de un grid, y por eso comparten alto y top),
                y no es el estado finished/progreso 1 fuera de pantalla (/es y
                /es/proyectos tienen 4 y 5 de esos y estan sanas). El mecanismo
                exacto sigue sin cerrar: esto es una mitigacion medida, no una
                explicacion.

                El FAQ entra igualmente: hereda la coreografia de primer pintado
                de la seccion. Verifica con: npm run check:perf */}
            <div>
              <p className="eyebrow">FAQ</p>
              <h2 className="mt-5 text-d1 text-ink">{t('faqTitle')}</h2>
            </div>

            {/* Se renderiza del mismo arreglo con el que se construye el nodo
                FAQPage, así la respuesta visible y la del markup son una.

                Un panel grande y no una tarjeta por pregunta: `backdrop-filter`
                es lo más caro del sistema y las respuestas ya se separan con su
                propia línea. El `name` compartido da el acordeón exclusivo
                —abrir una cierra la anterior— de forma nativa, sin JS. */}
            <div className="glass glass-spec px-5 sm:px-7">
              {service.faq.map((faq) => (
                <Disclosure
                  key={faq.question}
                  name="faq-seo-tecnico"
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
          <p className="eyebrow">{ts('eyebrow')}</p>
          <h2 className="mt-5 text-d1 text-ink">{t('relatedTitle')}</h2>
          <p className="mt-4 text-lead text-ink-muted">
            {en
              ? 'Technical SEO usually arrives with a build or a measurement problem attached. These two are where that work continues.'
              : 'El SEO técnico casi nunca llega solo: suele venir con un desarrollo o una medición pendiente. Estos dos servicios son donde continúa ese trabajo.'}
          </p>
        </div>

        <ul className="scene mt-12 grid gap-6 md:grid-cols-2">
          {related.map((item) => {
            const RelatedIcon = item.icon
            return (
              <li key={item.href} className="tilt-hover rounded-xl">
                <Link
                  href={item.href}
                  className="card reveal-3d group flex h-full flex-col p-6 sm:p-7"
                >
                  <span
                    className="grad-deco inline-flex size-12 items-center justify-center rounded-xl text-white shadow-glow-brand"
                    aria-hidden="true"
                  >
                    <RelatedIcon className="size-6" />
                  </span>

                  <h3 className="mt-5 text-d3 text-ink transition-colors duration-300 group-hover:text-brand-strong">
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
          {en ? 'Or compare ' : 'O compara '}
          <Link
            href="/servicios"
            className="font-semibold text-brand-strong underline underline-offset-4 transition-colors hover:text-sky-ink"
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

      {/* ══ CTA FINAL ═════════════════════════════════════════════
          `.grad-drift` desplaza una capa al 200% con `transform` en vez de
          animar `background-position`, que repintaría el bloque completo en
          cada frame. Mismo efecto, costo cero.                          */}
      <section className="defer-paint mx-auto w-full max-w-6xl px-5 pb-20 sm:px-8 sm:pb-24">
        <div className="grad-drift reveal-scale rounded-3xl px-6 py-14 shadow-lift-3 sm:px-12 sm:py-20">
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
