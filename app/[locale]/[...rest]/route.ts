import { NextResponse } from 'next/server'
import { ROUTES } from '@/lib/constants'
import { NAP } from '@/lib/constants'
import { isRevisionOpen } from '@/data/revision-ficha'
import messagesEs from '@/messages/es.json'
import messagesEn from '@/messages/en.json'
import type { Locale } from '@/data/types'

/**
 * 404 de una URL bajo /es o /en que no es ninguna página.
 *
 * No es un `page.tsx` que llame a `notFound()`: en Next 16.4 ese throw
 * responde con `<html id="__next_error__">` y el cuerpo vacío. Y no vive en
 * `app/not-found.tsx`, porque leer `headers()` ahí vuelve dinámicas las
 * páginas que sí existen.
 *
 * Este handler solo corre para lo que no casó. El locale sale de `params`,
 * no de una cabecera. El resto del sitio sigue estático o en ISR.
 */

type Ctx = { params: Promise<{ locale: string; rest: string[] }> }

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function page(locale: Locale): string {
  const en = locale === 'en'
  const copy = en ? messagesEn.notFound : messagesEs.notFound
  const nav = en ? messagesEn.nav : messagesEs.nav
  const review = !en && isRevisionOpen()
  const home = `/${locale}`
  const contact = `/${locale}${ROUTES.contacto[locale]}`
  const services = `/${locale}${ROUTES.services[locale]}`
  const blog = `/${locale}${ROUTES.blog[locale]}`
  const revision = `/${locale}${ROUTES.revisionFicha[locale]}`
  const primaryHref = en ? home : review ? revision : home
  const primaryLabel = en
    ? 'Go to homepage'
    : review
      ? 'Pide tu revisión gratis'
      : 'Ir al inicio'
  const secondaryHref = en ? contact : review ? home : contact
  const secondaryLabel = en ? nav.contact : review ? 'Ir al inicio' : nav.contact
  const title = en
    ? '404 — Page not found | Carlos Anaya Ruiz'
    : '404 — Página no encontrada | Carlos Anaya Ruiz'
  const extra = en
    ? ''
    : review
      ? `<a href="${esc(contact)}">${esc(nav.contact)}</a>`
      : `<a href="${esc(blog)}">${esc(nav.blog)}</a>`

  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(copy.lead)}" />
</head>
<body style="margin:0;background:#12100e;color:#ebe6d9;font-family:Georgia,serif">
<header style="padding:1.25rem 1.5rem">
<a href="${esc(home)}" style="color:#ebe6d9;text-decoration:none">Carlos Anaya Ruiz</a>
</header>
<main id="main-content" style="max-width:42rem;padding:3rem 1.5rem 4rem">
<p style="letter-spacing:0.16em;text-transform:uppercase;font-family:ui-monospace,monospace;font-size:0.75rem">${esc(copy.title)}</p>
<h1 style="font-size:2.5rem;line-height:1.05;margin:1.5rem 0 0">${esc(copy.heading)}</h1>
<p style="max-width:40rem;line-height:1.5;color:#b3aea0">${esc(copy.lead)}</p>
<p>
<a href="${esc(primaryHref)}">${esc(primaryLabel)}</a>
<a href="${esc(secondaryHref)}" style="margin-left:1.5rem">${esc(secondaryLabel)}</a>
</p>
<nav aria-label="${en ? 'Other pages' : 'Otras páginas'}">
<a href="${esc(services)}">${esc(nav.services)}</a>
${extra}
<a href="mailto:${esc(NAP.email)}">${en ? 'report the broken link' : 'reportar el enlace roto'}</a>
</nav>
</main>
<footer style="padding:1.5rem;border-top:1px solid #2a2620">
<a href="${esc(home)}">Carlos Anaya Ruiz</a>
</footer>
</body>
</html>
`
}

async function respond(ctx: Ctx) {
  const { locale } = await ctx.params
  const lang: Locale = locale === 'en' ? 'en' : 'es'
  return new NextResponse(page(lang), {
    status: 404,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  })
}

export function GET(_request: Request, ctx: Ctx) {
  return respond(ctx)
}

export function HEAD(_request: Request, ctx: Ctx) {
  return respond(ctx)
}
