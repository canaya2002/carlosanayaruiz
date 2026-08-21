/**
 * ════════════════════════════════════════════════════════════════
 * LA CINTA QUE CORRE
 *
 * El carrusel de este sistema: una cinta de papel impresa que corre y no
 * para. Sin tarjetas, sin flechas, sin paginación, sin JavaScript.
 *
 * ── CÓMO CIERRA EL BUCLE ──
 * La pista lleva el contenido DUPLICADO y se desplaza exactamente el 50%:
 * al terminar, la segunda copia está donde estaba la primera y el salto
 * es invisible.
 *
 * Eso solo funciona si UNA copia es más ancha que el contenedor. Con
 * listas cortas —cinco certificaciones, cuatro libros— la copia medía
 * menos que la pantalla y el empalme entraba en cuadro. Se corrige sin
 * medir nada en runtime: se estima el ancho a partir del número de
 * caracteres y se repite hasta superar `MIN_COPY_PX`. Como el cálculo es
 * el mismo en servidor y cliente, no hay desajuste de hidratación.
 *
 * ── POR QUÉ SE QUITÓ `duration` ──
 * Esto era el defecto. La velocidad SIEMPRE se calculó aquí, en píxeles
 * por segundo, precisamente para que una cinta larga y una corta se
 * vieran igual de rápidas. Pero las quince páginas pasaban un
 * `duration="64s"` a mano, que lo anulaba: con 56 nombres eso son 9.200
 * px en 64 s, o sea 143 px/s — cuatro veces la velocidad prevista.
 * Por eso «se movía muy rápido».
 *
 * Ahora no hay override. La velocidad sale de `SPEED_PX_S` y de nada más,
 * así que se cambia en un sitio para todo el sitio.
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
/**
 * Píxeles por segundo. Lento a propósito: es una cinta de registro, no un
 * ticker de bolsa. A 11 px el ojo necesita que el glifo se quede quieto lo
 * suficiente para leerlo, y por debajo de ~45 px/s eso empieza a pasar.
 */
const SPEED_PX_S = 38
/**
 * La cinta de nombres corre más rápido en px/s y más despacio a la vista:
 * un glifo de 28 px recorre su propio ancho en el mismo tiempo que uno de
 * 11 px a menos de la mitad de la velocidad. La percepción va con el
 * tamaño, así que la constante también.
 */
const SPEED_PX_S_LG = 64
/**
 * El carril de vuelta va más despacio, y eso es lo que da la profundidad:
 * dos planos a distinta velocidad, sin una sola sombra.
 */
const SPEED_BACK = 0.72

interface RibbonProps {
  items: readonly string[]
  /** Etiqueta accesible: qué es esta lista. */
  label: string
  /** Corre al revés. Dos cintas en direcciones opuestas dan profundidad. */
  reverse?: boolean
  /** Tamaño display, para nombres en vez de etiquetas. */
  large?: boolean
}

export function Ribbon({
  items,
  label,
  reverse = false,
  large = false,
}: RibbonProps) {
  if (items.length === 0) return null

  const charPx = large ? CHAR_PX_LG : CHAR_PX
  const unitPx = items.reduce((w, s) => w + s.length * charPx + ITEM_PAD_PX, 0)

  /** Cuántas veces repetir la lista para que UNA copia llene la pantalla. */
  const repeats = Math.max(1, Math.ceil(MIN_COPY_PX / Math.max(unitPx, 1)))
  const copy = Array.from({ length: repeats }, () => items).flat()

  const copyPx = unitPx * repeats
  const speed = (large ? SPEED_PX_S_LG : SPEED_PX_S) * (reverse ? SPEED_BACK : 1)
  const seconds = Math.round(copyPx / speed)

  const classes = ['ribbon', reverse && 'ribbon-reverse', large && 'ribbon-lg']
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={classes}
      style={{ '--ribbon-dur': `${seconds}s` } as React.CSSProperties}
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
