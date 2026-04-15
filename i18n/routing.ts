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
    '/seo-tecnico': {
      es: '/seo-tecnico',
      en: '/technical-seo',
    },
    '/desarrollo-web': {
      es: '/desarrollo-web',
      en: '/web-development',
    },
    '/automatizacion-ia': {
      es: '/automatizacion-ia',
      en: '/ai-automation',
    },
    '/dashboards': {
      es: '/dashboards',
      en: '/dashboards',
    },
  },
})

export type Locale = (typeof routing.locales)[number]
export type Pathnames = keyof typeof routing.pathnames
