import { getPublishedPosts, postUrl, blogUrl } from '@/lib/blog'
import { SITE_CONFIG, NAP } from '@/lib/constants'

/**
 * ════════════════════════════════════════════════════════════════
 * /feed.xml — RSS 2.0
 *
 * ── POR QUÉ EXISTE ──
 * No es nostalgia. Un feed es la forma en que los agregadores, los lectores
 * de terceros y varios rastreadores de IA descubren contenido nuevo sin
 * esperar a que Google lo indexe, y es la única suscripción que no depende
 * de que alguien entregue su correo. En un blog que publica dos veces por
 * semana durante cincuenta semanas, eso importa.
 *
 * ── SOLO LOS PUBLICADOS ──
 * Igual que el sitemap: listar un artículo antes de su fecha lo filtraría a
 * los suscriptores antes de que exista la página, y quien haga clic se
 * encontraría un 404.
 *
 * ── SE REVALIDA ──
 * Cada 15 minutos, para que el artículo del martes esté en el feed el martes
 * sin desplegar nada.
 * ════════════════════════════════════════════════════════════════
 */

export const revalidate = 900

/** Escapa para XML. Un & suelto invalida el documento entero. */
function xml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const posts = getPublishedPosts().slice(0, 50)
  const self = `${SITE_CONFIG.url}/feed.xml`
  /* Sin artículos no se emite `lastBuildDate`. Antes caía a `new Date(0)` y
     el feed servía «Thu, 01 Jan 1970» — un epoch en el XML de alguien que
     vende rigor técnico. La ventana era corta pero real: el feed existe desde
     antes del primer artículo. */
  const ultimo = posts[0]?.publishedAt

  const items = posts
    .map((post) => {
      const url = postUrl(post)
      return `    <item>
      <title>${xml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <description>${xml(post.description)}</description>
      <category>${xml(post.cluster)}</category>
      <dc:creator>${xml(SITE_CONFIG.name)}</dc:creator>${
        post.cover
          ? `
      <enclosure url="${SITE_CONFIG.url}${post.cover}" type="image/webp" length="0" />`
          : ''
      }
    </item>`
    })
    .join('\n')

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${xml(SITE_CONFIG.name)} — Blog técnico</title>
    <link>${blogUrl()}</link>
    <atom:link href="${self}" rel="self" type="application/rss+xml" />
    <description>Artículos técnicos sobre IA aplicada, ciberseguridad, desarrollo full-stack, SEO y cloud. Publicación cada martes y viernes.</description>
    <language>es-MX</language>
    <copyright>${xml(SITE_CONFIG.name)}</copyright>
    <managingEditor>${xml(NAP.email)} (${xml(SITE_CONFIG.name)})</managingEditor>
    <webMaster>${xml(NAP.email)} (${xml(SITE_CONFIG.name)})</webMaster>
${ultimo ? `    <lastBuildDate>${new Date(ultimo).toUTCString()}</lastBuildDate>` : '    <!-- sin lastBuildDate: todavía no hay artículos publicados -->'}
    <generator>Next.js</generator>
${items}
  </channel>
</rss>
`

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      /* `max-age` es para el cliente; en Vercel la capa de CDN de esta ruta
         la gobierna el `revalidate = 900` de arriba, que además es lo que
         `revalidatePath('/feed.xml')` purga desde el cron. Y
         `stale-while-revalidate` lo consume el proxy: nunca llega al
         navegador. (No es `stale-if-error`: esto no es una copia de
         emergencia si el origen falla.) */
      'Cache-Control': 'public, max-age=1800, stale-while-revalidate=86400',
    },
  })
}
