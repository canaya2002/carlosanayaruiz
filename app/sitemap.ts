import type { MetadataRoute } from 'next'
import { ROUTES, SITE_CONFIG, type RouteKey } from '@/lib/constants'
import type { Locale } from '@/data/types'

/**
 * ════════════════════════════════════════════════════════════════
 * /sitemap.xml
 *
 * ── On lastmod ──────────────────────────────────────────────────
 * The previous version stamped `new Date()` on every entry, so every URL
 * claimed to have changed at the moment of every deploy. Google treats
 * lastmod as a hint it can verify against the content it already has; a
 * sitemap that says "everything changed" on a deploy that changed nothing
 * teaches the crawler to ignore the field entirely, which is strictly
 * worse than omitting it.
 *
 * Deriving the real value would mean reading git commit times for the file
 * that owns each route. That cannot be done cleanly here: this module is
 * evaluated inside the Next build, `child_process` is not available in every
 * build target, and Vercel's default shallow clone does not carry the full
 * history the timestamps would come from. Rather than fake precision, one
 * honest constant is declared below.
 *
 *   ⚠ BUMP `CONTENT_UPDATED` WHEN PAGE COPY ACTUALLY CHANGES.
 *     Not on refactors, not on dependency bumps, not on style tweaks.
 *     Content only. A stale-but-true date costs nothing; a fresh-but-false
 *     one costs the credibility of the signal.
 *
 * ── On priority / changeFrequency ───────────────────────────────
 * Google has stated it ignores both. They are kept because Bing and several
 * AI retrieval crawlers still read them, and because they document the
 * owner's own view of the hierarchy. They are relative ordering, not
 * measurements — do not read precision into the second decimal place.
 *
 * ── On the URL list ─────────────────────────────────────────────
 * Built from the ROUTES table in lib/constants.ts. `Record<RouteKey, …>`
 * below is load-bearing: adding a route to ROUTES without giving it sitemap
 * metadata is a TypeScript error, so a new page cannot silently ship
 * unlisted.
 * ════════════════════════════════════════════════════════════════
 */

/** W3C date. See the warning above before touching this. */
const CONTENT_UPDATED = '2026-08-19'

type ChangeFrequency = NonNullable<
  MetadataRoute.Sitemap[number]['changeFrequency']
>

interface SitemapMeta {
  changeFrequency: ChangeFrequency
  priority: number
}

/**
 * Exhaustive by construction — every key of ROUTES must appear.
 *
 * Hierarchy: home, then the four service pages that carry commercial
 * intent, then the hub that routes to them, then trust pages, then legal.
 */
const PAGE_META: Record<RouteKey, SitemapMeta> = {
  home: { changeFrequency: 'weekly', priority: 1.0 },

  // Service pages — the pages a qualified visitor is meant to land on.
  seoTecnico: { changeFrequency: 'monthly', priority: 0.9 },
  desarrolloWeb: { changeFrequency: 'monthly', priority: 0.9 },
  automatizacionIa: { changeFrequency: 'monthly', priority: 0.9 },
  dashboards: { changeFrequency: 'monthly', priority: 0.9 },

  // Hub: distributes authority to the four above.
  services: { changeFrequency: 'monthly', priority: 0.8 },

  // Entity / conversion.
  sobreMi: { changeFrequency: 'monthly', priority: 0.7 },
  contacto: { changeFrequency: 'yearly', priority: 0.7 },
  libros: { changeFrequency: 'monthly', priority: 0.6 },
  proyectos: { changeFrequency: 'monthly', priority: 0.9 },
  premios: { changeFrequency: 'yearly', priority: 0.6 },
  certificaciones: { changeFrequency: 'yearly', priority: 0.6 },
  cv: { changeFrequency: 'monthly', priority: 0.7 },

  // Legal. Indexable (they are part of a trustworthy business footprint)
  // but they should never outrank anything.
  privacidad: { changeFrequency: 'yearly', priority: 0.3 },
  terminos: { changeFrequency: 'yearly', priority: 0.3 },
}

/** Absolute URL for a route in a locale, e.g. https://…/en/technical-seo */
function url(key: RouteKey, locale: Locale): string {
  return `${SITE_CONFIG.url}/${locale}${ROUTES[key][locale]}`
}

/**
 * hreflang cluster for a route. Every URL in the cluster lists every
 * variant *including itself* — a reciprocal, self-referencing set is what
 * Google requires to treat the pages as alternates rather than duplicates.
 * x-default points at Spanish: it is the primary locale.
 */
function alternates(key: RouteKey) {
  return {
    languages: {
      'es-MX': url(key, 'es'),
      'en-US': url(key, 'en'),
      'x-default': url(key, 'es'),
    },
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Iterating ROUTES (not PAGE_META) keeps the emitted order tied to the
  // declaration order in the single source of truth.
  const keys = Object.keys(ROUTES) as RouteKey[]

  return keys.flatMap((key) =>
    SITE_CONFIG.locales.map((locale) => ({
      url: url(key, locale),
      lastModified: CONTENT_UPDATED,
      changeFrequency: PAGE_META[key].changeFrequency,
      priority: PAGE_META[key].priority,
      alternates: alternates(key),
    })),
  )
}
