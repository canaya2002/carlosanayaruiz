import type { Locale } from './types'
import type { FaqEntry } from '@/lib/schema'

/**
 * ════════════════════════════════════════════════════════════════
 * LA REVISIÓN GRATIS DE TU FICHA DE GOOGLE — el texto de la página
 *
 * El español es LITERAL del copy final aprobado el 27/10/2026
 * (lead-magnet-pagina-final.md). No se reescribe aquí: si cambia una
 * promesa —plazo, vigencia, qué se revisa— cambia en ese documento primero.
 * El inglés es su traducción, sin añadir ni quitar afirmaciones.
 *
 * ── LA VIGENCIA ES UN DATO, NO UN TEXTO ──
 * `REVISION_CIERRE` es el final del lunes 30/11/2026 en Ciudad de México
 * (UTC−6 todo el año desde 2022). La página la compara contra el reloj en
 * cada regeneración —`revalidate` en la ruta— y la Server Action la vuelve a
 * comprobar al recibir: un formulario cerrado en pantalla y abierto por POST
 * seguiría recibiendo solicitudes que nadie prometió atender.
 * ════════════════════════════════════════════════════════════════
 */

export const REVISION_CIERRE = '2026-12-01T06:00:00Z'

/** La fecha visible de la oferta. También va en el `validThrough` del Offer. */
export const REVISION_VIGENCIA = '2026-11-30'

export function isRevisionOpen(now: number = Date.now()): boolean {
  return now < Date.parse(REVISION_CIERRE)
}

/** El artículo que la página enlaza, y solo cuando ya salió. */
export const REVISION_GUIA_SLUG = 'google-business-profile-mexico'

export interface ReviewCopy {
  metaTitle: string
  metaDescription: string
  h1: string
  subtitle: string
  whyTitle: string
  why: readonly string[]
  checksTitle: string
  checks: readonly string[]
  noAccess: string
  receiveTitle: string
  receive: string
  termTitle: string
  term: string
  validityTitle: string
  validity: string
  noPromiseTitle: string
  noPromise: string
  privacyShort: string
  social: string
  doubts: string
  faqTitle: string
  faqs: readonly FaqEntry[]
  closed: string
  form: {
    nombre: string
    email: string
    negocio: string
    ciudad: string
    maps: string
    mapsHint: string
    web: string
    optional: string
    preocupacion: string
    preocupacionHint: string
    consentBefore: string
    consentLink: string
    consentAfter: string
    boletin: string
    submit: string
    enviando: string
    invalido: string
    sinConfigurar: string
    error: string
  }
  thanks: {
    metaTitle: string
    title: string
    body: string
  }
  guide: string
}

const ES: ReviewCopy = {
  metaTitle: 'Revisión gratis de tu ficha de Google | Carlos Anaya Ruiz',
  metaDescription:
    'Reviso gratis tu ficha de Google Maps y te mando 3 recomendaciones por correo en 3 días hábiles. Sin acceso a tu cuenta. Válido hasta el 30/11/2026.',
  h1: 'Revisión gratis de tu ficha de Google',
  subtitle:
    'Te digo qué está frenando a tu negocio en Google Maps y qué arreglar primero. Sin compromiso y sin letras chiquitas.',
  whyTitle: 'Por qué vale la pena',
  why: [
    'Sabrás si tu ficha está reclamada y si la información que ve tu cliente es la correcta.',
    'Recibes 3 recomendaciones concretas, en orden de prioridad, que puedes aplicar tú mismo.',
    'Lo revisa una persona, no un reporte automático genérico.',
    'Entiendes qué depende de ti y qué no.',
    'Contexto: en Guadalajara, 45.8% de los negocios no ha reclamado su ficha y 73.3% de 21,158 negocios en Maps no tiene web en su perfil (AgaveRank, sep 2026).',
  ],
  checksTitle: 'Qué reviso',
  checks: [
    'Si la ficha está reclamada y verificada.',
    'Categoría principal y secundarias.',
    'Horarios (incluido horario especial).',
    'Fotos: cantidad, calidad y si son reales.',
    'Reseñas: volumen, recencia y si se responden.',
    'Enlace a tu página web (si existe y si funciona en el celular).',
    'Coherencia de nombre, dirección y teléfono entre tu ficha, tu web y tus redes.',
  ],
  noAccess:
    'No necesito acceso a tu cuenta de Google: reviso lo que es público en Google Maps y en la Búsqueda.',
  receiveTitle: 'Qué recibes',
  receive:
    'Un correo con 3 recomendaciones priorizadas para tu ficha, explicadas en lenguaje claro: qué vi, por qué importa y qué hacer.',
  termTitle: 'Plazo',
  term: 'Te respondo por correo en un máximo de 3 días hábiles después de tu solicitud.',
  validityTitle: 'Vigencia',
  validity: 'Recibo solicitudes hasta el lunes 30 de noviembre de 2026.',
  noPromiseTitle: 'Lo que no prometo',
  noPromise:
    'Ninguna acción garantiza una posición específica en Google. Lo que sí te doy es una lista clara de qué arreglar primero.',
  privacyShort:
    'Carlos Anaya Ruiz, con base de operación en Ciudad de México, es responsable del tratamiento de tus datos personales. Uso tu nombre, correo y los datos de tu negocio únicamente para revisar tu ficha de Google, enviarte las recomendaciones y responder sobre esta solicitud. No vendo, rento ni comparto tus datos con terceros con fines comerciales. Puedes ejercer tus derechos ARCO o revocar tu consentimiento escribiendo a carlos@carlosanayaweb.com.',
  social:
    '¿Prefieres redes? Escribe PERFIL por DM en Instagram o por Messenger en Facebook.',
  doubts: '¿Dudas?',
  faqTitle: 'Preguntas frecuentes',
  faqs: [
    {
      question: '¿De verdad es gratis?',
      answer: 'Sí. No pido tarjeta ni te comprometes a contratar nada.',
    },
    {
      question: '¿Necesito darte acceso a mi cuenta de Google?',
      answer: 'No. Reviso lo que es público.',
    },
    {
      question: '¿Me vas a garantizar el primer lugar?',
      answer: 'No. Nadie puede garantizarlo.',
    },
    {
      question: '¿Y si no tengo ficha?',
      answer: 'También te ayudo: te explico cómo crearla y reclamarla.',
    },
    {
      question: '¿Después me vas a querer vender algo?',
      answer:
        'No hay llamada de seguimiento. Si tus recomendaciones requieren trabajo técnico, te cuento cómo lo haría y cuánto costaría solo si tú me lo pides.',
    },
    {
      question: '¿Qué negocios pueden pedirla?',
      answer: 'Negocios con local o zona de servicio en México.',
    },
  ],
  closed:
    'La revisión gratis cerró el 30 de noviembre de 2026. Si quieres ayuda con tu ficha, escríbeme a carlos@carlosanayaweb.com',
  form: {
    nombre: 'Nombre',
    email: 'Correo electrónico',
    negocio: 'Nombre del negocio (como aparece en Google)',
    ciudad: 'Ciudad',
    maps: 'Enlace a tu ficha de Google Maps',
    mapsHint: 'si no lo tienes, la busco',
    web: 'Tu página web',
    optional: 'opcional',
    preocupacion: '¿Qué te preocupa más de tu ficha?',
    preocupacionHint: 'máx. 300 caracteres',
    consentBefore:
      'Acepto que Carlos Anaya Ruiz use mis datos para revisar la ficha de mi negocio y enviarme las recomendaciones, según el ',
    consentLink: 'aviso de privacidad',
    consentAfter: '.',
    boletin:
      'También quiero recibir el boletín (un correo por artículo nuevo del blog).',
    submit: 'Quiero mi revisión gratis',
    enviando: 'Enviando…',
    invalido:
      'Falta algo o un dato no se ve bien. Revisa los campos obligatorios, los enlaces y la casilla de aceptación.',
    sinConfigurar:
      'La recepción del formulario todavía no está conectada. Escríbeme a carlos@carlosanayaweb.com y llega igual.',
    error:
      'Algo falló de mi lado. Inténtalo en un momento o escríbeme a carlos@carlosanayaweb.com.',
  },
  thanks: {
    metaTitle: 'Solicitud recibida — Revisión de tu ficha de Google',
    title: '¡Listo!',
    body: 'Recibí tu solicitud. Te mando tus 3 recomendaciones por correo en un máximo de 3 días hábiles. Si no lo ves, revisa spam o promociones.',
  },
  guide: 'La guía completa',
}

const EN: ReviewCopy = {
  metaTitle: 'Free review of your Google Business Profile | Carlos Anaya Ruiz',
  metaDescription:
    'I review your Google Maps listing for free and email you 3 recommendations within 3 business days. No access to your account. Valid until 11/30/2026.',
  h1: 'Free review of your Google Business Profile',
  subtitle:
    'I tell you what is holding your business back on Google Maps and what to fix first. No commitment and no fine print.',
  whyTitle: 'Why it is worth it',
  why: [
    'You will know whether your listing is claimed and whether the information your customers see is correct.',
    'You get 3 concrete recommendations, in order of priority, that you can apply yourself.',
    'A person reviews it, not a generic automated report.',
    'You understand what depends on you and what does not.',
    'Context: in Guadalajara, 45.8% of businesses have not claimed their listing and 73.3% of 21,158 businesses on Maps have no website on their profile (AgaveRank, Sep 2026).',
  ],
  checksTitle: 'What I review',
  checks: [
    'Whether the listing is claimed and verified.',
    'Primary and secondary categories.',
    'Hours (including special hours).',
    'Photos: quantity, quality and whether they are real.',
    'Reviews: volume, recency and whether they get replies.',
    'Link to your website (whether it exists and whether it works on a phone).',
    'Consistency of name, address and phone number across your listing, your website and your social profiles.',
  ],
  noAccess:
    'I do not need access to your Google account: I review what is public on Google Maps and in Search.',
  receiveTitle: 'What you get',
  receive:
    'An email with 3 prioritised recommendations for your listing, explained in plain language: what I saw, why it matters and what to do.',
  termTitle: 'Turnaround',
  term: 'I reply by email within 3 business days of your request at most.',
  validityTitle: 'Valid until',
  validity: 'I accept requests until Monday, November 30, 2026.',
  noPromiseTitle: 'What I do not promise',
  noPromise:
    'No action guarantees a specific position on Google. What I do give you is a clear list of what to fix first.',
  privacyShort:
    'Carlos Anaya Ruiz, based in Mexico City, is the controller of your personal data. I use your name, email and your business details solely to review your Google listing, send you the recommendations and reply about this request. I do not sell, rent or share your data with third parties for commercial purposes. You can exercise your ARCO rights or withdraw your consent by writing to carlos@carlosanayaweb.com.',
  social:
    'Prefer social media? Send PERFIL by DM on Instagram or through Messenger on Facebook.',
  doubts: 'Questions?',
  faqTitle: 'Frequently asked questions',
  faqs: [
    {
      question: 'Is it really free?',
      answer:
        'Yes. I do not ask for a card and you do not commit to hiring anything.',
    },
    {
      question: 'Do I need to give you access to my Google account?',
      answer: 'No. I review what is public.',
    },
    {
      question: 'Will you guarantee me first place?',
      answer: 'No. Nobody can guarantee it.',
    },
    {
      question: 'What if I do not have a listing?',
      answer: 'I help you too: I explain how to create it and claim it.',
    },
    {
      question: 'Will you try to sell me something afterwards?',
      answer:
        'There is no follow-up call. If your recommendations require technical work, I tell you how I would do it and what it would cost only if you ask me.',
    },
    {
      question: 'Which businesses can request it?',
      answer: 'Businesses with a location or service area in Mexico.',
    },
  ],
  closed:
    'The free review closed on November 30, 2026. If you want help with your listing, write to me at carlos@carlosanayaweb.com',
  form: {
    nombre: 'Name',
    email: 'Email',
    negocio: 'Business name (as it appears on Google)',
    ciudad: 'City',
    maps: 'Link to your Google Maps listing',
    mapsHint: 'if you do not have it, I will find it',
    web: 'Your website',
    optional: 'optional',
    preocupacion: 'What worries you most about your listing?',
    preocupacionHint: 'max. 300 characters',
    consentBefore:
      'I agree that Carlos Anaya Ruiz may use my data to review my business listing and send me the recommendations, as described in the ',
    consentLink: 'privacy notice',
    consentAfter: '.',
    boletin:
      'I also want to receive the newsletter (one email per new blog article).',
    submit: 'I want my free review',
    enviando: 'Sending…',
    invalido:
      'Something is missing or does not look right. Check the required fields, the links and the consent box.',
    sinConfigurar:
      'The form inbox is not connected yet. Write to me at carlos@carlosanayaweb.com and it arrives all the same.',
    error:
      'Something failed on my side. Try again in a moment or write to me at carlos@carlosanayaweb.com.',
  },
  thanks: {
    metaTitle: 'Request received — Google Business Profile review',
    title: 'Done!',
    body: 'I received your request. I will email you your 3 recommendations within 3 business days at most. If you do not see it, check your spam or promotions folder.',
  },
  guide: 'The full guide',
}

export function getReviewCopy(locale: Locale): ReviewCopy {
  return locale === 'en' ? EN : ES
}
