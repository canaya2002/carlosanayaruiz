/**
 * ════════════════════════════════════════════════════════════════
 * LA CINTA — el eje de tiempo impreso
 *
 * Una tira de papel ahumado de `--tape-w` que corre por el margen izquierdo
 * de toda la página.
 *
 * ── QUÉ CAMBIÓ Y POR QUÉ ──
 * La primera versión graduaba el riel entero, de arriba abajo. Eso estaba
 * mal por dos razones: un eje de tiempo solo significa algo donde hay tiempo
 * que medir —el héroe—, y pasado el segundo 3 la graduación seguía dibujada
 * sin una sola etiqueta, se veía vacía y se cortaba en seco al final de la
 * página. La aguja, además, era `position: fixed` y seguía flotando sobre el
 * footer, donde no hay nada que medir.
 *
 * Ahora el riel tiene tres partes, y cada una hace un trabajo:
 *
 *   1. `.tape-axis` — el tramo graduado, con la altura EXACTA del héroe
 *      (`--hero-h`). Lleva la aguja y el trazo, los dos pegados con
 *      `sticky`, así que se van cuando el héroe se va. Cierra con una doble
 *      regla, como el final de una escala impresa.
 *   2. `.tape-progress` — cuánto rollo ha pasado bajo la aguja. Le da
 *      sentido al riel en toda su longitud.
 *   3. El cierre — una marca de fin de registro al pie.
 *
 * Todo es CSS y HTML del servidor. Cero JavaScript.
 * ════════════════════════════════════════════════════════════════
 */

/** Graduación cada cuarto de segundo hasta `--tape-span`. Los enteros van marcados. */
const TICKS = [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5] as const

export function Rail({ endLabel }: { endLabel?: string }) {
  return (
    <div
      className="tape parallax-back"
      aria-hidden="true"
      style={{ viewTransitionName: 'tape' } as React.CSSProperties}
    >
      {/* Avance: una sola animación compuesta, ligada al scroll. */}
      <span className="tape-progress" />

      {/* El tramo graduado, acotado al héroe. */}
      <div className="tape-axis">
        {/* La línea de base impresa. La aguja pasó por aquí. */}
        <span className="trace">
          <span className="trace-ink" />
        </span>

        <span className="needle" />

        {TICKS.map((t) => (
          <span
            key={t}
            className="tape-label"
            data-whole={Number.isInteger(t) || undefined}
            style={{ '--t': t } as React.CSSProperties}
          >
            {/* Los medios segundos por debajo de 1 pierden el cero a la
                izquierda («.50»), que es la convención de una escala
                impresa. A partir de 1 el entero se conserva, o «1.50» se
                leería «.50». */}
            {Number.isInteger(t)
              ? t
              : t < 1
                ? t.toFixed(2).slice(1)
                : t.toFixed(2)}
          </span>
        ))}
      </div>

      {/* Fin del registro. Sin esto el riel terminaba cortado en seco. */}
      {endLabel ? <span className="tape-end">{endLabel}</span> : null}
    </div>
  )
}

/**
 * La regla de 2.5 s, impresa en minio.
 *
 * Es el único elemento del sitio autorizado a usar ese rojo sin una medición
 * detrás, porque no describe una medición: ES el umbral contra el que se leen
 * todas.
 */
export function BudgetRule({ label }: { label: string }) {
  return (
    <div className="budget-rule" role="presentation">
      {label}
    </div>
  )
}
