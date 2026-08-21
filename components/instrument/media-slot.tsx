import Image from 'next/image'
import { slotById } from '@/data/media-slots'

/**
 * ════════════════════════════════════════════════════════════════
 * HUECO DE MEDIO — dónde va una imagen, un video o un fondo
 *
 * El brief fue explícito: «no hay indicaciones de dónde van las imágenes,
 * por lo mismo no sé si en algunas debe ir algo y tal vez el espacio vacío
 * enorme es por eso». Esto lo resuelve.
 *
 * Mientras no exista el archivo, el hueco dibuja MARCAS DE REGISTRO —las
 * cruces que lleva un pliego de imprenta para alinear las tintas— y escribe
 * encima, en mono, tres cosas: qué va ahí, la ruta EXACTA del archivo que
 * falta, y el tamaño esperado. Nada de eso es adorno: es la instrucción.
 *
 * ── POR QUÉ NO ES UNA CAJA ──
 * Porque el brief también pidió quitar cajas. Un hueco con borde de cuatro
 * lados es exactamente lo que se acaba de eliminar del sitio. Las marcas de
 * registro cumplen la misma función —delimitan el área— y pertenecen al
 * mundo del papel impreso, que es el del sistema.
 *
 * ── POR QUÉ NO SE MUEVE NADA AL LLENARLO ──
 * El hueco reserva la relación de aspecto real del archivo con `aspect-ratio`
 * a partir de `width`/`height` del registro. Cuando la imagen llega, entra
 * exactamente en el mismo espacio: cero CLS.
 *
 * El estado vive en `data/media-slots.ts`, que es también lo que genera
 * `docs/MEDIA.md`. Un solo dato, dos salidas, imposible que se contradigan.
 * ════════════════════════════════════════════════════════════════
 */

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
   * Sin la descripción larga. Para huecos chicos —una portada de 320 px en
   * un listado— donde el párrafo no cabe y se recortaba: la instrucción
   * completa vive en `docs/MEDIA.md` y la ruta sigue estando aquí, que es
   * lo único que hace falta para saber qué archivo poner.
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
          {slot.kind === 'image'
            ? 'imagen'
            : slot.kind === 'video'
              ? 'video'
              : 'fondo animado'}
          {' · '}
          {slot.width}×{slot.height}
        </p>
        {compact ? null : <p className="media-slot-what">{slot.what}</p>}
        {/* La ruta en UNA sola plantilla. Con dos hijos de texto adyacentes
            React mete un comentario en medio y la ruta deja de existir como
            texto: no se puede copiar ni encontrar con Ctrl+F, que es
            justamente para lo que está. */}
        <p className="media-slot-path">{`public${slot.path}`}</p>
      </div>
    </div>
  )
}
