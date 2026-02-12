import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localePrefix: 'always',
  pathnames: {
    '/': '/',
    '/libros': {
      es: '/libros',
      en: '/books',
    },
    '/sobre-mi': {
      es: '/sobre-mi',
      en: '/about',
    },
    '/contacto': {
      es: '/contacto',
      en: '/contact',
    },
  },
})

export type Locale = (typeof routing.locales)[number]
export type Pathnames = keyof typeof routing.pathnames
