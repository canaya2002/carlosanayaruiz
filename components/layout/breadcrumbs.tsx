import { Link } from '@/i18n/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { useTranslations } from 'next-intl'

export interface BreadcrumbItem {
  label: string
  href?:
    | '/'
    | '/libros'
    | '/sobre-mi'
    | '/contacto'
    | '/seo-tecnico'
    | '/desarrollo-web'
    | '/automatizacion-ia'
    | '/dashboards'
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const t = useTranslations('breadcrumbs')

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <li>
          <Link href="/" className="flex items-center transition-colors hover:text-primary">
            <Home className="h-4 w-4" />
            <span className="sr-only">{t('home')}</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1">
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            {item.href ? (
              <Link href={item.href} className="transition-colors hover:text-primary">
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground" aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
