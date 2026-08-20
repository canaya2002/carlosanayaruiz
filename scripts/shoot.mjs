/**
 * Captura una URL a varios anchos con emulación de dispositivo REAL.
 *
 *   node scripts/shoot.mjs http://localhost:3600/es salida
 *
 * Por qué no basta `chrome --headless --window-size=390,1400 --screenshot`:
 * ese flag fija el tamaño de la VENTANA, no el viewport de layout ni el modo
 * móvil. La página se maqueta como escritorio y la captura recorta los
 * primeros 390px — se ve idéntico a un bug de desbordamiento y no lo es.
 * Diagnostiqué mal exactamente así una vez.
 *
 * `Emulation.setDeviceMetricsOverride` con `mobile: true` sí cambia el viewport
 * de layout, que es lo que responde a las media queries.
 */
import { spawn } from 'node:child_process'
import { writeFile } from 'node:fs/promises'
import { setTimeout as sleep } from 'node:timers/promises'

const CHROME =
  process.env.CHROME_PATH ??
  'C:/Program Files/Google/Chrome/Application/chrome.exe'

const url = process.argv[2] ?? 'http://localhost:3600/es'
const prefix = process.argv[3] ?? 'shot'
const PORT = 9456

const VIEWS = [
  { name: 'movil', width: 390, height: 1500, mobile: true },
  { name: 'tablet', width: 834, height: 1400, mobile: true },
  { name: 'desktop', width: 1440, height: 1500, mobile: false },
]

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
    '--hide-scrollbars',
    '--user-data-dir=' + (process.env.TEMP ?? '/tmp') + '/cdp-shoot',
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
  console.error('No se pudo conectar a Chrome.')
  process.exit(1)
}

const ws = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((r) => ws.addEventListener('open', r, { once: true }))

let id = 0
for (const view of VIEWS) {
  await cdp(ws, ++id, 'Emulation.setDeviceMetricsOverride', {
    width: view.width,
    height: view.height,
    deviceScaleFactor: 1,
    mobile: view.mobile,
  })
  await cdp(ws, ++id, 'Page.navigate', { url })
  // Deja asentar fuentes, imágenes y la secuencia de entrada.
  await sleep(2200)

  const { data } = await cdp(ws, ++id, 'Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false,
  })
  const file = `${prefix}-${view.name}.png`
  await writeFile(file, Buffer.from(data, 'base64'))
  console.log(`  ${file}  ${view.width}x${view.height}  mobile=${view.mobile}`)
}

ws.close()
chrome.kill()
