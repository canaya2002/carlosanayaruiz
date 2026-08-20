/**
 * Regenerates every image asset in public/ at the size it is actually
 * served at. Run from the project root:  node <this file>
 *
 * Before: every asset was a 1000x1000 ~517KB PNG regardless of its role
 * (favicon.ico included), and the OG images were squares declared as
 * 1200x630. After: each file is exactly its target size, and OG images are
 * generated per-page by next/og instead of existing as static files.
 */
import sharp from 'sharp'
import { writeFile, readFile, unlink, access } from 'node:fs/promises'
import path from 'node:path'

const PUBLIC = path.resolve(process.cwd(), 'public')
const SOURCE = path.join(PUBLIC, 'carlos-anaya-ruiz-software.png')

// Brand tokens, kept in sync with app/globals.css.
const BRAND = '#1e3a8f' // oklch(0.475 0.155 258) -> sRGB
const ACCENT = '#c8791f' // oklch(0.585 0.135 55)
const PAPER = '#fbfaf8'

/**
 * The mark: three stacked bars of decreasing width inside a rounded square —
 * a ranked result list with position one highlighted in the accent colour.
 * Pure geometry, so it rasterises identically everywhere (no font
 * dependency) and stays legible down to 16px.
 */
function markSvg({ size = 512, padScale = 1, background = BRAND } = {}) {
  const s = size
  // Maskable icons must keep content inside a 80% safe zone.
  const inset = (s * (1 - padScale)) / 2
  const box = s * padScale
  const barX = inset + box * 0.215
  const barH = box * 0.085
  const radius = barH / 2
  const gap = box * 0.115
  const firstY = inset + box * 0.285
  const widths = [box * 0.57, box * 0.44, box * 0.3]
  const fills = [ACCENT, PAPER, PAPER]
  const opacities = [1, 0.92, 0.55]

  const bars = widths
    .map(
      (w, i) =>
        `<rect x="${barX.toFixed(2)}" y="${(firstY + i * (barH + gap)).toFixed(2)}" ` +
        `width="${w.toFixed(2)}" height="${barH.toFixed(2)}" rx="${radius.toFixed(2)}" ` +
        `fill="${fills[i]}" opacity="${opacities[i]}"/>`
    )
    .join('')

  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">` +
      `<rect width="${s}" height="${s}" rx="${(s * 0.2188).toFixed(2)}" fill="${background}"/>` +
      bars +
      `</svg>`
  )
}

/** Same mark, square-cornered and full-bleed, for the maskable variant. */
function maskableSvg(size = 512) {
  const s = size
  const barX = s * 0.29
  const barH = s * 0.068
  const gap = s * 0.092
  const firstY = s * 0.328
  const widths = [s * 0.456, s * 0.352, s * 0.24]
  const fills = [ACCENT, PAPER, PAPER]
  const opacities = [1, 0.92, 0.55]
  const bars = widths
    .map(
      (w, i) =>
        `<rect x="${barX.toFixed(2)}" y="${(firstY + i * (barH + gap)).toFixed(2)}" ` +
        `width="${w.toFixed(2)}" height="${barH.toFixed(2)}" rx="${(barH / 2).toFixed(2)}" ` +
        `fill="${fills[i]}" opacity="${opacities[i]}"/>`
    )
    .join('')
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">` +
      `<rect width="${s}" height="${s}" fill="${BRAND}"/>` +
      bars +
      `</svg>`
  )
}

/**
 * Assembles a multi-resolution .ico from PNG buffers.
 * sharp cannot write ICO, and every real favicon needs 16/32/48 so that
 * browser chrome, bookmarks and the Windows taskbar each get a crisp source.
 */
function buildIco(entries) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(entries.length, 4)

  const dir = Buffer.alloc(16 * entries.length)
  let offset = header.length + dir.length

  entries.forEach((entry, i) => {
    const at = i * 16
    dir.writeUInt8(entry.size >= 256 ? 0 : entry.size, at + 0)
    dir.writeUInt8(entry.size >= 256 ? 0 : entry.size, at + 1)
    dir.writeUInt8(0, at + 2) // palette size
    dir.writeUInt8(0, at + 3) // reserved
    dir.writeUInt16LE(1, at + 4) // colour planes
    dir.writeUInt16LE(32, at + 6) // bits per pixel
    dir.writeUInt32LE(entry.data.length, at + 8)
    dir.writeUInt32LE(offset, at + 12)
    offset += entry.data.length
  })

  return Buffer.concat([header, dir, ...entries.map((e) => e.data)])
}

const out = []
const kb = (b) => `${(b / 1024).toFixed(1)} KB`

async function emit(name, data) {
  await writeFile(path.join(PUBLIC, name), data)
  out.push([name, data.length])
}

async function main() {
  // ── Headshot ──────────────────────────────────────────────────────
  // The source has a rounded-corner mask baked in with transparent
  // corners. Cropping 58px off each edge lands inside the radius, giving
  // a clean square that can be displayed as a circle, square or panel
  // without transparent notches showing.
  const meta = await sharp(SOURCE).metadata()
  const inset = 58
  const cropped = sharp(SOURCE).extract({
    left: inset,
    top: inset,
    width: meta.width - inset * 2,
    height: meta.height - inset * 2,
  })

  // JPEG for the photo: no alpha needed, and mozjpeg beats PNG by ~20x
  // here. Next/Image derives the responsive AVIF/WebP variants from this.
  await emit(
    'carlos-anaya-ruiz.jpg',
    await cropped
      .clone()
      .resize(800, 800, { fit: 'cover', kernel: 'lanczos3' })
      .jpeg({ quality: 84, mozjpeg: true, chromaSubsampling: '4:4:4' })
      .toBuffer()
  )

  // A tiny inline-able version for the LCP placeholder.
  const blur = await cropped
    .clone()
    .resize(16, 16, { fit: 'cover' })
    .jpeg({ quality: 55 })
    .toBuffer()
  out.push(['(blurDataURL, inlined in code)', blur.length])
  await writeFile(
    path.join(process.cwd(), '.avatar-blur.txt'),
    `data:image/jpeg;base64,${blur.toString('base64')}`
  )

  // ── SVG master icon ───────────────────────────────────────────────
  await emit('icon.svg', markSvg({ size: 512 }))

  // ── PWA + Apple icons ─────────────────────────────────────────────
  const png = (svg, size) =>
    sharp(svg).resize(size, size).png({ compressionLevel: 9 }).toBuffer()

  await emit('icon-192.png', await png(markSvg({ size: 192 }), 192))
  await emit('icon-512.png', await png(markSvg({ size: 512 }), 512))
  await emit('icon-maskable-512.png', await png(maskableSvg(512), 512))
  // iOS ignores transparency and squares the corners itself, so the
  // apple-touch icon is drawn full-bleed with no rounding of our own.
  await emit(
    'apple-touch-icon.png',
    await sharp(
      Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">` +
          `<rect width="180" height="180" fill="${BRAND}"/></svg>`
      )
    )
      .composite([
        { input: await png(markSvg({ size: 180, background: 'none' }), 180) },
      ])
      .png({ compressionLevel: 9 })
      .toBuffer()
  )

  // ── favicon.ico (16 / 32 / 48) ────────────────────────────────────
  const icoSizes = [16, 32, 48]
  const icoEntries = []
  for (const size of icoSizes) {
    icoEntries.push({
      size,
      data: await png(markSvg({ size: size * 4 }), size),
    })
  }
  await emit('favicon.ico', buildIco(icoEntries))

  // ── Remove superseded assets ──────────────────────────────────────
  // The old square "1200x630" OG files are replaced by generated routes;
  // the old headshot name is replaced by the resized JPEG.
  const stale = [
    'og-default.png',
    'og-es.png',
    'og-en.png',
    'carlos-anaya-ruiz-software.png',
    'manifest.json',
  ]
  for (const name of stale) {
    const p = path.join(PUBLIC, name)
    try {
      await access(p)
      const size = (await readFile(p)).length
      await unlink(p)
      out.push([`REMOVED ${name}`, -size])
    } catch {
      /* already gone */
    }
  }

  const added = out.filter(([, n]) => n > 0).reduce((a, [, n]) => a + n, 0)
  const removed = -out.filter(([, n]) => n < 0).reduce((a, [, n]) => a + n, 0)

  console.log('\n  asset                                  size')
  console.log('  ' + '-'.repeat(52))
  for (const [name, size] of out) {
    console.log(`  ${name.padEnd(38)} ${size < 0 ? '-' + kb(-size) : kb(size)}`)
  }
  console.log('  ' + '-'.repeat(52))
  console.log(`  written: ${kb(added)}   removed: ${kb(removed)}`)
  console.log(`  net change: -${kb(removed - added)}\n`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
