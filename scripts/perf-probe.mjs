/**
 * Mide el costo real de las animaciones de una página.
 *
 *   node scripts/perf-probe.mjs http://localhost:4300/es
 *
 * Existe porque "se siente lento" es un dato, no una opinión, y la causa casi
 * nunca está donde uno cree. Mide tres cosas concretas:
 *
 * 1. LAYOUTS FORZADOS POR MOVER EL MOUSE. Envía 120 eventos sintéticos y compara
 *    `LayoutCount` antes y después. Si sube, hay algo leyendo geometría
 *    (`getBoundingClientRect`, `offsetTop`...) dentro del handler, lo que obliga
 *    al navegador a recalcular layout en cada evento. Es la causa número uno de
 *    "responde lento" que Lighthouse no reporta, porque solo aparece cuando hay
 *    un puntero moviéndose.
 *
 * 2. REPINTADO EN REPOSO. Deja la página quieta y mide layouts y recálculos de
 *    estilo sin interacción. Una animación bien hecha (transform/opacity) corre
 *    en el compositor y no genera ninguno; una que anima `background-position`
 *    repinta en cada frame para siempre.
 *
 * 3. TAREAS LARGAS. Cualquier tarea >50 ms bloquea la respuesta a un clic.
 */
import { spawn } from 'node:child_process'
import { setTimeout as sleep } from 'node:timers/promises'

const CHROME =
  process.env.CHROME_PATH ??
  'C:/Program Files/Google/Chrome/Application/chrome.exe'

const url = process.argv[2] ?? 'http://localhost:4300/es'

/**
 * Presupuesto de recálculos de estilo en 3 s en reposo.
 *
 * A 60 fps, UNA animación no compuesta genera ~180 en 3 s: un recálculo por
 * frame. Eso es lo que este número tiene que detectar. Un indicador pequeño y
 * legítimo (el punto pulsante de 8 px del sitio) produce dos o tres, así que un
 * umbral de 5 lloraba lobo por algo sano.
 *
 * Histórico medido en /es: 181 recálculos con `content-visibility: auto` puesto
 * en las secciones de abajo, 7 sin él. Esa propiedad obliga al navegador a
 * reevaluar cada frame si el subárbol ya es relevante, y como las animaciones
 * decorativas corren en bucle infinito, había frames —y por tanto recálculos—
 * para siempre.
 *
 * Si esto vuelve a pasar de 20, busca qué empezó a animar un fondo, o qué
 * subárbol volvió a pedir revisión por frame.
 */
const IDLE_BUDGET = 20
const PORT = 9471

async function cdp(ws, id, method, params) {
  return new Promise((resolve, reject) => {
    const onMessage = (event) => {
      const msg = JSON.parse(event.data)
      if (msg.id !== id) return
      ws.removeEventListener('message', onMessage)
      msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result)
    }
    ws.addEventListener('message', onMessage)
    ws.send(JSON.stringify({ id, method, params }))
  })
}

const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    '--enable-gpu-rasterization',
    `--remote-debugging-port=${PORT}`,
    '--no-first-run',
    '--hide-scrollbars',
    '--user-data-dir=' + (process.env.TEMP ?? '/tmp') + '/cdp-perf',
    'about:blank',
  ],
  { stdio: 'ignore' }
)

let target
for (let attempt = 0; attempt < 40; attempt++) {
  await sleep(300)
  try {
    const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()
    target = list.find((t) => t.type === 'page')
    if (target?.webSocketDebuggerUrl) break
  } catch {
    /* Chrome aun no levanto */
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
const metrics = async () => {
  const { metrics: m } = await cdp(ws, ++id, 'Performance.getMetrics')
  return Object.fromEntries(m.map((x) => [x.name, x.value]))
}

await cdp(ws, ++id, 'Performance.enable')
await cdp(ws, ++id, 'Emulation.setDeviceMetricsOverride', {
  width: 1440,
  height: 900,
  deviceScaleFactor: 1,
  mobile: false,
})
await cdp(ws, ++id, 'Page.enable')
await cdp(ws, ++id, 'Runtime.enable')
await cdp(ws, ++id, 'Page.addScriptToEvaluateOnNewDocument', {
  source:
    'window.__long = [];' +
    'try { new PerformanceObserver(function(l){' +
    'for (const e of l.getEntries()) window.__long.push(Math.round(e.duration));' +
    '}).observe({ entryTypes: ["longtask"] }); } catch (e) {}',
})

await cdp(ws, ++id, 'Page.navigate', { url })
await sleep(3500)

console.log('\n  ' + url + '\n')

// ── 1. Reposo ─────────────────────────────────────────────────────
const idleBefore = await metrics()
await sleep(3000)
const idleAfter = await metrics()

const idleLayouts = idleAfter.LayoutCount - idleBefore.LayoutCount
const idleStyles = idleAfter.RecalcStyleCount - idleBefore.RecalcStyleCount

console.log('  EN REPOSO (3 s sin tocar nada)')
console.log('    layouts:            ' + idleLayouts)
console.log('    recalculos estilo:  ' + idleStyles)
console.log(
  '    ' +
    (idleLayouts === 0 && idleStyles <= IDLE_BUDGET
      ? 'OK  las animaciones corren en el compositor'
      : 'MAL algo repinta en reposo (presupuesto: ' + IDLE_BUDGET + ')')
)

// ── 2. Mover el mouse ─────────────────────────────────────────────
const moveBefore = await metrics()
const MOVES = 120
for (let i = 0; i < MOVES; i++) {
  await cdp(ws, ++id, 'Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: 200 + ((i * 9) % 1000),
    y: 150 + ((i * 5) % 600),
  })
}
await sleep(600)
const moveAfter = await metrics()

const moveLayouts = moveAfter.LayoutCount - moveBefore.LayoutCount
const moveStyles = moveAfter.RecalcStyleCount - moveBefore.RecalcStyleCount
const moveLayoutMs = (moveAfter.LayoutDuration - moveBefore.LayoutDuration) * 1000

console.log('\n  MOVER EL MOUSE (' + MOVES + ' eventos)')
console.log(
  '    layouts:            ' +
    moveLayouts +
    '  (' +
    (moveLayouts / MOVES).toFixed(2) +
    ' por evento)'
)
console.log('    recalculos estilo:  ' + moveStyles)
console.log('    tiempo en layout:   ' + moveLayoutMs.toFixed(1) + ' ms')
console.log(
  '    ' +
    (moveLayouts <= 2
      ? 'OK  mover el mouse no fuerza layout'
      : 'MAL layout forzado en el handler de pointermove')
)

// ── 3. Scroll ─────────────────────────────────────────────────────
const scrollBefore = await metrics()
for (let i = 0; i < 30; i++) {
  await cdp(ws, ++id, 'Input.dispatchMouseEvent', {
    type: 'mouseWheel',
    x: 700,
    y: 400,
    deltaX: 0,
    deltaY: 120,
  })
  await sleep(16)
}
await sleep(800)
const scrollAfter = await metrics()

console.log('\n  SCROLL (30 pasos de rueda)')
console.log('    layouts:            ' + (scrollAfter.LayoutCount - scrollBefore.LayoutCount))
console.log(
  '    recalculos estilo:  ' +
    (scrollAfter.RecalcStyleCount - scrollBefore.RecalcStyleCount)
)

// ── 4. Tareas largas ──────────────────────────────────────────────
const { result } = await cdp(ws, ++id, 'Runtime.evaluate', {
  expression: 'JSON.stringify(window.__long || [])',
  returnByValue: true,
})
const long = JSON.parse(result.value)
console.log('\n  TAREAS LARGAS (>50 ms bloquean la respuesta a un clic)')
console.log(
  '    ' + (long.length === 0 ? 'OK  ninguna' : 'MAL ' + long.length + ': ' + long.join(', ') + ' ms')
)

const totals = await metrics()
console.log('\n  TOTALES DE LA SESION')
console.log('    nodos DOM:          ' + totals.Nodes)
console.log('    layouts:            ' + totals.LayoutCount)
console.log('    recalculos estilo:  ' + totals.RecalcStyleCount)
console.log('    JS heap:            ' + (totals.JSHeapUsedSize / 1048576).toFixed(1) + ' MB\n')

ws.close()
chrome.kill()
