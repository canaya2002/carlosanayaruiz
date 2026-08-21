'use client'

import { useEffect, useState } from 'react'

/**
 * ════════════════════════════════════════════════════════════════
 * LECTURA DE ESTA VISITA — el signature del sitio
 *
 * Mide con `PerformanceObserver` la página que el visitante tiene abierta
 * y la contrasta contra los umbrales publicados por Google. No es un
 * efecto: es el trabajo que se vende, funcionando sobre sí mismo.
 *
 * ── POR QUÉ SE LIMPIÓ ──
 * La versión anterior ponía el umbral a la MITAD de cada fila, con su
 * cifra flotando encima de la primera. El resultado eran tres reglas
 * rojas a distinta altura visual y una etiqueta huérfana —«800 ms»— que
 * parecía un dato sin dueño, seguida de otra cifra que sí era el dato.
 * Se leía roto, y con razón: había dos números por fila y nada que
 * dijera cuál era cuál.
 *
 * Ahora hay UNA regla, en el mismo x de las tres filas, al final de la
 * pista: el 100% de la pista es el umbral de esa métrica. Y la cifra
 * medida se lee junto a su presupuesto —`152 / 800 ms`— porque la
 * relación entre las dos ES el veredicto.
 *
 * Lo que queda a la izquierda de la regla no es hueco: es el margen que
 * sobra, que es exactamente lo que se vende. La leyenda de abajo lo dice
 * en una línea, porque una línea roja sin explicar es adorno, y adorno
 * en minio es el instrumento mintiendo.
 *
 * ── POR QUÉ SOLO TRES MÉTRICAS ──
 * TTFB, FCP y LCP son instantes medidos desde el inicio de la
 * navegación. INP es una DURACIÓN: mezclarlo en la misma escala sería
 * mentir sobre lo que la escala significa.
 *
 * Coste: ~1.3 KB. Es el único JavaScript de la firma.
 * ════════════════════════════════════════════════════════════════
 */

type Key = 'ttfb' | 'fcp' | 'lcp'
type State = 'pass' | 'watch' | 'fail'

/** Umbrales publicados por Google, en milisegundos. */
const THRESHOLDS: Record<Key, { good: number; poor: number }> = {
  ttfb: { good: 800, poor: 1800 },
  fcp: { good: 1800, poor: 3000 },
  lcp: { good: 2500, poor: 4000 },
}

/** El orden en que se leen: del servidor al pintado final. */
const ORDER: Key[] = ['ttfb', 'fcp', 'lcp']

function verdict(key: Key, ms: number): State {
  const t = THRESHOLDS[key]
  if (ms <= t.good) return 'pass'
  if (ms <= t.poor) return 'watch'
  return 'fail'
}

type Mark = { key: Key; ms: number }

export function Marks({
  label,
  live,
  note,
}: {
  label: string
  live: string
  /** La leyenda de la regla. Sin ella el minio no significa nada. */
  note: string
}) {
  const [marks, setMarks] = useState<Mark[]>([])

  useEffect(() => {
    const put = (key: Key, ms: number) => {
      if (!Number.isFinite(ms) || ms < 0) return
      setMarks((prev) => {
        const next = prev.filter((m) => m.key !== key)
        next.push({ key, ms })
        return next
      })
    }

    const observers: PerformanceObserver[] = []

    const observe = (
      type: string,
      handle: (entries: PerformanceEntryList) => void
    ) => {
      try {
        const po = new PerformanceObserver((list) => handle(list.getEntries()))
        po.observe({ type, buffered: true })
        observers.push(po)
      } catch {
        // Un tipo de entrada no soportado no puede tumbar el resto: si el
        // navegador no lo mide, la fila simplemente no aparece.
      }
    }

    /* TTFB por observer y no con `getEntriesByType` síncrono: con
       `buffered: true` la entrada llega igual, pero por callback, así que no
       hay un `setState` en el cuerpo del efecto. */
    observe('navigation', (entries) => {
      const nav = entries[0] as PerformanceNavigationTiming | undefined
      if (nav) put('ttfb', nav.responseStart)
    })

    observe('paint', (entries) => {
      for (const e of entries) {
        if (e.name === 'first-contentful-paint') put('fcp', e.startTime)
      }
    })

    observe('largest-contentful-paint', (entries) => {
      const last = entries[entries.length - 1]
      if (last) put('lcp', last.startTime)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  if (marks.length === 0) return null

  const byKey = new Map(marks.map((m) => [m.key, m.ms]))
  const rows = ORDER.filter((k) => byKey.has(k))

  return (
    <figure className="readout">
      <figcaption className="readout-head">
        <span className="live" aria-hidden="true" />
        <span>{label}</span>
        <span className="readout-live">{live}</span>
      </figcaption>

      <dl className="readout-rows">
        {rows.map((key) => {
          const ms = byKey.get(key) as number
          const state = verdict(key, ms)
          const { good } = THRESHOLDS[key]
          /* La pista entera es el presupuesto: 100% = el umbral. Así la
             regla cae en el MISMO x en las tres filas y se lee como una
             sola regla impresa. Una medición peor que el umbral se topa
             con la regla y la cifra dice cuánto se pasó. */
          const pct = Math.min(100, (ms / good) * 100)

          return (
            <div className="readout-row" key={key} data-state={state}>
              <dt className="readout-key">{key}</dt>
              <dd className="readout-track">
                <span
                  className="readout-fill"
                  style={{ '--pct': `${pct}%` } as React.CSSProperties}
                />
                {/* Donde se detuvo la aguja. Es lo que se lee por
                    POSICIÓN contra la regla del final. */}
                <span
                  className="readout-mark"
                  style={{ '--pct': `${pct}%` } as React.CSSProperties}
                />
              </dd>
              {/* Todo en milisegundos, sin cambiar de unidad a partir de
                  1 s: con `tabular-nums` la columna no se mueve y las tres
                  filas se comparan sin releer la unidad. */}
              <dd className="readout-value">
                {Math.round(ms)}
                <span className="readout-budget">{` / ${good} ms`}</span>
              </dd>
            </div>
          )
        })}
      </dl>

      {/* La leyenda es la regla misma, no la palabra «regla»: un trazo de
          un píxel en minio, igual que el del final de la pista. */}
      <p className="readout-foot">
        <span className="readout-legend" aria-hidden="true" />
        {note}
      </p>
    </figure>
  )
}
