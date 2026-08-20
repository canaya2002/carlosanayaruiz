import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ArrowRight, ArrowUpRight, Check, X } from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Disclosure } from '@/components/ui/disclosure'
import {
  getServiceById,
  servicePath,
  type Service,
  type ServiceId,
} from '@/data/services'
import { NAP } from '@/lib/constants'
import { generatePageMetadata } from '@/lib/seo'
import {
  generateServicePageGraph,
  type BreadcrumbItem as SchemaCrumb,
} from '@/lib/schema'
import type { Pathname } from '@/i18n/routing'
import { Locale } from '@/data/types'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const en = locale === 'en'

  return generatePageMetadata({
    locale: locale as Locale,
    route: 'automatizacionIa',
    // Se lee como resultado de búsqueda, no como eslogan, y no comparte
    // encabezado con ningún otro título del sitio.
    title: en
      ? 'AI Automation & LLM Chatbots'
      : 'Automatización con IA y chatbots LLM',
    description: en
      ? 'LLM chatbots (GPT, Gemini, Claude) and automated workflows wired to your CRM, database and APIs, with spend limits and human escalation.'
      : 'Chatbots con LLM (GPT, Gemini, Claude) y flujos automatizados conectados a tu CRM, base de datos y APIs, con límites de gasto y escalamiento humano.',
  })
}

/** Los dos servicios hermanos que de verdad le sirven a quien lee esta página. */
const RELATED_IDS: ServiceId[] = ['nextjs-firebase', 'dashboards']

export default async function AiAutomationPage({ params }: Props) {
  const { locale: rawLocale } = await params
  setRequestLocale(rawLocale)

  const locale = rawLocale as Locale
  const en = locale === 'en'

  // Todas las secciones de abajo se renderizan desde este registro, así que la
  // página y el JSON-LD no pueden describir dos servicios distintos.
  const service = getServiceById(locale, 'ai-automation')
  if (!service) notFound()

  const t = await getTranslations('servicePages.automatizacionIA')
  const tn = await getTranslations('nav')
  const tb = await getTranslations('breadcrumbs')
  const ts = await getTranslations('services')

  const Icon = service.icon

  const related = RELATED_IDS.map((id) => getServiceById(locale, id)).filter(
    (item): item is Service => item !== undefined
  )

  // Espeja la ruta visible exactamente — tres niveles, hub incluido.
  const schemaCrumbs: SchemaCrumb[] = [
    { name: tb('home'), route: 'home' },
    { name: tn('services'), route: 'services' },
    { name: service.title, route: 'automatizacionIa' },
  ]

  // El gradiente cae solo sobre la última palabra del título; recortar el h1
  // completo le quita legibilidad al encabezado más importante de la página.
  // Se parte el string del catálogo en lugar de duplicarlo, así el h1 nunca
  // puede contradecir a `title`.
  const titleWords = t('title').split(' ')
  const titleAccent = titleWords[titleWords.length - 1]
  const titleHead = titleWords.slice(0, -1).join(' ')

  // Solo herramientas que de verdad son parte de este trabajo. Los nombres de
  // modelo van sin versión: una versión fija en el copy queda vieja en un
  // trimestre.
  const stack = [
    {
      label: en ? 'Models' : 'Modelos',
      items: ['GPT', 'Gemini', 'Claude'],
    },
    {
      label: en ? 'Runtime and orchestration' : 'Runtime y orquestación',
      items: ['Python', 'Node.js', 'TypeScript', 'LangChain', 'Next.js'],
    },
    {
      label: en ? 'Data and integrations' : 'Datos e integraciones',
      items: [
        'REST APIs',
        'GraphQL',
        'WebSocket',
        'Firestore',
        'PostgreSQL',
        'HubSpot',
        'Salesforce',
      ],
    },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            // El FAQ propio del servicio — el de nivel sitio pertenece a la
            // home, y dos URLs no deben responder la misma pregunta.
            generateServicePageGraph(locale, service, schemaCrumbs, service.faq)
          ),
        }}
      />

      {/* ══ CABECERA ═══════════════════════════════════════════════
          Dos capas decorativas, ambas en -z-10 y ninguna captura
          eventos: la malla animada y la cuadrícula que se desvanece.
          El resplandor de puntero se queda para la home; aquí la
          cabecera es de ritmo menor (py-14) y sobraría.              */}
      <section className="relative isolate overflow-hidden border-b border-hairline">
        <div className="mesh" aria-hidden="true" />
        <div className="grid-fade" aria-hidden="true" />

        <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
          <Breadcrumbs
            className="enter"
            items={[
              { label: tn('services'), href: '/servicios' },
              { label: service.title },
            ]}
          />

          <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-20">
            <div className="max-w-2xl">
              <p className="eyebrow enter-scale">
                {en
                  ? 'AI automation · Mexico City'
                  : 'Automatización con IA · Ciudad de México'}
              </p>

              <h1 className="enter-blur step-1 mt-6 text-d1 text-ink">
                {titleHead} <span className="grad-text">{titleAccent}</span>
              </h1>

              <p className="enter step-2 mt-6 text-lead text-ink-muted">
                {t('subtitle')}
              </p>

              <div className="enter step-3 mt-9 flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="sheen shadow-glow-brand">
                  <Link href="/contacto">
                    {t('ctaMain')}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/servicios">{ts('allServices')}</Link>
                </Button>
              </div>

              <p className="enter step-4 mt-6 flex items-center gap-2.5 text-sm text-ink-subtle">
                <span className="ping" aria-hidden="true" />
                {en
                  ? 'Based in Mexico City. Available remotely.'
                  : 'Desde Ciudad de México. Disponible en remoto.'}
              </p>
            </div>

            {/* La marca del servicio, con el relleno de gradiente y su
                resplandor. Decorativa: el h1 ya nombra el servicio. */}
            <div className="enter-scale step-2 order-first lg:order-none">
              <span
                className="grad-fill flex size-20 items-center justify-center rounded-3xl shadow-glow-brand sm:size-24 lg:size-28"
                aria-hidden="true"
              >
                <Icon className="size-9 lg:size-12" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ══ POR QUÉ IMPORTA ════════════════════════════════════════ */}
      <section className="border-b border-hairline bg-ground-tint">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-20">
            <div className="reveal">
              <p className="eyebrow">{en ? 'Context' : 'Contexto'}</p>
              <h2 className="mt-5 text-d1 text-ink">{t('whyTitle')}</h2>
            </div>

            {/* Primera persona y concreto a propósito: esta es la sección que
                separa la ingeniería de un demo. */}
            <div className="reveal prose-rich">
              <p>
                {en
                  ? "AI automation isn't about adding a chatbot for the sake of it. It's about identifying which processes in your business consume the most human time, and engineering solutions that handle them reliably, securely and at scale."
                  : 'La automatización con IA no se trata de poner un chatbot por ponerlo. Se trata de identificar qué procesos de tu negocio consumen más tiempo humano e ingeniar soluciones que los manejen de forma confiable, segura y a escala.'}
              </p>
              <p>
                {en
                  ? 'I build chatbots that hold context and memory, automated workflows that process documents, and API integrations that connect your existing systems to an LLM — always with security as a design principle rather than a later add-on.'
                  : 'Construyo chatbots que entienden contexto y memoria, flujos automatizados que procesan documentos e integraciones de APIs que conectan tus sistemas existentes con un LLM — siempre con la seguridad como principio de diseño, no como un agregado posterior.'}
              </p>
              <p>
                {en
                  ? 'Before any code is written I put two things in writing: which information never reaches the model, and the exact point at which a conversation is handed to a person. An LLM gets things wrong, and a system with no plan for that case is not finished.'
                  : 'Antes de escribir una línea de código dejo dos cosas por escrito: qué información nunca sale hacia el modelo y en qué punto exacto la conversación pasa a una persona. Un LLM se equivoca, y un sistema que no tiene previsto ese caso no está terminado.'}
              </p>
              <p>
                {en
                  ? 'Cost is designed, not discovered on the invoice: caching for what repeats, a model chosen to match the difficulty of the task, and a dashboard where you can read what each conversation actually cost.'
                  : 'El costo se diseña, no se descubre en la factura: caché para lo que se repite, un modelo elegido según la dificultad de la tarea y un panel donde puedes leer cuánto costó realmente cada conversación.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ QUÉ ENTREGO ════════════════════════════════════════════ */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="reveal max-w-2xl">
          <p className="eyebrow">{en ? 'Scope' : 'Alcance'}</p>
          <h2 className="mt-5 text-d1 text-ink">{t('whatTitle')}</h2>
          <p className="mt-4 text-lead text-ink-muted">{service.headline}</p>
        </div>

        <ul className="reveal-stagger mt-14 grid gap-6 md:grid-cols-3">
          {service.benefits.map((benefit) => (
            <li key={benefit} className="card card-hover p-6 sm:p-7">
              <span
                className="grad-fill inline-flex size-12 items-center justify-center rounded-xl shadow-glow-brand"
                aria-hidden="true"
              >
                <Check className="size-6" />
              </span>
              <p className="mt-5 text-ink-muted">{benefit}</p>
            </li>
          ))}
        </ul>

        {/* Los resultados son la promesa a la que se puede exigir esta página,
            así que llevan su propio bloque en lugar de compartir la rejilla de
            beneficios. */}
        <div className="reveal mt-16">
          <h3 className="text-d3 text-ink">
            {en ? 'What is different afterwards' : 'Qué cambia después'}
          </h3>

          <ul className="mt-6 grid gap-5 sm:grid-cols-2">
            {service.outcomes.map((outcome) => (
              <li key={outcome} className="card p-6">
                <span
                  className="grad-fill block h-1 w-12 rounded-full"
                  aria-hidden="true"
                />
                <p className="mt-5 text-ink-muted">{outcome}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══ CÓMO CORRE EL TRABAJO ══════════════════════════════════ */}
      <section className="border-y border-hairline bg-ground-tint">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">{en ? 'Process' : 'Proceso'}</p>
            <h2 className="mt-5 text-d1 text-ink">
              {en ? 'How the work runs' : 'Cómo corre el trabajo'}
            </h2>
            <p className="mt-4 text-lead text-ink-muted">
              {en
                ? 'Four steps, in this order. The limits are agreed before anything is built.'
                : 'Cuatro pasos, en este orden. Los límites se acuerdan antes de construir nada.'}
            </p>
          </div>

          <ol className="reveal-stagger mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {service.process.map((step, index) => (
              <li key={step.title}>
                <span
                  className="grad-text font-display text-5xl font-bold leading-none"
                  data-numeric=""
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 text-d3 text-ink">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ══ ENCAJE / NO ENCAJE ═════════════════════════════════════ */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="reveal max-w-2xl">
          <p className="eyebrow">{en ? 'Fit' : 'Encaje'}</p>
          <h2 className="mt-5 text-d1 text-ink">
            {en
              ? 'Who this is for — and who it is not'
              : 'Para quién es — y para quién no'}
          </h2>
        </div>

        <div className="reveal-stagger mt-14 grid gap-6 md:grid-cols-2 md:gap-8">
          <div className="card p-6 sm:p-8">
            <span
              className="grad-fill block h-1 w-12 rounded-full"
              aria-hidden="true"
            />
            <h3 className="mt-5 text-d3 text-ink">
              {en ? 'A good fit' : 'Buen encaje'}
            </h3>
            <ul className="mt-6 space-y-4">
              {service.forWhom.map((item) => (
                <li key={item} className="flex gap-3 text-ink-muted">
                  <Check
                    className="mt-1 size-4 shrink-0 text-violet"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mismo peso visual que la columna de encaje, a propósito. Suavizar
              esto para que suene a argumento de venta es exactamente lo que lo
              vuelve inútil. La barra de arriba cambia de tono y el ícono cambia
              de forma: el estado nunca se comunica solo con color. */}
          <div className="card p-6 sm:p-8">
            <span
              className="block h-1 w-12 rounded-full bg-ink-subtle"
              aria-hidden="true"
            />
            <h3 className="mt-5 text-d3 text-ink">
              {en ? 'Not a good fit' : 'No es buen encaje'}
            </h3>
            <ul className="mt-6 space-y-4">
              {service.notFor.map((item) => (
                <li key={item} className="flex gap-3 text-ink-muted">
                  <X
                    className="mt-1 size-4 shrink-0 text-ink-subtle"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ══ ENTREGABLES ════════════════════════════════════════════ */}
      <section className="border-y border-hairline bg-ground-tint">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">{en ? 'Deliverables' : 'Entregables'}</p>
            <h2 className="mt-5 text-d1 text-ink">{t('deliverablesTitle')}</h2>
          </div>

          {/* `.prose-rich` ya trae la viñeta de gradiente y la medida de línea,
              así que la lista no necesita íconos propios. */}
          <div className="reveal mt-12 max-w-3xl rounded-2xl border border-hairline bg-surface p-6 shadow-lift-1 sm:p-9">
            <div className="prose-rich">
              <ul>
                {service.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ══ STACK ══════════════════════════════════════════════════ */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="reveal max-w-2xl">
          <p className="eyebrow">Stack</p>
          <h2 className="mt-5 text-d1 text-ink">{t('toolsTitle')}</h2>
        </div>

        <dl className="reveal-stagger mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stack.map((group) => (
            <div key={group.label} className="card p-5">
              <dt className="text-sm font-bold tracking-wide text-ink">
                {group.label}
              </dt>
              <dd className="mt-3 flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <Badge key={item} variant="neutral">
                    {item}
                  </Badge>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ══ FAQ ════════════════════════════════════════════════════ */}
      <section className="border-t border-hairline bg-ground-tint">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-20">
            <div className="reveal">
              <p className="eyebrow">FAQ</p>
              <h2 className="mt-5 text-d1 text-ink">{t('faqTitle')}</h2>
              <p className="mt-4 text-ink-muted">
                {en
                  ? 'The questions this service gets before the first call.'
                  : 'Lo que me preguntan de este servicio antes de la primera llamada.'}
              </p>
            </div>

            {/* Se renderiza desde service.faq, que es también lo que emite el
                markup FAQPage de arriba — el texto visible y los datos
                estructurados son los mismos strings. */}
            <div className="reveal rounded-2xl border border-hairline bg-surface px-5 shadow-lift-1 sm:px-7">
              {service.faq.map((faq) => (
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

      {/* ══ RELACIONADOS ═══════════════════════════════════════════ */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="reveal max-w-2xl">
          <p className="eyebrow">{en ? 'Keep reading' : 'Sigue leyendo'}</p>
          <h2 className="mt-5 text-d1 text-ink">{t('relatedTitle')}</h2>
        </div>

        <ul className="reveal-stagger mt-12 grid gap-6 md:grid-cols-2">
          {related.map((item) => {
            const RelatedIcon = item.icon
            return (
              <li key={item.id}>
                <Link
                  href={servicePath(item, locale) as Pathname}
                  className="card card-hover group flex h-full flex-col p-6 sm:p-7"
                >
                  <span
                    className="grad-fill inline-flex size-12 items-center justify-center rounded-xl shadow-glow-brand"
                    aria-hidden="true"
                  >
                    <RelatedIcon className="size-6" />
                  </span>

                  <h3 className="mt-5 text-d3 text-ink transition-colors group-hover:text-brand-strong">
                    {item.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-ink-muted">
                    {item.headline}
                  </p>

                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-strong">
                    {ts('viewService')}
                    <ArrowUpRight
                      className="size-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>

        <p className="reveal mt-8 max-w-[68ch] text-ink-muted">
          {en ? 'Not sure which one you need? ' : '¿No sabes cuál necesitas? '}
          <Link
            href="/servicios"
            className="font-semibold text-brand-strong underline underline-offset-4"
          >
            {en ? 'compare all four services' : 'compara los cuatro servicios'}
          </Link>
          {en
            ? ', or describe the process on the '
            : ', o descríbeme el proceso en la '}
          <Link
            href="/contacto"
            className="font-semibold text-brand-strong underline underline-offset-4"
          >
            {en ? 'contact page' : 'página de contacto'}
          </Link>
          .
        </p>
      </section>

      {/* ══ CTA FINAL ══════════════════════════════════════════════ */}
      <section className="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-8 sm:pb-24">
        <div className="grad-animate reveal-scale relative overflow-hidden rounded-3xl px-6 py-14 shadow-lift-3 sm:px-12 sm:py-20">
          <div className="relative max-w-2xl">
            <h2 className="text-d1 text-white">{t('ctaMain')}</h2>
            <p className="mt-5 text-lead text-white/85">
              {en
                ? 'Tell me who runs the process today, how often it runs, and what happens when it goes wrong. I reply within 24 to 48 business hours with whether it is worth automating and what the first step would be.'
                : 'Cuéntame quién ejecuta el proceso hoy, cada cuánto corre y qué pasa cuando sale mal. Respondo en 24 a 48 horas hábiles con si conviene automatizarlo y cuál sería el primer paso.'}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              {/* Sobre el gradiente el botón se invierte: superficie blanca con
                  texto de marca. `bg-none` es lo que apaga la imagen del variant
                  por defecto; un relleno de marca aquí desaparecería. */}
              <Button
                asChild
                size="lg"
                className="sheen bg-none bg-surface text-brand-strong hover:bg-ground-tint"
              >
                <Link href="/contacto">
                  {t('ctaSecondary')}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <a
                href={`mailto:${NAP.email}`}
                className="text-sm font-semibold text-white underline decoration-white/50 underline-offset-4 hover:decoration-white"
              >
                {NAP.email}
              </a>
            </div>

            <p className="mt-7 text-sm text-white/75">{t('ctaNote')}</p>
          </div>
        </div>
      </section>
    </>
  )
}
