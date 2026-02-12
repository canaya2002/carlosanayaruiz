import { MetadataRoute } from 'next'
import { SITE_CONFIG } from '@/lib/constants'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.url
  const now = new Date()

  // Define all pages with their locale-specific paths
  const pages = [
    { es: '', en: '', priority: 1, changeFrequency: 'weekly' as const },
    { es: '/libros', en: '/books', priority: 0.8, changeFrequency: 'monthly' as const },
    { es: '/sobre-mi', en: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
    { es: '/contacto', en: '/contact', priority: 0.6, changeFrequency: 'yearly' as const },
  ]

  const entries: MetadataRoute.Sitemap = []

  for (const page of pages) {
    // Spanish version
    entries.push({
      url: `${baseUrl}/es${page.es}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: {
        languages: {
          es: `${baseUrl}/es${page.es}`,
          en: `${baseUrl}/en${page.en}`,
        },
      },
    })

    // English version
    entries.push({
      url: `${baseUrl}/en${page.en}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: {
        languages: {
          es: `${baseUrl}/es${page.es}`,
          en: `${baseUrl}/en${page.en}`,
        },
      },
    })
  }

  return entries
}
