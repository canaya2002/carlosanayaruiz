import type { Metadata } from 'next'
import Image from 'next/image'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Rail } from '@/components/instrument/rail'
import { Span } from '@/components/instrument/span'
import { getAwards, type AwardId, type AwardKind } from '@/data/awards'
import { getCompanyBySlug } from '@/data/companies'
import { NAP, routeUrl } from '@/lib/constants'
import { formatShortDate } from '@/lib/utils'
import { generatePageMetadata } from '@/lib/seo'
import {
  generateWebPageSchema,
  generateBreadcrumbSchema,
  type SchemaGraph,
} from '@/lib/schema'
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
    route: 'premios',
    title: en ? 'Awards and recognitions' : 'Premios y reconocimientos',
    // La descripción nombra al emisor de cada cosa, porque eso es lo
    // verificable. No dice "premiado" a secas: dos de las tres entradas no son
    // un primer lugar y la tercera no es un premio, es un examen aprobado.
    description: en
      // Medía 166 caracteres sobre el HTML servido, uno por encima del límite
      // de la sonda —Google recorta alrededor de 160—. La segunda frase se
      // acortó sin perder nada de lo que afirma: 154.
      ? 'NASA Space Apps "Galactic Problem Solver" recognition, first place at a 2022 hackathon, and TOEFL iBT 92. Each one with its issuing organisation and date.'
      : 'Reconocimiento "Galactic Problem Solver" de NASA Space Apps, primer lugar en hackathon 2022 y TOEFL iBT 92. Cada uno con la organización que lo otorgó y la fecha.',
  })
}

/**
 * Premio → slug del proyecto en data/companies.ts.
 *
 * Solo dos de las tres entradas corresponden a un proyecto con página propia; la
 * certificación TOEFL no es un proyecto y por eso no aparece aquí. El enlace se
 * dibuja únicamente si `getCompanyBySlug` encuentra la empresa, así que borrar
 * una entrada de companies.ts no deja un enlace roto detrás.
 */
const PROJECT_SLUG_BY_AWARD: Partial<Record<AwardId, string>> = {
  'nasa-spaceapps': 'aurascope',
  'logiroute-ai': 'logiroute-ai',
}

export default async function AwardsPage({ params }: Props) {
  const { locale: rawLocale } = await params
  setRequestLocale(rawLocale)

  const locale = rawLocale as Locale
  const en = locale === 'en'

  const t = await getTranslations('premios')

  const awards = getAwards(locale)

  // Las cifras se calculan aquí, sobre el arreglo real. Ninguna está escrita
  // a mano: si mañana entra una cuarta entrada, los números cambian solos.
  //
  // Las variables de «la más reciente» se fueron con la cifra que las usaba:
  // el TRAMO del margen ordena descendente por su cuenta, así que su primera
  // marca YA es la entrada más reciente, con su año y su emisor. Dos formas de
  // calcular lo mismo es una de más.
  const sorted = [...awards].sort((a, b) => b.date.localeCompare(a.date))
  const organizations = new Set(awards.map((award) => award.organization)).size

  /* Las entradas para el TRAMO del margen: fecha real y una línea corta.
     El margen mide 18rem, así que lo que va ahí es la organización —el
     dato verificable— y no el título completo, que en dos de las tres
     entradas pasa de cuarenta caracteres. */
  const spanEntries = sorted.map((award) => ({
    date: award.date,
    what: award.organization,
  }))

  /**
   * Qué es cada entrada, dicho con la palabra que le toca.
   *
   * El campo `kind` de data/awards.ts existe justamente para esto: un
   * reconocimiento, un primer lugar y un examen aprobado no son lo mismo, y
   * ponerles a los tres la palabra "premio" exageraría dos de ellos. Antes esto
   * era una píldora de color; ahora es la etiqueta mono de la fila, que dice lo
   * mismo sin encuadrar nada.
   */
  const kindLabel: Record<AwardKind, string> = {
    recognition: t('kindRecognition'),
    competition: t('kindCompetition'),
    certification: t('kindCertification'),
  }

  /**
   * Las cifras del margen, las dos derivadas del arreglo.
   *
   * Eran TRES. La del medio —«el más reciente», con su año y su
   * organización— se fue porque el TRAMO que va justo encima ya lo dice: su
   * primera marca ES la más reciente, con ese año y ese emisor. Tener las
   * dos era el mismo dato dos veces en una columna de 18rem, medido en
   * captura.
   *
   * Las dos que quedan responden preguntas distintas: cuántas entradas hay,
   * y cuántas organizaciones distintas las otorgaron — que es lo que
   * contesta «¿te las diste tú?».
   */
  const headerMetrics: { value: string; label: string; hint?: string }[] = [
    {
      value: String(awards.length),
      label: t('metricsTotalLabel'),
      hint: t('metricsTotalHint'),
    },
    {
      value: String(organizations),
      label: t('metricsOrgsLabel'),
      hint: t('metricsOrgsHint'),
    },
  ]

  /** Las dos páginas donde se sigue verificando lo mismo por otra vía. */
  const moreLinks: {
    href: StaticPathname
    title: string
    desc: string
    cta: string
  }[] = [
    {
      href: '/certificaciones',
      title: t('certsTitle'),
      desc: t('certsDesc'),
      cta: t('certsCta'),
    },
    {
      href: '/cv',
      title: t('cvTitle'),
      desc: t('cvDesc'),
      cta: t('cvCta'),
    },
  ]

  /** a–b: canales paralelos del mismo registro, no pasos 01/02. */
  const channelId = (i: number) => String.fromCharCode(97 + i)

  /**
   * WebPage + BreadcrumbList, nada más.
   *
   * NO hay nodo `Award`: schema.org lo modela como una propiedad de texto de
   * Person, y no existe en el archivo de datos ni el emisor como entidad ni una
   * URL de verificación que respalde un nodo propio. El texto visible ya dice
   * quién otorgó qué y cuándo; inventar un grafo alrededor no agrega ningún
   * hecho, solo superficie para equivocarse.
   *
   * Es `CollectionPage` porque la página es exactamente eso: la lista de las
   * entradas de data/awards.ts.
   */
  const pageUrl = routeUrl('premios', locale)
  const schema: SchemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      generateWebPageSchema({
        locale,
        route: 'premios',
        name: t('title'),
        description: t('lead'),
        type: 'CollectionPage',
        hasBreadcrumb: true,
      }),
      generateBreadcrumbSchema(
        [
          { name: en ? 'Home' : 'Inicio', route: 'home' },
          { name: t('crumb'), route: 'premios' },
        ],
        locale,
        pageUrl
      ),
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div
        className="grid"
        style={{ gridTemplateColumns: 'var(--tape-w) minmax(0,1fr)' }}
      >
        <Rail />

        <div className="min-w-0">
          {/* ═══ CABECERA ════════════════════════════════════════
              Sin aurora, sin cristal y sin las tres tarjetas flotando:
              el titular va directo sobre el hollín y las cifras son tres
              filas de un registro, leídas de arriba abajo. */}
          <section className="hero-in relative px-5 pt-16 pb-20 sm:px-10">
            {/* ── LA HOJA TIENE DOS MÁRGENES ──
                Las tres cifras vivían en bandas a todo el ancho: a 1440 el
                número acababa a mil píxeles de su etiqueta, con la hoja
                vacía en medio. Aquí se leen juntas, que es lo que hace la
                placa grabada de un instrumento. */}
            <div className="ledger">
              <div className="min-w-0">
                <p className="stamp">{t('eyebrow')}</p>

                <h1 className="mt-6 max-w-[14ch] text-hero text-ink">
                  {t('h1Lead')}
                  {t('h1Accent')}
                </h1>

                <p className="mt-10 max-w-[46ch] text-lead text-ink-muted">
                  {t('lead')}
                </p>

                {/* La nota que evita el inflado: la página dice en voz alta que
                las tres entradas son cosas distintas antes de listarlas. */}
                <p className="mt-6 max-w-[68ch] text-ink-muted">
                  {t('honesty')}
                </p>
              </div>

              {/* ── EL MARGEN DE ANOTACIÓN ── */}
              <aside className="margin margin-sticky">
                {/* EL TRAMO. Tres entradas contra un eje de años: una fecha
                    no se lee dentro de una tarjeta, se lee por posición.
                    La marca larga es la más reciente — graduación mayor, no
                    color de estado: el minio y el umbral son semánticos. */}
                <Span
                  entries={spanEntries}
                  label={en ? 'the span' : 'el tramo'}
                  spanLabel={
                    en ? 'first to latest entry' : 'de la primera a la última'
                  }
                />

                <dl className="reveal-stagger">
                  {headerMetrics.map((metric) => (
                    <div key={metric.label} className="margin-row">
                      <dt className="margin-key">{metric.label}</dt>
                      <dd>
                        <span className="margin-read">{metric.value}</span>
                        {metric.hint ? (
                          <span className="margin-val">{metric.hint}</span>
                        ) : null}
                      </dd>
                    </div>
                  ))}
                </dl>
              </aside>
            </div>
          </section>

          {/* ═══ UNO POR UNO ═════════════════════════════════════
              El carrusel de tarjetas desapareció porque enseñaba estos
              mismos tres registros con menos datos. Aquí está todo: la
              clase, la fecha, el emisor, la descripción y el resultado
              tal como está escrito en el archivo de datos. */}
          <section className="border-t border-hairline px-5 pb-24 pt-14 sm:px-10">
            <p className="stamp">{t('listEyebrow')}</p>
            <h2 className="mt-5 max-w-[18ch] text-d1 text-ink">
              {t('listTitle')}
            </h2>

            <ol className="reveal-stagger mt-12">
              {sorted.map((award, index) => {
                // El más reciente se marca con la palabra, no con un borde.
                const featured = index === 0

                // El proyecto correspondiente, si existe. La certificación no
                // tiene proyecto y aquí devuelve undefined.
                const projectSlug = PROJECT_SLUG_BY_AWARD[award.id]
                const project = projectSlug
                  ? getCompanyBySlug(locale, projectSlug)
                  : undefined

                return (
                  <li key={award.id} className="band py-8">
                    <p className="stamp">
                      {kindLabel[award.kind]}
                      {featured ? ` · ${t('featured')}` : ''}
                    </p>

                    <h3 className="mt-4 max-w-[28ch] text-d2 text-ink">
                      {award.title}
                    </h3>

                    <dl className="mt-6 flex flex-wrap gap-x-12 gap-y-4">
                      <div>
                        <dt className="stamp">{t('awardedBy')}</dt>
                        <dd className="mt-1.5 text-ink">
                          {award.organization}
                        </dd>
                      </div>
                      <div>
                        <dt className="stamp">{t('dateLabel')}</dt>
                        <dd className="mt-1.5 font-mono tabular-nums text-ink">
                          <time dateTime={award.date} data-numeric="">
                            {formatShortDate(award.date, locale)}
                          </time>
                        </dd>
                      </div>
                    </dl>

                    <p className="mt-6 max-w-[62ch] text-ink-muted">
                      {award.description}
                    </p>

                    {/* `impact` se imprime TAL CUAL viene del archivo de datos.
                        El de LogiRoute dice "Reducción proyectada del 15%": la
                        palabra "proyectada" es lo que hace honesta la frase,
                        porque fue una estimación del modelo y no una medición
                        en operación. Nada aquí la reescribe ni la recorta. */}
                    {award.impact ? (
                      <div className="mt-6">
                        <p className="stamp">{t('resultLabel')}</p>
                        <p className="mt-1.5 max-w-[62ch] text-ink-muted">
                          {award.impact}
                        </p>
                      </div>
                    ) : null}

                    {/* EL DOCUMENTO. Es la pieza que faltaba: el archivo
                        estaba en `public/credenciales/` y `award.image` no lo
                        leía nadie, así que se servía con 200 y no existía para
                        el visitante.

                        Va a todo el ancho de la columna porque es UNA imagen y
                        es la credencial insignia del sitio — la que encabeza
                        esta página, la que va en la descripción SEO y la que se
                        repite en /sobre-mi, /cv y /proyectos/aurascope. A este
                        tamaño la cita impresa se lee, que es el punto: la
                        página promete que no hace falta creerle.

                        `.credential-wide` porque el archivo es 16/9; los
                        certificados de curso son 4/3 y llevan la clase base.

                        Sin `priority`: el candidato a LCP de esta ruta es el
                        h1, y este documento vive dos pantallas más abajo. */}
                    {award.image ? (
                      <figure className="mt-8 m-0 max-w-[54rem]">
                        <span className="credential credential-wide">
                          <Image
                            src={award.image}
                            /* `imageAlt` y no `title`: el título es el nombre
                               del PROYECTO y ya está impreso literal 500
                               caracteres antes en esta misma página. El `alt` de
                               un documento escaneado describe el documento. */
                            alt={award.imageAlt ?? award.title}
                            width={1600}
                            height={1075}
                            sizes="(min-width: 1024px) 54rem, 92vw"
                            loading="lazy"
                          />
                        </span>
                        <figcaption className="stamp mt-4">
                          {en
                            ? 'the certificate, as issued'
                            : 'el certificado, tal como se emitió'}
                        </figcaption>
                      </figure>
                    ) : null}

                    {/* Enlazado interno real: la página del proyecto que ganó
                        esto. Ruta dinámica, así que va como objeto con
                        `params` — un string suelto no compila. */}
                    {project ? (
                      <p className="mt-6">
                        <Link
                          className="link-stylus"
                          href={{
                            pathname: '/proyectos/[slug]',
                            params: { slug: project.slug },
                          }}
                        >
                          {t('viewProject')}: {project.name} →
                        </Link>
                      </p>
                    ) : null}
                  </li>
                )
              })}
            </ol>
          </section>

          {/* ═══ DÓNDE SEGUIR VERIFICANDO ════════════════════════
              La placa despejada, una sola vez en la página: el material se
              invierte entero y las dos vías de verificación se leen como
              canales del mismo registro. */}
          <section className="plate px-5 py-20 sm:px-10">
            <p className="stamp">{t('moreEyebrow')}</p>
            <h2 className="mt-5 max-w-[18ch] text-d1">{t('moreTitle')}</h2>
            <p className="mt-5 max-w-[58ch] text-lead">{t('moreLead')}</p>

            <ul className="mt-12">
              {moreLinks.map((item, i) => (
                <li key={item.href}>
                  <Link href={item.href} className="channel group">
                    <span className="channel-id">ch {channelId(i)}</span>
                    <span>
                      <span className="text-d3">{item.title}</span>
                      <span className="channel-note mt-1 block max-w-[52ch] text-sm">
                        {item.desc}
                      </span>
                      <span className="stamp mt-2.5 block">{item.cta}</span>
                      {/* La pluma: al pasar el puntero, una línea se escribe
                          de izquierda a derecha bajo la fila. */}
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

          {/* ═══ CIERRE ══════════════════════════════════════════ */}
          <section className="border-t border-hairline px-5 pb-28 pt-16 sm:px-10">
            <h2 className="max-w-[18ch] text-d1 text-ink">{t('ctaTitle')}</h2>
            <p className="mt-6 max-w-[52ch] font-human text-lead text-ink-muted">
              {t('ctaLead')}
            </p>
            <p className="mt-10 flex flex-wrap items-baseline gap-x-8 gap-y-3">
              <Link className="link-stylus text-d3" href="/contacto">
                {t('ctaButton')} →
              </Link>
              <a className="link-stylus font-mono" href={`mailto:${NAP.email}`}>
                {NAP.email}
              </a>
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
