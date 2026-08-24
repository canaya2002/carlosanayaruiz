import { revalidatePath } from 'next/cache'
import { envOpt } from '@/lib/env'
import { BLOG_POSTS } from '@/data/blog'
import { isPublished } from '@/lib/blog'
import { sendPostBroadcast, isBroadcastConfigured } from '@/lib/broadcast'
import { SITE_CONFIG } from '@/lib/constants'

/**
 * ════════════════════════════════════════════════════════════════
 * /api/cron/publicar — el disparador del calendario
 *
 * Corre los martes y viernes a las 14:00 UTC (08:00 en Ciudad de México). Ver
 * `vercel.json`. Hace tres cosas, en este orden:
 *
 *   1. Revalida el artículo, el índice, el sitemap y el feed. La página ya
 *      existe generada como 404; esto la convierte en la página publicada AL
 *      MOMENTO en vez de esperar la ventana de ISR de 15 minutos.
 *   2. Manda el artículo a los suscriptores por Resend.
 *   3. Devuelve un resumen de lo que hizo.
 *
 * ── EL ORDEN NO ES CASUAL ──
 * Se revalida, se CALIENTA la página, y solo entonces se envía el correo. Al
 * revés, el correo podría llegar antes de que la URL respondiera 200 y el
 * primer clic de la lista se encontraría un 404 — y la lista entera hace clic
 * en los primeros minutos.
 *
 * El calentamiento no es un adorno: las 100 rutas están prerenderizadas como
 * 404 (es el gate de publicación), y una entrada de caché vencida pero dentro
 * de su `expire` se sirve OBSOLETA mientras se regenera por detrás. Pedir la
 * página una vez desde el propio cron fuerza esa regeneración antes de que
 * exista un solo lector.
 *
 * ── LA VENTANA DE RECUPERACIÓN ──
 * Medido sobre el calendario real: los huecos entre publicaciones alternan
 * **72 h y 96 h** (50 y 49 respectivamente). Con una ventana de 72 h, el
 * artículo del viernes ya tenía 96 h el martes siguiente y quedaba FUERA:
 * la ventana era funcionalmente «solo el de hoy» y no recuperaba nada.
 *
 * Ocho días cubren dos ejecuciones perdidas seguidas. No se pone más ancha
 * porque en el primer despliegue tardío mandaría de golpe varios artículos
 * viejos a la lista; el tope de abajo es la segunda red.
 *
 * Y Vercel NO reintenta un cron fallido, así que esta ventana es el único
 * mecanismo de recuperación que hay.
 *
 * ── AUTENTICACIÓN ──
 * Vercel Cron manda `Authorization: Bearer $CRON_SECRET`. Sin el secreto
 * configurado la ruta responde 401 a todo el mundo, incluido Vercel: una ruta
 * que dispara correos a una lista no puede quedar abierta por omisión.
 * ════════════════════════════════════════════════════════════════
 */

/** Nunca se cachea: es un disparador, no una lectura. */
export const dynamic = 'force-dynamic'

/** Margen de recuperación. Ver la nota de arriba: 72 h no recuperaba nada. */
const VENTANA_MS = 8 * 24 * 60 * 60 * 1000

/**
 * Tope de correos por ejecución.
 *
 * Con la ventana de ocho días, un despliegue muy retrasado podría tener tres o
 * cuatro artículos vencidos a la vez. Mandar cuatro correos seguidos a la lista
 * en un minuto es la definición de spam, y no se puede deshacer. Se manda el
 * más reciente de los pendientes y los demás se dejan: son noticias viejas, y
 * quien se acaba de suscribir no las pidió.
 */
const MAX_CORREOS = 2

export async function GET(request: Request) {
  // envOpt: un CRON_SECRET en blanco no puede considerarse configurado, o
  // el 401 se convertiría en «Bearer  » y cualquiera podría dispararlo.
  const secreto = envOpt(process.env.CRON_SECRET)
  const auth = request.headers.get('authorization')

  if (!secreto) {
    return Response.json(
      {
        ok: false,
        error:
          'CRON_SECRET no está configurado. Sin él esta ruta queda abierta y dispara correos a la lista, así que se rechaza por omisión.',
      },
      { status: 401 }
    )
  }

  if (auth !== `Bearer ${secreto}`) {
    return Response.json({ ok: false, error: 'no autorizado' }, { status: 401 })
  }

  const ahora = Date.now()

  /* Lo que ya salió dentro de la ventana de recuperación. Del más antiguo al
     más reciente: si hay dos pendientes, se manda primero el que tocaba
     primero. */
  const recientes = BLOG_POSTS.filter((post) => {
    const t = Date.parse(post.publishedAt)
    return t <= ahora && ahora - t <= VENTANA_MS
  }).sort((a, b) => Date.parse(a.publishedAt) - Date.parse(b.publishedAt))

  /* 1. Revalidar. Se hace SIEMPRE, aunque el correo no esté configurado: la
        publicación de la página no depende del boletín. */
  const rutas = [
    '/es/blog',
    '/es/blog/opengraph-image/card',
    '/sitemap.xml',
    '/feed.xml',
  ]
  for (const post of recientes) rutas.push(`/es/blog/${post.slug}`)

  const falloRevalidacion: string[] = []
  for (const ruta of rutas) {
    try {
      revalidatePath(ruta)
    } catch (e) {
      console.error('[cron] revalidatePath falló:', ruta, e)
      falloRevalidacion.push(ruta)
    }
  }

  /* 2. CALENTAR la página antes de anunciarla.
        Las 100 rutas están prerenderizadas como 404 y una entrada vencida
        dentro de su `expire` se sirve obsoleta mientras regenera. Pedirla
        aquí hace que el primer lector —o Googlebot— no reciba ese 404. */
  const calentadas: { slug: string; status: number | string }[] = []
  const base =
    envOpt(process.env.NEXT_PUBLIC_SITE_URL) ??
    (envOpt(process.env.VERCEL_PROJECT_PRODUCTION_URL)
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : SITE_CONFIG.url)

  for (const post of recientes) {
    const url = `${base}/es/blog/${post.slug}`
    try {
      const r = await fetch(url, {
        cache: 'no-store',
        headers: { 'user-agent': 'carlosanayaruiz.com/cron-warmup' },
        signal: AbortSignal.timeout(12000),
      })
      calentadas.push({ slug: post.slug, status: r.status })
      if (r.status !== 200) {
        console.error(
          `[cron] la página de ${post.slug} responde ${r.status} DESPUÉS de revalidar — no se anuncia por correo`
        )
      }
    } catch (e) {
      calentadas.push({
        slug: post.slug,
        status: e instanceof Error ? e.name : 'error',
      })
      console.error(`[cron] no se pudo calentar ${url}`, e)
    }
  }

  /* 3. Enviar. Solo lo que de verdad responde 200: anunciar por correo una
        URL que devuelve 404 es el peor resultado posible de todo esto. */
  const enviables = recientes
    .filter((p) => calentadas.find((c) => c.slug === p.slug)?.status === 200)
    // Del más reciente hacia atrás, y con tope: ver MAX_CORREOS.
    .slice(-MAX_CORREOS)

  const omitidos = recientes
    .filter((p) => !enviables.includes(p))
    .map((p) => p.slug)

  const enviados: { slug: string; resultado: string }[] = []
  if (isBroadcastConfigured()) {
    for (const post of enviables) {
      const resultado = await sendPostBroadcast(post)
      enviados.push({ slug: post.slug, resultado })
    }
  }

  const siguiente = BLOG_POSTS.filter((p) => !isPublished(p, ahora)).sort(
    (a, b) => Date.parse(a.publishedAt) - Date.parse(b.publishedAt)
  )[0]

  /* Un fallo de revalidación o de calentamiento NO puede pasar por 200.
     Antes se registraba y se devolvía `ok: true`, así que en el panel de Cron
     Jobs de Vercel una ejecución que dejó la página en 404 se veía idéntica a
     una correcta — y eso es cómo se tarda una semana en enterarse. */
  const problemas = [
    ...falloRevalidacion.map((r) => `revalidación falló: ${r}`),
    ...calentadas
      .filter((c) => c.status !== 200)
      .map((c) => `la página de ${c.slug} responde ${c.status}`),
    ...enviados
      .filter((e) => e.resultado === 'error')
      .map((e) => `el correo de ${e.slug} falló`),
  ]

  return Response.json(
    {
      ok: problemas.length === 0,
      momento: new Date(ahora).toISOString(),
      revalidadas: rutas,
      enVentana: recientes.map((p) => p.slug),
      calentadas,
      omitidos: omitidos.length ? omitidos : undefined,
      correo: isBroadcastConfigured()
        ? enviados
        : 'sin configurar: falta RESEND_API_KEY, RESEND_AUDIENCE_ID o NEWSLETTER_FROM',
      problemas: problemas.length ? problemas : undefined,
      siguiente: siguiente
        ? { slug: siguiente.slug, fecha: siguiente.publishedAt }
        : 'la serie terminó',
    },
    { status: problemas.length ? 500 : 200 }
  )
}
