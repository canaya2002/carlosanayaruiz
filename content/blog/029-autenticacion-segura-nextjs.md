---
n: 29
title: "Autenticación segura en Next.js: arquitectura completa"
slug: "autenticacion-segura-nextjs"
description: "Cómo montar autenticación en Next.js con cookies httpOnly, middleware y refresh tokens. Incluye los errores que dejan sesiones secuestrables."
category: "Desarrollo"
keyword: "autenticación next.js"
tipo: "satelite"
tags: ["next.js","autenticación","seguridad","sesiones"]
---


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
