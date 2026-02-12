import { Metadata } from 'next'
import { SITE_CONFIG, getSiteConfig, SEO_IMAGES } from './constants'
import { Locale } from '@/data/types'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  path?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  noIndex?: boolean
  locale: Locale
}

/**
 * Generate Next.js Metadata for any page.
 * - Title ALWAYS starts with "Carlos Anaya Ruíz | ..."
 * - Description ALWAYS starts with "Carlos Anaya Ruíz — ..."
 * - OG images use locale-specific variants from public/
 */
export function generatePageMetadata({
  title,
  description,
  keywords,
  image,
  path = '',
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  noIndex = false,
  locale,
}: SEOProps): Metadata {
  const config = getSiteConfig(locale)

  const metaTitle = title
    ? `Carlos Anaya Ruíz | ${title}`
    : config.title
  const metaDescription = description || config.description
  // OG image: prefer locale-specific, fallback to provided, then default
  const ogImage = image || (locale === 'en' ? SEO_IMAGES.ogEn : SEO_IMAGES.ogEs)
  const metaUrl = `${config.url}/${locale}${path}`
  const configKeywords = Array.isArray(config.keywords) ? config.keywords : []
  const metaKeywords = keywords ? [...configKeywords, ...keywords] : configKeywords

  const alternateLocale = locale === 'es' ? 'en' : 'es'

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    authors: [{ name: author || config.name }],
    creator: config.name,
    publisher: config.name,
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large' as const,
            'max-snippet': -1,
          },
        },
    alternates: {
      canonical: metaUrl,
      languages: {
        'es-MX': `${config.url}/es${path}`,
        'en-US': `${config.url}/en${path}`,
        'x-default': `${config.url}/es${path}`,
      },
    },
    openGraph: {
      type: type === 'article' ? 'article' : 'website',
      locale: config.ogLocale,
      alternateLocale: alternateLocale === 'es' ? 'es_MX' : 'en_US',
      url: metaUrl,
      title: metaTitle,
      description: metaDescription,
      siteName: config.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `Carlos Anaya Ruíz — ${title || (locale === 'en' ? 'Technical SEO & Next.js' : 'SEO Técnico & Next.js')}`,
          type: 'image/png',
        },
      ],
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: [author || config.name],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [ogImage],
    },
  }
}
