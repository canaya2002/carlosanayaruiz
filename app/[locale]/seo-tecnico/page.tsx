import { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import {
  ArrowRight,
  CheckCircle,
  Search,
  FileCode2,
  Gauge,
  Globe,
  BarChart3,
  Shield,
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
        ? 'Technical SEO Consultant in Mexico — Audits, Schema & Performance'
        : 'Consultor SEO Técnico en México — Auditorías, Schema y Rendimiento',
    description:
      locale === 'en'
        ? 'Carlos Anaya Ruiz — Technical SEO consulting in Mexico. I audit, optimize, and architect websites for search: structured data, Core Web Vitals, indexation, hreflang, information architecture. PMP certified, 4+ years.'
        : 'Carlos Anaya Ruiz — Consultoría SEO técnico en México. Audito, optimizo y arquitecto sitios web para buscadores: datos estructurados, Core Web Vitals, indexación, hreflang, arquitectura de información. Certificado PMP, +4 años.',
    keywords: [
      locale === 'en' ? 'technical SEO consultant' : 'consultor SEO técnico',
      locale === 'en' ? 'technical SEO consultant Mexico' : 'consultor SEO técnico México',
      locale === 'en' ? 'SEO audit' : 'auditoría SEO',
      locale === 'en' ? 'SEO audit Mexico' : 'auditoría SEO México',
      'Core Web Vitals',
      'Schema.org',
      'JSON-LD',
      locale === 'en' ? 'Next.js SEO' : 'SEO Next.js',
      'hreflang',
      locale === 'en' ? 'indexation strategy' : 'estrategia de indexación',
      locale === 'en' ? 'information architecture' : 'arquitectura de información',
      locale === 'en' ? 'SEO migration' : 'migración SEO',
      locale === 'en' ? 'structured data implementation' : 'implementación datos estructurados',
      locale === 'en' ? 'web performance optimization' : 'optimización rendimiento web',
    ],
    path: locale === 'en' ? '/technical-seo' : '/seo-tecnico',
    locale: locale as Locale,
  })
}

export default async function SEOTecnicoPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <SEOTecnicoContent locale={locale as Locale} />
}

function SEOTecnicoContent({ locale }: { locale: Locale }) {
  const t = useTranslations('servicePages.seoTecnico')
  const en = locale === 'en'

  const faqs = en
    ? [
        {
          question: 'What does a technical SEO audit include?',
          answer:
            'A full analysis of your site architecture, indexation status, structured data, Core Web Vitals, internal linking, canonical tags, hreflang, robots/sitemap, and rendering. You get a prioritized report with specific fixes and expected impact.',
        },
        {
          question: 'Do you work with sites not built in Next.js?',
          answer:
            'Yes. I audit and optimize sites built in WordPress, Shopify, React SPAs, Angular, and custom stacks. My deepest expertise is in Next.js and React-based architectures, but the SEO principles apply universally.',
        },
        {
          question:
            'How long before I see results from technical SEO improvements?',
          answer:
            'Technical fixes (indexation, schema, CWV) typically show impact in 2-8 weeks after Google recrawls. Structural changes like information architecture may take 2-4 months to fully reflect in rankings.',
        },
        {
          question: 'Can you handle SEO migrations?',
          answer:
            'Yes. I handle migrations from WordPress, Angular, React SPAs, and other frameworks to Next.js. The process includes pre-migration audit, URL mapping, 301 redirects, schema migration, and post-migration validation to preserve organic rankings.',
        },
      ]
    : [
        {
          question: '¿Qué incluye una auditoría de SEO técnico?',
          answer:
            'Un análisis completo de la arquitectura de tu sitio, estado de indexación, datos estructurados, Core Web Vitals, enlazado interno, canonicals, hreflang, robots/sitemap y renderizado. Recibes un reporte priorizado con correcciones específicas e impacto esperado.',
        },
        {
          question: '¿Trabajas con sitios que no están en Next.js?',
          answer:
            'Sí. Audito y optimizo sitios en WordPress, Shopify, React SPAs, Angular y stacks personalizados. Mi expertise más profundo es en Next.js y arquitecturas basadas en React, pero los principios de SEO aplican universalmente.',
        },
        {
          question:
            '¿Cuánto tiempo tarda en verse el impacto de mejoras de SEO técnico?',
          answer:
            'Las correcciones técnicas (indexación, schema, CWV) típicamente muestran impacto en 2-8 semanas después de que Google recrawlea. Cambios estructurales como arquitectura de información pueden tomar 2-4 meses en reflejarse completamente en rankings.',
        },
        {
          question: '¿Puedes manejar migraciones SEO?',
          answer:
            'Sí. Manejo migraciones desde WordPress, Angular, React SPAs y otros frameworks hacia Next.js. El proceso incluye auditoría pre-migración, mapeo de URLs, redirecciones 301, migración de schema y validación post-migración para preservar rankings orgánicos.',
        },
      ]

  const serviceData = {
    id: 'seo-tecnico',
    title: en ? 'Technical SEO Consulting' : 'Consultoría SEO Técnica',
    description: en
      ? 'Technical SEO consulting in Mexico. Audits, structured data, Core Web Vitals, indexation, and information architecture.'
      : 'Consultoría SEO técnico en México. Auditorías, datos estructurados, Core Web Vitals, indexación y arquitectura de información.',
    slug: en ? 'technical-seo' : 'seo-tecnico',
  }

  const breadcrumbs = [
    { name: en ? 'Home' : 'Inicio', url: '' },
    {
      name: en ? 'Technical SEO' : 'SEO Técnico',
      url: en ? '/technical-seo' : '/seo-tecnico',
    },
  ]

  const deliverables = en
    ? [
        'Full technical SEO audit with prioritized findings',
        'Schema.org / JSON-LD implementation and validation',
        'Core Web Vitals optimization (LCP, INP, CLS)',
        'Information architecture and URL structure review',
        'Indexation strategy: sitemap, robots, canonical, hreflang',
        'Internal linking audit and optimization',
        'Competitor gap analysis',
        'Monthly monitoring and reporting',
      ]
    : [
        'Auditoría SEO técnica completa con hallazgos priorizados',
        'Implementación y validación de Schema.org / JSON-LD',
        'Optimización de Core Web Vitals (LCP, INP, CLS)',
        'Revisión de arquitectura de información y estructura de URLs',
        'Estrategia de indexación: sitemap, robots, canonical, hreflang',
        'Auditoría y optimización de enlazado interno',
        'Análisis de gaps vs competencia',
        'Monitoreo mensual y reportes',
      ]

  const tools = [
    'Google Search Console',
    'Lighthouse',
    'PageSpeed Insights',
    'Screaming Frog',
    'Schema Validator',
    'Chrome DevTools',
    'Next.js',
    'Vercel Analytics',
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
          {
            label: en ? 'Technical SEO' : 'SEO Técnico',
          },
        ]}
      />

      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <header className="mb-12">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Search className="h-7 w-7 text-primary" aria-hidden="true" />
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            {t('title')}
          </h1>
          <p className="max-w-2xl text-xl text-muted-foreground">
            {t('subtitle')}
          </p>
        </header>

        {/* Problem / Why */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold">
            {en
              ? 'Why Technical SEO Matters'
              : 'Por Qué Importa el SEO Técnico'}
          </h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              {en
                ? 'A beautiful website that Google can\'t crawl, understand, or index is invisible. Technical SEO is the engineering layer that ensures search engines see your content the same way users do — fast, structured, and unambiguous.'
                : 'Un sitio web bonito que Google no puede rastrear, entender o indexar es invisible. El SEO técnico es la capa de ingeniería que asegura que los motores de búsqueda vean tu contenido de la misma forma que los usuarios — rápido, estructurado y sin ambigüedad.'}
            </p>
            <p>
              {en
                ? 'I\'ve seen sites lose 40% of their organic traffic after a migration because nobody mapped the URLs. I\'ve audited platforms where half the pages were blocked from indexing by a misconfigured robots.txt. These are engineering problems with engineering solutions.'
                : 'He visto sitios perder 40% de su tráfico orgánico después de una migración porque nadie mapeó las URLs. He auditado plataformas donde la mitad de las páginas estaban bloqueadas de indexación por un robots.txt mal configurado. Estos son problemas de ingeniería con soluciones de ingeniería.'}
            </p>
          </div>
        </section>

        <Separator className="my-12" />

        {/* What I do */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">
            {en ? 'What I Deliver' : 'Qué Entrego'}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              {
                icon: FileCode2,
                title: en ? 'Structured Data' : 'Datos Estructurados',
                desc: en
                  ? 'Schema.org / JSON-LD implementation: Person, Service, FAQ, BreadcrumbList, Product. Validated against Google Rich Results guidelines.'
                  : 'Implementación Schema.org / JSON-LD: Person, Service, FAQ, BreadcrumbList, Product. Validado contra las guías de Google Rich Results.',
              },
              {
                icon: Gauge,
                title: 'Core Web Vitals',
                desc: en
                  ? 'LCP, INP, CLS optimization. Font loading, image optimization, lazy loading, JavaScript reduction, layout stability.'
                  : 'Optimización de LCP, INP, CLS. Carga de fuentes, optimización de imágenes, lazy loading, reducción de JavaScript, estabilidad de layout.',
              },
              {
                icon: Globe,
                title: en ? 'Internationalization' : 'Internacionalización',
                desc: en
                  ? 'hreflang, canonical URLs, locale routing, alternate language tags. Correct implementation for multi-language sites.'
                  : 'hreflang, URLs canónicas, enrutamiento por locale, alternate language tags. Implementación correcta para sitios multi-idioma.',
              },
              {
                icon: Shield,
                title: en
                  ? 'Architecture & Indexation'
                  : 'Arquitectura e Indexación',
                desc: en
                  ? 'URL structure, internal linking, sitemap, robots.txt, crawl budget optimization. Every page earns its place in the index.'
                  : 'Estructura de URLs, enlazado interno, sitemap, robots.txt, optimización de crawl budget. Cada página se gana su lugar en el índice.',
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

        {/* Deliverables list */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">
            {en ? 'Full Deliverables' : 'Entregables Completos'}
          </h2>
          <ul className="space-y-3">
            {deliverables.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-muted-foreground"
              >
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Tools */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold">
            {en ? 'Tools & Stack' : 'Herramientas & Stack'}
          </h2>
          <div className="flex flex-wrap gap-2">
            {tools.map((tool) => (
              <Badge key={tool} variant="secondary">
                {tool}
              </Badge>
            ))}
          </div>
        </section>

        <Separator className="my-12" />

        {/* FAQ */}
        <section className="mb-12">
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

        {/* Related services */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold">
            {en ? 'Related Services' : 'Servicios Relacionados'}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Globe className="h-5 w-5 text-primary" />
                <div>
                  <Link
                    href="/desarrollo-web"
                    className="font-medium hover:text-primary"
                  >
                    {en ? 'Web Development' : 'Desarrollo Web'}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    Next.js & Firebase
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <BarChart3 className="h-5 w-5 text-primary" />
                <div>
                  <Link
                    href="/dashboards"
                    className="font-medium hover:text-primary"
                  >
                    {en ? 'Dashboards' : 'Dashboards'}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {en ? 'Analytics & BI' : 'Analytics y BI'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-lg border bg-card p-8 text-center">
          <h2 className="mb-2 text-xl font-semibold">{t('ctaMain')}</h2>
          <p className="mb-6 text-muted-foreground">
            {en
              ? 'Tell me about your site. I respond within 24-48 hours with a preliminary assessment.'
              : 'Cuéntame sobre tu sitio. Respondo en 24-48 horas con una evaluación preliminar.'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/contacto">{t('ctaSecondary')}</Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <a
                href={SOCIAL_LINKS.fiverr}
                target="_blank"
                rel="nofollow noopener noreferrer"
              >
                {en ? 'Hire on Fiverr' : 'Contratar en Fiverr'}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
