'use server'

import { sendLead, type LeadResult } from '@/lib/contact'

/**
 * ════════════════════════════════════════════════════════════════
 * EL ENVÍO DEL FORMULARIO — Server Action
 *
 * Vive en su propio archivo con `'use server'` arriba porque la consume un
 * componente de CLIENTE: una acción declarada dentro de un componente de
 * servidor no se puede importar desde el cliente.
 *
 * Toda la validación es de SERVIDOR. Los `required` y los `maxLength` del
 * formulario son una cortesía para quien escribe, no una defensa: cualquiera
 * puede mandar el POST a mano.
 * ════════════════════════════════════════════════════════════════
 */

export type EnvioEstado = LeadResult | null

export async function enviarMensaje(
  _previo: EnvioEstado,
  formData: FormData
): Promise<EnvioEstado> {
  return sendLead(
    {
      nombre: String(formData.get('nombre') ?? ''),
      email: String(formData.get('email') ?? ''),
      asunto: String(formData.get('asunto') ?? ''),
      sitio: String(formData.get('sitio') ?? ''),
      mensaje: String(formData.get('mensaje') ?? ''),
      origen: String(formData.get('origen') ?? ''),
      locale: String(formData.get('locale') ?? 'es'),
    },
    String(formData.get('organizacion') ?? '')
  )
}
