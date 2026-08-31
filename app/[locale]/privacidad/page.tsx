/**
 * ════════════════════════════════════════════════════════════════════════
 * NOTA PARA QUIEN MANTENGA ESTE ARCHIVO — a propósito es un comentario y no
 * texto visible.
 *
 * Este aviso de privacidad es un PUNTO DE PARTIDA TÉCNICO. Cada afirmación de
 * hecho se derivó leyendo el código que de verdad toca datos personales:
 * components/sections/lead-form.tsx, app/[locale]/lead-action.ts,
 * lib/contact.ts, lib/forward.ts, lib/newsletter.ts, lib/broadcast.ts y la
 * política de seguridad de next.config.ts. NO es asesoría legal y NO lo ha
 * revisado un abogado. Que lo revise un abogado mexicano en materia de
 * protección de datos antes de confiar en él; en particular: el domicilio que
 * la LFPDPPP pide publicar (aquí solo se publica un canal de correo), los
 * plazos exactos de respuesta a una solicitud ARCO y qué autoridad es hoy la
 * competente para recibir quejas.
 *
 * ── LA CORRECCIÓN DEL 2026-08-24, Y POR QUÉ IMPORTA ──
 * Ocho cláusulas de este documento describían un formulario `mailto:` que se
 * retiró: decían que el sitio «no tiene base de datos», que «el formulario no
 * manda nada a ningún servidor» y que el tratamiento «empieza cuando tu correo
 * llega a mi buzón, no antes». Las tres eran falsas desde que el formulario
 * pasó a una Server Action.
 *
 * La peor no era ninguna de ellas: era un párrafo que INVITABA al visitante a
 * abrir la pestaña de red del navegador y comprobar que no sale ninguna
 * petición. Un documento legal que ofrece una verificación que lo desmiente en
 * diez segundos es peor que uno que se limita a estar desactualizado.
 *
 * Los hechos vigentes, verificados en el código:
 *
 *   - El formulario ES una Server Action. Lo que se escribe llega al servidor
 *     y de ahí sale a DOS destinos: el correo por Resend (lib/contact.ts) y el
 *     sistema de gestión propio (lib/forward.ts, LEAD_WEBHOOK_URL). Los dos
 *     están conectados hoy.
 *   - Supabase está PREVISTO y NO conectado: SUPABASE_URL y
 *     SUPABASE_SERVICE_ROLE_KEY están vacías. Por eso la cláusula de seguridad
 *     NO afirma nada sobre row level security: no hay tabla de la que
 *     afirmarlo. ⚠ Cuando se conecte, se nombra el proveedor en «quién más
 *     participa» y se comprueba RLS ANTES de escribir la viñeta.
 *   - Hay un boletín voluntario. Resend manda los Broadcasts, así que el
 *     documento ya NO puede decir «no hay plataforma de email marketing».
 *   - Vercel Analytics + Speed Insights: medición agregada y sin cookies.
 *   - No hay cuentas de usuario, ni cookies publicitarias, ni Google
 *     Analytics, ni píxel de Meta, ni rastreadores de terceros.
 *   - El sitio no escribe en localStorage ni en sessionStorage.
 *   - No hay casilla de consentimiento en el formulario: el consentimiento se
 *     da al enviarlo, y la cláusula lo dice así. Añadir la casilla y dejar el
 *     texto viejo no habría arreglado nada, porque el texto viejo también
 *     afirmaba que del consentimiento no queda registro.
 *
 * REGLA DE MANTENIMIENTO: si el flujo de datos cambia —un proveedor nuevo, un
 * destino más para el formulario, una herramienta de medición que sí ponga
 * cookies— este archivo cambia en el MISMO commit y LAST_UPDATED se mueve con
 * él. Un aviso de privacidad inexacto es peor que no tenerlo, y este documento
 * ya demostró que la deriva ocurre en silencio: el formulario cambió y el
 * aviso se quedó cinco días describiendo el anterior.
 *
 * ── PRESENTACIÓN: «PAPEL AHUMADO» ──
 * Migrado el 2026-08-20. Se fueron la aurora, el grano, la cuadrícula, los
 * paneles de cristal, las tres tarjetas inclinables con su icono en un cuadro
 * y los dos botones del cierre. Lo que queda es lo que un documento legal
 * necesita: una columna de lectura de ~66 ch, un índice de anclas y reglas
 * horizontales. Ni una caja, ni un gradiente, y el único movimiento es
 * `.reveal-stagger` sobre el resumen de tres bandas — un aviso de privacidad
 * se lee, no se coreografía.
 * ════════════════════════════════════════════════════════════════════════
 */

import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Rail } from '@/components/instrument/rail'
import { NAP } from '@/lib/constants'
import { generatePageMetadata } from '@/lib/seo'
import { generateLegalPageGraph } from '@/lib/schema'
import { formatDate } from '@/lib/utils'
import { Locale } from '@/data/types'

interface Props {
  params: Promise<{ locale: string }>
}

/** Fecha real de la última edición de fondo. También alimenta el JSON-LD. */
const LAST_UPDATED = '2026-08-24'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const en = locale === 'en'

  return generatePageMetadata({
    locale: locale as Locale,
    route: 'privacidad',
    title: en
      ? 'Privacy Notice & ARCO Rights'
      : 'Aviso de privacidad y derechos ARCO',
    /* Decía «sin base de datos» y «sin servidor de formularios»: las dos
       dejaron de ser ciertas cuando el formulario pasó a Resend y al puente.
       Y medía 169 caracteres, que Google recorta. */
    description: en
      ? 'No tracking cookies. What reaches my inbox, what is stored, the opt-in list, how long data is kept and how to exercise your ARCO rights.'
      : 'Sin cookies de rastreo. Qué llega a mi buzón, qué se guarda, la lista voluntaria, cuánto se conserva y cómo ejercer tus derechos ARCO.',
  })
}

/**
 * ════════════════════════════════════════════════════════════════
 * LA COLUMNA DE LECTURA
 *
 * El cuerpo de cada cláusula se escribe con etiquetas desnudas (<p>, <h3>,
 * <ul>, <code>), así que necesita una hoja de estilo de alcance local. NO se
 * usa `.prose-rich`: esa clase vive FUERA de capa —le gana a cualquier
 * utilidad de Tailwind, así que no se puede corregir desde aquí— y pinta las
 * viñetas con `var(--grad)`, que en este material resuelve a humo sobre
 * hollín: invisible. También mete el código en una cápsula con fondo y radio,
 * que es justo la caja que este rediseño quita.
 *
 * Aquí en cambio: medida de 66 ch, un solo ritmo vertical, viñeta con marcador
 * nativo teñido de ceniza y código en mono sin cápsula. Cero adorno.
 * ════════════════════════════════════════════════════════════════
 */
const DOC = [
  'max-w-[66ch] break-words text-ink-muted',
  '[&>*+*]:mt-5',
  '[&_h3]:mt-10 [&_h3]:text-d3 [&_h3]:text-ink',
  '[&_strong]:font-semibold [&_strong]:text-ink',
  '[&_ul]:mt-5 [&_ul]:list-disc [&_ul]:space-y-2.5 [&_ul]:pl-5',
  /* El `ol` necesita su propia regla: el preflight de Tailwind le quita el
     marcador y la sangría, así que una lista numerada se renderizaría como
     párrafos sueltos — y en la cláusula que enumera los destinos del
     formulario el NÚMERO es el dato. El marcador va en mono como toda cifra
     de este sistema. */
  '[&_ol]:mt-5 [&_ol]:list-decimal [&_ol]:space-y-2.5 [&_ol]:pl-6',
  '[&_ol>li]:marker:font-mono [&_ol>li]:marker:text-[0.9em]',
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

/** Los tres hechos que cambian todo lo demás, arriba y en una sola pantalla. */
interface Highlight {
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
  const emailLink = (
    <a className="link-stylus" href={mailto}>
      {NAP.email}
    </a>
  )

  /* Derivada de LAST_UPDATED a proposito: la fecha visible y la del
     JSON-LD tienen que ser la misma, y antes eran dos constantes que se
     desincronizaron cinco dias. Al editar el aviso se mueve UNA sola. */
  const updatedLabel = formatDate(LAST_UPDATED, locale as Locale)

  /** El numeral de cláusula. Un documento legal SÍ es una secuencia real: se
   *  cita por número, y el índice y el cuerpo tienen que coincidir. */
  const clause = (index: number) => String(index + 1).padStart(2, '0')

  const highlights: Highlight[] = en
    ? [
        {
          title: 'The form does post to a server',
          text: 'What you write reaches this site and from there my inbox. It does not use your email app, and does not need you to have one set up.',
        },
        {
          title: 'A copy is kept, only so I can reply',
          text: 'Your message stays in my inbox and in a case-management system of my own, so I can follow it up. For that, and nothing else.',
        },
        {
          title: 'No tracking cookies',
          text: 'Which is why there is no consent banner: there would be nothing to consent to.',
        },
      ]
    : [
        {
          title: 'El formulario sí manda a un servidor',
          text: 'Lo que escribes llega a este sitio y de ahí a mi correo. No usa tu aplicación de correo ni depende de que la tengas configurada.',
        },
        {
          title: 'Se guarda una copia, y solo para responderte',
          text: 'Tu mensaje queda en mi buzón y en un sistema de gestión propio, para poder darle seguimiento. Para eso y nada más.',
        },
        {
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
          title: 'First things first: what happens when you submit the form',
          body: (
            <>
              <p>
                It is worth saying before anything else, because it shapes
                everything that follows:{' '}
                <strong>the contact form does receive what you write</strong>.
                When you submit it, the message travels to this site, and from
                here it goes to two places:
              </p>
              <ol>
                <li>
                  <strong>My inbox</strong>, delivered by Resend. That is the
                  delivery that counts.
                </li>
                <li>
                  <strong>A case-management system of my own</strong>, so the
                  message gets followed up instead of being lost in an inbox.
                </li>
              </ol>
              <p>
                A backup copy in a database is also foreseen. If that is
                connected, it receives the same message for the same purpose —
                being able to answer you — and for nothing else. Resend and any
                database provider act as processors: they handle the data on my
                instruction and to no other end. The section on who else is
                involved names each one.
              </p>
              <p>
                What the form cannot do is send what you write anywhere else:
                the site&rsquo;s security policy (
                <code>form-action &lsquo;self&rsquo;</code>) prevents a form on
                these pages from pointing at an outside host.
              </p>
              <p>
                My address is also written out in full on the contact page, if
                you would rather write to me directly from your own account
                without going through the form at all.
              </p>
              <p>
                There are no user accounts, no tracking cookies and no
                profiling. What there is, is a message that reaches me and is
                recorded so that I can reply to it. The rest of this notice
                describes what I do with it.
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
                The five fields of the form: your name, your email address,
                what it is about — picked from a list — your site&rsquo;s URL
                and your message. The URL is optional; the rest are what I need
                in order to reply. Two more travel with them that you do not
                type: which page of the site you sent the form from, and which
                language you were reading it in. None of this is needed in
                order to browse the site.
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
              <h3>The newsletter, if you subscribe to it</h3>
              <p>
                One email address, and nothing else — there is no name field and
                no tracking pixel. It is entirely optional: nothing on this site
                requires it and nothing is withheld if you skip it. The address
                goes to the email provider that sends the newsletter, and it is
                used for that and for nothing else.
              </p>
              <p>
                <strong>What you receive, and how often.</strong> One email per
                new blog article: two a week, on Tuesdays and Fridays. No
                promotional sends, nothing from third parties, nothing that is
                not an article published on this site. The email carries the
                title, the standfirst and a link — and that link includes
                campaign parameters (<code>utm_source</code>) so I can see how
                many people arrive from the newsletter. That is aggregate site
                analytics, not individual tracking: there is no open pixel and
                no record of who clicked.
              </p>
              <p>
                You can unsubscribe from the link in any issue, or by writing to{' '}
                <a href={`mailto:${NAP.email}`}>{NAP.email}</a>. Withdrawing
                consent removes the address from the list; it does not affect
                anything else, because there is nothing else.
              </p>
              <h3>Where what you write in the form goes</h3>
              <p>
                Besides reaching me by email, the contents of the form may be
                forwarded to a case-management system of my own so the message
                can be followed up: same data, same purpose — replying to you —
                and under my responsibility. It is not shared with third
                parties for unrelated purposes, not sold, and not used for
                advertising.
              </p>
              <p>
                If that system ever belongs to an external provider, it acts as
                a <strong>processor</strong>: it handles the data on my
                instruction and for nothing else. You can ask me at any time
                which providers are involved by writing to{' '}
                <a href={`mailto:${NAP.email}`}>{NAP.email}</a>.
              </p>
              <h3>What this site does not collect</h3>
              <p>
                There are no user accounts and no sign-up, so no passwords
                exist. Payment or card data, your phone number, your precise
                location and sensitive personal data (health, ethnic or racial
                origin, religious beliefs, political opinions, sexual
                preference) are never requested. The site also sends a{' '}
                <code>Permissions-Policy</code> header that denies camera,
                microphone and geolocation at the browser level, so this domain
                cannot even ask you for them.
              </p>
              <p>
                I do not address minors: this site speaks to professionals and
                businesses. If you are a parent or guardian and believe a minor
                wrote to me, tell me and I will delete the email.
              </p>
              <p>
                If you include confidential or sensitive information inside your
                message, you do so on your own initiative. Please do not: email
                is not an end-to-end encrypted channel. That is what a call and,
                where needed, a signed non-disclosure agreement are for.
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
              <h3>The newsletter is a separate, consented purpose</h3>
              <p>
                Subscribing to the newsletter is a secondary purpose under the
                LFPDPPP, so it asks for its own consent and it is given by the
                deliberate act of typing an address and submitting it. It is
                used to send what I write, and to nothing else — it is not
                cross-referenced with the emails you send me, it does not feed
                advertising and the list is not shared.
              </p>
              <h3>No other secondary purposes</h3>
              <p>
                There is no remarketing and no profiling. And not as a policy I
                could quietly reverse: the infrastructure to do it does not
                exist here.
              </p>
              <p>
                <strong>What I never do with your data:</strong> I do not sell
                it, transfer it, trade it, or enrich it against third-party
                databases. I build no profiles and make no automated decisions
                that affect you. Writing to me does not subscribe you to the
                newsletter: that sign-up is separate and you make it yourself.
                Your message is recorded so it can be followed up; where it
                ends up is set out above.
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
                You give your consent by submitting the form. This notice tells
                you beforehand what for: I use what you write in order to reply
                to you and to follow your message up. For nothing else.
              </p>
              <p>
                A record of that submission is kept. The email that reaches me
                carries your address, the date and the fields you filled in, and
                that email is the evidence that you chose to send it. The
                case-management system described in the section above holds the
                same copy.
              </p>
              <p>
                You can withdraw your consent at any time by writing to{' '}
                {emailLink}. Withdrawing it means I delete your message and its
                thread from my inbox and from the case-management system, and
                stop using your data, unless I have to
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
                Three providers are involved. Each processes the data on my
                instruction and for nothing else: they are processors, not
                recipients.
              </p>
              <ul>
                <li>
                  <strong>Vercel</strong> — hosts the site and provides the
                  aggregate traffic and performance measurement (Vercel
                  Analytics and Speed Insights).
                </li>
                <li>
                  <strong>Resend</strong> — delivers the emails from the form
                  and sends the newsletter. It receives your name, your address
                  and the content of your message, and the address of anyone
                  who subscribes to the list.
                </li>
                <li>
                  <strong>My own case-management system</strong> — receives
                  each message from the form so it can be followed up. It is an
                  application of mine, not a third-party service, and it is
                  hosted on Vercel too.
                </li>
              </ul>
              <p>
                A backup database for form messages is foreseen. Until it is
                connected it receives nothing; when it is, this notice will name
                the provider.
              </p>
              <p>
                What there is not: no advertising pixel, no Google Analytics, no
                Meta Pixel, no third-party chat widget, no embedded maps and no
                embedded video. The typefaces are self-hosted at build time, so
                your browser makes no request to Google Fonts, and every image
                is served from this same domain.
              </p>
              <h3>Transfers outside Mexico</h3>
              <p>
                Vercel and Resend both operate global infrastructure, so these
                pages are served — and your message processed — from servers
                that may be outside Mexico, typically in the United States.
                That is a transfer to a processor, which under the LFPDPPP does
                not require your separate consent: it happens in order to
                provide the service you asked for, and the processor may not
                use the data for anything else.
              </p>
              <p>
                You can ask me for the current detail of any provider by
                writing to {emailLink}.
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
                Your message reaches my inbox and my case-management system.
                Those are the two places, and the periods are the same in both:
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
                  <strong>Your address on the newsletter:</strong> for as long
                  as you stay subscribed. Unsubscribing removes it from the
                  list.
                </li>
                <li>
                  <strong>Vercel metrics:</strong> aggregate and
                  non-identifying, so there is no personal datum of yours there
                  to expire.
                </li>
              </ul>
              <p>
                Once the period is over, or when you ask for cancellation, I
                delete the email from the inbox and from the trash and delete
                the record from the case-management system. Deleting the email
                alone is not enough.
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
                  Only the minimum needed to reply is stored: name, email,
                  subject, site and message. There are no user accounts, so
                  there are no passwords to leak.
                </li>
                <li>
                  The credentials for the email provider and for the
                  case-management system are server-side only and never reach
                  the browser. You can check that in the inspector: no key
                  appears in the page source.
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
                In practice: access means forwarding you your message and
                telling you where it is — my inbox and my case-management
                system; cancellation means deleting it from both. If you
                subscribed to the newsletter, I also remove your address from
                the list.
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
          title: 'Lo primero: qué pasa cuando envías el formulario',
          body: (
            <>
              <p>
                Conviene decirlo antes que nada, porque cambia todo lo demás:{' '}
                <strong>
                  el formulario de contacto sí recibe lo que escribes
                </strong>
                . Al enviarlo, el mensaje viaja a este sitio y de aquí sale a
                dos destinos:
              </p>
              <ol>
                <li>
                  <strong>Mi correo</strong>, entregado por Resend. Es la
                  entrega que cuenta.
                </li>
                <li>
                  <strong>Un sistema de gestión propio</strong>, para darle
                  seguimiento en vez de dejarlo perdido en un buzón.
                </li>
              </ol>
              <p>
                Está previsto además guardar una copia de respaldo en una base
                de datos. Si está conectada, recibe el mismo mensaje para la
                misma finalidad —poder responderte— y para nada más. Resend y
                el proveedor de esa base actúan como encargados: tratan los
                datos por instrucción mía y para ningún otro fin. La sección de
                quién más participa los nombra uno por uno.
              </p>
              <p>
                Lo que el formulario no puede hacer es mandar lo que escribes a
                otro sitio: la política de seguridad (
                <code>form-action &lsquo;self&rsquo;</code>) impide que un
                formulario de estas páginas apunte a un host externo.
              </p>
              <p>
                Mi correo también está escrito completo en la página de
                contacto, si prefieres escribirme directo desde tu propia cuenta
                sin pasar por el formulario.
              </p>
              <p>
                No hay cuentas de usuario, ni cookies de rastreo, ni perfilado.
                Lo que hay es un mensaje que me llega y queda registrado para
                poder contestarte. El resto de este aviso describe qué hago con
                él.
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
                Los cinco campos del formulario: tu nombre, tu correo, de qué
                va —elegido de una lista—, la URL de tu sitio y tu mensaje. La
                URL es opcional; los otros son lo que necesito para poder
                responderte. Con ellos viajan dos datos que no escribes tú:
                desde qué página del sitio enviaste el formulario y en qué
                idioma lo estabas leyendo. Nada de esto hace falta para navegar
                el sitio.
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
              <h3>El boletín, si te suscribes</h3>
              <p>
                Una dirección de correo y nada más: no hay campo de nombre y no
                hay píxel de seguimiento. Es del todo opcional — nada en este
                sitio la pide y nada se te niega si no la das. La dirección va
                al proveedor de correo que manda el boletín, y se usa para eso y
                para nada más.
              </p>
              <p>
                <strong>Qué recibes y cada cuánto.</strong> Un correo por
                artículo nuevo del blog: dos por semana, los martes y los
                viernes. No hay envíos promocionales, ni de terceros, ni de
                nada que no sea un artículo publicado en este sitio. El correo
                trae el título, la entradilla y un enlace — y ese enlace lleva
                parámetros de campaña (<code>utm_source</code>) para saber
                cuánta gente entra desde el boletín. Es analítica agregada del
                sitio, no seguimiento individual: no hay píxel de apertura ni
                registro de quién hizo clic.
              </p>
              <p>
                Te das de baja desde el enlace de cualquier envío, o
                escribiéndome a <a href={`mailto:${NAP.email}`}>{NAP.email}</a>.
                Revocar el consentimiento saca la dirección de la lista; no
                afecta a nada más, porque no hay nada más.
              </p>
              <h3>A dónde va lo que escribes en el formulario</h3>
              <p>
                Además de llegarme por correo, el contenido del formulario
                puede reenviarse a un sistema de gestión propio para dar
                seguimiento al mensaje: mismo dato, misma finalidad —
                responderte— y bajo mi responsabilidad. No se comparte con
                terceros para fines ajenos, no se vende y no se usa para
                publicidad.
              </p>
              <p>
                Si en algún momento ese sistema fuera de un proveedor externo,
                actuaría como <strong>encargado</strong>: trata los datos por
                instrucción mía y para nada más. Puedes pedirme en cualquier
                momento el detalle de qué proveedores intervienen escribiendo a{' '}
                <a href={`mailto:${NAP.email}`}>{NAP.email}</a>.
              </p>
              <h3>Lo que este sitio no recoge</h3>
              <p>
                No hay cuentas de usuario ni registro, así que no existen
                contraseñas. Nunca se piden datos de pago o de tarjeta, tu
                teléfono, tu ubicación precisa ni datos personales sensibles
                (salud, origen étnico o racial, creencias religiosas, opiniones
                políticas, preferencia sexual). El sitio además envía una
                cabecera <code>Permissions-Policy</code> que niega cámara,
                micrófono y geolocalización a nivel de navegador: este dominio
                no puede ni pedírtelos.
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
              <h3>El boletín es una finalidad aparte, y consentida</h3>
              <p>
                Suscribirte al boletín es una finalidad secundaria conforme a la
                LFPDPPP, así que pide su propio consentimiento y lo das con el
                acto deliberado de escribir tu dirección y enviarla. Se usa para
                mandarte lo que escribo, y para nada más: no se cruza con los
                correos que me manda, no alimenta publicidad y la lista no se
                comparte.
              </p>
              <h3>No hay otras finalidades secundarias</h3>
              <p>
                No hay remarketing y no hay perfilado. Y no como una política
                que podría revertir en silencio: aquí no existe la
                infraestructura para hacerlo.
              </p>
              <p>
                <strong>Lo que nunca hago con tus datos:</strong> no los vendo,
                no los cedo, no los intercambio y no los enriquezco con bases de
                terceros. No construyo perfiles ni tomo decisiones automatizadas
                que te afecten. Escribirme no te da de alta en el boletín:
                esa alta es aparte y la haces tú. Tu mensaje sí queda
                registrado para darle seguimiento; dónde queda lo dice la
                sección de arriba.
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
                El consentimiento lo das al enviar el formulario. Este aviso te
                dice antes para qué: uso lo que escribas para responderte y
                para dar seguimiento a tu mensaje. Para nada más.
              </p>
              <p>
                Del envío queda constancia. El correo que me llega trae tu
                dirección, la fecha y los campos que llenaste, y ese correo es
                la evidencia de que decidiste mandarlo. En el sistema de
                gestión que describe la sección de arriba queda la misma copia.
              </p>
              <p>
                Puedes revocar tu consentimiento cuando quieras escribiendo a{' '}
                {emailLink}. Revocarlo significa que elimino tu mensaje y su
                hilo de mi buzón y del sistema de gestión, y dejo de usar tus
                datos, salvo que deba
                conservar algo por una obligación legal o fiscal, o para
                defender un derecho.
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
                Intervienen tres proveedores. Cada uno trata los datos por
                instrucción mía y para nada más: son encargados, no
                destinatarios.
              </p>
              <ul>
                <li>
                  <strong>Vercel</strong> — hospeda el sitio y provee la
                  medición agregada de tráfico y rendimiento (Vercel Analytics
                  y Speed Insights).
                </li>
                <li>
                  <strong>Resend</strong> — entrega los correos del formulario
                  y manda el boletín. Recibe tu nombre, tu dirección y el
                  contenido de tu mensaje, y la dirección de quien se suscribe
                  a la lista.
                </li>
                <li>
                  <strong>Mi propio sistema de gestión</strong> — recibe cada
                  mensaje del formulario para poder darle seguimiento. Es una
                  aplicación mía, no un servicio de terceros, y también se
                  aloja en Vercel.
                </li>
              </ul>
              <p>
                Está prevista una base de datos de respaldo para los mensajes
                del formulario. Mientras no esté conectada no recibe nada; en
                cuanto lo esté, este aviso nombrará al proveedor.
              </p>
              <p>
                Lo que no hay: ni píxel publicitario, ni Google Analytics, ni
                Meta Pixel, ni chat de terceros, ni mapas embebidos, ni video
                incrustado. Las tipografías se auto-hospedan en el build, así
                que tu navegador no hace ni una petición a Google Fonts, y
                todas las imágenes se sirven desde este mismo dominio.
              </p>
              <h3>Transferencias fuera de México</h3>
              <p>
                Vercel y Resend operan infraestructura global, por lo que estas
                páginas se sirven —y tu mensaje se procesa— desde servidores
                que pueden estar fuera de México, normalmente en Estados
                Unidos. Eso es una remisión a un encargado, que la LFPDPPP no
                sujeta a tu consentimiento aparte: ocurre para prestarte el
                servicio que pediste, y el encargado no puede usar los datos
                para otra cosa.
              </p>
              <p>
                Puedes pedirme el detalle vigente de cualquier proveedor
                escribiendo a {emailLink}.
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
                herramienta que sí requiera consentimiento, aparecerá el banner
                y este aviso lo dirá antes.
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
                Tu mensaje llega a mi bandeja y a mi sistema de gestión. Esos
                son los dos lugares, y los plazos son los mismos en los dos:
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
                  <strong>Tu dirección en el boletín:</strong> mientras sigas
                  suscrito. Al darte de baja se retira de la lista.
                </li>
                <li>
                  <strong>Las métricas de Vercel:</strong> son agregadas y no te
                  identifican, así que ahí no hay un dato personal tuyo que
                  caduque.
                </li>
              </ul>
              <p>
                Cumplido el plazo, o cuando pides la cancelación, elimino el
                correo del buzón y de la papelera y borro el registro del
                sistema de gestión. No basta con borrar el correo.
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
                  Se guarda lo mínimo que sirve para responderte: nombre,
                  correo, asunto, sitio y mensaje. No hay cuentas de usuario,
                  así que no hay contraseñas que puedan filtrarse.
                </li>
                <li>
                  Las credenciales del proveedor de correo y del sistema de
                  gestión son solo de servidor y nunca llegan al navegador.
                  Puedes comprobarlo en el inspector: no aparece ninguna clave
                  en el código de la página.
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
                En la práctica: un acceso es reenviarte tu mensaje y decirte
                dónde está —mi buzón y mi sistema de gestión—; una cancelación
                es borrarlo de los dos. Si te suscribiste al boletín, además
                retiro tu dirección de la lista.
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
                Si cambia lo que este sitio hace con los datos —un formulario
                que sí mande a un servidor, un proveedor distinto, una
                herramienta de medición que sí use cookies— actualizo este aviso
                y muevo la fecha de última actualización que aparece arriba, en
                el mismo cambio que toque el código. La versión publicada aquí
                es siempre la vigente.
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

      <div
        className="grid"
        style={{ gridTemplateColumns: 'var(--tape-w) minmax(0,1fr)' }}
      >
        <Rail />

        <div className="min-w-0">
          {/* ═══ CABECERA ════════════════════════════════════════
              Sin aguja y sin marcas: el instrumento en vivo es de la home.
              Aquí el eje de la izquierda solo da continuidad de material. */}
          <section className="hero-in px-5 pt-16 pb-16 sm:px-10">
            {/* ── LA HOJA TIENE DOS MÁRGENES ── */}
            <div className="ledger">
              <div className="min-w-0">
                <p className="stamp">Legal</p>

                <h1 className="mt-6 max-w-[13ch] text-hero text-ink">
                  {t('privacyTitle')}
                </h1>

                <p className="mt-10 max-w-[46ch] font-human text-lead text-ink-muted">
                  {t('privacyLead')}
                </p>

                <p className="stamp mt-8">
                  {t('lastUpdated')} ·{' '}
                  <time dateTime={LAST_UPDATED} data-numeric="">
                    {updatedLabel}
                  </time>
                </p>
              </div>

              {/* ── EL MARGEN DE ANOTACIÓN ──
                  Sin índice: el documento ya trae el suyo, pegajoso, en su
                  propia sección. Dos índices en una pantalla son el mismo
                  dato dos veces. Esto es la FICHA — cláusulas, fecha y
                  responsable— que es lo que se mira antes de decidir si se
                  lee. */}
              <aside className="margin margin-sticky">
                <div className="margin-row">
                  <span className="margin-key">
                    {en ? 'clauses' : 'cláusulas'}
                  </span>
                  <span className="margin-read">{sections.length}</span>
                  <span className="margin-val">
                    {en
                      ? 'numbered, cited by number.'
                      : 'numeradas, y se citan por número.'}
                  </span>
                </div>

                <div className="margin-row">
                  <span className="margin-key">
                    {en ? 'in force since' : 'vigente desde'}
                  </span>
                  <span className="margin-val !text-ink">
                    <time dateTime={LAST_UPDATED} data-numeric="">
                      {updatedLabel}
                    </time>
                  </span>
                </div>

                <div className="margin-row">
                  <span className="margin-key">
                    {en ? 'accountable' : 'responsable'}
                  </span>
                  <span className="margin-val !text-ink">{NAP.name}</span>
                  <span className="margin-val">{NAP.email}</span>
                </div>
              </aside>
            </div>
          </section>

          {/* ═══ RESUMEN ═════════════════════════════════════════
              Los tres hechos que cambian todo lo demás. Antes eran tres
              tarjetas de cristal inclinables con un icono en un cuadro
              redondeado; ahora son tres filas de registro, que es lo que
              siempre fueron: una lista de tres afirmaciones. */}
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
                ? 'Questions about how your data is handled?'
                : '¿Dudas sobre cómo se tratan tus datos?'}
            </h2>
            <p className="mt-6 max-w-[52ch] text-ink-muted">
              {en
                ? 'Ask directly. The same address handles ARCO requests and anything else in this notice.'
                : 'Pregúntame directamente. La misma dirección atiende solicitudes ARCO y cualquier otro punto de este aviso.'}
            </p>
            <p className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
              <a className="link-stylus" href={mailto}>
                {NAP.email} →
              </a>
              <Link className="link-stylus" href="/terminos">
                {t('termsTitle')} →
              </Link>
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
