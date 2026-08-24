/**
 * ════════════════════════════════════════════════════════════════
 * check:blog — el renderizador de markdown, contra los 100 artículos
 *
 * El cuerpo del blog no pasa por una librería probada por millones de
 * usuarios: pasa por `lib/blog-render.ts`, escrito para este contenido. Eso
 * es defendible SOLO si hay una comprobación que lo ejerza sobre los 100
 * archivos en cada cambio. Esta es esa comprobación.
 *
 * Falla —código de salida 1— si encuentra:
 *
 *   · sintaxis de markdown que el renderizador no cubre (un enlace o una
 *     imagen aparecerían crudos en la página)
 *   · etiquetas HTML desbalanceadas
 *   · marcado de markdown que sobrevivió al render (`**`, `###`, `|` suelto)
 *   · un artículo sin bloque de preguntas frecuentes (rompe el FAQPage)
 *   · un artículo sin encabezados, sin cuerpo, o con anclas repetidas
 *   · frontmatter incompleto
 *
 *   node scripts/blog-check.mjs
 * ════════════════════════════════════════════════════════════════
 */
import { readFileSync, readdirSync } from 'node:fs'
import { renderArticle } from '../lib/blog-render.ts'

const DIR = 'content/blog'
const files = readdirSync(DIR)
  .filter((f) => f.endsWith('.md'))
  .sort()

const problems = []
const stats = {
  articulos: 0,
  palabras: 0,
  encabezados: 0,
  faq: 0,
  tablas: 0,
  bloquesCodigo: 0,
}

/** Etiquetas que este renderizador emite en pares. */
const PAIRED = [
  'p',
  'ul',
  'ol',
  'li',
  'h2',
  'h3',
  'strong',
  'code',
  'pre',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
  'blockquote',
  'div',
  'span',
]

for (const file of files) {
  const raw = readFileSync(`${DIR}/${file}`, 'utf8')
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n/)
  if (!fmMatch) {
    problems.push(`${file}: sin frontmatter`)
    continue
  }
  const fm = {}
  for (const line of fmMatch[1].split('\n')) {
    const i = line.indexOf(':')
    if (i < 0) continue
    fm[line.slice(0, i).trim()] = line.slice(i + 1).trim()
  }
  for (const key of ['n', 'title', 'slug', 'description', 'category', 'keyword']) {
    if (!fm[key]) problems.push(`${file}: frontmatter sin "${key}"`)
  }

  const body = raw.slice(fmMatch[0].length)
  const { html, headings, faq, uncovered } = renderArticle(body)

  stats.articulos++
  stats.palabras += body.split(/\s+/).filter(Boolean).length
  stats.encabezados += headings.length
  stats.faq += faq.length
  stats.tablas += (html.match(/<table>/g) || []).length
  stats.bloquesCodigo += (html.match(/<pre>/g) || []).length

  // 1. Sintaxis sin cubrir.
  for (const u of uncovered) problems.push(`${file}: sintaxis sin cubrir · ${u}`)

  // 2. Etiquetas balanceadas.
  for (const tag of PAIRED) {
    const open = (html.match(new RegExp(`<${tag}[\\s>]`, 'g')) || []).length
    const close = (html.match(new RegExp(`</${tag}>`, 'g')) || []).length
    if (open !== close)
      problems.push(`${file}: <${tag}> abre ${open} y cierra ${close}`)
  }

  // 3. Markdown que sobrevivió. Se mira FUERA de los bloques de código: ahí
  //    dentro los asteriscos y las barras son contenido legítimo.
  const sinCodigo = html.replace(/<pre><code>[\s\S]*?<\/code><\/pre>/g, '')
  if (/\*\*/.test(sinCodigo)) problems.push(`${file}: quedan ** sin convertir`)
  if (/^#{2,4}\s/m.test(sinCodigo)) problems.push(`${file}: queda un # sin convertir`)
  if (/^\s*\|/m.test(sinCodigo)) problems.push(`${file}: queda una fila de tabla cruda`)
  if (/`[^`]+`/.test(sinCodigo.replace(/<code>[\s\S]*?<\/code>/g, '')))
    problems.push(`${file}: quedan comillas invertidas sin convertir`)

  // 4. Contenido mínimo.
  if (!html.trim()) problems.push(`${file}: render vacío`)
  if (headings.length === 0) problems.push(`${file}: sin encabezados`)
  if (faq.length === 0) problems.push(`${file}: sin bloque de preguntas frecuentes`)

  // 5. Anclas únicas — dos secciones con el mismo id rompen el índice.
  const ids = headings.map((h) => h.id)
  if (new Set(ids).size !== ids.length)
    problems.push(`${file}: anclas repetidas en el índice`)

  // 6. El nombre del archivo tiene que coincidir con el slug del frontmatter.
  const slug = fm.slug.replace(/^"|"$/g, '')
  if (!file.endsWith(`-${slug}.md`))
    problems.push(`${file}: el nombre no coincide con el slug "${slug}"`)
}

console.log('')
console.log('  ── RENDER DE LOS ARTÍCULOS ────────────────────────────')
console.log(`    artículos:        ${stats.articulos}`)
console.log(`    palabras:         ${stats.palabras.toLocaleString('es-MX')}`)
console.log(`    encabezados:      ${stats.encabezados}`)
console.log(`    pares de FAQ:     ${stats.faq}`)
console.log(`    tablas:           ${stats.tablas}`)
console.log(`    bloques de código:${String(stats.bloquesCodigo).padStart(4)}`)
console.log('')

if (problems.length === 0) {
  console.log('  OK  los 100 artículos renderizan sin residuos de markdown.')
  console.log('')
  process.exit(0)
}

console.log(`  ── PROBLEMAS (${problems.length}) ──`)
for (const p of problems.slice(0, 40)) console.log('    · ' + p)
if (problems.length > 40) console.log(`    … y ${problems.length - 40} más`)
console.log('')
process.exit(1)
