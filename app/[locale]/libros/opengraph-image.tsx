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
          ? 'Carlos Anaya Ruiz — technical resources on technical SEO and Next.js'
          : 'Carlos Anaya Ruiz — recursos técnicos sobre SEO técnico y Next.js',
    },
  ]
}

export default async function Image({ params }: Params) {
  const { locale } = await params
  const en = locale === 'en'

  // The card says the same thing the page says: the book is not out. A preview
  // promising a purchasable title would be the first lie a reader sees.
  return renderOgCard({
    locale: locale as Locale,
    eyebrow: en ? 'Resources · Technical SEO' : 'Recursos · SEO Técnico',
    title: en
      ? 'The book is still being written'
      : 'El libro todavía se está escribiendo',
    subtitle: en
      ? 'Technical SEO with Next.js: indexation, performance and structured data.'
      : 'SEO técnico con Next.js: indexación, rendimiento y datos estructurados.',
    facts: en
      ? ['In draft', 'No date yet', 'Email at launch']
      : ['En borrador', 'Sin fecha aún', 'Aviso por correo'],
  })
}
