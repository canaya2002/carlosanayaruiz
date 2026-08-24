---
n: 31
title: "Cómo optimizar Core Web Vitals en Next.js"
slug: "optimizar-core-web-vitals-nextjs"
description: "Cómo llevar LCP, CLS e INP a verde en Next.js: fuentes, imágenes, hidratación, scripts de terceros y medición con datos de campo."
category: "Desarrollo"
keyword: "core web vitals next.js"
tipo: "satelite"
tags: ["core web vitals","rendimiento","next.js","seo técnico"]
---


**Core Web Vitals mide tres cosas: qué tan rápido aparece el contenido principal (LCP), cuánto se mueve la página mientras carga (CLS) y qué tan rápido responde a la interacción (INP).** Son señales de posicionamiento, pero sobre todo son proxies decentes de si tu sitio se siente bien.

Estos son los umbrales de referencia y qué hacer para llegar a ellos.

---

### Los tres indicadores

| Métrica | Bueno | Necesita mejora | Malo |
|---|---|---|---|
| LCP (contenido principal) | ≤ 2.5 s | 2.5 – 4 s | > 4 s |
| CLS (estabilidad visual) | ≤ 0.1 | 0.1 – 0.25 | > 0.25 |
| INP (respuesta a interacción) | ≤ 200 ms | 200 – 500 ms | > 500 ms |

Se evalúa el percentil 75 de tus usuarios reales, no tu prueba en una máquina rápida con fibra óptica.

---

### LCP: el contenido principal más rápido

**1. Identifica cuál es tu elemento LCP.** Casi siempre es la imagen principal o el titular. Las herramientas de desarrollo del navegador te lo dicen exactamente.

**2. Si es una imagen, dale prioridad.**

```tsx
import Image from 'next/image'

<Image
  src="/hero.webp"
  alt="Descripción real de la imagen"
  width={1200}
  height={630}
  priority              // Precarga: elimina el retraso de descubrimiento
  sizes="100vw"
/>
```

`priority` es la optimización individual con mayor impacto sobre el LCP en la mayoría de los sitios.

**3. Fuentes sin bloqueo.**

```tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',      // Muestra texto con fuente de respaldo mientras carga
  variable: '--font-inter',
})
```

`next/font` autohospeda la fuente y elimina la petición a un dominio externo, que es una fuente frecuente de retraso.

**4. Renderiza el contenido principal en el servidor.** Si tu titular y tu imagen dependen de una petición desde el cliente, tu LCP nunca será bueno. Server Component con los datos ya resueltos.

**5. Vigila la respuesta del servidor.** Si tu servidor tarda 800 ms en responder, ninguna optimización de frontend te salva. Cachea lo que puedas y revisa las consultas lentas.

---

### CLS: que nada salte

El origen del CLS casi siempre es el mismo: **elementos sin espacio reservado**.

**1. Toda imagen con dimensiones.** Con `next/image` es obligatorio pasar `width` y `height`, o usar `fill` con un contenedor de tamaño definido. Eso reserva el espacio antes de que cargue.

**2. Anuncios, incrustados e iframes con contenedor de altura fija.**

```tsx
<div style={{ minHeight: 250 }}>
  <BannerPublicitario />
</div>
```

**3. Nunca insertes contenido encima de algo ya visible.** Los banners de aviso y las barras de promoción que aparecen arriba después de cargar empujan todo hacia abajo. Reserva el espacio desde el inicio o colócalos en posición fija.

**4. `font-display: swap` con métricas ajustadas.** `next/font` genera automáticamente una fuente de respaldo con métricas similares, lo cual reduce mucho el salto al cambiar de tipografía.

**5. Animaciones solo con `transform` y `opacity`.** Animar `width`, `height`, `top` o `margin` provoca redistribución del diseño y cuenta como desplazamiento.

---

### INP: que responda rápido

INP mide el retraso entre la interacción del usuario y la actualización visual. Su enemigo es el JavaScript que bloquea el hilo principal.

**1. Reduce el JavaScript enviado.** Aquí es donde conecta directamente con Server Components: cada componente que dejas en el servidor es JavaScript que no se descarga, no se analiza y no se hidrata.

**2. Carga diferida de lo pesado.**

```tsx
import dynamic from 'next/dynamic'

const EditorRico = dynamic(() => import('@/componentes/editor'), {
  ssr: false,
  loading: () => <SkeletonEditor />,
})
```

**3. Divide el trabajo largo.** Si un manejador de evento ejecuta un cálculo pesado, cede el control al navegador para que pueda pintar:

```ts
async function procesarLista(items) {
  for (let i = 0; i < items.length; i++) {
    procesar(items[i])
    if (i % 50 === 0) await new Promise(r => setTimeout(r, 0))
  }
}
```

**4. Retrasa la entrada de eventos en campos de búsqueda.** Un filtro que ejecuta en cada pulsación de tecla bloquea el hilo. Espera a que el usuario deje de escribir.

**5. Controla los scripts de terceros.** Suelen ser la causa principal de un INP malo.

```tsx
import Script from 'next/script'

<Script src="https://ejemplo.com/analitica.js" strategy="lazyOnload" />
```

Estrategias: `beforeInteractive` solo para lo verdaderamente crítico, `afterInteractive` para analítica, `lazyOnload` para chats de soporte y widgets sociales.

**Ejercicio revelador:** desactiva todos los scripts de terceros y mide de nuevo. Si tus métricas mejoran drásticamente, sabes dónde está el problema y tienes con qué justificar la conversación con marketing.

---

### Medir bien

**Datos de laboratorio** (Lighthouse, análisis local): útiles para diagnosticar y comparar cambios. No reflejan a tus usuarios reales.

**Datos de campo** (usuarios reales): son los que cuentan para posicionamiento. Se consultan en la herramienta de análisis de páginas de Google y en tu consola de búsqueda.

Instrumenta tu propia medición para tener datos continuos:

```tsx
// app/web-vitals.tsx
'use client'
import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    fetch('/api/vitals', {
      method: 'POST',
      body: JSON.stringify({
        nombre: metric.name,
        valor: metric.value,
        ruta: window.location.pathname,
      }),
      keepalive: true,
    })
  })
  return null
}
```

Guardar la ruta es importante: te permite saber **qué páginas** están mal, no solo que el sitio promedio está mal.

---

### Orden de trabajo recomendado

1. Mide en datos de campo. Identifica qué métrica y qué páginas están mal.
2. Arregla CLS primero: suele ser lo más barato y con resultado inmediato.
3. Ataca LCP: prioridad en la imagen principal, fuentes autohospedadas, respuesta de servidor.
4. Ataca INP: reduce JavaScript, difiere terceros, divide trabajo largo.
5. Vuelve a medir a los 28 días. Los datos de campo se acumulan en ventana móvil, no cambian de un día para otro.

---

### Preguntas frecuentes

**¿Cuánto afecta al posicionamiento?**
Es un factor real pero secundario frente a la relevancia del contenido. Su mayor impacto suele estar en la conversión, no en el ranking.

**¿Por qué mi Lighthouse da 100 y los datos de campo están en rojo?**
Porque Lighthouse mide una carga, en tu red, en tu dispositivo. Los datos de campo incluyen teléfonos de gama media en redes móviles. Confía en el campo.

**¿INP reemplazó a FID?**
Sí. INP es más estricto porque mide todas las interacciones de la sesión, no solo la primera.
