import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Pathname } from '@/i18n/routing'

export interface BreadcrumbItem {
  label: string
  /**
   * Pathname interno (en español) de la tabla de rutas — el segmento localizado
   * lo resuelve `Link`. Se omite en el último item, que es la página actual.
   */
  href?: Pathname
}

export interface BreadcrumbsProps {
  /**
   * La ruta *debajo* de Inicio. La miga de Inicio la renderiza este componente,
   * así que no la pases.
   *
   * Lo que se pase aquí tiene que reflejar el arreglo BreadcrumbList que recibe
   * el generador de schema para la misma página: una ruta visible que contradice
   * al markup es peor que no tener markup.
   */
  items: BreadcrumbItem[]
  className?: string
}

/**
 * Migas de pan — visibles, clicables y coincidiendo con el BreadcrumbList JSON-LD.
 *
 * Server component. La maquetación queda del lado de quien lo usa (no renderiza
 * contenedor), así que entra en cualquier cascarón de página.
 */
export async function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const t = await getTranslations('breadcrumbs')
  const ta = await getTranslations('a11y')

  return (
    <nav aria-label={ta('breadcrumb')} className={cn('text-sm', className)}>
      <ol className="flex flex-wrap items-center gap-x-1 gap-y-1">
        <li className="flex items-center">
          <Link
            href="/"
            className="inline-flex size-9 items-center justify-center rounded-lg text-ink-subtle transition-colors hover:bg-brand-wash hover:text-brand-strong"
          >
            <Home className="size-4" aria-hidden="true" />
            <span className="sr-only">{t('home')}</span>
          </Link>
        </li>

        {items.map((item, index) => {
          // La última miga es la página actual: nunca es enlace, ni siquiera si
          // quien llama pasa un href por error.
          const isLast = index === items.length - 1

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-x-1">
              {/* El separador es decorativo y va en el tono más tenue de tinta:
                  la jerarquía la marcan las etiquetas, no el chevron. */}
              <ChevronRight
                className="size-3.5 shrink-0 text-ink-subtle/60"
                aria-hidden="true"
              />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="inline-flex min-h-9 items-center rounded-md px-1 text-ink-muted transition-colors hover:text-brand-strong"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current="page"
                  className="inline-flex min-h-9 items-center px-1 font-semibold text-ink"
                >
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
