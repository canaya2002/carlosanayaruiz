---
n: 30
title: "Prisma vs Drizzle: qué ORM elegir"
slug: "prisma-vs-drizzle-orm"
description: "Prisma vs Drizzle comparados en rendimiento, tamaño de bundle, migraciones, edge runtime y experiencia de desarrollo real."
category: "Desarrollo"
keyword: "prisma vs drizzle"
tipo: "satelite"
tags: ["prisma","drizzle","orm","typescript"]
---


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
