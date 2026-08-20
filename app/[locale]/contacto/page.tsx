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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateContactPageGraph(locale, faqs)),
        }}
      />

      {/* ══ CABECERA ══════════════════════════════════════════════
          Dos capas decorativas en -z-10, ninguna captura eventos. Aquí no va
          <PointerGlow />: esta página ya carga una isla de cliente (el
          formulario) y no vale un segundo bundle solo por el resplandor. */}
      <section className="relative isolate overflow-hidden border-b border-hairline">
        <div className="mesh" aria-hidden="true" />
        <div className="grid-fade" aria-hidden="true" />

        <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
          <Breadcrumbs items={[{ label: t('title') }]} />

          <div className="mt-10 max-w-3xl">
            <p className="eyebrow enter-scale">
              <MessageSquare className="size-3.5" aria-hidden="true" />
              {en ? 'Contact · Mexico City' : 'Contacto · Ciudad de México'}
            </p>

            {/* El gradiente cae solo sobre la segunda mitad de la frase. Las dos
                mitades van en línea y no en el catálogo porque
                `contact.subtitle` guarda la oración completa como un solo
                string y el recorte con gradiente necesita dos nodos: el texto
                es el mismo, partido. */}
            <h1 className="enter-blur step-1 mt-6 text-d1 text-ink">
              {en ? 'Tell me what’s broken,' : 'Cuéntame qué está roto'}{' '}
              <span className="grad-text">
                {en ? 'or what you want to build.' : 'o qué quieres construir.'}
              </span>
            </h1>

            <p className="enter step-2 mt-6 text-lead text-ink-muted">
              {t('lead')}
            </p>

            {/* Los dos canales que no requieren hacer scroll. Los mismos valores
                aparecen etiquetados en la barra lateral: un solo NAP, dos
                colocaciones, nunca dos escrituras. */}
            <div className="enter step-3 mt-9 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="sheen shadow-glow-brand">
                <a href={`mailto:${NAP.email}`}>
                  <Mail className="size-4" aria-hidden="true" />
                  {NAP.email}
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={`tel:${NAP.phone}`}>
                  <Phone className="size-4" aria-hidden="true" />
                  <span data-numeric="">{NAP.phoneDisplay}</span>
                </a>
              </Button>
            </div>

            {/* La promesa de respuesta y la zona horaria se dicen una sola vez,
                en la barra lateral. Esta línea carga lo que esa no dice. */}
            <p className="enter step-4 mt-6 flex items-center gap-2.5 text-sm text-ink-subtle">
              <span className="ping" aria-hidden="true" />
              {en
                ? 'I reply in English or Spanish, and you write to the engineer who does the work.'
                : 'Respondo en español o inglés, y le escribes al ingeniero que hace el trabajo.'}
            </p>
          </div>
        </div>
      </section>

      {/* ══ FORMULARIO + CONTACTO DIRECTO ═════════════════════════ */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,21rem)] lg:gap-14">
          {/* Columna principal. El formulario trae su propio h2, su propia
              tarjeta y sus propias regiones aria-live; la página solo lo coloca
              en la retícula. No se toca desde aquí. */}
          <div className="reveal">
            <ContactForm />
          </div>

          <aside
            aria-labelledby="contact-direct"
            className="reveal flex flex-col gap-6"
          >
            <div className="glass glass-spec p-6 sm:p-7">
              <h2 id="contact-direct" className="text-d3 text-ink">
                {t('info')}
              </h2>

              {/* El NAP, desde lib/constants.ts. Correo y teléfono son enlaces
                  reales: en un móvil el número marca, y los dos objetivos pasan
                  el piso táctil de 44 px. */}
              <dl className="mt-6 space-y-5">
                <div className="border-b border-hairline pb-5">
                  <dt className="flex items-center gap-2.5 text-sm font-semibold text-ink">
                    <span
                      className="grad-deco inline-flex size-8 items-center justify-center rounded-lg text-white"
                      aria-hidden="true"
                    >
                      <Mail className="size-4" />
                    </span>
                    {t('directEmail')}
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={`mailto:${NAP.email}`}
                      className="inline-flex min-h-11 items-center break-all text-sm font-medium text-brand-strong underline underline-offset-4 transition-colors hover:text-brand"
                    >
                      {NAP.email}
                    </a>
                  </dd>
                </div>

                <div className="border-b border-hairline pb-5">
                  <dt className="flex items-center gap-2.5 text-sm font-semibold text-ink">
                    <span
                      className="grad-deco inline-flex size-8 items-center justify-center rounded-lg text-white"
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
                      className="inline-flex min-h-11 items-center text-sm font-medium text-brand-strong underline underline-offset-4 transition-colors hover:text-brand"
                    >
                      {NAP.phoneDisplay}
                    </a>
                  </dd>
                </div>

                <div className="border-b border-hairline pb-5">
                  <dt className="flex items-center gap-2.5 text-sm font-semibold text-ink">
                    <span
                      className="grad-deco inline-flex size-8 items-center justify-center rounded-lg text-white"
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
                      className="grad-deco inline-flex size-8 items-center justify-center rounded-lg text-white"
                      aria-hidden="true"
                    >
                      <Clock className="size-4" />
                    </span>
                    {en ? 'Time zone and response' : 'Zona horaria y respuesta'}
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

            {/* Perfiles. El `rel="me"` de los dos enlaces de identidad es lo que
                permite a Google reconciliarlos con el schema de Person; Fiverr
                es un listado de marketplace, así que va nofollow. */}
            <div className="card p-6 sm:p-7">
              <h2 className="text-d3 text-ink">{t('social')}</h2>

              <ul className="mt-5 space-y-1">
                <li>
                  <a
                    href={SOCIAL_LINKS.linkedin}
                    target="_blank"
                    rel="me noopener noreferrer"
                    className="group -mx-2 flex min-h-11 items-center justify-between gap-3 rounded-lg px-2 py-2.5 text-sm transition-colors hover:bg-brand-wash"
                  >
                    <span className="text-ink">
                      LinkedIn
                      <span className="mt-0.5 block text-ink-subtle">
                        {t('connect')}
                      </span>
                    </span>
                    <ArrowUpRight
                      className="size-4 shrink-0 text-sky-ink transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </a>
                </li>
                <li>
                  <a
                    href={SOCIAL_LINKS.github}
                    target="_blank"
                    rel="me noopener noreferrer"
                    className="group -mx-2 flex min-h-11 items-center justify-between gap-3 rounded-lg px-2 py-2.5 text-sm transition-colors hover:bg-brand-wash"
                  >
                    <span className="text-ink">
                      GitHub
                      <span className="mt-0.5 block text-ink-subtle">
                        {t('seeProjects')}
                      </span>
                    </span>
                    <ArrowUpRight
                      className="size-4 shrink-0 text-sky-ink transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </a>
                </li>
                <li>
                  <a
                    href={SOCIAL_LINKS.fiverr}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="group -mx-2 flex min-h-11 items-center justify-between gap-3 rounded-lg px-2 py-2.5 text-sm transition-colors hover:bg-brand-wash"
                  >
                    <span className="text-ink">
                      Fiverr
                      <span className="mt-0.5 block text-ink-subtle">
                        {t('fiverr')}
                      </span>
                    </span>
                    <ArrowUpRight
                      className="size-4 shrink-0 text-sky-ink transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* ══ QUÉ PASA DESPUÉS + ALCANCE ════════════════════════════ */}
      <section className="defer-paint border-y border-hairline bg-ground-tint">
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

              <ol className="reveal-stagger mt-12 grid gap-6 sm:grid-cols-3">
                {steps.map((step, index) => (
                  <li key={step.title} className="card card-hover p-6">
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
                        className="group flex min-h-11 items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-brand-wash"
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

      {/* ══ FAQ ═══════════════════════════════════════════════════ */}
      <section className="defer-paint mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-20">
          <div className="reveal">
            <p className="eyebrow">
              {en ? 'Before you write' : 'Antes de escribir'}
            </p>
            <h2 className="mt-5 text-d1 text-ink">
              {en
                ? 'Questions about getting in touch'
                : 'Dudas sobre cómo contactarme'}
            </h2>
            <p className="mt-4 text-ink-muted">
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

          {/* Solo preguntas de canal, y el mismo texto que declara el markup de
              FAQPage. Las del trabajo viven en la home y las técnicas en cada
              página de servicio, así ninguna consulta se responde desde dos
              URLs distintas. */}
          <div className="reveal card px-5 sm:px-7">
            {faqs.map((faq) => (
              <Disclosure
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
