import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Rail } from '@/components/instrument/rail'
import { Ribbon } from '@/components/instrument/ribbon'
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
   *
   * Antes iban en un carrusel de seis tarjetas con flechas y puntos. Ahora son
   * seis canales del mismo registro: la fila entera es el enlace y lo único que
   * se mueve al pasar el puntero es el trazo de la pluma.
   */
  const resources: {
    slug: string
    title: string
    desc: string
    href: StaticPathname
  }[] = [
    {
      slug: 'seo-tecnico',
      title: en ? 'Technical SEO consulting' : 'Consultoría SEO técnica',
      desc: en
        ? 'How I work an audit: indexation, rendering, Core Web Vitals, structured data.'
        : 'Cómo trabajo una auditoría: indexación, renderizado, Core Web Vitals, datos estructurados.',
      href: '/seo-tecnico',
    },
    {
      slug: 'servicios',
      title: en ? 'All services' : 'Todos los servicios',
      desc: en
        ? 'Technical SEO, web development, AI automation, and dashboards.'
        : 'SEO técnico, desarrollo web, automatización con IA y dashboards.',
      href: '/servicios',
    },
    {
      slug: 'sobre-mi',
      title: en ? 'Background' : 'Trayectoria',
      desc: en
        ? 'Tec de Monterrey engineering, PMP certification, Amazon, Master Loyalty Group, Wan Hai Lines.'
        : 'Ingeniería por el Tec de Monterrey, certificación PMP, Amazon, Master Loyalty Group, Wan Hai Lines.',
      href: '/sobre-mi',
    },
    {
      slug: 'proyectos',
      title: en ? 'Projects' : 'Proyectos',
      desc: en
        ? 'A map and a card per project, each with the role, the dates and the stack.'
        : 'Mapa y ficha de cada proyecto, con el rol, el periodo y el stack.',
      href: '/proyectos',
    },
    {
      slug: 'certificaciones',
      title: en ? 'Certifications' : 'Certificaciones',
      desc: en
        ? 'What is actually certified, PMP and TOEFL iBT included, and what each one covers.'
        : 'Lo que está certificado de verdad, PMP y TOEFL iBT incluidos, y qué cubre cada una.',
      href: '/certificaciones',
    },
    {
      slug: 'cv',
      title: en ? 'Full CV' : 'CV completo',
      desc: en
        ? 'The whole track record on one page: roles, education, certifications, and stack.'
        : 'La trayectoria completa en una página: puestos, formación, certificaciones y stack.',
      href: '/cv',
    },
  ]

  /** Recuento en vivo, derivado de data/books.ts. Nada escrito a mano. */
  const counters = [
    { label: en ? 'In writing' : 'En escritura', value: inProgress.length },
    { label: en ? 'Published' : 'Publicados', value: available.length },
  ]

  /**
   * La cinta: los temas del libro y los títulos de lo que ya se puede leer,
   * en una sola tira que corre. Nada aquí está escrito a mano — sale de
   * data/books.ts y del arreglo de arriba.
   *
   * Va en un solo carril y con estos once nombres a propósito: con menos, la
   * pista no llena el ancho y el empalme del bucle deja un hueco visible.
   */
  const ribbonItems = [
    ...books.flatMap((book) => book.tags),
    ...resources.map((resource) => resource.title),
  ]

  /** a–f: canales paralelos, no pasos 01/02/03. */
  const channelId = (i: number) => String.fromCharCode(97 + i)

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

      <div
        className="grid"
        style={{ gridTemplateColumns: 'var(--tape-w) minmax(0,1fr)' }}
      >
        <Rail />

        <div className="min-w-0">
          {/* ═══ CABECERA ════════════════════════════════════════
              Se fue la composición de tres planos con la portada flotando:
              ese archivo no existe, y un hueco de imagen dibujado a tres
              capas era el envoltorio más grande de la página. Lo que decía
              —el estado y los temas— sigue abajo, en la fila del libro. */}
          <section className="relative px-5 pt-16 pb-20 sm:px-10">
            <p className="stamp">
              {en ? 'Books & resources' : 'Libros y recursos'}
            </p>

            <h1 className="mt-6 max-w-[12ch] text-hero text-ink">
              {t('title')}
            </h1>

            <p className="mt-10 max-w-[46ch] font-human text-lead text-ink-muted">
              {t('subtitle')}
            </p>

            <p className="mt-6 max-w-[62ch] text-ink-muted">
              {en
                ? 'Short version: one title, still in draft. This page exists so you can see what is coming and, meanwhile, get to what is already free to read.'
                : 'Versión corta: un título, todavía en borrador. Esta página existe para que veas qué viene y, mientras tanto, para llevarte a lo que ya se puede leer gratis.'}
            </p>

            {/* Dos cifras que salen de contar el arreglo, no de escribirlas:
                mientras nada esté publicado, la de abajo dice cero. */}
            <dl className="reveal-stagger mt-14">
              {counters.map((counter) => (
                <div
                  key={counter.label}
                  className="band grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6"
                >
                  <dt className="text-ink">{counter.label}</dt>
                  <dd
                    data-numeric=""
                    className="font-mono text-d2 tabular-nums text-ink"
                  >
                    {counter.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {/* ═══ LA CINTA ════════════════════════════════════════ */}
          <section
            className="overflow-hidden border-t border-hairline py-10"
            aria-labelledby="ribbon-heading"
          >
            <h2 id="ribbon-heading" className="sr-only">
              {en ? 'Topics and resources' : 'Temas y recursos'}
            </h2>
            <Ribbon
              items={ribbonItems}
              label={en ? 'Topics and resources' : 'Temas y recursos'}
              duration="72s"
            />
          </section>

          {/* ═══ EN ESCRITURA ════════════════════════════════════ */}
          <section className="border-t border-hairline px-5 py-20 sm:px-10">
            <p className="stamp">{t('upcoming')}</p>
            <h2 className="mt-5 max-w-[16ch] text-d1 text-ink">
              {en ? 'What I am writing' : 'Lo que estoy escribiendo'}
            </h2>

            {available.length === 0 ? (
              <p className="mt-6 max-w-[62ch] text-lead text-ink-muted">
                {en
                  ? 'Nothing is published yet, so there is nothing to buy on this page. When the book exists it will be sold from here; until then a Buy button would be a link to nowhere.'
                  : 'Todavía no hay nada publicado, así que en esta página no hay nada que comprar. Cuando el libro exista se venderá desde aquí; hasta entonces, un botón de compra sería un enlace a ningún lado.'}
              </p>
            ) : null}

            <ol className="reveal-stagger mt-14">
              {books.map((book) => (
                <li key={book.id} className="band py-8">
                  {/* El estado y los temas, en una sola línea mono. Antes eran
                      seis píldoras de color; dicen exactamente lo mismo. */}
                  <p className="stamp">
                    {isAvailable(book) ? null : `${t('upcoming')} · `}
                    {book.tags.join(' · ')}
                  </p>

                  <h3 className="mt-4 max-w-[24ch] text-d2 text-ink">
                    {book.title}
                  </h3>
                  <p className="mt-3 max-w-[46ch] text-lead text-ink-muted">
                    {book.subtitle}
                  </p>
                  <p className="mt-6 max-w-[68ch] text-ink-muted">
                    {book.description}
                  </p>

                  <dl className="mt-6">
                    <dt className="stamp">{t('audience')}</dt>
                    <dd className="mt-1.5 max-w-[68ch] text-ink-muted">
                      {book.audience}
                    </dd>
                  </dl>

                  {book.pages ? (
                    <p
                      data-numeric=""
                      className="stamp mt-6 tabular-nums"
                    >
                      ~{book.pages} {t('pages')}
                    </p>
                  ) : null}

                  {isAvailable(book) ? (
                    /* Alcanzable solo cuando `status` pase a 'available', algo
                       que el sistema de tipos no permite sin URL de compra,
                       precio y fecha de publicación reales. */
                    <p className="mt-8 flex flex-wrap items-baseline gap-x-8 gap-y-3">
                      <a
                        className="link-stylus text-d3"
                        href={book.purchaseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t('buy')} →
                      </a>
                      <span className="font-mono tabular-nums text-ink">
                        {book.price} {book.currency}
                      </span>
                      <time
                        dateTime={book.publishedDate}
                        data-numeric=""
                        className="stamp tabular-nums"
                      >
                        {book.publishedDate}
                      </time>
                    </p>
                  ) : (
                    <>
                      {/* ⚠ AQUÍ NO SE USA `books.upcomingDesc` A PROPÓSITO. Esa
                          cadena del catálogo dice "suscríbete y te aviso", y no
                          hay a qué suscribirse: el newsletter y la base de
                          datos se eliminaron del proyecto. Se deja intacta en
                          messages/*.json —lo edita otro agente— y aquí se
                          escribe la versión que sí es cierta. */}
                      <p className="mt-6 max-w-[68ch] font-human text-ink-muted">
                        {en
                          ? 'It is in active writing, and that is the whole status: no pre-order, no waiting list, no launch date to hold me to.'
                          : 'Está en escritura activa, y ese es todo el estado: sin preventa, sin lista de espera y sin fecha de lanzamiento que reclamarme.'}
                      </p>

                      {/* El aviso sale de un correo escrito a mano y el enlace
                          lleva a /contacto. */}
                      <p className="mt-3 max-w-[68ch] font-human text-ink-muted">
                        {en
                          ? 'There is no mailing list: write me one line and I will tell you myself the day it is readable.'
                          : 'No hay lista de correo: escríbeme una línea y yo te aviso el día que se pueda leer.'}
                      </p>

                      {/* `expectedRelease` está vacío a propósito en
                          data/books.ts. Decir que no hay fecha es honesto;
                          inventarla es una promesa que la página no puede
                          cumplir. */}
                      <p className="stamp mt-6">
                        {book.expectedRelease
                          ? en
                            ? `Expected release: ${book.expectedRelease}`
                            : `Publicación estimada: ${book.expectedRelease}`
                          : en
                            ? 'No release date announced.'
                            : 'Sin fecha de publicación anunciada.'}
                      </p>

                      <p className="mt-6">
                        <Link className="link-stylus" href="/contacto">
                          {t('notifyMe')} →
                        </Link>
                      </p>
                    </>
                  )}
                </li>
              ))}
            </ol>

            <p className="gap mt-10 pt-3 font-mono text-[0.6875rem] tracking-[0.09em]">
              {t('comingSoon')}
            </p>
          </section>

          {/* ═══ YA PÚBLICO Y GRATIS ═════════════════════════════
              La placa despejada, una sola vez en la página. Seis canales:
              la fila entera es el enlace, sin tarjeta, sin portada
              inventada y sin flechas de carrusel. */}
          <section className="plate px-5 py-20 sm:px-10">
            <p className="stamp">{en ? 'Meanwhile' : 'Mientras tanto'}</p>
            <h2 className="mt-5 max-w-[18ch] text-d1">{t('freeResources')}</h2>
            <p className="mt-5 max-w-[58ch] text-lead">
              {t('freeResourcesDesc')}
            </p>

            <ul className="mt-12">
              {resources.map((resource, i) => (
                <li key={resource.slug}>
                  <Link href={resource.href} className="channel group">
                    <span className="channel-id">ch {channelId(i)}</span>
                    <span>
                      <span className="text-d3">{resource.title}</span>
                      <span className="channel-note mt-1 block max-w-[52ch] text-sm">
                        {resource.desc}
                      </span>
                      {/* La pluma: al pasar el puntero, una línea se escribe
                          de izquierda a derecha bajo la fila. */}
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
            </ul>
          </section>

          {/* ═══ CIERRE ══════════════════════════════════════════
              Ocupa el lugar de la banda del newsletter, que fue borrada:
              hace el mismo trabajo —avisarte cuando salga— sin base de
              datos detrás. */}
          <section className="border-t border-hairline px-5 py-24 sm:px-10">
            <h2 className="max-w-[20ch] text-d1 text-ink">
              {en
                ? 'Want to know the day the book exists?'
                : '¿Quieres saber el día que el libro exista?'}
            </h2>
            <p className="mt-6 max-w-[52ch] font-human text-lead text-ink-muted">
              {en
                ? 'Tell me and I will write to you once, when it is readable. No mailing list, no automated sequence. And if you need something specific before then, describe the site instead.'
                : 'Dímelo y te escribo una sola vez, cuando se pueda leer. Sin lista de correo y sin secuencia automática. Y si necesitas algo concreto antes, cuéntame el sitio.'}
            </p>
            <p className="mt-10 flex flex-wrap items-baseline gap-x-8 gap-y-3">
              <Link className="link-stylus text-d3" href="/contacto">
                {t('notifyMe')} →
              </Link>
              <a className="link-stylus font-mono" href={`mailto:${NAP.email}`}>
                {NAP.email}
              </a>
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
