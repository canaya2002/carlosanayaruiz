import { defineRouting } from 'next-intl/routing'

/**
 * Locale-prefixed routing with localised pathnames.
 *
 * Keys are the internal (Spanish) pathname used in `<Link href>`; the values
 * are the segment each locale actually renders. `localePrefix: 'always'` means
 * every URL is unambiguous — there is no unprefixed variant competing for the
 * same content, which is what keeps canonicalisation clean.
 *
 * These keys must stay in sync with the ROUTES table in lib/constants.ts,
 * which is what sitemap, schema and hreflang are built from.
 */
export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localePrefix: 'always',

  /**
   * ⚠ DO NOT SET THIS BACK TO TRUE (its default).
   *
   * With detection on, next-intl negotiates the locale from the visitor's
   * `Accept-Language` header, so anyone whose browser prefers English lands on
   * /en and never sees the Spanish site — including the owner. That is how the
   * site appeared to be "English only".
   *
   * This practice is Mexico-first: Spanish is the primary market and the
   * hreflang x-default. An unprefixed request must resolve to /es, every time,
   * and English is reached by choice — the language switcher, or a direct /en
   * link. Google also advises against redirecting by Accept-Language, since its
   * crawlers do not send the header consistently and can end up seeing only one
   * variant.
   */
  localeDetection: false,
  pathnames: {
    '/': '/',

    // Services hub + the four service pages
    '/servicios': { es: '/servicios', en: '/services' },
    '/seo-tecnico': { es: '/seo-tecnico', en: '/technical-seo' },
    '/desarrollo-web': { es: '/desarrollo-web', en: '/web-development' },
    '/automatizacion-ia': { es: '/automatizacion-ia', en: '/ai-automation' },
    '/dashboards': { es: '/dashboards', en: '/dashboards' },

    // Brand + trust
    '/sobre-mi': { es: '/sobre-mi', en: '/about' },
    '/contacto': { es: '/contacto', en: '/contact' },
    '/libros': { es: '/libros', en: '/books' },

    // Trayectoria: proyectos (con su ruta dinamica por empresa), premios,
    // certificaciones y CV.
    '/proyectos': { es: '/proyectos', en: '/projects' },
    '/proyectos/[slug]': { es: '/proyectos/[slug]', en: '/projects/[slug]' },
    '/premios': { es: '/premios', en: '/awards' },
    '/certificaciones': { es: '/certificaciones', en: '/certifications' },
    '/cv': { es: '/cv', en: '/cv' },

    // Legal
    '/privacidad': { es: '/privacidad', en: '/privacy' },
    '/terminos': { es: '/terminos', en: '/terms' },
  },
})

export type Locale = (typeof routing.locales)[number]
export type Pathname = keyof typeof routing.pathnames

/**
 * Rutas SIN parámetros dinámicos.
 *
 * Es lo que aceptan los breadcrumbs y cualquier sitio que reciba una ruta
 * como string suelto: `/proyectos/[slug]` necesita un objeto con `params`,
 * así que dejarla entrar en esos tipos hace que el error aparezca en el sitio
 * de llamada y no aquí, que es donde se entiende.
 */
export type StaticPathname = Exclude<Pathname, `${string}[${string}`>
