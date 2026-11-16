import Image from 'next/image'
import { getLocale } from 'next-intl/server'
import { COURSES } from '@/data/courses'
import { getAwards } from '@/data/awards'

/**
 * ════════════════════════════════════════════════════════════════
 * LA CINTA DE DOCUMENTOS — los certificados corriendo
 *
 * Reemplazó a la figura de evidencia que iba en este sitio de la portada.
 * Aquella publicaba capturas del panel de Search Console de la propiedad
 * del despacho, con el dominio a la vista, y el dueño lo cortó con una
 * frase que tiene razón: son datos de su empleador. Ver «La evidencia que
 * se retiró» en CLAUDE.md.
 *
 * Lo que va en su lugar son documentos que SÍ son suyos y llevan su
 * nombre impreso: los ocho certificados que entregó. Es la misma clase de
 * prueba —un tercero firmando— sin datos de nadie más.
 *
 * ── POR QUÉ ES UNA CINTA Y NO UNA REJILLA ──
 * Porque el carrusel de este sistema es la cinta, y porque ocho documentos
 * en rejilla son ocho cajas. Corriendo son una tira de papel que sale del
 * tambor, que es la tesis del sitio. Sin flechas, sin puntos y sin
 * JavaScript: el mismo mecanismo que `<Ribbon>`.
 *
 * ── LOS CANTOS VAN DUROS, Y ES UNA INSTRUCCIÓN ──
 * «Sin esos efectos en los márgenes, no me gustó en ningún lado.» Así que
 * aquí NO hay máscara de disolución por imagen: un documento se acaba
 * donde se acaba el papel. La misma decisión se aplicó a `.credential`,
 * `.cover` y `.cover-thumb`. Lo único que se conserva es el degradado de
 * los EXTREMOS de la cinta, que no es el canto de una imagen sino el de la
 * tira: una cinta que se corta en seco contra el borde de la pantalla deja
 * de leerse como cinta.
 *
 * ── EL BUCLE ──
 * Dos copias y `translateX(-50%)`. Con las dos listas iguales, el salto
 * del ciclo cae exactamente donde empezó la segunda: no hace falta un
 * tercer juego. Repetir hasta `MIN_COPY_PX` pintaba cuatro copias —32
 * `<img>`— y el `sizes` fijo en 352 px pedía la variante de 640 para un
 * documento que se muestra a ~262 px. Una copia de los ocho ya pasa de
 * 2 000 px, más ancha que el escritorio en el que se lee.
 * ════════════════════════════════════════════════════════════════
 */

/** Alto de la cinta en px, y tiene que coincidir con `--doc-h` del CSS. */
const STRIP_H = 176
/** Separación entre documentos, en px. Coincide con el `gap` del CSS. */
const GAP_PX = 24
/**
 * Píxeles por segundo. Más lento que la cinta de nombres (38) a propósito:
 * aquí lo que pasa no son etiquetas de once píxeles sino documentos de
 * 176 px de alto, y un objeto grande a la misma velocidad angular se
 * percibe disparado. Un registrador arrastra papel despacio.
 */
const SPEED_PX_S = 26

interface Doc {
  key: string
  image: string
  width: number
  height: number
  alt: string
}

export async function DocStrip({ label }: { label: string }) {
  const locale = (await getLocale()) === 'en' ? 'en' : 'es'

  /* Los ocho documentos salen de los MISMOS datos que las páginas de
     credenciales, así que la cinta no puede mostrar uno que la lista niegue.
     Los tres cursos sin archivo (`nextjs-produccion`, `pmp-exam-prep`,
     `scrum-practico`) no aparecen: el dueño no los tiene y el registro lo
     dice, así que aquí tampoco se inventan. */
  const docs: Doc[] = COURSES.filter(
    (c): c is typeof c & { image: string; width: number; height: number } =>
      Boolean(c.image && c.width && c.height)
  ).map((c) => ({
    key: c.id,
    image: c.image,
    width: c.width,
    height: c.height,
    alt: c.alt[locale],
  }))

  /* El premio va PRIMERO: es la credencial insignia del sitio y la única
     firmada por una agencia espacial. Su proporción es 1.49 y la de los
     cursos 1.39, y por eso el ancho de cada uno sale de su propio archivo en
     vez de una fracción común. */
  const award = getAwards(locale).find((a) => a.image)
  if (award?.image) {
    docs.unshift({
      key: award.id,
      image: award.image,
      width: 1600,
      height: 1075,
      alt: award.imageAlt ?? award.title,
    })
  }

  if (docs.length === 0) return null

  const unitPx = docs.reduce(
    (w, d) => w + (STRIP_H * d.width) / d.height + GAP_PX,
    0
  )
  /* Una sola copia en cada lista. La segunda `<ul>` es el duplicado del
     bucle; repetir dentro de la primera volvía a duplicar los `<img>`. */
  const seconds = Math.round(unitPx / SPEED_PX_S)

  return (
    <div
      className="doc-strip"
      style={{ '--doc-dur': `${seconds}s` } as React.CSSProperties}
    >
      <div className="doc-track">
        <ul className="doc-copy" aria-label={label}>
          {docs.map((d) => (
            <li key={d.key} className="doc-item">
              <Image
                src={d.image}
                alt={d.alt}
                width={d.width}
                height={d.height}
                /* `--doc-h` es 11rem (176 px) en todos los anchos. El
                   certificado más ancho, el de NASA, sale a 262 px. Por
                   debajo de 640 px se pide 219 px de layout para que un
                   DPR 1.75 elija 384 y no 640. */
                sizes="(max-width: 640px) 219px, 262px"
                loading="lazy"
              />
            </li>
          ))}
        </ul>
        {/* La segunda copia es lo que hace el bucle. No existe para nadie que
            no la esté mirando, así que va sin `alt` y oculta al árbol. */}
        <ul className="doc-copy" aria-hidden="true">
          {docs.map((d) => (
            <li key={`b-${d.key}`} className="doc-item">
              <Image
                src={d.image}
                alt=""
                width={d.width}
                height={d.height}
                sizes="(max-width: 640px) 219px, 262px"
                loading="lazy"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
