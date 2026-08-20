'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Check, Copy, Mail, MailOpen, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field } from '@/components/ui/field'
import { GlassPanel } from '@/components/ui/glass-panel'
import { NAP } from '@/lib/constants'

/**
 * ════════════════════════════════════════════════════════════════
 * Formulario de contacto sin backend.
 *
 * El sitio ya no tiene base de datos. Antes esto escribía directo a Firestore;
 * Firebase se eliminó por completo, así que el formulario compone un enlace
 * `mailto:` y abre la aplicación de correo del visitante con todo escrito.
 *
 * Por qué así y no de otra forma:
 *
 * - Un formulario que finge enviar y no envía es peor que no tener formulario.
 *   Aquí lo que pasa está dicho en pantalla antes de hacer clic.
 * - El formulario sigue existiendo porque estructura el mensaje: alguien que
 *   ve los campos "URL del sitio" y "qué está pasando y desde cuándo" escribe
 *   un correo útil. Un `mailto:` a secas produce "hola, info?".
 * - No todos tienen cliente de correo configurado, así que abajo hay una vía
 *   directa que no depende de eso: copiar el correo al portapapeles.
 *
 * Si algún día se quiere recepción real, el cambio es un endpoint (Resend,
 * Formspree, una Route Handler) en `onSubmit` — nada más de este archivo
 * cambia, y el CSP necesitaría ese host concreto en `connect-src`.
 *
 * ── LA CAPA VISUAL, Y LO QUE NO SE NEGOCIA ──
 * El panel es <GlassPanel strong rim>: cristal líquido con el borde recorrido
 * por el gradiente de marca, porque este es el panel protagonista de la página
 * de contacto. Tres decisiones dentro de eso están medidas y no son estéticas:
 *
 *   1. `strong` (74% en vez de 62%) es OBLIGATORIO aquí. <Field> renderiza el
 *      asterisco de "requerido" y su `hint` en `text-ink-subtle`, que sobre el
 *      cristal por defecto mide 4.30:1 y NO pasa; sobre `.glass-strong` mide
 *      4.54 y sí. Quitar `strong` rompe el contraste sin que nada lo anuncie.
 *   2. `rim` sin `strong` volvería a bajar el relleno al 62%: `.glass-rim`
 *      pinta el panel con una `background-image` cuya primera capa fija
 *      `--glass-bg`, y una imagen se dibuja ENCIMA del `background-color`.
 *      <GlassPanel> ya corrige esa combinación por dentro; por eso el panel se
 *      arma con el componente y no con las clases a mano.
 *   3. Los controles y el bloque de respaldo NO son cristal. Cristal sobre
 *      cristal difumina dos veces, cuesta el doble y se ve peor: los inputs son
 *      `bg-surface`, el bloque de abajo es `bg-surface-alt` y el botón
 *      secundario es `variant="outline"`, nunca el variant `glass`.
 * ════════════════════════════════════════════════════════════════
 */

const LIMITS = { name: 80, email: 254, subject: 120, message: 4000 } as const

/** Deliberadamente permisivo: un patrón estricto rechaza correos válidos. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

type FieldName = 'name' | 'email' | 'subject' | 'message'

export function ContactForm() {
  const t = useTranslations('contact')
  const [values, setValues] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({})
  const [consent, setConsent] = useState(false)
  const [consentError, setConsentError] = useState('')
  const [copied, setCopied] = useState(false)

  const set = (field: FieldName) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = () => {
    const next: Partial<Record<FieldName, string>> = {}
    if (!values.name.trim() || values.name.length > LIMITS.name)
      next.name = t('requiredField')
    if (!EMAIL_RE.test(values.email.trim()) || values.email.length > LIMITS.email)
      next.email = t('invalidEmail')
    if (!values.subject.trim() || values.subject.length > LIMITS.subject)
      next.subject = t('requiredField')
    if (!values.message.trim() || values.message.length > LIMITS.message)
      next.message = t('requiredField')
    setErrors(next)
    setConsentError(consent ? '' : t('requiredField'))
    return Object.keys(next).length === 0 && consent
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!validate()) return

    // El cuerpo lleva el nombre y el correo porque el `From:` del cliente de
    // correo puede ser una cuenta distinta a la que el visitante escribió.
    const body = [
      `${t('name')}: ${values.name.trim()}`,
      `${t('email')}: ${values.email.trim()}`,
      '',
      values.message.trim(),
    ].join('\n')

    const url =
      `mailto:${NAP.email}` +
      `?subject=${encodeURIComponent(values.subject.trim())}` +
      `&body=${encodeURIComponent(body)}`

    // `location.href` en lugar de `window.open`: un `mailto:` en una pestaña
    // nueva deja una ventana en blanco abierta en varios navegadores.
    window.location.href = url
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(NAP.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      // Sin permiso de portapapeles el correo sigue visible como texto y como
      // enlace mailto abajo, así que no hay callejón sin salida.
    }
  }

  return (
    <GlassPanel strong rim className="p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-d2 text-ink">{t('form')}</h2>

        {/* El icono anuncia lo mismo que el párrafo de abajo: lo que se abre es
            un correo. Es decorativo (`aria-hidden`) porque el texto ya lo dice;
            si no lo dijera, esto sería información escondida en un dibujo. */}
        <span
          className="grad-deco inline-flex size-11 items-center justify-center rounded-xl text-white shadow-glow-brand"
          aria-hidden="true"
        >
          <MailOpen className="size-5" />
        </span>
      </div>

      {/* ⚠ LO QUE VA A PASAR, DICHO ANTES DEL CLIC. No se quita ni se suaviza:
          es la diferencia entre un formulario honesto y uno que finge enviar.
          `bg-surface-alt` y no otro panel de cristal — ver la nota de arriba. */}
      <p className="mt-4 rounded-xl bg-surface-alt p-4 text-sm leading-relaxed text-ink-muted">
        {t('mailtoNote')}
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="name" label={t('name')} required error={errors.name}>
            <Input
              name="name"
              autoComplete="name"
              maxLength={LIMITS.name}
              placeholder={t('namePh')}
              value={values.name}
              onChange={set('name')}
            />
          </Field>

          <Field id="email" label={t('email')} required error={errors.email}>
            <Input
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              maxLength={LIMITS.email}
              placeholder={t('emailPh')}
              value={values.email}
              onChange={set('email')}
            />
          </Field>
        </div>

        <Field id="subject" label={t('subject')} required error={errors.subject}>
          <Input
            name="subject"
            maxLength={LIMITS.subject}
            placeholder={t('subjectPh')}
            value={values.subject}
            onChange={set('subject')}
          />
        </Field>

        <Field id="message" label={t('message')} required error={errors.message}>
          <Textarea
            name="message"
            rows={6}
            maxLength={LIMITS.message}
            placeholder={t('messagePh')}
            value={values.message}
            onChange={set('message')}
          />
        </Field>

        {/* Consentimiento LFPDPPP. Sigue aquí aunque no haya base de datos:
            el mensaje llega a un buzón y ahí se conserva. */}
        <div>
          <div className="flex items-start gap-3">
            <input
              id="consent"
              type="checkbox"
              checked={consent}
              onChange={(event) => {
                setConsent(event.target.checked)
                if (event.target.checked) setConsentError('')
              }}
              aria-invalid={consentError ? true : undefined}
              aria-describedby={consentError ? 'consent-error' : undefined}
              className="mt-1 size-4 shrink-0 rounded border-control text-brand accent-brand"
            />
            <label
              htmlFor="consent"
              className="text-sm leading-relaxed text-ink-muted"
            >
              {t('consent')}{' '}
              <Link
                href="/privacidad"
                className="font-semibold text-brand-strong underline underline-offset-4"
              >
                {t('consentLink')}
              </Link>
            </label>
          </div>
          <p
            id="consent-error"
            aria-live="polite"
            className="mt-1.5 text-sm font-medium text-danger empty:mt-0"
          >
            {consentError}
          </p>
        </div>

        {/* El botón trae `.press` desde su propia base: baja de escala con
            `--ease-press`, que es casi instantánea a propósito. `.sheen` le
            suma el barrido especular al pasar el mouse. */}
        <Button type="submit" size="lg" className="sheen w-full sm:w-auto">
          <Send className="size-4" aria-hidden="true" />
          {t('send')}
        </Button>
      </form>

      {/* Salida alterna para quien no tiene cliente de correo configurado. Es
          la mitad del contrato del `mailto:`: si el borrador no abre, el correo
          sigue estando a un clic. */}
      <div className="mt-8 rounded-xl bg-surface-alt p-5">
        <p className="text-sm font-semibold text-ink">{t('noMailClient')}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={copyEmail} type="button">
            {copied ? (
              <Check className="size-4 text-positive" aria-hidden="true" />
            ) : (
              <Copy className="size-4" aria-hidden="true" />
            )}
            {copied ? t('copied') : t('copyEmail')}
          </Button>
          {/* `[overflow-wrap:anywhere]` porque un correo es un token sin
              espacios: su `min-content` es su ancho completo, y aquí hay tres
              capas de padding por encima (px-5 del contenedor, p-6 del panel de
              cristal, p-5 de este bloque). A 360px el margen es de unos pocos
              píxeles, y el desbordamiento no se vería como barra de scroll sino
              como contenido recortado en silencio.
              Verifica: npm run check:overflow */}
          <a
            href={`mailto:${NAP.email}`}
            className="press inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-brand-strong underline underline-offset-4 [overflow-wrap:anywhere] hover:bg-surface hover:shadow-lift-1"
          >
            <Mail className="size-4" aria-hidden="true" />
            {NAP.email}
          </a>
        </div>
        {/* El resultado de copiar se anuncia, no solo se ve en el ícono. */}
        <p aria-live="polite" className="sr-only">
          {copied ? t('copied') : ''}
        </p>
      </div>
    </GlassPanel>
  )
}
