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
          ? 'Next.js and Firebase web development — Carlos Anaya Ruiz'
          : 'Desarrollo web con Next.js y Firebase — Carlos Anaya Ruiz',
    },
  ]
}

export default async function Image({ params }: Params) {
  const { locale } = await params
  const en = locale === 'en'
  return renderOgCard({
    locale: locale as Locale,
    eyebrow: en
      ? 'Web Development · Next.js & Firebase'
      : 'Desarrollo Web · Next.js y Firebase',
    title: en
      ? 'Apps Google indexes the same day they ship'
      : 'Apps que Google indexa el mismo día que salen',
    subtitle: en
      ? 'Server rendering, strict TypeScript and Firebase, with technical SEO from the first commit.'
      : 'Renderizado en servidor, TypeScript estricto y Firebase, con SEO técnico desde el primer commit.',
    facts: en
      ? ['SSR / ISR', 'Firestore & Auth', 'Vercel + CI/CD']
      : ['SSR / ISR', 'Firestore y Auth', 'Vercel + CI/CD'],
  })
}
