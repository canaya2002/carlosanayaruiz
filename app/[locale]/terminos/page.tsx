/**
 * ════════════════════════════════════════════════════════════════════════
 * NOTA PARA QUIEN MANTENGA ESTE ARCHIVO — a propósito es un comentario y no
 * texto visible.
 *
 * Estos términos son un PUNTO DE PARTIDA TÉCNICO, del tamaño de una
 * consultoría de una sola persona: cubren únicamente lo que este sitio de
 * verdad es —un sitio informativo con un formulario de contacto que abre la
 * aplicación de correo del visitante— y omiten a propósito el relleno
 * corporativo: no hay cláusula de arbitraje, ni cuentas de usuario, ni
 * suscripciones, ni política de reembolsos, ni condiciones de comercio
 * electrónico, porque nada de eso existe aquí. NO son asesoría legal y NO los
 * ha revisado un abogado. Que los revise un abogado mexicano antes de confiar
 * en ellos, en especial la redacción de la limitación de responsabilidad (que
 * conforme al derecho mexicano no puede excluir el dolo ni la culpa grave) y
 * la cláusula de jurisdicción si se esperan clientes fuera de México.
 *
 * REVISADO EL 2026-08-19 para que ninguna cláusula describa infraestructura
 * que ya no existe. Se eliminaron las menciones al newsletter, a las reglas de
 * seguridad de la base de datos y a Firebase: no hay base de datos, no hay
 * servidor que reciba formularios y no hay lista de correo. Si algo de eso
 * vuelve, estos términos cambian en el mismo commit.
 *
 * Todo lo relativo a un proyecto pagado (alcance, tiempos, precio,
 * confidencialidad, titularidad de la propiedad intelectual) va en la
 * propuesta firmada, NO aquí. Si eso cambia, estos términos cambian con ello y
 * LAST_UPDATED se mueve.
 *
 * ── PRESENTACIÓN: «PAPEL AHUMADO» ──
 * Migrado el 2026-08-20, en paralelo con el aviso de privacidad y con la misma
 * estructura: se fueron la aurora, el grano, la cuadrícula, los paneles de
 * cristal, las tres tarjetas inclinables con su icono en un cuadro y los dos
 * botones del cierre. Queda una columna de lectura de ~66 ch, un índice de
 * anclas y reglas horizontales. El único movimiento es `.reveal-stagger` sobre
 * el resumen de tres bandas.
 * ════════════════════════════════════════════════════════════════════════
 */

import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Rail } from '@/components/instrument/rail'
import { NAP, SITE_CONFIG } from '@/lib/constants'
import { generatePageMetadata } from '@/lib/seo'
import { generateLegalPageGraph } from '@/lib/schema'
import { Locale } from '@/data/types'

interface Props {
  params: Promise<{ locale: string }>
}

/** Fecha real de la última edición de fondo. También alimenta el JSON-LD. */
const LAST_UPDATED = '2026-08-19'

/** Dominio pelado, para el texto. Derivado para que un cambio de dominio
 *  actualice también el copy. */
const DOMAIN = SITE_CONFIG.url.replace(/^https?:\/\//, '')

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const en = locale === 'en'

  return generatePageMetadata({
    locale: locale as Locale,
    route: 'terminos',
    title: en ? 'Terms and Conditions of Use' : 'Términos y Condiciones de Uso',
    description: en
      ? 'Terms of use for this site: informational content, no guaranteed rankings, plus intellectual property, liability limits and Mexican governing law.'
      : 'Condiciones de uso del sitio: contenido informativo, sin garantía de posiciones en buscadores, propiedad intelectual y ley aplicable en México.',
  })
}

/**
 * ════════════════════════════════════════════════════════════════
 * LA COLUMNA DE LECTURA — idéntica a la del aviso de privacidad
 *
 * NO se usa `.prose-rich`: esa clase vive FUERA de capa —le gana a cualquier
 * utilidad de Tailwind, así que no se puede corregir desde aquí— y pinta las
 * viñetas con `var(--grad)`, que en este material resuelve a humo sobre
 * hollín: invisible. Además encapsula el código en una píldora con fondo y
 * radio, que es justo la caja que este rediseño quita.
 *
 * Aquí: medida de 66 ch, un solo ritmo vertical, marcador nativo teñido de
 * ceniza y código en mono sin cápsula.
 * ════════════════════════════════════════════════════════════════
 */
const DOC = [
  'max-w-[66ch] break-words text-ink-muted',
  '[&>*+*]:mt-5',
  '[&_h3]:mt-10 [&_h3]:text-d3 [&_h3]:text-ink',
  '[&_strong]:font-semibold [&_strong]:text-ink',
  '[&_ul]:mt-5 [&_ul]:list-disc [&_ul]:space-y-2.5 [&_ul]:pl-5',
  '[&_li]:marker:text-ash',
  '[&_code]:font-mono [&_code]:text-[0.9em] [&_code]:text-ink',
].join(' ')

interface LegalSection {
  /**
   * Id del ancla. La tabla de contenido se arma del mismo arreglo, así que no
   * puede discrepar de las secciones que existen.
   */
  id: string
  title: string
  body: ReactNode
}

interface Highlight {
  title: string
  text: string
}

export default async function TermsPage({ params }: Props) {
  const { locale: rawLocale } = await params
  setRequestLocale(rawLocale)

  const locale = rawLocale as Locale
  const en = locale === 'en'

  const t = await getTranslations('legal')

  const mailto = `mailto:${NAP.email}`
  const emailLink = (
    <a className="link-stylus" href={mailto}>
      {NAP.email}
    </a>
  )

  const updatedLabel = en ? 'August 19, 2026' : '19 de agosto de 2026'

  const privacyLink = (
    <Link className="link-stylus" href="/privacidad">
      {t('privacyTitle')}
    </Link>
  )

  /** El numeral de cláusula. Un documento legal SÍ es una secuencia real: se
   *  cita por número, y el índice y el cuerpo tienen que coincidir. */
  const clause = (index: number) => String(index + 1).padStart(2, '0')

  /**
   * Las tres cláusulas que cambian lo que alguien espera de este sitio, arriba
   * y en una sola pantalla.
   *
   * ⚠ NO SON COPY NUEVO NI PROMESAS NUEVAS: cada una resume, en una línea, una
   * sección que está más abajo en este mismo documento —"sin garantía de
   * resultados", "consultar el sitio no crea una relación profesional" y "ley
   * aplicable"—. Si alguna de esas secciones cambia, esta ficha cambia con
   * ella; un resumen que contradiga el cuerpo es peor que no tener resumen.
   */
  const highlights: Highlight[] = en
    ? [
        {
          title: 'No ranking guarantees',
          text: 'Nothing published here promises positions, traffic or revenue. Any figure in a proposal is an estimate.',
        },
        {
          title: 'Reading does not hire me',
          text: 'Work exists only with a written proposal accepted by both sides. That document prevails over this page.',
        },
        {
          title: 'Mexican law applies',
          text: 'These terms are governed by Mexican federal law, with venue in the courts of Mexico City.',
        },
      ]
    : [
        {
          title: 'Sin garantía de posiciones',
          text: 'Nada de lo publicado aquí promete posiciones, tráfico ni ingresos. Cualquier cifra en una propuesta es una estimación.',
        },
        {
          title: 'Leerme no es contratarme',
          text: 'El trabajo existe solo con una propuesta escrita aceptada por ambas partes. Ese documento prevalece sobre esta página.',
        },
        {
          title: 'Ley aplicable: México',
          text: 'Estos términos se rigen por la legislación federal mexicana, con jurisdicción en los tribunales de la Ciudad de México.',
        },
      ]

  /**
   * Copy de documento largo, escrito aquí y no en messages/*.json por la misma
   * razón que el aviso de privacidad: es un documento, no cadenas de interfaz.
   */
  const sections: LegalSection[] = en
    ? [
        {
          id: 'scope',
          title: 'Scope and acceptance',
          body: (
            <>
              <p>
                These terms govern the use of <code>{DOMAIN}</code>, a site
                operated by <strong>Carlos Anaya Ruiz</strong>, an independent
                technical SEO and software development consultant based in
                Mexico City. Browsing the site, reading its content or using its
                contact form means you accept them; if you do not agree with
                something here, the reasonable course is not to use the site.
              </p>
              <p>
                I may update these terms. The last-updated date at the top of
                this page identifies the version in force, and continued use of
                the site after a change means accepting the published version.
              </p>
            </>
          ),
        },
        {
          id: 'no-guarantee',
          title: 'The content is informational, not a guarantee of results',
          body: (
            <>
              <p>
                The articles, guides, technical explanations and service
                descriptions published here describe SEO and engineering
                practice. They are general information, not tailored advice for
                your site, and they are not legal, tax or financial advice.
              </p>
              <p>
                <strong>
                  Nothing on this site is a guarantee of rankings, traffic,
                  conversions or revenue.
                </strong>{' '}
                Search visibility depends on factors nobody in this profession
                controls: the ranking systems of Google and other engines and
                their updates, your competitors, your domain history, your
                content, and decisions taken by your own team. Any figure that
                appears in a commercial proposal is an estimate grounded in
                experience, never a promised outcome. Anyone who promises you a
                specific position on Google is selling you something they cannot
                deliver.
              </p>
              <p>
                Applying a technique described here to a live site is your
                decision and your responsibility. Test changes before deploying
                them, and keep a way back.
              </p>
            </>
          ),
        },
        {
          id: 'no-engagement',
          title: 'Reading the site does not create a professional relationship',
          body: (
            <>
              <p>
                Using the contact form, writing to me or exchanging a few emails
                does not by itself create a consulting engagement or any
                obligation to provide services.
              </p>
              <p>
                Work exists only when there is a written proposal accepted by
                both parties. That document defines scope, deliverables,
                timeline, price, confidentiality and ownership of what is
                produced, and it prevails over anything stated on this site,
                including these terms, for everything related to that
                engagement.
              </p>
            </>
          ),
        },
        {
          id: 'contact-form',
          title: 'How the contact form works, and what it does not promise',
          body: (
            <>
              <p>
                The form on the contact page does not send anything to a server.
                It assembles the message and opens the email application on your
                device so you can send it yourself, from your own account. There
                is no database and no inbox on this site.
              </p>
              <p>
                A consequence worth stating plainly: whether the email actually
                leaves depends on your device, your email client and your
                provider — none of which I control. I cannot acknowledge or
                answer a message that never reached my inbox, so if you get no
                reply within a reasonable time, it is worth writing to{' '}
                {emailLink} directly.
              </p>
              <p>
                What the form is for is structure: the fields exist so the first
                email already contains the URL, what changed and since when. It
                is a drafting aid, not a delivery guarantee.
              </p>
            </>
          ),
        },
        {
          id: 'acceptable-use',
          title: 'Acceptable use',
          body: (
            <>
              <p>
                You are welcome to read, quote, link to and share what is
                published here. What is not acceptable:
              </p>
              <ul>
                <li>
                  Automated mass extraction or request volumes that degrade
                  service for other visitors.
                </li>
                <li>
                  Attempting to bypass the validation of the contact form or any
                  technical limit of the site.
                </li>
                <li>
                  Using the form or my address to send spam, malware, misleading
                  or unlawful content, or to impersonate another person.
                </li>
                <li>
                  Republishing the content wholesale as your own, or reselling
                  it.
                </li>
              </ul>
              <p>
                Access from a client or address that abuses the infrastructure
                may be blocked.
              </p>
            </>
          ),
        },
        {
          id: 'ip',
          title: 'Intellectual property',
          body: (
            <>
              <p>
                The text, structure, information architecture, visual design and
                source code of this site belong to Carlos Anaya Ruiz, except
                where a third party is credited.
              </p>
              <p>
                Third-party names and marks mentioned here — Google, Next.js,
                Vercel, Power BI, Amazon and others — belong to their respective
                owners and are used descriptively, to say what the work
                involves. Their appearance implies no endorsement, sponsorship
                or partnership.
              </p>
              <p>
                You may quote short excerpts with attribution and a link to the
                original URL. Reproducing, translating or republishing complete
                pages requires written permission, which is usually granted if
                you ask — write to {emailLink}. Code snippets shown in the
                content are illustrative examples: you may use them in your own
                projects at your own risk and without any warranty.
              </p>
            </>
          ),
        },
        {
          id: 'links',
          title: 'External links',
          body: (
            <p>
              This site links to third-party documentation, tools and profiles
              for reference. I do not control their content, availability,
              pricing or privacy practices, and a link is not an endorsement.
              Once you follow one, the terms and privacy policy of that
              destination apply, not these.
            </p>
          ),
        },
        {
          id: 'availability',
          title: 'Availability and changes to the site',
          body: (
            <>
              <p>
                The site is maintained with care but offered as is, with no
                uptime commitment: hosting, connectivity or a deploy can
                interrupt it.
              </p>
              <p>
                Content may be corrected, expanded, moved or removed at any time
                — technical writing that is not revised becomes wrong. When a URL
                changes, a permanent redirect is put in place where reasonable,
                so links you have shared keep working.
              </p>
            </>
          ),
        },
        {
          id: 'liability',
          title: 'Limitation of liability',
          body: (
            <>
              <p>
                To the maximum extent permitted by applicable law, I am not
                liable for indirect, incidental or consequential damages — lost
                traffic, lost revenue, lost data or business interruption —
                arising from the use of this site or from applying its content
                without professional analysis of your specific case.
              </p>
              <p>
                This does not limit liability that cannot be limited under
                Mexican law, including wilful misconduct or gross negligence.
                Liability arising from a contracted service is governed by the
                corresponding proposal or contract, not by this document.
              </p>
            </>
          ),
        },
        {
          id: 'personal-data',
          title: 'Personal data',
          body: (
            <>
              <p>
                This site has no database and receives no form submissions: the
                contact form opens your own email application. What reaches my
                inbox, how long it is kept and how to exercise your ARCO rights
                is described in the {privacyLink}, which forms part of these
                terms.
              </p>
              <p>
                The site uses no advertising cookies and no third-party
                trackers, which is why it needs no cookie consent banner.
              </p>
            </>
          ),
        },
        {
          id: 'governing-law',
          title: 'Governing law and jurisdiction',
          body: (
            <p>
              These terms are governed by the federal law of the United Mexican
              States. Any dispute over their interpretation or performance is
              submitted to the competent courts of Mexico City, waiving any
              other venue that might apply by reason of present or future
              domicile.
            </p>
          ),
        },
      ]
    : [
        {
          id: 'alcance',
          title: 'Alcance y aceptación',
          body: (
            <>
              <p>
                Estos términos rigen el uso de <code>{DOMAIN}</code>, sitio
                operado por <strong>Carlos Anaya Ruiz</strong>, consultor
                independiente de SEO técnico y desarrollo de software con base
                en Ciudad de México. Navegar el sitio, leer su contenido o usar
                su formulario de contacto implica aceptarlos; si algo aquí no te
                parece, lo razonable es no usar el sitio.
              </p>
              <p>
                Puedo actualizar estos términos. La fecha de última
                actualización que aparece arriba identifica la versión vigente, y
                seguir usando el sitio después de un cambio implica aceptar la
                versión publicada.
              </p>
            </>
          ),
        },
        {
          id: 'sin-garantia',
          title: 'El contenido es informativo, no una garantía de resultados',
          body: (
            <>
              <p>
                Los artículos, guías, explicaciones técnicas y descripciones de
                servicio publicados aquí describen práctica de SEO e ingeniería.
                Son información general, no una recomendación hecha a la medida
                de tu sitio, y no constituyen asesoría legal, fiscal ni
                financiera.
              </p>
              <p>
                <strong>
                  Nada en este sitio es una garantía de posiciones, tráfico,
                  conversiones o ingresos.
                </strong>{' '}
                La visibilidad en buscadores depende de factores que nadie en
                esta profesión controla: los sistemas de ranking de Google y de
                otros buscadores y sus actualizaciones, tu competencia, el
                historial de tu dominio, tu contenido y las decisiones de tu
                propio equipo. Cualquier cifra que aparezca en una propuesta
                comercial es una estimación basada en experiencia, nunca un
                compromiso de resultado. Quien te prometa una posición concreta
                en Google te está vendiendo algo que no puede entregar.
              </p>
              <p>
                Aplicar una técnica descrita aquí en un sitio en producción es tu
                decisión y tu responsabilidad. Prueba los cambios antes de
                desplegarlos y deja siempre un camino de regreso.
              </p>
            </>
          ),
        },
        {
          id: 'sin-relacion',
          title: 'Consultar el sitio no crea una relación profesional',
          body: (
            <>
              <p>
                Usar el formulario de contacto, escribirme o intercambiar unos
                correos no crea por sí mismo una relación de consultoría ni
                obligación alguna de prestar servicios.
              </p>
              <p>
                El trabajo existe únicamente cuando hay una propuesta escrita
                aceptada por ambas partes. Ese documento define alcance,
                entregables, tiempos, precio, confidencialidad y titularidad de
                lo que se produce, y prevalece sobre cualquier cosa dicha en
                este sitio —incluidos estos términos— en todo lo relativo a ese
                proyecto.
              </p>
            </>
          ),
        },
        {
          id: 'formulario',
          title: 'Cómo funciona el formulario y qué no promete',
          body: (
            <>
              <p>
                El formulario de la página de contacto no envía nada a un
                servidor: arma el mensaje y abre la aplicación de correo de tu
                dispositivo para que lo envíes tú, desde tu propia cuenta. Este
                sitio no tiene base de datos ni buzón propio.
              </p>
              <p>
                De ahí se sigue algo que vale decir sin rodeos: que el correo
                salga depende de tu dispositivo, de tu cliente de correo y de tu
                proveedor, y ninguno de los tres está bajo mi control. No puedo
                acusar recibo ni responder un mensaje que nunca llegó a mi
                buzón, así que si no tienes respuesta en un plazo razonable vale
                la pena escribir directo a {emailLink}.
              </p>
              <p>
                Para lo que sirve el formulario es para dar estructura: los
                campos existen para que el primer correo ya traiga la URL, qué
                cambió y desde cuándo. Es una ayuda de redacción, no una
                garantía de entrega.
              </p>
            </>
          ),
        },
        {
          id: 'uso-aceptable',
          title: 'Uso aceptable',
          body: (
            <>
              <p>
                Puedes leer, citar, enlazar y compartir lo que se publica aquí.
                Lo que no es aceptable:
              </p>
              <ul>
                <li>
                  Extracción masiva automatizada o volúmenes de solicitudes que
                  degraden el servicio para otras personas.
                </li>
                <li>
                  Intentar evadir la validación del formulario de contacto o
                  cualquier límite técnico del sitio.
                </li>
                <li>
                  Usar el formulario o mi correo para enviar spam, malware,
                  contenido engañoso o ilícito, o para suplantar a otra persona.
                </li>
                <li>
                  Republicar el contenido íntegro como propio o revenderlo.
                </li>
              </ul>
              <p>
                El acceso desde un cliente o una dirección que abuse de la
                infraestructura puede ser bloqueado.
              </p>
            </>
          ),
        },
        {
          id: 'propiedad-intelectual',
          title: 'Propiedad intelectual',
          body: (
            <>
              <p>
                Los textos, la estructura, la arquitectura de información, el
                diseño visual y el código fuente de este sitio pertenecen a
                Carlos Anaya Ruiz, salvo donde se acredite a un tercero.
              </p>
              <p>
                Los nombres y marcas de terceros mencionados aquí —Google,
                Next.js, Vercel, Power BI, Amazon y otros— pertenecen a sus
                respectivos titulares y se usan de forma descriptiva, para
                explicar en qué consiste el trabajo. Su aparición no implica
                aval, patrocinio ni asociación.
              </p>
              <p>
                Puedes citar fragmentos breves con atribución y un enlace a la
                URL original. Reproducir, traducir o republicar páginas
                completas requiere permiso escrito, que normalmente doy si lo
                pides: escríbeme a {emailLink}. Los fragmentos de código que
                aparecen en el contenido son ejemplos ilustrativos: puedes
                usarlos en tus proyectos bajo tu propio riesgo y sin garantía
                alguna.
              </p>
            </>
          ),
        },
        {
          id: 'enlaces',
          title: 'Enlaces externos',
          body: (
            <p>
              Este sitio enlaza a documentación, herramientas y perfiles de
              terceros como referencia. No controlo su contenido,
              disponibilidad, precio ni prácticas de privacidad, y un enlace no
              es un aval. Al seguirlo aplican los términos y el aviso de
              privacidad de ese destino, no estos.
            </p>
          ),
        },
        {
          id: 'disponibilidad',
          title: 'Disponibilidad y cambios del sitio',
          body: (
            <>
              <p>
                El sitio se mantiene con cuidado, pero se ofrece tal como está,
                sin compromiso de disponibilidad: el hosting, la conectividad o
                un despliegue pueden interrumpirlo.
              </p>
              <p>
                El contenido puede corregirse, ampliarse, moverse o retirarse en
                cualquier momento: la escritura técnica que no se revisa termina
                estando equivocada. Cuando una URL cambia, se deja una
                redirección permanente siempre que sea razonable, para que los
                enlaces que ya compartiste sigan funcionando.
              </p>
            </>
          ),
        },
        {
          id: 'responsabilidad',
          title: 'Limitación de responsabilidad',
          body: (
            <>
              <p>
                En la máxima medida permitida por la ley aplicable, no soy
                responsable de daños indirectos, incidentales o consecuenciales
                —pérdida de tráfico, de ingresos, de datos o interrupción del
                negocio— derivados del uso de este sitio o de aplicar su
                contenido sin un análisis profesional de tu caso concreto.
              </p>
              <p>
                Esto no limita la responsabilidad que no puede limitarse
                conforme a la legislación mexicana, incluidos el dolo y la culpa
                grave. La responsabilidad derivada de un servicio contratado se
                rige por la propuesta o el contrato correspondiente, no por este
                documento.
              </p>
            </>
          ),
        },
        {
          id: 'datos-personales',
          title: 'Datos personales',
          body: (
            <>
              <p>
                Este sitio no tiene base de datos y no recibe envíos de
                formulario: el formulario de contacto abre tu propia aplicación
                de correo. Qué llega a mi buzón, cuánto se conserva y cómo
                ejercer tus derechos ARCO está descrito en el {privacyLink}, que
                forma parte de estos términos.
              </p>
              <p>
                El sitio no usa cookies publicitarias ni rastreadores de
                terceros, y por eso no necesita banner de consentimiento de
                cookies.
              </p>
            </>
          ),
        },
        {
          id: 'ley-aplicable',
          title: 'Ley aplicable y jurisdicción',
          body: (
            <p>
              Estos términos se rigen por la legislación federal de los Estados
              Unidos Mexicanos. Cualquier controversia sobre su interpretación o
              cumplimiento se somete a los tribunales competentes de la Ciudad
              de México, renunciando a cualquier otro fuero que pudiera
              corresponder por razón de domicilio presente o futuro.
            </p>
          ),
        },
      ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateLegalPageGraph(locale, 'terms', {
              // Idéntico al h1 y al lead renderizados, y a la miga de pan
              // visible de abajo.
              name: t('termsTitle'),
              description: t('termsLead'),
              datePublished: LAST_UPDATED,
              dateModified: LAST_UPDATED,
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
              Sin aguja y sin marcas: el instrumento en vivo es de la home.
              Aquí el eje de la izquierda solo da continuidad de material. */}
          <section className="px-5 pt-16 pb-16 sm:px-10">
            <p className="stamp">Legal</p>

            <h1 className="mt-6 max-w-[13ch] text-hero text-ink">
              {t('termsTitle')}
            </h1>

            <p className="mt-10 max-w-[46ch] font-human text-lead text-ink-muted">
              {t('termsLead')}
            </p>

            <p className="stamp mt-8">
              {t('lastUpdated')} ·{' '}
              <time dateTime={LAST_UPDATED} data-numeric="">
                {updatedLabel}
              </time>
            </p>
          </section>

          {/* ═══ RESUMEN ═════════════════════════════════════════
              Las tres cláusulas que más cambian lo que alguien espera. Antes
              eran tres tarjetas de cristal inclinables con un icono en un
              cuadro redondeado; ahora son tres filas de registro, que es lo
              que siempre fueron: una lista de tres afirmaciones. */}
          <section className="border-t border-hairline px-5 py-16 sm:px-10">
            <p className="stamp">{en ? 'Summary' : 'Resumen'}</p>

            <ul className="reveal-stagger mt-8">
              {highlights.map((item) => (
                <li key={item.title} className="band">
                  <p className="text-d3 text-ink">{item.title}</p>
                  <p className="mt-2 max-w-[56ch] text-ink-muted">
                    {item.text}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* ═══ DOCUMENTO ═══════════════════════════════════════
              Índice de anclas a la izquierda —fijo en escritorio, un
              documento legal se navega antes de leerse— y una sola columna
              de 66 ch a la derecha. Las cláusulas se separan con la regla
              horizontal del sistema; no hay panel que las contenga.

              El numeral SÍ se queda: en un documento legal la secuencia es
              real y se cita por número, así que el índice y el cuerpo tienen
              que coincidir. */}
          <section className="border-t border-hairline px-5 py-20 sm:px-10">
            <div className="grid gap-14 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-16">
              <nav
                aria-label={en ? 'Contents' : 'Contenido'}
                className="min-w-0 lg:sticky lg:top-24 lg:self-start"
              >
                <p className="stamp">{en ? 'Contents' : 'Contenido'}</p>
                <ol className="mt-5">
                  {sections.map((section, index) => (
                    <li key={section.id} className="border-t border-hairline">
                      <a
                        href={`#${section.id}`}
                        className="flex gap-3 py-2.5 text-sm text-ink-muted transition-transform duration-150 hover:translate-x-1 hover:text-ink"
                      >
                        <span
                          data-numeric=""
                          className="mt-[0.2em] shrink-0 font-mono text-[0.6875rem] tracking-[0.09em] text-ink-subtle"
                        >
                          {clause(index)}
                        </span>
                        <span>{section.title}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>

              <div className="min-w-0">
                {sections.map((section, index) => (
                  <section
                    key={section.id}
                    id={section.id}
                    className="mt-14 scroll-mt-28 border-t border-hairline pt-12 first:mt-0 first:border-t-0 first:pt-0"
                  >
                    <p className="stamp" data-numeric="">
                      § {clause(index)}
                    </p>
                    <h2 className="mt-3 max-w-[24ch] text-d2 text-ink">
                      {section.title}
                    </h2>
                    <div className={`${DOC} mt-6`}>{section.body}</div>
                  </section>
                ))}
              </div>
            </div>
          </section>

          {/* ═══ CIERRE ══════════════════════════════════════════ */}
          <section className="border-t border-hairline px-5 py-20 sm:px-10">
            <h2 className="max-w-[20ch] text-d1 text-ink">
              {en
                ? 'Need something clarified before we work together?'
                : '¿Necesitas aclarar algo antes de trabajar juntos?'}
            </h2>
            <p className="mt-6 max-w-[52ch] text-ink-muted">
              {en
                ? 'Scope, deadlines and price live in a written proposal, not on this page. Tell me what you need and I will put it in writing.'
                : 'El alcance, los tiempos y el precio van en una propuesta escrita, no en esta página. Cuéntame qué necesitas y lo pongo por escrito.'}
            </p>
            <p className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
              <a className="link-stylus" href={mailto}>
                {NAP.email} →
              </a>
              <Link className="link-stylus" href="/privacidad">
                {t('privacyTitle')} →
              </Link>
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
