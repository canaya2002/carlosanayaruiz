import type { BlogPost } from '@/data/blog'

/**
 * ════════════════════════════════════════════════════════════════
 * EL ORDEN DEL BLOG — funciones puras sobre una lista de artículos
 *
 * Reciben la lista en vez de leer `BLOG_POSTS`, y solo importan tipos, para
 * que `scripts/check-blog-dates.mjs` las ejerza con artículos sintéticos en
 * memoria. `lib/blog.ts` las llama con el registro real.
 *
 * ── EL ORDEN ES LA FECHA, NO EL NÚMERO ──
 * En la serie (n 1–100) los dos coinciden, porque la fecha se calcula del
 * número. Un artículo con fecha propia rompe esa igualdad: el 101 puede salir
 * en diciembre de 2026, entre el 29 y el 30. Ordenar por `n` lo mandaría
 * detrás del último publicado y el «anterior / siguiente» saltaría de
 * diciembre a agosto. Todo lo que ordena aquí ordena por `publishedAt`, con
 * `n` solo como desempate.
 * ════════════════════════════════════════════════════════════════
 */

type Lista = readonly BlogPost[]

/** ¿Ya salió? Comparación en UTC, sin excepciones. */
export function isPublished(post: BlogPost, now: number): boolean {
  return Date.parse(post.publishedAt) <= now
}

/** Más antiguo primero; a igual fecha, por número. */
function cronologico(a: BlogPost, b: BlogPost): number {
  return Date.parse(a.publishedAt) - Date.parse(b.publishedAt) || a.n - b.n
}

/** Los publicados, del más reciente al más antiguo. */
export function publishedIn(posts: Lista, now: number): BlogPost[] {
  return posts.filter((p) => isPublished(p, now)).sort((a, b) => cronologico(b, a))
}

/** El siguiente en salir, si queda alguno. */
export function nextIn(posts: Lista, now: number): BlogPost | undefined {
  return posts.filter((p) => !isPublished(p, now)).sort(cronologico)[0]
}

/** El anterior y el siguiente en el calendario, entre los publicados. */
export function neighboursIn(posts: Lista, post: BlogPost, now: number) {
  const publicados = posts.filter((p) => isPublished(p, now)).sort(cronologico)
  const i = publicados.findIndex((p) => p.n === post.n)
  if (i < 0) return { anterior: undefined, siguiente: undefined }
  return {
    anterior: i > 0 ? publicados[i - 1] : undefined,
    siguiente: i < publicados.length - 1 ? publicados[i + 1] : undefined,
  }
}
