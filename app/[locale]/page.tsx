import type { Metadata } from 'next'
import Image from 'next/image'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Greeting } from '@/components/instrument/greeting'
import { Rail } from '@/components/instrument/rail'
import { Marks } from '@/components/instrument/marks'
import { Ribbon } from '@/components/instrument/ribbon'
import { MediaSlot } from '@/components/instrument/media-slot'
import { getServices, servicePath } from '@/data/services'
import { getSkillCategories } from '@/data/skills'
import { getExperiences, type Experience } from '@/data/experience'
import { getSiteFaq } from '@/data/faq'
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

  const lc = locale as Locale
  const en = lc === 'en'
  const services = getServices(lc)
  const experiences = getExperiences(lc)
  const faq = getSiteFaq(lc)
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
        <Rail endLabel={en ? "end of record" : "fin del registro"} />

        <div className="min-w-0">
          {/* ═══ HÉROE ═══════════════════════════════════════════
              El saludo es la primera línea del h1 y se pinta desde el
              servidor, así que el LCP es el titular y no espera a que
              termine ninguna secuencia de entrada. */}
          {/* La altura sale de `--hero-h`, el MISMO token que usa el tramo
              graduado del riel. Si se separan, el eje deja de coincidir con
              el contenido y la graduación miente. */}
          <section
            className="relative flex flex-col px-5 pt-16 pb-14 sm:px-10"
            style={{ minHeight: 'var(--hero-h)' }}
          >
            <h1 className="max-w-[20ch] text-hero text-ink">
              <Greeting locale={lc} />{' '}
              {/* El espacio entre los dos `span` de bloque es deliberado: sin
                  él `textContent` concatena «sitiotarda». `innerText` lo
                  resuelve solo, pero no todo lo que lee un documento pasa
                  por el motor de layout. */}
              <span className="block">
                {en ? 'I measure what your site' : 'Mido lo que tu sitio'}
              </span>{' '}
              <span className="block">
                {en ? 'takes to exist.' : 'tarda en existir.'}
              </span>
            </h1>

            {/* El titular manda a todo lo ancho —es el masthead, su escala es
                el argumento— y debajo se abre el par de columnas. Meterlo en
                una columna estrecha lo partia en cuatro lineas y perdia la
                autoridad que da el tamano. */}
            <div className="mt-14 grid gap-x-14 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
              <div className="flex flex-col">
            <p className="max-w-[46ch] font-human text-lead text-ink-muted">
              {t('lead')}
            </p>

            <p className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
              <Link className="link-stylus" href="/contacto">
                {en ? 'ask for a reading' : 'pedir una lectura'} →
              </Link>
              <Link className="link-stylus" href="/servicios">
                {en ? 'see the record' : 'ver el registro'} →
              </Link>
            </p>

              <p className="stamp mt-auto pt-10">{t('locationNote')}</p>
              </div>

            {/* La columna derecha era el hueco vacío más grande del sitio.
                Ahora lleva las dos cosas que el visitante vino a ver: el
                fondo animado —marcado mientras no exista el archivo, con su
                ruta escrita encima— y la medición en vivo debajo. */}
              <div className="flex flex-col gap-10">
              <MediaSlot
                id="home-hero-loop"
                sizes="(min-width: 1024px) 45vw, 100vw"
              />
                <Marks
                  label={en ? 'reading · this visit' : 'lectura · esta visita'}
                  live={en ? 'live' : 'en vivo'}
                />
              </div>
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
                        className={`stamp absolute -top-6 ${flip ? 'right-1.5' : 'left-1.5'}`}
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
              duration="64s"
            />
            <div className="mt-3">
              <Ribbon
                items={stack}
                label={en ? 'Stack, second rail' : 'Stack, segundo carril'}
                duration="78s"
                reverse
              />
            </div>
          </section>

          {/* ═══ CANALES ═════════════════════════════════════════
              La placa despejada: el material se invierte entero. Es la
              sección que la aguja limpió. */}
          <section className="plate px-5 py-20 sm:px-10">
            {/* Sin `style` inline: `.plate .stamp` ya lleva la tinta medida
                para superficie clara. Ver --ink-plate en globals.css. */}
            <p className="stamp">
              {en ? 'channels a–e · parallel' : 'canales a–e · paralelos'}
            </p>
            <h2 className="mt-5 max-w-[18ch] text-d1">{ts('title')}</h2>

            <ul className="mt-12">
              {services.map((service, i) => (
                <li key={service.id}>
                  <Link
                    href={servicePath(service, lc) as never}
                    className="channel group"
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
          </section>

          {/* ═══ EL OPERADOR ═════════════════════════════════════ */}
          <section className="border-t border-hairline px-5 py-20 sm:px-10">
            <p className="stamp">{en ? 'the operator' : 'el operador'}</p>

            <div className="mt-10 grid gap-10 md:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] md:gap-14">
              <figure className="m-0">
                <span className="portrait block">
                  <span className="portrait-shutter" aria-hidden="true" />
                  <Image
                    src={SEO_IMAGES.avatar}
                    alt={SEO_IMAGES.avatarAlt[lc]}
                    width={SEO_IMAGES.avatarWidth}
                    height={SEO_IMAGES.avatarHeight}
                    sizes="(min-width: 768px) 18rem, 100vw"
                  />
                </span>
                <figcaption className="stamp mt-4">
                  {NAP.locality} · 19.4326 N / 99.1332 W
                </figcaption>
              </figure>

              <div>
                <blockquote className="m-0 max-w-[26ch] font-human text-d2 italic text-ink">
                  {en
                    ? '“I don’t sell rankings. I sell the number going down and staying down.”'
                    : '«No vendo posiciones. Vendo que el número baje y se quede abajo.»'}
                </blockquote>
                <p className="mt-8 max-w-[52ch] text-ink-muted">{t('lead')}</p>
                <p className="mt-8">
                  <Link className="link-stylus" href="/sobre-mi">
                    {en ? 'full record' : 'el registro completo'} →
                  </Link>
                </p>
              </div>
            </div>
          </section>

          {/* ═══ ÍNDICE ══════════════════════════════════════════
              <details> nativo: sin JS, y el contenido está en el HTML del
              servidor, así que un crawler lo lee completo. */}
          <section className="border-t border-hairline px-5 py-20 sm:px-10">
            <p className="stamp">{en ? 'index' : 'índice del registro'}</p>
            <h2 className="mt-5 max-w-[16ch] text-d1 text-ink">
              {en ? 'Before you write' : 'Antes de escribirme'}
            </h2>

            <div className="mt-10">
              {faq.map((item) => (
                <details key={item.question} className="band group">
                  <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 text-ink marker:hidden">
                    <span>{item.question}</span>
                    <span
                      aria-hidden="true"
                      className="stamp shrink-0 group-open:rotate-45 transition-transform duration-150"
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
          </section>

          {/* ═══ CIERRE ══════════════════════════════════════════ */}
          <section className="border-t border-hairline px-5 py-24 sm:px-10">
            <h2 className="max-w-[18ch] text-d1 text-ink">{tc('title')}</h2>
            <p className="mt-6 max-w-[52ch] font-human text-lead text-ink-muted">
              {tc('lead')}
            </p>
            <p className="mt-10">
              <Link className="link-stylus text-d3" href="/contacto">
                {t('ctaPrimary')} →
              </Link>
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
