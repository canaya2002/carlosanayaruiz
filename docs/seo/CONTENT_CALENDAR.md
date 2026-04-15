# Calendario Editorial -- carlosanayaruiz.com Blog

> Plan de publicacion para abril - septiembre 2026.
> Cadencia: 2 articulos por mes. Total: 12 articulos en 6 meses.
> Disenado para un consultor independiente que escribe su propio contenido.

---

## Resumen de la estrategia

| Parametro | Valor |
|-----------|-------|
| Periodo | Abril 2026 -- Septiembre 2026 |
| Total de articulos | 12 |
| Cadencia | 2 publicaciones por mes |
| Dias de publicacion | Martes (semana 2) y Martes (semana 4) |
| Idioma primario | Espanol |
| Version en ingles | Publicar 1-2 semanas despues de la version en espanol |
| Plataforma | Next.js App Router (`/es/blog/[slug]` y `/en/blog/[slug]`) |
| Tiempo estimado por articulo | 6-10 horas (investigacion + redaccion + revision + publicacion) |

---

## Logica de secuenciacion

La secuencia esta disenada con dos criterios:

1. **Primero los pilares, despues los complementarios.** Los articulos de prioridad 1 se publican antes porque son las piezas fundamentales de cada cluster. Los de prioridad 2 y 3 se publican cuando ya existen articulos a los que enlazar.
2. **Alternar clusters.** Cada mes mezcla dos clusters distintos para mantener variedad tematica y evitar periodos largos sin contenido de un cluster.

---

## Calendario mes a mes

### Abril 2026

| Semana | Fecha publicacion | Brief # | Titulo | Cluster |
|--------|-------------------|---------|--------|---------|
| Semana 2 | Martes 14 abril | 1 | Guia de SEO tecnico en Next.js App Router (2026) | SEO Tecnico en Next.js |
| Semana 4 | Martes 28 abril | 8 | Guia completa de Schema.org JSON-LD para sitios en Next.js | Datos Estructurados |

**Logica editorial:** Abrir con los dos articulos pilar mas importantes. El Brief 1 establece la autoridad del cluster principal (SEO tecnico en Next.js) y el Brief 8 abre el cluster de datos estructurados. Ambos son extensos, de prioridad 1 y generan una base solida de contenido enlazable para los articulos siguientes.

**Tiempo estimado de produccion:**
- Semanas 1-2 abril: escribir Brief 1 (articulo pilar, necesita 8-10 horas)
- Semanas 2-3 abril: escribir Brief 8 (6-8 horas)

**Estrategia de promocion:**

| Accion | Canal | Cuando | Detalle |
|--------|-------|--------|---------|
| Post de lanzamiento del blog | LinkedIn | 14 abril | Anunciar el blog con un post que presente el primer articulo. Formato: problema + 3-5 takeaways + enlace. |
| Post del segundo articulo | LinkedIn | 28 abril | Post enfocado en "Por que los datos estructurados importan mas de lo que crees." |
| Newsletter de lanzamiento | Email (Resend/Buttondown) | 14 abril | Primera edicion: introduccion al blog + resumen de ambos articulos. |
| Compartir en comunidades | Reddit r/nextjs, Dev.to | Semana del 14 abril | Compartir el articulo de SEO tecnico en Next.js (alto valor tecnico para la comunidad). |

**Acciones de enlazado interno post-publicacion:**
- Actualizar /seo-tecnico para incluir enlace al Brief 1 ("Lee nuestra guia completa de SEO tecnico en Next.js")
- Actualizar /seo-tecnico para incluir enlace al Brief 8 en la seccion de datos estructurados
- Enlazar Brief 1 -> Brief 8 y viceversa dentro del contenido

**Metricas a rastrear:**

| Metrica | Herramienta | Objetivo abril |
|---------|-------------|----------------|
| Sesiones organicas al blog | Vercel Analytics / GA4 | 50 (mes de lanzamiento, sin historial) |
| Impresiones en Search Console | Google Search Console | 200 |
| Clics desde LinkedIn | LinkedIn post analytics | 30 por post |
| Suscriptores de newsletter | Plataforma de email | 15 nuevos |

---

### Mayo 2026

| Semana | Fecha publicacion | Brief # | Titulo | Cluster |
|--------|-------------------|---------|--------|---------|
| Semana 2 | Martes 12 mayo | 5 | Core Web Vitals en 2026: guia practica para desarrolladores | Core Web Vitals |
| Semana 4 | Martes 26 mayo | 2 | Como generar sitemap.xml y robots.txt programaticos en Next.js | SEO Tecnico en Next.js |

**Logica editorial:** El Brief 5 abre el cluster de Core Web Vitals con la guia conceptual (prioridad 1). El Brief 2 complementa al Brief 1 publicado en abril, profundizando en un aspecto tecnico especifico (sitemap/robots). La combinacion alterna entre un cluster nuevo y uno ya iniciado.

**Tiempo estimado de produccion:**
- Semanas 1-2 mayo: escribir Brief 5 (2 600-3 000 palabras, 8-10 horas)
- Semanas 3-4 mayo: escribir Brief 2 (1 800-2 200 palabras, 5-7 horas, articulo mas corto)
- Semanas 3-4 mayo: traducir al ingles los 2 articulos de abril (3-4 horas por articulo)

**Estrategia de promocion:**

| Accion | Canal | Cuando | Detalle |
|--------|-------|--------|---------|
| Carrusel visual "Que es LCP, INP y CLS" | LinkedIn | 12 mayo | 8-10 slides explicando cada metrica con iconos y umbrales. |
| Post tecnico del Brief 2 | LinkedIn | 26 mayo | Post corto con snippet de codigo del `sitemap.ts`. |
| Newsletter mayo | Email | 12 mayo | Edicion sobre rendimiento web con resumen del Brief 5. |
| Thread de tips | Twitter/X | 13 mayo | Thread "5 cosas que los desarrolladores confunden sobre Core Web Vitals". |

**Acciones de enlazado interno post-publicacion:**
- Actualizar Brief 1 para enlazar al Brief 2 (seccion de sitemap y robots)
- Actualizar /seo-tecnico para enlazar al Brief 5 en la seccion de rendimiento
- Actualizar /desarrollo-web para enlazar al Brief 5 como recurso de optimizacion
- Enlazar Brief 5 -> Brief 1 (SEO tecnico general)
- Enlazar Brief 2 -> Brief 1 y Brief 2 -> Brief 8

**Metricas a rastrear:**

| Metrica | Herramienta | Objetivo mayo |
|---------|-------------|---------------|
| Sesiones organicas al blog | Vercel Analytics / GA4 | 120 |
| Impresiones en Search Console | Google Search Console | 600 |
| Posiciones rastreadas (keywords objetivo) | Search Console / Ahrefs | Primeras apariciones en top 50 |
| Suscriptores de newsletter | Plataforma de email | 30 acumulados |

---

### Junio 2026

| Semana | Fecha publicacion | Brief # | Titulo | Cluster |
|--------|-------------------|---------|--------|---------|
| Semana 2 | Martes 9 junio | 6 | Como optimizar LCP, INP y CLS en proyectos Next.js | Core Web Vitals |
| Semana 4 | Martes 23 junio | 9 | Schemas avanzados: FAQPage, HowTo y Service para captar rich snippets | Datos Estructurados |

**Logica editorial:** El Brief 6 es el companero practico del Brief 5 (publicado en mayo). Juntos forman un par "teoria + practica" dentro del cluster de Core Web Vitals. El Brief 9 avanza el cluster de datos estructurados con schemas que generan resultados visibles en SERP, lo que lo hace un articulo con alto potencial de engagement.

**Tiempo estimado de produccion:**
- Semanas 1-2 junio: escribir Brief 6 (2 800-3 200 palabras, 8-10 horas)
- Semanas 2-3 junio: escribir Brief 9 (2 200-2 600 palabras, 6-8 horas)
- Semanas 3-4 junio: traducir al ingles los 2 articulos de mayo (3-4 horas por articulo)

**Estrategia de promocion:**

| Accion | Canal | Cuando | Detalle |
|--------|-------|--------|---------|
| Post "Antes y despues" | LinkedIn | 9 junio | Compartir capturas de PageSpeed Insights mostrando mejora de metricas. |
| Post de rich snippets | LinkedIn | 23 junio | Captura de un rich snippet real generado con los schemas del articulo. |
| Newsletter junio | Email | 9 junio | Edicion "Optimiza tu Next.js" con Brief 6 + enlace a Brief 5 para contexto. |
| Publicar en Dev.to | Dev.to | Semana del 23 junio | Version condensada del Brief 9 con enlace al original. |

**Acciones de enlazado interno post-publicacion:**
- Actualizar Brief 5 para enlazar al Brief 6 ("Para la implementacion paso a paso en Next.js, lee...")
- Actualizar Brief 8 para enlazar al Brief 9 ("Si ya dominas lo basico, avanza con schemas avanzados...")
- Enlazar Brief 6 -> Brief 5, Brief 6 -> Brief 7 (cuando exista), Brief 6 -> Brief 1
- Enlazar Brief 9 -> Brief 8, Brief 9 -> Brief 1

**Metricas a rastrear:**

| Metrica | Herramienta | Objetivo junio |
|---------|-------------|----------------|
| Sesiones organicas al blog | Vercel Analytics / GA4 | 250 |
| Impresiones en Search Console | Google Search Console | 1 500 |
| Posiciones top 20 para keywords objetivo | Search Console | 3-5 keywords |
| Leads generados (formularios de contacto) | Formulario /contacto | 1-2 |
| Suscriptores de newsletter | Plataforma de email | 50 acumulados |

---

### Julio 2026

| Semana | Fecha publicacion | Brief # | Titulo | Cluster |
|--------|-------------------|---------|--------|---------|
| Semana 2 | Martes 14 julio | 11 | SSR vs SSG vs ISR en Next.js App Router: cuando usar cada estrategia | Desarrollo Web Moderno |
| Semana 4 | Martes 28 julio | 3 | Hreflang en Next.js: SEO internacional paso a paso | SEO Tecnico en Next.js |

**Logica editorial:** El Brief 11 abre el cluster de Desarrollo Web Moderno con un articulo comparativo de alto volumen de busqueda. El Brief 3 completa el sub-cluster de SEO tecnico avanzado (hreflang), que es un tema con intento de busqueda muy especifico y poca competencia en espanol.

**Tiempo estimado de produccion:**
- Semanas 1-2 julio: escribir Brief 11 (2 200-2 600 palabras, 6-8 horas)
- Semanas 2-3 julio: escribir Brief 3 (2 200-2 600 palabras, 6-8 horas)
- Semanas 3-4 julio: traducir al ingles los 2 articulos de junio (3-4 horas por articulo)

**Estrategia de promocion:**

| Accion | Canal | Cuando | Detalle |
|--------|-------|--------|---------|
| Post comparativo con tabla | LinkedIn | 14 julio | Tabla visual SSR vs SSG vs ISR con casos de uso. Formato imagen + texto corto. |
| Post sobre hreflang | LinkedIn | 28 julio | "Los 5 errores de hreflang que veo en cada auditoria" como lista. |
| Newsletter julio | Email | 14 julio | Edicion "Como elegir la estrategia de renderizado correcta". |
| Compartir en Reddit | r/nextjs, r/SEO | 28 julio | El articulo de hreflang tiene valor alto para comunidades de SEO. |

**Acciones de enlazado interno post-publicacion:**
- Actualizar /desarrollo-web para enlazar al Brief 11
- Actualizar Brief 1 para enlazar al Brief 3 (seccion de internacionalizacion)
- Actualizar Brief 2 para enlazar al Brief 3 (sitemap multiidioma)
- Enlazar Brief 11 -> Brief 1, Brief 11 -> Brief 5, Brief 11 -> Brief 7 (cuando exista)
- Enlazar Brief 3 -> Brief 1, Brief 3 -> Brief 2

**Metricas a rastrear:**

| Metrica | Herramienta | Objetivo julio |
|---------|-------------|----------------|
| Sesiones organicas al blog | Vercel Analytics / GA4 | 400 |
| Impresiones en Search Console | Google Search Console | 3 000 |
| Posiciones top 10 para keywords objetivo | Search Console | 2-3 keywords |
| Clics organicos al blog | Search Console | 80 |
| Suscriptores de newsletter | Plataforma de email | 70 acumulados |

---

### Agosto 2026

| Semana | Fecha publicacion | Brief # | Titulo | Cluster |
|--------|-------------------|---------|--------|---------|
| Semana 2 | Martes 11 agosto | 7 | React Server Components y su impacto en el rendimiento web | Core Web Vitals |
| Semana 4 | Martes 25 agosto | 4 | Errores de indexacion en Next.js y como resolverlos | SEO Tecnico en Next.js |

**Logica editorial:** El Brief 7 cierra el cluster de Core Web Vitals con el articulo mas tecnico (React Server Components y rendimiento). El Brief 4 completa el cluster de SEO tecnico en Next.js con un articulo orientado a resolver problemas, lo que atrae trafico de busquedas con alta intencion. A estas alturas ya existen 8 articulos publicados, lo que permite una red densa de enlaces cruzados.

**Tiempo estimado de produccion:**
- Semanas 1-2 agosto: escribir Brief 7 (2 000-2 400 palabras, 6-8 horas)
- Semanas 2-3 agosto: escribir Brief 4 (2 000-2 500 palabras, 6-8 horas)
- Semanas 3-4 agosto: traducir al ingles los 2 articulos de julio (3-4 horas por articulo)

**Estrategia de promocion:**

| Accion | Canal | Cuando | Detalle |
|--------|-------|--------|---------|
| Post tecnico sobre RSC | LinkedIn | 11 agosto | "Cuanto JavaScript se ahorra realmente con React Server Components" con datos concretos. |
| Post de lista de errores | LinkedIn | 25 agosto | "8 razones por las que Google no indexa tu sitio Next.js" como lista. |
| Newsletter agosto | Email | 11 agosto | Edicion "React Server Components: lo que necesitas saber como consultor SEO". |
| Articulo en Dev.to | Dev.to | Semana del 25 agosto | Version condensada del Brief 4 (alto valor para la comunidad de desarrolladores Next.js). |

**Acciones de enlazado interno post-publicacion:**
- Actualizar Brief 5 para enlazar al Brief 7 ("Profundiza en como RSC impactan las metricas...")
- Actualizar Brief 6 para enlazar al Brief 7 en la seccion de INP
- Actualizar Brief 1 para enlazar al Brief 4 ("Si tienes problemas de indexacion, lee...")
- Actualizar Brief 2 para enlazar al Brief 4 (robots.txt e indexacion)
- Enlazar Brief 7 -> Brief 5, Brief 7 -> Brief 6, Brief 7 -> Brief 11
- Enlazar Brief 4 -> Brief 1, Brief 4 -> Brief 2

**Metricas a rastrear:**

| Metrica | Herramienta | Objetivo agosto |
|---------|-------------|-----------------|
| Sesiones organicas al blog | Vercel Analytics / GA4 | 600 |
| Impresiones en Search Console | Google Search Console | 5 000 |
| Posiciones top 10 para keywords objetivo | Search Console | 4-6 keywords |
| Clics organicos al blog | Search Console | 150 |
| Leads generados (formularios de contacto) | Formulario /contacto | 2-3 acumulados |
| Suscriptores de newsletter | Plataforma de email | 90 acumulados |

---

### Septiembre 2026

| Semana | Fecha publicacion | Brief # | Titulo | Cluster |
|--------|-------------------|---------|--------|---------|
| Semana 2 | Martes 8 septiembre | 12 | Arquitectura de informacion para sitios web: del keyword research a la estructura de carpetas | Desarrollo Web Moderno |
| Semana 4 | Martes 22 septiembre | 10 | Como validar y depurar datos estructurados antes de lanzar a produccion | Datos Estructurados |

**Logica editorial:** El Brief 12 cierra el cluster de Desarrollo Web Moderno con un articulo estrategico que conecta SEO y desarrollo (arquitectura de informacion). Es un articulo que enlaza naturalmente a casi todos los articulos anteriores. El Brief 10 cierra el cluster de datos estructurados con el articulo mas practico y de menor longitud, ideal para cerrar el semestre sin presion.

**Tiempo estimado de produccion:**
- Semanas 1-2 septiembre: escribir Brief 12 (2 400-2 800 palabras, 7-9 horas)
- Semanas 2-3 septiembre: escribir Brief 10 (1 600-2 000 palabras, 4-6 horas, el mas corto del calendario)
- Semanas 3-4 septiembre: traducir al ingles los 2 articulos de agosto (3-4 horas por articulo)
- Ultima semana de septiembre: revision general de los 12 articulos publicados

**Estrategia de promocion:**

| Accion | Canal | Cuando | Detalle |
|--------|-------|--------|---------|
| Post de diagrama de arquitectura | LinkedIn | 8 septiembre | Compartir el diagrama de la arquitectura de carlosanayaruiz.com como ejemplo real. |
| Post de checklist | LinkedIn | 22 septiembre | "Checklist de validacion de datos estructurados pre-deploy" como imagen. |
| Newsletter septiembre (cierre) | Email | 8 septiembre | Edicion de recapitulacion: "6 meses, 12 articulos: todo lo que publicamos" con enlaces a los favoritos. |
| Recap en LinkedIn | LinkedIn | 29 septiembre | Post largo recapitulando los 6 meses de blog, metricas logradas y aprendizajes. |
| Proponer guest post | Blogs de marketing digital | Septiembre | Proponer articulo invitado en blogs de marketing o SEO en espanol usando la autoridad construida. |

**Acciones de enlazado interno post-publicacion:**
- Actualizar Brief 1 para enlazar al Brief 12 (seccion de arquitectura)
- Actualizar Brief 8 para enlazar al Brief 10 ("Aprende a validar tus datos estructurados...")
- Actualizar Brief 9 para enlazar al Brief 10
- Actualizar /seo-tecnico para enlazar al Brief 12
- Actualizar /sobre-mi para enlazar al Brief 12 (ejemplo del propio sitio)
- Revision general: verificar que todos los enlaces cruzados entre los 12 articulos estan implementados

**Metricas a rastrear:**

| Metrica | Herramienta | Objetivo septiembre |
|---------|-------------|---------------------|
| Sesiones organicas al blog | Vercel Analytics / GA4 | 900 |
| Impresiones en Search Console | Google Search Console | 8 000 |
| Posiciones top 10 para keywords objetivo | Search Console | 6-8 keywords |
| Clics organicos al blog | Search Console | 250 |
| Leads generados (formularios de contacto) | Formulario /contacto | 4-5 acumulados |
| Suscriptores de newsletter | Plataforma de email | 120 acumulados |
| Backlinks obtenidos | Ahrefs / Search Console | 5-8 |

---

## Resumen de secuenciacion

| Mes | Brief | Brief | Clusters cubiertos |
|-----|-------|-------|---------------------|
| Abril | #1 SEO tecnico Next.js (P1) | #8 Schema.org JSON-LD (P1) | SEO Tecnico + Datos Estructurados |
| Mayo | #5 Core Web Vitals guia (P1) | #2 Sitemap y robots (P1) | Core Web Vitals + SEO Tecnico |
| Junio | #6 Optimizar LCP/INP/CLS (P1) | #9 Schemas avanzados (P2) | Core Web Vitals + Datos Estructurados |
| Julio | #11 SSR vs SSG vs ISR (P2) | #3 Hreflang (P2) | Desarrollo Web + SEO Tecnico |
| Agosto | #7 React Server Components (P2) | #4 Errores indexacion (P2) | Core Web Vitals + SEO Tecnico |
| Septiembre | #12 Arquitectura info (P2) | #10 Validar datos estr. (P3) | Desarrollo Web + Datos Estructurados |

---

## Cobertura de clusters al final del semestre

| Cluster | Articulos | Briefs |
|---------|-----------|--------|
| SEO Tecnico en Next.js | 4 | #1, #2, #3, #4 |
| Core Web Vitals y Rendimiento | 3 | #5, #6, #7 |
| Datos Estructurados / Schema.org | 3 | #8, #9, #10 |
| Desarrollo Web Moderno | 2 | #11, #12 |

---

## Estrategia de promocion consolidada

### LinkedIn (canal principal)

| Tipo de contenido | Frecuencia | Proposito |
|-------------------|------------|-----------|
| Post de lanzamiento de articulo | 2/mes (cada publicacion) | Trafico directo al blog |
| Carrusel / imagen informativa | 1/mes | Engagement y alcance organico |
| Post de opinion / insight tecnico | 1-2/mes (semanas sin publicacion) | Autoridad personal |
| Comentarios en posts de terceros | 5-10 min diarios | Visibilidad en la comunidad SEO/dev |

**Formato recomendado para posts de articulo:**
1. Hook: pregunta o problema en 1-2 lineas
2. 3-5 takeaways concretos del articulo
3. CTA con enlace al articulo completo
4. 3-5 hashtags: #SEOTecnico #NextJS #WebPerformance #DesarrolloWeb #CoreWebVitals

### Newsletter

| Parametro | Valor |
|-----------|-------|
| Frecuencia | 2 veces al mes (alineada con publicaciones) |
| Plataforma | Resend o Buttondown (ya existe componente Newsletter en el sitio) |
| Estructura | Intro personal (2-3 oraciones) + resumen del articulo + 1 recurso externo + CTA |
| Objetivo de suscriptores septiembre 2026 | 120 |

### Canales secundarios

| Canal | Frecuencia | Que publicar |
|-------|------------|--------------|
| Dev.to | 1 articulo cada 2 meses | Version condensada de los articulos mas tecnicos |
| Reddit (r/nextjs, r/SEO) | Selectivo (3-4 articulos del semestre) | Solo articulos con alto valor tecnico y sin tono promocional |
| Twitter/X | 1-2 threads/mes | Key points de los articulos mas visuales (Core Web Vitals, tablas comparativas) |
| GitHub | Por articulo tutorial | Repo de ejemplo cuando el articulo incluya codigo funcional |

---

## Carga de trabajo mensual estimada

Esta tabla muestra el compromiso de tiempo realista para un consultor independiente:

| Actividad | Horas/mes | Notas |
|-----------|-----------|-------|
| Escribir 2 articulos en espanol | 12-18 | Varia segun longitud del brief |
| Traducir 2 articulos del mes anterior al ingles | 6-8 | La traduccion es mas rapida que la redaccion original |
| Crear imagenes/diagramas | 2-3 | Usar herramientas como Excalidraw, Figma o screenshots |
| Promocion en LinkedIn y newsletter | 3-4 | Incluye redaccion de posts y envio de newsletter |
| Actualizacion de enlaces internos | 1-2 | Anadir enlaces cruzados en articulos anteriores y paginas de servicio |
| Revision de metricas | 1 | Chequeo rapido en Search Console, Analytics y newsletter |
| **Total mensual** | **25-36 horas** | **Aproximadamente 6-9 horas por semana** |

---

## KPIs acumulados del semestre

| Metrica | Objetivo a septiembre 2026 |
|---------|----------------------------|
| Articulos publicados (ES) | 12 |
| Articulos publicados (EN) | 10-12 (traducciones con 1-2 meses de retraso) |
| Sesiones organicas mensuales al blog | 900+ |
| Impresiones mensuales en Search Console | 8 000+ |
| Posiciones top 10 para keywords objetivo | 6-8 |
| Suscriptores de newsletter | 120 |
| Leads de contacto generados | 4-5 |
| Backlinks naturales obtenidos | 5-8 |
| Posts en LinkedIn | 24+ |

---

## Dependencias y pre-requisitos

Antes de publicar el primer articulo (14 abril 2026), se necesitan:

1. **Seccion de blog implementada** en Next.js App Router (`/blog/[slug]`) con:
   - Template de articulo con `generateMetadata` dinamico
   - Schema `Article` / `BlogPosting` JSON-LD
   - Breadcrumbs: Home > Blog > [Titulo del articulo]
   - Tabla de contenidos automatica para articulos largos
   - Componente de CTA al final de cada articulo
   - Seccion "Articulos relacionados" (puede ser manual al principio)
2. **Formulario de newsletter** funcional (ya existe componente `<Newsletter />` en el sitio)
3. **Analytics configurado**: Vercel Analytics + Google Search Console verificado
4. **Perfiles de redes sociales** con bio actualizada que apunte al blog
5. **Proceso de produccion personal**: borrador (lunes-viernes semana previa) -> revision (sabado) -> publicacion (martes) -> promocion (martes-jueves)

---

## Post-semestre: que sigue en Q4 2026

Al completar los 12 articulos en septiembre, el blog tendra una base solida de autoridad tematica en los 4 clusters. Las siguientes acciones logicas para Q4 2026 serian:

1. **Actualizar los articulos pilar** (#1, #5, #8) si Next.js ha publicado actualizaciones relevantes
2. **Abrir nuevos clusters**: Automatizacion con IA, Migraciones SEO, Dashboards empresariales
3. **Evaluar rendimiento**: identificar los 3 articulos con mejor rendimiento organico y crear contenido derivado (guias extendidas, casos de estudio)
4. **Considerar contenido en video**: tutoriales en YouTube/Loom para los articulos mas practicos (#6, #9, #11)
5. **Guest posting**: usar la autoridad construida para proponer articulos en blogs de marketing digital en espanol
