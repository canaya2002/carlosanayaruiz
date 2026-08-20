import { renderOgCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'
import { Locale } from '@/data/types'

type Params = { params: Promise<{ locale: string }> }

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

/**
 * El `alt` vive aquí y no en un `export const alt` estático porque un export
 * estático no ve `params` — y por eso cada página en inglés servía el texto
 * alternativo en español para su tarjeta social.
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
          ? 'CV of Carlos Anaya Ruiz — engineer, PMP certified, technical SEO consultant'
          : 'CV de Carlos Anaya Ruiz — ingeniero, certificado PMP, consultor SEO técnico',
    },
  ]
}

export default async function Image({ params }: Params) {
  const { locale } = await params
  const en = locale === 'en'

  // Los tres datos del pie son hechos verificables, no cifras de marketing: el
  // título del Tec, la certificación del PMI y el puntaje real del TOEFL. Cada
  // uno se puede revisar en la carpeta de credenciales que enlaza la página.
  return renderOgCard({
    locale: locale as Locale,
    eyebrow: en ? 'CV · Full record' : 'CV · Trayectoria completa',
    title: en
      ? 'The whole track record on one page'
      : 'La trayectoria completa en una sola página',
    subtitle: en
      ? 'Education, roles, certifications, stack and languages — printable to PDF from the page itself.'
      : 'Formación, puestos, certificaciones, stack e idiomas — imprimible a PDF desde la propia página.',
    facts: en
      ? ['Tec de Monterrey', 'PMP certified', 'TOEFL iBT 92']
      : ['Tec de Monterrey', 'Certificado PMP', 'TOEFL iBT 92'],
  })
}
