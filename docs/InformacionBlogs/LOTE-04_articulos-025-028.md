# LOTE 04 — ARTÍCULOS COMPLETOS 025–028
**Autor:** Carlos Anaya Ruiz · Listos para publicar

---
---

# ARTÍCULO 025

```yaml
title: "Monorepo con Turborepo y pnpm: estructura completa"
slug: "monorepo-turborepo-pnpm-estructura"
description: "Cómo montar un monorepo con Turborepo y pnpm: estructura de carpetas, paquetes compartidos, cache remoto y CI que solo compila lo que cambió."
author: "Carlos Anaya Ruiz"
category: "Desarrollo"
tags: ["monorepo", "turborepo", "pnpm", "arquitectura"]
keyword_principal: "monorepo turborepo pnpm"
```

## Monorepo con Turborepo y pnpm: estructura completa

**Un monorepo tiene sentido cuando compartes código entre varias aplicaciones y necesitas que los cambios se propaguen sin publicar paquetes.** Web, móvil, panel administrativo y una API compartiendo tipos, cliente de base de datos y componentes: ese es el caso donde gana claramente.

Si tienes una sola aplicación, no lo necesitas. La complejidad no se paga sola.

---

### Estructura que funciona

```
mi-producto/
├── apps/
│   ├── web/                 # Next.js — sitio público
│   ├── app/                 # Next.js — aplicación autenticada
│   ├── movil/               # Expo
│   └── api/                 # Servicios de fondo
├── packages/
│   ├── ui/                  # Componentes compartidos
│   ├── db/                  # Cliente de base de datos y esquema
│   ├── config/              # ESLint, TS, Tailwind compartidos
│   ├── tipos/               # Tipos y contratos compartidos
│   └── utils/               # Utilidades puras
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

**Regla que evita la mayoría de los problemas:** `apps/` consume, `packages/` provee. Un paquete nunca importa desde una app. Si necesitas eso, el código está en el lugar equivocado.

---

### Configuración base

`pnpm-workspace.yaml`:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

`package.json` raíz:

```json
{
  "name": "mi-producto",
  "private": true,
  "packageManager": "pnpm@9.12.0",
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "typecheck": "turbo run typecheck"
  },
  "devDependencies": {
    "turbo": "latest"
  }
}
```

`turbo.json`:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"],
      "env": ["NODE_ENV"]
    },
    "typecheck": {
      "dependsOn": ["^build"]
    },
    "lint": {},
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

**`dependsOn: ["^build"]`** significa: antes de compilar este paquete, compila sus dependencias internas. Es lo que hace que el orden se resuelva solo.

---

### Cómo se referencian los paquetes internos

En el `package.json` de una app:

```json
{
  "dependencies": {
    "@mi-producto/ui": "workspace:*",
    "@mi-producto/db": "workspace:*"
  }
}
```

El protocolo `workspace:*` le dice a pnpm que use la versión local, no una del registro público.

Y en el paquete compartido, exporta por subrutas para que el consumidor no importe de más:

```json
{
  "name": "@mi-producto/ui",
  "exports": {
    ".": "./src/index.ts",
    "./boton": "./src/boton.tsx",
    "./tabla": "./src/tabla.tsx"
  }
}
```

---

### Configuración compartida: el paquete que más valor da

`packages/config` centraliza lo que todos repiten:

```
packages/config/
├── eslint/
│   ├── base.js
│   ├── next.js
│   └── react.js
├── typescript/
│   ├── base.json
│   ├── nextjs.json
│   └── library.json
└── tailwind/
    └── base.js
```

Un `tsconfig.json` de una app queda así:

```json
{
  "extends": "@mi-producto/config/typescript/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["**/*.ts", "**/*.tsx", "next-env.d.ts"],
  "exclude": ["node_modules"]
}
```

Cambias una regla en un lugar y aplica en todo el repositorio.

---

### Caché remoto: el beneficio principal

Turborepo cachea las salidas de cada tarea. Si nada cambió en un paquete, no lo vuelve a compilar. Con caché remoto, ese resultado se comparte entre tu máquina, la de tus compañeros y la integración continua.

El efecto práctico: una compilación de siete minutos pasa a veinte segundos cuando solo tocaste una app.

Puedes usar el caché remoto de Vercel o autohospedarlo. La configuración se reduce a autenticar y vincular el repositorio.

**Requisito para que funcione:** declara correctamente los `outputs` y las variables de entorno en `turbo.json`. Si una tarea depende de una variable no declarada, el caché puede devolverte un resultado construido con otro valor. Es la causa más común de "funciona en local y no en producción".

---

### CI que solo compila lo que cambió

```yaml
name: CI
on: [push, pull_request]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 2   # Necesario para comparar contra el commit anterior

      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile
      - run: pnpm turbo run lint typecheck test build --filter=...[HEAD^1]
        env:
          TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
          TURBO_TEAM: ${{ vars.TURBO_TEAM }}
```

El filtro `...[HEAD^1]` ejecuta las tareas solo en los paquetes afectados por el cambio y en los que dependen de ellos. En un repositorio con seis aplicaciones, esto es la diferencia entre esperar dos minutos o quince.

---

### Comandos del día a día

```bash
# Instalar una dependencia en una app concreta
pnpm add zod --filter web

# Instalar una herramienta en la raíz
pnpm add -D turbo -w

# Correr solo una app en desarrollo
pnpm turbo run dev --filter=web

# Correr una app y todo de lo que depende
pnpm turbo run dev --filter=web...

# Compilar todo lo afectado por cambios respecto a main
pnpm turbo run build --filter=...[origin/main]

# Ver por qué una tarea no usó caché
pnpm turbo run build --dry-run
```

Ese último comando es el que resuelve el 90% de los problemas de caché.

---

### Los errores que hacen doloroso un monorepo

**Un paquete `shared` que lo contiene todo.** Se vuelve dependencia de todo, y cualquier cambio invalida el caché del repositorio entero. Divide por dominio: `db`, `ui`, `tipos`, `utils`.

**Dependencias circulares entre paquetes.** Turborepo falla y con razón. Suele indicar que la frontera entre paquetes está mal trazada.

**No declarar los `outputs`.** Sin eso, no hay caché.

**Versiones distintas de la misma dependencia entre paquetes.** Genera errores incomprensibles, especialmente con React. Fija versiones desde la raíz.

**Meter todo en el monorepo desde el día uno.** Empieza con dos apps y un paquete compartido. Extrae cuando la duplicación duela, no antes.

---

### Preguntas frecuentes

**¿Turborepo o Nx?**
Turborepo es más simple y suficiente para la mayoría. Nx tiene más capacidades de generación y análisis, y más complejidad. Para un equipo pequeño, Turborepo.

**¿Puedo incluir un proyecto de Expo?**
Sí, con configuración adicional para que el empaquetador de Metro resuelva los paquetes del workspace. Requiere ajustes, pero funciona.

**¿Un solo despliegue para todo?**
No. Cada app se despliega por separado, con su directorio raíz configurado en la plataforma. El monorepo es de desarrollo, no de despliegue.

---

**Escrito por Carlos Anaya Ruiz** — Desarrollador full-stack. Todos mis productos viven en monorepos con pnpm y Turborepo.

---

### PROMPT DE PORTADA — Artículo 025

> Un contenedor único de vidrio traslúcido que alberga en su interior varios módulos cúbicos verdes de distintos tamaños, conectados entre sí por tuberías de luz que comparten un mismo núcleo central luminoso. Vista isométrica con corte transversal que revela el interior. Fondo negro carbón con una retícula tenue de fondo, iluminación verde terminal.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.

---
---

# ARTÍCULO 026

```yaml
title: "Server Components vs Client Components: cuándo usar cada uno"
slug: "server-components-vs-client-components"
description: "React Server Components explicados con reglas prácticas: qué va en el servidor, qué necesita 'use client' y cómo evitar el árbol de cliente gigante."
author: "Carlos Anaya Ruiz"
category: "Desarrollo"
tags: ["react", "server components", "next.js", "rendimiento"]
keyword_principal: "react server components"
```

## Server Components vs Client Components: cuándo usar cada uno

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

---

**Escrito por Carlos Anaya Ruiz** — Desarrollador full-stack. Trabajo a diario con React Server Components en producción.

---

### PROMPT DE PORTADA — Artículo 026

> Un plano dividido en diagonal: la mitad superior contiene volúmenes sólidos, pesados y opacos en verde profundo; la mitad inferior contiene formas ligeras y translúcidas flotando en verde brillante. Ambas mitades están unidas por finos hilos de luz que cruzan la línea diagonal. Fondo negro carbón, iluminación bicromática, composición geométrica limpia.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.

---
---

# ARTÍCULO 027

```yaml
title: "TypeScript strict mode: por qué activarlo hoy"
slug: "typescript-strict-mode-por-que-activarlo"
description: "Qué activa exactamente el strict mode de TypeScript, cuántos bugs previene y cómo migrar un proyecto grande sin bloquear al equipo."
author: "Carlos Anaya Ruiz"
category: "Desarrollo"
tags: ["typescript", "calidad de código", "tipos", "buenas prácticas"]
keyword_principal: "typescript strict mode"
```

## TypeScript strict mode: por qué activarlo hoy

**`strict: true` activa un conjunto de verificaciones que convierten TypeScript de "JavaScript con anotaciones" en un sistema de tipos que realmente atrapa errores.** Sin él, estás pagando el costo de escribir tipos sin recibir la mayor parte del beneficio.

---

### Qué activa exactamente

`strict: true` enciende estas banderas de golpe:

| Bandera | Qué hace |
|---|---|
| `strictNullChecks` | `null` y `undefined` dejan de ser asignables a cualquier tipo |
| `noImplicitAny` | Prohíbe parámetros y variables con tipo implícito `any` |
| `strictFunctionTypes` | Verificación correcta de tipos de funciones en parámetros |
| `strictBindCallApply` | Verifica `bind`, `call` y `apply` |
| `strictPropertyInitialization` | Las propiedades de clase deben inicializarse |
| `noImplicitThis` | Prohíbe `this` con tipo implícito `any` |
| `alwaysStrict` | Emite `"use strict"` |
| `useUnknownInCatchVariables` | El error capturado es `unknown`, no `any` |

**La más importante con diferencia es `strictNullChecks`.** Es la que atrapa la clase de error más común en JavaScript: acceder a una propiedad de algo que resultó ser `undefined`.

---

### El caso que lo justifica solo

Sin strict:

```ts
function nombreCompleto(usuario: Usuario) {
  return usuario.perfil.nombre + ' ' + usuario.perfil.apellido
}
```

Compila sin quejarse. Y revienta en producción cuando `perfil` es `null` porque el usuario nunca completó su registro.

Con strict:

```
Object is possibly 'null'.
```

Te obliga a decidir qué pasa en ese caso, **antes** de desplegar:

```ts
function nombreCompleto(usuario: Usuario) {
  if (!usuario.perfil) return 'Usuario sin perfil'
  return `${usuario.perfil.nombre} ${usuario.perfil.apellido}`
}
```

Ese único cambio de comportamiento previene una proporción enorme de los errores en tiempo de ejecución de una aplicación típica.

---

### La configuración que uso

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "verbatimModuleSyntax": true,
    "skipLibCheck": true
  }
}
```

**`noUncheckedIndexedAccess` merece atención aparte.** No está incluida en `strict` y previene un error muy frecuente:

```ts
const items: string[] = []
const primero = items[0]      // Sin la bandera: string (mentira)
                              // Con la bandera: string | undefined (verdad)
primero.toUpperCase()         // Ahora el compilador te avisa
```

Añade fricción, pero refleja la realidad. Un acceso por índice puede no devolver nada.

**`skipLibCheck: true`** no es una concesión: evita que errores de tipos en dependencias de terceros bloqueen tu compilación. Es práctica estándar.

---

### Cómo migrar un proyecto grande sin detener al equipo

Activar `strict` de golpe en un proyecto con 40,000 líneas produce cientos de errores y un bloqueo. La migración por fases:

**Fase 1 — Activa solo `noImplicitAny`.**
Suele generar menos errores de lo esperado y obliga a documentar firmas de función. Corrígelo hasta llegar a cero.

**Fase 2 — Activa `strictNullChecks`.**
Esta es la fase grande. Estrategia:
- Empieza por los módulos de utilidades y de dominio, que tienen menos dependencias.
- Usa `?.` y `??` en lugar de `!`. El operador `!` silencia al compilador sin resolver nada, y estás justamente intentando salir de esa situación.
- Para lo que no puedas arreglar hoy, deja un comentario de supresión con explicación y fecha:

```ts
// @ts-expect-error TODO(2026-09): normalizar el tipo de respuesta de la API legacy
```

`@ts-expect-error` es mejor que `@ts-ignore` porque falla si el error desaparece, lo que te avisa de que ya puedes quitar la supresión.

**Fase 3 — Activa el resto de `strict`.**
Suele ser el paso más corto.

**Fase 4 — Añade `noUncheckedIndexedAccess`.**
Opcional, pero recomendable en código que maneja arreglos y objetos indexados.

**Regla de proceso:** el archivo que tocas, lo dejas limpio. No hagas una migración masiva en un solo pull request gigante: es imposible de revisar.

---

### El complemento indispensable: validar en la frontera

Strict mode protege dentro de tu código. Pero los datos que entran de fuera —una API, un formulario, un webhook— no están verificados por TypeScript. `response.json()` devuelve `any`, y ahí se te cuela todo lo que strict estaba evitando.

Valida en el borde:

```ts
import { z } from 'zod'

const Usuario = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  perfil: z.object({
    nombre: z.string(),
    apellido: z.string(),
  }).nullable(),
})

type Usuario = z.infer<typeof Usuario>

async function obtenerUsuario(id: string): Promise<Usuario> {
  const res = await fetch(`/api/usuarios/${id}`)
  return Usuario.parse(await res.json())  // Falla ruidosamente si no coincide
}
```

Ahora el tipo no es una promesa que hiciste: es una garantía verificada en tiempo de ejecución.

---

### Lo que strict mode no resuelve

Sé honesto sobre los límites:

- No valida datos externos, como acabamos de ver.
- No previene errores de lógica. Un tipo correcto puede calcular mal.
- No sustituye a las pruebas.
- `as` sigue permitiendo mentirle al compilador. Úsalo lo mínimo posible.

---

### Preguntas frecuentes

**¿Vale la pena en un proyecto que ya está en producción?**
Sí, migrado por fases. El costo se paga en los primeros meses con los bugs que dejas de tener.

**¿Ralentiza la compilación?**
Marginalmente. `skipLibCheck` compensa de sobra la diferencia.

**¿Y si mi equipo se resiste?**
Activa `noImplicitAny` primero. Es la menos intrusiva y demuestra el valor rápido. Después de ver los primeros errores reales atrapados, la resistencia baja sola.

---

**Escrito por Carlos Anaya Ruiz** — Desarrollador full-stack. Todos mis proyectos arrancan con strict activado desde el primer commit.

---

### PROMPT DE PORTADA — Artículo 027

> Un flujo continuo de bloques geométricos irregulares y desalineados avanzando hacia una compuerta de precisión industrial que los recorta y alinea perfectamente al salir del otro lado, mientras los fragmentos descartados caen hacia abajo iluminados en rojo tenue. Vista lateral, luz verde terminal industrial, fondo negro carbón, materiales de metal oscuro y vidrio.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.

---
---

# ARTÍCULO 028

```yaml
title: "Row Level Security en Supabase: guía práctica"
slug: "row-level-security-supabase-guia"
description: "Row Level Security en Supabase explicado con políticas reales: multi-tenant, roles, y los 6 errores de RLS que filtran datos entre clientes."
author: "Carlos Anaya Ruiz"
category: "Desarrollo"
tags: ["supabase", "postgres", "rls", "seguridad de datos"]
keyword_principal: "row level security supabase"
```

## Row Level Security en Supabase: guía práctica

**RLS mueve la decisión de quién ve qué desde tu aplicación hacia el motor de la base de datos.** En lugar de recordar filtrar por `usuario_id` en cada consulta —y fallar la vez que lo olvides—, Postgres lo hace por ti, siempre.

Es la característica más importante de Supabase y la que más se implementa mal.

---

### Cómo funciona

Activas RLS en una tabla y, a partir de ese momento, **nadie ve nada** hasta que escribas políticas que lo permitan. Denegación por defecto.

```sql
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
```

Con eso, un `SELECT * FROM pedidos` desde el cliente devuelve cero filas. Ahora defines qué se permite.

---

### Las políticas básicas

```sql
-- Ver solo lo propio
CREATE POLICY "usuarios ven sus pedidos"
ON pedidos FOR SELECT
TO authenticated
USING (auth.uid() = usuario_id);

-- Insertar solo a nombre propio
CREATE POLICY "usuarios crean sus pedidos"
ON pedidos FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = usuario_id);

-- Actualizar solo lo propio, sin poder reasignarlo a otro
CREATE POLICY "usuarios editan sus pedidos"
ON pedidos FOR UPDATE
TO authenticated
USING (auth.uid() = usuario_id)
WITH CHECK (auth.uid() = usuario_id);
```

**`USING` vs `WITH CHECK`:** `USING` filtra qué filas se pueden leer o afectar. `WITH CHECK` valida los datos que se escriben. En `UPDATE` necesitas ambas: sin `WITH CHECK`, un usuario podría editar su pedido y cambiar el `usuario_id` para regalárselo a otro.

---

### Multi-tenant: el patrón completo

Este es el caso que más importa en un SaaS. Cada organización debe ver únicamente sus datos.

```sql
-- Tabla de membresías
CREATE TABLE miembros (
  usuario_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  organizacion_id uuid REFERENCES organizaciones(id) ON DELETE CASCADE,
  rol text NOT NULL CHECK (rol IN ('propietario','admin','miembro')),
  PRIMARY KEY (usuario_id, organizacion_id)
);

-- Función auxiliar: a qué organizaciones pertenece el usuario actual
CREATE OR REPLACE FUNCTION mis_organizaciones()
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organizacion_id FROM miembros WHERE usuario_id = auth.uid();
$$;

-- Política aplicada a cualquier tabla del tenant
CREATE POLICY "acceso por organización"
ON proyectos FOR SELECT
TO authenticated
USING (organizacion_id IN (SELECT mis_organizaciones()));
```

**Detalles que importan en esa función:**
- `STABLE` permite a Postgres cachear el resultado dentro de la consulta.
- `SECURITY DEFINER` evita recursión: la función consulta `miembros` sin volver a evaluar RLS sobre esa tabla.
- `SET search_path = public` es obligatorio por seguridad en funciones `SECURITY DEFINER`. Sin esto, alguien podría manipular la resolución de nombres.

---

### Roles dentro de la organización

```sql
CREATE OR REPLACE FUNCTION tiene_rol(org uuid, roles text[])
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM miembros
    WHERE usuario_id = auth.uid()
      AND organizacion_id = org
      AND rol = ANY(roles)
  );
$$;

-- Solo administradores pueden borrar
CREATE POLICY "solo admin borra proyectos"
ON proyectos FOR DELETE
TO authenticated
USING (tiene_rol(organizacion_id, ARRAY['propietario','admin']));
```

---

### Los 6 errores que filtran datos

**1. Activar RLS y olvidar una tabla.**
Una tabla sin RLS en un esquema expuesto es acceso libre. Audita periódicamente:

```sql
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename NOT IN (
    SELECT tablename FROM pg_tables t
    JOIN pg_class c ON c.relname = t.tablename
    WHERE c.relrowsecurity = true
  );
```

**2. Usar la llave de servicio en el cliente.**
La `service_role key` **omite RLS por completo**. Vive únicamente en el servidor, nunca en variables expuestas al navegador, nunca en una app móvil. Si se filtra, tu base de datos está abierta.

**3. Políticas sin `WITH CHECK` en `UPDATE`.**
Permite reasignar registros a otro usuario u organización.

**4. Recursión infinita entre políticas.**
Si la política de `miembros` consulta `proyectos` y la de `proyectos` consulta `miembros`, Postgres entra en bucle. Se resuelve con funciones `SECURITY DEFINER`.

**5. Confiar en datos enviados por el cliente.**
Nunca uses un `organizacion_id` que viene en el cuerpo de la petición para decidir acceso. Deriva siempre desde `auth.uid()`.

**6. Olvidar el impacto en el rendimiento.**
Las políticas se evalúan por fila. Sin índices sobre las columnas que usan, las consultas se degradan mucho.

```sql
CREATE INDEX ON proyectos (organizacion_id);
CREATE INDEX ON miembros (usuario_id, organizacion_id);
```

---

### Cómo probar que tus políticas funcionan

No basta con que la aplicación se vea bien. Prueba explícitamente el acceso cruzado:

```sql
-- Simular un usuario concreto
SET LOCAL role authenticated;
SET LOCAL request.jwt.claims = '{"sub":"UUID-DEL-USUARIO-A"}';

-- Debe devolver 0
SELECT count(*) FROM proyectos WHERE organizacion_id = 'ORG-DEL-USUARIO-B';
```

Convierte esto en pruebas automatizadas. **Toda tabla nueva necesita una prueba que confirme que el usuario A no ve los datos del usuario B.** Es la prueba de seguridad con mejor retorno que puedes escribir en un SaaS multi-tenant.

---

### Preguntas frecuentes

**¿RLS reemplaza la validación en la aplicación?**
Es la última línea de defensa, no la única. Sigue validando permisos en tu lógica: mejores mensajes de error y menos consultas inútiles.

**¿Afecta mucho al rendimiento?**
Con índices adecuados y funciones `STABLE`, el impacto es aceptable. Sin índices, es severo.

**¿Cómo hago tareas administrativas que deben ver todo?**
Desde el servidor con la llave de servicio, en código auditado, y con registro de cada operación.

---

**Escrito por Carlos Anaya Ruiz** — Desarrollador full-stack. Construyo plataformas SaaS multi-tenant sobre Supabase y Postgres.

---

### PROMPT DE PORTADA — Artículo 028

> Una tabla de datos tridimensional donde cada fila individual está encapsulada dentro de su propia burbuja de vidrio verde sellada, y solo algunas de ellas se iluminan intensamente al paso de un haz de luz horizontal que escanea el conjunto de izquierda a derecha. Vista en ángulo bajo y dramático, fondo negro carbón, iluminación verde terminal con reflejos.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.
