/**
 * ════════════════════════════════════════════════════════════════
 * simular-cron-correos — SOLO ANÁLISIS. No toca vercel.json ni el cron.
 *
 * Reproduce la selección de correos de `app/api/cron/publicar/route.ts` sobre
 * un calendario hipotético que mezcla la serie (martes y viernes) con
 * artículos de fecha propia (lunes y jueves), para decidir con datos si el
 * cron tiene que cambiar el día que se publique el primero.
 *
 * La lógica que se copia del cron, tal cual:
 *
 *   · ventana: publicado (t ≤ ahora) y con ahora − t ≤ 8 días
 *   · orden del más antiguo al más reciente
 *   · se calientan todos; aquí se asume que todos responden 200
 *   · enviables = recientes.slice(-MAX_CORREOS) con MAX_CORREOS = 2,
 *     ANTES de saber cuáles ya salieron
 *   · sendPostBroadcast es idempotente por nombre: lo ya enviado devuelve
 *     «ya-enviado» y no manda nada
 *
 * Y una variante propuesta (`filtrar`) que quita lo ya enviado ANTES del
 * slice, para comparar.
 *
 *   node scripts/simular-cron-correos.mjs
 * ════════════════════════════════════════════════════════════════
 */
import { slot, SERIES_SIZE } from './blog-schedule.mjs'

const VENTANA_MS = 8 * 24 * 60 * 60 * 1000
const MAX_CORREOS = 2
const DIA = 86400000

/* ── El calendario hipotético ──────────────────────────────────────
   La serie real (n 1–100) y siete artículos nuevos A1–A7 en lunes y jueves
   del 3 al 28 de diciembre. Entre el 3 y el 28 hay OCHO lunes/jueves; el que
   queda libre es el jueves 24 (Nochebuena). */
const NUEVOS = [
  ['A1', '2026-12-03'],
  ['A2', '2026-12-07'],
  ['A3', '2026-12-10'],
  ['A4', '2026-12-14'],
  ['A5', '2026-12-17'],
  ['A6', '2026-12-21'],
  ['A7', '2026-12-28'],
]

const posts = [
  ...Array.from({ length: SERIES_SIZE }, (_, i) => ({ id: `n${i + 1}`, at: slot(i) })),
  ...NUEVOS.map(([id, d]) => ({ id, at: `${d}T14:00:00Z` })),
].map((p) => ({ ...p, t: Date.parse(p.at) }))

const DIAS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb']
const fecha = (t) => {
  const d = new Date(t)
  return `${DIAS[d.getUTCDay()]} ${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

/** Corridas de un cron `0 14 * * <dias>` entre dos fechas, ambas incluidas. */
function corridas(dias, desde, hasta) {
  const out = []
  for (let t = Date.parse(`${desde}T14:00:00Z`); t <= Date.parse(`${hasta}T14:00:00Z`); t += DIA) {
    if (dias.includes(new Date(t).getUTCDay())) out.push(t)
  }
  return out
}

/**
 * Simula un escenario. `fallan` son fechas AAAA-MM-DD cuya corrida no llega a
 * enviar nada (la función cae, Resend no responde…). Vercel no reintenta.
 */
function simular({ dias, fallan = [], filtrar = false }) {
  /* Estado previo: todo lo publicado antes del 30/11 ya salió. Se arranca
     unas semanas antes para que la ventana del 30/11 vea un pasado real. */
  const enviado = new Map()
  for (const p of posts) if (p.t < Date.parse('2026-11-30T00:00:00Z')) enviado.set(p.id, p.t)

  const filas = []
  const nuevosPorCorrida = []
  /** Cuántos correos salió cada artículo. Más de 1 = duplicado. */
  const envios = new Map()

  for (const ahora of corridas(dias, '2026-11-30', '2026-12-29')) {
    const recientes = posts
      .filter((p) => p.t <= ahora && ahora - p.t <= VENTANA_MS)
      .sort((a, b) => a.t - b.t)

    const dia = new Date(ahora).toISOString().slice(0, 10)
    if (fallan.includes(dia)) {
      filas.push({ ahora, ventana: recientes.map((p) => p.id), elegidos: [], nuevos: [], fallo: true })
      continue
    }

    const candidatos = filtrar ? recientes.filter((p) => !enviado.has(p.id)) : recientes
    const elegidos = candidatos.slice(-MAX_CORREOS)
    const nuevos = []
    for (const p of elegidos) {
      if (enviado.has(p.id)) continue // «ya-enviado»: no sale correo
      enviado.set(p.id, ahora)
      envios.set(p.id, (envios.get(p.id) ?? 0) + 1)
      nuevos.push(p.id)
    }
    nuevosPorCorrida.push(nuevos.length)
    filas.push({ ahora, ventana: recientes.map((p) => p.id), elegidos: elegidos.map((p) => p.id), nuevos })
  }

  /* Lo que nunca salió: publicado en el periodo, sin correo, y ya fuera de la
     ventana de la ÚLTIMA corrida posible antes de caducar — o sea, perdido. */
  const fin = Date.parse('2026-12-29T14:00:00Z')
  const periodo = posts.filter((p) => p.t >= Date.parse('2026-11-30T00:00:00Z') && p.t <= fin)
  const perdidos = periodo.filter((p) => !enviado.has(p.id) && fin - p.t > VENTANA_MS).map((p) => p.id)
  const pendientes = periodo.filter((p) => !enviado.has(p.id) && fin - p.t <= VENTANA_MS).map((p) => p.id)
  const retraso = periodo
    .filter((p) => enviado.has(p.id))
    .map((p) => ({ id: p.id, dias: Math.round((enviado.get(p.id) - p.t) / DIA) }))
    .filter((x) => x.dias > 0)

  return {
    filas,
    duplicados: [...envios.values()].filter((v) => v > 1).length,
    maxNuevos: Math.max(0, ...nuevosPorCorrida),
    perdidos,
    pendientes,
    retraso,
    // Días con dos correos: dos envíos a la lista la misma mañana.
    diasDoble: filas.filter((f) => f.nuevos.length === 2).map((f) => fecha(f.ahora)),
  }
}

function tabla(titulo, r) {
  console.log(`\n### ${titulo}\n`)
  console.log('| corrida | en ventana (8 d) | slice(-2) | correos nuevos |')
  console.log('|---|---|---|---|')
  for (const f of r.filas) {
    console.log(
      `| ${fecha(f.ahora)} | ${f.ventana.join(' ')} | ${f.fallo ? '—' : f.elegidos.join(' ')} | ${f.fallo ? '**FALLA**' : f.nuevos.join(' ') || '·'} |`
    )
  }
  resumen(r)
}

function resumen(r) {
  console.log('')
  console.log(`- duplicados: **${r.duplicados}** · máximo de nuevos en una corrida: **${r.maxNuevos}**`)
  console.log(`- días con 2 correos: ${r.diasDoble.length ? r.diasDoble.join(', ') : 'ninguno'}`)
  console.log(`- **perdidos para siempre**: ${r.perdidos.length ? r.perdidos.join(', ') : 'ninguno'}`)
  if (r.pendientes.length) console.log(`- pendientes al 29/12 (aún en ventana): ${r.pendientes.join(', ')}`)
  if (r.retraso.length) console.log(`- con retraso: ${r.retraso.map((x) => `${x.id} +${x.dias} d`).join(', ')}`)
}

const ACTUAL = [2, 5] // 0 14 * * 2,5
const PROPUESTO = [1, 2, 4, 5] // 0 14 * * 1,2,4,5

console.log('## Calendario hipotético (30/11 → 29/12)\n')
console.log('| fecha | artículo |')
console.log('|---|---|')
for (const p of posts.filter((p) => p.at >= '2026-11-30' && p.at <= '2026-12-29T23')) {
  console.log(`| ${fecha(p.t)} | ${p.id} |`)
}

console.log('\n## (a) Cron actual `0 14 * * 2,5`')
tabla('(a) sin fallos', simular({ dias: ACTUAL }))
tabla('(a) falla la corrida del vie 04/12', simular({ dias: ACTUAL, fallan: ['2026-12-04'] }))
tabla('(a) fallan dos seguidas: vie 04/12 y mar 08/12', simular({ dias: ACTUAL, fallan: ['2026-12-04', '2026-12-08'] }))

console.log('\n## (b) Cron propuesto `0 14 * * 1,2,4,5`')
tabla('(b) sin fallos', simular({ dias: PROPUESTO }))
tabla('(b) falla la corrida del jue 03/12', simular({ dias: PROPUESTO, fallan: ['2026-12-03'] }))
tabla('(b) fallan dos seguidas: jue 03/12 y vie 04/12', simular({ dias: PROPUESTO, fallan: ['2026-12-03', '2026-12-04'] }))

console.log('\n## Variante: filtrar «ya-enviado» ANTES del slice(-2)')
for (const [nombre, cfg] of [
  ['(a) sin fallos', { dias: ACTUAL }],
  ['(a) falla vie 04/12', { dias: ACTUAL, fallan: ['2026-12-04'] }],
  ['(a) fallan vie 04/12 y mar 08/12', { dias: ACTUAL, fallan: ['2026-12-04', '2026-12-08'] }],
  ['(b) sin fallos', { dias: PROPUESTO }],
  ['(b) falla jue 03/12', { dias: PROPUESTO, fallan: ['2026-12-03'] }],
  ['(b) fallan jue 03/12 y vie 04/12', { dias: PROPUESTO, fallan: ['2026-12-03', '2026-12-04'] }],
]) {
  console.log(`\n### ${nombre} — con filtro previo`)
  resumen(simular({ ...cfg, filtrar: true }))
}
console.log('')
