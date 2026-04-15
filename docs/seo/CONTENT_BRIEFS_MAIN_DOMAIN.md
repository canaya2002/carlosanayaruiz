# Content Briefs -- carlosanayaruiz.com Blog

> 12 briefs editoriales organizados en 4 clusters tematicos.
> Objetivo: construir autoridad tematica en SEO tecnico, rendimiento web, datos estructurados y desarrollo moderno.
> Todos los articulos se publican en `/es/blog/[slug]` con version en ingles en `/en/blog/[slug]`.

---

## Indice de briefs

| # | Titulo | Cluster | Keyword principal | Prioridad |
|---|--------|---------|-------------------|-----------|
| 1 | Guia de SEO tecnico en Next.js App Router (2026) | SEO Tecnico en Next.js | seo tecnico next.js | 1 |
| 2 | Como generar sitemap.xml y robots.txt programaticos en Next.js | SEO Tecnico en Next.js | sitemap next.js |1 |
| 3 | Hreflang en Next.js: SEO internacional paso a paso | SEO Tecnico en Next.js | hreflang next.js | 2 |
| 4 | Errores de indexacion en Next.js y como resolverlos | SEO Tecnico en Next.js | indexacion next.js | 2 |
| 5 | Core Web Vitals en 2026: guia practica para desarrolladores | Core Web Vitals y Rendimiento | core web vitals guia | 1 |
| 6 | Como optimizar LCP, INP y CLS en proyectos Next.js | Core Web Vitals y Rendimiento | optimizar core web vitals next.js | 1 |
| 7 | React Server Components y su impacto en el rendimiento web | Core Web Vitals y Rendimiento | react server components rendimiento | 2 |
| 8 | Guia completa de Schema.org JSON-LD para sitios en Next.js | Datos Estructurados / Schema.org | schema.org json-ld next.js | 1 |
| 9 | Schemas avanzados: FAQPage, HowTo y Service para captar rich snippets | Datos Estructurados / Schema.org | rich snippets schema.org | 2 |
| 10 | Como validar y depurar datos estructurados antes de lanzar a produccion | Datos Estructurados / Schema.org | validar datos estructurados | 3 |
| 11 | SSR vs SSG vs ISR en Next.js App Router: cuando usar cada estrategia | Desarrollo Web Moderno | ssr vs ssg vs isr next.js | 2 |
| 12 | Arquitectura de informacion para sitios web: del keyword research a la estructura de carpetas | Desarrollo Web Moderno | arquitectura de informacion web | 2 |

---

## Brief 1 -- Guia de SEO tecnico en Next.js App Router (2026)

- **Titulo propuesto:** Guia de SEO tecnico en Next.js App Router (2026)
- **URL slug propuesto:** `/es/blog/seo-tecnico-next-js-app-router`
- **Keyword principal:** seo tecnico next.js
- **Keywords secundarias:** seo next.js app router, next.js seo best practices, optimizacion seo next.js, metadata next.js, generateMetadata next.js, seo para react, seo next.js 14 15, next.js seo guia espanol
- **Intencion de busqueda:** Informacional -- desarrolladores y consultores que quieren configurar correctamente el SEO tecnico en un proyecto Next.js con App Router.
- **Longitud estimada:** 2 800 - 3 200 palabras
- **Prioridad:** 1

### Estructura de contenido

- H2: Que es el SEO tecnico y por que Next.js lo facilita (y lo complica)
  - H3: Diferencias clave entre Pages Router y App Router para SEO
  - H3: Lo que Googlebot realmente puede renderizar en 2026
- H2: Configuracion de metadata con `generateMetadata`
  - H3: Metadata estatica vs metadata dinamica
  - H3: Open Graph, Twitter Cards y canonical automatico
- H2: Sitemap y robots.txt programaticos
  - H3: Generar `sitemap.ts` con todas las rutas del sitio
  - H3: `robots.ts` y control de rastreo por entorno (preview vs produccion)
- H2: Renderizado y rastreabilidad
  - H3: SSR, SSG e ISR desde la perspectiva de Googlebot
  - H3: Streaming con Suspense: que se indexa y que no
- H2: Internacionalizacion (i18n) y hreflang en App Router
- H2: Los 10 errores de SEO tecnico mas comunes en Next.js
- H2: Checklist final de SEO tecnico para Next.js App Router

### Enlazado interno

- /seo-tecnico (enlazar como referencia del servicio profesional de auditoria)
- /desarrollo-web (en la seccion de renderizado, como servicio complementario)
- /contacto (CTA final: "Necesitas una auditoria de SEO tecnico para tu proyecto Next.js?")
- Brief 2 (enlace cruzado al publicarse: sitemap y robots)
- Brief 8 (enlace cruzado al publicarse: datos estructurados)

---

## Brief 2 -- Como generar sitemap.xml y robots.txt programaticos en Next.js

- **Titulo propuesto:** Como generar sitemap.xml y robots.txt programaticos en Next.js
- **URL slug propuesto:** `/es/blog/sitemap-robots-txt-next-js`
- **Keyword principal:** sitemap next.js
- **Keywords secundarias:** robots.txt next.js, sitemap.ts next.js, generar sitemap programatico, sitemap xml next.js app router, robots.ts next.js, sitemap multiidioma next.js, google search console sitemap
- **Intencion de busqueda:** Informacional/Tutorial -- desarrolladores que necesitan implementar sitemap y robots.txt en un proyecto Next.js sin plugins.
- **Longitud estimada:** 1 800 - 2 200 palabras
- **Prioridad:** 1

### Estructura de contenido

- H2: Por que generar sitemap y robots.txt desde codigo (no desde un plugin)
- H2: Crear `sitemap.ts` en Next.js App Router
  - H3: Estructura basica con `MetadataRoute.Sitemap`
  - H3: Agregar rutas dinamicas con `generateStaticParams`
  - H3: Sitemap multiidioma con alternates y hreflang
  - H3: Sitemap index para sitios grandes (>50K URLs)
- H2: Crear `robots.ts` en Next.js App Router
  - H3: Bloquear entornos de preview y staging
  - H3: Configurar reglas por user-agent
  - H3: Apuntar al sitemap desde robots.txt
- H2: Enviar el sitemap a Google Search Console y Bing Webmaster Tools
- H2: Errores comunes y como diagnosticarlos
  - H3: Sitemap que devuelve 404 en produccion
  - H3: URLs duplicadas con y sin trailing slash
  - H3: Sitemap que no se actualiza despues de un deploy
- H2: Codigo completo del ejemplo (repositorio)

### Enlazado interno

- /seo-tecnico (el sitemap es parte del servicio de auditoria SEO)
- /contacto (CTA: "Quieres que configure tu sitemap y robots.txt de forma profesional?")
- Brief 1 (enlace cruzado: guia general de SEO tecnico en Next.js)
- Brief 3 (enlace cruzado al publicarse: hreflang, que impacta en el sitemap multiidioma)

---

## Brief 3 -- Hreflang en Next.js: SEO internacional paso a paso

- **Titulo propuesto:** Hreflang en Next.js: SEO internacional paso a paso
- **URL slug propuesto:** `/es/blog/hreflang-next-js-seo-internacional`
- **Keyword principal:** hreflang next.js
- **Keywords secundarias:** hreflang implementacion, seo internacional next.js, seo multiidioma, etiqueta hreflang errores, hreflang espanol ingles, internacionalizacion next.js, next-intl hreflang, x-default hreflang
- **Intencion de busqueda:** Informacional -- desarrolladores y consultores SEO que necesitan implementar hreflang correctamente en sitios Next.js multiidioma.
- **Longitud estimada:** 2 200 - 2 600 palabras
- **Prioridad:** 2

### Estructura de contenido

- H2: Que es hreflang y por que es critico para sitios multiidioma
  - H3: El problema del contenido duplicado internacional
  - H3: Como Google usa hreflang para servir la version correcta
- H2: Reglas de hreflang que no puedes ignorar
  - H3: Codigos ISO 639-1 (idioma) e ISO 3166-1 (region)
  - H3: El atributo x-default y cuando usarlo
  - H3: La regla de reciprocidad bidireccional
- H2: Tres metodos de implementacion (y cual conviene en Next.js)
  - H3: Etiquetas `<link>` en `<head>` via `generateMetadata`
  - H3: HTTP headers (para PDFs y archivos no-HTML)
  - H3: Sitemap XML con `<xhtml:link>`
- H2: Implementacion practica con next-intl y App Router
  - H3: Configurar middleware de deteccion de idioma
  - H3: Generar hreflang automatico en `generateMetadata` con alternates
  - H3: Sitemap multiidioma con `sitemap.ts`
- H2: Caso real: carlosanayaruiz.com (ES/EN)
  - H3: Arquitectura de rutas `/es/` y `/en/`
  - H3: Codigo exacto del sitemap y metadata
- H2: Validacion y debugging
  - H3: Herramientas para auditar hreflang
  - H3: Los 5 errores de hreflang que veo en cada auditoria
- H2: Hreflang y otros factores de SEO internacional (canonicals, geotargeting)

### Enlazado interno

- /seo-tecnico (servicio profesional que incluye auditorias de internacionalizacion)
- /contacto (CTA: "Tu sitio multiidioma no esta bien posicionado? Puedo auditar tu implementacion de hreflang.")
- Brief 1 (enlace cruzado: guia general de SEO tecnico en Next.js)
- Brief 2 (enlace cruzado: sitemap multiidioma)

---

## Brief 4 -- Errores de indexacion en Next.js y como resolverlos

- **Titulo propuesto:** Errores de indexacion en Next.js y como resolverlos
- **URL slug propuesto:** `/es/blog/errores-indexacion-next-js`
- **Keyword principal:** indexacion next.js
- **Keywords secundarias:** problemas indexacion next.js, google no indexa mi sitio next.js, next.js seo indexacion, noindex next.js, crawl budget next.js, google search console errores, javascript seo indexacion, next.js paginas no indexadas
- **Intencion de busqueda:** Informacional/Problema -- desarrolladores que detectan que Google no indexa correctamente su sitio Next.js y buscan soluciones.
- **Longitud estimada:** 2 000 - 2 500 palabras
- **Prioridad:** 2

### Estructura de contenido

- H2: Como Google rastrea e indexa aplicaciones Next.js en 2026
  - H3: Rendering budget y JavaScript rendering service de Google
  - H3: Diferencia entre "rastreado" e "indexado"
- H2: Los 8 problemas de indexacion mas frecuentes en Next.js
  - H3: Paginas bloqueadas por robots.txt sin querer
  - H3: Noindex accidental en entornos de preview (Vercel previews)
  - H3: Contenido renderizado solo en cliente (useEffect sin SSR)
  - H3: Soft 404s en rutas dinamicas sin datos
  - H3: Canonical incorrecto o apuntando a la URL equivocada
  - H3: Paginas demasiado lentas para el crawl budget
  - H3: JavaScript errors que impiden el renderizado
  - H3: Paginacion infinita sin enlaces HTML rastreables
- H2: Como diagnosticar problemas de indexacion
  - H3: Google Search Console: informe de indexacion y cobertura
  - H3: URL Inspection Tool y "Ver pagina renderizada"
  - H3: Screaming Frog con renderizado JavaScript
- H2: Soluciones tecnicas en Next.js
  - H3: Forzar SSR o SSG para paginas criticas
  - H3: Configurar canonical correcto con `generateMetadata`
  - H3: Evitar que Vercel preview deployments se indexen
- H2: Checklist de indexacion para proyectos Next.js

### Enlazado interno

- /seo-tecnico (servicio de auditoria de indexacion)
- /desarrollo-web (al mencionar la arquitectura de renderizado)
- /contacto (CTA: "Google no esta indexando tu sitio correctamente? Solicita un diagnostico.")
- Brief 1 (enlace cruzado: guia general de SEO tecnico)
- Brief 2 (enlace cruzado: robots.txt y sitemap)

---

## Brief 5 -- Core Web Vitals en 2026: guia practica para desarrolladores

- **Titulo propuesto:** Core Web Vitals en 2026: guia practica para desarrolladores
- **URL slug propuesto:** `/es/blog/core-web-vitals-guia-desarrolladores`
- **Keyword principal:** core web vitals guia
- **Keywords secundarias:** core web vitals que es, mejorar core web vitals, lcp inp cls, inp core web vitals, web performance optimization, metricas rendimiento web, core web vitals 2026, page experience signal google
- **Intencion de busqueda:** Informacional -- desarrolladores y consultores que necesitan entender las metricas actualizadas de Core Web Vitals y como medirlas.
- **Longitud estimada:** 2 600 - 3 000 palabras
- **Prioridad:** 1

### Estructura de contenido

- H2: Que son los Core Web Vitals (actualizacion 2026)
  - H3: LCP (Largest Contentful Paint): que mide y umbrales actuales
  - H3: INP (Interaction to Next Paint): el reemplazo de FID
  - H3: CLS (Cumulative Layout Shift): estabilidad visual
- H2: Como afectan los Core Web Vitals al posicionamiento en Google
  - H3: Page Experience como factor de ranking: lo que dice Google realmente
  - H3: La relacion entre rendimiento y tasa de conversion
- H2: Como medir Core Web Vitals correctamente
  - H3: Datos de campo: Chrome UX Report (CrUX), PageSpeed Insights, Search Console
  - H3: Datos de laboratorio: Lighthouse, WebPageTest, Chrome DevTools
  - H3: Monitoreo continuo: Vercel Speed Insights, web-vitals library
  - H3: Por que los datos de campo y laboratorio no coinciden
- H2: Umbrales y objetivos realistas para cada metrica
- H2: Casos reales: antes y despues de optimizar Core Web Vitals
  - H3: Ejemplo 1: sitio e-commerce con LCP de 6.2s reducido a 1.8s
  - H3: Ejemplo 2: blog con CLS de 0.45 corregido a 0.02
- H2: Herramientas que uso en mis auditorias de rendimiento

### Enlazado interno

- /seo-tecnico (Core Web Vitals es parte central del servicio de SEO tecnico)
- /desarrollo-web (la optimizacion de rendimiento es parte del servicio de desarrollo)
- /contacto (CTA: "Tu sitio no pasa las metricas de Core Web Vitals? Puedo diagnosticar y resolver los problemas.")
- Brief 6 (enlace cruzado al publicarse: optimizacion especifica en Next.js)
- Brief 1 (enlace cruzado: SEO tecnico general)

---

## Brief 6 -- Como optimizar LCP, INP y CLS en proyectos Next.js

- **Titulo propuesto:** Como optimizar LCP, INP y CLS en proyectos Next.js
- **URL slug propuesto:** `/es/blog/optimizar-lcp-inp-cls-next-js`
- **Keyword principal:** optimizar core web vitals next.js
- **Keywords secundarias:** mejorar lcp next.js, optimizar inp next.js, reducir cls next.js, next/image optimizacion, next.js font optimization, next.js performance, next.js lazy loading, react server components rendimiento
- **Intencion de busqueda:** Informacional/Tutorial -- desarrolladores con un proyecto Next.js que necesitan mejorar metricas especificas de Core Web Vitals.
- **Longitud estimada:** 2 800 - 3 200 palabras
- **Prioridad:** 1

### Estructura de contenido

- H2: Estrategias para mejorar LCP en Next.js
  - H3: Optimizacion de imagenes con `next/image`: sizes, priority, formatos modernos
  - H3: Font loading con `next/font` y eliminacion de FOUT
  - H3: Preload de recursos criticos y CSS above-the-fold
  - H3: Reducir el TTFB con edge runtime y caching
- H2: Estrategias para mejorar INP en Next.js
  - H3: React Server Components: menos JavaScript en el cliente
  - H3: Code splitting y dynamic imports con `next/dynamic`
  - H3: Debounce y throttle en event handlers pesados
  - H3: Web Workers para operaciones intensivas
- H2: Estrategias para mejorar CLS en Next.js
  - H3: Reservar espacio para imagenes y embeds (aspect-ratio, width/height)
  - H3: Evitar inyeccion de contenido sobre el fold
  - H3: Fuentes web con `font-display: swap` vs `font-display: optional`
  - H3: Ads y contenido dinamico: patrones para evitar layout shift
- H2: Script de monitoreo: medir Core Web Vitals en produccion con la libreria web-vitals
- H2: Antes y despues: optimizacion de carlosanayaruiz.com
  - H3: Metricas iniciales y decisiones tomadas
  - H3: Resultados despues de cada cambio
- H2: Tabla resumen: accion -> metrica impactada -> esfuerzo -> impacto

### Enlazado interno

- /seo-tecnico (la optimizacion de rendimiento impacta directamente el SEO)
- /desarrollo-web (servicio donde se implementan estas optimizaciones)
- /contacto (CTA: "Quieres que optimice el rendimiento de tu proyecto Next.js?")
- Brief 5 (enlace cruzado: guia general de Core Web Vitals)
- Brief 7 (enlace cruzado al publicarse: React Server Components y rendimiento)

---

## Brief 7 -- React Server Components y su impacto en el rendimiento web

- **Titulo propuesto:** React Server Components y su impacto en el rendimiento web
- **URL slug propuesto:** `/es/blog/react-server-components-rendimiento`
- **Keyword principal:** react server components rendimiento
- **Keywords secundarias:** react server components que es, rsc next.js, server components vs client components, use client next.js, react server components bundle size, react server components seo, next.js app router server components, server components streaming
- **Intencion de busqueda:** Informacional -- desarrolladores que quieren entender como React Server Components afectan el rendimiento y el SEO de sus aplicaciones.
- **Longitud estimada:** 2 000 - 2 400 palabras
- **Prioridad:** 2

### Estructura de contenido

- H2: Que son los React Server Components y como funcionan
  - H3: El modelo mental: servidor vs cliente en App Router
  - H3: "use client" no significa "solo cliente": aclararando la confusion
- H2: Impacto en el bundle de JavaScript enviado al navegador
  - H3: Cuanto JavaScript se ahorra realmente (mediciones)
  - H3: Comparativa: pagina con y sin Server Components
- H2: Impacto en Core Web Vitals
  - H3: LCP: renderizado mas rapido en el servidor
  - H3: INP: menos JavaScript = menos bloqueo del hilo principal
  - H3: CLS: sin efecto directo, pero hay patrones que ayudan
- H2: Impacto en SEO y rastreabilidad
  - H3: Contenido pre-renderizado vs contenido generado en cliente
  - H3: Streaming y Suspense: que indexa Google
- H2: Patrones practicos para maximizar el rendimiento con RSC
  - H3: Mover fetching de datos al servidor
  - H3: Mantener interactividad en componentes `"use client"` pequenos y acotados
  - H3: Evitar serializar datos innecesarios al cliente
- H2: Cuando SI usar "use client" (y por que no es un problema)
- H2: Ejemplo practico: refactorizar un componente de cliente a servidor

### Enlazado interno

- /desarrollo-web (React Server Components es una tecnologia central del servicio)
- /seo-tecnico (enlazar al hablar del impacto en rastreabilidad e indexacion)
- /contacto (CTA: "Necesitas optimizar la arquitectura de componentes de tu aplicacion Next.js?")
- Brief 5 (enlace cruzado: Core Web Vitals general)
- Brief 6 (enlace cruzado: optimizacion de metricas en Next.js)
- Brief 11 (enlace cruzado al publicarse: SSR vs SSG vs ISR)

---

## Brief 8 -- Guia completa de Schema.org JSON-LD para sitios en Next.js

- **Titulo propuesto:** Guia completa de Schema.org JSON-LD para sitios en Next.js
- **URL slug propuesto:** `/es/blog/schema-org-json-ld-next-js`
- **Keyword principal:** schema.org json-ld next.js
- **Keywords secundarias:** datos estructurados next.js, json-ld next.js, rich snippets next.js, schema markup react, structured data next.js app router, implementar json-ld, schema.org guia espanol, datos estructurados google
- **Intencion de busqueda:** Informacional/Tutorial -- desarrolladores y consultores SEO que quieren implementar datos estructurados en proyectos Next.js.
- **Longitud estimada:** 2 600 - 3 000 palabras
- **Prioridad:** 1

### Estructura de contenido

- H2: Que son los datos estructurados y por que Google los necesita
  - H3: Rich snippets, Knowledge Graph y ventajas en SERP
  - H3: JSON-LD vs Microdata vs RDFa: por que JSON-LD es el estandar
- H2: Implementacion basica en Next.js App Router
  - H3: Inyectar JSON-LD con `<script type="application/ld+json">`
  - H3: Componente reutilizable de JSON-LD con tipado TypeScript
  - H3: Generar schemas dinamicos con datos de la pagina
- H2: Los 6 schemas que todo sitio profesional necesita
  - H3: Organization / Person (entidad principal del sitio)
  - H3: WebSite (con SearchAction para sitelinks search box)
  - H3: WebPage (para cada pagina)
  - H3: BreadcrumbList (navegacion)
  - H3: Article / BlogPosting (para el blog)
  - H3: Service (para paginas de servicio)
- H2: Graph de schemas: como conectar multiples entidades en un solo bloque JSON-LD
  - H3: El patron @graph y el uso de @id para referencias cruzadas
  - H3: Ejemplo completo: graph de carlosanayaruiz.com
- H2: Validacion con Google Rich Results Test y Schema.org Validator
  - H3: Diferencia entre errores, advertencias y elementos mejorados
- H2: Errores frecuentes de datos estructurados (y sus correcciones)

### Enlazado interno

- /seo-tecnico (los datos estructurados son parte central del servicio de SEO tecnico)
- /sobre-mi (enlazar como ejemplo de schema Person/ProfilePage)
- /contacto (CTA: "Quieres que implemente datos estructurados en tu sitio? Hablemos.")
- Brief 1 (enlace cruzado: guia general de SEO tecnico en Next.js)
- Brief 9 (enlace cruzado al publicarse: schemas avanzados)

---

## Brief 9 -- Schemas avanzados: FAQPage, HowTo y Service para captar rich snippets

- **Titulo propuesto:** Schemas avanzados: FAQPage, HowTo y Service para captar rich snippets
- **URL slug propuesto:** `/es/blog/schemas-avanzados-faqpage-howto-service`
- **Keyword principal:** rich snippets schema.org
- **Keywords secundarias:** schema faqpage, schema howto, schema service, rich snippets google, datos estructurados avanzados, faq schema next.js, howto schema markup, schema para servicios profesionales, snippets enriquecidos
- **Intencion de busqueda:** Informacional/Tutorial -- consultores SEO y desarrolladores que ya entienden lo basico de Schema.org y quieren implementar schemas que generan rich snippets visibles en las SERP.
- **Longitud estimada:** 2 200 - 2 600 palabras
- **Prioridad:** 2

### Estructura de contenido

- H2: Que schemas generan rich snippets visibles en Google (y cuales no)
  - H3: Lista actualizada de schemas elegibles para rich results en 2026
  - H3: La diferencia entre "elegible" y "garantizado"
- H2: FAQPage: preguntas frecuentes en los resultados de busqueda
  - H3: Estructura del schema y requisitos de Google
  - H3: Implementacion en Next.js con componente reutilizable
  - H3: Cuantas preguntas incluir (y por que mas no siempre es mejor)
- H2: HowTo: tutoriales paso a paso con pasos visibles en SERP
  - H3: Estructura del schema con steps, tools y supplies
  - H3: Implementacion en Next.js para articulos del blog
  - H3: Combinar HowTo con imagenes por paso
- H2: Service: posicionar servicios profesionales en busquedas locales
  - H3: Estructura del schema Service y sus propiedades clave
  - H3: Conectar Service con Organization/Person via @id
  - H3: Ejemplo: schemas de servicio de carlosanayaruiz.com
- H2: Validar y monitorear rich snippets en Search Console
  - H3: Informe de "Mejoras" en Search Console
  - H3: Cuando Google decide mostrar (o dejar de mostrar) un rich snippet
- H2: Errores comunes en schemas avanzados

### Enlazado interno

- /seo-tecnico (servicio profesional donde se implementan estos schemas)
- /contacto (CTA: "Quieres que tus servicios aparezcan con rich snippets en Google?")
- Brief 8 (enlace cruzado: guia basica de Schema.org JSON-LD)
- Brief 10 (enlace cruzado al publicarse: validacion y depuracion)
- Brief 1 (enlace cruzado: SEO tecnico general)

---

## Brief 10 -- Como validar y depurar datos estructurados antes de lanzar a produccion

- **Titulo propuesto:** Como validar y depurar datos estructurados antes de lanzar a produccion
- **URL slug propuesto:** `/es/blog/validar-depurar-datos-estructurados`
- **Keyword principal:** validar datos estructurados
- **Keywords secundarias:** google rich results test, schema validator, errores datos estructurados, depurar json-ld, testing structured data, schema markup validator, datos estructurados errores comunes, structured data testing tool alternativa
- **Intencion de busqueda:** Informacional/Problema -- desarrolladores que ya implementaron datos estructurados y necesitan validar que estan correctos antes de deploy o despues de detectar errores en Search Console.
- **Longitud estimada:** 1 600 - 2 000 palabras
- **Prioridad:** 3

### Estructura de contenido

- H2: Por que validar datos estructurados antes de cada deploy
- H2: Herramientas de validacion (y para que sirve cada una)
  - H3: Google Rich Results Test: elegibilidad para rich snippets
  - H3: Schema.org Validator: conformidad con la especificacion
  - H3: Search Console > Mejoras: datos reales post-indexacion
  - H3: Lighthouse > SEO audit: chequeo automatizado en CI/CD
- H2: Flujo de validacion recomendado (de desarrollo a produccion)
  - H3: Paso 1: validar en local con Schema.org Validator
  - H3: Paso 2: testear la URL de preview con Rich Results Test
  - H3: Paso 3: monitorear en Search Console tras el deploy
- H2: Los 10 errores mas comunes y como corregirlos
  - H3: Campo obligatorio faltante (name, description, etc.)
  - H3: Tipo incorrecto (string donde se esperaba objeto)
  - H3: URLs absolutas vs relativas en @id e image
  - H3: Fechas en formato incorrecto (ISO 8601)
  - H3: Schema que no coincide con el contenido visible de la pagina
- H2: Automatizar la validacion en el pipeline de CI/CD
  - H3: Script con structured-data-testing-tool (npm)
  - H3: Integrar validacion en GitHub Actions o Vercel deploy hooks
- H2: Checklist de validacion pre-deploy

### Enlazado interno

- /seo-tecnico (la validacion de datos estructurados es parte del servicio)
- /contacto (CTA: "Necesitas una auditoria de datos estructurados?")
- Brief 8 (enlace cruzado: guia basica de Schema.org)
- Brief 9 (enlace cruzado: schemas avanzados)

---

## Brief 11 -- SSR vs SSG vs ISR en Next.js App Router: cuando usar cada estrategia

- **Titulo propuesto:** SSR vs SSG vs ISR en Next.js App Router: cuando usar cada estrategia
- **URL slug propuesto:** `/es/blog/ssr-ssg-isr-next-js-app-router`
- **Keyword principal:** ssr vs ssg vs isr next.js
- **Keywords secundarias:** ssr vs ssg, static site generation next.js, server side rendering next.js, incremental static regeneration, cuando usar ssr, cuando usar ssg, next.js app router renderizado, revalidate next.js, generateStaticParams
- **Intencion de busqueda:** Informacional -- desarrolladores que necesitan elegir la estrategia de renderizado correcta para cada pagina de su proyecto Next.js.
- **Longitud estimada:** 2 200 - 2 600 palabras
- **Prioridad:** 2

### Estructura de contenido

- H2: Las tres estrategias de renderizado en Next.js App Router
- H2: Static Site Generation (SSG)
  - H3: Como funciona en App Router (comportamiento por defecto)
  - H3: `generateStaticParams` para rutas dinamicas
  - H3: Ventajas: velocidad maxima, costo cero de servidor, excelente para SEO
  - H3: Limitaciones: contenido que no cambia hasta el proximo build
  - H3: Casos ideales: landing pages, blogs, paginas de servicio
- H2: Incremental Static Regeneration (ISR)
  - H3: `revalidate` basado en tiempo
  - H3: `revalidatePath` y `revalidateTag` para revalidacion on-demand
  - H3: Ventajas: contenido fresco sin sacrificar velocidad
  - H3: Limitaciones: primera visita despues de revalidacion puede ser lenta
  - H3: Casos ideales: e-commerce, directorios, contenido editorial con actualizaciones
- H2: Server-Side Rendering (SSR)
  - H3: `dynamic = 'force-dynamic'` y `no-store` fetch
  - H3: Ventajas: datos siempre frescos, personalizacion por usuario
  - H3: Limitaciones: TTFB mas alto, costo de servidor
  - H3: Casos ideales: dashboards, paginas con datos en tiempo real, contenido personalizado
- H2: Tabla comparativa: SSG vs ISR vs SSR
- H2: Arbol de decision: un diagrama para elegir la estrategia correcta
- H2: Combinar estrategias en un mismo proyecto (y por que es lo normal)

### Enlazado interno

- /desarrollo-web (servicio de desarrollo web donde se toman estas decisiones)
- /seo-tecnico (el renderizado impacta directamente en la rastreabilidad)
- /contacto (CTA: "No tienes claro que estrategia necesita tu proyecto? Puedo asesorarte.")
- Brief 1 (enlace cruzado: SEO tecnico y renderizado)
- Brief 5 (enlace cruzado: Core Web Vitals y rendimiento segun la estrategia)
- Brief 7 (enlace cruzado: React Server Components)

---

## Brief 12 -- Arquitectura de informacion para sitios web: del keyword research a la estructura de carpetas

- **Titulo propuesto:** Arquitectura de informacion para sitios web: del keyword research a la estructura de carpetas
- **URL slug propuesto:** `/es/blog/arquitectura-informacion-sitios-web`
- **Keyword principal:** arquitectura de informacion web
- **Keywords secundarias:** arquitectura de informacion sitio web, estructura web seo, jerarquia de contenido, navegacion web ux, taxonomia web, silos de contenido, arquitectura seo, topic clusters, file-based routing next.js
- **Intencion de busqueda:** Informacional -- consultores SEO, disenadores UX y desarrolladores que quieren organizar la informacion de un sitio para maximizar usabilidad y SEO.
- **Longitud estimada:** 2 400 - 2 800 palabras
- **Prioridad:** 2

### Estructura de contenido

- H2: Que es la arquitectura de informacion y por que es el cimiento del SEO
- H2: Principios fundamentales
  - H3: Jerarquia y profundidad de clics (regla de los 3 clics, mito vs realidad)
  - H3: Agrupacion tematica: topic clusters y paginas pilar
  - H3: Navegacion facetada vs navegacion plana vs navegacion hibrida
- H2: De keyword research a estructura de sitio (proceso paso a paso)
  - H3: Paso 1: investigacion de keywords con intencion de busqueda
  - H3: Paso 2: agrupacion por temas y subtemas
  - H3: Paso 3: mapeo de silos de contenido
  - H3: Paso 4: definicion de URLs y jerarquia de carpetas
- H2: Arquitectura de informacion en Next.js App Router
  - H3: File-based routing como reflejo de la arquitectura conceptual
  - H3: Layouts anidados para mantener consistencia por seccion
  - H3: Breadcrumbs como indicador de jerarquia
- H2: Ejemplo practico: arquitectura de carlosanayaruiz.com
  - H3: Diagrama de la estructura actual
  - H3: Decisiones tomadas y por que
- H2: Errores comunes de arquitectura de informacion
  - H3: URLs demasiado profundas o inconsistentes
  - H3: Paginas huerfanas (sin enlaces internos)
  - H3: Canibalizacion de keywords entre paginas del mismo tema

### Enlazado interno

- /seo-tecnico (la arquitectura es parte fundamental del servicio de SEO tecnico)
- /desarrollo-web (la arquitectura se implementa durante el desarrollo)
- /sobre-mi (enlazar al usar el propio sitio como ejemplo)
- /contacto (CTA: "Necesitas reorganizar la arquitectura de tu sitio?")
- Brief 1 (enlace cruzado: SEO tecnico en Next.js)
- Brief 5 (enlace cruzado: rendimiento y arquitectura)

---

## Notas generales para produccion

1. **Formato de publicacion:** Cada articulo se publica en `/blog/[slug]` dentro de Next.js App Router con soporte bilingue.
2. **Imagenes:** Incluir 2-3 imagenes/diagramas por articulo. Usar `next/image` con alt text descriptivo y dimensiones explicitas.
3. **Codigo:** Los articulos tecnicos deben incluir snippets de codigo funcional, probado y copiable. Indicar version de Next.js donde aplique.
4. **Schema:** Cada articulo debe incluir schema `Article` (o `BlogPosting`) con author, datePublished, dateModified e image.
5. **Actualizacion:** Revisar y actualizar cada articulo cada 6 meses o cuando Next.js publique una version major.
6. **Traduccion:** Producir version en ingles de cada articulo para `/en/blog/`. Publicar la version en ingles 1-2 semanas despues de la version en espanol.
7. **CTA:** Cada articulo debe cerrar con un CTA contextual que enlace a /contacto y mencione el servicio relevante.
8. **Tabla de contenidos:** Incluir TOC automatico al inicio de articulos de mas de 2 000 palabras.
