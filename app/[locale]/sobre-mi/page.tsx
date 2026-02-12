import { Metadata } from 'next'
import Image from 'next/image'
import { setRequestLocale } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowRight, Github, Linkedin, Mail, ExternalLink } from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getPersonalInfo } from '@/data/personal'
import { getExperiences } from '@/data/experience'
import { getEducation } from '@/data/education'
import { getSkillCategories } from '@/data/skills'
import { getAwards } from '@/data/awards'
import { SOCIAL_LINKS, SEO_IMAGES } from '@/lib/constants'
import { generatePageMetadata } from '@/lib/seo'
import { generateAboutPageGraph } from '@/lib/schema'
import { formatShortDate } from '@/lib/utils'
import { Locale } from '@/data/types'

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({
    title: locale === 'en'
      ? 'About Me – Engineer, Tech Lead & SEO Consultant'
      : 'Sobre Mí – Ingeniero, Líder Técnico y Consultor SEO',
    description: locale === 'en'
      ? 'Carlos Anaya Ruíz — Computer Science Engineer, PMP certified, 4+ years leading software at Amazon, Master Loyalty Group & Wan Hai Lines. Technical SEO, Next.js, Firebase, AI automation.'
      : 'Carlos Anaya Ruíz — Ingeniero en Tecnologías Computacionales, PMP certificado, +4 años liderando software en Amazon, Master Loyalty Group y Wan Hai Lines. SEO técnico, Next.js, Firebase, IA.',
    path: locale === 'en' ? '/about' : '/sobre-mi',
    locale: locale as Locale,
  })
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <AboutContent locale={locale as Locale} />
}

function AboutContent({ locale }: { locale: Locale }) {
  const t = useTranslations('about')
  const personal = getPersonalInfo(locale)
  const experiences = getExperiences(locale)
  const education = getEducation(locale)
  const skillCategories = getSkillCategories(locale)
  const awards = getAwards(locale)

  return (
    <div className="container mx-auto px-4 py-12">
      {/* JSON-LD: About WebPage + Breadcrumbs */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify(generateAboutPageGraph(locale)),
      }} />

      <Breadcrumbs items={[{ label: t('title') }]} />

      <div className="mx-auto max-w-4xl">
        {/* Header with SEO-optimized avatar */}
        <div className="mb-12 text-center">
          <div className="mb-6 flex justify-center">
            <div className="relative h-36 w-36 overflow-hidden rounded-full border-2 border-primary/20 bg-muted shadow-lg md:h-40 md:w-40">
              <Image
                src={SEO_IMAGES.avatar}
                alt={SEO_IMAGES.avatarAlt[locale]}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 144px, 160px"
                priority
              />
            </div>
          </div>
          <h1 className="mb-2 text-4xl font-bold tracking-tight md:text-5xl">Carlos Anaya Ruíz</h1>
          <p className="text-xl text-primary">{personal.title}</p>
          <div className="mt-6 flex justify-center gap-4">
            <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-primary" aria-label="Carlos Anaya Ruíz en LinkedIn"><Linkedin className="h-5 w-5" /></a>
            <a href={SOCIAL_LINKS.github1} target="_blank" rel="noopener noreferrer" className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-primary" aria-label="Carlos Anaya Ruíz en GitHub"><Github className="h-5 w-5" /></a>
            <a href={`mailto:${SOCIAL_LINKS.email}`} className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-primary" aria-label="Email a Carlos Anaya Ruíz"><Mail className="h-5 w-5" /></a>
          </div>
        </div>

        {/* Summary */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">{t('summary')}</h2>
          {personal.summary.split('\n\n').map((p, i) => (
            <p key={i} className="mb-4 text-lg leading-relaxed text-muted-foreground">{p}</p>
          ))}
        </section>

        <Separator className="my-12" />

        {/* Experience */}
        <section className="mb-12">
          <h2 className="mb-8 text-2xl font-bold">{t('experience')}</h2>
          <div className="space-y-6">
            {experiences.map((exp) => (
              <Card key={exp.id}>
                <CardHeader>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {formatShortDate(exp.startDate, locale)} – {exp.endDate ? formatShortDate(exp.endDate, locale) : (locale === 'en' ? 'Present' : 'Presente')}
                    </span>
                    {exp.current && <Badge>{locale === 'en' ? 'Current' : 'Actual'}</Badge>}
                  </div>
                  <CardTitle className="text-xl">{exp.position}</CardTitle>
                  <p className="text-primary">{exp.company}</p>
                  <p className="text-sm text-muted-foreground">{exp.location}</p>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-muted-foreground">{exp.description}</p>
                  {exp.highlights.length > 0 && (
                    <ul className="mb-4 space-y-2">
                      {exp.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{h}
                        </li>
                      ))}
                    </ul>
                  )}
                  {exp.technologies && (
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech) => <Badge key={tech} variant="secondary">{tech}</Badge>)}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-12" />

        {/* Education */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">{t('education')}</h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <Card key={edu.id}>
                <CardHeader>
                  <p className="text-sm text-muted-foreground">{edu.startDate} – {edu.endDate}</p>
                  <CardTitle className="text-lg">{edu.degree} {locale === 'en' ? 'in' : 'en'} {edu.field}</CardTitle>
                  <p className="text-primary">{edu.institution}</p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-12" />

        {/* Skills */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">{t('skills')}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {skillCategories.map((cat) => (
              <Card key={cat.category}>
                <CardHeader><CardTitle className="text-lg">{cat.label}</CardTitle></CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-12" />

        {/* Languages */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">{t('languages')}</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {personal.languages.map((lang) => (
              <Card key={lang.name}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">{lang.name}</p>
                    <p className="text-sm text-muted-foreground">{lang.level}</p>
                  </div>
                  <div className="h-2 w-20 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-primary transition-all" style={{ width: `${lang.proficiency}%` }} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-12" />

        {/* Awards */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">{t('awards')}</h2>
          <div className="grid gap-4">
            {awards.map((award) => (
              <Card key={award.id}>
                <CardHeader>
                  <p className="text-sm text-muted-foreground">{award.organization}</p>
                  <CardTitle className="text-lg">{award.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{award.description}</p>
                  {award.impact && <p className="mt-2 text-sm text-primary">{award.impact}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Certs link */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">{t('certs')}</h2>
          <Button variant="outline" asChild className="gap-2">
            <a href={SOCIAL_LINKS.certsDrive} target="_blank" rel="noopener noreferrer">
              {t('viewCerts')}<ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </section>

        {/* CTA */}
        <div className="rounded-lg border bg-card p-8 text-center">
          <h2 className="mb-2 text-xl font-semibold">
            {locale === 'en' ? 'Ready to work together?' : '¿Listo para trabajar juntos?'}
          </h2>
          <p className="mb-6 text-muted-foreground">
            {locale === 'en' ? 'Check out my services or get in touch directly.' : 'Mira mis servicios o contáctame directamente.'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild><Link href="/">{locale === 'en' ? 'View Services' : 'Ver Servicios'}</Link></Button>
            <Button variant="outline" asChild><Link href="/contacto">{locale === 'en' ? 'Contact Me' : 'Contáctame'}</Link></Button>
          </div>
        </div>
      </div>
    </div>
  )
}
