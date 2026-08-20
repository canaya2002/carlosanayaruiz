/**
 * Verifica que PALETTE_HEX en lib/constants.ts siga coincidiendo con los
 * tokens de app/globals.css.
 *
 *   node scripts/palette-check.mjs
 *
 * La tabla de hex existe porque tres consumidores no pueden leer una variable
 * CSS: el manifiesto PWA, el `themeColor` del viewport y Satori en lib/og.tsx.
 * Una copia derivada se podre en silencio — las tres ya habían derivado de
 * --brand por un margen visible antes de que este chequeo existiera.
 *
 * También comprueba los pisos de contraste WCAG que el sistema declara, porque
 * un token que se "aclara un poquito" es exactamente cómo se rompe un piso sin
 * que nadie lo note.
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

/* ── parseo ──────────────────────────────────────────────────────── */

/** Lee `--nombre: #rrggbb;` del bloque :root de globals.css. */
function parseCssTokens(css) {
  const start = css.indexOf(':root {')
  if (start === -1) throw new Error('No hay bloque :root en globals.css')
  const open = css.indexOf('{', start)
  const close = css.indexOf('\n}', open)
  const block = css.slice(open, close)

  const tokens = {}
  const re = /--([a-z-]+):\s*(#[0-9a-fA-F]{6})\s*;/g
  let m
  while ((m = re.exec(block))) tokens[m[1]] = m[2].toLowerCase()
  return tokens
}

/** Lee el objeto PALETTE_HEX.light directamente del fuente TS. */
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
 * Los pisos que el sistema declara en los comentarios de globals.css.
 * `min` es la razón de contraste mínima aceptable contra `against`.
 *
 * `cyan` aparece a propósito con un piso de 0: está documentado como
 * decorativo puro (mide ~2.4:1) y no debe fallar el chequeo — pero sí debe
 * quedar registrado aquí para que nadie lo confunda con un color de texto.
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
  // Piso 0 a propósito: documentados como decorativos puros. Quedan
  // listados para que nadie los confunda con colores de texto.
  { token: 'sky', against: 'ground', min: 0, use: 'SOLO decorativo (2.7:1)' },
  { token: 'cyan', against: 'ground', min: 0, use: 'SOLO decorativo (1.8:1)' },
]

/** Texto blanco sobre rellenos de botón. */
// Los stops del gradiente de RELLENO (--grad-fill). Todos llevan texto
// blanco encima, así que todos tienen que pasar 4.5:1. El gradiente
// decorativo (--grad) NO va aquí porque nunca lleva texto: sus stops sky
// y cyan darían 2.77:1 y 1.68:1 contra blanco.
const ON_FILL = [
  { token: 'brand', min: 4.5 },
  { token: 'brand-strong', min: 4.5 },
  { token: 'sky-ink', min: 4.5 },
  { token: 'cyan-ink', min: 4.5 },
]

/* ── ejecución ───────────────────────────────────────────────────── */

const css = await readFile(path.join(ROOT, 'app', 'globals.css'), 'utf8')
const ts = await readFile(path.join(ROOT, 'lib', 'constants.ts'), 'utf8')

const tokens = parseCssTokens(css)
const declared = parseDeclared(ts)

let failures = 0

console.log('\n  espejo PALETTE_HEX ↔ globals.css')
console.log('  ' + '─'.repeat(56))
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

console.log('\n  pisos de contraste')
console.log('  ' + '─'.repeat(56))
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
    `  ${ok ? '✓' : '✗'}  ${label.padEnd(26)} ${ratio.toFixed(2).padStart(6)}` +
      `  (min ${min})  ${use}`
  )
}

console.log('\n  texto blanco sobre relleno')
console.log('  ' + '─'.repeat(56))
for (const { token, min } of ON_FILL) {
  const ratio = contrast('#ffffff', tokens[token])
  const ok = ratio >= min
  if (!ok) failures++
  console.log(
    `  ${ok ? '✓' : '✗'}  blanco / ${token.padEnd(16)} ${ratio.toFixed(2).padStart(6)}  (min ${min})`
  )
}

if (failures > 0) {
  console.error(`\n  ${failures} problema(s) de paleta.\n`)
  process.exit(1)
}
console.log('\n  Paleta consistente y todos los pisos de contraste se cumplen.\n')
