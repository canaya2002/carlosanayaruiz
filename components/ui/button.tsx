import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Button — el único primitivo de acción.
 *
 * El foco NO se estiliza aquí: `:focus-visible` de globals.css dibuja el anillo
 * de todo elemento enfocable. Añadir utilidades de ring lo duplicaría.
 *
 * `default` (h-11 = 44px) y `lg` (h-12 = 48px) cumplen el objetivo táctil de
 * 44px. `sm` e `icon` son para cromo denso de escritorio (header, enlaces en
 * línea) y aun así pasan el mínimo de 24px de WCAG 2.2 AA.
 *
 * ── QUÉ GRADIENTE LLEVA EL VARIANT `default`, Y POR QUÉ ──
 * Lleva `--grad-fill`, el gradiente de RELLENO CON TEXTO BLANCO. No lleva
 * `--grad`, el decorativo. Está medido: `--grad` pasa por `--sky` y `--cyan`, y
 * el texto blanco sobre esos dos stops mide 2.77:1 y 1.68:1. Un botón es texto,
 * así que ahí sería ilegible. Todos los stops de `--grad-fill` pasan 5.3:1
 * contra blanco.
 *
 * ── POR QUÉ SE LEE EL TOKEN Y NO LA CLASE `.grad-fill` ──
 * `.grad-fill` está escrita fuera de toda `@layer` en globals.css, así que gana
 * a cualquier utilidad de Tailwind — y encima fija el color del texto en blanco.
 * Con la clase puesta aquí, ningún consumidor podría volver a invertir el botón:
 * `bg-none` y `text-brand-strong` perderían, y el botón invertido de las ocho
 * bandas de CTA del sitio se quedaría con el gradiente encima, indistinguible de
 * su propia banda. Como utilidad arbitraria sí se puede invertir:
 *   className="bg-none bg-surface text-brand-strong"
 * `bg-none` es lo que apaga la imagen, y tailwind-merge además descarta el
 * gradiente porque las dos clases pertenecen al mismo grupo. El gradiente sigue
 * definido en un solo lugar: el token `--grad-fill`.
 *
 * La elevación de hover se anima con `translate`, no con `transform`: en
 * Tailwind v4 las utilidades `translate-*` escriben la propiedad individual
 * `translate`, y una `transition-property` que solo dijera `transform` no la
 * animaría. Nada de lo que se anima afecta el layout, así que el CLS no se
 * mueve.
 */
const buttonVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center gap-2',
    // NO poner `whitespace-nowrap` aquí. Es el default de shadcn y no sobrevive
    // la traducción: en español las etiquetas son más largas que en inglés, y
    // una como "Abrir mi correo con el mensaje" queda indivisible, con un
    // min-content de ~310px. Eso infla su contenedor y desborda la celda de la
    // rejilla a 360px de ancho — y con `overflow-x: clip` puesto en body, el
    // contenido desaparecía sin barra de scroll que lo delatara.
    // Verifica con: npm run check:overflow
    'text-center leading-tight text-balance rounded-lg font-semibold',
    'transition-[translate,background-color,border-color,color,box-shadow,opacity]',
    'duration-300 ease-out-soft',
    'hover:-translate-y-px active:translate-y-0 motion-reduce:hover:translate-y-0',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
    // `disabled` nativo, más `aria-disabled` para los anchors con asChild, que
    // no se pueden deshabilitar de forma nativa.
    'disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none',
    'aria-disabled:pointer-events-none aria-disabled:opacity-50 aria-disabled:shadow-none',
  ],
  {
    variants: {
      variant: {
        // El botón principal del sitio: gradiente de relleno, texto blanco y un
        // resplandor que solo aparece al pasar el mouse (quien lo quiera fijo
        // pasa `shadow-glow-brand` por className, como hace la home).
        default:
          'bg-[image:var(--grad-fill)] text-white hover:opacity-95 hover:shadow-glow-brand',
        outline:
          // border-control, no border-hairline: el borde de un botón es el
          // límite de un componente de UI y debe cumplir WCAG 1.4.11 (3:1),
          // que los tokens decorativos a propósito no cumplen.
          'border border-control bg-surface text-ink hover:bg-ground-tint hover:shadow-lift-1',
        ghost: 'text-ink-muted hover:bg-ground-tint hover:text-ink',
        // Un enlace no se levanta: sería un salto de línea de texto.
        link: 'text-brand-strong underline-offset-4 hover:translate-y-0 hover:underline',
        // El hover pasa del lavado de marca al lavado de cielo — los dos son
        // fondos, no texto, y `text-brand-strong` (6.5:1 sobre blanco) sigue
        // legible sobre ambos.
        subtle: 'bg-brand-wash text-brand-strong hover:bg-sky-wash',
      },
      size: {
        sm: 'h-9 px-3.5 text-sm',
        default: 'h-11 px-5 text-sm',
        lg: 'h-12 px-7 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Renderiza el hijo en lugar de un <button> (Radix Slot). */
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        data-slot="button"
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
