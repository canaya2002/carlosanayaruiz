---
n: 27
title: "TypeScript strict mode: por qué activarlo hoy"
slug: "typescript-strict-mode-por-que-activarlo"
description: "Qué activa exactamente el strict mode de TypeScript, cuántos bugs previene y cómo migrar un proyecto grande sin bloquear al equipo."
category: "Desarrollo"
keyword: "typescript strict mode"
tipo: "satelite"
tags: ["typescript","calidad de código","tipos","buenas prácticas"]
---


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
