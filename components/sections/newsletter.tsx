'use client'

import { useActionState } from 'react'
import { altaBoletin, type AltaEstado } from '@/app/[locale]/newsletter-action'

/**
 * ════════════════════════════════════════════════════════════════
 * EL BOLETÍN — la lista, preparada antes de que existan los blogs
 *
 * Se monta ahora a propósito: una lista que empieza a llenarse antes de que
 * haya contenido vale más que un formulario impecable el día del
 * lanzamiento.
 *
 * ── POR QUÉ ES UN COMPONENTE DE CLIENTE, EN UN SITIO SIN LIBRERÍAS ──
 * Porque el resultado tiene que aparecer DONDE se escribió el correo, y en
 * el pie eso no se puede hacer desde el servidor: un layout de Next no
 * recibe `searchParams`, así que el pie no puede leer un `?boletin=ok` que
 * la acción hubiera puesto en la URL. Las alternativas eran una ruta de
 * acuse (te saca de la página) o el estado en la portada (solo funciona
 * ahí).
 *
 * Y el coste real es casi nulo: el runtime de React YA viaja en el bundle
 * porque el nav es un componente de cliente. Esto añade el código de este
 * componente, no un runtime.
 *
 * Los textos entran por props, ya traducidos. Es lo que evita arrastrar el
 * diccionario de `next-intl` al cliente por trece cadenas.
 *
 * ── LO QUE NO CUBRE, Y SE DICE ──
 * Sin JavaScript el formulario POSTea igual —una Server Action degrada a un
 * envío normal— pero el estado que devuelve se pierde, así que no hay acuse.
 * El alta SÍ se procesa. Es la misma dependencia que ya tiene el menú móvil,
 * y se prefiere a sacar a la gente de la página que estaba leyendo.
 * ════════════════════════════════════════════════════════════════
 */

export interface NewsletterCopy {
  eyebrow: string
  title: string
  lead: string
  label: string
  placeholder: string
  submit: string
  consent: string
  ok: string
  yaEstaba: string
  invalido: string
  sinConfigurar: string
  error: string
}

export function Newsletter({
  copy,
  locale,
  privacyHref,
  privacyLabel,
}: {
  copy: NewsletterCopy
  locale: string
  privacyHref: string
  privacyLabel: string
}) {
  const [estado, action, enviando] = useActionState<AltaEstado, FormData>(
    altaBoletin,
    null
  )

  const mensaje = estado
    ? {
        ok: copy.ok,
        'ya-estaba': copy.yaEstaba,
        'correo-invalido': copy.invalido,
        'sin-configurar': copy.sinConfigurar,
        error: copy.error,
      }[estado]
    : null

  /* Verde solo cuando de verdad quedó — y `ya-estaba` también es un final
     feliz. Lo demás va en minio, que en este sistema es el color de algo que
     no pasó un umbral; aquí el umbral es «quedaste en la lista». Los dos
     colores siguen siendo semánticos: hay un resultado real detrás. */
  const paso = estado === 'ok' || estado === 'ya-estaba'
  const listo = estado === 'ok' || estado === 'ya-estaba'

  return (
    <div className="reveal-stagger">
      <p className="stamp">{copy.eyebrow}</p>

      <h2 className="mt-5 max-w-[22ch] text-d2 text-ink">{copy.title}</h2>

      <p className="mt-5 max-w-[58ch] text-sm leading-relaxed text-ink-muted">
        {copy.lead}
      </p>

      {/* La fila es un RENGLÓN, no una caja: regla abajo, el campo encima y
          el botón al final de la misma línea de escritura — como la casilla
          de un formulario impreso, donde lo que te dice dónde escribir es la
          raya y no un rectángulo. */}
      <form action={action} className="mt-8 max-w-[34rem]">
        <input type="hidden" name="locale" value={locale} />

        <label className="field-line">
          <span className="sr-only">{copy.label}</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder={copy.placeholder}
            className="field-input"
            disabled={listo}
          />
          <button type="submit" className="field-send" disabled={enviando || listo}>
            {enviando ? '···' : `${copy.submit} →`}
          </button>
        </label>

        {/* El cebo. `aria-hidden` + `tabIndex={-1}` lo saca del lector de
            pantalla y del tabulado; `.sr-only` no serviría, porque eso SÍ lo
            lee un lector de pantalla. */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="organizacion">Organización</label>
          <input
            id="organizacion"
            name="organizacion"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* `aria-live` porque la página no recarga: sin esto, un lector de
            pantalla no anunciaría el resultado. */}
        <p
          className="field-note mt-4"
          data-state={estado ? (paso ? 'pass' : 'fail') : undefined}
          role="status"
          aria-live="polite"
        >
          {mensaje ?? copy.consent}
        </p>

        {!listo ? (
          <p className="mt-3">
            <a className="link-stylus text-sm" href={privacyHref}>
              {privacyLabel} →
            </a>
          </p>
        ) : null}
      </form>
    </div>
  )
}
