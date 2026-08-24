import { envOr, envSet } from './env'

/**
 * ════════════════════════════════════════════════════════════════
 * LA SUSCRIPCIÓN — la lista de correo, antes de que existan los blogs
 *
 * Se prepara ahora para que el día que salga el primer artículo ya haya
 * gente a quien mandárselo. Esa es toda la razón de existir de este
 * archivo: una lista que empieza a llenarse antes de tener contenido vale
 * más que un formulario perfecto el día del lanzamiento.
 *
 * ── POR QUÉ NO HAY UN SDK ──
 * Cualquier proveedor de correo —Buttondown, Resend, Mailchimp, Brevo—
 * acepta un POST con JSON. Un SDK metería una dependencia, un bundle y un
 * acoplamiento a cambio de nada. Dos variables de entorno y un `fetch`
 * hacen el mismo trabajo y dejan cambiar de proveedor sin tocar código.
 *
 *   NEWSLETTER_ENDPOINT   la URL a la que se manda el alta
 *   NEWSLETTER_TOKEN      el bearer, si el proveedor lo pide
 *   NEWSLETTER_FIELD      el nombre del campo del correo. Por defecto
 *                         `email`; Buttondown usa `email_address`.
 *
 * ── SIN CONFIGURAR NO MIENTE ──
 * Si falta el endpoint, la función NO devuelve «listo». Devuelve
 * `sin-configurar`, el formulario lo dice y el correo no se pierde en
 * silencio — que es exactamente lo que hace un formulario roto en
 * producción durante seis meses.
 * ════════════════════════════════════════════════════════════════
 */

export type NewsletterResult =
  | 'ok'
  | 'ya-estaba'
  | 'correo-invalido'
  | 'sin-configurar'
  | 'error'

/**
 * Validación deliberadamente conservadora. No intenta implementar RFC 5322
 * —nadie debería— sino descartar lo que seguro no es un correo antes de
 * gastar una petición: un arroba, algo a cada lado, un punto en el dominio
 * y ningún espacio.
 */
export function isEmail(value: string): boolean {
  if (value.length < 6 || value.length > 254) return false
  if (/\s/.test(value)) return false
  const at = value.indexOf('@')
  if (at < 1 || at !== value.lastIndexOf('@')) return false
  const domain = value.slice(at + 1)
  if (domain.length < 4) return false
  const dot = domain.lastIndexOf('.')
  return dot > 0 && domain.length - dot >= 3
}

export function isNewsletterConfigured(): boolean {
  return envSet(process.env.NEWSLETTER_ENDPOINT)
}

/**
 * Da de alta un correo. No lanza nunca: devuelve un resultado que el
 * formulario sabe pintar.
 */
export async function subscribe(
  email: string,
  locale: string
): Promise<NewsletterResult> {
  const clean = email.trim().toLowerCase()
  if (!isEmail(clean)) return 'correo-invalido'

  const endpoint = process.env.NEWSLETTER_ENDPOINT
  if (!endpoint) return 'sin-configurar'

  const field = envOr(process.env.NEWSLETTER_FIELD, 'email')
  const token = process.env.NEWSLETTER_TOKEN

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      /* `tags` y `metadata` los ignora el proveedor que no los entienda, y
         al que sí, le dice de qué idioma vino el alta — que es lo que
         decide en qué idioma se le escribe después. */
      body: JSON.stringify({
        [field]: clean,
        tags: ['sitio', locale],
        metadata: { locale, origen: 'carlosanayaweb.com' },
      }),
      /* Un proveedor lento no puede colgar el envío del formulario. */
      signal: AbortSignal.timeout(8000),
    })

    if (res.ok) return 'ok'
    /* 409 en casi todos los proveedores es «ya estaba en la lista», y eso
       para quien lo escribe es un éxito, no un error. */
    if (res.status === 409 || res.status === 422) return 'ya-estaba'
    return 'error'
  } catch {
    return 'error'
  }
}
