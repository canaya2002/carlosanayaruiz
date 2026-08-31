/**
 * Prueba de interaccion del nav: hace clics reales y comprueba que el panel
 * se abra, se cierre y sea navegable con teclado.
 *
 *   node scripts/nav-test.mjs http://localhost:4800/es
 *
 * Existe porque el dueno reporto "las flechas que despliegan mas informacion
 * del nav bar no sirven" y el codigo se veia correcto. Un clic sintetico real
 * es la unica forma de saber si el problema es la logica, la hidratacion, o un
 * handler que cierra lo que otro acaba de abrir.
 */
import { spawn } from 'node:child_process'
import { setTimeout as sleep } from 'node:timers/promises'
import { resolveChrome } from './chrome-path.mjs'

const CHROME = resolveChrome()
const url = process.argv[2] ?? 'http://localhost:4800/es'
const PORT = 9481

async function cdp(ws, id, method, params) {
  return new Promise((resolve, reject) => {
    const h = (e) => {
      const m = JSON.parse(e.data)
      if (m.id !== id) return
      ws.removeEventListener('message', h)
      if (m.error) reject(new Error(JSON.stringify(m.error)))
      else resolve(m.result)
    }
    ws.addEventListener('message', h)
    ws.send(JSON.stringify({ id, method, params }))
  })
}

const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    `--remote-debugging-port=${PORT}`,
    '--no-first-run',
    '--user-data-dir=' + (process.env.TEMP ?? '/tmp') + '/cdp-nav',
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
  } catch {}
}
if (!target) {
  chrome.kill()
  console.error('No se pudo conectar a Chrome.')
  process.exit(1)
}

const ws = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((r) => ws.addEventListener('open', r, { once: true }))

let id = 0
const evaluate = async (expression) => {
  const { result } = await cdp(ws, ++id, 'Runtime.evaluate', {
    expression,
    returnByValue: true,
  })
  return result.value
}

await cdp(ws, ++id, 'Emulation.setDeviceMetricsOverride', {
  width: 1440,
  height: 900,
  deviceScaleFactor: 1,
  mobile: false,
})
await cdp(ws, ++id, 'Page.navigate', { url })
await sleep(3000)

console.log('\n  ' + url + '\n')

// ¿Hidrató? Si React no montó, ningún onClick existe y todo lo demás es ruido.
const hydrated = await evaluate(
  "!!document.querySelector('button[aria-expanded]')"
)
console.log('  botones con aria-expanded en el DOM: ' + hydrated)

const triggers = await evaluate(`
  JSON.stringify([...document.querySelectorAll('button[aria-expanded]')].map(b => ({
    label: (b.getAttribute('aria-label') || '').slice(0, 40),
    expanded: b.getAttribute('aria-expanded'),
    controls: b.getAttribute('aria-controls'),
    rect: (() => { const r = b.getBoundingClientRect(); return { x: Math.round(r.x + r.width/2), y: Math.round(r.y + r.height/2) } })(),
  })))
`)
const list = JSON.parse(triggers)
console.log('  disparadores encontrados: ' + list.length)

let failures = 0

for (const t of list) {
  // Un disparador con rect en (0,0) esta oculto en este ancho — el boton del
  // menu movil a 1440px, por ejemplo. Clicar el origen no prueba nada y daba
  // un falso negativo en cada corrida.
  if (t.rect.x === 0 && t.rect.y === 0) {
    console.log(`\n  --- "${t.label}" (oculto en este ancho, se omite)`)
    continue
  }
  console.log(`\n  --- "${t.label}"`)
  console.log(`      aria-controls=${t.controls}  centro=(${t.rect.x},${t.rect.y})`)

  const panelHiddenBefore = await evaluate(
    `document.getElementById('${t.controls}')?.hasAttribute('hidden')`
  )
  console.log('      panel oculto antes:  ' + panelHiddenBefore)

  // Clic real: mousePressed + mouseReleased en el centro del boton.
  for (const type of ['mousePressed', 'mouseReleased']) {
    await cdp(ws, ++id, 'Input.dispatchMouseEvent', {
      type,
      x: t.rect.x,
      y: t.rect.y,
      button: 'left',
      clickCount: 1,
    })
  }
  await sleep(500)

  const after = await evaluate(`
    JSON.stringify({
      hidden: document.getElementById('${t.controls}')?.hasAttribute('hidden'),
      expanded: document.querySelector('[aria-controls="${t.controls}"]')?.getAttribute('aria-expanded'),
      visibleLinks: [...(document.getElementById('${t.controls}')?.querySelectorAll('a[href]') || [])]
        .filter(a => a.getBoundingClientRect().height > 0).length,
      url: location.pathname,
    })
  `)
  const a = JSON.parse(after)
  console.log('      panel oculto despues: ' + a.hidden)
  console.log('      aria-expanded:        ' + a.expanded)
  console.log('      enlaces visibles:     ' + a.visibleLinks)
  console.log('      ruta actual:          ' + a.url)

  if (a.url !== new URL(url).pathname) {
    console.log('      FALLA: el clic NAVEGO en vez de abrir el panel')
    failures++
    // Volver para seguir probando.
    await cdp(ws, ++id, 'Page.navigate', { url })
    await sleep(2500)
    continue
  }
  if (a.hidden !== false || a.visibleLinks === 0) {
    console.log('      FALLA: el panel no se abrio')
    failures++
    continue
  }
  console.log('      OK abre')

  // Cerrar con Escape.
  await cdp(ws, ++id, 'Input.dispatchKeyEvent', {
    type: 'keyDown',
    key: 'Escape',
    code: 'Escape',
    windowsVirtualKeyCode: 27,
  })
  await sleep(350)
  const closed = await evaluate(
    `document.getElementById('${t.controls}')?.hasAttribute('hidden')`
  )
  console.log('      cierra con Escape:    ' + (closed === true ? 'OK' : 'FALLA'))
  if (closed !== true) failures++
}

console.log(
  '\n  ' + (failures === 0 ? 'Todos los desplegables funcionan.' : failures + ' fallo(s).') + '\n'
)

ws.close()
chrome.kill()
process.exit(failures === 0 ? 0 : 1)
