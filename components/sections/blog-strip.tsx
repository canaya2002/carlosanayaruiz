import { Link } from '@/i18n/navigation'
import {
  getPostsForRoute,
  getPublishedPosts,
  formatPostDate,
} from '@/lib/blog'
import type { RouteKey } from '@/lib/constants'

/**
 * ════════════════════════════════════════════════════════════════
 * DEL REGISTRO — los artículos del blog en una página del sitio
 *
 * Es la mitad que faltaba del enlazado interno. Antes de esto, las únicas
 * referencias al blog en todo el sitio eran el nav y el pie —las dos al índice,
 * las dos plantilla global—: cero enlaces contextuales desde la portada
 * (prioridad 1.0), desde /servicios (0.8) o desde las cuatro páginas de
 * servicio (0.9), que son las URLs con más autoridad del dominio.
 *
 * ── LA SELECCIÓN NO SE MANTIENE A MANO ──
 * `getPostsForRoute` puntúa por clúster y por etiquetas del propio artículo, así
 * que una página de servicio recibe lo suyo sin que nadie mantenga una lista.
 * Cuando el calendario publica algo más relevante, entra solo.
 *
 * ── SE PINTA SOLO SI HAY ALGO, Y ESO NO ES ESTILO ──
 * Los primeros días no hay ningún artículo publicado: `getPostsForRoute`
 * devuelve `[]` y este componente no devuelve nada. Sin esa guarda quedarían
 * cinco páginas con un rótulo encima de una lista vacía — que es exactamente el
 * defecto que este repo ya arregló con los huecos de medio.
 *
 * ── SOLO EN ESPAÑOL ──
 * El blog es monolingüe. Enlazar contenido en español desde /en sería la misma
 * clase de par no recíproco que se acaba de cerrar en el hreflang.
 * ════════════════════════════════════════════════════════════════
 */

interface BlogStripProps {
  /**
   * La página que enlaza. Decide qué artículos son relevantes.
   *
   * En la portada no hay tema: lo que interesa ahí es lo ÚLTIMO publicado,
   * porque es la señal de que el sitio está vivo. Para eso va `'recientes'`.
   */
  route: RouteKey | 'recientes'
  locale: string
  /** Cuántos. Tres es lo que cabe sin competir con el contenido de la página. */
  limit?: number
  /** Rótulo mono. Por omisión, el vocabulario del sitio. */
  eyebrow?: string
  title?: string
}

export function BlogStrip({
  route,
  locale,
  limit = 3,
  eyebrow = 'del registro',
  title = 'Escrito sobre esto',
}: BlogStripProps) {
  if (locale !== 'es') return null

  const posts =
    route === 'recientes'
      ? getPublishedPosts().slice(0, limit)
      : getPostsForRoute(route, limit)

  if (posts.length === 0) return null

  return (
    <section className="border-t border-hairline px-5 pb-20 pt-11 sm:px-10">
      <p className="stamp">{eyebrow}</p>
      <h2 className="mt-5 max-w-[20ch] text-d2 text-ink">{title}</h2>

      <ul className="reveal-stagger mt-10 max-w-[62rem]">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={{ pathname: '/blog/[slug]', params: { slug: post.slug } }}
              className="band group grid gap-x-8 gap-y-2 py-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline"
            >
              <span className="min-w-0">
                <span className="stamp block">
                  <time dateTime={post.publishedAt}>
                    {formatPostDate(post.publishedAt)}
                  </time>
                  {post.tipo === 'pillar' ? ' · guía principal' : ''}
                </span>
                <span className="mt-2 block max-w-[46ch] text-d3 text-ink group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
                  {post.title}
                </span>
                <span className="mt-2 block max-w-[62ch] text-sm leading-relaxed text-ink-muted">
                  {post.description}
                </span>
              </span>
              <span className="stamp shrink-0 tabular-nums">
                {post.readingMinutes} min
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-8">
        <Link className="link-stylus" href="/blog">
          Todos los artículos →
        </Link>
      </p>
    </section>
  )
}
