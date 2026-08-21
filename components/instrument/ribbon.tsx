/**
 * ════════════════════════════════════════════════════════════════
 * LA CINTA QUE CORRE
 *
 * El carrusel de este sistema: una cinta de papel impresa que corre y no
 * para. Sin tarjetas, sin flechas, sin paginación, sin JavaScript.
 *
 * ── CÓMO CIERRA EL BUCLE, Y POR QUÉ SE ROMPÍA ──
 * La pista lleva el contenido DUPLICADO y se desplaza exactamente el 50%: al
 * terminar, la segunda copia está donde estaba la primera y el salto es
 * invisible.
 *
 * Eso solo funciona si UNA copia es más ancha que el contenedor. Con listas
 * cortas —cinco certificaciones, cuatro libros— la copia medía menos que la
 * pantalla, así que el empalme entraba en cuadro y la repetición se veía de
 * inmediato: el defecto que se reportó como «los loops se repiten al
 * instante».
 *
 * La corrección es determinista y sin medir nada en runtime: se estima el
 * ancho de la lista a partir del número de caracteres y se repite hasta
 * superar `MIN_COPY_PX`. Como el cálculo es el mismo en servidor y cliente,
 * no hay desajuste de hidratación.
 *
 * La velocidad también sale de ahí: una cinta larga y una corta avanzan a los
 * mismos píxeles por segundo, así que ninguna se ve acelerada.
 * ════════════════════════════════════════════════════════════════
 */

/** Ancho aproximado por carácter, en px. Mono a 11px con tracking .16em. */
const CHAR_PX = 9
/** Ancho grande: display a ~28px medio. */
const CHAR_PX_LG = 20
/** Relleno lateral + el punto separador de `.ribbon-item`. */
const ITEM_PAD_PX = 56
/**
 * Una copia tiene que superar el viewport más ancho que nos importa, con
 * holgura. 2400 px cubre 1920 y deja margen para que el empalme nunca entre
 * en cuadro.
 */
const MIN_COPY_PX = 2400
/** Píxeles por segundo. Lento a propósito: es una cinta, no un ticker. */
const SPEED_PX_S = 34

interface RibbonProps {
  items: readonly string[]
  /** Etiqueta accesible: qué es esta lista. */
  label: string
  /** Corre al revés. Dos cintas en direcciones opuestas dan profundidad. */
  reverse?: boolean
  /** Tamaño display, para nombres en vez de etiquetas. */
  large?: boolean
  /** Override de duración. Normalmente no hace falta: se calcula. */
  duration?: string
}

export function Ribbon({
  items,
  label,
  reverse = false,
  large = false,
  duration,
}: RibbonProps) {
  if (items.length === 0) return null

  const charPx = large ? CHAR_PX_LG : CHAR_PX
  const unitPx = items.reduce(
    (w, s) => w + s.length * charPx + ITEM_PAD_PX,
    0
  )

  /** Cuántas veces repetir la lista para que UNA copia llene la pantalla. */
  const repeats = Math.max(1, Math.ceil(MIN_COPY_PX / Math.max(unitPx, 1)))
  const copy = Array.from({ length: repeats }, () => items).flat()

  const copyPx = unitPx * repeats
  const seconds = Math.round(copyPx / SPEED_PX_S)

  const classes = ['ribbon', reverse && 'ribbon-reverse', large && 'ribbon-lg']
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={classes}
      style={
        { '--ribbon-dur': duration ?? `${seconds}s` } as React.CSSProperties
      }
    >
      <div className="ribbon-track">
        <ul className="ribbon-copy" aria-label={label}>
          {copy.map((item, i) => (
            <li key={`a-${i}-${item}`} className="ribbon-item">
              {item}
            </li>
          ))}
        </ul>
        {/* La segunda copia es lo que hace el bucle. No existe para nadie que
            no la esté mirando. */}
        <ul className="ribbon-copy" aria-hidden="true">
          {copy.map((item, i) => (
            <li key={`b-${i}-${item}`} className="ribbon-item">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
