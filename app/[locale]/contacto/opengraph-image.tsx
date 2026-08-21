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
          ? 'Contact — Carlos Anaya Ruiz, technical SEO consultant in Mexico City'
          : 'Contacto — Carlos Anaya Ruiz, consultor SEO técnico en Ciudad de México',
    },
  ]
}

export default async function Image({ params }: Params) {
  const { locale } = await params
  const en = locale === 'en'
  return renderOgCard({
    locale: locale as Locale,
    eyebrow: en ? 'Contact · Mexico City' : 'Contacto · Ciudad de México',
    title: en
      ? 'Tell me what broke, or what you want to build'
      : 'Cuéntame qué está roto o qué quieres construir',
    subtitle: en
      ? 'You write to the engineer who does the work — no account manager in between.'
      : 'Le escribes al ingeniero que hace el trabajo, sin ejecutivo de cuenta en medio.',
    facts: en
      ? ['under 24 hours', 'Spanish / English', 'GMT-6']
      : ['menos de 24 horas', 'Español / inglés', 'GMT-6'],
  })
}
