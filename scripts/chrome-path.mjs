/**
 * Resuelve el binario de Chrome para las seis sondas que hablan CDP.
 *
 * Existe porque los scripts llevaban la ruta de Windows escrita a mano:
 *
 *   const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/...'
 *
 * y eso tiene DOS defectos, no uno.
 *
 * 1. La ruta es de una sola máquina. En macOS los seis chequeos —`check:perf`,
 *    `check:layout`, `check:nav`, `check:overflow`, `shoot`, `check:perf:all`—
 *    morían con `ENOENT: spawn C:/Program Files/...`, así que el loop de
 *    verificación del repo quedaba inservible sin tocar código. Un chequeo que
 *    solo corre en el portátil donde se escribió no es un chequeo.
 *
 * 2. **Es el bug del `??` que este repo ya documenta.** `??` solo cae al valor
 *    por omisión con `null` o `undefined`: un `CHROME_PATH=` declarado y vacío
 *    —en un `.env`, o añadido en un panel y dejado en blanco— llega como cadena
 *    vacía, que no es nullish, y entonces se intentaba spawnear `''`. Es la
 *    misma forma que rompió `CONTACT_TO` y por la que existe `lib/env.ts`. Aquí
 *    se trata el blanco como ausente, igual que allí.
 *
 * Y falla RUIDOSAMENTE con el listado de lo que buscó. Un `spawn ENOENT` a
 * treinta líneas de profundidad no dice qué instalar ni qué variable poner.
 */
import { existsSync } from 'node:fs'
import { platform } from 'node:process'

/**
 * Candidatos por plataforma, en orden de preferencia.
 *
 * Chrome estable primero: es el que mide el sitio como lo mide un visitante.
 * Los derivados de Chromium van al final porque sirven para no bloquear a
 * nadie, pero sus cifras no son las de referencia.
 */
const CANDIDATOS = {
  darwin: [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  ],
  win32: [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    (process.env.LOCALAPPDATA ?? '') + '/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  ],
  linux: [
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/snap/bin/chromium',
  ],
}

/**
 * Devuelve la ruta del binario, o lanza con el listado de lo que buscó.
 *
 * Se llama al arrancar cada sonda y no en el momento del spawn, a propósito: si
 * no hay navegador, el fallo tiene que salir antes de levantar un servidor o
 * abrir un puerto de depuración.
 */
export function resolveChrome() {
  // Blanco es ausente. No `??`: ver la cabecera de este archivo.
  const declarado = (process.env.CHROME_PATH ?? '').trim()

  if (declarado) {
    if (!existsSync(declarado)) {
      throw new Error(
        `CHROME_PATH apunta a algo que no existe:\n  ${declarado}\n\n` +
          'Corrige la variable o quítala para que se detecte el navegador solo.'
      )
    }
    return declarado
  }

  const candidatos = CANDIDATOS[platform] ?? CANDIDATOS.linux
  const encontrado = candidatos.find((ruta) => ruta && existsSync(ruta))

  if (encontrado) return encontrado

  throw new Error(
    `No encontré Chrome en ${platform}. Busqué, en este orden:\n` +
      candidatos.filter(Boolean).map((r) => `  · ${r}`).join('\n') +
      '\n\nInstala Google Chrome, o apunta la variable al binario que quieras usar:\n' +
      '  CHROME_PATH="/ruta/al/navegador" npm run check:perf http://localhost:PUERTO/es\n'
  )
}
