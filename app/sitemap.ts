import { MetadataRoute } from 'next'
import { SITE_CONFIG } from '@/lib/constants'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.url
  const now = new Date()

  const pages = [
    // Core brand pages
    { es: '', en: '', priority: 1, changeFrequency: 'weekly' as const },
    { es: '/sobre-mi', en: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
    { es: '/contacto', en: '/contact', priority: 0.7, changeFrequency: 'monthly' as const },
    { es: '/libros', en: '/books', priority: 0.6, changeFrequency: 'monthly' as const },
    // Service money pages — highest priority after home
    { es: '/seo-tecnico', en: '/technical-seo', priority: 0.9, changeFrequency: 'monthly' as const },
    { es: '/desarrollo-web', en: '/web-development', priority: 0.9, changeFrequency: 'monthly' as const },
    { es: '/automatizacion-ia', en: '/ai-automation', priority: 0.8, changeFrequency: 'monthly' as const },
    { es: '/dashboards', en: '/dashboards', priority: 0.8, changeFrequency: 'monthly' as const },
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
          'es-MX': `${baseUrl}/es${page.es}`,
          'en-US': `${baseUrl}/en${page.en}`,
          'x-default': `${baseUrl}/es${page.es}`,
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
          'es-MX': `${baseUrl}/es${page.es}`,
          'en-US': `${baseUrl}/en${page.en}`,
          'x-default': `${baseUrl}/es${page.es}`,
        },
      },
    })
  }

  return entries
}
