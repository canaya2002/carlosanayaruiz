import { forLocale, type IsoDate, type Localized, type Locale, type Year } from './types'

/**
 * ════════════════════════════════════════════════════════════════
 * BOOKS
 *
 * Everything in here is currently UNPUBLISHED. `status` exists so that
 * fact is part of the type rather than a convention: an `in-progress`
 * title structurally cannot carry a price, a purchase URL, an ISBN, or a
 * publication date, so no page can render a Buy button — or emit Book/Offer
 * JSON-LD — for something that does not exist yet.
 *
 * ── CARLOS: what to fill in ─────────────────────────────────────
 * While the book is still `in-progress`:
 *   · Only `title`, `subtitle`, `description`, `audience`, and `tags` are
 *     shown. Edit those freely.
 *   · `expectedRelease` is intentionally EMPTY. Set it only when you are
 *     willing to commit publicly to that year — a missed date on the page
 *     is worse than no date.
 *   · `pages` is also empty. The previous placeholder said 280 pages for a
 *     book that is not written; put a real number here when you know it.
 *   · `coverImage` is empty because `/public/images/books/` does not exist.
 *     Add the file first, then reference it.
 *
 * When the book actually ships, flip `status` to `'available'`. TypeScript
 * will then REQUIRE `purchaseUrl`, `price`, `currency`, and `publishedDate`,
 * and will accept an optional real `isbn`. Do not invent any of them to make
 * the compiler happy — if you do not have them yet, it is not available yet.
 * ════════════════════════════════════════════════════════════════
 */

export type BookId = 'seo-tecnico-nextjs'

/** Publication state. Drives what the page is allowed to render. */
export type BookStatus = 'available' | 'in-progress'

interface BookBase {
  id: BookId
  /**
   * Content slug for a future `/libros/[slug]` detail route.
   *
   * Unlike a service, a book has no entry in the ROUTES table, so this is a
   * legitimate free-text identifier. If a detail route is ever added, the
   * route segment must be built from this value — never retyped elsewhere.
   */
  slug: string
  title: string
  subtitle: string
  description: string
  /** Who the book is for. */
  audience: string
  /** Approximate page count. Omit entirely rather than guessing. */
  pages?: number
  /** Cover art path under `/public`. Omit until the file exists. */
  coverImage?: string
  tags: string[]
}

/** A book that can actually be bought. Commerce fields are required here. */
export interface AvailableBook extends BookBase {
  status: 'available'
  /** Real storefront URL. */
  purchaseUrl: string
  /** Display price, e.g. `$29`. */
  price: string
  /** ISO 4217, e.g. `USD`. */
  currency: string
  publishedDate: IsoDate
  isbn?: string
}

/** A book being written. No commerce fields exist on this variant, by design. */
export interface InProgressBook extends BookBase {
  status: 'in-progress'
  /** Year the author is publicly committing to, if any. */
  expectedRelease?: Year
}

export type Book = AvailableBook | InProgressBook

/** Narrowing helper, so a page can only reach commerce fields after checking. */
export function isAvailable(book: Book): book is AvailableBook {
  return book.status === 'available'
}

const booksData: Localized<Book[]> = {
  es: [
    {
      id: 'seo-tecnico-nextjs',
      status: 'in-progress',
      slug: 'seo-tecnico-nextjs-guia-completa',
      title: 'SEO Técnico con Next.js: Guía Completa',
      subtitle: 'Domina la indexación, el rendimiento y los datos estructurados',
      description: 'Una guía práctica y profunda sobre cómo implementar SEO técnico de alto nivel en aplicaciones Next.js. Cubre desde la configuración de metadatos y sitemaps hasta Schema JSON-LD avanzado, Core Web Vitals, internacionalización con hreflang y estrategias de renderizado (SSR/ISR/SSG) para máxima visibilidad en buscadores.',
      audience: 'Desarrolladores web, ingenieros frontend y consultores SEO que quieren dominar la intersección entre ingeniería de rendimiento y posicionamiento orgánico.',
      tags: ['SEO Técnico', 'Next.js', 'Schema.org', 'Core Web Vitals', 'Rendimiento Web'],
    },
  ],
  en: [
    {
      id: 'seo-tecnico-nextjs',
      status: 'in-progress',
      slug: 'technical-seo-nextjs-complete-guide',
      title: 'Technical SEO with Next.js: Complete Guide',
      subtitle: 'Master indexation, performance, and structured data',
      description: 'A practical, in-depth guide on implementing high-level technical SEO in Next.js applications. Covers everything from metadata configuration and sitemaps to advanced Schema JSON-LD, Core Web Vitals, internationalization with hreflang, and rendering strategies (SSR/ISR/SSG) for maximum search visibility.',
      audience: 'Web developers, frontend engineers, and SEO consultants who want to master the intersection between performance engineering and organic positioning.',
      tags: ['Technical SEO', 'Next.js', 'Schema.org', 'Core Web Vitals', 'Web Performance'],
    },
  ],
}

export function getBooks(locale: Locale): Book[] {
  return forLocale(booksData, locale)
}

export function getBookBySlug(locale: Locale, slug: string): Book | undefined {
  return getBooks(locale).find((b) => b.slug === slug)
}

/** Books that can be bought right now. Empty until a title actually ships. */
export function getAvailableBooks(locale: Locale): AvailableBook[] {
  return getBooks(locale).filter(isAvailable)
}
