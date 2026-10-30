import { renderOgCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'
import { routing } from '@/i18n/routing'
import { hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
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
          ? 'AI automation and LLM chatbots — Carlos Anaya Ruiz'
          : 'Automatización con IA y chatbots — Carlos Anaya Ruiz',
    },
  ]
}

export default async function Image({ params }: Params) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  const en = locale === 'en'
  return renderOgCard({
    locale: locale as Locale,
    eyebrow: en
      ? 'AI Automation'
      : 'Automatización con IA',
    title: en
      ? 'AI automation that never improvises with your data'
      : 'Automatización con IA que no improvisa con tus datos',
    subtitle: en
      ? 'Chatbots with real context, workflows that remove manual work, and a human who can step in.'
      : 'Chatbots con contexto real, flujos que eliminan trabajo manual y una persona que puede intervenir.',
    facts: en
      ? ['GPT · Gemini · Claude', 'CRM and API integration', 'Bounded cost']
      : ['GPT · Gemini · Claude', 'Integración CRM y APIs', 'Costo acotado'],
  })
}
