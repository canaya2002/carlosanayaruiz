import Image from 'next/image'
import { ImageIcon } from 'lucide-react'

/**
 * ════════════════════════════════════════════════════════════════
 * HUECO DE IMAGEN
 *
 * El sitio tiene que verse lleno de imágenes y hoy no hay ninguna: el
 * repositorio solo tiene el retrato. Este componente resuelve las dos mitades
 * del problema a la vez.
 *
 * ── SI HAY IMAGEN ──
 * La muestra, con `next/image` y las dimensiones declaradas.
 *
 * ── SI NO HAY IMAGEN ──
 * Dibuja un marco de cristal con un patrón geométrico determinista, y ENCIMA
 * escribe la RUTA EXACTA donde va el archivo y el tamaño recomendado. Esa
 * etiqueta es el punto: el dueño pidió "algo que las referencee para yo
 * entender dónde van". Un hueco gris anónimo no le dice dónde pegar nada.
 *
 * ── CÓMO APAGAR LAS ETIQUETAS ──
 * Se controlan con NEXT_PUBLIC_SHOW_SLOTS. Vienen ENCENDIDAS a propósito
 * mientras el sitio se está llenando de contenido.
 *
 *   Para apagarlas: pon NEXT_PUBLIC_SHOW_SLOTS=0 en .env.local (o en las
 *   variables de entorno de Vercel) y vuelve a desplegar.
 *
 * Con las etiquetas apagadas el hueco sigue dibujando el patrón, así que la
 * página nunca se ve rota — solo deja de anunciar rutas de archivo a los
 * visitantes.
 *
 * El inventario completo de huecos está en docs/IMAGENES.md, generado por
 * scripts/generate-image-manifest.mjs.
 * ════════════════════════════════════════════════════════════════
 */

const SHOW_LABELS = process.env.NEXT_PUBLIC_SHOW_SLOTS !== '0'

/** Hash estable (FNV-1a). No se usa Math.random: el patrón tiene que ser
 *  idéntico en el servidor y en el cliente o React reporta desajuste. */
function hash(input: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

export interface ImageSlotProps {
  /**
   * Ruta del archivo relativa a /public, CON la barra inicial.
   * Es a la vez el `src` cuando existe y la etiqueta cuando no.
   * Ej: '/proyectos/amazon/captura-1.png'
   */
  path: string
  /** Texto alternativo. Obligatorio: si la imagen llega, tiene que tenerlo. */
  alt: string
  /** `true` cuando el archivo ya existe en /public. */
  filled?: boolean
  width?: number
  height?: number
  /** Qué es esta imagen, en una o dos palabras. Va en la etiqueta del hueco. */
  hint?: string
  /** `true` en la primera imagen visible de la página (candidata a LCP). */
  priority?: boolean
  className?: string
  sizes?: string
}

export function ImageSlot({
  path,
  alt,
  filled = false,
  width = 1200,
  height = 750,
  hint,
  priority = false,
  className,
  sizes = '(min-width: 1024px) 560px, (min-width: 640px) 50vw, 100vw',
}: ImageSlotProps) {
  if (filled) {
    return (
      <div className={className}>
        <Image
          src={path}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          className="h-full w-full object-cover"
        />
      </div>
    )
  }

  const h = hash(path)
  const angle = h % 360
  const cell = 16 + ((h >> 8) % 10)
  const variant = (h >> 4) % 3
  const gid = `is-g-${h.toString(36)}`
  const pid = `is-p-${h.toString(36)}`

  return (
    <div className={`relative overflow-hidden ${className ?? ''}`}>
      {/* El patrón. `aria-hidden` porque no comunica nada: es relleno. */}
      <svg
        viewBox="0 0 400 250"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gid} gradientTransform={`rotate(${angle} .5 .5)`}>
            <stop offset="0%" stopColor="var(--brand)" />
            <stop offset="55%" stopColor="var(--sky)" />
            <stop offset="100%" stopColor="var(--cyan)" />
          </linearGradient>
          <pattern id={pid} width={cell} height={cell} patternUnits="userSpaceOnUse">
            <path
              d={`M ${cell} 0 L 0 0 0 ${cell}`}
              fill="none"
              stroke="var(--surface)"
              strokeOpacity={0.18}
              strokeWidth={1}
            />
          </pattern>
        </defs>
        <rect width="400" height="250" fill={`url(#${gid})`} />
        <rect width="400" height="250" fill={`url(#${pid})`} />
        {variant === 0 && (
          <circle cx="330" cy="40" r="95" fill="var(--surface)" fillOpacity={0.12} />
        )}
        {variant === 1 && (
          <rect
            x="255"
            y="-45"
            width="230"
            height="230"
            rx="44"
            fill="var(--surface)"
            fillOpacity={0.12}
            transform="rotate(18 365 70)"
          />
        )}
        {variant === 2 && (
          <path
            d="M0 205 Q 105 125 205 175 T 400 95"
            fill="none"
            stroke="var(--surface)"
            strokeOpacity={0.3}
            strokeWidth={3}
          />
        )}
      </svg>

      {/* La etiqueta. Panel de cristal FUERTE (no el normal) porque contiene
          texto terciario: medido, ink-subtle sobre .glass da 4.30 y no pasa;
          sobre .glass-strong da 4.54. */}
      {SHOW_LABELS && (
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="glass glass-strong glass-spec max-w-full rounded-xl px-4 py-3 text-center">
            <ImageIcon
              className="mx-auto mb-2 size-5 text-brand-strong"
              aria-hidden="true"
            />
            {hint && (
              <p className="text-xs font-bold uppercase tracking-wider text-brand-strong">
                {hint}
              </p>
            )}
            {/* `break-all` porque una ruta larga no tiene espacios donde
                cortar y desbordaría su columna.

                La ruta se arma en UNA sola plantilla y no como `public{path}`:
                dos hijos de texto adyacentes hacen que React inserte un
                `<!-- -->` entre ellos en el HTML del servidor, así que el
                markup decía `public<!-- -->/proyectos/amazon/captura-1.png`.
                En pantalla se veía igual —el navegador ignora el comentario—
                pero la ruta dejaba de existir como texto: no aparecía al ver
                el código fuente, ni al buscarla con Ctrl+F sobre el HTML, ni
                para ningún script que verifique que los huecos se están
                dibujando. Y el sentido de esta etiqueta es justamente que la
                ruta se pueda leer y copiar. */}
            <code className="mt-1 block break-all font-mono text-[11px] leading-snug text-ink">
              {`public${path}`}
            </code>
            <p className="mt-1 text-[11px] text-ink-subtle" data-numeric="">
              {width}×{height}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
