import Link from 'next/link'
import { FONT_VARS } from '@/lib/fonts'
import { isRevisionOpen } from '@/data/revision-ficha'

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
 *     va solo en español —el idioma por omisión del sitio— y los enlaces son
 *     `next/link` normales con el prefijo /es escrito completo. Antes era
 *     bilingüe en la misma vista y se leía roto en los dos idiomas.
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

/**
 * `noindex` va como <meta> literal en el markup y no como objeto `metadata`
 * exportado: la resolución de metadata para la frontera 404 raíz depende del
 * árbol de segmentos que no hizo match, y un soft-404 indexable es un pasivo
 * real de posicionamiento. Una etiqueta escrita en el HTML no depende de nada.
 * El código de estado 404 sigue siendo la señal principal.
 */
export default function NotFound() {
  // Nunca un botón hacia una oferta vencida: cerrada la revisión, el inicio
  // sube a primario.
  const review = isRevisionOpen()

  return (
    <html
      lang="es"
      className={FONT_VARS}
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
                `.drum-trace`, que en el resto del sitio nunca para, y es la
                misma idea que en la 404 localizada. */}
            <div
              className="mt-12 flex items-center gap-4"
              role="img"
              aria-label="Sin señal"
            >
              <span className="stamp shrink-0">sin señal</span>
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
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              {review ? (
                <Link className="btn-primary" href="/es/revision-ficha-google">
                  Pide tu revisión gratis
                  <span className="btn-arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              ) : null}
              <Link
                className={review ? 'btn-secondary' : 'btn-primary'}
                href="/es"
              >
                Ir al inicio
              </Link>
            </div>

            <nav
              aria-label="Otras páginas"
              className="mt-6 flex flex-wrap gap-x-8"
            >
              <Link
                href="/es/servicios"
                className="link-stylus inline-flex min-h-[44px] items-center"
              >
                Servicios
              </Link>
              <Link
                href="/es/blog"
                className="link-stylus inline-flex min-h-[44px] items-center"
              >
                Blog
              </Link>
              <Link
                href="/es/contacto"
                className="link-stylus inline-flex min-h-[44px] items-center"
              >
                Contacto
              </Link>
            </nav>
          </main>
        </div>
      </body>
    </html>
  )
}
