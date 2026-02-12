import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

const messageImports = {
  es: () => import('../messages/es.json'),
  en: () => import('../messages/en.json'),
} as const

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !routing.locales.includes(locale as 'es' | 'en')) {
    locale = routing.defaultLocale
  }

  const messages = (await messageImports[locale as 'es' | 'en']()).default

  return { locale, messages }
})
