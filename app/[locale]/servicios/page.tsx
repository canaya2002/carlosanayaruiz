import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { StaticPathname } from '@/i18n/routing'
import { ArrowRight, ArrowUpRight, Check, Sparkles } from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Button } from '@/components/ui/button'
import { getServices, servicePath, type ServiceId } from '@/data/services'
import { NAP } from '@/lib/constants'
import { generatePageMetadata } from '@/lib/seo'
import { generateServicesHubGraph } from '@/lib/schema'
import type { Locale, Localized } from '@/data/types'

interface Props {
  params: Promise<{ locale: string }>
}

/**
 * El síntoma que debería mandar a alguien a cada servicio.
 *
 * Va indexado por el `ServiceId` estable y no por posición del arreglo, así
 * este copy no puede terminar pegado al servicio equivocado si algún día se
 * reordena `data/services.ts`. Estos strings no tienen clave en
 * `messages/*.json`, así que van en línea por idioma — lo mismo que hace la
 * home con el copy de una sola aparición.
 */
const SYMPTOM: Record<ServiceId, Localized<string>> = {
  'seo-tecnico': {
    es: 'El sitio ya existe, tiene contenido y aun así no aparece donde debería.',
    en: 'The site already exists and has content, and still does not show up where it should.',
  },
  'nextjs-firebase': {
    es: 'Hay que construir o migrar el sitio, y no puede perder posiciones al hacerlo.',
    en: 'The site has to be built or migrated, and it cannot lose positions doing it.',
  },
  'ai-automation': {
    es: 'Tu equipo contesta o captura lo mismo todos los días, a mano.',
    en: 'Your team answers or types the same things every day, by hand.',
  },
  dashboards: {
    es: 'Los datos ya existen, pero nadie los mira porque viven en siete reportes distintos.',
    en: 'The data already exists, but nobody looks at it because it lives in seven separate reports.',
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const en = locale === 'en'

  return generatePageMetadata({
    locale: locale as Locale,
    route: 'services',
    title: en
      ? 'Technical SEO, Web & AI Services'
      : 'Servicios de SEO técnico, web e IA',
    description: en
      ? 'Four services: technical SEO consulting, Next.js and Firebase development, AI automation and dashboards. What each changes, and who it is for.'
      : 'Cuatro servicios: consultoría SEO técnica, desarrollo con Next.js y Firebase, automatización con IA y dashboards. Qué cambia cada uno y para quién es.',
  })
}

export default async function ServicesHubPage({ params }: Props) {
  const { locale: rawLocale } = await params
  setRequestLocale(rawLocale)

  const locale = rawLocale as Locale
  const en = locale === 'en'

  const t = await getTranslations('hero')
  const ts = await getTranslations('services')
  const th = await getTranslations('servicesHub')

  const services = getServices(locale)

  // Subetiquetas dentro de cada tarjeta de servicio. Se renderizan como <dt> y
  // no como encabezados, así cuatro etiquetas repetidas no agregan doce
  // entradas al outline del documento.
  const labels = {
    outcomes: en ? 'What changes for you' : 'Qué cambia para ti',
    forWhom: en ? 'Who it is for' : 'Para quién es',
    notFor: en ? 'When I am not the right fit' : 'Cuándo no soy la opción correcta',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateServicesHubGraph(locale)),
        }}
      />

      {/* ══ ENCABEZADO ════════════════════════════════════════════
          Primera banda de página interior: ritmo corto (py-14 sm:py-16) y las
          dos capas decorativas de la home — la malla animada y la cuadrícula
          que se desvanece. Las dos viven en -z-10 y ninguna captura eventos,
          así que `isolate` es lo que las mantiene detrás de este contenido y
          no del resto de la página.                                    */}
      <section className="relative isolate overflow-hidden">
        <div className="mesh" aria-hidden="true" />
        <div className="grid-fade" aria-hidden="true" />

        <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
          {/* Refleja exactamente el BreadcrumbList de generateServicesHubGraph:
              Inicio (lo renderiza el componente) → Servicios (página actual). */}
          <Breadcrumbs items={[{ label: th('title') }]} />

          <div className="mt-10 max-w-3xl">
            <p className="eyebrow enter-scale">
              <Sparkles className="size-3.5" aria-hidden="true" />
              {t('eyebrow')}
            </p>

            {/* El título es una sola palabra, así que el gradiente cae sobre
                todo el h1. `.grad-text` se detiene en azul cielo oscuro
                (5.7:1), nunca toca el stop cian —que mide 1.76:1—, y conserva
                `color` como respaldo real. */}
            <h1 className="enter-blur step-1 mt-6 text-d1 text-ink">
              <span className="grad-text">{th('title')}</span>
            </h1>

            <p className="enter step-2 mt-6 text-lead text-ink-muted">
              {th('subtitle')}
            </p>

            <p className="enter step-3 mt-6 max-w-[68ch] text-ink-muted">
              {th('lead')}
            </p>

            <div className="enter step-4 mt-9 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="sheen shadow-glow-brand">
                <Link href="/contacto">
                  {t('ctaPrimary')}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/sobre-mi">{t('ctaTertiary')}</Link>
              </Button>
            </div>

            <p className="enter step-5 mt-6 flex items-center gap-2.5 text-sm text-ink-subtle">
              <span className="ping" aria-hidden="true" />
              {t('locationNote')}
            </p>
          </div>
        </div>
      </section>

      {/* ══ CUÁL DE LOS CUATRO NECESITO ═══════════════════════════ */}
      <section className="border-y border-hairline bg-ground-tint">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">{en ? 'Where to start' : 'Por dónde empezar'}</p>
            <h2 className="mt-5 text-d1 text-ink">
              {en
                ? 'Which of the four do you need?'
                : '¿Cuál de los cuatro necesitas?'}
            </h2>
            <p className="mt-4 text-lead text-ink-muted">{th('chooseHelp')}</p>
          </div>

          {/* Síntoma → servicio. Un hub se gana su URL enrutando gente, así que
              esto va antes del detalle y no después. Va como un solo panel
              elevado con filas divididas: cuatro tarjetas aquí competirían con
              las cuatro tarjetas reales de la sección siguiente. */}
          <dl className="glass glass-spec reveal mt-12">
            {services.map((service) => (
              <div
                key={service.id}
                className="group relative grid gap-2 border-b border-hairline px-5 py-5 transition-colors last:border-b-0 hover:bg-brand-wash sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline sm:gap-8 sm:px-7"
              >
                <dt className="text-ink">{SYMPTOM[service.id][locale]}</dt>
                <dd>
                  {/* El pseudo-elemento estira el área de clic a toda la fila
                      (bastante más de 44 px de alto) sin anidar un enlace
                      alrededor del <dt>. El nombre accesible sigue siendo solo
                      el título del servicio. */}
                  <Link
                    href={servicePath(service, locale) as StaticPathname}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-strong before:absolute before:inset-0"
                  >
                    {service.title}
                    <ArrowUpRight
                      className="size-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </dd>
              </div>
            ))}
          </dl>

          <p className="reveal mt-8 max-w-[68ch] text-sm text-ink-muted">
            {en
              ? 'Most engagements start with one of the four, not with all of them. And sometimes the answer is none of them: if what you are missing is content or domain authority, technical work will not fix it, and I will say so on the first call instead of selling you an audit.'
              : 'La mayoría de los proyectos empiezan con uno de los cuatro, no con todos. Y a veces la respuesta es ninguno: si lo que te falta es contenido o autoridad de dominio, el trabajo técnico no lo va a resolver, y te lo digo en la primera llamada en lugar de venderte una auditoría.'}
          </p>
        </div>
      </section>

      {/* ══ LOS CUATRO SERVICIOS ══════════════════════════════════ */}
      <section className="defer-paint mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="reveal max-w-2xl">
          <p className="eyebrow">
            {en ? 'What each one covers' : 'Qué incluye cada uno'}
          </p>
          <h2 className="mt-5 text-d1 text-ink">{ts('title')}</h2>
          <p className="mt-4 text-lead text-ink-muted">{ts('subtitle')}</p>
        </div>

        {/* Cada tarjeta lleva el servicio completo — resultados, encaje y
            límites — para que esta página se sostenga sola en lugar de ser una
            lista de enlaces. `.reveal-stagger` escalona las cuatro al entrar en
            pantalla, con CSS puro y sin esconder nada de un crawler. */}
        <ol className="reveal-stagger mt-14 grid gap-6">
          {services.map((service, index) => {
            const Icon = service.icon
            const href = servicePath(service, locale) as StaticPathname

            return (
              <li
                key={service.id}
                id={service.id}
                className="card card-hover p-6 sm:p-8"
              >
                <div className="grid gap-8 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:gap-14">
                  <div>
                    <div className="flex items-center gap-4">
                      <span
                        className="grad-deco inline-flex size-12 items-center justify-center rounded-xl text-white shadow-glow-brand"
                        aria-hidden="true"
                      >
                        <Icon className="size-6" />
                      </span>
                      <span
                        data-numeric=""
                        className="grad-text font-display text-4xl font-bold leading-none"
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <h3 className="mt-5 text-d3 text-ink">
                      <Link
                        href={href}
                        className="group inline-flex items-start gap-2 transition-colors hover:text-brand-strong"
                      >
                        {service.title}
                        <ArrowUpRight
                          className="mt-1.5 size-5 shrink-0 text-ink-subtle transition-[transform,color] duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-brand-strong"
                          aria-hidden="true"
                        />
                      </Link>
                    </h3>

                    <p className="mt-3 text-ink-muted">{service.headline}</p>

                    {/* La etiqueta visible es idéntica en las cuatro tarjetas,
                        así que el nombre accesible carga además el título del
                        servicio. Sigue conteniendo el texto visible (WCAG
                        2.5.3). */}
                    <Button asChild variant="outline" className="mt-7">
                      <Link
                        href={href}
                        aria-label={`${ts('viewService')}: ${service.title}`}
                      >
                        {ts('viewService')}
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  </div>

                  <dl className="grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-bold tracking-wide text-ink">
                        {labels.outcomes}
                      </dt>
                      <dd className="mt-4">
                        <ul className="grid gap-2.5 sm:grid-cols-2 sm:gap-x-10">
                          {service.outcomes.map((outcome) => (
                            <li
                              key={outcome}
                              className="flex gap-2.5 text-sm text-ink-muted"
                            >
                              <Check
                                className="mt-0.5 size-4 shrink-0 text-sky-ink"
                                aria-hidden="true"
                              />
                              <span>{outcome}</span>
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </div>

                    {/* Encaje y límites reciben el mismo panel, el mismo peso de
                        etiqueta y la misma viñeta. Los límites declarados son la
                        señal de confianza de esta página: mandarlos a letra
                        chica o suavizarlos en línea de venta anula el motivo por
                        el que están escritos. */}
                    <div className="rounded-xl border border-hairline bg-surface-alt p-5">
                      <dt className="text-sm font-bold tracking-wide text-ink">
                        {labels.forWhom}
                      </dt>
                      <dd className="mt-3">
                        <ul className="space-y-2.5">
                          {service.forWhom.map((item) => (
                            <li
                              key={item}
                              className="flex gap-2.5 text-sm text-ink-muted"
                            >
                              <span
                                className="grad-deco mt-2 size-1.5 shrink-0 rounded-full"
                                aria-hidden="true"
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </div>

                    <div className="rounded-xl border border-hairline bg-surface-alt p-5">
                      <dt className="text-sm font-bold tracking-wide text-ink">
                        {labels.notFor}
                      </dt>
                      <dd className="mt-3">
                        <ul className="space-y-2.5">
                          {service.notFor.map((item) => (
                            <li
                              key={item}
                              className="flex gap-2.5 text-sm text-ink-muted"
                            >
                              <span
                                className="grad-deco mt-2 size-1.5 shrink-0 rounded-full"
                                aria-hidden="true"
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  </dl>
                </div>
              </li>
            )
          })}
        </ol>
      </section>

      {/* ══ CTA ═══════════════════════════════════════════════════
          El mismo bloque de gradiente que cierra la home: encima el texto va
          blanco y el botón se invierte a superficie con texto de marca — un
          relleno de marca sobre el gradiente desaparecería.            */}
      <section className="defer-paint mx-auto w-full max-w-6xl px-5 pb-20 sm:px-8 sm:pb-24">
        <div className="grad-drift reveal-scale rounded-3xl px-6 py-14 shadow-lift-3 sm:px-12 sm:py-20">
          <div className="relative max-w-2xl">
            <h2 className="text-d1 text-white">
              {en
                ? 'Not sure which one applies? Describe the problem.'
                : '¿No sabes cuál aplica? Descríbeme el problema.'}
            </h2>
            <p className="mt-5 text-lead text-white/85">
              {en
                ? 'Send the URL, what changed, and since when. I reply within 24 to 48 business hours with a first read on which of the four — if any — is worth starting with.'
                : 'Mándame la URL, qué cambió y desde cuándo. Respondo en 24 a 48 horas hábiles con una primera lectura de con cuál de los cuatro conviene empezar, si con alguno.'}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Button
                asChild
                size="lg"
                className="sheen bg-surface text-brand-strong hover:bg-white"
              >
                <Link href="/contacto">
                  {t('ctaPrimary')}
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
          </div>
        </div>
      </section>
    </>
  )
}
