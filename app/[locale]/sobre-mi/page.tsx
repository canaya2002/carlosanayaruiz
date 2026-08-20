import type { Metadata } from 'next'
import Image from 'next/image'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Check,
  ExternalLink,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Sparkles,
  Trophy,
} from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Carousel } from '@/components/ui/carousel'
import { ImageSlot } from '@/components/ui/image-slot'
import { Metric } from '@/components/ui/metric'
import { Counter } from '@/components/motion/counter'
import { PointerGlow } from '@/components/motion/pointer-glow'
import { Tilt3D } from '@/components/motion/tilt-3d'
import { getPersonalInfo } from '@/data/personal'
import { getExperiences } from '@/data/experience'
import { getEducation } from '@/data/education'
import { getSkillCategories } from '@/data/skills'
import { getAwards } from '@/data/awards'
import { NAP, SEO_IMAGES, SOCIAL_LINKS } from '@/lib/constants'
import { generatePageMetadata } from '@/lib/seo'
import { generateProfilePageGraph } from '@/lib/schema'
import { formatShortDate } from '@/lib/utils'
import { Locale } from '@/data/types'

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
 * Aquí las tres son las que más cristal llevan encima: la cabecera con la
 * composición 3D, el carrusel de experiencia y la banda de reconocimientos.
 * color con `.grad-soft`, que es un `background-image` fijo: no se anima, así
 * que no cuesta ninguna capa.
 *
 * Y es `.grad-soft` y NO `bg-ground-tint`, que era el otro candidato: el tinte
 * plano queda tan cerca del blanco que un panel translúcido encima se ve
 * idéntico a un panel blanco. Es el mismo error que hacía invisible el cristal
 * en la versión anterior del sitio. Toda banda que lleve cristal necesita
 * detrás o aurora o `.grad-soft`.
 * Verifica: node scripts/perf-probe.mjs http://localhost:3000/es/sobre-mi
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
 * De ahí que esta página use TRES y ni uno más: el panel del resumen, la
 * cabecera de experiencia y la banda de cierre. Y de ahí que NINGUNA rejilla
 * lleve `.reveal-stagger`: esa clase pone una animación POR HIJO, así que una
 * sola rejilla de siete tarjetas se come el presupuesto entero. La versión
 * anterior de esta página tenía treinta y medía justo esos 180 — era una de las
 * causas reales del "se siente lento".
 *
 * El movimiento de las listas sale de otro lado, que no cuesta nada en reposo:
 * `.tilt-hover` y `.lift` (solo en hover), los carruseles, y las `.enter-*` de
 * la cabecera, que son animaciones normales — terminan y dejan de contar.
 *
 * Verifica: node scripts/perf-probe.mjs http://localhost:3000/es/sobre-mi
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
    route: 'sobreMi',
    // La plantilla "| Carlos Anaya Ruiz" ya carga el nombre, así que el título
    // en sí no lo repite.
    title: en
      ? 'About — Engineer, PMP, technical SEO'
      : 'Sobre mí — Ingeniero, PMP, SEO técnico',
    description: en
      ? 'Computer Science engineer from Tec de Monterrey, PMP certified, TOEFL iBT 92, four years across Amazon, Master Loyalty Group and Wan Hai Lines.'
      : 'Ingeniero en Tecnologías Computacionales por el Tec de Monterrey, certificado PMP y cuatro años en Amazon, Master Loyalty Group y Wan Hai Lines.',
  })
}

export default async function AboutPage({ params }: Props) {
  const { locale: rawLocale } = await params
  setRequestLocale(rawLocale)

  const locale = rawLocale as Locale
  const en = locale === 'en'

  const t = await getTranslations('about')
  const tc = await getTranslations('common')
  const tn = await getTranslations('nav')
  const tt = await getTranslations('trust')
  const tl = await getTranslations('a11y')

  const personal = getPersonalInfo(locale)
  const experiences = getExperiences(locale)
  const education = getEducation(locale)
  const skillCategories = getSkillCategories(locale)
  const awards = getAwards(locale)

  // `awards.ts` modela tres cosas distintas en un mismo archivo. Un examen
  // aprobado no es un premio, así que las certificaciones se listan bajo
  // Certificaciones y solo las distinciones reales quedan en Reconocimientos.
  const certifications = awards.filter((award) => award.kind === 'certification')
  const recognitions = awards.filter((award) => award.kind !== 'certification')

  // El título, distinto de la especialización cursada dentro de él.
  const degree = education.find((item) => item.kind === 'degree')
  const degreeLine = degree
    ? `${degree.degree} ${en ? 'in' : 'en'} ${degree.field}`
    : null

  // El PMP no trae fecha en ningún registro de aquí, e inventarla sería peor
  // que omitirla — así que `date` es nullable y la fila dice "vigente".
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

  // Hechos de perfil, no métricas de marketing: cada línea se puede verificar
  // contra la carpeta de credenciales que se enlaza más abajo en esta página.
  const facts = [
    { term: en ? 'Role' : 'Rol', detail: personal.title, icon: Briefcase },
    { term: en ? 'Based in' : 'Base', detail: personal.location, icon: MapPin },
    ...(degree && degreeLine
      ? [
          {
            term: en ? 'Education' : 'Formación',
            detail: `${degreeLine} · ${degree.institution}`,
            icon: GraduationCap,
          },
        ]
      : []),
    {
      term: en ? 'Certification' : 'Certificación',
      detail: 'PMP · Project Management Institute',
      icon: BadgeCheck,
    },
  ]

  // Tres cifras, las tres derivadas de datos verificables: los años que ya
  // declara el resumen, el puntaje real del TOEFL y la cantidad de puestos que
  // contiene este mismo archivo de datos. Nada inventado.
  //
  // `float` alterna entre las dos duraciones que existen (6 s y 9 s) para que
  // las tres no respiren nunca en fase: una fila flotando en sincronía es
  // justo el efecto que delata el truco.
  const stats = [
    {
      value: <Counter value={4} suffix="+" />,
      label: en ? 'Years of experience' : 'Años de experiencia',
      hint: tt('engineerLabel'),
      float: 'float',
    },
    {
      value: <Counter value={92} />,
      label: 'TOEFL iBT',
      hint: en ? 'English C1 · ETS' : 'Inglés C1 · ETS',
      float: 'float-slow',
    },
    {
      value: <Counter value={experiences.length} />,
      label: en ? 'Roles in industry' : 'Roles en la industria',
      hint: tt('companies'),
      float: 'float',
    },
  ]

  const profiles = [
    {
      href: SOCIAL_LINKS.linkedin,
      label: 'LinkedIn',
      icon: Linkedin,
      external: true,
    },
    // Las dos cuentas, etiquetadas por su handle: dos enlaces que dijeran
    // "GitHub" serían indistinguibles para quien lee y para un lector de
    // pantalla.
    ...personal.github.map((url) => ({
      href: url,
      label: url.replace(/^https:\/\/github\.com\//, 'GitHub / '),
      icon: Github,
      external: true,
    })),
    {
      href: `mailto:${NAP.email}`,
      label: NAP.email,
      icon: Mail,
      external: false,
    },
  ]

  // El gradiente cae sobre los apellidos, no sobre el nombre completo: un h1
  // entero recortado pierde legibilidad, y así resalta la parte que esta
  // página posiciona como entidad. El texto renderizado es idéntico al dato.
  const [firstName, ...surnames] = personal.name.split(' ')
  const surname = surnames.join(' ')

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          // ProfilePage → mainEntity #person. Toda afirmación de ese grafo
          // — título, PMP, TOEFL, idiomas, empleadores — se renderiza abajo.
          __html: JSON.stringify(generateProfilePageGraph(locale)),
        }}
      />

      {/* ══ CABECERA ══════════════════════════════════════════════
          Aurora + grano + cuadrícula + resplandor del puntero: cuatro capas
          decorativas, todas en -z-10 y ninguna captura eventos.            */}
      <section className="relative isolate overflow-hidden">
        <Backdrop glow />

        <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-10 sm:px-8 sm:pb-20 sm:pt-14">
          <Breadcrumbs items={[{ label: t('title') }]} />

          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-center lg:gap-16">
            <div>
              <p className="eyebrow enter-scale">
                <Sparkles className="size-3.5" aria-hidden="true" />
                {t('title')}
              </p>

              {/* La persona es la entidad de la que habla esta página, así que
                  el nombre es el h1 y "Sobre mí" es la píldora de arriba.
                  `text-ink` porque va DIRECTO sobre la aurora: ahí solo la
                  tinta plena mide (10.2:1), el muted cae a 3.83. */}
              <h1 className="enter-blur step-1 mt-6 text-d1 text-ink">
                {surname ? (
                  <>
                    {firstName} <span className="grad-text">{surname}</span>
                  </>
                ) : (
                  personal.name
                )}
              </h1>

              {/* ── POR QUÉ EL TEXTO VA DENTRO DE CRISTAL ──
                  Medido: sobre la aurora `text-ink-muted` cae a 3.83:1 y
                  `text-ink-subtle` a 3.23:1, y ninguno pasa. Dentro de
                  `.glass-strong` el muted mide 5.1 y el subtle 4.54, y los dos
                  sí. De ahí que el panel sea `strong` y no el cristal por
                  defecto, donde el subtle se queda en 4.30 — doce puntos de
                  opacidad que a ojo no se notan y deciden si pasa o no. */}
              <div className="glass glass-strong glass-spec enter step-2 mt-8 max-w-2xl p-6 sm:p-7">
                <p className="text-lead text-ink-muted">{t('subtitle')}</p>
                <p className="mt-5 text-ink-muted">{t('lead')}</p>

                {/* Píldoras de identidad. Reusan el variant `subtle` del Button
                    para heredar el objetivo táctil de 44 px, el `.press` y el
                    hover del sistema, en lugar de inventar un borde propio.
                    `subtle` es un relleno opaco, así que no anida cristal. */}
                <ul className="mt-7 flex flex-wrap gap-2.5">
                  {profiles.map((profile) => {
                    const Icon = profile.icon
                    return (
                      <li key={profile.href}>
                        <Button
                          asChild
                          variant="subtle"
                          className="rounded-full text-sm"
                        >
                          <a
                            href={profile.href}
                            {...(profile.external
                              ? {
                                  target: '_blank',
                                  // rel="me" más `sameAs` en el schema Person
                                  // es lo que reconcilia estos perfiles en una
                                  // sola entidad.
                                  rel: 'me noopener noreferrer',
                                }
                              : {})}
                          >
                            <Icon className="size-4" aria-hidden="true" />
                            {profile.label}
                          </a>
                        </Button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>

            {/* ── COMPOSICIÓN EN TRES PLANOS ──
                `.scene` (la perspectiva) y `.stack-3d` (el reparto en
                profundidad al pasar el mouse) van en el MISMO elemento a
                propósito: la perspectiva solo alcanza a los hijos DIRECTOS, así
                que con el stack en un div interno las tres capas se aplanarían.

                `transform-style: preserve-3d` es lo que hace que el navegador
                ordene las capas por su z real y no por su orden en el DOM. Sin
                él el retrato —que va primero para que su `nth-child(1)` sea el
                que se adelanta en hover— quedaría pintado DETRÁS del hueco de
                imagen.

                Las clases `.depth-*` dan la separación en reposo: la
                composición ya se ve en 3D antes de que nadie pase el mouse.

                En móvil va DESPUÉS del texto y no antes: una composición de
                este tamaño arriba se come la primera pantalla completa y deja
                el h1 bajo el pliegue. */}
            <div className="enter-scale step-3">
              <div className="relative mx-auto w-full max-w-[26rem]">
                {/* Halo que se desplaza. Va FUERA del stack porque
                    `.stack-3d > *` cuenta hijos y un decorativo adentro
                    correría los índices. Dos capas: `.grad-drift` fija
                    `position: relative` y le ganaría a la utilidad `absolute`
                    (está fuera de @layer), así que el posicionamiento vive en
                    el envoltorio y el gradiente que se desplaza vive dentro. */}
                <div className="absolute -inset-5 opacity-65" aria-hidden="true">
                  <div className="grad-drift float-slow size-full rounded-[3rem]" />
                </div>

                <div className="scene stack-3d relative aspect-[5/6] [transform-style:preserve-3d]">
                  {/* Plano 1 — el retrato. Es el que se adelanta en hover, y
                      está sobre el pliegue en todos los breakpoints, así que
                      nunca se carga en diferido. */}
                  <div className="depth-3 absolute bottom-[12%] left-0 z-30 w-[56%]">
                    <div className="relative aspect-square overflow-hidden rounded-3xl border-2 border-surface shadow-lift-4">
                      <Image
                        src={SEO_IMAGES.avatar}
                        alt={SEO_IMAGES.avatarAlt[locale]}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 260px, (min-width: 640px) 240px, 55vw"
                        priority
                      />
                    </div>
                  </div>

                  {/* Plano 2 — una credencial en cristal. Lleva `strong` porque
                      el `hint` del Metric es `text-ink-subtle`, que sobre el
                      cristal por defecto no pasaría. */}
                  <div className="depth-2 absolute bottom-0 right-0 z-20 w-[48%]">
                    <div className="glass glass-strong glass-spec p-4 sm:p-5">
                      <Metric
                        value={<Counter value={4} suffix="+" />}
                        label={tt('metrics.yearsLabel')}
                        hint={tt('engineerLabel')}
                      />
                    </div>
                  </div>

                  {/* Plano 3 — el hueco de imagen, el que se va hacia atrás.
                      La etiqueta de un hueco es a su vez un panel de cristal,
                      así que un hueco NUNCA puede ir dentro de otro panel de
                      cristal: anidar `backdrop-filter` difumina dos veces y
                      cuesta el doble. Aquí es hermano, no hijo. */}
                  <div className="depth-1 absolute right-0 top-0 z-10 w-[86%]">
                    <ImageSlot
                      path="/sobre-mi/trabajando.png"
                      alt={t('workingImageAlt')}
                      hint="Foto trabajando"
                      width={1200}
                      height={750}
                      sizes="(min-width: 1024px) 360px, 80vw"
                      className="aspect-[16/10] rounded-2xl shadow-lift-3"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── HECHOS DE PERFIL ──
              Cuatro paneles: `.scene` en la lista y `.tilt-hover` en cada uno,
              así los cuatro comparten punto de fuga. `glass-strong` es
              obligatorio, no estético: el `term` es `text-ink-subtle`. */}
          <dl className="scene enter step-5 mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map((fact) => {
              const Icon = fact.icon
              return (
                <div key={fact.term} className="tilt-hover rounded-2xl">
                  <div className="glass glass-strong glass-spec h-full p-5">
                    <span
                      className="grad-deco inline-flex size-10 items-center justify-center rounded-xl text-white shadow-glow-brand"
                      aria-hidden="true"
                    >
                      <Icon className="size-5" />
                    </span>
                    <dt className="mt-4 text-xs font-bold uppercase tracking-wider text-ink-subtle">
                      {fact.term}
                    </dt>
                    <dd className="mt-1.5 text-sm leading-relaxed text-ink">
                      {fact.detail}
                    </dd>
                  </div>
                </div>
              )
            })}
          </dl>
        </div>
      </section>

      {/* ══ RESUMEN PROFESIONAL ═══════════════════════════════════
          Banda con `.grad-soft`: el presupuesto de auroras está gastado en la
          cabecera, la experiencia y los reconocimientos. `.grad-soft` es un
          `background-image` fijo, así que da el color que el cristal necesita
          detrás sin costar ni un frame.                                    */}
      <section id="resumen" className="grad-soft border-y border-hairline">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="max-w-2xl">
            <p className="eyebrow">{en ? 'Profile' : 'Perfil'}</p>
            <h2 className="mt-5 text-d1 text-ink">{t('summary')}</h2>
          </div>

          {/* Entra girando desde atrás con `.reveal-3d`, que es CSS puro
              (`animation-timeline: view()`). En un navegador sin soporte el
              bloque @supports no aplica y el panel simplemente está visible:
              ningún contenido depende de que algo corra. El texto largo toma su
              medida y su ritmo de `.prose-rich`, no de utilidades párrafo por
              párrafo. */}
          <div className="glass glass-spec reveal-3d mt-8 p-6 sm:p-9">
            <div className="prose-rich">
              {personal.summary.split('\n\n').map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Las cifras cuentan al entrar en pantalla, pero el valor final ya
              viene en el HTML del servidor: ningún crawler ve un cero.

              El `.float` va en el CONTENIDO, no en el panel de cristal. Mover un
              elemento con `backdrop-filter` obliga a rerasterizar el desenfoque
              en cada frame: es la misma trampa que `filter: blur()` sobre algo
              que se mueve. El panel se queda quieto; respira lo de dentro. */}
          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="glass glass-strong glass-spec p-5 sm:p-6"
              >
                <div className={stat.float}>
                  <Metric
                    value={stat.value}
                    label={stat.label}
                    hint={stat.hint}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ EXPERIENCIA ═══════════════════════════════════════════
          Carrusel, no rejilla. El desplazamiento y el imán son nativos
          (`scroll-snap`): si el JS del componente no corre el carril sigue
          arrastrándose, y las tres láminas completas ya están en el HTML del
          servidor, así que un crawler las lee todas — un carrusel con estado en
          JS solo expone la primera.

          La línea de tiempo completa, con los puestos uno debajo del otro y
          enlace a cada ficha de proyecto, vive en /cv. Aquí el mismo dato se
          recorre.                                                          */}
      <section
        id="experiencia"
        className="relative isolate overflow-hidden border-b border-hairline"
      >
        <Backdrop />

        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">{en ? 'Track record' : 'Trayectoria'}</p>
            <h2 className="mt-5 text-d1 text-ink">{t('experience')}</h2>
            {/* Sobre la aurora, todo lo que no es tinta plena va en cristal. */}
            <div className="glass glass-strong glass-spec mt-6 px-5 py-4">
              <p className="text-lead text-ink-muted">
                {en
                  ? 'Three roles, with the dates, the place and the stack each one actually used.'
                  : 'Tres roles, con las fechas, el lugar y el stack que cada uno usó de verdad.'}
              </p>
              <p className="mt-2 text-sm text-ink-subtle">{tc('dragHint')}</p>
            </div>
          </div>

          <Carousel
            label={tl('experienceRail')}
            prevLabel={tl('prevSlide')}
            nextLabel={tl('nextSlide')}
            className="mt-10"
          >
            {experiences.map((exp) => (
              /* Inclinación que sigue al puntero, para las tarjetas
                 protagonistas. `.scene` ya está en el carril del carrusel, así
                 que las tres comparten un mismo punto de fuga — que es lo que
                 separa un 3D creíble de tres tarjetas girando cada una por su
                 cuenta.

                 La placa de cristal es el PLANO DE FONDO de la tarjeta, no su
                 contenedor: `.glass` lleva `contain: paint`, que fuerza el
                 aplanado del 3D, así que con el contenido dentro las clases
                 `.depth-*` no levantarían nada. Va en dos capas porque `.glass`
                 fija `position: relative` y le ganaría a la utilidad
                 `absolute`. Es `strong` porque la tarjeta usa `ink-subtle`. */
              <Tilt3D key={exp.id} className="w-[20rem] sm:w-[25rem]">
                <article className="relative flex h-full flex-col p-6 sm:p-7 [transform-style:preserve-3d]">
                  <span className="absolute inset-0" aria-hidden="true">
                    <span className="glass glass-strong glass-spec block size-full" />
                  </span>

                  <div className="depth-2 flex flex-wrap items-center gap-x-3 gap-y-2">
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
                    <span className="text-sm text-ink-subtle">
                      {exp.location}
                    </span>
                    {exp.current ? (
                      <Badge variant="gradient">
                        {en ? 'Current role' : 'Rol actual'}
                      </Badge>
                    ) : null}
                  </div>

                  <h3 className="depth-2 mt-4 text-d3 text-ink">
                    {exp.position}
                  </h3>
                  <p className="depth-2 mt-1.5 font-semibold text-ink-muted">
                    {exp.company}
                  </p>
                  <p className="depth-1 mt-4 text-sm text-ink-muted">
                    {exp.description}
                  </p>

                  {exp.highlights.length > 0 ? (
                    <ul className="depth-1 mt-5 flex-1 space-y-2.5">
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
                    <ul className="depth-1 mt-6 flex flex-wrap gap-1.5">
                      {exp.technologies.map((tech) => (
                        <li key={tech}>
                          <Badge variant="neutral">{tech}</Badge>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              </Tilt3D>
            ))}
          </Carousel>

          <div className="mt-8">
            <Button asChild variant="outline" size="lg">
              <Link href="/cv">
                {en ? 'See the full CV' : 'Ver el CV completo'}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ══ FORMACIÓN + CERTIFICACIONES ═══════════════════════════ */}
      <section
        id="credenciales"
        className="defer-paint grad-soft border-b border-hairline"
      >
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="max-w-2xl">
            <p className="eyebrow">{en ? 'Credentials' : 'Credenciales'}</p>
            <h2 className="mt-5 text-d1 text-ink">{t('education')}</h2>
          </div>

          {/* Dos elementos: la perspectiva en la lista, la rotación en cada
              elemento, y el cristal DENTRO del envoltorio inclinado porque
              `.glass` lleva `contain: paint` y aplanaría el 3D de sus hijos.
              El radio del envoltorio es el mismo del material (`rounded-2xl`
              resuelve a `--radius-2xl`, el que fija `.glass`), así la sombra
              del hover cae justo en el borde del panel. */}
          <ul className="scene mt-12 grid gap-6 md:grid-cols-2">
            {education.map((item) => (
              <li key={item.id} className="tilt-hover rounded-2xl">
                <div className="glass glass-spec h-full p-6 sm:p-7">
                  <p
                    data-numeric=""
                    className="text-sm font-semibold text-brand-strong"
                  >
                    <time dateTime={item.startDate}>{item.startDate}</time>
                    {' – '}
                    <time dateTime={item.endDate}>{item.endDate}</time>
                  </p>
                  {/* `degree` es la etiqueta localizada de la credencial, así la
                      especialización nunca se lee como un segundo título. */}
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

          {/* Las certificaciones comparten banda con la formación: es la misma
              pregunta, y un solo enlace de verificación cubre las dos. */}
          <div className="mt-16 border-t border-hairline pt-14">
            <div className="max-w-2xl">
              <h2 className="text-d1 text-ink">{t('certs')}</h2>
              <p className="mt-4 text-lead text-ink-muted">
                {t('credentialsNote')}
              </p>
            </div>

            {/* Cada credencial es un hueco de imagen JUNTO a un panel de
                cristal, nunca dentro: la etiqueta del hueco ya es cristal, y
                dos paneles hermanos están bien mientras uno no esté metido en
                el otro. El hueco escribe en pantalla la ruta exacta del archivo
                que falta, que es lo que hace visible dónde va cada documento. */}
            <ul className="scene mt-10 grid gap-6 lg:grid-cols-2">
              {credentials.map((credential) => (
                <li
                  key={credential.id}
                  className="grid gap-4 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)]"
                >
                  <ImageSlot
                    path={`/certificaciones/${credential.id}.png`}
                    alt={credential.name}
                    hint="Diploma"
                    width={1200}
                    height={900}
                    sizes="(min-width: 640px) 176px, 100vw"
                    className="lift h-full min-h-40 rounded-2xl shadow-lift-2"
                  />

                  <div className="tilt-hover rounded-2xl">
                    <div className="glass glass-spec h-full p-6">
                      <span
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
                          <span>{en ? 'Active' : 'Vigente'}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-10">
              {/* Una carpeta que cualquiera puede abrir vale más que una
                  insignia dibujada: la afirmación queda verificable, que es
                  todo el punto de esta página. */}
              <Button asChild variant="outline" size="lg">
                <a
                  href={SOCIAL_LINKS.certsDrive}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('viewCerts')}
                  <ExternalLink className="size-4" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ══ STACK ═════════════════════════════════════════════════
          Siete categorías: más de las que caben cómodas en una rejilla, así que
          van en carrusel. El hueco del espacio de trabajo va al lado del
          encabezado y FUERA de todo cristal, porque su etiqueta ya es un panel
          de cristal.                                                       */}
      <section
        id="stack"
        className="defer-paint grad-soft border-b border-hairline"
      >
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-end lg:gap-16">
            <div>
              <p className="eyebrow">Stack</p>
              <h2 className="mt-5 text-d1 text-ink">{t('skills')}</h2>
              <p className="mt-4 max-w-[52ch] text-lead text-ink-muted">
                {tc('dragHint')}
              </p>
            </div>

            <ImageSlot
              path="/sobre-mi/setup.png"
              alt={t('setupImageAlt')}
              hint="Espacio de trabajo"
              width={1200}
              height={900}
              sizes="(min-width: 1024px) 352px, 100vw"
              className="lift aspect-[4/3] w-full rounded-3xl shadow-lift-3"
            />
          </div>

          <Carousel
            label={tl('stackRail')}
            prevLabel={tl('prevSlide')}
            nextLabel={tl('nextSlide')}
            className="mt-12"
          >
            {skillCategories.map((category) => (
              /* `.scene` ya viene en el carril, así que las siete láminas
                 comparten punto de fuga. La inclinación en el envoltorio y el
                 cristal dentro: `contain: paint` aplanaría el 3D. */
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
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <h2 className="text-d1 text-ink">{t('languages')}</h2>

          <dl className="scene mt-12 grid gap-5 sm:grid-cols-3">
            {personal.languages.map((language) => (
              <div key={language.name} className="tilt-hover rounded-2xl">
                <div className="glass glass-spec h-full p-6">
                  <dt className="flex items-center justify-between gap-3">
                    <span className="font-display text-lg font-semibold text-ink">
                      {language.name}
                    </span>
                    {/* El nivel CEFR va impreso junto a la barra, no implícito
                        en su largo: la barra se deriva de este mismo valor, así
                        que no puede contradecir la etiqueta. */}
                    <span
                      data-numeric=""
                      className="grad-fill rounded-full px-2.5 py-0.5 text-xs font-bold"
                    >
                      {language.cefr}
                    </span>
                  </dt>
                  <dd>
                    <div
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

      {/* ══ RECONOCIMIENTOS ═══════════════════════════════════════
          Aurora número tres, y la última de esta página.                  */}
      <section
        id="reconocimientos"
        className="relative isolate overflow-hidden border-b border-hairline"
      >
        <Backdrop />

        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="max-w-2xl">
            <p className="eyebrow">
              {en ? 'Selected work' : 'Trabajo destacado'}
            </p>
            <h2 className="mt-5 text-d1 text-ink">{t('awards')}</h2>
          </div>

          <ul className="scene mt-14 grid gap-8 lg:grid-cols-2">
            {recognitions.map((award) => (
              <li key={award.id} className="flex flex-col">
                {/* El hueco va arriba y fuera del panel: dos paneles de cristal
                    hermanos están bien, uno dentro del otro no. */}
                <ImageSlot
                  path={`/premios/${award.id}.png`}
                  alt={t('awardImageAlt', { title: award.title })}
                  hint="Reconocimiento"
                  width={1200}
                  height={750}
                  sizes="(min-width: 1024px) 540px, 100vw"
                  className="lift aspect-[16/10] w-full rounded-2xl shadow-lift-2"
                />

                <div className="tilt-hover mt-5 flex-1 rounded-2xl">
                  <div className="glass glass-spec flex h-full flex-col p-6 sm:p-7">
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
                          hackathon y una distinción con nombre son afirmaciones
                          distintas. */}
                      <Badge variant="outline">
                        {award.kind === 'competition'
                          ? en
                            ? 'Competition'
                            : 'Competencia'
                          : en
                            ? 'Recognition'
                            : 'Reconocimiento'}
                      </Badge>
                    </div>

                    <h3 className="mt-4 text-d3 text-ink">{award.title}</h3>
                    <p className="mt-1.5 font-semibold text-ink-muted">
                      {award.organization}
                    </p>
                    <p className="mt-4 text-ink-muted">{award.description}</p>
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

          <div className="mt-10">
            <Button asChild variant="outline" size="lg">
              <Link href="/premios">
                {en ? 'See every recognition' : 'Ver todos los premios'}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ══ CIERRE ════════════════════════════════════════════════ */}
      <section className="defer-paint mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="grad-drift reveal-scale rounded-3xl px-6 py-14 shadow-lift-3 sm:px-12 sm:py-20">
          <div className="relative max-w-2xl">
            <h2 className="text-d1 text-white">{t('philosophy')}</h2>
            <p className="mt-5 text-lead text-white/85">
              {t('philosophyDesc')}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              {/* Sobre el gradiente el botón se invierte: `bg-none` apaga la
                  imagen del variant por defecto y deja superficie blanca con
                  texto de marca. Un relleno de marca aquí desaparecería. */}
              <Button
                asChild
                size="lg"
                className="sheen bg-none bg-surface text-brand-strong hover:opacity-95"
              >
                <Link href="/servicios">
                  {t('servicesLink')}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Link
                href="/contacto"
                className="press inline-flex min-h-11 items-center text-sm font-semibold text-white underline decoration-white/50 underline-offset-4 hover:decoration-white"
              >
                {tn('contact')}
              </Link>
            </div>

            <p className="mt-7 text-sm text-white/75">
              {en ? 'Or write to ' : 'O escríbeme a '}
              <a
                href={`mailto:${NAP.email}`}
                className="font-semibold text-white underline underline-offset-4"
              >
                {NAP.email}
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
