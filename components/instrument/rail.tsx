/**
 * ════════════════════════════════════════════════════════════════
 * LA MÁQUINA — el riel, la hoja y el hueco
 *
 * Tres piezas, y la separación es el punto:
 *
 *   1. `<Drum>` — el RIEL visible. Un único elemento fijo, montado una
 *      sola vez en el layout, que corre del canto superior del nav al
 *      canto inferior del pie. Es el margen perforado de la hoja.
 *   2. `<SheetField>` — la HOJA. El otro único elemento fijo: la
 *      superficie de papel de registro detrás de todo el documento.
 *   3. `<Rail>` — el HUECO. No pinta nada: es la primera columna de la
 *      rejilla que cada página reserva para el riel.
 *
 * ── EL RIEL Y LA HOJA SON EL MISMO PAPEL ──
 * Misma graduación (`--rail-step`), mismo recorrido por ciclo
 * (`--rail-run`) y misma duración. No es una coincidencia estética: el
 * riel es el margen y la hoja es la superficie, así que corren juntos.
 * Los dos arrastran hacia abajo a ~13 px/s, permanente, porque un
 * registrador encendido arrastra papel.
 *
 * ── QUÉ SE RETIRÓ, Y POR QUÉ ──
 * · La graduación en segundos con sus cifras al margen (0, .25, .50…),
 *   la aguja de punta de flecha y la línea de ruido. Todo eso vivía
 *   dentro de la altura del héroe: se cortaba en seco a media página y
 *   debajo quedaban cuatro mil píxeles de riel negro. Un eje que se
 *   detiene no es un eje.
 * · El campo por sección (`.drum-field`). Solo lo llevaban dos
 *   secciones, así que el resto se veía en negro pelado, y el canto de
 *   su máscara terminaba la retícula en una última línea que se leía
 *   como una regla de separación suelta. Un campo fijo y uniforme no
 *   tiene última línea.
 *
 * Todo es CSS y HTML del servidor. Cero JavaScript.
 * ════════════════════════════════════════════════════════════════
 */

/**
 * El riel visible. Va en el layout, UNA vez, fuera de `<main>`: si se
 * montara por página volvería a cortarse en el pie.
 */
export function Drum() {
  return (
    <div
      className="drum"
      aria-hidden="true"
      /* La cinta es el objeto constante del sitio: al navegar no se
         desvanece con el resto del documento, se queda. */
      style={{ viewTransitionName: 'drum' } as React.CSSProperties}
    >
      <span className="drum-marks" />
      <span className="drum-trace" />
    </div>
  )
}

/**
 * La hoja de papel de registro, detrás de todo el documento.
 *
 * Dos capas y solo una se mueve: la retícula corre y el bastidor —las
 * divisiones mayores y el cilindro— se queda quieto. Que dos planos vayan
 * a distinta velocidad es de donde sale la profundidad, sin una sola
 * sombra y sin una sola caja.
 */
export function SheetField() {
  return (
    <div
      className="sheet-field"
      aria-hidden="true"
      style={{ viewTransitionName: 'sheet' } as React.CSSProperties}
    />
  )
}

/**
 * El hueco que la rejilla de la página reserva para el riel. Sin fondo y
 * sin borde: lo que se ve lo pinta `<Drum>` desde el layout.
 */
export function Rail() {
  return <div className="tape" aria-hidden="true" />
}
