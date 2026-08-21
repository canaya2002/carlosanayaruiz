'use client'

import { useActionState } from 'react'
import { enviarMensaje, type EnvioEstado } from '@/app/[locale]/lead-action'

/**
 * ════════════════════════════════════════════════════════════════
 * EL FORMULARIO — cinco renglones, ninguna caja
 *
 * Sustituye al compositor de `mailto:` que había: aquel abría la aplicación
 * de correo del visitante, y quien no la tiene configurada —la mayoría en
 * móvil, con webmail— se quedaba sin poder enviar. Este recibe de verdad.
 *
 * ── LA FORMA ──
 * Cada campo es un RENGLÓN con su rótulo mono encima y su regla debajo, como
 * la casilla de un formulario impreso. No hay un solo borde de cuatro lados,
 * que es la regla del sistema, y el foco lo marca la regla al encenderse.
 *
 * ── POR QUÉ LOS CAMPOS SON ESTOS ──
 * El formulario existe para ESTRUCTURAR el mensaje. Alguien que ve un campo
 * «la URL» y otro «qué está pasando y desde cuándo» escribe un correo con el
 * que se puede trabajar; un `mailto:` a secas produce «hola, info?». El
 * campo del sitio es opcional pero es el más útil de los cinco.
 *
 * ── SIN CONFIGURAR NO MIENTE ──
 * Si falta la clave de Resend, el formulario NO dice «enviado»: dice que la
 * recepción no está conectada y ofrece los otros dos canales, que no
 * dependen de nada. Un formulario que finge en producción durante seis meses
 * es peor que no tenerlo.
 *
 * ── EL RUNTIME ──
 * Es un componente de cliente por el mismo motivo que el boletín: el
 * resultado tiene que aparecer donde se escribió, sin recargar y sin sacar a
 * nadie de la página. El runtime de React ya viaja porque el nav es de
 * cliente, así que esto añade el código del componente, no un runtime. Los
 * textos entran por props ya traducidos.
 * ════════════════════════════════════════════════════════════════
 */

export interface LeadCopy {
  nombre: string
  email: string
  asunto: string
  asuntoHint: string
  sitio: string
  sitioHint: string
  mensaje: string
  mensajeHint: string
  submit: string
  enviando: string
  nota: string
  ok: string
  invalido: string
  sinConfigurar: string
  error: string
}

export function LeadForm({
  copy,
  locale,
  origen,
  asuntos,
}: {
  copy: LeadCopy
  locale: string
  /** De qué página salió. Va en el asunto del correo. */
  origen: string
  /** Las opciones del selector. La primera es la que queda elegida. */
  asuntos: readonly string[]
}) {
  const [estado, action, enviando] = useActionState<EnvioEstado, FormData>(
    enviarMensaje,
    null
  )

  const mensaje = estado
    ? {
        ok: copy.ok,
        'datos-invalidos': copy.invalido,
        'sin-configurar': copy.sinConfigurar,
        /* Un bot recibe el mismo texto que un envío correcto: uno que recibe
           un error reintenta, uno que recibe un éxito se va. */
        rechazado: copy.ok,
        error: copy.error,
      }[estado]
    : null

  const listo = estado === 'ok' || estado === 'rechazado'
  const paso = listo

  return (
    <form action={action} className="max-w-[38rem]">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="origen" value={origen} />

      <label className="field-row">
        <span className="field-label">{copy.nombre}</span>
        <input
          type="text"
          name="nombre"
          required
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
        <span className="field-label">
          {copy.asunto}
          <span className="field-hint">{copy.asuntoHint}</span>
        </span>
        {/* Un `<select>` nativo y no un desplegable propio: el del sistema
            operativo ya sabe funcionar con teclado, con lector de pantalla y
            con el pulgar en un móvil. Reimplementarlo es empeorarlo. */}
        <select name="asunto" className="field-input" disabled={listo}>
          {asuntos.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </label>

      <label className="field-row">
        <span className="field-label">
          {copy.sitio}
          <span className="field-hint">{copy.sitioHint}</span>
        </span>
        <input
          type="url"
          name="sitio"
          maxLength={300}
          inputMode="url"
          placeholder="https://"
          className="field-input"
          disabled={listo}
        />
      </label>

      <label className="field-row">
        <span className="field-label">
          {copy.mensaje}
          <span className="field-hint">{copy.mensajeHint}</span>
        </span>
        <textarea
          name="mensaje"
          required
          rows={5}
          maxLength={4000}
          className="field-input field-area"
          disabled={listo}
        />
      </label>

      {/* El cebo. `aria-hidden` + `tabIndex={-1}` lo saca del lector de
          pantalla y del tabulado; `.sr-only` no serviría porque eso SÍ lo lee
          un lector de pantalla. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="lead-organizacion">Organización</label>
        <input
          id="lead-organizacion"
          name="organizacion"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="mt-9 flex flex-wrap items-baseline gap-x-8 gap-y-4">
        {!listo ? (
          <button type="submit" className="field-send" disabled={enviando}>
            {enviando ? copy.enviando : `${copy.submit} →`}
          </button>
        ) : null}

        {/* `aria-live` porque la página no recarga: sin esto un lector de
            pantalla no anunciaría el resultado. */}
        <p
          className="field-note max-w-[46ch]"
          data-state={estado ? (paso ? 'pass' : 'fail') : undefined}
          role="status"
          aria-live="polite"
        >
          {mensaje ?? copy.nota}
        </p>
      </div>
    </form>
  )
}
