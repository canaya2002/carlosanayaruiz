import { Metadata } from 'next'
import Image from 'next/image'
import { setRequestLocale } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import {
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  CheckCircle,
  Search,
  Code2,
  BarChart3,
  Zap,
  Globe,
  Bot,
  Shield,
  Award,
  Briefcase,
  GraduationCap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Newsletter } from '@/components/sections/newsletter'
import { getPersonalInfo } from '@/data/personal'
import { getServices } from '@/data/services'
import { getSkillCategories } from '@/data/skills'
import { SOCIAL_LINKS, SEO_IMAGES } from '@/lib/constants'
import { generatePageMetadata } from '@/lib/seo'
import { generateServicesPageGraph } from '@/lib/schema'
import { Locale } from '@/data/types'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({
    title:
      locale === 'en'
        ? 'Carlos Anaya Ruiz — Technical SEO Consultant & Full-Stack Developer in Mexico'
        : 'Carlos Anaya Ruiz — Consultor SEO Técnico & Desarrollador Full-Stack en México',
    description:
      locale === 'en'
        ? 'Carlos Anaya Ruiz — Technical SEO consultant & full-stack engineer in Mexico. Web development with Next.js & Firebase, AI automation, enterprise dashboards. 4+ years experience, PMP certified. Amazon, Tec de Monterrey.'
        : 'Carlos Anaya Ruiz — Consultor SEO técnico e ingeniero full-stack en México. Desarrollo web con Next.js y Firebase, automatización con IA, dashboards empresariales. +4 años de experiencia, certificado PMP. Amazon, Tec de Monterrey.',
    path: '',
    locale: locale as Locale,
    absoluteTitle: true,
  })
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <HomeContent locale={locale as Locale} />
}

/** Service page links mapped by service id */
const SERVICE_LINKS = {
  'seo-tecnico': '/seo-tecnico',
  'nextjs-firebase': '/desarrollo-web',
  'ai-automation': '/automatizacion-ia',
  dashboards: '/dashboards',
} as const

function HomeContent({ locale }: { locale: Locale }) {
  const t = useTranslations('hero')
  const ts = useTranslations('services')
  const tt = useTranslations('trust')
  const personal = getPersonalInfo(locale)
  const services = getServices(locale)
  const skillCategories = getSkillCategories(locale)

  const processSteps = [
    { icon: Search, title: ts('step1Title'), desc: ts('step1Desc') },
    { icon: Code2, title: ts('step2Title'), desc: ts('step2Desc') },
    { icon: Zap, title: ts('step3Title'), desc: ts('step3Desc') },
    { icon: BarChart3, title: ts('step4Title'), desc: ts('step4Desc') },
  ]

  return (
    <>
      {/* JSON-LD: WebPage + Services + FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateServicesPageGraph(locale)),
        }}
      />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-16 md:py-24 lg:py-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/5 blur-[100px]" />
        </div>

        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            {/* Avatar + Name */}
            <div className="mb-8 flex items-center gap-5">
              <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-primary/20 bg-muted shadow-lg md:h-24 md:w-24">
                <Image
                  src={SEO_IMAGES.avatar}
                  alt={SEO_IMAGES.avatarAlt[locale]}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 80px, 96px"
                  priority
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                  Carlos Anaya Ruiz
                </h1>
                <p className="mt-1 text-lg font-medium text-primary" role="doc-subtitle">
                  {t('tagline')}
                </p>
              </div>
            </div>

            {/* Value prop */}
            <p className="mb-4 max-w-2xl text-xl leading-relaxed text-muted-foreground md:text-2xl">
              {t('subtitle')}
            </p>

            {/* Secondary descriptor for search engines and skimmers */}
            <p className="mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground">
              {locale === 'en'
                ? 'Based in Mexico City. I work with startups, agencies, and established companies across Latin America and the US. From one-off technical audits to ongoing development partnerships.'
                : 'Basado en Ciudad de México. Trabajo con startups, agencias y empresas establecidas en Latinoamérica y Estados Unidos. Desde auditorías técnicas puntuales hasta alianzas de desarrollo continuo.'}
            </p>

            {/* Trust bar */}
            <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 text-primary" />
                {tt('yearsExp')}
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="h-4 w-4 text-primary" />
                {tt('pmpCert')}
              </span>
              <span className="flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4 text-primary" />
                {tt('tecMty')}
              </span>
            </div>
            <p className="mb-8 text-sm text-muted-foreground">{tt('companies')}</p>

            {/* CTAs */}
            <div className="mb-10 flex flex-wrap gap-4">
              <Button asChild size="lg" className="gap-2 text-base">
                <a href="#servicios">
                  {t('ctaServices')}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button
                variant="outline"
                asChild
                size="lg"
                className="gap-2 text-base"
              >
                <Link href="/contacto">{t('ctaContact')}</Link>
              </Button>
              <Button variant="ghost" asChild size="lg" className="text-base">
                <Link href="/sobre-mi">{t('ctaAbout')}</Link>
              </Button>
            </div>

            {/* Social — rel="me" for entity verification */}
            <div className="flex gap-4">
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="me noopener noreferrer"
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
                aria-label="Carlos Anaya Ruiz en LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href={SOCIAL_LINKS.github1}
                target="_blank"
                rel="me noopener noreferrer"
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
                aria-label="Carlos Anaya Ruiz en GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href={`mailto:${SOCIAL_LINKS.email}`}
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
                aria-label="Enviar email a Carlos Anaya Ruiz"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES OVERVIEW ────────────────────────────── */}
      <section id="servicios" className="bg-muted/30 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              {ts('title')}
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              {ts('subtitle')}
            </p>
          </div>

          {/* SEO Técnico — featured card (first service) */}
          {services.length > 0 && (() => {
            const seoService = services[0]
            const SeoIcon = seoService.icon
            return (
              <div className="mx-auto mb-8 max-w-6xl">
                <Card className="group border-primary/20 transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                      <SeoIcon className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-xl">{seoService.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {seoService.headline}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ul className="mb-6 space-y-2">
                      {seoService.benefits.map((b, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-3">
                      <Button asChild className="gap-2">
                        <Link href="/seo-tecnico">
                          {ts('viewAll')}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href="/contacto">{ts('cta')}</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          })()}

          {/* Other 3 services in grid */}
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
            {services.slice(1).map((service) => {
              const Icon = service.icon
              const serviceLink =
                SERVICE_LINKS[service.id as keyof typeof SERVICE_LINKS]
              return (
                <Card
                  key={service.id}
                  className="group flex flex-col transition-shadow hover:shadow-lg"
                >
                  <CardHeader>
                    <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                      <Icon
                        className="h-6 w-6 text-primary"
                        aria-hidden="true"
                      />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {service.headline}
                    </p>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col">
                    <div className="mb-6">
                      <ul className="space-y-2">
                        {service.benefits.map((b, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <CheckCircle
                              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                              aria-hidden="true"
                            />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-auto flex flex-col gap-2">
                      {serviceLink && (
                        <Button asChild className="w-full gap-2">
                          <Link href={serviceLink}>
                            {ts('viewAll')}
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      <Button variant="outline" asChild className="w-full">
                        <Link href="/contacto">{ts('cta')}</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── PROCESS ──────────────────────────────────────── */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              {ts('process')}
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              {ts('processSubtitle')}
            </p>
          </div>
          <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, idx) => {
              const StepIcon = step.icon
              return (
                <div key={idx} className="text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <StepIcon
                      className="h-6 w-6 text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mb-1 text-sm font-medium text-primary">
                    0{idx + 1}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <Separator />

      {/* ── STACK ────────────────────────────────────────── */}
      <section className="bg-muted/30 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              {locale === 'en' ? 'Stack & Specialties' : 'Stack & Especialidades'}
            </h2>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {skillCategories.map((cat) => (
              <Card key={cat.category}>
                <CardHeader>
                  <CardTitle className="text-lg">{cat.label}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-2xl font-bold">{ts('faq')}</h2>
            <div className="space-y-4">
              {services.flatMap((service) =>
                service.faq.map((faq, i) => (
                  <details
                    key={`${service.id}-${i}`}
                    className="rounded-lg border bg-card p-4"
                  >
                    <summary className="cursor-pointer font-medium">
                      {faq.question}
                    </summary>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {faq.answer}
                    </p>
                  </details>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHO I WORK WITH ─────────────────────────────── */}
      <section className="bg-muted/30 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-4 text-center text-3xl font-bold tracking-tight md:text-4xl">
              {locale === 'en' ? 'Who I Work With' : 'Con Quién Trabajo'}
            </h2>
            <p className="mb-10 text-center text-lg text-muted-foreground">
              {locale === 'en'
                ? 'I partner with companies and founders who take their web presence seriously.'
                : 'Trabajo con empresas y fundadores que toman en serio su presencia web.'}
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Globe,
                  title: locale === 'en' ? 'Startups & SaaS' : 'Startups y SaaS',
                  desc: locale === 'en'
                    ? 'Technical SEO and performance optimization from day one. Get indexed and rank before your competitors.'
                    : 'SEO técnico y optimización de rendimiento desde el día uno. Indexa y posiciona antes que tu competencia.',
                },
                {
                  icon: Briefcase,
                  title: locale === 'en' ? 'Agencies & Consultancies' : 'Agencias y Consultoras',
                  desc: locale === 'en'
                    ? 'White-label technical SEO and Next.js development for agencies that need engineering depth.'
                    : 'SEO técnico y desarrollo Next.js white-label para agencias que necesitan profundidad de ingeniería.',
                },
                {
                  icon: Shield,
                  title: locale === 'en' ? 'Established Companies' : 'Empresas Establecidas',
                  desc: locale === 'en'
                    ? 'Site migrations, Core Web Vitals fixes, AI automation, and custom dashboards for operations teams.'
                    : 'Migraciones de sitio, corrección de Core Web Vitals, automatización IA y dashboards para equipos de operaciones.',
                },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <Card key={item.title}>
                    <CardContent className="p-6">
                      <Icon className="mb-3 h-6 w-6 text-primary" aria-hidden="true" />
                      <h3 className="mb-2 font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────── */}
      <section className="bg-muted/30 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl rounded-lg border bg-card p-8 text-center">
            <h2 className="mb-2 text-xl font-semibold">
              {locale === 'en'
                ? 'Ready to work together?'
                : '¿Listo para trabajar juntos?'}
            </h2>
            <p className="mb-6 text-muted-foreground">
              {locale === 'en'
                ? 'Tell me about your project. I respond within 24-48 hours.'
                : 'Cuéntame sobre tu proyecto. Respondo en 24-48 horas.'}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/contacto">
                  {locale === 'en' ? 'Contact Me' : 'Contáctame'}
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <a
                  href={SOCIAL_LINKS.fiverr}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >
                  {locale === 'en' ? 'Hire on Fiverr' : 'Contratar en Fiverr'}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ───────────────────────────────────── */}
      <Newsletter />
    </>
  )
}
