# Auditoría de Datos Estructurados (JSON-LD)

> **Dominio:** carlosanayaruiz.com
> **Fecha:** 2026-04-15
> **Estándar:** Schema.org mediante patron `@graph`
> **Archivo de implementación:** `lib/schema.ts`

---

## Arquitectura General

Todos los datos estructurados se renderizan como bloques `<script type="application/ld+json">` usando el patron `@graph`. Cada contexto de pagina produce un arreglo `@graph` con multiples tipos de schema. Las referencias cruzadas entre schemas usan URIs `@id`.

**Dos capas:**

1. **Nivel layout** (`app/[locale]/layout.tsx`, dentro de `<head>`) -- Person + WebSite inyectados en todas las paginas via `generateLayoutGraph()`.
2. **Nivel pagina** -- Cada ruta inyecta su propio `@graph` con schemas especificos (WebPage, Service, FAQPage, BreadcrumbList).

---

## Schemas a Nivel Layout (Todas las Paginas)

Inyectados en `<head>` de `app/[locale]/layout.tsx`. Presentes en cada pagina del sitio.

### Person (`@id: https://carlosanayaruiz.com/#person`)

Objetivo: Google Knowledge Panel.

| Propiedad | Valor |
|-----------|-------|
| name | Carlos Anaya Ruiz |
| alternateName | `["Carlos Anaya Ruíz", "Carlos Anaya"]` |
| givenName / familyName | Carlos / Anaya Ruiz |
| url | `https://carlosanayaruiz.com` |
| image | ImageObject `@id: .../#personimage` -- `/carlos-anaya-ruiz-software.png` con `contentUrl` y `caption` |
| jobTitle | "Technical SEO Consultant & Full-Stack Engineer" (en) / "Consultor SEO Técnico & Ingeniero Full-Stack" (es) |
| description | Computer Science Engineer with 4+ years... PMP certified. Amazon, Master Loyalty Group, Wan Hai Lines. (localizado) |
| email | `mailto:carlosaremployment@hotmail.com` |
| telephone | `+525544167974` |
| address | PostalAddress: Ciudad de México, CDMX, MX |
| knowsAbout | 28 temas: Technical SEO, SEO Técnico, Next.js, React, TypeScript, Firebase, Node.js, Python, Artificial Intelligence, LLM Integration, GPT, Gemini, Dashboards, Power BI, Project Management, Scrum, PMBOK, Core Web Vitals, Schema.org, JSON-LD, Web Performance, CI/CD, AWS, Docker, Kubernetes, Web Security, Full-Stack Development, Information Architecture |
| hasCredential | 4 credenciales: PMP (Professional Certification), TOEFL iBT Score 92 (Language Certification), B.Sc. Computer Science & Technology / ITC (degree, recognizedBy: Tec de Monterrey), Specialization in Advanced AI for Data Science (certificate, recognizedBy: Tec de Monterrey) |
| hasOccupation | Occupation -- "Technical SEO Consultant & Full-Stack Engineer", Ciudad de México |
| alumniOf | Tecnológico de Monterrey, School of Engineering / Escuela de Ingeniería y Ciencias |
| worksFor | **ProfessionalService** `@id: .../#business` -- "Carlos Anaya Ruiz — Consultoría SEO & Desarrollo Web", founder ref a `/#person`, areaServed: Mexico + United States |
| mainEntityOfPage | `{BASE_URL}/{locale}/sobre-mi` |
| sameAs | LinkedIn, GitHub (CArlos12002), GitHub (canaya2002), Fiverr |
| nationality | Country: Mexico |
| knowsLanguage | Spanish (es), English (en) |

### WebSite (`@id: https://carlosanayaruiz.com/#website`)

| Propiedad | Valor |
|-----------|-------|
| name | Carlos Anaya Ruiz |
| alternateName | carlosanayaruiz.com |
| url | `https://carlosanayaruiz.com` |
| description | Descripcion profesional localizada del sitio |
| inLanguage | en-US / es-MX |
| publisher | `{ @id: .../#person }` |
| image | `/og-default.png` |

---

## Schemas a Nivel Pagina

### Pagina Home (`/{locale}`)

**Generador:** `generateServicesPageGraph()` en `app/[locale]/page.tsx`

**Contenido del @graph:**

1. **WebPage** (`@id: .../es#webpage` o `.../en#webpage`)
   - name: "Carlos Anaya Ruiz — Consultor SEO Técnico & Desarrollo Web" (es) / "Carlos Anaya Ruiz — Technical SEO Consultant & Web Development" (en)
   - description: localizada, con detalle de servicios
   - isPartOf: `{ @id: .../#website }`
   - about: `{ @id: .../#person }`
   - primaryImageOfPage: `{ @id: .../#personimage }`

2. **Service x4** (generados por `generateServiceSchemas()` desde `data/services.ts`)
   - `@id: .../{locale}/#service-seo-tecnico` -- Consultoría SEO Técnica / Technical SEO Consulting
   - `@id: .../{locale}/#service-nextjs-firebase` -- Aplicaciones Web con Next.js y Firebase / Modern Web Apps with Next.js & Firebase
   - `@id: .../{locale}/#service-ai-automation` -- Automatización con IA y Chatbots / AI Automation & Chatbots
   - `@id: .../{locale}/#service-dashboards` -- Dashboards Responsivos / Responsive Dashboards
   - Todos con: provider -> `/#person`, areaServed (Mexico, US, Remote), serviceOutput localizado

3. **FAQPage** -- 12 Q&As total (3 por cada uno de los 4 servicios, agregadas desde `data/services.ts`)

---

### Paginas Money de Servicio (4 paginas)

**Generador:** `generateServicePageGraph()` en cada archivo de pagina

Cada pagina produce una estructura de @graph identica con datos especificos:

#### 1. SEO Técnico (`/seo-tecnico` | `/technical-seo`)

Archivo: `app/[locale]/seo-tecnico/page.tsx`

| Schema | @id |
|--------|-----|
| WebPage | `.../{locale}/seo-tecnico#webpage` |
| Service | `.../{locale}/seo-tecnico#service` |
| BreadcrumbList | Home -> SEO Técnico |
| FAQPage | 4 Q&As (alcance de auditoría, sitios no-Next.js, tiempo de impacto, migraciones) |

Datos del servicio: id `seo-tecnico`, title "Technical SEO Consulting" / "Consultoría SEO Técnica", slug `seo-tecnico` / `technical-seo`

#### 2. Desarrollo Web (`/desarrollo-web` | `/web-development`)

Archivo: `app/[locale]/desarrollo-web/page.tsx`

| Schema | @id |
|--------|-----|
| WebPage | `.../{locale}/desarrollo-web#webpage` o `.../{locale}/web-development#webpage` |
| Service | `.../{locale}/desarrollo-web#service` o `.../{locale}/web-development#service` |
| BreadcrumbList | Home -> Desarrollo Web |
| FAQPage | Q&As sobre desarrollo web con Next.js |

#### 3. Automatización IA (`/automatizacion-ia` | `/ai-automation`)

Archivo: `app/[locale]/automatizacion-ia/page.tsx`

| Schema | @id |
|--------|-----|
| WebPage | `.../{locale}/automatizacion-ia#webpage` o `.../{locale}/ai-automation#webpage` |
| Service | `.../{locale}/automatizacion-ia#service` o `.../{locale}/ai-automation#service` |
| BreadcrumbList | Home -> Automatización IA |
| FAQPage | Q&As sobre chatbots e integración con IA |

#### 4. Dashboards (`/dashboards`)

Archivo: `app/[locale]/dashboards/page.tsx`

| Schema | @id |
|--------|-----|
| WebPage | `.../{locale}/dashboards#webpage` |
| Service | `.../{locale}/dashboards#service` |
| BreadcrumbList | Home -> Dashboards |
| FAQPage | Q&As sobre visualización de datos y dashboards |

**Común a todas las money pages:**
- Service schema incluye `areaServed`: Mexico, United States, Worldwide (Remote)
- Service schema incluye `url` apuntando a la pagina especifica
- `generateSingleServiceSchema()` se usa en lugar de `generateServiceSchemas()` -- schemas mas limpios con URL propia
- BreadcrumbList siempre tiene 2 items: Home -> Nombre del Servicio
- FAQPage solo contiene Q&As reales y sustantivas

---

### Pagina About (`/sobre-mi` | `/about`)

**Generador:** `generateAboutPageGraph()` en `app/[locale]/sobre-mi/page.tsx`

| Schema | @id |
|--------|-----|
| WebPage | `.../{locale}/sobre-mi#webpage` (es) / `.../{locale}/about#webpage` (en) |
| BreadcrumbList | Home -> Sobre Mí / About |

WebPage name: "Sobre Carlos Anaya Ruiz — Ingeniero, Líder Técnico y Consultor SEO" (es) / "About Carlos Anaya Ruiz — Engineer, Tech Lead & SEO Consultant" (en)

---

### Pagina Contacto (`/contacto` | `/contact`)

**Generador:** `generateContactPageGraph()` en `app/[locale]/contacto/page.tsx`

| Schema | @id |
|--------|-----|
| WebPage | `.../{locale}/contacto#webpage` (es) / `.../{locale}/contact#webpage` (en) |
| BreadcrumbList | Home -> Contacto / Contact |

WebPage name: "Contactar a Carlos Anaya Ruiz — Consultoría SEO y Desarrollo" (es) / "Contact Carlos Anaya Ruiz — SEO & Development Consulting" (en)

---

### Pagina Libros / Recursos (`/libros` | `/books`)

**Generador:** `generateBooksPageGraph()` en `app/[locale]/libros/page.tsx`

| Schema | @id |
|--------|-----|
| WebPage | `.../{locale}/libros#webpage` (es) / `.../{locale}/books#webpage` (en) |
| BreadcrumbList | Home -> Recursos / Resources |

**Nota:** No se incluye schema Book intencionalmente -- el producto no existe aun (no hay ISBN, precio ni enlace de compra). Esto es correcto. Se agregara cuando el libro este publicado y disponible para compra.

---

## Hallazgos de la Auditoría

### Positivo (GOOD)

1. **Sin declaraciones `@context` duplicadas.** Cada pagina tiene su propio `@graph` con un unico `@context: "https://schema.org"`. No hay conflictos de contexto.

2. **Person usa referencias `@id` correctamente.** Las referencias cruzadas (`/#person`, `/#website`, `/#personimage`, `/#business`) se resuelven dentro del graph del layout. Los schemas de pagina referencian correctamente `isPartOf: /#website` y `about: /#person`.

3. **No hay schema Book/Product falso para libro no publicado.** `generateBooksPageGraph()` solo incluye WebPage + BreadcrumbList. Decisión correcta alineada con las guías de Google que penalizan datos estructurados para productos no disponibles.

4. **Contenido localizado.** Todas las propiedades de texto cambian entre en-US y es-MX segun el locale.

5. **FAQ schemas con contenido real.** No hay placeholders ni contenido fabricado.

6. **Service schemas con areaServed.** Mexico, United States y Worldwide (Remote) en todos los 7 schemas de servicio.

7. **Person schema completo para Knowledge Panel.** Incluye las 4 credenciales (PMP, TOEFL, BSc, AI Specialization), 28 temas en knowsAbout, 4 perfiles en sameAs, y worksFor como ProfessionalService con `@id`.

### Issues Identificados

#### ISSUE 1: Dos bloques `<script>` @graph en la pagina Home

**Severidad:** Media
**Ubicacion:** `app/[locale]/layout.tsx` (linea 128-133) + `app/[locale]/page.tsx` (linea 89-94)

La pagina Home recibe **dos** bloques `<script type="application/ld+json">` independientes:

1. Del layout: `@graph: [Person, WebSite]` (via `generateLayoutGraph()`)
2. De la pagina: `@graph: [WebPage, Service x4, FAQPage]` (via `generateServicesPageGraph()`)

Google generalmente maneja multiples bloques JSON-LD correctamente, pero lo ideal seria consolidarlos en un solo `@graph` por pagina. Esto aplica a **todas** las paginas, no solo Home -- cada pagina recibe el graph del layout MAS su propio graph.

**Impacto:** Bajo en la practica. Google procesa multiples scripts JSON-LD como un unico dataset. Sin embargo, un solo `@graph` facilita la depuracion y es la practica recomendada.

**Recomendacion:** Considerar pasar el graph del layout como prop y fusionarlo con el graph de cada pagina para producir un unico `<script>`. Esto requiere refactorizar el patron actual donde el layout inyecta su propio bloque independiente.

#### ISSUE 2: Service schemas en Home usan locale en `@id` (fragmentacion potencial)

**Severidad:** Baja
**Ubicacion:** `lib/schema.ts`, funcion `generateServiceSchemas()` (linea 201)

Los `@id` de los Service schemas en la pagina Home incluyen el locale:
```
https://carlosanayaruiz.com/es/#service-seo-tecnico
https://carlosanayaruiz.com/en/#service-seo-tecnico
```

Esto crea dos identidades distintas para el mismo servicio segun el idioma. Mientras que los service schemas en las money pages usan el slug localizado:
```
https://carlosanayaruiz.com/es/seo-tecnico#service
https://carlosanayaruiz.com/en/technical-seo#service
```

**Impacto:** Fragmentacion de la entidad. Google podria tratar `/{locale}/#service-seo-tecnico` y `/{locale}/seo-tecnico#service` como servicios diferentes, diluyendo las senales.

**Recomendacion:** Unificar los `@id` de los Service schemas. Opciones:
- Usar `@id` sin locale: `https://carlosanayaruiz.com/#service-seo-tecnico`
- O hacer que los schemas de la home referencien el `@id` de las money pages con `{ @id: ".../seo-tecnico#service" }`

### Mejoras Sugeridas

#### MEJORA 1: Agregar `ContactPage` a la pagina de Contacto

**Prioridad:** Media
**Ubicacion:** `generateContactPageGraph()` en `lib/schema.ts` (linea 395)

Actualmente el WebPage usa `@type: "WebPage"` generico. Podria usar `@type: "ContactPage"` (subtipo de WebPage en Schema.org) para dar semantica mas precisa a Google.

**Cambio propuesto:**
```typescript
// En generateWebPageSchema o directamente en generateContactPageGraph
'@type': 'ContactPage',  // en lugar de 'WebPage'
```

#### MEJORA 2: Agregar `AboutPage` a la pagina Sobre Mi

**Prioridad:** Media
**Ubicacion:** `generateAboutPageGraph()` en `lib/schema.ts` (linea 366)

Similar al caso anterior, se podria usar `@type: "AboutPage"` (subtipo de WebPage) en lugar de `"WebPage"` generico.

**Nota:** Google no muestra rich results especificos para AboutPage ni ContactPage, pero estos tipos mejoran la comprension semantica del sitio y refuerzan la estructura de la entidad.

#### MEJORA 3: Agregar `hasOfferCatalog` a Person vinculando servicios

**Prioridad:** Baja
**Ubicacion:** `generatePersonSchema()` en `lib/schema.ts` (linea 8)

Se podria agregar `hasOfferCatalog` al schema Person para vincular explicitamente la entidad de persona con su catalogo de servicios:

```typescript
hasOfferCatalog: {
  '@type': 'OfferCatalog',
  name: 'Servicios de consultoría',
  itemListElement: [
    { '@id': `${BASE_URL}/#service-seo-tecnico` },
    { '@id': `${BASE_URL}/#service-nextjs-firebase` },
    { '@id': `${BASE_URL}/#service-ai-automation` },
    { '@id': `${BASE_URL}/#service-dashboards` },
  ]
}
```

Esto crearía un vínculo explicito entre Person y sus servicios, reforzando la relacion ya existente via `provider: { @id: /#person }`.

---

## Recomendaciones a Futuro

| Prioridad | Recomendacion | Disparador |
|-----------|--------------|------------|
| Alta | Re-agregar schema `Book` con ISBN, precio, `offers`, `availability` | Cuando el libro este publicado y disponible para compra |
| Media | Agregar schema `Article` con `author: { @id: .../#person }` para posts de blog | Cuando se lance el blog |
| Media | Agregar schema `CreativeWork` o `Project` para casos de estudio | Cuando se agreguen paginas de portafolio |
| Baja | Agregar `ProfilePage` a la pagina About | Cuando Google mejore el soporte de ProfilePage en rich results |
| Baja | Considerar schema `Organization` si la consultoría se formaliza como empresa | Cuando la entidad de negocio se constituya legalmente |
| Baja | Agregar `Review` / `AggregateRating` a los Service schemas | Cuando se recopilen testimonios reales de clientes con calificaciones |

---

## Referencia de Implementacion

| Funcion Generadora | Archivo | Usada Por |
|--------------------|---------|-----------| 
| `generatePersonSchema()` | `lib/schema.ts:8` | `generateLayoutGraph()` |
| `generateWebSiteSchema()` | `lib/schema.ts:159` | `generateLayoutGraph()` |
| `generateWebPageSchema()` | `lib/schema.ts:177` | Todas las funciones de pagina |
| `generateServiceSchemas()` | `lib/schema.ts:197` | `generateServicesPageGraph()` (home) |
| `generateSingleServiceSchema()` | `lib/schema.ts:222` | `generateServicePageGraph()` (money pages) |
| `generateBreadcrumbSchema()` | `lib/schema.ts:251` | Money pages, about, contact, books |
| `generateFAQSchema()` | `lib/schema.ts:267` | Home, money pages |
| `generateLayoutGraph()` | `lib/schema.ts:285` | `app/[locale]/layout.tsx` |
| `generateServicesPageGraph()` | `lib/schema.ts:293` | `app/[locale]/page.tsx` |
| `generateServicePageGraph()` | `lib/schema.ts:317` | `seo-tecnico`, `desarrollo-web`, `automatizacion-ia`, `dashboards` |
| `generateAboutPageGraph()` | `lib/schema.ts:366` | `app/[locale]/sobre-mi/page.tsx` |
| `generateContactPageGraph()` | `lib/schema.ts:395` | `app/[locale]/contacto/page.tsx` |
| `generateBooksPageGraph()` | `lib/schema.ts:340` | `app/[locale]/libros/page.tsx` |

**Datos de soporte:**
- `data/services.ts` -- Definiciones de servicios, contenido FAQ (4 servicios x 3 FAQs = 12 FAQs en home)
- `data/personal.ts` -- Datos personales referenciados por schemas
- `lib/constants.ts` -- `SITE_CONFIG`, `SOCIAL_LINKS`, `SEO_IMAGES`
