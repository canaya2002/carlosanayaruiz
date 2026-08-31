import Image from 'next/image'
import { getLocale } from 'next-intl/server'
import { slotById } from '@/data/media-slots'

/**
 * ════════════════════════════════════════════════════════════════
 * HUECO DE MEDIO — dónde va una imagen, un video o un fondo
 *
 * El brief original fue explícito: «no hay indicaciones de dónde van las
 * imágenes, por lo mismo no sé si en algunas debe ir algo y tal vez el
 * espacio vacío enorme es por eso». Esto lo resolvía.
 *
 * ── POR QUÉ CAMBIÓ ──
 * Lo resolvía DEMASIADO. Un hueco de 1920×1080 sin archivo reservaba su
 * relación de aspecto real, así que dibujaba una caja de cuatrocientos
 * píxeles de alto llena de nada — y eso volvió a reportarse, con razón,
 * como «espacios enormes vacíos y sin nada». La caja que iba a resolver
 * el hueco ERA el hueco.
 *
 * Ahora hay dos formas, y cada una hace un trabajo distinto:
 *
 *   · POR DEFECTO — un RENGLÓN. Qué falta, a qué ruta y de qué tamaño.
 *     Es toda la instrucción que hacía falta, en 24 px de alto en vez de
 *     400. Cero espacio muerto.
 *
 *   · `compact` — la caja marcada de siempre. Se usa donde el hueco es
 *     ESTRUCTURAL: una portada dentro de una rejilla, un logo en una
 *     columna de 176 px. Ahí un renglón dejaría la celda descuadrada y
 *     el vacío no es un defecto, es la miniatura que todavía no llegó.
 *
 * Cuando el archivo existe (`filled: true`) las dos formas son la imagen
 * real, con su relación de aspecto reservada: cero CLS al llenarse.
 *
 * ── POR QUÉ NO ES UNA CAJA ──
 * Porque el brief pidió quitar cajas. El renglón se marca con una regla
 * superior punteada, que es el vocabulario que este sistema ya usa para
 * un hueco en el registro (`.gap`). Un hueco es un DATO, y se dibuja
 * como hueco.
 *
 * El estado vive en `data/media-slots.ts`, que es también lo que genera
 * `docs/MEDIA.md`. Un solo dato, dos salidas, imposible que se
 * contradigan.
 * ════════════════════════════════════════════════════════════════
 */

/**
 * El renglón del hueco iba SOLO en español —«pendiente» fijo y estos tres
 * rótulos— y se servía igual en `/en`. Medido: en `/en/sobre-mi` salían dos
 * seguidos al abrir la trayectoria, y en `/en/contacto` era lo PRIMERO de la
 * columna derecha, encima de «Contact details». Un visitante en inglés leía
 * «pendiente · imagen 2000×1333».
 *
 * Es un marcador interno, sí, pero se sirve en el HTML público de las dos
 * lenguas, y este repo verifica paridad es/en como condición.
 */
const KIND_LABEL: Record<string, Record<string, string>> = {
  es: { image: 'imagen', video: 'video', loop: 'fondo animado' },
  en: { image: 'image', video: 'video', loop: 'animated background' },
}

const PENDING_LABEL: Record<string, string> = {
  es: 'pendiente',
  en: 'pending',
}

export async function MediaSlot({
  id,
  className,
  sizes = '(min-width: 1024px) 50vw, 100vw',
  priority = false,
  compact = false,
}: {
  id: string
  className?: string
  sizes?: string
  priority?: boolean
  /**
   * El hueco es estructural: una portada o un logo dentro de una rejilla.
   * Dibuja la caja marcada con la relación de aspecto reservada, sin la
   * descripción larga — la instrucción completa vive en `docs/MEDIA.md`.
   */
  compact?: boolean
}) {
  const slot = slotById(id)

  /* Un id que no existe no rompe la página: no dibuja nada. Un hueco
     fantasma sería peor que ninguno. */
  if (!slot) return null

  const ratio = `${slot.width} / ${slot.height}`

  if (slot.filled) {
    return (
      <div className={className} style={{ aspectRatio: ratio }}>
        <Image
          src={slot.path}
          alt={slot.alt}
          width={slot.width}
          height={slot.height}
          sizes={sizes}
          priority={priority}
          className="size-full object-cover"
        />
      </div>
    )
  }

  /* ════════════════════════════════════════════════════════════════
     UN HUECO SIN ARCHIVO NO PINTA NADA. Decisión del dueño, y es la
     tercera vez que la pide con otras palabras: «sin nada ahí
     pendiente».

     Antes se dibujaba un renglón con el tipo, el tamaño y la RUTA DEL
     SISTEMA DE ARCHIVOS. En la práctica eso significaba que en la
     portada —la URL de mayor autoridad del dominio, dentro de la
     sección cuyo h2 dice «qué puedes verificar»— un prospecto leía
     «pendiente · imagen 1600×900 · public/media/home/antes-despues.png»
     en tinta plena. Un TODO del repo no es copia de una página
     comercial.

     La instrucción NO se pierde: `docs/MEDIA.md` se genera del MISMO
     archivo (`data/media-slots.ts`) con `npm run media:manifest`, y ahí
     sigue completa —qué falta, a qué ruta, de qué tamaño y con qué
     encuadre—. Es el documento que lee el dueño; la página la lee quien
     compra. Cada uno con su lector.

     Esto además cierra dos defectos que ya estaban medidos: el renglón
     estaba escrito solo en español y se servía igual en `/en`, y el
     `aria-label` de la caja compacta le leía al lector de pantalla el
     encargo de fotografía escrito para el dueño.
     ════════════════════════════════════════════════════════════════ */
  if (!compact) return null

  const lang = (await getLocale()) === 'en' ? 'en' : 'es'
  const kind = KIND_LABEL[lang][slot.kind] ?? slot.kind
  const pending = PENDING_LABEL[lang]

  return (
    <div
      className={`media-slot ${className ?? ''}`}
      style={{ aspectRatio: ratio }}
      data-kind={slot.kind}
      role="img"
      /* `slot.alt` y NO `slot.what`. `what` es el encargo para el dueño —«UNA
         sola imagen que sea la prueba de todo el sitio: Search Console o CrUX
         con un antes y un después…»— y se le estaba leyendo entero a quien usa
         lector de pantalla, cinco veces en /proyectos. `alt` es el campo que
         existe justamente para ser texto público, y no se estaba usando aquí. */
      aria-label={`${pending}: ${slot.alt}`}
    >
      {/* Las cuatro cruces de registro. Decorativas: la instrucción es texto. */}
      <span className="media-mark" data-corner="tl" aria-hidden="true" />
      <span className="media-mark" data-corner="tr" aria-hidden="true" />
      <span className="media-mark" data-corner="bl" aria-hidden="true" />
      <span className="media-mark" data-corner="br" aria-hidden="true" />

      <div className="media-slot-body">
        <p className="media-slot-kind">
          {`${kind} · ${slot.width}×${slot.height}`}
        </p>
        <p className="media-slot-path">{`public${slot.path}`}</p>
      </div>
    </div>
  )
}
