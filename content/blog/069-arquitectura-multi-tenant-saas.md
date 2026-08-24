---
n: 69
title: "Arquitectura multi-tenant: cuál elegir"
slug: "arquitectura-multi-tenant-saas"
description: "Las 3 arquitecturas multi-tenant comparadas en aislamiento, costo y complejidad operativa, con la que conviene según tu tipo de cliente."
category: "SaaS"
keyword: "arquitectura multi tenant"
tipo: "satelite"
tags: ["multi-tenant","arquitectura","saas","base de datos"]
---


**Multi-tenant significa que varios clientes comparten la misma instancia de tu aplicación.** La decisión de cuánto comparten —y dónde se traza la frontera de aislamiento— determina tu costo, tu complejidad operativa y tu capacidad de vender a clientes con requisitos estrictos.

Y es una decisión difícil de cambiar después.

---

### Las tres arquitecturas

**1. Base de datos compartida, esquema compartido.**
Todos los clientes en las mismas tablas, separados por una columna de identificador de organización.

**2. Base de datos compartida, esquema por cliente.**
Una instancia de base de datos, pero cada cliente tiene su propio esquema con sus propias tablas.

**3. Base de datos por cliente.**
Cada cliente tiene su propia base de datos, o incluso su propia infraestructura completa.

---

### La comparación

| Dimensión | Esquema compartido | Esquema por cliente | Base por cliente |
|---|---|---|---|
| Aislamiento de datos | Lógico | Fuerte | Máximo |
| Costo por cliente | El más bajo | Bajo-medio | Alto |
| Complejidad de migraciones | Baja | Media | Alta |
| Consultas entre clientes | Trivial | Complicada | Muy complicada |
| Riesgo de fuga entre clientes | **Alto si hay error** | Bajo | Casi nulo |
| Restaurar un solo cliente | Difícil | Media | Trivial |
| Límite práctico de clientes | Miles | Cientos | Decenas o cientos |
| Personalización por cliente | Difícil | Posible | Total |

---

### Esquema compartido: la opción por defecto

**Cuándo elegirla:** productos con muchos clientes de tamaño pequeño y mediano, sin requisitos regulatorios de aislamiento físico. Es lo correcto para la mayoría de los SaaS.

**Ventaja decisiva:** el costo por cliente tiende a cero. Un cliente adicional es una fila más.

**Riesgo decisivo:** una consulta sin el filtro correcto expone datos de un cliente a otro. Es el incidente más grave que puede tener un SaaS multi-tenant, y ha terminado con empresas.

**Cómo mitigarlo correctamente:** no confíes en que cada consulta incluya el filtro. Mueve la decisión a la base de datos con seguridad a nivel de fila.

```sql
ALTER TABLE proyectos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "aislamiento por organización"
ON proyectos
USING (organizacion_id IN (SELECT mis_organizaciones()));
```

Con eso, aunque un desarrollador olvide el `WHERE`, la base de datos filtra. Es la diferencia entre depender de la disciplina del equipo y depender del motor.

**Y prueba el aislamiento explícitamente.** Toda tabla nueva necesita una prueba automatizada que confirme que el cliente A no ve datos del cliente B. Es la prueba de seguridad con mejor retorno que puedes escribir.

---

### Esquema por cliente: el punto medio

**Cuándo elegirla:** clientes de tamaño medio-grande, número moderado (decenas a bajos cientos), necesidad de aislamiento demostrable sin el costo de infraestructura separada.

**Ventajas:**
- Aislamiento real: un error de consulta no puede cruzar esquemas
- Restaurar un cliente concreto es factible
- Permite variaciones de estructura por cliente si es necesario

**Costos:**
- Las migraciones se ejecutan N veces. Con 200 esquemas, una migración es un proceso, no un comando.
- El pool de conexiones se complica: hay que cambiar de esquema por petición.
- Las consultas agregadas para tus propios reportes internos requieren recorrer todos los esquemas.

**El punto de dolor real** es la migración. Necesitas un proceso robusto que aplique cambios a todos los esquemas, maneje fallos parciales y sea reintentable.

---

### Base por cliente: aislamiento máximo

**Cuándo elegirla:** pocos clientes grandes, requisitos regulatorios de aislamiento, o exigencia contractual de residencia de datos por cliente.

**Ventajas:**
- Aislamiento máximo, fácil de demostrar en una auditoría
- Un cliente ruidoso no afecta a los demás
- Se puede alojar cada cliente en la región que exija
- Restaurar o exportar un cliente es trivial

**Costos:**
- Costo de infraestructura por cliente, alto
- Operación multiplicada: monitoreo, respaldos, actualizaciones
- No viable con precios bajos

**Regla práctica:** si tu precio por cliente no llega a varios miles de pesos mensuales, esta arquitectura no se sostiene económicamente.

---

### El modelo híbrido

Es lo que hacen muchos productos maduros y suele ser la respuesta correcta a mediano plazo:

- **Clientes pequeños y medianos** en esquema compartido con seguridad a nivel de fila.
- **Clientes empresariales** que lo exigen y lo pagan, en base de datos dedicada.

Requiere que tu aplicación pueda resolver la conexión según el cliente:

```ts
async function obtenerConexion(organizacionId: string) {
  const org = await registro.obtener(organizacionId)

  return org.baseDatosDedicada
    ? poolDedicado(org.cadenaConexion)
    : poolCompartido()
}
```

La clave es que esa lógica esté centralizada desde el inicio, aunque al principio siempre devuelva el pool compartido. Añadir el modelo dedicado después es fácil si la abstracción existe; muy caro si hay que introducirla.

---

### Decisiones que hay que tomar desde el día uno

Estas son difíciles de cambiar después:

**1. Identificador de organización en toda tabla de datos de cliente.** Aunque uses esquema separado. Facilita cualquier migración futura.

**2. Nunca confíes en el identificador enviado por el cliente.** Se deriva siempre de la sesión autenticada.

**3. Un usuario puede pertenecer a varias organizaciones.** Suena a caso raro y ocurre constantemente: consultores, agencias, holdings. Modelarlo después es doloroso.

**4. Identificadores globalmente únicos.** Usa UUID en lugar de enteros autoincrementales. Facilita mover datos entre bases y evita que se pueda enumerar tu base de clientes.

**5. Separación entre datos de plataforma y datos de cliente.** Tu tabla de organizaciones, planes y facturación no es dato de cliente. Manténla separada conceptualmente.

---

### Los errores que causan incidentes

**Filtrar solo en la capa de aplicación.** Un endpoint nuevo sin el filtro y tienes fuga.

**Usar la llave de servicio en el cliente.** Si tu aplicación frontend tiene una credencial que omite las políticas de seguridad, no tienes aislamiento.

**Cachés sin clave de organización.** Un caché compartido cuya clave no incluye el identificador de organización sirve datos de un cliente a otro. Es un error sutil y grave.

**Trabajos en background sin contexto de cliente.** Un proceso programado que procesa "todos los pedidos" sin filtrar puede cruzar datos.

**Archivos sin aislamiento.** Si guardas documentos en almacenamiento de objetos, la ruta debe incluir el identificador de organización y los permisos deben validarse. El aislamiento de la base de datos no protege los archivos.

---

### Preguntas frecuentes

**¿Puedo migrar de esquema compartido a base por cliente después?**
Sí, y es el camino habitual. Por eso conviene tener el identificador de organización en todo desde el inicio: la extracción de un cliente se vuelve una consulta.

**¿Cuántos clientes aguanta el esquema compartido?**
Miles, con índices adecuados sobre la columna de organización. El límite suele ser el volumen de datos, no el número de clientes.

**¿Cómo demuestro aislamiento a un cliente que lo exige?**
Documenta la arquitectura, muestra las políticas de seguridad y las pruebas automatizadas de acceso cruzado, y considera una auditoría externa si el contrato lo justifica.
