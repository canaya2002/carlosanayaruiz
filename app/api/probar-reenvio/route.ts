import { forwardLeadVerbose, isForwardConfigured } from '@/lib/forward'
import { envOpt } from '@/lib/env'
import type { Lead } from '@/lib/contact'

/**
 * ════════════════════════════════════════════════════════════════
 * /api/probar-reenvio — dispara un lead de PRUEBA al sistema externo
 *
 * Existe porque «¿funcionó la integración?» no se puede contestar mirando
 * código: hay que mandar algo y ver qué responde el otro lado. Esta ruta manda
 * un mensaje de prueba y devuelve **exactamente** lo que contestó el receptor:
 * el status, el cuerpo de la respuesta y el cuerpo que se le envió.
 *
 * Con eso se diagnostica en un intento:
 *   · 401 / 403 → el token o el esquema de autenticación no cuadran
 *   · 404       → la URL está mal
 *   · 422 / 400 → el receptor espera otros nombres de campo (usa
 *                 LEAD_WEBHOOK_FIELDS para renombrarlos sin tocar código)
 *   · timeout   → el receptor no responde, o bloquea la IP de Vercel
 *   · 2xx       → funcionó
 *
 * ── ESTÁ PROTEGIDA, Y TIENE QUE ESTARLO ──
 * Manda datos a un sistema tercero. Abierta, cualquiera podría inundar ese
 * sistema de leads falsos desde este dominio. Usa el mismo `CRON_SECRET` que
 * el cron de publicación: sin él responde 401 a todo el mundo.
 *
 *   curl -H "Authorization: Bearer $CRON_SECRET" \
 *        https://carlosanayaruiz.com/api/probar-reenvio
 *
 * ── LO QUE MANDA ES RECONOCIBLE COMO PRUEBA ──
 * El nombre, el correo y el mensaje dicen que es una prueba, y el `origen`
 * también. Nadie del otro lado va a confundirlo con un cliente real ni va a
 * llamar a un teléfono inventado. Se puede personalizar por query string.
 * ════════════════════════════════════════════════════════════════
 */

export const dynamic = 'force-dynamic'

function leadDePrueba(url: URL): Lead {
  const sello = new Date().toISOString()
  return {
    nombre: url.searchParams.get('nombre') ?? 'PRUEBA — no es un cliente real',
    email: url.searchParams.get('email') ?? 'prueba+reenvio@carlosanayaruiz.com',
    asunto: url.searchParams.get('asunto') ?? 'Prueba de integración',
    sitio: url.searchParams.get('sitio') ?? 'https://carlosanayaruiz.com',
    mensaje:
      url.searchParams.get('mensaje') ??
      `Mensaje de PRUEBA generado por /api/probar-reenvio el ${sello}. ` +
        'Si lo estás viendo en tu sistema, el puente del formulario funciona. ' +
        'Puedes borrarlo.',
    origen: url.searchParams.get('origen') ?? 'prueba automática del puente',
    locale: 'es',
  }
}

async function manejar(request: Request) {
  // envOpt: un CRON_SECRET en blanco no puede considerarse configurado, o
  // el 401 se convertiría en «Bearer  » y cualquiera podría dispararlo.
  const secreto = envOpt(process.env.CRON_SECRET)
  const auth = request.headers.get('authorization')

  if (!secreto) {
    return Response.json(
      {
        ok: false,
        error:
          'CRON_SECRET no está configurado. Esta ruta manda datos a un sistema externo, así que sin secreto se rechaza por omisión.',
      },
      { status: 401 }
    )
  }
  if (auth !== `Bearer ${secreto}`) {
    return Response.json({ ok: false, error: 'no autorizado' }, { status: 401 })
  }

  if (!isForwardConfigured()) {
    return Response.json(
      {
        ok: false,
        configurado: false,
        error: 'El reenvío no está configurado.',
        falta:
          'LEAD_WEBHOOK_URL (obligatoria, https). Opcionales: LEAD_WEBHOOK_AUTH, LEAD_WEBHOOK_TOKEN, LEAD_WEBHOOK_HEADER, LEAD_WEBHOOK_FORMAT, LEAD_WEBHOOK_FIELDS, LEAD_WEBHOOK_EXTRA, LEAD_WEBHOOK_METHOD, LEAD_WEBHOOK_TIMEOUT_MS, LEAD_WEBHOOK_RETRIES.',
      },
      { status: 200 }
    )
  }

  const url = new URL(request.url)
  const lead = leadDePrueba(url)
  const r = await forwardLeadVerbose(lead)

  const funciono = typeof r.status === 'number' && r.status >= 200 && r.status < 300

  return Response.json(
    {
      ok: funciono,
      veredicto: funciono
        ? `Funcionó: el receptor respondió ${r.status}.`
        : r.error
          ? `No llegó: ${r.error}. Revisa que la URL sea alcanzable desde internet y que no bloquee a Vercel.`
          : `Llegó pero el receptor lo rechazó con ${r.status}. Mira "respuesta" para saber qué le falta al cuerpo, y usa LEAD_WEBHOOK_FIELDS para renombrar campos.`,
      destino: r.destino,
      autenticacion: r.auth,
      formato: r.formato,
      status: r.status,
      ms: r.ms,
      cuerpo_enviado: r.cuerpoEnviado,
      respuesta_del_receptor: r.respuesta,
      error: r.error,
    },
    { status: 200 }
  )
}

export async function GET(request: Request) {
  return manejar(request)
}

/** POST hace lo mismo: algunos clientes de prueba solo mandan POST. */
export async function POST(request: Request) {
  return manejar(request)
}
