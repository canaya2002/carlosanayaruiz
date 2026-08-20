import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { StaticPathname } from '@/i18n/routing'

export interface BreadcrumbItem {
  label: string
  /**
   * Pathname interno (en español) de la tabla de rutas — el segmento localizado
   * lo resuelve `Link`. Se omite en el último item, que es la página actual.
   */
  href?: StaticPathname
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
 * ── POR QUÉ SON UNA PÍLDORA DE CRISTAL Y NO TEXTO SUELTO ──
 * Todas las cabeceras interiores del sitio son secciones con aurora detrás, y
 * ahí el texto suelto tenía dos problemas a la vez. El estético: una fila de
 * texto gris sobre un fondo de color se lee como algo que se olvidaron de
 * maquetar. Y el medido: sobre el campo azul de la aurora a plena intensidad,
 * `--ink-muted` cae a 3.83:1 y `--ink-subtle` a 3.23:1 — las dos por debajo de
 * 4.5. Metiendo la fila en cristal al 74% los mismos tokens suben a 5.39 y 4.54,
 * y contra el peor solape de campos (#53c2f0) a 5.03 y 4.24. La píldora no es
 * decoración: es lo que hace legal el color del texto. Por eso el cristal es el
 * FUERTE (74%) y no el de 62%, y por eso no queda un solo `ink-subtle` con
 * significado dentro — los chevrones sí, que son decorativos y `aria-hidden`.
 *
 * ── POR QUÉ NO USA LA CLASE `.glass` ──
 * Por lo mismo que el header: `.glass` fija `border-radius: var(--radius-2xl)`
 * y está escrita fuera de toda `@layer`, así que ninguna utilidad de Tailwind
 * puede devolverle la forma de píldora. Aquí el cristal se compone a mano con
 * los mismos tokens `--glass-*`, que siguen viviendo en un solo lugar.
 *
 * Server component. La maquetación queda del lado de quien lo usa (no renderiza
 * contenedor), así que entra en cualquier cascarón de página.
 */
export async function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const t = await getTranslations('breadcrumbs')
  const ta = await getTranslations('a11y')

  return (
    <nav
      aria-label={ta('breadcrumb')}
      className={cn(
        // `inline-flex` y no `flex`: una píldora que abarca todo el ancho de la
        // página no es una píldora. `max-w-full` para que en un teléfono la
        // fila se envuelva dentro del cristal en lugar de desbordarlo.
        //
        // Sin `.sheen`, y a propósito: esa clase trae `overflow: hidden`, y el
        // anillo de foco de :focus-visible se dibuja 2px por FUERA de cada
        // miga. Dentro de una píldora con 6px de padding, el recorte se comería
        // el anillo del enlace de Inicio. Un barrido especular no vale un foco
        // invisible.
        'glass-spec relative inline-flex max-w-full items-center text-sm',
        // El cristal, en tokens. El desenfoque y la saturación se leen de
        // `--glass-blur` y `--glass-sat`, que ya bajan a 16px/150% por debajo
        // de 640px: un solo lugar donde ajustarlo.
        'rounded-full border border-[color:var(--glass-border)] px-1.5 py-1',
        'bg-surface/90 supports-[backdrop-filter]:bg-[color:var(--glass-bg-strong)]',
        'backdrop-blur-[var(--glass-blur)] backdrop-saturate-[var(--glass-sat)]',
        // Reflejo interior arriba + sombra de tercer nivel: el canto se ve
        // pulido y la píldora flota sobre la aurora en lugar de estar pegada.
        'shadow-[inset_0_1px_0_0_var(--glass-highlight),var(--lift-2)]',
        className
      )}
    >
      {/* `relative` no es decorativo: el reflejo de `.glass-spec` es un ::before
          absoluto y solo los hijos posicionados se pintan encima. Sin esto, un
          blanco al 55% caería sobre las etiquetas. */}
      <ol className="relative flex flex-wrap items-center gap-x-0.5 gap-y-1">
        <li className="flex items-center">
          <Link
            href="/"
            // `text-ink-muted` y no `text-ink-subtle`: detrás de la píldora
            // puede haber dos o tres campos de aurora solapados, y sobre ese
            // peor caso ink-subtle se queda en 4.24 incluso a través del
            // cristal fuerte. ink-muted mide 5.03 ahí.
            className="press inline-flex size-9 items-center justify-center rounded-full text-ink-muted hover:bg-brand-wash hover:text-brand-strong"
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
            <li key={`${item.label}-${index}`} className="flex items-center">
              {/* El separador es decorativo y va en el tono más tenue de tinta:
                  la jerarquía la marcan las etiquetas, no el chevron. */}
              <ChevronRight
                className="size-3.5 shrink-0 text-ink-subtle/60"
                aria-hidden="true"
              />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="press inline-flex min-h-9 items-center rounded-full px-2.5 text-ink-muted hover:bg-brand-wash hover:text-brand-strong"
                >
                  {item.label}
                </Link>
              ) : (
                // La página actual también es una píldora, pero rellena: es la
                // única miga que no se puede pulsar, así que se distingue por
                // superficie y no solo por el peso de la tipografía.
                <span
                  aria-current="page"
                  className="inline-flex min-h-9 items-center gap-2 rounded-full bg-brand-wash px-2.5 font-semibold text-ink shadow-[inset_0_0_0_1px_var(--glass-edge)]"
                >
                  <span
                    aria-hidden="true"
                    className="grad-fill size-1.5 shrink-0 rounded-full"
                  />
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
