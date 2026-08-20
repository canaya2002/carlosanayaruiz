import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Input.
 *
 * - h-11 (44px) para que sea un objetivo táctil cómodo.
 * - `text-base` en móvil y `sm:text-sm` en escritorio: cualquier tamaño menor a
 *   16px hace que iOS Safari haga zoom al enfocar.
 * - `border-control`, nunca `border-hairline`: en un campo el borde ES la señal
 *   de dónde está el control, así que aplica WCAG 1.4.11 (3:1). `--control` mide
 *   3.4:1; los tokens decorativos, 1.2:1. No los intercambies.
 * - `aria-invalid="true"` pone el borde en rojo. Field lo hace por ti.
 * - `data-slot="input"` permite que Field estilice el control sin clonar props.
 *
 * ── EL FOCO, QUE AHORA SE VE ──
 * El anillo lo sigue dibujando `:focus-visible` de globals.css, en todo elemento
 * enfocable del sitio: aquí NO se declara ninguna utilidad de ring, se lo
 * duplicaría.
 *
 * Lo que se añade es lo que el anillo no puede dar, y son dos cosas dentro de la
 * misma `box-shadow` para que no compitan:
 *   · un inset de 1px del color de marca, que engrosa el borde a dos píxeles sin
 *     tocar la geometría — un `border-2` movería el texto un píxel;
 *   · `--glow-brand`, un resplandor bajo el campo, que es lo que hace que el
 *     campo activo se lea a un metro de la pantalla.
 * Ambas son `box-shadow`, que ya estaba en la lista de transición: no hay
 * propiedad nueva animándose y sigue sin haber layout en juego.
 *
 * Con `aria-invalid`, el mismo inset pasa a `--danger` y el resplandor se
 * retira: un campo con error no se celebra.
 *
 * ── POR QUÉ AQUÍ NO VA `.press` ──
 * Deliberado. `.press` baja la escala del elemento al hacer clic, y en un campo
 * de texto el clic ES la forma de poner el cursor: el texto se encogería justo
 * en el momento de apuntar, y volvería a crecer con el caret ya dentro. Se ve
 * roto. El tacto de un campo es el foco, no el hundimiento.
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
        'hover:border-ink-subtle hover:shadow-lift-1',
        'focus:border-brand focus:shadow-[inset_0_0_0_1px_var(--brand),var(--glow-brand)]',
        'file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-semibold file:text-ink',
        'disabled:cursor-not-allowed disabled:bg-ground-tint disabled:opacity-60',
        'disabled:hover:border-control disabled:hover:shadow-none',
        'aria-[invalid=true]:border-danger',
        'aria-[invalid=true]:focus:border-danger',
        'aria-[invalid=true]:focus:shadow-[inset_0_0_0_1px_var(--danger)]',
        className
      )}
      {...props}
    />
  )
)
Input.displayName = 'Input'

export { Input }
