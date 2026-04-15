import { SITE_CONFIG, SOCIAL_LINKS, SEO_IMAGES } from './constants'
import { Locale } from '@/data/types'
import { getServices } from '@/data/services'

const BASE_URL = SITE_CONFIG.url

// ── Person Schema (Knowledge Panel target) ───────────────────
export function generatePersonSchema(locale: Locale) {
  return {
    '@type': 'Person',
    '@id': `${BASE_URL}/#person`,
    name: 'Carlos Anaya Ruiz',
    alternateName: ['Carlos Anaya Ruíz', 'Carlos Anaya'],
    givenName: 'Carlos',
    familyName: 'Anaya Ruiz',
    url: BASE_URL,
    image: {
      '@type': 'ImageObject',
      '@id': `${BASE_URL}/#personimage`,
      url: `${BASE_URL}${SEO_IMAGES.avatar}`,
      contentUrl: `${BASE_URL}${SEO_IMAGES.avatar}`,
      caption:
        'Carlos Anaya Ruiz — Technical SEO Consultant & Full-Stack Engineer',
      inLanguage: locale === 'en' ? 'en-US' : 'es-MX',
    },
    jobTitle:
      locale === 'en'
        ? 'Technical SEO Consultant & Full-Stack Engineer'
        : 'Consultor SEO Técnico & Ingeniero Full-Stack',
    description:
      locale === 'en'
        ? 'Computer Science Engineer with 4+ years leading software projects, technical SEO, Next.js & Firebase development, AI automation, and data-driven dashboards. PMP certified. Amazon, Master Loyalty Group, Wan Hai Lines.'
        : 'Ingeniero en Tecnologías Computacionales con +4 años liderando proyectos de software, SEO técnico, desarrollo Next.js y Firebase, automatización con IA y dashboards. Certificado PMP. Amazon, Master Loyalty Group, Wan Hai Lines.',
    email: `mailto:${SOCIAL_LINKS.email}`,
    telephone: SOCIAL_LINKS.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ciudad de México',
      addressRegion: 'CDMX',
      addressCountry: 'MX',
    },
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
      'GPT',
      'Gemini',
      'Dashboards',
      'Power BI',
      'Project Management',
      'Scrum',
      'PMBOK',
      'Core Web Vitals',
      'Schema.org',
      'JSON-LD',
      'Web Performance',
      'CI/CD',
      'AWS',
      'Docker',
      'Kubernetes',
      'Web Security',
      'Full-Stack Development',
      'Information Architecture',
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
      {
        '@type': 'EducationalOccupationalCredential',
        name:
          locale === 'en'
            ? 'B.Sc. Computer Science & Technology'
            : 'Ingeniería en Tecnologías Computacionales',
        credentialCategory: 'degree',
        recognizedBy: {
          '@type': 'EducationalOrganization',
          name: 'Tecnológico de Monterrey',
        },
      },
      {
        '@type': 'EducationalOccupationalCredential',
        name:
          locale === 'en'
            ? 'Specialization in Advanced AI for Data Science'
            : 'Especialización en IA Avanzada para Ciencia de Datos',
        credentialCategory: 'certificate',
        recognizedBy: {
          '@type': 'EducationalOrganization',
          name: 'Tecnológico de Monterrey',
        },
      },
    ],
    hasOccupation: {
      '@type': 'Occupation',
      name:
        locale === 'en'
          ? 'Technical SEO Consultant & Full-Stack Engineer'
          : 'Consultor SEO Técnico & Ingeniero Full-Stack',
      occupationLocation: {
        '@type': 'City',
        name: 'Ciudad de México',
      },
    },
    alumniOf: [
      {
        '@type': 'EducationalOrganization',
        name: 'Tecnológico de Monterrey',
        department:
          locale === 'en'
            ? 'School of Engineering'
            : 'Escuela de Ingeniería y Ciencias',
      },
    ],
    worksFor: {
      '@type': 'ProfessionalService',
      '@id': `${BASE_URL}/#business`,
      name:
        locale === 'en'
          ? 'Carlos Anaya Ruiz — SEO Consulting & Web Development'
          : 'Carlos Anaya Ruiz — Consultoría SEO & Desarrollo Web',
      url: BASE_URL,
      founder: { '@id': `${BASE_URL}/#person` },
      areaServed: [
        { '@type': 'Country', name: 'Mexico' },
        { '@type': 'Country', name: 'United States' },
      ],
    },
    mainEntityOfPage: `${BASE_URL}/${locale}/sobre-mi`,
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
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name:
        locale === 'en'
          ? 'Consulting & Development Services'
          : 'Servicios de Consultoría y Desarrollo',
      itemListElement: [
        { '@id': `${BASE_URL}/#service-seo-tecnico` },
        { '@id': `${BASE_URL}/#service-nextjs-firebase` },
        { '@id': `${BASE_URL}/#service-ai-automation` },
        { '@id': `${BASE_URL}/#service-dashboards` },
      ],
    },
  }
}

// ── WebSite Schema ───────────────────────────────────────────
export function generateWebSiteSchema(locale: Locale) {
  return {
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    name: 'Carlos Anaya Ruiz',
    alternateName: 'carlosanayaruiz.com',
    url: BASE_URL,
    description:
      locale === 'en'
        ? 'Professional website of Carlos Anaya Ruiz — Technical SEO consulting, Next.js & Firebase development, AI automation, and responsive dashboards.'
        : 'Sitio web profesional de Carlos Anaya Ruiz — Consultoría SEO técnico, desarrollo Next.js y Firebase, automatización con IA y dashboards responsivos.',
    inLanguage: locale === 'en' ? 'en-US' : 'es-MX',
    publisher: { '@id': `${BASE_URL}/#person` },
    image: `${BASE_URL}${SEO_IMAGES.ogDefault}`,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/${locale === 'en' ? 'en' : 'es'}/contacto?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

// ── WebPage Schema ───────────────────────────────────────────
export function generateWebPageSchema(
  locale: Locale,
  path: string,
  name: string,
  description?: string
) {
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
    datePublished: '2025-02-01',
    dateModified: new Date().toISOString().split('T')[0],
  }
}

// ── Service Schema ───────────────────────────────────────────
export function generateServiceSchemas(locale: Locale) {
  const services = getServices(locale)
  return services.map((service) => ({
    '@type': 'Service',
    // Locale-independent @id so ES and EN reference the same entity
    '@id': `${BASE_URL}/#service-${service.id}`,
    name: service.title,
    description: service.description,
    serviceType: service.title,
    provider: { '@id': `${BASE_URL}/#person` },
    areaServed: [
      { '@type': 'Country', name: 'Mexico' },
      { '@type': 'Country', name: 'United States' },
      {
        '@type': 'Place',
        name: locale === 'en' ? 'Worldwide (Remote)' : 'Mundial (Remoto)',
      },
    ],
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${BASE_URL}/${locale === 'en' ? 'en' : 'es'}/${service.id === 'seo-tecnico' ? (locale === 'en' ? 'technical-seo' : 'seo-tecnico') : service.id === 'nextjs-firebase' ? (locale === 'en' ? 'web-development' : 'desarrollo-web') : service.id === 'ai-automation' ? (locale === 'en' ? 'ai-automation' : 'automatizacion-ia') : 'dashboards'}`,
    },
  }))
}

// ── Single Service Schema (for money pages) ─────────────────
export function generateSingleServiceSchema(
  locale: Locale,
  service: {
    id: string
    title: string
    description: string
    slug: string
  }
) {
  return {
    '@type': 'Service',
    '@id': `${BASE_URL}/${locale}/${service.slug}#service`,
    name: service.title,
    description: service.description,
    serviceType: service.title,
    provider: { '@id': `${BASE_URL}/#person` },
    areaServed: [
      { '@type': 'Country', name: 'Mexico' },
      { '@type': 'Country', name: 'United States' },
      {
        '@type': 'Place',
        name: locale === 'en' ? 'Worldwide (Remote)' : 'Mundial (Remoto)',
      },
    ],
    url: `${BASE_URL}/${locale}/${service.slug}`,
  }
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
export function generateFAQSchema(
  faqs: { question: string; answer: string }[]
) {
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
    '@graph': [generatePersonSchema(locale), generateWebSiteSchema(locale)],
  }
}

/** Home/Brand page: WebPage + Service×3 + FAQPage */
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
          ? 'Carlos Anaya Ruiz — Technical SEO Consultant & Web Development'
          : 'Carlos Anaya Ruiz — Consultor SEO Técnico & Desarrollo Web',
        locale === 'en'
          ? 'Technical SEO consulting, Next.js & Firebase web development, AI automation, and responsive dashboards by Carlos Anaya Ruiz in Mexico.'
          : 'Consultoría SEO técnico, desarrollo web Next.js y Firebase, automatización con IA y dashboards responsivos por Carlos Anaya Ruiz en México.'
      ),
      ...services,
      ...(allFaqs.length > 0 ? [generateFAQSchema(allFaqs)] : []),
    ],
  }
}

/** Individual service money page: WebPage + Service + FAQ + Breadcrumbs */
export function generateServicePageGraph(
  locale: Locale,
  service: {
    id: string
    title: string
    description: string
    slug: string
  },
  breadcrumbs: { name: string; url: string }[],
  faqs: { question: string; answer: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      generateWebPageSchema(locale, `/${service.slug}`, service.title, service.description),
      generateSingleServiceSchema(locale, service),
      generateBreadcrumbSchema(breadcrumbs, locale),
      ...(faqs.length > 0 ? [generateFAQSchema(faqs)] : []),
    ],
  }
}

/** Books/Resources page: WebPage + Breadcrumbs (no Book schema until product is real) */
export function generateBooksPageGraph(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      generateWebPageSchema(
        locale,
        locale === 'en' ? '/books' : '/libros',
        locale === 'en'
          ? 'Carlos Anaya Ruiz — Technical Resources & Books'
          : 'Carlos Anaya Ruiz — Recursos Técnicos y Libros'
      ),
      generateBreadcrumbSchema(
        [
          { name: locale === 'en' ? 'Home' : 'Inicio', url: '' },
          {
            name: locale === 'en' ? 'Resources' : 'Recursos',
            url: locale === 'en' ? '/books' : '/libros',
          },
        ],
        locale
      ),
    ],
  }
}

/** About page: AboutPage + BreadcrumbList + FAQPage */
export function generateAboutPageGraph(
  locale: Locale,
  faqs?: { question: string; answer: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        ...generateWebPageSchema(
          locale,
          locale === 'en' ? '/about' : '/sobre-mi',
          locale === 'en'
            ? 'About Carlos Anaya Ruiz — Engineer, Tech Lead & SEO Consultant'
            : 'Sobre Carlos Anaya Ruiz — Ingeniero, Líder Técnico y Consultor SEO',
          locale === 'en'
            ? 'Professional profile of Carlos Anaya Ruiz. Computer Science Engineer, PMP certified, 4+ years at Amazon, Master Loyalty Group, Wan Hai Lines.'
            : 'Perfil profesional de Carlos Anaya Ruiz. Ingeniero en Tecnologías Computacionales, certificado PMP, +4 años en Amazon, Master Loyalty Group, Wan Hai Lines.'
        ),
        '@type': 'AboutPage',
      },
      generateBreadcrumbSchema(
        [
          { name: locale === 'en' ? 'Home' : 'Inicio', url: '' },
          {
            name: locale === 'en' ? 'About' : 'Sobre Mí',
            url: locale === 'en' ? '/about' : '/sobre-mi',
          },
        ],
        locale
      ),
      ...(faqs && faqs.length > 0 ? [generateFAQSchema(faqs)] : []),
    ],
  }
}

/** Contact page: ContactPage + BreadcrumbList + FAQPage */
export function generateContactPageGraph(
  locale: Locale,
  faqs?: { question: string; answer: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        ...generateWebPageSchema(
          locale,
          locale === 'en' ? '/contact' : '/contacto',
          locale === 'en'
            ? 'Contact Carlos Anaya Ruiz — SEO & Development Consulting'
            : 'Contactar a Carlos Anaya Ruiz — Consultoría SEO y Desarrollo',
          locale === 'en'
            ? 'Contact Carlos Anaya Ruiz for technical SEO consulting, Next.js web development, AI automation, or dashboard projects.'
            : 'Contacta a Carlos Anaya Ruiz para consultoría SEO técnico, desarrollo web Next.js, automatización con IA o proyectos de dashboards.'
        ),
        '@type': 'ContactPage',
      },
      generateBreadcrumbSchema(
        [
          { name: locale === 'en' ? 'Home' : 'Inicio', url: '' },
          {
            name: locale === 'en' ? 'Contact' : 'Contacto',
            url: locale === 'en' ? '/contact' : '/contacto',
          },
        ],
        locale
      ),
      ...(faqs && faqs.length > 0 ? [generateFAQSchema(faqs)] : []),
    ],
  }
}
