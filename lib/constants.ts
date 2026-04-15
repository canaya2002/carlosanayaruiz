import { Locale } from '@/data/types'

export const SITE_CONFIG = {
  name: 'Carlos Anaya Ruiz',
  url: 'https://carlosanayaruiz.com',
  locales: ['es', 'en'] as const,
  defaultLocale: 'es' as const,
} as const

/**
 * ════════════════════════════════════════════════════════════════
 * SEO IMAGE MAP — Centralized source of truth.
 * Every image in the site references this map so file names
 * stay consistent (kebab-case, descriptive, include name).
 *
 * Files expected at public/ root:
 *   carlos-anaya-ruiz-software.png   ← Main professional photo
 *   og-default.png                   ← Default OG 1200×630
 *   og-es.png                        ← Spanish OG 1200×630
 *   og-en.png                        ← English OG 1200×630
 *   apple-touch-icon.png             ← 180×180
 *   icon-192.png                     ← PWA icon 192×192
 *   icon-512.png                     ← PWA icon 512×512
 *   favicon.ico                      ← Browser tab icon
 * ════════════════════════════════════════════════════════════════
 */
export const SEO_IMAGES = {
  /** Primary professional headshot — Hero, About, Schema, OG fallback */
  avatar: '/carlos-anaya-ruiz-software.png',
  /** Alt text per locale — MUST include full name naturally */
  avatarAlt: {
    es: 'Carlos Anaya Ruiz — Consultor SEO técnico y desarrollador full-stack en Ciudad de México',
    en: 'Carlos Anaya Ruiz — Technical SEO consultant and full-stack developer in Mexico City',
  } as Record<Locale, string>,
  ogDefault: '/og-default.png',
  ogEs: '/og-es.png',
  ogEn: '/og-en.png',
  appleTouchIcon: '/apple-touch-icon.png',
  icon192: '/icon-192.png',
  icon512: '/icon-512.png',
  favicon: '/favicon.ico',
} as const

export function getSiteConfig(locale: Locale) {
  const configs: Record<
    Locale,
    { title: string; description: string; ogLocale: string; keywords: string[] }
  > = {
    es: {
      title: 'Carlos Anaya Ruiz — Consultor SEO Técnico & Desarrollador Full-Stack en México',
      description:
        'Carlos Anaya Ruiz — Consultor SEO técnico, ingeniero full-stack y arquitecto de producto digital en México. Desarrollo web con Next.js y Firebase, automatización con IA, dashboards empresariales. +4 años de experiencia, certificado PMP. Amazon, Tec de Monterrey.',
      ogLocale: 'es_MX',
      keywords: [
        'Carlos Anaya Ruiz',
        'Carlos Anaya',
        'consultor SEO técnico',
        'consultor SEO técnico México',
        'SEO técnico Next.js',
        'consultor web México',
        'desarrollo web Next.js',
        'desarrollo web México',
        'ingeniero full-stack México',
        'desarrollador de software',
        'automatización IA empresas',
        'chatbots inteligentes',
        'dashboards empresariales',
        'Firebase',
        'TypeScript',
        'React',
        'arquitectura web',
        'Core Web Vitals',
        'PMP certificado',
      ],
    },
    en: {
      title: 'Carlos Anaya Ruiz — Technical SEO Consultant & Full-Stack Developer in Mexico',
      description:
        'Carlos Anaya Ruiz — Technical SEO consultant, full-stack engineer & digital product architect in Mexico. Web development with Next.js & Firebase, AI automation, enterprise dashboards. 4+ years experience, PMP certified. Amazon, Tec de Monterrey.',
      ogLocale: 'en_US',
      keywords: [
        'Carlos Anaya Ruiz',
        'Carlos Anaya',
        'technical SEO consultant',
        'technical SEO consultant Mexico',
        'technical SEO Next.js',
        'web consultant Mexico',
        'Next.js web development',
        'web development Mexico',
        'full-stack engineer Mexico',
        'software developer',
        'AI automation business',
        'intelligent chatbots',
        'enterprise dashboards',
        'Firebase',
        'TypeScript',
        'React',
        'web architecture',
        'Core Web Vitals',
        'PMP certified',
      ],
    },
  }
  return { ...SITE_CONFIG, ...configs[locale] }
}

/** Social/identity links — from repo, never invented */
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
