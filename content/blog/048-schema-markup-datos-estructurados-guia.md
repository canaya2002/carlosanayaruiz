---
n: 48
title: "Schema markup: guía de datos estructurados"
slug: "schema-markup-datos-estructurados-guia"
description: "Guía de schema markup con JSON-LD listo para copiar: Article, FAQPage, LocalBusiness, Product y cómo validarlo sin errores."
category: "SEO"
keyword: "schema markup"
tipo: "satelite"
tags: ["schema","json-ld","datos estructurados","seo técnico"]
---


**Schema markup es un vocabulario estándar para describirle a las máquinas qué es tu contenido.** No cambia lo que ve el usuario: cambia lo que entienden los buscadores y los sistemas de IA que recuperan información.

El formato recomendado es JSON-LD: se coloca en un bloque de script, no ensucia el HTML y es fácil de generar dinámicamente.

---

### Los tipos que realmente vale la pena implementar

De los cientos de tipos que existen, estos cubren la mayoría de los casos:

| Tipo | Para qué |
|---|---|
| `Organization` / `Person` | Identidad de la entidad, en toda la web |
| `WebSite` | El sitio, con búsqueda interna |
| `BreadcrumbList` | Migas de pan |
| `Article` / `BlogPosting` | Contenido editorial |
| `FAQPage` | Bloques de preguntas frecuentes |
| `LocalBusiness` | Negocios con ubicación física |
| `Product` + `Offer` | Comercio electrónico |
| `Service` | Servicios profesionales |
| `HowTo` | Procesos paso a paso |

---

### Article: el más útil para contenido

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Schema markup: guía de datos estructurados",
  "description": "Guía práctica de datos estructurados con JSON-LD.",
  "image": ["https://midominio.com/portadas/schema.jpg"],
  "datePublished": "2026-08-21T09:00:00-06:00",
  "dateModified": "2026-08-21T09:00:00-06:00",
  "author": {
    "@type": "Person",
    "name": "Carlos Anaya Ruiz",
    "url": "https://midominio.com/sobre-mi",
    "sameAs": [
      "https://www.linkedin.com/in/perfil",
      "https://github.com/usuario"
    ]
  },
  "publisher": {
    "@type": "Organization",
    "name": "Mi Sitio",
    "logo": {
      "@type": "ImageObject",
      "url": "https://midominio.com/logo.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://midominio.com/blog/schema-markup"
  }
}
</script>
```

**El campo `sameAs` del autor es el más subestimado.** Vincula tu identidad en el sitio con tus perfiles públicos y ayuda a construir tu entidad. Es directamente relevante para E-E-A-T y para que los sistemas de IA sepan quién eres.

---

### FAQPage: alto retorno, bajo esfuerzo

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Schema markup mejora el posicionamiento?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No es un factor directo de ranking, pero mejora cómo se presenta tu resultado y facilita que los sistemas entiendan tu contenido."
      }
    },
    {
      "@type": "Question",
      "name": "¿Qué formato debo usar?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "JSON-LD es el formato recomendado. Se inserta como un bloque de script y no interfiere con el HTML."
      }
    }
  ]
}
</script>
```

**Regla obligatoria:** las preguntas y respuestas marcadas **deben estar visibles en la página**. Marcar contenido que el usuario no ve es una violación de las directrices y puede acarrear una acción manual.

---

### LocalBusiness: crítico para multi-sucursal

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Nombre Exacto del Negocio",
  "image": "https://midominio.com/sucursales/cdmx.jpg",
  "@id": "https://midominio.com/sucursales/cdmx",
  "url": "https://midominio.com/sucursales/cdmx",
  "telephone": "+52-55-1234-5678",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Av. Ejemplo 123, Piso 4",
    "addressLocality": "Ciudad de México",
    "addressRegion": "CDMX",
    "postalCode": "06600",
    "addressCountry": "MX"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 19.4326,
    "longitude": -99.1332
  },
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
    "opens": "09:00",
    "closes": "18:00"
  }],
  "areaServed": { "@type": "City", "name": "Ciudad de México" }
}
</script>
```

**Puntos críticos en multi-sucursal:**
- Una página por ubicación, cada una con su propio schema y su propio `@id`.
- El nombre, dirección y teléfono deben coincidir **exactamente** con lo que aparece en tu ficha de negocio y en cualquier directorio. La inconsistencia de estos datos es el problema número uno del SEO local multi-ubicación.
- Un teléfono distinto por sucursal cuando sea posible. Compartir un solo número entre veinte ubicaciones genera confusión en los sistemas.

---

### Cómo implementarlo en Next.js

```tsx
// app/blog/[slug]/page.tsx
export default async function ArticuloPage({ params }) {
  const articulo = await obtenerArticulo(params.slug)

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: articulo.titulo,
    datePublished: articulo.publicadoEn,
    dateModified: articulo.actualizadoEn,
    author: { '@type': 'Person', name: 'Carlos Anaya Ruiz' },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <article>{/* contenido */}</article>
    </>
  )
}
```

Genéralo desde los mismos datos que renderizan la página. Si el schema se escribe a mano aparte, se desincroniza en la primera actualización.

---

### Los errores que invalidan tu schema

**1. Marcar contenido no visible.** Violación de directrices.

**2. Campos obligatorios ausentes.** Cada tipo tiene requisitos. El validador te los señala.

**3. Fechas mal formateadas.** Deben ser ISO 8601 con zona horaria.

**4. Múltiples bloques contradictorios.** Dos schemas de `Article` en la misma página con datos distintos.

**5. Reseñas propias marcadas como agregadas.** Marcar valoraciones que no provienen de reseñas reales y verificables de usuarios es una violación seria.

**6. Copiar y pegar sin adaptar.** Un schema con la dirección del ejemplo del tutorial es peor que no tener schema.

---

### Validación

Antes de publicar y después de cada cambio estructural:

1. Prueba de resultados enriquecidos del buscador: te dice si califica para presentaciones especiales.
2. Validador oficial del vocabulario schema.org: te dice si el marcado es correcto en general.
3. Informe de mejoras de tu consola de búsqueda: monitorea errores en producción a lo largo del tiempo.

---

### Preguntas frecuentes

**¿Schema es factor de posicionamiento?**
No de forma directa según lo comunicado por Google. Su valor está en la comprensión del contenido, en la elegibilidad para resultados enriquecidos y, cada vez más, en cómo los sistemas de IA construyen tu entidad.

**¿Cuánto tarda en reflejarse?**
Desde días hasta semanas, según la frecuencia de rastreo de tu sitio.

**¿Puedo usar un gestor de etiquetas para inyectarlo?**
Funciona, pero es frágil y depende de la ejecución de JavaScript. Prefiere inyectarlo en el HTML del servidor.
