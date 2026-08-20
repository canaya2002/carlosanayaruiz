/**
 * ════════════════════════════════════════════════════════════════
 * SHARED DATA-LAYER SHAPES
 *
 * Anything used by more than one `data/*.ts` file lives here, so a
 * shape is declared once and every file agrees on it. Domain-specific
 * interfaces (Service, Book, Award…) stay in their own file.
 *
 * Rule of thumb for this layer: if a field can only hold a handful of
 * values, it gets a union — not `string`. A loose `string` is how a
 * slug drifts away from a route.
 * ════════════════════════════════════════════════════════════════
 */

export type Locale = 'es' | 'en'

/**
 * Every data file is a per-locale record with the same shape in both
 * languages. Naming it prevents the `Record<Locale, X[]>` spelling from
 * diverging file to file.
 */
export type Localized<T> = Record<Locale, T>

/**
 * Read a localized record, falling back to Spanish (the x-default locale).
 * The fallback is not dead code: `locale` usually arrives from a route
 * param that was cast, so an unexpected value must not crash a page.
 */
export function forLocale<T>(data: Localized<T>, locale: Locale): T {
  return data[locale] ?? data.es
}

/**
 * Question/answer pair. Rendered in the on-page accordion AND emitted as
 * FAQPage JSON-LD, which is exactly why it is one shape: the visible text
 * and the structured data can never disagree.
 */
export interface FaqItem {
  question: string
  answer: string
}

/** One ordered step of a delivery process. Order is the array order. */
export interface ProcessStep {
  title: string
  description: string
}

/** `YYYY` — used for academic years, where a month would be invented precision. */
export type Year = `${number}`

/** `YYYY-MM` — the precision a CV actually supports. */
export type YearMonth = `${number}-${number}`

/** `YYYY-MM-DD` — full calendar date, for anything that becomes a schema date. */
export type IsoDate = `${number}-${number}-${number}`

/** CEFR band. Anything else is not a language level. */
export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

/**
 * Meter value (0–100) for a CEFR band. Single source, so the progress bar
 * on the about page can never contradict the level printed next to it.
 */
const CEFR_PROFICIENCY: Record<CefrLevel, number> = {
  A1: 10,
  A2: 25,
  B1: 45,
  B2: 65,
  C1: 90,
  C2: 100,
}

export function cefrProficiency(level: CefrLevel): number {
  return CEFR_PROFICIENCY[level]
}
