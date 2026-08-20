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
          ? 'Dashboards and business analytics — Carlos Anaya Ruiz, Mexico City'
          : 'Dashboards y analítica de negocio — Carlos Anaya Ruiz, Ciudad de México',
    },
  ]
}

export default async function Image({ params }: Params) {
  const { locale } = await params
  const en = locale === 'en'
  return renderOgCard({
    locale: locale as Locale,
    eyebrow: en ? 'Dashboards · Mexico City' : 'Dashboards · Ciudad de México',
    title: en
      ? 'A dashboard leadership reads without a walkthrough'
      : 'Un tablero que la dirección lee sin que se lo expliquen',
    subtitle: en
      ? 'Wired to your real data sources, not to last week’s export.'
      : 'Conectado a tus fuentes de datos reales, no a un export de la semana pasada.',
    facts: en
      ? ['React & Next.js', 'Recharts / D3', 'Power BI & DAX']
      : ['React y Next.js', 'Recharts / D3', 'Power BI y DAX'],
  })
}
