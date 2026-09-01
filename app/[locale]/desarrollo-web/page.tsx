import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { MediaSlot } from '@/components/instrument/media-slot'
import { anySlotFilled } from '@/data/media-slots'
import { Rail } from '@/components/instrument/rail'
import { BlogStrip } from '@/components/sections/blog-strip'
import { Pens } from '@/components/instrument/pens'
import { ContactChannels } from '@/components/sections/contact-channels'
import { Ribbon } from '@/components/instrument/ribbon'
import { getServiceById, getServices, servicePath } from '@/data/services'
import { NAP } from '@/lib/constants'
import { generatePageMetadata } from '@/lib/seo'
import { generateServicePageGraph } from '@/lib/schema'
import type { StaticPathname } from '@/i18n/routing'
import { Locale } from '@/data/types'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const en = locale === 'en'

  return generatePageMetadata({
    locale: locale as Locale,
    route: 'desarrolloWeb',
    // Se lee como resultado de búsqueda, no como eslogan: qué es, con qué,
    // dónde. Distinto de las páginas de SEO, automatización y dashboards.
    title: en
      ? 'Next.js & Firebase Web Development'
      : 'Desarrollo web con Next.js y Firebase',
    description: en
      ? 'Web apps built with Next.js and Firebase: SSR/ISR, strict TypeScript, Firestore, Auth and Vercel deploys. Technical SEO from the first commit.'
      : 'Aplicaciones web con Next.js y Firebase: SSR/ISR, TypeScript estricto, Firestore, Auth y deploy en Vercel. SEO técnico desde el primer commit.',
  })
}

/**
 * ════════════════════════════════════════════════════════════════
 * DESARROLLO WEB — hoja de servicio en «Papel Ahumado»
 *
 * Esta página era la más cargada del sitio: aurora animada en tres
 * secciones, resplandor de puntero, tres planos en 3D, un carrusel con
 * flechas y once tarjetas con borde. Todo eso se fue. Lo que queda es el
 * registro: una cinta en el margen, reglas horizontales y bandas escritas
 * a lo ancho.
 *
 * El instrumento en vivo —aguja, marcas y regla de presupuesto— NO se
 * duplica aquí. Vive solo en la home; repetirlo en cada página lo
 * convertiría en decoración y dejaría de significar una medición.
 *
 * Movimiento: la cinta del riel corre sola (CSS, fuera del main thread) y
 * el stack pasa en dos carriles opuestos. Cero librerías, cero JS.
 * ════════════════════════════════════════════════════════════════
 */
export default async function DesarrolloWebPage({ params }: Props) {
  const { locale: rawLocale } = await params
  setRequestLocale(rawLocale)

  const locale = rawLocale as Locale
  const en = locale === 'en'

  const t = await getTranslations('servicePages.desarrolloWeb')
  const tn = await getTranslations('nav')
  const tb = await getTranslations('breadcrumbs')
  const ts = await getTranslations('services')

  // Un solo registro alimenta el copy, el schema y los enlaces internos, así
  // que la página y sus datos estructurados no pueden desincronizarse.
  const service = getServiceById(locale, 'nextjs-firebase')
  if (!service) notFound()

  // El catálogo completo, para que la letra de canal de un servicio sea la
  // MISMA en toda la web: a–d salen de su posición real en el catálogo, no
  // del orden en que caen en esta página.
  const catalog = getServices(locale)
  const selfIndex = catalog.findIndex((item) => item.id === service.id)

  // Dos hermanos, en orden de catálogo. Nunca este mismo servicio.
  const related = catalog
    .map((item, index) => ({ item, index }))
    .filter((entry) => entry.index !== selfIndex)
    .slice(0, 2)

  // La etiqueta de la miga es corta a propósito, y es la MISMA cadena en la
  // ruta visible y en el markup de BreadcrumbList de abajo.
  const crumbLabel = en ? 'Web Development' : 'Desarrollo Web'

  const stackGroups = en
    ? [
        {
          label: 'Frontend',
          items: [
            'Next.js 16 (App Router)',
            'React 19',
            'TypeScript',
            'Tailwind CSS',
          ],
        },
        {
          label: 'Data & backend',
          items: [
            'Firebase',
            'Firestore',
            'Firebase Auth',
            'Cloud Functions',
            'Node.js',
            'PostgreSQL',
          ],
        },
        {
          label: 'Infrastructure & quality',
          items: [
            'Vercel',
            'CI/CD',
            'Git',
            'Lighthouse',
            'Schema.org / JSON-LD',
          ],
        },
      ]
    : [
        {
          label: 'Frontend',
          items: [
            'Next.js 16 (App Router)',
            'React 19',
            'TypeScript',
            'Tailwind CSS',
          ],
        },
        {
          label: 'Datos y backend',
          items: [
            'Firebase',
            'Firestore',
            'Firebase Auth',
            'Cloud Functions',
            'Node.js',
            'PostgreSQL',
          ],
        },
        {
          label: 'Infraestructura y calidad',
          items: [
            'Vercel',
            'CI/CD',
            'Git',
            'Lighthouse',
            'Schema.org / JSON-LD',
          ],
        },
      ]

  /**
   * El stack, aplanado a una sola tira. Las tres etiquetas de grupo no se
   * pierden: se imprimen como pie de la cinta, y el orden de la tira es
   * exactamente ese. Así los quince nombres aparecen UNA vez en la página,
   * no dos.
   */
  const stack = stackGroups.flatMap((group) => group.items)
  const stackLegend = stackGroups.map((group) => group.label).join(' · ')

  return (
    <>
      {/* ItemPage + Service + BreadcrumbList + FAQPage. El FAQ es el de este
          servicio — el FAQ del sitio pertenece a la home, y dos URLs no deben
          responder la misma consulta. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateServicePageGraph(
              locale,
              service,
              [
                { name: tb('home'), route: 'home' },
                { name: tn('services'), route: 'services' },
                { name: crumbLabel, route: 'desarrolloWeb' },
              ],
              service.faq
            )
          ),
        }}
      />

      <div
        className="grid"
        style={{ gridTemplateColumns: 'var(--tape-w) minmax(0,1fr)' }}
      >
        <Rail />

        <div className="min-w-0">
          {/* ═══ CABECERA ════════════════════════════════════════
              El titular es el LCP y se pinta desde el servidor: no espera a
              ninguna secuencia de entrada, ninguna imagen y ningún script. */}
          <section className="hero-in relative px-5 pt-16 pb-20 sm:px-10">
            {/* ── LA HOJA TIENE DOS MÁRGENES ──
                El texto a la izquierda, la lectura del operador a la
                derecha. Por debajo de 80rem el margen cae al flujo y su
                regla se vuelve horizontal: no hay dos columnas donde no
                caben dos columnas. */}
            <div className="ledger">
              <div className="min-w-0">
                <p className="stamp">
                  {en
                    ? 'service · web development'
                    : 'servicio · desarrollo web'}
                </p>

                <h1 className="mt-7 max-w-[15ch] text-hero text-ink">
                  {t('title')}
                </h1>

                <p className="mt-10 max-w-[46ch] text-lead text-ink-muted">
                  {t('subtitle')}
                </p>

                <p className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
                  <Link className="link-stylus" href="/contacto">
                    {t('ctaMain')} →
                  </Link>
                  <Link className="link-stylus" href="/servicios">
                    {ts('allServices')} →
                  </Link>
                </p>

                {/* Sin `.live`: aquí no hay nada midiendo del otro lado. El punto
                que late pertenece a la home, donde sí corre un
                PerformanceObserver. */}
                <p className="mt-8 max-w-[52ch] text-sm text-ink-muted">
                  {en
                    ? `From ${NAP.localityEn}, for teams in any time zone. Spanish or English.`
                    : `Desde ${NAP.locality}, para equipos en cualquier zona horaria. En español o inglés.`}
                </p>
              </div>

              {/* ── EL MARGEN DE ANOTACIÓN ──
                  La segunda columna de la hoja. Medido a 1440: sin ella el
                  45% derecho de la página estaba muerto en todo offset de
                  scroll. Lo que va aquí no es relleno — es la LECTURA:
                  cuántas plumas escriben, cuántos renglones tiene el
                  alcance y para quién NO es. Todo sale del archivo de datos
                  del servicio, así que no puede desmentir al cuerpo de la
                  página. */}
              <aside className="margin margin-sticky">
                <Pens
                  steps={service.process}
                  label={en ? 'the register' : 'el registro'}
                  unit={en ? 'pens' : 'plumas'}
                  legend={
                    en
                      ? 'one pen per step. Trace length is the step position in the delivery, not a percentage of anything.'
                      : 'una pluma por paso. El largo del trazo es la posición del paso en la entrega, no un porcentaje de nada.'
                  }
                />

                <div className="margin-row">
                  <span className="margin-key">
                    {en ? 'line items' : 'renglones'}
                  </span>
                  <span className="margin-read">{service.includes.length}</span>
                  <span className="margin-val">
                    {en
                      ? 'items in the scope, written out below.'
                      : 'renglones en el alcance, escritos abajo.'}
                  </span>
                </div>

                {/* El descalificador, en el margen. Es donde un técnico
                    anota lo que el aparato NO mide, y es lo que separa una
                    página de servicio de un folleto. Sale del campo notFor,
                    que el repo obliga a mantener sincero. */}
                {service.notFor[0] ? (
                  <div className="margin-row">
                    <span className="margin-key">
                      {en ? 'not a fit' : 'no aplica'}
                    </span>
                    <span className="margin-prose">{service.notFor[0]}</span>
                  </div>
                ) : null}
              </aside>
            </div>
          </section>

          {/* ═══ CONTEXTO ════════════════════════════════════════
              El único bloque de la página escrito en primera persona, y por
              eso el único en serif. Es ~3% del tipo del sitio; gastarlo en
              otra parte lo devaluaría. */}
          <section className="border-t border-hairline px-5 pb-24 pt-14 sm:px-10">
            <p className="stamp">{en ? 'context' : 'contexto'}</p>
            <h2 className="mt-5 max-w-[16ch] text-d1 text-ink">
              {t('whyTitle')}
            </h2>

            <div className="reveal mt-10 max-w-[58ch] space-y-6 font-human text-ink-muted">
              <p>
                {en
                  ? 'Every web project I build starts with the same question: what does Google need to see, and what does the user need to do? The answer shapes everything — rendering strategy, data fetching, URL structure, component architecture.'
                  : 'Cada proyecto web que construyo empieza con la misma pregunta: ¿qué necesita ver Google, y qué necesita hacer el usuario? La respuesta define todo — estrategia de renderizado, data fetching, estructura de URLs, arquitectura de componentes.'}
              </p>
              <p>
                {en
                  ? 'I use Next.js because it lets me choose SSR, SSG or ISR per page — the right rendering strategy for each kind of content. Combined with Firebase for the database, authentication and serverless functions, it is the stack that gives the most value per engineering hour instead of the most lines of code.'
                  : 'Uso Next.js porque me deja elegir SSR, SSG o ISR por página — la estrategia de renderizado correcta para cada tipo de contenido. Combinado con Firebase para base de datos, autenticación y funciones serverless, es el stack que da más valor por hora de ingeniería, no más líneas de código.'}
              </p>
              <p>
                {en
                  ? 'The part almost nobody quotes for is the migration: mapping the old URLs, deciding what earns a 301 and what is allowed to die, and revalidating structured data once the new site is live. If your site already has traffic, that work is the difference between a launch and a drop in positions that takes months to recover.'
                  : 'La parte que casi nadie cotiza es la migración: mapear las URLs viejas, decidir qué se redirige con 301 y qué se deja morir, y revalidar los datos estructurados una vez que el sitio nuevo está en producción. Si tu sitio ya tiene tráfico, ese trabajo es la diferencia entre un lanzamiento y una caída de posiciones que tarda meses en recuperarse.'}
              </p>
            </div>
          </section>

          {/* ═══ QUÉ CONSTRUYO ═══════════════════════════════════
              Antes: carrusel con flechas, puntos y tarjetas numeradas 01–03.
              Ahora: filas. Lo que se construye no es una secuencia, así que
              no lleva número. */}
          <section className="border-t border-hairline px-5 pb-24 pt-14 sm:px-10">
            <p className="stamp">{ts('benefits')}</p>
            <h2 className="mt-5 max-w-[18ch] text-d1 text-ink">
              {t('whatTitle')}
            </h2>
            <p className="mt-6 max-w-[54ch] text-lead text-ink-muted">
              {service.headline}
            </p>

            <MediaSlot
              id="desarrollo-web-evidencia"
              className="mt-12 w-full max-w-3xl"
              sizes="(min-width: 768px) 48rem, 100vw"
            />

            <ul className="reveal-stagger mt-12">
              {service.benefits.map((benefit) => (
                <li key={benefit} className="band text-ink">
                  {benefit}
                </li>
              ))}
            </ul>

            {/* Resultados, no características: qué es medible diferente
                después. Misma fila, mismo peso — la promesa y la evidencia
                se leen en el mismo registro. */}
            <p className="stamp mt-16">{en ? 'afterwards' : 'después'}</p>
            <h3 className="mt-5 max-w-[20ch] text-d2 text-ink">
              {en ? 'What is different afterwards' : 'Qué cambia después'}
            </h3>
            <ul className="reveal-stagger mt-8">
              {service.outcomes.map((outcome) => (
                <li key={outcome} className="band max-w-[68ch] text-ink-muted">
                  {outcome}
                </li>
              ))}
            </ul>
          </section>

          {/* ═══ FASES ═══════════════════════════════════════════
              Esto SÍ es una secuencia real —una fase no puede correr antes
              que la anterior—, así que aquí el número es un dato y no un
              adorno. Se imprime como posición sobre el total. */}
          <section className="border-t border-hairline px-5 pb-24 pt-14 sm:px-10">
            <p className="stamp">{ts('process')}</p>
            <h2 className="mt-5 max-w-[20ch] text-d1 text-ink">
              {en
                ? 'How a build runs, phase by phase'
                : 'Cómo corre el proyecto, fase por fase'}
            </h2>

            <ol className="reveal-stagger mt-12">
              {service.process.map((step, index) => (
                <li
                  key={step.title}
                  className="band grid gap-x-8 gap-y-3 sm:grid-cols-[5.5rem_minmax(0,1fr)]"
                >
                  <span className="stamp tabular-nums">
                    {String(index + 1).padStart(2, '0')} /{' '}
                    {String(service.process.length).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-d3 text-ink">{step.title}</h3>
                    <p className="mt-2 max-w-[64ch] text-ink-muted">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* ═══ ENCAJE / NO ENCAJE ══════════════════════════════
              La segunda columna es el punto de esta sección: mismo tamaño de
              tipo, mismo ritmo, misma fila. Una limitación degradada
              visualmente deja de ser una limitación. Lo que separa las dos
              listas es la ETIQUETA, no un color ni un ícono. */}
          <section className="border-t border-hairline px-5 pb-24 pt-14 sm:px-10">
            <p className="stamp">{en ? 'fit' : 'encaje'}</p>
            <h2 className="mt-5 max-w-[18ch] text-d1 text-ink">
              {en
                ? 'Who this is for, and who it is not'
                : 'Para quién es esto, y para quién no'}
            </h2>
            <p className="mt-6 max-w-[58ch] text-lead text-ink-muted">
              {en
                ? 'The second list is the useful one. If you recognise yourself there, I will say so on the first call instead of writing you a proposal.'
                : 'La segunda lista es la útil. Si te reconoces ahí, te lo digo en la primera llamada en lugar de mandarte una propuesta.'}
            </p>

            <div className="mt-14 grid gap-x-12 gap-y-14 lg:grid-cols-2">
              <div className="min-w-0">
                <p className="stamp">{en ? 'good fit' : 'sí encaja'}</p>
                <h3 className="mt-4 text-d2 text-ink">
                  {en ? 'Who this is for' : 'Para quién es'}
                </h3>
                <ul className="reveal-stagger mt-6">
                  {service.forWhom.map((item) => (
                    <li key={item} className="band text-ink-muted">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="min-w-0">
                <p className="stamp">{en ? 'not a fit' : 'no encaja'}</p>
                <h3 className="mt-4 text-d2 text-ink">
                  {en ? 'Who this is not for' : 'Para quién no es'}
                </h3>
                <ul className="reveal-stagger mt-6">
                  {service.notFor.map((item) => (
                    <li key={item} className="band text-ink-muted">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ═══ ENTREGABLES ═════════════════════════════════════ */}
          <section className="border-t border-hairline px-5 pb-24 pt-14 sm:px-10">
            <p className="stamp">{ts('includes')}</p>
            <h2 className="mt-5 max-w-[16ch] text-d1 text-ink">
              {t('deliverablesTitle')}
            </h2>
            <p className="mt-6 max-w-[58ch] text-lead text-ink-muted">
              {en
                ? 'Every engagement ships all of it. Anything outside the list is quoted before it gets built.'
                : 'Todo proyecto entrega esto completo. Lo que quede fuera de la lista se cotiza antes de construirlo.'}
            </p>

            <ul className="reveal-stagger mt-12 grid gap-x-12 sm:grid-cols-2">
              {service.includes.map((item) => (
                <li key={item} className="band text-ink-muted">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* ═══ LA CINTA DEL STACK ══════════════════════════════
              Dos carriles en direcciones opuestas. El cruce es lo que da
              profundidad —dos planos moviéndose distinto— sin una sombra y
              sin una caja. El pie dice en qué orden viajan los nombres, así
              que la agrupación no se pierde y no se repite. */}
          <section
            className="overflow-hidden border-t border-hairline pb-20 pt-11"
            aria-labelledby="stack-heading"
          >
            <div className="px-5 sm:px-10">
              <p className="stamp">{t('toolsTitle')}</p>
              <h2
                id="stack-heading"
                className="mt-5 max-w-[18ch] text-d1 text-ink"
              >
                {en ? 'The stack this runs on' : 'El stack con el que corre'}
              </h2>
            </div>

            <div className="mt-10">
              <Ribbon
                items={stack.slice(0, Math.ceil(stack.length / 2))}
                label={en ? 'Stack and tools' : 'Stack y herramientas'}
              />
              <div className="mt-3">
                {/* EL ARRAY SE REPARTE entre los dos carriles. Los dos
                    recibían el MISMO, y `Ribbon` además duplica su contenido
                    internamente para cerrar el bucle: cada etiqueta salía
                    CUATRO veces en el HTML servido. Es el defecto que la
                    portada ya tenía documentado como corregido y que seguía
                    vivo en cuatro páginas. Repartido sale dos veces (la copia
                    del bucle) y los dos carriles siguen a distinta velocidad,
                    porque `reverse` no cambia. */}
                <Ribbon
                  items={stack.slice(Math.ceil(stack.length / 2))}
                  label={en ? 'Stack, second rail' : 'Stack, segundo carril'}
                  reverse
                />
              </div>
            </div>

            <p className="stamp mt-8 px-5 sm:px-10">
              {en ? 'in order · ' : 'en orden · '}
              {stackLegend}
            </p>
          </section>

          {/* ═══ ÍNDICE ══════════════════════════════════════════
              <details> nativo: las respuestas están en el HTML del servidor,
              que es exactamente lo que declara el markup FAQPage de arriba.
              Sin JavaScript y sin panel. */}
          <section className="border-t border-hairline px-5 pb-24 pt-14 sm:px-10">
            <p className="stamp">FAQ</p>
            <h2 className="mt-5 max-w-[16ch] text-d1 text-ink">
              {t('faqTitle')}
            </h2>
            <p className="mt-6 max-w-[52ch] text-ink-muted">
              {en
                ? 'What people ask before starting a build.'
                : 'Lo que me preguntan antes de arrancar un desarrollo.'}
            </p>

            <div className="mt-10">
              {service.faq.map((item) => (
                <details key={item.question} className="band group">
                  <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 text-ink marker:hidden">
                    <span>{item.question}</span>
                    <span
                      aria-hidden="true"
                      className="stamp shrink-0 transition-transform duration-150 group-open:rotate-45"
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

          {/* ═══ CANALES VECINOS ═════════════════════════════════
              La única placa despejada de la página: el material se invierte
              entero para el paso a los otros servicios. Los servicios son
              canales PARALELOS del registrador —a–d salen del catálogo—, no
              una secuencia 01/02/03. */}
          <section className="plate px-5 py-20 sm:px-10">
            <p className="stamp">{ts('eyebrow')}</p>
            <h2 className="mt-5 max-w-[18ch] text-d1">{t('relatedTitle')}</h2>
            <p className="mt-6 max-w-[52ch] text-lead">
              {en
                ? 'A build almost always travels with one of these two.'
                : 'Un desarrollo casi siempre viaja con uno de estos dos.'}
            </p>

            <ul className="mt-12">
              {related.map(({ item, index }) => (
                <li key={item.id}>
                  <Link
                    href={servicePath(item, locale) as StaticPathname}
                    className="channel group"
                  >
                    <span className="channel-id">
                      ch {String.fromCharCode(97 + index)}
                    </span>
                    <span>
                      <span className="text-d3">{item.title}</span>
                      <span className="channel-note mt-1 block max-w-[52ch] text-sm">
                        {item.headline}
                      </span>
                      {/* La pluma: al pasar el puntero, una línea se escribe
                          de izquierda a derecha bajo la fila. No hay caja que
                          se encienda — avanza el trazo. */}
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

            {/* Dentro de la placa el enlace NO puede ser `.link-stylus`: esa
                clase pinta en papel y aquí el fondo es papel. Hereda el
                hollín de la placa y se subraya. */}
            <p className="mt-12 max-w-[52ch]">
              {en ? 'Or review ' : 'O revisa '}
              <Link
                href="/servicios"
                className="underline decoration-1 underline-offset-4"
              >
                {en
                  ? 'all four services and how they combine'
                  : 'los cuatro servicios y cómo se combinan'}
              </Link>
              {en ? ' before deciding.' : ' antes de decidir.'}
            </p>
          </section>

          {/* ═══ LA PRUEBA, PENDIENTE DE ARCHIVO ═════════════════
              Los dos huecos de imagen de este servicio, con su ruta exacta
              escrita. Mientras el archivo no exista es un RENGLÓN —qué falta,
              a qué ruta, de qué tamaño— y no una caja de cuatrocientos
              píxeles de nada. El mismo dato genera docs/MEDIA.md, así que la
              lista que se entrega y lo que pinta la página no pueden
              contradecirse. */}
          {/* La sección entera se omite si no hay NI UN archivo. Su rótulo
              dice «la prueba · pendiente de archivo», así que sin archivos era
              un encabezado anunciando lo que falta encima de una rejilla vacía.
              Un `<MediaSlot>` sabe que no tiene archivo pero no puede borrar a
              su padre; `anySlotFilled` sí. Cuando llegue una captura real, la
              sección reaparece sola. */}
          {anySlotFilled('desarrollo-web-lighthouse', 'desarrollo-web-codigo') ? (
            <section className="border-t border-hairline px-5 pb-20 pt-11 sm:px-10">
              <p className="stamp">
                {en
                  ? 'the proof · file pending'
                  : 'la prueba · pendiente de archivo'}
              </p>
              <div className="mt-8 grid gap-x-14 gap-y-4 lg:grid-cols-2">
                <MediaSlot
                  id="desarrollo-web-lighthouse"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
                <MediaSlot
                  id="desarrollo-web-codigo"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
              </div>
            </section>
          ) : null}

          {/* ═══ LOS TRES CANALES ════════════════════════════════
              La misma banda de la portada de contacto, con el mensaje de
              WhatsApp de ESTA página: quien escribe desde aquí llega con el
              tema ya nombrado y no hay que interrogarlo. Cada canal degrada
              solo si no está configurado. */}
          {/* ── DEL REGISTRO ──
              Los artículos del blog que tratan de esto. Es la mitad del
              enlazado interno que faltaba: antes esta página, con prioridad
              0.9 en el sitemap, no enlazaba a ni un artículo. Se pinta sola
              solo si hay algo publicado que encaje. */}
          <BlogStrip route="desarrolloWeb" locale={locale} title="Escrito sobre desarrollo" />

          <section className="border-t border-hairline px-5 pb-24 pt-14 sm:px-10">
            <ContactChannels
              locale={locale}
              waMessage={
                en
                  ? 'Hi Carlos — I came from your web development page. What I want to build is '
                  : 'Hola Carlos, vengo de tu página de desarrollo web. Lo que quiero construir es '
              }
            />
          </section>

          {/* ═══ CIERRE ══════════════════════════════════════════ */}
          <section className="border-t border-hairline px-5 pb-28 pt-16 sm:px-10">
            <h2 className="max-w-[18ch] text-d1 text-ink">
              {en
                ? 'Tell me what you need to build.'
                : 'Cuéntame qué necesitas construir.'}
            </h2>
            <p className="mt-6 max-w-[54ch] text-lead text-ink-muted">
              {en
                ? 'Send the URL, the stack you are on today, and what has to be live by when. I reply in under 24 hours.'
                : 'Mándame la URL, el stack en el que estás hoy y qué tiene que estar en producción y para cuándo. Respondo en menos de 24 horas.'}
            </p>

            <p className="mt-10 flex flex-wrap items-baseline gap-x-8 gap-y-3">
              <Link className="link-stylus text-d3" href="/contacto">
                {t('ctaMain')} →
              </Link>
              <Link className="link-stylus" href="/servicios">
                {t('ctaSecondary')} →
              </Link>
            </p>

            <p className="mt-10 max-w-[54ch] text-ink-muted">
              {t('ctaNote')}{' '}
              <a className="link-stylus" href={`mailto:${NAP.email}`}>
                {NAP.email}
              </a>
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
