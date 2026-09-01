import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import Image from 'next/image'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Rail } from '@/components/instrument/rail'
import { BLOG_POSTS } from '@/data/blog'
import {
  getPostBySlug,
  isPublished,
  loadArticle,
  getRelated,
  getNeighbours,
  routeForPost,
  pathForPost,
  postUrl,
  formatPostDate,
} from '@/lib/blog'
import { getServices } from '@/data/services'
import { generateBlogPostGraph } from '@/lib/blog-schema'
import { SITE_CONFIG, NAP } from '@/lib/constants'

/**
 * ════════════════════════════════════════════════════════════════
 * EL ARTÍCULO
 *
 * ── CÓMO FUNCIONA LA PUBLICACIÓN PROGRAMADA ──
 * Las cien páginas se generan en el build. Cada una comprueba su fecha al
 * renderizarse y responde 404 si todavía no le toca. `revalidate` hace que
 * esa respuesta se regenere periódicamente, así que el 404 se convierte en el
 * artículo el día que le corresponde SIN un despliegue.
 *
 * 900 s = 15 min. El calendario publica a las 14:00 UTC, así que en el peor
 * caso el artículo está en línea a las 14:15. Bajarlo más no compra nada: el
 * cron que manda el correo corre a la misma hora y su primer paso es pedir la
 * revalidación de esta ruta, así que en la práctica sale al minuto.
 *
 * ── EL BLOG ES SOLO EN ESPAÑOL, Y /en REDIRIGE ──
 * Servir estas 99 743 palabras en español bajo /en y declararlas `en-US` en
 * hreflang es un error que Search Console reporta. La redirección consolida
 * la señal en una sola URL en vez de repartirla entre dos.
 * ════════════════════════════════════════════════════════════════
 */

export const revalidate = 900

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

/**
 * Las cien, publicadas o no.
 *
 * Devolver solo las publicadas dejaría a las futuras fuera del build, y
 * entonces la primera petición de cada artículo nuevo tendría que renderizarlo
 * en frío. Generándolas todas, el trabajo ya está hecho y lo único que cambia
 * el día de publicación es el resultado de una comparación de fechas.
 */
export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ locale: 'es', slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post || !isPublished(post)) return { title: 'No encontrado' }

  const url = postUrl(post)

  return {
    /**
     * ── TÍTULO ABSOLUTO: SIN EL SUFIJO DE LA PLANTILLA ──
     *
     * El layout aplica `'%s | Carlos Anaya Ruiz'`, que son 20 caracteres más.
     * Medido sobre los 100: **84 títulos pasaban de 60 al servirse** y el peor
     * llegaba a 92. Con el título absoluto solo quedan 10 por encima, y el
     * peor es 72.
     *
     * Beneficio adicional: `openGraph.title` y `twitter.title` ya usaban
     * `post.title` en crudo, así que hasta ahora discrepaban 20 caracteres del
     * `<title>`. Ahora los tres coinciden entre sí y con el `<h1>`.
     *
     * En un artículo el nombre de la marca no compra nada en el título: quien
     * busca «qué es RAG» no busca por marca, y esos 20 caracteres se comen la
     * cola de la frase, que es donde están las palabras que sí importan.
     */
    title: { absolute: post.title },
    description: post.description,
    authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.url }],
    creator: SITE_CONFIG.name,
    publisher: SITE_CONFIG.name,
    /* Deduplicado. `keyword` también está en `tags` en 12 de los 100
       artículos, así que la palabra clave principal salía repetida en el
       `<meta name="keywords">` y en `BlogPosting.keywords`. Se arregla en el
       ORIGEN y no en `data/blog.ts` porque ese archivo se regenera con
       `npm run blog:data`: un arreglo escrito ahí se perdería en la siguiente
       corrida. */
    keywords: [...new Set([post.keyword, ...post.tags])],
    alternates: {
      canonical: url,
      /**
       * Solo es-MX y x-default. NO se declara en-US: no existe versión en
       * inglés, y anunciar una que redirige es un par no recíproco.
       */
      languages: { 'es-MX': url, 'x-default': url },
      /* Autodescubrimiento del feed. Lo llevaba el ÍNDICE del blog y no los
         artículos, que es al revés de donde sirve: un lector llega a un
         artículo desde una búsqueda, no al índice. */
      types: { 'application/rss+xml': `${SITE_CONFIG.url}/feed.xml` },
    },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description: post.description,
      siteName: SITE_CONFIG.name,
      locale: 'es_MX',
      publishedTime: post.publishedAt,
      modifiedTime: post.publishedAt,
      authors: [SITE_CONFIG.url],
      section: post.cluster,
      tags: [...post.tags],
      ...(post.cover
        ? {
            images: [
              {
                url: `${SITE_CONFIG.url}${post.cover}`,
                width: 1600,
                height: 900,
                alt: post.coverAlt ?? post.title,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      /* Sin `images` propio, a propósito. Declarado como cadena suelta se
         perdía el `alt`, y los artículos eran las ÚNICAS páginas del sitio
         sin `twitter:image:alt`. Las 16 rutas sí lo llevan porque
         `lib/seo.ts` no declara `twitter.images` y Next hereda el objeto
         completo de `openGraph.images`, que trae url, width, height y alt.
         Aquí ocurre lo mismo ahora. */
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params

  /* El blog existe solo en español: /en/blog/... consolida en /es/blog/...
     308 y no 307: un 307 le dice a Google que la URL original sigue siendo la
     válida, así que /en/blog/* se quedaba en el índice sin consolidar. Un 308
     permanente sí transfiere la señal. */
  if (locale !== 'es') permanentRedirect(`/es/blog/${slug}`)

  setRequestLocale(locale)

  const post = getPostBySlug(slug)
  // Un artículo que aún no sale devuelve 404, no una página «próximamente»:
  // una URL con 200 y un marcador se indexa como contenido pobre y luego hay
  // que pelear para que Google la reemplace por la versión real.
  if (!post || !isPublished(post)) notFound()

  const { html, headings, faq } = await loadArticle(post)
  const related = getRelated(post)
  const vecinos = getNeighbours(post)

  /* ── EL ENLACE AL SERVICIO ──
     Lo que convierte cien URLs de contenido en autoridad para las páginas que
     facturan. Sale del clúster y de las etiquetas del artículo, así que no hay
     una tabla que mantener a mano; y devuelve `undefined` para los clústeres
     sin destino comercial —ciberseguridad, privacidad, tendencias— porque
     mandarlos a una página de venta que no les corresponde sería relleno. */
  const rutaServicio = routeForPost(post)
  const caminoServicio = pathForPost(post)
  const servicio = rutaServicio
    ? getServices('es').find((sv) => sv.route === rutaServicio)
    : undefined
  const schema = generateBlogPostGraph(post, faq)
  const secciones = headings.filter((h) => h.level === 2)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div
        className="grid"
        style={{ gridTemplateColumns: 'var(--tape-w) minmax(0,1fr)' }}
      >
        <Rail />

        <div className="min-w-0">
          {/* ═══ CABECERA ════════════════════════════════════════
              El h1 queda FUERA de cualquier entrada escalonada: es el
              candidato a LCP de esta página y retrasar su pintado es la
              regresión que este sitio vende arreglar. */}
          <article className="px-5 pt-16 pb-20 sm:px-10">
            <div className="ledger">
              <div className="min-w-0">
                <p className="stamp">
                  {post.cluster}
                  {post.tipo === 'pillar' ? ' · guía principal' : ''}
                </p>

                {/* Escala d1 y no la de héroe: el masthead es de la
                    portada. Medido a 1440, con la escala de héroe este
                    título ocupaba seis líneas y 700 px —la primera pantalla
                    entera— y empujaba fuera de vista el primer párrafo, que
                    es justo el que se lleva el fragmento destacado. */}
                <h1 className="mt-6 max-w-[32ch] text-d1 leading-[1.08] text-ink [text-wrap:balance]">
                  {post.title}
                </h1>

                <p className="mt-8 max-w-[52ch] font-human text-lead text-ink-muted">
                  {post.description}
                </p>

                {/* La portada. `priority` porque a este tamaño es la
                    candidata a LCP por delante del titular, y una imagen LCP
                    sin precargar es exactamente el defecto que este sitio
                    audita en otros. */}
                {post.cover ? (
                  <figure className="cover mt-12 -mx-5 sm:-mx-10 lg:mx-0">
                    <Image
                      src={post.cover}
                      alt={post.coverAlt ?? post.title}
                      width={1600}
                      height={900}
                      sizes="(min-width: 80rem) 54rem, 100vw"
                      priority
                    />
                  </figure>
                ) : null}

                {/* EL CUERPO. Va como HTML porque lo produjo el renderizador
                    del repo a partir de markdown propio —no hay entrada de
                    usuario en ninguna parte de esta cadena— y todo el texto
                    pasa por escapado antes de recibir marcado. */}
                <div
                  className="article mt-12"
                  dangerouslySetInnerHTML={{ __html: html }}
                />

                {/* ── LA FIRMA ──
                    Es el nodo Person del grafo, escrito en la página. Un
                    artículo atribuido en el schema pero no a la vista es
                    justo lo que Google trata como marcado que no describe
                    el contenido. */}
                <div className="mt-16 border-t border-hairline pt-6">
                  <p className="stamp">escrito por</p>
                  <p className="mt-2 text-d3 text-ink">{SITE_CONFIG.name}</p>
                  {/* ⚠ CADA FRASE DE AQUÍ SALE DE UN ARCHIVO, y no es
                      pedantería: esta bio se sirve en 100 URLs y es el nodo
                      `Person` del grafo escrito en la página, así que es la
                      afirmación con más superficie del sitio. La anterior
                      decía «productos SaaS propios» y «empresas de servicios»:
                      los únicos `kind: 'propio'` de data/companies.ts son
                      AuraScope y LogiRoute AI —dos hackathons de un mes— y en
                      `data/` no hay una sola empresa de servicios como
                      cliente.

                      El grado sale de data/education.ts (con la forma que está
                      en el dato, «Tecnológico de Monterrey», no «Tec de
                      Monterrey»); el rol, del `title` de data/personal.ts; los
                      tres empleos, de data/companies.ts; y la última frase es
                      literalmente el `summary` de data/personal.ts. Con eso
                      queda alineada con la descripción del nodo `Person` de
                      lib/schema.ts, que es lo que este bloque dice hacer
                      visible. */}
                  <p className="mt-2 max-w-[58ch] text-sm text-ink-muted">
                    Ingeniero en Tecnologías Computacionales por el Tecnológico
                    de Monterrey. Consultor de SEO técnico e ingeniero
                    full-stack en {NAP.locality}; antes en Amazon, Master
                    Loyalty Group y Wan Hai Lines. Trabajo en la intersección
                    entre ingeniería y buscadores: datos estructurados, Core
                    Web Vitals y rendimiento web.
                  </p>
                  <p className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
                    <Link className="link-stylus" href="/contacto">
                      Trabajemos juntos →
                    </Link>
                    <Link className="link-stylus" href="/sobre-mi">
                      Sobre mí →
                    </Link>
                  </p>
                </div>
              </div>

              {/* ── EL MARGEN DE ANOTACIÓN ──
                  La ficha de la lectura y su índice. Igual que en el resto
                  del sitio: la lectura del operador va a la derecha. */}
              <aside className="margin margin-sticky">
                <div className="margin-row">
                  <span className="margin-key">publicado</span>
                  <span className="margin-val !text-ink">
                    <time dateTime={post.publishedAt}>
                      {formatPostDate(post.publishedAt)}
                    </time>
                  </span>
                </div>

                <div className="margin-row">
                  <span className="margin-key">lectura</span>
                  <span className="margin-read">
                    {post.readingMinutes}
                    <span className="ml-1.5 text-[0.6875rem] tracking-[0.12em] text-ink-subtle">
                      min
                    </span>
                  </span>
                  <span className="margin-val">
                    {post.words.toLocaleString('es-MX')} palabras
                  </span>
                </div>

                {secciones.length > 1 ? (
                  <nav className="margin-row" aria-label="Contenido">
                    <span className="margin-key">contenido</span>
                    <div className="toc mt-3">
                      {secciones.map((h) => (
                        <a key={h.id} href={`#${h.id}`}>
                          {h.text}
                        </a>
                      ))}
                    </div>
                  </nav>
                ) : null}

                <div className="margin-row">
                  <span className="margin-key">tema</span>
                  <span className="margin-val !text-ink">{post.category}</span>
                  <span className="margin-val">{post.cluster}</span>
                </div>
              </aside>
            </div>
          </article>

          {/* ═══ SEGUIR LEYENDO ══════════════════════════════════
              El enlazado interno del clúster: la guía principal, dos
              hermanos y uno de otro clúster. Se construye del dato y filtrado
              por publicados, así que la red crece con el calendario y NUNCA
              apunta a un 404 — que es lo que pasaría si los enlaces fueran
              texto escrito a mano dentro del artículo. */}
          {related.all.length ? (
            <section className="plate px-5 py-20 sm:px-10">
              <p className="stamp">seguir leyendo</p>
              <h2 className="mt-5 max-w-[18ch] text-d1">
                Del mismo registro
              </h2>

              {/* ── LA FILA DEL SERVICIO, PRIMERO ──
                  Va antes que los artículos hermanos y rotulada como
                  SERVICIO, no como lectura: es una oferta, y confundirla con
                  un artículo más sería vender a escondidas. */}
              {servicio && caminoServicio ? (
                <ul className="mt-12">
                  <li>
                    <Link href={caminoServicio} className="channel group">
                      <span className="channel-id">servicio</span>
                      <span>
                        <span className="text-d3">{servicio.title}</span>
                        <span className="channel-note mt-1 block max-w-[52ch] text-sm">
                          {servicio.description}
                        </span>
                        <span className="stamp mt-2.5 block">
                          esto es lo que hago con lo que acabas de leer
                        </span>
                        <span
                          className="channel-pen mt-3"
                          aria-hidden="true"
                        />
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
              ) : null}

              <ul className={servicio && caminoServicio ? 'mt-2' : 'mt-12'}>
                {related.all.map((other, i) => (
                  <li key={other.slug}>
                    <Link
                      href={{
                        pathname: '/blog/[slug]',
                        params: { slug: other.slug },
                      }}
                      className="channel group"
                    >
                      <span className="channel-id">
                        {String.fromCharCode(97 + i)}
                      </span>
                      <span>
                        <span className="text-d3">{other.title}</span>
                        <span className="channel-note mt-1 block max-w-[52ch] text-sm">
                          {other.description}
                        </span>
                        <span className="stamp mt-2.5 block">
                          {other.tipo === 'pillar'
                            ? 'guía principal'
                            : other.cluster}
                          {' · '}
                          {other.readingMinutes} min
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
              </ul>
            </section>
          ) : null}

          {/* ═══ ANTERIOR / SIGUIENTE ════════════════════════════
              Un camino secuencial por el archivo: se puede recorrer el corpus
              sin volver a un índice de cien entradas, y un crawler tiene por
              dónde seguir sin depender del índice. Solo entre publicados, así
              que nunca apunta a un 404. */}
          <section className="border-t border-hairline px-5 py-16 sm:px-10">
            <div className="grid gap-8 sm:grid-cols-2">
              <div className="min-w-0">
                {vecinos.anterior ? (
                  <>
                    <p className="stamp">anterior</p>
                    <Link
                      className="link-stylus mt-2 block max-w-[34ch]"
                      href={{
                        pathname: '/blog/[slug]',
                        params: { slug: vecinos.anterior.slug },
                      }}
                    >
                      ← {vecinos.anterior.title}
                    </Link>
                  </>
                ) : null}
              </div>

              <div className="min-w-0 sm:text-right">
                {vecinos.siguiente ? (
                  <>
                    <p className="stamp">siguiente</p>
                    <Link
                      className="link-stylus mt-2 block max-w-[34ch] sm:ml-auto"
                      href={{
                        pathname: '/blog/[slug]',
                        params: { slug: vecinos.siguiente.slug },
                      }}
                    >
                      {vecinos.siguiente.title} →
                    </Link>
                  </>
                ) : null}
              </div>
            </div>

            <p className="mt-12 flex flex-wrap gap-x-8 gap-y-3">
              <Link className="link-stylus text-d3" href="/blog">
                ← Todos los artículos
              </Link>
              <Link className="link-stylus" href="/servicios">
                Servicios →
              </Link>
              <Link className="link-stylus" href="/contacto">
                Escríbeme →
              </Link>
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
