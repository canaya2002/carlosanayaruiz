import type { Metadata } from 'next'
import Image from 'next/image'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ArrowRight, ArrowUpRight, Check, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Disclosure } from '@/components/ui/disclosure'
import { Counter } from '@/components/motion/counter'
import { PointerGlow } from '@/components/motion/pointer-glow'
import { getServices, servicePath } from '@/data/services'
import { getSiteFaq } from '@/data/faq'
import { getSkillCategories } from '@/data/skills'
import { SEO_IMAGES, NAP, SOCIAL_LINKS } from '@/lib/constants'
import { generatePageMetadata } from '@/lib/seo'
import { generateHomeGraph } from '@/lib/schema'
import { Locale } from '@/data/types'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const en = locale === 'en'

  return generatePageMetadata({
    locale: locale as Locale,
    route: 'home',
    absoluteTitle: true,
    title: en
      ? 'Carlos Anaya Ruiz — Technical SEO Consultant'
      : 'Carlos Anaya Ruiz — Consultor SEO Técnico en CDMX',
    description: en
      ? 'Technical SEO consultant and full-stack engineer in Mexico City. Audits, structured data, Core Web Vitals and Next.js migrations that hold rankings.'
      : 'Consultor SEO técnico e ingeniero full-stack en Ciudad de México. Auditorías, datos estructurados, Core Web Vitals y migraciones a Next.js.',
  })
}

export default async function HomePage({ params }: Props) {
  const { locale: rawLocale } = await params
  setRequestLocale(rawLocale)

  const locale = rawLocale as Locale
  const en = locale === 'en'

  const t = await getTranslations('hero')
  const tt = await getTranslations('trust')
  const ts = await getTranslations('services')
  const ta = await getTranslations('audience')

  const services = getServices(locale)
  const faqs = getSiteFaq(locale)
  const skillCategories = getSkillCategories(locale)

  const processSteps = [
    { title: ts('step1Title'), desc: ts('step1Desc') },
    { title: ts('step2Title'), desc: ts('step2Desc') },
    { title: ts('step3Title'), desc: ts('step3Desc') },
    { title: ts('step4Title'), desc: ts('step4Desc') },
  ]

  const audiences = [
    { title: ta('startups.title'), desc: ta('startups.desc') },
    { title: ta('agencies.title'), desc: ta('agencies.desc') },
    { title: ta('established.title'), desc: ta('established.desc') },
  ]

  const metrics = [
    {
      value: 4,
      suffix: '+',
      label: en ? 'Years of experience' : 'Años de experiencia',
      hint: tt('engineerLabel'),
    },
    {
      text: 'PMP',
      label: en ? 'Certified' : 'Certificado',
      hint: 'Project Management Institute',
    },
    { value: 92, label: 'TOEFL iBT', hint: en ? 'English C1' : 'Inglés C1' },
    {
      text: 'CDMX',
      label: en ? 'Mexico City' : 'Ciudad de México',
      hint: en ? 'Remote worldwide' : 'Remoto a todo el mundo',
    },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateHomeGraph(locale, faqs)),
        }}
      />

      {/* ══ HERO ══════════════════════════════════════════════════
          Tres capas de fondo, todas decorativas, todas en -z-10 y
          ninguna captura eventos: la malla animada, el resplandor que
          sigue al puntero y la cuadrícula que se desvanece.          */}
      <section className="relative isolate overflow-hidden">
        <div className="mesh" aria-hidden="true" />
        <PointerGlow />
        <div className="grid-fade" aria-hidden="true" />

        <div className="mx-auto w-full max-w-6xl px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-24 lg:pb-28 lg:pt-28">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-14">
            <div className="max-w-3xl">
              <p className="eyebrow enter-scale">
                <Sparkles className="size-3.5" aria-hidden="true" />
                {t('eyebrow')}
              </p>

              {/* El gradiente cae solo sobre la segunda mitad, la que
                  diferencia. Un h1 completo recortado pierde legibilidad. */}
              <h1 className="enter-blur step-1 mt-6 text-hero text-ink">
                {t('headline')}{' '}
                <span className="grad-text">{t('headlineAccent')}</span>
              </h1>

              <p className="enter step-2 mt-7 max-w-2xl text-lead text-ink-muted">
                {t('lead')}
              </p>

              <div className="enter step-3 mt-9 flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="sheen shadow-glow-brand">
                  <Link href="/contacto">
                    {t('ctaPrimary')}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/servicios">{t('ctaSecondary')}</Link>
                </Button>
              </div>

              <p className="enter step-4 mt-6 flex items-center gap-2.5 text-sm text-ink-subtle">
                <span className="ping" aria-hidden="true" />
                {t('locationNote')}
              </p>
            </div>

            {/* Retrato con anillo de gradiente. El anillo va detrás como capa
                absoluta, así que al animarse no desplaza nada (cero CLS). */}
            <div className="enter-scale step-2 order-first lg:order-none">
              <div className="relative mx-auto w-fit">
                <div
                  className="grad-animate absolute -inset-2 rounded-[2rem] opacity-90"
                  aria-hidden="true"
                />
                <div className="relative size-32 overflow-hidden rounded-3xl border-2 border-surface bg-ground-tint shadow-lift-3 sm:size-40 lg:size-52">
                  <Image
                    src={SEO_IMAGES.avatar}
                    alt={SEO_IMAGES.avatarAlt[locale]}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 208px, (min-width: 640px) 160px, 128px"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Credenciales verificables. Los números cuentan al entrar en
              pantalla, pero el valor final ya viene en el HTML del servidor. */}
          <dl className="enter step-5 mt-16 grid grid-cols-2 gap-4 sm:mt-20 sm:grid-cols-4">
            {metrics.map((m) => (
              <div key={m.label} className="card card-hover p-5">
                <dt className="sr-only">{m.label}</dt>
                <dd>
                  <span className="grad-text font-display text-3xl font-bold sm:text-4xl">
                    {m.value !== undefined ? (
                      <Counter value={m.value} suffix={m.suffix} />
                    ) : (
                      m.text
                    )}
                  </span>
                  <span className="mt-2 block text-sm font-semibold text-ink">
                    {m.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-ink-subtle">
                    {m.hint}
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          <p className="enter step-6 mt-8 text-sm text-ink-subtle">
            <span className="font-semibold text-ink-muted">
              {tt('companiesLabel')}:
            </span>{' '}
            {tt('companies')} · {tt('tecMty')}
          </p>
        </div>
      </section>

      {/* ══ SERVICIOS ═════════════════════════════════════════════ */}
      <section
        id="servicios"
        className="border-y border-hairline bg-ground-tint"
      >
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">{ts('eyebrow')}</p>
            <h2 className="mt-5 text-d1 text-ink">{ts('title')}</h2>
            <p className="mt-4 text-lead text-ink-muted">{ts('subtitle')}</p>
          </div>

          <div className="reveal-stagger mt-14 grid gap-6 md:grid-cols-2">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <Link
                  key={service.id}
                  href={servicePath(service, locale) as '/seo-tecnico'}
                  className="card card-hover group flex flex-col p-6 sm:p-7"
                >
                  <span
                    className="grad-fill inline-flex size-12 items-center justify-center rounded-xl shadow-glow-brand"
                    aria-hidden="true"
                  >
                    <Icon className="size-6" />
                  </span>

                  <h3 className="mt-5 text-d3 text-ink transition-colors group-hover:text-brand-strong">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm text-ink-muted">
                    {service.headline}
                  </p>

                  <ul className="mt-5 flex-1 space-y-2.5">
                    {service.outcomes.slice(0, 2).map((outcome) => (
                      <li
                        key={outcome}
                        className="flex gap-2.5 text-sm text-ink-muted"
                      >
                        <Check
                          className="mt-0.5 size-4 shrink-0 text-violet"
                          aria-hidden="true"
                        />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>

                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-strong">
                    {ts('viewService')}
                    <ArrowUpRight
                      className="size-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              )
            })}
          </div>

          <div className="reveal mt-10">
            <Button asChild variant="outline" size="lg">
              <Link href="/servicios">
                {ts('allServices')}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ══ PROCESO ═══════════════════════════════════════════════ */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="reveal max-w-2xl">
          <p className="eyebrow">{ts('process')}</p>
          <h2 className="mt-5 text-d1 text-ink">{ts('processSubtitle')}</h2>
        </div>

        <ol className="reveal-stagger mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, index) => (
            <li key={step.title}>
              <span
                className="grad-text font-display text-5xl font-bold leading-none"
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
      </section>

      {/* ══ CON QUIÉN TRABAJO ═════════════════════════════════════ */}
      <section className="border-y border-hairline bg-ground-tint">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">{ta('title')}</p>
            <h2 className="mt-5 text-d1 text-ink">{ta('subtitle')}</h2>
          </div>

          <div className="reveal-stagger mt-14 grid gap-6 md:grid-cols-3">
            {audiences.map((item) => (
              <div key={item.title} className="card card-hover p-6">
                <span
                  className="grad-fill block h-1 w-12 rounded-full"
                  aria-hidden="true"
                />
                <h3 className="mt-5 text-d3 text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ STACK ═════════════════════════════════════════════════ */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="reveal max-w-2xl">
          <p className="eyebrow">Stack</p>
          <h2 className="mt-5 text-d1 text-ink">
            {en ? 'What I build with' : 'Con qué construyo'}
          </h2>
        </div>

        <dl className="reveal-stagger mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((cat) => (
            <div key={cat.category} className="card p-5">
              <dt className="text-sm font-bold tracking-wide text-ink">
                {cat.label}
              </dt>
              <dd className="mt-3 flex flex-wrap gap-1.5">
                {cat.skills.map((skill) => (
                  <Badge key={skill} variant="neutral">
                    {skill}
                  </Badge>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ══ FAQ ═══════════════════════════════════════════════════ */}
      <section className="border-t border-hairline bg-ground-tint">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-20">
            <div className="reveal">
              <p className="eyebrow">{ts('faq')}</p>
              <h2 className="mt-5 text-d1 text-ink">{ts('faqSubtitle')}</h2>
            </div>

            {/* Solo preguntas sobre cómo se trabaja. Las técnicas viven en la
                página del servicio al que pertenecen, así ninguna consulta se
                responde desde dos URLs distintas. */}
            <div className="reveal rounded-2xl border border-hairline bg-surface px-5 shadow-lift-1 sm:px-7">
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

      {/* ══ CTA FINAL ═════════════════════════════════════════════ */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="grad-animate reveal-scale relative overflow-hidden rounded-3xl px-6 py-14 shadow-lift-3 sm:px-12 sm:py-20">
          <div className="relative max-w-2xl">
            <h2 className="text-d1 text-white">
              {en
                ? 'Tell me where the traffic is leaking.'
                : 'Cuéntame por dónde se está fugando el tráfico.'}
            </h2>
            <p className="mt-5 text-lead text-white/85">
              {en
                ? 'Describe the site and what changed. I reply within 24 to 48 business hours with a first read on what is likely going on.'
                : 'Descríbeme el sitio y qué cambió. Respondo en 24 a 48 horas hábiles con una primera lectura de lo que probablemente está pasando.'}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              {/* Sobre el gradiente el botón se invierte: superficie blanca con
                  texto de marca. Un relleno de marca aquí desaparecería. */}
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

            <p className="mt-7 text-sm text-white/75">
              {en ? 'Also on ' : 'También en '}
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="me noopener noreferrer"
                className="font-semibold text-white underline underline-offset-4"
              >
                LinkedIn
              </a>
              {en ? ' and ' : ' y '}
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="me noopener noreferrer"
                className="font-semibold text-white underline underline-offset-4"
              >
                GitHub
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
