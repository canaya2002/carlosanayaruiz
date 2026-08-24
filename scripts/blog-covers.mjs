/**
 * ════════════════════════════════════════════════════════════════
 * blog:covers — nombra, optimiza y publica las portadas del blog
 *
 *   node scripts/blog-covers.mjs            (ejecuta el mapa)
 *   node scripts/blog-covers.mjs --dry      (solo informa)
 *
 * ── DE DÓNDE SALE EL EMPAREJADO ──
 * Las portadas llegaron con el nombre que les puso la herramienta que las
 * generó («ChatGPT Image 21 ago…», «Gemini_Generated_Image_…»), que no dice
 * nada ni a una persona ni a un buscador. Veinte traían su número en el
 * nombre (`portada_044_…`) y las otras 79 se identificaron LEYENDO EL TÍTULO
 * IMPRESO EN LA PROPIA IMAGEN y casándolo contra los 100 títulos reales.
 *
 * (Los prompts pedían «SIN texto, SIN letras» y las imágenes salieron con el
 * título rotulado igual. Eso, que era un fallo respecto al prompt, es lo que
 * permitió emparejarlas con certeza.)
 *
 * El mapa vive en `data/blog-covers-map.json`, revisado uno por uno. Este
 * script no adivina nada: solo ejecuta ese mapa.
 *
 * ── POR QUÉ SE RENOMBRA ──
 * El nombre de archivo es una de las pocas señales que un buscador tiene para
 * entender de qué es una imagen. `Gemini_Generated_Image_wxqh77wxqh77wxqh.jpg`
 * no dice nada; `que-es-rag-inteligencia-artificial-carlos-anaya-ruiz.webp`
 * dice el tema y de quién es. Y cuando alguien descarga o rehospeda la
 * imagen, el nombre viaja con ella: es marca que no se pierde.
 *
 * ── POR QUÉ SE OPTIMIZA, Y CUÁNTO ──
 * Los originales son 214 MB en 99 archivos —2.2 MB de media, PNG y JPG a
 * 1672×941—. Una portada de 2 MB en un sitio cuyo producto son los Core Web
 * Vitals no es un detalle: es una contradicción que cualquiera mide con
 * PageSpeed. Salen a WebP 1600×900, que es 16:9 exacto y da de sobra para
 * servir a 800 px en pantalla retina y para recortar la tarjeta de Open
 * Graph a 1200×630.
 *
 * ── LOS ORIGINALES SALEN DE public/ ──
 * Estaban en `public/blogs/`, dentro de lo que se despliega. Hoy no viajan
 * porque no están en git, pero un `git add -A` metería 214 MB en el repo y
 * en el bundle. Se mueven a `assets/blog-covers-originales/`, fuera de
 * `public/`, y esa ruta va al .gitignore.
 * ════════════════════════════════════════════════════════════════
 */
import sharp from 'sharp'
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  renameSync,
  existsSync,
  statSync,
  readdirSync,
} from 'node:fs'

const SRC = 'public/blogs'
const OUT = 'public/blog'
const ARCHIVE = 'assets/blog-covers-originales'
const MAP = 'data/blog-covers-map.json'
const DRY = process.argv.includes('--dry')

const WIDTH = 1600
const HEIGHT = 900
const QUALITY = 76

if (!existsSync(MAP)) {
  console.error(`falta ${MAP}. Es el emparejado revisado: sin él no se adivina.`)
  process.exit(1)
}

const map = JSON.parse(readFileSync(MAP, 'utf8'))

/**
 * La lista de artículos se lee del markdown, que es la fuente. Un JSON
 * intermedio sería un tercer sitio donde el slug podría quedar desfasado.
 */
function readPosts() {
  return readdirSync('content/blog')
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const raw = readFileSync(`content/blog/${f}`, 'utf8')
      const fm = raw.match(/^---\n([\s\S]*?)\n---/)
      if (!fm) throw new Error(`${f}: sin frontmatter`)
      const get = (key) => {
        for (const line of fm[1].split('\n')) {
          const i = line.indexOf(':')
          if (i < 0) continue
          if (line.slice(0, i).trim() !== key) continue
          const v = line.slice(i + 1).trim()
          return v.startsWith('"') ? JSON.parse(v) : v
        }
        return ''
      }
      return { n: Number(get('n')), slug: get('slug'), title: get('title') }
    })
    .sort((a, b) => a.n - b.n)
}

const posts = readPosts()
const byN = new Map(posts.map((p) => [p.n, p]))

mkdirSync(OUT, { recursive: true })
if (!DRY) mkdirSync(ARCHIVE, { recursive: true })

const covers = {}
let bytesIn = 0
let bytesOut = 0
let hechas = 0
const problemas = []

for (const entry of map) {
  const post = byN.get(entry.n)
  if (!post) {
    problemas.push(`artículo ${entry.n} no existe`)
    continue
  }

  const from = `${SRC}/${entry.file}`
  const archived = `${ARCHIVE}/${entry.file}`
  const source = existsSync(from) ? from : archived

  if (!existsSync(source)) {
    problemas.push(`${entry.n}: no encuentro ${entry.file}`)
    continue
  }

  const name = `${post.slug}-carlos-anaya-ruiz.webp`
  const dest = `${OUT}/${name}`

  bytesIn += statSync(source).size

  if (!DRY) {
    await sharp(source)
      .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'centre' })
      .webp({ quality: QUALITY, effort: 6 })
      .toFile(dest)
    bytesOut += statSync(dest).size
    // El original se archiva fuera de public/ solo si sigue ahí.
    if (source === from) renameSync(from, archived)
  }

  covers[String(entry.n)] = { src: `/blog/${name}`, alt: entry.alt }
  hechas++
}

if (!DRY) {
  writeFileSync('data/blog-covers.json', JSON.stringify(covers, null, 2) + '\n')
}

const mb = (b) => (b / 1048576).toFixed(1) + ' MB'
console.log('')
console.log(`  portadas procesadas: ${hechas}/${map.length}`)
console.log(`  origen:  ${mb(bytesIn)}`)
if (!DRY && hechas) {
  console.log(
    `  salida:  ${mb(bytesOut)}   (${((1 - bytesOut / bytesIn) * 100).toFixed(1)}% menos)`
  )
  console.log(`  media:   ${Math.round(bytesOut / hechas / 1024)} kB por portada`)
}

const sinPortada = posts.filter((p) => !covers[String(p.n)])
if (sinPortada.length) {
  console.log('')
  console.log(`  SIN PORTADA (${sinPortada.length}):`)
  for (const p of sinPortada)
    console.log(`    ${String(p.n).padStart(3)}  ${p.title.slice(0, 62)}`)
}

if (!DRY && existsSync(SRC)) {
  const sobran = readdirSync(SRC)
  if (sobran.length)
    console.log(`\n  quedan ${sobran.length} archivo(s) sin usar en ${SRC}`)
}

if (problemas.length) {
  console.log(`\n  PROBLEMAS (${problemas.length}):`)
  for (const p of problemas) console.log('    · ' + p)
  process.exit(1)
}
console.log('')
