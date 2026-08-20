'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * ════════════════════════════════════════════════════════════════
 * CARRUSEL
 *
 * El desplazamiento y el imán los hace el navegador con `scroll-snap`, no
 * JavaScript. Eso significa que:
 *
 *   · se arrastra con el dedo y rueda con trackpad sin escribir nada
 *   · funciona con teclado porque los hijos son enfocables
 *   · si este JS no corre, el carrusel SIGUE desplazándose — las flechas son
 *     lo único que se pierde
 *   · el contenido está completo en el HTML del servidor, así que un crawler
 *     lo lee todo: un carrusel con estado en JS solo expone la primera lámina
 *
 * Las flechas solo llaman a `scrollBy`. El estado que se mantiene es
 * únicamente si se puede seguir a izquierda o derecha, para poder
 * deshabilitarlas — y se calcula en un handler de `scroll` pasivo.
 * ════════════════════════════════════════════════════════════════
 */

interface Props {
  children: React.ReactNode
  /** Etiqueta accesible de la región. Obligatoria: hay varios por página. */
  label: string
  /** Texto de los controles, traducido por el consumidor. */
  prevLabel: string
  nextLabel: string
  className?: string
}

export function Carousel({
  children,
  label,
  prevLabel,
  nextLabel,
  className,
}: Props) {
  const railRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const sync = useCallback(() => {
    const rail = railRef.current
    if (!rail) return
    // El margen de 2px absorbe redondeos subpíxel: sin él la flecha derecha se
    // queda habilitada para siempre al final del recorrido.
    setCanPrev(rail.scrollLeft > 2)
    setCanNext(rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 2)
  }, [])

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return

    sync()
    rail.addEventListener('scroll', sync, { passive: true })

    // Si el contenedor cambia de ancho, cambia si hay o no desbordamiento.
    const observer = new ResizeObserver(sync)
    observer.observe(rail)

    return () => {
      rail.removeEventListener('scroll', sync)
      observer.disconnect()
    }
  }, [sync])

  const step = (direction: 1 | -1) => {
    const rail = railRef.current
    if (!rail) return
    // Se avanza el ancho de la primera lámina, no un valor fijo: así el paso
    // coincide con el imán del scroll-snap y nunca queda una tarjeta a medias.
    const first = rail.firstElementChild as HTMLElement | null
    const amount = first
      ? first.getBoundingClientRect().width + 20
      : rail.clientWidth * 0.8
    rail.scrollBy({ left: amount * direction, behavior: 'smooth' })
  }

  return (
    <div className={className}>
      {/* Los controles van ARRIBA del riel, no encima de las tarjetas: flechas
          flotando sobre el contenido tapan justo lo que se quiere ver, y en
          móvil compiten con el gesto de arrastrar. */}
      <div className="mb-1 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={!canPrev}
          aria-label={prevLabel}
          className="glass press inline-flex size-11 items-center justify-center rounded-full text-ink transition-opacity disabled:pointer-events-none disabled:opacity-35"
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          disabled={!canNext}
          aria-label={nextLabel}
          className="glass press inline-flex size-11 items-center justify-center rounded-full text-ink transition-opacity disabled:pointer-events-none disabled:opacity-35"
        >
          <ChevronRight className="size-5" aria-hidden="true" />
        </button>
      </div>

      {/* `tabIndex={0}` hace la región desplazable con las flechas del teclado,
          que es lo que WCAG espera de un contenedor con scroll propio. */}
      <div
        ref={railRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="rail rail-mask scene"
      >
        {children}
      </div>
    </div>
  )
}
