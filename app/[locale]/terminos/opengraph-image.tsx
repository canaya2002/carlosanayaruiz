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
          ? 'Terms and conditions — Carlos Anaya Ruiz'
          : 'Términos y condiciones — Carlos Anaya Ruiz',
    },
  ]
}

export default async function Image({ params }: Params) {
  const { locale } = await params
  const en = locale === 'en'
  return renderOgCard({
    locale: locale as Locale,
    eyebrow: en ? 'Terms of use · Mexico' : 'Términos de uso · México',
    // The single most load-bearing clause, stated plainly.
    title: en
      ? 'Nobody can guarantee you the top spot on Google.'
      : 'Nadie puede garantizarte el primer lugar en Google.',
    subtitle: en
      ? 'Site terms: informational content, intellectual property, liability limits and Mexican law.'
      : 'Condiciones de uso: contenido informativo, propiedad intelectual, límites de responsabilidad y ley mexicana.',
    facts: en
      ? ['No ranking promises', 'Written proposals', 'Mexican law']
      : ['Sin promesas de ranking', 'Propuesta por escrito', 'Ley mexicana'],
  })
}
