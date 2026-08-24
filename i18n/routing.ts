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

  /**
   * ⚠ APAGADO A PROPÓSITO. NO LO VUELVAS A PONER EN TRUE (su valor por omisión).
   *
   * Con esto activo, el middleware de next-intl emite una cabecera `Link` con
   * alternates en TODA ruta que case el matcher. Medido sobre el build servido:
   *
   *   link: <…/es/blog/x>; hreflang="es", <…/en/blog/x>; hreflang="en",
   *         <…/blog/x>; hreflang="x-default"
   *
   * mientras el HTML de esa misma URL declara solo `es-MX` y `x-default`.
   * Google lee la cabecera igual que la etiqueta, así que el sitio ESTABA
   * declarando `en-US` para el blog apuntando a `/en/blog/{slug}`, una URL que
   * redirige. Es exactamente el par no recíproco que `lib/blog.ts` dice haber
   * evitado — y encima con dos juegos de códigos contradictorios (`es`/`en` en
   * la cabecera contra `es-MX`/`en-US` en el HTML) y un x-default sin prefijo
   * que también redirige.
   *
   * El hreflang lo emite `generateMetadata` por página, que ya es correcto y
   * completo en las 16 rutas. Google dice explícitamente que combinar los dos
   * métodos no aporta nada en Search.
   *
   * Va aquí y no como segundo argumento de `createMiddleware`: en next-intl 4.8
   * esa función acepta UN solo argumento y la otra forma no compila. Puesto
   * aquí tampoco puede divergir de lo que consumen los helpers de navegación,
   * porque es la misma fuente.
   */
  alternateLinks: false,

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

    /**
     * EL BLOG — mismo segmento en los dos idiomas, y contenido solo en
     * español.
     *
     * Los 100 artículos están escritos para México y LATAM. Servir ese texto
     * bajo /en y declararlo `en-US` en hreflang es un error que Search
     * Console reporta, así que /en/blog redirige a /es/blog (ver
     * middleware.ts) y el hreflang de estas páginas declara es-MX y
     * x-default, sin en-US.
     *
     * El segmento se deja igual en ambos locales porque «blog» es la misma
     * palabra en los dos y una URL distinta por idioma para contenido que
     * solo existe en uno sería una URL que nunca resuelve.
     */
    '/blog': { es: '/blog', en: '/blog' },
    '/blog/[slug]': { es: '/blog/[slug]', en: '/blog/[slug]' },

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
