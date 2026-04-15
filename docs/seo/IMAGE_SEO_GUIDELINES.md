# Guia de SEO para Imagenes -- carlosanayaruiz.com

> Estandares para nombrar, formatear, optimizar y documentar imagenes en el sitio. Basado en el inventario actual de archivos en `public/` y las referencias en el codigo.
> Ultima actualizacion: 2026-04-15

---

## 1. Inventario Actual de Imagenes

### 1.1 Imagenes en `public/` (existentes y verificadas)

| Archivo | Uso | Dimensiones Esperadas | Formato |
|---------|-----|----------------------|---------|
| `carlos-anaya-ruiz-software.png` | Avatar/headshot principal (Hero, About, Schema, OG fallback) | Cuadrada, min 400x400 | PNG |
| `og-default.png` | OG image por defecto | 1200x630 | PNG |
| `og-es.png` | OG image para paginas en espanol | 1200x630 | PNG |
| `og-en.png` | OG image para paginas en ingles | 1200x630 | PNG |
| `apple-touch-icon.png` | Icono Apple | 180x180 | PNG |
| `icon-192.png` | PWA icon | 192x192 | PNG |
| `icon-512.png` | PWA icon grande | 512x512 | PNG |
| `favicon.ico` | Icono de pestana del navegador | 32x32 | ICO |
| `manifest.json` | PWA manifest (no es imagen) | - | JSON |

### 1.2 Imagenes referenciadas pero posiblemente inexistentes

Las siguientes imagenes estan referenciadas en `data/awards.ts` pero **no existen en `public/`** (la carpeta `public/images/awards/` no fue encontrada):

| Referencia en codigo | Archivo esperado | Estado |
|---------------------|-----------------|--------|
| `award.image` para NASA SpaceApps | `/images/awards/nasa-spaceapps.png` | **NO EXISTE** |
| `award.image` para LogiRoute AI | `/images/awards/logiroute.png` | **NO EXISTE** |
| `award.image` para TOEFL | `/images/awards/toefl.png` | **NO EXISTE** |

**Impacto:** Estas imagenes estan definidas en el modelo de datos pero no se renderizan en ningun componente actualmente (la pagina Sobre Mi muestra los premios como cards de texto sin imagen). Si en el futuro se agregan `<Image>` a los award cards, estas rutas fallarian.

**Accion recomendada:** Crear `public/images/awards/` y agregar las imagenes, o limpiar las referencias del modelo de datos si no se van a usar.

---

## 2. Convenciones de Nomenclatura

### Reglas de nombrado de archivos

| Regla | Ejemplo Correcto | Ejemplo Incorrecto |
|-------|-----------------|-------------------|
| Usar kebab-case (minusculas, guiones) | `carlos-anaya-ruiz-software.png` | `CarlosAnaya_Software.PNG` |
| Incluir el nombre completo si es una foto personal | `carlos-anaya-ruiz-conferencia.webp` | `foto-conferencia.webp` |
| Describir el contenido, no la ubicacion | `dashboard-ventas-tiempo-real.webp` | `seccion-3-imagen-2.webp` |
| Incluir contexto relevante para SEO | `auditoria-seo-tecnico-ejemplo.webp` | `screenshot-1.webp` |
| Usar la extension correcta en minusculas | `.webp`, `.png`, `.avif` | `.WEBP`, `.PNG` |

### Estructura de carpetas recomendada

```
public/
  carlos-anaya-ruiz-software.png     <- Avatar principal
  og-default.png                      <- OG images
  og-es.png
  og-en.png
  apple-touch-icon.png               <- Iconos PWA
  icon-192.png
  icon-512.png
  favicon.ico
  manifest.json
  images/
    awards/
      nasa-spaceapps-carlos-anaya.webp
      logiroute-ai-hackathon.webp
      toefl-certificacion.webp
    services/                         <- Futuro: imagenes de servicios
      auditoria-seo-tecnico.webp
      desarrollo-web-nextjs.webp
    projects/                         <- Futuro: capturas de proyectos
      proyecto-dashboard-amazon.webp
    blog/                             <- Futuro: imagenes de blog
```

---

## 3. Alt Text (Texto Alternativo)

### Principios

1. **Describir lo que se ve**, no lo que se quiere posicionar.
2. **Incluir el nombre "Carlos Anaya Ruiz" de forma natural** en imagenes personales.
3. **No empezar con "Imagen de..."** — el lector de pantalla ya dice "imagen".
4. **Ser especifico:** "Carlos Anaya Ruiz presentando un dashboard de ventas" es mejor que "persona en computadora".
5. **Usar el idioma del locale** — alt text diferente para ES y EN.

### Alt text actual del avatar (definido en `lib/constants.ts`)

```typescript
avatarAlt: {
  es: 'Carlos Anaya Ruiz — Consultor SEO tecnico y desarrollador full-stack en Ciudad de Mexico',
  en: 'Carlos Anaya Ruiz — Technical SEO consultant and full-stack developer in Mexico City',
}
```

**Evaluacion:** Correcto. Incluye nombre completo, rol profesional y ubicacion. Es descriptivo y natural.

### Plantillas de alt text para imagenes futuras

| Tipo de Imagen | Plantilla ES | Plantilla EN |
|----------------|-------------|-------------|
| Foto personal | `Carlos Anaya Ruiz [accion/contexto]` | `Carlos Anaya Ruiz [action/context]` |
| Screenshot de proyecto | `[Nombre del proyecto] — [descripcion de lo que se ve]` | Idem en ingles |
| Diagrama tecnico | `Diagrama de [concepto] mostrando [elementos clave]` | `[Concept] diagram showing [key elements]` |
| OG image | `Carlos Anaya Ruiz — [titulo o servicio de la pagina]` | Idem en ingles |
| Captura de herramienta | `[Herramienta] mostrando [metrica o resultado especifico]` | Idem en ingles |

### Imagenes decorativas

Imagenes puramente decorativas (fondos, separadores, iconos lucide) deben usar `aria-hidden="true"` y alt vacio. El sitio ya hace esto correctamente con los iconos:

```tsx
<Search className="h-7 w-7 text-primary" aria-hidden="true" />
```

---

## 4. Dimensiones y Formatos

### Formatos soportados

La configuracion de `next.config.ts` habilita:

```typescript
images: {
  formats: ['image/avif', 'image/webp'],
}
```

Next.js sirve automaticamente AVIF o WebP segun el soporte del navegador cuando se usa `<Image>`. Los archivos fuente pueden ser PNG o JPG — Next.js los convierte al vuelo.

### Dimensiones recomendadas por tipo

| Tipo | Dimensiones | Formato Fuente | Peso Maximo |
|------|------------|----------------|-------------|
| OG Image | 1200x630 exacto | PNG | 200 KB |
| Avatar/headshot | Min 400x400, cuadrada | PNG o WebP | 100 KB |
| PWA icons | 192x192, 512x512 | PNG | 50 KB |
| Apple touch icon | 180x180 | PNG | 30 KB |
| Favicon | 32x32 | ICO | 10 KB |
| Screenshot de proyecto | 1200x800 (3:2) | WebP | 150 KB |
| Imagen inline en blog | 800x600 o 1200x800 | WebP | 100 KB |
| Diagrama/infografia | Variable, max 1600px ancho | SVG o WebP | 200 KB |

### Verificacion de las OG images actuales

Las OG images deben cumplir exactamente 1200x630 para que Facebook, LinkedIn y Twitter las muestren correctamente sin recorte.

**Accion:** Verificar dimensiones reales de `og-default.png`, `og-es.png` y `og-en.png` con:
```bash
# En terminal
identify public/og-default.png public/og-es.png public/og-en.png
# o con Next.js Image optimization check
```

---

## 5. Uso del Componente Image de Next.js

### Configuracion actual correcta

El sitio usa `next/image` correctamente en Home y Sobre Mi:

```tsx
<Image
  src={SEO_IMAGES.avatar}
  alt={SEO_IMAGES.avatarAlt[locale]}
  fill
  className="object-cover"
  sizes="(max-width: 768px) 80px, 96px"
  priority
/>
```

**Buenas practicas ya implementadas:**
- `fill` con `object-cover` para mantener aspect ratio.
- `sizes` con breakpoints especificos (reduce tamano de descarga en movil).
- `priority` solo en imagenes above-the-fold (hero, avatar).
- Alt text descriptivo y localizado.

### Checklist para nuevas imagenes

Al agregar cualquier imagen nueva:

- [ ] Usar `<Image>` de `next/image`, nunca `<img>` HTML directo.
- [ ] Definir `width` y `height` explicitos O usar `fill` con contenedor de dimensiones fijas.
- [ ] Definir `sizes` apropiado para evitar descargas innecesarias en movil.
- [ ] Usar `priority` SOLO si la imagen esta above-the-fold (hero, primer viewport).
- [ ] Agregar alt text descriptivo en ambos idiomas (ES/EN).
- [ ] Si es decorativa, usar `alt=""` y `aria-hidden="true"`.
- [ ] Verificar que el archivo fuente esta en `public/` o `public/images/`.
- [ ] Agregar la referencia a `SEO_IMAGES` en `lib/constants.ts` si es una imagen reutilizada.

---

## 6. Lazy Loading

### Comportamiento actual

- Next.js `<Image>` aplica `loading="lazy"` por defecto a todas las imagenes **excepto** las que tienen `priority`.
- Las imagenes del hero (avatar en Home y Sobre Mi) tienen `priority` — se cargan inmediatamente. Correcto.
- Los iconos Lucide son SVG inline — no afectan performance de imagenes.

### Reglas para imagenes futuras

| Posicion en la pagina | `priority` | `loading` |
|----------------------|------------|-----------|
| Hero / primer viewport | `priority` | eager (automatico) |
| Segundo/tercer viewport | No | lazy (automatico) |
| Imagenes en tabs/acordeones | No | lazy (automatico) |
| Imagenes en modals | No | lazy (automatico) |
| OG images (meta tags) | No aplica | No aplica (solo meta) |

---

## 7. Imagenes en Schema JSON-LD

### Configuracion actual en `lib/schema.ts`

```typescript
// Person schema
image: {
  '@type': 'ImageObject',
  '@id': 'https://carlosanayaruiz.com/#personimage',
  url: 'https://carlosanayaruiz.com/carlos-anaya-ruiz-software.png',
  contentUrl: 'https://carlosanayaruiz.com/carlos-anaya-ruiz-software.png',
  caption: 'Carlos Anaya Ruiz — Technical SEO Consultant & Full-Stack Engineer',
  inLanguage: 'es-MX',  // o 'en-US' segun locale
}
```

**Evaluacion:** Correcto. La imagen del schema Person usa URL absoluta y tiene caption descriptivo.

### Recomendacion para imagenes futuras en schema

Si se agregan proyectos, articulos de blog o productos:
- Siempre usar URL absoluta (`https://carlosanayaruiz.com/images/...`).
- Incluir `width` y `height` en el ImageObject del schema.
- El `caption` debe describir la imagen, no ser un keyword stuff.

---

## 8. Acciones Pendientes

| # | Accion | Prioridad | Estado |
|---|--------|-----------|--------|
| 1 | Crear carpeta `public/images/awards/` con imagenes reales o eliminar referencias en `data/awards.ts` | Alta | Pendiente |
| 2 | Verificar dimensiones exactas de las 3 OG images (deben ser 1200x630) | Alta | Pendiente |
| 3 | Considerar generar OG images dinamicas con `next/og` para paginas de servicio individuales | Media | Futuro |
| 4 | Agregar `<Image>` con screenshots de proyectos en las paginas de servicio cuando haya casos de estudio | Media | Futuro |
| 5 | Comprimir el avatar principal si pesa mas de 100 KB | Baja | Verificar |
| 6 | Considerar agregar una imagen decorativa de fondo en la seccion hero (actualmente es solo CSS gradient) | Baja | Futuro |

---

*Este documento se actualiza cuando se agregan nuevas imagenes al sitio o se modifican las convenciones de manejo de imagenes.*
