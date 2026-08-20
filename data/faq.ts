import { forLocale, type FaqItem, type Localized, type Locale } from './types'

/**
 * ════════════════════════════════════════════════════════════════
 * SITE-LEVEL FAQ
 *
 * Engagement-level questions: how working together actually goes.
 * Deliberately DISTINCT from the per-service FAQs in `data/services.ts`.
 *
 * The home page used to render all twelve service FAQs, which duplicated
 * the four service pages word for word — two URLs answering the same query
 * is how pages end up competing with each other instead of ranking. Home
 * owns the "how do we work together" questions; each service page owns its
 * own technical ones.
 *
 * Every answer here must stay literally true. These are emitted as FAQPage
 * JSON-LD, so an invented turnaround time or price is a false structured-data
 * claim, not just weak copy.
 * ════════════════════════════════════════════════════════════════
 */
const siteFaqData: Localized<FaqItem[]> = {
  es: [
    {
      question: '¿Trabajas solo o con un equipo?',
      answer:
        'Solo, y eso es intencional. Trabajas directamente conmigo de la auditoría a la implementación: no hay un ejecutivo de cuenta traduciendo lo que dijiste ni un junior aprendiendo con tu presupuesto. La contraparte honesta es que tengo capacidad limitada y no puedo tomar cinco proyectos grandes a la vez.',
    },
    {
      question: '¿Cómo cobras: por hora, por proyecto o por retainer?',
      answer:
        'Por alcance cerrado en la mayoría de los casos. Después de la llamada inicial te mando una propuesta con entregables, fechas y precio fijo, para que el costo no dependa de cuántas horas tarde. Para acompañamiento continuo uso retainer mensual con un número de horas acordado. No publico tarifas porque el rango real depende del tamaño del sitio y del estado en que esté.',
    },
    {
      question: '¿Qué necesitas de mí para empezar?',
      answer:
        'Acceso de lectura a Google Search Console y a la analítica, la URL del sitio y, si existe, acceso al repositorio. Con eso puedo diagnosticar antes de la primera reunión formal. Si no tienes Search Console configurado, eso es parte del trabajo y no un requisito previo.',
    },
    {
      question: '¿Puedes garantizar la primera posición en Google?',
      answer:
        'No, y quien te la garantice está vendiéndote algo que no controla. Google no promete indexación ni posiciones a nadie. Lo que sí puedo comprometer es lo verificable: que el sitio sea rastreable e indexable, que los datos estructurados pasen validación, que los Core Web Vitals estén en verde con datos de campo, y que una migración no tire el tráfico que ya tienes.',
    },
    {
      question: '¿Trabajas con sitios que no están en Next.js?',
      answer:
        'Para auditoría y estrategia, sí: WordPress, Shopify, Angular, SPAs de React y stacks a medida. Los principios de rastreo e indexación son los mismos en todas partes. Para implementación mi terreno más fuerte es Next.js y React; si tu stack es otro, entrego las correcciones especificadas para que las aplique tu equipo.',
    },
    {
      question: '¿En qué idiomas y zonas horarias trabajas?',
      answer:
        'Español e inglés, ambos a nivel profesional (TOEFL iBT 92). Estoy en Ciudad de México, GMT-6, que se traslapa con casi todo el horario laboral de Estados Unidos y de Latinoamérica. Respondo consultas nuevas en 24 a 48 horas hábiles.',
    },
  ],
  en: [
    {
      question: 'Do you work alone or with a team?',
      answer:
        "Alone, and that's deliberate. You work with me directly from audit through implementation — no account manager relaying what you said, no junior learning on your budget. The honest trade-off is that my capacity is limited and I can't take on five large projects at once.",
    },
    {
      question: 'How do you charge — hourly, per project, or retainer?',
      answer:
        "Fixed scope, in most cases. After the intro call you get a proposal with deliverables, dates, and a fixed price, so the cost doesn't depend on how long I take. For ongoing work I use a monthly retainer with an agreed number of hours. I don't publish rates because the real range depends on the size of the site and the state it's in.",
    },
    {
      question: 'What do you need from me to start?',
      answer:
        "Read access to Google Search Console and your analytics, the site URL, and repository access if there is one. That's enough to diagnose before the first formal meeting. If Search Console isn't set up yet, that's part of the work, not a prerequisite.",
    },
    {
      question: 'Can you guarantee the number one position on Google?',
      answer:
        "No — and anyone who guarantees it is selling something they don't control. Google promises neither indexation nor rankings to anybody. What I can commit to is the verifiable part: that the site is crawlable and indexable, that structured data passes validation, that Core Web Vitals are green on field data, and that a migration doesn't drop the traffic you already have.",
    },
    {
      question: "Do you work with sites that aren't built in Next.js?",
      answer:
        'For audit and strategy, yes: WordPress, Shopify, Angular, React SPAs, and custom stacks. Crawling and indexation principles are the same everywhere. For implementation my strongest ground is Next.js and React; if your stack is something else, I hand over specified fixes for your team to apply.',
    },
    {
      question: 'What languages and time zones do you work in?',
      answer:
        'Spanish and English, both at professional level (TOEFL iBT 92). I am in Mexico City, GMT-6, which overlaps with nearly the whole US and Latin American working day. I reply to new enquiries within 24 to 48 business hours.',
    },
  ],
}

export function getSiteFaq(locale: Locale): FaqItem[] {
  return forLocale(siteFaqData, locale)
}
