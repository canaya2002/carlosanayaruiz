import Image from 'next/image'
import { getLocale } from 'next-intl/server'
import { evidenceById, type EvidenceId } from '@/data/evidence'

/**
 * ════════════════════════════════════════════════════════════════
 * LA FIGURA DE EVIDENCIA — la lectura primero, el documento después
 *
 * El brief fue directo: «no se ven en ningún lado las imágenes de mejoras
 * en Search Console, del Core Web Vitals ni del alcance, y esas son muy
 * importantes». Lo eran y no estaban. Esto es lo que las pone.
 *
 * ── POR QUÉ NO ES SOLO UNA IMAGEN ──
 * Tres razones medidas, no de gusto:
 *
 *   1. Un buscador no lee los píxeles de una gráfica. Servir «1.4M
 *      impresiones» únicamente dentro de un WebP es servirlo a nadie: el
 *      dato más fuerte de la página quedaría fuera del índice. Aquí la
 *      cifra es TEXTO en la placa y la captura es el respaldo.
 *   2. A 375 px una captura de 1592 va a 375, o sea al 24%. El «133» de
 *      Search Console mide 44 px en el archivo y ahí bajaría a 10. La
 *      placa lo dice a tamaño de lectura y no depende del ancho.
 *   3. Es la tesis del sitio aplicada a sí misma: el veredicto se lee por
 *      posición contra una regla impresa, nunca por un número dentro de
 *      una tarjeta. La placa ES esa regla.
 *
 * ── POR QUÉ NO LLEVA FILTRO ──
 * Los dos retratos del sitio llevan `grayscale(.32)` y `sepia(.13)`
 * porque su luz es azul y este negro es cálido. Aquí NO, y es deliberado:
 * las series de estas gráficas son de color —azul los clics, morado las
 * impresiones, verde las URLs buenas— y teñirlas sería alterar la
 * evidencia. Lo que sí se hace es lo mismo que con los certificados:
 * disolver los cuatro cantos en el material, así el documento entra sin
 * rectángulo y sin borde.
 *
 * `loading="lazy"` sin excepción: las tres viven bien por debajo del
 * primer pliegue y ninguna puede competir por el LCP con el titular.
 * ════════════════════════════════════════════════════════════════
 */
export async function Evidence({
  id,
  className,
  /** Ancho servido, para el `sizes`. El valor por omisión es la columna de 54rem. */
  sizes = '(min-width: 1024px) 54rem, 92vw',
}: {
  id: EvidenceId
  className?: string
  sizes?: string
}) {
  /* Misma resolución que `<MediaSlot>`: `getLocale()` devuelve `string` y este
     repo solo tiene dos lenguas, así que cualquier otra cosa cae a español. */
  const locale = (await getLocale()) === 'en' ? 'en' : 'es'
  const ev = evidenceById(locale, id)

  /* Un id que no existe no rompe la página: no dibuja nada. La misma regla
     que `<MediaSlot>` — una figura fantasma sería peor que ninguna. */
  if (!ev) return null

  return (
    <figure className={`m-0 ${className ?? ''}`}>
      {/* El rótulo del instrumento va como `<p>` y NO como `<figcaption>`.
          Una `<figure>` admite UNA sola `<figcaption>` y tiene que ser el
          primer o el último hijo, así que solo una de las dos líneas puede
          serlo — y la que describe la figura es la de abajo, no la etiqueta
          del panel. Con la etiqueta arriba como figcaption, el pie real
          quedaba como un párrafo sin asociar y un lector de pantalla
          anunciaba «Google Search Console · rendimiento» como el pie de una
          imagen cuyo texto explicativo estaba tres nodos más allá. */}
      <p className="stamp">{ev.instrument}</p>

      {/* La placa. Dos columnas en teléfono y cuatro a partir de 40rem: a
          375 px, cuatro celdas dejarían «Chrome UX Report» en cinco líneas
          de once píxeles. */}
      <dl className="mt-4 grid grid-cols-2 gap-x-8 sm:grid-cols-4">
        {ev.readings.map((r) => (
          <div key={r.key} className="plaque">
            <dt className="plaque-key">{r.key}</dt>
            <dd className="plaque-val font-mono text-d3 tabular-nums text-ink">
              {r.value}
            </dd>
          </div>
        ))}
      </dl>

      {/* El documento. `.evidence-doc` disuelve los cuatro cantos con los dos
          degradados cruzados; el archivo ya trae horneado un margen del 4.5%
          del color de fondo del panel para que la máscara se coma ese margen
          y no el eje. */}
      <span className="evidence-doc mt-7 block">
        <Image
          src={ev.image}
          alt={ev.alt}
          width={ev.width}
          height={ev.height}
          sizes={sizes}
          loading="lazy"
        />
      </span>

      {/* El pie de verdad, y último hijo de la `<figure>`, que es donde el
          HTML permite la `<figcaption>`. Dice de qué propiedad son los
          números y con qué papel se accede a ella: sin eso, un visitante
          asumiría que son de este dominio. */}
      <figcaption className="mt-4 max-w-[62ch] text-sm leading-relaxed text-ink-muted">
        {ev.caption}
      </figcaption>
    </figure>
  )
}
