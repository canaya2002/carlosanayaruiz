import type { Metadata } from 'next'
import { permanentRedirect } from 'next/navigation'
import Image from 'next/image'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Rail } from '@/components/instrument/rail'
import { BLOG_POSTS, BLOG_CLUSTERS } from '@/data/blog'
import {
  getPublishedPosts,
  getNextPost,
  formatPostDate,
  blogUrl,
} from '@/lib/blog'
import { generateBlogIndexGraph } from '@/lib/blog-schema'
import { SITE_CONFIG } from '@/lib/constants'

/**
 * ════════════════════════════════════════════════════════════════
 * EL ÍNDICE DEL BLOG
 *
 * Se revalida cada 15 minutos por lo mismo que los artículos: el calendario
 * publica cada martes y viernes a las 14:00 UTC y el índice tiene que
 * enterarse sin un despliegue.
 *
 * ── LO QUE ESTE ÍNDICE NO TIENE, Y ES DELIBERADO ──
 * No hay páginas de categoría. Las doce categorías reparten muy desigual
 * —una tiene un artículo, otra dieciocho— así que doce archivos serían nueve
 * páginas de contenido pobre compitiendo con las pillar, que son los hubs de
 * verdad de cada clúster. El agrupado vive AQUÍ, en el índice, y los hubs son
 * los artículos marcados como guía principal.
 *
 * No hay paginación todavía. Con cien artículos repartidos en cincuenta
 * semanas, el índice pasa de 20 entradas hacia el tercer mes; cuando eso
 * llegue, se pagina. Montar la paginación hoy sería construirla contra un
 * volumen que no existe.
 * ════════════════════════════════════════════════════════════════
 */

export const revalidate = 900

interface Props {
  params: Promise<{ locale: string }>
}

/**
 * 49 caracteres medían 70 con el sufijo de la plantilla (« | Carlos Anaya
 * Ruiz», 20). Google recorta alrededor de 60, así que el título de la página
 * tiene que caber en ~40. Este mide 30 y llega a 50 con el sufijo.
 */
const TITLE = 'Blog técnico: IA, código y SEO'
const DESCRIPTION =
  'Artículos técnicos sobre IA aplicada, ciberseguridad, desarrollo full-stack, SEO y cloud. Sin humo y con lo que sí funciona en producción. Cada martes y viernes.'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (locale !== 'es') return { title: TITLE }

  const url = blogUrl()
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: {
      canonical: url,
      // Sin en-US: el blog existe solo en español. Ver lib/blog.ts.
      languages: { 'es-MX': url, 'x-default': url },
      types: { 'application/rss+xml': `${SITE_CONFIG.url}/feed.xml` },
    },
    openGraph: {
      type: 'website',
      url,
      title: TITLE,
      description: DESCRIPTION,
      siteName: SITE_CONFIG.name,
      locale: 'es_MX',
    },
  }
}

export default async function BlogIndexPage({ params }: Props) {
  const { locale } = await params
  // 308, no 307: ver la nota de la página del artículo.
  if (locale !== 'es') permanentRedirect('/es/blog')
  setRequestLocale(locale)

  const posts = getPublishedPosts()
  const siguiente = getNextPost()
  const schema = generateBlogIndexGraph(posts)

  /* Los clústeres que ya tienen algo publicado, en el orden del índice
     maestro. Un clúster vacío no se anuncia: el calendario tarda cincuenta
     semanas en llegar al último y rotular diez secciones para llenar dos
     sería el error del dial que rotulaba cinco plumas y dibujaba cuatro. */
  const conContenido = BLOG_CLUSTERS.filter((c) =>
    posts.some((p) => p.cluster === c)
  )

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
          {/* ═══ CABECERA ════════════════════════════════════════ */}
          <section className="hero-in relative px-5 pt-16 pb-16 sm:px-10">
            <div className="ledger">
              <div className="min-w-0">
                <p className="stamp">el registro · publicación continua</p>

                <h1 className="mt-6 max-w-[16ch] text-hero text-ink">
                  Blog técnico
                </h1>

                <p className="mt-10 max-w-[52ch] font-human text-lead text-ink-muted">
                  {DESCRIPTION}
                </p>

                <p className="mt-8 max-w-[62ch] text-ink-muted">
                  Cien artículos escritos y programados, uno cada martes y cada
                  viernes. Nada de esto es contenido de relleno para llenar un
                  calendario: cada entrada sale de trabajo hecho en producción,
                  y las que hablan de números traen los números.
                </p>
              </div>

              {/* ── EL MARGEN DE ANOTACIÓN ──
                  La lectura de la serie. Todas las cifras se cuentan del
                  dato: si mañana entra un artículo, cambian solas. */}
              <aside className="margin margin-sticky">
                <div className="margin-row">
                  <span className="margin-key">publicados</span>
                  <span className="margin-read">
                    {posts.length}
                    <span className="ml-1.5 text-[0.6875rem] tracking-[0.12em] text-ink-subtle">
                      / {BLOG_POSTS.length}
                    </span>
                  </span>
                  <span className="margin-val">
                    la serie completa está escrita.
                  </span>
                </div>

                <div className="margin-row">
                  <span className="margin-key">cadencia</span>
                  <span className="margin-val !text-ink">
                    martes y viernes
                  </span>
                  <span className="margin-val">08:00, Ciudad de México</span>
                </div>

                {/* El siguiente en salir. Es un dato que ya existe, y decirlo
                    da una razón para volver. */}
                {siguiente ? (
                  <div className="margin-row">
                    <span className="margin-key">siguiente</span>
                    <span className="margin-val !text-ink">
                      <time dateTime={siguiente.publishedAt}>
                        {formatPostDate(siguiente.publishedAt)}
                      </time>
                    </span>
                    <span className="margin-val">{siguiente.cluster}</span>
                  </div>
                ) : null}

                <div className="margin-row">
                  <span className="margin-key">rss</span>
                  <a
                    className="link-stylus font-mono text-[0.6875rem] tracking-[0.04em]"
                    href="/feed.xml"
                  >
                    /feed.xml →
                  </a>
                </div>
              </aside>
            </div>
          </section>

          {/* ═══ LAS ENTRADAS, POR CLÚSTER ═══════════════════════
              Agrupadas por clúster y no en una sola lista cronológica: el
              índice maestro es una arquitectura de topic clusters, y
              mostrarla es lo que le dice al lector —y al crawler— que esto
              es un cuerpo de trabajo y no un montón de posts. */}
          {posts.length === 0 ? (
            <section className="border-t border-hairline px-5 py-20 sm:px-10">
              <p className="stamp">todavía nada</p>
              <h2 className="mt-5 max-w-[24ch] text-d1 text-ink">
                El primero sale el{' '}
                {siguiente ? formatPostDate(siguiente.publishedAt) : 'martes'}
              </h2>
              <p className="mt-6 max-w-[54ch] text-lead text-ink-muted">
                Los cien artículos están escritos y programados. Esta página no
                lista ninguno todavía porque ninguno ha salido — y una fecha
                falsa para parecer activo es exactamente lo que este sitio no
                hace.
              </p>
            </section>
          ) : (
            conContenido.map((cluster) => {
              const delCluster = posts.filter((p) => p.cluster === cluster)
              return (
                <section
                  key={cluster}
                  className="border-t border-hairline px-5 py-16 sm:px-10"
                  aria-labelledby={`c-${cluster.replace(/\s+/g, '-')}`}
                >
                  <p className="stamp">
                    {delCluster.length}{' '}
                    {delCluster.length === 1 ? 'artículo' : 'artículos'}
                  </p>
                  <h2
                    id={`c-${cluster.replace(/\s+/g, '-')}`}
                    className="mt-4 max-w-[22ch] text-d2 text-ink"
                  >
                    {cluster}
                  </h2>

                  <div className="reveal-stagger mt-10 max-w-[62rem]">
                    {delCluster.map((post) => (
                      <Link
                        key={post.slug}
                        href={{
                          pathname: '/blog/[slug]',
                          params: { slug: post.slug },
                        }}
                        className="entry group"
                      >
                        {post.cover ? (
                          <span className="cover cover-thumb">
                            <Image
                              src={post.cover}
                              alt={post.coverAlt ?? post.title}
                              width={1600}
                              height={900}
                              sizes="(min-width: 40rem) 15rem, 100vw"
                            />
                          </span>
                        ) : (
                          /* Sin portada no se dibuja una caja vacía: la
                             celda simplemente no existe y el texto ocupa el
                             ancho. Es la misma regla que los huecos de
                             medio del resto del sitio. */
                          <span className="hidden sm:block" aria-hidden="true" />
                        )}

                        <span className="min-w-0">
                          <span className="stamp block">
                            <time dateTime={post.publishedAt}>
                              {formatPostDate(post.publishedAt)}
                            </time>
                            {post.tipo === 'pillar'
                              ? ' · guía principal'
                              : ''}
                          </span>

                          <span className="entry-title mt-2.5 block">
                            {post.title}
                          </span>

                          <span className="mt-2.5 block max-w-[62ch] text-sm leading-relaxed text-ink-muted">
                            {post.description}
                          </span>

                          <span className="stamp mt-3 block">
                            {post.readingMinutes} min de lectura
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              )
            })
          )}
        </div>
      </div>
    </>
  )
}
