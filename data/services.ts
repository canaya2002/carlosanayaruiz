import { Search, Globe, Bot, BarChart3, type LucideIcon } from 'lucide-react'
import { routePath, routeUrl, type RouteKey } from '@/lib/constants'
import { forLocale, type FaqItem, type Localized, type Locale, type ProcessStep } from './types'

/**
 * The four services. `id` is locale-independent and stable — it is what
 * schema `@id`s and analytics keys are built from, so it must never change
 * even if the display title does.
 */
export type ServiceId = 'seo-tecnico' | 'nextjs-firebase' | 'ai-automation' | 'dashboards'

export interface Service {
  id: ServiceId
  /**
   * Key into the ROUTES table in `lib/constants.ts` — NOT a free-text slug.
   *
   * This used to be `slug: string`, duplicated per locale, and three of the
   * four services had drifted away from their real route, so canonical and
   * schema URLs pointed at pages that do not exist. Referencing the route
   * table makes that class of bug unrepresentable: if the route is renamed,
   * every URL built from it follows, and a wrong key does not compile.
   *
   * Build URLs with `servicePath()` / `serviceUrl()` below.
   */
  route: RouteKey
  title: string
  headline: string
  description: string
  /** Feature-flavoured: what the engagement contains. */
  benefits: string[]
  /** Outcome-flavoured: what is different for the client afterwards. */
  outcomes: string[]
  /** Line items of the deliverable. */
  includes: string[]
  /** Ordered delivery steps, specific to this service. */
  process: ProcessStep[]
  /** Who this is a good fit for. */
  forWhom: string[]
  /**
   * Who this is NOT for. Stated limitations are a trust signal and are
   * required by the owner's checklist — keep these genuinely candid.
   * Never soften one into a disguised sales line.
   */
  notFor: string[]
  icon: LucideIcon
  faq: FaqItem[]
}

const servicesData: Localized<Service[]> = {
  es: [
    {
      id: 'seo-tecnico',
      route: 'seoTecnico',
      title: 'Consultoría SEO Técnica',
      headline: 'Auditorías, datos estructurados, Core Web Vitals y arquitectura de información',
      description: 'Consultoría SEO técnico en México. Audito, optimizo y arquitecto sitios web para buscadores: datos estructurados (Schema.org/JSON-LD), Core Web Vitals, indexación, hreflang, arquitectura de información y estrategia de rendimiento.',
      benefits: [
        'Rastreo del sitio completo, cruzado con Search Console: qué se indexa, qué no y qué compite consigo mismo',
        'Los datos estructurados que ya existen: qué tipos hay, cuáles validan y cuáles no producen ningún resultado',
        'Core Web Vitals en datos de campo y en laboratorio, con la diferencia entre los dos a la vista',
        'Arquitectura de información, estructura de URLs y enlazado interno',
      ],
      outcomes: [
        'Las páginas que importan quedan rastreables e indexables, sin plantillas huérfanas ni canonicals compitiendo entre sí.',
        'Los datos estructurados pasan validación en Google Rich Results en lugar de fallar en silencio.',
        'Core Web Vitals medidos en datos de campo, no sólo en una prueba de laboratorio favorable.',
        'Tu equipo se queda con un backlog priorizado por impacto y esfuerzo que puede ejecutar sin mí.',
      ],
      includes: [
        'Auditoría SEO técnica completa con hallazgos priorizados',
        'Implementación y validación de Schema.org / JSON-LD',
        'Optimización de Core Web Vitals (LCP, INP, CLS)',
        'Revisión de arquitectura de información y estructura de URLs',
        'Estrategia de indexación: sitemap, robots, canonical, hreflang',
        'Auditoría y optimización de enlazado interno',
      ],
      process: [
        {
          title: 'Rastreo y línea base',
          description: 'Crawl completo del sitio cruzado con Search Console y analítica. Se registra el estado actual de indexación, Core Web Vitals y datos estructurados para poder comparar el antes y el después con números propios.',
        },
        {
          title: 'Diagnóstico priorizado',
          description: 'Cada hallazgo se documenta con evidencia, impacto estimado y esfuerzo de implementación, ordenado para que lo primero que se corrija sea lo que más mueve la aguja.',
        },
        {
          title: 'Implementación o acompañamiento',
          description: 'Implemento las correcciones directamente en el repositorio, o acompaño a tu equipo con especificaciones técnicas y revisión de pull requests. Tú decides quién ejecuta.',
        },
        {
          title: 'Validación y seguimiento',
          description: 'Revalidación de schema, medición de Core Web Vitals en campo y revisión de cobertura de índice después de que Google recrawlea, con un reporte de cierre.',
        },
      ],
      forWhom: [
        'Sitios con contenido y tráfico existentes que rinden menos de lo que deberían por causas técnicas.',
        'Equipos de producto que necesitan criterio técnico externo antes de una migración o un rediseño.',
        'Negocios con catálogos o plantillas grandes, donde un solo error de indexación se multiplica por miles de URLs.',
      ],
      notFor: [
        'No es para quien necesita resultados en dos semanas: el ritmo lo marcan el recrawl de Google y el ciclo de despliegue de tu equipo, no la auditoría.',
        'No hago link building, compra de enlaces ni PBNs. Si tu problema es de autoridad o de contenido y no técnico, te lo digo en la primera llamada en lugar de venderte una auditoría.',
      ],
      icon: Search,
      faq: [
        {
          question: '¿Qué incluye una auditoría de SEO técnico?',
          answer: 'Un análisis completo de la arquitectura de tu sitio, estado de indexación, datos estructurados, Core Web Vitals, enlazado interno, canonicals, hreflang, robots/sitemap y renderizado. Recibes un reporte priorizado con correcciones específicas e impacto esperado.',
        },
        {
          question: '¿Cuánto tiempo tarda en verse el impacto de mejoras de SEO técnico?',
          answer: 'El recrawl lo decide Google, no yo: una corrección no existe para el buscador hasta que vuelve a rastrear esa URL. Por eso no le pongo fecha al impacto en rankings. Lo que sí lleva fecha es lo verificable: el día en que la corrección quedó desplegada, la revalidación del schema y la lectura de campo de Core Web Vitals en el reporte de cierre.',
        },
        {
          question: '¿Puedes manejar migraciones SEO?',
          answer: 'Sí. Manejo migraciones desde WordPress, Angular, React SPAs y otros frameworks hacia Next.js. El proceso incluye auditoría pre-migración, mapeo de URLs, redirecciones 301, migración de schema y validación post-migración para preservar rankings orgánicos.',
        },
      ],
    },
    {
      id: 'nextjs-firebase',
      route: 'desarrolloWeb',
      title: 'Aplicaciones Web con Next.js y Firebase',
      headline: 'Desarrollo de aplicaciones web modernas, rápidas e indexables',
      description: 'Construyo aplicaciones web de alto rendimiento con Next.js y Firebase — optimizadas para SEO técnico, Core Web Vitals y escalabilidad. Desde landing pages hasta plataformas SaaS completas con SSR/ISR, autenticación y base de datos en tiempo real.',
      benefits: [
        'Rendimiento Lighthouse 90+ en performance, SEO y accesibilidad',
        'SSR/ISR: el contenido va en el HTML servido y se revalida sin redesplegar',
        'Backend serverless con Firebase: Firestore, Auth, Functions y Hosting',
      ],
      outcomes: [
        'El contenido está en el HTML de la primera respuesta: Googlebot no necesita una segunda pasada para renderizar JavaScript y verlo.',
        'El contenido se actualiza sin esperar un despliegue completo del sitio.',
        'Costos de infraestructura predecibles: serverless que escala a cero cuando nadie lo está usando.',
        'Un repositorio con TypeScript estricto y CI que otro desarrollador puede retomar sin arqueología.',
      ],
      includes: [
        'Arquitectura de información y wireframes',
        'Desarrollo frontend con Next.js App Router + TypeScript',
        'Integración con Firebase (Firestore, Auth, Cloud Functions)',
        'SEO técnico: sitemap, robots, hreflang, Schema JSON-LD',
        'Optimización de Core Web Vitals y performance',
        'Despliegue en Vercel con CI/CD configurado',
      ],
      process: [
        {
          title: 'Alcance y arquitectura',
          description: 'Definimos qué páginas existen, qué se renderiza en el servidor, qué se cachea y qué necesita datos en vivo. El mapa de URLs se decide aquí, antes de escribir código, porque cambiarlo después cuesta rankings.',
        },
        {
          title: 'Sistema de diseño e implementación base',
          description: 'Tokens, componentes y layout con Next.js App Router y TypeScript estricto. Accesibilidad y estados de carga desde el primer componente, no como parche final.',
        },
        {
          title: 'Datos e integraciones',
          description: 'Firestore, autenticación, Cloud Functions y las APIs de terceros que el producto necesite, con reglas de seguridad escritas y probadas antes de exponer datos.',
        },
        {
          title: 'SEO técnico y rendimiento',
          description: 'Metadatos por ruta, sitemap, robots, hreflang, JSON-LD y trabajo de Core Web Vitals antes del lanzamiento — no como una fase posterior de rescate.',
        },
        {
          title: 'Lanzamiento y entrega',
          description: 'Despliegue en Vercel con CI/CD, redirecciones 301 si hay migración, y documentación para que tu equipo pueda continuar sin depender de mí.',
        },
      ],
      forWhom: [
        'Negocios que dependen de búsqueda orgánica y necesitan que el sitio sea rápido e indexable desde el primer día.',
        'Fundadores que necesitan pasar de una idea ya validada a un producto en producción.',
        'Equipos que arrastran un WordPress lento o una SPA que no indexa y quieren migrar sin perder posiciones.',
      ],
      notFor: [
        'No es para proyectos que necesitan un CMS con decenas de editores y flujos de aprobación complejos: ahí una plataforma dedicada te sirve mejor que código a medida.',
        'No tomo proyectos sin una persona del lado del cliente que pueda decidir y revisar. Sin ese contacto el alcance se dilata y el resultado sufre.',
      ],
      icon: Globe,
      faq: [
        {
          question: '¿Cuánto tiempo toma desarrollar una aplicación web con Next.js?',
          answer: 'Depende del alcance, y el alcance se cierra en el primer paso: qué páginas existen, qué se renderiza en el servidor y qué necesita datos en vivo. Antes de tener eso por escrito, cualquier número de semanas que te dé es adivinanza. Con el alcance cerrado te doy fechas por entregable. Esas fechas asumen una persona de tu lado que pueda decidir y revisar; sin ese contacto el calendario se estira y eso no lo controlo yo.',
        },
        {
          question: '¿Por qué Next.js y no otro framework?',
          answer: 'Por el renderizado híbrido: cada ruta se sirve como conviene —servidor, estática o revalidada— sin montar dos stacks para lograrlo. Y trae de fábrica lo que en otros frameworks va a mano: metadatos por ruta, sitemap, hreflang, imágenes optimizadas. En Vercel el despliegue es un push y el rollback es un clic. El tiempo de servicio lo controla el proveedor, no yo.',
        },
        {
          question: '¿Qué me queda cuando el proyecto termina?',
          answer: 'El repositorio con TypeScript estricto y CI, el despliegue en Vercel con su CI/CD, y la documentación de cómo está armado, para que otro desarrollador pueda retomarlo. Si después quieres que siga trabajando en el proyecto, es un retainer mensual con horas acordadas.',
        },
      ],
    },
    {
      id: 'ai-automation',
      route: 'automatizacionIa',
      title: 'Automatización con IA y Chatbots',
      headline: 'Chatbots inteligentes y automatización de procesos con IA',
      description: 'Creo soluciones de automatización con inteligencia artificial para tu negocio: chatbots con LLMs (GPT, Gemini), flujos automatizados, integración de APIs y sistemas de procesamiento inteligente que reducen costos operativos y mejoran la experiencia del cliente.',
      benefits: [
        'Chatbots con contexto y memoria que entienden tu negocio',
        'Integración segura con tus sistemas existentes (CRM, ERP, APIs)',
        'ROI operacional medible: menos tiempo manual, más eficiencia',
      ],
      outcomes: [
        'Las preguntas repetitivas de tus clientes se resuelven sin que alguien de tu equipo las vuelva a escribir a mano.',
        'Los procesos que hoy viven en la cabeza de una persona quedan documentados y ejecutados por un flujo.',
        'Cada respuesta queda registrada: puedes auditar qué contestó el sistema y con qué datos lo contestó.',
        'Costo por conversación acotado, con caché y un modelo elegido según la dificultad de la tarea.',
      ],
      includes: [
        'Análisis de procesos automatizables y viabilidad',
        'Diseño de flujos conversacionales y prompts dinámicos',
        'Desarrollo de chatbot con integración LLM (GPT/Gemini)',
        'Integración con APIs y sistemas internos',
        'Panel de monitoreo y métricas de uso',
        'Documentación técnica y capacitación',
      ],
      process: [
        {
          title: 'Inventario de procesos',
          description: 'Listamos qué tareas son candidatas a automatizarse y cuáles no. Las que dependen de juicio humano se quedan con humanos, y eso queda por escrito.',
        },
        {
          title: 'Diseño conversacional y de datos',
          description: 'Flujos, prompts, fuentes de conocimiento y — sobre todo — qué información nunca debe salir hacia el modelo. Los límites se definen antes de programar.',
        },
        {
          title: 'Implementación e integración',
          description: 'Desarrollo del chatbot o del flujo, conexión con tus sistemas (CRM, base de datos, APIs) y controles de autenticación, sanitización y límite de uso.',
        },
        {
          title: 'Medición y ajuste',
          description: 'Panel de uso, lectura de conversaciones reales y ajuste de prompts, caché y rutas de escalamiento a una persona con datos de producción.',
        },
      ],
      forWhom: [
        'Equipos de soporte o ventas que responden el mismo conjunto de preguntas todos los días.',
        'Operaciones con procesos repetitivos y bien definidos que hoy se ejecutan a mano.',
        'Negocios con documentación interna útil que nadie encuentra a tiempo.',
      ],
      notFor: [
        'No es para quien quiere que el sistema dé el dictamen final en un asunto legal, médico o financiero. Un LLM se equivoca y ahí el error lo paga tu cliente: esa respuesta la firma una persona, o no construyo el flujo.',
        'No es para procesos que todavía no están documentados. Automatizar un proceso confuso sólo lo vuelve confuso más rápido y más difícil de corregir.',
      ],
      icon: Bot,
      faq: [
        {
          question: '¿El chatbot puede conectarse con mi CRM o base de datos?',
          answer: 'Sí. Diseño integraciones con HubSpot, Salesforce, Firestore, PostgreSQL y APIs REST/GraphQL. El chatbot puede consultar y escribir datos en tus sistemas de forma segura.',
        },
        {
          question: '¿Qué tan segura es la implementación?',
          answer: 'La seguridad es un principio de diseño, no un agregado. Implemento autenticación JWT, sanitización de entradas, límites de uso, y la información sensible nunca se envía directamente al LLM sin preprocesamiento.',
        },
        {
          question: '¿Cuánto cuesta mantener un chatbot con IA?',
          answer: 'Los costos operativos dependen del volumen de conversaciones y el modelo de IA utilizado. Diseño arquitecturas que optimizan el uso de tokens con caching y respuestas precomputadas para mantener costos bajos sin sacrificar calidad.',
        },
      ],
    },
    {
      id: 'dashboards',
      route: 'dashboards',
      title: 'Dashboards Responsivos',
      headline: 'Dashboards interactivos y data-driven para tu plataforma',
      description: 'Diseño y desarrollo dashboards responsivos que transforman datos en decisiones. Interfaces limpias, visualizaciones interactivas y arquitectura optimizada para performance — conectados a tus fuentes de datos en tiempo real.',
      benefits: [
        'Visualización de datos clara con gráficas interactivas',
        'Diseño responsivo que funciona en cualquier dispositivo',
        'Conexión en tiempo real con tus fuentes de datos (APIs, SQL, Firebase)',
      ],
      outcomes: [
        'Una sola pantalla con las métricas que tu equipo usa para decidir, en lugar de siete reportes que nadie abre.',
        'Los números salen de la fuente de datos, no de una exportación manual que alguien pega cada lunes.',
        'Cada métrica tiene su definición escrita, así dos áreas dejan de reportar cifras distintas para lo mismo.',
        'Se lee bien en el teléfono, que es donde en la práctica se revisa.',
      ],
      includes: [
        'Auditoría de fuentes de datos y requerimientos',
        'Diseño UX/UI del dashboard con wireframes',
        'Desarrollo frontend con React/Next.js y librerías de gráficas',
        'Integración con APIs, bases de datos y servicios cloud',
        'Optimización de rendimiento y carga de datos',
        'Responsive design y pruebas cross-browser',
      ],
      process: [
        {
          title: 'Definición de preguntas',
          description: 'Antes de elegir gráficas, definimos qué decisiones debe soportar el dashboard y qué métricas las responden, cada una con su fórmula por escrito.',
        },
        {
          title: 'Auditoría de fuentes',
          description: 'Revisamos de dónde vienen los datos, cada cuánto se actualizan y qué tan confiables son. Aquí aparece la mayoría de las sorpresas de un proyecto de datos.',
        },
        {
          title: 'Diseño y construcción',
          description: 'Wireframes, jerarquía visual y desarrollo con React/Next.js, con la carga de datos planteada para que la primera vista sea rápida y el resto llegue progresivamente.',
        },
        {
          title: 'Entrega y extensión',
          description: 'Pruebas cross-browser, documentación de cada métrica y una estructura modular para que agregar una tarjeta nueva no implique rehacer el dashboard.',
        },
      ],
      forWhom: [
        'Equipos que ya tienen datos y les falta una vista compartida para actuar sobre ellos.',
        'Plataformas SaaS que necesitan ofrecer un panel de analítica a sus propios clientes.',
        'Operaciones que hoy dependen de un archivo de Excel que sólo una persona sabe actualizar.',
      ],
      notFor: [
        'No es para quien todavía no captura los datos. Si la información no existe o no es confiable, primero hay que instrumentar; visualizar antes sólo produce gráficas equivocadas con mejor tipografía.',
        'No sustituye una plataforma de BI con modelado y gobierno de datos para toda la organización. Si necesitas eso, un dashboard a medida es la herramienta incorrecta.',
      ],
      icon: BarChart3,
      faq: [
        {
          question: '¿Qué librerías de visualización utilizas?',
          answer: 'Trabajo con Recharts, D3.js, Chart.js y Plotly según las necesidades del proyecto. Para dashboards de BI también tengo experiencia con Power BI y DAX para consultas complejas.',
        },
        {
          question: '¿El dashboard puede consumir datos en tiempo real?',
          answer: 'Sí. Implemento conexiones WebSocket, Firestore real-time listeners y polling optimizado. La arquitectura se diseña para que los datos se actualicen sin recargar la página.',
        },
        {
          question: '¿Puedo agregar nuevas métricas después?',
          answer: 'Absolutamente. Diseño dashboards con arquitectura modular: agregar nuevas tarjetas, gráficas o secciones es tan simple como configurar un nuevo componente. La estructura de datos es extensible por diseño.',
        },
      ],
    },
  ],
  en: [
    {
      id: 'seo-tecnico',
      route: 'seoTecnico',
      title: 'Technical SEO Consulting',
      headline: 'Audits, structured data, Core Web Vitals, and information architecture',
      description: 'Technical SEO consulting in Mexico. I audit, optimize, and architect websites for search engines: structured data (Schema.org/JSON-LD), Core Web Vitals, indexation, hreflang, information architecture, and performance strategy.',
      benefits: [
        'A full crawl cross-referenced with Search Console: what gets indexed, what does not, and what competes with itself',
        'The structured data already in place: which types exist, which validate, and which produce nothing',
        'Core Web Vitals in field data and in the lab, with the gap between them visible',
        'Information architecture, URL structure, and internal linking',
      ],
      outcomes: [
        'The pages that matter become crawlable and indexable, with no orphaned templates and no canonicals competing with each other.',
        'Structured data passes Google Rich Results validation instead of failing silently.',
        'Core Web Vitals measured on field data, not just on one favourable lab run.',
        'Your team keeps a backlog prioritized by impact and effort that they can execute without me.',
      ],
      includes: [
        'Full technical SEO audit with prioritized findings',
        'Schema.org / JSON-LD implementation and validation',
        'Core Web Vitals optimization (LCP, INP, CLS)',
        'Information architecture and URL structure review',
        'Indexation strategy: sitemap, robots, canonical, hreflang',
        'Internal linking audit and optimization',
      ],
      process: [
        {
          title: 'Crawl and baseline',
          description: 'A full site crawl cross-referenced with Search Console and analytics. Current indexation, Core Web Vitals, and structured-data state are recorded so before and after can be compared with your own numbers.',
        },
        {
          title: 'Prioritized diagnosis',
          description: 'Every finding is documented with evidence, estimated impact, and implementation effort, ordered so the first thing fixed is the thing that moves the needle most.',
        },
        {
          title: 'Implementation or guidance',
          description: 'I implement the fixes directly in the repository, or support your team with technical specs and pull-request review. You decide who ships.',
        },
        {
          title: 'Validation and follow-up',
          description: 'Schema re-validation, field measurement of Core Web Vitals, and an index-coverage review after Google recrawls, with a closing report.',
        },
      ],
      forWhom: [
        'Sites with existing content and traffic that underperform for technical reasons.',
        'Product teams that need outside technical judgement before a migration or a redesign.',
        'Businesses with large catalogues or templates, where a single indexation mistake multiplies across thousands of URLs.',
      ],
      notFor: [
        'Not for anyone who needs results in two weeks: the pace is set by Google’s recrawl and your team’s deployment cycle, not by the audit.',
        'I do not do link building, paid links, or PBNs. If your problem is authority or content rather than technical, I will say so on the first call instead of selling you an audit.',
      ],
      icon: Search,
      faq: [
        {
          question: 'What does a technical SEO audit include?',
          answer: 'A full analysis of your site architecture, indexation status, structured data, Core Web Vitals, internal linking, canonical tags, hreflang, robots/sitemap, and rendering. You get a prioritized report with specific fixes and expected impact.',
        },
        {
          question: 'How long before I see results from technical SEO improvements?',
          answer: 'Google decides when it recrawls, not me: a fix does not exist for the search engine until it crawls that URL again. That is why I do not put a date on ranking impact. What does carry a date is what is verifiable: the day the fix shipped, the schema revalidation, and the field reading of Core Web Vitals in the closing report.',
        },
        {
          question: 'Can you handle SEO migrations?',
          answer: 'Yes. I handle migrations from WordPress, Angular, React SPAs, and other frameworks to Next.js. The process includes pre-migration audit, URL mapping, 301 redirects, schema migration, and post-migration validation to preserve organic rankings.',
        },
      ],
    },
    {
      id: 'nextjs-firebase',
      route: 'desarrolloWeb',
      title: 'Modern Web Apps with Next.js & Firebase',
      headline: 'Fast, indexable, modern web application development',
      description: 'I build high-performance web applications with Next.js and Firebase — optimized for technical SEO, Core Web Vitals, and scalability. From landing pages to full SaaS platforms with SSR/ISR, authentication, and real-time database.',
      benefits: [
        'Lighthouse 90+ scores in performance, SEO, and accessibility',
        'SSR/ISR: content ships in the served HTML and revalidates without a redeploy',
        'Serverless backend with Firebase: Firestore, Auth, Functions & Hosting',
      ],
      outcomes: [
        'The content is in the HTML of the first response: Googlebot does not need a second pass to render JavaScript and see it.',
        'Content updates without waiting for a full site deployment.',
        'Predictable infrastructure cost: serverless that scales to zero when nobody is using it.',
        'A repository with strict TypeScript and CI that another developer can pick up without archaeology.',
      ],
      includes: [
        'Information architecture and wireframes',
        'Frontend development with Next.js App Router + TypeScript',
        'Firebase integration (Firestore, Auth, Cloud Functions)',
        'Technical SEO: sitemap, robots, hreflang, Schema JSON-LD',
        'Core Web Vitals and performance optimization',
        'Vercel deployment with CI/CD configured',
      ],
      process: [
        {
          title: 'Scope and architecture',
          description: 'We define which pages exist, what renders on the server, what is cached, and what needs live data. The URL map is decided here, before any code, because changing it later costs rankings.',
        },
        {
          title: 'Design system and base implementation',
          description: 'Tokens, components, and layout with Next.js App Router and strict TypeScript. Accessibility and loading states from the first component, not as a final patch.',
        },
        {
          title: 'Data and integrations',
          description: 'Firestore, authentication, Cloud Functions, and whichever third-party APIs the product needs, with security rules written and tested before any data is exposed.',
        },
        {
          title: 'Technical SEO and performance',
          description: 'Per-route metadata, sitemap, robots, hreflang, JSON-LD, and Core Web Vitals work before launch — not as a later rescue phase.',
        },
        {
          title: 'Launch and handover',
          description: 'Vercel deployment with CI/CD, 301 redirects if it is a migration, and documentation so your team can carry on without depending on me.',
        },
      ],
      forWhom: [
        'Businesses that depend on organic search and need the site fast and indexable from day one.',
        'Founders who need to move from an already-validated idea to a product in production.',
        'Teams stuck with a slow WordPress or a SPA that will not index, who want to migrate without losing positions.',
      ],
      notFor: [
        'Not for projects that need a CMS with dozens of editors and complex approval workflows: a dedicated platform will serve you better than custom code there.',
        'I do not take projects without one person on the client side who can decide and review. Without that contact, scope drifts and the result suffers.',
      ],
      icon: Globe,
      faq: [
        {
          question: 'How long does it take to build a web app with Next.js?',
          answer: 'It depends on scope, and scope is closed in the first step: what pages exist, what renders on the server, and what needs live data. Before that is in writing, any number of weeks I give you is a guess. With scope closed I give you dates per deliverable. Those dates assume someone on your side who can decide and review; without that contact the calendar stretches, and that is not mine to control.',
        },
        {
          question: 'Why Next.js and not another framework?',
          answer: 'Because of hybrid rendering: each route is served the way it should be — server, static, or revalidated — without maintaining two stacks. And it ships with what other frameworks leave to hand: per-route metadata, sitemap, hreflang, optimized images. On Vercel a deploy is a push and a rollback is a click. Uptime is the provider to control, not me.',
        },
        {
          question: 'What do I keep when the project ends?',
          answer: 'The repository with strict TypeScript and CI, the Vercel deployment with its CI/CD, and documentation of how it is built, so another developer can pick it up. If you want me to keep working on it afterwards, that is a monthly retainer with agreed hours.',
        },
      ],
    },
    {
      id: 'ai-automation',
      route: 'automatizacionIa',
      title: 'AI Automation & Chatbots',
      headline: 'Intelligent chatbots and AI-powered process automation',
      description: 'I create AI automation solutions for your business: chatbots powered by LLMs (GPT, Gemini), automated workflows, API integrations, and intelligent processing systems that reduce operational costs and improve customer experience.',
      benefits: [
        'Context-aware chatbots that understand your business',
        'Secure integration with your existing systems (CRM, ERP, APIs)',
        'Measurable operational ROI: less manual work, more efficiency',
      ],
      outcomes: [
        'Repetitive customer questions get answered without someone on your team typing them again.',
        'Processes that today live in one person’s head end up documented and executed by a workflow.',
        'Every answer is logged: you can audit what the system replied and which data it used.',
        'A bounded cost per conversation, using caching and a model chosen to match the difficulty of the task.',
      ],
      includes: [
        'Automatable process analysis and feasibility study',
        'Conversational flow and dynamic prompt design',
        'Chatbot development with LLM integration (GPT/Gemini)',
        'Integration with APIs and internal systems',
        'Monitoring dashboard and usage metrics',
        'Technical documentation and training',
      ],
      process: [
        {
          title: 'Process inventory',
          description: 'We list which tasks are candidates for automation and which are not. The ones that depend on human judgement stay with humans, and that is written down.',
        },
        {
          title: 'Conversation and data design',
          description: 'Flows, prompts, knowledge sources, and above all which information must never reach the model. The boundaries are set before anything is built.',
        },
        {
          title: 'Implementation and integration',
          description: 'Building the chatbot or workflow, connecting it to your systems (CRM, database, APIs), and adding authentication, input sanitization, and rate limits.',
        },
        {
          title: 'Measurement and tuning',
          description: 'Usage dashboard, reading real conversations, and tuning prompts, caching, and human-escalation paths against production data.',
        },
      ],
      forWhom: [
        'Support or sales teams answering the same set of questions every day.',
        'Operations with repetitive, well-defined processes that are still done by hand.',
        'Businesses with useful internal documentation that nobody finds in time.',
      ],
      notFor: [
        'Not for anyone who wants the system to give the final ruling on a legal, medical, or financial matter. An LLM gets things wrong, and there the cost lands on your client: a person signs that answer, or I do not build the flow.',
        'Not for processes that are not documented yet. Automating a confused process only makes it confused faster and harder to correct.',
      ],
      icon: Bot,
      faq: [
        {
          question: 'Can the chatbot connect with my CRM or database?',
          answer: 'Yes. I design integrations with HubSpot, Salesforce, Firestore, PostgreSQL, and REST/GraphQL APIs. The chatbot can query and write data to your systems securely.',
        },
        {
          question: 'How secure is the implementation?',
          answer: 'Security is a design principle, not an add-on. I implement JWT authentication, input sanitization, rate limiting, and sensitive information is never sent directly to the LLM without preprocessing.',
        },
        {
          question: 'How much does it cost to maintain an AI chatbot?',
          answer: 'Operational costs depend on conversation volume and the AI model used. I design architectures that optimize token usage with caching and precomputed responses to keep costs low without sacrificing quality.',
        },
      ],
    },
    {
      id: 'dashboards',
      route: 'dashboards',
      title: 'Responsive Dashboards',
      headline: 'Interactive, data-driven dashboards for your platform',
      description: 'I design and develop responsive dashboards that turn data into decisions. Clean interfaces, interactive visualizations, and performance-optimized architecture — connected to your data sources in real time.',
      benefits: [
        'Clear data visualization with interactive charts',
        'Responsive design that works on any device',
        'Real-time connection to your data sources (APIs, SQL, Firebase)',
      ],
      outcomes: [
        'One screen with the metrics your team actually decides on, instead of seven reports nobody opens.',
        'The numbers come from the data source, not from a manual export someone pastes in every Monday.',
        'Every metric has a written definition, so two departments stop reporting different figures for the same thing.',
        'It reads well on a phone, which is where it actually gets checked.',
      ],
      includes: [
        'Data source audit and requirements gathering',
        'Dashboard UX/UI design with wireframes',
        'Frontend development with React/Next.js and charting libraries',
        'Integration with APIs, databases, and cloud services',
        'Performance optimization and data loading',
        'Responsive design and cross-browser testing',
      ],
      process: [
        {
          title: 'Define the questions',
          description: 'Before choosing charts, we define which decisions the dashboard has to support and which metrics answer them, each with its formula written down.',
        },
        {
          title: 'Source audit',
          description: 'We check where the data comes from, how often it refreshes, and how trustworthy it is. This is where most of the surprises in a data project show up.',
        },
        {
          title: 'Design and build',
          description: 'Wireframes, visual hierarchy, and development with React/Next.js, with data loading arranged so the first view is fast and the rest arrives progressively.',
        },
        {
          title: 'Handover and extension',
          description: 'Cross-browser testing, documentation for every metric, and a modular structure so adding one new card does not mean rebuilding the dashboard.',
        },
      ],
      forWhom: [
        'Teams that already have data and lack a shared view to act on it.',
        'SaaS platforms that need to offer an analytics panel to their own customers.',
        'Operations that currently depend on a spreadsheet only one person knows how to update.',
      ],
      notFor: [
        'Not for anyone who is not collecting the data yet. If the information does not exist or cannot be trusted, instrumentation comes first; visualizing early just produces wrong charts in better typography.',
        'It does not replace a BI platform with organization-wide data modelling and governance. If that is what you need, a custom dashboard is the wrong tool.',
      ],
      icon: BarChart3,
      faq: [
        {
          question: 'What visualization libraries do you use?',
          answer: 'I work with Recharts, D3.js, Chart.js, and Plotly depending on project needs. For BI dashboards I also have experience with Power BI and DAX for complex queries.',
        },
        {
          question: 'Can the dashboard consume real-time data?',
          answer: 'Yes. I implement WebSocket connections, Firestore real-time listeners, and optimized polling. The architecture is designed so data updates without page reloads.',
        },
        {
          question: 'Can I add new metrics later?',
          answer: 'Absolutely. I design dashboards with modular architecture: adding new cards, charts, or sections is as simple as configuring a new component. The data structure is extensible by design.',
        },
      ],
    },
  ],
}

export function getServices(locale: Locale): Service[] {
  return forLocale(servicesData, locale)
}

/** Stable, locale-independent lookup. Prefer this over matching on a title. */
export function getServiceById(locale: Locale, id: ServiceId): Service | undefined {
  return getServices(locale).find((s) => s.id === id)
}

/**
 * Lookup by route key — the way a service page should fetch its own copy,
 * so the page and its schema read from one record instead of a local literal.
 */
export function getServiceByRoute(locale: Locale, route: RouteKey): Service | undefined {
  return getServices(locale).find((s) => s.route === route)
}

/** Locale-relative path for a service, e.g. `/desarrollo-web`. */
export function servicePath(service: Service, locale: Locale): string {
  return routePath(service.route, locale)
}

/** Absolute URL for a service — use for canonical, `url`, and schema `@id`. */
export function serviceUrl(service: Service, locale: Locale): string {
  return routeUrl(service.route, locale)
}
