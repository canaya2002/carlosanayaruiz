/**
 * Genera `docs/IMAGENES.md`: el inventario de todos los huecos de imagen del
 * sitio, con la ruta exacta donde va cada archivo y su tamaño recomendado.
 *
 *   npm run images:manifest
 *
 * ── POR QUÉ SE GENERA Y NO SE ESCRIBE A MANO ──
 * Un documento escrito a mano que lista rutas de archivo se desincroniza del
 * código en la primera página nueva, y entonces es peor que no tenerlo: manda
 * a poner archivos donde ya nadie los lee. Este script ESCANEA el código
 * fuente buscando los `<ImageSlot>` reales, así que el documento no puede
 * mentir sobre dónde van las imágenes.
 *
 * También reporta cuáles ya están puestas, comprobando el archivo en /public.
 */
import { readFile, writeFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'

const ROOT = process.cwd()
const PUBLIC = path.join(ROOT, 'public')

/** Recorre un directorio devolviendo todos los .tsx. */
async function collectTsx(dir, acc = []) {
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return acc
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
      await collectTsx(full, acc)
    } else if (entry.name.endsWith('.tsx')) {
      acc.push(full)
    }
  }
  return acc
}

/**
 * Extrae los `<ImageSlot ... />` de un archivo.
 *
 * Se parsea con regex y no con un AST a propósito: es un generador de
 * documentación, no un compilador. Si un uso lleva props calculadas en vez de
 * literales, no se puede resolver estáticamente — y en ese caso se reporta como
 * dinámico en lugar de inventar una ruta.
 */
function extractSlots(source, file) {
  const slots = []
  const re = /<ImageSlot\b([\s\S]*?)\/>/g
  let m
  while ((m = re.exec(source))) {
    const body = m[1]
    const pick = (name) => {
      const lit = body.match(new RegExp(name + '=(?:"([^"]*)"|\\{`([^`]*)`\\})'))
      if (lit) return lit[1] ?? lit[2]
      const num = body.match(new RegExp(name + '=\\{(\\d+)\\}'))
      return num ? num[1] : null
    }

    const line = source.slice(0, m.index).split('\n').length
    slots.push({
      file: path.relative(ROOT, file).replace(/\\/g, '/'),
      line,
      slotPath: pick('path'),
      hint: pick('hint'),
      alt: pick('alt'),
      width: pick('width') ?? '1200',
      height: pick('height') ?? '750',
      dynamic: pick('path') === null,
    })
  }
  return slots
}

async function exists(relative) {
  try {
    await stat(path.join(PUBLIC, relative))
    return true
  } catch {
    return false
  }
}

const files = [
  ...(await collectTsx(path.join(ROOT, 'app'))),
  ...(await collectTsx(path.join(ROOT, 'components'))),
]

const slots = []
for (const file of files) {
  const source = await readFile(file, 'utf8')
  if (!source.includes('<ImageSlot')) continue
  slots.push(...extractSlots(source, file))
}

// Los huecos dinámicos (dentro de un .map sobre datos) se agrupan aparte: su
// ruta depende del dato, así que se documenta el patrón y no una ruta concreta.
const stat_ = { total: slots.length, filled: 0, empty: 0, dynamic: 0 }
const rows = []

for (const slot of slots) {
  if (slot.dynamic || !slot.slotPath || slot.slotPath.includes('${')) {
    stat_.dynamic++
    rows.push({ ...slot, state: 'patrón' })
    continue
  }
  const filled = await exists(slot.slotPath)
  if (filled) stat_.filled++
  else stat_.empty++
  rows.push({ ...slot, state: filled ? 'puesta' : 'vacía' })
}

rows.sort((a, b) => (a.slotPath ?? '').localeCompare(b.slotPath ?? ''))

const lines = []
const push = (...l) => lines.push(...l)

push(
  '# Inventario de imágenes',
  '',
  '> GENERADO — no editar a mano. Regenera con `npm run images:manifest`.',
  '',
  'Cada fila es un hueco de imagen real del sitio, encontrado escaneando los',
  '`<ImageSlot>` del código. La columna **ruta** es dónde va el archivo,',
  'contando desde la carpeta `public/`.',
  '',
  '## Resumen',
  '',
  `- Huecos totales: **${stat_.total}**`,
  `- Ya con imagen: **${stat_.filled}**`,
  `- Vacíos: **${stat_.empty}**`,
  `- Con ruta dinámica (una por cada dato): **${stat_.dynamic}**`,
  '',
  '## Cómo llenar uno',
  '',
  '1. Guarda el archivo en la ruta exacta de la tabla, dentro de `public/`.',
  '2. En `data/companies.ts`, agrega la ruta al array `shots` de esa entrada',
  '   (los huecos de proyecto se llenan desde ahí).',
  '3. Vuelve a desplegar. El patrón generado desaparece solo.',
  '',
  '## Las etiquetas que se ven en el sitio',
  '',
  'Mientras un hueco está vacío, el sitio dibuja un patrón de color y ENCIMA',
  'escribe la ruta del archivo que falta. Sirve para saber dónde pegar cada',
  'imagen sin abrir el código.',
  '',
  'Para apagar esas etiquetas cuando ya no las necesites:',
  '',
  '```bash',
  '# .env.local, o en las variables de entorno de Vercel',
  'NEXT_PUBLIC_SHOW_SLOTS=0',
  '```',
  '',
  'Con las etiquetas apagadas el hueco sigue dibujando el patrón, así que la',
  'página nunca se ve rota — solo deja de anunciar rutas a los visitantes.',
  '',
  '## Tabla',
  '',
  '| Estado | Ruta | Qué es | Tamaño | Dónde está |',
  '| --- | --- | --- | --- | --- |'
)

for (const row of rows) {
  const icon =
    row.state === 'puesta' ? '✅' : row.state === 'vacía' ? '⬜' : '🔁'
  const p = row.slotPath ? '`public' + row.slotPath + '`' : '_dinámica_'
  push(
    `| ${icon} ${row.state} | ${p} | ${row.hint ?? '—'} | ${row.width}×${row.height} | \`${row.file}:${row.line}\` |`
  )
}

if (rows.length === 0) {
  push('| — | _sin huecos declarados todavía_ | — | — | — |')
}

push(
  '',
  '## Tamaños recomendados',
  '',
  'No hace falta que sean exactos: `next/image` reescala y sirve AVIF/WebP.',
  'Lo que importa es que la proporción coincida, para que no se recorte nada',
  'que quieras mostrar.',
  '',
  '| Uso | Proporción | Ancho mínimo |',
  '| --- | --- | --- |',
  '| Captura de proyecto | 16:10 | 1200 px |',
  '| Portada de proyecto | 16:10 | 1200 px |',
  '| Certificado / diploma | 4:3 o A4 | 1000 px |',
  '| Premio / reconocimiento | 16:10 | 1200 px |',
  '| Retrato | 1:1 | 800 px |',
  '| Logo de empresa | libre, con fondo transparente | 400 px |',
  '',
  '## PDFs',
  '',
  'Van en `public/pdf/` y se declaran en el array `docs` de la entrada',
  'correspondiente en `data/companies.ts`:',
  '',
  '```ts',
  "docs: [{ label: 'Auditoría (PDF)', href: '/pdf/auditoria-cliente.pdf' }],",
  '```',
  ''
)

await writeFile(path.join(ROOT, 'docs', 'IMAGENES.md'), lines.join('\n'))

console.log('\n  docs/IMAGENES.md')
console.log(`    huecos: ${stat_.total}`)
console.log(`    puestas: ${stat_.filled}   vacías: ${stat_.empty}   dinámicas: ${stat_.dynamic}\n`)
