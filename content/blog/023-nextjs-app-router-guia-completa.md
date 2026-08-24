---
n: 23
title: "Next.js App Router: guía completa"
slug: "nextjs-app-router-guia-completa"
description: "Guía completa del App Router de Next.js: layouts, streaming, caching, server actions y cuándo el Pages Router sigue siendo mejor idea."
category: "Desarrollo"
keyword: "next.js app router"
tipo: "pillar"
tags: ["next.js","react","app router","server components"]
---


**El App Router es el modelo de enrutamiento de Next.js basado en Server Components, layouts anidados y streaming.** No es una versión mejorada del Pages Router: es un modelo mental distinto donde el servidor hace el trabajo por defecto y el cliente es la excepción.

Esa inversión es lo que cuesta al principio y lo que paga después.

---

### La estructura de archivos

Cada carpeta dentro de `app/` es un segmento de ruta. Los archivos con nombres reservados definen su comportamiento:

```
app/
├── layout.tsx          # Layout raíz (obligatorio)
├── page.tsx            # Ruta /
├── loading.tsx         # UI de carga con Suspense automático
├── error.tsx           # Límite de error (debe ser cliente)
├── not-found.tsx       # 404
├── dashboard/
│   ├── layout.tsx      # Layout anidado, persiste al navegar
│   ├── page.tsx        # Ruta /dashboard
│   └── [id]/
│       └── page.tsx    # Ruta dinámica /dashboard/:id
└── (marketing)/        # Grupo de rutas: no afecta la URL
    └── precios/
        └── page.tsx    # Ruta /precios
```

**Lo que más se aprovecha poco:** los grupos de rutas con paréntesis. Te permiten tener layouts completamente distintos (marketing vs. aplicación) sin ensuciar la URL.

---

### Server Components por defecto

Todo componente en `app/` es Server Component salvo que lleve `'use client'` arriba. Eso significa:

- Puede ser `async` y hacer `await` directamente.
- Puede consultar la base de datos sin exponer credenciales.
- Su código **no se envía al navegador**.
- No puede usar hooks de estado, efectos ni eventos del navegador.

```tsx
// app/productos/page.tsx — Server Component
import { db } from '@/lib/db'

export default async function ProductosPage() {
  const productos = await db.producto.findMany({
    where: { activo: true },
    orderBy: { creadoEn: 'desc' },
  })

  return (
    <ul>
      {productos.map((p) => (
        <li key={p.id}>{p.nombre}</li>
      ))}
    </ul>
  )
}
```

Sin `useEffect`, sin estado de carga, sin endpoint intermedio. El dato llega ya renderizado.

---

### Streaming con Suspense

El beneficio más visible del App Router. En lugar de esperar a que todo esté listo, envías el HTML por partes.

```tsx
import { Suspense } from 'react'

export default function Dashboard() {
  return (
    <>
      <Encabezado />                       {/* Se envía de inmediato */}
      <Suspense fallback={<SkeletonVentas />}>
        <ResumenVentas />                  {/* Lento: llega después */}
      </Suspense>
      <Suspense fallback={<SkeletonTabla />}>
        <TablaPedidos />                   {/* Independiente del anterior */}
      </Suspense>
    </>
  )
}
```

Cada bloque llega cuando está listo. Un `loading.tsx` en una carpeta hace lo mismo automáticamente para toda esa ruta.

**Regla práctica:** coloca los límites de Suspense alrededor de lo que consulta datos lentos, no alrededor de la página entera. Envolver todo en un solo Suspense anula el beneficio.

---

### Caching: el punto donde todos tropiezan

Es la parte que más confusión genera. Hay varias capas de caché, y el comportamiento por defecto ha cambiado entre versiones mayores de Next.js. **Verifica siempre contra la documentación de tu versión exacta** en lugar de asumir.

Los controles que necesitas conocer:

```tsx
// Revalidación por tiempo en un fetch específico
const res = await fetch(url, { next: { revalidate: 3600 } })

// Sin caché, siempre fresco
const res = await fetch(url, { cache: 'no-store' })

// Revalidación de toda la ruta
export const revalidate = 60

// Forzar renderizado dinámico en la ruta
export const dynamic = 'force-dynamic'
```

**Invalidación bajo demanda**, que es lo que realmente quieres en una aplicación con datos que cambian:

```tsx
import { revalidatePath, revalidateTag } from 'next/cache'

// Tras actualizar un producto
revalidateTag('productos')
revalidatePath('/dashboard')
```

**Consejo práctico:** empieza en modo dinámico y añade caché donde midas que hace falta. Depurar por qué una página muestra datos viejos consume más tiempo del que ahorra cachear de entrada.

---

### Server Actions

Mutaciones sin escribir endpoints:

```tsx
// app/acciones.ts
'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const Esquema = z.object({
  nombre: z.string().min(1).max(120),
  precio: z.coerce.number().positive(),
})

export async function crearProducto(formData: FormData) {
  // La validación es OBLIGATORIA: esto es un endpoint público
  const datos = Esquema.parse({
    nombre: formData.get('nombre'),
    precio: formData.get('precio'),
  })

  const sesion = await obtenerSesion()
  if (!sesion) throw new Error('No autorizado')

  await db.producto.create({ data: { ...datos, userId: sesion.userId } })
  revalidatePath('/productos')
}
```

**El error de seguridad más frecuente:** tratar una Server Action como si fuera código privado. No lo es. Es un endpoint HTTP accesible desde fuera. **Autenticación y validación van dentro de la acción, siempre.**

---

### Metadatos y SEO

```tsx
// Estáticos
export const metadata = {
  title: 'Productos | Mi Empresa',
  description: 'Catálogo completo de productos.',
}

// Dinámicos
export async function generateMetadata({ params }) {
  const producto = await obtenerProducto(params.id)
  return {
    title: producto.nombre,
    description: producto.resumen,
    openGraph: { images: [producto.imagen] },
  }
}
```

Y para rutas estáticas conocidas de antemano:

```tsx
export async function generateStaticParams() {
  const productos = await db.producto.findMany({ select: { slug: true } })
  return productos.map((p) => ({ slug: p.slug }))
}
```

---

### Cuándo NO usar App Router

Sé honesto con estos casos:

- **Aplicación existente grande y estable en Pages Router.** La migración completa rara vez se justifica solo por estar al día. Puedes convivir: ambos routers funcionan en el mismo proyecto.
- **Dependencias críticas incompatibles** con Server Components. Verifica antes de comprometerte.
- **Equipo sin margen para la curva de aprendizaje** y con una entrega cercana. El modelo mental toma semanas.
- **Aplicación puramente cliente** sin necesidad de SEO ni renderizado en servidor. Estás pagando complejidad sin recibir el beneficio.

---

### Errores comunes que cuestan horas

**Poner `'use client'` en el layout raíz.** Convierte todo el árbol en cliente y anulas el modelo completo.

**Consultar datos en el cliente por costumbre.** Si el dato no depende de interacción, va en el servidor.

**Un solo `Suspense` envolviendo toda la página.** Elimina el beneficio del streaming.

**Olvidar que `error.tsx` debe ser Client Component.** Requiere `'use client'`.

**Asumir el comportamiento de caché.** Verifícalo con tu versión. Es la fuente número uno de bugs de datos obsoletos.

---

### Preguntas frecuentes

**¿Puedo mezclar App Router y Pages Router?**
Sí, conviven en el mismo proyecto. Es la ruta de migración recomendada: rutas nuevas en `app/`, las viejas se quedan hasta que toque tocarlas.

**¿Los Server Components reemplazan a las APIs?**
Para tu propio frontend, en gran medida sí. Si terceros o una app móvil consumen tus datos, sigues necesitando endpoints.

**¿Cómo manejo estado global?**
Igual que antes, pero en la frontera de cliente. Envuelve solo la parte que lo necesita, no toda la aplicación.
