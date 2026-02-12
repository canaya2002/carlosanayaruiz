import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SITE_CONFIG, getSiteConfig } from '@/lib/constants'
import { generateLayoutGraph } from '@/lib/schema'
import { routing } from '@/i18n/routing'
import { Locale } from '@/data/types'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-geist-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display-serif',
  display: 'swap',
  weight: ['400', '600', '700'],
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
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
      template: `%s | Carlos Anaya Ruíz`,
    },
    description: config.description,
    keywords: config.keywords,
    authors: [{ name: config.name }],
    creator: config.name,
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '32x32' },
        { url: '/images/icon-192.png', sizes: '192x192', type: 'image/png' },
      ],
      apple: [{ url: '/images/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    },
    manifest: '/manifest.json',
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
      locale: config.locale,
      url: `${SITE_CONFIG.url}/${locale}`,
      title: config.title,
      description: config.description,
      siteName: config.name,
      images: [{ url: `/images/og-${locale}.png`, width: 1200, height: 630, alt: config.title, type: 'image/png' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      images: [`/images/og-${locale}.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large' as const, 'max-snippet': -1 },
    },
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

  if (!routing.locales.includes(locale as 'es' | 'en')) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Person + WebSite JSON-LD @graph */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateLayoutGraph(locale as Locale)),
          }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} min-h-screen font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <a href="#main-content" className="skip-to-content">
            Skip to content
          </a>
          <div className="relative flex min-h-screen flex-col">
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
