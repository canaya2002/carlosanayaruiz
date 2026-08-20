import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Gauge,
  LayoutGrid,
  PenLine,
  UserRound,
  type LucideIcon,
} from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getBooks, isAvailable } from '@/data/books'
import { NAP } from '@/lib/constants'
import { generatePageMetadata } from '@/lib/seo'
import { generateBooksPageGraph } from '@/lib/schema'
import type { Pathname } from '@/i18n/routing'
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

export default async function BooksPage({ params }: Props) {
  const { locale: rawLocale } = await params
  setRequestLocale(rawLocale)

  const locale = rawLocale as Locale
  const en = locale === 'en'

  const t = await getTranslations('books')

  const books = getBooks(locale)
  // Hoy está vacío, y la página lo dice en lugar de tapar el hueco con un
  // botón de compra deshabilitado.
  const available = books.filter(isAvailable)
  const inProgress = books.filter((book) => !isAvailable(book))

  /**
   * Páginas que ya existen y no cuestan nada leer. Cada href es una ruta real
   * de i18n/routing.ts — sin lead magnets, sin PDFs que nunca se escribieron.
   */
  const resources: {
    title: string
    desc: string
    href: Pathname
    icon: LucideIcon
  }[] = [
    {
      title: en ? 'Technical SEO consulting' : 'Consultoría SEO técnica',
      desc: en
        ? 'How I work an audit: indexation, rendering, Core Web Vitals, structured data.'
        : 'Cómo trabajo una auditoría: indexación, renderizado, Core Web Vitals, datos estructurados.',
      href: '/seo-tecnico',
      icon: Gauge,
    },
    {
      title: en ? 'All services' : 'Todos los servicios',
      desc: en
        ? 'Technical SEO, web development, AI automation, and dashboards.'
        : 'SEO técnico, desarrollo web, automatización con IA y dashboards.',
      href: '/servicios',
      icon: LayoutGrid,
    },
    {
      title: en ? 'Background' : 'Trayectoria',
      desc: en
        ? 'Tec de Monterrey engineering, PMP certification, Amazon, Master Loyalty Group, Wan Hai Lines.'
        : 'Ingeniería por el Tec de Monterrey, certificación PMP, Amazon, Master Loyalty Group, Wan Hai Lines.',
      href: '/sobre-mi',
      icon: UserRound,
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

      {/* ══ HERO ═══════════════════════════════════════════════════
          Malla animada y cuadrícula que se desvanece: las dos son
          decorativas, las dos viven en -z-10 dentro de un contenedor
          `relative isolate` y ninguna captura eventos.               */}
      <section className="relative isolate overflow-hidden border-b border-hairline">
        <div className="mesh" aria-hidden="true" />
        <div className="grid-fade" aria-hidden="true" />

        <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
          <Breadcrumbs items={[{ label: t('title') }]} />

          <div className="mt-10 max-w-3xl">
            <p className="eyebrow enter-scale">
              <BookOpen className="size-3.5" aria-hidden="true" />
              {en ? 'Books & resources' : 'Libros y recursos'}
            </p>

            {/* El h1 se compone en línea en lugar de usar t('title') porque el
                gradiente debe caer solo sobre la segunda palabra: un título
                completo recortado pierde legibilidad. El texto que resulta es
                idéntico al de `books.title`. */}
            <h1 className="enter-blur step-1 mt-6 text-d1 text-ink">
              {en ? 'Technical ' : 'Recursos '}
              <span className="grad-text">{en ? 'resources' : 'técnicos'}</span>
            </h1>

            <span
              className="grad-fill enter step-1 mt-7 block h-1 w-12 rounded-full"
              aria-hidden="true"
            />

            <p className="enter step-2 mt-7 text-lead text-ink-muted">
              {t('subtitle')}
            </p>

            <p className="enter step-3 mt-5 max-w-[68ch] text-ink-muted">
              {en
                ? 'Short version: one title, still in draft. This page exists so you can see what is coming and, meanwhile, get to what is already free to read.'
                : 'Versión corta: un título, todavía en borrador. Esta página existe para que veas qué viene y, mientras tanto, para llevarte a lo que ya se puede leer gratis.'}
            </p>

            {/* Dos cifras que salen de contar el arreglo, no de escribirlas:
                mientras nada esté publicado, la de abajo dice cero. */}
            <dl className="enter step-4 mt-9 flex flex-wrap gap-4">
              {counters.map((counter) => (
                <div key={counter.label} className="card px-5 py-4">
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
      </section>

      {/* ══ EN ESCRITURA ═══════════════════════════════════════════ */}
      <section className="border-b border-hairline bg-ground-tint">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">{t('upcoming')}</p>
            <h2 className="mt-5 text-d1 text-ink">
              {en ? 'What I am writing' : 'Lo que estoy escribiendo'}
            </h2>

            {available.length === 0 ? (
              <p className="mt-4 text-lead text-ink-muted">
                {en
                  ? 'Nothing is published yet, so there is nothing to buy on this page. When the book exists it will be sold from here; until then a Buy button would be a link to nowhere.'
                  : 'Todavía no hay nada publicado, así que en esta página no hay nada que comprar. Cuando el libro exista se venderá desde aquí; hasta entonces, un botón de compra sería un enlace a ningún lado.'}
              </p>
            ) : null}
          </div>

          <ul className="reveal-stagger mt-14 grid gap-6">
            {books.map((book) => (
              <li key={book.id}>
                <article className="card p-6 sm:p-8">
                  <span
                    className="grad-fill block h-1 w-12 rounded-full"
                    aria-hidden="true"
                  />

                  <div className="mt-6 flex flex-wrap items-center gap-2">
                    {isAvailable(book) ? null : (
                      <Badge variant="gradient">
                        <PenLine className="size-3" aria-hidden="true" />
                        {t('upcoming')}
                      </Badge>
                    )}
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

                  {/* Sin portada: /public/images/books/ no existe, y un
                      gradiente con un ícono encima es una sobrecubierta
                      inventada. */}
                  <dl className="mt-7 rounded-xl border border-hairline bg-surface-alt p-5">
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
                    <div className="mt-8 rounded-xl bg-violet-wash p-5 sm:p-6">
                      <p className="max-w-[68ch] text-ink-muted">
                        {t('upcomingDesc')}
                      </p>

                      {/* Ya no hay lista de correo — la banda del newsletter y
                          la base de datos se eliminaron —, así que el aviso
                          sale de un correo escrito a mano y el botón lleva a
                          /contacto. */}
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

          <p className="reveal mt-8 text-sm text-ink-subtle">
            {t('comingSoon')}
          </p>
        </div>
      </section>

      {/* ══ YA PÚBLICO Y GRATIS ════════════════════════════════════ */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="reveal max-w-2xl">
          <p className="eyebrow">{en ? 'Meanwhile' : 'Mientras tanto'}</p>
          <h2 className="mt-5 text-d1 text-ink">{t('freeResources')}</h2>
          <p className="mt-4 text-lead text-ink-muted">
            {t('freeResourcesDesc')}
          </p>
        </div>

        <div className="reveal-stagger mt-14 grid gap-6 md:grid-cols-3">
          {resources.map((resource) => {
            const Icon = resource.icon
            return (
              <Link
                key={resource.href}
                href={resource.href}
                className="card card-hover group flex flex-col p-6"
              >
                <span
                  className="grad-fill inline-flex size-12 items-center justify-center rounded-xl shadow-glow-brand"
                  aria-hidden="true"
                >
                  <Icon className="size-6" />
                </span>

                <h3 className="mt-5 text-d3 text-ink transition-colors group-hover:text-brand-strong">
                  {resource.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
                  {resource.desc}
                </p>

                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-strong">
                  {en ? 'Read it' : 'Leerlo'}
                  <ArrowUpRight
                    className="size-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ══ CTA FINAL ══════════════════════════════════════════════
          Ocupa el lugar de la banda del newsletter, que fue borrada: hace el
          mismo trabajo — avisarte cuando salga — sin base de datos detrás. */}
      <section className="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-8 sm:pb-24">
        <div className="grad-animate reveal-scale relative overflow-hidden rounded-3xl px-6 py-14 shadow-lift-3 sm:px-12 sm:py-20">
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
