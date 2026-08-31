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
import { resolveChrome } from './chrome-path.mjs'

const CHROME = resolveChrome()

const url = process.argv[2] ?? 'http://localhost:3600/es'
const WIDTHS = [360, 390, 414, 768, 1024, 1440]
const PORT = 9455

/**
 * Se evalúa dentro de la página. Devuelve JSON serializable.
 *
 * ── POR QUÉ NO BASTA CON "SU BORDE DERECHO REBASA EL VIEWPORT" ──
 * Desde que el sitio tiene carruseles, esa regla sola reporta cientos de falsos
 * culpables: un carril de `scroll-snap` con hijos de ancho fijo TIENE que
 * extenderse más allá del viewport — eso es lo que hace que se pueda desplazar.
 * Lo mismo pasa con los cuatro campos de la aurora, que son óvalos enormes
 * dentro de una sección `overflow-hidden`.
 *
 * Medido en /es a 360px: 203 elementos rebasaban el viewport y CERO desbordaban
 * de verdad (171 dentro de un carril, 32 dentro de un clip).
 *
 * ── LA TRAMPA: SÍNTOMA CONTRA CAUSA ──
 * Un elemento reportado no es necesariamente la causa. Si algo infla el ancho
 * del documento, TODO bloque que mida 100% se estira con él y aparece en la
 * lista. Me pasó: el reporte culpaba al header pegajoso a 1178px y el header
 * estaba impecable — la causa era un carril de carrusel sin `min-width: 0`,
 * cuyo min-content (la suma de sus láminas de ancho fijo) inflaba a su padre.
 *
 * Por eso hay una segunda sección, `rieles`: para cada elemento con scroll
 * propio se compara su ancho contra el hueco de su padre. Un riel más ancho que
 * su contenedor no está desplazándose, está fugándose — y ESO sí es la causa.
 * Se revisa antes que la lista de estorbos.
 *
 * Entonces un elemento solo estorba si NINGÚN ancestro lo contiene: ni un
 * carril desplazable (`overflow-x: auto|scroll`) ni una sección recortada
 * (`hidden|clip`). Se reportan aparte los contenidos, para que quede visible
 * que se midieron y no que se ignoraron.
 */
const PROBE = `(() => {
  const vw = document.documentElement.clientWidth
  const offenders = []
  const contained = { rail: 0, clip: 0 }

  /** Devuelve 'rail', 'clip' o null: quién recorta a este elemento, si alguien. */
  const containedBy = (el) => {
    for (let p = el.parentElement; p && p !== document.documentElement; p = p.parentElement) {
      const ox = getComputedStyle(p).overflowX
      if (ox === 'auto' || ox === 'scroll') return 'rail'
      if (ox === 'hidden' || ox === 'clip') return 'clip'
    }
    return null
  }

  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect()
    if (r.width === 0 && r.height === 0) continue
    // Un elemento estorba si es más ancho que el viewport o si su borde
    // derecho lo rebasa. El margen de 1px absorbe redondeos subpíxel.
    if (r.width > vw + 1 || r.right > vw + 1) {
      const by = containedBy(el)
      if (by) { contained[by]++; continue }
      const cls = typeof el.className === 'string' ? el.className : ''
      offenders.push({
        tag: el.tagName.toLowerCase(),
        cls: cls.slice(0, 90),
        w: Math.round(r.width),
        right: Math.round(r.right),
      })
    }
  }
  // Un scroller sano nunca es mas ancho que el hueco de su padre: para eso
  // tiene scroll. Si lo es, su min-content gano y esta empujando el layout.
  const leaks = []
  for (const el of document.querySelectorAll('*')) {
    const ox = getComputedStyle(el).overflowX
    if (ox !== 'auto' && ox !== 'scroll') continue
    const parent = el.parentElement
    if (!parent) continue
    const ps = getComputedStyle(parent)
    const room =
      parent.getBoundingClientRect().width -
      parseFloat(ps.paddingLeft) -
      parseFloat(ps.paddingRight)
    const w = el.getBoundingClientRect().width
    if (w > room + 1) {
      const cls = typeof el.className === 'string' ? el.className : ''
      leaks.push({
        tag: el.tagName.toLowerCase(),
        cls: cls.slice(0, 70),
        w: Math.round(w),
        room: Math.round(room),
        fix: 'falta min-width: 0 en el scroller o en un ancestro flex/grid',
      })
    }
  }

  // Tercer diagnostico: la FILA DEL HEADER contra su propio ancho.
  //
  // Es generico a proposito. La causa concreta que lo motivo fue que el nav de
  // escritorio conmutaba en lg y la hamburguesa en xl, asi que entre 1024 y
  // 1279px se dibujaban los dos y la fila pedia 1178px teniendo 960. Pero el
  // mismo desborde lo produce una etiqueta de nav mas larga al traducir, un
  // enlace nuevo, o un boton que crece. Sumar los hijos visibles y comparar
  // contra el hueco los atrapa todos, sin depender de que clase los oculta.
  let headerRow = null
  const rowEl = document.querySelector('header')?.querySelector('div > div')
  if (rowEl) {
    const rs = getComputedStyle(rowEl)
    const gap = parseFloat(rs.columnGap) || 0
    const kids = [...rowEl.children].filter(
      (c) => getComputedStyle(c).display !== 'none' && getComputedStyle(c).position !== 'absolute'
    )
    const need =
      kids.reduce((a, c) => a + c.getBoundingClientRect().width, 0) +
      gap * Math.max(0, kids.length - 1)
    const room = rowEl.getBoundingClientRect().width
    if (need > room + 1) {
      headerRow = {
        need: Math.round(need),
        room: Math.round(room),
        kids: kids.map((c) => {
          const cls = typeof c.className === 'string' ? c.className : ''
          return (
            c.tagName.toLowerCase() +
            '[' + cls.slice(0, 34) + '] w=' +
            Math.round(c.getBoundingClientRect().width)
          )
        }),
      }
    }
  }

  return {
    vw,
    headerRow,
    leaks,
    scrollW: document.documentElement.scrollWidth,
    bodyScrollW: document.body.scrollWidth,
    contained,
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
      if (msg.error) reject(new Error(JSON.stringify(msg.error)))
      else resolve(msg.result)
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
  const ok =
    overflow <= 1 && r.total === 0 && r.leaks.length === 0 && !r.headerRow

  if (!ok) failures++

  console.log(
    `  ${ok ? '✓' : '✗'}  ${String(width).padStart(4)}px  ` +
      `scrollWidth=${String(r.scrollW).padStart(5)}  ` +
      `desborde=${String(overflow).padStart(5)}px  ` +
      `culpables=${r.total}  (contenidos: carril=${r.contained.rail} clip=${r.contained.clip})`
  )
  // Los rieles fugados van PRIMERO y con etiqueta: son la causa, mientras que
  // la lista de estorbos casi siempre son bloques al 100% arrastrados por ella.
  if (r.headerRow) {
    console.log(
      `     CAUSA  la fila del header pide ${r.headerRow.need}px y tiene ${r.headerRow.room}px`
    )
    for (const k of r.headerRow.kids) console.log(`            ${k}`)
    console.log(
      '            → dos grupos conmutando en breakpoints distintos, o una etiqueta que crecio'
    )
  }
  for (const l of r.leaks) {
    console.log(
      `     CAUSA  ${l.tag}.${l.cls || '(sin clase)'}  ancho=${l.w} hueco=${l.room}`
    )
    console.log(`            → ${l.fix}`)
  }
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
