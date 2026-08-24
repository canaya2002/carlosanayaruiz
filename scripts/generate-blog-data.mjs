/**
 * ════════════════════════════════════════════════════════════════
 * blog:data — genera data/blog.ts desde content/blog/*.md
 *
 * La FUENTE es el markdown. Este archivo deriva el registro que leen el
 * índice, el sitemap, el RSS, el schema y el cron del boletín, y lo deja
 * commiteado para que nada tenga que recorrer el disco en tiempo de
 * ejecución. Es el mismo patrón que `media:manifest`: un dato, un
 * generador, cero posibilidad de que la lista y las páginas discrepen.
 *
 *   npm run blog:data
 *
 * ── EL CALENDARIO ──────────────────────────────────────────────
 * Un artículo cada MARTES y cada VIERNES a las 14:00 UTC, que son las 8:00
 * de la mañana en Ciudad de México. Los 100 salen en 50 semanas.
 *
 * Las fechas son ABSOLUTAS, no relativas al despliegue, y eso es
 * deliberado: si el sitio se publica una semana más tarde, los artículos
 * cuya fecha ya pasó aparecen solos en el primer despliegue en vez de
 * empezar la cuenta desde cero. El calendario es un hecho del contenido,
 * no del deploy.
 *
 * ⚠ NO cambies SCHEDULE_START después de publicar. Movería la fecha de
 *   todos los artículos ya indexados, y una URL que cambia su
 *   `datePublished` le dice a Google que el contenido es otro.
 * ════════════════════════════════════════════════════════════════
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'

const DIR = 'content/blog'
const OUT = 'data/blog.ts'

/** Primer martes de la serie. Ver la advertencia de arriba. */
const SCHEDULE_START = '2026-08-25'
/** 14:00 UTC = 08:00 en Ciudad de México (UTC−6). */
const PUBLISH_HOUR_UTC = 14

/**
 * Los diez clústeres del índice maestro, con el artículo donde empieza cada
 * uno. Los límites son los `tipo: pillar` del propio contenido, así que no
 * hay una lista de rangos escrita a mano que pueda quedar desfasada.
 *
 * El «acento» es el color que el prompt de portada pide para ese clúster. NO
 * entra en la interfaz: este sistema tiene seis materiales y el minio es
 * semántico. El color vive en la imagen y nada más.
 */
const CLUSTERS = [
  { from: 1, name: 'IA aplicada a negocios', accent: 'violeta eléctrico' },
  { from: 11, name: 'Ciberseguridad', accent: 'cian sobre rojo alerta' },
  { from: 23, name: 'Desarrollo full-stack moderno', accent: 'verde terminal' },
  { from: 35, name: 'Automatización e IA agéntica', accent: 'ámbar' },
  { from: 45, name: 'SEO, GEO y AEO', accent: 'naranja' },
  { from: 55, name: 'Cloud, DevOps y costos', accent: 'azul profundo' },
  { from: 65, name: 'Construir y monetizar SaaS', accent: 'magenta' },
  { from: 75, name: 'Privacidad, cumplimiento y regulación', accent: 'dorado' },
  { from: 83, name: 'El stack del desarrollador independiente', accent: 'verde azulado' },
  { from: 91, name: 'Tendencias y futuro', accent: 'iridiscente' },
]

/** Martes y viernes consecutivos desde SCHEDULE_START, en UTC. */
function slot(index) {
  const start = new Date(`${SCHEDULE_START}T00:00:00Z`)
  const week = Math.floor(index / 2)
  // 0 → martes de esa semana · 1 → viernes (tres días después)
  const offset = week * 7 + (index % 2 === 0 ? 0 : 3)
  const d = new Date(start.getTime() + offset * 86400000)
  d.setUTCHours(PUBLISH_HOUR_UTC, 0, 0, 0)
  return d.toISOString().replace('.000Z', 'Z')
}

function clusterOf(n) {
  let hit = CLUSTERS[0]
  for (const c of CLUSTERS) if (n >= c.from) hit = c
  return hit
}

const files = readdirSync(DIR)
  .filter((f) => f.endsWith('.md'))
  .sort()

const posts = []
for (const file of files) {
  const raw = readFileSync(`${DIR}/${file}`, 'utf8')
  const m = raw.match(/^---\n([\s\S]*?)\n---\n/)
  if (!m) throw new Error(`${file}: sin frontmatter`)

  const fm = {}
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':')
    if (i < 0) continue
    const key = line.slice(0, i).trim()
    const val = line.slice(i + 1).trim()
    fm[key] = val.startsWith('[') || val.startsWith('"') ? JSON.parse(val) : val
  }

  const body = raw.slice(m[0].length)
  const words = body.split(/\s+/).filter(Boolean).length

  posts.push({
    n: Number(fm.n),
    slug: fm.slug,
    title: fm.title,
    description: fm.description,
    category: fm.category,
    keyword: fm.keyword,
    tipo: fm.tipo,
    tags: fm.tags,
    file,
    words,
    // 200 palabras por minuto es el ritmo de lectura en español para prosa
    // técnica. Se redondea hacia arriba: «1 min» en algo de 900 palabras
    // sería una promesa que el texto no cumple.
    readingMinutes: Math.max(1, Math.round(words / 200)),
  })
}

posts.sort((a, b) => a.n - b.n)

if (posts.length !== 100) {
  console.error(`se esperaban 100 artículos y hay ${posts.length}`)
  process.exit(1)
}

/* ── Portadas ────────────────────────────────────────────────────
   `data/blog-covers.json` lo produce el emparejado de imágenes. Mientras un
   artículo no tenga portada, la página se dibuja sin ella — igual que un
   hueco de medio sin archivo: un renglón, nunca una caja vacía. */
let covers = {}
try {
  covers = JSON.parse(readFileSync('data/blog-covers.json', 'utf8'))
} catch {
  console.warn('  (sin data/blog-covers.json: los artículos van sin portada)')
}

const lines = posts.map((p, i) => {
  const c = clusterOf(p.n)
  const cover = covers[String(p.n)]
  return `  {
    n: ${p.n},
    slug: ${JSON.stringify(p.slug)},
    title: ${JSON.stringify(p.title)},
    description: ${JSON.stringify(p.description)},
    category: ${JSON.stringify(p.category)},
    cluster: ${JSON.stringify(c.name)},
    keyword: ${JSON.stringify(p.keyword)},
    tipo: ${JSON.stringify(p.tipo)},
    tags: ${JSON.stringify(p.tags)},
    publishedAt: ${JSON.stringify(slot(i))},
    file: ${JSON.stringify(p.file)},
    words: ${p.words},
    readingMinutes: ${p.readingMinutes},${
      cover
        ? `
    cover: ${JSON.stringify(cover.src)},
    coverAlt: ${JSON.stringify(cover.alt)},`
        : ''
    }
  },`
})

const header = `/**
 * ════════════════════════════════════════════════════════════════
 * ARCHIVO GENERADO — no lo edites a mano.
 *
 *   npm run blog:data
 *
 * La fuente es content/blog/*.md. Esto es el registro derivado que leen el
 * índice, el sitemap, el RSS, el schema y el cron del boletín.
 *
 * ── EL CALENDARIO ──
 * Un artículo cada martes y cada viernes a las 14:00 UTC (08:00 en Ciudad de
 * México). Los 100 cubren 50 semanas: del ${slot(0).slice(0, 10)} al ${slot(99).slice(0, 10)}.
 *
 * Las fechas son ABSOLUTAS. Un artículo aparece cuando su fecha llega, no
 * cuando se despliega, así que retrasar el despliegue no retrasa la serie:
 * los que ya vencieron salen juntos en el primer despliegue.
 *
 * ⚠ Mover el inicio del calendario cambiaría el \`datePublished\` de URLs ya
 *   indexadas, y eso le dice a Google que el contenido es otro. No se mueve.
 * ════════════════════════════════════════════════════════════════
 */

export interface BlogPost {
  /** Número del artículo en el índice maestro, 1–100. Es su orden de salida. */
  n: number
  slug: string
  title: string
  description: string
  /** Categoría del frontmatter: 12 valores. */
  category: string
  /** Clúster del índice maestro: 10 valores, cada uno con su pillar. */
  cluster: string
  /** La única keyword por la que compite esta URL. Nunca se repite. */
  keyword: string
  tipo: 'pillar' | 'satelite'
  tags: readonly string[]
  /** ISO con hora, en UTC. */
  publishedAt: string
  /** Nombre del .md en content/blog/. */
  file: string
  words: number
  readingMinutes: number
  /** Ruta bajo /public. Ausente mientras no haya archivo. */
  cover?: string
  coverAlt?: string
}

export const BLOG_POSTS: readonly BlogPost[] = [
${lines.join('\n')}
] as const

/** Los diez clústeres, en el orden en que salen. */
export const BLOG_CLUSTERS = ${JSON.stringify(
  CLUSTERS.map((c) => c.name),
  null,
  2
)} as const
`

writeFileSync(OUT, header)

const withCover = posts.filter((p) => covers[String(p.n)]).length
console.log(`  ${OUT}`)
console.log(`    artículos:  ${posts.length}`)
console.log(`    calendario: ${slot(0)} → ${slot(99)}`)
console.log(`    portadas:   ${withCover}/100`)
console.log(`    palabras:   ${posts.reduce((s, p) => s + p.words, 0).toLocaleString('es-MX')}`)
