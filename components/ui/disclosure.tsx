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
 * Nativo a propósito, y eso no se negocia. La respuesta está en el HTML del
 * servidor tanto abierta como cerrada, así que Google y un crawler de LLM pueden
 * leerla; un acordeón con estado en JS la esconde de la respuesta inicial. Todo
 * el movimiento de aquí sale del atributo `open` vía `group-open`, así que este
 * componente sigue sin llevar JS.
 *
 * Pasa el mismo `name` a varios Disclosure para que el navegador te dé
 * comportamiento de acordeón exclusivo — sigue sin JS.
 *
 * ── EL TACTO ──
 * El `summary` lleva `.press`: baja a `scale(0.972)` al hacer clic. En una fila
 * ancha ese hundimiento es lo que hace que se sienta un renglón de app y no un
 * enlace de documento.
 *
 * `.press` está fuera de `@layer` en globals.css, así que su `transition` gana a
 * cualquier `transition-*` que se ponga en el mismo elemento, y su lista es
 * `transform`, `box-shadow` y `background-color` — no incluye `color`. Por eso
 * el cambio de color de la pregunta se mudó al <span> interior, que no lleva
 * ninguna clase sin capa y por tanto sí puede declarar su propia transición. El
 * grupo con nombre `group/sum` es lo que le permite reaccionar al hover del
 * summary y no al del <details> completo, que incluiría la respuesta abierta.
 *
 * ── EL CHEVRON ──
 * Tres estados, todo compuesto: crece al pasar el mouse, gira 180° al abrir y
 * la píldora se rellena con `--grad-fill` en abierto, con el texto en blanco
 * (que es el único uso legal de blanco: todos los stops de `--grad-fill` pasan
 * 5.3:1). El hover NO toca el color del texto a propósito — si lo hiciera,
 * abierto + hover dejaría `--brand-strong` sobre el gradiente oscuro.
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
          'group/sum flex min-h-14 w-full cursor-pointer list-none items-center justify-between',
          'gap-4 rounded-lg py-4 text-left font-semibold text-ink',
          // El tacto. Trae su propia transición: no añadas `transition-*` aquí.
          'press',
          // Realce del renglón completo. No lleva sangrado negativo ni padding
          // horizontal: cualquiera de los dos movería la pregunta respecto a la
          // respuesta o sacaría la fila de su contenedor.
          // Verifica con: npm run check:overflow
          'hover:bg-ground-tint/60',
          '[&::-webkit-details-marker]:hidden'
        )}
      >
        <span className="transition-colors duration-200 ease-out-soft group-hover/sum:text-brand-strong">
          {question}
        </span>
        {/* El chevron va en una píldora de marca para que el punto de clic se
            vea. Rota con `rotate` y crece con `scale`, las propiedades
            individuales que escriben las utilidades de Tailwind v4 — de ahí que
            la transición las nombre una por una. */}
        <span
          aria-hidden="true"
          className={cn(
            'grid size-7 shrink-0 place-items-center rounded-full',
            'bg-brand-wash text-brand-strong',
            'transition-[rotate,scale,background-color,color,box-shadow] duration-300 ease-out-soft',
            'group-hover/sum:scale-110 group-hover/sum:bg-sky-wash group-hover/sum:shadow-lift-1',
            'group-open:rotate-180 group-open:bg-[image:var(--grad-fill)] group-open:text-white',
            'motion-reduce:group-hover/sum:scale-100'
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
      {/* La respuesta entra deslizándose la primera vez que se abre. La
          animación es `opacity` + `transform` (los keyframes `enter-up` de
          globals.css), así que se compone y no toca el layout; y como el nodo
          está en el HTML pase lo que pase, el texto es indexable con o sin
          animación. Se apaga con `prefers-reduced-motion` desde globals.css. */}
      <div className="pb-5 pe-8 text-ink-muted group-open:[animation:enter-up_.45s_var(--ease-out)]">
        {answer}
      </div>
    </details>
  )
}
