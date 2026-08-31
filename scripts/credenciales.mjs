/**
 * Coloca y optimiza las imágenes de credenciales.
 *
 *   node scripts/credenciales.mjs
 *
 * ── POR QUÉ EXISTE ──
 * Llegaron once archivos con el nombre que les puso el teléfono
 * —`1770179849948.jpeg`— que no dice nada ni a una persona ni a un buscador. El
 * nombre de archivo es una de las pocas señales que un buscador tiene para
 * entender de qué es una imagen, y cuando alguien la descarga o la rehospeda el
 * nombre viaja con ella. Es la misma razón y la misma convención que
 * `scripts/blog-covers.mjs`: `{slug}-carlos-anaya-ruiz.webp`.
 *
 * Es idempotente: si el .webp de destino ya existe y es más nuevo que el
 * origen, no hace nada.
 */
import { existsSync, mkdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

const ORIGEN = '/Users/carlosanayaruiz/Downloads'
const DESTINO = 'public/credenciales'
const ANCHO_MAX = 1600
const CALIDAD = 82

/**
 * El emparejado se hizo LEYENDO cada imagen, no por el nombre del archivo: los
 * nombres son marcas de tiempo. Cada `slug` sale del título impreso en el
 * documento.
 */
const CREDENCIALES = [
  { archivo: '1770231837165.jpeg', slug: 'certificado-nasa-space-apps-galactic-problem-solver' },
  { archivo: '1770178655537.jpeg', slug: 'certificado-docker-devops' },
  { archivo: '1770178893224.png', slug: 'certificado-firebase-in-depth' },
  { archivo: '1770179096815.jpeg', slug: 'certificado-full-stack-web-development-bootcamp' },
  { archivo: '1770179179839.jpeg', slug: 'certificado-inteligencia-artificial-deep-learning-python' },
  { archivo: '1770179283983.png', slug: 'certificado-inteligencia-artificial-negocios-empresas' },
  { archivo: '1770179481919.jpeg', slug: 'certificado-javascript-total' },
  { archivo: '1770179608684.png', slug: 'certificado-master-react-hooks-mern-nodejs' },
  /* Next.js, PMP prep y SCRUM NO están aquí a propósito. Llegaron a 488×363 —
     demasiado pequeñas para mostrarse a más de ~240 px sin verse blandas— y con
     el número de folio ilegible, así que no dan ni imagen usable ni URL de
     verificación. El dueño confirmó que no tiene los originales, de modo que se
     quedan sin imagen y solo como texto en `docs/CREDENCIALES.md`. Si algún día
     los reexporta de Udemy, se añaden aquí y este script los procesa. */
]

if (!existsSync(DESTINO)) mkdirSync(DESTINO, { recursive: true })

let hechos = 0
let saltados = 0
let faltantes = 0
let bytesAntes = 0
let bytesDespues = 0

for (const { archivo, slug } of CREDENCIALES) {
  const origen = join(ORIGEN, archivo)
  const nombre = `${slug}-carlos-anaya-ruiz.webp`
  const destino = join(DESTINO, nombre)

  if (!existsSync(origen)) {
    console.log(`  ✗ falta el origen: ${archivo}`)
    faltantes++
    continue
  }

  const st = statSync(origen)

  if (existsSync(destino) && statSync(destino).mtimeMs > st.mtimeMs) {
    saltados++
    continue
  }

  const meta = await sharp(origen).metadata()
  const info = await sharp(origen)
    .resize({ width: Math.min(ANCHO_MAX, meta.width ?? ANCHO_MAX), withoutEnlargement: true })
    .webp({ quality: CALIDAD, effort: 6 })
    .toFile(destino)

  bytesAntes += st.size
  bytesDespues += info.size
  hechos++

  const kb = (n) => `${Math.round(n / 1024)} kB`
  console.log(
    `  ✓ ${nombre}  ${meta.width}×${meta.height} → ${info.width}×${info.height}  ${kb(st.size)} → ${kb(info.size)}`
  )
}

const mb = (n) => `${(n / 1024 / 1024).toFixed(2)} MB`
console.log('')
console.log(`  ${hechos} convertidas · ${saltados} sin cambios · ${faltantes} sin origen`)
if (hechos) {
  const ahorro = Math.round((1 - bytesDespues / bytesAntes) * 100)
  console.log(`  ${mb(bytesAntes)} → ${mb(bytesDespues)}  (${ahorro}% menos)`)
}
