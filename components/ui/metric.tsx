import * as React from 'react'
import { cn } from '@/lib/utils'

export interface MetricProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** La cifra en sí. Corta — "4+", "92", "3x". */
  value: React.ReactNode
  /** Qué mide la cifra. */
  label: React.ReactNode
  /** Calificador opcional: el periodo, la fuente, el matiz. */
  hint?: React.ReactNode
}

/**
 * Metric — el bloque de dato suelto (barra de confianza, páginas de servicio).
 *
 * Sin cromo de tarjeta: una barra corta con el gradiente firma, la cifra
 * recortada sobre el gradiente y dos líneas de texto. Si necesitas la versión
 * con panel, envuélvelo en `<Card>` o en `.card`.
 *
 * `data-numeric` activa las cifras tabulares de globals.css, así una fila de
 * métricas alinea dígito por dígito. Sigue en el <span> de la cifra, no en el
 * contenedor: es lo único que lleva números.
 */
export function Metric({ value, label, hint, className, ...props }: MetricProps) {
  return (
    <div data-slot="metric" className={cn('flex flex-col', className)} {...props}>
      {/* Antes esta barra era un <hr> con la regla de acento del sistema
          anterior. Esa clase ya no existe, y un <hr> aquí tampoco significaba
          nada: la barra es decoración, no una separación de contenido. */}
      <span className="grad-fill mb-3 block h-1 w-12 rounded-full" aria-hidden="true" />
      <span
        data-numeric=""
        className="grad-text font-display text-3xl font-bold leading-none sm:text-4xl"
      >
        {value}
      </span>
      <span className="mt-2 text-sm font-semibold text-ink">{label}</span>
      {hint ? <span className="mt-1 text-xs text-ink-subtle">{hint}</span> : null}
    </div>
  )
}
