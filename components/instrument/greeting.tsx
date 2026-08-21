import type { Locale } from '@/data/types'

/**
 * ════════════════════════════════════════════════════════════════
 * EL SALUDO — nueve palabras en una sola celda de grid
 *
 * Es lo único que el cliente recordaba de dennissnellenberg.com, y ahí
 * vive en una cortina que tapa la página hasta 3.5–4 s. Aquí NO.
 *
 * Aquí el saludo es la primera línea del `<h1>`. Se pinta en el primer
 * frame, desde el HTML del servidor, con la palabra del idioma de la ruta
 * ya visible — así el elemento LCP es el propio titular y no espera a que
 * termine ninguna secuencia. Las otras ocho pasan por encima durante
 * 990 ms y la primera vuelve.
 *
 * Coste: 0 KB de JavaScript. Sin timers, sin array en cliente, sin cookie.
 *
 * El recorrido no es decorativo: da la vuelta al mundo, pasa por náhuatl
 * —el idioma del Valle de México, con `lang="nah"` de verdad— y aterriza
 * en el idioma en el que estás leyendo.
 *
 * Accesibilidad: solo la palabra que se queda es texto real. Las ocho de
 * paso van `aria-hidden`, así que un lector de pantalla anuncia el h1 una
 * vez y bien, no nueve saludos seguidos.
 * ════════════════════════════════════════════════════════════════
 */

type Greeting = { readonly word: string; readonly lang: string }

/** La palabra que se pinta primero y a la que se vuelve. */
const HOME: Record<Locale, Greeting> = {
  es: { word: 'Hola', lang: 'es' },
  en: { word: 'Hello', lang: 'en' },
}

/**
 * Las ocho de paso, en orden. Náhuatl va al final del barrido, justo antes
 * de volver a casa: el gesto es «el mundo, luego aquí, luego tú».
 */
const SWEEP: Record<Locale, readonly Greeting[]> = {
  es: [
    { word: 'Hello', lang: 'en' },
    { word: 'Olá', lang: 'pt' },
    { word: 'Bonjour', lang: 'fr' },
    { word: 'Guten Tag', lang: 'de' },
    { word: 'Ciao', lang: 'it' },
    { word: 'こんにちは', lang: 'ja' },
    { word: '你好', lang: 'zh' },
    { word: 'Niltze', lang: 'nah' },
  ],
  en: [
    { word: 'Hola', lang: 'es' },
    { word: 'Olá', lang: 'pt' },
    { word: 'Bonjour', lang: 'fr' },
    { word: 'Guten Tag', lang: 'de' },
    { word: 'Ciao', lang: 'it' },
    { word: 'こんにちは', lang: 'ja' },
    { word: '你好', lang: 'zh' },
    { word: 'Niltze', lang: 'nah' },
  ],
}

export function Greeting({ locale }: { locale: Locale }) {
  const home = HOME[locale]
  const sweep = SWEEP[locale]

  return (
    <span className="greet">
      {/* La que importa: texto real, visible desde el primer frame, y el
          estado final al que vuelve la animación. */}
      <span data-home lang={home.lang}>
        {home.word}.
      </span>

      {/* Las ocho de paso NO son nodos de texto: viajan en `data-w` y las
          pinta CSS con `content: attr(data-w)`.

          No es un truco de estilo, es SEO. Como nodos de texto reales, el
          `<h1>` indexable quedaba «Hola. Hello. Olá. Bonjour. Guten Tag.
          Ciao. こんにちは. 你好. Niltze. Mido lo que tu sitio tarda en
          existir.» — nueve idiomas dentro del titular. `aria-hidden` lo
          arregla para un lector de pantalla y no arregla nada para un
          crawler. El contenido generado no entra en `innerText` ni se
          indexa, así que el h1 vuelve a ser una sola frase.

          El sitio de la referencia no tiene el problema porque sus saludos
          viven en una cortina aparte; los nuestros viven dentro del titular
          a propósito, para no retrasar el LCP, y esto es lo que paga esa
          decisión. */}
      {sweep.map((g, i) => (
        <span
          key={g.lang}
          lang={g.lang}
          aria-hidden="true"
          data-w={`${g.word}.`}
          style={{ '--i': i + 1 } as React.CSSProperties}
        />
      ))}
    </span>
  )
}
