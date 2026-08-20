'use client'

import { useEffect, useRef, useState } from 'react'

interface CounterProps {
  /** Valor final. Es lo que se renderiza en el HTML del servidor. */
  value: number
  /** Prefijo fijo, p. ej. "+". */
  prefix?: string
  /** Sufijo fijo, p. ej. "+" o "%". */
  suffix?: string
  /** Duración de la cuenta en ms. */
  duration?: number
  className?: string
}

/**
 * Número que cuenta hasta su valor al entrar en pantalla.
 *
 * Dos cosas importantes de cómo está hecho:
 *
 * 1. **El valor final se renderiza en el servidor.** El estado inicial es
 *    `value`, no 0. Así el HTML que recibe Google (y cualquier crawler de
 *    IA) ya contiene "4", no un "0" que solo se convierte en 4 si el JS
 *    corre. La animación baja a 0 y sube únicamente después de hidratar.
 *
 * 2. **Respeta `prefers-reduced-motion`.** Si el visitante pidió menos
 *    movimiento no se anima en absoluto: se queda en el valor final.
 *
 * Usa `requestAnimationFrame`, no `setInterval`, para no despertar el hilo
 * principal más veces que frames haya — cuenta para el INP.
 */
export function Counter({
  value,
  prefix = '',
  suffix = '',
  duration = 1400,
  className,
}: CounterProps) {
  const [display, setDisplay] = useState(value)
  const ref = useRef<HTMLSpanElement>(null)
  const hasRun = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || hasRun.current) continue
          hasRun.current = true
          observer.disconnect()

          const start = performance.now()
          setDisplay(0)

          const tick = (now: number) => {
            const t = Math.min((now - start) / duration, 1)
            // easeOutExpo: arranca rápido y frena, que es lo que hace que
            // un contador se sienta ágil en lugar de mecánico.
            const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
            setDisplay(Math.round(eased * value))
            if (t < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.4 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [value, duration])

  return (
    <span ref={ref} data-numeric="" className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}
