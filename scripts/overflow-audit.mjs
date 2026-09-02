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
const WIDTHS = [320, 360, 390, 414, 768, 1024, 1440]
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
  const contained = { rail: 0, clip: 0, body: 0 }
  /* Recortado en silencio por el 'clip' del body, y con texto dentro. */
  const cut = []

  /**
   * Devuelve 'rail', 'clip' o null: quién recorta a este elemento, si alguien.
   *
   * ⚠ '<body>' y '<html>' NO CUENTAN, y ahí estaba el agujero de esta sonda.
   * Este proyecto pone 'overflow-x: clip' en el body como red de seguridad,
   * así que al subir el árbol TODO elemento del documento encontraba un
   * recortador y se excusaba: el reporte decía «culpables=0 (contenidos:
   * clip=259)» mientras el '<h1>' de la portada —el elemento LCP— se cortaba
   * en seco a 78 px del canto en un teléfono. 259 excusados, y uno era el
   * titular.
   *
   * Un 'overflow-hidden' puesto en una SECCIÓN es intención de diseño: la
   * cinta que corre, el retrato que sangra al canto. El del body es una red.
   * La distinción es la que hace útil a la sonda.
   */
  const containedBy = (el) => {
    for (let p = el.parentElement; p && p !== document.documentElement; p = p.parentElement) {
      if (p === document.body) continue
      const ox = getComputedStyle(p).overflowX
      if (ox === 'auto' || ox === 'scroll') return 'rail'
      if (ox === 'hidden' || ox === 'clip') return 'clip'
    }
    return null
  }


  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect()
    if (r.width === 0 && r.height === 0) continue
    // Un elemento estorba si es mas ancho que el viewport o si su borde
    // derecho lo rebasa. El margen de 1px absorbe redondeos subpixel.
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

  /**
   * SEGUNDA PASADA: TEXTO RECORTADO EN SILENCIO
   *
   * La primera pasada pregunta QUIEN RECORTA y excusa a todo el que tenga un
   * ancestro con overflow hidden|clip. Eso deja un agujero por el que ya se
   * escapo un defecto real: el titular de la portada, elemento LCP, se
   * cortaba 78 px en un telefono y el reporte decia
   * "culpables=0 (clip=259)". DOS ancestros lo excusaban a la vez, y los dos
   * son legitimos: el clip del body, que es una red de seguridad, y el
   * overflow-hidden de la seccion del heroe, que existe para que el retrato
   * sangre al canto de la pantalla.
   *
   * La pregunta correcta no es quien recorta sino QUE SE RECORTA:
   *
   *   - Una caja decorativa que sangra al canto es intencion del diseno.
   *   - Una LINEA DE TEXTO cortada es un defecto, siempre, sin importar
   *     quien la corte: el visitante no puede leerla y no hay barra de
   *     scroll que se lo avise.
   *
   * Tres filtros, y cada uno tiene su motivo medido:
   *
   *   1. Solo elementos que LLEVAN TEXTO: nodos de texto propios, o un
   *      pseudo-elemento cuyo "content" resuelve a una cadena. Lo segundo no
   *      es teorico: las cuatro frases de paso del titular viajan en
   *      data-w y las pinta content: attr(), asi que no son nodos de texto y
   *      una sonda que solo mire nodos de texto no las ve.
   *   2. Nada dentro de algo que se MUEVE. Una marquesina esta cortada por
   *      definicion: es lo que la hace correr. Pero el filtro tiene que ser
   *      "anima transform", no "esta animado": las cinco frases del titular
   *      TAMBIEN llevan una animacion infinita —el cruce de opacidad— y con
   *      el filtro ancho quedaban excusadas, o sea que la sonda seguia sin
   *      ver el defecto que la motivo. Se inspeccionan los keyframes.
   *   3. Nada dentro de un CARRIL desplazable: ahi el contenido de mas se
   *      alcanza desplazando, no se pierde.
   *
   * El limite es el canto derecho del recortador mas cercano, o el viewport,
   * el que quede mas a la izquierda.
   */
  /**
   * Anima transform o translate, o sea: se desplaza. Una marquesina si; un
   * cruce de opacidad no. Sin esta distincion el titular de la portada
   * quedaba excusado por su propia animacion de opacidad.
   */
  const seMueve = (el) => {
    if (!el.getAnimations) return false
    for (const a of el.getAnimations()) {
      let kf = []
      try { kf = a.effect.getKeyframes() } catch { continue }
      for (const k of kf)
        if (k.transform !== undefined || k.translate !== undefined) return true
    }
    return false
  }

  const CONTENIDO_VACIO = ['none', 'normal', 'counter']
  const llevaTexto = (el) => {
    for (const n of el.childNodes)
      if (n.nodeType === 3 && n.textContent.trim()) return true
    for (const pseudo of ['::before', '::after']) {
      const c = getComputedStyle(el, pseudo).content
      if (!c) continue
      const limpio = c.replace(/^["']|["']$/g, '').trim()
      if (limpio && !CONTENIDO_VACIO.includes(limpio)) return true
    }
    return false
  }

  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect()
    if (r.width === 0 && r.height === 0) continue
    if (!llevaTexto(el)) continue

    let limite = vw
    let quien = 'viewport'
    let saltar = false
    for (let p = el; p && p !== document.documentElement; p = p.parentElement) {
      if (seMueve(p)) { saltar = true; break }
      if (p === el) continue
      const ox = getComputedStyle(p).overflowX
      if (ox === 'auto' || ox === 'scroll') { saltar = true; break }
      if (ox === 'hidden' || ox === 'clip') {
        if (p !== document.body) {
          limite = Math.min(limite, p.getBoundingClientRect().right)
          const pc = typeof p.className === 'string' ? p.className : ''
          quien = p.tagName.toLowerCase() + (pc ? '.' + pc.split(' ')[0] : '')
        } else {
          quien = 'body(clip)'
        }
        break
      }
    }
    if (saltar) continue
    if (r.right <= limite + 1) continue

    const cls = typeof el.className === 'string' ? el.className : ''
    cut.push({
      tag: el.tagName.toLowerCase(),
      cls: cls.slice(0, 70),
      right: Math.round(r.right),
      limite: Math.round(limite),
      quien,
      cortado: Math.round(r.right - limite),
    })
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
    cut: cut.slice(0, 12),
    cutTotal: cut.length,
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
  /* `cutTotal` cuenta igual que los demás: un texto que el `clip` del body
     recorta es invisible para el visitante exactamente igual que uno que se
     sale con barra de scroll — solo que sin la barra que lo delate. */
  const ok =
    overflow <= 1 &&
    r.total === 0 &&
    r.cutTotal === 0 &&
    r.leaks.length === 0 &&
    !r.headerRow

  if (!ok) failures++

  console.log(
    `  ${ok ? '✓' : '✗'}  ${String(width).padStart(4)}px  ` +
      `scrollWidth=${String(r.scrollW).padStart(5)}  ` +
      `desborde=${String(overflow).padStart(5)}px  ` +
      `culpables=${r.total}  recortados=${r.cutTotal}  ` +
      `(contenidos: carril=${r.contained.rail} clip=${r.contained.clip} decorativo=${r.contained.body})`
  )
  /* El recorte silencioso va primero: es el que nadie ve y el que ya se
     escapó una vez. La sonda decía «culpables=0 (clip=259)» mientras el
     titular de la portada se cortaba 78 px en un teléfono. */
  for (const c of r.cut) {
    console.log(
      `     CORTADO  ${c.tag}${c.cls ? '.' + c.cls : ''}  ` +
        `llega a ${c.right}, lo recorta ${c.quien} en ${c.limite} → ` +
        `${c.cortado}px de texto fuera del encuadre`
    )
  }
  if (r.cut.length) {
    console.log(
      '              → sin barra de scroll que lo delate: el texto simplemente desaparece'
    )
  }
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
    `\n  ${failures} ancho(s) con desbordamiento horizontal o texto recortado.\n` +
      `  Ojo: con overflow-x: clip en el body, un desborde NO se ve como scrollbar —\n` +
      `  el contenido simplemente desaparece del viewport. Las filas CORTADO son\n` +
      `  exactamente ese caso, y cuentan como fallo.\n`
  )
  process.exit(1)
}
console.log('\n  Sin desbordamiento horizontal en ningún ancho probado.\n')
