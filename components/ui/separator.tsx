import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
  /**
   * Un separador decorativo es puramente visual y se oculta a las tecnologías
   * de asistencia (`role="none"`). Pasa `decorative={false}` cuando la línea
   * divide de verdad dos grupos de contenido que un lector de pantalla debería
   * escuchar anunciados.
   */
  decorative?: boolean
}

/**
 * Separator — un divisor de un pixel.
 *
 * DOM plano a propósito: la versión de Radix necesitaba 'use client', y eso
 * metía una frontera de cliente en páginas que por lo demás son estáticas. La
 * superficie de props es la misma.
 *
 * Usa `--hairline`, el token decorativo: un divisor con `border-control` se ve
 * pesado. Si el divisor tiene que verse, la alternativa del sistema es una barra
 * corta con el gradiente decorativo:
 * `<span className="grad-deco block h-1 w-12 rounded-full" aria-hidden="true" />`.
 */
const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="separator"
      data-orientation={orientation}
      role={decorative ? 'none' : 'separator'}
      aria-orientation={!decorative && orientation === 'vertical' ? 'vertical' : undefined}
      className={cn(
        'shrink-0 bg-hairline',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = 'Separator'

export { Separator }
