'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import {
  ArrowRight,
  BarChart3,
  Bot,
  ChevronDown,
  Globe,
  Menu,
  Search,
  X,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/language-switcher'
import type { Pathname } from '@/i18n/routing'

/**
 * Los ids de los paneles son constantes, no valores de useId(): hay exactamente
 * un header por documento, y un id estable mantiene `aria-controls` apuntando al
 * mismo nodo entre renders y entre el markup del servidor y el del cliente.
 */
const SERVICES_PANEL_ID = 'header-services-menu'
const MOBILE_PANEL_ID = 'header-mobile-menu'

/** Todo lo que la trampa de foco tiene que considerar dentro del panel móvil. */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'

interface NavItem {
  href: Pathname
  /** Clave dentro del namespace `nav`. */
  key: 'about' | 'books' | 'contact'
}

interface ServiceItem {
  href: Pathname
  /** Clave del namespace `footer` — ahí viven las etiquetas cortas de servicio. */
  key: 'seoTecnico' | 'desarrolloWeb' | 'automatizacionIA' | 'dashboardsLabel'
  icon: LucideIcon
}

/** Inicio va primero, luego el grupo de servicios, luego estos. */
const NAV_ITEMS: readonly NavItem[] = [
  { href: '/sobre-mi', key: 'about' },
  { href: '/libros', key: 'books' },
  { href: '/contacto', key: 'contact' },
]

/** Los mismos íconos que asigna data/services.ts, para que el mapeo se reconozca. */
const SERVICE_ITEMS: readonly ServiceItem[] = [
  { href: '/seo-tecnico', key: 'seoTecnico', icon: Search },
  { href: '/desarrollo-web', key: 'desarrolloWeb', icon: Globe },
  { href: '/automatizacion-ia', key: 'automatizacionIA', icon: Bot },
  { href: '/dashboards', key: 'dashboardsLabel', icon: BarChart3 },
]

const SERVICE_HREFS: readonly Pathname[] = SERVICE_ITEMS.map((item) => item.href)

/**
 * Fila de navegación de escritorio: 44px de alto, así cada objetivo cumple el
 * piso táctil. `group` habilita el subrayado de gradiente que entra en hover.
 */
const NAV_LINK =
  'group relative inline-flex h-11 items-center px-3 text-sm transition-colors'

export function Header() {
  const pathname = usePathname()
  const locale = useLocale()
  const en = locale === 'en'

  const t = useTranslations('nav')
  const tf = useTranslations('footer')
  const ts = useTranslations('services')
  const ta = useTranslations('a11y')

  const [servicesOpen, setServicesOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const servicesWrapRef = useRef<HTMLDivElement>(null)
  const servicesPanelRef = useRef<HTMLDivElement>(null)
  const servicesToggleRef = useRef<HTMLButtonElement>(null)
  const menuPanelRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const inServices =
    pathname === '/servicios' || SERVICE_HREFS.includes(pathname as Pathname)

  /** Cerrar y devolver el foco — el contrato de un menú que se descarta. */
  const closeServices = useCallback((returnFocus: boolean) => {
    setServicesOpen(false)
    if (returnFocus) servicesToggleRef.current?.focus()
  }, [])

  const closeMenu = useCallback((returnFocus: boolean) => {
    setMenuOpen(false)
    if (returnFocus) menuButtonRef.current?.focus()
  }, [])

  // Una navegación del lado del cliente no debe dejar un panel abierto encima de
  // la página nueva — incluida una vuelta Atrás/Adelante que ningún handler de
  // clic ve. Se reinicia durante el render (la alternativa que React documenta
  // frente a un setState dentro de un efecto) para que la página nueva nunca
  // pinte con el menú viejo encima. Sin devolver el foco: ahora el destino manda.
  const [renderedPathname, setRenderedPathname] = useState(pathname)
  if (pathname !== renderedPathname) {
    setRenderedPathname(pathname)
    if (servicesOpen) setServicesOpen(false)
    if (menuOpen) setMenuOpen(false)
  }

  // Escape descarta la superficie abierta más interna y devuelve el foco a su
  // disparador. Las dos cosas son requisitos de WCAG 2.2.
  useEffect(() => {
    if (!servicesOpen && !menuOpen) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      if (servicesOpen) {
        closeServices(true)
        return
      }
      closeMenu(true)
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [servicesOpen, menuOpen, closeServices, closeMenu])

  // Un clic fuera cierra el desplegable. El foco se queda donde lo dejó el
  // puntero: nunca lo jalamos de vuelta a un disparador del que el usuario
  // acaba de irse.
  useEffect(() => {
    if (!servicesOpen) return

    function onPointerDown(event: PointerEvent) {
      if (!servicesWrapRef.current?.contains(event.target as Node)) {
        setServicesOpen(false)
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [servicesOpen])

  // Al abrir, el foco se mueve al primer elemento: quien navega con teclado cae
  // dentro del menú en lugar de tener que tabular hasta él.
  useEffect(() => {
    if (!servicesOpen) return
    servicesPanelRef.current?.querySelector<HTMLElement>('a[href]')?.focus()
  }, [servicesOpen])

  // Trampa de foco del panel móvil. El listener vive en el documento, no en el
  // panel, así el foco se recupera incluso cuando ya se escapó; quitarlo al
  // cerrar es lo que libera la trampa en lugar de dejarla armada.
  useEffect(() => {
    if (!menuOpen) return
    const panel = menuPanelRef.current
    if (!panel) return

    /** Enfocables visibles dentro del panel, en orden del DOM. */
    const panelItems = () =>
      Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (element) => element.offsetParent !== null
      )

    /**
     * El ciclo incluye al disparador, que en el DOM está justo antes del panel.
     * Atrapar solo el panel dejaría el botón de cerrar fuera del alcance del
     * teclado y Escape sería la única salida.
     */
    const cycle = () => {
      const trigger = menuButtonRef.current
      return trigger ? [trigger, ...panelItems()] : panelItems()
    }

    // Aterriza dentro del panel, no de vuelta en el disparador recién pulsado.
    panelItems()[0]?.focus()

    // Función flecha, no declaración: un `function` izado pierde el estrechado
    // a no-nulo de `panel` que estableció la guarda de arriba.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const items = cycle()
      if (items.length === 0) return

      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement

      // El foco ya salió de la trampa (chrome del navegador, un clic fuera):
      // lo traemos al borde más cercano en lugar de dejarlo vagar.
      if (!items.some((item) => item === active)) {
        event.preventDefault()
        const target = event.shiftKey ? last : first
        target.focus()
        return
      }
      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
        return
      }
      if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  /** Tabular más allá del último ítem cierra el menú en vez de dejarlo huérfano. */
  const handleServicesBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!servicesOpen) return
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setServicesOpen(false)
    }
  }

  const isCurrent = (href: Pathname) => pathname === href

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-ground/85 backdrop-blur-xl">
      {/* La línea de gradiente del borde inferior. Dos píxeles que hacen que el
          chrome se lea como parte del sistema y no como una barra prestada.
          Va absoluta sobre el borde, así que no ocupa alto ni mueve el layout. */}
      <span
        aria-hidden="true"
        className="grad-fill pointer-events-none absolute inset-x-0 bottom-0 h-0.5 opacity-80"
      />

      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="flex h-16 items-center justify-between gap-3 sm:h-18 sm:gap-4">
          {/* ══ WORDMARK ═══════════════════════════════════════════
              La marca es un cuadro con el gradiente firma y las iniciales.
              Al hover solo escala: transform, cero riesgo de CLS. */}
          <Link
            href="/"
            className="group inline-flex h-11 items-center gap-2.5 text-ink"
          >
            <span
              aria-hidden="true"
              className="grad-fill grid size-8 place-items-center rounded-xl font-display text-[0.8125rem] font-bold shadow-glow-brand transition-transform duration-300 group-hover:scale-110 sm:size-9 sm:text-sm"
            >
              CA
            </span>
            <span className="font-display text-lg font-bold tracking-tight transition-colors group-hover:text-brand-strong sm:text-xl">
              Carlos Anaya Ruiz
            </span>
          </Link>

          {/* ══ NAV DE ESCRITORIO ══════════════════════════════════ */}
          <nav aria-label={ta('mainNav')} className="hidden items-center lg:flex">
            <Link
              href="/"
              aria-current={isCurrent('/') ? 'page' : undefined}
              className={cn(
                NAV_LINK,
                isCurrent('/')
                  ? 'font-semibold text-ink'
                  : 'text-ink-muted hover:text-ink'
              )}
            >
              {t('home')}
              <NavUnderline active={isCurrent('/')} />
            </Link>

            {/* La etiqueta del hub es un enlace normal y el chevron de al lado es
                lo único que abre el menú. Así /servicios es rastreable y se
                alcanza sin abrir ningún popup, y quien usa touch no queda
                atrapado alternando un menú cuando lo que quería era la página. */}
            <div
              ref={servicesWrapRef}
              className="relative flex items-center"
              onBlur={handleServicesBlur}
            >
              <Link
                href="/servicios"
                aria-current={isCurrent('/servicios') ? 'page' : undefined}
                className={cn(
                  NAV_LINK,
                  'pr-1',
                  inServices
                    ? 'font-semibold text-ink'
                    : 'text-ink-muted hover:text-ink'
                )}
              >
                {t('services')}
                <NavUnderline active={inServices} className="right-1" />
              </Link>

              <button
                ref={servicesToggleRef}
                type="button"
                onClick={() =>
                  servicesOpen ? closeServices(false) : setServicesOpen(true)
                }
                aria-expanded={servicesOpen}
                aria-controls={SERVICES_PANEL_ID}
                aria-label={`${t('services')}: ${en ? 'open submenu' : 'abrir submenú'}`}
                className={cn(
                  'inline-flex size-11 items-center justify-center rounded-xl text-ink-subtle transition-colors hover:bg-brand-wash hover:text-brand-strong',
                  servicesOpen && 'bg-brand-wash text-brand-strong'
                )}
              >
                <ChevronDown
                  className={cn(
                    'size-4 transition-transform duration-300',
                    servicesOpen && 'rotate-180'
                  )}
                  aria-hidden="true"
                />
              </button>

              {/* Se alterna con el atributo `hidden` en lugar de montarse a
                  demanda, así los cuatro enlaces de servicio están en el HTML
                  del servidor y un crawler los sigue sin ejecutar nada. */}
              <div
                ref={servicesPanelRef}
                id={SERVICES_PANEL_ID}
                hidden={!servicesOpen}
                className="enter-scale absolute left-0 top-full mt-2 w-[19rem] rounded-2xl border border-hairline bg-surface p-2 shadow-lift-3"
              >
                <ul>
                  {SERVICE_ITEMS.map((item) => {
                    const Icon = item.icon
                    return (
                      <li key={item.key}>
                        <Link
                          href={item.href}
                          onClick={() => setServicesOpen(false)}
                          aria-current={isCurrent(item.href) ? 'page' : undefined}
                          className={cn(
                            'group/item flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm transition-colors hover:bg-ground-tint hover:text-ink',
                            isCurrent(item.href)
                              ? 'bg-brand-wash font-semibold text-ink'
                              : 'text-ink-muted'
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className="grid size-8 shrink-0 place-items-center rounded-lg bg-violet-wash text-violet transition-transform duration-300 group-hover/item:scale-110"
                          >
                            <Icon className="size-4" />
                          </span>
                          {tf(item.key)}
                        </Link>
                      </li>
                    )
                  })}
                </ul>

                <div className="mt-2 border-t border-hairline pt-2">
                  <Link
                    href="/servicios"
                    onClick={() => setServicesOpen(false)}
                    className="group/all flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-brand-strong transition-colors hover:bg-brand-wash"
                  >
                    {ts('allServices')}
                    <ArrowRight
                      className="size-4 transition-transform duration-300 group-hover/all:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </div>
            </div>

            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                aria-current={isCurrent(item.href) ? 'page' : undefined}
                className={cn(
                  NAV_LINK,
                  isCurrent(item.href)
                    ? 'font-semibold text-ink'
                    : 'text-ink-muted hover:text-ink'
                )}
              >
                {t(item.key)}
                <NavUnderline active={isCurrent(item.href)} />
              </Link>
            ))}
          </nav>

          {/* ══ UTILIDADES + CTA ═══════════════════════════════════ */}
          <div className="flex items-center gap-1 sm:gap-2">
            <LanguageSwitcher />

            {/* El clic de mayor intención se queda en el dominio. Fiverr es un
                enlace de pie de página, nada más. */}
            <Button
              asChild
              className="sheen hidden shadow-glow-brand sm:inline-flex"
            >
              <Link href="/contacto">
                {t('hireMe')}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => (menuOpen ? closeMenu(false) : setMenuOpen(true))}
              aria-expanded={menuOpen}
              aria-controls={MOBILE_PANEL_ID}
              aria-label={menuOpen ? t('closeMenu') : t('openMenu')}
              className={cn(
                'inline-flex size-11 items-center justify-center rounded-xl text-ink-muted transition-colors hover:bg-brand-wash hover:text-brand-strong lg:hidden',
                menuOpen && 'bg-brand-wash text-brand-strong'
              )}
            >
              {menuOpen ? (
                <X className="size-5" aria-hidden="true" />
              ) : (
                <Menu className="size-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ══ PANEL MÓVIL ══════════════════════════════════════════════
          Alto acotado con overflow propio: en un teléfono en horizontal el menú
          hace scroll dentro de sí mismo en lugar de empujar la página. */}
      <div
        ref={menuPanelRef}
        id={MOBILE_PANEL_ID}
        hidden={!menuOpen}
        className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-hairline bg-ground shadow-lift-2 lg:hidden"
      >
        <nav
          aria-label={ta('mobileMenu')}
          className="enter mx-auto w-full max-w-6xl px-5 py-4 sm:px-8"
        >
          {/* Filas con divisores finos, el mismo vocabulario de las listas de
              las páginas: nada de una pila de píldoras. */}
          <ul>
            <li className="border-b border-hairline">
              <MobileLink
                href="/"
                label={t('home')}
                current={isCurrent('/')}
                onNavigate={() => setMenuOpen(false)}
              />
            </li>

            <li className="border-b border-hairline">
              <MobileLink
                href="/servicios"
                label={t('services')}
                current={isCurrent('/servicios')}
                onNavigate={() => setMenuOpen(false)}
              />
              <ul className="pb-3 pl-1">
                {SERVICE_ITEMS.map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.key}>
                      <Link
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        aria-current={isCurrent(item.href) ? 'page' : undefined}
                        className={cn(
                          'flex min-h-11 items-center gap-3 rounded-xl px-2 text-sm transition-colors',
                          isCurrent(item.href)
                            ? 'bg-brand-wash font-semibold text-ink'
                            : 'text-ink-muted'
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className="grid size-8 shrink-0 place-items-center rounded-lg bg-violet-wash text-violet"
                        >
                          <Icon className="size-4" />
                        </span>
                        {tf(item.key)}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>

            {NAV_ITEMS.map((item) => (
              <li key={item.key} className="border-b border-hairline">
                <MobileLink
                  href={item.href}
                  label={t(item.key)}
                  current={isCurrent(item.href)}
                  onNavigate={() => setMenuOpen(false)}
                />
              </li>
            ))}
          </ul>

          <Button
            asChild
            size="lg"
            className="sheen mt-6 w-full shadow-glow-brand"
          >
            <Link href="/contacto" onClick={() => setMenuOpen(false)}>
              {t('hireMe')}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}

/**
 * El subrayado de gradiente del nav de escritorio. Sirve para dos estados con un
 * solo nodo: fijo en el enlace activo, y entrando desde la izquierda en hover
 * para los demás. Solo anima `transform`, así que no toca el layout.
 */
function NavUnderline({
  active,
  className,
}: {
  active: boolean
  className?: string
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'grad-fill pointer-events-none absolute inset-x-3 bottom-1.5 h-0.5 origin-left rounded-full transition-transform duration-300',
        active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
        className
      )}
    />
  )
}

function MobileLink({
  href,
  label,
  current,
  onNavigate,
}: {
  href: Pathname
  label: string
  current: boolean
  onNavigate: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={current ? 'page' : undefined}
      className={cn(
        'flex min-h-12 items-center justify-between gap-3 text-base transition-colors',
        current ? 'font-semibold text-ink' : 'text-ink-muted hover:text-ink'
      )}
    >
      {label}
      {current && (
        <span
          aria-hidden="true"
          className="grad-fill h-1 w-6 shrink-0 rounded-full"
        />
      )}
    </Link>
  )
}
