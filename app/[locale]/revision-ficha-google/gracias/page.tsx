import type { Metadata } from 'next'
import { routing } from '@/i18n/routing'
import { hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Rail } from '@/components/instrument/rail'
import { getReviewCopy, REVISION_GUIA_SLUG } from '@/data/revision-ficha'
import { getPostBySlug, isPublished } from '@/lib/blog'
import { NAP } from '@/lib/constants'
import { generatePageMetadata } from '@/lib/seo'
import { Locale } from '@/data/types'

/**
 * ════════════════════════════════════════════════════════════════
 * EL ACUSE DE LA REVISIÓN DE FICHA
 *
 * `noindex, nofollow` y fuera del sitemap y de llms.txt: es la página a la
 * que se llega DESPUÉS de un envío correcto, y es la URL que mide la
 * conversión. Indexada, cualquiera aterrizaría en un «recibí tu solicitud»
 * sin haber mandado nada.
 *
 * No lleva el nombre ni el negocio de quien escribió: ver el comentario de
 * `components/sections/review-form.tsx`.
 *
 * `revalidate` por la misma razón que la página de la oferta: el enlace a la
 * guía solo aparece cuando el artículo ya salió.
 * ════════════════════════════════════════════════════════════════
 */
export const revalidate = 900

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  const copy = getReviewCopy(locale as Locale)

  return generatePageMetadata({
    locale: locale as Locale,
    route: 'revisionFichaGracias',
    title: copy.thanks.metaTitle,
    description: copy.thanks.body,
    noIndex: true,
  })
}

export default async function RevisionFichaGraciasPage({ params }: Props) {
  const { locale: rawLocale } = await params
  if (!hasLocale(routing.locales, rawLocale)) notFound()
  setRequestLocale(rawLocale)

  const locale = rawLocale as Locale
  const copy = getReviewCopy(locale)

  const guia = getPostBySlug(REVISION_GUIA_SLUG)
  const guiaPublicada = guia && isPublished(guia) ? guia : undefined

  return (
    <div
      className="grid"
      style={{ gridTemplateColumns: 'var(--tape-w) minmax(0,1fr)' }}
    >
      <Rail />

      <div className="min-w-0">
        <section className="hero-in px-5 pt-16 pb-24 sm:px-10">
          <p className="stamp">{copy.h1}</p>

          <h1 className="mt-6 max-w-[18ch] text-hero text-ink">
            {copy.thanks.title}
          </h1>

          <p className="mt-10 max-w-[46ch] font-human text-lead text-ink-muted">
            {copy.thanks.body}
          </p>

          <div className="mt-14 max-w-[54rem]">
            <p className="band text-ink-muted">{copy.social}</p>
            <p className="band text-ink-muted">
              {copy.doubts}{' '}
              <a
                href={`mailto:${NAP.email}`}
                className="link-stylus inline-flex min-h-11 items-center [overflow-wrap:anywhere]"
              >
                {NAP.email}
              </a>
            </p>
          </div>

          {guiaPublicada ? (
            <p className="mt-12">
              <span className="stamp block">{copy.guide}</span>
              <Link
                href={{
                  pathname: '/blog/[slug]',
                  params: { slug: guiaPublicada.slug },
                }}
                locale="es"
                hrefLang="es"
                className="link-stylus mt-3 inline-flex min-h-11 items-center"
              >
                {guiaPublicada.title} →
              </Link>
            </p>
          ) : null}
        </section>
      </div>
    </div>
  )
}
