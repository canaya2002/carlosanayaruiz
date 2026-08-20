import { renderOgCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'
import { Locale } from '@/data/types'

type Params = { params: Promise<{ locale: string }> }

/**
 * `alt` is declared here rather than as a static `export const alt`, because a
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
          ? 'Carlos Anaya Ruiz’s services — technical SEO, web development, AI automation and dashboards'
          : 'Servicios de Carlos Anaya Ruiz — SEO técnico, desarrollo web, automatización con IA y dashboards',
    },
  ]
}

export default async function Image({ params }: Params) {
  const { locale } = await params
  const en = locale === 'en'
  return renderOgCard({
    locale: locale as Locale,
    eyebrow: en ? 'Services · Mexico City' : 'Servicios · Ciudad de México',
    title: en
      ? 'Four ways to fix what is holding your traffic back'
      : 'Cuatro formas de arreglar lo que frena tu tráfico',
    subtitle: en
      ? 'Technical SEO, Next.js and Firebase, AI automation, and dashboards.'
      : 'SEO técnico, Next.js y Firebase, automatización con IA y dashboards.',
    facts: en
      ? ['Audits', 'Migrations', 'Dashboards']
      : ['Auditorías', 'Migraciones', 'Dashboards'],
  })
}
