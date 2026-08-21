/**
 * ════════════════════════════════════════════════════════════════
 * EL DIAL — la cara del tambor, como instrumento de verdad
 *
 * Se reportó tres veces y las tres con razón: soso, sin vida, feo, mal
 * acomodado y pequeño. Las versiones anteriores eran un disco pintado con
 * degradados de CSS, y ahí estaba el techo — un `repeating-radial-gradient`
 * no puede dar una marca de bisel nítida, ni una etiqueta, ni un arco que
 * empiece y acabe donde quieras.
 *
 * ── POR QUÉ SVG Y NO MÁS CSS ──
 * SVG no es una librería: es marcado. Va en el HTML del servidor, pesa lo
 * que ocupa su texto y no manda un byte de JavaScript. Y da exactamente lo
 * que faltaba:
 *
 *   · 72 marcas de bisel nítidas a cualquier tamaño, cada sexta más larga.
 *   · Un ARCO por canal, con su ángulo de arranque y su longitud.
 *   · Una etiqueta legible junto a cada arco: `ch a`, `ch b`, …
 *   · Retícula polar y cruz de centro a 1 px reales, no a 1 px escalado.
 *
 * ── LO QUE SE MUEVE ──
 * Dos velocidades, que es lo que separa un aparato encendido de un dibujo:
 * el barrido da una vuelta cada 7 s y el bisel gira al revés cada 44 s.
 * Las dos son `rotate` sobre capas promovidas — compositor puro.
 *
 * ── LO QUE RESPONDE ──
 * `:has()`. Al pasar el puntero (o el foco) por una fila de canal, la placa
 * se lo dice al dial: enciende su arco, agranda su marca, sube su etiqueta
 * a tinta plena y el husillo escribe su identificador. Cero JavaScript.
 *
 * `aria-hidden` en el SVG entero: todo lo que dice está ya en la lista de
 * canales que tiene al lado, con sus enlaces. Repetirlo a un lector de
 * pantalla sería ruido.
 * ════════════════════════════════════════════════════════════════
 */

/** Radio del lienzo. El viewBox es 0 0 200 200 y el centro 100,100. */
const R = 100
const CX = 100
const CY = 100

/** Radios de los arcos de canal, de dentro hacia fuera. */
const ARC_R = [34, 47, 60, 73] as const
/** Ángulo de arranque de cada arco, en grados. Repartidos para que cuatro
 *  arcos no se lean como un solo anillo partido en el mismo sitio. */
const ARC_START = [-96, -20, 84, 172] as const
/** Cuánto abarca cada arco. Menos de media vuelta: un arco cerrado sería
 *  un anillo, y un anillo no tiene principio ni fin que mirar. */
const ARC_SPAN = 132

function polar(r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) }
}

/** Un arco como `path`: más barato que un círculo con dasharray calculado, y
 *  el ángulo se lee en el marcado. */
function arcPath(r: number, from: number, span: number) {
  const a = polar(r, from)
  const b = polar(r, from + span)
  const largo = span > 180 ? 1 : 0
  return `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} A ${r} ${r} 0 ${largo} 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)}`
}

/* NOTA: aquí vivía `bezelTicks()`, que generaba las 72 marcas del bisel
   como `<line>` de SVG. Se retiró con el bisel: en gradiente cónico son una
   declaración de CSS y sí se componen. El SVG se queda con lo que un
   gradiente NO puede dar: arcos con principio y fin, etiquetas de texto y
   retícula a 1 px real. */

export interface DialChannel {
  /** Clave estable. */
  id: string
  /** La letra del canal: a, b, c… Es lo que empareja con `data-ch` en la fila. */
  ch: string
}

export function Dial({
  channels,
  idle,
}: {
  channels: readonly DialChannel[]
  /** Lo que dice el husillo cuando nadie está señalando nada. */
  idle: string
}) {
  /* Nunca más arcos que radios: cinco canales en cuatro radios se pisarían. */
  const shown = channels.slice(0, ARC_R.length)

  return (
    <div className="dial-wrap">
      <div className="dial">
        {/* El barrido va en CSS y no en SVG: un `conic-gradient` da la cola
            que se desvanece con una sola declaración, y rotar una capa ya
            rasterizada no cuesta nada. En SVG haría falta una cuña con
            gradiente y un grupo más que rotar. */}
        <span className="dial-sweep" aria-hidden="true" />

        {/* EL BISEL ES UN GRADIENTE, NO UN SVG, y es una regresión medida
            la que lo decidió. Como `<g>` dentro del SVG costaba 179 layouts y
            179 recálculos EN REPOSO; sacado a su propio `<svg>` los layouts
            bajaron a 0 pero los recálculos se quedaron en 181 — uno por
            frame. Ni un `<g>` ni un `<svg>` con contenido reciben capa
            propia, así que su transform no se compone.

            Y un bisel de 72 marcas radiales ES un `repeating-conic-gradient`:
            una capa, un `background`, y compone igual que el barrido. Mismo
            dibujo, cero coste. Ver el bloque «EL DIAL» en globals.css. */}
        <span className="dial-bezel" aria-hidden="true" />

        <svg
          className="dial-svg"
          viewBox="0 0 200 200"
          role="presentation"
          aria-hidden="true"
        >
          <defs>
            {/* El cuerpo: hollín con la luz entrando por arriba a la
                izquierda, igual que el resto del volumen del sistema. */}
            <radialGradient id="dial-body" cx="34%" cy="26%" r="78%">
              <stop offset="0%" stopColor="#2b2721" />
              <stop offset="42%" stopColor="#1a1714" />
              <stop offset="100%" stopColor="#100e0c" />
            </radialGradient>
          </defs>

          <circle cx={CX} cy={CY} r={R - 1} fill="url(#dial-body)" />
          <circle cx={CX} cy={CY} r={R - 1.5} className="dial-rim" />

          {/* Retícula polar: la cruz y dos circunferencias de referencia. */}
          <g className="dial-grid">
            <line x1={CX} y1={14} x2={CX} y2={186} />
            <line x1={14} y1={CY} x2={186} y2={CY} />
            <circle cx={CX} cy={CY} r={82} />
          </g>

          {/* Un arco por canal, con su marca y su etiqueta. */}
          {shown.map((c, i) => {
            const r = ARC_R[i]
            const from = ARC_START[i]
            const end = polar(r, from + ARC_SPAN)
            const label = polar(r, from + ARC_SPAN + 16)
            return (
              <g key={c.id} className="dial-ch" data-ch={c.ch}>
                <path d={arcPath(r, from, ARC_SPAN)} className="dial-arc" />
                <circle
                  cx={end.x.toFixed(2)}
                  cy={end.y.toFixed(2)}
                  r={2.4}
                  className="dial-blip"
                />
                <text
                  x={label.x.toFixed(2)}
                  y={label.y.toFixed(2)}
                  className="dial-label"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {c.ch}
                </text>
              </g>
            )
          })}

          {/* El husillo. Un `<text>` por estado y CSS decide cuál se ve:
              el contenido de un `<text>` no se puede cambiar con `content`,
              así que se pintan todos y se apaga lo que no toca. */}
          <circle cx={CX} cy={CY} r={19} className="dial-hub-ring" />
          <text
            x={CX}
            y={CY}
            className="dial-hub-text"
            data-hub="idle"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {idle}
          </text>
          {shown.map((c) => (
            <text
              key={c.id}
              x={CX}
              y={CY}
              className="dial-hub-text"
              data-hub={c.ch}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {`ch ${c.ch}`}
            </text>
          ))}
        </svg>
      </div>
    </div>
  )
}
