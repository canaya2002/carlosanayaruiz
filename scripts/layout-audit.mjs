/**
 * ════════════════════════════════════════════════════════════════
 * AUDITORÍA DE MAQUETACIÓN — «que nada corte nada»
 *
 * `check:overflow` ya cubre el desbordamiento horizontal. Esto cubre los
 * otros cuatro defectos que se reportaron mirando el sitio:
 *
 *   1. HUECOS — franjas verticales de más de `GAP_PX` sin nada dentro.
 *      Es lo que se veía como «espacios vacíos enormes feos».
 *   2. CORTES — texto recortado por su contenedor (`scrollHeight` mayor
 *      que `clientHeight` en un bloque con overflow oculto), o una línea
 *      que se sale de su caja.
 *   3. CINTAS ROTAS — un carrusel cuya copia mide menos que el contenedor:
 *      el empalme entra en cuadro y el bucle «se repite de inmediato».
 *   4. SECCIONES MUDAS — una sección con casi nada de contenido, que casi
 *      siempre significa que ahí falta una imagen y no está marcada.
 *
 * Recorre varias páginas y dos anchos, y devuelve un informe por página.
 *
 *   node scripts/layout-audit.mjs http://localhost:3000 /es /es/servicios
 * ════════════════════════════════════════════════════════════════
 */
import { spawn } from 'node:child_process'
import { setTimeout as sleep } from 'node:timers/promises'

const CHROME =
  process.env.CHROME_PATH ??
  'C:/Program Files/Google/Chrome/Application/chrome.exe'

const base = process.argv[2] ?? 'http://localhost:3000'
const paths = process.argv.slice(3)
if (paths.length === 0) {
  console.error('  Uso: node scripts/layout-audit.mjs <base> <ruta> [ruta...]')
  process.exit(1)
}

const WIDTHS = [1440, 375]
const PORT = 9466

/** Un hueco a partir de aquí se considera un defecto y no respiración. */
const GAP_PX = 190

const PROBE = `(() => {
  const out = { gaps: [], clipped: [], ribbons: [], quiet: [], noAlt: [], headings: [] }
  const vh = window.innerHeight

  const describe = (el) => {
    const cls = (el.className && typeof el.className === 'string')
      ? '.' + el.className.trim().split(/\\s+/).slice(0, 3).join('.')
      : ''
    return el.tagName.toLowerCase() + cls
  }

  /* ── 1. HUECOS ─────────────────────────────────────────────────
     Se recorren las secciones y, dentro de cada una, se mide la
     distancia entre el fondo del último hijo con contenido y el fondo
     de la sección. Ese es el vacío que se ve al final de un bloque. */
  for (const sec of document.querySelectorAll('main section, main > div > section')) {
    const sr = sec.getBoundingClientRect()
    if (sr.height < 80) continue
    let lowest = sr.top
    for (const el of sec.querySelectorAll('*')) {
      const r = el.getBoundingClientRect()
      if (r.width < 4 || r.height < 4) continue
      const txt = (el.textContent || '').trim()
      const paints = txt.length > 0 || el.tagName === 'IMG' || el.tagName === 'VIDEO'
      if (!paints) continue
      if (r.bottom > lowest) lowest = r.bottom
    }
    const tail = Math.round(sr.bottom - lowest)
    if (tail > ${GAP_PX}) {
      out.gaps.push({ el: describe(sec), tailPx: tail, secH: Math.round(sr.height) })
    }
  }

  /* ── 2. CORTES ─────────────────────────────────────────────────
     Un bloque con overflow oculto cuyo contenido no cabe. */
  /* Hay ventanas DELIBERADAS: el trazo, las cintas y el retrato recortan
     a proposito —es lo que las hace funcionar— y reportarlas es ruido que
     esconde los cortes de verdad. */
  /* 'dial' recorta a proposito: sus anillos llevan rotate para repartir las
     marcas, y rotar un elemento cuadrado agranda su caja alineada a los ejes
     aunque lo que se ve dentro sea un circulo quieto. Lo que se recorta es
     caja vacia. */
  const VENTANAS = ['trace', 'ribbon', 'portrait', 'media-slot', 'dial']
  for (const el of document.querySelectorAll('main *')) {
    const cs = getComputedStyle(el)
    const hidden = cs.overflowY === 'hidden' || cs.overflowY === 'clip'
    if (!hidden) continue
    const cn = typeof el.className === 'string' ? el.className : ''
    if (VENTANAS.some((v) => cn.includes(v))) continue
    if (el.scrollHeight - el.clientHeight > 6 && el.clientHeight > 24) {
      out.clipped.push({
        el: describe(el),
        cortaPx: el.scrollHeight - el.clientHeight,
        texto: (el.textContent || '').trim().slice(0, 60),
      })
    }
  }

  /* ── 3. CINTAS ─────────────────────────────────────────────────
     Una copia tiene que ser más ancha que el contenedor o el empalme
     se ve. Se mide de verdad, no se estima. */
  for (const rib of document.querySelectorAll('.ribbon')) {
    const contW = rib.getBoundingClientRect().width
    const copy = rib.querySelector('.ribbon-copy')
    const copyW = copy ? copy.getBoundingClientRect().width : 0
    if (copyW <= contW * 1.05) {
      out.ribbons.push({
        el: describe(rib),
        contenedorPx: Math.round(contW),
        copiaPx: Math.round(copyW),
        problema: 'la copia no llena el contenedor: el bucle se ve',
      })
    }
  }

  /* ── 4. SECCIONES MUDAS ────────────────────────────────────────
     Mucha altura y muy poco texto: casi siempre falta una imagen. */
  /* Una seccion corta NO es un defecto: lo es una seccion con VACIO real
     al final. Sin esta condicion el probe marcaba bloques legitimos —dos
     filas de idiomas con padding generoso— y escondia los huecos de
     verdad entre falsos positivos. */
  for (const sec of document.querySelectorAll('main section, main > div > section')) {
    const r = sec.getBoundingClientRect()
    const chars = (sec.textContent || '').trim().length
    const hasMedia = sec.querySelector('img, video, .media-slot, .ribbon, svg')
    let low = r.top
    for (const el of sec.querySelectorAll('*')) {
      const b = el.getBoundingClientRect()
      if (b.width < 4 || b.height < 4) continue
      if (!(el.textContent || '').trim()) continue
      if (b.bottom > low) low = b.bottom
    }
    const tail = r.bottom - low
    if (r.height > 320 && chars < 140 && !hasMedia && tail > 110) {
      out.quiet.push({ el: describe(sec), alturaPx: Math.round(r.height), chars })
    }
  }

  /* ── 5. IMÁGENES SIN ALT ───────────────────────────────────────── */
  for (const img of document.querySelectorAll('img')) {
    if (!img.getAttribute('alt')) out.noAlt.push({ src: img.getAttribute('src') || '?' })
  }

  /* ── 6. ORDEN DE ENCABEZADOS ───────────────────────────────────── */
  const hs = [...document.querySelectorAll('main h1, main h2, main h3, main h4')]
  let prev = 0
  for (const h of hs) {
    const lvl = Number(h.tagName[1])
    if (prev && lvl > prev + 1) {
      out.headings.push({ salto: 'h' + prev + ' -> h' + lvl, texto: (h.textContent||'').trim().slice(0,44) })
    }
    prev = lvl
  }
  out.h1Count = document.querySelectorAll('main h1').length

  return out
})()`

const PROBE_SCROLL = `(async () => {
  /* ── CONTENIDO INVISIBLE DENTRO DEL VIEWPORT ────────────────────
     El defecto que este probe no veia y que se reportaba como
     «espacios vacios enormes»: un elemento con un reveal ligado al
     scroll que se queda en opacity 0 aunque su seccion ya este en
     pantalla. El contenido esta ahi, ocupa su sitio, y no se ve.
     Solo se detecta DESPLAZANDOSE de verdad. */
  const paso = Math.round(window.innerHeight * 0.7)
  const alto = document.body.scrollHeight
  const sospechosos = new Map()
  const espera = (ms) => new Promise((r) => setTimeout(r, ms))

  for (let y = 0; y <= alto; y += paso) {
    window.scrollTo(0, y)
    await espera(420)
    for (const el of document.querySelectorAll("main *")) {
      if (el.querySelector("*")) continue
      const b = el.getBoundingClientRect()
      if (b.height < 12) continue
      if (b.top > window.innerHeight * 0.85 || b.bottom < window.innerHeight * 0.15) continue
      /* El titular que muta es la excepcion legitima: sus cinco frases
         viven en LA MISMA celda de grid y solo una esta visible a la vez, asi
         que cuatro en opacity 0 es el mecanismo funcionando, no un reveal
         roto. Sin esta linea el detector reporta cuatro falsos positivos por
         ancho en la portada. */
      /* Dos excepciones LEGITIMAS, y solo dos: el titular que muta y el
         husillo del dial. En los dos casos varios nodos comparten sitio y
         solo uno esta visible a la vez, asi que el resto en opacity 0 es el
         mecanismo funcionando. Todo lo demas invisible dentro del viewport es
         un reveal roto y hay que verlo. */
      if (el.closest(".morph") || el.closest(".dial")) continue
      const txt = (el.textContent || "").trim()
      if (txt.length < 4) continue
      const clave = txt.slice(0, 44)
      /* La opacidad EFECTIVA es el producto de la cadena: un hijo de un
         elemento en opacity 0 sigue reportando 1 en su propio estilo
         computado. Medir solo el elemento era la razon por la que este
         detector no disparaba ni con el rango roto a proposito. */
      let efectiva = 1
      for (let p = el; p && p !== document.body; p = p.parentElement) {
        efectiva *= Number(getComputedStyle(p).opacity)
        if (efectiva < 0.15) break
      }
      if (efectiva < 0.15) {
        if (!sospechosos.has(clave)) sospechosos.set(clave, { txt: clave })
      } else {
        sospechosos.delete(clave)
      }
    }
  }
  window.scrollTo(0, 0)
  return [...sospechosos.values()].slice(0, 12)
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
    '--hide-scrollbars',
    '--user-data-dir=' + (process.env.TEMP ?? '/tmp') + '/cdp-layout-audit',
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
  console.error('  No se pudo conectar a Chrome.')
  process.exit(1)
}

const ws = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((r) => ws.addEventListener('open', r, { once: true }))

let id = 0
let total = 0

for (const path of paths) {
  console.log(`\n══ ${path} ═══════════════════════════════════════`)
  for (const width of WIDTHS) {
    await cdp(ws, ++id, 'Emulation.setDeviceMetricsOverride', {
      width,
      height: 900,
      deviceScaleFactor: 1,
      mobile: width < 640,
    })
    await cdp(ws, ++id, 'Page.navigate', { url: base + path })
    await sleep(2200)
    const { result } = await cdp(ws, ++id, 'Runtime.evaluate', {
      expression: PROBE,
      returnByValue: true,
    })
    const r = result.value

    /* Segunda pasada: recorre la pagina de verdad. Sin esto, todo reveal
       ligado al scroll se mide en su estado inicial y el probe da un falso
       «OK» sobre una pagina que el visitante ve vacia. */
    const { result: invisRes } = await cdp(ws, ++id, "Runtime.evaluate", {
      expression: PROBE_SCROLL,
      returnByValue: true,
      awaitPromise: true,
    })
    r.invisibles = invisRes.value || []
    const issues =
      r.gaps.length +
      r.clipped.length +
      r.ribbons.length +
      r.quiet.length +
      r.noAlt.length +
      r.headings.length +
      r.invisibles.length +
      (r.h1Count === 1 ? 0 : 1)
    total += issues

    console.log(`  ${width}px  ${issues === 0 ? 'OK' : issues + ' hallazgo(s)'}`)
    if (r.h1Count !== 1) console.log(`    h1: hay ${r.h1Count}, debe haber 1`)
    for (const g of r.gaps)
      console.log(`    HUECO   ${g.el} — ${g.tailPx}px vacíos al final (alto ${g.secH})`)
    for (const c of r.clipped)
      console.log(`    CORTE   ${c.el} — se corta ${c.cortaPx}px · «${c.texto}»`)
    for (const b of r.ribbons)
      console.log(`    CINTA   ${b.el} — copia ${b.copiaPx} < contenedor ${b.contenedorPx}`)
    for (const q of r.quiet)
      console.log(`    MUDA    ${q.el} — ${q.alturaPx}px con ${q.chars} caracteres y sin medio`)
    for (const a of r.noAlt) console.log(`    SIN ALT ${a.src}`)
    for (const h of r.headings) console.log(`    SALTO   ${h.salto} · «${h.texto}»`)
    /* Se CONTABAN y no se imprimian: el informe decia «4 hallazgos» sin decir
       cuales, que es peor que no medirlo. */
    for (const v of r.invisibles)
      console.log(`    INVISIBLE «${v.txt}»`)
  }
}

console.log(`\n  ${total} hallazgo(s) en total.\n`)
ws.close()
chrome.kill()
process.exit(total > 0 ? 1 : 0)
