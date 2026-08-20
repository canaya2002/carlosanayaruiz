'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bot,
  ChevronDown,
  FileText,
  FolderKanban,
  Globe,
  Menu,
  Search,
  Trophy,
  X,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/language-switcher'
import type { Pathname, StaticPathname } from '@/i18n/routing'

/**
 * Los ids de los paneles son constantes, no valores de useId(): hay exactamente
 * un header por documento, y un id estable mantiene `aria-controls` apuntando al
 * mismo nodo entre renders y entre el markup del servidor y el del cliente.
 */
const PANEL_IDS = {
  services: 'header-services-menu',
  trajectory: 'header-trajectory-menu',
} as const

const MOBILE_PANEL_ID = 'header-mobile-menu'

/** Todo lo que la trampa de foco tiene que considerar dentro del panel móvil. */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Los dos grupos desplegables del nav. Un solo estado `openGroup` en el header
 * los coordina, así abrir uno cierra el otro; cada uno se descarta a sí mismo
 * (Escape, clic fuera, tabular hacia afuera) desde dentro de `NavDropdown`.
 */
type GroupId = keyof typeof PANEL_IDS

interface NavItem {
  href: StaticPathname
  /** Clave dentro del namespace `nav`. */
  key: 'about' | 'books' | 'contact'
}

interface GroupSource {
  href: StaticPathname
  /** Clave de traducción; el namespace lo decide el grupo que la consume. */
  key: string
  icon: LucideIcon
}

/** Inicio va primero, luego los dos grupos, luego estos. */
const NAV_ITEMS: readonly NavItem[] = [
  { href: '/sobre-mi', key: 'about' },
  { href: '/libros', key: 'books' },
  { href: '/contacto', key: 'contact' },
]

/** Los mismos íconos que asigna data/services.ts, para que el mapeo se reconozca. */
const SERVICE_ITEMS: readonly GroupSource[] = [
  { href: '/seo-tecnico', key: 'seoTecnico', icon: Search },
  { href: '/desarrollo-web', key: 'desarrolloWeb', icon: Globe },
  { href: '/automatizacion-ia', key: 'automatizacionIA', icon: Bot },
  { href: '/dashboards', key: 'dashboardsLabel', icon: BarChart3 },
]

/**
 * Trayectoria. Cuatro páginas que por separado no justifican un lugar en la
 * barra, y juntas sí: son la prueba del trabajo.
 *
 * `/proyectos` aparece dos veces a propósito — es el hub al que enlaza la
 * etiqueta del grupo y también el primer ítem de la lista. Un hub que solo
 * existe detrás de un menú es un hub que ningún crawler sigue.
 */
const TRAJECTORY_ITEMS: readonly GroupSource[] = [
  { href: '/proyectos', key: 'projects', icon: FolderKanban },
  { href: '/premios', key: 'awards', icon: Trophy },
  { href: '/certificaciones', key: 'certifications', icon: BadgeCheck },
  { href: '/cv', key: 'cv', icon: FileText },
]

/**
 * Las listas planas contra las que se decide si la página actual pertenece a un
 * grupo. Van tipadas como `Pathname` y no `StaticPathname` porque lo que se
 * compara contra ellas es lo que devuelve `usePathname`, que sí incluye la
 * plantilla '/proyectos/[slug]'.
 */
const SERVICE_HREFS: readonly Pathname[] = SERVICE_ITEMS.map(
  (item) => item.href
)
const TRAJECTORY_HREFS: readonly Pathname[] = TRAJECTORY_ITEMS.map(
  (item) => item.href
)

/**
 * Fila de navegación de escritorio: 44px de alto, así cada objetivo cumple el
 * piso táctil. `group` habilita el subrayado de gradiente que entra en hover.
 */
const NAV_LINK =
  'group relative inline-flex h-11 items-center px-3 text-sm transition-colors'

interface GroupLink {
  href: StaticPathname
  label: string
  icon: LucideIcon
}

/** Todo lo que necesita pintar un grupo desplegable, sin nada de estado. */
interface NavGroupConfig {
  id: GroupId
  panelId: string
  /** El hub al que enlaza la etiqueta del grupo. */
  hub: StaticPathname
  label: string
  /** Verdadero cuando la página actual pertenece al grupo. */
  active: boolean
  items: readonly GroupLink[]
  /** Fila final opcional, tipo "Todos los servicios". */
  all?: { href: StaticPathname; label: string }
  /** Clases del cuadro del ícono: cada grupo tiene su matiz. */
  chip: string
  /** Ancho del panel; las etiquetas de trayectoria son más cortas. */
  width: string
}

export function Header() {
  const pathname = usePathname()

  const t = useTranslations('nav')
  const tf = useTranslations('footer')
  const ts = useTranslations('services')
  const ta = useTranslations('a11y')

  const [openGroup, setOpenGroup] = useState<GroupId | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const menuPanelRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const inServices =
    pathname === '/servicios' || SERVICE_HREFS.includes(pathname)

  // `startsWith` y no igualdad: la ficha de un proyecto (/proyectos/[slug])
  // también pertenece al grupo, y ahí `pathname` trae el slug real.
  const inTrajectory =
    TRAJECTORY_HREFS.includes(pathname) || pathname.startsWith('/proyectos')

  const groups: readonly NavGroupConfig[] = [
    {
      id: 'services',
      panelId: PANEL_IDS.services,
      hub: '/servicios',
      label: t('services'),
      active: inServices,
      items: SERVICE_ITEMS.map((item) => ({
        href: item.href,
        label: tf(item.key),
        icon: item.icon,
      })),
      all: { href: '/servicios', label: ts('allServices') },
      chip: 'bg-sky-wash text-sky-ink',
      width: 'w-[19rem]',
    },
    {
      id: 'trajectory',
      panelId: PANEL_IDS.trajectory,
      hub: '/proyectos',
      label: t('trajectory'),
      active: inTrajectory,
      items: TRAJECTORY_ITEMS.map((item) => ({
        href: item.href,
        label: t(item.key),
        icon: item.icon,
      })),
      // Sin fila "ver todo": el hub del grupo ya es /proyectos y "Proyectos" es
      // el primer ítem de la lista.
      chip: 'bg-cyan-wash text-cyan-ink',
      width: 'w-[16rem]',
    },
  ]

  /** Identidad estable: es dependencia de los efectos de cada desplegable. */
  const closeGroups = useCallback(() => setOpenGroup(null), [])

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
    if (openGroup) setOpenGroup(null)
    if (menuOpen) setMenuOpen(false)
  }

  // Escape descarta la superficie abierta más interna y devuelve el foco a su
  // disparador. Las dos cosas son requisitos de WCAG 2.2. Aquí solo se atiende
  // el panel móvil, y solo cuando no hay desplegable abierto: cada `NavDropdown`
  // escucha su propio Escape, así que la guarda `!openGroup` es lo que conserva
  // el orden — primero se cierra lo de adentro.
  useEffect(() => {
    if (!menuOpen || openGroup) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      closeMenu(true)
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen, openGroup, closeMenu])

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

  const isCurrent = (href: StaticPathname) => pathname === href

  return (
    // ══ LA BARRA ES DE CRISTAL ═══════════════════════════════════════════
    // Es el panel protagonista del sitio: se ve en todas las páginas, así que es
    // donde el presupuesto de `backdrop-filter` rinde más.
    //
    // Se construye con utilidades sobre los tokens --glass-*, NO con la clase
    // `.glass`, por dos razones concretas: `.glass` trae `border-radius` (una
    // barra pegada al borde superior no lleva esquinas) y trae `contain: paint`,
    // que recortaría los paneles desplegables — son absolutos que salen del alto
    // del header. Y `.glass` está escrita fuera de toda `@layer`, así que
    // ninguna utilidad podría revertir ninguna de las dos.
    //
    // El blur va a la mitad en móvil y completo desde sm, igual que hace
    // --glass-blur: ahí el fill-rate es la mitad y el efecto se nota igual. Si
    // el navegador no soporta backdrop-filter se queda `bg-surface/92`, casi
    // opaco, en lugar de un panel translúcido sin desenfoque detrás — que es
    // donde el texto dejaría de leerse.
    <header
      className={cn(
        'glass-spec sticky top-0 z-50 border-b border-hairline shadow-lift-1',
        'bg-surface/92 backdrop-blur-md backdrop-saturate-150 sm:backdrop-blur-xl',
        'supports-[backdrop-filter]:bg-[color:var(--glass-bg-strong)]'
      )}
    >
      {/* La línea de gradiente del borde inferior. Dos píxeles que hacen que el
          chrome se lea como parte del sistema y no como una barra prestada.
          Va absoluta sobre el borde, así que no ocupa alto ni mueve el layout. */}
      <span
        aria-hidden="true"
        className="grad-fill pointer-events-none absolute inset-x-0 bottom-0 h-0.5 opacity-80"
      />

      {/* `relative` no es decorativo: el reflejo especular de `.glass-spec` es un
          ::before absoluto, y solo los hijos posicionados se pintan encima de
          él. Sin esto, un blanco al 50% caería sobre el wordmark. */}
      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
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

            {groups.map((group) => (
              <NavDropdown
                key={group.id}
                group={group}
                open={openGroup === group.id}
                onOpen={() => setOpenGroup(group.id)}
                onClose={closeGroups}
                isCurrent={isCurrent}
                submenuLabel={ta('openSubmenu')}
              />
            ))}

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
          hace scroll dentro de sí mismo en lugar de empujar la página.

          Opaco y `relative` por lo mismo que el panel de escritorio: cuelga del
          header de cristal, así que ni se desenfoca otra vez ni se deja pintar
          por debajo del reflejo especular. */}
      <div
        ref={menuPanelRef}
        id={MOBILE_PANEL_ID}
        hidden={!menuOpen}
        className="relative max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-hairline bg-ground shadow-lift-2 lg:hidden"
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

            {/* Los dos grupos van desplegados siempre en móvil: no hay chevron
                que tocar, así que ningún enlace queda detrás de un gesto. */}
            {groups.map((group) => (
              <li key={group.id} className="border-b border-hairline">
                <MobileLink
                  href={group.hub}
                  label={group.label}
                  current={isCurrent(group.hub)}
                  onNavigate={() => setMenuOpen(false)}
                />
                <ul className="pb-3 pl-1">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          aria-current={
                            isCurrent(item.href) ? 'page' : undefined
                          }
                          className={cn(
                            'flex min-h-11 items-center gap-3 rounded-xl px-2 text-sm transition-colors',
                            isCurrent(item.href)
                              ? 'bg-brand-wash font-semibold text-ink'
                              : 'text-ink-muted'
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={cn(
                              'grid size-8 shrink-0 place-items-center rounded-lg',
                              group.chip
                            )}
                          >
                            <Icon className="size-4" />
                          </span>
                          {item.label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </li>
            ))}

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
 * Un grupo del nav de escritorio: etiqueta-enlace al hub + chevron que abre el
 * panel.
 *
 * Es su propio componente por una razón concreta: cada desplegable necesita tres
 * refs (envoltorio, panel, disparador) y las refs no pueden viajar dentro de una
 * lista construida en render — la regla `react-hooks/refs` lo marca, y con razón.
 * Aquí las refs nacen y mueren en el mismo componente que las usa, y el header
 * solo dice cuál está abierto.
 *
 * El estado abierto/cerrado sigue viviendo arriba (`openGroup`) para que abrir
 * uno cierre el otro.
 */
function NavDropdown({
  group,
  open,
  onOpen,
  onClose,
  isCurrent,
  submenuLabel,
}: {
  group: NavGroupConfig
  open: boolean
  onOpen: () => void
  onClose: () => void
  isCurrent: (href: StaticPathname) => boolean
  /** Sufijo del nombre accesible del chevron, ya traducido. */
  submenuLabel: string
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  // Escape cierra y devuelve el foco al disparador. Las dos cosas son requisitos
  // de WCAG 2.2.
  useEffect(() => {
    if (!open) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      onClose()
      toggleRef.current?.focus()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  // Un clic fuera cierra el desplegable. El foco se queda donde lo dejó el
  // puntero: nunca lo jalamos de vuelta a un disparador del que el usuario acaba
  // de irse.
  useEffect(() => {
    if (!open) return

    function onPointerDown(event: PointerEvent) {
      if (!wrapRef.current?.contains(event.target as Node)) onClose()
    }

    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open, onClose])

  // Al abrir, el foco se mueve al primer elemento: quien navega con teclado cae
  // dentro del menú en lugar de tener que tabular hasta él.
  useEffect(() => {
    if (!open) return
    panelRef.current?.querySelector<HTMLElement>('a[href]')?.focus()
  }, [open])

  /** Tabular más allá del último ítem cierra el menú en vez de dejarlo huérfano. */
  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!open) return
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      onClose()
    }
  }

  return (
    // La etiqueta del hub es un enlace normal y el chevron de al lado es lo único
    // que abre el menú. Así /servicios y /proyectos son rastreables y se alcanzan
    // sin abrir ningún popup, y quien usa touch no queda atrapado alternando un
    // menú cuando lo que quería era la página.
    <div
      ref={wrapRef}
      className="relative flex items-center"
      onBlur={handleBlur}
    >
      <Link
        href={group.hub}
        aria-current={isCurrent(group.hub) ? 'page' : undefined}
        className={cn(
          NAV_LINK,
          'pr-1',
          group.active
            ? 'font-semibold text-ink'
            : 'text-ink-muted hover:text-ink'
        )}
      >
        {group.label}
        <NavUnderline active={group.active} className="right-1" />
      </Link>

      <button
        ref={toggleRef}
        type="button"
        onClick={() => (open ? onClose() : onOpen())}
        aria-expanded={open}
        aria-controls={group.panelId}
        aria-label={`${group.label}: ${submenuLabel}`}
        className={cn(
          'inline-flex size-11 items-center justify-center rounded-xl text-ink-subtle transition-colors hover:bg-brand-wash hover:text-brand-strong',
          open && 'bg-brand-wash text-brand-strong'
        )}
      >
        <ChevronDown
          className={cn(
            'size-4 transition-transform duration-300',
            open && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>

      {/* Se alterna con el atributo `hidden` en lugar de montarse a demanda, así
          los ocho enlaces de los dos grupos están en el HTML del servidor y un
          crawler los sigue sin ejecutar nada.

          El panel es OPACO (`bg-surface`), no de cristal: cuelga de un header que
          ya lleva backdrop-filter, y anidar cristal sobre cristal desenfoca dos
          veces — el doble de costo por un efecto que se ve peor. */}
      <div
        ref={panelRef}
        id={group.panelId}
        hidden={!open}
        className={cn(
          'enter-scale absolute left-0 top-full mt-2 rounded-2xl border border-hairline bg-surface p-2 shadow-lift-3',
          group.width
        )}
      >
        <ul>
          {group.items.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
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
                    className={cn(
                      'grid size-8 shrink-0 place-items-center rounded-lg transition-transform duration-300 group-hover/item:scale-110',
                      group.chip
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>

        {group.all && (
          <div className="mt-2 border-t border-hairline pt-2">
            <Link
              href={group.all.href}
              onClick={onClose}
              className="group/all flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-brand-strong transition-colors hover:bg-brand-wash"
            >
              {group.all.label}
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover/all:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>
        )}
      </div>
    </div>
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
  href: StaticPathname
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
