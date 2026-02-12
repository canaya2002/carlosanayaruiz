import { SITE_CONFIG, SOCIAL_LINKS } from './constants'
import { Locale } from '@/data/types'
import { getServices, Service } from '@/data/services'
import { getBooks, Book } from '@/data/books'

const BASE_URL = SITE_CONFIG.url

/**
 * Generate @graph-connected JSON-LD for the entire site.
 * All entities reference each other via @id.
 */

// ── Person Schema ────────────────────────────────────────────
export function generatePersonSchema(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${BASE_URL}/#person`,
    name: 'Carlos Anaya Ruíz',
    url: BASE_URL,
    image: `${BASE_URL}/images/carlos-anaya-ruiz-consultor-seo-tecnico.png`,
    jobTitle: locale === 'en'
      ? 'Technical SEO Consultant & Full-Stack Engineer'
      : 'Consultor SEO Técnico & Ingeniero Full-Stack',
    description: locale === 'en'
      ? 'Computer Science Engineer with 4+ years of experience in technical SEO, full-stack development with Next.js & Firebase, AI automation, and data-driven dashboards. PMP certified.'
      : 'Ingeniero en Tecnologías Computacionales con más de 4 años de experiencia en SEO técnico, desarrollo full-stack con Next.js y Firebase, automatización con IA y dashboards. Certificado PMP.',
    email: `mailto:${SOCIAL_LINKS.email}`,
    telephone: SOCIAL_LINKS.phone,
    knowsAbout: [
      'Technical SEO',
      'SEO Técnico',
      'Next.js',
      'React',
      'TypeScript',
      'Firebase',
      'Node.js',
      'Python',
      'Artificial Intelligence',
      'LLM Integration',
      'Dashboards',
      'Power BI',
      'Project Management',
      'Scrum',
      'PMBOK',
      'Core Web Vitals',
      'Schema.org',
      'JSON-LD',
      'Web Performance',
    ],
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'Tecnológico de Monterrey',
    },
    sameAs: [
      SOCIAL_LINKS.linkedin,
      SOCIAL_LINKS.github1,
      SOCIAL_LINKS.github2,
      SOCIAL_LINKS.fiverr,
    ],
    nationality: { '@type': 'Country', name: 'Mexico' },
    knowsLanguage: [
      { '@type': 'Language', name: 'Spanish', alternateName: 'es' },
      { '@type': 'Language', name: 'English', alternateName: 'en' },
    ],
  }
}

// ── WebSite Schema ───────────────────────────────────────────
export function generateWebSiteSchema(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    name: SITE_CONFIG.name,
    url: BASE_URL,
    description: locale === 'en'
      ? 'Professional website of Carlos Anaya Ruíz — Technical SEO, Next.js, Firebase, AI Automation & Dashboards.'
      : 'Sitio web profesional de Carlos Anaya Ruíz — SEO Técnico, Next.js, Firebase, Automatización con IA y Dashboards.',
    inLanguage: locale === 'en' ? 'en-US' : 'es-MX',
    author: { '@id': `${BASE_URL}/#person` },
    publisher: { '@id': `${BASE_URL}/#person` },
  }
}

// ── WebPage Schema ───────────────────────────────────────────
export function generateWebPageSchema(locale: Locale, path: string, name: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${BASE_URL}/${locale}${path}#webpage`,
    url: `${BASE_URL}/${locale}${path}`,
    name,
    isPartOf: { '@id': `${BASE_URL}/#website` },
    about: { '@id': `${BASE_URL}/#person` },
    inLanguage: locale === 'en' ? 'en-US' : 'es-MX',
  }
}

// ── Service Schema ───────────────────────────────────────────
export function generateServiceSchemas(locale: Locale) {
  const services = getServices(locale)
  return services.map((service) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${BASE_URL}/${locale}/#service-${service.id}`,
    name: service.title,
    description: service.description,
    serviceType: service.title,
    provider: { '@id': `${BASE_URL}/#person` },
    areaServed: {
      '@type': 'Place',
      name: locale === 'en' ? 'Worldwide (Remote)' : 'Mundial (Remoto)',
    },
  }))
}

// ── Book Schema ──────────────────────────────────────────────
export function generateBookSchemas(locale: Locale) {
  const books = getBooks(locale)
  return books.map((book) => ({
    '@context': 'https://schema.org',
    '@type': 'Book',
    '@id': `${BASE_URL}/${locale}/#book-${book.id}`,
    name: book.title,
    description: book.description,
    author: { '@id': `${BASE_URL}/#person` },
    inLanguage: locale === 'en' ? 'en-US' : 'es-MX',
    ...(book.isbn && { isbn: book.isbn }),
    ...(book.pages && { numberOfPages: book.pages }),
    ...(book.publishedDate && { datePublished: book.publishedDate }),
    image: `${BASE_URL}${book.coverImage}`,
    offers: {
      '@type': 'Offer',
      url: book.purchaseUrl,
      priceCurrency: book.currency,
      price: book.price.replace(/[^0-9.]/g, ''),
      availability: 'https://schema.org/InStock',
    },
  }))
}

// ── BreadcrumbList Schema ────────────────────────────────────
export function generateBreadcrumbSchema(
  items: { name: string; url: string }[],
  locale: Locale
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}/${locale}${item.url}`,
    })),
  }
}

// ── FAQPage Schema ───────────────────────────────────────────
export function generateFAQSchema(
  faqs: { question: string; answer: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

// ── Full @graph for layout ───────────────────────────────────
export function generateLayoutGraph(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      generatePersonSchema(locale),
      generateWebSiteSchema(locale),
    ],
  }
}

// ── Full @graph for services page ────────────────────────────
export function generateServicesPageGraph(locale: Locale) {
  const services = generateServiceSchemas(locale)
  const allFaqs = getServices(locale).flatMap((s) => s.faq)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      generateWebPageSchema(locale, '', locale === 'en' ? 'Services – Carlos Anaya Ruíz' : 'Servicios – Carlos Anaya Ruíz'),
      ...services,
      ...(allFaqs.length > 0 ? [generateFAQSchema(allFaqs)] : []),
    ],
  }
}

// ── Full @graph for books page ───────────────────────────────
export function generateBooksPageGraph(locale: Locale) {
  const books = generateBookSchemas(locale)
  return {
    '@context': 'https://schema.org',
    '@graph': [
      generateWebPageSchema(
        locale,
        locale === 'en' ? '/books' : '/libros',
        locale === 'en' ? 'Books – Carlos Anaya Ruíz' : 'Libros – Carlos Anaya Ruíz'
      ),
      ...books,
    ],
  }
}
