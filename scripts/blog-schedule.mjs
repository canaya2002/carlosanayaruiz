/**
 * ════════════════════════════════════════════════════════════════
 * EL CALENDARIO DEL BLOG — lógica pura, sin disco
 *
 * Vive aparte de `generate-blog-data.mjs` por una sola razón: que
 * `check-blog-dates.mjs` pueda ejercer EXACTAMENTE la misma validación con
 * artículos sintéticos en memoria, sin escribir un .md de prueba en
 * content/blog (que el build publicaría).
 *
 * ── DOS CALENDARIOS QUE NO PUEDEN TOCARSE ──
 * Los 100 de la serie (n 1–100) salen MARTES y VIERNES y su fecha se CALCULA
 * de su número: `slot(n − 1)`. No llevan `publishedAt` en el frontmatter, y
 * si lo llevan es un error — mover la fecha de una URL ya indexada le dice a
 * Google que el contenido es otro.
 *
 * Los artículos nuevos (n > 100) salen LUNES y JUEVES y su fecha se DECLARA:
 * `publishedAt` es obligatorio. Lunes y jueves no por estética: es el único
 * reparto en que los dos calendarios no pueden coincidir nunca en un día, así
 * que la lista nunca recibe dos correos la misma mañana por culpa del
 * calendario.
 *
 * Salida: `override ?? slot(n − 1)`.
 * ════════════════════════════════════════════════════════════════
 */

/** Primer martes de la serie. ⚠ No se mueve después de publicar. */
export const SCHEDULE_START = '2026-08-25'
/** 14:00 UTC = 08:00 en Ciudad de México (UTC−6). */
export const PUBLISH_HOUR_UTC = 14
/** Cuántos artículos tiene la serie calculada. */
export const SERIES_SIZE = 100
/**
 * Una fecha propia tiene que ser POSTERIOR a este día. Es el día en que se
 * introdujo el mecanismo: nada declarado a mano puede caer en el pasado del
 * sitio, donde ya hay URLs publicadas e indexadas.
 */
export const OVERRIDE_AFTER = '2026-10-27'

/**
 * Los diez clústeres del índice maestro, con el artículo donde empieza cada
 * uno. Los límites son los `tipo: pillar` del propio contenido.
 *
 * El «acento» es el color que el prompt de portada pide para ese clúster. NO
 * entra en la interfaz: este sistema tiene seis materiales y el minio es
 * semántico. El color vive en la imagen y nada más.
 */
export const CLUSTERS = [
  { from: 1, name: 'IA aplicada a negocios', accent: 'violeta eléctrico' },
  { from: 11, name: 'Ciberseguridad', accent: 'cian sobre rojo alerta' },
  { from: 23, name: 'Desarrollo full-stack moderno', accent: 'verde terminal' },
  { from: 35, name: 'Automatización e IA agéntica', accent: 'ámbar' },
  { from: 45, name: 'SEO, GEO y AEO', accent: 'naranja' },
  { from: 55, name: 'Cloud, DevOps y costos', accent: 'azul profundo' },
  { from: 65, name: 'Construir y monetizar SaaS', accent: 'magenta' },
  { from: 75, name: 'Privacidad, cumplimiento y regulación', accent: 'dorado' },
  { from: 83, name: 'El stack del desarrollador independiente', accent: 'verde azulado' },
  { from: 91, name: 'Tendencias y futuro', accent: 'iridiscente' },
]

/** Martes y viernes consecutivos desde SCHEDULE_START, en UTC. */
export function slot(index) {
  const start = new Date(`${SCHEDULE_START}T00:00:00Z`)
  const week = Math.floor(index / 2)
  // 0 → martes de esa semana · 1 → viernes (tres días después)
  const offset = week * 7 + (index % 2 === 0 ? 0 : 3)
  const d = new Date(start.getTime() + offset * 86400000)
  d.setUTCHours(PUBLISH_HOUR_UTC, 0, 0, 0)
  return d.toISOString().replace('.000Z', 'Z')
}

/** Clúster por rango de número. Solo vale para la serie (n ≤ 100). */
export function clusterOf(n) {
  let hit = CLUSTERS[0]
  for (const c of CLUSTERS) if (n >= c.from) hit = c
  return hit
}

/** `2026-12-03T14:00:00Z`, nada más: sin milisegundos, sin desfase, con Z. */
const OVERRIDE_RE = /^(\d{4}-\d{2}-\d{2})T14:00:00Z$/
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']

/** Motivo por el que una fecha propia no vale, o `null` si vale. */
export function overrideProblem(value) {
  if (typeof value !== 'string') return 'publishedAt tiene que ser texto'
  const m = value.match(OVERRIDE_RE)
  if (!m) {
    return `publishedAt "${value}" no tiene la forma AAAA-MM-DDT14:00:00Z (ISO en UTC, con Z, a las 14:00:00 exactas)`
  }
  const d = new Date(value)
  // `Date` acepta 2026-02-30 y lo pasa a marzo: la ida y vuelta lo detecta.
  if (Number.isNaN(d.getTime()) || d.toISOString().replace('.000Z', 'Z') !== value) {
    return `publishedAt "${value}" no es una fecha real del calendario`
  }
  const dia = d.getUTCDay()
  if (dia !== 1 && dia !== 4) {
    return `publishedAt "${value}" cae en ${DIAS[dia]}; los artículos con fecha propia salen lunes o jueves (martes y viernes son de la serie)`
  }
  if (m[1] <= OVERRIDE_AFTER) {
    return `publishedAt "${value}" no es posterior a ${OVERRIDE_AFTER}`
  }
  return null
}

/**
 * Asigna fecha y clúster a cada artículo y valida todo el conjunto.
 *
 * Recibe `{ n, slug, file, publishedAt?, cluster? }` tal como salen del
 * frontmatter y devuelve `{ posts, errors }`. Los `posts` vienen ordenados
 * por `n` y con `publishedAt` y `cluster` resueltos. Si `errors` no está
 * vacío, el generador no escribe nada.
 */
export function resolveSchedule(input) {
  const errors = []
  const nombre = (p) => p.file ?? `n=${p.n}`
  const clusterNames = new Set(CLUSTERS.map((c) => c.name))

  const posts = [...input].sort((a, b) => a.n - b.n)

  /* ── Números ─────────────────────────────────────────────────── */
  const vistosN = new Map()
  const vistosSlug = new Map()
  for (const p of posts) {
    if (!Number.isInteger(p.n) || p.n < 1) {
      errors.push(`${nombre(p)}: n "${p.n}" no es un entero positivo`)
      continue
    }
    if (vistosN.has(p.n)) errors.push(`${nombre(p)}: n=${p.n} repetido (ya lo usa ${vistosN.get(p.n)})`)
    vistosN.set(p.n, nombre(p))
    if (p.slug) {
      if (vistosSlug.has(p.slug)) errors.push(`${nombre(p)}: slug "${p.slug}" repetido (ya lo usa ${vistosSlug.get(p.slug)})`)
      vistosSlug.set(p.slug, nombre(p))
    }
  }

  /* La serie: exactamente 1..100, una vez cada uno. Los n > 100 se cuentan
     aparte y no entran en esta regla. */
  const serie = posts.filter((p) => p.n >= 1 && p.n <= SERIES_SIZE)
  if (serie.length !== SERIES_SIZE || new Set(serie.map((p) => p.n)).size !== SERIES_SIZE) {
    errors.push(`se esperaban ${SERIES_SIZE} artículos con n 1–${SERIES_SIZE} y hay ${serie.length}`)
  }

  /* Las fechas de la serie, aunque falte alguno: una fecha propia no puede
     coincidir con NINGUNA del calendario normal, ni siquiera con la de un
     hueco. */
  const fechasSerie = new Set(Array.from({ length: SERIES_SIZE }, (_, i) => slot(i)))
  const usadas = new Map()

  const resueltos = posts.map((p) => {
    let publishedAt
    let cluster

    if (p.n >= 1 && p.n <= SERIES_SIZE) {
      if (p.publishedAt !== undefined) {
        errors.push(
          `${nombre(p)}: lleva publishedAt y es de la serie (n ≤ ${SERIES_SIZE}); su fecha se calcula y no se mueve`
        )
      }
      publishedAt = slot(p.n - 1)
      cluster = clusterOf(p.n).name
      if (p.cluster !== undefined && p.cluster !== cluster) {
        errors.push(
          `${nombre(p)}: cluster "${p.cluster}" no coincide con el de su rango ("${cluster}"); la serie no se reclasifica`
        )
      }
    } else {
      if (p.publishedAt === undefined) {
        errors.push(`${nombre(p)}: n=${p.n} está fuera de la serie y no lleva publishedAt (obligatorio para n > ${SERIES_SIZE})`)
      } else {
        const problema = overrideProblem(p.publishedAt)
        if (problema) errors.push(`${nombre(p)}: ${problema}`)
        else if (fechasSerie.has(p.publishedAt)) {
          errors.push(`${nombre(p)}: publishedAt ${p.publishedAt} coincide con una fecha de la serie`)
        }
      }
      publishedAt = p.publishedAt
      /* El clúster por rango no sirve aquí: n=101 caería en «Tendencias y
         futuro» por ser el último, sea de lo que sea. */
      if (p.cluster === undefined) {
        errors.push(`${nombre(p)}: n=${p.n} está fuera de la serie y no lleva cluster (obligatorio para n > ${SERIES_SIZE})`)
      } else if (!clusterNames.has(p.cluster)) {
        errors.push(`${nombre(p)}: cluster "${p.cluster}" no es uno de los ${CLUSTERS.length} del índice maestro`)
      }
      cluster = p.cluster
    }

    if (publishedAt) {
      if (usadas.has(publishedAt)) {
        errors.push(`${nombre(p)}: publishedAt ${publishedAt} repetido (ya lo usa ${usadas.get(publishedAt)})`)
      }
      usadas.set(publishedAt, nombre(p))
    }

    return { ...p, publishedAt, cluster }
  })

  return { posts: resueltos, errors }
}
