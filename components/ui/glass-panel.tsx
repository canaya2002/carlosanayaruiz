import * as React from 'react'
import { cn } from '@/lib/utils'

/** Elementos que puede renderizar un GlassPanel. Por defecto `div`. */
type GlassPanelAs = 'div' | 'section' | 'article' | 'aside'

export interface GlassPanelProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Etiqueta a renderizar. Elige la que describa el contenido: `section` si el
   * panel es una sección con encabezado propio, `article` si se sostiene solo,
   * `aside` si es complementario, `div` si es puro envoltorio visual.
   */
  as?: GlassPanelAs
  /**
   * El reflejo especular: una banda diagonal estática muy tenue que hace leer
   * la superficie como vidrio en lugar de como plástico translúcido. Es un
   * pseudo-elemento con gradiente, así que no cuesta nada — de ahí que venga
   * encendido. Pásalo en `false` solo si necesitas el `::before` del panel para
   * otra cosa.
   */
  spec?: boolean
  /** Sube la opacidad del fondo de 0.62 a 0.78: más nítido, menos vidrio. */
  strong?: boolean
}

/**
 * GlassPanel — el primitivo de "cristal líquido".
 *
 * Compone las clases de globals.css: `.glass` siempre, más `.glass-spec` y
 * `.glass-strong` según las props. Las cuatro capas del efecto (fondo
 * translúcido, `backdrop-filter`, borde luminoso, reflejo interior) viven allá,
 * en un solo lugar; aquí no se repiten en utilidades.
 *
 * ── REGLA DE USO. NO ES UNA SUGERENCIA ──
 * `backdrop-filter` es el efecto MÁS CARO del sistema: obliga al navegador a
 * rasterizar todo lo que hay detrás del panel y desenfocarlo, en cada pintado.
 * Este sitio vende optimización de Core Web Vitals, así que el cristal se
 * raciona:
 *
 *   · ÚSALO en paneles protagonistas, los que se cuentan con los dedos de una
 *     mano por página: el panel del mapa, una tarjeta destacada, la barra del
 *     header, un panel de detalle.
 *   · NO LO USES en rejillas densas. Doce tarjetas de certificación no llevan
 *     cristal; llevan `.card` (o `<Card>`), que es opaca y no cuesta nada.
 *   · NUNCA anides cristal sobre cristal: se desenfoca dos veces, se ve sucio y
 *     se paga doble. Un GlassPanel dentro de otro GlassPanel está mal; usa
 *     `bg-surface-alt` para el panel interior.
 *   · NUNCA animes `backdrop-filter` ni el blur. Solo se animan `transform`,
 *     `opacity` y `filter`.
 *
 * ── TEXTO SOBRE CRISTAL ──
 * Siempre tinta, nunca blanco. Está medido: sobre un panel blanco al 62% encima
 * del gradiente, `--ink` da 9.6:1 y el blanco da 1.68:1. Los tokens `text-ink`,
 * `text-ink-muted` y `text-ink-subtle` funcionan tal cual encima del cristal;
 * `text-white` no.
 *
 * ── UNA TRAMPA HEREDADA DE `.glass` ──
 * `.glass` lleva `contain: paint`, que es lo que permite al navegador tratar el
 * panel como una capa independiente. El precio es que nada se dibuja fuera de
 * sus límites: un hijo en `absolute` que asome por el borde queda recortado en
 * silencio. Si necesitas que algo sobresalga, va fuera del panel.
 *
 * Componente de servidor: cero JavaScript en el cliente.
 */
export function GlassPanel({
  as = 'div',
  spec = true,
  strong = false,
  className,
  children,
  ...props
}: GlassPanelProps) {
  const Comp = as as React.ElementType
  return (
    <Comp
      data-slot="glass-panel"
      className={cn('glass', spec && 'glass-spec', strong && 'glass-strong', className)}
      {...props}
    >
      {children}
    </Comp>
  )
}
