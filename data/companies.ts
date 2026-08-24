import { forLocale, type Localized, type Locale, type YearMonth } from './types'
import { MAP_LAT_BOUNDS, MAP_VIEWBOX } from './world-map.generated'

/**
 * ════════════════════════════════════════════════════════════════
 * EMPRESAS Y PROYECTOS — la fuente del mapa y de /proyectos
 *
 * ── CÓMO AGREGAR UN CLIENTE FREELANCE ──
 * Copia cualquier entrada de abajo, cámbiale los datos y ya aparece en el
 * mapa, en la rejilla de /proyectos y con su propia página en
 * /proyectos/<slug>. No hay que tocar ningún otro archivo: la ruta, el
 * sitemap, el hreflang, el JSON-LD y la tarjeta OG se derivan de aquí.
 *
 * Si le pones `coords`, sale como pin exacto en su ciudad. Si solo le pones
 * `country`, sale agrupada a nivel país. Las dos formas son válidas.
 *
 * ── SOBRE LAS COORDENADAS QUE FALTAN ──
 * Los tres empleos de abajo salen de data/experience.ts, donde la ubicación
 * registrada es solo "México" o "Estados Unidos" — sin ciudad. No inventé
 * coordenadas para rellenar el mapa: un pin en una ciudad donde nunca
 * trabajaste es un dato falso, y de los que no se notan.
 *
 * Por eso `coords` es opcional y el mapa distingue los dos casos:
 *   · con coords  → pin exacto, con la ciudad escrita
 *   · sin coords  → cuenta dentro del país resaltado, sin pin inventado
 *
 * En cuanto sepas la ciudad de cada uno, agrega `city` y `coords` y el pin
 * aparece solo. Busca la lat/lon en cualquier buscador; el orden es
 * [latitud, longitud].
 * ════════════════════════════════════════════════════════════════
 */

/** ISO 3166-1 alfa-3, para cruzar con COUNTRY_PATHS del mapa. */
export type CountryCode = 'MEX' | 'USA'

export type CompanyKind =
  /** Empleo formal. */
  | 'empleo'
  /** Cliente de consultoría o desarrollo por proyecto. */
  | 'cliente'
  /** Proyecto propio: hackathon, investigación, herramienta. */
  | 'propio'

export interface Company {
  /** Estable y locale-independiente. Es el segmento de la URL. */
  slug: string
  name: string
  kind: CompanyKind
  country: CountryCode
  /** Ciudad. Omitir si no se conoce — no la inventes. */
  city?: string
  /**
   * `[latitud, longitud]`. Omitir si no se conoce la ciudad.
   * Sin esto la entrada cuenta a nivel país y no dibuja pin.
   */
  coords?: readonly [number, number]
  /** Cargo, o el rol que se tuvo en el proyecto. */
  role: string
  startDate: YearMonth
  /** `null` = en curso. */
  endDate: YearMonth | null
  /** Una línea para la tarjeta de la rejilla. */
  summary: string
  /** Qué se hizo, en párrafos. El cuerpo de su página. */
  detail: string[]
  /** Tecnologías. Alimentan las etiquetas de la página. */
  stack: string[]
  /**
   * Rutas de imagen relativas a /public. Suelta las capturas en
   * `public/proyectos/<slug>/` y agrégalas aquí.
   * Vacío es válido: la página dibuja una portada generada por código.
   */
  shots: string[]
  /** PDFs relativos a /public. Suelta los archivos en `public/pdf/`. */
  docs: { label: string; href: string }[]
  /** Enlace externo, si el trabajo es público. */
  url?: string
}

const companiesData: Localized<Company[]> = {
  es: [
    {
      slug: 'amazon',
      name: 'Amazon',
      kind: 'empleo',
      country: 'USA',
      // Sin city ni coords: data/experience.ts solo registra "Estados Unidos".
      role: 'Software Development Engineer',
      startDate: '2023-11',
      endDate: '2025-04',
      summary:
        'Desarrollo de software en un entorno de escala real, con revisión de código, despliegue continuo y operación sobre sistemas en producción.',
      detail: [
        'Trabajé como Software Development Engineer dentro de equipos que operan sistemas en producción a escala. El trabajo diario combinaba desarrollo de funcionalidad, revisión de código de otros y responsabilidad operativa sobre lo que ya estaba corriendo.',
        'La parte que más me marcó no fue escribir código sino el rigor alrededor: nada llega a producción sin revisión, sin métricas que digan si mejoró algo, y sin un plan de qué hacer cuando falla. Es el criterio que aplico hoy en cada migración que toco.',
      ],
      stack: ['Java', 'Python', 'AWS', 'CI/CD', 'Git'],
      shots: [],
      docs: [],
    },
    {
      slug: 'master-loyalty-group',
      name: 'Master Loyalty Group',
      kind: 'empleo',
      country: 'MEX',
      role: 'Project Manager (PMP)',
      startDate: '2022-09',
      endDate: '2023-08',
      summary:
        'Gestión de proyectos de tecnología con metodología PMP: alcance cerrado, seguimiento de entregables y coordinación entre áreas.',
      detail: [
        'Llevé proyectos de tecnología de principio a fin: definición de alcance, estimación, seguimiento y cierre, aplicando el marco del PMBOK con el que me certifiqué como PMP.',
        'Coordinar entre desarrollo, operación y negocio es donde aprendí que la mayoría de los proyectos no fallan por un problema técnico, sino porque nadie escribió qué se iba a entregar. Por eso hoy cada propuesta que mando lleva alcance, entregables y métrica de éxito por escrito.',
      ],
      stack: ['PMBOK', 'Scrum', 'Jira', 'Power BI'],
      shots: [],
      docs: [],
    },
    {
      slug: 'wan-hai-lines',
      name: 'Wan Hai Lines',
      kind: 'empleo',
      country: 'MEX',
      role: 'IT Manager',
      startDate: '2021-02',
      endDate: '2022-08',
      summary:
        'Responsable de infraestructura y sistemas internos en la operación mexicana de una naviera internacional.',
      detail: [
        'Fui responsable de la infraestructura y los sistemas internos de la operación en México de una naviera internacional: redes, servidores, soporte y continuidad de los sistemas que sostienen la operación logística diaria.',
        'Aquí entendí lo que significa que un sistema esté caído: no es una métrica en un dashboard, es carga que no se mueve. Esa noción de costo real de la indisponibilidad es la que traigo a las migraciones de sitios que hago ahora.',
      ],
      stack: ['Windows Server', 'Redes', 'SQL', 'Soporte IT'],
      shots: [],
      docs: [],
    },
    {
      slug: 'aurascope',
      name: 'AuraScope',
      kind: 'propio',
      country: 'MEX',
      city: 'Ciudad de México',
      coords: [19.4326, -99.1332],
      role: 'Desarrollo y visualización de datos',
      startDate: '2024-10',
      endDate: '2024-10',
      summary:
        'Monitoreo de calidad del aire con datos satelitales. Reconocimiento "Galactic Problem Solver" del NASA Space Apps Challenge.',
      detail: [
        'AuraScope cruza datos satelitales de calidad del aire con visualización geográfica para hacer legible algo que normalmente vive en archivos que nadie abre.',
        'AuraScope recibió el reconocimiento "Galactic Problem Solver" del NASA Space Apps Challenge 2024.',
      ],
      stack: ['Python', 'Datos satelitales', 'Visualización', 'GeoJSON'],
      shots: [],
      docs: [],
    },
    {
      slug: 'logiroute-ai',
      name: 'LogiRoute AI',
      kind: 'propio',
      country: 'MEX',
      city: 'Ciudad de México',
      coords: [19.4326, -99.1332],
      role: 'Desarrollo y modelo de optimización',
      startDate: '2022-04',
      endDate: '2022-04',
      summary:
        'Optimización de rutas de logística urbana. Primer lugar en hackathon 2022.',
      detail: [
        'LogiRoute AI ataca el problema de ruteo urbano: dado un conjunto de entregas y restricciones de tráfico, encontrar el orden que reduce distancia y tiempo.',
        'Ganó el primer lugar del hackathon en 2022. La reducción de consumo de combustible que reportamos era una proyección del modelo, no una medición en operación real — vale decirlo así porque es la diferencia entre un resultado y una estimación.',
      ],
      stack: ['Python', 'Optimización', 'Algoritmos de ruteo'],
      shots: [],
      docs: [],
    },

    /* ────────────────────────────────────────────────────────────────
     * EJEMPLO — descomenta, cámbiale los datos y aparece en todo el sitio.
     * Con `coords` sale como pin exacto en el mapa.
     * ────────────────────────────────────────────────────────────────
     * {
     *   slug: 'nombre-del-cliente',
     *   name: 'Nombre del Cliente',
     *   kind: 'cliente',
     *   country: 'MEX',
     *   city: 'Guadalajara',
     *   coords: [20.6597, -103.3496],
     *   role: 'Consultoría SEO técnico',
     *   startDate: '2025-03',
     *   endDate: '2025-06',
     *   summary: 'Una línea de qué se hizo, para la tarjeta de la rejilla.',
     *   detail: [
     *     'Qué estaba roto y cómo se diagnosticó.',
     *     'Qué se cambió y qué se pudo medir después.',
     *   ],
     *   stack: ['Next.js', 'Schema.org', 'Core Web Vitals'],
     *   shots: ['/proyectos/nombre-del-cliente/antes.png'],
     *   docs: [{ label: 'Auditoría (PDF)', href: '/pdf/auditoria-cliente.pdf' }],
     *   url: 'https://cliente.com',
     * },
     */
  ],
  en: [
    {
      slug: 'amazon',
      name: 'Amazon',
      kind: 'empleo',
      country: 'USA',
      role: 'Software Development Engineer',
      startDate: '2023-11',
      endDate: '2025-04',
      summary:
        'Software development at real scale, with code review, continuous deployment, and operational ownership of systems already in production.',
      detail: [
        'I worked as a Software Development Engineer on teams operating production systems at scale. Day to day the work combined building features, reviewing other people’s code, and carrying operational responsibility for what was already running.',
        'What stayed with me was not the code but the rigour around it: nothing ships without review, without metrics that say whether it improved anything, and without a plan for when it breaks. That is the judgement I bring to every migration I touch now.',
      ],
      stack: ['Java', 'Python', 'AWS', 'CI/CD', 'Git'],
      shots: [],
      docs: [],
    },
    {
      slug: 'master-loyalty-group',
      name: 'Master Loyalty Group',
      kind: 'empleo',
      country: 'MEX',
      role: 'Project Manager (PMP)',
      startDate: '2022-09',
      endDate: '2023-08',
      summary:
        'Technology project management under PMP practice: fixed scope, deliverable tracking, and coordination across teams.',
      detail: [
        'I ran technology projects end to end — scoping, estimating, tracking, and closing — applying the PMBOK framework I certified in as a PMP.',
        'Coordinating between development, operations, and the business is where I learned that most projects do not fail on a technical problem; they fail because nobody wrote down what was going to be delivered. That is why every proposal I send now carries scope, deliverables, and a success metric in writing.',
      ],
      stack: ['PMBOK', 'Scrum', 'Jira', 'Power BI'],
      shots: [],
      docs: [],
    },
    {
      slug: 'wan-hai-lines',
      name: 'Wan Hai Lines',
      kind: 'empleo',
      country: 'MEX',
      role: 'IT Manager',
      startDate: '2021-02',
      endDate: '2022-08',
      summary:
        'Owned infrastructure and internal systems for the Mexican operation of an international shipping line.',
      detail: [
        'I owned the infrastructure and internal systems for the Mexico operation of an international shipping line: networks, servers, support, and the continuity of the systems that hold up daily logistics.',
        'This is where I learned what a system being down actually means. It is not a metric on a dashboard, it is freight that does not move. That sense of the real cost of unavailability is what I bring to the site migrations I run now.',
      ],
      stack: ['Windows Server', 'Networking', 'SQL', 'IT Support'],
      shots: [],
      docs: [],
    },
    {
      slug: 'aurascope',
      name: 'AuraScope',
      kind: 'propio',
      country: 'MEX',
      city: 'Mexico City',
      coords: [19.4326, -99.1332],
      role: 'Development and data visualisation',
      startDate: '2024-10',
      endDate: '2024-10',
      summary:
        'Air quality monitoring from satellite data. "Galactic Problem Solver" recognition, NASA Space Apps Challenge.',
      detail: [
        'AuraScope joins satellite air-quality data with geographic visualisation, to make legible something that normally lives in files nobody opens.',
        'AuraScope received the "Galactic Problem Solver" recognition at the 2024 NASA Space Apps Challenge.',
      ],
      stack: ['Python', 'Satellite data', 'Visualisation', 'GeoJSON'],
      shots: [],
      docs: [],
    },
    {
      slug: 'logiroute-ai',
      name: 'LogiRoute AI',
      kind: 'propio',
      country: 'MEX',
      city: 'Mexico City',
      coords: [19.4326, -99.1332],
      role: 'Development and optimisation model',
      startDate: '2022-04',
      endDate: '2022-04',
      summary: 'Urban logistics route optimisation. First place, 2022 hackathon.',
      detail: [
        'LogiRoute AI takes on urban routing: given a set of deliveries and traffic constraints, find the order that cuts distance and time.',
        'It won first place at the 2022 hackathon. The fuel reduction we reported was a projection from the model, not a measurement in real operation — worth saying plainly, because that is the difference between a result and an estimate.',
      ],
      stack: ['Python', 'Optimisation', 'Routing algorithms'],
      shots: [],
      docs: [],
    },
  ],
}

export function getCompanies(locale: Locale): Company[] {
  return forLocale(companiesData, locale)
}

export function getCompanyBySlug(
  locale: Locale,
  slug: string
): Company | undefined {
  return getCompanies(locale).find((c) => c.slug === slug)
}

/** Todos los slugs, para generateStaticParams. Locale-independiente. */
export function getCompanySlugs(): string[] {
  return companiesData.es.map((c) => c.slug)
}

/**
 * lat/lon -> coordenadas del viewBox del mapa.
 *
 * Es exactamente la misma fórmula que usa scripts/generate-worldmap.mjs para
 * proyectar los contornos. Si una cambia sin la otra, los pines dejan de caer
 * sobre la tierra — por eso los límites vienen importados del archivo generado
 * en lugar de estar escritos aquí otra vez.
 */
export function projectLatLon([lat, lon]: readonly [number, number]): {
  x: number
  y: number
} {
  return {
    x: ((lon + 180) / 360) * MAP_VIEWBOX.width,
    y:
      ((MAP_LAT_BOUNDS.max - lat) / (MAP_LAT_BOUNDS.max - MAP_LAT_BOUNDS.min)) *
      MAP_VIEWBOX.height,
  }
}

/** Cuántas entradas hay por país, para el resaltado del mapa. */
export function countByCountry(locale: Locale): Record<CountryCode, number> {
  const out = { MEX: 0, USA: 0 } as Record<CountryCode, number>
  for (const c of getCompanies(locale)) out[c.country]++
  return out
}
