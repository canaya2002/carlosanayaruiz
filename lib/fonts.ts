/**
 * ════════════════════════════════════════════════════════════════
 * LAS TRES CARAS, DECLARADAS UNA SOLA VEZ
 *
 * Archivo (display y cuerpo), Chivo Mono (toda cifra y etiqueta) y Fraunces
 * (la voz en primera persona, ~3% del tipo). Las tres son de foundry y
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
 * ── RECTA E ITÁLICA, PORQUE EL MARCADO PIDE LAS DOS ──
 * Aquí iba solo `style: ['italic']`, pero ~35 párrafos llevan `font-human`
 * SIN `italic` —el lead de cada héroe, entre ellos el de la portada, que es
 * el elemento LCP móvil—. Una familia sin cara recta no deja a ese texto en
 * Fraunces recta: lo deja en la reserva (Times New Roman) mientras carga y
 * después en la ITÁLICA, que el navegador toma prestada porque es la única
 * cara que hay. Medido con `CSS.getPlatformFontsForNode`: el lead pintaba
 * con la cara itálica. Era un accidente de la coincidencia de fuentes, no
 * una decisión, y el destello Times → itálica en el LCP lo hacía visible.
 * Lo que va en itálica a propósito lleva la clase `italic` y no cambia.
 *
 * ── `axes: ['opsz']`, Y POR ESO LA CARA RECTA NO CUESTA BYTES ──
 * Antes iban también SOFT y WONK, y ninguna regla del sitio los toca: no
 * hay un solo `font-variation-settings` con ellos. Sin el eje, Google fija
 * su valor por omisión, que es lo mismo que el navegador usaba con el eje
 * puesto y sin ajustar, así que la itálica no cambia de forma. Lo que sí
 * cambia es el archivo. woff2 `latin`, medidos en fonts.gstatic.com:
 *
 *   antes  itálica opsz+wght+SOFT+WONK ...... 149 512 B
 *   ahora  itálica opsz+wght ................  81 704 B
 *          recta   opsz+wght ................  67 388 B
 *          las dos ........................... 149 092 B  (−420 B)
 *
 * Una página que solo usa la recta baja 67 KB en vez de 149. `opsz` se
 * queda: con él la cara ajusta el contraste al tamaño real (los leads van a
 * 18–23 px) en lugar de dibujarse con el corte de titular.
 *
 * ── `preload: false`, Y ES LA MAYOR PALANCA DEL LCP MÓVIL ──
 * Era el woff2 más pesado de los tres (149 512 B con SOFT, WONK y opsz, más
 * que Archivo y Chivo Mono juntos) y pinta el ~3% del tipo, nunca el
 * titular. Precargado, se bajaba con prioridad alta ANTES del primer pintado
 * y competía por el ancho de banda con la hoja de estilos y con la cara del
 * `<h1>`. Medido con Lighthouse móvil en local, mediana de 3: ver el commit
 * «perf: quitar retraso de render del LCP móvil». Sin precarga se pide
 * cuando una regla la usa de verdad, y `swap` + `adjustFontFallback` pintan
 * mientras tanto la reserva con las métricas ajustadas.
 *
 * Con la cara recta se volvió a medir, y sigue sin precarga: el lead de la
 * portada —el LCP móvil— ahora espera 67 KB en vez de 149. Lighthouse móvil
 * local, mediana de 3, antes → después:
 *
 *   /es          simulado 4 585 → 4 262 ms · devtools 1 812 → 1 812 ms
 *   /es/sobre-mi simulado 4 058 → 3 605 ms · devtools 1 675 → 1 695 ms
 *   CLS 0.0004 y 0 sin cambio en las dos.
 */
export const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  preload: false,
  style: ['normal', 'italic'],
  axes: ['opsz'],
  adjustFontFallback: true,
})

/** Las tres variables juntas, para el `className` del `<html>`. */
export const FONT_VARS = `${archivo.variable} ${chivoMono.variable} ${fraunces.variable}`
