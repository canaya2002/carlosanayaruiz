import { renderOgCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'
import { Locale } from '@/data/types'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

type Params = { params: Promise<{ locale: string }> }

/**
 * El `alt` vive aquí y no en un `export const alt` estático: un export estático
 * no ve `params`, así que la página en inglés terminaba sirviendo el alt en
 * español para su tarjeta social.
 */
export async function generateImageMetadata({ params }: Params) {
  const { locale } = await params
  const en = locale === 'en'

  return [
    {
      id: 'card',
      size,
      contentType,
      alt: en
        ? 'Carlos Anaya Ruiz — awards and recognitions: NASA Space Apps, hackathon first place, TOEFL iBT 92'
        : 'Carlos Anaya Ruiz — premios y reconocimientos: NASA Space Apps, primer lugar en hackathon, TOEFL iBT 92',
    },
  ]
}

export default async function Image({ params }: Params) {
  const { locale } = await params
  const en = locale === 'en'

  /**
   * La tarjeta dice lo mismo que la página, con la misma cautela: "Galactic
   * Problem Solver" es un reconocimiento y así se nombra, no como un primer
   * lugar. Los tres chips son hechos con emisor: NASA Space Apps, el hackathon
   * de 2022 y ETS.
   */
  return renderOgCard({
    locale: locale as Locale,
    eyebrow: en ? 'Awards · Recognitions' : 'Premios · Reconocimientos',
    title: en
      ? 'Recognitions, with the issuer and the date'
      : 'Reconocimientos, con emisor y fecha',
    subtitle: en
      ? 'NASA Space Apps "Galactic Problem Solver", first place at a 2022 hackathon, and TOEFL iBT 92.'
      : 'Reconocimiento "Galactic Problem Solver" de NASA Space Apps, primer lugar en hackathon 2022 y TOEFL iBT 92.',
    facts: en
      ? ['NASA Space Apps 2024', '1st place, 2022', 'TOEFL iBT 92']
      : ['NASA Space Apps 2024', '1er lugar, 2022', 'TOEFL iBT 92'],
  })
}
