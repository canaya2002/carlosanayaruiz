# Matriz de Prioridades SEO — carlosanayaruiz.com

> Ultima actualizacion: 2026-04-15
> Responsable: Carlos Anaya Ruiz
> Dominio: carlosanayaruiz.com
> Stack: Next.js 16, App Router, i18n es/en

Este documento organiza todas las mejoras SEO del sitio en cuatro categorias segun su relacion impacto/esfuerzo. Cada tarea incluye puntuacion numerica, urgencia, estado actual y dependencias.

---

## Guia de Puntuacion

| Columna      | Escala / Valores                                                                 |
|--------------|----------------------------------------------------------------------------------|
| **Impacto**  | 1 (minimo) a 5 (critico para trafico/posicionamiento)                           |
| **Esfuerzo** | 1 (< 30 min, trivial) a 5 (varios dias, arquitectura compleja)                  |
| **Urgencia** | INMEDIATA, ALTA, MEDIA, BAJA                                                    |
| **Estado**   | Completado, Pendiente                                                            |
| **Depend.**  | Tareas o recursos previos necesarios para ejecutar                               |

---

## 1. Quick Wins (Alto impacto, bajo esfuerzo)

Tareas que se pueden resolver rapidamente y tienen un efecto desproporcionado en el SEO o la credibilidad del sitio.

| #  | Item                                                              | Impacto | Esfuerzo | Urgencia  | Estado      | Dependencias                          |
|----|-------------------------------------------------------------------|---------|----------|-----------|-------------|---------------------------------------|
| 1  | Corregir duplicacion de titulo (nombre de marca aparecia dos veces) | 4       | 1        | INMEDIATA | Completado | Ninguna                               |
| 2  | Corregir error factual de IBM en metadata                         | 4       | 1        | INMEDIATA | Completado | Ninguna                               |
| 3  | Agregar SEO Tecnico a los datos de servicios                      | 4       | 1        | INMEDIATA | Completado | Ninguna                               |
| 4  | Agregar servicios a la navegacion del header                      | 4       | 1        | INMEDIATA | Completado | #3 (datos de servicios existentes)    |
| 5  | Corregir consistencia de hreflang en sitemap                      | 4       | 1        | INMEDIATA | Completado | Ninguna                               |
| 6  | Agregar headers de seguridad (Permissions-Policy, HSTS)           | 3       | 1        | ALTA      | Completado | Ninguna                               |
| 7  | Agregar rel="me" a enlaces sociales                               | 3       | 1        | ALTA      | Completado | Ninguna                               |
| 8  | Corregir publishedDate del libro                                  | 3       | 1        | ALTA      | Completado | Ninguna                               |
| 9  | Agregar tag de verificacion de Google Search Console               | 5       | 1        | INMEDIATA | Pendiente  | Cuenta de GSC activa (#24)            |
| 10 | Crear email profesional (info@carlosanayaruiz.com)                | 3       | 1        | ALTA      | Pendiente  | Configuracion DNS del dominio         |
| 11 | Agregar prevencion de spam honeypot al formulario de contacto     | 3       | 1        | ALTA      | Pendiente  | Ninguna                               |
| 12 | Agregar nofollow a enlaces de Fiverr (no pasar equity a marketplace) | 3    | 1        | ALTA      | Pendiente  | Ninguna                               |

---

## 2. Cambios Estructurales (Alto impacto, alto esfuerzo)

Modificaciones de arquitectura, nuevas paginas o componentes que requieren desarrollo significativo pero transforman la presencia del sitio.

| #  | Item                                                              | Impacto | Esfuerzo | Urgencia  | Estado      | Dependencias                          |
|----|-------------------------------------------------------------------|---------|----------|-----------|-------------|---------------------------------------|
| 13 | Mejorar hero del home page y messaging comercial                  | 5       | 3        | INMEDIATA | Completado | Ninguna                               |
| 14 | Corregir unicidad de H1 en paginas About y Contact                | 4       | 2        | ALTA      | Completado | Ninguna                               |
| 15 | Mejorar enlazado interno entre paginas de servicios               | 5       | 3        | ALTA      | Completado | Paginas de servicios existentes       |
| 16 | Enriquecer schema Person con credenciales educativas              | 4       | 2        | ALTA      | Completado | Ninguna                               |
| 17 | Crear pagina /es/casos (portfolio/casos de estudio)               | 5       | 4        | ALTA      | Pendiente  | Contenido de casos reales             |
| 18 | Crear infraestructura de blog (/es/blog, /en/blog)                | 5       | 5        | ALTA      | Pendiente  | Decision de CMS o MDX                 |
| 19 | Agregar FAQ schema a la pagina Sobre Mi                           | 3       | 2        | MEDIA     | Pendiente  | Contenido de preguntas frecuentes     |
| 20 | Considerar agregar LocalBusiness schema                           | 3       | 2        | MEDIA     | Pendiente  | Google Business Profile (#25)         |

---

## 3. Cambios Editoriales (Impacto medio, esfuerzo medio)

Creacion de contenido, assets visuales y materiales que refuerzan autoridad tematica y conversion.

| #  | Item                                                              | Impacto | Esfuerzo | Urgencia  | Estado      | Dependencias                          |
|----|-------------------------------------------------------------------|---------|----------|-----------|-------------|---------------------------------------|
| 21 | Escribir 3-4 blog posts para construir autoridad tematica         | 5       | 4        | MEDIA     | Pendiente  | #18 (infraestructura de blog)         |
| 22 | Crear lead magnet descargable (checklist, guia, template)         | 4       | 3        | MEDIA     | Pendiente  | Pagina de landing o blog activo       |
| 23 | Mejorar pagina de libro cuando el libro este listo                | 3       | 2        | BAJA      | Pendiente  | Libro finalizado y publicado          |

---

## 4. Acciones Externas (Alto impacto, no se pueden hacer en codigo)

Tareas que dependen de plataformas de terceros, configuraciones DNS o acciones fuera del repositorio.

| #  | Item                                                              | Impacto | Esfuerzo | Urgencia  | Estado      | Dependencias                          |
|----|-------------------------------------------------------------------|---------|----------|-----------|-------------|---------------------------------------|
| 24 | Configurar Google Search Console                                  | 5       | 1        | INMEDIATA | Pendiente  | Acceso a DNS o hosting                |
| 25 | Configurar Google Business Profile                                | 5       | 2        | ALTA      | Pendiente  | Direccion verificable en CDMX         |
| 26 | Alinear perfiles de LinkedIn y GitHub con carlosanayaruiz.com     | 4       | 1        | ALTA      | Pendiente  | Ninguna                               |
| 27 | Construir backlinks desde Tec de Monterrey y publicaciones del sector | 5   | 5        | MEDIA     | Pendiente  | Relaciones con editores/universidades |
| 28 | Enviar datos estructurados a Google Rich Results Test             | 3       | 1        | ALTA      | Pendiente  | #24 (GSC activo)                      |

---

## Resumen de Progreso

| Categoria              | Completadas | Pendientes | Total |
|------------------------|-------------|------------|-------|
| Quick Wins             | 8           | 4          | 12    |
| Cambios Estructurales  | 4           | 4          | 8     |
| Cambios Editoriales    | 0           | 3          | 3     |
| Acciones Externas      | 0           | 5          | 5     |
| **TOTAL**              | **12**      | **16**     | **28**|

**Porcentaje completado:** 43% (12 de 28 tareas)

---

## Orden de Ejecucion Recomendado (Pendientes)

La siguiente secuencia optimiza el impacto acumulado respetando dependencias:

| Prioridad | Tarea # | Item                                                    | Justificacion                                                    |
|-----------|---------|---------------------------------------------------------|------------------------------------------------------------------|
| 1         | 24      | Google Search Console                                   | Sin medicion no hay optimizacion; prerequisito de todo lo demas  |
| 2         | 9       | Tag de verificacion GSC                                 | Depende de #24, se hace inmediatamente despues                   |
| 3         | 28      | Rich Results Test                                       | Validar que el schema actual ya genera resultados enriquecidos   |
| 4         | 12      | Nofollow a enlaces de Fiverr                            | 30 segundos de trabajo, deja de filtrar equity                   |
| 5         | 11      | Honeypot en formulario de contacto                      | Protege la bandeja antes de crear el email profesional           |
| 6         | 10      | Email profesional                                       | Credibilidad; necesario antes de cualquier outreach              |
| 7         | 26      | Alinear LinkedIn y GitHub                               | Rapido, amplifica senales de marca                               |
| 8         | 25      | Google Business Profile                                 | SEO local, senales de confianza para CDMX                        |
| 9         | 17      | Pagina de casos/portfolio                               | E-E-A-T y conversion; contenido propio de alto valor             |
| 10        | 18      | Infraestructura de blog                                 | Habilita trafico long-tail y autoridad tematica                  |
| 11        | 21      | Escribir 3-4 blog posts                                 | Depende de #18; primer contenido indexable del blog              |
| 12        | 19      | FAQ schema en Sobre Mi                                  | Posibilidad de rich snippets con esfuerzo moderado               |
| 13        | 20      | LocalBusiness schema                                    | Complementa #25 (GBP) para senales locales                      |
| 14        | 22      | Lead magnet descargable                                 | Conversion y captura de leads; requiere blog o landing           |
| 15        | 27      | Backlinks desde Tec de Monterrey y publicaciones        | Mayor impacto a largo plazo, pero requiere relaciones y tiempo   |
| 16        | 23      | Mejorar pagina de libro                                 | Baja urgencia hasta que el libro este publicado                  |

---

## Notas

- Las tareas completadas representan la primera fase de la auditoria SEO tecnica realizada en abril 2026.
- Las tareas pendientes de Quick Wins (#9, #10, #11, #12) pueden resolverse en una sola sesion de trabajo.
- La creacion de blog (#18) es el cambio estructural mas importante pendiente: sin contenido fresco, el sitio depende exclusivamente de las paginas de servicio para posicionar.
- Los backlinks (#27) son la accion con mayor impacto compuesto a largo plazo, pero requieren networking activo y no pueden automatizarse.

---

*Esta matriz debe revisarse y actualizarse semanalmente conforme se completen tareas.*
