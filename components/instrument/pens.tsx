/**
 * LAS PLUMAS — el registro multicanal.
 *
 * Una pluma por paso del proceso, todas escribiendo en la misma hoja. Es el
 * instrumento de las cuatro páginas de servicio y lo que dibuja sale de
 * `service.process`: si un servicio gana un paso, aparece una pluma sola.
 *
 * ── POR QUÉ EXISTE ──
 * Las catorce páginas que no son la portada tenían el 45% derecho de la hoja
 * muerto en todo offset de scroll (medido a 1440). El margen de anotación es
 * la columna que faltaba; esto es lo que va dentro en las de servicio.
 *
 * ── POR QUÉ EL LARGO NO ES DECORATIVO ──
 * El largo de cada traza es la POSICIÓN del paso dentro de la entrega, no un
 * número inventado: el primer paso escribe un tramo corto y el último llega
 * al final de la hoja, porque un proceso avanza. Es lo mismo que hace la
 * lectura de la portada — se lee por posición contra una regla— aplicado a
 * una secuencia que SÍ es una secuencia real (a diferencia de los canales,
 * que son paralelos y por eso van con letra).
 *
 * ── CERO NODOS QUE GIREN ──
 * Todo son elementos con `background`. En este repo ya está medido que un
 * `<g>` girando dentro de un SVG cuesta 179 layouts en reposo, porque ni un
 * `<g>` ni un `<svg>` con contenido reciben capa propia. Aquí no gira nada,
 * pero la regla se respeta igual: la traza se recorta con `clip-path`, que es
 * compositor puro, y no con `width`, que sería layout.
 */

interface PensProps {
  /** Los pasos, en el orden en que se entregan. */
  steps: readonly { title: string }[]
  /** Rótulo del instrumento. Ya traducido: esto no lee el diccionario. */
  label: string
  /** La unidad de la cifra de lectura («plumas» / «pens»), ya traducida. */
  unit: string
  /** La leyenda de una línea que explica qué se está mirando. */
  legend: string
}

export function Pens({ steps, label, unit, legend }: PensProps) {
  if (steps.length === 0) return null

  return (
    <div className="margin-row">
      <span className="margin-key">{label}</span>

      {/* La cifra de lectura: cuántas plumas escriben. Sale de `length`, así
          que no puede desmentir al dibujo — que es exactamente el defecto que
          se corrigió en el dial, donde el rótulo decía «a–e» dibujando
          cuatro. */}
      <span className="margin-read">
        {steps.length}
        <span className="ml-1.5 text-[0.6875rem] tracking-[0.12em] text-ink-subtle">
          {unit}
        </span>
      </span>

      <div className="pens mt-4">
        {steps.map((step, i) => (
          <div
            key={step.title}
            className="pen"
            /* `--i` escalona la escritura al cargar; `--pen-len` es la
               posición del paso dentro de la entrega. El primero no arranca
               en 0 —una pluma que no escribió nada se lee como avería— sino
               en el primer tramo real de la escala. */
            style={
              {
                '--i': i,
                '--pen-len': `${Math.round(((i + 1) / steps.length) * 100)}%`,
              } as React.CSSProperties
            }
          >
            <span className="pen-id" aria-hidden="true">
              {String.fromCharCode(97 + i)}
            </span>
            <span className="pen-track" />
          </div>
        ))}
      </div>

      {/* Los nombres de los pasos, en su orden, para que el dibujo signifique
          algo. Sin esto las plumas serían una barra de progreso decorativa. */}
      <ol className="mt-4 grid gap-1.5">
        {steps.map((step, i) => (
          <li
            key={step.title}
            className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-3 font-mono text-[0.6875rem] leading-[1.4] tracking-[0.04em] text-ink-muted"
          >
            <span aria-hidden="true" className="text-ink-subtle">
              {String.fromCharCode(97 + i)}
            </span>
            <span>{step.title}</span>
          </li>
        ))}
      </ol>

      <p className="mt-4 font-mono text-[0.6875rem] leading-[1.45] tracking-[0.04em] text-ink-subtle">
        {legend}
      </p>
    </div>
  )
}
