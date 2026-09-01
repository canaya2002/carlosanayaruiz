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
    where: 'Fondo del héroe, detrás del titular — YA RESUELTO EN CSS',
    what: 'Loop de 8 a 12 segundos, sin audio y sin cortes visibles, de una aguja de registrador (sismógrafo, electrocardiógrafo o registrador de gráficos) escribiendo sobre papel en movimiento. Plano cerrado sobre la pluma. Muy poco contraste: va detrás de texto.',
    alt: 'Aguja de un registrador escribiendo sobre papel continuo',
    priority: 'baja',
    filled: false,
    notes:
      'YA NO HACE FALTA, y bajó de prioridad alta a baja por eso. El fondo del héroe lo pinta ahora `.drum-field` en CSS —la retícula del papel de registro y la curvatura del tambor, que además derivan con el scroll— y pesa cero. El hueco marcado que esperaba este archivo era una caja de cuatrocientos píxeles de nada, o sea el mismo «espacio vacío enorme» que se vino a arreglar. Este registro se conserva porque el video sigue siendo una mejora posible, no un pendiente: si algún día llega, entra detrás del titular y el CSS se apaga. WebM VP9 con MP4 H.264 de respaldo, menos de 2 MB, sin logotipos.',
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

  /* ── PROYECTOS · SIN HUECOS, Y ES DECISIÓN DEL DUEÑO ──────
     Aquí se generaban 20 registros —un logo y tres capturas por cada una de
     las cinco entradas de `data/companies.ts`— y todos se retiraron.

     LAS CAPTURAS: el dueño no puede compartirlas. Amazon, Master Loyalty Group
     y Wan Hai Lines son empleos, y las pantallas de sistemas internos de un
     empleador no son suyas para publicar. Pedirlas en `docs/MEDIA.md` era
     pedirle algo que no va a llegar nunca, y mientras tanto la ficha de cada
     empresa imprimía «Captura 1 de Amazon», «Captura 2», «Captura 3» — vacías,
     justo debajo del aviso de que no había capturas.

     LOS LOGOS: además de que tampoco los tiene, un logotipo de Amazon o de Wan
     Hai es MARCA REGISTRADA y ponerlo en una página comercial propia insinúa
     endoso. El nombre en texto no; el logo sí. Por eso no vuelven aunque
     lleguen los archivos.

     ⚠ CUANDO LLEGUEN LOS PROYECTOS PROPIOS, aquí es donde vuelven — pero solo
     los propios (AuraScope, LogiRoute y lo que venga), porque de esos las
     capturas sí son suyas. La forma que había era correcta: un `flatMap` sobre
     los slugs generando `proyecto-{slug}-captura-{n}`, que es exactamente lo
     que `/proyectos/[slug]` monta. */

  /* ── PÁGINAS DE SERVICIO ──────────────────────────────────── */
  {
    id: 'seo-tecnico-evidencia',
    kind: 'image',
    path: '/evidencia/core-web-vitals-urls-buenas-search-console-carlos-anaya-ruiz.webp',
    width: 1592,
    height: 1088,
    page: '/es/seo-tecnico',
    where: 'Sección de resultados — YA RESUELTO por `data/evidence.ts`',
    what: 'LLENADO. Informe de Core Web Vitals de Google Search Console para manuelsolis.com en escritorio: 133 URLs buenas al 30 ago 2026, subiendo desde el nivel de 60 el 2 de junio, con la fuente declarada como Chrome UX Report.',
    alt: 'Informe de Core Web Vitals de Google Search Console con 133 URLs buenas en escritorio',
    priority: 'alta',
    filled: true,
    notes:
      'Ya NO lo pinta `<MediaSlot>`: lo pinta `<Evidence>`, porque una captura de instrumento necesita dos cosas que este registro no sabe dar — la lectura en TEXTO (un buscador no lee los píxeles de una gráfica) y la declaración de qué propiedad es. El dato vive en `data/evidence.ts`. Este registro se conserva para que `docs/MEDIA.md` no lo siga pidiendo.',
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
    what: 'Captura de un chatbot o de un agente respondiendo, o del diagrama del flujo en la herramienta que sea. Sin n8n: el dueño lo descartó explícitamente y pedirlo por nombre en el documento de encargo era pedir una herramienta concreta en vez de la prueba.',
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
    id: 'premios-diplomas',
    kind: 'image',
    path: '/credenciales/certificado-nasa-space-apps-galactic-problem-solver-carlos-anaya-ruiz.webp',
    width: 1600,
    height: 900,
    page: '/es/premios',
    where: 'La fila del NASA Space Apps',
    what: 'LLENADO. Certificado «Galactic Problem Solver» del NASA International Space Apps Challenge 2024, con la cita literal y la firma de Dr. Keith Gaddis. Transcrito en docs/CREDENCIALES.md.',
    alt: 'Certificado Galactic Problem Solver del NASA International Space Apps Challenge 2024 otorgado a Carlos Anaya Ruiz',
    priority: 'alta',
    filled: true,
    notes:
      'De los tres registros de data/awards.ts, este es el único con documento. El hackathon de 2022 y el TOEFL siguen sin diploma: si llegan, se añaden como huecos propios en vez de reabrir este.',
  },
  {
    id: 'certificaciones-constancias',
    kind: 'image',
    path: '/credenciales/certificado-full-stack-web-development-bootcamp-carlos-anaya-ruiz.webp',
    width: 1288,
    height: 958,
    page: '/es/certificaciones',
    where: 'La sección de cursos',
    what: 'LLENADO con 10 certificados de Udemy (265.5 h), 7 de ellos con número de folio y URL de verificación pública. Los once documentos están transcritos en docs/CREDENCIALES.md.',
    alt: 'Certificado de Udemy del bootcamp completo de desarrollo web full-stack, 61.5 horas, a nombre de Carlos Anaya Ruiz',
    priority: 'alta',
    filled: true,
    notes:
      'NO tapes el folio: es lo que hace verificable la fila, y es justo lo que la página promete en su h1. Tres llegaron a 488×363 (nextjs, pmp-exam-prep, scrum) y a ese tamaño no se pueden mostrar grandes: vuelve a exportarlas de Udemy y corre `npm run credenciales`. ⚠ El PMP de este lote es un CURSO DE PREPARACIÓN de 35 PDU, no la certificación del PMI.',
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

  /* ── SERVICIOS · LA PRUEBA DE CADA UNO ────────────────────────
     Un servicio sin una imagen de lo que produce se lee como una promesa.
     Estos cuatro son EL entregable de cada servicio, fotografiado. */
  {
    id: 'seo-tecnico-proceso',
    kind: 'image',
    path: '/media/servicios/seo-tecnico-crawl.png',
    width: 1600,
    height: 900,
    page: '/es/seo-tecnico',
    where: 'Sección «Cómo se ejecuta el trabajo», junto a la fase 1',
    what: 'Captura de Screaming Frog o Sitebulb a mitad de un crawl real: el árbol de URLs, los códigos de estado y los avisos a la vista. Que se vea el volumen —miles de filas—, porque eso es lo que dice que el trabajo es de verdad.',
    alt: 'Crawl técnico de un sitio en curso, con códigos de estado y avisos',
    priority: 'alta',
    filled: false,
    notes:
      'Tapa el dominio del cliente si hace falta; lo que importa es la estructura y el volumen, no de quién es.',
  },
  {
    id: 'seo-tecnico-schema',
    kind: 'image',
    path: '/media/servicios/seo-tecnico-schema.png',
    width: 1400,
    height: 900,
    page: '/es/seo-tecnico',
    where: 'Sección de alcance, junto a datos estructurados',
    what: 'Captura de la prueba de resultados enriquecidos de Google con un JSON-LD válido y el rich result renderizado al lado. Que se vean las dos mitades: el código y lo que Google entiende de él.',
    alt: 'Prueba de resultados enriquecidos con datos estructurados válidos',
    priority: 'media',
    filled: false,
  },
  {
    id: 'desarrollo-web-lighthouse',
    kind: 'image',
    path: '/media/servicios/desarrollo-web-lighthouse.png',
    width: 1400,
    height: 900,
    page: '/es/desarrollo-web',
    where: 'Sección de resultados',
    what: 'Informe de Lighthouse de un sitio tuyo en producción, con los cuatro círculos a la vista. Que sea REAL: un 100 de laboratorio en un sitio vacío no prueba nada, un 95 en un sitio con contenido sí.',
    alt: 'Informe de Lighthouse de un sitio en producción',
    priority: 'alta',
    filled: false,
    notes:
      'Mejor de PageSpeed Insights con datos de campo (CrUX) que de laboratorio: el dato de campo es el que no se puede maquillar.',
  },
  {
    id: 'desarrollo-web-codigo',
    kind: 'image',
    path: '/media/servicios/desarrollo-web-pr.png',
    width: 1600,
    height: 1000,
    page: '/es/desarrollo-web',
    where: 'Sección «Cómo trabajo», junto a la parte de PRs',
    what: 'Captura de un pull request real tuyo en GitHub: el diff, la descripción y una revisión aprobada. Es la prueba de que el trabajo se entrega revisable y no como un ZIP.',
    alt: 'Pull request revisado y aprobado en GitHub',
    priority: 'media',
    filled: false,
    notes: 'Puede ser de un repo propio. Tapa nombres de terceros si aplica.',
  },
  {
    id: 'automatizacion-ia-chat',
    kind: 'image',
    path: '/media/servicios/automatizacion-chat.png',
    width: 1200,
    height: 1000,
    page: '/es/automatizacion-ia',
    where: 'Sección de alcance, junto a la parte de chatbots',
    what: 'Conversación real de un chatbot tuyo respondiendo algo específico del negocio —no «hola, ¿en qué puedo ayudarte?»—. Tres o cuatro turnos, con una respuesta que solo puede dar quien tiene el contexto conectado.',
    alt: 'Chatbot respondiendo una consulta específica de negocio',
    priority: 'media',
    filled: false,
    notes: 'Anonimiza al usuario. Lo que se juzga es la RESPUESTA.',
  },
  {
    id: 'dashboards-vista',
    kind: 'image',
    path: '/media/servicios/dashboard-vista.png',
    width: 1600,
    height: 1000,
    page: '/es/dashboards',
    where: 'Sección de alcance',
    what: 'Un dashboard tuyo completo, con gráficas reales y filtros a la vista. Datos anonimizados pero PLAUSIBLES: cifras de ejemplo genéricas se notan y restan.',
    alt: 'Dashboard de datos construido a medida, con gráficas reales',
    priority: 'alta',
    filled: false,
  },
  {
    id: 'dashboards-modelo',
    kind: 'image',
    path: '/media/servicios/dashboard-modelo.png',
    width: 1400,
    height: 900,
    page: '/es/dashboards',
    where: 'Sección de alcance, junto a la parte de modelado',
    what: 'El modelo de datos detrás del tablero: el diagrama de relaciones de Power BI, o el esquema en dbt. Es lo que separa un tablero que aguanta de uno que se rompe al añadir una fuente.',
    alt: 'Modelo de datos con sus relaciones, detrás del dashboard',
    priority: 'baja',
    filled: false,
  },

  /* ── LA PORTADA · UNA SEGUNDA PRUEBA ──────────────────────────── */
  {
    id: 'home-evidencia',
    kind: 'image',
    path: '/evidencia/search-console-clics-impresiones-12-meses-carlos-anaya-ruiz.webp',
    width: 1592,
    height: 905,
    page: '/es',
    where: 'Sección «El registro», debajo de la gráfica de trayectoria — YA RESUELTO por `data/evidence.ts`',
    what: 'LLENADO, y era el archivo más importante de toda esta lista. Panel de rendimiento de Google Search Console para manuelsolis.com a 12 meses: 30.5K clics, 1.4M impresiones, 2.2% de CTR y posición media 11.5, con la curva subiendo en el último tercio del eje.',
    alt: 'Panel de rendimiento de Google Search Console a 12 meses con la curva de clics e impresiones subiendo',
    priority: 'alta',
    filled: true,
    notes:
      'Lo pinta `<Evidence>` y no `<MediaSlot>`. Ver la nota del hueco de /seo-tecnico: la lectura va en TEXTO en la placa de datos y la captura debajo como respaldo, porque una cifra que solo existe dentro de un WebP no la indexa nadie y a 375 px no se lee.',
  },

  /* ── SOBRE MÍ · LA SEGUNDA FOTO ───────────────────────────────── */

  /* ── CONTACTO · QUIÉN CONTESTA ────────────────────────────────── */
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

/**
 * ¿Hay archivo para AL MENOS UNO de estos huecos?
 *
 * Existe para que una SECCIÓN entera pueda no renderizarse. Las cuatro páginas
 * de servicio tenían un bloque rotulado «la prueba · pendiente de archivo» con
 * dos huecos dentro; desde que un hueco sin archivo no pinta nada, ese bloque
 * quedaba en un rótulo que anuncia un archivo que falta y una rejilla vacía —
 * exactamente lo que el dueño pidió quitar («sin nada ahí pendiente»).
 *
 * Un `<MediaSlot>` sabe si tiene archivo, pero no puede borrar a su padre. Esto
 * sí.
 */
export function anySlotFilled(...ids: string[]): boolean {
  return ids.some((id) => slotById(id)?.filled === true)
}
