import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  FileText,
  FolderKanban,
  Gauge,
  LayoutGrid,
  PenLine,
  UserRound,
  type LucideIcon,
} from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Carousel } from '@/components/ui/carousel'
import { ImageSlot } from '@/components/ui/image-slot'
import { PointerGlow } from '@/components/motion/pointer-glow'
import { Tilt3D } from '@/components/motion/tilt-3d'
import { getBooks, isAvailable } from '@/data/books'
import { NAP } from '@/lib/constants'
import { generatePageMetadata } from '@/lib/seo'
import { generateBooksPageGraph } from '@/lib/schema'
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
    route: 'libros',
    title: en
      ? 'Technical SEO & Next.js Resources'
      : 'Recursos técnicos de SEO y Next.js',
    // Dice en voz alta que no hay nada en venta. Una descripción que insinúe
    // un libro comprable gana el clic y luego pierde a quien lo dio.
    description: en
      ? 'Notes and resources on technical SEO, Next.js, Core Web Vitals and structured data. "Technical SEO with Next.js" is being written, not yet for sale.'
      : 'Recursos sobre SEO técnico, Next.js, Core Web Vitals y datos estructurados. "SEO Técnico con Next.js" está en escritura: aún no se vende.',
  })
}

/**
 * ════════════════════════════════════════════════════════════════
 * CAPAS DE FONDO — lo que hace visible el cristal
 *
 * Los CUATRO <i> son obligatorios: cada uno es un campo de color distinto y sin
 * ellos un panel translúcido sobre fondo casi blanco se ve exactamente igual
 * que un panel blanco.
 *
 * TRES secciones con aurora por página y ni una más (el pie ya trae la suya):
 * con cinco se agota el presupuesto de capas compuestas y toda animación en
 * bucle pasa a costar un recálculo de estilo por frame. Aquí son la cabecera,
 * el libro en escritura y el carrusel de recursos — las tres que llevan
 * cristal encima. La banda de cierre pone su color con `.grad-drift`, que se
 * mueve con `transform` dentro de un contenedor recortado y no gasta capa de
 * aurora.
 * Verifica: node scripts/perf-probe.mjs http://localhost:3000/es/libros
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

export default async function BooksPage({ params }: Props) {
  const { locale: rawLocale } = await params
  setRequestLocale(rawLocale)

  const locale = rawLocale as Locale
  const en = locale === 'en'

  const t = await getTranslations('books')
  const tl = await getTranslations('a11y')

  const books = getBooks(locale)
  // Hoy está vacío, y la página lo dice en lugar de tapar el hueco con un
  // botón de compra deshabilitado.
  const available = books.filter(isAvailable)
  const inProgress = books.filter((book) => !isAvailable(book))

  /** El título que protagoniza la cabecera. Hay uno solo; si algún día hay más,
   *  el primero del arreglo sigue siendo el que se muestra arriba. */
  const featured = books[0]

  /**
   * Páginas que ya existen y no cuestan nada leer. Cada href es una ruta real
   * de i18n/routing.ts — sin lead magnets, sin PDFs que nunca se escribieron.
   *
   * Son seis y no tres porque van en carrusel: una lista de más de cuatro
   * elementos se desplaza, no se apila. Cada una lleva su hueco de portada en
   * `public/libros/recursos/<slug>.png`, y el hueco escribe esa ruta en
   * pantalla mientras el archivo no exista.
   */
  const resources: {
    slug: string
    title: string
    desc: string
    href: StaticPathname
    icon: LucideIcon
  }[] = [
    {
      slug: 'seo-tecnico',
      title: en ? 'Technical SEO consulting' : 'Consultoría SEO técnica',
      desc: en
        ? 'How I work an audit: indexation, rendering, Core Web Vitals, structured data.'
        : 'Cómo trabajo una auditoría: indexación, renderizado, Core Web Vitals, datos estructurados.',
      href: '/seo-tecnico',
      icon: Gauge,
    },
    {
      slug: 'servicios',
      title: en ? 'All services' : 'Todos los servicios',
      desc: en
        ? 'Technical SEO, web development, AI automation, and dashboards.'
        : 'SEO técnico, desarrollo web, automatización con IA y dashboards.',
      href: '/servicios',
      icon: LayoutGrid,
    },
    {
      slug: 'sobre-mi',
      title: en ? 'Background' : 'Trayectoria',
      desc: en
        ? 'Tec de Monterrey engineering, PMP certification, Amazon, Master Loyalty Group, Wan Hai Lines.'
        : 'Ingeniería por el Tec de Monterrey, certificación PMP, Amazon, Master Loyalty Group, Wan Hai Lines.',
      href: '/sobre-mi',
      icon: UserRound,
    },
    {
      slug: 'proyectos',
      title: en ? 'Projects' : 'Proyectos',
      desc: en
        ? 'A map and a card per project, each with the role, the dates and the stack.'
        : 'Mapa y ficha de cada proyecto, con el rol, el periodo y el stack.',
      href: '/proyectos',
      icon: FolderKanban,
    },
    {
      slug: 'certificaciones',
      title: en ? 'Certifications' : 'Certificaciones',
      desc: en
        ? 'What is actually certified, PMP and TOEFL iBT included, and what each one covers.'
        : 'Lo que está certificado de verdad, PMP y TOEFL iBT incluidos, y qué cubre cada una.',
      href: '/certificaciones',
      icon: BadgeCheck,
    },
    {
      slug: 'cv',
      title: en ? 'Full CV' : 'CV completo',
      desc: en
        ? 'The whole track record on one page: roles, education, certifications, and stack.'
        : 'La trayectoria completa en una página: puestos, formación, certificaciones y stack.',
      href: '/cv',
      icon: FileText,
    },
  ]

  /** Recuento en vivo, derivado de data/books.ts. Nada escrito a mano. */
  const counters = [
    { label: en ? 'In writing' : 'En escritura', value: inProgress.length },
    { label: en ? 'Published' : 'Publicados', value: available.length },
  ]

  return (
    <>
      {/* Solo WebPage + BreadcrumbList. Ni nodo Book ni Offer: aquí no se puede
          comprar nada, y marcar un producto inexistente con precio es
          exactamente el dato estructurado falso que el checklist prohíbe.
          Cuando un título salga de verdad, el nodo Book va en lib/schema.ts. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBooksPageGraph(locale)),
        }}
      />

      {/* ══ HÉROE ══════════════════════════════════════════════════
          Aurora a plena intensidad, grano, cuadrícula y el resplandor del
          puntero — el único de la página. */}
      <section className="relative isolate overflow-hidden border-b border-hairline">
        <Backdrop glow />

        <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-16 lg:py-20">
          <Breadcrumbs items={[{ label: t('title') }]} />

          <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-center lg:gap-14">
            <div className="max-w-3xl">
              <p className="eyebrow enter-scale">
                <BookOpen className="size-3.5" aria-hidden="true" />
                {en ? 'Books & resources' : 'Libros y recursos'}
              </p>

              {/* El h1 se compone en línea en lugar de usar t('title') porque el
                  gradiente debe caer solo sobre la segunda palabra: un título
                  completo recortado pierde legibilidad. El texto que resulta es
                  idéntico al de `books.title`.

                  `text-ink` y no `ink-muted`: es el único color de texto que
                  aguanta ir DIRECTO sobre la aurora (10.2:1). */}
              <h1 className="enter-blur step-1 mt-6 text-hero text-ink">
                {en ? 'Technical ' : 'Recursos '}
                <span className="grad-text">{en ? 'resources' : 'técnicos'}</span>
              </h1>

              {/* Todo el texto secundario de la cabecera vive DENTRO del
                  cristal, y eso está medido: sobre la aurora `ink-muted` cae a
                  3.83:1 y `ink-subtle` a 3.23:1. Dentro de `.glass-strong`
                  miden 5.1 y 4.54. El panel es `strong` y no el cristal por
                  defecto porque las etiquetas de los contadores son
                  `ink-subtle`, que en `.glass` se queda en 4.30 y no pasa. */}
              <div className="glass glass-strong glass-spec enter step-2 mt-8 max-w-2xl p-6 sm:p-7">
                <p className="text-lead text-ink-muted">{t('subtitle')}</p>

                <p className="mt-4 text-ink-muted">
                  {en
                    ? 'Short version: one title, still in draft. This page exists so you can see what is coming and, meanwhile, get to what is already free to read.'
                    : 'Versión corta: un título, todavía en borrador. Esta página existe para que veas qué viene y, mientras tanto, para llevarte a lo que ya se puede leer gratis.'}
                </p>

                {/* Dos cifras que salen de contar el arreglo, no de escribirlas:
                    mientras nada esté publicado, la de la derecha dice cero. */}
                <dl className="mt-7 grid grid-cols-2 gap-4">
                  {counters.map((counter) => (
                    <div
                      key={counter.label}
                      className="rounded-xl bg-surface-alt px-4 py-3"
                    >
                      <dt className="text-xs font-bold uppercase tracking-wide text-ink-subtle">
                        {counter.label}
                      </dt>
                      <dd
                        data-numeric=""
                        className="grad-text mt-1 font-display text-3xl font-bold leading-none"
                      >
                        {counter.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* ── COMPOSICIÓN EN TRES PLANOS ──
                `.scene` (la perspectiva) y `.stack-3d` (el reparto en
                profundidad al pasar el mouse) van en el MISMO elemento: la
                perspectiva solo alcanza a los hijos DIRECTOS.

                Los tres planos NO se solapan, y es una regla: la etiqueta del
                hueco de imagen es a su vez un panel de cristal, y cristal
                encima de cristal difumina dos veces. La portada ocupa la
                columna izquierda; las dos fichas se reparten la derecha y el
                borde de abajo. */}
            <div className="enter-scale step-3">
              <div className="relative mx-auto w-full max-w-[23rem]">
                {/* Halo que se desplaza. Fuera del stack porque
                    `.stack-3d > *` cuenta hijos y un decorativo adentro
                    correría los índices. */}
                {/* `-inset-4` al 50%, no `-inset-5` al 65%: medido en captura a
                    390px, con más sangrado y más opacidad el halo llegaba a los
                    dos bordes de la pantalla y se leía como una banda de color
                    en vez de un resplandor. */}
                <div className="absolute -inset-4 opacity-50" aria-hidden="true">
                  <div className="grad-drift float-slow size-full rounded-[3rem]" />
                </div>

                <div className="scene stack-3d relative aspect-[5/6] [transform-style:preserve-3d]">
                  {/* Plano 1 — la portada. 800×1200 es proporción 2:3, la de
                      una sobrecubierta: no es un número decorativo, es lo que
                      el archivo tiene que medir para no deformarse. */}
                  <div className="depth-1 absolute bottom-0 left-0 z-10 w-[58%]">
                    <ImageSlot
                      path={`/libros/${featured.slug}.png`}
                      alt={featured.title}
                      hint={en ? 'Book cover' : 'Portada del libro'}
                      width={800}
                      height={1200}
                      sizes="(min-width: 1024px) 230px, 55vw"
                      className="aspect-[2/3] rounded-2xl shadow-lift-4"
                    />
                  </div>

                  {/* Plano 2 — el estado, sin fecha inventada. */}
                  <div className="depth-2 absolute right-0 top-[6%] z-20 w-[36%]">
                    <div className="glass glass-strong glass-spec p-3.5">
                      <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-strong">
                        <PenLine className="size-3" aria-hidden="true" />
                        {t('upcoming')}
                      </p>
                      <p className="mt-2 text-xs leading-snug text-ink">
                        {en ? 'No date announced' : 'Sin fecha anunciada'}
                      </p>
                    </div>
                  </div>

                  {/* Plano 3 — los dos primeros temas, leídos de data/books.ts.
                      El que se adelanta al pasar el mouse.

                      ⚠ 58% + 40% = 98%, Y ESA CUENTA ES LA REGLA. La primera
                      versión ponía 62% y 46%: los cuatro puntos de solape
                      caían justo sobre la etiqueta del hueco de imagen, que es
                      a su vez un panel de cristal —y cristal sobre cristal
                      difumina dos veces, cuesta el doble y se ve sucio. Se vio
                      en captura a 1440px antes de creérselo. */}
                  <div className="depth-3 absolute bottom-[4%] right-0 z-30 w-[40%]">
                    <div className="glass glass-strong glass-spec p-4">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-sky-ink">
                        {en ? 'Topics' : 'Temas'}
                      </p>
                      <ul className="mt-2 space-y-1">
                        {featured.tags.slice(0, 2).map((tag) => (
                          <li
                            key={tag}
                            className="text-xs font-semibold leading-snug text-ink"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ EN ESCRITURA ═══════════════════════════════════════════
          Segunda sección con aurora: el libro va en un panel de cristal grande
          y necesita color detrás para leerse como cristal.

          ⚠ Sin `.reveal*` sobre los paneles de cristal, y no es olvido:
          desplazar una superficie con `backdrop-filter` mientras se hace
          scroll obliga a volver a muestrear y difuminar el fondo en cada
          frame. Las entradas son de una sola pasada (`.enter*`) y el
          movimiento continuo lo pone la aurora, que solo mueve capas ya
          rasterizadas. */}
      <section className="relative isolate overflow-hidden border-b border-hairline">
        <Backdrop />

        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="max-w-2xl">
            <p className="eyebrow">{t('upcoming')}</p>
            <h2 className="mt-5 text-d1 text-ink">
              {en ? 'What I am writing' : 'Lo que estoy escribiendo'}
            </h2>

            {available.length === 0 ? (
              <div className="glass glass-strong glass-spec mt-6 px-5 py-4">
                <p className="text-lead text-ink-muted">
                  {en
                    ? 'Nothing is published yet, so there is nothing to buy on this page. When the book exists it will be sold from here; until then a Buy button would be a link to nowhere.'
                    : 'Todavía no hay nada publicado, así que en esta página no hay nada que comprar. Cuando el libro exista se venderá desde aquí; hasta entonces, un botón de compra sería un enlace a ningún lado.'}
                </p>
              </div>
            ) : null}
          </div>

          <ul className="mt-14 grid gap-6">
            {books.map((book) => (
              <li key={book.id} className="enter">
                {/* `strong` obligatorio: dentro hay `text-ink-subtle` (el conteo
                    de páginas y la fecha), que sobre el cristal por defecto
                    mide 4.30:1 y no pasa. */}
                <article className="glass glass-strong glass-spec p-6 sm:p-9">
                  <span
                    className="grad-deco block h-1 w-12 rounded-full"
                    aria-hidden="true"
                  />

                  <div className="mt-6 flex flex-wrap items-center gap-2">
                    {isAvailable(book) ? null : (
                      <Badge variant="gradient">
                        <PenLine className="size-3" aria-hidden="true" />
                        {t('upcoming')}
                      </Badge>
                    )}
                    {/* `neutral` y no el variant `glass`: este badge vive dentro
                        de un panel de cristal, y cristal sobre cristal difumina
                        dos veces. */}
                    {book.tags.map((tag) => (
                      <Badge key={tag} variant="neutral">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <h3 className="mt-5 text-d2 text-ink">{book.title}</h3>
                  <p className="mt-3 text-lead text-ink-muted">
                    {book.subtitle}
                  </p>
                  <p className="mt-5 max-w-[68ch] text-ink-muted">
                    {book.description}
                  </p>

                  {/* Bloques internos opacos, nunca otro cristal. */}
                  <dl className="mt-7 rounded-xl bg-surface-alt p-5">
                    <dt className="text-sm font-bold tracking-wide text-ink">
                      {t('audience')}
                    </dt>
                    <dd className="mt-2 max-w-[68ch] text-ink-muted">
                      {book.audience}
                    </dd>
                  </dl>

                  {book.pages ? (
                    <p data-numeric="" className="mt-4 text-sm text-ink-subtle">
                      ~{book.pages} {t('pages')}
                    </p>
                  ) : null}

                  {isAvailable(book) ? (
                    /* Alcanzable solo cuando `status` pase a 'available', algo
                       que el sistema de tipos no permite sin URL de compra,
                       precio y fecha de publicación reales. */
                    <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
                      <Button asChild className="sheen shadow-glow-brand">
                        <a
                          href={book.purchaseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {t('buy')}
                          <ArrowUpRight className="size-4" aria-hidden="true" />
                        </a>
                      </Button>
                      <p
                        data-numeric=""
                        className="text-sm font-semibold text-ink"
                      >
                        {book.price} {book.currency}
                      </p>
                      <time
                        dateTime={book.publishedDate}
                        data-numeric=""
                        className="text-sm text-ink-subtle"
                      >
                        {book.publishedDate}
                      </time>
                    </div>
                  ) : (
                    <div className="mt-8 rounded-xl bg-sky-wash p-5 sm:p-6">
                      {/* ⚠ AQUÍ NO SE USA `books.upcomingDesc` A PROPÓSITO. Esa
                          cadena del catálogo dice "suscríbete y te aviso", y no
                          hay a qué suscribirse: el newsletter y la base de
                          datos se eliminaron del proyecto. Se deja intacta en
                          messages/*.json —lo edita otro agente— y aquí se
                          escribe la versión que sí es cierta. Si algún día se
                          corrige la clave, este par de párrafos vuelve a ser
                          uno solo. */}
                      <p className="max-w-[68ch] text-ink-muted">
                        {en
                          ? 'It is in active writing, and that is the whole status: no pre-order, no waiting list, no launch date to hold me to.'
                          : 'Está en escritura activa, y ese es todo el estado: sin preventa, sin lista de espera y sin fecha de lanzamiento que reclamarme.'}
                      </p>

                      {/* El aviso sale de un correo escrito a mano y el botón
                          lleva a /contacto. */}
                      <p className="mt-3 max-w-[68ch] text-ink-muted">
                        {en
                          ? 'There is no mailing list: write me one line and I will tell you myself the day it is readable.'
                          : 'No hay lista de correo: escríbeme una línea y yo te aviso el día que se pueda leer.'}
                      </p>

                      {/* `expectedRelease` está vacío a propósito en
                          data/books.ts. Decir que no hay fecha es honesto;
                          inventarla es una promesa que la página no puede
                          cumplir. */}
                      <p className="mt-3 text-sm text-ink-subtle">
                        {book.expectedRelease
                          ? en
                            ? `Expected release: ${book.expectedRelease}`
                            : `Publicación estimada: ${book.expectedRelease}`
                          : en
                            ? 'No release date announced.'
                            : 'Sin fecha de publicación anunciada.'}
                      </p>

                      {/* `outline`, no el variant `glass`: está dentro de un
                          panel de cristal. */}
                      <Button asChild variant="outline" className="mt-5">
                        <Link href="/contacto">
                          {t('notifyMe')}
                          <ArrowRight className="size-4" aria-hidden="true" />
                        </Link>
                      </Button>
                    </div>
                  )}
                </article>
              </li>
            ))}
          </ul>

          {/* Sobre la aurora, sin cristal de por medio: `text-ink`, nunca
              `ink-subtle` (3.23:1). */}
          <p className="mt-8 text-sm text-ink">{t('comingSoon')}</p>
        </div>
      </section>

      {/* ══ YA PÚBLICO Y GRATIS ════════════════════════════════════
          Tercera y última sección con aurora. Carrusel y no rejilla: el
          desplazamiento y el imán son nativos (`scroll-snap`), así que si el JS
          del componente no corre el carril sigue desplazándose, y las seis
          tarjetas completas están en el HTML del servidor — un crawler las lee
          todas, a diferencia de un carrusel con estado en JS, que solo expone
          la primera lámina. */}
      <section className="defer-paint relative isolate overflow-hidden border-b border-hairline">
        <Backdrop />

        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="max-w-2xl">
            <p className="eyebrow">{en ? 'Meanwhile' : 'Mientras tanto'}</p>
            <h2 className="mt-5 text-d1 text-ink">{t('freeResources')}</h2>
            <div className="glass glass-strong glass-spec mt-6 px-5 py-4">
              <p className="text-lead text-ink-muted">
                {t('freeResourcesDesc')}
              </p>
            </div>
          </div>

          <Carousel
            label={en ? 'Free resources carousel' : 'Carrusel de recursos gratuitos'}
            prevLabel={tl('prevSlide')}
            nextLabel={tl('nextSlide')}
            className="mt-12"
          >
            {resources.map((resource) => {
              const Icon = resource.icon
              return (
                /* La inclinación sigue al puntero. `.scene` ya está en el riel
                   del carrusel, así que las seis tarjetas comparten un mismo
                   punto de fuga — que es lo que separa un 3D creíble de seis
                   tarjetas girando cada una por su cuenta.

                   El hueco de imagen y el panel de cristal son HERMANOS, no uno
                   dentro del otro: la etiqueta del hueco es a su vez cristal, y
                   anidar `backdrop-filter` difumina dos veces. Se leen como una
                   sola pieza porque el enlace los agrupa y comparten radio. */
                <Tilt3D key={resource.href} className="w-[19rem] sm:w-[22rem]">
                  <Link
                    href={resource.href}
                    className="group flex h-full flex-col gap-3 [transform-style:preserve-3d]"
                  >
                    <ImageSlot
                      path={`/libros/recursos/${resource.slug}.png`}
                      alt={resource.title}
                      hint={en ? 'Resource cover' : 'Portada del recurso'}
                      width={1200}
                      height={750}
                      sizes="(min-width: 640px) 350px, 85vw"
                      className="depth-1 aspect-[16/10] rounded-2xl shadow-lift-2"
                    />

                    <div className="glass glass-spec depth-2 flex flex-1 flex-col p-5 sm:p-6">
                      <span
                        className="grad-deco inline-flex size-11 items-center justify-center rounded-xl text-white shadow-glow-brand"
                        aria-hidden="true"
                      >
                        <Icon className="size-5" />
                      </span>

                      <h3 className="mt-4 text-d3 text-ink transition-colors duration-300 group-hover:text-brand-strong">
                        {resource.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
                        {resource.desc}
                      </p>

                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-strong">
                        {en ? 'Read it' : 'Leerlo'}
                        <ArrowUpRight
                          className="size-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </Link>
                </Tilt3D>
              )
            })}
          </Carousel>
        </div>
      </section>

      {/* ══ CTA FINAL ══════════════════════════════════════════════
          Ocupa el lugar de la banda del newsletter, que fue borrada: hace el
          mismo trabajo —avisarte cuando salga— sin base de datos detrás.

          `.grad-drift` y no una cuarta aurora: es un contenedor recortado con
          una capa al 200% que se desplaza con `transform`, así que se mueve sin
          consumir una de las tres capas compuestas del presupuesto. */}
      <section className="defer-paint mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="grad-drift reveal-scale rounded-3xl px-6 py-14 shadow-lift-3 sm:px-12 sm:py-20">
          <div className="relative max-w-2xl">
            <h2 className="text-d1 text-white">
              {en
                ? 'Want to know the day the book exists?'
                : '¿Quieres saber el día que el libro exista?'}
            </h2>
            <p className="mt-5 text-lead text-white/85">
              {en
                ? 'Tell me and I will write to you once, when it is readable. No mailing list, no automated sequence. And if you need something specific before then, describe the site instead.'
                : 'Dímelo y te escribo una sola vez, cuando se pueda leer. Sin lista de correo y sin secuencia automática. Y si necesitas algo concreto antes, cuéntame el sitio.'}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              {/* Sobre el gradiente el botón se invierte: superficie blanca con
                  texto de marca. Un relleno de marca aquí desaparecería. */}
              <Button
                asChild
                size="lg"
                className="sheen bg-none bg-surface text-brand-strong hover:opacity-95"
              >
                <Link href="/contacto">
                  {t('notifyMe')}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <a
                href={`mailto:${NAP.email}`}
                className="press inline-flex min-h-11 items-center rounded-lg px-2 text-sm font-semibold text-white underline decoration-white/50 underline-offset-4 hover:decoration-white"
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
