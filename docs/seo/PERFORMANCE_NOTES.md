# Notas de Rendimiento -- carlosanayaruiz.com

> Analisis tecnico del rendimiento del sitio basado en el codigo fuente. Fortalezas actuales, areas de mejora y recomendaciones accionables.
> Ultima actualizacion: 2026-04-15

---

## 1. Resumen de Arquitectura de Rendimiento

| Aspecto | Estado | Detalle |
|---------|--------|---------|
| Framework | Next.js 16, App Router | Server Components por defecto |
| Renderizado | SSG/SSR hibrido | Todas las paginas son server components |
| Deploy | Vercel | Edge network, ISR nativo |
| Fuentes | `next/font` con `display: swap` | Inter + Playfair Display |
| Imagenes | `next/image` con AVIF/WebP | Optimizacion automatica |
| Client Components | Minimos (4 componentes) | Solo lo interactivo |
| Analytics | Vercel Speed Insights + Analytics | Carga asincrona |
| Headers de seguridad | Configurados en `next.config.ts` | HSTS, X-Frame, etc. |
| Scripts de terceros | Ninguno detectado | Sin Google Analytics, Tag Manager, etc. |

---

## 2. Fuentes (Fonts)

### Configuracion actual (`app/[locale]/layout.tsx`)

```typescript
const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-geist-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display-serif',
  display: 'swap',
  weight: ['400', '600', '700'],
})
```

**Fortalezas:**
- `display: 'swap'` evita FOIT (Flash of Invisible Text). El texto se muestra inmediatamente con la fuente del sistema y se intercambia cuando la fuente personalizada carga.
- `next/font` descarga las fuentes en build time y las sirve desde el mismo dominio (sin request a Google Fonts).
- Los subsets `latin` y `latin-ext` cubren espanol e ingles correctamente.
- Pesos especificos (`400, 500, 600, 700`) evitan descargar pesos innecesarios.

**Observaciones:**
- La variable CSS se llama `--font-geist-sans` pero la fuente es Inter, no Geist. Esto es cosmetico (no afecta rendimiento) pero puede confundir en mantenimiento.
- Se cargan 4 pesos de Inter y 3 de Playfair = 7 archivos de fuente totales.

**Posibles mejoras:**

| Mejora | Impacto | Esfuerzo | Recomendacion |
|--------|---------|----------|---------------|
| Reducir pesos de Inter a 3 (400, 600, 700) si 500 no se usa mucho | Bajo (~10-20 KB menos) | Minimo | Verificar uso de `font-medium` en el sitio |
| Evaluar si Playfair Display se usa en suficientes lugares para justificar su carga | Medio (~30-50 KB si se elimina) | Revisar diseno | Verificar donde se renderiza `font-display-serif` |
| Agregar `preload` hints para el peso mas critico (Inter 400) | Bajo | Minimo | Next.js ya lo hace automaticamente con `next/font` |

---

## 3. Imagenes

### Configuracion actual (`next.config.ts`)

```typescript
images: {
  formats: ['image/avif', 'image/webp'],
  remotePatterns: [
    { protocol: 'https', hostname: '**' },
  ],
}
```

**Fortalezas:**
- AVIF como formato primario (30-50% mas pequeno que WebP, 50-70% mas que JPEG).
- WebP como fallback para navegadores sin soporte AVIF.
- Next.js `<Image>` maneja automaticamente: resize, formato, lazy loading, responsive `srcset`.

**Uso actual de `<Image>`:**
- Home: Avatar con `priority`, `sizes="(max-width: 768px) 80px, 96px"`.
- Sobre Mi: Avatar con `priority`, `sizes="(max-width: 768px) 144px, 160px"`.
- No hay mas imagenes en el sitio actualmente.

**Observaciones:**
- `remotePatterns: [{ hostname: '**' }]` permite optimizar imagenes de cualquier dominio externo. Esto es permisivo — si no se usan imagenes remotas, se podria restringir. No es un problema de rendimiento pero si de seguridad.
- El sitio tiene muy pocas imagenes, lo cual es excelente para rendimiento pero puede ser una desventaja visual/UX.

---

## 4. Client Components vs Server Components

### Inventario de Client Components

Solo 4 archivos usan `'use client'`:

| Componente | Archivo | Motivo de `use client` |
|------------|---------|----------------------|
| Header | `components/layout/header.tsx` | `useState` para menu movil y dropdown |
| ContactForm | `components/sections/contact-form.tsx` | `useState` para form state, submit handler |
| Newsletter | `components/sections/newsletter.tsx` | `useState` para email input y submit |
| LanguageSwitcher | `components/language-switcher.tsx` | Interaccion de cambio de idioma |

**Todas las paginas son Server Components:**
- `app/[locale]/page.tsx` (Home)
- `app/[locale]/sobre-mi/page.tsx`
- `app/[locale]/contacto/page.tsx`
- `app/[locale]/libros/page.tsx`
- `app/[locale]/seo-tecnico/page.tsx`
- `app/[locale]/desarrollo-web/page.tsx`
- `app/[locale]/automatizacion-ia/page.tsx`
- `app/[locale]/dashboards/page.tsx`

**Evaluacion:** Excelente. El JavaScript enviado al cliente es minimo. Solo los componentes que requieren interactividad son client components. El contenido de las paginas se renderiza en el servidor.

### Impacto en bundle size

- Los page components no agregan JavaScript al bundle del cliente.
- El Header es el client component mas grande (maneja estado de menu, dropdown, efecto de click outside).
- ContactForm y Newsletter son formularios simples con estado local.

---

## 5. Vercel Speed Insights y Analytics

### Configuracion (`app/[locale]/layout.tsx`)

```tsx
<SpeedInsights />
<Analytics />
```

Ambos se importan de paquetes oficiales de Vercel:
- `@vercel/speed-insights/next` — Mide Core Web Vitals reales (RUM).
- `@vercel/analytics/react` — Tracking de pageviews y eventos.

**Fortalezas:**
- Ambos scripts cargan de forma asincrona y no bloquean el renderizado.
- No hay Google Analytics ni Google Tag Manager — esto elimina 50-100 KB de JavaScript que la mayoria de sitios cargan.
- Speed Insights provee datos de CWV reales desde usuarios reales (no sinteticos).

**Observacion:** Estos son los unicos scripts de terceros en el sitio. No hay: GTM, Facebook Pixel, Hotjar, Intercom, ni ningun otro script externo. Esto es una ventaja significativa de rendimiento.

---

## 6. Headers de Seguridad

### Configuracion (`next.config.ts`)

```typescript
headers: [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
]
```

**Evaluacion:**
- **HSTS:** Correcto. 2 anos (`63072000` segundos), incluye subdominios, solicita preload. Fuerza HTTPS.
- **X-Frame-Options DENY:** Previene clickjacking. Correcto para un sitio sin necesidad de iframes.
- **X-Content-Type-Options nosniff:** Previene MIME sniffing. Correcto.
- **Referrer-Policy:** Envia origin en cross-origin, URL completa en same-origin. Buen balance privacidad/analitica.
- **X-DNS-Prefetch-Control on:** Permite prefetch de DNS para recursos externos (LinkedIn, GitHub, Fiverr). Mejora percepcion de velocidad.
- **Permissions-Policy:** Deshabilita camara, microfono y geolocalizacion. Correcto para este sitio.

**Faltante notable:**
- `Content-Security-Policy` (CSP) no esta configurado. No es critico para un sitio estatico sin inputs dinamicos renderizados en HTML, pero es recomendable.

---

## 7. Rendering y Data Fetching

### Patron actual

Todas las paginas usan `setRequestLocale()` para definir el locale y despues renderizan contenido desde funciones de datos locales (`getPersonalInfo()`, `getServices()`, etc.).

```typescript
export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <HomeContent locale={locale as Locale} />
}
```

**Analisis:**
- No hay `fetch()` a APIs externas en ninguna pagina.
- Todos los datos vienen de archivos TypeScript locales (`data/personal.ts`, `data/services.ts`, etc.).
- Esto significa que las paginas se generan estaticamente en build time (SSG).
- `generateStaticParams()` en el layout genera variantes para ambos locales.

**Resultado:** Tiempo de respuesta del servidor (TTFB) es minimo. Las paginas se sirven directamente desde el edge de Vercel.

---

## 8. CSS y Tailwind

### Observaciones

- Tailwind CSS se usa en todo el sitio. El CSS final se purga automaticamente en build.
- No hay CSS-in-JS (styled-components, emotion) que agregaria JavaScript al runtime.
- No se detectan animaciones CSS pesadas (solo `transition-colors`, `transition-transform`, `animate-spin` en loaders).
- El patron `cn()` usa `clsx` + `tailwind-merge` — impacto minimo en bundle.

---

## 9. Recomendaciones de Mejora

### Prioridad Alta (impacto directo en CWV)

| # | Mejora | Impacto Esperado | Implementacion |
|---|--------|-----------------|----------------|
| 1 | Ejecutar Lighthouse en produccion y documentar metricas base | Establece la linea base | `npx lighthouse https://carlosanayaruiz.com/es --output=json` |
| 2 | Verificar que el avatar en Hero no causa Layout Shift (CLS) | Puede mejorar CLS | Asegurar que el contenedor tiene dimensiones fijas antes de que la imagen cargue |
| 3 | Revisar el bundle size del Header (client component) | Reducir JS si es necesario | `npx @next/bundle-analyzer` para identificar dependencias |

### Prioridad Media (optimizacion adicional)

| # | Mejora | Impacto Esperado | Implementacion |
|---|--------|-----------------|----------------|
| 4 | Agregar `fetchPriority="high"` al avatar del Hero | Puede mejorar LCP 50-100ms | Agregar prop al `<Image priority>` principal |
| 5 | Evaluar subsetting mas agresivo de fuentes (solo caracteres usados) | Reducir 10-30 KB de fuentes | Usar herramienta `subfont` o analizar caracteres usados |
| 6 | Agregar `Content-Security-Policy` header | Mejora seguridad | Definir CSP que permita `self`, Vercel analytics, Google Fonts (si aplica) |
| 7 | Considerar `prefetch` en enlaces de servicio desde Home | Carga mas rapida al navegar | Los `<Link>` de Next.js ya hacen prefetch automatico en viewport |

### Prioridad Baja (micro-optimizaciones)

| # | Mejora | Impacto Esperado | Implementacion |
|---|--------|-----------------|----------------|
| 8 | Renombrar CSS variable `--font-geist-sans` a `--font-inter` | Claridad de codigo | Buscar y reemplazar en layout.tsx y globals.css |
| 9 | Restringir `remotePatterns` en images config si no se usan imagenes remotas | Seguridad | Cambiar `hostname: '**'` por dominios especificos o eliminar |
| 10 | Monitorear bundle size en cada deploy con Vercel | Prevenir regresiones | Vercel muestra bundle size automaticamente en cada deploy |

---

## 10. Metricas a Monitorear

### Core Web Vitals (objetivos)

| Metrica | Objetivo | Herramienta |
|---------|----------|-------------|
| LCP (Largest Contentful Paint) | < 2.5s | Vercel Speed Insights, PageSpeed Insights |
| INP (Interaction to Next Paint) | < 200ms | Vercel Speed Insights |
| CLS (Cumulative Layout Shift) | < 0.1 | Vercel Speed Insights, Lighthouse |

### Metricas adicionales

| Metrica | Objetivo | Herramienta |
|---------|----------|-------------|
| TTFB (Time to First Byte) | < 200ms | Vercel Analytics |
| FCP (First Contentful Paint) | < 1.8s | Lighthouse |
| TBT (Total Blocking Time) | < 200ms | Lighthouse |
| Lighthouse Performance Score | > 90 | Lighthouse CI |
| Bundle Size (JS total) | < 100 KB (first load) | Vercel deploy output |

### Cadencia de monitoreo

- **Cada deploy:** Revisar Vercel build output (bundle size, build time).
- **Semanal:** Revisar Vercel Speed Insights para CWV reales.
- **Mensual:** Correr Lighthouse en las 4 money pages + Home.
- **Trimestral:** Analisis completo con `@next/bundle-analyzer`.

---

*Este documento se actualiza cuando se hacen cambios de infraestructura, se agregan dependencias nuevas, o se detectan regresiones de rendimiento.*
