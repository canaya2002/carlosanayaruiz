# LOTE 05 — ARTÍCULOS COMPLETOS 029–032
**Autor:** Carlos Anaya Ruiz · Listos para publicar

---
---

# ARTÍCULO 029

```yaml
title: "Autenticación segura en Next.js: arquitectura completa"
slug: "autenticacion-segura-nextjs"
description: "Cómo montar autenticación en Next.js con cookies httpOnly, middleware y refresh tokens. Incluye los errores que dejan sesiones secuestrables."
author: "Carlos Anaya Ruiz"
category: "Desarrollo"
tags: ["next.js", "autenticación", "seguridad", "sesiones"]
keyword_principal: "autenticación next.js"
```

## Autenticación segura en Next.js: arquitectura completa

**La decisión que define tu seguridad no es qué proveedor uses, sino dónde guardas la sesión.** Si el token vive en `localStorage`, cualquier script inyectado en tu página puede leerlo. Si vive en una cookie `httpOnly`, no.

Todo lo demás son detalles de implementación sobre esa base.

---

### Dónde guardar la sesión

| Ubicación | Accesible por JS | Riesgo XSS | Envío automático |
|---|---|---|---|
| `localStorage` | Sí | **Alto** | No |
| `sessionStorage` | Sí | **Alto** | No |
| Cookie normal | Sí | Alto | Sí |
| **Cookie `httpOnly`** | **No** | **Bajo** | Sí |

**Cookie `httpOnly` + `secure` + `sameSite`.** Es la respuesta. No hay debate real aquí.

```ts
cookies().set('sesion', token, {
  httpOnly: true,      // Inaccesible desde JavaScript
  secure: true,        // Solo por HTTPS
  sameSite: 'lax',     // Protección contra CSRF
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
})
```

---

### El patrón de dos tokens

**Token de acceso:** vida corta (15 minutos), contiene la identidad y los permisos. Se usa en cada petición.

**Token de refresco:** vida larga (7 a 30 días), sirve únicamente para obtener un nuevo token de acceso. Se guarda en base de datos para poder revocarlo.

Por qué importa: si un token de acceso se filtra, expira en minutos. Si un token de refresco se compromete, puedes revocarlo del lado del servidor, cosa que con un JWT autocontenido no puedes hacer.

**Rotación de tokens de refresco:** cada vez que se usa uno, se emite uno nuevo y se invalida el anterior. Si detectas que se reutiliza un token ya invalidado, es señal de robo: revoca toda la familia de sesiones de ese usuario.

---

### Verificación en tres capas

**Capa 1 — Middleware (redirección, no seguridad).**

```ts
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const sesion = request.cookies.get('sesion')

  if (!sesion && request.nextUrl.pathname.startsWith('/dashboard')) {
    const url = new URL('/login', request.url)
    url.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/privado/:path*'],
}
```

**Advertencia crítica:** el middleware sirve para mejorar la experiencia, **no como control de seguridad**. Es rápido y superficial: comprueba que existe una cookie, no que sea válida. La verificación real va en cada punto donde se accede a datos.

**Capa 2 — Verificación en el acceso a datos.**

```ts
// lib/sesion.ts
import { cache } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const obtenerSesion = cache(async () => {
  const token = cookies().get('sesion')?.value
  if (!token) return null

  try {
    const payload = await verificarToken(token)   // Verifica firma y expiración
    return payload
  } catch {
    return null
  }
})

export async function requerirSesion() {
  const sesion = await obtenerSesion()
  if (!sesion) redirect('/login')
  return sesion
}
```

`cache()` de React evita verificar el token varias veces en el mismo renderizado.

**Capa 3 — Autorización dentro de cada operación.**

```ts
'use server'

export async function eliminarProyecto(id: string) {
  const sesion = await requerirSesion()

  const proyecto = await db.proyecto.findUnique({ where: { id } })
  if (!proyecto) throw new Error('No encontrado')

  // Verificar propiedad: autenticado ≠ autorizado
  if (proyecto.organizacionId !== sesion.organizacionId) {
    throw new Error('No autorizado')
  }

  await db.proyecto.delete({ where: { id } })
  revalidatePath('/proyectos')
}
```

**Esta capa es la que de verdad protege.** Las Server Actions son endpoints HTTP públicos: cualquiera puede invocarlas directamente.

---

### Protección contra CSRF

Con `sameSite: 'lax'` cubres la mayoría de los casos. Para operaciones sensibles, añade verificación explícita del origen:

```ts
import { headers } from 'next/headers'

function verificarOrigen() {
  const h = headers()
  const origen = h.get('origin')
  const host = h.get('host')

  if (!origen || new URL(origen).host !== host) {
    throw new Error('Origen no válido')
  }
}
```

Si usas `sameSite: 'none'` por alguna razón de integración, la verificación de origen deja de ser opcional.

---

### Los errores que dejan sesiones secuestrables

**1. Token en `localStorage`.** Un solo XSS y se llevan todas las sesiones.

**2. No regenerar el identificador de sesión al iniciar sesión.** Permite fijación de sesión: el atacante planta un identificador, la víctima se autentica con él, y el atacante ya está dentro.

**3. No invalidar sesiones al cambiar la contraseña.** Si alguien cambió su contraseña porque sospecha un compromiso, y las sesiones activas del atacante siguen vivas, el cambio no sirvió de nada.

**4. Confiar solo en el middleware.** Es la falla arquitectónica más frecuente. Un atacante puede llamar a tus Server Actions y a tus endpoints sin pasar por ninguna navegación.

**5. Pasar el objeto de usuario completo a componentes cliente.** Todo lo que va como prop a un componente cliente viaja al navegador. Selecciona campos:

```ts
// Mal
const usuario = await db.usuario.findUnique({ where: { id } })
return <Perfil usuario={usuario} />   // Incluye hash de contraseña y campos internos

// Bien
const usuario = await db.usuario.findUnique({
  where: { id },
  select: { id: true, nombre: true, email: true, avatarUrl: true },
})
```

**6. Mensajes de error que revelan información.** "Ese correo no existe" permite enumerar usuarios. Un mensaje genérico para credenciales incorrectas, siempre.

**7. Sin límite de intentos.** Aplica límite por IP y por cuenta, con retardo progresivo.

---

### Lista de verificación antes de producción

```
□ Sesión en cookie httpOnly + secure + sameSite
□ Token de acceso de vida corta, refresco rotativo
□ Verificación de sesión en cada punto de acceso a datos
□ Autorización (no solo autenticación) en cada Server Action
□ Regeneración de sesión al iniciar sesión
□ Invalidación de sesiones al cambiar contraseña
□ Límite de intentos por IP y por cuenta
□ Mensajes de error genéricos en el login
□ MFA disponible, obligatorio en cuentas con privilegios
□ Registro de eventos de autenticación
□ Contraseñas con algoritmo de derivación adecuado
□ Verificación contra listas de contraseñas filtradas
```

---

### Preguntas frecuentes

**¿Uso una biblioteca o lo implemento yo?**
Biblioteca, salvo que tengas un requisito muy particular. Las bibliotecas maduras ya resolvieron los detalles que se te van a olvidar. Lo que **sí** debes implementar tú es la capa de autorización: ninguna biblioteca sabe quién puede ver qué en tu dominio.

**¿JWT o sesión en base de datos?**
JWT de vida corta para acceso, registro en base de datos para el refresco. Combinas rendimiento con capacidad de revocación.

**¿Cómo manejo múltiples dispositivos?**
Un registro de sesión por dispositivo, con nombre, fecha y última actividad. Y un botón para cerrar sesiones individualmente. Los usuarios lo valoran y mejora tu seguridad.

---

**Escrito por Carlos Anaya Ruiz** — Desarrollador full-stack. Implemento autenticación y control de acceso en productos SaaS en producción.

---

### PROMPT DE PORTADA — Artículo 029

> Un túnel formado por anillos de seguridad verdes concéntricos por el que viaja una cápsula de identidad luminosa, y cada anillo la verifica con un pulso de luz al momento de atravesarlo. Perspectiva de un punto con profundidad infinita hacia el fondo. Niebla volumétrica verde terminal, fondo negro absoluto, reflejos en las superficies de los anillos.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.

---
---

# ARTÍCULO 030

```yaml
title: "Prisma vs Drizzle: qué ORM elegir"
slug: "prisma-vs-drizzle-orm"
description: "Prisma vs Drizzle comparados en rendimiento, tamaño de bundle, migraciones, edge runtime y experiencia de desarrollo real."
author: "Carlos Anaya Ruiz"
category: "Desarrollo"
tags: ["prisma", "drizzle", "orm", "typescript"]
keyword_principal: "prisma vs drizzle"
```

## Prisma vs Drizzle: qué ORM elegir

**Prisma prioriza la experiencia de desarrollo; Drizzle prioriza el control y la cercanía a SQL.** Ambos son buenos. La elección depende de si tu equipo prefiere un lenguaje de consulta propio y bien pulido, o escribir algo muy parecido a SQL con tipos.

---

### La diferencia de fondo

**Prisma** define el esquema en su propio lenguaje y genera un cliente:

```prisma
model Usuario {
  id       String   @id @default(uuid())
  email    String   @unique
  nombre   String
  pedidos  Pedido[]
  creadoEn DateTime @default(now())
}
```

```ts
const usuarios = await prisma.usuario.findMany({
  where: { pedidos: { some: { total: { gt: 1000 } } } },
  include: { pedidos: true },
})
```

**Drizzle** define el esquema en TypeScript y consulta con una sintaxis casi idéntica a SQL:

```ts
export const usuarios = pgTable('usuarios', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  nombre: text('nombre').notNull(),
  creadoEn: timestamp('creado_en').defaultNow(),
})
```

```ts
const resultado = await db
  .select()
  .from(usuarios)
  .innerJoin(pedidos, eq(pedidos.usuarioId, usuarios.id))
  .where(gt(pedidos.total, 1000))
```

---

### Comparación por dimensión

| Dimensión | Prisma | Drizzle |
|---|---|---|
| Curva de aprendizaje | Baja | Media (necesitas saber SQL) |
| Autocompletado | Excelente | Muy bueno |
| Control del SQL generado | Limitado | Total |
| Tamaño en el bundle | Mayor | Muy pequeño |
| Arranque en frío | Más lento | Más rápido |
| Compatibilidad con edge | Requiere configuración | Nativa |
| Migraciones | Muy maduras | Buenas, más manuales |
| Consultas complejas | Se cae a SQL crudo | Naturales |
| Madurez del ecosistema | Alta | Creciente |
| Introspección de base existente | Excelente | Buena |

---

### Cuándo elegir Prisma

**Tu equipo no domina SQL.** El lenguaje de consulta de Prisma es más accesible y evita errores de principiante.

**Necesitas migraciones robustas desde el día uno.** El flujo de migraciones de Prisma es de lo mejor que hay: detecta cambios, genera el SQL, mantiene el historial y avisa de operaciones destructivas.

**Vas a introspectar una base de datos existente.** `prisma db pull` genera el esquema completo desde una base ya poblada. Ahorra días.

**Tu aplicación es principalmente CRUD.** Para operaciones estándar, escribes menos y más claro.

**Valoras el ecosistema.** Prisma Studio para explorar datos, integraciones con otras herramientas, y mucha documentación y respuestas disponibles.

---

### Cuándo elegir Drizzle

**Despliegas en edge o serverless con arranques en frío frecuentes.** El tamaño reducido se nota de verdad.

**Escribes consultas complejas.** Agregaciones con ventanas, CTEs recursivas, joins de cinco tablas con condiciones. En Prisma acabas escribiendo SQL crudo y perdiendo los tipos; en Drizzle se expresan de forma natural y tipada.

```ts
// Natural en Drizzle
const ranking = await db
  .select({
    cliente: clientes.nombre,
    total: sql<number>`sum(${pedidos.total})`,
    posicion: sql<number>`rank() over (order by sum(${pedidos.total}) desc)`,
  })
  .from(clientes)
  .leftJoin(pedidos, eq(pedidos.clienteId, clientes.id))
  .groupBy(clientes.id, clientes.nombre)
```

**Quieres saber exactamente qué SQL se ejecuta.** Drizzle genera consultas predecibles. Con Prisma, a veces te sorprende el número de consultas emitidas.

**Prefieres una sola fuente de verdad en TypeScript.** Sin lenguaje de esquema aparte, sin paso de generación.

---

### El detalle de las migraciones

Es donde más se nota la diferencia práctica.

**Prisma:**
```bash
npx prisma migrate dev --name agregar_tabla_facturas
```
Compara tu esquema con la base, genera el SQL, lo aplica y actualiza el historial. Casi sin fricción.

**Drizzle:**
```bash
npx drizzle-kit generate    # Genera el SQL de la migración
npx drizzle-kit migrate     # La aplica
```
Igual de funcional, pero más conviene revisar el SQL generado antes de aplicarlo. Lo cual, siendo honestos, deberías hacer también con Prisma.

**Regla independiente del ORM:** en producción nunca apliques migraciones automáticamente durante el despliegue sin revisión. Un `DROP COLUMN` generado sin querer no se deshace.

---

### El problema de las N+1 consultas

Ambos pueden generarlo si no tienes cuidado.

**Prisma:** usa `include` o `select` en lugar de consultar en un bucle.

```ts
// Mal: N+1
const pedidos = await prisma.pedido.findMany()
for (const p of pedidos) {
  const cliente = await prisma.cliente.findUnique({ where: { id: p.clienteId } })
}

// Bien: una consulta
const pedidos = await prisma.pedido.findMany({ include: { cliente: true } })
```

**Drizzle:** al ser explícito con los joins, el problema es más visible desde el código, que es una ventaja real.

En ambos casos, activa el registro de consultas en desarrollo. Ver cuántas consultas dispara una pantalla es la forma más rápida de encontrar estos problemas.

---

### Mi recomendación práctica

**Empieza con Prisma si:** el equipo es mixto, la aplicación es mayormente CRUD, o vienes de una base de datos existente.

**Empieza con Drizzle si:** despliegas en edge, tu dominio tiene consultas analíticas, o tu equipo domina SQL y le molesta la abstracción.

**No migres solo por moda.** Cambiar de ORM en un proyecto en producción es semanas de trabajo con riesgo de regresiones y beneficio marginal. Hazlo solo si tienes un problema medido —arranque en frío, consultas imposibles de expresar— y no una preferencia estética.

---

### Preguntas frecuentes

**¿Puedo usar los dos en el mismo proyecto?**
Técnicamente sí, prácticamente no lo hagas. Dos fuentes de verdad del esquema es una fuente permanente de errores.

**¿Alguno es más seguro?**
Ambos parametrizan consultas y protegen contra inyección SQL, siempre que no construyas SQL crudo concatenando cadenas. La seguridad depende de ti, no del ORM.

**¿Y si no quiero ORM?**
Es una opción legítima. Un cliente SQL con tipos generados desde el esquema funciona bien. Pierdes ergonomía, ganas control.

---

**Escrito por Carlos Anaya Ruiz** — Desarrollador full-stack. He usado ambos en producción y sigo eligiendo según el proyecto, no por preferencia.

---

### PROMPT DE PORTADA — Artículo 030

> Dos engranajes de precisión de tamaños muy distintos girando sobre el mismo eje: uno grande, ornamentado y de estructura compleja en verde oscuro; otro pequeño, minimalista y de líneas puras en verde brillante. Vista macro con profundidad de campo extrema que desenfoca los bordes. Materiales metálicos realistas, fondo negro carbón, iluminación lateral dura.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.

---
---

# ARTÍCULO 031

```yaml
title: "Cómo optimizar Core Web Vitals en Next.js"
slug: "optimizar-core-web-vitals-nextjs"
description: "Cómo llevar LCP, CLS e INP a verde en Next.js: fuentes, imágenes, hidratación, scripts de terceros y medición con datos de campo."
author: "Carlos Anaya Ruiz"
category: "Desarrollo"
tags: ["core web vitals", "rendimiento", "next.js", "seo técnico"]
keyword_principal: "core web vitals next.js"
```

## Cómo optimizar Core Web Vitals en Next.js

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

---

**Escrito por Carlos Anaya Ruiz** — Desarrollador full-stack. Optimizo rendimiento web en sitios de producción con tráfico real.

---

### PROMPT DE PORTADA — Artículo 031

> Tres medidores circulares tridimensionales flotando a distintas profundidades escalonadas en el espacio, sus arcos llenándose progresivamente de luz verde partiendo del rojo. Estilo de instrumento físico de precisión, materiales de vidrio esmerilado y metal oscuro. Fondo negro carbón con reflejo difuso en la superficie inferior, iluminación verde terminal.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.

---
---

# ARTÍCULO 032

```yaml
title: "Expo: cómo lanzar tu app móvil desde el código que ya tienes"
slug: "expo-lanzar-app-movil"
description: "Cómo llevar tu producto web a iOS y Android con Expo: estructura compartida, EAS Build, updates OTA y qué sí necesita código nativo."
author: "Carlos Anaya Ruiz"
category: "Desarrollo"
tags: ["expo", "react native", "móvil", "eas"]
keyword_principal: "expo react native"
```

## Expo: cómo lanzar tu app móvil desde el código que ya tienes

**Expo es un conjunto de herramientas sobre React Native que elimina la mayor parte del trabajo de configuración nativa.** Si ya tienes un producto web en React, es el camino más corto a tener una app en las tiendas sin contratar dos equipos.

Lo que no es: una forma de reutilizar tu interfaz web tal cual. Compartes lógica, tipos y datos. La interfaz se rehace.

---

### Qué se comparte y qué no

| Capa | ¿Se comparte? |
|---|---|
| Tipos y contratos | Sí, completamente |
| Cliente de API y consultas | Sí |
| Lógica de negocio y validaciones | Sí |
| Gestión de estado | Sí |
| Utilidades y formateo | Sí |
| Componentes de interfaz | **No** |
| Estilos | **No** (React Native no usa CSS) |
| Navegación | Parcialmente conceptual |

**Regla realista:** entre 40% y 60% del código puede compartirse si tu arquitectura separa bien lógica de presentación. Si tu lógica vive dentro de los componentes, ese porcentaje baja mucho.

---

### Estructura en monorepo

```
mi-producto/
├── apps/
│   ├── web/              # Next.js
│   └── movil/            # Expo
└── packages/
    ├── tipos/            # Compartido
    ├── api/              # Cliente de API compartido
    ├── logica/           # Reglas de negocio compartidas
    ├── ui-web/           # Componentes web
    └── ui-movil/         # Componentes móviles
```

Los paquetes compartidos no deben importar nada específico de web ni de móvil. Si `packages/logica` importa `next/navigation`, ya no es compartible.

---

### Arranque

```bash
npx create-expo-app@latest movil
cd movil
npx expo start
```

Con la aplicación Expo Go en tu teléfono escaneas el código y ya estás viendo la app. Sin Xcode, sin Android Studio, sin cadena de compilación.

Esa velocidad de arranque es el argumento principal de Expo.

---

### Navegación basada en archivos

Expo Router usa la misma idea que el App Router de Next.js, lo cual reduce mucho la carga mental si vienes de ahí:

```
app/
├── _layout.tsx           # Layout raíz
├── index.tsx             # Pantalla inicial
├── (auth)/
│   ├── login.tsx
│   └── registro.tsx
└── (app)/
    ├── _layout.tsx       # Navegación por pestañas
    ├── inicio.tsx
    ├── perfil.tsx
    └── pedido/
        └── [id].tsx      # Ruta dinámica
```

```tsx
// app/(app)/_layout.tsx
import { Tabs } from 'expo-router'

export default function AppLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="inicio" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil' }} />
    </Tabs>
  )
}
```

---

### EAS Build: compilar sin Mac

El obstáculo clásico del desarrollo iOS era necesitar una Mac. EAS Build compila en la nube.

```bash
npm install -g eas-cli
eas login
eas build:configure

eas build --platform ios --profile preview
eas build --platform android --profile production
```

`eas.json` define los perfiles:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": { "simulator": false }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

Y para enviar a las tiendas:

```bash
eas submit --platform ios
eas submit --platform android
```

**Sigues necesitando** cuentas de desarrollador de Apple y Google, y pasar por revisión. EAS elimina la infraestructura, no los requisitos de las tiendas.

---

### Actualizaciones sin pasar por la tienda

Una de las capacidades más valiosas: puedes publicar cambios de JavaScript directamente a los dispositivos.

```bash
eas update --branch production --message "Corrección en el flujo de pago"
```

**Qué puedes actualizar así:** lógica en JavaScript, interfaz, textos, correcciones de errores, estilos.

**Qué NO puedes:** agregar módulos nativos nuevos, cambiar permisos del sistema, modificar la configuración nativa. Eso requiere compilación y envío a la tienda.

**Restricción importante:** las tiendas permiten estas actualizaciones siempre que no cambien sustancialmente el propósito de la app ni introduzcan funcionalidad que no pasó revisión. Usarlo para eludir la revisión es motivo de retiro. Úsalo para corregir y mejorar, no para lanzar productos distintos.

---

### Cuándo necesitas código nativo

Expo cubre la mayoría de las necesidades con sus módulos: cámara, notificaciones, biometría, ubicación, almacenamiento seguro, compras dentro de la app, mapas.

Necesitas más cuando requieres:
- Un SDK de un proveedor sin módulo de Expo disponible.
- Procesamiento intensivo que debe correr en nativo.
- Widgets del sistema operativo o extensiones.
- Integraciones muy específicas de hardware.

La solución no es abandonar Expo: son los **plugins de configuración**, que permiten modificar el proyecto nativo de forma declarativa manteniendo el flujo de trabajo gestionado.

---

### Errores frecuentes al empezar

**Intentar reutilizar componentes web.** No funciona. React Native no tiene `div`, ni CSS, ni DOM. Rehaz la interfaz; comparte la lógica.

**Ignorar las diferencias entre plataformas.** Los gestos, la navegación hacia atrás, las notificaciones y los permisos se comportan distinto en iOS y Android. Prueba en ambos desde el inicio, no al final.

**Probar solo en simulador.** El rendimiento y los permisos se comportan diferente en dispositivo real. Prueba en un teléfono de gama media, no en el más nuevo.

**Dejar la configuración de tiendas para el final.** Los perfiles de firma, los identificadores y las políticas de privacidad toman más tiempo del esperado. Empieza ese trámite en paralelo al desarrollo.

**No planear el modo sin conexión.** En móvil la conectividad se pierde constantemente. Decide desde el diseño qué pasa cuando no hay red.

---

### Preguntas frecuentes

**¿Expo o React Native puro?**
Expo, salvo que tengas una necesidad nativa muy específica desde el inicio. Y aun así, los plugins de configuración cubren la mayoría de esos casos.

**¿El rendimiento es suficiente?**
Para la gran mayoría de aplicaciones de negocio, sí. Para juegos o procesamiento gráfico intensivo, evalúa nativo.

**¿Cuánto tarda llevar un producto web a las tiendas?**
Con lógica ya compartible y una interfaz de complejidad media: de 6 a 12 semanas incluyendo revisión de tiendas. La revisión de Apple suele tomar días y puede requerir iteraciones.

---

**Escrito por Carlos Anaya Ruiz** — Desarrollador full-stack. Construyo aplicaciones móviles con Expo dentro de monorepos compartidos con web.

---

### PROMPT DE PORTADA — Artículo 032

> Un rectángulo de luz verde terminal desprendiéndose de una pantalla plana grande y transformándose en el aire en la silueta geométrica de un dispositivo móvil vertical, con partículas de código verde suspendidas en la transición entre ambas formas. Fondo negro carbón, iluminación posterior que recorta las siluetas, reflejo sutil en el suelo.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.
