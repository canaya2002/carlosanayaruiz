'use client'

import { useEffect, useRef } from 'react'

/**
 * Resplandor que sigue al puntero dentro de su contenedor.
 *
 * ── POR QUÉ ESTÁ HECHO ASÍ ──
 * La primera versión escribía dos custom properties (`--mx`, `--my`) y un
 * `radial-gradient` de la clase las consumía. Funcionaba, pero medido con
 * `Performance.getMetrics`: 255 recálculos de estilo por 120 movimientos de
 * mouse, más el repintado de un área enorme en cada uno. Cambiar la posición
 * de un gradiente obliga a repintar el elemento completo.
 *
 * Ahora el resplandor es un `<span>` de tamaño fijo que se desplaza con
 * `transform: translate3d()`. El compositor mueve una textura ya rasterizada:
 * cero repintado, cero recálculo de estilo.
 *
 * Lo demás que importa:
 * - El `getBoundingClientRect()` se lee dentro del `requestAnimationFrame`, no
 *   en el handler del evento. Leer geometría en un handler que dispara cien
 *   veces por segundo es la receta clásica de layout forzado. (Medido: en esta
 *   página no lo forzaba porque las animaciones son de transform y el layout
 *   estaba limpio — pero depender de eso es frágil.)
 * - Como máximo una escritura al DOM por frame, vía rAF.
 * - `pointermove` en `window` con `passive: true`: no bloquea el scroll.
 * - Se apaga por completo con `prefers-reduced-motion` y en dispositivos sin
 *   puntero fino: en una pantalla táctil no hay cursor que seguir, así que el
 *   listener sería puro costo sin efecto.
 *
 * Si el JS no corre, el `<span>` se queda en su transform inicial fuera de
 * pantalla y no se ve nada raro.
 */
export function PointerGlow({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const host = hostRef.current
    const glow = glowRef.current
    if (!host || !glow) return

    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !window.matchMedia('(pointer: fine)').matches
    ) {
      return
    }

    let queued = false
    let clientX = 0
    let clientY = 0

    const paint = () => {
      queued = false
      // La geometría se lee aquí, una vez por frame como máximo.
      const rect = host.getBoundingClientRect()
      const x = clientX - rect.left
      const y = clientY - rect.top
      glow.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }

    const onMove = (event: PointerEvent) => {
      clientX = event.clientX
      clientY = event.clientY
      if (queued) return
      queued = true
      requestAnimationFrame(paint)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={className ?? 'pointer-glow'}
    >
      <span ref={glowRef} />
    </div>
  )
}
