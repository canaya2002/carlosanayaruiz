/**
 * Captura el nav con un desplegable ABIERTO por hover real.
 *   node scripts/hover-shot.mjs <url> <salida> [ancho]
 *
 * No basta con `Page.captureScreenshot`: el panel solo existe con el puntero
 * encima, así que hay que mover el ratón de verdad con Input.dispatchMouseEvent
 * sobre la caja del enlace. Un `:hover` forzado por CSS no reproduce las
 * animaciones de entrada, que es justo lo que se está diagnosticando.
 */
import { spawn } from 'node:child_process'
import { writeFile } from 'node:fs/promises'
import { setTimeout as sleep } from 'node:timers/promises'
import { resolveChrome } from './chrome-path.mjs'

const CHROME = resolveChrome()
const url = process.argv[2]
const prefix = process.argv[3] ?? 'hover'
const width = Number(process.argv[4] ?? 1440)
const PORT = 9471

async function cdp(ws, id, method, params) {
  return new Promise((resolve, reject) => {
    const onMessage = (e) => {
      const m = JSON.parse(e.data)
      if (m.id !== id) return
      ws.removeEventListener('message', onMessage)
      if (m.error) reject(new Error(JSON.stringify(m.error)))
      else resolve(m.result)
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
    '--hide-scrollbars',
    '--user-data-dir=' + (process.env.TMPDIR ?? '/tmp') + '/cdp-hover',
    'about:blank',
  ],
  { stdio: 'ignore' }
)

let target
for (let i = 0; i < 40; i++) {
  await sleep(300)
  try {
    const list = await (
      await fetch(`http://127.0.0.1:${PORT}/json/list`)
    ).json()
    target = list.find((t) => t.type === 'page')
    if (target?.webSocketDebuggerUrl) break
  } catch {}
}
if (!target) {
  chrome.kill()
  console.error('sin Chrome')
  process.exit(1)
}

const ws = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((r) => ws.addEventListener('open', r, { once: true }))
let id = 0

await cdp(ws, ++id, 'Emulation.setDeviceMetricsOverride', {
  width,
  height: 900,
  deviceScaleFactor: 2,
  mobile: false,
})
await cdp(ws, ++id, 'Page.navigate', { url })
await sleep(2600)

for (const label of ['Servicios', 'Trayectoria', 'Services', 'Track record']) {
  const { result } = await cdp(ws, ++id, 'Runtime.evaluate', {
    expression: `(() => {
      const a = [...document.querySelectorAll('header nav a, header a')]
        .find(el => el.textContent.trim() === ${JSON.stringify(label)});
      if (!a) return null;
      const r = a.getBoundingClientRect();
      return JSON.stringify({ x: r.x + r.width / 2, y: r.y + r.height / 2 });
    })()`,
    returnByValue: true,
  })
  if (!result.value) continue
  const { x, y } = JSON.parse(result.value)
  await cdp(ws, ++id, 'Input.dispatchMouseEvent', { type: 'mouseMoved', x, y })
  await sleep(900) // deja terminar la entrada del panel
  const { data } = await cdp(ws, ++id, 'Page.captureScreenshot', {
    format: 'png',
  })
  const slug = label.toLowerCase().replace(/\s+/g, '-')
  await writeFile(`${prefix}-${slug}.png`, Buffer.from(data, 'base64'))
  console.log(`  ${prefix}-${slug}.png  @${width}`)
  // Sacar el puntero para cerrar antes del siguiente.
  await cdp(ws, ++id, 'Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: 10,
    y: 700,
  })
  await sleep(600)
}

ws.close()
chrome.kill()
