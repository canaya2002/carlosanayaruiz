import type { Locale } from '@/data/types'

/**
 * ════════════════════════════════════════════════════════════════
 * EL FINAL QUE MUTA — cinco frases en una sola celda de grid
 *
 * «Mido lo que tu sitio …» y el final va cambiando. Cinco cierres, y
 * cada uno es una afirmación que se sostiene sola: juntos son la lista
 * de lo que este trabajo mide.
 *
 * Es el mismo mecanismo que `<Greeting>` y por las mismas dos razones,
 * que no son de estilo:
 *
 * ── 1. CERO CLS ──
 * Las cinco frases viven en LA MISMA celda de grid, todas presentes a la
 * vez, y solo cambia la opacidad. La celda mide lo que la frase más
 * larga, así que nada refluye nunca. Rotar el texto de un titular de
 * 120 px con un reflujo sería una regresión de CLS medible — en la
 * portada de alguien que vende Core Web Vitals.
 *
 * ── 2. UN SOLO h1 INDEXABLE ──
 * Solo la frase canónica es un nodo de texto. Las otras cuatro viajan en
 * `data-w` y las pinta CSS con `content: attr()`. El contenido generado
 * no entra en `innerText` ni se indexa, así que el `<h1>` sigue siendo
 * «Hola. Mido lo que tu sitio tarda en existir.» y no las cinco frases
 * pegadas una detrás de otra.
 *
 * `aria-hidden` arreglaría el lector de pantalla y no arreglaría nada
 * para un crawler. Ya se aprendió con el saludo.
 *
 * Coste: 0 KB de JavaScript. Sin timers, sin estado, sin hidratación.
 * ════════════════════════════════════════════════════════════════
 */

/**
 * La frase canónica: la que se pinta en el primer frame, la que queda si
 * no hay animaciones y la única que es texto real. Coincide con el
 * `<title>` y con el OG, a propósito.
 */
const HOME: Record<Locale, string> = {
  es: 'tarda en existir.',
  en: 'takes to exist.',
}

/**
 * Los cuatro cierres de paso. Cada uno tiene que cumplir tres cosas:
 * cerrar la frase con sentido, decir algo que este trabajo mida de
 * verdad, y no pasarse de largo — la celda mide lo que el más ancho, así
 * que uno desmedido empujaría el titular a una línea más en todos los
 * demás.
 */
const CYCLE: Record<Locale, readonly string[]> = {
  es: [
    'tarda en responder.',
    'le cuesta a Google.',
    'pierde cada mes.',
    'no te está contando.',
  ],
  en: [
    'takes to answer.',
    'costs you on Google.',
    'loses every month.',
    'is not telling you.',
  ],
}

export function Morph({ locale }: { locale: Locale }) {
  const home = HOME[locale]
  const cycle = CYCLE[locale]

  return (
    <span
      className="morph"
      /* `--n` es el número total de frases. Lo consume el `animation-delay`
         de globals.css para repartir las ventanas del ciclo sin escribir
         una tanda de keyframes por frase. */
      style={{ '--n': cycle.length + 1 } as React.CSSProperties}
    >
      {/* La que importa: texto real, visible desde el primer frame, y el
          estado al que vuelve el ciclo. */}
      <span data-home>{home}</span>

      {cycle.map((phrase, i) => (
        <span
          key={phrase}
          aria-hidden="true"
          data-w={phrase}
          style={{ '--i': i + 1 } as React.CSSProperties}
        />
      ))}
    </span>
  )
}
