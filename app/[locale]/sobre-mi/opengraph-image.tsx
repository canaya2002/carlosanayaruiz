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
          ? 'Carlos Anaya Ruiz — professional profile: Tecnológico de Monterrey engineer, PMP certified'
          : 'Carlos Anaya Ruiz — perfil profesional: ingeniero por el Tec de Monterrey, certificado PMP',
    },
  ]
}

export default async function Image({ params }: Params) {
  const { locale } = await params
  const en = locale === 'en'
  return renderOgCard({
    locale: locale as Locale,
    eyebrow: en ? 'About · Mexico City' : 'Sobre mí · Ciudad de México',
    // Not the page h1 (which is the name): the card has to say why the
    // profile is worth opening.
    title: en
      ? 'The engineer who answers for the traffic, not just the code'
      : 'El ingeniero que responde por el tráfico, no solo por el código',
    subtitle: en
      ? 'Tec de Monterrey engineer, PMP certified, four years across Amazon, Master Loyalty Group and Wan Hai Lines.'
      : 'Ingeniero por el Tec de Monterrey, certificado PMP, cuatro años entre Amazon, Master Loyalty Group y Wan Hai Lines.',
    facts: en
      ? ['Tec de Monterrey', 'PMP certified', 'TOEFL iBT 92']
      : ['Tec de Monterrey', 'Certificado PMP', 'TOEFL iBT 92'],
  })
}
