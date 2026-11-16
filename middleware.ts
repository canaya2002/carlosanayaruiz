import { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

/**
 * ════════════════════════════════════════════════════════════════
 * Locale middleware.
 *
 * Signature verified against the installed next-intl (v4.8.x):
 *   createMiddleware(routing: RoutingConfig) => (req: NextRequest) => NextResponse
 * `defineRouting()` in i18n/routing.ts already carries locales,
 * defaultLocale, localePrefix: 'always' and the localised pathnames, so no
 * second options object is needed — and passing one would silently diverge
 * from the routing config the navigation helpers use.
 * ════════════════════════════════════════════════════════════════
 */
const handleI18n = createMiddleware(routing)

export default function middleware(request: NextRequest) {
  const response = handleI18n(request)
  /* El 404 raíz no tiene segmento `[locale]`. next-intl ya deja el idioma
     en la petición; el path es el respaldo para elegir el idioma del
     documento cuando esa cabecera no llega. Solo se añade a la lista de
     override que next-intl ya creó: no se reemplaza. */
  const override = response.headers.get('x-middleware-override-headers')
  if (override && !override.split(',').some((key) => key.trim() === 'x-pathname')) {
    response.headers.set('x-middleware-request-x-pathname', request.nextUrl.pathname)
    response.headers.set('x-middleware-override-headers', `${override},x-pathname`)
  }
  return response
}

export const config = {
  /**
   * The previous matcher was ['/', '/(es|en)/:path*'] — it only ever saw
   * URLs that ALREADY had a locale prefix. An unprefixed request such as
   * /sobre-mi therefore never reached next-intl and 404'd instead of
   * redirecting to /es/sobre-mi. Every inbound link that dropped the prefix
   * (typed URLs, old backlinks, a stray link in a PDF) was a hard 404 and a
   * lost crawl.
   *
   * This matcher inverts the logic: run on everything, then carve out the
   * paths that must never be rewritten.
   *
   * Excluded:
   *   _next      — build output: chunks, CSS, self-hosted fonts, images.
   *                Rewriting these breaks rendering outright.
   *   _vercel    — platform endpoints (Analytics + Speed Insights beacons).
   *   api        — route handlers; a JSON endpoint has no locale.
   *   favicon.ico, icon.svg, robots.txt, sitemap.xml, manifest.webmanifest
   *              — metadata files that must resolve at the ROOT. A locale
   *                redirect here means Google requests /robots.txt, gets a
   *                307 to /es/robots.txt, and treats the site as having no
   *                robots.txt at all. Named literally so the intent is
   *                greppable, even though the dot guard below also covers
   *                them.
   *   .*\..*     — any path containing a dot: every static asset in
   *                /public (*.png, *.jpg, *.svg, *.txt including llms.txt,
   *                *.webmanifest, *.woff2). No real route has a dot.
   *
   * The empty match is allowed, so "/" still hits the middleware and
   * redirects to /es.
   */
  matcher: [
    '/((?!_next|_vercel|api|favicon\\.ico|icon\\.svg|robots\\.txt|sitemap\\.xml|manifest\\.webmanifest|llms\\.txt|.*\\..*).*)',
  ],
}
