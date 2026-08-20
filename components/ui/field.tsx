import * as React from 'react'
import { cn } from '@/lib/utils'

/** El subconjunto de props del control que Field conecta en su hijo. */
type FieldControlProps = {
  id?: string
  'aria-describedby'?: string
  'aria-invalid'?: boolean | 'true' | 'false'
  'aria-required'?: boolean | 'true' | 'false'
}

export interface FieldProps {
  /** También es el id del control y el destino del <label for>. Debe ser único. */
  id: string
  label: React.ReactNode
  /** El control. Si es un solo elemento, recibe id y aria-* automáticamente. */
  children: React.ReactNode
  required?: boolean
  /** Mensaje de validación. Si está presente, el control se marca aria-invalid. */
  error?: React.ReactNode
  /** Texto de ayuda bajo la etiqueta, referenciado por aria-describedby. */
  hint?: React.ReactNode
  /**
   * Texto para lector de pantalla del marcador de requerido. Pasa una cadena
   * traducida — "obligatorio" / "required".
   */
  requiredLabel?: string
  className?: string
}

/**
 * Field — el envoltorio accesible por el que pasa todo control de formulario.
 *
 * Lo que garantiza:
 * - un <label for> real, así el placeholder nunca es la única etiqueta;
 * - `aria-describedby` apuntando al hint y al error, fusionado con lo que el
 *   hijo ya declarara;
 * - `aria-invalid` + borde rojo en el control cuando hay `error`;
 * - el nodo de error es una región `aria-live="polite"` persistente, para que un
 *   mensaje que aparece después de enviar sí se anuncie (una región montada en
 *   el mismo momento en que llega su texto muchas veces no se anuncia);
 * - un marcador de requerido que es un glifo más texto para lector de pantalla,
 *   nunca color solo.
 */
export function Field({
  id,
  label,
  children,
  required = false,
  error,
  hint,
  requiredLabel = 'required',
  className,
}: FieldProps) {
  const hintId = `${id}-hint`
  const errorId = `${id}-error`

  const described = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ')

  const control = React.isValidElement<FieldControlProps>(children)
    ? React.cloneElement(children, {
        id: children.props.id ?? id,
        'aria-describedby':
          [children.props['aria-describedby'], described].filter(Boolean).join(' ') || undefined,
        'aria-invalid': error ? true : children.props['aria-invalid'],
        'aria-required': required ? true : children.props['aria-required'],
      })
    : children

  return (
    <div data-slot="field" className={className}>
      <label htmlFor={id} className="flex items-baseline gap-1 text-sm font-semibold text-ink">
        <span>{label}</span>
        {required ? (
          <>
            <span aria-hidden="true" className="text-ink-subtle">
              *
            </span>
            <span className="sr-only">({requiredLabel})</span>
          </>
        ) : null}
      </label>

      {hint ? (
        <p id={hintId} className="mt-1 text-sm text-ink-subtle">
          {hint}
        </p>
      ) : null}

      {/* Apuntar por data-slot cubre los controles envueltos, donde clonar el
          hijo habría puesto aria-invalid en el envoltorio y no en el input. */}
      <div
        className={cn(
          'mt-2',
          error && '[&_[data-slot=input]]:border-danger [&_[data-slot=textarea]]:border-danger'
        )}
      >
        {control}
      </div>

      {/* Siempre se renderiza. Vacío => altura cero, sin margen, nada anunciado. */}
      <p
        id={errorId}
        aria-live="polite"
        className="mt-1.5 text-sm font-semibold text-danger empty:mt-0"
      >
        {error}
      </p>
    </div>
  )
}
