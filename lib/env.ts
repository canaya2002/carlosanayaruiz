/**
 * ════════════════════════════════════════════════════════════════
 * VARIABLES DE ENTORNO VACÍAS — el bug que rompió el formulario
 *
 * `process.env.CONTACT_TO ?? NAP.email` parece correcto y no lo es.
 *
 * `??` solo cae al valor por omisión cuando la izquierda es `null` o
 * `undefined`. Una variable declarada y vacía —`CONTACT_TO=` en un archivo
 * .env, o una variable añadida en el panel de Vercel y dejada en blanco— llega
 * como la CADENA VACÍA, que no es nullish. Así que el valor por omisión nunca
 * entra y el código sigue con `''`.
 *
 * Lo que eso produjo, medido enviando el formulario de verdad: Resend recibió
 * `to: ['']`, respondió 422, y el visitante vio «Algo falló de mi lado».
 * El formulario de contacto del sitio, roto en silencio, por un `??`.
 *
 * Y no era un caso aislado. La misma forma estaba en:
 *   · lib/channels.ts   → NEXT_PUBLIC_WHATSAPP vacío rompía el enlace de
 *                         WhatsApp, que es el canal que «ya funciona»
 *   · lib/broadcast.ts  → NEWSLETTER_FROM vacío mandaba `from: ''`
 *   · lib/newsletter.ts → NEWSLETTER_FIELD vacío mandaba el campo `''`
 *   · lib/contact.ts    → SUPABASE_LEADS_TABLE vacío pedía la tabla `''`
 *
 * Es un error especialmente traicionero porque el .env.example de este repo
 * INVITA a dejarlas vacías: documenta `CONTACT_TO=` como «opcional».
 *
 * ── POR QUÉ ESTAS FUNCIONES RECIBEN EL VALOR Y NO EL NOMBRE ──
 * Sería más cómodo escribir `env('CONTACT_TO')`, pero entonces las variables
 * `NEXT_PUBLIC_*` dejarían de funcionar: Next las sustituye en el build
 * buscando el ACCESO LITERAL `process.env.NEXT_PUBLIC_X` en el código. Con una
 * clave dinámica no hay nada que sustituir y en el navegador llegaría
 * `undefined`. Así que el acceso literal se queda donde estaba y aquí solo
 * entra el valor.
 * ════════════════════════════════════════════════════════════════
 */

/**
 * El valor si tiene contenido real; `undefined` si falta o está en blanco.
 *
 *   envOpt(process.env.CONTACT_TO)   // '' -> undefined
 */
export function envOpt(value: string | undefined | null): string | undefined {
  if (typeof value !== 'string') return undefined
  const t = value.trim()
  return t.length > 0 ? t : undefined
}

/**
 * El valor si tiene contenido real; si no, el de reserva.
 *
 *   envOr(process.env.CONTACT_TO, NAP.email)
 */
export function envOr(value: string | undefined | null, fallback: string): string {
  return envOpt(value) ?? fallback
}

/**
 * ¿Está puesta de verdad?
 *
 * `Boolean(process.env.X)` ya daba `false` con la cadena vacía, así que las
 * comprobaciones de configuración del repo no tenían el bug — pero una
 * variable que es solo espacios sí las pasaba. Esto cierra también ese caso.
 */
export function envSet(value: string | undefined | null): boolean {
  return envOpt(value) !== undefined
}
