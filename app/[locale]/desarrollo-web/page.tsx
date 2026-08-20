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
import { getServiceById, getServices, servicePath } from '@/data/services'
import { NAP } from '@/lib/constants'
import { generatePageMetadata } from '@/lib/seo'
import { generateServicePageGraph } from '@/lib/schema'
import type { StaticPathname } from '@/i18n/routing'
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
 * Verifica: node scripts/perf-probe.mjs http://localhost:3000/es/desarrollo-web
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

export default async function DesarrolloWebPage({ params }: Props) {
  const { locale: rawLocale } = await params
  setRequestLocale(rawLocale)

  const locale = rawLocale as Locale
  const en = locale === 'en'

  const t = await getTranslations('servicePages.desarrolloWeb')
  const tn = await getTranslations('nav')
  const tb = await getTranslations('breadcrumbs')
  const ts = await getTranslations('services')
  const tl = await getTranslations('a11y')
  const tu = await getTranslations('common')

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
                { name: tb('home'), route: 'home' },
                { name: tn('services'), route: 'services' },
                { name: crumbLabel, route: 'desarrolloWeb' },
              ],
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
              {/* El badge ancla la página al mismo lenguaje que la tarjeta de
                  este servicio en la home, ahora a tamaño de cabecera y
                  flotando.

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
                  {en ? 'Service · Web development' : 'Servicio · Desarrollo web'}
                </p>
              </div>

              <h1 className="enter-blur step-2 mt-7 text-d1 text-ink">
                {titleLead}
                {titleAccent && <span className="grad-text">{titleAccent}</span>}
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
                    ? `From ${NAP.localityEn}, for teams in any time zone. Spanish or English.`
                    : `Desde ${NAP.locality}, para equipos en cualquier zona horaria. En español o inglés.`}
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
                        {en ? 'phases' : 'fases'}
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

      {/* ══ QUÉ CONSTRUYO ═════════════════════════════════════════
          Las tarjetas de alcance van en CARRUSEL y con inclinación que sigue
          al puntero. El desplazamiento y el imán son nativos (`scroll-snap`):
          si el JS del componente no corre el riel sigue funcionando, y las
          tarjetas completas están en el HTML del servidor.                */}
      <section className="relative isolate overflow-hidden border-y border-hairline">
        <Backdrop />

        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">{ts('benefits')}</p>
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

          {/* Resultados, no características: qué es medible diferente después. */}
          <div className="glass glass-spec reveal mt-12 p-6 sm:p-8">
            <h3 className="text-d3 text-ink">
              {en ? 'What is different afterwards' : 'Qué cambia después'}
            </h3>
            <ul className="mt-6 grid gap-x-10 gap-y-4 sm:grid-cols-2">
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

      {/* ══ CÓMO CORRE EL PROYECTO ════════════════════════════════
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
            {en
              ? 'How a build runs, phase by phase'
              : 'Cómo corre el proyecto, fase por fase'}
          </h2>
        </div>

        <div className="relative mt-14">
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

      {/* ══ ENCAJE / NO ENCAJE ════════════════════════════════════
          La segunda columna es el punto de esta sección. Lleva la misma
          tarjeta, el mismo ancho, el mismo tamaño de tipo y el mismo ritmo que
          la primera — una limitación degradada visualmente, escondida tras un
          clic o suavizada en línea de venta deja de ser una limitación.
          Lo que distingue las dos listas es la FORMA del ícono, no su color:
          el estado nunca se comunica solo con color.                      */}
      <section className="defer-paint border-y border-hairline bg-ground-tint">
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

          <div className="scene mt-14 grid gap-6 lg:grid-cols-2">
            <div className="lift rounded-xl">
              <div className="card reveal-3d h-full p-6 sm:p-8">
                <p className="eyebrow">{en ? 'Good fit' : 'Sí encaja'}</p>
                <h3 className="mt-5 text-d3 text-ink">
                  {en ? 'Who this is for' : 'Para quién es'}
                </h3>
                <ul className="mt-6">
                  {service.forWhom.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 border-t border-hairline py-4 text-ink-muted first:border-t-0 first:pt-0"
                    >
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
                <p className="eyebrow">{en ? 'Not a fit' : 'No encaja'}</p>
                <h3 className="mt-5 text-d3 text-ink">
                  {en ? 'Who this is not for' : 'Para quién no es'}
                </h3>
                <ul className="mt-6">
                  {service.notFor.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 border-t border-hairline py-4 text-ink-muted first:border-t-0 first:pt-0"
                    >
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

      {/* ══ ENTREGABLES COMPLETOS + STACK ═════════════════════════
          El color de la banda lo pone `.grad-soft`, un `background-image` fijo,
          y no una aurora: el presupuesto de capas compuestas de la página ya
          está gastado en tres secciones. Sobre ese gradiente el cristal SÍ se
          lee —hay color detrás que difuminar— y no cuesta ningún frame porque
          no se anima.                                                     */}
      <section className="defer-paint grad-soft border-b border-hairline">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">{ts('includes')}</p>
            <h2 className="mt-5 text-d1 text-ink">{t('deliverablesTitle')}</h2>
            <p className="mt-4 text-lead text-ink-muted">
              {en
                ? 'Every engagement ships all of it. Anything outside the list is quoted before it gets built.'
                : 'Todo proyecto entrega esto completo. Lo que quede fuera de la lista se cotiza antes de construirlo.'}
            </p>
          </div>

          {/* Un panel con dos columnas de filas. El divisor se apaga en la
              primera fila de cada columna, así que ninguna línea queda colgando
              del borde superior del panel. */}
          <ul className="glass glass-spec reveal mt-12 grid gap-x-10 px-6 py-2 sm:grid-cols-2 sm:px-8">
            {service.includes.map((item) => (
              <li
                key={item}
                className="flex gap-3 border-t border-hairline py-4 text-ink-muted first:border-t-0 sm:[&:nth-child(2)]:border-t-0"
              >
                <Check
                  className="mt-1 size-4 shrink-0 text-sky-ink"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="reveal mt-16 border-t border-hairline pt-12">
            <p className="eyebrow">{t('toolsTitle')}</p>
            <h2 className="mt-5 text-d3 text-ink">
              {en ? 'The stack this runs on' : 'El stack con el que corre'}
            </h2>

            {/* Tarjetas OPACAS y no de cristal, aunque haya color detrás: son
                las únicas de la página que se inclinan en 3D, y girar un
                elemento con `backdrop-filter` obliga a rerasterizar el
                desenfoque en cada frame de la transición. El cristal de esta
                banda ya lo pone el panel de entregables, que se queda quieto. */}
            <dl className="scene mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {stackGroups.map((group) => (
                <div key={group.label} className="tilt-hover rounded-xl">
                  <div className="card h-full p-5">
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
              <p className="eyebrow">FAQ</p>
              <h2 className="mt-5 text-d1 text-ink">{t('faqTitle')}</h2>
              {/* Este párrafo es `ink-muted`, que sobre la aurora mide 3.83:1:
                  va dentro de cristal o no va. */}
              <div className="glass glass-strong glass-spec mt-6 px-5 py-4">
                <p className="text-ink-muted">
                  {en
                    ? 'What people ask before starting a build.'
                    : 'Lo que me preguntan antes de arrancar un desarrollo.'}
                </p>
              </div>
            </div>

            {/* <details> nativo: las respuestas están en el HTML del servidor,
                que es exactamente lo que declara el markup FAQPage de arriba.
                El `name` compartido da el acordeón exclusivo —abrir una cierra
                la anterior— también sin JavaScript. */}
            <div className="glass glass-spec reveal px-5 sm:px-7">
              {service.faq.map((faq) => (
                <Disclosure
                  key={faq.question}
                  name="faq-desarrollo-web"
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
              ? 'A build almost always travels with one of these two.'
              : 'Un desarrollo casi siempre viaja con uno de estos dos.'}
          </p>
        </div>

        <ul className="scene mt-12 grid gap-6 md:grid-cols-2">
          {related.map((item) => {
            const RelatedIcon = item.icon
            return (
              <li key={item.id} className="tilt-hover rounded-xl">
                <Link
                  href={servicePath(item, locale) as StaticPathname}
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
          {en ? 'Or review ' : 'O revisa '}
          <Link
            href="/servicios"
            className="font-semibold text-brand-strong underline underline-offset-4 transition-colors hover:text-sky-ink"
          >
            {en
              ? 'all four services and how they combine'
              : 'los cuatro servicios y cómo se combinan'}
          </Link>
          {en ? ' before deciding.' : ' antes de decidir.'}
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
                className="sheen bg-none bg-surface text-brand-strong hover:bg-white"
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
