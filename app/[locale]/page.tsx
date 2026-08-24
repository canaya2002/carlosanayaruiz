import type { Metadata } from 'next'
import Image from 'next/image'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Greeting } from '@/components/instrument/greeting'
import { Morph } from '@/components/instrument/morph'
import { Dial } from '@/components/instrument/dial'
import { Rail } from '@/components/instrument/rail'
import { Marks } from '@/components/instrument/marks'
import { Ribbon } from '@/components/instrument/ribbon'
import { BlogStrip } from '@/components/sections/blog-strip'
import { MediaSlot } from '@/components/instrument/media-slot'
import { getServices, servicePath } from '@/data/services'
import { getSkillCategories } from '@/data/skills'
import { getExperiences, type Experience } from '@/data/experience'
import { getSiteFaq } from '@/data/faq'
import { getEducation } from '@/data/education'
import { SEO_IMAGES, NAP } from '@/lib/constants'
import { generatePageMetadata } from '@/lib/seo'
import { generateHomeGraph } from '@/lib/schema'
import { Locale } from '@/data/types'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const en = locale === 'en'

  return generatePageMetadata({
    locale: locale as Locale,
    route: 'home',
    absoluteTitle: true,
    title: en
      ? 'Carlos Anaya Ruiz — Technical SEO Consultant'
      : 'Carlos Anaya Ruiz — Consultor SEO Técnico en CDMX',
    description: en
      ? 'Technical SEO consultant and Next.js engineer in Mexico City. Audits, Core Web Vitals, structured data and migrations that do not lose organic traffic.'
      : 'Consultor SEO técnico e ingeniero Next.js en Ciudad de México. Auditorías, Core Web Vitals, datos estructurados y migraciones que no tiran el tráfico orgánico.',
  })
}

/* ════════════════════════════════════════════════════════════════
   EL REGISTRO — utilidades de eje

   La trayectoria no es una rejilla de tarjetas: es un registro con eje
   real. Cada banda tiene el DESPLAZAMIENTO y la LONGITUD que le tocan por
   sus fechas verdaderas, así que los huecos entre trabajos aparecen solos.
   Un hueco no se rellena ni se disimula: es un dato, y en un instrumento
   los datos se muestran.
   ════════════════════════════════════════════════════════════════ */

/** `YearMonth` («2023-11») a meses absolutos, para poder restar. */
function toMonths(ym: string): number {
  const [y, m] = ym.split('-').map(Number)
  return y * 12 + (m - 1)
}

function monthsBetween(from: string, to: string): number {
  return Math.max(1, toMonths(to) - toMonths(from))
}

/** El mes en curso, para cerrar los periodos que siguen abiertos. */
function currentYearMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

interface Track {
  experience: Experience
  /** % desde el origen del eje */
  left: number
  /** % del ancho total del eje */
  width: number
  months: number
}

function buildTracks(experiences: Experience[]) {
  const today = currentYearMonth()
  const closed = experiences.map((e) => ({
    experience: e,
    start: e.startDate,
    end: e.endDate ?? today,
  }))

  const min = Math.min(...closed.map((c) => toMonths(c.start)))
  const max = Math.max(...closed.map((c) => toMonths(c.end)))
  const span = Math.max(1, max - min)

  const tracks: Track[] = closed
    .map((c) => ({
      experience: c.experience,
      left: ((toMonths(c.start) - min) / span) * 100,
      width: ((toMonths(c.end) - toMonths(c.start)) / span) * 100,
      months: monthsBetween(c.start, c.end),
    }))
    .sort((a, b) => a.left - b.left)

  const firstYear = Math.floor(min / 12)
  const lastYear = Math.floor(max / 12)
  const years = Array.from(
    { length: lastYear - firstYear + 1 },
    (_, i) => firstYear + i
  ).map((year) => ({
    year,
    left: ((year * 12 - min) / span) * 100,
  }))

  return { tracks, years, span }
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('hero')
  const ts = await getTranslations('services')
  const tr = await getTranslations('trayectoria')
  const tc = await getTranslations('homeCta')
  const tab = await getTranslations('about')

  const lc = locale as Locale
  const en = lc === 'en'
  const services = getServices(lc)
  const experiences = getExperiences(lc)
  const faq = getSiteFaq(lc)
  /* La placa de datos del operador NO inventa nada: cada renglón sale de un
     archivo de datos o de NAP. Si un dato no está en el repo, no aparece. */
  const education = getEducation(lc)
  /* El índice se reparte en dos columnas. El corte se calcula aquí y no en el
     JSX porque el ORDEN DEL DOM tiene que quedar 1-2-3-4-5-6: un lector de
     pantalla recorre la primera columna entera y después la segunda, así que
     partir la lista es correcto; repartir alternando no lo sería. */
  const faqCut = Math.ceil(faq.length / 2)
  const faqColumns = [faq.slice(0, faqCut), faq.slice(faqCut)]
  const { tracks, years } = buildTracks(experiences)

  /**
   * El stack, aplanado a una sola tira. No va agrupado por categoría ni
   * puesto en una rejilla de badges: es una cinta que corre, así que el
   * orden importa menos que el movimiento. Los 56 nombres completos viven
   * en /sobre-mi, que es donde alguien los va a leer de verdad.
   */
  const stack = getSkillCategories(lc).flatMap((c) => c.skills)

  /** a–e: canales paralelos de un registrador multipluma, no pasos 01/02/03. */
  const channelId = (i: number) => String.fromCharCode(97 + i)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateHomeGraph(lc)),
        }}
      />

      <div
        className="grid"
        style={{ gridTemplateColumns: 'var(--tape-w) minmax(0,1fr)' }}
      >
        <Rail />

        <div className="min-w-0">
          {/* ═══ HÉROE ═══════════════════════════════════════════
              El saludo es la primera línea del h1 y se pinta desde el
              servidor, así que el LCP es el titular y no espera a que
              termine ninguna secuencia de entrada. */}
          {/* ── LA COMPOSICIÓN, Y POR QUÉ ES ASÍ ──
              El titular manda a todo lo ancho —es el masthead, su escala ES
              el argumento— y debajo se abre el par de columnas. Constreñirlo
              a la mitad para dejarle sitio al retrato lo partía en cinco
              líneas y le quitaba lo único que tiene.

              Así que el retrato va en la banda de abajo, a la derecha, y
              sangra hasta el canto de la pantalla. Es un recorte con canal
              alfa, así que no hay caja: se compone sobre el hollín y la
              retícula del tambor se ve por detrás de él. Por abajo se
              disuelve con una máscara — no lo corta ningún borde.

              `overflow-hidden` es obligatorio: el sangrado sale de un margen
              negativo y sin recorte se escaparía al documento. Lo verifica
              `check:overflow`. */}
          <section className="relative flex flex-col overflow-hidden px-5 pt-16 pb-16 sm:px-10 lg:pb-28">
            <h1 className="max-w-[20ch] text-hero text-ink">
              <Greeting locale={lc} />{' '}
              {/* El espacio entre los dos `span` de bloque es deliberado: sin
                  él `textContent` concatena «sitiotarda». `innerText` lo
                  resuelve solo, pero no todo lo que lee un documento pasa
                  por el motor de layout. */}
              <span className="block">
                {en ? 'I measure what your site' : 'Mido lo que tu sitio'}
              </span>{' '}
              {/* El cierre MUTA: cinco frases que cierran la misma oración y
                  cada una dice algo que este trabajo mide de verdad. Viven en
                  una sola celda de grid, así que el titular no refluye —cero
                  CLS— y solo la canónica es texto indexable. Ver
                  components/instrument/morph.tsx. */}
              <span className="block">
                <Morph locale={lc} />
              </span>
            </h1>

            {/* La columna del retrato crece en TRES saltos y no en uno: a
                1024 exactos, un retrato de 36rem dejaría la columna de texto
                en 240 px y la pista de la lectura se comprimiría a nada.
                24rem hasta 1280, 36 hasta 1536, 40 de ahí en adelante. */}
            <div className="mt-12 grid gap-x-12 gap-y-12 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] xl:grid-cols-[minmax(0,1fr)_minmax(0,38rem)] 2xl:grid-cols-[minmax(0,1fr)_minmax(0,44rem)]">
              {/* `.hero-in` escalona la entrada AL CARGAR y no al scroll: lo
                  que está en la primera pantalla ya pasó su rango de
                  `view()` antes de que nadie toque la rueda. El `<h1>` queda
                  fuera a propósito — es el candidato a LCP. */}
              <div className="hero-in flex flex-col">
                <p className="max-w-[46ch] font-human text-lead text-ink-muted">
                  {t('lead')}
                </p>

                <p className="mt-9 flex flex-wrap gap-x-8 gap-y-3">
                  <Link className="link-stylus" href="/contacto">
                    {en ? 'ask for a reading' : 'pedir una lectura'} →
                  </Link>
                  <Link className="link-stylus" href="/servicios">
                    {en ? 'see the record' : 'ver el registro'} →
                  </Link>
                </p>

                {/* La medición de esta visita. Es el signature del sitio y
                    vive solo aquí: en cada página sería decoración. */}
                <div className="mt-11">
                  <Marks
                    label={
                      en ? 'reading · this visit' : 'lectura · esta visita'
                    }
                    live={en ? 'live' : 'en vivo'}
                    note={
                      en
                        ? "the rule is Google's threshold. what is left of it is headroom."
                        : 'la regla es el umbral de Google. lo que sobra es margen.'
                    }
                  />
                </div>

                <p className="stamp mt-auto pt-9">{t('locationNote')}</p>
              </div>

              {/* EL RETRATO. `priority` no es opcional: a este tamaño puede
                  ganarle el LCP al titular, y un candidato a LCP que no está
                  precargado es exactamente la regresión que este sitio vende
                  arreglar. Con la precarga entra como AVIF de ~40 KB.

                  El sangrado negativo lo lleva hasta el canto derecho de la
                  pantalla; abajo cancela el `pb-16` de la sección para que
                  toque el borde y se disuelva ahí. */}
              {/* ── POR QUÉ SUBE, Y CUÁNTO ──
                  Con `align-self: stretch` la caja de MARGEN se ajusta a la
                  fila, así que un margen negativo hace la caja de borde más
                  alta SIN cambiar el alto de la fila: por abajo 112 px, por
                  arriba 96 (160 desde 1536, donde ya hay holgura). El retrato
                  crece y sube sin abrir un hueco en la columna de texto.

                  Medido antes de decidirlo: la celda del morph llega a x=1093
                  a 1440 y el retrato arranca en x=792, así que el titular
                  CRUZA la franja que el retrato gana por arriba. Por eso la
                  máscara de `.figure-hero` difumina su canto superior — el
                  texto pasa por encima de píxeles ya desvanecidos y no por
                  encima de su pelo. Solo a partir de 1920 hay holgura real. */}
              <figure className="figure-hero m-0 -mr-5 sm:-mr-10 lg:-mb-28 lg:-mt-24 2xl:-mt-40">
                <Image
                  src={SEO_IMAGES.portrait}
                  alt={SEO_IMAGES.avatarAlt[lc]}
                  width={SEO_IMAGES.portraitWidth}
                  height={SEO_IMAGES.portraitHeight}
                  sizes="(min-width: 1536px) 44rem, (min-width: 1280px) 38rem, (min-width: 1024px) 26rem, 100vw"
                  priority
                />
                {/* La aguja escribiéndolo: una línea de papel que baja una
                    sola vez al cargar. El gesto del sitio, sobre la foto. */}
                <span className="figure-scan" aria-hidden="true" />
              </figure>
            </div>
          </section>

          {/* ═══ EL REGISTRO ═════════════════════════════════════
              Cambio de escala: aquí el eje ya no mide segundos, mide
              años. El cambio se anuncia; no se disimula. */}
          <section className="border-t border-hairline px-5 py-20 sm:px-10">
            <p className="stamp">
              {en
                ? 'scale change · 1 s ───▸ 1 year'
                : 'cambio de escala · 1 s ───▸ 1 año'}
            </p>
            <h2 className="mt-5 max-w-[16ch] text-d1 text-ink">
              {tr('title')}
            </h2>

            <div className="relative mt-14">
              {/* Eje de años, impreso detrás del registro. */}
              <div
                className="pointer-events-none absolute inset-0"
                aria-hidden="true"
              >
                {years.map((y) => {
                  /* El último año cae en el 100% del eje, así que su etiqueta
                     anclada a la izquierda se salía 33 px del viewport a
                     360 px — lo detectó `check:overflow`. A partir del 90%
                     la etiqueta se voltea y se dibuja hacia dentro. */
                  const flip = y.left > 90
                  return (
                    <span
                      key={y.year}
                      className="absolute top-0 bottom-0 border-l border-hairline"
                      style={{ left: `${y.left}%` }}
                    >
                      <span
                        className={`stamp axis-year ${flip ? 'right-1.5' : 'left-1.5'}`}
                      >
                        {y.year}
                      </span>
                    </span>
                  )
                })}
              </div>

              <ol className="reveal-stagger relative space-y-1">
                {tracks.map((track) => (
                  <li key={track.experience.id} className="band">
                    {/* Nombre y puesto van juntos y a la izquierda: con
                        `justify-between` sobre un contenedor ancho la etiqueta
                        quedaba desterrada al borde y dejaba de leerse como
                        parte de la misma fila. */}
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="text-d3 text-ink">
                        {track.experience.company}
                      </span>
                      <span className="stamp">
                        {track.experience.position} ·{' '}
                        <span className="tabular-nums">
                          {track.months} {en ? 'mo' : 'm'}
                        </span>
                      </span>
                    </div>
                    {/* La barra lleva el desplazamiento y el largo REALES. */}
                    <span
                      className="mt-3 block"
                      style={{
                        marginLeft: `${track.left}%`,
                        width: `${track.width}%`,
                      }}
                    >
                      <span className="band-fill" />
                    </span>
                  </li>
                ))}
              </ol>

              <p className="gap mt-6 pt-3 font-mono text-[0.6875rem] tracking-[0.09em]">
                {en
                  ? 'gaps between bands are real and are not filled in.'
                  : 'los huecos entre bandas son reales y no se rellenan.'}
              </p>

              {/* EL hueco más importante del sitio. Si de toda la lista de
                  docs/MEDIA.md solo llega un archivo, que sea este: una curva
                  real con su eje de tiempo es la prueba de todo lo demás que
                  dice esta página. */}
              <div className="mt-14 max-w-[54rem]">
                <MediaSlot
                  id="home-evidencia"
                  sizes="(min-width: 1024px) 54rem, 100vw"
                />
              </div>
            </div>
          </section>

          {/* ═══ LA CINTA DEL STACK ══════════════════════════════
              Dos carriles en direcciones opuestas. El cruce es lo que da la
              sensación de profundidad —dos planos moviéndose distinto— sin
              una sola sombra y sin una sola caja. */}
          <section
            className="overflow-hidden border-t border-hairline py-10"
            aria-labelledby="stack-heading"
          >
            <h2 id="stack-heading" className="sr-only">
              {en ? 'Stack and tools' : 'Stack y herramientas'}
            </h2>
            <Ribbon
              items={stack}
              label={en ? 'Stack and tools' : 'Stack y herramientas'}
            />
            <div className="mt-3">
              <Ribbon
                items={stack}
                label={en ? 'Stack, second rail' : 'Stack, segundo carril'}
                reverse
              />
            </div>
          </section>

          {/* ═══ CANALES ═════════════════════════════════════════
              La placa despejada: el material se invierte entero. Es la
              sección que la aguja limpió. */}
          {/* `relative` + `overflow-hidden` son para la cara del tambor: se
              sangra 5rem fuera del canto derecho y sin recorte se escaparía al
              documento. Lo verifica `check:overflow`. */}
          <section className="plate relative px-5 py-20 sm:px-10">
            {/* Sin `style` inline: `.plate .stamp` ya lleva la tinta medida
                para superficie clara. Ver --ink-plate en globals.css. */}
            {/* El rótulo sale de los DATOS. Decía «a–e» con cuatro canales:
                un instrumento que rotula cinco plumas y dibuja cuatro está
                mintiendo, y es el tipo de mentira que nadie revisa. */}
            <p className="stamp">
              {en
                ? `channels a–${channelId(services.length - 1)} · parallel`
                : `canales a–${channelId(services.length - 1)} · paralelos`}
            </p>
            <h2 className="mt-5 max-w-[18ch] text-d1">{ts('title')}</h2>

            {/* ── EL DIAL, EN SU PROPIA CELDA ──
                Antes iba en `position: absolute` con un sangrado negativo de
                5rem, y de ahí salían los cuatro defectos que se reportaron:
                se cortaba, quedaba descentrado, no cabía nada dentro y por
                debajo de 80rem estaba en `display: none`.

                Ahora es una celda de rejilla con `place-items: center`, así
                que el centrado lo hace el motor. A partir de 80rem va al lado
                de la lista; por debajo, DEBAJO de ella y más chico. Se ve
                siempre. */}
            <div className="mt-12 grid gap-x-14 gap-y-16 xl:grid-cols-[minmax(0,54rem)_minmax(14rem,1fr)] xl:items-center">
            <ul>
              {services.map((service, i) => (
                <li key={service.id}>
                  <Link
                    href={servicePath(service, lc) as never}
                    className="channel group"
                    /* Lo que el dial lee con `:has()` para saber qué anillo
                       encender. No es decorativo: es el único enlace entre la
                       fila y el disco, y no cuesta un byte de JavaScript. */
                    data-ch={channelId(i)}
                  >
                    <span className="channel-id">ch {channelId(i)}</span>
                    <span>
                      <span className="text-d3">{service.title}</span>
                      <span className="channel-note mt-1 block max-w-[52ch] text-sm">
                        {service.description}
                      </span>
                      {/* La pluma: al pasar el puntero, una línea se escribe
                          de izquierda a derecha bajo la fila. No hay caja que
                          se encienda ni tarjeta que se eleve — avanza el
                          trazo, que es lo que hace un registrador. */}
                      <span className="channel-pen mt-3" aria-hidden="true" />
                    </span>
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-150 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

              {/* EL DIAL. La cara del tambor, en SVG en línea: 72 marcas de
                  bisel, un arco por canal con su etiqueta, retícula polar y el
                  husillo. Dos velocidades —barrido 7 s, bisel 44 s al revés— y
                  responde a la lista con `:has()`. Cero JavaScript.
                  Ver components/instrument/dial.tsx. */}
              <Dial
                channels={services.map((service, i) => ({
                  id: service.id,
                  ch: channelId(i),
                }))}
                idle={`a–${channelId(services.length - 1)}`}
              />
            </div>
          </section>

          {/* ═══ EL OPERADOR ═════════════════════════════════════ */}
          <section className="border-t border-hairline px-5 py-20 sm:px-10">
            <p className="stamp">{en ? 'the operator' : 'el operador'}</p>

            {/* ── QUÉ CAMBIÓ Y POR QUÉ ──
                La frase es lo más fuerte que dice el sitio y estaba metida en
                una columna de 30ch a tamaño d2, con el párrafo al lado y
                media hoja en negro a la derecha. Se leía vacía porque LO
                ESTABA: tres columnas de las que dos llevaban una sola cosa.

                Ahora la frase abre la sección a todo el ancho y a escala de
                titular —es una declaración, no una nota al margen— y debajo
                van tres columnas con trabajo real: el retrato en media tinta,
                el cuerpo, y la PLACA DE DATOS.

                La placa es la etiqueta grabada de un instrumento: rótulo mono
                y valor, una regla por renglón. No es una rejilla de
                estadísticas —no hay cifra grande ni icono— y todo lo que dice
                sale de `data/` o de NAP. Si un dato no está en el repo, no
                aparece. */}
            {/* La frase anterior —«no vendo posiciones, vendo que el número
                baje»— prometía un resultado y sonaba a vendedor. Esta dice de
                dónde sale el trabajo: el sitio ya está registrando lo que le
                pasa, y lo que se contrata es a alguien que sepa leer el
                registro. Es la tesis del sitio en una línea, y es lo único de
                la página en primera persona a escala de titular. */}
            <blockquote className="m-0 mt-8 max-w-[30ch] font-human text-d1 italic text-ink">
              {en
                ? '“Your site is already telling you what slows it down. My job is to read it, and to fix it.”'
                : '«Tu sitio ya te está diciendo qué lo frena. Mi trabajo es leerlo, y arreglarlo.»'}
            </blockquote>

            <div className="reveal-stagger mt-14 grid gap-10 md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] md:gap-12 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_minmax(0,15rem)] lg:gap-14">
              <figure className="m-0">
                {/* El mismo recorte del héroe, con el duotono de media tinta:
                    la foto de 800 px con fondo de oficina se retiró, que era
                    deuda declarada. Aquí el recorte se multiplica contra el
                    papel y lo que sobrevive es él — un grabado, no un
                    retrato corporativo suave. */}
                {/* `data-fit` encuadra la plancha en 4:5 y la figura la
                    llena. Sin él, el recorte con alfa dejaba tanto papel
                    alrededor que el rectángulo se leía como una tarjeta.

                    La coordenada ya no va debajo: la dice la placa de la
                    derecha, y dos veces no es énfasis, es ruido. */}
                {/* `.figure-bw` y no `.portrait`: la plancha de papel y la
                    trama de rayas de 3 px existían para salvar una foto de
                    800 px con fondo de oficina. Llegó una de estudio en blanco
                    y negro, así que la muleta se retiró y lo que queda es la
                    regla del sistema — la foto se disuelve en el material, sin
                    rectángulo y sin rayas encima. */}
                <span className="figure-bw">
                  <span className="portrait-shutter" aria-hidden="true" />
                  <Image
                    src={SEO_IMAGES.portraitBw}
                    alt={SEO_IMAGES.avatarAlt[lc]}
                    width={SEO_IMAGES.portraitBwSize}
                    height={SEO_IMAGES.portraitBwSize}
                    sizes="(min-width: 1024px) 15rem, (min-width: 768px) 16rem, 60vw"
                  />
                </span>
              </figure>

              {/* Copy PROPIO. Aquí iba `hero.lead`, que es literalmente el
                  mismo párrafo que ya está en el héroe: la sección se veía
                  vacía porque no decía nada nuevo. Estos dos salen de
                  `about`, que vive en otra página. */}
              <div>
                <p className="max-w-[56ch] text-ink-muted">{tab('lead')}</p>
                <p className="mt-5 max-w-[56ch] text-ink-muted">
                  {tab('philosophyDesc')}
                </p>
                <p className="mt-8">
                  <Link className="link-stylus" href="/sobre-mi">
                    {en ? 'full record' : 'el registro completo'} →
                  </Link>
                </p>
              </div>

              <dl className="m-0">
                <div className="plaque">
                  <dt className="plaque-key">{en ? 'base' : 'base'}</dt>
                  <dd className="plaque-val m-0">
                    {en ? NAP.localityEn : NAP.locality}
                    <span className="block tabular-nums text-ink-muted">
                      GMT−6
                    </span>
                  </dd>
                </div>

                <div className="plaque">
                  <dt className="plaque-key">
                    {en ? 'languages' : 'idiomas'}
                  </dt>
                  <dd className="plaque-val m-0">
                    {en ? 'Spanish · English' : 'Español · inglés'}
                  </dd>
                </div>

                <div className="plaque">
                  <dt className="plaque-key">
                    {en ? 'training' : 'formación'}
                  </dt>
                  <dd className="plaque-val m-0">
                    {education[0]?.institution}
                    {/* En orden cronológico: el título antes de la
                        especialización. `data/education.ts` los guarda del
                        más reciente al más viejo, que es el orden en que se
                        listan en el CV pero no el orden en que se cuentan. */}
                    <span className="block text-ink-muted">
                      {[...education]
                        .reverse()
                        .map((e) => e.degree)
                        .join(' + ')}
                    </span>
                  </dd>
                </div>

                {/* El único renglón de la placa que describe algo EN CURSO,
                    así que es el único que puede llevar el punto que late. */}
                <div className="plaque">
                  <dt className="plaque-key">
                    {en ? 'reply' : 'respuesta'}
                  </dt>
                  <dd className="plaque-val m-0 flex items-center gap-2.5">
                    <span className="live" aria-hidden="true" />
                    {en ? 'under 24 hours' : 'menos de 24 horas'}
                  </dd>
                </div>
              </dl>
            </div>
          </section>

          {/* ═══ DEL REGISTRO ════════════════════════════════════
              Los últimos artículos publicados, en su propia banda.

              Va ANTES del índice y no dentro: esa sección es «índice del
              registro / Antes de escribirme», el bloque de preguntas de
              conversión en dos columnas de <details>. Meter artículos ahí
              rompería su función y su rejilla.

              Y va en la portada porque es la URL con más autoridad del
              dominio: hasta ahora no pasaba nada al blog, y un enlace desde
              aquí es lo que hace que cien URLs nuevas se descubran rápido.
              Es además la única señal de frescura que tiene la portada. */}
          <BlogStrip
            route="recientes"
            locale={lc}
            eyebrow="del registro · lo último"
            title="Lo que acabo de escribir"
          />

          {/* ═══ ÍNDICE ══════════════════════════════════════════
              <details> nativo: sin JS, y el contenido está en el HTML del
              servidor, así que un crawler lo lee completo. */}
          {/* ── DOS BANDAS, LAS DOS A TODO EL ANCHO ──
              La versión anterior metía el titular en una columna de 18rem al
              lado del índice, y el índice en una sola columna de mil píxeles:
              seis preguntas cortas, seis reglas cruzando la hoja entera y el
              60% derecho de cada fila en negro. Seguía siendo espacio mal
              usado, solo que en otro sitio.

              Ahora son dos bandas. Arriba, el titular a la izquierda y la nota
              con su enlace a la derecha. Debajo, el índice en DOS columnas:
              cada regla mide la mitad, así que la pregunta la llena y su «+»
              queda a un palmo. Abrir una no reflúa la otra columna porque son
              dos contenedores independientes, no una sola columna partida. */}
          <section className="border-t border-hairline px-5 py-20 sm:px-10">
            <div className="grid gap-x-14 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end">
              <div>
                <p className="stamp">{en ? 'index' : 'índice del registro'}</p>
                <h2 className="mt-5 max-w-[16ch] text-d1 text-ink">
                  {en ? 'Before you write' : 'Antes de escribirme'}
                </h2>
              </div>
              <div>
                <p className="max-w-[40ch] font-human italic text-ink-muted">
                  {en
                    ? 'The questions that turn up in every first email. If yours is not here, send it — I answer in under 24 hours.'
                    : 'Las preguntas que salen en cada primer correo. Si la tuya no está, mándala: contesto en menos de 24 horas.'}
                </p>
                <p className="mt-6">
                  <Link className="link-stylus" href="/contacto">
                    {en ? 'write to me' : 'escríbeme'} →
                  </Link>
                </p>
              </div>
            </div>

            <div className="mt-12 grid gap-x-14 md:grid-cols-2">
              {faqColumns.map((half, col) => (
                <div className="reveal-stagger" key={col}>
                  {half.map((item) => (
                    <details key={item.question} className="band group">
                      <summary className="flex cursor-pointer list-none items-baseline justify-between gap-4 text-ink marker:hidden">
                        <span>{item.question}</span>
                        {/* Gira 45° al abrir: el mismo trazo pasa de «+» a «×»
                            sin cambiar de nodo ni tocar el layout. */}
                        <span
                          aria-hidden="true"
                          className="stamp shrink-0 transition-transform duration-200 group-open:rotate-45"
                        >
                          +
                        </span>
                      </summary>
                      <p className="mt-3 max-w-[62ch] text-ink-muted">
                        {item.answer}
                      </p>
                    </details>
                  ))}
                </div>
              ))}
            </div>
          </section>

          {/* ═══ CIERRE ══════════════════════════════════════════ */}
          {/* El cierre llevaba el titular, el párrafo y el enlace apilados
              a la izquierda con `py-24`: media hoja en negro a la derecha y
              cien píxeles de nada debajo del enlace. Ahora el enlace se va al
              otro extremo de la hoja, alineado por su base con el párrafo —
              el gesto de firmar al pie— y el campo del tambor ocupa el fondo. */}
          <section className="border-t border-hairline px-5 py-20 sm:px-10">
            <div className="grid items-end gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
              <div>
                <h2 className="max-w-[18ch] text-d1 text-ink">{tc('title')}</h2>
                <p className="mt-6 max-w-[52ch] font-human text-lead text-ink-muted">
                  {tc('lead')}
                </p>
              </div>
              <p className="lg:text-right">
                <Link className="link-stylus text-d3" href="/contacto">
                  {t('ctaPrimary')} →
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
