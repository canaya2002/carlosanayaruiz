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
          ? 'Privacy notice — Carlos Anaya Ruiz'
          : 'Aviso de privacidad — Carlos Anaya Ruiz',
    },
  ]
}

export default async function Image({ params }: Params) {
  const { locale } = await params
  const en = locale === 'en'
  return renderOgCard({
    locale: locale as Locale,
    eyebrow: en ? 'Privacy notice · LFPDPPP' : 'Aviso de privacidad · LFPDPPP',
    // The genuine differentiator, not the page h1 restated.
    title: en
      ? 'No tracking cookies. No banner. Nothing to consent to.'
      : 'Sin cookies de rastreo. Sin banner. Nada que consentir.',
    subtitle: en
      ? 'What this site collects, who processes it, and how to exercise your ARCO rights.'
      : 'Qué datos recoge este sitio, quién los procesa y cómo ejercer tus derechos ARCO.',
    facts: en
      ? ['ARCO rights', 'Two processors', 'Cookieless analytics']
      : ['Derechos ARCO', 'Dos encargados', 'Analítica sin cookies'],
  })
}
