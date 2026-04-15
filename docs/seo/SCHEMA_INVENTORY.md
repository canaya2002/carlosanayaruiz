# Inventario de Datos Estructurados Schema.org

> **Dominio:** carlosanayaruiz.com
> **Fecha:** 2026-04-15
> **Fuente:** `lib/schema.ts`

---

## Inventario Completo de Schemas

| Tipo de Schema | Pagina(s) | Patron @id | Estado | Notas |
|----------------|-----------|------------|--------|-------|
| **Person** | Todas (layout) | `https://carlosanayaruiz.com/#person` | Activo | Objetivo: Knowledge Panel. Inyectado en `<head>` via `generateLayoutGraph()`. Contiene name, alternateName, jobTitle, knowsAbout (28 temas), hasCredential (PMP, TOEFL, BSc, AI Specialization), alumniOf (Tec de Monterrey), worksFor (ProfessionalService), sameAs (LinkedIn, 2x GitHub, Fiverr), nationality, knowsLanguage. |
| **ImageObject** | Todas (layout, anidado en Person) | `https://carlosanayaruiz.com/#personimage` | Activo | Imagen de Person. Incluye `contentUrl` y `caption`. Referenciado por WebPage `primaryImageOfPage`. |
| **ProfessionalService** | Todas (layout, anidado en Person.worksFor) | `https://carlosanayaruiz.com/#business` | Activo | Entidad de negocio. `founder` referencia a `/#person`. `areaServed`: Mexico, United States. |
| **WebSite** | Todas (layout) | `https://carlosanayaruiz.com/#website` | Activo | `publisher` referencia a `/#person`. `alternateName`: "carlosanayaruiz.com". |
| **WebPage** | Home (`/{locale}`) | `https://carlosanayaruiz.com/{locale}#webpage` | Activo | `isPartOf: /#website`, `about: /#person`. Generado por `generateServicesPageGraph()`. |
| **Service** | Home (`/{locale}`) | `https://carlosanayaruiz.com/{locale}/#service-seo-tecnico` | Activo | "Consultoría SEO Técnica". `provider: /#person`. `areaServed`: MX, US, Remote. |
| **Service** | Home (`/{locale}`) | `https://carlosanayaruiz.com/{locale}/#service-nextjs-firebase` | Activo | "Aplicaciones Web con Next.js y Firebase". `provider: /#person`. `areaServed`: MX, US, Remote. |
| **Service** | Home (`/{locale}`) | `https://carlosanayaruiz.com/{locale}/#service-ai-automation` | Activo | "Automatización con IA y Chatbots". `provider: /#person`. `areaServed`: MX, US, Remote. |
| **Service** | Home (`/{locale}`) | `https://carlosanayaruiz.com/{locale}/#service-dashboards` | Activo | "Dashboards Responsivos". `provider: /#person`. `areaServed`: MX, US, Remote. |
| **FAQPage** | Home (`/{locale}`) | _(sin @id)_ | Activo | 12 Q&As agregadas de los 4 servicios en `data/services.ts` (3 por servicio). |
| **WebPage** | SEO Técnico (`/{locale}/seo-tecnico`) | `https://carlosanayaruiz.com/{locale}/seo-tecnico#webpage` | Activo | Money page. `isPartOf: /#website`, `about: /#person`. |
| **Service** | SEO Técnico (`/{locale}/seo-tecnico`) | `https://carlosanayaruiz.com/{locale}/seo-tecnico#service` | Activo | "Technical SEO Consulting" / "Consultoría SEO Técnica". `provider: /#person`. `areaServed`: MX, US, Remote. Incluye `url`. |
| **BreadcrumbList** | SEO Técnico (`/{locale}/seo-tecnico`) | _(sin @id)_ | Activo | Home -> SEO Técnico. |
| **FAQPage** | SEO Técnico (`/{locale}/seo-tecnico`) | _(sin @id)_ | Activo | 4 Q&As unicas sobre auditorías de SEO técnico (definidas en la pagina, no en `data/services.ts`). |
| **WebPage** | Desarrollo Web (`/{locale}/desarrollo-web`) | `https://carlosanayaruiz.com/{locale}/desarrollo-web#webpage` | Activo | Money page. `isPartOf: /#website`, `about: /#person`. |
| **Service** | Desarrollo Web (`/{locale}/desarrollo-web`) | `https://carlosanayaruiz.com/{locale}/desarrollo-web#service` | Activo | "Aplicaciones Web con Next.js y Firebase". `provider: /#person`. `areaServed`: MX, US, Remote. Incluye `url`. |
| **BreadcrumbList** | Desarrollo Web (`/{locale}/desarrollo-web`) | _(sin @id)_ | Activo | Home -> Desarrollo Web. |
| **FAQPage** | Desarrollo Web (`/{locale}/desarrollo-web`) | _(sin @id)_ | Activo | Q&As unicas sobre desarrollo con Next.js y Firebase. |
| **WebPage** | Automatización IA (`/{locale}/automatizacion-ia`) | `https://carlosanayaruiz.com/{locale}/automatizacion-ia#webpage` | Activo | Money page. `isPartOf: /#website`, `about: /#person`. |
| **Service** | Automatización IA (`/{locale}/automatizacion-ia`) | `https://carlosanayaruiz.com/{locale}/automatizacion-ia#service` | Activo | "Automatización con IA y Chatbots". `provider: /#person`. `areaServed`: MX, US, Remote. Incluye `url`. |
| **BreadcrumbList** | Automatización IA (`/{locale}/automatizacion-ia`) | _(sin @id)_ | Activo | Home -> Automatización IA. |
| **FAQPage** | Automatización IA (`/{locale}/automatizacion-ia`) | _(sin @id)_ | Activo | Q&As unicas sobre chatbots e integración con IA. |
| **WebPage** | Dashboards (`/{locale}/dashboards`) | `https://carlosanayaruiz.com/{locale}/dashboards#webpage` | Activo | Money page. `isPartOf: /#website`, `about: /#person`. |
| **Service** | Dashboards (`/{locale}/dashboards`) | `https://carlosanayaruiz.com/{locale}/dashboards#service` | Activo | "Dashboards Responsivos". `provider: /#person`. `areaServed`: MX, US, Remote. Incluye `url`. |
| **BreadcrumbList** | Dashboards (`/{locale}/dashboards`) | _(sin @id)_ | Activo | Home -> Dashboards. |
| **FAQPage** | Dashboards (`/{locale}/dashboards`) | _(sin @id)_ | Activo | Q&As unicas sobre visualización de datos y dashboards. |
| **WebPage** | About (`/{locale}/sobre-mi`) | `https://carlosanayaruiz.com/{locale}/sobre-mi#webpage` | Activo | `isPartOf: /#website`, `about: /#person`. |
| **BreadcrumbList** | About (`/{locale}/sobre-mi`) | _(sin @id)_ | Activo | Home -> Sobre Mí. |
| **WebPage** | Contacto (`/{locale}/contacto`) | `https://carlosanayaruiz.com/{locale}/contacto#webpage` | Activo | `isPartOf: /#website`, `about: /#person`. |
| **BreadcrumbList** | Contacto (`/{locale}/contacto`) | _(sin @id)_ | Activo | Home -> Contacto. |
| **WebPage** | Libros (`/{locale}/libros`) | `https://carlosanayaruiz.com/{locale}/libros#webpage` | Activo | `isPartOf: /#website`, `about: /#person`. |
| **BreadcrumbList** | Libros (`/{locale}/libros`) | _(sin @id)_ | Activo | Home -> Recursos. |
| **Book** | _(eliminado)_ | _(n/a)_ | Eliminado | Eliminado intencionalmente -- el producto no existe. Se re-agregara con ISBN, precio y disponibilidad cuando se publique. |

---

## Resumen por Tipo de Schema

| Tipo de Schema | Total de Instancias | Paginas Donde Aparece |
|----------------|--------------------|-----------------------|
| Person | 1 (global) | Todas via layout |
| ImageObject | 1 (global) | Todas via layout (anidado en Person) |
| ProfessionalService | 1 (global) | Todas via layout (anidado en Person.worksFor) |
| WebSite | 1 (global) | Todas via layout |
| WebPage | 8 | Home, SEO Técnico, Desarrollo Web, Automatización IA, Dashboards, About, Contacto, Libros |
| Service | 8 | Home (x4 agregados), SEO Técnico (x1), Desarrollo Web (x1), Automatización IA (x1), Dashboards (x1) |
| FAQPage | 5 | Home (12 Q&As), SEO Técnico, Desarrollo Web, Automatización IA, Dashboards |
| BreadcrumbList | 7 | SEO Técnico, Desarrollo Web, Automatización IA, Dashboards, About, Contacto, Libros |
| Book | 0 | Eliminado (pendiente lanzamiento del producto) |

**Total de tipos unicos activos:** 8 (Person, ImageObject, ProfessionalService, WebSite, WebPage, Service, FAQPage, BreadcrumbList)

---

## Mapa de Referencias Cruzadas @id

```
https://carlosanayaruiz.com/#person
  <- WebSite.publisher
  <- ProfessionalService.founder
  <- Service.provider (las 8 instancias)
  <- WebPage.about (las 8 instancias)

https://carlosanayaruiz.com/#business
  <- Person.worksFor (anidado, con @id propio)

https://carlosanayaruiz.com/#website
  <- WebPage.isPartOf (las 8 instancias)

https://carlosanayaruiz.com/#personimage
  <- WebPage.primaryImageOfPage (las 8 instancias)

https://carlosanayaruiz.com/{locale}#webpage
  (home page -- sin referencias entrantes)

https://carlosanayaruiz.com/{locale}/#service-{id}
  (servicios en home -- sin referencias entrantes)

https://carlosanayaruiz.com/{locale}/{slug}#webpage
  (money pages, about, contacto, libros -- sin referencias entrantes)

https://carlosanayaruiz.com/{locale}/{slug}#service
  (money page services -- sin referencias entrantes)
```

---

## Variantes por Locale

Todos los schemas con contenido textual son sensibles al locale. El placeholder `{locale}` se resuelve a `es` o `en`. Los valores `@id` basados en URL cambian segun el locale y los slugs localizados:

| Locale | Ejemplo @id (pagina SEO) |
|--------|--------------------------|
| es | `https://carlosanayaruiz.com/es/seo-tecnico#webpage` |
| en | `https://carlosanayaruiz.com/en/technical-seo#webpage` |

Mapeo de slugs por idioma:

| Ruta es | Ruta en |
|---------|---------|
| `/seo-tecnico` | `/technical-seo` |
| `/desarrollo-web` | `/web-development` (slug del servicio: `aplicaciones-web-nextjs-firebase` / `modern-web-apps-nextjs-firebase`) |
| `/automatizacion-ia` | `/ai-automation` (slug del servicio: `automatizacion-ia-chatbots` / `ai-automation-chatbots`) |
| `/dashboards` | `/dashboards` (igual) |
| `/sobre-mi` | `/about` |
| `/contacto` | `/contact` |
| `/libros` | `/books` |

**Nota:** Los slugs de las rutas de las paginas (definidos en `app/[locale]/`) difieren de los slugs en `data/services.ts`. Las paginas usan rutas simplificadas (`/seo-tecnico`, `/desarrollo-web`) mientras que los datos de servicios usan slugs mas largos (`seo-tecnico`, `aplicaciones-web-nextjs-firebase`). Los `@id` de `generateSingleServiceSchema()` usan el slug del servicio del objeto `service` pasado por cada pagina, no el slug de `data/services.ts`.

---

## Inventario por Pagina

### `app/[locale]/layout.tsx` -- Todas las paginas
| Schema | Generador |
|--------|-----------|
| Person | `generatePersonSchema()` via `generateLayoutGraph()` |
| WebSite | `generateWebSiteSchema()` via `generateLayoutGraph()` |

### `app/[locale]/page.tsx` -- Home
| Schema | Generador |
|--------|-----------|
| WebPage | `generateWebPageSchema()` via `generateServicesPageGraph()` |
| Service x4 | `generateServiceSchemas()` via `generateServicesPageGraph()` |
| FAQPage | `generateFAQSchema()` via `generateServicesPageGraph()` |

### `app/[locale]/seo-tecnico/page.tsx`
| Schema | Generador |
|--------|-----------|
| WebPage | `generateWebPageSchema()` via `generateServicePageGraph()` |
| Service | `generateSingleServiceSchema()` via `generateServicePageGraph()` |
| BreadcrumbList | `generateBreadcrumbSchema()` via `generateServicePageGraph()` |
| FAQPage | `generateFAQSchema()` via `generateServicePageGraph()` |

### `app/[locale]/desarrollo-web/page.tsx`
| Schema | Generador |
|--------|-----------|
| WebPage | `generateWebPageSchema()` via `generateServicePageGraph()` |
| Service | `generateSingleServiceSchema()` via `generateServicePageGraph()` |
| BreadcrumbList | `generateBreadcrumbSchema()` via `generateServicePageGraph()` |
| FAQPage | `generateFAQSchema()` via `generateServicePageGraph()` |

### `app/[locale]/automatizacion-ia/page.tsx`
| Schema | Generador |
|--------|-----------|
| WebPage | `generateWebPageSchema()` via `generateServicePageGraph()` |
| Service | `generateSingleServiceSchema()` via `generateServicePageGraph()` |
| BreadcrumbList | `generateBreadcrumbSchema()` via `generateServicePageGraph()` |
| FAQPage | `generateFAQSchema()` via `generateServicePageGraph()` |

### `app/[locale]/dashboards/page.tsx`
| Schema | Generador |
|--------|-----------|
| WebPage | `generateWebPageSchema()` via `generateServicePageGraph()` |
| Service | `generateSingleServiceSchema()` via `generateServicePageGraph()` |
| BreadcrumbList | `generateBreadcrumbSchema()` via `generateServicePageGraph()` |
| FAQPage | `generateFAQSchema()` via `generateServicePageGraph()` |

### `app/[locale]/sobre-mi/page.tsx`
| Schema | Generador |
|--------|-----------|
| WebPage | `generateWebPageSchema()` via `generateAboutPageGraph()` |
| BreadcrumbList | `generateBreadcrumbSchema()` via `generateAboutPageGraph()` |

### `app/[locale]/contacto/page.tsx`
| Schema | Generador |
|--------|-----------|
| WebPage | `generateWebPageSchema()` via `generateContactPageGraph()` |
| BreadcrumbList | `generateBreadcrumbSchema()` via `generateContactPageGraph()` |

### `app/[locale]/libros/page.tsx`
| Schema | Generador |
|--------|-----------|
| WebPage | `generateWebPageSchema()` via `generateBooksPageGraph()` |
| BreadcrumbList | `generateBreadcrumbSchema()` via `generateBooksPageGraph()` |
