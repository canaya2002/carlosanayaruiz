/**
 * EL TRAMO — un eje de tiempo con las entradas marcadas POR POSICIÓN.
 *
 * Es la tesis del sitio aplicada a una credencial: una fecha no se lee dentro
 * de una tarjeta, se lee contra una regla. El eje va vertical porque el tiempo
 * baja, igual que el rollo del riel.
 *
 * ── DÓNDE VA, Y DÓNDE NO ──
 * Va en /cv, /premios y /certificaciones, que es donde el dato SON fechas
 * reales. NO va en /libros: hay un libro, y una regla con una sola marca no es
 * una medición. Es la misma regla que ya está escrita en el repo a cuenta del
 * dial — «un instrumento que rotula cinco plumas y dibuja cuatro miente»— solo
 * que aplicada por lo bajo.
 *
 * ── LA MARCA MAYOR NO ES UN COLOR DE ESTADO ──
 * La entrada más reciente lleva marca larga y a tinta plena, no minio. El
 * minio y el umbral son SEMÁNTICOS en este sistema: solo pueden aparecer sobre
 * una medición que cruza un umbral publicado. Gastarlos en «lo último» sería
 * exactamente el adorno que rompe el instrumento.
 *
 * ── EL ORDEN ES DESCENDENTE Y ESO ES UNA DECISIÓN ──
 * Lo más reciente arriba. Un registrador escribe hacia abajo, así que el
 * papel más nuevo es el que está saliendo — y para un visitante que quiere
 * saber «qué hace hoy», lo primero que ve tiene que ser lo último que pasó.
 */

export interface SpanEntry {
  /** `YYYY` o `YYYY-MM`. Se recorta al año para la graduación. */
  date: string
  /** Qué pasó, en una línea corta. El margen mide 18rem: no caben dos. */
  what: string
}

interface SpanProps {
  entries: readonly SpanEntry[]
  /** Rótulo del instrumento, ya traducido. */
  label: string
  /** Rótulo del tramo total («tramo» / «span»), ya traducido. */
  spanLabel: string
}

export function Span({ entries, label, spanLabel }: SpanProps) {
  if (entries.length === 0) return null

  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date))
  const newest = sorted[0]!.date.slice(0, 4)
  const oldest = sorted[sorted.length - 1]!.date.slice(0, 4)

  return (
    <div className="margin-row">
      <span className="margin-key">{label}</span>

      {/* El tramo, en cifras: la lectura es la RELACIÓN entre los dos años,
          igual que en la lectura de la portada el veredicto es la relación
          entre lo medido y el presupuesto. Un solo año no se lee como tramo,
          así que en ese caso se imprime el año solo. */}
      <span className="margin-read">
        {newest === oldest ? newest : `${oldest}–${newest}`}
      </span>
      <span className="margin-val !mt-1 !text-[0.6875rem] !tracking-[0.12em] !text-ink-subtle">
        {spanLabel}
      </span>

      <div className="span-axis reveal-stagger mt-4">
        {sorted.map((entry, i) => (
          <span
            key={`${entry.date}-${entry.what}`}
            className="span-mark"
            {...(i === 0 ? { 'data-latest': '' } : {})}
          >
            <span className="span-year">
              <time dateTime={entry.date}>{entry.date.slice(0, 4)}</time>
            </span>
            <span className="span-what">{entry.what}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
