import { Locale } from '@/data/types'

export const SITE_CONFIG = {
  name: 'Carlos Anaya Ruiz',
  /** Legal/trading name used for the practice, distinct from the person. */
  businessName: 'Carlos Anaya Ruiz — Consultoría SEO Técnico & Desarrollo Web',
  /**
   * ⚠ HOST CANÓNICO. Tiene que ser el host que REALMENTE sirve 200.
   *
   * Vercel tiene el apex (carlosanayaruiz.com) redirigiendo a www con un 307,
   * así que www es el que sirve. Cuando esta constante apuntaba al apex, cada
   * canonical, cada hreflang, los 22 <loc> del sitemap y los @id del grafo
   * JSON-LD apuntaban a URLs que redirigen — un sitemap lleno de 3xx y
   * canonicals que obligan a Google a seguir un salto para decidir por su
   * cuenta cuál es la URL buena.
   *
   * Si algún día se prefiere el apex como canónico (más corto y coincide con
   * la marca), hay que hacer DOS cosas juntas: invertir la redirección en la
   * configuración de dominios de Vercel (www -> apex, permanente 308) y
   * cambiar esta constante. Cambiar solo una reintroduce el mismo defecto al
   * revés.
   */
  url: 'https://www.carlosanayaruiz.com',
  /** Host sin protocolo ni www, para mostrar en tarjetas y pies. */
  displayHost: 'carlosanayaruiz.com',
  locales: ['es', 'en'] as const,
  defaultLocale: 'es' as const,
  /** First publication of the site. Used as datePublished; never "today". */
  foundingDate: '2025-02-01',
} as const

/**
 * ════════════════════════════════════════════════════════════════
 * NAP — Name, Address, Phone.
 *
 * Single source of truth. Every rendered surface (header, footer,
 * contact page, JSON-LD) reads from here, so the values that Google
 * and the AI crawlers extract can never drift apart between pages.
 *
 * Any change here must also be made on the Google Business Profile,
 * LinkedIn, and every directory listing — inconsistent NAP is the
 * single most common local-SEO defect.
 * ════════════════════════════════════════════════════════════════
 */
export const NAP = {
  name: 'Carlos Anaya Ruiz',
  email: 'carlos@carlosanayaweb.com',
  /** E.164, for tel: hrefs and schema. */
  phone: '+525544167974',
  /** Human-readable, for display. */
  phoneDisplay: '+52 55 4416 7974',
  locality: 'Ciudad de México',
  localityEn: 'Mexico City',
  region: 'CDMX',
  postalCode: '',
  country: 'MX',
  countryName: 'México',
  countryNameEn: 'Mexico',
  /** Timezone for opening hours and response-time claims. */
  timeZone: 'America/Mexico_City',
} as const

/**
 * Identity links. `rel="me"` on these plus `sameAs` in the Person schema is
 * what lets Google reconcile the profiles into one entity.
 *
 * Only profiles that genuinely belong to Carlos belong here — a padded
 * `sameAs` list weakens entity resolution instead of helping it.
 */
export const SOCIAL_LINKS = {
  linkedin: 'https://www.linkedin.com/in/carlos-anaya-ruiz-732abb249/',
  github: 'https://github.com/canaya2002',
  githubAlt: 'https://github.com/CArlos12002',
  email: NAP.email,
  phone: NAP.phone,
  certsDrive:
    'https://drive.google.com/drive/folders/1wanG6pMmIIlwEir_5bZv4bbMYOQlxuHz?usp=sharing',
  /**
   * La otra propiedad: donde va quien YA es cliente.
   *
   * Es el segundo enlace del sitio que manda a alguien fuera del dominio a
   * propósito —el otro es el CTA del pie— y por eso está bien que lo haga: el
   * clic de mayor intención, quien todavía no ha contratado, se queda aquí. Y
   * descongestiona la página de contacto de gente que no viene a contratar
   * sino a resolver algo de un trabajo en curso. Sin él esas dos intenciones
   * compiten por el mismo formulario, y la que pierde es la que paga.
   */
  clientPortal: 'https://carlosanayaweb.com',
} as const

/**
 * ════════════════════════════════════════════════════════════════
 * PALETA — espejo de los tokens de color de app/globals.css.
 *
 * Three consumers cannot read a CSS custom property and therefore need
 * literal colours:
 *
 *   app/manifest.ts              — PWA background/theme colour
 *   app/[locale]/layout.tsx      — the `themeColor` viewport export
 *   lib/og.tsx                   — Satori has no CSS variable support
 *
 * Los tres llevaban su propio hex copiado a mano y los tres ya habían derivado:
 * las tarjetas OG y el chrome de la app instalada se pintaban con un azul que no
 * era el de marca. Justo en las superficies que la gente captura y comparte.
 *
 * ⚠ Estos valores están DUPLICADOS a propósito. Si cambias un token en
 *   globals.css, corre `npm run palette:check`: compara esta tabla contra el CSS
 *   y además valida cada piso de contraste WCAG. Falla si algo no cuadra.
 * ════════════════════════════════════════════════════════════════
 */
export const PALETTE_HEX = {
  /**
   * ⚠ La llave se sigue llamando `light` por compatibilidad: la nombran las
   * 13 rutas `opengraph-image.tsx`, el manifiesto y el `theme-color`.
   * El nombre es vestigial — el sistema «Papel Ahumado» es oscuro. Se
   * renombra cuando se migre la última de esas rutas.
   */
  light: {
    /** hollín · fondo dominante, 50% de la superficie */
    ground: '#12100e',
    /** humo · hollín delgado, el único escalón de superficie */
    surface: '#23201c',
    /** papel · el trazo. 15.24:1 sobre hollín */
    ink: '#ebe6d9',
    /** 8.57:1 sobre hollín */
    inkMuted: '#b3aea0',
    hairline: '#2a2620',
    /**
     * En este sistema un enlace es PAPEL. No hay color de marca: el único
     * croma reservado son minio y umbral, y ninguno puede usarse aquí.
     */
    brand: '#ebe6d9',
    brandStrong: '#f7f4ec',
    brandWash: '#23201c',
    /**
     * Legado neutralizado. `sky` y `cyan` ya no son azules — son ceniza.
     * Siguen existiendo porque las nombran rutas todavía sin migrar y
     * desaparecen con ellas.
     */
    sky: '#8c877a',
    skyInk: '#b3aea0',
    cyan: '#8c877a',
    cyanInk: '#b3aea0',
    /**
     * ⚠ SEMÁNTICOS, NO DECORATIVOS. Son los hex exactos que Google publica
     * para «fail» y «good» en Core Web Vitals. Solo pueden aparecer sobre
     * una medición real que cruza un umbral. Usarlos para adornar hace que
     * el instrumento mienta, que es lo único que este sitio no puede hacer.
     */
    minium: '#ff4e42',
    threshold: '#0cce6b',
  },
  /**
   * No hay entrada `dark`. El sitio tiene un solo tema; dejar aquí una
   * segunda paleta sin usar sería una invitación a reintroducir el modo
   * oscuro a medias.
   */
} as const

/**
 * Search-console verification tokens. Read from env so the repo carries no
 * account-specific strings, and so an unset value emits no meta tag at all
 * rather than an empty one.
 *
 *   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=...
 *   NEXT_PUBLIC_BING_SITE_VERIFICATION=...
 */
export const SEARCH_VERIFICATION = {
  google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? '',
  bing: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ?? '',
} as const

/**
 * ════════════════════════════════════════════════════════════════
 * IMAGE MAP
 *
 * Open Graph images are NOT static files — they are generated at the
 * correct 1200×630 by the `opengraph-image.tsx` route handlers, per
 * locale and per page. That removes the class of bug where a declared
 * size and the real file disagree.
 *
 * Raster files here are only the headshot and the app icons, each at
 * exactly the size it is served at.
 * ════════════════════════════════════════════════════════════════
 */
export const SEO_IMAGES = {
  /** Primary headshot. Square source, served responsively. */
  avatar: '/carlos-anaya-ruiz.jpg',
  avatarWidth: 800,
  avatarHeight: 800,
  /** Alt text per locale — describes the person and the role, no stuffing. */
  avatarAlt: {
    es: 'Carlos Anaya Ruiz, consultor SEO técnico y desarrollador full-stack en Ciudad de México',
    en: 'Carlos Anaya Ruiz, technical SEO consultant and full-stack developer in Mexico City',
  } as Record<Locale, string>,
  /**
   * El retrato de medio cuerpo. Es un RECORTE con canal alfa —fondo
   * transparente, no negro— y de ahí sale todo lo que el sistema puede hacer
   * con él: se compone directo sobre el hollín, la retícula del tambor se ve
   * por detrás y no hace falta ni una caja ni un borde para encuadrarlo.
   *
   * WebP y no PNG: el mismo recorte a 1000 px pesa 95 KB en vez de 2.8 MB, y
   * next/image lo vuelve a codificar a AVIF por encima de eso.
   */
  portrait: '/carlos-anaya-ruiz-retrato.webp',
  portraitWidth: 1000,
  portraitHeight: 1663,
  /**
   * El retrato en blanco y negro. Es el que va en «el operador», en /sobre-mi y
   * en el CV, y sustituye a la foto de 800×800 con fondo de oficina que era
   * deuda declarada.
   *
   * Cuadrado y de estudio, así que no necesita el duotono de media tinta que
   * llevaba la anterior: esa trama de rayas existía para convertir una foto
   * pobre en un artefacto de imprenta deliberado. Con esta se retiró.
   *
   * 400×400 son 8 KB. Es pequeña para 2× a más de 200 px, así que NO se sirve
   * más grande que 15rem en ningún sitio.
   */
  portraitBw: '/carlos-anaya-ruiz-bn.webp',
  portraitBwSize: 400,
  /**
   * Alt PROPIO de la foto de estudio, distinto del de `avatarAlt`.
   *
   * Las tres páginas que la montan —la portada, /sobre-mi y /cv— reusaban
   * `avatarAlt`, así que la portada servía DOS imágenes distintas —el recorte
   * con alfa del masthead y esta, a 38 000 caracteres de distancia— con el
   * MISMO texto alternativo palabra por palabra. Para un lector de pantalla son
   * dos veces la misma frase sobre dos fotos distintas, y para un buscador dos
   * imágenes indistinguibles.
   *
   * Describe la foto, no repite el rol: el rol ya está en el `avatarAlt` del
   * retrato y en la propia página.
   */
  portraitBwAlt: {
    es: 'Retrato de estudio en blanco y negro de Carlos Anaya Ruiz, de frente y sobre fondo oscuro',
    en: 'Black and white studio portrait of Carlos Anaya Ruiz, facing the camera against a dark background',
  } as Record<Locale, string>,
  appleTouchIcon: '/apple-touch-icon.png',
  icon192: '/icon-192.png',
  icon512: '/icon-512.png',
  iconMaskable: '/icon-maskable-512.png',
  favicon: '/favicon.ico',
  iconSvg: '/icon.svg',
} as const

/**
 * Canonical route table.
 *
 * Keyed by the internal (Spanish) pathname that `i18n/routing.ts` uses, with
 * the localised segment for each locale. Anything that needs to build a URL
 * for a page — sitemap, schema, breadcrumbs, hreflang — reads this, so a
 * renamed slug can never leave a stale reference behind.
 */
export const ROUTES = {
  home: { es: '', en: '' },
  services: { es: '/servicios', en: '/services' },
  seoTecnico: { es: '/seo-tecnico', en: '/technical-seo' },
  desarrolloWeb: { es: '/desarrollo-web', en: '/web-development' },
  automatizacionIa: { es: '/automatizacion-ia', en: '/ai-automation' },
  dashboards: { es: '/dashboards', en: '/dashboards' },
  sobreMi: { es: '/sobre-mi', en: '/about' },
  contacto: { es: '/contacto', en: '/contact' },
  libros: { es: '/libros', en: '/books' },
  proyectos: { es: '/proyectos', en: '/projects' },
  premios: { es: '/premios', en: '/awards' },
  certificaciones: { es: '/certificaciones', en: '/certifications' },
  cv: { es: '/cv', en: '/cv' },
  /**
   * El índice del blog. Los artículos NO están aquí: son cien URLs generadas
   * desde `data/blog.ts`, y meterlas en esta tabla la volvería un registro de
   * contenido en vez de un mapa de secciones. El sitemap las añade aparte,
   * filtrando por fecha de publicación.
   */
  blog: { es: '/blog', en: '/blog' },
  privacidad: { es: '/privacidad', en: '/privacy' },
  terminos: { es: '/terminos', en: '/terms' },
} as const

export type RouteKey = keyof typeof ROUTES

/** Absolute URL for a route in a given locale. */
export function routeUrl(key: RouteKey, locale: Locale): string {
  return `${SITE_CONFIG.url}/${locale}${ROUTES[key][locale]}`
}

/** Locale-relative path for a route, e.g. `/seo-tecnico`. */
export function routePath(key: RouteKey, locale: Locale): string {
  return ROUTES[key][locale]
}

export function getSiteConfig(locale: Locale) {
  const configs: Record<
    Locale,
    { title: string; description: string; ogLocale: string }
  > = {
    es: {
      title:
        'Carlos Anaya Ruiz — Consultor SEO Técnico en México | Next.js, Schema y Core Web Vitals',
      description:
        'Consultor SEO técnico e ingeniero full-stack en Ciudad de México. Auditorías técnicas, datos estructurados, Core Web Vitals y migraciones sin pérdida de tráfico. Ingeniero por el Tec de Monterrey, certificado PMP, ex-Amazon.',
      ogLocale: 'es_MX',
    },
    en: {
      title:
        'Carlos Anaya Ruiz — Technical SEO Consultant in Mexico | Next.js, Schema & Core Web Vitals',
      description:
        'Technical SEO consultant and full-stack engineer in Mexico City. Technical audits, structured data, Core Web Vitals, and migrations without traffic loss. Tec de Monterrey engineer, PMP certified, ex-Amazon.',
      ogLocale: 'en_US',
    },
  }
  return { ...SITE_CONFIG, ...configs[locale], name: SITE_CONFIG.name }
}
