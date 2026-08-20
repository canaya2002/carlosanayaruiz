import { renderOgCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'
import { Locale } from '@/data/types'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

type Params = { params: Promise<{ locale: string }> }

/**
 * El `alt` vive aquí y no en un `export const alt` estático: un export estático
 * no ve `params`, así que las páginas en inglés servían el alt en español.
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
        ? 'Carlos Anaya Ruiz — certifications: PMP, TOEFL iBT 92 and Tec de Monterrey engineering'
        : 'Carlos Anaya Ruiz — certificaciones: PMP, TOEFL iBT 92 e ingeniería por el Tec de Monterrey',
    },
  ]
}

export default async function Image({ params }: Params) {
  const { locale } = await params
  const en = locale === 'en'

  // Las tres credenciales son las que la página imprime, y las tres se pueden
  // revisar en la carpeta de certificados que se enlaza ahí mismo. Nada en esta
  // tarjeta afirma algo que la página no sostenga.
  return renderOgCard({
    locale: locale as Locale,
    eyebrow: en ? 'Credentials & education' : 'Credenciales y formación',
    title: en
      ? 'Credentials you can actually check'
      : 'Credenciales que se pueden comprobar',
    subtitle: en
      ? 'PMP, TOEFL iBT 92 and Computer Science engineering from Tecnológico de Monterrey — with the certificate folder open.'
      : 'PMP, TOEFL iBT 92 e Ingeniería en Tecnologías Computacionales por el Tec de Monterrey, con la carpeta de certificados abierta.',
    // Los tres chips son nombres propios y siglas: se escriben igual en los dos
    // idiomas, así que no llevan ternario.
    facts: ['PMP · PMI', 'TOEFL iBT 92', 'Tec de Monterrey'],
  })
}
