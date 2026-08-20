import type { Metadata } from 'next'
import Image from 'next/image'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Check,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Trophy,
  type LucideIcon,
} from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Carousel } from '@/components/ui/carousel'
import { ImageSlot } from '@/components/ui/image-slot'
import { PointerGlow } from '@/components/motion/pointer-glow'
import { PrintButton } from './print-button'
import { getPersonalInfo } from '@/data/personal'
import { getExperiences } from '@/data/experience'
import { getEducation } from '@/data/education'
import { getSkillCategories } from '@/data/skills'
import { getAwards } from '@/data/awards'
import { getCompanies } from '@/data/companies'
import { NAP, SEO_IMAGES, SOCIAL_LINKS, routeUrl } from '@/lib/constants'
import { generatePageMetadata } from '@/lib/seo'
import {
  generateWebPageSchema,
  generateBreadcrumbSchema,
  type SchemaGraph,
} from '@/lib/schema'
import { formatShortDate } from '@/lib/utils'
import { Locale } from '@/data/types'

/**
 * ════════════════════════════════════════════════════════════════
 * HOJA DE IMPRESIÓN — esto es lo que hace que la descarga sirva
 *
 * El botón de descarga llama a `window.print()`. Sin estas reglas lo que
 * saldría del diálogo es la PÁGINA WEB con los colores apagados: la barra de
 * cristal pegada arriba, el pie con sus cuatro columnas de enlaces, cuatro
 * campos de aurora que el papel no puede reproducir, carruseles con dos tercios
 * del contenido fuera del recorte y el nombre del CV literalmente en blanco
 * (`.grad-text` deja el texto transparente y se apoya en un fondo que no se
 * imprime).
 *
 * Lo que sale con estas reglas es un CV: tinta sobre papel, sin cromo, sin
 * cristal, sin sombras, con los carruseles convertidos en listas verticales,
 * con las URLs de los enlaces escritas y sin ningún puesto partido a la mitad
 * entre dos hojas.
 *
 * Va en un <style> de esta página y no en globals.css a propósito: son reglas
 * de UN documento. En la hoja global vivirían en todas las rutas, donde no
 * aplican.
 *
 * Sobre los colores: no hay ni un literal. --surface es el papel y --ink la
 * tinta (medida 15.7:1), los dos leídos de globals.css como cualquier otro
 * consumidor del sistema.
 * ════════════════════════════════════════════════════════════════
 */
const PRINT_STYLES = `
@page {
  margin: 14mm 15mm 16mm;
}

@media print {
  /* ── 1. Fuera el cromo del sitio y toda capa decorativa ──────────
     Nada de esto es el CV: el header es una barra de cristal pegada, el pie son
     cuatro columnas de navegación, y .aurora / .grain / .grid-fade /
     .pointer-glow son las cuatro capas de fondo del sistema: los campos de
     color saturados, el grano, la cuadrícula y el resplandor que sigue al
     puntero. Ninguna existe en una hoja — no hay puntero, y un fondo de color
     a sangre es lo primero que descarta un navegador al imprimir.

     [data-print-hide] marca lo que solo tiene sentido en pantalla: migas,
     botones, huecos de imagen y la banda de cierre.

     Los <button> se van todos: los únicos de esta página son el de imprimir
     (que ya está dentro de un [data-print-hide]) y las flechas de los
     carruseles, que en papel no llevan a ninguna parte. */
  header,
  footer,
  .aurora,
  .grain,
  .grid-fade,
  .pointer-glow,
  .cv-doc button,
  [data-print-hide] {
    display: none !important;
  }

  html,
  body,
  .cv-doc {
    background: var(--surface) !important;
    color: var(--ink) !important;
  }

  /* Colores sólidos, sin economía de tinta. Después de las reglas de abajo lo
     único que queda son bordes finos y texto, y son justo lo que el modo de
     ahorro aclara hasta dejarlo ilegible. */
  .cv-doc {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* ── 2. Red de seguridad para .defer-paint ───────────────────────
     .defer-paint ya NO usa content-visibility: costaba un recálculo de estilo
     por frame para siempre (ver la nota en globals.css), así que hoy solo hace
     "contain: layout" y no deja nada sin pintar. Esta regla se queda como
     salvaguarda: si alguien vuelve a poner content-visibility, al imprimir
     saldrían secciones enteras en blanco, porque para el navegador nunca
     entraron al viewport. */
  .cv-doc .defer-paint {
    contain: none !important;
    content-visibility: visible !important;
    contain-intrinsic-size: auto !important;
  }

  /* ── 3. Ni cristal, ni sombras, ni desenfoque, ni 3D, ni animación ──
     "backdrop-filter" no tiene nada detrás que desenfocar en una hoja y las
     sombras teñidas de azul se imprimen como manchas grises.

     "transform: none" apaga de una vez las tres familias de 3D del sistema:
     .tilt (la inclinación que sigue al puntero), .tilt-hover y .stack-3d. Una
     tarjeta rotada en papel es una tarjeta torcida. Con ella se van también
     "perspective" y "transform-style", que si se quedaran dejarían cajas
     aplanadas en un contexto 3D huérfano.

     "animation: none" no es cosmético: las secciones usan .reveal, que anima
     desde "opacity: 0" con "animation-timeline: view()" y "both". Fuera de su
     rango la entrada se queda en el fotograma inicial — o sea invisible. Al
     imprimir no hay scroll que recorra ningún rango, así que sin esta línea
     media página sale vacía. */
  .cv-doc,
  .cv-doc *,
  .cv-doc *::before,
  .cv-doc *::after {
    animation: none !important;
    transition: none !important;
    transform: none !important;
    opacity: 1 !important;
    filter: none !important;
    box-shadow: none !important;
    text-shadow: none !important;
    -webkit-backdrop-filter: none !important;
    backdrop-filter: none !important;
    perspective: none !important;
    transform-style: flat !important;
  }

  /* ── 4. Superficies sólidas: sin tarjetas, sin cristal ───────────
     En pantalla las tarjetas agrupan. En papel, veinte cajas con borde son
     ruido: el contenido fluye y la jerarquía la marcan los encabezados.

     El selector .glass cubre las cinco variantes del material — .glass-strong,
     .glass-tint, .glass-spec y .glass-rim siempre van acompañadas de .glass —,
     y con ellas se va el relleno translúcido: en papel no hay nada detrás con
     lo que mezclar, así que un blanco al 62% solo aclara la tinta. El reflejo
     especular es un pseudo-elemento con gradiente y se apaga aparte. */
  .cv-doc section,
  .cv-doc .card,
  .cv-doc .glass {
    background-color: transparent !important;
    background-image: none !important;
    border: 0 !important;
    border-radius: 0 !important;
  }
  .cv-doc .card,
  .cv-doc .glass {
    padding: 0 0 2mm !important;
  }
  .cv-doc .glass-spec::before {
    display: none !important;
  }

  /* ── 5. El texto con gradiente recortado se imprime INVISIBLE ────
     .grad-text deja "-webkit-text-fill-color: transparent" y se apoya en un
     background-image que el papel no reproduce. Sin esta regla el cargo del
     encabezado del CV sale en blanco sobre blanco. */
  .cv-doc .grad-text {
    background-image: none !important;
    color: var(--ink) !important;
    -webkit-text-fill-color: var(--ink) !important;
  }

  /* ── 6. Y los rellenos de gradiente llevan texto blanco ──────────
     Mismo problema al revés: sin su fondo, blanco sobre blanco. .grad-soft
     entra en la lista porque es el fondo de dos bandas de esta página. */
  .cv-doc .grad-fill,
  .cv-doc .grad-deco,
  .cv-doc .grad-soft,
  .cv-doc .grad-drift {
    background-image: none !important;
    background-color: transparent !important;
    color: var(--ink) !important;
  }
  .cv-doc .grad-drift::before {
    display: none !important;
  }

  /* Las píldoras pierden su fondo, así que su texto de marca pasa a tinta y
     la etiqueta se dibuja con un borde, que sí se imprime. */
  .cv-doc .eyebrow {
    background: transparent !important;
    color: var(--ink-subtle) !important;
    padding-left: 0 !important;
  }
  .cv-doc .eyebrow::before {
    display: none !important;
  }
  .cv-doc [data-slot="badge"] {
    background: transparent !important;
    color: var(--ink) !important;
    border: 1px solid var(--control) !important;
  }

  /* ── 7. Tipografía en puntos ─────────────────────────────────────
     Las escalas de pantalla son clamp() con vw, y al imprimir "vw" es el
     ancho de la hoja: los títulos salían del tamaño equivocado. */
  .cv-doc {
    font-size: 10pt !important;
    line-height: 1.45 !important;
  }
  .cv-doc h1 {
    font-size: 21pt !important;
    line-height: 1.12 !important;
  }
  .cv-doc h2 {
    font-size: 13pt !important;
    line-height: 1.2 !important;
  }
  .cv-doc h3 {
    font-size: 11pt !important;
    line-height: 1.25 !important;
  }
  .cv-doc .text-lead {
    font-size: 10.5pt !important;
    line-height: 1.45 !important;
  }

  /* ── 8. Compactar ────────────────────────────────────────────────
     En pantalla hay 5 rem de aire arriba y abajo de cada sección. En una hoja
     eso es media página vacía por sección.

     "overflow: visible" es obligatorio, no cosmético: las secciones con aurora
     llevan "overflow-hidden" para recortar los campos de color, y una caja con
     overflow recortado no puede repartir su contenido entre dos páginas — lo
     corta. */
  .cv-doc section {
    padding: 0 !important;
    margin: 0 !important;
    overflow: visible !important;
    isolation: auto !important;
  }
  .cv-doc [data-print-tight] {
    max-width: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  .cv-doc section + section {
    margin-top: 6mm !important;
    padding-top: 4mm !important;
    border-top: 1px solid var(--ink-subtle) !important;
  }

  /* ── 9. Cortes de página ─────────────────────────────────────────
     Un puesto partido entre dos hojas es la razón por la que los CV impresos
     se ven mal, y un encabezado solo al pie de página es la segunda.
     [data-print-keep] está en cada puesto de la línea de tiempo, en cada
     credencial, en cada premio y en cada idioma. */
  .cv-doc h1,
  .cv-doc h2,
  .cv-doc h3 {
    break-after: avoid;
    page-break-after: avoid;
  }
  .cv-doc [data-print-keep] {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  /* ── 10. La línea de tiempo se aplana ────────────────────────────
     Su riel y su punto son gradiente decorativo: sin fondo no existen, así que
     la rejilla de dos columnas se vuelve una sola. */
  .cv-doc [data-print-flat] {
    display: block !important;
  }

  /* ── 11. Los carruseles se vuelven listas ────────────────────────
     Un carril es una caja con "overflow-x: auto": en pantalla se arrastra, en
     papel se recorta y se pierde todo lo que no cabía en el primer pantallazo.
     En bloque, cada lámina pasa a ser un elemento de una lista vertical y el
     contenido completo se imprime — que es exactamente lo que ya ve un
     crawler, porque el carrusel nunca escondió nada en JavaScript.

     El ancho fijo de cada lámina (w-[17rem] y compañía) también se va: en una
     hoja con 180 mm útiles dejaría dos tercios de la línea en blanco.

     La máscara de los extremos se apaga por separado porque no vive en el
     carril sino en .rail-mask, y una máscara sí se imprime: difuminaría el
     primer y el último elemento hasta hacerlos desaparecer. */
  .cv-doc .rail {
    display: block !important;
    overflow: visible !important;
    padding: 0 !important;
  }
  .cv-doc .rail-mask {
    -webkit-mask-image: none !important;
    mask-image: none !important;
  }
  .cv-doc .rail > * {
    width: auto !important;
    max-width: none !important;
    break-inside: avoid;
    page-break-inside: avoid;
  }
  .cv-doc .rail > * + * {
    margin-top: 3mm !important;
  }

  /* ── 12. En papel no se puede hacer clic ─────────────────────────
     Un enlace impreso sin su destino es una referencia perdida. Solo los
     absolutos: los internos ya se leen por su texto y su URL sería ruido. */
  .cv-doc a {
    color: var(--ink) !important;
    text-decoration: underline;
    text-underline-offset: 0.15em;
  }
  .cv-doc a[href^="http"]::after {
    content: " (" attr(href) ")";
    font-size: 0.82em;
    font-weight: 400;
    color: var(--ink-subtle);
    word-break: break-all;
  }
}
`

/**
 * ════════════════════════════════════════════════════════════════
 * CAPAS DE FONDO — el conjunto que hace visible el cristal
 *
 * Aurora + grano + cuadrícula, en ese orden, y las tres juntas porque son
 * inseparables: el cristal solo existe si hay algo saturado detrás que
 * difuminar. Sobre un fondo casi blanco un panel translúcido se ve exactamente
 * igual que un panel blanco, y eso era lo que hacía invisible el material.
 *
 * Los cuatro <i> son obligatorios: cada uno es un campo de color distinto
 * (azul de marca, cian, cielo, y un brillo blanco para que la mezcla no se vea
 * plana). Todos se mueven con `transform`, así que mientras el navegador los
 * pueda componer cuestan cero recálculos de estilo.
 *
 * ── CUÁNTAS CABEN, MEDIDO ──
 * TRES secciones con aurora por página, y ni una más. Con cinco se agota el
 * presupuesto de capas compuestas, el navegador devuelve las animaciones al
 * hilo principal y toda animación en bucle empieza a costar un recálculo de
 * estilo por frame: 180 en 3 s en reposo contra un presupuesto de 20.
 *
 * Aquí las tres son las que más cristal llevan encima: la cabecera, la línea de
 * tiempo de experiencia y el carrusel del stack. Las demás bandas ponen su
 * color con `.grad-soft`, que es un `background-image` fijo: no se anima, así
 * que no cuesta ninguna capa.
 *
 * Y es `.grad-soft` y NO `bg-ground-tint`, que era el otro candidato: el tinte
 * plano queda tan cerca del blanco que un panel translúcido encima se ve
 * idéntico a un panel blanco. Es el mismo error que hacía invisible el cristal
 * en la versión anterior del sitio. Toda banda que lleve cristal necesita
 * detrás o aurora o `.grad-soft`.
 * Verifica: node scripts/perf-probe.mjs http://localhost:3000/es/cv
 *
 * `glow` monta el resplandor que sigue al puntero. Solo se enciende en la
 * cabecera: cada instancia añade un listener de `pointermove` y una lectura de
 * geometría por frame, así que repetirlo en todas las secciones no es gratis.
 * ════════════════════════════════════════════════════════════════
 */
function Backdrop({ glow = false }: { glow?: boolean }) {
  return (
    <>
      <div className="aurora" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="grain" aria-hidden="true" />
      <div className="grid-fade" aria-hidden="true" />
      {glow ? <PointerGlow /> : null}
    </>
  )
}

/**
 * ════════════════════════════════════════════════════════════════
 * PRESUPUESTO DE REVELADOS AL SCROLL — medido en esta página
 *
 * `.reveal`, `.reveal-3d`, `.reveal-scale` y `.reveal-stagger` son animaciones
 * con `animation-timeline: view()`. Mientras su elemento no ha entrado a
 * pantalla, para el navegador la animación está EN CURSO, y cada una gasta una
 * de las mismas capas compuestas que consumen la aurora (cuatro por sección),
 * `.grad-drift` y `.float`.
 *
 * Cuando ese presupuesto se agota, el navegador devuelve TODAS las animaciones
 * al hilo principal y cada frame pasa a costar un recálculo de estilo — para
 * siempre, aunque nadie toque nada. Y la caída es un acantilado, no una
 * pendiente. Medido con scripts/perf-probe.mjs sobre esta misma página, con sus
 * tres auroras puestas:
 *
 *     revelados pendientes → recálculos de estilo en 3 s en reposo
 *              1           →    8    OK
 *              3           →    9    OK
 *              4           →   14    OK, pero sin margen
 *              5           →  180    MAL (presupuesto: 20)
 *
 * De ahí que esta página use TRES y ni uno más: el panel del resumen, la línea
 * de tiempo completa y la banda de cierre. Y de ahí que NINGUNA rejilla lleve
 * `.reveal-stagger`: esa clase pone una animación POR HIJO, así que una sola
 * rejilla de siete tarjetas se come el presupuesto entero. La versión anterior
 * de esta página tenía treinta y medía justo esos 180 — era una de las causas
 * reales del "se siente lento".
 *
 * El movimiento de las listas sale de otro lado, que no cuesta nada en reposo:
 * `.tilt-hover` (solo en hover) y las `.enter-*` de la cabecera, que son
 * animaciones normales — terminan y dejan de contar.
 *
 * Verifica: node scripts/perf-probe.mjs http://localhost:3000/es/cv
 * ════════════════════════════════════════════════════════════════
 */

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const en = locale === 'en'

  return generatePageMetadata({
    locale: locale as Locale,
    route: 'cv',
    title: en
      ? 'CV — Engineer, PMP, technical SEO'
      : 'CV — Ingeniero, PMP, SEO técnico',
    description: en
      ? 'Full CV of Carlos Anaya Ruiz: Tec de Monterrey engineer, PMP certified, TOEFL iBT 92, and four years across Amazon, Master Loyalty Group and Wan Hai Lines. Printable to PDF from the page itself.'
      : 'CV completo de Carlos Anaya Ruiz: ingeniero por el Tec de Monterrey, certificado PMP, TOEFL iBT 92 y cuatro años en Amazon, Master Loyalty Group y Wan Hai Lines. Imprimible a PDF desde la propia página.',
  })
}

export default async function CvPage({ params }: Props) {
  const { locale: rawLocale } = await params
  setRequestLocale(rawLocale)

  const locale = rawLocale as Locale
  const en = locale === 'en'

  const t = await getTranslations('cv')
  const tc = await getTranslations('common')
  const tt = await getTranslations('trust')
  const tl = await getTranslations('a11y')

  const personal = getPersonalInfo(locale)
  const experiences = getExperiences(locale)
  const education = getEducation(locale)
  const skillCategories = getSkillCategories(locale)
  const awards = getAwards(locale)
  const companies = getCompanies(locale)

  const cvUrl = routeUrl('cv', locale)

  /**
   * `awards.ts` guarda tres cosas distintas en un archivo, y su campo `kind`
   * existe justo para no imprimirlas como si fueran lo mismo: un examen
   * aprobado no es un premio. Las certificaciones van a su sección y solo las
   * distinciones reales quedan en Premios.
   */
  const certifications = awards.filter((award) => award.kind === 'certification')
  const recognitions = awards.filter((award) => award.kind !== 'certification')

  /**
   * El PMP no tiene fecha en ningún registro del repo. Inventarla en un CV
   * sería peor que omitirla — un dato falso que además cualquiera puede
   * verificar contra el registro del PMI —, así que `date` es nullable y la
   * fila dice "vigente" en lugar de un mes que nadie confirmó.
   */
  const credentials = [
    {
      id: 'pmp',
      name: 'Project Management Professional (PMP)',
      issuer: 'Project Management Institute',
      date: null as string | null,
    },
    ...certifications.map((award) => ({
      id: award.id,
      name: award.title,
      issuer: award.organization,
      date: award.date as string | null,
    })),
  ]

  /**
   * Un puesto se enlaza a su página de proyecto solo si esa empresa existe de
   * verdad en data/companies.ts. El cruce es por nombre porque es el único
   * campo que los dos archivos comparten: `experience.ts` usa ids propios
   * ('amazon-sde') y `companies.ts` slugs de URL ('amazon'). Si algún día un
   * nombre deja de coincidir, el puesto se queda sin enlace en lugar de
   * apuntar a un 404.
   */
  const companySlugByName = new Map(companies.map((c) => [c.name, c.slug]))

  /**
   * Los huecos de logo de la banda de experiencia. Salen del mismo cruce que
   * los enlaces, así que la ruta del archivo (`/logos/<slug>.png`) nunca
   * apunta a una empresa que no exista en los datos — y si mañana se agrega un
   * puesto que sí tiene ficha, su hueco aparece solo.
   */
  const employers = experiences.flatMap((exp) => {
    const slug = companySlugByName.get(exp.company)
    return slug ? [{ name: exp.company, slug }] : []
  })

  /**
   * Las dos credenciales que acompañan al retrato. Salen de las mismas claves
   * de `trust` que usa la home, así que el emisor y el matiz no se reescriben
   * aquí — y las dos son verificables en la carpeta pública que enlaza la
   * sección de certificaciones. Ni una cifra que no se pueda enseñar.
   */
  const heroCredentials = [
    {
      label: tt('metrics.certifiedLabel'),
      value: 'PMP',
      issuer: tt('metrics.pmpIssuer'),
    },
    {
      label: tt('metrics.toeflLabel'),
      value: '92',
      issuer: tt('metrics.toeflHint'),
    },
  ]

  /** Contacto. Todo sale de NAP y SOCIAL_LINKS, nunca de un literal. */
  const contactRows: {
    id: string
    label: string
    icon: LucideIcon
    node: React.ReactNode
  }[] = [
    {
      id: 'email',
      label: t('contact.email'),
      icon: Mail,
      node: (
        <a href={`mailto:${NAP.email}`} className="hover:text-brand-strong">
          {NAP.email}
        </a>
      ),
    },
    {
      id: 'phone',
      label: t('contact.phone'),
      icon: Phone,
      node: (
        <a href={`tel:${NAP.phone}`} className="hover:text-brand-strong">
          {NAP.phoneDisplay}
        </a>
      ),
    },
    {
      id: 'location',
      label: t('contact.location'),
      icon: MapPin,
      node: personal.location,
    },
    {
      id: 'linkedin',
      label: t('contact.linkedin'),
      icon: Linkedin,
      node: (
        <a
          href={SOCIAL_LINKS.linkedin}
          target="_blank"
          rel="me noopener noreferrer"
          className="hover:text-brand-strong"
        >
          LinkedIn
        </a>
      ),
    },
    {
      id: 'github',
      label: t('contact.github'),
      icon: Github,
      node: (
        <a
          href={SOCIAL_LINKS.github}
          target="_blank"
          rel="me noopener noreferrer"
          className="hover:text-brand-strong"
        >
          {SOCIAL_LINKS.github.replace(/^https:\/\//, '')}
        </a>
      ),
    },
  ]

  /**
   * WebPage + BreadcrumbList, no un segundo ProfilePage.
   *
   * `generateProfilePageGraph` está atado a la ruta /sobre-mi, y esa página ya
   * es la ProfilePage canónica de la entidad. Declarar aquí una segunda con el
   * mismo `mainEntity` pondría dos URLs compitiendo por ser el perfil de la
   * misma persona. `buildPageNode` ya enlaza `about` → #person, y los hechos
   * de la entidad (título, PMP, TOEFL, empleadores) viven en el Person del
   * layout, que se emite en todas las rutas: aquí no se repiten.
   */
  const cvGraph: SchemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      generateWebPageSchema({
        locale,
        route: 'cv',
        name: 'CV — Carlos Anaya Ruiz',
        description: en
          ? 'Complete professional record of Carlos Anaya Ruiz: education, roles, certifications, recognitions, stack and languages, on a single printable page.'
          : 'Trayectoria profesional completa de Carlos Anaya Ruiz: formación, puestos, certificaciones, reconocimientos, stack e idiomas, en una sola página imprimible.',
        hasBreadcrumb: true,
        showsPrimaryImage: true,
      }),
      generateBreadcrumbSchema(
        [
          { name: en ? 'Home' : 'Inicio', route: 'home' },
          { name: t('title'), route: 'cv' },
        ],
        locale,
        cvUrl
      ),
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cvGraph) }}
      />
      {/* Mismo patrón que el JSON-LD de arriba: la cadena entra tal cual, sin
          que React la trate como hijo de texto.

          El <style> se queda aquí, en el cuerpo, y NO se sube al <head> con
          `precedence`. Es deliberado: el hoisting de React 19 mete una capa
          entre esta hoja y el documento, y si algo de esa capa falla lo que se
          pierde es justo la hoja de impresión — o sea, la única razón por la
          que el botón de descarga sirve. Un <style> en el cuerpo lo aplican
          todos los navegadores desde siempre. */}
      <style dangerouslySetInnerHTML={{ __html: PRINT_STYLES }} />

      <div className="cv-doc">
        {/* ══ CABECERA ══════════════════════════════════════════════
            Aurora + grano + cuadrícula + resplandor del puntero: cuatro capas
            decorativas, todas en -z-10, ninguna captura eventos y todas
            desaparecen al imprimir.                                        */}
        <section className="relative isolate overflow-hidden">
          <Backdrop glow />

          <div
            data-print-tight=""
            className="mx-auto w-full max-w-6xl px-5 pb-16 pt-10 sm:px-8 sm:pb-20 sm:pt-14"
          >
            <div data-print-hide="">
              <Breadcrumbs items={[{ label: t('title') }]} />
            </div>

            <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-16">
              <div className="max-w-2xl">
                <p className="eyebrow enter-scale">{t('eyebrow')}</p>

                {/* El nombre y el cargo son un solo encabezado: es el título
                    del documento, igual que en un CV en papel. El gradiente
                    cae sobre el cargo y no sobre el nombre completo — un h1
                    entero recortado pierde legibilidad.

                    `text-ink` y nada más suave: este titular va DIRECTO sobre
                    la aurora, sin cristal de por medio, y ahí solo la tinta
                    plena mide (10.2:1). `ink-muted` cae a 3.83 y no pasa. */}
                <h1 className="enter-blur step-1 mt-6 text-d1 text-ink">
                  {personal.name}
                  <span className="grad-text mt-3 block text-d3 font-semibold">
                    {personal.title}
                  </span>
                </h1>

                {/* ── POR QUÉ TODO ESTO VA DENTRO DE CRISTAL ──
                    Medido: sobre la aurora `text-ink-muted` cae a 3.83:1 y
                    `text-ink-subtle` a 3.23:1, y ninguno pasa. Dentro de
                    `.glass-strong` el muted mide 5.1 y el subtle 4.54, y los
                    dos sí. De ahí que el panel sea `strong` y no el cristal por
                    defecto, donde el subtle se queda en 4.30 — doce puntos de
                    opacidad que a ojo no se notan y deciden si pasa o no. */}
                <div className="glass glass-strong glass-spec enter step-2 mt-8 p-6 sm:p-7">
                  <p className="text-ink-muted">{t('lead')}</p>

                  {/* El correo abre el cliente de correo y el teléfono marca;
                      en papel los dos quedan como texto legible, que es para
                      lo que sirven ahí. */}
                  <dl
                    data-print-keep=""
                    className="mt-7 grid gap-x-8 gap-y-3 border-t border-hairline pt-6 sm:grid-cols-2"
                  >
                    {contactRows.map((row) => {
                      const Icon = row.icon
                      return (
                        <div
                          key={row.id}
                          className="flex items-center gap-2.5 text-sm"
                        >
                          <Icon
                            className="size-4 shrink-0 text-sky-ink"
                            aria-hidden="true"
                          />
                          {/* La etiqueta es para lectores de pantalla: un
                              correo y un teléfono se explican solos a la
                              vista, pero en una lista leída en voz alta no. */}
                          <dt className="sr-only">{row.label}</dt>
                          <dd className="text-ink-muted">{row.node}</dd>
                        </div>
                      )
                    })}
                  </dl>

                  <div
                    data-print-hide=""
                    className="mt-7 flex flex-wrap items-center gap-4"
                  >
                    {/* Aquí NO va `variant="glass"`: sería cristal dentro de
                        cristal, que difumina dos veces, cuesta el doble y se ve
                        peor. Dentro de un panel, los botones son el relleno de
                        marca y `outline`. */}
                    <PrintButton label={t('download')} />
                    <Button asChild variant="outline" size="lg">
                      <Link href="/contacto">{t('ctaLink')}</Link>
                    </Button>
                  </div>

                  <p
                    data-print-hide=""
                    className="mt-4 max-w-[52ch] text-sm text-ink-subtle"
                  >
                    {t('downloadHint')}
                  </p>
                </div>

                {/* Solo en papel: una hoja impresa se separa de su origen en
                    cuanto se reenvía, así que lleva escrito de dónde salió. */}
                <p className="hidden text-sm text-ink-muted print:block">
                  {t('printedFrom')} {cvUrl}
                </p>
              </div>

              {/* ── RETRATO ──
                  Anillo de gradiente que se desplaza por detrás y el conjunto
                  completo flotando con `.float`.

                  El anillo vive en capa absoluta, así que al moverse no
                  desplaza nada (cero CLS). Y `.float` va en ESTE envoltorio y
                  nunca en un panel de cristal: mover algo con `backdrop-filter`
                  obliga a rerasterizar el desenfoque en cada frame, la misma
                  trampa que `filter: blur()` sobre algo en movimiento. Aquí
                  dentro solo hay una imagen y un gradiente, así que flotar
                  cuesta un `transform` compuesto y nada más.

                  Está sobre el pliegue en todos los breakpoints, así que la
                  imagen nunca se carga en diferido. */}
              <div className="enter-scale step-2 flex flex-col items-center gap-6 lg:w-64 lg:items-stretch">
                <div className="float relative mx-auto w-fit">
                  {/* Dos capas a propósito: `.grad-drift` fija
                      `position: relative` y ganaría a la utilidad `absolute`
                      (está fuera de @layer), así que el posicionamiento vive
                      en el envoltorio y el gradiente que se desplaza vive
                      dentro. */}
                  <div
                    className="absolute -inset-2 opacity-90"
                    aria-hidden="true"
                  >
                    <div className="grad-drift size-full rounded-[2rem]" />
                  </div>
                  <div className="relative size-32 overflow-hidden rounded-3xl border-2 border-surface bg-ground-tint shadow-lift-3 sm:size-40 lg:size-48">
                    <Image
                      src={SEO_IMAGES.avatar}
                      alt={SEO_IMAGES.avatarAlt[locale]}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 192px, (min-width: 640px) 160px, 128px"
                      priority
                    />
                  </div>
                </div>

                {/* ── CREDENCIALES DE CABECERA ──
                    Dos hechos verificables junto al retrato, que es lo primero
                    que se lee de un CV. Sin ellos la columna del retrato queda
                    vacía de la mitad hacia abajo en escritorio.

                    Los dos paneles son `.glass-strong` y no `.glass`: el
                    emisor es `text-ink-subtle`, que sobre el cristal por
                    defecto mide 4.30 y no pasa; sobre `strong`, 4.54 y sí.

                    Se van al imprimir porque el papel ya trae las dos, con su
                    emisor y su fecha, en la sección de certificaciones: en una
                    hoja repetirlas es ruido, en pantalla es jerarquía. */}
                <dl
                  data-print-hide=""
                  className="grid w-full grid-cols-2 gap-4 lg:grid-cols-1"
                >
                  {heroCredentials.map((credential) => (
                    <div
                      key={credential.label}
                      className="glass glass-strong glass-spec p-4"
                    >
                      <dt className="text-xs font-bold uppercase tracking-wider text-ink-subtle">
                        {credential.label}
                      </dt>
                      <dd
                        data-numeric=""
                        className="grad-text mt-1 font-display text-2xl font-bold leading-none"
                      >
                        {credential.value}
                      </dd>
                      <dd className="mt-2 text-xs leading-snug text-ink-muted">
                        {credential.issuer}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* ══ RESUMEN PROFESIONAL ═══════════════════════════════════
            Banda con `.grad-soft` en vez de aurora: el presupuesto de auroras
            de esta página está gastado en la cabecera, la línea de tiempo y el
            stack. `.grad-soft` es un `background-image` fijo, así que da el
            color que el cristal necesita detrás sin costar ni un frame.     */}
        <section id="resumen" className="grad-soft border-y border-hairline">
          <div
            data-print-tight=""
            className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20"
          >
            <h2 className="text-d2 text-ink">{t('summary')}</h2>

            {/* Entra girando desde atrás con `.reveal-3d`, que es CSS puro
                (`animation-timeline: view()`). En un navegador sin soporte el
                bloque @supports no aplica y el panel simplemente está visible:
                ningún contenido depende de que algo corra. */}
            <div
              data-print-keep=""
              className="glass glass-spec reveal-3d mt-7 p-6 sm:p-8"
            >
              <div className="prose-rich">
                {personal.summary.split('\n\n').map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ EXPERIENCIA ═══════════════════════════════════════════
            Aurora número dos: es la sección con más cristal de la página, un
            panel por puesto.                                               */}
        <section
          id="experiencia"
          className="relative isolate overflow-hidden border-b border-hairline"
        >
          <Backdrop />

          <div
            data-print-tight=""
            className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20"
          >
            <h2 className="text-d2 text-ink">{t('experience')}</h2>
            {/* La nota es `ink-muted`, así que sobre la aurora va en cristal. */}
            <div className="glass glass-strong glass-spec mt-6 max-w-2xl px-5 py-4">
              <p className="text-ink-muted">{t('experienceNote')}</p>
            </div>

            {/* ── DÓNDE HE TRABAJADO ──
                Los huecos de logo van FUERA de cualquier panel de cristal: la
                etiqueta de un hueco ya es un panel de cristal, y anidar
                `backdrop-filter` difumina dos veces y cuesta el doble.

                En papel se van: un patrón de color con una ruta de archivo
                escrita encima no es contenido de un CV.                      */}
            <div data-print-hide="" className="mt-10">
              <p className="text-sm font-semibold text-ink">
                {tt('companiesLabel')}
              </p>
              <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {employers.map((employer) => (
                  <li key={employer.slug}>
                    <ImageSlot
                      path={`/logos/${employer.slug}.png`}
                      alt={tt('logoAlt', { company: employer.name })}
                      hint="Logo"
                      width={320}
                      height={160}
                      sizes="(min-width: 640px) 300px, 45vw"
                      className="lift h-24 w-full rounded-xl shadow-lift-1"
                    />
                  </li>
                ))}
              </ul>
            </div>

            {/* ── LÍNEA DE TIEMPO ──
                Un panel de cristal por puesto y un riel de gradiente a la
                izquierda. El punto y el conector son decorativos y viven en
                capa absoluta, así que no empujan el panel ni un píxel. Cada
                fecha es un <time> real, o sea legible por máquina.

                El 3D va repartido como manda el sistema: `.scene` (la
                perspectiva) en la LISTA y `.tilt-hover` (la rotación) en cada
                puesto. Así los tres comparten un mismo punto de fuga, que es
                exactamente lo que separa un 3D creíble de tres tarjetas
                girando cada una por su cuenta.

                Y la inclinación va en un envoltorio, no en el panel: `.glass`
                lleva `contain: paint` y aplanaría el 3D de sus hijos. El radio
                del envoltorio es el mismo del material (`rounded-2xl` resuelve
                a `--radius-2xl`, que es el que fija `.glass`), para que la
                sombra del hover caiga justo en el borde del panel.          */}
            <ol className="scene reveal mt-12 space-y-6">
              {experiences.map((exp, index) => {
                const slug = companySlugByName.get(exp.company)

                return (
                  <li
                    key={exp.id}
                    data-print-flat=""
                    data-print-keep=""
                    className="relative grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-4 sm:grid-cols-[2rem_minmax(0,1fr)] sm:gap-x-6"
                  >
                    <div
                      className="relative"
                      aria-hidden="true"
                      data-print-hide=""
                    >
                      <span className="grad-deco absolute left-1/2 top-7 size-3.5 -translate-x-1/2 rounded-full shadow-glow-brand" />
                      {/* El conector solo baja si hay una entrada siguiente. */}
                      {index < experiences.length - 1 ? (
                        <span className="grad-deco absolute -bottom-[3.25rem] left-1/2 top-12 w-0.5 -translate-x-1/2 rounded-full opacity-40" />
                      ) : null}
                    </div>

                    <article className="tilt-hover rounded-2xl">
                      <div className="glass glass-spec p-6 sm:p-7">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                          <p
                            data-numeric=""
                            className="text-sm font-semibold text-brand-strong"
                          >
                            <time dateTime={exp.startDate}>
                              {formatShortDate(exp.startDate, locale)}
                            </time>
                            {' – '}
                            {exp.endDate ? (
                              <time dateTime={exp.endDate}>
                                {formatShortDate(exp.endDate, locale)}
                              </time>
                            ) : (
                              <span>{tc('present')}</span>
                            )}
                          </p>
                          {/* `ink-muted` y no `ink-subtle`: este panel es
                              `.glass` a secas (62%), donde el subtle mide 4.30
                              y no pasa. El muted mide 5.1 y sí. */}
                          <span className="text-sm text-ink-muted">
                            {exp.location}
                          </span>
                          {exp.current ? (
                            <Badge variant="gradient">{t('currentRole')}</Badge>
                          ) : null}
                        </div>

                        <h3 className="mt-3 text-d3 text-ink">
                          {exp.position}
                        </h3>
                        <p className="mt-1.5 font-semibold text-ink-muted">
                          {exp.company}
                        </p>
                        <p className="mt-4 text-ink-muted">{exp.description}</p>

                        {exp.highlights.length > 0 ? (
                          <ul className="mt-5 space-y-2.5">
                            {exp.highlights.map((highlight) => (
                              <li
                                key={highlight}
                                className="flex gap-2.5 text-sm leading-relaxed text-ink-muted"
                              >
                                <Check
                                  className="mt-0.5 size-4 shrink-0 text-sky-ink"
                                  aria-hidden="true"
                                />
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}

                        {exp.technologies && exp.technologies.length > 0 ? (
                          <ul className="mt-6 flex flex-wrap gap-1.5">
                            {exp.technologies.map((tech) => (
                              <li key={tech}>
                                <Badge variant="neutral">{tech}</Badge>
                              </li>
                            ))}
                          </ul>
                        ) : null}

                        {/* La ruta es dinámica, así que el href va como objeto
                            con `params`: pasarla como string no compila, que es
                            exactamente lo que se quiere. */}
                        {slug ? (
                          <Link
                            href={{
                              pathname: '/proyectos/[slug]',
                              params: { slug },
                            }}
                            className="group press mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-strong"
                          >
                            {t('projectLink')}
                            <ArrowUpRight
                              className="size-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                              aria-hidden="true"
                            />
                          </Link>
                        ) : null}
                      </div>
                    </article>
                  </li>
                )
              })}
            </ol>
          </div>
        </section>

        {/* ══ FORMACIÓN ═════════════════════════════════════════════ */}
        <section
          id="formacion"
          className="defer-paint grad-soft border-b border-hairline"
        >
          <div
            data-print-tight=""
            className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20"
          >
            <h2 className="text-d2 text-ink">{t('education')}</h2>

            {/* Dos elementos: caben en cristal de sobra. La perspectiva en la
                lista, la rotación en cada elemento. */}
            <ul className="scene mt-10 grid gap-6 md:grid-cols-2">
              {education.map((item) => (
                <li
                  key={item.id}
                  data-print-keep=""
                  className="tilt-hover rounded-2xl"
                >
                  <div className="glass glass-spec h-full p-6">
                    <p
                      data-numeric=""
                      className="text-sm font-semibold text-brand-strong"
                    >
                      <time dateTime={item.startDate}>{item.startDate}</time>
                      {' – '}
                      <time dateTime={item.endDate}>{item.endDate}</time>
                    </p>
                    {/* `degree` es la etiqueta localizada de la credencial, así
                        la especialización nunca se lee como un segundo
                        título. */}
                    <h3 className="mt-3 text-d3 text-ink">
                      {item.degree} {en ? 'in' : 'en'} {item.field}
                    </h3>
                    <p className="mt-2 text-sm text-ink-muted">
                      {item.institution} · {item.location}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ══ CERTIFICACIONES ═══════════════════════════════════════ */}
        <section
          id="certificaciones"
          className="defer-paint grad-soft border-b border-hairline"
        >
          <div
            data-print-tight=""
            className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20"
          >
            <div className="max-w-2xl">
              <h2 className="text-d2 text-ink">{t('certifications')}</h2>
              <p className="mt-3 text-ink-muted">{t('certificationsNote')}</p>
            </div>

            {/* Cada credencial es un hueco de imagen JUNTO a un panel de
                cristal, nunca dentro: la etiqueta del hueco ya es cristal, y
                dos paneles hermanos están bien mientras uno no esté metido en
                el otro. La ruta del archivo la escribe el propio hueco en
                pantalla, que es lo que hace visible dónde va cada documento. */}
            <ul className="scene mt-10 grid gap-6 lg:grid-cols-2">
              {credentials.map((credential) => (
                <li
                  key={credential.id}
                  data-print-keep=""
                  className="grid gap-4 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)]"
                >
                  <div data-print-hide="">
                    <ImageSlot
                      path={`/certificaciones/${credential.id}.png`}
                      alt={t('certImageAlt', { name: credential.name })}
                      hint="Diploma"
                      width={1200}
                      height={900}
                      sizes="(min-width: 640px) 176px, 100vw"
                      className="lift h-full min-h-40 rounded-2xl shadow-lift-2"
                    />
                  </div>

                  <div className="tilt-hover rounded-2xl">
                    <div className="glass glass-spec h-full p-6">
                      <span
                        data-print-hide=""
                        className="grad-deco inline-flex size-10 items-center justify-center rounded-xl text-white shadow-glow-brand"
                        aria-hidden="true"
                      >
                        <BadgeCheck className="size-5" />
                      </span>
                      <h3 className="mt-4 text-d3 text-ink">
                        {credential.name}
                      </h3>
                      <p className="mt-2 text-sm text-ink-muted">
                        {credential.issuer}
                      </p>
                      <p
                        data-numeric=""
                        className="mt-3 text-sm font-semibold text-brand-strong"
                      >
                        {credential.date ? (
                          <time dateTime={credential.date}>
                            {formatShortDate(credential.date, locale)}
                          </time>
                        ) : (
                          <span>{t('active')}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div
              data-print-hide=""
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Button asChild variant="outline">
                <Link href="/certificaciones">
                  {t('viewCertifications')}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              {/* Una carpeta que cualquiera puede abrir vale más que una
                  insignia dibujada: la afirmación queda verificable. */}
              <Button asChild variant="ghost">
                <a
                  href={SOCIAL_LINKS.certsDrive}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('viewFolder')}
                  <ExternalLink className="size-4" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* ══ PREMIOS ═══════════════════════════════════════════════ */}
        <section
          id="premios"
          className="defer-paint grad-soft border-b border-hairline"
        >
          <div
            data-print-tight=""
            className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20"
          >
            <div className="max-w-2xl">
              <h2 className="text-d2 text-ink">{t('awards')}</h2>
              <p className="mt-3 text-ink-muted">{t('awardsNote')}</p>
            </div>

            <ul className="scene mt-10 grid gap-6 lg:grid-cols-2">
              {recognitions.map((award) => (
                <li key={award.id} data-print-keep="" className="flex flex-col">
                  {/* El hueco va ARRIBA del panel y fuera de él, por la misma
                      razón que en las certificaciones. */}
                  <div data-print-hide="">
                    <ImageSlot
                      path={`/premios/${award.id}.png`}
                      alt={t('awardImageAlt', { title: award.title })}
                      hint="Reconocimiento"
                      width={1200}
                      height={750}
                      sizes="(min-width: 1024px) 540px, 100vw"
                      className="lift aspect-[16/10] w-full rounded-2xl shadow-lift-2"
                    />
                  </div>

                  <div className="tilt-hover mt-4 flex-1 rounded-2xl">
                    <div className="glass glass-spec flex h-full flex-col p-6">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <p
                          data-numeric=""
                          className="text-sm font-semibold text-brand-strong"
                        >
                          <time dateTime={award.date}>
                            {formatShortDate(award.date, locale)}
                          </time>
                        </p>
                        {/* Etiquetado por lo que realmente es: un lugar en un
                            hackathon y una distinción con nombre son
                            afirmaciones distintas. */}
                        <Badge variant="outline">
                          {award.kind === 'competition'
                            ? t('kindCompetition')
                            : t('kindRecognition')}
                        </Badge>
                      </div>

                      <h3 className="mt-4 text-d3 text-ink">{award.title}</h3>
                      <p className="mt-1.5 font-semibold text-ink-muted">
                        {award.organization}
                      </p>
                      <p className="mt-4 text-sm text-ink-muted">
                        {award.description}
                      </p>
                      {award.impact ? (
                        <p className="mt-4 flex gap-2.5 text-sm text-ink-muted">
                          <Trophy
                            className="mt-0.5 size-4 shrink-0 text-sky-ink"
                            aria-hidden="true"
                          />
                          <span>{award.impact}</span>
                        </p>
                      ) : null}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-9" data-print-hide="">
              <Button asChild variant="outline">
                <Link href="/premios">
                  {t('viewAwards')}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ══ STACK ═════════════════════════════════════════════════
            Aurora número tres, y la última. Siete categorías son más de las que
            caben cómodas en una rejilla, así que van en carrusel: el
            desplazamiento y el imán son nativos (`scroll-snap`), o sea que si
            el JS del componente no corre el carril sigue arrastrándose, y las
            siete láminas completas ya están en el HTML del servidor — un
            carrusel con estado en JS solo expone la primera.

            Al imprimir el carril se convierte en una lista vertical: regla 11
            de la hoja de impresión.                                         */}
        <section
          id="stack"
          className="relative isolate overflow-hidden border-b border-hairline"
        >
          <Backdrop />

          <div
            data-print-tight=""
            className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20"
          >
            <h2 className="text-d2 text-ink">{t('stack')}</h2>
            <div className="glass glass-strong glass-spec mt-6 max-w-2xl px-5 py-4">
              <p className="text-ink-muted">{t('stackNote')}</p>
              {/* `ink-subtle` exige `glass-strong`, que es lo que lleva este
                  panel: sobre `.glass` a secas mediría 4.30 y no pasaría. */}
              <p className="mt-2 text-sm text-ink-subtle">{tc('dragHint')}</p>
            </div>

            <Carousel
              label={tl('stackRail')}
              prevLabel={tl('prevSlide')}
              nextLabel={tl('nextSlide')}
              className="mt-8"
            >
              {skillCategories.map((category) => (
                /* `.scene` ya viene en el carril del carrusel, así que las
                   siete láminas comparten punto de fuga. La inclinación va en
                   el envoltorio y el cristal dentro: `.glass` lleva
                   `contain: paint` y aplanaría el 3D. */
                <div
                  key={category.category}
                  className="tilt-hover w-[17rem] rounded-2xl sm:w-[20rem]"
                >
                  <div className="glass glass-spec flex h-full flex-col p-5 sm:p-6">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-ink">
                      {category.label}
                    </h3>
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {category.skills.map((skill) => (
                        <li key={skill}>
                          <Badge variant="neutral">{skill}</Badge>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </section>

        {/* ══ IDIOMAS ═══════════════════════════════════════════════ */}
        <section
          id="idiomas"
          className="defer-paint grad-soft border-b border-hairline"
        >
          <div
            data-print-tight=""
            className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20"
          >
            <h2 className="text-d2 text-ink">{t('languages')}</h2>

            <dl className="scene mt-10 grid gap-5 sm:grid-cols-3">
              {personal.languages.map((language) => (
                <div
                  key={language.name}
                  data-print-keep=""
                  className="tilt-hover rounded-2xl"
                >
                  <div className="glass glass-spec h-full p-6">
                    <dt className="flex items-center justify-between gap-3">
                      <span className="font-display text-lg font-semibold text-ink">
                        {language.name}
                      </span>
                      {/* El nivel CEFR va impreso junto a la barra, no
                          implícito en su largo: la barra se deriva de este
                          mismo valor, así que no puede contradecir la etiqueta
                          — y en papel, donde la barra no se imprime, la
                          etiqueta sigue diciéndolo. */}
                      <span
                        data-numeric=""
                        className="grad-fill rounded-full px-2.5 py-0.5 text-xs font-bold"
                      >
                        {language.cefr}
                      </span>
                    </dt>
                    <dd>
                      <div
                        data-print-hide=""
                        className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-hairline-strong"
                        aria-hidden="true"
                      >
                        <div
                          className="grad-deco h-full rounded-full"
                          style={{ width: `${language.proficiency}%` }}
                        />
                      </div>
                      <p className="mt-3 text-sm text-ink-muted">
                        {language.level}
                      </p>
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ══ CIERRE ════════════════════════════════════════════════
            Solo en pantalla: una llamada a la acción no pertenece a un CV
            impreso.                                                        */}
        <section
          data-print-hide=""
          className="defer-paint mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20"
        >
          <div className="grad-drift reveal-scale rounded-3xl px-6 py-12 shadow-lift-3 sm:px-12 sm:py-16">
            <div className="relative max-w-2xl">
              <h2 className="text-d2 text-white">{t('ctaTitle')}</h2>
              <p className="mt-4 text-lead text-white/85">{t('ctaDesc')}</p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                {/* Sobre el gradiente el botón se invierte: `bg-none` apaga la
                    imagen del variant por defecto y deja superficie blanca con
                    texto de marca. Un relleno de marca aquí desaparecería. */}
                <Button
                  asChild
                  size="lg"
                  className="sheen bg-none bg-surface text-brand-strong hover:opacity-95"
                >
                  <Link href="/contacto">
                    {t('ctaLink')}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
                <a
                  href={`mailto:${NAP.email}`}
                  className="text-sm font-semibold text-white underline decoration-white/50 underline-offset-4 hover:decoration-white"
                >
                  {NAP.email}
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
