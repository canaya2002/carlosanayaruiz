import { buildSitemapEntries, renderSitemapXml } from '@/lib/sitemap'

/**
 * ════════════════════════════════════════════════════════════════
 * /sitemap.xml — route handler, no metadata route
 *
 * `app/sitemap.ts` con `export const revalidate = 1800` se emitía en Next
 * 16.4 como archivo estático (vercel/next.js#99055): el adaptador ignora
 * `revalidate` y `revalidatePath('/sitemap.xml')` no regenera nada. En
 * producción el XML se quedó en el build del 3/11, sin los artículos que
 * ya respondían 200 y ya estaban en `/feed.xml`.
 *
 * El feed sí se actualiza porque es un route handler. Este archivo es el
 * mismo patrón: `revalidate` gobierna la caché y `revalidatePath` del cron
 * la purga. Las reglas de las entradas no cambian; viven en `lib/sitemap.ts`.
 *
 * 1800 s es media hora. El calendario publica a las 14:00 UTC, así que en
 * el peor caso —si el cron no corre— la URL entra a las 14:30 del mismo día.
 * ════════════════════════════════════════════════════════════════
 */
export const revalidate = 1800

export function GET() {
  const body = renderSitemapXml(buildSitemapEntries())
  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      /* Igual que `/feed.xml`: `max-age` es para el cliente. En Vercel la
         capa de CDN la gobierna el `revalidate` de arriba, que es lo que
         `revalidatePath('/sitemap.xml')` purga desde el cron. */
      'Cache-Control': 'public, max-age=1800, stale-while-revalidate=86400',
    },
  })
}
