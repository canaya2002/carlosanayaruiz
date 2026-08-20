import { forLocale, type Localized, type Locale, type Year } from './types'

/** Stable, locale-independent keys. */
export type EducationId = 'tec-ai' | 'tec-itc'

/**
 * What kind of credential this record is.
 *
 * This matters for honesty, not styling: a specialization/concentration inside
 * a degree programme is not a second degree, and the UI (and any schema that
 * reads this) must be able to tell them apart instead of printing both as
 * equivalent qualifications.
 */
export type EducationKind = 'degree' | 'specialization'

export interface Education {
  id: EducationId
  institution: string
  kind: EducationKind
  /** Localised credential label, e.g. `Ingeniería` / `Engineering`. */
  degree: string
  /** Localised field of study. */
  field: string
  /** Years only — a month would be invented precision. */
  startDate: Year
  endDate: Year
  location: string
}

const educationData: Localized<Education[]> = {
  es: [
    {
      id: 'tec-ai',
      institution: 'Tecnológico de Monterrey',
      kind: 'specialization',
      degree: 'Especialización',
      field: 'Inteligencia Artificial Avanzada para la Ciencia de Datos',
      startDate: '2023',
      endDate: '2024',
      location: 'Ciudad de México, México',
    },
    {
      id: 'tec-itc',
      institution: 'Tecnológico de Monterrey',
      kind: 'degree',
      degree: 'Ingeniería',
      field: 'Tecnologías Computacionales',
      startDate: '2019',
      endDate: '2023',
      location: 'Ciudad de México, México',
    },
  ],
  en: [
    {
      id: 'tec-ai',
      institution: 'Tecnológico de Monterrey',
      kind: 'specialization',
      degree: 'Specialization',
      field: 'Advanced AI for Data Science',
      startDate: '2023',
      endDate: '2024',
      location: 'Mexico City, Mexico',
    },
    {
      id: 'tec-itc',
      institution: 'Tecnológico de Monterrey',
      kind: 'degree',
      degree: 'Engineering',
      field: 'Computer Science & Technology',
      startDate: '2019',
      endDate: '2023',
      location: 'Mexico City, Mexico',
    },
  ],
}

export function getEducation(locale: Locale): Education[] {
  return forLocale(educationData, locale)
}
