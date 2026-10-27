import { timingSafeEqual } from 'node:crypto'

/**
 * Compara un secreto recibido con el esperado en tiempo constante.
 *
 * `!==` corta en el primer carácter distinto, así que lo que tarda en
 * responder dice cuántos caracteres del principio acertó quien llama.
 * `timingSafeEqual` recorre el búfer entero siempre. Lanza si los dos
 * búferes miden distinto, de ahí la comprobación previa: la longitud sí
 * se filtra, y eso es aceptable — no dice nada del contenido.
 *
 * `null` (la cabecera no vino) nunca coincide.
 */
export function secretMatches(
  received: string | null,
  expected: string
): boolean {
  if (received === null) return false
  const a = Buffer.from(received, 'utf8')
  const b = Buffer.from(expected, 'utf8')
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}
