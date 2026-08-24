import { NAP } from './constants'
import { envOr, envSet } from './env'

/**
 * ════════════════════════════════════════════════════════════════
 * LOS TRES CANALES DE CONTACTO
 *
 * Formulario, WhatsApp y una reunión agendada. Los tres salen de aquí para
 * que una página no pueda quedarse con un enlace viejo, y los tres degradan
 * solos: si un canal no está configurado, NO se pinta. Un botón que lleva a
 * un 404 es peor que un botón que no está.
 *
 * ── QUÉ NECESITA CADA UNO ──
 *   · Formulario  → RESEND_API_KEY + CONTACT_FROM. Ver lib/contact.ts.
 *   · WhatsApp    → NADA. El número ya vive en NAP. Opcionalmente
 *                   NEXT_PUBLIC_WHATSAPP si el de negocio es otro.
 *   · Cal.com     → NEXT_PUBLIC_CAL_LINK, p. ej. `carlosanaya/30min`.
 *
 * ── POR QUÉ CAL.COM VA COMO ENLACE Y NO COMO EMBED ──
 * El embed oficial (`@calcom/embed-react`) mete una librería, un iframe y un
 * script de terceros en la página. En un sitio cuyo producto es Core Web
 * Vitals eso es una contradicción medible: el iframe compite por el hilo
 * principal justo donde se mide el LCP. Un enlace cuesta cero, funciona sin
 * JavaScript y lleva al mismo calendario.
 *
 * Si algún día se quiere el embed, la forma correcta es cargarlo SOLO al
 * hacer clic —no al montar— y el CSP necesitaría `app.cal.com` en
 * `frame-src` y `script-src`. Ese cambio se hace a conciencia, no de paso.
 * ════════════════════════════════════════════════════════════════
 */

/** El número de WhatsApp en dígitos, como lo quiere wa.me (sin `+`). */
function whatsappDigits(): string {
  /* `envOr`: con la variable declarada y vacía, `??` dejaba `raw` en ''
     y el enlace de WhatsApp —el canal que «ya funciona sin configurar
     nada»— apuntaba a wa.me/ sin número. */
  const raw = envOr(process.env.NEXT_PUBLIC_WHATSAPP, NAP.phone)
  return raw.replace(/\D/g, '')
}

/**
 * Un enlace de WhatsApp con el mensaje ya escrito.
 *
 * El texto prellenado no es un detalle: alguien que abre WhatsApp con
 * «Hola» escribe «info?». Alguien que lo abre con la URL de su sitio y la
 * pregunta ya planteada manda un mensaje con el que se puede trabajar. Por
 * eso cada página pasa el suyo.
 */
export function whatsappUrl(message: string): string {
  const digits = whatsappDigits()
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

export function isWhatsappConfigured(): boolean {
  return whatsappDigits().length >= 10
}

/**
 * El calendario. `NEXT_PUBLIC_CAL_LINK` es lo que va después de cal.com/ —
 * usuario y evento, p. ej. `carlosanaya/30min`.
 */
export function calUrl(): string | null {
  const link = process.env.NEXT_PUBLIC_CAL_LINK
  if (!link) return null
  const clean = link.replace(/^https?:\/\/(?:app\.)?cal\.com\//, '').replace(/^\/+/, '')
  return `https://cal.com/${clean}`
}

export function isCalConfigured(): boolean {
  return envSet(process.env.NEXT_PUBLIC_CAL_LINK)
}

/** El `mailto:` con asunto, que es el canal que no depende de nada. */
export function mailtoUrl(subject: string, body?: string): string {
  const q = new URLSearchParams({ subject })
  if (body) q.set('body', body)
  return `mailto:${NAP.email}?${q.toString()}`
}
