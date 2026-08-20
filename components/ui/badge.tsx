import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Badge — una etiqueta, no un control. Renderiza un <span>, no lleva anillo de
 * foco ni estado hover. Si tiene que ser clicable es un Button o un Link.
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
        // `.grad-fill` ya trae el gradiente firma y el texto blanco; `text-white`
        // queda como respaldo explícito si algún día la clase cambia.
        gradient: 'grad-fill text-white',
        // Alias heredado: llegó a llamarse `accent` cuando el acento era un
        // token propio. Hoy el acento es el violeta. No lo uses en código
        // nuevo — elige `default` o `gradient`.
        accent: 'bg-violet-wash text-violet-strong',
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
