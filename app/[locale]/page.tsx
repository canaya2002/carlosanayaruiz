import { Metadata } from 'next'
import Image from 'next/image'
import { setRequestLocale } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowRight, Github, Linkedin, Mail, CheckCircle, Search, Code2, BarChart3, Zap } from 'lucide-react'
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

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({
    title: locale === 'en'
      ? 'Services – Technical SEO, Next.js & Growth'
      : 'Servicios – SEO Técnico, Next.js y Growth',
    description: locale === 'en'
      ? 'Carlos Anaya Ruíz — Technical SEO consulting, Next.js & Firebase web apps, AI automation & chatbots, responsive dashboards. 4+ years, PMP certified. Hire me.'
      : 'Carlos Anaya Ruíz — Consultoría SEO técnico, aplicaciones web Next.js y Firebase, automatización con IA y chatbots, dashboards responsivos. +4 años, certificado PMP. Contrátame.',
    path: '',
    locale: locale as Locale,
  })
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <HomeContent locale={locale as Locale} />
}

function HomeContent({ locale }: { locale: Locale }) {
  const t = useTranslations('hero')
  const ts = useTranslations('services')
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
      {/* JSON-LD: Services + FAQ + WebPage */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify(generateServicesPageGraph(locale)),
      }} />

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
                  Carlos Anaya Ruíz
                </h1>
                <p className="mt-1 text-lg font-medium text-primary">{t('tagline')}</p>
              </div>
            </div>

            {/* Value prop */}
            <p className="mb-8 max-w-2xl text-xl leading-relaxed text-muted-foreground md:text-2xl">
              {t('subtitle')}
            </p>

            {/* CTAs */}
            <div className="mb-10 flex flex-wrap gap-4">
              <Button asChild size="lg" className="gap-2 text-base">
                <a href="#servicios">
                  {t('ctaServices')}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" asChild size="lg" className="gap-2 text-base">
                <Link href="/libros">{t('ctaBooks')}</Link>
              </Button>
              <Button variant="ghost" asChild size="lg" className="text-base">
                <Link href="/contacto">{t('ctaContact')}</Link>
              </Button>
            </div>

            {/* Social */}
            <div className="flex gap-4">
              <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-primary" aria-label="Carlos Anaya Ruíz en LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href={SOCIAL_LINKS.github1} target="_blank" rel="noopener noreferrer" className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-primary" aria-label="Carlos Anaya Ruíz en GitHub">
                <Github className="h-5 w-5" />
              </a>
              <a href={`mailto:${SOCIAL_LINKS.email}`} className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-primary" aria-label="Enviar email a Carlos Anaya Ruíz">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────── */}
      <section id="servicios" className="bg-muted/30 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{ts('title')}</h2>
            <p className="mt-2 text-lg text-muted-foreground">{ts('subtitle')}</p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <Card key={service.id} className="group flex flex-col transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                      <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{service.headline}</p>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col">
                    <p className="mb-6 text-sm text-muted-foreground">{service.description}</p>

                    <div className="mb-6">
                      <p className="mb-2 text-sm font-semibold">{ts('benefits')}</p>
                      <ul className="space-y-2">
                        {service.benefits.map((b, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <details className="mb-6">
                      <summary className="cursor-pointer text-sm font-semibold text-primary hover:underline">
                        {ts('includes')}
                      </summary>
                      <ul className="mt-3 space-y-1.5">
                        {service.includes.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </details>

                    <div className="mt-auto flex flex-col gap-2">
                      <Button asChild className="w-full">
                        <Link href="/contacto">{ts('cta')}</Link>
                      </Button>
                      <Button variant="outline" asChild className="w-full">
                        <a href={SOCIAL_LINKS.fiverr} target="_blank" rel="noopener noreferrer">
                          {ts('ctaFiverr')}
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* FAQ */}
          <div className="mx-auto mt-16 max-w-4xl">
            <h3 className="mb-8 text-center text-2xl font-bold">{ts('faq')}</h3>
            <div className="space-y-4">
              {services.flatMap((service) =>
                service.faq.map((faq, i) => (
                  <details key={`${service.id}-${i}`} className="rounded-lg border bg-card p-4">
                    <summary className="cursor-pointer font-medium">{faq.question}</summary>
                    <p className="mt-3 text-sm text-muted-foreground">{faq.answer}</p>
                  </details>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESS ──────────────────────────────────────── */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{ts('process')}</h2>
            <p className="mt-2 text-lg text-muted-foreground">{ts('processSubtitle')}</p>
          </div>
          <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, idx) => {
              const StepIcon = step.icon
              return (
                <div key={idx} className="text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <StepIcon className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <div className="mb-1 text-sm font-medium text-primary">0{idx + 1}</div>
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
                <CardHeader><CardTitle className="text-lg">{cat.label}</CardTitle></CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ───────────────────────────────────── */}
      <Newsletter />
    </>
  )
}
