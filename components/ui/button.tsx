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
 * ── EL TACTO: `.press` MANDA SOBRE LA TRANSICIÓN ──
 * La base lleva `.press`, que es lo que hace que el botón se sienta de app y no
 * de formulario: baja a `scale(0.972)` al hacer clic con `--ease-press`, que es
 * casi instantánea a propósito — un control tiene que responder antes de que el
 * dedo se levante.
 *
 * `.press` está escrita FUERA de `@layer` en globals.css, así que su
 * `transition` le gana a cualquier utilidad `transition-*` de Tailwind. Eso
 * tiene dos consecuencias que NO son opcionales:
 *
 *   1. Ya no se declara aquí ninguna utilidad de transición: perdería. La lista
 *      efectiva es la de `.press` → `transform`, `box-shadow`,
 *      `background-color`.
 *   2. El levantamiento de hover se escribe como `transform` y no como
 *      `translate`. En Tailwind v4 `translate-y-*` escribe la propiedad
 *      individual `translate`, que `.press` no nombra: se movería de golpe, sin
 *      animar. Con `transform`, además, `.press:active` (misma propiedad, más
 *      especificidad y sin capa) le gana al hover, así que al hacer clic el
 *      botón deja de estar elevado y se hunde. Ese relevo es el gesto completo.
 *
 * Lo que se pierde a cambio, y se acepta a ojo: `color` y `opacity` no están en
 * la lista de `.press`, así que el `hover:text-ink` de `ghost` cambia de golpe.
 * Es imperceptible porque ocurre a la vez que el fondo, que sí se funde en
 * 0.28 s. Por eso `default` ya no lleva `hover:opacity-95`: sin transición era
 * un salto, y el resplandor más el barrido comunican mejor lo mismo.
 *
 * Nada de lo que se anima aquí afecta el layout, así que el CLS no se mueve.
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
    // El tacto. Trae su propia transición: lee la nota de arriba antes de
    // añadir cualquier `transition-*` a este archivo.
    'press',
    // Elevación al pasar el mouse, en `transform` para que `.press` la anime y
    // para que el clic la releve. tailwind-merge las trata como el mismo grupo,
    // así que un variant puede apagarla — lo hace `link`.
    'hover:[transform:translateY(-2px)] motion-reduce:hover:[transform:none]',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
    // `disabled` nativo, más `aria-disabled` para los anchors con asChild, que
    // no se pueden deshabilitar de forma nativa.
    'disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none',
    'aria-disabled:pointer-events-none aria-disabled:opacity-50 aria-disabled:shadow-none',
  ],
  {
    variants: {
      variant: {
        // El botón principal del sitio: gradiente de relleno, texto blanco, el
        // barrido especular de `.sheen` y un resplandor que solo aparece al
        // pasar el mouse (quien lo quiera fijo pasa `shadow-glow-brand` por
        // className, como hace la home).
        //
        // `.sheen` recorta (`overflow: hidden`) y aísla su contexto de apilado
        // para barrer su `::after` por encima del relleno. Con eso, un hijo
        // absoluto que asome por el borde del botón queda cortado: si necesitas
        // que algo sobresalga, va fuera del botón.
        default: 'sheen bg-[image:var(--grad-fill)] text-white hover:shadow-glow-brand',
        // Cristal líquido. Texto TINTA, nunca blanco: sobre `.glass` (62%)
        // `--ink` mide 13.6:1 y el blanco 1.96:1. `--ink-muted` (5.1) pasa pero
        // se ve apagado en un control; en un botón siempre `text-ink`.
        //
        // Dos herencias de `.glass`, que está fuera de `@layer` y por tanto gana
        // a las utilidades:
        //   · el radio pasa a `--radius-2xl`, así que este variant se ve
        //     cápsula. `rounded-*` no lo cambia; si necesitas otro radio, el
        //     variant correcto es `outline`.
        //   · la `box-shadow` (dos insets + `--lift-3`) tampoco se sustituye con
        //     `shadow-*`. De ahí el `!` del hover: reescribe la pila completa
        //     conservando los insets que hacen que se lea vidrio y le suma el
        //     resplandor de marca. Por lo mismo, `disabled:shadow-none` no la
        //     apaga; el estado deshabilitado se comunica con la opacidad.
        //
        // ⚠ Nunca dentro de un GlassPanel: cristal sobre cristal difumina dos
        // veces, cuesta el doble y se ve peor. Ahí va `outline`.
        glass:
          'glass glass-spec sheen text-ink hover:shadow-[inset_0_1px_0_0_var(--glass-highlight),inset_0_0_0_1px_var(--glass-edge),var(--lift-3),var(--glow-brand)]!',
        outline:
          // border-control, no border-hairline: el borde de un botón es el
          // límite de un componente de UI y debe cumplir WCAG 1.4.11 (3:1),
          // que los tokens decorativos a propósito no cumplen.
          'border border-control bg-surface text-ink hover:bg-ground-tint hover:shadow-lift-2',
        ghost: 'text-ink-muted hover:bg-ground-tint hover:text-ink',
        // Un enlace no se levanta: sería un salto de línea de texto. Apaga el
        // `transform` de hover de la base — mismo grupo en tailwind-merge, y
        // como el variant se concatena después, gana. La bajada de escala de
        // `.press` sí se queda: en un enlace se lee como un toque, no como un
        // botón hundiéndose.
        link: 'text-brand-strong underline-offset-4 hover:[transform:none] hover:underline',
        // El hover pasa del lavado de marca al lavado de cielo — los dos son
        // fondos, no texto, y `text-brand-strong` (6.5:1 sobre blanco) sigue
        // legible sobre ambos. El resplandor cian lo despega del papel.
        subtle: 'bg-brand-wash text-brand-strong hover:bg-sky-wash hover:shadow-glow-cyan',
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
