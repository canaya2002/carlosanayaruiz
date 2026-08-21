'use client'

import { useEffect, useState } from 'react'

/**
 * ════════════════════════════════════════════════════════════════
 * LECTURA DE ESTA VISITA — el signature del sitio
 *
 * Mide con `PerformanceObserver` la página que el visitante tiene abierta y
 * la contrasta contra los umbrales publicados por Google. No es un efecto:
 * es el trabajo que se vende, funcionando sobre sí mismo.
 *
 * ── POR QUÉ SE REHIZO ──
 * La primera versión colocaba cada marca en su posición absoluta sobre el
 * eje de tiempo del riel. Conceptualmente correcto y visualmente ilegible:
 * este sitio carga en ~200 ms, así que las tres marcas caían dentro de los
 * primeros 60 px y se leían como tres líneas verdes sueltas en una esquina.
 * Sin encabezado, sin escala visible y sin umbral a la vista, no había forma
 * de saber que eran una medición.
 *
 * Ahora es un instrumento con todo lo que un instrumento necesita para que
 * se pueda leer: nombre, escala, umbral marcado y unidad. La barra sigue
 * diciendo lo mismo por POSICIÓN —dónde cayó contra el umbral— pero con la
 * referencia dibujada al lado.
 *
 * ── POR QUÉ SOLO TRES MÉTRICAS ──
 * TTFB, FCP y LCP son instantes medidos desde el inicio de la navegación.
 * INP es una DURACIÓN: mezclarlo en la misma escala sería mentir sobre lo
 * que la escala significa.
 *
 * Coste: ~1.2 KB. Es el único JavaScript de la firma.
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

function format(ms: number): string {
  return ms < 1000 ? `${Math.round(ms)} ms` : `${(ms / 1000).toFixed(2)} s`
}

function formatThreshold(ms: number): string {
  return ms < 1000 ? `${ms} ms` : `${ms / 1000} s`
}

type Mark = { key: Key; ms: number }

export function Marks({ label, live }: { label: string; live: string }) {
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
          /* La escala local llega al doble del umbral: así el umbral cae
             siempre en la mitad exacta y se lee de un vistazo si la marca
             quedó antes o después, sin tener que comparar cifras. */
          const scale = good * 2
          const pct = Math.min(100, (ms / scale) * 100)

          return (
            <div className="readout-row" key={key} data-state={state}>
              <dt className="readout-key">{key}</dt>
              <dd className="readout-track">
                <span
                  className="readout-fill"
                  style={{ '--pct': `${pct}%` } as React.CSSProperties}
                />
                {/* El umbral, siempre a la mitad. Es la referencia contra la
                    que se lee la barra: sin él, la barra no dice nada. */}
                <span className="readout-threshold" aria-hidden="true">
                  <span className="readout-threshold-label">
                    {formatThreshold(good)}
                  </span>
                </span>
              </dd>
              <dd className="readout-value">{format(ms)}</dd>
            </div>
          )
        })}
      </dl>
    </figure>
  )
}
