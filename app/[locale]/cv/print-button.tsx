'use client'

import { Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PrintButtonProps {
  /** Etiqueta visible. Llega traducida desde el server component. */
  label: string
}

/**
 * Botón de descarga del CV.
 *
 * ── POR QUÉ NO HAY LIBRERÍA DE PDF ──
 * No se instaló ninguna a propósito. Un generador de PDF en cliente (jsPDF,
 * html2canvas, react-pdf) significa dos representaciones del mismo CV: la que
 * se ve en pantalla y la que se descarga. En cuanto se agrega un puesto a
 * data/experience.ts, una de las dos queda vieja — y la que queda vieja es
 * justamente la que la gente guarda y reenvía.
 *
 * `window.print()` abre el diálogo del navegador, que ya sabe imprimir a PDF
 * en todos los sistemas. Lo que se descarga es la hoja de impresión que
 * define page.tsx, así que el PDF SIEMPRE es el contenido de esta página. Cero
 * kilobytes de JavaScript extra y cero posibilidad de desincronización.
 *
 * Es el único cliente de la ruta: `window` no existe en el servidor, así que
 * el `onClick` obliga a que este archivo — y nada más — cruce al navegador.
 */
export function PrintButton({ label }: PrintButtonProps) {
  return (
    <Button
      type="button"
      size="lg"
      className="sheen shadow-glow-brand"
      onClick={() => window.print()}
    >
      <Printer className="size-4" aria-hidden="true" />
      {label}
    </Button>
  )
}
