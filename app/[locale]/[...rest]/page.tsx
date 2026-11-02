import { notFound } from 'next/navigation'

/**
 * ════════════════════════════════════════════════════════════════
 * EL CATCH-ALL QUE MANDA LA 404 AL LAYOUT
 *
 * Sin esto, `/es/esta-pagina-no-existe` no casaba ningún segmento bajo
 * `[locale]` y Next servía `app/not-found.tsx`, el raíz: sin header, sin pie
 * y bilingüe. `app/[locale]/not-found.tsx` solo atiende los `notFound()`
 * lanzados DENTRO del segmento, así que hace falta una ruta que case todo lo
 * que sobra y lo lance aquí.
 *
 * Las rutas reales siempre ganan: un catch-all es el último candidato del
 * enrutador. El código de estado sigue siendo 404.
 * ════════════════════════════════════════════════════════════════
 */
export default function CatchAll() {
  notFound()
}
