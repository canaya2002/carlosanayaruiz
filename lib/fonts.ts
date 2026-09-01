/**
 * ════════════════════════════════════════════════════════════════
 * LAS TRES CARAS, DECLARADAS UNA SOLA VEZ
 *
 * Archivo (display y cuerpo), Chivo Mono (toda cifra y etiqueta) y Fraunces
 * itálica (la voz en primera persona, ~3% del tipo). Las tres son de foundry y
 * gratuitas, y las tres se declaran AQUÍ y en ningún otro sitio.
 *
 * ── POR QUÉ ESTE ARCHIVO EXISTE ──
 * Estaban declaradas dos veces: en `app/[locale]/layout.tsx` y otra vez en
 * `app/not-found.tsx`, que es el único otro archivo que renderiza un documento
 * completo. `next/font/google` genera un módulo CSS por declaración, así que el
 * build producía DOS hojas de fuentes idénticas byte a byte (4 825 B cada una,
 * solo cambiaban los hashes de clase) — y la segunda se precargaba y se
 * descargaba en las 31 rutas y en los 100 artículos, no solo en un 404.
 *
 * Medido en el HTML servido antes del arreglo: `/es` traía un
 * `<link rel="preload" as="style">` a `693f4ebdb23357f8.css`, el módulo de
 * not-found. Con una sola declaración compartida, esa hoja desaparece.
 *
 * ── POR QUÉ `latin` Y NO `latin-ext` ──
 * Aquí iba `subsets: ['latin', 'latin-ext']` con un comentario que decía que
 * latin-ext era «obligatorio: el copy en español usa á é í ó ú ñ ¿ ¡». Esa
 * afirmación es FALSA: los ocho caracteres viven en U+00A1–U+00FA, o sea dentro
 * del subset `latin`. `latin-ext` cubre U+0100–024F y U+1E00–1EFF, que es
 * Europa del Este y vietnamita.
 *
 * Y el coste no era teórico. `<link rel="preload" as="font">` descarga sin
 * mirar `unicode-range`, así que los tres woff2 de latin-ext se bajaban
 * SIEMPRE: Archivo 85 856 B + Chivo Mono 22 944 B + Fraunces 130 100 B =
 * 238 900 B por carga, de 504 888 B de fuentes precargadas.
 *
 * Medido sobre las 7 rutas más pesadas del sitio servido: 31 codepoints
 * no-ASCII distintos, CERO dentro del rango de latin-ext. Los más usados son
 * ó é í á ú ñ ¿ · §, todos en `latin`.
 *
 * A/B en producción (Chrome, Slow 4G 1.6 Mbps / 150 ms, caché vacía):
 *
 *   /es/premios 1440 · LCP mediana de 5 ....... 2 776 ms → 2 412 ms
 *   /es móvil 390×844 · LCP mediana de 3 ...... 2 820 ms → 2 488 ms
 *   /es 1440 · mejor de 3 ..................... 1 868 ms → 1 108 ms
 *   FCP mediana ............................... 1 216 ms →   928 ms
 *   bytes por carga ........................... 869 443 → 630 543  (−27.5%)
 *
 * En /es/premios las cinco corridas estaban SOBRE el umbral de 2.5 s de Google
 * y pasan a cuatro de cinco por debajo. En un sitio cuyo producto son los Core
 * Web Vitals, eso no es una optimización: es el producto.
 *
 * ⚠ Si algún día el copy incorpora un idioma con diacríticos de Europa del
 * Este, se vuelve a añadir `latin-ext` — pero se comprueba antes con el
 * barrido de codepoints, no por intuición.
 * ════════════════════════════════════════════════════════════════
 */
import { Archivo, Chivo_Mono, Fraunces } from 'next/font/google'

/** Display y cuerpo. El eje `wdth` da la condensación industrial del masthead. */
export const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
  axes: ['wdth'],
  adjustFontFallback: true,
})

/** La voz de la máquina: toda cifra, unidad, graduación y etiqueta. */
export const chivoMono = Chivo_Mono({
  subsets: ['latin'],
  variable: '--font-chivo-mono',
  display: 'swap',
  weight: ['400', '500'],
  adjustFontFallback: true,
})

/**
 * La voz humana, y solo eso: frases en primera persona. Nunca navegación,
 * nunca datos, nunca un titular. Alrededor del 3% del tipo del sitio — la
 * oposición es el concepto, así que si crece deja de significar.
 *
 * Solo la itálica. Una serifa recta aquí competiría con el display; inclinada
 * se lee como algo escrito a mano al margen, que es el registro que se busca.
 */
export const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  style: ['italic'],
  axes: ['SOFT', 'WONK', 'opsz'],
  adjustFontFallback: true,
})

/** Las tres variables juntas, para el `className` del `<html>`. */
export const FONT_VARS = `${archivo.variable} ${chivoMono.variable} ${fraunces.variable}`
