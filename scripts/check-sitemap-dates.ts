/**
 * Un artículo con `publishedAt` en el pasado entra al sitemap; uno futuro no.
 * `now` se inyecta: no depende del reloj del proceso.
 *
 *   npx tsx scripts/check-sitemap-dates.ts
 */
import { buildSitemapEntries } from '../lib/sitemap'

const PLAN = 'https://www.carlosanayaruiz.com/es/blog/plan-de-respuesta-a-incidentes-plantilla'
const NEXT = 'https://www.carlosanayaruiz.com/es/blog/nextjs-app-router-guia-completa'
const INDEX = 'https://www.carlosanayaruiz.com/es/blog'

function urls(now: number) {
  return new Set(buildSitemapEntries(now).map((entry) => entry.url))
}

function lastmod(now: number, url: string) {
  const entry = buildSitemapEntries(now).find((item) => item.url === url)
  return entry?.lastModified
}

const beforeNov6 = Date.parse('2026-11-06T13:59:59Z')
const atNov6 = Date.parse('2026-11-06T14:00:00Z')
const beforeNov10 = Date.parse('2026-11-10T13:59:59Z')
const atNov10 = Date.parse('2026-11-10T14:00:00Z')

const early = urls(beforeNov6)
const on6 = urls(atNov6)
const before10 = urls(beforeNov10)
const on10 = urls(atNov10)

const failures: string[] = []

function expect(cond: boolean, message: string) {
  if (!cond) failures.push(message)
}

expect(!early.has(PLAN), 'antes del 6/11 no debe listar el plan de incidentes')
expect(!early.has(NEXT), 'antes del 6/11 no debe listar la guía de App Router')
expect(on6.has(PLAN), 'en el instante de publicación el plan entra')
expect(!on6.has(NEXT), 'el 6/11 la guía de App Router sigue en el futuro')
expect(before10.has(PLAN), 'el 10/11 por la mañana el plan sigue listado')
expect(!before10.has(NEXT), 'un minuto antes de las 14:00 UTC la guía no entra')
expect(on10.has(PLAN) && on10.has(NEXT), 'a las 14:00 UTC del 10/11 entran los dos')
expect(
  lastmod(atNov10, INDEX) === '2026-11-10',
  `lastmod del índice debe ser 2026-11-10, fue ${String(lastmod(atNov10, INDEX))}`
)
expect(
  lastmod(atNov6, INDEX) === '2026-11-06',
  `lastmod del índice el 6/11 debe ser 2026-11-06, fue ${String(lastmod(atNov6, INDEX))}`
)

const future = buildSitemapEntries(atNov10).filter((entry) => {
  const mod = entry.lastModified
  return (
    typeof mod === 'string' &&
    entry.url.includes('/es/blog/') &&
    entry.url !== INDEX &&
    mod > '2026-11-10'
  )
})
expect(future.length === 0, `hay ${future.length} artículos futuros en el sitemap`)

if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}

console.log(
  `sitemap ok: ${on10.size} urls a las 14:00 UTC del 10/11, índice ${String(lastmod(atNov10, INDEX))}`
)
