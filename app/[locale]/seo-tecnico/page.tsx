import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Rail } from '@/components/instrument/rail'
import { Pens } from '@/components/instrument/pens'
import { ContactChannels } from '@/components/sections/contact-channels'
import { Ribbon } from '@/components/instrument/ribbon'
import { MediaSlot } from '@/components/instrument/media-slot'
import { getServiceById } from '@/data/services'
import { NAP } from '@/lib/constants'
import { generatePageMetadata } from '@/lib/seo'
import { generateServicePageGraph } from '@/lib/schema'
import { Locale } from '@/data/types'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const en = locale === 'en'

  return generatePageMetadata({
    locale: locale as Locale,
    route: 'seoTecnico',
    // Se lee como resultado de búsqueda, no como eslogan, y no comparte
    // fraseo con el título de la home (que abre con la marca personal en
    // lugar del servicio).
    title: en
      ? 'Technical SEO Audits & Consulting'
      : 'Auditoría de SEO técnico en México',
    description: en
      ? 'Technical SEO audits from Mexico City: indexation, Schema.org JSON-LD, Core Web Vitals, hreflang and Next.js migrations. Findings ranked by impact.'
      : 'Auditoría de SEO técnico desde Ciudad de México: indexación, Schema.org JSON-LD, Core Web Vitals, hreflang y migraciones a Next.js sin perder tráfico.',
  })
}

/**
 * ════════════════════════════════════════════════════════════════
 * SEO TÉCNICO — «Papel Ahumado»
 *
 * La página comercial más importante del sitio, y por eso es la que se lleva
 * LA PLACA: el bloque de entregables se imprime sobre papel, invertido, una
 * sola vez en toda la página. Es el único momento en que la aguja despeja el
 * hollín, así que tiene que caer donde está la oferta.
 *
 * Lo que se fue, y por qué:
 *   · aurora + grano + cuadrícula + resplandor de puntero → el material ya no
 *     es cristal: es papel ahumado, y no hay nada saturado que difuminar.
 *   · `.scene` / `.stack-3d` / `.depth-*` / `.tilt-hover` → la perspectiva
 *     contradice una hoja plana corriendo bajo una pluma.
 *   · `<Carousel>` con flechas y puntos → el carrusel de este mundo es la
 *     cinta que corre y no para (`<Ribbon>`), y lleva las herramientas.
 *   · `.card`, `.glass`, `<Badge>`, `<ImageSlot>`, iconos en cuadros → cajas.
 *     Todo su contenido sobrevive; solo se cayó el envoltorio.
 *
 * El instrumento en vivo (`Needle`, `Marks`, `BudgetRule`) NO se duplica
 * aquí: es exclusivo de la home. Repetirlo lo volvería decoración.
 * ════════════════════════════════════════════════════════════════
 */
export default async function SeoTecnicoPage({ params }: Props) {
  const { locale: rawLocale } = await params
  setRequestLocale(rawLocale)

  const locale = rawLocale as Locale
  const en = locale === 'en'

  // La página y su JSON-LD leen de UN solo registro, así que el texto
  // renderizado y los datos estructurados no pueden separarse.
  const service = getServiceById(locale, 'seo-tecnico')
  if (!service) notFound()

  const t = await getTranslations('servicePages.seoTecnico')
  const tn = await getTranslations('nav')
  // La misma clave del catálogo que usa el componente Breadcrumbs para su
  // propia miga de Inicio, así el markup no puede separarse de la etiqueta
  // visible.
  const tb = await getTranslations('breadcrumbs')
  const ts = await getTranslations('services')

  /**
   * Etiqueta corta de la ruta, compartida por la miga visible y por el nodo
   * BreadcrumbList de abajo. Una constante, así las dos nunca discrepan.
   */
  const crumbLabel = en ? 'Technical SEO' : 'SEO Técnico'

  /**
   * Las herramientas que de verdad se usan en un proyecto. Se nombran porque
   * "metodología propia" no es un entregable: el cliente tiene que poder
   * reproducir cada hallazgo con las mismas herramientas.
   *
   * Diez nombres cortos: exactamente el material de una cinta que corre, y no
   * algo que nadie va a leer renglón por renglón en una rejilla de chips.
   */
  const tools = [
    'Google Search Console',
    'Rich Results Test',
    'Schema Markup Validator',
    'Lighthouse',
    'PageSpeed Insights',
    'Chrome UX Report',
    'Screaming Frog',
    'Chrome DevTools',
    'Next.js',
    'Vercel Analytics',
  ]

  /**
   * Páginas hermanas de servicio. Los títulos salen de los registros en lugar
   * de reescribirse aquí, así el texto del enlace se mantiene descriptivo y
   * sincronizado.
   */
  const related = (
    [
      ['/desarrollo-web', getServiceById(locale, 'nextjs-firebase')],
      ['/dashboards', getServiceById(locale, 'dashboards')],
    ] as const
  ).flatMap(([href, sibling]) =>
    sibling
      ? [
          {
            href,
            title: sibling.title,
            headline: sibling.headline,
          },
        ]
      : []
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateServicePageGraph(
              locale,
              service,
              // Refleja exactamente la ruta visible, Inicio incluido: el
              // componente renderiza esa miga por su cuenta, el markup tiene
              // que declararla.
              [
                { name: tb('home'), route: 'home' },
                { name: tn('services'), route: 'services' },
                { name: crumbLabel, route: 'seoTecnico' },
              ],
              // Las preguntas de este servicio, no el FAQ del sitio: dos URLs
              // respondiendo la misma consulta compiten entre sí.
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
              El titular es el LCP y se pinta del servidor: ni una capa
              decorativa por delante, ni una secuencia de entrada que
              esperar. */}
          <section className="hero-in relative px-5 pb-16 pt-16 sm:px-10">
            {/* ── LA HOJA TIENE DOS MÁRGENES ──
                El texto a la izquierda, la lectura del operador a la
                derecha. Por debajo de 80rem el margen cae al flujo y su
                regla se vuelve horizontal: no hay dos columnas donde no
                caben dos columnas. */}
            <div className="ledger">
              <div className="min-w-0">
                <p className="stamp">
                  {en
                    ? 'Technical SEO · Mexico City'
                    : 'SEO Técnico · Ciudad de México'}
                </p>

                <h1 className="mt-6 max-w-[14ch] text-hero text-ink">
                  {t('title')}
                </h1>

                <p className="mt-10 max-w-[46ch] font-human text-lead text-ink-muted">
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

                <p className="mt-8 max-w-[48ch] text-sm text-ink-subtle">
                  {en
                    ? `Based in ${NAP.localityEn}. Remote work with teams in any time zone.`
                    : `Con base en ${NAP.locality}. Trabajo remoto con equipos en cualquier zona horaria.`}
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

          {/* ═══ EL PROBLEMA ═════════════════════════════════════ */}
          <section className="border-t border-hairline px-5 py-20 sm:px-10">
            <p className="stamp">{en ? 'the problem' : 'el problema'}</p>
            <h2 className="mt-5 max-w-[16ch] text-d1 text-ink">
              {t('whyTitle')}
            </h2>

            <div className="reveal mt-10 max-w-[64ch] space-y-6 text-ink-muted">
              <p>
                {en
                  ? 'A beautiful site that Google cannot crawl, understand, or index is invisible. Technical SEO is the engineering layer that makes a search engine — and now a language model — see your content the way a person does: fast, structured, and unambiguous.'
                  : 'Un sitio bonito que Google no puede rastrear, entender ni indexar es invisible. El SEO técnico es la capa de ingeniería que hace que un buscador —y hoy también un modelo de lenguaje— vea tu contenido como lo ve una persona: rápido, estructurado y sin ambigüedad.'}
              </p>
              <p>
                {en
                  ? 'I have seen migrations drop a site’s organic traffic because nobody mapped the old URLs before shipping. I have audited platforms where half a template was blocked in robots.txt for months and nobody noticed, because the site looked perfect in a browser. These are engineering defects, so I look for them the way an engineer would: in the repository, in the response headers, and in the HTML that is actually served — not against a generic checklist.'
                  : 'He visto migraciones tirar el tráfico orgánico de un sitio porque nadie mapeó las URLs viejas antes de desplegar. He auditado plataformas donde media plantilla llevaba meses bloqueada en robots.txt y nadie lo había notado, porque el sitio se veía perfecto desde el navegador. Son defectos de ingeniería, así que los busco como ingeniero: en el repositorio, en los encabezados de respuesta y en el HTML que de verdad se sirve — no contra un checklist genérico.'}
              </p>
              {/* Única frase de la página en la voz humana: es la que admite
                  que a veces la respuesta correcta es no vender nada. */}
              <p className="font-human text-lead">
                {en
                  ? 'It is also why this work does not always end in an audit. If the diagnosis points at content or at authority rather than at the stack, I say so on the first call. That is cheaper for both of us than a deliverable that was never going to move anything.'
                  : 'También es la razón por la que este trabajo no siempre termina en una auditoría. Si el diagnóstico apunta a contenido o a autoridad y no al stack, lo digo en la primera llamada. Sale más barato para los dos que un entregable que nunca iba a mover nada.'}
              </p>
            </div>
          </section>

          {/* ═══ ALCANCE ═════════════════════════════════════════
              Lo que antes era un riel de tarjetas con inclinación 3D es una
              lista de bandas: un alcance es un registro de renglones, no una
              baraja que hay que arrastrar para leer completa. */}
          <section className="border-t border-hairline px-5 py-20 sm:px-10">
            <p className="stamp">{en ? 'scope' : 'alcance'}</p>
            <h2 className="mt-5 max-w-[16ch] text-d1 text-ink">
              {t('whatTitle')}
            </h2>
            <p className="mt-6 max-w-[52ch] text-lead text-ink-muted">
              {service.headline}
            </p>

            <ul className="reveal-stagger mt-12">
              {service.benefits.map((benefit) => (
                <li key={benefit} className="band">
                  <span className="text-d3 text-ink">{benefit}</span>
                </li>
              ))}
            </ul>

            <h3 className="mt-16 text-d2 text-ink">
              {en ? 'What changes afterwards' : 'Qué cambia después'}
            </h3>
            <ul className="reveal-stagger mt-8">
              {service.outcomes.map((outcome) => (
                <li key={outcome} className="band max-w-[64ch] text-ink-muted">
                  {outcome}
                </li>
              ))}
            </ul>

            {/* La prueba del servicio va justo debajo de lo que promete:
                una curva real de Core Web Vitals con el eje de tiempo a la
                vista. Mientras el archivo no exista, el hueco escribe su
                propia ruta. */}
            <MediaSlot
              id="seo-tecnico-evidencia"
              className="mt-12 w-full max-w-3xl"
            />
          </section>

          {/* ═══ PROCESO ═════════════════════════════════════════
              Aquí la numeración SÍ es legítima: cuatro fases en orden, y la
              tercera no puede correr antes que la segunda. La cifra va en
              mono, seca, sin píldora y sin gradiente. */}
          <section className="border-t border-hairline px-5 py-20 sm:px-10">
            <p className="stamp">{ts('process')}</p>
            <h2 className="mt-5 max-w-[18ch] text-d1 text-ink">
              {en ? 'How the work runs' : 'Cómo se ejecuta el trabajo'}
            </h2>

            <ol className="reveal-stagger mt-12">
              {service.process.map((step, index) => (
                <li key={step.title} className="band">
                  <div className="grid gap-x-6 gap-y-2 sm:grid-cols-[5rem_minmax(0,1fr)]">
                    <span className="stamp tabular-nums sm:pt-1.5">
                      {en ? 'phase' : 'fase'} {index + 1}/
                      {service.process.length}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-d3 text-ink">{step.title}</h3>
                      <p className="mt-2 max-w-[62ch] text-ink-muted">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* ═══ SÍ ENCAJA / NO ENCAJA ═══════════════════════════
              Mismo ancho, mismo peso tipográfico y el mismo ritmo, a
              propósito. Las limitaciones declaradas son el diferenciador de
              esta página: degradarlas visualmente o suavizarlas en línea de
              venta anula el motivo por el que están escritas. Lo que separa
              las dos listas es la ETIQUETA, nunca el color. */}
          <section className="border-t border-hairline px-5 py-20 sm:px-10">
            <p className="stamp">
              {en ? 'good fit · not a fit' : 'sí encaja · no encaja'}
            </p>
            <h2 className="mt-5 max-w-[20ch] text-d1 text-ink">
              {en
                ? 'Who this is for, and who it is not'
                : 'Para quién es y para quién no'}
            </h2>

            <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="min-w-0">
                <h3 className="text-d2 text-ink">
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
                <h3 className="text-d2 text-ink">
                  {en ? 'Who this is not for' : 'Para quién no es'}
                </h3>
                <ul className="reveal-stagger mt-6">
                  {service.notFor.map((item) => (
                    <li key={item} className="band text-ink-muted">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-8 max-w-[52ch] text-sm text-ink-subtle">
                  {en
                    ? 'If one of those describes your situation, say so in the first message and we save each other a proposal.'
                    : 'Si algo de eso describe tu situación, dímelo en el primer mensaje y nos ahorramos una propuesta.'}
                </p>
              </div>
            </div>
          </section>

          {/* ═══ QUÉ RECIBES — LA PLACA ══════════════════════════
              La única sección invertida de la página, y la más importante
              comercialmente: es la oferta. El papel se despeja entero y los
              entregables quedan impresos en hollín sobre él.

              Dentro de la placa la tinta secundaria NO puede ser
              `text-ink-muted` (está calibrada contra hollín): va
              `text-ink-plate`, que es el token medido para superficie clara.
              Y las reglas de las bandas se corren a `border-soot/20`, porque
              `--hairline` es una línea clara pensada para fondo oscuro. */}
          <section className="plate relative px-5 py-20 sm:px-10">
            <p className="stamp">{ts('includes')}</p>
            <h2 className="mt-5 max-w-[16ch] text-d1">
              {t('deliverablesTitle')}
            </h2>
            <p className="mt-6 max-w-[52ch] text-lead text-ink-plate">
              {en
                ? 'Written, versioned, and yours to keep — including the reasoning behind each recommendation.'
                : 'Por escrito, versionado y tuyo — incluido el razonamiento detrás de cada recomendación.'}
            </p>

            <ul className="reveal-stagger mt-12 max-w-[64ch]">
              {service.includes.map((item) => (
                <li key={item} className="band border-soot/20">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* ═══ HERRAMIENTAS — LA CINTA ═════════════════════════
              Diez nombres cortos que corren y no paran. Dos carriles en
              direcciones opuestas: el cruce es lo que da profundidad, sin
              una sola sombra y sin un solo chip. */}
          <section
            className="overflow-hidden border-t border-hairline px-0 py-16"
            aria-labelledby="tools-heading"
          >
            <div className="px-5 sm:px-10">
              <p className="stamp">reproducible</p>
              <h2
                id="tools-heading"
                className="mt-5 max-w-[16ch] text-d1 text-ink"
              >
                {t('toolsTitle')}
              </h2>
            </div>

            <div className="mt-10">
              <Ribbon items={tools} label={t('toolsTitle')} />
              <div className="mt-3">
                <Ribbon
                  items={tools}
                  label={`${t('toolsTitle')} — ${en ? 'second rail' : 'segundo carril'}`}
                  reverse
                />
              </div>
            </div>

            <p className="mt-10 max-w-[68ch] px-5 text-ink-muted sm:px-10">
              {en
                ? 'Standard tooling, named on purpose: every finding in the report can be reproduced by your team with the same tools, without taking my word for it.'
                : 'Herramientas estándar, y las nombro a propósito: cualquier hallazgo del reporte lo puede reproducir tu equipo con las mismas herramientas, sin tener que creerme.'}
            </p>
          </section>

          {/* ═══ FAQ ═════════════════════════════════════════════
              <details> nativo: sin JS, y la respuesta está en el HTML del
              servidor abierta o cerrada, así que un crawler la lee completa.
              Se renderiza del MISMO arreglo con el que se construye el nodo
              FAQPage de arriba. */}
          <section className="border-t border-hairline px-5 py-20 sm:px-10">
            <p className="stamp">FAQ</p>
            <h2 className="mt-5 max-w-[16ch] text-d1 text-ink">
              {t('faqTitle')}
            </h2>

            <div className="mt-10 max-w-[72ch]">
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

          {/* ═══ SERVICIOS RELACIONADOS ══════════════════════════
              Canales, no tarjetas: al pasar el puntero avanza el trazo de la
              pluma bajo la fila. `border-hairline` es obligatorio aquí —
              `.channel` hereda `currentColor` en el borde, y eso solo está
              resuelto dentro de la placa. */}
          <section className="border-t border-hairline px-5 py-20 sm:px-10">
            <p className="stamp">{ts('eyebrow')}</p>
            <h2 className="mt-5 max-w-[16ch] text-d1 text-ink">
              {t('relatedTitle')}
            </h2>
            <p className="mt-6 max-w-[56ch] text-lead text-ink-muted">
              {en
                ? 'Technical SEO usually arrives with a build or a measurement problem attached. These two are where that work continues.'
                : 'El SEO técnico casi nunca llega solo: suele venir con un desarrollo o una medición pendiente. Estos dos servicios son donde continúa ese trabajo.'}
            </p>

            <ul className="mt-12">
              {related.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="channel group border-hairline text-ink"
                  >
                    <span className="channel-id" aria-hidden="true">
                      —
                    </span>
                    <span>
                      <span className="text-d3">{item.title}</span>
                      <span className="channel-note mt-1 block max-w-[52ch] text-sm text-ink-muted">
                        {item.headline}
                      </span>
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

            <p className="mt-10 max-w-[62ch] text-ink-muted">
              {en ? 'Or compare ' : 'O compara '}
              <Link href="/servicios" className="link-stylus">
                {en
                  ? 'the four services side by side'
                  : 'los cuatro servicios uno al lado del otro'}
              </Link>
              {en
                ? ' before deciding where to start.'
                : ' antes de decidir por dónde empezar.'}
            </p>
          </section>

          {/* ═══ LA PRUEBA, PENDIENTE DE ARCHIVO ═════════════════
              Los dos huecos de imagen de este servicio, con su ruta exacta
              escrita. Mientras el archivo no exista es un RENGLÓN —qué falta,
              a qué ruta, de qué tamaño— y no una caja de cuatrocientos
              píxeles de nada. El mismo dato genera docs/MEDIA.md, así que la
              lista que se entrega y lo que pinta la página no pueden
              contradecirse. */}
          <section className="border-t border-hairline px-5 py-16 sm:px-10">
            <p className="stamp">
              {en
                ? 'the proof · file pending'
                : 'la prueba · pendiente de archivo'}
            </p>
            <div className="mt-8 grid gap-x-14 gap-y-4 lg:grid-cols-2">
              <MediaSlot
                id="seo-tecnico-proceso"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
              <MediaSlot
                id="seo-tecnico-schema"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            </div>
          </section>

          {/* ═══ LOS TRES CANALES ════════════════════════════════
              La misma banda de la portada de contacto, con el mensaje de
              WhatsApp de ESTA página: quien escribe desde aquí llega con el
              tema ya nombrado y no hay que interrogarlo. Cada canal degrada
              solo si no está configurado. */}
          <section className="border-t border-hairline px-5 py-20 sm:px-10">
            <ContactChannels
              locale={locale}
              waMessage={
                en
                  ? 'Hi Carlos — I came from your technical SEO page. My site is '
                  : 'Hola Carlos, vengo de tu página de SEO técnico. Mi sitio es '
              }
            />
          </section>

          {/* ═══ CIERRE ══════════════════════════════════════════ */}
          <section className="border-t border-hairline px-5 py-24 sm:px-10">
            <h2 className="max-w-[18ch] text-d1 text-ink">
              {en
                ? 'Send me the URL and what changed.'
                : 'Mándame la URL y qué cambió.'}
            </h2>
            <p className="mt-6 max-w-[56ch] text-lead text-ink-muted">
              {en
                ? 'Search Console access helps, but it is not required to start. I reply with a first read on what is likely going on and whether an audit is even the right next step.'
                : 'Ayuda tener acceso a Search Console, pero no es requisito para empezar. Te respondo con una primera lectura de lo que probablemente está pasando y si una auditoría es siquiera el siguiente paso correcto.'}
            </p>

            <p className="mt-10 flex flex-wrap items-baseline gap-x-8 gap-y-3">
              <Link className="link-stylus text-d3" href="/contacto">
                {t('ctaSecondary')} →
              </Link>
              <a className="link-stylus font-mono" href={`mailto:${NAP.email}`}>
                {NAP.email}
              </a>
            </p>

            <p className="mt-8 max-w-[48ch] text-sm text-ink-subtle">
              {t('ctaNote')}
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
