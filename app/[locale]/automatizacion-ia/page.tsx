import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { MediaSlot } from '@/components/instrument/media-slot'
import { Rail } from '@/components/instrument/rail'
import { Ribbon } from '@/components/instrument/ribbon'
import {
  getServiceById,
  getServices,
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
  const tl = await getTranslations('a11y')

  /**
   * El canal. La home escribe los cuatro servicios como canales paralelos
   * a–e de un registrador multipluma; esta página es uno de esos canales y
   * lleva su letra real, calculada del mismo catálogo. Si el orden cambia,
   * cambia aquí sola: no hay una letra escrita a mano en ningún lado.
   */
  const catalogue = getServices(locale)
  const channelId = (id: ServiceId) => {
    const index = catalogue.findIndex((item) => item.id === id)
    return index >= 0 ? String.fromCharCode(97 + index) : ''
  }

  const related = RELATED_IDS.map((id) => getServiceById(locale, id)).filter(
    (item): item is Service => item !== undefined
  )

  // Espeja la ruta visible exactamente — tres niveles, hub incluido.
  const schemaCrumbs: SchemaCrumb[] = [
    { name: tb('home'), route: 'home' },
    { name: tn('services'), route: 'services' },
    { name: service.title, route: 'automatizacionIa' },
  ]

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

  /* Los dos carriles de la cinta llevan el MISMO conjunto en orden opuesto:
     es una sola lista corriendo en dos direcciones, no dos listas distintas.
     La lectura accesible de esos nombres vive en el <dl> de abajo, agrupada
     y etiquetada, así que la cinta va oculta para lectores de pantalla. */
  const tapeItems = stack.flatMap((group) => group.items)
  const tapeItemsBack = [...tapeItems].reverse()

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

      <div
        className="grid"
        style={{ gridTemplateColumns: 'var(--tape-w) minmax(0,1fr)' }}
      >
        <Rail />

        <div className="min-w-0">
          {/* ═══ CABECERA ════════════════════════════════════════
              Sin aguja ni marcas: el instrumento en vivo es de la home.
              Aquí la cinta corre por el margen y el titular es lo único
              que pesa. */}
          <section className="relative px-5 pt-16 pb-20 sm:px-10">
            <p className="stamp">
              {en
                ? `channel ${channelId('ai-automation')} · ai automation`
                : `canal ${channelId('ai-automation')} · automatización con ia`}
            </p>

            {/* `hyphens` solo por debajo de 640: «Automatización» son catorce
                caracteres sin un punto de corte natural y a 375 px mide más
                que la columna. Arriba de sm sobra sitio y la partición se
                apaga, que es donde se vería mal. */}
            <h1 className="mt-6 text-hero text-ink [hyphens:auto] [overflow-wrap:break-word] sm:[hyphens:manual]">
              {t('title')}
            </h1>

            <p className="mt-10 max-w-[48ch] text-lead text-ink-muted">
              {t('subtitle')}
            </p>

            <p className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
              <Link className="link-stylus" href="/contacto">
                {t('ctaMain')} →
              </Link>
              <Link className="link-stylus" href="/servicios">
                {ts('allServices')} →
              </Link>
            </p>

            <p className="stamp mt-8">
              {en
                ? `Based in ${NAP.localityEn}. Available remotely.`
                : `Desde ${NAP.locality}. Disponible en remoto.`}
            </p>
          </section>

          {/* ═══ CONTEXTO ════════════════════════════════════════
              La única zona serif de la página. Cuatro párrafos en primera
              persona: es el operador argumentando, no el catálogo
              describiéndose. */}
          <section className="border-t border-hairline px-5 py-20 sm:px-10">
            <p className="stamp">{en ? 'context' : 'contexto'}</p>
            <h2 className="mt-5 max-w-[18ch] text-d1 text-ink">
              {t('whyTitle')}
            </h2>

            <div className="reveal mt-10 max-w-[58ch] space-y-6 font-human text-ink-muted">
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
          </section>

          {/* ═══ ALCANCE ═════════════════════════════════════════ */}
          <section className="border-t border-hairline px-5 py-20 sm:px-10">
            <p className="stamp">{en ? 'scope' : 'alcance'}</p>
            <h2 className="mt-5 max-w-[18ch] text-d1 text-ink">
              {t('whatTitle')}
            </h2>
            <p className="mt-6 max-w-[52ch] text-lead text-ink-muted">
              {service.headline}
            </p>

            <MediaSlot
              id="automatizacion-ia-evidencia"
              className="mt-12 w-full max-w-3xl"
              sizes="(min-width: 768px) 48rem, 100vw"
            />

            <ul className="reveal-stagger mt-12">
              {service.benefits.map((benefit) => (
                <li key={benefit} className="band max-w-[68ch] text-ink">
                  {benefit}
                </li>
              ))}
            </ul>

            <h3 className="mt-16 text-d3 text-ink">
              {en ? 'What is different afterwards' : 'Qué cambia después'}
            </h3>
            <ul className="reveal-stagger mt-6">
              {service.outcomes.map((outcome) => (
                <li key={outcome} className="band max-w-[68ch] text-ink-muted">
                  {outcome}
                </li>
              ))}
            </ul>
          </section>

          {/* ═══ EL PROCESO ══════════════════════════════════════
              Aquí el número SÍ manda: son cuatro pasos en un orden que no se
              puede alterar, que es la única condición bajo la que este
              sistema acepta una numeración. */}
          <section className="border-t border-hairline px-5 py-20 sm:px-10">
            <p className="stamp">{ts('process')}</p>
            <h2 className="mt-5 max-w-[16ch] text-d1 text-ink">
              {en ? 'How the work runs' : 'Cómo corre el trabajo'}
            </h2>
            <p className="mt-6 max-w-[52ch] text-lead text-ink-muted">
              {en
                ? 'Four steps, in this order. The limits are agreed before anything is built.'
                : 'Cuatro pasos, en este orden. Los límites se acuerdan antes de construir nada.'}
            </p>

            <ol className="reveal-stagger mt-12">
              {service.process.map((step, index) => (
                <li
                  key={step.title}
                  className="band grid gap-x-6 gap-y-2 sm:grid-cols-[3.5rem_minmax(0,1fr)]"
                >
                  <span className="stamp tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-d3 text-ink">{step.title}</h3>
                    <p className="mt-2 max-w-[64ch] text-ink-muted">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* ═══ ENCAJE / NO ENCAJE ══════════════════════════════
              Mismo peso visual en las dos columnas, a propósito. La segunda
              no se suaviza ni se esconde: es la mitad que hace creíble a la
              primera. El estado lo dice el encabezado, nunca un color. */}
          <section className="border-t border-hairline px-5 py-20 sm:px-10">
            <p className="stamp">{en ? 'fit' : 'encaje'}</p>
            <h2 className="mt-5 max-w-[20ch] text-d1 text-ink">
              {en
                ? 'Who this is for — and who it is not'
                : 'Para quién es — y para quién no'}
            </h2>

            <div className="mt-12 grid gap-x-14 gap-y-12 md:grid-cols-2">
              <div>
                <h3 className="text-d3 text-ink">
                  {en ? 'A good fit' : 'Buen encaje'}
                </h3>
                <ul className="reveal-stagger mt-6">
                  {service.forWhom.map((item) => (
                    <li key={item} className="band text-ink-muted">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-d3 text-ink">
                  {en ? 'Not a good fit' : 'No es buen encaje'}
                </h3>
                <ul className="reveal-stagger mt-6">
                  {service.notFor.map((item) => (
                    <li key={item} className="band text-ink-muted">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ═══ LA PLACA — QUÉ RECIBES ══════════════════════════
              El único bloque invertido de la página, y va sobre lo que el
              cliente de verdad compra. Dentro no se escribe una sola clase
              de tinta: `.plate` ya invierte el material y `.stamp` tiene su
              propio token medido para papel. */}
          <section className="plate px-5 py-20 sm:px-10">
            <p className="stamp">{ts('includes')}</p>
            <h2 className="mt-5 max-w-[16ch] text-d1">
              {t('deliverablesTitle')}
            </h2>

            <ul className="reveal-stagger mt-12 max-w-[60ch]">
              {service.includes.map((item) => (
                <li key={item} className="band">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* ═══ LA CINTA DEL STACK ══════════════════════════════
              Dos carriles con el mismo conjunto en direcciones opuestas: el
              cruce es lo que da profundidad, sin una sombra y sin una caja.
              La lectura ordenada y etiquetada va debajo, en el registro. */}
          <section
            className="overflow-hidden border-t border-hairline py-16"
            aria-labelledby="stack-heading"
          >
            <div className="px-5 sm:px-10">
              <p className="stamp">Stack</p>
              <h2 id="stack-heading" className="mt-5 max-w-[16ch] text-d1 text-ink">
                {t('toolsTitle')}
              </h2>
            </div>

            <div className="mt-10" aria-hidden="true">
              <Ribbon items={tapeItems} label={tl('stackRail')} duration="58s" />
              <div className="mt-3">
                <Ribbon
                  items={tapeItemsBack}
                  label={tl('stackRail')}
                  duration="74s"
                  reverse
                />
              </div>
            </div>

            <dl className="reveal-stagger mt-12 px-5 sm:px-10">
              {stack.map((group) => (
                <div
                  key={group.label}
                  className="band grid gap-x-8 gap-y-2 sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)]"
                >
                  <dt className="stamp">{group.label}</dt>
                  <dd className="m-0 min-w-0 font-mono text-sm text-ink-muted">
                    {group.items.join(' · ')}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {/* ═══ ÍNDICE DEL SERVICIO ═════════════════════════════
              <details> nativo: sin JS, y las respuestas están en el HTML del
              servidor, que es el mismo texto que emite el FAQPage de arriba.
              El `name` compartido da el acordeón exclusivo sin una línea de
              JavaScript. */}
          <section className="border-t border-hairline px-5 py-20 sm:px-10">
            <p className="stamp">FAQ</p>
            <h2 className="mt-5 max-w-[16ch] text-d1 text-ink">
              {t('faqTitle')}
            </h2>
            <p className="mt-6 max-w-[52ch] text-ink-muted">
              {en
                ? 'The questions this service gets before the first call.'
                : 'Lo que me preguntan de este servicio antes de la primera llamada.'}
            </p>

            <div className="mt-10">
              {service.faq.map((item) => (
                <details
                  key={item.question}
                  name="faq-automatizacion-ia"
                  className="band group"
                >
                  <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 text-ink marker:hidden">
                    <span>{item.question}</span>
                    <span
                      aria-hidden="true"
                      className="stamp shrink-0 transition-transform duration-150 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 max-w-[62ch] text-ink-muted">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>

          {/* ═══ CANALES VECINOS ═════════════════════════════════
              Los otros dos canales del mismo registrador, con la letra que
              les toca en la home. Al pasar el puntero no se enciende una
              caja: avanza el trazo. */}
          <section className="border-t border-hairline px-5 py-20 sm:px-10">
            <p className="stamp">{en ? 'keep reading' : 'sigue leyendo'}</p>
            <h2 className="mt-5 max-w-[16ch] text-d1 text-ink">
              {t('relatedTitle')}
            </h2>

            <ul className="mt-12">
              {related.map((item) => (
                <li key={item.id}>
                  <Link
                    href={servicePath(item, locale) as StaticPathname}
                    className="channel group border-hairline"
                  >
                    <span className="channel-id">ch {channelId(item.id)}</span>
                    <span className="min-w-0">
                      <span className="block text-d3 text-ink">
                        {item.title}
                      </span>
                      <span className="channel-note mt-1 block max-w-[52ch] text-sm text-ink-muted">
                        {item.headline}
                      </span>
                      <span className="channel-pen mt-3" aria-hidden="true" />
                    </span>
                    <span className="stamp hidden shrink-0 sm:block">
                      {ts('viewService')}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <p className="mt-10 max-w-[62ch] text-ink-muted">
              {en
                ? 'Not sure which one you need? '
                : '¿No sabes cuál necesitas? '}
              <Link className="link-stylus" href="/servicios">
                {en
                  ? 'compare all four services'
                  : 'compara los cuatro servicios'}
              </Link>
              {en
                ? ', or describe the process on the '
                : ', o descríbeme el proceso en la '}
              <Link className="link-stylus" href="/contacto">
                {en ? 'contact page' : 'página de contacto'}
              </Link>
              .
            </p>
          </section>

          {/* ═══ CIERRE ══════════════════════════════════════════ */}
          <section className="border-t border-hairline px-5 py-24 sm:px-10">
            <h2 className="max-w-[16ch] text-d1 text-ink">{t('ctaMain')}</h2>
            <p className="mt-6 max-w-[56ch] text-lead text-ink-muted">
              {en
                ? 'Tell me who runs the process today, how often it runs, and what happens when it goes wrong. I reply within 24 to 48 business hours with whether it is worth automating and what the first step would be.'
                : 'Cuéntame quién ejecuta el proceso hoy, cada cuánto corre y qué pasa cuando sale mal. Respondo en 24 a 48 horas hábiles con si conviene automatizarlo y cuál sería el primer paso.'}
            </p>

            <p className="mt-10 flex flex-wrap items-baseline gap-x-8 gap-y-3">
              <Link className="link-stylus text-d3" href="/contacto">
                {t('ctaSecondary')} →
              </Link>
              <a className="link-stylus font-mono text-sm" href={`mailto:${NAP.email}`}>
                {NAP.email}
              </a>
            </p>

            {/* Frase completa, así que no lleva `.stamp`: versalitas con
                0.16em de tracking se leen bien en una etiqueta de tres
                palabras y mal en una oración. Mismo token de tamaño, sin la
                caja de mayúsculas. */}
            <p className="mt-8 max-w-[56ch] font-mono text-grad leading-relaxed text-ink-subtle">
              {t('ctaNote')}
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
