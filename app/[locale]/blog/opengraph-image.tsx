import { renderOgCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'
import { BLOG_POSTS } from '@/data/blog'
import { getPublishedPosts } from '@/lib/blog'
import { Locale } from '@/data/types'

/**
 * ── SE REVALIDA, O SE CONGELA EN «0 DE 100» ──
 *
 * Esta ruta NO se prerenderiza en el build: se genera en la primera petición.
 * Sin `revalidate`, esa primera versión se queda para siempre — y como hoy hay
 * cero artículos publicados, la tarjeta que se compartiría en redes durante un
 * año diría «0 de 100 artículos publicados».
 *
 * 900 s, el mismo ritmo que el índice. El cron además la purga explícitamente
 * por su ruta con el id de `generateImageMetadata`
 * (`/es/blog/opengraph-image/card`); `/es/blog` a secas no coincide con su
 * etiqueta de caché.
 */
export const revalidate = 900

type Params = { params: Promise<{ locale: string }> }

/**
 * La tarjeta social del índice del blog.
 *
 * Los ARTÍCULOS no usan esto: cada uno tiene su propia portada de 1600×900 y
 * la declara como `og:image` desde su metadata. Esta tarjeta es solo para el
 * índice, que no tiene una imagen propia.
 *
 * La cifra que dice es la real, contada en el momento de generar la tarjeta:
 * publicados sobre el total. Una tarjeta que anunciara «100 artículos» el día
 * que hay tres sería la primera mentira que alguien ve al compartir el enlace,
 * y esta es exactamente la clase de sitio donde eso se nota.
 */
export async function generateImageMetadata({ params }: Params) {
  const { locale } = await params
  return [
    {
      id: 'card',
      size: OG_SIZE,
      contentType: OG_CONTENT_TYPE,
      alt:
        locale === 'en'
          ? 'Carlos Anaya Ruiz — technical blog on AI, security, development and SEO'
          : 'Carlos Anaya Ruiz — blog técnico sobre IA, seguridad, desarrollo y SEO',
    },
  ]
}

export default async function Image({ params }: Params) {
  const { locale } = await params
  const en = locale === 'en'
  const publicados = getPublishedPosts().length

  return renderOgCard({
    locale: locale as Locale,
    eyebrow: en
      ? 'Technical blog · Tuesdays and Fridays'
      : 'Blog técnico · martes y viernes',
    title: en
      ? 'What actually works in production'
      : 'Lo que sí funciona en producción',
    subtitle: en
      ? `AI, cybersecurity, full-stack development, SEO and cloud. ${publicados} of ${BLOG_POSTS.length} articles published.`
      : `IA, ciberseguridad, desarrollo full-stack, SEO y cloud. ${publicados} de ${BLOG_POSTS.length} artículos publicados.`,
  })
}
