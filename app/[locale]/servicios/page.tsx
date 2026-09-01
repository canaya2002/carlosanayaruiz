import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { StaticPathname } from '@/i18n/routing'
import { Rail } from '@/components/instrument/rail'
import { BlogStrip } from '@/components/sections/blog-strip'
import { Ribbon } from '@/components/instrument/ribbon'
import { Dial } from '@/components/instrument/dial'
import { getServices, servicePath, type ServiceId } from '@/data/services'
import { NAP } from '@/lib/constants'
import { generatePageMetadata } from '@/lib/seo'
import { generateServicesHubGraph } from '@/lib/schema'
import type { Locale, Localized } from '@/data/types'

interface Props {
  params: Promise<{ locale: string }>
}

/**
 * El síntoma que debería mandar a alguien a cada servicio.
 *
 * Va indexado por el `ServiceId` estable y no por posición del arreglo, así
 * este copy no puede terminar pegado al servicio equivocado si algún día se
 * reordena `data/services.ts`. Estos strings no tienen clave en
 * `messages/*.json`, así que van en línea por idioma — lo mismo que hace la
 * home con el copy de una sola aparición.
 *
 * Son EXCLUSIVOS de este hub: no se repiten en ninguna página de servicio, lo
 * que permite construir con ellos el acordeón de "por dónde empezar" sin que
 * dos URLs terminen respondiendo la misma consulta.
 */
const SYMPTOM: Record<ServiceId, Localized<string>> = {
  'seo-tecnico': {
    es: 'El sitio ya existe, tiene contenido y aun así no aparece donde debería.',
    en: 'The site already exists and has content, and still does not show up where it should.',
  },
  'nextjs-firebase': {
    es: 'Hay que construir o migrar el sitio, y no puede perder posiciones al hacerlo.',
    en: 'The site has to be built or migrated, and it cannot lose positions doing it.',
  },
  'ai-automation': {
    es: 'Tu equipo contesta o captura lo mismo todos los días, a mano.',
    en: 'Your team answers or types the same things every day, by hand.',
  },
  dashboards: {
    es: 'Los datos ya existen, pero nadie los mira porque viven en siete reportes distintos.',
    en: 'The data already exists, but nobody looks at it because it lives in seven separate reports.',
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const en = locale === 'en'

  return generatePageMetadata({
    locale: locale as Locale,
    route: 'services',
    title: en
      ? 'Technical SEO, Web & AI Services'
      : 'Servicios de SEO técnico, web e IA',
    description: en
      ? 'Four services: technical SEO consulting, Next.js and Firebase development, AI automation and dashboards. What each changes, and who it is for.'
      : 'Cuatro servicios: consultoría SEO técnica, desarrollo con Next.js y Firebase, automatización con IA y dashboards. Qué cambia cada uno y para quién es.',
  })
}

export default async function ServicesHubPage({ params }: Props) {
  const { locale: rawLocale } = await params
  setRequestLocale(rawLocale)

  const locale = rawLocale as Locale
  const en = locale === 'en'

  const t = await getTranslations('hero')
  const ts = await getTranslations('services')
  const th = await getTranslations('servicesHub')
  const tl = await getTranslations('a11y')

  const services = getServices(locale)

  /**
   * a–d: canales paralelos de un registrador multipluma, no pasos 01/02/03.
   * El mismo identificador acompaña al servicio en las tres secciones donde
   * aparece, así que la placa, el acordeón y el detalle se leen como el mismo
   * registro visto tres veces y no como tres listas distintas.
   */
  const channelId = (i: number) => String.fromCharCode(97 + i)

  // Subetiquetas dentro de cada fila de servicio. Se renderizan como <dt> y no
  // como encabezados, así cuatro etiquetas repetidas no agregan doce entradas
  // al outline del documento.
  const labels = {
    outcomes: en ? 'What changes for you' : 'Qué cambia para ti',
    forWhom: en ? 'Who it is for' : 'Para quién es',
    notFor: en
      ? 'When I am not the right fit'
      : 'Cuándo no soy la opción correcta',
  }

  // Las cuatro fases del despacho, iguales en los cuatro servicios. Los pasos
  // por servicio viven en `data/services.ts` y se renderizan en su página; el
  // margen de la cabecera cuenta ESOS, no estos.
  const processSteps = [
    { title: ts('step1Title'), desc: ts('step1Desc') },
    { title: ts('step2Title'), desc: ts('step2Desc') },
    { title: ts('step3Title'), desc: ts('step3Desc') },
    { title: ts('step4Title'), desc: ts('step4Desc') },
  ]

  /**
   * El alcance de los cuatro servicios, aplanado a dos cintas que corren en
   * direcciones opuestas. Son partidas de entregable —nombres cortos—, que es
   * exactamente el material para el que sirve una cinta: se ven pasar, no se
   * leen con calma. Lo que hay que leer con calma está más abajo, en filas.
   */
  const scopeLeft = Array.from(
    new Set(services.slice(0, 2).flatMap((s) => s.includes))
  )
  const scopeRight = Array.from(
    new Set(services.slice(2).flatMap((s) => s.includes))
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateServicesHubGraph(locale)),
        }}
      />

      {/* La cinta corre por el margen de todas las páginas. La AGUJA no: el
          instrumento en vivo es exclusivo de la home, y duplicarlo aquí lo
          convertiría en decoración. */}
      <div
        className="grid"
        style={{ gridTemplateColumns: 'var(--tape-w) minmax(0,1fr)' }}
      >
        <Rail />

        <div className="min-w-0">
          {/* ═══ CABECERA ════════════════════════════════════════
              El h1 es texto del servidor y es el LCP: no espera a ninguna
              secuencia de entrada ni a que se resuelva una imagen. */}
          <section className="hero-in relative px-5 pt-16 pb-20 sm:px-10">
            {/* ── LA HOJA TIENE DOS MÁRGENES ──
                Sin instrumento nuevo: el dial ya vive en la placa de abajo y
                un segundo aparato en la misma página lo volvería adorno. El
                margen lleva la LEYENDA del catálogo — cada canal con sus
                pasos y sus renglones, contados del archivo de datos. */}
            <div className="ledger">
              <div className="min-w-0">
                <p className="stamp">{t('eyebrow')}</p>

                <h1 className="mt-6 max-w-[12ch] text-hero text-ink">
                  {th('title')}
                </h1>

                <p className="mt-8 max-w-[44ch] text-lead text-ink-muted">
                  {th('subtitle')}
                </p>

                {/* Serif: es la voz en primera persona, y es el único lugar de la
                cabecera donde aparece. */}
                <p className="mt-6 max-w-[54ch] font-human text-ink-muted">
                  {th('lead')}
                </p>

                <p className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
                  <Link className="link-stylus" href="/contacto">
                    {t('ctaPrimary')} →
                  </Link>
                  <Link className="link-stylus" href="/sobre-mi">
                    {t('ctaTertiary')} →
                  </Link>
                </p>

                <p className="stamp mt-8">{t('locationNote')}</p>
              </div>

              {/* ── EL MARGEN DE ANOTACIÓN ── */}
              <aside className="margin margin-sticky">
                <div className="margin-row">
                  <span className="margin-key">
                    {en ? 'channels' : 'canales'}
                  </span>
                  <span className="margin-read">{services.length}</span>
                  {/* ⚠ Decía «paralelos, no pasos de una secuencia», que explica
                      la METÁFORA del registrador multipluma en vez de decirle al
                      visitante qué significa para él. El dueño mismo preguntó
                      qué quería decir, y si el dueño no lo entiende, un
                      prospecto tampoco.

                      Se conserva la palabra «canales» y los identificadores
                      `ch a`–`ch d`, porque son el vocabulario del sitio entero
                      —el dial, el nav y la home los usan igual— y romperlo sería
                      peor. Lo que cambia es la explicación: ahora dice la
                      CONSECUENCIA, que es lo único que le sirve a quien compra. */}
                  <span className="margin-val">
                    {en
                      ? 'each one is hired on its own — they are not phases of a single project.'
                      : 'cada uno se contrata solo; no son fases de un mismo proyecto.'}
                  </span>
                </div>

                {services.map((service, i) => (
                  <div key={service.id} className="margin-row">
                    <span className="margin-key">
                      ch {String.fromCharCode(97 + i)}
                    </span>
                    <span className="margin-val !text-ink">
                      {service.title}
                    </span>
                    {/* ⚠ Decía «4 pasos · 6 renglones» y era ilegible para un
                        comprador: describía la ESTRUCTURA DEL DATO, no la
                        oferta. «Renglón» además es una palabra del registrador
                        —una línea del gráfico— que se filtró a la copia
                        comercial; en `data/services.ts` el campo se llama
                        `includes`, y lo que contiene son entregables.

                        Las cifras son las mismas y siguen saliendo del archivo:
                        `process.length` son las fases de la entrega e
                        `includes.length` los entregables. Lo único que cambia
                        son las palabras. */}
                    <span className="margin-val !text-ink-subtle">
                      {service.process.length}
                      {en ? ' delivery phases · ' : ' fases de entrega · '}
                      {service.includes.length}
                      {en ? ' deliverables' : ' entregables'}
                    </span>
                  </div>
                ))}
              </aside>
            </div>
          </section>

          {/* ═══ CANALES ═════════════════════════════════════════
              La placa despejada, una sola vez por página y reservada para lo
              que la página vino a hacer: repartir a los cuatro servicios.
              Cada fila es un canal del registrador —a–d, paralelos—, no un
              paso de una secuencia. */}
          <section className="plate px-5 py-20 sm:px-10">
            {/* Sin `style` inline: `.plate .stamp` ya lleva la tinta medida
                para superficie clara. Ver --ink-plate en globals.css. */}
            <p className="stamp">
              {en
                ? `channels a–${channelId(services.length - 1)} · parallel`
                : `canales a–${channelId(services.length - 1)} · paralelos`}
            </p>
            <h2 className="mt-5 max-w-[18ch] text-d1">{ts('title')}</h2>
            <p className="mt-6 max-w-[52ch] text-lead">{ts('subtitle')}</p>

            <div className="mt-12 grid gap-x-14 gap-y-16 xl:grid-cols-[minmax(0,54rem)_minmax(14rem,1fr)] xl:items-center">
              <ul className="reveal-stagger">
                {services.map((service, i) => (
                  <li key={service.id}>
                    <Link
                      href={servicePath(service, locale) as StaticPathname}
                      className="channel group"
                      /* Lo que el dial lee con `:has()` para saber qué anillo
                       encender. Ver el bloque «EL DIAL» en globals.css. */
                      data-ch={channelId(i)}
                    >
                      <span className="channel-id">ch {channelId(i)}</span>
                      <span>
                        <span className="text-d3">{service.title}</span>
                        <span className="channel-note mt-1 block max-w-[52ch] text-sm">
                          {service.headline}
                        </span>
                        {/* La pluma: al pasar el puntero una línea se escribe de
                          izquierda a derecha bajo la fila. No hay caja que se
                          encienda — avanza el trazo. */}
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

              {/* EL DIAL. La misma cara del tambor de la portada: es la
                  leyenda de esta lista, así que pertenece a donde está la
                  lista. Ver components/instrument/dial.tsx. */}
              <Dial
                channels={services.map((service, i) => ({
                  id: service.id,
                  ch: channelId(i),
                }))}
                idle={`a–${channelId(services.length - 1)}`}
              />
            </div>
          </section>

          {/* ═══ LA CINTA DEL ALCANCE ════════════════════════════
              Las partidas de entregable de los cuatro, en dos carriles
              opuestos. El cruce es lo que da profundidad —dos planos
              moviéndose distinto— sin una sombra y sin una caja. */}
          <section
            className="overflow-hidden border-t border-hairline py-10"
            aria-labelledby="scope-heading"
          >
            <h2 id="scope-heading" className="sr-only">
              {ts('includes')}
            </h2>
            <Ribbon items={scopeLeft} label={tl('scopeRail')} />
            <div className="mt-3">
              <Ribbon
                items={scopeRight}
                label={`${tl('scopeRail')} · ${en ? 'second rail' : 'segundo carril'}`}
                reverse
              />
            </div>
          </section>

          {/* ═══ POR DÓNDE EMPEZAR ═══════════════════════════════
              Un hub se gana su URL enrutando gente, así que esto va antes del
              detalle. Cada síntoma es un <details> nativo: la respuesta está
              en el HTML del servidor abierta o cerrada, así que se indexa
              igual, y el clic da el acordeón sin una línea de JavaScript.

              El `name` compartido es lo que lo hace EXCLUSIVO —abrir uno
              cierra el anterior—, también nativo y también sin JS. */}
          <section className="border-t border-hairline px-5 py-20 sm:px-10">
            <p className="stamp">
              {en ? 'where to start' : 'por dónde empezar'}
            </p>
            <h2 className="mt-5 max-w-[16ch] text-d1 text-ink">
              {en ? 'Which one do you need?' : '¿Cuál necesitas?'}
            </h2>
            <p className="mt-6 max-w-[52ch] text-lead text-ink-muted">
              {th('chooseHelp')}
            </p>

            <div className="mt-12">
              {services.map((service, i) => (
                <details
                  key={service.id}
                  name="hub-sintoma"
                  className="band group"
                >
                  <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 text-ink marker:hidden">
                    <span>{SYMPTOM[service.id][locale]}</span>
                    <span
                      aria-hidden="true"
                      className="stamp shrink-0 transition-transform duration-150 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>

                  <div className="mt-4">
                    <p className="stamp">ch {channelId(i)}</p>
                    <p className="mt-2 text-d3 text-ink">{service.title}</p>
                    <p className="mt-2 max-w-[62ch] text-ink-muted">
                      {service.headline}
                    </p>
                    {/* El enlace repite el título del servicio: cuatro enlaces
                        "Ver el servicio" seguidos no se distinguen uno de otro
                        fuera de contexto. */}
                    <p className="mt-5">
                      <Link
                        className="link-stylus"
                        href={servicePath(service, locale) as StaticPathname}
                      >
                        {ts('viewService')}: {service.title} →
                      </Link>
                    </p>
                  </div>
                </details>
              ))}
            </div>

            {/* La nota honesta se imprime como un hueco del registro: línea
                punteada, sin caja. */}
            <p className="gap mt-8 max-w-[68ch] pt-4 text-sm text-ink-muted">
              {en
                ? 'Most engagements start with one, not with all of them. And sometimes the answer is none of them: if what you are missing is content or domain authority, technical work will not fix it, and I will say so on the first call instead of selling you an audit.'
                : 'La mayoría de los proyectos empiezan con uno, no con todos. Y a veces la respuesta es ninguno: si lo que te falta es contenido o autoridad de dominio, el trabajo técnico no lo va a resolver, y te lo digo en la primera llamada en lugar de venderte una auditoría.'}
            </p>
          </section>

          {/* ═══ LOS CUATRO, EN DETALLE ══════════════════════════
              La placa reparte; esto compara. Cada bloque lleva el servicio
              completo —resultados, encaje y LÍMITES— en filas, para que esta
              página se sostenga sola en lugar de ser una lista de enlaces.
              Los `id` se conservan: hay enlaces internos que apuntan a ellos. */}
          <section className="border-t border-hairline px-5 py-20 sm:px-10">
            <p className="stamp">
              {en ? 'what each one covers' : 'qué incluye cada uno'}
            </p>
            <h2 className="mt-5 max-w-[18ch] text-d1 text-ink">
              {en
                ? 'All of them, side by side'
                : 'Todos, uno al lado del otro'}
            </h2>

            <div className="mt-14 space-y-20">
              {services.map((service, i) => {
                const href = servicePath(service, locale) as StaticPathname

                return (
                  <article key={service.id} id={service.id} className="band">
                    <p className="stamp">ch {channelId(i)}</p>

                    <h3 className="mt-3 text-d2 text-ink">
                      <Link href={href} className="group inline-flex gap-3">
                        {service.title}
                        <span
                          aria-hidden="true"
                          className="transition-transform duration-150 group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </Link>
                    </h3>

                    <p className="mt-4 max-w-[64ch] text-ink-muted">
                      {service.description}
                    </p>

                    <dl className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-x-14">
                      <div className="lg:col-span-2">
                        <dt className="stamp">{labels.outcomes}</dt>
                        <dd>
                          <ul className="mt-4 grid gap-x-14 sm:grid-cols-2">
                            {service.outcomes.map((outcome) => (
                              <li
                                key={outcome}
                                className="band grid grid-cols-[1.25rem_minmax(0,1fr)] gap-3 text-sm text-ink-muted"
                              >
                                <span className="stamp" aria-hidden="true">
                                  +
                                </span>
                                <span>{outcome}</span>
                              </li>
                            ))}
                          </ul>
                        </dd>
                      </div>

                      {/* ── ENCAJE Y LÍMITES, AL MISMO PESO ──
                          Misma etiqueta, mismo tamaño de texto y el mismo
                          ritmo de fila. Los límites declarados son la señal de
                          confianza de esta página: mandarlos a letra chica o
                          esconderlos tras un clic anula el motivo por el que
                          están escritos. La lista de límites se distingue por
                          la FORMA del marcador (una equis) y por su etiqueta,
                          nunca por el color: aquí el color solo aparece sobre
                          una medición. */}
                      <div>
                        <dt className="stamp">{labels.forWhom}</dt>
                        <dd>
                          <ul className="mt-4">
                            {service.forWhom.map((item) => (
                              <li
                                key={item}
                                className="band grid grid-cols-[1.25rem_minmax(0,1fr)] gap-3 text-sm text-ink-muted"
                              >
                                <span className="stamp" aria-hidden="true">
                                  +
                                </span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </dd>
                      </div>

                      <div>
                        <dt className="stamp">{labels.notFor}</dt>
                        <dd>
                          <ul className="mt-4">
                            {service.notFor.map((item) => (
                              <li
                                key={item}
                                className="band grid grid-cols-[1.25rem_minmax(0,1fr)] gap-3 text-sm text-ink-muted"
                              >
                                <span className="stamp" aria-hidden="true">
                                  ×
                                </span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </dd>
                      </div>
                    </dl>

                    {/* La etiqueta visible es idéntica en los cuatro bloques,
                        así que el nombre accesible carga además el título del
                        servicio. Sigue conteniendo el texto visible (WCAG
                        2.5.3). */}
                    <p className="mt-10">
                      <Link className="link-stylus" href={href}>
                        {/* El título entra en el texto VISIBLE. Estaba solo en
                            el `aria-label`, así que los cuatro enlaces de cierre
                            de la rejilla compartían ancla —«Ver el servicio»—
                            apuntando a las cuatro páginas que facturan. La línea
                            370 de este mismo archivo ya lo hacía bien; ahora las
                            dos coinciden, y con el título en el texto el
                            `aria-label` sobra. */}
                        {ts('viewService')}: {service.title} →
                      </Link>
                    </p>
                  </article>
                )
              })}
            </div>
          </section>

          {/* ═══ CÓMO TRABAJO ════════════════════════════════════
              Las mismas cuatro fases para los cuatro servicios. Aquí la
              numeración sí es legítima: es una secuencia real, y el orden es
              parte del dato. */}
          <section className="border-t border-hairline px-5 py-20 sm:px-10">
            <p className="stamp">{en ? 'method' : 'método'}</p>
            {/* NO ts('process') aquí: «Cómo trabajo» es el stamp de las
                cuatro páginas de servicio, donde encabeza CINCO fases
                distintas. Tres versiones del proceso convivían en esta URL
                y la siguiente. */}
            <h2 className="mt-5 max-w-[16ch] text-d1 text-ink">
              {en
                ? 'The same in all four services'
                : 'Lo mismo en los cuatro servicios'}
            </h2>
            <p className="mt-6 max-w-[52ch] text-lead text-ink-muted">
              {ts('processSubtitle')}
            </p>

            <ol className="reveal-stagger mt-12">
              {processSteps.map((step, index) => (
                <li
                  key={step.title}
                  className="band grid gap-x-8 gap-y-2 sm:grid-cols-[7rem_minmax(0,1fr)]"
                >
                  <span className="stamp tabular-nums">
                    {en ? 'phase' : 'fase'} {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-d3 text-ink">{step.title}</h3>
                    <p className="mt-2 max-w-[62ch] text-ink-muted">
                      {step.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* ── DEL REGISTRO ──
              El hub de servicios enlaza a los artículos que tratan de los
              cuatro. Antes esta página no enlazaba a ni un artículo, y es la
              que reparte autoridad a las cuatro que facturan. */}
          <BlogStrip route="services" locale={locale} title="Escrito sobre todo esto" />

          {/* ═══ CIERRE ══════════════════════════════════════════ */}
          <section className="border-t border-hairline px-5 py-24 sm:px-10">
            <h2 className="max-w-[20ch] text-d1 text-ink">
              {en
                ? 'Not sure which one applies? Describe the problem.'
                : '¿No sabes cuál aplica? Descríbeme el problema.'}
            </h2>
            <p className="mt-6 max-w-[54ch] font-human text-lead text-ink-muted">
              {en
                ? 'Send the URL, what changed, and since when. I reply in under 24 hours with a first read on which of the four — if any — is worth starting with.'
                : 'Mándame la URL, qué cambió y desde cuándo. Respondo en menos de 24 horas con una primera lectura de con cuál de los cuatro conviene empezar, si con alguno.'}
            </p>

            <p className="mt-10 flex flex-wrap items-baseline gap-x-8 gap-y-3">
              <Link className="link-stylus text-d3" href="/contacto">
                {t('ctaPrimary')} →
              </Link>
              <a
                className="link-stylus font-mono text-sm"
                href={`mailto:${NAP.email}`}
              >
                {NAP.email}
              </a>
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
