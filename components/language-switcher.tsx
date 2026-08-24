'use client'

import type { ComponentProps } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { Link, usePathname } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Locale } from '@/data/types'

/**
 * Cambio de idioma del header.
 *
 * Se renderiza como un <a href> de verdad (vía `Link` + `locale`), no como un
 * botón que llame a router.replace. Tres razones que importan en un sitio cuyo
 * tema es el SEO técnico:
 *
 *  1. La URL del otro idioma queda rastreable dentro de la página, lo que
 *     refuerza el par recíproco de hreflang en lugar de depender solo del
 *     <head>.
 *  2. Clic central, ⌘-clic y "abrir en pestaña nueva" funcionan, algo que en un
 *     botón es imposible.
 *  3. Sigue navegando sin recarga completa, porque `Link` es el envoltorio de
 *     next/link que entiende de locales.
 *
 * `usePathname` devuelve el pathname INTERNO (el español), así que devolvérselo
 * a `Link` con el locale opuesto resuelve al segmento localizado de ese locale:
 * /es/servicios ⇄ /en/services.
 */

/** El único pathname con parámetro del sitio. */
const PROJECT_ROUTE = '/proyectos/[slug]'

/**
 * El artículo del blog es la otra ruta dinámica, y se trata distinto a
 * propósito: el blog existe SOLO en español, así que cambiar de idioma
 * estando en un artículo no puede llevar a una traducción que no existe. El
 * destino es el índice del blog, que sí está en los dos.
 */
const POST_ROUTE = '/blog/[slug]'

type LinkHref = ComponentProps<typeof Link>['href']

export function LanguageSwitcher() {
  const locale = useLocale() as Locale
  const t = useTranslations('language')
  const pathname = usePathname()
  const params = useParams<{ slug?: string }>()

  const targetLocale = locale === 'es' ? 'en' : 'es'

  /**
   * ⚠ En una ruta dinámica `usePathname` devuelve la PLANTILLA, no la ruta
   * resuelta: en /en/projects/aurascope regresa '/proyectos/[slug]'. Pasar eso
   * como string suelto produciría un href con los corchetes literales — un
   * enlace roto en cada ficha de proyecto. El slug se vuelve a inyectar desde
   * `useParams`, que es donde sí está.
   */
  const href: LinkHref =
    pathname === PROJECT_ROUTE && params.slug
      ? { pathname: PROJECT_ROUTE, params: { slug: params.slug } }
      : // Si la plantilla llegara sin slug (imposible en una ruta que siempre
        // lo trae, pero el tipo lo permite), el destino es el hub y no una URL
        // con corchetes.
        pathname === PROJECT_ROUTE
        ? '/proyectos'
        : // Un artículo no tiene versión en inglés: el destino es el índice.
          pathname === POST_ROUTE
          ? '/blog'
          : pathname

  return (
    // El padding y el gap se aprietan solo por debajo de sm, donde la
    // etiqueta es "EN"/"ES" y no el nombre del idioma: ahi el control medía
    // 71px de los 320 utiles de la barra a 360px. Desde sm vuelve al espaciado
    // normal, porque ya hay sitio y un control de 64px se siente apretado.
    <Button
      asChild
      variant="ghost"
      size="sm"
      className="gap-1.5 px-2.5 text-sm font-medium sm:gap-2 sm:px-3"
    >
      <Link
        href={href}
        locale={targetLocale}
        // La etiqueta visible es un nombre de idioma, que por sí solo no dice
        // qué va a pasar; el nombre accesible enuncia la acción.
        aria-label={`${t('label')}: ${t('switchTo')}`}
        // Decirle al crawler qué hay del otro lado de este enlace.
        hrefLang={targetLocale}
      >
        {/* Iba un globo de lucide delante del nombre del idioma, y con él
            venía `lucide-react` a un componente de CLIENTE montado en las
            quince páginas. No se sustituyó por nada, y es la decisión: las dos
            líneas de abajo ya resuelven los dos anchos —el nombre completo en
            escritorio, el código de dos letras en móvil— así que el icono solo
            repetía lo que la etiqueta de al lado ya decía. */}
        <span className="hidden sm:inline">{t('switchTo')}</span>
        <span className="sm:hidden">{targetLocale.toUpperCase()}</span>
      </Link>
    </Button>
  )
}
