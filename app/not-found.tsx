import Link from 'next/link'
import { FONT_VARS } from '@/lib/fonts'
import { isRevisionOpen } from '@/data/revision-ficha'

import './globals.css'

/**
 * 404 de una ruta que ni siquiera entra en `[locale]`.
 *
 * No llama a `headers()`, `cookies()` ni a `getLocale()`: cualquiera de esas
 * APIs, al vivir en esta frontera, se evalúa también cuando Next prepara el
 * árbol de las páginas reales y las vuelve dinámicas. El documento es
 * estático y en español, el idioma por omisión.
 *
 * `/es/…` y `/en/…` que no casan con una página no llegan aquí. Las responde
 * el route handler `app/[locale]/[...rest]/route.ts`, con status 404 y el
 * idioma de la URL, sin meter una API dinámica en el layout.
 */

export default function NotFound() {
  const review = isRevisionOpen()

  return (
    <html lang="es" className={FONT_VARS}>
      <head>
        <title>404 — Página no encontrada | Carlos Anaya Ruiz</title>
        <meta
          name="description"
          content="El enlace está roto o la URL cambió de lugar. Si llegaste desde Google, avísame y la redirijo: una 404 indexada es un error mío, no tuyo."
        />
      </head>
      <body className="min-h-screen bg-ground font-sans text-ink antialiased">
        <main
          id="main-content"
          className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-5 py-20 sm:px-8"
        >
          <p className="stamp">404</p>
          <h1 className="mt-6 max-w-[16ch] text-hero text-ink">
            Esta página no existe
          </h1>
          <p className="mt-10 max-w-[56ch] text-lead text-ink-muted">
            El enlace está roto o la URL cambió de lugar. Si llegaste desde
            Google, avísame y la redirijo: una 404 indexada es un error mío, no
            tuyo.
          </p>
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
          <nav aria-label="Otras páginas" className="mt-6 flex flex-wrap gap-x-8">
            <Link
              href="/es/servicios"
              className="link-stylus inline-flex min-h-11 items-center"
            >
              Servicios
            </Link>
            <Link
              href="/es/blog"
              className="link-stylus inline-flex min-h-11 items-center"
            >
              Blog
            </Link>
            <Link
              href="/es/contacto"
              className="link-stylus inline-flex min-h-11 items-center"
            >
              Contacto
            </Link>
          </nav>
        </main>
      </body>
    </html>
  )
}
