/**
 * Verifica que PALETTE_HEX en lib/constants.ts siga coincidiendo con los tokens
 * de app/globals.css, y que cada piso de contraste WCAG se cumpla.
 *
 *   npm run palette:check
 *
 * La tabla de hex existe porque tres consumidores no pueden leer una variable
 * CSS: el manifiesto PWA, el `themeColor` del viewport y Satori en lib/og.tsx.
 * Una copia derivada se podre en silencio — las tres ya habían derivado de
 * --brand por un margen visible antes de que este chequeo existiera.
 *
 * Sale con código distinto de cero si algo no cuadra, para poder bloquear un
 * commit o un CI.
 */
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const ROOT = process.cwd()

/* ── contraste ───────────────────────────────────────────────────── */

const toRgb = (hex) =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)

const luminance = (rgb) => {
  const f = (v) => (v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4))
  const [r, g, b] = rgb.map(f)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const contrast = (a, b) => {
  const x = luminance(toRgb(a))
  const y = luminance(toRgb(b))
  const [hi, lo] = x > y ? [x, y] : [y, x]
  return (hi + 0.05) / (lo + 0.05)
}

/** Compone `fg` con opacidad `alpha` sobre `bg`. */
const compose = (fg, bg, alpha) => {
  const f = toRgb(fg)
  const b = toRgb(bg)
  return (
    '#' +
    f
      .map((c, i) => c * alpha + b[i] * (1 - alpha))
      .map((c) => Math.round(c * 255).toString(16).padStart(2, '0'))
      .join('')
  )
}

/* ── parseo ──────────────────────────────────────────────────────── */

function parseCssTokens(css) {
  const start = css.indexOf(':root {')
  if (start === -1) throw new Error('No hay bloque :root en globals.css')
  const open = css.indexOf('{', start)
  const close = css.indexOf('\n}', open)
  const block = css.slice(open, close)

  const tokens = {}

  // 1) Valores literales.
  const reHex = /--([a-z-]+):\s*(#[0-9a-fA-F]{6})\s*;/g
  let m
  while ((m = reHex.exec(block))) tokens[m[1]] = m[2].toLowerCase()

  /*
   * 2) Alias.
   *
   * El sistema «Papel Ahumado» separa MATERIAL de ROL: los seis materiales
   * llevan el hex (`--soot: #12100e`) y los roles apuntan a ellos
   * (`--ground: var(--soot)`). Es la capa que hace que cambiar un material
   * se propague solo, y sin resolverla este verificador no ve ningún color.
   *
   * Se resuelve en varias pasadas porque un alias puede apuntar a otro
   * alias. El tope evita un ciclo (`--a: var(--b); --b: var(--a)`), que
   * queda simplemente sin resolver y el contrato de espejo lo reporta.
   */
  const reAlias = /--([a-z-]+):\s*var\(\s*--([a-z-]+)\s*\)\s*;/g
  const aliases = []
  while ((m = reAlias.exec(block))) aliases.push([m[1], m[2]])

  for (let pass = 0; pass < 8; pass++) {
    let changed = false
    for (const [name, target] of aliases) {
      if (tokens[name] === undefined && tokens[target] !== undefined) {
        tokens[name] = tokens[target]
        changed = true
      }
    }
    if (!changed) break
  }

  return tokens
}

function parseDeclared(ts) {
  const table = ts.match(/export const PALETTE_HEX = \{([\s\S]*?)\n\} as const/)
  if (!table) throw new Error('No se encontró PALETTE_HEX en lib/constants.ts')
  const group = table[1].match(/light:\s*\{([\s\S]*?)\n {2}\}/)
  if (!group) throw new Error('No se encontró el grupo "light" en PALETTE_HEX')

  const out = {}
  const re = /(\w+):\s*'(#[0-9a-fA-F]{6})'/g
  let m
  while ((m = re.exec(group[1]))) out[m[1]] = m[2].toLowerCase()
  return out
}

/* ── contratos ───────────────────────────────────────────────────── */

/** clave en PALETTE_HEX.light -> nombre del token en globals.css */
const MIRROR = {
  ground: 'ground',
  surface: 'surface',
  ink: 'ink',
  inkMuted: 'ink-muted',
  hairline: 'hairline',
  brand: 'brand',
  brandStrong: 'brand-strong',
  brandWash: 'brand-wash',
  sky: 'sky',
  skyInk: 'sky-ink',
  cyan: 'cyan',
  cyanInk: 'cyan-ink',
}

/**
 * Pisos sobre el fondo plano.
 *
 * `sky` y `cyan` aparecen con piso 0 a propósito: están documentados como
 * decorativos puros y no deben hacer fallar el chequeo — pero quedan listados
 * para que nadie los confunda con colores de texto.
 */
const FLOORS = [
  { token: 'ink', against: 'ground', min: 4.5, use: 'texto principal' },
  { token: 'ink-muted', against: 'ground', min: 4.5, use: 'texto corrido' },
  { token: 'ink-subtle', against: 'ground', min: 4.5, use: 'texto secundario' },
  { token: 'ink-subtle', against: 'ground-tint', min: 4.5, use: 'texto sobre banda' },
  { token: 'brand', against: 'ground', min: 4.5, use: 'enlaces' },
  { token: 'brand-strong', against: 'ground', min: 4.5, use: 'enlaces hover' },
  { token: 'sky-ink', against: 'ground', min: 4.5, use: 'texto cielo legible' },
  { token: 'cyan-ink', against: 'ground', min: 4.5, use: 'texto cian legible' },
  { token: 'control', against: 'surface', min: 3.0, use: 'borde de input (1.4.11)' },
  { token: 'control', against: 'ground', min: 3.0, use: 'borde de input (1.4.11)' },
  { token: 'sky', against: 'ground', min: 0, use: 'SOLO decorativo (2.7:1)' },
  { token: 'cyan', against: 'ground', min: 0, use: 'SOLO decorativo (1.8:1)' },
]

/**
 * Relleno de acción.
 *
 * En «Papel Ahumado» el relleno es PAPEL y la tinta encima es hollín — la
 * inversión exacta del sistema anterior, donde el relleno era azul y la
 * tinta blanca. Comprobar blanco sobre relleno aquí no significaba nada:
 * el blanco no aparece en ninguna parte del sitio.
 */
const ON_FILL = [
  { fg: 'brand-ink', bg: 'brand', min: 4.5, use: 'tinta sobre relleno' },
  { fg: 'brand-ink', bg: 'brand-strong', min: 4.5, use: 'tinta sobre hover' },
]

/* ── ejecución ───────────────────────────────────────────────────── */

const css = await readFile(path.join(ROOT, 'app', 'globals.css'), 'utf8')
const ts = await readFile(path.join(ROOT, 'lib', 'constants.ts'), 'utf8')

const tokens = parseCssTokens(css)
const declared = parseDeclared(ts)

let failures = 0

console.log('\n  espejo PALETTE_HEX ↔ globals.css')
console.log('  ' + '─'.repeat(58))
for (const [key, token] of Object.entries(MIRROR)) {
  const expected = tokens[token]
  const actual = declared[key]
  if (!expected) {
    console.error(`  ?  ${key}: no existe --${token} en globals.css`)
    failures++
  } else if (actual !== expected) {
    console.error(
      `  ✗  ${key}: declara ${actual ?? '(falta)'}, globals.css dice ${expected}`
    )
    failures++
  } else {
    console.log(`  ✓  ${key.padEnd(13)} ${expected}`)
  }
}

console.log('\n  pisos sobre el fondo plano')
console.log('  ' + '─'.repeat(58))
for (const { token, against, min, use } of FLOORS) {
  const fg = tokens[token]
  const bg = tokens[against]
  if (!fg || !bg) {
    console.error(`  ?  falta --${token} o --${against}`)
    failures++
    continue
  }
  const ratio = contrast(fg, bg)
  const ok = ratio >= min
  if (!ok) failures++
  const label = `${token} / ${against}`
  console.log(
    `  ${ok ? '✓' : '✗'}  ${label.padEnd(28)} ${ratio.toFixed(2).padStart(6)}` +
      `  (min ${min})  ${use}`
  )
}

console.log('\n  tinta sobre relleno de acción')
console.log('  ' + '─'.repeat(58))
for (const { fg, bg, min, use } of ON_FILL) {
  const ratio = contrast(tokens[fg], tokens[bg])
  const ok = ratio >= min
  if (!ok) failures++
  const label = `${fg} / ${bg}`
  console.log(
    `  ${ok ? '✓' : '✗'}  ${label.padEnd(28)} ${ratio.toFixed(2).padStart(6)}  (min ${min})  ${use}`
  )
}

/**
 * ── CASOS COMPUESTOS ────────────────────────────────────────────────
 *
 * Esta es la sección que más importa, porque un token puede pasar sobre el
 * fondo plano y fallar en el sitio real. Aquí hay dos fuentes de sorpresa:
 *
 * 1. LA PLACA. `.plate` invierte el material entero: papel de fondo, tinta
 *    de hollín encima. Es la única superficie clara del sitio y nada de lo
 *    medido sobre hollín aplica ahí.
 *
 * 2. LA OPACIDAD DE LAS MARCAS. `.mark:not([data-key="lcp"])` corre a
 *    `opacity: 0.62` para que el LCP domine la jerarquía. Eso significa que
 *    el verde efectivo de TTFB y FCP NO es el verde del token: es el token
 *    compuesto contra el hollín. Si esa composición no pasa 4.5, el sitio
 *    muestra una medición ilegible, que es peor que no mostrarla.
 */
const MARK_DIM = 0.62
const dimThreshold = compose(tokens.threshold, tokens.ground, MARK_DIM)
const dimMinium = compose(tokens.minium, tokens.ground, MARK_DIM)

const COMPOSITE = [
  // La placa despejada: el material invertido.
  { token: 'ground', bg: tokens.paper, where: 'hollín sobre placa de papel', min: 4.5 },
  { token: 'smoke', bg: tokens.paper, where: 'humo sobre placa de papel', min: 4.5 },
  // Superficies de hollín delgado.
  { token: 'ink-muted', bg: tokens.surface, where: 'sobre superficie de humo', min: 4.5 },
  { token: 'ink-subtle', bg: tokens.surface, where: 'sobre superficie de humo', min: 4.5 },
  // Semánticos: llevan texto, así que tienen piso de texto y no de adorno.
  { token: 'threshold', bg: tokens.ground, where: 'marca que pasa', min: 4.5 },
  { token: 'minium', bg: tokens.ground, where: 'regla de 2.5 s', min: 4.5 },
  // La placa necesita su propia tinta secundaria: ceniza no pasa ahí.
  { token: 'ink-plate', bg: tokens.paper, where: 'tinta 2.ª sobre placa', min: 4.5 },
  { token: 'ink-subtle', bg: tokens.paper, where: 'ceniza sobre placa — NO usar', min: 0 },
]

console.log('\n  compuestos: placa invertida y marcas atenuadas')
console.log('  ' + '─'.repeat(58))
console.log(`  placa = ${tokens.paper}   ·   superficie de humo = ${tokens.surface}`)
console.log(`  umbral al ${MARK_DIM * 100}% sobre hollín = ${dimThreshold}`)
console.log(`  minio al ${MARK_DIM * 100}% sobre hollín = ${dimMinium}`)
/* Informativo, no un contrato: el sistema NO atenúa colores semánticos
   —justamente porque estos números no pasan— así que esta composición no
   existe hoy en el CSS. Se imprime para que quede constancia de por qué. */
console.log(
  `  → si se atenuaran, caerían a ${contrast(dimThreshold, tokens.ground).toFixed(2)} ` +
    `y ${contrast(dimMinium, tokens.ground).toFixed(2)}. Por eso no se atenúan.`
)
console.log('')

for (const { token, bg, where, min } of COMPOSITE) {
  const fg = tokens[token]
  if (!fg) {
    console.error(`  ?  falta --${token}`)
    failures++
    continue
  }
  const ratio = contrast(fg, bg)
  const ok = ratio >= min
  if (!ok) failures++
  const label = `${token} ${where}`
  console.log(
    `  ${ok ? '✓' : '✗'}  ${label.padEnd(36)} ${ratio.toFixed(2).padStart(6)}  (min ${min})`
  )
}

/**
 * Las reglas que se derivan de los números de arriba, impresas cada vez para
 * que nadie las tenga que recordar.
 */
const dimmed = contrast(compose(tokens.threshold, tokens.ground, 0.62), tokens.ground)
const subtleOnPlate = contrast(tokens['ink-subtle'], tokens.paper)

console.log('\n  reglas que salen de estos números')
console.log('  ' + '─'.repeat(58))
console.log(
  `  · Un color semántico NO se atenúa: umbral al 62% cae a ${dimmed.toFixed(2)}.`
)
console.log('    La jerarquía se hace con grosor y tamaño, no con opacidad.')
console.log(
  `  · ink-subtle sobre la placa de papel mide ${subtleOnPlate.toFixed(2)}.`
)
console.log(
  subtleOnPlate >= 4.5
    ? '    Pasa: la etiqueta mono puede ir sobre la placa invertida.'
    : '    NO pasa: sobre la placa, las etiquetas van en hollín, no en ceniza.'
)

if (failures > 0) {
  console.error(`\n  ${failures} problema(s) de paleta.\n`)
  process.exit(1)
}
console.log('\n  Paleta consistente y todos los pisos se cumplen.\n')
