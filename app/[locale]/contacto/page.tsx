import { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Github, Linkedin, Mail, MapPin, ExternalLink, Briefcase } from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ContactForm } from '@/components/sections/contact-form'
import { getPersonalInfo } from '@/data/personal'
import { SOCIAL_LINKS } from '@/lib/constants'
import { generatePageMetadata } from '@/lib/seo'
import { generateContactPageGraph } from '@/lib/schema'
import { Locale } from '@/data/types'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({
    title:
      locale === 'en'
        ? 'Contact — Technical SEO & Web Development Consulting'
        : 'Contacto — Consultoría SEO Técnico y Desarrollo Web',
    description:
      locale === 'en'
        ? 'Contact Carlos Anaya Ruiz for technical SEO consulting, Next.js web development, AI automation, or dashboard projects. Based in Mexico City. Response within 24-48 hours.'
        : 'Contacta a Carlos Anaya Ruiz para consultoría SEO técnico, desarrollo web Next.js, automatización con IA o proyectos de dashboards. Ciudad de México. Respuesta en 24-48 horas.',
    path: locale === 'en' ? '/contact' : '/contacto',
    locale: locale as Locale,
  })
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <ContactContent locale={locale as Locale} />
}

function ContactContent({ locale }: { locale: Locale }) {
  const t = useTranslations('contact')
  const personal = getPersonalInfo(locale)
  const en = locale === 'en'

  const faqs = en
    ? [
        {
          question: 'What types of projects do you take on?',
          answer:
            'I specialize in technical SEO audits, Next.js web development, AI automation (chatbots, LLM integrations), and enterprise dashboards. From one-off audits to 2-3 month development partnerships.',
        },
        {
          question: 'What is your typical response time?',
          answer:
            'I respond to all inquiries within 24-48 business hours. For urgent projects, please mention the timeline in your message.',
        },
        {
          question: 'Do you work with clients outside of Mexico?',
          answer:
            'Yes. I work remotely with clients across Latin America and the United States. All communication can be in English or Spanish.',
        },
        {
          question: 'How does a typical engagement start?',
          answer:
            'It starts with a free 30-minute discovery call where we discuss your project goals, timeline, and budget. Then I prepare a detailed proposal with scope, deliverables, and pricing.',
        },
      ]
    : [
        {
          question: '¿Qué tipo de proyectos realizas?',
          answer:
            'Me especializo en auditorías SEO técnico, desarrollo web con Next.js, automatización con IA (chatbots, integraciones LLM) y dashboards empresariales. Desde auditorías puntuales hasta alianzas de desarrollo de 2-3 meses.',
        },
        {
          question: '¿Cuál es tu tiempo de respuesta?',
          answer:
            'Respondo todas las consultas en 24-48 horas hábiles. Para proyectos urgentes, menciona el timeline en tu mensaje.',
        },
        {
          question: '¿Trabajas con clientes fuera de México?',
          answer:
            'Sí. Trabajo de forma remota con clientes en toda Latinoamérica y Estados Unidos. La comunicación puede ser en español o inglés.',
        },
        {
          question: '¿Cómo empieza un proyecto típico?',
          answer:
            'Empieza con una llamada de descubrimiento gratuita de 30 minutos donde discutimos los objetivos del proyecto, timeline y presupuesto. Después preparo una propuesta detallada con alcance, entregables y precio.',
        },
      ]

  return (
    <div className="container mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateContactPageGraph(locale, faqs)),
        }}
      />

      <Breadcrumbs items={[{ label: t('title') }]} />

      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            {en
              ? 'Contact — SEO & Development Consulting'
              : 'Contacto — Consultoría SEO y Desarrollo'}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            {/* Contact info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('info')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <a
                  href={`mailto:${personal.email}`}
                  className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t('email')}
                    </p>
                    <p className="text-sm font-medium">{personal.email}</p>
                  </div>
                </a>
                <div className="flex items-center gap-3 rounded-lg p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t('location')}
                    </p>
                    <p className="text-sm font-medium">{personal.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project types */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('projectTypes')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-3 text-sm text-muted-foreground">
                  {t('projectTypesDesc')}
                </p>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/seo-tecnico"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                    >
                      <Briefcase className="h-4 w-4" />
                      {en ? 'Technical SEO' : 'SEO Técnico'}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/desarrollo-web"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                    >
                      <Briefcase className="h-4 w-4" />
                      {en ? 'Web Development' : 'Desarrollo Web'}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/automatizacion-ia"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                    >
                      <Briefcase className="h-4 w-4" />
                      {en ? 'AI Automation' : 'Automatización IA'}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboards"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                    >
                      <Briefcase className="h-4 w-4" />
                      Dashboards
                    </Link>
                  </li>
                </ul>
                <p className="mt-4 text-xs text-muted-foreground">
                  {t('responseTime')}
                </p>
              </CardContent>
            </Card>

            {/* Social */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('social')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a
                  href={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                    <Linkedin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">LinkedIn</p>
                    <p className="text-sm text-muted-foreground">
                      {t('connect')}
                    </p>
                  </div>
                </a>
                <a
                  href={SOCIAL_LINKS.github1}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                    <Github className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">GitHub</p>
                    <p className="text-sm text-muted-foreground">
                      {t('seeProjects')}
                    </p>
                  </div>
                </a>
                <a
                  href={SOCIAL_LINKS.fiverr}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                    <ExternalLink className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Fiverr</p>
                    <p className="text-sm text-muted-foreground">
                      {t('fiverr')}
                    </p>
                  </div>
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Contact form (client component) */}
          <ContactForm />
        </div>

        {/* FAQ — unlocks FAQPage rich results */}
        <section className="mt-12">
          <h2 className="mb-6 text-2xl font-bold">
            {en ? 'Frequently Asked Questions' : 'Preguntas Frecuentes'}
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="rounded-lg border bg-card p-4">
                <summary className="cursor-pointer font-medium">
                  {faq.question}
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
