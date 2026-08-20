import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ArrowUpRight, Github, Linkedin, Mail, MapPin, Phone } from 'lucide-react'
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

  /** Enlaces de texto del pie: un solo vocabulario para las tres columnas. */
  const linkClass =
    'inline-flex min-h-10 items-center text-sm text-ink-muted transition-colors hover:text-brand-strong'

  return (
    <footer className="relative isolate overflow-hidden border-t border-hairline bg-ground-tint">
      {/* Dos capas decorativas: la cuadrícula que se desvanece y la línea de
          gradiente del borde superior. Ninguna captura eventos y ninguna tiene
          alto propio, así que el pie no cambia de tamaño por ellas. */}
      <div className="grid-fade" aria-hidden="true" />
      <span
        aria-hidden="true"
        className="grad-fill pointer-events-none absolute inset-x-0 top-0 h-0.5 opacity-80"
      />

      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))] lg:gap-10">
          {/* ══ IDENTIDAD ══════════════════════════════════════════
              Misma marca que el header. Está duplicada a propósito: el header es
              client component y este es server, y un componente compartido
              arrastraría uno de los dos al lado equivocado de la frontera. */}
          <div>
            <Link href="/" className="group inline-flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="grad-fill grid size-9 place-items-center rounded-xl font-display text-sm font-bold shadow-glow-brand transition-transform duration-300 group-hover:scale-110"
              >
                CA
              </span>
              <span className="font-display text-xl font-bold tracking-tight text-ink transition-colors group-hover:text-brand-strong">
                {NAP.name}
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-muted">
              {t('description')}
            </p>

            {/* rel="me" en los dos perfiles que sí pertenecen a la persona es lo
                que los amarra al nodo Person del grafo del layout. Fiverr es un
                listado de marketplace, no una identidad: nofollow y sin
                rel="me". */}
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
                  className="inline-flex size-11 items-center justify-center rounded-xl border border-hairline bg-surface text-ink-muted shadow-lift-1 transition-[transform,color,box-shadow] duration-300 hover:-translate-y-0.5 hover:text-brand-strong hover:shadow-lift-2"
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
                  className="inline-flex size-11 items-center justify-center rounded-xl border border-hairline bg-surface text-ink-muted shadow-lift-1 transition-[transform,color,box-shadow] duration-300 hover:-translate-y-0.5 hover:text-brand-strong hover:shadow-lift-2"
                >
                  <Github className="size-5" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href={SOCIAL_LINKS.fiverr}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="group inline-flex h-11 items-center gap-1.5 rounded-xl border border-hairline bg-surface px-3.5 text-sm font-medium text-ink-muted shadow-lift-1 transition-[transform,color,box-shadow] duration-300 hover:-translate-y-0.5 hover:text-brand-strong hover:shadow-lift-2"
                >
                  Fiverr
                  <ArrowUpRight
                    className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </a>
              </li>
            </ul>

            <p className="mt-7 max-w-sm text-sm text-ink-subtle">
              {t('builtWith')}
            </p>
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

              No anida cristal: el header es la otra superficie de cristal del
              sitio y está en el otro extremo del documento.

              `relative` en el contenido porque el reflejo de `.glass-spec` es un
              ::before absoluto y solo los hijos posicionados se pintan encima:
              sin eso, un blanco al 50% caería sobre el nombre y el correo. */}
          <div className="glass glass-spec p-4 sm:p-5">
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
                <p className="flex items-center gap-2.5 pt-1 text-ink-subtle">
                  <span className="ping" aria-hidden="true" />
                  {tc('responseTime')}
                </p>
              </address>
            </div>
          </div>
        </div>

        {/* ══ BARRA INFERIOR ═══════════════════════════════════════ */}
        <div className="mt-14 flex flex-col gap-4 border-t border-hairline pt-8 sm:mt-16 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-subtle">
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
