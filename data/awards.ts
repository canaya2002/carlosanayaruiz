import { forLocale, type Localized, type Locale, type YearMonth } from './types'

/** Stable, locale-independent keys. */
export type AwardId = 'nasa-spaceapps' | 'logiroute-ai' | 'toefl'

/**
 * What this entry actually is.
 *
 * Not cosmetic. These three records are three different things, and lumping
 * them under one "Awards" heading overstates two of them:
 *   - `recognition`  — a named distinction that is not a first-place win.
 *   - `competition`  — a placed result in a contest or hackathon.
 *   - `certification`— a passed exam or credential. Not an award at all.
 * The UI should label each by its kind rather than calling all three prizes.
 */
export type AwardKind = 'recognition' | 'competition' | 'certification'

export interface Award {
  id: AwardId
  kind: AwardKind
  title: string
  organization: string
  /** `YYYY-MM`. Day-level precision is not in the record. */
  date: YearMonth
  description: string
  /**
   * What the result was, in the record's own terms. Optional because not every
   * entry has an outcome beyond the credential itself. Never state a business
   * metric here that the project did not measure.
   */
  impact?: string
  /**
   * Optional badge/certificate image, relative to `/public`.
   *
   * Left unset on purpose: the previous values pointed at
   * `/images/awards/*.png`, and that directory does not exist, so every entry
   * referenced a 404. Set this only once the file is actually committed —
   * the UI must treat it as optional.
   */
  image?: string
}

const awardsData: Localized<Award[]> = {
  es: [
    {
      id: 'nasa-spaceapps',
      kind: 'recognition',
      title: 'AuraScope – Monitoreo de Calidad del Aire vía Satélite',
      organization: 'NASA International Space Apps Challenge',
      date: '2024-10',
      description: 'Plataforma que procesa datos abiertos de NASA (Landsat/Sentinel) para identificar islas de calor y contaminación en zonas urbanas marginadas.',
    },
    {
      id: 'logiroute-ai',
      kind: 'competition',
      title: 'LogiRoute AI – Optimización de Logística Urbana',
      organization: 'Escuela de Ingeniería y Ciencias (Tec de Monterrey)',
      date: '2022-04',
      description: 'Sistema de optimización de rutas de logística urbana utilizando inteligencia artificial.',
      impact: 'Ganador 1er lugar hackathon 2022. Reducción proyectada del 15% en consumo de combustible.',
    },
    {
      id: 'toefl',
      kind: 'certification',
      title: 'TOEFL - Certificación de Inglés (92 puntos)',
      organization: 'ETS (Educational Testing Service)',
      date: '2023-12',
      description: 'Calificación de 92 puntos demostrando dominio avanzado del idioma inglés.',
      impact: 'Dominio avanzado en lectura, escucha, speaking y writing bajo estándares internacionales ETS.',
    },
  ],
  en: [
    {
      id: 'nasa-spaceapps',
      kind: 'recognition',
      title: 'AuraScope – Satellite Air Quality Monitoring',
      organization: 'NASA International Space Apps Challenge',
      date: '2024-10',
      description: 'Platform processing open NASA data (Landsat/Sentinel) to identify heat islands and pollution in marginalized urban areas.',
    },
    {
      id: 'logiroute-ai',
      kind: 'competition',
      title: 'LogiRoute AI – Urban Logistics Optimization',
      organization: 'School of Engineering and Sciences (Tec de Monterrey)',
      date: '2022-04',
      description: 'Urban logistics route optimization system using artificial intelligence.',
      impact: '1st place winner hackathon 2022. Projected 15% reduction in fuel consumption.',
    },
    {
      id: 'toefl',
      kind: 'certification',
      title: 'TOEFL - English Certification (Score: 92)',
      organization: 'ETS (Educational Testing Service)',
      date: '2023-12',
      description: '92-point score demonstrating advanced English language proficiency.',
      impact: 'Advanced proficiency in reading, listening, speaking and writing under international ETS standards.',
    },
  ],
}

export function getAwards(locale: Locale): Award[] {
  return forLocale(awardsData, locale)
}
