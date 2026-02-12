import { Metadata } from 'next'
import Image from 'next/image'
import { setRequestLocale } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { BookOpen, ExternalLink, ArrowRight } from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getBooks } from '@/data/books'
import { generatePageMetadata } from '@/lib/seo'
import { generateBooksPageGraph, generateBreadcrumbSchema } from '@/lib/schema'
import { Locale } from '@/data/types'

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({
    title: locale === 'en' ? 'Books – Technical Knowledge in Book Format' : 'Libros – Conocimiento Técnico en Formato Libro',
    description: locale === 'en'
      ? 'Carlos Anaya Ruíz — Books on technical SEO, Next.js, web performance, and structured data. Practical guides for developers and consultants.'
      : 'Carlos Anaya Ruíz — Libros sobre SEO técnico, Next.js, rendimiento web y datos estructurados. Guías prácticas para desarrolladores y consultores.',
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

  return (
    <div className="container mx-auto px-4 py-12">
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify(generateBooksPageGraph(locale)),
      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify(generateBreadcrumbSchema([
          { name: locale === 'en' ? 'Home' : 'Inicio', url: '/' },
          { name: t('title'), url: locale === 'en' ? '/books' : '/libros' },
        ], locale)),
      }} />

      <Breadcrumbs items={[{ label: t('title') }]} />

      <div className="mx-auto max-w-4xl">
        <header className="mb-12 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <BookOpen className="h-7 w-7 text-primary" aria-hidden="true" />
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">{t('title')}</h1>
          <p className="text-lg text-muted-foreground">{t('subtitle')}</p>
        </header>

        <div className="space-y-8">
          {books.map((book) => (
            <Card key={book.id} className="overflow-hidden">
              <div className="md:flex">
                {/* Cover */}
                <div className="relative h-64 overflow-hidden bg-muted md:h-auto md:w-56 md:shrink-0">
                  <Image
                    src={book.coverImage}
                    alt={`${book.title} — Carlos Anaya Ruíz`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 224px"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex flex-wrap gap-2">
                    {book.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>

                  <h2 className="mb-1 text-2xl font-bold">{book.title}</h2>
                  <p className="mb-4 text-sm text-primary font-medium">{book.subtitle}</p>
                  <p className="mb-4 text-sm text-muted-foreground">{book.description}</p>

                  <div className="mb-4 rounded-lg border bg-muted/30 p-4">
                    <p className="mb-1 text-sm font-semibold">{t('audience')}</p>
                    <p className="text-sm text-muted-foreground">{book.audience}</p>
                  </div>

                  <div className="mt-auto flex flex-wrap items-center gap-4">
                    <span className="text-xl font-bold text-primary">{book.price}</span>
                    {book.pages && (
                      <span className="text-sm text-muted-foreground">{book.pages} {t('pages')}</span>
                    )}
                  </div>

                  <div className="mt-4">
                    <Button asChild className="gap-2">
                      <a href={book.purchaseUrl} target="_blank" rel="noopener noreferrer">
                        {t('buy')}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {books.length <= 1 && (
          <div className="mt-12 rounded-lg border bg-card p-8 text-center">
            <p className="text-muted-foreground">{t('comingSoon')}</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 rounded-lg border bg-card p-8 text-center">
          <h2 className="mb-2 text-xl font-semibold">
            {locale === 'en' ? 'Need a custom solution?' : '¿Necesitas una solución a medida?'}
          </h2>
          <p className="mb-6 text-muted-foreground">
            {locale === 'en'
              ? 'Beyond books, I offer consulting and development services.'
              : 'Más allá de los libros, ofrezco servicios de consultoría y desarrollo.'}
          </p>
          <Button variant="outline" asChild className="gap-2">
            <Link href="/contacto">
              {locale === 'en' ? 'Contact me' : 'Contáctame'}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
