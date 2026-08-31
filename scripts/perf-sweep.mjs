/**
 * Barre TODAS las rutas midiendo el reposo, con una sola instancia de Chrome.
 *
 *   node scripts/perf-sweep.mjs http://localhost:3000
 *
 * ── POR QUÉ EXISTE ──
 * `check:perf` mide UNA página. Yo medí cuatro de dieciséis, las encontré
 * limpias, y escribí que el sitio estaba verificado. Cuatro páginas de servicio
 * estaban a 179-182 recálculos en reposo contra un presupuesto de 20, y se
 * desplegaron así. El defecto no fue del código: fue generalizar desde una
 * muestra en un chequeo que es barato de correr entero.
 *
 * Una sola instancia de Chrome para las 16 rutas: reutilizar la pestaña hace
 * que el barrido complete tarde lo mismo que tres invocaciones sueltas.
 */
import { spawn } from 'node:child_process'
import { setTimeout as sleep } from 'node:timers/promises'
import { resolveChrome } from './chrome-path.mjs'

const CHROME = resolveChrome()
const base = (process.argv[2] ?? 'http://localhost:3000').replace(/\/$/, '')
const PORT = 9691
const IDLE_BUDGET = 20

// Las rutas en español; el inglés comparte plantilla, así que se muestrean dos
// para confirmar que la traducción no cambia el coste.
const PATHS = [
  '/es', '/es/servicios', '/es/seo-tecnico', '/es/desarrollo-web',
  '/es/automatizacion-ia', '/es/dashboards', '/es/proyectos', '/es/premios',
  '/es/certificaciones', '/es/cv', '/es/sobre-mi', '/es/libros',
  '/es/contacto', '/es/privacidad', '/es/terminos',
  '/en', '/en/projects',
]

const chrome = spawn(
  CHROME,
  [
    '--headless=new', '--disable-gpu', '--hide-scrollbars',
    `--remote-debugging-port=${PORT}`, '--no-first-run',
    '--user-data-dir=' + (process.env.TEMP ?? '/tmp') + '/cdp-perf-sweep',
    'about:blank',
  ],
  { stdio: 'ignore' }
)

let target
for (let i = 0; i < 40; i++) {
  await sleep(300)
  try {
    const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()
    target = list.find((t) => t.type === 'page')
    if (target?.webSocketDebuggerUrl) break
  } catch {
    /* Chrome todavía no levantó */
  }
}
if (!target) {
  chrome.kill()
  console.error('No se pudo conectar a Chrome.')
  process.exit(1)
}

const ws = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((r) => ws.addEventListener('open', r, { once: true }))

let id = 0
const cdp = (method, params) =>
  new Promise((resolve, reject) => {
    const i = ++id
    const onMessage = (event) => {
      const msg = JSON.parse(event.data)
      if (msg.id !== i) return
      ws.removeEventListener('message', onMessage)
      if (msg.error) reject(new Error(JSON.stringify(msg.error)))
      else resolve(msg.result)
    }
    ws.addEventListener('message', onMessage)
    ws.send(JSON.stringify({ id: i, method, params }))
  })

await cdp('Performance.enable', {})
await cdp('Emulation.setDeviceMetricsOverride', {
  width: 1440, height: 900, deviceScaleFactor: 1, mobile: false,
})

const read = async () => {
  const { metrics } = await cdp('Performance.getMetrics', {})
  const get = (n) => metrics.find((m) => m.name === n)?.value ?? 0
  return { layouts: get('LayoutCount'), styles: get('RecalcStyleCount') }
}

console.log(`\n  ${base}   reposo de 3 s, presupuesto ${IDLE_BUDGET} recálculos y 0 layouts\n`)

let failures = 0
for (const path of PATHS) {
  await cdp('Page.navigate', { url: base + path })
  // 5 s de asentamiento: con menos se captura el layout de arranque de los
  // ResizeObserver de los carruseles y se culpa al sitio de algo que no es.
  await sleep(5000)
  const before = await read()
  await sleep(3000)
  const after = await read()
  const layouts = after.layouts - before.layouts
  const styles = after.styles - before.styles
  const ok = layouts === 0 && styles <= IDLE_BUDGET
  if (!ok) failures++
  console.log(
    `  ${ok ? '✓' : '✗'}  ${path.padEnd(24)} layouts=${String(layouts).padStart(3)}  recálculos=${String(styles).padStart(4)}`
  )
}

console.log(
  '\n  ' +
    (failures === 0
      ? 'Las ' + PATHS.length + ' rutas dentro del presupuesto.'
      : failures + ' ruta(s) fuera del presupuesto.') +
    '\n'
)

ws.close()
chrome.kill()
process.exit(failures === 0 ? 0 : 1)
