import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const isDev = process.env.NODE_ENV === 'development'
/** Vercel preview deployments inject the comment toolbar; production does not. */
const isPreview = process.env.VERCEL_ENV === 'preview'

/**
 * ════════════════════════════════════════════════════════════════
 * CONTENT SECURITY POLICY
 *
 * Built from a list rather than a string literal so each directive can carry
 * the reason it is shaped the way it is. A CSP nobody can reason about gets
 * loosened at the first incident and then never tightened again.
 *
 * What this policy has to survive:
 *   - Next.js' own inline bootstrap (`self.__next_f.push(...)`)
 *   - inline JSON-LD para el grafo de entidad
 *   - next/font, que auto-hospeda Sora + Plus Jakarta Sans en build, así que
 *     las fuentes son same-origin
 *   - Vercel Analytics + Speed Insights
 * ════════════════════════════════════════════════════════════════
 */

/** Vercel Analytics / Speed Insights loader. Same-origin on Vercel via
 *  /_vercel/*, this host in dev and on non-Vercel hosting. */
const VERCEL_SCRIPTS = 'https://va.vercel-scripts.com'
/** Legacy Web Vitals collection endpoint still used by some SDK versions. */
const VERCEL_VITALS = 'https://vitals.vercel-insights.com'

/**
 * Ya no hay endpoints de Firebase.
 *
 * El sitio tenía Firestore para el formulario de contacto y el newsletter, y
 * el CSP abría `*.googleapis.com`, `*.firebaseio.com`, `*.firebaseapp.com` y
 * sus variantes `wss://`. Al quitar la base de datos, `connect-src` se cierra
 * a lo propio más la telemetría de Vercel — bastante más estrecho, y ya no hay
 * comodines de subdominio de terceros por los que se pueda exfiltrar nada.
 *
 * Si algún día vuelve un backend de formularios, el endpoint concreto se añade
 * aquí. Nunca un comodín.
 */

const scriptSrc = [
  "'self'",
  /**
   * ⚠ 'unsafe-inline' ES INTENCIONAL, Y ES EL PUNTO DÉBIL DE ESTA POLÍTICA.
   *
   * Next.js emite su propio payload de hidratación en un <script> inline, y
   * el grafo JSON-LD también va inline. (El script de arranque de tema que
   * antes justificaba esto ya no existe: el modo oscuro se eliminó.) Las
   * alternativas son:
   *
   *   (a) a per-request nonce, generated in middleware.ts, forwarded on a
   *       request header, read back with `headers()` in the layout and
   *       applied to every inline script. `headers()` opts the route out of
   *       static rendering, so this would turn a fully static, CDN-cached
   *       bilingual site into a dynamically rendered one on every request —
   *       paying real TTFB and Core Web Vitals cost for a hardening step
   *       whose realistic threat here is small: el sitio no tiene cuentas,
   *       ni sesión, ni superficie autenticada, ni base de datos.
   *
   *   (b) 'strict-dynamic' with hashes — Next does not publish stable
   *       hashes for its bootstrap, so this breaks on any Next upgrade.
   *
   * Note that a browser ignores 'unsafe-inline' entirely once a nonce or
   * hash is present, so (a) cannot be introduced halfway: the day nonce
   * plumbing lands, this token must be removed in the same change or the
   * policy silently reverts to permissive.
   *
   * What this CSP still buys with 'unsafe-inline' present: script-src is
   * host-restricted, so an injected `<script src="//evil.tld">` is blocked;
   * object-src/base-uri/form-action close off the classic non-script
   * injection vectors; and connect-src stops exfiltration to an arbitrary
   * origin even if a payload does execute.
   */
  "'unsafe-inline'",
  VERCEL_SCRIPTS,
  // webpack/Turbopack dev use eval-based source maps and HMR. Never shipped.
  ...(isDev ? ["'unsafe-eval'"] : []),
  ...(isPreview ? ['https://vercel.live'] : []),
]

const CSP_DIRECTIVES: Record<string, string[]> = {
  // Everything not named below is same-origin only.
  'default-src': ["'self'"],
  'script-src': scriptSrc,
  // Tailwind's runtime-injected styles and Next's inline <style> for
  // critical CSS both require this. There is no nonce path for style-src
  // that Next supports, and style injection is not a code-execution vector.
  'style-src': ["'self'", "'unsafe-inline'"],
  // next/font self-hosts, so fonts are same-origin. data: covers any inlined
  // face in third-party CSS.
  'font-src': ["'self'", 'data:'],
  // 'self' covers /public and the generated opengraph-image routes; blob:
  // and data: cover canvas/inline SVG. https: is kept so an inline social
  // badge or a future CDN asset cannot blank the page — images are not an
  // execution vector.
  'img-src': ["'self'", 'data:', 'blob:', 'https:'],
  'connect-src': [
    "'self'",
    VERCEL_SCRIPTS,
    VERCEL_VITALS,
    // HMR websocket. `'self'` should already cover ws:// on a matching
    // host/port, but browser behaviour there has been inconsistent enough
    // that it is not worth debugging a broken dev server over. Dev only.
    ...(isDev ? ['ws://localhost:*', 'ws://127.0.0.1:*'] : []),
    ...(isPreview ? ['https://vercel.live', 'wss://*.pusher.com'] : []),
  ],
  'media-src': ["'self'"],
  'manifest-src': ["'self'"],
  // Next can instantiate workers from a blob URL.
  'worker-src': ["'self'", 'blob:'],
  // Nothing on this site embeds a third party. The preview toolbar does.
  'frame-src': isPreview ? ["'self'", 'https://vercel.live'] : ["'self'"],
  // No Flash/Java/applets, ever.
  'object-src': ["'none'"],
  // Stops an injected <base> from re-pointing every relative URL.
  'base-uri': ["'self'"],
  // Ya no hay envío de formularios a ningún servidor. 'self' impide que una
  // inyección apunte un <form> a un host externo.
  'form-action': ["'self'"],
  // The CSP-native equivalent of X-Frame-Options: DENY, which is kept below
  // for older browsers that do not honour frame-ancestors.
  'frame-ancestors': ["'none'"],
}

const CSP = [
  ...Object.entries(CSP_DIRECTIVES).map(
    ([directive, values]) => `${directive} ${values.join(' ')}`,
  ),
  // Valueless directive: rewrites any stray http:// subresource to https://
  // rather than letting it fail as mixed content.
  'upgrade-insecure-requests',
].join('; ')

/**
 * Long-lived caching for the handful of unhashed static files that are
 * requested on nearly every page view.
 *
 * ⚠ These filenames are NOT content-hashed. `immutable` tells the browser
 * never to revalidate for a year, so replacing one of these assets in place
 * will not reach a returning visitor. To change any of them, ship a NEW
 * FILENAME and update the reference (lib/constants.ts SEO_IMAGES for the
 * headshot, app/manifest.ts + app/[locale]/layout.tsx for the icons).
 */
const IMMUTABLE_ASSETS = [
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable-512.png',
  '/apple-touch-icon.png',
  '/carlos-anaya-ruiz.jpg',
]

const nextConfig: NextConfig = {
  // Removes `X-Powered-By: Next.js` — free version disclosure, no benefit.
  poweredByHeader: false,

  /**
   * `next dev` y `next build` comparten `.next` y se pisan: con el server de
   * desarrollo levantado, un build lo tumba o se corrompe.
   *
   * Esto permite darle al build su propio directorio sin apagar nada:
   *
   *   NEXT_DIST_DIR=.next-build npx next build
   *
   * Sin la variable el comportamiento es exactamente el de siempre.
   */
  distDir: process.env.NEXT_DIST_DIR ?? '.next',

  /**
   * Transiciones de ruta con la View Transitions API nativa.
   *
   * Es la pieza que hace que navegar se sienta continuo en vez de un corte
   * seco entre pantallas, y cuesta 0 KB: el runtime ya viaja dentro de React
   * 19, que la app envía de todas formas. La referencia del brief
   * (dennissnellenberg.com) resuelve lo mismo cargando Barba.js, que es una
   * dependencia entera para algo que la plataforma ya trae.
   *
   * La coreografía vive en `app/globals.css`, bajo `::view-transition-*`, y
   * entera dentro de `prefers-reduced-motion: no-preference`.
   */
  experimental: {
    viewTransition: true,
  },

  /**
   * lib/og.tsx reads its fonts from a path built at runtime
   * (`path.join(process.cwd(), 'assets', 'fonts')`). Next's file tracing works
   * by static analysis, so it cannot see that path and will not bundle the
   * files.
   *
   * ⚠ CORRECCIÓN MEDIDA: la versión anterior de esta nota afirmaba que «every
   * OG route is prerendered by generateStaticParams». Es FALSO — ninguna de las
   * 17 lo está. El manifiesto del build las lista en `dynamicRoutes` con
   * `fallback: null`, así que cada tarjeta se genera en su PRIMERA PETICIÓN,
   * en runtime, con el cwd del entorno serverless.
   *
   * O sea que esta declaración no es una red de seguridad para un futuro
   * hipotético: es lo único que hace que las tarjetas sociales funcionen hoy.
   * Quitarla las rompe todas de inmediato.
   */
  outputFileTracingIncludes: {
    '/[locale]/opengraph-image': ['./assets/fonts/**'],
    '/[locale]/**/opengraph-image': ['./assets/fonts/**'],

    /**
     * EL CUERPO DE LOS ARTÍCULOS.
     *
     * Las páginas del blog leen su markdown de `content/blog/*.md` en tiempo
     * de ejecución, y tienen que poder hacerlo: el calendario publica un
     * artículo cada martes y viernes, así que una página que se generó como
     * 404 en el build se regenera por ISR el día que le toca. Sin estos
     * archivos en el bundle de servidor, esa regeneración fallaría al leer el
     * archivo y el artículo no saldría nunca.
     *
     * Es exactamente la misma clase de trampa que las fuentes de arriba, y
     * aquí sí está activa desde el primer día, no en potencia.
     */
    '/[locale]/blog/[slug]': ['./content/blog/**'],
    '/[locale]/blog': ['./content/blog/**'],
    '/feed.xml': ['./content/blog/**'],
    '/api/cron/publicar': ['./content/blog/**'],
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    /**
     * Un año de caché en el navegador y en el CDN.
     *
     * Sin esto, toda respuesta de `/_next/image` salía con
     * `cache-control: public, max-age=0, must-revalidate` y sin `etag`: el
     * navegador no podía reusar una imagen ni un segundo, así que cada visita
     * repetida volvía a descargar el retrato del héroe, la foto en blanco y
     * negro, las 99 portadas del blog y los 8 certificados.
     *
     * Es seguro porque la URL de `/_next/image` lleva el id del despliegue: un
     * deploy nuevo cambia la URL e invalida la caché sola. Nada queda pegado.
     */
    minimumCacheTTL: 31536000,
    /**
     * `remotePatterns` is deliberately absent. It previously allowed
     * { protocol: 'https', hostname: '**' }, which turns /_next/image into
     * an open image proxy: anyone could pass any URL on the internet through
     * this domain's optimizer, consuming the account's transformation quota
     * and laundering third-party content through carlosanayaruiz.com. Every
     * image on this site lives in /public or is generated by an
     * opengraph-image route, so no remote host needs to be allowed at all.
     * If one ever does, add that exact hostname — never a wildcard.
     */
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: CSP },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // Blocks Adobe/Flash cross-domain policy files from being honoured.
          // Legacy, but zero-cost and still flagged by security scanners.
          { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
          /**
           * Severs the window.opener relationship, so a page this site opens
           * (or that opens it) cannot reach into this document. Safe here
           * because nothing uses an OAuth popup — Firebase is Firestore-only.
           * If Firebase Auth popup sign-in is ever added, this must become
           * `same-origin-allow-popups` or the popup callback will hang.
           */
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        ],
      },
      ...IMMUTABLE_ASSETS.map((source) => ({
        source,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      })),
    ]
  },
}

export default withNextIntl(nextConfig)
