import { renderOgCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'
import { getCompanies, countByCountry } from '@/data/companies'
import { Locale } from '@/data/types'

type Params = { params: Promise<{ locale: string }> }

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

/**
 * El `alt` vive aquí y no en un `export const alt` estático porque un export
 * estático no ve `params` — que es cómo cada página en inglés terminaba
 * sirviendo el texto alternativo en español para su tarjeta social.
 */
export async function generateImageMetadata({ params }: Params) {
  const { locale } = await params
  return [
    {
      id: 'card',
      size,
      contentType,
      alt:
        locale === 'en'
          ? 'Projects and companies where Carlos Anaya Ruiz has worked, with a world map of the countries involved'
          : 'Proyectos y empresas donde ha trabajado Carlos Anaya Ruiz, con un mapa mundial de los países involucrados',
    },
  ]
}

export default async function Image({ params }: Params) {
  const { locale: rawLocale } = await params
  const locale = rawLocale as Locale
  const en = locale === 'en'

  /**
   * Las dos cifras salen de contar data/companies.ts, no de escribirlas: el día
   * que se agregue un cliente, la tarjeta se actualiza sola en vez de quedarse
   * afirmando un número viejo.
   */
  const total = getCompanies(locale).length
  const countries = Object.values(countByCountry(locale)).filter(
    (count) => count > 0
  ).length

  return renderOgCard({
    locale,
    eyebrow: en ? 'Projects · Track record' : 'Proyectos · Trayectoria',
    title: en
      ? 'Where I have worked and what I built'
      : 'Dónde he trabajado y qué construí',
    subtitle: en
      ? 'Amazon, Master Loyalty Group, Wan Hai Lines, AuraScope and LogiRoute AI, each with role, dates and stack.'
      : 'Amazon, Master Loyalty Group, Wan Hai Lines, AuraScope y LogiRoute AI, con rol, periodo y stack.',
    facts: [
      en ? `${total} projects` : `${total} proyectos`,
      en ? `${countries} countries` : `${countries} países`,
      'Ex-Amazon',
    ],
  })
}
