# Estrategia de Indexacion -- carlosanayaruiz.com

> Define que URLs deben indexarse, como estan configuradas las directivas para motores de busqueda, y que monitorear para mantener la salud de indexacion.
> Ultima actualizacion: 2026-04-15

---

## 1. Estado Actual de la Configuracion

### 1.1 robots.ts (`app/robots.ts`)

```typescript
rules: [
  { userAgent: '*', allow: '/', disallow: ['/api/', '/private/'] },
],
sitemap: 'https://carlosanayaruiz.com/sitemap.xml',
host: 'https://carlosanayaruiz.com',
```

**Analisis:**
- Permite rastreo de todo el sitio excepto `/api/` y `/private/`.
- Apunta correctamente al sitemap.
- Incluye directiva `host` (util para Yandex, ignorada por Google).
- **No bloquea** rutas internas de Next.js como `/_next/` (Next.js las maneja automaticamente con headers `X-Robots-Tag`).

### 1.2 sitemap.ts (`app/sitemap.ts`)

Genera 16 URLs (8 paginas x 2 locales):

| Pagina | URL ES | URL EN | Prioridad | Frecuencia |
|--------|--------|--------|-----------|------------|
| Home | `/es` | `/en` | 1.0 | weekly |
| SEO Tecnico | `/es/seo-tecnico` | `/en/technical-seo` | 0.9 | monthly |
| Desarrollo Web | `/es/desarrollo-web` | `/en/web-development` | 0.9 | monthly |
| Automatizacion IA | `/es/automatizacion-ia` | `/en/ai-automation` | 0.8 | monthly |
| Dashboards | `/es/dashboards` | `/en/dashboards` | 0.8 | monthly |
| Sobre Mi | `/es/sobre-mi` | `/en/about` | 0.8 | monthly |
| Contacto | `/es/contacto` | `/en/contact` | 0.7 | monthly |
| Libros | `/es/libros` | `/en/books` | 0.6 | monthly |

Cada entrada incluye `alternates` con:
- `es-MX` -> version espanol
- `en-US` -> version ingles
- `x-default` -> version espanol (correcto, es el locale principal)

**`lastModified`:** Actualmente usa `new Date()` — se genera dinamicamente en cada request. Esto es correcto para un sitio estatico que se rebuild en cada deploy.

### 1.3 Directivas de Metadata por Pagina

Configuracion en `lib/seo.ts` via `generatePageMetadata()`:

```typescript
robots: {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-video-preview': -1,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
}
```

**Todas las paginas** usan `index: true, follow: true`. No hay paginas con `noIndex` activado.

Directivas de googleBot:
- `max-video-preview: -1` — Sin limite en preview de video (no hay videos actualmente, pero es proactivo).
- `max-image-preview: large` — Permite previews grandes de imagenes en resultados de busqueda.
- `max-snippet: -1` — Sin limite en la longitud del snippet textual.

### 1.4 Canonicals y hreflang

**Canonicals:** Cada pagina tiene canonical apuntando a si misma:
- Formato: `https://carlosanayaruiz.com/{locale}{path}`
- Ejemplo: `https://carlosanayaruiz.com/es/seo-tecnico`

**Hreflang (en `<head>` y en sitemap):**
- `es-MX` -> `/es/...`
- `en-US` -> `/en/...`
- `x-default` -> `/es/...`

**Validacion:**
- El hreflang es bidireccional (cada version apunta a la otra).
- `x-default` apunta correctamente al locale principal (espanol).
- Coincide entre sitemap y meta tags.

### 1.5 Routing y Locale Prefix

Configuracion en `i18n/routing.ts`:
- `localePrefix: 'always'` — Todas las URLs llevan prefijo de locale (`/es/...`, `/en/...`).
- `defaultLocale: 'es'` — Espanol es el idioma predeterminado.
- La raiz `carlosanayaruiz.com/` redirige a `carlosanayaruiz.com/es`.

---

## 2. Que Debe Indexarse

### URLs que DEBEN estar en el indice (16 URLs)

| URL | Motivo | Estado |
|-----|--------|--------|
| `/es` | Homepage principal, hub de marca | index, follow |
| `/en` | Homepage en ingles para mercado US | index, follow |
| `/es/seo-tecnico` | Money page principal ES | index, follow |
| `/en/technical-seo` | Money page principal EN | index, follow |
| `/es/desarrollo-web` | Money page ES | index, follow |
| `/en/web-development` | Money page EN | index, follow |
| `/es/automatizacion-ia` | Money page ES | index, follow |
| `/en/ai-automation` | Money page EN | index, follow |
| `/es/dashboards` | Money page ES | index, follow |
| `/en/dashboards` | Money page EN | index, follow |
| `/es/sobre-mi` | E-E-A-T, credibilidad | index, follow |
| `/en/about` | E-E-A-T, credibilidad EN | index, follow |
| `/es/contacto` | Conversion | index, follow |
| `/en/contact` | Conversion EN | index, follow |
| `/es/libros` | Contenido, autoridad | index, follow |
| `/en/books` | Contenido, autoridad EN | index, follow |

### URLs que NO deben indexarse

| Patron | Motivo | Mecanismo actual |
|--------|--------|-----------------|
| `/api/*` | Endpoints de API | `robots.ts` disallow |
| `/private/*` | Contenido privado (si existe) | `robots.ts` disallow |
| `/_next/*` | Assets internos de Next.js | Manejado automaticamente por Next.js |
| `/sitemap.xml` | El sitemap mismo | No necesita indexarse, Google lo consume |
| `/robots.txt` | Archivo de directivas | No necesita indexarse |
| `/manifest.json` | PWA manifest | No necesita indexarse |

### URLs potencialmente problematicas

| URL | Riesgo | Accion |
|-----|--------|--------|
| `carlosanayaruiz.com/` (sin locale) | Puede indexarse como duplicado si redireccion falla | Verificar que la redireccion 301 a `/es` funcione siempre |
| `carlosanayaruiz.com/es/` (con trailing slash) | Potencial duplicado | Verificar que Next.js normalice URLs |
| URLs con parametros de query | Versiones con `?utm_source=...` etc. | Google generalmente las maneja, pero monitorear en GSC |

---

## 3. Checklist de Validacion

### Antes de cada deploy

- [ ] Verificar que `sitemap.ts` incluye todas las paginas nuevas.
- [ ] Confirmar que las rutas nuevas estan en `i18n/routing.ts` con pathnames para ambos locales.
- [ ] Asegurar que la nueva pagina tiene `generateMetadata()` con canonical y hreflang correctos.
- [ ] Si la pagina no debe indexarse, pasar `noIndex: true` a `generatePageMetadata()`.

### Mensualmente

- [ ] Revisar Google Search Console > Paginas > "No indexadas" para detectar anomalias.
- [ ] Verificar que las 16 URLs aparecen como "Indexadas" en GSC.
- [ ] Comprobar que no hay URLs duplicadas con y sin trailing slash.
- [ ] Revisar "Cobertura" en GSC buscando errores de rastreo.
- [ ] Validar sitemap.xml con `https://carlosanayaruiz.com/sitemap.xml` directamente.

### Trimestralmente

- [ ] Hacer crawl completo con Screaming Frog para detectar enlaces rotos, canonicals incorrectos o hreflang desalineados.
- [ ] Comparar URLs indexadas en GSC vs URLs en sitemap — deben coincidir.
- [ ] Revisar Core Web Vitals en GSC para todas las URLs indexadas.

---

## 4. Estrategia de Monitoreo

### Google Search Console

1. **Propiedad verificada:** `https://carlosanayaruiz.com` (si no esta verificada, ver EXTERNAL_ACTIONS_MAIN_DOMAIN.md).
2. **Seccion "Paginas":**
   - Filtrar por "Indexadas" — deben ser exactamente 16 (8 ES + 8 EN).
   - Revisar "Descubiertas, no indexadas" — si aparecen URLs inesperadas, investigar.
   - Revisar "Rastreadas, no indexadas" — si una money page aparece aqui, es critico.
3. **Seccion "Sitemaps":**
   - Verificar que `/sitemap.xml` esta enviado y sin errores.
   - Verificar que las 16 URLs fueron descubiertas.
4. **Seccion "Configuracion" > "Rastreo":**
   - Monitorear tasa de rastreo. Para un sitio de 16 paginas no deberia haber problemas de crawl budget.

### Alertas a configurar

| Condicion | Accion |
|-----------|--------|
| Una money page (SEO, Web, IA, Dashboards) sale del indice | Investigar inmediatamente — revisar canonical, robots, noindex accidental |
| Aparecen mas de 20 URLs indexadas | Investigar duplicados, parametros de query, o paginas no deseadas |
| Errores de hreflang en GSC | Verificar que todas las alternates son bidireccionales |
| Aumento de "paginas con redirecciones" | Verificar que no se introdujeron redirect loops |

---

## 5. Consideraciones Futuras

### Si se agrega un blog

- Crear `app/[locale]/blog/` con paginas individuales por articulo.
- Agregar cada articulo al sitemap con `changeFrequency: 'weekly'` y prioridad 0.7.
- Implementar paginacion con `rel="next"` y `rel="prev"` si aplica.
- Considerar `noindex` para paginas de tags/categorias si no aportan contenido unico.

### Si se agregan paginas de caso de estudio

- Seguir el mismo patron de las money pages: metadata unica, canonical, hreflang, schema JSON-LD.
- Prioridad en sitemap: 0.7 (menor que servicios, mayor que libros).

### Si se agrega un area de cliente/dashboard privado

- Agregar `/app/`, `/dashboard/` o equivalente al `disallow` en `robots.ts`.
- Asegurar que las paginas autenticadas tengan `noIndex: true`.

---

*Este documento se actualiza cuando cambia la estructura de URLs, se agregan nuevas paginas, o se modifican directivas de indexacion.*
