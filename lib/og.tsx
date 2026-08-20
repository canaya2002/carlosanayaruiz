import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { PALETTE_HEX } from '@/lib/constants'
import { Locale } from '@/data/types'

/**
 * Generador de tarjetas Open Graph.
 *
 * Cada `opengraph-image.tsx` delega aquí, así el tamaño declarado y los
 * píxeles producidos no pueden discrepar — los archivos estáticos anteriores
 * eran cuadrados de 1000×1000 declarados como 1200×630, y por eso las
 * previsualizaciones de enlaces salían mal en todas partes.
 *
 * Las fuentes están versionadas en assets/fonts en lugar de descargarse de
 * Google en tiempo de build: un fallo de red durante `next build` reventaría
 * el deploy o caería silenciosamente a otra tipografía.
 */
export const OG_SIZE = { width: 1200, height: 630 } as const
export const OG_CONTENT_TYPE = 'image/png'

const FONT_DIR = path.join(process.cwd(), 'assets', 'fonts')

/**
 * Satori no puede leer fuentes variables — busca una instancia estática de
 * peso y lanza excepción — así que estos son cortes estáticos, no las
 * variables que carga el sitio vía next/font.
 */
async function readFonts() {
  const [display, sans, sansSemibold] = await Promise.all([
    readFile(path.join(FONT_DIR, 'Sora-Bold.woff')),
    readFile(path.join(FONT_DIR, 'Jakarta-Regular.woff')),
    readFile(path.join(FONT_DIR, 'Jakarta-SemiBold.woff')),
  ])
  return { display, sans, sansSemibold }
}

let fontCache: Awaited<ReturnType<typeof readFonts>> | null = null

async function loadFonts() {
  if (!fontCache) fontCache = await readFonts()
  return fontCache
}

/**
 * Satori no soporta variables CSS, así que la tarjeta necesita colores
 * literales. Vienen de PALETTE_HEX en lugar de retecleados aquí: este bloque
 * antes tenía su propio hex convertido a mano y ya había derivado un valor
 * visible respecto a los tokens reales, con lo cual toda vista previa social
 * salía fuera de marca.
 */
const C = PALETTE_HEX.light

export interface OgCardProps {
  /** Titular. Se reduce por pasos si es largo para no desbordar. */
  title: string
  /** Etiqueta pequeña sobre el titular. */
  eyebrow?: string
  /** Una línea de apoyo debajo del titular. */
  subtitle?: string
  /** Chips de credenciales al pie. Máximo 3 caben legibles. */
  facts?: string[]
  locale: Locale
}

/** La marca de tres barras, en línea para que la tarjeta no pida imágenes. */
function Mark({ size = 56 }: { size?: number }) {
  const bar = (w: number, color: string, opacity: number) => (
    <div
      style={{
        width: w,
        height: size * 0.085,
        borderRadius: size,
        background: color,
        opacity,
      }}
    />
  )
  return (
    <div
      style={{
        display: 'flex',
        width: size,
        height: size,
        borderRadius: size * 0.28,
        // El gradiente firma. En Satori hay que escribirlo completo: no
        // resuelve `var()`.
        backgroundImage: `linear-gradient(135deg, ${C.brand} 0%, ${C.violet} 55%, ${C.cyan} 100%)`,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: size * 0.215,
        gap: size * 0.115,
      }}
    >
      {bar(size * 0.57, '#ffffff', 1)}
      {bar(size * 0.44, '#ffffff', 0.78)}
      {bar(size * 0.3, '#ffffff', 0.5)}
    </div>
  )
}

export async function renderOgCard({
  title,
  eyebrow,
  subtitle,
  facts = [],
  locale,
}: OgCardProps) {
  const fonts = await loadFonts()

  const titleSize = title.length > 78 ? 58 : title.length > 52 ? 68 : 80

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: C.ground,
          fontFamily: 'Jakarta',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Blobs del gradiente. Radiales con stops suaves en lugar de un
            filtro de desenfoque: Satori no rasteriza `filter: blur()`. */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: -260,
            right: -180,
            width: 760,
            height: 760,
            borderRadius: 760,
            background: `radial-gradient(circle at 50% 50%, ${C.violet}33 0%, ${C.cyan}1f 42%, ${C.ground}00 70%)`,
          }}
        />
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: -320,
            left: -200,
            width: 700,
            height: 700,
            borderRadius: 700,
            background: `radial-gradient(circle at 50% 50%, ${C.brand}2b 0%, ${C.brand}14 45%, ${C.ground}00 72%)`,
          }}
        />

        {/* Barra superior con el gradiente completo */}
        <div
          style={{
            display: 'flex',
            height: 12,
            backgroundImage: `linear-gradient(90deg, ${C.brand} 0%, ${C.violet} 52%, ${C.cyan} 100%)`,
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            padding: '56px 72px 52px',
            justifyContent: 'space-between',
          }}
        >
          {/* Identidad */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <Mark size={54} />
              <div
                style={{
                  display: 'flex',
                  fontFamily: 'Jakarta',
                  fontSize: 27,
                  fontWeight: 600,
                  color: C.ink,
                  letterSpacing: '-0.015em',
                }}
              >
                Carlos Anaya Ruiz
              </div>
            </div>
            <div
              style={{ display: 'flex', fontSize: 19, color: C.inkMuted }}
            >
              carlosanayaruiz.com
            </div>
          </div>

          {/* Titular */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {eyebrow && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 11,
                  marginBottom: 22,
                  alignSelf: 'flex-start',
                  padding: '9px 18px 9px 14px',
                  borderRadius: 999,
                  background: C.brandWash,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    width: 9,
                    height: 9,
                    borderRadius: 9,
                    backgroundImage: `linear-gradient(135deg, ${C.brand}, ${C.violet})`,
                  }}
                />
                <div
                  style={{
                    display: 'flex',
                    fontSize: 18,
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: C.brandStrong,
                  }}
                >
                  {eyebrow}
                </div>
              </div>
            )}

            <div
              style={{
                display: 'flex',
                fontFamily: 'Sora',
                fontWeight: 700,
                fontSize: titleSize,
                lineHeight: 1.05,
                letterSpacing: '-0.035em',
                color: C.ink,
                maxWidth: 980,
              }}
            >
              {title}
            </div>

            {subtitle && (
              <div
                style={{
                  display: 'flex',
                  marginTop: 22,
                  fontSize: 25,
                  lineHeight: 1.42,
                  color: C.inkMuted,
                  maxWidth: 860,
                }}
              >
                {subtitle}
              </div>
            )}
          </div>

          {/* Credenciales */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {facts.slice(0, 3).map((fact) => (
              <div
                key={fact}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '11px 21px',
                  borderRadius: 999,
                  background: C.surface,
                  border: `1px solid ${C.hairline}`,
                  fontSize: 21,
                  fontWeight: 600,
                  color: C.ink,
                }}
              >
                {fact}
              </div>
            ))}
            <div
              style={{
                display: 'flex',
                marginLeft: 'auto',
                fontSize: 19,
                color: C.inkMuted,
              }}
            >
              {locale === 'en' ? 'Mexico City' : 'Ciudad de México'}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: 'Jakarta', data: fonts.sans, style: 'normal', weight: 400 },
        {
          name: 'Jakarta',
          data: fonts.sansSemibold,
          style: 'normal',
          weight: 600,
        },
        { name: 'Sora', data: fonts.display, style: 'normal', weight: 700 },
      ],
    }
  )
}
