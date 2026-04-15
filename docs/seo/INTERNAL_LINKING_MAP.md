# Mapa de Enlaces Internos -- carlosanayaruiz.com

> Documento de referencia que mapea todos los enlaces internos del sitio por pagina, componente y tipo de enlace. Basado en el codigo fuente real del repositorio.
> Ultima actualizacion: 2026-04-15

---

## Estructura del Sitio

El sitio tiene 8 paginas principales, cada una disponible en 2 locales (es/en) = 16 URLs indexables.

| Pagina | Ruta ES | Ruta EN | Prioridad Sitemap |
|--------|---------|---------|-------------------|
| Home | `/es` | `/en` | 1.0 |
| SEO Tecnico | `/es/seo-tecnico` | `/en/technical-seo` | 0.9 |
| Desarrollo Web | `/es/desarrollo-web` | `/en/web-development` | 0.9 |
| Automatizacion IA | `/es/automatizacion-ia` | `/en/ai-automation` | 0.8 |
| Dashboards | `/es/dashboards` | `/en/dashboards` | 0.8 |
| Sobre Mi | `/es/sobre-mi` | `/en/about` | 0.8 |
| Contacto | `/es/contacto` | `/en/contact` | 0.7 |
| Libros/Recursos | `/es/libros` | `/en/books` | 0.6 |

---

## 1. Componentes Globales (Presentes en Todas las Paginas)

### 1.1 Header (`components/layout/header.tsx`)

| Elemento | Destino | Tipo de Enlace |
|----------|---------|----------------|
| Logo "Carlos Anaya Ruiz" | `/` | `<Link>` i18n |
| Nav: Inicio | `/` | `<Link>` i18n |
| Dropdown: Servicios | No navega (toggle) | `<button>` |
| Dropdown > SEO Tecnico | `/seo-tecnico` | `<Link>` i18n |
| Dropdown > Desarrollo Web | `/desarrollo-web` | `<Link>` i18n |
| Dropdown > Automatizacion IA | `/automatizacion-ia` | `<Link>` i18n |
| Dropdown > Dashboards | `/dashboards` | `<Link>` i18n |
| Nav: Sobre Mi | `/sobre-mi` | `<Link>` i18n |
| Nav: Libros | `/libros` | `<Link>` i18n |
| Nav: Contacto | `/contacto` | `<Link>` i18n |
| Boton: Fiverr ("Hire Me") | `https://es.fiverr.com/s/995D62d` | `<a>` externo, `target="_blank"` |

**Menu movil:** Replica exacta de la estructura desktop. Todos los mismos destinos.

### 1.2 Footer (`components/layout/footer.tsx`)

| Seccion | Elemento | Destino | Tipo |
|---------|----------|---------|------|
| Marca | Logo "Carlos Anaya Ruiz" | `/` | `<Link>` i18n |
| Social | LinkedIn | `https://linkedin.com/in/carlos-anaya-ruiz-732abb249/` | `<a>` externo, `rel="me"` |
| Social | GitHub | `https://github.com/CArlos12002` | `<a>` externo, `rel="me"` |
| Social | Email | `mailto:carlosaremployment@hotmail.com` | `<a>` mailto |
| Servicios | SEO Tecnico | `/seo-tecnico` | `<Link>` i18n |
| Servicios | Desarrollo Web | `/desarrollo-web` | `<Link>` i18n |
| Servicios | Automatizacion IA | `/automatizacion-ia` | `<Link>` i18n |
| Servicios | Dashboards | `/dashboards` | `<Link>` i18n |
| Navegacion | Inicio | `/` | `<Link>` i18n |
| Navegacion | Sobre Mi | `/sobre-mi` | `<Link>` i18n |
| Navegacion | Libros | `/libros` | `<Link>` i18n |
| Navegacion | Contacto | `/contacto` | `<Link>` i18n |
| Contacto | Email (texto) | `mailto:carlosaremployment@hotmail.com` | `<a>` mailto |
| Contacto | LinkedIn (texto) | LinkedIn URL | `<a>` externo |
| Contacto | Fiverr (texto) | Fiverr URL | `<a>` externo |

### 1.3 Breadcrumbs (`components/layout/breadcrumbs.tsx`)

Presente en todas las paginas excepto Home. Siempre incluye enlace a `/` (Home con icono).

| Pagina | Breadcrumb Trail |
|--------|-----------------|
| SEO Tecnico | Home > SEO Tecnico |
| Desarrollo Web | Home > Desarrollo Web |
| Automatizacion IA | Home > Automatizacion IA |
| Dashboards | Home > Dashboards |
| Sobre Mi | Home > Sobre Mi |
| Contacto | Home > Contacto |
| Libros | Home > Recursos |

---

## 2. Enlaces por Pagina (Contenido Propio)

### 2.1 Home (`app/[locale]/page.tsx`)

| Seccion | Destino | Anchor/CTA | Tipo |
|---------|---------|------------|------|
| Hero CTA | `#servicios` | "Ver Servicios" | Ancla interna |
| Hero CTA | `/contacto` | "Contactame" | `<Link>` i18n |
| Hero CTA | `/sobre-mi` | "Sobre Mi" | `<Link>` i18n |
| Hero Social | LinkedIn | LinkedIn URL | `<a>` externo, `rel="me"` |
| Hero Social | GitHub | GitHub URL | `<a>` externo, `rel="me"` |
| Hero Social | Email | mailto: | `<a>` mailto |
| Servicio SEO (card) | `/seo-tecnico` | "Ver mas" | `<Link>` i18n |
| Servicio SEO (card) | `/contacto` | "Contactar" | `<Link>` i18n |
| Servicio Web (card) | `/desarrollo-web` | "Ver mas" | `<Link>` i18n |
| Servicio Web (card) | `/contacto` | "Contactar" | `<Link>` i18n |
| Servicio IA (card) | `/automatizacion-ia` | "Ver mas" | `<Link>` i18n |
| Servicio IA (card) | `/contacto` | "Contactar" | `<Link>` i18n |
| Servicio Dashboards (card) | `/dashboards` | "Ver mas" | `<Link>` i18n |
| Servicio Dashboards (card) | `/contacto` | "Contactar" | `<Link>` i18n |
| CTA final | `/contacto` | "Contactame" | `<Link>` i18n |
| CTA final | Fiverr | "Contratar en Fiverr" | `<a>` externo |

**Total enlaces internos unicos desde Home:** `/seo-tecnico`, `/desarrollo-web`, `/automatizacion-ia`, `/dashboards`, `/contacto`, `/sobre-mi` (6 paginas internas)

### 2.2 Sobre Mi (`app/[locale]/sobre-mi/page.tsx`)

| Seccion | Destino | Anchor/CTA | Tipo |
|---------|---------|------------|------|
| Social (header) | LinkedIn, GitHub, Email | URLs externas | `<a>` externo, `rel="me"` |
| Filosofia | `/` | "Ver servicios" | `<Link>` i18n |
| CTA servicios | `/seo-tecnico` | "SEO Tecnico" | `<Link>` i18n |
| CTA servicios | `/desarrollo-web` | "Desarrollo Web" | `<Link>` i18n |
| CTA servicios | `/automatizacion-ia` | "Automatizacion IA" | `<Link>` i18n |
| CTA servicios | `/dashboards` | "Dashboards" | `<Link>` i18n |
| CTA principal | `/contacto` | "Contactame" | `<Link>` i18n |
| Certificados | Google Drive | "Ver certificados" | `<a>` externo |

**Total enlaces internos unicos desde Sobre Mi:** `/`, `/seo-tecnico`, `/desarrollo-web`, `/automatizacion-ia`, `/dashboards`, `/contacto` (6 paginas internas)

### 2.3 Contacto (`app/[locale]/contacto/page.tsx`)

| Seccion | Destino | Anchor/CTA | Tipo |
|---------|---------|------------|------|
| Tipos de proyecto | `/seo-tecnico` | "SEO Tecnico" | `<Link>` i18n |
| Tipos de proyecto | `/desarrollo-web` | "Desarrollo Web" | `<Link>` i18n |
| Tipos de proyecto | `/automatizacion-ia` | "Automatizacion IA" | `<Link>` i18n |
| Tipos de proyecto | `/dashboards` | "Dashboards" | `<Link>` i18n |
| Social sidebar | LinkedIn, GitHub, Fiverr | URLs externas | `<a>` externo |
| Email | mailto: | Email directo | `<a>` mailto |

**Total enlaces internos unicos desde Contacto:** `/seo-tecnico`, `/desarrollo-web`, `/automatizacion-ia`, `/dashboards` (4 paginas internas)

### 2.4 SEO Tecnico (`app/[locale]/seo-tecnico/page.tsx`)

| Seccion | Destino | Anchor/CTA | Tipo |
|---------|---------|------------|------|
| Servicios relacionados | `/desarrollo-web` | "Desarrollo Web" | `<Link>` i18n |
| Servicios relacionados | `/dashboards` | "Dashboards" | `<Link>` i18n |
| CTA principal | `/contacto` | "Contactame" | `<Link>` i18n |
| CTA Fiverr | Fiverr URL | "Contratar en Fiverr" | `<a>` externo |

**Total enlaces internos unicos desde SEO Tecnico:** `/desarrollo-web`, `/dashboards`, `/contacto` (3 paginas internas)

### 2.5 Desarrollo Web (`app/[locale]/desarrollo-web/page.tsx`)

| Seccion | Destino | Anchor/CTA | Tipo |
|---------|---------|------------|------|
| Servicios relacionados | `/seo-tecnico` | "SEO Tecnico" | `<Link>` i18n |
| Servicios relacionados | `/automatizacion-ia` | "Automatizacion IA" | `<Link>` i18n |
| CTA principal | `/contacto` | "Contactame" | `<Link>` i18n |
| CTA Fiverr | Fiverr URL | "Contratar en Fiverr" | `<a>` externo |

**Total enlaces internos unicos desde Desarrollo Web:** `/seo-tecnico`, `/automatizacion-ia`, `/contacto` (3 paginas internas)

### 2.6 Automatizacion IA (`app/[locale]/automatizacion-ia/page.tsx`)

| Seccion | Destino | Anchor/CTA | Tipo |
|---------|---------|------------|------|
| Servicios relacionados | `/seo-tecnico` | "SEO Tecnico" | `<Link>` i18n |
| Servicios relacionados | `/desarrollo-web` | "Desarrollo Web" | `<Link>` i18n |
| Servicios relacionados | `/dashboards` | "Dashboards" | `<Link>` i18n |
| CTA principal | `/contacto` | "Contactame" | `<Link>` i18n |
| CTA Fiverr | Fiverr URL | "Contratar en Fiverr" | `<a>` externo |

**Total enlaces internos unicos desde Automatizacion IA:** `/seo-tecnico`, `/desarrollo-web`, `/dashboards`, `/contacto` (4 paginas internas)

### 2.7 Dashboards (`app/[locale]/dashboards/page.tsx`)

| Seccion | Destino | Anchor/CTA | Tipo |
|---------|---------|------------|------|
| Servicios relacionados | `/seo-tecnico` | "SEO Tecnico" | `<Link>` i18n |
| Servicios relacionados | `/desarrollo-web` | "Desarrollo Web" | `<Link>` i18n |
| Servicios relacionados | `/automatizacion-ia` | "Automatizacion IA" | `<Link>` i18n |
| CTA principal | `/contacto` | "Contactame" | `<Link>` i18n |
| CTA Fiverr | Fiverr URL | "Contratar en Fiverr" | `<a>` externo |

**Total enlaces internos unicos desde Dashboards:** `/seo-tecnico`, `/desarrollo-web`, `/automatizacion-ia`, `/contacto` (4 paginas internas)

### 2.8 Libros/Recursos (`app/[locale]/libros/page.tsx`)

| Seccion | Destino | Anchor/CTA | Tipo |
|---------|---------|------------|------|
| Recursos gratuitos | `/seo-tecnico` | "Saber mas" | `<Link>` i18n |
| Recursos gratuitos | `/sobre-mi` | "Sobre mi" | `<Link>` i18n |
| CTA principal | `/contacto` | "Contactame" | `<Link>` i18n |

**Total enlaces internos unicos desde Libros:** `/seo-tecnico`, `/sobre-mi`, `/contacto` (3 paginas internas)

---

## 3. Matriz de Enlazado Interno (Contenido -- Sin Header/Footer)

Tabla que muestra que pagina enlaza a cual, contando solo enlaces en el contenido propio de cada pagina (excluye header, footer y breadcrumbs).

| Origen \ Destino | Home | SEO | Web | IA | Dash | Sobre Mi | Contacto | Libros |
|-------------------|------|-----|-----|----|------|----------|----------|--------|
| **Home** | - | SI | SI | SI | SI | SI | SI | NO |
| **SEO Tecnico** | NO | - | SI | NO | SI | NO | SI | NO |
| **Desarrollo Web** | NO | SI | - | SI | NO | NO | SI | NO |
| **Automatizacion IA** | NO | SI | SI | - | SI | NO | SI | NO |
| **Dashboards** | NO | SI | SI | SI | - | NO | SI | NO |
| **Sobre Mi** | SI | SI | SI | SI | SI | - | SI | NO |
| **Contacto** | NO | SI | SI | SI | SI | NO | - | NO |
| **Libros** | NO | SI | NO | NO | NO | SI | SI | - |

---

## 4. Conteo de Enlaces Internos Recibidos por Pagina

Incluyendo header, footer, breadcrumbs y contenido. Cada instancia de enlace desde una pagina unica cuenta como 1.

| Pagina | Desde Header | Desde Footer | Desde Breadcrumbs | Desde Contenido | Total Fuentes Unicas |
|--------|--------------|--------------|--------------------|-----------------|---------------------|
| Home (`/`) | 8 (logo + nav en todas) | 8 | 7 (breadcrumbs en 7 paginas) | 2 (Sobre Mi, Libros no) | **8** (todas) |
| SEO Tecnico | 8 | 8 | 0 | 6 (Home, Web, IA, Dash, Sobre Mi, Contacto) | **8** |
| Desarrollo Web | 8 | 8 | 0 | 5 (Home, SEO, IA, Dash, Sobre Mi, Contacto) | **8** |
| Automatizacion IA | 8 | 8 | 0 | 4 (Home, Web, Dash, Sobre Mi) | **8** |
| Dashboards | 8 | 8 | 0 | 5 (Home, SEO, IA, Sobre Mi, Contacto) | **8** |
| Sobre Mi | 8 | 8 | 0 | 2 (Home, Libros) | **8** |
| Contacto | 8 | 8 | 0 | 7 (Home, SEO, Web, IA, Dash, Sobre Mi, Libros) | **8** |
| Libros | 8 | 8 | 0 | 0 (ninguna pagina enlaza a /libros en contenido) | **8** |

**Observacion critica:** La pagina `/libros` no recibe ningun enlace en contenido desde ninguna otra pagina. Solo es accesible via header y footer. Esto le resta importancia percibida por Google.

---

## 5. Enlaces Externos Salientes

| Destino | Paginas que lo enlazan | Atributos |
|---------|----------------------|-----------|
| LinkedIn (`linkedin.com/in/carlos-anaya-ruiz-732abb249/`) | Home, Sobre Mi, Contacto, Footer (global) | `rel="me noopener noreferrer"`, `target="_blank"` |
| GitHub (`github.com/CArlos12002`) | Home, Sobre Mi, Contacto, Footer (global) | `rel="me noopener noreferrer"`, `target="_blank"` |
| Fiverr (`es.fiverr.com/s/995D62d`) | Header (global), Home, SEO, Web, IA, Dash, Contacto, Footer | `rel="noopener noreferrer"`, `target="_blank"` |
| Email (`carlosaremployment@hotmail.com`) | Home, Sobre Mi, Contacto, Footer (global) | `mailto:` |
| Google Drive (certificados) | Sobre Mi | `rel="noopener noreferrer"`, `target="_blank"` |

**Nota:** Solo se enlaza `github1` (CArlos12002). El perfil `github2` (canaya2002) esta definido en `SOCIAL_LINKS` pero no se usa en ningun componente visible.

---

## 6. Recomendaciones de Mejora

### Prioridad Alta

1. **Agregar enlace contextual a `/libros` desde al menos 2 paginas de servicio.**
   - Ejemplo: En `/seo-tecnico`, agregar una seccion "Recursos relacionados" con enlace a `/libros`.
   - Ejemplo: En la Home, agregar mencion al libro/recursos en la seccion de FAQ o CTA final.
   - Impacto: Libros es la unica pagina sin enlaces de contenido entrantes.

2. **SEO Tecnico deberia enlazar a Automatizacion IA.**
   - Actualmente solo enlaza a Desarrollo Web y Dashboards como servicios relacionados.
   - La IA esta directamente relacionada (automatizacion de auditorias, procesamiento de datos SEO).

3. **Desarrollo Web deberia enlazar a Dashboards.**
   - Falta en servicios relacionados. Los dashboards son un tipo de proyecto web.

### Prioridad Media

4. **Incluir enlaces contextuales en las respuestas de FAQ.**
   - Las FAQs de cada pagina de servicio no contienen ningun enlace interno.
   - Ejemplo: En la FAQ de SEO "¿Puedes manejar migraciones?" enlazar a `/desarrollo-web`.
   - Ejemplo: En la FAQ de Desarrollo Web "¿Manejas frontend y backend?" enlazar a `/dashboards`.

5. **Agregar enlace al segundo perfil de GitHub (canaya2002).**
   - Esta definido en `SOCIAL_LINKS.github2` pero no se renderiza en ningun lugar.
   - Alternativa: Consolidar ambos perfiles y usar solo uno (ver EXTERNAL_ACTIONS_MAIN_DOMAIN.md).

6. **Contacto no enlaza a Sobre Mi ni a Home.**
   - Agregar un enlace contextual tipo "Conoce mi trayectoria" que lleve a `/sobre-mi`.

### Prioridad Baja

7. **Agregar anchor text descriptivo a los enlaces de servicios relacionados.**
   - Actualmente los enlaces dicen solo "SEO Tecnico" o "Desarrollo Web".
   - Agregar descriptores como "Auditorias y optimizacion SEO tecnico" ayuda a Google a entender el contexto.

8. **Considerar enlazar desde Home a `/libros` en el CTA final.**
   - "Explora mis recursos tecnicos" como tercer boton en el CTA de cierre.

9. **El componente Newsletter no contiene ningun enlace interno.** Es una oportunidad perdida.
   - Despues de suscripcion exitosa, mostrar enlace a `/seo-tecnico` o `/sobre-mi`.

---

## 7. Diagrama de Flujo de Enlazado

```
                    HEADER (global)
                    |  |  |  |  |  |  |
                    v  v  v  v  v  v  v
    /libros  /sobre-mi  /contacto  /  /seo  /web  /ia  /dash

                         HOME (/)
                      /  |  |  |  \  \
                     v   v  v  v   v  v
               /sobre-mi  /seo  /web  /ia  /dash  /contacto

          /seo-tecnico          /desarrollo-web
          |    |    |            |    |    |
          v    v    v            v    v    v
       /web  /dash  /contacto  /seo  /ia  /contacto

       /automatizacion-ia         /dashboards
       |    |    |    |           |    |    |    |
       v    v    v    v           v    v    v    v
     /seo  /web  /dash  /contacto  /seo  /web  /ia  /contacto

              /sobre-mi                    /libros
         /  |  |  |  |  |              |    |    |
         v  v  v  v  v  v              v    v    v
      Home /seo /web /ia /dash /contacto  /seo  /sobre-mi  /contacto

                    FOOTER (global)
                    |  |  |  |  |  |  |  |
                    v  v  v  v  v  v  v  v
    /  /seo  /web  /ia  /dash  /sobre-mi  /libros  /contacto
```

---

*Este documento se actualiza cada vez que se modifica la estructura de navegacion o se agregan/eliminan enlaces internos en cualquier pagina.*
