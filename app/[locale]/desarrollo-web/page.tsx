import { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import {
  ArrowRight,
  CheckCircle,
  Globe,
  Code2,
  Shield,
  Zap,
  Search,
  Bot,
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
        ? 'Next.js & Firebase Web Development — Fast, Scalable, SEO-Ready'
        : 'Desarrollo Web con Next.js y Firebase — Rápido, Escalable, Listo para SEO',
    description:
      locale === 'en'
        ? 'Carlos Anaya Ruiz — Web development with Next.js and Firebase. SSR/ISR, TypeScript, Firestore, authentication, Vercel deployment. From landing pages to SaaS platforms, optimized for performance and search.'
        : 'Carlos Anaya Ruiz — Desarrollo web con Next.js y Firebase. SSR/ISR, TypeScript, Firestore, autenticación, deploy en Vercel. Desde landing pages hasta plataformas SaaS, optimizadas para rendimiento y buscadores.',
    keywords: [
      'Next.js',
      'Firebase',
      locale === 'en' ? 'web development Mexico' : 'desarrollo web México',
      'TypeScript',
      'React',
      'Vercel',
      'SSR',
      'ISR',
      locale === 'en' ? 'SaaS development' : 'desarrollo SaaS',
      locale === 'en' ? 'landing page development' : 'desarrollo landing page',
    ],
    path: locale === 'en' ? '/web-development' : '/desarrollo-web',
    locale: locale as Locale,
  })
}

export default async function DesarrolloWebPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <DesarrolloWebContent locale={locale as Locale} />
}

function DesarrolloWebContent({ locale }: { locale: Locale }) {
  const t = useTranslations('servicePages.desarrolloWeb')
  const en = locale === 'en'

  const faqs = en
    ? [
        {
          question: 'How long does it take to build a web app with Next.js?',
          answer:
            'An optimized landing page: 1-2 weeks. A platform with auth, dashboard, and database: 4-8 weeks. A full SaaS with multiple modules: 8-16 weeks. I always start with a technical audit to define scope and deliverables.',
        },
        {
          question: 'Why Next.js and not another framework?',
          answer:
            'Next.js offers the best combination of performance, SEO, and developer experience. Its hybrid rendering (SSR/SSG/ISR) ensures each page is served in the most efficient way for Google and users. Its ecosystem with Vercel guarantees fast, reliable deployments.',
        },
        {
          question: 'Can you migrate my current site to Next.js?',
          answer:
            'Yes. I handle migrations from WordPress, React SPAs, Angular, and other frameworks. The process includes pre-migration SEO audit, URL mapping, 301 redirects, and post-migration validation to preserve organic rankings.',
        },
        {
          question: 'Do you handle both frontend and backend?',
          answer:
            'Yes. I build full-stack applications with Next.js (App Router, Server Components) on the frontend and Firebase (Firestore, Auth, Cloud Functions) or Node.js APIs on the backend. I can also integrate with existing APIs and databases.',
        },
      ]
    : [
        {
          question:
            '¿Cuánto tiempo toma desarrollar una aplicación web con Next.js?',
          answer:
            'Una landing page optimizada: 1-2 semanas. Una plataforma con autenticación, dashboard y base de datos: 4-8 semanas. Un SaaS completo con múltiples módulos: 8-16 semanas. Siempre empiezo con una auditoría técnica para definir alcance y entregables.',
        },
        {
          question: '¿Por qué Next.js y no otro framework?',
          answer:
            'Next.js ofrece la mejor combinación de rendimiento, SEO y experiencia de desarrollo. Su renderizado híbrido (SSR/SSG/ISR) permite que cada página se sirva de la forma más eficiente para Google y para el usuario. Su ecosistema con Vercel garantiza despliegues rápidos y confiables.',
        },
        {
          question: '¿Puedes migrar mi sitio actual a Next.js?',
          answer:
            'Sí. Realizo migraciones desde WordPress, React SPA, Angular y otros frameworks. El proceso incluye auditoría SEO previa, mapeo de URLs, redirecciones 301 y validación post-migración para no perder posicionamiento orgánico.',
        },
        {
          question: '¿Manejas tanto frontend como backend?',
          answer:
            'Sí. Construyo aplicaciones full-stack con Next.js (App Router, Server Components) en el frontend y Firebase (Firestore, Auth, Cloud Functions) o APIs Node.js en el backend. También puedo integrar con APIs y bases de datos existentes.',
        },
      ]

  const serviceData = {
    id: 'desarrollo-web',
    title: en
      ? 'Web Development with Next.js & Firebase'
      : 'Desarrollo Web con Next.js y Firebase',
    description: en
      ? 'Web development with Next.js and Firebase. SSR/ISR, TypeScript, Firestore, Vercel. From landing pages to SaaS platforms.'
      : 'Desarrollo web con Next.js y Firebase. SSR/ISR, TypeScript, Firestore, Vercel. Desde landing pages hasta plataformas SaaS.',
    slug: en ? 'web-development' : 'desarrollo-web',
  }

  const breadcrumbs = [
    { name: en ? 'Home' : 'Inicio', url: '' },
    {
      name: en ? 'Web Development' : 'Desarrollo Web',
      url: en ? '/web-development' : '/desarrollo-web',
    },
  ]

  const deliverables = en
    ? [
        'Information architecture and wireframes',
        'Frontend development with Next.js App Router + TypeScript',
        'Firebase integration: Firestore, Auth, Cloud Functions',
        'Technical SEO: sitemap, robots, hreflang, Schema JSON-LD',
        'Core Web Vitals and performance optimization',
        'Responsive design tested across devices',
        'Vercel deployment with CI/CD',
        'Security: headers, input sanitization, authentication',
      ]
    : [
        'Arquitectura de información y wireframes',
        'Desarrollo frontend con Next.js App Router + TypeScript',
        'Integración Firebase: Firestore, Auth, Cloud Functions',
        'SEO técnico: sitemap, robots, hreflang, Schema JSON-LD',
        'Optimización de Core Web Vitals y rendimiento',
        'Diseño responsivo probado en múltiples dispositivos',
        'Deploy en Vercel con CI/CD',
        'Seguridad: headers, sanitización de inputs, autenticación',
      ]

  const stack = [
    'Next.js 16',
    'React 19',
    'TypeScript',
    'Tailwind CSS',
    'Firebase',
    'Firestore',
    'Vercel',
    'Node.js',
    'PostgreSQL',
    'Radix UI',
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
          { label: en ? 'Web Development' : 'Desarrollo Web' },
        ]}
      />

      <div className="mx-auto max-w-4xl">
        <header className="mb-12">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Globe className="h-7 w-7 text-primary" aria-hidden="true" />
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
              ? 'Modern Web Architecture That Ranks and Converts'
              : 'Arquitectura Web Moderna Que Se Posiciona y Convierte'}
          </h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              {en
                ? 'Every web project I build starts with the same question: what does Google need to see, and what does the user need to do? The answer shapes everything — rendering strategy, data fetching, URL structure, component architecture.'
                : 'Cada proyecto web que construyo empieza con la misma pregunta: ¿qué necesita ver Google, y qué necesita hacer el usuario? La respuesta define todo — estrategia de renderizado, data fetching, estructura de URLs, arquitectura de componentes.'}
            </p>
            <p>
              {en
                ? "I use Next.js because it's the only framework that lets me choose SSR, SSG, or ISR per page — the right rendering strategy for each type of content. Combined with Firebase's real-time database, authentication, and serverless functions, it's the stack that gives the most value per engineering hour."
                : 'Uso Next.js porque es el único framework que me permite elegir SSR, SSG o ISR por página — la estrategia de renderizado correcta para cada tipo de contenido. Combinado con la base de datos en tiempo real de Firebase, autenticación y funciones serverless, es el stack que da más valor por hora de ingeniería.'}
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
                icon: Zap,
                title: en ? 'Landing Pages' : 'Landing Pages',
                desc: en
                  ? 'High-converting landing pages with Lighthouse 90+ scores. Static generation, optimized images, perfect SEO.'
                  : 'Landing pages de alta conversión con Lighthouse 90+. Generación estática, imágenes optimizadas, SEO perfecto.',
              },
              {
                icon: Code2,
                title: en ? 'SaaS Platforms' : 'Plataformas SaaS',
                desc: en
                  ? 'Full platforms with authentication, dashboards, real-time data, and billing. Server Components + Firestore.'
                  : 'Plataformas completas con autenticación, dashboards, datos en tiempo real y cobros. Server Components + Firestore.',
              },
              {
                icon: Shield,
                title: en ? 'Secure Architecture' : 'Arquitectura Segura',
                desc: en
                  ? 'Security headers, CSRF protection, input sanitization, JWT auth, role-based access. Security by design, not as an afterthought.'
                  : 'Headers de seguridad, protección CSRF, sanitización de inputs, auth JWT, control de acceso por roles. Seguridad por diseño.',
              },
              {
                icon: Search,
                title: en ? 'SEO-First Sites' : 'Sitios SEO-First',
                desc: en
                  ? 'Every site ships with structured data, optimized metadata, sitemaps, and performance budgets. Because traffic without indexation is zero.'
                  : 'Cada sitio incluye datos estructurados, metadata optimizada, sitemaps y presupuestos de rendimiento. Porque tráfico sin indexación es cero.',
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
          <div className="grid gap-4 sm:grid-cols-2">
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
                <Bot className="h-5 w-5 text-primary" />
                <div>
                  <Link href="/automatizacion-ia" className="font-medium hover:text-primary">
                    {en ? 'AI Automation' : 'Automatización IA'}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {en ? 'Chatbots & workflows' : 'Chatbots y flujos'}
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
              ? 'Tell me what you need to build. I respond within 24-48 hours.'
              : 'Cuéntame qué necesitas construir. Respondo en 24-48 horas.'}
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
