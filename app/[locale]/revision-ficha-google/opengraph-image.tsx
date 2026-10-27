import { renderOgCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'
import { routing } from '@/i18n/routing'
import { hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { getReviewCopy } from '@/data/revision-ficha'
import { Locale } from '@/data/types'

type Params = { params: Promise<{ locale: string }> }

/* La tarjeta importa más aquí que en ninguna otra ruta: esta URL es la que
   se comparte en redes. Todo el texto sale del copy de la página. */
export async function generateImageMetadata({ params }: Params) {
  const { locale } = await params
  const copy = getReviewCopy(locale === 'en' ? 'en' : 'es')
  return [
    {
      id: 'card',
      size: OG_SIZE,
      contentType: OG_CONTENT_TYPE,
      alt: `${copy.h1} — Carlos Anaya Ruiz`,
    },
  ]
}

export default async function Image({ params }: Params) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  const en = locale === 'en'
  const copy = getReviewCopy(locale as Locale)
  return renderOgCard({
    locale: locale as Locale,
    eyebrow: en ? 'Google Maps · Mexico' : 'Google Maps · México',
    title: copy.h1,
    subtitle: copy.subtitle,
    facts: en
      ? ['3 business days', 'until 11/30/2026', 'no account access']
      : ['3 días hábiles', 'hasta el 30/11/2026', 'sin acceso a tu cuenta'],
  })
}
