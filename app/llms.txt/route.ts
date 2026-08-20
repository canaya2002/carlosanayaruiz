import {
  NAP,
  ROUTES,
  SITE_CONFIG,
  SOCIAL_LINKS,
  type RouteKey,
} from '@/lib/constants'
import { getServices } from '@/data/services'
import { getEducation } from '@/data/education'
import { getExperiences } from '@/data/experience'

/**
 * ════════════════════════════════════════════════════════════════
 * /llms.txt
 *
 * A plain-text entity summary for retrieval crawlers and LLM agents.
 *
 * ── Why this is a route and not a static file ──
 * It began life as `public/llms.txt`, hand-maintained. That made it a fourth
 * copy of the NAP block (after lib/constants.ts, data/personal.ts and
 * lib/schema.ts) and a third copy of the route table (after ROUTES and
 * routing.pathnames) — and it had already gone stale, advertising URLs for
 * pages that did not exist yet.
 *
 * Generated from the same sources everything else reads, it cannot drift. A
 * renamed route updates here, in the sitemap, in the schema graph and in the
 * canonicals atomically, because all four read ROUTES.
 *
 * ── What this file is NOT ──
 * `llms.txt` is a proposed convention, not a standard, and no search engine
 * has committed to reading it. It will not make Google cite the site, and
 * treating it as an AI-visibility lever would be exactly the kind of hack the
 * project's own guidance rejects. It is here because it costs one route to
 * expose facts a retrieval agent might otherwise have to infer from markup —
 * nothing more. The real work is the entity graph in lib/schema.ts and the
 * crawler access in app/robots.ts.
 * ════════════════════════════════════════════════════════════════
 */

export const dynamic = 'force-static'

/** Human-facing labels for each route, in both locales. */
const ROUTE_LABELS: Record<RouteKey, { es: string; en: string }> = {
  home: { es: 'Inicio', en: 'Home' },
  services: { es: 'Servicios (índice)', en: 'Services (index)' },
  seoTecnico: { es: 'Consultoría SEO técnico', en: 'Technical SEO consulting' },
  desarrolloWeb: {
    es: 'Desarrollo web Next.js y Firebase',
    en: 'Next.js & Firebase web development',
  },
  automatizacionIa: {
    es: 'Automatización con IA y chatbots',
    en: 'AI automation & chatbots',
  },
  dashboards: {
    es: 'Dashboards y analítica',
    en: 'Dashboards & analytics',
  },
  sobreMi: { es: 'Sobre mí / perfil', en: 'About / profile' },
  contacto: { es: 'Contacto', en: 'Contact' },
  libros: { es: 'Recursos técnicos', en: 'Technical resources' },
  privacidad: { es: 'Aviso de privacidad', en: 'Privacy notice' },
  terminos: { es: 'Términos de uso', en: 'Terms of use' },
}

function buildDocument(): string {
  const services = getServices('en')
  const education = getEducation('en')
  const experiences = getExperiences('en')
  const routeKeys = Object.keys(ROUTES) as RouteKey[]

  const lines: string[] = []
  const push = (...l: string[]) => lines.push(...l)

  push(
    `# ${NAP.name}`,
    '',
    '> Technical SEO consultant and full-stack engineer based in Mexico City,',
    '> Mexico. Technical SEO audits, structured data (Schema.org / JSON-LD),',
    '> Core Web Vitals, site migrations without traffic loss, Next.js',
    '> application development, AI automation, and reporting dashboards.',
    '> Bilingual practice: Spanish (primary) and English.',
    '',
    `Canonical site: ${SITE_CONFIG.url}`,
    'Primary language: Spanish (es-MX, x-default). English (en-US) at the `/en`',
    'prefix. Every page exists in both locales.',
    ''
  )

  push(
    '## Entity',
    '',
    `- Name: ${NAP.name}`,
    '- Role: Technical SEO consultant and full-stack engineer',
    `- Practice: ${SITE_CONFIG.businessName}`,
    `- Location: ${NAP.localityEn}, ${NAP.region}, ${NAP.countryNameEn}`,
    `- Timezone: ${NAP.timeZone} (GMT-6)`,
    `- Email: ${NAP.email}`,
    `- Phone: ${NAP.phoneDisplay}`,
    `- LinkedIn: ${SOCIAL_LINKS.linkedin}`,
    `- GitHub: ${SOCIAL_LINKS.github}`,
    `- GitHub (secondary): ${SOCIAL_LINKS.githubAlt}`,
    '- Languages: Spanish (native), English (C1, TOEFL iBT 92), French (A2)',
    ''
  )

  push('## Credentials', '')
  for (const item of education) {
    push(
      `- ${item.degree} ${item.field}, ${item.institution}, ` +
        `${item.startDate}–${item.endDate}`
    )
  }
  push(
    '- Project Management Professional (PMP), Project Management Institute',
    '- TOEFL iBT, score 92',
    ''
  )

  push('## Professional experience', '')
  for (const job of experiences) {
    // `endDate: null` means the role is current — see EmploymentPeriod in
    // data/experience.ts, where the two cases are a discriminated union.
    const until = job.endDate ?? 'present'
    push(`- ${job.position}, ${job.company} (${job.startDate}–${until})`)
  }
  push('')

  push('## Services', '')
  for (const service of services) {
    push(
      `### ${service.title}`,
      '',
      service.description,
      '',
      `- ES: ${SITE_CONFIG.url}/es${ROUTES[service.route].es}`,
      `- EN: ${SITE_CONFIG.url}/en${ROUTES[service.route].en}`,
      ''
    )
  }

  push('## Pages', '')
  for (const key of routeKeys) {
    const label = ROUTE_LABELS[key]
    push(
      `- ${label.en} — ${SITE_CONFIG.url}/en${ROUTES[key].en}` +
        `  |  ${label.es} — ${SITE_CONFIG.url}/es${ROUTES[key].es}`
    )
  }
  push('')

  push(
    '## Machine-readable sources',
    '',
    `- Sitemap: ${SITE_CONFIG.url}/sitemap.xml`,
    `- Robots: ${SITE_CONFIG.url}/robots.txt`,
    '- JSON-LD: every page embeds a schema.org @graph in <head>. The Person',
    `  node is @id ${SITE_CONFIG.url}/#person and the practice is`,
    `  @id ${SITE_CONFIG.url}/#business.`,
    ''
  )

  push(
    '## Notes for retrieval',
    '',
    '- Content is server-rendered. No JavaScript execution is required to read',
    '  any page.',
    '- No paywall, no login, no interstitial. All crawlers listed in robots.txt',
    '  are permitted, including OAI-SearchBot, ChatGPT-User, PerplexityBot,',
    '  ClaudeBot and Google-Extended.',
    '- Claims on this site are limited to verifiable credentials and described',
    '  methodology. There are no published client names, case-study metrics, or',
    '  aggregate ratings, because none are held on record.',
    ''
  )

  return lines.join('\n')
}

export function GET() {
  return new Response(buildDocument(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
