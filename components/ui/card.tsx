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
 * ── LAS DOS PROPS DE MOVIMIENTO ──
 * `interactive` pone `.lift` y es lo que debe llevar CUALQUIER tarjeta que sea
 * clicable: se eleva 5px y sube a `--lift-4` al pasar el mouse, y al hacer clic
 * baja a -2px con un `scale(0.99)`. Ese relevo hover → active es la mitad de la
 * sensación de que la tarjeta es un control y no una ilustración.
 *
 * `tilt` pone `.tilt-hover`, la inclinación 3D fija de hover: sin JS, un solo
 * `transform` compuesto. Es la opción para rejillas, donde montar un componente
 * cliente por tarjeta (`<Tilt3D>`) no se paga.
 *
 * ⚠ `tilt` NO FUNCIONA SOLO. La perspectiva vive en el contenedor, no en la
 * tarjeta: quien use `tilt` en una rejilla tiene que envolver la REJILLA en
 * `.scene`.
 *
 *   <ul className="scene grid gap-6 sm:grid-cols-3">
 *     <li><Card tilt interactive className="h-full p-6" /></li>
 *   </ul>
 *
 * Si cada tarjeta llevara su propia `perspective`, cada una tendría su punto de
 * fuga y el 3D se vería falso: es justo lo que delata una rejilla mal armada.
 *
 * Las dos props se pueden combinar. Cuando lo haces, la inclinación manda en el
 * hover: `.tilt-hover:hover` está escrita después de `.lift:hover` en
 * globals.css, con la misma especificidad, así que gana — y `.lift:active`, que
 * viene aún después, se queda con el clic. El resultado es el correcto: se
 * inclina al pasar y se asienta al presionar. Ninguna de las dos anima
 * geometría, así que no hay CLS.
 *
 * ── SI VES `card-hover` EN UNA PÁGINA ──
 * Es la clase del sistema anterior y ya no está definida en globals.css: no
 * hace nada. La forma soportada es `<Card interactive>`, o la clase `.lift`
 * cuando la tarjeta está escrita a mano como `.card`.
 *
 * Ojo con los overrides: `.card` está fuera de `@layer`, así que gana a las
 * utilidades de Tailwind. Para cambiar fondo o radio no basta con pasar
 * `bg-*` / `rounded-*`; en ese caso no uses Card, arma el panel a mano.
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * La tarjeta es un control: `.lift` al pasar el mouse y asentamiento al hacer
   * clic. Ponla en toda tarjeta clicable; no la pongas en una que solo informa.
   */
  interactive?: boolean
  /**
   * Inclinación 3D en hover (`.tilt-hover`). Exige que el contenedor —la
   * rejilla, el carril del carrusel— lleve `.scene`.
   */
  tilt?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive = false, tilt = false, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card"
      data-interactive={interactive || undefined}
      className={cn('card', interactive && 'lift', tilt && 'tilt-hover', className)}
      {...props}
    />
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

/**
 * Planos de profundidad para una tarjeta inclinada. `.depth-1/2/3` traducen en
 * Z, así que el contenido flota sobre el fondo de la tarjeta en vez de quedar
 * pegado a ella — es lo que hace que la inclinación se lea como volumen.
 *
 * Solo tienen efecto dentro de un ancestro con `perspective` (`.scene`) y con
 * `transform-style: preserve-3d`, que es lo que ponen `.tilt` y `.tilt-hover`.
 * Fuera de ahí no rompen nada: no se ven.
 *
 * El nivel se resuelve con un mapa y no interpolando la clase: aunque
 * `.depth-*` está escrita a mano en globals.css y por lo tanto no depende del
 * escaneo de Tailwind, un mapa deja el conjunto de clases a la vista de quien
 * lea el archivo — y de cualquier grep.
 */
const depthPlane = { 1: 'depth-1', 2: 'depth-2', 3: 'depth-3' } as const

const CardDepth = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { level?: 1 | 2 | 3 }
>(({ className, level = 1, ...props }, ref) => (
  <div ref={ref} data-slot="card-depth" className={cn(depthPlane[level], className)} {...props} />
))
CardDepth.displayName = 'CardDepth'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardDepth }
