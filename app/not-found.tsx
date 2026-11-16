import { headers } from 'next/headers'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Drum, SheetField } from '@/components/instrument/rail'
import { FONT_VARS } from '@/lib/fonts'
import { generateLayoutGraph } from '@/lib/schema'
import type { Locale } from '@/data/types'
import LocaleNotFound from './[locale]/not-found'

import './globals.css'

/**
 * ════════════════════════════════════════════════════════════════
 * 404 DE UNA RUTA QUE NO CASA CON NINGUNA PÁGINA
 *
 * En Next 16.4, `notFound()` lanzado desde una página que SÍ hizo match
 * (el catch-all `app/[locale]/[...rest]`) responde 404 con
 * `<html id="__next_error__">` y un `<body>` vacío: el H1, el header y el
 * pie viajan solo en el payload RSC y se pintan al hidratar
 * (vercel/next.js#100596). Sin JavaScript la pantalla queda en blanco.
 *
 * Una URL que no casa con ningún segmento no pasa por ese throw. Next
 * renderiza ESTE archivo en el HTML de la respuesta, con status 404. Por
 * eso no hay catch-all: `/es/esta-pagina-no-existe` y
 * `/en/this-page-does-not-exist` tienen que llegar aquí.
 *
 * El layout de `[locale]` no envuelve esta frontera —el segmento no
 * llegó a montarse— así que el header, el pie, el riel y la hoja se
 * montan aquí, con un solo idioma. El cuerpo es el mismo componente que
 * atiende los `notFound()` de dentro del segmento.
 *
 * El `<title>` y la description van escritos en el `<head>`. `robots` no:
 * con status 404 Next inyecta un solo `<meta name="robots" content="noindex">`,
 * y un segundo meta lo contradecía. Un `metadata` exportado en esta
 * frontera no es fiable: depende del árbol que no hizo match, y era como
 * el 404 heredaba el título corto y la description del inicio.
 * ════════════════════════════════════════════════════════════════
 */

async function localeFromRequest(): Promise<Locale> {
  const h = await headers()
  const explicit = h.get('x-next-intl-locale')
  if (explicit === 'en' || explicit === 'es') return explicit
  const path = h.get('x-pathname') ?? ''
  return path === '/en' || path.startsWith('/en/') ? 'en' : 'es'
}

const CLIENT_NAMESPACES = [
  'nav',
  'a11y',
  'services',
  'footer',
  'language',
] as const

export default async function NotFound() {
  const locale = await localeFromRequest()
  setRequestLocale(locale)
  const en = locale === 'en'
  const t = await getTranslations('notFound')
  const ta = await getTranslations('a11y')
  const messages = await getMessages()
  const clientMessages = Object.fromEntries(
    CLIENT_NAMESPACES.filter((ns) => ns in messages).map((ns) => [
      ns,
      messages[ns],
    ])
  )
  const title = en
    ? '404 — Page not found | Carlos Anaya Ruiz'
    : '404 — Página no encontrada | Carlos Anaya Ruiz'

  return (
    <html lang={locale} className={FONT_VARS}>
      <head>
        {/* `robots` no se escribe aquí. Con status 404 Next ya inyecta
            `<meta name="robots" content="noindex">`. Un segundo meta
            (`noindex, nofollow`) era el par contradictorio. */}
        <title>{title}</title>
        <meta name="description" content={t('lead')} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateLayoutGraph(locale)),
          }}
        />
      </head>
      <body className="min-h-screen bg-ground font-sans text-ink antialiased">
        <NextIntlClientProvider messages={clientMessages}>
          <a href="#main-content" className="skip-to-content">
            {ta('skipToContent')}
          </a>
          <Drum />
          <SheetField />
          <div className="flex min-h-screen flex-col">
            <Header />
            <main id="main-content" className="flex-1">
              <LocaleNotFound />
            </main>
            <Footer />
          </div>
        </NextIntlClientProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
