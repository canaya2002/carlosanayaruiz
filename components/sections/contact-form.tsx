'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Check, Copy, Mail, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field } from '@/components/ui/field'
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
    <div className="card grad-border p-6 sm:p-8">
      <h2 className="text-d3 text-ink">{t('form')}</h2>

      {/* Lo que va a pasar, dicho antes de hacer clic. */}
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">
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
            <label htmlFor="consent" className="text-sm leading-relaxed text-ink-muted">
              {t('consent')}{' '}
              <Link
                href="/privacidad"
                className="text-brand-strong underline underline-offset-4"
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

        <Button type="submit" size="lg" className="sheen w-full sm:w-auto">
          <Send className="size-4" aria-hidden="true" />
          {t('send')}
        </Button>
      </form>

      {/* Salida alterna para quien no tiene cliente de correo configurado. */}
      <div className="mt-8 border-t border-hairline pt-6">
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
          <a
            href={`mailto:${NAP.email}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-strong underline underline-offset-4"
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
    </div>
  )
}
