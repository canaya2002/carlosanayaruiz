import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Image from 'next/image'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { StaticPathname } from '@/i18n/routing'
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Check,
  FileText,
  FolderKanban,
  Sparkles,
  Trophy,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Disclosure } from '@/components/ui/disclosure'
import { Carousel } from '@/components/ui/carousel'
import { ImageSlot } from '@/components/ui/image-slot'
import { Metric } from '@/components/ui/metric'
import { Counter } from '@/components/motion/counter'
import { PointerGlow } from '@/components/motion/pointer-glow'
import { Tilt3D } from '@/components/motion/tilt-3d'
import { getServices, servicePath } from '@/data/services'
import { getSiteFaq } from '@/data/faq'
import { getSkillCategories } from '@/data/skills'
import { SEO_IMAGES, NAP, SOCIAL_LINKS } from '@/lib/constants'
import { generatePageMetadata } from '@/lib/seo'
import { generateHomeGraph } from '@/lib/schema'
import { Locale } from '@/data/types'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const en = locale === 'en'

  return generatePageMetadata({
    locale: locale as Locale,
    route: 'home',
    absoluteTitle: true,
    title: en
      ? 'Carlos Anaya Ruiz — Technical SEO Consultant'
      : 'Carlos Anaya Ruiz — Consultor SEO Técnico en CDMX',
    description: en
      ? 'Technical SEO consultant and full-stack engineer in Mexico City. Audits, structured data, Core Web Vitals and Next.js migrations that hold rankings.'
      : 'Consultor SEO técnico e ingeniero full-stack en Ciudad de México. Auditorías, datos estructurados, Core Web Vitals y migraciones a Next.js.',
  })
}

/**
 * ════════════════════════════════════════════════════════════════
 * CAPAS DE FONDO — el conjunto que hace visible el cristal
 *
 * Aurora + grano + cuadrícula, en ese orden. Van juntas porque son
 * inseparables: el cristal solo existe si hay algo saturado detrás que
 * difuminar, y sobre un fondo casi blanco un panel translúcido se ve
 * exactamente igual que un panel blanco.
 *
 * Los cuatro <i> son obligatorios: cada uno es un campo de color distinto
 * (azul de marca, cian, cielo, y un brillo blanco para que la mezcla no se vea
 * plana). Todos se mueven con `transform`, así que mientras el navegador los
 * pueda componer cuestan cero recálculos de estilo.
 *
 * ── CUÁNTAS CABEN, MEDIDO ──
 * Tres secciones con aurora, y ni una más. Con cinco (más la del pie, que ya
 * existe) se agota el presupuesto de capas compuestas de la página, el
 * navegador devuelve las animaciones al hilo principal y TODA animación en
 * bucle empieza a costar un recálculo de estilo por frame: 180 en 3 s en
 * reposo contra un presupuesto de 20. Con tres, 10.
 * Las tres son las que más cristal tienen encima: héroe, servicios y
 * trayectoria. Las demás secciones ponen su color con un gradiente fijo
 * (`.grad-soft`) o con `bg-ground-tint`, que no se animan y no cuestan capa.
 * Verifica: node scripts/perf-probe.mjs http://localhost:3000/es
 *
 * `glow` monta el resplandor que sigue al puntero. Solo se enciende en dos
 * secciones: cada instancia añade un listener de `pointermove` y una lectura de
 * geometría por frame, así que repetirlo en todas no es gratis.
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

export default async function HomePage({ params }: Props) {
  const { locale: rawLocale } = await params
  setRequestLocale(rawLocale)

  const locale = rawLocale as Locale

  const t = await getTranslations('hero')
  const tt = await getTranslations('trust')
  const ts = await getTranslations('services')
  const ta = await getTranslations('audience')
  const tr = await getTranslations('trayectoria')
  const tk = await getTranslations('stack')
  const tc = await getTranslations('homeCta')
  const tl = await getTranslations('a11y')
  const tu = await getTranslations('common')

  const services = getServices(locale)
  const faqs = getSiteFaq(locale)
  const skillCategories = getSkillCategories(locale)

  const processSteps = [
    { title: ts('step1Title'), desc: ts('step1Desc') },
    { title: ts('step2Title'), desc: ts('step2Desc') },
    { title: ts('step3Title'), desc: ts('step3Desc') },
    { title: ts('step4Title'), desc: ts('step4Desc') },
  ]

  const audiences = [
    { title: ta('startups.title'), desc: ta('startups.desc') },
    { title: ta('agencies.title'), desc: ta('agencies.desc') },
    { title: ta('established.title'), desc: ta('established.desc') },
  ]

  // Las tres páginas secundarias de trayectoria. Proyectos no está aquí: es la
  // protagonista de la sección y se escribe aparte, con su propio panel.
  // El tipo es `StaticPathname` — rutas sin parámetros —, así que enlazar aquí
  // una ruta dinámica falla en compilación y no en render.
  const trackRecord: {
    href: StaticPathname
    icon: LucideIcon
    title: string
    desc: string
    cta: string
  }[] = [
    {
      href: '/premios',
      icon: Trophy,
      title: tr('awards.title'),
      desc: tr('awards.desc'),
      cta: tr('awards.cta'),
    },
    {
      href: '/certificaciones',
      icon: BadgeCheck,
      title: tr('certifications.title'),
      desc: tr('certifications.desc'),
      cta: tr('certifications.cta'),
    },
    {
      href: '/cv',
      icon: FileText,
      title: tr('cv.title'),
      desc: tr('cv.desc'),
      cta: tr('cv.cta'),
    },
  ]

  /**
   * Credenciales. Todas verificables y todas con una página donde comprobarlas:
   * los años y los puestos en /proyectos y /cv, el PMP y el TOEFL en
   * /certificaciones. Aquí no entra ninguna cifra que no se pueda enseñar.
   *
   * `float` alterna entre las dos duraciones que existen (6 s y 9 s) para que
   * las cuatro tarjetas nunca respiren en fase.
   */
  const metrics: {
    value: ReactNode
    label: string
    hint: string
    float: string
  }[] = [
    {
      value: <Counter value={4} suffix="+" />,
      label: tt('metrics.yearsLabel'),
      hint: tt('engineerLabel'),
      float: 'float',
    },
    {
      value: 'PMP',
      label: tt('metrics.certifiedLabel'),
      hint: tt('metrics.pmpIssuer'),
      float: 'float-slow',
    },
    {
      value: <Counter value={92} />,
      label: tt('metrics.toeflLabel'),
      hint: tt('metrics.toeflHint'),
      float: 'float',
    },
    {
      value: 'CDMX',
      label: tt('metrics.cityLabel'),
      hint: tt('metrics.cityHint'),
      float: 'float-slow',
    },
  ]

  /**
   * Logos de las tres empresas donde trabajé y de la universidad. Son HUECOS,
   * no imágenes: el archivo va en public/logos/<slug>.png y el hueco escribe en
   * pantalla la ruta exacta que le falta, que es justo lo que hay que saber para
   * poder llenarlo.
   */
  const companyLogos = [
    { slug: 'amazon', name: 'Amazon' },
    { slug: 'master-loyalty-group', name: 'Master Loyalty Group' },
    { slug: 'wan-hai-lines', name: 'Wan Hai Lines' },
    { slug: 'tec-de-monterrey', name: tt('tecMty') },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateHomeGraph(locale, faqs)),
        }}
      />

      {/* ══ HÉROE ═════════════════════════════════════════════════
          Cuatro capas de fondo decorativas —aurora, grano, cuadrícula y el
          resplandor del puntero—, todas detrás del contenido y ninguna
          capturando eventos, más una composición en tres planos.            */}
      <section className="relative isolate overflow-hidden">
        <Backdrop glow />

        <div className="mx-auto w-full max-w-6xl px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-24 lg:pb-28 lg:pt-28">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-center lg:gap-14">
            <div className="max-w-3xl">
              <p className="eyebrow enter-scale">
                <Sparkles className="size-3.5" aria-hidden="true" />
                {t('eyebrow')}
              </p>

              {/* El gradiente cae solo sobre la segunda mitad, la que
                  diferencia. Un h1 completo recortado pierde legibilidad.
                  `text-ink` no es decorativo aquí: es el único color de texto
                  que aguanta ir DIRECTO sobre la aurora (10.2:1). */}
              <h1 className="enter-blur step-1 mt-6 text-hero text-ink">
                {t('headline')}{' '}
                <span className="grad-text">{t('headlineAccent')}</span>
              </h1>

              {/* ── POR QUÉ EL LEAD VA DENTRO DE CRISTAL ──
                  Medido: sobre la aurora `text-ink-muted` cae a 3.83:1 y
                  `text-ink-subtle` a 3.23:1, y ninguno pasa. Dentro de
                  `.glass-strong` el muted mide 5.1 y el subtle 4.54, y los dos
                  sí. De ahí que el panel sea `strong` y no el cristal por
                  defecto, donde el subtle se queda en 4.30. */}
              <div className="glass glass-strong glass-spec enter step-2 mt-8 max-w-2xl p-6 sm:p-7">
                <p className="text-lead text-ink-muted">{t('lead')}</p>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Button asChild size="lg" className="sheen shadow-glow-brand">
                    <Link href="/contacto">
                      {t('ctaPrimary')}
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/servicios">{t('ctaSecondary')}</Link>
                  </Button>
                </div>

                {/* El pulso de `.ping` cuesta 7 recálculos de estilo en 3 s,
                    que es lo que cuesta un indicador honesto. Cuando esta
                    página tenía aurora en cinco secciones costaba ~140: no
                    porque la clase sea caro, sino porque con el presupuesto de
                    capas agotado el navegador lo saca del compositor. Es el
                    canario de esta página — si algún día vuelve a dispararse,
                    lo que hay que contar son las auroras, no el punto. */}
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
                ordene las capas por su z real y no por su orden en el DOM. Sin
                él el retrato —que va primero para que su `nth-child(1)` sea el
                que se adelanta en hover— quedaría pintado DETRÁS del hueco de
                imagen.

                Las clases `.depth-*` dan la separación en reposo: la
                composición ya se ve en 3D antes de que nadie pase el mouse.

                En móvil va DESPUÉS del texto y no antes: medido en captura a
                390 px, la composición se comía la primera pantalla completa y
                dejaba el h1 bajo el pliegue. */}
            <div className="enter-scale step-3">
              <div className="relative mx-auto w-full max-w-[26rem]">
                {/* Halo que se desplaza. Va FUERA del stack porque
                    `.stack-3d > *` cuenta hijos y un decorativo adentro
                    correría los índices. Dos capas: `.grad-drift` fija
                    `position: relative` y le ganaría a la utilidad `absolute`
                    (está fuera de @layer), así que el posicionamiento vive en el
                    envoltorio y el gradiente que se desplaza vive dentro. */}
                <div
                  className="absolute -inset-5 opacity-65"
                  aria-hidden="true"
                >
                  <div className="grad-drift float-slow size-full rounded-[3rem]" />
                </div>

                <div className="scene stack-3d relative aspect-[5/6] [transform-style:preserve-3d]">
                  {/* Plano 1 — el retrato. Es el que se adelanta en hover. */}
                  <div className="depth-3 absolute bottom-[12%] left-0 z-30 w-[56%]">
                    <div className="relative aspect-square overflow-hidden rounded-3xl border-2 border-surface shadow-lift-4">
                      <Image
                        src={SEO_IMAGES.avatar}
                        alt={SEO_IMAGES.avatarAlt[locale]}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 260px, (min-width: 640px) 240px, 55vw"
                        priority
                      />
                    </div>
                  </div>

                  {/* Plano 2 — una credencial en cristal. Lleva `strong` porque
                      el `hint` del Metric es `text-ink-subtle`, que sobre el
                      cristal por defecto no pasaría. */}
                  <div className="depth-2 absolute bottom-0 right-0 z-20 w-[46%]">
                    <div className="glass glass-strong glass-spec p-4 sm:p-5">
                      <Metric
                        value={<Counter value={4} suffix="+" />}
                        label={tt('metrics.yearsLabel')}
                        hint={tt('engineerLabel')}
                      />
                    </div>
                  </div>

                  {/* Plano 3 — el hueco de imagen, el que se va hacia atrás.
                      La etiqueta del hueco es a su vez un panel de cristal, así
                      que un hueco NUNCA puede ir dentro de otro panel de
                      cristal: anidar `backdrop-filter` difumina dos veces y
                      cuesta el doble. */}
                  <div className="depth-1 absolute right-0 top-0 z-10 w-[86%]">
                    <ImageSlot
                      path="/inicio/captura-core-web-vitals.png"
                      alt={t('shotAlt')}
                      hint="Captura de Core Web Vitals"
                      width={1200}
                      height={750}
                      sizes="(min-width: 1024px) 360px, 80vw"
                      className="aspect-[16/10] rounded-2xl shadow-lift-3"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── CREDENCIALES ──
              Los números cuentan al entrar en pantalla, pero el valor final ya
              viene en el HTML del servidor.

              El `.float` va en el CONTENIDO, no en el panel de cristal. Mover un
              elemento con `backdrop-filter` obliga a rerasterizar el desenfoque
              en cada frame: es la misma trampa que `filter: blur()` sobre algo
              que se mueve, y fue justo el tipo de error que hacía sentir lento
              este sitio. El panel se queda quieto; respira lo de dentro. */}
          <dl
            aria-label={t('credentialsLabel')}
            className="enter step-5 mt-16 grid grid-cols-2 gap-4 sm:mt-20 sm:grid-cols-4"
          >
            {metrics.map((m) => (
              <div key={m.label} className="glass glass-strong glass-spec p-5">
                <dt className="sr-only">{m.label}</dt>
                <dd className={m.float}>
                  <Metric value={m.value} label={m.label} hint={m.hint} />
                </dd>
              </div>
            ))}
          </dl>

          {/* ── DÓNDE HE TRABAJADO ──
              `text-ink` y no `text-ink-subtle`: esta línea va directa sobre la
              aurora, sin cristal de por medio. */}
          <div className="enter step-6 mt-12 sm:mt-14">
            <p className="text-sm text-ink">
              <span className="font-semibold">{tt('companiesLabel')}:</span>{' '}
              {tt('companies')} · {tt('tecMty')}
            </p>

            <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {companyLogos.map((company) => (
                <li key={company.slug}>
                  <ImageSlot
                    path={`/logos/${company.slug}.png`}
                    alt={tt('logoAlt', { company: company.name })}
                    hint="Logo"
                    width={320}
                    height={160}
                    sizes="(min-width: 640px) 260px, 45vw"
                    className="lift h-28 w-full rounded-xl shadow-lift-1"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ══ SERVICIOS ═════════════════════════════════════════════
          Carrusel, no rejilla. El desplazamiento y el imán son nativos
          (`scroll-snap`): si el JS del componente no corre el carrusel sigue
          funcionando, y las cuatro tarjetas completas están en el HTML del
          servidor, así que un crawler las lee todas.                        */}
      <section
        id="servicios"
        className="relative isolate overflow-hidden border-y border-hairline"
      >
        <Backdrop />

        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">{ts('eyebrow')}</p>
            <h2 className="mt-5 text-d1 text-ink">{ts('title')}</h2>
            {/* Mismo motivo que en el héroe: el subtítulo es `ink-muted` y sobre
                la aurora no pasa contraste, así que va dentro de cristal. */}
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
                    href={servicePath(service, locale) as '/seo-tecnico'}
                    className="group relative flex h-full flex-col p-6 sm:p-7 [transform-style:preserve-3d]"
                  >
                    {/* La placa de cristal es el PLANO DE FONDO de la tarjeta, no
                        su contenedor: `.glass` lleva `contain: paint`, que fuerza
                        el aplanado del 3D, así que con el contenido dentro las
                        clases `.depth-*` no levantarían nada. Va en dos capas
                        porque `.glass` fija `position: relative` y le ganaría a
                        la utilidad `absolute`. */}
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

                    <span className="depth-1 mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-strong">
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

          <div className="reveal mt-8 flex flex-wrap items-center gap-5">
            <Button asChild variant="outline" size="lg">
              <Link href="/servicios">
                {ts('allServices')}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <p className="text-sm text-ink">{tu('dragHint')}</p>
          </div>
        </div>
      </section>

      {/* ══ PROCESO ═══════════════════════════════════════════════ */}
      <section className="defer-paint mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="reveal max-w-2xl">
          <p className="eyebrow">{ts('process')}</p>
          <h2 className="mt-5 text-d1 text-ink">{ts('processSubtitle')}</h2>
        </div>

        <div className="relative mt-14">
          {/* Hilo de conexión con el gradiente de marca. Va detrás de las
              tarjetas —que son opacas—, así que solo se ve en los huecos entre
              una y otra: cuatro pasos encadenados sin dibujar flechas. Solo en
              escritorio, que es donde los cuatro están en fila. */}
          <span
            className="grad-deco absolute left-[11%] right-[11%] top-12 hidden h-0.5 rounded-full opacity-70 lg:block"
            aria-hidden="true"
          />

          {/* `.scene` en la lista y `.tilt-hover` en cada elemento: la
              perspectiva alcanza solo a los hijos directos, y compartirla es lo
              que da un punto de fuga común a los cuatro pasos.

              El `.reveal-3d` va en la tarjeta INTERIOR, no en el <li>. Una
              animación con `fill: both` se queda dueña del `transform` de su
              elemento para siempre, así que en el mismo nodo que `.tilt-hover`
              mataría la inclinación al pasar el mouse.

              Aquí las tarjetas son `.card` (opacas) y no cristal a propósito:
              esta sección no lleva aurora, y sin nada saturado detrás un panel
              translúcido se ve idéntico a uno blanco — pagando el
              `backdrop-filter` a cambio de nada. */}
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
      </section>

      {/* ══ CON QUIÉN TRABAJO ═════════════════════════════════════ */}
      <section className="defer-paint border-y border-hairline bg-ground-tint">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">{ta('title')}</p>
            <h2 className="mt-5 text-d1 text-ink">{ta('subtitle')}</h2>
          </div>

          <ul className="scene mt-14 grid gap-6 md:grid-cols-3">
            {audiences.map((item) => (
              <li key={item.title} className="tilt-hover rounded-xl">
                <div className="card reveal-3d flex h-full flex-col p-6">
                  <span
                    className="grad-deco block h-1 w-12 rounded-full"
                    aria-hidden="true"
                  />
                  <h3 className="mt-5 text-d3 text-ink">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                    {item.desc}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══ TRAYECTORIA ═══════════════════════════════════════════
          Las cuatro páginas donde se puede verificar lo que el resto del sitio
          afirma. Aquí sí hay cuatro paneles de cristal: la aurora de la sección
          es lo que difuminan, y sin ella no se leerían como cristal.         */}
      <section className="defer-paint relative isolate overflow-hidden border-b border-hairline bg-ground-tint">
        <Backdrop glow />

        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">{tr('eyebrow')}</p>
            <h2 className="mt-5 text-d1 text-ink">{tr('title')}</h2>
            <div className="glass glass-strong glass-spec mt-6 px-5 py-4">
              <p className="text-lead text-ink-muted">{tr('subtitle')}</p>
            </div>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {/* Proyectos es la protagonista: ocupa las tres columnas y es la
                única con portada.

                El hueco de imagen va COMO HERMANO del panel de cristal y no
                dentro: su etiqueta es a su vez un panel de cristal, y anidar
                `backdrop-filter` está prohibido — difumina dos veces, cuesta el
                doble y se ve peor. Se leen como una sola pieza porque el enlace
                los agrupa y los dos comparten radio: `rounded-2xl` es
                exactamente el que `.glass` fija. */}
            {/* El `.reveal-scale` va en el ENVOLTORIO y el `.lift` en el
                enlace: no pueden compartir nodo. Una animación con
                `fill: both` se queda dueña del `transform` de su elemento
                para siempre, así que el panel nunca se levantaría al pasar
                el mouse. */}
            <div className="reveal-scale lg:col-span-3">
              <Link
                href="/proyectos"
                className="lift group grid h-full gap-4 sm:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]"
              >
                <div className="glass glass-spec flex flex-col p-7 sm:p-9">
                  <span
                    className="grad-deco inline-flex size-12 items-center justify-center rounded-xl text-white shadow-glow-brand"
                    aria-hidden="true"
                  >
                    <FolderKanban className="size-6" />
                  </span>

                  <h3 className="mt-5 text-d2 text-ink transition-colors duration-300 group-hover:text-brand-strong">
                    {tr('projects.title')}
                  </h3>
                  <p className="mt-3 max-w-[48ch] text-ink-muted">
                    {tr('projects.desc')}
                  </p>

                  <span className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-strong">
                    {tr('projects.cta')}
                    <ArrowUpRight
                      className="size-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </div>

                <ImageSlot
                  path="/inicio/portada-proyectos.png"
                  alt={tr('projects.coverAlt')}
                  hint="Portada de proyectos"
                  width={1200}
                  height={750}
                  sizes="(min-width: 640px) 45vw, 100vw"
                  className="min-h-56 rounded-2xl shadow-lift-2 sm:min-h-full"
                />
              </Link>
            </div>

            {trackRecord.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="glass glass-spec lift group flex flex-col p-6 sm:p-7"
                >
                  <span
                    className="grad-deco inline-flex size-11 items-center justify-center rounded-xl text-white shadow-glow-brand"
                    aria-hidden="true"
                  >
                    <Icon className="size-5" />
                  </span>

                  <h3 className="mt-5 text-d3 text-ink transition-colors duration-300 group-hover:text-brand-strong">
                    {item.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
                    {item.desc}
                  </p>

                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-strong">
                    {item.cta}
                    <ArrowUpRight
                      className="size-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══ STACK ═════════════════════════════════════════════════
          Siete categorías: más de las que caben cómodas en una rejilla, así que
          van en carrusel.

          Cristal sobre una banda de `.grad-soft` en vez de sobre aurora, y
          esto está MEDIDO, no opinado. El presupuesto de capas compuestas de
          una página es finito: cuando se agota, el navegador deja de animar en
          el compositor y vuelve al hilo principal, y entonces TODA animación
          en bucle cuesta un recálculo de estilo por frame. Con aurora en cinco
          secciones esta página medía 180 recálculos en 3 s en reposo contra un
          presupuesto de 20 — el mismo síntoma que hacía sentir lento el sitio.
          Con la aurora en tres secciones (héroe, servicios y trayectoria) baja
          a 10. Aquí el color detrás del cristal lo pone un `background-image`
          fijo, que no cuesta ningún frame porque no se anima.
          Verifica: node scripts/perf-probe.mjs http://localhost:3000/es      */}
      <section className="defer-paint grad-soft border-y border-hairline">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">{tk('eyebrow')}</p>
            <h2 className="mt-5 text-d1 text-ink">{tk('title')}</h2>
            <p className="mt-5 text-lead text-ink-muted">{tk('subtitle')}</p>
          </div>

          <Carousel
            label={tl('stackRail')}
            prevLabel={tl('prevSlide')}
            nextLabel={tl('nextSlide')}
            className="mt-10"
          >
            {skillCategories.map((cat) => (
              <div
                key={cat.category}
                className="tilt-hover w-[17rem] rounded-2xl sm:w-[20rem]"
              >
                <div className="glass glass-spec flex h-full flex-col p-5 sm:p-6">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-ink">
                    {cat.label}
                  </h3>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {cat.skills.map((skill) => (
                      <li key={skill}>
                        <Badge variant="neutral">{skill}</Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </section>

      {/* ══ FAQ ═══════════════════════════════════════════════════ */}
      <section className="defer-paint border-t border-hairline bg-ground-tint">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-20">
            <div className="reveal">
              <p className="eyebrow">{ts('faq')}</p>
              <h2 className="mt-5 text-d1 text-ink">{ts('faqSubtitle')}</h2>
            </div>

            {/* Solo preguntas sobre cómo se trabaja. Las técnicas viven en la
                página del servicio al que pertenecen, así ninguna consulta se
                responde desde dos URLs distintas.

                Un panel grande y no siete pequeños: `backdrop-filter` es lo más
                caro del sistema y las respuestas ya se separan con su propia
                línea. */}
            <div className="glass glass-spec reveal px-5 sm:px-7">
              {faqs.map((faq) => (
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

      {/* ══ CTA FINAL ═════════════════════════════════════════════ */}
      <section className="defer-paint mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        {/* `.grad-drift` desplaza una capa al 200% con `transform` en vez de
            animar `background-position`, que repintaría el bloque completo en
            cada frame. Mismo efecto, costo cero. */}
        <div className="grad-drift reveal-scale rounded-3xl px-6 py-14 shadow-lift-3 sm:px-12 sm:py-20">
          <div className="relative max-w-2xl">
            <h2 className="text-d1 text-white">{tc('title')}</h2>
            <p className="mt-5 text-lead text-white/85">{tc('lead')}</p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              {/* Sobre el gradiente el botón se invierte: superficie blanca con
                  texto de marca. Un relleno de marca aquí desaparecería.
                  `bg-none` es lo que apaga la imagen del variant. */}
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

            <p className="mt-7 text-sm text-white/75">
              {tc('alsoOn')}{' '}
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="me noopener noreferrer"
                className="font-semibold text-white underline underline-offset-4"
              >
                LinkedIn
              </a>{' '}
              {tc('and')}{' '}
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="me noopener noreferrer"
                className="font-semibold text-white underline underline-offset-4"
              >
                GitHub
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
