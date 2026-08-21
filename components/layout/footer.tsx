import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Github, Linkedin } from 'lucide-react'
import { NAP, SOCIAL_LINKS } from '@/lib/constants'
import type { StaticPathname } from '@/i18n/routing'
import { Newsletter } from '@/components/sections/newsletter'

/**
 * ════════════════════════════════════════════════════════════════
 * EL COLOFÓN
 *
 * Pie de página. Es la única superficie que comparten todas las URLs, así
 * que es donde vive el bloque NAP completo: el mismo nombre, la misma
 * localidad, el mismo correo y el mismo teléfono en cada página, todos
 * leídos de NAP en lib/constants.ts. Esa consistencia entre páginas —y
 * contra el JSON-LD del layout— es lo que permite a Google reconciliar la
 * entidad en lugar de adivinar entre tres variantes casi iguales.
 *
 * ── QUÉ CAMBIÓ Y POR QUÉ ──
 * Este era el último rincón del sitio que seguía en el sistema anterior
 * («aurora, cristal y profundidad»), y se notaba: un panel de cristal con
 * borde de cuatro lados y reflejo diagonal, un cuadro redondeado con las
 * iniciales, dos capas de textura de la aurora y cinco iconos coloreados
 * con un alias de azul. Nada de eso pertenece a «Papel Ahumado», donde no
 * hay tarjetas, no hay cantos redondeados y el único croma reservado es el
 * de una medición.
 *
 * Y era también el segundo hueco más grande de la página: la columna de
 * servicios acababa cien píxeles antes que la de navegación, así que
 * quedaba una franja muerta a lo ancho del pie. La lista de navegación
 * ahora se parte en dos columnas y las cuatro acaban a la misma altura.
 *
 * El pie va a sangre desde el canto del riel, igual que el nav y que el
 * contenido: `.sheet` es el único margen del documento.
 *
 * Server component: sin estado ni handlers, así que no manda JS al
 * navegador.
 * ════════════════════════════════════════════════════════════════
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
  const tnl = await getTranslations('newsletter')
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
   * entrantes.
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
   * Un enlace del pie es una FILA, no una píldora: alto táctil de 40 px y la
   * tinta que sube a papel al pasar. `.press` está escrita fuera de toda
   * `@layer` en globals.css, así que su `transition` le gana a cualquier
   * utilidad — poner también `transition-colors` dejaría una clase muerta.
   */
  const linkClass =
    'press inline-flex min-h-10 items-center text-sm text-ink-muted hover:text-ink'

  /* Sin `bg-ground`: es el mismo color que el body, así que lo único que hacía
     era tapar la hoja viva del fondo. La separación la da la regla. */
  return (
    <footer className="relative border-t border-hairline">
      <div className="sheet py-14 sm:py-16">
        {/* ══ LA CABECERA DEL COLOFÓN ══════════════════════════════
            El nombre a escala de titular y, a la derecha, lo único que
            de verdad está en curso: el tiempo de respuesta, con el
            punto que late. Es la misma pareja que abre la portada. */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-4">
          <Link href="/" className="press font-display text-d2 text-ink">
            {NAP.name}
          </Link>
          <p className="stamp flex items-center gap-2.5">
            <span className="live" aria-hidden="true" />
            {tc('responseTime')}
          </p>
        </div>

        <p className="mt-6 max-w-[62ch] text-sm leading-relaxed text-ink-muted">
          {t('description')}
        </p>

        {/* ══ ¿ERES CLIENTE? ═══════════════════════════════════════
            La pestaña de arrastre, en las quince páginas. Va aquí arriba y
            no entre los enlaces de navegación porque no es un destino más
            del sitio: es la OTRA intención. Quien ya trabaja conmigo no
            tiene por qué buscar su acceso entre veinte enlaces de un pie.

            Es el segundo —y último— enlace que manda fuera del dominio a
            propósito. El clic de mayor intención, el de quien todavía no ha
            contratado, se queda aquí. */}
        <p className="mt-8">
          <a className="pull-tab" href={SOCIAL_LINKS.clientPortal}>
            {t('clientArea')}
          </a>
        </p>

        {/* ══ EL BOLETÍN ═══════════════════════════════════════════
            Va ARRIBA de las columnas de enlaces y no debajo: es la única
            acción del pie que PIDE algo, y una lista de correo escondida
            bajo cuatro columnas de navegación es una lista que nadie
            rellena.

            Los textos entran ya traducidos como props. Es lo que evita
            arrastrar el diccionario de `next-intl` al cliente por trece
            cadenas — el componente es de cliente porque el resultado tiene
            que aparecer donde se escribió el correo, y un layout no recibe
            `searchParams`. Ver el encabezado del componente. */}
        <div className="mt-14 border-t border-hairline pt-10">
          <Newsletter
            locale={locale}
            privacyHref={`/${locale}${en ? '/privacy' : '/privacidad'}`}
            privacyLabel={tnl('privacy')}
            copy={{
              eyebrow: tnl('eyebrow'),
              title: tnl('title'),
              lead: tnl('lead'),
              label: tnl('label'),
              placeholder: tnl('placeholder'),
              submit: tnl('submit'),
              consent: tnl('consent'),
              ok: tnl('ok'),
              yaEstaba: tnl('yaEstaba'),
              invalido: tnl('invalido'),
              sinConfigurar: tnl('sinConfigurar'),
              error: tnl('error'),
            }}
          />
        </div>

        {/* ══ LAS CUATRO COLUMNAS ══════════════════════════════════
            Cada una abre con su regla superior, que es como se separa
            un bloque en este sistema. Sin cajas.

            La lista de navegación lleva ocho entradas contra cuatro de
            servicios, así que se parte en dos columnas con `columns-2`:
            las cuatro acaban a la misma altura y desaparece la franja
            muerta que quedaba debajo. */}
        <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,1.1fr)_minmax(0,1.1fr)]">
          <div className="border-t border-hairline pt-4">
            <FooterHeading>{t('services')}</FooterHeading>
            <ul className="mt-3">
              {services.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-hairline pt-4">
            <FooterHeading>{t('navigation')}</FooterHeading>
            <ul className="mt-3 sm:columns-2 sm:gap-x-8">
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
              Era el único panel de cristal del sitio: un rectángulo con
              borde y un reflejo blanco al 55% encima del correo. Ahora
              son filas, y los datos se identifican solos —un correo,
              un teléfono y una ciudad no necesitan un icono que los
              nombre—, así que se fueron también cinco iconos y su
              alias de azul heredado. */}
          <div className="border-t border-hairline pt-4">
            <FooterHeading>{t('contactTitle')}</FooterHeading>
            <address className="mt-3 not-italic">
              <p>
                <a href={`mailto:${NAP.email}`} className={linkClass}>
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
                  className={`${linkClass} tabular-nums`}
                  data-numeric=""
                >
                  {NAP.phoneDisplay}
                </a>
              </p>
              <p className="flex min-h-10 items-center text-sm text-ink-muted">
                {cityLine}
              </p>
              <p className="stamp mt-2 tabular-nums">19.4326 N / 99.1332 W</p>
            </address>
          </div>

          <div className="border-t border-hairline pt-4">
            <FooterHeading>{ta('socialLinks')}</FooterHeading>
            <ul className="mt-3">
              <li>
                <a
                  href={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="me noopener noreferrer"
                  className={`${linkClass} gap-2.5`}
                >
                  <Linkedin className="size-4 shrink-0" aria-hidden="true" />
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={SOCIAL_LINKS.github}
                  target="_blank"
                  rel="me noopener noreferrer"
                  className={`${linkClass} gap-2.5`}
                >
                  <Github className="size-4 shrink-0" aria-hidden="true" />
                  GitHub
                </a>
              </li>
            </ul>
            <p className="mt-4 max-w-[34ch] text-sm leading-relaxed text-ink-muted">
              {t('builtWith')}
            </p>
          </div>
        </div>

        {/* ══ BARRA INFERIOR ═══════════════════════════════════════ */}
        <div className="mt-14 flex flex-col gap-3 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="stamp">
            &copy; <span data-numeric="">{year}</span> {NAP.name}.{' '}
            {t('allRightsReserved')}
          </p>

          <ul className="flex flex-wrap items-center gap-x-8">
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
 * Rótulo de columna. Es una `.stamp` y nada más: el sistema no tiene puntos
 * de gradiente ni píldoras, y una etiqueta mono en versalitas ya dice todo
 * lo que un rótulo de navegación tiene que decir.
 */
function FooterHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="stamp">{children}</h2>
}
