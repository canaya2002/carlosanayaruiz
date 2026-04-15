import { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import {
  CheckCircle,
  BarChart3,
  PieChart,
  Activity,
  Database,
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
        ? 'Enterprise Dashboards & Analytics — Real-Time Data Visualization'
        : 'Dashboards y Analytics Empresariales — Visualización de Datos en Tiempo Real',
    description:
      locale === 'en'
        ? 'Carlos Anaya Ruiz — Custom dashboard development. Interactive data visualization with Recharts, D3.js, Power BI. Real-time connections to APIs, SQL, Firebase. Responsive, performant, actionable.'
        : 'Carlos Anaya Ruiz — Desarrollo de dashboards a medida. Visualización interactiva de datos con Recharts, D3.js, Power BI. Conexiones en tiempo real a APIs, SQL, Firebase. Responsivos, performantes, accionables.',
    keywords: [
      locale === 'en' ? 'enterprise dashboards' : 'dashboards empresariales',
      locale === 'en' ? 'data visualization' : 'visualización de datos',
      'Recharts',
      'D3.js',
      'Power BI',
      locale === 'en' ? 'real-time analytics' : 'analytics tiempo real',
      locale === 'en'
        ? 'business intelligence'
        : 'inteligencia de negocios',
      locale === 'en' ? 'responsive dashboard' : 'dashboard responsivo',
    ],
    path: '/dashboards',
    locale: locale as Locale,
  })
}

export default async function DashboardsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <DashboardsContent locale={locale as Locale} />
}

function DashboardsContent({ locale }: { locale: Locale }) {
  const t = useTranslations('servicePages.dashboards')
  const en = locale === 'en'

  const faqs = en
    ? [
        {
          question: 'What visualization libraries do you use?',
          answer:
            'Recharts, D3.js, Chart.js, and Plotly depending on project needs. For BI dashboards I also work with Power BI and DAX for complex queries.',
        },
        {
          question: 'Can the dashboard consume real-time data?',
          answer:
            'Yes. I implement WebSocket connections, Firestore real-time listeners, and optimized polling. The architecture is designed so data updates without page reloads.',
        },
        {
          question: 'Can I add new metrics later?',
          answer:
            'Absolutely. I design dashboards with modular architecture: adding new cards, charts, or sections is as simple as configuring a new component. The data structure is extensible by design.',
        },
      ]
    : [
        {
          question: '¿Qué librerías de visualización utilizas?',
          answer:
            'Recharts, D3.js, Chart.js y Plotly según las necesidades del proyecto. Para dashboards de BI también trabajo con Power BI y DAX para consultas complejas.',
        },
        {
          question:
            '¿El dashboard puede consumir datos en tiempo real?',
          answer:
            'Sí. Implemento conexiones WebSocket, Firestore real-time listeners y polling optimizado. La arquitectura se diseña para que los datos se actualicen sin recargar la página.',
        },
        {
          question: '¿Puedo agregar nuevas métricas después?',
          answer:
            'Absolutamente. Diseño dashboards con arquitectura modular: agregar nuevas tarjetas, gráficas o secciones es tan simple como configurar un nuevo componente. La estructura de datos es extensible por diseño.',
        },
      ]

  const serviceData = {
    id: 'dashboards',
    title: en
      ? 'Enterprise Dashboards & Analytics'
      : 'Dashboards y Analytics Empresariales',
    description: en
      ? 'Custom dashboard development with real-time data visualization. Recharts, D3.js, Power BI. Connected to APIs, SQL, Firebase.'
      : 'Desarrollo de dashboards a medida con visualización de datos en tiempo real. Recharts, D3.js, Power BI. Conectados a APIs, SQL, Firebase.',
    slug: 'dashboards',
  }

  const breadcrumbs = [
    { name: en ? 'Home' : 'Inicio', url: '' },
    { name: 'Dashboards', url: '/dashboards' },
  ]

  const deliverables = en
    ? [
        'Data source audit and requirements gathering',
        'Dashboard UX/UI design with wireframes',
        'Frontend development with React/Next.js and charting libraries',
        'Integration with APIs, databases, and cloud services',
        'Real-time data connections (WebSocket, Firestore listeners)',
        'Performance optimization and data loading strategies',
        'Responsive design and cross-browser testing',
        'Role-based access control and data security',
      ]
    : [
        'Auditoría de fuentes de datos y levantamiento de requerimientos',
        'Diseño UX/UI del dashboard con wireframes',
        'Desarrollo frontend con React/Next.js y librerías de gráficas',
        'Integración con APIs, bases de datos y servicios cloud',
        'Conexiones de datos en tiempo real (WebSocket, Firestore listeners)',
        'Optimización de rendimiento y estrategias de carga de datos',
        'Diseño responsivo y pruebas cross-browser',
        'Control de acceso por roles y seguridad de datos',
      ]

  const stack = [
    'Recharts',
    'D3.js',
    'Chart.js',
    'Plotly',
    'Power BI',
    'DAX',
    'React',
    'Next.js',
    'Firebase',
    'PostgreSQL',
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

      <Breadcrumbs items={[{ label: 'Dashboards' }]} />

      <div className="mx-auto max-w-4xl">
        <header className="mb-12">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <BarChart3 className="h-7 w-7 text-primary" aria-hidden="true" />
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
              ? 'Data Without Visualization Is Just Noise'
              : 'Datos Sin Visualización Son Solo Ruido'}
          </h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              {en
                ? "Your business generates data every day — sales, user behavior, operational metrics, marketing performance. The problem isn't lack of data, it's lack of clarity. A well-designed dashboard transforms raw numbers into decisions."
                : 'Tu negocio genera datos todos los días — ventas, comportamiento de usuarios, métricas operativas, rendimiento de marketing. El problema no es falta de datos, es falta de claridad. Un dashboard bien diseñado transforma números crudos en decisiones.'}
            </p>
            <p>
              {en
                ? 'I build dashboards that connect to your real data sources, update in real time, and work on any device. At Amazon, I built BI systems with Power BI, star schemas, and complex DAX queries that the operations team used daily.'
                : 'Construyo dashboards que se conectan a tus fuentes de datos reales, se actualizan en tiempo real y funcionan en cualquier dispositivo. En Amazon, construí sistemas de BI con Power BI, esquemas de estrella y queries DAX complejas que el equipo de operaciones usaba diariamente.'}
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
                icon: PieChart,
                title: en
                  ? 'Interactive Visualizations'
                  : 'Visualizaciones Interactivas',
                desc: en
                  ? 'Charts, graphs, maps, and tables with drill-down, filters, and real-time updates. Recharts, D3.js, or Plotly depending on complexity.'
                  : 'Gráficas, mapas y tablas con drill-down, filtros y actualizaciones en tiempo real. Recharts, D3.js o Plotly según la complejidad.',
              },
              {
                icon: Activity,
                title: en ? 'Real-Time Data' : 'Datos en Tiempo Real',
                desc: en
                  ? 'WebSocket connections, Firestore listeners, and optimized polling. Data updates without page reloads.'
                  : 'Conexiones WebSocket, listeners de Firestore y polling optimizado. Datos que se actualizan sin recargar la página.',
              },
              {
                icon: Database,
                title: en
                  ? 'Multiple Data Sources'
                  : 'Múltiples Fuentes de Datos',
                desc: en
                  ? 'REST APIs, GraphQL, SQL databases, Firebase, CSV imports. I connect whatever your data lives in.'
                  : 'APIs REST, GraphQL, bases de datos SQL, Firebase, imports CSV. Conecto lo que sea que albergue tus datos.',
              },
              {
                icon: BarChart3,
                title: en ? 'BI & Reporting' : 'BI y Reportes',
                desc: en
                  ? 'Power BI dashboards, DAX queries, star/snowflake schemas. Enterprise reporting that decision-makers actually use.'
                  : 'Dashboards Power BI, queries DAX, esquemas estrella/snowflake. Reportes empresariales que los tomadores de decisiones realmente usan.',
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
              ? 'Tell me what data you need to visualize. I respond within 24-48 hours.'
              : 'Cuéntame qué datos necesitas visualizar. Respondo en 24-48 horas.'}
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
