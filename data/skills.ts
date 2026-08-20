import { forLocale, type Localized, type Locale } from './types'

/**
 * Locale-independent category keys. Used as React keys and as the join between
 * the two locales, so the ES and EN lists stay in the same order and a category
 * can never exist in one language only.
 */
export type SkillCategoryId =
  | 'seo-performance'
  | 'languages-backend'
  | 'frontend-mobile'
  | 'data'
  | 'cloud-devops'
  | 'ai-ml'
  | 'management'

export interface SkillCategory {
  category: SkillCategoryId
  /** Localised heading for the group. */
  label: string
  /**
   * Tool and technology names. Deliberately unlocalised strings — product
   * names are not translated, and no self-assessed level is attached to them
   * because the record does not support one.
   */
  skills: string[]
}

const skillsData: Localized<SkillCategory[]> = {
  es: [
    {
      category: 'seo-performance',
      label: 'SEO Técnico & Rendimiento Web',
      skills: ['Schema.org/JSON-LD', 'Core Web Vitals', 'Google Search Console', 'Lighthouse', 'Screaming Frog', 'hreflang/i18n', 'Sitemap/Robots', 'Arquitectura de Información'],
    },
    {
      category: 'languages-backend',
      label: 'Lenguajes & Backend',
      skills: ['Python', 'Go', 'Rust', 'C#/.NET', 'Java', 'TypeScript', 'Node.js', 'Django', 'FastAPI'],
    },
    {
      category: 'frontend-mobile',
      label: 'Frontend & Móvil',
      skills: ['React', 'Next.js', 'Angular', 'Vue.js', 'Svelte', 'Swift (UIKit)', 'Kotlin (Jetpack)'],
    },
    {
      category: 'data',
      label: 'Bases de Datos & Data',
      skills: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'GraphQL', 'Power BI', 'DAX', 'Pandas', 'ETL'],
    },
    {
      category: 'cloud-devops',
      label: 'Cloud & DevOps',
      skills: ['AWS', 'Azure', 'GCP', 'Firebase', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'Git', 'CI/CD'],
    },
    {
      category: 'ai-ml',
      label: 'IA & Machine Learning',
      skills: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras', 'LLM Integration (GPT, Gemini)'],
    },
    {
      category: 'management',
      label: 'Gestión & Metodologías',
      skills: ['Jira', 'Confluence', 'MS Project', 'Asana', 'Scrum', 'Kanban', 'PMBOK', 'Lean'],
    },
  ],
  en: [
    {
      category: 'seo-performance',
      label: 'Technical SEO & Web Performance',
      skills: ['Schema.org/JSON-LD', 'Core Web Vitals', 'Google Search Console', 'Lighthouse', 'Screaming Frog', 'hreflang/i18n', 'Sitemap/Robots', 'Information Architecture'],
    },
    {
      category: 'languages-backend',
      label: 'Languages & Backend',
      skills: ['Python', 'Go', 'Rust', 'C#/.NET', 'Java', 'TypeScript', 'Node.js', 'Django', 'FastAPI'],
    },
    {
      category: 'frontend-mobile',
      label: 'Frontend & Mobile',
      skills: ['React', 'Next.js', 'Angular', 'Vue.js', 'Svelte', 'Swift (UIKit)', 'Kotlin (Jetpack)'],
    },
    {
      category: 'data',
      label: 'Databases & Data',
      skills: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'GraphQL', 'Power BI', 'DAX', 'Pandas', 'ETL'],
    },
    {
      category: 'cloud-devops',
      label: 'Cloud & DevOps',
      skills: ['AWS', 'Azure', 'GCP', 'Firebase', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'Git', 'CI/CD'],
    },
    {
      category: 'ai-ml',
      label: 'AI & Machine Learning',
      skills: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras', 'LLM Integration (GPT, Gemini)'],
    },
    {
      category: 'management',
      label: 'Management & Methodologies',
      skills: ['Jira', 'Confluence', 'MS Project', 'Asana', 'Scrum', 'Kanban', 'PMBOK', 'Lean'],
    },
  ],
}

export function getSkillCategories(locale: Locale): SkillCategory[] {
  return forLocale(skillsData, locale)
}
