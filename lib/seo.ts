import { Metadata } from 'next'
import {
  SITE_CONFIG,
  getSiteConfig,
  ROUTES,
  type RouteKey,
} from './constants'
import { Locale } from '@/data/types'

interface SEOProps {
  /** Page title without the brand suffix — the template appends it. */
  title?: string
  /**
   * Unique, specific description. Google frequently rewrites snippets from
   * page content, so this is a proposal rather than a guarantee; it still
   * matters for social cards and for AI crawlers extracting a summary.
   */
  description?: string
  /**
   * Route key from the ROUTES table. Drives canonical + hreflang so a
   * renamed slug updates every reference at once.
   */
  route: RouteKey
  type?: 'website' | 'article' | 'profile'
  publishedTime?: string
  modifiedTime?: string
  noIndex?: boolean
  locale: Locale
  /** Use the title verbatim, without the "| Carlos Anaya Ruiz" suffix. */
  absoluteTitle?: boolean
}

/**
 * Builds page metadata.
 *
 * Two things this deliberately does NOT emit:
 *
 *  - `keywords`. The meta keywords tag has been ignored by Google for two
 *    decades; shipping it is noise, not optimisation.
 *  - `openGraph.images`. Next merges the generated `opengraph-image` route
 *    automatically, so hard-coding a URL here is how the declared-size /
 *    real-size mismatch happened in the first place.
 */
export function generatePageMetadata({
  title,
  description,
  route,
  type = 'website',
  publishedTime,
  modifiedTime,
  noIndex = false,
  locale,
  absoluteTitle = false,
}: SEOProps): Metadata {
  const config = getSiteConfig(locale)

  const metaTitle = title || config.title
  const metaDescription = description || config.description

  const paths = ROUTES[route]
  const canonical = `${SITE_CONFIG.url}/${locale}${paths[locale]}`

  return {
    title: absoluteTitle ? { absolute: metaTitle } : metaTitle,
    description: metaDescription,
    authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.url }],
    creator: SITE_CONFIG.name,
    publisher: SITE_CONFIG.name,
    robots: noIndex
      ? { index: false, follow: false }
      : {
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
    alternates: {
      canonical,
      // Reciprocal and self-referencing, both required for hreflang to be
      // honoured. x-default points at Spanish: the practice is Mexico-based
      // and Spanish is the primary market.
      languages: {
        'es-MX': `${SITE_CONFIG.url}/es${paths.es}`,
        'en-US': `${SITE_CONFIG.url}/en${paths.en}`,
        'x-default': `${SITE_CONFIG.url}/es${paths.es}`,
      },
    },
    openGraph: {
      type: type === 'article' ? 'article' : 'website',
      locale: config.ogLocale,
      alternateLocale: locale === 'es' ? 'en_US' : 'es_MX',
      url: canonical,
      title: metaTitle,
      description: metaDescription,
      siteName: SITE_CONFIG.name,
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: [SITE_CONFIG.name],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
    },
  }
}
