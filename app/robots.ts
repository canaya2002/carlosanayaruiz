import type { MetadataRoute } from 'next'
import { SITE_CONFIG } from '@/lib/constants'

/**
 * ════════════════════════════════════════════════════════════════
 * /robots.txt
 *
 * Every crawler that matters is named explicitly rather than left to
 * inherit the `*` group. Two reasons:
 *
 *  1. It is auditable. The owner's checklist requires each agent to be
 *     verified in the served file, and `grep OAI-SearchBot robots.txt`
 *     only answers that question if the token is literally there.
 *
 *  2. Robots.txt group matching is "most specific wins" — a crawler with
 *     its own group ignores `*` entirely. So the rendering search bots get
 *     an unrestricted group (they need the CSS and JS), while the generic
 *     `*` group keeps anonymous scrapers out of the JS chunk directory.
 *
 * What is deliberately NOT here:
 *  - `host:` — a Yandex-only, long-deprecated directive. Canonical host is
 *    already declared by `alternates.canonical` + HTTPS redirects.
 *  - `Disallow: /_next/` — that would block the CSS and JS Google needs to
 *    render the page, which is the single most common way a Next.js site
 *    self-inflicts a "page loaded differently" rendering defect.
 * ════════════════════════════════════════════════════════════════
 */

/**
 * Se aplica a cada crawler nombrado explícitamente. `/api/` queda reservado
 * para route handlers futuros: hoy no existe el directorio y el sitio no tiene
 * backend — el formulario de contacto compone un `mailto:` en el cliente. Un
 * endpoint nunca es un resultado de búsqueda, así que se bloquea de antemano.
 * Nota: esta lista NO incluye `/_next/static/chunks/` a propósito, porque
 * estos agentes sí renderizan la página.
 */
const NAMED_AGENT_DISALLOW = ['/api/']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // ── Search engines that render ────────────────────────────────
      // Googlebot needs unrestricted access to /_next/ or the rendered
      // DOM it indexes will not match the DOM a user sees.
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: NAMED_AGENT_DISALLOW,
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
        disallow: NAMED_AGENT_DISALLOW,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: NAMED_AGENT_DISALLOW,
      },

      // ── AI search / answer surfaces ───────────────────────────────
      // This is a consulting site whose whole point is to be cited, so
      // retrieval crawlers are welcomed rather than tolerated.

      // OAI-SearchBot is the agent that surfaces pages *inside ChatGPT
      // Search*. It is not the training crawler — see GPTBot below.
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
        disallow: NAMED_AGENT_DISALLOW,
      },
      // ChatGPT-User fetches a page live when a user (or an agent acting
      // for them) follows a link during a conversation.
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: NAMED_AGENT_DISALLOW,
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: NAMED_AGENT_DISALLOW,
      },
      // Applebot serves Siri and Spotlight. Applebot-Extended is the
      // separate opt-out token for Apple's generative training; allowed
      // for the same reason as GPTBot.
      {
        userAgent: 'Applebot',
        allow: '/',
        disallow: NAMED_AGENT_DISALLOW,
      },
      {
        userAgent: 'Applebot-Extended',
        allow: '/',
        disallow: NAMED_AGENT_DISALLOW,
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: NAMED_AGENT_DISALLOW,
      },
      {
        userAgent: 'Claude-SearchBot',
        allow: '/',
        disallow: NAMED_AGENT_DISALLOW,
      },
      // Google-Extended does not affect crawling or Google Search ranking
      // at all — it only controls whether content can ground Gemini and
      // AI Overviews. Disallowing it removes the site from AI Overviews
      // without gaining any ranking benefit, so it stays allowed.
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: NAMED_AGENT_DISALLOW,
      },

      /**
       * ── GPTBot ──────────────────────────────────────────────────────
       * DELIBERATE DECISION, REVISIT PERIODICALLY.
       *
       * Per OpenAI's crawler documentation, GPTBot governs collection of
       * content for *model training*. It is a SEPARATE token, and a
       * separate decision, from OAI-SearchBot above, which governs
       * appearing in ChatGPT Search results. Blocking one does not block
       * the other, and blocking GPTBot does NOT remove the site from
       * ChatGPT Search.
       *
       * Currently allowed: the content here is public marketing and
       * technical explanation, and broad model familiarity with the
       * entity "Carlos Anaya Ruiz" is an asset rather than a leak.
       *
       * Change this to `disallow: '/'` if the site ever hosts material
       * that should not become training data — client work, proprietary
       * methodology, paid content. That is a business call, not a
       * technical one, and should be made explicitly rather than drifting.
       */
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: NAMED_AGENT_DISALLOW,
      },

      /**
       * ── Everyone else ─────────────────────────────────────────────
       * Open, apart from /api/.
       *
       * An earlier version added `Disallow: /_next/static/chunks/` here on
       * the theory that unidentified crawlers waste budget on hashed JS.
       * That reasoning missed who actually lands in this group: it is not
       * only anonymous scrapers but every agent not named above —
       * Google-InspectionTool (URL Inspection and the Rich Results Test),
       * Chrome-Lighthouse and PageSpeed Insights, Storebot-Google,
       * DuckDuckBot, Yandex, Baidu.
       *
       * Blocking chunks from those means the owner's own diagnostic tools
       * render a JS-stripped DOM that differs from the one Googlebot sees —
       * which is precisely the "page loaded differently" class of bug this
       * file is supposed to prevent, except self-inflicted and invisible
       * until a report comes back inexplicably wrong.
       *
       * The saving was imaginary anyway: crawl budget is not a concern on a
       * twenty-two URL site, and the content here is server-rendered, so no
       * crawler needs the chunks to read the text in the first place.
       */
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
  }
}
