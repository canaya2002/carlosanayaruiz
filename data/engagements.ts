/**
 * ════════════════════════════════════════════════════════════════
 * EL REGISTRO DE ENCARGOS — trabajo freelance, uno por fila
 *
 * Dieciocho encargos que el dueño entregó en el formato de
 * `docs/ENCARGOS.md`. Aquí van tal como los dictó: nada añadido, nada
 * interpretado.
 *
 * ── POR QUÉ NO ESTÁN EN `data/companies.ts` ──
 * Ese archivo modela EMPLEOS y PROYECTOS PROPIOS, y cada entrada tiene su
 * propia página en /proyectos/[slug] con galería, ficha y documentos. Dieciocho
 * encargos de dos a nueve semanas no son eso: son un registro. Darles una
 * página cada uno crearía dieciocho URLs de contenido pobre compitiendo con las
 * cinco que sí tienen cuerpo.
 *
 * Van como FILAS de un registro, que es la forma que este sistema ya tiene para
 * una lista de cosas (`.band`), y su instrumento es el eje de tiempo.
 *
 * ── LAS DOS REGLAS ──
 * 1. `weeks` es el LARGO de la marca en el eje y `year` su POSICIÓN. El dibujo
 *    sale del dato, así que no puede desmentirlo — es la lección que dejó el
 *    dial cuando rotulaba «a–e» dibujando cuatro.
 * 2. `outcome` es OPCIONAL y ausente significa que no se midió. La página
 *    entonces no afirma nada sobre el resultado, igual que `awards.ts` no
 *    afirma un impacto que no puede citar.
 *
 * SOBRE `outcome`
 * Nueve de los dieciocho traen una cifra de resultado y el dueño confirmó
 * explícitamente que son mediciones reales del trabajo. Se publican tal como
 * las dictó, bajo el rótulo «resultado medido» — el mismo tratamiento que
 * `awards.ts` da a su campo `impact`.
 *
 * Los otros nueve no traen cifra porque no se midieron, y ahí la página no
 * afirma nada: la ausencia del campo ES el dato. Es la regla que hace creíbles
 * a los nueve que sí la tienen.
 * ════════════════════════════════════════════════════════════════
 */

/** Tipo de encargo. Es el canal del registro. */
export type EngagementKind =
  | 'sitio-web'
  | 'software-interno'
  | 'automatizacion'
  | 'dashboard'
  | 'seo'
  | 'integracion'

/** La página de servicio que recibe el enlace interno. */
export type EngagementService =
  | 'seo-tecnico'
  | 'desarrollo-web'
  | 'automatizacion-ia'
  | 'dashboards'

export interface Engagement {
  id: string
  /** Nombre del cliente, o el descriptor del sector si hay acuerdo. */
  client: string
  /** `true` cuando el nombre va anonimizado. La página lo ROTULA. */
  anonymous?: boolean
  sector: string
  /** ISO 3166-1 alpha-2. */
  country: string
  city: string
  /** Año de entrega. Es la POSICIÓN de la marca en el eje. */
  year: number
  /** Duración real. Es el LARGO de la marca. */
  weeks: number
  kind: EngagementKind
  /** Qué se entregó, en una frase de hechos. */
  delivered: string
  /** Tecnologías. Vacío cuando el encargo no fue de construcción. */
  stack: readonly string[]
  /**
   * Resultado MEDIDO por el dueño. Ausente significa que no se midió, y
   * entonces la página no afirma nada: la ausencia es el dato.
   */
  outcome?: string
  service?: EngagementService
}

export const ENGAGEMENTS: readonly Engagement[] = [
  {
    id: 'sonrisa-digital',
    client: 'Clínica dental Sonrisa Digital',
    sector: 'Salud dental',
    country: 'MX',
    city: 'Guadalajara',
    year: 2022,
    weeks: 4,
    kind: 'sitio-web',
    delivered:
      'Sitio de citas online con calendario y recordatorios por WhatsApp',
    stack: ['Next.js', 'Supabase'],
    outcome: 'de 12% a 34% de citas agendadas en línea',
    service: 'desarrollo-web',
  },
  {
    id: 'el-tornillo',
    client: 'Ferretería El Tornillo',
    sector: 'Retail ferretero',
    country: 'MX',
    city: 'Monterrey',
    year: 2022,
    weeks: 6,
    kind: 'software-interno',
    delivered:
      'Sistema de inventario multi-sucursal con alertas de stock mínimo',
    stack: ['Next.js', 'Postgres'],
    service: 'desarrollo-web',
  },
  {
    id: 'aseguradora-rumbo',
    client: 'Aseguradora Rumbo',
    sector: 'Seguros',
    country: 'MX',
    city: 'Ciudad de México',
    year: 2023,
    weeks: 8,
    kind: 'dashboard',
    delivered:
      'Dashboard de siniestros para 6 ajustadores con exportación a Excel',
    stack: ['Next.js', 'Supabase', 'Recharts'],
    outcome: 'de 3 días a 4 horas en cierre de reporte semanal',
    service: 'dashboards',
  },
  {
    id: 'andes-travel',
    client: 'Agencia de viajes Andes Travel',
    sector: 'Turismo',
    country: 'CO',
    city: 'Bogotá',
    year: 2023,
    weeks: 3,
    kind: 'seo',
    delivered:
      'Auditoría técnica y reestructura de metadatos en 80 páginas de destino',
    stack: [],
    outcome: 'de posición 34 a 9 en «tours Bogotá»',
    service: 'seo-tecnico',
  },
  {
    id: 'lacteos-bajio',
    client: 'Distribuidora Lácteos del Bajío',
    sector: 'Manufactura de alimentos',
    country: 'MX',
    city: 'Querétaro',
    year: 2023,
    weeks: 5,
    kind: 'automatizacion',
    delivered:
      'Conciliación automática de facturas CFDI contra pedidos en ERP',
    stack: ['Python', 'Pandas'],
    service: 'automatizacion-ia',
  },
  {
    id: 'casa-alameda',
    client: 'Boutique Casa Alameda',
    sector: 'Retail de moda',
    country: 'MX',
    city: 'Puebla',
    year: 2021,
    weeks: 3,
    kind: 'sitio-web',
    delivered: 'Catálogo de 150 SKU con carrito y pasarela Stripe',
    stack: ['Next.js', 'Stripe'],
    service: 'desarrollo-web',
  },
  {
    id: 'patasverdes',
    client: 'Veterinaria PatasVerdes',
    sector: 'Servicios veterinarios',
    country: 'MX',
    city: 'Mérida',
    year: 2024,
    weeks: 2,
    kind: 'integracion',
    delivered:
      'Integración de agenda con WhatsApp Business API para confirmaciones',
    stack: [],
    outcome: 'de 22% a 61% de confirmaciones sin llamada',
    service: 'automatizacion-ia',
  },
  {
    id: 'loma-real',
    client: 'Constructora Loma Real',
    sector: 'Construcción y bienes raíces',
    country: 'MX',
    city: 'Tijuana',
    year: 2024,
    weeks: 7,
    kind: 'sitio-web',
    delivered: 'Sitio con tour virtual y formulario de apartado de lotes',
    stack: ['Next.js', 'Supabase'],
    service: 'desarrollo-web',
  },
  {
    id: 'codigo-abierto',
    client: 'Academia Código Abierto',
    sector: 'Educación en línea',
    country: 'AR',
    city: 'Buenos Aires',
    year: 2022,
    weeks: 5,
    kind: 'software-interno',
    delivered:
      'Plataforma de cursos con progreso, certificados y pagos recurrentes',
    stack: ['Next.js', 'Postgres', 'Stripe'],
    service: 'desarrollo-web',
  },
  {
    id: 'presta-facil',
    client: 'Fintech Presta Fácil',
    sector: 'Fintech y crédito',
    country: 'MX',
    city: 'Ciudad de México',
    year: 2024,
    weeks: 9,
    kind: 'dashboard',
    delivered:
      'Dashboard de riesgo crediticio con score en tiempo real para 4 analistas',
    stack: ['Python', 'FastAPI', 'Postgres'],
    outcome: 'de 2 horas a 8 minutos por evaluación de solicitud',
    service: 'dashboards',
  },
  {
    id: 'fuerzamx',
    client: 'Cadena de gimnasios FuerzaMX',
    sector: 'Fitness',
    country: 'MX',
    city: 'Monterrey',
    year: 2021,
    weeks: 4,
    kind: 'automatizacion',
    delivered:
      'Automatización de renovación de membresías y cobro recurrente',
    stack: ['Python', 'Stripe'],
    outcome: 'de 18% a 6% de bajas por cobro fallido',
    service: 'automatizacion-ia',
  },
  {
    id: 'farmacia-regional',
    client: 'Farmacia regional',
    anonymous: true,
    sector: 'Distribución farmacéutica',
    country: 'MX',
    city: 'Guadalajara',
    year: 2023,
    weeks: 6,
    kind: 'integracion',
    delivered:
      'Integración de punto de venta con sistema de inventario central',
    stack: ['Node.js', 'Postgres'],
    service: 'automatizacion-ia',
  },
  {
    id: 'costa-esmeralda',
    client: 'Hotel Boutique Costa Esmeralda',
    sector: 'Hotelería',
    country: 'MX',
    city: 'Puerto Vallarta',
    year: 2022,
    weeks: 3,
    kind: 'sitio-web',
    delivered: 'Sitio con motor de reservas directo, sin comisión de OTA',
    stack: ['Next.js', 'Supabase'],
    outcome: 'de 0% a 28% de reservas directas',
    service: 'desarrollo-web',
  },
  {
    id: 'vertice',
    client: 'Despacho de arquitectos Vértice',
    sector: 'Servicios profesionales',
    country: 'MX',
    city: 'Ciudad de México',
    year: 2021,
    weeks: 2,
    kind: 'seo',
    delivered:
      'Optimización on-page y velocidad de carga del sitio institucional',
    stack: [],
    outcome: 'de 6.8 s a 1.9 s de carga',
    service: 'seo-tecnico',
  },
  {
    id: 'valle-verde',
    client: 'Agroindustrial Valle Verde',
    sector: 'Agroindustria',
    country: 'MX',
    city: 'Querétaro',
    year: 2024,
    weeks: 5,
    kind: 'dashboard',
    delivered:
      'Dashboard de cosecha y logística de embarques para 3 plantas',
    stack: ['Next.js', 'Postgres', 'Recharts'],
    service: 'dashboards',
  },
  {
    id: 'piel-nueva',
    client: 'Clínica de estética Piel Nueva',
    sector: 'Salud y estética',
    country: 'CL',
    city: 'Santiago',
    year: 2023,
    weeks: 4,
    kind: 'sitio-web',
    delivered: 'Sitio con agenda online y galería de antes y después',
    stack: ['Next.js', 'Supabase'],
    service: 'desarrollo-web',
  },
  {
    id: 'transnorte',
    client: 'Logística Transnorte',
    sector: 'Logística y transporte',
    country: 'MX',
    city: 'Monterrey',
    year: 2022,
    weeks: 6,
    kind: 'software-interno',
    delivered:
      'Sistema de rastreo de flota con geocercas y alertas de retraso',
    stack: ['Next.js', 'Postgres', 'Mapbox'],
    outcome: 'de 40 min a 5 min en respuesta a reclamos',
    service: 'desarrollo-web',
  },
  {
    id: 'contadores-centro',
    client: 'Contadores Asociados del Centro',
    sector: 'Servicios profesionales',
    country: 'MX',
    city: 'León',
    year: 2024,
    weeks: 3,
    kind: 'automatizacion',
    delivered:
      'Lector de CFDI que concilia contra el estado de cuenta bancario',
    stack: ['Python', 'Pandas'],
    service: 'automatizacion-ia',
  },
]

/* ── CUENTAS, TODAS DEL DATO ────────────────────────────────────
   Ninguna cifra de la página va escrita a mano: con un encargo nuevo, todas
   se mueven solas. */

export const ENGAGEMENT_COUNT = ENGAGEMENTS.length

/** Semanas entregadas en total. */
export const ENGAGEMENT_WEEKS = ENGAGEMENTS.reduce((n, e) => n + e.weeks, 0)

/** Países distintos, para la lectura del margen. */
export const ENGAGEMENT_COUNTRIES = new Set(ENGAGEMENTS.map((e) => e.country))
  .size

/** El rango de años que cubre el registro. */
export const ENGAGEMENT_YEARS = {
  from: Math.min(...ENGAGEMENTS.map((e) => e.year)),
  to: Math.max(...ENGAGEMENTS.map((e) => e.year)),
}

/** Cuántos por tipo, en orden descendente. Alimenta la leyenda del margen. */
export function engagementsByKind(): { kind: EngagementKind; count: number }[] {
  const counts = new Map<EngagementKind, number>()
  for (const e of ENGAGEMENTS) counts.set(e.kind, (counts.get(e.kind) ?? 0) + 1)
  return [...counts.entries()]
    .map(([kind, count]) => ({ kind, count }))
    .sort((a, b) => b.count - a.count)
}

/** Los encargos de un servicio, para el enlazado interno de esa página. */
export function engagementsForService(
  service: EngagementService
): readonly Engagement[] {
  return ENGAGEMENTS.filter((e) => e.service === service)
}

/** Cuántos traen resultado medido. Es la cifra honesta: nueve de dieciocho. */
export const ENGAGEMENTS_MEASURED = ENGAGEMENTS.filter((e) => e.outcome).length
