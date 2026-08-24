---
n: 28
title: "Row Level Security en Supabase: guía práctica"
slug: "row-level-security-supabase-guia"
description: "Row Level Security en Supabase explicado con políticas reales: multi-tenant, roles, y los 6 errores de RLS que filtran datos entre clientes."
category: "Desarrollo"
keyword: "row level security supabase"
tipo: "satelite"
tags: ["supabase","postgres","rls","seguridad de datos"]
---


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
