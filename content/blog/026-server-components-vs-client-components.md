---
n: 26
title: "Server Components vs Client Components: cuándo usar cada uno"
slug: "server-components-vs-client-components"
description: "React Server Components explicados con reglas prácticas: qué va en el servidor, qué necesita 'use client' y cómo evitar el árbol de cliente gigante."
category: "Desarrollo"
keyword: "react server components"
tipo: "satelite"
tags: ["react","server components","next.js","rendimiento"]
---


**Los Server Components se ejecutan solo en el servidor y su código nunca llega al navegador. Los Client Components se ejecutan en ambos.** La regla operativa es simple: todo es servidor por defecto, y bajas a cliente solo cuando necesitas interactividad.

Lo que cuesta no es la sintaxis. Es dejar de pensar en "cargar datos con un efecto".

---

### Qué puede hacer cada uno

| | Server Component | Client Component |
|---|---|---|
| `async`/`await` directo | Sí | No |
| Consultar base de datos | Sí | No |
| Usar secretos y variables privadas | Sí | No |
| `useState`, `useEffect` | No | Sí |
| Eventos (`onClick`, `onChange`) | No | Sí |
| APIs del navegador | No | Sí |
| Código enviado al navegador | No | Sí |

---

### La regla práctica

**Empieza en servidor. Baja a cliente solo cuando el componente necesita una de estas cuatro cosas:**

1. Estado o efectos.
2. Manejadores de eventos.
3. APIs del navegador (`window`, `localStorage`, geolocalización).
4. Bibliotecas que usan cualquiera de las anteriores.

Si nada de eso aplica, se queda en servidor.

---

### El patrón que más importa: empujar `'use client'` hacia abajo

El error más caro es marcar como cliente un componente alto en el árbol. Todo lo que cuelga debajo se vuelve cliente automáticamente.

**Mal:**

```tsx
'use client'  // ← Toda la página se vuelve cliente

import { useState } from 'react'

export default function Pagina({ productos }) {
  const [abierto, setAbierto] = useState(false)

  return (
    <div>
      <ListaProductos productos={productos} />   {/* No necesita ser cliente */}
      <Estadisticas />                            {/* Tampoco */}
      <button onClick={() => setAbierto(!abierto)}>Filtros</button>
    </div>
  )
}
```

**Bien:**

```tsx
// page.tsx — Server Component
export default async function Pagina() {
  const productos = await db.producto.findMany()

  return (
    <div>
      <ListaProductos productos={productos} />   {/* Servidor */}
      <Estadisticas />                            {/* Servidor */}
      <BotonFiltros />                            {/* Solo esto es cliente */}
    </div>
  )
}

// boton-filtros.tsx
'use client'
import { useState } from 'react'

export function BotonFiltros() {
  const [abierto, setAbierto] = useState(false)
  return <button onClick={() => setAbierto(!abierto)}>Filtros</button>
}
```

Mismo resultado visual, una fracción del JavaScript enviado.

---

### Los Client Components pueden contener hijos de servidor

Esto sorprende a mucha gente y es la clave para no arrastrar todo a cliente. Un Client Component **no puede importar** un Server Component, pero **sí puede recibirlo como `children`**.

```tsx
// acordeon.tsx — Cliente
'use client'
import { useState } from 'react'

export function Acordeon({ children }) {
  const [abierto, setAbierto] = useState(false)
  return (
    <div>
      <button onClick={() => setAbierto(!abierto)}>Alternar</button>
      {abierto && children}
    </div>
  )
}

// page.tsx — Servidor
export default async function Pagina() {
  return (
    <Acordeon>
      <ContenidoPesadoDelServidor />  {/* Sigue siendo servidor */}
    </Acordeon>
  )
}
```

El contenido se renderiza en el servidor y se pasa ya listo. El componente cliente solo decide si mostrarlo.

---

### Composición: el patrón proveedor

Los proveedores de contexto son cliente, pero eso no obliga a que todo lo demás lo sea:

```tsx
// providers.tsx
'use client'
export function Providers({ children }) {
  return (
    <TemaProvider>
      <QueryProvider>{children}</QueryProvider>
    </TemaProvider>
  )
}

// layout.tsx — Sigue siendo Server Component
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

El layout no lleva `'use client'`. Los hijos siguen siendo componentes de servidor.

---

### Paso de datos: lo que hay que saber

Las props que van de servidor a cliente se serializan. Eso implica límites:

**Sí se puede pasar:** objetos planos, arreglos, cadenas, números, fechas, `null`, y Server Actions.

**No se puede pasar:** funciones normales, clases, instancias con métodos, elementos con closures del servidor.

```tsx
// Falla
<ComponenteCliente onCalcular={(x) => x * factor} />

// Funciona: Server Action
<ComponenteCliente accion={miServerAction} />
```

Y una advertencia de seguridad importante: **todo lo que pases como prop a un componente cliente viaja al navegador y es visible.** Si consultas un usuario completo en el servidor y se lo pasas entero a un componente cliente, estás exponiendo su hash de contraseña y sus campos internos. Selecciona los campos explícitamente.

---

### Cómo saber si lo estás haciendo bien

**Revisa el tamaño del bundle.** Si tu página de listado envía 300 KB de JavaScript, algo alto en el árbol es cliente sin necesidad.

**Busca los `'use client'` en tu repositorio.** Deberían estar en componentes hoja pequeños: botones, formularios, menús, modales. Si están en páginas o layouts, revísalo.

**Desactiva JavaScript y carga la página.** Lo que sigue viéndose es lo que se renderizó en el servidor. Es una prueba rápida y reveladora.

---

### Preguntas frecuentes

**¿Server Components reemplazan a `getServerSideProps`?**
Sí, con más granularidad: en lugar de datos a nivel de página, cada componente pide lo suyo.

**¿Puedo usar una biblioteca de componentes que no soporta servidor?**
Sí, envolviendo su uso en un componente cliente pequeño. Lo importante es aislar la frontera.

**¿Cuándo conviene consultar datos en el cliente?**
Cuando dependen de interacción del usuario, cambian con frecuencia o requieren actualización en tiempo real. Búsqueda con autocompletado, filtros dinámicos, notificaciones.
