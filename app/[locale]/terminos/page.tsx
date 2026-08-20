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
 * ════════════════════════════════════════════════════════════════════════
 */

import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Handshake, Landmark, Mail, Scale, TrendingUp } from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Button } from '@/components/ui/button'
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
 * CAPAS DE FONDO — lo que hace visible el cristal
 *
 * Los CUATRO <i> son obligatorios: cada uno es un campo de color distinto, y
 * sin ellos un panel translúcido sobre un fondo casi blanco se ve exactamente
 * igual que un panel blanco.
 *
 * `soft` baja la aurora al 70%. Es lo que pide un documento legal —cabecera con
 * vida, color que no compite con once secciones de texto— y no toca ninguna
 * regla de contraste, porque bajar la opacidad ACLARA el fondo: los números
 * medidos a plena intensidad (ink 10.2:1 directo sobre la aurora, ink-muted
 * 3.83, ink-subtle 3.23) son el peor caso y con menos aurora todos mejoran. Lo
 * que NO cambia es el reparto: sobre la aurora solo va `text-ink`, y el texto
 * secundario vive dentro de un panel de cristal.
 *
 * Dos secciones con aurora contra un presupuesto medido de tres, el pie aparte.
 * El documento pone su color con `.grad-soft`, un gradiente fijo que no se
 * anima y por tanto no consume capa compuesta.
 * ════════════════════════════════════════════════════════════════
 */
function Backdrop({ soft = false }: { soft?: boolean }) {
  return (
    <>
      <div className={soft ? 'aurora opacity-70' : 'aurora'} aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="grain" aria-hidden="true" />
      <div className="grid-fade" aria-hidden="true" />
    </>
  )
}

interface LegalSection {
  /**
   * Id del ancla. La tabla de contenido se arma del mismo arreglo, así que no
   * puede discrepar de las secciones que existen.
   */
  id: string
  title: string
  body: ReactNode
}

export default async function TermsPage({ params }: Props) {
  const { locale: rawLocale } = await params
  setRequestLocale(rawLocale)

  const locale = rawLocale as Locale
  const en = locale === 'en'

  const t = await getTranslations('legal')

  const mailto = `mailto:${NAP.email}`
  const emailLink = <a href={mailto}>{NAP.email}</a>

  const updatedLabel = en ? 'August 19, 2026' : '19 de agosto de 2026'

  const privacyLink = <Link href="/privacidad">{t('privacyTitle')}</Link>

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
  const highlights = en
    ? [
        {
          icon: TrendingUp,
          title: 'No ranking guarantees',
          text: 'Nothing published here promises positions, traffic or revenue. Any figure in a proposal is an estimate.',
        },
        {
          icon: Handshake,
          title: 'Reading does not hire me',
          text: 'Work exists only with a written proposal accepted by both sides. That document prevails over this page.',
        },
        {
          icon: Landmark,
          title: 'Mexican law applies',
          text: 'These terms are governed by Mexican federal law, with venue in the courts of Mexico City.',
        },
      ]
    : [
        {
          icon: TrendingUp,
          title: 'Sin garantía de posiciones',
          text: 'Nada de lo publicado aquí promete posiciones, tráfico ni ingresos. Cualquier cifra en una propuesta es una estimación.',
        },
        {
          icon: Handshake,
          title: 'Leerme no es contratarme',
          text: 'El trabajo existe solo con una propuesta escrita aceptada por ambas partes. Ese documento prevalece sobre esta página.',
        },
        {
          icon: Landmark,
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

      {/* ══ CABECERA ══════════════════════════════════════════════
          Misma estructura que el aviso de privacidad: aurora suave, grano y
          cuadrícula en -z-10 dentro de un contenedor
          `relative isolate overflow-hidden`, decorativas y sin capturar
          eventos.

          Sin <PointerGlow /> a propósito: es un documento largo que se lee con
          scroll, no una cabecera de aterrizaje. */}
      <section className="relative isolate overflow-hidden border-b border-hairline">
        <Backdrop soft />

        <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
          <Breadcrumbs items={[{ label: t('termsTitle') }]} className="enter" />

          <div className="mt-10 max-w-3xl">
            <p className="eyebrow enter-scale step-1">
              <Scale className="size-3.5" aria-hidden="true" />
              Legal
            </p>

            {/* `text-ink` y no un recorte con gradiente: el título de unos
                términos es el nombre legal del documento. Es también el único
                color de texto que aguanta ir DIRECTO sobre la aurora (10.2:1);
                el acento lo pone la barra de gradiente de abajo. */}
            <h1 className="enter-blur step-2 mt-6 text-d1 text-ink">
              {t('termsTitle')}
            </h1>
            <span
              className="grad-deco enter step-2 mt-6 block h-1 w-12 rounded-full"
              aria-hidden="true"
            />

            {/* ── POR QUÉ EL LEAD VA DENTRO DE CRISTAL ──
                Medido: sobre la aurora `ink-muted` cae a 3.83:1 y `ink-subtle`
                a 3.23:1, y ninguno pasa. Dentro de `.glass-strong` miden 5.1 y
                4.54. `strong` y no el cristal por defecto porque aquí dentro
                vive la fecha, que es `ink-subtle`: en `.glass` se queda en 4.30
                y no llega a 4.5. */}
            <div className="glass glass-strong glass-spec enter step-3 mt-7 p-6 sm:p-7">
              <p className="text-lead text-ink-muted">{t('termsLead')}</p>
              <p className="mt-5 text-sm text-ink-subtle">
                {t('lastUpdated')}:{' '}
                <time dateTime={LAST_UPDATED} data-numeric="">
                  {updatedLabel}
                </time>
              </p>
            </div>
          </div>

          {/* Las tres cláusulas que más cambian lo que alguien espera, sin
              obligar a leer once secciones para encontrarlas.

              Tres nodos y tres transformes, que no es redundancia: la entrada
              (`.enter`) va en el <li> —una animación con `fill: both` se queda
              dueña del `transform` de su elemento para siempre—, la inclinación
              en hover (`.tilt-hover`) va en el <div>, y la perspectiva
              compartida (`.scene`) en el <ul>, que es lo que hace que las tres
              giren hacia un mismo punto de fuga. */}
          <ul className="scene mt-12 grid gap-4 sm:grid-cols-3">
            {highlights.map((item, index) => {
              const Icon = item.icon
              return (
                <li key={item.title} className={`enter step-${index + 4}`}>
                  <div className="tilt-hover h-full rounded-2xl">
                    {/* `.glass` a secas: aquí dentro no hay `ink-subtle`, y
                        `ink-muted` sobre el cristal por defecto mide 5.1. */}
                    <div className="glass glass-spec h-full p-5">
                      <span
                        className="grad-deco inline-flex size-10 items-center justify-center rounded-xl text-white shadow-glow-brand"
                        aria-hidden="true"
                      >
                        <Icon className="size-5" />
                      </span>
                      <p className="mt-4 text-sm font-bold text-ink">
                        {item.title}
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* ══ DOCUMENTO ══════════════════════════════════════════════
          Banda de `.grad-soft` y no una tercera aurora: es un
          `background-image` fijo, así que da el color que el cristal necesita
          detrás SIN consumir una capa compuesta ni animar nada bajo una página
          larga. Mismo patrón que sostiene el cristal de la banda del stack en
          la home.                                                        */}
      <section className="grad-soft border-y border-hairline">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:gap-16">
            {/* Contenido. Fijo en escritorio, lista simple sobre el texto en
                móvil: un documento legal se navega, no se lee de corrido.

                ⚠ ES `.card` (OPACA) Y NO CRISTAL, A PROPÓSITO. Un panel fijo
                con `backdrop-filter` se queda quieto mientras el fondo se
                desplaza debajo, así que el navegador tiene que volver a
                muestrear y difuminar lo que hay detrás en CADA frame de scroll
                — el gasto exacto que hacía sentir lento este sitio. El cristal
                de esta sección va en el documento, que se desplaza con su
                fondo. */}
            <nav
              aria-label={en ? 'Contents' : 'Contenido'}
              className="lg:sticky lg:top-24 lg:self-start"
            >
              <p className="eyebrow">{en ? 'Contents' : 'Contenido'}</p>
              <ol className="card mt-5 p-2">
                {sections.map((section, index) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="press flex gap-3 rounded-lg px-2 py-2.5 text-sm text-ink-muted hover:bg-brand-wash hover:text-brand-strong"
                    >
                      <span data-numeric="" className="text-ink-subtle">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span>{section.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            {/* El documento entero en UN panel de cristal, no once.
                `backdrop-filter` es lo más caro del sistema y las secciones ya
                se separan con su propia línea.

                `strong` es obligatorio: `.prose-rich` pinta párrafos y listas
                en `ink-muted` (5.1 sobre el cristal por defecto, suficiente),
                pero los numerales son `ink-subtle`, que en `.glass` se queda en
                4.30 y no pasa. */}
            <div className="glass glass-strong glass-spec p-6 sm:p-10">
              {sections.map((section, index) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24 border-t border-hairline pt-14 first:border-t-0 first:pt-0"
                >
                  {/* ⚠ AQUÍ YA NO HAY `.reveal`, Y NO ES OLVIDO. Antes lo
                      llevaba el bloque del encabezado, cuando el documento no
                      estaba dentro de un panel de cristal. Ahora sí lo está, y
                      once animaciones ligadas al scroll DENTRO de una
                      superficie con `backdrop-filter` obligan a recomponer ese
                      desenfoque mientras se hace scroll — el gasto exacto que
                      hacía sentir lento este sitio. El movimiento de la página
                      lo pone la aurora de la cabecera; unos términos se leen,
                      no se coreografían. */}
                  <div>
                    <span
                      data-numeric=""
                      className="grad-text font-display text-sm font-bold"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h2 className="mt-2 text-d2 text-ink">{section.title}</h2>
                  </div>

                  {/* El h2 vive fuera de .prose-rich para poder llevar el
                      numeral con gradiente; el cuerpo sí va envuelto, que es lo
                      que fija la medida de 68ch, el ritmo y las viñetas de
                      gradiente. */}
                  <div className="prose-rich mt-5">{section.body}</div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ CIERRE ═════════════════════════════════════════════════
          Segunda y última sección con aurora, esta vez a plena intensidad: es
          una banda corta, con un solo panel de cristal encima y nada que leer
          durante minutos. */}
      <section className="defer-paint relative isolate overflow-hidden border-t border-hairline bg-ground-tint">
        <Backdrop />

        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="glass glass-strong glass-spec max-w-3xl p-7 sm:p-9">
            <h2 className="text-d2 text-ink">
              {en
                ? 'Need something clarified before we work together?'
                : '¿Necesitas aclarar algo antes de trabajar juntos?'}
            </h2>
            <p className="mt-4 text-ink-muted">
              {en
                ? 'Scope, deadlines and price live in a written proposal, not on this page. Tell me what you need and I will put it in writing.'
                : 'El alcance, los tiempos y el precio van en una propuesta escrita, no en esta página. Cuéntame qué necesitas y lo pongo por escrito.'}
            </p>

            {/* `outline` y `ghost`, nunca el variant `glass`: los dos botones
                están DENTRO de un panel de cristal, y cristal sobre cristal
                difumina dos veces, cuesta el doble y se ve peor. */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild variant="outline">
                <a href={mailto}>
                  <Mail className="size-4" aria-hidden="true" />
                  {NAP.email}
                </a>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/privacidad">{t('privacyTitle')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
