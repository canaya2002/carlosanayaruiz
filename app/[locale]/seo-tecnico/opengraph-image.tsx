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
          ? 'Carlos Anaya Ruiz — technical SEO consulting: audits, structured data and Core Web Vitals'
          : 'Carlos Anaya Ruiz — consultoría SEO técnica: auditorías, datos estructurados y Core Web Vitals',
    },
  ]
}

export default async function Image({ params }: Params) {
  const { locale } = await params
  const en = locale === 'en'

  return renderOgCard({
    locale: locale as Locale,
    eyebrow: en ? 'Technical SEO · Audits' : 'SEO Técnico · Auditorías',
    title: en
      ? 'Audits that fix indexation, not just describe it'
      : 'Auditorías que arreglan la indexación, no que la describen',
    subtitle: en
      ? 'Schema, Core Web Vitals and migrations, with findings prioritized by impact and effort.'
      : 'Schema, Core Web Vitals y migraciones, con hallazgos priorizados por impacto y esfuerzo.',
    facts: ['Schema.org / JSON-LD', 'Core Web Vitals', 'Next.js'],
  })
}
