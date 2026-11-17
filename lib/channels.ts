import { NAP } from './constants'
import { envSet } from './env'

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
 *   · WhatsApp    → no hay enlace. El número se imprime como texto:
 *                   «WhatsApp 55 6920 1203».
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
