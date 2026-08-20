/**
 * Genera `data/world-map.generated.ts`: los contornos del mundo como paths SVG.
 *
 *   node scripts/generate-worldmap.mjs
 *
 * ── POR QUÉ NO GOOGLE MAPS NI MAPBOX ──
 * El dueño reportó que el sitio se sentía lento justo antes de pedir el mapa.
 * Un mapa de tiles implica una librería, una llave de API, decenas de
 * peticiones de red por vista, un dominio más en el CSP y un costo por carga.
 * Un SVG con geografía real no implica ninguna de esas cosas: se sirve con el
 * HTML, funciona sin conexión y se puede estilizar con los mismos tokens que
 * el resto del sitio.
 *
 * La geometría viene de Natural Earth (dominio público) a 110 m de resolución,
 * que es la escala pensada para mapas de página completa. Se descarga UNA vez,
 * en este script, y el resultado queda versionado — el build no depende de la
 * red.
 *
 * ── PROYECCIÓN ──
 * Equirectangular simple. No es la más bonita, pero convierte lat/lon a x/y con
 * dos multiplicaciones, lo que significa que colocar un marcador en el
 * componente es trivial y verificable a mano:
 *
 *     x = (lon + 180) / 360 * ANCHO
 *     y = (LAT_MAX - lat) / (LAT_MAX - LAT_MIN) * ALTO
 *
 * Se recorta a [-58, 84] de latitud: quita la Antártida (que ocuparía un tercio
 * del alto sin aportar nada) y evita el estiramiento absurdo de los polos.
 */
import { writeFile } from 'node:fs/promises'
import path from 'node:path'

const SOURCE =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson'

const WIDTH = 1000
const HEIGHT = 500
const LAT_MAX = 84
const LAT_MIN = -58

/** Países que el mapa resalta por separado, por código ISO A3. */
const HIGHLIGHT = new Set(['MEX', 'USA'])

const project = ([lon, lat]) => [
  ((lon + 180) / 360) * WIDTH,
  ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * HEIGHT,
]

/**
 * Redondea a `decimals` y elimina puntos consecutivos repetidos.
 *
 * No hay Douglas-Peucker a propósito: sobre un anillo CERRADO el primer y el
 * último punto coinciden, así que la recta base mide cero, toda distancia
 * perpendicular sale 0 y el algoritmo colapsa cada país a dos puntos. La
 * fuente ya está simplificada a 110 m —la escala pensada para mapas de página
 * completa— así que redondear a un decimal de unidad SVG quita la mayor parte
 * del peso sin diferencia visible.
 */
function thin(points, decimals) {
  const factor = 10 ** decimals
  const round = (n) => Math.round(n * factor) / factor
  const out = []
  for (const [x, y] of points) {
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue
    const rx = round(x)
    const ry = round(y)
    const last = out[out.length - 1]
    if (last && last[0] === rx && last[1] === ry) continue
    out.push([rx, ry])
  }
  return out
}

/** Un anillo -> un subpath cerrado. */
function ringToPath(ring, decimals) {
  const pts = thin(ring.map(project), decimals)
  if (pts.length < 3) return ''
  return 'M' + pts.map(([x, y]) => x + ',' + y).join('L') + 'Z'
}

function featureToPath(feature, decimals) {
  const geom = feature.geometry
  if (!geom) return ''
  const polygons =
    geom.type === 'Polygon'
      ? [geom.coordinates]
      : geom.type === 'MultiPolygon'
        ? geom.coordinates
        : []

  return polygons
    .flatMap((poly) => poly.map((ring) => ringToPath(ring, decimals)))
    .filter(Boolean)
    .join('')
}

console.log('  descargando Natural Earth 110m...')
const res = await fetch(SOURCE)
if (!res.ok) {
  console.error(`  fallo la descarga: ${res.status}`)
  process.exit(1)
}
const geo = await res.json()
console.log(`  ${geo.features.length} paises`)

let landPath = ''
const highlights = {}
let skipped = 0

for (const feature of geo.features) {
  const props = feature.properties ?? {}
  const iso = props.ADM0_A3 ?? props.ISO_A3 ?? props.SOV_A3
  const name = props.NAME ?? props.ADMIN ?? iso

  // La Antártida queda fuera del recorte de latitud y solo aporta ruido.
  if (iso === 'ATA') {
    skipped++
    continue
  }

  if (HIGHLIGHT.has(iso)) {
    // Los países resaltados llevan menos tolerancia: se ven más grandes y de
    // ellos depende que el mapa se reconozca.
    highlights[iso] = { name, path: featureToPath(feature, 1) }
  } else {
    landPath += featureToPath(feature, 0)
  }
}

const missing = [...HIGHLIGHT].filter((iso) => !highlights[iso])
if (missing.length) {
  console.error(`  no se encontraron: ${missing.join(', ')}`)
  process.exit(1)
}

const out = `/**
 * GENERADO — no editar a mano.
 * Regenera con: node scripts/generate-worldmap.mjs
 *
 * Contornos del mundo en proyección equirectangular, recortada a
 * [${LAT_MIN}, ${LAT_MAX}] de latitud. Geometría de Natural Earth 110m
 * (dominio público).
 *
 * Para colocar un marcador desde lat/lon usa \`projectLatLon\` de
 * data/companies.ts, que aplica exactamente la misma fórmula que este script.
 */

export const MAP_VIEWBOX = { width: ${WIDTH}, height: ${HEIGHT} } as const

/** Límites de latitud del recorte. Los necesita la proyección de marcadores. */
export const MAP_LAT_BOUNDS = { max: ${LAT_MAX}, min: ${LAT_MIN} } as const

/** Todo el resto del mundo, en un solo path para que sea una sola capa. */
export const LAND_PATH =
  '${landPath}'

/** Países con presencia, resaltables por separado. */
export const COUNTRY_PATHS: Record<string, { name: string; path: string }> = {
${Object.entries(highlights)
  .map(([iso, v]) => `  ${iso}: {\n    name: '${v.name.replace(/'/g, "\\'")}',\n    path:\n      '${v.path}',\n  },`)
  .join('\n')}
}
`

const dest = path.join(process.cwd(), 'data', 'world-map.generated.ts')
await writeFile(dest, out)

const kb = (s) => (Buffer.byteLength(s) / 1024).toFixed(1)
console.log(`  saltados: ${skipped}`)
console.log(`  tierra:   ${kb(landPath)} KB`)
for (const [iso, v] of Object.entries(highlights)) {
  console.log(`  ${iso}:      ${kb(v.path)} KB  (${v.name})`)
}
console.log(`  escrito:  data/world-map.generated.ts  ${kb(out)} KB\n`)
