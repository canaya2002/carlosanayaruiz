/**
 * Captura una ruta a varios desplazamientos de scroll.
 *   node scripts/scroll-shot.mjs <url> <salida> <ancho> <y1,y2,y3>
 */
import { spawn } from 'node:child_process'
import { writeFile } from 'node:fs/promises'
import { setTimeout as sleep } from 'node:timers/promises'
import { resolveChrome } from './chrome-path.mjs'

const CHROME = resolveChrome()
const url = process.argv[2]
const prefix = process.argv[3] ?? 'scroll'
const width = Number(process.argv[4] ?? 1440)
const ys = (process.argv[5] ?? '0').split(',').map(Number)
const PORT = 9494

async function cdp(ws, id, method, params) {
  return new Promise((resolve, reject) => {
    const on = (e) => {
      const m = JSON.parse(e.data)
      if (m.id !== id) return
      ws.removeEventListener('message', on)
      if (m.error) reject(new Error(JSON.stringify(m.error)))
      else resolve(m.result)
    }
    ws.addEventListener('message', on)
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
    '--user-data-dir=' + (process.env.TMPDIR ?? '/tmp') + '/cdp-scroll',
    'about:blank',
  ],
  { stdio: 'ignore' }
)

let target
for (let i = 0; i < 40; i++) {
  await sleep(300)
  try {
    const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()
    target = l.find((t) => t.type === 'page')
    if (target?.webSocketDebuggerUrl) break
  } catch {
    /* aún no */
  }
}
const ws = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((r) => ws.addEventListener('open', r, { once: true }))
let id = 0
const mobile = width < 700
await cdp(ws, ++id, 'Emulation.setDeviceMetricsOverride', {
  width,
  height: mobile ? 820 : 900,
  deviceScaleFactor: 1,
  mobile,
})
await cdp(ws, ++id, 'Page.navigate', { url })
await sleep(3000)
for (const y of ys) {
  await cdp(ws, ++id, 'Runtime.evaluate', {
    expression: `window.scrollTo(0,${y})`,
  })
  await sleep(1400)
  const { data } = await cdp(ws, ++id, 'Page.captureScreenshot', {
    format: 'png',
  })
  await writeFile(`${prefix}-${y}.png`, Buffer.from(data, 'base64'))
  console.log(`  ${prefix}-${y}.png`)
}
ws.close()
chrome.kill()
