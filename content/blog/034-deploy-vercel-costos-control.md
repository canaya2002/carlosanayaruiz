---
n: 34
title: "Deploy en Vercel sin sorpresas en la factura"
slug: "deploy-vercel-costos-control"
description: "Cómo funciona realmente la facturación de Vercel y las configuraciones que evitan una factura de cuatro cifras por un pico de tráfico."
category: "Desarrollo"
keyword: "costos vercel"
tipo: "satelite"
tags: ["vercel","costos","despliegue","optimización"]
---


**Vercel cobra por uso, y el uso se dispara con configuraciones que parecen inocentes.** La mayoría de las facturas sorpresa no vienen de tráfico legítimo: vienen de rutas dinámicas que deberían ser estáticas, de imágenes sin optimizar y de bots.

Los precios y los límites cambian con frecuencia, así que **verifica siempre las cifras vigentes en la página de precios oficial**. Lo que no cambia es dónde se va el dinero. Eso es lo que cubre este artículo.

---

### Las dimensiones que se facturan

Conceptualmente, pagas por:

1. **Ancho de banda / transferencia** — datos servidos a los usuarios.
2. **Invocación y duración de funciones** — cuánto se ejecuta tu código de servidor.
3. **Optimización de imágenes** — transformaciones de imagen.
4. **Compilaciones** — minutos de construcción.
5. **Servicios adicionales** — almacenamiento, base de datos, analítica, según lo que actives.

Los dos primeros son los que causan las sorpresas.

---

### Causa #1: renderizado dinámico innecesario

Es, con diferencia, la causa más común. Una página que podría servirse desde caché estático se está ejecutando en el servidor en cada visita.

Sucede sin que lo notes. Basta con usar `cookies()`, `headers()` o `searchParams` en un componente para que toda la ruta pase a dinámica.

**Cómo detectarlo:** al compilar, Next.js te muestra qué rutas son estáticas y cuáles dinámicas. Revisa esa salida en cada despliegue. Si tu página de inicio aparece como dinámica, ahí tienes tu problema.

**Cómo arreglarlo:**
- Aísla la parte que necesita datos de la petición en un componente cliente pequeño.
- Usa revalidación por tiempo en lugar de renderizado en cada visita:

```tsx
export const revalidate = 3600   // Regenera cada hora, sirve caché el resto del tiempo
```

- Para contenido que cambia por acción del usuario, usa revalidación bajo demanda:

```ts
revalidateTag('productos')   // Solo cuando algo realmente cambió
```

Una página estática se sirve desde el borde sin invocar función. El ahorro es de órdenes de magnitud.

---

### Causa #2: optimización de imágenes sin control

El componente de imagen genera una versión por cada combinación de tamaño y formato solicitada. Si defines diez tamaños y sirves a usuarios con distintos dispositivos, multiplicas las transformaciones.

**Controles:**

```js
// next.config.js
module.exports = {
  images: {
    deviceSizes: [640, 828, 1200, 1920],   // Menos tamaños, menos transformaciones
    imageSizes: [64, 128, 256],
    formats: ['image/webp'],
    minimumCacheTTL: 31536000,             // Caché largo: 1 año
    remotePatterns: [                       // Solo dominios propios
      { protocol: 'https', hostname: 'cdn.midominio.com' },
    ],
  },
}
```

**`remotePatterns` restringido es también una medida de seguridad y de costo.** Si permites cualquier dominio, alguien puede usar tu optimizador de imágenes como servicio gratuito, y tú pagas.

Y siempre define `sizes` correctamente:

```tsx
<Image src="/foto.jpg" alt="..." width={800} height={600}
  sizes="(max-width: 768px) 100vw, 50vw" />
```

Sin `sizes`, se sirven imágenes mucho más grandes de lo necesario.

---

### Causa #3: bots y tráfico automatizado

Rastreadores, escáneres y bots pueden generar decenas de miles de peticiones a rutas dinámicas. Es tráfico que no te aporta nada y que sí facturas.

**Medidas:**
- Firewall de la plataforma con reglas de limitación de tasa en las rutas costosas.
- `robots.txt` bien configurado, bloqueando rutas de búsqueda y filtros que generan combinaciones infinitas.
- Protección contra bots activada en endpoints sensibles.
- Cabeceras de caché correctas para que los rastreadores legítimos no reejecuten tu código.

---

### Causa #4: funciones lentas

Pagas por duración. Una función que tarda 3 segundos cuesta seis veces más que una de 500 ms, con el mismo número de invocaciones.

**Qué revisar:**
- Consultas sin índice. Es la causa número uno de funciones lentas.
- Llamadas secuenciales a APIs externas que podrían ser paralelas:

```ts
// Mal: 3 segundos
const a = await servicioA()
const b = await servicioB()
const c = await servicioC()

// Bien: 1 segundo
const [a, b, c] = await Promise.all([servicioA(), servicioB(), servicioC()])
```

- Conexiones a base de datos sin pool adecuado para entorno serverless.
- Arranques en frío por dependencias pesadas. Aquí conecta con la decisión de ORM: un cliente ligero mejora los tiempos de arranque.

---

### Las configuraciones que debes tener activas

```
□ Límite de gasto configurado con alerta y con corte
□ Alertas de uso al 50%, 75% y 90% del presupuesto
□ Revisión de la salida de compilación: qué rutas son dinámicas
□ deviceSizes e imageSizes reducidos al mínimo necesario
□ remotePatterns restringido a dominios propios
□ minimumCacheTTL alto en imágenes
□ Reglas de limitación de tasa en rutas costosas
□ robots.txt bloqueando rutas de filtros y búsqueda
□ Despliegues de vista previa limitados o protegidos
□ Revisión mensual del panel de uso por proyecto
```

**El límite de gasto es lo primero que debes configurar**, antes incluso del primer despliegue a producción. Es la diferencia entre un susto y un desastre.

---

### Cuándo Vercel deja de convenir

Sé honesto con el análisis:

- **Tráfico muy alto con contenido mayormente estático.** Un CDN con almacenamiento de objetos puede costar una fracción.
- **Funciones de larga duración o procesamiento pesado.** No es el modelo adecuado; usa un servicio de cómputo tradicional o una plataforma de contenedores.
- **Necesidad de control fino de la infraestructura.**

Vercel brilla en velocidad de desarrollo, despliegues por rama y experiencia de equipo. Cuando tu cuello de botella deja de ser la velocidad de entrega y pasa a ser el costo de servir, es momento de reevaluar.

---

### Preguntas frecuentes

**¿Puedo mover solo una parte fuera de Vercel?**
Sí, y suele ser la mejor solución. Los archivos estáticos y multimedia pesados a almacenamiento de objetos con CDN, y el resto se queda.

**¿El plan gratuito sirve para producción?**
Para proyectos personales y demostraciones, sí. Para un negocio, no: los términos del plan gratuito son para uso no comercial. Revisa las condiciones vigentes.

**¿Cómo estimo el costo antes de lanzar?**
Multiplica visitas mensuales esperadas por peso promedio de página para el ancho de banda, y visitas a rutas dinámicas por duración promedio de función. Con esos dos números tienes una aproximación razonable.
