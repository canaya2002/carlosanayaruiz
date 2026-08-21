import type { Metadata, Viewport } from 'next'
import { Archivo, IBM_Plex_Mono, Newsreader } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import {
  SITE_CONFIG,
  getSiteConfig,
  SEARCH_VERIFICATION,
  PALETTE_HEX,
} from '@/lib/constants'
import { generateLayoutGraph } from '@/lib/schema'
import { routing } from '@/i18n/routing'
import { Locale } from '@/data/types'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'

/**
 * Tres caras, tres roles — el sistema «Papel Ahumado».
 *
 * ⚠ SUSTITUTOS. Las caras reales del sistema son GT Pressura y GT Pressura
 * Mono (Grilli Type) y Arlt (PampaType), las tres comerciales y todavía no
 * licenciadas. Estas tres son gratuitas y sostienen los mismos roles
 * mientras llegan.
 *
 * El sitio NO nombra ninguna de estas variables directamente: todo apunta a
 * `--face-display`, `--face-mono` y `--face-human` en globals.css. Cambiar de
 * cara es editar esas tres líneas, no tocar componentes.
 *
 * `latin-ext` es obligatorio: el copy en español usa á é í ó ú ñ ¿ ¡.
 */
const archivo = Archivo({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-archivo',
  display: 'swap',
  axes: ['wdth'],
  adjustFontFallback: true,
})

/** La voz de la máquina: toda cifra, unidad, graduación y etiqueta. */
const plexMono = IBM_Plex_Mono({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-plex-mono',
  display: 'swap',
  weight: ['400', '500'],
  adjustFontFallback: true,
})

/**
 * La voz humana, y solo eso: frases en primera persona. Nunca navegación,
 * nunca datos, nunca un titular. Alrededor del 3% del tipo del sitio — la
 * oposición es el concepto, así que si crece deja de significar.
 */
const newsreader = Newsreader({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-newsreader',
  display: 'swap',
  style: ['normal', 'italic'],
  adjustFontFallback: true,
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Nunca bloquear el zoom (WCAG 1.4.4).
  maximumScale: 5,
  /**
   * Un solo valor: el sitio tiene un solo tema. Antes había dos entradas con
   * `prefers-color-scheme` y eso era justamente el problema — quien tuviera
   * el sistema en oscuro recibía una versión casi negra.
   */
  themeColor: PALETTE_HEX.light.ground,
  colorScheme: 'dark',
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const config = getSiteConfig(locale as Locale)

  return {
    metadataBase: new URL(SITE_CONFIG.url),
    title: {
      default: config.title,
      template: '%s | Carlos Anaya Ruiz',
    },
    description: config.description,
    applicationName: SITE_CONFIG.name,
    authors: [{ name: config.name, url: SITE_CONFIG.url }],
    creator: config.name,
    publisher: config.name,
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '32x32' },
        { url: '/icon.svg', type: 'image/svg+xml' },
      ],
      apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    },
    manifest: '/manifest.webmanifest',
    // Evita que iOS Safari convierta números en enlaces con su propio estilo;
    // los tel: los marcamos nosotros a propósito.
    formatDetection: { telephone: false, address: false, email: false },
    appleWebApp: {
      capable: true,
      title: SITE_CONFIG.name,
      statusBarStyle: 'default',
    },
    alternates: {
      canonical: `${SITE_CONFIG.url}/${locale}`,
      languages: {
        'es-MX': `${SITE_CONFIG.url}/es`,
        'en-US': `${SITE_CONFIG.url}/en`,
        'x-default': `${SITE_CONFIG.url}/es`,
      },
    },
    openGraph: {
      type: 'website',
      locale: config.ogLocale,
      alternateLocale: locale === 'en' ? 'es_MX' : 'en_US',
      url: `${SITE_CONFIG.url}/${locale}`,
      title: config.title,
      description: config.description,
      siteName: config.name,
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    ...(SEARCH_VERIFICATION.google || SEARCH_VERIFICATION.bing
      ? {
          verification: {
            ...(SEARCH_VERIFICATION.google && {
              google: SEARCH_VERIFICATION.google,
            }),
            ...(SEARCH_VERIFICATION.bing && {
              other: { 'msvalidate.01': SEARCH_VERIFICATION.bing },
            }),
          },
        }
      : {}),
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as Locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()
  const t = await getTranslations({ locale, namespace: 'a11y' })

  return (
    /**
     * Ya no hay `suppressHydrationWarning` ni script de arranque de tema: no
     * hay nada que mutar antes del primer pintado, porque no hay tema que
     * resolver. Un archivo menos que ejecutar antes de pintar.
     */
    <html
      lang={locale}
      className={`${archivo.variable} ${plexMono.variable} ${newsreader.variable}`}
    >
      <head>
        {/* Person + ProfessionalService + WebSite. Los hechos de la entidad
            viven aquí para que cada URL los lleve. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateLayoutGraph(locale as Locale)),
          }}
        />
      </head>
      <body className="min-h-screen bg-ground font-sans text-ink antialiased">
        <NextIntlClientProvider messages={messages}>
          <a href="#main-content" className="skip-to-content">
            {t('skipToContent')}
          </a>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main id="main-content" className="flex-1">
              {children}
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
