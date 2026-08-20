import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Textarea. Mismo contrato que Input, y por las mismas razones medidas:
 * `border-control` (3.4:1, WCAG 1.4.11) y nunca un token decorativo; el anillo
 * de foco lo pone `:focus-visible` de globals.css y aquí no se duplica;
 * `data-slot="textarea"` para que Field lo estilice sin clonar props; y estilo
 * propio para `aria-invalid`.
 *
 * El foco añade lo mismo que en Input, en una sola `box-shadow`: un inset de 1px
 * en `--brand` que engrosa el borde sin mover la geometría —un `border-2`
 * desplazaría el texto un píxel— más `--glow-brand` por debajo. Con
 * `aria-invalid` el inset pasa a `--danger` y el resplandor se retira.
 *
 * Tampoco lleva `.press`: bajar la escala al hacer clic dentro de un área de
 * texto encogería el texto justo en el momento de colocar el cursor. Ver la nota
 * completa en input.tsx.
 */
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    data-slot="textarea"
    className={cn(
      'flex min-h-28 w-full rounded-md border border-control bg-surface px-3.5 py-2.5',
      'text-base text-ink sm:text-sm',
      'transition-[border-color,background-color,box-shadow] duration-200 ease-out-soft',
      'placeholder:text-ink-subtle',
      'hover:border-ink-subtle hover:shadow-lift-1',
      'focus:border-brand focus:shadow-[inset_0_0_0_1px_var(--brand),var(--glow-brand)]',
      'disabled:cursor-not-allowed disabled:bg-ground-tint disabled:opacity-60',
      'disabled:hover:border-control disabled:hover:shadow-none',
      'aria-[invalid=true]:border-danger',
      'aria-[invalid=true]:focus:border-danger',
      'aria-[invalid=true]:focus:shadow-[inset_0_0_0_1px_var(--danger)]',
      className
    )}
    {...props}
  />
))
Textarea.displayName = 'Textarea'

export { Textarea }
