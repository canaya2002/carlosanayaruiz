import { Locale } from './types'

export interface Award {
  id: string
  title: string
  organization: string
  date: string
  description: string
  impact?: string
  image: string
}

const awardsData: Record<Locale, Award[]> = {
  es: [
    {
      id: 'nasa-spaceapps',
      title: 'AuraScope – Monitoreo de Calidad del Aire vía Satélite',
      organization: 'NASA International Space Apps Challenge',
      date: '2024-10',
      description: 'Plataforma que procesa datos abiertos de NASA (Landsat/Sentinel) para identificar islas de calor y contaminación en zonas urbanas marginadas.',
      impact: 'Reconocimiento "Galactic Problem Solver" por contribución técnica con datasets complejos y visualizaciones.',
      image: '/images/awards/nasa-spaceapps.png',
    },
    {
      id: 'logiroute-ai',
      title: 'LogiRoute AI – Optimización de Logística Urbana',
      organization: 'Escuela de Ingeniería y Ciencias (Tec de Monterrey)',
      date: '2022-04',
      description: 'Sistema de optimización de rutas de logística urbana utilizando inteligencia artificial.',
      impact: 'Ganador 1er lugar hackathon 2022. Reducción proyectada del 15% en consumo de combustible.',
      image: '/images/awards/logiroute.png',
    },
    {
      id: 'toefl',
      title: 'TOEFL - Certificación de Inglés (92 puntos)',
      organization: 'ETS (Educational Testing Service)',
      date: '2023-12',
      description: 'Calificación de 92 puntos demostrando dominio avanzado del idioma inglés.',
      impact: 'Dominio avanzado en lectura, escucha, speaking y writing bajo estándares internacionales ETS.',
      image: '/images/awards/toefl.png',
    },
  ],
  en: [
    {
      id: 'nasa-spaceapps',
      title: 'AuraScope – Satellite Air Quality Monitoring',
      organization: 'NASA International Space Apps Challenge',
      date: '2024-10',
      description: 'Platform processing open NASA data (Landsat/Sentinel) to identify heat islands and pollution in marginalized urban areas.',
      impact: '"Galactic Problem Solver" recognition for technical contribution with complex datasets and visualizations.',
      image: '/images/awards/nasa-spaceapps.png',
    },
    {
      id: 'logiroute-ai',
      title: 'LogiRoute AI – Urban Logistics Optimization',
      organization: 'School of Engineering and Sciences (Tec de Monterrey)',
      date: '2022-04',
      description: 'Urban logistics route optimization system using artificial intelligence.',
      impact: '1st place winner hackathon 2022. Projected 15% reduction in fuel consumption.',
      image: '/images/awards/logiroute.png',
    },
    {
      id: 'toefl',
      title: 'TOEFL - English Certification (Score: 92)',
      organization: 'ETS (Educational Testing Service)',
      date: '2023-12',
      description: '92-point score demonstrating advanced English language proficiency.',
      impact: 'Advanced proficiency in reading, listening, speaking and writing under international ETS standards.',
      image: '/images/awards/toefl.png',
    },
  ],
}

export function getAwards(locale: Locale): Award[] {
  return awardsData[locale] ?? awardsData.es
}
