import * as React from 'react'
import { cn } from '@/lib/utils'

export interface DisclosureProps
  extends Omit<React.ComponentPropsWithoutRef<'details'>, 'children' | 'open'> {
  question: React.ReactNode
  answer: React.ReactNode
  /** Abierto en el primer pintado. Después, alternar es cosa del navegador. */
  defaultOpen?: boolean
}

/**
 * Disclosure — un elemento de FAQ, construido sobre <details>/<summary>.
 *
 * Nativo a propósito. La respuesta está en el HTML del servidor tanto abierta
 * como cerrada, así que Google y un crawler de LLM pueden leerla; un acordeón
 * con estado en JS la esconde de la respuesta inicial. El chevron gira con el
 * atributo `open` vía `group-open`, así que este componente no lleva JS.
 *
 * Pasa el mismo `name` a varios Disclosure para que el navegador te dé
 * comportamiento de acordeón exclusivo — sigue sin JS.
 */
export function Disclosure({
  question,
  answer,
  defaultOpen = false,
  className,
  ...props
}: DisclosureProps) {
  return (
    <details
      data-slot="disclosure"
      // `|| undefined` para que React nunca escriba el atributo en los cerrados
      // y por lo tanto nunca cierre el que el lector dejó abierto en un
      // re-render ajeno.
      open={defaultOpen || undefined}
      className={cn('group border-b border-hairline', className)}
      {...props}
    >
      <summary
        className={cn(
          'flex min-h-14 w-full cursor-pointer list-none items-center justify-between gap-4 py-4',
          'text-left font-semibold text-ink transition-colors duration-200 ease-out-soft',
          'hover:text-brand-strong',
          '[&::-webkit-details-marker]:hidden'
        )}
      >
        <span>{question}</span>
        {/* El chevron va en una píldora de marca para que el punto de clic se
            vea. Rota con `rotate`, la propiedad individual que escriben las
            utilidades de Tailwind v4 — de ahí que la transición la nombre. */}
        <span
          aria-hidden="true"
          className={cn(
            'grid size-7 shrink-0 place-items-center rounded-full',
            'bg-brand-wash text-brand-strong',
            'transition-[rotate,background-color,color] duration-300 ease-out-soft',
            'group-hover:bg-violet-wash group-open:rotate-180'
          )}
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
          >
            <path d="m5 7.5 5 5 5-5" />
          </svg>
        </span>
      </summary>
      <div className="pb-5 pe-8 text-ink-muted">{answer}</div>
    </details>
  )
}
