import Image from 'next/image'

/**
 * ════════════════════════════════════════════════════════════════
 * PORTADA DE PROYECTO
 *
 * El sitio necesita verse lleno de imágenes, y hoy no hay ninguna: el
 * repositorio solo tiene el retrato. En lugar de dejar huecos grises o —peor—
 * meter fotos de banco que no tienen nada que ver con el trabajo, este
 * componente dibuja una portada geométrica DETERMINISTA a partir del slug.
 *
 * Determinista importa: el mismo proyecto siempre se ve igual, entre recargas y
 * entre despliegues. No es aleatorio, es un hash.
 *
 * Y es temporal por diseño: en cuanto haya una captura real en el array
 * `shots` de data/companies.ts, este componente se quita de en medio y muestra
 * la foto. No hay que cambiar código, solo agregar la ruta al archivo de datos.
 *
 * Es SVG inline, así que no pesa nada, escala a cualquier tamaño y usa los
 * mismos tokens de color que el resto del sitio.
 * ════════════════════════════════════════════════════════════════
 */

/**
 * Hash de 32 bits, estable entre ejecuciones (FNV-1a).
 *
 * No se usa `Math.random()` ni la fecha: la portada tiene que ser idéntica en
 * el servidor y en el cliente, o React reporta un desajuste de hidratación.
 */
function hash(input: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

interface Props {
  /** Semilla del patrón. El slug del proyecto. */
  seed: string
  /** Iniciales o etiqueta corta sobre el patrón. */
  label: string
  /** Si hay una captura real, se muestra en vez del patrón generado. */
  shot?: string
  /** Texto alternativo de la captura real. Obligatorio si hay `shot`. */
  shotAlt?: string
  className?: string
  /** `true` en la primera tarjeta visible, para que sea el LCP y no se retrase. */
  priority?: boolean
}

export function ProjectCover({
  seed,
  label,
  shot,
  shotAlt,
  className,
  priority = false,
}: Props) {
  // Captura real: gana siempre sobre el patrón generado.
  if (shot) {
    return (
      <div className={className}>
        <Image
          src={shot}
          alt={shotAlt ?? ''}
          width={1200}
          height={750}
          className="h-full w-full object-cover"
          sizes="(min-width: 1024px) 560px, (min-width: 640px) 50vw, 100vw"
          priority={priority}
        />
      </div>
    )
  }

  const h = hash(seed)

  // Cuatro variantes de composición, elegidas por el hash.
  const variant = h % 4
  // Rotación del gradiente: 0-359, derivada del hash para que dos proyectos
  // contiguos casi nunca coincidan.
  const angle = (h >> 4) % 360
  // Densidad de la cuadrícula.
  const cell = 14 + ((h >> 8) % 10)

  const gid = `pc-g-${seed}`
  const pid = `pc-p-${seed}`

  return (
    <div className={className} aria-hidden="true">
      <svg
        viewBox="0 0 400 250"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient
            id={gid}
            gradientTransform={`rotate(${angle} 0.5 0.5)`}
          >
            <stop offset="0%" stopColor="var(--brand)" />
            <stop offset="55%" stopColor="var(--sky)" />
            <stop offset="100%" stopColor="var(--cyan)" />
          </linearGradient>

          <pattern
            id={pid}
            width={cell}
            height={cell}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${cell} 0 L 0 0 0 ${cell}`}
              fill="none"
              stroke="var(--surface)"
              strokeOpacity={0.16}
              strokeWidth={1}
            />
          </pattern>
        </defs>

        <rect width="400" height="250" fill={`url(#${gid})`} />
        <rect width="400" height="250" fill={`url(#${pid})`} />

        {/* La figura cambia según la variante. Todas son geometría simple:
            nada de intentar parecer una captura de pantalla falsa. */}
        {variant === 0 && (
          <>
            <circle cx="330" cy="40" r="90" fill="var(--surface)" fillOpacity={0.1} />
            <circle cx="60" cy="215" r="70" fill="var(--surface)" fillOpacity={0.08} />
          </>
        )}
        {variant === 1 && (
          <>
            <rect
              x="250"
              y="-40"
              width="220"
              height="220"
              rx="40"
              fill="var(--surface)"
              fillOpacity={0.1}
              transform="rotate(18 360 70)"
            />
            <rect
              x="-30"
              y="170"
              width="160"
              height="160"
              rx="32"
              fill="var(--surface)"
              fillOpacity={0.07}
            />
          </>
        )}
        {variant === 2 && (
          <>
            {[0, 1, 2, 3].map((i) => (
              <rect
                key={i}
                x={40 + i * 26}
                y={190 - i * 34}
                width="16"
                height={40 + i * 34}
                rx="8"
                fill="var(--surface)"
                fillOpacity={0.14 - i * 0.02}
              />
            ))}
            <circle cx="330" cy="60" r="70" fill="var(--surface)" fillOpacity={0.08} />
          </>
        )}
        {variant === 3 && (
          <>
            <path
              d="M0 200 Q 100 120 200 170 T 400 90"
              fill="none"
              stroke="var(--surface)"
              strokeOpacity={0.28}
              strokeWidth={3}
            />
            <path
              d="M0 235 Q 120 175 210 210 T 400 140"
              fill="none"
              stroke="var(--surface)"
              strokeOpacity={0.15}
              strokeWidth={2}
            />
          </>
        )}

        {/* Iniciales. `stroke` con `paintOrder` da un contorno que garantiza
            legibilidad sobre cualquier punto del gradiente, incluido el cian,
            que mide 1.8:1 y por sí solo no sostendría texto. */}
        <text
          x="28"
          y="62"
          className="font-display"
          fontSize="34"
          fontWeight="700"
          fill="var(--surface)"
          fillOpacity={0.95}
          stroke="var(--brand-strong)"
          strokeWidth={0.8}
          paintOrder="stroke"
        >
          {label}
        </text>
      </svg>
    </div>
  )
}
