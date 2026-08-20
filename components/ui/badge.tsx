import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Badge — una etiqueta, no un control. Renderiza un <span>, no lleva anillo de
 * foco ni estado hover. Si tiene que ser clicable es un Button o un Link.
 *
 * Ningún variant usa el gradiente decorativo (`--grad`): una etiqueta es texto,
 * y sobre los stops `--sky` / `--cyan` el texto blanco mide 2.77:1 y 1.68:1.
 * El variant `gradient` usa `.grad-fill`, cuyos stops pasan 5.3:1 contra blanco.
 */
const badgeVariants = cva(
  [
    'inline-flex items-center gap-1.5',
    'rounded-full border border-transparent px-2.5 py-0.5',
    'text-xs font-semibold leading-5',
  ],
  {
    variants: {
      variant: {
        default: 'bg-brand-wash text-brand-strong',
        neutral: 'bg-ground-tint text-ink-muted',
        outline: 'border-hairline-strong text-ink-muted',
        // `.grad-fill` ya trae el gradiente de relleno y el texto blanco;
        // `text-white` queda como respaldo explícito si algún día la clase
        // cambia. Aquí sí se usa la clase y no el token: un badge nunca se
        // invierte, así que no hace falta que un consumidor pueda apagarla.
        gradient: 'grad-fill text-white',
        // El acento secundario del sistema nuevo. Sustituye al variant `accent`
        // del sistema violeta, que ya no existe. `--sky` a secas es decorativo
        // (2.70:1): el texto va con `--sky-ink`, que mide 5.8:1.
        sky: 'bg-sky-wash text-sky-ink',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
