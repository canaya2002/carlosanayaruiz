import Link from 'next/link'
import { Sora, Plus_Jakarta_Sans } from 'next/font/google'

// Importado por precaución: app/layout.tsx ya trae globals.css, pero este es
// el único archivo que renderiza un documento completo por su cuenta, y un 404
// sin estilos sería el modo de fallo si eso cambiara.
import './globals.css'

/**
 * ════════════════════════════════════════════════════════════════
 * 404 RAÍZ
 *
 * Se alcanza solo con rutas que nunca resuelven a un segmento de idioma: un
 * slug inventado, un enlace viejo, un escaneo. Todo lo que cae bajo /es o /en
 * lo atiende app/[locale]/not-found.tsx, que sí tiene contexto de i18n.
 *
 * Dos restricciones estructurales:
 *
 *  1. app/layout.tsx devuelve `children` tal cual, así que ningún ancestro
 *     renderiza <html> ni <body>. Este archivo tiene que hacerlo, o React
 *     emite un fragmento sin atributo lang y sin clase en <body>.
 *
 *  2. Sin next-intl. Aquí no hay idioma resuelto, así que `useTranslations` y
 *     el `Link` localizado de `@/i18n/navigation` lanzarían excepción. El copy
 *     es bilingüe en línea, con `lang` marcado en el bloque en inglés para que
 *     un lector de pantalla cambie de voz, y los enlaces son `next/link`
 *     normales con los dos prefijos escritos completos.
 *
 * Ya no hay script de arranque de tema. Este archivo tenía una copia del que
 * vivía en el layout, y como Next inyecta el markup de esta frontera en el
 * payload de todas las páginas, ese script seguía llegando al navegador en
 * cada URL del sitio incluso después de eliminar el modo oscuro del layout.
 * ════════════════════════════════════════════════════════════════
 */

const sora = Sora({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sora',
  display: 'swap',
  adjustFontFallback: true,
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-jakarta',
  display: 'swap',
  adjustFontFallback: true,
})

/**
 * `noindex` va como <meta> literal en el markup y no como objeto `metadata`
 * exportado: la resolución de metadata para la frontera 404 raíz depende del
 * árbol de segmentos que no hizo match, y un soft-404 indexable es un pasivo
 * real de posicionamiento. Una etiqueta escrita en el HTML no depende de nada.
 * El código de estado 404 sigue siendo la señal principal.
 */
export default function NotFound() {
  return (
    <html lang="es" className={`${sora.variable} ${jakarta.variable}`}>
      <head>
        <meta name="robots" content="noindex, nofollow" />
        <title>404 — Página no encontrada | Carlos Anaya Ruiz</title>
      </head>
      <body className="min-h-screen bg-ground font-sans text-ink antialiased">
        <div className="relative isolate min-h-screen overflow-hidden">
          <div className="mesh" aria-hidden="true" />

          <main
            id="main-content"
            className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-5 py-20 sm:px-8"
          >
            <p className="eyebrow enter-scale">Error 404</p>

            <h1 className="enter-blur step-1 mt-6 text-d1">
              Esta página <span className="grad-text">no existe</span>
            </h1>

            <div className="enter step-2 mt-7 max-w-[62ch]">
              <p className="text-lead text-ink-muted">
                La dirección que abriste no corresponde a ninguna página de este
                sitio. Puede que el enlace esté mal escrito, o que la página
                haya cambiado de ruta.
              </p>
              <p lang="en" className="mt-4 text-base text-ink-subtle">
                This page doesn’t exist. The link may be mistyped, or the page
                may have moved.
              </p>
            </div>

            <nav
              aria-label="Enlaces principales / Primary links"
              className="enter step-3 mt-10 flex flex-wrap gap-3"
            >
              <Link
                href="/es"
                className="grad-fill sheen inline-flex min-h-[44px] items-center rounded-lg px-5 py-3 text-sm font-semibold shadow-glow-brand transition-opacity hover:opacity-95"
              >
                Ir al inicio
              </Link>
              <Link
                href="/en"
                lang="en"
                className="inline-flex min-h-[44px] items-center rounded-lg border border-control bg-surface px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-ground-tint"
              >
                Go to homepage
              </Link>
            </nav>

            <div className="enter step-4 mt-8 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
              <Link
                href="/es/servicios"
                className="inline-flex min-h-[44px] items-center font-medium text-brand-strong underline underline-offset-4"
              >
                Servicios
              </Link>
              <Link
                href="/es/contacto"
                className="inline-flex min-h-[44px] items-center font-medium text-brand-strong underline underline-offset-4"
              >
                Contacto
              </Link>
              <Link
                href="/en/contact"
                lang="en"
                className="inline-flex min-h-[44px] items-center font-medium text-brand-strong underline underline-offset-4"
              >
                Contact
              </Link>
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}
