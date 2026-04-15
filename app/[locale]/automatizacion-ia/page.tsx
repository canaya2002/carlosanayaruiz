import { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import {
  CheckCircle,
  Bot,
  Cpu,
  MessageSquare,
  Shield,
  Search,
  BarChart3,
} from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { SOCIAL_LINKS } from '@/lib/constants'
import { generatePageMetadata } from '@/lib/seo'
import { generateServicePageGraph } from '@/lib/schema'
import { Locale } from '@/data/types'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({
    title:
      locale === 'en'
        ? 'AI Automation & Chatbots for Business — LLM Integration'
        : 'Automatización con IA y Chatbots para Empresas — Integración LLM',
    description:
      locale === 'en'
        ? 'Carlos Anaya Ruiz — AI automation and intelligent chatbot development. GPT & Gemini integration, automated workflows, API connections, CRM integration. Secure, scalable, measurable ROI.'
        : 'Carlos Anaya Ruiz — Automatización con IA y desarrollo de chatbots inteligentes. Integración GPT y Gemini, flujos automatizados, conexión de APIs, integración CRM. Seguro, escalable, ROI medible.',
    keywords: [
      locale === 'en' ? 'AI automation' : 'automatización IA',
      locale === 'en' ? 'intelligent chatbots' : 'chatbots inteligentes',
      'GPT',
      'Gemini',
      'LLM',
      locale === 'en' ? 'CRM integration' : 'integración CRM',
      locale === 'en'
        ? 'process automation'
        : 'automatización de procesos',
      locale === 'en' ? 'AI for business' : 'IA para empresas',
    ],
    path: locale === 'en' ? '/ai-automation' : '/automatizacion-ia',
    locale: locale as Locale,
  })
}

export default async function AutomatizacionIAPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <AutomatizacionIAContent locale={locale as Locale} />
}

function AutomatizacionIAContent({ locale }: { locale: Locale }) {
  const t = useTranslations('servicePages.automatizacionIA')
  const en = locale === 'en'

  const faqs = en
    ? [
        {
          question: 'Can the chatbot connect with my CRM or database?',
          answer:
            'Yes. I design integrations with HubSpot, Salesforce, Firestore, PostgreSQL, and REST/GraphQL APIs. The chatbot can query and write data to your systems securely.',
        },
        {
          question: 'How secure is the implementation?',
          answer:
            'Security is a design principle, not an add-on. I implement JWT authentication, input sanitization, rate limiting, and sensitive information is never sent directly to the LLM without preprocessing.',
        },
        {
          question: 'How much does it cost to maintain an AI chatbot?',
          answer:
            'Operational costs depend on conversation volume and the AI model used. I design architectures that optimize token usage with caching and precomputed responses to keep costs low without sacrificing quality.',
        },
      ]
    : [
        {
          question:
            '¿El chatbot puede conectarse con mi CRM o base de datos?',
          answer:
            'Sí. Diseño integraciones con HubSpot, Salesforce, Firestore, PostgreSQL y APIs REST/GraphQL. El chatbot puede consultar y escribir datos en tus sistemas de forma segura.',
        },
        {
          question: '¿Qué tan segura es la implementación?',
          answer:
            'La seguridad es un principio de diseño, no un agregado. Implemento autenticación JWT, sanitización de entradas, límites de uso, y la información sensible nunca se envía directamente al LLM sin preprocesamiento.',
        },
        {
          question: '¿Cuánto cuesta mantener un chatbot con IA?',
          answer:
            'Los costos operativos dependen del volumen de conversaciones y el modelo de IA utilizado. Diseño arquitecturas que optimizan el uso de tokens con caching y respuestas precomputadas para mantener costos bajos sin sacrificar calidad.',
        },
      ]

  const serviceData = {
    id: 'automatizacion-ia',
    title: en
      ? 'AI Automation & Chatbots'
      : 'Automatización con IA y Chatbots',
    description: en
      ? 'AI automation and intelligent chatbot development for business. GPT & Gemini integration, automated workflows, CRM connection.'
      : 'Automatización con IA y desarrollo de chatbots inteligentes para empresas. Integración GPT y Gemini, flujos automatizados, conexión CRM.',
    slug: en ? 'ai-automation' : 'automatizacion-ia',
  }

  const breadcrumbs = [
    { name: en ? 'Home' : 'Inicio', url: '' },
    {
      name: en ? 'AI Automation' : 'Automatización IA',
      url: en ? '/ai-automation' : '/automatizacion-ia',
    },
  ]

  const deliverables = en
    ? [
        'Automatable process analysis and feasibility study',
        'Conversational flow and dynamic prompt design',
        'Chatbot development with LLM integration (GPT/Gemini)',
        'Secure integration with APIs and internal systems',
        'Monitoring dashboard and usage metrics',
        'Technical documentation and team training',
        'Token usage optimization and cost control',
      ]
    : [
        'Análisis de procesos automatizables y estudio de viabilidad',
        'Diseño de flujos conversacionales y prompts dinámicos',
        'Desarrollo de chatbot con integración LLM (GPT/Gemini)',
        'Integración segura con APIs y sistemas internos',
        'Panel de monitoreo y métricas de uso',
        'Documentación técnica y capacitación al equipo',
        'Optimización de uso de tokens y control de costos',
      ]

  const stack = [
    'GPT-4',
    'Gemini',
    'Claude',
    'Python',
    'Node.js',
    'LangChain',
    'Firebase',
    'REST APIs',
    'GraphQL',
    'WebSocket',
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateServicePageGraph(locale, serviceData, breadcrumbs, faqs)
          ),
        }}
      />

      <Breadcrumbs
        items={[
          { label: en ? 'AI Automation' : 'Automatización IA' },
        ]}
      />

      <div className="mx-auto max-w-4xl">
        <header className="mb-12">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Bot className="h-7 w-7 text-primary" aria-hidden="true" />
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            {t('title')}
          </h1>
          <p className="max-w-2xl text-xl text-muted-foreground">
            {t('subtitle')}
          </p>
        </header>

        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold">
            {en
              ? 'AI That Solves Real Problems'
              : 'IA Que Resuelve Problemas Reales'}
          </h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              {en
                ? "AI automation isn't about adding a chatbot for the sake of it. It's about identifying which processes in your business consume the most human time and engineering solutions that handle them reliably, securely, and at scale."
                : 'La automatización con IA no se trata de poner un chatbot por ponerlo. Se trata de identificar qué procesos de tu negocio consumen más tiempo humano e ingeniar soluciones que los manejen de forma confiable, segura y a escala.'}
            </p>
            <p>
              {en
                ? 'I build chatbots that understand context and memory, automated workflows that process documents, and API integrations that connect your existing systems with LLM intelligence — always with security as a design principle.'
                : 'Construyo chatbots que entienden contexto y memoria, flujos automatizados que procesan documentos, e integraciones de APIs que conectan tus sistemas existentes con inteligencia LLM — siempre con seguridad como principio de diseño.'}
            </p>
          </div>
        </section>

        <Separator className="my-12" />

        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">
            {en ? 'What I Build' : 'Qué Construyo'}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              {
                icon: MessageSquare,
                title: en ? 'Intelligent Chatbots' : 'Chatbots Inteligentes',
                desc: en
                  ? 'Context-aware chatbots with memory that understand your business. Customer support, internal assistants, lead qualification.'
                  : 'Chatbots con contexto y memoria que entienden tu negocio. Soporte al cliente, asistentes internos, calificación de leads.',
              },
              {
                icon: Cpu,
                title: en
                  ? 'Automated Workflows'
                  : 'Flujos Automatizados',
                desc: en
                  ? 'Document processing, email triage, data extraction, report generation. LLM-powered pipelines that replace manual tasks.'
                  : 'Procesamiento de documentos, triaje de emails, extracción de datos, generación de reportes. Pipelines con LLM que reemplazan tareas manuales.',
              },
              {
                icon: Shield,
                title: en ? 'Secure Integration' : 'Integración Segura',
                desc: en
                  ? 'JWT auth, input sanitization, rate limiting, PII masking. Sensitive data never reaches the LLM without preprocessing.'
                  : 'Auth JWT, sanitización de inputs, rate limiting, enmascaramiento de PII. Datos sensibles nunca llegan al LLM sin preprocesamiento.',
              },
              {
                icon: BarChart3,
                title: en
                  ? 'Monitoring & Optimization'
                  : 'Monitoreo y Optimización',
                desc: en
                  ? 'Usage dashboards, token cost tracking, response quality metrics. Continuous optimization to reduce costs and improve accuracy.'
                  : 'Dashboards de uso, seguimiento de costos de tokens, métricas de calidad de respuestas. Optimización continua para reducir costos y mejorar precisión.',
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <Card key={item.title}>
                  <CardHeader>
                    <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">
            {en ? 'Full Deliverables' : 'Entregables Completos'}
          </h2>
          <ul className="space-y-3">
            {deliverables.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-muted-foreground">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold">
            {en ? 'Tech Stack' : 'Stack Tecnológico'}
          </h2>
          <div className="flex flex-wrap gap-2">
            {stack.map((tool) => (
              <Badge key={tool} variant="secondary">{tool}</Badge>
            ))}
          </div>
        </section>

        <Separator className="my-12" />

        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">
            {en ? 'Frequently Asked Questions' : 'Preguntas Frecuentes'}
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="rounded-lg border bg-card p-4">
                <summary className="cursor-pointer font-medium">{faq.question}</summary>
                <p className="mt-3 text-sm text-muted-foreground">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold">
            {en ? 'Related Services' : 'Servicios Relacionados'}
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Search className="h-5 w-5 text-primary" />
                <div>
                  <Link href="/seo-tecnico" className="font-medium hover:text-primary">
                    {en ? 'Technical SEO' : 'SEO Técnico'}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {en ? 'Audits & optimization' : 'Auditorías y optimización'}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Search className="h-5 w-5 text-primary" />
                <div>
                  <Link href="/desarrollo-web" className="font-medium hover:text-primary">
                    {en ? 'Web Development' : 'Desarrollo Web'}
                  </Link>
                  <p className="text-sm text-muted-foreground">Next.js & Firebase</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <BarChart3 className="h-5 w-5 text-primary" />
                <div>
                  <Link href="/dashboards" className="font-medium hover:text-primary">
                    Dashboards
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {en ? 'Analytics & monitoring' : 'Analytics y monitoreo'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="rounded-lg border bg-card p-8 text-center">
          <h2 className="mb-2 text-xl font-semibold">{t('ctaMain')}</h2>
          <p className="mb-6 text-muted-foreground">
            {en
              ? 'Tell me which processes you want to automate. I respond within 24-48 hours.'
              : 'Cuéntame qué procesos quieres automatizar. Respondo en 24-48 horas.'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/contacto">{t('ctaSecondary')}</Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <a href={SOCIAL_LINKS.fiverr} target="_blank" rel="nofollow noopener noreferrer">
                {en ? 'Hire on Fiverr' : 'Contratar en Fiverr'}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
