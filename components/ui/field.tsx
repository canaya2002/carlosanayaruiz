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
 *
 * NADA de lo anterior se toca al cambiar estilos. Es el contrato del componente.
 *
 * ── LO ÚNICO QUE SE AÑADIÓ: EL FOCO SE PROPAGA A LA ETIQUETA ──
 * El grupo con nombre `group/field` más `group-has-[:focus]/field` hacen que la
 * etiqueta pase a color de marca cuando el control que está debajo tiene el
 * foco. Es CSS `:has()`, cero JS, y no cambia una sola línea del árbol de
 * accesibilidad: el `for`/`id`, el `aria-describedby` y el `aria-invalid` son
 * los mismos. Un navegador sin `:has()` simplemente no lo pinta.
 *
 * Se engancha a `:focus` y no a `:focus-visible` a propósito: aquí el objetivo
 * no es señalar la navegación por teclado —de eso se encarga el anillo de
 * globals.css— sino decir "estás escribiendo en este campo", que también aplica
 * cuando entraste con el mouse.
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
    <div data-slot="field" className={cn('group/field', className)}>
      <label
        htmlFor={id}
        className={cn(
          'flex items-baseline gap-1 text-sm font-semibold text-ink',
          'transition-colors duration-200 ease-out-soft',
          'group-has-[:focus]/field:text-brand-strong'
        )}
      >
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
