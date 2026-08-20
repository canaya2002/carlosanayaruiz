import { renderOgCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'
import { getCompanyBySlug, type Company } from '@/data/companies'
import { formatShortDate } from '@/lib/utils'
import { Locale } from '@/data/types'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

type Params = { params: Promise<{ locale: string; slug: string }> }

/** Nov. 2023 – Abr. 2025, o una sola fecha cuando empieza y termina igual. */
function period(company: Company, locale: Locale): string {
  const start = formatShortDate(company.startDate, locale)
  if (company.startDate === company.endDate) return start
  const end = company.endDate
    ? formatShortDate(company.endDate, locale)
    : locale === 'en'
      ? 'Present'
      : 'Presente'
  return `${start} – ${end}`
}

/**
 * `generateImageMetadata` y no un `export const alt` estático: el export
 * estático no ve `params`, así que servía el alt en español a las páginas en
 * inglés — y aquí además necesita el nombre y el rol de la empresa, que solo
 * se conocen leyendo el slug.
 */
export async function generateImageMetadata({ params }: Params) {
  const { locale, slug } = await params
  const en = locale === 'en'
  const company = getCompanyBySlug(locale as Locale, slug)

  return [
    {
      id: 'card',
      size,
      contentType,
      alt: company
        ? en
          ? `${company.name} — ${company.role}, ${period(company, 'en')}. Work by Carlos Anaya Ruiz`
          : `${company.name} — ${company.role}, ${period(company, 'es')}. Trabajo de Carlos Anaya Ruiz`
        : en
          ? 'Projects and companies — Carlos Anaya Ruiz'
          : 'Proyectos y empresas — Carlos Anaya Ruiz',
    },
  ]
}

export default async function Image({ params }: Params) {
  const { locale: rawLocale, slug } = await params
  const locale = rawLocale as Locale
  const en = locale === 'en'
  const company = getCompanyBySlug(locale, slug)

  // Sin datos no se inventa una tarjeta con el slug crudo: se sirve la del
  // listado. El slug fuera de `getCompanySlugs()` es un 404 de todas formas.
  if (!company) {
    return renderOgCard({
      locale,
      eyebrow: en ? 'Projects' : 'Proyectos',
      title: en ? 'Where I have worked' : 'Dónde he trabajado',
      subtitle: en
        ? 'Employment, own projects, and the countries each one was worked from.'
        : 'Empleos, proyectos propios y los países desde donde se trabajó cada uno.',
      facts: en
        ? ['Mexico', 'United States']
        : ['México', 'Estados Unidos'],
    })
  }

  const kind = en
    ? { empleo: 'Employment', cliente: 'Client', propio: 'Own project' }[
        company.kind
      ]
    : { empleo: 'Empleo', cliente: 'Cliente', propio: 'Proyecto propio' }[
        company.kind
      ]

  const country = en
    ? { MEX: 'Mexico', USA: 'United States' }[company.country]
    : { MEX: 'México', USA: 'Estados Unidos' }[company.country]

  return renderOgCard({
    locale,
    eyebrow: `${kind} · ${country}`,
    title: company.name,
    subtitle: company.summary,
    // Tres datos y ninguno inventado: los tres salen de la entrada.
    facts: [company.role, period(company, locale), company.stack[0]].filter(
      (fact): fact is string => Boolean(fact)
    ),
  })
}
