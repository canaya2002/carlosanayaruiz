import { MetadataRoute } from 'next'
import { SITE_CONFIG, PALETTE_HEX } from '@/lib/constants'

/**
 * Served at /manifest.webmanifest.
 *
 * Colores desde PALETTE_HEX, que es el espejo sRGB de los tokens en
 * app/globals.css. El manifiesto estático original declaraba #000000 como
 * theme_color, sin relación con la marca.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Carlos Anaya Ruiz — Consultor SEO Técnico & Desarrollo Web',
    short_name: 'Carlos Anaya Ruiz',
    description:
      'Consultor SEO técnico e ingeniero full-stack en Ciudad de México. Auditorías técnicas, datos estructurados, Core Web Vitals y desarrollo Next.js.',
    id: '/es',
    start_url: `/${SITE_CONFIG.defaultLocale}`,
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    // Splash background and installed-app chrome. Both are the page ground,
    // not the brand blue: theme_color paints the title bar of the installed
    // app, and it must match the `themeColor` viewport export in
    // app/[locale]/layout.tsx or the browser tab and the installed app get
    // different chrome. Values come from PALETTE_HEX so they cannot drift
    // from the CSS tokens — scripts/palette-check.mjs enforces it.
    background_color: PALETTE_HEX.light.ground,
    theme_color: PALETTE_HEX.light.ground,
    lang: SITE_CONFIG.defaultLocale,
    dir: 'ltr',
    categories: ['business', 'productivity', 'developer'],
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      // Separate maskable entry: Android crops to a shape, so this variant
      // keeps the mark inside the 80% safe zone instead of clipping it.
      {
        src: '/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
