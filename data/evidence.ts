import { forLocale, type Localized, type Locale } from './types'

/**
 * ════════════════════════════════════════════════════════════════
 * LA EVIDENCIA — capturas de instrumento, no adornos
 *
 * Este sitio vende medición, así que la única prueba que vale es una
 * lectura de un instrumento de terceros con su eje de tiempo a la vista.
 * Estos tres archivos son capturas de Google Search Console de una
 * propiedad real: `manuelsolis.com`, que Carlos administra como Director
 * de Tecnologías del despacho (ver `data/experience.ts`).
 *
 * ── TRES REGLAS QUE NO SE NEGOCIAN ──
 *
 * 1. **Toda cifra de `readings` está IMPRESA en su propia imagen.** No hay
 *    una sola interpolada, redondeada a mi gusto ni leída «a ojo» de la
 *    gráfica. Si Google escribe «30.5K», aquí dice «30.5K» — no 30 500,
 *    que sería inventar precisión que el panel no da. La única cifra
 *    derivada es `+34`, y sale de restar dos números impresos (133 y 99)
 *    en la MISMA página donde las dos imágenes están a la vista.
 *
 * 2. **La lectura va como TEXTO y la captura como respaldo.** Un buscador
 *    no lee los píxeles de una gráfica, y un visitante en un teléfono no
 *    puede ampliar una captura de 1592 px. La cifra que importa se sirve
 *    en la placa de datos, en mono con `tabular-nums`; la imagen está
 *    debajo para quien quiera comprobarla. Es la misma tesis del sitio:
 *    el veredicto se lee por posición contra una regla, no dentro de una
 *    tarjeta.
 *
 * 3. **La propiedad se declara.** No son números de este dominio y decir
 *    lo contrario por omisión sería la clase de afirmación sin respaldo
 *    que este repo lleva dos rondas quitando. El pie de cada figura dice
 *    de qué propiedad son y con qué papel se accede a ella.
 *
 * ── QUÉ SE EDITÓ DE LAS CAPTURAS, Y QUÉ NO ──
 * Se recortó la columna de navegación de la izquierda (~24% del ancho,
 * ilegible en un teléfono y sin un solo dato) y se tapó con el color del
 * fondo el bloque de una ventana del sistema que se colaba en el canto
 * superior derecho, junto con la fila de iconos que ese bloque ya cortaba
 * por la mitad. **Ni un píxel de dato, eje, rótulo o cifra se tocó**, y no
 * se aplicó ningún filtro de color: este sistema desatura sus dos retratos
 * porque su luz es azul, pero teñir una gráfica cuyas SERIES son de color
 * sería alterar la evidencia.
 * ════════════════════════════════════════════════════════════════
 */

export type EvidenceId =
  'search-console-alcance' | 'core-web-vitals-urls' | 'core-web-vitals-grupo'

/** Un renglón de la placa: rótulo mono arriba, cifra debajo. */
export interface Reading {
  /** Rótulo. Va en mayúsculas mono, así que corto. */
  key: string
  /** La cifra, LITERAL como la imprime el panel. */
  value: string
}

export interface Evidence {
  id: EvidenceId
  /** Ruta dentro de `public/`. */
  image: string
  /** Dimensiones nativas del archivo. Reservan el espacio: cero CLS. */
  width: number
  height: number
  /** Qué instrumento es. Va en el rótulo de arriba. */
  instrument: string
  /** Las cifras impresas en ESTA imagen. Máximo cuatro: es una placa. */
  readings: Reading[]
  /** El pie: propiedad, ventana y de dónde sale el acceso. */
  caption: string
  /** `alt`. Describe el DOCUMENTO y su lectura, no el proyecto. */
  alt: string
}

const evidenceData: Localized<Evidence[]> = {
  es: [
    {
      id: 'search-console-alcance',
      image:
        '/evidencia/search-console-clics-impresiones-12-meses-carlos-anaya-ruiz.webp',
      width: 1592,
      height: 905,
      instrument: 'Google Search Console · rendimiento',
      readings: [
        { key: 'clics', value: '30.5K' },
        { key: 'impresiones', value: '1.4M' },
        { key: 'ctr medio', value: '2.2%' },
        { key: 'posición media', value: '11.5' },
      ],
      caption:
        'Propiedad manuelsolis.com, que administro como Director de Tecnologías del despacho. Ventana de 12 meses, del 30 de agosto de 2025 al 29 de agosto de 2026. Las cuatro cifras son las que imprime el panel.',
      alt: 'Panel de rendimiento de Google Search Console para manuelsolis.com en una ventana de 12 meses: 30.5K clics, 1.4M impresiones, 2.2% de CTR medio y posición media 11.5, con la curva diaria de clics e impresiones subiendo en el último tercio del eje',
    },
    {
      id: 'core-web-vitals-urls',
      image:
        '/evidencia/core-web-vitals-urls-buenas-search-console-carlos-anaya-ruiz.webp',
      width: 1592,
      height: 1088,
      instrument: 'Google Search Console · Core Web Vitals',
      readings: [
        { key: 'urls buenas', value: '133' },
        { key: 'dispositivo', value: 'escritorio' },
        { key: 'fuente', value: 'Chrome UX Report' },
        { key: 'último dato', value: '30 ago 2026' },
      ],
      caption:
        'Mismo propietario. El informe de experiencia de página de Google, no una herramienta de laboratorio: la fuente que declara el propio panel es el Chrome UX Report, o sea usuarios reales. El eje va del 2 de junio al 30 de agosto de 2026.',
      alt: 'Informe de Core Web Vitals de Google Search Console para manuelsolis.com en escritorio: 133 URLs buenas al 30 de agosto de 2026, con la barra diaria subiendo desde el nivel de 60 el 2 de junio, y la fuente declarada como Chrome UX Report',
    },
    {
      id: 'core-web-vitals-grupo',
      image:
        '/evidencia/core-web-vitals-grupo-de-urls-search-console-carlos-anaya-ruiz.webp',
      width: 1592,
      height: 874,
      instrument: 'Google Search Console · grupo de URLs',
      readings: [
        { key: '31 jul 2026', value: '99' },
        { key: '30 ago 2026', value: '133' },
        { key: 'diferencia', value: '+34' },
        { key: 'urls del grupo', value: '131' },
      ],
      caption:
        'La misma curva con el valor de un día concreto abierto, y debajo el grupo de URLs que la compone: 131 direcciones que comparten comportamiento, con una de ejemplo a la vista. Es lo que descarta que las 133 sean una página de prueba.',
      alt: 'Detalle del informe de Core Web Vitals de manuelsolis.com: el valor del viernes 31 de julio de 2026 marca 99 URLs buenas frente a las 133 del 30 de agosto, y la tabla de grupos de URLs muestra un grupo de 131 direcciones con una URL de blog como ejemplo',
    },
  ],
  en: [
    {
      id: 'search-console-alcance',
      image:
        '/evidencia/search-console-clics-impresiones-12-meses-carlos-anaya-ruiz.webp',
      width: 1592,
      height: 905,
      instrument: 'Google Search Console · performance',
      readings: [
        { key: 'clicks', value: '30.5K' },
        { key: 'impressions', value: '1.4M' },
        { key: 'avg. ctr', value: '2.2%' },
        { key: 'avg. position', value: '11.5' },
      ],
      caption:
        'Property manuelsolis.com, which I administer as the firm’s Director of Technology. Twelve-month window, 30 August 2025 to 29 August 2026. All four figures are the ones the panel prints.',
      alt: 'Google Search Console performance panel for manuelsolis.com over a 12-month window: 30.5K clicks, 1.4M impressions, 2.2% average CTR and average position 11.5, with the daily clicks and impressions curve rising through the last third of the axis',
    },
    {
      id: 'core-web-vitals-urls',
      image:
        '/evidencia/core-web-vitals-urls-buenas-search-console-carlos-anaya-ruiz.webp',
      width: 1592,
      height: 1088,
      instrument: 'Google Search Console · Core Web Vitals',
      readings: [
        { key: 'good urls', value: '133' },
        { key: 'device', value: 'desktop' },
        { key: 'source', value: 'Chrome UX Report' },
        { key: 'last data', value: '30 Aug 2026' },
      ],
      caption:
        'Same property. Google’s own page experience report, not a lab tool: the source the panel declares is the Chrome UX Report, meaning real users. The axis runs from 2 June to 30 August 2026.',
      alt: 'Google Search Console Core Web Vitals report for manuelsolis.com on desktop: 133 good URLs as of 30 August 2026, with the daily bar rising from the 60 level on 2 June, and the source declared as Chrome UX Report',
    },
    {
      id: 'core-web-vitals-grupo',
      image:
        '/evidencia/core-web-vitals-grupo-de-urls-search-console-carlos-anaya-ruiz.webp',
      width: 1592,
      height: 874,
      instrument: 'Google Search Console · URL group',
      readings: [
        { key: '31 jul 2026', value: '99' },
        { key: '30 aug 2026', value: '133' },
        { key: 'difference', value: '+34' },
        { key: 'urls in group', value: '131' },
      ],
      caption:
        'The same curve with a single day’s value open, and below it the URL group behind it: 131 addresses that share behaviour, with one example in view. It is what rules out those 133 being a test page.',
      alt: 'Detail of the Core Web Vitals report for manuelsolis.com: Friday 31 July 2026 reads 99 good URLs against 133 on 30 August, and the URL groups table shows a group of 131 addresses with a blog URL as the example',
    },
  ],
}

export function getEvidence(locale: Locale): Evidence[] {
  return forLocale(evidenceData, locale)
}

/** Una pieza por id. `undefined` si no existe, nunca lanza. */
export function evidenceById(
  locale: Locale,
  id: EvidenceId
): Evidence | undefined {
  return getEvidence(locale).find((e) => e.id === id)
}
