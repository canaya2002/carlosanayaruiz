# Auditoria SEO Completa -- carlosanayaruiz.com

> **Fecha:** 15 de abril de 2026
> **Dominio:** carlosanayaruiz.com
> **Stack:** Next.js 16 (App Router) + next-intl (es/en) + Firebase + Vercel
> **Auditor:** Claude Code (asistido por Carlos Anaya Ruiz)
> **Metodo:** Inspeccion directa del codigo fuente del repositorio

---

## Resumen Ejecutivo

El sitio tiene una base tecnica solida: SSR con Next.js App Router, datos estructurados JSON-LD con `@graph` y referencias cruzadas por `@id`, hreflang bidireccional con `x-default`, sitemap dinamico, y metadata unica por pagina en ambos idiomas.

Se encontraron **6 problemas criticos** que fueron corregidos directamente en el codigo, y **9 problemas pendientes** que requieren accion manual o decisiones de negocio.

| Categoria | Estado |
|-----------|--------|
| Indexacion y crawling | OK |
| Metadata (titles, descriptions, OG) | OK (corregido) |
| Datos estructurados (JSON-LD) | OK (corregido) |
| Hreflang / i18n | OK (corregido) |
| Navegacion e interlinking | OK (corregido) |
| Core Web Vitals | Pendiente validacion en campo |
| Contenido y autoridad | Pendiente (sin blog, sin portfolio) |
| Seguridad del formulario | Pendiente |
| Consistencia de datos | Parcialmente corregido |

---

## Tabla de Contenidos

1. [Problemas Criticos Corregidos](#parte-1--problemas-criticos-encontrados-y-corregidos)
2. [Problemas Pendientes](#parte-2--problemas-pendientes-no-corregidos-en-codigo)
3. [Lo Que Esta Bien](#parte-3--lo-que-esta-bien-no-tocar)
4. [Recomendaciones Estrategicas](#parte-4--recomendaciones-estrategicas)
5. [Checklist Post-Deploy](#parte-5--checklist-de-validacion-post-deploy)
6. [Mapa de Archivos](#mapa-de-archivos-clave)

---

## Parte 1 -- Problemas Criticos Encontrados y Corregidos

### 1.1 Bug de duplicacion de titulos

**Severidad:** Critica
**Archivos:** `app/[locale]/layout.tsx` (linea 46) + `app/[locale]/page.tsx` (linea 43)

**Problema:** El layout define un template de titulo:

```ts
// app/[locale]/layout.tsx, linea 46
title: {
  default: config.title,
  template: `%s | Carlos Anaya Ruiz`,
}
```

Las paginas internas pasaban titulos que ya contenian el nombre completo. Por ejemplo, la home page pasaba:

```
"Carlos Anaya Ruiz -- Consultor SEO Tecnico & Desarrollador Full-Stack en Mexico"
```

El resultado renderizado por Next.js era:

```
Carlos Anaya Ruiz -- Consultor SEO Tecnico... | Carlos Anaya Ruiz
```

Esto viola las best practices de Google: titulo redundante, exceso de caracteres (facilmente >70), y dilucion de la keyword principal por repeticion del nombre.

**Correccion:** Se agrego soporte para `absoluteTitle` en `lib/seo.ts` (lineas 18, 39, 56):

```ts
// lib/seo.ts, linea 56
title: absoluteTitle ? { absolute: metaTitle } : metaTitle,
```

La home page (`app/[locale]/page.tsx`, linea 53) ahora usa `absoluteTitle: true` para evitar el sufijo del template. Las paginas internas usan titulos SIN el nombre para que el template `%s | Carlos Anaya Ruiz` funcione correctamente:

- **Antes:** `"Carlos Anaya Ruiz -- Consultor SEO Tecnico en Mexico..."` -> se renderizaba como `"Carlos Anaya Ruiz -- Consultor... | Carlos Anaya Ruiz"`
- **Despues (home):** Usa `absoluteTitle: true` -> se renderiza tal cual, sin sufijo
- **Despues (internas):** `"Consultor SEO Tecnico en Mexico -- Auditorias, Schema y Rendimiento"` -> se renderiza como `"Consultor SEO Tecnico... | Carlos Anaya Ruiz"`

---

### 1.2 Error factual: IBM en las credenciales

**Severidad:** Alta
**Archivo:** `lib/constants.ts` (linea 52)

**Problema:** La meta description en espanol mencionaba "Amazon, IBM, Tec de Monterrey". Sin embargo, IBM **no existe** en `data/experience.ts`. Las empresas reales documentadas en la experiencia laboral son: Amazon, Master Loyalty Group, Wan Hai Lines.

Esto es un problema directo de E-E-A-T: Google y los usuarios pueden verificar esta informacion cruzandola con LinkedIn o el propio sitio. Un dato falso en la meta description destruye credibilidad, especialmente para alguien que se posiciona como consultor.

**Correccion:** Se removio "IBM" de la meta description en `lib/constants.ts`. Las referencias ahora mencionan solo las empresas verificables: "Amazon, Tec de Monterrey" (linea 52 en espanol, linea 79 en ingles). La lista completa de empresas (Amazon, Master Loyalty Group, Wan Hai Lines) aparece en `lib/schema.ts` (linea 33) y en `data/personal.ts` (linea 35).

---

### 1.3 SEO Tecnico ausente en los datos de servicios

**Severidad:** Alta
**Archivo:** `data/services.ts`

**Problema:** Originalmente, el servicio principal del sitio (Consultoria SEO Tecnica) no estaba definido en `data/services.ts`. Estaba hardcodeado directamente en la home page. Esto significaba:

- No generaba schema `Service` en JSON-LD (via `lib/schema.ts`, lineas 197-219)
- No generaba schema `FAQPage` para sus preguntas frecuentes
- No se incluia en el array de servicios que consume `generateServicesPageGraph()` (linea 294)
- Inconsistencia: 3 de 4 servicios tenian schema estructurado; el servicio principal, no

**Correccion:** Se agrego "Consultoria SEO Tecnica" como primer elemento del array en `data/services.ts` (ahora lineas 18-52 en espanol, 160-194 en ingles). Incluye `id`, `slug`, `title`, `headline`, `description`, `benefits`, `includes`, `icon`, y `faq`. Ahora genera `Service` schema y `FAQPage` schema identicos al resto de servicios.

---

### 1.4 Fecha de publicacion del libro incorrecta

**Severidad:** Media
**Archivo:** `data/books.ts` (linea 53)

**Problema:** El campo `publishedDate` decia `"2025-06-01"` pero estamos en abril de 2026 y el libro sigue como "coming soon" (precio: `"TBD"`, URL de compra apunta al mismo sitio: `https://carlosanayaruiz.com/es/libros`). Para Google, un producto con fecha de publicacion en el pasado que todavia no existe es una senal negativa de confiabilidad.

Nota: no se emite schema `Book` ni `Offer` para este producto (ver `lib/schema.ts`, linea 339: "no Book schema until product is real"), lo cual es correcto. Pero la fecha incorrecta en los datos internos podria filtrarse a la UI.

**Correccion:** Se actualizo `publishedDate` a `"2026-09-01"` en ambos idiomas (lineas 53 y 72 de `data/books.ts`).

---

### 1.5 Servicios inaccesibles desde la navegacion principal

**Severidad:** Alta
**Archivo:** `components/layout/header.tsx`

**Problema:** Las 4 paginas de servicio existian en el routing (`i18n/routing.ts`, lineas 21-37) y en el sitemap (`app/sitemap.ts`, lineas 15-18), pero **no tenian enlaces en el header**. Solo eran alcanzables desde:
- El footer (`components/layout/footer.tsx`, lineas 31-36)
- Haciendo scroll en la home page hasta la seccion de servicios

Consecuencias SEO:
- Baja autoridad de enlazado interno para las paginas de dinero (money pages)
- Crawl depth innecesariamente alto: 2+ clicks vs 1 click desde cualquier pagina
- Usuarios no descubrian los servicios especificos desde la navegacion

**Correccion:** Se agrego un dropdown de servicios en el header:
- Definicion: `components/layout/header.tsx`, lineas 19-24 (`SERVICE_ITEMS`)
- Dropdown desktop: lineas 67-101, con `aria-expanded` y `aria-haspopup`
- Menu mobile: lineas 143-153, con seccion etiquetada "Servicios"
- Ahora las 4 paginas de servicio estan a **1 click** desde cualquier pagina del sitio

---

### 1.6 Hreflang desalineado entre sitemap y metadata

**Severidad:** Critica
**Archivos:** `app/sitemap.ts` + `lib/seo.ts`

**Problema:** El sitemap usaba codigos de idioma simples (`es`, `en`) en las claves del objeto `alternates.languages`, mientras que la metadata de las paginas usaba codigos regionales (`es-MX`, `en-US`). Google trata `es` y `es-MX` como variantes diferentes. Esto generaba:

- Senales conflictivas para Googlebot sobre cual era la version canonica por idioma
- Potencial "hreflang mismatch": las versiones declaradas en el sitemap no coincidian con las declaradas en el `<head>` de cada pagina
- El `x-default` solo existia en metadata, no en el sitemap

**Correccion:** El sitemap (`app/sitemap.ts`, lineas 32-35 y 47-50) ahora usa `es-MX`, `en-US`, y `x-default` -- alineado perfectamente con `lib/seo.ts` (lineas 78-81) y `app/[locale]/layout.tsx` (lineas 65-69).

Verificacion rapida del alineamiento actual:

| Fuente | es | en | x-default |
|--------|----|----|-----------|
| `lib/seo.ts` (linea 78-81) | `es-MX` | `en-US` | `es` (URL) |
| `app/sitemap.ts` (linea 32-35) | `es-MX` | `en-US` | `es` (URL) |
| `app/[locale]/layout.tsx` (linea 65-69) | `es-MX` | `en-US` | `es` (URL) |

---

## Parte 2 -- Problemas Pendientes (No Corregidos en Codigo)

### 2.1 Sin verificacion de Google Search Console

**Severidad:** Critica
**Archivo afectado:** `app/[locale]/layout.tsx`

No hay meta tag de verificacion de GSC en ningun lugar del sitio. El campo `verification` no existe en el return de `generateMetadata()` (lineas 42-106).

**Impacto:** Sin Google Search Console no puedes:
- Monitorear errores de indexacion ni cobertura
- Ver que queries traen trafico organico real
- Detectar problemas de hreflang, canonical, o mobile usability
- Enviar el sitemap manualmente para acelerar indexacion
- Ver el rendimiento de Core Web Vitals en campo (CrUX data)
- Recibir alertas de manual actions o security issues

**Accion:** Verificar el dominio en Search Console y agregar el meta tag en `app/[locale]/layout.tsx` dentro de la funcion `generateMetadata`, antes del cierre del return:

```ts
// Agregar dentro del return de generateMetadata, despues de "robots"
verification: {
  google: 'TU_TOKEN_DE_VERIFICACION_AQUI',
},
```

**Prioridad:** Hacer esto HOY. Es el paso cero de cualquier estrategia SEO. Sin GSC, todo lo demas es volar a ciegas.

---

### 2.2 Formulario de contacto sin validacion server-side ni anti-spam

**Severidad:** Alta
**Archivo:** `components/sections/contact-form.tsx`

El formulario actual (lineas 19-29):
1. Solo tiene validacion HTML nativa (`required` en lineas 77, 91, 105, 122; `type="email"` en linea 88)
2. No hay validacion del lado del servidor antes de escribir en Firestore
3. No hay reCAPTCHA, honeypot, rate limiting, ni ninguna proteccion anti-spam
4. Los datos van directamente a Firebase via `sendContactMessage()` (linea 22)

**Riesgos concretos:**
- Bots pueden enviar miles de mensajes de spam a tu Firestore (costo de Firebase por escrituras)
- Sin rate limiting, un script puede saturar tu base de datos en minutos
- Datos malformados o maliciosos (XSS payloads, SQL injection strings) pasan al backend sin sanitizar
- El campo `subject` y `message` no tienen limite de longitud -- un bot puede enviar megabytes de texto

**Accion recomendada (por prioridad):**
1. **Inmediato (1 hora):** Agregar un campo honeypot (input hidden que bots llenan pero usuarios no ven)
2. **Esta semana:** Implementar reCAPTCHA v3 de Google (invisible, sin friccion para el usuario)
3. **Este mes:** Agregar validacion con zod o yup del lado del servidor: largo maximo de campos, regex de email real, sanitizacion de HTML/scripts

---

### 2.3 Imagenes de awards no existen en public/

**Severidad:** Media
**Archivo:** `data/awards.ts` (lineas 22, 29, 41)

Las 3 imagenes referenciadas no existen:
- `/images/awards/nasa-spaceapps.png` -- Referenciada en linea 22
- `/images/awards/logiroute.png` -- Referenciada en linea 29
- `/images/awards/toefl.png` -- Referenciada en linea 41

El directorio `public/images/` **no existe** en absoluto. El contenido actual de `public/` es:

```
public/
  apple-touch-icon.png
  carlos-anaya-ruiz-software.png
  favicon.ico
  icon-192.png
  icon-512.png
  manifest.json
  og-default.png
  og-en.png
  og-es.png
```

**Impacto:**
- 3 errores 404 en la pagina `/sobre-mi` (section de awards)
- CLS (Cumulative Layout Shift) si el componente reserva espacio para imagenes que nunca cargan
- Errores reportados en Lighthouse y Search Console
- Crawl budget desperdiciado en recursos inexistentes

**Accion:** Crear `public/images/awards/` y agregar las 3 imagenes. Si no tienes las imagenes, actualiza las rutas en `data/awards.ts` a un placeholder generico o remueve el campo `image` temporalmente.

---

### 2.4 Skills inflados que diluyen senal de expertise

**Severidad:** Media
**Archivo:** `data/skills.ts`

La seccion "Stack & Especialidades" de la home page (renderizada desde `data/skills.ts`) lista tecnologias que no aparecen en ningun proyecto, experiencia laboral, o servicio del sitio:

| Tecnologia | Linea | Aparece en experiencia/proyectos? |
|-----------|-------|----------------------------------|
| Go | 11 | No |
| Rust | 11 | No |
| Svelte | 19 | No |
| Swift (UIKit) | 19 | No |
| Kotlin (Jetpack) | 19 | No |

**Impacto E-E-A-T:** Listar tecnologias que no puedes respaldar con proyectos reales o experiencia documentada diluye tu autoridad. Para Google y para un visitante humano, un consultor que dice dominar 40 tecnologias es menos creible que uno que demuestra profundidad en 15. Ademas, el `knowsAbout` del Person schema (`lib/schema.ts`, lineas 42-71) no incluye ninguna de estas tecnologias -- hay inconsistencia entre lo que el schema dice y lo que la UI muestra.

**Accion:** Remover las tecnologias que no puedas respaldar con al menos un proyecto real o experiencia laboral documentada. Es mejor tener 25 skills solidos que 35 inflados. Si en el futuro agregas un proyecto en Go o Rust, puedes reincorporarlos con evidencia.

---

### 2.5 Sin blog ni seccion de contenidos

**Severidad:** Alta (estrategica)

El sitio tiene 8 paginas estaticas y cero contenido editorial. No existe blog, guias, articulos, tutoriales, ni ningun recurso indexable de formato largo.

**Impacto:**
- Sin contenido indexable para long-tail keywords informativas
- Sin oportunidad de internal linking tematico hacia las paginas de servicio
- Sin demostracion practica de expertise (los pilares "Experience" y "Expertise" de E-E-A-T)
- Sin contenido para compartir en redes o ganar backlinks naturales
- El libro anunciado en `/libros` no tiene contenido de soporte (excerpts, capitulos de muestra, articulos derivados que generen interes)
- Limite de 8 URLs en el indice de Google -- muy poco para competir por autoridad tematica

**Accion recomendada:**
1. Crear una seccion `/blog` o `/articulos` con MDX y App Router
2. Priorizar articulos que demuestren tu expertise real:
   - "Como implementar Schema JSON-LD con @graph en Next.js"
   - "Auditoria de Core Web Vitals paso a paso con Lighthouse CI"
   - "Migracion SEO de WordPress a Next.js sin perder rankings"
   - "Hreflang en Next.js con next-intl: la guia definitiva"
3. Cada articulo debe enlazar a las paginas de servicio relevantes (interlinking)
4. Agregar `Article` schema con `author` que referencie `Person` por `@id`
5. Meta: 2-4 articulos al mes para empezar

---

### 2.6 Sin pagina de portfolio o casos de estudio

**Severidad:** Media-Alta (estrategica)

No hay pagina que muestre proyectos completados, resultados medibles, ni testimonios de clientes.

**Impacto:**
- Sin prueba social para convertir visitantes en clientes potenciales
- Sin demostracion de "Experience" -- el primer E de E-E-A-T
- Las paginas de servicio hacen promesas ("Auditorias SEO completas", "Lighthouse 90+") pero no muestran evidencia
- Los competidores que si muestran casos de exito tendran mayor tasa de conversion

**Accion:** Crear `/portfolio` o `/casos` con al menos 3-5 proyectos que incluyan:
- Problema del cliente
- Solucion implementada
- Stack usado
- Resultado medible (% de mejora en CWV, incremento en trafico organico, reduccion de errores de indexacion, etc.)

---

### 2.7 Email de contacto poco profesional

**Severidad:** Baja-Media
**Archivos:** `lib/constants.ts` (linea 112), `data/personal.ts` (lineas 30, 54)

El email de contacto publico es `carlosaremployment@hotmail.com`. Este email aparece en:
- Person schema via `mailto:` (linea 34 de `lib/schema.ts`)
- Footer del sitio (linea 49 de `components/layout/footer.tsx`)
- Pagina de contacto
- Hero de la home page (linea 200 de `app/[locale]/page.tsx`)

**Impacto:** Para un consultor SEO tecnico que vende servicios profesionales a empresas, un email de Hotmail transmite falta de profesionalismo. Los clientes potenciales -- especialmente empresas medianas y grandes -- esperan un email de dominio propio como senal de legitimidad.

**Accion:** Configurar email con dominio propio: `carlos@carlosanayaruiz.com` o `hola@carlosanayaruiz.com`. Opciones economicas: Google Workspace ($6/mes), Zoho Mail (gratis para 1 usuario), o el email incluido con tu registrador de dominio.

---

### 2.8 Dos cuentas de GitHub en sameAs

**Severidad:** Baja
**Archivos:** `lib/constants.ts` (lineas 110-111), `data/personal.ts` (linea 40), `lib/schema.ts` (lineas 146-147)

Hay dos URLs de GitHub en el array `sameAs` del Person schema:
- `https://github.com/CArlos12002` (linea 110)
- `https://github.com/canaya2002` (linea 111)

Ambos aparecen en el schema `Person` (lineas 146-147 de `lib/schema.ts`), en los links sociales del hero, y en los datos personales.

**Impacto:** El Knowledge Graph de Google intenta construir una entidad unica a partir de todas las senales. Dos perfiles de GitHub con nombres de usuario diferentes pueden fragmentar la asociacion de entidad. No es critico, pero es ruido innecesario que un competidor con senales mas limpias no tendria.

**Accion:** Elegir una cuenta principal (la que tenga mas actividad, repos relevantes, o mejor alineacion con tu nombre profesional) y usar solo esa en `sameAs` y en los links visibles. La otra cuenta puede seguir existiendo pero no necesita estar en los datos estructurados ni en la UI.

---

### 2.9 Imagenes OG pueden necesitar actualizacion

**Severidad:** Baja
**Archivos:** `public/og-default.png`, `public/og-es.png`, `public/og-en.png`

Las 3 imagenes OG existen y estan referenciadas con dimensiones correctas (1200x630 en `lib/seo.ts`, lineas 93-98). Sin embargo, deben verificarse:

- Que el texto sea legible en el preview de WhatsApp, LinkedIn, Twitter y Facebook
- Que reflejen los 4 servicios actuales (SEO Tecnico, Desarrollo Web, IA, Dashboards)
- Que la foto profesional este actualizada
- Que el dominio `carlosanayaruiz.com` sea visible en la imagen

**Accion:** Verificar con https://www.opengraph.xyz/ y la herramienta de debug de Facebook/LinkedIn como se renderizan. Regenerar si el branding ha cambiado desde la ultima vez que se crearon.

---

## Parte 3 -- Lo Que Esta Bien (No Tocar)

### 3.1 Arquitectura de datos estructurados

El sistema de JSON-LD esta bien arquitectado con `@graph` y `@id` references cruzadas:

**Layout level** (`app/[locale]/layout.tsx`, lineas 128-133):
- Inyecta un `<script type="application/ld+json">` con `@graph` conteniendo `Person` + `WebSite` en todas las paginas
- El `Person` schema (`lib/schema.ts`, lineas 8-156) incluye:
  - `@id: "https://carlosanayaruiz.com/#person"` -- referenciable desde cualquier otro schema
  - `alternateName` con variaciones del nombre (con y sin acento en Ruiz)
  - `knowsAbout` con 28 competencias verificables
  - `hasCredential` con PMP, TOEFL, y titulos universitarios (con `recognizedBy`)
  - `hasOccupation` con `occupationLocation`
  - `worksFor` referenciando un `ProfessionalService` con `@id`
  - `sameAs` con LinkedIn, GitHub, y Fiverr
  - `nationality`, `knowsLanguage`, `address`

**Page level** -- cada pagina inyecta su propio `@graph`:

| Pagina | Schemas | Funcion en `lib/schema.ts` |
|--------|---------|---------------------------|
| Home | WebPage + Service x4 + FAQPage | `generateServicesPageGraph()` (linea 293) |
| SEO Tecnico | WebPage + Service + FAQPage + BreadcrumbList | `generateServicePageGraph()` (linea 317) |
| Desarrollo Web | WebPage + Service + FAQPage + BreadcrumbList | `generateServicePageGraph()` (linea 317) |
| Automatizacion IA | WebPage + Service + FAQPage + BreadcrumbList | `generateServicePageGraph()` (linea 317) |
| Dashboards | WebPage + Service + FAQPage + BreadcrumbList | `generateServicePageGraph()` (linea 317) |
| About | WebPage + BreadcrumbList | `generateAboutPageGraph()` (linea 366) |
| Contact | WebPage + BreadcrumbList | `generateContactPageGraph()` (linea 395) |
| Books | WebPage + BreadcrumbList | `generateBooksPageGraph()` (linea 340) |

Todas las referencias cruzadas usan `@id` correctamente:
- `provider: { '@id': 'https://carlosanayaruiz.com/#person' }`
- `isPartOf: { '@id': 'https://carlosanayaruiz.com/#website' }`
- `publisher: { '@id': 'https://carlosanayaruiz.com/#person' }`

---

### 3.2 Hreflang e internacionalizacion

La implementacion de i18n es correcta despues de las correcciones:

- **Routing:** `i18n/routing.ts` usa `localePrefix: 'always'` -- todas las URLs tienen prefijo de idioma, eliminando ambiguedad
- **Pathnames localizados:** `/seo-tecnico` (es) vs `/technical-seo` (en), `/sobre-mi` vs `/about`, `/contacto` vs `/contact`, `/libros` vs `/books`
- **Hreflang en metadata** (`lib/seo.ts`, lineas 78-81): `es-MX`, `en-US`, `x-default` apuntando a `/es`
- **Hreflang en sitemap** (`app/sitemap.ts`, lineas 32-35): Alineado con metadata
- **OG locale:** `es_MX` y `en_US` correctos (`lib/constants.ts`, lineas 53, 80)
- **HTML lang:** `<html lang={locale}>` en layout (linea 125)
- **Schema inLanguage:** `es-MX` y `en-US` en `WebSite` y `WebPage` schemas

---

### 3.3 Sitemap

`app/sitemap.ts` genera correctamente:

- **16 entradas** (8 paginas x 2 idiomas)
- Prioridades diferenciadas y razonables:
  - Home: `1.0`
  - Servicios (SEO, Dev): `0.9`
  - Servicios (IA, Dashboards): `0.8`
  - About: `0.8`
  - Contact: `0.7`
  - Books: `0.6`
- `lastModified` dinamico con `new Date()`
- Alternates con `es-MX`, `en-US`, `x-default` en cada entrada
- Referenciado correctamente en `robots.ts` (linea 9)

---

### 3.4 robots.txt

`app/robots.ts` genera:

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /private/
Sitemap: https://carlosanayaruiz.com/sitemap.xml
Host: https://carlosanayaruiz.com
```

Correcto y minimalista. No bloquea nada que deba ser indexado.

---

### 3.5 Accesibilidad basica

- Skip-to-content link: `layout.tsx`, linea 137
- `aria-label` en todos los iconos de redes sociales (hero, footer)
- `aria-hidden="true"` en iconos decorativos (Lucide icons en servicios, proceso)
- `role="doc-subtitle"` en subtitulo del hero
- `aria-expanded` y `aria-haspopup="true"` en dropdown de servicios del header (lineas 74-75)
- `aria-label="Breadcrumb"` en navegacion de migas de pan (`breadcrumbs.tsx`, linea 26)
- `aria-current="page"` en el breadcrumb activo (linea 42)
- Labels `<label htmlFor="">` asociados a todos los inputs del formulario de contacto (lineas 67, 81, 97, 113)
- Alt texts descriptivos con nombre completo en imagenes (`SEO_IMAGES.avatarAlt` en `lib/constants.ts`, lineas 31-34)

---

### 3.6 Performance basics

- **Fuentes:** `display: 'swap'` en Inter y Playfair Display (`layout.tsx`, lineas 18, 26) -- no bloquean renderizado
- **Imagenes above-the-fold:** `priority` en el avatar del hero (`page.tsx`, linea 114)
- **Sizes optimizados:** `sizes="(max-width: 768px) 80px, 96px"` en avatar, `sizes="(max-width: 768px) 144px, 160px"` en about
- **Analytics:** Vercel Speed Insights + Analytics integrados (`layout.tsx`, lineas 148-149)
- **PWA:** `manifest.json` configurado correctamente con iconos 192x192 y 512x512
- **Client Components minimizados:** Solo `Header`, `ContactForm`, `Newsletter`, y `LanguageSwitcher` hidratan en el cliente; todas las paginas son Server Components

---

### 3.7 Metadata unica por pagina

Cada una de las 8 paginas genera metadata unica via `generatePageMetadata()` de `lib/seo.ts`:

| Pagina | Title unico | Description unica | Keywords extras | Canonical | OG |
|--------|-------------|-------------------|-----------------|-----------|-----|
| Home | Si (absoluteTitle) | Si | Si (18 kw) | Si | Si |
| About | Si | Si | Heredadas del layout | Si | Si |
| Contact | Si | Si | Heredadas del layout | Si | Si |
| Books | Si | Si | Heredadas del layout | Si | Si |
| SEO Tecnico | Si | Si | Si (10 kw especificas) | Si | Si |
| Desarrollo Web | Si | Si | Si (especificas) | Si | Si |
| IA/Chatbots | Si | Si | Si (especificas) | Si | Si |
| Dashboards | Si | Si | Si (especificas) | Si | Si |

Cada pagina tiene ademas:
- `canonical` URL unica
- `alternates.languages` con hreflang bidireccional
- `openGraph` con imagen, titulo, y descripcion localizados
- `twitter` card con imagen

---

### 3.8 Interlinking

Despues de las correcciones, la estructura de enlaces internos es:

**Header** (`components/layout/header.tsx`):
- Home, dropdown con 4 servicios, About, Books, Contact
- CTA a Fiverr, language switcher
- Accesible desde todas las paginas

**Footer** (`components/layout/footer.tsx`):
- Columna "Servicios": 4 links a paginas de servicio (lineas 31-36)
- Columna "Navegacion": Home, About, Books, Contact (lineas 42-45)
- Columna "Contacto": Email, LinkedIn, Fiverr (lineas 49-51)
- Redes sociales con `rel="me"`: LinkedIn, GitHub, Email (lineas 23-25)

**Home page:**
- CTAs a `#servicios` anchor, `/contacto`, `/sobre-mi`
- Cards de servicio con links a cada pagina de servicio individual
- Links sociales con `rel="me noopener noreferrer"`

**Paginas de servicio:**
- Breadcrumbs (UI visible + JSON-LD)
- Seccion "Servicios Relacionados" con links cruzados
- CTAs a `/contacto` y Fiverr

**Todas las paginas internas:**
- Breadcrumbs con link a Home

---

## Parte 4 -- Recomendaciones Estrategicas

### Corto plazo (esta semana)

| # | Accion | Archivo(s) | Impacto |
|---|--------|-----------|---------|
| 1 | Verificar Google Search Console y agregar meta tag | `app/[locale]/layout.tsx` | **Critico** -- sin esto no hay visibilidad |
| 2 | Crear `public/images/awards/` y agregar las 3 imagenes | `public/images/awards/` | Elimina 404s, mejora CLS |
| 3 | Agregar honeypot al formulario de contacto | `components/sections/contact-form.tsx` | Seguridad basica anti-spam |
| 4 | Revisar y depurar lista de skills | `data/skills.ts` | Mejora credibilidad E-E-A-T |

### Mediano plazo (este mes)

| # | Accion | Impacto |
|---|--------|---------|
| 5 | Configurar email con dominio propio | Profesionalismo, confianza |
| 6 | Implementar reCAPTCHA v3 en formulario de contacto | Seguridad robusta |
| 7 | Elegir una cuenta de GitHub principal para sameAs | Claridad de senal de entidad |
| 8 | Validar OG images en herramientas de preview social | Social sharing correcto |
| 9 | Verificar sitio en Bing Webmaster Tools | Cobertura de indexacion adicional |
| 10 | Agregar validacion server-side con zod en el formulario | Seguridad, integridad de datos |

### Largo plazo (este trimestre)

| # | Accion | Impacto |
|---|--------|---------|
| 11 | Crear seccion de blog con 4-8 articulos tecnicos iniciales | Autoridad tematica, long-tail keywords, backlinks |
| 12 | Crear pagina de portfolio/casos de estudio | Confianza, conversion, demostracion de Experience |
| 13 | Implementar `Article` schema para posts del blog | Rich results para articulos |
| 14 | Agregar pagina de testimonios con `Review` schema | Social proof, rich results |
| 15 | Considerar `LocalBusiness` o `ProfessionalService` schema | Senales de SEO local para CDMX |
| 16 | Considerar pagina de pricing con `Offer` schema | Conversion, transparencia |

---

## Parte 5 -- Checklist de Validacion Post-Deploy

Ejecutar estas verificaciones cada vez que se haga deploy a produccion:

- [ ] Google Rich Results Test en las 16 URLs principales (8 paginas x 2 idiomas)
- [ ] Schema Markup Validator (schema.org/validator) en todas las paginas con JSON-LD
- [ ] Lighthouse en mobile para cada pagina (targets: performance >90, SEO >95, accessibility >90)
- [ ] Verificar `sitemap.xml` accesible y parseable en `https://carlosanayaruiz.com/sitemap.xml`
- [ ] Verificar `robots.txt` accesible en `https://carlosanayaruiz.com/robots.txt`
- [ ] Verificar que todas las canonical URLs resuelven con HTTP 200
- [ ] Verificar hreflang bidireccional: cada pagina `/es/X` apunta a `/en/Y` y viceversa
- [ ] Verificar OG previews con https://www.opengraph.xyz/
- [ ] Verificar que no hay errores 404 con Screaming Frog o `curl` a las imagenes de awards
- [ ] Verificar que `manifest.json` es accesible y valido
- [ ] Revisar Search Console (si ya esta verificado) por errores de cobertura nuevos

---

## Mapa de Archivos Clave

```
carlosanayaruiz/
  app/
    [locale]/
      layout.tsx                  <- Metadata base, title template, JSON-LD Person+WebSite
      page.tsx                    <- Home, absoluteTitle, JSON-LD Services+FAQ
      sobre-mi/page.tsx           <- About, JSON-LD WebPage+Breadcrumbs
      contacto/page.tsx           <- Contact, JSON-LD WebPage+Breadcrumbs
      libros/page.tsx             <- Books, JSON-LD WebPage+Breadcrumbs
      seo-tecnico/page.tsx        <- Servicio SEO, JSON-LD Service+FAQ+Breadcrumbs
      desarrollo-web/page.tsx     <- Servicio Dev, JSON-LD Service+FAQ+Breadcrumbs
      automatizacion-ia/page.tsx  <- Servicio IA, JSON-LD Service+FAQ+Breadcrumbs
      dashboards/page.tsx         <- Servicio Dashboards, JSON-LD Service+FAQ+Breadcrumbs
    sitemap.ts                    <- Sitemap dinamico, 16 entradas, hreflang alineado
    robots.ts                     <- robots.txt: allow /, disallow /api/ y /private/
  components/
    layout/
      header.tsx                  <- Nav principal con dropdown de servicios
      footer.tsx                  <- Footer con servicios + navegacion + contacto
      breadcrumbs.tsx             <- Breadcrumbs UI (JSON-LD se genera por separado)
    sections/
      contact-form.tsx            <- Formulario de contacto (SIN anti-spam -- PENDIENTE)
  data/
    services.ts                   <- 4 servicios con benefits, includes, FAQ (CORREGIDO)
    personal.ts                   <- Datos personales bilingues
    skills.ts                     <- Skills por categoria (NECESITA DEPURACION -- pendiente 2.4)
    books.ts                      <- Libro placeholder, publishedDate corregido a 2026-09-01
    awards.ts                     <- Awards (IMAGENES NO EXISTEN -- pendiente 2.3)
    experience.ts                 <- Experiencia laboral (Amazon, MLG, Wan Hai Lines)
    education.ts                  <- Educacion (Tec de Monterrey)
  i18n/
    routing.ts                    <- Locales, pathnames localizados, localePrefix:'always'
  lib/
    constants.ts                  <- SITE_CONFIG, SEO_IMAGES, getSiteConfig, SOCIAL_LINKS
    seo.ts                        <- generatePageMetadata() con absoluteTitle (CORREGIDO)
    schema.ts                     <- Todos los generadores de JSON-LD con @graph + @id
  messages/
    es.json                       <- Traducciones espanol
    en.json                       <- Traducciones ingles
  public/
    manifest.json                 <- PWA manifest
    og-default.png                <- OG image default 1200x630
    og-es.png                     <- OG image espanol 1200x630
    og-en.png                     <- OG image ingles 1200x630
    carlos-anaya-ruiz-software.png <- Foto profesional principal
    apple-touch-icon.png          <- 180x180
    icon-192.png                  <- PWA icon 192x192
    icon-512.png                  <- PWA icon 512x512
    favicon.ico                   <- Browser tab icon
    (FALTA: images/awards/*.png)  <- 3 imagenes de awards -- PENDIENTE
```

---

## Notas Finales

Este sitio tiene una implementacion tecnica por encima del promedio para un sitio personal/profesional. La arquitectura de datos estructurados con `@graph` y `@id` es correcta, el sistema de i18n con pathnames localizados y hreflang bidireccional esta bien implementado, y cada pagina tiene metadata unica y especifica.

Los gaps principales ya no son tecnicos sino **estrategicos**: falta contenido editorial para demostrar expertise (blog), falta evidencia de resultados (portfolio/casos), y hay detalles de presentacion profesional que resolver (email de dominio, skills inflados, imagenes faltantes).

**La prioridad numero uno es verificar Google Search Console.** Sin eso, no hay forma de saber si las correcciones hechas estan surtiendo efecto, ni de detectar nuevos problemas de indexacion. Todo lo demas es secundario.

---

*Auditoria generada mediante inspeccion directa del codigo fuente el 15 de abril de 2026.*
