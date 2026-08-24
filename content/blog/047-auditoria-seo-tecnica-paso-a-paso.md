---
n: 47
title: "Auditoría SEO técnica: proceso paso a paso"
slug: "auditoria-seo-tecnica-paso-a-paso"
description: "Proceso completo de auditoría SEO técnica en 9 bloques, con las herramientas de cada paso y cómo priorizar los hallazgos por impacto."
category: "SEO"
keyword: "auditoría seo técnica"
tipo: "satelite"
tags: ["seo técnico","auditoría","indexación","rendimiento"]
---


**Una auditoría técnica responde a una sola pregunta: ¿hay algo en la implementación del sitio que impida que el contenido bueno posicione?** No mide calidad de contenido ni autoridad. Mide obstáculos.

Este es el proceso en nueve bloques, ordenado para que encuentres primero lo que más importa.

---

### Bloque 1 — Indexación (empieza siempre aquí)

Si no está indexado, nada más importa.

**Qué revisar:**
- Cuántas URLs tienes vs. cuántas están indexadas. Una diferencia grande es tu primer hallazgo.
- El informe de cobertura de tu consola de búsqueda: qué está excluido y por qué.
- `robots.txt`: ¿bloquea algo que debería indexarse?
- Etiquetas de no-indexación aplicadas por error, especialmente tras una migración.
- Encabezados HTTP con directivas de indexación (se olvidan porque no se ven en el HTML).

**El error más común:** un `noindex` que quedó desde el entorno de pruebas. Ha hundido más sitios que cualquier algoritmo.

---

### Bloque 2 — Rastreo

**Qué revisar:**
- Rastrea el sitio completo con una herramienta de rastreo y compara contra tu sitemap. Las diferencias son informativas en ambos sentidos.
- Páginas huérfanas: existen pero ninguna otra página enlaza a ellas.
- Profundidad de clic: si una página importante está a cinco clics de la portada, tienes un problema de arquitectura.
- Cadenas y bucles de redirección.
- Presupuesto de rastreo desperdiciado: URLs de filtros, parámetros, paginación infinita, resultados de búsqueda interna.

Este último punto es crítico en comercios electrónicos y sitios con filtros. Combinaciones de parámetros pueden generar millones de URLs que consumen el rastreo sin aportar nada.

---

### Bloque 3 — Duplicación y canonicalización

**Qué revisar:**
- Una sola versión accesible del sitio: con o sin `www`, con o sin barra final, HTTP redirigiendo a HTTPS. Todas las variantes deben resolver a una.
- Etiquetas canónicas correctas y consistentes.
- Contenido duplicado entre categorías, versiones para impresión, parámetros de seguimiento.
- Etiquetas `hreflang` bien formadas si tienes versiones por idioma o país. Es de lo que más se implementa mal.

---

### Bloque 4 — Estructura de URLs y arquitectura

**Qué revisar:**
- URLs legibles, cortas, sin parámetros innecesarios.
- Jerarquía coherente que refleje la estructura del contenido.
- Enlazado interno: ¿las páginas importantes reciben enlaces desde muchas partes del sitio?
- Migas de pan implementadas y marcadas con datos estructurados.

**El hallazgo más frecuente:** enlazado interno pobre. Sitios con buen contenido donde ningún artículo enlaza a otro. Es el arreglo más barato con mayor impacto en muchos casos.

---

### Bloque 5 — Contenido a nivel técnico

**Qué revisar:**
- Títulos únicos, dentro de longitud razonable, con la keyword principal.
- Meta descripciones únicas y persuasivas.
- Un solo H1 por página, jerarquía de encabezados sin saltos.
- Canibalización: dos o más URLs compitiendo por la misma keyword. Se detecta cruzando el informe de rendimiento por consulta y viendo si varias URLs reciben impresiones para el mismo término.
- Páginas de contenido escaso o sin propósito claro.

---

### Bloque 6 — Rendimiento

**Qué revisar:**
- Core Web Vitals en **datos de campo**, no solo en laboratorio.
- Tiempo de respuesta del servidor.
- Peso de las páginas y número de peticiones.
- Imágenes: formato moderno, dimensiones declaradas, carga diferida en lo que está debajo del pliegue.
- Scripts de terceros y su impacto real. Este suele ser el mayor culpable.

---

### Bloque 7 — Móvil

**Qué revisar:**
- Diseño adaptable funcional en anchos reales, no solo en el simulador.
- Paridad de contenido: lo que se ve en escritorio debe estar en móvil. Si escondes contenido en móvil, para efectos de indexación puede no existir.
- Elementos táctiles con tamaño suficiente y separación adecuada.
- Ventanas emergentes intrusivas al entrar.

---

### Bloque 8 — Datos estructurados

**Qué revisar:**
- Schema implementado en JSON-LD.
- Tipos correctos según el contenido: `Article`, `Product`, `LocalBusiness`, `FAQPage`, `BreadcrumbList`.
- Validación sin errores en las herramientas de prueba oficiales.
- Coherencia entre lo marcado y lo visible en la página. Marcar algo que no está en la página es una violación de las directrices.

---

### Bloque 9 — Seguridad y aspectos internacionales

**Qué revisar:**
- HTTPS en todo el sitio, sin contenido mixto.
- Certificado vigente y bien configurado.
- Si operas en varios países o idiomas: estructura de URLs coherente, `hreflang` correcto, geolocalización configurada.

---

### Cómo priorizar los hallazgos

Una auditoría genera decenas de puntos. Sin priorización, no se ejecuta ninguno.

Clasifica cada hallazgo en dos ejes: **impacto potencial** y **esfuerzo de corrección**.

| | Bajo esfuerzo | Alto esfuerzo |
|---|---|---|
| **Alto impacto** | **Hazlo esta semana** | Planifica y presupuesta |
| **Bajo impacto** | Hazlo cuando toques esa área | Documenta y déjalo |

Los hallazgos de alto impacto y bajo esfuerzo suelen ser: quitar un `noindex` accidental, arreglar la canonicalización, corregir el sitemap, añadir enlaces internos a páginas huérfanas.

**Entrega la auditoría con esos cuatro cuadrantes**, no con una lista de 60 puntos sin orden. La diferencia entre una auditoría que se ejecuta y una que se archiva está en la priorización, no en la exhaustividad.

---

### Cadencia recomendada

- **Auditoría completa:** una o dos veces al año, y siempre después de una migración o rediseño.
- **Revisión ligera:** mensual. Indexación, errores de rastreo, Core Web Vitals, páginas nuevas.
- **Monitoreo continuo:** alertas automáticas ante caídas de indexación o errores de servidor.

---

### Preguntas frecuentes

**¿Cuánto tarda una auditoría completa?**
Para un sitio de tamaño medio, de 15 a 30 horas de análisis más el tiempo de redacción. Sitios grandes con comercio electrónico, bastante más.

**¿Qué herramientas necesito?**
Una consola de búsqueda del buscador, un rastreador de escritorio, una herramienta de análisis de rendimiento y un validador de datos estructurados. Con eso cubres la mayoría. Las suites de pago añaden datos de competencia y keywords, útiles pero no imprescindibles para la parte técnica.

**¿En cuánto se ven resultados?**
Los arreglos de indexación pueden verse en días. Los de arquitectura y rendimiento, en semanas o meses.
