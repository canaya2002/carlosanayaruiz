import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Github, Linkedin, Mail, MapPin, Phone } from 'lucide-react'
import { NAP, SOCIAL_LINKS } from '@/lib/constants'
import type { StaticPathname } from '@/i18n/routing'

/**
 * Pie de página del sitio.
 *
 * Es la única superficie que comparten todas las URLs, así que es donde vive el
 * bloque NAP completo: el mismo nombre, la misma localidad, el mismo correo y el
 * mismo teléfono en cada página, todos leídos de NAP en lib/constants.ts. Esa
 * consistencia entre páginas — y contra el JSON-LD del layout — es lo que
 * permite a Google reconciliar la entidad en lugar de adivinar entre tres
 * variantes casi iguales.
 *
 * Server component: sin estado ni handlers, así que no manda JS al navegador.
 */

interface FooterLink {
  /**
   * StaticPathname y no Pathname: '/proyectos/[slug]' necesita un objeto con
   * `params`, así que dejarlo entrar aquí haría que el error apareciera en el
   * href y no en la tabla, que es donde se entiende.
   */
  href: StaticPathname
  label: string
}

export async function Footer() {
  const locale = await getLocale()
  const en = locale === 'en'

  const t = await getTranslations('footer')
  const tn = await getTranslations('nav')
  const tc = await getTranslations('contact')
  const ta = await getTranslations('a11y')
  const tl = await getTranslations('legal')

  const year = new Date().getFullYear()

  const services: readonly FooterLink[] = [
    { href: '/seo-tecnico', label: t('seoTecnico') },
    { href: '/desarrollo-web', label: t('desarrolloWeb') },
    { href: '/automatizacion-ia', label: t('automatizacionIA') },
    { href: '/dashboards', label: t('dashboardsLabel') },
  ]

  /**
   * Las cuatro rutas de trayectoria van aquí, no en una quinta columna: el pie
   * es la única superficie que comparten todas las URLs, así que es el enlace
   * interno más barato que existe hacia páginas que todavía no tienen enlaces
   * entrantes. Quedan agrupadas entre "Sobre mí" y "Recursos" porque es el
   * mismo bloque de prueba: quién soy, qué he hecho, qué publico.
   */
  const navigation: readonly FooterLink[] = [
    { href: '/', label: tn('home') },
    { href: '/sobre-mi', label: tn('about') },
    { href: '/proyectos', label: tn('projects') },
    { href: '/premios', label: tn('awards') },
    { href: '/certificaciones', label: tn('certifications') },
    { href: '/cv', label: tn('cv') },
    { href: '/libros', label: tn('books') },
    { href: '/contacto', label: tn('contact') },
  ]

  const cityLine = en
    ? `${NAP.localityEn}, ${NAP.countryNameEn}`
    : `${NAP.locality}, ${NAP.countryName}`

  /**
   * Enlaces de texto del pie: un solo vocabulario para las tres columnas.
   *
   * ── POR QUÉ SON `text-ink` Y NO `text-ink-muted` ──
   * Porque ahora hay una aurora detrás y estos enlaces caen DIRECTO sobre ella.
   * La regla del sistema ("texto sin cristal de por medio solo puede ser ink")
   * no es un gusto: medí el peor caso real, que es el solape de los tres campos
   * de color en su pico. Ahí ink-muted da 2.98:1 y sigue sin pasar (4.47) aun
   * bajando la aurora al 25% de opacidad, porque los campos se acumulan. `ink`
   * da 7.94 en ese mismo punto. La tabla completa está en el bloque de la
   * aurora, unas líneas más abajo. La jerarquía la hacen el tamaño y el peso,
   * que es lo que el contraste permite aquí.
   *
   * El hover es una píldora OPACA (`bg-surface`), no un lavado translúcido: así
   * `brand-strong` mide sus 6.5:1 contra blanco pase lo que pase detrás, en vez
   * de depender de qué campo de aurora quedó bajo el cursor.
   *
   * Lleva `.press` y NO `transition-colors`: `.press` está escrita fuera de
   * toda `@layer` en globals.css, así que su `transition` le gana a cualquier
   * utilidad y dejaría la otra clase muerta. Lo que se anima es el fondo y el
   * hundido al pulsar; el color cambia de golpe, que en un control es lo
   * correcto.
   */
  const linkClass =
    'press inline-flex min-h-10 items-center text-sm text-ink-muted transition-colors hover:text-ink'

  return (
    <footer className="relative isolate overflow-hidden border-t border-hairline bg-ground-tint">
      
      
      <div className="grain" aria-hidden="true" />
      <div className="grid-fade" aria-hidden="true" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-hairline-strong"
      />

      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        {/* ⚠ AQUÍ NO VA `.reveal-stagger`, Y NO ES OLVIDO. Esa clase anima a
            TODOS los hijos directos, y el cuarto es el panel de cristal:
            desplazar una superficie con `backdrop-filter` mientras se hace
            scroll obliga al navegador a volver a muestrear y difuminar lo que
            hay detrás en cada frame, que es exactamente el gasto que hizo que
            este sitio se sintiera lento. El movimiento del pie lo pone la
            aurora, que solo mueve capas ya rasterizadas. */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))] lg:gap-10">
          {/* ══ IDENTIDAD ══════════════════════════════════════════
              Misma marca que el header. Está duplicada a propósito: el header es
              client component y este es server, y un componente compartido
              arrastraría uno de los dos al lado equivocado de la frontera. */}
          <div>
            <Link
              href="/"
              className="group press inline-flex items-center gap-2.5 py-1"
            >
              <span
                aria-hidden="true"
                // `rotate` y `scale`, no `transform`: en Tailwind v4 las
                // utilidades `rotate-*` y `scale-*` escriben esas propiedades
                // individuales, así que una `transition-property` que dijera
                // `transform` no animaría ninguna de las dos — el cuadro
                // saltaba de golpe.
                className="sheen grad-fill grid size-9 place-items-center rounded-xl font-display text-sm font-bold shadow-glow-brand transition-[rotate,scale,box-shadow] duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:shadow-glow-cyan"
              >
                CA
              </span>
              <span className="font-display text-xl font-bold tracking-tight text-ink transition-colors group-hover:text-brand-strong">
                {NAP.name}
              </span>
            </Link>

            {/* `text-ink`, no `text-ink-muted`: cae directo sobre la aurora.
                Ver la tabla de arriba. */}
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink">
              {t('description')}
            </p>
            <ul
              aria-label={ta('socialLinks')}
              className="mt-7 flex flex-wrap items-center gap-2"
            >
              <li>
                <a
                  href={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="me noopener noreferrer"
                  aria-label={`${NAP.name} · LinkedIn`}
                  className="press inline-flex size-11 items-center justify-center text-ink-muted transition-colors hover:text-ink"
                >
                  <Linkedin className="size-5" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href={SOCIAL_LINKS.github}
                  target="_blank"
                  rel="me noopener noreferrer"
                  aria-label={`${NAP.name} · GitHub`}
                  className="press inline-flex size-11 items-center justify-center text-ink-muted transition-colors hover:text-ink"
                >
                  <Github className="size-5" aria-hidden="true" />
                </a>
              </li>
              <li>
              </li>
            </ul>

            {/* Igual: sobre la aurora, `ink`. Este párrafo era `ink-subtle`, que
                en el peor caso mide 2.51:1 — el pie ya no usa ese token. */}
            <p className="mt-7 max-w-sm text-sm text-ink">{t('builtWith')}</p>
          </div>

          {/* ══ SERVICIOS ══════════════════════════════════════════ */}
          <div>
            <FooterHeading>{t('services')}</FooterHeading>
            <ul className="mt-5 space-y-0.5">
              {services.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ══ NAVEGACIÓN ═════════════════════════════════════════ */}
          <div>
            <FooterHeading>{t('navigation')}</FooterHeading>
            <ul className="mt-5 space-y-0.5">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ══ NAP ════════════════════════════════════════════════
              El único panel de cristal del pie, y por eso mismo el que se lee
              primero: es el bloque que la gente viene a buscar. Las otras dos
              columnas son listas de enlaces y van sin fondo — doce superficies
              con backdrop-filter costarían el triple por verse peor.

              ⚠ ES `.glass-strong`, NO `.glass`, Y LA RAZÓN ESTÁ MEDIDA. El
              chequeo de paleta compone el cristal sobre UN campo de aurora
              (#bbcef8). Detrás de este panel puede haber DOS o TRES solapados,
              que es más oscuro (#53c2f0 en el límite). Sobre ese peor caso:

                            ink    ink-muted   ink-subtle
                .glass     12.37     4.64         3.91
                .glass-str 13.43     5.03         4.24

              De ahí salen dos decisiones: el panel es `.glass-strong` (4.64 es
              pasar por 3%, y la aurora se mueve), y adentro NO hay ink-subtle
              —ni siquiera en el renglón del tiempo de respuesta— porque ni el
              cristal fuerte lo salva cuando se solapan los campos.

              No anida cristal: el header es la otra superficie de cristal del
              sitio y está en el otro extremo del documento. Tampoco se mueve al
              pasar el mouse — mover un panel con `backdrop-filter` obliga a
              volver a muestrear todo lo que hay detrás en cada frame, que es
              exactamente el tipo de gasto que hizo lento a este sitio. El
              movimiento del pie lo pone la aurora que está detrás.

              `relative` en el contenido porque el reflejo de `.glass-spec` es un
              ::before absoluto y solo los hijos posicionados se pintan encima:
              sin eso, un blanco al 50% caería sobre el nombre y el correo. */}
          <div className="glass glass-strong glass-spec p-4 sm:p-5">
            <div className="relative">
              <FooterHeading>{t('contactTitle')}</FooterHeading>

              {/* <address> para que los datos de contacto estén marcados como datos
                  de contacto y no como un párrafo suelto. `not-italic` porque el
                  estilo por defecto del navegador los pone en cursiva. */}
              <address className="mt-5 space-y-1 text-sm not-italic">
                <p className="font-semibold text-ink">{NAP.name}</p>
                <p>
                  <a
                    href={`mailto:${NAP.email}`}
                    className={`${linkClass} gap-2`}
                  >
                    <Mail
                      className="size-4 shrink-0 text-sky-ink"
                      aria-hidden="true"
                    />
                    {/* El correo no tiene espacios, así que su min-content es la
                        cadena completa y desbordaba la columna del pie por más
                        que la rejilla usara minmax(0,1fr). `min-w-0` deja que el
                        item flex encoja y `anywhere` permite el corte. */}
                    <span className="min-w-0 [overflow-wrap:anywhere]">
                      {NAP.email}
                    </span>
                  </a>
                </p>
                <p>
                  {/* Forma legible para las personas, E.164 en el href para que
                      marque el teléfono. */}
                  <a
                    href={`tel:${NAP.phone}`}
                    className={`${linkClass} gap-2`}
                    data-numeric=""
                  >
                    <Phone
                      className="size-4 shrink-0 text-sky-ink"
                      aria-hidden="true"
                    />
                    {NAP.phoneDisplay}
                  </a>
                </p>
                <p className="flex min-h-10 items-center gap-2 text-ink-muted">
                  <MapPin
                    className="size-4 shrink-0 text-sky-ink"
                    aria-hidden="true"
                  />
                  {cityLine}
                </p>
                {/* El punto que late es el mismo indicador de disponibilidad de la
                    portada; aquí acompaña al tiempo de respuesta. */}
                {/* `text-ink-muted`, no `text-ink-subtle`: ver la tabla del
                    panel. Con dos campos de aurora solapados detrás, ink-subtle
                    se queda en 4.24 incluso sobre cristal fuerte. */}
                <p className="flex items-center gap-2.5 pt-1 text-ink-muted">
                  <span className="ping" aria-hidden="true" />
                  {tc('responseTime')}
                </p>
              </address>
            </div>
          </div>
        </div>

        {/* ══ BARRA INFERIOR ═══════════════════════════════════════
            `text-ink` por lo mismo que el párrafo de "hecho con": este renglón
            va directo sobre la aurora. */}
        <div className="mt-14 flex flex-col gap-4 border-t border-hairline pt-8 sm:mt-16 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink">
            &copy; <span data-numeric="">{year}</span> {NAP.name}.{' '}
            {t('allRightsReserved')}
          </p>

          <ul className="flex flex-wrap items-center gap-x-6">
            <li>
              <Link href="/privacidad" className={linkClass}>
                {tl('privacyTitle')}
              </Link>
            </li>
            <li>
              <Link href="/terminos" className={linkClass}>
                {tl('termsTitle')}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

/**
 * Encabezado de columna. Lleva el punto de gradiente de `.eyebrow` para que las
 * tres columnas pertenezcan al mismo sistema, pero en un tamaño de metadato: es
 * un rótulo de navegación, no un título de sección.
 */
function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.14em] text-ink">
      <span
        aria-hidden="true"
        className="grad-fill block size-1.5 shrink-0 rounded-full"
      />
      {children}
    </h2>
  )
}
