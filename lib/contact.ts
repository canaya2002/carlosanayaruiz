import { NAP } from './constants'

/**
 * ════════════════════════════════════════════════════════════════
 * LA RECEPCIÓN DE MENSAJES
 *
 * El formulario de contacto era un compositor de `mailto:`: abría la
 * aplicación de correo del visitante y de ahí en adelante el envío era suyo.
 * Honesto, y con un techo obvio — quien no tiene cliente de correo
 * configurado (la mayoría en móvil, con webmail) se queda sin poder enviar.
 *
 * Esto lo recibe de verdad: valida, manda el correo por Resend y —si y solo
 * si está configurado— guarda una copia en Supabase.
 *
 * ── POR QUÉ NO HAY SDK, OTRA VEZ ──
 * La API de Resend es un POST con JSON y la de Supabase es REST. Dos `fetch`
 * hacen el trabajo sin añadir dependencias, sin bundle y sin acoplarse a una
 * versión. Es la misma decisión que en lib/newsletter.ts, y por lo mismo.
 *
 * ── LA BASE DE DATOS ES OPCIONAL, Y A PROPÓSITO ──
 * Un formulario de contacto NO necesita base de datos: necesita que el correo
 * llegue. Supabase entra solo si hay credenciales, y su fallo NO tumba el
 * envío — si la fila no se guarda pero el correo salió, el mensaje llegó, y
 * eso es lo que importa. Al revés sería perder un cliente por un problema de
 * infraestructura.
 *
 * ── QUÉ HACE FALTA ──
 *   RESEND_API_KEY            obligatorio. Empieza por `re_`.
 *   CONTACT_FROM              obligatorio. Un remitente de un dominio
 *                             VERIFICADO en Resend. Sin verificar, la API
 *                             responde 403 y no hay forma de saberlo desde
 *                             aquí más que por el fallo.
 *   CONTACT_TO                opcional. Por defecto, el correo de NAP.
 *   SUPABASE_URL              opcional
 *   SUPABASE_SERVICE_ROLE_KEY opcional. Va en el SERVIDOR y nunca con
 *                             prefijo NEXT_PUBLIC_.
 *   SUPABASE_LEADS_TABLE      opcional. Por defecto `leads`.
 *
 * Ver docs/CONECTAR.md para el paso a paso y .env.example para las claves.
 * ════════════════════════════════════════════════════════════════
 */

export type LeadResult =
  | 'ok'
  | 'datos-invalidos'
  | 'sin-configurar'
  | 'rechazado'
  | 'error'

export interface Lead {
  nombre: string
  email: string
  /** De qué va: el servicio, o «no sé todavía». Opcional. */
  asunto?: string
  /** La URL del sitio del que se habla. Opcional, y lo más útil de todo. */
  sitio?: string
  mensaje: string
  /** De qué página salió el mensaje. Contexto para responder. */
  origen?: string
  locale: string
}

const LIMITES = {
  nombre: 90,
  email: 254,
  asunto: 140,
  sitio: 300,
  mensaje: 4000,
} as const

/**
 * Validación conservadora del correo. No intenta implementar RFC 5322 —nadie
 * debería— sino descartar lo que seguro no es un correo antes de gastar una
 * petición.
 */
function correoPlausible(v: string): boolean {
  if (v.length < 6 || v.length > LIMITES.email) return false
  if (/\s/.test(v)) return false
  const at = v.indexOf('@')
  if (at < 1 || at !== v.lastIndexOf('@')) return false
  const dom = v.slice(at + 1)
  const dot = dom.lastIndexOf('.')
  return dom.length >= 4 && dot > 0 && dom.length - dot >= 3
}

function limpio(v: unknown, max: number): string {
  return String(v ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
}

/** Escapa para meterlo en el HTML del correo. */
function esc(v: string): string {
  return v
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function isContactConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_FROM)
}

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

/**
 * Guarda el mensaje en Supabase. NO lanza y NO decide el resultado del envío:
 * si la fila falla pero el correo salió, el mensaje llegó.
 */
async function guardar(lead: Lead): Promise<void> {
  if (!isSupabaseConfigured()) return
  const url = process.env.SUPABASE_URL!.replace(/\/+$/, '')
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const tabla = process.env.SUPABASE_LEADS_TABLE ?? 'leads'
  try {
    await fetch(`${url}/rest/v1/${tabla}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        apikey: key,
        authorization: `Bearer ${key}`,
        prefer: 'return=minimal',
      },
      body: JSON.stringify({
        nombre: lead.nombre,
        email: lead.email,
        asunto: lead.asunto ?? null,
        sitio: lead.sitio ?? null,
        mensaje: lead.mensaje,
        origen: lead.origen ?? null,
        locale: lead.locale,
      }),
      signal: AbortSignal.timeout(6000),
    })
  } catch {
    /* Silencio deliberado: ver el comentario de la función. */
  }
}

/**
 * Recibe un mensaje. No lanza nunca: devuelve un resultado que el formulario
 * sabe pintar.
 */
export async function sendLead(
  raw: Lead,
  /** El cebo. Si viene lleno, es un bot. */
  cebo?: string
): Promise<LeadResult> {
  if (cebo && cebo.length > 0) return 'rechazado'

  const lead: Lead = {
    nombre: limpio(raw.nombre, LIMITES.nombre),
    email: limpio(raw.email, LIMITES.email).toLowerCase(),
    asunto: limpio(raw.asunto, LIMITES.asunto) || undefined,
    sitio: limpio(raw.sitio, LIMITES.sitio) || undefined,
    /* El mensaje NO se colapsa a una línea: los saltos son información. */
    mensaje: String(raw.mensaje ?? '')
      .trim()
      .slice(0, LIMITES.mensaje),
    origen: limpio(raw.origen, 120) || undefined,
    locale: raw.locale === 'en' ? 'en' : 'es',
  }

  if (lead.nombre.length < 2) return 'datos-invalidos'
  if (!correoPlausible(lead.email)) return 'datos-invalidos'
  if (lead.mensaje.length < 12) return 'datos-invalidos'

  const key = process.env.RESEND_API_KEY
  const from = process.env.CONTACT_FROM
  if (!key || !from) return 'sin-configurar'

  const to = process.env.CONTACT_TO ?? NAP.email

  /* El asunto lleva el nombre y de qué va: en una bandeja con cien correos,
     un asunto que ya dice el tema se responde antes. */
  const subject = `Sitio · ${lead.nombre}${lead.asunto ? ` · ${lead.asunto}` : ''}`

  const filas: [string, string | undefined][] = [
    ['Nombre', lead.nombre],
    ['Correo', lead.email],
    ['Asunto', lead.asunto],
    ['Sitio', lead.sitio],
    ['Origen', lead.origen],
    ['Idioma', lead.locale],
  ]

  const html =
    '<div style="font:14px/1.55 -apple-system,Segoe UI,sans-serif;color:#12100e">' +
    '<table style="border-collapse:collapse;margin-bottom:18px">' +
    filas
      .filter(([, v]) => v)
      .map(
        ([k, v]) =>
          `<tr><td style="padding:3px 14px 3px 0;color:#6b6459">${esc(k)}</td>` +
          `<td style="padding:3px 0"><strong>${esc(v!)}</strong></td></tr>`
      )
      .join('') +
    '</table>' +
    '<div style="white-space:pre-wrap;border-top:1px solid #ddd7c9;padding-top:14px">' +
    esc(lead.mensaje) +
    '</div></div>'

  const text =
    filas
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n') +
    '\n\n' +
    lead.mensaje +
    '\n'

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
        text,
        /* Así se contesta con «Responder» sin copiar la dirección a mano. Es
           la diferencia entre responder en un minuto y en un día. */
        reply_to: lead.email,
      }),
      signal: AbortSignal.timeout(9000),
    })

    if (!res.ok) return 'error'
  } catch {
    return 'error'
  }

  /* Después del correo, nunca antes: la copia en base de datos es un extra. */
  await guardar(lead)
  return 'ok'
}
