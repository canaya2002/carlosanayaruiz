import * as React from 'react'
import { cn } from '@/lib/utils'

/** Elementos que puede renderizar un GlassPanel. Por defecto `div`. */
type GlassPanelAs = 'div' | 'section' | 'article' | 'aside' | 'figure' | 'li'

export interface GlassPanelProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Etiqueta a renderizar. Elige la que describa el contenido: `section` si el
   * panel es una sección con encabezado propio, `article` si se sostiene solo,
   * `aside` si es complementario, `figure` si envuelve una imagen con pie, `li`
   * si es un elemento de una lista o de un carril de carrusel, `div` si es puro
   * envoltorio visual.
   */
  as?: GlassPanelAs
  /**
   * El reflejo especular: una banda diagonal estática muy tenue que hace leer
   * la superficie como vidrio en lugar de como plástico translúcido. Es un
   * pseudo-elemento con gradiente, así que no cuesta nada — de ahí que venga
   * encendido. Pásalo en `false` solo si necesitas el `::before` del panel para
   * otra cosa.
   */
  spec?: boolean
  /**
   * Sube la opacidad del relleno de 0.62 a 0.74. Menos vidrio, más papel — y es
   * OBLIGATORIO en cuanto el panel contenga `text-ink-subtle`. Ver la regla
   * medida en el bloque de abajo.
   */
  strong?: boolean
  /**
   * Relleno teñido: `--ground-tint` al 50% en vez de blanco. Para paneles que
   * tienen que separarse de otro cristal vecino sin cambiar de material.
   *
   * ⚠ No lo combines con `strong`. Las dos clases escriben el mismo
   * `background-color` y `.glass-tint` está después en globals.css, así que
   * ganaría el tinte y perderías la opacidad — junto con el derecho a usar
   * `text-ink-subtle`.
   */
  tint?: boolean
  /**
   * Borde de 1px recorrido por el gradiente de marca, sin envoltorios: dos
   * capas de `background-image`, una recortada al padding-box y otra al
   * border-box. Para el panel protagonista de una página.
   */
  rim?: boolean
}

/**
 * GlassPanel — el primitivo de "cristal líquido".
 *
 * Compone las clases de globals.css: `.glass` siempre, más `.glass-spec`,
 * `.glass-strong`, `.glass-tint` y `.glass-rim` según las props. Las cinco capas
 * del efecto (relleno translúcido, `backdrop-filter`, borde luminoso, reflejo
 * interior, sombra) viven allá, en un solo lugar; aquí no se repiten en
 * utilidades.
 *
 * ── LA REGLA QUE SE VA A OLVIDAR: ink-subtle EXIGE `strong` ──
 * Está medida contra el campo de aurora MÁS oscuro (azul de marca al 30% sobre
 * el fondo, que da #bbcef8), que es el peor caso real del sitio:
 *
 *     texto            sobre .glass (62%)      sobre .glass-strong (74%)
 *     --ink                13.6:1                     —
 *     --ink-muted           5.1:1                     —
 *     --ink-subtle          4.30:1  ✗ NO PASA        4.54:1  ✓
 *
 * Es decir: un panel que contenga `text-ink-subtle` —una nota al pie, un
 * calificador, el `hint` de un Metric— tiene que ser `<GlassPanel strong>`. Con
 * el cristal por defecto queda en 4.30 y no llega a 4.5. La diferencia entre
 * pasar y no pasar son doce puntos de opacidad, así que a ojo no se nota: hay
 * que acordarse.
 *
 * Y en los dos casos: el texto sobre cristal es SIEMPRE tinta, NUNCA blanco. El
 * blanco sobre un panel de cristal mide 1.96:1.
 *
 * `npm run palette:check` verifica los tres casos compuestos.
 *
 * ── REGLA DE USO. NO ES UNA SUGERENCIA ──
 * `backdrop-filter` es el efecto MÁS CARO del sistema: obliga al navegador a
 * rasterizar todo lo que hay detrás del panel y desenfocarlo, en cada pintado.
 * Este sitio vende optimización de Core Web Vitals, así que el cristal se
 * raciona:
 *
 *   · ÚSALO en paneles protagonistas, los que se cuentan con los dedos de una
 *     mano por página: el panel del mapa, una tarjeta destacada, la barra del
 *     header, un panel de detalle.
 *   · NO LO USES en rejillas densas de más de ~8 elementos. Doce tarjetas de
 *     certificación no llevan cristal; llevan `.card` (o `<Card>`), que es opaca
 *     y no cuesta nada.
 *   · NUNCA anides cristal sobre cristal: se desenfoca dos veces, se ve sucio y
 *     se paga doble. Un GlassPanel dentro de otro GlassPanel está mal; usa
 *     `bg-surface-alt` para el panel interior.
 *   · NUNCA animes `backdrop-filter` ni el blur. Solo se animan `transform`,
 *     `opacity` y `filter`.
 *
 * En móvil el blur baja a 16px y la saturación a 150% desde globals.css: mismo
 * efecto, casi todo el costo fuera.
 *
 * ── UNA TRAMPA HEREDADA DE `.glass` ──
 * `.glass` lleva `contain: paint`, que es lo que permite al navegador tratar el
 * panel como una capa independiente. El precio es que nada se dibuja fuera de
 * sus límites: un hijo en `absolute` que asome por el borde queda recortado en
 * silencio. Si necesitas que algo sobresalga, va fuera del panel.
 *
 * `.glass` también fija `border-radius: --radius-2xl` desde fuera de `@layer`,
 * así que gana a cualquier `rounded-*` que le pases.
 *
 * Componente de servidor: cero JavaScript en el cliente.
 */
export function GlassPanel({
  as = 'div',
  spec = true,
  strong = false,
  tint = false,
  rim = false,
  className,
  style,
  children,
  ...props
}: GlassPanelProps) {
  const Comp = as as React.ElementType

  /**
   * `rim` + `strong`/`tint`: la corrección que evita un fallo de contraste mudo.
   *
   * `.glass-rim` pinta el panel con una `background-image` de dos capas y la
   * primera fija `--glass-bg`, el 62%. Una imagen de fondo se dibuja ENCIMA del
   * `background-color`, así que el 74% de `.glass-strong` deja de verse: el
   * panel vuelve a 62% y `text-ink-subtle` cae de 4.54 a 4.30 sin que nada lo
   * anuncie.
   *
   * Se re-declara solo la primera capa con el token que corresponde. Va en
   * línea porque un estilo en línea es lo único que le gana a una clase escrita
   * fuera de `@layer`. El `style` del consumidor se aplica después, así que
   * sigue pudiendo sobrescribirlo.
   */
  const rimFill = tint ? 'var(--glass-bg-tint)' : strong ? 'var(--glass-bg-strong)' : null
  const rimFix =
    rim && rimFill
      ? { backgroundImage: `linear-gradient(${rimFill}, ${rimFill}), var(--grad)` }
      : null

  return (
    <Comp
      data-slot="glass-panel"
      className={cn(
        'glass',
        spec && 'glass-spec',
        strong && 'glass-strong',
        tint && 'glass-tint',
        rim && 'glass-rim',
        className
      )}
      style={rimFix ? { ...rimFix, ...style } : style}
      {...props}
    >
      {children}
    </Comp>
  )
}
