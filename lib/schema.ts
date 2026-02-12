import { SITE_CONFIG, SOCIAL_LINKS, SEO_IMAGES } from './constants'
import { Locale } from '@/data/types'
import { getServices } from '@/data/services'
import { getBooks } from '@/data/books'

const BASE_URL = SITE_CONFIG.url

// ── Person Schema (Knowledge Panel target) ───────────────────
export function generatePersonSchema(locale: Locale) {
  return {
    '@type': 'Person',
    '@id': `${BASE_URL}/#person`,
    name: 'Carlos Anaya Ruíz',
    givenName: 'Carlos',
    familyName: 'Anaya Ruíz',
    url: BASE_URL,
    // Main professional image — must match the visible <img> on site
    image: {
      '@type': 'ImageObject',
      '@id': `${BASE_URL}/#personimage`,
      url: `${BASE_URL}${SEO_IMAGES.avatar}`,
      contentUrl: `${BASE_URL}${SEO_IMAGES.avatar}`,
      caption: 'Carlos Anaya Ruíz — Technical SEO Consultant & Full-Stack Engineer',
      inLanguage: locale === 'en' ? 'en-US' : 'es-MX',
    },
    jobTitle: locale === 'en'
      ? 'Technical SEO Consultant & Full-Stack Engineer'
      : 'Consultor SEO Técnico & Ingeniero Full-Stack',
    description: locale === 'en'
      ? 'Computer Science Engineer with 4+ years leading software projects, technical SEO, Next.js & Firebase development, AI automation, and data-driven dashboards. PMP certified. Amazon, Master Loyalty Group, Wan Hai Lines.'
      : 'Ingeniero en Tecnologías Computacionales con +4 años liderando proyectos de software, SEO técnico, desarrollo Next.js y Firebase, automatización con IA y dashboards. Certificado PMP. Amazon, Master Loyalty Group, Wan Hai Lines.',
    email: `mailto:${SOCIAL_LINKS.email}`,
    telephone: SOCIAL_LINKS.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ciudad de México',
      addressCountry: 'MX',
    },
    knowsAbout: [
      'Technical SEO', 'SEO Técnico', 'Next.js', 'React', 'TypeScript',
      'Firebase', 'Node.js', 'Python', 'Artificial Intelligence',
      'LLM Integration', 'GPT', 'Gemini', 'Dashboards', 'Power BI',
      'Project Management', 'Scrum', 'PMBOK', 'Core Web Vitals',
      'Schema.org', 'JSON-LD', 'Web Performance', 'CI/CD', 'AWS',
      'Docker', 'Kubernetes',
    ],
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'Project Management Professional (PMP)',
        credentialCategory: 'Professional Certification',
      },
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'TOEFL iBT (Score: 92)',
        credentialCategory: 'Language Certification',
      },
    ],
    alumniOf: [
      {
        '@type': 'EducationalOrganization',
        name: 'Tecnológico de Monterrey',
        department: locale === 'en' ? 'School of Engineering' : 'Facultad de Ingeniería',
      },
    ],
    worksFor: {
      '@type': 'Organization',
      name: 'Carlos Anaya Ruíz — Consultoría SEO & Desarrollo',
      url: BASE_URL,
    },
    // sameAs → feeds Google Knowledge Panel
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
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    name: SITE_CONFIG.name,
    url: BASE_URL,
    description: locale === 'en'
      ? 'Professional website of Carlos Anaya Ruíz — Technical SEO consulting, Next.js & Firebase development, AI automation, and responsive dashboards.'
      : 'Sitio web profesional de Carlos Anaya Ruíz — Consultoría SEO técnico, desarrollo Next.js y Firebase, automatización con IA y dashboards responsivos.',
    inLanguage: locale === 'en' ? 'en-US' : 'es-MX',
    publisher: { '@id': `${BASE_URL}/#person` },
    image: `${BASE_URL}${SEO_IMAGES.ogDefault}`,
  }
}

// ── WebPage Schema ───────────────────────────────────────────
export function generateWebPageSchema(locale: Locale, path: string, name: string, description?: string) {
  return {
    '@type': 'WebPage',
    '@id': `${BASE_URL}/${locale}${path}#webpage`,
    url: `${BASE_URL}/${locale}${path}`,
    name,
    ...(description && { description }),
    isPartOf: { '@id': `${BASE_URL}/#website` },
    about: { '@id': `${BASE_URL}/#person` },
    inLanguage: locale === 'en' ? 'en-US' : 'es-MX',
    primaryImageOfPage: { '@id': `${BASE_URL}/#personimage` },
  }
}

// ── Service Schema ───────────────────────────────────────────
export function generateServiceSchemas(locale: Locale) {
  const services = getServices(locale)
  return services.map((service) => ({
    '@type': 'Service',
    '@id': `${BASE_URL}/${locale}/#service-${service.id}`,
    name: service.title,
    description: service.description,
    serviceType: service.title,
    provider: { '@id': `${BASE_URL}/#person` },
    areaServed: [
      { '@type': 'Country', name: 'Mexico' },
      { '@type': 'Country', name: 'United States' },
      { '@type': 'Place', name: locale === 'en' ? 'Worldwide (Remote)' : 'Mundial (Remoto)' },
    ],
    serviceOutput: locale === 'en' ? 'Web application, technical audit, or AI solution' : 'Aplicación web, auditoría técnica o solución de IA',
  }))
}

// ── Book Schema ──────────────────────────────────────────────
export function generateBookSchemas(locale: Locale) {
  const books = getBooks(locale)
  return books.map((book) => ({
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
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }
}

// ══════════════════════════════════════════════════════════════
// FULL @GRAPH GENERATORS — Single <script> per page context
// ══════════════════════════════════════════════════════════════

/** Layout-level: Person + WebSite (injected in <head>) */
export function generateLayoutGraph(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      generatePersonSchema(locale),
      generateWebSiteSchema(locale),
    ],
  }
}

/** Home/Services page: WebPage + Service×3 + FAQPage */
export function generateServicesPageGraph(locale: Locale) {
  const services = generateServiceSchemas(locale)
  const allFaqs = getServices(locale).flatMap((s) => s.faq)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      generateWebPageSchema(
        locale,
        '',
        locale === 'en'
          ? 'Carlos Anaya Ruíz | Services – Technical SEO, Next.js & Growth'
          : 'Carlos Anaya Ruíz | Servicios – SEO Técnico, Next.js y Growth',
        locale === 'en'
          ? 'Technical SEO consulting, Next.js & Firebase web development, AI automation, and responsive dashboards by Carlos Anaya Ruíz.'
          : 'Consultoría SEO técnico, desarrollo web Next.js y Firebase, automatización con IA y dashboards responsivos por Carlos Anaya Ruíz.',
      ),
      ...services,
      ...(allFaqs.length > 0 ? [generateFAQSchema(allFaqs)] : []),
    ],
  }
}

/** Books page: WebPage + Book×N */
export function generateBooksPageGraph(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      generateWebPageSchema(
        locale,
        locale === 'en' ? '/books' : '/libros',
        locale === 'en'
          ? 'Carlos Anaya Ruíz | Books – Technical Knowledge in Book Format'
          : 'Carlos Anaya Ruíz | Libros – Conocimiento Técnico en Formato Libro',
      ),
      ...generateBookSchemas(locale),
    ],
  }
}

/** About page: WebPage + BreadcrumbList */
export function generateAboutPageGraph(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      generateWebPageSchema(
        locale,
        locale === 'en' ? '/about' : '/sobre-mi',
        locale === 'en'
          ? 'Carlos Anaya Ruíz | About – Engineer, Tech Lead & SEO Consultant'
          : 'Carlos Anaya Ruíz | Sobre Mí – Ingeniero, Líder Técnico y Consultor SEO',
        locale === 'en'
          ? 'Professional profile of Carlos Anaya Ruíz. Computer Science Engineer, PMP certified, 4+ years at Amazon, Master Loyalty Group, Wan Hai Lines.'
          : 'Perfil profesional de Carlos Anaya Ruíz. Ingeniero en Tecnologías Computacionales, certificado PMP, +4 años en Amazon, Master Loyalty Group, Wan Hai Lines.',
      ),
      generateBreadcrumbSchema(
        [
          { name: locale === 'en' ? 'Home' : 'Inicio', url: '/' },
          { name: locale === 'en' ? 'About' : 'Sobre Mí', url: locale === 'en' ? '/about' : '/sobre-mi' },
        ],
        locale,
      ),
    ],
  }
}
