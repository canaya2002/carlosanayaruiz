import { Locale } from '@/data/types'

export const SITE_CONFIG = {
  name: 'Carlos Anaya Ruíz',
  url: 'https://carlosanayaweb.com',
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
    es: 'Carlos Anaya Ruíz — Consultor SEO Técnico y desarrollador full-stack profesional',
    en: 'Carlos Anaya Ruíz — Technical SEO Consultant and professional full-stack developer',
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
      title: 'Carlos Anaya Ruíz | Consultor SEO Técnico, Next.js y Growth Digital',
      description: 'Carlos Anaya Ruíz — Consultor SEO técnico e ingeniero full-stack. Desarrollo aplicaciones web con Next.js y Firebase, automatización con IA y dashboards de alto rendimiento. +4 años de experiencia, certificado PMP.',
      ogLocale: 'es_MX',
      keywords: [
        'Carlos Anaya Ruíz', 'SEO técnico', 'consultor SEO', 'Next.js',
        'Firebase', 'desarrollo web', 'automatización IA', 'chatbots',
        'dashboards', 'TypeScript', 'React', 'PMP', 'México',
      ],
    },
    en: {
      title: 'Carlos Anaya Ruíz | Technical SEO Consultant, Next.js & Digital Growth',
      description: 'Carlos Anaya Ruíz — Technical SEO consultant & full-stack engineer. I build web apps with Next.js and Firebase, AI automation, and high-performance dashboards. 4+ years experience, PMP certified.',
      ogLocale: 'en_US',
      keywords: [
        'Carlos Anaya Ruíz', 'technical SEO', 'SEO consultant', 'Next.js',
        'Firebase', 'web development', 'AI automation', 'chatbots',
        'dashboards', 'TypeScript', 'React', 'PMP', 'Mexico',
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
  certsDrive: 'https://drive.google.com/drive/folders/1wanG6pMmIIlwEir_5bZv4bbMYOQlxuHz?usp=sharing',
} as const
