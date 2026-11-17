import { getLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { isRevisionOpen } from '@/data/revision-ficha'

/**
 * ════════════════════════════════════════════════════════════════
 * LA FRANJA ANTES DEL PIE
 *
 * En móvil el final de las páginas interiores era casi solo pie: columnas de
 * enlaces de texto, el correo y el teléfono, y ningún control con cuerpo. La
 * franja pone las dos acciones del sitio justo antes del colofón.
 *
 * ── SE MONTA POR PÁGINA, NO EN EL LAYOUT ──
 * Un layout de Next no conoce la ruta en el servidor, y adivinarla desde una
 * cabecera o comparando textos es exactamente la lógica frágil que hay que
 * evitar. Así que la lista de rutas ES la lista de páginas que la importan:
 * los cuatro servicios, /servicios, /proyectos y su ficha, /cv, /sobre-mi,
 * /premios, /certificaciones y /libros. NO la llevan, a propósito: la
 * portada y los artículos del blog (tienen su cierre), /contacto (ya es el
 * cierre), /revision-ficha-google (es el destino del secundario), las
 * legales y la 404.
 *
 * ── SOLO COPY QUE YA EXISTE ──
 * El rótulo es el «Contacto» de la columna del pie y los dos botones son los
 * de /sobre-mi. Sin titular, sin cifra y sin promesa nuevos.
 *
 * Misma superficie que `.review-cta`: humo y UNA regla de latón arriba, no un
 * borde de cuatro lados. El secundario se pinta solo con la revisión abierta,
 * igual que la banda del blog: no se anuncia una oferta que ya no recibe.
 * ════════════════════════════════════════════════════════════════
 */
export async function PreFooterCta() {
  const en = (await getLocale()) === 'en'

  return (
    <section
      aria-labelledby="pre-footer-cta"
      className="pre-footer-cta"
      data-print-hide=""
    >
      <div className="sheet py-10 sm:py-16">
        <h2 id="pre-footer-cta" className="stamp">
          {en ? 'Contact' : 'Contacto'}
        </h2>

        <p className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <span>WhatsApp 55 6920 1203</span>
          {isRevisionOpen() && (
            <Link
              className="btn-secondary whitespace-normal"
              href="/revision-ficha-google"
            >
              {en
                ? 'Free review of your Google Business Profile'
                : 'Pide una revisión gratis de tu ficha'}
            </Link>
          )}
        </p>
      </div>
    </section>
  )
}
