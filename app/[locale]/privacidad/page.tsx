/**
 * ════════════════════════════════════════════════════════════════════════
 * NOTA PARA QUIEN MANTENGA ESTE ARCHIVO — a propósito es un comentario y no
 * texto visible.
 *
 * Este aviso de privacidad es un PUNTO DE PARTIDA TÉCNICO. Cada afirmación de
 * hecho se derivó leyendo el código que de verdad toca datos personales:
 * components/sections/contact-form.tsx, app/[locale]/layout.tsx y la política
 * de seguridad de next.config.ts. NO es asesoría legal y NO lo ha revisado un
 * abogado. Que lo revise un abogado mexicano en materia de protección de datos
 * antes de confiar en él; en particular: el domicilio que la LFPDPPP pide
 * publicar (aquí solo se publica un canal de correo), los plazos exactos de
 * respuesta a una solicitud ARCO y qué autoridad es hoy la competente para
 * recibir quejas.
 *
 * REESCRITO POR COMPLETO EL 2026-08-19. La versión anterior describía una
 * recolección de datos que YA NO EXISTE: mencionaba Firestore, las colecciones
 * 'contact_messages' y 'newsletter_subscribers', un newsletter y hasta una
 * preferencia de tema en localStorage. Nada de eso queda en el proyecto. Los
 * hechos vigentes, verificables en el código, son:
 *
 *   - No hay base de datos. No hay servidor que reciba formularios. No hay
 *     newsletter ni lista de correo.
 *   - El formulario de contacto compone un `mailto:` y abre la aplicación de
 *     correo del visitante. Lo que escribe viaja por su propio proveedor de
 *     correo; el sitio no lo almacena ni lo transmite.
 *   - Vercel Analytics + Speed Insights: medición agregada y sin cookies.
 *   - No hay cuentas de usuario, ni cookies publicitarias, ni Google
 *     Analytics, ni píxel de Meta, ni rastreadores de terceros.
 *   - El sitio no escribe en localStorage ni en sessionStorage.
 *
 * REGLA DE MANTENIMIENTO: si el flujo de datos cambia —un formulario que sí
 * envíe a un servidor, un proveedor nuevo, una herramienta de medición que sí
 * ponga cookies— este archivo cambia en el MISMO commit y LAST_UPDATED se
 * mueve con él. Un aviso de privacidad inexacto es peor que no tenerlo.
 * ════════════════════════════════════════════════════════════════════════
 */

import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Cookie, Database, Mail, ShieldCheck } from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Button } from '@/components/ui/button'
import { NAP } from '@/lib/constants'
import { generatePageMetadata } from '@/lib/seo'
import { generateLegalPageGraph } from '@/lib/schema'
import { Locale } from '@/data/types'

interface Props {
  params: Promise<{ locale: string }>
}

/** Fecha real de la última edición de fondo. También alimenta el JSON-LD. */
const LAST_UPDATED = '2026-08-19'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const en = locale === 'en'

  return generatePageMetadata({
    locale: locale as Locale,
    route: 'privacidad',
    title: en
      ? 'Privacy Notice & ARCO Rights'
      : 'Aviso de privacidad y derechos ARCO',
    description: en
      ? 'No database, no form server, no tracking cookies. What reaches my inbox, how long it is kept, and how to exercise your ARCO rights under the LFPDPPP.'
      : 'Sin base de datos, sin servidor de formularios y sin cookies de rastreo. Qué llega a mi buzón, cuánto se conserva y cómo ejercer tus derechos ARCO conforme a la LFPDPPP.',
  })
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

/** Los tres hechos que cambian todo lo demás, arriba y en una sola pantalla. */
interface Highlight {
  icon: typeof Database
  title: string
  text: string
}

export default async function PrivacyPage({ params }: Props) {
  const { locale: rawLocale } = await params
  setRequestLocale(rawLocale)

  const locale = rawLocale as Locale
  const en = locale === 'en'

  const t = await getTranslations('legal')

  const mailto = `mailto:${NAP.email}`
  const emailLink = <a href={mailto}>{NAP.email}</a>

  const updatedLabel = en ? 'August 19, 2026' : '19 de agosto de 2026'

  const highlights: Highlight[] = en
    ? [
        {
          icon: Database,
          title: 'No database',
          text: 'This site neither receives nor stores what you type. There is no form server behind it.',
        },
        {
          icon: Mail,
          title: 'The form opens your email app',
          text: 'It writes the message and hands it to you. Your email travels through your own provider, not through this site.',
        },
        {
          icon: Cookie,
          title: 'No tracking cookies',
          text: 'Which is why there is no consent banner: there would be nothing to consent to.',
        },
      ]
    : [
        {
          icon: Database,
          title: 'Sin base de datos',
          text: 'Este sitio no recibe ni guarda nada de lo que escribes. No hay un servidor de formularios detrás.',
        },
        {
          icon: Mail,
          title: 'El formulario abre tu correo',
          text: 'Redacta el mensaje y te lo entrega. Tu correo viaja por tu propio proveedor, no por este sitio.',
        },
        {
          icon: Cookie,
          title: 'Sin cookies de rastreo',
          text: 'Por eso no hay banner de consentimiento: no habría nada que consentir.',
        },
      ]

  /**
   * El cuerpo de un documento legal se escribe aquí y no en messages/*.json:
   * es un documento, no cadenas de interfaz, y el catálogo es compartido. Las
   * dos versiones son hermanas completas — un aviso de privacidad que solo
   * existe en un idioma no es un aviso de privacidad para el otro mercado.
   */
  const sections: LegalSection[] = en
    ? [
        {
          id: 'controller',
          title: 'Who is responsible for your data',
          body: (
            <>
              <p>
                The party responsible for the personal data that reaches me
                through this site is <strong>Carlos Anaya Ruiz</strong>, an
                independent technical SEO and software development consultant
                operating from Mexico City, Mexico.
              </p>
              <p>
                One person runs this site. There is no team, no agency and no
                sales department that receives your data simply because it
                exists. The channel for anything related to this notice —
                including ARCO requests — is {emailLink}.
              </p>
              <p>
                This document is the privacy notice required by Mexico&rsquo;s
                Federal Law on the Protection of Personal Data Held by Private
                Parties (LFPDPPP). It describes the processing that actually
                happens here, not a generic template.
              </p>
            </>
          ),
        },
        {
          id: 'no-collection',
          title: 'First things first: this site does not receive your data',
          body: (
            <>
              <p>
                It is worth saying before anything else, because it changes
                everything that follows:{' '}
                <strong>
                  this site has no database, no server that receives forms and
                  no mailing list
                </strong>
                . There is no place where this site keeps anything of yours.
              </p>
              <p>
                The contact form does not submit to any server. When you fill it
                in and click, the site assembles a <code>mailto:</code> link
                with the subject and message already written and opens the email
                application on your device. From there <em>you</em> send the
                email, from your own account and through your own email
                provider. The site does not store it, does not transmit it and
                cannot read it — its security policy (
                <code>form-action &lsquo;self&rsquo;</code>) even prevents a form
                on these pages from pointing at an outside host.
              </p>
              <p>
                You can verify this yourself: open your browser&rsquo;s
                developer tools, watch the network tab and submit the form. No
                outgoing request appears, because there is nowhere for one to
                go.
              </p>
              <p>
                There is also a button that copies my address to your clipboard,
                for anyone without a configured email app. That happens entirely
                on your own device.
              </p>
              <p>
                So the processing of personal data begins when your email
                arrives in my inbox — not before. The rest of this notice
                describes what I do with what lands there.
              </p>
            </>
          ),
        },
        {
          id: 'data',
          title: 'What reaches my inbox, and what the site measures',
          body: (
            <>
              <h3>What you choose to write</h3>
              <p>
                Exactly the fields you can see in the form: your name, your
                email address, a subject line and your message. If you write
                less, less arrives. None of it is needed in order to browse the
                site — they are the fields of an email you compose and you send.
              </p>
              <h3>Technical request data</h3>
              <p>
                As on any website, the infrastructure serving these pages
                processes request data — IP address, user agent, requested URL —
                in order to deliver the page and to measure traffic in
                aggregate. That measurement uses no cookies and builds no
                persistent profile of you; the detail is in the cookies section
                below.
              </p>
              <h3>What this site does not collect</h3>
              <p>
                There are no user accounts and no sign-up, so no passwords
                exist. There is no newsletter and no mailing list, so there is
                no list your address could end up on. Payment or card data, your
                phone number, your precise location and sensitive personal data
                (health, ethnic or racial origin, religious beliefs, political
                opinions, sexual preference) are never requested. The site also
                sends a <code>Permissions-Policy</code> header that denies
                camera, microphone and geolocation at the browser level, so this
                domain cannot even ask you for them.
              </p>
              <p>
                I do not address minors: this site speaks to professionals and
                businesses. If you are a parent or guardian and believe a minor
                wrote to me, tell me and I will delete the email.
              </p>
              <p>
                If you include confidential or sensitive information inside your
                message, you do so on your own initiative. Please do not: email
                is not an end-to-end encrypted channel. That is what a call
                and, where needed, a signed non-disclosure agreement are for.
              </p>
            </>
          ),
        },
        {
          id: 'purposes',
          title: 'What I use what you write for',
          body: (
            <>
              <h3>Primary purposes</h3>
              <ul>
                <li>Reading your enquiry, answering it and following up.</li>
                <li>
                  If the conversation progresses, preparing and sending you a
                  service proposal.
                </li>
                <li>
                  Keeping the email thread as a record of what was discussed and
                  agreed.
                </li>
              </ul>
              <h3>There are no secondary purposes</h3>
              <p>
                There is no newsletter to add you to, no distribution list and
                no remarketing. And not as a policy I could quietly reverse: the
                infrastructure to do it does not exist here.
              </p>
              <p>
                <strong>What I never do with your data:</strong> I do not sell
                it, transfer it, trade it, or enrich it against third-party
                databases. I build no profiles and make no automated decisions
                that affect you. Writing to me puts you on no list.
              </p>
            </>
          ),
        },
        {
          id: 'consent',
          title: 'Consent, and how to withdraw it',
          body: (
            <>
              <p>
                The form will not open your email client unless you tick the
                consent box. That is a technical requirement, not a pre-ticked
                courtesy, and what you consent to is narrow: that I use what you
                write only in order to answer you.
              </p>
              <p>
                No record of that tick is stored anywhere, because there is
                nowhere to store it. The box is the condition for the message to
                be handed to your email app, and the email you send is itself
                the evidence that you chose to send it.
              </p>
              <p>
                You can withdraw your consent at any time by writing to{' '}
                {emailLink}. Withdrawing it means I delete your message and its
                thread from my inbox and stop using your data, unless I have to
                keep something to meet a legal or tax obligation or to defend a
                legal claim.
              </p>
              <p>
                You can also ask me to limit the use or disclosure of your data
                without deleting it outright.
              </p>
            </>
          ),
        },
        {
          id: 'processors',
          title: 'Who else is involved',
          body: (
            <>
              <p>
                The site is served from <strong>Vercel</strong> infrastructure,
                which also provides the aggregate traffic and performance
                measurement (Vercel Analytics and Speed Insights). That is the
                only third party involved in running these pages.
              </p>
              <p>
                The emails you send me live with my email provider, as they
                would with any consultancy. They do not pass through this site.
              </p>
              <p>
                There is no CRM, no email marketing platform, no advertising
                pixel, no Google Analytics, no Meta Pixel, no third-party chat
                widget, no embedded maps and no embedded video. The typefaces
                are self-hosted at build time, so your browser makes no request
                to Google Fonts, and every image is served from this same
                domain.
              </p>
              <h3>Transfers outside Mexico</h3>
              <p>
                Vercel operates global infrastructure, so these pages are served
                — and the aggregate metrics processed — from servers that may be
                outside Mexico, typically in the United States. That measurement
                is aggregate and does not identify you.
              </p>
              <p>
                Your email is a different matter: it travels from your provider
                to mine, and that transfer is one you make when you press send,
                under the terms of those two providers. Beyond that, your data
                goes nowhere, because there is nowhere to send it.
              </p>
            </>
          ),
        },
        {
          id: 'cookies',
          title: 'Cookies and analytics: why there is no banner',
          body: (
            <>
              <p>
                This site sets no advertising cookies and no third-party
                tracking cookies. There is no Google Analytics, no Meta Pixel,
                no remarketing and no identifier shared with anyone.
              </p>
              <p>
                The only measurement is Vercel Analytics and Vercel Speed
                Insights. They count visits, page views, referrers and
                performance metrics (Core Web Vitals) in aggregate, without
                cookies and without a persistent identifier that follows you
                between sessions or across sites.
              </p>
              <p>
                <strong>
                  That is why you will not see a cookie consent dialog here:
                  there would be nothing to consent to.
                </strong>{' '}
                A banner asking permission for something that does not happen is
                compliance theatre, and I would rather say so in this notice
                than put an obstacle on your first screen. If I ever add a tool
                that genuinely requires consent, the banner will appear and this
                notice will say so first.
              </p>
              <p>
                Nothing is kept in your browser either: the site writes neither
                to <code>localStorage</code> nor to <code>sessionStorage</code>.
                It has a single visual theme, so there is not even a preference
                to remember.
              </p>
            </>
          ),
        },
        {
          id: 'retention',
          title: 'How long it is kept',
          body: (
            <>
              <p>
                This site keeps nothing, because it has nowhere to. What gets
                kept are emails in an inbox:
              </p>
              <ul>
                <li>
                  <strong>An enquiry that went nowhere:</strong> up to 24 months
                  after the last exchange, and sooner if you ask me to delete
                  it.
                </li>
                <li>
                  <strong>A working relationship:</strong> for as long as the
                  applicable contractual, tax and accounting obligations
                  require.
                </li>
                <li>
                  <strong>Vercel metrics:</strong> aggregate and
                  non-identifying, so there is no personal datum of yours there
                  to expire.
                </li>
              </ul>
              <p>
                Once the period is over, the email is deleted from the inbox and
                from the trash.
              </p>
            </>
          ),
        },
        {
          id: 'security',
          title: 'Security measures',
          body: (
            <>
              <p>
                These are technical and checkable from outside, not a generic
                promise:
              </p>
              <ul>
                <li>
                  The strongest measure is that there is nothing here to steal:
                  with no database and no accounts, there is no store of
                  personal data that could leak.
                </li>
                <li>
                  All traffic is encrypted in transit over HTTPS/TLS, enforced
                  with HSTS (a two-year <code>max-age</code>, subdomains
                  included).
                </li>
                <li>
                  A Content Security Policy restricts where the site may load
                  code from and, with{' '}
                  <code>form-action &lsquo;self&rsquo;</code>, stops an injected
                  form from pointing at someone else&rsquo;s server.
                </li>
                <li>
                  <code>Permissions-Policy</code> denies camera, microphone and
                  geolocation, and{' '}
                  <code>frame-ancestors &lsquo;none&rsquo;</code> stops another
                  site from framing these pages.
                </li>
                <li>
                  The image optimiser accepts no remote hosts, so this domain
                  cannot be used as a proxy for third-party content.
                </li>
              </ul>
              <p>
                From the inbox onwards, my email provider&rsquo;s measures
                apply. No system is infallible: if something happens that
                materially affects your data, I will tell you by email what I
                know and what I am doing about it.
              </p>
            </>
          ),
        },
        {
          id: 'arco',
          title: 'Your ARCO rights and how to exercise them',
          body: (
            <>
              <p>
                The LFPDPPP grants you four rights over your data, known
                together as ARCO rights:
              </p>
              <ul>
                <li>
                  <strong>Access:</strong> knowing what data of yours I hold and
                  what I use it for.
                </li>
                <li>
                  <strong>Rectification:</strong> correcting it if it is wrong
                  or incomplete.
                </li>
                <li>
                  <strong>Cancellation:</strong> asking me to delete it.
                </li>
                <li>
                  <strong>Opposition:</strong> asking me to stop using it for a
                  specific purpose.
                </li>
              </ul>
              <p>
                You may also withdraw your consent and ask me to limit the use
                or disclosure of your data.
              </p>
              <h3>How to exercise them</h3>
              <p>
                Write to {emailLink} with <code>ARCO</code> in the subject line
                and include: the address you wrote to me from (that is what lets
                me find the thread), which right you want to exercise, and — for
                rectification — the correct value. I may ask for one additional
                detail to confirm the request comes from you, such as the
                approximate date of your message.
              </p>
              <p>
                In practice this is simple on both sides: everything I hold
                about you is one email thread, so access means forwarding you
                what I have, and cancellation means deleting it.
              </p>
              <p>
                The process is free and I will answer within the deadlines the
                LFPDPPP sets. If you believe your request was not handled
                properly, you can escalate to the competent Mexican federal data
                protection authority.
              </p>
            </>
          ),
        },
        {
          id: 'changes',
          title: 'Changes to this notice',
          body: (
            <>
              <p>
                If what this site does with data changes — a form that does post
                to a server, a different provider, a measurement tool that does
                use cookies — I update this notice and move the last-updated
                date shown at the top, in the same change that touches the code.
                The version published here is always the one in force.
              </p>
              <p>
                Any question about this document goes to the same place:{' '}
                {emailLink}.
              </p>
            </>
          ),
        },
      ]
    : [
        {
          id: 'responsable',
          title: 'Quién es el responsable de tus datos',
          body: (
            <>
              <p>
                El responsable del tratamiento de los datos personales que me
                llegan a través de este sitio es{' '}
                <strong>Carlos Anaya Ruiz</strong>, consultor independiente de
                SEO técnico y desarrollo de software, con base de operación en
                Ciudad de México, México.
              </p>
              <p>
                Este sitio lo opera una sola persona. No hay equipo, ni agencia,
                ni área comercial que reciba tus datos por el simple hecho de
                que existan. El canal para cualquier asunto relacionado con este
                aviso —incluidas las solicitudes de derechos ARCO— es{' '}
                {emailLink}.
              </p>
              <p>
                Este documento es el aviso de privacidad que exige la Ley
                Federal de Protección de Datos Personales en Posesión de los
                Particulares (LFPDPPP) y describe el tratamiento que de verdad
                ocurre aquí, no una plantilla genérica.
              </p>
            </>
          ),
        },
        {
          id: 'sin-recoleccion',
          title: 'Lo primero: este sitio no recibe tus datos',
          body: (
            <>
              <p>
                Conviene decirlo antes que nada, porque cambia todo lo demás:{' '}
                <strong>
                  este sitio no tiene base de datos, no tiene servidor que reciba
                  formularios y no tiene lista de correo
                </strong>
                . No existe un lugar donde este sitio guarde algo tuyo.
              </p>
              <p>
                El formulario de contacto no envía nada a ningún servidor. Cuando
                lo llenas y haces clic, el sitio arma un enlace{' '}
                <code>mailto:</code> con el asunto y el mensaje ya escritos y
                abre la aplicación de correo de tu dispositivo. De ahí en
                adelante <em>tú</em> envías el correo, desde tu propia cuenta y
                por tu propio proveedor. El sitio no lo almacena, no lo
                transmite y no puede leerlo: su política de seguridad (
                <code>form-action &lsquo;self&rsquo;</code>) incluso impide que
                un formulario de estas páginas apunte a un host externo.
              </p>
              <p>
                Puedes comprobarlo tú mismo: abre las herramientas de
                desarrollador de tu navegador, mira la pestaña de red y envía el
                formulario. No aparece ninguna petición saliente, porque no hay a
                dónde mandarla.
              </p>
              <p>
                También hay un botón que copia mi correo a tu portapapeles, para
                quien no tenga una aplicación de correo configurada. Eso ocurre
                por completo en tu dispositivo.
              </p>
              <p>
                Así que el tratamiento de datos personales empieza cuando tu
                correo llega a mi buzón, no antes. El resto de este aviso
                describe qué hago con lo que llega ahí.
              </p>
            </>
          ),
        },
        {
          id: 'datos',
          title: 'Qué llega a mi buzón y qué mide el sitio',
          body: (
            <>
              <h3>Lo que tú decides escribir</h3>
              <p>
                Exactamente los campos que ves en el formulario: tu nombre, tu
                correo, un asunto y tu mensaje. Si escribes menos, llega menos.
                Nada de eso hace falta para navegar el sitio: son los campos de
                un correo que tú redactas y tú envías.
              </p>
              <h3>Datos técnicos de la solicitud</h3>
              <p>
                Como en cualquier sitio web, la infraestructura que lo sirve
                procesa datos de la solicitud —dirección IP, agente de usuario,
                URL pedida— para entregarte la página y para medir el tráfico de
                forma agregada. Esa medición no usa cookies ni construye un
                perfil persistente sobre ti; el detalle está en la sección de
                cookies.
              </p>
              <h3>Lo que este sitio no recoge</h3>
              <p>
                No hay cuentas de usuario ni registro, así que no existen
                contraseñas. No hay boletín ni lista de correo, así que no existe
                una lista en la que tu dirección pueda acabar. Nunca se piden
                datos de pago o de tarjeta, tu teléfono, tu ubicación precisa ni
                datos personales sensibles (salud, origen étnico o racial,
                creencias religiosas, opiniones políticas, preferencia sexual).
                El sitio además envía una cabecera{' '}
                <code>Permissions-Policy</code> que niega cámara, micrófono y
                geolocalización a nivel de navegador: este dominio no puede ni
                pedírtelos.
              </p>
              <p>
                No me dirijo a menores de edad: este sitio le habla a
                profesionales y empresas. Si eres madre, padre o tutor y crees
                que un menor me escribió, dímelo y elimino el correo.
              </p>
              <p>
                Si dentro de tu mensaje incluyes información confidencial o
                sensible, lo haces por iniciativa propia. Te pido que no lo
                hagas: el correo electrónico no es un canal cifrado de extremo a
                extremo. Para eso existe una llamada y, cuando hace falta, un
                acuerdo de confidencialidad firmado.
              </p>
            </>
          ),
        },
        {
          id: 'finalidades',
          title: 'Para qué uso lo que me escribes',
          body: (
            <>
              <h3>Finalidades primarias</h3>
              <ul>
                <li>Leer tu consulta, responderla y darle seguimiento.</li>
                <li>
                  Si la conversación avanza, preparar y enviarte una propuesta
                  de servicio.
                </li>
                <li>
                  Conservar el hilo de correo como constancia de lo que se habló
                  y se acordó.
                </li>
              </ul>
              <h3>No hay finalidades secundarias</h3>
              <p>
                No hay boletín al que pueda agregarte, no hay lista de difusión y
                no hay remarketing. Y no como una política que podría revertir en
                silencio: aquí no existe la infraestructura para hacerlo.
              </p>
              <p>
                <strong>Lo que nunca hago con tus datos:</strong> no los vendo,
                no los cedo, no los intercambio y no los enriquezco con bases de
                terceros. No construyo perfiles ni tomo decisiones automatizadas
                que te afecten. Escribirme no te mete en ninguna lista.
              </p>
            </>
          ),
        },
        {
          id: 'consentimiento',
          title: 'Consentimiento y cómo revocarlo',
          body: (
            <>
              <p>
                El formulario no abre tu cliente de correo si no marcas la
                casilla de consentimiento: es un requisito técnico, no una
                casilla premarcada. Y lo que consientes es concreto: que use lo
                que escribas únicamente para responderte.
              </p>
              <p>
                De esa casilla no se guarda registro en ninguna parte, porque no
                hay dónde guardarlo. La casilla es la condición para que el
                mensaje pase a tu aplicación de correo, y el correo que envías es
                por sí mismo la evidencia de que decidiste mandarlo.
              </p>
              <p>
                Puedes revocar tu consentimiento cuando quieras escribiendo a{' '}
                {emailLink}. Revocarlo significa que elimino tu mensaje y su hilo
                de mi buzón y dejo de usar tus datos, salvo que deba conservar
                algo por una obligación legal o fiscal, o para defender un
                derecho.
              </p>
              <p>
                También puedes pedirme que limite el uso o la divulgación de tus
                datos sin llegar a cancelarlos.
              </p>
            </>
          ),
        },
        {
          id: 'terceros',
          title: 'Quién más participa',
          body: (
            <>
              <p>
                El sitio se sirve desde la infraestructura de{' '}
                <strong>Vercel</strong>, que además provee la medición agregada
                de tráfico y rendimiento (Vercel Analytics y Speed Insights). Ese
                es el único tercero que participa en el funcionamiento de estas
                páginas.
              </p>
              <p>
                Los correos que me escribes viven en mi proveedor de correo, como
                en cualquier consultoría. No pasan por este sitio.
              </p>
              <p>
                No hay CRM, ni plataforma de email marketing, ni píxel
                publicitario, ni Google Analytics, ni Meta Pixel, ni chat de
                terceros, ni mapas embebidos, ni video incrustado. Las
                tipografías se auto-hospedan en el build, así que tu navegador no
                hace ni una petición a Google Fonts, y todas las imágenes se
                sirven desde este mismo dominio.
              </p>
              <h3>Transferencias fuera de México</h3>
              <p>
                Vercel opera infraestructura global, por lo que estas páginas se
                sirven —y las métricas agregadas se procesan— desde servidores
                que pueden estar fuera de México, normalmente en Estados Unidos.
                Esa medición es agregada y no te identifica.
              </p>
              <p>
                Tu correo es otra cosa: viaja de tu proveedor al mío, y esa
                transferencia la haces tú al darle enviar, bajo los términos de
                esos dos proveedores. Más allá de eso, tus datos no van a ningún
                lado, porque no hay a dónde mandarlos.
              </p>
            </>
          ),
        },
        {
          id: 'cookies',
          title: 'Cookies y analítica: por qué no hay banner',
          body: (
            <>
              <p>
                Este sitio no coloca cookies publicitarias ni cookies de
                seguimiento de terceros. No hay Google Analytics, no hay Meta
                Pixel, no hay remarketing y no hay ningún identificador que se
                comparta con nadie.
              </p>
              <p>
                La única medición es Vercel Analytics y Vercel Speed Insights:
                cuentan visitas, páginas vistas, referentes y métricas de
                rendimiento (Core Web Vitals) de forma agregada, sin cookies y
                sin un identificador persistente que te siga entre sesiones o
                entre sitios.
              </p>
              <p>
                <strong>
                  Por eso no verás aquí una ventana de consentimiento de
                  cookies: no habría nada que consentir.
                </strong>{' '}
                Un banner que pide permiso para algo que no ocurre es teatro de
                cumplimiento, y prefiero decirlo en este aviso que ponerte un
                obstáculo en la primera pantalla. Si algún día añado una
                herramienta que sí requiera consentimiento, aparecerá el banner y
                este aviso lo dirá antes.
              </p>
              <p>
                Tampoco queda nada guardado en tu navegador: el sitio no escribe
                en <code>localStorage</code> ni en <code>sessionStorage</code>.
                Tiene un solo tema visual, así que no hay ni una preferencia que
                recordar.
              </p>
            </>
          ),
        },
        {
          id: 'conservacion',
          title: 'Cuánto tiempo se conserva',
          body: (
            <>
              <p>
                Este sitio no conserva nada, porque no tiene dónde. Lo que se
                conserva son correos en un buzón:
              </p>
              <ul>
                <li>
                  <strong>Una consulta que no avanzó:</strong> como máximo 24
                  meses después del último intercambio, y antes si me pides que
                  la elimine.
                </li>
                <li>
                  <strong>Una relación de trabajo:</strong> el tiempo que exijan
                  las obligaciones contractuales, fiscales y contables
                  aplicables.
                </li>
                <li>
                  <strong>Las métricas de Vercel:</strong> son agregadas y no te
                  identifican, así que ahí no hay un dato personal tuyo que
                  caduque.
                </li>
              </ul>
              <p>
                Cumplido el plazo, el correo se elimina del buzón y de la
                papelera.
              </p>
            </>
          ),
        },
        {
          id: 'seguridad',
          title: 'Medidas de seguridad',
          body: (
            <>
              <p>
                Son técnicas y comprobables desde fuera, no una promesa
                genérica:
              </p>
              <ul>
                <li>
                  La medida más fuerte es que aquí no hay nada que robar: sin
                  base de datos y sin cuentas, no existe un almacén de datos
                  personales que pueda filtrarse.
                </li>
                <li>
                  Todo el tráfico viaja cifrado con HTTPS/TLS, forzado con HSTS
                  (un <code>max-age</code> de dos años, subdominios incluidos).
                </li>
                <li>
                  Una Content Security Policy restringe de dónde puede cargar
                  código el sitio y, con{' '}
                  <code>form-action &lsquo;self&rsquo;</code>, impide que un
                  formulario inyectado apunte al servidor de alguien más.
                </li>
                <li>
                  <code>Permissions-Policy</code> niega cámara, micrófono y
                  geolocalización, y{' '}
                  <code>frame-ancestors &lsquo;none&rsquo;</code> evita que otro
                  sitio incruste estas páginas.
                </li>
                <li>
                  El optimizador de imágenes no acepta hosts remotos, así que
                  este dominio no puede usarse como proxy de contenido ajeno.
                </li>
              </ul>
              <p>
                Del buzón para adentro aplican las medidas de mi proveedor de
                correo. Ningún sistema es infalible: si ocurre algo que afecte
                tus datos de forma significativa, te lo digo por correo con lo
                que sepa y con lo que esté haciendo al respecto.
              </p>
            </>
          ),
        },
        {
          id: 'arco',
          title: 'Tus derechos ARCO y cómo ejercerlos',
          body: (
            <>
              <p>
                La LFPDPPP te reconoce cuatro derechos sobre tus datos,
                conocidos en conjunto como derechos ARCO:
              </p>
              <ul>
                <li>
                  <strong>Acceso:</strong> saber qué datos tuyos tengo y para
                  qué los uso.
                </li>
                <li>
                  <strong>Rectificación:</strong> corregirlos si están mal o
                  incompletos.
                </li>
                <li>
                  <strong>Cancelación:</strong> pedirme que los elimine.
                </li>
                <li>
                  <strong>Oposición:</strong> pedirme que deje de usarlos para
                  una finalidad concreta.
                </li>
              </ul>
              <p>
                Además puedes revocar tu consentimiento y pedirme que limite el
                uso o la divulgación de tus datos.
              </p>
              <h3>Cómo ejercerlos</h3>
              <p>
                Escríbeme a {emailLink} con <code>ARCO</code> en el asunto e
                incluye: el correo desde el que me escribiste (es lo que me
                permite encontrar el hilo), qué derecho quieres ejercer y —si es
                rectificación— el dato correcto. Puedo pedirte un dato adicional
                que confirme que la solicitud viene de ti, por ejemplo la fecha
                aproximada de tu mensaje.
              </p>
              <p>
                En la práctica esto es sencillo para los dos: todo lo que tengo
                de ti es un hilo de correo, así que un acceso es reenviarte lo
                que tengo y una cancelación es borrarlo.
              </p>
              <p>
                El trámite es gratuito y responderé dentro de los plazos que
                marca la LFPDPPP. Si consideras que tu solicitud no fue atendida
                como debía, puedes acudir a la autoridad federal mexicana
                competente en materia de protección de datos personales.
              </p>
            </>
          ),
        },
        {
          id: 'cambios',
          title: 'Cambios a este aviso',
          body: (
            <>
              <p>
                Si cambia lo que este sitio hace con los datos —un formulario que
                sí mande a un servidor, un proveedor distinto, una herramienta de
                medición que sí use cookies— actualizo este aviso y muevo la
                fecha de última actualización que aparece arriba, en el mismo
                cambio que toque el código. La versión publicada aquí es siempre
                la vigente.
              </p>
              <p>
                Cualquier duda sobre este documento va al mismo lugar:{' '}
                {emailLink}.
              </p>
            </>
          ),
        },
      ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateLegalPageGraph(locale, 'privacy', {
              // Idéntico al h1 y al lead renderizados, y a la miga de pan
              // visible de abajo.
              name: t('privacyTitle'),
              description: t('privacyLead'),
              datePublished: LAST_UPDATED,
              dateModified: LAST_UPDATED,
            })
          ),
        }}
      />

      {/* ══ CABECERA ══════════════════════════════════════════════
          La malla animada va en -z-10 dentro de un contenedor
          `relative isolate overflow-hidden`, es decorativa y no captura
          eventos. Ritmo de primera banda de página interior.         */}
      <section className="relative isolate overflow-hidden border-b border-hairline">
        <div className="mesh" aria-hidden="true" />
        <div className="grid-fade" aria-hidden="true" />

        <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
          <Breadcrumbs
            items={[{ label: t('privacyTitle') }]}
            className="enter"
          />

          <div className="mt-10 max-w-3xl">
            <p className="eyebrow enter-scale step-1">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              Legal
            </p>
            <h1 className="enter-blur step-2 mt-6 text-d1 text-ink">
              {t('privacyTitle')}
            </h1>
            <p className="enter step-3 mt-5 text-lead text-ink-muted">
              {t('privacyLead')}
            </p>
            <p className="enter step-4 mt-8 text-sm text-ink-subtle">
              {t('lastUpdated')}:{' '}
              <time dateTime={LAST_UPDATED} data-numeric="">
                {updatedLabel}
              </time>
            </p>
          </div>

          {/* Los tres hechos que definen el documento, sin obligar a nadie a
              leer once secciones para encontrarlos. */}
          <ul className="enter step-5 mt-12 grid gap-4 sm:grid-cols-3">
            {highlights.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.title} className="card card-hover p-5">
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
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* ══ DOCUMENTO ══════════════════════════════════════════════ */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:gap-16">
          {/* Contenido. Fijo en escritorio, lista simple sobre el texto en
              móvil: un documento legal se navega, no se lee de corrido. */}
          <nav
            aria-label={en ? 'Contents' : 'Contenido'}
            className="reveal lg:sticky lg:top-24 lg:self-start"
          >
            <p className="eyebrow">{en ? 'Contents' : 'Contenido'}</p>
            <ol className="mt-5 border-t border-hairline">
              {sections.map((section, index) => (
                <li key={section.id} className="border-b border-hairline">
                  <a
                    href={`#${section.id}`}
                    className="flex gap-3 py-3 text-sm text-ink-muted transition-colors hover:text-brand-strong"
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

          <div className="max-w-[68ch]">
            {sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-24 border-t border-hairline pt-14 first:border-t-0 first:pt-0"
              >
                {/* El `.reveal` va solo en el bloque del encabezado y no en la
                    sección completa: `animation-range: entry` sobre un bloque
                    más alto que la pantalla dejaría el texto a media opacidad
                    mientras se lee. El encabezado es corto y entra entero. */}
                <div className="reveal">
                  <span
                    data-numeric=""
                    className="grad-text font-display text-sm font-bold"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h2 className="mt-2 text-d2 text-ink">{section.title}</h2>
                </div>

                {/* El h2 vive fuera de .prose-rich para poder llevar el numeral
                    con gradiente; el cuerpo sí va envuelto, que es lo que fija
                    la medida de 68ch, el ritmo y las viñetas de gradiente. */}
                <div className="prose-rich mt-5">{section.body}</div>
              </section>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CIERRE ═════════════════════════════════════════════════ */}
      <section className="defer-paint border-t border-hairline bg-ground-tint">
        <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
          <div className="reveal max-w-3xl">
            <h2 className="text-d2 text-ink">
              {en
                ? 'Questions about how your data is handled?'
                : '¿Dudas sobre cómo se tratan tus datos?'}
            </h2>
            <p className="mt-4 text-ink-muted">
              {en
                ? 'Ask directly. The same address handles ARCO requests and anything else in this notice.'
                : 'Pregúntame directamente. La misma dirección atiende solicitudes ARCO y cualquier otro punto de este aviso.'}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild variant="outline">
                <a href={mailto}>
                  <Mail className="size-4" aria-hidden="true" />
                  {NAP.email}
                </a>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/terminos">{t('termsTitle')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
