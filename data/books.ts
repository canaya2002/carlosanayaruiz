import { Locale } from './types'

export interface Book {
  id: string
  slug: string
  title: string
  subtitle: string
  description: string
  /** Who is this book for? */
  audience: string
  coverImage: string
  /** URL to purchase the book */
  purchaseUrl: string
  /** Price display string */
  price: string
  /** ISO currency code */
  currency: string
  /** Number of pages (approx) */
  pages?: number
  /** Publication date YYYY-MM-DD */
  publishedDate?: string
  /** ISBN if available */
  isbn?: string
  tags: string[]
}

/**
 * ================================================================
 * BOOKS DATA — PLACEHOLDER
 * ================================================================
 * Carlos: Reemplaza/agrega tus libros aquí.
 * Cada libro necesita: título, descripción, imagen de portada,
 * URL de compra y precio. El resto es opcional pero recomendado
 * para SEO (ISBN, fecha de publicación, número de páginas).
 * ================================================================
 */
const booksData: Record<Locale, Book[]> = {
  es: [
    {
      id: 'seo-tecnico-nextjs',
      slug: 'seo-tecnico-nextjs-guia-completa',
      title: 'SEO Técnico con Next.js: Guía Completa',
      subtitle: 'Domina la indexación, el rendimiento y los datos estructurados',
      description: 'Una guía práctica y profunda sobre cómo implementar SEO técnico de alto nivel en aplicaciones Next.js. Cubre desde la configuración de metadatos y sitemaps hasta Schema JSON-LD avanzado, Core Web Vitals, internacionalización con hreflang y estrategias de renderizado (SSR/ISR/SSG) para máxima visibilidad en buscadores.',
      audience: 'Desarrolladores web, ingenieros frontend y consultores SEO que quieren dominar la intersección entre ingeniería de rendimiento y posicionamiento orgánico.',
      coverImage: '/images/books/seo-tecnico-nextjs-cover.png',
      // TODO: Reemplaza con tu URL de compra real cuando esté disponible
      purchaseUrl: 'https://carlosanayaruiz.com/es/libros',
      price: 'TBD',
      currency: 'USD',
      pages: 280,
      // Fecha estimada de publicación — actualizar cuando esté listo
      publishedDate: '2026-09-01',
      tags: ['SEO Técnico', 'Next.js', 'Schema.org', 'Core Web Vitals', 'Rendimiento Web'],
    },
  ],
  en: [
    {
      id: 'seo-tecnico-nextjs',
      slug: 'technical-seo-nextjs-complete-guide',
      title: 'Technical SEO with Next.js: Complete Guide',
      subtitle: 'Master indexation, performance, and structured data',
      description: 'A practical, in-depth guide on implementing high-level technical SEO in Next.js applications. Covers everything from metadata configuration and sitemaps to advanced Schema JSON-LD, Core Web Vitals, internationalization with hreflang, and rendering strategies (SSR/ISR/SSG) for maximum search visibility.',
      audience: 'Web developers, frontend engineers, and SEO consultants who want to master the intersection between performance engineering and organic positioning.',
      coverImage: '/images/books/seo-tecnico-nextjs-cover.png',
      // TODO: Replace with your actual purchase URL when available
      purchaseUrl: 'https://carlosanayaruiz.com/en/books',
      price: 'TBD',
      currency: 'USD',
      pages: 280,
      // Estimated publication date — update when ready
      publishedDate: '2026-09-01',
      tags: ['Technical SEO', 'Next.js', 'Schema.org', 'Core Web Vitals', 'Web Performance'],
    },
  ],
}

export function getBooks(locale: Locale): Book[] {
  return booksData[locale] ?? booksData.es
}

export function getBookBySlug(locale: Locale, slug: string): Book | undefined {
  return getBooks(locale).find((b) => b.slug === slug)
}
