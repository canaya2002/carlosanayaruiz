import type { Metadata } from 'next'
import { routing } from '@/i18n/routing'
import { hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Rail } from '@/components/instrument/rail'
import { ReviewForm } from '@/components/sections/review-form'
import {
  getReviewCopy,
  isRevisionOpen,
  REVISION_GUIA_SLUG,
  REVISION_VIGENCIA,
} from '@/data/revision-ficha'
import { getPostBySlug, isPublished } from '@/lib/blog'
import { isNewsletterConfigured } from '@/lib/newsletter'
import { NAP } from '@/lib/constants'
import { generatePageMetadata } from '@/lib/seo'
import { generateRevisionFichaGraph } from '@/lib/schema'
import { Locale } from '@/data/types'

/**
 * ════════════════════════════════════════════════════════════════
 * LA REVISIÓN GRATIS DE TU FICHA DE GOOGLE
 *
 * Extiende «Papel Ahumado», no lo rediseña: el riel, la hoja con su margen
 * de anotación, filas `.band`, la placa una sola vez y el índice nativo.
 * Ningún color ni cara nuevos.
 *
 * ── DOS COSAS DEPENDEN DEL RELOJ, Y POR ESO HAY `revalidate` ──
 *   · La VIGENCIA. A partir del 01/12/2026 00:00 en CDMX el formulario se
 *     retira y queda el texto de cierre del copy. La Server Action lo
 *     comprueba también, así que la ventana de la regeneración no deja pasar
 *     solicitudes.
 *   · El ENLACE A LA GUÍA. El artículo de Google Business Profile sale el
 *     03/12/2026 y antes da 404. El enlace solo se pinta cuando `isPublished`
 *     dice que ya salió — la misma comprobación que decide el 404 del
 *     artículo—, así que nunca apunta a una página que no existe.
 *
 * 900 s es el mismo intervalo que el blog: el enlace aparece a lo sumo
 * quince minutos después que el artículo.
 * ════════════════════════════════════════════════════════════════
 */
export const revalidate = 900

/** Fecha real de publicación de esta página. Alimenta el JSON-LD. */
const PUBLICADA = '2026-10-27'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  const copy = getReviewCopy(locale as Locale)

  /* `absoluteTitle`: el título del copy ya trae la marca, y la plantilla la
     añadiría otra vez. */
  return generatePageMetadata({
    locale: locale as Locale,
    route: 'revisionFicha',
    title: copy.metaTitle,
    absoluteTitle: true,
    description: copy.metaDescription,
  })
}

export default async function RevisionFichaPage({ params }: Props) {
  const { locale: rawLocale } = await params
  if (!hasLocale(routing.locales, rawLocale)) notFound()
  setRequestLocale(rawLocale)

  const locale = rawLocale as Locale
  const en = locale === 'en'
  const copy = getReviewCopy(locale)
  const abierta = isRevisionOpen()

  /* Las dos cifras de la oferta salen de UN solo sitio y se pintan dos
     veces: junto al botón, arriba, y en el margen. La fecha se deriva de
     `REVISION_VIGENCIA` —la misma que alimenta el `validThrough` del
     JSON-LD— en vez de escribirla a mano, así las tres no pueden
     desmentirse. */
  const [vy, vm, vd] = REVISION_VIGENCIA.split('-')
  const vigencia = en ? `${vm}/${vd}/${vy}` : `${vd}/${vm}/${vy}`
  const plazoDias = 3

  const guia = getPostBySlug(REVISION_GUIA_SLUG)
  const guiaPublicada = guia && isPublished(guia) ? guia : undefined

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateRevisionFichaGraph(locale, copy.faqs, {
              name: copy.h1,
              description: copy.metaDescription,
              validThrough: REVISION_VIGENCIA,
              datePublished: PUBLICADA,
            })
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
              El titular a la izquierda y, en el margen, las tres cifras que
              deciden si vale la pena pedirla: cuánto tarda, hasta cuándo y
              qué llega. Son la LECTURA de la oferta, así que van donde una
              gráfica de registrador pone la lectura. */}
          <section className="hero-in px-5 pt-16 pb-20 sm:px-10">
            <div className="ledger">
              <div className="min-w-0">
                <p className="stamp">
                  {en ? 'google maps · mexico' : 'google maps · méxico'}
                </p>

                <h1 className="mt-6 max-w-[18ch] text-hero text-ink">
                  {copy.h1}
                </h1>

                <p className="mt-10 max-w-[46ch] font-human text-lead text-ink-muted">
                  {copy.subtitle}
                </p>

                {/* ── EL BOTÓN Y LA LECTURA DE LA OFERTA, JUNTOS ──
                    La vigencia y el plazo vivían solo en el margen, que por
                    debajo de 80rem cae DEBAJO del héroe: en un teléfono no
                    se veían sin hacer scroll. Ahora van en la línea del
                    botón, que es donde se decide. Sin cupo ni contador: la
                    oferta no tiene plazas, y una escasez inventada sería
                    exactamente lo que este sitio no hace. */}
                {abierta ? (
                  <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
                    <a className="btn-primary" href="#solicitud">
                      {copy.form.submit}
                      <span className="btn-arrow" aria-hidden="true">
                        ↓
                      </span>
                    </a>
                    {/* Cada par va entero: a 390 la línea partía en
                        «Plazo 3 / días hábiles», la cifra lejos de su
                        unidad. */}
                    <p className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[0.75rem] tracking-[0.08em] text-ink-muted tabular-nums">
                      <span className="whitespace-nowrap">
                        {copy.validityTitle}{' '}
                        <span className="text-ink">{vigencia}</span>
                        <span className="sr-only">,</span>
                      </span>
                      <span className="whitespace-nowrap">
                        {copy.termTitle}{' '}
                        <span className="text-ink">
                          {plazoDias} {en ? 'business days' : 'días hábiles'}
                        </span>
                      </span>
                    </p>
                  </div>
                ) : (
                  <p className="mt-10 max-w-[54ch] text-ink [overflow-wrap:anywhere]">
                    {copy.closed}
                  </p>
                )}
              </div>

              <aside className="margin margin-sticky">
                <div className="margin-row">
                  <span className="margin-key">{copy.termTitle}</span>
                  <span className="margin-read">
                    {plazoDias}
                    <span className="ml-1.5 text-[0.6875rem] tracking-[0.12em] text-ink-subtle">
                      {en ? 'business days' : 'días hábiles'}
                    </span>
                  </span>
                  <span className="margin-prose">{copy.term}</span>
                </div>

                <div className="margin-row">
                  <span className="margin-key">{copy.validityTitle}</span>
                  <span className="margin-read">{vigencia}</span>
                  <span className="margin-prose">{copy.validity}</span>
                </div>

                <div className="margin-row">
                  <span className="margin-key">{copy.receiveTitle}</span>
                  <span className="margin-prose">{copy.receive}</span>
                </div>
              </aside>
            </div>
          </section>

          {/* ═══ POR QUÉ VALE LA PENA ════════════════════════════ */}
          <section className="border-t border-hairline px-5 pb-24 pt-14 sm:px-10">
            <h2 className="max-w-[18ch] text-d1 text-ink">{copy.whyTitle}</h2>
            <ul className="reveal-stagger mt-10 max-w-[54rem]">
              {copy.why.map((item) => (
                <li key={item} className="band text-ink-muted">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* ═══ LA PLACA: QUÉ REVISO ════════════════════════════
              Siete puntos y sin numerar: no es una secuencia, es una lista de
              verificación — se revisan todos y en cualquier orden. */}
          <div className="plate">
            <section className="px-5 py-20 sm:px-10">
              <h2 className="max-w-[18ch] text-d1">{copy.checksTitle}</h2>
              <ul className="reveal-stagger mt-10 max-w-[54rem]">
                {copy.checks.map((item) => (
                  <li key={item} className="band">
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-10 max-w-[62ch] font-human text-lead">
                {copy.noAccess}
              </p>
            </section>
          </div>

          {/* ═══ LA SOLICITUD ════════════════════════════════════
              El formulario a la izquierda y, a su lado, el aviso breve que el
              copy pide JUNTO al formulario: se lee antes de marcar la casilla,
              no después. Cerrada la vigencia, el formulario no se pinta. */}
          <section
            id="solicitud"
            className="scroll-mt-24 border-t border-hairline px-5 pb-24 pt-14 sm:px-10"
          >
            <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-20">
              <div className="min-w-0">
                <p className="stamp">{en ? 'request' : 'solicitud'}</p>
                <div className="mt-6">
                  {abierta ? (
                    <ReviewForm
                      locale={locale}
                      gracias="/revision-ficha-google/gracias"
                      boletin={isNewsletterConfigured()}
                      copy={{ ...copy.form, closed: copy.closed }}
                    />
                  ) : (
                    <p className="max-w-[54ch] text-ink [overflow-wrap:anywhere]">
                      {copy.closed}
                    </p>
                  )}
                </div>
              </div>

              <aside className="min-w-0">
                <p className="stamp">
                  {en ? 'privacy notice' : 'aviso de privacidad'}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-ink-muted [overflow-wrap:anywhere]">
                  {copy.privacyShort}{' '}
                  <Link href="/privacidad" className="link-stylus">
                    {en ? 'Full notice' : 'Aviso integral'}
                  </Link>
                  .
                </p>

                <p className="band mt-10 text-sm leading-relaxed text-ink-muted">
                  {copy.social}
                </p>
                <p className="band text-sm text-ink-muted">
                  {copy.doubts}{' '}
                  <a
                    href={`mailto:${NAP.email}`}
                    className="link-stylus inline-flex min-h-11 items-center [overflow-wrap:anywhere]"
                  >
                    {NAP.email}
                  </a>
                </p>
              </aside>
            </div>
          </section>

          {/* ═══ LO QUE NO PROMETO ═══════════════════════════════ */}
          <section className="border-t border-hairline px-5 pb-24 pt-14 sm:px-10">
            <h2 className="max-w-[18ch] text-d1 text-ink">
              {copy.noPromiseTitle}
            </h2>
            <p className="mt-6 max-w-[54ch] font-human text-lead text-ink-muted">
              {copy.noPromise}
            </p>

            {guiaPublicada ? (
              <p className="mt-12">
                <span className="stamp block">{copy.guide}</span>
                <Link
                  href={{
                    pathname: '/blog/[slug]',
                    params: { slug: guiaPublicada.slug },
                  }}
                  locale="es"
                  hrefLang="es"
                  className="link-stylus mt-3 inline-flex min-h-11 items-center"
                >
                  {guiaPublicada.title} →
                </Link>
              </p>
            ) : null}
          </section>

          {/* ═══ ÍNDICE ══════════════════════════════════════════
              Las mismas seis preguntas que declara el FAQPage del grafo. */}
          <section className="border-t border-hairline px-5 pb-24 pt-14 sm:px-10">
            <h2 className="max-w-[18ch] text-d1 text-ink">{copy.faqTitle}</h2>
            <div className="mt-12">
              {copy.faqs.map((faq) => (
                <details key={faq.question} className="band group">
                  <summary className="flex cursor-pointer list-none items-baseline gap-6 text-ink marker:hidden">
                    <span>{faq.question}</span>
                    <span
                      aria-hidden="true"
                      className="stamp shrink-0 transition-transform duration-150 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 max-w-[62ch] text-ink-muted">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
