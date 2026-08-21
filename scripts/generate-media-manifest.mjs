/**
 * Genera `docs/MEDIA.md` a partir de `data/media-slots.ts`.
 *
 * El documento que se le entrega al dueño sale del MISMO dato que dibuja los
 * huecos en la página, así que no puede contradecirla: si un hueco existe en
 * el sitio, está en la lista, y si se llena, desaparece de las dos.
 *
 *   npm run media:manifest
 */
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC = path.join(ROOT, 'data', 'media-slots.ts')
const OUT = path.join(ROOT, 'docs', 'MEDIA.md')

/**
 * El registro es TypeScript con `flatMap` dentro, así que no se puede parsear
 * con una expresión regular sin mentir. Se transpila lo mínimo —quitar tipos
 * e imports— y se evalúa, que es la única forma de que el manifiesto refleje
 * exactamente lo que el sitio renderiza, slots generados incluidos.
 */
const source = await readFile(SRC, 'utf8')

const js = source
  // fuera los bloques de tipos e interfaces
  .replace(/export type [\s\S]*?\n\n/g, '')
  .replace(/export interface MediaSlot \{[\s\S]*?\n\}\n/, '')
  // fuera las anotaciones de tipo que quedan en el arreglo
  .replace(/: readonly MediaSlot\[\]/g, '')
  .replace(/ as const\b/g, '')
  .replace(/\bas const\b/g, '')
  .replace(/: 'image' \| 'video' \| 'loop'/g, '')
  .replace(/kind: 'image' as const/g, "kind: 'image'")
  .replace(/priority: '(alta|media|baja)' as const/g, "priority: '$1'")
  // quedarse solo con la declaración del arreglo
  .match(/export const MEDIA_SLOTS =([\s\S]*?)\n\n\/\*\* Los slots de una/)

if (!js) {
  console.error('  No pude aislar MEDIA_SLOTS en data/media-slots.ts')
  process.exit(1)
}

let slots
try {
  slots = new Function(`return (${js[1].trim().replace(/;$/, '')})`)()
} catch (error) {
  console.error('  No pude evaluar el registro:', error.message)
  process.exit(1)
}

const pending = slots.filter((s) => !s.filled)
const done = slots.filter((s) => s.filled)

const rank = { alta: 0, media: 1, baja: 2 }
pending.sort((a, b) => rank[a.priority] - rank[b.priority])

const byPriority = (p) => pending.filter((s) => s.priority === p)

const section = (title, list) => {
  if (list.length === 0) return ''
  const rows = list
    .map(
      (s) =>
        `### ${s.what.split('.')[0]}\n\n` +
        `| | |\n|---|---|\n` +
        `| **Archivo** | \`public${s.path}\` |\n` +
        `| **Tipo** | ${s.kind === 'image' ? 'Imagen' : s.kind === 'video' ? 'Video' : 'Fondo animado (loop)'} |\n` +
        `| **Tamaño** | ${s.width} × ${s.height} px |\n` +
        `| **Página** | \`${s.page}\` |\n` +
        `| **Dónde** | ${s.where} |\n\n` +
        `${s.what}\n\n` +
        (s.notes ? `> ${s.notes}\n\n` : '')
    )
    .join('')
  return `## ${title}\n\n${rows}`
}

const out = `# Qué imágenes y videos faltan

> **Generado.** No lo edites a mano: sale de \`data/media-slots.ts\` con
> \`npm run media:manifest\`. Si editas aquí, el siguiente build lo sobrescribe.

**${pending.length} archivos pendientes** · ${done.length} ya puestos.

Cada hueco está marcado en la página con cruces de registro y la ruta exacta
escrita encima, así que también puedes ir navegando el sitio y verlos.

## Cómo mandarlos

1. Nombra cada archivo **exactamente** como dice la columna \`Archivo\`.
2. Ponlos en una carpeta con esa misma estructura y mándala comprimida, o
   súbelos directo al repo en \`public/\`.
3. No hace falta optimizarlos: Next los convierte a WebP y AVIF y genera los
   tamaños solo. Manda la mejor calidad que tengas.
4. Si un archivo no lo vas a conseguir, dilo y quito el hueco en vez de
   dejarlo marcado.

${section('Prioridad alta — la página se ve incompleta sin esto', byPriority('alta'))}${section('Prioridad media', byPriority('media'))}${section('Prioridad baja — cuando se pueda', byPriority('baja'))}
## Ya puestos

${
  done.length === 0
    ? 'Ninguno todavía.'
    : done
        .map((s) => `- \`public${s.path}\` — ${s.where}${s.notes ? ` · ${s.notes.split('.')[0]}.` : ''}`)
        .join('\n')
}
`

await writeFile(OUT, out, 'utf8')
console.log(
  `  docs/MEDIA.md generado · ${pending.length} pendientes, ${done.length} puestos`
)
