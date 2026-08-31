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
   * ── MIGRADO A «PAPEL AHUMADO» ──
   *
   * Este componente era el ÚLTIMO rincón del sistema anterior, y el único sitio
   * donde sobrevivía una caja de cuatro lados: `.glass .glass-strong
   * .glass-spec` trae `border-radius: var(--radius-2xl)` y `border: 1px solid`,
   * o sea exactamente lo que la regla cero de este proyecto prohíbe y lo que
   * CLAUDE.md declara inexistente («no queda un borde de cuatro lados en el
   * sitio»). Llevaba además un lavado `grad-soft` que existía solo para que el
   * cristal se viera, y dos blancos puros —`ring-white` en la leyenda y
   * `fill-white` en las cifras— que NO pasan por el puente de tokens porque son
   * utilidades de Tailwind, no variables.
   *
   * Lo que queda es el mapa como PLACA IMPRESA, que es lo que este sistema hace
   * con un dato: el océano es hollín, la tierra es humo, y los países con
   * presencia son el TRAZO —papel— con su cifra en tinta de hollín encima. Esa
   * inversión ya está medida en `palette:check`: hollín sobre placa de papel da
   * 15.24:1.
   *
   * Sin panel, sin radio, sin sombra y sin lavado. La única regla es la de
   * arriba, que es el vocabulario de `.band`.
   *
   * La geografía NO cambió: sigue siendo Natural Earth proyectado por
   * `scripts/generate-worldmap.mjs`, servida en el HTML, sin JavaScript y con
   * cada pin como enlace real.
   */
  return (
    <figure className="relative m-0 border-t border-hairline pt-6">
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
          {/* El país con presencia se pinta como PAPEL, y el degradado lateral
              es el mismo recurso con el que `.drum` y `.plate` se leen como
              cilindro: más claro donde la luz da y más apagado en el canto. No
              es decorativo — es lo que hace que el trazo parezca una hoja
              enrollada y no un relleno plano.

              Antes iba de `--brand` a `--sky` a `--cyan`. Los tres están
              puenteados a papel y ceniza, así que no había azules; pero tres
              paradas para dos tonos es el resto de una paleta que ya no
              existe. */}
          <linearGradient id="mapa-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--paper)" />
            <stop offset="100%" stopColor="var(--ash)" />
          </linearGradient>
        </defs>

        {/* Todo el contenido geografico va en un grupo para poder acercarlo
            en pantallas angostas sin servir un segundo SVG. */}
        <g className="map-focus">
        {/* El océano es el hollín del fondo y la tierra sin presencia es el
            humo — el ÚNICO escalón de superficie que este sistema tiene.

            El CONTORNO va en ceniza, y eso es lo que hace legible el mapa. Con
            el relleno en humo (#23201c) sobre hollín (#12100e) la diferencia es
            de un punto y medio de luminancia: los continentes se adivinaban
            pero no se leían, y un mapa que no se lee no informa. Antes el trazo
            iba en `--hairline-strong` (#3d3830), que es casi el mismo tono.

            La ceniza al 40% da el contorno sin convertir la tierra en una masa
            clara que compita con los países resaltados. Es exactamente lo que
            el material dice que es: «raspado parcial». Línea, no mancha — que
            además es cómo se imprime una carta geográfica de verdad. */}
        <path
          d={LAND_PATH}
          fill="var(--smoke)"
          stroke="var(--ash)"
          strokeOpacity={0.4}
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
                stroke="var(--paper)"
                strokeWidth={0.6}
                opacity={0.62}
                className="transition-opacity duration-300 group-hover:opacity-95 group-focus-visible:opacity-95"
              />
              <text
                x={label.x}
                y={label.y}
                textAnchor="middle"
                /* Hollín sobre el relleno de papel del país: la misma
                   inversión que la placa, medida en 15.24:1. Antes era
                   `fill-white` —blanco puro, que este sistema no tiene— con un
                   trazo de `--brand-strong`, un séptimo tono claro que no está
                   entre los seis materiales. */
                className="pointer-events-none fill-[var(--soot)] font-display"
                fontSize={22}
                fontWeight={700}
                stroke="var(--paper)"
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
                fill="var(--ash)"
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
                fill="var(--paper)"
                stroke="var(--soot)"
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
                /* Sin transición de `fill`, y es un arreglo: iba a
                   `--cyan-ink`, que está puenteado a `--ink-muted` (#b3aea0).
                   El punto en reposo es PAPEL (#ebe6d9), así que al pasar el
                   puntero se APAGABA — el hover iba al revés. La respuesta la
                   da el halo, que crece y sube de opacidad, más la etiqueta con
                   el nombre que aparece al lado. El punto no necesita cambiar:
                   ya es el tono más claro que este sistema tiene. */
              />
              {/* Etiqueta al pasar el mouse o al enfocar con teclado. */}
              <text
                x={x + 9}
                y={y + 3}
                className="pointer-events-none fill-[var(--ink)] font-sans opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
                fontSize={14}
                fontWeight={600}
                stroke="var(--soot)"
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
            className="size-2.5 rounded-full bg-[var(--paper)]"
            aria-hidden="true"
          />
          {en ? 'Known city' : 'Ciudad conocida'}
        </span>
        <span className="inline-flex items-center gap-2 text-ink-muted">
          <span
            className="size-2.5 bg-[var(--paper)] opacity-60"
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
