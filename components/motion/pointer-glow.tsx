'use client'

import { useEffect, useRef } from 'react'

/**
 * Resplandor que sigue al puntero dentro de su contenedor.
 *
 * Escribe `--mx` / `--my` como porcentajes en su propio nodo; el degradado
 * que los consume vive en `.pointer-glow` en globals.css. Si este JS nunca
 * corre, los valores por defecto de esa clase lo dejan centrado y quieto —
 * no queda un hueco visible.
 *
 * Sobre el rendimiento, que en este sitio importa más que en otros porque
 * Core Web Vitals es literalmente parte de lo que se vende:
 *
 * - `pointermove` dispara decenas de veces por segundo. El handler no hace
 *   nada más que guardar dos números; la escritura al DOM se agenda en un
 *   `requestAnimationFrame` y como máximo una por frame. Sin esa coalescencia
 *   se estarían haciendo varios estilos por frame y el INP lo pagaría.
 * - Solo cambia una custom property que alimenta un `background`, así que
 *   no hay reflow.
 * - Escucha en `window` con `passive: true` y no bloquea el scroll.
 * - Se apaga por completo con `prefers-reduced-motion` y en dispositivos sin
 *   puntero fino: en una pantalla táctil no hay cursor al que seguir, así que
 *   el listener sería puro costo sin efecto.
 */
export function PointerGlow({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const finePointer = window.matchMedia('(pointer: fine)')
    if (noMotion.matches || !finePointer.matches) return

    let queued = false
    let x = 50
    let y = 30

    const paint = () => {
      queued = false
      node.style.setProperty('--mx', `${x}%`)
      node.style.setProperty('--my', `${y}%`)
    }

    const onMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect()
      // Fuera de la caja no hay nada que iluminar.
      if (
        event.clientY < rect.top - 200 ||
        event.clientY > rect.bottom + 200
      ) {
        return
      }
      x = ((event.clientX - rect.left) / rect.width) * 100
      y = ((event.clientY - rect.top) / rect.height) * 100
      if (!queued) {
        queued = true
        requestAnimationFrame(paint)
      }
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return <div ref={ref} aria-hidden="true" className={className ?? 'pointer-glow'} />
}
