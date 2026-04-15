# Estrategia Cross-Domain: carlosanayaruiz.com y carlosanayaweb.com

> Ultima actualizacion: 2026-04-15
> Propietario: Carlos Anaya Ruiz
> Dominio primario: carlosanayaruiz.com
> Dominio secundario: carlosanayaweb.com

---

## Contexto y Diagnostico

Carlos Anaya Ruiz opera dos dominios activos:

| Dominio | Rol actual | Estado tecnico |
|---------|-----------|----------------|
| **carlosanayaruiz.com** | Marca personal, servicios comerciales, autoridad profesional | Activo. Next.js App Router, bilingue (es/en), 8 paginas indexables, Schema Person/Service/FAQ, sitemap expandido. |
| **carlosanayaweb.com** | Dominio legado — fue el dominio original del sitio | Activo. Todavia indexado por Google. Sin redirects. Contenido potencialmente duplicado o desactualizado. |

**El problema concreto:** Hasta la auditoria del 2026-04-14, carlosanayaruiz.com canonicalizaba TODO su contenido hacia carlosanayaweb.com (error en `SITE_CONFIG.url`). Esto significa que Google posiblemente tiene indexado carlosanayaweb.com como fuente canonica de la marca "Carlos Anaya Ruiz". Ambos dominios compiten por las mismas queries de marca y comerciales.

---

## 1. Diferenciacion de Roles por Dominio

### carlosanayaruiz.com — Dominio Principal

Este es el dominio canonico, autoritativo e irrevocable de la marca personal Carlos Anaya Ruiz. Aqui vive:

- **Marca personal:** Toda referencia a "Carlos Anaya Ruiz" como profesional, consultor, ingeniero
- **Paginas de servicio (money pages):**
  - `/seo-tecnico` — Consultoria SEO Tecnica
  - `/desarrollo-web` — Aplicaciones Web con Next.js y Firebase
  - `/automatizacion-ia` — Automatizacion con IA y Chatbots
  - `/dashboards` — Dashboards Responsivos
- **Pagina de conversion:** `/contacto` — Formulario de contacto, generacion de leads
- **Autoridad profesional:** `/sobre-mi` — Trayectoria, certificaciones, experiencia (Amazon, Master Loyalty, Wan Hai Lines, Tec de Monterrey)
- **Recursos:** `/libros` — Libros y recursos tecnicos
- **Schema markup completo:** Person, ProfessionalService, WebSite, Service, FAQPage, BreadcrumbList
- **Blog futuro:** `carlosanayaruiz.com/blog` — Contenido editorial, tutoriales, casos de estudio (los 12 briefs del calendario editorial viven aqui)
- **Datos estructurados `sameAs`:** LinkedIn, GitHub, Fiverr — todos apuntan aqui
- **Sitemap principal:** Enviado a Google Search Console desde este dominio

### carlosanayaweb.com — Dominio Secundario

**Rol recomendado: Laboratorio publico de proyectos experimentales y demos interactivas.**

Esta es la mejor diferenciacion posible por tres razones:

1. **No compite por keywords comerciales.** Un lab de demos no busca "consultor SEO Mexico" ni "desarrollo web Next.js"
2. **Genera link equity propio** mediante contenido unico e interactivo que desarrolladores y tecnicos compartiran naturalmente
3. **Refuerza la autoridad de carlosanayaruiz.com** al funcionar como evidencia tangible de habilidades tecnicas

**Contenido que vivira en carlosanayaweb.com:**

| Tipo de contenido | Ejemplo concreto | Keyword target (diferenciado) |
|-------------------|------------------|-------------------------------|
| Demos interactivas de herramientas | Speed test visual, schema validator, CWV analyzer | "herramienta core web vitals", "validador schema online" |
| Prototipos open-source | Starter templates Next.js + Firebase, chatbot demo | "template next.js firebase", "chatbot demo GPT" |
| Experimentos tecnicos | Comparativas de rendimiento, A/B tests publicos | "benchmark next.js vs nuxt", "rendimiento ssr vs isr" |
| Playground de codigo | Editor interactivo para JSON-LD, meta tags | "generador json-ld online", "meta tag generator" |

**Lo que NUNCA vivira en carlosanayaweb.com:**

- Paginas de servicio o "hire me"
- Biografia profesional o pagina "Sobre mi"
- Formulario de contacto comercial
- Schema Person, ProfessionalService, o cualquier dato estructurado de identidad
- Contenido editorial/blog (eso va en carlosanayaruiz.com/blog)

---

## 2. Reglas de Propiedad de Contenido

### Contenido EXCLUSIVO de carlosanayaruiz.com

Estas categorias de contenido jamas deben existir en carlosanayaweb.com bajo ninguna forma:

| Categoria | Paginas actuales | Keywords que protege |
|-----------|-----------------|---------------------|
| **Servicios comerciales** | `/seo-tecnico`, `/desarrollo-web`, `/automatizacion-ia`, `/dashboards` | "consultor SEO tecnico Mexico", "desarrollo web Next.js", "automatizacion IA empresas", "dashboards empresariales" |
| **Marca personal** | `/`, `/sobre-mi` | "Carlos Anaya Ruiz", "Carlos Anaya consultor", "Carlos Anaya SEO" |
| **Conversion** | `/contacto` | "contratar consultor SEO", "cotizar desarrollo web" |
| **Recursos editoriales** | `/libros`, futuro `/blog/*` | "guia SEO tecnico Next.js", "schema.org next.js", "core web vitals guia" |
| **Casos de estudio / portfolio** | Futuro `/portfolio/*` | "proyecto SEO Mexico", "caso exito desarrollo web" |

### Contenido permitido en carlosanayaweb.com

Solo contenido que cumpla TODAS estas condiciones:

1. No existe una pagina equivalente en carlosanayaruiz.com
2. No apunta a keywords comerciales o de marca
3. Tiene intencion informacional/tool y no transaccional
4. Es contenido interactivo/demo que no tiene sentido como articulo de blog

**Regla de oro:** Si dudas donde publicar algo, publicalo en carlosanayaruiz.com. El dominio secundario solo recibe contenido que deliberadamente necesita vivir separado.

### Contenido que NUNCA debe duplicarse

| Contenido | Razon |
|-----------|-------|
| Nombre "Carlos Anaya Ruiz" en title tags como keyword principal | Diluye la senal de marca |
| Descripciones de servicio (aunque sea parafraseado) | Canibalizacion de money pages |
| FAQ identicas o similares sobre servicios | Google puede elegir el dominio equivocado |
| Testimonios o casos de estudio con clientes | Solo en dominio principal para credibilidad |
| Schema Person o ProfessionalService | Solo un dominio puede ser la fuente canonica de identidad |

---

## 3. Estrategia de Enlazado Entre Dominios

### 3.1 Enlaces de carlosanayaweb.com hacia carlosanayaruiz.com

**Cuando enlazar:** En CADA pagina de carlosanayaweb.com, sin excepcion.

**Donde colocar los enlaces:**

| Ubicacion | Tipo de enlace | Ejemplo |
|-----------|---------------|---------|
| **Header/navbar** | Link a marca personal | "Por Carlos Anaya Ruiz" con enlace a `https://carlosanayaruiz.com` |
| **Footer** | Link a servicios y contacto | "Necesitas esto para tu proyecto? Contratame en carlosanayaruiz.com" |
| **Dentro del contenido** | Links contextuales a servicios relevantes | "Esta herramienta de Schema.org es parte de mi servicio de [consultoria SEO tecnica](https://carlosanayaruiz.com/es/seo-tecnico)" |
| **CTA en cada demo/tool** | Link transaccional a contacto | "Quieres una implementacion profesional? [Agendar llamada](https://carlosanayaruiz.com/es/contacto)" |
| **Byline / autor** | Link a pagina Sobre Mi | "Creado por [Carlos Anaya Ruiz](https://carlosanayaruiz.com/es/sobre-mi)" |

**Anchor text obligatorio — Variaciones aprobadas:**

| Pagina destino | Anchors aprobados (rotar) |
|----------------|--------------------------|
| Home `/` | "Carlos Anaya Ruiz", "carlosanayaruiz.com", "mi sitio profesional" |
| `/seo-tecnico` | "consultoria SEO tecnica", "servicio de SEO tecnico", "auditoria SEO profesional" |
| `/desarrollo-web` | "desarrollo web con Next.js", "aplicaciones web Next.js y Firebase" |
| `/automatizacion-ia` | "automatizacion con inteligencia artificial", "chatbots con IA para empresas" |
| `/dashboards` | "dashboards responsivos", "dashboards empresariales interactivos" |
| `/contacto` | "contactame", "agendar llamada", "solicitar cotizacion" |
| `/sobre-mi` | "Carlos Anaya Ruiz", "mi trayectoria profesional" |

**Anchors PROHIBIDOS:**

- "clic aqui", "ver mas", "mi otro sitio", "enlace", "pagina web"
- URLs desnudas sin texto descriptivo
- El mismo anchor text en multiples paginas (rotar siempre)

### 3.2 Enlaces de carlosanayaruiz.com hacia carlosanayaweb.com

**Cuando enlazar:** Con moderacion y solo cuando aporta valor real al usuario.

| Situacion | Accion | Ejemplo |
|-----------|--------|---------|
| Blog post menciona una herramienta que existe como demo en carlosanayaweb.com | Enlazar la demo | "Prueba el [validador de Schema.org](https://carlosanayaweb.com/tools/schema-validator) que construi" |
| Pagina de servicio quiere mostrar capacidad tecnica | Enlazar como evidencia | "Ve una [demo en vivo de dashboard](https://carlosanayaweb.com/demos/dashboard)" |
| Pagina Sobre Mi menciona proyectos personales | Enlazar el lab | "Explora mis [experimentos tecnicos](https://carlosanayaweb.com)" |

**Restricciones:**

- Maximo 1 enlace a carlosanayaweb.com por pagina de carlosanayaruiz.com
- NUNCA en paginas de servicio como enlace principal — solo como complemento secundario
- NUNCA en el header o footer global de carlosanayaruiz.com
- Los enlaces deben ser `dofollow` (no hay razon para `nofollow` entre propiedades propias)

### 3.3 Canonical Cross-Domain

**Regla general: NO usar canonical cross-domain.**

Cada dominio tiene contenido unico. Si ambos dominios tienen la misma pagina, el problema no es de canonicals sino de contenido duplicado que no deberia existir.

**Unica excepcion:** Si por error se publica contenido identico en ambos dominios antes de poder eliminarlo, agregar temporalmente:

```html
<!-- En carlosanayaweb.com, en la pagina duplicada -->
<link rel="canonical" href="https://carlosanayaruiz.com/es/[pagina-equivalente]" />
```

Y eliminar la pagina duplicada de carlosanayaweb.com dentro de los siguientes 7 dias.

---

## 4. Prevencion y Deteccion de Canibalizacion

### 4.1 Queries Especificas a Monitorear

Estas son las queries con mayor riesgo de canibalizacion, organizadas por prioridad:

**RIESGO CRITICO — Monitoreo semanal:**

| Query | Dominio que DEBE posicionar | Pagina objetivo | Accion si canibalizan |
|-------|---------------------------|-----------------|----------------------|
| "Carlos Anaya Ruiz" | carlosanayaruiz.com | `/` (home) | Redirect 301 inmediato de cualquier pagina competidora en carlosanayaweb.com |
| "Carlos Anaya" | carlosanayaruiz.com | `/` (home) | Idem |
| "Carlos Anaya SEO" | carlosanayaruiz.com | `/seo-tecnico` | Eliminar cualquier contenido SEO en carlosanayaweb.com |
| "consultor SEO tecnico Mexico" | carlosanayaruiz.com | `/seo-tecnico` | carlosanayaweb.com NO debe tener paginas de servicio |
| "desarrollo web Next.js Mexico" | carlosanayaruiz.com | `/desarrollo-web` | Idem |

**RIESGO ALTO — Monitoreo quincenal:**

| Query | Dominio que DEBE posicionar | Pagina objetivo |
|-------|---------------------------|-----------------|
| "automatizacion IA empresas Mexico" | carlosanayaruiz.com | `/automatizacion-ia` |
| "chatbot IA empresas" | carlosanayaruiz.com | `/automatizacion-ia` |
| "dashboards responsivos" | carlosanayaruiz.com | `/dashboards` |
| "consultoria SEO tecnico" | carlosanayaruiz.com | `/seo-tecnico` |
| "consultor SEO Next.js" | carlosanayaruiz.com | `/seo-tecnico` |

**RIESGO MEDIO — Monitoreo mensual:**

| Query | Dominio que DEBE posicionar | Notas |
|-------|---------------------------|-------|
| "core web vitals guia" | carlosanayaruiz.com (blog futuro) | Si carlosanayaweb.com tiene un tool de CWV, sera contenido complementario, no editorial |
| "schema.org next.js" | carlosanayaruiz.com (blog futuro) | El playground de JSON-LD en carlosanayaweb.com apunta a keyword diferente: "generador json-ld online" |
| "firebase vs supabase" | carlosanayaruiz.com (blog futuro) | Contenido editorial exclusivo del dominio principal |

### 4.2 Como Detectar Canibalizacion

**Metodo 1: Google Search Console (mas confiable)**

1. Verificar ambos dominios en GSC como domain property (verificacion DNS)
2. En cada dominio, ir a Rendimiento > Resultados de busqueda
3. Filtrar por query exacta (cada query de la tabla anterior)
4. Comparar:
   - Si ambos dominios reciben impresiones para la misma query = canibalizacion activa
   - Si un dominio tiene CTR < 2% pero impresiones altas = Google lo muestra pero los usuarios no hacen clic (senal de posicion baja o snippet irrelevante)

**Metodo 2: Site operator en Google**

Ejecutar periodicamente:

```
site:carlosanayaruiz.com "consultor SEO tecnico"
site:carlosanayaweb.com "consultor SEO tecnico"
```

Si ambos devuelven resultados para la misma frase exacta, hay contenido duplicado o overlap tematico.

**Metodo 3: Busqueda directa sin site operator**

Buscar cada query de la tabla y verificar:
- Si aparece solo carlosanayaruiz.com = correcto
- Si aparece solo carlosanayaweb.com = canibalizacion (el dominio equivocado posiciona)
- Si aparecen ambos = canibalizacion activa (Google no sabe cual elegir)

**Metodo 4: Herramientas automatizadas**

- **Ahrefs / Semrush:** Comparar keyword overlap entre ambos dominios mensualmente
- **Google Alerts:** Configurar alertas para "Carlos Anaya Ruiz" y verificar que dominio aparece en nuevos resultados
- **Script personalizado con Google Search API:** Automatizar la verificacion semanal de las queries criticas (considerar implementar como Cloud Function)

### 4.3 Protocolo de Respuesta si Hay Canibalizacion

**Paso 1 — Identificar la pagina problema (Dia 1)**

Determinar que URL exacta de carlosanayaweb.com esta compitiendo con carlosanayaruiz.com.

**Paso 2 — Clasificar el tipo de overlap (Dia 1)**

| Tipo | Descripcion | Accion |
|------|-------------|--------|
| **Contenido identico** | La misma pagina existe en ambos dominios | Redirect 301 inmediato de carlosanayaweb.com/pagina hacia carlosanayaruiz.com/pagina |
| **Contenido similar** | Temas parecidos pero no identicos | Reescribir el contenido en carlosanayaweb.com para apuntar a keyword completamente diferente, o eliminarlo |
| **Title tag overlap** | Titulos similares apuntando al mismo keyword | Cambiar el title tag de la pagina en carlosanayaweb.com para apuntar a un keyword no competitivo |
| **Canibalizacion de marca** | Ambos dominios aparecen para "Carlos Anaya Ruiz" | Eliminar cualquier mencion de "Carlos Anaya Ruiz" como keyword principal en title/H1 de carlosanayaweb.com |

**Paso 3 — Implementar correccion (Dia 1-3)**

- Si es redirect 301: implementar y verificar con `curl -I`
- Si es reescritura: ejecutar y solicitar reindexacion en GSC
- Si es eliminacion: eliminar pagina, agregar `noindex` temporal si no se puede borrar inmediatamente

**Paso 4 — Verificar resolucion (Semana 2-4)**

- Monitorear en GSC que las impresiones del dominio equivocado bajen a cero para esa query
- Verificar que el dominio correcto mantenga o mejore posiciones
- Si no se resuelve en 4 semanas, escalar: agregar canonical cross-domain como medida temporal

---

## 5. Estrategia a Largo Plazo

### 5.1 Decision sobre el Futuro de carlosanayaweb.com

**Recomendacion: Mantener carlosanayaweb.com como lab de demos SOLO si se cumple la condicion de viabilidad. De lo contrario, redirect 301 total.**

**Condicion de viabilidad:**

Carlos tiene tiempo y motivacion para crear al menos 3-5 herramientas/demos unicas en carlosanayaweb.com durante los proximos 6 meses. Si no es asi, el dominio secundario es un liability, no un asset.

### 5.2 Timeline Detallado

#### Fase 0: Emergencia — Resolver canibalizacion activa (AHORA, semana del 15 de abril 2026)

- [ ] Implementar redirect 301 global de carlosanayaweb.com hacia carlosanayaruiz.com como medida inmediata
- [ ] Verificar ambos dominios en Google Search Console (DNS domain property)
- [ ] Solicitar reindexacion de las 8 paginas principales de carlosanayaruiz.com
- [ ] Actualizar TODOS los perfiles externos (LinkedIn, GitHub x2, Fiverr) para que apunten exclusivamente a carlosanayaruiz.com
- [ ] Verificar con `site:carlosanayaweb.com` que paginas tiene Google indexadas actualmente

**Implementacion del redirect global (para hacer ahora mismo):**

```javascript
// Si ambos dominios apuntan al mismo deployment en Vercel:
// next.config.js
async redirects() {
  return [
    {
      source: '/:path*',
      has: [{ type: 'host', value: 'carlosanayaweb.com' }],
      destination: 'https://carlosanayaruiz.com/:path*',
      permanent: true,
    },
    {
      source: '/:path*',
      has: [{ type: 'host', value: 'www.carlosanayaweb.com' }],
      destination: 'https://carlosanayaruiz.com/:path*',
      permanent: true,
    },
  ];
}
```

```
# Si carlosanayaweb.com tiene hosting separado (Cloudflare):
# Configurar Bulk Redirect Rule:
# Source: carlosanayaweb.com/* 
# Target: https://carlosanayaruiz.com/${1}
# Status: 301
# Preserve query string: Yes
# Include subdomains: Yes (www)
```

#### Fase 1: Estabilizacion del dominio principal (Abril-Mayo 2026)

- [ ] Confirmar que Google desindexa carlosanayaweb.com (monitorear Coverage en GSC semanalmente)
- [ ] Verificar consolidacion de impresiones/clics en carlosanayaruiz.com
- [ ] Publicar los primeros 2-3 articulos del blog en carlosanayaruiz.com/blog (briefs 1, 2, 3 del calendario editorial)
- [ ] Construir primeros backlinks externos apuntando exclusivamente a carlosanayaruiz.com

#### Fase 2: Evaluacion del dominio secundario (Junio 2026)

Despues de 6-8 semanas con el redirect activo, evaluar:

| Pregunta | Si YES | Si NO |
|----------|--------|-------|
| Tengo tiempo para crear demos/tools en carlosanayaweb.com? | Continuar a Fase 3A | Mantener redirect permanente |
| carlosanayaweb.com tenia backlinks valiosos antes del redirect? | Evaluar si conviene mantener el dominio activo para preservar esos links | Los backlinks ya fluyen via 301, no hay urgencia |
| Hay herramientas que mis clientes potenciales necesitan y que no tienen sentido como blog post? | Continuar a Fase 3A | Mantener redirect permanente |
| carlosanayaruiz.com ya esta posicionando bien para queries de marca y servicio? | Ya no dependo del dominio secundario para nada | Esperar mas antes de tomar decisiones |

#### Fase 3A: Reactivacion de carlosanayaweb.com como Lab (Solo si aplica, Julio 2026+)

- [ ] Crear sitio minimo en carlosanayaweb.com con identidad visual "Carlos Anaya Lab" o "carlosanayaweb tools"
- [ ] Publicar primera herramienta/demo
- [ ] Configurar Schema WebSite (SIN Person schema) con `author.url` apuntando a carlosanayaruiz.com
- [ ] Configurar enlaces en header/footer hacia carlosanayaruiz.com segun seccion 3.1
- [ ] Redirigir TODAS las URLs legacy que no sean herramientas nuevas hacia carlosanayaruiz.com (redirect selectivo, no global)
- [ ] Monitorear semanalmente que no haya canibalizacion con las queries de la seccion 4.1

#### Fase 3B: Redirect permanente (Si no aplica 3A)

- [ ] Mantener redirect 301 de carlosanayaweb.com hacia carlosanayaruiz.com indefinidamente
- [ ] Renovar el dominio carlosanayaweb.com cada ano para que nadie mas lo registre (proteccion de marca)
- [ ] No invertir ningun esfuerzo adicional en ese dominio

### 5.3 Cuando Consolidar Definitivamente (Redirect Permanente Total)

Ejecutar redirect 301 total e irreversible de carlosanayaweb.com si se cumple CUALQUIERA de estas condiciones:

1. **Han pasado 12 meses** desde la reactivacion como Lab y tiene menos de 5 herramientas publicadas
2. **El trafico organico** de carlosanayaweb.com es menor a 100 sesiones/mes despues de 6 meses activo
3. **Se detecta canibalizacion repetida** (mas de 3 incidentes en un trimestre) a pesar de seguir las reglas de contenido
4. **El costo de mantenimiento** (hosting, SSL, actualizaciones) supera el valor que genera
5. **Carlos decide lanzar un blog** robusto en carlosanayaruiz.com/blog que cubre el contenido que habria ido al Lab

### 5.4 Lo que NO debe Pasar Nunca

- Publicar servicios comerciales en carlosanayaweb.com
- Usar carlosanayaweb.com como alias o mirror de carlosanayaruiz.com
- Enviar el mismo sitemap a GSC para ambos dominios
- Tener Schema Person o ProfessionalService en carlosanayaweb.com
- Apuntar profiles de LinkedIn/GitHub/Fiverr a carlosanayaweb.com
- Dejar de renovar carlosanayaweb.com (riesgo de cybersquatting de marca)

---

## 6. Configuracion Tecnica de Google Search Console

### Verificacion

1. **carlosanayaruiz.com** — Verificar como domain property via DNS TXT record. Esta es la propiedad principal.
2. **carlosanayaweb.com** — Verificar por separado como domain property. Monitorear para confirmar que las paginas muestran status "Pagina con redireccionamiento" despues de implementar los 301.

### Sitemaps

- **carlosanayaruiz.com:** Enviar `https://carlosanayaruiz.com/sitemap.xml` (ya generado dinamicamente por `app/sitemap.ts`)
- **carlosanayaweb.com:** NO enviar sitemap. Si existe uno anterior, eliminarlo de GSC.

### Monitoreo Post-Redirect

| Metrica en GSC | Que buscar | Frecuencia |
|----------------|-----------|------------|
| Coverage (carlosanayaweb.com) | Todas las paginas deben pasar a "Pagina con redireccionamiento" | Semanal las primeras 8 semanas |
| Performance (carlosanayaruiz.com) | Impresiones y clics deben subir al absorber el trafico del otro dominio | Semanal |
| Performance (carlosanayaweb.com) | Impresiones deben bajar a cero | Semanal |
| Core Web Vitals (carlosanayaruiz.com) | No debe haber degradacion por el redirect | Quincenal |

---

## 7. Checklist Ejecutivo

### Acciones Inmediatas (Esta Semana)

- [ ] Implementar redirect 301 global de carlosanayaweb.com a carlosanayaruiz.com
- [ ] Verificar ambos dominios en Google Search Console
- [ ] Actualizar perfiles externos (LinkedIn, GitHub, Fiverr) a carlosanayaruiz.com
- [ ] Ejecutar `site:carlosanayaweb.com` y documentar que esta indexado

### Acciones a Corto Plazo (Proximo Mes)

- [ ] Confirmar deindexacion de carlosanayaweb.com en GSC
- [ ] Solicitar reindexacion de paginas clave en carlosanayaruiz.com
- [ ] Iniciar publicacion de blog en carlosanayaruiz.com
- [ ] Configurar monitoreo de queries de la seccion 4.1

### Acciones a Mediano Plazo (3-6 Meses)

- [ ] Evaluar si reactivar carlosanayaweb.com como Lab (Fase 2)
- [ ] Si se reactiva: implementar reglas de contenido y enlazado de este documento
- [ ] Si no: mantener redirect permanente y renovar dominio anualmente

### Revision Periodica

Este documento se revisa cada trimestre. Proxima revision: Julio 2026.

---

*Estrategia elaborada sobre la base del diagnostico tecnico del 2026-04-14 y la estructura actual de carlosanayaruiz.com.*
