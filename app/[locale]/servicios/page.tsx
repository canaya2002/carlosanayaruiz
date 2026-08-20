import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { StaticPathname } from '@/i18n/routing'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  LayoutGrid,
  Sparkles,
  X,
} from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Button } from '@/components/ui/button'
import { Carousel } from '@/components/ui/carousel'
import { Disclosure } from '@/components/ui/disclosure'
import { ImageSlot } from '@/components/ui/image-slot'
import { PointerGlow } from '@/components/motion/pointer-glow'
import { Tilt3D } from '@/components/motion/tilt-3d'
import { getServices, servicePath, type ServiceId } from '@/data/services'
import { NAP } from '@/lib/constants'
import { generatePageMetadata } from '@/lib/seo'
import { generateServicesHubGraph } from '@/lib/schema'
import type { Locale, Localized } from '@/data/types'

interface Props {
  params: Promise<{ locale: string }>
}

/**
 * El síntoma que debería mandar a alguien a cada servicio.
 *
 * Va indexado por el `ServiceId` estable y no por posición del arreglo, así
 * este copy no puede terminar pegado al servicio equivocado si algún día se
 * reordena `data/services.ts`. Estos strings no tienen clave en
 * `messages/*.json`, así que van en línea por idioma — lo mismo que hace la
 * home con el copy de una sola aparición.
 *
 * Son EXCLUSIVOS de este hub: no se repiten en ninguna página de servicio, lo
 * que permite construir con ellos el acordeón de "por dónde empezar" sin que
 * dos URLs terminen respondiendo la misma consulta.
 */
const SYMPTOM: Record<ServiceId, Localized<string>> = {
  'seo-tecnico': {
    es: 'El sitio ya existe, tiene contenido y aun así no aparece donde debería.',
    en: 'The site already exists and has content, and still does not show up where it should.',
  },
  'nextjs-firebase': {
    es: 'Hay que construir o migrar el sitio, y no puede perder posiciones al hacerlo.',
    en: 'The site has to be built or migrated, and it cannot lose positions doing it.',
  },
  'ai-automation': {
    es: 'Tu equipo contesta o captura lo mismo todos los días, a mano.',
    en: 'Your team answers or types the same things every day, by hand.',
  },
  dashboards: {
    es: 'Los datos ya existen, pero nadie los mira porque viven en siete reportes distintos.',
    en: 'The data already exists, but nobody looks at it because it lives in seven separate reports.',
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const en = locale === 'en'

  return generatePageMetadata({
    locale: locale as Locale,
    route: 'services',
    title: en
      ? 'Technical SEO, Web & AI Services'
      : 'Servicios de SEO técnico, web e IA',
    description: en
      ? 'Four services: technical SEO consulting, Next.js and Firebase development, AI automation and dashboards. What each changes, and who it is for.'
      : 'Cuatro servicios: consultoría SEO técnica, desarrollo con Next.js y Firebase, automatización con IA y dashboards. Qué cambia cada uno y para quién es.',
  })
}

/**
 * ════════════════════════════════════════════════════════════════
 * CAPAS DE FONDO — el conjunto que hace visible el cristal
 *
 * Aurora + grano + cuadrícula, en ese orden y siempre juntas. El cristal solo
 * existe si hay algo saturado detrás que difuminar: sobre un fondo casi blanco
 * un panel translúcido se ve exactamente igual que un panel blanco, que es la
 * razón por la que el efecto parecía no estar.
 *
 * Los cuatro <i> son obligatorios — cada uno es un campo de color distinto
 * (azul de marca, cian, cielo y un brillo blanco para que la mezcla no se vea
 * plana). Todos se mueven con `transform`, así que mientras el navegador los
 * pueda componer cuestan cero recálculos de estilo.
 *
 * ── CUÁNTAS CABEN, MEDIDO ──
 * Tres secciones con aurora por página, y ni una más. Con cinco se agota el
 * presupuesto de capas compuestas, el navegador devuelve las animaciones al
 * hilo principal y TODA animación en bucle empieza a costar un recálculo de
 * estilo por frame: 180 en 3 s en reposo contra un presupuesto de 20.
 * Aquí las tres son las que llevan cristal encima: la cabecera, el carrusel de
 * servicios y el acordeón de "por dónde empezar". Las demás bandas ponen su
 * color con `.grad-soft` o `bg-ground-tint`, que no se animan y no cuestan capa.
 * Verifica: node scripts/perf-probe.mjs http://localhost:3000/es/servicios
 *
 * `glow` monta el resplandor que sigue al puntero. Solo en la cabecera: cada
 * instancia añade un listener de `pointermove` y una lectura de geometría por
 * frame, así que repetirlo en cada sección no es gratis.
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

export default async function ServicesHubPage({ params }: Props) {
  const { locale: rawLocale } = await params
  setRequestLocale(rawLocale)

  const locale = rawLocale as Locale
  const en = locale === 'en'

  const t = await getTranslations('hero')
  const ts = await getTranslations('services')
  const th = await getTranslations('servicesHub')
  const tl = await getTranslations('a11y')
  const tu = await getTranslations('common')

  const services = getServices(locale)

  // Subetiquetas dentro de cada fila de servicio. Se renderizan como <dt> y no
  // como encabezados, así cuatro etiquetas repetidas no agregan doce entradas
  // al outline del documento.
  const labels = {
    outcomes: en ? 'What changes for you' : 'Qué cambia para ti',
    forWhom: en ? 'Who it is for' : 'Para quién es',
    notFor: en
      ? 'When I am not the right fit'
      : 'Cuándo no soy la opción correcta',
  }

  // Las cuatro fases, iguales para los cuatro servicios: es el proceso del
  // despacho, no el de un servicio concreto. Salen de `messages/*.json` porque
  // la home renderiza las mismas cuatro y no puede haber dos redacciones.
  const processSteps = [
    { title: ts('step1Title'), desc: ts('step1Desc') },
    { title: ts('step2Title'), desc: ts('step2Desc') },
    { title: ts('step3Title'), desc: ts('step3Desc') },
    { title: ts('step4Title'), desc: ts('step4Desc') },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateServicesHubGraph(locale)),
        }}
      />

      {/* ══ CABECERA ══════════════════════════════════════════════
          Aurora, grano, cuadrícula y el resplandor del puntero, las cuatro en
          -z-10 y ninguna capturando eventos: `isolate` es lo que las mantiene
          detrás de ESTE contenido y no del resto de la página.            */}
      <section className="relative isolate overflow-hidden">
        <Backdrop glow />

        <div className="mx-auto w-full max-w-6xl px-5 pb-20 pt-12 sm:px-8 sm:pb-24 sm:pt-16">
          {/* Refleja exactamente el BreadcrumbList de generateServicesHubGraph:
              Inicio (lo renderiza el componente) → Servicios (página actual). */}
          <Breadcrumbs className="enter" items={[{ label: th('title') }]} />

          <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] lg:items-center lg:gap-16">
            <div className="max-w-2xl">
              {/* El badge del hub, a tamaño grande y flotando. El `.float` va
                  sobre un elemento con `background-image`, NUNCA sobre un panel
                  de cristal: mover algo con `backdrop-filter` obliga a
                  rerasterizar el desenfoque en cada frame, que es la misma
                  trampa que `filter: blur()` sobre algo en movimiento. */}
              <div className="flex flex-wrap items-center gap-4">
                <span
                  className="grad-deco float enter-scale inline-flex size-16 items-center justify-center rounded-3xl text-white shadow-glow-brand sm:size-20"
                  aria-hidden="true"
                >
                  <LayoutGrid className="size-8 sm:size-10" />
                </span>
                <p className="eyebrow enter-scale step-1">
                  <Sparkles className="size-3.5" aria-hidden="true" />
                  {t('eyebrow')}
                </p>
              </div>

              {/* El título es una sola palabra, así que el gradiente cae sobre
                  todo el h1. `.grad-text` se detiene en azul cielo oscuro
                  (5.7:1), nunca toca el stop cian —que mide 1.76:1— y conserva
                  `color` como respaldo real. */}
              <h1 className="enter-blur step-2 mt-7 text-hero text-ink">
                <span className="grad-text">{th('title')}</span>
              </h1>

              {/* ── POR QUÉ EL LEAD VA DENTRO DE CRISTAL ──
                  Medido: sobre la aurora `text-ink-muted` cae a 3.83:1 y
                  `text-ink-subtle` a 3.23:1, y ninguno pasa. Dentro de
                  `.glass-strong` el muted mide 5.1 y el subtle 4.54, y los dos
                  sí. De ahí que el panel sea `strong` y no el cristal por
                  defecto, donde el subtle se queda en 4.30. */}
              <div className="glass glass-strong glass-spec enter step-3 mt-8 p-6 sm:p-7">
                <p className="text-lead text-ink-muted">{th('subtitle')}</p>
                <p className="mt-4 text-ink-muted">{th('lead')}</p>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Button asChild size="lg" className="sheen shadow-glow-brand">
                    <Link href="/contacto">
                      {t('ctaPrimary')}
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </Button>
                  {/* `outline` y no `glass`: este botón vive DENTRO de un panel
                      de cristal, y cristal sobre cristal difumina dos veces,
                      cuesta el doble y se ve peor. */}
                  <Button asChild size="lg" variant="outline">
                    <Link href="/sobre-mi">{t('ctaTertiary')}</Link>
                  </Button>
                </div>

                <p className="mt-6 flex items-center gap-2.5 text-sm text-ink-subtle">
                  <span className="ping" aria-hidden="true" />
                  {t('locationNote')}
                </p>
              </div>
            </div>

            {/* ── COMPOSICIÓN EN TRES PLANOS ──
                `.scene` (la perspectiva) y `.stack-3d` (el reparto en
                profundidad al pasar el mouse) van en el MISMO elemento a
                propósito: la perspectiva solo alcanza a los hijos DIRECTOS, así
                que con el stack en un div interno las tres capas se aplanarían.

                `transform-style: preserve-3d` es lo que hace que el navegador
                ordene por z real y no por orden en el DOM, y las clases
                `.depth-*` dan la separación en reposo: la composición ya se ve
                en 3D antes de que nadie pase el mouse.

                En móvil va DESPUÉS del texto: una composición de esta altura
                arriba se come la primera pantalla y deja el h1 bajo el pliegue.

                Ningún plano es un hueco de imagen DENTRO de un panel de cristal:
                la etiqueta del hueco es a su vez cristal, y anidar
                `backdrop-filter` está prohibido. Los tres son hermanos. */}
            <div className="enter-scale step-4">
              <div className="relative mx-auto w-full max-w-[25rem]">
                {/* Halo que se desplaza. Va FUERA del stack porque
                    `.stack-3d > *` cuenta hijos y un decorativo adentro
                    correría los índices. Dos capas: `.grad-drift` fija
                    `position: relative` y le ganaría a la utilidad `absolute`,
                    así que el posicionamiento vive en el envoltorio. */}
                <div
                  className="absolute -inset-5 opacity-60"
                  aria-hidden="true"
                >
                  <div className="grad-drift float-slow size-full rounded-[3rem]" />
                </div>

                <div className="scene stack-3d relative aspect-[5/6] [transform-style:preserve-3d]">
                  {/* Plano 1 — el índice de los cuatro, en cristal. Es el que
                      se adelanta al pasar el mouse. Solo lleva `text-ink`: es
                      el único color de texto que aguanta cualquier fondo. */}
                  <div className="depth-3 absolute bottom-0 left-0 z-30 w-[82%]">
                    <div className="glass glass-strong glass-spec p-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-brand-strong">
                        {en ? 'The four' : 'Los cuatro'}
                      </p>
                      <ul className="mt-3 space-y-2">
                        {services.map((service) => (
                          <li
                            key={service.id}
                            className="flex items-center gap-2.5 text-sm text-ink"
                          >
                            <span
                              className="grad-deco size-1.5 shrink-0 rounded-full"
                              aria-hidden="true"
                            />
                            {service.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Plano 2 — la baldosa de gradiente. Blanco sobre
                      `--grad-fill` es el único uso legal de blanco del sistema:
                      todos sus stops pasan 5.3:1. El `relative` de los hijos no
                      es decorativo — `.grad-drift` mueve un ::before en -z-10 y
                      un hijo sin posicionar quedaría por debajo de él. */}
                  <div className="depth-2 absolute right-[4%] top-[36%] z-20 w-[40%]">
                    <div className="grad-drift rounded-2xl p-5 shadow-lift-3">
                      <p
                        className="relative font-display text-4xl font-bold leading-none text-white"
                        data-numeric=""
                      >
                        04
                      </p>
                      <p className="relative mt-2 text-xs font-semibold uppercase tracking-wider text-white/85">
                        {en ? 'services' : 'servicios'}
                      </p>
                    </div>
                  </div>

                  {/* Plano 3 — el hueco de portada, el que se va hacia atrás. */}
                  <div className="depth-1 absolute right-0 top-0 z-10 w-[88%]">
                    <ImageSlot
                      path="/servicios/portada-servicios.png"
                      alt={
                        en
                          ? 'Cover image for the four services'
                          : 'Imagen de portada de los cuatro servicios'
                      }
                      hint={en ? 'Services cover' : 'Portada de servicios'}
                      width={1200}
                      height={750}
                      sizes="(min-width: 1024px) 350px, 80vw"
                      className="aspect-[16/10] rounded-2xl shadow-lift-3"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ LOS CUATRO, EN CARRUSEL ═══════════════════════════════
          Carrusel y no rejilla. El desplazamiento y el imán son nativos
          (`scroll-snap`): si el JS del componente no corre el carrusel sigue
          funcionando, y las cuatro tarjetas completas están en el HTML del
          servidor, así que un crawler las lee todas — que es justo lo que un
          carrusel con estado en JavaScript rompe.                         */}
      <section className="relative isolate overflow-hidden border-y border-hairline">
        <Backdrop />

        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">{ts('eyebrow')}</p>
            <h2 className="mt-5 text-d1 text-ink">{ts('title')}</h2>
            <div className="glass glass-strong glass-spec mt-6 px-5 py-4">
              <p className="text-lead text-ink-muted">{ts('subtitle')}</p>
            </div>
          </div>

          <Carousel
            label={tl('servicesRail')}
            prevLabel={tl('prevSlide')}
            nextLabel={tl('nextSlide')}
            className="mt-12"
          >
            {services.map((service) => {
              const Icon = service.icon
              return (
                /* La inclinación sigue al puntero. `.scene` ya está en el riel
                   del carrusel, así que las cuatro tarjetas comparten un mismo
                   punto de fuga — que es lo que separa un 3D creíble de cuatro
                   tarjetas girando cada una por su cuenta. */
                <Tilt3D key={service.id} className="w-[19rem] sm:w-[23rem]">
                  <Link
                    href={servicePath(service, locale) as StaticPathname}
                    className="group relative flex h-full flex-col p-6 sm:p-7 [transform-style:preserve-3d]"
                  >
                    {/* La placa de cristal es el PLANO DE FONDO de la tarjeta,
                        no su contenedor: `.glass` lleva `contain: paint`, que
                        fuerza el aplanado del 3D, así que con el contenido
                        dentro las clases `.depth-*` no levantarían nada. Va en
                        dos capas porque `.glass` fija `position: relative` y le
                        ganaría a la utilidad `absolute`. */}
                    <span className="absolute inset-0" aria-hidden="true">
                      <span className="glass glass-spec block size-full" />
                    </span>

                    <span
                      className="grad-deco depth-2 inline-flex size-12 items-center justify-center rounded-xl text-white shadow-glow-brand"
                      aria-hidden="true"
                    >
                      <Icon className="size-6" />
                    </span>

                    <h3 className="depth-2 mt-5 text-d3 text-ink transition-colors duration-300 group-hover:text-brand-strong">
                      {service.title}
                    </h3>
                    <p className="depth-1 mt-2 text-sm text-ink-muted">
                      {service.headline}
                    </p>

                    <ul className="depth-1 mt-5 flex-1 space-y-2.5">
                      {service.outcomes.slice(0, 2).map((outcome) => (
                        <li
                          key={outcome}
                          className="flex gap-2.5 text-sm text-ink-muted"
                        >
                          <Check
                            className="mt-0.5 size-4 shrink-0 text-sky-ink"
                            aria-hidden="true"
                          />
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>

                    <span className="depth-2 mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-strong">
                      {ts('viewService')}
                      <ArrowUpRight
                        className="size-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </span>
                  </Link>
                </Tilt3D>
              )
            })}
          </Carousel>

          {/* `text-ink` y no `text-ink-subtle`: esta línea va directa sobre la
              aurora, sin cristal de por medio, y ahí solo la tinta plena
              (10.2:1) pasa contraste. */}
          <p className="reveal mt-6 text-sm text-ink">{tu('dragHint')}</p>
        </div>
      </section>

      {/* ══ POR DÓNDE EMPEZAR ═════════════════════════════════════
          Un hub se gana su URL enrutando gente, así que esto va antes del
          detalle. Cada síntoma es un <details> nativo: la respuesta está en el
          HTML del servidor abierta o cerrada, así que se indexa igual, y el
          clic da el acordeón sin una línea de JavaScript.

          El `name` compartido es lo que lo hace EXCLUSIVO —abrir uno cierra el
          anterior—, también nativo y también sin JS.                       */}
      <section className="relative isolate overflow-hidden border-b border-hairline">
        <Backdrop />

        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">
              {en ? 'Where to start' : 'Por dónde empezar'}
            </p>
            <h2 className="mt-5 text-d1 text-ink">
              {en
                ? 'Which of the four do you need?'
                : '¿Cuál de los cuatro necesitas?'}
            </h2>
            <div className="glass glass-strong glass-spec mt-6 px-5 py-4">
              <p className="text-lead text-ink-muted">{th('chooseHelp')}</p>
            </div>
          </div>

          {/* Un solo panel y no cuatro: `backdrop-filter` es lo más caro del
              sistema, y las filas ya se separan con su propia línea. */}
          <div className="glass glass-spec reveal mt-12 px-5 sm:px-8">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <Disclosure
                  key={service.id}
                  name="hub-sintoma"
                  question={SYMPTOM[service.id][locale]}
                  answer={
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                      <span
                        className="grad-deco inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-white shadow-glow-brand"
                        aria-hidden="true"
                      >
                        <Icon className="size-5" />
                      </span>
                      <div>
                        <p className="font-semibold text-ink">
                          {service.title}
                        </p>
                        <p className="mt-1">{service.headline}</p>
                        {/* El enlace repite el título del servicio: cuatro
                            enlaces "Ver el servicio" seguidos no se distinguen
                            uno de otro fuera de contexto. */}
                        <Button asChild variant="outline" className="mt-5">
                          <Link
                            href={
                              servicePath(service, locale) as StaticPathname
                            }
                          >
                            {ts('viewService')}: {service.title}
                            <ArrowUpRight
                              className="size-4"
                              aria-hidden="true"
                            />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  }
                />
              )
            })}

            {/* La nota honesta vive DENTRO del panel: es `text-ink-muted`, y
                suelta sobre la aurora mediría 3.83:1. */}
            <p className="max-w-[68ch] py-6 text-sm text-ink-muted">
              {en
                ? 'Most engagements start with one of the four, not with all of them. And sometimes the answer is none of them: if what you are missing is content or domain authority, technical work will not fix it, and I will say so on the first call instead of selling you an audit.'
                : 'La mayoría de los proyectos empiezan con uno de los cuatro, no con todos. Y a veces la respuesta es ninguno: si lo que te falta es contenido o autoridad de dominio, el trabajo técnico no lo va a resolver, y te lo digo en la primera llamada en lugar de venderte una auditoría.'}
            </p>
          </div>
        </div>
      </section>

      {/* ══ LOS CUATRO, EN LISTADO ════════════════════════════════
          El carrusel de arriba es el resumen; esto es el detalle, y las dos
          formas son deliberadas: el carrusel invita a explorar, el listado
          permite comparar. Cada fila lleva el servicio completo —resultados,
          encaje y LÍMITES— para que esta página se sostenga sola en lugar de
          ser una lista de enlaces.

          El color de la banda lo pone `.grad-soft`, un `background-image` fijo:
          esta sección no lleva aurora porque el presupuesto de capas compuestas
          ya está gastado en las tres de arriba, y un gradiente que no se anima
          no cuesta ningún frame.                                          */}
      <section className="defer-paint grad-soft border-b border-hairline">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">
              {en ? 'What each one covers' : 'Qué incluye cada uno'}
            </p>
            <h2 className="mt-5 text-d1 text-ink">
              {en
                ? 'The four, side by side'
                : 'Los cuatro, uno al lado del otro'}
            </h2>
            <p className="mt-4 text-lead text-ink-muted">{ts('subtitle')}</p>
          </div>

          {/* `.scene` en la lista y el movimiento en los hijos: la perspectiva
              alcanza solo a los hijos directos, y compartirla es lo que da un
              punto de fuga común a las cuatro filas.

              En una fila que ocupa todo el ancho el movimiento es `.lift`
              —vertical— y no `.tilt-hover`: una rotación en Y sobre un bloque
              de 72rem lo saca de su contenedor y aparece scroll horizontal. La
              inclinación que sigue al puntero se queda para las tarjetas
              angostas del carrusel, donde no desborda.
              Verifica con: npm run check:overflow

              El `.reveal-3d` va en la tarjeta INTERIOR, no en el <li>: una
              animación con `fill: both` se queda dueña del `transform` de su
              elemento para siempre, así que compartir nodo con `.lift` mataría
              el levantamiento al pasar el mouse. */}
          <ol className="scene mt-14 grid gap-6">
            {services.map((service, index) => {
              const Icon = service.icon
              const href = servicePath(service, locale) as StaticPathname

              return (
                <li
                  key={service.id}
                  id={service.id}
                  className="lift rounded-xl"
                >
                  <div className="card reveal-3d p-6 sm:p-8">
                    <div className="grid gap-8 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-14">
                      <div>
                        <div className="flex items-center gap-4">
                          <span
                            className="grad-deco float inline-flex size-14 items-center justify-center rounded-2xl text-white shadow-glow-brand"
                            aria-hidden="true"
                          >
                            <Icon className="size-7" />
                          </span>
                          <span
                            data-numeric=""
                            className="grad-text font-display text-5xl font-bold leading-none"
                          >
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        </div>

                        <h3 className="mt-5 text-d3 text-ink">
                          <Link
                            href={href}
                            className="group inline-flex items-start gap-2 transition-colors duration-300 hover:text-brand-strong"
                          >
                            {service.title}
                            <ArrowUpRight
                              className="mt-1.5 size-5 shrink-0 text-ink-subtle transition-[transform,color] duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-brand-strong"
                              aria-hidden="true"
                            />
                          </Link>
                        </h3>

                        <p className="mt-3 text-ink-muted">
                          {service.headline}
                        </p>

                        {/* El hueco de imagen puede ir DENTRO de esta tarjeta
                            porque `.card` es opaca: no hay `backdrop-filter`
                            que anidar. Dentro de un panel de cristal estaría
                            prohibido, porque la etiqueta del hueco es a su vez
                            un panel de cristal. */}
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
                          sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
                          className="sheen mt-7 aspect-[16/10] rounded-2xl shadow-lift-2"
                        />

                        {/* La etiqueta visible es idéntica en las cuatro filas,
                            así que el nombre accesible carga además el título
                            del servicio. Sigue conteniendo el texto visible
                            (WCAG 2.5.3). */}
                        <Button asChild variant="outline" className="mt-7">
                          <Link
                            href={href}
                            aria-label={`${ts('viewService')}: ${service.title}`}
                          >
                            {ts('viewService')}
                            <ArrowRight className="size-4" aria-hidden="true" />
                          </Link>
                        </Button>
                      </div>

                      <dl className="grid gap-5 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-bold tracking-wide text-ink">
                            {labels.outcomes}
                          </dt>
                          <dd className="mt-4">
                            <ul className="grid gap-2.5 sm:grid-cols-2 sm:gap-x-10">
                              {service.outcomes.map((outcome) => (
                                <li
                                  key={outcome}
                                  className="flex gap-2.5 text-sm text-ink-muted"
                                >
                                  <Check
                                    className="mt-0.5 size-4 shrink-0 text-sky-ink"
                                    aria-hidden="true"
                                  />
                                  <span>{outcome}</span>
                                </li>
                              ))}
                            </ul>
                          </dd>
                        </div>

                        {/* ── ENCAJE Y LÍMITES, AL MISMO PESO ──
                            Mismo panel, misma etiqueta, mismo tamaño de texto y
                            el mismo ritmo. Los límites declarados son la señal
                            de confianza de esta página: mandarlos a letra chica,
                            esconderlos tras un clic o suavizarlos en línea de
                            venta anula el motivo por el que están escritos.
                            La lista de límites se distingue por la FORMA del
                            ícono (una X) y no por el color: el estado nunca se
                            comunica solo con color. */}
                        <div className="rounded-xl border border-hairline bg-surface-alt p-5">
                          <dt className="text-sm font-bold tracking-wide text-ink">
                            {labels.forWhom}
                          </dt>
                          <dd className="mt-3">
                            <ul className="space-y-2.5">
                              {service.forWhom.map((item) => (
                                <li
                                  key={item}
                                  className="flex gap-2.5 text-sm text-ink-muted"
                                >
                                  <Check
                                    className="mt-0.5 size-4 shrink-0 text-sky-ink"
                                    aria-hidden="true"
                                  />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </dd>
                        </div>

                        <div className="rounded-xl border border-hairline bg-surface-alt p-5">
                          <dt className="text-sm font-bold tracking-wide text-ink">
                            {labels.notFor}
                          </dt>
                          <dd className="mt-3">
                            <ul className="space-y-2.5">
                              {service.notFor.map((item) => (
                                <li
                                  key={item}
                                  className="flex gap-2.5 text-sm text-ink-muted"
                                >
                                  <X
                                    className="mt-0.5 size-4 shrink-0 text-ink-subtle"
                                    aria-hidden="true"
                                  />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      {/* ══ CÓMO TRABAJO ══════════════════════════════════════════
          Las mismas cuatro fases para los cuatro servicios. Aquí sí hay
          inclinación 3D al pasar el mouse: las columnas son angostas, así que
          la rotación no desborda el contenedor.

          Tarjetas `.card` (opacas) y no cristal a propósito: esta sección no
          lleva aurora, y sin nada saturado detrás un panel translúcido se ve
          idéntico a uno blanco — pagando el `backdrop-filter` a cambio de nada. */}
      <section className="defer-paint border-b border-hairline bg-ground-tint">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">{ts('process')}</p>
            <h2 className="mt-5 text-d1 text-ink">{ts('processSubtitle')}</h2>
          </div>

          <div className="relative mt-14">
            {/* Hilo de conexión con el gradiente de marca. Va detrás de las
                tarjetas —que son opacas—, así que solo se ve en los huecos
                entre una y otra: cuatro pasos encadenados sin dibujar flechas.
                Solo en escritorio, que es donde los cuatro están en fila. */}
            <span
              className="grad-deco absolute left-[11%] right-[11%] top-12 hidden h-0.5 rounded-full opacity-70 lg:block"
              aria-hidden="true"
            />

            <ol className="scene grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((step, index) => (
                <li key={step.title} className="tilt-hover rounded-xl">
                  <div className="card reveal-3d flex h-full flex-col p-6">
                    <span
                      className="grad-text font-display text-5xl font-bold leading-none"
                      data-numeric=""
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-4 text-d3 text-ink">{step.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                      {step.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ══ CTA ═══════════════════════════════════════════════════
          `.grad-drift` desplaza una capa al 200% con `transform` en vez de
          animar `background-position`, que repintaría el bloque completo en
          cada frame. Mismo efecto, costo cero.                          */}
      <section className="defer-paint mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="grad-drift reveal-scale rounded-3xl px-6 py-14 shadow-lift-3 sm:px-12 sm:py-20">
          <div className="relative max-w-2xl">
            <h2 className="text-d1 text-white">
              {en
                ? 'Not sure which one applies? Describe the problem.'
                : '¿No sabes cuál aplica? Descríbeme el problema.'}
            </h2>
            <p className="mt-5 text-lead text-white/85">
              {en
                ? 'Send the URL, what changed, and since when. I reply within 24 to 48 business hours with a first read on which of the four — if any — is worth starting with.'
                : 'Mándame la URL, qué cambió y desde cuándo. Respondo en 24 a 48 horas hábiles con una primera lectura de con cuál de los cuatro conviene empezar, si con alguno.'}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              {/* Sobre el gradiente el botón se invierte: superficie blanca con
                  texto de marca. `bg-none` es lo que apaga la imagen del
                  variant; sin él el botón seguiría pintando el mismo gradiente
                  de su banda y desaparecería dentro de ella. */}
              <Button
                asChild
                size="lg"
                className="sheen bg-none bg-surface text-brand-strong hover:bg-white"
              >
                <Link href="/contacto">
                  {t('ctaPrimary')}
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
          </div>
        </div>
      </section>
    </>
  )
}
