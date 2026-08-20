/**
 * Detecta desbordamiento horizontal en anchos de viewport reales.
 *
 *   node scripts/overflow-audit.mjs http://localhost:3600/es
 *
 * Por qué existe: `overflow-x: clip` en body (o `overflow-hidden` en una
 * sección) convierte un desbordamiento en contenido RECORTADO en silencio, sin
 * barra de scroll que lo delate. En móvil eso significa medio titular fuera de
 * pantalla y nadie se enteró — pasó exactamente eso en este sitio.
 *
 * Habla el protocolo DevTools directamente por WebSocket (nativo en Node 18+),
 * así que no hace falta instalar Puppeteer ni Playwright, y no toca el código
 * fuente para medir.
 */
import { spawn } from 'node:child_process'
import { setTimeout as sleep } from 'node:timers/promises'

const CHROME =
  process.env.CHROME_PATH ??
  'C:/Program Files/Google/Chrome/Application/chrome.exe'

const url = process.argv[2] ?? 'http://localhost:3600/es'
const WIDTHS = [360, 390, 414, 768, 1024, 1440]
const PORT = 9455

/** Se evalúa dentro de la página. Devuelve JSON serializable. */
const PROBE = `(() => {
  const vw = document.documentElement.clientWidth
  const offenders = []
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect()
    if (r.width === 0 && r.height === 0) continue
    // Un elemento estorba si es más ancho que el viewport o si su borde
    // derecho lo rebasa. El margen de 1px absorbe redondeos subpíxel.
    if (r.width > vw + 1 || r.right > vw + 1) {
      const cls = typeof el.className === 'string' ? el.className : ''
      offenders.push({
        tag: el.tagName.toLowerCase(),
        cls: cls.slice(0, 90),
        w: Math.round(r.width),
        right: Math.round(r.right),
      })
    }
  }
  return {
    vw,
    scrollW: document.documentElement.scrollWidth,
    bodyScrollW: document.body.scrollWidth,
    offenders: offenders.slice(0, 12),
    total: offenders.length,
  }
})()`

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
    '--disable-gpu',
    `--remote-debugging-port=${PORT}`,
    '--no-first-run',
    // Sin esto, clientWidth queda ~15px por debajo de 100vw y todo elemento
    // bajo el gutter de la barra de scroll se reporta como falso culpable.
    '--hide-scrollbars',
    '--user-data-dir=' + (process.env.TEMP ?? '/tmp') + '/cdp-overflow-audit',
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
    /* Chrome todavía no levantó */
  }
}
if (!target) {
  chrome.kill()
  console.error('No se pudo conectar a Chrome en el puerto de depuración.')
  process.exit(1)
}

const ws = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((r) => ws.addEventListener('open', r, { once: true }))

let id = 0
let failures = 0

console.log(`\n  ${url}\n`)

for (const width of WIDTHS) {
  await cdp(ws, ++id, 'Emulation.setDeviceMetricsOverride', {
    width,
    height: 900,
    deviceScaleFactor: 1,
    mobile: width < 768,
  })
  await cdp(ws, ++id, 'Page.navigate', { url })
  // El layout necesita asentarse tras cargar fuentes y ejecutar JS.
  await sleep(1600)

  const { result } = await cdp(ws, ++id, 'Runtime.evaluate', {
    expression: PROBE,
    returnByValue: true,
    awaitPromise: false,
  })

  const r = result.value
  const overflow = r.scrollW - r.vw
  const ok = overflow <= 1 && r.total === 0

  if (!ok) failures++

  console.log(
    `  ${ok ? '✓' : '✗'}  ${String(width).padStart(4)}px  ` +
      `scrollWidth=${String(r.scrollW).padStart(5)}  ` +
      `desborde=${String(overflow).padStart(5)}px  ` +
      `culpables=${r.total}`
  )
  for (const o of r.offenders) {
    console.log(
      `        ${o.tag}.${o.cls || '(sin clase)'}  w=${o.w} right=${o.right}`
    )
  }
}

ws.close()
chrome.kill()

if (failures > 0) {
  console.error(
    `\n  ${failures} ancho(s) con desbordamiento horizontal.\n` +
      `  Ojo: si body lleva overflow-x: clip, esto NO se ve como scrollbar —\n` +
      `  el contenido simplemente desaparece del viewport.\n`
  )
  process.exit(1)
}
console.log('\n  Sin desbordamiento horizontal en ningún ancho probado.\n')
