/**
 * ════════════════════════════════════════════════════════════════
 * REGISTRO DE MEDIOS — dónde va cada imagen, video y fondo
 *
 * Fuente única de verdad. La usan dos cosas a la vez:
 *
 *   1. El componente `<MediaSlot>`, que dibuja el hueco marcado en la
 *      página con la ruta exacta del archivo que falta.
 *   2. `npm run media:manifest`, que genera `docs/MEDIA.md` — la lista
 *      que se le entrega al dueño para que sepa qué mandar, en qué
 *      formato y a dónde va.
 *
 * Así el documento NO puede mentir: se genera del mismo dato que pinta
 * la página. Si se agrega un hueco aquí, aparece en los dos lados.
 *
 * ── CÓMO SE LLENA UN HUECO ──
 * Se pone el archivo en la ruta indicada dentro de `public/` y se cambia
 * `filled: false` a `true`. El hueco desaparece y la imagen entra sin que
 * el layout se mueva ni un píxel, porque la relación de aspecto ya está
 * reservada.
 * ════════════════════════════════════════════════════════════════
 */

export type MediaKind = 'image' | 'video' | 'loop'
export type MediaPriority = 'alta' | 'media' | 'baja'

export interface MediaSlot {
  /** Identificador estable. Se usa como React key y en el manifiesto. */
  id: string
  /** Qué tipo de archivo va aquí. */
  kind: MediaKind
  /** Ruta destino dentro de `public/`, con barra inicial y en kebab-case. */
  path: string
  /** Ancho y alto nativos que se esperan, en px. Reservan el espacio. */
  width: number
  height: number
  /** Ruta de la página donde aparece, en español. */
  page: string
  /** Dónde exactamente dentro de la página. */
  where: string
  /** Qué tiene que ser. Escrito para quien va a conseguir el archivo. */
  what: string
  /** Texto alternativo. Obligatorio: sin esto la imagen no es accesible ni indexable. */
  alt: string
  /** Cuánto importa. `alta` = la página se ve incompleta sin esto. */
  priority: MediaPriority
  /** `true` cuando el archivo ya existe en `public/`. */
  filled: boolean
  /** Nota extra: encuadre, duración, qué evitar. */
  notes?: string
}

/**
 * Los slots, agrupados por página en el orden en que aparecen.
 *
 * Las dimensiones no son arbitrarias: son el tamaño al que el sitio sirve
 * cada imagen, así que un archivo más chico se ve suave y uno mucho más
 * grande solo pesa de más.
 */
export const MEDIA_SLOTS: readonly MediaSlot[] = [
  /* ── HOME ─────────────────────────────────────────────────── */
  {
    id: 'home-hero-loop',
    kind: 'loop',
    path: '/media/home/aguja-registrador.webm',
    width: 1920,
    height: 1080,
    page: '/es',
    where: 'Fondo del héroe, detrás del titular',
    what: 'Loop de 8 a 12 segundos, sin audio y sin cortes visibles, de una aguja de registrador (sismógrafo, electrocardiógrafo o registrador de gráficos) escribiendo sobre papel en movimiento. Plano cerrado sobre la pluma. Muy poco contraste: va detrás de texto.',
    alt: 'Aguja de un registrador escribiendo sobre papel continuo',
    priority: 'alta',
    filled: false,
    notes:
      'WebM VP9 con MP4 H.264 de respaldo. Menos de 2 MB. Sin logotipos ni marcas de agua. Si no se consigue video real, sirve una animación abstracta de una línea trazándose.',
  },
  {
    id: 'home-portrait',
    kind: 'image',
    path: '/carlos-anaya-ruiz.jpg',
    width: 2400,
    height: 3000,
    page: '/es',
    where: 'Sección «El operador»',
    what: 'Retrato de medio cuerpo sobre fondo liso (papel de fondo gris medio o blanco), luz pareja, sin fondo de oficina. Ropa lisa oscura, sin logotipos ni rayas finas.',
    alt: 'Carlos Anaya Ruiz, consultor SEO técnico y desarrollador full-stack en Ciudad de México',
    priority: 'alta',
    filled: true,
    notes:
      'YA EXISTE pero a 800×800 con fondo de oficina desenfocado. Funciona con el duotono de media tinta, pero una sesión nueva es la mejora de mayor impacto de todo el sitio. Las rayas finas vibran con la trama de impresión.',
  },

  /* ── PROYECTOS ────────────────────────────────────────────
     Cuatro archivos por proyecto, que es EXACTAMENTE lo que la ficha
     renderiza: el logo y tres capturas. El registro y la página tienen
     que coincidir o el manifiesto pide archivos que no van a ningún
     lado, o peor, deja huecos sin pedir. */
  ...(
    [
      ['amazon', 'Amazon'],
      ['master-loyalty-group', 'Master Loyalty Group'],
      ['wan-hai-lines', 'Wan Hai Lines'],
      ['aurascope', 'AuraScope'],
      ['logiroute-ai', 'LogiRoute AI'],
    ] as const
  ).flatMap(([slug, name]) => [
    {
      id: `proyecto-${slug}-logo`,
      kind: 'image' as const,
      path: `/logos/${slug}.png`,
      width: 400,
      height: 400,
      page: `/es/proyectos/${slug}`,
      where: 'Arriba de la ficha, antes del título',
      what: `Logotipo de ${name} en PNG con fondo transparente, cuadrado. Si es un logo horizontal, céntralo en un lienzo cuadrado con aire.`,
      alt: `Logotipo de ${name}`,
      priority: 'media' as const,
      filled: false,
      notes: 'Versión clara: va sobre fondo hollín. Si solo tienes la oscura, dilo y la invierto.',
    },
    {
      id: `proyecto-${slug}-captura-1`,
      kind: 'image' as const,
      path: `/proyectos/${slug}/captura-1.png`,
      width: 1200,
      height: 750,
      page: `/es/proyectos/${slug}`,
      where: 'Galería de la ficha · también es la portada en el índice',
      what: `Captura principal del trabajo de ${name}: la pantalla o el entregable más representativo. Navegador sin barras del sistema.`,
      alt: `Captura principal del trabajo realizado para ${name}`,
      priority: 'alta' as const,
      filled: false,
      notes: 'Es la que se ve en /es/proyectos, así que es la que más importa de las tres.',
    },
    {
      id: `proyecto-${slug}-captura-2`,
      kind: 'image' as const,
      path: `/proyectos/${slug}/captura-2.png`,
      width: 1200,
      height: 750,
      page: `/es/proyectos/${slug}`,
      where: 'Galería de la ficha',
      what: `Detalle del trabajo de ${name}: una vista secundaria, un panel, una pantalla interna.`,
      alt: `Detalle del trabajo realizado para ${name}`,
      priority: 'baja' as const,
      filled: false,
    },
    {
      id: `proyecto-${slug}-captura-3`,
      kind: 'image' as const,
      path: `/proyectos/${slug}/captura-3.png`,
      width: 1200,
      height: 750,
      page: `/es/proyectos/${slug}`,
      where: 'Galería de la ficha',
      what: `Resultado medible de ${name}: una gráfica de tráfico, un reporte de Core Web Vitals, un antes y después.`,
      alt: `Resultado obtenido para ${name}`,
      priority: 'media' as const,
      filled: false,
      notes: 'Si hay NDA, difumina cifras y nombres antes de mandarla.',
    },
  ]),

  /* ── PÁGINAS DE SERVICIO ──────────────────────────────────── */
  {
    id: 'seo-tecnico-evidencia',
    kind: 'image',
    path: '/media/servicios/seo-tecnico-antes-despues.png',
    width: 1600,
    height: 900,
    page: '/es/seo-tecnico',
    where: 'Sección de resultados',
    what: 'Captura de Search Console o de un informe de Core Web Vitals mostrando una mejora real, con el eje de tiempo visible. Es la prueba del servicio.',
    alt: 'Informe de Core Web Vitals mostrando la mejora tras una auditoría técnica',
    priority: 'alta',
    filled: false,
    notes: 'Puedes tapar el nombre del dominio. Lo que importa es la curva.',
  },
  {
    id: 'desarrollo-web-evidencia',
    kind: 'image',
    path: '/media/servicios/desarrollo-web.png',
    width: 1600,
    height: 900,
    page: '/es/desarrollo-web',
    where: 'Sección de alcance',
    what: 'Captura de una aplicación Next.js construida por ti, en uso. Preferible con datos reales pero anonimizados.',
    alt: 'Aplicación web construida con Next.js en funcionamiento',
    priority: 'media',
    filled: false,
  },
  {
    id: 'automatizacion-ia-evidencia',
    kind: 'image',
    path: '/media/servicios/automatizacion-flujo.png',
    width: 1600,
    height: 900,
    page: '/es/automatizacion-ia',
    where: 'Sección de alcance',
    what: 'Captura de un flujo de automatización real (n8n, Make, o el diagrama de un agente) o de un chatbot respondiendo.',
    alt: 'Flujo de automatización con IA en funcionamiento',
    priority: 'media',
    filled: false,
  },
  {
    id: 'dashboards-evidencia',
    kind: 'image',
    path: '/media/servicios/dashboard.png',
    width: 1600,
    height: 900,
    page: '/es/dashboards',
    where: 'Sección de alcance',
    what: 'Captura de un dashboard que hayas construido. Que se vean gráficas reales, no datos de ejemplo genéricos.',
    alt: 'Dashboard de datos construido a medida',
    priority: 'media',
    filled: false,
  },

  /* ── TRAYECTORIA ──────────────────────────────────────────── */
  {
    id: 'sobre-mi-trabajo',
    kind: 'image',
    path: '/media/sobre-mi/trabajando.jpg',
    width: 2000,
    height: 1333,
    page: '/es/sobre-mi',
    where: 'Cuerpo de la página',
    what: 'Foto tuya trabajando, de perfil o tres cuartos, con la laptop. Luz natural. No pose de stock.',
    alt: 'Carlos Anaya Ruiz trabajando en una auditoría técnica',
    priority: 'media',
    filled: false,
    notes: 'De la misma sesión que el retrato del héroe.',
  },
  {
    id: 'premios-diplomas',
    kind: 'image',
    path: '/media/premios/diploma-{slug}.jpg',
    width: 1400,
    height: 990,
    page: '/es/premios',
    where: 'Una por cada premio de la lista',
    what: 'Foto o escaneo del diploma o reconocimiento. Recto, bien iluminado, sin sombra de la mano.',
    alt: 'Diploma del reconocimiento',
    priority: 'baja',
    filled: false,
    notes:
      'Hay 7 premios en data/awards.ts. Manda las que tengas; las que falten simplemente no muestran hueco.',
  },
  {
    id: 'certificaciones-constancias',
    kind: 'image',
    path: '/media/certificaciones/{slug}.jpg',
    width: 1400,
    height: 990,
    page: '/es/certificaciones',
    where: 'Una por cada certificación',
    what: 'Constancia o certificado. El PMP y el TOEFL son los que más pesan comercialmente.',
    alt: 'Certificación profesional',
    priority: 'baja',
    filled: false,
    notes: 'Tapa el número de folio si prefieres.',
  },
  {
    id: 'libros-portadas',
    kind: 'image',
    path: '/media/libros/{slug}.jpg',
    width: 800,
    height: 1200,
    page: '/es/libros',
    where: 'Una por cada libro',
    what: 'Portada del libro. Si son tuyos, el arte final; si son recomendaciones, la portada oficial.',
    alt: 'Portada del libro',
    priority: 'baja',
    filled: false,
    notes: 'Hay 6 libros en data/books.ts.',
  },
] as const

/** Los slots de una página concreta, en orden. */
export function slotsForPage(page: string): MediaSlot[] {
  return MEDIA_SLOTS.filter((s) => s.page === page)
}

/** Un slot por id. Devuelve `undefined` si no existe, nunca lanza. */
export function slotById(id: string): MediaSlot | undefined {
  return MEDIA_SLOTS.find((s) => s.id === id)
}

/** Lo que falta, ordenado por prioridad. Alimenta el manifiesto. */
export function pendingSlots(): MediaSlot[] {
  const rank: Record<MediaPriority, number> = { alta: 0, media: 1, baja: 2 }
  return MEDIA_SLOTS.filter((s) => !s.filled).sort(
    (a, b) => rank[a.priority] - rank[b.priority]
  )
}
