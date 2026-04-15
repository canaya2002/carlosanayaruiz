import { Metadata } from 'next'
import Image from 'next/image'
import { setRequestLocale } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { BookOpen, ArrowRight, Clock, Mail } from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Newsletter } from '@/components/sections/newsletter'
import { getBooks } from '@/data/books'
import { generatePageMetadata } from '@/lib/seo'
import { generateBooksPageGraph } from '@/lib/schema'
import { Locale } from '@/data/types'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({
    title:
      locale === 'en'
        ? 'Technical Resources — SEO, Next.js & Web Architecture'
        : 'Recursos Técnicos — SEO, Next.js y Arquitectura Web',
    description:
      locale === 'en'
        ? 'Carlos Anaya Ruiz — Technical resources on SEO, Next.js, web performance, and structured data. Practical guides for developers and consultants.'
        : 'Carlos Anaya Ruiz — Recursos técnicos sobre SEO, Next.js, rendimiento web y datos estructurados. Guías prácticas para desarrolladores y consultores.',
    path: locale === 'en' ? '/books' : '/libros',
    locale: locale as Locale,
  })
}

export default async function BooksPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <BooksContent locale={locale as Locale} />
}

function BooksContent({ locale }: { locale: Locale }) {
  const t = useTranslations('books')
  const books = getBooks(locale)
  const en = locale === 'en'

  return (
    <div className="container mx-auto px-4 py-12">
      {/* JSON-LD: WebPage + Breadcrumbs (no Book schema — product not yet available) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBooksPageGraph(locale)),
        }}
      />

      <Breadcrumbs items={[{ label: t('title') }]} />

      <div className="mx-auto max-w-4xl">
        <header className="mb-12 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <BookOpen className="h-7 w-7 text-primary" aria-hidden="true" />
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            {t('title')}
          </h1>
          <p className="text-lg text-muted-foreground">{t('subtitle')}</p>
        </header>

        {/* Book — presented honestly as "coming soon" */}
        <div className="space-y-8">
          {books.map((book) => (
            <Card key={book.id} className="overflow-hidden">
              <div className="md:flex">
                <div className="relative h-64 overflow-hidden bg-muted md:h-auto md:w-56 md:shrink-0">
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 p-8">
                    <BookOpen className="h-16 w-16 text-primary/40" />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="gap-1 text-primary">
                      <Clock className="h-3 w-3" />
                      {t('upcoming')}
                    </Badge>
                    {book.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h2 className="mb-1 text-2xl font-bold">{book.title}</h2>
                  <p className="mb-4 text-sm font-medium text-primary">
                    {book.subtitle}
                  </p>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {book.description}
                  </p>
                  <div className="mb-4 rounded-lg border bg-muted/30 p-4">
                    <p className="mb-1 text-sm font-semibold">
                      {t('audience')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {book.audience}
                    </p>
                  </div>
                  {book.pages && (
                    <p className="text-sm text-muted-foreground">
                      ~{book.pages} {t('pages')}
                    </p>
                  )}
                  <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <p className="mb-2 text-sm font-medium">
                      {t('upcomingDesc')}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Free Resources */}
        <Separator className="my-12" />

        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold">{t('freeResources')}</h2>
          <p className="mb-6 text-muted-foreground">
            {t('freeResourcesDesc')}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium">
                  {en ? 'Technical SEO Consulting' : 'Consultoría SEO Técnica'}
                </h3>
                <p className="mb-3 text-sm text-muted-foreground">
                  {en
                    ? 'Learn about my approach to technical SEO — from audits to implementation.'
                    : 'Conoce mi enfoque de SEO técnico — desde auditorías hasta implementación.'}
                </p>
                <Button variant="outline" asChild size="sm" className="gap-1">
                  <Link href="/seo-tecnico">
                    {en ? 'Learn more' : 'Saber más'}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium">
                  {en ? 'My Professional Background' : 'Mi Trayectoria Profesional'}
                </h3>
                <p className="mb-3 text-sm text-muted-foreground">
                  {en
                    ? 'Amazon, Tec de Monterrey, PMP. See the experience behind the content.'
                    : 'Amazon, Tec de Monterrey, PMP. Conoce la experiencia detrás del contenido.'}
                </p>
                <Button variant="outline" asChild size="sm" className="gap-1">
                  <Link href="/sobre-mi">
                    {en ? 'About me' : 'Sobre mí'}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-lg border bg-card p-8 text-center">
          <h2 className="mb-2 text-xl font-semibold">
            {en
              ? 'Need a custom solution?'
              : '¿Necesitas una solución a medida?'}
          </h2>
          <p className="mb-6 text-muted-foreground">
            {en
              ? 'Beyond resources, I offer consulting and development services.'
              : 'Más allá de los recursos, ofrezco consultoría y desarrollo.'}
          </p>
          <Button variant="outline" asChild className="gap-2">
            <Link href="/contacto">
              {en ? 'Contact me' : 'Contáctame'}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Newsletter — honest lead capture for book notifications */}
      <div className="mt-12">
        <Newsletter />
      </div>
    </div>
  )
}
