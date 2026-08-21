'use server'

import { subscribe, type NewsletterResult } from '@/lib/newsletter'

/**
 * ════════════════════════════════════════════════════════════════
 * EL ALTA AL BOLETÍN — Server Action
 *
 * Vive en su propio archivo con `'use server'` arriba porque la consume un
 * componente de CLIENTE: una acción declarada dentro de un componente de
 * servidor no se puede importar desde el cliente.
 *
 * ── EL CEBO ──
 * Un campo `organizacion` escondido para personas y visible para un bot. Si
 * viene lleno se descarta el alta y se responde `ok` a propósito: un bot que
 * recibe un error reintenta, uno que recibe un éxito se va. Sin captcha, sin
 * un tercero y sin una cookie.
 * ════════════════════════════════════════════════════════════════
 */

export type AltaEstado = NewsletterResult | null

export async function altaBoletin(
  _previo: AltaEstado,
  formData: FormData
): Promise<AltaEstado> {
  if (String(formData.get('organizacion') ?? '').length > 0) return 'ok'

  const email = String(formData.get('email') ?? '')
  const locale = String(formData.get('locale') ?? 'es')
  return subscribe(email, locale)
}
