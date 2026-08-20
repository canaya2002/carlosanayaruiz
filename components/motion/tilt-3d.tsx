'use client'

import { useCallback, useEffect, useRef } from 'react'

/**
 * ════════════════════════════════════════════════════════════════
 * TILT 3D — inclinación que sigue al puntero
 *
 * Escribe `--rx` y `--ry` en su propio nodo; la clase `.tilt` de globals.css
 * las consume en un `transform: rotateX() rotateY()`. Un transform se resuelve
 * en el compositor, así que esto no repinta nada.
 *
 * Es deliberadamente distinto de la primera versión del resplandor del puntero,
 * que escribía custom properties consumidas por un `radial-gradient`: eso sí
 * repintaba, y medido costaba 255 recálculos de estilo por 120 movimientos.
 * La diferencia no es la técnica de escribir variables, es QUÉ propiedad las
 * consume. `transform` se compone; `background` no.
 *
 * Detalles que importan:
 * - La geometría se lee dentro del `requestAnimationFrame`, no en el handler.
 * - Como máximo una escritura por frame.
 * - `pointerleave` devuelve la tarjeta a 0 con la transición larga de `.tilt`,
 *   mientras que durante el movimiento se usa `.tilt-active`, que casi no tiene
 *   transición. Sin ese cambio la inclinación se siente pegajosa: la transición
 *   larga pelea contra el puntero.
 * - Se apaga en `prefers-reduced-motion` y donde no hay puntero fino: en una
 *   pantalla táctil no hay cursor al que seguir.
 * - `perspective` NO va aquí, va en el contenedor `.scene`. Así varias tarjetas
 *   de una rejilla comparten punto de fuga; si cada una llevara la suya, el 3D
 *   se ve falso.
 * ════════════════════════════════════════════════════════════════
 */

interface Props {
  children: React.ReactNode
  /** Grados máximos de inclinación. El default sale de --tilt-max. */
  max?: number
  className?: string
}

export function Tilt3D({ children, max = 9, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const queued = useRef(false)
  const point = useRef({ x: 0, y: 0 })

  const paint = useCallback(() => {
    queued.current = false
    const node = ref.current
    if (!node) return

    const rect = node.getBoundingClientRect()
    if (!rect.width || !rect.height) return

    // -0.5..0.5 desde el centro de la tarjeta.
    const px = (point.current.x - rect.left) / rect.width - 0.5
    const py = (point.current.y - rect.top) / rect.height - 0.5

    // El signo de rotateX va invertido: mover el puntero hacia abajo debe
    // inclinar el borde superior hacia atrás, no hacia adelante.
    node.style.setProperty('--ry', `${(px * max * 2).toFixed(2)}deg`)
    node.style.setProperty('--rx', `${(-py * max * 2).toFixed(2)}deg`)
  }, [max])

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !window.matchMedia('(pointer: fine)').matches
    ) {
      return
    }

    const onMove = (event: PointerEvent) => {
      point.current = { x: event.clientX, y: event.clientY }
      if (queued.current) return
      queued.current = true
      requestAnimationFrame(paint)
    }

    const onEnter = () => node.classList.add('tilt-active')

    const onLeave = () => {
      node.classList.remove('tilt-active')
      node.style.setProperty('--rx', '0deg')
      node.style.setProperty('--ry', '0deg')
    }

    node.addEventListener('pointerenter', onEnter)
    node.addEventListener('pointermove', onMove, { passive: true })
    node.addEventListener('pointerleave', onLeave)

    return () => {
      node.removeEventListener('pointerenter', onEnter)
      node.removeEventListener('pointermove', onMove)
      node.removeEventListener('pointerleave', onLeave)
    }
  }, [paint])

  return (
    <div ref={ref} className={`tilt ${className ?? ''}`}>
      {children}
    </div>
  )
}
