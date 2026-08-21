import Image from 'next/image'
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

const KIND_LABEL: Record<string, string> = {
  image: 'imagen',
  video: 'video',
  loop: 'fondo animado',
}

export function MediaSlot({
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

  const kind = KIND_LABEL[slot.kind] ?? slot.kind

  /* La forma por defecto: un renglón, no un hueco de 400 px. */
  if (!compact) {
    return (
      <p className={`media-note ${className ?? ''}`}>
        <span className="media-note-kind">
          {`pendiente · ${kind} ${slot.width}×${slot.height}`}
        </span>
        {/* La ruta en UNA sola plantilla. Con dos hijos de texto adyacentes
            React mete un comentario en medio y la ruta deja de existir como
            texto: no se puede copiar ni encontrar con Ctrl+F, que es
            justamente para lo que está. */}
        <span className="media-note-path">{`public${slot.path}`}</span>
      </p>
    )
  }

  return (
    <div
      className={`media-slot ${className ?? ''}`}
      style={{ aspectRatio: ratio }}
      data-kind={slot.kind}
      role="img"
      aria-label={`Pendiente: ${slot.what}`}
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
