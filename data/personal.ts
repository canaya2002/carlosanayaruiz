import { NAP, SITE_CONFIG, SOCIAL_LINKS } from '@/lib/constants'
import {
  cefrProficiency,
  forLocale,
  type CefrLevel,
  type Localized,
  type Locale,
} from './types'

export interface Language {
  name: string
  /** Locale-independent band. The union is the source of truth for the level. */
  cefr: CefrLevel
  /** Whether this is a first language. Distinct from the CEFR band. */
  native: boolean
  /** Localised label shown next to the meter, e.g. `Nativo (C2)`. */
  level: string
  /** 0–100 meter value. Always derived from `cefr` via `cefrProficiency`. */
  proficiency: number
}

export interface PersonalInfo {
  name: string
  title: string
  /** From NAP. Never hard-code — see `lib/constants.ts`. */
  email: string
  /** E.164, for `tel:` hrefs and schema. */
  phone: string
  /** Human-readable phone, for display. */
  phoneDisplay: string
  location: string
  /** Long bio. Paragraphs are separated by a blank line and split on render. */
  summary: string
  /** One or two sentences, for cards, footers, and meta descriptions. */
  shortBio: string
  seoTagline: string
  linkedin: string
  /** Both GitHub accounts, primary first. Sourced from SOCIAL_LINKS. */
  github: readonly string[]
  website: string
  certsDriveLink: string
  languages: Language[]
}

/**
 * Identity fields are pulled from the single sources of truth rather than
 * retyped here: NAP for contact details, SOCIAL_LINKS for profile URLs,
 * SITE_CONFIG for the canonical origin. That is deliberate — a duplicated
 * email or phone number is how a site ends up with inconsistent NAP, which
 * is the most common local-SEO defect there is.
 */
const identity = {
  name: NAP.name,
  email: NAP.email,
  phone: NAP.phone,
  phoneDisplay: NAP.phoneDisplay,
  linkedin: SOCIAL_LINKS.linkedin,
  github: [SOCIAL_LINKS.github, SOCIAL_LINKS.githubAlt] as const,
  website: SITE_CONFIG.url,
  certsDriveLink: SOCIAL_LINKS.certsDrive,
} as const

const personalData: Localized<PersonalInfo> = {
  es: {
    ...identity,
    title: 'Consultor SEO Técnico e Ingeniero Full-Stack',
    location: `${NAP.locality}, ${NAP.countryName}`,
    summary: `Ingeniero en Tecnologías Computacionales por el Tecnológico de Monterrey, con más de 5 años de experiencia entre proyectos de software, SEO técnico y desarrollo full-stack. Certificado PMP y con práctica en metodologías ágiles (Scrum).

Trabajo en la intersección entre ingeniería y buscadores: arquitectura de información, datos estructurados (Schema.org/JSON-LD), Core Web Vitals, internacionalización (i18n/hreflang) y rendimiento web. He liderado equipos multidisciplinarios en Amazon, Master Loyalty Group y Wan Hai Lines.`,
    shortBio:
      'Ingeniero de software y consultor SEO técnico en Ciudad de México. Construyo sitios rápidos e indexables con Next.js, Firebase y datos estructurados.',
    seoTagline: 'SEO Técnico · Next.js · Firebase · Automatización con IA · Dashboards',
    languages: [
      { name: 'Español', cefr: 'C2', native: true, level: 'Nativo (C2)', proficiency: cefrProficiency('C2') },
      { name: 'Inglés', cefr: 'C1', native: false, level: 'Profesional (C1 – TOEFL 92)', proficiency: cefrProficiency('C1') },
      { name: 'Francés', cefr: 'A2', native: false, level: 'Principiante (A2)', proficiency: cefrProficiency('A2') },
    ],
  },
  en: {
    ...identity,
    title: 'Technical SEO Consultant & Full-Stack Engineer',
    location: `${NAP.localityEn}, ${NAP.countryNameEn}`,
    summary: `Computer Science Engineer from Tecnológico de Monterrey with 5+ years of experience across software projects, technical SEO, and full-stack development. PMP certified, working in agile (Scrum) teams.

I work at the intersection of engineering and search: information architecture, structured data (Schema.org/JSON-LD), Core Web Vitals, internationalization (i18n/hreflang), and web performance. I have led multidisciplinary teams at Amazon, Master Loyalty Group, and Wan Hai Lines.`,
    shortBio:
      'Software engineer and technical SEO consultant in Mexico City. I build fast, indexable sites with Next.js, Firebase, and structured data.',
    seoTagline: 'Technical SEO · Next.js · Firebase · AI Automation · Dashboards',
    languages: [
      { name: 'English', cefr: 'C1', native: false, level: 'Professional (C1 – TOEFL 92)', proficiency: cefrProficiency('C1') },
      { name: 'Spanish', cefr: 'C2', native: true, level: 'Native (C2)', proficiency: cefrProficiency('C2') },
      { name: 'French', cefr: 'A2', native: false, level: 'Beginner (A2)', proficiency: cefrProficiency('A2') },
    ],
  },
}

export function getPersonalInfo(locale: Locale): PersonalInfo {
  return forLocale(personalData, locale)
}
