import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Textarea. Mismo contrato que Input: bordes con tokens, borde de marca al
 * enfocar, estilo para `aria-invalid`, `data-slot="textarea"` para Field y
 * ningún anillo de foco propio.
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
      'hover:border-ink-subtle',
      'focus:border-brand',
      'disabled:cursor-not-allowed disabled:bg-ground-tint disabled:opacity-60',
      'aria-[invalid=true]:border-danger',
      className
    )}
    {...props}
  />
))
Textarea.displayName = 'Textarea'

export { Textarea }
