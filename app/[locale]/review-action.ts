'use server'

import { after } from 'next/server'
import { sendLead, type LeadResult } from '@/lib/contact'
import { isNewsletterConfigured, subscribe } from '@/lib/newsletter'
import { isRevisionOpen } from '@/data/revision-ficha'

/**
 * ════════════════════════════════════════════════════════════════
 * LA SOLICITUD DE REVISIÓN DE FICHA — Server Action
 *
 * No es un canal nuevo: arma un `Lead` y lo entrega por `sendLead`, el mismo
 * camino que /contacto (Resend con `reply_to`, y el puente al sistema de
 * gestión). Así el correo llega a la misma bandeja, con el mismo formato y
 * con `origen` diciendo de dónde salió, y el aviso de privacidad describe un
 * solo flujo de datos y no dos.
 *
 * Lo que añade sobre /contacto, y por qué:
 *
 *   · LA VIGENCIA. Después del 30/11/2026 responde `cerrado` aunque alguien
 *     mande el POST a mano: la página cerrada no basta.
 *   · LA CASILLA DE ACEPTACIÓN. Este formulario la lleva sin marcar y es
 *     obligatoria, así que el servidor la comprueba: un `required` de HTML es
 *     cortesía, no defensa.
 *   · EL TIEMPO MÍNIMO. Un humano no llena seis campos en menos de tres
 *     segundos. La duración la mide el cliente desde que el formulario se
 *     monta; si no llega —sin JavaScript— no se rechaza, porque castigar a
 *     quien navega sin JS no es una defensa contra bots.
 *   · LOS ENLACES se validan como URL http(s) de verdad.
 *
 * El boletín es una casilla APARTE y opcional, y solo se da de alta si la
 * solicitud se entregó: no hay alta en la lista por una solicitud perdida.
 * ════════════════════════════════════════════════════════════════
 */

export type ReviewEstado = LeadResult | 'cerrado' | null

const ASUNTO = 'Revisión de ficha de Google'
const MIN_MS = 3000

function texto(v: FormDataEntryValue | null, max: number): string {
  return String(v ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
}

/** `''` es válido (campo opcional); cualquier otra cosa tiene que ser http(s). */
function urlValida(v: string): boolean {
  if (!v) return true
  try {
    const u = new URL(v)
    return u.protocol === 'https:' || u.protocol === 'http:'
  } catch {
    return false
  }
}

export async function solicitarRevision(
  _previo: ReviewEstado,
  formData: FormData
): Promise<ReviewEstado> {
  if (!isRevisionOpen()) return 'cerrado'

  const cebo = String(formData.get('organizacion') ?? '')
  const ms = Number(formData.get('ms') ?? NaN)
  /* Un bot recibe el mismo resultado que un envío correcto: ver lib/contact. */
  if (Number.isFinite(ms) && ms < MIN_MS) return 'rechazado'

  const nombre = texto(formData.get('nombre'), 90)
  const email = texto(formData.get('email'), 254)
  const negocio = texto(formData.get('negocio'), 140)
  const ciudad = texto(formData.get('ciudad'), 90)
  const maps = texto(formData.get('maps'), 300)
  const web = texto(formData.get('web'), 300)
  const preocupacion = String(formData.get('preocupacion') ?? '')
    .trim()
    .slice(0, 300)
  const locale = formData.get('locale') === 'en' ? 'en' : 'es'

  if (formData.get('consentimiento') !== 'si') return 'datos-invalidos'
  if (negocio.length < 2 || ciudad.length < 2) return 'datos-invalidos'
  if (!urlValida(maps) || !urlValida(web)) return 'datos-invalidos'

  /* El cuerpo del correo. Cada dato en su renglón: es lo que se va a leer
     para hacer la revisión, así que va en el orden en que se usa. */
  const mensaje = [
    `Negocio: ${negocio}`,
    `Ciudad: ${ciudad}`,
    `Ficha de Google Maps: ${maps || '— (buscarla)'}`,
    `Página web: ${web || '—'}`,
    `Lo que le preocupa: ${preocupacion || '—'}`,
    `Boletín: ${formData.get('boletin') === 'si' ? 'sí' : 'no'}`,
  ].join('\n')

  const resultado = await sendLead(
    {
      nombre,
      email,
      asunto: ASUNTO,
      sitio: web || undefined,
      mensaje,
      origen: ASUNTO,
      locale,
    },
    cebo
  )

  if (
    resultado === 'ok' &&
    formData.get('boletin') === 'si' &&
    isNewsletterConfigured()
  ) {
    try {
      after(() => subscribe(email, locale).then(() => undefined))
    } catch {
      await subscribe(email, locale)
    }
  }

  return resultado
}
