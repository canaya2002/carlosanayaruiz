import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { BLOG_POSTS, type BlogPost } from '@/data/blog'
import { renderArticle, type RenderedArticle } from '@/lib/blog-render'
import { SITE_CONFIG, type RouteKey } from '@/lib/constants'

/**
 * ════════════════════════════════════════════════════════════════
 * EL BLOG — acceso a datos y publicación programada
 *
 * ── CÓMO APARECE UN ARTÍCULO EN SU FECHA ──
 * Las 100 páginas se generan en el build, pero cada una comprueba su propia
 * fecha al renderizarse: si `publishedAt` está en el futuro, la ruta responde
 * 404. Con `revalidate` puesto en la página, la respuesta se regenera
 * periódicamente, así que el 404 se convierte en la página publicada sin
 * necesidad de un despliegue.
 *
 * Es la única forma que no miente en ninguno de los dos sentidos:
 *
 *   · Generar solo las publicadas dejaría a las futuras fuera del build, y
 *     entonces dependerían de un redespliegue para existir.
 *   · Generar las 100 sin la comprobación de fecha las publicaría TODAS el
 *     primer día, que es exactamente lo contrario de un calendario.
 *
 * ── POR QUÉ EL 404 Y NO UNA PÁGINA «PRÓXIMAMENTE» ──
 * Una URL que devuelve 200 con un marcador de posición se indexa como
 * contenido pobre, y luego hay que pelear para que Google reemplace esa
 * versión por la real. Un 404 hasta la fecha y un 200 con el artículo
 * completo después es lo que produce una primera indexación limpia.
 *
 * ── EL RELOJ ──
 * Todo se compara en UTC contra `Date.now()`. Las fechas del calendario son
 * absolutas (14:00 UTC = 08:00 en Ciudad de México), así que no hay zona
 * horaria del servidor que pueda desplazar una publicación.
 * ════════════════════════════════════════════════════════════════
 */

/** ¿Ya salió? Comparación en UTC, sin excepciones. */
export function isPublished(post: BlogPost, now: number = Date.now()): boolean {
  return Date.parse(post.publishedAt) <= now
}

/** Los publicados, del más reciente al más antiguo. */
export function getPublishedPosts(now: number = Date.now()): BlogPost[] {
  return BLOG_POSTS.filter((p) => isPublished(p, now)).sort(
    (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)
  )
}

/** Todos, incluidos los que aún no salen. Para el build y para el cron. */
export function getAllPosts(): readonly BlogPost[] {
  return BLOG_POSTS
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug)
}

/**
 * El siguiente en salir, si queda alguno.
 *
 * El índice lo anuncia: un blog que dice cuándo es la próxima entrega da una
 * razón para volver, y el dato ya existe — no hay que inventarlo.
 */
export function getNextPost(now: number = Date.now()): BlogPost | undefined {
  return BLOG_POSTS.filter((p) => !isPublished(p, now)).sort(
    (a, b) => Date.parse(a.publishedAt) - Date.parse(b.publishedAt)
  )[0]
}

/**
 * Lee y renderiza el cuerpo.
 *
 * ⚠ `content/blog/**` tiene que estar en `outputFileTracingIncludes` de
 * next.config.ts. Sin eso los .md no viajan al bundle de servidor y las
 * páginas que se regeneran por ISR —o sea, todas las que se publican después
 * del build— fallarían al leer el archivo. Está declarado; no lo quites.
 */
export async function loadArticle(post: BlogPost): Promise<RenderedArticle> {
  const file = path.join(process.cwd(), 'content', 'blog', post.file)
  const raw = await readFile(file, 'utf8')
  const body = raw.replace(/^---\n[\s\S]*?\n---\n/, '')
  return renderArticle(body)
}

/**
 * ── ENLAZADO INTERNO ────────────────────────────────────────────
 * El índice maestro fija la regla: cada artículo enlaza a la pillar de su
 * clúster, a dos satélites hermanos y a uno de otro clúster. El contenido
 * llegó SIN un solo enlace markdown en el cuerpo, así que esos enlaces se
 * construyen aquí, con el dato, en vez de inyectarlos en la prosa.
 *
 * Dos razones para hacerlo así y no a mano dentro del texto:
 *
 *   1. Un enlace en prosa a un artículo que todavía no salió es un 404. Aquí
 *      se filtra por publicados, así que la red de enlaces crece sola a
 *      medida que el calendario avanza y nunca apunta a nada roto.
 *   2. Los enlaces quedan en un bloque identificable al final, que es donde
 *      un lector los busca y donde un crawler los lee como relacionados.
 */
export function getRelated(post: BlogPost, now: number = Date.now()) {
  const published = getPublishedPosts(now).filter((p) => p.n !== post.n)

  const pillar =
    post.tipo === 'pillar'
      ? undefined
      : published.find((p) => p.cluster === post.cluster && p.tipo === 'pillar')

  const siblings = published
    .filter((p) => p.cluster === post.cluster && p.n !== pillar?.n)
    // El hermano más cercano en número es el más cercano en tema: el índice
    // maestro ordena cada clúster de lo general a lo específico.
    .sort((a, b) => Math.abs(a.n - post.n) - Math.abs(b.n - post.n))
    .slice(0, 2)

  const cross = published.find(
    (p) =>
      p.cluster !== post.cluster &&
      p.tipo === 'pillar' &&
      // Comparte al menos una etiqueta: un enlace entre clústeres solo vale
      // si hay una relación real, no por rellenar el hueco.
      p.tags.some((t) => post.tags.includes(t))
  )

  return {
    pillar,
    siblings,
    cross,
    all: [pillar, ...siblings, cross].filter(Boolean) as BlogPost[],
  }
}

/**
 * ════════════════════════════════════════════════════════════════
 * EL ENLAZADO ENTRE EL BLOG Y LAS PÁGINAS QUE FACTURAN
 *
 * Estado antes de esto, medido con `grep -rn "/blog" app components`: las
 * ÚNICAS referencias al blog eran el nav y el pie, las dos al índice, las dos
 * plantilla global. Cero enlaces contextuales desde la portada (prioridad 1.0),
 * desde /servicios (0.8) o desde las cuatro páginas de servicio (0.9). Y en la
 * dirección contraria, los 100 artículos solo salían a /contacto, /sobre-mi y
 * /blog: **las cuatro páginas que facturan no recibían nada de cien URLs
 * temáticas.**
 *
 * ── POR QUÉ UN MAPA CON CLÚSTERES *Y* ETIQUETAS ──
 * Un `Record<cluster, RouteKey>` de valor único no sirve: el clúster de cloud
 * reparte entre desarrollo (despliegue, IaC, Kubernetes) y dashboards
 * (observabilidad, costos), y hay artículos de observabilidad y de medición en
 * clústeres que no son el de cloud. El cruce por etiqueta es lo que permite
 * que «Observabilidad», «factura de AWS» y «Métricas SaaS» acaben todos en
 * /dashboards aunque vivan en tres clústeres distintos.
 *
 * ── TRES CLÚSTERES NO RECIBEN ENLACE, Y ESO ES LA DECISIÓN ──
 * Ciberseguridad (12), Privacidad (8) y Tendencias (10) no tienen página
 * comercial que los reciba. Mandarlos a /sobre-mi serían treinta enlaces sin
 * relación temática: diluye y contradice la regla del repo de que marcar lo que
 * no es cierto es peor que no marcar. Su pillar ya es su hub, y
 * `routeForPost` devuelve `undefined` — la fila simplemente no se pinta, igual
 * que `ch c` no existe sin la clave de Cal.com.
 * ════════════════════════════════════════════════════════════════
 */
const ROUTE_TOPICS: Partial<
  Record<RouteKey, { clusters: readonly string[]; tags: readonly string[] }>
> = {
  seoTecnico: {
    clusters: ['SEO, GEO y AEO'],
    tags: ['seo', 'seo técnico', 'geo', 'schema', 'indexación', 'core web vitals', 'rendimiento'],
  },
  automatizacionIa: {
    clusters: ['IA aplicada a negocios', 'Automatización e IA agéntica'],
    tags: ['ia', 'inteligencia artificial', 'agentes', 'automatización', 'rag', 'arquitectura ia', 'costos ia'],
  },
  desarrolloWeb: {
    clusters: ['Desarrollo full-stack moderno', 'El stack del desarrollador independiente'],
    tags: ['next.js', 'arquitectura', 'despliegue', 'infraestructura', 'buenas prácticas'],
  },
  dashboards: {
    // Sin clúster propio a propósito: lo que va a /dashboards son los artículos
    // de medición y de costos, y esos están repartidos por todo el corpus.
    clusters: [],
    tags: ['costos', 'aws', 'optimización', 'observabilidad', 'monitoreo', 'métricas', 'medición', 'analítica', 'roi'],
  },
  proyectos: {
    clusters: ['Construir y monetizar SaaS'],
    tags: ['saas', 'producto', 'freelance'],
  },
  /**
   * El hub reparte a los cuatro servicios, así que le corresponden los cuatro
   * clústeres comerciales. Sin etiquetas: con el +1 de pillar, lo que sube son
   * las guías principales — que es exactamente lo que un hub debe mostrar.
   */
  services: {
    clusters: [
      'IA aplicada a negocios',
      'Automatización e IA agéntica',
      'Desarrollo full-stack moderno',
      'SEO, GEO y AEO',
    ],
    tags: [],
  },
}

/**
 * Los artículos publicados más relevantes para una página del sitio.
 *
 * Puntuación: clúster coincidente +2, cada etiqueta coincidente +1, pillar +1.
 * Empate → el más reciente. Devuelve `[]` si no hay nada publicado que encaje,
 * y eso pasa de verdad los primeros días: la guarda de lista vacía en quien lo
 * consume no es opcional.
 */
export function getPostsForRoute(
  key: RouteKey,
  limit = 3,
  now: number = Date.now()
): BlogPost[] {
  const tema = ROUTE_TOPICS[key]
  if (!tema) return []

  const tags = new Set(tema.tags)

  return getPublishedPosts(now)
    .map((post) => {
      let puntos = tema.clusters.includes(post.cluster) ? 2 : 0
      for (const t of post.tags) if (tags.has(t)) puntos += 1
      if (post.tipo === 'pillar') puntos += 1
      return { post, puntos }
    })
    .filter((x) => x.puntos > 0)
    .sort(
      (a, b) =>
        b.puntos - a.puntos ||
        Date.parse(b.post.publishedAt) - Date.parse(a.post.publishedAt)
    )
    .slice(0, limit)
    .map((x) => x.post)
}

/**
 * La inversa: a qué página de servicio pertenece un artículo.
 *
 * Es la pieza que convierte cien URLs de contenido en autoridad para las
 * páginas que facturan, y la única del plan de enlazado que rinde el día uno
 * —no depende de cuántos artículos haya publicados—. `undefined` cuando el
 * clúster no tiene destino comercial.
 */
export function routeForPost(post: BlogPost): RouteKey | undefined {
  let mejor: { key: RouteKey; puntos: number } | undefined

  for (const [k, tema] of Object.entries(ROUTE_TOPICS)) {
    if (!tema) continue
    const key = k as RouteKey
    let puntos = tema.clusters.includes(post.cluster) ? 2 : 0
    for (const t of post.tags) if (tema.tags.includes(t)) puntos += 1
    if (puntos > 0 && (!mejor || puntos > mejor.puntos)) mejor = { key, puntos }
  }

  return mejor?.key
}

/**
 * La ruta interna que `<Link>` acepta, para el destino comercial de un artículo.
 *
 * `routeForPost` devuelve una CLAVE de la tabla de rutas (`seoTecnico`), y los
 * helpers de navegación de next-intl esperan la ruta interna en español
 * (`/seo-tecnico`). El mapa es literal y no derivado de `ROUTES` a propósito:
 * así el tipo que sale es la unión estrecha que `<Link href>` acepta, y añadir
 * un destino nuevo sin darle su ruta no compila.
 */
const PATH_BY_ROUTE = {
  seoTecnico: '/seo-tecnico',
  desarrolloWeb: '/desarrollo-web',
  automatizacionIa: '/automatizacion-ia',
  dashboards: '/dashboards',
  proyectos: '/proyectos',
} as const satisfies Partial<Record<RouteKey, string>>

export function pathForPost(
  post: BlogPost
): (typeof PATH_BY_ROUTE)[keyof typeof PATH_BY_ROUTE] | undefined {
  const key = routeForPost(post)
  if (!key) return undefined
  return PATH_BY_ROUTE[key as keyof typeof PATH_BY_ROUTE]
}

/**
 * El anterior y el siguiente en el calendario, entre los publicados.
 *
 * Permite recorrer el archivo sin volver a un índice de cien entradas, y le da
 * al crawler un camino secuencial por todo el corpus.
 */
export function getNeighbours(post: BlogPost, now: number = Date.now()) {
  const publicados = BLOG_POSTS.filter((p) => isPublished(p, now)).sort(
    (a, b) => a.n - b.n
  )
  const i = publicados.findIndex((p) => p.n === post.n)
  if (i < 0) return { anterior: undefined, siguiente: undefined }
  return {
    anterior: i > 0 ? publicados[i - 1] : undefined,
    siguiente: i < publicados.length - 1 ? publicados[i + 1] : undefined,
  }
}

/** URL absoluta del artículo. El blog vive solo en español: ver la nota. */
export function postUrl(post: BlogPost): string {
  return `${SITE_CONFIG.url}/es/blog/${post.slug}`
}

export function blogUrl(): string {
  return `${SITE_CONFIG.url}/es/blog`
}

/**
 * ── POR QUÉ EL BLOG ES SOLO EN ESPAÑOL ──
 * Los 100 artículos están escritos en español para el mercado de México y
 * LATAM. Servir el mismo texto español bajo `/en/blog` y declararlo como
 * `en-US` en hreflang es un error que Search Console reporta, y traducir
 * 100 000 palabras no es una decisión de código.
 *
 * Así que `/en/blog*` redirige a `/es/blog*` con un 308 PERMANENTE
 * —consolidando la señal en una sola URL— y el hreflang de estas páginas
 * declara `es-MX` y `x-default`, sin `en-US`. Declarar un idioma que no existe
 * es peor que no declararlo.
 *
 * El 308 importa: con el 307 que había antes, Google sigue la redirección pero
 * NO la usa como señal de canonicalización, así que `/en/blog` se quedaba en el
 * índice como URL conocida sin consolidar. Y el hreflang del blog tampoco
 * bastaba: el middleware emitía una cabecera `Link` con `hreflang="en"` que
 * contradecía al HTML — ver `alternateLinks: false` en `i18n/routing.ts`.
 */
export const BLOG_LOCALE = 'es' as const

/** Fecha en el formato que se imprime en la página. */
export function formatPostDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
