import { Locale } from '@/data/types'

export const SITE_CONFIG = {
  name: 'Carlos Anaya Ruíz',
  url: 'https://carlosanayaweb.com',
  ogImage: '/images/og-default.png',
  locales: ['es', 'en'] as const,
  defaultLocale: 'es' as const,
} as const

export function getSiteConfig(locale: Locale) {
  const configs: Record<
    Locale,
    { title: string; description: string; locale: string; keywords: string[] }
  > = {
    es: {
      title: 'Carlos Anaya Ruíz | Consultor SEO Técnico, Next.js y Growth Digital',
      description:
        'Carlos Anaya Ruíz — Consultor SEO técnico e ingeniero full-stack. Desarrollo aplicaciones web con Next.js y Firebase, automatización con IA y dashboards de alto rendimiento. +4 años de experiencia, PMP certificado.',
      locale: 'es_MX',
      keywords: [
        'Carlos Anaya Ruíz',
        'SEO técnico',
        'consultor SEO',
        'Next.js',
        'Firebase',
        'desarrollo web',
        'automatización IA',
        'chatbots',
        'dashboards',
        'TypeScript',
        'React',
        'PMP',
        'México',
      ],
    },
    en: {
      title: 'Carlos Anaya Ruíz | Technical SEO Consultant, Next.js & Digital Growth',
      description:
        'Carlos Anaya Ruíz — Technical SEO consultant & full-stack engineer. I build web apps with Next.js and Firebase, AI automation, and high-performance dashboards. 4+ years experience, PMP certified.',
      locale: 'en_US',
      keywords: [
        'Carlos Anaya Ruíz',
        'technical SEO',
        'SEO consultant',
        'Next.js',
        'Firebase',
        'web development',
        'AI automation',
        'chatbots',
        'dashboards',
        'TypeScript',
        'React',
        'PMP',
        'Mexico',
      ],
    },
  }
  return { ...SITE_CONFIG, ...configs[locale] }
}

/** All identity/social links — extracted from existing repo, do NOT invent */
export const SOCIAL_LINKS = {
  linkedin: 'https://www.linkedin.com/in/carlos-anaya-ruiz-732abb249/',
  github1: 'https://github.com/CArlos12002',
  github2: 'https://github.com/canaya2002',
  email: 'carlosaremployment@hotmail.com',
  phone: '+525544167974',
  fiverr: 'https://es.fiverr.com/s/995D62d',
  certsDrive:
    'https://drive.google.com/drive/folders/1wanG6pMmIIlwEir_5bZv4bbMYOQlxuHz?usp=sharing',
} as const
