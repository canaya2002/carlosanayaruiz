import { Locale } from './types'

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  location: string
  description?: string
}

const educationData: Record<Locale, Education[]> = {
  es: [
    {
      id: 'tec-ai',
      institution: 'Tecnológico de Monterrey',
      degree: 'Especialización',
      field: 'Inteligencia Artificial Avanzada para la Ciencia de Datos',
      startDate: '2023',
      endDate: '2024',
      location: 'Ciudad de México, México',
    },
    {
      id: 'tec-itc',
      institution: 'Tecnológico de Monterrey',
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
      degree: 'Specialization',
      field: 'Advanced AI for Data Science',
      startDate: '2023',
      endDate: '2024',
      location: 'Mexico City, Mexico',
    },
    {
      id: 'tec-itc',
      institution: 'Tecnológico de Monterrey',
      degree: 'Engineering',
      field: 'Computer Science & Technology',
      startDate: '2019',
      endDate: '2023',
      location: 'Mexico City, Mexico',
    },
  ],
}

export function getEducation(locale: Locale): Education[] {
  return educationData[locale] ?? educationData.es
}
