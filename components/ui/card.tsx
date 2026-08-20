import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Card — el panel del sistema: borde hairline, superficie blanca, radio grande
 * y una sombra suave que lo despega de la página.
 *
 * Toda esa base vive en la clase `.card` de globals.css, la misma que usa la
 * home escribiéndola a mano. Aquí no se repite en utilidades para que exista una
 * sola definición.
 *
 * ── CARD O GLASSPANEL ──
 * Card es OPACA y no cuesta nada, así que es la opción por defecto y la única
 * válida en rejillas densas: doce tarjetas de certificación son doce Card.
 * `<GlassPanel>` es para el panel protagonista y aislado, porque su
 * `backdrop-filter` es el efecto más caro del sistema. Cuando dudes, Card.
 *
 * La elevación al pasar el mouse es opt-in: `className="card-hover"`. Esa clase
 * anima `transform` + `box-shadow` (nunca `margin` ni `top`), así que elevar una
 * tarjeta no provoca CLS.
 *
 * Ojo con los overrides: `.card` está fuera de `@layer`, así que gana a las
 * utilidades de Tailwind. Para cambiar fondo o radio no basta con pasar
 * `bg-*` / `rounded-*`; en ese caso no uses Card, arma el panel a mano.
 */
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="card" className={cn('card', className)} {...props} />
  )
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-header"
      className={cn('flex flex-col gap-2 p-6', className)}
      {...props}
    />
  )
)
CardHeader.displayName = 'CardHeader'

/** Elementos que puede renderizar un CardTitle. Por defecto `h3`. */
type CardTitleAs = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div' | 'span'

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /**
   * Nivel de encabezado. Elige el que mantenga correcto el outline de la
   * página — nunca te saltes un nivel. Los valores que no son encabezado
   * existen para tarjetas cuyo título no es un encabezado de sección (por
   * ejemplo una etiqueta repetida dentro de un elemento de lista).
   */
  as?: CardTitleAs
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, as = 'h3', ...props }, ref) => {
    const Comp = as as React.ElementType
    return (
      <Comp
        ref={ref}
        data-slot="card-title"
        // `font-display` explícita: globals.css solo la aplica a h1–h4, y este
        // título puede renderizarse como p, div o span.
        className={cn('font-display text-d3 text-ink', className)}
        {...props}
      />
    )
  }
)
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    data-slot="card-description"
    className={cn('text-sm leading-relaxed text-ink-muted', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="card-content" className={cn('p-6 pt-0', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-footer"
      className={cn('flex items-center gap-3 p-6 pt-0', className)}
      {...props}
    />
  )
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
