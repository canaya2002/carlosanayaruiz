import { renderOgCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'
import { Locale } from '@/data/types'

type Params = { params: Promise<{ locale: string }> }

/**
 * `alt` lives here rather than in a static `export const alt`, because a
 * static export cannot see `params` — which meant every English page shipped
 * the Spanish alt text for its social card.
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
          ? 'Carlos Anaya Ruiz — technical SEO consultant in Mexico City'
          : 'Carlos Anaya Ruiz — consultor SEO técnico en Ciudad de México',
    },
  ]
}

export default async function Image({ params }: Params) {
  const { locale } = await params
  const en = locale === 'en'
  return renderOgCard({
    locale: locale as Locale,
    eyebrow: en ? 'Technical SEO · Mexico City' : 'SEO Técnico · Ciudad de México',
    title: en
      ? 'Engineering that Google, ChatGPT and Copilot can actually read'
      : 'Ingeniería que Google, ChatGPT y Copilot sí pueden leer',
    subtitle: en
      ? 'Technical audits, structured data and Core Web Vitals for sites that have to rank.'
      : 'Auditorías técnicas, datos estructurados y Core Web Vitals para sitios que tienen que posicionar.',
    facts: en
      ? ['5+ years', 'PMP certified', 'Ex-Amazon']
      : ['+5 años', 'Certificado PMP', 'Ex-Amazon'],
  })
}
