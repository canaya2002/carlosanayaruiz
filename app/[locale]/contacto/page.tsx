import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Rail } from '@/components/instrument/rail'
import { LeadForm } from '@/components/sections/lead-form'
import { ContactChannels } from '@/components/sections/contact-channels'
import { getServices, servicePath } from '@/data/services'
import { NAP, SOCIAL_LINKS } from '@/lib/constants'
import { generatePageMetadata } from '@/lib/seo'
import { generateContactPageGraph } from '@/lib/schema'
import { Locale } from '@/data/types'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const en = locale === 'en'

  return generatePageMetadata({
    locale: locale as Locale,
    route: 'contacto',
    title: en
      ? 'Contact — Technical SEO Consulting'
      : 'Contacto — SEO técnico y desarrollo',
    description: en
      ? 'Reach out about a technical SEO audit, a Next.js migration, AI automation or a dashboard. Reply from the engineer himself in under 24 hours.'
      : 'Escríbeme para una auditoría SEO técnica, una migración a Next.js, automatización con IA o un dashboard. Te contesto en menos de 24 horas.',
  })
}

export default async function ContactPage({ params }: Props) {
  const { locale: rawLocale } = await params
  setRequestLocale(rawLocale)

  const locale = rawLocale as Locale
  const en = locale === 'en'

  const t = await getTranslations('contact')
  /* Las cadenas del formulario viven en su propio espacio (`lead`) porque las
     comparte con cualquier página que lo monte: no son del texto de contacto,
     son del componente. */
  const tl = await getTranslations('lead')
  const services = getServices(locale)

  /** a–d: los mismos canales paralelos que nombra la home. Un servicio se
   *  llama igual en todo el sitio o el identificador deja de identificar. */
  const channelId = (i: number) => String.fromCharCode(97 + i)

  /**
   * FAQs de la página de contacto — a propósito sobre el CANAL, no sobre el
   * trabajo.
   *
   * Las preguntas del trabajo en sí (cómo cobro, si trabajo solo, qué necesito
   * para empezar) pertenecen al `getSiteFaq` de la home, y las técnicas a cada
   * página de servicio. Nada de aquí repite ninguna de las dos: estas cinco son
   * las que solo tienen sentido teniendo el formulario enfrente — a qué buzón
   * llega, qué pasa con lo que escribes, cómo sabes que llegó, qué hacer si no
   * sabes nombrar el servicio, y por qué no hay campo de archivos.
   *
   * Cada respuesta se emite como JSON-LD de FAQPage, así que tiene que seguir
   * siendo literalmente cierta.
   *
   * ⚠ Estas cinco describían el compositor de `mailto:` que se retiró, y el
   * comentario que había aquí ORDENABA mantenerlo así («ya no hay base de datos:
   * el formulario compone un `mailto:`»). Eran cuatro afirmaciones falsas sobre
   * tratamiento de datos personales, emitidas en datos estructurados, en la
   * página donde alguien decide si manda los suyos. Y una de ellas —«no hay base
   * de datos ni servidor que reciba el formulario»— es exactamente la que la
   * ronda de contenido ya corrigió en el aviso de privacidad: arregló el
   * documento legal y se saltó este FAQ, así que las dos páginas del mismo sitio
   * afirmaban lo contrario la una de la otra.
   *
   * Lo que corre de verdad: el formulario ES una Server Action
   * (`app/[locale]/lead-action.ts`). Lo que se escribe llega al servidor y sale
   * a DOS destinos independientes — el correo por Resend (`lib/contact.ts`, con
   * `reply_to` del visitante) y el reenvío al sistema de gestión
   * (`lib/forward.ts`, dentro de `after()` y con reintentos). Supabase está
   * previsto y NO conectado. Ninguna respuesta de aquí puede insinuar que no se
   * recibe nada.
   */
  const faqs = en
    ? [
        {
          question: 'Should I use the form, email, or the phone?',
          answer:
            'All three land in the same inbox. The form only structures the message: it asks for the things I always end up asking for, and it arrives with your address set as the reply-to, so I answer by hitting reply — which usually saves one round trip. For a first contact I prefer writing, because it lets me look at the site before I answer. The phone is the better channel once something is already scheduled.',
        },
        {
          question: 'What happens to what I type into the form?',
          answer:
            'What you type reaches my server, and from there it goes to two destinations: an email to my inbox and a copy to the system where I track work enquiries. It is used solely to answer you and follow up, under Mexico’s federal data protection law (LFPDPPP). Which fields are collected, who else takes part in the processing, and how to exercise your ARCO rights are all in the privacy notice.',
        },
        {
          question: 'How do I know my message arrived?',
          answer:
            'The form tells you on the same screen, right below the button, as soon as it finishes sending. If something fails on my side it tells you that too, instead of pretending it went through, and the direct email address and WhatsApp are right there as an alternative. I do not promise delivery of an email I do not control end to end — that is why there is a second channel.',
        },
        {
          question:
            'I do not know which of your services I need. Should I still write?',
          answer:
            'Yes. Describe the symptom — traffic that dropped, pages that will not index, a slow site, a manual process eating hours every week — and I will tell you which of the four it maps to. If it is not something I do well, you get that in the first reply instead of a proposal.',
        },
        {
          question: 'Can I attach files or send access credentials here?',
          answer:
            'The form is text only — there is no file field. And credentials should not travel by email. Paste a link instead — a public URL, a Lighthouse report, a Drive folder, the repository — or just say that it exists, and we agree on a safe channel for access once there is a defined scope.',
        },
      ]
    : [
        {
          question: '¿Te escribo por el formulario, por correo o por teléfono?',
          answer:
            'Los tres llegan al mismo buzón. El formulario solo ordena el mensaje: pide justo los datos que siempre acabo pidiendo, y llega con tu dirección puesta como remitente de respuesta, así que contesto con «responder» y normalmente ahorra un ida y vuelta. Para un primer contacto prefiero texto, porque me permite revisar el sitio antes de contestarte. El teléfono funciona mejor cuando ya hay algo agendado.',
        },
        {
          question: '¿Qué pasa con lo que escribo en el formulario?',
          answer:
            'Lo que escribes llega a mi servidor, y de ahí sale a dos destinos: un correo a mi buzón y una copia al sistema donde llevo los mensajes de trabajo. Se usa únicamente para responderte y dar seguimiento, conforme a la LFPDPPP. Qué campos se recogen, quién más participa en el tratamiento y cómo ejercer tus derechos ARCO está en el aviso de privacidad.',
        },
        {
          question: '¿Cómo sé que mi mensaje llegó?',
          answer:
            'El formulario te lo dice en la misma pantalla, debajo del botón, en cuanto termina de enviarse. Si algo falla de mi lado también te lo dice, en vez de fingir que salió, y ahí mismo tienes el correo directo y WhatsApp como alternativa. No prometo la entrega de un correo que no controlo de punta a punta: por eso hay un segundo canal.',
        },
        {
          question: 'No sé cuál de tus servicios necesito. ¿Escribo igual?',
          answer:
            'Sí. Describe el síntoma —tráfico que cayó, páginas que no se indexan, un sitio lento, un proceso manual que se come horas cada semana— y yo te digo a cuál de los cuatro corresponde. Si no es algo que yo haga bien, eso te lo digo en la primera respuesta en lugar de mandarte una propuesta.',
        },
        {
          question: '¿Puedo adjuntar archivos o mandarte accesos por aquí?',
          answer:
            'El formulario es de texto: no tiene campo de archivos. Y las credenciales no deberían viajar por correo. Mejor pega un enlace —una URL pública, un reporte de Lighthouse, una carpeta de Drive, el repositorio— o dime que existe, y acordamos un canal seguro para los accesos cuando ya haya un alcance definido.',
        },
      ]

  /**
   * Lo que pasa de verdad después del botón, en orden. Sin SLA inventado y sin
   * prometer recepción automática.
   *
   * ⚠ El paso uno decía «se abre tu correo, no un servidor mío», que era el
   * `mailto:` retirado y la misma falsedad del FAQ de arriba. Hoy el paso uno es
   * la recepción en el servidor, que es lo que de verdad ocurre al pulsar.
   *
   * Aquí sí hay secuencia real —uno ocurre antes que dos— así que la
   * numeración es un dato y no un adorno de maquetación.
   */
  const steps = en
    ? [
        {
          title: 'It reaches my inbox, not your email app',
          desc: 'The form submits to the server, which sends it on as an email with your address as the reply-to, and files a copy in the system where I track enquiries. You get the acknowledgement on screen; nothing opens on your side and there is nothing for you to press twice.',
        },
        {
          title: 'I look at the site before I answer',
          desc: 'With the URL I check how the page is crawled, what the raw HTML actually returns, and what field data says about its Core Web Vitals. I would rather arrive with hypotheses than with questions.',
        },
        {
          title: 'You get a first read, not a template',
          desc: 'What is probably going on, and what it would take to confirm it. If it makes sense to keep going, I propose a call — that first conversation is not charged.',
        },
      ]
    : [
        {
          title: 'Llega a mi buzón, no a tu aplicación de correo',
          desc: 'El formulario envía al servidor, que lo manda como correo con tu dirección puesta para responder y archiva una copia en el sistema donde llevo los mensajes. El acuse lo ves en pantalla: no se abre nada de tu lado y no hay nada que pulsar dos veces.',
        },
        {
          title: 'Reviso el sitio antes de contestarte',
          desc: 'Con la URL veo cómo se rastrea la página, qué devuelve realmente el HTML y qué dicen los datos de campo de sus Core Web Vitals. Prefiero llegar con hipótesis que con preguntas.',
        },
        {
          title: 'Recibes una primera lectura, no una plantilla',
          desc: 'Qué está pasando probablemente y qué haría falta para confirmarlo. Si tiene sentido seguir, propongo una llamada: esa primera conversación no se cobra.',
        },
      ]

  /**
   * Los tres perfiles, en una sola escritura. El `rel` no es cosmético: el `me`
   * de los dos enlaces de identidad es lo que permite a Google reconciliarlos
   * nofollow.
   */
  const profiles = [
    {
      name: 'LinkedIn',
      href: SOCIAL_LINKS.linkedin,
      hint: t('connect'),
      rel: 'me noopener noreferrer',
    },
    {
      name: 'GitHub',
      href: SOCIAL_LINKS.github,
      hint: t('seeProjects'),
      rel: 'me noopener noreferrer',
    },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateContactPageGraph(locale, faqs)),
        }}
      />

      {/* La cinta corre por el margen igual que en toda la ruta. Lo que NO
          viaja aquí es la aguja ni las marcas: el instrumento en vivo mide la
          home, y repetirlo en cada página lo convertiría en decoración. */}
      <div
        className="grid"
        style={{ gridTemplateColumns: 'var(--tape-w) minmax(0,1fr)' }}
      >
        <Rail />

        <div className="min-w-0">
          {/* ═══ CABECERA ════════════════════════════════════════
              Sin aurora, sin cristal, sin la composición de tres planos: el
              titular se pinta desde el servidor y los dos canales directos
              están a un renglón de él, sin hacer scroll y sin un botón que
              los encierre. */}
          <section className="hero-in px-5 pt-16 pb-20 sm:px-10">
            {/* ── LA HOJA TIENE DOS MÁRGENES ──
                Y en esta página el margen hace un trabajo que no es
                decorativo: SEPARA LAS DOS INTENCIONES. A la izquierda,
                quien viene a contratar. A la derecha, quien ya es cliente y
                viene a resolver algo de un trabajo en curso — y a ese se le
                manda a la otra propiedad en vez de dejarlo competir por el
                mismo formulario. */}
            <div className="ledger">
              <div className="min-w-0">
                <p className="stamp">
                  {en ? 'contact · mexico city' : 'contacto · ciudad de méxico'}
                </p>

                {/* El espacio entre los dos `span` de bloque es deliberado: sin él
                `textContent` concatena las dos mitades en una sola palabra al
                final de la primera línea. */}
                <h1 className="mt-6 max-w-[22ch] text-hero text-ink">
                  <span className="block">
                    {en ? 'Tell me what’s broken,' : 'Cuéntame qué está roto'}
                  </span>{' '}
                  <span className="block">
                    {en
                      ? 'or what you want to build.'
                      : 'o qué quieres construir.'}
                  </span>
                </h1>

                <p className="mt-10 max-w-[46ch] font-human text-lead text-ink-muted">
                  {t('lead')}
                </p>

                {/* ⚠ `[overflow-wrap:anywhere]` NO es adorno: un correo es un token
                sin espacios, así que su `min-content` es su ancho completo y a
                360 px se salía de la columna. Dejando que rompa, el
                min-content baja a un carácter y la fila vuelve a caber. */}
                <p className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
                  <a
                    className="link-stylus inline-flex min-h-11 items-center [overflow-wrap:anywhere]"
                    href={`mailto:${NAP.email}`}
                  >
                    {NAP.email} →
                  </a>
                  <a
                    className="link-stylus inline-flex min-h-11 items-center"
                    href={`tel:${NAP.phone}`}
                    data-numeric=""
                  >
                    {NAP.phoneDisplay} →
                  </a>
                </p>

                <p className="stamp mt-8">{t('responseTime')}</p>
                <p className="mt-3 max-w-[54ch] text-sm text-ink-subtle">
                  {en
                    ? 'I reply in English or Spanish, and you write to the engineer who does the work.'
                    : 'Respondo en español o inglés, y le escribes al ingeniero que hace el trabajo.'}
                </p>
              </div>

              {/* ── EL MARGEN DE ANOTACIÓN ── */}
              <aside className="margin margin-sticky">
                {/* ¿ERES CLIENTE? La pregunta que reparte el tráfico de esta
                    página. Va PRIMERA en el margen a propósito: quien ya
                    trabaja conmigo no tiene que leer una página de venta
                    para encontrar dónde escribir.

                    Mismo destino en los dos idiomas: es la otra propiedad,
                    no una traducción de esta. */}
                <div className="margin-row">
                  <span className="margin-key">
                    {en ? 'already a client?' : '¿eres cliente?'}
                  </span>
                  <span className="margin-prose">
                    {en
                      ? 'If we are already working together, your project lives on the other site — files, invoices and follow-up.'
                      : 'Si ya estamos trabajando juntos, tu proyecto vive en el otro sitio: archivos, facturas y seguimiento.'}
                  </span>
                  <a className="pull-tab mt-4" href={SOCIAL_LINKS.clientPortal}>
                    {en ? 'Client area' : 'Zona de clientes'}
                  </a>
                </div>

                <div className="margin-row">
                  <span className="margin-key">
                    {en ? 'reply time' : 'respuesta'}
                  </span>
                  <span className="margin-read">
                    &lt;24
                    <span className="ml-1.5 text-[0.6875rem] tracking-[0.12em] text-ink-subtle">
                      h
                    </span>
                  </span>
                  <span className="margin-val">
                    {en ? 'business days.' : 'en días hábiles.'}
                  </span>
                </div>

                <div className="margin-row">
                  <span className="margin-key">
                    {en ? 'languages' : 'idiomas'}
                  </span>
                  <span className="margin-val !text-ink">
                    {en ? 'Spanish · English' : 'Español · Inglés'}
                  </span>
                </div>

                <div className="margin-row">
                  <span className="margin-key">
                    {en ? 'time zone' : 'zona horaria'}
                  </span>
                  <span className="margin-val !text-ink">
                    UTC−6 · {NAP.locality}
                  </span>
                </div>
              </aside>
            </div>
          </section>

          {/* ═══ EL MENSAJE ══════════════════════════════════════
              El formulario trae su propio h2, sus propias regiones aria-live y
              su propia lógica de `mailto:`. La página solo lo coloca en la
              retícula: nada de aquí lo toca. */}
          {/* ── LOS TRES CANALES, ANTES DEL FORMULARIO ──
              El formulario no es el único camino y ponerlo primero daba a
              entender que sí. Quien está comparando proveedores escribe; quien
              ya decidió agenda; quien tiene una duda de treinta segundos manda
              un WhatsApp. Las tres filas van arriba y el formulario debajo,
              que es el orden en que se decide.

              Cada canal degrada solo: si no está configurado, su fila no
              existe. Un botón que lleva a un 404 es peor que uno que no está.
              Ver components/sections/contact-channels.tsx. */}
          <section className="border-t border-hairline px-5 pb-24 pt-14 sm:px-10">
            <ContactChannels
              locale={locale}
              waMessage={
                en
                  ? 'Hi Carlos — I found you through your site. I want to talk about '
                  : 'Hola Carlos, te escribo desde tu sitio. Quiero hablar de '
              }
            />
          </section>

          <section className="border-t border-hairline px-5 pb-24 pt-14 sm:px-10">
            <p className="stamp">
              {en
                ? 'the message · direct channels'
                : 'el mensaje · canales directos'}
            </p>

            <div className="mt-12 grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-20">
              <div className="min-w-0">
                {/* El formulario RECIBE de verdad: Server Action → Resend, y
                    una copia en Supabase solo si está configurado. Antes era
                    un compositor de `mailto:` y quien no tiene cliente de
                    correo —la mayoría en móvil— se quedaba sin enviar. */}
                <LeadForm
                  locale={locale}
                  origen={en ? 'Contact page' : 'Página de contacto'}
                  asuntos={tl.raw('asuntos') as readonly string[]}
                  copy={{
                    nombre: tl('nombre'),
                    email: tl('email'),
                    asunto: tl('asunto'),
                    asuntoHint: tl('asuntoHint'),
                    sitio: tl('sitio'),
                    sitioHint: tl('sitioHint'),
                    mensaje: tl('mensaje'),
                    mensajeHint: tl('mensajeHint'),
                    submit: tl('submit'),
                    enviando: tl('enviando'),
                    nota: tl('nota'),
                    ok: tl('ok'),
                    invalido: tl('invalido'),
                    sinConfigurar: tl('sinConfigurar'),
                    error: tl('error'),
                  }}
                />
              </div>

              <aside aria-labelledby="contact-direct" className="min-w-0">
                {/* ⚠ Aquí iba el hueco `contacto-retrato`, un segundo retrato
                    del dueño para decir «esta es la persona que va a leer tu
                    mensaje». Se retiró por decisión suya junto con los dos de
                    /sobre-mi, y su registro ya no existe en
                    `data/media-slots.ts`.

                    Aquí no quedó envoltorio vacío porque el `<aside>` sigue
                    teniendo el resto de la columna debajo — al contrario de lo
                    que pasó en /sobre-mi, donde el contenedor era solo para las
                    dos fotos y hubo que retirarlo también. */}
                <h2 id="contact-direct" className="text-d2 text-ink">
                  {t('info')}
                </h2>

                {/* El NAP, desde lib/constants.ts, escrito como registro: una
                    etiqueta mono y su valor por renglón. Correo y teléfono son
                    enlaces reales —en un móvil el número marca— y los dos
                    pasan el piso táctil de 44 px sin necesitar una caja que se
                    ilumine detrás. */}
                <dl className="mt-8">
                  <div className="band">
                    <dt className="stamp">{t('directEmail')}</dt>
                    <dd className="mt-2">
                      <a
                        href={`mailto:${NAP.email}`}
                        className="link-stylus inline-flex min-h-11 items-center [overflow-wrap:anywhere]"
                      >
                        {NAP.email}
                      </a>
                    </dd>
                  </div>

                  <div className="band">
                    <dt className="stamp">{en ? 'Phone' : 'Teléfono'}</dt>
                    <dd className="mt-2">
                      <a
                        href={`tel:${NAP.phone}`}
                        data-numeric=""
                        className="link-stylus inline-flex min-h-11 items-center"
                      >
                        {NAP.phoneDisplay}
                      </a>
                    </dd>
                  </div>

                  <div className="band">
                    <dt className="stamp">{t('location')}</dt>
                    <dd className="mt-2 text-ink">
                      {en ? NAP.localityEn : NAP.locality}
                      {', '}
                      {en ? NAP.countryNameEn : NAP.countryName}
                      <span className="mt-2 block text-sm text-ink-muted">
                        {en
                          ? 'Remote with clients across Latin America and the United States.'
                          : 'Remoto con clientes en Latinoamérica y Estados Unidos.'}
                      </span>
                    </dd>
                  </div>

                  <div className="band">
                    <dt className="stamp">
                      {en
                        ? 'Time zone and response'
                        : 'Zona horaria y respuesta'}
                    </dt>
                    <dd className="mt-2 text-ink">
                      {t('responseTime')}
                      <span className="mt-2 block text-sm text-ink-muted">
                        {en
                          ? 'I work from Mexico City, GMT-6 — an overlap with nearly the whole working day in the United States and Latin America.'
                          : 'Trabajo desde Ciudad de México, GMT-6: se traslapa con casi todo el horario laboral de Estados Unidos y Latinoamérica.'}
                      </span>
                    </dd>
                  </div>
                </dl>

                <h2 className="mt-14 text-d2 text-ink">{t('social')}</h2>

                <ul className="reveal-stagger mt-8">
                  {profiles.map((profile) => (
                    <li key={profile.name}>
                      <a
                        href={profile.href}
                        target="_blank"
                        rel={profile.rel}
                        className="band group flex items-baseline justify-between gap-4"
                      >
                        <span>
                          <span className="text-ink">{profile.name}</span>
                          <span className="mt-1 block text-sm text-ink-subtle">
                            {profile.hint}
                          </span>
                        </span>
                        {/* Sin caja que se eleve: avanza el trazo. */}
                        <span
                          aria-hidden="true"
                          className="stamp shrink-0 transition-transform duration-150 group-hover:-translate-y-0.5"
                        >
                          ↗
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </aside>
            </div>
          </section>

          {/* ═══ LA PLACA DESPEJADA ══════════════════════════════
              El material se invierte una sola vez por página, y aquí toca a lo
              único que esta página tiene y ninguna otra: qué pasa de verdad
              después del botón, y a qué se le puede poner nombre. Dentro de la
              placa, `.stamp` y `.channel` ya llevan su propia tinta medida
              (--ink-plate); escribir `text-ink` aquí sería papel sobre papel. */}
          <div className="plate">
            <section className="px-5 py-20 sm:px-10">
              <p className="stamp">
                {en
                  ? 'after send · real sequence'
                  : 'después del envío · secuencia real'}
              </p>
              <h2 className="mt-5 max-w-[18ch] text-d1">
                {en ? 'After you press send' : 'Después de que le das enviar'}
              </h2>

              <ol className="reveal-stagger mt-12">
                {steps.map((step, index) => (
                  <li
                    key={step.title}
                    className="band grid gap-x-6 gap-y-2 sm:grid-cols-[3rem_minmax(0,1fr)]"
                  >
                    {/* La numeración se queda porque uno ocurre ANTES que dos:
                        es una secuencia medida, no una rejilla decorada. */}
                    <span className="stamp tabular-nums">{index + 1}</span>
                    <div className="min-w-0">
                      <h3 className="text-d3">{step.title}</h3>
                      <p className="mt-2 max-w-[62ch] text-sm leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="px-5 pb-20 sm:px-10">
              <p className="stamp">
                {en
                  ? `scope · channels a–${channelId(services.length - 1)}`
                  : `alcance · canales a–${channelId(services.length - 1)}`}
              </p>
              <h2 className="mt-5 max-w-[20ch] text-d1">{t('projectTypes')}</h2>
              <p className="mt-6 max-w-[62ch] text-sm leading-relaxed">
                {t('projectTypesDesc')}
              </p>

              <ul className="mt-12">
                {services.map((service, index) => (
                  <li key={service.id}>
                    <Link
                      href={servicePath(service, locale) as '/seo-tecnico'}
                      className="channel group"
                    >
                      <span className="channel-id">ch {channelId(index)}</span>
                      <span>
                        <span className="text-d3">{service.title}</span>
                        {/* La pluma: al pasar el puntero se escribe una línea
                            bajo la fila, de izquierda a derecha. */}
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
          </div>

          {/* ═══ ÍNDICE ══════════════════════════════════════════
              <details> nativo: sin JS, y el contenido va en el HTML del
              servidor, así que un crawler lee las cinco respuestas completas —
              que son exactamente las que declara el FAQPage de arriba. */}
          <section className="border-t border-hairline px-5 pb-24 pt-14 sm:px-10">
            <p className="stamp">
              {en ? 'index · before you write' : 'índice · antes de escribir'}
            </p>
            <h2 className="mt-5 max-w-[18ch] text-d1 text-ink">
              {en
                ? 'Questions about getting in touch'
                : 'Dudas sobre cómo contactarme'}
            </h2>

            <p className="mt-6 max-w-[62ch] text-ink-muted">
              {en
                ? 'How the engagement itself works — rates, scope, guarantees — is answered on the '
                : 'Cómo funciona el trabajo en sí —tarifas, alcance, garantías— está respondido en la '}
              <Link href="/" className="link-stylus">
                {en ? 'home page' : 'página de inicio'}
              </Link>
              .
            </p>

            <div className="mt-12">
              {faqs.map((faq) => (
                <details key={faq.question} className="band group">
                  <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 text-ink marker:hidden">
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
