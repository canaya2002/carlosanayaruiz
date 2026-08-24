/**
 * ════════════════════════════════════════════════════════════════
 * vercel:env — sube las variables de .env.local a Vercel
 *
 *   npx vercel login          ← una vez, interactivo
 *   npx vercel link           ← una vez, elige el proyecto carlosanayaruiz
 *   node scripts/vercel-env.mjs           (informa, no escribe)
 *   node scripts/vercel-env.mjs --aplicar (escribe)
 *
 * ── POR QUÉ ESTE SCRIPT ──
 * Las variables son quince y hay que ponerlas en dos o tres entornos cada una.
 * A mano, en el panel, son cuarenta campos y un despiste basta para dejar una
 * vacía — que es exactamente el bug que ya rompió el formulario una vez: una
 * variable declarada y en blanco no cae al valor por omisión.
 *
 * ── QUÉ NO HACE, Y ES DELIBERADO ──
 * No inventa valores ni sube lo que esté vacío en .env.local: una variable
 * ausente hace que su pieza diga honestamente que no está conectada, mientras
 * una vacía la deja a medias. Y NO sube nada que empiece por NEXT_PUBLIC_ sin
 * avisar de que eso viaja al navegador de todo el mundo.
 * ════════════════════════════════════════════════════════════════
 */
import { readFileSync, existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const APLICAR = process.argv.includes('--aplicar')

/**
 * Qué variable va a qué entornos.
 *
 * Las `NEXT_PUBLIC_*` van a los tres porque se sustituyen en el build y hacen
 * falta también en desarrollo. Los secretos van a producción y preview: en
 * desarrollo se leen de .env.local, que nunca sale de la máquina.
 */
const ENTORNOS = {
  NEXT_PUBLIC_CAL_LINK: ['production', 'preview', 'development'],
  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: ['production', 'preview', 'development'],
  NEXT_PUBLIC_BING_SITE_VERIFICATION: ['production', 'preview', 'development'],
  NEXT_PUBLIC_WHATSAPP: ['production', 'preview', 'development'],

  RESEND_API_KEY: ['production', 'preview'],
  CONTACT_FROM: ['production', 'preview'],
  CONTACT_TO: ['production', 'preview'],

  RESEND_AUDIENCE_ID: ['production', 'preview'],
  NEWSLETTER_ENDPOINT: ['production', 'preview'],
  NEWSLETTER_TOKEN: ['production', 'preview'],
  NEWSLETTER_FROM: ['production', 'preview'],
  NEWSLETTER_FIELD: ['production', 'preview'],

  CRON_SECRET: ['production', 'preview'],

  LEAD_WEBHOOK_URL: ['production', 'preview'],
  LEAD_WEBHOOK_AUTH: ['production', 'preview'],
  LEAD_WEBHOOK_HEADER: ['production', 'preview'],
  LEAD_WEBHOOK_HMAC_HEADER: ['production', 'preview'],
  LEAD_WEBHOOK_TOKEN: ['production', 'preview'],
  LEAD_WEBHOOK_ONLY: ['production', 'preview'],
  LEAD_WEBHOOK_EXTRA: ['production', 'preview'],
  LEAD_WEBHOOK_FIELDS: ['production', 'preview'],
  LEAD_WEBHOOK_FORMAT: ['production', 'preview'],
  LEAD_WEBHOOK_METHOD: ['production', 'preview'],
  LEAD_WEBHOOK_TIMEOUT_MS: ['production', 'preview'],
  LEAD_WEBHOOK_RETRIES: ['production', 'preview'],

  SUPABASE_URL: ['production', 'preview'],
  SUPABASE_SERVICE_ROLE_KEY: ['production', 'preview'],
  SUPABASE_LEADS_TABLE: ['production', 'preview'],
}

if (!existsSync('.env.local')) {
  console.error('no encuentro .env.local')
  process.exit(1)
}

/** Lector de .env: solo pares KEY=valor, ignora comentarios y líneas vacías. */
function leerEnv(ruta) {
  const out = {}
  for (const linea of readFileSync(ruta, 'utf8').split('\n')) {
    const t = linea.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i < 1) continue
    const clave = t.slice(0, i).trim()
    let valor = t.slice(i + 1).trim()
    // Quita comentarios en línea solo si van tras un espacio, para no romper
    // un valor que lleve # (una clave, por ejemplo).
    const h = valor.indexOf(' #')
    if (h > 0) valor = valor.slice(0, h).trim()
    if (valor.startsWith('"') && valor.endsWith('"')) valor = valor.slice(1, -1)
    out[clave] = valor
  }
  return out
}

const env = leerEnv('.env.local')

const conValor = []
const vacias = []
const desconocidas = []

for (const [clave, valor] of Object.entries(env)) {
  if (!(clave in ENTORNOS)) {
    desconocidas.push(clave)
    continue
  }
  if (valor === '') vacias.push(clave)
  else conValor.push(clave)
}

const publicas = conValor.filter((k) => k.startsWith('NEXT_PUBLIC_'))

console.log('')
console.log(`  con valor y listas para subir:  ${conValor.length}`)
for (const k of conValor) {
  const v = env[k]
  // Nunca se imprime un secreto entero.
  const muestra =
    v.length > 14 && !k.startsWith('NEXT_PUBLIC_')
      ? v.slice(0, 6) + '…' + v.slice(-4)
      : v
  console.log(`    ${k.padEnd(38)} ${muestra}`)
}

if (vacias.length) {
  console.log('')
  console.log(`  VACÍAS — no se suben, y es correcto: ${vacias.length}`)
  console.log('    (una variable ausente apaga su pieza; una vacía la deja a medias)')
  for (const k of vacias) console.log(`    ${k}`)
}

if (desconocidas.length) {
  console.log('')
  console.log(`  no reconocidas — revisa si sobran: ${desconocidas.join(', ')}`)
}

if (publicas.length) {
  console.log('')
  console.log(`  ⚠ ${publicas.length} llevan prefijo NEXT_PUBLIC_ y VIAJAN AL NAVEGADOR:`)
  console.log(`    ${publicas.join(', ')}`)
  console.log('    Ninguna de estas puede ser un secreto. Compruébalo antes de aplicar.')
}

if (!APLICAR) {
  console.log('')
  console.log('  Esto fue un ensayo. Para escribir de verdad:')
  console.log('    npx vercel login   &&   npx vercel link   &&   node scripts/vercel-env.mjs --aplicar')
  console.log('')
  process.exit(0)
}

console.log('')
console.log('  escribiendo en Vercel…')
console.log('')

let ok = 0
let fallos = 0

for (const clave of conValor) {
  for (const entorno of ENTORNOS[clave]) {
    try {
      // El valor va por stdin: así no aparece en la lista de procesos ni en el
      // historial del shell.
      execFileSync(
        'npx',
        ['vercel', 'env', 'add', clave, entorno, '--force'],
        { input: env[clave] + '\n', stdio: ['pipe', 'pipe', 'pipe'], shell: true }
      )
      console.log(`    ✓ ${clave} · ${entorno}`)
      ok++
    } catch (e) {
      const salida = (e.stderr?.toString() || e.stdout?.toString() || e.message).trim()
      console.error(`    ✗ ${clave} · ${entorno} — ${salida.split('\n').pop()}`)
      fallos++
    }
  }
}

console.log('')
console.log(`  escritas: ${ok} · fallidas: ${fallos}`)
console.log('')
console.log('  ⚠ FALTA UN REDESPLIEGUE: las variables se leen en el build.')
console.log('    npx vercel --prod')
console.log('')

process.exit(fallos ? 1 : 0)
