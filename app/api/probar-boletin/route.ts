import { envOpt } from '@/lib/env'
import { BLOG_POSTS } from '@/data/blog'
import { previewBroadcast, isBroadcastConfigured } from '@/lib/broadcast'

/**
 * ════════════════════════════════════════════════════════════════
 * /api/probar-boletin — previsualiza o envía el correo de un artículo
 *
 * El cron manda el correo los martes y viernes. Esta ruta permite comprobar
 * ANTES que el correo se ve bien y que la conexión con Resend funciona, sin
 * esperar a que llegue un martes.
 *
 * Por omisión **NO ENVÍA**: crea la difusión como BORRADOR en Resend, para
 * revisarla en el panel. Enviar de verdad exige pedirlo:
 *
 *   # crea el borrador del artículo 1 y no manda nada
 *   curl -H "Authorization: Bearer $CRON_SECRET" \
 *        ".../api/probar-boletin?n=1"
 *
 *   # lo manda de verdad a la audiencia
 *   curl -H "Authorization: Bearer $CRON_SECRET" \
 *        ".../api/probar-boletin?n=1&enviar=si"
 *
 * ── POR QUÉ EL BORRADOR ES EL COMPORTAMIENTO POR OMISIÓN ──
 * Un correo mandado no se puede recoger. Que la acción destructiva necesite un
 * parámetro explícito es la única forma de que una prueba curiosa no acabe en
 * la bandeja de toda la lista.
 *
 * ── EL BORRADOR NO ROMPE LA IDEMPOTENCIA DEL CRON ──
 * Los borradores de prueba se crean con el nombre `prueba-blog-{slug}`, que NO
 * es el nombre que usa el cron (`blog-{slug}`). Así una previsualización no
 * hace que el cron crea que ya mandó el artículo y se lo salte el día que toca.
 * Ese detalle es la diferencia entre una herramienta de prueba y una trampa.
 * ════════════════════════════════════════════════════════════════
 */

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const secreto = envOpt(process.env.CRON_SECRET)
  const auth = request.headers.get('authorization')

  if (!secreto) {
    return Response.json(
      { ok: false, error: 'CRON_SECRET no está configurado.' },
      { status: 401 }
    )
  }
  if (auth !== `Bearer ${secreto}`) {
    return Response.json({ ok: false, error: 'no autorizado' }, { status: 401 })
  }

  if (!isBroadcastConfigured()) {
    return Response.json({
      ok: false,
      configurado: false,
      falta:
        'RESEND_API_KEY, RESEND_AUDIENCE_ID y NEWSLETTER_FROM (o CONTACT_FROM).',
    })
  }

  const url = new URL(request.url)
  const n = Number(url.searchParams.get('n') ?? '1')
  const enviar = url.searchParams.get('enviar') === 'si'

  const post = BLOG_POSTS.find((p) => p.n === n)
  if (!post) {
    return Response.json(
      { ok: false, error: `no hay artículo con n=${n} (el rango es 1–100)` },
      { status: 400 }
    )
  }

  const r = await previewBroadcast(post, enviar)

  if (enviar) {
    return Response.json({
      ok: r.ok,
      modo: 'ENVIADO DE VERDAD a la audiencia',
      articulo: { n: post.n, slug: post.slug, titulo: post.title },
      nombre_de_la_difusion: r.name,
      id: r.id,
      status: r.status,
      respuesta: r.detalle,
      nota: 'Lleva el prefijo «prueba-» a propósito: así este envío NO consume la clave de idempotencia del cron y el martes el artículo se manda igual a la lista.',
    })
  }
  return Response.json({
    ok: r.ok,
    modo: 'BORRADOR — no se envió nada',
    articulo: { n: post.n, slug: post.slug, titulo: post.title },
    nombre_de_la_difusion: r.name,
    id: r.id,
    status: r.status,
    respuesta: r.detalle,
    donde_verlo: 'https://resend.com/broadcasts',
    para_enviar_de_verdad: `añade &enviar=si a esta misma URL`,
  })
}
