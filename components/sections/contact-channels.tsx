import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { NAP } from '@/lib/constants'
import {
  calUrl,
  isCalConfigured,
  isWhatsappConfigured,
  whatsappUrl,
} from '@/lib/channels'
import type { Locale } from '@/data/types'

/**
 * ════════════════════════════════════════════════════════════════
 * LOS TRES CANALES — la banda de cierre de cada página
 *
 * Escribir, mandar un WhatsApp o agendar. Tres filas de canal (`.channel`),
 * el mismo vocabulario que la lista de servicios: no son tres botones, son
 * tres plumas del mismo registrador.
 *
 * ── POR QUÉ TRES Y NO UNO ──
 * Porque el momento de decidir no es el mismo para todos. Quien está
 * comparando proveedores escribe; quien ya decidió agenda; quien tiene una
 * duda de treinta segundos manda un WhatsApp. Un solo canal deja fuera a dos
 * de los tres.
 *
 * ── EL MENSAJE PRELLENADO NO ES UN DETALLE ──
 * Cada página pasa el suyo. Alguien que abre WhatsApp con «Hola» escribe
 * «info?»; alguien que lo abre con el servicio ya nombrado manda un mensaje
 * con el que se puede trabajar. Lo mismo el asunto del correo.
 *
 * ── DEGRADA SOLO ──
 * Si un canal no está configurado, NO se pinta. Un botón que lleva a un 404
 * es peor que un botón que no está. Ver lib/channels.ts.
 * ════════════════════════════════════════════════════════════════
 */

export async function ContactChannels({
  locale,
  /** El texto con el que se abre WhatsApp. Lo pone cada página. */
  waMessage,
  /** Título de la banda. Si no se pasa, el genérico. */
  title,
  /** Una línea de contexto encima del título. */
  eyebrow,
}: {
  locale: Locale
  waMessage: string
  title?: string
  eyebrow?: string
}) {
  const t = await getTranslations('canales')
  const en = locale === 'en'
  const cal = calUrl()

  return (
    <div className="reveal-stagger">
      <p className="stamp">{eyebrow ?? t('eyebrow')}</p>
      <h2 className="mt-5 max-w-[20ch] text-d1 text-ink">
        {title ?? t('title')}
      </h2>

      <ul className="mt-12 max-w-[54rem]">
        {/* ── 1. Escribir ── */}
        <li>
          <Link href="/contacto" className="channel group" data-ch="a">
            <span className="channel-id">ch a</span>
            <span>
              <span className="text-d3">{t('formTitle')}</span>
              <span className="channel-note mt-1 block text-sm">
                {t('formNote')}
              </span>
              <span className="channel-pen mt-3" aria-hidden="true" />
            </span>
            <span
              aria-hidden="true"
              className="transition-transform duration-150 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </li>

        {/* ── 2. WhatsApp ── */}
        {isWhatsappConfigured() ? (
          <li>
            <a
              href={whatsappUrl(waMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="channel group"
              data-ch="b"
            >
              <span className="channel-id">ch b</span>
              <span>
                <span className="text-d3">{t('waTitle')}</span>
                <span className="channel-note mt-1 block text-sm">
                  {t('waNote')}
                </span>
                <span className="channel-pen mt-3" aria-hidden="true" />
              </span>
              <span
                aria-hidden="true"
                className="transition-transform duration-150 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </li>
        ) : null}

        {/* ── 3. Agendar ──
            Solo si hay calendario. Sin `NEXT_PUBLIC_CAL_LINK` esta fila no
            existe, en vez de llevar a un cal.com/undefined. */}
        {isCalConfigured() && cal ? (
          <li>
            <a
              href={cal}
              target="_blank"
              rel="noopener noreferrer"
              className="channel group"
              data-ch="c"
            >
              <span className="channel-id">ch c</span>
              <span>
                <span className="text-d3">{t('calTitle')}</span>
                <span className="channel-note mt-1 block text-sm">
                  {t('calNote')}
                </span>
                <span className="channel-pen mt-3" aria-hidden="true" />
              </span>
              <span
                aria-hidden="true"
                className="transition-transform duration-150 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </li>
        ) : null}
      </ul>

      {/* El correo directo, siempre, y sin fila propia: es el canal que no
          depende de que nada esté configurado. */}
      <p className="stamp mt-8">
        {en ? 'or write to ' : 'o escríbeme a '}
        <a className="link-stylus" href={`mailto:${NAP.email}`}>
          {NAP.email}
        </a>
        {' · '}
        <span className="tabular-nums">{NAP.phoneDisplay}</span>
      </p>
    </div>
  )
}
