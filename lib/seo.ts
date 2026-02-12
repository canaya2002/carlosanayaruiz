import { Metadata } from 'next'
import { SITE_CONFIG, getSiteConfig } from './constants'
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

  // Title always starts with "Carlos Anaya Ruíz"
  const metaTitle = title
    ? `Carlos Anaya Ruíz | ${title}`
    : config.title
  const metaDescription = description || config.description
  const metaImage = image || config.ogImage
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
      : { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large' as const, 'max-snippet': -1 } },
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
      locale: config.locale,
      alternateLocale: alternateLocale === 'es' ? 'es_MX' : 'en_US',
      url: metaUrl,
      title: metaTitle,
      description: metaDescription,
      siteName: config.name,
      images: [{ url: metaImage, width: 1200, height: 630, alt: metaTitle }],
      ...(type === 'article' && { publishedTime, modifiedTime, authors: [author || config.name] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
    },
  }
}
