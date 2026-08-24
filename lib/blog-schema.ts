import type { BlogPost } from '@/data/blog'
import type { FaqPair } from '@/lib/blog-render'
import { postUrl, blogUrl } from '@/lib/blog'
import { SITE_CONFIG, SEO_IMAGES } from '@/lib/constants'
import {
  generatePersonSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  type JsonLdNode,
  type SchemaGraph,
} from '@/lib/schema'

/**
 * ════════════════════════════════════════════════════════════════
 * EL GRAFO DE UN ARTÍCULO
 *
 * ── POR QUÉ `BlogPosting` Y NO `Article` ──
 * El índice maestro pedía `Article`. `BlogPosting` es su subtipo y describe
 * mejor lo que esto es: una entrada fechada dentro de una serie periódica.
 * Un subtipo más específico nunca es peor para un consumidor del grafo —
 * hereda todas las propiedades de `Article`— y sí es mejor para uno que
 * distingue entradas de blog de páginas de contenido.
 *
 * ── EL AUTOR ES UNA ENTIDAD, NO UNA CADENA ──
 * `author` apunta por `@id` al nodo `Person` que ya existe en el grafo del
 * sitio. Poner el nombre como texto plano desperdicia lo único que hace
 * valioso al grafo: que las cien entradas queden atribuidas a la MISMA
 * entidad que las certificaciones, el CV y los proyectos. Eso es E-E-A-T
 * expresado en datos, no en una frase.
 *
 * ── QUÉ NO SE MARCA ──
 * · `wordCount` sí (es un hecho medido del archivo).
 * · `commentCount` no: no hay comentarios.
 * · `dateModified` = `datePublished` mientras no haya una edición real. Fingir
 *   una fecha de modificación reciente para parecer fresco es el clásico
 *   truco que Google verifica contra el contenido que ya tiene indexado.
 * · `speakable` no: es para asistentes de voz y este contenido no está
 *   escrito para leerse en voz alta.
 * ════════════════════════════════════════════════════════════════
 */

const AUTHOR_ID = `${SITE_CONFIG.url}/#person`

function articleNode(post: BlogPost, faq: readonly FaqPair[]): JsonLdNode {
  const url = postUrl(post)
  return {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: post.title,
    description: post.description,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    datePublished: post.publishedAt,
    // Igual que la publicación mientras nadie edite el texto. Ver arriba.
    dateModified: post.publishedAt,
    inLanguage: 'es-MX',
    author: { '@id': AUTHOR_ID },
    publisher: { '@id': AUTHOR_ID },
    isPartOf: { '@type': 'Blog', '@id': `${blogUrl()}#blog` },
    articleSection: post.cluster,
    keywords: [post.keyword, ...post.tags].join(', '),
    wordCount: post.words,
    timeRequired: `PT${post.readingMinutes}M`,
    ...(post.cover
      ? {
          image: {
            '@type': 'ImageObject',
            url: `${SITE_CONFIG.url}${post.cover}`,
            width: 1600,
            height: 900,
            ...(post.coverAlt ? { caption: post.coverAlt } : {}),
          },
        }
      : {}),
    ...(faq.length
      ? { mainEntity: { '@id': `${url}#faq` } }
      : {}),
  }
}

/** Grafo completo de la página de un artículo. */
export function generateBlogPostGraph(
  post: BlogPost,
  faq: readonly FaqPair[]
): SchemaGraph {
  const url = postUrl(post)
  const graph: JsonLdNode[] = [
    generatePersonSchema('es'),
    articleNode(post, faq),
    generateBreadcrumbSchema(
      [
        { name: 'Inicio', route: 'home' },
        { name: 'Blog', route: 'blog' },
        { name: post.title, url: `/blog/${post.slug}` },
      ],
      'es',
      url
    ),
  ]

  if (faq.length) {
    graph.push(
      generateFAQSchema(
        faq.map((f) => ({ question: f.question, answer: f.answer })),
        { locale: 'es', pageUrl: url }
      )
    )
  }

  return { '@context': 'https://schema.org', '@graph': graph }
}

/**
 * Grafo del índice.
 *
 * `Blog` con `blogPost` listando las entradas publicadas. Se listan hasta 30:
 * el nodo describe la serie, no la reemplaza, y un grafo con cien entradas
 * pesa más de lo que aporta. Las cien están en el sitemap, que es el sitio
 * donde un crawler espera encontrarlas.
 */
export function generateBlogIndexGraph(posts: readonly BlogPost[]): SchemaGraph {
  const url = blogUrl()
  return {
    '@context': 'https://schema.org',
    '@graph': [
      generatePersonSchema('es'),
      {
        '@type': 'Blog',
        '@id': `${url}#blog`,
        url,
        name: 'Blog de Carlos Anaya Ruiz',
        description:
          'Artículos técnicos sobre inteligencia artificial aplicada, ciberseguridad, desarrollo full-stack, SEO técnico, cloud y SaaS. Publicación cada martes y viernes.',
        inLanguage: 'es-MX',
        author: { '@id': AUTHOR_ID },
        publisher: { '@id': AUTHOR_ID },
        ...(SEO_IMAGES.avatar
          ? { image: `${SITE_CONFIG.url}${SEO_IMAGES.avatar}` }
          : {}),
        blogPost: posts.slice(0, 30).map((post) => ({
          '@type': 'BlogPosting',
          '@id': `${postUrl(post)}#article`,
          headline: post.title,
          url: postUrl(post),
          datePublished: post.publishedAt,
        })),
      },
      generateBreadcrumbSchema(
        [
          { name: 'Inicio', route: 'home' },
          { name: 'Blog', route: 'blog' },
        ],
        'es',
        url
      ),
    ],
  }
}
