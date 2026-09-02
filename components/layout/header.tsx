'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
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
  key: 'about' | 'blog' | 'books' | 'contact'
  /**
   * La ruta existe SOLO en español. Fuerza `locale="es"` en el enlace, en las
   * dos lenguas. Ver la nota junto al item del blog.
   */
  soloEs?: boolean
}

interface GroupSource {
  href: StaticPathname
  /** Clave de traducción; el namespace lo decide el grupo que la consume. */
  key: string
  /**
   * Identificador de canal, si la fila ES un canal.
   *
   * Los cuatro servicios son los canales a–d del registro: así se llaman en
   * /servicios, en la placa de la portada y en el dial. Las cuatro páginas de
   * trayectoria NO lo son —no son canales ni una secuencia— así que van sin
   * marca, que es la gramática de `.band`. Este proyecto prohíbe numerar lo
   * que no es una secuencia real.
   *
   * Sustituye a `icon: LucideIcon`. Ver «El nav, migrado» en globals.css.
   */
  ch?: string
}

/** Inicio va primero, luego los dos grupos, luego estos. */
const NAV_ITEMS: readonly NavItem[] = [
  { href: '/sobre-mi', key: 'about' },
  /* El blog SOLO existe en español, así que su enlace fuerza `locale="es"`
     en las dos lenguas. Sin esto, `<Link href="/blog">` localizaba al
     locale activo y las 15 páginas EN emitían `/en/blog` — una URL que
     responde 308. Eran 45 enlaces internos a un redirect solo desde aquí
     y el pie. `app/sitemap.ts` ya resuelve lo mismo con `url('blog','es')`
     y el middleware con `alternateLinks: false`; el nav era el tercer
     canal, y el de más volumen. */
  { href: '/blog', soloEs: true, key: 'blog' },
  { href: '/libros', key: 'books' },
  { href: '/contacto', key: 'contact' },
]

/**
 * Las letras son las MISMAS que la placa de la portada y /servicios imprimen
 * para estos cuatro servicios, y en el mismo orden. Es lo que hace que el menú
 * y la página digan lo mismo: antes el nav ponía cuatro iconos que no
 * correspondían a nada del resto del sitio.
 */
const SERVICE_ITEMS: readonly GroupSource[] = [
  { href: '/seo-tecnico', key: 'seoTecnico', ch: 'a' },
  { href: '/desarrollo-web', key: 'desarrolloWeb', ch: 'b' },
  { href: '/automatizacion-ia', key: 'automatizacionIA', ch: 'c' },
  { href: '/dashboards', key: 'dashboardsLabel', ch: 'd' },
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
  { href: '/proyectos', key: 'projects' },
  { href: '/premios', key: 'awards' },
  { href: '/certificaciones', key: 'certifications' },
  { href: '/cv', key: 'cv' },
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
 *
 * ── POR QUÉ LLEVA `.press` Y NO `transition-colors` ──
 * `.press` está escrita FUERA de toda `@layer` en globals.css, así que su
 * `transition` le gana a cualquier utilidad de Tailwind (que viven en
 * `@layer utilities`). Poner las dos dejaría `transition-colors` como clase
 * muerta y confundiría al siguiente que lea esto. `.press` ya anima
 * `background-color` y `transform`, que es lo que se mueve aquí: el color del
 * texto cambia de golpe a propósito — un control tiene que responder antes de
 * que el dedo se levante, y el subrayado de gradiente es el que hace la
 * transición visible.
 */
/**
 * `whitespace-nowrap` es obligatorio aquí.
 *
 * Con dos desplegables, cinco enlaces, el selector de idioma y el CTA, la barra
 * va justa incluso a 1280px, y sin esto "Sobre mí" se partía en dos líneas y
 * descuadraba toda la fila. Es el mismo problema que el del botón principal pero
 * al revés: ahí `nowrap` sobraba porque una etiqueta larga en español inflaba su
 * contenedor; aquí falta porque el ancho lo manda la barra, no la etiqueta.
 */
/**
 * `px-2.5` y no `px-3`: son 4px menos por enlace, y con seis enlaces son 24px
 * que la fila necesitaba. Medido a 1440px con px-3, la fila pedia 1094px dentro
 * de un contenedor de 1088 (max-w-6xl menos px-8) y algo se comprimia siempre.
 * Con px-2.5 pide 1070 y quedan 18px de holgura, que es lo que absorbe una
 * etiqueta mas larga al traducir sin volver a romper la fila.
 *
 * `whitespace-nowrap` es obligatorio aqui: sin el, la fila no desborda — parte
 * "Sobre mi" en dos lineas y la barra crece de alto, que se ve peor y no lo
 * reporta ningun chequeo de desborde horizontal.
 *
 * Si hace falta un septimo enlace, no se aprieta mas: se mueve a un grupo
 * desplegable. Verifica con: npm run check:overflow
 */
/**
 * Un enlace de nav es una etiqueta impresa con una GOTA encima al pasar el
 * puntero. La gota es `.drop` y vive en globals.css: óptica pura —remache de
 * luz arriba, cáustica abajo, cuerpo radial— sin `backdrop-filter`, porque
 * sobre casi negro el desenfoque no aporta nada visible y sí obliga a volver
 * a muestrear el fondo en cada frame del hover.
 *
 * La regla de 1 px de debajo se quedó SOLO para la página actual. Con la gota
 * las dos cosas competían por decir lo mismo: una marca el estado, la otra el
 * puntero.
 */
const NAV_LINK_BASE =
  'group press relative inline-flex h-11 items-center whitespace-nowrap px-1 text-sm text-ink-muted transition-colors hover:text-ink'

/**
 * Con la gota. Los grupos con desplegable NO la usan aquí: ahí la gota va en
 * el contenedor, para que cubra la etiqueta y el chevron como un solo control
 * —que es lo que son— en vez de dejar el chevron fuera del agua.
 */
const NAV_LINK = `${NAV_LINK_BASE} drop`

interface GroupLink {
  href: StaticPathname
  label: string
  /** Letra del canal, solo en las filas que SON canales. */
  ch?: string
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
        ch: item.ch,
      })),
      all: { href: '/servicios', label: ts('allServices') },
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
        ch: item.ch,
      })),
      // Sin fila "ver todo": el hub del grupo ya es /proyectos y "Proyectos" es
      // el primer ítem de la lista.
      width: 'w-[16rem]',
    },
  ]

  /**
   * Cerrar es POR GRUPO, nunca global. Identidad estable porque es dependencia
   * de los efectos de cada desplegable.
   *
   * ── EL FALLO QUE ESTO ARREGLA (MEDIDO, NO SUPUESTO) ──
   * `NavDropdown` cierra con 220 ms de retardo al salir el puntero; el retardo
   * existe porque sin él el hueco de 1 px entre la etiqueta y el panel cierra
   * el menú justo cuando el puntero va hacia él.
   *
   * Con un `onClose` compartido que hacía `setOpenGroup(null)` a secas, barrer
   * el puntero de "Servicios" a "Trayectoria" abría Trayectoria al instante y
   * 220 ms después el temporizador de Servicios —ya obsoleto— la cerraba. El
   * menú parpadeaba y se sentía roto: exactamente la queja del dueño.
   *
   * Medido con scripts/nav-test.mjs: a los 120 ms del barrido Trayectoria tenía
   * `aria-expanded="true"` y 4 enlaces visibles; a los 620 ms estaba cerrada.
   *
   * Comparando contra el grupo que quedó abierto, un cierre atrasado solo puede
   * cerrar lo que él mismo abrió. Se declaran los dos de antemano en lugar de
   * generarlos en el render porque una función nueva por render reinstalaría los
   * escuchas de Escape y de clic-fuera en cada pasada.
   */
  const closeGroup = useMemo(
    () =>
      ({
        services: () =>
          setOpenGroup((current) => (current === 'services' ? null : current)),
        trajectory: () =>
          setOpenGroup((current) =>
            current === 'trajectory' ? null : current
          ),
      }) satisfies Record<GroupId, () => void>,
    []
  )

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
    // El desenfoque y la saturación se leen de los TOKENS, no de una escala de
    // utilidades: `--glass-blur` y `--glass-sat` ya bajan a 16px/150% por
    // debajo de 640px en globals.css, donde el fill-rate es la mitad. Así la
    // barra usa exactamente el mismo cristal que el resto del sistema y hay un
    // solo lugar donde ajustarlo.
    //
    // Si el navegador no soporta backdrop-filter se queda `bg-surface/92`, casi
    // opaco, en lugar de un panel translúcido sin desenfoque detrás — que es
    // donde el texto dejaría de leerse.
    //
    // El borde luminoso son dos cosas juntas: el borde de 1px en
    // `--glass-border` (blanco al 75%) y el reflejo interior superior del
    // box-shadow. Ese reflejo es lo que hace que el canto de arriba se vea
    // pulido en lugar de cortado, y va como sombra en línea porque necesita
    // acompañar a `--lift-2` en la misma declaración.
    <header
      /* Sin fondo, sin borde y sin sombra EN EL ELEMENTO. El cristal lo
         pinta `.chrome-glass`, que es un hermano absoluto del contenido:
         si envolviera al contenido, su máscara de disolución también
         desvanecería los descendentes de la tipografía del nav.

         Y por eso mismo el cristal va DENTRO de `.sheet` y no aquí: el
         panel móvil también es hijo del header, así que un `inset: 0` a
         este nivel le pintaría vidrio encima. */
      className="sticky top-0 z-50"
    >
      {/* `.sheet` y no `mx-auto max-w-6xl`: el contenido de las páginas va a
          sangre desde el canto del riel, así que un nav centrado dejaba la
          marca cien píxeles a la derecha del titular y las dos rejillas no
          se reconocían como la misma hoja. */}
      <div className="sheet relative">
        {/* ══ EL CRISTAL ═══════════════════════════════════════════
            «Liquid glass sin contenedores, como gota de agua». Un
            absoluto se mide contra la caja de PADDING, así que
            `inset: 0` llega a los dos cantos de la pantalla aunque
            `.sheet` tenga 96 px de sangrado.

            No se ve al llegar: se CONDENSA con el scroll. Ver
            `chrome-condense` en globals.css. */}
        <span className="chrome-glass" aria-hidden="true" />
        <span className="chrome-meniscus" aria-hidden="true" />

        {/* `isolate` no es decorativo: es lo que mantiene el
            `z-index: -1` de la gota dentro de esta fila. Sin él, el
            negativo sube hasta el header y el cristal se lo come. */}
        <div className="isolate flex h-16 items-center justify-between gap-3 sm:h-18 sm:gap-4">
          {/* ══ WORDMARK ═══════════════════════════════════════════
              La marca es un cuadro con el gradiente firma y las iniciales.
              Al hover escala y gira unos grados: nada de eso toca el layout, así
              que el CLS no se mueve. El barrido especular (`.sheen`) vive en el cuadro y
              no en el enlace completo porque `.sheen:hover::after` se dispara
              con el hover del propio elemento — sobre el enlace entero barrería
              también el nombre. */}
          {/* El cuadro «CA» se retiró: era exactamente el cuadrado con algo
              dentro que el brief pidió quitar, y encima llevaba gradiente y
              resplandor, dos cosas que este sistema no tiene. La marca es el
              nombre compuesto, que es más fuerte y no necesita contenedor.

              En su lugar va el punto en línea: late porque hay una medición
              corriendo del otro lado, y es el mismo indicador que el resto
              del sitio usa para «esto está vivo». */}
          <Link
            href="/"
            className="group press inline-flex h-11 items-center gap-2.5 text-ink"
          >
            {/* Punto quieto, no `.live`: el latido vive UNA sola vez por
                página, en el héroe, junto a la medición que de verdad está
                corriendo. Dos latidos costaban el doble de presupuesto y
                competían entre sí por la atención. */}
            <span
              aria-hidden="true"
              className="size-[0.4375rem] shrink-0 rounded-full bg-threshold"
            />
            {/* `text-base` en el ancho mas estrecho y `text-xl` desde sm.
                A 360px la fila tiene 320px utiles y con text-lg pedia 336:
                el nombre medía 157px y el grupo de controles 119, mas 12 de
                gap. El sobrante no producia scroll horizontal — se comia el
                px-5 del contenedor y dejaba la hamburguesa a 4px del borde
                en vez de 20, que es peor porque ningun chequeo de desborde
                lo ve. Con text-base el nombre mide 139 y sobran 9px. */}
            <span className="whitespace-nowrap font-display text-base font-bold tracking-tight transition-colors group-hover:text-brand-strong sm:text-xl">
              Carlos Anaya Ruiz
            </span>
          </Link>

          {/* ══ NAV DE ESCRITORIO ══════════════════════════════════
              El nav va dentro de un control segmentado: borde luminoso, tinte
              translúcido y reflejo interior. Es un color translúcido, NO otro
              `backdrop-filter` — anidar desenfoque sobre desenfoque cuesta el
              doble y se ve peor, y el de la barra ya está difuminando la aurora
              de la página que hay detrás. */}
          <nav
            aria-label={ta('mainNav')}
            className={cn(
              // El nav conmuta en xl, NO en lg, y tiene que coincidir con el
              // `xl:hidden` de la hamburguesa: si difieren, entre 1024 y 1279px
              // se dibujan LOS DOS. Medido a 1024px con ambos visibles:
              // marca 227 + nav 582 + controles 306 + gaps = 1178px dentro de
              // una fila de 960 → 154px de desborde en todas las páginas.
              // El nav pide ~1139px de contenido, así que no cabe en lg (1024)
              // aunque los dos no chocaran; el primer ancho donde entra es xl.
              'hidden items-center gap-7 xl:flex'
            )}
          >
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
                onClose={closeGroup[group.id]}
                isCurrent={isCurrent}
                submenuLabel={ta('openSubmenu')}
              />
            ))}

            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                locale={item.soloEs ? 'es' : undefined}
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

            {/* El clic de mayor intención se queda en el dominio: el CTA del
                header lleva a /contacto y no a ningún perfil externo.

                ── ERA UN BOTÓN DE SHADCN, Y ESO ESTABA ROTO ──
                Reportado: «ve si no hay nada roto, como el contáctame». Lo
                había, y era este. El enlace más pulsado del sitio venía del
                `<Button>` del sistema anterior y traía, medido en el HTML
                servido: `rounded-lg`, `bg-[image:var(--grad-fill)]`,
                `hover:shadow-glow-brand`, `.sheen` y
                `hover:[transform:translateY(-2px)]`.

                El puente de tokens neutralizaba tres de esas cinco —
                `--grad-fill` resuelve a un COLOR, así que `bg-[image:…]`
                caía a `none`; `--shadow-glow-brand` es `none`; el `::after`
                de `.sheen` está apagado con `!important`. Pero las otras dos
                seguían vivas y se veían:

                  · `text-white` = #ffffff. Este sistema no tiene blanco puro:
                    su tinta es `--paper`, #ebe6d9. El CTA era el ÚNICO texto
                    blanco de la barra, justo al lado de la marca en papel.
                  · el salto de 2 px al pasar el puntero. Nada en «Papel
                    Ahumado» se levanta: aquí la respuesta al puntero es un
                    trazo que se escribe, no un objeto que flota.

                Lo que queda es el vocabulario que el resto de la fila ya usa:
                tinta plena, peso alto y la flecha que avanza. Sin caja, sin
                radio, sin sombra y sin salto.

                La flecha es el glifo de texto, que es el idioma del resto del
                sitio —«{t('ctaMain')} →» en las quince páginas— y no un
                `<svg>` que obliga a traer una librería de iconos al cliente. */}
            <Link
              href="/contacto"
              className="group/cta press hidden h-11 items-center gap-2 whitespace-nowrap px-1 text-sm font-semibold text-ink transition-colors sm:inline-flex"
            >
              {t('hireMe')}
              <span
                className="transition-transform duration-300 group-hover/cta:translate-x-1"
                aria-hidden="true"
              >
                →
              </span>
            </Link>

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => (menuOpen ? closeMenu(false) : setMenuOpen(true))}
              aria-expanded={menuOpen}
              aria-controls={MOBILE_PANEL_ID}
              aria-label={menuOpen ? t('closeMenu') : t('openMenu')}
              className={cn(
                'press inline-flex size-11 items-center justify-center text-ink-muted transition-colors hover:text-ink xl:hidden',
                menuOpen && 'text-ink'
              )}
            >
              {/* Tres reglas de 1 px —el vocabulario del riel— que se
                  cruzan en una × al abrir. El nodo es SIEMPRE el mismo: el
                  estado lo lee el CSS de `aria-expanded`, que ya está en el
                  botón por accesibilidad. Antes eran dos `<svg>` que se
                  intercambiaban con un ternario, así que cada pulsación
                  cambiaba el árbol. */}
              <span className="bars" aria-hidden="true">
                <span />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ══ PANEL MÓVIL ══════════════════════════════════════════════
          Alto acotado con overflow propio: en un teléfono en horizontal el menú
          hace scroll dentro de sí mismo en lugar de empujar la página.

          Opaco y `relative` por lo mismo que el panel de escritorio: cuelga del
          header de cristal, así que ni se desenfoca otra vez ni se deja pintar
          por debajo del reflejo especular.

          Tampoco lleva aurora, y eso está medido, no es pereza: los renglones
          del menú son `text-ink-muted`, que sobre el campo azul de la aurora a
          plena intensidad cae a 3.66:1. La textura la da la cuadrícula que se
          desvanece, que es tinta al 4.5% y no mueve el contraste. */}
      <div
        ref={menuPanelRef}
        id={MOBILE_PANEL_ID}
        hidden={!menuOpen}
        /* Sigue OPACO a propósito: es una hoja a pantalla completa con
           scroll propio, y un panel translúcido sobre texto en movimiento
           es donde el contraste se pierde de verdad. Lo que cambia es el
           borde: `--glass-border` era un alias heredado del sistema
           anterior. */
        className="relative isolate max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-hairline bg-ground xl:hidden"
      >
        {/* La cuadrícula no lleva una línea de gradiente encima: la del borde
            inferior del header cae exactamente sobre este borde superior, así
            que una segunda sería la misma línea dos veces. */}
        <div className="grid-fade" aria-hidden="true" />

        {/* Entrada con resorte (`.enter-scale`, que corre sobre --ease-spring) y
            NO `.enter-3d` como el panel de escritorio. La diferencia no es de
            gusto: este panel es un contenedor con `overflow-y: auto`, y un
            transform que desplace el contenido hacia abajo —lo que hace
            `enter-3d` en su fotograma inicial— cuenta para el overflow
            desplazable, así que asomaría una barra de scroll durante la
            animación. Una escala que entra desde 0.94 solo se pasa de 1 por el
            rebote del resorte, y ahí como mucho un 1%.

            La duración va en línea porque `.enter-scale` está fuera de toda
            `@layer` y su `animation` en atajo (700 ms) le gana a cualquier
            utilidad de Tailwind; 700 ms en un menú se siente lento. Una
            declaración en línea sí gana, y el `!important` de
            `prefers-reduced-motion` sigue ganándole a ella. */}
        <nav
          aria-label={ta('mobileMenu')}
          style={{ animationDuration: '380ms' }}
          className="sheet enter-scale relative py-4"
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
                {/* Sin `pl-*`: la sangría la da la MARCA de cada renglón, que
                    es lo que la hace consistente entre los dos grupos. Un
                    padding en la lista indentaba el texto de Servicios (que ya
                    tenía su letra) y no el de Trayectoria (que no tenía nada). */}
                <ul className="pb-2">
                  {group.items.map((item) => {
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          aria-current={
                            isCurrent(item.href) ? 'page' : undefined
                          }
                          className="drop-row press"
                        >
                          {/* MISMA gramática que el desplegable de escritorio,
                              y el motivo se vio en captura a 390: los cuatro
                              hijos de «Trayectoria» no llevaban marca, así que
                              su texto arrancaba a x=120 mientras el rótulo de
                              su propio grupo estaba en x=130. Los hijos
                              quedaban MENOS indentados que el padre y se leían
                              como hermanos suyos, no como su contenido.

                              Con la marca —la letra del canal donde hay canal,
                              un tick de 1 px donde no— las ocho filas de los
                              dos grupos caen al mismo x y la jerarquía se lee
                              sola. Las páginas de trayectoria siguen SIN letra:
                              no son canales ni una secuencia.

                              Y el estado activo deja de ser `bg-brand-wash`, un
                              lavado de fondo a sangre detrás del texto, o sea
                              una píldora en un sistema que no tiene píldoras.
                              `.drop-row` lo resuelve con tinta plena y el trazo
                              de la pluma ya escrito. */}
                          {item.ch ? (
                            <span className="nav-ch" aria-hidden="true">
                              {item.ch}
                            </span>
                          ) : (
                            <span className="drop-tick" aria-hidden="true" />
                          )}
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
                  soloEs={item.soloEs}
                  label={t(item.key)}
                  current={isCurrent(item.href)}
                  onNavigate={() => setMenuOpen(false)}
                />
              </li>
            ))}
          </ul>

          {/* Aquí SÍ va `.pull-tab`, que es el «botón» documentado de este
              sistema: una regla arriba, el rótulo en mono y la flecha. En la
              fila del nav una regla superior no tendría sentido —no hay nada
              que separar—, pero al pie de un panel apilado a todo el ancho es
              exactamente su sitio. Y trae sus 44 px de objetivo táctil, que es
              lo único que este control necesita cumplir. */}
          <Link
            href="/contacto"
            onClick={() => setMenuOpen(false)}
            className="pull-tab press mt-8 w-full"
          >
            {/* Sin flecha a mano: la pinta `.pull-tab::after`. Puesta dos
                veces daba «Contrátame → →». */}
            {t('hireMe')}
          </Link>
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

  /**
   * Si el menú se abrió por hover, NO se mueve el foco.
   *
   * Mover el foco al primer enlace es correcto cuando alguien abre el menú a
   * propósito con teclado o clic. Hacerlo al simplemente pasar el mouse por
   * encima le arrebata el foco a lo que estuviera enfocado, sin que nadie lo
   * haya pedido.
   */
  const openedByHover = useRef(false)

  useEffect(() => {
    if (!open || openedByHover.current) return
    panelRef.current?.querySelector<HTMLElement>('a[href]')?.focus()
  }, [open])

  /**
   * ── POR QUÉ HAY HOVER ──
   * La versión anterior solo abría con el chevron: la etiqueta era un enlace y
   * el chevron un botón de 44px al lado. El código funcionaba —lo verifiqué con
   * clics sintéticos— pero la affordance estaba mal: al hacer clic en la palabra
   * "Trayectoria" el navegador NAVEGA, así que el menú nunca aparecía y se
   * sentía roto. Era un fallo real reportado por el dueño.
   *
   * Ahora el grupo completo abre al pasar el mouse, así que el menú aparece
   * antes de que a nadie le dé tiempo de hacer clic. El enlace del hub sigue
   * siendo un enlace (rastreable, y el hub se alcanza sin abrir ningún popup) y
   * el chevron sigue siendo un botón (teclado y táctil, donde no hay hover).
   *
   * El cierre lleva retardo: sin él, el hueco de 1px entre la etiqueta y el
   * panel cierra el menú justo cuando el puntero va hacia él.
   */
  const closeTimer = useRef<number | null>(null)

  const cancelClose = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }

  const onPointerEnter = (event: React.PointerEvent) => {
    // Solo puntero fino: en táctil `pointerenter` llega junto con el toque y
    // abriría el menú al intentar seguir el enlace.
    if (event.pointerType !== 'mouse') return
    cancelClose()
    if (!open) {
      openedByHover.current = true
      onOpen()
    }
  }

  const onPointerLeave = (event: React.PointerEvent) => {
    if (event.pointerType !== 'mouse') return
    cancelClose()
    closeTimer.current = window.setTimeout(() => {
      onClose()
      openedByHover.current = false
    }, 220)
  }

  useEffect(() => cancelClose, [])

  /** Tabular más allá del último ítem cierra el menú en vez de dejarlo huérfano. */
  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!open) return
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      onClose()
    }
  }

  return (
    // El grupo completo abre al pasar el mouse. La etiqueta del hub sigue siendo
    // un enlace (rastreable) y el chevron un botón (teclado y táctil).
    // `group/nav` no es decorativo: la etiqueta y el chevron son dos elementos
    // distintos y sin él cada uno se iluminaría por su cuenta. Compartiendo el
    // resaltado se leen como un solo control — que es lo que son, y lo que
    // avisa de que ahí hay un menú.
    <div
      ref={wrapRef}
      /* La gota envuelve etiqueta + chevron: un solo control, una sola
         gota. Sustituye al lavado de fondo `bg-brand-wash/70`, que era una
         cápsula heredada del sistema anterior. */
      className="drop group/nav relative flex items-center"
      onBlur={handleBlur}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <Link
        href={group.hub}
        /* Sin prefetch. Los dos hubs del nav —/servicios y /proyectos— son los
           payloads RSC más caros del sitio, y el nav dispara 29 peticiones de
           prefetch (118 kB comprimidos, 537 kB sin comprimir) en cada carga
           solo por tener sus siete enlaces visibles. El enlace navega igual. */
        prefetch={false}
        aria-current={isCurrent(group.hub) ? 'page' : undefined}
        className={cn(
          NAV_LINK_BASE,
          'pr-0.5',
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
        onClick={() => {
          if (open) {
            onClose()
          } else {
            // Apertura deliberada: el foco sí debe entrar al menú.
            openedByHover.current = false
            onOpen()
          }
        }}
        aria-expanded={open}
        aria-controls={group.panelId}
        aria-label={`${group.label}: ${submenuLabel}`}
        className={cn(
          /* El chevron es parte de SU etiqueta, no un control suelto.
             Medido: como botón de 44px pegado al enlace, el hueco óptico
             entre textos era 28 · 76 · 76 · 28 · 28 — los dos grupos con
             desplegable quedaban al triple de separación que el resto y la
             fila se leía descuadrada.

             Ahora ocupa 1rem de ancho visual y conserva los 44px de alto,
             así que el objetivo táctil sigue cumpliendo el piso sin robarle
             espacio horizontal a la fila. */
          'press -ml-0.5 inline-flex h-11 w-4 items-center justify-center text-ink-subtle transition-colors hover:text-ink',
          'group-hover/nav:text-ink',
          open && 'text-ink'
        )}
      >
        {/* Una punta de pluma: dos reglas de 1 px que se encuentran en un
            vértice. El giro lo dispara `aria-expanded` desde el CSS, así que
            no hace falta pasarle `open` — el atributo ya está en el botón
            porque lo pide la accesibilidad. */}
        <span className="caret" aria-hidden="true" />
      </button>

      {/* Se alterna con el atributo `hidden` en lugar de montarse a demanda, así
          los ocho enlaces de los dos grupos están en el HTML del servidor y un
          crawler los sigue sin ejecutar nada.

          El panel es OPACO (`bg-surface`), no de cristal: cuelga de un header que
          ya lleva backdrop-filter, y anidar cristal sobre cristal desenfoca dos
          veces — el doble de costo por un efecto que se ve peor. Lo que sí lleva
          es todo lo demás de una superficie de app: reflejo interior arriba,
          sombra de cuarto nivel (dos planos de sombra, no una más grande), un
          lavado de gradiente sobre toda la superficie y la línea de marca en el
          canto de arriba.

          La entrada es `.enter-3d`: el panel llega girando desde atrás, así se
          lee como un objeto que se acerca y no como un rectángulo que aparece.
          La duración va en `style` a propósito — `.enter-3d` está escrita fuera
          de toda `@layer`, así que su `animation` en atajo (950 ms) le gana a
          cualquier utilidad de Tailwind, y 950 ms en un menú se siente lento.
          Una declaración en línea sí gana, y el `!important` de
          `prefers-reduced-motion` sigue ganándole a ella. */}
      <div
        ref={panelRef}
        id={group.panelId}
        hidden={!open}
        /* `.drop-panel` es ahora una HOJA opaca de humo con el grosor del papel
           por canto: radio cero, sin `backdrop-filter` y sin sombra de marco.
           Antes era cristal translúcido al 86% colgando de un header que ya
           lleva cristal, y en captura a 1440 se leía el masthead ATRAVESANDO
           las filas del menú. Ver el bloque de globals.css.

           `.drop-unroll` reemplaza a `.enter`: la hoja se despliega con
           `clip-path` en 200 ms y las filas NO se mueven. La versión anterior
           trasladaba el panel 24 px y cada fila otros 24 dentro de él, con
           retardos que no asentaban la última hasta los 585 ms.

           `mt-0` y no `mt-2`: el panel arranca en el canto inferior de la fila
           del nav, así que su línea de luz superior continúa el menisco del
           cristal en vez de flotar dos píxeles por debajo como un objeto
           aparte. */
        className={cn(
          'drop-unroll drop-panel absolute left-0 top-full z-10 origin-top py-1',
          group.width
        )}
      >
        <ul className="relative">
          {group.items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onClose}
                aria-current={isCurrent(item.href) ? 'page' : undefined}
                className="drop-row press"
              >
                {/* La marca ocupa el MISMO hueco en los dos menús: la letra
                    del canal donde hay canal, y un tick de 1 px donde no.
                    Sin el tick, las cuatro páginas de Trayectoria quedaban
                    flotando sin nada que las alineara ni que dijera que
                    pertenecían al mismo grupo — que es exactamente lo que se
                    reportó. Las páginas de trayectoria siguen SIN letra: no
                    son canales ni una secuencia, y este proyecto prohíbe
                    numerar lo que no lo es. */}
                {item.ch ? (
                  <span className="nav-ch" aria-hidden="true">
                    {item.ch}
                  </span>
                ) : (
                  <span className="drop-tick" aria-hidden="true" />
                )}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {group.all && (
          <Link
            href={group.all.href}
            onClick={onClose}
            className="drop-all group/all press relative"
          >
            {group.all.label}
            <span
              className="transition-transform duration-300 group-hover/all:translate-x-1"
              aria-hidden="true"
            >
              →
            </span>
          </Link>
        )}
      </div>
    </div>
  )
}

/**
 * La regla del nav de escritorio: marca la página ACTUAL y nada más.
 *
 * Antes entraba también en hover, desde la izquierda. Con la gota eso eran
 * dos señales para el mismo evento — y la que sobra es la regla, porque un
 * subrayado que aparece al pasar se lee como estado, no como puntero. Solo
 * anima `transform`, así que no toca el layout.
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
        'pointer-events-none absolute inset-x-1 bottom-2 h-px origin-left bg-paper transition-transform duration-300',
        active ? 'scale-x-100' : 'scale-x-0',
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
  soloEs,
}: {
  href: StaticPathname
  label: string
  current: boolean
  onNavigate: () => void
  soloEs?: boolean
}) {
  return (
    <Link
      href={href}
        locale={soloEs ? 'es' : undefined}
      onClick={onNavigate}
      aria-current={current ? 'page' : undefined}
      className={cn(
        'press flex min-h-12 items-center justify-between gap-3 rounded-xl px-2 text-base',
        current
          ? 'font-semibold text-ink'
          : 'text-ink-muted hover:bg-brand-wash/60 hover:text-ink'
      )}
    >
      {label}
      {current && (
        <span aria-hidden="true" className="h-px w-6 shrink-0 bg-ash" />
      )}
    </Link>
  )
}
