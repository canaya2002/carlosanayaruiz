'use client'

import { useActionState, useEffect, useRef } from 'react'
import { Link, useRouter } from '@/i18n/navigation'
import {
  solicitarRevision,
  type ReviewEstado,
} from '@/app/[locale]/review-action'
import type { ReviewCopy } from '@/data/revision-ficha'

/**
 * ════════════════════════════════════════════════════════════════
 * EL FORMULARIO DE LA REVISIÓN DE FICHA
 *
 * Hermano de `<LeadForm>` y no una variante suya, a propósito: los campos
 * son otros —negocio, ciudad, la ficha, una casilla obligatoria— y meterlos
 * como props opcionales habría convertido el formulario de /contacto en uno
 * con siete modos. Comparte con él la forma (los mismos renglones `.field-*`),
 * el cebo y el canal de entrega: `review-action.ts` termina en `sendLead`.
 *
 * Al entregarse, manda a la página de gracias. Es una ruta propia y no un
 * acuse en el mismo sitio porque es la conversión que se mide: una URL que
 * solo existe después de un envío correcto.
 *
 * El acuse NO lleva el nombre ni el negocio de quien escribió. Para pasarlos
 * a la otra página habría que ponerlos en la URL —llegarían a los registros
 * del servidor— o guardarlos en `sessionStorage`, y el aviso de privacidad
 * afirma que el sitio no escribe ahí. Un saludo por nombre no vale una
 * afirmación falsa en el aviso.
 * ════════════════════════════════════════════════════════════════
 */

export function ReviewForm({
  copy,
  locale,
  gracias,
  boletin,
}: {
  copy: ReviewCopy['form'] & { closed: string }
  locale: string
  /** Ruta interna de la página de gracias. */
  gracias: '/revision-ficha-google/gracias'
  /** Si la lista está conectada. Sin ella la casilla no existe. */
  boletin: boolean
}) {
  const router = useRouter()
  const montado = useRef(0)

  useEffect(() => {
    montado.current = Date.now()
  }, [])

  const [estado, action, enviando] = useActionState<ReviewEstado, FormData>(
    (previo, formData) => {
      if (montado.current) {
        formData.set('ms', String(Date.now() - montado.current))
      }
      return solicitarRevision(previo, formData)
    },
    null
  )

  const listo = estado === 'ok' || estado === 'rechazado'

  useEffect(() => {
    if (listo) router.push(gracias)
  }, [listo, router, gracias])

  const mensaje = estado
    ? {
        ok: null,
        rechazado: null,
        cerrado: copy.closed,
        'datos-invalidos': copy.invalido,
        'sin-configurar': copy.sinConfigurar,
        error: copy.error,
      }[estado]
    : null

  const opcional = <span className="field-hint">{copy.optional}</span>

  return (
    <form action={action} className="max-w-[38rem]">
      <input type="hidden" name="locale" value={locale} />

      <label className="field-row">
        <span className="field-label">{copy.nombre}</span>
        <input
          type="text"
          name="nombre"
          required
          minLength={2}
          maxLength={90}
          autoComplete="name"
          className="field-input"
          disabled={listo}
        />
      </label>

      <label className="field-row">
        <span className="field-label">{copy.email}</span>
        <input
          type="email"
          name="email"
          required
          maxLength={254}
          autoComplete="email"
          inputMode="email"
          className="field-input"
          disabled={listo}
        />
      </label>

      <label className="field-row">
        <span className="field-label">{copy.negocio}</span>
        <input
          type="text"
          name="negocio"
          required
          minLength={2}
          maxLength={140}
          autoComplete="organization"
          className="field-input"
          disabled={listo}
        />
      </label>

      <label className="field-row">
        <span className="field-label">{copy.ciudad}</span>
        <input
          type="text"
          name="ciudad"
          required
          minLength={2}
          maxLength={90}
          autoComplete="address-level2"
          className="field-input"
          disabled={listo}
        />
      </label>

      <label className="field-row">
        <span className="field-label">
          {copy.maps}
          <span className="field-hint">{copy.mapsHint}</span>
        </span>
        <input
          type="url"
          name="maps"
          maxLength={300}
          inputMode="url"
          placeholder="https://"
          className="field-input"
          disabled={listo}
        />
      </label>

      <label className="field-row">
        <span className="field-label">
          {copy.web}
          {opcional}
        </span>
        <input
          type="url"
          name="web"
          maxLength={300}
          inputMode="url"
          placeholder="https://"
          className="field-input"
          disabled={listo}
        />
      </label>

      <label className="field-row">
        <span className="field-label">
          {copy.preocupacion}
          <span className="field-hint">
            {copy.optional} · {copy.preocupacionHint}
          </span>
        </span>
        <textarea
          name="preocupacion"
          rows={3}
          maxLength={300}
          className="field-input field-area"
          disabled={listo}
        />
      </label>

      {/* La aceptación va SIN marcar y es obligatoria: el consentimiento es
          un acto, no un valor por omisión. El servidor la vuelve a exigir. */}
      <label className="field-check mt-8">
        <input
          type="checkbox"
          name="consentimiento"
          value="si"
          required
          disabled={listo}
        />
        <span>
          {copy.consentBefore}
          <Link href="/privacidad" className="link-stylus">
            {copy.consentLink}
          </Link>
          {copy.consentAfter}
        </span>
      </label>

      {boletin ? (
        <label className="field-check">
          <input type="checkbox" name="boletin" value="si" disabled={listo} />
          <span>{copy.boletin}</span>
        </label>
      ) : null}

      {/* El cebo, igual que en `<LeadForm>`. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="revision-organizacion">Organización</label>
        <input
          id="revision-organizacion"
          name="organizacion"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="mt-9 flex flex-wrap items-baseline gap-x-8 gap-y-4">
        <button
          type="submit"
          className="field-send min-h-11"
          disabled={enviando || listo}
        >
          {enviando || listo ? copy.enviando : `${copy.submit} →`}
        </button>

        <p
          className="field-note max-w-[46ch]"
          data-state={mensaje ? 'fail' : undefined}
          role="status"
          aria-live="polite"
        >
          {mensaje}
        </p>
      </div>
    </form>
  )
}
