import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { routing } from './routing'

const messageImports = {
  es: () => import('../messages/es.json'),
  en: () => import('../messages/en.json'),
} as const

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale

  return {
    locale,
    messages: (await messageImports[locale]()).default,
    /**
     * Pinning the timezone keeps server and client date formatting identical.
     * Without it next-intl falls back to the runtime's zone, which is UTC on
     * Vercel and the visitor's zone in the browser — a hydration mismatch that
     * only shows up on dates near midnight.
     */
    timeZone: 'America/Mexico_City',
  }
})
