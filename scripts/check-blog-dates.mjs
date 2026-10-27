/**
 * ════════════════════════════════════════════════════════════════
 * check:blog-dates — las fechas propias (lunes y jueves) y el renderizador
 * de enlaces e imágenes, contra artículos SINTÉTICOS en memoria
 *
 * No escribe nada en content/blog: un .md de prueba ahí lo publicaría el
 * build. Todo se construye aquí y se pasa a la misma lógica que usan el
 * generador (`blog-schedule.mjs`), las páginas (`lib/blog-order.ts`) y el
 * renderizador (`lib/blog-render.ts`).
 *
 * Qué demuestra:
 *
 *   1. La validación de `publishedAt`: lo válido entra, y lo inválido —martes,
 *      viernes, otra hora, sin Z, repetido, n > 100 sin fecha, fecha en la
 *      serie— se rechaza con su motivo.
 *   2. Que un artículo con fecha propia se ORDENA bien en el índice, en el
 *      anterior/siguiente, en el lastmod del sitemap y en /feed.xml.
 *   3. Que el renderizador convierte `[t](/…)`, `[t](https://…)` y
 *      `![alt](/blog/…)`, y sigue reportando todo lo demás.
 *
 *   node scripts/check-blog-dates.mjs
 * ════════════════════════════════════════════════════════════════
 */
import { readFileSync } from 'node:fs'
import { resolveSchedule, slot, SERIES_SIZE } from './blog-schedule.mjs'
import { publishedIn, neighboursIn, nextIn } from '../lib/blog-order.ts'
import { renderArticle } from '../lib/blog-render.ts'

let fallos = 0
let pruebas = 0
function ok(cond, que) {
  pruebas++
  if (cond) console.log(`    ok   ${que}`)
  else {
    fallos++
    console.log(`    FALLA ${que}`)
  }
}

/* ── Fixtures ──────────────────────────────────────────────────── */
const serie = () =>
  Array.from({ length: SERIES_SIZE }, (_, i) => ({
    n: i + 1,
    slug: `serie-${i + 1}`,
    file: `${String(i + 1).padStart(3, '0')}-serie-${i + 1}.md`,
  }))

const nuevo = (extra) => ({
  n: 101,
  slug: 'nuevo-101',
  file: '101-nuevo-101.md',
  cluster: 'SEO, GEO y AEO',
  ...extra,
})

/** Corre la validación y devuelve los errores. */
const errores = (posts) => resolveSchedule(posts).errors

/** ¿Lo rechaza, y el motivo menciona lo esperado? */
function rechaza(que, posts, patron) {
  const e = errores(posts)
  ok(e.length > 0 && e.some((m) => patron.test(m)), `${que} → rechazado${e[0] ? ` («${e[0].replace(/^[^:]+: /, '')}»)` : ''}`)
}

/* ═══ 1. VALIDACIÓN ═══════════════════════════════════════════════ */
console.log('')
console.log('  ── 1. VALIDACIÓN DE publishedAt ─────────────────────────')

{
  const { posts, errors } = resolveSchedule(serie())
  ok(errors.length === 0, 'la serie sola (100, sin fechas propias) es válida')
  ok(
    posts.every((p) => p.publishedAt === slot(p.n - 1)),
    'la serie conserva su fecha calculada slot(n − 1)'
  )
}

{
  const { posts, errors } = resolveSchedule([
    ...serie(),
    nuevo({ publishedAt: '2026-12-03T14:00:00Z' }),
  ])
  const p = posts.find((x) => x.n === 101)
  ok(errors.length === 0 && p.publishedAt === '2026-12-03T14:00:00Z', 'jueves 2026-12-03T14:00:00Z → aceptado, se usa tal cual')
  ok(p.cluster === 'SEO, GEO y AEO', 'el cluster declarado se respeta (no cae al de rango)')
  ok(
    posts.filter((x) => x.n <= 100).every((x) => x.publishedAt === slot(x.n - 1)),
    'añadir uno con fecha propia no mueve ninguna fecha de la serie'
  )
}

ok(errores([...serie(), nuevo({ publishedAt: '2026-12-07T14:00:00Z' })]).length === 0, 'lunes 2026-12-07T14:00:00Z → aceptado')
ok(errores([...serie(), nuevo({ publishedAt: '2026-10-29T14:00:00Z' })]).length === 0, 'jueves 2026-10-29 (el primero posterior al 27/10) → aceptado')
ok(
  errores([
    ...serie(),
    nuevo({ publishedAt: '2026-12-03T14:00:00Z' }),
    nuevo({ n: 102, slug: 'nuevo-102', file: '102-nuevo-102.md', publishedAt: '2026-12-07T14:00:00Z' }),
  ]).length === 0,
  'dos nuevos en fechas distintas → aceptados'
)

rechaza('martes 2026-12-01', [...serie(), nuevo({ publishedAt: '2026-12-01T14:00:00Z' })], /martes/)
rechaza('viernes 2026-12-04', [...serie(), nuevo({ publishedAt: '2026-12-04T14:00:00Z' })], /viernes/)
rechaza('hora distinta (15:00)', [...serie(), nuevo({ publishedAt: '2026-12-03T15:00:00Z' })], /14:00:00/)
rechaza('sin Z', [...serie(), nuevo({ publishedAt: '2026-12-03T14:00:00' })], /con Z/)
rechaza('con desfase (08:00-06:00)', [...serie(), nuevo({ publishedAt: '2026-12-03T08:00:00-06:00' })], /con Z/)
rechaza('con milisegundos', [...serie(), nuevo({ publishedAt: '2026-12-03T14:00:00.000Z' })], /forma/)
rechaza('solo la fecha', [...serie(), nuevo({ publishedAt: '2026-12-03' })], /forma/)
rechaza('fecha inexistente (2027-02-29)', [...serie(), nuevo({ publishedAt: '2027-02-29T14:00:00Z' })], /fecha real/)
rechaza('lunes no posterior al 27/10 (2026-10-26)', [...serie(), nuevo({ publishedAt: '2026-10-26T14:00:00Z' })], /posterior/)
rechaza(
  'fecha duplicada entre dos nuevos',
  [
    ...serie(),
    nuevo({ publishedAt: '2026-12-03T14:00:00Z' }),
    nuevo({ n: 102, slug: 'nuevo-102', file: '102-nuevo-102.md', publishedAt: '2026-12-03T14:00:00Z' }),
  ],
  /repetido/
)
rechaza('n > 100 sin publishedAt', [...serie(), nuevo({})], /no lleva publishedAt/)
rechaza(
  'publishedAt en un artículo de la serie (n=42, aunque sea un jueves válido)',
  serie().map((p) => (p.n === 42 ? { ...p, publishedAt: '2026-12-03T14:00:00Z' } : p)),
  /lleva publishedAt y es de la serie/
)
rechaza('n > 100 sin cluster', [...serie(), nuevo({ publishedAt: '2026-12-03T14:00:00Z', cluster: undefined })], /no lleva cluster/)
rechaza('cluster inventado', [...serie(), nuevo({ publishedAt: '2026-12-03T14:00:00Z', cluster: 'Marketing' })], /índice maestro/)
rechaza(
  'reclasificar un artículo de la serie',
  serie().map((p) => (p.n === 3 ? { ...p, cluster: 'Ciberseguridad' } : p)),
  /no se reclasifica/
)
rechaza('falta uno de la serie (99 con n ≤ 100)', serie().slice(1), /se esperaban 100/)
rechaza('n repetido', [...serie(), nuevo({ n: 7, slug: 'otro', publishedAt: undefined })], /repetido/)
/* Una fecha propia no puede chocar con la serie: la serie es martes/viernes y
   la fecha propia lunes/jueves. Se comprueba igual por si alguien relaja la
   regla del día: el slot del n=29 (martes 2026-12-01) se rechaza. */
rechaza('fecha de la serie (2026-12-01, la del n=29)', [...serie(), nuevo({ publishedAt: slot(28) })], /martes|serie/)

/* ═══ 2. ORDEN EN EL SITIO ════════════════════════════════════════ */
console.log('')
console.log('  ── 2. ORDEN: índice, anterior/siguiente, sitemap, feed ──')

const { posts: conNuevo } = resolveSchedule([
  ...serie(),
  nuevo({ publishedAt: '2026-12-03T14:00:00Z' }),
])
const A1 = conNuevo.find((p) => p.n === 101)
const n29 = conNuevo.find((p) => p.n === 29)
const n30 = conNuevo.find((p) => p.n === 30)
ok(n29.publishedAt === '2026-12-01T14:00:00Z' && n30.publishedAt === '2026-12-04T14:00:00Z', 'contexto: n=29 sale el martes 01/12 y n=30 el viernes 04/12')

const t = (iso) => Date.parse(iso)

// Antes de su hora no existe en ninguna lista pública.
ok(!publishedIn(conNuevo, t('2026-12-03T13:59:59Z')).some((p) => p.n === 101), '03/12 13:59:59Z: A1 NO está publicado (ni índice, ni sitemap, ni feed)')
ok(nextIn(conNuevo, t('2026-12-02T00:00:00Z'))?.n === 101, '02/12: «siguiente» del índice anuncia A1 (antes que el n=30)')

// El día de A1.
{
  const pub = publishedIn(conNuevo, t('2026-12-03T14:00:00Z'))
  ok(pub[0].n === 101 && pub[1].n === 29, '03/12 14:00Z: índice (más reciente primero) → [101, 29, 28…]')
  const v = neighboursIn(conNuevo, A1, t('2026-12-03T14:00:00Z'))
  ok(v.anterior?.n === 29 && v.siguiente === undefined, '03/12: A1 anterior = 29, siguiente = (ninguno)')
}

// Un día después, ya con el n=30.
{
  const ahora = t('2026-12-04T14:00:00Z')
  const pub = publishedIn(conNuevo, ahora)
  ok(pub.slice(0, 3).map((p) => p.n).join(',') === '30,101,29', '04/12 14:00Z: índice → [30, 101, 29…]')
  const v = neighboursIn(conNuevo, A1, ahora)
  ok(v.anterior?.n === 29 && v.siguiente?.n === 30, '04/12: A1 anterior = 29, siguiente = 30')
  ok(neighboursIn(conNuevo, n29, ahora).siguiente?.n === 101, '04/12: el siguiente del 29 es A1 (no el 30)')
  ok(neighboursIn(conNuevo, n30, ahora).anterior?.n === 101, '04/12: el anterior del 30 es A1 (no el 29)')

  // Lo que hacía antes getNeighbours (por n), para que se vea el defecto evitado.
  const porN = conNuevo.filter((p) => t(p.publishedAt) <= ahora).sort((a, b) => a.n - b.n)
  const i = porN.findIndex((p) => p.n === 101)
  ok(porN[i - 1].n === 30 && porN[i + 1] === undefined, '   (ordenando por n, como antes, A1 quedaba detrás del 30 y sin siguiente)')

  /* Sitemap — app/sitemap.ts: artículo `lastModified: post.publishedAt.slice(0, 10)`
     sobre getPublishedPosts(); índice `lastModified` = el máximo de esos. */
  const lastmodA1 = pub.find((p) => p.n === 101).publishedAt.slice(0, 10)
  const lastmodIndice = pub.map((p) => p.publishedAt.slice(0, 10)).sort().at(-1)
  ok(lastmodA1 === '2026-12-03', 'sitemap: lastmod de A1 = 2026-12-03')
  ok(lastmodIndice === '2026-12-04', 'sitemap: lastmod de /es/blog = 2026-12-04 (el más reciente)')

  /* Feed — app/feed.xml/route.ts: getPublishedPosts().slice(0, 50), pubDate
     `new Date(publishedAt).toUTCString()`, lastBuildDate = el primero. */
  const feed = pub.slice(0, 50)
  ok(feed.findIndex((p) => p.n === 101) === 1, 'feed: A1 es el 2.º item, entre el 30 y el 29')
  ok(new Date(A1.publishedAt).toUTCString() === 'Thu, 03 Dec 2026 14:00:00 GMT', 'feed: pubDate de A1 = Thu, 03 Dec 2026 14:00:00 GMT')
}

/* Las expresiones de arriba se COPIAN de app/sitemap.ts y app/feed.xml; si
   alguien las cambia allí, esta prueba tiene que enterarse. */
{
  const sitemap = readFileSync('app/sitemap.ts', 'utf8')
  const feed = readFileSync('app/feed.xml/route.ts', 'utf8')
  ok(/const publicados = getPublishedPosts\(\)/.test(sitemap) && /post\.publishedAt\.slice\(0, 10\)/.test(sitemap), 'app/sitemap.ts sigue usando getPublishedPosts() y publishedAt.slice(0, 10)')
  ok(/getPublishedPosts\(\)\.slice\(0, 50\)/.test(feed) && /new Date\(post\.publishedAt\)\.toUTCString\(\)/.test(feed), 'app/feed.xml sigue usando getPublishedPosts().slice(0, 50) y publishedAt')
  const blog = readFileSync('lib/blog.ts', 'utf8')
  ok(/publishedIn\(BLOG_POSTS, now\)/.test(blog) && /neighboursIn\(BLOG_POSTS, post, now\)/.test(blog) && /nextIn\(BLOG_POSTS, now\)/.test(blog), 'lib/blog.ts delega en lib/blog-order.ts (lo que se probó arriba)')
}

/* ═══ 3. RENDERIZADOR ═════════════════════════════════════════════ */
console.log('')
console.log('  ── 3. ENLACES E IMÁGENES EN EL RENDERIZADOR ─────────────')

const r = (md) => renderArticle(md)
{
  const { html, uncovered } = r('Lee [la guía](/es/blog/guia) o [Google](https://developers.google.com/search?a=1&b=2).')
  ok(html.includes('<a class="link-stylus" href="/es/blog/guia">la guía</a>'), 'interno → <a href="/es/blog/guia"> sin rel')
  ok(html.includes('href="https://developers.google.com/search?a=1&amp;b=2" rel="noopener">Google</a>'), 'externo → rel="noopener" y & escapado en el href')
  ok(uncovered.length === 0, 'los dos enlaces válidos no cuentan como residuo')
}
{
  const { html } = r('[**negrita** en enlace](/x) y `[código](/y)`')
  ok(html.includes('<a class="link-stylus" href="/x"><strong>negrita</strong> en enlace</a>'), 'el texto del enlace admite negrita')
  ok(html.includes('<code>[código](/y)</code>'), 'un enlace dentro de `código` sigue siendo código')
}
{
  const { html } = r('[x](/ruta_con_*asteriscos*_)')
  ok(html.includes('href="/ruta_con_*asteriscos*_"') && !html.includes('<em>'), 'un * en la URL no abre itálica dentro del href')
}
{
  const { html, uncovered } = r('Texto.\n![Panel de Search Console](/blog/gbp-panel.webp)\n\nMás.')
  ok(
    html.includes('<figure class="article-figure"><img src="/blog/gbp-panel.webp" alt="Panel de Search Console" loading="lazy" decoding="async" /></figure>'),
    'imagen de bloque → <figure class="article-figure"><img loading="lazy" decoding="async">'
  )
  ok(html.startsWith('<p>Texto.</p>'), 'la imagen corta el párrafo aunque no haya línea en blanco')
  ok(uncovered.length === 0, 'la imagen de bloque válida no cuenta como residuo')
}
for (const [md, que] of [
  ['[x](http://inseguro.com)', 'http:// sin TLS'],
  ['[x](//otro-dominio.com)', '//host (otro dominio con cara de ruta)'],
  ['[x](/\\otro-dominio.com)', '/\\host'],
  ['[x](mailto:a@b.c)', 'mailto:'],
  ['[x](relativa)', 'ruta relativa'],
  ['Texto ![x](/blog/a.webp) en línea', 'imagen en línea'],
  ['![](/blog/a.webp)', 'imagen sin alt'],
  ['![x](https://cdn.com/a.webp)', 'imagen fuera de /blog/'],
]) {
  const { html, uncovered } = r(md)
  ok(uncovered.length > 0 && !html.includes('<a ') && !html.includes('<img'), `${que} → reportado y no convertido`)
}
{
  const { faq, headings } = r(
    '### Preguntas frecuentes\n\n**¿Qué es [GBP](https://business.google.com)?**\nEs el [perfil](/es/blog/x) de tu negocio.'
  )
  ok(faq[0]?.question === '¿Qué es GBP?' && faq[0]?.answer === 'Es el perfil de tu negocio.', 'en el FAQ (y su JSON-LD) el enlace aporta su texto, nunca la sintaxis')
  ok(headings[0]?.text === 'Preguntas frecuentes', 'encabezados intactos')
}

console.log('')
if (fallos) {
  console.log(`  ${fallos} de ${pruebas} comprobaciones FALLARON.`)
  console.log('')
  process.exit(1)
}
console.log(`  OK  ${pruebas} comprobaciones.`)
console.log('')
