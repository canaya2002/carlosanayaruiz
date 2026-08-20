import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import {
  ArrowUpRight,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
} from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Button } from '@/components/ui/button'
import { Disclosure } from '@/components/ui/disclosure'
import { ImageSlot } from '@/components/ui/image-slot'
import { PointerGlow } from '@/components/motion/pointer-glow'
import { ContactForm } from '@/components/sections/contact-form'
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
      ? 'Reach out about a technical SEO audit, a Next.js migration, AI automation or a dashboard. Reply from the engineer himself in 24 to 48 business hours.'
      : 'Escríbeme para una auditoría SEO técnica, una migración a Next.js, automatización con IA o un dashboard. Te contesto en 24 a 48 horas hábiles.',
  })
}

/**
 * ════════════════════════════════════════════════════════════════
 * CAPAS DE FONDO — lo que hace visible el cristal
 *
 * Aurora + grano + cuadrícula, en ese orden y con los CUATRO <i>: cada uno es
 * un campo de color distinto (azul de marca, cian, cielo y un brillo blanco
 * para que la mezcla no se vea plana). Sin ellos el formulario de cristal de
 * esta página se vería como un rectángulo blanco sobre un fondo casi blanco —
 * el cristal existe solo si hay algo saturado detrás que difuminar.
 *
 * ── CUÁNTAS CABEN, MEDIDO ──
 * TRES secciones con aurora por página, y ni una más (el pie ya trae la suya).
 * Con cinco se agota el presupuesto de capas compuestas, el navegador devuelve
 * las animaciones al hilo principal y toda animación en bucle empieza a costar
 * un recálculo de estilo por frame. Aquí las tres son las que llevan cristal
 * encima: la cabecera, el formulario y las preguntas. La banda de "qué pasa
 * después" pone su color con `.grad-soft`, un gradiente fijo que no se anima y
 * no gasta capa.
 * Verifica: node scripts/perf-probe.mjs http://localhost:3000/es/contacto
 *
 * Esta copia es local a propósito: la home tiene la suya y un componente
 * compartido nuevo queda fuera del carril de este archivo.
 * ════════════════════════════════════════════════════════════════
 */
function Backdrop({ glow = false }: { glow?: boolean }) {
  return (
    <>
      <div className="aurora" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="grain" aria-hidden="true" />
      <div className="grid-fade" aria-hidden="true" />
      {glow ? <PointerGlow /> : null}
    </>
  )
}

export default async function ContactPage({ params }: Props) {
  const { locale: rawLocale } = await params
  setRequestLocale(rawLocale)

  const locale = rawLocale as Locale
  const en = locale === 'en'

  const t = await getTranslations('contact')
  const services = getServices(locale)

  /**
   * FAQs de la página de contacto — a propósito sobre el CANAL, no sobre el
   * trabajo.
   *
   * Las preguntas del trabajo en sí (cómo cobro, si trabajo solo, qué necesito
   * para empezar) pertenecen al `getSiteFaq` de la home, y las técnicas a cada
   * página de servicio. Nada de aquí repite ninguna de las dos: estas cinco son
   * las que solo tienen sentido teniendo el formulario enfrente — a qué buzón
   * llega, qué pasa con lo que escribes, qué hacer si tu cliente de correo no
   * abre, qué hacer si no sabes nombrar el servicio, y por qué no hay campo de
   * archivos.
   *
   * Cada respuesta se emite como JSON-LD de FAQPage, así que tiene que seguir
   * siendo literalmente cierta. Ya no hay base de datos: el formulario compone
   * un `mailto:`, y ninguna respuesta de aquí puede insinuar lo contrario.
   */
  const faqs = en
    ? [
        {
          question: 'Should I use the form, email, or the phone?',
          answer:
            'All three land in the same inbox. The form only structures the message: it asks for the things I always end up asking for, then opens your own email app with everything already written, so it usually saves one round trip. For a first contact I prefer writing, because it lets me look at the site before I answer. The phone is the better channel once something is already scheduled.',
        },
        {
          question: 'What happens to what I type into the form?',
          answer:
            'Nothing is stored on this site — there is no database and no server receiving the form. The fields only compose an email that leaves from your own account, and that message lives in my inbox, where it is used solely to answer you, under Mexico’s federal data protection law (LFPDPPP). How to exercise your ARCO rights is in the privacy notice.',
        },
        {
          question: 'What if my email app does not open?',
          answer:
            'That happens when the browser has no mail client associated with it, which is common on desktop with webmail. Everything you typed stays in the form, and just below it there is a button that copies my address to the clipboard, so you can paste both the address and your text into Gmail, Outlook, or whatever you use.',
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
            'The form composes text only. Once the draft is open in your mail client you can attach whatever you like, but credentials should not travel by email even there. Paste a link instead — a public URL, a Lighthouse report, a Drive folder, the repository — or just say that it exists, and we agree on a safe channel for access once there is a defined scope.',
        },
      ]
    : [
        {
          question: '¿Te escribo por el formulario, por correo o por teléfono?',
          answer:
            'Los tres llegan al mismo buzón. El formulario solo ordena el mensaje: pide justo los datos que siempre acabo pidiendo y después abre tu propia aplicación de correo con todo escrito, así que normalmente ahorra un ida y vuelta. Para un primer contacto prefiero texto, porque me permite revisar el sitio antes de contestarte. El teléfono funciona mejor cuando ya hay algo agendado.',
        },
        {
          question: '¿Qué pasa con lo que escribo en el formulario?',
          answer:
            'Nada se guarda en este sitio: no hay base de datos ni servidor que reciba el formulario. Los campos solo componen un correo que sale de tu propia cuenta, y ese mensaje vive en mi buzón, donde se usa únicamente para responderte, conforme a la LFPDPPP. Cómo ejercer tus derechos ARCO está en el aviso de privacidad.',
        },
        {
          question: '¿Y si no se abre mi aplicación de correo?',
          answer:
            'Pasa cuando el navegador no tiene un cliente de correo asociado, algo común en escritorio con correo web. Todo lo que escribiste sigue en el formulario, y justo debajo hay un botón que copia mi dirección al portapapeles, así que puedes pegar la dirección y tu texto en Gmail, Outlook o lo que uses.',
        },
        {
          question: 'No sé cuál de tus servicios necesito. ¿Escribo igual?',
          answer:
            'Sí. Describe el síntoma —tráfico que cayó, páginas que no se indexan, un sitio lento, un proceso manual que se come horas cada semana— y yo te digo a cuál de los cuatro corresponde. Si no es algo que yo haga bien, eso te lo digo en la primera respuesta en lugar de mandarte una propuesta.',
        },
        {
          question: '¿Puedo adjuntar archivos o mandarte accesos por aquí?',
          answer:
            'El formulario compone solo texto. Una vez abierto el borrador en tu cliente de correo puedes adjuntar lo que quieras, pero las credenciales no deberían viajar por correo ni ahí. Mejor pega un enlace —una URL pública, un reporte de Lighthouse, una carpeta de Drive, el repositorio— o dime que existe, y acordamos un canal seguro para los accesos cuando ya haya un alcance definido.',
        },
      ]

  /**
   * Lo que pasa de verdad después del botón, en orden. Sin SLA inventado y sin
   * prometer recepción automática: el paso uno es el `mailto:`, dicho tal cual.
   */
  const steps = en
    ? [
        {
          title: 'Your email app opens, not a server of mine',
          desc: 'The form does not submit anywhere. It composes the draft and hands it to your own mail client with the subject and the message already written — you press send, so the copy stays in your sent folder.',
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
          title: 'Se abre tu correo, no un servidor mío',
          desc: 'El formulario no envía a ningún lado. Arma el borrador y se lo entrega a tu propia aplicación de correo con el asunto y el mensaje ya escritos: tú le das enviar, así que la copia queda en tus enviados.',
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
   * con el schema de Person; Fiverr es un listado de marketplace, así que va
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
    {
      name: 'Fiverr',
      href: SOCIAL_LINKS.fiverr,
      hint: t('fiverr'),
      rel: 'nofollow noopener noreferrer',
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

      {/* ══ CABECERA ══════════════════════════════════════════════
          Aurora a plena intensidad más el resplandor del puntero.

          ⚠ AQUÍ ANTES NO HABÍA <PointerGlow /> y la razón escrita era "esta
          página ya carga una isla de cliente y no vale un segundo bundle". Se
          revirtió a conciencia: el formulario ya arrastra el runtime de
          cliente, así que el resplandor no abre una frontera nueva — añade un
          listener de `pointermove` que mueve una capa ya rasterizada con
          `translate3d`. Es el único de la página: uno por página, no tres. */}
      <section className="relative isolate overflow-hidden border-b border-hairline">
        <Backdrop glow />

        <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-16 lg:py-20">
          <Breadcrumbs items={[{ label: t('title') }]} />

          <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] lg:items-center lg:gap-14">
            <div className="max-w-3xl">
              <p className="eyebrow enter-scale">
                <MessageSquare className="size-3.5" aria-hidden="true" />
                {en ? 'Contact · Mexico City' : 'Contacto · Ciudad de México'}
              </p>

              {/* El gradiente cae solo sobre la segunda mitad de la frase. Las
                  dos mitades van en línea y no en el catálogo porque
                  `contact.subtitle` guarda la oración completa como un solo
                  string y el recorte con gradiente necesita dos nodos: el texto
                  es el mismo, partido.

                  `text-ink` no es decorativo aquí: es el único color de texto
                  que aguanta ir DIRECTO sobre la aurora (10.2:1). */}
              <h1 className="enter-blur step-1 mt-6 text-hero text-ink">
                {en ? 'Tell me what’s broken,' : 'Cuéntame qué está roto'}{' '}
                <span className="grad-text">
                  {en ? 'or what you want to build.' : 'o qué quieres construir.'}
                </span>
              </h1>

              {/* ── POR QUÉ EL LEAD VA DENTRO DE CRISTAL ──
                  Medido: sobre la aurora `text-ink-muted` cae a 3.83:1 y
                  `text-ink-subtle` a 3.23:1, y ninguno pasa. Dentro de
                  `.glass-strong` el muted mide 5.1 y el subtle 4.54, y los dos
                  sí. De ahí que el panel sea `strong` y no el cristal por
                  defecto, donde el subtle se queda en 4.30. */}
              <div className="glass glass-strong glass-spec enter step-2 mt-8 max-w-2xl p-6 sm:p-7">
                <p className="text-lead text-ink-muted">{t('lead')}</p>

                {/* Los dos canales que no requieren hacer scroll. Los mismos
                    valores aparecen etiquetados en la barra lateral: un solo
                    NAP, dos colocaciones, nunca dos escrituras. */}
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  {/* ⚠ EL `[overflow-wrap:anywhere]` NO ES ADORNO, ES UN
                      DESBORDAMIENTO MEDIDO. Un correo es un token sin espacios,
                      así que su `min-content` es su ancho completo: 25
                      caracteres a 16px más 56px de padding del botón. Metido
                      dentro de este panel de cristal, el presupuesto a 360px
                      son 272px (40 del `px-5` del contenedor + 48 del `p-6` del
                      panel) y el botón pedía ~292: el <section> lleva
                      `overflow-hidden`, así que en vez de una barra de scroll el
                      borde derecho del contenido DESAPARECÍA en silencio.
                      Dejando que el token rompa, el min-content baja a un
                      carácter y la rejilla vuelve a caber.
                      Verifica: node scripts/overflow-audit.mjs
                                http://localhost:3000/es/contacto */}
                  <Button asChild size="lg" className="sheen shadow-glow-brand">
                    <a href={`mailto:${NAP.email}`}>
                      <Mail className="size-4" aria-hidden="true" />
                      <span className="[overflow-wrap:anywhere]">
                        {NAP.email}
                      </span>
                    </a>
                  </Button>
                  {/* `outline` y no el variant `glass`: este botón vive DENTRO
                      de un panel de cristal, y cristal sobre cristal difumina
                      dos veces, cuesta el doble y se ve peor. */}
                  <Button asChild size="lg" variant="outline">
                    <a href={`tel:${NAP.phone}`}>
                      <Phone className="size-4" aria-hidden="true" />
                      <span data-numeric="">{NAP.phoneDisplay}</span>
                    </a>
                  </Button>
                </div>

                {/* La promesa de respuesta y la zona horaria se dicen en la
                    ficha de al lado y en la barra lateral. Esta línea carga lo
                    que ninguna de las dos dice. */}
                <p className="mt-6 flex items-center gap-2.5 text-sm text-ink-subtle">
                  <span className="ping" aria-hidden="true" />
                  {en
                    ? 'I reply in English or Spanish, and you write to the engineer who does the work.'
                    : 'Respondo en español o inglés, y le escribes al ingeniero que hace el trabajo.'}
                </p>
              </div>
            </div>

            {/* ── COMPOSICIÓN EN TRES PLANOS ──
                `.scene` (la perspectiva) y `.stack-3d` (el reparto en
                profundidad al pasar el mouse) van en el MISMO elemento: la
                perspectiva solo alcanza a los hijos DIRECTOS, así que con el
                stack en un div interno los tres planos se aplanarían.

                `transform-style: preserve-3d` es lo que hace que el navegador
                ordene las capas por su z real y no por su orden en el DOM.

                Los tres planos NO se solapan entre sí, y eso es una regla y no
                una casualidad: la etiqueta del hueco de imagen es a su vez un
                panel de cristal, y un cristal encima de otro difumina dos
                veces. El hueco ocupa la mitad de arriba; las dos fichas se
                reparten la de abajo, una a cada lado.

                En móvil la rejilla es de una columna y este bloque es el
                segundo hijo, así que entra DESPUÉS del texto y el h1 nunca
                queda bajo el pliegue. */}
            <div className="enter-scale step-3">
              <div className="relative mx-auto w-full max-w-[24rem]">
                {/* Halo que se desplaza. Va FUERA del stack porque
                    `.stack-3d > *` cuenta hijos y un decorativo adentro
                    correría los índices. Dos capas: `.grad-drift` fija
                    `position: relative` y le ganaría a la utilidad `absolute`
                    (está fuera de @layer), así que el posicionamiento vive en
                    el envoltorio y el gradiente que se desplaza vive dentro. */}
                {/* `-inset-4` y no `-inset-5`: medido en captura a 390px, con
                    20px de sangrado el halo llegaba justo a los dos bordes de
                    la pantalla y se leía como una banda de color, no como un
                    resplandor. Al 50% de opacidad las dos fichas de cristal se
                    leen flotando encima en lugar de pegadas a una tarjeta
                    azul. */}
                <div className="absolute -inset-4 opacity-50" aria-hidden="true">
                  <div className="grad-drift float-slow size-full rounded-[3rem]" />
                </div>

                <div className="scene stack-3d relative aspect-[5/6] [transform-style:preserve-3d]">
                  {/* Plano 1 — el hueco de imagen, el que se va hacia atrás. */}
                  <div className="depth-1 absolute right-0 top-0 z-10 w-[88%]">
                    <ImageSlot
                      path="/contacto/cdmx.png"
                      alt={
                        en
                          ? 'Mexico City, where Carlos Anaya Ruiz works from.'
                          : 'Ciudad de México, desde donde trabaja Carlos Anaya Ruiz.'
                      }
                      hint={en ? 'Photo of Mexico City' : 'Foto de CDMX'}
                      width={1200}
                      height={800}
                      sizes="(min-width: 1024px) 340px, 80vw"
                      className="aspect-[3/2] rounded-2xl shadow-lift-3"
                    />
                  </div>

                  {/* Plano 2 — la promesa de respuesta. `strong` porque el
                      calificador de abajo es `text-ink-subtle`, que sobre el
                      cristal por defecto se queda en 4.30 y no pasa. */}
                  <div className="depth-2 absolute bottom-[22%] left-0 z-20 w-[64%]">
                    <div className="glass glass-strong glass-spec p-4 sm:p-5">
                      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-strong">
                        <Clock className="size-3.5" aria-hidden="true" />
                        {en ? 'Response' : 'Respuesta'}
                      </p>
                      <p className="mt-2 text-sm font-semibold leading-snug text-ink">
                        {t('responseTime')}
                      </p>
                      <p className="mt-1 text-xs text-ink-subtle">
                        {en
                          ? 'Written by me, not by a bot.'
                          : 'Escrita por mí, no por un bot.'}
                      </p>
                    </div>
                  </div>

                  {/* Plano 3 — el que se adelanta al pasar el mouse. */}
                  <div className="depth-3 absolute bottom-0 right-0 z-30 w-[52%]">
                    <div className="glass glass-strong glass-spec p-4">
                      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-ink">
                        <MapPin className="size-3.5" aria-hidden="true" />
                        {t('location')}
                      </p>
                      <p className="mt-2 text-sm font-semibold leading-snug text-ink">
                        {en ? NAP.localityEn : NAP.locality}
                      </p>
                      <p
                        className="mt-1 text-xs text-ink-subtle"
                        data-numeric=""
                      >
                        GMT-6
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FORMULARIO + CONTACTO DIRECTO ═════════════════════════
          La segunda sección con aurora, y la que más la necesita: el
          formulario ES un panel de cristal grande, y sin nada de color detrás
          se vería como una tarjeta blanca sobre un fondo blanco.

          ⚠ AQUÍ NO HAY `.reveal` NI `.reveal-stagger`, Y NO ES OLVIDO.
          Desplazar una superficie con `backdrop-filter` mientras se hace
          scroll obliga al navegador a volver a muestrear y difuminar lo que
          hay detrás en cada frame: es el gasto exacto que hacía sentir lento
          este sitio. Las entradas de los paneles de cristal son de UNA sola
          pasada al cargar (`.enter`, que termina y se queda quieta) y el
          movimiento continuo lo pone la aurora de detrás, que solo mueve capas
          ya rasterizadas. */}
      <section className="relative isolate overflow-hidden">
        <Backdrop />

        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,21rem)] lg:gap-14">
            {/* Columna principal. El formulario trae su propio h2, su propio
                panel de cristal y sus propias regiones aria-live; la página
                solo lo coloca en la retícula. No se toca desde aquí. */}
            <div className="enter">
              <ContactForm />
            </div>

            <aside
              aria-labelledby="contact-direct"
              className="enter step-2 flex flex-col gap-6"
            >
              <div className="glass glass-strong glass-spec p-6 sm:p-7">
                <h2 id="contact-direct" className="text-d3 text-ink">
                  {t('info')}
                </h2>

                {/* El NAP, desde lib/constants.ts. Correo y teléfono son
                    enlaces reales: en un móvil el número marca, y los dos
                    objetivos pasan el piso táctil de 44 px.

                    `.press` en los dos: un enlace que no responde al dedo se
                    siente muerto, y el hundimiento de `--ease-press` es casi
                    instantáneo a propósito. El realce de hover es `bg-surface`
                    y no un lavado de marca porque el renglón está sobre
                    cristal: una superficie opaca se lee como una fila que se
                    levanta, un lavado translúcido se pierde en el vidrio. */}
                <dl className="mt-6 space-y-5">
                  <div className="border-b border-hairline pb-5">
                    <dt className="flex items-center gap-2.5 text-sm font-semibold text-ink">
                      <span
                        className="grad-deco inline-flex size-8 items-center justify-center rounded-lg text-white shadow-glow-brand"
                        aria-hidden="true"
                      >
                        <Mail className="size-4" />
                      </span>
                      {t('directEmail')}
                    </dt>
                    <dd className="mt-1">
                      <a
                        href={`mailto:${NAP.email}`}
                        className="press -mx-2 inline-flex min-h-11 items-center break-all rounded-lg px-2 text-sm font-semibold text-brand-strong underline underline-offset-4 hover:bg-surface hover:shadow-lift-1"
                      >
                        {NAP.email}
                      </a>
                    </dd>
                  </div>

                  <div className="border-b border-hairline pb-5">
                    <dt className="flex items-center gap-2.5 text-sm font-semibold text-ink">
                      <span
                        className="grad-deco inline-flex size-8 items-center justify-center rounded-lg text-white shadow-glow-brand"
                        aria-hidden="true"
                      >
                        <Phone className="size-4" />
                      </span>
                      {en ? 'Phone' : 'Teléfono'}
                    </dt>
                    <dd className="mt-1">
                      <a
                        href={`tel:${NAP.phone}`}
                        data-numeric=""
                        className="press -mx-2 inline-flex min-h-11 items-center rounded-lg px-2 text-sm font-semibold text-brand-strong underline underline-offset-4 hover:bg-surface hover:shadow-lift-1"
                      >
                        {NAP.phoneDisplay}
                      </a>
                    </dd>
                  </div>

                  <div className="border-b border-hairline pb-5">
                    <dt className="flex items-center gap-2.5 text-sm font-semibold text-ink">
                      <span
                        className="grad-deco inline-flex size-8 items-center justify-center rounded-lg text-white shadow-glow-brand"
                        aria-hidden="true"
                      >
                        <MapPin className="size-4" />
                      </span>
                      {t('location')}
                    </dt>
                    <dd className="mt-1.5 text-sm text-ink-muted">
                      {en ? NAP.localityEn : NAP.locality}
                      {', '}
                      {en ? NAP.countryNameEn : NAP.countryName}
                      <span className="mt-1 block text-ink-subtle">
                        {en
                          ? 'Remote with clients across Latin America and the United States.'
                          : 'Remoto con clientes en Latinoamérica y Estados Unidos.'}
                      </span>
                    </dd>
                  </div>

                  <div>
                    <dt className="flex items-center gap-2.5 text-sm font-semibold text-ink">
                      <span
                        className="grad-deco inline-flex size-8 items-center justify-center rounded-lg text-white shadow-glow-brand"
                        aria-hidden="true"
                      >
                        <Clock className="size-4" />
                      </span>
                      {en
                        ? 'Time zone and response'
                        : 'Zona horaria y respuesta'}
                    </dt>
                    <dd className="mt-1.5 text-sm text-ink-muted">
                      <span className="font-semibold text-ink">
                        {t('responseTime')}
                      </span>
                      <span className="mt-1 block">
                        {en
                          ? 'I work from Mexico City, GMT-6 — an overlap with nearly the whole working day in the United States and Latin America.'
                          : 'Trabajo desde Ciudad de México, GMT-6: se traslapa con casi todo el horario laboral de Estados Unidos y Latinoamérica.'}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Perfiles. Segundo panel de cristal, también `strong` porque la
                  segunda línea de cada fila es `text-ink-subtle`. */}
              <div className="glass glass-strong glass-spec p-6 sm:p-7">
                <h2 className="text-d3 text-ink">{t('social')}</h2>

                <ul className="mt-5 space-y-1">
                  {profiles.map((profile) => (
                    <li key={profile.name}>
                      <a
                        href={profile.href}
                        target="_blank"
                        rel={profile.rel}
                        className="press group -mx-2 flex min-h-11 items-center justify-between gap-3 rounded-lg px-2 py-2.5 text-sm hover:bg-surface hover:shadow-lift-1"
                      >
                        <span className="text-ink">
                          {profile.name}
                          <span className="mt-0.5 block text-ink-subtle">
                            {profile.hint}
                          </span>
                        </span>
                        <ArrowUpRight
                          className="size-4 shrink-0 text-sky-ink transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ══ QUÉ PASA DESPUÉS + ALCANCE ════════════════════════════
          Sin aurora a propósito: el color lo pone `.grad-soft`, un
          `background-image` fijo que no se anima y por tanto no consume una de
          las tres capas compuestas del presupuesto. Las tarjetas son opacas
          (`.card`) y el 3D lo pone `.tilt-hover`, que es CSS puro: la
          perspectiva vive en la rejilla (`.scene`) y la rotación en cada
          tarjeta, que es exactamente lo que hace que las tres compartan punto
          de fuga en lugar de girar cada una por su cuenta. */}
      <section className="defer-paint grad-soft border-y border-hairline">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-16">
            <div>
              <div className="reveal">
                <p className="eyebrow">
                  {en ? 'What happens next' : 'Qué pasa después'}
                </p>
                <h2 className="mt-5 text-d1 text-ink">
                  {en ? 'After you press send' : 'Después de que le das enviar'}
                </h2>
              </div>

              {/* El `.reveal-stagger` va en la LISTA y el `.tilt-hover` en cada
                  <li>: una animación con `fill: both` se queda dueña del
                  `transform` de su propio elemento para siempre, así que
                  compartir nodo dejaría la tarjeta sin inclinación. */}
              <ol className="scene reveal-stagger mt-12 grid gap-6 sm:grid-cols-3">
                {steps.map((step, index) => (
                  <li key={step.title} className="tilt-hover rounded-xl">
                    <div className="card sheen h-full p-6">
                      <span
                        className="grad-text font-display text-4xl font-bold leading-none"
                        data-numeric=""
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h3 className="mt-4 text-d3 text-ink">{step.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                        {step.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="reveal">
              <p className="eyebrow">{en ? 'Scope' : 'Alcance'}</p>
              <h2 className="mt-5 text-d3 text-ink">{t('projectTypes')}</h2>
              <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                {t('projectTypesDesc')}
              </p>

              <ul className="card mt-7 p-3">
                {services.map((service) => {
                  const Icon = service.icon
                  return (
                    <li key={service.id}>
                      <Link
                        href={servicePath(service, locale) as '/seo-tecnico'}
                        className="press group flex min-h-11 items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-sm hover:bg-brand-wash hover:shadow-lift-1"
                      >
                        <span className="flex items-center gap-3">
                          <Icon
                            className="size-4 shrink-0 text-sky-ink"
                            aria-hidden="true"
                          />
                          <span className="font-medium text-ink transition-colors group-hover:text-brand-strong">
                            {service.title}
                          </span>
                        </span>
                        <ArrowUpRight
                          className="size-4 shrink-0 text-ink-subtle transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FAQ ═══════════════════════════════════════════════════
          Tercera y última sección con aurora. Un panel de cristal grande y no
          cinco pequeños: `backdrop-filter` es lo más caro del sistema y las
          respuestas ya se separan con su propia línea. */}
      <section className="defer-paint relative isolate overflow-hidden border-b border-hairline">
        <Backdrop />

        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-20">
            <div>
              <p className="eyebrow">
                {en ? 'Before you write' : 'Antes de escribir'}
              </p>
              <h2 className="mt-5 text-d1 text-ink">
                {en
                  ? 'Questions about getting in touch'
                  : 'Dudas sobre cómo contactarme'}
              </h2>

              {/* Párrafo secundario sobre aurora: dentro de cristal, porque
                  `ink-muted` directo sobre la aurora mide 3.83:1. */}
              <div className="glass glass-strong glass-spec mt-6 px-5 py-4">
                <p className="text-ink-muted">
                  {en
                    ? 'How the engagement itself works — rates, scope, guarantees — is answered on the '
                    : 'Cómo funciona el trabajo en sí —tarifas, alcance, garantías— está respondido en la '}
                  <Link
                    href="/"
                    className="font-semibold text-brand-strong underline underline-offset-4"
                  >
                    {en ? 'home page' : 'página de inicio'}
                  </Link>
                  .
                </p>
              </div>
            </div>

            {/* Solo preguntas de canal, y el mismo texto que declara el markup
                de FAQPage. Las del trabajo viven en la home y las técnicas en
                cada página de servicio, así ninguna consulta se responde desde
                dos URLs distintas.

                `.glass` a secas y no `strong`: aquí dentro no hay
                `text-ink-subtle` — la pregunta es `ink` y la respuesta
                `ink-muted`, que sobre el cristal por defecto mide 5.1. */}
            {/* El `[&>details:last-child]` quita la línea de la última
                pregunta: `<Disclosure>` lleva `border-b` para separar filas, y
                en la de abajo esa línea queda flotando dentro del panel. */}
            <div className="glass glass-spec px-5 [&>details:last-child]:border-b-0 sm:px-7">
              {faqs.map((faq) => (
                <Disclosure
                  key={faq.question}
                  question={faq.question}
                  answer={faq.answer}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
