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
 * ── LOS ARTÍCULOS NUEVOS: LUNES Y JUEVES, CON FECHA PROPIA ──
 * Un artículo con n > 100 no tiene sitio en la serie y DEBE declarar
 * `publishedAt` en su frontmatter (lunes o jueves, 14:00:00Z, posterior al
 * 2026-10-27, sin repetir ninguna fecha) y `cluster` (uno de los diez). Los
 * de la serie NO pueden llevar `publishedAt`: falla. La regla completa está
 * en `blog-schedule.mjs` y la prueba en `check-blog-dates.mjs`.
 *
 *   ---
 *   n: 101
 *   publishedAt: "2026-12-03T14:00:00Z"
 *   cluster: "SEO, GEO y AEO"
 *   ---
 *
 * ⚠ NO cambies SCHEDULE_START después de publicar. Movería la fecha de
 *   todos los artículos ya indexados, y una URL que cambia su
 *   `datePublished` le dice a Google que el contenido es otro.
 * ════════════════════════════════════════════════════════════════
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import {
  CLUSTERS,
  SERIES_SIZE,
  resolveSchedule,
  slot,
} from './blog-schedule.mjs'

const DIR = 'content/blog'
const OUT = 'data/blog.ts'

/* SCHEDULE_START, el slot de martes y viernes, los diez clústeres y la
   validación de las fechas propias viven en `blog-schedule.mjs`, para que
   `check-blog-dates.mjs` ejerza exactamente la misma lógica sin tocar disco. */

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
    /* Opcionales, y solo para artículos fuera de la serie (n > 100): la fecha
       propia —lunes o jueves— y el clúster. `resolveSchedule` los valida y
       rechaza que un artículo de la serie lleve fecha. Ver blog-schedule.mjs. */
    publishedAt: fm.publishedAt,
    cluster: fm.cluster,
    /* Opcional: solo lo llevan los 10 títulos que pasan de ~60 caracteres.
       `?? undefined` para que la clave no se emita cuando no existe. */
    seoTitle: fm.seoTitle ?? undefined,
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

const { posts: resueltos, errors } = resolveSchedule(posts)
if (errors.length) {
  console.error(`  blog:data — ${errors.length} problema(s), no se escribe ${OUT}:`)
  for (const e of errors) console.error('    · ' + e)
  process.exit(1)
}
posts.splice(0, posts.length, ...resueltos)
const extra = posts.filter((p) => p.n > SERIES_SIZE)

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

/**
 * Quita el prefijo «{título} — » del texto alternativo de la portada.
 *
 * 97 de las 99 entradas de `data/blog-covers-map.json` arrancan con una copia
 * LITERAL del título, y el `<h1>` está 396 caracteres antes en el mismo
 * documento. Un lector de pantalla oía el titular, la descripción y otra vez el
 * titular; y para un buscador un `alt` que empieza repitiendo el h1 no aporta
 * señal nueva. Medían entre 254 y 312 caracteres y la mitad era eso.
 *
 * Va en el GENERADOR y no en `data/blog.ts`, que se reescribe con
 * `npm run blog:data`: un arreglo en el archivo derivado se perdería en la
 * siguiente corrida. Y no en el mapa de portadas, porque ese es la
 * transcripción de lo que describía cada prompt y el dato crudo se conserva.
 *
 * Las dos entradas que no llevan el prefijo pasan intactas.
 */
function altSinTitulo(alt, titulo) {
  const prefijo = `${titulo} — `
  const limpio = alt.startsWith(prefijo) ? alt.slice(prefijo.length) : alt
  return limpio.charAt(0).toUpperCase() + limpio.slice(1)
}

const lines = posts.map((p) => {
  const cover = covers[String(p.n)]
  return `  {
    n: ${p.n},
    slug: ${JSON.stringify(p.slug)},${p.seoTitle ? `\n    seoTitle: ${JSON.stringify(p.seoTitle)},` : ''}
    title: ${JSON.stringify(p.title)},
    description: ${JSON.stringify(p.description)},
    category: ${JSON.stringify(p.category)},
    cluster: ${JSON.stringify(p.cluster)},
    keyword: ${JSON.stringify(p.keyword)},
    tipo: ${JSON.stringify(p.tipo)},
    tags: ${JSON.stringify(p.tags)},
    publishedAt: ${JSON.stringify(p.publishedAt)},
    file: ${JSON.stringify(p.file)},
    words: ${p.words},
    readingMinutes: ${p.readingMinutes},${
      cover
        ? `
    cover: ${JSON.stringify(cover.src)},
    coverAlt: ${JSON.stringify(altSinTitulo(cover.alt, p.title))},`
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
  /**
   * Título para el elemento title, el OG y la tarjeta social, cuando el visible
   * pasa de ~60 caracteres y Google lo recortaría con puntos suspensivos.
   *
   * Ausente en 90 de los 100: solo lo llevan los que lo necesitan. El h1
   * SIEMPRE usa 'title' — ahí no hay límite de píxeles, y recortar el titular
   * visible para complacer a una SERP sería cambiar el contenido por el
   * envoltorio. (Sin backticks: este bloque vive dentro de un template
   * literal.)
   */
  seoTitle?: string
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
console.log(`    calendario: ${slot(0)} → ${slot(SERIES_SIZE - 1)}`)
console.log(`    fecha propia (lun/jue): ${extra.length}`)
for (const p of extra) console.log(`      n=${p.n} ${p.publishedAt} ${p.slug}`)
console.log(`    portadas:   ${withCover}/${posts.length}`)
console.log(`    palabras:   ${posts.reduce((s, p) => s + p.words, 0).toLocaleString('es-MX')}`)
