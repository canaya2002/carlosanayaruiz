import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Input.
 *
 * - h-11 (44px) para que sea un objetivo táctil cómodo.
 * - `text-base` en móvil y `sm:text-sm` en escritorio: cualquier tamaño menor a
 *   16px hace que iOS Safari haga zoom al enfocar.
 * - `border-control`, nunca `border-hairline`: en un campo el borde ES la señal
 *   de dónde está el control, así que aplica WCAG 1.4.11 (3:1).
 * - Al enfocar, el borde pasa a color de marca. El anillo de foco lo sigue
 *   poniendo `:focus-visible` de globals.css; esto solo lo acompaña.
 * - `aria-invalid="true"` pone el borde en rojo. Field lo hace por ti.
 * - `data-slot="input"` permite que Field estilice el control sin clonar props.
 */
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      className={cn(
        'flex h-11 w-full rounded-md border border-control bg-surface px-3.5 py-2',
        'text-base text-ink sm:text-sm',
        'transition-[border-color,background-color,box-shadow] duration-200 ease-out-soft',
        'placeholder:text-ink-subtle',
        'hover:border-ink-subtle',
        'focus:border-brand focus:bg-surface',
        'file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-semibold file:text-ink',
        'disabled:cursor-not-allowed disabled:bg-ground-tint disabled:opacity-60',
        'aria-[invalid=true]:border-danger',
        className
      )}
      {...props}
    />
  )
)
Input.displayName = 'Input'

export { Input }
