# Plan de Medicion -- carlosanayaruiz.com

> Define que medir, como medirlo, con que herramientas y con que frecuencia para evaluar el rendimiento SEO, de contenido y de conversion del sitio.
> Ultima actualizacion: 2026-04-15

---

## 1. Objetivos de Medicion

El sitio cumple 3 funciones principales. Cada una tiene metricas distintas:

| Funcion | Objetivo | Metrica Principal |
|---------|----------|-------------------|
| **Marca personal** | Que "Carlos Anaya Ruiz" aparezca en Google con Knowledge Panel | Posicion en busquedas de marca, clics de marca |
| **Generacion de leads** | Que potenciales clientes lleguen y contacten | Formularios enviados, clicks a Fiverr, emails |
| **Autoridad tecnica** | Que el sitio sea referencia para SEO tecnico y desarrollo | Impresiones en queries de servicio, backlinks |

---

## 2. Consultas Objetivo (Keywords)

### 2.1 Consultas de Marca (alta intencion, baja competencia)

| Query | Pagina Objetivo | Resultado Esperado |
|-------|----------------|-------------------|
| `carlos anaya ruiz` | Home (`/es`) | Posicion 1, Knowledge Panel |
| `carlos anaya` | Home (`/es`) | Posicion 1-3 (nombre mas comun, competencia) |
| `carlos anaya seo` | Home o `/es/seo-tecnico` | Posicion 1 |
| `carlos anaya ruiz seo` | `/es/seo-tecnico` | Posicion 1 |
| `carlos anaya ruiz developer` | Home (`/en`) | Posicion 1 |
| `carlos anaya ruiz mexico` | Home (`/es`) | Posicion 1 |
| `carlosanayaruiz.com` | Home | Posicion 1 (sitelinks) |

**Metrica clave:** Impresiones y clics en GSC filtrados por estas queries. Si las impresiones suben pero los clics no, hay problema de CTR (revisar titles y descriptions).

### 2.2 Consultas de Servicio ES (media intencion, competencia variable)

| Query | Pagina Objetivo | Competencia |
|-------|----------------|-------------|
| `consultor seo tecnico mexico` | `/es/seo-tecnico` | Media-alta |
| `consultor seo tecnico cdmx` | `/es/seo-tecnico` | Media |
| `seo tecnico next.js` | `/es/seo-tecnico` | Baja (nicho) |
| `auditoria seo tecnico` | `/es/seo-tecnico` | Media |
| `desarrollo web next.js mexico` | `/es/desarrollo-web` | Baja-media |
| `desarrollador next.js freelance` | `/es/desarrollo-web` | Media |
| `automatizacion con ia empresas mexico` | `/es/automatizacion-ia` | Baja |
| `chatbot inteligente para empresas` | `/es/automatizacion-ia` | Media |
| `dashboards empresariales a medida` | `/es/dashboards` | Baja |
| `dashboard power bi consultoria` | `/es/dashboards` | Media |
| `datos estructurados schema.org` | `/es/seo-tecnico` | Baja (informacional) |
| `core web vitals optimizacion` | `/es/seo-tecnico` | Media |

### 2.3 Consultas de Servicio EN (para mercado US/internacional)

| Query | Pagina Objetivo | Competencia |
|-------|----------------|-------------|
| `technical seo consultant mexico` | `/en/technical-seo` | Media |
| `next.js developer mexico` | `/en/web-development` | Baja-media |
| `technical seo next.js` | `/en/technical-seo` | Baja (nicho) |
| `ai automation consultant` | `/en/ai-automation` | Alta |
| `custom dashboard development` | `/en/dashboards` | Media |
| `freelance seo consultant latam` | `/en/technical-seo` | Baja |

---

## 3. KPIs por Pagina

### 3.1 Metricas de Visibilidad (Google Search Console)

| Pagina | KPI Principal | Objetivo Mes 3 | Objetivo Mes 6 | Objetivo Mes 12 |
|--------|--------------|-----------------|-----------------|-----------------|
| Home ES | Impresiones de marca | 500/mes | 1,500/mes | 5,000/mes |
| Home EN | Impresiones de marca EN | 100/mes | 500/mes | 2,000/mes |
| SEO Tecnico ES | Impresiones queries servicio | 200/mes | 800/mes | 3,000/mes |
| SEO Tecnico EN | Impresiones queries servicio EN | 50/mes | 300/mes | 1,500/mes |
| Desarrollo Web ES | Impresiones queries servicio | 100/mes | 500/mes | 2,000/mes |
| Desarrollo Web EN | Impresiones queries servicio EN | 30/mes | 200/mes | 1,000/mes |
| Automatizacion IA ES | Impresiones queries servicio | 50/mes | 300/mes | 1,500/mes |
| Dashboards ES | Impresiones queries servicio | 50/mes | 200/mes | 1,000/mes |
| Sobre Mi | Impresiones queries de marca | 100/mes | 400/mes | 1,500/mes |
| Contacto | Impresiones (indirecto) | 30/mes | 100/mes | 500/mes |
| Libros | Impresiones queries informacionales | 20/mes | 100/mes | 500/mes |

### 3.2 Metricas de Engagement (Vercel Analytics)

| Metrica | Definicion | Objetivo |
|---------|-----------|----------|
| Pageviews/mes | Total de vistas de pagina | Crecimiento 10% mensual |
| Unique visitors/mes | Visitantes unicos | Crecimiento 10% mensual |
| Pages per session | Promedio de paginas vistas por visita | > 2.0 |
| Bounce rate (estimado) | Visitas de 1 sola pagina | < 60% |
| Top entry pages | Paginas de entrada mas frecuentes | Money pages deben estar en top 5 |

### 3.3 Metricas de Conversion

| Evento | Como Medir | Objetivo Mensual |
|--------|-----------|-----------------|
| Formulario de contacto enviado | Firestore: coleccion de mensajes de contacto | > 5/mes despues de mes 6 |
| Click en Fiverr | Vercel Analytics (si se trackea) o UTM parameters | > 10/mes |
| Click en email (mailto) | Dificil de medir directamente, usar UTM si es posible | N/A |
| Suscripcion newsletter | Firestore: coleccion de newsletter | > 10/mes |

---

## 4. Herramientas de Medicion

### 4.1 Google Search Console (GSC)

**Configuracion requerida:** Ver EXTERNAL_ACTIONS_MAIN_DOMAIN.md seccion 1.

| Uso | Donde en GSC | Frecuencia |
|-----|-------------|------------|
| Queries que generan impresiones | Rendimiento > Consultas | Semanal |
| Paginas que reciben trafico | Rendimiento > Paginas | Semanal |
| Estado de indexacion | Paginas > Indexadas vs No indexadas | Mensual |
| Errores de rastreo | Paginas > Por que no se indexan | Mensual |
| Core Web Vitals reales | Experiencia > Core Web Vitals | Mensual |
| Hreflang errors | Mejoras > Internacional | Mensual |
| Sitemaps status | Sitemaps | Despues de cada deploy |

**Filtros importantes:**
- Filtrar por pais: Mexico vs Estados Unidos (para separar mercados).
- Filtrar por dispositivo: Mobile vs Desktop.
- Filtrar por query regex: `carlos anaya` para queries de marca.
- Filtrar por pagina: Cada money page individualmente.

### 4.2 Vercel Analytics

**Ya configurado** en `app/[locale]/layout.tsx` con `<Analytics />`.

| Uso | Donde | Frecuencia |
|-----|-------|------------|
| Pageviews totales | Vercel Dashboard > Analytics | Semanal |
| Visitantes unicos | Vercel Dashboard > Analytics | Semanal |
| Top pages | Vercel Dashboard > Analytics > Pages | Semanal |
| Referrers | Vercel Dashboard > Analytics > Referrers | Mensual |
| Countries | Vercel Dashboard > Analytics > Countries | Mensual |
| Browsers/devices | Vercel Dashboard > Analytics > Devices | Trimestral |

### 4.3 Vercel Speed Insights

**Ya configurado** en `app/[locale]/layout.tsx` con `<SpeedInsights />`.

| Uso | Donde | Frecuencia |
|-----|-------|------------|
| LCP real (p75) | Vercel Dashboard > Speed Insights | Semanal |
| INP real (p75) | Vercel Dashboard > Speed Insights | Semanal |
| CLS real (p75) | Vercel Dashboard > Speed Insights | Semanal |
| FCP real (p75) | Vercel Dashboard > Speed Insights | Mensual |
| Performance by page | Vercel Dashboard > Speed Insights > Pages | Mensual |

### 4.4 PageSpeed Insights (tests sinteticos)

URL: `https://pagespeed.web.dev/`

| Uso | Frecuencia |
|-----|------------|
| Test de Home ES movil | Mensual |
| Test de SEO Tecnico ES movil | Mensual |
| Test de las 4 money pages | Despues de cada deploy mayor |
| Comparar con competidores | Trimestral |

### 4.5 Lighthouse CI (opcional, automatizable)

Integrar en el pipeline de CI/CD para detectar regresiones de rendimiento automaticamente.

```bash
# Ejecutar localmente
npx lhci autorun --collect.url=https://carlosanayaruiz.com/es --collect.url=https://carlosanayaruiz.com/es/seo-tecnico
```

---

## 5. Segmentacion por Locale

### Por que segmentar

El sitio tiene 2 mercados: espanol (Mexico/LATAM) y ingles (US/Internacional). Las metricas agregadas ocultan problemas especificos de un mercado.

### Como segmentar en GSC

1. **Por pais:** Rendimiento > filtrar pais = "Mexico" vs pais = "United States".
2. **Por pagina:** Filtrar por URL que contenga `/es/` vs `/en/`.
3. **Exportar datos a spreadsheet** para analisis mensual.

### Metricas por locale

| Metrica | ES (esperado) | EN (esperado) |
|---------|--------------|--------------|
| % del trafico total | 70-80% | 20-30% |
| Queries de marca | Mas impresiones | Menos, pero mas valor por conversion |
| CTR promedio | 3-8% | 2-5% (mas competencia en ingles) |
| Posicion promedio money pages | < 20 (mes 6) | < 30 (mes 6) |

### Banderas rojas

| Condicion | Significado | Accion |
|-----------|------------|--------|
| Paginas EN aparecen para queries ES | Hreflang incorrecto o canonical cruzado | Auditar hreflang en GSC y sitemap |
| Paginas ES no aparecen en Mexico | Indexacion fallida o competencia | Verificar indexacion en GSC |
| CTR < 1% con impresiones > 500 | Title/description no atractivos | Reescribir metadata |
| Posicion promedio empeora > 10 posiciones | Problema tecnico o algoritmo | Investigar fecha del cambio vs deploys/updates de Google |

---

## 6. Cadencia de Revision

### Semanal (15 minutos)

- [ ] Revisar GSC: Impresiones y clics de las ultimas 7 dias vs semana anterior.
- [ ] Revisar Vercel Analytics: Pageviews y visitantes unicos.
- [ ] Verificar que no hay errores de indexacion nuevos en GSC.

### Mensual (1 hora)

- [ ] **Reporte mensual de GSC:**
  - Impresiones totales ES vs EN.
  - Clics totales por pagina.
  - CTR promedio por money page.
  - Posicion promedio por money page.
  - Queries nuevas que aparecieron.
  - Queries que perdieron posicion.
- [ ] **Reporte mensual de Vercel:**
  - Top 10 paginas por views.
  - Top referrers.
  - Distribucion por pais.
- [ ] **Core Web Vitals:**
  - LCP, INP, CLS en Speed Insights.
  - Comparar con mes anterior.
- [ ] **Conversiones:**
  - Mensajes de contacto recibidos (Firestore).
  - Suscripciones de newsletter (Firestore).
- [ ] **PageSpeed Insights:**
  - Test sintetico de Home ES y SEO Tecnico ES en movil.
  - Registrar score en spreadsheet.

### Trimestral (2-3 horas)

- [ ] **Analisis de tendencias:**
  - Graficar impresiones/clics/posicion de los ultimos 3 meses.
  - Identificar paginas con mejor y peor rendimiento.
  - Comparar ES vs EN.
- [ ] **Audit tecnico:**
  - Crawl con Screaming Frog.
  - Verificar canonicals, hreflang, sitemap.
  - Validar schema con Google Rich Results Test.
- [ ] **Benchmark competidores:**
  - Buscar "consultor seo tecnico mexico" y documentar los 10 primeros resultados.
  - Comparar metricas de PageSpeed con los 3 principales competidores.
- [ ] **Backlink review:**
  - Verificar backlinks nuevos (GSC > Enlaces).
  - Evaluar si las acciones de backlink estan generando resultados.
- [ ] **Actualizacion de objetivos:**
  - Ajustar KPIs si se cumplieron o si las condiciones cambiaron.
  - Definir acciones para el siguiente trimestre.

---

## 7. Alertas y Umbrales

### Alertas automaticas (configurar en GSC)

GSC envia emails automaticos para:
- Problemas de indexacion nuevos.
- Errores de rastreo.
- Problemas de seguridad.
- Penalizaciones manuales.

**Asegurar que el email en GSC esta activo y se revisa.**

### Umbrales manuales (revisar en cada analisis mensual)

| Condicion | Umbral | Accion |
|-----------|--------|--------|
| Money page pierde > 5 posiciones | Caida de 5+ posiciones en 1 semana | Investigar: cambio de algoritmo, error tecnico, nuevo competidor |
| Impresiones caen > 30% mes a mes | Caida de 30%+ | Verificar indexacion, buscar deindex accidental |
| CWV LCP > 2.5s en movil | Supera umbral de Google | Investigar: imagenes, fuentes, server response time |
| CWV CLS > 0.1 | Supera umbral de Google | Investigar: imagenes sin dimensiones, fuentes, ads |
| CTR < 1% con > 1000 impresiones | CTR muy bajo | Reescribir title y description de la pagina afectada |
| 0 formularios de contacto en 30 dias | Sin conversiones | Verificar que el formulario funciona, revisar UX |
| URL indexada no esperada | URL fuera del sitemap aparece indexada | Investigar, agregar noindex si es necesario |
| URL esperada sale del indice | Money page deja de estar indexada | URGENTE: verificar canonical, robots, noindex accidental |

---

## 8. Spreadsheet de Seguimiento

### Estructura recomendada (Google Sheets)

**Hoja 1: Metricas Mensuales GSC**

| Mes | Pagina | Impresiones | Clics | CTR | Posicion Promedio | Locale |
|-----|--------|-------------|-------|-----|-------------------|--------|
| 2026-04 | /es/seo-tecnico | 150 | 5 | 3.3% | 25.4 | ES |
| 2026-04 | /en/technical-seo | 30 | 1 | 3.3% | 32.1 | EN |

**Hoja 2: Core Web Vitals**

| Mes | Pagina | LCP (p75) | INP (p75) | CLS (p75) | PSI Score Mobile |
|-----|--------|-----------|-----------|-----------|------------------|
| 2026-04 | /es | 1.8s | 120ms | 0.02 | 95 |

**Hoja 3: Conversiones**

| Mes | Contactos | Newsletter | Clicks Fiverr (est.) | Pageviews |
|-----|-----------|-----------|---------------------|-----------|
| 2026-04 | 2 | 5 | 8 | 450 |

**Hoja 4: Queries de Marca**

| Mes | Query | Impresiones | Clics | Posicion |
|-----|-------|-------------|-------|----------|
| 2026-04 | carlos anaya ruiz | 200 | 50 | 1.2 |
| 2026-04 | carlos anaya seo | 30 | 8 | 3.5 |

---

## 9. Cuando Actuar vs Cuando Esperar

| Situacion | Accion |
|-----------|--------|
| Nuevo deploy, no hay cambios en rankings en 1 semana | **Esperar.** Google puede tardar 2-4 semanas en recrawlear. |
| Money page pierde 3 posiciones en 1 semana | **Esperar 2 semanas.** Las fluctuaciones de 1-5 posiciones son normales. |
| Money page pierde > 10 posiciones | **Actuar.** Verificar que no hay problema tecnico (noindex, canonical roto, error 5xx). |
| Impresiones suben pero clics no | **Actuar.** Reescribir title/description para mejorar CTR. |
| Impresiones y clics suben constantemente | **Celebrar y documentar.** Continuar la estrategia actual. |
| Knowledge Panel aparece para "carlos anaya ruiz" | **Documentar y verificar** que la informacion es correcta. Reclamar si es posible. |
| CWV se degrada despues de un deploy | **Actuar inmediatamente.** Revertir si es necesario, investigar la causa. |

---

*Este documento se actualiza trimestralmente o cuando cambian las herramientas de medicion, los objetivos de negocio, o la estructura del sitio.*
