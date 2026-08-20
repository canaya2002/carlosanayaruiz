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
  const re = /--([a-z-]+):\s*(#[0-9a-fA-F]{6})\s*;/g
  let m
  while ((m = re.exec(block))) tokens[m[1]] = m[2].toLowerCase()
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

/** Stops del gradiente de relleno. Todos llevan texto blanco encima. */
const ON_FILL = [
  { token: 'brand', min: 4.5 },
  { token: 'brand-strong', min: 4.5 },
  { token: 'sky-ink', min: 4.5 },
  { token: 'cyan-ink', min: 4.5 },
]

/**
 * Opacidades reales del sistema. Si cambian en globals.css, cambian aquí.
 * AURORA_PEAK es el campo más oscuro (azul de marca), que es el peor caso.
 */
const AURORA_PEAK = 0.3
const GLASS = 0.62
const GLASS_STRONG = 0.74

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

console.log('\n  texto blanco sobre relleno')
console.log('  ' + '─'.repeat(58))
for (const { token, min } of ON_FILL) {
  const ratio = contrast('#ffffff', tokens[token])
  const ok = ratio >= min
  if (!ok) failures++
  console.log(
    `  ${ok ? '✓' : '✗'}  blanco / ${token.padEnd(18)} ${ratio.toFixed(2).padStart(6)}  (min ${min})`
  )
}

/**
 * ── CASOS COMPUESTOS: cristal sobre aurora ──────────────────────────
 *
 * Esta es la sección que más importa, porque es el caso que casi se rompió al
 * saturar el fondo para que el cristal fuera visible.
 *
 * Un token puede pasar contraste sobre el fondo plano y fallar sobre el mismo
 * fondo con una aurora detrás y un panel de cristal en medio. Medir solo el
 * caso simple da una falsa sensación de seguridad: `ink-subtle` pasa 4.96 sobre
 * el fondo y cae a 4.30 sobre `.glass`.
 */
const auroraBg = compose(tokens.brand, tokens.ground, AURORA_PEAK)
const onGlass = compose('#ffffff', auroraBg, GLASS)
const onGlassStrong = compose('#ffffff', auroraBg, GLASS_STRONG)

const COMPOSITE = [
  { token: 'ink', bg: auroraBg, where: 'directo sobre aurora', min: 4.5 },
  { token: 'ink', bg: onGlass, where: 'sobre .glass', min: 4.5 },
  { token: 'ink-muted', bg: onGlass, where: 'sobre .glass', min: 4.5 },
  { token: 'brand-strong', bg: onGlass, where: 'sobre .glass', min: 4.5 },
  { token: 'ink-subtle', bg: onGlassStrong, where: 'sobre .glass-strong', min: 4.5 },
]

console.log('\n  compuestos: aurora + cristal')
console.log('  ' + '─'.repeat(58))
console.log(`  aurora al ${AURORA_PEAK * 100}% sobre fondo = ${auroraBg}`)
console.log(`  cristal ${GLASS * 100}% encima = ${onGlass}`)
console.log(`  cristal ${GLASS_STRONG * 100}% encima = ${onGlassStrong}`)
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
 * Las dos reglas que se derivan de los números de arriba, impresas cada vez
 * para que nadie las tenga que recordar.
 */
const subtleOnGlass = contrast(tokens['ink-subtle'], onGlass)
const mutedOnAurora = contrast(tokens['ink-muted'], auroraBg)

console.log('\n  reglas que salen de estos números')
console.log('  ' + '─'.repeat(58))
console.log(
  `  · ink-subtle sobre .glass mide ${subtleOnGlass.toFixed(2)} y NO pasa.`
)
console.log('    Un panel que lleve ink-subtle tiene que ser .glass-strong.')
console.log(
  `  · ink-muted directo sobre la aurora mide ${mutedOnAurora.toFixed(2)} y NO pasa.`
)
console.log('    Texto sin cristal de por medio solo puede ser ink.')

if (failures > 0) {
  console.error(`\n  ${failures} problema(s) de paleta.\n`)
  process.exit(1)
}
console.log('\n  Paleta consistente y todos los pisos se cumplen.\n')
