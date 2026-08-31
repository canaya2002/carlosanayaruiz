/**
 * ════════════════════════════════════════════════════════════════════════
 * JSON-LD ENTITY GRAPH
 *
 * One question this file has to answer without ambiguity, for Google and for
 * the AI crawlers: *who is this, what does he sell, where, and why trust him.*
 *
 * Shape of the graph:
 *
 *   #person    Person            — the primary entity. This is a personal brand,
 *                                  so the human is the hub, not the company.
 *   #business  ProfessionalService — what the person operates. Linked both ways
 *                                  (Person.worksFor ⇄ ProfessionalService.founder).
 *   #website   WebSite           — the site itself, published by #person.
 *   #service-* Service           — the four offerings, one stable @id each.
 *   …#webpage  WebPage subtype   — one per URL, locale-specific @id.
 *
 * Rules this file follows, deliberately:
 *
 *  1. Nothing is invented. No SearchAction for a search that does not exist, no
 *     `dateModified` of "today", no `priceRange`, no `aggregateRating`, no
 *     `review`, no `openingHours`. Self-serving review markup cannot legitimately
 *     produce stars and we have no review data; fabricated freshness is a
 *     spam signal, not an optimisation.
 *  2. Every URL comes from the ROUTES table in `lib/constants.ts`. A renamed
 *     slug can therefore never leave a stale reference behind.
 *  3. An `@id` is only referenced from a graph where that node exists — either
 *     in the same `@graph`, or in the layout graph, which is emitted on every
 *     page (that is what makes #person / #business / #website always safe).
 *     Everything else is referenced by `url`.
 *  4. Entities that are the same thing in both languages share one
 *     locale-independent `@id`; pages, which are genuinely different documents
 *     per locale, get locale-specific ones.
 * ════════════════════════════════════════════════════════════════════════
 */

import {
  SITE_CONFIG,
  NAP,
  SOCIAL_LINKS,
  SEO_IMAGES,
  ROUTES,
  routeUrl,
  type RouteKey,
} from './constants'
import type { Locale } from '@/data/types'
import { getServices } from '@/data/services'

const BASE_URL = SITE_CONFIG.url

/* ══════════════════════════════════════════════════════════════════════
   TYPES
   ══════════════════════════════════════════════════════════════════════ */

/** A single JSON-LD node. Loose by necessity, but never `any`. */
export type JsonLdNode = { '@type': string | readonly string[] } & Record<
  string,
  unknown
>

/** What every page-level generator returns: one self-contained graph. */
export interface SchemaGraph {
  '@context': 'https://schema.org'
  '@graph': JsonLdNode[]
}

/** WebPage subtypes we actually use. Keeps typos out of `@type`. */
export type WebPageType =
  | 'WebPage'
  | 'AboutPage'
  | 'ProfilePage'
  | 'ContactPage'
  | 'CollectionPage'
  | 'ItemPage'

/**
 * Real publication / modification dates, supplied by the page.
 *
 * `dateModified` is intentionally optional and is **omitted** when absent.
 * A page whose real modification date is unknown says nothing about it rather
 * than claiming the date of the last build.
 */
export interface PageDates {
  /** ISO date. Defaults to `SITE_CONFIG.foundingDate`. */
  datePublished?: string
  /** ISO date of a *real* content change. Omitted entirely when not supplied. */
  dateModified?: string
}

export interface FaqEntry {
  question: string
  answer: string
}

/**
 * Breadcrumb trail item. Prefer `route` (resolved through ROUTES); `url` is a
 * locale-relative path kept for callers that build trails by hand.
 */
export interface BreadcrumbItem {
  name: string
  route?: RouteKey
  url?: string
}

/** The four service pages, by ROUTES key. */
export type ServiceRouteKey =
  | 'seoTecnico'
  | 'desarrolloWeb'
  | 'automatizacionIa'
  | 'dashboards'

/**
 * What a service page hands us to describe itself.
 *
 * Structurally compatible with the `Service` record in `data/services.ts`, so a
 * page can pass its own data record straight through instead of re-declaring a
 * local literal that can drift.
 */
export interface ServiceDescriptor {
  id: string
  title: string
  description: string
  /** Preferred: the ROUTES key of the service page. */
  route?: RouteKey
  /** Legacy locale-specific slug. Only a fallback when `id` is unrecognised. */
  slug?: string
}

export type LegalPageKind = 'privacy' | 'terms'

/* ══════════════════════════════════════════════════════════════════════
   STABLE IDENTIFIERS
   ══════════════════════════════════════════════════════════════════════ */

/** Locale-independent @ids: the same real-world thing in every language. */
const ID = {
  person: `${BASE_URL}/#person`,
  personImage: `${BASE_URL}/#personimage`,
  business: `${BASE_URL}/#business`,
  website: `${BASE_URL}/#website`,
} as const

const langTag = (locale: Locale): string => (locale === 'en' ? 'en-US' : 'es-MX')

const pageIdFor = (pageUrl: string): string => `${pageUrl}#webpage`
const breadcrumbIdFor = (pageUrl: string): string => `${pageUrl}#breadcrumb`
const faqIdFor = (pageUrl: string): string => `${pageUrl}#faq`

/** Canonical entity slug per service page, so the @id never depends on locale. */
const SERVICE_ENTITY_SLUG: Record<ServiceRouteKey, string> = {
  seoTecnico: 'seo-tecnico',
  desarrolloWeb: 'desarrollo-web',
  automatizacionIa: 'automatizacion-ia',
  dashboards: 'dashboards',
}

const serviceEntityId = (route: ServiceRouteKey): string =>
  `${BASE_URL}/#service-${SERVICE_ENTITY_SLUG[route]}`

/**
 * Every id / slug the codebase has ever used for a service, mapped onto its
 * ROUTES key. `data/services.ts` and the page files disagree on some ids
 * (`nextjs-firebase` vs `desarrollo-web`); this is where that is reconciled,
 * so both resolve to one entity and one URL.
 */
const SERVICE_ALIASES = {
  'seo-tecnico': 'seoTecnico',
  'technical-seo': 'seoTecnico',
  'nextjs-firebase': 'desarrolloWeb',
  'desarrollo-web': 'desarrolloWeb',
  'web-development': 'desarrolloWeb',
  'ai-automation': 'automatizacionIa',
  'automatizacion-ia': 'automatizacionIa',
  dashboards: 'dashboards',
} as const satisfies Record<string, ServiceRouteKey>

function isServiceRouteKey(key: RouteKey): key is ServiceRouteKey {
  return key in SERVICE_ENTITY_SLUG
}

/** Reverse lookup: a localised path segment back to its ROUTES key. */
function routeKeyFromPath(pathOrSlug: string): RouteKey | undefined {
  const path = pathOrSlug.startsWith('/') ? pathOrSlug : `/${pathOrSlug}`
  return (Object.keys(ROUTES) as RouteKey[]).find(
    (key) => ROUTES[key].es === path || ROUTES[key].en === path
  )
}

function serviceRouteKey(idOrSlug: string): ServiceRouteKey | undefined {
  const alias = (SERVICE_ALIASES as Record<string, ServiceRouteKey | undefined>)[
    idOrSlug
  ]
  if (alias) return alias
  const fromPath = routeKeyFromPath(idOrSlug)
  return fromPath && isServiceRouteKey(fromPath) ? fromPath : undefined
}

interface ResolvedService {
  entityId: string
  url: string
  route?: ServiceRouteKey
}

/** Resolves a descriptor to a canonical entity @id and a ROUTES-built URL. */
function resolveService(
  service: ServiceDescriptor,
  locale: Locale
): ResolvedService {
  // An explicit route key wins: it is the only value that cannot drift.
  if (service.route) {
    return {
      entityId: isServiceRouteKey(service.route)
        ? serviceEntityId(service.route)
        : `${BASE_URL}/#service-${service.route}`,
      url: routeUrl(service.route, locale),
      route: isServiceRouteKey(service.route) ? service.route : undefined,
    }
  }

  const route =
    serviceRouteKey(service.id) ??
    (service.slug ? serviceRouteKey(service.slug) : undefined)

  if (route) {
    return {
      entityId: serviceEntityId(route),
      url: routeUrl(route, locale),
      route,
    }
  }

  // Last resort for a service that is not in ROUTES yet: use what the caller
  // gave us rather than guessing a path.
  const slug = (service.slug ?? service.id).replace(/^\/+/, '')
  return {
    entityId: `${BASE_URL}/#service-${slug}`,
    url: `${BASE_URL}/${locale}/${slug}`,
  }
}

/** `''` → `''`, `'about'` → `'/about'`, `'/about'` → `'/about'`. */
function normalizePath(path: string): string {
  if (!path) return ''
  return path.startsWith('/') ? path : `/${path}`
}

const homeCrumb = (locale: Locale): BreadcrumbItem => ({
  name: locale === 'en' ? 'Home' : 'Inicio',
  route: 'home',
})

/* ══════════════════════════════════════════════════════════════════════
   SHARED VALUE OBJECTS
   ══════════════════════════════════════════════════════════════════════ */

/**
 * Identity links. `sameAs` here plus `rel="me"` on the rendered links is what
 * lets Google reconcile the profiles into one entity — so this list stays
 * exactly as long as the set of profiles that genuinely belong to Carlos.
 */
const SAME_AS: string[] = [
  SOCIAL_LINKS.linkedin,
  SOCIAL_LINKS.github,
  SOCIAL_LINKS.githubAlt,
]

/** Topical expertise. Shared by #person and #business so they never drift. */
const KNOWS_ABOUT: string[] = [
  'Technical SEO',
  'SEO Técnico',
  'Core Web Vitals',
  'Schema.org',
  'JSON-LD',
  'Structured Data',
  'Information Architecture',
  'Site Migrations',
  'Web Performance',
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
  'Data Visualization',
  'Project Management',
  'Scrum',
  'PMBOK',
  'CI/CD',
  'AWS',
  'Full-Stack Development',
]

function areaServed(locale: Locale): JsonLdNode[] {
  return [
    { '@type': 'Country', name: locale === 'en' ? 'Mexico' : 'México' },
    {
      '@type': 'Country',
      name: locale === 'en' ? 'United States' : 'Estados Unidos',
    },
    {
      '@type': 'Place',
      name: locale === 'en' ? 'Worldwide (remote)' : 'Mundial (remoto)',
    },
  ]
}

function postalAddress(locale: Locale): JsonLdNode {
  return {
    '@type': 'PostalAddress',
    addressLocality: locale === 'en' ? NAP.localityEn : NAP.locality,
    addressRegion: NAP.region,
    addressCountry: NAP.country,
    // NAP.postalCode is intentionally empty — no street address is published,
    // so none is claimed here.
  }
}

const AVAILABLE_LANGUAGES: JsonLdNode[] = [
  { '@type': 'Language', name: 'Spanish', alternateName: 'es' },
  { '@type': 'Language', name: 'English', alternateName: 'en' },
]

/**
 * The offer catalogue, built from real service data and ROUTES.
 *
 * Referenced **by url**, not by `@id`: the Service nodes only exist in the home
 * and services-hub graphs, and #person is emitted on every page — pointing at
 * their @ids from here would dangle on every other URL.
 */
function offerCatalog(locale: Locale): JsonLdNode {
  const items = getServices(locale).flatMap((service) => {
    if (!isServiceRouteKey(service.route)) return []
    const route = service.route
    return [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.title,
          url: routeUrl(route, locale),
        },
      } satisfies JsonLdNode,
    ]
  })

  return {
    '@type': 'OfferCatalog',
    name:
      locale === 'en'
        ? 'Consulting & Development Services'
        : 'Servicios de Consultoría y Desarrollo',
    itemListElement: items,
  }
}

/* ══════════════════════════════════════════════════════════════════════
   ENTITY NODES
   ══════════════════════════════════════════════════════════════════════ */

/**
 * The headshot, as its own graph member so #person, #business and every
 * WebPage can reference one image entity instead of repeating it.
 * Emitted by `generateLayoutGraph`, i.e. present on every page.
 */
function generatePersonImageSchema(locale: Locale): JsonLdNode {
  return {
    '@type': 'ImageObject',
    '@id': ID.personImage,
    url: `${BASE_URL}${SEO_IMAGES.avatar}`,
    contentUrl: `${BASE_URL}${SEO_IMAGES.avatar}`,
    width: SEO_IMAGES.avatarWidth,
    height: SEO_IMAGES.avatarHeight,
    caption: SEO_IMAGES.avatarAlt[locale],
    inLanguage: langTag(locale),
  }
}

/** #person — the primary entity of the whole site. */
export function generatePersonSchema(locale: Locale): JsonLdNode {
  const jobTitle =
    locale === 'en'
      ? 'Technical SEO Consultant & Full-Stack Engineer'
      : 'Consultor SEO Técnico & Ingeniero Full-Stack'

  return {
    '@type': 'Person',
    '@id': ID.person,
    name: NAP.name,
    alternateName: ['Carlos Anaya Ruíz', 'Carlos Anaya'],
    givenName: 'Carlos',
    familyName: 'Anaya Ruiz',
    url: BASE_URL,
    image: { '@id': ID.personImage },
    jobTitle,
    description:
      locale === 'en'
        ? 'Computer Science engineer with 5+ years leading software projects, technical SEO, Next.js and Firebase development, AI automation, and data dashboards. PMP certified. Previously at Amazon, Master Loyalty Group, and Wan Hai Lines.'
        : 'Ingeniero en Tecnologías Computacionales con +5 años liderando proyectos de software, SEO técnico, desarrollo Next.js y Firebase, automatización con IA y dashboards de datos. Certificado PMP. Antes en Amazon, Master Loyalty Group y Wan Hai Lines.',
    email: `mailto:${NAP.email}`,
    telephone: NAP.phone,
    address: postalAddress(locale),
    // Remote-first practice: the work location is the city, not a storefront.
    workLocation: {
      '@type': 'Place',
      name: locale === 'en' ? NAP.localityEn : NAP.locality,
      address: postalAddress(locale),
    },
    nationality: { '@type': 'Country', name: 'Mexico' },
    knowsLanguage: AVAILABLE_LANGUAGES,
    knowsAbout: KNOWS_ABOUT,
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'Project Management Professional (PMP)',
        credentialCategory: 'Professional Certification',
      },
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'TOEFL iBT (score 92)',
        credentialCategory: 'Language Certification',
      },
      {
        '@type': 'EducationalOccupationalCredential',
        name:
          locale === 'en'
            ? 'Computer Science Engineering degree'
            : 'Ingeniería en Tecnologías Computacionales',
        credentialCategory: 'degree',
        recognizedBy: {
          '@type': 'CollegeOrUniversity',
          name: 'Tecnológico de Monterrey',
        },
      },
    ],
    alumniOf: [
      {
        '@type': 'CollegeOrUniversity',
        name: 'Tecnológico de Monterrey',
        department:
          locale === 'en'
            ? 'School of Engineering and Sciences'
            : 'Escuela de Ingeniería y Ciencias',
      },
    ],
    hasOccupation: {
      '@type': 'Occupation',
      name: jobTitle,
      occupationLocation: {
        '@type': 'City',
        name: locale === 'en' ? NAP.localityEn : NAP.locality,
      },
    },
    // Both directions of the person ⇄ practice relationship.
    worksFor: { '@id': ID.business },
    hasOfferCatalog: offerCatalog(locale),
    // A URL, not an @id: the ProfilePage node only exists on the about page.
    mainEntityOfPage: routeUrl('sobreMi', locale),
    sameAs: SAME_AS,
  }
}

/**
 * #business — the practice Carlos operates.
 *
 * A first-class graph member, not an inline `worksFor` blob, so "what does he
 * sell and where" resolves to a real node with an address, contact point and
 * offer catalogue.
 *
 * Deliberately absent: `priceRange` (no published pricing), `aggregateRating`
 * and `review` (self-serving review markup is not eligible for stars and we
 * have no review data), `openingHours` (remote, by appointment — hours would
 * be a claim we cannot keep).
 */
export function generateProfessionalServiceSchema(locale: Locale): JsonLdNode {
  return {
    '@type': 'ProfessionalService',
    '@id': ID.business,
    name: SITE_CONFIG.businessName,
    alternateName: SITE_CONFIG.name,
    url: BASE_URL,
    image: { '@id': ID.personImage },
    description:
      locale === 'en'
        ? 'Technical SEO consulting and web engineering practice based in Mexico City: technical audits, structured data, Core Web Vitals, migrations without traffic loss, Next.js and Firebase development, AI automation, and dashboards.'
        : 'Práctica de consultoría SEO técnico e ingeniería web con base en Ciudad de México: auditorías técnicas, datos estructurados, Core Web Vitals, migraciones sin pérdida de tráfico, desarrollo Next.js y Firebase, automatización con IA y dashboards.',
    founder: { '@id': ID.person },
    employee: { '@id': ID.person },
    address: postalAddress(locale),
    telephone: NAP.phone,
    email: `mailto:${NAP.email}`,
    areaServed: areaServed(locale),
    availableLanguage: AVAILABLE_LANGUAGES,
    knowsAbout: KNOWS_ABOUT,
    knowsLanguage: AVAILABLE_LANGUAGES,
    /* DOS puntos de contacto y no uno, porque no son el mismo canal.
       WhatsApp no es «el teléfono»: tiene su propia URL, su propio uso —una
       duda corta— y es como llega la mayoría desde un móvil en México. Un
       solo nodo que mezcla correo y teléfono describe mal la realidad, y un
       asistente que lee ese grafo no puede ofrecer el canal correcto.

       `contactOption` no lleva `TollFree` ni nada parecido: no aplica, y
       marcar lo que no es cierto es peor que no marcar. */
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType:
          locale === 'en' ? 'Sales enquiries' : 'Consultas de negocio',
        email: `mailto:${NAP.email}`,
        telephone: NAP.phone,
        url: routeUrl('contacto', locale),
        availableLanguage: AVAILABLE_LANGUAGES,
      },
      {
        '@type': 'ContactPoint',
        contactType: locale === 'en' ? 'Instant messaging' : 'Mensajería',
        telephone: NAP.phone,
        url: `https://wa.me/${NAP.phone.replace(/\D/g, '')}`,
        availableLanguage: AVAILABLE_LANGUAGES,
      },
    ],
    hasOfferCatalog: offerCatalog(locale),
    sameAs: SAME_AS,
  }
}

/**
 * #website.
 *
 * No `potentialAction` / `SearchAction`: there is no site search, and markup
 * for a search endpoint that does not exist is fabricated structured data.
 */
export function generateWebSiteSchema(locale: Locale): JsonLdNode {
  return {
    '@type': 'WebSite',
    '@id': ID.website,
    name: SITE_CONFIG.name,
    alternateName: BASE_URL.replace(/^https?:\/\//, ''),
    url: BASE_URL,
    description:
      locale === 'en'
        ? 'Technical SEO consulting, Next.js and Firebase development, AI automation, and dashboards by Carlos Anaya Ruiz, from Mexico City.'
        : 'Consultoría SEO técnico, desarrollo Next.js y Firebase, automatización con IA y dashboards por Carlos Anaya Ruiz, desde Ciudad de México.',
    inLanguage: langTag(locale),
    publisher: { '@id': ID.person },
    copyrightHolder: { '@id': ID.person },
    about: { '@id': ID.person },
    image: { '@id': ID.personImage },
  }
}

/* ══════════════════════════════════════════════════════════════════════
   PAGE NODES
   ══════════════════════════════════════════════════════════════════════ */

interface PageNodeOptions extends PageDates {
  locale: Locale
  /** Absolute page URL — always built from ROUTES by the caller. */
  pageUrl: string
  name: string
  description?: string
  type?: WebPageType
  /** Set when the same graph also emits a BreadcrumbList for this page. */
  hasBreadcrumb?: boolean
  /** @id of the entity the page is primarily about, when there is one. */
  mainEntityId?: string
  /** Only for pages where the headshot actually renders. */
  showsPrimaryImage?: boolean
}

function buildPageNode({
  locale,
  pageUrl,
  name,
  description,
  type = 'WebPage',
  hasBreadcrumb = false,
  mainEntityId,
  showsPrimaryImage = false,
  datePublished,
  dateModified,
}: PageNodeOptions): JsonLdNode {
  return {
    '@type': type,
    '@id': pageIdFor(pageUrl),
    url: pageUrl,
    name,
    ...(description ? { description } : {}),
    isPartOf: { '@id': ID.website },
    about: { '@id': ID.person },
    ...(mainEntityId ? { mainEntity: { '@id': mainEntityId } } : {}),
    inLanguage: langTag(locale),
    ...(showsPrimaryImage
      ? { primaryImageOfPage: { '@id': ID.personImage } }
      : {}),
    ...(hasBreadcrumb ? { breadcrumb: { '@id': breadcrumbIdFor(pageUrl) } } : {}),
    // Real dates only: `datePublished` falls back to when the site was first
    // published; `dateModified` is omitted unless the page passes a true one.
    datePublished: datePublished ?? SITE_CONFIG.foundingDate,
    ...(dateModified ? { dateModified } : {}),
  }
}

export interface WebPageOptions extends PageDates {
  locale: Locale
  /** ROUTES key. The only way a page URL is built. */
  route: RouteKey
  name: string
  description?: string
  type?: WebPageType
  hasBreadcrumb?: boolean
  mainEntityId?: string
  showsPrimaryImage?: boolean
}

/** A single WebPage (or subtype) node for a route in the ROUTES table. */
export function generateWebPageSchema(options: WebPageOptions): JsonLdNode {
  const { route, ...rest } = options
  return buildPageNode({ ...rest, pageUrl: routeUrl(route, options.locale) })
}

/**
 * BreadcrumbList. `pageUrl` gives the node a stable @id so the page can point
 * at it with `breadcrumb`.
 */
export function generateBreadcrumbSchema(
  items: readonly BreadcrumbItem[],
  locale: Locale,
  pageUrl?: string
): JsonLdNode {
  return {
    '@type': 'BreadcrumbList',
    ...(pageUrl ? { '@id': breadcrumbIdFor(pageUrl) } : {}),
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.route
        ? routeUrl(item.route, locale)
        : `${BASE_URL}/${locale}${normalizePath(item.url ?? '')}`,
    })),
  }
}

/**
 * FAQPage.
 *
 * Google retired FAQ rich results for most sites in 2023, so this will not
 * render as an expandable snippet. It stays because it is still the cleanest
 * machine-readable form of a question-and-answer block, and AI crawlers and
 * assistants extract from it — not because it will win SERP real estate.
 * The questions and answers must be the ones visibly rendered on the page.
 */
export function generateFAQSchema(
  faqs: readonly FaqEntry[],
  options?: { locale?: Locale; pageUrl?: string }
): JsonLdNode {
  return {
    '@type': 'FAQPage',
    ...(options?.pageUrl ? { '@id': faqIdFor(options.pageUrl) } : {}),
    ...(options?.locale ? { inLanguage: langTag(options.locale) } : {}),
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }
}

/* ══════════════════════════════════════════════════════════════════════
   SERVICE NODES
   ══════════════════════════════════════════════════════════════════════ */

/**
 * The four services, from real data in `data/services.ts`.
 *
 * One locale-independent `@id` per service, derived from its ROUTES key, so the
 * Spanish and English pages describe the same entity. Only emitted in graphs
 * where the services are actually listed (home, services hub).
 */
export function generateServiceSchemas(locale: Locale): JsonLdNode[] {
  return getServices(locale).flatMap((service) => {
    if (!isServiceRouteKey(service.route)) return []
    const route = service.route
    const url = routeUrl(route, locale)
    return [
      {
        '@type': 'Service',
        '@id': serviceEntityId(route),
        name: service.title,
        description: service.description,
        serviceType: service.title,
        url,
        provider: { '@id': ID.business },
        areaServed: areaServed(locale),
        availableChannel: {
          '@type': 'ServiceChannel',
          serviceUrl: url,
          availableLanguage: AVAILABLE_LANGUAGES,
        },
      } satisfies JsonLdNode,
    ]
  })
}

/** The Service node for one money page. Same canonical @id as the hub listing. */
export function generateSingleServiceSchema(
  locale: Locale,
  service: ServiceDescriptor
): JsonLdNode {
  const resolved = resolveService(service, locale)
  return {
    '@type': 'Service',
    '@id': resolved.entityId,
    name: service.title,
    description: service.description,
    serviceType: service.title,
    url: resolved.url,
    provider: { '@id': ID.business },
    areaServed: areaServed(locale),
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: resolved.url,
      availableLanguage: AVAILABLE_LANGUAGES,
    },
    mainEntityOfPage: { '@id': pageIdFor(resolved.url) },
  }
}

/* ══════════════════════════════════════════════════════════════════════
   GRAPH GENERATORS — one <script type="application/ld+json"> each
   ══════════════════════════════════════════════════════════════════════ */

const graph = (nodes: JsonLdNode[]): SchemaGraph => ({
  '@context': 'https://schema.org',
  '@graph': nodes,
})

/**
 * Layout level, emitted in `<head>` on every page: the three entities every
 * other graph is allowed to reference by @id.
 */
export function generateLayoutGraph(locale: Locale): SchemaGraph {
  return graph([
    generatePersonSchema(locale),
    generatePersonImageSchema(locale),
    generateProfessionalServiceSchema(locale),
    generateWebSiteSchema(locale),
  ])
}

/**
 * Home page: WebPage + the four Services + FAQ.
 *
 * `faqs` must be supplied by the caller. It used to be derived from
 * `getServices().flatMap(s => s.faq)`, which emitted all twelve service FAQs
 * here as well as on the four service pages — the same answers marked up twice
 * under two URLs. Home passes the engagement-level set from `data/faq.ts`
 * instead, so each question is answered by exactly one page.
 */
export function generateHomeGraph(
  locale: Locale,
  faqs: readonly FaqEntry[] = [],
  dates?: PageDates
): SchemaGraph {
  const pageUrl = routeUrl('home', locale)

  return graph([
    buildPageNode({
      locale,
      pageUrl,
      name:
        locale === 'en'
          ? 'Carlos Anaya Ruiz — Technical SEO Consultant & Full-Stack Engineer'
          : 'Carlos Anaya Ruiz — Consultor SEO Técnico e Ingeniero Full-Stack',
      description:
        locale === 'en'
          ? 'Technical SEO consulting, Next.js and Firebase development, AI automation, and dashboards by Carlos Anaya Ruiz, from Mexico City.'
          : 'Consultoría SEO técnico, desarrollo Next.js y Firebase, automatización con IA y dashboards por Carlos Anaya Ruiz, desde Ciudad de México.',
      mainEntityId: ID.person,
      showsPrimaryImage: true,
      ...dates,
    }),
    ...generateServiceSchemas(locale),
    ...(faqs.length > 0
      ? [generateFAQSchema(faqs, { locale, pageUrl })]
      : []),
  ])
}

/**
 * /servicios hub: CollectionPage + ItemList of the four services + breadcrumbs.
 * The Service nodes are included here too, so the ItemList's @id references
 * resolve inside this graph instead of dangling.
 */
export function generateServicesHubGraph(
  locale: Locale,
  dates?: PageDates
): SchemaGraph {
  const pageUrl = routeUrl('services', locale)
  const services = generateServiceSchemas(locale)

  const itemList: JsonLdNode = {
    '@type': 'ItemList',
    '@id': `${pageUrl}#servicelist`,
    name: locale === 'en' ? 'Services' : 'Servicios',
    numberOfItems: services.length,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: String(service.name ?? ''),
      url: String(service.url ?? ''),
      item: { '@id': String(service['@id'] ?? '') },
    })),
  }

  return graph([
    buildPageNode({
      locale,
      pageUrl,
      type: 'CollectionPage',
      name:
        locale === 'en'
          ? 'Services — Technical SEO, Web Development, AI Automation & Dashboards'
          : 'Servicios — SEO Técnico, Desarrollo Web, Automatización con IA y Dashboards',
      description:
        locale === 'en'
          ? 'The four ways I work with clients: technical SEO consulting, Next.js and Firebase development, AI automation, and responsive dashboards.'
          : 'Las cuatro formas en que trabajo con clientes: consultoría SEO técnico, desarrollo Next.js y Firebase, automatización con IA y dashboards responsivos.',
      mainEntityId: `${pageUrl}#servicelist`,
      hasBreadcrumb: true,
      ...dates,
    }),
    itemList,
    ...services,
    generateBreadcrumbSchema(
      [
        homeCrumb(locale),
        { name: locale === 'en' ? 'Services' : 'Servicios', route: 'services' },
      ],
      locale,
      pageUrl
    ),
  ])
}

/** One service money page: WebPage + Service + breadcrumbs + FAQ. */
export function generateServicePageGraph(
  locale: Locale,
  service: ServiceDescriptor,
  breadcrumbs: readonly BreadcrumbItem[],
  faqs: readonly FaqEntry[] = [],
  dates?: PageDates
): SchemaGraph {
  const resolved = resolveService(service, locale)

  return graph([
    buildPageNode({
      locale,
      pageUrl: resolved.url,
      type: 'ItemPage',
      name: service.title,
      description: service.description,
      mainEntityId: resolved.entityId,
      hasBreadcrumb: breadcrumbs.length > 0,
      ...dates,
    }),
    generateSingleServiceSchema(locale, service),
    ...(breadcrumbs.length > 0
      ? [generateBreadcrumbSchema(breadcrumbs, locale, resolved.url)]
      : []),
    ...(faqs.length > 0
      ? [generateFAQSchema(faqs, { locale, pageUrl: resolved.url })]
      : []),
  ])
}

/**
 * About page: `ProfilePage` with `mainEntity` → #person.
 *
 * ProfilePage is the schema.org type for the canonical "about this person"
 * page, and it is what tells Google which URL to treat as the profile for the
 * entity behind the whole site.
 */
export function generateProfilePageGraph(
  locale: Locale,
  faqs: readonly FaqEntry[] = [],
  dates?: PageDates
): SchemaGraph {
  const pageUrl = routeUrl('sobreMi', locale)

  return graph([
    buildPageNode({
      locale,
      pageUrl,
      type: 'ProfilePage',
      /* «Líder Técnico» / «Tech Lead» NO estaba en ningún archivo de datos: los
         cargos registrados son Software Development Engineer II (Amazon),
         Project Manager, Full Stack Developer y Director de Tecnologías. Era una
         afirmación de seniority servida en datos estructurados sin un archivo
         detrás — el inflado que la propia página promete no hacer.

         El PMP sí se conserva: el dueño confirmó tenerlo. Lo que falta es la
         IMAGEN del certificado y, sobre todo, el FOLIO y la FECHA DE EMISIÓN —
         con esos dos, `hasCredential` puede llevar `identifier`, `validFrom` y
         `expires`, y la fila enlazar al registro público del PMI. Mientras no
         estén, la afirmación es correcta pero no comprobable en la página que se
         titula «para que no tengas que creerme». Ver `docs/CREDENCIALES.md`.

         ⚠ Y NO confundir con el curso de Udemy «PMP Certification Exam Prep
         Course, 35 PDU Contact Hours»: esas horas son el requisito para
         presentar el examen, no la credencial. Son dos cosas distintas y el
         sitio no debe mezclarlas. */
      name:
        locale === 'en'
          ? 'About Carlos Anaya Ruiz — Engineer, PMP & Technical SEO Consultant'
          : 'Sobre Carlos Anaya Ruiz — Ingeniero, PMP y Consultor SEO técnico',
      description:
        locale === 'en'
          ? 'Professional profile of Carlos Anaya Ruiz: Computer Science engineer from Tecnológico de Monterrey, PMP certified. Director of Technology at Law Offices of Manuel Solis; previously Amazon, Master Loyalty Group and Wan Hai Lines.'
          : 'Perfil profesional de Carlos Anaya Ruiz: ingeniero en Tecnologías Computacionales por el Tecnológico de Monterrey, certificado PMP. Director de Tecnologías en Law Offices of Manuel Solis; antes Amazon, Master Loyalty Group y Wan Hai Lines.',
      mainEntityId: ID.person,
      showsPrimaryImage: true,
      hasBreadcrumb: true,
      ...dates,
    }),
    generateBreadcrumbSchema(
      [
        homeCrumb(locale),
        {
          name: locale === 'en' ? 'About' : 'Sobre mí',
          route: 'sobreMi',
        },
      ],
      locale,
      pageUrl
    ),
    ...(faqs.length > 0 ? [generateFAQSchema(faqs, { locale, pageUrl })] : []),
  ])
}

/**
 * @deprecated Use `generateProfilePageGraph`. The about page is a ProfilePage,
 * not a generic AboutPage; this alias exists only to keep the current page
 * compiling during the migration.
 */
export function generateAboutPageGraph(
  locale: Locale,
  faqs?: readonly FaqEntry[],
  dates?: PageDates
): SchemaGraph {
  return generateProfilePageGraph(locale, faqs ?? [], dates)
}

/** Contact page: ContactPage → #business + breadcrumbs + FAQ. */
export function generateContactPageGraph(
  locale: Locale,
  faqs?: readonly FaqEntry[],
  dates?: PageDates
): SchemaGraph {
  const pageUrl = routeUrl('contacto', locale)
  const entries = faqs ?? []

  return graph([
    buildPageNode({
      locale,
      pageUrl,
      type: 'ContactPage',
      name:
        locale === 'en'
          ? 'Contact Carlos Anaya Ruiz — SEO & Development Consulting'
          : 'Contactar a Carlos Anaya Ruiz — Consultoría SEO y Desarrollo',
      description:
        locale === 'en'
          ? 'Contact Carlos Anaya Ruiz about technical SEO consulting, Next.js web development, AI automation, or dashboard projects.'
          : 'Contacta a Carlos Anaya Ruiz para consultoría SEO técnico, desarrollo web con Next.js, automatización con IA o proyectos de dashboards.',
      mainEntityId: ID.business,
      hasBreadcrumb: true,
      ...dates,
    }),
    generateBreadcrumbSchema(
      [
        homeCrumb(locale),
        {
          name: locale === 'en' ? 'Contact' : 'Contacto',
          route: 'contacto',
        },
      ],
      locale,
      pageUrl
    ),
    ...(entries.length > 0
      ? [generateFAQSchema(entries, { locale, pageUrl })]
      : []),
  ])
}

/**
 * Resources / books page: WebPage + breadcrumbs.
 * No `Book` or `Product` node until there is a real, purchasable book.
 */
export function generateBooksPageGraph(
  locale: Locale,
  dates?: PageDates
): SchemaGraph {
  const pageUrl = routeUrl('libros', locale)

  return graph([
    buildPageNode({
      locale,
      pageUrl,
      name:
        locale === 'en'
          ? 'Technical Resources & Books — Carlos Anaya Ruiz'
          : 'Recursos Técnicos y Libros — Carlos Anaya Ruiz',
      hasBreadcrumb: true,
      ...dates,
    }),
    generateBreadcrumbSchema(
      [
        homeCrumb(locale),
        {
          name: locale === 'en' ? 'Resources' : 'Recursos',
          route: 'libros',
        },
      ],
      locale,
      pageUrl
    ),
  ])
}

/**
 * Privacy / terms pages: WebPage + breadcrumbs, nothing more.
 *
 * `name` and `description` are overridable so they can be kept identical to
 * the headings the page actually renders.
 */
export function generateLegalPageGraph(
  locale: Locale,
  kind: LegalPageKind,
  options?: PageDates & { name?: string; description?: string }
): SchemaGraph {
  const route: RouteKey = kind === 'privacy' ? 'privacidad' : 'terminos'
  const pageUrl = routeUrl(route, locale)

  const defaultName =
    kind === 'privacy'
      ? locale === 'en'
        ? 'Privacy Policy'
        : 'Aviso de Privacidad'
      : locale === 'en'
        ? 'Terms and Conditions'
        : 'Términos y Condiciones'

  return graph([
    buildPageNode({
      locale,
      pageUrl,
      name: options?.name ?? defaultName,
      ...(options?.description ? { description: options.description } : {}),
      hasBreadcrumb: true,
      datePublished: options?.datePublished,
      dateModified: options?.dateModified,
    }),
    generateBreadcrumbSchema(
      [homeCrumb(locale), { name: options?.name ?? defaultName, route }],
      locale,
      pageUrl
    ),
  ])
}
