import { Globe, Bot, BarChart3, type LucideIcon } from 'lucide-react'
import { Locale } from './types'

export interface Service {
  id: string
  slug: string
  title: string
  headline: string
  description: string
  benefits: string[]
  includes: string[]
  icon: LucideIcon
  faq: { question: string; answer: string }[]
}

const servicesData: Record<Locale, Service[]> = {
  es: [
    {
      id: 'nextjs-firebase',
      slug: 'aplicaciones-web-nextjs-firebase',
      title: 'Aplicaciones Web con Next.js y Firebase',
      headline: 'Desarrollo de aplicaciones web modernas, rápidas e indexables',
      description: 'Construyo aplicaciones web de alto rendimiento con Next.js y Firebase — optimizadas para SEO técnico, Core Web Vitals y escalabilidad. Desde landing pages hasta plataformas SaaS completas con SSR/ISR, autenticación y base de datos en tiempo real.',
      benefits: [
        'Rendimiento Lighthouse 90+ en performance, SEO y accesibilidad',
        'SSR/ISR para indexación instantánea y contenido siempre fresco',
        'Backend serverless con Firebase: Firestore, Auth, Functions y Hosting',
      ],
      includes: [
        'Arquitectura de información y wireframes',
        'Desarrollo frontend con Next.js App Router + TypeScript',
        'Integración con Firebase (Firestore, Auth, Cloud Functions)',
        'SEO técnico: sitemap, robots, hreflang, Schema JSON-LD',
        'Optimización de Core Web Vitals y performance',
        'Despliegue en Vercel con CI/CD configurado',
      ],
      icon: Globe,
      faq: [
        {
          question: '¿Cuánto tiempo toma desarrollar una aplicación web con Next.js?',
          answer: 'Depende de la complejidad. Una landing page optimizada puede estar lista en 1-2 semanas. Una plataforma con autenticación, dashboard y base de datos toma entre 4-8 semanas. Siempre empiezo con una auditoría técnica para definir alcance y entregables.',
        },
        {
          question: '¿Por qué Next.js y no otro framework?',
          answer: 'Next.js ofrece la mejor combinación de rendimiento, SEO y experiencia de desarrollo. Su sistema de renderizado híbrido (SSR/SSG/ISR) permite que cada página se sirva de la forma más eficiente para Google y para el usuario. Además, su ecosistema con Vercel garantiza despliegues rápidos y confiables.',
        },
        {
          question: '¿Puedo migrar mi sitio actual a Next.js?',
          answer: 'Sí. Realizo migraciones desde WordPress, React SPA, Angular y otros frameworks. El proceso incluye auditoría SEO previa, mapeo de URLs, redirecciones 301 y validación post-migración para no perder posicionamiento orgánico.',
        },
      ],
    },
    {
      id: 'ai-automation',
      slug: 'automatizacion-ia-chatbots',
      title: 'Automatización con IA y Chatbots',
      headline: 'Chatbots inteligentes y automatización de procesos con IA',
      description: 'Creo soluciones de automatización con inteligencia artificial para tu negocio: chatbots con LLMs (GPT, Gemini), flujos automatizados, integración de APIs y sistemas de procesamiento inteligente que reducen costos operativos y mejoran la experiencia del cliente.',
      benefits: [
        'Chatbots con contexto y memoria que entienden tu negocio',
        'Integración segura con tus sistemas existentes (CRM, ERP, APIs)',
        'ROI operacional medible: menos tiempo manual, más eficiencia',
      ],
      includes: [
        'Análisis de procesos automatizables y viabilidad',
        'Diseño de flujos conversacionales y prompts dinámicos',
        'Desarrollo de chatbot con integración LLM (GPT/Gemini)',
        'Integración con APIs y sistemas internos',
        'Panel de monitoreo y métricas de uso',
        'Documentación técnica y capacitación',
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
      slug: 'dashboards-responsivos',
      title: 'Dashboards Responsivos',
      headline: 'Dashboards interactivos y data-driven para tu plataforma',
      description: 'Diseño y desarrollo dashboards responsivos que transforman datos en decisiones. Interfaces limpias, visualizaciones interactivas y arquitectura optimizada para performance — conectados a tus fuentes de datos en tiempo real.',
      benefits: [
        'Visualización de datos clara con gráficas interactivas',
        'Diseño responsivo que funciona en cualquier dispositivo',
        'Conexión en tiempo real con tus fuentes de datos (APIs, SQL, Firebase)',
      ],
      includes: [
        'Auditoría de fuentes de datos y requerimientos',
        'Diseño UX/UI del dashboard con wireframes',
        'Desarrollo frontend con React/Next.js y librerías de gráficas',
        'Integración con APIs, bases de datos y servicios cloud',
        'Optimización de rendimiento y carga de datos',
        'Responsive design y pruebas cross-browser',
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
      id: 'nextjs-firebase',
      slug: 'modern-web-apps-nextjs-firebase',
      title: 'Modern Web Apps with Next.js & Firebase',
      headline: 'Fast, indexable, modern web application development',
      description: 'I build high-performance web applications with Next.js and Firebase — optimized for technical SEO, Core Web Vitals, and scalability. From landing pages to full SaaS platforms with SSR/ISR, authentication, and real-time database.',
      benefits: [
        'Lighthouse 90+ scores in performance, SEO, and accessibility',
        'SSR/ISR for instant indexation and always-fresh content',
        'Serverless backend with Firebase: Firestore, Auth, Functions & Hosting',
      ],
      includes: [
        'Information architecture and wireframes',
        'Frontend development with Next.js App Router + TypeScript',
        'Firebase integration (Firestore, Auth, Cloud Functions)',
        'Technical SEO: sitemap, robots, hreflang, Schema JSON-LD',
        'Core Web Vitals and performance optimization',
        'Vercel deployment with CI/CD configured',
      ],
      icon: Globe,
      faq: [
        {
          question: 'How long does it take to build a web app with Next.js?',
          answer: 'It depends on complexity. An optimized landing page can be ready in 1-2 weeks. A platform with authentication, dashboard, and database takes 4-8 weeks. I always start with a technical audit to define scope and deliverables.',
        },
        {
          question: 'Why Next.js and not another framework?',
          answer: 'Next.js offers the best combination of performance, SEO, and developer experience. Its hybrid rendering system (SSR/SSG/ISR) ensures each page is served in the most efficient way for Google and users. Plus, its ecosystem with Vercel guarantees fast, reliable deployments.',
        },
        {
          question: 'Can you migrate my current site to Next.js?',
          answer: 'Yes. I handle migrations from WordPress, React SPAs, Angular, and other frameworks. The process includes a pre-migration SEO audit, URL mapping, 301 redirects, and post-migration validation to preserve organic rankings.',
        },
      ],
    },
    {
      id: 'ai-automation',
      slug: 'ai-automation-chatbots',
      title: 'AI Automation & Chatbots',
      headline: 'Intelligent chatbots and AI-powered process automation',
      description: 'I create AI automation solutions for your business: chatbots powered by LLMs (GPT, Gemini), automated workflows, API integrations, and intelligent processing systems that reduce operational costs and improve customer experience.',
      benefits: [
        'Context-aware chatbots that understand your business',
        'Secure integration with your existing systems (CRM, ERP, APIs)',
        'Measurable operational ROI: less manual work, more efficiency',
      ],
      includes: [
        'Automatable process analysis and feasibility study',
        'Conversational flow and dynamic prompt design',
        'Chatbot development with LLM integration (GPT/Gemini)',
        'Integration with APIs and internal systems',
        'Monitoring dashboard and usage metrics',
        'Technical documentation and training',
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
      slug: 'responsive-dashboards',
      title: 'Responsive Dashboards',
      headline: 'Interactive, data-driven dashboards for your platform',
      description: 'I design and develop responsive dashboards that turn data into decisions. Clean interfaces, interactive visualizations, and performance-optimized architecture — connected to your data sources in real time.',
      benefits: [
        'Clear data visualization with interactive charts',
        'Responsive design that works on any device',
        'Real-time connection to your data sources (APIs, SQL, Firebase)',
      ],
      includes: [
        'Data source audit and requirements gathering',
        'Dashboard UX/UI design with wireframes',
        'Frontend development with React/Next.js and charting libraries',
        'Integration with APIs, databases, and cloud services',
        'Performance optimization and data loading',
        'Responsive design and cross-browser testing',
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
  return servicesData[locale] ?? servicesData.es
}

export function getServiceBySlug(locale: Locale, slug: string): Service | undefined {
  return getServices(locale).find((s) => s.slug === slug)
}
