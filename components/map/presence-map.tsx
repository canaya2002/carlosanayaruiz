import { Link } from '@/i18n/navigation'
import {
  LAND_PATH,
  COUNTRY_PATHS,
  MAP_VIEWBOX,
} from '@/data/world-map.generated'
import {
  getCompanies,
  projectLatLon,
  countByCountry,
  type Company,
  type CountryCode,
} from '@/data/companies'
import { Locale } from '@/data/types'

/**
 * ════════════════════════════════════════════════════════════════
 * MAPA DE PRESENCIA
 *
 * ── POR QUÉ NO ES UN MAPA DE TILES ──
 * Google Maps o Mapbox habrían implicado una librería, una llave de API,
 * decenas de peticiones por vista, un dominio más en el CSP y un costo por
 * carga. El dueño reportó que el sitio se sentía lento justo antes de pedir
 * este mapa, así que sumarle todo eso habría sido responder a la petición
 * empeorando el problema que la motivó.
 *
 * La geografía es real: contornos de Natural Earth proyectados a SVG por
 * scripts/generate-worldmap.mjs. Se sirve con el HTML, funciona sin conexión y
 * se estiliza con los mismos tokens que el resto del sitio.
 *
 * ── POR QUÉ NO LLEVA JAVASCRIPT ──
 * Es un componente de servidor. Cada pin es un enlace de verdad a la página de
 * esa empresa, no un manejador de clic. Eso da tres cosas gratis:
 *
 *   · Google sigue los enlaces. Un mapa con estado en JS sería un agujero
 *     negro de enlaces internos justo en la página que más importa.
 *   · Funciona con teclado sin escribir nada: Tab entra a los enlaces,
 *     Enter navega.
 *   · No suma un solo byte al bundle. Los 77 KB de paths viven en el HTML
 *     estático de esta página, no en el JavaScript de todo el sitio.
 *
 * Las etiquetas al pasar el mouse son CSS (`group-hover` + `focus-within`).
 *
 * ── LOS DOS TIPOS DE MARCADOR, Y POR QUÉ ──
 * data/experience.ts solo registra "México" o "Estados Unidos" para los tres
 * empleos: sin ciudad. No inventé coordenadas para llenar el mapa, porque un
 * pin en una ciudad donde nunca trabajó es un dato falso de los que no se
 * notan. Así que:
 *
 *   · con `coords` → pin exacto sobre su ciudad
 *   · sin `coords` → cuenta dentro del país resaltado, sin pin inventado
 *
 * El país resaltado es clicable igual y lleva a la lista filtrada. En cuanto
 * se agregue la ciudad al archivo de datos, el pin aparece solo.
 * ════════════════════════════════════════════════════════════════
 */

interface Props {
  locale: Locale
}

/** Centro aproximado de cada país resaltado, para colgar su etiqueta. */
const COUNTRY_LABEL_AT: Record<CountryCode, readonly [number, number]> = {
  MEX: [23.6, -102.5],
  USA: [39.8, -98.6],
}

export function PresenceMap({ locale }: Props) {
  const en = locale === 'en'
  const companies = getCompanies(locale)
  const counts = countByCountry(locale)

  /** Solo las que tienen ciudad conocida se dibujan como pin. */
  const pinned = companies.filter(
    (c): c is Company & { coords: readonly [number, number] } =>
      Array.isArray(c.coords)
  )

  /** Las que solo tienen país, agrupadas para la leyenda. */
  const unpinned = companies.filter((c) => !c.coords)

  /**
   * `.glass-strong` y no `.glass` a secas: la leyenda de abajo lleva un
   * `text-ink-subtle` (la nota de los registros sin ciudad), y la regla medida
   * es que un panel que contenga tinta terciaria tiene que ser el cristal
   * fuerte — sobre `.glass` mide 4.30:1 y no pasa el piso de 4.5; sobre
   * `.glass-strong` mide 4.54 y sí.
   *
   * Se sube el PANEL en vez de subir el texto a `text-ink-muted` porque los
   * otros dos elementos de la leyenda ya son `muted`: igualarlos borraría la
   * jerarquía de tres niveles que distingue las dos etiquetas del mapa de la
   * nota sobre lo que falta.
   */
  return (
    <figure className="glass glass-strong glass-spec relative overflow-hidden p-3 sm:p-5">
      {/* Lavado detras del mapa. Sin esto el cristal es invisible: un panel
          translucido sobre un fondo casi blanco no tiene nada que difuminar,
          y los paises resaltados se pierden contra el oceano vacio. */}
      <div
        className="grad-soft pointer-events-none absolute inset-0 opacity-70"
        aria-hidden="true"
      />
      <div className="relative">
      <svg
        viewBox={`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`}
        className="block h-auto w-full"
        role="img"
        aria-labelledby="mapa-titulo mapa-desc"
      >
        <title id="mapa-titulo">
          {en
            ? 'World map showing where Carlos Anaya Ruiz has worked'
            : 'Mapa mundial de los lugares donde ha trabajado Carlos Anaya Ruiz'}
        </title>
        <desc id="mapa-desc">
          {en
            ? `Mexico with ${counts.MEX} entries and the United States with ${counts.USA}. The full list, with links, follows below the map.`
            : `México con ${counts.MEX} registros y Estados Unidos con ${counts.USA}. La lista completa, con enlaces, está debajo del mapa.`}
        </desc>

        <defs>
          {/* El gradiente decorativo, en SVG. No lleva texto encima, así que
              puede usar los stops vivos (el cian mide 1.8:1). */}
          <linearGradient id="mapa-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--brand)" />
            <stop offset="55%" stopColor="var(--sky)" />
            <stop offset="100%" stopColor="var(--cyan)" />
          </linearGradient>
        </defs>

        {/* Todo el contenido geografico va en un grupo para poder acercarlo
            en pantallas angostas sin servir un segundo SVG. */}
        <g className="map-focus">
        {/* Resto del mundo: un solo path, una sola capa. */}
        <path
          d={LAND_PATH}
          fill="var(--hairline)"
          stroke="var(--hairline-strong)"
          strokeWidth={0.4}
        />

        {/* Países con presencia. Son enlaces al ancla de la lista de abajo,
            así que el mapa aporta enlaces internos reales. */}
        {(Object.keys(COUNTRY_PATHS) as CountryCode[]).map((iso) => {
          const country = COUNTRY_PATHS[iso]
          const total = counts[iso] ?? 0
          if (!country || total === 0) return null

          const label = projectLatLon(COUNTRY_LABEL_AT[iso])

          return (
            <a
              key={iso}
              href={`#pais-${iso}`}
              className="group outline-none"
              aria-label={
                en
                  ? `${country.name}: ${total} ${total === 1 ? 'entry' : 'entries'}`
                  : `${country.name}: ${total} ${total === 1 ? 'registro' : 'registros'}`
              }
            >
              <path
                d={country.path}
                fill="url(#mapa-grad)"
                stroke="var(--brand-strong)"
                strokeWidth={0.6}
                opacity={0.62}
                className="transition-opacity duration-300 group-hover:opacity-95 group-focus-visible:opacity-95"
              />
              <text
                x={label.x}
                y={label.y}
                textAnchor="middle"
                className="pointer-events-none fill-white font-display"
                fontSize={22}
                fontWeight={700}
                stroke="var(--brand-strong)"
                strokeWidth={4}
                paintOrder="stroke"
                data-numeric=""
              >
                {total}
              </text>
            </a>
          )
        })}

        {/* Pines exactos: solo donde la ciudad se conoce. */}
        {pinned.map((company) => {
          const { x, y } = projectLatLon(company.coords)
          return (
            <Link
              key={company.slug}
              href={{ pathname: '/proyectos/[slug]', params: { slug: company.slug } }}
              className="group outline-none"
              aria-label={`${company.name} — ${company.city}`}
            >
              {/* Halo. `pointer-events: none` para que no agrande el objetivo
                  de clic más allá del punto visible. */}
              <circle
                cx={x}
                cy={y}
                r={9}
                fill="var(--sky)"
                opacity={0.22}
                /* `transform-box: fill-box` ancla el escalado al centro del
                   propio círculo; sin esto el origen sería el (0,0) del
                   viewBox y el halo se desplazaría al crecer. */
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                className="pointer-events-none transition-[opacity,transform] duration-300 group-hover:scale-125 group-hover:opacity-40"
              />
              {/* El punto. r=5 sobre un viewBox de 1000 escala a un objetivo
                  cómodo en cualquier ancho. */}
              <circle
                cx={x}
                cy={y}
                r={4.5}
                fill="var(--brand-strong)"
                stroke="var(--surface)"
                strokeWidth={1.8}
                /* Solo `fill`. Transicionar «todo» habría incluido la geometría
                   (`r`, `cx`, `cy`), que no se compone.
                   El nombre de esa utilidad prohibida NO se escribe aquí a
                   propósito: Tailwind v4 escanea el texto crudo de los
                   archivos, así que mencionarla —aunque sea en un comentario—
                   hacía que generara la clase de verdad en la hoja servida, y
                   quedaba disponible para que alguien la usara sin darse
                   cuenta. Verificado: la clase desapareció del CSS servido al
                   reescribir esta línea. */
                className="transition-[fill] duration-300 group-hover:fill-[var(--cyan-ink)]"
              />
              {/* Etiqueta al pasar el mouse o al enfocar con teclado. */}
              <text
                x={x + 9}
                y={y + 3}
                className="pointer-events-none fill-[var(--ink)] font-sans opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
                fontSize={14}
                fontWeight={600}
                stroke="var(--surface)"
                strokeWidth={3}
                paintOrder="stroke"
              >
                {company.name}
              </text>
            </Link>
          )
        })}
        </g>
      </svg>
      </div>

      {/* Leyenda. Es el contenido accesible de verdad: los registros sin
          ciudad conocida no tienen pin, así que si el mapa fuera lo único,
          no existirían para nadie. */}
      <figcaption className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-hairline pt-4 text-sm">
        <span className="inline-flex items-center gap-2 text-ink-muted">
          <span
            className="size-2.5 rounded-full bg-brand-strong ring-2 ring-white"
            aria-hidden="true"
          />
          {en ? 'Known city' : 'Ciudad conocida'}
        </span>
        <span className="inline-flex items-center gap-2 text-ink-muted">
          <span
            className="grad-deco size-2.5 rounded-[2px] opacity-70"
            aria-hidden="true"
          />
          {en ? 'Country with presence' : 'País con presencia'}
        </span>
        {unpinned.length > 0 && (
          <span className="text-ink-subtle">
            {en
              ? `${unpinned.length} without a recorded city — see note below`
              : `${unpinned.length} sin ciudad registrada — ver nota abajo`}
          </span>
        )}
      </figcaption>
    </figure>
  )
}
