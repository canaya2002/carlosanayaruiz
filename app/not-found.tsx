import Link from 'next/link'
import { Archivo, Chivo_Mono, Fraunces } from 'next/font/google'

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

/**
 * Las mismas tres caras que `app/[locale]/layout.tsx`, y por la misma razón:
 * este es el único archivo que renderiza un documento completo por su cuenta,
 * así que si no las declara aquí, la 404 raíz sale en la pila del sistema —
 * un 404 en Segoe UI dentro de un sitio compuesto en otra cosa se lee como
 * una página rota, que es justo lo contrario de lo que tiene que transmitir.
 */
const archivo = Archivo({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-archivo',
  display: 'swap',
  axes: ['wdth'],
  adjustFontFallback: true,
})

const chivoMono = Chivo_Mono({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-chivo-mono',
  display: 'swap',
  weight: ['400', '500'],
  adjustFontFallback: true,
})

const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-fraunces',
  display: 'swap',
  style: ['italic'],
  axes: ['SOFT', 'WONK', 'opsz'],
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
    <html
      lang="es"
      className={`${archivo.variable} ${chivoMono.variable} ${fraunces.variable}`}
    >
      <head>
        <meta name="robots" content="noindex, nofollow" />
        <title>404 — Página no encontrada | Carlos Anaya Ruiz</title>
      </head>
      <body className="min-h-screen bg-ground font-sans text-ink antialiased">
        <div className="relative isolate min-h-screen overflow-hidden">
          <main
            id="main-content"
            className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-5 py-20 sm:px-8"
          >
            <p className="stamp">Error 404</p>

            <h1 className="mt-6 max-w-[16ch] text-hero text-ink">
              Esta página no existe
            </h1>

            {/* El trazo plano: la aguja no encontró nada. Es lo contrario de
                `.trace`, que en el resto del sitio nunca para, y es la misma
                idea que en la 404 localizada. */}
            <div
              className="mt-12 flex items-center gap-4"
              role="img"
              aria-label="Sin señal / No signal"
            >
              <span className="stamp shrink-0">sin señal · no signal</span>
              <span
                className="h-px flex-1 bg-hairline-strong"
                aria-hidden="true"
              />
            </div>

            <div className="mt-10 max-w-[56ch]">
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
              className="mt-10 flex flex-wrap gap-x-8 gap-y-3"
            >
              <Link
                href="/es"
                className="link-stylus inline-flex min-h-[44px] items-center text-sm"
              >
                Ir al inicio
              </Link>
              <Link
                href="/en"
                lang="en"
                className="link-stylus inline-flex min-h-[44px] items-center text-sm"
              >
                Go to homepage
              </Link>
            </nav>

            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-1 text-sm">
              <Link
                href="/es/servicios"
                className="link-stylus inline-flex min-h-[44px] items-center"
              >
                Servicios
              </Link>
              <Link
                href="/es/contacto"
                className="link-stylus inline-flex min-h-[44px] items-center"
              >
                Contacto
              </Link>
              <Link
                href="/en/contact"
                lang="en"
                className="link-stylus inline-flex min-h-[44px] items-center"
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
