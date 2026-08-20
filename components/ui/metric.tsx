import * as React from 'react'
import { cn } from '@/lib/utils'

export interface MetricProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** La cifra en sí. Corta — "4+", "92", "3x". */
  value: React.ReactNode
  /** Qué mide la cifra. */
  label: React.ReactNode
  /** Calificador opcional: el periodo, la fuente, el matiz. */
  hint?: React.ReactNode
  /**
   * Flotación permanente del bloque completo. Para métricas que viven sobre la
   * aurora en un héroe o junto a una composición 3D, donde un dato absolutamente
   * quieto se ve pegado al papel.
   *
   * Usa `.float-slow` (9 s) y no `.float` (6 s) a propósito: una cifra que
   * cabecea rápido se lee como inestable, y lo que se busca es que respire.
   *
   * ⚠ Una fila de métricas con `float` flota EN SINCRONÍA, que es el efecto
   * exacto que delata el truco. Desfásalas con las clases de escalonado de
   * globals.css, que son puro `animation-delay`:
   *
   *   <Metric float className="step-2" … />
   *   <Metric float className="step-4" … />
   *
   * Se apaga solo con `prefers-reduced-motion`, desde globals.css.
   */
  float?: boolean
}

/**
 * Metric — el bloque de dato suelto (barra de confianza, páginas de servicio).
 *
 * Sin cromo de tarjeta: una barra corta decorativa, la cifra recortada sobre el
 * gradiente de texto y dos líneas. Si necesitas la versión con panel,
 * envuélvelo en `<Card>` o en `.card`.
 *
 * Los dos gradientes que aparecen aquí NO son el mismo y no son
 * intercambiables:
 *   · la barrita es adorno puro y va `aria-hidden`, así que lleva `.grad-deco`,
 *     el gradiente vivo azul → cielo → cian. No hay texto encima, así que sus
 *     stops de 2.70:1 y 1.76:1 no le hacen daño a nadie.
 *   · la cifra es TEXTO recortado, así que lleva `.grad-text`, que se detiene en
 *     cielo oscuro (ambos stops ≥5.7:1) y además deja un `color` de respaldo por
 *     si el navegador no soporta `background-clip: text`.
 *
 * `data-numeric` activa las cifras tabulares de globals.css, así una fila de
 * métricas alinea dígito por dígito. Sigue en el <span> de la cifra, no en el
 * contenedor: es lo único que lleva números.
 *
 * ── DÓNDE PUEDE VIVIR ──
 * El `hint` es `text-ink-subtle`, que mide 5.0:1 sobre el fondo y 4.30:1 sobre
 * el cristal por defecto. Así que un Metric CON hint dentro de un panel de
 * cristal exige `<GlassPanel strong>` (4.54:1). Sin hint, cualquiera de los dos
 * sirve. Directamente sobre la aurora, solo el `label` (que es `--ink`) está a
 * salvo: el hint ahí no pasa, así que va en panel.
 */
export function Metric({ value, label, hint, float = false, className, ...props }: MetricProps) {
  return (
    <div
      data-slot="metric"
      className={cn('flex flex-col', float && 'float-slow', className)}
      {...props}
    >
      {/* Antes esta barra era un <hr> con la regla de acento del sistema
          anterior. Esa clase ya no existe, y un <hr> aquí tampoco significaba
          nada: la barra es decoración, no una separación de contenido. Por eso
          lleva `.grad-deco` y no `.grad-fill`: `.grad-fill` existe para cargar
          texto blanco encima, y aquí no hay texto. */}
      <span className="grad-deco mb-3 block h-1 w-12 rounded-full" aria-hidden="true" />
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
