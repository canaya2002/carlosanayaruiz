import { Link } from '@/i18n/navigation'
import { isRevisionOpen, REVISION_VIGENCIA } from '@/data/revision-ficha'

/**
 * ════════════════════════════════════════════════════════════════
 * LA REVISIÓN GRATIS, EN EL ÍNDICE DEL BLOG
 *
 * /es/blog no enlazaba a /revision-ficha-google en ninguna parte: el único
 * CTA era «Contrátame» del nav. Los artículos ya la llevan al cierre; el
 * índice es la otra puerta de entrada del blog y se quedaba sin ella.
 *
 * ── UNA BANDA, NO UNA TARJETA ──
 * Superficie de humo —el único escalón de superficie del sistema— con UNA
 * regla de latón arriba, no un borde de cuatro lados: en este sitio no queda
 * ninguna caja. El latón de la regla es el mismo del botón, así que la banda
 * entera se lee como el lugar donde se pulsa.
 *
 * ── SE PINTA SOLO CON LA OFERTA ABIERTA ──
 * Misma comprobación que la página de destino y la Server Action. El índice
 * se regenera cada 15 minutos, así que al cerrar la vigencia la banda se va
 * sola en vez de anunciar una oferta que ya no recibe solicitudes. La fecha
 * se deriva de `REVISION_VIGENCIA`, igual que en la página: no se escribe a
 * mano y no puede desmentirla.
 *
 * `id` es obligatorio porque el índice la monta hasta dos veces y el
 * `aria-labelledby` de cada una tiene que apuntar a SU titular.
 *
 * Solo español: /en no tiene página de revisión y el blog es monolingüe.
 * ════════════════════════════════════════════════════════════════
 */
export function ReviewCta({ id }: { id: string }) {
  if (!isRevisionOpen()) return null

  const [vy, vm, vd] = REVISION_VIGENCIA.split('-')

  return (
    <section aria-labelledby={id} className="review-cta px-5 py-10 sm:px-10">
      <div className="flex max-w-[62rem] flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
        <div className="min-w-0">
          <p className="stamp">revisión gratis</p>
          <h2 id={id} className="mt-3 max-w-[26ch] text-d3 text-ink">
            ¿Tu negocio aparece bien en Google?
          </h2>
          <p className="mt-3 max-w-[52ch] text-ink-muted">
            Te reviso gratis tu ficha de Google y te digo qué corregir.
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:items-end">
          <Link
            className="btn-primary w-full sm:w-auto"
            href="/revision-ficha-google"
          >
            Pide tu revisión gratis
            <span className="btn-arrow" aria-hidden="true">
              →
            </span>
          </Link>
          <p className="font-mono text-[0.75rem] tracking-[0.08em] text-ink-muted tabular-nums">
            Vigencia <span className="text-ink">{`${vd}/${vm}/${vy}`}</span>
          </p>
        </div>
      </div>
    </section>
  )
}
