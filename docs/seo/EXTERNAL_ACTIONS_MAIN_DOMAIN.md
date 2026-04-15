# Acciones Externas para carlosanayaruiz.com

> Tareas de SEO off-site que deben completarse manualmente. Cada seccion incluye pasos concretos, resultado esperado y nivel de prioridad.
> Ultima actualizacion: 2026-04-15

---

## 1. Google Search Console — Configuracion y Verificacion

**Prioridad:** CRITICA (sin esto no hay visibilidad sobre indexacion ni rendimiento)

### Pasos

1. Ir a [Google Search Console](https://search.google.com/search-console).
2. Agregar propiedad tipo "Dominio": `carlosanayaruiz.com`.
   - Esto cubre `www.carlosanayaruiz.com`, `carlosanayaruiz.com`, `https://` y `http://` automaticamente.
   - Verificacion via registro DNS TXT en el proveedor del dominio.
3. Alternativa si no se tiene acceso DNS: Agregar propiedad tipo "Prefijo de URL": `https://carlosanayaruiz.com`.
   - Verificar con el meta tag HTML o archivo de verificacion.
4. Una vez verificada:
   - Enviar sitemap: `https://carlosanayaruiz.com/sitemap.xml`.
   - Verificar que las 16 URLs aparecen en "Paginas indexadas".
   - Configurar notificaciones por email para problemas de indexacion.
5. Solicitar indexacion manual de las 4 money pages:
   - `/es/seo-tecnico`
   - `/es/desarrollo-web`
   - `/es/automatizacion-ia`
   - `/es/dashboards`
   - Y sus equivalentes en ingles.

### Resultado esperado
- Visibilidad completa sobre consultas de busqueda, impresiones, clics y posicion promedio.
- Deteccion temprana de problemas de indexacion, errores de rastreo y caidas de ranking.

---

## 2. Google Business Profile (Perfil de Negocio de Google)

**Prioridad:** ALTA (refuerza entity, aparece en busquedas locales "consultor SEO CDMX")

### Evaluacion de elegibilidad

Carlos Anaya Ruiz ofrece servicios profesionales desde Ciudad de Mexico. Aunque no tiene oficina fisica abierta al publico, Google permite perfiles de "Area de servicio" para consultores y freelancers que atienden clientes en una region definida.

### Pasos

1. Ir a [Google Business Profile](https://business.google.com/).
2. Crear perfil con los siguientes datos:
   - **Nombre del negocio:** Carlos Anaya Ruiz — Consultor SEO Tecnico y Desarrollo Web
   - **Categoria principal:** "Consultor de marketing en Internet" o "Consultoria de desarrollo web"
   - **Categorias secundarias:** "Servicio de desarrollo de software", "Servicio de SEO"
   - **Area de servicio:** Ciudad de Mexico, Estado de Mexico, Mexico (nacional), Estados Unidos (remoto)
   - **Sitio web:** `https://carlosanayaruiz.com`
   - **Telefono:** +52 55 4416 7974
   - **Email:** Usar el email profesional (ver seccion 6 sobre email)
   - **Descripcion:** Usar el `shortBio` de `data/personal.ts`:
     > "Ingeniero de software y consultor SEO tecnico en Mexico. Construyo sitios web rapidos, indexables y que convierten — con Next.js, Firebase, IA y datos estructurados."
3. Verificar el perfil (Google enviara postal o verificara por telefono/video).
4. Agregar fotos: usar la misma foto de `carlos-anaya-ruiz-software.png`.
5. Publicar al menos un post de Google Business una vez al mes.

### Resultado esperado
- Aparicion en Knowledge Panel lateral para busquedas de marca.
- Visibilidad en busquedas locales "consultor SEO Ciudad de Mexico".
- Refuerzo de la entidad "Carlos Anaya Ruiz" en el Knowledge Graph de Google.

---

## 3. LinkedIn — Alineacion con el Sitio

**Prioridad:** ALTA (principal fuente de credibilidad profesional y backlinks `rel="me"`)

### Perfil actual
URL: `https://www.linkedin.com/in/carlos-anaya-ruiz-732abb249/`

### Acciones de alineacion

1. **Titular (Headline):** Debe coincidir con el del sitio.
   - Recomendado: "Consultor SEO Tecnico & Desarrollador Full-Stack | Next.js, Firebase, IA | PMP Certified"
   - Incluir las mismas palabras clave que el sitio.

2. **Seccion "Acerca de" (About):** Usar el `summary` de `data/personal.ts` como base, adaptado al tono de LinkedIn.

3. **URL personalizada:** Intentar obtener `linkedin.com/in/carlosanayaruiz` en lugar de la actual con numeros aleatorios.
   - Ir a LinkedIn > Editar perfil > Editar URL del perfil publico.
   - Si `carlosanayaruiz` no esta disponible, probar `carlos-anaya-ruiz`.

4. **Enlace al sitio web:** Asegurar que `carlosanayaruiz.com` esta como sitio web principal.

5. **Experiencia:** Debe reflejar las mismas empresas y roles que aparecen en la pagina Sobre Mi:
   - Amazon (Area Manager)
   - Master Loyalty Group (Full-Stack Developer)
   - Wan Hai Lines (Software Engineer)
   - Freelance/Independiente (actual — Consultor SEO & Desarrollo Web)

6. **Educacion:** Tecnologico de Monterrey — Ingenieria en Tecnologias Computacionales.

7. **Certificaciones:** PMP, TOEFL (92), certificaciones de Drive.

8. **Aptitudes (Skills):** Agregar y ordenar para que coincidan con los `knowsAbout` del schema Person:
   - Technical SEO, Next.js, React, TypeScript, Firebase, Python, Project Management.

9. **Publicar contenido:** Al menos 1 post al mes sobre SEO tecnico, desarrollo web o proyectos. Incluir enlace a `carlosanayaruiz.com` cuando sea relevante.

### Resultado esperado
- Consistencia de entidad entre LinkedIn y el sitio web.
- Backlink `rel="me"` desde el sitio refuerza la conexion.
- Google puede usar datos de LinkedIn para el Knowledge Panel.

---

## 4. GitHub — Consolidacion de Perfiles

**Prioridad:** MEDIA (afecta credibilidad tecnica y consolidacion de entidad)

### Situacion actual

Existen 2 perfiles de GitHub:
- `https://github.com/CArlos12002` — Enlazado en el sitio (footer, home, sobre-mi, contacto)
- `https://github.com/canaya2002` — Definido en `SOCIAL_LINKS.github2` pero NO enlazado en ningun componente visible. Es el usuario git del repositorio.

### Estrategia de consolidacion

**Opcion A: Usar `canaya2002` como perfil principal (recomendada)**

1. `canaya2002` es el perfil que tiene el commit history del sitio. Usarlo como principal.
2. Actualizar `SOCIAL_LINKS.github1` en `lib/constants.ts` para apuntar a `canaya2002`.
3. En el perfil `canaya2002`:
   - Agregar bio: "Technical SEO Consultant & Full-Stack Developer. Next.js, Firebase, TypeScript."
   - Agregar sitio web: `https://carlosanayaruiz.com`
   - Agregar foto de perfil: la misma del sitio.
   - Pinear el repositorio `carlosanayaruiz` como proyecto destacado.
4. En el perfil `CArlos12002`:
   - Agregar nota en la bio apuntando al perfil principal: "Moved to @canaya2002"
   - O hacer un fork visible del sitio ahi tambien.

**Opcion B: Usar `CArlos12002` como perfil principal**

1. Mover/transferir repositorios activos a `CArlos12002`.
2. Actualizar `SOCIAL_LINKS.github2` para que no se use.
3. Configurar git en local para commitear como `CArlos12002`.

### Accion inmediata independiente de la opcion

- Actualizar el schema Person en `lib/schema.ts` para que `sameAs` incluya solo el perfil activo principal.
- Actualizar `data/personal.ts` para que `github[]` tenga el perfil principal primero.
- En el perfil elegido, asegurar que la foto, bio y enlace al sitio estan configurados.

---

## 5. Fiverr — Alineacion de Perfil

**Prioridad:** MEDIA (canal de conversion activo)

### Perfil actual
URL: `https://es.fiverr.com/s/995D62d`

### Acciones

1. **Titulo de perfil:** Debe reflejar los servicios del sitio.
   - Recomendado: "Technical SEO Consultant & Next.js Developer | Audits, Schema, CWV"

2. **Descripcion:** Usar los mismos puntos de valor que las money pages:
   - Auditorias SEO tecnicas
   - Desarrollo web con Next.js y Firebase
   - Automatizacion con IA y chatbots
   - Dashboards empresariales

3. **Portfolio:** Agregar screenshots o descripciones de carlosanayaruiz.com como ejemplo de trabajo propio.

4. **Enlace al sitio:** Verificar que el perfil de Fiverr enlaza de vuelta a `carlosanayaruiz.com`.

5. **Idioma:** Mantener perfil bilingue si Fiverr lo permite, o crear 2 gigs (uno en espanol, otro en ingles).

6. **Palabras clave en gigs:** Usar las mismas keywords del sitio:
   - "technical SEO audit", "Next.js development", "AI chatbot", "data dashboard"

---

## 6. Email Profesional

**Prioridad:** ALTA (credibilidad de marca y consolidacion de entidad)

### Situacion actual

El email usado en todo el sitio y schema es: `carlosaremployment@hotmail.com`

**Problemas:**
- Un email de Hotmail transmite imagen no profesional.
- No esta asociado al dominio carlosanayaruiz.com.
- Puede afectar la percepcion de credibilidad en clientes potenciales.
- Google Business Profile se ve mas legitimo con email del dominio propio.

### Solucion recomendada

1. **Configurar email del dominio:** `carlos@carlosanayaruiz.com` o `hola@carlosanayaruiz.com`.
   - Si el dominio esta en Vercel, usar un servicio de email:
     - **Opcion economica:** Zoho Mail (gratis para 1 usuario con dominio propio).
     - **Opcion completa:** Google Workspace (~$6 USD/mes).
     - **Opcion intermedia:** Cloudflare Email Routing (gratis, redirige a otra bandeja) + alias para enviar.

2. **Actualizar en el codigo:**
   - `lib/constants.ts`: `SOCIAL_LINKS.email`
   - `data/personal.ts`: `email` en ambos locales
   - `lib/schema.ts`: El campo `email` del Person schema se genera desde `SOCIAL_LINKS.email`

3. **Actualizar en plataformas externas:**
   - Google Business Profile
   - LinkedIn (email de contacto)
   - Fiverr (email de cuenta o contacto visible)
   - Google Search Console

4. **Configurar registros DNS:**
   - MX records apuntando al proveedor de email elegido.
   - SPF, DKIM y DMARC para evitar que los emails caigan en spam.

5. **Mantener el email de Hotmail como redireccion** si se quiere centralizar la bandeja.

### Resultado esperado
- Profesionalismo percibido.
- Consistencia de marca (dominio = email = sitio).
- Mejor deliverability si se envian emails de contacto.

---

## 7. Estrategia de Backlinks

**Prioridad:** ALTA (autoridad de dominio para un sitio nuevo)

### 7.1 Backlinks de alta autoridad accesibles

| Fuente | Tipo | Accion | Dificultad |
|--------|------|--------|------------|
| **Tec de Monterrey Alumni** | Directorio de egresados | Registrarse en la red de alumni y agregar enlace al sitio. Verificar si EXATEC tiene directorio publico. | Baja |
| **LinkedIn** | Perfil social | Ya enlazado con `rel="me"`. Verificar que el sitio aparece en "Contacto" del perfil. | Ya hecho |
| **GitHub** | Perfil social | Agregar enlace al sitio en la bio del perfil principal. | Baja |
| **Fiverr** | Perfil de plataforma | Verificar que el perfil enlaza al sitio. | Baja |
| **Google Business Profile** | Local SEO | Enlace al sitio desde el perfil de negocio. | Media (requiere verificacion) |

### 7.2 Estrategia de guest posting

| Publicacion objetivo | Tema propuesto | Contacto |
|---------------------|----------------|----------|
| Blog de Vercel / Next.js | "Building a bilingual SEO-optimized personal brand site with Next.js 16" | Enviar propuesta a community@vercel.com o publicar en dev.to |
| Moz Blog | "Technical SEO checklist for Next.js App Router sites" | Buscar contributor guidelines en moz.com |
| Search Engine Journal | "Structured Data implementation for personal brand sites" | Buscar contributor program |
| freeCodeCamp | "Full-stack SEO: How to build an indexable Next.js site from scratch" | Contribuir via GitHub |
| Medium (publicaciones SEO en espanol) | "Guia de SEO tecnico para sitios Next.js" | Crear cuenta y publicar |
| Dev.to | Articulos tecnicos sobre Next.js, Firebase, schema | Crear cuenta, publicar, enlazar al sitio |

### 7.3 Backlinks de directorio profesional

| Directorio | Elegibilidad | Accion |
|-----------|-------------|--------|
| Clutch.co | Freelancers y agencias | Crear perfil gratuito como consultor independiente |
| Upwork | Freelancers | Crear perfil con enlace al sitio |
| Toptal | Desarrolladores de alto nivel | Aplicar al proceso de seleccion |
| Stack Overflow | Desarrolladores | Responder preguntas de SEO/Next.js con enlace al sitio en el perfil |

### 7.4 Backlinks academicos y de comunidad

| Fuente | Accion |
|--------|--------|
| NASA Space Apps Challenge | Buscar si el proyecto AuraScope esta publicado en la galeria de Space Apps |
| Comunidad PMP Mexico | Directorio de profesionales certificados |
| Comunidad Next.js / Vercel | Participar en Discord, contribuir a repos open source |

---

## 8. Consolidacion de Entidad de Marca

**Prioridad:** ALTA (Google Knowledge Graph y E-E-A-T)

### Concepto

Google construye un "Knowledge Graph entity" para personas y negocios conectando senales de multiples fuentes. La consistencia de nombre, titulo, ubicacion, sitio web y perfiles sociales refuerza esta entidad.

### Estado actual de consistencia

| Senal | Valor en el sitio | Debe coincidir en |
|-------|-------------------|--------------------|
| Nombre | Carlos Anaya Ruiz | LinkedIn, GitHub, Fiverr, GBP, articulos |
| Titulo | Consultor SEO Tecnico & Desarrollador Full-Stack | LinkedIn headline, GBP, Fiverr |
| Ubicacion | Ciudad de Mexico, Mexico | LinkedIn, GBP, Fiverr |
| Sitio web | carlosanayaruiz.com | Todos los perfiles |
| Foto | carlos-anaya-ruiz-software.png | LinkedIn, GitHub, GBP, Fiverr |
| Alma mater | Tecnologico de Monterrey | LinkedIn, schema |
| Empresas previas | Amazon, Master Loyalty Group, Wan Hai Lines | LinkedIn |

### Acciones de consolidacion

1. **Mismo nombre exacto en todos lados:** "Carlos Anaya Ruiz" (no "Carlos Anaya", no "C. Anaya Ruiz").
2. **Misma foto de perfil** en LinkedIn, GitHub, Fiverr y Google Business Profile.
3. **Schema `sameAs`** en `lib/schema.ts` ya conecta: LinkedIn, GitHub x2, Fiverr. Agregar GBP cuando este verificado.
4. **Nombre alternativo en schema:** Ya incluye `alternateName: ['Carlos Anaya Ruiz', 'Carlos Anaya']`. Correcto.
5. **Consistencia del titulo profesional:** Usar "Consultor SEO Tecnico & Desarrollador Full-Stack" como titulo principal en todos los perfiles.

### Resultado esperado
- Google conecta todas las senales a una sola entidad.
- Mayor probabilidad de Knowledge Panel en busquedas de marca.
- Refuerzo de E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness).

---

## 9. Checklist de Progreso

| # | Accion | Prioridad | Estado | Fecha |
|---|--------|-----------|--------|-------|
| 1 | Verificar Google Search Console | CRITICA | Pendiente | |
| 2 | Enviar sitemap a GSC | CRITICA | Pendiente | |
| 3 | Configurar email profesional (@carlosanayaruiz.com) | ALTA | Pendiente | |
| 4 | Crear Google Business Profile | ALTA | Pendiente | |
| 5 | Alinear perfil de LinkedIn | ALTA | Pendiente | |
| 6 | Consolidar perfiles de GitHub | MEDIA | Pendiente | |
| 7 | Alinear perfil de Fiverr | MEDIA | Pendiente | |
| 8 | Registrarse en directorio alumni Tec | MEDIA | Pendiente | |
| 9 | Publicar primer guest post (Dev.to o Medium) | MEDIA | Pendiente | |
| 10 | Crear perfil en Clutch.co | BAJA | Pendiente | |

---

*Este documento se actualiza conforme se completan las acciones externas. Marcar fecha de completado en la tabla de progreso.*
