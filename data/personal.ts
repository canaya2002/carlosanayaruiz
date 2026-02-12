import { Locale } from './types'

export interface PersonalInfo {
  name: string
  title: string
  email: string
  phone: string
  location: string
  summary: string
  shortBio: string
  seoTagline: string
  linkedin: string
  github: string[]
  fiverr: string
  website: string
  certsDriveLink: string
  languages: Language[]
}

export interface Language {
  name: string
  level: string
  proficiency: number
}

const personalData: Record<Locale, PersonalInfo> = {
  es: {
    name: 'Carlos Anaya Ruíz',
    title: 'Consultor SEO Técnico & Arquitecto de Producto Digital',
    email: 'carlosaremployment@hotmail.com',
    phone: '+52 55 4416 7974',
    location: 'Ciudad de México, México',
    summary: `Ingeniero en Tecnologías Computacionales con más de 4 años de experiencia liderando proyectos de software, SEO técnico y desarrollo full-stack. Certificado PMP, especializado en metodologías ágiles (Scrum) y en construir productos digitales escalables, indexables y centrados en el usuario.

Mi enfoque combina ingeniería de alto rendimiento con estrategia SEO técnica: arquitectura de información, datos estructurados (Schema.org/JSON-LD), Core Web Vitals, internacionalización (i18n/hreflang) y rendimiento web. He liderado equipos multidisciplinarios en Amazon, IBM y proyectos freelance, optimizando procesos y alineando tecnología con objetivos de negocio y crecimiento orgánico.`,
    shortBio: 'Ingeniero de software y consultor SEO técnico. Construyo sitios web rápidos, indexables y que convierten — con Next.js, Firebase, IA y datos estructurados.',
    seoTagline: 'SEO Técnico · Next.js · Firebase · Automatización con IA · Dashboards',
    linkedin: 'https://www.linkedin.com/in/carlos-anaya-ruiz-732abb249/',
    github: ['https://github.com/CArlos12002', 'https://github.com/canaya2002'],
    fiverr: 'https://es.fiverr.com/s/995D62d',
    website: 'https://carlosanayaweb.com',
    certsDriveLink: 'https://drive.google.com/drive/folders/1wanG6pMmIIlwEir_5bZv4bbMYOQlxuHz?usp=sharing',
    languages: [
      { name: 'Español', level: 'Nativo (C2)', proficiency: 100 },
      { name: 'Inglés', level: 'Profesional (C1 – TOEFL 92)', proficiency: 90 },
      { name: 'Francés', level: 'Principiante (A2)', proficiency: 25 },
    ],
  },
  en: {
    name: 'Carlos Anaya Ruíz',
    title: 'Technical SEO Consultant & Digital Product Architect',
    email: 'carlosaremployment@hotmail.com',
    phone: '+52 55 4416 7974',
    location: 'Mexico City, Mexico',
    summary: `Computer Science Engineer with 4+ years of experience leading software projects, technical SEO, and full-stack development. PMP certified, specialized in agile methodologies (Scrum) and building scalable, indexable, user-centered digital products.

My approach combines high-performance engineering with technical SEO strategy: information architecture, structured data (Schema.org/JSON-LD), Core Web Vitals, internationalization (i18n/hreflang), and web performance. I've led multidisciplinary teams at Amazon, IBM, and freelance projects, optimizing processes and aligning technology with business goals and organic growth.`,
    shortBio: 'Software engineer & technical SEO consultant. I build fast, indexable, high-converting websites — with Next.js, Firebase, AI, and structured data.',
    seoTagline: 'Technical SEO · Next.js · Firebase · AI Automation · Dashboards',
    linkedin: 'https://www.linkedin.com/in/carlos-anaya-ruiz-732abb249/',
    github: ['https://github.com/CArlos12002', 'https://github.com/canaya2002'],
    fiverr: 'https://es.fiverr.com/s/995D62d',
    website: 'https://carlosanayaweb.com',
    certsDriveLink: 'https://drive.google.com/drive/folders/1wanG6pMmIIlwEir_5bZv4bbMYOQlxuHz?usp=sharing',
    languages: [
      { name: 'English', level: 'Professional (C1 – TOEFL 92)', proficiency: 90 },
      { name: 'Spanish', level: 'Native (C2)', proficiency: 100 },
      { name: 'French', level: 'Beginner (A2)', proficiency: 25 },
    ],
  },
}

export function getPersonalInfo(locale: Locale): PersonalInfo {
  return personalData[locale] ?? personalData.es
}
