# LOTE 04 — ARTÍCULOS COMPLETOS 021–024
**Autor:** Carlos Anaya Ruiz · Listos para publicar

---
---

# ARTÍCULO 021

```yaml
title: "Deepfakes y fraude por voz: cómo detectarlos"
slug: "deepfake-fraude-voz-como-detectar"
description: "Cómo funcionan los fraudes con deepfake de voz y video, las señales que aún los delatan y el protocolo de verificación que los bloquea."
author: "Carlos Anaya Ruiz"
category: "Ciberseguridad"
tags: ["deepfake", "fraude", "clonación de voz", "verificación de identidad"]
keyword_principal: "deepfake fraude"
```

## Deepfakes y fraude por voz: cómo detectarlos

**Con menos de un minuto de audio público se puede generar una voz clonada suficientemente convincente para engañar a un compañero de trabajo por teléfono.** Ese es el estado actual, y significa que el consejo de "verifica por voz" —que era sólido hasta hace poco— ya necesita una capa adicional.

La respuesta no es aprender a detectar deepfakes mejor. Es rediseñar la verificación para que no dependa de detectarlos.

---

### Los tres fraudes que ya están ocurriendo

**1. Llamada de un directivo pidiendo una transferencia urgente.**
Voz clonada del director o del dueño, tono apurado, instrucción confidencial. Suele ocurrir cuando la persona suplantada está de viaje —dato que a menudo se publica en redes.

**2. Videollamada con participantes falsos.**
Video generado o manipulado en tiempo real. Se usa en operaciones de mayor monto, donde una llamada de voz no bastaría para convencer.

**3. Suplantación en procesos de contratación o verificación de identidad.**
Candidatos que no son quienes dicen ser en entrevistas remotas, o suplantación en procesos de alta de servicios.

---

### Las señales que todavía delatan (y por qué no debes confiar en ellas)

**En audio:**
- Respiración ausente o en lugares antinaturales.
- Entonación plana en frases emocionales.
- Latencia extraña: pausas antes de responder a algo inesperado.
- Ruido de fondo demasiado limpio o que no cambia nunca.
- Dificultad con nombres propios poco comunes o números largos.

**En video:**
- Parpadeo irregular o ausente.
- Bordes del rostro que vibran al girar la cabeza.
- Iluminación del rostro que no coincide con la del entorno.
- Manos que no se comportan bien al pasar frente a la cara.
- Sincronización labial que se desfasa en frases rápidas.

**Y aquí va la advertencia importante:** estas señales están desapareciendo rápido. Cada una de ellas era fiable hace un año y ya no lo es del todo. **No construyas tu defensa sobre la capacidad de detección de tu gente.** Constrúyela sobre proceso.

---

### El protocolo que sí funciona

**Regla 1 — Palabra clave acordada previamente.**
Para operaciones de alto monto o instrucciones sensibles, las partes acuerdan de antemano una palabra o frase que no está escrita en ningún sistema ni se ha dicho en ninguna llamada grabada. Si la voz al otro lado no la conoce, se corta.

Es de baja tecnología y es la defensa más efectiva que existe hoy contra clonación de voz.

**Regla 2 — Verificación por canal independiente que la voz no controla.**
Confirmación desde una aplicación autenticada donde la persona real tiene que aprobar. Una voz clonada no puede aprobar en el teléfono de otra persona.

**Regla 3 — Pregunta de contexto no público.**
"¿Qué acordamos en la junta del martes sobre el proveedor?" Algo específico, reciente y que no esté en ningún correo ni documento accesible. Un atacante con la voz clonada rara vez tiene el contexto.

**Regla 4 — Doble autorización obligatoria por monto.**
Ninguna transferencia por encima de un umbral se ejecuta con una sola aprobación, sin importar quién la solicite ni con qué urgencia. Esta regla hace irrelevante la calidad del deepfake.

**Regla 5 — El tiempo como aliado.**
Toda operación no rutinaria tiene un tiempo mínimo de espera antes de ejecutarse. La urgencia es la herramienta principal del atacante; eliminar la posibilidad de actuar rápido elimina su ventaja.

---

### Cómo reducir tu superficie de exposición

**Audio y video público.** Cuanto más material haya de la voz de tus directivos, más fácil es clonarla. No significa dejar de comunicar, pero sí ser consciente: podcasts, webinars y videos corporativos son material de entrenamiento gratuito.

**Anuncios de ausencia.** Publicar que el director está en un congreso en otro país es exactamente el dato que activa este fraude.

**Organigramas públicos.** Facilitan saber a quién suplantar y a quién dirigirse.

**Datos de proveedores.** Publicar con quién trabajas facilita el fraude de cambio de datos bancarios.

---

### Qué hacer si crees que estás en una llamada falsa

1. **No confrontes.** Si dices "creo que eres un deepfake", el atacante ajusta y lo intenta con otra persona mejor preparado.
2. **Introduce fricción natural.** "Déjame tomar nota, ¿me repites el número de cuenta completo?" Los sistemas de generación tropiezan más con secuencias largas de números.
3. **Aplica la pregunta de contexto.**
4. **Corta con una excusa neutra.** "Se está cortando, te marco yo en cinco minutos." Y marcas al número que ya tenías guardado.
5. **Reporta de inmediato**, aunque no estés seguro. Un falso positivo no cuesta nada; un falso negativo cuesta una transferencia.

---

### Lo que debe cambiar en tus políticas

Revisa estos documentos y actualízalos:

- **Política de pagos:** agrega palabra clave y doble autorización obligatoria por monto. Elimina cualquier excepción por jerarquía.
- **Protocolo de verificación:** deja de decir "confirmar por teléfono" y especifica "confirmar por teléfono al número del expediente, más pregunta de contexto o palabra clave".
- **Capacitación:** incluye una sesión con ejemplos de audio generado. Escucharlos una vez cambia la percepción del riesgo de forma permanente.
- **Comunicación externa:** define qué se publica sobre viajes y ausencias de directivos.

---

### Preguntas frecuentes

**¿Existen herramientas de detección automática?**
Existen y mejoran, pero van siempre por detrás de los generadores. Úsalas como capa adicional, nunca como control principal.

**¿Esto aplica a una empresa pequeña?**
Sí, y las pequeñas suelen ser más vulnerables porque los procesos de pago son informales y la relación de confianza es directa.

**¿Sirve grabar todas las llamadas?**
Ayuda para investigación posterior y para disuadir, pero no previene. Y exige cumplir con las obligaciones de aviso y consentimiento.

---

**Escrito por Carlos Anaya Ruiz** — Consultor tecnológico. Diseño controles de verificación que resisten cuando la detección humana falla.

---

### PROMPT DE PORTADA — Artículo 021

> Una onda de audio tridimensional que en su recorrido de izquierda a derecha se va corrompiendo: empieza limpia, ordenada y de color cian, se fragmenta progresivamente en glitch rojo y termina disolviéndose en partículas dispersas. Sin ningún rostro ni figura humana. Fondo negro absoluto, iluminación de estudio, reflejo tenue bajo la onda.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.

---
---

# ARTÍCULO 022

```yaml
title: "Plan de respuesta a incidentes: plantilla y pasos"
slug: "plan-de-respuesta-a-incidentes-plantilla"
description: "Plantilla completa de plan de respuesta a incidentes: las 6 fases, quién decide qué, y el guion de los primeros 60 minutos."
author: "Carlos Anaya Ruiz"
category: "Ciberseguridad"
tags: ["respuesta a incidentes", "continuidad", "gestión de crisis", "seguridad"]
keyword_principal: "plan de respuesta a incidentes"
```

## Plan de respuesta a incidentes: plantilla y pasos

**Un plan de respuesta a incidentes existe porque nadie improvisa bien a las 2 de la mañana.** Su función no es predecir qué va a pasar: es eliminar las decisiones que se tomarían mal bajo presión.

Debe caber en una hoja, estar impreso, y ser accesible sin acceso a la red. Si tu plan vive en una carpeta compartida del servidor que se cayó, no tienes plan.

---

### Las 6 fases

**1. Preparación** (antes de que pase nada)
**2. Detección e identificación**
**3. Contención**
**4. Erradicación**
**5. Recuperación**
**6. Lecciones aprendidas**

La mayoría de las empresas solo tiene la 5, improvisada.

---

### Fase 1 — Preparación

Lo que debe existir **antes**:

- **Lista de contactos impresa.** Interna (dirección, sistemas, legal, comunicación) y externa (proveedor de seguridad, aseguradora, asesor legal, contactos de banco). Con teléfonos personales, porque el correo corporativo puede estar comprometido.
- **Canal de comunicación alterno.** Un grupo en una aplicación de mensajería fuera de la infraestructura corporativa. Si el atacante está leyendo tu correo, coordinar la respuesta por correo es entregarle el plan.
- **Definición de roles.** Quién decide desconectar. Quién habla con clientes. Quién documenta. Quién autoriza el gasto de emergencia.
- **Umbrales de severidad** definidos con antelación.
- **Respaldos probados** y documentación de restauración accesible fuera de línea.

---

### Fase 2 — Detección e identificación

**Objetivo: responder tres preguntas en menos de 30 minutos.**

1. ¿Qué está pasando?
2. ¿Qué sistemas están afectados?
3. ¿Sigue ocurriendo ahora mismo?

**Niveles de severidad sugeridos:**

| Nivel | Definición | Quién se activa |
|---|---|---|
| **S1 — Crítico** | Operación detenida, datos comprometidos, o cifrado en curso | Todos, incluida dirección |
| **S2 — Alto** | Cuenta comprometida, acceso no autorizado confirmado | Sistemas + responsable de área |
| **S3 — Medio** | Actividad sospechosa sin impacto confirmado | Sistemas |
| **S4 — Bajo** | Intento fallido, correo reportado | Registro y seguimiento |

Definir esto de antemano evita la discusión de "¿esto es grave?" en el peor momento.

---

### Fase 3 — Contención

**Regla de oro: aísla, no apagues.** Desconectar de la red preserva la evidencia en memoria; apagar la destruye, y esa evidencia suele ser la que dice cómo entraron.

**Contención inmediata (primeros 60 minutos):**
1. Aísla los equipos afectados de la red.
2. Corta el acceso remoto de toda la organización si hay duda del alcance.
3. Aísla los respaldos para que no sean alcanzables.
4. Revoca sesiones activas y restablece credenciales de cuentas privilegiadas desde un equipo limpio.
5. Revisa reglas de reenvío automático en el correo de las cuentas implicadas.

**Contención a corto plazo (primeras 24 horas):**
- Segmenta la red para frenar el movimiento lateral.
- Aplica bloqueos en el perímetro sobre indicadores identificados.
- Levanta sistemas críticos en entorno limpio si es viable.

---

### Fase 4 — Erradicación

No se pasa a esta fase hasta entender **cómo entraron**. Restaurar sin cerrar la vía de entrada es reinfectarse en días.

- Identifica el punto de acceso inicial y ciérralo.
- Elimina persistencia: cuentas creadas, tareas programadas, servicios, claves de acceso añadidas.
- Reconstruye desde cero los sistemas comprometidos. Limpiar un sistema comprometido nunca da la misma certeza que reconstruirlo.
- Rota todos los secretos: contraseñas, llaves de API, certificados, tokens.

---

### Fase 5 — Recuperación

- Restaura por orden de criticidad, no por orden de facilidad.
- Verifica integridad antes de reconectar cada sistema.
- Monitoreo reforzado durante al menos 30 días. Los reingresos ocurren.
- Comunicación a clientes y terceros según lo que corresponda legal y contractualmente.

**Sobre obligaciones legales:** si hubo datos personales comprometidos, hay deberes de notificación que atender y plazos que corren. Esto se evalúa desde la primera hora con asesoría legal, no al final.

---

### Fase 6 — Lecciones aprendidas

Reunión dentro de las dos semanas siguientes. Formato de una página:

1. **Línea de tiempo.** Qué pasó y cuándo, con horas.
2. **Cómo entraron.** Causa raíz, sin señalar personas.
3. **Qué funcionó** de la respuesta.
4. **Qué falló** y por qué.
5. **Acciones concretas** con responsable y fecha.

**Sin culpar a individuos.** El objetivo es corregir el sistema. En cuanto la reunión se convierte en búsqueda de culpables, la gente deja de reportar y pierdes tu capacidad de detección temprana.

---

### El guion de los primeros 60 minutos

Esto es lo que va impreso:

```
MINUTO 0-5
□ Quien detecta llama al responsable de sistemas (tel: ____)
□ Se abre el canal alterno de comunicación
□ Se anota la hora exacta de detección

MINUTO 5-15
□ Aislar equipos afectados de la red (NO apagar)
□ Determinar nivel de severidad
□ Si es S1: notificar a dirección (tel: ____)

MINUTO 15-30
□ Cortar acceso remoto organizacional
□ Aislar respaldos
□ Restablecer credenciales privilegiadas desde equipo limpio
□ Iniciar bitácora con hora de cada acción

MINUTO 30-60
□ Determinar alcance: qué sistemas, qué datos
□ Contactar proveedor externo de respuesta (tel: ____)
□ Notificar a asesor legal si hay datos personales (tel: ____)
□ Definir mensaje interno: qué se le dice al equipo
□ NO comunicar externamente aún

NUNCA
✗ Apagar equipos afectados
✗ Coordinar por el correo posiblemente comprometido
✗ Pagar o negociar sin asesoría
✗ Borrar registros o evidencia
✗ Comunicar externamente sin revisión legal
```

---

### Preguntas frecuentes

**¿Cada cuánto se prueba el plan?**
Un simulacro de mesa cada seis meses, de 90 minutos. Se plantea un escenario y el equipo recorre las decisiones. Siempre aparecen huecos.

**¿Necesito contratar un proveedor de respuesta a incidentes?**
Tener uno identificado y con contrato marco firmado **antes** del incidente ahorra días. Negociar un contrato mientras estás cifrado es la peor posición posible.

**¿Quién debe liderar la respuesta?**
Alguien con autoridad para tomar decisiones costosas —como detener la operación— y capacidad técnica para entender lo que pasa. Si esas dos cosas están en personas distintas, defínelas como pareja de mando desde ahora.

---

**Escrito por Carlos Anaya Ruiz** — Consultor tecnológico. Diseño planes de continuidad y respuesta para empresas multi-sucursal.

---

### PROMPT DE PORTADA — Artículo 022

> Una sala de control abstracta vista desde arriba: seis paneles hexagonales de luz cian dispuestos en secuencia circular, uno de ellos pulsando en rojo alerta e iluminando los adyacentes. Estilo isométrico limpio, sin sillas, sin pantallas, sin personas. Profundidad con niebla oscura difuminando los bordes del encuadre. Fondo negro carbón.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.

---
---

# ARTÍCULO 023

```yaml
title: "Next.js App Router: guía completa"
slug: "nextjs-app-router-guia-completa"
description: "Guía completa del App Router de Next.js: layouts, streaming, caching, server actions y cuándo el Pages Router sigue siendo mejor idea."
author: "Carlos Anaya Ruiz"
category: "Desarrollo"
tags: ["next.js", "react", "app router", "server components"]
keyword_principal: "next.js app router"
tipo: "pillar"
```

## Next.js App Router: guía completa

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

---

**Escrito por Carlos Anaya Ruiz** — Desarrollador full-stack. Construyo productos en producción con Next.js App Router.

---

### PROMPT DE PORTADA — Artículo 023

> Un árbol de rutas tridimensional creciendo hacia arriba desde una raíz luminosa en la base, con ramas que se subdividen en capas anidadas de placas verdes translúcidas superpuestas. Estilo arquitectónico limpio tipo blueprint volumétrico. Fondo negro carbón, luz verde terminal emergiendo desde la raíz e iluminando las capas superiores, espacio negativo a la izquierda.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.

---
---

# ARTÍCULO 024

```yaml
title: "Supabase vs Firebase: comparativa técnica"
slug: "supabase-vs-firebase-comparativa"
description: "Supabase vs Firebase comparados en 9 dimensiones: base de datos, auth, precio a escala, portabilidad y vendor lock-in."
author: "Carlos Anaya Ruiz"
category: "Desarrollo"
tags: ["supabase", "firebase", "backend", "postgres"]
keyword_principal: "supabase vs firebase"
```

## Supabase vs Firebase: comparativa técnica

**La decisión se reduce a una pregunta: ¿tus datos son relacionales o son documentos?** Todo lo demás —autenticación, almacenamiento, funciones— es comparable. El modelo de datos es la diferencia estructural, y es la que no puedes cambiar después sin reescribir.

---

### La comparación por dimensión

| Dimensión | Supabase | Firebase |
|---|---|---|
| Base de datos | PostgreSQL relacional | Firestore, documentos NoSQL |
| Consultas | SQL completo, joins, agregaciones | Consultas limitadas, sin joins |
| Tiempo real | Sí, sobre cambios de Postgres | Sí, nativo y muy maduro |
| Autenticación | Completa, con proveedores sociales | Completa, muy madura |
| Almacenamiento | Sí, con políticas de acceso | Sí |
| Funciones | Edge Functions (Deno) | Cloud Functions (Node) |
| Modelo de precio | Por recursos, predecible | Por operaciones, variable |
| Autohospedaje | Sí, todo el stack | No |
| Portabilidad | Alta, es Postgres estándar | Baja |

---

### Dónde gana Supabase

**Es Postgres de verdad.** No una capa que lo imita: la base de datos completa, con extensiones, funciones, triggers, vistas materializadas y todo el ecosistema que existe alrededor de Postgres desde hace treinta años.

Esto tiene consecuencias prácticas grandes:

**Joins y agregaciones sin dolor.** Un reporte que en Firestore requiere desnormalizar y mantener contadores sincronizados, en Postgres es una consulta.

```sql
-- Trivial en Postgres, complicado en Firestore
SELECT c.nombre, COUNT(p.id) AS pedidos, SUM(p.total) AS ingresos
FROM clientes c
LEFT JOIN pedidos p ON p.cliente_id = c.id
WHERE p.creado_en >= now() - interval '30 days'
GROUP BY c.nombre
ORDER BY ingresos DESC;
```

**Seguridad en la base de datos con RLS.** Las políticas de acceso se escriben en el motor, no en cada consulta de tu aplicación. Es más difícil dejar un hueco.

```sql
CREATE POLICY "cada quien ve lo suyo"
ON pedidos FOR SELECT
USING (auth.uid() = usuario_id);
```

**Portabilidad real.** Si te vas, te llevas un volcado de Postgres y lo montas donde quieras. Ese solo hecho reduce enormemente el riesgo estratégico.

**pgvector integrado.** Si vas a construir algo con IA y RAG, tener búsqueda vectorial en la misma base que tus datos relacionales elimina un componente completo de tu arquitectura.

---

### Dónde gana Firebase

**Madurez y estabilidad.** Lleva mucho más tiempo en producción a gran escala. Menos sorpresas operativas.

**Tiempo real y sincronización offline.** Para aplicaciones móviles que deben funcionar sin conexión y sincronizar después, la implementación de Firebase sigue siendo superior y más probada.

**Ecosistema móvil.** SDK excelentes, integración con analítica, notificaciones push, pruebas y distribución. Si tu producto es una app móvil, hay valor real en tener todo eso junto.

**Escalado sin pensar.** Firestore escala horizontalmente sin que tengas que preocuparte. Postgres escala vertical y con réplicas de lectura, lo cual requiere más atención a partir de cierto punto.

---

### El punto que decide la mayoría de los casos

**¿Tus datos tienen relaciones?**

Si tu modelo tiene clientes con pedidos, pedidos con líneas, líneas con productos, productos con categorías, y necesitas consultarlos combinados: **Postgres**. Modelar eso en documentos te obliga a desnormalizar, duplicar y mantener consistencia a mano. Funciona, pero es trabajo permanente que crece con el producto.

Si tus datos son colecciones mayormente independientes, con acceso por identificador y poca necesidad de consultas combinadas: **Firestore** es cómodo y rápido.

---

### Costos: el detalle que sorprende

**Firebase cobra por operación.** Lecturas, escrituras y borrados. Una pantalla mal diseñada que lee una colección completa en cada carga puede generar facturas desproporcionadas. Es predecible solo si controlas cuidadosamente cómo consultas.

**Supabase cobra por recursos.** Cómputo, almacenamiento, transferencia. Más predecible mes a mes, pero requiere que dimensiones la instancia y la vigiles.

En proyectos pequeños ambos son baratos. La divergencia aparece con volumen: aplicaciones con muchas lecturas por sesión suelen salir más caras en Firestore; aplicaciones con datos pesados y pocas consultas pueden salir más caras en Supabase.

---

### Lo que hay que vigilar en Supabase

Por honestidad, estos son los puntos de fricción reales:

- **Las políticas RLS mal escritas filtran datos entre clientes.** Es el error más grave y más común. Requiere pruebas explícitas.
- **El pool de conexiones importa.** En entornos serverless necesitas usar el conector adecuado o agotarás conexiones.
- **La instancia se dimensiona a mano.** No escala sola.
- **Las Edge Functions corren en Deno**, lo cual limita algunas bibliotecas de Node.

---

### Preguntas frecuentes

**¿Se puede migrar de Firebase a Supabase?**
Sí, pero implica rediseñar el modelo de datos de documentos a relacional. No es una exportación directa. Presupuéstalo como un proyecto.

**¿Supabase sirve para aplicaciones grandes?**
Sí. Es Postgres, que opera a escalas enormes. El límite está en tu diseño de datos e índices, no en la plataforma.

**¿Cuál elegir si aún no sé cómo será mi producto?**
Postgres. Es más fácil imponer un modelo flexible sobre una base relacional (con columnas JSON) que imponer relaciones sobre una base de documentos.

---

**Escrito por Carlos Anaya Ruiz** — Desarrollador full-stack. Construyo productos en producción sobre Supabase y Postgres.

---

### PROMPT DE PORTADA — Artículo 024

> Dos estructuras de datos enfrentadas en el mismo encuadre: a la izquierda un cristal relacional con estructura hexagonal perfectamente ordenada e interconectada, en verde esmeralda; a la derecha una nube de nodos dispersos e independientes flotando en ámbar. Separadas por una línea vertical de luz. Fondo negro carbón, simetría tensa, iluminación bicromática.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.
